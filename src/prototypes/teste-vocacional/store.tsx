import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { DIA, HOJE, respostasParciais, respostasPassadas, respostasPersona } from './dados'
import { ITENS, VERSAO_INSTRUMENTO, type Resposta, type Respostas } from './instrumento'
import { acoesSugeridas, gerarResultado, type Resultado } from './motor'
import { CARREIRA } from './carreiras'

/* =====================================================================
   Estado do protótipo Teste Vocacional (dados só no navegador)
   ===================================================================== */

export type Tentativa = {
  id: string
  inicio: number
  fim?: number
  versao: string
  status: 'andamento' | 'concluida'
  respostas: Respostas
  /** índice (em ITENS) da pergunta em que o estudante está */
  pos: number
  /** undefined = ainda não perguntado · null = preferiu pular */
  clarezaPre?: number | null
  clarezaPos?: { valor: number; descobriu: 'sim' | 'nao' | 'talvez' | null; relevancia: number | null; em: number }
  resultado?: Resultado
}
export type Etapa = 'conhecer' | 'investigando' | 'conheci'
export type Favorito = { id: string; em: number; etapa: Etapa }
export type Acao = { id: string; texto: string; carreira?: string; tipo: string; feita: boolean; criadaEm: number; feitaEm?: number }
export type Evento = { id: number; nome: string; props: Record<string, string | number>; t: number }

/** abas do resultado (Frames 7, 8, 9, 11, 12, 13 e 14) */
export type AbaRel = 'visao' | 'areas' | 'profissoes' | 'valores' | 'preferencias' | 'habilidades' | 'passos'
/** abas da página da profissão (Frame 10) */
export type AbaProf = 'visao' | 'dia' | 'onde' | 'formacao' | 'habilidades' | 'mercado' | 'conteudos'

export type View =
  | { id: 'inicio' }
  | { id: 'entrada'; clareza?: boolean }
  | { id: 'questionario' }
  | { id: 'revisao' }
  | { id: 'processando' }
  | { id: 'relatorio'; aba?: AbaRel; tentativa?: string; clarezaPos?: boolean; sel?: string }
  | { id: 'carreira'; carreira: string; de?: 'relatorio' | 'explorar' | 'minhas' | 'comparar' | 'plano'; aba?: AbaProf }
  | { id: 'explorar'; dim?: string; q?: string }
  | { id: 'comparar' }
  | { id: 'minhas' }
  | { id: 'plano' }
  | { id: 'historico' }

export type Toast = { id: number; texto: string; tipo: 'ok' | 'info' | 'erro'; acao?: { rotulo: string; fn: () => void } }

type State = {
  view: View
  dir: 1 | -1
  sidebarFechada: boolean
  tentativas: Tentativa[]
  favoritos: Favorito[]
  acoes: Acao[]
  comparar: string[]
  /** profissões que o estudante disse não combinar com ele (feedback, não altera o resultado) */
  descartadas: string[]
  eventos: Evento[]
  salvando: 'ok' | 'salvando'
}

export type Inicio =
  | 'inicio'
  | 'entrada'
  | 'clareza'
  | 'questionario'
  | 'q-valores'
  | 'q-preferencias'
  | 'q-habilidades'
  | 'retomar'
  | 'revisao'
  | 'processando'
  | 'relatorio'
  | 'areas'
  | 'recomendacoes'
  | 'res-valores'
  | 'res-preferencias'
  | 'res-habilidades'
  | 'passos'
  | 'clareza-pos'
  | 'carreira'
  | 'explorar'
  | 'comparar'
  | 'minhas'
  | 'plano'
  | 'historico'

/* ---------------- estados iniciais (atalhos de fluxo) ---------------- */
const nova = (respostas: Respostas, extra: Partial<Tentativa> = {}): Tentativa => ({
  id: 't-atual',
  inicio: HOJE - 25 * 60_000,
  versao: VERSAO_INSTRUMENTO,
  status: 'andamento',
  respostas,
  pos: Object.keys(respostas).length,
  clarezaPre: 2,
  ...extra,
})

function passada(): Tentativa {
  const r = respostasPassadas()
  const res = gerarResultado(r, HOJE - 209 * DIA)!
  return {
    id: 't-abril',
    inicio: HOJE - 209 * DIA - 22 * 60_000,
    fim: HOJE - 209 * DIA,
    versao: 'TV-GX 0.9 · estudo cognitivo',
    status: 'concluida',
    respostas: r,
    pos: ITENS.length,
    clarezaPre: 1,
    clarezaPos: { valor: 3, descobriu: 'sim', relevancia: 4, em: HOJE - 209 * DIA },
    resultado: { ...res, versao: 'TV-GX 0.9 · estudo cognitivo', regras: 'REC 0.9' },
  }
}

