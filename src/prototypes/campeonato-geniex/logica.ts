// Regras do Campeonato (PRD v1.0): Batalha VS de 10 questões e 10 minutos, prazo de 24 h, W.O. e ranking por 4 critérios.
import { ALUNOS, EU, embaralhar, questoesDoTopico, type Aluno, type DiscId, type Questao, type Selecao } from './data'

export const TOTAL = 10
export const TEMPO = 600 // 10 minutos por participante (RN07)
export const PRAZO = 24 * 3600 * 1000 // 24 h para o oponente (RN09)
const H = 3600 * 1000

/** Cotas por tópico: 1 tópico = 10; 2 tópicos = 3 a 7 cada; 3 tópicos = 4/3/3 em ordem aleatória (RN06). */
export function sortear(sel: Selecao[]): Questao[] {
  const n = sel.length
  const cotas = n === 1 ? [10] : n === 2 ? (() => { const a = 3 + Math.floor(Math.random() * 5); return [a, 10 - a] })() : embaralhar([4, 3, 3])
  return embaralhar(sel.flatMap((s, i) => questoesDoTopico(s, cotas[i])))
}

export type Origem = 'enviada' | 'recebida'
export type Batalha = {
  id: string
  oponente: string
  origem: Origem
  criadaEm: number
  selecoes: Selecao[]
  questoes: Questao[]
  /** respostas da estudante logada (null = ainda não jogou) */
  minhas: (number | null)[] | null
  /** segundos gastos em cada questão */
  tempos: number[]
  /** acertos do oponente (null = ainda não respondeu) */
  placarOp: number | null
  fim?: 'wo' | 'sem-vencedor'
}
export type Situacao = 'sua-vez' | 'aguardando' | 'vitoria' | 'empate' | 'derrota' | 'wo' | 'sem-vencedor'

export const acertos = (b: Batalha) => (b.minhas ? b.questoes.reduce((n, q, i) => n + (b.minhas![i] === q.correta ? 1 : 0), 0) : 0)
export function situacao(b: Batalha): Situacao {
  if (!b.minhas) return 'sua-vez'
  if (b.fim) return b.fim
  if (b.placarOp === null) return 'aguardando'
  const eu = acertos(b)
  return eu > b.placarOp ? 'vitoria' : eu < b.placarOp ? 'derrota' : 'empate' // o tempo não desempata (RN03)
}
export const finalizada = (s: Situacao) => s === 'vitoria' || s === 'empate' || s === 'derrota' || s === 'wo'
/** Prazo que falta (ms) para a resposta pendente. */
export const restante = (b: Batalha, agora = Date.now()) => Math.max(0, b.criadaEm + PRAZO - agora)
export const tempoMedioAcertos = (b: Batalha) => { const t = b.questoes.map((q, i) => (b.minhas?.[i] === q.correta ? b.tempos[i] : null)).filter((x): x is number => x !== null); return t.length ? t.reduce((a, c) => a + c, 0) / t.length : 0 }

