"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

export function SignOutButton() {
  const router = useRouter()

  async function sair() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <DropdownMenuItem onClick={sair} variant="destructive">
      <LogOut className="h-4 w-4" />
      Terminar sessão
    </DropdownMenuItem>
  )
}
