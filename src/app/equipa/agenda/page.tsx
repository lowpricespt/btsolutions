import { AgendaView } from "@/components/agenda/agenda-view"

export default function EquipaAgendaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Agenda</h1>
        <p className="text-sm text-muted-foreground">
          Os teus trabalhos agendados. Arrasta para reagendar.
        </p>
      </div>
      <AgendaView escopo="proprio" />
    </div>
  )
}
