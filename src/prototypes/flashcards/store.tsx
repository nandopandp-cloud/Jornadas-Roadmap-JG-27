import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { DIA, DISC, HOJE, TOPICO } from './data'

/* =====================================================================
   Estado do protótipo Flashcards
   ===================================================================== */

export type Status = 'sei' | 'nao' | 'revisar'
export type Grupo = {
  id: string
  disc: string
  topicos: string[]
  cards: string[]
  status: Record<string, Status>
  /** índice (em `cards`) do card em estudo */
  atual: number
  favorito: boolean
  novo?: boolean
  criadoEm: number
  estudadoEm?: number
}
export type Sessao = { id: string; grupo: string; data: number; cards: number; sei: number; nao: number; revisar: number }
export type Aba = 'grupos' | 'favoritos' | 'historico'
export type AbaGrupo = 'estudar' | 'resumo' | 'desempenho'
export type Selecao = { discs: string[]; topicos: Record<string, string[]> }

export type View =
  | { id: 'inicio' }
  | { id: 'landing' }
  | { id: 'disciplinas' }
  | { id: 'topicos'; disc?: string }
  | { id: 'gerando' }
  | { id: 'home'; aba: Aba }
  | { id: 'grupo'; grupo: string; aba?: AbaGrupo; card?: string; revelar?: boolean }
  | { id: 'concluida'; grupo: string }

export type Toast = { id: number; texto: string; tipo: 'ok' | 'info' | 'erro'; acao?: { rotulo: string; fn: () => void } }

type State = {
  view: View
  dir: 1 | -1
  sidebarFechada: boolean
  grupos: Grupo[]
  /** cardId → quando foi favoritado */
  favoritos: Record<string, number>
  selecao: Selecao
  historico: Sessao[]
  /** grupos recém-gerados (destaque na home) */
  gerados: string[]
}

export type Inicio = 'inicio' | 'landing' | 'disciplinas' | 'topicos' | 'gerando' | 'grupos' | 'estudo' | 'resposta' | 'concluida' | 'favoritos' | 'historico'

/* ---------------- utilidades ---------------- */
export const cardsDe = (topicos: string[]) => topicos.flatMap((t) => TOPICO[t].cards.map((c) => c.id))
export const nomeGrupo = (g: Grupo) => DISC[g.disc].curso
export const respondidos = (g: Grupo) => g.cards.filter((c) => g.status[c]).length
export const pct = (n: number, total: number) => (total ? Math.round((n / total) * 100) : 0)
export const contagem = (g: Grupo) => {
  const v = Object.entries(g.status).filter(([c]) => g.cards.includes(c))
  return { sei: v.filter(([, s]) => s === 'sei').length, nao: v.filter(([, s]) => s === 'nao').length, revisar: v.filter(([, s]) => s === 'revisar').length }
}
export const ultimo = (g: Grupo) => Math.max(g.criadoEm, g.estudadoEm ?? 0)

const S = (x: string) => ({ s: 'sei', n: 'nao', r: 'revisar' })[x] as Status
/** monta um grupo com progresso a partir de uma “fita” de status (s/n/r) */
function grupo(id: string, disc: string, topicos: string[], fita: string, extra: Partial<Grupo> = {}): Grupo {
  const cards = cardsDe(topicos)
  const status: Record<string, Status> = {}
  ;[...fita].forEach((x, i) => x !== '.' && cards[i] && (status[cards[i]] = S(x)))
  const atual = cards.findIndex((c) => !status[c])
  return { id, disc, topicos, cards, status, atual: atual < 0 ? 0 : atual, favorito: false, criadoEm: HOJE - 20 * DIA, ...extra }
}

