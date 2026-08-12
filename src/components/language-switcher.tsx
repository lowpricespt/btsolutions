"use client"

import { useTransition } from "react"
import { useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import PT from "country-flag-icons/react/3x2/PT"
import GB from "country-flag-icons/react/3x2/GB"
import FR from "country-flag-icons/react/3x2/FR"
import ES from "country-flag-icons/react/3x2/ES"
import DE from "country-flag-icons/react/3x2/DE"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// SVG em vez de emoji de bandeira: o Windows não tem glifos de bandeira no
// tipo de letra do sistema e mostra só o código do país (ex.: "PT") em vez
// da bandeira — um SVG fica igual em qualquer sistema operativo.
const IDIOMAS: Record<string, { nome: string; Bandeira: React.ComponentType<{ className?: string }> }> = {
  pt: { nome: "Português", Bandeira: PT },
  en: { nome: "English", Bandeira: GB },
  fr: { nome: "Français", Bandeira: FR },
  es: { nome: "Español", Bandeira: ES },
  de: { nome: "Deutsch", Bandeira: DE },
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
          {(v: string | null) => {
            if (!v) return ""
            const { nome, Bandeira } = IDIOMAS[v]
            return (
              <span className="flex items-center gap-1.5">
                <Bandeira className="h-3.5 w-auto rounded-[2px]" />
                {nome}
              </span>
            )
          }}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(IDIOMAS).map(([codigo, { nome, Bandeira }]) => (
          <SelectItem key={codigo} value={codigo}>
            <span className="flex items-center gap-1.5">
              <Bandeira className="h-3.5 w-auto rounded-[2px]" />
              {nome}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
