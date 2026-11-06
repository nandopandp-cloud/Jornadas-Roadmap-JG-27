import { AnimatePresence, motion, type Transition } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { audioReady as isAudioReady, isMuted, preloadVoice, sfx, speak, stopSpeaking, unlockAudio, useAudioReady, type SpeechInfo } from '../../../shared/sound'
import { Art, Sparks, Twinkle } from '../components/ui'
import { asset, box, place } from '../assets'

/**
 * Abertura animada (storyboard “Aventura pelo Saber”, ~7s):
 *  1. 0s–1,5s   O planeta aparece (logo + ilha com anéis)
 *  2. 1,5s–3s   Luno chega para receber o estudante
 *  3. 3s–4,5s   O universo ganha vida (letras A, B, C)
 *  4. 4,5s–6s   Convite para começar (balão de fala)
 *  5. 6s–7s     Transição para a Home
 *
 * A cena 4 segue a voz do Luno: cada palavra do balão aparece no instante em que é falada
 * e a transição só começa depois que ele termina (no mínimo aos 6s, como no storyboard).
 * Sem som liberado, as palavras aparecem no ritmo de leitura e o tempo do storyboard é mantido.
 */
const TIMES = [0, 1500, 3000, 4500, 6000]
/** o balão “abre” ~0,45s depois do início da cena 4; a fala começa quando ele está aberto */
const BUBBLE_OPEN_MS = 450
/** pausa depois da última palavra antes de ir para a Home */
const AFTER_SPEECH_MS = 650
/** limite de segurança: a cena 4 nunca passa disso */
const MAX_SCENE4_MS = 9000
const FALA = 'Olá! Que bom ter você aqui! Vamos descobrir coisas novas?'
const WORDS = FALA.split(' ')
const SPRING: Transition = { type: 'spring', stiffness: 120, damping: 18, mass: 0.9 }
const SMOOTH: Transition = { duration: 1.1, ease: [0.45, 0, 0.2, 1] }

type Props = {
  /** chamado quando a Home deve começar a aparecer por baixo */
  onReveal: () => void
  /** chamado ao fim da transição (remove a abertura) */
  onDone: () => void
}

