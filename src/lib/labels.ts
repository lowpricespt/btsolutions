// Rótulos e cores (em português) para os enums do schema. As cores usam
// classes Tailwind soltas (não os tokens de domínio) porque representam
// estado/semântica (sucesso, aviso, perigo), não a área funcional.
export type BadgeTom =
  | "cinza"
  | "azul"
  | "amarelo"
  | "verde"
  | "vermelho"
  | "roxo"

export const TOM_CLASSES: Record<BadgeTom, string> = {
  cinza: "bg-muted text-muted-foreground border-transparent",
  azul: "bg-blue-100 text-blue-800 border-transparent dark:bg-blue-950 dark:text-blue-300",
  amarelo:
    "bg-amber-100 text-amber-800 border-transparent dark:bg-amber-950 dark:text-amber-300",
  verde:
    "bg-emerald-100 text-emerald-800 border-transparent dark:bg-emerald-950 dark:text-emerald-300",
  vermelho:
    "bg-red-100 text-red-800 border-transparent dark:bg-red-950 dark:text-red-300",
  roxo: "bg-purple-100 text-purple-800 border-transparent dark:bg-purple-950 dark:text-purple-300",
}

type EnumMap = Record<string, { label: string; tom: BadgeTom }>

export const ESTADO_PEDIDO: EnumMap = {
  pendente: { label: "Pendente", tom: "amarelo" },
  aprovado: { label: "Aprovado", tom: "azul" },
  em_curso: { label: "Em curso", tom: "azul" },
  concluido: { label: "Concluído", tom: "verde" },
  cancelado: { label: "Cancelado", tom: "vermelho" },
}

export const PRIORIDADE: EnumMap = {
  baixa: { label: "Baixa", tom: "cinza" },
  normal: { label: "Normal", tom: "azul" },
  alta: { label: "Alta", tom: "amarelo" },
  urgente: { label: "Urgente", tom: "vermelho" },
}

export const ESTADO_TRABALHO: EnumMap = {
  planeado: { label: "Planeado", tom: "cinza" },
  em_curso: { label: "Em curso", tom: "azul" },
  concluido: { label: "Concluído", tom: "verde" },
  cancelado: { label: "Cancelado", tom: "vermelho" },
}

export const ESTADO_AGENDA: EnumMap = {
  agendado: { label: "Agendado", tom: "azul" },
  em_curso: { label: "Em curso", tom: "amarelo" },
  concluido: { label: "Concluído", tom: "verde" },
  remarcado: { label: "Remarcado", tom: "roxo" },
}

export const ESTADO_FERRAMENTA: EnumMap = {
  disponivel: { label: "Disponível", tom: "verde" },
  em_uso: { label: "Em uso", tom: "azul" },
  manutencao: { label: "Manutenção", tom: "amarelo" },
  avariada: { label: "Avariada", tom: "vermelho" },
}

export const ESTADO_VIATURA: EnumMap = {
  disponivel: { label: "Disponível", tom: "verde" },
  em_uso: { label: "Em uso", tom: "azul" },
  manutencao: { label: "Manutenção", tom: "amarelo" },
}

export const ESTADO_PAGAMENTO: EnumMap = {
  pendente: { label: "Pendente", tom: "amarelo" },
  pago: { label: "Pago", tom: "verde" },
  parcial: { label: "Parcial", tom: "azul" },
}

export const METODO_PAGAMENTO: EnumMap = {
  mbway: { label: "MB WAY", tom: "roxo" },
  transferencia: { label: "Transferência", tom: "azul" },
  multibanco: { label: "Multibanco", tom: "azul" },
  numerario: { label: "Numerário", tom: "verde" },
}

export const TIPO_ANEXO: EnumMap = {
  foto_antes: { label: "Foto (antes)", tom: "azul" },
  foto_depois: { label: "Foto (depois)", tom: "verde" },
  documento: { label: "Documento", tom: "cinza" },
}

export const TIPO_UTILIZADOR: EnumMap = {
  cliente: { label: "Cliente", tom: "azul" },
  funcionario: { label: "Funcionário", tom: "verde" },
  administrador: { label: "Administrador", tom: "roxo" },
}

export const TIPO_CLIENTE: EnumMap = {
  particular: { label: "Particular", tom: "azul" },
  empresa: { label: "Empresa", tom: "roxo" },
}

export const ESTADO_UTILIZADOR: EnumMap = {
  ativo: { label: "Ativo", tom: "verde" },
  inativo: { label: "Inativo", tom: "cinza" },
}

export const NIVEL_EXPERIENCIA: EnumMap = {
  iniciante: { label: "Iniciante", tom: "cinza" },
  intermedio: { label: "Intermédio", tom: "azul" },
  avancado: { label: "Avançado", tom: "verde" },
}

export const PAPEL_TRABALHO: EnumMap = {
  responsavel: { label: "Responsável", tom: "azul" },
  apoio: { label: "Apoio", tom: "cinza" },
}

export const NIVEL_ACESSO: EnumMap = {
  admin: { label: "Admin", tom: "roxo" },
  superadmin: { label: "Superadmin", tom: "vermelho" },
}

export const ESPECIALIDADES_ICONE: Record<string, string> = {
  Eletricidade: "Zap",
  Telecomunicações: "Wifi",
  Carpintaria: "Hammer",
  "Montagem de Móveis": "Armchair",
  Exaustores: "Fan",
  "Montagem de TV / Som": "Tv",
  Estendais: "Shirt",
  Pintura: "Paintbrush",
  "Serviços Gerais": "Wrench",
}
