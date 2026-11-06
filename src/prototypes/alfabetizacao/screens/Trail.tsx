import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import { useEffect, useState } from 'react'
import { haptic, sfx, speak } from '../../../shared/sound'
import Mascot from '../components/Mascot'
import { Art, SpeechBubble, Sparks, TopBar, Twinkle } from '../components/ui'
import { findTrail, type Trail as TrailT } from '../data'
import { useAlfa } from '../store'
import { box, place, type PBox } from '../assets'

/** última quantidade de fases vista em cada trilha (para animar só o que é novo) */
const lastSeen: Partial<Record<TrailT['id'], number>> = {}

/** caixas dos nós como na referência (bloco + base) e no retrato */
const NODES: { l: [number, number, number, number]; p: PBox }[] = [
  { l: [400, 352, 305, 330], p: [40, 150, 140, 158] },
  { l: [748, 386, 202, 228], p: [210, 150, 140, 158] },
  { l: [1036, 389, 204, 228], p: [40, 345, 140, 158] },
  { l: [1338, 389, 204, 228], p: [210, 345, 140, 158] },
]
/** pontos do caminho entre os nós (centro da base de cada nó, em px de design) */
const ROAD_X = [552, 849, 1138, 1440]
const ROAD_Y = 578

export default function Trail({ trail: trailId }: { trail?: string }) {
  const trail = findTrail(trailId)
  const { state, go, back, confetti } = useAlfa()
  const levels = trail.levels
  const done = Math.min(state.progress[trail.id], levels.length)
  const complete = done >= levels.length
  // nó que acabou de ser liberado nesta visita (anima uma vez)
  const [unlocking] = useState(() => {
    const prev = lastSeen[trail.id]
    return prev !== undefined && done > prev && done < levels.length ? done : -1
  })
  const [phase, setPhase] = useState<'idle' | 'road' | 'shake' | 'open'>(unlocking >= 0 ? 'road' : 'idle')
  const [celebrate, setCelebrate] = useState(0)

  useEffect(() => {
    lastSeen[trail.id] = done
  }, [trail.id, done])

  // sequência do desbloqueio: caminho enche → cadeado treme → cadeado voa e a fase acende
  useEffect(() => {
    if (unlocking < 0) return
    const t1 = window.setTimeout(() => {
      setPhase('shake')
      sfx.locked()
      haptic(20)
    }, 1300)
    const t2 = window.setTimeout(() => {
      setPhase('open')
      sfx.unlock()
      sfx.sparkle()
      setCelebrate((c) => c + 1)
      const n = NODES[unlocking].l
      confetti((n[0] + n[2] / 2) / 1672, (n[1] + n[3] / 3) / 941)
      speak(`Fase desbloqueada! Agora vamos aprender: ${levels[unlocking].title}!`)
    }, 2050)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [unlocking, levels, confetti])

  const text = complete
    ? `Uau! Você completou a ${trail.name}! Pode jogar de novo quando quiser.`
    : done === 0
      ? trail.welcome
      : `Agora vamos aprender: ${levels[done].title}!`

  // o caminho amarelo vai do 1º nó até o nó atual
  const reach = Math.min(done, levels.length - 1)
  const roadTo = (n: number) => (n <= 0 ? 0 : (ROAD_X[n] - ROAD_X[0]) / (ROAD_X[3] - ROAD_X[0]))
  const roadFrom = unlocking >= 0 ? roadTo(unlocking - 1) : roadTo(reach)

  return (
    <div className="scr trail">
      <TopBar onBack={back} progress={complete ? 1 : done / levels.length} />

      <svg className="at trail__road" style={box(0, 0, 1672, 941)} viewBox="0 0 1672 941" aria-hidden>
        <path className="trail__road-bg" d={`M${ROAD_X[0]} ${ROAD_Y} L${ROAD_X[3]} ${ROAD_Y}`} />
        <motion.path
          className="trail__road-on"
          d={`M${ROAD_X[0]} ${ROAD_Y} L${ROAD_X[3]} ${ROAD_Y}`}
          initial={{ pathLength: roadFrom }}
          animate={{ pathLength: roadTo(reach) }}
          transition={{ duration: 0.9, delay: 0.45, ease: 'easeInOut' }}
        />
      </svg>

      <Mascot pose="point" celebrate={celebrate} className="placed trail__mascot" style={place('mascot-point', [0, 600, 200])} />
      <SpeechBubble key={phase === 'open' ? 'open' : 'base'} auto={unlocking < 0} className="at" style={box(350, 150, 250, 132, [178, 640, 170, 90])} text={text} />

      {levels.map((lv, i) => {
        let status: 'done' | 'current' | 'locked' = i < done ? 'done' : i === done ? 'current' : 'locked'
        // durante a animação, o nó que vai abrir continua trancado até o cadeado sair
        if (i === unlocking && phase !== 'open') status = 'locked'
        return (
          <Node
            key={`${trail.id}-${lv.id}`}
            trail={trail}
            index={i}
            status={status}
            shaking={i === unlocking && phase === 'shake'}
            opened={i === unlocking && phase === 'open'}
            onOpen={() => go({ id: 'lesson', params: { trail: trail.id, level: i } })}
          />
        )
      })}
    </div>
  )
}

function Node({
  trail,
  index,
  status,
  shaking,
  opened,
  onOpen,
}: {
  trail: TrailT
  index: number
  status: 'done' | 'current' | 'locked'
  shaking: boolean
  opened: boolean
  onOpen: () => void
}) {
  const lv = trail.levels[index]
  const ctrl = useAnimationControls()
  const [x, y, w, h] = NODES[index].l
  const big = index === 0

  useEffect(() => {
    if (shaking) void ctrl.start({ rotate: [0, -7, 7, -6, 6, -4, 4, 0], transition: { duration: 0.7 } })
    if (opened) void ctrl.start({ scale: [1, 1.18, 0.96, 1.04, 1], transition: { duration: 0.8 } })
  }, [shaking, opened, ctrl])

  const tap = () => {
    if (status === 'locked') {
      sfx.locked()
      void ctrl.start({ x: [0, -10, 10, -6, 6, 0], transition: { duration: 0.45 } })
      speak('Essa fase ainda está trancada. Complete a anterior primeiro!')
      return
    }
    sfx.pop()
    onOpen()
  }

  return (
    <motion.button
      className={`at node node--${status} ${big ? 'node--big' : ''} ${opened ? 'is-opening' : ''}`}
      style={box(x, y, w, h, NODES[index].p)}
      initial={{ scale: 0, y: 30 }}
      animate={{ scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.2 + index * 0.1 }}
      whileTap={{ scale: 0.93 }}
      onClick={tap}
      aria-label={`${lv.title} — ${status === 'done' ? 'concluída' : status === 'current' ? 'jogar' : 'bloqueada'}`}
    >
      <motion.div animate={ctrl} className="node__inner">
        <span className="node__base" />
        <AnimatePresence>
          {status === 'current' && (
            <motion.span key="play" className="node__play" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 14, delay: opened ? 0.25 : 0 }}>
              <svg viewBox="0 0 24 24">
                <path d="M7 4.6v14.8a1.2 1.2 0 0 0 1.8 1l12.3-7.4a1.2 1.2 0 0 0 0-2L8.8 3.6A1.2 1.2 0 0 0 7 4.6Z" fill="currentColor" />
              </svg>
            </motion.span>
          )}
        </AnimatePresence>
        <motion.span className="node__tile" animate={status === 'current' ? { y: ['0%', '-5%', '0%'] } : { y: '0%' }} transition={{ duration: 1.8, repeat: status === 'current' ? Infinity : 0, ease: 'easeInOut' }}>
          {lv.node.letter ? <span className="node__letter">{lv.node.letter}</span> : <Art name={lv.node.img!} />}
          <AnimatePresence>
            {status === 'locked' && (
              <motion.span
                key="lock"
                className="node__lock"
                exit={{ y: '-260%', x: '60%', rotate: 50, scale: 1.5, opacity: 0, transition: { duration: 0.75, ease: 'easeOut' } }}
              >
                <Art name="icon-lock" />
              </motion.span>
            )}
          </AnimatePresence>
          {status === 'done' && (
            <motion.span className="node__check" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring', stiffness: 400, damping: 12 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="m4.5 12.5 5 5L19.5 7" />
              </svg>
            </motion.span>
          )}
        </motion.span>
        {status === 'current' && <Sparks className="node__sparks" />}
        {opened && (
          <>
            <span className="node__ring" />
            <span className="node__ring node__ring--2" />
            <Twinkle className="node__tw node__tw--1" />
            <Twinkle className="node__tw node__tw--2" delay={0.3} />
            <Twinkle className="node__tw node__tw--3" delay={0.6} />
            <motion.span className="node__new" initial={{ scale: 0, y: 10 }} animate={{ scale: [0, 1.25, 1], y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
              Desbloqueado!
            </motion.span>
          </>
        )}
      </motion.div>
    </motion.button>
  )
}
