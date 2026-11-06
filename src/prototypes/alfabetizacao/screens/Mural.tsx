import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { sfx, speak, stopSpeaking } from '../../../shared/sound'
import Mascot from '../components/Mascot'
import ProductionArt from '../components/ProductionArt'
import { Art, AvatarArt, Btn, Icon, TopBar } from '../components/ui'
import { box, place } from '../assets'
import type { Production } from '../data'
import { useAlfa } from '../store'

export default function Mural({ tab: initialTab }: { tab: 'turma' | 'minhas' }) {
  const { state, back, go, setDraft } = useAlfa()
  const [tab, setTab] = useState(initialTab)
  const [open, setOpen] = useState<string | null>(null)
  const list = state.productions.filter((p) => (tab === 'turma' ? !p.mine || p.shared : p.mine))
  const opened = state.productions.find((p) => p.id === open) ?? null

  useEffect(() => {
    const t = window.setTimeout(() => speak(tab === 'turma' ? 'Veja os trabalhinhos da sua turma!' : 'Aqui ficam os seus trabalhinhos.'), 500)
    return () => window.clearTimeout(t)
  }, [tab])

  return (
    <div className="scr mural">
      <TopBar onBack={back} progress={0.3} />
      <motion.div className="placed mural__icon" style={place('icon-frame', [62, 92, 82])} initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 13 }}>
        <motion.div animate={{ rotate: [-4, 3, -4] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
          <Art name="icon-frame" />
        </motion.div>
      </motion.div>
      <motion.h1 className="at mural__title" style={box(805, 140, 330, 96, [152, 90, 200, 44])} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
        Mural
      </motion.h1>
      <motion.p className="at mural__sub" style={box(733, 246, 420, 40, [152, 134, 230, 22])} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
        Veja as produções da sua turma!
      </motion.p>

      <motion.section className="at glass mural__panel" style={box(32, 296, 1608, 610, [8, 176, 374, 660])} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 24, delay: 0.1 }}>
        <div className="mural__bar">
          <div className="seg">
            {(
              [
                ['minhas', 'Meus trabalhinhos', <Icon.user key="m" />],
                ['turma', 'Trabalhinhos da turma', <Icon.users key="u" />],
              ] as const
            ).map(([id, label, icon]) => (
              <button
                key={id}
                className={`seg__btn ${tab === id ? 'is-on' : ''}`}
                onClick={() => {
                  if (tab === id) return
                  sfx.tap()
                  setTab(id)
                }}
              >
                {tab === id && <motion.span layoutId="mural-seg" className="seg__pill" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                <span className="seg__icon">{icon}</span>
                <span className="seg__label">{label}</span>
              </button>
            ))}
          </div>
          <Btn
            icon={<Icon.plus />}
            className="mural__new"
            onClick={() => {
              setDraft(null)
              go({ id: 'new-production' })
            }}
          >
            Nova Produção
          </Btn>
        </div>

        <div className="mural__scroll">
          <AnimatePresence mode="wait">
            <motion.div key={tab} className="mural__grid" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {list.length === 0 ? (
                <div className="empty">
                  <Mascot pose="point" className="empty__mascot" />
                  <div>
                    <h3>Você ainda não publicou nada</h3>
                    <p>Que tal fazer um desenho bem bonito para a turma?</p>
                    <Btn
                      icon={<Icon.pencil />}
                      onClick={() => {
                        setDraft(null)
                        go({ id: 'new-production' })
                      }}
                    >
                      Criar minha produção
                    </Btn>
                  </div>
                </div>
              ) : (
                list.map((p, i) => <Card key={p.id} p={p} i={i} isNew={p.id === state.lastPublished} onOpen={() => setOpen(p.id)} />)
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.section>

      <AnimatePresence>{opened && <Detail p={opened} onClose={() => setOpen(null)} />}</AnimatePresence>
    </div>
  )
}

function Card({ p, i, isNew, onOpen }: { p: Production; i: number; isNew: boolean; onOpen: () => void }) {
  return (
    <motion.article
      className={`pcard ${isNew ? 'is-new' : ''}`}
      initial={{ opacity: 0, y: 40, rotate: i % 2 ? 3 : -3 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.08 * i }}
      whileHover={{ y: -8, rotate: i % 2 ? 1 : -1 }}
      layout
    >
      <button
        className="pcard__art"
        onClick={() => {
          sfx.pop()
          onOpen()
        }}
        aria-label={`Abrir ${p.title}`}
      >
        <ProductionArt p={p} />
        {isNew && <span className="pcard__new">Nova!</span>}
        {p.mine && !p.shared && <span className="pcard__private">Só para mim</span>}
      </button>
      <div className="pcard__foot">
        <AvatarArt art={p.avatar} className="pcard__avatar" />
        <div className="pcard__meta">
          <strong>{p.author}</strong>
          <span>{p.title}</span>
        </div>
        <LikeButton p={p} />
      </div>
    </motion.article>
  )
}

export function LikeButton({ p, big }: { p: Production; big?: boolean }) {
  const { toggleLike } = useAlfa()
  const [burst, setBurst] = useState(0)
  return (
    <motion.button
      className={`like ${p.liked ? 'is-on' : ''} ${big ? 'like--big' : ''}`}
      whileTap={{ scale: 0.8 }}
      onClick={(e) => {
        e.stopPropagation()
        if (p.mine) {
          sfx.locked()
          return
        }
        if (!p.liked) {
          sfx.like()
          setBurst((b) => b + 1)
        } else sfx.tap()
        toggleLike(p.id)
      }}
      aria-pressed={!!p.liked}
      aria-label={p.liked ? 'Descurtir' : 'Curtir'}
    >
      <motion.span key={`h${p.liked}`} className="like__heart" initial={{ scale: 0.4 }} animate={{ scale: [0.4, 1.4, 1] }} transition={{ duration: 0.4 }}>
        <Icon.heart filled={p.liked} />
      </motion.span>
      <motion.span key={p.likes} className="like__n" initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        {p.likes}
      </motion.span>
      <AnimatePresence>
        {burst > 0 &&
          [0, 1, 2, 3, 4, 5].map((k) => (
            <motion.span
              key={`${burst}-${k}`}
              className="like__mini"
              initial={{ opacity: 1, x: 0, y: 0, scale: 0.6 }}
              animate={{ opacity: 0, x: Math.cos((k / 6) * Math.PI * 2) * 34, y: Math.sin((k / 6) * Math.PI * 2) * 34 - 10, scale: 1 }}
              transition={{ duration: 0.7 }}
            >
              ♥
            </motion.span>
          ))}
      </AnimatePresence>
    </motion.button>
  )
}

function Detail({ p, onClose }: { p: Production; onClose: () => void }) {
  const audio = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  useEffect(() => {
    const t = window.setTimeout(() => speak(`${p.title}, de ${p.author}. ${p.desc ?? ''}`), 350)
    return () => {
      window.clearTimeout(t)
      audio.current?.pause()
      stopSpeaking()
    }
  }, [p.id, p.title, p.author, p.desc])

  const play = () => {
    if (p.audio) {
      audio.current?.pause()
      audio.current = new Audio(p.audio)
      audio.current.onended = () => setPlaying(false)
      void audio.current.play()
      setPlaying(true)
    } else {
      speak(p.text || p.title)
    }
  }

  return (
    <motion.div className="sheet-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        className="pdetail"
        initial={{ y: 80, scale: 0.9, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Btn variant="icon" className="pdetail__x" icon={<Icon.close />} onClick={onClose} aria-label="Fechar" />
        <div className="pdetail__art">
          <ProductionArt p={p} large />
          {(p.kind === 'audio' || p.kind === 'texto') && (
            <Btn className="pdetail__play" icon={playing ? <Icon.stop /> : <Icon.play />} onClick={play} glow>
              {p.kind === 'audio' ? 'Ouvir' : 'Ler em voz alta'}
            </Btn>
          )}
        </div>
        <div className="pdetail__info">
          <AvatarArt art={p.avatar} className="pcard__avatar" />
          <div className="pcard__meta">
            <strong>{p.title}</strong>
            <span>por {p.author}</span>
          </div>
          <LikeButton p={p} big />
        </div>
        {p.desc && <p className="pdetail__desc">{p.desc}</p>}
      </motion.div>
    </motion.div>
  )
}
