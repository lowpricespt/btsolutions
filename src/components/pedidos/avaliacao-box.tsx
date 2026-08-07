"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Star, Loader2 } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { formatData } from "@/lib/format"

type Avaliacao = {
  classificacao: number
  comentario: string | null
  data_avaliacao: string
}

function Estrelas({
  valor,
  onChange,
  tamanho = "h-6 w-6",
}: {
  valor: number
  onChange?: (v: number) => void
  tamanho?: string
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          className={cn(!onChange && "cursor-default")}
        >
          <Star
            className={cn(tamanho, n <= valor ? "fill-domain-orange text-domain-orange" : "text-muted-foreground")}
          />
        </button>
      ))}
    </div>
  )
}

export function AvaliacaoBox({
  pedidoId,
  clienteId,
  avaliacaoExistente,
}: {
  pedidoId: number
  clienteId: string
  avaliacaoExistente: Avaliacao | null
}) {
  const router = useRouter()
  const [classificacao, setClassificacao] = useState(0)
  const [comentario, setComentario] = useState("")
  const [aEnviar, setAEnviar] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  if (avaliacaoExistente) {
    return (
      <div className="space-y-2 rounded-lg border bg-card p-4">
        <Estrelas valor={avaliacaoExistente.classificacao} />
        {avaliacaoExistente.comentario && (
          <p className="text-sm text-foreground/90">{avaliacaoExistente.comentario}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Avaliado em {formatData(avaliacaoExistente.data_avaliacao)}
        </p>
      </div>
    )
  }

  async function enviar() {
    if (classificacao === 0) return
    setAEnviar(true)
    setErro(null)
    const supabase = createClient()

    const { error } = await supabase.from("avaliacoes").insert({
      id_pedido: pedidoId,
      id_cliente: clienteId,
      classificacao,
      comentario: comentario.trim() || null,
    })

    if (error) {
      setErro(error.message)
      setAEnviar(false)
      return
    }

    router.refresh()
  }

  return (
    <div className="space-y-3 rounded-lg border bg-card p-4">
      <p className="text-sm font-medium">Como avalias este serviço?</p>
      <Estrelas valor={classificacao} onChange={setClassificacao} tamanho="h-8 w-8" />
      <Textarea
        placeholder="Comentário (opcional)"
        rows={3}
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
      />
      {erro && <p className="text-sm text-red-600 dark:text-red-400">{erro}</p>}
      <Button size="sm" onClick={enviar} disabled={aEnviar || classificacao === 0}>
        {aEnviar && <Loader2 className="h-4 w-4 animate-spin" />}
        Enviar avaliação
      </Button>
    </div>
  )
}
