import { PedidoDetalheStaff } from "@/components/pedidos/pedido-detalhe-staff"

export default async function AdminPedidoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <PedidoDetalheStaff pedidoId={Number(id)} baseHref="/admin/pedidos" />
}
