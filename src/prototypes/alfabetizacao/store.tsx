import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { CLASS_PRODUCTIONS, TASKS, TRAILS, findAvatar, findTrail, type Production, type Task, type Trail } from './data'
import { sfx } from '../../shared/sound'

export type ScreenId =
  | 'avatar'
  | 'splash'
  | 'home'
  | 'trail'
  | 'lesson'
  | 'achievements'
  | 'mural'
  | 'new-production'
  | 'create'
  | 'review'
  | 'published'
  | 'tasks'
  | 'task'

export type Screen = { id: ScreenId; params?: Record<string, string | number | undefined> }

export type Draft = {
  kind: Production['kind']
  title: string
  desc: string
  image?: string
  text?: string
  audio?: string
  share: boolean
}

type Toast = { id: number; text: string; img?: string }
type Burst = { id: number; x: number; y: number; big?: boolean }

type State = {
  stack: Screen[]
  dir: 1 | -1
  /** bichinho escolhido pelo estudante */
  avatar: string
  /** fases concluídas em cada trilha */
  progress: Record<Trail['id'], number>
  /** trilha recém-desbloqueada que a Home deve animar ao aparecer */
  pendingUnlock: Trail['id'] | null
  unlocked: string[]
  seen: string[]
  queue: string[]
  tasks: Task[]
  productions: Production[]
  likesGiven: number
  streak: number
  audioTaps: number
  draft: Draft | null
  lastPublished: string | null
}

const initial = (start: ScreenId): State => ({
  stack: start === 'avatar' ? [{ id: 'avatar' }] : [{ id: 'home' }, ...(start !== 'home' ? [{ id: start } as Screen] : [])],
  dir: 1,
  avatar: 'raposa',
  progress: { abc: 0, leitura: 0, escrita: 0 },
  pendingUnlock: null,
  unlocked: ['leitor', 'decolagem'],
  seen: ['leitor', 'decolagem'],
  queue: [],
  tasks: TASKS.map((t) => ({ ...t })),
  productions: CLASS_PRODUCTIONS.map((p) => ({ ...p })),
  likesGiven: 0,
  streak: 0,
  audioTaps: 0,
  draft: null,
  lastPublished: null,
})

