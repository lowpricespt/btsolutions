"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, MailCheck } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { AuthShell } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const schema = z
  .object({
    nome: z.string().min(2, "Indica o teu nome"),
    email: z.string().min(1, "Indica o email").email("Email inválido"),
    telefone: z.string().optional(),
    password: z.string().min(6, "Mínimo de 6 caracteres"),
    confirmarPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmarPassword, {
    message: "As palavras-passe não coincidem",
    path: ["confirmarPassword"],
  })

export default function RegistoPage() {
  const router = useRouter()
  const [erro, setErro] = useState<string | null>(null)
  const [aEnviar, setAEnviar] = useState(false)
  const [emailPorConfirmar, setEmailPorConfirmar] = useState(false)

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { nome: "", email: "", telefone: "", password: "", confirmarPassword: "" },
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

    if (values.telefone && data.user) {
      await supabase
        .from("utilizadores")
        .update({ telefone: values.telefone })
        .eq("id", data.user.id)
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <FormLabel>Telefone (opcional)</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="9xxxxxxxx" autoComplete="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
