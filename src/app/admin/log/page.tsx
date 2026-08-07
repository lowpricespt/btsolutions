import { ScrollText } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { formatDataHora } from "@/lib/format"

export default async function LogAtividadePage() {
  const supabase = await createClient()
  const { data: log } = await supabase
    .from("log_atividade")
    .select("*, utilizadores(nome, tipo_utilizador)")
    .order("data_hora", { ascending: false })
    .limit(200)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Log de Atividade</h1>
        <p className="text-sm text-muted-foreground">Registo de auditoria (só leitura).</p>
      </div>

      {!log || log.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          Ainda não há atividade registada.
        </div>
      ) : (
        <div className="space-y-2">
          {log.map((l) => (
            <div key={l.id} className="flex items-start gap-3 rounded-lg border bg-card p-3">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-domain-purple-soft text-domain-purple">
                <ScrollText className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm">
                  <span className="font-medium">{l.utilizadores?.nome ?? "Utilizador removido"}</span>{" "}
                  {l.acao}
                  {l.entidade_afetada && (
                    <span className="text-muted-foreground">
                      {" "}
                      · {l.entidade_afetada}
                      {l.id_entidade_afetada ? ` #${l.id_entidade_afetada}` : ""}
                    </span>
                  )}
                </p>
                {l.detalhes && <p className="text-sm text-muted-foreground">{l.detalhes}</p>}
                <p className="mt-0.5 text-xs text-muted-foreground">{formatDataHora(l.data_hora)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
