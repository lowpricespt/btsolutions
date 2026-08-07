import Link from "next/link"
import { CompassIcon } from "lucide-react"
import { Logo } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-muted/30 px-4 text-center">
      <Link href="/">
        <Logo tamanho="h-9" />
      </Link>
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-navy-soft text-brand-navy">
        <CompassIcon className="h-7 w-7" />
      </span>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Página não encontrada</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          O link pode estar errado ou a página já não existe.
        </p>
      </div>
      <Button
        className="bg-brand-navy text-brand-navy-foreground hover:bg-brand-navy/90"
        render={<Link href="/">Voltar ao início</Link>}
      />
    </div>
  )
}
