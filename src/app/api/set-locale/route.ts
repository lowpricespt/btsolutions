import { NextResponse } from "next/server"
import { LOCALES, CHAVE_COOKIE_LOCALE } from "@/i18n/request"

export async function POST(request: Request) {
  const { locale } = await request.json()

  if (typeof locale !== "string" || !(LOCALES as readonly string[]).includes(locale)) {
    return NextResponse.json({ erro: "Idioma inválido." }, { status: 400 })
  }

  const resposta = NextResponse.json({ ok: true })
  resposta.cookies.set(CHAVE_COOKIE_LOCALE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  })
  return resposta
}
