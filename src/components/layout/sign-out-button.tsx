"use client"

import { useState } from "react"
import { LogOut, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function SignOutButton({ className, label = "Terminar sessão" }: { className?: string; label?: string }) {
  const [aSair, setASair] = useState(false)

  async function sair() {
    setASair(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    // Navegação completa (não router.push) — garante que o middleware
    // reavalia a sessão do zero e não fica nenhum estado de cliente antigo.
    window.location.href = "/login"
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={sair}
      disabled={aSair}
      className={cn(
        "w-full justify-start gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive",
        className
      )}
    >
      {aSair ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
      {label}
    </Button>
  )
}
