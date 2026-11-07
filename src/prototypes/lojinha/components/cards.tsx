import { motion } from 'framer-motion'
import { CircleCheck, Clock } from 'lucide-react'
import { CAT, type Item } from '../data'
import { useLoja } from '../store'
import { Btn, ItemArte, Pontos, Selo } from './ui'

/** card de item (grade da categoria e destaques da loja) */
export function ItemCard({ item, i = 0, variante = 'grade', de }: { item: Item; i?: number; variante?: 'grade' | 'destaque'; de?: string }) {
  const { ir, possui } = useLoja()
  const r = possui(item.id)
  const abrir = (resgatar?: boolean) => ir({ id: 'item', item: item.id, de: (de as never) ?? item.cat, resgatar })
  return (
    <motion.article
      layout
      className={`lj-card lj-card--${variante}`}
      onClick={() => abrir()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && abrir()}
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.15 } }}
      transition={{ delay: Math.min(i, 12) * 0.035, type: 'spring', stiffness: 320, damping: 28 }}
      whileHover={{ y: -5 }}
    >
      <div className="lj-card__arte">
        <ItemArte item={item} />
        <span className="lj-card__selo">
          <Selo r={item.raridade} />
        </span>
        {r && (
          <span className={`lj-card__meu ${r.status === 'processamento' ? 'is-proc' : ''}`}>
            {r.status === 'processamento' ? <Clock size={13} /> : <CircleCheck size={13} />}
            {r.status === 'processamento' ? 'Em processamento' : 'Resgatado'}
          </span>
        )}
      </div>
      <div className="lj-card__corpo">
        <strong className="lj-card__nome">{item.nome}</strong>
        {variante === 'destaque' && <small className="lj-card__cat">{CAT[item.cat].singular}</small>}
        <div className="lj-card__rod">
          <Pontos v={item.pontos} />
          <Btn
            tam="p"
            onClick={(e) => {
              e.stopPropagation()
              abrir(variante === 'destaque' && !r)
            }}
          >
            {variante === 'destaque' ? (r ? 'Ver item' : 'Resgatar') : 'Ver detalhes'}
          </Btn>
        </div>
      </div>
    </motion.article>
  )
}
