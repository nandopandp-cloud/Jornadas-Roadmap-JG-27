import { motion } from 'framer-motion'
import { ArrowRight, Columns3, Sparkles, TriangleAlert } from 'lucide-react'
import type { CSSProperties } from 'react'
import { AREA, perfilDe, type Carreira } from '../carreiras'
import { DIM, DIMS, type Dim } from '../instrumento'
import { CATEGORIA, type Recomendacao } from '../motor'
import { useTv } from '../store'
import { Estrela, Rico } from './ui'

/* ---------------- selo de dimensão (nunca só cor: ícone + nome + sigla) ---------------- */
export function Selo({ d, tam = 'm', sigla = true }: { d: Dim; tam?: 'p' | 'm' | 'g'; sigla?: boolean }) {
  const x = DIM[d]
  return (
    <span className={`tv-selo tv-selo--${tam}`} style={{ '--c': x.cor, '--cc': x.claro } as CSSProperties}>
      <img src={x.icone} alt="" />
      <span>{x.nome}</span>
      {sigla && <em title={`Dimensão ${x.tecnico} do modelo RIASEC`}>{d}</em>}
    </span>
  )
}

/* ---------------- mapa de interesses (hexágono de Holland) ---------------- */
const ANG = DIMS.map((_, i) => -Math.PI / 2 + (i * Math.PI) / 3)
const pt = (i: number, v: number, R: number, c: number) => [c + Math.cos(ANG[i]) * (R * v) / 100, c + Math.sin(ANG[i]) * (R * v) / 100]
const pontos = (vals: number[], R: number, c: number) => vals.map((v, i) => pt(i, Math.max(v, 4), R, c).map((n) => n.toFixed(1)).join(',')).join(' ')

