import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { speak } from '../../../shared/sound'
import Mascot from '../components/Mascot'
import TaskIcon from '../components/TaskIcon'
import { Celebrate, CountSum, Sequence, VowelHunt, WordBuilder, type Feedback } from '../components/activities'
import { Icon, Sparks, TopBar } from '../components/ui'
import { box, place } from '../assets'
import { useAlfa } from '../store'

const CONTENT: Record<string, { instruction: string; hint: string }> = {
  formar: { instruction: 'Arraste as letras e forme a palavra da imagem.', hint: 'Fale devagar: ca-sa. Casa começa com C!' },
  vogais: { instruction: 'Toque em todas as vogais e depois verifique.', hint: 'As vogais são A, E, I, O e U. Procure por elas!' },
  ciclo: { instruction: 'Toque nas figuras na ordem certa: do começo até a flor.', hint: 'Tudo começa com uma sementinha na terra!' },
  contando: { instruction: 'Conte as maçãs e escolha o resultado.', hint: 'Toque em cada maçã para contar em voz alta!' },
}

export default function TaskPlay({ id }: { id: string }) {
  const { state, back, backTo, updateTask, completeTask, answer, confetti } = useAlfa()
  const task = state.tasks.find((t) => t.id === id)!
  const c = CONTENT[id] ?? CONTENT.formar
  const [done, setDone] = useState<number | null>(null)
  const [celebrate, setCelebrate] = useState(0)
  const [shake, setShake] = useState(0)
  const [startAt] = useState(() => (id === 'contando' && (task.progress ?? 0) >= 50 && task.status !== 'concluida' ? 1 : 0))
  const lastP = useRef(task.progress ?? 0)

  useEffect(() => {
    const t = window.setTimeout(() => speak(`${task.title} ${c.instruction}`), 500)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onProgress = (p: number) => {
    if (task.status === 'concluida') return
    const pct = Math.round(p * 100)
    if (pct <= lastP.current || pct >= 100) return
    lastP.current = pct
    updateTask(id, { status: 'andamento', progress: pct })
  }
  const feedback = (f: Feedback) => {
    if (f === 'ok') setCelebrate((x) => x + 1)
    else {
      setShake((x) => x + 1)
    }
  }
  const solved = (firstTry: boolean) => {
    answer(firstTry)
    setDone(firstTry ? 3 : 2)
    confetti(0.5, 0.3, true)
  }
  const confettiAt = (x: number, y: number) => confetti(x, y)
  const common = { onSolved: solved, onFeedback: feedback, onProgress, hint: c.hint, confettiAt }

  return (
    <div className="scr taskplay">
      <TopBar onBack={back} progress={0.3} />
      <motion.section className="at glass taskplay__panel" style={box(185, 148, 1447, 752, [8, 96, 374, 740])} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 24 }}>
        <aside className="taskplay__side">
          <TaskIcon icon={task.icon} big />
          <span className="taskplay__subject">{task.subject}</span>
        </aside>
        <div className="taskplay__main">
          <header className="taskplay__head">
            <h1>{task.title}</h1>
            <button className="taskplay__instr" onClick={() => speak(c.instruction)}>
              <span className="taskplay__spk">
                <Icon.sound />
              </span>
              {c.instruction}
            </button>
          </header>
          <div className="taskplay__content">
            {id === 'formar' && <WordBuilder word="CASA" img="obj-house" {...common} />}
            {id === 'vogais' && <VowelHunt {...common} />}
            {id === 'ciclo' && <Sequence {...common} />}
            {id === 'contando' && <CountSum startAt={startAt} {...common} />}
          </div>
        </div>
      </motion.section>
      <Mascot pose="cheer" celebrate={celebrate} shake={shake} className="placed ab taskplay__mascot" style={place('mascot-cheer')} />
      <Sparks className="at taskplay__sparks" style={box(340, 395, 90, 75)} />

      <AnimatePresence>
        {done !== null && (
          <Celebrate
            title="Tarefa concluída!"
            subtitle={`Você terminou “${task.title}”. Seu professor vai adorar!`}
            stars={done}
            primary={{
              label: 'Voltar às tarefas',
              onClick: () => {
                completeTask(id, done)
                backTo({ id: 'tasks', params: { tab: 'concluida', highlight: id } })
              },
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
