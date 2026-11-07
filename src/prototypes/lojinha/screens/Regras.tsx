import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, Check, Coins, FileText, Gift, Info, Package, RefreshCcw, Trophy } from 'lucide-react'
import { useState } from 'react'
import { FORMAS_PONTOS, TOPICOS } from '../data'
import { useLoja } from '../store'
import { Banner } from './Historico'

const ICONES = [Trophy, Coins, Gift, CalendarDays, RefreshCcw, Package, FileText]

/** Regras da Lojinha */
export default function Regras({ topico }: { topico?: string }) {
  const { ir } = useLoja()
  const [atual, setAtual] = useState(topico && TOPICOS.some((t) => t.id === topico) ? topico : TOPICOS[0].id)
  const t = TOPICOS.find((x) => x.id === atual)!

  return (
    <div className="lj-regras">
      <Banner img="./loja/banner-regras.webp" titulo="Regras da Lojinha" texto={['Entenda como funcionam seus pontos, os', 'resgates e tudo o que você pode conquistar.']} textoEsq={298} />
      <div className="lj-regras__grade">
        <nav className="lj-painel lj-topicos" aria-label="Tópicos">
          <h3>Tópicos</h3>
          {TOPICOS.map((x, i) => {
            const I = ICONES[i]
            const on = x.id === atual
            return (
              <button key={x.id} className={`lj-topico ${on ? 'is-on' : ''}`} onClick={() => setAtual(x.id)} aria-current={on ? 'page' : undefined}>
                {on && <motion.span layoutId="lj-topico-pill" className="lj-topico__pill" transition={{ type: 'spring', stiffness: 480, damping: 38 }} />}
                <I size={19} strokeWidth={1.8} />
                <span>{x.nome}</span>
              </button>
            )
          })}
        </nav>

        <section className="lj-painel lj-regra">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={t.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8, transition: { duration: 0.12 } }} transition={{ type: 'spring', stiffness: 320, damping: 30 }}>
              <header className="lj-regra__cab">
                <motion.span className="lj-regra__ic" initial={{ scale: 0.5, rotate: -15 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 14 }}>
                  <img src={t.img} alt="" />
                </motion.span>
                <div>
                  <h2>{t.titulo}</h2>
                  <p>{t.sub}</p>
                </div>
              </header>
              {t.blocos.map((b) => (
                <div key={b.t} className="lj-regra__bloco">
                  <h4>{b.t}</h4>
                  {t.id === 'conquistar' && (
                    <div className="lj-formas">
                      {FORMAS_PONTOS.map((f, i) => (
                        <motion.button
                          key={f.t}
                          className="lj-forma"
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + i * 0.06 }}
                          whileHover={{ y: -6 }}
                          onClick={() => ir({ id: 'historico' })}
                          title="Ver meus pontos conquistados"
                        >
                          <motion.img src={f.img} alt="" whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }} transition={{ duration: 0.5 }} />
                          <span>{f.t}</span>
                        </motion.button>
                      ))}
                    </div>
                  )}
                  {b.itens && (
                    <ol className="lj-passos">
                      {b.itens.map(([a, d], i) => (
                        <motion.li key={a} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 + i * 0.06 }}>
                          <strong>{a}</strong>
                          <span>{d}</span>
                        </motion.li>
                      ))}
                    </ol>
                  )}
                  {b.texto && (
                    <ul className="lj-checks">
                      {b.texto.map((x, i) => (
                        <motion.li key={x} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 + i * 0.06 }}>
                          <Check size={18} strokeWidth={3} /> {x}
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              {t.importante && (
                <div className="lj-aviso">
                  <Info size={24} strokeWidth={1.8} />
                  <span>
                    <strong>Importante!</strong>
                    {t.importante}
                  </span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>
      </div>
    </div>
  )
}
