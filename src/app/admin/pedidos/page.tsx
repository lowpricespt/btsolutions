import { PedidosLista } from "@/components/pedidos/pedidos-lista"

export default async function AdminPedidosPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>
}) {
  const { estado } = await searchParams

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Pedidos</h1>
        <p className="text-sm text-muted-foreground">Todos os pedidos de clientes.</p>
      </div>
      <PedidosLista baseHref="/admin/pedidos" estadoFiltro={estado} />
    </div>
  )
}
