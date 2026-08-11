import { createClient } from "@/lib/supabase/server"
import { MaterialManager } from "@/components/admin/material-manager"

export default async function MaterialPage() {
  const supabase = await createClient()
  const [{ data: materiais }, { data: fornecedores }] = await Promise.all([
    supabase.from("materiais").select("*, fornecedores(nome)").order("nome").limit(200),
    supabase.from("fornecedores").select("id, nome").order("nome"),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Material</h1>
        <p className="text-sm text-muted-foreground">Stock de materiais da BTS.</p>
      </div>
      <MaterialManager materiais={materiais ?? []} fornecedores={fornecedores ?? []} />
    </div>
  )
}
