import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Columns3, ListChecks, Search, Star } from 'lucide-react'
import type { CSSProperties } from 'react'
import { AREA, CARREIRA } from '../carreiras'
import { Btn, Estrela, Select } from '../components/ui'
import { CATEGORIA } from '../motor'
import { quando, useTv, type Etapa } from '../store'

const ETAPAS: { id: Etapa; nome: string; desc: string; img: string }[] = [
  { id: 'conhecer', nome: 'Quero conhecer mais', desc: 'Profissões que chamaram sua atenção', img: './voc/magnifying-glass-tilted-left.webp' },
  { id: 'investigando', nome: 'Estou investigando', desc: 'Você já está pesquisando ou conversando', img: './voc/world-map.webp' },
  { id: 'conheci', nome: 'Já conheci', desc: 'Investigadas, combinando ou não com você', img: './voc/check-mark-button.webp' },
]

/** Minhas carreiras (PRD §5.10): favoritos organizados para investigar depois */
export default function Minhas() {
  const { s, ir, favoritar, setEtapa, toast, setComparar, ultima } = useTv()
  const favs = s.favoritos
  const recs = ultima?.resultado?.recomendacoes ?? []

  if (!favs.length) {
    return (
      <div className="tv-minhas">
        <Cabecalho />
        <motion.div className="tv-cartao tv-vazio tv-vazio--grande" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <span className="tv-vazio__estrela">
            <Star size={30} fill="currentColor" strokeWidth={0} />
          </span>
          <strong>Você ainda não salvou profissões</strong>
          <span>Toque na estrela de qualquer profissão para guardá-la aqui e investigar com calma, quando quiser.</span>
          <div className="tv-vazio__acoes">
            {ultima && (
              <Btn variante="contorno" onClick={() => ir({ id: 'relatorio', secao: 'possibilidades' })}>
                Ver minhas sugestões
              </Btn>
            )}
            <Btn icone={<Search size={15} />} onClick={() => ir({ id: 'explorar' })}>
              Explorar carreiras
            </Btn>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="tv-minhas">
      <Cabecalho>
        <Btn
          variante="contorno"
          icone={<Columns3 size={16} />}
          disabled={favs.length < 2}
          onClick={() => {
            setComparar(favs.slice(0, 3).map((f) => f.id))
            ir({ id: 'comparar' })
          }}
        >
          Comparar salvas
        </Btn>
      </Cabecalho>

      <div className="tv-quadro">
        {ETAPAS.map((e, ei) => {
          const doGrupo = favs.filter((f) => f.etapa === e.id)
          return (
            <motion.section key={e.id} className="tv-quadro__col" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ei * 0.06 }}>
              <header>
                <img src={e.img} alt="" />
                <div>
                  <strong>
                    {e.nome} <em>{doGrupo.length}</em>
                  </strong>
                  <small>{e.desc}</small>
                </div>
              </header>
              <AnimatePresence initial={false}>
                {doGrupo.map((f) => {
                  const c = CARREIRA[f.id]
                  const rec = recs.find((r) => r.id === f.id)
                  const nAcoes = s.acoes.filter((a) => a.carreira === f.id && !a.feita).length
                  return (
                    <motion.article key={f.id} layout className="tv-cartao tv-salva" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}>
                      <div className="tv-salva__topo">
                        <span className="tv-salva__ic" style={{ '--c': AREA[c.area].cor } as CSSProperties}>
                          <img src={c.icone} alt="" />
                        </span>
                        <div className="tv-salva__txt">
                          <strong>{c.nome}</strong>
                          <small>
                            {rec ? CATEGORIA[rec.categoria] : AREA[c.area].nome} · salva {quando(f.em).toLowerCase()}
                          </small>
                        </div>
                        <Estrela
                          on
                          onClick={() => {
                            favoritar(f.id)
                            toast(`${c.nome} removida de Minhas carreiras.`, 'info', { rotulo: 'Desfazer', fn: () => favoritar(f.id) })
                          }}
                        />
                      </div>
                      {nAcoes > 0 && (
                        <button className="tv-salva__acoes" onClick={() => ir({ id: 'plano' })}>
                          <ListChecks size={14} /> {nAcoes} {nAcoes === 1 ? 'ação pendente' : 'ações pendentes'} no plano
                        </button>
                      )}
                      <div className="tv-salva__rodape">
                        <Select valor={f.etapa} rotulo={`Etapa de ${c.nome}`} className="tv-select--p" opcoes={ETAPAS.map((x) => ({ valor: x.id, texto: x.nome }))} onChange={(v) => setEtapa(f.id, v)} />
                        <button className="tv-link tv-link--seta" onClick={() => ir({ id: 'carreira', carreira: f.id, de: 'minhas' })}>
                          Abrir <ArrowRight size={14} />
                        </button>
                      </div>
                    </motion.article>
                  )
                })}
              </AnimatePresence>
              {!doGrupo.length && <p className="tv-quadro__vazio">Nenhuma profissão aqui ainda.</p>}
            </motion.section>
          )
        })}
      </div>
    </div>
  )
}

function Cabecalho({ children }: { children?: React.ReactNode }) {
  return (
    <header className="tv-pagcab">
      <div>
        <h1 className="tv-h1">Minhas carreiras</h1>
        <p>Profissões que você salvou. Organize por etapa de investigação e volte quando quiser: elas ficam guardadas mesmo se você refizer o teste.</p>
      </div>
      {children ?? <img src="./voc/bookmark-tabs.webp" alt="" className="tv-pagcab__arte" />}
    </header>
  )
}
