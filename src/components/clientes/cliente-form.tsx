"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { createClient } from "@/lib/supabase/client"
import { CODIGO_POSTAL_REGEX, validarNIF } from "@/lib/validacao"
import { DISTRITOS } from "@/lib/distritos"
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"

const schema = z
  .object({
    nome: z.string().min(2, "Indica o nome"),
    email: z.string().min(1, "Indica o email").email("Email inválido"),
    telefone: z.string().optional(),
    morada: z.string().optional(),
    codigo_postal: z.string().optional(),
    localidade: z.string().optional(),
    nif: z.string().optional(),
    tipo_cliente: z.enum(["particular", "empresa"]),
    nome_empresa: z.string().optional(),
    morada_faturacao: z.string().optional(),
    codigo_postal_faturacao: z.string().optional(),
    observacoes: z.string().optional(),
  })
  .refine((v) => !v.codigo_postal || CODIGO_POSTAL_REGEX.test(v.codigo_postal), {
    message: "Formato inválido — usa 0000-000",
    path: ["codigo_postal"],
  })
  .refine((v) => !v.codigo_postal_faturacao || CODIGO_POSTAL_REGEX.test(v.codigo_postal_faturacao), {
    message: "Formato inválido — usa 0000-000",
    path: ["codigo_postal_faturacao"],
  })
  .refine((v) => !v.nif || validarNIF(v.nif), {
    message: "NIF inválido",
    path: ["nif"],
  })

type ClienteExistente = {
  id: string
  nif: string | null
  tipo_cliente: "particular" | "empresa"
  nome_empresa: string | null
  morada_faturacao: string | null
  codigo_postal_faturacao: string | null
  observacoes: string | null
  utilizadores: {
    nome: string
    email: string
    telefone: string | null
    morada: string | null
    codigo_postal: string | null
    localidade: string | null
  } | null
}

export function ClienteForm({
  baseHref,
  clienteExistente,
  podeEditarUtilizador,
}: {
  baseHref: string
  clienteExistente?: ClienteExistente
  podeEditarUtilizador: boolean
}) {
  const router = useRouter()
  const [aEnviar, setAEnviar] = useState(false)
  const u = clienteExistente?.utilizadores

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: u?.nome ?? "",
      email: u?.email ?? "",
      telefone: u?.telefone ?? "",
      morada: u?.morada ?? "",
      codigo_postal: u?.codigo_postal ?? "",
      localidade: u?.localidade ?? "",
      nif: clienteExistente?.nif ?? "",
      tipo_cliente: clienteExistente?.tipo_cliente ?? "particular",
      nome_empresa: clienteExistente?.nome_empresa ?? "",
      morada_faturacao: clienteExistente?.morada_faturacao ?? "",
      codigo_postal_faturacao: clienteExistente?.codigo_postal_faturacao ?? "",
      observacoes: clienteExistente?.observacoes ?? "",
    },
  })

  const tipoCliente = form.watch("tipo_cliente")

  async function onSubmit(values: z.infer<typeof schema>) {
    setAEnviar(true)

    if (!clienteExistente) {
      const resposta = await fetch("/api/utilizadores/criar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, tipo_utilizador: "cliente" }),
      })
      const dados = await resposta.json()

      if (!resposta.ok) {
        toast.error(dados.erro ?? "Não foi possível criar o cliente.")
        setAEnviar(false)
        return
      }

      toast.success(
        `Cliente criado. Password temporária: ${dados.passwordTemporaria} (partilha com o cliente)`,
        { duration: 15000 }
      )
      router.push(`${baseHref}/${dados.id}`)
      router.refresh()
      return
    }

    const supabase = createClient()

    const { error: erroClientes } = await supabase
      .from("clientes")
      .update({
        nif: values.nif || null,
        tipo_cliente: values.tipo_cliente,
        nome_empresa: values.tipo_cliente === "empresa" ? values.nome_empresa || null : null,
        morada_faturacao: values.morada_faturacao || null,
        codigo_postal_faturacao: values.codigo_postal_faturacao || null,
        observacoes: values.observacoes || null,
      })
      .eq("id", clienteExistente.id)

    if (erroClientes) {
      toast.error("Não foi possível guardar os dados do cliente.")
      setAEnviar(false)
      return
    }

    if (podeEditarUtilizador) {
      const { error: erroUtilizador } = await supabase
        .from("utilizadores")
        .update({
          nome: values.nome,
          telefone: values.telefone || null,
          morada: values.morada || null,
          codigo_postal: values.codigo_postal || null,
          localidade: values.localidade || null,
        })
        .eq("id", clienteExistente.id)

      if (erroUtilizador) {
        toast.error("Não foi possível guardar os dados de contacto.")
        setAEnviar(false)
        return
      }
    }

    toast.success("Cliente atualizado.")
    setAEnviar(false)
    router.refresh()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Contacto</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input disabled={!!clienteExistente && !podeEditarUtilizador} {...field} />
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
                    <Input type="email" disabled={!!clienteExistente} {...field} />
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
                    <Input disabled={!!clienteExistente && !podeEditarUtilizador} {...field} />
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
                  <FormLabel>Distrito</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!!clienteExistente && !podeEditarUtilizador}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Escolhe o distrito">
                          {(value: string | null) => value || ""}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DISTRITOS.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
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
              name="morada"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Morada</FormLabel>
                  <FormControl>
                    <Input disabled={!!clienteExistente && !podeEditarUtilizador} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="codigo_postal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código postal</FormLabel>
                  <FormControl>
                    <Input disabled={!!clienteExistente && !podeEditarUtilizador} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {clienteExistente && !podeEditarUtilizador && (
            <p className="mt-2 text-xs text-muted-foreground">
              Só um administrador pode alterar os dados de contacto.
            </p>
          )}
        </div>

        <Separator />

        <div>
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Faturação</h2>
          <div className="grid gap-4 sm:grid-cols-2">
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
              name="tipo_cliente"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de cliente</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue>
                          {(v: string | null) => (v === "empresa" ? "Empresa" : "Particular")}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="particular">Particular</SelectItem>
                      <SelectItem value="empresa">Empresa</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {tipoCliente === "empresa" && (
              <FormField
                control={form.control}
                name="nome_empresa"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Nome da empresa</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="morada_faturacao"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Morada de faturação</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="codigo_postal_faturacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código postal de faturação</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="observacoes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações internas</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={aEnviar}>
          {aEnviar && <Loader2 className="h-4 w-4 animate-spin" />}
          {clienteExistente ? "Guardar alterações" : "Criar cliente"}
        </Button>
      </form>
    </Form>
  )
}
