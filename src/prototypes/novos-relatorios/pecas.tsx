// Peças dos Novos Relatórios: espelham os blocos do kit 'nrel' do Figma (kpis, linhaB, tabCard, segmento…).
/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  ChartColumn,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Download,
  FileText,
  Filter,
  Flag,
  GraduationCap,
  House,
  Info,
  ListChecks,
  Lock,
  MapPin,
  Medal,
  MoreHorizontal,
  Pencil,
  School,
  Search,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { MESES, QB, RUB5, TOM_RUB, faixa, type Bloco, type Cel, type Kpi, type Tabela, type Tom } from './data'

export const ICONES: Record<string, LucideIcon> = {
  house: House,
  school: School,
  users: Users,
  award: Award,
  'graduation-cap': GraduationCap,
  'book-open': BookOpen,
  'list-checks': ListChecks,
  'file-text': FileText,
  zap: Zap,
  flag: Flag,
  target: Target,
  trophy: Trophy,
  pencil: Pencil,
  medal: Medal,
  star: Star,
  'map-pin': MapPin,
  calendar: Calendar,
  sparkles: Sparkles,
  'chart-column': ChartColumn,
  'trending-up': TrendingUp,
}
export const Ic = ({ n, size = 16 }: { n: string; size?: number }) => {
  const I = ICONES[n] ?? Info
  return <I size={size} />
}

/* ------------------------------------------------------------------ básicos */
export const COR: Record<string, string> = {
  p1: 'var(--nr-roxo)',
  g1: 'var(--nr-g1)',
  g2: 'var(--nr-g2)',
  g4: 'var(--nr-g4)',
  muted: 'var(--nr-mudo)',
  suc: 'var(--nr-suc)',
  at: 'var(--nr-at)',
  cr: 'var(--nr-cr)',
  av: 'var(--nr-av)',
  inf: 'var(--nr-inf)',
  n300: 'var(--nr-n300)',
  n400: 'var(--nr-n400)',
  neutro: 'var(--nr-n400)',
  linha: 'var(--nr-linha)',
}
export const Badge = ({ t, tom = 'neutro', icon: I }: { t: ReactNode; tom?: Tom | string; icon?: LucideIcon }) => (
  <span className={`nr-badge is-${tom}`}>
    {I && <I size={13} />}
    {t}
  </span>
)
export const Dica = ({ t }: { t: string }) => (
  <span className="nr-dica" tabIndex={0} aria-label={t}>
    <Info size={15} />
    <span className="nr-dica__balao" role="tooltip">
      {t}
    </span>
  </span>
)
const tomFaixa = (p: number): Tom => TOM_RUB[faixa(p)]

