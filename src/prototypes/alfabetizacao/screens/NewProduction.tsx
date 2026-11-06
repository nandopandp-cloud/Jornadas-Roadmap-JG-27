import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { sfx, speak } from '../../../shared/sound'
import Mascot from '../components/Mascot'
import { Art, Btn, Icon, Sparks, TopBar } from '../components/ui'
import type { Production } from '../data'
import { useAlfa } from '../store'
import { box, place } from '../assets'

const TYPES: { id: Production['kind']; label: string; img: string; say: string }[] = [
  { id: 'desenho', label: 'Desenho', img: 'type-drawing', say: 'Desenho! Use lápis, pincel e muitas cores.' },
  { id: 'texto', label: 'Texto', img: 'type-text', say: 'Texto! Escreva uma frase ou uma historinha.' },
  { id: 'audio', label: 'Áudio', img: 'type-audio', say: 'Áudio! Grave sua voz contando algo legal.' },
  { id: 'foto', label: 'Foto', img: 'type-photo', say: 'Foto! Tire uma foto de algo que você fez.' },
]

export default function NewProduction() {
  const { state, back, go, setDraft } = useAlfa()
  const [kind, setKind] = useState<Production['kind']>(state.draft?.kind ?? 'desenho')
  const [title, setTitle] = useState(state.draft?.title ?? '')

  useEffect(() => {
    const t = window.setTimeout(() => speak('Escolha o tipo de produção que você quer criar!'), 500)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <div className="scr newprod">
      <TopBar onBack={back} progress={0.3} />
      <motion.section className="at glass" style={box(258, 152, 1372, 748, [8, 96, 374, 740])} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 24 }} />
      <Mascot pose="cheer" className="placed ab newprod__mascot" style={place('mascot-cheer')} />
      <Sparks className="at newprod__sparks" style={box(272, 332, 92, 105)} />

      <motion.header className="at panel-head" style={box(326, 180, 900, 110, [22, 112, 346, 76])} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
        <motion.span className="panel-head__icon panel-head__icon--pencil" animate={{ rotate: [-8, 8, -8] }} transition={{ duration: 2.4, repeat: Infinity }}>
          <Art name="icon-pencil" />
        </motion.span>
        <div>
          <h1>Nova Produção</h1>
          <p>Escolha o tipo de produção que você quer criar:</p>
        </div>
      </motion.header>

      <div className="at types" style={box(412, 325, 1185, 276, [22, 200, 346, 330])}>
        {TYPES.map((t, i) => (
          <motion.button
            key={t.id}
            className={`type ${kind === t.id ? 'is-on' : ''}`}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 + i * 0.07 }}
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              sfx.pop()
              setKind(t.id)
              speak(t.say)
            }}
            aria-pressed={kind === t.id}
          >
            <motion.span className={`type__img type__img--${t.id}`} animate={kind === t.id ? { rotate: [0, -6, 6, 0], scale: [1, 1.1, 1] } : { rotate: 0, scale: 1 }} transition={{ duration: 0.5 }}>
              <Art name={t.img} />
            </motion.span>
            <span className="type__label">{t.label}</span>
            {kind === t.id && (
              <motion.span className="type__check" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}>
                <Icon.check />
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>

      <span className="at divider" style={box(415, 633, 1180, 2, [22, 546, 346, 2])} />
      <label className="at field" style={box(415, 660, 800, 104, [22, 562, 346, 92])}>
        <span className="field__label">Título da produção</span>
        <input className="input" value={title} maxLength={40} placeholder="Dê um título para a sua produção..." onChange={(e) => setTitle(e.target.value)} />
      </label>
      <Btn variant="ghost" className="at" style={box(1030, 790, 224, 74, [22, 762, 150, 56])} onClick={back}>
        Cancelar
      </Btn>
      <Btn
        icon={<Icon.play />}
        glow
        className="at"
        style={box(1277, 790, 324, 74, [182, 762, 186, 56])}
        onClick={() => {
          setDraft({ kind, title, desc: state.draft?.kind === kind ? state.draft.desc : '', image: state.draft?.kind === kind ? state.draft.image : undefined, share: true })
          go({ id: 'create' })
        }}
      >
        Criar Produção
      </Btn>
    </div>
  )
}
