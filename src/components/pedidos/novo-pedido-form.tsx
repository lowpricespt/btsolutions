"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"

import { PRIORIDADE } from "@/lib/labels"
import { traduzEnum } from "@/lib/labels-i18n"
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

export function NovoPedidoForm({ tiposServico }: { tiposServico: TipoServico[] }) {
  const router = useRouter()
  const t = useTranslations("Cliente.novoPedido")
  const tEnums = useTranslations("Enums")
  const prioridade = traduzEnum(tEnums, "prioridade", PRIORIDADE)
  const [erro, setErro] = useState<string | null>(null)
  const [aEnviar, setAEnviar] = useState(false)

  const schema = z.object({
    id_tipo_servico: z.string().min(1, t("erros.tipoServico")),
    titulo: z.string().min(3, t("erros.titulo")),
    descricao: z.string().optional(),
    morada_servico: z.string().min(3, t("erros.morada")),
    codigo_postal_servico: z.string().optional(),
    data_pretendida: z.string().optional(),
    prioridade: z.enum(["baixa", "normal", "alta", "urgente"]),
  })

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
      setErro(dados.erro ?? t("erros.generico"))
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
              <FormLabel>{t("tipoServico")}</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("escolheServico")}>
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
              <FormLabel>{t("tituloPedido")}</FormLabel>
              <FormControl>
                <Input placeholder={t("tituloPlaceholder")} {...field} />
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
              <FormLabel>{t("descricao")}</FormLabel>
              <FormControl>
                <Textarea rows={4} placeholder={t("descricaoPlaceholder")} {...field} />
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
                <FormLabel>{t("moradaServico")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("moradaPlaceholder")} {...field} />
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
                <FormLabel>{t("codigoPostal")}</FormLabel>
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
                <FormLabel>{t("dataPretendida")}</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormDescription>{t("dataPretendidaDescricao")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="prioridade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("prioridade")}</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue>
                        {(value: string | null) => (value ? prioridade[value].label : "")}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(prioridade).map(([valor, { label }]) => (
                      <SelectItem key={valor} value={valor}>
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

        {erro && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {erro}
          </p>
        )}

        <Button type="submit" disabled={aEnviar}>
          {aEnviar && <Loader2 className="h-4 w-4 animate-spin" />}
          {t("botao")}
        </Button>
      </form>
    </Form>
  )
}
