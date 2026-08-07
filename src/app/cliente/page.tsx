import Link from "next/link"
import { PlusCircle, ClipboardList, Inbox } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { EstadoBadge } from "@/components/estado-badge"
import { StatCard } from "@/components/stat-card"
import { ESTADO_PEDIDO, PRIORIDADE } from "@/lib/labels"
import { formatData, formatMoeda } from "@/lib/format"

export default async function ClienteDashboardPage() {
  const supabase = await createClient()

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
          <h1 className="text-2xl font-semibold tracking-tight">Os meus pedidos</h1>
          <p className="text-sm text-muted-foreground">
            Acompanha o estado dos serviços que pediste à BTS.
          </p>
        </div>
        <Button
          render={
            <Link href="/cliente/pedidos/novo">
              <PlusCircle className="h-4 w-4" />
              Novo pedido
            </Link>
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:max-w-md">
        <StatCard titulo="Pedidos em aberto" valor={emAberto} icon={ClipboardList} dominio="blue" />
        <StatCard titulo="Total de pedidos" valor={lista.length} icon={Inbox} dominio="green" />
      </div>

      {lista.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed p-12 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-gold-soft text-brand-gold-foreground">
            <Inbox className="h-6 w-6" />
          </span>
          <div>
            <p className="font-semibold">Bem-vindo à BTS!</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Ainda não fizeste nenhum pedido. Diz-nos o que precisas e a nossa equipa entra em
              contacto contigo em menos de 24h.
            </p>
          </div>
          <Button
            className="mt-2 bg-brand-gold text-brand-gold-foreground hover:bg-brand-gold/90"
            render={
              <Link href="/cliente/pedidos/novo">
                <PlusCircle className="h-4 w-4" />
                Pedir o primeiro serviço
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
                <EstadoBadge {...ESTADO_PEDIDO[pedido.estado]} />
              </div>
              <p className="text-sm text-muted-foreground">
                {pedido.tipos_servico?.nome ?? "Serviço a definir"}
              </p>
              <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                <span>Pedido em {formatData(pedido.data_pedido)}</span>
                <EstadoBadge {...PRIORIDADE[pedido.prioridade]} />
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
