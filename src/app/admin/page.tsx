import Link from "next/link"
import { ClipboardList, Hammer, PackageX, Receipt } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { StatCard } from "@/components/stat-card"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [{ count: pedidosPendentes }, { count: trabalhosEmCurso }, { data: materiais }, { count: faturasPendentes }] =
    await Promise.all([
      supabase.from("pedidos").select("id", { count: "exact", head: true }).eq("estado", "pendente"),
      supabase.from("trabalhos").select("id", { count: "exact", head: true }).eq("estado", "em_curso"),
      supabase.from("materiais").select("id, quantidade_stock, quantidade_minima"),
      supabase
        .from("faturas")
        .select("id", { count: "exact", head: true })
        .eq("estado_pagamento", "pendente"),
    ])

  const stockBaixo = (materiais ?? []).filter((m) => m.quantidade_stock < m.quantidade_minima)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral da operação BTS.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/pedidos">
          <StatCard titulo="Pedidos pendentes" valor={pedidosPendentes ?? 0} icon={ClipboardList} dominio="blue" />
        </Link>
        <Link href="/admin/agenda">
          <StatCard titulo="Trabalhos em curso" valor={trabalhosEmCurso ?? 0} icon={Hammer} dominio="green" />
        </Link>
        <Link href="/admin/material">
          <StatCard titulo="Material com stock baixo" valor={stockBaixo.length} icon={PackageX} dominio="orange" />
        </Link>
        <Link href="/admin/faturas">
          <StatCard titulo="Faturas pendentes" valor={faturasPendentes ?? 0} icon={Receipt} dominio="purple" />
        </Link>
      </div>

      {stockBaixo.length > 0 && (
        <div className="rounded-xl border border-domain-orange/30 bg-domain-orange-soft p-4">
          <p className="font-medium text-domain-orange">
            {stockBaixo.length} material(is) abaixo da quantidade mínima de stock
          </p>
          <Link href="/admin/material" className="text-sm text-domain-orange underline underline-offset-2">
            Ver material
          </Link>
        </div>
      )}
    </div>
  )
}
