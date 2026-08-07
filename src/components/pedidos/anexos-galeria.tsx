import { FileText } from "lucide-react"
import { TIPO_ANEXO } from "@/lib/labels"
import { EstadoBadge } from "@/components/estado-badge"
import { formatDataHora } from "@/lib/format"

type Anexo = {
  id: number
  tipo: "foto_antes" | "foto_depois" | "documento"
  data_upload: string
  url: string | null
}

export function AnexosGaleria({ anexos }: { anexos: Anexo[] }) {
  if (anexos.length === 0) {
    return (
      <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        Ainda não há fotos ou documentos.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {anexos.map((a) => (
        <a
          key={a.id}
          href={a.url ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="group overflow-hidden rounded-lg border bg-card"
        >
          {a.tipo === "documento" ? (
            <div className="flex aspect-square items-center justify-center bg-muted">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={a.url ?? ""}
              alt={TIPO_ANEXO[a.tipo].label}
              className="aspect-square w-full object-cover transition-transform group-hover:scale-105"
            />
          )}
          <div className="space-y-1 p-2">
            <EstadoBadge {...TIPO_ANEXO[a.tipo]} className="text-[0.7rem]" />
            <p className="text-xs text-muted-foreground">{formatDataHora(a.data_upload)}</p>
          </div>
        </a>
      ))}
    </div>
  )
}
