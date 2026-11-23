'use client'

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import s from './planeta-girando.module.css'

/* =====================================================================
   PlanetaGirando · Exploradores — giro 3D no eixo vertical
   ---------------------------------------------------------------------
   O planeta gira como um globo: a superfície corre na horizontal e o
   que está na frente vai para trás e volta pelo outro lado.

   Como funciona:
   1. ESFERA (WebGL2). A arte de frente vira uma textura 360° (gerada
      por scripts/planetas/preparar-planeta.py) só com a cor da massinha.
      A luz que vinha pintada na arte é medida pelo script; a parte que
      mudaria de lugar com o giro (a horizontal) é devolvida aqui, parada:
      no ângulo 0 o planeta fica igual à arte e, girando, a luz fica no
      lugar, como num globo de verdade.
   2. ELEMENTOS. O que sai da silhueta (casa, caverna, polvo, ilha) fica
      PARADO por cima, exatamente com as proporções da arte. Só a esfera
      gira por baixo.
   3. MÃO. Arrastar na horizontal gira o planeta; ao soltar, ele segue
      com inércia e volta ao giro normal no sentido em que foi jogado.
      As setas do teclado fazem o mesmo.
   4. Com “reduzir movimento”, o planeta não gira sozinho (mas dá para
      girar com a mão). Sem WebGL2, mostra a arte original parada.

   Next.js: componente cliente ('use client'), sem dependências.
   ===================================================================== */

export type PlanetaDados = {
  id: string
  /** arte original (fallback e primeiro quadro) */
  arte: string
  /** pasta da textura e dos elementos */
  pasta: string
  tamanhoArte: number
  centro: number[]
  raio: number
  textura: string
  /** camada estática com os elementos que saem da esfera */
  elementos: string
  /** luz pintada na arte, medida pelo script: S(x, y) = c0 + c1·x + c2·y + c3·x² + c4·y² + c5·x·y + c6·r⁴ */
  luz?: number[]
  /** a textura guarda cor × ganho (margem contra estouro); o shader desfaz */
  ganho?: number
}

export type Sentido = 'direita' | 'esquerda'

export type PlanetaGirandoProps = {
  planeta: PlanetaDados
  /** prefixo dos caminhos (ex.: '/' no Next.js, './' em subpasta). Padrão: '/' */
  base?: string
  alt?: string
  /** largura e altura (px ou medida CSS). Padrão: 240 */
  tamanho?: number | string
  /** para onde a superfície da frente corre. Padrão: 'direita' */
  sentido?: Sentido
  /** chamado quando a pessoa joga o planeta para o outro lado */
  onSentidoChange?: (s: Sentido) => void
  /** para o giro automático (freia suave); a mão continua funcionando */
  pausado?: boolean
  /** deixa girar com a mão e com as setas. Padrão: true */
  arrastavel?: boolean
  /** ângulo inicial (graus); 0 = a arte original */
  inicio?: number
  /** luz da arte, parada sobre a esfera (false = só a cor). Padrão: true */
  luz?: boolean
  /** sobe e desce devagar. Padrão: true */
  flutuar?: boolean
  /** cor do halo (r, g, b) ou false. Padrão: '92, 196, 255' */
  halo?: string | false
  /** sombra de contato embaixo. Padrão: true */
  sombra?: boolean
  className?: string
  style?: CSSProperties
}

/** uma volta a cada 40 s: a única velocidade do giro */
export const SEGUNDOS_POR_VOLTA = 40
const VEL_AUTO = (2 * Math.PI) / SEGUNDOS_POR_VOLTA
const VEL_MAX = 7 // rad/s, teto do arremesso
const IMPULSO_TECLA = 1.2 // rad/s por toque na seta (≈ 75° com o embalo)

const VERT = `#version 300 es
in vec2 p;
out vec2 v;
void main() { v = p; gl_Position = vec4(p, 0.0, 1.0); }`

