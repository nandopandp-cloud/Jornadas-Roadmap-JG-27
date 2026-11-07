import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { ItemCard } from '../components/cards'
import { Estrelas } from '../components/ui'
import { CATEGORIAS, DESTAQUES, ITEM } from '../data'
import { useLoja } from '../store'

/** Loja — início */
export default function Loja() {
  const { ir } = useLoja()
  return (
    <div className="lj-loja">
      <motion.section className="lj-banner lj-banner--loja" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} onClick={() => ir({ id: 'categoria', cat: 'avatares' })} role="button" aria-label="Ver novos avatares">
        <img className="lj-banner__img" src="./loja/banner-loja.webp" alt="" />
        <Estrelas n={4} className="lj-estrelas--banner" />
        <div className="lj-banner__txt">
          <motion.span className="lj-novidade" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.25, type: 'spring', stiffness: 400, damping: 14 }}>
            <img src="./loja/chama.webp" alt="" /> Novidade!
          </motion.span>
          <motion.h2 initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            Bem-vindo(a) à Lojinha!
          </motion.h2>
          <motion.p initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.18 }}>
            Use seus pontos, desbloqueie itens exclusivos <br />e evolua ainda mais na sua jornada.
          </motion.p>
        </div>
      </motion.section>

      <section className="lj-secao">
        <div className="lj-secao__cab">
          <h2>Explore por categoria</h2>
          <button className="lj-link" onClick={() => ir({ id: 'categoria', cat: 'todos' })}>
            Ver todas <ArrowRight size={17} />
          </button>
        </div>
        <div className="lj-cats">
          {CATEGORIAS.map((c, i) => (
            <motion.button
              key={c.id}
              className={`lj-cat ${i === 0 ? 'is-on' : ''}`}
              onClick={() => ir({ id: 'categoria', cat: c.id })}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.05 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.96 }}
            >
              <span className="lj-cat__img">
                <img src={c.img} alt="" />
              </span>
              <strong>{c.nome}</strong>
            </motion.button>
          ))}
        </div>
      </section>

      <section className="lj-secao">
        <div className="lj-secao__cab">
          <h2>Destaques da lojinha</h2>
          <button className="lj-link" onClick={() => ir({ id: 'categoria', cat: 'todos' })}>
            Ver todos os itens <ArrowRight size={17} />
          </button>
        </div>
        <div className="lj-destaques">
          {DESTAQUES.map((id, i) => (
            <ItemCard key={id} item={ITEM[id]} i={i} variante="destaque" />
          ))}
        </div>
      </section>
    </div>
  )
}
