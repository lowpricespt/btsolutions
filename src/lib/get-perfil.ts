import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ROTA_POR_PERFIL, type TipoUtilizador } from "@/lib/auth"

/**
 * Busca o utilizador autenticado + a sua linha em "utilizadores". Redireciona
 * para /login se não autenticado, ou para a área correta do seu perfil se
 * tentar aceder a uma área a que não pertence (a RLS já bloqueia os dados —
 * isto é só para não mostrar uma área errada/vazia na UI).
 */
export async function exigirPerfil(tiposPermitidos: TipoUtilizador[]) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: perfil } = await supabase
    .from("utilizadores")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!perfil) redirect("/login")

  if (!tiposPermitidos.includes(perfil.tipo_utilizador)) {
    redirect(ROTA_POR_PERFIL[perfil.tipo_utilizador])
  }

  return { user, perfil, supabase }
}
