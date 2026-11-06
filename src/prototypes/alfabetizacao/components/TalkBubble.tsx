import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { audioReady, isMuted, preloadVoice, speak, type SpeechInfo } from '../../../shared/sound'

/**
 * Balão de fala grande com texto: cada palavra aparece no instante em que o Luno a fala.
 * Sem som liberado, as palavras aparecem no ritmo de leitura.
 */
export default function TalkBubble({
  text,
  delay = 500,
  className,
  style,
  onTalking,
  onDone,
}: {
  text: string
  /** espera (ms) antes de começar a falar — tempo do balão “abrir” */
  delay?: number
  className?: string
  style?: React.CSSProperties
  /** avisa quando o Luno começa/para de falar (para animar o personagem) */
  onTalking?: (talking: boolean) => void
  onDone?: () => void
}) {
  const words = text.split(' ')
  const [shown, setShown] = useState(0)
  const [talking, setTalking] = useState(false)
  const timers = useRef<number[]>([])

  useEffect(() => {
    preloadVoice(text)
    const clear = () => {
      timers.current.forEach(window.clearTimeout)
      timers.current = []
    }
    const reveal = (info?: SpeechInfo) => {
      clear()
      const n = info?.words.length ?? 0
      words.forEach((_, i) => {
        let at = i * 110
        if (info) {
          const w = info.words[n === words.length ? i : Math.min(n - 1, Math.round((i * (n - 1)) / Math.max(1, words.length - 1)))]
          at = Math.max(0, (w?.s ?? (i * info.duration) / words.length) * 1000 - 40)
        }
        timers.current.push(window.setTimeout(() => setShown((c) => Math.max(c, i + 1)), at))
      })
    }
    const start = window.setTimeout(() => {
      if (!audioReady() || isMuted()) {
        reveal()
        return
      }
      speak(text, {
        onStart: (info) => {
          setTalking(true)
          onTalking?.(true)
          reveal(info)
        },
        onEnd: () => {
          setTalking(false)
          onTalking?.(false)
          setShown(words.length)
          onDone?.()
        },
      })
    }, delay)
    return () => {
      window.clearTimeout(start)
      clear()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  return (
    <motion.div
      className={`at talk-bubble ${className ?? ''}`}
      style={style}
      initial={{ scale: 0, opacity: 0, rotate: -5 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 15, delay: 0.15 }}
    >
      <svg className="talk-bubble__shape" viewBox="0 0 460 330" preserveAspectRatio="none" aria-hidden>
        <path d="M232 6 C364 6 455 70 455 158 C455 246 364 300 232 300 C210 300 190 299 170 296 C158 314 140 326 120 328 C130 312 132 298 128 288 C52 268 5 220 5 158 C5 70 98 6 232 6Z" />
      </svg>
      <p aria-label={text}>
        {words.map((w, i) => (
          <motion.span
            key={i}
            className={talking && i === shown - 1 ? 'is-now' : ''}
            initial={{ opacity: 0, y: '40%', scale: 0.8 }}
            animate={i < shown ? { opacity: 1, y: '0%', scale: 1 } : { opacity: 0, y: '40%', scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 500, damping: 22 }}
          >
            {w}{' '}
          </motion.span>
        ))}
      </p>
      {shown === 0 && (
        <span className="intro__dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
      )}
    </motion.div>
  )
}
