import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { Check, ChevronDown, ChevronLeft, ChevronRight, CircleAlert, Info, Star, X } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { DISC, type Icone } from '../data'
import { useFx } from '../store'

/* ---------------- botão ---------------- */
type BtnProps = {
  children?: ReactNode
  variante?: 'primario' | 'contorno' | 'fantasma' | 'link' | 'suave'
  icone?: ReactNode
  iconeDir?: ReactNode
  grande?: boolean
  pequeno?: boolean
  bloco?: boolean
  className?: string
  disabled?: boolean
  title?: string
  onClick?: () => void
}
export function Btn({ children, variante = 'primario', icone, iconeDir, grande, pequeno, bloco, className = '', ...p }: BtnProps) {
  return (
    <motion.button
      whileTap={p.disabled ? undefined : { scale: 0.97 }}
      className={`fx-btn fx-btn--${variante} ${grande ? 'fx-btn--g' : ''} ${pequeno ? 'fx-btn--p' : ''} ${bloco ? 'fx-btn--bloco' : ''} ${className}`}
      {...p}
    >
      {icone}
      {children && <span>{children}</span>}
      {iconeDir}
    </motion.button>
  )
}

/* ---------------- ícone da funcionalidade Flashcards (menu lateral) ---------------- */
export function IconeFlashcards({ size = 24, strokeWidth = 2, className }: { size?: number; strokeWidth?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M8.2 5.2 4.4 6.3a1.6 1.6 0 0 0-1.1 2l2.6 9a1.6 1.6 0 0 0 2 1.1l1.6-.5" />
      <path d="m15.8 5.2 3.8 1.1a1.6 1.6 0 0 1 1.1 2l-2.6 9a1.6 1.6 0 0 1-2 1.1l-1.6-.5" />
      <rect x="7.5" y="3.5" width="9" height="15" rx="1.8" />
      <path d="m12 8 .9 1.8 2 .3-1.45 1.4.35 2-1.8-.95-1.8.95.35-2L9.1 10.1l2-.3z" strokeWidth={1.4} />
    </svg>
  )
}

/* ---------------- ícone da disciplina num quadradinho ---------------- */
export function Quadrado({ icone: I, tam = 'm', cor, className = '' }: { icone: Icone; tam?: 'p' | 'm' | 'g' | 'gg'; cor?: string; className?: string }) {
  const px = { p: 17, m: 21, g: 28, gg: 34 }[tam]
  return (
    <span className={`fx-quad fx-quad--${tam} ${className}`} style={cor ? ({ '--c': cor } as React.CSSProperties) : undefined}>
      <I size={px} strokeWidth={tam === 'p' ? 2.1 : 1.9} />
    </span>
  )
}

/** chip colorido da disciplina (favoritos) */
export function ChipDisc({ disc }: { disc: string }) {
  const d = DISC[disc]
  return (
    <span className="fx-chipdisc" style={{ '--c': d.cor } as React.CSSProperties}>
      <span className="fx-chipdisc__ic">
        <d.icone size={13} strokeWidth={2.4} />
      </span>
      {d.nome}
    </span>
  )
}

/* ---------------- estrela de favorito ---------------- */
export function Estrela({ on, onClick, tam = 24, rotulo }: { on: boolean; onClick?: () => void; tam?: number; rotulo?: string }) {
  return (
    <motion.button
      className={`fx-estrela ${on ? 'is-on' : ''}`}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      whileTap={{ scale: 0.8 }}
      aria-pressed={on}
      aria-label={rotulo ?? (on ? 'Remover dos favoritos' : 'Favoritar')}
      title={rotulo ?? (on ? 'Remover dos favoritos' : 'Favoritar')}
    >
      <motion.span key={String(on)} initial={on ? { scale: 0.3, rotate: -40 } : false} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 14 }}>
        <Star size={tam} strokeWidth={on ? 0 : 1.8} fill={on ? 'currentColor' : 'none'} />
      </motion.span>
      <AnimatePresence>
        {on && (
          <motion.span className="fx-estrela__brilho" initial={{ scale: 0.4, opacity: 0.9 }} animate={{ scale: 2.2, opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} />
        )}
      </AnimatePresence>
    </motion.button>
  )
}

