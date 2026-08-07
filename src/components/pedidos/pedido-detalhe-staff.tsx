import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, MapPin, CalendarDays, Wallet, Phone, Mail, Star } from "lucide-react"

import { createClient } from "@/lib/supabase/server"
import { EstadoBadge } from "@/components/estado-badge"
import { ESTADO_TRABALHO, PRIORIDADE } from "@/lib/labels"
import { formatData, formatMoeda } from "@/lib/format"
import { EstadoPedidoSelect } from "@/components/pedidos/estado-pedido-select"
import { ComentariosThread } from "@/components/pedidos/comentarios-thread"
import { ComentarioForm } from "@/components/pedidos/comentario-form"
import { AnexosGaleria } from "@/components/pedidos/anexos-galeria"
import { AnexoUpload } from "@/components/pedidos/anexo-upload"
import { FaturaCard } from "@/components/pedidos/fatura-card"
import { CriarTrabalhoButton } from "@/components/pedidos/criar-trabalho-button"
import { AgendarTrabalhoDialog } from "@/components/agenda/agendar-trabalho-dialog"

export async function PedidoDetalheStaff({
  pedidoId,
  baseHref,
}: {
  pedidoId: number
  baseHref: string
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) notFound()

  const { data: pedido } = await supabase
    .from("pedidos")
    .select("*, tipos_servico(nome, especialidades(nome)), clientes(id, nif, utilizadores(nome, email, telefone))")
    .eq("id", pedidoId)
    .single()

  if (!pedido) notFound()

  const [{ data: trabalho }, { data: comentarios }, { data: avaliacoes }, { data: faturas }, { data: funcionarios }] =
    await Promise.all([
      supabase.from("trabalhos").select("*").eq("id_pedido", pedidoId).maybeSingle(),
      supabase
        .from("comentarios")
        .select("*, utilizadores(nome, tipo_utilizador)")
        .eq("id_pedido", pedidoId)
        .order("data_hora"),
      supabase.from("avaliacoes").select("*").eq("id_pedido", pedidoId),
      supabase.from("faturas").select("*").eq("id_pedido", pedidoId),
      supabase.from("funcionarios").select("id, utilizadores(nome)").eq("ativo", true),
    ])

  const listaFuncionarios = (funcionarios ?? [])
    .filter((f) => f.utilizadores)
    .map((f) => ({ id: f.id, nome: f.utilizadores!.nome }))
  const agendaHref = baseHref.replace("/pedidos", "/agenda")

  let anexos: { id: number; tipo: "foto_antes" | "foto_depois" | "documento"; data_upload: string; url: string | null }[] = []

  if (trabalho) {
    const { data: anexosRows } = await supabase
      .from("anexos")
      .select("*")
      .eq("id_trabalho", trabalho.id)
      .order("data_upload")

    if (anexosRows) {
      anexos = await Promise.all(
        anexosRows.map(async (a) => {
          const { data: signed } = await supabase.storage
            .from("anexos")
            .createSignedUrl(a.url_ficheiro, 3600)
          return { id: a.id, tipo: a.tipo, data_upload: a.data_upload, url: signed?.signedUrl ?? null }
        })
      )
    }
  }

  const cliente = pedido.clientes
  const avaliacao = avaliacoes?.[0]

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href={baseHref}
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{pedido.titulo}</h1>
            <p className="text-sm text-muted-foreground">
              {pedido.tipos_servico?.nome ?? "Serviço a definir"}
              {pedido.tipos_servico?.especialidades?.nome
                ? ` · ${pedido.tipos_servico.especialidades.nome}`
                : ""}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <EstadoPedidoSelect pedidoId={pedidoId} estadoAtual={pedido.estado} />
            <EstadoBadge {...PRIORIDADE[pedido.prioridade]} />
          </div>
        </div>
      </div>

      {cliente?.utilizadores && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border bg-card p-4 text-sm">
          <p className="font-medium">{cliente.utilizadores.nome}</p>
          {cliente.utilizadores.email && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              {cliente.utilizadores.email}
            </span>
          )}
          {cliente.utilizadores.telefone && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <Phone className="h-3.5 w-3.5" />
              {cliente.utilizadores.telefone}
            </span>
          )}
        </div>
      )}

      <div className="space-y-4 rounded-xl border bg-card p-4">
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

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Trabalho</h2>
          {!trabalho && <CriarTrabalhoButton pedidoId={pedidoId} />}
        </div>
        {trabalho ? (
          <div className="space-y-4 rounded-xl border bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <EstadoBadge {...ESTADO_TRABALHO[trabalho.estado]} />
              <div className="flex items-center gap-3">
                <Link href={agendaHref} className="text-sm text-domain-blue hover:underline">
                  Ver agenda
                </Link>
                <AgendarTrabalhoDialog
                  idTrabalho={trabalho.id}
                  funcionarios={listaFuncionarios}
                  funcionarioSugerido={trabalho.id_funcionario_responsavel}
                />
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">Fotos e documentos</h3>
              <AnexosGaleria anexos={anexos} />
              <div className="mt-3">
                <AnexoUpload idTrabalho={trabalho.id} />
              </div>
            </div>
          </div>
        ) : (
          <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
            Este pedido ainda não foi transformado em trabalho.
          </p>
        )}
      </section>

      {faturas && faturas.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-medium">Fatura</h2>
          {faturas.map((f) => (
            <FaturaCard key={f.id} fatura={f} />
          ))}
        </section>
      )}

      {avaliacao && (
        <section className="space-y-3">
          <h2 className="text-lg font-medium">Avaliação do cliente</h2>
          <div className="flex items-center gap-2 rounded-lg border bg-card p-4">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < avaliacao.classificacao ? "fill-domain-orange text-domain-orange" : "text-muted-foreground"}`}
                />
              ))}
            </div>
            {avaliacao.comentario && <p className="text-sm text-foreground/90">{avaliacao.comentario}</p>}
          </div>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Comentários</h2>
        <ComentariosThread comentarios={comentarios ?? []} userId={user.id} mostrarAutorReal />
        <ComentarioForm pedidoId={pedidoId} podeMarcarInterno />
      </section>
    </div>
  )
}
