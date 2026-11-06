import { AnimatePresence, motion, type HTMLMotionProps } from 'framer-motion'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { haptic, preloadVoice, setMuted, sfx, speak, useMuted, useSpeaking } from '../../../shared/sound'
import { useAlfa } from '../store'
import { STUDENT, avatarByArt, findAvatar, type Achievement } from '../data'
import { asset, place } from '../assets'

/* ---------------- imagens ---------------- */

/** Asset extraído das referências (public/alfa). */
export function Art({ name, className, style, alt = '' }: { name: string; className?: string; style?: React.CSSProperties; alt?: string }) {
  return <img className={`art ${className ?? ''}`} src={asset(name)} alt={alt} draggable={false} style={style} />
}

/** Asset posicionado exatamente onde está na referência (layout paisagem). */
export function Placed({ name, className, children, style }: { name: string; className?: string; children?: ReactNode; style?: React.CSSProperties }) {
  return (
    <div className={`placed ${className ?? ''}`} style={{ ...place(name), ...style }}>
      <Art name={name} />
      {children}
    </div>
  )
}

/** Ícone 3D genérico (Fluent Emoji) — usado só onde as referências não têm arte. */
export function Img3D({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) {
  return <img className={`i3d ${className ?? ''}`} src={`./3d/${name}.png`} alt="" draggable={false} style={style} />
}

/* ---------------- botões ---------------- */
type BtnProps = HTMLMotionProps<'button'> & {
  variant?: 'primary' | 'ghost' | 'icon' | 'soft'
  icon?: ReactNode
  sound?: 'tap' | 'pop' | 'none'
  glow?: boolean
}
export function Btn({ variant = 'primary', icon, children, sound = 'tap', glow, className, onClick, disabled, ...rest }: BtnProps) {
  return (
    <motion.button
      type="button"
      className={`btn btn--${variant} ${glow ? 'btn--glow' : ''} ${disabled ? 'is-disabled' : ''} ${className ?? ''}`}
      whileHover={disabled ? undefined : { scale: 1.035, y: -2 }}
      whileTap={disabled ? undefined : { scale: 0.94, y: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 18 }}
      aria-disabled={disabled || undefined}
      onClick={(e) => {
        if (disabled) {
          sfx.locked()
          return
        }
        if (sound !== 'none') sfx[sound]()
        haptic()
        onClick?.(e)
      }}
      {...rest}
    >
      {icon && <span className="btn__icon">{icon}</span>}
      {children && <span className="btn__label">{children as ReactNode}</span>}
    </motion.button>
  )
}

/* ---------------- ícones de linha ---------------- */
const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
export const Icon = {
  back: () => (
    <svg viewBox="0 0 24 24" {...P} strokeWidth={3.2}>
      <path d="M19 12H5.5M11.5 5.5 5 12l6.5 6.5" />
    </svg>
  ),
  play: () => (
    <svg viewBox="0 0 24 24">
      <path d="M7 4.6v14.8a1.2 1.2 0 0 0 1.8 1l12.3-7.4a1.2 1.2 0 0 0 0-2L8.8 3.6A1.2 1.2 0 0 0 7 4.6Z" fill="currentColor" />
    </svg>
  ),
  check: () => (
    <svg viewBox="0 0 24 24" {...P} strokeWidth={3.6}>
      <path d="m4.5 12.5 5 5L19.5 7" />
    </svg>
  ),
  close: () => (
    <svg viewBox="0 0 24 24" {...P} strokeWidth={4}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  ),
  sound: () => (
    <svg viewBox="0 0 24 24">
      <path d="M3 9.2v5.6c0 .7.5 1.2 1.2 1.2h3.3l4.8 4c.8.6 1.9.1 1.9-.9V4.9c0-1-1.1-1.5-1.9-.9l-4.8 4H4.2C3.5 8 3 8.5 3 9.2Z" fill="currentColor" />
      <path d="M17 8.6a4.6 4.6 0 0 1 0 6.8M19.6 5.8a8.6 8.6 0 0 1 0 12.4" {...P} strokeWidth={2.4} />
    </svg>
  ),
  mute: () => (
    <svg viewBox="0 0 24 24">
      <path d="M3 9.2v5.6c0 .7.5 1.2 1.2 1.2h3.3l4.8 4c.8.6 1.9.1 1.9-.9V4.9c0-1-1.1-1.5-1.9-.9l-4.8 4H4.2C3.5 8 3 8.5 3 9.2Z" fill="currentColor" />
      <path d="m17 9.5 5 5M22 9.5l-5 5" {...P} />
    </svg>
  ),
  help: () => (
    <svg viewBox="0 0 24 24" {...P} strokeWidth={3}>
      <path d="M8.6 8.6a3.4 3.4 0 1 1 4.7 3.1c-.8.4-1.3 1.2-1.3 2.1V15" />
      <circle cx="12" cy="19.2" r=".9" fill="currentColor" />
    </svg>
  ),
  pencil: () => (
    <svg viewBox="0 0 24 24" {...P}>
      <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4Z" />
      <path d="m13.5 6.5 4 4" />
    </svg>
  ),
  list: () => (
    <svg viewBox="0 0 24 24" {...P}>
      <path d="M9 6h11M9 12h11M9 18h11" />
      <circle cx="4.5" cy="6" r=".9" fill="currentColor" />
      <circle cx="4.5" cy="12" r=".9" fill="currentColor" />
      <circle cx="4.5" cy="18" r=".9" fill="currentColor" />
    </svg>
  ),
  users: () => (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="7.5" r="3.6" fill="currentColor" />
      <circle cx="4.8" cy="9" r="2.6" fill="currentColor" />
      <circle cx="19.2" cy="9" r="2.6" fill="currentColor" />
      <path d="M5.6 19.8a6.4 6.4 0 0 1 12.8 0Z" fill="currentColor" />
      <path d="M.6 18.6A4.4 4.4 0 0 1 6 14.4a8.4 8.4 0 0 0-1.6 4.2Zm22.8 0A4.4 4.4 0 0 0 18 14.4a8.4 8.4 0 0 1 1.6 4.2Z" fill="currentColor" />
    </svg>
  ),
  user: () => (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4.2" fill="currentColor" />
      <path d="M3.8 20.6a8.2 8.2 0 0 1 16.4 0Z" fill="currentColor" />
    </svg>
  ),
  plus: () => (
    <svg viewBox="0 0 24 24" {...P} strokeWidth={3.6}>
      <path d="M12 4.5v15M4.5 12h15" />
    </svg>
  ),
  home: () => (
    <svg viewBox="0 0 24 24">
      <path d="M2.8 11.4 12 3.5l9.2 7.9c.5.4.2 1.2-.4 1.2H19v7.2c0 .6-.4 1-1 1h-3.6v-5.6H9.6v5.6H6c-.6 0-1-.4-1-1v-7.2H3.2c-.6 0-.9-.8-.4-1.2Z" fill="currentColor" />
    </svg>
  ),
  image: () => (
    <svg viewBox="0 0 24 24" {...P} strokeWidth={2.4}>
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <circle cx="9" cy="10" r="1.8" fill="currentColor" />
      <path d="m3.5 17.5 5-4.5 4 3.5 3-2.5 5 4" />
    </svg>
  ),
  clipboard: () => (
    <svg viewBox="0 0 24 24" {...P} strokeWidth={2.2}>
      <rect x="4.5" y="4.5" width="15" height="17" rx="2.5" />
      <path d="M9 4.5V3h6v1.5M8.5 11h1M12 11h4M8.5 15.5h1M12 15.5h4" />
    </svg>
  ),
  refresh: () => (
    <svg viewBox="0 0 24 24" {...P} strokeWidth={2.4}>
      <path d="M20 12a8 8 0 0 1-14.3 4.9M4 12a8 8 0 0 1 14.3-4.9" />
      <path d="M18.5 3v4.5H14M5.5 21v-4.5H10" />
    </svg>
  ),
  calendar: () => (
    <svg viewBox="0 0 24 24" {...P} strokeWidth={2}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
      <path d="M7.5 13.5h1M11.5 13.5h1M15.5 13.5h1M7.5 17h1M11.5 17h1" strokeWidth={2.4} />
    </svg>
  ),
  undo: () => (
    <svg viewBox="0 0 24 24" {...P}>
      <path d="M9 14 4 9l5-5" />
      <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
    </svg>
  ),
  redo: () => (
    <svg viewBox="0 0 24 24" {...P}>
      <path d="m15 14 5-5-5-5" />
      <path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13" />
    </svg>
  ),
  trash: () => (
    <svg viewBox="0 0 24 24">
      <path d="M9 3h6l1 2h4v2H4V5h4Zm-3 6h12l-1 11a2 2 0 0 1-2 1.8H9a2 2 0 0 1-2-1.8Z" fill="currentColor" />
    </svg>
  ),
  heart: ({ filled }: { filled?: boolean }) => (
    <svg viewBox="0 0 24 24" {...P} strokeWidth={2.4} fill={filled ? 'currentColor' : 'none'}>
      <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z" />
    </svg>
  ),
  mic: () => (
    <svg viewBox="0 0 24 24">
      <rect x="8.5" y="2.5" width="7" height="12" rx="3.5" fill="currentColor" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" {...P} />
    </svg>
  ),
  stop: () => (
    <svg viewBox="0 0 24 24">
      <rect x="6" y="6" width="12" height="12" rx="3" fill="currentColor" />
    </svg>
  ),
}

/* ---------------- progresso (estrela + trilho com 3 pontos) ---------------- */
export function StarProgress({ value, steps = 3 }: { value: number; steps?: number }) {
  const v = Math.max(0, Math.min(1, value))
  const prev = useRef(v)
  const [pulse, setPulse] = useState(0)
  useEffect(() => {
    if (v > prev.current + 0.001) {
      setPulse((p) => p + 1)
      window.setTimeout(() => sfx.star(1), 250)
    }
    prev.current = v
  }, [v])
  // a pílula amarela cresce de um ponto até o outro; pontos lilases marcam as etapas
  const pct = Math.min(1, v) * 100
  return (
    <div className="sprog" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(v * 100)}>
      <motion.span key={pulse} className="sprog__star" animate={pulse ? { scale: [1, 1.35, 1], rotate: [0, -15, 0] } : undefined} transition={{ duration: 0.6 }}>
        <Art name="icon-star" />
      </motion.span>
      <span className="sprog__track">
        <span className="sprog__line" />
        {Array.from({ length: steps }).map((_, i) => (
          <span key={i} className="sprog__dot" style={{ left: `calc(${(i / (steps - 1)) * 100}% - var(--d) * ${i / (steps - 1)})` }} />
        ))}
        <motion.span className="sprog__fill" initial={false} animate={{ width: `calc(var(--d) + (100% - var(--d)) * ${pct / 100})` }} transition={{ type: 'spring', stiffness: 90, damping: 16 }} />
      </span>
    </div>
  )
}

