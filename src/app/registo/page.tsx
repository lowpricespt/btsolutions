"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslations } from "next-intl"
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
import { Checkbox } from "@/components/ui/checkbox"

export default function RegistoPage() {
  const router = useRouter()
  const t = useTranslations("Registo")
  const [erro, setErro] = useState<string | null>(null)
  const [aEnviar, setAEnviar] = useState(false)
  const [emailPorConfirmar, setEmailPorConfirmar] = useState(false)

  const schema = z
    .object({
      nome: z.string().min(2, t("erros.nome")),
      email: z.string().min(1, t("erros.email")).email(t("erros.emailInvalido")),
      telefone: z.string().min(9, t("erros.telefone")),
      morada: z.string().min(3, t("erros.morada")),
      codigo_postal: z.string().min(1, t("erros.codigoPostal")),
      distrito: z.string().min(1, t("erros.distrito")),
      nif: z.string().min(1, t("erros.nif")),
      password: z.string().min(6, t("erros.password")),
      confirmarPassword: z.string(),
      aceitaPrivacidade: z.literal(true, {
        message: t("erros.aceitaPrivacidade"),
      }),
    })
    .refine((v) => v.password === v.confirmarPassword, {
      message: t("erros.passwordDiferente"),
      path: ["confirmarPassword"],
    })
    .refine((v) => CODIGO_POSTAL_REGEX.test(v.codigo_postal), {
      message: t("erros.codigoPostalFormato"),
      path: ["codigo_postal"],
    })
    .refine((v) => validarNIF(v.nif), {
      message: t("erros.nifInvalido"),
      path: ["nif"],
    })

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
      aceitaPrivacidade: false as unknown as true,
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
      setErro(error.message === "User already registered" ? t("erros.contaExistente") : error.message)
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
      <AuthShell title={t("confirmaEmailTitulo")} description="">
        <div className="flex flex-col items-center gap-3 text-center text-sm text-muted-foreground">
          <MailCheck className="h-10 w-10 text-domain-blue" />
          <p>{t("confirmaEmailTexto")}</p>
          <Link href="/login" className="font-medium text-domain-blue hover:underline">
            {t("voltarLogin")}
          </Link>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title={t("titulo")}
      description={t("descricao")}
      footer={
        <>
          {t("jaTensConta")}{" "}
          <Link href="/login" className="font-medium text-domain-blue hover:underline">
            {t("entrar")}
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
                  <FormLabel>{t("nome")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("nomePlaceholder")} autoComplete="name" {...field} />
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
                  <FormLabel>{t("email")}</FormLabel>
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
                  <FormLabel>{t("telefone")}</FormLabel>
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
              <h2 className="text-sm font-semibold text-muted-foreground">{t("moradaFaturacao")}</h2>
              <FormDescription>{t("moradaFaturacaoDescricao")}</FormDescription>
            </div>
            <FormField
              control={form.control}
              name="morada"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("morada")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("moradaPlaceholder")} autoComplete="street-address" {...field} />
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
                    <FormLabel>{t("codigoPostal")}</FormLabel>
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
                    <FormLabel>{t("distrito")}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t("escolheDistrito")}>
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
                  <FormLabel>{t("nif")}</FormLabel>
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
                  <FormLabel>{t("password")}</FormLabel>
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
                  <FormLabel>{t("confirmarPassword")}</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="aceitaPrivacidade"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start gap-2.5">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked === true)}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal">
                    {t("aceito")}{" "}
                    <Link href="/privacidade" className="font-medium underline hover:text-foreground" target="_blank">
                      {t("politicaPrivacidade")}
                    </Link>
                    .
                  </FormLabel>
                  <FormMessage />
                </div>
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
            {t("botao")}
          </Button>
        </form>
      </Form>
    </AuthShell>
  )
}
