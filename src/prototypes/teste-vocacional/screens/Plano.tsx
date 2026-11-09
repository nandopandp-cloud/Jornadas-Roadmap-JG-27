import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, MessageCircleHeart, PencilLine, Plus, Trash2 } from 'lucide-react'
import { useRef, useState, type CSSProperties } from 'react'
import { AREA, CARREIRA, CARREIRAS } from '../carreiras'
import { Barra, Btn, Select } from '../components/ui'
import { acoesSugeridas, perguntasReflexao } from '../motor'
import { useTv, type Acao } from '../store'

/** Meu plano de exploração profissional (PRD §5.11) */
export default function Plano() {
  const { s, ultima, addAcao, toggleAcao, removerAcao, restaurarAcao, editarAcao, toast, ir } = useTv()
  const [texto, setTexto] = useState('')
  const [vinculo, setVinculo] = useState<string>('')
  const [verFeitas, setVerFeitas] = useState(true)
  const base = s.favoritos.map((f) => f.id)
  const recs = ultima?.resultado?.recomendacoes.map((r) => r.id) ?? []
  const fontes = [...new Set([...base, ...recs])]
  const [sugDe, setSugDe] = useState<string>(fontes[0] ?? 'design-ux')
  const pend = s.acoes.filter((a) => !a.feita)
  const feitas = s.acoes.filter((a) => a.feita)
  const p = ultima?.resultado?.perfil

  const criar = () => {
    if (!texto.trim()) return
    addAcao({ texto: texto.trim(), tipo: 'pessoal', carreira: vinculo || undefined })
    setTexto('')
    toast('Ação criada.', 'ok')
  }
  const remover = (id: string) => {
    const a = removerAcao(id)
    if (a) toast('Ação removida.', 'info', { rotulo: 'Desfazer', fn: () => restaurarAcao(a) })
  }

  return (
    <div className="tv-plano">
      <header className="tv-pagcab">
        <div>
          <h1 className="tv-h1">Meu plano de exploração</h1>
          <p>Ações concretas para investigar suas possibilidades, no seu ritmo. Não existe ordem certa: escolha por onde começar.</p>
        </div>
        <img src="./voc/memo.webp" alt="" className="tv-pagcab__arte" />
      </header>

      <div className="tv-plano__grade">
        <div className="tv-plano__principal">
          <div className="tv-cartao tv-plano__prog">
            <div>
              <strong>
                {feitas.length} de {s.acoes.length} {s.acoes.length === 1 ? 'ação concluída' : 'ações concluídas'}
              </strong>
              <small>Concluir ações não muda seu resultado vocacional: elas servem para você investigar.</small>
            </div>
            <Barra valor={s.acoes.length ? (feitas.length / s.acoes.length) * 100 : 0} rotulo="Ações concluídas" />
          </div>

          <div className="tv-cartao tv-nova">
            <label className="tv-nova__campo">
              <Plus size={18} />
              <input value={texto} onChange={(e) => setTexto(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && criar()} placeholder="Escreva uma ação (ex.: visitar a feira de profissões da escola)" aria-label="Nova ação" />
            </label>
            <div className="tv-nova__rodape">
              <Select valor={vinculo} placeholder="Ligar a uma profissão (opcional)" rotulo="Profissão relacionada" className="tv-select--p tv-nova__sel" opcoes={[{ valor: '', texto: 'Sem profissão' }, ...fontes.map((id) => ({ valor: id, texto: CARREIRA[id].nome }))]} onChange={setVinculo} />
              <Btn pequeno disabled={!texto.trim()} onClick={criar}>
                Adicionar ação
              </Btn>
            </div>
          </div>

          {s.acoes.length === 0 ? (
            <div className="tv-cartao tv-vazio tv-vazio--grande">
              <img src="./voc/spiral-notepad.webp" alt="" width={64} />
              <strong>Seu plano ainda está vazio</strong>
              <span>Adicione ações sugeridas ao lado ou escreva as suas. Uma conversa ou uma pesquisa já é um ótimo começo.</span>
            </div>
          ) : (
            <>
              <h2 className="tv-h2 tv-plano__h">
                Para fazer <em>{pend.length}</em>
              </h2>
              <ul className="tv-acoes">
                <AnimatePresence initial={false}>
                  {pend.map((a) => (
                    <ItemAcao key={a.id} a={a} onToggle={() => toggleAcao(a.id)} onRemover={() => remover(a.id)} onEditar={(t) => editarAcao(a.id, t)} onCarreira={(id) => ir({ id: 'carreira', carreira: id, de: 'plano' })} />
                  ))}
                </AnimatePresence>
                {!pend.length && <li className="tv-acoes__vazio">Tudo feito por aqui! Que tal adicionar uma nova ação?</li>}
              </ul>
              {feitas.length > 0 && (
                <>
                  <button className="tv-plano__h tv-plano__toggle" onClick={() => setVerFeitas((x) => !x)} aria-expanded={verFeitas}>
                    <h2 className="tv-h2">
                      Concluídas <em>{feitas.length}</em>
                    </h2>
                    <ChevronDown size={18} className={verFeitas ? 'is-on' : ''} />
                  </button>
                  <AnimatePresence initial={false}>
                    {verFeitas && (
                      <motion.ul className="tv-acoes tv-acoes--feitas" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                        {feitas.map((a) => (
                          <ItemAcao key={a.id} a={a} onToggle={() => toggleAcao(a.id)} onRemover={() => remover(a.id)} onEditar={(t) => editarAcao(a.id, t)} onCarreira={(id) => ir({ id: 'carreira', carreira: id, de: 'plano' })} />
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </>
              )}
            </>
          )}
        </div>

        <aside className="tv-plano__lado">
          <div className="tv-cartao tv-sugplano">
            <h3>Sugestões de ações</h3>
            <Select
              valor={sugDe}
              rotulo="Sugestões para a profissão"
              className="tv-select--p tv-sugplano__sel"
              opcoes={(fontes.length ? fontes : CARREIRAS.slice(0, 6).map((c) => c.id)).map((id) => ({ valor: id, texto: CARREIRA[id].nome, grupo: base.includes(id) ? 'Minhas carreiras' : 'Sugeridas para você' }))}
              onChange={setSugDe}
            />
            <ul>
              {acoesSugeridas(CARREIRA[sugDe]).map((a) => {
                const tem = s.acoes.some((x) => x.texto === a.texto)
                return (
                  <li key={a.texto}>
                    <span>{a.texto}</span>
                    <button
                      className={`tv-addmini ${tem ? 'is-on' : ''}`}
                      disabled={tem}
                      aria-label={tem ? 'Já está no plano' : `Adicionar: ${a.texto}`}
                      onClick={() => {
                        addAcao({ texto: a.texto, tipo: a.tipo, carreira: sugDe })
                        toast('Ação adicionada ao plano.', 'ok')
                      }}
                    >
                      {tem ? <Check size={14} strokeWidth={3} /> : <Plus size={15} />}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="tv-cartao tv-conversa">
            <h3>
              <MessageCircleHeart size={18} /> Converse com alguém
            </h3>
            <p>Profissionais da área, professores, a orientação da escola e pessoas de confiança da sua família ajudam a enxergar o dia a dia real de uma profissão.</p>
            <small>Dica de pergunta: “O que você faz num dia comum de trabalho? E o que ninguém conta sobre a sua profissão?”</small>
          </div>
          {p && (
            <div className="tv-cartao tv-reflexao tv-reflexao--p">
              <h3>
                <img src="./voc/thinking-face.webp" alt="" /> Para refletir
              </h3>
              <ol>
                {perguntasReflexao(p)
                  .slice(2)
                  .map((q) => (
                    <li key={q}>{q}</li>
                  ))}
              </ol>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

function ItemAcao({ a, onToggle, onRemover, onEditar, onCarreira }: { a: Acao; onToggle: () => void; onRemover: () => void; onEditar: (t: string) => void; onCarreira: (id: string) => void }) {
  const [editando, setEditando] = useState(false)
  const [txt, setTxt] = useState(a.texto)
  const ref = useRef<HTMLInputElement>(null)
  const salvar = () => {
    if (txt.trim()) onEditar(txt.trim())
    else setTxt(a.texto)
    setEditando(false)
  }
  const c = a.carreira ? CARREIRA[a.carreira] : null
  return (
    <motion.li layout className={`tv-cartao tv-acao ${a.feita ? 'is-feita' : ''}`} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 30, transition: { duration: 0.16 } }}>
      <motion.button className={`tv-acao__check ${a.feita ? 'is-on' : ''}`} onClick={onToggle} whileTap={{ scale: 0.85 }} aria-pressed={a.feita} aria-label={a.feita ? 'Marcar como não concluída' : 'Marcar como concluída'}>
        {a.feita && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 600, damping: 16 }}>
            <Check size={14} strokeWidth={3} />
          </motion.span>
        )}
      </motion.button>
      <div className="tv-acao__corpo">
        {editando ? (
          <input ref={ref} autoFocus value={txt} onChange={(e) => setTxt(e.target.value)} onBlur={salvar} onKeyDown={(e) => (e.key === 'Enter' ? salvar() : e.key === 'Escape' && (setTxt(a.texto), setEditando(false)))} aria-label="Editar ação" />
        ) : (
          <span className="tv-acao__txt">{a.texto}</span>
        )}
        {c && (
          <button className="tv-acao__prof" style={{ '--c': AREA[c.area].cor } as CSSProperties} onClick={() => onCarreira(c.id)}>
            <img src={c.icone} alt="" />
            {c.nome}
          </button>
        )}
      </div>
      <div className="tv-acao__btns">
        <button className="tv-iconbtn" onClick={() => setEditando(true)} aria-label="Editar ação">
          <PencilLine size={15} />
        </button>
        <button className="tv-iconbtn tv-iconbtn--perigo" onClick={onRemover} aria-label="Remover ação">
          <Trash2 size={15} />
        </button>
      </div>
    </motion.li>
  )
}
