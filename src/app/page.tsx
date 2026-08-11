import Link from "next/link"
import Image from "next/image"
import { getTranslations } from "next-intl/server"
import {
  Zap,
  Wifi,
  Hammer,
  Armchair,
  Fan,
  Tv,
  Shirt,
  Paintbrush,
  Wrench,
  ArrowRight,
  ClipboardCheck,
  CalendarCheck2,
  ThumbsUp,
  ShieldCheck,
  Clock,
  BadgeEuro,
  Star,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  BadgeCheck,
  Wallet,
  Map,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/brand/logo"
import { CONTACTO } from "@/lib/contacto"
import { MobileNav } from "@/components/landing/mobile-nav"
import { Reveal } from "@/components/landing/reveal"
import { LanguageSwitcher } from "@/components/language-switcher"

const SERVICOS_ICONES = [Zap, Wifi, Hammer, Armchair, Fan, Tv, Shirt, Paintbrush, Wrench]
const SERVICOS_CORES = ["gold", "teal", "wood", "navy", "teal", "gold", "navy", "wood", "teal"] as const

const CORES = {
  gold: "bg-brand-gold-soft text-brand-gold-foreground",
  teal: "bg-brand-teal-soft text-brand-teal",
  wood: "bg-brand-wood-soft text-brand-wood",
  navy: "bg-brand-navy-soft text-brand-navy",
}

const PASSOS_ICONES = [ClipboardCheck, CalendarCheck2, ThumbsUp]
const VANTAGENS_ICONES = [Clock, ShieldCheck, BadgeEuro]
const CONFIANCA_ICONES = [BadgeCheck, Map, Wallet]

export default async function LandingPage() {
  const t = await getTranslations("Landing")

  const NAV_LINKS = [
    { href: "#servicos", label: t("nav.servicos") },
    { href: "#como-funciona", label: t("nav.comoFunciona") },
    { href: "#confianca", label: t("nav.confianca") },
    { href: "#contacto", label: t("nav.contacto") },
  ]

  const vantagens = t.raw("vantagens") as { valor: string; titulo: string; texto: string }[]
  const passos = t.raw("comoFunciona.passos") as { titulo: string; texto: string }[]
  const servicos = t.raw("servicos.lista") as { nome: string; texto: string }[]
  const confianca = t.raw("confianca.lista") as { titulo: string; texto: string }[]

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-8">
          <Logo tamanho="h-10" priority />

          <nav className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="text-sm font-medium text-foreground/70 hover:text-foreground">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <LanguageSwitcher className="mr-1" />
            <Button variant="ghost" render={<Link href="/login">{t("entrar")}</Link>} />
            <Button
              className="bg-brand-gold text-brand-gold-foreground hover:bg-brand-gold/90"
              render={<Link href="/registo">{t("criarConta")}</Link>}
            />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher />
            <MobileNav navLinks={NAV_LINKS} entrarLabel={t("entrar")} criarContaLabel={t("criarConta")} />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-noise relative overflow-hidden bg-brand-navy text-brand-navy-foreground">
          <div className="bg-grid-pattern pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black,transparent)]" />
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-gold/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-brand-teal/20 blur-3xl" />
          <Image
            src="/patterns/network.svg"
            alt=""
            aria-hidden="true"
            width={600}
            height={600}
            className="pointer-events-none absolute -right-16 top-1/2 hidden h-[38rem] w-[38rem] -translate-y-1/2 opacity-60 lg:block"
          />

          <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-brand-gold">
                <Star className="h-3.5 w-3.5 fill-brand-gold text-brand-gold" />
                {t("hero.badge")}
              </span>
              <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
                {t("hero.titulo")}
                <span className="text-gradient-gold block sm:inline"> {t("hero.tituloDestaque")}</span>
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-white/80 sm:text-lg">{t("hero.texto")}</p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="bg-brand-gold text-brand-gold-foreground hover:bg-brand-gold/90"
                  render={
                    <Link href="/registo">
                      {t("hero.pedirServico")} <ArrowRight className="h-4 w-4" />
                    </Link>
                  }
                />
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
                  render={<Link href="/login">{t("hero.jaSouCliente")}</Link>}
                />
              </div>
            </div>

            <div className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
              {vantagens.map(({ valor, titulo, texto }, i) => {
                const Icon = VANTAGENS_ICONES[i]
                return (
                  <div key={titulo} className="glass-panel glow-on-hover rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <Icon className="h-5 w-5 text-brand-gold" />
                      <span className="font-mono text-lg font-bold text-brand-gold">{valor}</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold">{titulo}</p>
                    <p className="mt-0.5 text-xs text-white/70">{texto}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Como funciona */}
        <section id="como-funciona" className="mx-auto max-w-6xl scroll-mt-28 px-4 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("comoFunciona.titulo")}</h2>
            <p className="mt-2 text-muted-foreground">{t("comoFunciona.subtitulo")}</p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {passos.map(({ titulo, texto }, i) => {
              const Icon = PASSOS_ICONES[i]
              return (
                <Reveal key={titulo} delay={i * 100}>
                  <div className="glow-on-hover relative h-full rounded-2xl border bg-card p-6">
                    <span className="absolute -top-3 -left-1 flex h-7 w-7 items-center justify-center rounded-full bg-brand-navy font-mono text-xs font-bold text-brand-navy-foreground">
                      {i + 1}
                    </span>
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gold-soft text-brand-gold-foreground">
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="mt-4 font-semibold">{titulo}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{texto}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </section>

        {/* Especialidades */}
        <section id="servicos" className="border-y bg-muted/30 px-4 py-16 scroll-mt-20 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("servicos.titulo")}</h2>
              <p className="mt-2 text-muted-foreground">{t("servicos.subtitulo")}</p>
            </div>
            <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {servicos.map(({ nome, texto }, i) => {
                const Icon = SERVICOS_ICONES[i]
                const cor = SERVICOS_CORES[i]
                return (
                  <Reveal key={nome} delay={(i % 3) * 80}>
                    <div className="glow-on-hover flex h-full gap-3 rounded-xl border bg-card p-4">
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${CORES[cor]}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold">{nome}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{texto}</p>
                      </div>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* Confiança / porque escolher-nos */}
        <section id="confianca" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("confianca.titulo")}</h2>
            <p className="mt-2 text-muted-foreground">{t("confianca.subtitulo")}</p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {confianca.map(({ titulo, texto }, i) => {
              const Icon = CONFIANCA_ICONES[i]
              return (
                <Reveal key={titulo} delay={i * 100}>
                  <div className="glow-on-hover h-full rounded-2xl border bg-card p-6 text-center">
                    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-teal-soft text-brand-teal">
                      <Icon className="h-6 w-6" />
                    </span>
                    <p className="mt-4 font-semibold">{titulo}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{texto}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </section>

        {/* Contacto */}
        <section id="contacto" className="border-y bg-muted/30 px-4 py-16 scroll-mt-20 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("contacto.titulo")}</h2>
              <p className="mt-2 text-muted-foreground">{t("contacto.subtitulo")}</p>
            </div>
            <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
              <a
                href={CONTACTO.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 rounded-2xl border bg-card p-6 text-center transition-shadow hover:shadow-md"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-teal-soft text-brand-teal">
                  <MessageCircle className="h-6 w-6" />
                </span>
                <p className="font-semibold">{t("contacto.whatsapp")}</p>
                <p className="text-sm text-muted-foreground">{CONTACTO.telefone}</p>
              </a>
              <a
                href={CONTACTO.telefoneHref}
                className="flex flex-col items-center gap-2 rounded-2xl border bg-card p-6 text-center transition-shadow hover:shadow-md"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gold-soft text-brand-gold-foreground">
                  <Phone className="h-6 w-6" />
                </span>
                <p className="font-semibold">{t("contacto.telefone")}</p>
                <p className="text-sm text-muted-foreground">{CONTACTO.telefone}</p>
              </a>
              <a
                href={`mailto:${CONTACTO.email}`}
                className="flex flex-col items-center gap-2 rounded-2xl border bg-card p-6 text-center transition-shadow hover:shadow-md"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-navy-soft text-brand-navy">
                  <Mail className="h-6 w-6" />
                </span>
                <p className="font-semibold">{t("contacto.email")}</p>
                <p className="text-sm text-muted-foreground">{CONTACTO.email}</p>
              </a>
            </div>
            <p className="mt-8 flex items-center justify-center gap-1.5 text-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" /> {CONTACTO.morada} — {t("contacto.area")}
            </p>
          </div>
        </section>

        {/* CTA final */}
        <section className="relative overflow-hidden bg-brand-navy px-4 py-16 text-center text-brand-navy-foreground sm:px-8 sm:py-20">
          <div className="bg-grid-pattern pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_70%_100%_at_50%_50%,black,transparent)]" />
          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-brand-teal/20 blur-3xl" />
          <Reveal className="relative mx-auto max-w-xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("ctaFinal.titulo")}</h2>
            <p className="mt-3 text-white/80">{t("ctaFinal.texto")}</p>
            <div className="mt-7">
              <Button
                size="lg"
                className="bg-brand-gold text-brand-gold-foreground hover:bg-brand-gold/90"
                render={
                  <Link href="/registo">
                    {t("ctaFinal.botao")} <ArrowRight className="h-4 w-4" />
                  </Link>
                }
              />
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t px-4 py-10 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="flex flex-col items-center gap-3 text-center sm:items-start sm:text-left">
            <Logo tamanho="h-8" />
            <p className="max-w-xs text-sm text-muted-foreground">{t("footer.descricao")}</p>
          </div>
          <div className="flex flex-col items-center gap-2 text-center text-sm text-muted-foreground sm:items-start sm:text-left">
            <a href={CONTACTO.telefoneHref} className="flex items-center gap-1.5 hover:text-foreground">
              <Phone className="h-3.5 w-3.5" /> {CONTACTO.telefone}
            </a>
            <a href={`mailto:${CONTACTO.email}`} className="flex items-center gap-1.5 hover:text-foreground">
              <Mail className="h-3.5 w-3.5" /> {CONTACTO.email}
            </a>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> {CONTACTO.morada}
            </span>
          </div>
        </div>
        <div className="mx-auto mt-8 flex max-w-6xl flex-col items-center gap-2 border-t pt-6 text-center text-xs text-muted-foreground sm:flex-row sm:justify-between sm:text-left">
          <p>© {new Date().getFullYear()} BTS — Bizarro Total Solutions. {t("footer.direitos")}</p>
          <Link href="/privacidade" className="hover:text-foreground hover:underline">
            {t("footer.privacidade")}
          </Link>
        </div>
      </footer>
    </div>
  )
}
