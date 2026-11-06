import { AnimatePresence, motion, type HTMLMotionProps } from 'framer-motion'
import { BookOpen, Check, ChevronDown, CircleDot, Flag, Info, MessageSquareMore, Trophy, X, AlertTriangle, XCircle, type LucideIcon } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { TIPOS, type TipoId } from '../data'
import { useCron } from '../store'

/* ---------------- tipos de atividade ---------------- */
export const TIPO_ICONE: Record<TipoId, LucideIcon> = { prova: CircleDot, tarefa: MessageSquareMore, campeonato: Trophy, aula: BookOpen, desafio: Flag }

/** selo colorido com ícone + nome (tabela de revisão) */
export function TipoBadge({ tipo, vazio = 'Não informado' }: { tipo: TipoId | null; vazio?: string }) {
  if (!tipo)
    return (
      <span className="cr-tipo cr-tipo--vazio">
        <AlertTriangle size={14} /> {vazio}
      </span>
    )
  const t = TIPOS[tipo]
  const I = TIPO_ICONE[tipo]
  return (
    <span className="cr-tipo" style={{ color: t.cor, background: t.fundo }}>
      <I size={14} strokeWidth={2.4} fill={tipo === 'prova' ? 'none' : 'currentColor'} fillOpacity={tipo === 'prova' ? 0 : 0.18} />
      <span>{t.nome}</span>
    </span>
  )
}

/** ícone redondo/quadrado do tipo (cards e listas) */
export function TipoIcone({ tipo, tamanho = 44, quadrado }: { tipo: TipoId; tamanho?: number; quadrado?: boolean }) {
  const t = TIPOS[tipo]
  const I = TIPO_ICONE[tipo]
  return (
    <span className={`cr-tipoicone ${quadrado ? 'is-quadrado' : ''}`} style={{ width: tamanho, height: tamanho, background: t.fundo, color: t.cor }}>
      <I size={Math.round(tamanho * 0.5)} strokeWidth={2.2} fill={tipo === 'prova' ? 'none' : 'currentColor'} fillOpacity={tipo === 'prova' ? 0 : 0.2} />
    </span>
  )
}

/* ---------------- botões ---------------- */
type BtnProps = HTMLMotionProps<'button'> & { variante?: 'primario' | 'contorno' | 'fantasma' | 'link' | 'perigo'; icone?: ReactNode; iconeDir?: ReactNode; pequeno?: boolean }
export function Btn({ variante = 'primario', icone, iconeDir, pequeno, children, className, disabled, ...rest }: BtnProps) {
  return (
    <motion.button
      type="button"
      className={`cr-btn cr-btn--${variante} ${pequeno ? 'cr-btn--sm' : ''} ${className ?? ''}`}
      whileHover={disabled ? undefined : { y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 600, damping: 30 }}
      disabled={disabled}
      {...rest}
    >
      {icone}
      {children as ReactNode}
      {iconeDir}
    </motion.button>
  )
}

