import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { MODELOS_PADRAO, escopoInicial, formInicial, periodoListaPlano, progsIniciais, progsParaAtividades, type Escopo, type Modelo, type Prog } from './plano'
import {
  ATIVIDADES_ESCOLA_F,
  ESCOLAS,
  HOJE,
  INCONSISTENCIAS,
  MESES_CURTOS,
  TOTAL_OCORRENCIAS,
  capital,
  parseData,
  type Atividade,
  type Escola,
  type Inconsistencia,
  type Ocorrencia,
  type TipoId,
} from './data'

/* ---------------- telas ---------------- */
export type View =
  | { id: 'inicio' }
  | { id: 'lista'; aba?: 'rede' | 'meus' }
  | { id: 'importar'; escola: string }
  | { id: 'analise'; escola: string }
  | { id: 'inconsistencias'; escola: string }
  | { id: 'revisar'; escola: string }
  | { id: 'publicar'; escola: string }
  | { id: 'calendario'; escola?: string; dia?: string }
  | { id: 'escolha'; escola?: string }
  | { id: 'escopo' }
  | { id: 'configurar' }
  | { id: 'ajustar' }
  | { id: 'finalizar' }

export type Perfil = 'gestor' | 'professor'
export type Modo = 'aceitar' | 'outra' | 'manter'
export type Resolucao = { modo: Modo; /** valor escolhido por ocorrência (índice) */ valores: string[] }

export type Arquivo = { nome: string; tamanho: number; enviadoEm: Date; exemplo?: boolean }

type Wizard = {
  /** escola de referência (a primeira identificada na planilha; vazia antes da leitura) */
  escola: string
  /** escolas identificadas na planilha — uma planilha pode trazer várias escolas */
  escolas: string[]
  arquivo: Arquivo | null
  resolucoes: Record<string, Resolucao>
  atividades: Atividade[]
}

/** fluxo “Criar na plataforma” */
export type Plano = {
  escopo: Escopo
  progs: Prog[]
  /** programações com vinculação de educador revisada */
  resolvidos: string[]
  /** educadores escolhidos manualmente (programação|escola|ano → nome) */
  vinculos?: Record<string, string>
  modelos: Modelo[]
  publicacao: { modo: 'agora' | 'agendar'; data: string; hora: string }
}

/** validação da planilha em segundo plano (leva em média até 15 min; acelerada no protótipo) */
export type Validacao = { inicio: number; pct: number; estado: 'rodando' | 'concluida'; minimizada: boolean }
/** duração real da simulação (ms) e o tempo que ela representa (min) */
export const VALIDACAO_MS = 45000
export const VALIDACAO_MIN = 15
/** etapas da validação: [título, texto em andamento, texto concluído, fim da etapa (0–1)] */
export const ETAPAS_VALIDACAO: { titulo: string; fazendo: string; feito: string; ate: number }[] = [
  { titulo: 'Upload do arquivo', fazendo: 'Enviando arquivo...', feito: 'Arquivo recebido com sucesso.', ate: 0.04 },
  { titulo: 'Leitura e validação dos dados', fazendo: 'Lendo as programações de cada escola e conferindo padrões...', feito: '96 registros de 4 escolas lidos e validados.', ate: 0.55 },
  { titulo: 'Preparando sugestões de ajuste', fazendo: 'Comparando com educadores, turmas e componentes da sua rede...', feito: '12 pontos de atenção encontrados.', ate: 0.85 },
  { titulo: 'Organizando os cronogramas', fazendo: 'Agrupando as atividades por escola, mês e tipo...', feito: 'Cronogramas organizados por escola e mês.', ate: 1 },
]
export const etapaValidacao = (pct: number) => {
  const i = ETAPAS_VALIDACAO.findIndex((e) => pct < e.ate)
  return i === -1 ? ETAPAS_VALIDACAO.length : i
}
export function restanteTexto(pct: number) {
  const min = (1 - pct) * VALIDACAO_MIN
  if (min <= 0) return 'concluída'
  if (min < 1) return 'menos de 1 min restante'
  return `cerca de ${Math.ceil(min)} min restantes`
}

type Toast = { id: number; texto: string; tipo?: 'ok' | 'info' | 'erro'; acao?: { rotulo: string; fn: () => void } }

type State = {
  perfil: Perfil
  view: View
  /** direção da transição de tela */
  dir: 1 | -1
  escolas: Escola[]
  wizard: Wizard | null
  publicados: Record<string, Atividade[]>
  /** atividades criadas/dispensadas pelo professor */
  professor: Record<string, 'pendente' | 'criada' | 'dispensada'>
  sidebarFechada: boolean
  plano: Plano | null
  validacao: Validacao | null
}

