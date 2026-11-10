// Regras das Batalhas (as mesmas do navegável de referência do Figma Make).
import { ALUNOS, DISC, Q_SOLO, Q_VS, SOLO_DISC, type Aluno, type DiscId, type Questao, type Selecao } from './data'

export const TOTAL = 10
export const TEMPO_SOLO = 45 // segundos por questão
export const TEMPO_VS = 600 // segundos por rodada
export const PRAZO_VS = 24 * 60 * 60 * 1000 // o oponente tem 24 h
export const MAX_DISC = 3
export const MINHA_TURMA = '8º ano A'

export const nomeDisc = (id: DiscId, curto = false) => (curto && DISC[id].curto) || DISC[id].nome
export const aluno = (id: string) => ALUNOS.find((a) => a.id === id) as Aluno
export const primeiroNome = (a: Aluno) => a.nome.split(' ')[0]

function embaralhar<T>(xs: T[]): T[] {
  const t = [...xs]
  for (let i = t.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[t[i], t[j]] = [t[j], t[i]]
  }
  return t
}

/* ---------------------------------------------------------------- Solo */
export type BatalhaSolo = { id: string; data: string; selecoes: Selecao[]; questoes: Questao[]; respostas: (number | null)[] }
export type Desfecho = 'win' | 'tie' | 'loss'

/** Alterna as disciplinas escolhidas até 10 questões; com menos questões, completa com outras áreas da série. */
export function sortearSolo(sel: Selecao[]): Questao[] {
  const pools = sel.map((s) => embaralhar(Q_SOLO.filter((q) => q.disciplina === s.disciplina)))
  const out: Questao[] = []
  for (let r = 0; out.length < TOTAL && pools.some((p) => p.length > r); r++) for (const p of pools) if (out.length < TOTAL && p[r]) out.push(p[r])
  if (out.length < TOTAL) {
    const usadas = new Set(sel.map((s) => s.disciplina))
    out.push(...embaralhar(Q_SOLO.filter((q) => !usadas.has(q.disciplina))).slice(0, TOTAL - out.length))
  }
  return out
}
export const acertos = (qs: Questao[], rs: (number | null)[]) => qs.reduce((n, q, i) => n + (rs[i] === q.correta ? 1 : 0), 0)
export const desfechoSolo = (n: number): Desfecho => (n >= 7 ? 'win' : n >= 5 ? 'tie' : 'loss')
export function porTopico(b: { selecoes: Selecao[]; questoes: Questao[]; respostas: (number | null)[] }) {
  const ordem: DiscId[] = []
  const m = new Map<DiscId, { total: number; certas: number }>()
  b.questoes.forEach((q, i) => {
    if (!m.has(q.disciplina)) {
      ordem.push(q.disciplina)
      m.set(q.disciplina, { total: 0, certas: 0 })
    }
    const v = m.get(q.disciplina)!
    v.total++
    if (b.respostas[i] === q.correta) v.certas++
  })
  return ordem.map((d) => ({ disciplina: d, topico: b.selecoes.find((s) => s.disciplina === d)?.topico ?? 'Conteúdos da sua série', ...m.get(d)! }))
}

/** Uma batalha Solo já respondida, para o histórico e para os atalhos do protótipo. */
export function soloPronta(sel: Selecao[], certas: number, quando: Date): BatalhaSolo {
  const qs = sortearSolo(sel)
  const ok = new Set(embaralhar(qs.map((_, i) => i)).slice(0, certas))
  return { id: 'solo-' + quando.getTime(), data: quando.toISOString(), selecoes: sel, questoes: qs, respostas: qs.map((q, i) => (ok.has(i) ? q.correta : (q.correta + 1) % 4)) }
}
export const SEL_PADRAO: Selecao[] = [
  { disciplina: 'artes', topico: 'Movimentos artísticos contemporâneos' },
  { disciplina: 'historia', topico: 'República no Brasil (1889 - 1930)' },
  { disciplina: 'matematica', topico: 'Funções do 1º grau' },
]
export const topicosSolo = (id: DiscId) => SOLO_DISC.find((d) => d.id === id)?.topicos ?? []

/* ---------------------------------------------------------------- VS */
export type Origem = 'enviado' | 'recebido'
export type BatalhaVS = { id: string; oponente: string; origem: Origem; criadaEm: string; selecoes: Selecao[]; questoes: Questao[]; respostas: (number | null)[] | null; finalizadaEm: string | null; placarOponente: number | null }
export type SituacaoVS = 'andamento' | 'aguardando' | 'finalizada' | 'expirada'
export type DesfechoVS = Desfecho | 'wo'

