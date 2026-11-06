import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { sfx, speak } from '../../../shared/sound'
import DrawCanvas from '../components/DrawCanvas'
import Stepper from '../components/Stepper'
import { Art, Btn, Icon, TopBar } from '../components/ui'
import { box } from '../assets'
import { useAlfa } from '../store'

export const ProdTitle = () => (
  <>
    <Art name="icon-pencil" />
    <span>Nova Produção</span>
  </>
)

export default function Create() {
  const { state, back, go, setDraft, toast } = useAlfa()
  const draft = state.draft ?? { kind: 'desenho' as const, title: '', desc: '', share: true }
  const [shake, setShake] = useState(0)

  useEffect(() => {
    const say: Record<string, string> = {
      desenho: 'Solte a imaginação! Escolha uma ferramenta e desenhe.',
      texto: 'Escreva sua história no caderno.',
      audio: 'Toque no microfone para gravar sua voz.',
      foto: 'Escolha ou tire uma foto bem bonita.',
    }
    const t = window.setTimeout(() => speak(say[draft.kind]), 500)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const hasContent = draft.kind === 'desenho' || draft.kind === 'foto' ? !!draft.image : draft.kind === 'texto' ? !!draft.text?.trim() : !!draft.audio || draft.audio === ''

  const advance = () => {
    if (!hasContent) {
      setShake((s) => s + 1)
      sfx.error()
      speak(draft.kind === 'desenho' ? 'Faça um desenho primeiro!' : draft.kind === 'texto' ? 'Escreva alguma coisa primeiro!' : draft.kind === 'audio' ? 'Grave um áudio primeiro!' : 'Escolha uma foto primeiro!')
      return
    }
    if (!draft.title.trim()) {
      setShake((s) => s + 1)
      sfx.error()
      speak('Dê um título para a sua produção!')
      document.getElementById('prod-title')?.focus()
      return
    }
    go({ id: 'review' })
  }

  return (
    <div className="scr create">
      <TopBar onBack={back} title={<ProdTitle />} />
      <Stepper step={1} />
      <motion.section className={`at glass create__panel create__panel--${draft.kind}`} style={box(32, 215, 1608, 686, [8, 150, 374, 686])} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 24 }}>
        <div className="create__work">
          {draft.kind === 'desenho' && <DrawCanvas initial={draft.image} onChange={(image) => setDraft({ image })} />}
          {draft.kind === 'texto' && <TextEditor value={draft.text ?? ''} onChange={(text) => setDraft({ text })} />}
          {draft.kind === 'audio' && <AudioRecorder value={draft.audio} onChange={(audio) => setDraft({ audio })} />}
          {draft.kind === 'foto' && <PhotoPicker value={draft.image} onChange={(image) => setDraft({ image })} />}
        </div>
        <motion.aside className="create__form" key={shake} animate={shake ? { x: [0, -10, 10, -6, 6, 0] } : undefined} transition={{ duration: 0.4 }}>
          <label className="field">
            <span className="field__label">Título da produção</span>
            <input id="prod-title" className="input" value={draft.title} maxLength={40} placeholder="Ex.: Meu foguete" onChange={(e) => setDraft({ title: e.target.value })} />
          </label>
          <label className="field">
            <span className="field__label">
              Descrição <em>(opcional)</em>
            </span>
            <textarea className="input input--area" value={draft.desc} maxLength={150} placeholder="Conte um pouquinho sobre a sua produção..." onChange={(e) => setDraft({ desc: e.target.value })} />
            <span className="field__count">{draft.desc.length}/150</span>
          </label>
          <div className="create__actions">
            <Btn
              variant="ghost"
              onClick={() => {
                sfx.success()
                toast('Rascunho salvo!', 'type-text')
              }}
              sound="none"
            >
              Salvar rascunho
            </Btn>
            <Btn icon={<Icon.play />} glow={hasContent && !!draft.title.trim()} onClick={advance}>
              Avançar
            </Btn>
          </div>
        </motion.aside>
      </motion.section>
    </div>
  )
}

/* ---------------- texto ---------------- */
function TextEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="texted">
      <div className="texted__paper">
        <textarea value={value} maxLength={300} placeholder="Era uma vez..." onChange={(e) => onChange(e.target.value)} />
      </div>
      <div className="texted__bar">
        <Btn variant="soft" icon={<Icon.sound />} onClick={() => speak(value || 'Escreva alguma coisa para eu ler!')}>
          Ouvir meu texto
        </Btn>
        <span className="texted__count">{value.length}/300</span>
      </div>
    </div>
  )
}

