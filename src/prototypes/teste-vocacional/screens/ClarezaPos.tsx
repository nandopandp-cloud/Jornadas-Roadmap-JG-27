import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { useState } from 'react'
import { Brilhos, Btn, Voltar } from '../components/ui'
import { CLAREZA, CLAREZA_PERGUNTA } from '../instrumento'
import { HOJE } from '../dados'
import { useTv } from '../store'
import { EscalaClareza } from './Clareza'

const RELEVANCIA = ['Nada', 'Pouco', 'Mais ou menos', 'Bastante', 'Muito']

/** Como você se sente agora? (PRD §5.12): mesma escala, opcional, nunca bloqueia o relatório */
export default function ClarezaPos() {
  const { ultima, ir, enviarClarezaPos } = useTv()
  const [v, setV] = useState<number | null>(ultima?.clarezaPos?.valor ?? null)
  const [desc, setDesc] = useState<'sim' | 'nao' | 'talvez' | null>(ultima?.clarezaPos?.descobriu ?? null)
  const [rel, setRel] = useState<number | null>(ultima?.clarezaPos?.relevancia ?? null)
  const [enviado, setEnviado] = useState(false)
  if (!ultima) return null
  const pre = ultima.clarezaPre ?? null

  if (enviado && v) {
    const dif = pre ? v - pre : null
    return (
      <div className="tv-foco tv-pos-ok">
        <motion.div className="tv-cartao tv-pos-ok__caixa" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Brilhos n={6} />
          <motion.img src={CLAREZA[v - 1].emoji} alt="" initial={{ scale: 0.3, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 12 }} />
          <h1 className="tv-h1 tv-h1--m">Obrigado por responder!</h1>
          {pre ? (
            <div className="tv-pos-ok__evol">
              <span>
                <small>No início</small>
                <b>{pre}</b>
                {CLAREZA[pre - 1].texto}
              </span>
              <ArrowRight size={22} />
              <span className="is-on">
                <small>Agora</small>
                <b>{v}</b>
                {CLAREZA[v - 1].texto}
              </span>
            </div>
          ) : (
            <p className="tv-texto">Hoje você está em: {CLAREZA[v - 1].texto.toLowerCase()}.</p>
          )}
          <p className="tv-texto tv-texto--suave">
            {dif === null ? 'Suas respostas ajudam a melhorar o teste para todos os estudantes.' : dif > 0 ? 'Você terminou com mais clareza do que começou. Continue explorando no seu ritmo.' : dif < 0 ? 'Conhecer mais possibilidades às vezes traz novas dúvidas. Isso é normal e faz parte de explorar.' : 'Explorar as profissões sugeridas pode ajudar a dar o próximo passo.'}
          </p>
          <div className="tv-pos-ok__acoes">
            <Btn variante="contorno" onClick={() => ir({ id: 'plano' })}>
              Montar meu plano
            </Btn>
            <Btn onClick={() => ir({ id: 'relatorio' }, -1)}>Voltar ao meu perfil</Btn>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="tv-foco tv-pos">
      <Voltar texto="Meu perfil" onClick={() => ir({ id: 'relatorio' }, -1)} />
      <motion.section className="tv-cartao tv-clareza" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
        <span className="tv-sobre">Como você se sente agora?</span>
        <h1 className="tv-h1 tv-h1--m">{CLAREZA_PERGUNTA}</h1>
        <p className="tv-texto tv-texto--suave">A mesma pergunta do início, com a mesma escala.{pre ? ' Marcamos onde você estava antes.' : ''}</p>
        <EscalaClareza valor={v} onChange={setV} antes={pre} />

        <AnimatePresence>
          {v !== null && (
            <motion.div className="tv-pos__extra" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <div className="tv-pos__q">
                <strong>Você conheceu alguma possibilidade profissional nova?</strong>
                <div className="tv-seg" role="radiogroup">
                  {(
                    [
                      ['sim', 'Sim'],
                      ['nao', 'Não'],
                      ['talvez', 'Ainda não sei'],
                    ] as const
                  ).map(([k, t]) => (
                    <button key={k} role="radio" aria-checked={desc === k} className={desc === k ? 'is-on' : ''} onClick={() => setDesc(k)}>
                      {desc === k && <Check size={14} strokeWidth={3} />} {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="tv-pos__q">
                <strong>As sugestões fizeram sentido para você?</strong>
                <div className="tv-seg tv-seg--5" role="radiogroup">
                  {RELEVANCIA.map((t, i) => (
                    <button key={t} role="radio" aria-checked={rel === i + 1} className={rel === i + 1 ? 'is-on' : ''} onClick={() => setRel(i + 1)}>
                      <b>{i + 1}</b> {t}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="tv-clareza__rodape">
          <button className="tv-link" onClick={() => ir({ id: 'relatorio' }, -1)}>
            Agora não
          </button>
          <Btn
            grande
            disabled={v === null}
            onClick={() => {
              enviarClarezaPos({ valor: v!, descobriu: desc, relevancia: rel, em: Math.max(Date.now(), HOJE) })
              setEnviado(true)
            }}
          >
            Enviar
          </Btn>
        </div>
      </motion.section>
    </div>
  )
}
