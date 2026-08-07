import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ClienteForm } from "@/components/clientes/cliente-form"

export default function NovoClienteEquipaPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/equipa/clientes"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Novo cliente</h1>
      </div>
      <ClienteForm baseHref="/equipa/clientes" podeEditarUtilizador={false} />
    </div>
  )
}
