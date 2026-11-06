import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { haptic, sfx, speak, speakWhenFree } from '../../../shared/sound'
import Mascot from '../components/Mascot'
import { Art, MyAvatar, Sparks, TopBar, Twinkle } from '../components/ui'
import { TRAILS, type Trail } from '../data'
import { trailStatus, useAlfa, type TrailStatus } from '../store'
import { box, place, type PBox } from '../assets'

let greeted = false

/** ilhas da Home: posição (paisagem) e caixa no retrato */
const ISLANDS: { art: string; icon?: string; p: PBox; pin: [number, number]; pinP: [number, number]; spot: [number, number, number]; spotP: [number, number, number] }[] = [
  { art: 'abc-island', p: [92, 128, 206], pin: [578, 200], pinP: [70, 120], spot: [745, 440, 300], spotP: [195, 245, 120] },
  { art: 'island-book', icon: 'icon-book', p: [28, 368, 150], pin: [1108, 250], pinP: [62, 330], spot: [1152, 490, 230], spotP: [103, 465, 95] },
  { art: 'island-pencil', icon: 'icon-pencil', p: [212, 362, 150], pin: [1466, 258], pinP: [246, 324], spot: [1510, 495, 230], spotP: [287, 460, 95] },
]
/** caminhos entre as ilhas (px de design) */
const PATHS = ['M930 522 C985 516 1005 548 1050 546', 'M1262 530 C1318 512 1352 545 1405 540']

type Step = 'idle' | 'done' | 'travel' | 'shake' | 'open' | 'end'

