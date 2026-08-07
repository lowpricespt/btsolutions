export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      administradores: {
        Row: {
          departamento: string | null
          id: string
          nivel_acesso: Database["public"]["Enums"]["nivel_acesso_enum"]
        }
        Insert: {
          departamento?: string | null
          id: string
          nivel_acesso?: Database["public"]["Enums"]["nivel_acesso_enum"]
        }
        Update: {
          departamento?: string | null
          id?: string
          nivel_acesso?: Database["public"]["Enums"]["nivel_acesso_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "administradores_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "utilizadores"
            referencedColumns: ["id"]
          },
        ]
      }
      agenda: {
        Row: {
          cor_evento: string | null
          data_hora_fim: string
          data_hora_inicio: string
          estado: Database["public"]["Enums"]["estado_agenda_enum"]
          id: number
          id_funcionario: string | null
          id_trabalho: number | null
        }
        Insert: {
          cor_evento?: string | null
          data_hora_fim: string
          data_hora_inicio: string
          estado?: Database["public"]["Enums"]["estado_agenda_enum"]
          id?: number
          id_funcionario?: string | null
          id_trabalho?: number | null
        }
        Update: {
          cor_evento?: string | null
          data_hora_fim?: string
          data_hora_inicio?: string
          estado?: Database["public"]["Enums"]["estado_agenda_enum"]
          id?: number
          id_funcionario?: string | null
          id_trabalho?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "agenda_id_funcionario_fkey"
            columns: ["id_funcionario"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agenda_id_trabalho_fkey"
            columns: ["id_trabalho"]
            isOneToOne: false
            referencedRelation: "trabalhos"
            referencedColumns: ["id"]
          },
        ]
      }
      anexos: {
        Row: {
          data_upload: string
          id: number
          id_trabalho: number | null
          id_utilizador: string | null
          tipo: Database["public"]["Enums"]["tipo_anexo_enum"]
          url_ficheiro: string
        }
        Insert: {
          data_upload?: string
          id?: number
          id_trabalho?: number | null
          id_utilizador?: string | null
          tipo: Database["public"]["Enums"]["tipo_anexo_enum"]
          url_ficheiro: string
        }
        Update: {
          data_upload?: string
          id?: number
          id_trabalho?: number | null
          id_utilizador?: string | null
          tipo?: Database["public"]["Enums"]["tipo_anexo_enum"]
          url_ficheiro?: string
        }
        Relationships: [
          {
            foreignKeyName: "anexos_id_trabalho_fkey"
            columns: ["id_trabalho"]
            isOneToOne: false
            referencedRelation: "trabalhos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "anexos_id_utilizador_fkey"
            columns: ["id_utilizador"]
            isOneToOne: false
            referencedRelation: "utilizadores"
            referencedColumns: ["id"]
          },
        ]
      }
      avaliacoes: {
        Row: {
          classificacao: number
          comentario: string | null
          data_avaliacao: string
          id: number
          id_cliente: string
          id_pedido: number
        }
        Insert: {
          classificacao: number
          comentario?: string | null
          data_avaliacao?: string
          id?: number
          id_cliente: string
          id_pedido: number
        }
        Update: {
          classificacao?: number
          comentario?: string | null
          data_avaliacao?: string
          id?: number
          id_cliente?: string
          id_pedido?: number
        }
        Relationships: [
          {
            foreignKeyName: "avaliacoes_id_cliente_fkey"
            columns: ["id_cliente"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avaliacoes_id_pedido_fkey"
            columns: ["id_pedido"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          codigo_postal_faturacao: string | null
          id: string
          morada_faturacao: string | null
          nif: string | null
          nome_empresa: string | null
          observacoes: string | null
          tipo_cliente: Database["public"]["Enums"]["tipo_cliente_enum"]
        }
        Insert: {
          codigo_postal_faturacao?: string | null
          id: string
          morada_faturacao?: string | null
          nif?: string | null
          nome_empresa?: string | null
          observacoes?: string | null
          tipo_cliente?: Database["public"]["Enums"]["tipo_cliente_enum"]
        }
        Update: {
          codigo_postal_faturacao?: string | null
          id?: string
          morada_faturacao?: string | null
          nif?: string | null
          nome_empresa?: string | null
          observacoes?: string | null
          tipo_cliente?: Database["public"]["Enums"]["tipo_cliente_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "clientes_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "utilizadores"
            referencedColumns: ["id"]
          },
        ]
      }
      comentarios: {
        Row: {
          data_hora: string
          id: number
          id_pedido: number
          id_utilizador: string
          texto: string
          visivel_cliente: boolean
        }
        Insert: {
          data_hora?: string
          id?: number
          id_pedido: number
          id_utilizador: string
          texto: string
          visivel_cliente?: boolean
        }
        Update: {
          data_hora?: string
          id?: number
          id_pedido?: number
          id_utilizador?: string
          texto?: string
          visivel_cliente?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "comentarios_id_pedido_fkey"
            columns: ["id_pedido"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comentarios_id_utilizador_fkey"
            columns: ["id_utilizador"]
            isOneToOne: false
            referencedRelation: "utilizadores"
            referencedColumns: ["id"]
          },
        ]
      }
      especialidades: {
        Row: {
          descricao: string | null
          id: number
          nome: string
        }
        Insert: {
          descricao?: string | null
          id?: number
          nome: string
        }
        Update: {
          descricao?: string | null
          id?: number
          nome?: string
        }
        Relationships: []
      }
      faturas: {
        Row: {
          data_emissao: string
          estado_pagamento: Database["public"]["Enums"]["estado_pagamento_enum"]
          id: number
          id_pedido: number
          metodo_pagamento:
            | Database["public"]["Enums"]["metodo_pagamento_enum"]
            | null
          numero_fatura: string
          valor_total: number
        }
        Insert: {
          data_emissao?: string
          estado_pagamento?: Database["public"]["Enums"]["estado_pagamento_enum"]
          id?: number
          id_pedido: number
          metodo_pagamento?:
            | Database["public"]["Enums"]["metodo_pagamento_enum"]
            | null
          numero_fatura: string
          valor_total: number
        }
        Update: {
          data_emissao?: string
          estado_pagamento?: Database["public"]["Enums"]["estado_pagamento_enum"]
          id?: number
          id_pedido?: number
          metodo_pagamento?:
            | Database["public"]["Enums"]["metodo_pagamento_enum"]
            | null
          numero_fatura?: string
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "faturas_id_pedido_fkey"
            columns: ["id_pedido"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      ferramentas: {
        Row: {
          codigo_inventario: string | null
          data_aquisicao: string | null
          estado: Database["public"]["Enums"]["estado_ferramenta_enum"]
          id: number
          id_funcionario_responsavel: string | null
          nome: string
          valor_aquisicao: number | null
        }
        Insert: {
          codigo_inventario?: string | null
          data_aquisicao?: string | null
          estado?: Database["public"]["Enums"]["estado_ferramenta_enum"]
          id?: number
          id_funcionario_responsavel?: string | null
          nome: string
          valor_aquisicao?: number | null
        }
        Update: {
          codigo_inventario?: string | null
          data_aquisicao?: string | null
          estado?: Database["public"]["Enums"]["estado_ferramenta_enum"]
          id?: number
          id_funcionario_responsavel?: string | null
          nome?: string
          valor_aquisicao?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ferramentas_id_funcionario_responsavel_fkey"
            columns: ["id_funcionario_responsavel"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      fornecedores: {
        Row: {
          codigo_postal: string | null
          contacto_nome: string | null
          email: string | null
          id: number
          localidade: string | null
          morada: string | null
          nif: string | null
          nome: string
          telefone: string | null
        }
        Insert: {
          codigo_postal?: string | null
          contacto_nome?: string | null
          email?: string | null
          id?: number
          localidade?: string | null
          morada?: string | null
          nif?: string | null
          nome: string
          telefone?: string | null
        }
        Update: {
          codigo_postal?: string | null
          contacto_nome?: string | null
          email?: string | null
          id?: number
          localidade?: string | null
          morada?: string | null
          nif?: string | null
          nome?: string
          telefone?: string | null
        }
        Relationships: []
      }
      funcionario_especialidade: {
        Row: {
          id_especialidade: number
          id_funcionario: string
          nivel_experiencia: Database["public"]["Enums"]["nivel_experiencia_enum"]
        }
        Insert: {
          id_especialidade: number
          id_funcionario: string
          nivel_experiencia?: Database["public"]["Enums"]["nivel_experiencia_enum"]
        }
        Update: {
          id_especialidade?: number
          id_funcionario?: string
          nivel_experiencia?: Database["public"]["Enums"]["nivel_experiencia_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "funcionario_especialidade_id_especialidade_fkey"
            columns: ["id_especialidade"]
            isOneToOne: false
            referencedRelation: "especialidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "funcionario_especialidade_id_funcionario_fkey"
            columns: ["id_funcionario"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      funcionarios: {
        Row: {
          ativo: boolean
          cargo: string | null
          data_admissao: string | null
          id: string
          numero_funcionario: string
          salario: number | null
        }
        Insert: {
          ativo?: boolean
          cargo?: string | null
          data_admissao?: string | null
          id: string
          numero_funcionario: string
          salario?: number | null
        }
        Update: {
          ativo?: boolean
          cargo?: string | null
          data_admissao?: string | null
          id?: string
          numero_funcionario?: string
          salario?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "funcionarios_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "utilizadores"
            referencedColumns: ["id"]
          },
        ]
      }
      log_atividade: {
        Row: {
          acao: string
          data_hora: string
          detalhes: string | null
          entidade_afetada: string | null
          id: number
          id_entidade_afetada: number | null
          id_utilizador: string | null
        }
        Insert: {
          acao: string
          data_hora?: string
          detalhes?: string | null
          entidade_afetada?: string | null
          id?: number
          id_entidade_afetada?: number | null
          id_utilizador?: string | null
        }
        Update: {
          acao?: string
          data_hora?: string
          detalhes?: string | null
          entidade_afetada?: string | null
          id?: number
          id_entidade_afetada?: number | null
          id_utilizador?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "log_atividade_id_utilizador_fkey"
            columns: ["id_utilizador"]
            isOneToOne: false
            referencedRelation: "utilizadores"
            referencedColumns: ["id"]
          },
        ]
      }
      materiais: {
        Row: {
          categoria: string | null
          id: number
          id_fornecedor: number | null
          nome: string
          preco_unitario: number | null
          quantidade_minima: number
          quantidade_stock: number
          unidade_medida: string | null
        }
        Insert: {
          categoria?: string | null
          id?: number
          id_fornecedor?: number | null
          nome: string
          preco_unitario?: number | null
          quantidade_minima?: number
          quantidade_stock?: number
          unidade_medida?: string | null
        }
        Update: {
          categoria?: string | null
          id?: number
          id_fornecedor?: number | null
          nome?: string
          preco_unitario?: number | null
          quantidade_minima?: number
          quantidade_stock?: number
          unidade_medida?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "materiais_id_fornecedor_fkey"
            columns: ["id_fornecedor"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos: {
        Row: {
          codigo_postal_servico: string | null
          data_pedido: string
          data_pretendida: string | null
          descricao: string | null
          estado: Database["public"]["Enums"]["estado_pedido_enum"]
          id: number
          id_cliente: string
          id_tipo_servico: number | null
          morada_servico: string | null
          prioridade: Database["public"]["Enums"]["prioridade_enum"]
          titulo: string
          valor_final: number | null
          valor_orcamento: number | null
        }
        Insert: {
          codigo_postal_servico?: string | null
          data_pedido?: string
          data_pretendida?: string | null
          descricao?: string | null
          estado?: Database["public"]["Enums"]["estado_pedido_enum"]
          id?: number
          id_cliente: string
          id_tipo_servico?: number | null
          morada_servico?: string | null
          prioridade?: Database["public"]["Enums"]["prioridade_enum"]
          titulo: string
          valor_final?: number | null
          valor_orcamento?: number | null
        }
        Update: {
          codigo_postal_servico?: string | null
          data_pedido?: string
          data_pretendida?: string | null
          descricao?: string | null
          estado?: Database["public"]["Enums"]["estado_pedido_enum"]
          id?: number
          id_cliente?: string
          id_tipo_servico?: number | null
          morada_servico?: string | null
          prioridade?: Database["public"]["Enums"]["prioridade_enum"]
          titulo?: string
          valor_final?: number | null
          valor_orcamento?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_id_cliente_fkey"
            columns: ["id_cliente"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_id_tipo_servico_fkey"
            columns: ["id_tipo_servico"]
            isOneToOne: false
            referencedRelation: "tipos_servico"
            referencedColumns: ["id"]
          },
        ]
      }
      tipos_servico: {
        Row: {
          descricao: string | null
          duracao_estimada_horas: number | null
          id: number
          id_especialidade: number | null
          nome: string
          preco_base: number | null
        }
        Insert: {
          descricao?: string | null
          duracao_estimada_horas?: number | null
          id?: number
          id_especialidade?: number | null
          nome: string
          preco_base?: number | null
        }
        Update: {
          descricao?: string | null
          duracao_estimada_horas?: number | null
          id?: number
          id_especialidade?: number | null
          nome?: string
          preco_base?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tipos_servico_id_especialidade_fkey"
            columns: ["id_especialidade"]
            isOneToOne: false
            referencedRelation: "especialidades"
            referencedColumns: ["id"]
          },
        ]
      }
      trabalho_ferramenta: {
        Row: {
          data_devolucao: string | null
          data_levantamento: string | null
          id_ferramenta: number
          id_trabalho: number
        }
        Insert: {
          data_devolucao?: string | null
          data_levantamento?: string | null
          id_ferramenta: number
          id_trabalho: number
        }
        Update: {
          data_devolucao?: string | null
          data_levantamento?: string | null
          id_ferramenta?: number
          id_trabalho?: number
        }
        Relationships: [
          {
            foreignKeyName: "trabalho_ferramenta_id_ferramenta_fkey"
            columns: ["id_ferramenta"]
            isOneToOne: false
            referencedRelation: "ferramentas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trabalho_ferramenta_id_trabalho_fkey"
            columns: ["id_trabalho"]
            isOneToOne: false
            referencedRelation: "trabalhos"
            referencedColumns: ["id"]
          },
        ]
      }
      trabalho_funcionario: {
        Row: {
          id_funcionario: string
          id_trabalho: number
          papel: Database["public"]["Enums"]["papel_trabalho_enum"]
        }
        Insert: {
          id_funcionario: string
          id_trabalho: number
          papel?: Database["public"]["Enums"]["papel_trabalho_enum"]
        }
        Update: {
          id_funcionario?: string
          id_trabalho?: number
          papel?: Database["public"]["Enums"]["papel_trabalho_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "trabalho_funcionario_id_funcionario_fkey"
            columns: ["id_funcionario"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trabalho_funcionario_id_trabalho_fkey"
            columns: ["id_trabalho"]
            isOneToOne: false
            referencedRelation: "trabalhos"
            referencedColumns: ["id"]
          },
        ]
      }
      trabalho_material: {
        Row: {
          id_material: number
          id_trabalho: number
          quantidade_usada: number
        }
        Insert: {
          id_material: number
          id_trabalho: number
          quantidade_usada: number
        }
        Update: {
          id_material?: number
          id_trabalho?: number
          quantidade_usada?: number
        }
        Relationships: [
          {
            foreignKeyName: "trabalho_material_id_material_fkey"
            columns: ["id_material"]
            isOneToOne: false
            referencedRelation: "materiais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trabalho_material_id_trabalho_fkey"
            columns: ["id_trabalho"]
            isOneToOne: false
            referencedRelation: "trabalhos"
            referencedColumns: ["id"]
          },
        ]
      }
      trabalho_viatura: {
        Row: {
          data_uso: string | null
          id_trabalho: number
          id_viatura: number
          km_fim: number | null
          km_inicio: number | null
        }
        Insert: {
          data_uso?: string | null
          id_trabalho: number
          id_viatura: number
          km_fim?: number | null
          km_inicio?: number | null
        }
        Update: {
          data_uso?: string | null
          id_trabalho?: number
          id_viatura?: number
          km_fim?: number | null
          km_inicio?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "trabalho_viatura_id_trabalho_fkey"
            columns: ["id_trabalho"]
            isOneToOne: false
            referencedRelation: "trabalhos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trabalho_viatura_id_viatura_fkey"
            columns: ["id_viatura"]
            isOneToOne: false
            referencedRelation: "viaturas"
            referencedColumns: ["id"]
          },
        ]
      }
      trabalhos: {
        Row: {
          data_fim_prevista: string | null
          data_fim_real: string | null
          data_inicio_prevista: string | null
          data_inicio_real: string | null
          estado: Database["public"]["Enums"]["estado_trabalho_enum"]
          id: number
          id_funcionario_responsavel: string | null
          id_pedido: number
          notas_internas: string | null
        }
        Insert: {
          data_fim_prevista?: string | null
          data_fim_real?: string | null
          data_inicio_prevista?: string | null
          data_inicio_real?: string | null
          estado?: Database["public"]["Enums"]["estado_trabalho_enum"]
          id?: number
          id_funcionario_responsavel?: string | null
          id_pedido: number
          notas_internas?: string | null
        }
        Update: {
          data_fim_prevista?: string | null
          data_fim_real?: string | null
          data_inicio_prevista?: string | null
          data_inicio_real?: string | null
          estado?: Database["public"]["Enums"]["estado_trabalho_enum"]
          id?: number
          id_funcionario_responsavel?: string | null
          id_pedido?: number
          notas_internas?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trabalhos_id_funcionario_responsavel_fkey"
            columns: ["id_funcionario_responsavel"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trabalhos_id_pedido_fkey"
            columns: ["id_pedido"]
            isOneToOne: true
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      utilizadores: {
        Row: {
          codigo_postal: string | null
          criado_por: string | null
          data_registo: string
          data_ultimo_login: string | null
          email: string
          estado: Database["public"]["Enums"]["estado_utilizador_enum"]
          foto_url: string | null
          id: string
          localidade: string | null
          morada: string | null
          nome: string
          telefone: string | null
          tipo_utilizador: Database["public"]["Enums"]["tipo_utilizador_enum"]
        }
        Insert: {
          codigo_postal?: string | null
          criado_por?: string | null
          data_registo?: string
          data_ultimo_login?: string | null
          email: string
          estado?: Database["public"]["Enums"]["estado_utilizador_enum"]
          foto_url?: string | null
          id: string
          localidade?: string | null
          morada?: string | null
          nome: string
          telefone?: string | null
          tipo_utilizador: Database["public"]["Enums"]["tipo_utilizador_enum"]
        }
        Update: {
          codigo_postal?: string | null
          criado_por?: string | null
          data_registo?: string
          data_ultimo_login?: string | null
          email?: string
          estado?: Database["public"]["Enums"]["estado_utilizador_enum"]
          foto_url?: string | null
          id?: string
          localidade?: string | null
          morada?: string | null
          nome?: string
          telefone?: string | null
          tipo_utilizador?: Database["public"]["Enums"]["tipo_utilizador_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "utilizadores_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "utilizadores"
            referencedColumns: ["id"]
          },
        ]
      }
      viaturas: {
        Row: {
          ano: number | null
          estado: Database["public"]["Enums"]["estado_viatura_enum"]
          id: number
          id_funcionario_responsavel: string | null
          marca: string | null
          matricula: string
          modelo: string | null
          quilometragem: number | null
        }
        Insert: {
          ano?: number | null
          estado?: Database["public"]["Enums"]["estado_viatura_enum"]
          id?: number
          id_funcionario_responsavel?: string | null
          marca?: string | null
          matricula: string
          modelo?: string | null
          quilometragem?: number | null
        }
        Update: {
          ano?: number | null
          estado?: Database["public"]["Enums"]["estado_viatura_enum"]
          id?: number
          id_funcionario_responsavel?: string | null
          marca?: string | null
          matricula?: string
          modelo?: string | null
          quilometragem?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "viaturas_id_funcionario_responsavel_fkey"
            columns: ["id_funcionario_responsavel"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      meu_tipo: {
        Args: never
        Returns: Database["public"]["Enums"]["tipo_utilizador_enum"]
      }
      pedido_do_trabalho: { Args: { t_id: number }; Returns: number }
      pedido_e_meu: { Args: { p_id: number }; Returns: boolean }
      sou_admin: { Args: never; Returns: boolean }
      sou_funcionario: { Args: never; Returns: boolean }
      sou_staff: { Args: never; Returns: boolean }
      trabalho_do_pedido: { Args: { p_id: number }; Returns: number }
    }
    Enums: {
      estado_agenda_enum: "agendado" | "em_curso" | "concluido" | "remarcado"
      estado_ferramenta_enum:
        | "disponivel"
        | "em_uso"
        | "manutencao"
        | "avariada"
      estado_pagamento_enum: "pendente" | "pago" | "parcial"
      estado_pedido_enum:
        | "pendente"
        | "aprovado"
        | "em_curso"
        | "concluido"
        | "cancelado"
      estado_trabalho_enum: "planeado" | "em_curso" | "concluido" | "cancelado"
      estado_utilizador_enum: "ativo" | "inativo"
      estado_viatura_enum: "disponivel" | "em_uso" | "manutencao"
      metodo_pagamento_enum:
        | "mbway"
        | "transferencia"
        | "multibanco"
        | "numerario"
      nivel_acesso_enum: "admin" | "superadmin"
      nivel_experiencia_enum: "iniciante" | "intermedio" | "avancado"
      papel_trabalho_enum: "responsavel" | "apoio"
      prioridade_enum: "baixa" | "normal" | "alta" | "urgente"
      tipo_anexo_enum: "foto_antes" | "foto_depois" | "documento"
      tipo_cliente_enum: "particular" | "empresa"
      tipo_utilizador_enum: "cliente" | "funcionario" | "administrador"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      estado_agenda_enum: ["agendado", "em_curso", "concluido", "remarcado"],
      estado_ferramenta_enum: [
        "disponivel",
        "em_uso",
        "manutencao",
        "avariada",
      ],
      estado_pagamento_enum: ["pendente", "pago", "parcial"],
      estado_pedido_enum: [
        "pendente",
        "aprovado",
        "em_curso",
        "concluido",
        "cancelado",
      ],
      estado_trabalho_enum: ["planeado", "em_curso", "concluido", "cancelado"],
      estado_utilizador_enum: ["ativo", "inativo"],
      estado_viatura_enum: ["disponivel", "em_uso", "manutencao"],
      metodo_pagamento_enum: [
        "mbway",
        "transferencia",
        "multibanco",
        "numerario",
      ],
      nivel_acesso_enum: ["admin", "superadmin"],
      nivel_experiencia_enum: ["iniciante", "intermedio", "avancado"],
      papel_trabalho_enum: ["responsavel", "apoio"],
      prioridade_enum: ["baixa", "normal", "alta", "urgente"],
      tipo_anexo_enum: ["foto_antes", "foto_depois", "documento"],
      tipo_cliente_enum: ["particular", "empresa"],
      tipo_utilizador_enum: ["cliente", "funcionario", "administrador"],
    },
  },
} as const
