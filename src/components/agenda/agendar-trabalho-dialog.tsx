"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarPlus, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { createClient } from "@/lib/supabase/client"
import { registarAtividade } from "@/lib/registar-atividade"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Funcionario = { id: string; nome: string }

export function AgendarTrabalhoDialog({
  idTrabalho,
  funcionarios,
  funcionarioSugerido,
}: {
  idTrabalho: number
  funcionarios: Funcionario[]
  funcionarioSugerido: string | null
}) {
  const router = useRouter()
  const [aberto, setAberto] = useState(false)
  const [aGuardar, setAGuardar] = useState(false)
  const [funcionarioId, setFuncionarioId] = useState(funcionarioSugerido ?? "")
  const [data, setData] = useState("")
  const [horaInicio, setHoraInicio] = useState("09:00")
  const [horaFim, setHoraFim] = useState("11:00")

  async function agendar() {
    if (!funcionarioId || !data) {
      toast.error("Preenche o funcionário e a data.")
      return
    }
    const inicio = new Date(`${data}T${horaInicio}:00`)
    const fim = new Date(`${data}T${horaFim}:00`)
    if (fim <= inicio) {
      toast.error("A hora de fim tem de ser depois da hora de início.")
      return
    }

    setAGuardar(true)
    const supabase = createClient()
    const { error } = await supabase.from("agenda").insert({
      id_trabalho: idTrabalho,
      id_funcionario: funcionarioId,
      data_hora_inicio: inicio.toISOString(),
      data_hora_fim: fim.toISOString(),
    })

    setAGuardar(false)
    if (error) {
      toast.error("Não foi possível agendar.")
      return
    }
    toast.success("Trabalho agendado.")
    registarAtividade("Agendou um trabalho", "trabalhos", idTrabalho)
    setAberto(false)
    router.refresh()
  }

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setAberto(true)}>
        <CalendarPlus className="h-4 w-4" />
        Agendar
      </Button>
      <Dialog open={aberto} onOpenChange={setAberto}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agendar trabalho</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 px-4">
          <div className="space-y-1.5">
            <Label>Funcionário</Label>
            <Select value={funcionarioId} onValueChange={(v) => v && setFuncionarioId(v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Escolhe o funcionário">
                  {(value: string | null) =>
                    funcionarios.find((f) => f.id === value)?.nome
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {funcionarios.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Data</Label>
            <Input type="date" value={data} onChange={(e) => setData(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Hora início</Label>
              <Input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Hora fim</Label>
              <Input type="time" value={horaFim} onChange={(e) => setHoraFim(e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setAberto(false)}>
            Cancelar
          </Button>
          <Button onClick={agendar} disabled={aGuardar}>
            {aGuardar && <Loader2 className="h-4 w-4 animate-spin" />}
            Agendar
          </Button>
        </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
