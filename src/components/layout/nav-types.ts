export type Dominio = "blue" | "green" | "orange" | "purple"

// Nomes de ícones do lucide-react suportados na navegação. Guardamos o nome
// (string), não a referência ao componente, porque estas listas de navegação
// são construídas em Server Components (os layouts) e passadas para o
// AppShell (Client Component) — funções/componentes não são serializáveis
// através dessa fronteira, strings são.
export type NavIconName =
  | "Home"
  | "PlusCircle"
  | "Users"
  | "ClipboardList"
  | "CalendarDays"
  | "Wrench"
  | "Truck"
  | "Boxes"
  | "Car"
  | "Receipt"
  | "UserCog"
  | "ScrollText"
  | "ListTree"
  | "Layers"

export type NavItem = {
  label: string
  href: string
  icon: NavIconName
  dominio?: Dominio
}

export type NavGroup = {
  titulo?: string
  items: NavItem[]
}

export const DOMINIO_ICON_CLASSES: Record<Dominio, string> = {
  blue: "text-domain-blue",
  green: "text-domain-green",
  orange: "text-domain-orange",
  purple: "text-domain-purple",
}
