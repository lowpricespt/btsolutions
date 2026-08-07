import { Wrench, Car } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { EstadoBadge } from "@/components/estado-badge"
import { ESTADO_FERRAMENTA, ESTADO_VIATURA } from "@/lib/labels"
import { formatMoeda } from "@/lib/format"

export default async function RecursosPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [{ data: ferramentas }, { data: viaturas }] = await Promise.all([
    supabase.from("ferramentas").select("*").eq("id_funcionario_responsavel", user!.id).order("nome"),
    supabase.from("viaturas").select("*").eq("id_funcionario_responsavel", user!.id).order("matricula"),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Os meus recursos</h1>
        <p className="text-sm text-muted-foreground">
          Ferramentas e viatura atribuídas a ti (consulta).
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-medium">
          <Wrench className="h-4 w-4 text-domain-orange" />
          Ferramentas
        </h2>
        {!ferramentas || ferramentas.length === 0 ? (
          <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            Não tens ferramentas atribuídas.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {ferramentas.map((f) => (
              <div key={f.id} className="rounded-xl border bg-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{f.nome}</p>
                    {f.codigo_inventario && (
                      <p className="text-xs text-muted-foreground">{f.codigo_inventario}</p>
                    )}
                  </div>
                  <EstadoBadge {...ESTADO_FERRAMENTA[f.estado]} />
                </div>
                {f.valor_aquisicao && (
                  <p className="mt-2 text-sm text-muted-foreground">{formatMoeda(f.valor_aquisicao)}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-medium">
          <Car className="h-4 w-4 text-domain-orange" />
          Viatura
        </h2>
        {!viaturas || viaturas.length === 0 ? (
          <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            Não tens viatura atribuída.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {viaturas.map((v) => (
              <div key={v.id} className="rounded-xl border bg-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{v.matricula}</p>
                    <p className="text-xs text-muted-foreground">
                      {[v.marca, v.modelo, v.ano].filter(Boolean).join(" ")}
                    </p>
                  </div>
                  <EstadoBadge {...ESTADO_VIATURA[v.estado]} />
                </div>
                {v.quilometragem !== null && (
                  <p className="mt-2 text-sm text-muted-foreground">{v.quilometragem} km</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
