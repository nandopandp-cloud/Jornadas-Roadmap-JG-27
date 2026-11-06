import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { haptic, sfx, speak } from '../../../shared/sound'
import { Art, Icon } from './ui'

/* Editor de desenho real: lápis, pincel, borracha, cores, carimbos e texto, com desfazer/refazer. */

type Tool = 'lapis' | 'pincel' | 'borracha' | 'cores' | 'formas' | 'texto'
type Shape = 'star' | 'heart' | 'circle' | 'flower'
const W = 1200
const H = 800
const COLORS = ['#1e1b4b', '#ef4444', '#f97316', '#facc15', '#22c55e', '#06b6d4', '#2563eb', '#7c3aed', '#ec4899', '#8b5a2b', '#ffffff']

const TOOLS: { id: Tool; label: string; img?: string }[] = [
  { id: 'lapis', label: 'Lápis', img: 'tool-pencil' },
  { id: 'pincel', label: 'Pincel', img: 'tool-brush' },
  { id: 'borracha', label: 'Borracha', img: 'tool-eraser' },
  { id: 'cores', label: 'Cores', img: 'tool-colors' },
  { id: 'formas', label: 'Formas', img: 'tool-shapes' },
  { id: 'texto', label: 'Texto' },
]

export default function DrawCanvas({ initial, onChange }: { initial?: string; onChange: (dataUrl: string | undefined) => void }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const ctx = useRef<CanvasRenderingContext2D | null>(null)
  const [tool, setTool] = useState<Tool>('lapis')
  const [drawTool, setDrawTool] = useState<Tool>('lapis')
  const [color, setColor] = useState('#2563eb')
  const [shape, setShape] = useState<Shape>('star')
  const [palette, setPalette] = useState(false)
  const [shapes, setShapes] = useState(false)
  const [undo, setUndo] = useState<ImageData[]>([])
  const [redo, setRedo] = useState<ImageData[]>([])
  const [armedClear, setArmedClear] = useState(false)
  const [textAt, setTextAt] = useState<{ x: number; y: number; cx: number; cy: number } | null>(null)
  const [textVal, setTextVal] = useState('')
  const [empty, setEmpty] = useState(!initial)
  const drawing = useRef(false)
  const last = useRef<{ x: number; y: number } | null>(null)
  const lastScribble = useRef(0)

  useEffect(() => {
    const c = canvas.current!
    const g = c.getContext('2d', { willReadFrequently: true })!
    ctx.current = g
    g.fillStyle = '#fff'
    g.fillRect(0, 0, W, H)
    if (initial) {
      const img = new Image()
      img.onload = () => g.drawImage(img, 0, 0, W, H)
      img.src = initial
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const snapshot = () => {
    const g = ctx.current!
    setUndo((u) => [...u.slice(-24), g.getImageData(0, 0, W, H)])
    setRedo([])
  }
  const commit = () => {
    setEmpty(false)
    onChange(canvas.current!.toDataURL('image/jpeg', 0.85))
  }
  const pos = (e: React.PointerEvent | PointerEvent) => {
    const r = canvas.current!.getBoundingClientRect()
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H, cx: e.clientX - r.left, cy: e.clientY - r.top }
  }

  const stroke = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const g = ctx.current!
    g.lineCap = 'round'
    g.lineJoin = 'round'
    if (tool === 'borracha') {
      g.globalAlpha = 1
      g.strokeStyle = '#fff'
      g.lineWidth = 46
      g.beginPath()
      g.moveTo(from.x, from.y)
      g.lineTo(to.x, to.y)
      g.stroke()
      return
    }
    g.strokeStyle = color
    if (tool === 'pincel') {
      g.globalAlpha = 0.92
      g.lineWidth = 26
      g.beginPath()
      g.moveTo(from.x, from.y)
      g.lineTo(to.x, to.y)
      g.stroke()
    } else {
      // lápis com textura de giz de cera: passadas finas levemente deslocadas
      for (let k = 0; k < 3; k++) {
        const j = () => (Math.random() - 0.5) * 3
        g.globalAlpha = 0.55
        g.lineWidth = 6 + k
        g.beginPath()
        g.moveTo(from.x + j(), from.y + j())
        g.lineTo(to.x + j(), to.y + j())
        g.stroke()
      }
    }
    g.globalAlpha = 1
  }

  const stamp = (x: number, y: number) => {
    const g = ctx.current!
    const s = 70
    g.save()
    g.translate(x, y)
    g.fillStyle = color
    g.strokeStyle = 'rgba(0,0,0,.18)'
    g.lineWidth = 5
    g.beginPath()
    if (shape === 'star') {
      for (let i = 0; i < 10; i++) {
        const r = i % 2 ? s * 0.45 : s
        const a = (Math.PI / 5) * i - Math.PI / 2
        g.lineTo(Math.cos(a) * r, Math.sin(a) * r)
      }
      g.closePath()
    } else if (shape === 'heart') {
      g.moveTo(0, s * 0.8)
      g.bezierCurveTo(-s * 1.3, -s * 0.1, -s * 0.6, -s * 1.1, 0, -s * 0.4)
      g.bezierCurveTo(s * 0.6, -s * 1.1, s * 1.3, -s * 0.1, 0, s * 0.8)
    } else if (shape === 'circle') {
      g.arc(0, 0, s * 0.8, 0, Math.PI * 2)
    } else {
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i
        g.moveTo(Math.cos(a) * s * 0.5 + s * 0.35, Math.sin(a) * s * 0.5)
        g.arc(Math.cos(a) * s * 0.5, Math.sin(a) * s * 0.5, s * 0.35, 0, Math.PI * 2)
      }
    }
    g.fill()
    g.stroke()
    if (shape === 'flower') {
      g.beginPath()
      g.fillStyle = '#facc15'
      g.arc(0, 0, s * 0.3, 0, Math.PI * 2)
      g.fill()
    }
    g.restore()
  }

  const down = (e: React.PointerEvent) => {
    setPalette(false)
    setShapes(false)
    const p = pos(e)
    if (tool === 'formas') {
      snapshot()
      stamp(p.x, p.y)
      sfx.stamp()
      haptic(20)
      commit()
      return
    }
    if (tool === 'texto') {
      setTextAt(p)
      setTextVal('')
      return
    }
    if (tool === 'cores') return
    ;(e.target as Element).setPointerCapture(e.pointerId)
    snapshot()
    drawing.current = true
    last.current = p
    stroke(p, { x: p.x + 0.1, y: p.y + 0.1 })
  }
  const move = (e: React.PointerEvent) => {
    if (!drawing.current || !last.current) return
    const p = pos(e)
    stroke(last.current, p)
    last.current = p
    const now = performance.now()
    if (now - lastScribble.current > 90) {
      lastScribble.current = now
      sfx.scribble()
    }
  }
  const up = () => {
    if (!drawing.current) return
    drawing.current = false
    last.current = null
    commit()
  }

  const doUndo = () => {
    if (!undo.length) return sfx.locked()
    sfx.tap()
    const g = ctx.current!
    setRedo((r) => [...r, g.getImageData(0, 0, W, H)])
    g.putImageData(undo[undo.length - 1], 0, 0)
    setUndo((u) => u.slice(0, -1))
    onChange(canvas.current!.toDataURL('image/jpeg', 0.85))
  }
  const doRedo = () => {
    if (!redo.length) return sfx.locked()
    sfx.tap()
    const g = ctx.current!
    setUndo((u) => [...u, g.getImageData(0, 0, W, H)])
    g.putImageData(redo[redo.length - 1], 0, 0)
    setRedo((r) => r.slice(0, -1))
    onChange(canvas.current!.toDataURL('image/jpeg', 0.85))
  }
  const clear = () => {
    if (!armedClear) {
      sfx.locked()
      setArmedClear(true)
      speak('Toque de novo para apagar tudo.')
      window.setTimeout(() => setArmedClear(false), 2200)
      return
    }
    snapshot()
    sfx.whoosh()
    const g = ctx.current!
    g.fillStyle = '#fff'
    g.fillRect(0, 0, W, H)
    setArmedClear(false)
    setEmpty(true)
    onChange(undefined)
  }

  const placeText = () => {
    if (textAt && textVal.trim()) {
      snapshot()
      const g = ctx.current!
      g.fillStyle = color === '#ffffff' ? '#1e1b4b' : color
      g.font = '600 72px Fredoka, Nunito, sans-serif'
      g.textBaseline = 'middle'
      g.fillText(textVal.trim(), textAt.x, textAt.y)
      sfx.stamp()
      commit()
    }
    setTextAt(null)
  }

  const pickTool = (t: Tool) => {
    sfx.pop()
    if (t === 'cores') {
      setPalette((p) => !p)
      setShapes(false)
      return
    }
    if (t === 'formas') {
      setShapes((s) => (tool === 'formas' ? !s : true))
      setPalette(false)
    } else {
      setShapes(false)
      setPalette(false)
    }
    setTool(t)
    if (t === 'lapis' || t === 'pincel') setDrawTool(t)
    speak(TOOLS.find((x) => x.id === t)!.label)
  }

  return (
    <div className="draw">
      <div className="draw__tools" role="toolbar" aria-label="Ferramentas">
        {TOOLS.map((t) => {
          const active = t.id === tool || (t.id === 'cores' && palette)
          return (
            <motion.button key={t.id} className={`tool ${active ? 'is-on' : ''}`} whileHover={{ x: 3 }} whileTap={{ scale: 0.92 }} onClick={() => pickTool(t.id)}>
              {active && t.id !== 'cores' && <motion.span layoutId="tool-pill" className="tool__pill" transition={{ type: 'spring', stiffness: 500, damping: 34 }} />}
              <span className="tool__icon">
                {t.id === 'texto' ? <span className="tool__aa">Aa</span> : <Art name={t.img!} />}
              </span>
              <span className="tool__label">{t.label}</span>
            </motion.button>
          )
        })}
        <AnimatePresence>
          {palette && (
            <motion.div key="palette" className="pop pop--palette" initial={{ opacity: 0, scale: 0.8, x: -10 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.8 }}>
              {COLORS.map((c) => (
                <motion.button
                  key={c}
                  className={`swatch ${c === color ? 'is-on' : ''}`}
                  style={{ background: c }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={() => {
                    sfx.pop()
                    setColor(c)
                    setPalette(false)
                    if (tool === 'borracha' || tool === 'cores') setTool(drawTool)
                  }}
                  aria-label={`Cor ${c}`}
                />
              ))}
            </motion.div>
          )}
          {shapes && (
            <motion.div key="shapes" className="pop pop--shapes" initial={{ opacity: 0, scale: 0.8, x: -10 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.8 }}>
              {(['star', 'heart', 'circle', 'flower'] as Shape[]).map((s) => (
                <motion.button
                  key={s}
                  className={`shape-btn ${s === shape ? 'is-on' : ''}`}
                  whileTap={{ scale: 0.85 }}
                  onClick={() => {
                    sfx.pop()
                    setShape(s)
                    setShapes(false)
                  }}
                  style={{ color }}
                >
                  {s === 'star' ? '★' : s === 'heart' ? '♥' : s === 'circle' ? '●' : '✿'}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="draw__board">
        <div className={`draw__canvas tool-${tool}`}>
          <canvas ref={canvas} width={W} height={H} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onPointerLeave={up} />
          <AnimatePresence>
            {empty && !textAt && (
              <motion.div key="hint" className="draw__hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                <motion.span animate={{ rotate: [-10, 10, -10], x: [-6, 6, -6] }} transition={{ duration: 1.6, repeat: Infinity }}>
                  <Art name="tool-pencil" />
                </motion.span>
                Desenhe aqui!
              </motion.div>
            )}
          </AnimatePresence>
          {textAt && (
            <div className="draw__text" style={{ left: textAt.cx, top: textAt.cy }}>
              <input
                autoFocus
                value={textVal}
                maxLength={24}
                placeholder="Escreva…"
                onChange={(e) => setTextVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') placeText()
                  if (e.key === 'Escape') setTextAt(null)
                }}
                style={{ color: color === '#ffffff' ? '#1e1b4b' : color }}
              />
              <button onClick={placeText} aria-label="Colocar texto">
                <Icon.check />
              </button>
            </div>
          )}
        </div>
        <div className="draw__bottom">
          <motion.button className="round-btn" whileTap={{ scale: 0.88, rotate: -20 }} onClick={doUndo} disabled={!undo.length} aria-label="Desfazer">
            <Icon.undo />
          </motion.button>
          <motion.button className="round-btn" whileTap={{ scale: 0.88, rotate: 20 }} onClick={doRedo} disabled={!redo.length} aria-label="Refazer">
            <Icon.redo />
          </motion.button>
          <span className="draw__spacer" />
          <motion.button
            className={`round-btn round-btn--trash ${armedClear ? 'is-armed' : ''}`}
            animate={armedClear ? { rotate: [0, -12, 12, -8, 8, 0] } : { rotate: 0 }}
            transition={{ duration: 0.5 }}
            whileTap={{ scale: 0.88 }}
            onClick={clear}
            aria-label="Apagar tudo"
          >
            <Icon.trash />
          </motion.button>
        </div>
      </div>
    </div>
  )
}
