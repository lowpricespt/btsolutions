"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, MailCheck } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { CODIGO_POSTAL_REGEX, validarNIF } from "@/lib/validacao"
import { DISTRITOS } from "@/lib/distritos"
import { AuthShell } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"

const schema = z
  .object({
    nome: z.string().min(2, "Indica o teu nome"),
    email: z.string().min(1, "Indica o email").email("Email inválido"),
    telefone: z.string().min(9, "Indica um telefone válido"),
    morada: z.string().min(3, "Indica a tua morada"),
    codigo_postal: z.string().min(1, "Indica o código postal"),
    distrito: z.string().min(1, "Escolhe o distrito"),
    nif: z.string().min(1, "Indica o teu NIF"),
    password: z.string().min(6, "Mínimo de 6 caracteres"),
    confirmarPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmarPassword, {
    message: "As palavras-passe não coincidem",
    path: ["confirmarPassword"],
  })
  .refine((v) => CODIGO_POSTAL_REGEX.test(v.codigo_postal), {
    message: "Formato inválido — usa 0000-000",
    path: ["codigo_postal"],
  })
  .refine((v) => validarNIF(v.nif), {
    message: "NIF inválido",
    path: ["nif"],
  })

export default function RegistoPage() {
  const router = useRouter()
  const [erro, setErro] = useState<string | null>(null)
  const [aEnviar, setAEnviar] = useState(false)
  const [emailPorConfirmar, setEmailPorConfirmar] = useState(false)

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      morada: "",
      codigo_postal: "",
      distrito: "",
      nif: "",
      password: "",
      confirmarPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof schema>) {
    setErro(null)
    setAEnviar(true)
    const supabase = createClient()

    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          nome: values.nome,
          tipo_utilizador: "cliente",
        },
      },
    })

    if (error) {
      setErro(
        error.message === "User already registered"
          ? "Já existe uma conta com este email."
          : error.message
      )
      setAEnviar(false)
      return
    }

    if (data.user) {
      const { error: erroUtilizador } = await supabase
        .from("utilizadores")
        .update({
          telefone: values.telefone || null,
          morada: values.morada || null,
          codigo_postal: values.codigo_postal || null,
          localidade: values.distrito || null,
        })
        .eq("id", data.user.id)

      if (erroUtilizador) {
        console.error("Não foi possível guardar os dados de contacto:", erroUtilizador.message)
      }

      if (values.nif) {
        const { error: erroCliente } = await supabase
          .from("clientes")
          .update({ nif: values.nif })
          .eq("id", data.user.id)

        if (erroCliente) {
          console.error("Não foi possível guardar o NIF:", erroCliente.message)
        }
      }
    }

    if (!data.session) {
      // confirmação de email ativa no projeto Supabase
      setEmailPorConfirmar(true)
      setAEnviar(false)
      return
    }

    router.push("/cliente")
    router.refresh()
  }

  if (emailPorConfirmar) {
    return (
      <AuthShell title="Confirma o teu email" description="">
        <div className="flex flex-col items-center gap-3 text-center text-sm text-muted-foreground">
          <MailCheck className="h-10 w-10 text-domain-blue" />
          <p>
            Enviámos um link de confirmação para o teu email. Confirma a conta
            para poderes entrar.
          </p>
          <Link href="/login" className="font-medium text-domain-blue hover:underline">
            Voltar ao login
          </Link>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Criar conta"
      description="Regista-te como cliente BTS"
      footer={
        <>
          Já tens conta?{" "}
          <Link href="/login" className="font-medium text-domain-blue hover:underline">
            Entrar
          </Link>
        </>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="O teu nome" autoComplete="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="tu@exemplo.pt" autoComplete="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="9xxxxxxxx" autoComplete="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground">Morada e faturação</h2>
              <FormDescription>Precisamos destes dados para agendar visitas e emitir faturas.</FormDescription>
            </div>
            <FormField
              control={form.control}
              name="morada"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Morada</FormLabel>
                  <FormControl>
                    <Input placeholder="Rua, número, andar" autoComplete="street-address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="codigo_postal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código postal</FormLabel>
                    <FormControl>
                      <Input placeholder="0000-000" autoComplete="postal-code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="distrito"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distrito</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Escolhe o distrito">
                            {(value: string | null) => value || ""}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DISTRITOS.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="nif"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIF</FormLabel>
                  <FormControl>
                    <Input placeholder="000000000" inputMode="numeric" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Palavra-passe</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmarPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar palavra-passe</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {erro && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
              {erro}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={aEnviar}>
            {aEnviar && <Loader2 className="h-4 w-4 animate-spin" />}
            Criar conta
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Ao criar conta, aceitas a nossa{" "}
            <Link href="/privacidade" className="font-medium underline hover:text-foreground">
              Política de Privacidade
            </Link>
            .
          </p>
        </form>
      </Form>
    </AuthShell>
  )
}
