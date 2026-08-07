import { createClient } from "@/lib/supabase/server"
import { AgendaCalendar, type AgendaEvento } from "@/components/agenda/agenda-calendar"

export async function AgendaView({ escopo }: { escopo: "proprio" | "todos" }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let query = supabase
    .from("agenda")
    .select(
      "id, data_hora_inicio, data_hora_fim, estado, cor_evento, trabalhos(pedidos(titulo, morada_servico)), funcionarios(utilizadores(nome))"
    )

  if (escopo === "proprio" && user) {
    query = query.eq("id_funcionario", user.id)
  }

  const { data } = await query.order("data_hora_inicio")

  const eventos: AgendaEvento[] = (data ?? []).map((a) => ({
    id: a.id,
    title: a.trabalhos?.pedidos?.titulo ?? "Trabalho",
    start: a.data_hora_inicio,
    end: a.data_hora_fim,
    estado: a.estado,
    corEvento: a.cor_evento,
    morada: a.trabalhos?.pedidos?.morada_servico ?? null,
    funcionarioNome: a.funcionarios?.utilizadores?.nome,
  }))

  return <AgendaCalendar eventos={eventos} />
}
