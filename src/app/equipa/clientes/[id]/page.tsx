import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { ClienteForm } from "@/components/clientes/cliente-form"

export default async function EditarClienteEquipaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: cliente } = await supabase
    .from("clientes")
    .select(
      "id, nif, tipo_cliente, nome_empresa, morada_faturacao, codigo_postal_faturacao, observacoes, utilizadores(nome, email, telefone, morada, codigo_postal, localidade)"
    )
    .eq("id", id)
    .single()

  if (!cliente) notFound()

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/equipa/clientes"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">
          {cliente.nome_empresa || cliente.utilizadores?.nome}
        </h1>
      </div>
      <ClienteForm baseHref="/equipa/clientes" clienteExistente={cliente} podeEditarUtilizador={false} />
    </div>
  )
}
