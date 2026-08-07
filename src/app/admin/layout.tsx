import { exigirPerfil } from "@/lib/get-perfil"
import { AppShell } from "@/components/layout/app-shell"
import type { NavGroup } from "@/components/layout/nav-types"

const GROUPS: NavGroup[] = [
  {
    items: [{ label: "Dashboard", href: "/admin", icon: "Home", dominio: "blue" }],
  },
  {
    titulo: "Operação",
    items: [
      { label: "Clientes", href: "/admin/clientes", icon: "Users", dominio: "blue" },
      { label: "Pedidos", href: "/admin/pedidos", icon: "ClipboardList", dominio: "green" },
      { label: "Agenda", href: "/admin/agenda", icon: "CalendarDays", dominio: "green" },
    ],
  },
  {
    titulo: "Recursos",
    items: [
      { label: "Fornecedores", href: "/admin/fornecedores", icon: "Truck", dominio: "orange" },
      { label: "Material", href: "/admin/material", icon: "Boxes", dominio: "orange" },
      { label: "Ferramentas", href: "/admin/ferramentas", icon: "Wrench", dominio: "orange" },
      { label: "Viaturas", href: "/admin/viaturas", icon: "Car", dominio: "orange" },
    ],
  },
  {
    titulo: "Catálogo",
    items: [
      { label: "Especialidades", href: "/admin/catalogo/especialidades", icon: "Layers", dominio: "green" },
      { label: "Tipos de Serviço", href: "/admin/catalogo/tipos-servico", icon: "ListTree", dominio: "green" },
    ],
  },
  {
    titulo: "Financeiro",
    items: [{ label: "Faturas", href: "/admin/faturas", icon: "Receipt", dominio: "purple" }],
  },
  {
    titulo: "Administração",
    items: [
      { label: "Utilizadores", href: "/admin/utilizadores", icon: "UserCog", dominio: "blue" },
      { label: "Log de Atividade", href: "/admin/log", icon: "ScrollText", dominio: "purple" },
    ],
  },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { perfil } = await exigirPerfil(["administrador"])

  return (
    <AppShell groups={GROUPS} nome={perfil.nome} email={perfil.email} perfilLabel="Administrador">
      {children}
    </AppShell>
  )
}
