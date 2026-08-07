import { createClient } from "@/lib/supabase/server"
import { EspecialidadesManager } from "@/components/admin/especialidades-manager"

export default async function EspecialidadesPage() {
  const supabase = await createClient()
  const { data } = await supabase.from("especialidades").select("*").order("nome")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Especialidades</h1>
        <p className="text-sm text-muted-foreground">Áreas de trabalho da BTS.</p>
      </div>
      <EspecialidadesManager especialidades={data ?? []} />
    </div>
  )
}
