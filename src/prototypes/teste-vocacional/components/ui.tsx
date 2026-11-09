import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { Check, ChevronDown, ChevronLeft, CircleAlert, Info, Star, X } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useTv } from '../store'

/* ---------------- botão ---------------- */
type BtnProps = {
  children?: ReactNode
  variante?: 'primario' | 'contorno' | 'fantasma' | 'suave' | 'branco'
  icone?: ReactNode
  iconeDir?: ReactNode
  grande?: boolean
  pequeno?: boolean
  bloco?: boolean
  className?: string
  disabled?: boolean
  title?: string
  'aria-label'?: string
  'aria-pressed'?: boolean
  onClick?: () => void
}
export function Btn({ children, variante = 'primario', icone, iconeDir, grande, pequeno, bloco, className = '', ...p }: BtnProps) {
  return (
    <motion.button
      whileTap={p.disabled ? undefined : { scale: 0.97 }}
      className={`tv-btn tv-btn--${variante} ${grande ? 'tv-btn--g' : ''} ${pequeno ? 'tv-btn--p' : ''} ${bloco ? 'tv-btn--bloco' : ''} ${className}`}
      {...p}
    >
      {icone}
      {children && <span>{children}</span>}
      {iconeDir}
    </motion.button>
  )
}

/* ---------------- barra de progresso ---------------- */
export function Barra({ valor, className = '', cor, rotulo }: { valor: number; className?: string; cor?: string; rotulo?: string }) {
  return (
    <span className={`tv-barra ${className}`} role="progressbar" aria-valuenow={Math.round(valor)} aria-valuemin={0} aria-valuemax={100} aria-label={rotulo}>
      <motion.span className="tv-barra__fill" style={cor ? { background: cor } : undefined} initial={false} animate={{ width: `${Math.max(0, Math.min(100, valor))}%` }} transition={{ type: 'spring', stiffness: 120, damping: 22 }} />
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

/** “< Texto” (cabeçalho com voltar) */
export function Voltar({ texto, onClick, children }: { texto: string; onClick: () => void; children?: ReactNode }) {
  return (
    <div className="tv-voltar">
      <button className="tv-voltar__btn" onClick={onClick} aria-label="Voltar">
        <ChevronLeft size={17} />
      </button>
      <span>{texto}</span>
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

/* ---------------- estrela de salvar ---------------- */
export function Estrela({ on, onClick, tam = 20, rotulo }: { on: boolean; onClick?: () => void; tam?: number; rotulo?: string }) {
  const r = rotulo ?? (on ? 'Remover de Minhas carreiras' : 'Salvar em Minhas carreiras')
  return (
    <motion.button
      className={`tv-estrela ${on ? 'is-on' : ''}`}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      whileTap={{ scale: 0.8 }}
      aria-pressed={on}
      aria-label={r}
      title={r}
    >
      <motion.span key={String(on)} initial={on ? { scale: 0.3, rotate: -40 } : false} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 14 }}>
        <Star size={tam} strokeWidth={on ? 0 : 1.8} fill={on ? 'currentColor' : 'none'} />
      </motion.span>
      <AnimatePresence initial={false}>{on && <motion.span className="tv-estrela__brilho" initial={{ scale: 0.4, opacity: 0.9 }} animate={{ scale: 2.2, opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} />}</AnimatePresence>
    </motion.button>
  )
}

/* ---------------- listas suspensas (portal, posição fixa) ---------------- */
function usePosicao(aberto: boolean, ancora: React.RefObject<HTMLElement | null>, fechar: () => void) {
  const [pos, setPos] = useState<{ top?: number; bottom?: number; left: number; minWidth: number; acima: boolean } | null>(null)
  useLayoutEffect(() => {
    if (!aberto) return
    const calc = () => {
      const r = ancora.current?.getBoundingClientRect()
      if (!r) return
      const acima = r.bottom + 300 > window.innerHeight && r.top > 320
      setPos({ ...(acima ? { bottom: window.innerHeight - r.top + 6 } : { top: r.bottom + 6 }), left: Math.max(8, Math.min(r.left, window.innerWidth - 280)), minWidth: r.width, acima })
    }
    calc()
    const rolar = (e: Event) => !(e.target as HTMLElement)?.closest?.('.tv-pop') && fechar()
    window.addEventListener('resize', fechar)
    window.addEventListener('scroll', rolar, true)
    return () => {
      window.removeEventListener('resize', fechar)
      window.removeEventListener('scroll', rolar, true)
    }
  }, [aberto, ancora, fechar])
  return pos
}

export function Select<T extends string>({ valor, opcoes, onChange, icone, className = '', rotulo, placeholder }: { valor: T | ''; opcoes: { valor: T; texto: string; grupo?: string }[]; onChange: (v: T) => void; icone?: ReactNode; className?: string; rotulo?: string; placeholder?: string }) {
  const [aberto, setAberto] = useState(false)
  const ref = useRef<HTMLButtonElement>(null)
  const pop = useRef<HTMLDivElement>(null)
  const atual = opcoes.find((o) => o.valor === valor)
  const fechar = useRef(() => setAberto(false)).current
  const pos = usePosicao(aberto, ref, fechar)
  useEffect(() => {
    if (!aberto) return
    const fora = (e: MouseEvent) => !pop.current?.contains(e.target as Node) && !ref.current?.contains(e.target as Node) && fechar()
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && fechar()
    document.addEventListener('mousedown', fora)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', fora)
      document.removeEventListener('keydown', esc)
    }
  }, [aberto, fechar])
  const raiz = document.querySelector('.tv') ?? document.body
  let grupoAnt: string | undefined
  return (
    <>
      <button ref={ref} className={`tv-select ${aberto ? 'is-aberto' : ''} ${className}`} onClick={() => setAberto((a) => !a)} aria-haspopup="listbox" aria-expanded={aberto} aria-label={rotulo}>
        {icone}
        <span className={`tv-select__txt ${atual ? '' : 'is-vazio'}`}>{atual?.texto ?? placeholder}</span>
        <ChevronDown size={17} className="tv-select__seta" />
      </button>
      {createPortal(
        <AnimatePresence>
          {aberto && pos && (
            <motion.div
              ref={pop}
              role="listbox"
              className="tv-pop"
              style={{ top: pos.top, bottom: pos.bottom, left: pos.left, minWidth: Math.max(pos.minWidth, 220), transformOrigin: pos.acima ? 'bottom' : 'top' }}
              initial={{ opacity: 0, scale: 0.96, y: pos.acima ? 4 : -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.1 } }}
              transition={{ duration: 0.14 }}
            >
              {opcoes.map((o) => {
                const cab = o.grupo && o.grupo !== grupoAnt ? o.grupo : null
                grupoAnt = o.grupo
                return (
                  <div key={o.valor}>
                    {cab && <p className="tv-pop__grupo">{cab}</p>}
                    <button
                      role="option"
                      aria-selected={o.valor === valor}
                      className={o.valor === valor ? 'is-on' : ''}
                      onClick={() => {
                        onChange(o.valor)
                        setAberto(false)
                      }}
                    >
                      <span>{o.texto}</span>
                      {o.valor === valor && <Check size={15} />}
                    </button>
                  </div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>,
        raiz,
      )}
    </>
  )
}

/* ---------------- modal ---------------- */
export function Modal({ aberto, onFechar, titulo, children, rodape, largura = 480 }: { aberto: boolean; onFechar: () => void; titulo: string; children: ReactNode; rodape?: ReactNode; largura?: number }) {
  useEffect(() => {
    if (!aberto) return
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onFechar()
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [aberto, onFechar])
  return (
    <AnimatePresence>
      {aberto && (
        <motion.div className="tv-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && onFechar()}>
          <motion.div className="tv-modal__caixa" style={{ maxWidth: largura }} role="dialog" aria-modal aria-label={titulo} initial={{ y: 24, scale: 0.97, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 12, opacity: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 30 }}>
            <header>
              <h3>{titulo}</h3>
              <button className="tv-iconbtn" onClick={onFechar} aria-label="Fechar">
                <X size={17} />
              </button>
            </header>
            <div className="tv-modal__corpo">{children}</div>
            {rodape && <footer>{rodape}</footer>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ---------------- toasts ---------------- */
export function Toasts() {
  const { toasts, fecharToast } = useTv()
  return (
    <div className="tv-toasts" aria-live="polite">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div key={t.id} layout className={`tv-toast tv-toast--${t.tipo}`} initial={{ opacity: 0, y: 24, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: 40, transition: { duration: 0.18 } }} transition={{ type: 'spring', stiffness: 420, damping: 32 }}>
            <span className="tv-toast__ic">{t.tipo === 'erro' ? <CircleAlert size={18} /> : t.tipo === 'info' ? <Info size={18} /> : <Check size={18} strokeWidth={3} />}</span>
            <span className="tv-toast__txt">{t.texto}</span>
            {t.acao && (
              <button
                className="tv-toast__acao"
                onClick={() => {
                  t.acao!.fn()
                  fecharToast(t.id)
                }}
              >
                {t.acao.rotulo}
              </button>
            )}
            <button className="tv-toast__x" onClick={() => fecharToast(t.id)} aria-label="Fechar aviso">
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

/** brilhos animados em volta das ilustrações */
export function Brilhos({ n = 5, className = '' }: { n?: number; className?: string }) {
  const pos = [
    [4, 22, 20],
    [92, 30, 16],
    [12, 80, 14],
    [88, 80, 20],
    [52, 2, 13],
    [72, 58, 11],
    [0, 52, 13],
    [96, 6, 13],
  ]
  return (
    <span className={`tv-brilhos ${className}`} aria-hidden>
      {pos.slice(0, n).map(([x, y, t], i) => (
        <motion.i key={i} style={{ left: `${x}%`, top: `${y}%`, width: t, height: t }} animate={{ scale: [0.65, 1.15, 0.65], opacity: [0.45, 1, 0.45], rotate: [0, 25, 0] }} transition={{ duration: 2.2 + i * 0.35, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}>
          <svg viewBox="0 0 24 24" width="100%" height="100%">
            <path d="M12 1c.6 5.6 4.4 9.4 11 11-6.6 1.6-10.4 5.4-11 11-.6-5.6-4.4-9.4-11-11 6.6-1.6 10.4-5.4 11-11z" fill="currentColor" />
          </svg>
        </motion.i>
      ))}
    </span>
  )
}

/** ícone do Teste Vocacional (bússola) para o menu lateral */
export function IconeBussola({ size = 24, strokeWidth = 2, className }: { size?: number; strokeWidth?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.6 8.4-2.1 5.1-5.1 2.1 2.1-5.1z" />
      <path d="M12 3v1.6M12 19.4V21M3 12h1.6M19.4 12H21" strokeWidth={strokeWidth * 0.8} />
    </svg>
  )
}
