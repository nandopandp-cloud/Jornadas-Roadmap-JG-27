import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { Check, ChevronDown, CircleAlert, Gem, Info, X } from 'lucide-react'
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { RARIDADES, fmt, type Item, type Raridade } from '../data'
import { useLoja } from '../store'

/* ---------------- botão ---------------- */
type BtnProps = {
  children?: ReactNode
  variante?: 'primario' | 'contorno' | 'fantasma' | 'roxo'
  icone?: ReactNode
  iconeDir?: ReactNode
  tam?: 'p' | 'm' | 'g'
  bloco?: boolean
  className?: string
  disabled?: boolean
  title?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}
export function Btn({ children, variante = 'primario', icone, iconeDir, tam = 'm', bloco, className = '', ...p }: BtnProps) {
  return (
    <motion.button whileTap={p.disabled ? undefined : { scale: 0.96 }} className={`lj-btn lj-btn--${variante} lj-btn--${tam} ${bloco ? 'lj-btn--bloco' : ''} ${className}`} {...p}>
      {icone}
      {children && <span>{children}</span>}
      {iconeDir}
    </motion.button>
  )
}

/* ---------------- pontos ---------------- */
export function Pontos({ v, tam = 'm', className = '' }: { v: number; tam?: 'p' | 'm' | 'g' | 'gg'; className?: string }) {
  return (
    <span className={`lj-pts lj-pts--${tam} ${className}`}>
      <img src="./loja/gema.webp" alt="" />
      <strong>{fmt(v)}</strong>
      <small>pts</small>
    </span>
  )
}

/** número que anima até o valor (contador do saldo) */
export function Contador({ v }: { v: number }) {
  const mv = useMotionValue(v)
  const txt = useTransform(mv, (x) => fmt(Math.round(x)))
  useEffect(() => {
    const c = animate(mv, v, { duration: 1.1, ease: [0.2, 0.8, 0.2, 1] })
    return () => c.stop()
  }, [v, mv])
  return <motion.span>{txt}</motion.span>
}

/* ---------------- selo de raridade ---------------- */
export function Selo({ r, tam = 'p' }: { r: Raridade; tam?: 'p' | 'm' }) {
  return (
    <span className={`lj-selo lj-selo--${r} lj-selo--${tam}`}>
      <Gem size={tam === 'm' ? 17 : 13} strokeWidth={2.2} />
      {RARIDADES[r].nome}
    </span>
  )
}
export function IconeRaridade({ r, size = 18 }: { r: Raridade | 'todos'; size?: number }) {
  if (r === 'todos') return <span className="lj-ic-todos">✦</span>
  return <Gem size={size} strokeWidth={2.2} className={`lj-ic-rar lj-ic-rar--${r}`} />
}

/* ---------------- arte de um item ---------------- */
export function ItemArte({ item, className = '', estrelas }: { item: Item; className?: string; estrelas?: boolean }) {
  return (
    <div className={`lj-arte ${item.foto ? 'is-foto' : ''} lj-arte--${item.cat} ${className}`} style={{ '--fundo': item.fundo } as React.CSSProperties}>
      {estrelas && !item.foto && <Estrelas />}
      <img src={item.img} alt="" draggable={false} style={item.filtro ? { filter: item.filtro } : undefined} />
    </div>
  )
}

export function Estrelas({ n = 6, className = '' }: { n?: number; className?: string }) {
  const pos = [
    [8, 18, 14],
    [86, 12, 18],
    [16, 72, 10],
    [90, 64, 12],
    [48, 8, 9],
    [70, 84, 10],
  ]
  return (
    <span className={`lj-estrelas ${className}`} aria-hidden>
      {pos.slice(0, n).map(([x, y, t], i) => (
        <motion.i
          key={i}
          style={{ left: `${x}%`, top: `${y}%`, width: t, height: t }}
          animate={{ scale: [0.6, 1.15, 0.6], opacity: [0.4, 1, 0.4], rotate: [0, 25, 0] }}
          transition={{ duration: 2.2 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.25 }}
        >
          <svg viewBox="0 0 24 24" width="100%" height="100%">
            <path d="M12 1c.6 5.6 4.4 9.4 11 11-6.6 1.6-10.4 5.4-11 11-.6-5.6-4.4-9.4-11-11 6.6-1.6 10.4-5.4 11-11z" fill="currentColor" />
          </svg>
        </motion.i>
      ))}
    </span>
  )
}

