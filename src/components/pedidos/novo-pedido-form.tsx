"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"

import { PRIORIDADE } from "@/lib/labels"
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
  FormDescription,
} from "@/components/ui/form"

type TipoServico = {
  id: number
  nome: string
  descricao: string | null
  preco_base: number | null
  especialidades: { nome: string } | null
}

const schema = z.object({
  id_tipo_servico: z.string().min(1, "Escolhe o tipo de serviço"),
  titulo: z.string().min(3, "Descreve brevemente o pedido"),
  descricao: z.string().optional(),
  morada_servico: z.string().min(3, "Indica a morada onde o serviço vai ser feito"),
  codigo_postal_servico: z.string().optional(),
  data_pretendida: z.string().optional(),
  prioridade: z.enum(["baixa", "normal", "alta", "urgente"]),
})

export function NovoPedidoForm({ tiposServico }: { tiposServico: TipoServico[] }) {
  const router = useRouter()
  const [erro, setErro] = useState<string | null>(null)
  const [aEnviar, setAEnviar] = useState(false)

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      id_tipo_servico: "",
      titulo: "",
      descricao: "",
      morada_servico: "",
      codigo_postal_servico: "",
      data_pretendida: "",
      prioridade: "normal",
    },
  })

  async function onSubmit(values: z.infer<typeof schema>) {
    setErro(null)
    setAEnviar(true)

    const resposta = await fetch("/api/pedidos/criar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_tipo_servico: Number(values.id_tipo_servico),
        titulo: values.titulo,
        descricao: values.descricao || null,
        morada_servico: values.morada_servico,
        codigo_postal_servico: values.codigo_postal_servico || null,
        data_pretendida: values.data_pretendida || null,
        prioridade: values.prioridade,
      }),
    })
    const dados = await resposta.json()

    if (!resposta.ok) {
      setErro(dados.erro ?? "Não foi possível criar o pedido.")
      setAEnviar(false)
      return
    }

    router.push(`/cliente/pedidos/${dados.id}`)
    router.refresh()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="id_tipo_servico"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de serviço</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Escolhe o serviço que precisas">
                      {(value: string | null) =>
                        tiposServico.find((ts) => String(ts.id) === value)?.nome
                      }
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tiposServico.map((ts) => (
                    <SelectItem key={ts.id} value={String(ts.id)}>
                      {ts.nome}
                      {ts.especialidades ? ` — ${ts.especialidades.nome}` : ""}
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
          name="titulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título do pedido</FormLabel>
              <FormControl>
                <Input placeholder="Ex.: Substituir tomada da cozinha" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição (opcional)</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder="Explica com mais detalhe o que precisas"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="morada_servico"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Morada do serviço</FormLabel>
                <FormControl>
                  <Input placeholder="Rua, número, andar" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="codigo_postal_servico"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código postal</FormLabel>
                <FormControl>
                  <Input placeholder="0000-000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="data_pretendida"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data pretendida (opcional)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormDescription>Vamos tentar agendar o mais próximo possível.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="prioridade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prioridade</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue>
                        {(value: string | null) =>
                          value ? PRIORIDADE[value as keyof typeof PRIORIDADE].label : ""
                        }
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {erro && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {erro}
          </p>
        )}

        <Button type="submit" disabled={aEnviar}>
          {aEnviar && <Loader2 className="h-4 w-4 animate-spin" />}
          Pedir serviço
        </Button>
      </form>
    </Form>
  )
}