export function Radar({ norm, referencia, tam = 320, destaques = [] }: { norm: Record<Dim, number>; referencia?: Record<Dim, number>; tam?: number; destaques?: Dim[] }) {
  const c = tam / 2
  const R = tam * 0.33
  const vals = DIMS.map((d) => norm[d])
  return (
    <svg className="tv-radar" viewBox={`0 0 ${tam} ${tam}`} width="100%" role="img" aria-label={`Mapa de interesses: ${DIMS.map((d) => `${DIM[d].nome} ${norm[d]} de 100`).join('; ')}`}>
      {[25, 50, 75, 100].map((n) => (
        <polygon key={n} points={pontos([n, n, n, n, n, n], R, c)} className={`tv-radar__anel ${n === 100 ? 'is-borda' : ''}`} />
      ))}
      {DIMS.map((d, i) => {
        const [x, y] = pt(i, 100, R, c)
        return <line key={d} x1={c} y1={c} x2={x} y2={y} className="tv-radar__eixo" />
      })}
      {referencia && (
        <motion.polygon
          className="tv-radar__ref"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          points={pontos(
            DIMS.map((d) => referencia[d]),
            R,
            c,
          )}
        />
      )}
      <motion.polygon
        className="tv-radar__area"
        initial={{ points: pontos([4, 4, 4, 4, 4, 4], R, c) }}
        animate={{ points: pontos(vals, R, c) }}
        transition={{ type: 'spring', stiffness: 70, damping: 14, delay: 0.15 }}
      />
      {vals.map((v, i) => {
        const [x, y] = pt(i, Math.max(v, 4), R, c)
        return <motion.circle key={i} className="tv-radar__ponto" r={4.2} initial={{ cx: c, cy: c, opacity: 0 }} animate={{ cx: x, cy: y, opacity: 1 }} transition={{ type: 'spring', stiffness: 70, damping: 14, delay: 0.15 }} style={{ fill: DIM[DIMS[i]].cor }} />
      })}
      {DIMS.map((d, i) => {
        const [x, y] = pt(i, 128, R, c)
        const on = destaques.includes(d)
        return (
          <g key={d} transform={`translate(${x} ${y})`} className={`tv-radar__rot ${on ? 'is-on' : ''}`}>
            <circle r={on ? 21 : 18} style={{ fill: on ? DIM[d].claro : '#fff', stroke: on ? DIM[d].cor : '#e6e7ee' }} />
            <image href={DIM[d].icone} x={-12} y={-12} width={24} height={24} />
            <text y={on ? 36 : 33} textAnchor="middle">
              {DIM[d].nome.split(' e ')[0]}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/* ---------------- card de profissão ---------------- */
export function CardCarreira({ c, rec, onAbrir, compacto, indice = 0 }: { c: Carreira; rec?: Recomendacao; onAbrir: () => void; compacto?: boolean; indice?: number }) {
  const { s, favoritar, toggleComparar, toast, ir } = useTv()
  const salvo = s.favoritos.some((f) => f.id === c.id)
  const comparando = s.comparar.includes(c.id)
  const letras = [...c.codigo] as Dim[]
  return (
    <motion.article
      className={`tv-cartao tv-ccard ${compacto ? 'tv-ccard--compacto' : ''}`}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(indice, 8) * 0.05 }}
      whileHover={{ y: -3 }}
    >
      <div className="tv-ccard__topo">
        <span className="tv-ccard__ic" style={{ '--c': AREA[c.area].cor } as CSSProperties}>
          <img src={c.icone} alt="" />
        </span>
        <div className="tv-ccard__tags">
          {rec && <span className={`tv-tag tv-tag--${rec.categoria}`}>{rec.categoria === 'explorar' ? <Sparkles size={12} /> : <ArrowRight size={12} />} {CATEGORIA[rec.categoria]}</span>}
          {c.poucoConhecida && <span className="tv-tag tv-tag--nova">Pouco conhecida</span>}
        </div>
        <Estrela
          on={salvo}
          onClick={() => {
            const on = favoritar(c.id)
            toast(on ? `${c.nome} salva em Minhas carreiras.` : `${c.nome} removida de Minhas carreiras.`, on ? 'ok' : 'info', on ? { rotulo: 'Ver lista', fn: () => ir({ id: 'minhas' }) } : undefined)
          }}
        />
      </div>
      <small className="tv-ccard__area">{AREA[c.area].nome}</small>
      <h3 className="tv-ccard__nome">{c.nome}</h3>
      {rec ? (
        <p className="tv-ccard__porque">
          <Rico texto={rec.motivos[0]} />
        </p>
      ) : (
        <p className="tv-ccard__porque">{c.descricao}</p>
      )}
      {rec?.atencao && !compacto && (
        <p className="tv-ccard__atencao">
          <TriangleAlert size={14} /> <span>{rec.atencao}</span>
        </p>
      )}
      <div className="tv-ccard__dims" aria-label="Interesses relacionados">
        {letras.map((d) => (
          <span key={d} className={`tv-mini ${rec?.combina.includes(d) ? 'is-on' : ''}`} style={{ '--c': DIM[d].cor, '--cc': DIM[d].claro } as CSSProperties} title={DIM[d].nome}>
            <img src={DIM[d].icone} alt="" />
            {DIM[d].curto}
          </span>
        ))}
      </div>
      <div className="tv-ccard__acoes">
        <button className="tv-ccard__abrir" onClick={onAbrir}>
          Conhecer a profissão <ArrowRight size={15} />
        </button>
        <button
          className={`tv-ccard__comp ${comparando ? 'is-on' : ''}`}
          aria-pressed={comparando}
          title={comparando ? 'Tirar da comparação' : 'Adicionar à comparação'}
          onClick={() => {
            const r = toggleComparar(c.id)
            if (r === 'cheio') toast('Você pode comparar até 3 profissões. Remova uma para adicionar outra.', 'info')
          }}
        >
          <Columns3 size={15} /> {comparando ? 'Comparando' : 'Comparar'}
        </button>
      </div>
    </motion.article>
  )
}

/** perfil de referência da ocupação (para comparar com o do estudante) */
export const referenciaDe = (c: Carreira) => perfilDe(c.codigo)
