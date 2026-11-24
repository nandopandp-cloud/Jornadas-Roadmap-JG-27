'use client'

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import {
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
  NeutralToneMapping,
  PMREMGenerator,
  PerspectiveCamera,
  SRGBColorSpace,
  Scene,
  WebGLRenderer,
  type Material,
  type Texture,
} from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import s from './planeta-girando.module.css'

/* =====================================================================
   PlanetaGirando · Exploradores — planeta 3D (.glb) girando no eixo vertical
   ---------------------------------------------------------------------
   O planeta é um modelo 3D de verdade (otimizado no
   Blender pelo Design): centro da esfera na
   origem, raio 1, ~120 mil triângulos, cor 2K em AVIF e malha
   comprimida por Draco (menos de 1 MB; decodificador em <base>draco/). O three.js desenha com luz de estúdio
   (principal no alto à esquerda + ambiente), tom Khronos PBR Neutral (cores fiéis à
   textura) e o objeto só gira: os
   elementos aparecem, passam e somem sem nunca mudar de forma.

   Comportamento (igual ao das versões anteriores):
   • uma volta a cada 40 s, sem outras velocidades;
   • mão: arrastar na horizontal gira; ao soltar segue com embalo e volta
     ao giro normal no sentido em que foi jogado. Setas ← → fazem o mesmo;
   • “reduzir movimento”: não gira sozinho (a mão continua);
   • sem WebGL, ou enquanto carrega: o pôster (render do mesmo ângulo);
   • fora da tela: para de desenhar. Aparelho lento: baixa a resolução.

   Next.js: componente cliente ('use client'); depende só de `three`.
   ===================================================================== */

export type PlanetaDados = {
  id: string
  /** pasta dos arquivos em public/ */
  pasta: string
  /** modelo 3D (.glb) */
  modelo: string
  /** imagem de reserva no ângulo inicial (mesmo enquadramento) */
  poster: string
  /** maior distância do centro até a borda do modelo, em raios da esfera (enquadramento) */
  raioQuadro: number
  /** ângulo inicial (graus) — o mesmo do pôster */
  inicio: number
  /** câmera acima do equador (graus) */
  elevacao: number
  /** abertura da câmera (graus) */
  fov: number
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
  /** ângulo inicial (graus) somado ao do modelo; 0 = o mesmo do pôster */
  inicio?: number
  /** luz de estúdio (false = só a luz ambiente, mais chapada). Padrão: true */
  luz?: boolean
  /** sobe e desce devagar. Padrão: true */
  flutuar?: boolean
  /** cor do halo (r, g, b) ou false. Padrão: '92, 196, 255' */
  halo?: string | false
  /** sombra de contato embaixo. Padrão: true */
  sombra?: boolean
  /** false = só o pôster, sem baixar o 3D (ex.: enquanto os dados do planeta chegam). Padrão: true */
  carregar3d?: boolean
  className?: string
  style?: CSSProperties
}

/** uma volta a cada 40 s: a única velocidade do giro */
export const SEGUNDOS_POR_VOLTA = 40
const VEL_AUTO = (2 * Math.PI) / SEGUNDOS_POR_VOLTA
const VEL_MAX = 7 // rad/s, teto do arremesso
const IMPULSO_TECLA = 1.2 // rad/s por toque na seta
const DPR_MAX = 2

/** decodificador Draco (malha comprimida): baixado do mesmo endereço dos planetas, uma vez só, e só se o modelo usar Draco */
const dracos = new Map<string, DRACOLoader>()
function decodificadorDraco(base: string) {
  let d = dracos.get(base)
  if (!d) {
    d = new DRACOLoader().setDecoderPath(juntar(base, 'draco/'))
    dracos.set(base, d)
  }
  return d
}

const juntar = (base: string, ...partes: string[]) => (base.endsWith('/') ? base : base + '/') + partes.join('/')
const rad = (g: number) => (g * Math.PI) / 180

