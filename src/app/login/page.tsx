"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { ROTA_POR_PERFIL } from "@/lib/auth"
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

export default function LoginPage() {
  const router = useRouter()
  const t = useTranslations("Login")
  const [erro, setErro] = useState<string | null>(null)
  const [aEnviar, setAEnviar] = useState(false)

  const schema = z.object({
    email: z.string().min(1, t("erroEmail")).email(t("erroEmailInvalido")),
    password: z.string().min(1, t("erroPassword")),
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(values: z.infer<typeof schema>) {
    setErro(null)
    setAEnviar(true)
    const supabase = createClient()

    const { data, error } = await supabase.auth.signInWithPassword(values)

    if (error) {
      setErro(error.message === "Invalid login credentials" ? t("erroCredenciais") : error.message)
      setAEnviar(false)
      return
    }

    const { data: perfil } = await supabase
      .from("utilizadores")
      .select("tipo_utilizador")
      .eq("id", data.user.id)
      .single()

    router.push(perfil ? ROTA_POR_PERFIL[perfil.tipo_utilizador] : "/")
    router.refresh()
  }

  return (
    <AuthShell
      title={t("titulo")}
      description={t("descricao")}
      footer={
        <>
          {t("semConta")}{" "}
          <Link href="/registo" className="font-medium text-domain-blue hover:underline">
            {t("criarConta")}
          </Link>
        </>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("password")}</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="current-password" {...field} />
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
            {t("botao")}
          </Button>
        </form>
      </Form>
    </AuthShell>
  )
}
