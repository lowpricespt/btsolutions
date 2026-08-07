import "server-only"

/**
 * Envio de email transacional via Resend. Requer RESEND_API_KEY (server-only).
 * Sem domínio próprio verificado, o remetente por omissão usa o domínio de
 * testes da Resend (onboarding@resend.dev), que envia para qualquer
 * destinatário sem configuração extra — trocar por RESEND_FROM_EMAIL assim
 * que o domínio da BTS estiver verificado na Resend.
 */
export async function enviarEmail({
  to,
  subject,
  html,
}: {
  to: string[]
  subject: string
  html: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error("RESEND_API_KEY não está definida.")
  }
  if (to.length === 0) {
    throw new Error("Sem destinatários para o email.")
  }

  const from = process.env.RESEND_FROM_EMAIL || "BTS <onboarding@resend.dev>"

  const resposta = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  })

  if (!resposta.ok) {
    const corpo = await resposta.text()
    throw new Error(`Falha ao enviar email via Resend (${resposta.status}): ${corpo}`)
  }
}
