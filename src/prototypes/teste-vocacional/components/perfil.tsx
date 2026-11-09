import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { CSSProperties } from 'react'
import { AREA, perfilDe, type Carreira } from '../carreiras'
import { DIM, DIMS, type Dim } from '../instrumento'
import { CATEGORIA, type Recomendacao } from '../motor'

/* ---------------- bolinha com a letra RIASEC ---------------- */
export function DimBola({ d, tam = 30, titulo = true }: { d: Dim; tam?: number; titulo?: boolean }) {
  return (
    <span className="tv-bola" style={{ width: tam, height: tam, fontSize: tam * 0.46, background: DIM[d].cor } as CSSProperties} title={titulo ? DIM[d].tecnico : undefined} aria-label={DIM[d].tecnico}>
      {d}
    </span>
  )
}

/* ---------------- radar RIASEC (Frames 7 e 8) ---------------- */
/** ordem do hexágono como nas referências: Investigativa no topo, sentido horário */
const ORDEM: Dim[] = ['I', 'A', 'E', 'C', 'S', 'R']
const ANG = ORDEM.map((_, i) => -Math.PI / 2 + (i * Math.PI) / 3)
const pt = (i: number, v: number, R: number, cx: number, cy: number) => [cx + (Math.cos(ANG[i]) * R * v) / 100, cy + (Math.sin(ANG[i]) * R * v) / 100]
const pontos = (vals: number[], R: number, cx: number, cy: number) => vals.map((v, i) => pt(i, Math.max(v, 4), R, cx, cy).map((n) => n.toFixed(1)).join(',')).join(' ')

export function Radar({ norm, referencia, largura = 440, notas = true }: { norm: Record<Dim, number>; referencia?: Record<Dim, number>; largura?: number; notas?: boolean }) {
  const W = largura
  const H = largura * 0.86
  const cx = W / 2
  const cy = H / 2 + 6
  const R = H * 0.3
  const vals = ORDEM.map((d) => norm[d])
  return (
    <svg className="tv-radar" viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={`Perfil de interesses: ${ORDEM.map((d) => `${DIM[d].tecnico} ${norm[d]}`).join(', ')}`}>
      {[20, 40, 60, 80, 100].map((n) => (
        <polygon key={n} points={pontos([n, n, n, n, n, n], R, cx, cy)} className={`tv-radar__anel ${n === 100 ? 'is-borda' : ''}`} />
      ))}
      {ORDEM.map((d, i) => {
        const [x, y] = pt(i, 100, R, cx, cy)
        return <line key={d} x1={cx} y1={cy} x2={x} y2={y} className="tv-radar__eixo" />
      })}
      {referencia && (
        <motion.polygon
          className="tv-radar__ref"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          points={pontos(
            ORDEM.map((d) => referencia[d]),
            R,
            cx,
            cy,
          )}
        />
      )}
      <motion.polygon className="tv-radar__area" initial={{ points: pontos([4, 4, 4, 4, 4, 4], R, cx, cy) }} animate={{ points: pontos(vals, R, cx, cy) }} transition={{ type: 'spring', stiffness: 70, damping: 14, delay: 0.1 }} />
      {vals.map((v, i) => {
        const [x, y] = pt(i, Math.max(v, 4), R, cx, cy)
        return <motion.circle key={i} r={5} style={{ fill: DIM[ORDEM[i]].cor }} className="tv-radar__ponto" initial={{ cx, cy, opacity: 0 }} animate={{ cx: x, cy: y, opacity: 1 }} transition={{ type: 'spring', stiffness: 70, damping: 14, delay: 0.1 }} />
      })}
      {ORDEM.map((d, i) => {
        const [x, y] = pt(i, 128, R, cx, cy)
        const lado = Math.abs(x - cx) < 4 ? 'middle' : x > cx ? 'start' : 'end'
        const dx = lado === 'start' ? -8 : lado === 'end' ? 8 : 0
        return (
          <g key={d} transform={`translate(${x + (lado === 'middle' ? 0 : lado === 'start' ? -16 : 16)} ${y + (i === 0 ? -14 : i === 3 ? 4 : -8)})`}>
            <text className="tv-radar__nome" textAnchor="middle" x={dx}>
              {DIM[d].tecnico}
            </text>
            {notas && (
              <g transform={`translate(${dx} 10)`}>
                <rect x={-17} y={0} width={34} height={22} rx={11} style={{ fill: DIM[d].cor }} />
                <text className="tv-radar__nota" textAnchor="middle" y={15.5}>
                  {norm[d]}
                </text>
              </g>
            )}
          </g>
        )
      })}
    </svg>
  )
}

/* ---------------- foto da profissão (ou ícone 3D quando não houver foto) ---------------- */
export function FotoProf({ c, className = '' }: { c: Carreira; className?: string }) {
  return c.foto ? (
    <span className={`tv-foto ${className}`}>
      <img src={c.foto} alt="" draggable={false} />
    </span>
  ) : (
    <span className={`tv-foto tv-foto--icone ${className}`} style={{ '--c': AREA[c.area].cor } as CSSProperties}>
      <img src={c.icone} alt="" draggable={false} />
    </span>
  )
}

/** selo da categoria da sugestão (no lugar de “Alta/Média afinidade” das referências) */
export function SeloCategoria({ rec }: { rec?: Pick<Recomendacao, 'categoria'> }) {
  if (!rec) return null
  return <span className={`tv-afin tv-afin--${rec.categoria}`}>{CATEGORIA[rec.categoria]}</span>
}

/* ---------------- card de profissão (Frame 9) ---------------- */
export function CardProf({ c, rec, onAbrir, selecionado, indice = 0, compacto }: { c: Carreira; rec?: Recomendacao; onAbrir: () => void; selecionado?: boolean; indice?: number; compacto?: boolean }) {
  return (
    <motion.article
      className={`tv-cprof ${selecionado ? 'is-sel' : ''} ${compacto ? 'tv-cprof--compacto' : ''}`}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(indice, 8) * 0.05 }}
      whileHover={{ y: -3 }}
      onClick={onAbrir}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onAbrir())}
      aria-label={`${c.nome}${rec ? ` · ${CATEGORIA[rec.categoria]}` : ''}`}
    >
      <div className="tv-cprof__foto">
        <FotoProf c={c} />
        <SeloCategoria rec={rec} />
        {!rec && c.poucoConhecida && <span className="tv-afin tv-afin--nova">Pouco conhecida</span>}
      </div>
      <div className="tv-cprof__corpo">
        <h3>{c.nome}</h3>
        <p>{c.descricao.split(/\.\s/)[0].replace(/\.$/, '')}.</p>
        <div className="tv-cprof__rodape">
          <span className="tv-cprof__dims">
            {([...c.codigo] as Dim[]).map((d) => (
              <DimBola key={d} d={d} tam={compacto ? 26 : 30} />
            ))}
          </span>
          <span className="tv-cprof__seta" aria-hidden>
            <ArrowRight size={16} />
          </span>
        </div>
      </div>
    </motion.article>
  )
}

/** perfil de referência da ocupação (para comparar com o do estudante) */
export const referenciaDe = (c: Carreira) => perfilDe(c.codigo)
export { DIMS }
