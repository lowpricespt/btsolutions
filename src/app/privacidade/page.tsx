import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Logo } from "@/components/brand/logo"
import { CONTACTO } from "@/lib/contacto"

export const metadata = {
  title: "Política de Privacidade — BTS",
}

export default function PrivacidadePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-8">
          <Logo tamanho="h-9" />
          <Link href="/" className="flex items-center gap-1.5 text-sm font-medium text-foreground/70 hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Política de Privacidade</h1>
        <p className="mt-2 text-sm text-muted-foreground">Última atualização: agosto de 2026</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-foreground/90">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Quem somos</h2>
            <p className="mt-2">
              A BTS — Bizarro Total Solutions ("nós", "a nossa empresa") presta serviços técnicos ao
              domicílio (eletricidade, telecomunicações, carpintaria e outros). Esta plataforma
              permite a clientes pedir serviços e acompanhar o respetivo estado.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">2. Que dados recolhemos</h2>
            <p className="mt-2">Recolhemos apenas os dados necessários para prestar o serviço:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Dados de identificação: nome, email e telefone.</li>
              <li>Dados de morada, quando necessários para deslocação de um técnico.</li>
              <li>Detalhes dos pedidos de serviço: descrição, fotografias/anexos, comentários e histórico.</li>
              <li>Dados de faturação, quando aplicável.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Para que usamos os dados</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Gerir a tua conta e autenticação na plataforma.</li>
              <li>Processar e acompanhar os teus pedidos de serviço.</li>
              <li>Comunicar contigo sobre agendamentos, orçamentos e faturas.</li>
              <li>Cumprir obrigações legais e fiscais.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Base legal</h2>
            <p className="mt-2">
              Tratamos os teus dados com base na execução do contrato de prestação de serviços entre
              ti e a BTS, no teu consentimento (quando aplicável) e no cumprimento de obrigações
              legais, nos termos do Regulamento Geral de Proteção de Dados (RGPD).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Partilha de dados</h2>
            <p className="mt-2">
              Não vendemos nem partilhamos os teus dados com terceiros para fins de marketing. Os
              teus dados são armazenados em infraestrutura de terceiros de confiança (fornecedor de
              base de dados e alojamento) que atuam como subcontratantes, apenas para efeitos de
              funcionamento técnico da plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">6. Quanto tempo guardamos os dados</h2>
            <p className="mt-2">
              Mantemos os teus dados enquanto a tua conta estiver ativa e pelo período adicional
              exigido por obrigações legais e fiscais. Podes pedir a eliminação da tua conta a
              qualquer momento através dos contactos abaixo.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">7. Os teus direitos</h2>
            <p className="mt-2">Nos termos do RGPD, tens direito a:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Aceder aos dados que temos sobre ti.</li>
              <li>Solicitar a retificação de dados incorretos.</li>
              <li>Solicitar o apagamento dos teus dados ("direito ao esquecimento").</li>
              <li>Opor-te ao tratamento ou solicitar a limitação do mesmo.</li>
              <li>Solicitar a portabilidade dos teus dados.</li>
            </ul>
            <p className="mt-2">
              Para exercer qualquer um destes direitos, contacta-nos através do email{" "}
              <a href={`mailto:${CONTACTO.email}`} className="font-medium text-brand-navy hover:underline dark:text-brand-gold">
                {CONTACTO.email}
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">8. Segurança</h2>
            <p className="mt-2">
              Aplicamos medidas técnicas e organizativas adequadas para proteger os teus dados,
              incluindo controlo de acessos por perfil de utilizador e encriptação nas comunicações.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">9. Cookies</h2>
            <p className="mt-2">
              Usamos apenas cookies estritamente necessários ao funcionamento da plataforma — em
              concreto, um cookie de sessão que mantém a tua conta autenticada enquanto navegas.
              Sem este cookie não é possível manteres a sessão iniciada.
            </p>
            <p className="mt-2">
              Não usamos cookies de publicidade, de rastreio de terceiros, nem ferramentas de
              análise que identifiquem a tua navegação. Como estes cookies são essenciais ao
              serviço, não é possível desativá-los mantendo o acesso à tua conta — mas nunca são
              usados para outro fim que não o de te manteres autenticado em segurança.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">10. Alterações a esta política</h2>
            <p className="mt-2">
              Podemos atualizar esta política periodicamente. A data da última atualização está
              indicada no topo desta página.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">11. Contactos</h2>
            <p className="mt-2">
              Para questões relacionadas com privacidade e proteção de dados, contacta-nos através
              de {CONTACTO.email} ou {CONTACTO.telefone}.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t px-4 py-6 text-center text-xs text-muted-foreground sm:px-8">
        © {new Date().getFullYear()} BTS — Bizarro Total Solutions.
      </footer>
    </div>
  )
}
