import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CriarUtilizadorForm } from "@/components/admin/criar-utilizador-form"

export default function NovaContaPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/admin/utilizadores"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Nova conta</h1>
        <p className="text-sm text-muted-foreground">
          Cria uma conta de funcionário ou administrador. O registo público só cria contas de cliente.
        </p>
      </div>
      <CriarUtilizadorForm />
    </div>
  )
}
