import { getTranslations } from "next-intl/server"
import { iniciais, formatDataHora } from "@/lib/format"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

type Comentario = {
  id: number
  texto: string
  visivel_cliente: boolean
  data_hora: string
  id_utilizador: string
  utilizadores: { nome: string; tipo_utilizador: string } | null
}

// Variante traduzida de ComentariosThread, só para a área de cliente — o
// staff (admin/equipa) usa sempre o componente original, em português.
export async function ComentariosThreadCliente({
  comentarios,
  userId,
}: {
  comentarios: Comentario[]
  userId: string
}) {
  const t = await getTranslations("Cliente.comentarios")

  if (comentarios.length === 0) {
    return (
      <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        {t("semComentarios")}
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {comentarios.map((c) => {
        const souEu = c.id_utilizador === userId
        const nomeAutor = souEu ? t("tu") : t("equipaBts")

        return (
          <div key={c.id} className="flex gap-3">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback
                className={cn(
                  "text-xs font-semibold",
                  souEu ? "bg-domain-blue-soft text-domain-blue" : "bg-domain-green-soft text-domain-green"
                )}
              >
                {iniciais(nomeAutor)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">{nomeAutor}</span>
                <span className="text-xs text-muted-foreground">{formatDataHora(c.data_hora)}</span>
              </div>
              <p className="mt-0.5 whitespace-pre-wrap text-sm text-foreground/90">{c.texto}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