const FRAG = `#version 300 es
precision highp float;
uniform sampler2D tex;
uniform float ang;
uniform float luz;
uniform float borda;
uniform float C[7];
uniform float ganho;
in vec2 v;
out vec4 cor;
const float PI = 3.14159265359;
void main() {
  float r2 = dot(v, v);
  if (r2 > 1.0) { cor = vec4(0.0); return; }
  float z = sqrt(1.0 - r2);
  vec3 n = vec3(v, z);
  float c = cos(ang), s = sin(ang);
  float x0 = n.x * c - n.z * s;
  float z0 = n.x * s + n.z * c;
  float lon = atan(x0, z0);
  float lat = asin(clamp(n.y, -1.0, 1.0));
  vec2 uv = vec2(lon / (2.0 * PI) + 0.5, 0.5 - lat / PI);
  // derivadas sem o salto da emenda (lon = ±180°), para o mipmap não riscar
  vec2 dx = dFdx(uv), dy = dFdy(uv);
  vec2 uv2 = vec2(fract(uv.x + 0.5), uv.y);
  vec2 dx2 = dFdx(uv2), dy2 = dFdy(uv2);
  if (abs(dx2.x) < abs(dx.x)) dx.x = dx2.x;
  if (abs(dy2.x) < abs(dy.x)) dy.x = dy2.x;
  vec3 c3 = textureGrad(tex, uv, dx, dy).rgb;
  // a textura não tem a variação horizontal da luz da arte; ela volta aqui, parada na tela
  // (a de cima para baixo continua pintada: no giro vertical ela nunca se move)
  float y2 = v.y * v.y;
  float S = C[0] + C[1] * v.x + C[2] * v.y + C[3] * v.x * v.x + C[4] * y2 + C[5] * v.x * v.y + C[6] * r2 * r2;
  float S0 = C[0] + C[2] * v.y + C[4] * y2 + C[6] * y2 * y2;
  float Sh = clamp(S / max(S0, 0.001), 0.5, 1.5);
  c3 *= mix(1.0, Sh, luz) / ganho;
  float a = 1.0 - smoothstep(1.0 - borda, 1.0, sqrt(r2));
  cor = vec4(c3 * a, a);
}`

function criarGL(canvas: HTMLCanvasElement, img: HTMLImageElement, coef: number[], ganho: number) {
  const gl = canvas.getContext('webgl2', { premultipliedAlpha: true, alpha: true, antialias: false })
  if (!gl) return null
  const sh = (tipo: number, src: string) => {
    const o = gl.createShader(tipo)!
    gl.shaderSource(o, src)
    gl.compileShader(o)
    if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o) || 'shader')
    return o
  }
  const prog = gl.createProgram()!
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT))
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG))
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) || 'programa')
  gl.useProgram(prog)
  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(prog, 'p')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
  const t = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, t)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
  gl.generateMipmap(gl.TEXTURE_2D)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  const u = {
    ang: gl.getUniformLocation(prog, 'ang'),
    luz: gl.getUniformLocation(prog, 'luz'),
    borda: gl.getUniformLocation(prog, 'borda'),
    C: gl.getUniformLocation(prog, 'C'),
    ganho: gl.getUniformLocation(prog, 'ganho'),
  }
  gl.uniform1f(u.ganho, ganho)
  gl.uniform1fv(u.C, new Float32Array([0, 1, 2, 3, 4, 5, 6].map((i) => coef[i] ?? (i === 0 ? 1 : 0))))
  gl.clearColor(0, 0, 0, 0)
  return {
    desenhar(ang: number, luz: number, w: number) {
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.uniform1f(u.ang, ang)
      gl.uniform1f(u.luz, luz)
      gl.uniform1f(u.borda, Math.min(0.2, 2.2 / Math.max(w, 1)))
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    },
    liberar() {
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    },
  }
}

const juntar = (base: string, ...partes: string[]) => (base.endsWith('/') ? base : base + '/') + partes.join('/')

