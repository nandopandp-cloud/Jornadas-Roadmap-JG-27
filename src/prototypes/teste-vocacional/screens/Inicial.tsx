import { motion } from 'framer-motion'
import { ArrowRight, Search } from 'lucide-react'
import { useEffect } from 'react'
import { CARREIRA } from '../carreiras'
import { N_ITENS, contar } from '../instrumento'
import { Barra, Brilhos, Btn } from '../components/ui'
import { useTv } from '../store'

/** Página Inicial da GenieX, com o ponto de entrada do Teste Vocacional (PRD §5.2) */
export default function Inicial() {
  const { ir, toast, track, ultima, atual } = useTv()
  useEffect(() => track('career_test_entry_viewed', { origem: 'pagina_inicial', interface: 'v1' }), [track])
  const curiosas = ['oceanografia', 'design-ux', 'gestao-publica'].map((id) => CARREIRA[id])

  return (
    <div className="tv-ini">
      <section className="tv-ini__para">
        <h2 className="tv-h2g">Para você</h2>
        <motion.div className="tv-banner" whileHover={{ scale: 1.006 }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <img src="./flash/banner.webp" alt="GenieX — Aprenda. Jogue. Evolua sempre." />
        </motion.div>
      </section>

      <section className="tv-ini__voc">
        <h2 className="tv-h2g">Seu futuro</h2>
        <motion.div className="tv-cartao tv-promo" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <div className="tv-promo__txt">
            <span className="tv-promo__tag">Novo · Teste Vocacional</span>
            <strong>{ultima ? 'Seu perfil está pronto' : atual ? 'Continue de onde parou' : 'Descubra caminhos para explorar'}</strong>
            <p>
              {ultima
                ? 'Revise seus interesses, conheça profissões e siga seu plano de exploração.'
                : atual
                  ? `Você respondeu ${contar(atual.respostas)} de ${N_ITENS} perguntas. Suas respostas estão salvas.`
                  : 'Conheça seus interesses e profissões que combinam com eles. Sem resposta certa ou errada.'}
            </p>
            <Btn onClick={() => ir(ultima ? { id: 'relatorio' } : { id: 'entrada' })}>{ultima ? 'Ver meu perfil' : atual ? 'Continuar teste' : 'Conhecer o teste'}</Btn>
          </div>
          <div className="tv-promo__arte" aria-hidden>
            <Brilhos n={5} />
            <motion.img src="./voc/compass.webp" alt="" animate={{ rotate: [0, 8, -6, 0], y: [0, -6, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
          </div>
        </motion.div>
      </section>

      <section className="tv-ini__curso">
        <h2 className="tv-h2g">Continue aprendendo</h2>
        <motion.div className="tv-cartao tv-curso" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="tv-curso__img">
            <img src="./flash/livro-curso.webp" alt="" />
          </div>
          <div className="tv-curso__txt">
            <span className="tv-curso__tag">Curso</span>
            <strong>Literatura - Ensino Médio</strong>
            <p>Amplie a leitura e a interpretação de textos literários, compreendendo diferentes estilos, linguagens e contextos históricos.</p>
            <div className="tv-curso__prog">
              <Barra valor={7} />
              <span>7%</span>
            </div>
            <Btn bloco grande onClick={() => toast('O curso completo não faz parte deste protótipo.', 'info')}>
              Ir para o curso
            </Btn>
          </div>
        </motion.div>
      </section>

      <section className="tv-ini__curiosas">
        <h2 className="tv-h2g">Profissões que talvez você não conheça</h2>
        <motion.div className="tv-cartao tv-curiosas" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          {curiosas.map((c) => (
            <button key={c.id} className="tv-curiosa" onClick={() => ir({ id: 'carreira', carreira: c.id, de: 'explorar' })}>
              <img src={c.icone} alt="" />
              <span>
                <strong>{c.nome}</strong>
                <small>{c.descricao.split(/\.\s/)[0].replace(/\.$/, '')}.</small>
              </span>
              <ArrowRight size={16} />
            </button>
          ))}
          <button className="tv-curiosas__mais" onClick={() => ir({ id: 'explorar' })}>
            <Search size={15} /> Explorar todas as profissões
          </button>
        </motion.div>
      </section>
    </div>
  )
}
