import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { HOJE, ITEM, MOV_TRAJE, MOVS_BASE, RESGATE_TRAJE, RESGATES_BASE, type CategoriaId, type Mov, type Resgate } from './data'

/* =====================================================================
   Estado do protótipo Lojinha
   ===================================================================== */
export type Aba = 'loja' | 'cartao' | 'historico' | 'resgates' | 'regras'
export type View =
  | { id: 'loja' }
  | { id: 'categoria'; cat: CategoriaId | 'todos' }
  | { id: 'item'; item: string; de?: CategoriaId | 'todos'; resgatar?: boolean }
  | { id: 'cartao' }
  | { id: 'historico' }
  | { id: 'resgates'; abrir?: string }
  | { id: 'regras'; topico?: string }

export const abaDe = (v: View): Aba => (v.id === 'categoria' || v.id === 'item' ? 'loja' : v.id)

export type Notificacao = { id: string; texto: string; data: number; lida: boolean; ir?: View }
export type Toast = { id: number; texto: string; tipo: 'ok' | 'info' | 'erro'; acao?: { rotulo: string; fn: () => void } }

type State = {
  view: View
  dir: 1 | -1
  pontos: number
  /** avatar equipado no perfil (id do item) */
  avatar: string
  resgates: Resgate[]
  movs: Mov[]
  favoritos: string[]
  notificacoes: Notificacao[]
  /** último ganho/gasto, para animar o contador do topo */
  pulso: number
}

export type Inicio = 'loja' | 'avatares' | 'item' | 'cartao' | 'historico' | 'resgates' | 'regras'

function inicial(start: Inicio): State {
  // “depois do resgate do Traje Explorador” (como nas referências de Histórico e Meus Resgates)
  const depois = start === 'historico' || start === 'resgates' || start === 'cartao'
  const view: View = start === 'avatares' ? { id: 'categoria', cat: 'avatares' } : start === 'item' ? { id: 'item', item: 'traje-explorador', de: 'avatares' } : { id: start }
  return {
    view,
    dir: 1,
    pontos: 245800,
    avatar: 'traje-explorador',
    resgates: depois ? [RESGATE_TRAJE, ...RESGATES_BASE] : RESGATES_BASE,
    movs: depois ? [MOV_TRAJE, ...MOVS_BASE] : MOVS_BASE,
    favoritos: ['traje-galactico'],
    notificacoes: [
      { id: 'n1', texto: 'Você ganhou 1.000 pts por concluir uma missão na Trilha de Ciências.', data: HOJE - 6 * 60_000, lida: false, ir: { id: 'historico' } },
      { id: 'n2', texto: 'Seu Pacote de Cards Estelar foi enviado para a escola.', data: HOJE - 3 * 86_400_000, lida: false, ir: { id: 'resgates', abrir: 'r3' } },
      { id: 'n3', texto: 'Novidade! Novos trajes lendários chegaram à Lojinha.', data: HOJE - 5 * 86_400_000, lida: true, ir: { id: 'categoria', cat: 'avatares' } },
    ],
    pulso: 0,
  }
}

type Ctx = {
  s: State
  ir: (v: View, dir?: 1 | -1) => void
  resgatar: (itemId: string) => Resgate
  equipar: (itemId: string) => void
  favoritar: (itemId: string) => boolean
  lerNotificacoes: () => void
  possui: (itemId: string) => Resgate | undefined
  toasts: Toast[]
  toast: (texto: string, tipo?: Toast['tipo'], acao?: Toast['acao']) => void
  fecharToast: (id: number) => void
}
const C = createContext<Ctx | null>(null)
export const useLoja = () => useContext(C)!

export function LojaProvider({ start, children }: { start: Inicio; children: ReactNode }) {
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
      window.setTimeout(() => fecharToast(id), acao ? 6000 : 3800)
    },
    [fecharToast],
  )

  const api = useMemo(() => {
    const up = (fn: (s: State) => State) => setS(fn)
    return {
      ir: (view: View, dir: 1 | -1 = 1) => {
        up((x) => ({ ...x, view, dir }))
        document.querySelector('.lj-main')?.scrollTo({ top: 0, behavior: 'smooth' })
      },
      possui: (itemId: string) => ref.current.resgates.find((r) => r.item === itemId && r.status !== 'cancelado'),
      resgatar: (itemId: string) => {
        const it = ITEM[itemId]
        const agora = HOJE + 60_000 * (1 + ref.current.resgates.length)
        const r: Resgate = { id: `r${Date.now()}`, item: itemId, pontos: it.pontos, data: agora, status: 'processamento' }
        const m: Mov = { id: `m${Date.now()}`, tipo: 'resgate', titulo: 'Resgate de recompensa', desc: it.nome, valor: -it.pontos, data: agora }
        up((x) => ({ ...x, pontos: x.pontos - it.pontos, resgates: [r, ...x.resgates], movs: [m, ...x.movs], pulso: -it.pontos }))
        // item digital: liberado alguns segundos depois (simula o processamento)
        if (it.tipo === 'digital') {
          window.setTimeout(() => {
            up((x) => ({
              ...x,
              resgates: x.resgates.map((y) => (y.id === r.id ? { ...y, status: 'concluido' } : y)),
              notificacoes: [{ id: `n${Date.now()}`, texto: `${it.nome} já está disponível no seu perfil!`, data: agora + 60_000, lida: false, ir: { id: 'resgates', abrir: r.id } }, ...x.notificacoes],
            }))
            toast(`${it.nome} foi liberado no seu perfil!`)
          }, 7000)
        }
        return r
      },
      equipar: (itemId: string) => up((x) => ({ ...x, avatar: itemId })),
      favoritar: (itemId: string) => {
        const tinha = ref.current.favoritos.includes(itemId)
        up((x) => ({ ...x, favoritos: tinha ? x.favoritos.filter((y) => y !== itemId) : [...x.favoritos, itemId] }))
        return !tinha
      },
      lerNotificacoes: () => up((x) => ({ ...x, notificacoes: x.notificacoes.map((n) => ({ ...n, lida: true })) })),
    }
  }, [toast])

  return <C.Provider value={{ s, toasts, toast, fecharToast, ...api }}>{children}</C.Provider>
}
