import { motion, useAnimationControls } from 'framer-motion'
import { useEffect } from 'react'
import { useSpeaking } from '../../../shared/sound'
import { asset } from '../assets'

/** Poses da mascote, recortadas das telas de referência. */
export type MascotPose = 'sit' | 'point' | 'present' | 'fists' | 'cheer' | 'cheer-big' | 'arms' | 'hug' | 'welcome'

/** poses recortadas na cintura/pernas nas referências: precisam ficar presas à borda de baixo da tela */
const CUT_AT_BOTTOM: MascotPose[] = ['present', 'fists', 'cheer', 'cheer-big', 'arms', 'hug', 'welcome']

type Props = {
  pose: MascotPose
  /** incremente para disparar um pulo de comemoração */
  celebrate?: number
  /** incremente para disparar o "ops" (balançar) */
  shake?: number
  className?: string
  style?: React.CSSProperties
  /**
   * prende a pose cortada à borda de baixo da tela, para o corte nunca aparecer (padrão: true).
   * Use false quando algo já cobre a cintura do Luno (ex.: o card de conquistas).
   */
  anchored?: boolean
}

export default function Mascot({ pose, celebrate = 0, shake = 0, className, style, anchored = true }: Props) {
  const cut = anchored && CUT_AT_BOTTOM.includes(pose)
  const ctrl = useAnimationControls()
  const speaking = useSpeaking()

  useEffect(() => {
    if (!celebrate) return
    void ctrl.start({
      // poses cortadas pulam menos, para a linha de corte continuar fora da tela
      y: cut ? ['0%', '-3%', '0%', '-1%', '0%'] : ['0%', '-7%', '0%', '-2.5%', '0%'],
      scaleY: [1, 1.03, 0.96, 1.01, 1],
      scaleX: [1, 0.98, 1.03, 1, 1],
      transition: { duration: 0.9, ease: 'easeOut' },
    })
  }, [celebrate, ctrl, cut])

  useEffect(() => {
    if (!shake) return
    void ctrl.start({ rotate: [0, -4, 3.5, -2.5, 1.5, 0], transition: { duration: 0.6 } })
  }, [shake, ctrl])

  return (
    <motion.div
      className={`mascot mascot--${pose} ${cut ? 'is-cut' : ''} ${speaking ? 'is-talking' : ''} ${className ?? ''}`}
      style={style}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 170, damping: 17, delay: 0.05 }}
      aria-hidden
    >
      <motion.div className="mascot__body" animate={ctrl}>
        <div className="mascot__breathe">
          <img src={asset(`mascot-${pose}`)} alt="" draggable={false} />
        </div>
      </motion.div>
    </motion.div>
  )
}
