import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import type { Database } from "@/lib/database.types"

type TipoUtilizador = Database["public"]["Enums"]["tipo_utilizador_enum"]

type CorpoPedido = {
  nome: string
  email: string
  tipo_utilizador: TipoUtilizador
  telefone?: string
  morada?: string
  codigo_postal?: string
  localidade?: string
  // cliente
  nif?: string
  tipo_cliente?: Database["public"]["Enums"]["tipo_cliente_enum"]
  nome_empresa?: string
  // funcionario
  numero_funcionario?: string
  cargo?: string
  // administrador
  nivel_acesso?: Database["public"]["Enums"]["nivel_acesso_enum"]
  departamento?: string
}

function gerarPasswordTemporaria() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 12)
}

export async function POST(request: Request) {
  const corpo = (await request.json()) as CorpoPedido

  if (!corpo.nome || !corpo.email || !corpo.tipo_utilizador) {
    return NextResponse.json({ erro: "Faltam campos obrigatórios." }, { status: 400 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ erro: "Não autenticado." }, { status: 401 })

  const { data: perfil } = await supabase
    .from("utilizadores")
    .select("tipo_utilizador")
    .eq("id", user.id)
    .single()

  const souAdmin = perfil?.tipo_utilizador === "administrador"
  const souStaff = souAdmin || perfil?.tipo_utilizador === "funcionario"

  if (corpo.tipo_utilizador === "cliente" && !souStaff) {
    return NextResponse.json({ erro: "Sem permissão." }, { status: 403 })
  }
  if (corpo.tipo_utilizador !== "cliente" && !souAdmin) {
    return NextResponse.json({ erro: "Só um administrador pode criar esta conta." }, { status: 403 })
  }

  let admin
  try {
    admin = createAdminClient()
  } catch (e) {
    return NextResponse.json({ erro: (e as Error).message }, { status: 500 })
  }

  const passwordTemporaria = gerarPasswordTemporaria()

  const { data: novoUtilizador, error: erroCriacao } = await admin.auth.admin.createUser({
    email: corpo.email,
    password: passwordTemporaria,
    email_confirm: true,
    user_metadata: { nome: corpo.nome, tipo_utilizador: corpo.tipo_utilizador },
  })

  if (erroCriacao || !novoUtilizador.user) {
    return NextResponse.json(
      { erro: erroCriacao?.message ?? "Não foi possível criar a conta." },
      { status: 400 }
    )
  }

  const novoId = novoUtilizador.user.id

  // dados adicionais em "utilizadores" (o trigger só define nome/email/tipo)
  await admin
    .from("utilizadores")
    .update({
      telefone: corpo.telefone || null,
      morada: corpo.morada || null,
      codigo_postal: corpo.codigo_postal || null,
      localidade: corpo.localidade || null,
      criado_por: user.id,
    })
    .eq("id", novoId)

  if (corpo.tipo_utilizador === "cliente") {
    // a linha em "clientes" já foi criada pelo trigger; atualiza os campos extra
    await admin
      .from("clientes")
      .update({
        nif: corpo.nif || null,
        tipo_cliente: corpo.tipo_cliente ?? "particular",
        nome_empresa: corpo.nome_empresa || null,
      })
      .eq("id", novoId)
  } else if (corpo.tipo_utilizador === "funcionario") {
    if (!corpo.numero_funcionario) {
      return NextResponse.json({ erro: "Indica o número de funcionário." }, { status: 400 })
    }
    const { error: erroSub } = await admin.from("funcionarios").insert({
      id: novoId,
      numero_funcionario: corpo.numero_funcionario,
      cargo: corpo.cargo || null,
    })
    if (erroSub) {
      return NextResponse.json({ erro: erroSub.message }, { status: 400 })
    }
  } else if (corpo.tipo_utilizador === "administrador") {
    const { error: erroSub } = await admin.from("administradores").insert({
      id: novoId,
      nivel_acesso: corpo.nivel_acesso ?? "admin",
      departamento: corpo.departamento || null,
    })
    if (erroSub) {
      return NextResponse.json({ erro: erroSub.message }, { status: 400 })
    }
  }

  await supabase.from("log_atividade").insert({
    id_utilizador: user.id,
    acao: "Criou uma conta de utilizador",
    entidade_afetada: "utilizadores",
    id_entidade_afetada: null,
    detalhes: `${corpo.tipo_utilizador}: ${corpo.nome} (${corpo.email})`,
  })

  return NextResponse.json({ id: novoId, passwordTemporaria })
}
