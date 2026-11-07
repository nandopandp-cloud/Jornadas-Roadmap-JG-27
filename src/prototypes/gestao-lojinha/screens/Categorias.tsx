import { motion } from 'framer-motion'
import { Ellipsis, Eye, Pencil, Plus, Power, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { usePagina } from '../components/dados'
import { Btn, Busca, ChipStatus, Filtro, Menu, Modal, Paginacao, Select, Thumb, Toggle } from '../components/ui'
import { AGORA, dataHora, pts, type Categoria, type IconeCat } from '../data'
import { useAdm } from '../store'
import { ICONE_CAT, norm } from './comum'

const IMAGENS = ['./admin/cat-avatares.webp', './admin/cat-oculos.webp', './admin/cat-pets.webp', './admin/cat-cards.webp', './admin/cat-fone.webp', './admin/cat-recompensas.webp', './3d/palette.png', './3d/books.png', './3d/trophy.png', './3d/bulb.png', './3d/rocket.png', './3d/crown.png']

/** Categorias da Lojinha */
export default function Categorias() {
  const { d, upd, ir, toast } = useAdm()
  const [busca, setBusca] = useState('')
  const [st, setSt] = useState<'todos' | 'ativa' | 'inativa'>('todos')
  const [form, setForm] = useState<Categoria | 'nova' | null>(null)
  const [ver, setVer] = useState<Categoria | null>(null)
  const pg = usePagina(10)
  const conta = (id: string) => d.itens.filter((i) => i.cat === id).length
  const lista = useMemo(() => d.cats.filter((c) => (st === 'todos' || c.status === st) && (!busca.trim() || norm(c.nome + ' ' + c.desc).includes(norm(busca.trim())))), [d.cats, st, busca])

  const salvar = (c: Categoria) => {
    const nova = !d.cats.some((x) => x.id === c.id)
    upd((x) => ({ ...x, cats: nova ? [c, ...x.cats] : x.cats.map((y) => (y.id === c.id ? c : y)) }))
    setForm(null)
    toast(nova ? `Categoria “${c.nome}” cadastrada.` : 'Categoria atualizada.')
  }
  return (
    <section className="ga-card">
      <div className="ga-card__cab ga-card__cab--g">
        <div>
          <h2>Categorias</h2>
          <p>Organize e gerencie as categorias da Lojinha.</p>
        </div>
        <Btn icone={<Plus size={20} />} onClick={() => setForm('nova')}>
          Cadastrar categoria
        </Btn>
      </div>
      <div className="ga-filtros">
        <Busca valor={busca} onChange={setBusca} placeholder="Buscar por nome da categoria" className="ga-busca--cat" />
        <Filtro rotulo="Status">
          <Select
            valor={st}
            onChange={setSt}
            opcoes={[
              { valor: 'todos', texto: 'Todos' },
              { valor: 'ativa', texto: 'Ativa' },
              { valor: 'inativa', texto: 'Inativa' },
            ]}
          />
        </Filtro>
      </div>
      <div className="ga-rolagem">
        <table className="ga-tabela ga-tabela--cats">
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Descrição</th>
              <th>Itens vinculados</th>
              <th>Status</th>
              <th>Atualizado em</th>
              <th className="ga-centro">Ações</th>
            </tr>
          </thead>
          <tbody>
            {pg.fatia(lista).map((c, k) => {
              const n = conta(c.id)
              return (
                <motion.tr key={c.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: k * 0.03 }}>
                  <td>
                    <span className="ga-catnome">
                      <motion.img src={c.img} alt="" whileHover={{ scale: 1.15, rotate: -6 }} />
                      <strong>{c.nome}</strong>
                    </span>
                  </td>
                  <td className="ga-desc">{c.desc}</td>
                  <td>
                    <button className="ga-link ga-link--n" onClick={() => ir({ id: 'itens', cat: c.id })}>
                      {n} {n === 1 ? 'item' : 'itens'}
                    </button>
                  </td>
                  <td>
                    <ChipStatus st={c.status} />
                  </td>
                  <td className="ga-nowrap">{dataHora(c.atualizado)}</td>
                  <td>
                    <span className="ga-acoes">
                      <button className="ga-acao" onClick={() => setVer(c)} aria-label={`Ver ${c.nome}`} title="Visualizar">
                        <Eye size={18} />
                      </button>
                      <button className="ga-acao" onClick={() => setForm(c)} aria-label={`Editar ${c.nome}`} title="Editar">
                        <Pencil size={17} />
                      </button>
                      <Menu
                        icone={<Ellipsis size={18} />}
                        itens={[
                          {
                            texto: c.status === 'ativa' ? 'Inativar' : 'Ativar',
                            icone: <Power size={16} />,
                            fn: () => {
                              upd((x) => ({ ...x, cats: x.cats.map((y) => (y.id === c.id ? { ...y, status: c.status === 'ativa' ? 'inativa' : 'ativa', atualizado: AGORA } : y)) }))
                              toast(c.status === 'ativa' ? `“${c.nome}” inativada: os itens saem da vitrine da Lojinha.` : `“${c.nome}” ativada.`, c.status === 'ativa' ? 'info' : 'ok')
                            },
                          },
                          'sep',
                          {
                            texto: n ? 'Excluir (mova os itens antes)' : 'Excluir',
                            icone: <Trash2 size={16} />,
                            perigo: true,
                            disabled: n > 0,
                            fn: () => {
                              upd((x) => ({ ...x, cats: x.cats.filter((y) => y.id !== c.id) }))
                              toast('Categoria excluída.', 'info', { rotulo: 'Desfazer', fn: () => upd((x) => ({ ...x, cats: [...x.cats, c] })) })
                            },
                          },
                        ]}
                      />
                    </span>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
        {!lista.length && <p className="ga-vazio">Nenhuma categoria encontrada.</p>}
      </div>
      <Paginacao total={lista.length} pagina={pg.pagina} porPagina={pg.porPagina} onPagina={pg.setPagina} onPorPagina={pg.setPorPagina} rotulo={lista.length === 1 ? 'categoria' : 'categorias'} />

      <FormCategoria aberto={!!form} cat={form === 'nova' ? null : form} onFechar={() => setForm(null)} onSalvar={salvar} />
      <Modal aberto={!!ver} onFechar={() => setVer(null)} titulo={ver?.nome ?? ''} sub={ver?.desc} largura={560}>
        {ver && (
          <div className="ga-catitens">
            {d.itens
              .filter((i) => i.cat === ver.id)
              .slice(0, 8)
              .map((i) => (
                <button key={i.id} className="ga-catitem" onClick={() => (setVer(null), ir({ id: 'item-form', item: i.id }))}>
                  <Thumb item={i} tam={40} />
                  <span>{i.nome}</span>
                  <strong>{pts(i.pontos)}</strong>
                </button>
              ))}
            <Btn variante="contorno" onClick={() => (setVer(null), ir({ id: 'itens', cat: ver.id }))}>
              Ver todos os {conta(ver.id)} itens
            </Btn>
          </div>
        )}
      </Modal>
    </section>
  )
}

function FormCategoria({ aberto, cat, onFechar, onSalvar }: { aberto: boolean; cat: Categoria | null; onFechar: () => void; onSalvar: (c: Categoria) => void }) {
  const [nome, setNome] = useState('')
  const [desc, setDesc] = useState('')
  const [img, setImg] = useState(IMAGENS[0])
  const [ativa, setAtiva] = useState(true)
  const [tentou, setTentou] = useState(false)
  const [abertoAntes, setAbertoAntes] = useState(false)
  if (aberto && !abertoAntes) {
    setAbertoAntes(true)
    setNome(cat?.nome ?? '')
    setDesc(cat?.desc ?? '')
    setImg(cat?.img ?? IMAGENS[0])
    setAtiva(cat ? cat.status === 'ativa' : true)
    setTentou(false)
  }
  if (!aberto && abertoAntes) setAbertoAntes(false)
  const icone: IconeCat = cat?.icone ?? 'recompensa'
  return (
    <Modal
      aberto={aberto}
      onFechar={onFechar}
      titulo={cat ? 'Editar categoria' : 'Cadastrar categoria'}
      sub="As categorias organizam a vitrine da Lojinha."
      rodape={
        <>
          <Btn variante="contorno" onClick={onFechar}>
            Cancelar
          </Btn>
          <Btn
            onClick={() => {
              setTentou(true)
              if (!nome.trim()) return
              onSalvar({ id: cat?.id ?? `cat-${Date.now().toString(36)}`, nome: nome.trim(), desc: desc.trim() || '—', img, icone, status: ativa ? 'ativa' : 'inativa', atualizado: AGORA + 60_000 })
            }}
          >
            {cat ? 'Salvar' : 'Cadastrar'}
          </Btn>
        </>
      }
    >
      <label className={`ga-campo ${tentou && !nome.trim() ? 'is-erro' : ''}`}>
        <span>
          Nome <b>*</b>
        </span>
        <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Avatares" autoFocus />
        {tentou && !nome.trim() && <small>Informe o nome da categoria.</small>}
      </label>
      <label className="ga-campo">
        <span>Descrição</span>
        <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Ex.: Avatares para personalizar o perfil do estudante." />
      </label>
      <div className="ga-campo">
        <span>Ícone</span>
        <div className="ga-icones">
          {IMAGENS.map((x) => (
            <button key={x} type="button" className={img === x ? 'is-on' : ''} onClick={() => setImg(x)} aria-label="Escolher ícone">
              <img src={x} alt="" />
            </button>
          ))}
        </div>
      </div>
      <div className="ga-linha-toggle">
        <Toggle on={ativa} onChange={setAtiva} rotulo="Categoria ativa" />
        <span>
          <strong>{ativa ? 'Ativa' : 'Inativa'}</strong>
          <small>{ativa ? 'Visível na Lojinha da plataforma.' : 'Os itens dessa categoria não aparecem para os estudantes.'}</small>
        </span>
      </div>
      {ICONE_CAT[icone] && null}
    </Modal>
  )
}
