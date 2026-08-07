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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/brand/logo"

const SERVICOS = [
  { nome: "Eletricidade", icon: Zap, cor: "gold" as const },
  { nome: "Telecomunicações", icon: Wifi, cor: "teal" as const },
  { nome: "Carpintaria", icon: Hammer, cor: "wood" as const },
  { nome: "Montagem de Móveis", icon: Armchair, cor: "navy" as const },
  { nome: "Exaustores", icon: Fan, cor: "teal" as const },
  { nome: "Montagem de TV / Som", icon: Tv, cor: "gold" as const },
  { nome: "Estendais", icon: Shirt, cor: "navy" as const },
  { nome: "Pintura", icon: Paintbrush, cor: "wood" as const },
  { nome: "Serviços Gerais", icon: Wrench, cor: "teal" as const },
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
    texto: "A nossa equipa confirma contigo a melhor data e envia um técnico qualificado.",
  },
  {
    icon: ThumbsUp,
    titulo: "Acompanhas tudo online",
    texto: "Vês o estado do pedido, falas com a equipa, recebes a fatura e avalias o serviço.",
  },
]

const VANTAGENS = [
  { icon: Clock, titulo: "Resposta rápida", texto: "Entramos em contacto assim que recebemos o teu pedido." },
  { icon: ShieldCheck, titulo: "Profissionais de confiança", texto: "Equipa própria, qualificada em cada área." },
  { icon: BadgeEuro, titulo: "Sem surpresas no preço", texto: "Orçamento claro antes de começar o trabalho." },
]

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-1 flex-col bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-8">
          <Logo tamanho="h-10" />
          <div className="flex items-center gap-2">
            <Button variant="ghost" render={<Link href="/login">Entrar</Link>} />
            <Button
              className="bg-brand-gold text-brand-gold-foreground hover:bg-brand-gold/90"
              render={<Link href="/registo">Criar conta</Link>}
            />
          </div>
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
                Soluções inteligentes, resultados excelentes
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
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-20">
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
        <section className="border-y bg-muted/30 px-4 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">As nossas especialidades</h2>
              <p className="mt-2 text-muted-foreground">
                Uma equipa, todas as competências que a tua casa precisa.
              </p>
            </div>
            <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3">
              {SERVICOS.map(({ nome, icon: Icon, cor }) => (
                <div
                  key={nome}
                  className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-shadow hover:shadow-md"
                >
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${CORES[cor]}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-medium">{nome}</span>
                </div>
              ))}
            </div>
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

      <footer className="border-t px-4 py-8 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
          <Logo tamanho="h-8" />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} BTS — Bizarro Total Solutions. Soluções inteligentes, resultados excelentes.
          </p>
        </div>
      </footer>
    </div>
  )
}