/* ---------------- barra superior ---------------- */
export function TopBar({
  onBack,
  progress,
  title,
  hideLogo,
  hideRight,
}: {
  onBack?: () => void
  progress?: number
  title?: ReactNode
  hideLogo?: boolean
  hideRight?: boolean
}) {
  const muted = useMuted()
  const { backTo } = useAlfa()
  const [profile, setProfile] = useState(false)
  return (
    <header className={`topbar ${onBack ? 'has-back' : ''}`}>
      <div className="topbar__left">
        {onBack && <Btn variant="icon" className="topbar__back" aria-label="Voltar" icon={<Icon.back />} onClick={onBack} />}
        {!hideLogo && (
          <button className="topbar__logo" onClick={() => backTo({ id: 'home' })} aria-label="Jovens Gênios — ir para o início">
            <Art name="logo" />
          </button>
        )}
      </div>
      <div className="topbar__center">
        {title ? (
          <motion.div className="title-pill" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            {title}
          </motion.div>
        ) : progress !== undefined ? (
          <StarProgress value={progress} />
        ) : null}
      </div>
      {!hideRight && (
        <div className="topbar__right">
          <Btn
            variant="icon"
            sound="none"
            className="topbar__sound"
            aria-label={muted ? 'Ligar som' : 'Desligar som'}
            icon={muted ? <Icon.mute /> : <Icon.sound />}
            onClick={() => {
              setMuted(!muted)
              if (muted) window.setTimeout(() => sfx.toggle(), 30)
            }}
          />
          <motion.button className="avatar" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.92 }} onClick={() => (sfx.pop(), setProfile((p) => !p))} aria-label="Meu perfil">
            <MyAvatar />
          </motion.button>
          <AnimatePresence>
            {profile && (
              <motion.div
                key="profile"
                className="profile-pop"
                initial={{ opacity: 0, y: -8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.9 }}
                onClick={() => setProfile(false)}
              >
                <span className="profile-pop__av">
                  <MyAvatar />
                </span>
                <div>
                  <strong>Oi, {STUDENT.name}!</strong>
                  <span>
                    {STUDENT.className} · {STUDENT.school}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </header>
  )
}

/* ---------------- balão de áudio ---------------- */
export function SpeechBubble({ text, auto = true, className, style }: { text: string; auto?: boolean; className?: string; style?: React.CSSProperties }) {
  const speaking = useSpeaking()
  const { audioTap } = useAlfa()
  const [mine, setMine] = useState(false)
  useEffect(() => {
    preloadVoice(text)
    if (!auto) return
    const t = window.setTimeout(() => {
      setMine(true)
      speak(text, { onEnd: () => setMine(false) })
    }, 550)
    return () => window.clearTimeout(t)
  }, [text, auto])
  const active = speaking && mine
  return (
    <motion.button
      className={`bubble ${active ? 'is-speaking' : ''} ${className ?? ''}`}
      style={style}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 17, delay: 0.25 }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        sfx.tap()
        audioTap()
        setMine(true)
        speak(text, { onEnd: () => setMine(false) })
      }}
      aria-label={`Ouvir: ${text}`}
      title="Toque para ouvir de novo"
    >
      <span className="bubble__spk">
        <Icon.sound />
      </span>
      <span className="bubble__wave" aria-hidden>
        {[0.34, 0.52, 0.8, 0.56, 1, 0.64, 0.86, 0.46, 0.3, 0.2].map((h, i) => (
          <i key={i} style={{ ['--h' as string]: h, animationDelay: `${i * 0.07}s` }} />
        ))}
      </span>
      <svg className="bubble__tail" viewBox="0 0 40 34" aria-hidden>
        <path d="M4 0 C10 12 9 24 3 34 C18 28 31 16 38 0Z" />
      </svg>
    </motion.button>
  )
}

