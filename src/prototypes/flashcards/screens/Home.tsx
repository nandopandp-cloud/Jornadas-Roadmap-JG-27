import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ArrowUpDown, BookOpen, CircleCheck, CirclePlus, Clock, Flame, History, Layers, PartyPopper, Search, Star, Tag, Target, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Empilhada, FavCard, GrupoCard } from '../components/cards'
import { Btn, Migalhas, Quadrado, Select } from '../components/ui'
import { CARD, DISC, TOPICO } from '../data'
import { nomeGrupo, pct, quando, ultimo, useFx, type Aba } from '../store'

const CAB: Record<Aba, { titulo: string; sub: string; img: string; nota: string }> = {
  grupos: { titulo: 'Flashcards', sub: 'Revise conteúdos, memorize conceitos e teste seus conhecimentos de forma prática.', img: './flash/hero-lampada.webp', nota: 'Pequenas revisões geram grandes resultados!' },
  favoritos: { titulo: 'Meus flashcards favoritos', sub: 'Revise os conteúdos que você salvou para não esquecer.', img: './flash/hero-estrela.webp', nota: 'Seus tópicos preferidos sempre à mão.' },
  historico: { titulo: 'Histórico de estudos', sub: 'Acompanhe suas sessões de estudo e veja a sua evolução.', img: './flash/hero-gerando.webp', nota: 'Constância é o segredo da memória!' },
}

