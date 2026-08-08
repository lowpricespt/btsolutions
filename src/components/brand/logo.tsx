"use client"

import { useState } from "react"
import Image from "next/image"
import { Wrench } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Mostra public/logo.png quando existir; se o ficheiro ainda não tiver sido
 * colocado (ou falhar a carregar), cai automaticamente para um lockup em
 * texto/ícone para a app nunca ficar com uma imagem partida.
 */
export function Logo({
  className,
  tamanho = "h-9",
  monocromatico = false,
}: {
  className?: string
  tamanho?: string
  monocromatico?: boolean
}) {
  const [falhou, setFalhou] = useState(false)

  if (!falhou) {
    return (
      <Image
        src="/logo.png"
        alt="BTS — Bizarro Total Solutions"
        width={160}
        height={160}
        className={cn(tamanho, "w-auto object-contain", className)}
        onError={() => setFalhou(true)}
      />
    )
  }

  return (
    <span className={cn("flex items-center gap-2 font-bold", className)}>
      <span
        className={cn(
          "flex items-center justify-center rounded-lg",
          tamanho,
          "aspect-square",
          monocromatico
            ? "bg-current text-background"
            : "bg-brand-navy text-brand-navy-foreground"
        )}
      >
        <Wrench className="h-1/2 w-1/2" />
      </span>
      <span className="text-lg tracking-tight">
        BTS
      </span>
    </span>
  )
}