function bancoVS(d: DiscId): Questao[] {
  if (d === 'ciencias') return [...Q_VS.filter((q) => q.disciplina === 'ciencias'), ...Q_SOLO.filter((q) => q.disciplina === 'biologia').map((q) => ({ ...q, id: 'c-' + q.id, disciplina: 'ciencias' as DiscId }))]
  return [...Q_SOLO.filter((q) => q.disciplina === d), ...Q_VS.filter((q) => q.disciplina === d)]
}
/** 10 questões com pelo menos 3 de cada tópico, em ordem e quantidade aleatórias. */
export function sortearVS(sel: Selecao[]): Questao[] {
  const n = sel.length
  let cotas: number[]
  if (n === 1) cotas = [10]
  else if (n === 2) {
    const a = 3 + Math.floor(Math.random() * 5)
    cotas = [a, 10 - a]
  } else cotas = embaralhar([4, 3, 3])
  return embaralhar(sel.flatMap((s, i) => embaralhar(bancoVS(s.disciplina)).slice(0, cotas[i])))
}
export const placarVS = (b: BatalhaVS) => (b.respostas ? acertos(b.questoes, b.respostas) : 0)
export function situacao(b: BatalhaVS, agora = Date.now()): SituacaoVS {
  if (!b.respostas) return 'andamento'
  if (b.placarOponente === null) return agora - new Date(b.finalizadaEm!).getTime() > PRAZO_VS ? 'expirada' : 'aguardando'
  return 'finalizada'
}
export function desfechoVS(b: BatalhaVS): DesfechoVS | null {
  const s = situacao(b)
  if (s === 'expirada') return 'wo'
  if (s !== 'finalizada') return null
  const eu = placarVS(b)
  const op = b.placarOponente!
  return eu > op ? 'win' : eu < op ? 'loss' : 'tie'
}
export const prazoFinal = (b: BatalhaVS) => new Date(new Date(b.finalizadaEm ?? b.criadaEm).getTime() + PRAZO_VS)

export function novaVS(oponente: string, sel: Selecao[], origem: Origem = 'enviado'): BatalhaVS {
  return { id: `vs-${Date.now()}-${Math.floor(Math.random() * 1000)}`, oponente, origem, criadaEm: new Date().toISOString(), selecoes: sel, questoes: sortearVS(sel), respostas: null, finalizadaEm: null, placarOponente: null }
}
/** As 8 batalhas de exemplo de “Minhas batalhas” (todas as situações possíveis). */
export function batalhasIniciais(): BatalhaVS[] {
  const H = 3600 * 1000
  const D = 24 * H
  const agora = Date.now()
  const s = (d: DiscId, t: string): Selecao => ({ disciplina: d, topico: t })
  const mk = (op: string, sel: Selecao[], o: { origem?: Origem; atras: number; jogou?: boolean; eu?: number; ele?: number | null }) => {
    const b = novaVS(op, sel, o.origem ?? 'enviado')
    b.id = 'seed-' + op
    b.criadaEm = new Date(agora - o.atras).toISOString()
    if (o.jogou !== false) {
      const ok = new Set(embaralhar(b.questoes.map((_, i) => i)).slice(0, o.eu ?? 0))
      b.respostas = b.questoes.map((q, i) => (ok.has(i) ? q.correta : (q.correta + 1) % 4))
      b.finalizadaEm = new Date(agora - o.atras + 9 * 60 * 1000).toISOString()
    }
    b.placarOponente = o.ele ?? null
    return b
  }
  return [
    mk('daniel', [s('historia', 'Brasil Colônia'), s('ciencias', 'Corpo humano'), s('portugues', 'Figuras de linguagem')], { origem: 'recebido', atras: 2 * H, ele: 7, jogou: false }),
    mk('bruno', [s('matematica', 'Funções do 1º grau'), s('geografia', 'Formações do relevo'), s('ciencias', 'Sistema Solar')], { atras: 3 * H, eu: 8 }),
    mk('eduarda', [s('artes', 'Movimentos artísticos'), s('ingles', 'Simple past')], { origem: 'recebido', atras: 7 * H, ele: 6, jogou: false }),
    mk('ana', [s('portugues', 'Produção textual'), s('historia', 'Revolução Francesa'), s('geografia', 'Clima e vegetação')], { atras: 4 * D, eu: 9, ele: 6 }),
    mk('gabriel', [s('ciencias', 'Sistema Solar'), s('geografia', 'Biomas do Brasil'), s('historia', 'Brasil Colônia')], { atras: 9 * H, eu: 7 }),
    mk('lucasa', [s('matematica', 'Equações e inequações'), s('ciencias', 'Corpo humano'), s('ingles', 'Vocabulary')], { atras: 11 * D, eu: 10, ele: 7 }),
    mk('marina', [s('matematica', 'Geometria plana'), s('portugues', 'Interpretação de texto'), s('artes', 'Movimentos artísticos')], { atras: 18 * D, eu: 6, ele: 8 }),
    mk('beatriz', [s('ingles', 'Simple present'), s('matematica', 'Probabilidade e estatística'), s('ciencias', 'Ecossistemas')], { atras: 31 * D, eu: 9 }),
  ]
}

/* ---------------------------------------------------------------- formatos */
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
const dd = (n: number) => String(n).padStart(2, '0')
export const dataCurta = (iso: string) => {
  const d = new Date(iso)
  return `${dd(d.getDate())} ${MESES[d.getMonth()]}. ${d.getFullYear()}`
}
export const hora = (iso: string | Date) => {
  const d = new Date(iso)
  return `${dd(d.getHours())}:${dd(d.getMinutes())}`
}
export const dataLonga = (iso: string | Date) => {
  const d = new Date(iso)
  return `${dd(d.getDate())} de ${MESES[d.getMonth()]} de ${d.getFullYear()} às ${hora(d)}`
}
export const relogio = (s: number) => `${dd(Math.floor(Math.max(s, 0) / 60))}:${dd(Math.max(s, 0) % 60)}`
