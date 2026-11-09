import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, Info } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CLAREZA, CLAREZA_PERGUNTA } from '../instrumento'
import { HOJE } from '../dados'
import { useTv } from '../store'
import { Btn, Modal } from './ui'

/** escala de clareza (PRD §3.4): mesma pergunta e mesma escala antes e depois */
export function EscalaClareza({ valor, onChange, antes }: { valor: number | null; onChange: (v: number) => void; antes?: number | null }) {
  return (
    <div className="tv-escclar" role="radiogroup" aria-label={CLAREZA_PERGUNTA}>
      {CLAREZA.map((c) => {
        const on = valor === c.v
        return (
          <motion.button key={c.v} role="radio" aria-checked={on} className={`tv-escclar__op ${on ? 'is-on' : ''}`} onClick={() => onChange(c.v)} whileTap={{ scale: 0.97 }}>
            {antes === c.v && <span className="tv-escclar__antes">Antes</span>}
            <motion.img src={c.emoji} alt="" animate={on ? { scale: [1, 1.2, 1] } : { scale: 1 }} transition={{ duration: 0.4 }} />
            <span className="tv-escclar__txt">{c.texto}</span>
            <span className="tv-escclar__n">{on ? <Check size={12} strokeWidth={3} /> : c.v}</span>
          </motion.button>
        )
      })}
    </div>
  )
}

/** antes do questionário (PRD §5.3): opcional, não muda as recomendações */
export function ClarezaInicial({ aberto, onFechar, onContinuar }: { aberto: boolean; onFechar: () => void; onContinuar: (v: number | null) => void }) {
  const [v, setV] = useState<number | null>(null)
  useEffect(() => setV(null), [aberto])
  return (
    <Modal
      aberto={aberto}
      onFechar={onFechar}
      titulo="Antes de começar"
      largura={620}
      rodape={
        <>
          <button className="tv-link" onClick={() => onContinuar(null)}>
            Prefiro pular
          </button>
          <Btn disabled={v === null} iconeDir={<ArrowRight size={16} />} onClick={() => onContinuar(v)}>
            Começar o teste
          </Btn>
        </>
      }
    >
      <p className="tv-clar__q">{CLAREZA_PERGUNTA}</p>
      <p className="tv-texto tv-texto--suave">Não existe nível certo. Vamos fazer a mesma pergunta no final para você perceber se a experiência ajudou.</p>
      <EscalaClareza valor={v} onChange={setV} />
      <p className="tv-nota">
        <Info size={15} /> Esta resposta não muda as profissões sugeridas para você.
      </p>
    </Modal>
  )
}

/** depois do resultado (PRD §5.12): mesma escala, nunca bloqueia o relatório */
export function ClarezaFinal({ aberto, onFechar }: { aberto: boolean; onFechar: () => void }) {
  const { ultima, enviarClarezaPos } = useTv()
  const [v, setV] = useState<number | null>(null)
  const [desc, setDesc] = useState<'sim' | 'nao' | 'talvez' | null>(null)
  const [rel, setRel] = useState<number | null>(null)
  const [enviado, setEnviado] = useState(false)
  useEffect(() => {
    if (!aberto) return
    setV(ultima?.clarezaPos?.valor ?? null)
    setDesc(ultima?.clarezaPos?.descobriu ?? null)
    setRel(ultima?.clarezaPos?.relevancia ?? null)
    setEnviado(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aberto])
  const pre = ultima?.clarezaPre ?? null
  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo={enviado ? 'Obrigado por responder!' : 'Como você se sente agora?'} largura={640}>
      {enviado && v ? (
        <div className="tv-clar__ok">
          <motion.img src={CLAREZA[v - 1].emoji} alt="" initial={{ scale: 0.3 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 12 }} />
          {pre ? (
            <div className="tv-clar__evol">
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
            {!pre ? 'Suas respostas ajudam a melhorar o teste para todos os estudantes.' : v > pre ? 'Você terminou com mais clareza do que começou. Continue explorando no seu ritmo.' : v < pre ? 'Conhecer mais possibilidades às vezes traz novas dúvidas. Isso é normal e faz parte de explorar.' : 'Explorar as profissões recomendadas pode ajudar a dar o próximo passo.'}
          </p>
          <Btn onClick={onFechar}>Voltar ao resultado</Btn>
        </div>
      ) : (
        <>
          <p className="tv-clar__q">{CLAREZA_PERGUNTA}</p>
          <p className="tv-texto tv-texto--suave">A mesma pergunta do início, com a mesma escala.{pre ? ' Marcamos onde você estava antes.' : ''} É opcional.</p>
          <EscalaClareza valor={v} onChange={setV} antes={pre} />
          <AnimatePresence>
            {v !== null && (
              <motion.div className="tv-clar__extra" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <div>
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
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <strong>As profissões recomendadas fizeram sentido para você?</strong>
                  <div className="tv-seg" role="radiogroup">
                    {['Nada', 'Pouco', 'Mais ou menos', 'Bastante', 'Muito'].map((t, i) => (
                      <button key={t} role="radio" aria-checked={rel === i + 1} className={rel === i + 1 ? 'is-on' : ''} onClick={() => setRel(i + 1)}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="tv-clar__rodape">
            <button className="tv-link" onClick={onFechar}>
              Agora não
            </button>
            <Btn
              disabled={v === null}
              onClick={() => {
                enviarClarezaPos({ valor: v!, descobriu: desc, relevancia: rel, em: Math.max(Date.now(), HOJE) })
                setEnviado(true)
              }}
            >
              Enviar
            </Btn>
          </div>
        </>
      )}
    </Modal>
  )
}
