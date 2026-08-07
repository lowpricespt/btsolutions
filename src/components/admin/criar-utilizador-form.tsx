"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const schema = z.object({
  nome: z.string().min(2, "Indica o nome"),
  email: z.string().min(1, "Indica o email").email("Email inválido"),
  telefone: z.string().optional(),
  tipo_utilizador: z.enum(["funcionario", "administrador"]),
  numero_funcionario: z.string().optional(),
  cargo: z.string().optional(),
  nivel_acesso: z.enum(["admin", "superadmin"]).optional(),
  departamento: z.string().optional(),
})

export function CriarUtilizadorForm() {
  const router = useRouter()
  const [aEnviar, setAEnviar] = useState(false)

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      tipo_utilizador: "funcionario",
      numero_funcionario: "",
      cargo: "",
      nivel_acesso: "admin",
      departamento: "",
    },
  })

  const tipo = form.watch("tipo_utilizador")

  async function onSubmit(values: z.infer<typeof schema>) {
    setAEnviar(true)
    const resposta = await fetch("/api/utilizadores/criar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
    const dados = await resposta.json()
    setAEnviar(false)

    if (!resposta.ok) {
      toast.error(dados.erro ?? "Não foi possível criar a conta.")
      return
    }

    toast.success(
      `Conta criada. Password temporária: ${dados.passwordTemporaria} (partilha com o utilizador)`,
      { duration: 20000 }
    )
    router.push("/admin/utilizadores")
    router.refresh()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="tipo_utilizador"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de conta</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      {(v: string | null) => (v === "administrador" ? "Administrador" : "Funcionário")}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="funcionario">Funcionário</SelectItem>
                  <SelectItem value="administrador">Administrador</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-4 sm:grid-cols-2">
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
          {tipo === "funcionario" ? (
            <>
              <FormField
                control={form.control}
                name="numero_funcionario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de funcionário</FormLabel>
                    <FormControl>
                      <Input placeholder="F002" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cargo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          ) : (
            <>
              <FormField
                control={form.control}
                name="nivel_acesso"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nível de acesso</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue>
                            {(v: string | null) => (v === "superadmin" ? "Superadmin" : "Admin")}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="superadmin">Superadmin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="departamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departamento</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>

        <Button type="submit" disabled={aEnviar}>
          {aEnviar && <Loader2 className="h-4 w-4 animate-spin" />}
          Criar conta
        </Button>
      </form>
    </Form>
  )
}
