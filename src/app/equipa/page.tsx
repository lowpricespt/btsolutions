import Link from "next/link"
import { CalendarClock, ClipboardList, Hammer } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { StatCard } from "@/components/stat-card"
import { EstadoBadge } from "@/components/estado-badge"
import { ESTADO_AGENDA } from "@/lib/labels"
import { formatHora } from "@/lib/format"

export default async function EquipaDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const hoje = new Date()
  const inicioHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()).toISOString()
  const fimHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1).toISOString()

  const [{ data: agendaHoje }, { count: pedidosPendentes }, { count: trabalhosEmCurso }] =
    await Promise.all([
      supabase
        .from("agenda")
        .select("*, trabalhos(id, pedidos(titulo, morada_servico))")
        .eq("id_funcionario", user!.id)
        .gte("data_hora_inicio", inicioHoje)
        .lt("data_hora_inicio", fimHoje)
        .order("data_hora_inicio"),
      supabase.from("pedidos").select("id", { count: "exact", head: true }).eq("estado", "pendente"),
      supabase
        .from("trabalhos")
        .select("id", { count: "exact", head: true })
        .eq("id_funcionario_responsavel", user!.id)
        .eq("estado", "em_curso"),
    ])

  const eventos = agendaHoje ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">O teu dia de trabalho, num relance.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard titulo="Trabalhos hoje" valor={eventos.length} icon={CalendarClock} dominio="green" />
        <StatCard titulo="Pedidos pendentes" valor={pedidosPendentes ?? 0} icon={ClipboardList} dominio="blue" />
        <StatCard titulo="Em curso (meus)" valor={trabalhosEmCurso ?? 0} icon={Hammer} dominio="orange" />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-medium">Agenda de hoje</h2>
        {eventos.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            Sem trabalhos agendados para hoje.{" "}
            <Link href="/equipa/agenda" className="font-medium text-domain-blue hover:underline">
              Ver agenda completa
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {eventos.map((ev) => (
              <div key={ev.id} className="flex items-center gap-4 rounded-lg border bg-card p-3">
                <div className="w-16 shrink-0 text-sm font-medium tabular-nums">
                  {formatHora(ev.data_hora_inicio)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">
                    {ev.trabalhos?.pedidos?.titulo ?? "Trabalho"}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {ev.trabalhos?.pedidos?.morada_servico ?? "—"}
                  </p>
                </div>
                <EstadoBadge {...ESTADO_AGENDA[ev.estado]} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
