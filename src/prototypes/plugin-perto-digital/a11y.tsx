// Estado dos recursos de acessibilidade do plugin + ponteiro compartilhado (mouse, toque ou navegação por face).
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

export type Ajustes = {
  mascara: boolean
  guia: boolean
  leitor: boolean
  legivel: boolean
  /** 0 = 100%, 1 = 112%, 2 = 125%, 3 = 137%, 4 = 150% */
  fonte: number
  espacamento: boolean
  contraste: boolean
  cinza: boolean
  destacar: boolean
  cursor: boolean
  pausar: boolean
  libras: boolean
  face: boolean
}

export const PADRAO: Ajustes = {
  mascara: false,
  guia: false,
  leitor: false,
  legivel: false,
  fonte: 0,
  espacamento: false,
  contraste: false,
  cinza: false,
  destacar: false,
  cursor: false,
  pausar: false,
  libras: false,
  face: false,
}

export const ESCALAS = [1, 1.125, 1.25, 1.375, 1.5]

export type PerfilId = 'foco' | 'leitura' | 'ritmo'
export const PERFIS: Record<PerfilId, Partial<Ajustes>> = {
  foco: { mascara: true, guia: true },
  leitura: { fonte: 2, espacamento: true, legivel: true },
  ritmo: { pausar: true, destacar: true, cursor: true },
}
export const perfilAtivo = (a: Ajustes, p: PerfilId) =>
  Object.entries(PERFIS[p]).every(([k, v]) => a[k as keyof Ajustes] === v)

/* ---------- ponteiro compartilhado: a máscara e o guia seguem o mouse, o toque ou o cursor da face ---------- */
type Pt = { x: number; y: number }
const ouvintes = new Set<(p: Pt) => void>()
let ultimo: Pt = { x: typeof window !== 'undefined' ? window.innerWidth / 2 : 600, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 400 }
let fontePonteiro: 'mouse' | 'face' = 'mouse'
export const ponteiro = {
  get: () => ultimo,
  set(p: Pt, origem: 'mouse' | 'face' = 'mouse') {
    if (origem === 'mouse' && fontePonteiro === 'face') return
    ultimo = p
    ouvintes.forEach((f) => f(p))
  },
  usarFace(on: boolean) {
    fontePonteiro = on ? 'face' : 'mouse'
  },
  ouvir(f: (p: Pt) => void) {
    ouvintes.add(f)
    return () => void ouvintes.delete(f)
  },
}

/* ---------- avisos (toasts) ---------- */
export type Aviso = { id: number; texto: string; tom?: 'ok' | 'info' | 'erro' }

type Ctx = {
  a: Ajustes
  set: (p: Partial<Ajustes>) => void
  alternar: (k: keyof Ajustes) => void
  perfil: (p: PerfilId) => void
  restaurar: () => void
  painel: boolean
  abrirPainel: (on?: boolean) => void
  /** recursos ligados pelo modal (mostra os atalhos Libras e Navegação por face) */
  ativados: boolean
  setAtivados: (on: boolean) => void
  avisos: Aviso[]
  avisar: (texto: string, tom?: Aviso['tom']) => void
  falar: (texto: string) => void
}

const C = createContext<Ctx | null>(null)
export const useA11y = () => {
  const c = useContext(C)
  if (!c) throw new Error('useA11y fora do provedor')
  return c
}

const NOMES: Partial<Record<keyof Ajustes, string>> = {
  mascara: 'Máscara de leitura',
  guia: 'Guia de leitura',
  leitor: 'Leitor de texto',
  legivel: 'Fonte legível',
  espacamento: 'Espaçamento do texto',
  contraste: 'Alto contraste',
  cinza: 'Escala de cinza',
  destacar: 'Destaque de links e botões',
  cursor: 'Cursor ampliado',
  pausar: 'Animações pausadas',
}

export function A11yProvider({ children, inicial, ativadosInicial }: { children: ReactNode; inicial?: Partial<Ajustes>; ativadosInicial?: boolean }) {
  const [a, setA] = useState<Ajustes>({ ...PADRAO, ...inicial })
  const [painel, setPainel] = useState(false)
  const [ativados, setAtivados] = useState(!!ativadosInicial)
  const [avisos, setAvisos] = useState<Aviso[]>([])
  const seq = useRef(0)

  const avisar = useCallback((texto: string, tom: Aviso['tom'] = 'ok') => {
    const id = ++seq.current
    setAvisos((l) => [...l.slice(-2), { id, texto, tom }])
    window.setTimeout(() => setAvisos((l) => l.filter((x) => x.id !== id)), 3800)
  }, [])

  const set = useCallback((p: Partial<Ajustes>) => setA((x) => ({ ...x, ...p })), [])
  const atual = useRef(a)
  atual.current = a
  const alternar = useCallback(
    (k: keyof Ajustes) => {
      const v = !atual.current[k]
      const nome = NOMES[k]
      if (nome) avisar(`${nome} ${v ? 'ativado' : 'desativado'}`, v ? 'ok' : 'info')
      setA((x) => ({ ...x, [k]: v }))
    },
    [avisar],
  )
  const perfil = useCallback(
    (p: PerfilId) =>
      setA((x) => {
        const on = perfilAtivo(x, p)
        const reverso = Object.fromEntries(Object.keys(PERFIS[p]).map((k) => [k, PADRAO[k as keyof Ajustes]]))
        return { ...x, ...(on ? reverso : PERFIS[p]) }
      }),
    [],
  )
  const restaurar = useCallback(() => {
    setA({ ...PADRAO })
    avisar('Configurações restauradas para o padrão', 'info')
  }, [avisar])

  const falar = useCallback((texto: string) => {
    if (!('speechSynthesis' in window)) return
    const s = window.speechSynthesis
    s.cancel()
    const u = new SpeechSynthesisUtterance(texto)
    u.lang = 'pt-BR'
    u.rate = 1
    const voz = s.getVoices().find((v) => v.lang?.toLowerCase().startsWith('pt'))
    if (voz) u.voice = voz
    s.speak(u)
  }, [])

  // tamanho do texto: toda a interface é medida em rem
  useEffect(() => {
    document.documentElement.style.fontSize = `${16 * ESCALAS[a.fonte]}px`
  }, [a.fonte])

  // o leitor para de falar quando é desligado
  useEffect(() => {
    if (!a.leitor && 'speechSynthesis' in window) window.speechSynthesis.cancel()
  }, [a.leitor])

  const abrirPainel = useCallback((on = true) => setPainel(on), [])

  const v = useMemo<Ctx>(
    () => ({ a, set, alternar, perfil, restaurar, painel, abrirPainel, ativados, setAtivados, avisos, avisar, falar }),
    [a, set, alternar, perfil, restaurar, painel, abrirPainel, ativados, avisos, avisar, falar],
  )
  return <C.Provider value={v}>{children}</C.Provider>
}

/** classes do contêiner raiz a partir dos ajustes */
export function classesDe(a: Ajustes) {
  return [
    a.contraste && 'pd--contraste',
    a.cinza && 'pd--cinza',
    a.espacamento && 'pd--espaco',
    a.legivel && 'pd--legivel',
    a.destacar && 'pd--destacar',
    a.cursor && 'pd--cursor',
    a.pausar && 'pd--pausar',
    a.leitor && 'pd--leitor',
  ]
    .filter(Boolean)
    .join(' ')
}
