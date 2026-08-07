import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { TOM_CLASSES, type BadgeTom } from "@/lib/labels"

export function EstadoBadge({
  label,
  tom,
  className,
}: {
  label: string
  tom: BadgeTom
  className?: string
}) {
  return (
    <Badge className={cn(TOM_CLASSES[tom], "font-medium", className)}>
      {label}
    </Badge>
  )
}
