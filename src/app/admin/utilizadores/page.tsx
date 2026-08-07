import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { UtilizadoresLista } from "@/components/admin/utilizadores-lista"

export default async function UtilizadoresPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("utilizadores")
    .select("id, nome, email, tipo_utilizador, estado, data_registo")
    .order("data_registo", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Utilizadores</h1>
          <p className="text-sm text-muted-foreground">Todas as contas da plataforma.</p>
        </div>
        <Button render={<Link href="/admin/utilizadores/novo"><PlusCircle className="h-4 w-4" />Nova conta</Link>} />
      </div>
      <UtilizadoresLista utilizadores={data ?? []} />
    </div>
  )
}
