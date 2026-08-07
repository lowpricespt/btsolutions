"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { createClient } from "@/lib/supabase/client"
import { registarAtividade } from "@/lib/registar-atividade"
import { EstadoBadge } from "@/components/estado-badge"
import { TIPO_UTILIZADOR, ESTADO_UTILIZADOR } from "@/lib/labels"
import { iniciais, formatData } from "@/lib/format"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type UtilizadorLinha = {
  id: string
  nome: string
  email: string
  tipo_utilizador: "cliente" | "funcionario" | "administrador"
  estado: "ativo" | "inativo"
  data_registo: string
}

export function UtilizadoresLista({ utilizadores }: { utilizadores: UtilizadorLinha[] }) {
  const router = useRouter()
  const [aAlterar, setAAlterar] = useState<string | null>(null)

  async function alternarEstado(u: UtilizadorLinha) {
    const novoEstado = u.estado === "ativo" ? "inativo" : "ativo"
    if (!confirm(`${novoEstado === "inativo" ? "Desativar" : "Ativar"} a conta de ${u.nome}?`)) return

    setAAlterar(u.id)
    const supabase = createClient()
    const { error } = await supabase.from("utilizadores").update({ estado: novoEstado }).eq("id", u.id)
    setAAlterar(null)

    if (error) {
      toast.error("Não foi possível atualizar.")
      return
    }
    toast.success(`Conta ${novoEstado === "inativo" ? "desativada" : "ativada"}.`)
    registarAtividade(
      novoEstado === "inativo" ? "Desativou uma conta" : "Ativou uma conta",
      "utilizadores",
      undefined,
      u.nome
    )
    router.refresh()
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Registo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="w-28" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {utilizadores.map((u) => (
            <TableRow key={u.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-domain-blue-soft text-domain-blue text-xs font-semibold">
                      {iniciais(u.nome)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{u.nome}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <EstadoBadge {...TIPO_UTILIZADOR[u.tipo_utilizador]} />
              </TableCell>
              <TableCell className="text-muted-foreground">{formatData(u.data_registo)}</TableCell>
              <TableCell>
                <EstadoBadge {...ESTADO_UTILIZADOR[u.estado]} />
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={aAlterar === u.id}
                  onClick={() => alternarEstado(u)}
                >
                  {u.estado === "ativo" ? "Desativar" : "Ativar"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
