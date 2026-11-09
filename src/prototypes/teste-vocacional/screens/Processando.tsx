import { motion } from 'framer-motion'
import { Check, LoaderCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { CARREIRAS } from '../carreiras'
import { Brilhos } from '../components/ui'
import { DIM, DIMS } from '../instrumento'
import { useTv } from '../store'

/** Processamento das respostas (PRD §5.5): estado de carregamento compreensível */
export default function Processando() {
  const { concluir, ir, toast } = useTv()
  const [passo, setPasso] = useState(0)
  const feito = useRef(false)
  const passos = ['Somando suas respostas em cada área de interesse', `Relacionando seu perfil a ${CARREIRAS.length} profissões do catálogo`, 'Escrevendo o porquê de cada sugestão', 'Preparando seu relatório']

  useEffect(() => {
    const ts = passos.map((_, i) => window.setTimeout(() => setPasso(i + 1), 750 * (i + 1)))
    const fim = window.setTimeout(() => {
      if (feito.current) return
      feito.current = true
      const res = concluir()
      if (!res) {
        toast('Ainda faltam respostas para gerar seu perfil.', 'erro')
        return ir({ id: 'revisao' }, -1)
      }
      ir({ id: 'relatorio' })
    }, 750 * passos.length + 550)
    return () => [...ts, fim].forEach((t) => window.clearTimeout(t))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="tv-foco tv-proc">
      <div className="tv-proc__arte" aria-hidden>
        <Brilhos n={7} />
        <motion.div className="tv-proc__anel" animate={{ rotate: 360 }} transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}>
          {DIMS.map((d, i) => (
            <span key={d} style={{ transform: `rotate(${i * 60}deg) translateY(-92px) rotate(${-i * 60}deg)`, background: DIM[d].claro, borderColor: DIM[d].cor }}>
              <img src={DIM[d].icone} alt="" />
            </span>
          ))}
        </motion.div>
        <motion.img className="tv-proc__bussola" src="./voc/compass.webp" alt="" animate={{ rotate: [0, 25, -15, 10, 0], scale: [1, 1.06, 1] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }} />
      </div>
      <h1 className="tv-h1 tv-h1--m">Montando seu perfil…</h1>
      <p className="tv-texto tv-texto--suave">Usamos só as respostas que você registrou, sempre com as mesmas regras.</p>
      <ul className="tv-proc__passos" aria-live="polite">
        {passos.map((p, i) => (
          <motion.li key={p} className={i < passo ? 'is-feito' : i === passo ? 'is-on' : ''} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
            <span>{i < passo ? <Check size={14} strokeWidth={3} /> : i === passo ? <LoaderCircle size={14} className="tv-gira" /> : null}</span>
            {p}
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
