import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { sfx, speak } from '../../../shared/sound'
import Mascot from '../components/Mascot'
import ProductionArt from '../components/ProductionArt'
import Stepper from '../components/Stepper'
import { Btn, Icon, Sparks, TopBar, Twinkle } from '../components/ui'
import { useAlfa } from '../store'
import { box, place } from '../assets'
import { ProdTitle } from './Create'

export default function Published() {
  const { state, backTo, setDraft } = useAlfa()
  const p = state.productions.find((x) => x.id === state.lastPublished)
  const shared = p?.shared ?? true

  useEffect(() => {
    sfx.fanfare()
    const t = window.setTimeout(() => speak(shared ? 'Produção publicada! Sua produção já está no Mural da turma para todos verem!' : 'Produção salva! Ela está em Meus trabalhinhos.'), 600)
    return () => {
      window.clearTimeout(t)
      setDraft(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="scr published">
      <TopBar onBack={() => backTo({ id: 'home' })} title={<ProdTitle />} />
      <Stepper step={3} />
      <motion.section className="at glass" style={box(32, 215, 1608, 686, [8, 150, 374, 686])} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 24 }} />
      {[
        [585, 300, 34],
        [690, 480, 28],
        [605, 615, 40],
        [720, 670, 26],
        [1390, 525, 44],
        [1330, 620, 30],
      ].map(([x, y, s], i) => (
        <Twinkle key={i} className="at published__tw" style={box(x, y, s, s, [20 + i * 60, 530 + (i % 2) * 30, 18, 18])} delay={i * 0.35} />
      ))}
      <Mascot pose="cheer-big" anchored={false} celebrate={1} className="placed published__mascot" style={place('mascot-cheer-big', [100, 640, 150])} />

      <motion.span className="at bigcheck" style={box(638, 260, 110, 110, [28, 168, 64, 64])} initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 12, delay: 0.2 }}>
        <Icon.check />
      </motion.span>
      <motion.div className="at published__text" style={box(778, 262, 640, 160, [104, 162, 266, 110])} initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.35 }}>
        <h1>{shared ? 'Produção publicada!' : 'Produção salva!'}</h1>
        <p>{shared ? 'Sua produção já está no Mural da turma para todos verem!' : 'Ela está guardada em Meus trabalhinhos.'}</p>
      </motion.div>
      {p && (
        <motion.div className="at published__art" style={box(800, 440, 410, 280, [45, 296, 300, 205])} initial={{ y: 80, rotate: 6, opacity: 0 }} animate={{ y: 0, rotate: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 160, damping: 12, delay: 0.5 }}>
          <ProductionArt p={p} large />
        </motion.div>
      )}
      <Sparks className="at" style={box(1243, 428, 66, 100, [330, 280, 36, 52])} />
      <motion.div className="at" style={box(598, 752, 378, 80, [28, 525, 334, 56])} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}>
        <Btn variant="ghost" className="fill" icon={<Icon.image />} onClick={() => backTo({ id: 'mural', params: { tab: shared ? 'turma' : 'minhas' } })}>
          Ver no Mural
        </Btn>
      </motion.div>
      <motion.div className="at" style={box(1007, 752, 426, 80, [28, 594, 334, 56])} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9 }}>
        <Btn className="fill" icon={<Icon.home />} onClick={() => backTo({ id: 'home' })}>
          Voltar ao Início
        </Btn>
      </motion.div>
    </div>
  )
}
