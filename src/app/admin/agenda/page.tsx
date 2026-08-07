import { AgendaView } from "@/components/agenda/agenda-view"

export default function AdminAgendaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Agenda</h1>
        <p className="text-sm text-muted-foreground">
          Todos os trabalhos agendados da equipa. Arrasta para reagendar.
        </p>
      </div>
      <AgendaView escopo="todos" />
    </div>
  )
}
