import { motion } from 'framer-motion'
import { Coins, Download, Ellipsis, Eye, Gift, Layers, Power, SlidersHorizontal, TrendingUp, UsersRound } from 'lucide-react'
import { useDeferredValue, useMemo, useState } from 'react'
import { aplicar, usePagina } from '../components/dados'
import { Avatar, Busca, Caixa, ChipStatus, Contador, Filtro, Menu, Paginacao, Select, baixarCSV } from '../components/ui'
import { PLAT, REDES, TURMAS, dataHora, fmt, pessoaAt, pts, type Pessoa } from '../data'
import { useAdm } from '../store'
import { norm } from './comum'
import { AjustarSaldo } from './EstudantePerfil'

/** Estudantes (ou educadores) da plataforma */
export default function Estudantes() {
  const { s, d, upd, ir, toast } = useAdm()
  const pl = PLAT[s.plataforma]
  const [busca, setBusca] = useState('')
  const q = useDeferredValue(busca)
  const [rede, setRede] = useState('todas')
  const [escola, setEscola] = useState('todas')
  const [turma, setTurma] = useState('todas')
  const [st, setSt] = useState<'todos' | 'ativo' | 'inativo'>('todos')
  const [sel, setSel] = useState<number[]>([])
  const [ajustar, setAjustar] = useState<number | null>(null)
  const pg = usePagina(10)
  const filtrado = !!q.trim() || rede !== 'todas' || escola !== 'todas' || turma !== 'todas' || st !== 'todos'
  const pessoa = (i: number) => aplicar(pessoaAt(s.plataforma, i), d.statusPessoa[i], d.ajustes[i])

  // sem filtros: pagina direto pelo índice; com filtros: percorre a base inteira
  const filtrados = useMemo(() => {
    if (!filtrado) return null
    const busc = norm(q.trim())
    const out: number[] = []
    for (let i = 0; i < pl.totalPessoas; i++) {
      const p = pessoaAt(s.plataforma, i)
      if (rede !== 'todas' && p.rede !== rede) continue
      if (escola !== 'todas' && p.escola !== escola) continue
      if (turma !== 'todas' && p.turma !== turma) continue
      if (st !== 'todos' && (d.statusPessoa[i] ?? p.status) !== st) continue
      if (busc && !norm(`${p.nome} ${p.id}`).includes(busc)) continue
      out.push(i)
    }
    return out
  }, [filtrado, q, rede, escola, turma, st, s.plataforma, pl.totalPessoas, d.statusPessoa])
  const total = filtrados ? filtrados.length : pl.totalPessoas
  const indices = filtrados ? filtrados.slice((pg.pagina - 1) * pg.porPagina, pg.pagina * pg.porPagina) : Array.from({ length: Math.min(pg.porPagina, total - (pg.pagina - 1) * pg.porPagina) }, (_, k) => (pg.pagina - 1) * pg.porPagina + k)
  const linhas: Pessoa[] = indices.map(pessoa)
  const todosPag = linhas.length > 0 && linhas.every((p) => sel.includes(p.idx))
  const escolas = rede === 'todas' ? Object.values(REDES).flat() : REDES[rede]
  const turmas = s.plataforma === 'exploradores' ? TURMAS : [...new Set(Array.from({ length: 40 }, (_, i) => pessoaAt(s.plataforma, i).turma))]
  const alternarStatus = (ids: number[], novo: 'ativo' | 'inativo') => upd((x) => ({ ...x, statusPessoa: { ...x.statusPessoa, ...Object.fromEntries(ids.map((i) => [i, novo])) } }))

  const kpis = [
    { I: UsersRound, t: `Total de ${pl.publico.toLowerCase()}`, v: pl.totalPessoas, cor: 'azul' },
    { I: Layers, t: `${pl.publico} ativos`, v: pl.ativos, cor: 'verde', tag: '+12%' },
    { I: Gift, t: `${pl.publico} que resgataram`, v: pl.resgataram, cor: 'roxo', tag: '+18%' },
    { I: Coins, t: 'Pontos em circulação', v: pl.pontosCirculacao, cor: 'laranja', pts: true },
  ]
  return (
    <div className="ga-estud">
      <div className="ga-secao-tit">
        <h2>{pl.publico}</h2>
        <p>Acompanhe o saldo, os resgates e a atividade dos {pl.publico.toLowerCase()} na plataforma.</p>
      </div>
      <div className="ga-kpis">
        {kpis.map((k, i) => (
          <motion.div key={k.t} className={`ga-kpi ga-kpi--${k.cor}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <span className="ga-kpi__ic">
              <k.I size={30} strokeWidth={1.6} />
            </span>
            <span>
              <small>{k.t}</small>
              <strong>
                <Contador v={k.v} />
                {k.pts && ' pts'}
                {k.tag && (
                  <em>
                    <TrendingUp size={13} /> {k.tag}
                  </em>
                )}
              </strong>
            </span>
          </motion.div>
        ))}
      </div>
      <section className="ga-card">
        <div className="ga-filtros">
          <Busca valor={busca} onChange={(v) => (setBusca(v), pg.setPagina(1))} placeholder={`Buscar por ${pl.singular.toLowerCase()}, ID ou matrícula`} className="ga-busca--estud" />
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
            <Select
              valor={st}
              onChange={(v) => (setSt(v), pg.setPagina(1))}
              opcoes={[
                { valor: 'todos', texto: 'Todos' },
                { valor: 'ativo', texto: 'Ativo' },
                { valor: 'inativo', texto: 'Inativo' },
              ]}
            />
          </Filtro>
          <button
            className="ga-btn ga-btn--contorno ga-btn--exportar"
            onClick={() => {
              const ids = filtrados ?? Array.from({ length: Math.min(5000, total) }, (_, i) => i)
              baixarCSV(`${pl.publico.toLowerCase()}-lojinha.csv`, [[pl.singular, 'ID', 'Rede', 'Escola', s.plataforma === 'educadores' ? 'Função' : 'Turma', 'Saldo atual', 'Total de resgates', 'Último resgate', 'Status'], ...ids.slice(0, 5000).map((i) => { const p = pessoa(i); return [p.nome, p.id, p.rede, p.escola, p.turma, p.saldo, p.resgates, dataHora(p.ultimo), p.status] })])
              toast(`Exportados ${fmt(Math.min(5000, ids.length))} registros${ids.length > 5000 ? ' (limite de 5.000 por arquivo)' : ''}.`)
            }}
          >
            <Download size={18} />
            <span>Exportar dados</span>
          </button>
        </div>
        {sel.length > 0 && (
          <div className="ga-massa">
            <div className="ga-massa__in">
              <strong>{sel.length} selecionados</strong>
              <button className="ga-btn ga-btn--contorno ga-btn--p" onClick={() => (alternarStatus(sel, 'ativo'), toast('Contas ativadas.'), setSel([]))}>
                Ativar
              </button>
              <button className="ga-btn ga-btn--contorno ga-btn--p" onClick={() => (alternarStatus(sel, 'inativo'), toast('Contas inativadas na Lojinha.', 'info'), setSel([]))}>
                Inativar
              </button>
            </div>
          </div>
        )}
        <div className="ga-rolagem">
          <table className="ga-tabela ga-tabela--estud">
            <thead>
              <tr>
                <th className="ga-col-caixa">
                  <Caixa on={todosPag} onChange={() => setSel((x) => (todosPag ? x.filter((y) => !linhas.some((p) => p.idx === y)) : [...new Set([...x, ...linhas.map((p) => p.idx)])]))} rotulo="Selecionar página" />
                </th>
                <th>{pl.singular}</th>
                <th>ID / Matrícula</th>
                <th>Rede</th>
                <th>Escola</th>
                <th>{s.plataforma === 'educadores' ? 'Função' : 'Turma'}</th>
                <th>Saldo atual</th>
                <th className="ga-centro">Total de resgates</th>
                <th>Último resgate</th>
                <th>Status</th>
                <th className="ga-centro">Ações</th>
              </tr>
            </thead>
            <tbody>
              {linhas.map((p, k) => (
                <motion.tr key={p.idx} className={`is-clicavel ${sel.includes(p.idx) ? 'is-sel' : ''}`} onClick={() => ir({ id: 'estudante', pessoa: p.idx })} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: k * 0.02 }}>
                  <td className="ga-col-caixa" onClick={(e) => e.stopPropagation()}>
                    <Caixa on={sel.includes(p.idx)} onChange={() => setSel((x) => (x.includes(p.idx) ? x.filter((y) => y !== p.idx) : [...x, p.idx]))} rotulo={`Selecionar ${p.nome}`} />
                  </td>
                  <td>
                    <span className="ga-pessoa">
                      <Avatar nome={p.nome} tam={32} />
                      <strong>{p.nome}</strong>
                    </span>
                  </td>
                  <td className="ga-nowrap">{p.id}</td>
                  <td className="ga-nowrap">{p.rede}</td>
                  <td className="ga-nowrap">{p.escola}</td>
                  <td className="ga-nowrap">{p.turma}</td>
                  <td className="ga-nowrap">
                    <strong>{pts(p.saldo)}</strong>
                  </td>
                  <td className="ga-centro">{p.resgates}</td>
                  <td className="ga-nowrap">{dataHora(p.ultimo)}</td>
                  <td>
                    <ChipStatus st={p.status} />
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <span className="ga-acoes">
                      <button className="ga-acao" onClick={() => ir({ id: 'estudante', pessoa: p.idx })} aria-label={`Ver ${p.nome}`} title="Ver perfil">
                        <Eye size={18} />
                      </button>
                      <Menu
                        icone={<Ellipsis size={18} />}
                        itens={[
                          { texto: 'Ver extrato', icone: <Coins size={16} />, fn: () => ir({ id: 'extrato', pessoa: p.idx }) },
                          { texto: 'Ajustar saldo', icone: <SlidersHorizontal size={16} />, fn: () => setAjustar(p.idx) },
                          'sep',
                          { texto: p.status === 'ativo' ? 'Inativar na Lojinha' : 'Ativar na Lojinha', icone: <Power size={16} />, fn: () => (alternarStatus([p.idx], p.status === 'ativo' ? 'inativo' : 'ativo'), toast(p.status === 'ativo' ? `${p.nome} não pode mais resgatar itens.` : `${p.nome} pode resgatar itens novamente.`, 'info')) },
                        ]}
                      />
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {!total && <p className="ga-vazio">Nenhum registro encontrado com esses filtros.</p>}
        </div>
        <Paginacao total={total} pagina={pg.pagina} porPagina={pg.porPagina} onPagina={pg.setPagina} onPorPagina={pg.setPorPagina} rotulo={pl.publico.toLowerCase()} />
      </section>
      <AjustarSaldo pessoa={ajustar} onFechar={() => setAjustar(null)} />
    </div>
  )
}