export default function Home() {
  const { state, go, toast, confetti, clearPendingUnlock } = useAlfa()
  const [shake, setShake] = useState(0)
  const [celebrate, setCelebrate] = useState(0)
  const pending = state.pendingUnlock
  const target = pending ? TRAILS.findIndex((t) => t.id === pending) : -1
  const [step, setStep] = useState<Step>(target > 0 ? 'idle' : 'end')

  const totalLevels = TRAILS.reduce((n, t) => n + t.levels.length, 0)
  const doneLevels = TRAILS.reduce((n, t) => n + Math.min(state.progress[t.id], t.levels.length), 0)
  const progress = 0.32 + (0.68 * doneLevels) / totalLevels
  const pendingTasks = state.tasks.filter((t) => t.status === 'pendente').length
  const fresh = state.unlocked.filter((a) => !state.seen.includes(a)).length

  // ilha "atual" (onde o estudante está)
  const statuses = useMemo(() => TRAILS.map((_, i) => trailStatus(state.progress, i)), [state.progress])
  const currentIdx = Math.max(0, statuses.lastIndexOf('current') >= 0 ? statuses.indexOf('current') : TRAILS.length - 1)
  const animating = target > 0 && step !== 'end'

  /* ---------- sequência de desbloqueio da próxima ilha ---------- */
  useEffect(() => {
    if (target <= 0) return
    const prev = ISLANDS[target - 1]
    const isl = ISLANDS[target]
    const ts = [
      window.setTimeout(() => {
        setStep('done')
        sfx.success()
        confetti(prev.spot[0] / 1672, prev.spot[1] / 941)
      }, 600),
      window.setTimeout(() => {
        setStep('travel')
        sfx.whoosh()
      }, 1400),
      window.setTimeout(() => {
        setStep('shake')
        sfx.locked()
        haptic(25)
      }, 2600),
      window.setTimeout(() => {
        setStep('open')
        sfx.unlock()
        sfx.fanfare()
        haptic(40)
        setCelebrate((c) => c + 1)
        confetti(isl.spot[0] / 1672, isl.spot[1] / 941, true)
        speak(`Uau! Você desbloqueou a ${TRAILS[target].name}! Toque na ilha para começar.`)
      }, 3400),
      window.setTimeout(() => {
        setStep('end')
        clearPendingUnlock()
      }, 7600),
    ]
    return () => ts.forEach(window.clearTimeout)
  }, [target, confetti, clearPendingUnlock])

  useEffect(() => {
    if (greeted || animating) return
    greeted = true
    speakWhenFree('Oi! Toque no A B C para começar a trilha das letras!', 700)
  }, [animating])

  // estado visual de cada ilha durante a animação
  const visual = (i: number): TrailStatus => {
    if (!animating) return statuses[i]
    if (i === target - 1) return step === 'idle' ? 'current' : 'done'
    if (i === target) return step === 'open' ? 'current' : 'locked'
    return statuses[i]
  }
  const pinAt = animating && (step === 'idle' || step === 'done') ? target - 1 : animating ? target : currentIdx

  const tapIsland = (i: number) => {
    const t = TRAILS[i]
    const st = visual(i)
    if (animating) return
    if (st === 'locked') {
      sfx.locked()
      setShake((s) => s + 1)
      const prev = TRAILS[i - 1]
      toast(`Complete a ${prev.name} para abrir!`, 'icon-lock')
      speak(`Primeiro, vamos completar a ${prev.name}!`)
      return false
    }
    sfx.pop()
    go({ id: 'trail', params: { trail: t.id } })
    return true
  }

  return (
    <div className="scr home">
      <TopBar progress={progress} />

      <svg className="at home__path" style={box(0, 0, 1672, 941)} viewBox="0 0 1672 941" aria-hidden>
        {PATHS.map((d, i) => {
          const reached = i + 1 <= currentIdx
          const isNew = animating && i + 1 === target
          return (
            <g key={i}>
              <motion.path className="home__path-bg" d={d} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.4 }} />
              {(reached || isNew) && (
                <motion.path
                  className="home__path-on"
                  d={d}
                  initial={{ pathLength: isNew ? 0 : 1 }}
                  animate={{ pathLength: isNew && (step === 'idle' || step === 'done') ? 0 : 1 }}
                  transition={{ duration: 1.1, ease: 'easeInOut' }}
                />
              )}
            </g>
          )
        })}
      </svg>

      <Mascot pose="sit" shake={shake} celebrate={celebrate} className="placed home__mascot" style={place('mascot-sit', [0, 548, 178])} />

      {TRAILS.map((t, i) => (
        <Island key={t.id} trail={t} index={i} status={visual(i)} unlocking={animating && i === target ? step : null} finishing={animating && i === target - 1 && step === 'done'} onTap={() => tapIsland(i)} />
      ))}

      {/* marcador "Você está aqui" (avatar do estudante) */}
      <motion.div
        className="at home__pin"
        style={box(ISLANDS[pinAt].pin[0], ISLANDS[pinAt].pin[1], 92, 112, [ISLANDS[pinAt].pinP[0], ISLANDS[pinAt].pinP[1], 50, 61])}
        layout
        transition={{ layout: { duration: 1.1, ease: [0.4, 0, 0.2, 1] } }}
        initial={{ scale: 0, y: -20 }}
        animate={{ scale: 1, y: 0 }}
      >
        <motion.div className="home__pin-hop" key={pinAt} animate={step === 'travel' ? { y: ['0%', '-60%', '0%'] } : { y: ['0%', '-8%', '0%'] }} transition={step === 'travel' ? { duration: 1.1, ease: 'easeInOut' } : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>
          <span className="home__pin-ball">
            <MyAvatar />
          </span>
          <span className="home__pin-tag">Você</span>
        </motion.div>
      </motion.div>

      {/* holofote + faixa durante o desbloqueio */}
      <AnimatePresence>
        {animating && (step === 'shake' || step === 'open') && (
          <motion.div
            key="spot"
            className="spotlight"
            style={{
              ['--cx' as string]: ISLANDS[target].spot[0],
              ['--cy' as string]: ISLANDS[target].spot[1],
              ['--r' as string]: ISLANDS[target].spot[2],
              ['--pcx' as string]: ISLANDS[target].spotP[0],
              ['--pcy' as string]: ISLANDS[target].spotP[1],
              ['--pr' as string]: ISLANDS[target].spotP[2],
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
          />
        )}
        {animating && step === 'open' && (
          <motion.div key="banner" className="at unlock-banner" style={box(1010, 136, 560, 96, [25, 92, 340, 60])} initial={{ scale: 0, y: -30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.6, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }}>
            <span>Nova ilha desbloqueada!</span>
            <b>{TRAILS[target].name}</b>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="home__dock">
        {[
          { icon: 'icon-trophy', label: 'Conquistas', to: 'achievements' as const, b: box(745, 722, 190, 166, [22, 750, 106, 86]), badge: fresh },
          { icon: 'icon-picture', label: 'Mural', to: 'mural' as const, b: box(974, 722, 190, 166, [142, 750, 106, 86]), badge: 0 },
          { icon: 'icon-clipboard', label: 'Tarefas', to: 'tasks' as const, b: box(1200, 722, 190, 166, [262, 750, 106, 86]), badge: pendingTasks, sparks: true },
        ].map((d, i) => (
          <motion.button
            key={d.label}
            className="at ab dock-btn"
            style={d.b}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.3 + i * 0.08 }}
            whileHover={{ y: -8, scale: 1.04 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (animating) return
              sfx.pop()
              speak(d.label)
              go({ id: d.to })
            }}
            aria-label={d.label}
          >
            <Art name={d.icon} />
            {d.sparks && <Sparks className="dock-btn__sparks" />}
            {d.badge > 0 && (
              <motion.span className="dock-btn__badge" initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ delay: 0.9 + i * 0.1 }}>
                {d.badge}
              </motion.span>
            )}
          </motion.button>
        ))}
      </nav>
    </div>
  )
}

