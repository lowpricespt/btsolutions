import { exigirPerfil } from "@/lib/get-perfil"
import { AppShell } from "@/components/layout/app-shell"
import type { NavGroup } from "@/components/layout/nav-types"

const GROUPS: NavGroup[] = [
  {
    items: [{ label: "Dashboard", href: "/equipa", icon: "Home", dominio: "blue" }],
  },
  {
    titulo: "Operação",
    items: [
      { label: "Clientes", href: "/equipa/clientes", icon: "Users", dominio: "blue" },
      { label: "Pedidos", href: "/equipa/pedidos", icon: "ClipboardList", dominio: "green" },
      { label: "Agenda", href: "/equipa/agenda", icon: "CalendarDays", dominio: "green" },
    ],
  },
  {
    titulo: "Recursos",
    items: [{ label: "Os meus recursos", href: "/equipa/recursos", icon: "Wrench", dominio: "orange" }],
  },
]

export default async function EquipaLayout({ children }: { children: React.ReactNode }) {
  const { perfil } = await exigirPerfil(["funcionario"])

  return (
    <AppShell groups={GROUPS} nome={perfil.nome} email={perfil.email} perfilLabel="Funcionário">
      {children}
    </AppShell>
  )
}
