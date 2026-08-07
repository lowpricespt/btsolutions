export const CODIGO_POSTAL_REGEX = /^\d{4}-\d{3}$/

// Algoritmo oficial do dígito de controlo do NIF português (módulo 11).
export function validarNIF(nif: string): boolean {
  const limpo = nif.replace(/\D/g, "")
  if (!/^\d{9}$/.test(limpo)) return false

  const digitos = limpo.split("").map(Number)
  const soma = digitos.slice(0, 8).reduce((acc, d, i) => acc + d * (9 - i), 0)
  const resto = soma % 11
  const digitoControlo = resto < 2 ? 0 : 11 - resto

  return digitoControlo === digitos[8]
}
