import { AnimatePresence, LayoutGroup, motion, type PanInfo } from 'framer-motion'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { haptic, sfx, speak } from '../../../shared/sound'
import type { PickOption } from '../data'
import { Art, Btn, Icon, Img3D, Sparks, Stars, Twinkle } from './ui'
import Mascot from './Mascot'
import { box } from '../assets'

export type Feedback = 'ok' | 'bad'
type Common = {
  onSolved: (firstTry: boolean) => void
  onFeedback?: (f: Feedback) => void
  onProgress?: (p: number) => void
  hint: string
}

const PRAISE = ['Muito bem!', 'Isso mesmo!', 'Uau, que gênio!', 'Arrasou!', 'Perfeito!']
const praise = () => PRAISE[Math.floor(Math.random() * PRAISE.length)]
const TRY = ['Quase! Tente de novo.', 'Hmm, não foi dessa vez.', 'Opa! Vamos tentar outra vez?']
const tryAgain = () => TRY[Math.floor(Math.random() * TRY.length)]

function shuffle<T>(arr: T[], avoid?: (r: T[]) => boolean): T[] {
  let r = [...arr]
  for (let k = 0; k < 20; k++) {
    r = [...arr]
    for (let i = r.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[r[i], r[j]] = [r[j], r[i]]
    }
    if (!avoid || !avoid(r)) break
  }
  return r
}

function fx(kind: Feedback, el?: Element | null, confettiAt?: (x: number, y: number) => void) {
  if (kind === 'ok') {
    sfx.success()
    haptic(30)
    if (el && confettiAt) {
      const r = el.getBoundingClientRect()
      confettiAt((r.left + r.width / 2) / window.innerWidth, (r.top + r.height / 2) / window.innerHeight)
    }
  } else {
    sfx.error()
    haptic(60)
  }
}

/* ---------------- rodapé: ajuda + verificar ---------------- */
export function ActivityFooter({ onHelp, onVerify, canVerify, verifyLabel = 'Verificar resposta' }: { onHelp: () => void; onVerify?: () => void; canVerify?: boolean; verifyLabel?: string }) {
  return (
    <div className="act-footer">
      <Btn variant="ghost" className="help-btn" icon={<Icon.help />} onClick={onHelp}>
        Preciso de ajuda
      </Btn>
      {onVerify && (
        <Btn className={`verify-btn ${canVerify ? 'is-ready' : ''}`} icon={<Icon.check />} disabled={!canVerify} onClick={onVerify} glow={canVerify}>
          {verifyLabel}
        </Btn>
      )}
    </div>
  )
}

