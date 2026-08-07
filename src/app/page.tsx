import Link from "next/link"
import {
  Wrench,
  Zap,
  Wifi,
  Hammer,
  Armchair,
  Fan,
  Tv,
  Shirt,
  Paintbrush,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const SERVICOS = [
  { nome: "Eletricidade", icon: Zap },
  { nome: "Telecomunicações", icon: Wifi },
  { nome: "Carpintaria", icon: Hammer },
  { nome: "Montagem de Móveis", icon: Armchair },
  { nome: "Exaustores", icon: Fan },
  { nome: "Montagem de TV / Som", icon: Tv },
  { nome: "Estendais", icon: Shirt },
  { nome: "Pintura", icon: Paintbrush },
  { nome: "Serviços Gerais", icon: Wrench },
]

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <header className="flex items-center justify-between border-b px-4 py-4 sm:px-8">
        <div className="flex items-center gap-2 font-bold text-domain-blue">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-domain-blue text-domain-blue-foreground">
            <Wrench className="h-4 w-4" />
          </span>
          BTS
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" render={<Link href="/login">Entrar</Link>} />
          <Button render={<Link href="/registo">Criar conta</Link>} />
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:py-24">
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Serviços técnicos ao domicílio,
            <span className="text-domain-blue"> sem complicações</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground sm:text-lg">
            Pede um serviço, acompanha o estado do pedido e fala com a nossa
            equipa — tudo numa só plataforma.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button
              size="lg"
              render={
                <Link href="/registo">
                  Pedir um serviço <ArrowRight className="h-4 w-4" />
                </Link>
              }
            />
            <Button size="lg" variant="outline" render={<Link href="/login">Já sou cliente</Link>} />
          </div>
        </section>

        <section className="border-t bg-muted/30 px-4 py-14 sm:px-8">
          <h2 className="mb-8 text-center text-xl font-semibold">
            As nossas especialidades
          </h2>
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3">
            {SERVICOS.map(({ nome, icon: Icon }) => (
              <div
                key={nome}
                className="flex items-center gap-3 rounded-lg border bg-card p-4"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-domain-green-soft text-domain-green">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium">{nome}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t px-4 py-6 text-center text-sm text-muted-foreground sm:px-8">
        © {new Date().getFullYear()} BTS — Bizarro Total Solutions
      </footer>
    </div>
  )
}