/** grupos que o estudante já tinha antes de criar Literatura e História */
const base = (): Grupo[] => [
  grupo('g-mat', 'matematica', ['funcoes', 'geometria', 'equacoes', 'estatistica'], 'sssnssrsssns', { criadoEm: HOJE - 6 * DIA, estudadoEm: HOJE - 1 * DIA }),
  grupo('g-bio', 'biologia', ['citologia', 'metabolismo', 'genetica'], 'sssssssns', { criadoEm: HOJE - 24 * DIA, estudadoEm: HOJE - 9 * DIA }),
  grupo('g-geo', 'geografia', ['biomas', 'clima'], 'ssrsss', { criadoEm: HOJE - 30 * DIA, estudadoEm: HOJE - 15 * DIA, favorito: true }),
  grupo('g-qui', 'quimica', ['ligacoes', 'tabela'], 'snssss', { criadoEm: HOJE - 34 * DIA, estudadoEm: HOJE - 21 * DIA }),
]
/** Literatura e História como nas referências (24 e 18 cards) */
const litHist = (concluido = false): Grupo[] => [
  grupo('g-lit', 'literatura', ['romantismo', 'modernismo', 'generos'], concluido ? 'sssrrrrsssssnsnsssssssss' : 'sssrssns', { criadoEm: HOJE - 2 * DIA, estudadoEm: HOJE - 60_000 }),
  grupo('g-hist', 'historia', ['republica', 'vargas'], 'sssns', { criadoEm: HOJE - 2 * DIA, estudadoEm: HOJE - 5 * 3_600_000 }),
]

const favBase: [string, number][] = [
  ['funcoes-1', 2],
  ['metabolismo-1', 40],
  ['biomas-1', 48],
  ['ligacoes-1', 70],
  ['clima-2', 100],
  ['tabela-1', 120],
]
/** 4 deles no grupo de Literatura (como na tela de sessão concluída) */
const favLitHist: [string, number][] = [
  ['romantismo-9', 0.5],
  ['republica-1', 3],
  ['modernismo-1', 4],
  ['romantismo-1', 5],
  ['romantismo-6', 60],
  ['vargas-2', 80],
]
const favs = (lista: [string, number][]) => Object.fromEntries(lista.map(([c, h]) => [c, HOJE - h * 3_600_000]))

const histBase: Sessao[] = [
  { id: 'h1', grupo: 'g-mat', data: HOJE - 1 * DIA - 2 * 3_600_000, cards: 12, sei: 9, nao: 2, revisar: 1 },
  { id: 'h2', grupo: 'g-bio', data: HOJE - 9 * DIA, cards: 9, sei: 8, nao: 1, revisar: 0 },
  { id: 'h3', grupo: 'g-geo', data: HOJE - 15 * DIA, cards: 6, sei: 5, nao: 0, revisar: 1 },
  { id: 'h4', grupo: 'g-qui', data: HOJE - 21 * DIA, cards: 6, sei: 5, nao: 1, revisar: 0 },
]
const histLitHist: Sessao[] = [
  { id: 'h5', grupo: 'g-lit', data: HOJE - 60_000, cards: 8, sei: 6, nao: 1, revisar: 1 },
  { id: 'h6', grupo: 'g-hist', data: HOJE - 5 * 3_600_000, cards: 5, sei: 4, nao: 1, revisar: 0 },
]

const SEL_REF: Selecao = { discs: ['literatura', 'historia'], topicos: { literatura: ['romantismo', 'modernismo', 'generos'], historia: ['republica', 'vargas'] } }

function inicial(start: Inicio): State {
  const completo = !['inicio', 'landing', 'disciplinas', 'topicos', 'gerando'].includes(start)
  const grupos = completo ? [...litHist(start === 'concluida'), ...base()] : base()
  const view: View =
    start === 'grupos' ? { id: 'home', aba: 'grupos' }
    : start === 'favoritos' ? { id: 'home', aba: 'favoritos' }
    : start === 'historico' ? { id: 'home', aba: 'historico' }
    : start === 'estudo' ? { id: 'grupo', grupo: 'g-lit' }
    : start === 'resposta' ? { id: 'grupo', grupo: 'g-lit', revelar: true }
    : start === 'concluida' ? { id: 'concluida', grupo: 'g-lit' }
    : start === 'topicos' ? { id: 'topicos', disc: 'literatura' }
    : { id: start }
  return {
    view,
    dir: 1,
    sidebarFechada: false,
    grupos,
    favoritos: favs(completo ? [...favLitHist, ...favBase] : favBase),
    selecao: ['disciplinas', 'topicos', 'gerando'].includes(start) ? SEL_REF : { discs: [], topicos: {} },
    historico: completo ? [...histLitHist, ...histBase] : histBase,
    gerados: [],
  }
}

