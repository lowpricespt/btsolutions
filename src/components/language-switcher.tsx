"use client"

import { useTransition } from "react"
import { useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import { Globe } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const IDIOMAS: Record<string, string> = {
  pt: "Português",
  en: "English",
  fr: "Français",
  es: "Español",
  de: "Deutsch",
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
        <Globe className="h-3.5 w-3.5" />
        <SelectValue>{(v: string | null) => (v ? IDIOMAS[v] : "")}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(IDIOMAS).map(([codigo, nome]) => (
          <SelectItem key={codigo} value={codigo}>
            {nome}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