/** Batalha já respondida pela estudante com um número exato de acertos. */
function pronta(id: string, op: string, origem: Origem, horasAtras: number, sel: Selecao[], meus: number, placarOp: number | null, fim?: Batalha['fim']): Batalha {
  const qs = sortear(sel)
  const ok = new Set(embaralhar(qs.map((_, i) => i)).slice(0, meus))
  return { id, oponente: op, origem, criadaEm: Date.now() - horasAtras * H, selecoes: sel, questoes: qs, minhas: qs.map((q, i) => (ok.has(i) ? q.correta : (q.correta + 1) % 5)), tempos: qs.map(() => 23), placarOp, fim }
}
const s = (d: DiscId, t: string): Selecao => ({ disciplina: d, topico: t })
/** As 18 batalhas da Mariana (2 sua vez, 2 aguardando, 9 vitórias, 2 empates, 3 derrotas): 81 acertos e 23 s, como no Figma. */
export function batalhasIniciais(): Batalha[] {
  const recebida = (id: string, op: string, h: number, sel: Selecao[], placarOp: number): Batalha => ({ id, oponente: op, origem: 'recebida', criadaEm: Date.now() - h * H, selecoes: sel, questoes: sortear(sel), minhas: null, tempos: [], placarOp })
  return [
    recebida('b-bruno', 'bruno', 5.3, [s('matematica', 'Funções do 2º grau'), s('fisica', 'Leis de Newton')], 7),
    recebida('b-isabela', 'isabela', 13.9, [s('fisica', 'Cinemática')], 6),
    pronta('b-carla', 'carla', 'enviada', 2.92, [s('quimica', 'Estequiometria')], 8, null),
    pronta('b-lucas', 'lucas', 'enviada', 17.8, [s('matematica', 'Progressões'), s('fisica', 'Energia e trabalho'), s('quimica', 'Tabela periódica')], 7, null),
    pronta('b-gabriel', 'gabriel', 'enviada', 2.1, [s('matematica', 'Funções do 1º grau')], 8, 6),
    pronta('b-ana', 'ana', 'recebida', 20, [s('fisica', 'Leis de Newton'), s('quimica', 'Ligações químicas')], 6, 9),
    pronta('b-rafaela', 'rafaela', 'enviada', 38, [s('matematica', 'Estatística básica'), s('quimica', 'Modelos atômicos')], 7, 7),
    pronta('b-daniel', 'daniel', 'enviada', 62, [s('fisica', 'Cinemática')], 7, null, 'wo'),
    pronta('b-juliana', 'juliana', 'recebida', 70, [s('matematica', 'Funções do 2º grau'), s('quimica', 'Estequiometria')], 6, 4),
    pronta('b-isa2', 'isabela', 'enviada', 86, [s('fisica', 'Energia e trabalho')], 5, 3),
    pronta('b-pedro', 'pedro', 'recebida', 98, [s('quimica', 'Ligações químicas')], 6, 5),
    pronta('b-joao', 'joao', 'enviada', 120, [s('matematica', 'Progressões'), s('fisica', 'Cinemática')], 5, 4),
    pronta('b-lucas2', 'lucas', 'recebida', 150, [s('fisica', 'Leis de Newton')], 5, 4),
    pronta('b-felipe', 'felipe', 'enviada', 170, [s('quimica', 'Tabela periódica')], 4, 2),
    pronta('b-beatriz', 'beatriz', 'enviada', 190, [s('matematica', 'Estatística básica')], 5, 3),
    pronta('b-carla2', 'carla', 'recebida', 210, [s('quimica', 'Modelos atômicos')], 4, 4),
    pronta('b-bruno2', 'bruno', 'enviada', 230, [s('matematica', 'Funções do 1º grau'), s('fisica', 'Leis de Newton')], 7, 8),
    pronta('b-lucas3', 'lucas', 'enviada', 260, [s('quimica', 'Estequiometria'), s('fisica', 'Cinemática')], 6, 7),
  ]
}
/** Batalha encerrada sem vencedor (iniciada a menos de 24 h do fim da Copa), usada no atalho correspondente. */
export const batalhaSemVencedor = () => pronta('b-pedro-fim', 'pedro', 'enviada', 6, [s('fisica', 'Leis de Newton')], 7, null, 'sem-vencedor')

/** Números da estudante na Copa: só batalhas com resultado válido contam (Feature 08). */
export function meusNumeros(bs: Batalha[]) {
  let vit = 0, emp = 0, der = 0, ac = 0, somaT = 0, nT = 0
  for (const b of bs) {
    const st = situacao(b)
    if (!finalizada(st)) continue
    if (st === 'vitoria' || st === 'wo') vit++
    if (st === 'empate') emp++
    if (st === 'derrota') der++
    const a = acertos(b)
    ac += a
    somaT += tempoMedioAcertos(b) * a
    nT += a
  }
  return { vit, emp, der, acertos: ac, tempo: nT ? Math.round(somaT / nT) : 0, batalhas: vit + emp + der }
}
export type Linha = Aluno & { pos: number }
/** Ranking (Feature 10): vitórias ↓, acertos ↓, tempo médio ↑, nome A–Z. */
export function ranking(bs: Batalha[]): Linha[] {
  const m = meusNumeros(bs)
  const todos = ALUNOS.map((a) => (a.id === EU ? { ...a, vitorias: m.vit, acertos: m.acertos, tempo: m.tempo } : a))
  todos.sort((a, b) => b.vitorias - a.vitorias || b.acertos - a.acertos || a.tempo - b.tempo || a.nome.localeCompare(b.nome, 'pt-BR'))
  return todos.map((a, i) => ({ ...a, pos: i + 1 }))
}

/* ------------------------------------------------------------------ formatos */
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
const dd = (n: number) => String(n).padStart(2, '0')
export const quando = (ms: number) => { const d = new Date(ms); const hoje = new Date(); const ontem = new Date(Date.now() - 24 * H); const h = `${dd(d.getHours())}h${dd(d.getMinutes())}`; if (d.toDateString() === hoje.toDateString()) return 'Hoje, ' + h; if (d.toDateString() === ontem.toDateString()) return 'Ontem, ' + h; return `${dd(d.getDate())} ${MESES[d.getMonth()]}., ${h}` }
export const duracao = (ms: number) => { const m = Math.floor(ms / 60000); return `${Math.floor(m / 60)}h ${dd(m % 60)}min` }
export const relogio = (s: number) => `${dd(Math.floor(Math.max(s, 0) / 60))}:${dd(Math.max(s, 0) % 60)}`
export const minSeg = (s: number) => `${Math.floor(s / 60)}min ${dd(Math.round(s % 60))}s`