/* ---------------- barra de progresso ---------------- */
export function Barra({ valor, className = '', fina }: { valor: number; className?: string; fina?: boolean }) {
  return (
    <span className={`fx-barra ${fina ? 'fx-barra--fina' : ''} ${className}`} role="progressbar" aria-valuenow={Math.round(valor)} aria-valuemin={0} aria-valuemax={100}>
      <motion.span className="fx-barra__fill" initial={false} animate={{ width: `${Math.max(0, Math.min(100, valor))}%` }} transition={{ type: 'spring', stiffness: 120, damping: 22 }} />
    </span>
  )
}

/** número que conta até o valor */
export function Num({ v, sufixo = '' }: { v: number; sufixo?: string }) {
  const mv = useMotionValue(0)
  const r = useTransform(mv, (x) => `${Math.round(x)}${sufixo}`)
  useEffect(() => {
    const c = animate(mv, v, { duration: 0.9, ease: [0.2, 0.8, 0.2, 1] })
    return () => c.stop()
  }, [v, mv])
  return <motion.span>{r}</motion.span>
}

/* ---------------- migalhas ---------------- */
export function Migalhas({ itens, onVoltar }: { itens: { texto: string; onClick?: () => void }[]; onVoltar: () => void }) {
  return (
    <nav className="fx-migalhas" aria-label="Você está em">
      <button className="fx-migalhas__voltar" onClick={onVoltar} aria-label="Voltar">
        <ChevronLeft size={17} />
      </button>
      {itens.map((m, i) => (
        <span key={i} className="fx-migalhas__item">
          {i > 0 && <ChevronRight size={16} className="fx-migalhas__sep" />}
          {m.onClick ? <button onClick={m.onClick}>{m.texto}</button> : <span>{m.texto}</span>}
        </span>
      ))}
    </nav>
  )
}

/** “< Criar flashcards” (cabeçalho do assistente) */
export function Voltar({ texto, onClick }: { texto: string; onClick: () => void }) {
  return (
    <div className="fx-voltar">
      <button className="fx-migalhas__voltar fx-migalhas__voltar--caixa" onClick={onClick} aria-label="Voltar">
        <ChevronLeft size={17} />
      </button>
      <span>{texto}</span>
    </div>
  )
}

/* ---------------- menu ⋮ e listas suspensas (portal, posição fixa) ---------------- */
function usePosicao(aberto: boolean, ancora: React.RefObject<HTMLElement | null>, alinhar: 'esq' | 'dir', fechar: () => void) {
  const [pos, setPos] = useState<{ top?: number; bottom?: number; left?: number; right?: number; minWidth: number; acima: boolean } | null>(null)
  useLayoutEffect(() => {
    if (!aberto) return
    const calc = () => {
      const r = ancora.current?.getBoundingClientRect()
      if (!r) return
      const acima = r.bottom + 300 > window.innerHeight && r.top > 320
      setPos({
        ...(acima ? { bottom: window.innerHeight - r.top + 6 } : { top: r.bottom + 6 }),
        ...(alinhar === 'dir' ? { right: Math.max(8, window.innerWidth - r.right) } : { left: Math.min(r.left, window.innerWidth - 248) }),
        minWidth: r.width,
        acima,
      })
    }
    calc()
    const rolar = (e: Event) => !(e.target as HTMLElement)?.closest?.('.fx-pop') && fechar()
    window.addEventListener('resize', fechar)
    window.addEventListener('scroll', rolar, true)
    return () => {
      window.removeEventListener('resize', fechar)
      window.removeEventListener('scroll', rolar, true)
    }
  }, [aberto, ancora, alinhar, fechar])
  return pos
}

