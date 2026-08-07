import { ClientesLista } from "@/components/clientes/clientes-lista"

export default async function EquipaClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Clientes</h1>
        <p className="text-sm text-muted-foreground">Consulta e gere os clientes da BTS.</p>
      </div>
      <ClientesLista baseHref="/equipa/clientes" pesquisa={q} />
    </div>
  )
}
