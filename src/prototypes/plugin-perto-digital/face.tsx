// Navegação por face: a câmera acompanha a ponta do nariz (MediaPipe Face Landmarker) e move um cursor virtual.
// Clique = parar o cursor sobre um botão por 1,2 s ou abrir a boca. Levar o cursor à borda rola a página.
// Tudo roda no navegador: a imagem da câmera não sai do computador.
import { AnimatePresence, motion } from 'framer-motion'
import { Camera, Crosshair, LoaderCircle, MousePointerClick, Move, ScanFace, ShieldCheck, X, ArrowDownUp } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ponteiro, useA11y } from './a11y'

const VISION = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14'
const MODELO = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'
const PARADA_MS = 1200
const RAIO_PARADA = 26
const CLICAVEL = 'button:not([disabled]),a[href],input,select,textarea,label,[role="button"],[data-clicavel]'

/* eslint-disable @typescript-eslint/no-explicit-any */
let detectorP: Promise<any> | null = null
function detector() {
  if (!detectorP) {
    detectorP = (async () => {
      const v: any = await import(/* @vite-ignore */ `${VISION}/vision_bundle.mjs`)
      const files = await v.FilesetResolver.forVisionTasks(`${VISION}/wasm`)
      // CPU: funciona em qualquer navegador (a GPU falha em máquinas sem WebGL2) e dá conta de 1 rosto em tempo real
      return v.FaceLandmarker.createFromOptions(files, {
        baseOptions: { modelAssetPath: MODELO, delegate: 'CPU' },
        runningMode: 'VIDEO',
        numFaces: 1,
        outputFaceBlendshapes: true,
      })
    })().catch((e) => {
      detectorP = null
      throw e
    })
  }
  return detectorP
}

type Fase = 'carregando' | 'calibrando' | 'ativo' | 'erro'

