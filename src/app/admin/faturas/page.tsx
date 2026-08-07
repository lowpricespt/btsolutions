import { createClient } from "@/lib/supabase/server"
import { FaturasManager } from "@/components/admin/faturas-manager"

export default async function FaturasPage() {
  const supabase = await createClient()

  const [{ data: faturas }, { data: pedidos }] = await Promise.all([
    supabase
      .from("faturas")
      .select("*, pedidos(titulo, clientes(utilizadores(nome)))")
      .order("data_emissao", { ascending: false }),
    supabase
      .from("pedidos")
      .select("id, titulo, valor_final, valor_orcamento, clientes(utilizadores(nome))")
      .in("estado", ["em_curso", "concluido"]),
  ])

  const idsComFatura = new Set((faturas ?? []).map((f) => f.id_pedido))
  const pedidosSemFatura = (pedidos ?? [])
    .filter((p) => !idsComFatura.has(p.id))
    .map((p) => ({
      id: p.id,
      titulo: p.titulo,
      valor_final: p.valor_final ?? p.valor_orcamento,
      cliente_nome: p.clientes?.utilizadores?.nome ?? "Cliente",
    }))

  const ano = new Date().getFullYear()
  const proximoNumero = `FT-${ano}-${String((faturas?.length ?? 0) + 1).padStart(4, "0")}`

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Faturas</h1>
        <p className="text-sm text-muted-foreground">Faturação de pedidos concluídos ou em curso.</p>
      </div>
      <FaturasManager
        faturas={faturas ?? []}
        pedidosSemFatura={pedidosSemFatura}
        proximoNumero={proximoNumero}
      />
    </div>
  )
}