function concluida(): Tentativa {
  const r = respostasPersona()
  return { ...nova(r), pos: ITENS.length, status: 'concluida', fim: HOJE - 4 * 60_000, resultado: gerarResultado(r, HOJE - 4 * 60_000)! }
}

const favPreset = (): Favorito[] => [
  { id: 'ciencia-dados', em: HOJE - 3 * 60_000, etapa: 'investigando' },
  { id: 'design-ux', em: HOJE - 2 * 60_000, etapa: 'conhecer' },
  { id: 'arquitetura', em: HOJE - 60_000, etapa: 'conhecer' },
  { id: 'jornalismo', em: HOJE - 30_000, etapa: 'conheci' },
]
function acoesPreset(): Acao[] {
  const ux = acoesSugeridas(CARREIRA['ciencia-dados'])
  const psi = acoesSugeridas(CARREIRA['design-ux'])
  return [
    { id: 'a1', texto: ux[0].texto, tipo: ux[0].tipo, carreira: 'ciencia-dados', feita: true, criadaEm: HOJE - 3 * 60_000, feitaEm: HOJE - 60_000 },
    { id: 'a2', texto: ux[1].texto, tipo: ux[1].tipo, carreira: 'ciencia-dados', feita: false, criadaEm: HOJE - 3 * 60_000 },
    { id: 'a3', texto: psi[2].texto, tipo: psi[2].tipo, carreira: 'design-ux', feita: false, criadaEm: HOJE - 2 * 60_000 },
    { id: 'a4', texto: 'Perguntar à orientadora da escola sobre feiras de profissões', tipo: 'pessoal', feita: false, criadaEm: HOJE - 60_000 },
  ]
}

const ABA: Partial<Record<Inicio, AbaRel>> = { relatorio: 'visao', areas: 'areas', recomendacoes: 'profissoes', 'res-valores': 'valores', 'res-preferencias': 'preferencias', 'res-habilidades': 'habilidades', passos: 'passos', 'clareza-pos': 'passos' }
/** pergunta inicial de cada atalho do questionário (índice em ITENS) */
const POS_Q: Partial<Record<Inicio, number>> = { questionario: 0, 'q-valores': 30, 'q-preferencias': 38, 'q-habilidades': 44 }

function inicial(start: Inicio): State {
  const base: State = { view: { id: 'inicio' }, dir: 1, sidebarFechada: false, tentativas: [], favoritos: [], acoes: [], comparar: [], descartadas: [], eventos: [], salvando: 'ok' }
  const comResultado = !!ABA[start] || ['carreira', 'explorar', 'comparar', 'minhas', 'plano', 'historico'].includes(start)
  const preset = ['comparar', 'minhas', 'plano', 'historico'].includes(start)
  const todas = respostasPersona()
  const ate = (n: number) => Object.fromEntries(ITENS.slice(0, n).map((i) => [i.id, todas[i.id]]).filter(([, v]) => v !== undefined))
  const semDuas = Object.fromEntries(Object.entries(todas).filter(([k]) => k !== 'V07' && k !== 'P04'))
  const tent: Tentativa[] =
    start === 'clareza' ? []
    : POS_Q[start] !== undefined ? [nova(ate(POS_Q[start]!), { pos: POS_Q[start]! })]
    : start === 'retomar' ? [nova(respostasParciais(23), { inicio: HOJE - DIA - 40 * 60_000 })]
    : start === 'revisao' ? [nova(semDuas, { pos: ITENS.length - 1 })]
    : start === 'processando' ? [nova(todas, { pos: ITENS.length - 1 })]
    : comResultado ? [concluida(), passada()]
    : []
  const view: View =
    ABA[start] ? { id: 'relatorio', aba: ABA[start], clarezaPos: start === 'clareza-pos' }
    : POS_Q[start] !== undefined ? { id: 'questionario' }
    : start === 'clareza' ? { id: 'entrada', clareza: true }
    : start === 'retomar' ? { id: 'entrada' }
    : start === 'carreira' ? { id: 'carreira', carreira: 'ciencia-dados', de: 'relatorio' }
    : ({ id: start } as View)
  return {
    ...base,
    view,
    tentativas: tent,
    favoritos: preset ? favPreset() : [],
    acoes: preset ? acoesPreset() : [],
    comparar: start === 'comparar' ? ['ciencia-dados', 'design-ux', 'arquitetura'] : [],
  }
}

