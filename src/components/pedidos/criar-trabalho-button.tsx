"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Hammer, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { createClient } from "@/lib/supabase/client"
import { registarAtividade } from "@/lib/registar-atividade"
import { Button } from "@/components/ui/button"

export function CriarTrabalhoButton({ pedidoId }: { pedidoId: number }) {
  const router = useRouter()
  const [aCriar, setACriar] = useState(false)

  async function criar() {
    setACriar(true)
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // id_funcionario_responsavel só pode apontar para uma linha em
    // "funcionarios" — quem cria o trabalho pode ser um administrador (não
    // tem linha ali), por isso só nos auto-atribuímos se formos mesmo um
    // funcionário. Caso contrário fica por atribuir e escolhe-se no diálogo
    // de agendamento.
    const { data: funcionario } = user
      ? await supabase.from("funcionarios").select("id").eq("id", user.id).maybeSingle()
      : { data: null }

    const { error } = await supabase.from("trabalhos").insert({
      id_pedido: pedidoId,
      id_funcionario_responsavel: funcionario?.id ?? null,
    })

    if (error) {
      toast.error("Não foi possível criar o trabalho.")
      setACriar(false)
      return
    }

    if (
      await supabase
        .from("pedidos")
        .select("estado")
        .eq("id", pedidoId)
        .single()
        .then(({ data }) => data?.estado === "pendente")
    ) {
      await supabase.from("pedidos").update({ estado: "aprovado" }).eq("id", pedidoId)
    }

    toast.success("Trabalho criado. Já podes agendá-lo e anexar fotos.")
    registarAtividade("Transformou pedido em trabalho", "pedidos", pedidoId)
    router.refresh()
  }

  return (
    <Button size="sm" onClick={criar} disabled={aCriar}>
      {aCriar ? <Loader2 className="h-4 w-4 animate-spin" /> : <Hammer className="h-4 w-4" />}
      Transformar em trabalho
    </Button>
  )
}
