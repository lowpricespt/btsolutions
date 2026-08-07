import { createClient } from "@/lib/supabase/server"
import { FerramentasManager } from "@/components/admin/ferramentas-manager"

export default async function FerramentasPage() {
  const supabase = await createClient()
  const [{ data: ferramentas }, { data: funcionariosRaw }] = await Promise.all([
    supabase.from("ferramentas").select("*, funcionarios(utilizadores(nome))").order("nome"),
    supabase.from("funcionarios").select("id, utilizadores(nome)").eq("ativo", true),
  ])

  const funcionarios = (funcionariosRaw ?? [])
    .filter((f) => f.utilizadores)
    .map((f) => ({ id: f.id, nome: f.utilizadores!.nome }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Ferramentas</h1>
        <p className="text-sm text-muted-foreground">Inventário de ferramentas da BTS.</p>
      </div>
      <FerramentasManager ferramentas={ferramentas ?? []} funcionarios={funcionarios} />
    </div>
  )
}
