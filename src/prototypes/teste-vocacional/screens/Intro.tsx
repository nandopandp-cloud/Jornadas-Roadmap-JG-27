import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, TriangleAlert } from 'lucide-react'
import { Btn, Voltar } from '../components/ui'
import { BLOCO, BLOCOS, N_ITENS, VERSAO_INSTRUMENTO } from '../instrumento'
import { useTv } from '../store'
import { Passos } from './Clareza'

/** Introdução ao teste: etapas, como as respostas são usadas e limites (PRD §5.1 item 3 e Princípio 7) */
export default function Intro() {
  const { ir } = useTv()
  return (
    <div className="tv-foco">
      <Voltar texto="Teste Vocacional" onClick={() => ir({ id: 'clareza' }, -1)} />
      <Passos atual={1} />
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
        <span className="tv-sobre">Como funciona</span>
        <h1 className="tv-h1 tv-h1--m">São 4 etapas curtas, uma pergunta por vez</h1>
        <p className="tv-texto tv-texto--suave tv-intro__lead">
          {N_ITENS} perguntas no total, cerca de 12 minutos. Você pode voltar, revisar e pausar quando quiser: tudo fica salvo.
        </p>
      </motion.div>

      <ol className="tv-etapas">
        {BLOCOS.map((b, i) => (
          <motion.li key={b} className="tv-cartao tv-etapa" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.07 }}>
            <span className="tv-etapa__n">{i + 1}</span>
            <img src={BLOCO[b].icone} alt="" />
            <strong>{BLOCO[b].nome}</strong>
            <span>{BLOCO[b].titulo}</span>
            <small>{BLOCO[b].resumo}</small>
          </motion.li>
        ))}
      </ol>

      <div className="tv-intro__info">
        <motion.section className="tv-cartao tv-info" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }}>
          <h2>
            <ShieldCheck size={18} /> Como usamos suas respostas
          </h2>
          <ul>
            <li>Para calcular seu perfil de interesses e sugerir profissões, com a explicação de cada sugestão.</li>
            <li>Seu resultado é só seu: não aparece para colegas, não vira nota e não limita cursos ou atividades na escola.</li>
            <li>Para melhorar o teste, usamos apenas dados agregados, sem seu nome.</li>
          </ul>
        </motion.section>
        <motion.section className="tv-cartao tv-info tv-info--limite" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}>
          <h2>
            <TriangleAlert size={18} /> O que o teste não faz
          </h2>
          <ul>
            <li>Não diz qual profissão você deve seguir nem garante sucesso, emprego ou salário.</li>
            <li>Não mede inteligência, personalidade ou aptidão. Interesse e habilidade são coisas diferentes.</li>
            <li>Não substitui uma conversa com orientadores e pessoas de confiança.</li>
          </ul>
        </motion.section>
      </div>

      <div className="tv-intro__rodape">
        <small className="tv-versao">Instrumento {VERSAO_INSTRUMENTO}</small>
        <Btn grande iconeDir={<ArrowRight size={17} />} onClick={() => ir({ id: 'questionario', capa: 'A' })}>
          Começar a etapa 1
        </Btn>
      </div>
    </div>
  )
}
