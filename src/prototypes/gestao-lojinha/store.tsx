import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { AGORA, categoriasIniciais, configInicial, itensIniciais, resgatesIniciais, type Categoria, type Config, type Item, type Mov, type PlataformaId, type Periodo, type Resgate, type StatusResgate } from './data'

/* =====================================================================
   Estado da Gestão da Lojinha (Admin)
   ===================================================================== */
export type Aba = 'visao' | 'itens' | 'categorias' | 'resgates' | 'extrato' | 'estudantes' | 'config'
export type View =
  | { id: 'visao' }
  | { id: 'itens'; cat?: string; ordem?: 'resgates' }
  | { id: 'item-form'; item?: string }
  | { id: 'categorias' }
  | { id: 'resgates'; status?: StatusResgate }
  | { id: 'resgate'; codigo: string }
  | { id: 'extrato'; pessoa?: number }
  | { id: 'estudantes' }
  | { id: 'estudante'; pessoa: number; aba?: 'movs' | 'resgates' | 'resumo' }
  | { id: 'config'; secao?: string }

export const abaDe = (v: View): Aba =>
  v.id === 'item-form' ? 'itens' : v.id === 'resgate' ? 'resgates' : v.id === 'estudante' ? 'estudantes' : (v.id as Aba)

export type Evento = { acao: string; data: number; autor: string }
export type Nota = { texto: string; data: number; autor: string }

export type PlatState = {
  itens: Item[]
  cats: Categoria[]
  resgates: Resgate[]
  config: Config
  /** histórico de ações e observações por código de resgate */
  eventos: Record<string, Evento[]>
  notas: Record<string, Nota[]>
  /** ajustes manuais de saldo e mudanças de status das pessoas */
  ajustes: Record<number, Mov[]>
  statusPessoa: Record<number, 'ativo' | 'inativo'>
  /** destaque visual após cadastrar/editar */
  destaque?: string
}

export type Toast = { id: number; texto: string; tipo: 'ok' | 'info' | 'erro'; acao?: { rotulo: string; fn: () => void } }
export type Inicio = 'visao' | 'itens' | 'cadastrar' | 'categorias' | 'resgates' | 'resgate' | 'extrato' | 'estudantes' | 'estudante' | 'config'

function criaPlat(p: PlataformaId): PlatState {
  const itens = itensIniciais(p)
  return { itens, cats: categoriasIniciais(p), resgates: resgatesIniciais(p, itens), config: configInicial(p), eventos: {}, notas: {}, ajustes: {}, statusPessoa: {} }
}

type State = { view: View; dir: 1 | -1; plataforma: PlataformaId; periodo: Periodo; lateralFechada: boolean; plats: Partial<Record<PlataformaId, PlatState>> }

function inicial(start: Inicio): State {
  const view: View =
    start === 'cadastrar' ? { id: 'item-form' } : start === 'resgate' ? { id: 'resgate', codigo: '#RG-014582' } : start === 'estudante' ? { id: 'estudante', pessoa: 0 } : start === 'extrato' ? { id: 'extrato', pessoa: 0 } : { id: start }
  return { view, dir: 1, plataforma: 'exploradores', periodo: '30', lateralFechada: false, plats: { exploradores: criaPlat('exploradores') } }
}

type Ctx = {
  s: State
  d: PlatState
  ir: (v: View, dir?: 1 | -1) => void
  setPlataforma: (p: PlataformaId) => void
  setPeriodo: (p: Periodo) => void
  toggleLateral: () => void
  upd: (fn: (d: PlatState) => PlatState) => void
  mudarStatus: (codigo: string, st: StatusResgate, autor?: string) => void
  toasts: Toast[]
  toast: (texto: string, tipo?: Toast['tipo'], acao?: Toast['acao']) => void
  fecharToast: (id: number) => void
}
const C = createContext<Ctx | null>(null)
export const useAdm = () => useContext(C)!

export const ROTULO_EVENTO: Record<StatusResgate, string> = {
  solicitado: 'Solicitação de resgate',
  aprovado: 'Resgate aprovado',
  processamento: 'Resgate em processamento',
  enviado: 'Item enviado',
  concluido: 'Resgate concluído',
  cancelado: 'Resgate cancelado e pontos estornados',
}

export function AdmProvider({ start, children }: { start: Inicio; children: ReactNode }) {
  const [s, setS] = useState<State>(() => inicial(start))
  const [toasts, setToasts] = useState<Toast[]>([])
  const seq = useRef(0)
  const fecharToast = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), [])
  const toast = useCallback(
    (texto: string, tipo: Toast['tipo'] = 'ok', acao?: Toast['acao']) => {
      const id = ++seq.current
      setToasts((t) => [...t.slice(-2), { id, texto, tipo, acao }])
      window.setTimeout(() => fecharToast(id), acao ? 6000 : 3600)
    },
    [fecharToast],
  )
  const d = s.plats[s.plataforma]!

  const api = useMemo(() => {
    const upd = (fn: (d: PlatState) => PlatState) => setS((x) => ({ ...x, plats: { ...x.plats, [x.plataforma]: fn(x.plats[x.plataforma]!) } }))
    return {
      upd,
      ir: (view: View, dir: 1 | -1 = 1) => {
        setS((x) => ({ ...x, view, dir }))
        document.querySelector('.ga-main')?.scrollTo({ top: 0 })
      },
      setPlataforma: (p: PlataformaId) =>
        setS((x) => {
          const plats = x.plats[p] ? x.plats : { ...x.plats, [p]: criaPlat(p) }
          // telas de detalhe dependem da plataforma: volta para a lista equivalente
          const v = x.view
          const view: View = v.id === 'resgate' ? { id: 'resgates' } : v.id === 'item-form' && v.item ? { id: 'itens' } : v
          return { ...x, plataforma: p, plats, view }
        }),
      setPeriodo: (periodo: Periodo) => setS((x) => ({ ...x, periodo })),
      toggleLateral: () => setS((x) => ({ ...x, lateralFechada: !x.lateralFechada })),
      mudarStatus: (codigo: string, st: StatusResgate, autor = 'FernanDesigner') =>
        upd((dd) => ({
          ...dd,
          resgates: dd.resgates.map((r) => (r.codigo === codigo ? { ...r, status: st } : r)),
          eventos: { ...dd.eventos, [codigo]: [{ acao: ROTULO_EVENTO[st], data: AGORA + (dd.eventos[codigo]?.length ?? 0) * 60_000 + 60_000, autor }, ...(dd.eventos[codigo] ?? [])] },
        })),
    }
  }, [])

  return <C.Provider value={{ s, d, toasts, toast, fecharToast, ...api }}>{children}</C.Provider>
}