export default function Intro({ onReveal, onDone }: Props) {
  const [scene, setScene] = useState(1)
  const [leaving, setLeaving] = useState(false)
  const audioReady = useAudioReady()
  const finished = useRef(false)
  /** fase da fala do convite */
  const speech = useRef<'idle' | 'loading' | 'playing' | 'done'>('idle')
  const minEnd = useRef(false) // já passou dos 6s do storyboard?
  const [shown, setShown] = useState(0) // palavras visíveis no balão
  const [talking, setTalking] = useState(false)
  const wordTimers = useRef<number[]>([])

  const finish = () => {
    if (finished.current) return
    finished.current = true
    setLeaving(true)
    sfx.whoosh()
    onReveal()
    window.setTimeout(onDone, 950)
  }

  useEffect(() => {
    unlockAudio(false)
    preloadVoice(FALA)
    const ts = [
      window.setTimeout(() => {
        sfx.whoosh()
        sfx.sparkle()
      }, 150),
      window.setTimeout(() => {
        setScene(2)
        sfx.whoosh()
        window.setTimeout(() => sfx.pop(), 350)
      }, TIMES[1]),
      window.setTimeout(() => {
        setScene(3)
        sfx.sparkle()
        ;[0, 1, 2].forEach((i) => window.setTimeout(() => sfx.star(i), 250 + i * 190))
      }, TIMES[2]),
      window.setTimeout(() => {
        setScene(4)
        sfx.pop()
        // com som liberado, o Luno fala assim que o balão abre; sem som, as palavras aparecem no ritmo de leitura
        window.setTimeout(() => (isAudioReady() && !isMuted() ? speakFala() : revealAtReadingPace()), BUBBLE_OPEN_MS)
      }, TIMES[3]),
      // fim mínimo da cena 4 (storyboard): só sai se o Luno não estiver falando
      window.setTimeout(() => {
        minEnd.current = true
        if (speech.current === 'idle' || speech.current === 'done') finish()
      }, TIMES[4]),
      // trava de segurança
      window.setTimeout(finish, TIMES[3] + MAX_SCENE4_MS),
    ]
    return () => {
      ts.forEach(window.clearTimeout)
      wordTimers.current.forEach(window.clearTimeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const clearWordTimers = () => {
    wordTimers.current.forEach(window.clearTimeout)
    wordTimers.current = []
  }

  /** mostra cada palavra no tempo em que ela é falada */
  const syncWords = (info: SpeechInfo) => {
    clearWordTimers()
    setShown(0)
    const n = info.words.length
    WORDS.forEach((_, i) => {
      const w = info.words[n === WORDS.length ? i : Math.min(n - 1, Math.round((i * (n - 1)) / Math.max(1, WORDS.length - 1)))]
      const at = Math.max(0, (w?.s ?? (i * info.duration) / WORDS.length) * 1000 - 40)
      wordTimers.current.push(window.setTimeout(() => setShown((c) => Math.max(c, i + 1)), at))
    })
  }

  const revealAtReadingPace = () => {
    clearWordTimers()
    WORDS.forEach((_, i) => wordTimers.current.push(window.setTimeout(() => setShown((c) => Math.max(c, i + 1)), i * 110)))
  }

  const speakFala = () => {
    if (finished.current || speech.current === 'loading' || speech.current === 'playing') return
    speech.current = 'loading'
    speak(FALA, {
      rate: 1,
      pitch: 1.2,
      onStart: (info) => {
        speech.current = 'playing'
        setTalking(true)
        syncWords(info)
      },
      onEnd: () => {
        speech.current = 'done'
        setTalking(false)
        setShown(WORDS.length)
        // espera o mínimo do storyboard e uma pausa curta depois da última palavra
        window.setTimeout(() => (minEnd.current ? finish() : undefined), AFTER_SPEECH_MS)
        if (!minEnd.current) {
          const wait = window.setInterval(() => {
            if (minEnd.current) {
              window.clearInterval(wait)
              finish()
            }
          }, 100)
        }
      },
    })
  }

  // o primeiro toque libera o som; se o convite já apareceu, o Luno fala (e a cena espera ele terminar)
  const onTap = () => {
    if (audioReady) return
    unlockAudio()
    sfx.tap()
    if (scene >= 4) window.setTimeout(speakFala, 120)
  }

  const s = scene
  return (
    <motion.div
      className="intro"
      onPointerDown={onTap}
      initial={{ opacity: 1 }}
      animate={leaving ? { opacity: 0, scale: 1.18, filter: 'blur(8px)' } : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.9, ease: [0.5, 0, 0.3, 1] }}
    >
      {/* céu (sempre) + cenário da ilha com caminho (cena 4) */}
      <motion.div
        className="intro__bg"
        style={{ backgroundImage: `url(${asset('bg-intro-sky')})` }}
        initial={{ scale: 1.12 }}
        animate={{ scale: s === 1 ? 1.04 : s === 2 ? 1.1 : s === 3 ? 1.06 : 1.02, x: s === 2 ? '-2%' : s === 3 ? '-3%' : '0%' }}
        transition={{ duration: 1.6, ease: 'easeOut' }}
      />
      <motion.div
        className="intro__bg intro__bg--path"
        style={{ backgroundImage: `url(${asset('bg-intro-path')})` }}
        initial={{ opacity: 0, scale: 1.12 }}
        animate={s >= 4 ? { opacity: 1, scale: leaving ? 1.25 : 1 } : { opacity: 0, scale: 1.12 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />

      {/* estrelinhas */}
      {[
        [340, 110, 34, 0.1],
        [1200, 135, 30, 0.4],
        [228, 285, 26, 0.7],
        [1100, 262, 22, 0.25],
        [1310, 600, 26, 0.9],
        [410, 350, 20, 0.55],
        [620, 255, 22, 1.1],
        [1500, 120, 28, 0.35],
      ].map(([x, y, w, d], i) => (
        <motion.div key={i} className="at intro__tw" style={box(x, y, w, w, [(x / 1672) * 390, (y / 941) * 600, w * 0.7, w * 0.7])} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: d, type: 'spring', stiffness: 300, damping: 12 }}>
          <Twinkle delay={d} />
        </motion.div>
      ))}

      {/* ilha flutuante com anéis */}
      <motion.div
        className="placed intro__island"
        style={place('intro-island', [15, 250, 360])}
        initial={{ y: '70%', scale: 0.55, opacity: 0, rotate: -4 }}
        animate={
          s === 1
            ? { y: '0%', x: '0%', scale: 1, opacity: 1, rotate: 0, filter: 'blur(0px)' }
            : s === 2
              ? { x: '46%', y: '3%', scale: 0.88, opacity: 1, rotate: 0, filter: 'blur(1.5px)' }
              : s === 3
                ? { x: '62%', y: '36%', scale: 0.66, opacity: 1, rotate: 0, filter: 'blur(2.5px)' }
                : { x: '70%', y: '30%', scale: 0.6, opacity: 0, rotate: 0, filter: 'blur(3px)' }
        }
        transition={s === 1 ? { ...SPRING, opacity: { duration: 0.5 } } : SMOOTH}
      >
        <div className="intro__island-bob">
          <Rings part="back" />
          <Art name="intro-island" />
          <Rings part="front" />
        </div>
      </motion.div>

      {/* logo */}
      <motion.div
        className="at intro__logo"
        style={box(648, 30, 375, 142, [95, 110, 200, 76])}
        initial={{ y: -60, opacity: 0, scale: 0.8 }}
        animate={s === 1 ? { y: 0, opacity: 1, scale: 1 } : { y: -80, opacity: 0, scale: 0.9 }}
        transition={s === 1 ? { type: 'spring', stiffness: 220, damping: 14, delay: 0.45 } : { duration: 0.5 }}
      >
        <Art name="logo" />
      </motion.div>

      {/* cena 2: Luno acena atrás dos arbustos */}
      <motion.div
        className="placed intro__luno"
        style={place('luno-wave', [-40, 420, 440])}
        initial={{ y: '75%', opacity: 0 }}
        animate={s === 2 ? { y: '0%', opacity: 1 } : s < 2 ? { y: '75%', opacity: 0 } : { y: '0%', opacity: 0, scale: 1.04 }}
        transition={s === 2 ? { type: 'spring', stiffness: 140, damping: 15, delay: 0.15 } : { duration: 0.35 }}
      >
        <div className={s === 2 ? 'intro__wave' : ''}>
          <Art name="luno-wave" />
        </div>
      </motion.div>
      <motion.div
        className="at intro__sparks"
        style={box(745, 75, 190, 210, [250, 380, 80, 88])}
        initial={{ scale: 0, opacity: 0 }}
        animate={s === 2 ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ delay: s === 2 ? 0.7 : 0, type: 'spring', stiffness: 400, damping: 12 }}
      >
        <Sparks />
      </motion.div>
      <motion.div
        className="placed intro__bushes"
        style={place('intro-bushes', [-10, 690, 410])}
        initial={{ y: '100%' }}
        animate={s === 2 ? { y: '0%' } : { y: '110%' }}
        transition={s === 2 ? { type: 'spring', stiffness: 120, damping: 18 } : { duration: 0.6, ease: 'easeIn' }}
      >
        <Art name="intro-bushes" />
      </motion.div>

      {/* cena 3: braços abertos, anel e letras */}
      <svg className="at intro__orbit intro__orbit--back" style={box(0, 0, 1672, 941, [-150, 250, 690, 388])} viewBox="0 0 1672 941" aria-hidden>
        <Orbit part="back" show={s === 3} />
      </svg>
      <motion.div
        className="placed intro__luno is-cut"
        style={place('luno-arms', [-20, 400, 430])}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={s === 3 ? { opacity: 1, scale: 1, y: '0%' } : s < 3 ? { opacity: 0, scale: 0.92 } : { opacity: 0, scale: 1, y: '0%' }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="intro__cheer">
          <Art name="luno-arms" />
        </div>
      </motion.div>
      <svg className="at intro__orbit intro__orbit--front" style={box(0, 0, 1672, 941, [-150, 250, 690, 388])} viewBox="0 0 1672 941" aria-hidden>
        <Orbit part="front" show={s === 3} />
      </svg>

      {(
        [
          ['letter-a', [30, 150, 110], { x: '30%', y: '120%' }, 0.15],
          ['letter-b', [150, 130, 100], { x: '-40%', y: '110%' }, 0.33],
          ['letter-c', [262, 160, 100], { x: '-60%', y: '20%' }, 0.51],
        ] as const
      ).map(([name, p, from, d], i) => (
        <motion.div
          key={name}
          className="placed intro__letter"
          style={place(name, [p[0], p[1], p[2]])}
          initial={{ opacity: 0, scale: 0, rotate: -30, ...from }}
          animate={
            s === 3
              ? { opacity: 1, scale: 1, rotate: 0, x: '0%', y: '0%' }
              : s < 3
                ? { opacity: 0, scale: 0, rotate: -30, ...from }
                : { opacity: 0, scale: 0.6, rotate: 25, x: '40%', y: '-160%' }
          }
          transition={s === 3 ? { type: 'spring', stiffness: 220, damping: 13, delay: d } : { duration: 0.6, ease: 'easeIn', delay: i * 0.06 }}
        >
          <div className="intro__letter-bob" style={{ animationDelay: `${-i * 0.6}s` }}>
            <Art name={name} />
          </div>
        </motion.div>
      ))}
      {(
        [
          [660, 92, 76, [20, 110, 40], 0.3],
          [1340, 165, 78, [330, 110, 40], 0.5],
          [955, 548, 96, [300, 300, 46], 0.65],
        ] as const
      ).map(([x, y, w, p, d], i) => (
        <motion.div
          key={i}
          className="at intro__star"
          style={box(x, y, w, w, [p[0], p[1], p[2], p[2]])}
          initial={{ scale: 0, rotate: -90 }}
          animate={s === 3 ? { scale: 1, rotate: 0 } : { scale: 0, rotate: 60 }}
          transition={s === 3 ? { delay: d, type: 'spring', stiffness: 380, damping: 11 } : { duration: 0.3 }}
        >
          <Art name="icon-star" />
        </motion.div>
      ))}

      {/* cena 4: convite */}
      <motion.div
        className="placed intro__luno is-cut"
        style={place('luno-point', [-30, 430, 420])}
        initial={{ opacity: 0, x: '-25%' }}
        animate={s >= 4 ? { opacity: leaving ? 0 : 1, x: leaving ? '-40%' : '0%' } : { opacity: 0, x: '-25%' }}
        transition={s >= 4 ? { type: 'spring', stiffness: 150, damping: 17 } : { duration: 0.3 }}
      >
        <div className={`intro__talk ${talking ? 'is-talking' : ''}`}>
          <Art name="luno-point" />
        </div>
      </motion.div>
      <motion.div
        className="at intro__sparks"
        style={box(478, 122, 140, 156, [270, 395, 60, 66])}
        initial={{ scale: 0, opacity: 0 }}
        animate={s >= 4 && !leaving ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ delay: s >= 4 ? 0.45 : 0, type: 'spring', stiffness: 400, damping: 12 }}
      >
        <Sparks flip />
      </motion.div>
      <AnimatePresence>
        {s >= 4 && !leaving && (
          <motion.div
            key="fala"
            className="at intro__bubble"
            style={box(585, 32, 545, 362, [25, 150, 340, 230])}
            initial={{ scale: 0, opacity: 0, rotate: -6 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 15, delay: 0.2 }}
          >
            <svg className="intro__bubble-shape" viewBox="0 0 545 362" preserveAspectRatio="none" aria-hidden>
              <path d="M272 6 C430 6 540 74 540 172 C540 270 430 334 272 334 C226 334 186 330 150 320 C120 340 82 356 50 360 C68 340 80 318 84 296 C34 264 4 222 4 172 C4 74 114 6 272 6Z" />
            </svg>
            <p aria-label={FALA}>
              {WORDS.map((w, i) => (
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
            {/* “digitando…” enquanto a voz carrega */}
            {shown === 0 && (
              <span className="intro__dots" aria-hidden>
                <i />
                <i />
                <i />
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* controles */}
      <AnimatePresence>
        {!audioReady && !leaving && (
          <motion.button
            key="som"
            className="intro__sound"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ delay: 0.8 }}
            onClick={() => undefined}
          >
            <span className="intro__sound-ic">🔊</span> Toque para ouvir o Luno
          </motion.button>
        )}
      </AnimatePresence>
      {!leaving && (
        <motion.button
          className="intro__skip"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={(e) => {
            e.stopPropagation()
            unlockAudio()
            stopSpeaking()
            finish()
          }}
        >
          Pular
        </motion.button>
      )}
    </motion.div>
  )
}

/* ---------- anéis da ilha (metade de trás atrás da ilha, metade da frente na frente) ---------- */
function Rings({ part }: { part: 'back' | 'front' }) {
  const id = `ring-${part}`
  const rings = [
    { cx: 431, cy: 328, rx: 612, ry: 150, w: 7, d: 0.2 },
    { cx: 431, cy: 338, rx: 500, ry: 110, w: 4, d: 0.45 },
  ]
  return (
    <svg className={`intro__rings intro__rings--${part}`} viewBox="0 0 839 669" aria-hidden>
      <defs>
        <clipPath id={id}>
          <rect x={-2000} y={part === 'back' ? -2000 : 328} width={5000} height={part === 'back' ? 2328 : 2000} transform="rotate(-9.5 431 328)" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        {rings.map((r, i) => (
          <g key={i} transform={`rotate(-9.5 ${r.cx} ${r.cy})`}>
            <motion.ellipse
              cx={r.cx}
              cy={r.cy}
              rx={r.rx}
              ry={r.ry}
              className="intro__ring"
              strokeWidth={r.w}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: r.d, ease: 'easeOut' }}
            />
            <ellipse cx={r.cx} cy={r.cy} rx={r.rx} ry={r.ry} className="intro__comet" strokeWidth={r.w + 3} pathLength={1} style={{ animationDelay: `${-i * 1.1}s` }} />
          </g>
        ))}
      </g>
    </svg>
  )
}

/* ---------- anel em volta do Luno (cena 3) ---------- */
function Orbit({ part, show }: { part: 'back' | 'front'; show: boolean }) {
  const id = `orbit-${part}`
  return (
    <>
      <defs>
        <clipPath id={id}>
          <rect x={-2000} y={part === 'back' ? -2000 : 540} width={6000} height={part === 'back' ? 2540 : 2000} transform="rotate(-18 870 540)" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`} transform="rotate(-18 870 540)">
        <motion.ellipse
          cx={870}
          cy={540}
          rx={660}
          ry={175}
          className="intro__ring"
          strokeWidth={8}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={show ? { pathLength: 1, opacity: 1 } : { pathLength: 1, opacity: 0 }}
          transition={show ? { duration: 1, ease: 'easeOut', delay: 0.1 } : { duration: 0.4 }}
        />
      </g>
    </>
  )
}
