import Link from "next/link"
import { PlusCircle, ClipboardList, Inbox } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { EstadoBadge } from "@/components/estado-badge"
import { StatCard } from "@/components/stat-card"
import { ESTADO_PEDIDO, PRIORIDADE } from "@/lib/labels"
import { traduzEnum } from "@/lib/labels-i18n"
import { formatData, formatMoeda } from "@/lib/format"

export default async function ClienteDashboardPage() {
  const supabase = await createClient()
  const [t, tEnums] = await Promise.all([getTranslations("Cliente.dashboard"), getTranslations("Enums")])
  const estadoPedido = traduzEnum(tEnums, "estadoPedido", ESTADO_PEDIDO)
  const prioridade = traduzEnum(tEnums, "prioridade", PRIORIDADE)

  const { data: pedidos } = await supabase
    .from("pedidos")
    .select("*, tipos_servico(nome)")
    .order("data_pedido", { ascending: false })

  const lista = pedidos ?? []
  const emAberto = lista.filter((p) => !["concluido", "cancelado"].includes(p.estado)).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("titulo")}</h1>
          <p className="text-sm text-muted-foreground">{t("subtitulo")}</p>
        </div>
        <Button
          render={
            <Link href="/cliente/pedidos/novo">
              <PlusCircle className="h-4 w-4" />
              {t("novoPedido")}
            </Link>
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:max-w-md">
        <StatCard titulo={t("pedidosAbertos")} valor={emAberto} icon={ClipboardList} dominio="blue" />
        <StatCard titulo={t("totalPedidos")} valor={lista.length} icon={Inbox} dominio="green" />
      </div>

      {lista.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed p-12 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-gold-soft text-brand-gold-foreground">
            <Inbox className="h-6 w-6" />
          </span>
          <div>
            <p className="font-semibold">{t("bemVindo")}</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">{t("semPedidosTexto")}</p>
          </div>
          <Button
            className="mt-2 bg-brand-gold text-brand-gold-foreground hover:bg-brand-gold/90"
            render={
              <Link href="/cliente/pedidos/novo">
                <PlusCircle className="h-4 w-4" />
                {t("pedirPrimeiro")}
              </Link>
            }
          />
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((pedido) => (
            <Link
              key={pedido.id}
              href={`/cliente/pedidos/${pedido.id}`}
              className="flex flex-col gap-2 rounded-xl border bg-card p-4 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium leading-snug">{pedido.titulo}</p>
                <EstadoBadge {...estadoPedido[pedido.estado]} />
              </div>
              <p className="text-sm text-muted-foreground">
                {pedido.tipos_servico?.nome ?? t("servicoADefinir")}
              </p>
              <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                <span>{t("pedidoEm", { data: formatData(pedido.data_pedido) })}</span>
                <EstadoBadge {...prioridade[pedido.prioridade]} />
              </div>
              {pedido.valor_final !== null && (
                <p className="text-sm font-medium">{formatMoeda(pedido.valor_final)}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
