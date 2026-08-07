"use client"

import { useState } from "react"
import Link from "next/link"
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
  Menu,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  BadgeCheck,
  Wallet,
  Map,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Logo } from "@/components/brand/logo"
import { CONTACTO } from "@/lib/contacto"

const SERVICOS = [
  {
    nome: "Eletricidade",
    icon: Zap,
    cor: "gold" as const,
    texto: "Instalações, quadros elétricos, reparações, certificações ITED/ITUR e iluminação LED.",
  },
  {
    nome: "Telecomunicações",
    icon: Wifi,
    cor: "teal" as const,
    texto: "CCTV, alarmes, redes estruturadas, fibra ótica, controlo de acessos e domótica.",
  },
  {
    nome: "Carpintaria",
    icon: Hammer,
    cor: "wood" as const,
    texto: "Mobiliário à medida, roupeiros embutidos, pavimentos e decks exteriores.",
  },
  { nome: "Montagem de Móveis", icon: Armchair, cor: "navy" as const, texto: "Montagem rápida e cuidada de qualquer mobiliário." },
  { nome: "Exaustores", icon: Fan, cor: "teal" as const, texto: "Instalação e manutenção de exaustores de cozinha." },
  { nome: "Montagem de TV / Som", icon: Tv, cor: "gold" as const, texto: "Fixação de TV, colunas e sistemas de som." },
  { nome: "Estendais", icon: Shirt, cor: "navy" as const, texto: "Instalação de estendais elétricos e manuais." },
  { nome: "Pintura", icon: Paintbrush, cor: "wood" as const, texto: "Pintura de interiores e exteriores com acabamento profissional." },
  { nome: "Serviços Gerais", icon: Wrench, cor: "teal" as const, texto: "Pequenas reparações e manutenção geral da casa." },
]

const CORES = {
  gold: "bg-brand-gold-soft text-brand-gold-foreground",
  teal: "bg-brand-teal-soft text-brand-teal",
  wood: "bg-brand-wood-soft text-brand-wood",
  navy: "bg-brand-navy-soft text-brand-navy",
}

const PASSOS = [
  {
    icon: ClipboardCheck,
    titulo: "Pedes o serviço",
    texto: "Escolhes a especialidade, descreves o que precisas e a morada — leva menos de um minuto.",
  },
  {
    icon: CalendarCheck2,
    titulo: "Agendamos um profissional",
    texto: "Respondemos a todos os pedidos em 24h e enviamos um técnico qualificado.",
  },
  {
    icon: ThumbsUp,
    titulo: "Acompanhas tudo online",
    texto: "Vês o estado do pedido, falas com a equipa, recebes a fatura e avalias o serviço.",
  },
]

const VANTAGENS = [
  { icon: Clock, titulo: "Resposta em 24h", texto: "Respondemos a todos os pedidos em dias úteis — mais rápido via WhatsApp." },
  { icon: ShieldCheck, titulo: "Garantia total", texto: "12 meses em instalações e 6 meses em reparações." },
  { icon: BadgeEuro, titulo: "Sem surpresas no preço", texto: "Orçamento grátis e sem compromisso antes de começar." },
]

const CONFIANCA = [
  { icon: BadgeCheck, titulo: "Trabalho sério, preço justo", texto: "Equipa própria, qualificada em cada área, com garantia incluída." },
  { icon: Map, titulo: "Área de atuação alargada", texto: "Grande Porto, Braga, Aveiro e arredores — raio de cerca de 100 km." },
  { icon: Wallet, titulo: "Pagamento fácil", texto: "Transferência, MB Way/Multibanco ou dinheiro. Obras maiores podem ser faseadas." },
]

