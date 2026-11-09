import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDownUp, Search, SearchX, X } from 'lucide-react'
import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { AREA, CARREIRAS, type Area } from '../carreiras'
import { CardCarreira } from '../components/perfil'
import { Btn, Select } from '../components/ui'
import { DIM, DIMS, type Dim } from '../instrumento'
import { distancia } from '../motor'
import { useTv } from '../store'

const norm = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

/** Catálogo de profissões: o estudante pode explorar qualquer área (RN05) */
export default function Explorar({ dimInicial }: { dimInicial?: string }) {
  const { ir, ultima } = useTv()
  const p = ultima?.resultado?.perfil
  const recs = ultima?.resultado?.recomendacoes ?? []
  const [busca, setBusca] = useState('')
  const [areas, setAreas] = useState<Area[]>([])
  const [dims, setDims] = useState<Dim[]>(dimInicial ? ([...dimInicial] as Dim[]) : [])
  const [pouco, setPouco] = useState(false)
  const [ordem, setOrdem] = useState<'perfil' | 'az'>(p && !p.inconclusivo ? 'perfil' : 'az')
  useEffect(() => setDims(dimInicial ? ([...dimInicial] as Dim[]) : []), [dimInicial])

  const lista = useMemo(() => {
    const q = norm(busca.trim())
    const l = CARREIRAS.filter(
      (c) =>
        (!q || norm(`${c.nome} ${c.descricao} ${c.formacoes.map((f) => f.nome).join(' ')} ${c.especializacoes.join(' ')}`).includes(q)) &&
        (!areas.length || areas.includes(c.area)) &&
        dims.every((d) => c.codigo.includes(d)) &&
        (!pouco || c.poucoConhecida),
    )
    return ordem === 'perfil' && p ? l.sort((a, b) => distancia(p, a) - distancia(p, b)) : l.sort((a, b) => a.nome.localeCompare(b.nome))
  }, [busca, areas, dims, pouco, ordem, p])

  const filtros = areas.length + dims.length + (pouco ? 1 : 0) + (busca ? 1 : 0)
  const limpar = () => {
    setBusca('')
    setAreas([])
    setDims([])
    setPouco(false)
  }

  return (
    <div className="tv-explorar">
      <header className="tv-pagcab">
        <div>
          <h1 className="tv-h1">Explorar carreiras</h1>
          <p>Conheça qualquer profissão do catálogo, inclusive as que não apareceram nas suas sugestões. Tem uma em mente? Busque pelo nome.</p>
        </div>
        <img src="./voc/globe-showing-americas.webp" alt="" className="tv-pagcab__arte" />
      </header>

      <div className="tv-filtros">
        <label className="tv-busca">
          <Search size={18} />
          <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Busque por profissão, curso ou área (ex.: saúde, dados, design)" aria-label="Buscar profissões" />
          {busca && (
            <button className="tv-busca__x" onClick={() => setBusca('')} aria-label="Limpar busca">
              <X size={14} />
            </button>
          )}
        </label>
        <div className="tv-filtros__linha">
          <span className="tv-filtros__rot">Área</span>
          <div className="tv-chips">
            {(Object.keys(AREA) as Area[]).map((a) => {
              const on = areas.includes(a)
              return (
                <button key={a} className={`tv-chip tv-chip--filtro ${on ? 'is-on' : ''}`} style={{ '--c': AREA[a].cor } as CSSProperties} aria-pressed={on} onClick={() => setAreas((x) => (on ? x.filter((y) => y !== a) : [...x, a]))}>
                  {AREA[a].nome}
                </button>
              )
            })}
          </div>
        </div>
        <div className="tv-filtros__linha">
          <span className="tv-filtros__rot">Interesse</span>
          <div className="tv-chips">
            {DIMS.map((d) => {
              const on = dims.includes(d)
              return (
                <button key={d} className={`tv-chip tv-chip--dim ${on ? 'is-on' : ''}`} style={{ '--c': DIM[d].cor, '--cc': DIM[d].claro } as CSSProperties} aria-pressed={on} onClick={() => setDims((x) => (on ? x.filter((y) => y !== d) : [...x, d]))}>
                  <img src={DIM[d].icone} alt="" />
                  {DIM[d].nome}
                  {p?.destaques.includes(d) && <em title="Uma das suas pistas">pista</em>}
                </button>
              )
            })}
          </div>
        </div>
        <div className="tv-filtros__rodape">
          <label className="tv-interruptor">
            <input type="checkbox" checked={pouco} onChange={(e) => setPouco(e.target.checked)} />
            <span className="tv-interruptor__trilho" />
            Só profissões pouco conhecidas
          </label>
          <span className="tv-filtros__total">
            {lista.length} {lista.length === 1 ? 'profissão' : 'profissões'}
            {filtros > 0 && (
              <button className="tv-link" onClick={limpar}>
                Limpar filtros
              </button>
            )}
          </span>
          <Select
            valor={ordem}
            rotulo="Ordenar"
            icone={<ArrowDownUp size={15} />}
            onChange={setOrdem}
            className="tv-select--p"
            opcoes={[...(p && !p.inconclusivo ? [{ valor: 'perfil' as const, texto: 'Mais relacionadas a você' }] : []), { valor: 'az' as const, texto: 'Ordem alfabética' }]}
          />
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {lista.length ? (
          <motion.div key="lista" className="tv-grade-carreiras tv-grade-carreiras--compacta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {lista.map((c, i) => (
              <CardCarreira key={c.id} c={c} rec={recs.find((r) => r.id === c.id)} compacto indice={i} onAbrir={() => ir({ id: 'carreira', carreira: c.id, de: 'explorar' })} />
            ))}
          </motion.div>
        ) : (
          <motion.div key="vazio" className="tv-cartao tv-vazio tv-vazio--grande" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <SearchX size={34} />
            <strong>Nenhuma profissão encontrada</strong>
            <span>Tente outra palavra ou tire alguns filtros. O catálogo cresce a cada revisão.</span>
            <Btn variante="contorno" onClick={limpar}>
              Limpar filtros
            </Btn>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
