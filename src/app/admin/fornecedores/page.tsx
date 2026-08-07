import { createClient } from "@/lib/supabase/server"
import { FornecedoresManager } from "@/components/admin/fornecedores-manager"

export default async function FornecedoresPage() {
  const supabase = await createClient()
  const { data } = await supabase.from("fornecedores").select("*").order("nome")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Fornecedores</h1>
        <p className="text-sm text-muted-foreground">Fornecedores de material da BTS.</p>
      </div>
      <FornecedoresManager fornecedores={data ?? []} />
    </div>
  )
}
