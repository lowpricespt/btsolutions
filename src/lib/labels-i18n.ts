import type { BadgeTom } from "@/lib/labels"

type EnumMap = Record<string, { label: string; tom: BadgeTom }>

// Reconstrói um EnumMap de labels.ts (admin/equipa, só PT) trocando cada
// label pelo texto traduzido — mantém as mesmas chaves e cores ("tom"),
// só usado nas páginas de cliente (admin/equipa continuam em PT direto).
export function traduzEnum(t: (chave: string) => string, prefixo: string, mapa: EnumMap): EnumMap {
  const resultado: EnumMap = {}
  for (const chave in mapa) {
    resultado[chave] = { label: t(`${prefixo}.${chave}`), tom: mapa[chave].tom }
  }
  return resultado
}