function useAlfaState(start: ScreenId) {
  const [s, set] = useState<State>(() => initial(start))
  const [toasts, setToasts] = useState<Toast[]>([])
  const [bursts, setBursts] = useState<Burst[]>([])
  const seq = useRef(0)

  const toast = useCallback((text: string, img?: string) => {
    const id = ++seq.current
    setToasts((t) => [...t.slice(-1), { id, text, img }])
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600)
  }, [])

  const confetti = useCallback((x = 0.5, y = 0.45, big = false) => {
    const id = ++seq.current
    setBursts((b) => [...b, { id, x, y, big }])
    window.setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 2600)
  }, [])

  const go = useCallback((screen: Screen) => {
    sfx.whoosh()
    set((st) => ({ ...st, dir: 1, stack: [...st.stack, screen] }))
  }, [])

  const replace = useCallback((screen: Screen) => {
    sfx.whoosh()
    set((st) => ({ ...st, dir: 1, stack: [...st.stack.slice(0, -1), screen] }))
  }, [])

  const back = useCallback(() => {
    sfx.whoosh()
    set((st) => ({ ...st, dir: -1, stack: st.stack.length > 1 ? st.stack.slice(0, -1) : [{ id: 'home' }] }))
  }, [])

  /** volta até a tela indicada (ou a recria por cima do início) */
  const backTo = useCallback((screen: Screen) => {
    sfx.whoosh()
    set((st) => {
      const idx = st.stack.map((x) => x.id).lastIndexOf(screen.id)
      const stack = idx >= 0 ? [...st.stack.slice(0, idx), screen] : [{ id: 'home' as ScreenId }, ...(screen.id === 'home' ? [] : [screen])]
      return { ...st, dir: -1, stack }
    })
  }, [])

  const unlock = useCallback((id: string) => {
    set((st) => (st.unlocked.includes(id) ? st : { ...st, unlocked: [...st.unlocked, id], queue: [...st.queue, id] }))
  }, [])

  // Conquistas derivadas do estado: sempre que uma condição passa a valer, a conquista entra na fila.
  useEffect(() => {
    const want: string[] = []
    if (s.progress.abc >= 1) want.push('mestre-letras')
    if (s.progress.abc >= findTrail('abc').levels.length) want.push('explorador')
    if (s.streak >= 3) want.push('na-mosca')
    if (s.likesGiven >= 3) want.push('amigo')
    if (s.audioTaps >= 5) want.push('ouvido')
    if (s.productions.some((p) => p.mine)) want.push('artista')
    s.tasks.forEach((t) => t.achievement && t.status === 'concluida' && want.push(t.achievement))
    if (s.tasks.filter((t) => t.playable).every((t) => t.status === 'concluida')) want.push('super')
    const missing = want.filter((id) => !s.unlocked.includes(id))
    if (!missing.length) return
    set((st) => {
      const add = missing.filter((id) => !st.unlocked.includes(id))
      return add.length ? { ...st, unlocked: [...st.unlocked, ...add], queue: [...st.queue, ...add] } : st
    })
  }, [s])

  const dismissAchievement = useCallback(() => set((st) => ({ ...st, queue: st.queue.slice(1) })), [])
  const markSeen = useCallback(() => set((st) => ({ ...st, seen: [...st.unlocked] })), [])

  const answer = useCallback((firstTry: boolean) => set((st) => ({ ...st, streak: firstTry ? st.streak + 1 : 0 })), [])

  const completeLevel = useCallback((trail: Trail['id'], index: number) => {
    set((st) => {
      const t = findTrail(trail)
      const before = st.progress[trail]
      const after = Math.max(before, index + 1)
      const justFinished = before < t.levels.length && after >= t.levels.length
      const next = TRAILS[TRAILS.indexOf(t) + 1]
      return {
        ...st,
        progress: { ...st.progress, [trail]: after },
        pendingUnlock: justFinished && next ? next.id : st.pendingUnlock,
      }
    })
  }, [])

  const setAvatar = useCallback((avatar: string) => set((st) => ({ ...st, avatar })), [])

  const clearPendingUnlock = useCallback(() => set((st) => ({ ...st, pendingUnlock: null })), [])

  const updateTask = useCallback((id: string, patch: Partial<Task>) => {
    set((st) => ({ ...st, tasks: st.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) }))
  }, [])

  const completeTask = useCallback((id: string, stars: number) => {
    set((st) => {
      const old = st.tasks.find((t) => t.id === id)
      if (!old) return st
      const done: Task = { ...old, status: 'concluida', doneAt: 'hoje', stars: Math.max(stars, old.stars ?? 0), progress: 100 }
      // a recém-concluída vai para o topo da lista
      return { ...st, tasks: [done, ...st.tasks.filter((t) => t.id !== id)] }
    })
  }, [])

  const toggleLike = useCallback((id: string) => {
    set((st) => {
      const target = st.productions.find((p) => p.id === id)
      if (!target) return st
      const liked = !target.liked
      return {
        ...st,
        likesGiven: st.likesGiven + (liked ? 1 : 0),
        productions: st.productions.map((p) => (p.id === id ? { ...p, liked, likes: p.likes + (liked ? 1 : -1) } : p)),
      }
    })
  }, [])

  const setDraft = useCallback((patch: Partial<Draft> | null) => {
    set((st) => ({ ...st, draft: patch === null ? null : { ...(st.draft ?? { kind: 'desenho', title: '', desc: '', share: true }), ...patch } }))
  }, [])

  const publish = useCallback(() => {
    set((st) => {
      if (!st.draft) return st
      const d = st.draft
      const id = `me-${Date.now()}`
      const p: Production = {
        id,
        author: 'Você',
        avatar: findAvatar(st.avatar).art,
        title: d.title.trim() || 'Minha produção',
        desc: d.desc,
        likes: 0,
        mine: true,
        shared: d.share,
        kind: d.kind,
        image: d.image,
        text: d.text,
        audio: d.audio,
        createdAt: Date.now(),
      }
      return { ...st, productions: [p, ...st.productions], lastPublished: id }
    })
  }, [])

  const audioTap = useCallback(() => set((st) => ({ ...st, audioTaps: st.audioTaps + 1 })), [])

  const actions = useMemo(
    () => ({ go, replace, back, backTo, unlock, dismissAchievement, markSeen, answer, completeLevel, clearPendingUnlock, setAvatar, updateTask, completeTask, toggleLike, setDraft, publish, audioTap, toast, confetti }),
    [go, replace, back, backTo, unlock, dismissAchievement, markSeen, answer, completeLevel, clearPendingUnlock, setAvatar, updateTask, completeTask, toggleLike, setDraft, publish, audioTap, toast, confetti],
  )

  return { state: s, toasts, bursts, ...actions }
}

type Ctx = ReturnType<typeof useAlfaState>
const AlfaCtx = createContext<Ctx | null>(null)

export function AlfaProvider({ start, children }: { start: ScreenId; children: (ctx: Ctx) => ReactNode }) {
  const ctx = useAlfaState(start)
  return <AlfaCtx.Provider value={ctx}>{children(ctx)}</AlfaCtx.Provider>
}

export function useAlfa() {
  const c = useContext(AlfaCtx)
  if (!c) throw new Error('useAlfa fora do AlfaProvider')
  return c
}

export const screenKey = (s: Screen) => `${s.id}:${JSON.stringify(s.params ?? {})}`

/** estado de cada trilha na Home */
export type TrailStatus = 'done' | 'current' | 'locked'
export function trailStatus(progress: State['progress'], index: number): TrailStatus {
  const t = TRAILS[index]
  if (progress[t.id] >= t.levels.length) return 'done'
  if (index === 0) return 'current'
  const prev = TRAILS[index - 1]
  return progress[prev.id] >= prev.levels.length ? 'current' : 'locked'
}