const NAV_LINKS = [
  { href: "#servicos", label: "Serviços" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#confianca", label: "Porque escolher-nos" },
  { href: "#contacto", label: "Contacto" },
]

export default function LandingPage() {
  const [menuAberto, setMenuAberto] = useState(false)

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-8">
          <Logo tamanho="h-10" />

          <nav className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="text-sm font-medium text-foreground/70 hover:text-foreground">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" render={<Link href="/login">Entrar</Link>} />
            <Button
              className="bg-brand-gold text-brand-gold-foreground hover:bg-brand-gold/90"
              render={<Link href="/registo">Criar conta</Link>}
            />
          </div>

          <Sheet open={menuAberto} onOpenChange={setMenuAberto}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              }
            />
            <SheetContent side="right" className="w-72 p-0">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="border-b px-5 py-4">
                <Logo tamanho="h-8" />
              </div>
              <nav className="flex flex-col gap-1 px-3 py-4">
                {NAV_LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setMenuAberto(false)}
                    className="rounded-md px-2.5 py-2.5 text-sm font-medium text-foreground/80 hover:bg-muted"
                  >
                    {l.label}
                  </a>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-2 border-t p-4">
                <Button variant="outline" render={<Link href="/login">Entrar</Link>} />
                <Button
                  className="bg-brand-gold text-brand-gold-foreground hover:bg-brand-gold/90"
                  render={<Link href="/registo">Criar conta</Link>}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-brand-navy text-brand-navy-foreground">
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-gold/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-brand-teal/20 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
                <Star className="h-3.5 w-3.5 fill-brand-gold text-brand-gold" />
                Trabalho sério, preço justo e garantia total
              </span>
              <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
                Serviços técnicos ao domicílio,
                <span className="text-brand-gold"> sem complicações</span>
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-white/80 sm:text-lg">
                Eletricidade, carpintaria, telecomunicações e muito mais. Pede um
                serviço, acompanha o estado do pedido e fala com a nossa equipa —
                tudo numa só plataforma.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="bg-brand-gold text-brand-gold-foreground hover:bg-brand-gold/90"
                  render={
                    <Link href="/registo">
                      Pedir um serviço <ArrowRight className="h-4 w-4" />
                    </Link>
                  }
                />
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
                  render={<Link href="/login">Já sou cliente</Link>}
                />
              </div>
            </div>

            <div className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
              {VANTAGENS.map(({ icon: Icon, titulo, texto }) => (
                <div key={titulo} className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                  <Icon className="h-5 w-5 text-brand-gold" />
                  <p className="mt-2 text-sm font-semibold">{titulo}</p>
                  <p className="mt-0.5 text-xs text-white/70">{texto}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Como funciona */}
        <section id="como-funciona" className="mx-auto max-w-6xl scroll-mt-28 px-4 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Como funciona</h2>
            <p className="mt-2 text-muted-foreground">
              Do pedido à conclusão do trabalho, em três passos simples.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {PASSOS.map(({ icon: Icon, titulo, texto }, i) => (
              <div key={titulo} className="relative rounded-2xl border bg-card p-6">
                <span className="absolute -top-3 -left-1 flex h-7 w-7 items-center justify-center rounded-full bg-brand-navy text-xs font-bold text-brand-navy-foreground">
                  {i + 1}
                </span>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gold-soft text-brand-gold-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-4 font-semibold">{titulo}</p>
                <p className="mt-1 text-sm text-muted-foreground">{texto}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Especialidades */}
        <section id="servicos" className="border-y bg-muted/30 px-4 py-16 scroll-mt-20 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">As nossas especialidades</h2>
              <p className="mt-2 text-muted-foreground">
                Uma equipa, todas as competências que a tua casa precisa.
              </p>
            </div>
            <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICOS.map(({ nome, icon: Icon, cor, texto }) => (
                <div
                  key={nome}
                  className="flex gap-3 rounded-xl border bg-card p-4 transition-shadow hover:shadow-md"
                >
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${CORES[cor]}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{nome}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{texto}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Confiança / porque escolher-nos */}
        <section id="confianca" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Porque escolher a BTS</h2>
            <p className="mt-2 text-muted-foreground">
              Soluções inteligentes, resultados excelentes — é assim que trabalhamos.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {CONFIANCA.map(({ icon: Icon, titulo, texto }) => (
              <div key={titulo} className="rounded-2xl border bg-card p-6 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-teal-soft text-brand-teal">
                  <Icon className="h-6 w-6" />
                </span>
                <p className="mt-4 font-semibold">{titulo}</p>
                <p className="mt-1 text-sm text-muted-foreground">{texto}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contacto */}
        <section id="contacto" className="border-y bg-muted/30 px-4 py-16 scroll-mt-20 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Fala connosco</h2>
              <p className="mt-2 text-muted-foreground">
                Estamos disponíveis por telefone, WhatsApp ou email. Orçamento grátis e sem compromisso.
              </p>
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
                <p className="font-semibold">WhatsApp</p>
                <p className="text-sm text-muted-foreground">{CONTACTO.telefone}</p>
              </a>
              <a
                href={CONTACTO.telefoneHref}
                className="flex flex-col items-center gap-2 rounded-2xl border bg-card p-6 text-center transition-shadow hover:shadow-md"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gold-soft text-brand-gold-foreground">
                  <Phone className="h-6 w-6" />
                </span>
                <p className="font-semibold">Telefone</p>
                <p className="text-sm text-muted-foreground">{CONTACTO.telefone}</p>
              </a>
              <a
                href={`mailto:${CONTACTO.email}`}
                className="flex flex-col items-center gap-2 rounded-2xl border bg-card p-6 text-center transition-shadow hover:shadow-md"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-navy-soft text-brand-navy">
                  <Mail className="h-6 w-6" />
                </span>
                <p className="font-semibold">Email</p>
                <p className="text-sm text-muted-foreground">{CONTACTO.email}</p>
              </a>
            </div>
            <p className="mt-8 flex items-center justify-center gap-1.5 text-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" /> {CONTACTO.morada} — atendemos toda a área metropolitana do Porto, Braga e Aveiro
            </p>
          </div>
        </section>

        {/* CTA final */}
        <section className="relative overflow-hidden bg-brand-navy px-4 py-16 text-center text-brand-navy-foreground sm:px-8 sm:py-20">
          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-brand-teal/20 blur-3xl" />
          <div className="relative mx-auto max-w-xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Precisas de um técnico? Estamos a um pedido de distância.
            </h2>
            <p className="mt-3 text-white/80">
              Cria a tua conta gratuita e faz o teu primeiro pedido em menos de dois minutos.
            </p>
            <div className="mt-7">
              <Button
                size="lg"
                className="bg-brand-gold text-brand-gold-foreground hover:bg-brand-gold/90"
                render={
                  <Link href="/registo">
                    Criar conta grátis <ArrowRight className="h-4 w-4" />
                  </Link>
                }
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t px-4 py-10 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="flex flex-col items-center gap-3 text-center sm:items-start sm:text-left">
            <Logo tamanho="h-8" />
            <p className="max-w-xs text-sm text-muted-foreground">
              Soluções inteligentes, resultados excelentes. Serviços técnicos ao domicílio na Grande Área do Porto, Braga e Aveiro.
            </p>
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
          <p>© {new Date().getFullYear()} BTS — Bizarro Total Solutions. Todos os direitos reservados.</p>
          <Link href="/privacidade" className="hover:text-foreground hover:underline">
            Política de Privacidade
          </Link>
        </div>
      </footer>
    </div>
  )
}
