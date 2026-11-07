import { motion } from 'framer-motion'
import { BarChart3, Building2, Coins, Ellipsis, Gift, Landmark, List, Power, SlidersHorizontal, TrendingDown, TrendingUp, UsersRound } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useExtrato, usePessoa } from '../components/dados'
import { MovsTabela } from '../components/movs'
import { Avatar, Btn, ChipStatus, Contador, Menu, Modal, Thumb } from '../components/ui'
import { AGORA, PLAT, dataHora, fmt, inicioPeriodo, pts } from '../data'
import { useAdm } from '../store'

type AbaP = 'movs' | 'resgates' | 'resumo'

/** Perfil de um estudante (ou educador) */
export default function EstudantePerfil({ pessoa: idx, aba: abaInicial }: { pessoa: number; aba?: AbaP }) {
  const { s, d, upd, ir, toast } = useAdm()
  const pl = PLAT[s.plataforma]
  const p = usePessoa(idx)
  const movs = useExtrato(idx)
  const [aba, setAba] = useState<AbaP>(abaInicial ?? 'movs')
  const [ajustar, setAjustar] = useState<number | null>(null)
  // indicadores do período selecionado no topo
  const doPeriodo = movs.filter((m) => m.data >= inicioPeriodo(s.periodo))
  const recebidos = doPeriodo.filter((m) => m.pontos > 0).reduce((a, m) => a + m.pontos, 0)
  const usados = doPeriodo.filter((m) => m.pontos < 0).reduce((a, m) => a + m.pontos, 0)
  const resgatesMovs = movs.filter((m) => m.tipo === 'resgate')
  const doAdmin = d.resgates.filter((r) => r.pessoa === idx)
  const kpis = [
    { I: Coins, t: 'Saldo atual', v: p.saldo, cor: 'laranja', fmt: 'pts' },
    { I: Gift, t: 'Total de resgates', v: Math.max(p.resgates, doAdmin.length), cor: 'roxo', fmt: '' },
    { I: TrendingUp, t: 'Pontos recebidos', v: recebidos, cor: 'verde', fmt: '+' },
    { I: TrendingDown, t: 'Pontos utilizados', v: Math.abs(usados), cor: 'vermelho', fmt: '-' },
  ]
  return (
    <div className="ga-perfil">
      <section className="ga-card ga-perfil__cab">
        <div className="ga-perfil__foto">{idx === 0 && s.plataforma === 'exploradores' ? <img src="./admin/larissa.webp" alt="" /> : <Avatar nome={p.nome} tam={112} />}</div>
        <div className="ga-perfil__quem">
          <strong>{p.nome}</strong>
          <small>ID: {p.id}</small>
          <ChipStatus st={p.status} />
        </div>
        <i className="ga-det__div" />
        <span className="ga-det__info ga-det__info--g">
          <small>
            <Landmark size={19} /> Rede
          </small>
          <strong>{p.rede}</strong>
        </span>
        <span className="ga-det__info ga-det__info--g">
          <small>
            <Building2 size={19} /> Escola
          </small>
          <strong>{p.escola}</strong>
        </span>
        <span className="ga-det__info ga-det__info--g">
          <small>
            <UsersRound size={19} /> {s.plataforma === 'educadores' ? 'Função' : 'Turma'}
          </small>
          <strong>{p.turma}</strong>
        </span>
        <Menu
          className="ga-perfil__menu"
          icone={<Ellipsis size={20} />}
          itens={[
            { texto: 'Ajustar saldo', icone: <SlidersHorizontal size={16} />, fn: () => setAjustar(idx) },
            { texto: 'Abrir extrato completo', icone: <Coins size={16} />, fn: () => ir({ id: 'extrato', pessoa: idx }) },
            'sep',
            {
              texto: p.status === 'ativo' ? 'Inativar na Lojinha' : 'Ativar na Lojinha',
              icone: <Power size={16} />,
              fn: () => {
                upd((x) => ({ ...x, statusPessoa: { ...x.statusPessoa, [idx]: p.status === 'ativo' ? 'inativo' : 'ativo' } }))
                toast(p.status === 'ativo' ? `${p.nome} não pode mais resgatar itens.` : `${p.nome} pode resgatar itens novamente.`, 'info')
              },
            },
          ]}
        />
      </section>

      <div className="ga-kpis">
        {kpis.map((k, i) => (
          <motion.div key={k.t} className={`ga-kpi ga-kpi--${k.cor}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <span className="ga-kpi__ic">
              <k.I size={30} strokeWidth={1.6} />
            </span>
            <span>
              <small>{k.t}</small>
              <strong>
                {k.fmt === '+' ? '+' : k.fmt === '-' ? '-' : ''}
                <Contador v={k.v} />
                {k.fmt && ' pts'}
              </strong>
            </span>
          </motion.div>
        ))}
      </div>

      <nav className="ga-abas ga-abas--p" role="tablist">
        {(
          [
            ['movs', 'Movimentações', List],
            ['resgates', 'Resgates', Gift],
            ['resumo', 'Resumo', BarChart3],
          ] as const
        ).map(([id, t, I]) => (
          <button key={id} role="tab" aria-selected={aba === id} className={`ga-aba ${aba === id ? 'is-on' : ''}`} onClick={() => setAba(id)}>
            {aba === id && <motion.span layoutId="ga-aba-perfil" className="ga-aba__pill" transition={{ type: 'spring', stiffness: 480, damping: 38 }} />}
            <I size={21} strokeWidth={1.8} />
            <span>{t}</span>
          </button>
        ))}
      </nav>

      <motion.section key={aba} className="ga-card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        {aba === 'movs' && <MovsTabela movs={movs} nomeArquivo={`extrato-${p.id}.csv`} porPagina={5} comResponsavel={false} titulo="Histórico de movimentações" />}
        {aba === 'resgates' && (
          <div className="ga-bloco">
            <h3>Resgates de {p.nome.split(' ')[0]}</h3>
            <div className="ga-resgp">
              {doAdmin.map((r) => {
                const it = d.itens.find((i) => i.id === r.item)!
                return (
                  <button key={r.codigo} className="ga-resgp__l" onClick={() => ir({ id: 'resgate', codigo: r.codigo })}>
                    <Thumb item={it} tam={46} />
                    <span>
                      <strong>{it.nome}</strong>
                      <small>
                        {r.codigo} · {dataHora(r.data)}
                      </small>
                    </span>
                    <em>{pts(r.pontos)}</em>
                    <ChipStatus st={r.status} />
                  </button>
                )
              })}
              {resgatesMovs
                .filter((m) => !doAdmin.some((r) => Math.abs(r.data - m.data) < 3_600_000 * 30 && r.item === m.item))
                .map((m) => {
                  const it = d.itens.find((i) => i.id === m.item)
                  return (
                    <div key={m.id} className="ga-resgp__l">
                      {it && <Thumb item={it} tam={46} />}
                      <span>
                        <strong>{m.desc}</strong>
                        <small>{dataHora(m.data)}</small>
                      </span>
                      <em>{pts(Math.abs(m.pontos))}</em>
                      <ChipStatus st="concluido" />
                    </div>
                  )
                })}
              {!doAdmin.length && !resgatesMovs.length && <p className="ga-vazio">Nenhum resgate ainda.</p>}
            </div>
          </div>
        )}
        {aba === 'resumo' && <Resumo movs={movs} />}
      </motion.section>
      <AjustarSaldo pessoa={ajustar} onFechar={() => setAjustar(null)} />
      {pl && null}
    </div>
  )
}

function Resumo({ movs }: { movs: ReturnType<typeof useExtrato> }) {
  const porOrigem = useMemo(() => {
    const m = new Map<string, number>()
    movs.filter((x) => x.pontos > 0).forEach((x) => m.set(x.origem, (m.get(x.origem) ?? 0) + x.pontos))
    return [...m.entries()].sort((a, b) => b[1] - a[1])
  }, [movs])
  const max = Math.max(1, ...porOrigem.map((x) => x[1]))
  const meses = useMemo(() => {
    const out: { m: string; ent: number; sai: number }[] = []
    for (let k = 5; k >= 0; k--) {
      const d0 = new Date(2026, 10 - k, 1).getTime()
      const d1 = new Date(2026, 11 - k, 1).getTime()
      const doMes = movs.filter((x) => x.data >= d0 && x.data < d1)
      out.push({ m: new Date(d0).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''), ent: doMes.filter((x) => x.pontos > 0).reduce((a, x) => a + x.pontos, 0), sai: -doMes.filter((x) => x.pontos < 0).reduce((a, x) => a + x.pontos, 0) })
    }
    return out
  }, [movs])
  const maxM = Math.max(1, ...meses.flatMap((x) => [x.ent, x.sai]))
  return (
    <div className="ga-resumo">
      <div className="ga-bloco">
        <h3>Pontos por mês</h3>
        <div className="ga-barras" role="img" aria-label="Pontos recebidos e utilizados nos últimos 6 meses">
          {meses.map((x, i) => (
            <div key={x.m} className="ga-barras__c">
              <div className="ga-barras__par">
                <motion.i className="is-ent" title={`+${fmt(x.ent)} pts`} initial={{ height: 0 }} animate={{ height: `${(x.ent / maxM) * 100}%` }} transition={{ delay: i * 0.05, type: 'spring', stiffness: 120, damping: 18 }} />
                <motion.i className="is-sai" title={`-${fmt(x.sai)} pts`} initial={{ height: 0 }} animate={{ height: `${(x.sai / maxM) * 100}%` }} transition={{ delay: i * 0.05 + 0.03, type: 'spring', stiffness: 120, damping: 18 }} />
              </div>
              <small>{x.m}</small>
            </div>
          ))}
        </div>
        <p className="ga-legenda">
          <i className="is-ent" /> Recebidos <i className="is-sai" /> Utilizados
        </p>
      </div>
      <div className="ga-bloco">
        <h3>De onde vêm os pontos</h3>
        <div className="ga-origens">
          {porOrigem.map(([o, v], i) => (
            <div key={o} className="ga-origens__l">
              <span>{o}</span>
              <span className="ga-origens__b">
                <motion.i initial={{ width: 0 }} animate={{ width: `${(v / max) * 100}%` }} transition={{ delay: i * 0.05, duration: 0.6 }} />
              </span>
              <strong>{pts(v)}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/** modal de ajuste manual de saldo (crédito ou débito com justificativa) */
export function AjustarSaldo({ pessoa: idx, onFechar }: { pessoa: number | null; onFechar: () => void }) {
  const { upd, toast } = useAdm()
  const p = usePessoa(idx ?? 0)
  const [tipo, setTipo] = useState<'credito' | 'debito'>('credito')
  const [valor, setValor] = useState('')
  const [motivo, setMotivo] = useState('')
  const n = Number(valor.replace(/\D/g, '')) || 0
  const fechar = () => {
    onFechar()
    setValor('')
    setMotivo('')
    setTipo('credito')
  }
  const invalido = !n || !motivo.trim() || (tipo === 'debito' && n > p.saldo)
  return (
    <Modal
      aberto={idx !== null}
      onFechar={fechar}
      titulo="Ajustar saldo"
      sub={`${p.nome} · saldo atual ${pts(p.saldo)}`}
      rodape={
        <>
          <Btn variante="contorno" onClick={fechar}>
            Cancelar
          </Btn>
          <Btn
            disabled={invalido}
            onClick={() => {
              const pontos = tipo === 'credito' ? n : -n
              upd((x) => ({ ...x, ajustes: { ...x.ajustes, [idx!]: [...(x.ajustes[idx!] ?? []), { id: `AJ-${Date.now()}`, data: AGORA + 60_000, tipo: 'ajuste', desc: `Ajuste manual: ${motivo.trim()}`, origem: 'Ajuste manual', pontos, saldoApos: 0, resp: 'FernanDesigner' }] } }))
              toast(`${tipo === 'credito' ? 'Crédito' : 'Débito'} de ${pts(n)} registrado para ${p.nome}.`)
              fechar()
            }}
          >
            Confirmar ajuste
          </Btn>
        </>
      }
    >
      <div className="ga-radios">
        {(
          [
            ['credito', 'Creditar pontos', 'Somar ao saldo'],
            ['debito', 'Debitar pontos', 'Subtrair do saldo'],
          ] as const
        ).map(([v, t, sub]) => (
          <button key={v} type="button" role="radio" aria-checked={tipo === v} className={`ga-radio ${tipo === v ? 'is-on' : ''}`} onClick={() => setTipo(v)}>
            <span className="ga-radio__bola">{tipo === v && <i />}</span>
            <span>
              <strong>{t}</strong>
              <small>{sub}</small>
            </span>
          </button>
        ))}
      </div>
      <label className="ga-campo">
        <span>Quantidade de pontos</span>
        <input inputMode="numeric" value={valor} onChange={(e) => setValor(Number(e.target.value.replace(/\D/g, '')) ? fmt(Number(e.target.value.replace(/\D/g, ''))) : '')} placeholder="Ex.: 10.000" autoFocus />
        {tipo === 'debito' && n > p.saldo && <small className="is-erro-txt">O débito não pode ser maior que o saldo.</small>}
      </label>
      <label className="ga-campo">
        <span>Motivo (obrigatório)</span>
        <input value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Ex.: Correção de pontos da Olimpíada" />
      </label>
      {n > 0 && (
        <p className="ga-saldo-check">
          Saldo após o ajuste: <strong>{pts(p.saldo + (tipo === 'credito' ? n : -n))}</strong>
        </p>
      )}
    </Modal>
  )
}
