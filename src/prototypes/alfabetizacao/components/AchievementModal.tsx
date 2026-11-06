import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { sfx, speak } from '../../../shared/sound'
import { findAchievement } from '../data'
import { useAlfa } from '../store'
import { box } from '../assets'
import Mascot from './Mascot'
import { Art, Badge, Btn, Icon, Twinkle } from './ui'

const HOLD_ON = ['lesson', 'task', 'create', 'review', 'new-production']

export default function AchievementModal() {
  const { state, dismissAchievement, go, confetti } = useAlfa()
  const current = state.stack[state.stack.length - 1]
  const id = state.queue[0]
  const [visible, setVisible] = useState<string | null>(null)

  useEffect(() => {
    // espera a animação de desbloqueio da ilha terminar na Home
    if (!id || HOLD_ON.includes(current.id) || state.pendingUnlock) {
      setVisible(null)
      return
    }
    const t = window.setTimeout(() => setVisible(id), current.id === 'published' ? 2400 : current.id === 'trail' ? 3600 : 650)
    return () => window.clearTimeout(t)
  }, [id, current.id, state.pendingUnlock])

  useEffect(() => {
    if (!visible) return
    const a = findAchievement(visible)
    sfx.fanfare()
    const t1 = window.setTimeout(() => confetti(0.5, 0.35, true), 350)
    const t2 = window.setTimeout(() => speak(`Conquista desbloqueada! ${a.title}! ${a.desc}`), 900)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [visible, confetti])

  const a = visible ? findAchievement(visible) : null
  const close = () => {
    setVisible(null)
    window.setTimeout(dismissAchievement, 250)
  }
  // a mascote da referência abraça a medalha-estrela; para as outras, a medalha é sobreposta
  const own = a?.id === 'mestre-letras'

  return (
    <AnimatePresence>
      {a && (
        <motion.div key="ach" className="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close}>
          <motion.div
            className="at mcard"
            style={box(255, 212, 1155, 568, [15, 150, 360, 560])}
            role="dialog"
            aria-label={`Conquista desbloqueada: ${a.title}`}
            initial={{ scale: 0.4, rotate: -5, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 260, damping: 16 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mcard__art">
              <div className="rays" />
              <Twinkle className="mcard__tw mcard__tw--1" />
              <Twinkle className="mcard__tw mcard__tw--2" delay={0.5} />
              <Twinkle className="mcard__tw mcard__tw--3" delay={1} />
              <Twinkle className="mcard__tw mcard__tw--4" delay={0.3} />
              <Mascot pose="hug" celebrate={1} className="mcard__mascot mcard__mascot--hug" />
              {!own && (
                <motion.div className="mcard__badge" initial={{ scale: 0, rotate: -120 }} animate={{ scale: [0, 1.2, 1], rotate: 0 }} transition={{ delay: 0.35, duration: 0.8, ease: 'backOut' }}>
                  <Badge a={a} />
                </motion.div>
              )}
            </div>
            <div className="mcard__body">
              <motion.div className="mcard__ribbon" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 18 }}>
                <Art name="ribbon-unlocked" />
              </motion.div>
              <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                {a.title}
              </motion.h2>
              <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                {a.desc}
              </motion.p>
              <motion.div className="mcard__actions" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.65 }}>
                <Btn icon={<Icon.play />} glow className="mcard__cta" onClick={close}>
                  Continuar
                </Btn>
                {current.id !== 'achievements' && (
                  <button
                    className="linkbtn"
                    onClick={() => {
                      close()
                      window.setTimeout(() => go({ id: 'achievements' }), 300)
                    }}
                  >
                    Ver minhas conquistas
                  </button>
                )}
              </motion.div>
            </div>
            <Btn variant="icon" className="mcard__x" aria-label="Fechar" icon={<Icon.close />} onClick={close} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