/** escolas que a planilha de exemplo traz (as da rede que ainda não têm cronograma) */
export const ESCOLAS_PLANILHA = ESCOLAS.filter((e) => e.status === 'nao-iniciado').map((e) => e.id)

/* ---------------- aplicar valores da planilha ---------------- */
const clone = (l: Atividade[]) => l.map((x) => ({ ...x, turmas: [...x.turmas] }))

function aplicarValor(list: Atividade[], oc: Ocorrencia, valor: string): Atividade[] {
  return list.map((at) => {
    if (at.id !== oc.linha) return at
    if (oc.campo === 'periodo') {
      const [i, f] = valor.split(' a ').map((d) => d.split('/').reverse().join('-'))
      return { ...at, inicio: i, fim: f }
    }
    if (oc.campo === 'turmas') return at // a correspondência só confirma o vínculo
    if (oc.campo === 'tipo') return { ...at, tipo: (valor || null) as TipoId | null }
    return { ...at, [oc.campo]: valor }
  })
}

/** a planilha “crua”: dados corretos com os erros originais aplicados */
export function planilhaOriginal(): Atividade[] {
  let list = clone(ATIVIDADES_ESCOLA_F)
  for (const inc of INCONSISTENCIAS) for (const oc of inc.ocorrencias) list = aplicarValor(list, oc, oc.original)
  return list
}

/** valor final de uma ocorrência conforme a resolução */
export function valorResolvido(inc: Inconsistencia, idx: number, r: Resolucao) {
  const oc = inc.ocorrencias[idx]
  if (r.modo === 'aceitar') return oc.sugerido
  if (r.modo === 'manter') return oc.original
  return r.valores[idx] ?? oc.sugerido
}

export const ocorrenciasResolvidas = (w: Wizard | null) =>
  w ? INCONSISTENCIAS.reduce((n, inc) => n + (w.resolucoes[inc.id] ? inc.ocorrencias.length : 0), 0) : 0

/** período “Jan/2025 – Dez/2025” a partir das atividades */
export function periodoDe(list: Atividade[]) {
  if (!list.length) return null
  const ini = list.map((a) => a.inicio).sort()[0]
  const d = parseData(ini)
  return `${capital(MESES_CURTOS[d.getMonth()])}/${d.getFullYear()} – Dez/${d.getFullYear()}`
}

function agoraTexto() {
  const h = new Date()
  const d = parseData(HOJE)
  return `${String(d.getDate()).padStart(2, '0')} de ${MESES_CURTOS[d.getMonth()]} de ${d.getFullYear()} às ${String(h.getHours()).padStart(2, '0')}:${String(h.getMinutes()).padStart(2, '0')}`
}

/* ---------------- estado inicial ---------------- */
export type Inicio = 'lista' | 'importar' | 'analise' | 'validando' | 'validada' | 'inconsistencias' | 'revisar' | 'publicar' | 'calendario' | 'professor' | 'inicio' | 'escolha' | 'escopo' | 'configurar' | 'ajustar' | 'finalizar'

const novoPlano = (escola?: string, comExemplo = false): Plano => {
  const escopo = escopoInicial(escola)
  return {
    escopo,
    progs: comExemplo ? progsIniciais(escopo.escolas) : [],
    resolvidos: [],
    modelos: [...MODELOS_PADRAO],
    publicacao: { modo: 'agora', data: '2027-03-01', hora: '08:00' },
  }
}

