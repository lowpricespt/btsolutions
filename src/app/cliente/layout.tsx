import { getTranslations } from "next-intl/server"
import { exigirPerfil } from "@/lib/get-perfil"
import { AppShell } from "@/components/layout/app-shell"
import type { NavGroup } from "@/components/layout/nav-types"

export default async function ClienteLayout({ children }: { children: React.ReactNode }) {
  const { perfil } = await exigirPerfil(["cliente"])
  const t = await getTranslations("Cliente.layout")

  const GROUPS: NavGroup[] = [
    {
      items: [
        { label: t("osMeusPedidos"), href: "/cliente", icon: "Home", dominio: "blue" },
        { label: t("novoPedido"), href: "/cliente/pedidos/novo", icon: "PlusCircle", dominio: "green" },
      ],
    },
  ]

  return (
    <AppShell
      groups={GROUPS}
      nome={perfil.nome}
      email={perfil.email}
      perfilLabel={t("perfilLabel")}
      sairLabel={t("sairLabel")}
    >
      {children}
    </AppShell>
  )
}
