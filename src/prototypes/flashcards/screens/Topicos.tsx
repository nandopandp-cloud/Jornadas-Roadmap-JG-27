import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, ChevronDown, Info, Search, Sparkles, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Btn, Quadrado, Voltar } from '../components/ui'
import { DISC, MAX_DISCIPLINAS, TOPICO } from '../data'
import { useFx } from '../store'

const norm = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

/** Etapa 2 — Selecionar tópicos de cada disciplina */
export default function Topicos({ disc: inicial }: { disc?: string }) {
  const { s, ir, setSelecao, toast } = useFx()
  const sel = s.selecao
  const [atual, setAtual] = useState(inicial && sel.discs.includes(inicial) ? inicial : sel.discs[0])
  const [aberto, setAberto] = useState<string | null>(atual)
  const [busca, setBusca] = useState('')

  // sem disciplinas (ex.: “Limpar tudo”) → volta para a etapa anterior
  useEffect(() => {
    if (!sel.discs.length) ir({ id: 'disciplinas' }, -1)
  }, [sel.discs.length, ir])
  if (!atual || !sel.discs.length) return null

  const d = DISC[atual]
  const escolhidos = sel.topicos[atual] ?? []
  const lista = d.topicos.filter((t) => norm(t.nome + ' ' + t.desc).includes(norm(busca.trim())))
  const idx = sel.discs.indexOf(atual)
  const temTopicos = (id: string) => (sel.topicos[id] ?? []).length > 0
  /** próxima disciplina que ainda não tem tópicos (a partir da atual, em ordem circular) */
  const pendente = [...sel.discs.slice(idx + 1), ...sel.discs.slice(0, idx)].find((x) => !temTopicos(x))
  const tudoPronto = sel.discs.every(temTopicos)

  const trocar = (id: string) => {
    setAtual(id)
    setAberto(id)
    setBusca('')
  }
  const alternar = (disc: string, t: string) =>
    setSelecao((x) => {
      const cur = x.topicos[disc] ?? []
      return { ...x, topicos: { ...x.topicos, [disc]: cur.includes(t) ? cur.filter((y) => y !== t) : [...cur, t] } }
    })
  const todos = escolhidos.length === d.topicos.length
  const gerar = () => {
    const falta = sel.discs.find((x) => !(sel.topicos[x] ?? []).length)
    if (falta) {
      trocar(falta)
      return toast(`Escolha ao menos um tópico de ${DISC[falta].nome}.`, 'erro')
    }
    ir({ id: 'gerando' })
  }

  return (
    <div className="fx-wiz">
      <Voltar texto="Criar flashcards" onClick={() => ir({ id: 'disciplinas' }, -1)} />
      <div className="fx-wiz__grade fx-wiz__grade--topicos">
        <div className="fx-wiz__esq">
          <header className="fx-wiz__cab">
            <h1 className="fx-h1 fx-h1--m">Selecionar tópicos</h1>
            <AnimatePresence mode="wait">
              <motion.p key={atual} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                Escolha os tópicos de {d.nome} que você deseja revisar.
              </motion.p>
            </AnimatePresence>
          </header>

          {sel.discs.length > 1 && (
            <ol className="fx-passos" aria-label="Disciplinas selecionadas">
              {sel.discs.map((id, i) => {
                const ok = temTopicos(id)
                const on = id === atual
                return (
                  <li key={id} className={`${on ? 'is-atual' : ''} ${ok ? 'is-ok' : ''}`}>
                    {i > 0 && <span className="fx-passos__linha" />}
                    <button onClick={() => trocar(id)} aria-current={on ? 'step' : undefined}>
                      <span className="fx-passos__n">
                        {ok && !on ? <Check size={13} strokeWidth={3.4} /> : i + 1}
                        {on && <motion.span layoutId="fx-passo" className="fx-passos__anel" transition={{ type: 'spring', stiffness: 500, damping: 36 }} />}
                      </span>
                      <span className="fx-passos__txt">
                        <strong>{DISC[id].nome}</strong>
                        <small>{ok ? `${(sel.topicos[id] ?? []).length} ${(sel.topicos[id] ?? []).length === 1 ? 'tópico' : 'tópicos'}` : on ? 'Escolhendo agora' : 'Pendente'}</small>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
          )}

          <AnimatePresence mode="wait" initial={false}>
            <motion.section key={atual} className="fx-cartao fx-topicos" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12, transition: { duration: 0.12 } }}>
              <div className="fx-topicos__cab">
                <Quadrado icone={d.icone} tam="gg" />
                <div>
                  <strong>{d.curso}</strong>
                  <span>Selecione os tópicos para gerar seus flashcards.</span>
                </div>
                <motion.span key={escolhidos.length} className="fx-pilula" initial={{ scale: 0.85 }} animate={{ scale: 1 }}>
                  {escolhidos.length} {escolhidos.length === 1 ? 'selecionado' : 'selecionados'}
                </motion.span>
              </div>
              <div className="fx-topicos__ferr">
                <label className="fx-busca">
                  <Search size={17} />
                  <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder={`Buscar tópicos de ${d.nome}`} />
                  {busca && (
                    <button onClick={() => setBusca('')} aria-label="Limpar busca" className="fx-busca__x">
                      <X size={16} />
                    </button>
                  )}
                </label>
                <button
                  className="fx-link fx-topicos__todos"
                  onClick={() => setSelecao((x) => ({ ...x, topicos: { ...x.topicos, [atual]: todos ? [] : d.topicos.map((t) => t.id) } }))}
                >
                  {todos ? 'Limpar seleção' : 'Selecionar todos'}
                </button>
              </div>
              <div className="fx-topicos__lista">
                {lista.map((t, i) => {
                  const on = escolhidos.includes(t.id)
                  return (
                    <motion.button
                      key={t.id}
                      className={`fx-topico ${on ? 'is-on' : ''}`}
                      onClick={() => alternar(atual, t.id)}
                      aria-pressed={on}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <span className={`fx-caixa ${on ? 'is-on' : ''}`} aria-hidden>
                        <AnimatePresence>
                          {on && (
                            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 600, damping: 24 }}>
                              <Check size={15} strokeWidth={3.4} />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                      <Quadrado icone={t.icone} tam="p" className="fx-topico__ic" />
                      <span className="fx-topico__txt">
                        <strong>{t.nome}</strong>
                        <span>{t.desc}</span>
                      </span>
                    </motion.button>
                  )
                })}
                {!lista.length && (
                  <div className="fx-vazio">
                    <Search size={20} />
                    <p>Nenhum tópico encontrado para “{busca}”.</p>
                  </div>
                )}
              </div>
              {sel.discs.length > 1 && (
                <motion.div className={`fx-seguir ${escolhidos.length ? 'is-pronto' : ''} ${tudoPronto ? 'is-fim' : ''}`} layout>
                  <span className="fx-seguir__ic">{tudoPronto ? <Sparkles size={17} /> : escolhidos.length ? <Check size={17} strokeWidth={3} /> : <Info size={17} />}</span>
                  <span className="fx-seguir__txt">
                    {tudoPronto ? (
                      <>
                        <strong>Tudo pronto!</strong> Todas as disciplinas têm tópicos escolhidos.
                      </>
                    ) : escolhidos.length ? (
                      <>
                        <strong>{d.nome} pronta.</strong> Agora escolha os tópicos de <b>{DISC[pendente!].nome}</b>.
                      </>
                    ) : (
                      <>Selecione ao menos um tópico de {d.nome} para continuar.</>
                    )}
                  </span>
                  {tudoPronto ? (
                    <Btn iconeDir={<ArrowRight size={18} />} onClick={gerar}>
                      Gerar flashcards
                    </Btn>
                  ) : (
                    escolhidos.length > 0 &&
                    pendente && (
                      <Btn iconeDir={<ArrowRight size={18} />} onClick={() => trocar(pendente)} className="fx-seguir__btn">
                        Ir para {DISC[pendente].nome}
                      </Btn>
                    )
                  )}
                </motion.div>
              )}
            </motion.section>
          </AnimatePresence>
        </div>

        <aside className="fx-cartao fx-painel fx-painel--topicos">
          <div className="fx-painel__cab">
            <h3>
              Suas seleções ({sel.discs.length}/{MAX_DISCIPLINAS})
            </h3>
            <button className="fx-link" onClick={() => setSelecao((x) => ({ ...x, topicos: Object.fromEntries(x.discs.map((y) => [y, []])) }))}>
              Limpar tudo
            </button>
          </div>
          <div className="fx-acordeoes">
            {sel.discs.map((id) => {
              const ts = sel.topicos[id] ?? []
              const ab = aberto === id
              return (
                <motion.div key={id} layout className={`fx-acordeao ${ab ? 'is-aberto' : ''} ${id === atual ? 'is-atual' : ''}`}>
                  <button
                    className="fx-acordeao__cab"
                    onClick={() => {
                      setAberto(ab ? null : id)
                      if (!ab && id !== atual) trocar(id)
                    }}
                    aria-expanded={ab}
                  >
                    <Quadrado icone={DISC[id].icone} tam="m" />
                    <span>
                      <strong>{DISC[id].curso}</strong>
                      <small className={ts.length ? '' : 'is-falta'}>{ts.length ? `${ts.length} ${ts.length === 1 ? 'tópico selecionado' : 'tópicos selecionados'}` : 'Nenhum tópico selecionado'}</small>
                    </span>
                    <motion.span animate={{ rotate: ab ? 180 : 0 }} className="fx-acordeao__seta">
                      <ChevronDown size={19} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {ab && (
                      <motion.div className="fx-acordeao__corpo" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}>
                        <AnimatePresence initial={false}>
                          {ts.map((t) => {
                            const T = TOPICO[t]
                            return (
                              <motion.div key={t} layout className="fx-acordeao__item" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                                <div className="fx-acordeao__iteminner">
                                  <Quadrado icone={T.icone} tam="p" />
                                  <span>{T.nome}</span>
                                  <button className="fx-iconbtn" onClick={() => alternar(id, t)} aria-label={`Remover ${T.nome}`}>
                                    <X size={18} />
                                  </button>
                                </div>
                              </motion.div>
                            )
                          })}
                        </AnimatePresence>
                        {!ts.length && <p className="fx-acordeao__vazio">Escolha os tópicos na lista ao lado.</p>}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
          <div className="fx-info">
            <Info size={20} />
            <span>
              Você pode selecionar até <b>5 disciplinas</b> e múltiplos tópicos em cada uma.
            </span>
          </div>
          <Btn grande bloco className="fx-painel__cta" iconeDir={<ArrowRight size={17} />} onClick={() => (pendente ? trocar(pendente) : gerar())}>
            {pendente ? `Próxima: ${DISC[pendente].nome}` : 'Gerar flashcards'}
          </Btn>
          {pendente && (
            <p className="fx-painel__falta">
              Faltam tópicos em {sel.discs.filter((x) => !temTopicos(x)).length} {sel.discs.filter((x) => !temTopicos(x)).length === 1 ? 'disciplina' : 'disciplinas'}.
            </p>
          )}
        </aside>
      </div>
    </div>
  )
}
