import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Logo } from "@/components/brand/logo"
import { CONTACTO } from "@/lib/contacto"

export const metadata = {
  title: "Política de Privacidade",
  description:
    "Como a BTS — Bizarro Total Solutions recolhe, usa e protege os teus dados pessoais, nos termos do RGPD.",
  alternates: {
    canonical: "/privacidade",
  },
}

export default async function PrivacidadePage() {
  const t = await getTranslations("Privacidade")
  const s2Lista = t.raw("s2.lista") as string[]
  const s3Lista = t.raw("s3.lista") as string[]
  const s7Lista = t.raw("s7.lista") as string[]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-8">
          <Logo tamanho="h-9" />
          <Link href="/" className="flex items-center gap-1.5 text-sm font-medium text-foreground/70 hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> {t("voltar")}
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("titulo")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("ultimaAtualizacao")}</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-foreground/90">
          <section>
            <h2 className="text-lg font-semibold text-foreground">{t("s1.titulo")}</h2>
            <p className="mt-2">{t("s1.p1")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">{t("s2.titulo")}</h2>
            <p className="mt-2">{t("s2.intro")}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {s2Lista.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">{t("s3.titulo")}</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {s3Lista.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">{t("s4.titulo")}</h2>
            <p className="mt-2">{t("s4.p1")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">{t("s5.titulo")}</h2>
            <p className="mt-2">{t("s5.p1")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">{t("s6.titulo")}</h2>
            <p className="mt-2">{t("s6.p1")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">{t("s7.titulo")}</h2>
            <p className="mt-2">{t("s7.intro")}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {s7Lista.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-2">
              {t("s7.contacta")}{" "}
              <a href={`mailto:${CONTACTO.email}`} className="font-medium text-brand-navy hover:underline dark:text-brand-gold">
                {CONTACTO.email}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">{t("s8.titulo")}</h2>
            <p className="mt-2">{t("s8.p1")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">{t("s9.titulo")}</h2>
            <p className="mt-2">{t("s9.p1")}</p>
            <p className="mt-2">{t("s9.p2")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">{t("s10.titulo")}</h2>
            <p className="mt-2">{t("s10.p1")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">{t("s11.titulo")}</h2>
            <p className="mt-2">{t("s11.p1", { email: CONTACTO.email, telefone: CONTACTO.telefone })}</p>
          </section>
        </div>
      </main>

      <footer className="border-t px-4 py-6 text-center text-xs text-muted-foreground sm:px-8">
        © {new Date().getFullYear()} BTS — Bizarro Total Solutions.
      </footer>
    </div>
  )
}