function reduzMovimento() {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

function temWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

/** distância da câmera para o modelo inteiro caber no quadro (com 4% de folga) */
function distancia(p: PlanetaDados) {
  return (p.raioQuadro / Math.sin(rad(p.fov / 2))) * 1.04
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
  carregar3d = true,
  className,
  style,
}: PlanetaGirandoProps) {
  const caixa = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [pronto, setPronto] = useState(false)
  const [semGL, setSemGL] = useState(false)
  const [reduz] = useState(reduzMovimento)

  // estado do giro, lido pelo laço a cada quadro (sem re-render)
  const giro = useRef({
    ang: rad(planeta.inicio + inicio),
    vel: 0,
    dir: sentido === 'direita' ? 1 : -1,
    tau: 0.6,
    luz: luz ? 1 : 0,
    arrastando: false,
    escalaR: 1, // raio da esfera em px de tela
  })
  const props = useRef({ pausado, luz, onSentidoChange })
  props.current = { pausado, luz, onSentidoChange }

  useEffect(() => {
    giro.current.dir = sentido === 'direita' ? 1 : -1
    giro.current.tau = 0.6
  }, [sentido])

  // raio aparente da esfera, em fração da largura (halo, sombra, anel de foco)
  const fracR = 0.5 / (distancia(planeta) * Math.tan(rad(planeta.fov / 2)))

  useEffect(() => {
    const el = caixa.current
    const cv = canvas.current
    if (!el || !cv || !carregar3d) return
    if (!temWebGL()) {
      setSemGL(true)
      return
    }
    let vivo = true
    let quadro = 0
    let visivel = true
    let t0 = 0
    let qualidade = 1
    let lentos = 0
    const g = giro.current
    g.ang = rad(planeta.inicio + inicio) // o 3D entra no mesmo ângulo do pôster deste planeta
    ;(el as HTMLDivElement & { __giro?: typeof g }).__giro = g // estado visível para testes automatizados

    let renderer: WebGLRenderer
    try {
      renderer = new WebGLRenderer({ canvas: cv, alpha: true, antialias: true, powerPreference: 'high-performance' })
    } catch {
      setSemGL(true)
      return
    }
    renderer.outputColorSpace = SRGBColorSpace
    // Khronos PBR Neutral: mostra a cor da textura como ela é (cores vibrantes da massinha).
    // O AgX, usado antes, deixava a saturação em 62–72% da arte.
    renderer.toneMapping = NeutralToneMapping
    renderer.toneMappingExposure = 1.05
    renderer.setClearColor(0x000000, 0)

    const cena = new Scene()
    const pmrem = new PMREMGenerator(renderer)
    const ambiente = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    cena.environment = ambiente
    cena.environmentIntensity = 0.55
    // luz de estúdio: principal grande no alto à esquerda, preenchimento à direita, céu/chão suaves
    const principal = new DirectionalLight(0xfff4e8, 2.6)
    principal.position.set(-1.0, 1.3, 1.1)
    const preench = new DirectionalLight(0xe8f0ff, 0.7)
    preench.position.set(1.2, 0.1, 0.7)
    const ceu = new HemisphereLight(0xdfe9ff, 0x2c2440, 0.35)
    cena.add(principal, preench, ceu)

    const d = distancia(planeta)
    const e = rad(planeta.elevacao)
    const cam = new PerspectiveCamera(planeta.fov, 1, d * 0.3, d * 3)
    cam.position.set(0, d * Math.sin(e), d * Math.cos(e))
    cam.lookAt(0, 0, 0)

    const pivo = new Group()
    cena.add(pivo)

    const medir = () => {
      const B = el.clientWidth
      if (!B) return
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_MAX) * qualidade
      renderer.setPixelRatio(dpr)
      renderer.setSize(B, B, false)
      g.escalaR = B * fracR
    }

    const passo = (t: number) => {
      // limite só evita salto ao voltar de outra aba; até 4 quadros/s a velocidade é exata
      const dt = t0 ? Math.min(0.25, (t - t0) / 1000) : 0
      t0 = t
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
      principal.intensity = 2.6 * g.luz
      preench.intensity = 0.7 * g.luz
      cena.environmentIntensity = 0.55 + 0.6 * (1 - g.luz)
      pivo.rotation.y = g.ang
      renderer.render(cena, cam)
    }

    const laco = (t: number) => {
      if (!vivo) return
      if (visivel) passo(t)
      else t0 = 0
      quadro = requestAnimationFrame(laco)
    }

    const ro = new ResizeObserver(medir)
    ro.observe(el)
    const io = new IntersectionObserver(([en]) => (visivel = en.isIntersecting))
    io.observe(el)

    const loader = new GLTFLoader()
    loader.setMeshoptDecoder(MeshoptDecoder)
    loader.setDRACOLoader(decodificadorDraco(base))
    loader.load(
      juntar(base, planeta.pasta, planeta.modelo),
      (gltf) => {
        if (!vivo) return
        pivo.add(gltf.scene)
        medir()
        passo(performance.now())
        setPronto(true)
        quadro = requestAnimationFrame(laco)
      },
      undefined,
      () => vivo && setSemGL(true),
    )

    return () => {
      vivo = false
      cancelAnimationFrame(quadro)
      ro.disconnect()
      io.disconnect()
      pivo.traverse((o) => {
        if (o instanceof Mesh) {
          o.geometry.dispose()
          const mats = (Array.isArray(o.material) ? o.material : [o.material]) as Material[]
          for (const m of mats) {
            for (const v of Object.values(m)) if (v && (v as Texture).isTexture) (v as Texture).dispose()
            m.dispose()
          }
        }
      })
      ambiente.dispose()
      pmrem.dispose()
      renderer.dispose()
    }
    // o laço lê o resto por ref; só reinicia se trocar o planeta
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planeta, base, carregar3d])

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
    g.ang += dx / Math.max(g.escalaR, 1) // a superfície no centro acompanha o dedo
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
    // parado antes de soltar = sem arremesso (folga grande: em aparelho lento os eventos chegam espaçados)
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
    '--pl-r': fracR * 100,
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
        {/* pôster: primeiro quadro, enquanto carrega, e quando não há WebGL */}
        <img className={`${s.arte} ${animado ? s.oculta : ''}`} src={juntar(base, planeta.pasta, planeta.poster)} alt="" draggable={false} />
        {!semGL && (
          <div className={`${s.palco} ${animado ? '' : s.oculta}`}>
            <canvas ref={canvas} className={s.esfera} />
          </div>
        )}
      </div>
    </div>
  )
}

export default PlanetaGirando
