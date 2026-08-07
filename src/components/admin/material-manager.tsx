"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { AlertTriangle, Loader2, Pencil, PlusCircle, Trash2 } from "lucide-react"
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
import { formatMoeda } from "@/lib/format"
import { cn } from "@/lib/utils"

export type Material = {
  id: number
  nome: string
  categoria: string | null
  unidade_medida: string | null
  quantidade_stock: number
  quantidade_minima: number
  preco_unitario: number | null
  id_fornecedor: number | null
  fornecedores: { nome: string } | null
}
type Fornecedor = { id: number; nome: string }

const semFornecedor = "__nenhum__"

const schema = z.object({
  nome: z.string().min(2, "Indica o nome"),
  categoria: z.string().optional(),
  unidade_medida: z.string().optional(),
  quantidade_stock: z.string().min(1, "Indica a quantidade"),
  quantidade_minima: z.string().min(1, "Indica o mínimo"),
  preco_unitario: z.string().optional(),
  id_fornecedor: z.string(),
})

export function MaterialManager({
  materiais,
  fornecedores,
}: {
  materiais: Material[]
  fornecedores: Fornecedor[]
}) {
  const router = useRouter()
  const [aberto, setAberto] = useState(false)
  const [aEditar, setAEditar] = useState<Material | null>(null)
  const [aGuardar, setAGuardar] = useState(false)

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
      categoria: "",
      unidade_medida: "",
      quantidade_stock: "0",
      quantidade_minima: "0",
      preco_unitario: "",
      id_fornecedor: semFornecedor,
    },
  })

  function abrirNovo() {
    setAEditar(null)
    form.reset({
      nome: "",
      categoria: "",
      unidade_medida: "",
      quantidade_stock: "0",
      quantidade_minima: "0",
      preco_unitario: "",
      id_fornecedor: semFornecedor,
    })
    setAberto(true)
  }

  function abrirEditar(m: Material) {
    setAEditar(m)
    form.reset({
      nome: m.nome,
      categoria: m.categoria ?? "",
      unidade_medida: m.unidade_medida ?? "",
      quantidade_stock: String(m.quantidade_stock),
      quantidade_minima: String(m.quantidade_minima),
      preco_unitario: m.preco_unitario ? String(m.preco_unitario) : "",
      id_fornecedor: m.id_fornecedor ? String(m.id_fornecedor) : semFornecedor,
    })
    setAberto(true)
  }

  async function onSubmit(values: z.infer<typeof schema>) {
    setAGuardar(true)
    const supabase = createClient()
    const payload = {
      nome: values.nome,
      categoria: values.categoria || null,
      unidade_medida: values.unidade_medida || null,
      quantidade_stock: Number(values.quantidade_stock),
      quantidade_minima: Number(values.quantidade_minima),
      preco_unitario: values.preco_unitario ? Number(values.preco_unitario) : null,
      id_fornecedor: values.id_fornecedor === semFornecedor ? null : Number(values.id_fornecedor),
    }

    const { error } = aEditar
      ? await supabase.from("materiais").update(payload).eq("id", aEditar.id)
      : await supabase.from("materiais").insert(payload)

    setAGuardar(false)
    if (error) {
      toast.error("Não foi possível guardar.")
      return
    }
    toast.success(aEditar ? "Material atualizado." : "Material criado.")
    setAberto(false)
    router.refresh()
  }

  async function apagar(m: Material) {
    if (!confirm(`Apagar "${m.nome}"?`)) return
    const supabase = createClient()
    const { error } = await supabase.from("materiais").delete().eq("id", m.id)
    if (error) {
      toast.error("Não foi possível apagar (pode estar associado a trabalhos).")
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
          Novo material
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Fornecedor</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {materiais.map((m) => {
              const stockBaixo = m.quantidade_stock < m.quantidade_minima
              return (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-1.5">
                      {stockBaixo && <AlertTriangle className="h-3.5 w-3.5 text-domain-orange" />}
                      {m.nome}
                    </div>
                    {m.categoria && <p className="text-xs text-muted-foreground">{m.categoria}</p>}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{m.fornecedores?.nome || "—"}</TableCell>
                  <TableCell className={cn(stockBaixo && "font-medium text-domain-orange")}>
                    {m.quantidade_stock} {m.unidade_medida}
                    <span className="text-muted-foreground"> / mín. {m.quantidade_minima}</span>
                  </TableCell>
                  <TableCell>{formatMoeda(m.preco_unitario)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon-sm" onClick={() => abrirEditar(m)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => apagar(m)}>
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{aEditar ? "Editar material" : "Novo material"}</DialogTitle>
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
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="categoria"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unidade_medida"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unidade</FormLabel>
                      <FormControl>
                        <Input placeholder="un, m, kg…" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="quantidade_stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock atual</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantidade_minima"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock mínimo</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="preco_unitario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço unitário (€)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="id_fornecedor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fornecedor</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue>
                              {(v: string | null) =>
                                v === semFornecedor || !v
                                  ? "Nenhum"
                                  : fornecedores.find((f) => String(f.id) === v)?.nome
                              }
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={semFornecedor}>Nenhum</SelectItem>
                          {fornecedores.map((f) => (
                            <SelectItem key={f.id} value={String(f.id)}>
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
