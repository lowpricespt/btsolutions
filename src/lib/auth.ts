import type { Database } from "@/lib/database.types"

export type TipoUtilizador = Database["public"]["Enums"]["tipo_utilizador_enum"]

export const ROTA_POR_PERFIL: Record<TipoUtilizador, string> = {
  cliente: "/cliente",
  funcionario: "/equipa",
  administrador: "/admin",
}
