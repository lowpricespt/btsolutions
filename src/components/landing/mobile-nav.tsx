"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Logo } from "@/components/brand/logo"

export function MobileNav({ navLinks }: { navLinks: { href: string; label: string }[] }) {
  const [menuAberto, setMenuAberto] = useState(false)

  return (
    <Sheet open={menuAberto} onOpenChange={setMenuAberto}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        }
      />
      <SheetContent side="right" className="w-72 p-0">
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <div className="border-b px-5 py-4">
          <Logo tamanho="h-8" />
        </div>
        <nav className="flex flex-col gap-1 px-3 py-4">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuAberto(false)}
              className="rounded-md px-2.5 py-2.5 text-sm font-medium text-foreground/80 hover:bg-muted"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-2 border-t p-4">
          <Button variant="outline" render={<Link href="/login">Entrar</Link>} />
          <Button
            className="bg-brand-gold text-brand-gold-foreground hover:bg-brand-gold/90"
            render={<Link href="/registo">Criar conta</Link>}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
