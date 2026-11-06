import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { sfx, speak } from '../../../shared/sound'
import Mascot from '../components/Mascot'
import { Celebrate, LetterChallenge, PickChallenge, WordBuilder, WordPick, type Feedback } from '../components/activities'
import { Art, Btn, Icon, SpeechBubble, Sparks, TopBar, Twinkle } from '../components/ui'
import { TRAILS, findTrail } from '../data'
import { useAlfa } from '../store'
import { box, place } from '../assets'

type Phase = 'intro' | 'challenge' | 'done'

export default function Lesson({ trail: trailId, level }: { trail?: string; level: number }) {
  const trail = findTrail(trailId)
  const lv = trail.levels[level] ?? trail.levels[0]
  const isLast = level === trail.levels.length - 1
  const nextTrail = TRAILS[TRAILS.indexOf(trail) + 1]
  const { back, backTo, completeLevel, answer, confetti } = useAlfa()
  const [phase, setPhase] = useState<Phase>('intro')
  const [stars, setStars] = useState(3)
  const [celebrate, setCelebrate] = useState(0)
  const [shake, setShake] = useState(0)
  const progress = phase === 'intro' ? 0 : phase === 'challenge' ? 0.32 : 1

  const feedback = (f: Feedback) => {
    if (f === 'ok') setCelebrate((c) => c + 1)
    else setShake((s) => s + 1)
  }
  const solved = (firstTry: boolean) => {
    answer(firstTry)
    setStars(firstTry ? 3 : 2)
    setPhase('done')
    confetti(0.5, 0.3, true)
  }
  const confettiAt = (x: number, y: number) => confetti(x, y)
  // última fase: volta para a Home, onde acontece a animação de desbloqueio da próxima trilha
  const finish = () => {
    completeLevel(trail.id, level)
    if (isLast) backTo({ id: 'home' })
    else backTo({ id: 'trail', params: { trail: trail.id } })
  }
  const ch = lv.challenge

  return (
    <div className={`scr lesson lesson--${phase} lesson--${ch.type}`}>
      <TopBar onBack={back} progress={progress} hideLogo={phase === 'intro'} />

      <AnimatePresence mode="wait">
        {phase === 'intro' ? (
          <motion.div key="intro" className="layer" exit={{ opacity: 0, transition: { duration: 0.15 } }}>
            <Mascot pose="present" celebrate={celebrate} className="placed ab lesson__mascot" style={place('mascot-present', [0, 600, 220])} />
            <SpeechBubble className="at" style={box(298, 155, 357, 192, [190, 610, 180, 96])} text={lv.intro.say} />

            <motion.button
              className="at intro-card"
              style={box(668, 238, 492, 470, [70, 150, 250, 240])}
              initial={{ scale: 0.6, rotate: -6, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 220, damping: 13, delay: 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96, rotate: -2 }}
              onClick={() => {
                sfx.pop()
                setCelebrate((c) => c + 1)
                speak(lv.intro.word.length > 1 ? `${lv.intro.syllables.join(', ')}. ${lv.intro.word.toLowerCase()}!` : `Letra ${lv.intro.word}!`)
              }}
              aria-label={`Ouvir ${lv.intro.word}`}
            >
              <span className="intro-card__plate" />
              <span className="intro-card__face">
                <motion.span className="intro-card__art" animate={{ y: ['0%', '-4%', '0%'], rotate: [0, 1.5, 0, -1.5, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                  {lv.intro.letter ? <span className="intro-card__letter">{lv.intro.letter}</span> : <Art name={lv.intro.img!} />}
                </motion.span>
              </span>
              <Sparks className="intro-card__sparks" />
            </motion.button>
            <Twinkle className="at" style={box(1128, 200, 64, 64, [312, 130, 34, 34])} />
            <Twinkle className="at" style={box(1196, 500, 52, 52, [326, 330, 24, 24])} delay={0.6} />
            <Twinkle className="at" style={box(604, 355, 30, 30, [50, 200, 20, 20])} delay={1.1} />
            <Twinkle className="at" style={box(625, 600, 30, 30, [52, 330, 16, 16])} delay={0.3} />

            <motion.div className="at" style={box(668, 716, 467, 160, [80, 410, 230, 78])} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45 }}>
              <Btn className="big-play" glow icon={<Icon.play />} aria-label="Começar o desafio" onClick={() => setPhase('challenge')} />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div key="challenge" className="layer" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {ch.type !== 'build' && <Mascot pose="fists" celebrate={celebrate} shake={shake} className="placed ab lesson__mascot" style={place('mascot-fists', [0, 620, 190])} />}
            {ch.type !== 'build' && <Sparks className="at ab" style={box(345, 460, 85, 100, [150, 610, 44, 50])} />}
            <SpeechBubble className="at" style={ch.type === 'build' ? box(105, 160, 300, 160, [200, 160, 170, 90]) : box(105, 245, 362, 215, [190, 640, 180, 96])} text={ch.say} />

            {ch.type === 'pick' && (
              <div className="at pick-row" style={box(457, 368, 1083, 362, [14, 230, 362, 124])}>
                <PickChallenge options={ch.options} hint={ch.hint} onSolved={solved} onFeedback={feedback} confettiAt={confettiAt} />
              </div>
            )}
            {ch.type === 'word' && (
              <div className="at pick-row pick-row--letter" style={box(457, 170, 1083, 600, [14, 190, 362, 360])}>
                <WordPick img={ch.img} options={ch.options} hint={ch.hint} onSolved={solved} onFeedback={feedback} confettiAt={confettiAt} />
              </div>
            )}
            {ch.type === 'letter' && (
              <div className="at pick-row pick-row--letter" style={box(457, 200, 1083, 560, [14, 190, 362, 330])}>
                <LetterChallenge word={ch.word} img={lv.intro.img} options={ch.options} hint={ch.hint} onSolved={solved} onFeedback={feedback} confettiAt={confettiAt} />
              </div>
            )}
            {ch.type === 'build' && (
              <motion.section className="at panel lesson__panel" style={box(470, 210, 1150, 680, [10, 270, 370, 560])} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                <WordBuilder word={ch.word} img={ch.img} hint={ch.hint} onSolved={solved} onFeedback={feedback} confettiAt={confettiAt} />
              </motion.section>
            )}
            {ch.type === 'build' && <Mascot pose="cheer" celebrate={celebrate} shake={shake} className="placed ab lesson__mascot lesson__mascot--build" style={place('mascot-cheer', [0, 600, 160])} />}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'done' && (
          <Celebrate
            title={isLast ? 'Trilha completa!' : stars === 3 ? 'Incrível!' : 'Muito bem!'}
            subtitle={
              isLast
                ? nextTrail
                  ? `Você completou a ${trail.name}! Uma nova ilha está esperando por você.`
                  : `Você completou a ${trail.name}! Você é um gênio!`
                : `Você completou a fase ${lv.title}!`
            }
            stars={stars}
            primary={{ label: isLast ? 'Ver minha nova ilha' : 'Continuar', onClick: finish }}
            secondary={{
              label: 'Jogar de novo',
              onClick: () => {
                completeLevel(trail.id, level)
                setPhase('intro')
              },
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
