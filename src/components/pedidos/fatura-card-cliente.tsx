import { Receipt } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { EstadoBadge } from "@/components/estado-badge"
import { ESTADO_PAGAMENTO, METODO_PAGAMENTO } from "@/lib/labels"
import { traduzEnum } from "@/lib/labels-i18n"
import { formatData, formatMoeda } from "@/lib/format"

type Fatura = {
  numero_fatura: string
  data_emissao: string
  valor_total: number
  estado_pagamento: "pendente" | "pago" | "parcial"
  metodo_pagamento: "mbway" | "transferencia" | "multibanco" | "numerario" | null
}

// Variante traduzida de FaturaCard, só para a área de cliente.
export async function FaturaCardCliente({ fatura }: { fatura: Fatura }) {
  const t = await getTranslations("Cliente.fatura")
  const tEnums = await getTranslations("Enums")
  const estadoPagamento = traduzEnum(tEnums, "estadoPagamento", ESTADO_PAGAMENTO)
  const metodoPagamento = traduzEnum(tEnums, "metodoPagamento", METODO_PAGAMENTO)

  return (
    <div className="flex items-start gap-3 rounded-lg border bg-card p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-domain-purple-soft text-domain-purple">
        <Receipt className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <p className="font-medium">{fatura.numero_fatura}</p>
          <EstadoBadge {...estadoPagamento[fatura.estado_pagamento]} />
        </div>
        <p className="text-sm text-muted-foreground">{t("emitidaEm", { data: formatData(fatura.data_emissao) })}</p>
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">{formatMoeda(fatura.valor_total)}</p>
          {fatura.metodo_pagamento && <EstadoBadge {...metodoPagamento[fatura.metodo_pagamento]} />}
        </div>
      </div>
    </div>
  )
}
