import { createClient } from "@/lib/supabase/server"
import { ViaturasManager } from "@/components/admin/viaturas-manager"

export default async function ViaturasPage() {
  const supabase = await createClient()
  const [{ data: viaturas }, { data: funcionariosRaw }] = await Promise.all([
    supabase.from("viaturas").select("*, funcionarios(utilizadores(nome))").order("matricula"),
    supabase.from("funcionarios").select("id, utilizadores(nome)").eq("ativo", true),
  ])

  const funcionarios = (funcionariosRaw ?? [])
    .filter((f) => f.utilizadores)
    .map((f) => ({ id: f.id, nome: f.utilizadores!.nome }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Viaturas</h1>
        <p className="text-sm text-muted-foreground">Frota da BTS.</p>
      </div>
      <ViaturasManager viaturas={viaturas ?? []} funcionarios={funcionarios} />
    </div>
  )
}
