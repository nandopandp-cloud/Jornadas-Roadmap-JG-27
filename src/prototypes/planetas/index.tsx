import { ArrowLeft, ArrowRight, Check, CircleDot, Code, Copy, Hand, Info, Moon, MoveHorizontal, MoveVertical, Orbit, Pause, Play, Ruler, Sun, type LucideIcon } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import type { PrototypeProps } from '../../platform/journeys'
import { PlanetaGirando, SEGUNDOS_POR_VOLTA, type PlanetaDados, type Sentido } from './PlanetaGirando'
import planeta01 from './planeta-01.json'
import './vitrine.css'

/* =====================================================================
   Planetas · Exploradores — vitrine do giro 360°
   Abas: giro (palco), tamanhos (3 usos lado a lado), nextjs (handoff)
   ===================================================================== */

/** planetas que já entraram na plataforma (modelo 3D otimizado por scripts/planetas/otimizar_glb.py) */
const PLANETAS: { nome: string; dados: PlanetaDados }[] = [{ nome: 'Planeta 01', dados: planeta01 }]
const BASE = './'

type Aba = 'giro' | 'tamanhos' | 'nextjs'

const TAMANHOS = [
  // cada um começa de um lado: polvo e ilha, casa e floresta, e a frente
  { px: 130, label: 'Ícone', uso: 'listas e conquistas', inicio: 200 },
  { px: 210, label: 'Card', uso: 'escolha do planeta', inicio: 110 },
  { px: 330, label: 'Destaque', uso: 'abertura da trilha', inicio: 0 },
]

