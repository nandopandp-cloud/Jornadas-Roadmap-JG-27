import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { haptic, sfx, speak } from '../../../shared/sound'
import Mascot from '../components/Mascot'
import TalkBubble from '../components/TalkBubble'
import { Art, Btn, Sparks, TopBar } from '../components/ui'
import { AVATARS, findAvatar } from '../data'
import { useAlfa } from '../store'
import { box, place } from '../assets'

/** Escolha do avatar (logo depois da abertura, antes da Home). */
export default function AvatarSelect() {
  const { state, setAvatar, replace, confetti } = useAlfa()
  const [chosen, setChosen] = useState(false)
  const [wiggle, setWiggle] = useState(0)
  const selected = findAvatar(state.avatar)

  const pick = (id: string) => {
    if (chosen) return
    const a = findAvatar(id)
    sfx.pop()
    haptic(15)
    setAvatar(id)
    setWiggle((w) => w + 1)
    speak(a.say)
  }

  const go = () => {
    if (chosen) return
    setChosen(true)
    sfx.fanfare()
    confetti(0.7, 0.45, true)
    speak(`Oba! ${selected.name} vai com você nessa aventura! Vamos explorar!`)
    window.setTimeout(() => replace({ id: 'home' }), 1500)
  }

  return (
    <div className="scr avatar-sel">
      <TopBar hideRight />

      <Mascot pose="welcome" celebrate={chosen ? 1 : 0} className="placed avatar-sel__luno" style={place('mascot-welcome', [-30, 560, 220])} />
      <Sparks className="at" style={box(100, 262, 140, 110, [24, 500, 50, 40])} />
      <TalkBubble
        text="Agora, escolha um avatar para viver essa aventura com a gente!"
        style={box(282, 96, 462, 330, [150, 470, 230, 165])}
        delay={600}
      />

      <motion.section className="at glass avatar-sel__panel" style={box(742, 72, 870, 722, [10, 80, 370, 338])} initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 180, damping: 22, delay: 0.1 }}>
        <header className="avatar-sel__head">
          <Art name="icon-avatar" className="avatar-sel__icon" />
          <h1>Escolha o seu avatar</h1>
        </header>
        <p className="avatar-sel__sub">Ele vai te acompanhar em todas as suas conquistas!</p>

        <div className="avatar-grid">
          {AVATARS.map((a, i) => {
            const on = a.id === selected.id
            return (
              <motion.button
                key={a.id}
                className={`avatar-card ${on ? 'is-on' : ''}`}
                initial={{ opacity: 0, y: 30, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.25 + i * 0.07 }}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => pick(a.id)}
                aria-pressed={on}
                aria-label={a.name}
              >
                <motion.span
                  key={on ? `on-${wiggle}` : 'off'}
                  className="avatar-card__art"
                  animate={on ? { rotate: [0, -8, 7, -4, 0], y: ['0%', '-8%', '0%'] } : undefined}
                  transition={{ duration: 0.6 }}
                >
                  <Art name={a.art} />
                </motion.span>
                <span className="avatar-card__name">{a.name}</span>
                <AnimatePresence>
                  {on && (
                    <motion.span key="ok" className="avatar-card__check" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m4.5 12.5 5 5L19.5 7" />
                      </svg>
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            )
          })}
        </div>
      </motion.section>

      <motion.div className="at" style={box(933, 772, 450, 96, [150, 762, 228, 60])} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }}>
        <Btn className="fill avatar-sel__go" glow onClick={go}>
          Continuar
          <svg className="avatar-sel__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 5 7 7-7 7" />
          </svg>
        </Btn>
      </motion.div>
    </div>
  )
}
