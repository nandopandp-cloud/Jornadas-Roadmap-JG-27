'use client'

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import s from './planeta-girando.module.css'

/* =====================================================================
   PlanetaGirando · Exploradores — giro 3D no eixo vertical
   ---------------------------------------------------------------------
   O planeta inteiro (esfera + casa, polvo, ilha, rochedo…) gira como um
   objeto 3D só, a partir de DUAS artes: a vista de frente e a de trás.

   Como funciona (WebGL2):
   1. GEOMETRIA. Uma esfera + um relevo "inflado" a partir das silhuetas
      das duas vistas (perfil.png, gerado por scripts/planetas/
      preparar-planeta.py). Os elementos que saem da esfera ficam na
      borda das duas vistas, então a silhueta diz quanto eles saem; o
      relevo tem espessura arredondada. O shader acha, para cada pixel,
      onde o raio encosta nesse objeto (ray marching).
   2. COR. Cada ponto do objeto pega a cor da vista que o enxerga, com
      peso maior para a vista mais próxima do ângulo atual: a 0° o
      planeta é exatamente a arte da frente e a 180°, exatamente a de
      trás; no meio, a troca acontece no próprio 3D.
   3. LUZ. A parte horizontal da luz pintada nas artes foi tirada pelo
      script e volta aqui, parada na tela: girando, a luz fica no lugar.
   4. MÃO. Arrastar na horizontal gira o planeta; ao soltar, ele segue
      com embalo e volta ao giro normal no sentido em que foi jogado.
      As setas do teclado fazem o mesmo.
   5. Com “reduzir movimento”, não gira sozinho (a mão continua). Sem
      WebGL2, mostra a arte original parada.

   Next.js: componente cliente ('use client'), sem dependências.
   ===================================================================== */

type Vista = { src: string; u: number; v: number; r: number }