export function FaceIntro({ aberto, onCancelar, onAtivar }: { aberto: boolean; onCancelar: () => void; onAtivar: () => void }) {
  useEffect(() => {
    if (!aberto) return
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onCancelar()
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [aberto, onCancelar])
  return (
    <AnimatePresence>
      {aberto && (
        <motion.div className="pd-overlay pd-sistema" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            className="pd-face-intro"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pd-face-titulo"
            initial={{ y: 24, scale: 0.97, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
          >
            <button className="pd-icone-btn pd-face-intro__x" onClick={onCancelar} aria-label="Fechar">
              <X size={22} />
            </button>
            <div className="pd-face-intro__arte" aria-hidden>
              <div className="pd-face-intro__anel" />
              <ScanFace size={64} strokeWidth={1.6} />
            </div>
            <h2 id="pd-face-titulo">Navegue usando o rosto</h2>
            <p>Use a câmera para controlar o cursor com movimentos da cabeça, sem precisar do mouse.</p>
            <ol className="pd-face-intro__passos">
              <li>
                <span>
                  <Move size={18} />
                </span>
                Mova a cabeça devagar para levar o cursor até onde quiser.
              </li>
              <li>
                <span>
                  <MousePointerClick size={18} />
                </span>
                Para clicar, pare sobre o botão por um instante ou abra a boca.
              </li>
              <li>
                <span>
                  <ArrowDownUp size={18} />
                </span>
                Leve o cursor até a borda de cima ou de baixo para rolar a página.
              </li>
            </ol>
            <div className="pd-face-intro__privacidade">
              <ShieldCheck size={18} />
              A imagem da câmera é processada só no seu dispositivo e não é gravada nem enviada.
            </div>
            <div className="pd-face-intro__acoes">
              <button className="pd-btn pd-btn--linha" onClick={onCancelar}>
                Agora não
              </button>
              <button className="pd-btn pd-btn--primario" onClick={onAtivar}>
                <Camera size={18} /> Permitir câmera e começar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function FaceNav({ onDesligar }: { onDesligar: () => void }) {
  const { avisar } = useA11y()
  const video = useRef<HTMLVideoElement>(null)
  const cursor = useRef<HTMLDivElement>(null)
  const anel = useRef<HTMLDivElement>(null)
  const [fase, setFase] = useState<Fase>('carregando')
  const [erro, setErro] = useState('')
  const [calib, setCalib] = useState(0)
  const [semRosto, setSemRosto] = useState(false)
  const recal = useRef<() => void>(() => {})

  useEffect(() => {
    let vivo = true
    let stream: MediaStream | null = null
    let raf = 0
    ponteiro.usarFace(true)
    document.documentElement.classList.add('pd-face-on')

    const W = () => window.innerWidth
    const H = () => window.innerHeight
    let pos = { x: W() / 2, y: H() / 2 }
    let centro: { x: number; y: number } | null = null
    let amostras: { x: number; y: number }[] = []
    let inicioCalib = 0
    let parada = { x: 0, y: 0, t: 0 }
    let ultimoClique = 0
    let bocaAberta = false
    let vistoEm = performance.now()
    let perdido = false
    const marcaPerdido = (v: boolean) => {
      if (v === perdido) return
      perdido = v
      setSemRosto(v)
    }

    recal.current = () => {
      centro = null
      amostras = []
      inicioCalib = performance.now()
      setFase('calibrando')
    }

    const clicar = (x: number, y: number) => {
      const el = document.elementFromPoint(x, y) as HTMLElement | null
      const alvo = el?.closest(CLICAVEL) as HTMLElement | null
      if (!alvo) return false
      ultimoClique = performance.now()
      cursor.current?.classList.remove('is-clique')
      void cursor.current?.offsetWidth
      cursor.current?.classList.add('is-clique')
      if (alvo instanceof HTMLInputElement || alvo instanceof HTMLTextAreaElement) alvo.focus()
      else alvo.click()
      return true
    }

    const rolar = (x: number, y: number, dy: number) => {
      let el = document.elementFromPoint(x, y) as HTMLElement | null
      while (el) {
        const s = getComputedStyle(el)
        if (/(auto|scroll)/.test(s.overflowY) && el.scrollHeight > el.clientHeight + 2) {
          el.scrollBy({ top: dy })
          return
        }
        el = el.parentElement
      }
      window.scrollBy({ top: dy })
    }

    ;(async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error('sem-camera')
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 640, height: 480 }, audio: false })
        if (!vivo) return
        const v = video.current!
        v.srcObject = stream
        await v.play()
        const lm = await detector()
        if (!vivo) return
        recal.current()
        let tUlt = -1
        const laco = () => {
          if (!vivo) return
          raf = requestAnimationFrame(laco)
          if (v.readyState < 2 || v.currentTime === tUlt) return
          tUlt = v.currentTime
          const r = lm.detectForVideo(v, performance.now())
          const pts = r?.faceLandmarks?.[0]
          if (!pts) {
            cursor.current?.classList.add('is-perdido')
            if (performance.now() - vistoEm > 1500) marcaPerdido(true)
            if (!centro) inicioCalib = performance.now()
            return
          }
          vistoEm = performance.now()
          marcaPerdido(false)
          cursor.current?.classList.remove('is-perdido')
          const nariz = { x: 1 - pts[1].x, y: pts[1].y } // espelhado: mover a cabeça para a direita leva o cursor para a direita
          const agora = performance.now()

          if (!centro) {
            amostras.push(nariz)
            const prog = Math.min(1, (agora - inicioCalib) / 1600)
            setCalib(prog)
            if (prog >= 1) {
              centro = {
                x: amostras.reduce((s, p) => s + p.x, 0) / amostras.length,
                y: amostras.reduce((s, p) => s + p.y, 0) / amostras.length,
              }
              pos = { x: W() / 2, y: H() / 2 }
              setFase('ativo')
            }
            return
          }

          const alvo = {
            x: Math.min(W() - 4, Math.max(4, W() / 2 + (nariz.x - centro.x) * W() * 4.6)),
            y: Math.min(H() - 4, Math.max(4, H() / 2 + (nariz.y - centro.y) * H() * 6.4)),
          }
          const d = Math.hypot(alvo.x - pos.x, alvo.y - pos.y)
          const k = d > 80 ? 0.32 : d > 20 ? 0.2 : 0.1 // suaviza tremores pequenos e acompanha movimentos grandes
          pos = { x: pos.x + (alvo.x - pos.x) * k, y: pos.y + (alvo.y - pos.y) * k }
          if (cursor.current) cursor.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`
          ponteiro.set({ ...pos }, 'face')

          // rolagem pelas bordas
          if (pos.y > H() - 70) rolar(pos.x, H() - 90, 9)
          else if (pos.y < 60) rolar(pos.x, 90, -9)

          // clique por boca aberta
          const jaw = r.faceBlendshapes?.[0]?.categories?.find((c: any) => c.categoryName === 'jawOpen')?.score ?? 0
          if (jaw > 0.45 && !bocaAberta && agora - ultimoClique > 900) {
            bocaAberta = true
            clicar(pos.x, pos.y)
          } else if (jaw < 0.25) bocaAberta = false

          // clique por parada
          const sobre = (document.elementFromPoint(pos.x, pos.y) as HTMLElement | null)?.closest(CLICAVEL)
          if (Math.hypot(pos.x - parada.x, pos.y - parada.y) > RAIO_PARADA || !sobre) parada = { x: pos.x, y: pos.y, t: agora }
          const p = sobre && agora - ultimoClique > 900 ? Math.min(1, (agora - parada.t) / PARADA_MS) : 0
          if (anel.current) anel.current.style.setProperty('--p', String(p))
          cursor.current?.classList.toggle('is-sobre', !!sobre)
          if (p >= 1) {
            clicar(pos.x, pos.y)
            parada = { x: pos.x, y: pos.y, t: agora + 600 }
          }
        }
        laco()
      } catch (e) {
        if (!vivo) return
        const nome = (e as { name?: string })?.name
        setErro(
          nome === 'NotAllowedError'
            ? 'Você não permitiu o uso da câmera. Libere o acesso no cadeado da barra de endereço e tente de novo.'
            : nome === 'NotFoundError' || (e as Error)?.message === 'sem-camera'
              ? 'Não encontramos uma câmera neste dispositivo.'
              : 'Não foi possível iniciar o rastreamento facial agora. Verifique a conexão e tente de novo.',
        )
        setFase('erro')
      }
    })()

    return () => {
      vivo = false
      cancelAnimationFrame(raf)
      stream?.getTracks().forEach((t) => t.stop())
      ponteiro.usarFace(false)
      document.documentElement.classList.remove('pd-face-on')
    }
  }, [])

  useEffect(() => {
    if (fase === 'ativo') avisar('Navegação por face ativa', 'ok')
  }, [fase, avisar])

  const desligar = useCallback(() => onDesligar(), [onDesligar])

  return (
    <>
      <div ref={cursor} className={`pd-face-cursor pd-sistema ${fase === 'ativo' ? '' : 'is-oculto'}`} aria-hidden>
        <div ref={anel} className="pd-face-cursor__anel" />
        <div className="pd-face-cursor__ponto" />
      </div>

      <AnimatePresence>
        {fase === 'calibrando' && (
          <motion.div className="pd-face-calib pd-sistema" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="status">
            <div className="pd-face-calib__alvo" style={{ ['--p' as string]: calib }}>
              <Crosshair size={40} />
            </div>
            <strong>{semRosto ? 'Não estamos vendo seu rosto' : 'Olhe para o centro da tela e fique parado'}</strong>
            <span>{semRosto ? 'Fique de frente para a câmera, com o rosto iluminado.' : 'Estamos ajustando o cursor à posição do seu rosto…'}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="pd-face-cam pd-sistema" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} role="region" aria-label="Navegação por face">
        <div className="pd-face-cam__video">
          <video ref={video} muted playsInline />
          {fase === 'carregando' && (
            <span className="pd-face-cam__carregando">
              <LoaderCircle size={22} className="pd-gira" /> Iniciando câmera…
            </span>
          )}
          {fase === 'erro' && (
            <span className="pd-face-cam__carregando">
              <Camera size={22} /> Câmera indisponível
            </span>
          )}
        </div>
        <div className="pd-face-cam__info">
          <strong>
            <ScanFace size={16} /> Navegação por face
          </strong>
          {fase === 'erro' ? (
            <p className="pd-face-cam__erro">{erro}</p>
          ) : (
            <p>{semRosto && fase === 'ativo' ? 'Rosto fora da câmera: volte para a frente da tela.' : fase === 'ativo' ? 'Pare sobre um botão ou abra a boca para clicar.' : fase === 'calibrando' ? 'Calibrando…' : 'Carregando o rastreamento facial…'}</p>
          )}
          <div className="pd-face-cam__acoes">
            {fase === 'ativo' && (
              <button className="pd-btn pd-btn--mini pd-btn--linha" onClick={() => recal.current()}>
                <Crosshair size={14} /> Recalibrar
              </button>
            )}
            <button className="pd-btn pd-btn--mini pd-btn--escuro" onClick={desligar}>
              Desativar
            </button>
          </div>
        </div>
      </motion.div>
    </>
  )
}