/* ------------------------------------------------------------------ KPIs */
export function Kpis({ itens, dicas }: { itens: Kpi[]; dicas?: Record<string, string> }) {
  return (
    <div className="nr-kpis" style={{ gridTemplateColumns: `repeat(${itens.length}, minmax(0, 1fr))` }}>
      {itens.map(([tit, val, meta, pct, sub]) => (
        <div key={tit} className="nr-kpi">
          <div className="nr-kpi__topo">
            <span>{tit}</span>
            <Dica t={dicas?.[tit] ?? `${tit}: veja a definição completa no Glossário.`} />
          </div>
          <p className="nr-kpi__valor">
            <strong>{val}</strong>
            {meta && <small> / {meta}</small>}
          </p>
          {pct !== null && (
            <p className="nr-kpi__meta">
              <b className={pct >= 100 ? 'is-suc' : 'is-cr'}>{pct}%</b> da meta
            </p>
          )}
          {sub.map((s) => (
            <small key={s}>{s}</small>
          ))}
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ cartão de bloco */
export function Cartao({ titulo, desc, onMenu, children, w, className = '' }: { titulo?: string; desc?: string; onMenu?: (t: string) => void; children: ReactNode; w?: number; className?: string }) {
  return (
    <section className={`nr-cartao ${className}`} style={w ? { flex: `0 1 ${w}px` } : undefined}>
      {titulo && (
        <div className="nr-cartao__topo">
          <div>
            <h3>
              {titulo} <Dica t={desc ?? `${titulo}: indicadores do glossário, no recorte e período selecionados.`} />
            </h3>
            {desc && <p>{desc}</p>}
          </div>
          {onMenu && (
            <button className="nr-icone-btn" onClick={() => onMenu(titulo)} aria-label={`Mais ações de ${titulo}`}>
              <MoreHorizontal size={18} />
            </button>
          )}
        </div>
      )}
      {children}
    </section>
  )
}

export const Legenda = ({ itens }: { itens: any[] }) => (
  <div className="nr-legenda">
    {itens.map(([c, t, tracejada]) => (
      <span key={t}>
        <i className={tracejada ? 'is-tracejada' : ''} style={{ background: tracejada ? undefined : COR[c], borderColor: COR[c] }} />
        {t}
      </span>
    ))}
  </div>
)

/* ------------------------------------------------------------------ gráficos */
const fmtEixo = (v: number, pct?: boolean, mil?: boolean) => (pct ? `${v}%` : mil && v >= 1000 ? `${Math.round(v / 1000)} mil` : String(Math.round(v * 10) / 10).replace('.', ','))

function Linhas({ b }: { b: Bloco }) {
  const W = 640
  const H = b.h ?? 240
  const pl = 44
  const pb = 28
  const pt = 10
  const pr = 12
  const rot: string[] = b.rotX ?? MESES
  const n = rot.length
  const x = (i: number) => pl + ((W - pl - pr) * i) / (n - 1)
  const y = (v: number) => pt + (H - pt - pb) * (1 - v / b.max)
  const grade = [0, 0.25, 0.5, 0.75, 1].map((f) => f * b.max)
  return (
    <>
      <svg className="nr-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={b.titulo}>
        {grade.map((g) => (
          <g key={g}>
            <line x1={pl} x2={W - pr} y1={y(g)} y2={y(g)} className="nr-svg__grade" />
            <text x={pl - 8} y={y(g) + 4} textAnchor="end" className="nr-svg__eixo">
              {fmtEixo(g, b.pct, b.mil)}
            </text>
          </g>
        ))}
        {rot.map((r, i) => (
          <text key={r + i} x={x(i)} y={H - 8} textAnchor="middle" className="nr-svg__eixo">
            {r}
          </text>
        ))}
        {b.series.map(([nome, d, c, tracejada]: [string, number[], string, boolean]) => (
          <g key={nome}>
            <motion.polyline
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              points={d.map((v, i) => `${x(i)},${y(v)}`).join(' ')}
              fill="none"
              stroke={COR[c]}
              strokeWidth={tracejada ? 1.5 : 2.5}
              strokeDasharray={tracejada ? '6 5' : undefined}
              strokeLinejoin="round"
            />
            {!tracejada &&
              d.map((v, i) => (
                <circle key={i} cx={x(i)} cy={y(v)} r={3.5} fill={COR[c]}>
                  <title>{`${rot[i]}: ${fmtEixo(v, b.pct)}`}</title>
                </circle>
              ))}
          </g>
        ))}
      </svg>
      {b.leg && <Legenda itens={b.leg} />}
    </>
  )
}

function BarrasV({ b }: { b: Bloco }) {
  const W = 640
  const H = 240
  const pl = 44
  const pb = 30
  const pt = 18
  const n = b.itens.length
  const larg = (W - pl - 12) / n
  const y = (v: number) => pt + (H - pt - pb) * (1 - v / b.max)
  const grade = [0, 0.25, 0.5, 0.75, 1].map((f) => f * b.max)
  return (
    <>
      <svg className="nr-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={b.titulo}>
        {grade.map((g) => (
          <g key={g}>
            <line x1={pl} x2={W - 12} y1={y(g)} y2={y(g)} className="nr-svg__grade" />
            <text x={pl - 8} y={y(g) + 4} textAnchor="end" className="nr-svg__eixo">
              {fmtEixo(g, b.pct, b.max >= 10000)}
            </text>
          </g>
        ))}
        {b.itens.map(([r, v]: [string, number], i: number) => {
          const bw = Math.min(56, larg * 0.6)
          const cx = pl + larg * i + larg / 2
          return (
            <g key={r}>
              <motion.rect initial={{ height: 0, y: y(0) }} animate={{ height: y(0) - y(v), y: y(v) }} transition={{ duration: 0.5, delay: i * 0.03 }} x={cx - bw / 2} width={bw} rx={3} fill="var(--nr-roxo)">
                <title>{`${r}: ${b.pct ? v + '%' : v}`}</title>
              </motion.rect>
              <text x={cx} y={y(v) - 6} textAnchor="middle" className="nr-svg__valor">
                {b.pct ? `${v}%` : v >= 1000 ? v.toLocaleString('pt-BR') : v}
              </text>
              <text x={cx} y={H - 10} textAnchor="middle" className="nr-svg__eixo">
                {r.length > 16 ? r.slice(0, 15) + '…' : r}
              </text>
            </g>
          )
        })}
        {b.meta && (
          <g>
            <line x1={pl} x2={W - 12} y1={y(b.meta)} y2={y(b.meta)} stroke="var(--nr-mudo)" strokeDasharray="6 5" />
          </g>
        )}
      </svg>
      {b.leg && <Legenda itens={b.leg} />}
    </>
  )
}

function BarrasH({ b }: { b: Bloco }) {
  return (
    <div className="nr-barrash" style={{ ['--rot' as string]: `${b.wRot ?? 140}px` }}>
      {b.itens.map(([r, v]: [string, number], i: number) => (
        <div key={r} className="nr-barrash__linha">
          <span title={r}>{r}</span>
          <span className="nr-barrash__trilho">
            <motion.i initial={{ width: 0 }} animate={{ width: `${(v * 100) / b.max}%` }} transition={{ duration: 0.5, delay: i * 0.03 }} />
          </span>
          <b>{b.pct ? `${v}%` : v.toLocaleString('pt-BR')}</b>
        </div>
      ))}
      {b.link && (
        <button className="nr-link">
          {b.link} <ArrowRight size={14} />
        </button>
      )}
    </div>
  )
}

function Quadrantes({ b }: { b: Bloco }) {
  const W = 640
  const H = 300
  const pl = 44
  const pb = 40
  const pt = 10
  const pr = 12
  const x = (v: number) => pl + ((W - pl - pr) * v) / 100
  const y = (v: number) => pt + (H - pt - pb) * (1 - v / 100)
  const cor = (p: any) => (p.x >= b.mx ? (p.y >= b.my ? 'suc' : 'at') : p.y >= b.my ? 'av' : 'cr')
  return (
    <>
      <svg className="nr-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={b.titulo}>
        {[0, 20, 40, 60, 80, 100].map((g) => (
          <g key={g}>
            <line x1={pl} x2={W - pr} y1={y(g)} y2={y(g)} className="nr-svg__grade" />
            <text x={pl - 8} y={y(g) + 4} textAnchor="end" className="nr-svg__eixo">
              {g}%
            </text>
            <text x={x(g)} y={H - 22} textAnchor="middle" className="nr-svg__eixo">
              {g}
            </text>
          </g>
        ))}
        <text x={(W + pl) / 2} y={H - 4} textAnchor="middle" className="nr-svg__eixo">
          {b.rotX}
        </text>
        <line x1={x(b.mx)} x2={x(b.mx)} y1={pt} y2={H - pb} stroke="var(--nr-av)" strokeDasharray="5 4" />
        <line x1={pl} x2={W - pr} y1={y(b.my)} y2={y(b.my)} stroke="var(--nr-av)" strokeDasharray="5 4" />
        {b.pts.map((p: any, i: number) => (
          <motion.circle key={p.nome + i} initial={{ r: 0 }} animate={{ r: 6 }} transition={{ delay: i * 0.02 }} cx={x(p.x)} cy={y(p.y)} fill={COR[cor(p)]}>
            <title>{`${p.nome}: engajamento ${p.x}% · desempenho ${p.y}%`}</title>
          </motion.circle>
        ))}
        {b.pts
          .filter((p: any) => b.rot?.includes(p.nome))
          .map((p: any) => {
            const esq = b.rot.indexOf(p.nome) > 0
            return (
              <text key={'r' + p.nome} x={x(p.x) + (esq ? -10 : 10)} y={y(p.y) - 8} textAnchor={esq ? 'end' : 'start'} className="nr-svg__rot">
                {p.nome}
              </text>
            )
          })}
      </svg>
      <small>
        Linhas tracejadas: mediana de engajamento ({b.mx}%) e meta de desempenho ({b.my}%).
      </small>
    </>
  )
}

function Pilhas({ b }: { b: Bloco }) {
  return (
    <>
      <div className="nr-pilhas">
        {b.linhas.map(([r, d]: [string, number[]]) => (
          <div key={r} className="nr-pilhas__linha">
            <span>{r}</span>
            <span className="nr-pilha">
              {d.map((v, i) =>
                v > 0 ? (
                  <i key={i} style={{ width: `${v}%`, background: COR[RUB5[i][0]] }} title={`${RUB5[i][1]}: ${v}%`}>
                    {v >= 8 ? `${v}%` : ''}
                  </i>
                ) : null,
              )}
            </span>
          </div>
        ))}
      </div>
      <Legenda itens={RUB5.filter((_, i) => b.linhas.some((l: any) => l[1][i] > 0))} />
    </>
  )
}

function Proficiencia({ b }: { b: Bloco }) {
  return (
    <>
      <span className="nr-pilha is-alta">
        {b.dist.map(([r, p]: [string, number]) => (
          <i key={r} style={{ width: `${p}%`, background: COR[TOM_RUB[r]] }} title={`${r}: ${p}%`} />
        ))}
      </span>
      <div className="nr-prof">
        {b.dist.map(([r, p, n]: [string, number, number]) => (
          <div key={r} className="nr-prof__linha">
            <i style={{ background: COR[TOM_RUB[r]] }} />
            <span>{r}</span>
            <b>{p}%</b>
            <small>{n.toLocaleString('pt-BR')} estudantes</small>
          </div>
        ))}
      </div>
      {b.rodape && <small>{b.rodape}</small>}
    </>
  )
}

function Status({ b }: { b: Bloco }) {
  return (
    <>
      {b.sub && <small>{b.sub}</small>}
      <span className="nr-pilha is-alta">
        {b.partes.map(([c, r, p]: [string, string, number]) => (p > 0 ? <i key={r} style={{ width: `${p}%`, background: COR[c] }} title={`${r}: ${p}%`} /> : null))}
      </span>
      <div className="nr-prof">
        {b.partes.map(([c, r, p, n]: [string, string, number, number | string]) => (
          <div key={r} className="nr-prof__linha">
            <i style={{ background: COR[c] }} />
            <span>{r}</span>
            <b>{p}%</b>
            <small>{typeof n === 'number' ? `${n.toLocaleString('pt-BR')} estudantes` : n}</small>
          </div>
        ))}
      </div>
    </>
  )
}

function Lista({ b, onIr }: { b: Bloco; onIr?: (ir: string) => void }) {
  return (
    <div className="nr-lista">
      {b.itens.map(([t, d, extra]: [string, string, any], i: number) => (
        <div key={t + i} className="nr-lista__item">
          <div>
            <b>{t}</b>
            {d && <small>{d}</small>}
          </div>
          {extra !== undefined && <span className="nr-lista__extra">{typeof extra === 'object' ? <Celula c={extra} onIr={onIr} /> : <b>{extra}</b>}</span>}
        </div>
      ))}
    </div>
  )
}

function Habilidades({ b }: { b: Bloco }) {
  return (
    <div className="nr-lista">
      {b.itens.map(([cod, nome, p, sub]: [string, string, number, string]) => (
        <div key={cod + nome} className="nr-hab">
          <div>
            <b>{nome}</b>
            <small>
              {cod} · {sub}
            </small>
          </div>
          <span className="nr-hab__barra">
            <span className="nr-trilho">
              <motion.i initial={{ width: 0 }} animate={{ width: `${p}%` }} style={{ background: COR[tomFaixa(p)] }} />
            </span>
            <b style={{ color: COR[tomFaixa(p)] }}>{p}%</b>
          </span>
        </div>
      ))}
      {b.link && (
        <button className="nr-link">
          {b.linkIc === 'sparkles' ? <Sparkles size={14} /> : <ArrowRight size={14} />} {b.link}
        </button>
      )}
    </div>
  )
}

export function Bloco_({ b, onMenu, onIr }: { b: Bloco; onMenu?: (t: string) => void; onIr?: (ir: string) => void }) {
  const corpo =
    b.t === 'L' ? <Linhas b={b} /> : b.t === 'V' ? <BarrasV b={b} /> : b.t === 'H' ? <BarrasH b={b} /> : b.t === 'quad' ? <Quadrantes b={b} /> : b.t === 'pilhas' ? <Pilhas b={b} /> : b.t === 'prof' ? <Proficiencia b={b} /> : b.t === 'status' ? <Status b={b} /> : b.t === 'lista' ? <Lista b={b} onIr={onIr} /> : b.t === 'hab' ? <Habilidades b={b} /> : null
  return (
    <Cartao titulo={b.titulo} desc={b.desc} onMenu={onMenu} w={b.w}>
      {corpo}
    </Cartao>
  )
}
export const Linha = ({ blocos, onMenu, onIr }: { blocos: Bloco[]; onMenu?: (t: string) => void; onIr?: (ir: string) => void }) => (
  <div className="nr-linha">
    {blocos.map((b, i) => (
      <Bloco_ key={(b.titulo ?? '') + i} b={b} onMenu={onMenu} onIr={onIr} />
    ))}
  </div>
)
export const QB_LEGENDA = QB

/* ------------------------------------------------------------------ tabela */
export function Celula({ c, onIr }: { c: Cel; onIr?: (ir: string) => void }) {
  if (typeof c !== 'object') return <>{c}</>
  if ('F' in c) return <span className={`nr-chip is-${tomFaixa(c.F)}`}>{c.F}%</span>
  if ('M' in c) return <span className={`nr-chip is-${c.M >= (c.meta ?? 50) ? 'suc' : 'at'}`}>{c.s ?? c.M + '%'}</span>
  if ('p' in c) return <Badge t={c.p} tom={TOM_RUB[c.p] ?? 'neutro'} />
  if ('b' in c) return <Badge t={c.b} tom={c.t} />
  if ('tr' in c)
    return (
      <span className="nr-tr-barra">
        <span className="nr-trilho">
          <motion.i initial={{ width: 0 }} animate={{ width: `${c.tr}%` }} style={{ background: c.tr >= c.meta ? 'var(--nr-suc)' : 'var(--nr-at)' }} />
          {c.meta < 100 && <b style={{ left: `${c.meta}%` }} aria-hidden />}
        </span>
        <small>{c.tx}</small>
      </span>
    )
  if ('d' in c)
    return (
      <span className="nr-duas">
        <b>{c.d[0]}</b>
        <small>{c.d[1]}</small>
      </span>
    )
  if ('lk' in c)
    return (
      <button className="nr-link" onClick={(e) => (e.stopPropagation(), onIr?.(c.ir ?? '__fora__' + c.lk))}>
        {c.lk} <ArrowRight size={14} />
      </button>
    )
  if ('m' in c) return <span className="nr-mudo">{c.m}</span>
  if ('wrap' in c) return <span className="nr-wrap">{c.wrap}</span>
  if ('alt' in c)
    return (
      <span className="nr-alts">
        {(c.alt as number[]).map((v, i) => {
          const l = 'ABCD'[i]
          return (
            <span key={l} className={l === c.gab ? 'is-gab' : ''} title={`${l}: ${v}%`}>
              <i style={{ height: Math.max(3, Math.round(v * 0.5)) }} />
              <small>{l}</small>
            </span>
          )
        })}
      </span>
    )
  return null
}
const valorOrd = (c: Cel): number | string => {
  if (typeof c === 'number') return c
  if (typeof c === 'string') {
    const n = Number(c.replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, ''))
    return c.trim() && !Number.isNaN(n) && /\d/.test(c) ? n : c
  }
  if ('F' in c) return c.F
  if ('M' in c) return c.M
  if ('tr' in c) return c.tr
  if ('d' in c) return c.d[0]
  return 0
}
const textoCel = (c: Cel) => (typeof c === 'object' ? ('d' in c ? c.d.join(' ') : 'b' in c ? c.b : 'p' in c ? c.p : '') : String(c))

export function TabelaCard({ t, onExportar, onFiltros, onIr, linkLinha, onMenu }: { t: Tabela; onExportar: () => void; onFiltros: () => void; onIr: (ir: string) => void; linkLinha?: (txt: string) => string | null; onMenu?: (t: string) => void }) {
  const [q, setQ] = useState('')
  const [ord, setOrd] = useState<{ i: number; asc: boolean } | null>(null)
  const [pag, setPag] = useState(1)
  const linhas = useMemo(() => {
    let r = t.rows.filter((row) => !q || row.some((c) => textoCel(c).toLowerCase().includes(q.toLowerCase())))
    if (ord) {
      r = r.slice().sort((a, b) => {
        const va = valorOrd(a[ord.i])
        const vb = valorOrd(b[ord.i])
        const d = typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb), 'pt-BR')
        return ord.asc ? d : -d
      })
    }
    return r
  }, [t.rows, q, ord])
  const grade = t.cols.map((c) => (c.w ? `minmax(${Math.round(c.w * 0.8)}px, ${c.w}fr)` : 'minmax(200px, 300fr)')).join(' ')
  const minW = t.cols.reduce((s, c) => s + (c.w ? c.w * 0.8 : 200), 0) + 12 * t.cols.length
  const paginas = t.pag ? t.pag[1] : 1
  return (
    <Cartao titulo={t.titulo} desc={t.desc} onMenu={onMenu} className="nr-tabcard">
      <div className="nr-tabcard__acoes">
        {t.busca && (
          <label className="nr-busca">
            <Search size={15} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.busca} aria-label={t.busca} />
          </label>
        )}
        <button className="nr-icone-btn is-borda" onClick={onFiltros} aria-label="Filtrar a tabela" title="Filtrar">
          <Filter size={16} />
        </button>
        <button className="nr-btn is-primario" onClick={onExportar}>
          <Download size={16} /> Exportar
        </button>
      </div>
      <div className="nr-tabela-rola">
        <div className="nr-tabela" style={{ minWidth: minW }}>
          <div className="nr-tr is-cab" style={{ gridTemplateColumns: grade }}>
            {t.cols.map((c, i) => (
              <span key={c.t} className={c.al === 'CENTER' ? 'is-centro' : ''}>
                {c.sort ? (
                  <button className="nr-th" onClick={() => setOrd((o) => (o?.i === i ? { i, asc: !o.asc } : { i, asc: false }))} aria-label={`Ordenar por ${c.t}`}>
                    {c.t} <ChevronsUpDown size={14} />
                  </button>
                ) : (
                  c.t
                )}
              </span>
            ))}
          </div>
          {linhas.map((row, k) => {
            const alvo = linkLinha && typeof row[0] === 'string' ? linkLinha(row[0]) : linkLinha && typeof row[1] === 'string' ? linkLinha(row[1]) : null
            return (
              <div key={k} className={`nr-tr ${alvo ? 'is-clicavel' : ''}`} style={{ gridTemplateColumns: grade }} onClick={alvo ? () => onIr(alvo) : undefined} title={alvo ? 'Abrir relatório' : undefined}>
                {row.map((c, i) => (
                  <span key={i} className={`${t.cols[i]?.al === 'CENTER' ? 'is-centro' : ''} ${i === 0 || (i === 1 && /Posição|Questão/.test(t.cols[0].t)) ? 'is-nome' : ''}`}>
                    <Celula c={c} onIr={onIr} />
                  </span>
                ))}
              </div>
            )
          })}
          {linhas.length === 0 && <p className="nr-vazio">Nada encontrado para “{q}”.</p>}
        </div>
      </div>
      {t.leg && <Legenda itens={t.leg} />}
      {t.pag && (
        <div className="nr-pager">
          <small>{q ? `${linhas.length} resultado${linhas.length === 1 ? '' : 's'} nesta página` : t.pag[0]}</small>
          {paginas > 1 && (
            <span>
              <button className="nr-pager__btn" disabled={pag <= 1} onClick={() => setPag(pag - 1)} aria-label="Página anterior">
                <ChevronLeft size={16} />
              </button>
              {[1, 2, 3].filter((p) => p <= paginas).map((p) => (
                <button key={p} className={`nr-pager__btn ${pag === p ? 'is-on' : ''}`} onClick={() => setPag(p)}>
                  {p}
                </button>
              ))}
              {paginas > 3 && <small>…</small>}
              <button className="nr-pager__btn" disabled={pag >= paginas} onClick={() => setPag(pag + 1)} aria-label="Próxima página">
                <ChevronRight size={16} />
              </button>
            </span>
          )}
        </div>
      )}
    </Cartao>
  )
}

/* ------------------------------------------------------------------ segmento "Ver por" */
export function Segmento({ opcoes, valor, onTroca, extra }: { opcoes: string[]; valor: string; onTroca: (v: string) => void; extra?: ReactNode }) {
  return (
    <div className="nr-seg">
      <small>Ver por</small>
      <div className="nr-seg__grupo" role="tablist">
        {opcoes.map((o) => (
          <button key={o} role="tab" aria-selected={o === valor} className={o === valor ? 'is-on' : ''} onClick={() => onTroca(o)}>
            {o}
          </button>
        ))}
      </div>
      {extra}
    </div>
  )
}

export const Seletor = ({ rot, valor, ic, placeholder, travado, onClick, largura }: { rot: string; valor: string; ic: string; placeholder?: boolean; travado?: boolean; onClick: () => void; largura?: number }) => (
  <label className="nr-sel" data-rot={rot} style={largura ? { width: largura } : undefined}>
    <small>{rot}</small>
    <button className={`nr-sel__btn ${placeholder ? 'is-ph' : ''} ${travado ? 'is-travado' : ''}`} onClick={onClick} aria-label={`${rot}: ${valor}`}>
      <Ic n={ic} />
      <span>{valor}</span>
      {travado ? <Lock size={14} /> : <ChevronDown size={16} />}
    </button>
  </label>
)