export type PlanetaDados = {
  id: string
  /** arte original de frente (fallback e primeiro quadro) */
  arte: string
  /** pasta com as vistas e o perfil */
  pasta: string
  tamanhoArte: number
  /** centro e raio da esfera na arte de frente (px) */
  centro: number[]
  raio: number
  /** raio do quadro que cabe o relevo, em raios da esfera */
  raioQuadro: number
  /** vistas: imagem e enquadramento da esfera (centro u, v e raio r, em fração da imagem) */
  frente: Vista
  costas: Vista
  /** altura (R) e espessura (G) do relevo por ângulo */
  perfil: string
  alturaMax: number
  /** luz pintada na arte, medida pelo script: S(x, y) = c0 + c1·x + c2·y + c3·x² + c4·y² + c5·x·y + c6·r⁴ */
  luz?: number[]
  /** as vistas guardam cor × ganho (margem contra estouro); o shader desfaz */
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
  /** ângulo inicial (graus); 0 = a arte de frente, 180 = a de trás */
  inicio?: number
  /** luz das artes parada sobre o planeta (false = só a cor). Padrão: true */
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
const DPR_MAX = 1.75 // o ray marching custa por pixel; acima disso não se nota diferença

const VERT = `#version 300 es
in vec2 p;
out vec2 v;
void main() { v = p; gl_Position = vec4(p, 0.0, 1.0); }`

const FRAG = `#version 300 es
precision highp float;
uniform sampler2D texF;    // vista de frente (cor × ganho, alfa pré-multiplicado)
uniform sampler2D texB;    // vista de trás
uniform sampler2D perfil;  // R: altura do relevo, G: meia espessura, por ângulo
uniform vec3 F;            // enquadramento da frente: centro (u, v) e raio, em uv
uniform vec3 B;            // enquadramento das costas
uniform float ang;         // ângulo do giro
uniform float rhoMax;      // raio do quadro, em raios da esfera
uniform float alturaMax;
uniform float espMax;      // maior meia espessura (rad)
uniform float lodF, lodB;
uniform float borda;       // largura do antisserrilhado da esfera, em raios
uniform float luz;
uniform float ganho;
uniform float C[7];
in vec2 v;
out vec4 cor;
const float PI = 3.14159265359;

float altura(vec3 d) {
  vec2 hd = textureLod(perfil, vec2(atan(d.y, d.x) / (2.0 * PI) + 0.5, 0.5), 0.0).rg;
  float esp = max(hd.g * 1.5707963, 0.001);
  float t = asin(min(abs(d.z), 1.0)) / esp;
  return t < 1.0 ? hd.r * alturaMax * sqrt(1.0 - t * t) : 0.0;
}

float campo(vec3 P) {
  float r = length(P);
  return r - (1.0 + altura(P / r));
}

// esticamento: quanto o ponto está mais de frente para a câmera agora do que estava na arte.
// Onde a arte só viu o ponto "de raspão", usa uma versão mais suave da textura (evita listras).
float suavizar(float agora, float naArte) {
  return clamp(log2(max(agora, 0.0) / max(naArte, 0.04)) - 0.6, 0.0, 4.0);
}
vec4 vistaF(vec3 P, float extra) { return textureLod(texF, vec2(F.x + P.x * F.z, F.y - P.y * F.z), lodF + extra); }
vec4 vistaB(vec3 P, float extra) { return textureLod(texB, vec2(B.x - P.x * B.z, B.y - P.y * B.z), lodB + extra); }

// cor de um ponto do objeto. Na esfera, cada lado usa a vista que o enxerga; nos elementos
// (relevo alto), o elemento inteiro usa uma vista só, trocando perto de 90°: as duas artes
// foram feitas separadas e um mesmo elemento muda um pouco de uma para a outra.
vec4 amostra(vec3 P, bool corpo) {
  float r = length(P);
  vec3 n = P / r;
  float perto = 0.5 + 0.5 * cos(ang);          // 1 = de frente, 0 = de costas
  float visF = smoothstep(-0.1, 0.1, n.z);
  float wF = visF * (perto + 0.001);
  float wB = (1.0 - visF) * (1.0 - perto + 0.001);
  float fEsfera = wF / (wF + wB);
  float el = corpo ? 0.0 : smoothstep(0.04, 0.12, r - 1.0);
  float f = mix(fEsfera, smoothstep(0.3, 0.7, perto), el);
  float agora = -n.x * sin(ang) + n.z * cos(ang);  // de frente para a câmera atual
  vec4 a = f > 0.001 ? vistaF(P, suavizar(agora, n.z)) : vec4(0.0);
  vec4 b = f < 0.999 ? vistaB(P, suavizar(agora, -n.z)) : vec4(0.0);
  if (corpo) {
    // a esfera é sólida: perto da borda das artes, puxa a cor para dentro ou usa a outra vista
    if (a.a < 0.98 && f > 0.001) a = mix(vistaF(P * 0.95, 1.0), a, a.a);
    if (b.a < 0.98 && f < 0.999) b = mix(vistaB(P * 0.95, 1.0), b, b.a);
    float pa = f * a.a, pb = (1.0 - f) * b.a;
    if (pa + pb < 0.02) { pa = a.a; pb = b.a; }
    vec3 rgb = (a.rgb * f + b.rgb * (1.0 - f)) / max(pa + pb, 1e-3);
    return vec4(rgb, 1.0);
  }
  // elementos: na troca de vista, a forma é a união das duas (sem fantasma semitransparente);
  // nas pontas (0° e 180°) fica exatamente a arte
  vec4 mist = a * f + b * (1.0 - f);
  float alfa = mix(mist.a, max(a.a, b.a), 4.0 * f * (1.0 - f));
  vec3 rgb = mist.rgb / max(mist.a, 1e-3);
  return vec4(rgb * alfa, alfa);
}

void main() {
  vec2 q = v * rhoMax;                      // ponto da tela, em raios da esfera
  float q2 = dot(q, q);
  if (q2 > rhoMax * rhoMax) { cor = vec4(0.0); return; }
  float c = cos(ang), s = sin(ang);
  float Z = rhoMax + 0.01;
  // raio da câmera (ortográfica) no referencial do planeta
  vec3 o = vec3(q.x * c - Z * s, q.y, q.x * s + Z * c);
  vec3 d = vec3(s, 0.0, -c);
  float meio = sqrt(rhoMax * rhoMax - q2);
  float tA = Z - meio, tB = Z + meio;
  bool corpo = q2 < 1.0;
  float tCorpo = corpo ? Z - sqrt(1.0 - q2) : tB;
  tB = min(tB, tCorpo);
  // o relevo só existe perto do plano z = 0 do planeta: anda só nessa faixa
  float Zs = rhoMax * sin(min(espMax, 1.5));
  if (abs(c) < 1e-4) {
    if (abs(o.z) > Zs) tB = tA;
  } else {
    float t1 = (o.z - Zs) / c, t2 = (o.z + Zs) / c;
    tA = max(tA, min(t1, t2));
    tB = min(tB, max(t1, t2));
  }

  vec4 acc = vec4(0.0);
  if (tB > tA) {
    float dt = (tB - tA) / 64.0;
    float tAnt = tA;
    bool dentro = campo(o + tA * d) < 0.0;
    for (int i = 1; i <= 64; i++) {
      float t = tA + float(i) * dt;
      float f = campo(o + t * d);
      if (!dentro && f < 0.0) {
        float a = tAnt, b = t;
        for (int k = 0; k < 5; k++) {
          float m = 0.5 * (a + b);
          if (campo(o + m * d) < 0.0) b = m; else a = m;
        }
        vec4 sm = amostra(o + b * d, false);
        acc += (1.0 - acc.a) * sm;
        dentro = true;
        if (acc.a > 0.995) break;
      } else if (dentro && f >= 0.0) {
        dentro = false;
      }
      tAnt = t;
    }
  }
  if (corpo && acc.a < 0.995) {
    vec4 sm = amostra(o + tCorpo * d, true);
    sm *= 1.0 - smoothstep(1.0 - borda, 1.0, sqrt(q2));
    acc += (1.0 - acc.a) * sm;
  }

  // luz: só a parte horizontal, parada na tela (a vertical já está nas artes)
  vec2 u = q / max(1.0, length(q));
  float y2 = u.y * u.y, r2 = dot(u, u);
  float S = C[0] + C[1] * u.x + C[2] * u.y + C[3] * u.x * u.x + C[4] * y2 + C[5] * u.x * u.y + C[6] * r2 * r2;
  float S0 = C[0] + C[2] * u.y + C[4] * y2 + C[6] * y2 * y2;
  float Sh = clamp(S / max(S0, 0.001), 0.5, 1.5);
  cor = vec4(acc.rgb * mix(1.0, Sh, luz) / ganho, acc.a);
}`

function carregar(src: string) {
  return new Promise<HTMLImageElement>((ok, falha) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => ok(img)
    img.onerror = falha
    img.src = src
  })
}

