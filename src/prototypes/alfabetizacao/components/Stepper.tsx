import { motion } from 'framer-motion'
import { box } from '../assets'
import { Icon } from './ui'

const STEPS = ['Criar', 'Revisar', 'Publicar']

export default function Stepper({ step }: { step: 1 | 2 | 3 }) {
  return (
    <motion.ol className="at stepper" style={box(403, 132, 865, 84, [14, 92, 362, 48])} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
      {STEPS.map((s, i) => {
        const n = i + 1
        const done = n < step
        const active = n === step
        return (
          <li key={s} className={`stepper__item ${done ? 'is-done' : ''} ${active ? 'is-active' : ''}`}>
            {i > 0 && (
              <span className="stepper__line">
                <motion.i initial={{ scaleX: 0 }} animate={{ scaleX: n <= step ? 1 : 0 }} transition={{ delay: 0.3, duration: 0.5 }} />
                <b />
              </span>
            )}
            <span className="stepper__chip">
              <motion.span className="stepper__num" key={`${done}${active}`} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 14 }}>
                {done ? <Icon.check /> : n}
              </motion.span>
              <span className="stepper__label">{s}</span>
            </span>
          </li>
        )
      })}
    </motion.ol>
  )
}
