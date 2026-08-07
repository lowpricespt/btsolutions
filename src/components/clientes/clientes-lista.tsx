import Link from "next/link"
import { PlusCircle, Search } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { EstadoBadge } from "@/components/estado-badge"
import { TIPO_CLIENTE, ESTADO_UTILIZADOR } from "@/lib/labels"
import { iniciais } from "@/lib/format"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export async function ClientesLista({
  baseHref,
  pesquisa,
}: {
  baseHref: string
  pesquisa?: string
}) {
  const supabase = await createClient()

  const { data } = await supabase
    .from("clientes")
    .select("id, nif, tipo_cliente, nome_empresa, utilizadores(nome, email, telefone, estado)")
    .order("id")

  let clientes = data ?? []
  if (pesquisa) {
    const termo = pesquisa.toLowerCase()
    clientes = clientes.filter(
      (c) =>
        c.utilizadores?.nome.toLowerCase().includes(termo) ||
        c.utilizadores?.email.toLowerCase().includes(termo) ||
        c.nif?.includes(termo)
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <form className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            name="q"
            defaultValue={pesquisa}
            placeholder="Pesquisar por nome, email ou NIF…"
            className="h-9 w-full rounded-lg border border-input bg-transparent pl-8 pr-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </form>
        <Button render={<Link href={`${baseHref}/novo`}><PlusCircle className="h-4 w-4" />Novo cliente</Link>} />
      </div>

      {clientes.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          Sem clientes para mostrar.
        </div>
      ) : (
        <div className="space-y-2">
          {clientes.map((c) => (
            <Link
              key={c.id}
              href={`${baseHref}/${c.id}`}
              className="flex items-center gap-3 rounded-xl border bg-card p-3 transition-shadow hover:shadow-md"
            >
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarFallback className="bg-domain-blue-soft text-domain-blue text-xs font-semibold">
                  {iniciais(c.utilizadores?.nome ?? "?")}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">
                  {c.nome_empresa || c.utilizadores?.nome}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  {c.utilizadores?.email}
                  {c.utilizadores?.telefone ? ` · ${c.utilizadores.telefone}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <EstadoBadge {...TIPO_CLIENTE[c.tipo_cliente]} />
                {c.utilizadores?.estado === "inativo" && (
                  <EstadoBadge {...ESTADO_UTILIZADOR.inativo} />
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
