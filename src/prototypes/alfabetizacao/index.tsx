import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { PrototypeProps } from '../../platform/journeys'
import { unlockAudio } from '../../shared/sound'
import { AlfaProvider, screenKey, type Screen, type ScreenId } from './store'
import { ConfettiLayer, Scene, Toasts, type BgName } from './components/ui'
import AchievementModal from './components/AchievementModal'
import Intro from './screens/Intro'
import AvatarSelect from './screens/AvatarSelect'
import Home from './screens/Home'
import Trail from './screens/Trail'
import Lesson from './screens/Lesson'
import Achievements from './screens/Achievements'
import Mural from './screens/Mural'
import NewProduction from './screens/NewProduction'
import Create from './screens/Create'
import Review from './screens/Review'
import Published from './screens/Published'
import Tasks from './screens/Tasks'
import TaskPlay from './screens/TaskPlay'
import './alfa.css'

const VALID: ScreenId[] = ['avatar', 'home', 'trail', 'tasks', 'mural', 'new-production', 'achievements']

const BG: Partial<Record<ScreenId, BgName>> = { home: 'home', trail: 'trail', avatar: 'home' }

function renderScreen(s: Screen) {
  switch (s.id) {
    case 'avatar':
      return <AvatarSelect />
    case 'home':
      return <Home />
    case 'trail':
      return <Trail trail={s.params?.trail as string | undefined} />
    case 'lesson':
      return <Lesson trail={s.params?.trail as string | undefined} level={Number(s.params?.level ?? 0)} />
    case 'achievements':
      return <Achievements />
    case 'mural':
      return <Mural tab={(s.params?.tab as 'turma' | 'minhas') ?? 'turma'} />
    case 'new-production':
      return <NewProduction />
    case 'create':
      return <Create />
    case 'review':
      return <Review />
    case 'published':
      return <Published />
    case 'tasks':
      return <Tasks tab={(s.params?.tab as string) ?? 'pendente'} highlight={s.params?.highlight as string | undefined} />
    case 'task':
      return <TaskPlay id={String(s.params?.id)} />
    default:
      return <Home />
  }
}

export default function Alfabetizacao({ startScreen }: PrototypeProps) {
  // sem atalho (ou com “abertura”), o protótipo começa pela animação de abertura e segue para a escolha do avatar
  const withIntro = !startScreen || startScreen === 'abertura'
  const start: ScreenId = withIntro ? 'avatar' : VALID.includes(startScreen as ScreenId) ? (startScreen as ScreenId) : 'home'
  const [intro, setIntro] = useState(withIntro)
  const [started, setStarted] = useState(!withIntro)

  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault()
    document.addEventListener('gesturestart', prevent)
    return () => document.removeEventListener('gesturestart', prevent)
  }, [])

  return (
    <AlfaProvider start={start}>
      {({ state }) => {
        const current = state.stack[state.stack.length - 1]
        const bg: BgName = BG[current.id] ?? 'meadow'
        return (
          <div className="alfa" onPointerDownCapture={unlockAudio}>
            <Scene bg={bg} blur={state.queue.length > 0 && started} />
            <AnimatePresence mode="wait" initial={false}>
              {started && (
                <motion.div
                  key={screenKey(current)}
                  className="screen"
                  initial={{ opacity: 0, x: 50 * state.dir }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 * state.dir, transition: { duration: 0.16, ease: 'easeIn' } }}
                  transition={{ type: 'spring', stiffness: 260, damping: 30, mass: 0.8 }}
                >
                  {renderScreen(current)}
                </motion.div>
              )}
            </AnimatePresence>
            {intro && <Intro onReveal={() => setStarted(true)} onDone={() => setIntro(false)} />}
            {started && <AchievementModal />}
            <ConfettiLayer />
            <Toasts />
          </div>
        )
      }}
    </AlfaProvider>
  )
}
