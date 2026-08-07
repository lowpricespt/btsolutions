import { createClient } from "@/lib/supabase/server"
import { TiposServicoManager } from "@/components/admin/tipos-servico-manager"

export default async function TiposServicoPage() {
  const supabase = await createClient()
  const [{ data: tiposServico }, { data: especialidades }] = await Promise.all([
    supabase.from("tipos_servico").select("*, especialidades(nome)").order("nome"),
    supabase.from("especialidades").select("id, nome").order("nome"),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Tipos de Serviço</h1>
        <p className="text-sm text-muted-foreground">Catálogo de serviços que a BTS presta.</p>
      </div>
      <TiposServicoManager tiposServico={tiposServico ?? []} especialidades={especialidades ?? []} />
    </div>
  )
}
