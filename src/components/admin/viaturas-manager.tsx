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
import { ESTADO_VIATURA } from "@/lib/labels"

export type Viatura = {
  id: number
  matricula: string
  marca: string | null
  modelo: string | null
  ano: number | null
  estado: "disponivel" | "em_uso" | "manutencao"
  quilometragem: number | null
  id_funcionario_responsavel: string | null
  funcionarios: { utilizadores: { nome: string } | null } | null
}
type Funcionario = { id: string; nome: string }
const semAtribuicao = "__nenhum__"

const schema = z.object({
  matricula: z.string().min(4, "Indica a matrícula"),
  marca: z.string().optional(),
  modelo: z.string().optional(),
  ano: z.string().optional(),
  estado: z.enum(["disponivel", "em_uso", "manutencao"]),
  quilometragem: z.string().optional(),
  id_funcionario_responsavel: z.string(),
})

const VAZIO: z.infer<typeof schema> = {
  matricula: "",
  marca: "",
  modelo: "",
  ano: "",
  estado: "disponivel",
  quilometragem: "",
  id_funcionario_responsavel: semAtribuicao,
}

export function ViaturasManager({
  viaturas,
  funcionarios,
}: {
  viaturas: Viatura[]
  funcionarios: Funcionario[]
}) {
  const router = useRouter()
  const [aberto, setAberto] = useState(false)
  const [aEditar, setAEditar] = useState<Viatura | null>(null)
  const [aGuardar, setAGuardar] = useState(false)

  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: VAZIO })

  function abrirNovo() {
    setAEditar(null)
    form.reset(VAZIO)
    setAberto(true)
  }

  function abrirEditar(v: Viatura) {
    setAEditar(v)
    form.reset({
      matricula: v.matricula,
      marca: v.marca ?? "",
      modelo: v.modelo ?? "",
      ano: v.ano ? String(v.ano) : "",
      estado: v.estado,
      quilometragem: v.quilometragem ? String(v.quilometragem) : "",
      id_funcionario_responsavel: v.id_funcionario_responsavel ?? semAtribuicao,
    })
    setAberto(true)
  }

  async function onSubmit(values: z.infer<typeof schema>) {
    setAGuardar(true)
    const supabase = createClient()
    const payload = {
      matricula: values.matricula.toUpperCase(),
      marca: values.marca || null,
      modelo: values.modelo || null,
      ano: values.ano ? Number(values.ano) : null,
      estado: values.estado,
      quilometragem: values.quilometragem ? Number(values.quilometragem) : null,
      id_funcionario_responsavel:
        values.id_funcionario_responsavel === semAtribuicao ? null : values.id_funcionario_responsavel,
    }

    const { error } = aEditar
      ? await supabase.from("viaturas").update(payload).eq("id", aEditar.id)
      : await supabase.from("viaturas").insert(payload)

    setAGuardar(false)
    if (error) {
      toast.error("Não foi possível guardar.")
      return
    }
    toast.success(aEditar ? "Viatura atualizada." : "Viatura criada.")
    setAberto(false)
    router.refresh()
  }

  async function apagar(v: Viatura) {
    if (!confirm(`Apagar a viatura "${v.matricula}"?`)) return
    const supabase = createClient()
    const { error } = await supabase.from("viaturas").delete().eq("id", v.id)
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
          Nova viatura
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Matrícula</TableHead>
              <TableHead>Marca / Modelo</TableHead>
              <TableHead>Atribuída a</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {viaturas.map((v) => (
              <TableRow key={v.id}>
                <TableCell className="font-medium">{v.matricula}</TableCell>
                <TableCell className="text-muted-foreground">
                  {[v.marca, v.modelo].filter(Boolean).join(" ") || "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {v.funcionarios?.utilizadores?.nome || "—"}
                </TableCell>
                <TableCell>
                  <EstadoBadge {...ESTADO_VIATURA[v.estado]} />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon-sm" onClick={() => abrirEditar(v)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => apagar(v)}>
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
            <DialogTitle>{aEditar ? "Editar viatura" : "Nova viatura"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="matricula"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Matrícula</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ano"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ano</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="marca"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marca</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="modelo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modelo</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quilometragem"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quilometragem</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
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
                                v ? ESTADO_VIATURA[v as keyof typeof ESTADO_VIATURA].label : ""
                              }
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(ESTADO_VIATURA).map(([v, { label }]) => (
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
