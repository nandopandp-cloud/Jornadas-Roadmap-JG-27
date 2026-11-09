import { motion } from 'framer-motion'
import { ArrowRight, Clock3, Compass, EyeOff, ListChecks, Map, RotateCcw, Save, Search, Sparkles, Signpost } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Barra, Brilhos, Btn, Modal } from '../components/ui'
import { DIM, DIMS, ITENS, N_ITENS, contar } from '../instrumento'
import { quando, useTv } from '../store'

/** Entrada da funcionalidade (PRD §5.2): finalidade, limites, duração e início */
export default function Entrada() {
  const { ir, iniciar, track, atual, ultima } = useTv()
  const [recomecar, setRecomecar] = useState(false)
  useEffect(() => track('career_test_entry_viewed', { origem: 'menu', interface: 'v1' }), [track])

  const respondidas = atual ? contar(atual.respostas) : 0
  const comecar = () => {
    iniciar()
    ir({ id: 'clareza' })
  }
  const continuar = () => {
    track('career_questionnaire_resumed', { etapa: ITENS[atual!.pos]?.bloco ?? 'A' })
    ir(atual!.clarezaPre === undefined ? { id: 'clareza' } : { id: 'questionario' })
  }

  const recursos = [
    { I: Compass, cor: 'roxo', t: 'Conheça seus interesses', d: 'Veja quais tipos de atividade despertam mais a sua vontade, em linguagem simples.' },
    { I: Map, cor: 'azul', t: 'Explore profissões', d: 'Receba possibilidades com o porquê de cada uma, incluindo carreiras que você talvez não conheça.' },
    { I: Signpost, cor: 'verde', t: 'Planeje próximos passos', d: 'Salve, compare e monte um plano com ações concretas para investigar seu futuro.' },
  ]

  return (
    <div className="tv-entrada">
      <section className="tv-entrada__hero">
        <motion.div className="tv-entrada__txt" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <span className="tv-sobre">Seu futuro · Teste Vocacional</span>
          <h1 className="tv-h1">Descubra seus interesses. Explore possibilidades. Construa seu próximo passo.</h1>
          <p>Responda perguntas sobre o que você gosta de fazer, o que é importante para você e como imagina seu trabalho. No final, você recebe um perfil com profissões para explorar.</p>
          <ul className="tv-fatos">
            <li>
              <Clock3 size={16} /> Cerca de 12 minutos
            </li>
            <li>
              <ListChecks size={16} /> {N_ITENS} perguntas em 4 etapas
            </li>
            <li>
              <Save size={16} /> Salva automaticamente
            </li>
          </ul>
        </motion.div>
        <HeroArte />
      </section>

      {atual && (
        <motion.section className="tv-cartao tv-retomar" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <span className="tv-retomar__ic">
            <img src="./voc/hourglass-not-done.webp" alt="" />
          </span>
          <div className="tv-retomar__txt">
            <strong>Continue de onde parou</strong>
            <span>
              Você respondeu {respondidas} de {N_ITENS} perguntas · começou {quando(atual.inicio).toLowerCase()}. Suas respostas estão salvas.
            </span>
            <Barra valor={(respondidas / N_ITENS) * 100} rotulo="Progresso do teste" />
          </div>
          <div className="tv-retomar__acoes">
            <Btn variante="fantasma" icone={<RotateCcw size={15} />} onClick={() => setRecomecar(true)}>
              Recomeçar
            </Btn>
            <Btn grande iconeDir={<ArrowRight size={17} />} onClick={continuar}>
              Continuar teste
            </Btn>
          </div>
        </motion.section>
      )}

      <div className="tv-recursos">
        {recursos.map(({ I, cor, t, d }, i) => (
          <motion.div key={t} className="tv-cartao tv-recurso" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07 }} whileHover={{ y: -3 }}>
            <span className={`tv-recurso__ic tv-recurso__ic--${cor}`}>
              <I size={26} strokeWidth={2} />
            </span>
            <strong>{t}</strong>
            <p>{d}</p>
          </motion.div>
        ))}
      </div>

      <motion.section className="tv-saiba" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="tv-h2">Antes de começar, saiba que</h2>
        <ul>
          <li>
            <Sparkles size={18} />
            <span>
              <strong>Não existe resposta certa ou errada.</strong> Responda pensando no que você gosta, não no que esperam de você.
            </span>
          </li>
          <li>
            <Compass size={18} />
            <span>
              <strong>O resultado é um ponto de partida, não uma decisão.</strong> Ele mostra possibilidades para investigar, nunca uma profissão ideal.
            </span>
          </li>
          <li>
            <EyeOff size={18} />
            <span>
              <strong>Só você vê suas respostas.</strong> Elas não viram nota, não são compartilhadas com colegas e não limitam nada na escola.
            </span>
          </li>
          <li>
            <Map size={18} />
            <span>
              <strong>Não é um teste psicológico nem de aptidão.</strong> Ele organiza seus interesses; não mede inteligência nem capacidade.
            </span>
          </li>
        </ul>
      </motion.section>

      {!atual && (
        <motion.div className="tv-entrada__cta" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }}>
          <Btn grande iconeDir={<ArrowRight size={18} />} onClick={comecar}>
            {ultima ? 'Fazer o teste novamente' : 'Começar o teste'}
          </Btn>
          <button className="tv-link tv-link--seta" onClick={() => ir({ id: 'explorar' })}>
            <Search size={15} /> Já tem uma profissão em mente? Explore o catálogo
          </button>
        </motion.div>
      )}
      {ultima && !atual && (
        <p className="tv-entrada__nota">
          Seu último resultado é de {quando(ultima.fim!).toLowerCase()}. Ao refazer, ele continua guardado em <button className="tv-link" onClick={() => ir({ id: 'historico' })}>Minha jornada</button>.
        </p>
      )}

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
                comecar()
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

/** bússola com as seis áreas de interesse orbitando */
function HeroArte() {
  return (
    <div className="tv-heroarte" aria-hidden>
      <Brilhos n={6} />
      <motion.span className="tv-heroarte__disco" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 160, damping: 16 }} />
      <motion.img className="tv-heroarte__bussola" src="./voc/compass.webp" alt="" initial={{ scale: 0.4, rotate: -40 }} animate={{ scale: 1, rotate: [0, 10, -8, 0] }} transition={{ scale: { type: 'spring', stiffness: 180, damping: 14 }, rotate: { duration: 7, repeat: Infinity, ease: 'easeInOut' } }} />
      <motion.div className="tv-heroarte__orbita" animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}>
        {DIMS.map((d, i) => (
          <span key={d} className="tv-heroarte__dim" style={{ transform: `rotate(${i * 60}deg) translateY(-118px) rotate(${-i * 60}deg)`, background: DIM[d].claro, borderColor: DIM[d].cor, animationDelay: `${0.25 + i * 0.08}s` }}>
            <motion.img src={DIM[d].icone} alt="" animate={{ rotate: -360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }} />
          </span>
        ))}
      </motion.div>
    </div>
  )
}
