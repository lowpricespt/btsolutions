import { cookies } from "next/headers"
import { getRequestConfig } from "next-intl/server"

export const LOCALES = ["pt", "en", "fr", "es", "de"] as const
export type Locale = (typeof LOCALES)[number]
export const LOCALE_PADRAO: Locale = "pt"
export const CHAVE_COOKIE_LOCALE = "NEXT_LOCALE"

export default getRequestConfig(async () => {
  const store = await cookies()
  const guardado = store.get(CHAVE_COOKIE_LOCALE)?.value
  const locale = (LOCALES as readonly string[]).includes(guardado ?? "")
    ? (guardado as Locale)
    : LOCALE_PADRAO

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
