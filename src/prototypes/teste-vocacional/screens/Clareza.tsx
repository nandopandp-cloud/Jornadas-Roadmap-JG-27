import { motion } from 'framer-motion'
import { ArrowRight, Check, Info } from 'lucide-react'
import { useState } from 'react'
import { Btn, Voltar } from '../components/ui'
import { CLAREZA, CLAREZA_PERGUNTA } from '../instrumento'
import { useTv } from '../store'

/** Avaliação inicial de clareza (PRD §5.3): registrada antes do questionário, opcional e sem julgamento */
export default function Clareza() {
  const { ir, atual, setClarezaPre } = useTv()
  const [v, setV] = useState<number | null>(atual?.clarezaPre ?? null)
  return (
    <div className="tv-foco">
      <Voltar texto="Teste Vocacional" onClick={() => ir({ id: 'entrada' }, -1)} />
      <Passos atual={0} />
      <motion.section className="tv-cartao tv-clareza" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
        <span className="tv-sobre">Antes de começar</span>
        <h1 className="tv-h1 tv-h1--m">{CLAREZA_PERGUNTA}</h1>
        <p className="tv-texto tv-texto--suave">Não existe nível certo. Vamos fazer a mesma pergunta no final para você perceber se a experiência ajudou.</p>
        <EscalaClareza valor={v} onChange={setV} />
        <p className="tv-nota">
          <Info size={15} /> Esta resposta não muda as profissões sugeridas para você.
        </p>
        <div className="tv-clareza__rodape">
          <button
            className="tv-link"
            onClick={() => {
              setClarezaPre(null)
              ir({ id: 'intro' })
            }}
          >
            Prefiro pular esta pergunta
          </button>
          <Btn
            grande
            disabled={v === null}
            iconeDir={<ArrowRight size={17} />}
            onClick={() => {
              setClarezaPre(v)
              ir({ id: 'intro' })
            }}
          >
            Continuar
          </Btn>
        </div>
      </motion.section>
    </div>
  )
}

export function EscalaClareza({ valor, onChange, antes }: { valor: number | null; onChange: (v: number) => void; antes?: number | null }) {
  return (
    <div className="tv-escclar" role="radiogroup" aria-label={CLAREZA_PERGUNTA}>
      {CLAREZA.map((c, i) => {
        const on = valor === c.v
        return (
          <motion.button
            key={c.v}
            role="radio"
            aria-checked={on}
            className={`tv-escclar__op ${on ? 'is-on' : ''}`}
            onClick={() => onChange(c.v)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.05 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
          >
            {antes === c.v && <span className="tv-escclar__antes">Antes</span>}
            <span className="tv-escclar__n">{c.v}</span>
            <motion.img src={c.emoji} alt="" animate={on ? { scale: [1, 1.25, 1], rotate: [0, -8, 0] } : { scale: 1 }} transition={{ duration: 0.45 }} />
            <span className="tv-escclar__txt">{c.texto}</span>
            {on && (
              <motion.span className="tv-escclar__ok" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <Check size={13} strokeWidth={3} />
              </motion.span>
            )}
          </motion.button>
        )
      })}
    </div>
  )
}

/** trilha de preparação: clareza → como funciona → perguntas */
export function Passos({ atual }: { atual: number }) {
  const passos = ['Sua clareza hoje', 'Como funciona', 'Perguntas']
  return (
    <ol className="tv-passos" aria-label="Preparação">
      {passos.map((p, i) => (
        <li key={p} className={i < atual ? 'is-feito' : i === atual ? 'is-on' : ''} aria-current={i === atual ? 'step' : undefined}>
          <span>{i < atual ? <Check size={12} strokeWidth={3} /> : i + 1}</span>
          {p}
        </li>
      ))}
    </ol>
  )
}
