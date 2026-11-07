import { AnimatePresence, motion } from 'framer-motion'
import { Copy, Download, Ellipsis, Eye, Info, Pencil, Plus, Power, Trash2, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { usePagina } from '../components/dados'
import { Btn, Busca, Caixa, ChipRaridade, ChipStatus, Filtro, Menu, Modal, Paginacao, Select, Thumb, baixarCSV } from '../components/ui'
import { AGORA, RARIDADES, dataHora, fmt, pts, type Item, type Raridade, type StatusItem } from '../data'
import { useAdm } from '../store'
import { CATEGORIAS_NOME, CatCelula, norm } from './comum'

/** Catálogo de itens */
export default function Itens({ cat: catInicial, ordem }: { cat?: string; ordem?: 'resgates' }) {
  const { d, upd, ir, toast } = useAdm()
  const [busca, setBusca] = useState('')
  const [cat, setCat] = useState(catInicial ?? 'todas')
  const [rar, setRar] = useState<Raridade | 'todas'>('todas')
  const [st, setSt] = useState<StatusItem | 'todos'>('todos')
  const [sel, setSel] = useState<string[]>([])
  const [ver, setVer] = useState<Item | null>(null)
  const pg = usePagina(10)

  const lista = useMemo(() => {
    const l = d.itens.filter((i) => (cat === 'todas' || i.cat === cat) && (rar === 'todas' || i.raridade === rar) && (st === 'todos' || i.status === st) && (!busca.trim() || norm(i.nome).includes(norm(busca.trim()))))
    return ordem === 'resgates' ? [...l].sort((a, b) => b.resgates - a.resgates) : l
  }, [d.itens, cat, rar, st, busca, ordem])
  const pagina = pg.fatia(lista)
  const filtrado = busca || cat !== 'todas' || rar !== 'todas' || st !== 'todos'
  const todosPag = pagina.length > 0 && pagina.every((i) => sel.includes(i.id))

  const alterar = (ids: string[], fn: (i: Item) => Item) => upd((x) => ({ ...x, itens: x.itens.map((i) => (ids.includes(i.id) ? fn(i) : i)) }))
  const excluir = (ids: string[]) => {
    const antes = d.itens
    upd((x) => ({ ...x, itens: x.itens.filter((i) => !ids.includes(i.id)) }))
    setSel([])
    toast(ids.length === 1 ? 'Item excluído do catálogo.' : `${ids.length} itens excluídos.`, 'info', { rotulo: 'Desfazer', fn: () => upd((x) => ({ ...x, itens: antes })) })
  }
  const duplicar = (i: Item) => {
    const novo: Item = { ...i, id: `${i.id}-copia-${Date.now().toString(36)}`, nome: `${i.nome} (cópia)`, resgates: 0, status: 'rascunho', atualizado: AGORA }
    upd((x) => ({ ...x, itens: [novo, ...x.itens], destaque: novo.id }))
    pg.setPagina(1)
    toast('Item duplicado como rascunho.')
  }
  const exportar = () => {
    baixarCSV('catalogo-lojinha.csv', [['Item', 'Categoria', 'Raridade', 'Pontos', 'Estoque', 'Resgates', 'Status', 'Atualizado em'], ...lista.map((i) => [i.nome, CATEGORIAS_NOME(d.cats, i.cat), RARIDADES[i.raridade], i.pontos, i.estoque ?? '', i.resgates, i.status, dataHora(i.atualizado)])])
    toast(`Catálogo exportado (${fmt(lista.length)} itens).`)
  }

  return (
    <section className="ga-card">
      <div className="ga-card__cab ga-card__cab--g">
        <div>
          <h2>Catálogo de itens</h2>
          <p>Cadastre, edite e gerencie os itens disponíveis na Lojinha.</p>
        </div>
        <div className="ga-card__acoes">
          <Btn variante="contorno" icone={<Download size={19} />} onClick={exportar}>
            Exportar
          </Btn>
          <Btn icone={<Plus size={20} />} onClick={() => ir({ id: 'item-form' })}>
            Cadastrar item
          </Btn>
        </div>
      </div>

      <div className="ga-filtros">
        <Busca valor={busca} onChange={(v) => (setBusca(v), pg.setPagina(1))} placeholder="Buscar por nome do item" className="ga-busca--itens" />
        <Filtro rotulo="Categoria">
          <Select valor={cat} onChange={(v) => (setCat(v), pg.setPagina(1))} opcoes={[{ valor: 'todas', texto: 'Todas' }, ...d.cats.map((c) => ({ valor: c.id, texto: c.nome }))]} />
        </Filtro>
        <Filtro rotulo="Raridade">
          <Select valor={rar} onChange={(v) => (setRar(v), pg.setPagina(1))} opcoes={[{ valor: 'todas' as const, texto: 'Todas' }, ...(Object.keys(RARIDADES) as Raridade[]).map((r) => ({ valor: r, texto: RARIDADES[r] }))]} />
        </Filtro>
        <Filtro rotulo="Status">
          <Select
            valor={st}
            onChange={(v) => (setSt(v), pg.setPagina(1))}
            opcoes={[
              { valor: 'todos', texto: 'Todos' },
              { valor: 'ativo', texto: 'Ativo' },
              { valor: 'inativo', texto: 'Inativo' },
              { valor: 'rascunho', texto: 'Rascunho' },
            ]}
          />
        </Filtro>
        <button
          className="ga-link ga-limpar"
          disabled={!filtrado}
          onClick={() => {
            setBusca('')
            setCat('todas')
            setRar('todas')
            setSt('todos')
          }}
        >
          Limpar filtros
        </button>
      </div>

      <AnimatePresence>
        {sel.length > 0 && (
          <motion.div className="ga-massa" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <div className="ga-massa__in">
              <strong>
                {sel.length} {sel.length === 1 ? 'item selecionado' : 'itens selecionados'}
              </strong>
              <Btn pequeno variante="contorno" onClick={() => (alterar(sel, (i) => ({ ...i, status: 'ativo', atualizado: AGORA })), toast('Itens ativados.'), setSel([]))}>
                Ativar
              </Btn>
              <Btn pequeno variante="contorno" onClick={() => (alterar(sel, (i) => ({ ...i, status: 'inativo', atualizado: AGORA })), toast('Itens inativados.', 'info'), setSel([]))}>
                Inativar
              </Btn>
              <Btn pequeno variante="perigo" icone={<Trash2 size={16} />} onClick={() => excluir(sel)}>
                Excluir
              </Btn>
              <button className="ga-iconbtn" onClick={() => setSel([])} aria-label="Limpar seleção">
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="ga-rolagem">
        <table className="ga-tabela">
          <thead>
            <tr>
              <th className="ga-col-caixa">
                <Caixa on={todosPag} parcial={!todosPag && pagina.some((i) => sel.includes(i.id))} onChange={() => setSel((x) => (todosPag ? x.filter((y) => !pagina.some((i) => i.id === y)) : [...new Set([...x, ...pagina.map((i) => i.id)])]))} rotulo="Selecionar página" />
              </th>
              <th>Item</th>
              <th>Categoria</th>
              <th>Raridade</th>
              <th>Pontos</th>
              <th>
                <span className="ga-th-info" title="Quantidade disponível para resgate. “—” = ilimitado.">
                  Estoque <Info size={15} />
                </span>
              </th>
              <th className="ga-centro">Resgates</th>
              <th>Status</th>
              <th>Atualizado em</th>
              <th className="ga-centro">Ações</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {pagina.map((i, k) => (
                <motion.tr
                  key={i.id}
                  layout="position"
                  className={`${sel.includes(i.id) ? 'is-sel' : ''} ${d.destaque === i.id ? 'is-destaque' : ''}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: Math.min(k, 10) * 0.02 }}
                >
                  <td className="ga-col-caixa">
                    <Caixa on={sel.includes(i.id)} onChange={() => setSel((x) => (x.includes(i.id) ? x.filter((y) => y !== i.id) : [...x, i.id]))} rotulo={`Selecionar ${i.nome}`} />
                  </td>
                  <td>
                    <span className="ga-itemcel">
                      <Thumb item={i} tam={46} />
                      <span>
                        <strong>{i.nome}</strong>
                        <small>{i.sub}</small>
                      </span>
                    </span>
                  </td>
                  <td>
                    <CatCelula cats={d.cats} id={i.cat} />
                  </td>
                  <td>
                    <ChipRaridade r={i.raridade} />
                  </td>
                  <td className="ga-nowrap">
                    <strong>{pts(i.pontos)}</strong>
                  </td>
                  <td>{i.estoque == null ? '—' : fmt(i.estoque)}</td>
                  <td className="ga-centro">{fmt(i.resgates)}</td>
                  <td>
                    <ChipStatus st={i.status} />
                  </td>
                  <td className="ga-nowrap">{dataHora(i.atualizado)}</td>
                  <td>
                    <span className="ga-acoes">
                      <button className="ga-acao" onClick={() => setVer(i)} aria-label={`Visualizar ${i.nome}`} title="Visualizar">
                        <Eye size={18} />
                      </button>
                      <button className="ga-acao" onClick={() => ir({ id: 'item-form', item: i.id })} aria-label={`Editar ${i.nome}`} title="Editar">
                        <Pencil size={17} />
                      </button>
                      <Menu
                        icone={<Ellipsis size={18} />}
                        itens={[
                          { texto: 'Duplicar', icone: <Copy size={16} />, fn: () => duplicar(i) },
                          { texto: i.status === 'ativo' ? 'Inativar' : 'Ativar', icone: <Power size={16} />, fn: () => (alterar([i.id], (x) => ({ ...x, status: i.status === 'ativo' ? 'inativo' : 'ativo', atualizado: AGORA })), toast(i.status === 'ativo' ? `${i.nome} inativado.` : `${i.nome} ativado.`, i.status === 'ativo' ? 'info' : 'ok')) },
                          'sep',
                          { texto: 'Excluir', icone: <Trash2 size={16} />, perigo: true, fn: () => excluir([i.id]) },
                        ]}
                      />
                    </span>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {!lista.length && <p className="ga-vazio">Nenhum item encontrado com esses filtros.</p>}
      </div>
      <Paginacao total={lista.length} pagina={pg.pagina} porPagina={pg.porPagina} onPagina={pg.setPagina} onPorPagina={pg.setPorPagina} rotulo="itens" />

      <Modal aberto={!!ver} onFechar={() => setVer(null)} titulo="Pré-visualização do item" sub="Assim o item aparece na Lojinha da plataforma." largura={560}>
        {ver && (
          <div className="ga-ver">
            <div className="ga-ver__card">
              <div className={`ga-ver__arte ${ver.foto ? 'is-foto' : ''}`}>
                <img src={ver.img} alt="" style={ver.filtro ? { filter: ver.filtro } : undefined} />
                <span className="ga-ver__selo">
                  <ChipRaridade r={ver.raridade} />
                </span>
              </div>
              <strong>{ver.nome}</strong>
              <small>{CATEGORIAS_NOME(d.cats, ver.cat)}</small>
              <span className="ga-ver__rod">
                <span className="ga-ver__pts">{pts(ver.pontos)}</span>
                <span className="ga-ver__btn">Resgatar</span>
              </span>
            </div>
            <dl className="ga-ver__dados">
              <div>
                <dt>Descrição</dt>
                <dd>{ver.desc}</dd>
              </div>
              <div>
                <dt>Tipo</dt>
                <dd>{ver.tipo === 'digital' ? 'Digital · disponibilização automática' : 'Físico · envio ao estudante'}</dd>
              </div>
              <div>
                <dt>Estoque</dt>
                <dd>{ver.estoque == null ? 'Ilimitado' : `${fmt(ver.estoque)} unidades`}</dd>
              </div>
              <div>
                <dt>Limite por estudante</dt>
                <dd>{ver.limite ?? 'Sem limite'}</dd>
              </div>
              <div>
                <dt>Resgates</dt>
                <dd>{fmt(ver.resgates)}</dd>
              </div>
            </dl>
          </div>
        )}
      </Modal>
    </section>
  )
}
