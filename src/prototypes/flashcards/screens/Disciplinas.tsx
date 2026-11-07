import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, Search, X } from 'lucide-react'
import { useState } from 'react'
import { Btn, Quadrado, Voltar } from '../components/ui'
import { AREAS, DISC, DISCIPLINAS, MAX_DISCIPLINAS, type AreaId } from '../data'
import { useFx } from '../store'

const norm = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

/** Etapa 1 — Selecionar cursos ou disciplinas (até 5) */
export default function Disciplinas() {
  const { s, ir, setSelecao, toast } = useFx()
  const sel = s.selecao.discs
  const [area, setArea] = useState<AreaId | 'todas'>('todas')
  const [busca, setBusca] = useState('')
  const [tremer, setTremer] = useState(0)
  const lista = DISCIPLINAS.filter((d) => (area === 'todas' || d.area === area) && norm(d.nome).includes(norm(busca.trim())))
  const cheio = sel.length >= MAX_DISCIPLINAS

  const alternar = (id: string) => {
    if (sel.includes(id)) return setSelecao((x) => ({ ...x, discs: x.discs.filter((d) => d !== id) }))
    if (cheio) {
      setTremer((t) => t + 1)
      return toast(`Você pode selecionar até ${MAX_DISCIPLINAS} cursos ou disciplinas.`, 'erro')
    }
    setSelecao((x) => ({ ...x, discs: [...x.discs, id] }))
  }

  return (
    <div className="fx-wiz">
      <Voltar texto="Criar flashcards" onClick={() => ir({ id: 'landing' }, -1)} />
      <header className="fx-wiz__cab">
        <h1 className="fx-h1 fx-h1--m">Selecionar cursos ou disciplinas</h1>
        <p>Escolha até 5 cursos ou disciplinas para gerar seus grupos de flashcards.</p>
      </header>

      <div className="fx-wiz__grade">
        <div className="fx-wiz__esq">
          <label className="fx-busca fx-busca--g">
            <Search size={19} />
            <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar cursos ou disciplinas" />
            {busca && (
              <button onClick={() => setBusca('')} aria-label="Limpar busca" className="fx-busca__x">
                <X size={16} />
              </button>
            )}
            <motion.span key={tremer} className={`fx-contador ${cheio ? 'is-cheio' : ''}`} animate={tremer ? { x: [0, -6, 6, -4, 4, 0] } : {}} transition={{ duration: 0.4 }}>
              <motion.b key={sel.length} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                {sel.length}
              </motion.b>
              /{MAX_DISCIPLINAS} selecionados
            </motion.span>
          </label>

          <h3 className="fx-wiz__sub">Áreas do conhecimento</h3>
          <div className="fx-areas" role="tablist">
            {AREAS.map((a) => (
              <button key={a.id} role="tab" aria-selected={area === a.id} className={`fx-area ${area === a.id ? 'is-on' : ''}`} onClick={() => setArea(a.id)}>
                {area === a.id && <motion.span layoutId="fx-area-pill" className="fx-area__pill" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
                <span>{a.nome}</span>
              </button>
            ))}
          </div>

          <motion.div className="fx-discs" layout>
            <AnimatePresence mode="popLayout" initial={false}>
              {lista.map((d, i) => {
                const on = sel.includes(d.id)
                return (
                  <motion.button
                    key={d.id}
                    layout
                    className={`fx-disc ${on ? 'is-on' : ''} ${cheio && !on ? 'is-bloq' : ''}`}
                    onClick={() => alternar(d.id)}
                    aria-pressed={on}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ delay: Math.min(i, 12) * 0.018, type: 'spring', stiffness: 420, damping: 32 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Quadrado icone={d.icone} tam="p" />
                    <span className="fx-disc__nome">{d.nome}</span>
                    <span className={`fx-check ${on ? 'is-on' : ''}`} aria-hidden>
                      <AnimatePresence>
                        {on && (
                          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 600, damping: 22 }}>
                            <Check size={14} strokeWidth={3.4} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                  </motion.button>
                )
              })}
            </AnimatePresence>
          </motion.div>
          {!lista.length && (
            <div className="fx-vazio">
              <Search size={22} />
              <p>Nenhum curso ou disciplina encontrado para “{busca}”.</p>
            </div>
          )}
        </div>

        <aside className="fx-cartao fx-painel">
          <div className="fx-painel__cab">
            <h3>Seleções atuais</h3>
            {sel.length > 0 && (
              <button className="fx-link" onClick={() => setSelecao(() => ({ discs: [], topicos: {} }))}>
                Limpar tudo
              </button>
            )}
          </div>
          <div className="fx-painel__lista">
            <AnimatePresence initial={false}>
              {sel.map((id) => (
                <motion.div key={id} layout className="fx-selitem" initial={{ opacity: 0, height: 0, marginBottom: 0 }} animate={{ opacity: 1, height: 'auto', marginBottom: 12 }} exit={{ opacity: 0, height: 0, marginBottom: 0 }} transition={{ duration: 0.22 }}>
                  <div className="fx-selitem__in">
                    <Quadrado icone={DISC[id].icone} tam="m" />
                    <strong>{DISC[id].nome}</strong>
                    <button className="fx-iconbtn" onClick={() => alternar(id)} aria-label={`Remover ${DISC[id].nome}`}>
                      <X size={17} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {!sel.length && <p className="fx-painel__vazio">Nenhuma disciplina selecionada ainda. Toque nos cards ao lado para escolher.</p>}
          </div>
          <p className="fx-painel__nota">Você pode selecionar até 5 cursos ou disciplinas.</p>
          <Btn
            grande
            bloco
            className="fx-painel__cta"
            disabled={!sel.length}
            iconeDir={<ArrowRight size={19} />}
            onClick={() => {
              setSelecao((x) => ({ ...x, topicos: Object.fromEntries(x.discs.map((d) => [d, x.topicos[d] ?? []])) }))
              ir({ id: 'topicos', disc: sel[0] })
            }}
          >
            Próxima etapa
          </Btn>
        </aside>
      </div>
    </div>
  )
}
