import { createClient } from "@/lib/supabase/client"

/**
 * Regista uma ação no log de auditoria (log_atividade). A RLS só permite a
 * cada utilizador inserir o seu próprio registo (id_utilizador = auth.uid());
 * falhas são ignoradas em silêncio — o log é informativo, não deve bloquear
 * a ação principal se a escrita falhar.
 */
export async function registarAtividade(
  acao: string,
  entidadeAfetada?: string,
  idEntidadeAfetada?: number,
  detalhes?: string
) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from("log_atividade").insert({
    id_utilizador: user.id,
    acao,
    entidade_afetada: entidadeAfetada,
    id_entidade_afetada: idEntidadeAfetada,
    detalhes,
  })
}