/* ---------------- contexto ---------------- */
type Ctx = {
  s: State
  atual?: Tentativa
  ultima?: Tentativa
  ir: (v: View, dir?: 1 | -1) => void
  toggleSidebar: () => void
  track: (nome: string, props?: Record<string, string | number>) => void
  iniciar: () => void
  setClarezaPre: (v: number | null) => void
  responder: (id: string, v: Resposta) => void
  setPos: (n: number) => void
  concluir: () => Resultado | null
  enviarClarezaPos: (c: NonNullable<Tentativa['clarezaPos']>) => void
  favoritar: (id: string) => boolean
  setEtapa: (id: string, e: Etapa) => void
  toggleComparar: (id: string) => 'add' | 'rem' | 'cheio'
  setComparar: (ids: string[]) => void
  addAcao: (a: Pick<Acao, 'texto' | 'tipo' | 'carreira'>) => void
  toggleAcao: (id: string) => void
  editarAcao: (id: string, texto: string) => void
  removerAcao: (id: string) => Acao | undefined
  restaurarAcao: (a: Acao) => void
  descartar: (id: string) => void
  toasts: Toast[]
  toast: (texto: string, tipo?: Toast['tipo'], acao?: Toast['acao']) => void
  fecharToast: (id: number) => void
}
const C = createContext<Ctx | null>(null)
export const useTv = () => useContext(C)!

