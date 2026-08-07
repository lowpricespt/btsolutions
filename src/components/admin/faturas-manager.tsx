"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Pencil, PlusCircle } from "lucide-react"
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
import { ESTADO_PAGAMENTO, METODO_PAGAMENTO } from "@/lib/labels"
import { formatData, formatMoeda } from "@/lib/format"

export type Fatura = {
  id: number
  id_pedido: number
  numero_fatura: string
  data_emissao: string
  valor_total: number
  estado_pagamento: "pendente" | "pago" | "parcial"
  metodo_pagamento: "mbway" | "transferencia" | "multibanco" | "numerario" | null
  pedidos: { titulo: string; clientes: { utilizadores: { nome: string } | null } | null } | null
}
type PedidoSemFatura = { id: number; titulo: string; valor_final: number | null; cliente_nome: string }

const semMetodo = "__nenhum__"

const schema = z.object({
  id_pedido: z.string().min(1, "Escolhe o pedido"),
  numero_fatura: z.string().min(1, "Indica o número da fatura"),
  data_emissao: z.string().min(1, "Indica a data"),
  valor_total: z.string().min(1, "Indica o valor"),
  estado_pagamento: z.enum(["pendente", "pago", "parcial"]),
  metodo_pagamento: z.string(),
})

export function FaturasManager({
  faturas,
  pedidosSemFatura,
  proximoNumero,
}: {
  faturas: Fatura[]
  pedidosSemFatura: PedidoSemFatura[]
  proximoNumero: string
}) {
  const router = useRouter()
  const [aberto, setAberto] = useState(false)
  const [aEditar, setAEditar] = useState<Fatura | null>(null)
  const [aGuardar, setAGuardar] = useState(false)

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      id_pedido: "",
      numero_fatura: proximoNumero,
      data_emissao: new Date().toISOString().slice(0, 10),
      valor_total: "",
      estado_pagamento: "pendente",
      metodo_pagamento: semMetodo,
    },
  })

  function abrirNovo() {
    setAEditar(null)
    form.reset({
      id_pedido: "",
      numero_fatura: proximoNumero,
      data_emissao: new Date().toISOString().slice(0, 10),
      valor_total: "",
      estado_pagamento: "pendente",
      metodo_pagamento: semMetodo,
    })
    setAberto(true)
  }

  function abrirEditar(f: Fatura) {
    setAEditar(f)
    form.reset({
      id_pedido: String(f.id_pedido),
      numero_fatura: f.numero_fatura,
      data_emissao: f.data_emissao,
      valor_total: String(f.valor_total),
      estado_pagamento: f.estado_pagamento,
      metodo_pagamento: f.metodo_pagamento ?? semMetodo,
    })
    setAberto(true)
  }

  async function onSubmit(values: z.infer<typeof schema>) {
    setAGuardar(true)
    const supabase = createClient()
    const payload = {
      id_pedido: Number(values.id_pedido),
      numero_fatura: values.numero_fatura,
      data_emissao: values.data_emissao,
      valor_total: Number(values.valor_total),
      estado_pagamento: values.estado_pagamento,
      metodo_pagamento:
        values.metodo_pagamento === semMetodo
          ? null
          : (values.metodo_pagamento as "mbway" | "transferencia" | "multibanco" | "numerario"),
    }

    const { error } = aEditar
      ? await supabase.from("faturas").update(payload).eq("id", aEditar.id)
      : await supabase.from("faturas").insert(payload)

    setAGuardar(false)
    if (error) {
      toast.error(error.message.includes("duplicate") ? "Já existe uma fatura com esse número." : "Não foi possível guardar.")
      return
    }
    toast.success(aEditar ? "Fatura atualizada." : "Fatura criada.")
    setAberto(false)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={abrirNovo} disabled={!aEditar && pedidosSemFatura.length === 0}>
          <PlusCircle className="h-4 w-4" />
          Nova fatura
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Pedido</TableHead>
              <TableHead>Emissão</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {faturas.map((f) => (
              <TableRow key={f.id}>
                <TableCell className="font-medium">{f.numero_fatura}</TableCell>
                <TableCell className="text-muted-foreground">
                  <Link href={`/admin/pedidos/${f.id_pedido}`} className="hover:underline">
                    {f.pedidos?.titulo}
                  </Link>
                  {f.pedidos?.clientes?.utilizadores?.nome && (
                    <p className="text-xs">{f.pedidos.clientes.utilizadores.nome}</p>
                  )}
                </TableCell>
                <TableCell>{formatData(f.data_emissao)}</TableCell>
                <TableCell>{formatMoeda(f.valor_total)}</TableCell>
                <TableCell>
                  <EstadoBadge {...ESTADO_PAGAMENTO[f.estado_pagamento]} />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon-sm" onClick={() => abrirEditar(f)}>
                    <Pencil className="h-3.5 w-3.5" />
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
            <DialogTitle>{aEditar ? "Editar fatura" : "Nova fatura"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-4">
              <FormField
                control={form.control}
                name="id_pedido"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pedido</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange} disabled={!!aEditar}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Escolhe o pedido">
                            {(v: string | null) => {
                              const p =
                                pedidosSemFatura.find((p) => String(p.id) === v) ??
                                (aEditar?.pedidos ? { titulo: aEditar.pedidos.titulo } : null)
                              return p?.titulo
                            }}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {aEditar && (
                          <SelectItem value={String(aEditar.id_pedido)}>{aEditar.pedidos?.titulo}</SelectItem>
                        )}
                        {pedidosSemFatura.map((p) => (
                          <SelectItem key={p.id} value={String(p.id)}>
                            {p.titulo} — {p.cliente_nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="numero_fatura"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="data_emissao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de emissão</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="valor_total"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor total (€)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="estado_pagamento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado do pagamento</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue>
                              {(v: string | null) =>
                                v ? ESTADO_PAGAMENTO[v as keyof typeof ESTADO_PAGAMENTO].label : ""
                              }
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(ESTADO_PAGAMENTO).map(([v, { label }]) => (
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
                  name="metodo_pagamento"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Método de pagamento</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue>
                              {(v: string | null) =>
                                !v || v === semMetodo
                                  ? "Não definido"
                                  : METODO_PAGAMENTO[v as keyof typeof METODO_PAGAMENTO].label
                              }
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={semMetodo}>Não definido</SelectItem>
                          {Object.entries(METODO_PAGAMENTO).map(([v, { label }]) => (
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