function reduzMovimento() {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

export function PlanetaGirando({
  planeta,
  base = '/',
  alt = '',
  tamanho = 240,
  sentido = 'direita',
  onSentidoChange,
  pausado = false,
  arrastavel = true,
  inicio = 0,
  luz = true,
  flutuar = true,
  halo = '92, 196, 255',
  sombra = true,
  className,
  style,
}: PlanetaGirandoProps) {
  const caixa = useRef<HTMLDivElement>(null)
  const palco = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [pronto, setPronto] = useState(false)
  const [semGL, setSemGL] = useState(false)
  const [reduz] = useState(reduzMovimento)

  // estado do giro, lido pelo laço a cada quadro (sem re-render)
  const giro = useRef({
    ang: (inicio * Math.PI) / 180,
    vel: 0,
    dir: sentido === 'direita' ? 1 : -1,
    tau: 0.6,
    luz: luz ? 1 : 0,
    arrastando: false,
    escalaR: 1, // raio da esfera em px de tela
  })
  const props = useRef({ pausado, luz, onSentidoChange })
  props.current = { pausado, luz, onSentidoChange }

  // trocar o sentido por fora (ex.: um botão) vira o giro com suavidade
  useEffect(() => {
    giro.current.dir = sentido === 'direita' ? 1 : -1
    giro.current.tau = 0.6
  }, [sentido])

  const W = planeta.tamanhoArte
  const [cx, cy] = planeta.centro
  const R = planeta.raio

  useEffect(() => {
    let vivo = true
    let gl: ReturnType<typeof criarGL> = null
    let quadro = 0
    let visivel = true
    let t0 = 0
    const g = giro.current

    const medir = () => {
      const el = caixa.current
      const st = palco.current
      const cv = canvas.current
      if (!el || !st || !cv) return
      const B = el.clientWidth
      const escala = B / W
      g.escalaR = R * escala
      st.style.transform = `translate(${B / 2 - escala * cx}px, ${B / 2 - escala * cy}px) scale(${escala})`
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const lado = Math.max(2, Math.round(2 * R * escala * dpr))
      if (cv.width !== lado) {
        cv.width = lado
        cv.height = lado
      }
    }

    const passo = (t: number) => {
      const dt = t0 ? Math.min(0.1, (t - t0) / 1000) : 0
      t0 = t
      const p = props.current
      if (!g.arrastando) {
        const alvo = p.pausado || reduz ? 0 : g.dir * VEL_AUTO
        g.vel += (alvo - g.vel) * (1 - Math.exp(-dt / g.tau))
        if (Math.abs(alvo - g.vel) < 0.0005) {
          g.vel = alvo
          g.tau = 0.6
        }
        g.ang += g.vel * dt
      }
      g.luz += ((p.luz ? 1 : 0) - g.luz) * (1 - Math.exp(-dt / 0.2))
      gl?.desenhar(g.ang, g.luz, canvas.current?.width ?? 1)
    }

    const laco = (t: number) => {
      if (!vivo) return
      if (visivel) passo(t)
      else t0 = 0
      quadro = requestAnimationFrame(laco)
    }

    // estado do giro visível para testes automatizados (propriedade JS, não toca o DOM)
    if (caixa.current) (caixa.current as HTMLDivElement & { __giro?: typeof g }).__giro = g

    const ro = new ResizeObserver(medir)
    if (caixa.current) ro.observe(caixa.current)
    const io = new IntersectionObserver(([e]) => (visivel = e.isIntersecting))
    if (caixa.current) io.observe(caixa.current)

    const img = new Image()
    img.decoding = 'async'
    img.onload = () => {
      if (!vivo || !canvas.current) return
      try {
        gl = criarGL(canvas.current, img, planeta.luz ?? [1], planeta.ganho ?? 1)
      } catch {
        gl = null
      }
      if (!gl) {
        setSemGL(true)
        return
      }
      medir()
      setPronto(true)
      quadro = requestAnimationFrame(laco)
    }
    img.onerror = () => setSemGL(true)
    img.src = juntar(base, planeta.pasta, planeta.textura)

    return () => {
      vivo = false
      cancelAnimationFrame(quadro)
      ro.disconnect()
      io.disconnect()
      gl?.liberar()
    }
    // o laço lê o resto por ref; só reinicia se trocar o planeta
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planeta, base])

  /* ---- mão: arrastar na horizontal ---------------------------------- */
  const amostras = useRef<{ t: number; x: number }[]>([])
  const ultimoX = useRef(0)
  const animado = pronto && !semGL
  const podeMexer = animado && arrastavel

  const virar = (vel: number) => {
    const g = giro.current
    if (Math.abs(vel) < 0.25) return
    const dir = vel > 0 ? 1 : -1
    if (dir !== g.dir) {
      g.dir = dir
      props.current.onSentidoChange?.(dir > 0 ? 'direita' : 'esquerda')
    }
  }

  const aoApertar = (e: PointerEvent<HTMLDivElement>) => {
    if (!podeMexer || (e.pointerType === 'mouse' && e.button !== 0)) return
    e.currentTarget.setPointerCapture(e.pointerId)
    const g = giro.current
    g.arrastando = true
    g.vel = 0
    ultimoX.current = e.clientX
    amostras.current = [{ t: e.timeStamp, x: e.clientX }]
    e.currentTarget.dataset.arrastando = ''
  }
  const aoMover = (e: PointerEvent<HTMLDivElement>) => {
    const g = giro.current
    if (!g.arrastando) return
    const dx = e.clientX - ultimoX.current
    ultimoX.current = e.clientX
    // a superfície no centro acompanha o dedo: dx px = dx / raio radianos
    g.ang += dx / Math.max(g.escalaR, 1)
    const a = amostras.current
    a.push({ t: e.timeStamp, x: e.clientX })
    while (a.length > 2 && e.timeStamp - a[0].t > 90) a.shift()
  }
  const aoSoltar = (e: PointerEvent<HTMLDivElement>) => {
    const g = giro.current
    if (!g.arrastando) return
    g.arrastando = false
    delete e.currentTarget.dataset.arrastando
    const a = amostras.current
    const ini = a[0]
    const fim = a[a.length - 1]
    const dt = (fim.t - ini.t) / 1000
    // parado antes de soltar (sem amostras recentes) = sem arremesso
    const recente = e.timeStamp - fim.t < 60
    const vel = dt > 0.012 && recente ? (fim.x - ini.x) / dt / Math.max(g.escalaR, 1) : 0
    g.vel = reduz ? 0 : Math.max(-VEL_MAX, Math.min(VEL_MAX, vel))
    g.tau = 1.1 // desacelera devagar, como um globo de verdade
    virar(vel)
  }
  const aoTeclar = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!podeMexer || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return
    e.preventDefault()
    const g = giro.current
    const sinal = e.key === 'ArrowRight' ? 1 : -1
    if (reduz) {
      g.ang += sinal * 0.35
      return
    }
    g.vel = Math.max(-VEL_MAX, Math.min(VEL_MAX, g.vel + sinal * IMPULSO_TECLA))
    g.tau = 1.1
    virar(g.vel)
  }

  const vars = {
    '--pl-tam': typeof tamanho === 'number' ? `${tamanho}px` : tamanho,
    '--pl-r': (R / W) * 100,
    '--pl-dx': `${(0.5 - cx / W) * 100}%`,
    '--pl-dy': `${(0.5 - cy / W) * 100}%`,
    '--pl-halo': halo || '0, 0, 0',
    ...style,
  } as CSSProperties

  const classes = [s.planeta, (!flutuar || reduz) && s.parado, podeMexer && s.arrastavel, className].filter(Boolean).join(' ')
  const rotulo = [alt, podeMexer ? 'Arraste ou use as setas para girar.' : ''].filter(Boolean).join('. ')

  return (
    <div
      ref={caixa}
      className={classes}
      style={vars}
      role={rotulo ? 'img' : undefined}
      aria-label={rotulo || undefined}
      aria-hidden={rotulo ? undefined : true}
      tabIndex={podeMexer ? 0 : undefined}
      onPointerDown={aoApertar}
      onPointerMove={aoMover}
      onPointerUp={aoSoltar}
      onPointerCancel={aoSoltar}
      onKeyDown={aoTeclar}
    >
      {sombra && <span className={s.sombra} aria-hidden />}
      <div className={s.flutua}>
        {halo && <span className={s.halo} aria-hidden />}
        {/* arte original: primeiro quadro, enquanto carrega, e quando não há WebGL2 */}
        <img className={`${s.arte} ${animado ? s.oculta : ''}`} src={juntar(base, planeta.arte)} alt="" draggable={false} />
        {!semGL && (
          <div ref={palco} className={`${s.palco} ${animado ? '' : s.oculta}`} style={{ width: W, height: W }}>
            <canvas ref={canvas} className={s.esfera} style={{ left: cx - R, top: cy - R, width: 2 * R, height: 2 * R }} />
            <img className={s.elementos} src={juntar(base, planeta.pasta, planeta.elementos)} alt="" draggable={false} />
          </div>
        )}
      </div>
    </div>
  )
}

export default PlanetaGirando