export function TvProvider({ start, children }: { start: Inicio; children: ReactNode }) {
  const [s, setS] = useState<State>(() => inicial(start))
  const [toasts, setToasts] = useState<Toast[]>([])
  const seq = useRef(0)
  const evSeq = useRef(0)
  const salvo = useRef<number | undefined>(undefined)
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

  const api = useMemo(() => {
    const up = (fn: (s: State) => State) => setS(fn)
    const setAtual = (fn: (t: Tentativa) => Tentativa) => up((x) => ({ ...x, tentativas: x.tentativas.map((t) => (t.status === 'andamento' ? fn(t) : t)) }))
    const track = (nome: string, props: Record<string, string | number> = {}) =>
      up((x) => ({ ...x, eventos: [{ id: ++evSeq.current, nome, props, t: Date.now() }, ...x.eventos].slice(0, 250) }))
    const tentativa = () => ref.current.tentativas.find((t) => t.status === 'andamento')
    const nTent = () => ref.current.tentativas.length
    return {
      track,
      ir: (view: View, dir: 1 | -1 = 1) => {
        up((x) => ({ ...x, view, dir }))
        document.querySelector('.tv-main')?.scrollTo({ top: 0 })
        document.querySelector('.tv-painel')?.scrollTo({ top: 0 })
      },
      toggleSidebar: () => up((x) => ({ ...x, sidebarFechada: !x.sidebarFechada })),
      iniciar: () => {
        const id = `t-${Date.now().toString(36)}`
        up((x) => ({ ...x, tentativas: [{ id, inicio: Date.now(), versao: VERSAO_INSTRUMENTO, status: 'andamento', respostas: {}, pos: 0 }, ...x.tentativas.filter((t) => t.status !== 'andamento')] }))
        track('career_test_started', { tentativa: nTent() + 1 })
      },
      setClarezaPre: (v: number | null) => {
        setAtual((t) => ({ ...t, clarezaPre: v }))
        if (v !== null) track('career_clarity_pre_submitted', { escala: v, tentativa: nTent() })
      },
      responder: (id: string, v: Resposta) => {
        const t = tentativa()
        if (!t) return
        const primeira = Object.keys(t.respostas).length === 0
        setAtual((x) => ({ ...x, respostas: { ...x.respostas, [id]: v } }))
        if (primeira) track('career_questionnaire_started', { versao: VERSAO_INSTRUMENTO })
        const item = ITENS.find((i) => i.id === id)
        track('career_question_answered', { item: id, etapa: item?.bloco ?? '', tentativa: nTent() })
        // salvamento progressivo (simulado)
        window.clearTimeout(salvo.current)
        up((x) => ({ ...x, salvando: 'salvando' }))
        salvo.current = window.setTimeout(() => up((x) => ({ ...x, salvando: 'ok' })), 650)
      },
      setPos: (n: number) => setAtual((t) => ({ ...t, pos: Math.max(0, Math.min(ITENS.length - 1, n)) })),
      concluir: () => {
        const t = tentativa()
        if (!t) return null
        const agora = Math.max(Date.now(), HOJE)
        const res = gerarResultado(t.respostas, agora)
        if (!res) return null
        up((x) => ({ ...x, tentativas: x.tentativas.map((y) => (y.id === t.id ? { ...y, status: 'concluida', fim: agora, resultado: res } : y)) }))
        track('career_questionnaire_completed', { versao: res.versao, duracao_min: Math.max(1, Math.round((agora - t.inicio) / 60_000)) })
        track('career_report_generated', { versao: res.regras, status: res.perfil.inconclusivo ? 'inconclusivo' : 'ok' })
        return res
      },
      enviarClarezaPos: (c: NonNullable<Tentativa['clarezaPos']>) => {
        const alvo = ref.current.tentativas.find((t) => t.status === 'concluida')
        if (!alvo) return
        up((x) => ({ ...x, tentativas: x.tentativas.map((t) => (t.id === alvo.id ? { ...t, clarezaPos: c } : t)) }))
        track('career_clarity_post_submitted', { escala: c.valor, tentativa: nTent() })
        if (c.relevancia) track('career_feedback_submitted', { categoria: 'relevancia', avaliacao: c.relevancia })
      },
      favoritar: (id: string) => {
        const tinha = ref.current.favoritos.some((f) => f.id === id)
        up((x) => ({ ...x, favoritos: tinha ? x.favoritos.filter((f) => f.id !== id) : [{ id, em: Date.now(), etapa: 'conhecer' }, ...x.favoritos] }))
        track(tinha ? 'career_favorite_removed' : 'career_favorite_added', { profissao: id })
        return !tinha
      },
      setEtapa: (id: string, e: Etapa) => up((x) => ({ ...x, favoritos: x.favoritos.map((f) => (f.id === id ? { ...f, etapa: e } : f)) })),
      toggleComparar: (id: string) => {
        const c = ref.current.comparar
        if (c.includes(id)) {
          up((x) => ({ ...x, comparar: x.comparar.filter((y) => y !== id) }))
          return 'rem' as const
        }
        if (c.length >= 3) return 'cheio' as const
        up((x) => ({ ...x, comparar: [...x.comparar, id] }))
        return 'add' as const
      },
      setComparar: (ids: string[]) => up((x) => ({ ...x, comparar: ids.slice(0, 3) })),
      addAcao: (a: Pick<Acao, 'texto' | 'tipo' | 'carreira'>) => {
        up((x) => ({ ...x, acoes: [{ ...a, id: `a${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`, feita: false, criadaEm: Date.now() }, ...x.acoes] }))
        track('career_action_created', { tipo: a.tipo })
      },
      toggleAcao: (id: string) => {
        const a = ref.current.acoes.find((y) => y.id === id)
        up((x) => ({ ...x, acoes: x.acoes.map((y) => (y.id === id ? { ...y, feita: !y.feita, feitaEm: !y.feita ? Date.now() : undefined } : y)) }))
        if (a && !a.feita) track('career_action_completed', { tipo: a.tipo })
      },
      editarAcao: (id: string, texto: string) => up((x) => ({ ...x, acoes: x.acoes.map((y) => (y.id === id ? { ...y, texto } : y)) })),
      removerAcao: (id: string) => {
        const a = ref.current.acoes.find((y) => y.id === id)
        up((x) => ({ ...x, acoes: x.acoes.filter((y) => y.id !== id) }))
        return a
      },
      restaurarAcao: (a: Acao) => up((x) => ({ ...x, acoes: [a, ...x.acoes] })),
      descartar: (id: string) => {
        up((x) => ({ ...x, descartadas: x.descartadas.includes(id) ? x.descartadas : [...x.descartadas, id] }))
        track('career_feedback_submitted', { categoria: 'nao_combina', profissao: id })
      },
      toast,
      fecharToast,
    }
  }, [toast, fecharToast])

  const atual = s.tentativas.find((t) => t.status === 'andamento')
  const ultima = s.tentativas.find((t) => t.status === 'concluida')
  return <C.Provider value={{ s, atual, ultima, toasts, ...api }}>{children}</C.Provider>
}

/* ---------------- datas ---------------- */
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
export function quando(t: number) {
  const d = new Date(t)
  const hoje = new Date(Math.max(Date.now(), HOJE))
  const hh = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  const dias = Math.round((new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()).getTime() - new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()) / DIA)
  if (dias <= 0) return `Hoje, ${hh}`
  if (dias === 1) return `Ontem, ${hh}`
  return `${d.getDate()} de ${MESES[d.getMonth()]}${d.getFullYear() !== hoje.getFullYear() ? ` de ${d.getFullYear()}` : ''}`
}
export const dataLonga = (t: number) => {
  const d = new Date(t)
  return `${d.getDate()} de ${['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'][d.getMonth()]} de ${d.getFullYear()}`
}
