import { motion } from 'framer-motion'
import { ArrowDown, CalendarDays, CircleMinus, CirclePlus, Download, RotateCcw, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ORIGENS, PERIODOS, dataHora, fmt, inicioPeriodo, type Item, type Mov, type Periodo, type TipoMov } from '../data'
import { useAdm } from '../store'
import { usePagina } from './dados'
import { Btn, Busca, Filtro, Paginacao, Select, Thumb, baixarCSV } from './ui'

const TIPO: Record<TipoMov, { t: string; I: typeof CirclePlus }> = {
  credito: { t: 'Crédito', I: CirclePlus },
  resgate: { t: 'Resgate', I: CircleMinus },
  estorno: { t: 'Estorno', I: RotateCcw },
  ajuste: { t: 'Ajuste', I: SlidersHorizontal },
}
const norm = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

/** tabela de movimentações de pontos com filtros e paginação */
export function MovsTabela({ movs, nomeArquivo, porPagina = 10, comResponsavel = true, titulo }: { movs: Mov[]; nomeArquivo: string; porPagina?: number; comResponsavel?: boolean; titulo?: string }) {
  const { s, d, toast } = useAdm()
  const [busca, setBusca] = useState('')
  const [tipo, setTipo] = useState<TipoMov | 'todos'>('todos')
  const [origem, setOrigem] = useState('todas')
  const [periodo, setPeriodo] = useState<Periodo | 'tudo'>(s.periodo)
  const [asc, setAsc] = useState(false)
  const pg = usePagina(porPagina)
  const itemDe = useMemo(() => Object.fromEntries(d.itens.map((i) => [i.id, i])) as Record<string, Item>, [d.itens])
  const lista = useMemo(() => {
    const ini = periodo === 'tudo' ? 0 : inicioPeriodo(periodo)
    const l = movs.filter((m) => m.data >= ini && (tipo === 'todos' || m.tipo === tipo) && (origem === 'todas' || m.origem === origem) && (!busca.trim() || norm(`${m.desc} ${m.id} ${m.origem}`).includes(norm(busca.trim()))))
    return asc ? [...l].reverse() : l
  }, [movs, periodo, tipo, origem, busca, asc])

  return (
    <div className="ga-movs">
      <div className="ga-filtros ga-filtros--movs">
        {titulo && <h3 className="ga-movs__tit">{titulo}</h3>}
        <Busca valor={busca} onChange={(v) => (setBusca(v), pg.setPagina(1))} placeholder="Buscar por item, descrição ou ID da movimentação" className="ga-busca--movs" />
        <Filtro rotulo="Tipo de movimentação">
          <Select
            valor={tipo}
            onChange={(v) => (setTipo(v), pg.setPagina(1))}
            opcoes={[{ valor: 'todos' as const, texto: 'Todos' }, ...(Object.keys(TIPO) as TipoMov[]).map((t) => ({ valor: t, texto: TIPO[t].t }))]}
          />
        </Filtro>
        <Filtro rotulo="Origem">
          <Select valor={origem} onChange={(v) => (setOrigem(v), pg.setPagina(1))} opcoes={[{ valor: 'todas', texto: 'Todas' }, ...ORIGENS.map((o) => ({ valor: o, texto: o }))]} />
        </Filtro>
        <Filtro rotulo="Período">
          <Select icone={<CalendarDays size={18} />} valor={periodo} onChange={(v) => (setPeriodo(v), pg.setPagina(1))} opcoes={[...PERIODOS, { valor: 'tudo' as const, texto: 'Todo o histórico' }]} />
        </Filtro>
        <Btn
          variante="contorno"
          className="ga-btn--exportar"
          icone={<Download size={18} />}
          onClick={() => {
            baixarCSV(nomeArquivo, [['Data e hora', 'Movimentação', 'Descrição', 'Origem', 'Pontos', 'Saldo após', 'Responsável', 'ID'], ...lista.map((m) => [dataHora(m.data), TIPO[m.tipo].t, m.desc, m.origem, m.pontos, m.saldoApos, m.resp, m.id])])
            toast(`Extrato exportado (${fmt(lista.length)} movimentações).`)
          }}
        >
          Exportar extrato
        </Btn>
      </div>
      <div className="ga-rolagem">
        <table className="ga-tabela ga-tabela--movs">
          <thead>
            <tr>
              <th>
                <button className="ga-th-ord" onClick={() => setAsc((a) => !a)} aria-label="Inverter ordem">
                  Data e hora <ArrowDown size={14} className={asc ? 'is-asc' : ''} />
                </button>
              </th>
              <th>Movimentação</th>
              <th>Descrição</th>
              <th>Origem</th>
              <th className="ga-dir">Pontos</th>
              <th className="ga-dir">Saldo após</th>
              {comResponsavel && <th>Responsável</th>}
            </tr>
          </thead>
          <tbody>
            {pg.fatia(lista).map((m, k) => {
              const { t, I } = TIPO[m.tipo]
              const it = m.item ? itemDe[m.item] : undefined
              return (
                <motion.tr key={m.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(k, 10) * 0.02 }}>
                  <td className="ga-nowrap">{dataHora(m.data)}</td>
                  <td>
                    <span className={`ga-mov ga-mov--${m.tipo}`}>
                      <I size={17} strokeWidth={2.4} />
                      {t}
                    </span>
                  </td>
                  <td>{it ? <span className="ga-produto ga-produto--forte"><Thumb item={it} tam={36} /><strong>{m.desc}</strong></span> : m.desc}</td>
                  <td className="ga-nowrap">{m.origem}</td>
                  <td className={`ga-dir ga-nowrap ga-pontos ${m.pontos < 0 ? 'is-neg' : ''}`}>
                    {m.pontos > 0 ? '+' : '-'}
                    {fmt(Math.abs(m.pontos))} pts
                  </td>
                  <td className="ga-dir ga-nowrap">{fmt(m.saldoApos)} pts</td>
                  {comResponsavel && <td className="ga-nowrap">{m.resp}</td>}
                </motion.tr>
              )
            })}
          </tbody>
        </table>
        {!lista.length && <p className="ga-vazio">Nenhuma movimentação com esses filtros.</p>}
      </div>
      <Paginacao total={lista.length} pagina={pg.pagina} porPagina={pg.porPagina} onPagina={pg.setPagina} onPorPagina={pg.setPorPagina} rotulo="movimentações" opcoes={[5, 10, 20, 50]} />
    </div>
  )
}
