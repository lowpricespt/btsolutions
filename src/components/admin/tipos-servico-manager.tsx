"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Pencil, PlusCircle, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatMoeda } from "@/lib/format"

export type TipoServico = {
  id: number
  nome: string
  descricao: string | null
  preco_base: number | null
  duracao_estimada_horas: number | null
  id_especialidade: number | null
  especialidades: { nome: string } | null
}
type Especialidade = { id: number; nome: string }

const schema = z.object({
  nome: z.string().min(2, "Indica o nome"),
  descricao: z.string().optional(),
  id_especialidade: z.string().min(1, "Escolhe a especialidade"),
  preco_base: z.string().optional(),
  duracao_estimada_horas: z.string().optional(),
})

export function TiposServicoManager({
  tiposServico,
  especialidades,
}: {
  tiposServico: TipoServico[]
  especialidades: Especialidade[]
}) {
  const router = useRouter()
  const [aberto, setAberto] = useState(false)
  const [aEditar, setAEditar] = useState<TipoServico | null>(null)
  const [aGuardar, setAGuardar] = useState(false)

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { nome: "", descricao: "", id_especialidade: "", preco_base: "", duracao_estimada_horas: "" },
  })

  function abrirNovo() {
    setAEditar(null)
    form.reset({ nome: "", descricao: "", id_especialidade: "", preco_base: "", duracao_estimada_horas: "" })
    setAberto(true)
  }

  function abrirEditar(t: TipoServico) {
    setAEditar(t)
    form.reset({
      nome: t.nome,
      descricao: t.descricao ?? "",
      id_especialidade: t.id_especialidade ? String(t.id_especialidade) : "",
      preco_base: t.preco_base ? String(t.preco_base) : "",
      duracao_estimada_horas: t.duracao_estimada_horas ? String(t.duracao_estimada_horas) : "",
    })
    setAberto(true)
  }

  async function onSubmit(values: z.infer<typeof schema>) {
    setAGuardar(true)
    const supabase = createClient()
    const payload = {
      nome: values.nome,
      descricao: values.descricao || null,
      id_especialidade: Number(values.id_especialidade),
      preco_base: values.preco_base ? Number(values.preco_base) : null,
      duracao_estimada_horas: values.duracao_estimada_horas ? Number(values.duracao_estimada_horas) : null,
    }

    const { error } = aEditar
      ? await supabase.from("tipos_servico").update(payload).eq("id", aEditar.id)
      : await supabase.from("tipos_servico").insert(payload)

    setAGuardar(false)
    if (error) {
      toast.error("Não foi possível guardar.")
      return
    }
    toast.success(aEditar ? "Tipo de serviço atualizado." : "Tipo de serviço criado.")
    setAberto(false)
    router.refresh()
  }

  async function apagar(t: TipoServico) {
    if (!confirm(`Apagar "${t.nome}"?`)) return
    const supabase = createClient()
    const { error } = await supabase.from("tipos_servico").delete().eq("id", t.id)
    if (error) {
      toast.error("Não foi possível apagar (pode estar associado a pedidos).")
      return
    }
    toast.success("Apagado.")
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={abrirNovo}>
          <PlusCircle className="h-4 w-4" />
          Novo tipo de serviço
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Especialidade</TableHead>
              <TableHead>Preço base</TableHead>
              <TableHead>Duração</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {tiposServico.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.nome}</TableCell>
                <TableCell className="text-muted-foreground">{t.especialidades?.nome}</TableCell>
                <TableCell>{formatMoeda(t.preco_base)}</TableCell>
                <TableCell>{t.duracao_estimada_horas ? `${t.duracao_estimada_horas}h` : "—"}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon-sm" onClick={() => abrirEditar(t)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => apagar(t)}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{aEditar ? "Editar tipo de serviço" : "Novo tipo de serviço"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="id_especialidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Especialidade</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Escolhe a especialidade">
                            {(v: string | null) => especialidades.find((e) => String(e.id) === v)?.nome}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {especialidades.map((e) => (
                          <SelectItem key={e.id} value={String(e.id)}>
                            {e.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea rows={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="preco_base"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço base (€)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duracao_estimada_horas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duração (h)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setAberto(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={aGuardar}>
                  {aGuardar && <Loader2 className="h-4 w-4 animate-spin" />}
                  Guardar
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
