import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, MapPin, CalendarDays, Wallet } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { createClient } from "@/lib/supabase/server"
import { EstadoBadge } from "@/components/estado-badge"
import { ESTADO_PEDIDO, PRIORIDADE } from "@/lib/labels"
import { traduzEnum } from "@/lib/labels-i18n"
import { formatData, formatMoeda } from "@/lib/format"
import { ComentariosThreadCliente } from "@/components/pedidos/comentarios-thread-cliente"
import { ComentarioFormCliente } from "@/components/pedidos/comentario-form-cliente"
import { AnexosGaleriaCliente } from "@/components/pedidos/anexos-galeria-cliente"
import { AvaliacaoBox } from "@/components/pedidos/avaliacao-box"
import { FaturaCardCliente } from "@/components/pedidos/fatura-card-cliente"

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

  const [t, tEnums] = await Promise.all([getTranslations("Cliente.detalhe"), getTranslations("Enums")])
  const estadoPedido = traduzEnum(tEnums, "estadoPedido", ESTADO_PEDIDO)
  const prioridade = traduzEnum(tEnums, "prioridade", PRIORIDADE)

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
          {t("voltar")}
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{pedido.titulo}</h1>
            <p className="text-sm text-muted-foreground">
              {pedido.tipos_servico?.nome ?? t("servicoADefinir")}
              {pedido.tipos_servico?.especialidades?.nome
                ? ` · ${pedido.tipos_servico.especialidades.nome}`
                : ""}
            </p>
          </div>
          <div className="flex gap-2">
            <EstadoBadge {...estadoPedido[pedido.estado]} />
            <EstadoBadge {...prioridade[pedido.prioridade]} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-4 space-y-4">
        {pedido.descricao && <p className="text-sm text-foreground/90">{pedido.descricao}</p>}
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            {t("pedidoEm", { data: formatData(pedido.data_pedido) })}
            {pedido.data_pretendida && ` · ${t("pretendidoPara", { data: formatData(pedido.data_pretendida) })}`}
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
                ? t("valorFinal", { valor: formatMoeda(pedido.valor_final) })
                : t("orcamento", { valor: formatMoeda(pedido.valor_orcamento) })}
            </div>
          )}
        </div>
      </div>

      {faturas && faturas.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-medium">{t("fatura")}</h2>
          {faturas.map((f) => (
            <FaturaCardCliente key={f.id} fatura={f} />
          ))}
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-medium">{t("fotosDocumentos")}</h2>
        <AnexosGaleriaCliente anexos={anexos} />
      </section>

      {pedido.estado === "concluido" && (
        <section className="space-y-3">
          <h2 className="text-lg font-medium">{t("aTuaAvaliacao")}</h2>
          <AvaliacaoBox
            pedidoId={pedidoId}
            clienteId={user.id}
            avaliacaoExistente={avaliacoes?.[0] ?? null}
          />
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-medium">{t("comentarios")}</h2>
        <ComentariosThreadCliente comentarios={comentarios ?? []} userId={user.id} />
        <ComentarioFormCliente pedidoId={pedidoId} />
      </section>
    </div>
  )
}
