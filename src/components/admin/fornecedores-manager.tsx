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

export type Fornecedor = {
  id: number
  nome: string
  nif: string | null
  morada: string | null
  codigo_postal: string | null
  localidade: string | null
  telefone: string | null
  email: string | null
  contacto_nome: string | null
}

const schema = z.object({
  nome: z.string().min(2, "Indica o nome"),
  nif: z.string().optional(),
  morada: z.string().optional(),
  codigo_postal: z.string().optional(),
  localidade: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  contacto_nome: z.string().optional(),
})

const VAZIO: z.infer<typeof schema> = {
  nome: "",
  nif: "",
  morada: "",
  codigo_postal: "",
  localidade: "",
  telefone: "",
  email: "",
  contacto_nome: "",
}

export function FornecedoresManager({ fornecedores }: { fornecedores: Fornecedor[] }) {
  const router = useRouter()
  const [aberto, setAberto] = useState(false)
  const [aEditar, setAEditar] = useState<Fornecedor | null>(null)
  const [aGuardar, setAGuardar] = useState(false)

  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: VAZIO })

  function abrirNovo() {
    setAEditar(null)
    form.reset(VAZIO)
    setAberto(true)
  }

  function abrirEditar(f: Fornecedor) {
    setAEditar(f)
    form.reset({
      nome: f.nome,
      nif: f.nif ?? "",
      morada: f.morada ?? "",
      codigo_postal: f.codigo_postal ?? "",
      localidade: f.localidade ?? "",
      telefone: f.telefone ?? "",
      email: f.email ?? "",
      contacto_nome: f.contacto_nome ?? "",
    })
    setAberto(true)
  }

  async function onSubmit(values: z.infer<typeof schema>) {
    setAGuardar(true)
    const supabase = createClient()
    const payload = {
      nome: values.nome,
      nif: values.nif || null,
      morada: values.morada || null,
      codigo_postal: values.codigo_postal || null,
      localidade: values.localidade || null,
      telefone: values.telefone || null,
      email: values.email || null,
      contacto_nome: values.contacto_nome || null,
    }

    const { error } = aEditar
      ? await supabase.from("fornecedores").update(payload).eq("id", aEditar.id)
      : await supabase.from("fornecedores").insert(payload)

    setAGuardar(false)
    if (error) {
      toast.error("Não foi possível guardar.")
      return
    }
    toast.success(aEditar ? "Fornecedor atualizado." : "Fornecedor criado.")
    setAberto(false)
    router.refresh()
  }

  async function apagar(f: Fornecedor) {
    if (!confirm(`Apagar o fornecedor "${f.nome}"?`)) return
    const supabase = createClient()
    const { error } = await supabase.from("fornecedores").delete().eq("id", f.id)
    if (error) {
      toast.error("Não foi possível apagar (pode ter material associado).")
      return
    }
    toast.success("Fornecedor apagado.")
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={abrirNovo}>
          <PlusCircle className="h-4 w-4" />
          Novo fornecedor
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Localidade</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {fornecedores.map((f) => (
              <TableRow key={f.id}>
                <TableCell className="font-medium">{f.nome}</TableCell>
                <TableCell className="text-muted-foreground">{f.telefone || f.email || "—"}</TableCell>
                <TableCell className="text-muted-foreground">{f.localidade || "—"}</TableCell>
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
            <DialogTitle>{aEditar ? "Editar fornecedor" : "Novo fornecedor"}</DialogTitle>
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
                  name="nif"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NIF</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contacto_nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pessoa de contacto</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="telefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="morada"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Morada</FormLabel>
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
                  name="codigo_postal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código postal</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="localidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Localidade</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