/* ---------------- áudio ---------------- */
function AudioRecorder({ value, onChange }: { value?: string; onChange: (v: string | undefined) => void }) {
  const [status, setStatus] = useState<'idle' | 'rec' | 'done' | 'denied'>(value !== undefined ? 'done' : 'idle')
  const [secs, setSecs] = useState(0)
  const [levels, setLevels] = useState<number[]>(Array(16).fill(0.15))
  const rec = useRef<MediaRecorder | null>(null)
  const stream = useRef<MediaStream | null>(null)
  const raf = useRef(0)
  const timer = useRef(0)
  const player = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(
    () => () => {
      cancelAnimationFrame(raf.current)
      window.clearInterval(timer.current)
      stream.current?.getTracks().forEach((t) => t.stop())
      player.current?.pause()
    },
    [],
  )

  const start = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.current = s
      const chunks: Blob[] = []
      const r = new MediaRecorder(s)
      r.ondataavailable = (e) => chunks.push(e.data)
      r.onstop = () => {
        const blob = new Blob(chunks, { type: r.mimeType })
        onChange(URL.createObjectURL(blob))
        s.getTracks().forEach((t) => t.stop())
      }
      rec.current = r
      r.start()
      sfx.pop()
      setStatus('rec')
      setSecs(0)
      timer.current = window.setInterval(() => setSecs((x) => (x >= 29 ? (stop(), x) : x + 1)), 1000)
      const ac = new AudioContext()
      const an = ac.createAnalyser()
      an.fftSize = 64
      ac.createMediaStreamSource(s).connect(an)
      const data = new Uint8Array(an.frequencyBinCount)
      const loop = () => {
        an.getByteFrequencyData(data)
        setLevels(Array.from({ length: 16 }, (_, i) => Math.max(0.12, data[i + 2] / 255)))
        raf.current = requestAnimationFrame(loop)
      }
      loop()
    } catch {
      sfx.error()
      setStatus('denied')
    }
  }
  const stop = () => {
    cancelAnimationFrame(raf.current)
    window.clearInterval(timer.current)
    if (rec.current?.state === 'recording') rec.current.stop()
    sfx.success()
    setStatus('done')
  }
  const play = () => {
    if (playing) {
      player.current?.pause()
      setPlaying(false)
      return
    }
    if (!value) {
      speak('Este é um áudio de exemplo do protótipo.')
      return
    }
    player.current = new Audio(value)
    player.current.onended = () => setPlaying(false)
    void player.current.play()
    setPlaying(true)
  }

  return (
    <div className="recorder">
      <AnimatePresence mode="wait">
        {status === 'rec' ? (
          <motion.div key="rec" className="recorder__live" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="recorder__bars">
              {levels.map((l, i) => (
                <i key={i} style={{ height: `${l * 100}%` }} />
              ))}
            </div>
            <span className="recorder__time">
              <i className="recdot" /> 0:{String(secs).padStart(2, '0')}
            </span>
            <Btn className="recorder__stop" icon={<Icon.stop />} onClick={stop}>
              Parar
            </Btn>
          </motion.div>
        ) : status === 'done' ? (
          <motion.div key="done" className="recorder__done" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <Art name="type-audio" className="recorder__notes" />
            <h3>Áudio gravado!</h3>
            <div className="recorder__row">
              <Btn icon={playing ? <Icon.stop /> : <Icon.play />} onClick={play}>
                {playing ? 'Parar' : 'Ouvir'}
              </Btn>
              <Btn
                variant="ghost"
                icon={<Icon.refresh />}
                onClick={() => {
                  onChange(undefined)
                  setStatus('idle')
                }}
              >
                Gravar de novo
              </Btn>
            </div>
          </motion.div>
        ) : (
          <motion.div key="idle" className="recorder__idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.button className="mic-btn" onClick={start} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.9 }} aria-label="Gravar">
              <span className="mic-btn__ring" />
              <span className="mic-btn__ring mic-btn__ring--2" />
              <Art name="type-audio" />
            </motion.button>
            <p>{status === 'denied' ? 'Não conseguimos usar o microfone deste aparelho.' : 'Toque no microfone para gravar (até 30 segundos)'}</p>
            {status === 'denied' && (
              <Btn
                variant="soft"
                onClick={() => {
                  onChange('')
                  setStatus('done')
                }}
              >
                Usar um áudio de exemplo
              </Btn>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ---------------- foto ---------------- */
function PhotoPicker({ value, onChange }: { value?: string; onChange: (v: string | undefined) => void }) {
  const input = useRef<HTMLInputElement>(null)
  const load = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const max = 1200
        const k = Math.min(1, max / Math.max(img.width, img.height))
        const c = document.createElement('canvas')
        c.width = img.width * k
        c.height = img.height * k
        c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height)
        onChange(c.toDataURL('image/jpeg', 0.85))
        sfx.success()
      }
      img.src = String(reader.result)
    }
    reader.readAsDataURL(file)
  }
  const sample = () => {
    const c = document.createElement('canvas')
    c.width = 1200
    c.height = 800
    const g = c.getContext('2d')!
    const grd = g.createLinearGradient(0, 0, 0, 800)
    grd.addColorStop(0, '#9fd3ff')
    grd.addColorStop(1, '#e0f7d4')
    g.fillStyle = grd
    g.fillRect(0, 0, 1200, 800)
    g.fillStyle = '#7ccf4a'
    g.fillRect(0, 620, 1200, 180)
    const img = new Image()
    img.onload = () => {
      g.drawImage(img, 420, 180, 360, 360)
      onChange(c.toDataURL('image/jpeg', 0.85))
      sfx.success()
    }
    img.src = './alfa/obj-apple.webp'
  }
  return (
    <div className="photo">
      {value ? (
        <motion.div className="photo__preview" initial={{ scale: 0.8, rotate: -4, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }}>
          <img src={value} alt="Sua foto" />
          <Btn variant="ghost" icon={<Icon.refresh />} onClick={() => input.current?.click()}>
            Trocar foto
          </Btn>
        </motion.div>
      ) : (
        <div className="photo__empty">
          <motion.button className="mic-btn mic-btn--cam" onClick={() => input.current?.click()} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.9 }} aria-label="Escolher foto">
            <span className="mic-btn__ring" />
            <Art name="type-photo" />
          </motion.button>
          <p>Tire uma foto ou escolha da galeria</p>
          <Btn variant="soft" onClick={sample}>
            Usar foto de exemplo
          </Btn>
        </div>
      )}
      <input ref={input} type="file" accept="image/*" capture="environment" hidden onChange={(e) => e.target.files?.[0] && load(e.target.files[0])} />
    </div>
  )
}
