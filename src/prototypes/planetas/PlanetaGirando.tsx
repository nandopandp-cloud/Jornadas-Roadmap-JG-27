'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import s from './planeta-girando.module.css'

/* =====================================================================
   PlanetaGirando · Exploradores — giro 3D no eixo vertical
   ---------------------------------------------------------------------
   O planeta gira como um globo: a superfície corre na horizontal e o
   que está na frente vai para trás e volta pelo outro lado.

   Como funciona:
   1. ESFERA (WebGL2). A arte de frente vira uma textura 360° (gerada
      por scripts/planetas/preparar-planeta.py). Um shader desenha a
      esfera girando, com uma luz parada (alto à esquerda) por pixel.
   2. PEÇAS. Os elementos que saem da silhueta (casa, caverna, polvo,
      ilha) são recortes da arte presos a um ponto da superfície. A cada
      quadro eles acompanham esse ponto, giram com a normal, encurtam
      quando ficam de frente para a câmera, escurecem do lado da sombra
      e passam para trás da esfera.
   3. Sem WebGL2 ou com “reduzir movimento”, mostra a arte original
      parada. A arte também aparece enquanto a textura carrega.

   Next.js: componente cliente ('use client'), sem dependências.
   ===================================================================== */

export type PecaPlaneta = {
  nome: string
  src: string
  /** caixa do recorte, em px da arte */
  x: number
  y: number
  w: number
  h: number
  /** ponto de apoio na superfície, em px da arte */
  apoio: number[]
  /** posição do apoio na esfera (radianos, já na escala da textura) */
  lon: number
  lat: number
}

export type PlanetaDados = {
  id: string
  /** arte original (fallback e primeiro quadro) */
  arte: string
  /** pasta da textura e das peças */
  pasta: string
  tamanhoArte: number
  centro: number[]
  raio: number
  textura: string
  pecas: PecaPlaneta[]
}