/** Home da funcionalidade: Meus grupos · Favoritos · Histórico */
export default function Home({ aba }: { aba: Aba }) {
  const { ir } = useFx()
  const c = CAB[aba]
  const trocar = (a: Aba) => ir({ id: 'home', aba: a }, a === 'grupos' ? -1 : 1)
  return (
    <div className={`fx-home fx-home--${aba}`}>
      <AnimatePresence initial={false}>
        {aba !== 'grupos' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <Migalhas itens={[{ texto: 'Flashcards', onClick: () => ir({ id: 'landing' }, -1) }, { texto: aba === 'favoritos' ? 'Favoritos' : 'Histórico' }]} onVoltar={() => trocar('grupos')} />
          </motion.div>
        )}
      </AnimatePresence>

      <header className="fx-home__cab">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={aba} className="fx-home__txt" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6, transition: { duration: 0.1 } }}>
            <h1 className="fx-h1 fx-h1--m">{c.titulo}</h1>
            <p>{c.sub}</p>
          </motion.div>
        </AnimatePresence>
        <div className="fx-home__arte">
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={c.img}
              src={c.img}
              alt=""
              initial={{ opacity: 0, scale: 0.7, rotate: -12 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: 10, transition: { duration: 0.12 } }}
              transition={{ type: 'spring', stiffness: 260, damping: 16 }}
            />
          </AnimatePresence>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={c.nota} className="fx-home__nota" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.12 }}>
              {c.nota}
            </motion.span>
          </AnimatePresence>
        </div>
        {aba === 'grupos' && (
          <Btn grande icone={<CirclePlus size={19} />} className="fx-home__criar" onClick={() => ir({ id: 'disciplinas' })}>
            Criar novos flashcards
          </Btn>
        )}
      </header>

      <div className="fx-abas" role="tablist">
        {(
          [
            ['grupos', 'Meus grupos', Layers],
            ['favoritos', 'Favoritos', Star],
            ['historico', 'Histórico', Clock],
          ] as const
        ).map(([id, nome, I]) => (
          <button key={id} role="tab" aria-selected={aba === id} className={aba === id ? 'is-on' : ''} onClick={() => trocar(id)}>
            <I size={19} strokeWidth={1.9} />
            {nome}
            {aba === id && <motion.span layoutId="fx-aba" className="fx-abas__linha" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={aba} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.1 } }} transition={{ duration: 0.22 }}>
          {aba === 'grupos' && <AbaGrupos />}
          {aba === 'favoritos' && <AbaFavoritos />}
          {aba === 'historico' && <AbaHistorico />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ---------------- Meus grupos ---------------- */
function AbaGrupos() {
  const { s, ir, up } = useFx()
  const [todos, setTodos] = useState(false)
  const grupos = useMemo(() => [...s.grupos].sort((a, b) => Number(!!b.novo) - Number(!!a.novo) || ultimo(b) - ultimo(a)), [s.grupos])
  const visiveis = todos ? grupos : grupos.slice(0, 3)
  const favs = Object.entries(s.favoritos)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
  const novos = grupos.filter((g) => g.novo)

  return (
    <>
      <AnimatePresence>
        {novos.length > 0 && (
          <motion.div className="fx-aviso-novos" initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <div className="fx-aviso-novos__in">
              <motion.span animate={{ rotate: [0, -14, 10, 0], scale: [1, 1.15, 1] }} transition={{ duration: 0.9, delay: 0.4 }}>
                <PartyPopper size={20} />
              </motion.span>
              <span>
                <strong>
                  {novos.length === 1 ? 'Seu novo grupo está pronto!' : `${novos.length} novos grupos prontos!`} {novos.reduce((a, g) => a + g.cards.length, 0)} flashcards para estudar.
                </strong>{' '}
                Comece por {nomeGrupo(novos[0])}.
              </span>
              <Btn pequeno iconeDir={<ArrowRight size={16} />} onClick={() => ir({ id: 'grupo', grupo: novos[0].id })}>
                Começar agora
              </Btn>
              <button className="fx-iconbtn" aria-label="Dispensar aviso" onClick={() => up((x) => ({ ...x, grupos: x.grupos.map((g) => ({ ...g, novo: false })) }))}>
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="fx-secao">
        <div className="fx-secao__cab">
          <h2 className="fx-h2">{todos ? `Todos os grupos (${grupos.length})` : 'Grupos recentes'}</h2>
          {grupos.length > 3 && (
            <button className="fx-link fx-link--seta" onClick={() => setTodos((t) => !t)}>
              {todos ? 'Ver recentes' : 'Ver todos'} <ArrowRight size={18} />
            </button>
          )}
        </div>
        {grupos.length ? (
          <motion.div className="fx-grupos" layout>
            <AnimatePresence mode="popLayout">
              {visiveis.map((g, i) => (
                <GrupoCard key={g.id} g={g} i={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="fx-cartao fx-vazio fx-vazio--grande">
            <Layers size={29} />
            <strong>Você ainda não tem grupos de flashcards</strong>
            <p>Escolha disciplinas e tópicos e nós geramos os cards para você.</p>
            <Btn icone={<CirclePlus size={17} />} onClick={() => ir({ id: 'disciplinas' })}>
              Criar flashcards
            </Btn>
          </div>
        )}
      </section>

      <section className="fx-secao">
        <div className="fx-secao__cab">
          <h2 className="fx-h2">Favoritos</h2>
          <button className="fx-link fx-link--seta" onClick={() => ir({ id: 'home', aba: 'favoritos' })}>
            Ver todos <ArrowRight size={18} />
          </button>
        </div>
        {favs.length ? (
          <div className="fx-favs fx-favs--home">
            <AnimatePresence mode="popLayout">
              {favs.map(([id], i) => (
                <FavCard key={id} cardId={id} i={i} compacto />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <p className="fx-texto fx-texto--suave">Toque na estrela de um card durante o estudo para salvá-lo aqui.</p>
        )}
      </section>
    </>
  )
}

/* ---------------- Favoritos ---------------- */
const norm = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
function AbaFavoritos() {
  const { s } = useFx()
  const [curso, setCurso] = useState('todos')
  const [topico, setTopico] = useState('todos')
  const [busca, setBusca] = useState('')
  const [ordem, setOrdem] = useState<'recentes' | 'antigos' | 'az'>('recentes')

  const todos = Object.entries(s.favoritos)
  const cursos = [...new Set(todos.map(([id]) => CARD[id].disc))]
  const topicos = [...new Set(todos.filter(([id]) => curso === 'todos' || CARD[id].disc === curso).map(([id]) => CARD[id].topico))]
  const lista = todos
    .filter(([id]) => (curso === 'todos' || CARD[id].disc === curso) && (topico === 'todos' || CARD[id].topico === topico))
    .filter(([id]) => !busca.trim() || norm(CARD[id].pergunta + ' ' + CARD[id].resposta).includes(norm(busca.trim())))
    .sort((a, b) => (ordem === 'az' ? CARD[a[0]].pergunta.localeCompare(CARD[b[0]].pergunta) : ordem === 'recentes' ? b[1] - a[1] : a[1] - b[1]))

  return (
    <section className="fx-secao">
      <div className="fx-filtros">
        <Select
          className="fx-select--curso"
          icone={<BookOpen size={17} />}
          rotulo="Filtrar por curso"
          valor={curso}
          onChange={(v) => {
            setCurso(v)
            setTopico('todos')
          }}
          opcoes={[{ valor: 'todos', texto: 'Todos os cursos' }, ...cursos.map((d) => ({ valor: d, texto: DISC[d].nome }))]}
        />
        <Tag size={17} className="fx-filtros__tag" />
        <Select className="fx-select--topico" rotulo="Filtrar por tópico" valor={topico} onChange={setTopico} opcoes={[{ valor: 'todos', texto: 'Todos os tópicos' }, ...topicos.map((t) => ({ valor: t, texto: TOPICO[t].nome }))]} />
        <span className="fx-filtros__esp" />
        <label className="fx-busca fx-busca--filtro">
          <Search size={17} />
          <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar flashcards favoritos..." />
          {busca && (
            <button onClick={() => setBusca('')} aria-label="Limpar busca" className="fx-busca__x">
              <X size={16} />
            </button>
          )}
        </label>
        <Select
          className="fx-select--ordem"
          icone={<ArrowUpDown size={17} />}
          rotulo="Ordenar"
          valor={ordem}
          onChange={setOrdem}
          opcoes={[
            { valor: 'recentes', texto: 'Mais recentes' },
            { valor: 'antigos', texto: 'Mais antigos' },
            { valor: 'az', texto: 'Ordem alfabética' },
          ]}
        />
      </div>

      <h3 className="fx-contagem">
        <motion.span key={lista.length} initial={{ opacity: 0.4, y: -4 }} animate={{ opacity: 1, y: 0 }}>
          {lista.length}
        </motion.span>{' '}
        {lista.length === 1 ? 'flashcard favorito' : 'flashcards favoritos'}
      </h3>
      {lista.length ? (
        <motion.div className="fx-favs" layout>
          <AnimatePresence mode="popLayout">
            {lista.map(([id], i) => (
              <FavCard key={id} cardId={id} i={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="fx-cartao fx-vazio fx-vazio--grande">
          <Star size={29} />
          <strong>{todos.length ? 'Nenhum favorito encontrado' : 'Você ainda não favoritou nenhum card'}</strong>
          <p>{todos.length ? 'Tente outro filtro ou termo de busca.' : 'Durante o estudo, toque na estrela para salvar os cards mais importantes.'}</p>
        </div>
      )}
    </section>
  )
}

/* ---------------- Histórico ---------------- */
function AbaHistorico() {
  const { s, ir } = useFx()
  const h = [...s.historico].sort((a, b) => b.data - a.data)
  const cards = h.reduce((a, x) => a + x.cards, 0)
  const sei = h.reduce((a, x) => a + x.sei, 0)
  const stats = [
    { I: History, v: `${h.length}`, t: 'sessões de estudo' },
    { I: Layers, v: `${cards}`, t: 'cards estudados' },
    { I: Target, v: `${pct(sei, cards)}%`, t: 'de acertos' },
    { I: Flame, v: '3 dias', t: 'de sequência' },
  ]
  return (
    <section className="fx-secao">
      <div className="fx-hstats">
        {stats.map(({ I, v, t }, i) => (
          <motion.div key={t} className="fx-cartao fx-hstat" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <span className={`fx-hstat__ic fx-hstat__ic--${i}`}>
              <I size={20} />
            </span>
            <span>
              <strong>{v}</strong>
              <small>{t}</small>
            </span>
          </motion.div>
        ))}
      </div>
      <h2 className="fx-h2 fx-h2--m">Sessões recentes</h2>
      <div className="fx-cartao fx-hlista">
        {h.map((x, i) => {
          const g = s.grupos.find((y) => y.id === x.grupo)
          const disc = g?.disc ?? 'literatura'
          return (
            <motion.div key={x.id} className="fx-hitem" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
              <Quadrado icone={DISC[disc].icone} tam="m" />
              <span className="fx-hitem__txt">
                <strong>{g ? nomeGrupo(g) : DISC[disc].curso}</strong>
                <small>
                  {quando(x.data)} · {x.cards} cards
                </small>
              </span>
              <span className="fx-hitem__barra">
                <Empilhada g={x} />
                <small>
                  <CircleCheck size={14} /> {pct(x.sei, x.cards)}% de acertos
                </small>
              </span>
              {g ? (
                <Btn variante="contorno" pequeno onClick={() => ir({ id: 'grupo', grupo: g.id })}>
                  Estudar
                </Btn>
              ) : (
                <span className="fx-hitem__exc">Grupo excluído</span>
              )}
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
