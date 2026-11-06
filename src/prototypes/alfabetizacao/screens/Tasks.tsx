import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { sfx, speak } from '../../../shared/sound'
import Mascot from '../components/Mascot'
import TaskIcon from '../components/TaskIcon'
import { Art, Btn, Icon, Sparks, Stars, TopBar } from '../components/ui'
import { box, place } from '../assets'
import type { Task, TaskStatus } from '../data'
import { useAlfa } from '../store'

const TABS: { id: TaskStatus; label: string; icon: () => React.ReactElement; empty: string }[] = [
  { id: 'pendente', label: 'Pendentes', icon: Icon.clipboard, empty: 'Oba! Nenhuma tarefa pendente.' },
  { id: 'andamento', label: 'Em andamento', icon: Icon.refresh, empty: 'Nenhuma tarefa em andamento.' },
  { id: 'concluida', label: 'Concluídas', icon: Icon.check, empty: 'Você ainda não concluiu tarefas.' },
]

export default function Tasks({ tab: initial, highlight }: { tab: string; highlight?: string }) {
  const { state, back, go } = useAlfa()
  const [tab, setTab] = useState<TaskStatus>((initial as TaskStatus) || 'pendente')
  const [done, setDone] = useState<Task | null>(null)
  const list = state.tasks.filter((t) => t.status === tab)
  const count = (s: TaskStatus) => state.tasks.filter((t) => t.status === s).length

  useEffect(() => {
    const t = window.setTimeout(
      () => speak(highlight ? 'Tarefa concluída! Ela está agora na aba concluídas.' : 'Confira as atividades que o seu professor enviou!'),
      500,
    )
    return () => window.clearTimeout(t)
  }, [highlight])

  const open = (t: Task) => {
    sfx.pop()
    if (t.playable) go({ id: 'task', params: { id: t.id } })
    else setDone(t)
  }

  return (
    <div className="scr tasks">
      <TopBar onBack={back} progress={0.3} />
      <motion.div className="at tasks__shape" style={box(265, 148, 1368, 735, [8, 96, 374, 740])} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 24 }}>
        <svg viewBox="0 0 1368 735" preserveAspectRatio="none" aria-hidden>
          <path d="M70 2 H1160 C1200 2 1230 30 1236 70 L1244 112 C1250 140 1270 152 1300 152 C1340 152 1366 180 1366 220 V665 C1366 704 1334 733 1296 733 H70 C32 733 2 704 2 665 V72 C2 32 32 2 70 2Z" />
        </svg>
      </motion.div>
      <Mascot pose="cheer" className="placed ab tasks__mascot" style={place('mascot-cheer')} />
      <Sparks className="at tasks__sparks" style={box(282, 300, 98, 108)} />
      <motion.header className="at panel-head" style={box(378, 155, 900, 140, [22, 108, 346, 80])} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
        <motion.span className="panel-head__icon panel-head__icon--tasks" animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 2.6, repeat: Infinity }}>
          <Art name="icon-tasks" />
        </motion.span>
        <div>
          <h1>Tarefas</h1>
          <p>Confira as atividades que o seu professor(a) enviou!</p>
        </div>
      </motion.header>
      <motion.section className="at tasks__inner" style={box(355, 300, 1250, 570, [18, 196, 354, 630])} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <div className="tabs" role="tablist">
            {TABS.map((t) => {
              const I = t.icon
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={tab === t.id}
                  className={`tabs__btn ${tab === t.id ? 'is-on' : ''}`}
                  onClick={() => {
                    if (tab === t.id) return
                    sfx.tap()
                    setTab(t.id)
                    speak(t.label)
                  }}
                >
                  {tab === t.id && <motion.span layoutId="task-tab" className="tabs__pill" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                  <span className="tabs__icon">
                    <I />
                  </span>
                  <span className="tabs__label">{t.label}</span>
                  <motion.span key={count(t.id)} className="tabs__count" initial={{ scale: 1.5 }} animate={{ scale: 1 }}>
                    {count(t.id)}
                  </motion.span>
                </button>
              )
            })}
          </div>

          <div className="tasks__scroll">
            <AnimatePresence mode="wait">
              <motion.ul key={tab} className="tasks__list" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.22 }}>
                {list.length === 0 && (
                  <li className="tasks__empty">
                    <Art name="icon-count-star" />
                    {TABS.find((t) => t.id === tab)!.empty}
                  </li>
                )}
                {list.map((t, i) => (
                  <motion.li
                    key={t.id}
                    className={`trow ${t.id === highlight ? 'is-new' : ''}`}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 22, delay: i * 0.06 }}
                    whileHover={{ x: 4 }}
                    onClick={() => open(t)}
                  >
                    <TaskIcon icon={t.icon} />
                    <div className="trow__text">
                      <strong>{t.title}</strong>
                      <span>{t.subject}</span>
                    </div>
                    <div className="trow__status">
                      {t.status === 'pendente' && (
                        <span className="chip chip--date">
                          <Icon.calendar />
                          {t.due}
                        </span>
                      )}
                      {t.status === 'andamento' && (
                        <span className="tprog">
                          <span className="tprog__label">Em andamento</span>
                          <span className="tprog__row">
                            <span className="tprog__track">
                              <motion.i initial={{ width: 0 }} animate={{ width: `${t.progress ?? 0}%` }} transition={{ delay: 0.3, type: 'spring', stiffness: 80, damping: 16 }} />
                            </span>
                            <b>{t.progress ?? 0}%</b>
                          </span>
                        </span>
                      )}
                      {t.status === 'concluida' && (
                        <span className="chip chip--done">
                          <Icon.check />
                          Concluída
                        </span>
                      )}
                    </div>
                    <motion.button
                      className="play-btn"
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        open(t)
                      }}
                      aria-label={`Abrir ${t.title}`}
                    >
                      <Icon.play />
                    </motion.button>
                    {t.id === highlight && <span className="trow__new">Nova!</span>}
                  </motion.li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>
      </motion.section>

      <AnimatePresence>
        {done && (
          <motion.div className="sheet-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDone(null)}>
            <motion.div className="sheet" initial={{ scale: 0.6, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }} onClick={(e) => e.stopPropagation()}>
              <TaskIcon icon={done.icon} />
              <h3>{done.title}</h3>
              <Stars n={done.stars ?? 3} animate />
              <p>
                Você concluiu esta tarefa em {done.doneAt}.<br />O seu professor(a) já viu. Parabéns!
              </p>
              <Btn icon={<Icon.check />} onClick={() => setDone(null)}>
                Legal!
              </Btn>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
