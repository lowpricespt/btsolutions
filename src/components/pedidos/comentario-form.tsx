"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Send } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

export function ComentarioForm({
  pedidoId,
  podeMarcarInterno,
}: {
  pedidoId: number
  podeMarcarInterno: boolean
}) {
  const router = useRouter()
  const [texto, setTexto] = useState("")
  const [notaInterna, setNotaInterna] = useState(false)
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
      visivel_cliente: podeMarcarInterno ? !notaInterna : true,
    })

    if (error) {
      setErro(error.message)
      setAEnviar(false)
      return
    }

    setTexto("")
    setNotaInterna(false)
    setAEnviar(false)
    router.refresh()
  }

  return (
    <div className="space-y-2">
      <Textarea
        placeholder="Escreve um comentário…"
        rows={3}
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />
      {erro && <p className="text-sm text-red-600 dark:text-red-400">{erro}</p>}
      <div className="flex items-center justify-between gap-3">
        {podeMarcarInterno ? (
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Checkbox checked={notaInterna} onCheckedChange={(v) => setNotaInterna(!!v)} />
            Nota interna (não visível ao cliente)
          </label>
        ) : (
          <span />
        )}
        <Button type="button" size="sm" onClick={enviar} disabled={aEnviar || !texto.trim()}>
          {aEnviar ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Enviar
        </Button>
      </div>
    </div>
  )
}
