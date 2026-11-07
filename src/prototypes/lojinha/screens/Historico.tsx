import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, CreditCard, Gift, Info, Plus, RotateCcw, Star } from 'lucide-react'
import { useState } from 'react'
import { Btn, Contador, Estrelas, Select } from '../components/ui'
import { HOJE, dataCurta, fmt, type TipoMov } from '../data'
import { useLoja } from '../store'

const ICONE: Record<TipoMov, typeof Plus> = { ganho: Plus, bonus: Star, resgate: Gift, estorno: RotateCcw }

/** Histórico de pontos */
export default function Historico() {
  const { s } = useLoja()
  const [tipo, setTipo] = useState<'todas' | TipoMov>('todas')
  const [periodo, setPeriodo] = useState<'7' | '30' | '90' | 'tudo'>('30')
  const [limite, setLimite] = useState(6)
  const lista = s.movs
    .filter((m) => tipo === 'todas' || m.tipo === tipo)
    .filter((m) => periodo === 'tudo' || m.data >= HOJE - Number(periodo) * 86_400_000)
    .sort((a, b) => b.data - a.data)
  const entradas = lista.filter((m) => m.valor > 0).reduce((a, m) => a + m.valor, 0)
  const saidas = lista.filter((m) => m.valor < 0).reduce((a, m) => a + m.valor, 0)

  return (
    <div className="lj-hist">
      <Banner img="./loja/banner-historico.webp" titulo="Histórico de pontos" texto={['Acompanhe todas as movimentações da sua', 'carteira de pontos na Lojinha.']} />
      <div className="lj-hist__grade">
        <section className="lj-painel lj-hist__lista">
          <div className="lj-hist__filtros">
            <Select
              className="lj-select--forte"
              rotulo="Tipo de movimentação"
              valor={tipo}
              onChange={(v) => {
                setTipo(v)
                setLimite(6)
              }}
              opcoes={[
                { valor: 'todas', texto: 'Todas as movimentações' },
                { valor: 'ganho', texto: 'Pontos conquistados' },
                { valor: 'bonus', texto: 'Pontos de bônus' },
                { valor: 'resgate', texto: 'Resgates' },
                { valor: 'estorno', texto: 'Estornos' },
              ]}
            />
            <Select
              className="lj-select--periodo"
              icone={<CalendarDays size={18} />}
              rotulo="Período"
              valor={periodo}
              onChange={(v) => {
                setPeriodo(v)
                setLimite(6)
              }}
              opcoes={[
                { valor: '7', texto: 'Últimos 7 dias' },
                { valor: '30', texto: 'Últimos 30 dias' },
                { valor: '90', texto: 'Últimos 90 dias' },
                { valor: 'tudo', texto: 'Todo o período' },
              ]}
            />
          </div>
          <div className="lj-hist__resumo">
            <span className="is-mais">+{fmt(entradas)} pts entraram</span>
            <span className="is-menos">−{fmt(Math.abs(saidas))} pts saíram</span>
          </div>
          <ul className="lj-movs">
            <AnimatePresence initial={false} mode="popLayout">
              {lista.slice(0, limite).map((m, i) => {
                const I = ICONE[m.tipo]
                return (
                  <motion.li key={m.id} layout className={`lj-mov lj-mov--${m.tipo}`} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} transition={{ delay: Math.min(i, 8) * 0.04 }}>
                    <span className="lj-mov__ic">
                      <I size={19} strokeWidth={m.tipo === 'ganho' ? 3.4 : 2} />
                    </span>
                    <span className="lj-mov__txt">
                      <strong>{m.titulo}</strong>
                      <small>{m.desc}</small>
                    </span>
                    <span className="lj-mov__data">{dataCurta(m.data)}</span>
                    <strong className={`lj-mov__valor ${m.valor < 0 ? 'is-neg' : ''}`}>
                      {m.valor > 0 ? '+' : '-'}
                      {fmt(Math.abs(m.valor))} pts
                    </strong>
                  </motion.li>
                )
              })}
            </AnimatePresence>
          </ul>
          {!lista.length && <p className="lj-vazio">Nenhuma movimentação nesse período.</p>}
          {lista.length > limite && (
            <Btn variante="fantasma" bloco onClick={() => setLimite((l) => l + 6)}>
              Ver mais movimentações ({lista.length - limite})
            </Btn>
          )}
        </section>

        <aside className="lj-hist__lado">
          <section className="lj-saldo-card lj-saldo-card--p">
            <h3>Seu saldo atual</h3>
            <div className="lj-saldo-card__caixa">
              <img className="lj-saldo-card__gema" src="./loja/gema.webp" alt="" />
              <strong>
                <Contador v={s.pontos} /> <small>pts</small>
              </strong>
              <motion.img className="lj-saldo-card__moedas" src="./loja/moedas.webp" alt="" animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />
            </div>
          </section>
          <section className="lj-importante">
            <h3>
              <Info size={22} strokeWidth={1.9} /> Importante!
            </h3>
            <p>Aqui você vê todas as entradas e saídas de pontos da sua Lojinha, como pontos conquistados, bônus, resgates e estornos.</p>
            <CreditCard className="lj-importante__ic" size={71} strokeWidth={1.2} />
          </section>
        </aside>
      </div>
    </div>
  )
}

/** banner roxo com arte da referência e texto em HTML */
export function Banner({ img, titulo, texto, textoEsq = 0 }: { img: string; titulo: string; texto: string[]; textoEsq?: number }) {
  return (
    <motion.section className="lj-banner" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
      <img className="lj-banner__img" src={img} alt="" />
      <Estrelas n={3} className="lj-estrelas--banner" />
      <div className="lj-banner__txt" style={textoEsq ? { left: textoEsq } : undefined}>
        <motion.h2 initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          {titulo}
        </motion.h2>
        <motion.p initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.18 }}>
          {texto[0]}
          {texto[1] && (
            <>
              {' '}
              <br />
              {texto[1]}
            </>
          )}
        </motion.p>
      </div>
    </motion.section>
  )
}
