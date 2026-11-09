import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, CircleCheck, Lightbulb, LogOut } from 'lucide-react'
import { useState } from 'react'
import { EscalaClareza } from '../components/clareza'
import { Barra, Btn, Etiqueta } from '../components/ui'
import { BLOCOS, N_ITENS, itensDo } from '../instrumento'
import { useTv } from '../store'

const ETAPAS = ['Seus interesses', 'Seus valores', 'Preferências', 'Suas habilidades']

/** Clareza inicial (PRD §5.3), no mesmo padrão das telas de pergunta (Frames 2 e 1) */
export default function Clareza({ onSair }: { onSair: () => void }) {
  const { atual, ir, iniciar, setClarezaPre } = useTv()
  const [v, setV] = useState<number | null>(atual?.clarezaPre ?? null)
  const seguir = (valor: number | null) => {
    if (!atual) iniciar()
    setClarezaPre(valor)
    ir({ id: 'questionario' })
  }
  return (
    <div className="tv-quest">
      <div className="tv-quest__topo">
        <button className="tv-voltar" onClick={() => ir({ id: 'entrada' }, -1)}>
          <ArrowLeft size={20} /> Voltar
        </button>
        <button className="tv-voltar" onClick={onSair}>
          <LogOut size={19} /> Sair do teste
        </button>
      </div>

      <ol className="tv-etapas" aria-label="Etapas do teste">
        {[...BLOCOS.map((b, i) => ({ n: i + 1, nome: ETAPAS[i], sub: `${itensDo(b).filter((x) => x.id !== 'H-DEV').length} perguntas` })), { n: 5, nome: 'Resultado', sub: 'Seu perfil' }].map((x) => (
          <li key={x.n}>
            <span className="tv-etapas__n">{x.n}</span>
            <span className="tv-etapas__txt">
              <strong>{x.nome}</strong>
              <small>{x.sub}</small>
            </span>
          </li>
        ))}
      </ol>
      <div className="tv-quest__barra">
        <Barra valor={0} rotulo="Progresso do teste" />
        <span>0 de {N_ITENS}</span>
      </div>

      <div className="tv-quest__grade">
        <div className="tv-quest__principal">
          <Etiqueta />
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="tv-h1 tv-h1--q">Antes de começar, como você se sente hoje?</h1>
            <p className="tv-lead">Uma pergunta rápida e opcional. Vamos fazer a mesma no final para você perceber se a experiência ajudou.</p>
          </motion.div>
          <motion.section className="tv-qcard" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 34 }}>
            <div className="tv-qcard__chips">
              <span className="tv-qcard__n">Pergunta inicial</span>
              <span className="tv-qcard__bloco">Sua clareza sobre o futuro</span>
            </div>
            <div className="tv-qcard__meio">
              <h2 className="tv-qcard__txt">Quanto você sente que sabe quais caminhos profissionais gostaria de explorar?</h2>
              <img src="./voc/ref/q-valores.webp" alt="" className="tv-qcard__arte" />
            </div>
            <EscalaClareza valor={v} onChange={setV} />
          </motion.section>
        </div>

        <aside className="tv-quest__lado">
          <div className="tv-ajuda">
            <span className="tv-ajuda__ic">
              <Lightbulb size={26} strokeWidth={1.7} />
            </span>
            <div>
              <strong>Por que perguntamos isso?</strong>
              <p>Não existe nível certo. Muita gente começa sem clareza nenhuma, e tudo bem.</p>
              <p>Esta resposta não muda as profissões recomendadas para você. Ela só nos ajuda a entender se o teste está sendo útil.</p>
            </div>
          </div>
          <div className="tv-progbloco">
            <strong>O que vem a seguir</strong>
            <ul className="tv-proximo">
              {ETAPAS.map((e, i) => (
                <li key={e}>
                  <span>{i + 1}</span>
                  {e}
                </li>
              ))}
              <li>
                <span>
                  <Check size={13} strokeWidth={3} />
                </span>
                Seu resultado personalizado
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <div className="tv-quest__rodape">
        <Btn grande variante="claro" onClick={() => seguir(null)}>
          Prefiro pular esta pergunta
        </Btn>
        <div className="tv-quest__prox">
          <Btn grande iconeDir={<ArrowRight size={19} />} disabled={v === null} onClick={() => seguir(v)}>
            Começar o teste
          </Btn>
          <small>
            <CircleCheck size={13} /> Suas respostas são salvas automaticamente
          </small>
        </div>
      </div>
    </div>
  )
}
