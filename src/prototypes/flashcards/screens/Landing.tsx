import { motion } from 'framer-motion'
import { BookOpen, ChevronRight, Star, Zap } from 'lucide-react'
import { Btn } from '../components/ui'
import { useFx } from '../store'

/** Entrada da funcionalidade Flashcards */
export default function Landing() {
  const { s, ir } = useFx()
  const nFav = Object.keys(s.favoritos).length
  const recursos = [
    { I: Zap, cor: 'roxo', t: 'Aprenda no seu ritmo', d: 'Reforce seus conhecimentos com perguntas e respostas rápidas.' },
    { I: BookOpen, cor: 'azul', t: 'Escolha suas disciplinas', d: 'Crie grupos de flashcards com os conteúdos que você precisa revisar.' },
    { I: Star, cor: 'amarelo', t: 'Salve o que é importante', d: 'Favorite os cards mais relevantes para acessar quando quiser.' },
  ]
  return (
    <div className="fx-landing">
      <section className="fx-landing__topo">
        <div className="fx-landing__cab">
          <motion.div className="fx-landing__txt" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="fx-h1">Flashcards</h1>
            <h2>Revise conteúdos de forma rápida e eficiente</h2>
            <p>Crie grupos de flashcards personalizados com os cursos e disciplinas que você quer estudar.</p>
          </motion.div>
          <motion.img
            className="fx-landing__hero"
            src="./flash/hero-cartas.webp"
            alt=""
            initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0, y: [0, -8, 0] }}
            transition={{ opacity: { duration: 0.4 }, scale: { type: 'spring', stiffness: 200, damping: 16 }, y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.6 } }}
          />
        </div>

        <div className="fx-recursos">
          {recursos.map(({ I, cor, t, d }, i) => (
            <motion.div key={t} className="fx-cartao fx-recurso" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + i * 0.07 }} whileHover={{ y: -3 }}>
              <span className={`fx-recurso__ic fx-recurso__ic--${cor}`}>
                <I size={29} strokeWidth={cor === 'azul' ? 2 : 0} fill="currentColor" />
              </span>
              <strong>{t}</strong>
              <p>{d}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }}>
          <Btn bloco grande className="fx-landing__criar" onClick={() => ir({ id: 'disciplinas' })}>
            Criar flashcards
          </Btn>
        </motion.div>
      </section>

      <section className="fx-landing__acessos">
        <h2 className="fx-h2">Meus acessos</h2>
        <div className="fx-acessos">
          {[
            { I: Star, t: 'Meus grupos', d: s.grupos.length ? `Acesse os flashcards que você já criou.` : 'Você ainda não criou grupos.', n: s.grupos.length, fn: () => ir({ id: 'home', aba: 'grupos' }) },
            { I: Star, t: 'Meus favoritos', d: 'Veja os flashcards que você salvou.', n: nFav, fn: () => ir({ id: 'home', aba: 'favoritos' }) },
          ].map(({ I, t, d, n, fn }, i) => (
            <motion.button key={t} className="fx-cartao fx-acesso" onClick={fn} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 + i * 0.07 }} whileHover={{ y: -3 }}>
              <span className="fx-acesso__ic">
                {i === 0 ? <IconeGrupos /> : <I size={39} strokeWidth={0} fill="currentColor" />}
                {n > 0 && <em>{n}</em>}
              </span>
              <span className="fx-acesso__txt">
                <strong>{t}</strong>
                <span>{d}</span>
              </span>
              <span className="fx-acesso__seta">
                <ChevronRight size={17} />
              </span>
            </motion.button>
          ))}
        </div>
      </section>
    </div>
  )
}

/** três cards empilhados (ícone “Meus grupos” da referência) */
function IconeGrupos() {
  return (
    <svg width="40" height="40" viewBox="0 0 48 48" aria-hidden>
      <rect x="17" y="5" width="25" height="25" rx="5" fill="#8f86f8" />
      <rect x="11.5" y="11" width="25" height="25" rx="5" fill="#6f61f3" stroke="#f0eefc" strokeWidth="2" />
      <rect x="6" y="17" width="25" height="25" rx="5" fill="#5039ec" stroke="#f0eefc" strokeWidth="2" />
    </svg>
  )
}
