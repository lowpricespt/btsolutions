"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Menu,
  Wrench,
  ChevronsUpDown,
  Home,
  PlusCircle,
  Users,
  ClipboardList,
  CalendarDays,
  Truck,
  Boxes,
  Car,
  Receipt,
  UserCog,
  ScrollText,
  ListTree,
  Layers,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { iniciais } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SignOutButton } from "@/components/layout/sign-out-button"
import { DOMINIO_ICON_CLASSES, type NavGroup, type NavIconName } from "@/components/layout/nav-types"

const ICONS: Record<NavIconName, LucideIcon> = {
  Home,
  PlusCircle,
  Users,
  ClipboardList,
  CalendarDays,
  Wrench,
  Truck,
  Boxes,
  Car,
  Receipt,
  UserCog,
  ScrollText,
  ListTree,
  Layers,
}

function NavLinks({ groups, onNavigate }: { groups: NavGroup[]; onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-4">
      {groups.map((grupo, i) => (
        <div key={grupo.titulo ?? i} className="flex flex-col gap-1">
          {grupo.titulo && (
            <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {grupo.titulo}
            </p>
          )}
          {grupo.items.map((item) => {
            const ativo =
              item.href === pathname ||
              (item.href !== "/" && pathname.startsWith(item.href + "/")) ||
              pathname === item.href
            const Icon = ICONS[item.icon]
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                  ativo
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:bg-muted"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    item.dominio ? DOMINIO_ICON_CLASSES[item.dominio] : undefined
                  )}
                />
                {item.label}
              </Link>
            )
          })}
        </div>
      ))}
    </nav>
  )
}

function UserMenu({ nome, email, perfilLabel }: { nome: string; email: string; perfilLabel: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center gap-2 rounded-md border p-2 text-left hover:bg-muted">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
            {iniciais(nome)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{nome}</p>
          <p className="truncate text-xs text-muted-foreground">{perfilLabel}</p>
        </div>
        <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate font-normal text-muted-foreground">
          {email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <SignOutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function AppShell({
  groups,
  nome,
  email,
  perfilLabel,
  titulo,
  children,
}: {
  groups: NavGroup[]
  nome: string
  email: string
  perfilLabel: string
  titulo?: string
  children: React.ReactNode
}) {
  const [aberto, setAberto] = useState(false)

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar desktop */}
      <aside className="hidden w-64 shrink-0 flex-col border-r bg-card md:flex">
        <div className="flex items-center gap-2 border-b px-4 py-4 font-bold text-domain-blue">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-domain-blue text-domain-blue-foreground">
            <Wrench className="h-4 w-4" />
          </span>
          BTS
        </div>
        <NavLinks groups={groups} />
        <div className="border-t p-3">
          <UserMenu nome={nome} email={email} perfilLabel={perfilLabel} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar mobile */}
        <header className="flex items-center gap-3 border-b bg-card px-3 py-3 md:hidden">
          <Sheet open={aberto} onOpenChange={setAberto}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              }
            />
            <SheetContent side="left" className="w-64 p-0">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="flex items-center gap-2 border-b px-4 py-4 font-bold text-domain-blue">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-domain-blue text-domain-blue-foreground">
                  <Wrench className="h-4 w-4" />
                </span>
                BTS
              </div>
              <NavLinks groups={groups} onNavigate={() => setAberto(false)} />
              <div className="border-t p-3">
                <UserMenu nome={nome} email={email} perfilLabel={perfilLabel} />
              </div>
            </SheetContent>
          </Sheet>
          <span className="font-semibold text-domain-blue">BTS</span>
          {titulo && <span className="ml-auto text-sm text-muted-foreground">{titulo}</span>}
        </header>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}