/* ---------------- contexto ---------------- */
type Ctx = {
  s: State
  ir: (v: View, dir?: 1 | -1) => void
  up: (fn: (s: State) => State) => void
  setGrupo: (id: string, fn: (g: Grupo) => Grupo) => void
  setSelecao: (fn: (sel: Selecao) => Selecao) => void
  toggleSidebar: () => void
  favoritar: (cardId: string) => boolean
  gerar: () => string[]
  concluirSessao: (gid: string) => void
  reiniciar: (gid: string) => void
  toasts: Toast[]
  toast: (texto: string, tipo?: Toast['tipo'], acao?: Toast['acao']) => void
  fecharToast: (id: number) => void
}
const C = createContext<Ctx | null>(null)
export const useFx = () => useContext(C)!

export function FxProvider({ start, children }: { start: Inicio; children: ReactNode }) {
  const [s, setS] = useState<State>(() => inicial(start))
  const [toasts, setToasts] = useState<Toast[]>([])
  const seq = useRef(0)
  const ref = useRef(s)
  ref.current = s

  const fecharToast = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), [])
  const toast = useCallback(
    (texto: string, tipo: Toast['tipo'] = 'ok', acao?: Toast['acao']) => {
      const id = ++seq.current
      setToasts((t) => [...t.slice(-2), { id, texto, tipo, acao }])
      window.setTimeout(() => fecharToast(id), acao ? 6000 : 3600)
    },
    [fecharToast],
  )

  const api = useMemo<Omit<Ctx, 's' | 'toasts'>>(() => {
    const up = (fn: (s: State) => State) => setS(fn)
    const setGrupo = (id: string, fn: (g: Grupo) => Grupo) => up((x) => ({ ...x, grupos: x.grupos.map((g) => (g.id === id ? fn(g) : g)) }))
    return {
      up,
      setGrupo,
      ir: (view, dir = 1) => {
        up((x) => ({ ...x, view, dir }))
        document.querySelector('.fx-main')?.scrollTo({ top: 0 })
      },
      setSelecao: (fn) => up((x) => ({ ...x, selecao: fn(x.selecao) })),
      toggleSidebar: () => up((x) => ({ ...x, sidebarFechada: !x.sidebarFechada })),
      favoritar: (cardId) => {
        const tinha = !!ref.current.favoritos[cardId]
        up((x) => {
          const f = { ...x.favoritos }
          if (tinha) delete f[cardId]
          else f[cardId] = Date.now() > HOJE ? HOJE + (Date.now() % DIA) / 10 : Date.now()
          return { ...x, favoritos: f }
        })
        return !tinha
      },
      gerar: () => {
        const sel = ref.current.selecao
        const agora = HOJE + 60_000
        const novos: Grupo[] = sel.discs
          .filter((d) => sel.topicos[d]?.length)
          .map((d, i) => {
            const topicos = DISC[d].topicos.map((t) => t.id).filter((t) => sel.topicos[d].includes(t))
            return { id: `g-${d}-${Date.now().toString(36)}${i}`, disc: d, topicos, cards: cardsDe(topicos), status: {}, atual: 0, favorito: false, novo: true, criadoEm: agora + (sel.discs.length - i) }
          })
        up((x) => ({ ...x, grupos: [...novos, ...x.grupos.map((g) => ({ ...g, novo: false }))], gerados: novos.map((g) => g.id), selecao: { discs: [], topicos: {} } }))
        return novos.map((g) => g.id)
      },
      concluirSessao: (gid) =>
        up((x) => {
          const g = x.grupos.find((y) => y.id === gid)
          if (!g) return x
          const c = contagem(g)
          const sessao: Sessao = { id: `h${Date.now()}`, grupo: gid, data: HOJE + 120_000, cards: c.sei + c.nao + c.revisar, ...c }
          return { ...x, historico: [sessao, ...x.historico.filter((h) => !(h.grupo === gid && h.data >= HOJE - 3_600_000))] }
        }),
      reiniciar: (gid) => setGrupo(gid, (g) => ({ ...g, status: {}, atual: 0, estudadoEm: HOJE + 180_000 })),
      toast,
      fecharToast,
    }
  }, [toast, fecharToast])

  return <C.Provider value={{ s, toasts, ...api }}>{children}</C.Provider>
}

/* ---------------- datas ---------------- */
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
export function quando(t: number) {
  const d = new Date(t)
  const hoje = new Date(HOJE)
  const hh = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  const dias = Math.round((new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()).getTime() - new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()) / DIA)
  if (dias <= 0) return `Hoje, ${hh}`
  if (dias === 1) return `Ontem, ${hh}`
  return `${d.getDate()} de ${MESES[d.getMonth()]}, ${hh}`
}
