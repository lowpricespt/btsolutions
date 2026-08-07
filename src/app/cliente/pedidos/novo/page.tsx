import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { NovoPedidoForm } from "@/components/pedidos/novo-pedido-form"

export default async function NovoPedidoPage() {
  const supabase = await createClient()

  const { data: tiposServico } = await supabase
    .from("tipos_servico")
    .select("id, nome, descricao, preco_base, especialidades(nome)")
    .order("nome")

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/cliente"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Novo pedido</h1>
        <p className="text-sm text-muted-foreground">
          Conta-nos o que precisas e a nossa equipa entra em contacto.
        </p>
      </div>

      <NovoPedidoForm tiposServico={tiposServico ?? []} />
    </div>
  )
}
