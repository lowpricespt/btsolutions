"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Cookie } from "lucide-react"
import { Button } from "@/components/ui/button"

const CHAVE_ARMAZENAMENTO = "bts-cookies-aceites"

export function CookieBanner() {
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(CHAVE_ARMAZENAMENTO)) {
        setVisivel(true)
      }
    } catch {
      // localStorage indisponível (ex.: modo privado) — não bloqueia a app
    }
  }, [])

  function aceitar() {
    try {
      window.localStorage.setItem(CHAVE_ARMAZENAMENTO, new Date().toISOString())
    } catch {
      // ignora — o banner simplesmente volta a aparecer na próxima visita
    }
    setVisivel(false)
  }

  if (!visivel) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-card/95 p-4 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] backdrop-blur sm:p-5">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <div className="flex items-start gap-3 text-sm text-foreground/90">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-gold-soft text-brand-gold-foreground">
            <Cookie className="h-4 w-4" />
          </span>
          <p>
            Usamos apenas cookies essenciais, necessários para manteres a tua sessão iniciada e
            para a plataforma funcionar em segurança. Não usamos cookies de publicidade nem de
            terceiros.{" "}
            <Link href="/privacidade" className="font-medium underline hover:text-foreground">
              Saber mais
            </Link>
          </p>
        </div>
        <Button
          onClick={aceitar}
          className="w-full shrink-0 bg-brand-navy text-brand-navy-foreground hover:bg-brand-navy/90 sm:w-auto"
        >
          Entendi e aceito
        </Button>
      </div>
    </div>
  )
}