/* ---------------- escolher a figura ---------------- */
export function PickChallenge({ options, onSolved, onFeedback, hint, confettiAt }: Common & { options: PickOption[]; confettiAt: (x: number, y: number) => void }) {
  const [wrong, setWrong] = useState<string[]>([])
  const [right, setRight] = useState<string | null>(null)
  const [shakeId, setShakeId] = useState<{ id: string; n: number } | null>(null)
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})

  const choose = (o: PickOption) => {
    if (right) return
    if (o.ok) {
      setRight(o.id)
      fx('ok', refs.current[o.id], confettiAt)
      onFeedback?.('ok')
      speak(`${praise()} ${o.label}!`)
      window.setTimeout(() => onSolved(wrong.length === 0), 1900)
    } else {
      setWrong((w) => (w.includes(o.id) ? w : [...w, o.id]))
      setShakeId((s) => ({ id: o.id, n: (s?.n ?? 0) + 1 }))
      fx('bad')
      onFeedback?.('bad')
      speak(`${o.label}? ${tryAgain()}`)
    }
  }

  return (
    <div className="pick">
      {options.map((o, i) => {
        const isRight = right === o.id
        const isWrong = wrong.includes(o.id)
        return (
          <motion.button
            key={o.id}
            ref={(el) => {
              refs.current[o.id] = el
            }}
            className={`pick__card ${isRight ? 'is-right' : ''} ${isWrong ? 'is-wrong' : ''} ${right && !isRight ? 'is-faded' : ''}`}
            initial={{ opacity: 0, y: 60, rotate: i % 2 ? 4 : -4 }}
            animate={isRight ? { opacity: 1, y: [0, -24, 0], rotate: 0, scale: [1, 1.12, 1.06] } : { opacity: 1, y: 0, rotate: 0 }}
            transition={isRight ? { duration: 0.5 } : { type: 'spring', stiffness: 220, damping: 16, delay: 0.15 + i * 0.1 }}
            whileHover={right ? undefined : { y: -8, scale: 1.04 }}
            whileTap={right ? undefined : { scale: 0.94 }}
            onClick={() => choose(o)}
            aria-label={o.label}
          >
            <motion.span
              key={shakeId?.id === o.id ? shakeId.n : 0}
              className="pick__art"
              animate={shakeId?.id === o.id ? { x: [0, -14, 14, -10, 10, 0], rotate: [0, -6, 6, -3, 3, 0] } : undefined}
              transition={{ duration: 0.5 }}
            >
              {o.img ? <Art name={o.img} /> : <span className="pick__letter">{o.letter}</span>}
            </motion.span>
            <AnimatePresence>
              {isRight && (
                <motion.span key="mark" className="pick__mark pick__mark--ok" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Icon.check />
                </motion.span>
              )}
              {isRight && (
                <motion.span key="label" className="pick__label" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  {o.label}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        )
      })}
      <span className="sr-only">{hint}</span>
    </div>
  )
}

/* ---------------- completar a letra que falta ---------------- */
export function LetterChallenge({ word, img, options, onSolved, onFeedback, confettiAt }: Common & { word: string; img?: string; options: PickOption[]; confettiAt: (x: number, y: number) => void }) {
  const [filled, setFilled] = useState<string | null>(null)
  const [wrongs, setWrongs] = useState<string[]>([])
  const [shake, setShake] = useState(0)
  const wordRef = useRef<HTMLDivElement>(null)
  const full = word.replace('_', options.find((o) => o.ok)!.letter!)

  const choose = (o: PickOption) => {
    if (filled) return
    if (o.ok) {
      setFilled(o.letter!)
      sfx.snap()
      window.setTimeout(() => fx('ok', wordRef.current, confettiAt), 250)
      onFeedback?.('ok')
      window.setTimeout(() => speak(`${praise()} ${full.toLowerCase()}!`), 300)
      window.setTimeout(() => onSolved(wrongs.length === 0), 2000)
    } else {
      setWrongs((w) => [...w, o.id])
      setShake((s) => s + 1)
      fx('bad')
      onFeedback?.('bad')
      speak(`${o.letter}${word.slice(1).toLowerCase()}? ${tryAgain()}`)
    }
  }

  return (
    <LayoutGroup>
      <div className="letterq">
        {img && (
          <motion.button className="letterq__img" onClick={() => (sfx.tap(), speak(full.toLowerCase()))} whileTap={{ scale: 0.95 }} animate={{ y: [0, -8, 0] }} transition={{ y: { duration: 2.4, repeat: Infinity } }}>
            <Art name={img} />
          </motion.button>
        )}
        <motion.div ref={wordRef} className={`letterq__word ${filled ? 'is-done' : ''}`} key={shake} animate={shake ? { x: [0, -12, 12, -8, 8, 0] } : undefined} transition={{ duration: 0.45 }}>
          {word.split('').map((ch, i) =>
            ch === '_' ? (
              <span key={i} className="letterq__blank">
                {filled && (
                  <motion.span layoutId={`lq-${filled}`} className="letterq__fill">
                    {filled}
                  </motion.span>
                )}
              </span>
            ) : (
              <motion.span key={i} className="letterq__ch" animate={filled ? { y: [0, -12, 0] } : undefined} transition={{ delay: i * 0.06, duration: 0.4 }}>
                {ch}
              </motion.span>
            ),
          )}
        </motion.div>
        <div className="letterq__opts">
          {options.map((o, i) =>
            filled === o.letter ? (
              <span key={o.id} className="tile tile--ghost" />
            ) : (
              <motion.button
                key={o.id}
                layoutId={`lq-${o.letter}`}
                className={`tile ${wrongs.includes(o.id) ? 'is-wrong' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.2 + i * 0.08 }}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => choose(o)}
              >
                {o.letter}
              </motion.button>
            ),
          )}
        </div>
      </div>
    </LayoutGroup>
  )
}

/* ---------------- ler a palavra da figura (trilha de Leitura) ---------------- */
export function WordPick({ img, options, onSolved, onFeedback, confettiAt }: Common & { img: string; options: PickOption[]; confettiAt: (x: number, y: number) => void }) {
  const [right, setRight] = useState<string | null>(null)
  const [wrongs, setWrongs] = useState<string[]>([])
  const [shake, setShake] = useState<{ id: string; n: number } | null>(null)
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})

  const choose = (o: PickOption) => {
    if (right) return
    if (o.ok) {
      setRight(o.id)
      fx('ok', refs.current[o.id], confettiAt)
      onFeedback?.('ok')
      speak(`${praise()} ${o.label.toLowerCase()}!`)
      window.setTimeout(() => onSolved(wrongs.length === 0), 1900)
    } else {
      setWrongs((w) => (w.includes(o.id) ? w : [...w, o.id]))
      setShake((s) => ({ id: o.id, n: (s?.n ?? 0) + 1 }))
      fx('bad')
      onFeedback?.('bad')
      speak(`Aqui está escrito ${o.label.toLowerCase()}. ${tryAgain()}`)
    }
  }

  return (
    <div className="wordpick">
      <motion.div className="wordpick__img" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1, y: ['0%', '-4%', '0%'] }} transition={{ scale: { type: 'spring', stiffness: 260, damping: 14 }, y: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' } }}>
        <Art name={img} />
        <Sparks className="wordpick__sparks" />
      </motion.div>
      <div className="wordpick__opts">
        {options.map((o, i) => (
          <motion.button
            key={o.id}
            ref={(el) => {
              refs.current[o.id] = el
            }}
            className={`wordcard ${right === o.id ? 'is-right' : ''} ${wrongs.includes(o.id) ? 'is-wrong' : ''} ${right && right !== o.id ? 'is-faded' : ''}`}
            initial={{ opacity: 0, y: 40 }}
            animate={right === o.id ? { opacity: 1, y: [0, -18, 0], scale: [1, 1.1, 1.05] } : { opacity: 1, y: 0 }}
            transition={right === o.id ? { duration: 0.5 } : { type: 'spring', stiffness: 260, damping: 16, delay: 0.2 + i * 0.1 }}
            whileHover={right ? undefined : { y: -6 }}
            whileTap={right ? undefined : { scale: 0.94 }}
            onClick={() => choose(o)}
            aria-label={o.label}
          >
            <motion.span key={shake?.id === o.id ? shake.n : 0} className="wordcard__txt" animate={shake?.id === o.id ? { x: [0, -12, 12, -8, 8, 0] } : undefined} transition={{ duration: 0.45 }}>
              {o.label}
            </motion.span>
            {right === o.id && (
              <motion.span className="pick__mark" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <Icon.check />
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

/* ---------------- arrastar letras e formar a palavra ---------------- */
export function WordBuilder({ word, img, onSolved, onFeedback, onProgress, hint, confettiAt }: Common & { word: string; img: string; confettiAt: (x: number, y: number) => void }) {
  const tiles = useMemo(() => shuffle(word.split('').map((l, i) => ({ id: `t${i}`, l })), (r) => r.map((t) => t.l).join('') === word), [word])
  const [slots, setSlots] = useState<(string | null)[]>(() => word.split('').map(() => null))
  const [status, setStatus] = useState<'idle' | 'wrong' | 'right'>('idle')
  const [wrongSlots, setWrongSlots] = useState<number[]>([])
  const [helpTile, setHelpTile] = useState<string | null>(null)
  const firstTry = useRef(true)
  const slotRefs = useRef<(HTMLDivElement | null)[]>([])
  const boardRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const letterOf = (id: string) => tiles.find((t) => t.id === id)!.l
  const placedIds = slots.filter(Boolean) as string[]
  const allFilled = slots.every(Boolean)

  useEffect(() => {
    onProgress?.(placedIds.length / word.length / 2)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placedIds.length])

  const place = (id: string, slotIndex?: number) => {
    if (status === 'right') return
    setStatus('idle')
    setWrongSlots([])
    setHelpTile(null)
    setSlots((s) => {
      const next = s.map((x) => (x === id ? null : x))
      const idx = slotIndex ?? next.findIndex((x) => x === null)
      if (idx < 0) return s
      next[idx] = id // se havia uma letra, ela volta para a bandeja
      return next
    })
    sfx.snap()
    haptic()
    speak(letterOf(id), { rate: 0.9 })
  }

  const unplace = (i: number) => {
    if (status === 'right') return
    sfx.pop()
    setWrongSlots([])
    setSlots((s) => s.map((x, j) => (j === i ? null : x)))
  }

  const onDragEnd = (id: string, info: PanInfo) => {
    window.setTimeout(() => (dragging.current = false), 50)
    const { x, y } = info.point
    const px = x - window.scrollX
    const py = y - window.scrollY
    const idx = slotRefs.current.findIndex((el) => {
      if (!el) return false
      const r = el.getBoundingClientRect()
      const m = 18
      return px > r.left - m && px < r.right + m && py > r.top - m && py < r.bottom + m
    })
    if (idx >= 0) place(id, idx)
  }

  const verify = () => {
    const attempt = slots.map((id) => (id ? letterOf(id) : '')).join('')
    if (attempt === word) {
      setStatus('right')
      fx('ok', boardRef.current, confettiAt)
      onFeedback?.('ok')
      onProgress?.(1)
      speak(`${praise()} Você formou a palavra ${word.toLowerCase()}!`)
      window.setTimeout(() => onSolved(firstTry.current), 2100)
    } else {
      firstTry.current = false
      const bad = slots.map((id, i) => (id && letterOf(id) !== word[i] ? i : -1)).filter((i) => i >= 0)
      setWrongSlots(bad)
      setStatus('wrong')
      fx('bad')
      onFeedback?.('bad')
      speak(tryAgain())
      window.setTimeout(() => {
        setSlots((s) => s.map((id, i) => (bad.includes(i) ? null : id)))
        setWrongSlots([])
        setStatus('idle')
      }, 1000)
    }
  }

  const help = () => {
    const next = slots.findIndex((id, i) => !id || letterOf(id) !== word[i])
    const need = word[next]
    const t = tiles.find((t) => t.l === need && !slots.some((id, i) => id === t.id && word[i] === t.l) && !placedIds.includes(t.id)) ?? tiles.find((t) => t.l === need && !placedIds.includes(t.id))
    if (t) setHelpTile(t.id)
    speak(`${hint} Depois, procure a letra ${need}.`)
  }

  return (
    <div className="builder">
      <div className="builder__stage">
        <motion.button className="builder__img" onClick={() => (sfx.tap(), speak(word.toLowerCase()))} whileTap={{ scale: 0.96 }} aria-label={`Ouvir a palavra ${word}`}>
          <motion.span animate={{ y: [0, -8, 0] }} transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}>
            <Art name={img} />
          </motion.span>
          <Sparks className="builder__sparks" />
        </motion.button>
        <div className="builder__right">
          <LayoutGroup>
            <div ref={boardRef} className={`builder__slots ${status === 'right' ? 'is-right' : ''}`}>
              {slots.map((id, i) => (
                <div
                  key={i}
                  ref={(el) => {
                    slotRefs.current[i] = el
                  }}
                  className={`slot ${id ? 'is-filled' : ''} ${wrongSlots.includes(i) ? 'is-wrong' : ''}`}
                >
                  {id && (
                    <motion.button
                      layoutId={id}
                      className="tile tile--placed"
                      onClick={() => unplace(i)}
                      animate={status === 'right' ? { y: [0, -16, 0], scale: [1, 1.1, 1] } : wrongSlots.includes(i) ? { x: [0, -8, 8, -6, 6, 0] } : undefined}
                      transition={status === 'right' ? { delay: i * 0.08, duration: 0.45 } : { type: 'spring', stiffness: 500, damping: 30 }}
                    >
                      {letterOf(id)}
                    </motion.button>
                  )}
                </div>
              ))}
            </div>
            <div className="builder__tray">
              {tiles.map((t) =>
                placedIds.includes(t.id) ? (
                  <span key={t.id} className="tile tile--ghost" />
                ) : (
                  <motion.button
                    key={t.id}
                    layoutId={t.id}
                    className={`tile ${helpTile === t.id ? 'is-help' : ''}`}
                    drag
                    dragSnapToOrigin
                    dragElastic={0.9}
                    dragMomentum={false}
                    whileDrag={{ scale: 1.15, zIndex: 20, rotate: -4, boxShadow: '0 20px 30px rgba(76,29,149,.3)' }}
                    whileHover={{ y: -6 }}
                    whileTap={{ scale: 0.92 }}
                    onDragStart={() => {
                      dragging.current = true
                      sfx.tap()
                    }}
                    onDragEnd={(_, info) => onDragEnd(t.id, info)}
                    onClick={() => !dragging.current && place(t.id)}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    aria-label={`Letra ${t.l}`}
                  >
                    {t.l}
                  </motion.button>
                ),
              )}
            </div>
          </LayoutGroup>
        </div>
      </div>
      <ActivityFooter onHelp={help} onVerify={verify} canVerify={allFilled && status !== 'right'} />
    </div>
  )
}

/* ---------------- caça às vogais ---------------- */
const VOWEL_LETTERS = ['A', 'M', 'E', 'B', 'O', 'L', 'U', 'T']
const VOWELS = ['A', 'E', 'I', 'O', 'U']
export function VowelHunt({ onSolved, onFeedback, onProgress, hint, confettiAt }: Common & { confettiAt: (x: number, y: number) => void }) {
  const letters = useMemo(() => shuffle(VOWEL_LETTERS), [])
  const [sel, setSel] = useState<string[]>([])
  const [bad, setBad] = useState<string[]>([])
  const [done, setDone] = useState(false)
  const firstTry = useRef(true)
  const ref = useRef<HTMLDivElement>(null)
  const total = letters.filter((l) => VOWELS.includes(l)).length

  useEffect(() => {
    onProgress?.(sel.filter((l) => VOWELS.includes(l)).length / total / 2)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel])

  const toggle = (l: string) => {
    if (done) return
    sfx.pop()
    speak(l, { rate: 0.9 })
    setBad([])
    setSel((s) => (s.includes(l) ? s.filter((x) => x !== l) : [...s, l]))
  }
  const verify = () => {
    const wrong = sel.filter((l) => !VOWELS.includes(l))
    const missing = letters.filter((l) => VOWELS.includes(l) && !sel.includes(l))
    if (!wrong.length && !missing.length) {
      setDone(true)
      fx('ok', ref.current, confettiAt)
      onFeedback?.('ok')
      onProgress?.(1)
      speak(`${praise()} A, E, O, U são vogais!`)
      window.setTimeout(() => onSolved(firstTry.current), 2000)
      return
    }
    firstTry.current = false
    fx('bad')
    onFeedback?.('bad')
    if (wrong.length) {
      setBad(wrong)
      speak(`${wrong.join(', ')} não ${wrong.length > 1 ? 'são vogais' : 'é vogal'}. Tente de novo!`)
      window.setTimeout(() => {
        setSel((s) => s.filter((l) => !wrong.includes(l)))
        setBad([])
      }, 900)
    } else speak(`Quase! Ainda ${missing.length > 1 ? `faltam ${missing.length} vogais` : 'falta uma vogal'}.`)
  }
  return (
    <div className="vowels">
      <div ref={ref} className="vowels__grid">
        {letters.map((l, i) => (
          <motion.button
            key={l}
            className={`bubble-letter ${sel.includes(l) ? 'is-on' : ''} ${bad.includes(l) ? 'is-wrong' : ''} ${done && VOWELS.includes(l) ? 'is-right' : ''}`}
            initial={{ scale: 0, rotate: -30 }}
            animate={bad.includes(l) ? { scale: 1, rotate: 0, x: [0, -10, 10, -6, 6, 0] } : { scale: 1, rotate: 0, y: [0, i % 2 ? -6 : 6, 0] }}
            transition={
              bad.includes(l)
                ? { duration: 0.45 }
                : { scale: { type: 'spring', stiffness: 300, damping: 12, delay: i * 0.06 }, rotate: { delay: i * 0.06 }, y: { duration: 2.4 + (i % 3) * 0.4, repeat: Infinity, ease: 'easeInOut' } }
            }
            whileTap={{ scale: 0.88 }}
            onClick={() => toggle(l)}
          >
            {l}
          </motion.button>
        ))}
      </div>
      <ActivityFooter onHelp={() => speak(hint)} onVerify={verify} canVerify={sel.length > 0 && !done} />
    </div>
  )
}

/* ---------------- contando e somando ---------------- */
const SUMS = [
  { a: 2, b: 1, opts: [2, 3, 4] },
  { a: 2, b: 3, opts: [4, 5, 6] },
]
export function CountSum({ startAt = 0, onSolved, onFeedback, onProgress, hint, confettiAt }: Common & { startAt?: number; confettiAt: (x: number, y: number) => void }) {
  const [q, setQ] = useState(startAt)
  const [pick, setPick] = useState<number | null>(null)
  const [state, setState] = useState<'idle' | 'wrong' | 'right'>('idle')
  const firstTry = useRef(true)
  const ref = useRef<HTMLDivElement>(null)
  const cur = SUMS[q]

  useEffect(() => {
    const t = window.setTimeout(() => speak(`Quantas maçãs temos ao todo? ${cur.a} mais ${cur.b}.`), 600)
    return () => window.clearTimeout(t)
  }, [q, cur.a, cur.b])

  const verify = () => {
    if (pick === cur.a + cur.b) {
      setState('right')
      fx('ok', ref.current, confettiAt)
      onFeedback?.('ok')
      speak(`${praise()} ${cur.a} mais ${cur.b} é igual a ${cur.a + cur.b}!`)
      onProgress?.((q + 1) / SUMS.length)
      window.setTimeout(() => {
        if (q + 1 < SUMS.length) {
          setQ(q + 1)
          setPick(null)
          setState('idle')
        } else onSolved(firstTry.current)
      }, 1900)
    } else {
      firstTry.current = false
      setState('wrong')
      fx('bad')
      onFeedback?.('bad')
      speak(`${tryAgain()} Conte as maçãs com o dedinho.`)
      window.setTimeout(() => {
        setState('idle')
        setPick(null)
      }, 900)
    }
  }

  return (
    <div className="count">
      <div className="count__step">
        Questão {q + 1} de {SUMS.length}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={q} ref={ref} className="count__eq" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}>
          <Group n={cur.a} />
          <span className="count__op">+</span>
          <Group n={cur.b} offset={cur.a} />
          <span className="count__op">=</span>
          <span className={`count__ans ${state === 'right' ? 'is-right' : ''}`}>{state === 'right' ? cur.a + cur.b : '?'}</span>
        </motion.div>
      </AnimatePresence>
      <div className="count__opts">
        {cur.opts.map((n) => (
          <motion.button
            key={`${q}-${n}`}
            className={`tile tile--num ${pick === n ? 'is-on' : ''} ${pick === n && state === 'wrong' ? 'is-wrong' : ''} ${pick === n && state === 'right' ? 'is-right' : ''}`}
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.9 }}
            animate={pick === n && state === 'wrong' ? { x: [0, -10, 10, -6, 6, 0] } : {}}
            onClick={() => {
              if (state !== 'idle') return
              sfx.pop()
              speak(String(n))
              setPick(n)
            }}
          >
            {n}
          </motion.button>
        ))}
      </div>
      <ActivityFooter onHelp={() => speak(hint)} onVerify={verify} canVerify={pick !== null && state === 'idle'} />
    </div>
  )
}
function Group({ n, offset = 0 }: { n: number; offset?: number }) {
  return (
    <span className="count__group">
      {Array.from({ length: n }).map((_, i) => (
        <motion.button
          key={i}
          className="count__apple"
          initial={{ scale: 0, y: -30 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 12, delay: 0.1 + (i + offset) * 0.1 }}
          whileTap={{ scale: 0.8, rotate: -10 }}
          onClick={() => {
            sfx.pop()
            speak(String(i + 1 + offset))
          }}
          aria-label="maçã"
        >
          <Art name="obj-apple" />
        </motion.button>
      ))}
    </span>
  )
}

/* ---------------- sequência: ciclo das plantas ---------------- */
const CYCLE = [
  { id: 'seed', img: 'seed', label: 'Semente' },
  { id: 'seedling', img: 'seedling', label: 'Brotinho' },
  { id: 'plant', img: 'plant', label: 'Plantinha' },
  { id: 'flower', img: 'sunflower', label: 'Flor' },
]
export function Sequence({ onSolved, onFeedback, onProgress, hint, confettiAt }: Common & { confettiAt: (x: number, y: number) => void }) {
  const cards = useMemo(() => shuffle(CYCLE, (r) => r.every((c, i) => c.id === CYCLE[i].id)), [])
  const [order, setOrder] = useState<string[]>([])
  const [state, setState] = useState<'idle' | 'wrong' | 'right'>('idle')
  const firstTry = useRef(true)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    onProgress?.(order.length / CYCLE.length / 2)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order.length])

  const tap = (id: string, label: string) => {
    if (state !== 'idle') return
    if (order.includes(id)) {
      sfx.pop()
      setOrder((o) => o.slice(0, o.indexOf(id)))
      return
    }
    sfx.snap()
    speak(label)
    setOrder((o) => [...o, id])
  }
  const verify = () => {
    if (order.every((id, i) => id === CYCLE[i].id)) {
      setState('right')
      fx('ok', ref.current, confettiAt)
      onFeedback?.('ok')
      onProgress?.(1)
      speak(`${praise()} Semente, brotinho, plantinha e flor!`)
      window.setTimeout(() => onSolved(firstTry.current), 2000)
    } else {
      firstTry.current = false
      setState('wrong')
      fx('bad')
      onFeedback?.('bad')
      speak(`${tryAgain()} O que vem primeiro: a semente ou a flor?`)
      window.setTimeout(() => {
        setOrder([])
        setState('idle')
      }, 1000)
    }
  }
  return (
    <div className="seq">
      <div ref={ref} className="seq__cards">
        {cards.map((c, i) => {
          const n = order.indexOf(c.id)
          return (
            <motion.button
              key={c.id}
              className={`seq__card ${n >= 0 ? 'is-on' : ''} ${state === 'wrong' && n >= 0 ? 'is-wrong' : ''} ${state === 'right' ? 'is-right' : ''}`}
              initial={{ opacity: 0, y: 40 }}
              animate={state === 'wrong' && n >= 0 ? { opacity: 1, y: 0, x: [0, -10, 10, -6, 6, 0] } : state === 'right' ? { opacity: 1, y: [0, -14, 0], x: 0 } : { opacity: 1, y: 0, x: 0 }}
              transition={state === 'right' ? { delay: (order.indexOf(c.id) || 0) * 0.12, duration: 0.45 } : { type: 'spring', stiffness: 240, damping: 16, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.93 }}
              onClick={() => tap(c.id, c.label)}
            >
              <Img3D name={c.img} />
              <span className="seq__label">{c.label}</span>
              <AnimatePresence>
                {n >= 0 && (
                  <motion.span className="seq__num" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }}>
                    {n + 1}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </div>
      <ActivityFooter onHelp={() => speak(hint)} onVerify={verify} canVerify={order.length === CYCLE.length && state === 'idle'} />
    </div>
  )
}

/* ---------------- tela de celebração (mesmo estilo do modal de conquista) ---------------- */
export function Celebrate({ title, subtitle, stars, primary, secondary }: { title: string; subtitle: string; stars: number; primary: { label: string; onClick: () => void }; secondary?: { label: string; onClick: () => void; icon?: ReactNode } }) {
  useEffect(() => {
    sfx.fanfare()
    const t = window.setTimeout(() => speak(`${title} ${subtitle}`), 500)
    return () => window.clearTimeout(t)
  }, [title, subtitle])
  return (
    <motion.div className="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="at mcard" style={box(255, 212, 1155, 568, [15, 150, 360, 560])} initial={{ scale: 0.5, y: 60, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 16 }}>
        <div className="mcard__art">
          <div className="rays" />
          <Twinkle className="mcard__tw mcard__tw--1" />
          <Twinkle className="mcard__tw mcard__tw--2" delay={0.5} />
          <Twinkle className="mcard__tw mcard__tw--3" delay={1} />
          <Mascot pose="cheer-big" celebrate={1} className="mcard__mascot mcard__mascot--cheer" />
        </div>
        <div className="mcard__body">
          <Stars n={stars} animate />
          <h2>{title}</h2>
          <p>{subtitle}</p>
          <div className="mcard__actions">
            <Btn icon={<Icon.play />} glow onClick={primary.onClick}>
              {primary.label}
            </Btn>
            {secondary && (
              <button className="linkbtn" onClick={() => (sfx.tap(), secondary.onClick())}>
                {secondary.label}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
