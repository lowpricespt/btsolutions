import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Entrar",
  description: "Inicia sessão na tua conta BTS para acompanhar os teus pedidos de serviço.",
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
