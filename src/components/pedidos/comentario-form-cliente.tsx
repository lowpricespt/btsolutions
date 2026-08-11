"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Loader2, Send } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

// Variante traduzida de ComentarioForm, só para a área de cliente — sem a
// opção de "nota interna" (essa é exclusiva do staff, que continua a usar
// o componente original em português).
export function ComentarioFormCliente({ pedidoId }: { pedidoId: number }) {
  const router = useRouter()
  const t = useTranslations("Cliente.comentarios")
  const [texto, setTexto] = useState("")
  const [aEnviar, setAEnviar] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function enviar() {
    if (!texto.trim()) return
    setAEnviar(true)
    setErro(null)
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from("comentarios").insert({
      id_pedido: pedidoId,
      id_utilizador: user.id,
      texto: texto.trim(),
      visivel_cliente: true,
    })

    if (error) {
      setErro(error.message)
      setAEnviar(false)
      return
    }

    setTexto("")
    setAEnviar(false)
    router.refresh()
  }

  return (
    <div className="space-y-2">
      <Textarea placeholder={t("placeholder")} rows={3} value={texto} onChange={(e) => setTexto(e.target.value)} />
      {erro && <p className="text-sm text-red-600 dark:text-red-400">{erro}</p>}
      <div className="flex items-center justify-end gap-3">
        <Button type="button" size="sm" onClick={enviar} disabled={aEnviar || !texto.trim()}>
          {aEnviar ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {t("botao")}
        </Button>
      </div>
    </div>
  )
}
