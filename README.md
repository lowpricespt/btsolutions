# BTS — Bizarro Total Solutions

Plataforma web para a BTS, uma empresa portuguesa de serviços técnicos ao domicílio (eletricidade, telecomunicações, carpintaria, montagem de móveis, exaustores, montagem de TV/som, estendais, pintura e serviços gerais).

Três áreas, uma por perfil de utilizador:

- **`/cliente`** — pedir serviços, acompanhar o estado, ver fotos/comentários/fatura, avaliar depois de concluído.
- **`/equipa`** — gerir clientes e pedidos, transformar pedidos em trabalhos, agendar na agenda (drag-and-drop), anexar fotos.
- **`/admin`** — tudo o que a equipa vê, mais gestão de utilizadores, fornecedores, stock, ferramentas, viaturas, faturas, catálogo de serviços e o log de auditoria.

## Stack técnica

- **Next.js 16 (App Router)** + TypeScript
- **Tailwind CSS v4** + **shadcn/ui** (nota: esta instalação do shadcn usa [Base UI](https://base-ui.com) em vez de Radix — ver "Notas técnicas" abaixo)
- **@supabase/supabase-js** + **@supabase/ssr** para autenticação e dados
- **FullCalendar** (`timeGridWeek` + `listWeek`) para a agenda com drag-and-drop
- **react-hook-form** + **zod** para formulários e validação

A base de dados (Postgres/Supabase) já existe e está fora deste repositório — ver `BTS_schema.sql` na pasta do projeto para o esquema completo, incluindo Row Level Security. **A app nunca reimplementa as regras de acesso**: confia sempre nas políticas RLS, usando o cliente Supabase autenticado (nunca a `service_role key` no browser).

## Como correr localmente

### 1. Instalar dependências

```bash
npm install
```

### 2. Variáveis de ambiente

Cria um ficheiro `.env.local` na raiz do projeto:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://rupvdmgiqmukbmrmqpbc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_F0CZ4KTBS6898VjoWZbg9g_QtT1wel6

# Só necessária para criar contas de utilizador a partir da app
# (cliente criado por um funcionário, ou funcionário/admin criado por um
# admin). Nunca é exposta ao browser. Obtém em:
# Supabase Dashboard -> Settings -> API -> service_role key.
SUPABASE_SERVICE_ROLE_KEY=
```

Sem a `SUPABASE_SERVICE_ROLE_KEY`, tudo o resto da app funciona normalmente — só a criação de contas (`/admin/utilizadores/novo`, "Novo cliente" em `/equipa/clientes` ou `/admin/clientes`) mostra um erro claro a pedir a chave em vez de falhar em silêncio.

### 3. Correr o servidor de desenvolvimento

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### 4. Build de produção

```bash
npm run build
npm run start
```

## Contas de teste

Não existem contas pré-criadas na base de dados de produção. Para testar os três perfis:

1. Regista uma conta de cliente em `/registo` (o registo público só cria clientes).
2. Confirma o email (ou desativa a confirmação de email nas definições de Auth do projeto Supabase, para desenvolvimento).
3. Com a `SUPABASE_SERVICE_ROLE_KEY` configurada, entra como esse cliente, e pede a um administrador existente para criar contas de funcionário/admin em `/admin/utilizadores/novo` — ou cria a primeira conta de admin diretamente na base de dados (`insert into administradores ...` depois de a linha em `utilizadores` existir).

## Estrutura do projeto

```
src/
  app/
    (auth)/login, registo          — autenticação pública
    cliente/                       — área do cliente
    equipa/                        — área do funcionário
    admin/                         — área do administrador
    api/utilizadores/criar/        — route handler (service role) para criar contas
  components/
    ui/                            — componentes shadcn/ui (Base UI)
    layout/                        — AppShell, navegação
    pedidos/, agenda/, clientes/, admin/  — componentes de cada módulo
  lib/
    supabase/                      — clientes Supabase (browser, server, middleware, admin)
    database.types.ts              — tipos gerados a partir do schema
    labels.ts, format.ts           — rótulos em português e formatação (moeda, datas)
  proxy.ts                         — middleware de proteção de rotas por perfil (UX only — a segurança real é RLS)
```

## Notas técnicas e decisões tomadas

- **Trigger `handle_new_user` estendido**: o schema original só criava a linha em `utilizadores` no registo. Como `pedidos.id_cliente` referencia `clientes(id)` e não havia política RLS que permitisse a um cliente inserir a sua própria linha em `clientes`, um cliente registado publicamente nunca conseguiria criar um pedido. O trigger foi estendido (migração `provisiona_linha_clientes_no_registo`) para também criar a linha em `clientes` quando `tipo_utilizador = 'cliente'` — sem alterar nenhuma política RLS.
- **Função `trabalho_do_pedido(p_id)`**: nova função `security definer` (espelha `pedido_do_trabalho` já existente) que permite a um cliente resolver o `id_trabalho` do seu próprio pedido sem precisar de acesso direto à tabela `trabalhos` (que é exclusiva do staff), para poder consultar os seus anexos.
- **Bucket de Storage `anexos`**: criado (privado) com políticas que espelham exatamente a RLS da tabela `anexos` — staff lê/escreve tudo, cliente só lê os anexos dos seus próprios pedidos.
- **Catálogo de `tipos_servico`**: o schema só semeava `especialidades`. Foi adicionado um catálogo inicial de ~19 tipos de serviço (dados reais do negócio descrito, não dados de teste) para o fluxo cliente → pedido funcionar imediatamente; o admin pode geri-lo em `/admin/catalogo/tipos-servico`.
- **Log de Atividade**: a tabela `log_atividade` não tinha nenhum trigger automático — a app regista explicitamente as ações mais significativas (mudar estado de um pedido, transformar em trabalho, agendar, criar contas, ativar/desativar contas) através de `src/lib/registar-atividade.ts`.
- **shadcn/ui com Base UI**: esta instalação do `shadcn` gera componentes sobre `@base-ui/react`, não `@radix-ui`. Isto significa: usar a prop `render` para composição (`<Button render={<Link .../>} />`) em vez de `asChild`; `<SelectValue>` precisa de uma função `children` para mostrar o rótulo em vez do valor em bruto quando o valor não é já o texto legível.
- **Restrição de edição de clientes por RLS**: um funcionário pode editar os dados de faturação de um cliente (tabela `clientes`), mas não o nome/telefone/morada (tabela `utilizadores`) — só um administrador ou o próprio cliente podem alterar esses campos. A UI reflete isto (campos de contacto ficam desativados para funcionários).

## Deploy

O alvo de deploy é a [Vercel](https://vercel.com). Configura as mesmas variáveis de ambiente do `.env.local` nas definições do projeto na Vercel (incluindo `SUPABASE_SERVICE_ROLE_KEY` se quiseres que a criação de contas funcione em produção).
