import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { createClient } from "@/lib/supabase/server"
import { NovoPedidoForm } from "@/components/pedidos/novo-pedido-form"

export default async function NovoPedidoPage() {
  const supabase = await createClient()
  const t = await getTranslations("Cliente.novoPedido")

  const { data: tiposServico } = await supabase
    .from("tipos_servico")
    .select("id, nome, descricao, preco_base, especialidades(nome)")
    .order("nome")

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/cliente"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("voltar")}
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{t("titulo")}</h1>
        <p className="text-sm text-muted-foreground">{t("subtitulo")}</p>
      </div>

      <NovoPedidoForm tiposServico={tiposServico ?? []} />
    </div>
  )
}