function criarGL(canvas: HTMLCanvasElement, planeta: PlanetaDados, imgs: { F: HTMLImageElement; B: HTMLImageElement; P: HTMLImageElement }) {
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

  gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE)
  const textura = (unidade: number, img: HTMLImageElement, dados: boolean) => {
    const t = gl.createTexture()
    gl.activeTexture(gl.TEXTURE0 + unidade)
    gl.bindTexture(gl.TEXTURE_2D, t)
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !dados)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
    if (dados) {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
    } else {
      gl.generateMipmap(gl.TEXTURE_2D)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    }
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  }
  textura(0, imgs.F, false)
  textura(1, imgs.B, false)
  textura(2, imgs.P, true)

  const U = (n: string) => gl.getUniformLocation(prog, n)
  gl.uniform1i(U('texF'), 0)
  gl.uniform1i(U('texB'), 1)
  gl.uniform1i(U('perfil'), 2)
  const { frente: f, costas: b } = planeta
  gl.uniform3f(U('F'), f.u, f.v, f.r)
  gl.uniform3f(U('B'), b.u, b.v, b.r)
  gl.uniform1f(U('rhoMax'), planeta.raioQuadro)
  gl.uniform1f(U('alturaMax'), planeta.alturaMax)
  gl.uniform1f(U('ganho'), planeta.ganho ?? 1)
  const coef = planeta.luz ?? [1]
  gl.uniform1fv(U('C'), new Float32Array([0, 1, 2, 3, 4, 5, 6].map((i) => coef[i] ?? (i === 0 ? 1 : 0))))
  // maior meia espessura do relevo (para limitar a faixa do ray marching)
  const cv = document.createElement('canvas')
  cv.width = imgs.P.width
  cv.height = 1
  const cx2 = cv.getContext('2d')!
  cx2.drawImage(imgs.P, 0, 0)
  const px = cx2.getImageData(0, 0, cv.width, 1).data
  let esp = 0
  for (let i = 0; i < cv.width; i++) esp = Math.max(esp, px[i * 4 + 1])
  gl.uniform1f(U('espMax'), (esp / 255) * (Math.PI / 2) + 0.01)
  const u = { ang: U('ang'), luz: U('luz'), borda: U('borda'), lodF: U('lodF'), lodB: U('lodB') }
  gl.clearColor(0, 0, 0, 0)

  return {
    desenhar(ang: number, luz: number) {
      const lado = canvas.width
      const pxPorRaio = lado / (2 * planeta.raioQuadro)
      gl.viewport(0, 0, lado, canvas.height)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.uniform1f(u.ang, ang)
      gl.uniform1f(u.luz, luz)
      gl.uniform1f(u.borda, Math.min(0.1, 1.6 / Math.max(pxPorRaio, 1)))
      gl.uniform1f(u.lodF, Math.max(0, Math.log2((f.r * imgs.F.width) / pxPorRaio)))
      gl.uniform1f(u.lodB, Math.max(0, Math.log2((b.r * imgs.B.width) / pxPorRaio)))
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
  const RQ = planeta.raioQuadro * R // meio lado do quadro do canvas, em px da arte

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
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_MAX)
      const lado = Math.max(2, Math.round(2 * RQ * escala * dpr))
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
      gl?.desenhar(g.ang, g.luz)
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

    const pasta = (arq: string) => juntar(base, planeta.pasta, arq)
    Promise.all([carregar(pasta(planeta.frente.src)), carregar(pasta(planeta.costas.src)), carregar(pasta(planeta.perfil))])
      .then(([F, B, P]) => {
        if (!vivo || !canvas.current) return
        try {
          gl = criarGL(canvas.current, planeta, { F, B, P })
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
      })
      .catch(() => vivo && setSemGL(true))

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
        {/* arte de frente: primeiro quadro, enquanto carrega, e quando não há WebGL2 */}
        <img className={`${s.arte} ${animado ? s.oculta : ''}`} src={juntar(base, planeta.arte)} alt="" draggable={false} />
        {!semGL && (
          <div ref={palco} className={`${s.palco} ${animado ? '' : s.oculta}`} style={{ width: W, height: W }}>
            <canvas ref={canvas} className={s.esfera} style={{ left: cx - RQ, top: cy - RQ, width: 2 * RQ, height: 2 * RQ }} />
          </div>
        )}
      </div>
    </div>
  )
}

export default PlanetaGirando
