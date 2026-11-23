import { ArrowLeft, ArrowRight, Check, CircleDot, Code, Copy, Gauge, Info, Moon, MoveHorizontal, MoveVertical, Orbit, Pause, Play, Ruler, Sun, type LucideIcon } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import type { PrototypeProps } from '../../platform/journeys'
import { PlanetaGirando, type PlanetaDados } from './PlanetaGirando'
import planeta01 from './planeta-01.json'
import './vitrine.css'

/* =====================================================================
   Planetas · Exploradores — vitrine do giro 360°
   Abas: giro (palco), tamanhos (3 usos lado a lado), nextjs (handoff)
   ===================================================================== */

/** planetas que já entraram na plataforma (gerados por scripts/planetas/preparar-planeta.py) */
const PLANETAS: { nome: string; dados: PlanetaDados }[] = [{ nome: 'Planeta 01', dados: planeta01 }]
const BASE = './'

const DURACAO_BASE = 24 // s por volta no ritmo 1; as outras velocidades mudam o ritmo (suave)
const VELOCIDADES = [
  { id: 'calmo', label: 'Calmo', s: 40 },
  { id: 'padrao', label: 'Padrão', s: 24 },
  { id: 'rapido', label: 'Rápido', s: 12 },
] as const
type Velocidade = (typeof VELOCIDADES)[number]['id']
type Aba = 'giro' | 'tamanhos' | 'nextjs'
const ACELERA_HOVER = 2.6

const TAMANHOS = [
  { px: 96, label: 'Ícone', uso: 'listas e conquistas', inicio: 0 },
  { px: 160, label: 'Card', uso: 'escolha do planeta', inicio: 130 },
  { px: 260, label: 'Destaque', uso: 'abertura da trilha', inicio: 250 },
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
  const [velocidade, setVelocidade] = useState<Velocidade>('padrao')
  const [horario, setHorario] = useState(true)
  const [pausado, setPausado] = useState(false)
  const [luz, setLuz] = useState(true)
  const [flutuar, setFlutuar] = useState(true)
  const [sombra, setSombra] = useState(true)
  const [hover, setHover] = useState(false)
  const reduz = useReduzMovimento()

  const seg = VELOCIDADES.find((v) => v.id === velocidade)!.s
  const ritmo = pausado ? 0 : (DURACAO_BASE / seg) * (hover ? ACELERA_HOVER : 1)

  const planeta = PLANETAS[0]
  const comuns = {
    planeta: planeta.dados,
    base: BASE,
    duracao: DURACAO_BASE,
    ritmo,
    sentido: horario ? ('direita' as const) : ('esquerda' as const),
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
                <div className="pv-tamanho__caixa" style={{ height: Math.max(t.px, 96) + 40 }}>
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
          <div
            className="pv-centro"
            onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(true)}
            onPointerLeave={() => setHover(false)}
          >
            <PlanetaGirando {...comuns} tamanho="var(--pv-tam)" alt={planeta.nome} />
          </div>
        )}

        <div className="pv-palco__base">
          <span className="pv-legenda">
            {pausado ? <Pause size={14} aria-hidden /> : horario ? <ArrowRight size={14} aria-hidden /> : <ArrowLeft size={14} aria-hidden />}
            {planeta.nome} · {pausado ? 'pausado' : `1 volta a cada ${hover ? Math.round(seg / ACELERA_HOVER) : seg} s`}
          </span>
          {aba !== 'tamanhos' && !reduz && <span className="pv-dica">Passe o mouse no planeta para acelerar</span>}
        </div>
      </section>

      <aside className="pv-painel">
        <header className="pv-cabeca">
          <span className="pv-sobre">Planetas · Exploradores</span>
          <h1>Giro 360°</h1>
          <p>
            O planeta gira como um globo, no eixo vertical: a superfície corre na horizontal, a casa, o polvo e a ilha dão a volta e passam por trás,
            e a luz fica parada. A massinha continua a mesma.
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
            <Info size={16} aria-hidden /> Seu sistema está com “reduzir movimento” ligado, então o planeta fica parado (o componente respeita essa
            escolha).
          </p>
        )}

        {aba === 'nextjs' ? (
          <Handoff />
        ) : (
          <div className="pv-controles">
            <Campo titulo="Velocidade" icone={Gauge}>
              <Segmentos
                valor={velocidade}
                opcoes={VELOCIDADES.map((v) => ({ id: v.id, label: v.label, sub: `${v.s} s` }))}
                onChange={(v) => {
                  setVelocidade(v as Velocidade)
                  setPausado(false)
                }}
              />
            </Campo>

            <Campo titulo="Sentido do giro" icone={MoveHorizontal}>
              <Segmentos
                valor={horario ? 'h' : 'a'}
                opcoes={[
                  { id: 'h', label: 'Para a direita', icone: ArrowRight },
                  { id: 'a', label: 'Para a esquerda', icone: ArrowLeft },
                ]}
                onChange={(v) => setHorario(v === 'h')}
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
              <Chave icone={Sun} label="Luz fixa" desc="Brilho e sombra parados enquanto o planeta gira" on={luz} set={setLuz} />
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
  ['planeta', '—', 'dados do planeta (JSON gerado pelo script)'],
  ['base', "'/'", 'prefixo dos arquivos em public/'],
  ['tamanho', '240', 'px ou medida CSS'],
  ['duracao', '24', 'segundos por volta'],
  ['sentido', "'direita'", "ou 'esquerda' (para onde a frente corre)"],
  ['ritmo', '1', 'multiplica a velocidade; 0 pausa (sempre suave)'],
  ['inicio', '0', 'ângulo inicial, para vários planetas na tela'],
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
          <code>planeta-girando.module.css</code> e <code>planeta-01.json</code>. A textura e as peças vão para <code>public/planetas/planeta-01/</code>.
        </li>
        <li>
          <strong>Use onde o planeta aparece.</strong> O componente já começa com <code>'use client'</code> e não tem dependências.
        </li>
        <li>
          <strong>Planeta novo?</strong> Rode <code>scripts/planetas/preparar-planeta.py</code> com o centro, o raio e as peças que saem da
          esfera. Ele gera a textura 360°, os recortes e o JSON.
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
        <Info size={16} aria-hidden /> Esfera em WebGL2 (1 desenho por quadro) e peças com transform. Para quando sai da tela e mostra a arte
        original parada para quem liga “reduzir movimento” ou não tem WebGL2.
      </p>
    </div>
  )
}