function inicial(start: Inicio): State {
  const escolas = ESCOLAS.map((e) => ({ ...e }))
  const publicados: Record<string, Atividade[]> = {}
  for (const e of escolas) if (e.status === 'publicado') publicados[e.id] = clone(ATIVIDADES_ESCOLA_F)
  const professor: State['professor'] = {}
  for (const at of ATIVIDADES_ESCOLA_F) if (at.professor) professor[at.id] = at.professor

  const s: State = { perfil: 'gestor', view: { id: 'lista' }, dir: 1, escolas, wizard: null, publicados, professor, sidebarFechada: false, plano: null, validacao: null }
  if (start === 'escolha') return { ...s, view: { id: 'escolha' } }
  if (start === 'escopo') return { ...s, plano: novoPlano(), view: { id: 'escopo' } }
  if (start === 'configurar') return { ...s, plano: novoPlano(), view: { id: 'configurar' } }
  if (start === 'ajustar' || start === 'finalizar') {
    const p = novoPlano(undefined, true)
    p.progs = [{ ...formInicial(p.escopo.escolas), id: 'p1' }, ...p.progs]
    if (start === 'finalizar') p.resolvidos = ['p3']
    return { ...s, plano: p, view: { id: start } }
  }
  const wizardF = (resolvido: boolean): Wizard => ({
    escola: 'c',
    escolas: ESCOLAS_PLANILHA,
    arquivo: { nome: 'cronograma_rede_2025.csv', tamanho: 34 * 1024, enviadoEm: new Date(2025, 10, 6, 10, 24), exemplo: true },
    resolucoes: resolvido ? Object.fromEntries(INCONSISTENCIAS.map((i) => [i.id, { modo: 'aceitar' as Modo, valores: [] }])) : {},
    atividades: resolvido ? clone(ATIVIDADES_ESCOLA_F) : planilhaOriginal(),
  })
  // atalhos de fluxo (plataforma) — já deixam os dados no ponto certo
  if (start === 'importar') return { ...s, wizard: { ...wizardF(false), escola: '', escolas: [], arquivo: null }, view: { id: 'importar', escola: '' } }
  // validação em segundo plano: na tela de análise, rodando na lista ou já concluída
  const rodando = (pct: number): Validacao => ({ inicio: Date.now() - pct * VALIDACAO_MS, pct, estado: 'rodando', minimizada: false })
  if (start === 'analise') return { ...s, wizard: wizardF(false), validacao: rodando(0.38), view: { id: 'analise', escola: 'c' } }
  if (start === 'validando') return { ...s, wizard: wizardF(false), validacao: rodando(0.38), view: { id: 'lista' } }
  if (start === 'validada') return { ...s, wizard: wizardF(false), validacao: { inicio: Date.now() - VALIDACAO_MS, pct: 1, estado: 'concluida', minimizada: false }, view: { id: 'lista' } }
  if (start === 'inconsistencias') return { ...s, wizard: wizardF(false), view: { id: 'inconsistencias', escola: 'c' } }
  if (start === 'revisar') return { ...s, wizard: wizardF(true), view: { id: 'revisar', escola: 'c' } }
  if (start === 'publicar') return { ...s, wizard: wizardF(true), view: { id: 'publicar', escola: 'c' } }
  const comF = (): State => ({
    ...s,
    escolas: escolas.map((e) => (e.id === 'f' ? { ...e, status: 'publicado', periodo: 'Jan/2025 – Dez/2025', atualizado: '06 de nov de 2025 às 10:32', minha: true } : e)),
    publicados: { ...publicados, f: clone(ATIVIDADES_ESCOLA_F) },
  })
  if (start === 'calendario') return { ...comF(), view: { id: 'calendario', escola: 'f', dia: HOJE } }
  if (start === 'professor') return { ...comF(), perfil: 'professor', view: { id: 'inicio' } }
  if (start === 'inicio') return { ...s, view: { id: 'inicio' } }
  return s
}

