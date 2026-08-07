"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ESTADO_PEDIDO } from "@/lib/labels"
import { registarAtividade } from "@/lib/registar-atividade"
import { toast } from "sonner"

const OPCOES = Object.entries(ESTADO_PEDIDO) as [keyof typeof ESTADO_PEDIDO, (typeof ESTADO_PEDIDO)[keyof typeof ESTADO_PEDIDO]][]

export function EstadoPedidoSelect({
  pedidoId,
  estadoAtual,
}: {
  pedidoId: number
  estadoAtual: string
}) {
  const router = useRouter()
  const [aAtualizar, startTransition] = useTransition()
  const [valor, setValor] = useState(estadoAtual)
  const [estadoSincronizado, setEstadoSincronizado] = useState(estadoAtual)

  // Sincroniza quando o pedido muda por outra via (ex.: "Transformar em
  // trabalho" aprova-o automaticamente) — useState só usa a prop na primeira
  // renderização. Ajustar durante a renderização (em vez de num useEffect)
  // evita um render em cascata desnecessário.
  if (estadoAtual !== estadoSincronizado) {
    setEstadoSincronizado(estadoAtual)
    setValor(estadoAtual)
  }

  async function alterar(novoEstado: string | null) {
    if (!novoEstado) return
    setValor(novoEstado)
    const supabase = createClient()
    const { error } = await supabase
      .from("pedidos")
      .update({ estado: novoEstado as "pendente" | "aprovado" | "em_curso" | "concluido" | "cancelado" })
      .eq("id", pedidoId)

    if (error) {
      toast.error("Não foi possível atualizar o estado.")
      setValor(estadoAtual)
      return
    }

    toast.success("Estado atualizado.")
    registarAtividade(
      "Mudou o estado do pedido",
      "pedidos",
      pedidoId,
      `${estadoAtual} → ${novoEstado}`
    )
    startTransition(() => router.refresh())
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={valor} onValueChange={alterar}>
        <SelectTrigger size="sm" className="w-40" onClick={(e) => e.stopPropagation()}>
          <SelectValue>
            {(value: string | null) =>
              value ? ESTADO_PEDIDO[value as keyof typeof ESTADO_PEDIDO].label : ""
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent onClick={(e) => e.stopPropagation()}>
          {OPCOES.map(([valorOpcao, { label }]) => (
            <SelectItem key={valorOpcao} value={valorOpcao}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {aAtualizar && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
    </div>
  )
}
