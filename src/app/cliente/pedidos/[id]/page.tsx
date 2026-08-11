import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, MapPin, CalendarDays, Wallet } from "lucide-react"

import { createClient } from "@/lib/supabase/server"
import { EstadoBadge } from "@/components/estado-badge"
import { ESTADO_PEDIDO, PRIORIDADE } from "@/lib/labels"
import { formatData, formatMoeda } from "@/lib/format"
import { ComentariosThread } from "@/components/pedidos/comentarios-thread"
import { ComentarioForm } from "@/components/pedidos/comentario-form"
import { AnexosGaleria } from "@/components/pedidos/anexos-galeria"
import { AvaliacaoBox } from "@/components/pedidos/avaliacao-box"
import { FaturaCard } from "@/components/pedidos/fatura-card"

export default async function PedidoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const pedidoId = Number(id)
  if (!Number.isInteger(pedidoId)) notFound()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) notFound()

  const { data: pedido } = await supabase
    .from("pedidos")
    .select(
      "id, titulo, estado, prioridade, descricao, data_pedido, data_pretendida, morada_servico, codigo_postal_servico, valor_orcamento, valor_final, tipos_servico(nome, especialidades(nome))"
    )
    .eq("id", pedidoId)
    .single()

  if (!pedido) notFound()

  const [{ data: comentarios }, { data: avaliacoes }, { data: faturas }, { data: idTrabalho }] =
    await Promise.all([
      supabase
        .from("comentarios")
        .select("*, utilizadores(nome, tipo_utilizador)")
        .eq("id_pedido", pedidoId)
        .order("data_hora"),
      supabase.from("avaliacoes").select("*").eq("id_pedido", pedidoId),
      supabase.from("faturas").select("*").eq("id_pedido", pedidoId),
      supabase.rpc("trabalho_do_pedido", { p_id: pedidoId }),
    ])

  let anexos: { id: number; tipo: "foto_antes" | "foto_depois" | "documento"; data_upload: string; url: string | null }[] = []

  if (idTrabalho) {
    const { data: anexosRows } = await supabase
      .from("anexos")
      .select("*")
      .eq("id_trabalho", idTrabalho)
      .order("data_upload")

    if (anexosRows && anexosRows.length > 0) {
      const { data: signedUrls } = await supabase.storage
        .from("anexos")
        .createSignedUrls(
          anexosRows.map((a) => a.url_ficheiro),
          3600
        )
      const urlByPath = new Map((signedUrls ?? []).map((s) => [s.path, s.signedUrl]))

      anexos = anexosRows.map((a) => ({
        id: a.id,
        tipo: a.tipo,
        data_upload: a.data_upload,
        url: urlByPath.get(a.url_ficheiro) ?? null,
      }))
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/cliente"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{pedido.titulo}</h1>
            <p className="text-sm text-muted-foreground">
              {pedido.tipos_servico?.nome ?? "Serviço a definir"}
              {pedido.tipos_servico?.especialidades?.nome
                ? ` · ${pedido.tipos_servico.especialidades.nome}`
                : ""}
            </p>
          </div>
          <div className="flex gap-2">
            <EstadoBadge {...ESTADO_PEDIDO[pedido.estado]} />
            <EstadoBadge {...PRIORIDADE[pedido.prioridade]} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-4 space-y-4">
        {pedido.descricao && <p className="text-sm text-foreground/90">{pedido.descricao}</p>}
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            Pedido em {formatData(pedido.data_pedido)}
            {pedido.data_pretendida && ` · pretendido para ${formatData(pedido.data_pretendida)}`}
          </div>
          {pedido.morada_servico && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {pedido.morada_servico}
              {pedido.codigo_postal_servico ? `, ${pedido.codigo_postal_servico}` : ""}
            </div>
          )}
          {(pedido.valor_orcamento || pedido.valor_final) && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Wallet className="h-4 w-4" />
              {pedido.valor_final
                ? `Valor final: ${formatMoeda(pedido.valor_final)}`
                : `Orçamento: ${formatMoeda(pedido.valor_orcamento)}`}
            </div>
          )}
        </div>
      </div>

      {faturas && faturas.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-medium">Fatura</h2>
          {faturas.map((f) => (
            <FaturaCard key={f.id} fatura={f} />
          ))}
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Fotos e documentos</h2>
        <AnexosGaleria anexos={anexos} />
      </section>

      {pedido.estado === "concluido" && (
        <section className="space-y-3">
          <h2 className="text-lg font-medium">A tua avaliação</h2>
          <AvaliacaoBox
            pedidoId={pedidoId}
            clienteId={user.id}
            avaliacaoExistente={avaliacoes?.[0] ?? null}
          />
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Comentários</h2>
        <ComentariosThread
          comentarios={comentarios ?? []}
          userId={user.id}
          mostrarAutorReal={false}
        />
        <ComentarioForm pedidoId={pedidoId} podeMarcarInterno={false} />
      </section>
    </div>
  )
}