/* ---------------- cenário (fundo pintado das referências) ---------------- */
export type BgName = 'home' | 'trail' | 'meadow'
export function Scene({ bg, blur }: { bg: BgName; blur?: boolean }) {
  const url = `url(${asset(`bg-${bg}`)})`
  return (
    <div className={`scene ${blur ? 'scene--blur' : ''}`} aria-hidden>
      <AnimatePresence initial={false}>
        <motion.div key={bg} className="scene__set" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.55, ease: 'easeOut' }}>
          <div className="scene__cover" style={{ backgroundImage: url }} />
          <div className="scene__fit" style={{ backgroundImage: url }} />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ---------------- confete ---------------- */
const COLORS = ['#ffd23f', '#7c3aed', '#22c55e', '#ff5d8f', '#38bdf8', '#fb923c', '#a78bfa']
function BurstView({ x, y, big }: { x: number; y: number; big?: boolean }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: big ? 90 : 55 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2
        const power = (big ? 260 : 170) + Math.random() * (big ? 320 : 200)
        return {
          i,
          dx: Math.cos(angle) * power,
          dy: Math.sin(angle) * power * 0.7 - (big ? 200 : 140),
          rot: Math.random() * 720 - 360,
          color: COLORS[i % COLORS.length],
          shape: i % 5 === 0 ? 'star' : i % 3 === 0 ? 'dot' : 'rect',
          size: 8 + Math.random() * 10,
          delay: Math.random() * 0.12,
        }
      }),
    [big],
  )
  return (
    <div className="burst" style={{ left: `${x * 100}%`, top: `${y * 100}%` }}>
      {pieces.map((p) => (
        <motion.span
          key={p.i}
          className={`burst__p burst__p--${p.shape}`}
          style={{ background: p.shape === 'star' ? undefined : p.color, color: p.color, width: p.size, height: p.shape === 'rect' ? p.size * 0.55 : p.size }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.4 }}
          animate={{ x: [0, p.dx, p.dx * 1.15], y: [0, p.dy, p.dy + 420], opacity: [1, 1, 0], rotate: p.rot, scale: 1 }}
          transition={{ duration: 2, delay: p.delay, ease: ['easeOut', 'easeIn'], times: [0, 0.35, 1] }}
        >
          {p.shape === 'star' ? '★' : null}
        </motion.span>
      ))}
    </div>
  )
}
export function ConfettiLayer() {
  const { bursts } = useAlfa()
  return (
    <div className="confetti-layer" aria-hidden>
      {bursts.map((b) => (
        <BurstView key={b.id} x={b.x} y={b.y} big={b.big} />
      ))}
    </div>
  )
}

