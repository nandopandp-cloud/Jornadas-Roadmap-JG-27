import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useMemo } from 'react'
import { CATEGORIAS_NOME } from './comum'
import { Avatar, ChipStatus, Thumb } from '../components/ui'
import { dataHora, inicioPeriodo, pessoaAt, pts } from '../data'
import { useAdm } from '../store'

/** Visão geral — últimos resgates e itens mais resgatados */
export default function VisaoGeral() {
  const { s, d, ir } = useAdm()
  const ini = inicioPeriodo(s.periodo)
  const ultimos = useMemo(() => d.resgates.filter((r) => r.data >= ini).slice(0, 10), [d.resgates, ini])
  const top = useMemo(() => [...d.itens].sort((a, b) => b.resgates - a.resgates).slice(0, 3), [d.itens])
  const item = (id: string) => d.itens.find((i) => i.id === id)!
  return (
    <div className="ga-visao">
      <section className="ga-card ga-visao__ult">
        <div className="ga-card__cab">
          <h2>Últimos resgates</h2>
          <button className="ga-link" onClick={() => ir({ id: 'resgates' })}>
            Ver todos <ArrowRight size={18} />
          </button>
        </div>
        <div className="ga-rolagem">
          <table className="ga-tabela ga-tabela--compacta">
            <thead>
              <tr>
                <th>Data</th>
                <th>{s.plataforma === 'educadores' ? 'Educador' : 'Estudante'}</th>
                <th>Rede</th>
                <th>Escola</th>
                <th>{s.plataforma === 'educadores' ? 'Função' : 'Turma'}</th>
                <th>Produto</th>
                <th>Pontos</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {ultimos.map((r, i) => {
                const p = pessoaAt(s.plataforma, r.pessoa)
                const it = item(r.item)
                return (
                  <motion.tr key={r.codigo} className="is-clicavel" onClick={() => ir({ id: 'resgate', codigo: r.codigo })} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
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
                      <span className="ga-produto">
                        <Thumb item={it} tam={30} />
                        <span>{it.nome}</span>
                      </span>
                    </td>
                    <td className="ga-nowrap">
                      <strong>{pts(r.pontos)}</strong>
                    </td>
                    <td>
                      <ChipStatus st={r.status} />
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
          {!ultimos.length && <p className="ga-vazio">Nenhum resgate no período.</p>}
        </div>
      </section>

      <section className="ga-card ga-visao__top">
        <div className="ga-card__cab">
          <h2>Itens mais resgatados</h2>
          <button className="ga-link" onClick={() => ir({ id: 'itens', ordem: 'resgates' })}>
            Ver relatório <ArrowRight size={18} />
          </button>
        </div>
        {top.map((it, i) => (
          <motion.button key={it.id} className="ga-top" onClick={() => ir({ id: 'item-form', item: it.id })} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.07 }} whileHover={{ y: -2 }}>
            <Thumb item={it} tam={70} />
            <span className="ga-top__txt">
              <strong>{it.nome}</strong>
              <small>{CATEGORIAS_NOME(d.cats, it.cat)}</small>
            </span>
            <span className="ga-top__n">
              <strong>{it.resgates.toLocaleString('pt-BR')}</strong>
              <small>resgates</small>
            </span>
          </motion.button>
        ))}
      </section>
    </div>
  )
}
