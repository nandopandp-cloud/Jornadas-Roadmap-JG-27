import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { Check, ChevronDown, CircleAlert, Heart, Info, X } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useTv } from '../store'

/* ---------------- botão ---------------- */
type BtnProps = {
  children?: ReactNode
  variante?: 'primario' | 'contorno' | 'fantasma' | 'suave' | 'claro'
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

/* ---------------- barra e anel de progresso ---------------- */
export function Barra({ valor, className = '', cor, rotulo }: { valor: number; className?: string; cor?: string; rotulo?: string }) {
  return (
    <span className={`tv-barra ${className}`} role="progressbar" aria-valuenow={Math.round(valor)} aria-valuemin={0} aria-valuemax={100} aria-label={rotulo}>
      <motion.span className="tv-barra__fill" style={cor ? { background: cor } : undefined} initial={false} animate={{ width: `${Math.max(0, Math.min(100, valor))}%` }} transition={{ type: 'spring', stiffness: 120, damping: 22 }} />
    </span>
  )
}

export function Anel({ valor, total, tam = 92, rotulo }: { valor: number; total: number; tam?: number; rotulo?: string }) {
  const r = tam / 2 - 7
  const c = 2 * Math.PI * r
  const f = total ? Math.min(1, valor / total) : 0
  return (
    <span className="tv-anel" style={{ width: tam, height: tam }} role="img" aria-label={rotulo ?? `${valor} de ${total}`}>
      <svg width={tam} height={tam} viewBox={`0 0 ${tam} ${tam}`}>
        <circle cx={tam / 2} cy={tam / 2} r={r} className="tv-anel__trilho" />
        <motion.circle cx={tam / 2} cy={tam / 2} r={r} className="tv-anel__arco" strokeDasharray={c} initial={false} animate={{ strokeDashoffset: c * (1 - Math.max(f, 0.03)) }} transition={{ type: 'spring', stiffness: 90, damping: 20 }} />
      </svg>
      <b>
        {valor}/{total}
      </b>
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

/** texto com **destaques** */
export function Rico({ texto }: { texto: string }) {
  const partes = texto.split(/\*\*(.+?)\*\*/g)
  return (
    <>
      {partes.map((p, i) => (i % 2 ? <strong key={i}>{p}</strong> : <span key={i}>{p}</span>))}
    </>
  )
}

/** etiqueta “TESTE VOCACIONAL” das telas */
export const Etiqueta = ({ children = 'Teste vocacional' }: { children?: ReactNode }) => <span className="tv-etiqueta">{children}</span>

/* ---------------- coração de favorito ---------------- */
export function Coracao({ on, onClick, tam = 20, rotulo, comTexto }: { on: boolean; onClick?: () => void; tam?: number; rotulo?: string; comTexto?: boolean }) {
  const r = rotulo ?? (on ? 'Remover dos favoritos' : 'Adicionar aos favoritos')
  return (
    <motion.button
      className={`tv-coracao ${on ? 'is-on' : ''} ${comTexto ? 'tv-coracao--texto' : ''}`}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      whileTap={{ scale: 0.85 }}
      aria-pressed={on}
      aria-label={comTexto ? undefined : r}
      title={r}
    >
      <motion.span key={String(on)} initial={on ? { scale: 0.3 } : false} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 12 }}>
        <Heart size={tam} strokeWidth={on ? 0 : 1.9} fill={on ? 'currentColor' : 'none'} />
      </motion.span>
      {comTexto && <span>{on ? 'Nos favoritos' : 'Adicionar aos favoritos'}</span>}
      <AnimatePresence initial={false}>{on && <motion.i className="tv-coracao__pulso" initial={{ scale: 0.4, opacity: 0.8 }} animate={{ scale: 2, opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} />}</AnimatePresence>
    </motion.button>
  )
}

/* ---------------- lista suspensa (portal, posição fixa) ---------------- */
function usePosicao(aberto: boolean, ancora: React.RefObject<HTMLElement | null>, fechar: () => void) {
  const [pos, setPos] = useState<{ top?: number; bottom?: number; left: number; minWidth: number; acima: boolean } | null>(null)
  useLayoutEffect(() => {
    if (!aberto) return
    const r = ancora.current?.getBoundingClientRect()
    if (!r) return
    const acima = r.bottom + 300 > window.innerHeight && r.top > 320
    setPos({ ...(acima ? { bottom: window.innerHeight - r.top + 6 } : { top: r.bottom + 6 }), left: Math.max(8, Math.min(r.left, window.innerWidth - 280)), minWidth: r.width, acima })
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
export function Modal({ aberto, onFechar, titulo, children, rodape, largura = 480, semTitulo }: { aberto: boolean; onFechar: () => void; titulo: string; children: ReactNode; rodape?: ReactNode; largura?: number; semTitulo?: boolean }) {
  useEffect(() => {
    if (!aberto) return
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onFechar()
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [aberto, onFechar])
  return (
    <AnimatePresence initial={false}>
      {aberto && (
        <motion.div className="tv-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && onFechar()}>
          <motion.div className="tv-modal__caixa" style={{ maxWidth: largura }} role="dialog" aria-modal aria-label={titulo} initial={{ y: 24, scale: 0.97, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 12, opacity: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 30 }}>
            <header className={semTitulo ? 'is-sem' : ''}>
              {!semTitulo && <h3>{titulo}</h3>}
              <button className="tv-iconbtn" onClick={onFechar} aria-label="Fechar">
                <X size={18} />
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
