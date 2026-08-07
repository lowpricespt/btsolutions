"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import listPlugin from "@fullcalendar/list"
import interactionPlugin from "@fullcalendar/interaction"
import ptLocale from "@fullcalendar/core/locales/pt"
import type { EventDropArg, EventClickArg } from "@fullcalendar/core"
import type { EventResizeDoneArg } from "@fullcalendar/interaction"
import { toast } from "sonner"

import { createClient } from "@/lib/supabase/client"
import { registarAtividade } from "@/lib/registar-atividade"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ESTADO_AGENDA } from "@/lib/labels"

const COR_ESTADO: Record<string, string> = {
  agendado: "#3b82f6",
  em_curso: "#f59e0b",
  concluido: "#10b981",
  remarcado: "#a855f7",
}

export type AgendaEvento = {
  id: number
  title: string
  start: string
  end: string
  estado: "agendado" | "em_curso" | "concluido" | "remarcado"
  corEvento: string | null
  morada: string | null
  funcionarioNome?: string
}

export function AgendaCalendar({ eventos }: { eventos: AgendaEvento[] }) {
  const router = useRouter()
  const [selecionado, setSelecionado] = useState<AgendaEvento | null>(null)
  const [aGuardar, setAGuardar] = useState(false)

  const fcEventos = useMemo(
    () =>
      eventos.map((e) => ({
        id: String(e.id),
        title: e.title,
        start: e.start,
        end: e.end,
        backgroundColor: e.corEvento || COR_ESTADO[e.estado],
        borderColor: e.corEvento || COR_ESTADO[e.estado],
      })),
    [eventos]
  )

  async function moverEvento(id: string, start: Date, end: Date, onFail: () => void) {
    const supabase = createClient()
    const { error } = await supabase
      .from("agenda")
      .update({
        data_hora_inicio: start.toISOString(),
        data_hora_fim: end.toISOString(),
        estado: "remarcado",
      })
      .eq("id", Number(id))

    if (error) {
      toast.error("Não foi possível reagendar.")
      onFail()
      return
    }
    toast.success("Reagendado.")
    registarAtividade("Reagendou um trabalho (arrastar)", "agenda", Number(id))
    router.refresh()
  }

  function onEventDrop(info: EventDropArg) {
    if (!info.event.start || !info.event.end) return
    moverEvento(info.event.id, info.event.start, info.event.end, () => info.revert())
  }

  function onEventResize(info: EventResizeDoneArg) {
    if (!info.event.start || !info.event.end) return
    moverEvento(info.event.id, info.event.start, info.event.end, () => info.revert())
  }

  function onEventClick(info: EventClickArg) {
    const ev = eventos.find((e) => String(e.id) === info.event.id)
    if (ev) setSelecionado(ev)
  }

  async function alterarEstadoSelecionado(novoEstado: string | null) {
    if (!novoEstado || !selecionado) return
    setAGuardar(true)
    const supabase = createClient()
    const { error } = await supabase
      .from("agenda")
      .update({ estado: novoEstado as "agendado" | "em_curso" | "concluido" | "remarcado" })
      .eq("id", selecionado.id)

    setAGuardar(false)
    if (error) {
      toast.error("Não foi possível atualizar.")
      return
    }
    toast.success("Estado atualizado.")
    setSelecionado(null)
    router.refresh()
  }

  return (
    <>
      <div className="rounded-xl border bg-card p-2 sm:p-4">
        <FullCalendar
          plugins={[timeGridPlugin, listPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          locale={ptLocale}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "timeGridWeek,listWeek",
          }}
          height="auto"
          allDaySlot={false}
          slotMinTime="07:00:00"
          slotMaxTime="21:00:00"
          nowIndicator
          editable
          eventResizableFromStart
          events={fcEventos}
          eventDrop={onEventDrop}
          eventResize={onEventResize}
          eventClick={onEventClick}
          buttonText={{ today: "Hoje", week: "Semana", list: "Lista" }}
        />
      </div>

      <Sheet open={!!selecionado} onOpenChange={(open) => !open && setSelecionado(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{selecionado?.title}</SheetTitle>
          </SheetHeader>
          {selecionado && (
            <div className="space-y-4 px-4">
              {selecionado.morada && (
                <p className="text-sm text-muted-foreground">{selecionado.morada}</p>
              )}
              {selecionado.funcionarioNome && (
                <p className="text-sm text-muted-foreground">
                  Funcionário: {selecionado.funcionarioNome}
                </p>
              )}
              <div>
                <p className="mb-1.5 text-sm font-medium">Estado</p>
                <Select value={selecionado.estado} onValueChange={alterarEstadoSelecionado} disabled={aGuardar}>
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      {(value: string | null) =>
                        value
                          ? ESTADO_AGENDA[value as keyof typeof ESTADO_AGENDA].label
                          : ""
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ESTADO_AGENDA).map(([valor, { label }]) => (
                      <SelectItem key={valor} value={valor}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <SheetFooter>
            <Button variant="outline" onClick={() => setSelecionado(null)}>
              Fechar
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}
