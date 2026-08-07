import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Dominio } from "@/components/layout/nav-types"

const DOMINIO_BG: Record<Dominio, string> = {
  blue: "bg-domain-blue-soft text-domain-blue",
  green: "bg-domain-green-soft text-domain-green",
  orange: "bg-domain-orange-soft text-domain-orange",
  purple: "bg-domain-purple-soft text-domain-purple",
}

export function StatCard({
  titulo,
  valor,
  icon: Icon,
  dominio = "blue",
  className,
}: {
  titulo: string
  valor: string | number
  icon: LucideIcon
  dominio?: Dominio
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-4 rounded-xl border bg-card p-4", className)}>
      <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-lg", DOMINIO_BG[dominio])}>
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-2xl font-semibold leading-none">{valor}</p>
        <p className="mt-1 text-sm text-muted-foreground">{titulo}</p>
      </div>
    </div>
  )
}
