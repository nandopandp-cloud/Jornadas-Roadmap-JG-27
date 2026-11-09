import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Bell,
  BookOpen,
  Bot,
  Building2,
  Calendar,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  CircleHelp,
  CircleUserRound,
  CircleX,
  Clock,
  FileCheck2,
  Flag,
  Flame,
  Gem,
  GraduationCap,
  House,
  Info,
  Lightbulb,
  List,
  Lock,
  LogOut,
  Menu,
  MessageSquare,
  PanelLeft,
  PenLine,
  Rocket,
  Route,
  Search,
  Settings,
  ShieldCheck,
  Star,
  Sun,
  Target,
  TrendingUp,
  Trophy,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import type { PrototypeProps } from '../../platform/journeys'
import {
  BADGES,
  conquistada,
  ELOS,
  eloDe,
  eloPorId,
  ESTUDANTES,
  fmt,
  LOTES,
  MODALIDADE,
  proximaBadge,
  proximoElo,
  STATUS,
  type Badge,
  type Elo,
  type Estudante,
  type IconeBadge,
  type Lote,
  type Modalidade,
} from './data'
import './geniex.css'

type Tela = 'inicio' | 'elos' | 'elo' | 'badges' | 'extrato'
type Painel = { tipo: 'badge'; badge: Badge } | { tipo: 'lotes' } | { tipo: 'lote'; lote: Lote } | null
type Aviso = 'badge' | 'elo' | 'regressao' | null
type Estado = { tela: Tela; est: Estudante['id']; painel?: Painel; aviso?: Aviso; menu?: boolean; vazio?: boolean }

const ATALHOS: Record<string, Estado> = {
  inicio: { tela: 'inicio', est: 'padrao' },
  menu: { tela: 'inicio', est: 'padrao', menu: true },
  elos: { tela: 'elos', est: 'padrao' },
  elo: { tela: 'elo', est: 'padrao' },
  'elo-cosmico': { tela: 'elo', est: 'cosmico' },
  'elo-regressao': { tela: 'elo', est: 'regressao' },
  badges: { tela: 'badges', est: 'padrao' },
  badge: { tela: 'badges', est: 'padrao', painel: { tipo: 'badge', badge: BADGES[3] } },
  extrato: { tela: 'extrato', est: 'padrao' },
  'extrato-vazio': { tela: 'extrato', est: 'padrao', vazio: true },
  lotes: { tela: 'extrato', est: 'padrao', painel: { tipo: 'lotes' } },
  lote: { tela: 'extrato', est: 'padrao', painel: { tipo: 'lote', lote: LOTES[0] } },
  'aviso-badge': { tela: 'inicio', est: 'padrao', aviso: 'badge' },
  'aviso-elo': { tela: 'inicio', est: 'padrao', aviso: 'elo' },
  'aviso-regressao': { tela: 'elo', est: 'regressao', aviso: 'regressao' },
}

const ICONE: Record<IconeBadge, LucideIcon> = { zap: Zap, trend: TrendingUp, target: Target, check: CircleCheck, award: Award, calendar: Calendar, flag: Flag, bulb: Lightbulb, rocket: Rocket, shield: ShieldCheck, sun: Sun, cap: GraduationCap, trophy: Trophy, gem: Gem, star: Star }
const ICONE_MOD: Record<Modalidade, LucideIcon> = { quiz: List, sim: FileCheck2, red: PenLine }
const ATIVIDADES: [Modalidade, string, string][] = [
  ['quiz', 'Quizzes', 'Ganhe 10 XP por questão respondida corretamente.'],
  ['sim', 'Simulados', 'Ganhe 10 XP por questão respondida corretamente.'],
  ['red', 'Redações', 'Ganhe 1 XP por ponto da nota (0 a 1.000). Vale 1 redação por dia.'],
]
const CAMINHO: Record<Tela, string[]> = { inicio: ['Meu perfil', 'Minha evolução'], elos: ['Meu perfil', 'Minha evolução', 'Os elos'], elo: ['Meu perfil', 'Minha evolução', 'Meu elo atual'], badges: ['Meu perfil', 'Minha evolução', 'Badges'], extrato: ['Meu perfil', 'Minha evolução', 'Extrato de XP'] }

