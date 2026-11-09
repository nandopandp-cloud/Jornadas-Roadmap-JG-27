import { motion } from 'framer-motion'
import { ArrowRight, BarChart3, BrainCircuit, Clock3, Compass, History, RotateCcw, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ClarezaInicial } from '../components/clareza'
import { Barra, Btn, Etiqueta, Modal } from '../components/ui'
import { ITENS, N_ITENS, contar } from '../instrumento'
import { quando, useTv } from '../store'

/** Abertura do Teste Vocacional (Frame 3 · PRD §5.2 e §5.3) */
export default function Entrada({ clareza }: { clareza?: boolean }) {
  const { ir, iniciar, setClarezaPre, track, atual, ultima } = useTv()
  const [modal, setModal] = useState(!!clareza)
  const [recomecar, setRecomecar] = useState(false)
  useEffect(() => track('career_test_entry_viewed', { origem: 'menu', interface: 'v1' }), [track])
  const respondidas = atual ? contar(atual.respostas) : 0

  const comecar = (v: number | null) => {
    setModal(false)
    iniciar()
    setClarezaPre(v)
    ir({ id: 'questionario' })
  }
  const continuar = () => {
    track('career_questionnaire_resumed', { etapa: ITENS[atual!.pos]?.bloco ?? 'A' })
    ir({ id: 'questionario' })
  }

  const beneficios = [
    { I: BrainCircuit, cor: 'roxo', t: 'Baseado em metodologias científicas', d: 'Utiliza o modelo RIASEC e análise de competências, valores e preferências de trabalho.' },
    { I: Clock3, cor: 'verde', t: 'Leva cerca de 15 minutos', d: `São ${N_ITENS} perguntas objetivas e intuitivas.` },
    { I: BarChart3, cor: 'azul', t: 'Resultados personalizados', d: 'Você receberá um relatório completo com seu perfil e profissões recomendadas.' },
    { I: Compass, cor: 'amarelo', t: 'Mais clareza para o seu futuro', d: 'Use os resultados para explorar conteúdos, universidades e construir seu plano na Geniex.' },
  ]

  return (
    <div className="tv-abertura">
      <div className="tv-abertura__txt">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Etiqueta />
          <h1 className="tv-h1">
            Descubra caminhos
            <br />
            que combinam com você
          </h1>
          <p className="tv-lead">O teste vocacional da Geniex foi desenvolvido para te ajudar a entender melhor seus interesses, habilidades e valores, e apresentar profissões que fazem sentido com o seu perfil.</p>
        </motion.div>

        <ul className="tv-benef">
          {beneficios.map(({ I, cor, t, d }, i) => (
            <motion.li key={t} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 + i * 0.07 }}>
              <span className={`tv-benef__ic tv-benef__ic--${cor}`}>
                <I size={26} strokeWidth={1.8} />
              </span>
              <span>
                <strong>{t}</strong>
                <small>{d}</small>
              </span>
            </motion.li>
          ))}
        </ul>

        {atual ? (
          <motion.div className="tv-retomar" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="tv-retomar__txt">
              <strong>Continue de onde parou</strong>
              <span>
                {respondidas} de {N_ITENS} perguntas respondidas · começou {quando(atual.inicio).toLowerCase()}
              </span>
              <Barra valor={(respondidas / N_ITENS) * 100} rotulo="Progresso do teste" />
            </div>
            <div className="tv-retomar__acoes">
              <Btn grande iconeDir={<ArrowRight size={19} />} onClick={continuar}>
                Continuar teste
              </Btn>
              <button className="tv-link" onClick={() => setRecomecar(true)}>
                <RotateCcw size={14} /> Recomeçar do zero
              </button>
            </div>
          </motion.div>
        ) : ultima ? (
          <div className="tv-abertura__ctas">
            <Btn grande iconeDir={<ArrowRight size={19} />} onClick={() => ir({ id: 'relatorio' })}>
              Ver meu resultado
            </Btn>
            <Btn grande variante="claro" icone={<RotateCcw size={17} />} onClick={() => setModal(true)}>
              Refazer o teste
            </Btn>
            <button className="tv-link" onClick={() => ir({ id: 'historico' })}>
              <History size={14} /> Histórico de testes
            </button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }}>
            <Btn grande className="tv-abertura__cta" iconeDir={<ArrowRight size={20} />} onClick={() => setModal(true)}>
              Começar teste agora
            </Btn>
          </motion.div>
        )}

        <p className="tv-abertura__nota">
          <ShieldCheck size={20} strokeWidth={1.6} />
          Suas respostas são confidenciais e utilizadas apenas para gerar seus resultados. Este não é um teste clínico ou diagnóstico psicológico.
        </p>
      </div>

      <motion.div className="tv-abertura__arte" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, type: 'spring', stiffness: 160, damping: 20 }}>
        <img src="./voc/ref/abertura.webp" alt="Estudante sorrindo, cercada por cartões: seus interesses, seus valores, suas habilidades e seu estilo de trabalho" />
        <button className="tv-abertura__profs" onClick={() => ir({ id: 'explorar' })} aria-label="Profissões que combinam com o seu perfil: explorar profissões" />
      </motion.div>

      <ClarezaInicial aberto={modal} onFechar={() => setModal(false)} onContinuar={comecar} />
      <Modal
        aberto={recomecar}
        onFechar={() => setRecomecar(false)}
        titulo="Recomeçar do zero?"
        rodape={
          <>
            <Btn variante="contorno" onClick={() => setRecomecar(false)}>
              Cancelar
            </Btn>
            <Btn
              onClick={() => {
                setRecomecar(false)
                setModal(true)
              }}
            >
              Recomeçar
            </Btn>
          </>
        }
      >
        <p className="tv-texto">As {respondidas} respostas desta tentativa serão descartadas e você começa uma nova. Resultados de testes já concluídos continuam guardados.</p>
      </Modal>
    </div>
  )
}