/* ---------------- listas suspensas (portal, posição fixa) ---------------- */
export function Pop({ aberto, ancora, alinhar = 'esq', onFechar, children, className = '' }: { aberto: boolean; ancora: React.RefObject<HTMLElement | null>; alinhar?: 'esq' | 'dir'; onFechar: () => void; children: ReactNode; className?: string }) {
  const [pos, setPos] = useState<{ top: number; left?: number; right?: number; minWidth: number } | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    if (!aberto) return
    const r = ancora.current?.getBoundingClientRect()
    if (r) setPos({ top: r.bottom + 8, ...(alinhar === 'dir' ? { right: Math.max(8, window.innerWidth - r.right) } : { left: Math.min(r.left, window.innerWidth - 260) }), minWidth: r.width })
    const fechar = (e: Event) => !(e.target as HTMLElement)?.closest?.('.lj-pop') && onFechar()
    window.addEventListener('scroll', fechar, true)
    window.addEventListener('resize', onFechar)
    return () => {
      window.removeEventListener('scroll', fechar, true)
      window.removeEventListener('resize', onFechar)
    }
  }, [aberto, ancora, alinhar, onFechar])
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
  return createPortal(
    <AnimatePresence>
      {aberto && pos && (
        <motion.div
          ref={ref}
          className={`lj-pop ${className}`}
          style={{ top: pos.top, left: pos.left, right: pos.right, minWidth: pos.minWidth }}
          initial={{ opacity: 0, y: -6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.1 } }}
          transition={{ duration: 0.16 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    document.querySelector('.lj') ?? document.body,
  )
}

export function Select<T extends string>({ valor, opcoes, onChange, icone, className = '', rotulo }: { valor: T; opcoes: { valor: T; texto: string }[]; onChange: (v: T) => void; icone?: ReactNode; className?: string; rotulo?: string }) {
  const [aberto, setAberto] = useState(false)
  const ref = useRef<HTMLButtonElement>(null)
  const atual = opcoes.find((o) => o.valor === valor)
  return (
    <>
      <button ref={ref} className={`lj-select ${aberto ? 'is-aberto' : ''} ${className}`} onClick={() => setAberto((a) => !a)} aria-haspopup="listbox" aria-expanded={aberto} aria-label={rotulo}>
        {icone}
        <span className="lj-select__txt">{atual?.texto}</span>
        <ChevronDown size={18} className="lj-select__seta" />
      </button>
      <Pop aberto={aberto} ancora={ref} onFechar={() => setAberto(false)} className="lj-pop--lista">
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
export function Modal({ aberto, onFechar, children, largura = 480, className = '', semFechar }: { aberto: boolean; onFechar: () => void; children: ReactNode; largura?: number; className?: string; semFechar?: boolean }) {
  useEffect(() => {
    if (!aberto || semFechar) return
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onFechar()
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [aberto, onFechar, semFechar])
  return createPortal(
    <AnimatePresence>
      {aberto && (
        <motion.div className="lj-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => !semFechar && e.target === e.currentTarget && onFechar()}>
          <motion.div
            className={`lj-modal__caixa ${className}`}
            style={{ maxWidth: largura }}
            role="dialog"
            aria-modal
            initial={{ y: 30, scale: 0.94, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 16, scale: 0.97, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          >
            {!semFechar && (
              <button className="lj-iconbtn lj-modal__x" onClick={onFechar} aria-label="Fechar">
                <X size={17} />
              </button>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.querySelector('.lj') ?? document.body,
  )
}

/* ---------------- toasts ---------------- */
export function Toasts() {
  const { toasts, fecharToast } = useLoja()
  return (
    <div className="lj-toasts" aria-live="polite">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div key={t.id} layout className={`lj-toast lj-toast--${t.tipo}`} initial={{ opacity: 0, y: 24, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: 40, transition: { duration: 0.18 } }} transition={{ type: 'spring', stiffness: 420, damping: 32 }}>
            <span className="lj-toast__ic">{t.tipo === 'erro' ? <CircleAlert size={18} /> : t.tipo === 'info' ? <Info size={18} /> : <Check size={18} strokeWidth={3} />}</span>
            <span className="lj-toast__txt">{t.texto}</span>
            {t.acao && (
              <button
                className="lj-toast__acao"
                onClick={() => {
                  t.acao!.fn()
                  fecharToast(t.id)
                }}
              >
                {t.acao.rotulo}
              </button>
            )}
            <button className="lj-toast__x" onClick={() => fecharToast(t.id)} aria-label="Fechar aviso">
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

/* ---------------- confete ---------------- */
export function Confete({ n = 80 }: { n?: number }) {
  const cores = ['#029e8f', '#7c3aed', '#facc15', '#f97316', '#ec4899', '#22c55e', '#38bdf8']
  const pecas = useMemo(() => Array.from({ length: n }).map((_, i) => ({ i, x: Math.random() * 100, d: Math.random() * 0.4, r: Math.random() * 540 - 270, c: cores[i % cores.length], w: 6 + Math.random() * 7, dur: 1.8 + Math.random() * 1.4 })), [n]) // eslint-disable-line react-hooks/exhaustive-deps
  return createPortal(
    <div className="lj-confete" aria-hidden>
      {pecas.map((p) => (
        <motion.i key={p.i} style={{ left: `${p.x}%`, background: p.c, width: p.w, height: p.w * 0.45 }} initial={{ y: -40, rotate: 0, opacity: 1 }} animate={{ y: '105vh', rotate: p.r, opacity: [1, 1, 0] }} transition={{ duration: p.dur, delay: p.d, ease: 'easeIn' }} />
      ))}
    </div>,
    document.body,
  )
}