/* ---------------- toasts ---------------- */
export function Toasts() {
  const { toasts } = useAlfa()
  return (
    <div className="toasts" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            className="toast"
            layout
            initial={{ opacity: 0, y: 40, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 380, damping: 24 }}
          >
            {t.img && <Art name={t.img} />}
            <span>{t.text}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

/* ---------------- medalha ---------------- */
export function Badge({ a, locked, className }: { a: Achievement; locked?: boolean; className?: string }) {
  if (locked && a.locked)
    return (
      <span className={`badge ${className ?? ''}`}>
        <Art name={a.locked} />
      </span>
    )
  return (
    <span className={`badge badge--composed ${locked ? 'badge--locked' : ''} ${className ?? ''}`}>
      <Art name={a.badge} style={a.hue ? { filter: `hue-rotate(${a.hue}deg)` } : undefined} />
      {a.icon && <Img3D name={a.icon} className="badge__icon" />}
      {locked && (
        <span className="badge__lock">
          <Art name="icon-lock" />
        </span>
      )}
    </span>
  )
}

/* ---------------- estrelas ---------------- */
export function Stars({ n, total = 3, animate }: { n: number; total?: number; animate?: boolean }) {
  useEffect(() => {
    if (!animate) return
    const ts = Array.from({ length: n }).map((_, i) => window.setTimeout(() => sfx.star(i), 450 + i * 280))
    return () => ts.forEach(window.clearTimeout)
  }, [animate, n])
  return (
    <span className="stars">
      {Array.from({ length: total }).map((_, i) => (
        <motion.span
          key={i}
          className={`stars__s ${i < n ? 'is-on' : ''}`}
          initial={animate ? { scale: 0, rotate: -90 } : false}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 12, delay: animate ? 0.4 + i * 0.28 : 0 }}
        >
          <Art name="icon-count-star" />
        </motion.span>
      ))}
    </span>
  )
}

