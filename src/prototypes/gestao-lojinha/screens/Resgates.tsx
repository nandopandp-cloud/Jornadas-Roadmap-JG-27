import { motion } from 'framer-motion'
import { CircleCheck, CircleX, Download, Ellipsis, Eye, PackageCheck, Plus, Search, ThumbsUp, Truck, UserRound } from 'lucide-react'
import { useDeferredValue, useMemo, useState } from 'react'
import { aplicar, usePagina } from '../components/dados'
import { Avatar, Btn, Busca, ChipStatus, Filtro, Menu, Modal, Paginacao, Select, Thumb, baixarCSV, type ItemMenu } from '../components/ui'
import { AGORA, PLAT, REDES, STATUS_RESGATE, TURMAS, dataHora, fmt, inicioPeriodo, pessoaAt, pts, type Item, type Pessoa, type StatusResgate } from '../data'
import { useAdm } from '../store'
import { norm } from './comum'

/** Lista de resgates */
export default function Resgates({ status: stInicial }: { status?: StatusResgate }) {
  const { s, d, ir, mudarStatus, toast } = useAdm()
  const pl = PLAT[s.plataforma]
  const [busca, setBusca] = useState('')
  const q = useDeferredValue(busca)
  const [rede, setRede] = useState('todas')
  const [escola, setEscola] = useState('todas')
  const [turma, setTurma] = useState('todas')
  const [st, setSt] = useState<StatusResgate | 'todos'>(stInicial ?? 'todos')
  const [registrar, setRegistrar] = useState(false)
  const pg = usePagina(10)
  const ini = inicioPeriodo(s.periodo)
  const itemDe = useMemo(() => Object.fromEntries(d.itens.map((i) => [i.id, i])), [d.itens])

  const lista = useMemo(() => {
    const busc = norm(q.trim())
    return d.resgates.filter((r) => {
      if (r.data < ini) return false
      if (st !== 'todos' && r.status !== st) return false
      if (rede === 'todas' && escola === 'todas' && turma === 'todas' && !busc) return true
      const p = pessoaAt(s.plataforma, r.pessoa)
      if (rede !== 'todas' && p.rede !== rede) return false
      if (escola !== 'todas' && p.escola !== escola) return false
      if (turma !== 'todas' && p.turma !== turma) return false
      if (busc && !norm(`${p.nome} ${r.codigo} ${itemDe[r.item]?.nome ?? ''}`).includes(busc)) return false
      return true
    })
  }, [d.resgates, ini, st, rede, escola, turma, q, s.plataforma, itemDe])

  const escolas = rede === 'todas' ? Object.values(REDES).flat() : REDES[rede]
  const turmas = s.plataforma === 'exploradores' ? TURMAS : [...new Set(Array.from({ length: 40 }, (_, i) => pessoaAt(s.plataforma, i).turma))]
  const filtrado = busca || rede !== 'todas' || escola !== 'todas' || turma !== 'todas' || st !== 'todos'
  const limpar = () => {
    setBusca('')
    setRede('todas')
    setEscola('todas')
    setTurma('todas')
    setSt('todos')
    pg.setPagina(1)
  }
  const exportar = () => {
    const linhas = lista.slice(0, 5000).map((r) => {
      const p = pessoaAt(s.plataforma, r.pessoa)
      return [r.codigo, dataHora(r.data), p.nome, p.rede, p.escola, p.turma, itemDe[r.item]?.nome ?? '', r.pontos, STATUS_RESGATE[r.status]]
    })
    baixarCSV('resgates-lojinha.csv', [['Código', 'Data do resgate', pl.singular, 'Rede', 'Escola', 'Turma', 'Item', 'Pontos', 'Status'], ...linhas])
    toast(`Exportados ${fmt(linhas.length)} resgates.`)
  }
  /** próximos passos possíveis a partir do status atual */
  const proximos = (stAtual: StatusResgate): [StatusResgate, string, React.ReactNode][] => {
    const ordem: StatusResgate[] = ['solicitado', 'processamento', 'aprovado', 'enviado', 'concluido']
    if (stAtual === 'cancelado') return []
    return (
      [
        ['aprovado', 'Aprovar', <ThumbsUp size={16} />],
        ['enviado', 'Marcar como enviado', <Truck size={16} />],
        ['concluido', 'Concluir', <PackageCheck size={16} />],
      ] as [StatusResgate, string, React.ReactNode][]
    ).filter(([v]) => ordem.indexOf(v) > ordem.indexOf(stAtual))
  }

  return (
    <section className="ga-card">
      <div className="ga-card__cab ga-card__cab--g">
        <div>
          <h2>Resgates</h2>
          <p>Acompanhe e gerencie todos os resgates realizados pelos {pl.publico.toLowerCase()}.</p>
        </div>
        <div className="ga-card__acoes">
          <Btn variante="contorno" icone={<Download size={19} />} onClick={exportar}>
            Exportar
          </Btn>
          <Btn icone={<Plus size={20} />} onClick={() => setRegistrar(true)}>
            Registrar resgate
          </Btn>
        </div>
      </div>
      <div className="ga-filtros">
        <Busca valor={busca} onChange={(v) => (setBusca(v), pg.setPagina(1))} placeholder={`Buscar por ${pl.singular.toLowerCase()}, item ou código`} className="ga-busca--resg" />
        <Filtro rotulo="Rede">
          <Select valor={rede} onChange={(v) => (setRede(v), setEscola('todas'), pg.setPagina(1))} opcoes={[{ valor: 'todas', texto: 'Todas' }, ...Object.keys(REDES).map((r) => ({ valor: r, texto: r }))]} />
        </Filtro>
        <Filtro rotulo="Escola">
          <Select valor={escola} onChange={(v) => (setEscola(v), pg.setPagina(1))} opcoes={[{ valor: 'todas', texto: 'Todas' }, ...escolas.map((e) => ({ valor: e, texto: e }))]} />
        </Filtro>
        <Filtro rotulo={s.plataforma === 'educadores' ? 'Função' : 'Turma'}>
          <Select valor={turma} onChange={(v) => (setTurma(v), pg.setPagina(1))} opcoes={[{ valor: 'todas', texto: 'Todas' }, ...turmas.map((t) => ({ valor: t, texto: t }))]} />
        </Filtro>
        <Filtro rotulo="Status">
          <Select valor={st} onChange={(v) => (setSt(v), pg.setPagina(1))} opcoes={[{ valor: 'todos' as const, texto: 'Todos' }, ...(Object.keys(STATUS_RESGATE) as StatusResgate[]).map((x) => ({ valor: x, texto: STATUS_RESGATE[x] }))]} />
        </Filtro>
        <button className="ga-link ga-limpar" disabled={!filtrado} onClick={limpar}>
          Limpar filtros
        </button>
      </div>
      <div className="ga-rolagem">
        <table className="ga-tabela ga-tabela--resg">
          <thead>
            <tr>
              <th>Código</th>
              <th>Data do resgate</th>
              <th>{pl.singular}</th>
              <th>Rede</th>
              <th>Escola</th>
              <th>{s.plataforma === 'educadores' ? 'Função' : 'Turma'}</th>
              <th>Item</th>
              <th>Pontos</th>
              <th>Status</th>
              <th className="ga-centro">Ações</th>
            </tr>
          </thead>
          <tbody>
            {pg.fatia(lista).map((r, k) => {
              const p = pessoaAt(s.plataforma, r.pessoa)
              const it = itemDe[r.item]
              return (
                <motion.tr key={r.codigo} className="is-clicavel" onClick={() => ir({ id: 'resgate', codigo: r.codigo })} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(k, 10) * 0.02 }}>
                  <td className="ga-nowrap ga-codigo">{r.codigo}</td>
                  <td className="ga-nowrap">{dataHora(r.data)}</td>
                  <td>
                    <span className="ga-pessoa">
                      <Avatar nome={p.nome} tam={30} />
                      <strong>{p.nome}</strong>
                    </span>
                  </td>
                  <td className="ga-nowrap">{p.rede}</td>
                  <td className="ga-nowrap">{p.escola}</td>
                  <td className="ga-nowrap">{p.turma}</td>
                  <td>
                    {it && (
                      <span className="ga-produto">
                        <Thumb item={it} tam={34} />
                        <span>{it.nome}</span>
                      </span>
                    )}
                  </td>
                  <td className="ga-nowrap">
                    <strong>{pts(r.pontos)}</strong>
                  </td>
                  <td>
                    <ChipStatus st={r.status} />
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <span className="ga-acoes">
                      <button className="ga-acao" onClick={() => ir({ id: 'resgate', codigo: r.codigo })} aria-label={`Ver resgate ${r.codigo}`} title="Ver detalhes">
                        <Eye size={18} />
                      </button>
                      <Menu
                        icone={<Ellipsis size={18} />}
                        itens={[
                          ...proximos(r.status).map(([v, t, ic]): ItemMenu => ({
                            texto: t,
                            icone: ic,
                            fn: () => {
                              mudarStatus(r.codigo, v)
                              toast(`${r.codigo}: ${STATUS_RESGATE[v].toLowerCase()}.`)
                            },
                          })),
                          { texto: `Ver ${pl.singular.toLowerCase()}`, icone: <UserRound size={16} />, fn: () => ir({ id: 'estudante', pessoa: r.pessoa }) },
                          ...(r.status !== 'cancelado' && r.status !== 'concluido'
                            ? (['sep', { texto: 'Cancelar e estornar', icone: <CircleX size={16} />, perigo: true, fn: () => (mudarStatus(r.codigo, 'cancelado'), toast(`${r.codigo} cancelado. ${pts(r.pontos)} estornados.`, 'info')) }] as ItemMenu[])
                            : []),
                        ]}
                      />
                    </span>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
        {!lista.length && <p className="ga-vazio">Nenhum resgate encontrado com esses filtros.</p>}
      </div>
      <Paginacao total={lista.length} pagina={pg.pagina} porPagina={pg.porPagina} onPagina={pg.setPagina} onPorPagina={pg.setPorPagina} rotulo="resgates" />
      <Registrar aberto={registrar} onFechar={() => setRegistrar(false)} />
    </section>
  )
}

/* ---------------- registrar resgate manual ---------------- */
function Registrar({ aberto, onFechar }: { aberto: boolean; onFechar: () => void }) {
  const { s, d, upd, ir, toast } = useAdm()
  const pl = PLAT[s.plataforma]
  const [busca, setBusca] = useState('')
  const [pessoa, setPessoa] = useState<Pessoa | null>(null)
  const [item, setItem] = useState('')
  const candidatos = useMemo(() => {
    const q = norm(busca.trim())
    const out: Pessoa[] = []
    for (let i = 0; i < 400 && out.length < 6; i++) {
      const p = aplicar(pessoaAt(s.plataforma, i), d.statusPessoa[i], d.ajustes[i])
      if (!q || norm(`${p.nome} ${p.id}`).includes(q)) out.push(p)
    }
    return out
  }, [busca, s.plataforma, d.statusPessoa, d.ajustes])
  const it: Item | undefined = d.itens.find((i) => i.id === item)
  const falta = pessoa && it ? it.pontos - pessoa.saldo : 0
  const fechar = () => {
    onFechar()
    setPessoa(null)
    setItem('')
    setBusca('')
  }
  return (
    <Modal
      aberto={aberto}
      onFechar={fechar}
      titulo="Registrar resgate"
      sub={`Registre um resgate em nome de um ${pl.singular.toLowerCase()} (ex.: troca presencial no Clube).`}
      largura={600}
      rodape={
        <>
          <Btn variante="contorno" onClick={fechar}>
            Cancelar
          </Btn>
          <Btn
            icone={<CircleCheck size={19} />}
            disabled={!pessoa || !it || falta > 0}
            onClick={() => {
              if (!pessoa || !it) return
              const codigo = `#RG-${String(14583 + d.resgates.length - d.resgates.length + Math.floor(Math.random() * 9)).padStart(6, '0')}`
              upd((x) => ({
                ...x,
                resgates: [{ codigo, data: AGORA + 60_000, pessoa: pessoa.idx, item: it.id, pontos: it.pontos, status: 'aprovado' }, ...x.resgates],
                itens: x.itens.map((i) => (i.id === it.id ? { ...i, resgates: i.resgates + 1, estoque: i.estoque != null ? i.estoque - 1 : null } : i)),
                ajustes: { ...x.ajustes, [pessoa.idx]: [...(x.ajustes[pessoa.idx] ?? []), { id: `AJ-${Date.now()}`, data: AGORA + 60_000, tipo: 'resgate', desc: it.nome, item: it.id, origem: 'Lojinha', pontos: -it.pontos, saldoApos: 0, resp: 'FernanDesigner' }] },
                eventos: { ...x.eventos, [codigo]: [{ acao: 'Resgate aprovado', data: AGORA + 90_000, autor: 'FernanDesigner' }] },
              }))
              fechar()
              toast(`Resgate ${codigo} registrado para ${pessoa.nome}.`, 'ok', { rotulo: 'Ver', fn: () => ir({ id: 'resgate', codigo }) })
            }}
          >
            Registrar resgate
          </Btn>
        </>
      }
    >
      <div className="ga-campo">
        <span>{pl.singular}</span>
        {pessoa ? (
          <div className="ga-escolhido">
            <Avatar nome={pessoa.nome} />
            <span>
              <strong>{pessoa.nome}</strong>
              <small>
                {pessoa.id} · {pessoa.escola} · saldo {pts(pessoa.saldo)}
              </small>
            </span>
            <button className="ga-link" onClick={() => setPessoa(null)}>
              Trocar
            </button>
          </div>
        ) : (
          <>
            <label className="ga-busca">
              <Search size={18} />
              <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por nome ou ID" autoFocus />
            </label>
            <div className="ga-sugestoes">
              {candidatos.map((p) => (
                <button key={p.idx} onClick={() => setPessoa(p)}>
                  <Avatar nome={p.nome} tam={30} />
                  <span>
                    <strong>{p.nome}</strong>
                    <small>
                      {p.id} · {p.escola}
                    </small>
                  </span>
                  <em>{pts(p.saldo)}</em>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="ga-campo">
        <span>Item</span>
        <Select valor={item} onChange={setItem} opcoes={[...(item ? [] : [{ valor: '', texto: 'Selecione o item' }]), ...d.itens.filter((i) => i.status === 'ativo').slice(0, 60).map((i) => ({ valor: i.id, texto: `${i.nome} · ${pts(i.pontos)}` }))]} />
      </div>
      {pessoa && it && (
        <motion.div className={`ga-saldo-check ${falta > 0 ? 'is-erro' : ''}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          {falta > 0 ? (
            <>Saldo insuficiente: faltam {pts(falta)}.</>
          ) : (
            <>
              Saldo após o resgate: <strong>{pts(pessoa.saldo - it.pontos)}</strong>
            </>
          )}
        </motion.div>
      )}
    </Modal>
  )
}
