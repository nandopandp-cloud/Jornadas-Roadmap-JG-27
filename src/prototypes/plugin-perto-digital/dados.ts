// Dados fictícios do protótipo (Prepara SP · estudante do Ensino Médio).

export const ESTUDANTE = {
  nome: 'Rafael Oliveira dos Santos',
  usuario: '@jovensgenios.com',
  avatar: './ppsp/avatar.png',
}

export type Atividade = { tipo: string; titulo: string; cor: 'verde' | 'azul' }

/** atividades do cronograma por dia de novembro de 2026 */
const BASE: Atividade[] = [
  { tipo: 'Tarefa', titulo: 'Trilha Provão Paulista - LP (09 a 13/11)', cor: 'verde' },
  { tipo: 'Química', titulo: 'Distribuição Eletrônica', cor: 'azul' },
  { tipo: 'Sociologia', titulo: 'Ciência x senso comum', cor: 'azul' },
  { tipo: 'Matemática', titulo: 'Triângulo de Pascal', cor: 'azul' },
  { tipo: 'Biologia', titulo: 'Introdução à Genética', cor: 'azul' },
  { tipo: 'Física', titulo: 'Método científico e fenômenos físicos', cor: 'azul' },
  { tipo: 'Português', titulo: 'Coesão e coerência textual', cor: 'azul' },
  { tipo: 'História', titulo: 'Revolução Industrial', cor: 'azul' },
  { tipo: 'Geografia', titulo: 'Urbanização brasileira', cor: 'azul' },
]

const EXTRA: Atividade[] = [
  { tipo: 'Inglês', titulo: 'Simple past x present perfect', cor: 'azul' },
  { tipo: 'Filosofia', titulo: 'O mito da caverna', cor: 'azul' },
  { tipo: 'Química', titulo: 'Ligações químicas', cor: 'azul' },
  { tipo: 'Matemática', titulo: 'Função afim', cor: 'azul' },
  { tipo: 'Artes', titulo: 'Arte moderna no Brasil', cor: 'azul' },
]

export function atividadesDoDia(dia: number): Atividade[] {
  if (dia === 11) return BASE
  const dow = new Date(2026, 10, dia).getDay()
  if (dow === 0 || dow === 6) return []
  const n = 3 + ((dia * 7) % 4)
  const lista = [...BASE.slice(1), ...EXTRA]
  const out: Atividade[] = []
  for (let i = 0; i < n; i++) out.push(lista[(dia * 3 + i * 5) % lista.length])
  return dia >= 9 && dia <= 13 ? [BASE[0], ...out] : out
}

export const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
export const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
export const HOJE = new Date(2026, 10, 11)
