'use client'

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import s from './planeta-girando.module.css'

/* =====================================================================
   PlanetaGirando · Exploradores — giro 3D no eixo vertical
   ---------------------------------------------------------------------
   O planeta inteiro (esfera + casa, polvo, ilha, rochedo…) gira como um
   objeto 3D só, a partir de VÁRIAS artes (até 4): frente, laterais, costas.

   Como funciona (WebGL2):
   1. GEOMETRIA. Uma esfera + um relevo "inflado" a partir da silhueta
      de cada vista, no plano perpendicular a ela (perfil.png, gerado
      por scripts/planetas/preparar-planeta.py). O shader acha, para
      cada pixel, onde o raio encosta nesse objeto (ray marching).
   2. COR. Cada ponto pega a cor das duas vistas vizinhas do ângulo
      atual que o enxergam. No ângulo de cada vista, o planeta é
      exatamente aquela arte; entre duas vistas, a troca é rápida e
      acontece no próprio 3D.
   3. LUZ. A parte horizontal da luz pintada nas artes foi tirada pelo
      script e volta aqui, parada na tela: girando, a luz fica no lugar.
   4. MÃO. Arrastar na horizontal gira o planeta; ao soltar, ele segue
      com embalo e volta ao giro normal no sentido em que foi jogado.
      As setas do teclado fazem o mesmo.
   5. Com “reduzir movimento”, não gira sozinho (a mão continua). Sem
      WebGL2, mostra a arte original parada.

   Next.js: componente cliente ('use client'), sem dependências.
   ===================================================================== */

type Vista = { nome: string; src: string; angulo: number; u: number; v: number; r: number }

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
  /** até 4 vistas: imagem, ângulo (graus; 0 = frente) e enquadramento da esfera
      (centro u, v e raio r, em fração da imagem). A primeira é a frente. */
  vistas: Vista[]
  /** altura (R) e espessura (G) do relevo por ângulo, uma linha por vista */
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
  /** ângulo inicial (graus); 0 = a arte de frente; no ângulo de cada vista, aquela arte */
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
uniform sampler2D tex0, tex1, tex2, tex3;  // vistas (cor × ganho, alfa pré-multiplicado)
uniform sampler2D perfil;  // uma linha por vista. R: altura do relevo, G: meia espessura
uniform vec4 V[4];         // por vista: centro (u, v) e raio, em uv; ângulo (rad)
uniform vec4 peso;         // peso de cada vista no ângulo atual (as duas vizinhas)
uniform float lod[4];
uniform int nVistas;
uniform float ang;         // ângulo do giro
uniform float rhoMax;      // raio do quadro, em raios da esfera
uniform float alturaMax;
uniform float espMax;      // maior meia espessura (rad)
uniform float borda;       // largura do antisserrilhado da esfera, em raios
uniform float luz;
uniform float ganho;
uniform float C[7];
in vec2 v;
out vec4 cor;
const float PI = 3.14159265359;

// relevo: a silhueta de cada vista, inflada no plano perpendicular a ela
float altura(vec3 d) {
  float h = 0.0;
  for (int i = 0; i < 4; i++) {
    if (i >= nVistas) break;
    float al = V[i].w;
    float dz = abs(-d.x * sin(al) + d.z * cos(al));     // distância ao plano da silhueta
    if (dz > sin(espMax)) continue;
    float fi = atan(d.y, d.x * cos(al) + d.z * sin(al));
    vec2 hd = textureLod(perfil, vec2(fi / (2.0 * PI) + 0.5, (float(i) + 0.5) / float(nVistas)), 0.0).rg;
    float t = asin(dz) / max(hd.g * 1.5707963, 0.001);
    if (t < 1.0) h = max(h, hd.r * alturaMax * sqrt(1.0 - t * t));
  }
  return h;
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

vec4 vista(sampler2D t, vec4 Vi, vec3 P, float l) {
  float x = P.x * cos(Vi.w) + P.z * sin(Vi.w);
  return textureLod(t, vec2(Vi.x + x * Vi.z, Vi.y - P.y * Vi.z), l);
}

// soma a contribuição da vista i (macro: samplers não podem ser indexados por variável)
#define SOMA(i, T) { \
  float zi = -n.x * sin(V[i].w) + n.z * cos(V[i].w); \
  float w = smoothstep(-0.1, 0.1, zi) * (peso[i] + 0.003); \
  if (i < nVistas && w > 1e-4) { \
    vec4 c = vista(T, V[i], P, lod[i] + suavizar(agora, zi)); \
    if (corpo && c.a < 0.98) c = mix(vista(T, V[i], P * 0.95, lod[i] + 1.0), c, c.a); \
    acc += c * w; soma += w; \
    if (peso[i] > 0.1) amax = max(amax, c.a); \
    wmax = max(wmax, w); \
  } }

