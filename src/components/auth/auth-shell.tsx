"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import {
  ShieldCheck,
  Clock,
  BadgeEuro,
  Star,
  Zap,
  Hammer,
  Wifi,
} from "lucide-react"
import { Logo } from "@/components/brand/logo"
import { LanguageSwitcher } from "@/components/language-switcher"

const VANTAGENS_ICONES = [Clock, ShieldCheck, BadgeEuro]

export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string
  description: string
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  const t = useTranslations("Auth")
  const vantagens = t.raw("vantagens") as string[]

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Painel de marca — só em ecrãs largos */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-brand-navy p-10 text-brand-navy-foreground lg:flex">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-brand-teal/20 blur-3xl" />
        <div className="pointer-events-none absolute right-10 top-1/3 text-white/10">
          <Zap className="h-20 w-20" />
        </div>
        <div className="pointer-events-none absolute bottom-20 right-24 text-white/10">
          <Hammer className="h-16 w-16" />
        </div>
        <div className="pointer-events-none absolute bottom-40 left-16 text-white/10">
          <Wifi className="h-14 w-14" />
        </div>

        <Logo tamanho="h-10" className="relative" />

        <div className="relative space-y-6">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
              <Star className="h-3.5 w-3.5 fill-brand-gold text-brand-gold" />
              {t("badge")}
            </span>
            <h2 className="mt-4 max-w-sm text-2xl font-bold tracking-tight">{t("tagline")}</h2>
          </div>
          <div className="space-y-3">
            {vantagens.map((texto, i) => {
              const Icon = VANTAGENS_ICONES[i]
              return (
                <div key={texto} className="flex items-center gap-2.5 text-sm text-white/85">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <Icon className="h-3.5 w-3.5 text-brand-gold" />
                  </span>
                  {texto}
                </div>
              )
            })}
          </div>
        </div>

        <p className="relative text-xs text-white/50">
          © {new Date().getFullYear()} BTS — Bizarro Total Solutions
        </p>
      </div>

      {/* Formulário */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-10">
        <div className="mb-6 flex w-full max-w-sm items-center justify-between lg:hidden">
          <Link href="/">
            <Logo tamanho="h-10" />
          </Link>
          <LanguageSwitcher />
        </div>
        <div className="hidden w-full max-w-sm justify-end lg:flex">
          <LanguageSwitcher className="mb-3" />
        </div>
        <div className="w-full max-w-sm rounded-xl border bg-card p-6 shadow-sm sm:p-8">
          <div className="mb-6 space-y-1 text-center">
            <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {children}
        </div>
        {footer && <div className="mt-6 text-sm text-muted-foreground">{footer}</div>}
      </div>
    </div>
  )
}
