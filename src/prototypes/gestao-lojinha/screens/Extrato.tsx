import { motion } from 'framer-motion'
import { Building2, Coins, Landmark, Search, UsersRound } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { aplicar, useExtrato, usePessoa } from '../components/dados'
import { MovsTabela } from '../components/movs'
import { Avatar, Contador, Pop } from '../components/ui'
import { PLAT, pessoaAt, pts } from '../data'
import { useAdm } from '../store'
import { norm } from './comum'

/** Pontos e extrato de um estudante (com troca de estudante) */
export default function Extrato({ pessoa: idx }: { pessoa: number }) {
  const { s, ir } = useAdm()
  const pl = PLAT[s.plataforma]
  const p = usePessoa(idx)
  const movs = useExtrato(idx)
  const [trocar, setTrocar] = useState(false)
  const ref = useRef<HTMLButtonElement>(null)
  return (
    <div className="ga-extrato">
      <div className="ga-secao-tit">
        <h2>Pontos e extrato</h2>
        <p>Consulte o saldo e o histórico de movimentações de pontos dos {pl.publico.toLowerCase()}.</p>
      </div>
      <section className="ga-card ga-pessoa-cab">
        <button ref={ref} className="ga-pessoa-cab__quem" onClick={() => setTrocar((t) => !t)} title={`Trocar ${pl.singular.toLowerCase()}`}>
          <Avatar nome={p.nome} tam={58} />
          <span>
            <strong>{p.nome}</strong>
            <small>ID: {p.id}</small>
          </span>
          <em>
            <Search size={14} /> Trocar
          </em>
        </button>
        <i className="ga-det__div" />
        <span className="ga-det__info">
          <small>
            <Landmark size={17} /> Rede
          </small>
          <strong>{p.rede}</strong>
        </span>
        <span className="ga-det__info">
          <small>
            <Building2 size={17} /> Escola
          </small>
          <strong>{p.escola}</strong>
        </span>
        <span className="ga-det__info">
          <small>
            <UsersRound size={17} /> {s.plataforma === 'educadores' ? 'Função' : 'Turma'}
          </small>
          <strong>{p.turma}</strong>
        </span>
        <button className="ga-saldo" onClick={() => ir({ id: 'estudante', pessoa: idx })} title="Abrir perfil">
          <Coins size={30} strokeWidth={1.6} />
          <span>
            <small>Saldo atual</small>
            <strong>
              <Contador v={p.saldo} /> pts
            </strong>
          </span>
        </button>
      </section>
      <Trocar aberto={trocar} ancora={ref} onFechar={() => setTrocar(false)} onEscolher={(i) => (setTrocar(false), ir({ id: 'extrato', pessoa: i }))} />
      <motion.section key={idx} className="ga-card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <MovsTabela movs={movs} nomeArquivo={`extrato-${p.id}.csv`} />
      </motion.section>
    </div>
  )
}

function Trocar({ aberto, ancora, onFechar, onEscolher }: { aberto: boolean; ancora: React.RefObject<HTMLElement | null>; onFechar: () => void; onEscolher: (i: number) => void }) {
  const { s, d } = useAdm()
  const [q, setQ] = useState('')
  const lista = useMemo(() => {
    const out = []
    for (let i = 0; i < 600 && out.length < 8; i++) {
      const p = aplicar(pessoaAt(s.plataforma, i), d.statusPessoa[i], d.ajustes[i])
      if (!q.trim() || norm(`${p.nome} ${p.id}`).includes(norm(q.trim()))) out.push(p)
    }
    return out
  }, [q, s.plataforma, d.statusPessoa, d.ajustes])
  return (
    <Pop aberto={aberto} ancora={ancora} onFechar={onFechar} className="ga-pop--pessoas">
      <label className="ga-busca">
        <Search size={17} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nome ou ID" autoFocus />
      </label>
      {lista.map((p) => (
        <button key={p.idx} onClick={() => onEscolher(p.idx)}>
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
    </Pop>
  )
}
