import "server-only"
import nodemailer from "nodemailer"

const ENTIDADES_HTML: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
}

// Escapa texto de origem do utilizador antes de o inserir em HTML de email
// (ex.: título/morada de um pedido) — sem isto, um cliente podia injetar
// HTML/scripts no email que o admin recebe.
export function escaparHtml(texto: string): string {
  return texto.replace(/[&<>"']/g, (c) => ENTIDADES_HTML[c])
}

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null

function getTransporter() {
  if (transporter) return transporter

  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD
  if (!user || !pass) {
    throw new Error("GMAIL_USER / GMAIL_APP_PASSWORD não estão definidas.")
  }

  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: { user, pass },
  })
  return transporter
}

/**
 * Envio de email transacional pelo Gmail da BTS (App Password), em vez de um
 * ESP de terceiros — sem domínio próprio verificado, emails de domínios de
 * teste (ex.: onboarding@resend.dev) caem frequentemente no spam. Enviar
 * pelo Gmail real da empresa entrega de forma fiável sem precisar de
 * domínio.
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
  if (to.length === 0) {
    throw new Error("Sem destinatários para o email.")
  }

  const from = process.env.GMAIL_USER!
  await getTransporter().sendMail({
    from: `BTS <${from}>`,
    to,
    subject,
    html,
  })
}