// cor de um ponto do objeto: as vistas que o enxergam, pesadas pela proximidade do ângulo atual
vec4 amostra(vec3 P, bool corpo) {
  vec3 n = normalize(P);
  float agora = -n.x * sin(ang) + n.z * cos(ang);  // de frente para a câmera atual
  vec4 acc = vec4(0.0);
  float soma = 0.0, amax = 0.0, wmax = 0.0;
  SOMA(0, tex0) SOMA(1, tex1) SOMA(2, tex2) SOMA(3, tex3)
  if (soma <= 0.0) return corpo ? vec4(0.0, 0.0, 0.0, 1.0) : vec4(0.0);
  vec4 mist = acc / soma;
  if (corpo) return vec4(mist.rgb / max(mist.a, 1e-3), 1.0);  // a esfera é sólida
  // elementos: na troca de vista, a forma é a união das vistas (sem fantasma semitransparente)
  float troca = 1.0 - wmax / soma;
  float alfa = mix(mist.a, max(mist.a, amax), clamp(troca * 2.0, 0.0, 1.0));
  return vec4(mist.rgb / max(mist.a, 1e-3) * alfa, alfa);
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

  vec4 acc = vec4(0.0);
  if (tB > tA) {
    float dt = (tB - tA) / 72.0;
    float tAnt = tA;
    bool dentro = campo(o + tA * d) < 0.0;
    for (int i = 1; i <= 72; i++) {
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

/** peso de cada vista no ângulo atual: só as duas vizinhas, com troca rápida no meio do caminho */
function pesosVistas(angulos: number[], ang: number) {
  const n = angulos.length
  const p = [0, 0, 0, 0]
  if (n === 1) {
    p[0] = 1
    return p
  }
  const norm = (a: number) => ((a % 360) + 360) % 360
  const atual = norm((ang * 180) / Math.PI)
  const ordem = angulos.map((a, i) => ({ a: norm(a), i })).sort((x, y) => x.a - y.a)
  for (let k = 0; k < ordem.length; k++) {
    const A = ordem[k]
    const B = ordem[(k + 1) % ordem.length]
    const vao = norm(B.a - A.a) || 360
    const dentro = norm(atual - A.a)
    if (dentro <= vao) {
      const t = dentro / vao
      const s = Math.min(1, Math.max(0, (t - 0.38) / 0.24)) // troca rápida, no meio do caminho
      const suave = s * s * (3 - 2 * s)
      p[A.i] = 1 - suave
      p[B.i] = suave
      break
    }
  }
  return p
}

function carregar(src: string) {
  return new Promise<HTMLImageElement>((ok, falha) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => ok(img)
    img.onerror = falha
    img.src = src
  })
}

function criarGL(canvas: HTMLCanvasElement, planeta: PlanetaDados, imgs: HTMLImageElement[], perfilImg: HTMLImageElement) {
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
  const vs = planeta.vistas.slice(0, 4)
  for (let i = 0; i < 4; i++) textura(i, imgs[Math.min(i, imgs.length - 1)], false)
  textura(4, perfilImg, true)

  const U = (n: string) => gl.getUniformLocation(prog, n)
  for (let i = 0; i < 4; i++) gl.uniform1i(U(`tex${i}`), i)
  gl.uniform1i(U('perfil'), 4)
  gl.uniform1i(U('nVistas'), vs.length)
  const V = new Float32Array(16)
  vs.forEach((v, i) => V.set([v.u, v.v, v.r, (v.angulo * Math.PI) / 180], i * 4))
  gl.uniform4fv(U('V'), V)
  gl.uniform1f(U('rhoMax'), planeta.raioQuadro)
  gl.uniform1f(U('alturaMax'), planeta.alturaMax)
  gl.uniform1f(U('ganho'), planeta.ganho ?? 1)
  const coef = planeta.luz ?? [1]
  gl.uniform1fv(U('C'), new Float32Array([0, 1, 2, 3, 4, 5, 6].map((i) => coef[i] ?? (i === 0 ? 1 : 0))))
  // maior meia espessura do relevo (para pular cedo as vistas longe de um ponto)
  const cv = document.createElement('canvas')
  cv.width = perfilImg.width
  cv.height = perfilImg.height
  const cx2 = cv.getContext('2d')!
  cx2.drawImage(perfilImg, 0, 0)
  const px = cx2.getImageData(0, 0, cv.width, cv.height).data
  let esp = 0
  for (let i = 0; i < px.length; i += 4) esp = Math.max(esp, px[i + 1])
  gl.uniform1f(U('espMax'), (esp / 255) * (Math.PI / 2) + 0.01)
  const u = { ang: U('ang'), luz: U('luz'), borda: U('borda'), lod: U('lod'), peso: U('peso') }
  const angulos = vs.map((v) => v.angulo)
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
      gl.uniform1fv(u.lod, new Float32Array([0, 1, 2, 3].map((i) => (vs[i] ? Math.max(0, Math.log2((vs[i].r * imgs[i].width) / pxPorRaio)) : 0))))
      gl.uniform4fv(u.peso, new Float32Array(pesosVistas(angulos, ang)))
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
    let qualidade = 1 // reduz a resolução sozinho se os quadros ficarem lentos
    let lentos = 0
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
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_MAX) * qualidade
      const lado = Math.max(2, Math.round(2 * RQ * escala * dpr))
      if (cv.width !== lado) {
        cv.width = lado
        cv.height = lado
      }
    }

    const passo = (t: number) => {
      // o limite só evita um salto ao voltar de outra aba; até 4 quadros/s a velocidade é exata
      const dt = t0 ? Math.min(0.25, (t - t0) / 1000) : 0
      t0 = t
      // aparelho lento: mais de 30 ms por quadro por um tempo → desenha com menos pixels
      if (dt > 0.03) lentos++
      else lentos = Math.max(0, lentos - 1)
      if (lentos > 20 && qualidade > 0.6) {
        qualidade = Math.max(0.6, qualidade - 0.15)
        lentos = 0
        medir()
      }
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
    Promise.all([...planeta.vistas.slice(0, 4).map((v) => carregar(pasta(v.src))), carregar(pasta(planeta.perfil))])
      .then((imgs) => {
        if (!vivo || !canvas.current) return
        const perfilImg = imgs.pop()!
        try {
          gl = criarGL(canvas.current, planeta, imgs, perfilImg)
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
    while (a.length > 2 && e.timeStamp - a[0].t > 120) a.shift()
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
    // parado antes de soltar (sem movimento recente) = sem arremesso. A folga é grande porque em
    // aparelhos lentos os eventos de movimento chegam espaçados
    const recente = e.timeStamp - fim.t < 150
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
