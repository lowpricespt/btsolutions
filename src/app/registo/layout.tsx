import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Criar conta",
  description:
    "Cria a tua conta gratuita na BTS e pede serviços técnicos ao domicílio — eletricidade, carpintaria, telecomunicações e muito mais.",
}

export default function RegistoLayout({ children }: { children: React.ReactNode }) {
  return children
}
