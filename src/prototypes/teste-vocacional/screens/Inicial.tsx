import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { CARREIRA } from '../carreiras'
import { CardProf } from '../components/perfil'
import { Barra, Btn, Etiqueta } from '../components/ui'
import { N_ITENS, contar } from '../instrumento'
import { useTv } from '../store'

/** Início da GenieX com o ponto de entrada do Teste Vocacional (PRD §5.2) */
export default function Inicial() {
  const { ir, ultima, atual } = useTv()
  const curiosas = ['oceanografia', 'design-ux', 'gestao-publica', 'pesquisa-cientifica'].map((id) => CARREIRA[id])
  const n = atual ? contar(atual.respostas) : 0
  return (
    <div className="tv-ini">
      <section className="tv-ini__boas">
        <h1 className="tv-h1 tv-h1--m">Olá, João! 👋</h1>
        <p className="tv-lead">Que tal dar um passo a mais na construção do seu futuro hoje?</p>
      </section>

      <motion.section className="tv-ini__promo" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="tv-ini__promotxt">
          <Etiqueta>Novo · Teste vocacional</Etiqueta>
          <h2>{ultima && !atual ? 'Seu perfil profissional está pronto' : atual ? 'Continue de onde parou' : 'Descubra caminhos que combinam com você'}</h2>
          <p>
            {ultima && !atual
              ? 'Revise suas áreas de interesse, conheça as profissões recomendadas e siga seus próximos passos.'
              : atual
                ? `Você respondeu ${n} de ${N_ITENS} perguntas. Suas respostas estão salvas.`
                : 'Entenda seus interesses, valores e habilidades e conheça profissões que fazem sentido com o seu perfil. Cerca de 15 minutos.'}
          </p>
          {atual && <Barra valor={(n / N_ITENS) * 100} rotulo="Progresso do teste" />}
          <Btn grande iconeDir={<ArrowRight size={18} />} onClick={() => ir(ultima && !atual ? { id: 'relatorio' } : atual ? { id: 'questionario' } : { id: 'entrada' })}>
            {ultima && !atual ? 'Ver meu resultado' : atual ? 'Continuar teste' : 'Conhecer o teste'}
          </Btn>
        </div>
        <img src="./voc/ref/banner-visao.webp" alt="" />
      </motion.section>

      <section className="tv-ini__sec">
        <div className="tv-card__cab">
          <div>
            <h2>Profissões que talvez você não conheça</h2>
            <p>Amplie seu repertório: explore carreiras além das mais lembradas.</p>
          </div>
          <button className="tv-link tv-link--seta" onClick={() => ir({ id: 'explorar' })}>
            Explorar profissões <ArrowRight size={15} />
          </button>
        </div>
        <div className="tv-faixa tv-faixa--4">
          {curiosas.map((c, i) => (
            <CardProf key={c.id} c={c} indice={i} compacto onAbrir={() => ir({ id: 'carreira', carreira: c.id, de: 'explorar' })} />
          ))}
        </div>
      </section>

    </div>
  )
}
