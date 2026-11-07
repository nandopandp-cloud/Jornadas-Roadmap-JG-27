import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, Lightbulb } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Barra, Brilhos, Btn, Quadrado, Voltar } from '../components/ui'
import { DICAS, DISC, TOPICO } from '../data'
import { useFx } from '../store'

const ease = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 2.2)
const fase = (p: number, n: number) =>
  p >= 1 ? `Pronto! ${n} flashcards criados.` : p < 0.34 ? 'Analisando os principais tópicos...' : p < 0.8 ? 'Gerando flashcards com base no seu conteúdo...' : 'Revisando perguntas e respostas...'

/** Etapa 3 — Gerando seus flashcards (progresso animado) */
export default function Gerando({ onCancelar }: { onCancelar: () => void }) {
  const { s, gerar, ir, toast } = useFx()
  // fotografia das seleções (gerar() limpa a seleção ao final)
  const itens = useRef(
    s.selecao.discs
      .filter((d) => s.selecao.topicos[d]?.length)
      .map((d, i) => ({ d, n: s.selecao.topicos[d].reduce((a, t) => a + TOPICO[t].cards.length, 0), dur: 3600 + i * 1100, atraso: i * 380 })),
  ).current
  const [t, setT] = useState(0)
  const [dica, setDica] = useState(0)
  const feito = useRef(false)
  const [pronto, setPronto] = useState(false)

  useEffect(() => {
    if (!itens.length) return ir({ id: 'disciplinas' }, -1)
    let raf = 0
    const t0 = performance.now()
    const passo = (agora: number) => {
      setT(agora - t0)
      raf = requestAnimationFrame(passo)
    }
    raf = requestAnimationFrame(passo)
    const iv = window.setInterval(() => setDica((x) => (x + 1) % DICAS.length), 2600)
    return () => {
      cancelAnimationFrame(raf)
      window.clearInterval(iv)
    }
  }, [itens, ir])

  const ps = itens.map((x) => ease((t - x.atraso) / x.dur))
  const geral = ps.length ? (ps.reduce((a, b) => a + b, 0) / ps.length) * 100 : 0
  const total = itens.reduce((a, x) => a + x.n, 0)

  useEffect(() => {
    if (geral < 100 || feito.current) return
    feito.current = true
    setPronto(true)
    gerar()
    const id = window.setTimeout(() => {
      ir({ id: 'home', aba: 'grupos' })
      toast(`${total} flashcards criados em ${itens.length} ${itens.length === 1 ? 'grupo' : 'grupos'}!`)
    }, 1500)
    return () => window.clearTimeout(id)
  }, [geral, gerar, ir, toast, total, itens.length])

  return (
    <div className="fx-wiz fx-gerando">
      <Voltar texto="Criar flashcards" onClick={onCancelar} />
      <div className="fx-gerando__cab">
        <div>
          <AnimatePresence mode="wait">
            <motion.h1 key={String(pronto)} className="fx-h1 fx-h1--m" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              {pronto ? 'Seus flashcards estão prontos!' : 'Gerando seus flashcards...'}
            </motion.h1>
          </AnimatePresence>
          <p>
            Estamos preparando os melhores conteúdos para você.
            <br />
            Esse processo pode levar alguns instantes.
          </p>
        </div>
        <div className="fx-gerando__arte">
          <Brilhos n={6} escala={1.3} />
          <motion.img
            src="./flash/hero-gerando.webp"
            alt=""
            animate={pronto ? { rotate: [0, -8, 360], scale: [1, 1.1, 1] } : { rotate: [-3, 3, -3], y: [0, -10, 0] }}
            transition={pronto ? { duration: 0.9, ease: 'easeInOut' } : { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <AnimatePresence>
            {pronto && (
              <motion.span className="fx-gerando__ok" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 14, delay: 0.5 }}>
                <Check size={26} strokeWidth={3.4} />
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="fx-gerando__geral">
        <Barra valor={geral} className="fx-barra--g fx-barra--brilho" />
        <span>{Math.floor(geral)}%</span>
      </div>

      <section className="fx-cartao fx-proc">
        <h3>
          Seleções em processamento ({itens.length}/{itens.length})
        </h3>
        {itens.map((x, i) => {
          const p = ps[i]
          return (
            <motion.div key={x.d} className={`fx-proc__item ${p >= 1 ? 'is-ok' : ''}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Quadrado icone={DISC[x.d].icone} tam="g" />
              <span className="fx-proc__txt">
                <strong>{DISC[x.d].curso}</strong>
                <AnimatePresence mode="wait">
                  <motion.span key={fase(p, x.n)} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.18 }}>
                    {fase(p, x.n)}
                  </motion.span>
                </AnimatePresence>
              </span>
              <Barra valor={p * 100} className="fx-proc__barra" fina />
              <span className="fx-proc__pct">
                {p >= 1 ? (
                  <motion.span className="fx-proc__check" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 16 }}>
                    <Check size={16} strokeWidth={3.4} />
                  </motion.span>
                ) : (
                  `${Math.floor(p * 100)}%`
                )}
              </span>
            </motion.div>
          )
        })}
      </section>

      <section className="fx-enquanto">
        <motion.span animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.2 }}>
          <Lightbulb size={26} strokeWidth={1.8} />
        </motion.span>
        <div>
          <strong>Enquanto isso...</strong>
          <AnimatePresence mode="wait">
            <motion.p key={dica} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}>
              {DICAS[dica]}
            </motion.p>
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {pronto && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
              <Btn iconeDir={<ArrowRight size={18} />} onClick={() => ir({ id: 'home', aba: 'grupos' })}>
                Ver meus flashcards
              </Btn>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  )
}
