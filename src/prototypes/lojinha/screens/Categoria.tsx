import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ItemCard } from '../components/cards'
import { Estrelas, IconeRaridade, Select } from '../components/ui'
import { CAT, CATEGORIAS, ITENS, RARIDADES, type CategoriaId, type Raridade } from '../data'
import { useLoja } from '../store'

type Ordem = 'recentes' | 'menor' | 'maior' | 'raridade'
const norm = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

/** Página de uma categoria (ou de todos os itens) */
export default function Categoria({ cat }: { cat: CategoriaId | 'todos' }) {
  const { ir } = useLoja()
  const [rar, setRar] = useState<Raridade | 'todos'>('todos')
  const [ordem, setOrdem] = useState<Ordem>('recentes')
  const [subcat, setSubcat] = useState<CategoriaId | 'todas'>('todas')
  const [busca, setBusca] = useState('')
  const todos = cat === 'todos'
  const c = todos ? null : CAT[cat]

  const base = useMemo(() => ITENS.filter((i) => (todos ? subcat === 'todas' || i.cat === subcat : i.cat === cat) && (!busca.trim() || norm(i.nome).includes(norm(busca.trim())))), [cat, todos, subcat, busca])
  const conta = (r: Raridade) => base.filter((i) => i.raridade === r).length
  const lista = useMemo(
    () =>
      base
        .filter((i) => rar === 'todos' || i.raridade === rar)
        .sort((a, b) => (ordem === 'menor' ? a.pontos - b.pontos : ordem === 'maior' ? b.pontos - a.pontos : ordem === 'raridade' ? RARIDADES[b.raridade].ordem - RARIDADES[a.raridade].ordem || b.pontos - a.pontos : b.novo - a.novo)),
    [base, rar, ordem],
  )

  return (
    <div className="lj-cat-pag">
      <button className="lj-voltar" onClick={() => ir({ id: 'loja' }, -1)}>
        <ArrowLeft size={17} /> Voltar à loja
      </button>

      <motion.section className="lj-catbanner" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <motion.img className="lj-catbanner__ic" src={c ? c.img : './loja/lojinha.webp'} alt="" initial={{ scale: 0.5, rotate: -12 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 13, delay: 0.1 }} />
        <div className="lj-catbanner__txt">
          <h2>{c ? c.titulo : 'Todos os itens'}</h2>
          <p>{c ? c.texto : 'Navegue por tudo o que a Lojinha tem para você.'}</p>
        </div>
        <div className={`lj-catbanner__arte ${cat === 'avatares' ? 'is-foto' : ''}`}>
          {cat === 'avatares' ? (
            <motion.img src="./loja/banner-avatares-arte.webp" alt="" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 22 }} />
          ) : (
            <>
              <svg className="lj-catbanner__onda" viewBox="0 0 560 170" preserveAspectRatio="none" aria-hidden>
                <defs>
                  <linearGradient id="lj-onda" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#5b34c9" />
                    <stop offset="1" stopColor="#2a1a7a" />
                  </linearGradient>
                </defs>
                <path d="M0 170 C 60 150, 70 70, 150 60 C 230 50, 250 22, 330 18 L 560 14 L 560 170 Z" fill="url(#lj-onda)" />
              </svg>
              <Estrelas n={6} className="lj-estrelas--ouro" />
              <motion.img
                className="lj-catbanner__obj"
                src={c ? c.img : './loja/c-recompensas.webp'}
                alt=""
                initial={{ y: 40, opacity: 0, rotate: -8 }}
                animate={{ y: [0, -8, 0], opacity: 1, rotate: 0 }}
                transition={{ y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }, opacity: { duration: 0.4 }, rotate: { type: 'spring' } }}
              />
            </>
          )}
        </div>
      </motion.section>

      <div className="lj-filtros">
        <div className="lj-chips" role="tablist" aria-label="Filtrar por raridade">
          {(['todos', 'comum', 'raro', 'epico', 'lendario'] as const).map((r) => {
            const n = r === 'todos' ? base.length : conta(r)
            return (
              <button key={r} role="tab" aria-selected={rar === r} className={`lj-chip ${rar === r ? 'is-on' : ''}`} onClick={() => setRar(r)} disabled={r !== 'todos' && !n}>
                {rar === r && <motion.span layoutId="lj-chip-pill" className="lj-chip__pill" transition={{ type: 'spring', stiffness: 480, damping: 38 }} />}
                <IconeRaridade r={r} />
                <span>
                  {r === 'todos' ? 'Todos' : RARIDADES[r].nome} ({n})
                </span>
              </button>
            )
          })}
        </div>
        <span className="lj-filtros__esp" />
        {todos && (
          <Select
            className="lj-select--cat"
            rotulo="Categoria"
            valor={subcat}
            onChange={(v) => {
              setSubcat(v)
              setRar('todos')
            }}
            opcoes={[{ valor: 'todas' as const, texto: 'Todas as categorias' }, ...CATEGORIAS.map((x) => ({ valor: x.id, texto: x.nome }))]}
          />
        )}
        {todos && (
          <label className="lj-busca">
            <Search size={18} />
            <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar itens..." />
            {busca && (
              <button onClick={() => setBusca('')} aria-label="Limpar busca">
                <X size={15} />
              </button>
            )}
          </label>
        )}
        <Select
          className="lj-select--ordem"
          rotulo="Ordenar"
          valor={ordem}
          onChange={setOrdem}
          opcoes={[
            { valor: 'recentes', texto: 'Mais recentes' },
            { valor: 'menor', texto: 'Menor preço' },
            { valor: 'maior', texto: 'Maior preço' },
            { valor: 'raridade', texto: 'Mais raros' },
          ]}
        />
      </div>

      <motion.div className="lj-grade" layout>
        <AnimatePresence mode="popLayout">
          {lista.map((it, i) => (
            <ItemCard key={it.id} item={it} i={i} de={cat} />
          ))}
        </AnimatePresence>
      </motion.div>
      {!lista.length && (
        <div className="lj-vazio">
          <Search size={22} />
          <p>Nenhum item encontrado com esses filtros.</p>
        </div>
      )}
    </div>
  )
}
