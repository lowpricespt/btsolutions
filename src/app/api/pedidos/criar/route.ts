import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { enviarEmail } from "@/lib/resend"
import { PRIORIDADE } from "@/lib/labels"

type CorpoPedido = {
  id_tipo_servico: number
  titulo: string
  descricao?: string
  morada_servico: string
  codigo_postal_servico?: string
  data_pretendida?: string
  prioridade: "baixa" | "normal" | "alta" | "urgente"
}

export async function POST(request: Request) {
  const corpo = (await request.json()) as CorpoPedido

  if (!corpo.id_tipo_servico || !corpo.titulo || !corpo.morada_servico || !corpo.prioridade) {
    return NextResponse.json({ erro: "Faltam campos obrigatórios." }, { status: 400 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ erro: "Não autenticado." }, { status: 401 })

  const { data: pedido, error } = await supabase
    .from("pedidos")
    .insert({
      id_cliente: user.id,
      id_tipo_servico: corpo.id_tipo_servico,
      titulo: corpo.titulo,
      descricao: corpo.descricao || null,
      morada_servico: corpo.morada_servico,
      codigo_postal_servico: corpo.codigo_postal_servico || null,
      data_pretendida: corpo.data_pretendida || null,
      prioridade: corpo.prioridade,
    })
    .select("id, tipos_servico(nome)")
    .single()

  if (error || !pedido) {
    return NextResponse.json(
      { erro: error?.message ?? "Não foi possível criar o pedido." },
      { status: 400 }
    )
  }

  try {
    const admin = createAdminClient()

    const [{ data: administradores }, { data: cliente }] = await Promise.all([
      admin
        .from("utilizadores")
        .select("email")
        .eq("tipo_utilizador", "administrador")
        .eq("estado", "ativo"),
      admin.from("utilizadores").select("nome").eq("id", user.id).single(),
    ])

    const destinatarios = (administradores ?? []).map((a) => a.email).filter(Boolean)

    if (destinatarios.length > 0) {
      const origem = new URL(request.url).origin
      const tipoServico = (pedido as { tipos_servico?: { nome: string } | null }).tipos_servico?.nome
      const linkAdmin = `${origem}/admin/pedidos/${pedido.id}`

      await enviarEmail({
        to: destinatarios,
        subject: `Novo pedido: ${corpo.titulo}`,
        html: `
          <div style="font-family: sans-serif; max-width: 480px;">
            <h2 style="color: #1c2b4a;">Novo pedido de serviço</h2>
            <p><strong>Cliente:</strong> ${cliente?.nome ?? "—"}</p>
            <p><strong>Serviço:</strong> ${tipoServico ?? "—"}</p>
            <p><strong>Título:</strong> ${corpo.titulo}</p>
            <p><strong>Morada:</strong> ${corpo.morada_servico}</p>
            <p><strong>Prioridade:</strong> ${PRIORIDADE[corpo.prioridade]?.label ?? corpo.prioridade}</p>
            <p style="margin-top: 24px;">
              <a href="${linkAdmin}" style="background: #c9a227; color: #1c2b4a; padding: 10px 18px; border-radius: 6px; text-decoration: none; font-weight: 600;">
                Ver pedido
              </a>
            </p>
          </div>
        `,
      })
    }
  } catch (e) {
    console.error("Não foi possível enviar o email de notificação de novo pedido:", e)
  }

  return NextResponse.json({ id: pedido.id })
}
