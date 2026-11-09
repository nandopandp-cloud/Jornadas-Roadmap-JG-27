import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  CircleHelp,
  Clock,
  Download,
  FileText,
  Flag,
  Home,
  Info,
  ListChecks,
  List,
  Lock,
  Menu,
  PenLine,
  Rocket,
  Search,
  Sparkles,
  Star,
  TrendingDown,
  TrendingUp,
  Trophy,
  UserRound,
  Users,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useMemo, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react'
import type { PrototypeProps } from '../../platform/journeys'
import {
  ALUNOS,
  BADGES,
  ELOS,
  ESCOLA,
  LOTES,
  ORDEM,
  TURMAS,
  alunoPorId,
  badgesDe,
  dataBadge,
  eloDe,
  fmt,
  modalidades,
  progressoNoElo,
  proximoTexto,
  serie,
  type Aluno,
  type EloId,
  type Mod,
  type StatusLote,
  type Turma,
} from './data'
import './rgx.css'

type Sub = 'resumo' | 'elos' | 'badges' | 'extrato'
type Tela = { id: 'turmas'; aba: 'visao' | 'gamificacao' } | { id: 'turma'; turma: string } | { id: 'estudantes' } | { id: 'estudante'; aluno: string; sub: Sub; de: 'turma' | 'estudantes' }
type Exportar = null | 'turma' | 'estudante' | 'turmas'

const INICIO: Record<string, { tela: Tela; exportar?: Exportar }> = {
  turmas: { tela: { id: 'turmas', aba: 'gamificacao' } },
  turma: { tela: { id: 'turma', turma: '8a' } },
  estudantes: { tela: { id: 'estudantes' } },
  resumo: { tela: { id: 'estudante', aluno: 'ana-caroline', sub: 'resumo', de: 'turma' } },
  elos: { tela: { id: 'estudante', aluno: 'ana-caroline', sub: 'elos', de: 'turma' } },
  badges: { tela: { id: 'estudante', aluno: 'ana-caroline', sub: 'badges', de: 'turma' } },
  extrato: { tela: { id: 'estudante', aluno: 'ana-caroline', sub: 'extrato', de: 'turma' } },
  'exportar-turma': { tela: { id: 'turma', turma: '8a' }, exportar: 'turma' },
  'exportar-estudante': { tela: { id: 'estudante', aluno: 'ana-caroline', sub: 'resumo', de: 'turma' }, exportar: 'estudante' },
}

function useMedia(q: string) {
  const [ok, setOk] = useState(() => window.matchMedia(q).matches)
  useEffect(() => {
    const m = window.matchMedia(q)
    const on = () => setOk(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [q])
  return ok
}

const eloPorId = (id: EloId) => ELOS.find((e) => e.id === id)!
const Medalha = ({ elo, size = 24, apagada }: { elo: EloId; size?: number; apagada?: boolean }) => (
  <img className="rx-medalha" src={`./geniex/medalha-${elo}.webp`} alt={`Elo ${eloPorId(elo).nome}`} style={{ width: size, height: size * 1.24, opacity: apagada ? 0.45 : 1 }} />
)
const Barra = ({ pct, cor, alto }: { pct: number; cor?: string; alto?: boolean }) => (
  <span className={`rx-barra ${alto ? 'is-alta' : ''}`}>
    <motion.i initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, ease: 'easeOut' }} style={{ background: cor }} />
  </span>
)
const Distribuicao = ({ dist }: { dist: number[] }) => (
  <span className="rx-dist">
    {dist.map((n, i) => (n ? <i key={i} style={{ flex: n, background: ELOS[i].claro }} title={`${ELOS[i].nome}: ${n}`} /> : null))}
  </span>
)
const Tile = ({ icon: I, tom = 'roxo', size = 48 }: { icon: LucideIcon; tom?: string; size?: number }) => (
  <span className={`rx-tile is-${tom}`} style={{ width: size, height: size }}>
    <I size={Math.round(size * 0.45)} />
  </span>
)