export type PlanetaGirandoProps = {
  planeta: PlanetaDados
  /** prefixo dos caminhos (ex.: '/' no Next.js, './' em subpasta). Padrão: '/' */
  base?: string
  alt?: string
  /** largura e altura (px ou medida CSS). Padrão: 240 */
  tamanho?: number | string
  /** segundos por volta. Padrão: 24 */
  duracao?: number
  /** para onde a superfície da frente corre. Padrão: 'direita' */
  sentido?: 'direita' | 'esquerda'
  /** multiplicador da velocidade (0 pausa; negativo inverte). Muda suave. Padrão: 1 */
  ritmo?: number
  /** ângulo inicial (graus) */
  inicio?: number
  /** luz fixa (sombra e brilho). Padrão: true */
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

/* luz parada, em coordenadas da tela (y para cima, z para a câmera) */
const LUZ = (() => {
  const v = [-0.45, 0.55, 0.7]
  const n = Math.hypot(v[0], v[1], v[2])
  return v.map((x) => x / n) as [number, number, number]
})()

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
uniform vec3 L;
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
  float d = max(dot(n, L), 0.0);
  float sombra = mix(1.0, mix(0.66, 1.1, d) * (0.84 + 0.16 * z), luz);
  c3 = c3 * sombra + luz * 0.08 * pow(d, 8.0);
  float a = 1.0 - smoothstep(1.0 - borda, 1.0, sqrt(r2));
  cor = vec4(c3 * a, a);
}`

function criarGL(canvas: HTMLCanvasElement, img: HTMLImageElement) {
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
    L: gl.getUniformLocation(prog, 'L'),
  }
  gl.uniform3f(u.L, LUZ[0], LUZ[1], LUZ[2])
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
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

export function PlanetaGirando({
  planeta,
  base = '/',
  alt = '',
  tamanho = 240,
  duracao = 24,
  sentido = 'direita',
  ritmo = 1,
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
  const pecas = useRef<(HTMLImageElement | null)[]>([])
  const [pronto, setPronto] = useState(false)
  const [parado, setParado] = useState(false)

  // valores que o laço lê a cada quadro sem reiniciar
  const ao = useRef({ duracao, sentido, ritmo, luz })
  ao.current = { duracao, sentido, ritmo, luz }

  const W = planeta.tamanhoArte
  const [cx, cy] = planeta.centro
  const R = planeta.raio

  useEffect(() => {
    if (reduzMovimento()) {
      setParado(true)
      return
    }
    let vivo = true
    let gl: ReturnType<typeof criarGL> = null
    let quadro = 0
    let visivel = true
    let escala = 1
    let ang = (inicio * Math.PI) / 180
    let vel = ao.current.ritmo
    let luzAtual = ao.current.luz ? 1 : 0
    let t0 = 0

    const dados = planeta.pecas.map((p) => {
      const ny0 = -(p.apoio[1] - cy) / R
      const nx0 = (p.apoio[0] - cx) / R
      const L0 = Math.min(1, Math.hypot(nx0, ny0))
      const fi0 = Math.atan2(ny0, nx0)
      const nx = Math.cos(p.lat) * Math.sin(p.lon)
      const ny = Math.sin(p.lat)
      const nz = Math.cos(p.lat) * Math.cos(p.lon)
      const d0 = Math.max(0, nx * LUZ[0] + ny * LUZ[1] + nz * LUZ[2])
      return { p, L0, fi0, nx, ny, nz, d0 }
    })
    const f = (L: number) => 0.45 + 0.55 * L

    const medir = () => {
      const el = caixa.current
      const st = palco.current
      const cv = canvas.current
      if (!el || !st || !cv) return
      const B = el.clientWidth
      escala = B / W
      st.style.transform = `translate(${B / 2 - escala * cx}px, ${B / 2 - escala * cy}px) scale(${escala})`
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const lado = Math.max(2, Math.round(2 * R * escala * dpr))
      if (cv.width !== lado) {
        cv.width = lado
        cv.height = lado
      }
    }

    const desenhar = (t: number) => {
      const dt = t0 ? Math.min(0.1, (t - t0) / 1000) : 0
      t0 = t
      const alvo = ao.current
      vel += (alvo.ritmo - vel) * (1 - Math.exp(-dt / 0.35))
      if (Math.abs(alvo.ritmo - vel) < 0.004) vel = alvo.ritmo
      luzAtual += ((alvo.luz ? 1 : 0) - luzAtual) * (1 - Math.exp(-dt / 0.2))
      const dir = alvo.sentido === 'direita' ? 1 : -1
      ang += ((dt * 2 * Math.PI) / Math.max(1, alvo.duracao)) * vel * dir
      gl?.desenhar(ang, luzAtual, canvas.current?.width ?? 1)

      const c = Math.cos(ang)
      const sn = Math.sin(ang)
      dados.forEach((d, i) => {
        const el = pecas.current[i]
        if (!el) return
        const x = d.nx * c + d.nz * sn
        const z = -d.nx * sn + d.nz * c
        const y = d.ny
        const L = Math.hypot(x, y)
        const fi = Math.atan2(y, x)
        const sN = f(L) / f(d.L0)
        const ux = Math.cos(fi), uy = -Math.sin(fi)
        const vx = Math.cos(d.fi0), vy = -Math.sin(d.fi0)
        const a = sN * ux * vx + uy * vy
        const cc = sN * ux * vy - uy * vx
        const b = sN * uy * vx - ux * vy
        const dd = sN * uy * vy + ux * vx
        const tx = cx + R * x - d.p.apoio[0]
        const ty = cy - R * y - d.p.apoio[1]
        el.style.transform = `translate(${tx}px, ${ty}px) matrix(${a}, ${b}, ${cc}, ${dd}, 0, 0)`
        el.style.zIndex = z >= 0 ? '3' : '1'
        el.style.opacity = String(Math.min(1, Math.max(0, (z + 0.75) / 0.3)))
        const dl = Math.max(0, x * LUZ[0] + y * LUZ[1] + z * LUZ[2])
        const brilho = 1 + luzAtual * ((0.7 + 0.42 * dl) / (0.7 + 0.42 * d.d0) - 1)
        el.style.filter = `brightness(${Math.min(1.15, Math.max(0.55, brilho)).toFixed(3)})`
      })
    }

    const laco = (t: number) => {
      if (!vivo) return
      if (visivel) desenhar(t)
      else t0 = 0
      quadro = requestAnimationFrame(laco)
    }

    const ro = new ResizeObserver(medir)
    if (caixa.current) ro.observe(caixa.current)
    const io = new IntersectionObserver(([e]) => (visivel = e.isIntersecting))
    if (caixa.current) io.observe(caixa.current)

    const img = new Image()
    img.decoding = 'async'
    img.onload = () => {
      if (!vivo || !canvas.current) return
      try {
        gl = criarGL(canvas.current, img)
      } catch {
        gl = null
      }
      if (!gl) {
        setParado(true)
        return
      }
      medir()
      setPronto(true)
      quadro = requestAnimationFrame(laco)
    }
    img.onerror = () => setParado(true)
    img.src = juntar(base, planeta.pasta, planeta.textura)

    return () => {
      vivo = false
      cancelAnimationFrame(quadro)
      ro.disconnect()
      io.disconnect()
      gl?.liberar()
    }
    // o laço lê duracao/sentido/ritmo/luz por ref; só reinicia se trocar o planeta
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planeta, base])

  const vars = {
    '--pl-tam': typeof tamanho === 'number' ? `${tamanho}px` : tamanho,
    '--pl-r': (R / W) * 100,
    '--pl-dx': `${(0.5 - cx / W) * 100}%`,
    '--pl-dy': `${(0.5 - cy / W) * 100}%`,
    '--pl-halo': halo || '0, 0, 0',
    ...style,
  } as CSSProperties

  const animado = pronto && !parado
  const classes = [s.planeta, !flutuar && s.parado, className].filter(Boolean).join(' ')

  return (
    <div ref={caixa} className={classes} style={vars} role={alt ? 'img' : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true}>
      {sombra && <span className={s.sombra} aria-hidden />}
      <div className={s.flutua}>
        {halo && <span className={s.halo} aria-hidden />}
        {/* arte original: primeiro quadro, enquanto carrega, e quando não dá para animar */}
        <img className={`${s.arte} ${animado ? s.oculta : ''}`} src={juntar(base, planeta.arte)} alt="" draggable={false} />
        {!parado && (
          <div ref={palco} className={`${s.palco} ${animado ? '' : s.oculta}`} style={{ width: W, height: W }}>
            <canvas ref={canvas} className={s.esfera} style={{ left: cx - R, top: cy - R, width: 2 * R, height: 2 * R }} />
            {planeta.pecas.map((p, i) => (
              <img
                key={p.nome}
                ref={(el) => {
                  pecas.current[i] = el
                }}
                className={s.peca}
                src={juntar(base, planeta.pasta, p.src)}
                alt=""
                draggable={false}
                style={{ left: p.x, top: p.y, width: p.w, height: p.h, transformOrigin: `${p.apoio[0] - p.x}px ${p.apoio[1] - p.y}px` }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PlanetaGirando