function useReduzMovimento() {
  const [reduz, setReduz] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduz(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduz
}

export default function Planetas({ startScreen }: PrototypeProps) {
  const inicial = startScreen === 'tamanhos' || startScreen === 'nextjs' ? startScreen : 'giro'
  const [aba, setAba] = useState<Aba>(inicial)
  const [fundo, setFundo] = useState<'espaco' | 'claro'>(startScreen === 'claro' ? 'claro' : 'espaco')
  const [sentido, setSentido] = useState<Sentido>('direita')
  const [pausado, setPausado] = useState(false)
  const [luz, setLuz] = useState(true)
  const [flutuar, setFlutuar] = useState(true)
  const [sombra, setSombra] = useState(true)
  const reduz = useReduzMovimento()

  const planeta = PLANETAS[0]
  const comuns = {
    planeta: planeta.dados,
    base: BASE,
    sentido,
    pausado,
    luz,
    flutuar,
    sombra,
    halo: sombra ? (fundo === 'espaco' ? '92, 196, 255' : '0, 161, 154') : (false as const),
  }

  return (
    <div className={`pv pv--${fundo}`}>
      <section className="pv-palco" aria-label="Palco do planeta">
        <span className="pv-estrelas" aria-hidden />
        <span className="pv-estrelas pv-estrelas--2" aria-hidden />

        <div className="pv-palco__topo">
          <span className="pv-chip">
            <Orbit size={16} aria-hidden /> Exploradores · Planetas
          </span>
        </div>

        {aba === 'tamanhos' ? (
          <div className="pv-tamanhos">
            {TAMANHOS.map((t) => (
              <figure key={t.px} className="pv-tamanho">
                <div className="pv-tamanho__caixa" style={{ height: t.px }}>
                  <PlanetaGirando {...comuns} tamanho={t.px} inicio={t.inicio} alt={`${planeta.nome} em tamanho ${t.label}`} />
                </div>
                <figcaption>
                  <strong>
                    {t.label} · {t.px}px
                  </strong>
                  <span>{t.uso}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="pv-centro">
            <PlanetaGirando {...comuns} onSentidoChange={setSentido} tamanho="var(--pv-tam)" alt={planeta.nome} />
          </div>
        )}

        <div className="pv-palco__base">
          <span className="pv-legenda">
            {pausado || reduz ? <Pause size={14} aria-hidden /> : sentido === 'direita' ? <ArrowRight size={14} aria-hidden /> : <ArrowLeft size={14} aria-hidden />}
            {planeta.nome} · {pausado || reduz ? 'giro automático parado' : `1 volta a cada ${SEGUNDOS_POR_VOLTA} s`}
          </span>
          <span className="pv-dica">
            <Hand size={15} aria-hidden /> {aba === 'tamanhos' ? 'Arraste qualquer planeta para girar' : 'Arraste o planeta para girar'}
          </span>
        </div>
      </section>

      <aside className="pv-painel">
        <header className="pv-cabeca">
          <span className="pv-sobre">Planetas · Exploradores</span>
          <h1>Giro 360°</h1>
          <p>
            O planeta é um modelo 3D de verdade e gira no eixo vertical, com uma volta a cada {SEGUNDOS_POR_VOLTA} s. A casa, a floresta, a
            cachoeira, o barco, o polvo e a praia dão a volta juntos, com volume real de todos os lados. Dá para girar com a mão.
          </p>
        </header>

        <div className="pv-abas" role="tablist" aria-label="Seções">
          {(
            [
              ['giro', 'Giro', Orbit],
              ['tamanhos', 'Tamanhos', Ruler],
              ['nextjs', 'Next.js', Code],
            ] as [Aba, string, LucideIcon][]
          ).map(([id, label, Icone]) => (
            <button key={id} role="tab" aria-selected={aba === id} className={aba === id ? 'is-on' : ''} onClick={() => setAba(id)}>
              <Icone size={16} aria-hidden /> {label}
            </button>
          ))}
        </div>

        {reduz && (
          <p className="pv-aviso">
            <Info size={16} aria-hidden /> Seu sistema está com “reduzir movimento” ligado: o planeta não gira sozinho, mas dá para girar arrastando ou
            com as setas.
          </p>
        )}

        {aba === 'nextjs' ? (
          <Handoff />
        ) : (
          <div className="pv-controles">
            <p className="pv-mao">
              <span className="pv-mao__icone">
                <Hand size={18} aria-hidden />
              </span>
              <span>
                <strong>Gire com a mão</strong>
                <small>
                  Arraste para a esquerda ou para a direita. Ao soltar, o planeta segue com o embalo e volta ao giro normal no sentido em que foi
                  jogado. No teclado: Tab até o planeta e setas.
                </small>
              </span>
            </p>

            <Campo titulo="Sentido do giro" icone={MoveHorizontal}>
              <Segmentos
                valor={sentido}
                opcoes={[
                  { id: 'direita', label: 'Para a direita', icone: ArrowRight },
                  { id: 'esquerda', label: 'Para a esquerda', icone: ArrowLeft },
                ]}
                onChange={(v) => setSentido(v as Sentido)}
              />
            </Campo>

            <Campo titulo="Fundo" icone={Moon}>
              <Segmentos
                valor={fundo}
                opcoes={[
                  { id: 'espaco', label: 'Espaço', icone: Moon },
                  { id: 'claro', label: 'Claro', icone: Sun },
                ]}
                onChange={(v) => setFundo(v as 'espaco' | 'claro')}
              />
            </Campo>

            <div className="pv-chaves">
              <Chave icone={Sun} label="Luz de estúdio" desc="Luz principal no alto à esquerda e preenchimento" on={luz} set={setLuz} />
              <Chave icone={MoveVertical} label="Flutuar" desc="Sobe e desce devagar, a cada 7 s" on={flutuar} set={setFlutuar} />
              <Chave icone={CircleDot} label="Halo e sombra" desc="Brilho atrás e sombra de contato" on={sombra} set={setSombra} />
            </div>

            <button className="pv-btn" onClick={() => setPausado((p) => !p)}>
              {pausado ? <Play size={18} aria-hidden /> : <Pause size={18} aria-hidden />}
              {pausado ? 'Continuar o giro' : 'Pausar o giro'}
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}

/* ---------------------------------------------------------------------
   peças do painel
   --------------------------------------------------------------------- */
function Campo({ titulo, icone: Icone, children }: { titulo: string; icone: LucideIcon; children: ReactNode }) {
  return (
    <div className="pv-campo">
      <span className="pv-campo__titulo">
        <Icone size={16} aria-hidden /> {titulo}
      </span>
      {children}
    </div>
  )
}

function Segmentos({
  valor,
  opcoes,
  onChange,
}: {
  valor: string
  opcoes: { id: string; label: string; sub?: string; icone?: LucideIcon }[]
  onChange: (id: string) => void
}) {
  return (
    <div className="pv-seg" role="radiogroup">
      {opcoes.map(({ id, label, sub, icone: Icone }) => (
        <button key={id} role="radio" aria-checked={valor === id} className={valor === id ? 'is-on' : ''} onClick={() => onChange(id)}>
          {Icone && <Icone size={16} aria-hidden />}
          <span>{label}</span>
          {sub && <small>{sub}</small>}
        </button>
      ))}
    </div>
  )
}

function Chave({ icone: Icone, label, desc, on, set }: { icone: LucideIcon; label: string; desc: string; on: boolean; set: (v: boolean) => void }) {
  return (
    <button className="pv-chave" role="switch" aria-checked={on} onClick={() => set(!on)}>
      <span className="pv-chave__icone">
        <Icone size={18} aria-hidden />
      </span>
      <span className="pv-chave__texto">
        <strong>{label}</strong>
        <small>{desc}</small>
      </span>
      <span className={`pv-switch ${on ? 'is-on' : ''}`} aria-hidden>
        <span />
      </span>
    </button>
  )
}

const CODIGO = `import { PlanetaGirando }
  from '@/components/planetas/PlanetaGirando'
import planeta01
  from '@/components/planetas/planeta-01.json'

export function PlanetaDaTrilha() {
  return (
    <PlanetaGirando
      planeta={planeta01}
      tamanho={240}
      alt="Planeta da trilha"
    />
  )
}`

const PROPS: [string, string, string][] = [
  ['planeta', '—', 'dados do planeta (JSON gerado pelo script: modelo, pôster, enquadramento)'],
  ['base', "'/'", 'prefixo dos arquivos em public/'],
  ['tamanho', '240', 'px ou medida CSS'],
  ['sentido', "'direita'", "ou 'esquerda' (para onde a frente corre)"],
  ['onSentidoChange', '—', 'avisa quando a pessoa joga o planeta para o outro lado'],
  ['pausado', 'false', 'para o giro automático (a mão continua)'],
  ['arrastavel', 'true', 'girar com a mão e com as setas'],
  ['inicio', '0', 'graus somados ao ângulo inicial do modelo (0 = igual ao pôster)'],
  ['luz · flutuar · sombra', 'true', 'liga e desliga cada camada'],
  ['halo', "'92, 196, 255'", 'cor do brilho (r, g, b) ou false'],
]

function Handoff() {
  const [copiado, setCopiado] = useState(false)
  const copiar = () => {
    navigator.clipboard?.writeText(CODIGO).then(() => {
      setCopiado(true)
      setTimeout(() => setCopiado(false), 1800)
    })
  }
  return (
    <div className="pv-handoff">
      <ol className="pv-passos">
        <li>
          <strong>Copie 3 arquivos</strong> para <code>components/planetas/</code>: <code>PlanetaGirando.tsx</code>,{' '}
          <code>planeta-girando.module.css</code> e <code>planeta-01.json</code>. O modelo e o pôster (<code>planeta.glb</code>, 2,4 MB, e{' '}
          <code>poster.webp</code>) vão para <code>public/planetas/planeta-01/</code>.
        </li>
        <li>
          <strong>Instale o three.js</strong> (<code>npm i three</code>; testado com a 0.170) e use onde o planeta aparece. O componente já começa com{' '}
          <code>'use client'</code>.
        </li>
        <li>
          <strong>Planeta novo?</strong> Gere o modelo 3D (ex.: Tripo, .glb) e rode <code>scripts/planetas/otimizar_glb.py</code> no Blender.
          Ele centraliza a esfera, reduz para a web e gera o pôster e o JSON. Metodologia no README da branch.
        </li>
      </ol>

      <div className="pv-codigo">
        <div className="pv-codigo__barra">
          <span>PlanetaDaTrilha.tsx</span>
          <button onClick={copiar} aria-live="polite">
            {copiado ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
            {copiado ? 'Copiado' : 'Copiar'}
          </button>
        </div>
        <pre>
          <code>{CODIGO}</code>
        </pre>
      </div>

      <table className="pv-props">
        <thead>
          <tr>
            <th>Prop</th>
            <th>Padrão</th>
            <th>O que faz</th>
          </tr>
        </thead>
        <tbody>
          {PROPS.map(([p, d, o]) => (
            <tr key={p}>
              <td>
                <code>{p}</code>
              </td>
              <td>
                <code>{d}</code>
              </td>
              <td>{o}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="pv-nota">
        <Info size={16} aria-hidden /> Uma volta a cada {SEGUNDOS_POR_VOLTA} s, sem outras velocidades. Modelo de 160 mil triângulos com
        texturas 2K (2,4 MB), pausa sozinho fora da tela. Com “reduzir movimento” não gira sozinho; sem WebGL mostra o pôster.
      </p>
    </div>
  )
}