export default function GamificacaoEducadores({ startScreen }: PrototypeProps) {
  const ini = INICIO[startScreen ?? ''] ?? INICIO.turmas
  const [tela, setTela] = useState<Tela>(ini.tela)
  const [exportar, setExportar] = useState<Exportar>(ini.exportar ?? null)
  const [ancora, setAncora] = useState<{ top: number; right: number } | null>(null)
  const abrirExportar = (c: Exportar) => (ev?: MouseEvent) => {
    if (ev) { const r = (ev.currentTarget as HTMLElement).getBoundingClientRect(); setAncora({ top: r.bottom + 6, right: Math.max(16, window.innerWidth - r.right) }) } else setAncora(null)
    setExportar(c)
  }
  const [gaveta, setGaveta] = useState(false)
  const [recolhida, setRecolhida] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const celular = useMedia('(max-width: 899px)')

  useEffect(() => {
    document.title = 'Gamificação GenieX · Educadores · Protótipo Jovens Gênios'
  }, [])
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3400)
    return () => clearTimeout(t)
  }, [toast])

  const ir = (t: Tela) => {
    setTela(t)
    setExportar(null)
    setGaveta(false)
    document.querySelector('.rx-rolagem')?.scrollTo({ top: 0 })
  }
  const fora = (n: string) => setToast(`“${n}” não faz parte deste protótipo`)
  const baixar = (f: string) => {
    setExportar(null)
    setToast(`Gerando ${f}… o download começa em instantes.`)
  }

  const migalhas: string[] =
    tela.id === 'turmas'
      ? ['Início', 'Relatórios institucionais', 'Turmas']
      : tela.id === 'turma'
        ? ['Início', 'Relatórios institucionais', 'Turmas', `${TURMAS.find((t) => t.id === tela.turma)!.nome} · Gamificação`]
        : tela.id === 'estudantes'
          ? ['Início', 'Relatórios institucionais', 'Estudantes']
          : ['Início', 'Relatórios institucionais', 'Estudantes', alunoPorId(tela.aluno).nome]
  const ativo = tela.id === 'turmas' || tela.id === 'turma' ? 'turmas' : 'estudantes'

  return (
    <div className={`rx ${recolhida ? 'is-recolhida' : ''}`}>
      <AnimatePresence>{gaveta && <motion.div className="rx-veu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setGaveta(false)} />}</AnimatePresence>
      <Sidebar ativo={ativo} aberta={gaveta} onIr={(id) => ir(id === 'turmas' ? { id: 'turmas', aba: 'gamificacao' } : { id: 'estudantes' })} onFora={fora} onRecolher={() => (celular ? setGaveta(false) : setRecolhida((r) => !r))} recolhida={recolhida && !celular} />
      <div className="rx-principal">
        <header className="rx-topo">
          <button className="rx-icone-btn rx-topo__menu" onClick={() => setGaveta(true)} aria-label="Abrir menu">
            <Menu size={22} />
          </button>
          <nav className="rx-migalhas" aria-label="Você está em">
            {migalhas.map((m, i) => (
              <span key={i} className={i === migalhas.length - 1 ? 'is-atual' : ''}>
                {i > 0 && <i>/</i>}
                {m}
              </span>
            ))}
          </nav>
        </header>
        <main className="rx-rolagem">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={JSON.stringify(tela)} className="rx-conteudo" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.1 } }} transition={{ duration: 0.22 }}>
              {tela.id === 'turmas' && <Turmas aba={tela.aba} celular={celular} onAba={(aba) => setTela({ id: 'turmas', aba })} onTurma={(id) => ir({ id: 'turma', turma: id })} onExportar={abrirExportar('turmas')} />}
              {tela.id === 'turma' && <RelTurma turma={TURMAS.find((t) => t.id === tela.turma)!} celular={celular} onTurma={(id) => ir({ id: 'turma', turma: id })} onAluno={(id) => ir({ id: 'estudante', aluno: id, sub: 'resumo', de: 'turma' })} onExportar={abrirExportar('turma')} exportando={exportar === 'turma'} />}
              {tela.id === 'estudantes' && <Estudantes celular={celular} onAluno={(id) => ir({ id: 'estudante', aluno: id, sub: 'resumo', de: 'estudantes' })} onFora={fora} onExportar={abrirExportar('turmas')} />}
              {tela.id === 'estudante' && (
                <Estudante
                  aluno={alunoPorId(tela.aluno)}
                  sub={tela.sub}
                  celular={celular}
                  onSub={(sub) => setTela({ ...tela, sub })}
                  onVoltar={() => ir(tela.de === 'turma' ? { id: 'turma', turma: '8a' } : { id: 'estudantes' })}
                  voltar={tela.de === 'turma' ? 'Voltar para a turma' : 'Voltar para estudantes'}
                  onFora={fora}
                  onExportar={abrirExportar('estudante')}
                  exportando={exportar === 'estudante'}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {exportar && (
          <MenuExportar
            key="exp"
            contexto={exportar}
            celular={celular}
            ancora={ancora}
            onFechar={() => setExportar(null)}
            onEscolher={baixar}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div className="rx-toast" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}>
            <Info size={18} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ---------------- shell ---------------- */
function Sidebar({ ativo, aberta, recolhida, onIr, onFora, onRecolher }: { ativo: 'turmas' | 'estudantes'; aberta: boolean; recolhida: boolean; onIr: (id: 'turmas' | 'estudantes') => void; onFora: (n: string) => void; onRecolher: () => void }) {
  return (
    <aside className={`rx-side ${aberta ? 'is-aberta' : ''}`}>
      <div className="rx-side__marca">
        <img src="./cron/logo.webp" alt="Jovens Gênios" />
        <span className="rx-side__txt">
          <b>Educadores</b>
          <small>Jovens Gênios</small>
        </span>
        <button className="rx-icone-btn rx-side__recolher" onClick={onRecolher} aria-label={recolhida ? 'Expandir menu' : 'Recolher menu'} title={recolhida ? 'Expandir menu' : 'Recolher menu'}>
          {aberta ? <X size={18} /> : recolhida ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      <nav className="rx-side__nav">
        <button className="rx-side__item" onClick={() => onFora('Início')} title="Início">
          <Home size={18} /> <span>Início</span>
        </button>
        <p className="rx-side__sec">Funcionalidades</p>
        <div className="rx-side__item is-grupo" title="Relatórios">
          <BarChart3 size={18} /> <span>Relatórios</span> <ChevronDown size={16} className="rx-side__seta" />
        </div>
        <div className="rx-side__sub">
          <p>
            Institucionais <ChevronDown size={14} />
          </p>
          <div className="rx-side__nivel">
            <button onClick={() => onFora('Relatório da Escola')}>Escola</button>
            <button onClick={() => onFora('Relatório de Professores')}>Professores</button>
            <button className={ativo === 'turmas' ? 'is-on' : ''} onClick={() => onIr('turmas')}>
              Turmas
            </button>
            <button className={ativo === 'estudantes' ? 'is-on' : ''} onClick={() => onIr('estudantes')}>
              Estudantes
            </button>
          </div>
          <button className="rx-side__subitem" onClick={() => onFora('Relatórios de Atividades')}>
            Atividades <ChevronRight size={14} />
          </button>
        </div>
        <button className="rx-side__item" onClick={() => onFora('Gamificação')} title="Gamificação">
          <Star size={18} /> <span>Gamificação</span> <ChevronRight size={16} className="rx-side__seta" />
        </button>
        <button className="rx-side__item" onClick={() => onFora('Central de ajuda')} title="Central de ajuda">
          <CircleHelp size={18} /> <span>Central de ajuda</span> <ChevronRight size={16} className="rx-side__seta" />
        </button>
      </nav>
      <div className="rx-side__usuario">
        <span className="rx-avatar">
          <UserRound size={18} />
        </span>
        <span className="rx-side__txt">
          <b>Professor 01 - EFAFMAT8A</b>
          <small>prof01.efafmat8a@escolaestadual.com</small>
        </span>
      </div>
    </aside>
  )
}

const Alerta = () => (
  <div className="rx-alerta">
    <Info size={16} /> Os dados deste relatório podem levar até 2 horas para serem atualizados.
  </div>
)
function Abas<T extends string>({ itens, ativa, onTroca, nome }: { itens: [T, string, LucideIcon?][]; ativa: T; onTroca: (t: T) => void; nome: string }) {
  return (
    <div className="rx-abas" role="tablist" aria-label={nome}>
      {itens.map(([id, rot, I]) => (
        <button key={id} role="tab" aria-selected={ativa === id} className={ativa === id ? 'is-on' : ''} onClick={() => onTroca(id)}>
          {I && <I size={16} />} {rot}
          {ativa === id && <motion.span layoutId={'aba-' + nome} className="rx-abas__linha" />}
        </button>
      ))}
    </div>
  )
}
const Busca = ({ valor, onTroca, ph }: { valor: string; onTroca: (v: string) => void; ph: string }) => (
  <label className="rx-busca">
    <Search size={16} />
    <input value={valor} onChange={(e) => onTroca(e.target.value)} placeholder={ph} />
  </label>
)
const Th = ({ children, ord }: { children: ReactNode; ord?: boolean }) => (
  <span className="rx-th">
    {children} {ord && <ChevronsUpDown size={14} />}
  </span>
)

/* ---------------- T1 · Relatórios de Turmas ---------------- */
function Turmas({ aba, celular, onAba, onTurma, onExportar }: { aba: 'visao' | 'gamificacao'; celular: boolean; onAba: (a: 'visao' | 'gamificacao') => void; onTurma: (id: string) => void; onExportar: (ev?: MouseEvent) => void }) {
  const [q, setQ] = useState('')
  const lista = TURMAS.filter((t) => t.nome.toLowerCase().includes(q.trim().toLowerCase()))
  return (
    <>
      <h1 className="rx-h1">Relatórios de Turmas</h1>
      <Alerta />
      <Abas nome="relatorio" itens={[['visao', 'Visão geral', BarChart3], ['gamificacao', 'Gamificação', Trophy]]} ativa={aba} onTroca={onAba} />
      <section className="rx-cartao">
        <div className="rx-cartao__topo">
          <div>
            <h2>{aba === 'gamificacao' ? 'Gamificação por turma' : 'Relatórios de Turmas'}</h2>
            {aba === 'gamificacao' && <p>XP válido, elos e badges dos estudantes de cada turma. Abra uma turma para ver os estudantes.</p>}
          </div>
          <Busca valor={q} onTroca={setQ} ph="Pesquisar pelo nome..." />
          <button className="rx-btn is-primario" onClick={onExportar}>
            <Download size={16} /> Exportar <ChevronDown size={16} />
          </button>
        </div>
        {aba === 'visao' ? (
          <div className="rx-tabela-rola">
            <div className="rx-tabela rx-t-visao">
              <div className="rx-tr is-cab">
                <Th ord>Turma</Th>
                <Th ord>Ano escolar</Th>
                <Th ord>Estudantes</Th>
                <Th ord>Estudantes ativos</Th>
                <Th ord>Professores ativos</Th>
                <Th ord>Proficiência</Th>
              </div>
              {lista.map((t) => (
                <div key={t.id} className="rx-tr">
                  <b>{t.nome}</b>
                  <span>{t.ano}</span>
                  <span>{t.estudantes}</span>
                  <span>{t.ativos}</span>
                  <span>{t.professores}</span>
                  <span>
                    <em className={`rx-prof is-${t.proficiencia.replace(' ', '-').toLowerCase()}`}>{t.proficiencia}</em>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : celular ? (
          <div className="rx-cards">
            {lista.map((t) => (
              <CartaoTurma key={t.id} t={t} onAbrir={() => onTurma(t.id)} />
            ))}
          </div>
        ) : (
          <div className="rx-tabela-rola">
            <div className="rx-tabela rx-t-turmas">
              <div className="rx-tr is-cab">
                <Th ord>Turma</Th>
                <Th ord>Ano escolar</Th>
                <Th ord>Estudantes</Th>
                <Th ord>Com XP válido</Th>
                <Th ord>XP válido médio</Th>
                <Th ord>Elo médio</Th>
                <Th>Distribuição</Th>
                <span />
              </div>
              {lista.map((t) => {
                const e = eloDe(t.xpMedio)
                return (
                  <div key={t.id} className="rx-tr is-clicavel" onClick={() => onTurma(t.id)}>
                    <b>{t.nome}</b>
                    <span>{t.ano}</span>
                    <span>{t.estudantes}</span>
                    <span className="rx-cel-barra">
                      <b>{t.comXp}%</b> <Barra pct={t.comXp} cor="var(--rx-verde)" />
                    </span>
                    <b>{fmt(t.xpMedio)}</b>
                    <span className="rx-cel-elo">
                      <Medalha elo={e.id} size={18} /> {e.nome}
                    </span>
                    <Distribuicao dist={t.dist} />
                    <button className="rx-link" onClick={(ev) => { ev.stopPropagation(); onTurma(t.id) }}>
                      Ver relatório <ArrowRight size={16} />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        <p className="rx-rodape">
          {lista.length} de {TURMAS.length} turmas
        </p>
      </section>
    </>
  )
}
function CartaoTurma({ t, onAbrir }: { t: Turma; onAbrir: () => void }) {
  const e = eloDe(t.xpMedio)
  return (
    <article className="rx-card" onClick={onAbrir}>
      <b>{t.nome}</b>
      <small>
        {t.ano} · {t.estudantes} estudantes
      </small>
      <div className="rx-dados">
        <span>
          <small>Com XP válido</small>
          <b>{t.comXp}%</b>
        </span>
        <span>
          <small>XP válido médio</small>
          <b>{fmt(t.xpMedio)}</b>
        </span>
        <span>
          <small>Elo médio</small>
          <b className="rx-cel-elo">
            <Medalha elo={e.id} size={16} /> {e.nome}
          </b>
        </span>
        <span>
          <small>Distribuição</small>
          <Distribuicao dist={t.dist} />
        </span>
      </div>
      <span className="rx-link">
        Ver relatório <ArrowRight size={16} />
      </span>
    </article>
  )
}

/* ---------------- T2 · Relatório da turma ---------------- */
function RelTurma({ turma, celular, onTurma, onAluno, onExportar, exportando }: { turma: Turma; celular: boolean; onTurma: (id: string) => void; onAluno: (id: string) => void; onExportar: (ev?: MouseEvent) => void; exportando: boolean }) {
  const [aba, setAba] = useState<'todos' | EloId>('todos')
  const [q, setQ] = useState('')
  const [abreTurma, setAbreTurma] = useState(false)
  const alunos = ALUNOS.filter((x) => x.turma === 'EFAFMAT8A')
  const lista = alunos.filter((x) => (aba === 'todos' || eloDe(x.xp).id === aba) && x.nome.toLowerCase().includes(q.trim().toLowerCase()))
  const total = turma.estudantes
  return (
    <>
      <header className="rx-cab">
        <Tile icon={Trophy} size={56} />
        <div>
          <h1 className="rx-h1">Gamificação — Relatório por turma</h1>
          <p>Acompanhe o XP válido, os elos e as badges dos estudantes da sua turma na GenieX.</p>
        </div>
      </header>
      <Alerta />
      <section className="rx-cartao">
        <div className="rx-filtros">
          <label className="rx-rot">Turma</label>
          <div className="rx-select-wrap">
            <button className="rx-select" onClick={() => setAbreTurma((a) => !a)}>
              {turma.nome} – {turma.ano} <ChevronDown size={16} />
            </button>
            <AnimatePresence>
              {abreTurma && (
                <motion.div className="rx-pop" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  {TURMAS.map((t) => (
                    <button key={t.id} className={t.id === turma.id ? 'is-on' : ''} onClick={() => { setAbreTurma(false); onTurma(t.id) }}>
                      {t.nome} – {t.ano}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <span className="rx-espaco" />
          <Busca valor={q} onTroca={setQ} ph="Pesquisar estudante por nome..." />
          <button className={`rx-btn is-contorno ${exportando ? 'is-ativo' : ''}`} onClick={onExportar}>
            <Download size={16} /> Exportar <ChevronDown size={16} />
          </button>
        </div>
        <div className="rx-metricas">
          <Metrica icon={Users} tom="roxo" num={String(total)} rot="Estudantes na turma" />
          <Metrica icon={Zap} tom="verde" num={String(Math.round((total * turma.comXp) / 100))} rot="Estudantes com XP válido" extra={`${turma.comXp}% da turma`} barra={turma.comXp} />
          <Metrica icon={Trophy} tom="amarelo" num={fmt(turma.xpMedio)} rot="XP válido médio por estudante" extra={`Elo médio: ${eloDe(turma.xpMedio).nome}`} />
          <Metrica icon={Award} tom="azul" num={turma.badgesMedia} rot="Badges por estudante (média)" extra={`${turma.badgesTotal} badges conquistadas`} />
        </div>
        <div className="rx-sub-cartao">
          <div className="rx-sub-cartao__topo">
            <div>
              <h3>Distribuição por elo</h3>
              <p>Elo atual calculado sobre o XP válido de cada estudante.</p>
            </div>
            {turma.regressoes > 0 && (
              <em className="rx-selo is-red">
                <TrendingDown size={14} /> {turma.regressoes} regressões de elo nos últimos 30 dias
              </em>
            )}
          </div>
          <span className="rx-dist is-grande">
            {turma.dist.map((n, i) => (n ? <motion.i key={i} initial={{ flex: 0 }} animate={{ flex: n }} transition={{ duration: 0.6 }} style={{ background: ELOS[i].claro }} /> : null))}
          </span>
          <div className="rx-legenda">
            {ELOS.map((e, i) => (
              <button key={e.id} className={`rx-legenda__item ${aba === e.id ? 'is-on' : ''}`} style={{ background: e.tint, borderColor: aba === e.id ? 'var(--rx-roxo)' : e.borda }} onClick={() => setAba(aba === e.id ? 'todos' : e.id)}>
                <Medalha elo={e.id} size={26} />
                <span>
                  <b>{e.nome}</b>
                  <small>
                    {turma.dist[i]} estudantes · {Math.round((turma.dist[i] / total) * 100)}%
                  </small>
                </span>
              </button>
            ))}
          </div>
        </div>
        <Abas nome="elo" itens={[['todos', `Todos (${total})`], ...ELOS.map((e, i) => [e.id, `${e.nome} (${turma.dist[i]})`] as [EloId, string])]} ativa={aba} onTroca={setAba} />
        {celular ? (
          <div className="rx-cards">
            {lista.map((x) => (
              <CartaoAluno key={x.id} al={x} onAbrir={() => onAluno(x.id)} />
            ))}
          </div>
        ) : (
          <div className="rx-tabela-rola">
            <div className="rx-tabela rx-t-turma">
              <div className="rx-tr is-cab">
                <Th ord>Estudante</Th>
                <Th ord>Elo atual</Th>
                <Th ord>XP válido e próximo elo</Th>
                <Th ord>Badges</Th>
                <Th ord>Última atividade</Th>
                <span className="rx-th is-dir">Ação</span>
              </div>
              {lista.map((x) => {
                const e = eloDe(x.xp)
                return (
                  <div key={x.id} className="rx-tr is-clicavel" onClick={() => onAluno(x.id)}>
                    <span className="rx-cel-aluno">
                      <span className="rx-avatar">
                        <UserRound size={16} />
                      </span>
                      <b>{x.nome}</b>
                    </span>
                    <span className="rx-cel-elo">
                      <Medalha elo={e.id} size={22} />
                      <span>
                        {e.nome}
                        {x.era && (
                          <small className="is-red">
                            <TrendingDown size={12} /> Era {eloPorId(x.era).nome}
                          </small>
                        )}
                      </span>
                    </span>
                    <span className="rx-cel-xp">
                      <span>
                        <b>{fmt(x.xp)} XP</b> <Barra pct={progressoNoElo(x.xp)} cor={e.claro} />
                      </span>
                      <small className={x.xp >= 100000 ? 'is-roxo' : ''}>{proximoTexto(x.xp)}</small>
                    </span>
                    <span className="rx-cel-badge">
                      <Award size={16} /> {badgesDe(x).length} / 25
                    </span>
                    <span className="rx-mudo">{x.ultima}</span>
                    <button className="rx-link is-dir" onClick={(ev) => { ev.stopPropagation(); onAluno(x.id) }}>
                      Ver relatório <ArrowRight size={16} />
                    </button>
                  </div>
                )
              })}
              {!lista.length && <p className="rx-vazio">Nenhum estudante neste filtro.</p>}
            </div>
          </div>
        )}
        <p className="rx-rodape">
          Mostrando {lista.length} de {total} estudantes (amostra do protótipo)
        </p>
      </section>
    </>
  )
}
function Metrica({ icon, tom, num, rot, extra, barra }: { icon: LucideIcon; tom: string; num: string; rot: string; extra?: string; barra?: number }) {
  return (
    <div className="rx-metrica">
      <Tile icon={icon} tom={tom} />
      <span>
        <strong>{num}</strong>
        <small>{rot}</small>
        {extra && <em className={`is-${tom}`}>{extra}</em>}
        {barra !== undefined && <Barra pct={barra} cor="var(--rx-verde)" />}
      </span>
    </div>
  )
}
function CartaoAluno({ al, onAbrir }: { al: Aluno; onAbrir: () => void }) {
  const e = eloDe(al.xp)
  return (
    <article className="rx-card" onClick={onAbrir}>
      <span className="rx-card__topo">
        <Medalha elo={e.id} size={28} />
        <span>
          <b>{al.nome}</b>
          <small>
            {e.nome}
            {al.era && <em className="is-red"> · era {eloPorId(al.era).nome}</em>}
          </small>
        </span>
      </span>
      <span className="rx-cel-xp is-linha">
        <b>{fmt(al.xp)} XP</b> <Barra pct={progressoNoElo(al.xp)} cor={e.claro} />
      </span>
      <small>
        {proximoTexto(al.xp)} · {badgesDe(al).length}/25 badges · {al.ultima}
      </small>
      <span className="rx-link">
        Ver relatório <ArrowRight size={16} />
      </span>
    </article>
  )
}

/* ---------------- T3 · Relatórios de Estudantes ---------------- */
function Estudantes({ celular, onAluno, onFora, onExportar }: { celular: boolean; onAluno: (id: string) => void; onFora: (n: string) => void; onExportar: (ev?: MouseEvent) => void }) {
  const [q, setQ] = useState('')
  const [turma, setTurma] = useState('Todas')
  const lista = ALUNOS.filter((x) => (turma === 'Todas' || x.turma === turma) && x.nome.toLowerCase().includes(q.trim().toLowerCase()))
  return (
    <>
      <header className="rx-cab is-acao">
        <div>
          <h1 className="rx-h1">Relatórios de Estudantes</h1>
          <p>Acompanhe o desempenho, a participação e a evolução dos estudantes na GenieX.</p>
        </div>
        <button className="rx-btn is-contorno" onClick={onExportar}>
          <Download size={16} /> Exportar relatório <ChevronDown size={16} />
        </button>
      </header>
      <Alerta />
      <Abas
        nome="relatorio-est"
        itens={[['visao', 'Visão geral', BarChart3], ['desempenho', 'Desempenho em atividades', Sparkles], ['gamificacao', 'Gamificação', Trophy]]}
        ativa="gamificacao"
        onTroca={(t) => t !== 'gamificacao' && onFora(t === 'visao' ? 'Visão geral' : 'Desempenho em atividades')}
      />
      <section className="rx-cartao">
        <div className="rx-filtros is-rotulos">
          <label>
            <span className="rx-rot">Turma</span>
            <select className="rx-select" value={turma} onChange={(e) => setTurma(e.target.value)}>
              <option>Todas</option>
              <option>EFAFMAT8A</option>
              <option>EFAFMAT9A</option>
            </select>
          </label>
          <label>
            <span className="rx-rot">Escola</span>
            <select className="rx-select">
              <option>Todas</option>
              <option>{ESCOLA}</option>
            </select>
          </label>
          <label>
            <span className="rx-rot">Ano escolar</span>
            <select className="rx-select">
              <option>Todos</option>
              <option>8º ano</option>
              <option>9º ano</option>
            </select>
          </label>
          <span className="rx-espaco" />
          <Busca valor={q} onTroca={setQ} ph="Pesquisar pelo nome..." />
        </div>
        {celular ? (
          <div className="rx-lista">
            {lista.map((x) => {
              const e = eloDe(x.xp)
              return (
                <button key={x.id} className="rx-lista__item" onClick={() => onAluno(x.id)}>
                  <Medalha elo={e.id} size={28} />
                  <span>
                    <b>{x.nome}</b>
                    <small>
                      {x.ano} · {x.turma} · {e.nome}
                    </small>
                    <span className="rx-cel-xp is-linha">
                      <Barra pct={progressoNoElo(x.xp)} cor={e.claro} /> <b>{fmt(x.xp)} XP</b>
                    </span>
                  </span>
                  <ChevronRight size={18} />
                </button>
              )
            })}
          </div>
        ) : (
          <div className="rx-tabela-rola">
            <div className="rx-tabela rx-t-estudantes">
              <div className="rx-tr is-cab">
                <Th ord>Estudante</Th>
                <Th ord>Ano escolar</Th>
                <Th ord>Escola</Th>
                <Th ord>Turma</Th>
                <Th ord>XP válido</Th>
                <Th ord>Elo atual</Th>
                <span />
              </div>
              {lista.map((x) => {
                const e = eloDe(x.xp)
                return (
                  <div key={x.id} className="rx-tr is-clicavel" onClick={() => onAluno(x.id)}>
                    <b>{x.nome}</b>
                    <span>{x.ano}</span>
                    <span className="rx-mudo">{ESCOLA}</span>
                    <span>{x.turma}</span>
                    <span className="rx-cel-barra">
                      <Barra pct={progressoNoElo(x.xp)} cor={e.claro} /> <b>{fmt(x.xp)}</b>
                    </span>
                    <span className="rx-cel-elo">
                      <Medalha elo={e.id} size={20} /> {e.nome}
                    </span>
                    <ChevronRight size={18} className="rx-mudo" />
                  </div>
                )
              })}
            </div>
          </div>
        )}
        <p className="rx-rodape">
          {lista.length} de 92 estudantes (amostra do protótipo)
        </p>
      </section>
    </>
  )
}

/* ---------------- T4 · Estudante ---------------- */
function Estudante({ aluno, sub, celular, onSub, onVoltar, voltar, onFora, onExportar, exportando }: { aluno: Aluno; sub: Sub; celular: boolean; onSub: (s: Sub) => void; onVoltar: () => void; voltar: string; onFora: (n: string) => void; onExportar: (ev?: MouseEvent) => void; exportando: boolean }) {
  return (
    <>
      <button className="rx-link" onClick={onVoltar}>
        <ArrowLeft size={16} /> {voltar}
      </button>
      <header className="rx-cab is-acao is-aluno">
        <span className="rx-avatar is-g">
          <UserRound size={28} />
        </span>
        <div>
          <h1 className="rx-h1">{aluno.nome}</h1>
          <p>
            {aluno.ano} · {aluno.turma} · {ESCOLA} · {aluno.email}
          </p>
        </div>
        <button className={`rx-btn is-contorno ${exportando ? 'is-ativo' : ''}`} onClick={onExportar}>
          <Download size={16} /> Exportar relatório <ChevronDown size={16} />
        </button>
      </header>
      <Abas
        nome="aluno"
        itens={[['visao', 'Visão geral'], ['engajamento', 'Engajamento'], ['aprendizagem', 'Aprendizagem'], ['glossario', 'Glossário'], ['gamificacao', 'Gamificação', Trophy]]}
        ativa="gamificacao"
        onTroca={(t) => t !== 'gamificacao' && onFora({ visao: 'Visão geral', engajamento: 'Engajamento', aprendizagem: 'Aprendizagem', glossario: 'Glossário' }[t as 'visao'])}
      />
      <div className="rx-subnav" role="tablist" aria-label="Gamificação">
        {(
          [
            ['resumo', 'Resumo', BarChart3],
            ['elos', 'Elos', Trophy],
            ['badges', 'Badges', Award],
            ['extrato', 'Extrato de XP', List],
          ] as [Sub, string, LucideIcon][]
        ).map(([id, rot, I]) => (
          <button key={id} role="tab" aria-selected={sub === id} className={sub === id ? 'is-on' : ''} onClick={() => onSub(id)}>
            {sub === id && <motion.span layoutId="subnav" className="rx-subnav__fundo" />}
            <I size={16} /> <span>{rot}</span>
          </button>
        ))}
      </div>
      {sub === 'resumo' && <Resumo al={aluno} celular={celular} onSub={onSub} />}
      {sub === 'elos' && <Elos al={aluno} />}
      {sub === 'badges' && <Badges al={aluno} />}
      {sub === 'extrato' && <Extrato al={aluno} celular={celular} />}
    </>
  )
}

function Resumo({ al, celular, onSub }: { al: Aluno; celular: boolean; onSub: (s: Sub) => void }) {
  const e = eloDe(al.xp)
  const prox = ELOS[ELOS.indexOf(e) + 1]
  const bs = badgesDe(al)
  const proxB = BADGES.find((b) => b.xp > al.pico)
  const mods = modalidades(al)
  return (
    <>
      <div className="rx-grid3">
        <div className="rx-elo-card" style={{ background: e.tint, borderColor: e.borda }}>
          <Medalha elo={e.id} size={celular ? 56 : 72} />
          <span>
            <small>Elo atual</small>
            <strong>{e.nome}</strong>
            <span className="rx-xp">{fmt(al.xp)} XP válidos</span>
            <small>
              {e.faixa} · Maior elo: {eloDe(al.pico).nome}
            </small>
          </span>
        </div>
        <div className="rx-cartao is-p">
          <h3>Progresso para o próximo elo</h3>
          <Barra pct={progressoNoElo(al.xp)} alto />
          {prox ? (
            <>
              <span className="rx-faixa">
                <small>
                  {fmt(e.min)} · {e.nome}
                </small>
                <small>
                  {fmt(prox.min)} · {prox.nome}
                </small>
              </span>
              <p className="rx-faltam">
                <Rocket size={16} /> Faltam {fmt(prox.min - al.xp)} XP válidos para alcançar o elo {prox.nome}.
              </p>
            </>
          ) : (
            <p className="rx-faltam">
              <Star size={16} /> Elo máximo da GenieX alcançado.
            </p>
          )}
        </div>
        <div className="rx-cartao is-p">
          <span className="rx-xpbox">
            <Tile icon={Zap} size={44} />
            <span>
              <small>XP válido</small>
              <strong>{fmt(al.xp)}</strong>
            </span>
          </span>
          <span className="rx-xpsub">
            <span>
              <TrendingUp size={16} className="is-verde" />
              <small>Total já conquistado</small>
              <b>{fmt(al.conquistado)}</b>
            </span>
            <span>
              <TrendingDown size={16} className="is-red" />
              <small>Total expirado</small>
              <b>{fmt(al.conquistado - al.xp)}</b>
            </span>
          </span>
        </div>
      </div>
      <div className="rx-grid21">
        <div className="rx-cartao is-p">
          <h3>
            Evolução do XP válido <Info size={14} />
          </h3>
          <p className="rx-mudo">Saldo válido ao fim de cada mês (o XP expira em 50% após 3 meses e o restante após 6).</p>
          <Grafico al={al} />
        </div>
        <div className="rx-cartao is-p">
          <h3>XP conquistado por modalidade</h3>
          <div className="rx-rosca-linha">
            <Rosca mods={mods} total={al.conquistado} />
            <ul className="rx-mods">
              {mods.map((m) => (
                <li key={m.id}>
                  <i style={{ background: m.cor }} /> <span>{m.nome}</span> <b>{fmt(m.v)}</b> <small>{al.conquistado ? Math.round((m.v / al.conquistado) * 100) : 0}%</small>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="rx-grid21">
        <div className="rx-cartao is-p">
          <div className="rx-cartao__topo">
            <h3>Últimas atividades com XP</h3>
            <button className="rx-link" onClick={() => onSub('extrato')}>
              Ver extrato completo <ArrowRight size={16} />
            </button>
          </div>
          <ul className="rx-ativs">
            {LOTES.filter((l) => l.concedido > 0).slice(0, 4).map((l) => (
              <li key={l.data + l.atividade}>
                <small>{l.data}</small>
                <IconeMod mod={l.mod} />
                <b>
                  {l.atividade} · {l.detalhe.split(' · ')[0]}
                </b>
                <strong>+ {fmt(l.concedido)} XP</strong>
                <small>Expira em {l.quando}</small>
              </li>
            ))}
          </ul>
        </div>
        <div className="rx-cartao is-p">
          <div className="rx-cartao__topo">
            <h3>Badges</h3>
            <em className="rx-selo is-roxo">
              <Award size={14} /> {bs.length} de 25
            </em>
          </div>
          <Barra pct={(bs.length / 25) * 100} />
          {bs.length > 0 && (
            <p className="rx-linha-cinza">
              <CheckCircle2 size={18} className="is-verde" />
              <span>
                <b>Última conquistada: {bs[bs.length - 1].nome}</b>
                <small>
                  {dataBadge(bs.length - 1)} · elo {eloPorId(bs[bs.length - 1].elo).nome}
                </small>
              </span>
            </p>
          )}
          {proxB && (
            <p className="rx-linha-cinza">
              <Lock size={18} />
              <span>
                <b>Próxima: {proxB.nome}</b>
                <small>
                  Com {fmt(proxB.xp)} XP válidos · faltam {fmt(proxB.xp - al.xp)}
                </small>
              </span>
            </p>
          )}
          <button className="rx-link" onClick={() => onSub('badges')}>
            Ver todas as badges <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </>
  )
}
function Grafico({ al }: { al: Aluno }) {
  const s = serie(al)
  const max = Math.max(20000, Math.ceil(Math.max(...s.map((p) => p.v)) / 10000) * 10000)
  const W = 640, H = 200, x0 = 48, x1 = W - 16, y0 = 12, y1 = 168
  const px = (i: number) => x0 + ((x1 - x0) * i) / (s.length - 1)
  const py = (v: number) => y1 - ((y1 - y0) * v) / max
  const d = s.map((p, i) => `${i ? 'L' : 'M'} ${px(i)} ${py(p.v)}`).join(' ')
  const pico = s.reduce((m, p, i) => (p.v > s[m].v ? i : m), 0)
  return (
    <svg className="rx-grafico" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Evolução do XP válido">
      {[0, 0.25, 0.5, 0.75, 1].map((f) => (
        <g key={f}>
          <line x1={x0} x2={x1} y1={py(max * f)} y2={py(max * f)} className="rx-grafico__grade" />
          <text x={0} y={py(max * f) + 4} className="rx-grafico__eixo">
            {fmt(max * f)}
          </text>
        </g>
      ))}
      <motion.path d={`${d} L ${x1} ${y1} L ${x0} ${y1} Z`} className="rx-grafico__area" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} />
      <motion.path d={d} className="rx-grafico__linha" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, ease: 'easeOut' }} />
      {s.map((p, i) => (
        <g key={p.mes}>
          <circle cx={px(i)} cy={py(p.v)} r={4} className="rx-grafico__ponto" />
          <text x={px(i)} y={H - 4} textAnchor="middle" className="rx-grafico__eixo">
            {p.mes}
          </text>
        </g>
      ))}
      {s[s.length - 1].v < s[pico].v && (
        <text x={px(pico + 1)} y={py(s[pico + 1].v) + 24} textAnchor="middle" className="rx-grafico__nota">
          ↘ Lotes expiraram
        </text>
      )}
    </svg>
  )
}
function Rosca({ mods, total }: { mods: { v: number; cor: string; nome: string }[]; total: number }) {
  const r = 52, c = 2 * Math.PI * r
  let acum = 0
  return (
    <svg className="rx-rosca" viewBox="0 0 140 140" role="img" aria-label="XP por modalidade">
      <circle cx="70" cy="70" r={r} className="rx-rosca__trilho" />
      {total > 0 &&
        mods.map((m) => {
          const f = m.v / total
          const el = (
            <motion.circle key={m.nome} cx="70" cy="70" r={r} stroke={m.cor} strokeDasharray={`${f * c - 3} ${c}`} strokeDashoffset={-acum * c} className="rx-rosca__arco" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
          )
          acum += f
          return el
        })}
      <text x="70" y="68" textAnchor="middle" className="rx-rosca__num">
        {fmt(total)}
      </text>
      <text x="70" y="86" textAnchor="middle" className="rx-rosca__rot">
        XP total
      </text>
    </svg>
  )
}
const ICONES_MOD: Record<Mod, [LucideIcon, string]> = { Redação: [PenLine, 'red'], Simulado: [FileText, 'azul'], Quiz: [ListChecks, 'roxo'] }
const IconeMod = ({ mod }: { mod: Mod }) => {
  const [I, tom] = ICONES_MOD[mod]
  return <Tile icon={I} tom={tom} size={32} />
}

function Elos({ al }: { al: Aluno }) {
  const e = eloDe(al.xp)
  const maior = eloDe(al.pico)
  const idx = ELOS.indexOf(e)
  return (
    <>
      <div className="rx-grid3">
        <ResumoMini icon={Trophy} tom="roxo" rot="Elo atual" val={e.nome} sub="Calculado sobre o XP válido" />
        <ResumoMini icon={Award} tom="amarelo" rot="Maior elo alcançado" val={maior.nome} sub={`Pico de ${fmt(al.pico)} XP válidos`} />
        <ResumoMini icon={TrendingDown} tom="red" rot="Regressões de elo" val={al.era ? '1' : 'Nenhuma'} sub={al.era ? `Voltou do ${eloPorId(al.era).nome} com a expiração de lotes` : `Saldo atual: ${fmt(al.xp)} XP válidos`} />
      </div>
      <section className="rx-cartao is-p">
        <h3>Os elos da GenieX</h3>
        <p className="rx-mudo">O elo é calculado sobre o XP válido. Se o XP expira, o estudante pode voltar de elo; as badges conquistadas continuam com ele.</p>
        <div className="rx-elos">
          {ELOS.map((el, i) => (
            <div key={el.id} className={`rx-elo ${i === idx ? 'is-atual' : ''}`} style={{ background: el.tint, borderColor: i === idx ? 'var(--rx-roxo)' : el.borda }}>
              <Medalha elo={el.id} size={52} apagada={i > idx} />
              <b>{el.nome}</b>
              <small>{el.faixa.replace(' válidos', '')}</small>
              <em className={`rx-selo ${i < idx ? 'is-verde' : i === idx ? 'is-roxo' : ''}`}>
                {i < idx ? <CheckCircle2 size={13} /> : i === idx ? <Star size={13} /> : <Lock size={13} />}
                {i < idx ? 'Alcançado' : i === idx ? 'Elo atual' : `Faltam ${fmt(el.min - al.xp)} XP`}
              </em>
            </div>
          ))}
        </div>
      </section>
      <section className="rx-cartao is-p">
        <h3>Histórico de elos</h3>
        <ul className="rx-hist">
          {al.era && (
            <li className="is-atual">
              <Medalha elo={e.id} size={28} />
              <span>
                <b>Voltou para o {e.nome} (atual)</b>
                <small>O saldo válido caiu com a expiração de lotes. O estudante recebeu um aviso na GenieX.</small>
              </span>
              <small>12 set. 2026</small>
            </li>
          )}
          {ELOS.slice(1, (al.era ? ORDEM.indexOf(al.era) : idx) + 1)
            .reverse()
            .map((el, k) => (
              <li key={el.id} className={!al.era && k === 0 ? 'is-atual' : ''}>
                <Medalha elo={el.id} size={28} />
                <span>
                  <b>
                    Subiu para o {el.nome}
                    {!al.era && k === 0 ? ' (atual)' : ''}
                  </b>
                  <small>Chegou a {fmt(el.min)} XP válidos.</small>
                </span>
                <small>{['18 jun. 2026', '9 set. 2026', '3 out. 2026', '27 out. 2026'][ELOS.indexOf(el) - 1]}</small>
              </li>
            ))}
          <li className={idx === 0 && !al.era ? 'is-atual' : ''}>
            <Medalha elo="bronze" size={28} />
            <span>
              <b>Começou no Bronze</b>
              <small>Primeira atividade com XP na GenieX.</small>
            </span>
            <small>12 mar. 2026</small>
          </li>
        </ul>
      </section>
      <p className="rx-dica">
        <Info size={16} /> Quando um estudante volta de elo, ele recebe um aviso na GenieX explicando que a mudança aconteceu pela redução do XP válido. Para o professor, a regressão aparece aqui e na lista da turma.
      </p>
    </>
  )
}
const ResumoMini = ({ icon, tom, rot, val, sub }: { icon: LucideIcon; tom: string; rot: string; val: string; sub: string }) => (
  <div className="rx-cartao is-p is-linha">
    <Tile icon={icon} tom={tom} size={44} />
    <span>
      <small>{rot}</small>
      <strong className="is-m">{val}</strong>
      <small>{sub}</small>
    </span>
  </div>
)

const ICONE_BADGE: Record<string, LucideIcon> = { zap: Zap, trend: TrendingUp, target: CheckCircle2, check: CheckCircle2, award: Award, calendar: Calendar, flag: Flag, bulb: Sparkles, rocket: Rocket, shield: Award, sun: Star, cap: Trophy, trophy: Trophy, gem: Sparkles, star: Star }
function Badges({ al }: { al: Aluno }) {
  const bs = badgesDe(al)
  const [aberto, setAberto] = useState<EloId | null>(null)
  return (
    <>
      <section className="rx-cartao is-p is-linha">
        <Tile icon={Award} size={48} />
        <span className="rx-cresce">
          <strong className="is-m">{bs.length} de 25 badges conquistadas</strong>
          <small className="rx-mudo">As badges são permanentes: continuam com o estudante mesmo se o XP expirar ou o elo mudar. Cada uma exige um total de XP válido.</small>
          <Barra pct={(bs.length / 25) * 100} />
        </span>
      </section>
      {ELOS.map((el) => {
        const lista = BADGES.filter((b) => b.elo === el.id)
        const n = lista.filter((b) => b.xp <= al.pico).length
        return (
          <section key={el.id} className="rx-cartao is-p">
            <button className="rx-grupo-cab" onClick={() => setAberto(aberto === el.id ? null : el.id)}>
              <Medalha elo={el.id} size={26} />
              <span>
                <b>Badges do {el.nome}</b>
                <small>{el.faixa.replace(' válidos', '')}</small>
              </span>
              <em className={`rx-selo ${n === 5 ? 'is-verde' : n ? 'is-roxo' : ''}`}>{n} de 5</em>
            </button>
            <div className="rx-badges">
              {lista.map((b) => {
                const on = b.xp <= al.pico
                const I = ICONE_BADGE[b.icone] ?? Award
                return (
                  <div key={b.id} className={`rx-badge ${on ? 'is-on' : ''}`}>
                    <span className="rx-emblema" style={on ? ({ '--c1': el.claro, '--c2': el.medio } as CSSProperties) : undefined}>
                      <I size={20} />
                      {!on && (
                        <i>
                          <Lock size={10} />
                        </i>
                      )}
                    </span>
                    <b>{b.nome}</b>
                    <small>{fmt(b.xp)} XP válidos</small>
                    <em className={on ? 'is-verde' : ''}>{on ? `Conquistada em ${dataBadge(BADGES.indexOf(b))}` : `Faltam ${fmt(b.xp - al.xp)} XP`}</em>
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}
    </>
  )
}

const STATUS_COR: Record<StatusLote, string> = { Válido: 'verde', 'Expira em breve': 'amarelo', '50% expirado': 'amarelo', Expirado: 'red', 'Limite diário': 'cinza' }
function Extrato({ al, celular }: { al: Aluno; celular: boolean }) {
  const [filtro, setFiltro] = useState<'Todos' | Mod>('Todos')
  const lotes = useMemo(() => LOTES.filter((l) => filtro === 'Todos' || l.mod === filtro), [filtro])
  return (
    <>
      <div className="rx-metricas">
        <Metrica icon={Zap} tom="roxo" num={fmt(al.xp)} rot="XP válido" extra="Conta para o elo e as badges" />
        <Metrica icon={TrendingUp} tom="verde" num={fmt(al.conquistado)} rot="Total já conquistado" />
        <Metrica icon={Clock} tom="amarelo" num="300" rot="Prestes a expirar" extra="Nos próximos 30 dias" />
        <Metrica icon={TrendingDown} tom="red" num={fmt(al.conquistado - al.xp)} rot="Já expirado" />
      </div>
      <section className="rx-cartao">
        <div className="rx-cartao__topo">
          <div>
            <h2>Extrato de XP</h2>
            <p>Cada atividade gera um lote com validade própria: 50% expira após 3 meses e o restante após 6.</p>
          </div>
          <div className="rx-pilulas">
            {(['Todos', 'Quiz', 'Simulado', 'Redação'] as const).map((f) => (
              <button key={f} className={filtro === f ? 'is-on' : ''} onClick={() => setFiltro(f)}>
                {f === 'Todos' ? 'Todos' : f === 'Quiz' ? 'Quizzes' : f === 'Simulado' ? 'Simulados' : 'Redações'}
              </button>
            ))}
          </div>
        </div>
        {celular ? (
          <div className="rx-cards">
            {lotes.map((l, i) => (
              <article key={i} className={`rx-card is-estatico ${l.status === 'Expirado' || l.status === 'Limite diário' ? 'is-apagado' : ''}`}>
                <span className="rx-card__topo">
                  <IconeMod mod={l.mod} />
                  <span>
                    <b>
                      {l.atividade} <em className={`rx-tag is-${ICONES_MOD[l.mod][1]}`}>{l.mod}</em>
                    </b>
                    <small>
                      {l.data} · {l.detalhe}
                    </small>
                  </span>
                </span>
                <div className="rx-dados is-3">
                  <span>
                    <small>Concedido</small>
                    <b>{l.concedido ? `+ ${fmt(l.concedido)}` : '0'} XP</b>
                  </span>
                  <span>
                    <small>Vale hoje</small>
                    <b>{fmt(l.valido)} XP</b>
                  </span>
                  <span>
                    <small>Status</small>
                    <b className={`rx-status is-${STATUS_COR[l.status]}`}>
                      <i /> {l.status === 'Expira em breve' ? 'A expirar' : l.status}
                    </b>
                  </span>
                </div>
                <small>
                  {l.prox} · {l.quando}
                </small>
              </article>
            ))}
          </div>
        ) : (
          <div className="rx-tabela-rola">
            <div className="rx-tabela rx-t-extrato">
              <div className="rx-tr is-cab">
                <Th>
                  Data <ChevronDown size={14} />
                </Th>
                <Th>Atividade</Th>
                <Th>XP concedido</Th>
                <Th>XP válido</Th>
                <Th>Próxima expiração</Th>
                <Th>Status</Th>
              </div>
              {lotes.map((l, i) => (
                <div key={i} className={`rx-tr ${l.status === 'Expirado' || l.status === 'Limite diário' ? 'is-apagado' : ''}`}>
                  <b>{l.data}</b>
                  <span className="rx-cel-ativ">
                    <IconeMod mod={l.mod} />
                    <span>
                      <b>
                        {l.atividade} <em className={`rx-tag is-${ICONES_MOD[l.mod][1]}`}>{l.mod}</em>
                      </b>
                      <small>{l.detalhe}</small>
                    </span>
                  </span>
                  <b className={l.concedido ? '' : 'rx-mudo'}>{l.concedido ? `+ ${fmt(l.concedido)}` : '0'} XP</b>
                  <span className={l.valido ? '' : 'rx-mudo'}>{fmt(l.valido)} XP</span>
                  <span className="rx-cel-prox">
                    <b className={l.status === 'Expira em breve' ? 'is-amarelo' : ''}>{l.prox}</b>
                    <small>{l.quando}</small>
                  </span>
                  <span className={`rx-status is-${STATUS_COR[l.status]}`}>
                    <i /> {l.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        <p className="rx-rodape">
          {lotes.length} lotes (amostra do protótipo)
        </p>
      </section>
    </>
  )
}

/* ---------------- Exportar (com véu) ---------------- */
function MenuExportar({ contexto, celular, ancora, onFechar, onEscolher }: { contexto: 'turma' | 'estudante' | 'turmas'; celular: boolean; ancora: { top: number; right: number } | null; onFechar: () => void; onEscolher: (f: string) => void }) {
  useEffect(() => {
    const on = (e: KeyboardEvent) => e.key === 'Escape' && onFechar()
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [onFechar])
  const itens: [LucideIcon, string, string, string][] =
    contexto === 'estudante'
      ? [
          [Download, 'Relatório de gamificação (.PDF)', 'Elo, progresso, evolução do XP, modalidades, badges e últimas atividades.', 'o relatório em PDF'],
          [FileText, 'Extrato de XP (.CSV)', 'Todos os lotes de XP com validade, valor atual e status.', 'o extrato em CSV'],
        ]
      : contexto === 'turma'
        ? [
            [FileText, 'Planilha (.CSV)', 'Uma linha por estudante: elo, XP válido, próximo elo, badges e última atividade.', 'a planilha CSV da turma'],
            [Download, 'Relatório (.PDF)', 'Métricas da turma, distribuição por elo e a lista de estudantes.', 'o relatório PDF da turma'],
          ]
        : [[FileText, 'Planilha (.CSV)', 'Uma linha por turma com as colunas da tabela.', 'a planilha CSV']]
  return (
    <>
      <motion.div className="rx-veu is-exportar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onFechar} />
      <motion.div
        className={celular ? 'rx-folha' : 'rx-menu'}
        style={!celular && ancora ? { top: ancora.top, right: ancora.right } : undefined}
        role="dialog"
        aria-label="Exportar como"
        initial={celular ? { y: '100%' } : { opacity: 0, y: -6, scale: 0.98 }}
        animate={celular ? { y: 0 } : { opacity: 1, y: 0, scale: 1 }}
        exit={celular ? { y: '100%' } : { opacity: 0, y: -6 }}
        transition={{ type: 'spring', stiffness: 420, damping: 36 }}
      >
        {celular && <i className="rx-folha__alca" />}
        <p className="rx-menu__rot">Exportar como</p>
        {itens.map(([I, t, s, f]) => (
          <button key={t} onClick={() => onEscolher(f)}>
            <I size={18} />
            <span>
              <b>{t}</b>
              <small>{s}</small>
            </span>
          </button>
        ))}
        {celular && (
          <button className="rx-btn is-contorno is-cheio" onClick={onFechar}>
            Cancelar
          </button>
        )}
      </motion.div>
    </>
  )
}