/* ---------------- ações ---------------- */
function useCronState(start: Inicio) {
  const [s, set] = useState<State>(() => inicial(start))
  const [toasts, setToasts] = useState<Toast[]>([])
  const seq = useRef(0)

  const toast = useCallback((texto: string, tipo: Toast['tipo'] = 'ok', acao?: Toast['acao']) => {
    const id = ++seq.current
    setToasts((t) => [...t.slice(-2), { id, texto, tipo, acao }])
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), acao ? 6000 : 3600)
  }, [])
  const fecharToast = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), [])

  const ir = useCallback((view: View, dir: 1 | -1 = 1) => {
    set((st) => ({ ...st, view, dir }))
    document.querySelector('.cr-main')?.scrollTo({ top: 0 })
  }, [])

  const setPerfil = useCallback((perfil: Perfil) => set((st) => ({ ...st, perfil, view: perfil === 'professor' ? { id: 'inicio' } : { id: 'lista' }, dir: 1 })), [])
  const toggleSidebar = useCallback(() => set((st) => ({ ...st, sidebarFechada: !st.sidebarFechada })), [])

  /* ----- assistente de criação ----- */
  /** planilha: não pede escola — as escolas são identificadas na leitura do arquivo */
  const iniciar = useCallback(() => {
    set((st) => ({ ...st, dir: 1, wizard: { escola: '', escolas: [], arquivo: null, resolucoes: {}, atividades: [] }, view: { id: 'importar', escola: '' } }))
  }, [])

  /** retomar rascunho: dados já revisados */
  const continuar = useCallback((escola: string) => {
    set((st) => ({
      ...st,
      dir: 1,
      wizard: {
        escola,
        escolas: [escola],
        arquivo: { nome: `cronograma_escola_${escola}.csv`, tamanho: 31 * 1024, enviadoEm: new Date(2025, 0, 27, 16, 20), exemplo: true },
        resolucoes: Object.fromEntries(INCONSISTENCIAS.map((i) => [i.id, { modo: 'aceitar' as Modo, valores: [] }])),
        atividades: clone(st.publicados[escola] ?? ATIVIDADES_ESCOLA_F),
      },
      view: { id: 'revisar', escola },
    }))
  }, [])

  const setArquivo = useCallback((arquivo: Arquivo | null) => set((st) => (st.wizard ? { ...st, wizard: { ...st.wizard, arquivo } } : st)), [])

  const concluirAnalise = useCallback(() => {
    set((st) =>
      st.wizard
        ? { ...st, dir: 1, validacao: null, wizard: { ...st.wizard, resolucoes: {}, atividades: planilhaOriginal() }, view: { id: 'inconsistencias', escola: st.wizard.escola } }
        : st,
    )
  }, [])

  /* ----- validação em segundo plano ----- */
  const iniciarValidacao = useCallback(() => {
    set((st) =>
      st.wizard
        ? {
            ...st,
            dir: 1,
            wizard: { ...st.wizard, escola: ESCOLAS_PLANILHA[0], escolas: ESCOLAS_PLANILHA },
            validacao: { inicio: Date.now(), pct: 0, estado: 'rodando', minimizada: false },
            view: { id: 'analise', escola: ESCOLAS_PLANILHA[0] },
          }
        : st,
    )
  }, [])
  const minimizarValidacao = useCallback((minimizada: boolean) => set((st) => (st.validacao ? { ...st, validacao: { ...st.validacao, minimizada } } : st)), [])
  const dispensarValidacao = useCallback(() => set((st) => ({ ...st, validacao: null })), [])
  const verValidacao = useCallback(() => set((st) => (st.wizard ? { ...st, dir: 1, view: { id: 'analise', escola: st.wizard.escola } } : st)), [])

  // relógio da validação: segue rodando enquanto a pessoa navega pela plataforma
  const rodando = s.validacao?.estado === 'rodando'
  useEffect(() => {
    if (!rodando) return
    const t = window.setInterval(() => {
      set((st) => {
        if (!st.validacao || st.validacao.estado !== 'rodando') return st
        const pct = Math.min(1, (Date.now() - st.validacao.inicio) / VALIDACAO_MS)
        return { ...st, validacao: { ...st.validacao, pct, estado: pct >= 1 ? 'concluida' : 'rodando', minimizada: pct >= 1 ? false : st.validacao.minimizada } }
      })
    }, 250)
    return () => window.clearInterval(t)
  }, [rodando])

  const resolver = useCallback((incId: string, r: Resolucao | null) => {
    set((st) => {
      if (!st.wizard) return st
      const inc = INCONSISTENCIAS.find((i) => i.id === incId)!
      let atividades = st.wizard.atividades
      inc.ocorrencias.forEach((oc, idx) => {
        atividades = aplicarValor(atividades, oc, r ? valorResolvido(inc, idx, r) : oc.original)
      })
      const resolucoes = { ...st.wizard.resolucoes }
      if (r) resolucoes[incId] = r
      else delete resolucoes[incId]
      return { ...st, wizard: { ...st.wizard, atividades, resolucoes } }
    })
  }, [])

  const resolverPendentes = useCallback(() => {
    set((st) => {
      if (!st.wizard) return st
      let atividades = st.wizard.atividades
      const resolucoes = { ...st.wizard.resolucoes }
      for (const inc of INCONSISTENCIAS) {
        if (resolucoes[inc.id]) continue
        resolucoes[inc.id] = { modo: 'aceitar', valores: [] }
        inc.ocorrencias.forEach((oc) => (atividades = aplicarValor(atividades, oc, oc.sugerido)))
      }
      return { ...st, wizard: { ...st.wizard, atividades, resolucoes } }
    })
  }, [])

  /* ----- atividades (revisão / calendário) ----- */
  const salvarAtividade = useCallback((at: Atividade, destino: 'wizard' | string) => {
    set((st) => {
      const up = (l: Atividade[]) => (l.some((x) => x.id === at.id) ? l.map((x) => (x.id === at.id ? at : x)) : [...l, at])
      if (destino === 'wizard') return st.wizard ? { ...st, wizard: { ...st.wizard, atividades: up(st.wizard.atividades) } } : st
      return { ...st, publicados: { ...st.publicados, [destino]: up(st.publicados[destino] ?? []) } }
    })
  }, [])

  const removerAtividades = useCallback((ids: string[]) => {
    let removidas: Atividade[] = []
    set((st) => {
      if (!st.wizard) return st
      removidas = st.wizard.atividades.filter((x) => ids.includes(x.id))
      return { ...st, wizard: { ...st.wizard, atividades: st.wizard.atividades.filter((x) => !ids.includes(x.id)) } }
    })
    return () => set((st) => (st.wizard ? { ...st, wizard: { ...st.wizard, atividades: [...st.wizard.atividades, ...removidas] } } : st))
  }, [])

  const publicar = useCallback((comoRascunho = false) => {
    set((st) => {
      if (!st.wizard) return st
      const w = st.wizard
      const alvo = w.escolas.length ? w.escolas : [w.escola]
      const escolas = st.escolas.map((e) =>
        alvo.includes(e.id) ? { ...e, status: (comoRascunho ? 'rascunho' : 'publicado') as Escola['status'], periodo: periodoDe(w.atividades), atualizado: agoraTexto(), minha: true } : e,
      )
      const publicados = comoRascunho ? st.publicados : { ...st.publicados, ...Object.fromEntries(alvo.map((id) => [id, clone(w.atividades)])) }
      return { ...st, escolas, publicados }
    })
  }, [])

  /* ----- criar na plataforma ----- */
  const iniciarPlano = useCallback((escola?: string) => set((st) => ({ ...st, dir: 1, plano: novoPlano(escola), view: { id: 'escopo' } })), [])
  const setPlano = useCallback((fn: (p: Plano) => Plano) => set((st) => (st.plano ? { ...st, plano: fn(st.plano) } : st)), [])
  /** publica (ou agenda / salva rascunho) o plano em todas as escolas do escopo que aparecem na lista */
  const publicarPlano = useCallback((modo: 'publicado' | 'agendado' | 'rascunho') => {
    set((st) => {
      if (!st.plano) return st
      const p = st.plano
      // só as escolas que recebem pelo menos uma programação
      const alvo = p.escopo.escolas.filter((id) => progsParaAtividades(p.progs, p.escopo, id).length > 0)
      const escolas = st.escolas.map((e) =>
        alvo.includes(e.id) ? { ...e, status: modo as Escola['status'], periodo: periodoListaPlano(), atualizado: agoraTexto(), minha: true } : e,
      )
      const publicados = { ...st.publicados }
      if (modo !== 'rascunho')
        for (const id of alvo) {
          const novas = progsParaAtividades(p.progs, p.escopo, id)
          if (novas.length) publicados[id] = [...(publicados[id] ?? []).filter((a) => !a.id.startsWith('p')), ...novas]
        }
      return { ...st, escolas, publicados }
    })
  }, [])

  /* ----- professor ----- */
  const setProfessor = useCallback((id: string, v: 'pendente' | 'criada' | 'dispensada') => set((st) => ({ ...st, professor: { ...st.professor, [id]: v } })), [])

  const acoes = useMemo(
    () => ({ toast, fecharToast, ir, setPerfil, toggleSidebar, iniciarPlano, setPlano, publicarPlano, iniciar, continuar, setArquivo, concluirAnalise, iniciarValidacao, minimizarValidacao, dispensarValidacao, verValidacao, resolver, resolverPendentes, salvarAtividade, removerAtividades, publicar, setProfessor }),
    [toast, fecharToast, ir, setPerfil, toggleSidebar, iniciarPlano, setPlano, publicarPlano, iniciar, continuar, setArquivo, concluirAnalise, iniciarValidacao, minimizarValidacao, dispensarValidacao, verValidacao, resolver, resolverPendentes, salvarAtividade, removerAtividades, publicar, setProfessor],
  )
  return { s, toasts, ...acoes }
}

type Ctx = ReturnType<typeof useCronState>
const C = createContext<Ctx | null>(null)
export function CronProvider({ start, children }: { start: Inicio; children: ReactNode }) {
  const v = useCronState(start)
  return <C.Provider value={v}>{children}</C.Provider>
}
export function useCron() {
  const c = useContext(C)
  if (!c) throw new Error('useCron fora do CronProvider')
  return c
}

export const nomeEscola = (escolas: Escola[], id?: string) => escolas.find((e) => e.id === id)?.nome ?? 'Escola'
/** “Escola C, Escola F, Escola G e Escola I” */
export const nomesEscolas = (escolas: Escola[], ids: string[]) => {
  const n = ids.map((id) => nomeEscola(escolas, id))
  return n.length > 1 ? `${n.slice(0, -1).join(', ')} e ${n[n.length - 1]}` : (n[0] ?? '')
}
export { TOTAL_OCORRENCIAS }
