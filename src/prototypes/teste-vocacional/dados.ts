/* =====================================================================
   Dados fictícios do protótipo (persona “Aluno Geniex”, 3º ano do EM)
   ===================================================================== */
import { itensDo, type Dim, type Respostas } from './instrumento'

export const DIA = 86_400_000
/** “agora” fixo do protótipo: 9 de novembro de 2026, 10h */
export const HOJE = new Date(2026, 10, 9, 10, 0).getTime()

/** respostas do Bloco A por dimensão (na ordem R01…R05, I01…I05 etc.) */
/** somas que reproduzem o perfil das telas de referência: I 90 · A 75 · E 70 · R 65 · C 60 · S 50 */
const PERSONA_A: Record<Dim, number[]> = {
  R: [4, 4, 3, 4, 3],
  I: [5, 5, 4, 5, 4],
  A: [4, 5, 3, 4, 4],
  S: [3, 3, 3, 3, 3],
  E: [4, 4, 3, 4, 4],
  C: [4, 3, 3, 4, 3],
}

export function respostasPersona(): Respostas {
  const r: Respostas = {}
  for (const i of itensDo('A')) if (i.bloco === 'A') r[i.id] = PERSONA_A[i.dim][Number(i.id.slice(1)) - 1]
  Object.assign(r, { V01: 3, V02: 3, V03: 4, V04: 5, V05: 2, V06: 4, V07: 2, V08: 2 })
  Object.assign(r, { P01: 'a', P02: 'b', P03: 'b', P04: 'b', P05: 'a', P06: 'b' })
  Object.assign(r, { H01: 5, H02: 3, H03: 4, H04: 3, H05: 3, H06: 4, H07: 2, H08: 4, 'H-DEV': ['H07', 'H04', 'H02'] })
  return r
}

/** respostas parciais (estudante parou no meio do Bloco A) */
export function respostasParciais(n: number): Respostas {
  const completas = respostasPersona()
  const ordem = itensDo('A').map((i) => i.id)
  return Object.fromEntries(ordem.slice(0, n).map((id) => [id, completas[id]]))
}

/** tentativa de abril, feita no estudo cognitivo com a versão anterior do instrumento */
const PASSADA_A: Record<Dim, number[]> = {
  R: [2, 2, 3, 2, 2],
  I: [4, 3, 4, 4, 3],
  A: [5, 4, 4, 5, 4],
  S: [3, 3, 4, 3, 3],
  E: [4, 4, 3, 4, 4],
  C: [2, 3, 2, 2, 3],
}
export function respostasPassadas(): Respostas {
  const r: Respostas = {}
  for (const i of itensDo('A')) if (i.bloco === 'A') r[i.id] = PASSADA_A[i.dim][Number(i.id.slice(1)) - 1]
  Object.assign(r, { V01: 4, V02: 5, V03: 4, V04: 4, V05: 5, V06: 4, V07: 4, V08: 5 })
  Object.assign(r, { P01: 'a', P02: 'b', P03: 'b', P04: 'b', P05: 'b', P06: 'b' })
  Object.assign(r, { H01: 3, H02: 4, H03: 4, H04: 2, H05: 4, H06: 3, H07: 4, H08: 3, 'H-DEV': ['H01', 'H04'] })
  return r
}
