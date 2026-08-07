"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { Logo } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-muted/30 px-4 text-center">
      <Link href="/">
        <Logo tamanho="h-9" />
      </Link>
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300">
        <AlertTriangle className="h-7 w-7" />
      </span>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Algo correu mal</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tenta novamente. Se o erro persistir, contacta o suporte.
        </p>
      </div>
      <Button onClick={reset}>Tentar novamente</Button>
    </div>
  )
}
