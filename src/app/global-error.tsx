"use client"

import { useEffect } from "react"
import * as Sentry from "@sentry/nextjs"

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string }
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="pt">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Algo correu mal</h1>
          <p className="text-sm text-muted-foreground">
            Tenta recarregar a página. Se o erro persistir, contacta o suporte.
          </p>
        </div>
      </body>
    </html>
  )
}
