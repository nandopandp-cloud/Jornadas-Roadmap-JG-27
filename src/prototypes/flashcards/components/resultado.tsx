import { motion } from 'framer-motion'
import { PartyPopper } from 'lucide-react'
import { CARD, TOPICO } from '../data'
import { contagem, pct, type Grupo } from '../store'
import { Barra, Num } from './ui'

/** anel de progresso (SVG) */
export function Anel({ valor, rotulo = 'Concluído', tam = 160, festa }: { valor: number; rotulo?: string; tam?: number; festa?: boolean }) {
  const r = 84
  const C = 2 * Math.PI * r
  return (
    <div className="fx-anel" style={{ width: tam, height: tam }}>
      <svg viewBox="0 0 196 196" width={tam} height={tam} aria-hidden>
        <defs>
          <linearGradient id="fx-anel-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8b6cff" />
            <stop offset="1" stopColor="#6a4cf2" />
          </linearGradient>
        </defs>
        <circle cx="98" cy="98" r={r} fill="none" stroke="#eeebfd" strokeWidth="22" />
        <motion.circle
          cx="98"
          cy="98"
          r={r}
          fill="none"
          stroke="url(#fx-anel-g)"
          strokeWidth="22"
          strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={{ strokeDashoffset: C * (1 - valor / 100) }}
          transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1], delay: 0.15 }}
          transform="rotate(-90 98 98)"
        />
      </svg>
      <div className="fx-anel__txt">
        {festa && (
          <motion.span className="fx-anel__festa" initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 1.1, type: 'spring', stiffness: 400, damping: 12 }}>
            <PartyPopper size={22} />
          </motion.span>
        )}
        <strong>
          <Num v={valor} sufixo="%" />
        </strong>
        <small>{rotulo}</small>
      </div>
    </div>
  )
}

export function Legenda({ g }: { g: Grupo }) {
  const c = contagem(g)
  const total = g.cards.length
  const linhas = [
    { k: 'sei', t: 'Acertos', n: c.sei },
    { k: 'revisar', t: 'Revisar depois', n: c.revisar },
    { k: 'nao', t: 'Erros', n: c.nao },
  ]
  return (
    <ul className="fx-legenda">
      {linhas.map((l, i) => (
        <motion.li key={l.k} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
          <i className={`fx-legenda__bola is-${l.k}`} />
          <span>{l.t}</span>
          <strong>
            <Num v={l.n} />
          </strong>
          <small>{pct(l.n, total)}%</small>
        </motion.li>
      ))}
    </ul>
  )
}

/** % de acertos por tópico do grupo */
export function PorTopico({ g, respondidosApenas }: { g: Grupo; respondidosApenas?: boolean }) {
  return (
    <div className="fx-portopico">
      {g.topicos.map((t, i) => {
        const cards = g.cards.filter((c) => CARD[c].topico === t)
        const base = respondidosApenas ? cards.filter((c) => g.status[c]) : cards
        const sei = cards.filter((c) => g.status[c] === 'sei').length
        const v = pct(sei, base.length)
        return (
          <motion.div key={t} className="fx-portopico__l" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08 }}>
            <span>{TOPICO[t].nome}</span>
            <Barra valor={v} fina />
            <small>{base.length ? `${v}%` : '—'}</small>
          </motion.div>
        )
      })}
    </div>
  )
}