/* ---------------- ilha ---------------- */
function Island({
  trail,
  index,
  status,
  unlocking,
  finishing,
  onTap,
}: {
  trail: Trail
  index: number
  status: TrailStatus
  unlocking: Step | null
  finishing: boolean
  onTap: () => boolean | void
}) {
  const ctrl = useAnimationControls()
  const isl = ISLANDS[index]
  const isAbc = index === 0

  useEffect(() => {
    if (unlocking === 'shake') void ctrl.start({ rotate: [0, -5, 5, -4, 4, -3, 3, 0], x: [0, -6, 6, -4, 4, 0], transition: { duration: 0.75 } })
    if (unlocking === 'open') void ctrl.start({ scale: [1, 1.2, 0.95, 1.05, 1], transition: { duration: 0.9 } })
  }, [unlocking, ctrl])
  useEffect(() => {
    if (finishing) void ctrl.start({ scale: [1, 1.08, 1], transition: { duration: 0.6 } })
  }, [finishing, ctrl])

  return (
    <motion.button
      className={`placed home__isl home__isl--${status} ${isAbc ? 'home__isl--abc' : ''}`}
      style={place(isl.art, isl.p)}
      initial={{ scale: 0, y: 40 }}
      animate={{ scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 + index * 0.1 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      onClick={() => {
        if (onTap() === false) void ctrl.start({ x: [0, -10, 10, -7, 7, 0], rotate: [0, -3, 3, -2, 2, 0], transition: { duration: 0.5 } })
      }}
      aria-label={`${trail.name}${status === 'locked' ? ' (bloqueada)' : status === 'done' ? ' (concluída)' : ''}`}
    >
      <motion.div className={`float ${index ? 'float--slow' : ''}`} animate={ctrl}>
        {isAbc ? (
          <>
            <Art name="abc-island" />
            {status === 'current' && <span className="home__abc-glow" />}
            <span className="home__play home__play--abc">
              <PlayIcon />
            </span>
          </>
        ) : (
          <AnimatePresence initial={false} mode="popLayout">
            {status === 'locked' ? (
              <motion.div key="locked" exit={{ opacity: 0, transition: { duration: 0.25 } }}>
                <Art name={isl.art} />
              </motion.div>
            ) : (
              <motion.div key="open" className="isl-open" initial={unlocking ? { opacity: 0, scale: 0.9 } : false} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }}>
                <Art name="island-base" />
                <span className={`isl-open__tile ${status === 'current' ? 'is-current' : ''}`}>
                  <motion.span className="isl-open__icon" initial={unlocking ? { scale: 0, rotate: -40 } : false} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 12, delay: 0.15 }}>
                    <Art name={isl.icon!} />
                  </motion.span>
                </span>
                <span className="home__play home__play--small">
                  <PlayIcon />
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* cadeado voando no desbloqueio */}
        {unlocking === 'open' && (
          <motion.span
            className="isl-lock-fly"
            initial={{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }}
            animate={{ x: '120%', y: '-320%', rotate: 60, scale: 1.6, opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <Art name="icon-lock" />
          </motion.span>
        )}
        {unlocking === 'open' && (
          <>
            <span className="isl-ring" />
            <span className="isl-ring isl-ring--2" />
            <Twinkle className="isl-tw isl-tw--1" />
            <Twinkle className="isl-tw isl-tw--2" delay={0.25} />
            <Twinkle className="isl-tw isl-tw--3" delay={0.5} />
          </>
        )}
        {status === 'current' && !isAbc && <Sparks className="isl-sparks" />}
        {status === 'current' && isAbc && <Sparks className="home__sparks" />}

        <AnimatePresence>
          {status === 'done' && (
            <motion.span key="check" className={`isl-check ${isAbc ? 'isl-check--abc' : ''}`} initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 12 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="m4.5 12.5 5 5L19.5 7" />
              </svg>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M7 4.6v14.8a1.2 1.2 0 0 0 1.8 1l12.3-7.4a1.2 1.2 0 0 0 0-2L8.8 3.6A1.2 1.2 0 0 0 7 4.6Z" fill="currentColor" />
    </svg>
  )
}
