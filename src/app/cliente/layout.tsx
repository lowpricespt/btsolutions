import { exigirPerfil } from "@/lib/get-perfil"
import { AppShell } from "@/components/layout/app-shell"
import type { NavGroup } from "@/components/layout/nav-types"

const GROUPS: NavGroup[] = [
  {
    items: [
      { label: "Os meus pedidos", href: "/cliente", icon: "Home", dominio: "blue" },
      { label: "Novo pedido", href: "/cliente/pedidos/novo", icon: "PlusCircle", dominio: "green" },
    ],
  },
]

export default async function ClienteLayout({ children }: { children: React.ReactNode }) {
  const { perfil } = await exigirPerfil(["cliente"])

  return (
    <AppShell groups={GROUPS} nome={perfil.nome} email={perfil.email} perfilLabel="Cliente">
      {children}
    </AppShell>
  )
}
