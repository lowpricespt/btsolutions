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
import { EstadoBadge } from "@/components/estado-badge"
import { ESTADO_FERRAMENTA } from "@/lib/labels"
import { formatMoeda } from "@/lib/format"

export type Ferramenta = {
  id: number
  nome: string
  codigo_inventario: string | null
  estado: "disponivel" | "em_uso" | "manutencao" | "avariada"
  data_aquisicao: string | null
  valor_aquisicao: number | null
  id_funcionario_responsavel: string | null
  funcionarios: { utilizadores: { nome: string } | null } | null
}
type Funcionario = { id: string; nome: string }
const semAtribuicao = "__nenhum__"

const schema = z.object({
  nome: z.string().min(2, "Indica o nome"),
  codigo_inventario: z.string().optional(),
  estado: z.enum(["disponivel", "em_uso", "manutencao", "avariada"]),
  data_aquisicao: z.string().optional(),
  valor_aquisicao: z.string().optional(),
  id_funcionario_responsavel: z.string(),
})

const VAZIO: z.infer<typeof schema> = {
  nome: "",
  codigo_inventario: "",
  estado: "disponivel",
  data_aquisicao: "",
  valor_aquisicao: "",
  id_funcionario_responsavel: semAtribuicao,
}

export function FerramentasManager({
  ferramentas,
  funcionarios,
}: {
  ferramentas: Ferramenta[]
  funcionarios: Funcionario[]
}) {
  const router = useRouter()
  const [aberto, setAberto] = useState(false)
  const [aEditar, setAEditar] = useState<Ferramenta | null>(null)
  const [aGuardar, setAGuardar] = useState(false)

  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: VAZIO })

  function abrirNovo() {
    setAEditar(null)
    form.reset(VAZIO)
    setAberto(true)
  }

  function abrirEditar(f: Ferramenta) {
    setAEditar(f)
    form.reset({
      nome: f.nome,
      codigo_inventario: f.codigo_inventario ?? "",
      estado: f.estado,
      data_aquisicao: f.data_aquisicao ?? "",
      valor_aquisicao: f.valor_aquisicao ? String(f.valor_aquisicao) : "",
      id_funcionario_responsavel: f.id_funcionario_responsavel ?? semAtribuicao,
    })
    setAberto(true)
  }

  async function onSubmit(values: z.infer<typeof schema>) {
    setAGuardar(true)
    const supabase = createClient()
    const payload = {
      nome: values.nome,
      codigo_inventario: values.codigo_inventario || null,
      estado: values.estado,
      data_aquisicao: values.data_aquisicao || null,
      valor_aquisicao: values.valor_aquisicao ? Number(values.valor_aquisicao) : null,
      id_funcionario_responsavel:
        values.id_funcionario_responsavel === semAtribuicao ? null : values.id_funcionario_responsavel,
    }

    const { error } = aEditar
      ? await supabase.from("ferramentas").update(payload).eq("id", aEditar.id)
      : await supabase.from("ferramentas").insert(payload)

    setAGuardar(false)
    if (error) {
      toast.error("Não foi possível guardar.")
      return
    }
    toast.success(aEditar ? "Ferramenta atualizada." : "Ferramenta criada.")
    setAberto(false)
    router.refresh()
  }

  async function apagar(f: Ferramenta) {
    if (!confirm(`Apagar "${f.nome}"?`)) return
    const supabase = createClient()
    const { error } = await supabase.from("ferramentas").delete().eq("id", f.id)
    if (error) {
      toast.error("Não foi possível apagar.")
      return
    }
    toast.success("Apagada.")
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={abrirNovo}>
          <PlusCircle className="h-4 w-4" />
          Nova ferramenta
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Atribuída a</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {ferramentas.map((f) => (
              <TableRow key={f.id}>
                <TableCell className="font-medium">
                  {f.nome}
                  {f.codigo_inventario && (
                    <p className="text-xs text-muted-foreground">{f.codigo_inventario}</p>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {f.funcionarios?.utilizadores?.nome || "—"}
                </TableCell>
                <TableCell>
                  <EstadoBadge {...ESTADO_FERRAMENTA[f.estado]} />
                </TableCell>
                <TableCell>{formatMoeda(f.valor_aquisicao)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon-sm" onClick={() => abrirEditar(f)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => apagar(f)}>
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
            <DialogTitle>{aEditar ? "Editar ferramenta" : "Nova ferramenta"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
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
                  name="codigo_inventario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código de inventário</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="estado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue>
                              {(v: string | null) =>
                                v ? ESTADO_FERRAMENTA[v as keyof typeof ESTADO_FERRAMENTA].label : ""
                              }
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(ESTADO_FERRAMENTA).map(([v, { label }]) => (
                            <SelectItem key={v} value={v}>
                              {label}
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
                  name="data_aquisicao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de aquisição</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="valor_aquisicao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor (€)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="id_funcionario_responsavel"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Atribuir a</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue>
                              {(v: string | null) =>
                                v === semAtribuicao || !v
                                  ? "Ninguém"
                                  : funcionarios.find((f) => f.id === v)?.nome
                              }
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={semAtribuicao}>Ninguém</SelectItem>
                          {funcionarios.map((f) => (
                            <SelectItem key={f.id} value={f.id}>
                              {f.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