export default function GamificacaoGeniex({ startScreen }: PrototypeProps) {
  const ini = ATALHOS[startScreen ?? ''] ?? ATALHOS.inicio
  const [tela, setTela] = useState<Tela>(ini.tela)
  const [estId, setEstId] = useState<Estudante['id']>(ini.est)
  const [painel, setPainel] = useState<Painel>(ini.painel ?? null)
  const [aviso, setAviso] = useState<Aviso>(ini.aviso ?? null)
  const [menu, setMenu] = useState(!!ini.menu)
  const [gaveta, setGaveta] = useState(false)
  const [vazio] = useState(!!ini.vazio)
  const [toast, setToast] = useState<string | null>(null)
  const est = ESTUDANTES[estId]

  useEffect(() => {
    document.title = 'Gamificação GenieX · Protótipo Jovens Gênios'
  }, [])
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(t)
  }, [toast])

  const ir = (t: Tela, e: Estudante['id'] = estId) => {
    setTela(t)
    setEstId(e)
    setPainel(null)
    setMenu(false)
    setGaveta(false)
    document.querySelector('.gx-rolagem')?.scrollTo({ top: 0 })
  }
  const fora = (n: string) => {
    setMenu(false)
    setGaveta(false)
    setToast(`“${n}” não faz parte deste protótipo`)
  }
  const voltar = () => ir(tela === 'inicio' ? 'inicio' : 'inicio', 'padrao')

  return (
    <div className="gx">
      <Sidebar onFora={fora} onPerfil={() => setMenu((m) => !m)} perfilAtivo={menu} gaveta={gaveta} onFechar={() => setGaveta(false)} />
      <div className="gx-principal">
        <TopBar onMenu={() => setGaveta(true)} onFora={fora} />
        <main className="gx-rolagem">
          <div className="gx-conteudo">
            <Cabecalho tela={tela} onVoltar={voltar} />
            {tela === 'inicio' && <Inicio est={est} ir={ir} abrirBadge={(b) => setPainel({ tipo: 'badge', badge: b })} />}
            {tela === 'elos' && <Elos est={est} />}
            {tela === 'elo' && <MeuElo est={est} ir={ir} />}
            {tela === 'badges' && <Badges est={est} abrir={(b) => setPainel({ tipo: 'badge', badge: b })} />}
            {tela === 'extrato' && <Extrato est={est} vazio={vazio} ir={ir} abrirLotes={() => setPainel({ tipo: 'lotes' })} abrirLote={(l) => setPainel({ tipo: 'lote', lote: l })} onFora={fora} />}
          </div>
        </main>
      </div>

      <AnimatePresence>{menu && <MenuPerfil key="menu" est={est} onFechar={() => setMenu(false)} onEvolucao={() => ir('inicio', 'padrao')} onFora={fora} />}</AnimatePresence>
      <AnimatePresence>
        {painel && (
          <PainelLateral key="painel" titulo={painel.tipo === 'badge' ? painel.badge.nome : painel.tipo === 'lotes' ? 'Lotes prestes a expirar' : painel.lote.atividade} desc={painel.tipo === 'badge' ? `Badge do elo ${eloPorId(painel.badge.elo).nome} · ${conquistada(est, painel.badge) ? 'conquistada' : 'bloqueada'}` : painel.tipo === 'lotes' ? 'XP que deixa de contar nos próximos 30 dias.' : `${painel.lote.detalhe} · ${painel.lote.data}, ${painel.lote.hora}`} onFechar={() => setPainel(null)}>
            {painel.tipo === 'badge' && <DetalheBadge est={est} b={painel.badge} onFora={fora} />}
            {painel.tipo === 'lotes' && <LotesAExpirar onFora={fora} />}
            {painel.tipo === 'lote' && <DetalheLote l={painel.lote} onFora={fora} />}
          </PainelLateral>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {aviso && (
          <Avisos
            key="aviso"
            tipo={aviso}
            onFechar={() => setAviso(null)}
            onAcao={() => {
              setAviso(null)
              if (aviso === 'badge') ir('badges', 'padrao')
              else if (aviso === 'elo') ir('elos', 'padrao')
              else ir('extrato', 'padrao')
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {toast && (
          <motion.div className="gx-toast" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}>
            <Info size={18} />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ---------------------------------------------------------------- estrutura */
const NAV: [string, LucideIcon][][] = [
  [['Página Inicial', House], ['Ranking', Trophy]],
  [['Trilhas', Route], ['Cursos', GraduationCap], ['Biblioteca', BookOpen], ['Cronograma', Calendar], ['Instituição', Building2], ['Genie Bot', Bot]],
  [['Simulados', FileCheck2], ['Redação', PenLine]],
]
function Sidebar({ onFora, onPerfil, perfilAtivo, gaveta, onFechar }: { onFora: (n: string) => void; onPerfil: () => void; perfilAtivo: boolean; gaveta: boolean; onFechar: () => void }) {
  return (
    <>
      <AnimatePresence>{gaveta && <motion.div className="gx-veu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onFechar} />}</AnimatePresence>
      <aside className={`gx-side ${gaveta ? 'is-aberta' : ''}`}>
        <div className="gx-logo">
          <img className="gx-logo__completo" src="./geniex/logo-light.svg" alt="GenieX" />
          <img className="gx-logo__icone" src="./geniex/logo-light.svg" alt="GenieX" />
          <button className="gx-side__fechar" onClick={onFechar} aria-label="Fechar menu">
            <X size={20} />
          </button>
        </div>
        <nav className="gx-nav">
          {NAV.map((g, i) => (
            <div key={i} className="gx-nav__grupo">
              {i === 1 && <p className="gx-nav__titulo">Aprenda</p>}
              {i === 2 && <p className="gx-nav__titulo">Funcionalidades</p>}
              {g.map(([n, I]) => (
                <button key={n} className="gx-nav__item" onClick={() => onFora(n)} title={n}>
                  <I size={20} strokeWidth={1.8} />
                  <span>{n}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>
        <button className={`gx-perfil ${perfilAtivo ? 'is-ativo' : ''}`} onClick={onPerfil} aria-haspopup="menu" aria-expanded={perfilAtivo}>
          <img src="./geniex/avatar.webp" alt="" />
          <span>
            <b>Aluno GenieX</b>
            <small>aluno@jovensgenios.com</small>
          </span>
          <span className="gx-perfil__mais">•••</span>
        </button>
      </aside>
    </>
  )
}

function TopBar({ onMenu, onFora }: { onMenu: () => void; onFora: (n: string) => void }) {
  return (
    <header className="gx-top">
      <button className="gx-icone-btn gx-top__menu" onClick={onMenu} aria-label="Abrir menu">
        <Menu size={20} />
      </button>
      <button className="gx-icone-btn gx-top__painel" onClick={() => onFora('Recolher menu')} aria-label="Recolher menu">
        <PanelLeft size={20} />
      </button>
      <button className="gx-busca" onClick={() => onFora('Pesquisar')}>
        <Search size={18} />
        <span>Pesquisar</span>
        <kbd>⌘ + K</kbd>
      </button>
      <img className="gx-top__logo" src="./geniex/logo-light.svg" alt="GenieX" />
      <div className="gx-top__acoes">
        <button className="gx-ofensiva" onClick={() => onFora('Ofensiva')} title="Ofensiva (independente da gamificação)">
          <Flame size={18} /> 0
        </button>
        <span className="gx-sep" />
        <button className="gx-icone-btn is-azul" onClick={() => onFora('Genie Bot')} aria-label="Genie Bot">
          <MessageSquare size={20} />
        </button>
        <button className="gx-icone-btn" onClick={() => onFora('Notificações')} aria-label="Notificações">
          <Bell size={20} />
          <i className="gx-contador">2</i>
        </button>
        <button className="gx-icone-btn" onClick={() => onFora('Ajuda')} aria-label="Ajuda">
          <CircleHelp size={20} />
        </button>
      </div>
    </header>
  )
}

const SUB: Record<Tela, string> = {
  inicio: 'Acompanhe suas conquistas e continue avançando.',
  elos: 'Conquiste XP, evolua entre os elos e alcance novas conquistas.',
  elo: 'Veja os detalhes do seu elo, acompanhe seu progresso e continue evoluindo.',
  badges: 'Conquistas permanentes desbloqueadas pelo seu XP válido.',
  extrato: 'Cada atividade gera um lote de XP com validade própria. Veja quanto ganhou, quanto ainda vale e quando expira.',
}
const TITULO: Record<Tela, string> = { inicio: 'Minha evolução', elos: 'Os elos da GenieX', elo: 'Meu elo atual', badges: 'Minhas badges', extrato: 'Extrato de XP' }
const AVISO_TELA: Partial<Record<Tela, string>> = { elos: 'Seu elo é definido pelo seu XP válido. Continue realizando atividades para evoluir e alcançar novos elos!', badges: 'Badges conquistadas são suas para sempre: elas não somem se o XP expirar ou se o seu elo mudar.' }

function Cabecalho({ tela, onVoltar }: { tela: Tela; onVoltar: () => void }) {
  const cam = CAMINHO[tela]
  return (
    <div className={`gx-cab ${AVISO_TELA[tela] ? 'tem-aviso' : ''}`}>
      <div className="gx-cab__titulo">
        <button className="gx-voltar" onClick={onVoltar} aria-label="Voltar">
          <ArrowLeft size={20} />
        </button>
        <div>
          <nav className="gx-caminho" aria-label="Caminho">
            {cam.map((c, i) => (
              <span key={c}>
                {i > 0 && <ChevronRight size={14} />}
                <span className={i === cam.length - 1 ? 'is-atual' : ''}>{c}</span>
              </span>
            ))}
          </nav>
          <h1>{TITULO[tela]}</h1>
          <p>{SUB[tela]}</p>
        </div>
      </div>
      {AVISO_TELA[tela] && (
        <div className="gx-aviso">
          <Info size={20} />
          {AVISO_TELA[tela]}
        </div>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- peças */
const Medalha = ({ elo, size = 44 }: { elo: Elo; size?: number }) => <img className="gx-medalha" src={`./geniex/medalha-${elo.id}.webp`} alt={`Medalha ${elo.nome}`} style={{ width: size, height: size * 1.24 }} />
const Selo = ({ size = 40 }: { size?: number }) => <img src="./geniex/selo-xp.webp" alt="XP" style={{ width: size, height: size * 1.15 }} />

function Progresso({ atual, min, alvo, prox, caixa, verbo = 'alcançar o' }: { atual: number; min: number; alvo: number; prox: string; caixa?: boolean; verbo?: string }) {
  const pct = Math.max(2, Math.min(100, ((atual - min) / (alvo - min)) * 100))
  const pctTotal = Math.max(2, Math.min(100, (atual / alvo) * 100))
  return (
    <div className="gx-prog">
      <div className="gx-prog__rotulo">
        <span className={caixa ? 'is-caixa' : ''}>{caixa ? 'Progresso para o próximo elo' : 'Progresso para o próximo elo'}</span>
        <b>{prox}</b>
      </div>
      <div className="gx-barra">
        <motion.i initial={{ width: 0 }} animate={{ width: `${caixa ? pctTotal : pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} />
      </div>
      <small>
        {fmt(atual)} / {fmt(alvo)} XP
      </small>
      <p className="gx-faltam">
        <Rocket size={16} />
        <span>
          Faltam <b>{fmt(alvo - atual)} XP</b> para {verbo} elo {prox}.
        </span>
      </p>
    </div>
  )
}

function Emblema({ b, on, size = 64 }: { b: Badge; on: boolean; size?: number }) {
  const e = eloPorId(b.elo)
  const I = ICONE[b.icone]
  return (
    <span className={`gx-emblema ${on ? 'is-on' : ''}`} style={{ width: size, height: size, ['--c1' as string]: e.claro, ['--c2' as string]: e.medio, ['--c3' as string]: e.escuro }}>
      <i className="gx-emblema__fora" />
      <i className="gx-emblema__dentro" />
      <I size={size * 0.38} strokeWidth={2} />
      {!on && (
        <span className="gx-emblema__cadeado" style={{ width: size * 0.34, height: size * 0.34 }}>
          <Lock size={size * 0.18} />
        </span>
      )}
    </span>
  )
}

function CartaoBadge({ est, b, onClick, lista }: { est: Estudante; b: Badge; onClick: () => void; lista?: boolean }) {
  const on = conquistada(est, b)
  const falta = b.xp - est.xp
  return (
    <button className={`gx-badge ${on ? 'is-on' : ''} ${lista ? 'is-lista' : ''}`} onClick={onClick}>
      <Emblema b={b} on={on} size={lista ? 56 : 64} />
      <span className="gx-badge__txt">
        <b>{b.nome}</b>
        <small>{fmt(b.xp)} XP válidos</small>
        <em className={on ? 'is-ok' : falta <= 4000 ? 'is-perto' : ''}>{on ? `Conquistada em ${est.conquistas[b.id]}` : falta <= 4000 ? `Faltam ${fmt(falta)} XP` : 'Bloqueada'}</em>
      </span>
    </button>
  )
}

function Card({ className = '', children }: { className?: string; children: ReactNode }) {
  return <section className={`gx-card ${className}`}>{children}</section>
}

function ComoEvoluir({ titulo = 'Como evoluir', sub = 'Responda quizzes e simulados e produza redações para ganhar XP. Tarefas e Provas GenieX não geram XP.', colunas }: { titulo?: string; sub?: string | null; colunas?: boolean }) {
  return (
    <Card className="gx-evoluir">
      <h2>{titulo}</h2>
      {sub && <p className="gx-sub-azul">{sub}</p>}
      <div className={`gx-atividades ${colunas ? 'is-colunas' : ''}`}>
        {ATIVIDADES.map(([m, n, d]) => {
          const I = ICONE_MOD[m]
          return (
            <div key={m} className="gx-atividade">
              <span className="gx-tile" style={{ background: MODALIDADE[m].bg, color: MODALIDADE[m].cor }}>
                <I size={24} />
              </span>
              <span>
                <b>{n}</b>
                <small>{d}</small>
              </span>
              {!colunas && <ChevronRight size={20} className="gx-seta" />}
            </div>
          )
        })}
      </div>
    </Card>
  )
}

/* ---------------------------------------------------------------- telas */
function Inicio({ est, ir, abrirBadge }: { est: Estudante; ir: (t: Tela, e?: Estudante['id']) => void; abrirBadge: (b: Badge) => void }) {
  const elo = eloDe(est.xp)
  const prox = proximoElo(elo)
  const pb = proximaBadge(est)!
  const doElo = BADGES.filter((b) => b.elo === elo.id)
  const nOk = BADGES.filter((b) => conquistada(est, b)).length
  return (
    <>
      <section className="gx-banner" style={{ backgroundImage: "url(./geniex/banner-jornada.webp)" }}>
        <div className="gx-banner__texto">
          <img src="./geniex/logo-dark.svg" alt="GenieX" className="gx-banner__logo" />
          <p className="gx-eyebrow">SUA JORNADA</p>
          <h2>
            Pequenos passos
            <br />
            <span>grandes conquistas.</span>
          </h2>
          <i className="gx-banner__divisor" />
          <p>Responda quizzes e simulados, produza redações e acumule XP para evoluir na GenieX.</p>
        </div>
        <div className="gx-vidro">
          <div className="gx-vidro__topo">
            <div>
              <p className="gx-eyebrow">SEU ELO ATUAL</p>
              <p className="gx-vidro__elo">
                <Medalha elo={elo} size={30} /> {elo.nome}
              </p>
              <small>Maior elo alcançado: {eloPorId(est.maior).nome}</small>
            </div>
            <button className="gx-xpchip" onClick={() => ir('extrato')}>
              <Selo size={30} />
              <span>
                <b>{fmt(est.xp)}</b>
                <small>XP válidos</small>
              </span>
            </button>
          </div>
          <div className="gx-vidro__card">{prox && <Progresso atual={est.xp} min={elo.min} alvo={prox.min} prox={prox.nome} caixa verbo="chegar ao" />}</div>
        </div>
      </section>

      <div className="gx-resumo">
        <button className="gx-resumo__card" style={{ background: elo.tint, borderColor: elo.borda }} onClick={() => ir('elo')}>
          <span className="gx-circ" style={{ background: elo.circ }}>
            <Medalha elo={elo} />
          </span>
          <span>
            <b>Seu elo atual</b>
            <strong>{elo.nome}</strong>
            <small>{elo.faixa}</small>
          </span>
          <ChevronRight size={20} />
        </button>
        <button className="gx-resumo__card" style={{ background: '#f6f6ff', borderColor: '#e3e5ff' }} onClick={() => ir('extrato')}>
          <span className="gx-circ" style={{ background: '#e6e7ff' }}>
            <Selo size={42} />
          </span>
          <span>
            <b>XP acumulados</b>
            <strong>
              {fmt(est.xp)} <em>XP válidos</em>
            </strong>
            <small>Contam para seu elo e suas badges · ver extrato</small>
          </span>
          <ChevronRight size={20} />
        </button>
        {prox && (
          <button className="gx-resumo__card" style={{ background: '#f8f8f8', borderColor: '#e6e6e6' }} onClick={() => ir('elos')}>
            <span className="gx-circ" style={{ background: '#ededed' }}>
              <Medalha elo={prox} />
            </span>
            <span>
              <b>Próximo elo</b>
              <strong>{prox.nome}</strong>
              <small>{prox.faixa}</small>
            </span>
            <ChevronRight size={20} />
          </button>
        )}
      </div>
      <div className="gx-link-dir">
        <button className="gx-link" onClick={() => ir('elos')}>
          Conheça todos os elos da GenieX <ArrowRight size={18} />
        </button>
      </div>

      <Card className="gx-suas-badges">
        <div className="gx-card__cab">
          <div>
            <h2>Suas badges</h2>
            <p className="gx-sub-azul">{nOk} de 25 conquistadas · elas são suas para sempre, mesmo se o XP expirar.</p>
          </div>
          <button className="gx-link" onClick={() => ir('badges')}>
            Ver todas as badges <ArrowRight size={18} />
          </button>
        </div>
        <div className="gx-grade-badges">
          {doElo.map((b) => (
            <CartaoBadge key={b.id} est={est} b={b} onClick={() => abrirBadge(b)} />
          ))}
        </div>
        <div className="gx-proxima">
          <div className="gx-prog__rotulo">
            <span>Próxima badge: {pb.nome}</span>
            <small>
              {fmt(est.xp)} / {fmt(pb.xp)} XP
            </small>
          </div>
          <div className="gx-barra">
            <motion.i initial={{ width: 0 }} animate={{ width: `${(est.xp / pb.xp) * 100}%` }} transition={{ duration: 0.8 }} />
          </div>
          <small className="gx-azul">Faltam {fmt(pb.xp - est.xp)} XP válidos.</small>
        </div>
      </Card>
      <ComoEvoluir />
    </>
  )
}

function Elos({ est }: { est: Estudante }) {
  const atual = eloDe(est.xp)
  const prox = proximoElo(atual)
  return (
    <>
      <div className="gx-elos">
        {ELOS.map((e, i) => (
          <article key={e.id} className={`gx-elo ${e.id === atual.id ? 'is-atual' : ''}`} style={e.id === atual.id ? { background: e.tint } : undefined}>
            <div className="gx-elo__arte" style={{ backgroundImage: `url(./geniex/cena-${e.id}.webp)` }}>
              {e.id === atual.id && <span className="gx-selo-atual">Seu elo atual</span>}
            </div>
            <div className="gx-elo__txt">
              <h3>{e.nome}</h3>
              <b className={i === 4 ? 'gx-azul' : ''}>{e.faixa}</b>
              <i />
              <p>{e.frase}</p>
            </div>
          </article>
        ))}
      </div>
      <Card className="gx-posicao">
        <h2>Sua posição atual</h2>
        <div className="gx-posicao__corpo">
          <div className="gx-posicao__elo">
            <span className="gx-circ is-g" style={{ background: atual.circ }}>
              <Medalha elo={atual} size={52} />
            </span>
            <span>
              <small>Elo atual</small>
              <strong>{atual.nome}</strong>
              <span>
                <b>{fmt(est.xp)}</b> XP válidos
              </span>
            </span>
          </div>
          {prox && <Progresso atual={est.xp} min={atual.min} alvo={prox.min} prox={prox.nome} />}
        </div>
      </Card>
      <ComoEvoluir titulo="Como conquistar XP?" sub={null} />
    </>
  )
}

function MeuElo({ est, ir }: { est: Estudante; ir: (t: Tela, e?: Estudante['id']) => void }) {
  const e = eloDe(est.xp)
  const prox = proximoElo(e)
  const ratio = e.max ? (est.xp - e.min) / (e.max - e.min) : 1
  const pb = proximaBadge(est)
  return (
    <>
      {est.id === 'regressao' && (
        <div className="gx-alerta">
          <Info size={20} />
          Seu elo mudou de Ouro para Prata em 30 out. 2026 porque parte do seu XP expirou. Suas badges continuam com você.
        </div>
      )}
      <section className="gx-banner-elo" style={{ background: `linear-gradient(90deg, ${e.escuro}, ${e.medio})` }}>
        <div className="gx-banner-elo__arte" style={{ backgroundImage: `url(./geniex/banner-${e.id}.webp)` }} />
        <div className="gx-banner-elo__txt">
          <p className="gx-eyebrow">SEU ELO ATUAL</p>
          <h2>{e.nome}</h2>
          <p className="gx-banner-elo__faixa">{e.faixa}</p>
          <p>{e.frase}</p>
        </div>
        <div className="gx-xpcard">
          <div className="gx-xpcard__topo">
            <small>Seu XP válido</small>
            <p>
              <Selo size={40} /> {fmt(est.xp)}
            </p>
          </div>
          <div className="gx-xpcard__corpo">
            {prox ? (
              <Progresso atual={est.xp} min={e.min} alvo={prox.min} prox={prox.nome} />
            ) : (
              <p className="gx-faltam">
                <Star size={18} />
                <span>Você está no elo máximo. Faltam {fmt((pb?.xp ?? 0) - est.xp)} XP válidos para a badge {pb?.nome}.</span>
              </p>
            )}
          </div>
        </div>
      </section>
      <div className="gx-linha2">
        <Card className="gx-faixa">
          <span className="gx-circ is-g" style={{ background: e.circ }}>
            <Medalha elo={e} size={52} />
          </span>
          <div className="gx-regua">
            <b>Faixa de XP do elo {e.nome}</b>
            <div className="gx-regua__trilho">
              <motion.i initial={{ width: 0 }} animate={{ width: `${Math.max(2, ratio * 100)}%` }} transition={{ duration: 0.8 }} />
              <motion.span className="gx-regua__marca" initial={{ left: 0 }} animate={{ left: `${Math.min(97, Math.max(3, ratio * 100))}%` }} transition={{ duration: 0.8 }}>
                <Star size={12} />
              </motion.span>
            </div>
            <div className="gx-regua__rot">
              <small>{fmt(e.min)}</small>
              <span className="gx-aqui" style={{ left: `${Math.min(85, Math.max(15, ratio * 100))}%` }}>
                Você está aqui
                <b>{fmt(est.xp)} XP</b>
              </span>
              <small>{e.max ? fmt(e.max) : 'sem limite'}</small>
            </div>
          </div>
        </Card>
        {prox ? (
          <button className="gx-resumo__card gx-proximo" style={{ background: '#f8f8f8', borderColor: '#e6e6e6' }} onClick={() => ir('elos')}>
            <span className="gx-circ is-g" style={{ background: '#ededed' }}>
              <Medalha elo={prox} size={52} />
            </span>
            <span>
              <b>Próximo elo</b>
              <strong>{prox.nome}</strong>
              <small>
                {prox.faixa}
                <br />
                Continue realizando atividades e acumule mais {fmt(prox.min - est.xp)} XP para alcançar o próximo elo.
              </small>
            </span>
            <ChevronRight size={20} />
          </button>
        ) : (
          <div className="gx-resumo__card gx-proximo" style={{ background: e.tint, borderColor: e.borda }}>
            <span className="gx-circ is-g" style={{ background: e.circ }}>
              <Medalha elo={e} size={52} />
            </span>
            <span>
              <b>Elo máximo</b>
              <strong>Você chegou ao topo</strong>
              <small>Sua próxima badge, {pb?.nome}, chega aos {fmt(pb?.xp ?? 0)} XP válidos.</small>
            </span>
          </div>
        )}
      </div>
      <div className="gx-linha2">
        <ComoEvoluir titulo="Como ganhar XP?" sub="Realize atividades na GenieX e acumule pontos para evoluir." colunas />
        <Card className="gx-historico">
          <h2>Seu histórico de elos</h2>
          <small className="gx-muted">Maior elo alcançado: {eloPorId(est.maior).nome}</small>
          <ol>
            {est.historico.map((h, i) => {
              const he = eloPorId(h.elo)
              return (
                <li key={i} className={h.atual ? 'is-atual' : ''}>
                  <i />
                  <span className="gx-circ is-p" style={{ background: h.atual ? he.circ : '#f1f1f1' }}>
                    <Medalha elo={he} size={26} />
                  </span>
                  <span>
                    <b>
                      {he.nome}
                      {h.atual ? ' (atual)' : ''}
                    </b>
                    <small>{fmt(h.xp)} XP válidos</small>
                    <em className={h.motivo.startsWith('Regress') ? 'is-reg' : ''}>{h.motivo}</em>
                  </span>
                  <span className="gx-historico__data">
                    {h.atual && <small>Desde</small>}
                    {h.quando}
                  </span>
                </li>
              )
            })}
          </ol>
        </Card>
      </div>
    </>
  )
}

function Badges({ est, abrir }: { est: Estudante; abrir: (b: Badge) => void }) {
  const nOk = BADGES.filter((b) => conquistada(est, b)).length
  const pb = proximaBadge(est)
  const atual = eloDe(est.xp)
  return (
    <>
      <div className="gx-resumo gx-resumo--3">
        {[
          [Award, 'Badges conquistadas', `${nOk} de 25`, `${atual.nome}: ${BADGES.filter((b) => b.elo === atual.id && conquistada(est, b)).length} de 5`, '#eeefff'],
          [Star, 'Próxima badge', pb?.nome ?? '—', pb ? `Faltam ${fmt(pb.xp - est.xp)} XP válidos` : 'Todas conquistadas', '#fff4e8'],
          [Trophy, 'Maior elo alcançado', eloPorId(est.maior).nome, `Elo atual: ${atual.nome}`, '#fbe6d8'],
        ].map(([I, r, v, s, bg]) => {
          const Ic = I as LucideIcon
          return (
            <div key={r as string} className="gx-resumo__card is-estatico">
              <span className="gx-tile" style={{ background: bg as string, color: '#5258e4' }}>
                <Ic size={22} />
              </span>
              <span>
                <small>{r as string}</small>
                <strong className="is-m">{v as string}</strong>
                <small>{s as string}</small>
              </span>
            </div>
          )
        })}
      </div>
      {ELOS.map((e) => {
        const bs = BADGES.filter((b) => b.elo === e.id)
        const ok = bs.filter((b) => conquistada(est, b)).length
        return (
          <Card key={e.id} className="gx-grupo">
            <div className="gx-grupo__cab">
              <Medalha elo={e} size={32} />
              <span>
                <b>{e.nome}</b>
                <small>{e.faixa}</small>
              </span>
              <em className={ok ? 'is-ok' : ''}>{ok} de 5</em>
            </div>
            <div className="gx-grade-badges">
              {bs.map((b) => (
                <CartaoBadge key={b.id} est={est} b={b} onClick={() => abrir(b)} />
              ))}
            </div>
          </Card>
        )
      })}
    </>
  )
}

const FILTROS = ['Todos', 'Quizzes', 'Simulados', 'Redações']
function Extrato({ est, vazio, ir, abrirLotes, abrirLote, onFora }: { est: Estudante; vazio: boolean; ir: (t: Tela) => void; abrirLotes: () => void; abrirLote: (l: Lote) => void; onFora: (n: string) => void }) {
  const [filtro, setFiltro] = useState('Todos')
  const lotes = useMemo(() => LOTES.filter((l) => filtro === 'Todos' || MODALIDADE[l.tipo].filtro === filtro), [filtro])
  const met: [string, string, ReactNode, string, string, string | null][] = [
    ['Seu XP válido', vazio ? '0' : fmt(est.xp), null, '#f6f6ff', '#e3e5ff', null],
    ['Total de XP conquistado', vazio ? '0' : fmt(est.conquistado), 'Desde o início da sua jornada', '#f3fbf6', '#d7efe1', 'trend'],
    ['XP prestes a expirar', vazio ? '0' : fmt(est.aExpirar), 'Nos próximos 30 dias', '#fff8ef', '#f8e3c5', 'clock'],
    ['XP já expirado', vazio ? '0' : fmt(est.expirado), 'Desde o início da sua jornada', '#fff5f5', '#f8dada', 'x'],
  ]
  const ICM: Record<string, [LucideIcon, string, string]> = { trend: [TrendingUp, '#ddf3e6', '#007a4d'], clock: [Clock, '#fdebd3', '#e07b00'], x: [CircleX, '#fbe1e1', '#d31510'] }
  return (
    <>
      <div className="gx-metricas">
        {met.map(([r, v, s, bg, bd, ic]) => {
          const m = ic ? ICM[ic] : null
          const Ic = m ? m[0] : null
          return (
            <div key={r} className="gx-metrica" style={{ background: bg, borderColor: bd }}>
              {m && Ic ? (
                <span className="gx-circ is-m" style={{ background: m[1], color: m[2] }}>
                  <Ic size={24} />
                </span>
              ) : (
                <Selo size={46} />
              )}
              <span>
                <small>{r}</small>
                <strong>{v}</strong>
                {s ? (
                  <small>{s}</small>
                ) : (
                  <button className="gx-link is-p" onClick={() => ir('elo')}>
                    Ver meu elo <ArrowRight size={14} />
                  </button>
                )}
              </span>
            </div>
          )
        })}
      </div>
      <div className="gx-extrato">
        <div className="gx-extrato__lista">
          <div className="gx-filtros">
            <div className="gx-pilulas" role="tablist">
              {FILTROS.map((f) => (
                <button key={f} role="tab" aria-selected={filtro === f} className={filtro === f ? 'is-on' : ''} onClick={() => setFiltro(f)}>
                  {f}
                </button>
              ))}
            </div>
            <button className="gx-btn is-outline" onClick={() => onFora('Período')}>
              <Calendar size={18} /> Últimos 6 meses <ChevronDown size={18} />
            </button>
          </div>
          {vazio ? (
            <Card className="gx-vazio">
              <img src="./geniex/avatar.webp" alt="" />
              <h3>Seu extrato ainda está vazio</h3>
              <p>Responda quizzes e simulados ou envie uma redação para conquistar seus primeiros XP. Cada atividade vira um lote com validade própria.</p>
              <button className="gx-btn is-primario" onClick={() => onFora('Estudar')}>
                <GraduationCap size={18} /> Começar a estudar
              </button>
            </Card>
          ) : (
            <div className="gx-tabela" role="table">
              <div className="gx-tabela__cab" role="row">
                <span>
                  Data <ChevronDown size={14} />
                </span>
                <span>Atividade</span>
                <span>XP concedido</span>
                <span>XP válido</span>
                <span>Próxima expiração</span>
                <span>Status</span>
                <span />
              </div>
              <AnimatePresence initial={false}>
                {lotes.map((l) => {
                  const M = MODALIDADE[l.tipo]
                  const I = ICONE_MOD[l.tipo]
                  const S = STATUS[l.status]
                  return (
                    <motion.button key={l.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className={`gx-lote ${l.status === 'limite' ? 'is-limite' : ''}`} role="row" onClick={() => abrirLote(l)}>
                      <span className="gx-lote__data">
                        <b>{l.data}</b>
                        <small>{l.hora}</small>
                      </span>
                      <span className="gx-lote__ativ">
                        <span className="gx-tile is-p" style={{ background: M.bg, color: M.cor }}>
                          <I size={18} />
                        </span>
                        <span>
                          <b>
                            {l.atividade} <em style={{ background: M.bg, color: M.cor }}>{M.nome}</em>
                          </b>
                          <small>{l.detalhe}</small>
                        </span>
                      </span>
                      <span className={`gx-lote__xp ${l.concedido ? '' : 'is-zero'}`}>
                        <small className="gx-so-movel">Concedido</small>
                        {l.concedido ? `+ ${fmt(l.concedido)}` : '0'} XP
                      </span>
                      <span className={`gx-lote__val ${l.valido ? '' : 'is-zero'}`}>
                        <small className="gx-so-movel">Vale hoje</small>
                        {fmt(l.valido)} XP
                      </span>
                      <span className={`gx-lote__prox ${l.status === 'prestes' ? 'is-laranja' : ''}`}>
                        <b>{l.proxima}</b>
                        <small>{l.quando}</small>
                      </span>
                      <span className="gx-status" style={{ color: S.cor }}>
                        <i style={{ background: S.cor }} />
                        {S.nome}
                      </span>
                      <ChevronRight size={18} className="gx-seta" />
                    </motion.button>
                  )
                })}
              </AnimatePresence>
              <div className="gx-tabela__rodape">
                <small>
                  Mostrando {lotes.length} de {filtro === 'Todos' ? 46 : lotes.length + 12} lotes
                </small>
                <button className="gx-btn is-outline is-p" onClick={() => onFora('Carregar mais')}>
                  Carregar mais
                </button>
              </div>
            </div>
          )}
        </div>
        <aside className="gx-extrato__lado">
          {!vazio && (
            <Card className="gx-lado">
              <div className="gx-lado__tit">
                <Clock size={20} color="#e07b00" />
                <b>XP prestes a expirar</b>
              </div>
              <small className="gx-muted">290 XP de 2 lotes expiram nos próximos 30 dias.</small>
              {LOTES.filter((l) => l.status === 'prestes')
                .reverse()
                .map((l) => {
                  const M = MODALIDADE[l.tipo]
                  const I = ICONE_MOD[l.tipo]
                  return (
                    <button key={l.id} className="gx-lote-mini" onClick={() => abrirLote(l)}>
                      <span className="gx-tile is-p" style={{ background: M.bg, color: M.cor }}>
                        <I size={18} />
                      </span>
                      <span>
                        <b>{l.atividade}</b>
                        <em>{l.proxima} · 50%</em>
                      </span>
                      <span className="gx-lote-mini__prazo">
                        <em>Em {l.id === 'l6' ? 11 : 16} dias</em>
                        <small>{l.quando}</small>
                      </span>
                      <ChevronRight size={16} />
                    </button>
                  )
                })}
              <button className="gx-btn is-secundario" onClick={abrirLotes}>
                Ver lotes que vão expirar <ArrowRight size={18} />
              </button>
            </Card>
          )}
          <Card className="gx-lado">
            <div className="gx-lado__tit">
              <b>Como funciona a validade?</b>
              <Info size={18} color="#5258e4" />
            </div>
            <ul className="gx-etapas">
              {[
                ['Até 3 meses', 'O lote vale 100%.', '#007a4d'],
                ['Ao completar 3 meses', 'Expiram 50% do valor original do lote.', '#e07b00'],
                ['Ao completar 6 meses', 'Expira o restante do lote.', '#d31510'],
              ].map(([t, s, c]) => (
                <li key={t}>
                  <i style={{ background: c }} />
                  <span>
                    <b>{t}</b>
                    <small>{s}</small>
                  </span>
                </li>
              ))}
            </ul>
            <p className="gx-dica">
              <Lightbulb size={18} />
              Seu elo usa só o XP válido. Badges conquistadas não somem quando o XP expira.
            </p>
          </Card>
          <Card className="gx-lado">
            <b className="gx-lado__tit">Como você ganha XP</b>
            {(
              [
                ['quiz', 'Quiz', '10 XP por questão certa'],
                ['sim', 'Simulado', '10 XP por questão certa'],
                ['red', 'Redação ENEM', '1 XP por ponto da nota · 1 redação com XP por dia'],
              ] as [Modalidade, string, string][]
            ).map(([m, t, s]) => {
              const I = ICONE_MOD[m]
              return (
                <div key={m} className="gx-regra">
                  <span className="gx-tile is-pp" style={{ background: MODALIDADE[m].bg, color: MODALIDADE[m].cor }}>
                    <I size={16} />
                  </span>
                  <span>
                    <b>{t}</b>
                    <small>{s}</small>
                  </span>
                </div>
              )
            })}
            <small className="gx-muted">Tarefas e Provas GenieX não geram XP. Repetir uma atividade não gera XP de novo, e respostas erradas não tiram pontos.</small>
          </Card>
        </aside>
      </div>
    </>
  )
}

/* ---------------------------------------------------------------- sobrepostos */
function MenuPerfil({ est, onFechar, onEvolucao, onFora }: { est: Estudante; onFechar: () => void; onEvolucao: () => void; onFora: (n: string) => void }) {
  const elo = eloDe(est.xp)
  return (
    <>
      <div className="gx-veu is-claro" onClick={onFechar} />
      <motion.div className="gx-menu" role="menu" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
        <div className="gx-menu__conta">
          <img src="./geniex/avatar.webp" alt="" />
          <span>
            <b>Aluno GenieX</b>
            <small>aluno@jovensgenios.com</small>
          </span>
        </div>
        <button role="menuitem" onClick={() => onFora('Meu perfil')}>
          <CircleUserRound size={18} /> Meu perfil
        </button>
        <button role="menuitem" className="is-on" onClick={onEvolucao}>
          <Award size={18} /> Minha evolução
          <em style={{ background: elo.circ }}>
            <Medalha elo={elo} size={14} /> {elo.nome}
          </em>
        </button>
        <button role="menuitem" onClick={() => onFora('Configurações')}>
          <Settings size={18} /> Configurações
        </button>
        <hr />
        <button role="menuitem" onClick={() => onFora('Sair')}>
          <LogOut size={18} /> Sair
        </button>
      </motion.div>
    </>
  )
}

function PainelLateral({ titulo, desc, onFechar, children }: { titulo: string; desc: string; onFechar: () => void; children: ReactNode }) {
  return (
    <>
      <motion.div className="gx-veu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onFechar} />
      <motion.aside className="gx-painel" role="dialog" aria-label={titulo} initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}>
        <div className="gx-painel__cab">
          <span>
            <h3>{titulo}</h3>
            <small>{desc}</small>
          </span>
          <button className="gx-icone-btn" onClick={onFechar} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>
        <div className="gx-painel__corpo">{children}</div>
      </motion.aside>
    </>
  )
}

function DetalheBadge({ est, b, onFora }: { est: Estudante; b: Badge; onFora: (n: string) => void }) {
  const on = conquistada(est, b)
  const falta = b.xp - est.xp
  return (
    <>
      <div className="gx-destaque">
        <Emblema b={b} on={on} size={104} />
      </div>
      {on ? (
        <p>
          Conquistada em <b>{est.conquistas[b.id]}</b>, quando você alcançou {fmt(b.xp)} XP válidos. Ela é sua para sempre, mesmo que o XP expire ou o seu elo mude.
        </p>
      ) : (
        <>
          <p>
            Alcance {fmt(b.xp)} XP válidos para desbloquear. Seu saldo hoje é {fmt(est.xp)} XP.
          </p>
          <div className="gx-prog">
            <div className="gx-prog__rotulo">
              <b>Faltam {fmt(falta)} XP</b>
              <small>
                {fmt(est.xp)} / {fmt(b.xp)}
              </small>
            </div>
            <div className="gx-barra">
              <motion.i initial={{ width: 0 }} animate={{ width: `${Math.min(100, (est.xp / b.xp) * 100)}%` }} />
            </div>
          </div>
          <p className="gx-dica">
            <Lightbulb size={18} />
            {falta <= 1000 ? 'Uma redação com nota boa já resolve.' : falta <= 4000 ? 'Duas boas redações (uma por dia) ou alguns simulados levam você até lá.' : 'Mantenha a rotina: quizzes, simulados e uma redação por dia somam rápido.'}
          </p>
          <button className="gx-btn is-primario" onClick={() => onFora('Redação')}>
            <PenLine size={18} /> Fazer uma redação
          </button>
        </>
      )}
    </>
  )
}

function LotesAExpirar({ onFora }: { onFora: (n: string) => void }) {
  return (
    <>
      <div className="gx-total">
        <span className="gx-circ is-m" style={{ background: '#fdebd3', color: '#e07b00' }}>
          <Clock size={22} />
        </span>
        <span>
          <strong>290 XP</strong>
          <small>vão expirar de 2 lotes · a primeira expiração é em 11 dias</small>
        </span>
      </div>
      {LOTES.filter((l) => l.status === 'prestes')
        .reverse()
        .map((l) => {
          const M = MODALIDADE[l.tipo]
          const I = ICONE_MOD[l.tipo]
          return (
            <Card key={l.id} className="gx-lote-card">
              <div className="gx-lote-card__topo">
                <span className="gx-tile" style={{ background: M.bg, color: M.cor, width: 40, height: 40 }}>
                  <I size={20} />
                </span>
                <span>
                  <b>{l.atividade}</b>
                  <small>
                    Lote de {fmt(l.concedido)} XP · {l.data}
                  </small>
                </span>
                <strong>+ {fmt(l.concedido)} XP</strong>
              </div>
              <p className="gx-prazo">
                <Clock size={16} /> {l.proxima} em {l.id === 'l6' ? 11 : 16} dias · {l.quando}
              </p>
              <small className="gx-muted">
                Ao completar 3 meses expira 50% do lote. Os {fmt(l.concedido / 2)} XP restantes valem até {l.ciclo[2][0]}.
              </small>
            </Card>
          )
        })}
      <p className="gx-dica">
        <Lightbulb size={18} />
        Mesmo com a expiração você continua no Bronze (6.130 XP válidos). Cada nova atividade gera um lote novo.
      </p>
      <button className="gx-btn is-primario" onClick={() => onFora('Simulados')}>
        <FileCheck2 size={18} /> Fazer um simulado
      </button>
    </>
  )
}

function DetalheLote({ l, onFora }: { l: Lote; onFora: (n: string) => void }) {
  const M = MODALIDADE[l.tipo]
  const S = STATUS[l.status]
  return (
    <>
      <div className="gx-total is-neutro">
        <Selo size={40} />
        <span>
          <strong>{l.concedido ? `+ ${fmt(l.concedido)} XP` : 'Sem XP'}</strong>
          <small>{l.tipo === 'red' ? (l.concedido ? `Nota ${fmt(l.concedido)} · 1 XP por ponto` : 'Limite de 1 redação com XP por dia') : `${l.concedido / 10} acertos · 10 XP por questão certa`}</small>
        </span>
      </div>
      <div className="gx-tags">
        <em style={{ background: M.bg, color: M.cor }}>{M.nome}</em>
        <span className="gx-status" style={{ color: S.cor }}>
          <i style={{ background: S.cor }} />
          {S.nome}
        </span>
        {l.concedido > 0 && <small className="gx-muted">Vale hoje: {fmt(l.valido)} XP</small>}
      </div>
      <Card className="gx-ciclo">
        <b>{l.status === 'limite' ? 'Por que não gerou XP' : 'Validade deste lote'}</b>
        <ul className="gx-etapas">
          {l.ciclo.map(([d, t, s, tom]) => (
            <li key={t}>
              <i style={{ background: tom === 'ok' ? '#007a4d' : tom === 'aviso' ? '#e07b00' : '#d31510' }} />
              <span>
                <b>{t}</b>
                <small>{s}</small>
              </span>
              <small className="gx-muted">{d}</small>
            </li>
          ))}
        </ul>
      </Card>
      <button className="gx-btn is-outline" onClick={() => onFora(l.atividade)}>
        {l.tipo === 'red' ? <PenLine size={18} /> : <FileCheck2 size={18} />} Ver {l.tipo === 'red' ? 'redação corrigida' : 'atividade'}
      </button>
    </>
  )
}

function Avisos({ tipo, onFechar, onAcao }: { tipo: Exclude<Aviso, null>; onFechar: () => void; onAcao: () => void }) {
  const prata = eloPorId('prata')
  const cfg = {
    badge: { eyebrow: 'BADGE DESBLOQUEADA', cor: '#5258e4', fundo: 'linear-gradient(180deg,#f6f2ff,#eef0ff)', titulo: 'Modo Foco', texto: 'Você alcançou 6.000 XP válidos e conquistou sua 3ª badge. Ela fica com você mesmo que o XP expire.', extra: 'Próxima: Mandando Bem · faltam 1.580 XP', acao: 'Ver minhas badges', sec: 'Continuar', arte: <Emblema b={BADGES[2]} on size={112} /> },
    elo: { eyebrow: 'NOVO ELO', cor: '#5258e4', fundo: 'linear-gradient(180deg,#f4f6f9,#e3e7ee)', titulo: 'Você subiu para o elo Prata!', texto: 'Seu saldo chegou a 10.050 XP válidos. Continue estudando para chegar ao Ouro, aos 30.000 XP.', extra: 'Faltam 19.950 XP válidos para o Ouro', acao: 'Ver meu elo', sec: 'Continuar', arte: <Medalha elo={prata} size={96} /> },
    regressao: { eyebrow: 'ELO ATUALIZADO', cor: '#b45f00', fundo: 'linear-gradient(180deg,#fff8ef,#fbeedb)', titulo: 'Seu elo mudou para Prata', texto: 'Alguns lotes de XP expiraram e seu saldo válido ficou em 28.000 XP, abaixo dos 30.000 do Ouro. Suas badges continuam conquistadas.', extra: 'Faltam 2.000 XP válidos para voltar ao Ouro', acao: 'Ver extrato de XP', sec: 'Entendi', arte: <Medalha elo={prata} size={96} /> },
  }[tipo]
  return (
    <>
      <motion.div className="gx-veu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onFechar} />
      <div className="gx-dialogo-pos">
        <motion.div className="gx-dialogo" role="alertdialog" aria-label={cfg.titulo} initial={{ opacity: 0, scale: 0.92, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ type: 'spring', damping: 22, stiffness: 260 }}>
          <div className="gx-dialogo__arte" style={{ background: cfg.fundo }}>
            <motion.div initial={{ scale: 0.6, rotate: -8 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 10, delay: 0.1 }}>
              {cfg.arte}
            </motion.div>
          </div>
          <p className="gx-eyebrow" style={{ color: cfg.cor }}>
            {cfg.eyebrow}
          </p>
          <h3>{cfg.titulo}</h3>
          <p className="gx-muted">{cfg.texto}</p>
          <p className="gx-faltam" style={tipo === 'regressao' ? { background: '#fff8ef', color: '#b45f00' } : undefined}>
            {tipo === 'badge' ? <Star size={16} /> : <Rocket size={16} />}
            <span>{cfg.extra}</span>
          </p>
          <button className="gx-btn is-primario" onClick={onAcao}>
            {cfg.acao} <ArrowRight size={18} />
          </button>
          <button className="gx-btn is-ghost" onClick={onFechar}>
            {cfg.sec}
          </button>
        </motion.div>
      </div>
    </>
  )
}
