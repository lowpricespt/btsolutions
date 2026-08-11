"use client"

import { useTransition } from "react"
import { useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const IDIOMAS: Record<string, { nome: string; bandeira: string }> = {
  pt: { nome: "Português", bandeira: "🇵🇹" },
  en: { nome: "English", bandeira: "🇬🇧" },
  fr: { nome: "Français", bandeira: "🇫🇷" },
  es: { nome: "Español", bandeira: "🇪🇸" },
  de: { nome: "Deutsch", bandeira: "🇩🇪" },
}

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale()
  const router = useRouter()
  const [aMudar, startTransition] = useTransition()

  function mudar(novoLocale: string | null) {
    if (!novoLocale || novoLocale === locale) return
    startTransition(async () => {
      await fetch("/api/set-locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: novoLocale }),
      })
      router.refresh()
    })
  }

  return (
    <Select value={locale} onValueChange={mudar} disabled={aMudar}>
      <SelectTrigger size="sm" className={className}>
        <SelectValue>
          {(v: string | null) => (v ? `${IDIOMAS[v].bandeira} ${IDIOMAS[v].nome}` : "")}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(IDIOMAS).map(([codigo, { nome, bandeira }]) => (
          <SelectItem key={codigo} value={codigo}>
            <span className="mr-1.5">{bandeira}</span>
            {nome}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