export function Pop({ aberto, ancora, alinhar = 'dir', onFechar, children, className = '' }: { aberto: boolean; ancora: React.RefObject<HTMLElement | null>; alinhar?: 'esq' | 'dir'; onFechar: () => void; children: ReactNode; className?: string }) {
  const pos = usePosicao(aberto, ancora, alinhar, onFechar)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!aberto) return
    const fora = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && !ancora.current?.contains(e.target as Node) && onFechar()
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onFechar()
    document.addEventListener('mousedown', fora)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', fora)
      document.removeEventListener('keydown', esc)
    }
  }, [aberto, ancora, onFechar])
  const raiz = document.querySelector('.fx') ?? document.body
  return createPortal(
    <AnimatePresence>
      {aberto && pos && (
        <motion.div
          ref={ref}
          className={`fx-pop ${className}`}
          style={{ top: pos.top, bottom: pos.bottom, left: pos.left, right: pos.right, minWidth: pos.minWidth, transformOrigin: pos.acima ? 'bottom' : 'top' }}
          initial={{ opacity: 0, scale: 0.96, y: pos.acima ? 4 : -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.1 } }}
          transition={{ duration: 0.14 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    raiz,
  )
}

export type ItemMenu = { texto: string; icone?: ReactNode; fn: () => void; perigo?: boolean }
export function Menu({ itens, rotulo = 'Mais opções', className = '', icone }: { itens: ItemMenu[]; rotulo?: string; className?: string; icone: ReactNode }) {
  const [aberto, setAberto] = useState(false)
  const ref = useRef<HTMLButtonElement>(null)
  return (
    <>
      <button
        ref={ref}
        className={`fx-iconbtn ${className} ${aberto ? 'is-on' : ''}`}
        onClick={(e) => {
          e.stopPropagation()
          setAberto((a) => !a)
        }}
        aria-label={rotulo}
        aria-expanded={aberto}
      >
        {icone}
      </button>
      <Pop aberto={aberto} ancora={ref} onFechar={() => setAberto(false)} className="fx-pop--menu">
        {itens.map((i) => (
          <button
            key={i.texto}
            className={i.perigo ? 'is-perigo' : ''}
            onClick={(e) => {
              e.stopPropagation()
              setAberto(false)
              i.fn()
            }}
          >
            {i.icone}
            {i.texto}
          </button>
        ))}
      </Pop>
    </>
  )
}

export function Select<T extends string>({ valor, opcoes, onChange, icone, className = '', rotulo }: { valor: T; opcoes: { valor: T; texto: string }[]; onChange: (v: T) => void; icone?: ReactNode; className?: string; rotulo?: string }) {
  const [aberto, setAberto] = useState(false)
  const ref = useRef<HTMLButtonElement>(null)
  const atual = opcoes.find((o) => o.valor === valor)
  return (
    <>
      <button ref={ref} className={`fx-select ${aberto ? 'is-aberto' : ''} ${className}`} onClick={() => setAberto((a) => !a)} aria-haspopup="listbox" aria-expanded={aberto} aria-label={rotulo}>
        {icone}
        <span className="fx-select__txt">{atual?.texto}</span>
        <ChevronDown size={18} className="fx-select__seta" />
      </button>
      <Pop aberto={aberto} ancora={ref} alinhar="esq" onFechar={() => setAberto(false)} className="fx-pop--lista">
        {opcoes.map((o) => (
          <button
            key={o.valor}
            role="option"
            aria-selected={o.valor === valor}
            className={o.valor === valor ? 'is-on' : ''}
            onClick={() => {
              onChange(o.valor)
              setAberto(false)
            }}
          >
            <span>{o.texto}</span>
            {o.valor === valor && <Check size={16} />}
          </button>
        ))}
      </Pop>
    </>
  )
}

/* ---------------- modal ---------------- */
export function Modal({ aberto, onFechar, titulo, children, rodape, largura = 460 }: { aberto: boolean; onFechar: () => void; titulo: string; children: ReactNode; rodape?: ReactNode; largura?: number }) {
  useEffect(() => {
    if (!aberto) return
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onFechar()
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [aberto, onFechar])
  return (
    <AnimatePresence>
      {aberto && (
        <motion.div className="fx-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && onFechar()}>
          <motion.div className="fx-modal__caixa" style={{ maxWidth: largura }} role="dialog" aria-modal aria-label={titulo} initial={{ y: 24, scale: 0.97, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 12, opacity: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 30 }}>
            <header>
              <h3>{titulo}</h3>
              <button className="fx-iconbtn" onClick={onFechar} aria-label="Fechar">
                <X size={17} />
              </button>
            </header>
            <div className="fx-modal__corpo">{children}</div>
            {rodape && <footer>{rodape}</footer>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ---------------- toasts ---------------- */
export function Toasts() {
  const { toasts, fecharToast } = useFx()
  return (
    <div className="fx-toasts" aria-live="polite">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div key={t.id} layout className={`fx-toast fx-toast--${t.tipo}`} initial={{ opacity: 0, y: 24, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: 40, transition: { duration: 0.18 } }} transition={{ type: 'spring', stiffness: 420, damping: 32 }}>
            <span className="fx-toast__ic">{t.tipo === 'erro' ? <CircleAlert size={18} /> : t.tipo === 'info' ? <Info size={18} /> : <Check size={18} strokeWidth={3} />}</span>
            <span className="fx-toast__txt">{t.texto}</span>
            {t.acao && (
              <button
                className="fx-toast__acao"
                onClick={() => {
                  t.acao!.fn()
                  fecharToast(t.id)
                }}
              >
                {t.acao.rotulo}
              </button>
            )}
            <button className="fx-toast__x" onClick={() => fecharToast(t.id)} aria-label="Fechar aviso">
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

/* ---------------- ilustração do grupo ---------------- */
/** ilustração 3D sobre um “pratinho” (estilo dos cards de curso da GenieX) */
export function ArteGrupo({ disc, children }: { disc: string; children?: ReactNode }) {
  const d = DISC[disc]
  return (
    <div className="fx-arte" style={{ '--c': d.cor } as React.CSSProperties}>
      <div className={`fx-arte__cena fx-arte__cena--${disc}`} aria-hidden>
        <span className="fx-arte__prato" />
        {'img' in d.arte ? (
          <img src={d.arte.img} alt="" className="fx-arte__obj" draggable={false} />
        ) : (
          d.arte.emojis.map((e, i) => <img key={e} src={`./3d/${e}.png`} alt="" className={`fx-arte__e fx-arte__e--${i}`} draggable={false} />)
        )}
      </div>
      {children}
    </div>
  )
}

/** texto com **destaques** */
export function Rico({ texto }: { texto: string }) {
  const partes = texto.split(/\*\*(.+?)\*\*/g)
  return (
    <>
      {partes.map((p, i) => (i % 2 ? <strong key={i}>{p}</strong> : <span key={i}>{p}</span>))}
    </>
  )
}
export const semMarcas = (t: string) => t.replace(/\*\*/g, '')

/** brilhos animados em volta das ilustrações (✦ roxos; com `estrelas`, intercala estrelas douradas) */
export function Brilhos({ n = 5, className = '', estrelas, escala = 1 }: { n?: number; className?: string; estrelas?: boolean; escala?: number }) {
  const pos = [
    [4, 22, 22],
    [92, 30, 18],
    [12, 80, 16],
    [88, 80, 22],
    [52, 2, 14],
    [72, 58, 12],
    [0, 52, 14],
    [96, 6, 14],
  ]
  return (
    <span className={`fx-brilhos ${className}`} aria-hidden>
      {pos.slice(0, n).map(([x, y, t], i) => {
        const ouro = estrelas && i % 2 === 0
        return (
          <motion.i
            key={i}
            style={{ left: `${x}%`, top: `${y}%`, width: (ouro ? t * 1.5 : t) * escala, height: (ouro ? t * 1.5 : t) * escala }}
            animate={{ scale: [0.65, 1.15, 0.65], opacity: [0.45, 1, 0.45], rotate: ouro ? [-12, 12, -12] : [0, 25, 0] }}
            transition={{ duration: 2.2 + i * 0.35, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
          >
            <svg viewBox="0 0 24 24" width="100%" height="100%">
              {ouro ? (
                <path d="m12 2 2.9 6.2 6.8.8-5 4.6 1.3 6.7L12 17l-6 3.3 1.3-6.7-5-4.6 6.8-.8z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" strokeLinejoin="round" />
              ) : (
                <path d="M12 1c.6 5.6 4.4 9.4 11 11-6.6 1.6-10.4 5.4-11 11-.6-5.6-4.4-9.4-11-11 6.6-1.6 10.4-5.4 11-11z" fill="currentColor" />
              )}
            </svg>
          </motion.i>
        )
      })}
    </span>
  )
}