/* ---------------- seleção (dropdown) ---------------- */
export function Select<T extends string>({
  rotulo,
  valor,
  opcoes,
  onChange,
  className,
  placeholder,
  largura,
}: {
  rotulo?: string
  valor: T
  opcoes: { valor: T; texto: string; icone?: ReactNode }[]
  onChange: (v: T) => void
  className?: string
  placeholder?: string
  largura?: number
}) {
  const [aberto, setAberto] = useState(false)
  // a lista usa posição fixa na tela: nunca é cortada por modais ou painéis com rolagem
  const [pos, setPos] = useState<React.CSSProperties>({})
  const [cimaAberto, setCima] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!aberto) return
    const r = ref.current!.getBoundingClientRect()
    const baixo = window.innerHeight - r.bottom - 12
    const cima = r.top - 12
    const paraCima = baixo < 240 && cima > baixo
    const max = Math.max(140, Math.min(300, paraCima ? cima : baixo))
    setCima(paraCima)
    setPos({ position: 'fixed', left: r.left, minWidth: r.width, maxHeight: max, ...(paraCima ? { bottom: window.innerHeight - r.top + 6, top: 'auto' } : { top: r.bottom + 6 }) })
    // fecha ao rolar a página, mas não ao rolar a própria lista
    const fechar = (ev?: Event) => {
      if (ev && ref.current?.contains(ev.target as Node)) return
      setAberto(false)
    }
    window.addEventListener('resize', fechar)
    document.addEventListener('scroll', fechar, true)
    const fora = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setAberto(false)
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setAberto(false)
    document.addEventListener('mousedown', fora)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', fora)
      document.removeEventListener('keydown', esc)
      window.removeEventListener('resize', fechar)
      document.removeEventListener('scroll', fechar, true)
    }
  }, [aberto])
  const atual = opcoes.find((o) => o.valor === valor)
  return (
    <div className={`cr-select ${aberto ? 'is-aberto' : ''} ${className ?? ''}`} ref={ref} style={largura ? { minWidth: largura } : undefined}>
      <button type="button" className="cr-select__btn" onClick={() => setAberto((a) => !a)} aria-haspopup="listbox" aria-expanded={aberto}>
        {rotulo && <span className="cr-select__rotulo">{rotulo}</span>}
        <span className="cr-select__valor">
          {atual?.icone}
          {atual?.texto ?? <em>{placeholder ?? 'Selecione'}</em>}
        </span>
        <ChevronDown size={18} className="cr-select__seta" />
      </button>
      <AnimatePresence>
        {aberto && (
          <motion.ul
            className={`cr-select__lista ${cimaAberto ? 'is-cima' : ''}`}
            style={pos}
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.14 }}
          >
            {opcoes.map((o) => (
              <li key={o.valor}>
                <button
                  type="button"
                  role="option"
                  aria-selected={o.valor === valor}
                  className={o.valor === valor ? 'is-on' : ''}
                  onClick={() => {
                    onChange(o.valor)
                    setAberto(false)
                  }}
                >
                  {o.icone}
                  <span>{o.texto}</span>
                  {o.valor === valor && <Check size={16} className="cr-select__ok" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ---------------- modal ---------------- */
export function Modal({ aberto, onFechar, titulo, children, largura = 560, rodape }: { aberto: boolean; onFechar: () => void; titulo?: ReactNode; children: ReactNode; largura?: number; rodape?: ReactNode }) {
  useEffect(() => {
    if (!aberto) return
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onFechar()
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [aberto, onFechar])
  return (
    <AnimatePresence>
      {aberto && (
        <motion.div className="cr-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onFechar}>
          <motion.div
            className="cr-modal__caixa"
            role="dialog"
            aria-modal
            style={{ maxWidth: largura }}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {titulo && (
              <header className="cr-modal__topo">
                <h2>{titulo}</h2>
                <button className="cr-iconbtn" onClick={onFechar} aria-label="Fechar">
                  <X size={20} />
                </button>
              </header>
            )}
            <div className="cr-modal__corpo">{children}</div>
            {rodape && <footer className="cr-modal__rodape">{rodape}</footer>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ---------------- etapas do assistente ---------------- */
const ETAPAS = ['Importar arquivo (CSV)', 'Revisar e ajustar dados', 'Finalizar e publicar']
export function Etapas({ atual, progresso }: { atual: 1 | 2 | 3; /** 0–1 dentro da etapa atual */ progresso?: number }) {
  const p = ((atual - 1) + (progresso ?? 1)) / 3
  return (
    <div className="cr-etapas">
      <ol>
        {ETAPAS.map((e, i) => {
          const n = i + 1
          const feito = n < atual
          return (
            <li key={e} className={`${feito ? 'is-feito' : ''} ${n === atual ? 'is-atual' : ''}`}>
              <motion.span className="cr-etapas__num" key={`${feito}${n === atual}`} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }}>
                {feito ? <Check size={16} strokeWidth={3} /> : n}
              </motion.span>
              <span className="cr-etapas__nome">{e}</span>
            </li>
          )
        })}
      </ol>
      <div className="cr-etapas__trilho">
        <motion.span initial={false} animate={{ width: `${p * 100}%` }} transition={{ type: 'spring', stiffness: 80, damping: 20 }} />
      </div>
    </div>
  )
}

/* ---------------- avisos ---------------- */
export function Toasts() {
  const { toasts, fecharToast } = useCron()
  return (
    <div className="cr-toasts" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            className={`cr-toast cr-toast--${t.tipo ?? 'ok'}`}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
          >
            <span className="cr-toast__ic">{t.tipo === 'erro' ? <XCircle size={18} /> : t.tipo === 'info' ? <Info size={18} /> : <Check size={18} strokeWidth={3} />}</span>
            <span className="cr-toast__txt">{t.texto}</span>
            {t.acao && (
              <button
                className="cr-toast__acao"
                onClick={() => {
                  t.acao!.fn()
                  fecharToast(t.id)
                }}
              >
                {t.acao.rotulo}
              </button>
            )}
            <button className="cr-toast__x" onClick={() => fecharToast(t.id)} aria-label="Fechar aviso">
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

/* ---------------- caixa de seleção ---------------- */
export function Checkbox({ checked, onChange, indeterminado, rotulo }: { checked: boolean; onChange: (v: boolean) => void; indeterminado?: boolean; rotulo?: string }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminado ? 'mixed' : checked}
      aria-label={rotulo}
      className={`cr-check ${checked ? 'is-on' : ''} ${indeterminado ? 'is-meio' : ''}`}
      onClick={(e) => {
        e.stopPropagation()
        onChange(!checked)
      }}
    >
      <AnimatePresence>
        {(checked || indeterminado) && (
          <motion.svg key={indeterminado ? 'm' : 'c'} viewBox="0 0 16 16" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }} transition={{ duration: 0.14 }}>
            {indeterminado ? <path d="M4 8h8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /> : <path d="m3.5 8.4 3 3 6-6.6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />}
          </motion.svg>
        )}
      </AnimatePresence>
    </button>
  )
}

/* ---------------- ícone da gravidade da inconsistência ---------------- */
export function GravidadeIcone({ g, tamanho = 40 }: { g: 'sugestao' | 'validar' | 'obrigatoria'; tamanho?: number }) {
  const s = Math.round(tamanho * 0.5)
  return (
    <span className={`cr-grav cr-grav--${g}`} style={{ width: tamanho, height: tamanho }}>
      {g === 'sugestao' ? <AlertTriangle size={s} /> : g === 'validar' ? <Info size={s} /> : <XCircle size={s} />}
    </span>
  )
}

/* =====================================================================
   Ilustrações (SVG, no traço das referências)
   ===================================================================== */
const ROXO = '#4c1d95'
const LILAS = '#cdbdf3'

/** arquivo CSV com grade (tela de importação) */
export function IlustraCSV({ animar }: { animar?: boolean }) {
  return (
    <svg className="cr-ilustra" viewBox="0 0 200 180" aria-hidden>
      <g fill="none" stroke={ROXO} strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
        <path d="M30 22h70l28 28v98a10 10 0 0 1-10 10H30a10 10 0 0 1-10-10V32a10 10 0 0 1 10-10Z" fill="#fff" />
        <path d="M100 22v22a6 6 0 0 0 6 6h22" fill={LILAS} fillOpacity=".5" />
      </g>
      <g stroke={LILAS} strokeWidth="5">
        <rect x="38" y="66" width="72" height="62" rx="4" fill="#f5f0ff" />
        <path d="M38 86h72M38 107h72M62 66v62M86 66v62" />
      </g>
      <motion.g initial={animar ? { y: 8, opacity: 0 } : false} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 16 }}>
        <rect x="92" y="114" width="86" height="46" rx="10" fill="#7c4bd8" />
        <text x="135" y="146" textAnchor="middle" fontFamily="Figtree, sans-serif" fontWeight="700" fontSize="26" fill="#fff">
          CSV
        </text>
      </motion.g>
      <g className="cr-ilustra__raios" stroke={ROXO} strokeWidth="5" strokeLinecap="round">
        <path d="M150 12l-6 18M170 26l-14 12M178 48l-18 4" />
      </g>
    </svg>
  )
}

/** arquivo CSV com lupa escaneando (análise) */
export function IlustraAnalise() {
  return (
    <svg className="cr-ilustra" viewBox="0 0 300 260" aria-hidden>
      <path d="M40 140c-10-60 50-110 120-104 60 5 90 40 104 86 14 50-6 98-62 112-60 15-152-30-162-94Z" fill="#efe8fb" />
      <g fill="none" stroke={ROXO} strokeWidth="5" strokeLinejoin="round">
        <path d="M86 50h86l34 34v134a10 10 0 0 1-10 10H86a10 10 0 0 1-10-10V60a10 10 0 0 1 10-10Z" fill="#fff" />
        <path d="M172 50v26a8 8 0 0 0 8 8h26" fill={LILAS} fillOpacity=".55" />
      </g>
      <g stroke={LILAS} strokeWidth="5">
        <rect x="94" y="104" width="98" height="96" rx="4" fill="#f6f1ff" />
        <path d="M94 136h98M94 168h98M127 104v96M160 104v96" />
      </g>
      <rect x="76" y="40" width="84" height="42" rx="8" fill="#7c4bd8" />
      <text x="118" y="70" textAnchor="middle" fontFamily="Figtree, sans-serif" fontWeight="800" fontSize="26" fill="#fff">
        CSV
      </text>
      {/* lupa passeando pela planilha */}
      <g className="cr-ilustra__lupa">
        <circle cx="170" cy="160" r="30" fill="rgba(255,255,255,.55)" stroke={ROXO} strokeWidth="7" />
        <path d="M192 182l26 26" stroke="#8b5cf6" strokeWidth="14" strokeLinecap="round" />
      </g>
      <g className="cr-ilustra__raios" stroke={ROXO} strokeWidth="5" strokeLinecap="round">
        <path d="M222 14l-6 22M244 30l-16 16M256 56l-24 6" />
      </g>
    </svg>
  )
}

/** calendário com selo verde (publicar) */
export function IlustraCalendarioOk() {
  return (
    <svg className="cr-ilustra" viewBox="0 0 320 240" aria-hidden>
      <path d="M42 140c-6-56 46-100 118-100 74 0 128 40 132 96 4 58-50 92-128 92-72 0-116-34-122-88Z" fill="#efe8fb" />
      <g fill="none" stroke={ROXO} strokeWidth="6" strokeLinejoin="round" strokeLinecap="round">
        <rect x="74" y="50" width="176" height="150" rx="16" fill="#fff" />
        <path d="M74 86h176" />
        <path d="M110 34v30M162 34v30M214 34v30" />
        <circle cx="110" cy="40" r="10" fill="#fff" />
        <circle cx="162" cy="40" r="10" fill="#fff" />
        <circle cx="214" cy="40" r="10" fill="#fff" />
      </g>
      <g fill="#ddd0f7">
        {[0, 1, 2].map((c) => [0, 1].map((r) => <rect key={`${c}${r}`} x={98 + c * 46} y={104 + r * 42} width="30" height="28" rx="5" />))}
      </g>
      <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 12 }} style={{ transformOrigin: '232px 180px' }}>
        <circle cx="232" cy="180" r="38" fill="#22a447" stroke="#fff" strokeWidth="6" />
        <motion.path
          d="M214 181l13 13 24-26"
          fill="none"
          stroke="#fff"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.55, duration: 0.4 }}
        />
      </motion.g>
      <g className="cr-ilustra__raios" stroke={ROXO} strokeWidth="6" strokeLinecap="round">
        <path d="M262 22l-6 22M286 38l-18 14M298 64l-24 6" />
      </g>
    </svg>
  )
}

/** rótulo de status da escola */
export function StatusEscola({ status }: { status: 'publicado' | 'agendado' | 'rascunho' | 'nao-iniciado' }) {
  const txt = status === 'publicado' ? 'Publicado' : status === 'agendado' ? 'Agendado' : status === 'rascunho' ? 'Em rascunho' : 'Não iniciado'
  return (
    <motion.span key={status} className={`cr-status cr-status--${status}`} initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
      {status === 'publicado' ? (
        <svg viewBox="0 0 16 16" width="16" height="16">
          <circle cx="8" cy="8" r="6.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="m5.2 8.2 2 2 3.8-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : status === 'rascunho' ? (
        <svg viewBox="0 0 16 16" width="16" height="16">
          <path d="M3 13h3l7-7-3-3-7 7v3Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 16 16" width="16" height="16">
          <circle cx="8" cy="8" r="6.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8 4.8V8l2 1.6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )}
      {txt}
    </motion.span>
  )
}
