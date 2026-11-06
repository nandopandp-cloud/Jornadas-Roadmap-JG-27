import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import { useEffect, useState } from 'react'
import { sfx, speak } from '../../../shared/sound'
import Mascot from '../components/Mascot'
import { Art, Badge, Btn, Icon, Sparks, TopBar, Twinkle } from '../components/ui'
import { ACHIEVEMENTS, type Achievement } from '../data'
import { useAlfa } from '../store'
import { box, place } from '../assets'

const PER_PAGE = 6

export default function Achievements() {
  const { state, back, markSeen } = useAlfa()
  const [fresh] = useState(() => state.unlocked.filter((a) => !state.seen.includes(a)))
  const [page, setPage] = useState(0)
  const [dir, setDir] = useState(1)
  const [detail, setDetail] = useState<Achievement | null>(null)
  const pages = Math.ceil(ACHIEVEMENTS.length / PER_PAGE)
  const items = ACHIEVEMENTS.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE)
  const count = state.unlocked.length

  useEffect(() => {
    const t = window.setTimeout(markSeen, 600)
    const s = window.setTimeout(() => speak(`Você já tem ${count} conquistas! Toque numa medalha para ver.`), 700)
    return () => {
      window.clearTimeout(t)
      window.clearTimeout(s)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const goPage = (p: number) => {
    if (p < 0 || p >= pages || p === page) return
    sfx.whoosh()
    setDir(p > page ? 1 : -1)
    setPage(p)
  }

  return (
    <div className="scr ach">
      <TopBar onBack={back} hideRight />

      <motion.div className="placed ach__banner" style={place('banner-conquistas', [40, 82, 310])} initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
        <Art name="banner-conquistas" />
        <span className="ach__shine" />
      </motion.div>

      <Mascot pose="arms" anchored={false} className="placed ach__mascot" style={place('mascot-arms', [8, 150, 150])} />
      <Sparks className="at" style={box(290, 195, 105, 110, [128, 150, 46, 48])} />

      <motion.div className="at ach__count" style={box(78, 658, 384, 197, [16, 260, 358, 92])} initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
        <Art name="icon-count-star" className="ach__count-star" />
        <div>
          <motion.strong key={count} initial={{ scale: 1.6 }} animate={{ scale: 1 }}>
            {count}
          </motion.strong>
          <span>
            Conquistas
            <br />
            recebidas
          </span>
        </div>
      </motion.div>

      <motion.section className="at glass ach__panel" style={box(505, 255, 1062, 596, [10, 368, 370, 468])} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <AnimatePresence mode="popLayout" custom={dir} initial={false}>
          <motion.div
            key={page}
            className="ach__grid"
            initial={{ x: 120 * dir, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -120 * dir, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.3}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) goPage(page + 1)
              else if (info.offset.x > 60) goPage(page - 1)
            }}
          >
            {items.map((a, i) => (
              <Medal key={a.id} a={a} index={i} unlocked={state.unlocked.includes(a.id)} isNew={fresh.includes(a.id)} onOpen={() => setDetail(a)} />
            ))}
          </motion.div>
        </AnimatePresence>
        <div className="dots">
          {Array.from({ length: pages }).map((_, i) => (
            <button key={i} className={`dots__d ${i === page ? 'is-on' : ''}`} onClick={() => goPage(i)} aria-label={`Página ${i + 1}`} />
          ))}
        </div>
        {page > 0 && <Btn variant="icon" className="ach__arrow ach__arrow--l" icon={<Icon.back />} onClick={() => goPage(page - 1)} aria-label="Anterior" />}
        {page < pages - 1 && <Btn variant="icon" className="ach__arrow ach__arrow--r" icon={<Icon.back />} onClick={() => goPage(page + 1)} aria-label="Próxima" />}
      </motion.section>

      <AnimatePresence>
        {detail && (
          <motion.div key="detail" className="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDetail(null)}>
            <motion.div
              className="sheet"
              initial={{ scale: 0.6, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div className="sheet__badge" animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 2.2, repeat: Infinity }}>
                <Badge a={detail} locked={!state.unlocked.includes(detail.id)} />
              </motion.div>
              <h3>{detail.title}</h3>
              <p>{state.unlocked.includes(detail.id) ? detail.desc : detail.how}</p>
              {!state.unlocked.includes(detail.id) && <span className="sheet__tag">Ainda bloqueada</span>}
              <Btn onClick={() => setDetail(null)} icon={<Icon.check />}>
                Legal!
              </Btn>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Medal({ a, index, unlocked, isNew, onOpen }: { a: Achievement; index: number; unlocked: boolean; isNew: boolean; onOpen: () => void }) {
  const ctrl = useAnimationControls()
  return (
    <motion.button
      className={`medal ${unlocked ? 'is-on' : 'is-off'}`}
      initial={{ scale: 0, rotate: -20 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.1 + index * 0.07 }}
      whileHover={{ y: -6, scale: 1.04 }}
      whileTap={{ scale: 0.92 }}
      onClick={() => {
        if (unlocked) {
          sfx.sparkle()
          speak(`${a.title}! ${a.desc}`)
        } else {
          sfx.locked()
          void ctrl.start({ x: [0, -8, 8, -5, 5, 0], transition: { duration: 0.4 } })
          speak(a.how)
        }
        onOpen()
      }}
      aria-label={a.title}
    >
      <motion.div animate={ctrl} className="medal__inner">
        {unlocked ? (
          <motion.div className="medal__float" animate={{ y: ['0%', '-3%', '0%'] }} transition={{ duration: 2.6 + index * 0.2, repeat: Infinity, ease: 'easeInOut' }}>
            <Badge a={a} />
            <span className="medal__glint" />
          </motion.div>
        ) : (
          <Badge a={a} locked />
        )}
      </motion.div>
      {unlocked && (
        <>
          <Twinkle className="medal__tw medal__tw--1" delay={index * 0.3} />
          <Twinkle className="medal__tw medal__tw--2" delay={index * 0.3 + 0.8} />
        </>
      )}
      {isNew && (
        <motion.span className="medal__new" initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ delay: 0.6 }}>
          NOVA!
        </motion.span>
      )}
    </motion.button>
  )
}
