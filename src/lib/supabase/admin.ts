import "server-only"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

/**
 * Cliente com a service_role key — só pode ser usado em código server-only
 * (route handlers, server actions), NUNCA num Client Component. É necessário
 * para operações que a app não pode fazer com o cliente anon/autenticado,
 * como criar contas de utilizador (funcionário/administrador/cliente) sem
 * substituir a sessão de quem está a criar a conta.
 *
 * Requer a variável de ambiente SUPABASE_SERVICE_ROLE_KEY (server-only, sem
 * prefixo NEXT_PUBLIC_) — obtém-se em Supabase Dashboard → Settings → API.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY não está definida. Adiciona-a ao .env.local (Supabase Dashboard → Settings → API) para poderes criar contas de utilizador."
    )
  }

  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
