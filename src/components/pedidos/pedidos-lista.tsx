import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { EstadoBadge } from "@/components/estado-badge"
import { ESTADO_PEDIDO, PRIORIDADE } from "@/lib/labels"
import { formatData } from "@/lib/format"
import { EstadoPedidoSelect } from "@/components/pedidos/estado-pedido-select"
import { cn } from "@/lib/utils"

const FILTROS = [
  { valor: "todos", label: "Todos" },
  { valor: "pendente", label: "Pendentes" },
  { valor: "aprovado", label: "Aprovados" },
  { valor: "em_curso", label: "Em curso" },
  { valor: "concluido", label: "Concluídos" },
  { valor: "cancelado", label: "Cancelados" },
] as const

export async function PedidosLista({
  baseHref,
  estadoFiltro,
}: {
  baseHref: string
  estadoFiltro?: string
}) {
  const supabase = await createClient()

  let query = supabase
    .from("pedidos")
    .select("id, titulo, estado, prioridade, data_pedido, tipos_servico(nome), clientes(utilizadores(nome))")
    .order("data_pedido", { ascending: false })
    .limit(200)

  if (estadoFiltro && estadoFiltro !== "todos") {
    query = query.eq(
      "estado",
      estadoFiltro as "pendente" | "aprovado" | "em_curso" | "concluido" | "cancelado"
    )
  }

  const { data: pedidos } = await query

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTROS.map((f) => (
          <Link
            key={f.valor}
            href={f.valor === "todos" ? baseHref : `${baseHref}?estado=${f.valor}`}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
              (estadoFiltro ?? "todos") === f.valor
                ? "border-primary bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {!pedidos || pedidos.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          Sem pedidos para mostrar.
        </div>
      ) : (
        <div className="space-y-2">
          {pedidos.map((p) => (
            <div key={p.id} className="rounded-xl border bg-card p-4">
              <Link href={`${baseHref}/${p.id}`} className="block space-y-2">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{p.titulo}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {p.clientes?.utilizadores?.nome ?? "Cliente"} ·{" "}
                      {p.tipos_servico?.nome ?? "Serviço a definir"}
                    </p>
                  </div>
                  <EstadoBadge {...PRIORIDADE[p.prioridade]} />
                </div>
                <p className="text-xs text-muted-foreground">Pedido em {formatData(p.data_pedido)}</p>
              </Link>
              <div className="mt-3 flex items-center justify-between border-t pt-3">
                <EstadoBadge {...ESTADO_PEDIDO[p.estado]} />
                <EstadoPedidoSelect pedidoId={p.id} estadoAtual={p.estado} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