/* ---------------- risquinhos amarelos e brilhos ---------------- */
export function Sparks({ className, style, flip }: { className?: string; style?: React.CSSProperties; flip?: boolean }) {
  return (
    <span className={`sparks ${flip ? 'sparks--flip' : ''} ${className ?? ''}`} style={style} aria-hidden>
      <svg viewBox="0 0 60 60">
        <g stroke="#ffc928" strokeWidth="7.5" strokeLinecap="round">
          <path d="M10 33 L3 25" />
          <path d="M22 24 L18 7" />
          <path d="M35 30 L49 19" />
        </g>
      </svg>
    </span>
  )
}
export function Twinkle({ className, style, delay = 0 }: { className?: string; style?: React.CSSProperties; delay?: number }) {
  return (
    <svg className={`twinkle ${className ?? ''}`} style={{ ...style, animationDelay: `${delay}s` }} viewBox="0 0 40 40" aria-hidden>
      <path d="M20 0 C22 14 26 18 40 20 C26 22 22 26 20 40 C18 26 14 22 0 20 C14 18 18 14 20 0Z" fill="#fff" />
    </svg>
  )
}

/* ---------------- avatar (bichinho no círculo) ---------------- */

/** círculo com o bichinho; se `art` não for um avatar de bichinho, mostra a imagem como está (ex.: colegas do mural) */
export function AvatarArt({ art, className }: { art: string; className?: string }) {
  const a = avatarByArt(art)
  if (!a) return <Art name={art} className={className} />
  return (
    <span className={`avatar-badge ${className ?? ''}`} style={{ ['--av-bg' as string]: a.bg }}>
      <Art name={a.art} />
    </span>
  )
}

/** avatar escolhido pelo estudante */
export function MyAvatar({ className }: { className?: string }) {
  const { state } = useAlfa()
  return <AvatarArt art={findAvatar(state.avatar).art} className={className} />
}
