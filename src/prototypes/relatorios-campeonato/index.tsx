// Relatórios do Campeonato GenieX · Plataforma Educadores.
// Navegável construído a partir das telas do Figma (2dCJihe9CXk3jC1NClnvaZ): casca e estilos do kit Educadores (rgx) + peças do relatório (rcp.css).
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  Calendar,
  ChartColumn,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  CircleCheck,
  CircleHelp,
  CircleX,
  Clock,
  Copy,
  Download,
  FileSpreadsheet,
  FileText,
  GraduationCap,
  Home,
  Info,
  Link2,
  ListChecks,
  Lock,
  Menu,
  Percent,
  Search,
  Sheet,
  Share2,
  Star,
  Swords,
  Target,
  Timer,
  TrendingDown,
  Trophy,
  UserRound,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useMemo, useState, type MouseEvent, type ReactNode } from 'react'
import type { PrototypeProps } from '../../platform/journeys'
import '../gamificacao-geniex-educadores/rgx.css'
import {
  AGG,
  CAMPEONATOS,
  DISC_COPA,
  ESTUDANTES,
  LIMITE_DIFICULDADE,
  LINK,
  NAO_PARTICIPARAM,
  PONTOS,
  POR_DISC,
  QUAD,
  QUESTOES,
  RUBRICAS,
  TOPICOS,
  TURMAS,
  campPorId,
  corRubrica,
  fmt,
  horas,
  pctQ,
  porAcuracia,
  quadDe,
  type Campeonato,
  type Disc,
  type Estudante,
  type Quad,
  type Recorte,
  type Tom,
} from './data'
import './rcp.css'

type Aba = 'visao' | 'engajamento' | 'aprendizagem' | 'glossario'
type Sub = 'estudantes' | 'questoes'
type Tela = { id: 'lista' } | { id: 'rel'; camp: string; aba: Aba; sub: Sub }
type Modal = null | 'exportar' | 'compartilhar' | 'ranking'
type Toast = { tipo: 'ok' | 'info'; titulo: string; texto: string }

const rel = (aba: Aba, sub: Sub = 'estudantes', camp = 'copa'): Tela => ({ id: 'rel', camp, aba, sub })
const INICIO: Record<string, { tela: Tela; vazia?: boolean; modal?: Modal; recorte?: Recorte }> = {
  lista: { tela: { id: 'lista' } },
  'lista-vazia': { tela: { id: 'lista' }, vazia: true },
  visao: { tela: rel('visao') },
  'sem-dados': { tela: rel('visao', 'estudantes', 'humanas') },
  engajamento: { tela: rel('engajamento') },
  aprendizagem: { tela: rel('aprendizagem') },
  'por-disciplina': { tela: rel('aprendizagem'), recorte: 'Química' },
  questoes: { tela: rel('aprendizagem', 'questoes') },
  glossario: { tela: rel('glossario') },
  'ranking-completo': { tela: rel('aprendizagem'), modal: 'ranking' },
  exportar: { tela: rel('visao'), modal: 'exportar' },
  compartilhar: { tela: rel('visao'), modal: 'compartilhar' },
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

/* ------------------------------------------------------------------ peças */
const TILE: Record<Tom, string> = { inf: 'is-azul', roxo: '', suc: 'is-verde', at: 'is-amarelo', cr: 'is-red', neutro: 'is-cinza' }
const Tile = ({ icon: I, tom = 'roxo', size = 40 }: { icon: LucideIcon; tom?: Tom; size?: number }) => (
  <span className={`rx-tile rc-tile ${TILE[tom]}`} style={{ width: size, height: size, borderRadius: size >= 40 ? 10 : 8 }}>
    <I size={Math.round(size * 0.48)} />
  </span>
)
const Badge = ({ t, tom, icon: I }: { t: string; tom: Tom; icon?: LucideIcon }) => (
  <span className={`rc-badge is-${tom}`}>
    {I && <I size={13} />}
    {t}
  </span>
)
const DiscBadge = ({ d }: { d: Disc }) => <Badge t={d.nome} tom={d.tom} />
const Dica = ({ t }: { t: string }) => (
  <span className="rc-dica" title={t} aria-label={t} tabIndex={0}>
    <Info size={16} />
  </span>
)
const Barra = ({ pct, cor, meta, alto }: { pct: number; cor?: string; meta?: number; alto?: boolean }) => (
  <span className={`rc-barra ${alto ? 'is-alta' : ''}`}>
    <motion.i initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, ease: 'easeOut' }} style={{ background: cor }} />
    {meta !== undefined && <b style={{ left: `${meta}%` }} aria-hidden />}
  </span>
)
const Pct = ({ p }: { p: number }) => (
  <span className="rc-pct">
    <Barra pct={p} cor={p < LIMITE_DIFICULDADE ? '#DC2626' : undefined} />
    <b>{p}%</b>
  </span>
)
const Aviso = ({ icon: I = Info, children, tom = 'roxo' }: { icon?: LucideIcon; children: ReactNode; tom?: 'roxo' | 'cinza' }) => (
  <p className={`rc-aviso is-${tom}`}>
    <I size={16} />
    <span>{children}</span>
  </p>
)
const Busca = ({ valor, onTroca, ph }: { valor: string; onTroca: (v: string) => void; ph: string }) => (
  <label className="rx-busca">
    <Search size={16} />
    <input value={valor} onChange={(e) => onTroca(e.target.value)} placeholder={ph} aria-label={ph} />
  </label>
)
function Select<T extends string>({ valor, opcoes, onTroca, rotulo }: { valor: T; opcoes: [T, string][]; onTroca: (v: T) => void; rotulo: string }) {
  return (
    <label className="rc-select">
      <select value={valor} onChange={(e) => onTroca(e.target.value as T)} aria-label={rotulo}>
        {opcoes.map(([v, t]) => (
          <option key={v} value={v}>
            {t}
          </option>
        ))}
      </select>
      <ChevronDown size={16} />
    </label>
  )
}
const Th = ({ children, ord, centro }: { children?: ReactNode; ord?: boolean; centro?: boolean }) => (
  <span className={`rx-th ${centro ? 'rc-centro' : ''}`}>
    {children} {ord && <ChevronsUpDown size={14} />}
  </span>
)
function Paginacao({ total, pagina, porPagina, rotulo, onPagina, reais }: { total: number; pagina: number; porPagina: number; rotulo: string; onPagina: (p: number) => void; reais: number }) {
  const paginas = Math.max(1, Math.ceil(reais / porPagina))
  const ini = reais === 0 ? 0 : (pagina - 1) * porPagina + 1
  const fim = Math.min(pagina * porPagina, reais)
  return (
    <div className="rc-pager">
      <small>
        {ini} – {fim} de {fmt(total)} {rotulo}
      </small>
      <span>
        <button className="rc-pager__btn" disabled={pagina <= 1} onClick={() => onPagina(pagina - 1)} aria-label="Página anterior">
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: paginas }, (_, i) => (
          <button key={i} className={`rc-pager__btn ${pagina === i + 1 ? 'is-on' : ''}`} onClick={() => onPagina(i + 1)} aria-current={pagina === i + 1 ? 'page' : undefined}>
            {i + 1}
          </button>
        ))}
        <button className="rc-pager__btn" disabled={pagina >= paginas} onClick={() => onPagina(pagina + 1)} aria-label="Próxima página">
          <ChevronRight size={16} />
        </button>
      </span>
    </div>
  )
}
const CabCard = ({ titulo, dica, sub, children }: { titulo: string; dica?: string; sub?: ReactNode; children?: ReactNode }) => (
  <div className="rc-cabcard">
    <div>
      <h2>
        {titulo} {dica && <Dica t={dica} />}
      </h2>
      {sub && <p>{sub}</p>}
    </div>
    {children && <div className="rc-cabcard__acoes">{children}</div>}
  </div>
)
const BotaoExportar = ({ onClick, rotulo = 'Exportar' }: { onClick: (ev: MouseEvent) => void; rotulo?: string }) => (
  <button className="rx-btn is-primario" onClick={onClick}>
    <Download size={16} /> {rotulo} <ChevronDown size={16} />
  </button>
)

/* ------------------------------------------------------------------ app */
export default function RelatoriosCampeonato({ startScreen }: PrototypeProps) {
  const ini = INICIO[startScreen ?? ''] ?? INICIO.lista
  const [tela, setTela] = useState<Tela>(ini.tela)
  const [vazia] = useState(!!ini.vazia)
  const [modal, setModal] = useState<Modal>(ini.modal ?? null)
  const [ancora, setAncora] = useState<{ top: number; right: number } | null>(null)
  const [recorte, setRecorte] = useState<Recorte>(ini.recorte ?? 'todas')
  const [gaveta, setGaveta] = useState(false)
  const [recolhida, setRecolhida] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)
  const celular = useMedia('(max-width: 899px)')

  useEffect(() => {
    document.title = 'Relatórios do Campeonato GenieX · Educadores · Protótipo Jovens Gênios'
  }, [])
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3600)
    return () => clearTimeout(t)
  }, [toast])
  useEffect(() => {
    if (!modal) return
    const on = (e: KeyboardEvent) => e.key === 'Escape' && setModal(null)
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [modal])

  const ir = (t: Tela) => {
    setTela(t)
    setModal(null)
    setGaveta(false)
    document.querySelector('.rx-rolagem')?.scrollTo({ top: 0 })
  }
  const fora = (n: string) => setToast({ tipo: 'info', titulo: `“${n}” não faz parte deste protótipo`, texto: 'Use o menu Relatórios › Atividades › Campeonatos.' })
  const abrirExportar = (ev?: MouseEvent) => {
    if (ev) {
      const r = (ev.currentTarget as HTMLElement).getBoundingClientRect()
      setAncora({ top: r.bottom + 8, right: Math.max(16, window.innerWidth - r.right) })
    } else setAncora(null)
    setModal('exportar')
  }
  const camp = tela.id === 'rel' ? campPorId(tela.camp) : null
  const migalhas = camp ? ['Campeonatos', camp.nome] : ['Campeonatos']

  return (
    <div className={`rx rc ${recolhida ? 'is-recolhida' : ''}`}>
      <AnimatePresence>{gaveta && <motion.div className="rx-veu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setGaveta(false)} />}</AnimatePresence>
      <Sidebar aberta={gaveta} recolhida={recolhida && !celular} onCampeonatos={() => ir({ id: 'lista' })} onFora={fora} onRecolher={() => (celular ? setGaveta(false) : setRecolhida((r) => !r))} />
      <div className="rx-principal">
        <header className="rx-topo">
          <button className="rx-icone-btn rx-topo__menu" onClick={() => setGaveta(true)} aria-label="Abrir menu">
            <Menu size={22} />
          </button>
          <nav className="rx-migalhas" aria-label="Você está em">
            {migalhas.map((m, i) => (
              <span key={i} className={i === migalhas.length - 1 ? 'is-atual' : ''}>
                {i > 0 && <i>/</i>}
                {i === 0 && camp ? (
                  <button className="rc-migalha" onClick={() => ir({ id: 'lista' })}>
                    {m}
                  </button>
                ) : (
                  m
                )}
              </span>
            ))}
          </nav>
        </header>
        <main className="rx-rolagem">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={tela.id === 'lista' ? 'lista' : `${tela.camp}-${tela.aba}-${tela.sub}`} className="rx-conteudo" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.1 } }} transition={{ duration: 0.22 }}>
              {tela.id === 'lista' && <Lista vazia={vazia} celular={celular} onAbrir={(c) => (c.relatorio ? ir(rel('visao', 'estudantes', c.id)) : setToast({ tipo: 'info', titulo: 'Relatório fora da amostra', texto: 'Neste protótipo, abra a Copa GenieX · 1º ano (com dados) ou o Campeonato de Humanas (sem dados).' }))} onFora={fora} />}
              {tela.id === 'rel' && camp && (
                <Relatorio
                  camp={camp}
                  aba={tela.aba}
                  sub={tela.sub}
                  celular={celular}
                  recorte={recorte}
                  onRecorte={setRecorte}
                  onAba={(aba) => setTela({ ...tela, aba })}
                  onSub={(sub) => setTela({ ...tela, sub })}
                  onVoltar={() => ir({ id: 'lista' })}
                  onExportar={abrirExportar}
                  onCompartilhar={() => setModal('compartilhar')}
                  onRanking={() => setModal('ranking')}
                  onFora={fora}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {modal === 'exportar' && (
          <MenuExportar
            key="exp"
            aba={tela.id === 'rel' ? tela.aba : 'visao'}
            celular={celular}
            ancora={ancora}
            onFechar={() => setModal(null)}
            onEscolher={(t) => {
              setModal(null)
              setToast({ tipo: 'info', titulo: t, texto: 'O download começa sozinho em alguns segundos. Você pode continuar navegando.' })
            }}
          />
        )}
        {modal === 'compartilhar' && camp && (
          <Compartilhar
            key="comp"
            celular={celular}
            onFechar={() => setModal(null)}
            onCopiar={() => {
              navigator.clipboard?.writeText('https://' + LINK).catch(() => {})
              setModal(null)
              setToast({ tipo: 'ok', titulo: 'Link copiado', texto: 'Cole o link para enviar a outro educador da escola.' })
            }}
          />
        )}
        {modal === 'ranking' && <RankingCompleto key="rank" celular={celular} onFechar={() => setModal(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <>
            <motion.div key="tv" className="rc-veu is-leve" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setToast(null)} />
            <motion.div key="tt" className="rc-toast" role="status" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <Tile icon={toast.tipo === 'ok' ? CircleCheck : Download} tom={toast.tipo === 'ok' ? 'suc' : 'roxo'} size={36} />
              <span>
                <b>{toast.titulo}</b>
                <small>{toast.texto}</small>
              </span>
              <button className="rx-icone-btn" onClick={() => setToast(null)} aria-label="Fechar aviso">
                <X size={16} />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ------------------------------------------------------------------ casca */
function Sidebar({ aberta, recolhida, onCampeonatos, onFora, onRecolher }: { aberta: boolean; recolhida: boolean; onCampeonatos: () => void; onFora: (n: string) => void; onRecolher: () => void }) {
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
          <button className="rx-side__subitem" onClick={() => onFora('Relatórios institucionais')}>
            Institucionais <ChevronRight size={14} />
          </button>
          <p>
            Atividades <ChevronDown size={14} />
          </p>
          <div className="rx-side__nivel">
            <button onClick={() => onFora('Tarefas')}>Tarefas</button>
            <button onClick={() => onFora('Simulados')}>Simulados</button>
            <button onClick={() => onFora('Redações')}>Redações</button>
            <button onClick={() => onFora('Teste Vocacional')}>Teste Vocacional</button>
            <button className="is-on" onClick={onCampeonatos}>
              Campeonatos
            </button>
          </div>
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
          <b>Fernanda Santos</b>
          <small>Coordenadora · Escola GenieX</small>
        </span>
      </div>
    </aside>
  )
}

/* ------------------------------------------------------------------ 1 · lista de campeonatos */
const STATUS_TOM: Record<string, Tom> = { 'Em andamento': 'suc', 'Não iniciado': 'neutro', Encerrado: 'neutro' }
function Lista({ vazia, celular, onAbrir, onFora }: { vazia: boolean; celular: boolean; onAbrir: (c: Campeonato) => void; onFora: (n: string) => void }) {
  const [q, setQ] = useState('')
  const [periodo, setPeriodo] = useState('todos')
  const [status, setStatus] = useState('todos')
  const [ano, setAno] = useState('todos')
  const lista = useMemo(
    () =>
      vazia
        ? []
        : CAMPEONATOS.filter(
            (c) =>
              (periodo === 'todos' || c.mes === periodo) &&
              (status === 'todos' || c.status === status) &&
              (ano === 'todos' || c.ano === ano) &&
              c.nome.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').includes(q.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '')),
          ),
    [vazia, q, periodo, status, ano],
  )
  const filtrando = q || periodo !== 'todos' || status !== 'todos' || ano !== 'todos'
  return (
    <>
      <div className="rx-cab">
        <div>
          <h1 className="rx-h1">Relatórios de campeonatos</h1>
          <p>Acompanhe o engajamento, o desempenho e a aprendizagem dos campeonatos da GenieX.</p>
        </div>
      </div>
      <section className="rx-cartao">
        <div className="rc-filtros">
          <Select rotulo="Período" valor={periodo} onTroca={setPeriodo} opcoes={[['todos', 'Todos os períodos'], ['dez', 'Dezembro de 2026'], ['nov', 'Novembro de 2026'], ['out', 'Outubro de 2026'], ['set', 'Setembro de 2026'], ['jul', 'Julho de 2026']]} />
          <Select rotulo="Status" valor={status} onTroca={setStatus} opcoes={[['todos', 'Todos os status'], ['Em andamento', 'Em andamento'], ['Não iniciado', 'Não iniciado'], ['Encerrado', 'Encerrado']]} />
          <Select rotulo="Ano escolar" valor={ano} onTroca={setAno} opcoes={[['todos', 'Todos os anos'], ['1º ano', '1º ano'], ['2º ano', '2º ano'], ['3º ano', '3º ano']]} />
          {!celular && <span className="rx-espaco" />}
          <Busca valor={q} onTroca={setQ} ph="Pesquisar campeonato…" />
        </div>
        {lista.length === 0 ? (
          vazia ? (
            <div className="rc-vazio">
              <span className="rc-vazio__icone">
                <Trophy size={22} />
              </span>
              <b>Nenhum campeonato criado ainda</b>
              <p>Quando um campeonato da GenieX for criado em “Criar”, os relatórios dele aparecem aqui assim que as primeiras batalhas forem concluídas.</p>
              <button className="rx-btn is-contorno" onClick={() => onFora('Criar')}>
                <ArrowRight size={16} /> Ir para Criar
              </button>
            </div>
          ) : (
            <div className="rc-vazio">
              <span className="rc-vazio__icone">
                <Search size={22} />
              </span>
              <b>Nenhum campeonato encontrado</b>
              <p>Revise os filtros ou a busca{filtrando ? '' : '.'}</p>
            </div>
          )
        ) : (
          <div className="rx-tabela-rola">
            <div className="rx-tabela rc-t-lista">
              <div className="rx-tr is-cab">
                <Th ord>Nome do campeonato</Th>
                <Th ord>Ano escolar</Th>
                <Th>Disciplinas</Th>
                <Th ord>Período</Th>
                <Th ord centro>
                  Participantes
                </Th>
                <Th>Status</Th>
                <Th>Ações</Th>
              </div>
              {lista.map((c) => (
                <div key={c.id} className="rx-tr is-clicavel" onClick={() => onAbrir(c)}>
                  <span className="rc-camp">
                    <Trophy size={22} style={{ color: c.trofeu }} />
                    <span>
                      <b>{c.nome}</b>
                      <small>{c.sub}</small>
                    </span>
                  </span>
                  <span>{c.ano}</span>
                  <span className="rc-discs">
                    {c.disc.map((d) => (
                      <DiscBadge key={d.nome} d={d} />
                    ))}
                  </span>
                  <span>{c.periodo}</span>
                  <span className="rc-centro">{c.elegiveis}</span>
                  <span>
                    <Badge t={c.status} tom={STATUS_TOM[c.status]} icon={c.status === 'Em andamento' ? CircleCheck : c.status === 'Não iniciado' ? Clock : Lock} />
                  </span>
                  <span>
                    <button className="rx-btn is-contorno rc-btn-p" onClick={(ev) => (ev.stopPropagation(), onAbrir(c))}>
                      Ver relatório
                    </button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        {lista.length > 0 && <Paginacao total={lista.length} reais={lista.length} pagina={1} porPagina={10} rotulo="campeonatos" onPagina={() => {}} />}
      </section>
    </>
  )
}

/* ------------------------------------------------------------------ 2 · relatório */
const ABAS: [Aba, string][] = [['visao', 'Visão geral'], ['engajamento', 'Engajamento'], ['aprendizagem', 'Aprendizagem'], ['glossario', 'Glossário']]
function Relatorio(p: {
  camp: Campeonato
  aba: Aba
  sub: Sub
  celular: boolean
  recorte: Recorte
  onRecorte: (r: Recorte) => void
  onAba: (a: Aba) => void
  onSub: (s: Sub) => void
  onVoltar: () => void
  onExportar: (ev?: MouseEvent) => void
  onCompartilhar: () => void
  onRanking: () => void
  onFora: (n: string) => void
}) {
  const { camp, aba, celular } = p
  const semDados = camp.relatorio === 'sem-dados'
  return (
    <>
      <div className="rc-cabrel">
        <button className="rc-voltar" onClick={p.onVoltar}>
          <ArrowLeft size={16} /> Voltar para campeonatos
        </button>
        <div className="rc-cabrel__linha">
          <div className="rc-cabrel__id">
            <h1 className="rx-h1">{camp.nome}</h1>
            <p className="rc-mudo">{camp.sub}</p>
            <ul className="rc-meta">
              <li>
                <Badge t={camp.status} tom={STATUS_TOM[camp.status]} icon={camp.status === 'Em andamento' ? CircleCheck : Clock} />
              </li>
              <li>
                <Calendar size={16} /> {camp.periodo}
              </li>
              <li>
                <Users size={16} /> {camp.elegiveis} estudantes elegíveis
              </li>
              <li>
                <GraduationCap size={16} /> {camp.ano} · Escola GenieX
              </li>
            </ul>
            <p className="rc-discs">
              <small>{camp.disc.length} disciplinas:</small>
              {camp.disc.map((d) => (
                <DiscBadge key={d.nome} d={d} />
              ))}
            </p>
          </div>
          <div className="rc-cabrel__acoes">
            <button className="rx-btn is-contorno" onClick={p.onCompartilhar}>
              <Share2 size={16} /> Compartilhar
            </button>
            <BotaoExportar onClick={p.onExportar} rotulo={celular ? 'Exportar' : 'Exportar relatório'} />
          </div>
        </div>
      </div>
      <div className="rx-alerta">
        <Info size={16} /> Os dados deste relatório podem levar até 2 horas para serem atualizados.
      </div>
      <div className="rx-abas rc-abas" role="tablist" aria-label="Seções do relatório">
        {ABAS.map(([id, rot]) => (
          <button key={id} role="tab" aria-selected={aba === id} className={aba === id ? 'is-on' : ''} onClick={() => p.onAba(id)}>
            {rot}
            {aba === id && <motion.span layoutId="aba-rel" className="rx-abas__linha" />}
          </button>
        ))}
      </div>
      {aba === 'visao' && (semDados ? <VisaoSemDados camp={camp} /> : <Visao onExportar={p.onExportar} />)}
      {aba === 'engajamento' && (semDados ? <SemDados /> : <Engajamento onExportar={p.onExportar} onFora={p.onFora} />)}
      {aba === 'aprendizagem' && (
        <>
          <Subnav sub={p.sub} onSub={p.onSub} recorte={p.recorte} onRecorte={p.onRecorte} />
          {semDados ? <SemDados /> : p.sub === 'estudantes' ? <AprendEstudantes recorte={p.recorte} onRanking={p.onRanking} onExportar={p.onExportar} /> : <AprendQuestoes recorte={p.recorte} onExportar={p.onExportar} />}
        </>
      )}
      {aba === 'glossario' && <Glossario />}
    </>
  )
}

/** Card de indicador (componente “Indicador do relatório” da página 04). */
function Kpi({ icon, tom, rot, valor, de, extra, extraTom, barra, novo, dica, children }: { icon: LucideIcon; tom: Tom; rot: string; valor: string; de?: string; extra?: string; extraTom?: 'suc'; barra?: number; novo?: boolean; dica?: string; children?: ReactNode }) {
  return (
    <div className="rc-kpi">
      <div className="rc-kpi__topo">
        <Tile icon={icon} tom={tom} size={36} />
        <span className="rc-kpi__rot">{rot}</span>
        {novo && <Badge t="Novo" tom="roxo" />}
        {dica && <Dica t={dica} />}
      </div>
      <p className="rc-kpi__valor">
        <strong>{valor}</strong>
        {de && <small> / {de}</small>}
      </p>
      {barra !== undefined && <Barra pct={barra} />}
      {extra && <small className={extraTom ? 'rc-verde' : ''}>{extra}</small>}
      {children}
    </div>
  )
}
const DICA = {
  participaram: 'Concluiu pelo menos uma batalha da Copa. Receber um desafio não é participação.',
  batalhas: 'Batalhas concluídas na Copa. Uma batalha conta uma vez, mesmo com 3 disciplinas.',
  acuracia: 'Respostas corretas ÷ respostas válidas. Sem resposta ao fim dos 10 minutos conta como incorreta.',
  tempo: 'Soma dos tempos das respostas corretas ÷ quantidade de respostas corretas. Sem respostas corretas: “sem dados”, nunca zero.',
  interacoes: 'Média de interações de aprendizagem por estudante no período da Copa.',
  mediaBat: 'Batalhas realizadas divididas pelos estudantes elegíveis, inclusive quem não jogou.',
  ativos: 'Percentual de estudantes que atendem ao critério vigente de atividade da plataforma.',
  adequada: 'Estudantes que atingem o critério de aprendizagem da plataforma, consolidado nas 3 disciplinas.',
}

/* ---------- 2.1 visão geral */
function Visao({ onExportar }: { onExportar: (ev?: MouseEvent) => void }) {
  const [q, setQ] = useState('')
  const [pag, setPag] = useState(1)
  const lista = ESTUDANTES.filter((e) => e.nome.toLowerCase().includes(q.toLowerCase()))
  const pagina = lista.slice((pag - 1) * 10, pag * 10)
  return (
    <>
      <div className="rc-kpis">
        <Kpi icon={Users} tom="roxo" rot="Participaram" valor={String(AGG.participaram)} extra={`de ${AGG.elegiveis} estudantes elegíveis (78%)`} dica={DICA.participaram} />
        <Kpi icon={Swords} tom="inf" rot="Batalhas concluídas" valor={String(AGG.batalhas)} extra="Contadas uma vez, mesmo com 3 disciplinas" dica={DICA.batalhas} />
        <Kpi icon={Target} tom="suc" rot="Taxa de acurácia" valor="66%" barra={66} extra="94% da meta de 70%" dica={DICA.acuracia} />
        <Kpi icon={Timer} tom="roxo" rot="Tempo médio de resposta correta" valor={`${AGG.tempo}s`} extra="4 s mais rápido que na semana anterior" extraTom="suc" novo dica={DICA.tempo} />
      </div>
      <section className="rx-cartao">
        <CabCard titulo="Desempenho dos estudantes" dica="Batalhas, resultados e engajamento de cada estudante que participou da Copa.">
          <Busca valor={q} onTroca={(v) => (setQ(v), setPag(1))} ph="Pesquisar pelo nome…" />
          <BotaoExportar onClick={onExportar} />
        </CabCard>
        <div className="rx-tabela-rola">
          <div className="rx-tabela rc-t-desemp">
            <div className="rx-tr is-cab">
              <Th ord>Estudante</Th>
              <Th ord>Turma</Th>
              <Th ord centro>
                Batalhas realizadas
              </Th>
              <Th ord centro>
                Vitórias
              </Th>
              <Th ord centro>
                Empates
              </Th>
              <Th ord centro>
                Derrotas
              </Th>
              <Th ord centro>
                Interações de aprendizagem
              </Th>
              <Th ord centro>
                Tempo de estudo
              </Th>
            </div>
            {pagina.map((e) => (
              <div key={e.nome} className="rx-tr">
                <b>{e.nome}</b>
                <span>{e.turma}</span>
                <span className="rc-centro">{e.bat}</span>
                <span className="rc-centro">{e.vit}</span>
                <span className="rc-centro">{e.emp}</span>
                <span className="rc-centro">{e.der}</span>
                <span className="rc-centro">{e.int}</span>
                <span className="rc-centro">{horas(e.est)}</span>
              </div>
            ))}
            {lista.length === 0 && <p className="rx-vazio">Nenhum estudante encontrado.</p>}
          </div>
        </div>
        <Paginacao total={q ? lista.length : AGG.elegiveis} reais={lista.length} pagina={pag} porPagina={10} rotulo="estudantes" onPagina={setPag} />
      </section>
      <Dispersao onExportar={onExportar} />
    </>
  )
}
function Dispersao({ onExportar }: { onExportar: (ev?: MouseEvent) => void }) {
  const [quad, setQuad] = useState<'todos' | Quad>('todos')
  const [q, setQ] = useState('')
  const [foco, setFoco] = useState<string | null>(null)
  const W = 640, H = 300, P = { l: 44, r: 12, t: 12, b: 36 }
  const x = (v: number) => P.l + (v / 50) * (W - P.l - P.r)
  const y = (v: number) => H - P.b - (v / 100) * (H - P.t - P.b)
  const lista = ESTUDANTES.filter((e) => (quad === 'todos' || e.quad === quad) && e.nome.toLowerCase().includes(q.toLowerCase())).sort((a, b) => b.acc - a.acc)
  return (
    <section className="rx-cartao">
      <CabCard titulo="Desempenho vs Engajamento" dica="Cruza o desempenho percentual com as interações de aprendizagem de cada estudante." sub="Cada ponto é um estudante. As linhas tracejadas marcam 60% de desempenho e 25 interações (parâmetros vigentes da plataforma)." />
      <svg className="rc-disp" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Gráfico de dispersão de desempenho por interações">
        {[0, 20, 40, 60, 80, 100].map((v) => (
          <g key={v}>
            <line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)} className="rc-disp__grade" />
            <text x={P.l - 8} y={y(v) + 4} textAnchor="end">
              {v}%
            </text>
          </g>
        ))}
        {[0, 10, 20, 30, 40, 50].map((v) => (
          <text key={v} x={x(v)} y={H - P.b + 18} textAnchor="middle">
            {v}
          </text>
        ))}
        <text x={(W + P.l) / 2} y={H - 4} textAnchor="middle" className="rc-disp__eixo">
          Interações realizadas
        </text>
        <line x1={x(25)} x2={x(25)} y1={P.t} y2={H - P.b} className="rc-disp__ref" />
        <line x1={P.l} x2={W - P.r} y1={y(60)} y2={y(60)} className="rc-disp__ref" />
        {PONTOS.map(([i, d], k) => {
          const qd = quadDe(i, d)
          return <circle key={k} cx={x(i)} cy={y(d)} r={4.5} fill={QUAD[qd].cor} opacity={quad === 'todos' || quad === qd ? 0.55 : 0.12} />
        })}
        {ESTUDANTES.map((e) => (
          <circle key={e.nome} cx={x(e.int)} cy={y(e.acc)} r={foco === e.nome ? 8 : 5.5} fill={QUAD[e.quad].cor} stroke="#fff" strokeWidth={1.5} opacity={quad === 'todos' || quad === e.quad ? 1 : 0.15} onMouseEnter={() => setFoco(e.nome)} onMouseLeave={() => setFoco(null)}>
            <title>{`${e.nome}: ${e.acc}% de desempenho, ${e.int} interações`}</title>
          </circle>
        ))}
      </svg>
      <div className="rc-quads">
        {(Object.keys(QUAD) as Quad[]).map((k) => (
          <button key={k} className={`rc-badge is-${QUAD[k].tom} ${quad === k ? 'is-ativo' : ''}`} onClick={() => setQuad(quad === k ? 'todos' : k)} aria-pressed={quad === k}>
            {QUAD[k].nome}
          </button>
        ))}
      </div>
      <div className="rc-filtros">
        <Select rotulo="Quadrante" valor={quad} onTroca={setQuad} opcoes={[['todos', 'Todos os quadrantes'], ...(Object.keys(QUAD) as Quad[]).map((k) => [k, QUAD[k].nome] as [Quad, string])]} />
        <span className="rx-espaco" />
        <Busca valor={q} onTroca={setQ} ph="Pesquisar pelo nome…" />
        <BotaoExportar onClick={onExportar} />
      </div>
      <div className="rx-tabela-rola">
        <div className="rx-tabela rc-t-quad">
          <div className="rx-tr is-cab">
            <Th ord>Estudante</Th>
            <Th ord>Turma</Th>
            <Th ord centro>
              Desempenho (%)
            </Th>
            <Th ord centro>
              Interações realizadas
            </Th>
            <Th>Quadrante</Th>
          </div>
          {lista.slice(0, 7).map((e) => (
            <div key={e.nome} className={`rx-tr ${foco === e.nome ? 'is-foco' : ''}`} onMouseEnter={() => setFoco(e.nome)} onMouseLeave={() => setFoco(null)}>
              <b>{e.nome}</b>
              <span>{e.turma}</span>
              <span className="rc-centro">{e.acc}%</span>
              <span className="rc-centro">{e.int}</span>
              <span>
                <Badge t={QUAD[e.quad].nome} tom={QUAD[e.quad].tom} />
              </span>
            </div>
          ))}
          {lista.length === 0 && <p className="rx-vazio">Nenhum estudante neste filtro.</p>}
        </div>
      </div>
      <Paginacao total={quad === 'todos' && !q ? 100 : lista.length} reais={Math.min(7, lista.length)} pagina={1} porPagina={7} rotulo="estudantes" onPagina={() => {}} />
    </section>
  )
}
function VisaoSemDados({ camp }: { camp: Campeonato }) {
  return (
    <>
      <div className="rc-kpis">
        <Kpi icon={Users} tom="roxo" rot="Participaram" valor="—" extra={`Sem dados: o campeonato começa em ${camp.periodo.slice(0, 5)}`} dica={DICA.participaram} />
        <Kpi icon={Swords} tom="inf" rot="Batalhas concluídas" valor="0" extra="Nenhuma batalha concluída ainda" dica={DICA.batalhas} />
        <Kpi icon={Target} tom="suc" rot="Taxa de acurácia" valor="—" extra="Sem respostas registradas" dica={DICA.acuracia} />
        <Kpi icon={Timer} tom="roxo" rot="Tempo médio de resposta correta" valor="—" extra="Sem respostas corretas para calcular" novo dica={DICA.tempo} />
      </div>
      <section className="rx-cartao">
        <CabCard titulo="Desempenho dos estudantes" dica="Batalhas, resultados e engajamento de cada estudante que participou." />
        <SemDadosBloco />
      </section>
    </>
  )
}
const SemDadosBloco = () => (
  <div className="rc-vazio">
    <span className="rc-vazio__icone">
      <Clock size={22} />
    </span>
    <b>Ainda não há dados para este relatório</b>
    <p>Os indicadores aparecem quando os estudantes concluírem as primeiras batalhas. Estudantes que ainda não participaram não contam como derrotas.</p>
  </div>
)
const SemDados = () => (
  <section className="rx-cartao">
    <SemDadosBloco />
  </section>
)

/* ---------- 2.2 engajamento */
function Engajamento({ onExportar, onFora }: { onExportar: (ev?: MouseEvent) => void; onFora: (n: string) => void }) {
  const [q, setQ] = useState('')
  const [turma, setTurma] = useState('todas')
  const [pag, setPag] = useState(1)
  const lista = ESTUDANTES.filter((e) => (turma === 'todas' || e.turma === turma) && e.nome.toLowerCase().includes(q.toLowerCase()))
  const pagina = lista.slice((pag - 1) * 10, pag * 10)
  return (
    <>
      <div className="rc-kpis is-3">
        <Kpi icon={ListChecks} tom="roxo" rot="Média de interações realizadas" valor="32" de="50" barra={64} extra="64% da meta" dica={DICA.interacoes} />
        <Kpi icon={Swords} tom="inf" rot="Média de batalhas por estudante" valor="5,0" de="10" barra={50} extra="50% da meta · considera os 128 elegíveis, inclusive quem não jogou" dica={DICA.mediaBat} />
        <Kpi icon={Users} tom="suc" rot="Estudantes ativos" valor="78%" de="90%" barra={87} extra="87% da meta" dica={DICA.ativos} />
      </div>
      <div className="rc-grid21">
        <section className="rx-cartao">
          <CabCard titulo="Progresso na atividade" dica="Estudantes elegíveis que participaram ou não da Copa." sub="Participou = concluiu pelo menos uma batalha da Copa. Receber um desafio não conta como participação." />
          <div className="rc-prog">
            {[
              ['Participou', 100, '100 (78%)', '#9E77ED'],
              ['Não participou', 28, '28 (22%)', '#D4D4D4'],
            ].map(([r, n, t, c]) => (
              <div key={r as string} className="rc-prog__linha">
                <span>{r}</span>
                <span className="rc-prog__trilho">
                  <motion.i initial={{ width: 0 }} animate={{ width: `${((n as number) / 128) * 100}%` }} transition={{ duration: 0.6 }} style={{ background: c as string }} />
                </span>
                <b>{t}</b>
              </div>
            ))}
            <div className="rc-prog__eixo">
              <span />
              <span className="rc-prog__marcas">
                {[0, 32, 64, 96, 128].map((v) => (
                  <small key={v}>{v}</small>
                ))}
              </span>
              <span />
            </div>
            <small className="rc-centro">Número de estudantes (de 128 elegíveis)</small>
          </div>
        </section>
        <section className="rx-cartao">
          <CabCard titulo="Ainda não participaram" sub="Não contam como derrota: só deixam de somar batalhas.">
            <Badge t="28" tom="neutro" />
          </CabCard>
          <ul className="rc-naopart">
            {NAO_PARTICIPARAM.map(([n, t]) => (
              <li key={n}>
                <UserRound size={16} />
                <b>{n}</b>
                <small>{t}</small>
              </li>
            ))}
          </ul>
          <button className="rx-btn is-contorno" onClick={() => onFora('Lista completa de quem não participou')}>
            Ver os 28 estudantes <ChevronRight size={16} />
          </button>
        </section>
      </div>
      <section className="rx-cartao">
        <CabCard titulo="Ranking de engajamento" dica="Classificação competitiva da Copa. Complementa, mas não mede aprendizagem.">
          <Busca valor={q} onTroca={(v) => (setQ(v), setPag(1))} ph="Pesquisar pelo nome…" />
          <BotaoExportar onClick={onExportar} />
        </CabCard>
        <Aviso>Ordenado por vitórias, como a classificação da Copa (vitórias → acertos → tempo médio → nome). O relatório não usa pontos.</Aviso>
        <div className="rc-filtros">
          <Select rotulo="Turma" valor={turma} onTroca={(v) => (setTurma(v), setPag(1))} opcoes={[['todas', 'Todas as turmas'], ...TURMAS.map((t) => [t, t] as [string, string])]} />
        </div>
        <div className="rx-tabela-rola">
          <div className="rx-tabela rc-t-engaj">
            <div className="rx-tr is-cab">
              <Th centro>Posição</Th>
              <Th ord>Estudante</Th>
              <Th ord>Turma</Th>
              <Th ord centro>
                Batalhas realizadas
              </Th>
              <Th ord centro>
                Vitórias
              </Th>
              <Th ord centro>
                Derrotas
              </Th>
              <Th ord centro>
                % de vitórias
              </Th>
            </div>
            {pagina.map((e) => (
              <div key={e.nome} className="rx-tr">
                <span className="rc-centro">
                  <Posicao n={ESTUDANTES.indexOf(e) + 1} />
                </span>
                <b>{e.nome}</b>
                <span>{e.turma}</span>
                <span className="rc-centro">{e.bat}</span>
                <span className="rc-centro">{e.vit}</span>
                <span className="rc-centro">{e.der}</span>
                <span className="rc-centro">{e.pv}%</span>
              </div>
            ))}
            {lista.length === 0 && <p className="rx-vazio">Nenhum estudante encontrado.</p>}
          </div>
        </div>
        <Paginacao total={q || turma !== 'todas' ? lista.length : 100} reais={lista.length} pagina={pag} porPagina={10} rotulo="estudantes que participaram" onPagina={setPag} />
      </section>
    </>
  )
}
const Posicao = ({ n }: { n: number }) => <span className={`rc-pos ${n <= 3 ? 'is-' + n : ''}`}>{n}º</span>

/* ---------- 2.3 aprendizagem */
function Subnav({ sub, onSub, recorte, onRecorte }: { sub: Sub; onSub: (s: Sub) => void; recorte: Recorte; onRecorte: (r: Recorte) => void }) {
  return (
    <div className="rc-subnav">
      <div className="rx-subnav" role="tablist" aria-label="Aprendizagem">
        {(
          [
            ['estudantes', 'Estudantes', Users],
            ['questoes', 'Questões e conteúdos', ListChecks],
          ] as [Sub, string, LucideIcon][]
        ).map(([id, t, I]) => (
          <button key={id} role="tab" aria-selected={sub === id} className={sub === id ? 'is-on' : ''} onClick={() => onSub(id)}>
            {sub === id && <motion.span layoutId="sub-aprend" className="rx-subnav__fundo" />}
            <I size={16} />
            <span>{t}</span>
          </button>
        ))}
      </div>
      <Select rotulo="Disciplina" valor={recorte} onTroca={onRecorte} opcoes={[['todas', 'Todas as disciplinas (consolidado)'], ['Matemática', 'Matemática'], ['Física', 'Física'], ['Química', 'Química']]} />
    </div>
  )
}
/** Acurácia do estudante no recorte (as respostas de cada disciplina ficam ligadas à disciplina). */
const accDe = (e: Estudante, r: Recorte) => (r === 'todas' ? e.acc : Math.max(20, Math.min(98, e.acc + POR_DISC[r].delta + ((e.nome.length % 5) - 2))))
const rubDe = (p: number) => (p >= 75 ? 'Avançado' : p >= 60 ? 'Proficiente' : p >= 45 ? 'Básico' : 'Insuficiente')
function AprendEstudantes({ recorte, onRanking, onExportar }: { recorte: Recorte; onRanking: () => void; onExportar: (ev?: MouseEvent) => void }) {
  const [q1, setQ1] = useState('')
  const [q2, setQ2] = useState('')
  const [pag, setPag] = useState(1)
  const d = recorte === 'todas' ? null : POR_DISC[recorte]
  const acc = d ? d.acc : AGG.acuracia[0]
  const adequada = d ? d.adequada : AGG.adequada[0]
  const tm = d ? d.tm : AGG.tempo
  const ranking = porAcuracia(ESTUDANTES.map((e) => ({ ...e, acc: accDe(e, recorte), rub: rubDe(accDe(e, recorte)) as Estudante['rub'] })))
  const topo = ranking.filter((e) => e.nome.toLowerCase().includes(q1.toLowerCase())).slice(0, 8)
  const tabela = ranking.filter((e) => e.nome.toLowerCase().includes(q2.toLowerCase()))
  return (
    <>
      {d && (
        <Aviso icon={BookOpen}>
          Mostrando só as respostas de <b>{recorte}</b> ({fmt(d.respostas)} respostas válidas em {d.questoes} questões). As médias da disciplina não misturam respostas das outras.
        </Aviso>
      )}
      <div className="rc-kpis">
        <Kpi icon={Target} tom="suc" rot="Taxa de acurácia" valor={`${acc}%`} de="70%" barra={Math.round((acc / 70) * 100)} extra={`${Math.round((acc / 70) * 100)}% da meta · respostas corretas ÷ respostas válidas`} dica={DICA.acuracia} />
        <Kpi icon={GraduationCap} tom="roxo" rot="Aprendizagem adequada" valor={`${adequada}%`} de="60%" barra={Math.round((adequada / 60) * 100)} extra={`${Math.round((adequada / 60) * 100)}% da meta · ${adequada} de 100 avaliados`} dica={DICA.adequada} />
        <Kpi icon={Timer} tom="roxo" rot="Tempo médio de resposta correta" valor={`${tm}s`} novo extra={d ? `Consolidado da Copa: ${AGG.tempo}s` : '4 s mais rápido que na semana anterior'} extraTom={d ? undefined : 'suc'} dica={DICA.tempo}>
          {!d && (
            <ul className="rc-tdisc">
              {DISC_COPA.map((x) => (
                <li key={x.nome}>
                  <span>{x.nome}</span>
                  <b>{POR_DISC[x.nome as Exclude<Recorte, 'todas'>].tm}s</b>
                </li>
              ))}
            </ul>
          )}
        </Kpi>
        <div className="rc-kpi">
          <div className="rc-kpi__topo">
            <span className="rc-kpi__rot is-forte">Rubricas de proficiência</span>
            <Dica t="Faixas pela acurácia consolidada nas 3 disciplinas. A fonte oficial das rubricas está em validação." />
          </div>
          <span className="rc-pilha" aria-hidden>
            {RUBRICAS.map((r) => (
              <i key={r.nome} style={{ flex: r.n, background: r.cor }} />
            ))}
          </span>
          <small>Meta: proficiente + avançado ≥ 60% dos avaliados</small>
          <ul className="rc-rubs">
            {RUBRICAS.map((r) => (
              <li key={r.nome}>
                <i style={{ background: r.cor }} />
                <span>{r.nome}</span>
                <b>{Math.round((r.n / 128) * 100)}%</b>
                <small>{r.n}</small>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Aviso icon={Info}>O tempo médio considera só as respostas corretas válidas (soma dos tempos ÷ quantidade de corretas). Um tempo menor não significa, sozinho, mais aprendizagem: leia junto com a acurácia.</Aviso>
      <section className="rx-cartao">
        <CabCard titulo="Ranking de aprendizagem da turma" dica="Ordem pela acurácia. Independe da classificação da Copa.">
          <Busca valor={q1} onTroca={setQ1} ph="Pesquisar pelo nome…" />
          <button className="rx-btn is-contorno" onClick={onRanking}>
            <ListChecks size={16} /> Ranking completo
          </button>
        </CabCard>
        <p className="rc-mudo">Acurácia de cada estudante em relação à meta de 60%. Independente da classificação da Copa.</p>
        <ol className="rc-rank">
          {topo.map((e) => (
            <li key={e.nome}>
              <span className="rc-mudo">{ranking.indexOf(e) + 1}º</span>
              <b>{e.nome}</b>
              <Barra pct={e.acc} cor={corRubrica(e.rub)} meta={60} alto />
              <b className="rc-dir">{e.acc}%</b>
            </li>
          ))}
          {topo.length === 0 && <p className="rx-vazio">Nenhum estudante encontrado.</p>}
        </ol>
        <Legenda />
      </section>
      <section className="rx-cartao">
        <CabCard titulo="Ranking de aprendizagem" dica="Indicadores pedagógicos por estudante, com os indicadores de batalha à parte.">
          <Busca valor={q2} onTroca={(v) => (setQ2(v), setPag(1))} ph="Pesquisar pelo nome…" />
          <BotaoExportar onClick={onExportar} />
        </CabCard>
        <Aviso icon={Swords} tom="cinza">
          A posição segue a acurácia (indicador pedagógico). Vitórias, derrotas e % de vitórias são indicadores de batalha e não substituem a aprendizagem.
        </Aviso>
        <div className="rx-tabela-rola">
          <div className="rx-tabela rc-t-aprend">
            <div className="rc-grupo">
              <span />
              <span>Indicadores de batalha</span>
            </div>
            <div className="rx-tr is-cab">
              <Th centro>Posição</Th>
              <Th ord>Estudante</Th>
              <Th ord>Turma</Th>
              <Th ord centro>
                Acurácia
              </Th>
              <Th ord centro>
                Tempo médio (corretas)
              </Th>
              <Th ord>Rubrica</Th>
              <Th ord centro>
                Vitórias
              </Th>
              <Th ord centro>
                Derrotas
              </Th>
              <Th ord centro>
                % de vitórias
              </Th>
            </div>
            {tabela.slice((pag - 1) * 8, pag * 8).map((e) => (
              <div key={e.nome} className="rx-tr">
                <span className="rc-centro">
                  <Posicao n={ranking.indexOf(e) + 1} />
                </span>
                <b>{e.nome}</b>
                <span>{e.turma}</span>
                <span className="rc-centro">{e.acc}%</span>
                <span className="rc-centro">{e.tm}s</span>
                <span>
                  <span className="rc-rub">
                    <i style={{ background: corRubrica(e.rub) }} />
                    {e.rub}
                  </span>
                </span>
                <span className="rc-centro rc-batalha">{e.vit}</span>
                <span className="rc-centro rc-batalha">{e.der}</span>
                <span className="rc-centro rc-batalha">{e.pv}%</span>
              </div>
            ))}
            {tabela.length === 0 && <p className="rx-vazio">Nenhum estudante encontrado.</p>}
          </div>
        </div>
        <Paginacao total={q2 ? tabela.length : 100} reais={tabela.length} pagina={pag} porPagina={8} rotulo="estudantes avaliados" onPagina={setPag} />
      </section>
    </>
  )
}
const Legenda = () => (
  <div className="rc-legenda">
    {RUBRICAS.slice(0, 4).map((r) => (
      <span key={r.nome}>
        <i style={{ background: r.cor }} /> {r.nome}
      </span>
    ))}
    <span>
      <i className="is-meta" /> Meta (60%)
    </span>
  </div>
)

function AprendQuestoes({ recorte, onExportar }: { recorte: Recorte; onExportar: (ev?: MouseEvent) => void }) {
  const [disc, setDisc] = useState<string>(recorte === 'todas' ? 'todas' : recorte)
  const [top, setTop] = useState('todos')
  const [ordem, setOrdem] = useState<'dificil' | 'facil' | 'tempo'>('dificil')
  const [q, setQ] = useState('')
  const [pag, setPag] = useState(1)
  useEffect(() => setDisc(recorte === 'todas' ? 'todas' : recorte), [recorte])
  const topicos = TOPICOS.filter((t) => recorte === 'todas' || t.disc === recorte)
  const resumo = DISC_COPA.filter((x) => recorte === 'todas' || x.nome === recorte)
  const questoes = QUESTOES.filter((x) => (disc === 'todas' || x.disc === disc) && (top === 'todos' || x.topico === top) && (x.enunciado + x.id).toLowerCase().includes(q.toLowerCase())).sort((a, b) => (ordem === 'dificil' ? pctQ(a) - pctQ(b) : ordem === 'facil' ? pctQ(b) - pctQ(a) : b.tm - a.tm))
  const opTop = TOPICOS.filter((t) => t.q > 0 && (disc === 'todas' || t.disc === disc)).map((t) => [t.topico, t.topico] as [string, string])
  return (
    <>
      <div className={`rc-resumo is-${resumo.length}`}>
        {resumo.map((x) => {
          const v = POR_DISC[x.nome as Exclude<Recorte, 'todas'>]
          return (
            <div key={x.nome} className="rc-kpi">
              <div className="rc-kpi__topo">
                <DiscBadge d={x} />
                <span className="rx-espaco" />
                <small>{v.questoes} questões</small>
              </div>
              <div className="rc-resumo__vals">
                <span>
                  <small>Acerto</small>
                  <strong>{v.acc}%</strong>
                </span>
                <span>
                  <small>Tempo médio (corretas)</small>
                  <strong>{v.tm}s</strong>
                </span>
              </div>
              <Barra pct={v.acc} />
              <small>{fmt(v.respostas)} respostas válidas</small>
            </div>
          )
        })}
      </div>
      <section className="rx-cartao">
        <CabCard titulo="Desempenho por disciplina e tópico" dica="Cada resposta fica ligada à sua questão, disciplina e tópico." sub="Cada resposta fica ligada à sua questão, disciplina e tópico. As médias por disciplina usam só as respostas daquela disciplina.">
          <BotaoExportar onClick={onExportar} />
        </CabCard>
        <div className="rx-tabela-rola">
          <div className="rx-tabela rc-t-top">
            <div className="rx-tr is-cab">
              <Th>Disciplina</Th>
              <Th ord>Tópico</Th>
              <Th ord centro>
                Questões usadas
              </Th>
              <Th ord centro>
                Respostas
              </Th>
              <Th ord>% de acerto</Th>
              <Th ord centro>
                Tempo médio (corretas)
              </Th>
              <Th />
            </div>
            {topicos.map((t) => (
              <div key={t.topico} className={`rx-tr ${t.ac !== null && t.ac < LIMITE_DIFICULDADE ? 'is-dificil' : ''}`}>
                <span>
                  <Badge t={t.disc} tom={t.tom} />
                </span>
                <b>{t.topico}</b>
                <span className="rc-centro">{t.q}</span>
                <span className="rc-centro">{fmt(t.r)}</span>
                <span>{t.ac === null ? <Badge t="Sem dados" tom="neutro" /> : <Pct p={t.ac} />}</span>
                <span className="rc-centro">{t.tm === null ? '—' : `${t.tm}s`}</span>
                <span>{t.ac === null ? <small>Nenhuma questão usada</small> : t.ac < LIMITE_DIFICULDADE ? <Badge t="Maior dificuldade" tom="cr" icon={TrendingDown} /> : null}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="rx-cartao">
        <CabCard titulo="Questões do campeonato" dica="Questões apresentadas nas batalhas da Copa." sub="Questões apresentadas nas batalhas. Questões não usadas não contam como incorretas; sem resposta ao fim dos 10 minutos conta como incorreta, como no resultado da batalha." />
        <div className="rc-filtros">
          <Select rotulo="Disciplina" valor={disc} onTroca={(v) => (setDisc(v), setTop('todos'), setPag(1))} opcoes={[['todas', 'Todas as disciplinas'], ...DISC_COPA.map((x) => [x.nome, x.nome] as [string, string])]} />
          <Select rotulo="Tópico" valor={top} onTroca={(v) => (setTop(v), setPag(1))} opcoes={[['todos', 'Todos os tópicos'], ...opTop]} />
          <Select
            rotulo="Ordenar"
            valor={ordem}
            onTroca={setOrdem}
            opcoes={[
              ['dificil', 'Maior dificuldade primeiro'],
              ['facil', 'Maior acerto primeiro'],
              ['tempo', 'Maior tempo médio primeiro'],
            ]}
          />
          <span className="rx-espaco" />
          <Busca valor={q} onTroca={(v) => (setQ(v), setPag(1))} ph="Pesquisar questão…" />
        </div>
        <div className="rx-tabela-rola">
          <div className="rx-tabela rc-t-quest">
            <div className="rx-tr is-cab">
              <Th>Questão</Th>
              <Th>Disciplina</Th>
              <Th ord>Tópico</Th>
              <Th ord centro>
                Corretas
              </Th>
              <Th ord centro>
                Incorretas
              </Th>
              <Th ord>% de acerto</Th>
              <Th ord centro>
                Tempo médio (corretas)
              </Th>
            </div>
            {questoes.slice((pag - 1) * 8, pag * 8).map((x) => (
              <div key={x.id} className="rx-tr">
                <span className="rc-quest">
                  <small>{x.id}</small>
                  <span>{x.enunciado}</span>
                </span>
                <span>
                  <Badge t={x.disc} tom={x.tom} />
                </span>
                <span>{x.topico}</span>
                <span className="rc-centro">{x.c}</span>
                <span className="rc-centro">{x.i}</span>
                <span>
                  <Pct p={pctQ(x)} />
                </span>
                <span className="rc-centro">{x.tm}s</span>
              </div>
            ))}
            {questoes.length === 0 && <p className="rx-vazio">Nenhuma questão neste filtro.</p>}
          </div>
        </div>
        <Paginacao total={disc === 'todas' && top === 'todos' && !q ? 173 : questoes.length} reais={questoes.length} pagina={pag} porPagina={8} rotulo="questões usadas" onPagina={setPag} />
      </section>
    </>
  )
}

/* ---------- 2.4 glossário */
type Item = [LucideIcon, Tom, string, string, string, boolean?]
const GLOS: [string, LucideIcon, string | null, Item[]][] = [
  [
    'Indicadores de engajamento',
    Users,
    null,
    [
      [ListChecks, 'inf', 'Interações de aprendizagem', 'Quantidade de interações registradas durante o campeonato.', 'Segue a definição vigente de interação da plataforma.'],
      [ChartColumn, 'inf', 'Média de interações realizadas', 'Média de interações por estudante no escopo considerado.', 'Comparada à meta do relatório de referência.'],
      [Swords, 'at', 'Média de batalhas por estudante', 'Batalhas realizadas divididas pelos estudantes elegíveis.', 'Quem não jogou entra no denominador: a média não é inflada.'],
      [Users, 'suc', 'Estudantes ativos', 'Percentual de estudantes que atendem ao critério vigente de atividade.', 'Mesma definição de atividade da plataforma.'],
      [CircleCheck, 'suc', 'Participação no campeonato', 'Concluiu pelo menos uma batalha da Copa.', 'Receber um desafio não é participação. Não participar não é derrota.'],
      [Clock, 'inf', 'Tempo de estudo', 'Tempo de estudo registrado para o estudante.', 'Conforme a métrica disponível na GenieX.'],
    ],
  ],
  [
    'Indicadores de aprendizagem',
    Target,
    null,
    [
      [Target, 'cr', 'Taxa de acurácia', 'Respostas corretas ÷ respostas válidas nas batalhas.', 'Sem resposta ao fim dos 10 minutos conta como incorreta, como no resultado da batalha.'],
      [GraduationCap, 'roxo', 'Aprendizagem adequada', 'Estudantes que atingem o critério de aprendizagem da plataforma.', 'Consolidado nas 3 disciplinas, sem criar critério novo.'],
      [ChartColumn, 'roxo', 'Desempenho percentual', 'Resultado percentual usado no gráfico de desempenho × engajamento.', 'Usa a mesma base da tabela de desempenho.'],
      [Timer, 'roxo', 'Tempo médio de resposta correta', 'Soma dos tempos das respostas corretas ÷ quantidade de respostas corretas.', 'Ex.: 8 s, 12 s e 10 s → 10 s. Respostas erradas e sem resposta não entram. Sem respostas corretas: “sem dados”, nunca zero.', true],
    ],
  ],
  [
    'Indicadores de batalha',
    Swords,
    'Classificação competitiva: complementa, mas não mede aprendizagem.',
    [
      [Swords, 'inf', 'Batalhas realizadas', 'Batalhas contabilizadas para o estudante conforme as regras da GenieX.', 'Uma batalha conta uma vez, mesmo com 3 disciplinas.'],
      [Trophy, 'suc', 'Vitórias', 'Batalhas vencidas pelo estudante (inclui W.O.).', 'Resultados oficiais das batalhas.'],
      [CircleX, 'cr', 'Derrotas', 'Batalhas perdidas pelo estudante.', 'Exclui batalhas sem vencedor, canceladas ou pendentes.'],
      [Percent, 'roxo', 'Percentual de vitórias', 'Vitórias ÷ batalhas válidas realizadas.', 'Calculado só com batalhas que têm resultado.'],
    ],
  ],
]
function Glossario() {
  return (
    <section className="rx-cartao">
      <div>
        <h2 className="rc-h2">Glossário de indicadores</h2>
        <p className="rc-mudo">Entenda o que cada indicador deste relatório significa e como ele é calculado.</p>
      </div>
      {GLOS.map(([tit, I, nota, itens]) => (
        <div key={tit} className="rc-glos">
          <div className="rc-glos__cab">
            <span className="rc-glos__ic">
              <I size={16} />
            </span>
            <b>{tit}</b>
          </div>
          {nota && <small>{nota}</small>}
          <div className="rc-glos__grade">
            {itens.map(([Ic, tom, t, def, obs, novo]) => (
              <div key={t} className="rc-glos__item">
                <Tile icon={Ic} tom={tom} size={40} />
                <span>
                  <span className="rc-glos__nome">
                    <b>{t}</b>
                    {novo && <Badge t="Novo" tom="roxo" />}
                  </span>
                  <span className="rc-mudo">{def}</span>
                  <span className="rc-glos__obs">
                    <Info size={14} />
                    {obs}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="rc-glos">
        <div className="rc-glos__cab">
          <span className="rc-glos__ic">
            <Star size={16} />
          </span>
          <b>Rubricas de proficiência</b>
        </div>
        <small>Faixas pela acurácia consolidada nas 3 disciplinas. Os limites abaixo são do protótipo: a fonte oficial das rubricas está em validação (PRD 11.2).</small>
        <div className="rc-glos__rubs">
          {RUBRICAS.map((r) => (
            <div key={r.nome} className="rc-glos__item is-rub">
              <span className="rc-rub">
                <i style={{ background: r.cor }} />
                <b>{r.nome}</b>
              </span>
              <small>{r.faixa}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ sobrepostos (sempre com véu) */
const ABA_NOME: Record<Aba, string> = { visao: 'Visão geral', engajamento: 'Engajamento', aprendizagem: 'Aprendizagem', glossario: 'Glossário' }
function MenuExportar({ aba, celular, ancora, onFechar, onEscolher }: { aba: Aba; celular: boolean; ancora: { top: number; right: number } | null; onFechar: () => void; onEscolher: (titulo: string) => void }) {
  const itens: [LucideIcon, Tom, string, string, string][] = [
    [FileText, 'cr', 'PDF · relatório completo', 'As 4 abas, com gráficos, tabelas e glossário', 'Gerando o PDF do relatório…'],
    [FileSpreadsheet, 'suc', 'Planilha (.xlsx) · aba atual', 'Tabelas da aba aberta, com os filtros aplicados', `Gerando a planilha de ${ABA_NOME[aba]}…`],
    [Sheet, 'inf', 'CSV · respostas das batalhas', 'Uma linha por resposta: estudante, disciplina, tópico e tempo', 'Gerando o CSV das respostas…'],
  ]
  return (
    <>
      <motion.div className={`rc-veu ${celular ? '' : 'is-leve'}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onFechar} />
      <motion.div
        className={celular ? 'rc-folha' : 'rc-menu'}
        style={!celular && ancora ? { top: ancora.top, right: ancora.right } : undefined}
        role="dialog"
        aria-label="Exportar relatório"
        initial={celular ? { y: '100%' } : { opacity: 0, y: -6, scale: 0.98 }}
        animate={celular ? { y: 0 } : { opacity: 1, y: 0, scale: 1 }}
        exit={celular ? { y: '100%' } : { opacity: 0, y: -6 }}
        transition={{ type: 'spring', stiffness: 420, damping: 36 }}
      >
        {celular && <i className="rx-folha__alca" />}
        <div className="rc-menu__cab">
          <b>Exportar relatório</b>
          <small>Aba atual: {ABA_NOME[aba]}</small>
        </div>
        {itens.map(([I, tom, t, s, toast]) => (
          <button key={t} className="rc-opcao" onClick={() => onEscolher(toast)}>
            <Tile icon={I} tom={tom} size={36} />
            <span>
              <b>{t}</b>
              <small>{s}</small>
            </span>
          </button>
        ))}
        {celular ? (
          <button className="rx-btn is-contorno is-cheio" onClick={onFechar}>
            Cancelar
          </button>
        ) : (
          <p className="rc-menu__nota">
            <Info size={14} /> O arquivo respeita os filtros aplicados e fica pronto em alguns segundos.
          </p>
        )}
      </motion.div>
    </>
  )
}
function Dialogo({ celular, folha, titulo, sub, onFechar, largura, children }: { celular: boolean; folha?: boolean; titulo: string; sub?: string; onFechar: () => void; largura: number; children: ReactNode }) {
  const comoFolha = celular && folha
  return (
    <>
      <motion.div className="rc-veu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onFechar} />
      <div className={`rc-dialogo-pos ${comoFolha ? 'is-folha' : ''}`}>
        <motion.div
          className={`rc-dialogo ${comoFolha ? 'is-folha' : ''}`}
          style={{ maxWidth: comoFolha ? undefined : largura }}
          role="dialog"
          aria-modal="true"
          aria-label={titulo}
          initial={comoFolha ? { y: '100%' } : { opacity: 0, scale: 0.96, y: 8 }}
          animate={comoFolha ? { y: 0 } : { opacity: 1, scale: 1, y: 0 }}
          exit={comoFolha ? { y: '100%' } : { opacity: 0, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 420, damping: 36 }}
        >
          <div className="rc-dialogo__cab">
            <div>
              <h2>{titulo}</h2>
              {sub && <p>{sub}</p>}
            </div>
            <button className="rx-icone-btn" onClick={onFechar} aria-label="Fechar">
              <X size={20} />
            </button>
          </div>
          {children}
        </motion.div>
      </div>
    </>
  )
}
function Compartilhar({ celular, onFechar, onCopiar }: { celular: boolean; onFechar: () => void; onCopiar: () => void }) {
  const [quem, setQuem] = useState('escola')
  return (
    <Dialogo celular={celular} titulo="Compartilhar relatório" sub="Envie o link para outros educadores. Cada pessoa vê os dados de acordo com a própria permissão." onFechar={onFechar} largura={560}>
      <label className="rc-campo">
        <span>Link do relatório</span>
        <span className="rx-busca">
          <Link2 size={16} />
          <input readOnly value={LINK} onFocus={(e) => e.currentTarget.select()} />
        </span>
      </label>
      <label className="rc-campo">
        <span>Quem pode abrir</span>
        <Select
          rotulo="Quem pode abrir"
          valor={quem}
          onTroca={setQuem}
          opcoes={[
            ['escola', 'Educadores com acesso à Escola GenieX'],
            ['coord', 'Somente a coordenação'],
          ]}
        />
      </label>
      <p className="rc-aviso is-roxo">
        <Lock size={16} />
        <span>O link não libera dados para quem não tem acesso à escola na plataforma. Estudantes não abrem este relatório.</span>
      </p>
      <div className="rc-dialogo__acoes">
        <button className="rx-btn is-contorno" onClick={onFechar}>
          Cancelar
        </button>
        <button className="rx-btn is-primario" onClick={onCopiar}>
          <Copy size={16} /> Copiar link
        </button>
      </div>
    </Dialogo>
  )
}
function RankingCompleto({ celular, onFechar }: { celular: boolean; onFechar: () => void }) {
  const [q, setQ] = useState('')
  const [turma, setTurma] = useState('todas')
  const ranking = porAcuracia(ESTUDANTES)
  const lista = ranking.filter((e) => (turma === 'todas' || e.turma === turma) && e.nome.toLowerCase().includes(q.toLowerCase()))
  return (
    <Dialogo celular={celular} folha titulo="Ranking de aprendizagem da turma" sub="Acurácia de cada estudante em relação à meta de 60%. Independe da classificação da Copa." onFechar={onFechar} largura={720}>
      <div className="rc-filtros">
        <Busca valor={q} onTroca={setQ} ph="Pesquisar pelo nome…" />
        <Select rotulo="Turma" valor={turma} onTroca={setTurma} opcoes={[['todas', 'Todas as turmas'], ...TURMAS.map((t) => [t, t] as [string, string])]} />
      </div>
      <ol className="rc-rank is-modal">
        {lista.map((e) => (
          <li key={e.nome}>
            <span className="rc-mudo">{ranking.indexOf(e) + 1}º</span>
            <span className="rc-rank__nome">
              <b>{e.nome}</b>
              <small>
                {e.turma} · {e.rub}
              </small>
            </span>
            <Barra pct={e.acc} cor={corRubrica(e.rub)} meta={60} />
            <b className="rc-dir">{e.acc}%</b>
          </li>
        ))}
        {lista.length === 0 && <p className="rx-vazio">Nenhum estudante encontrado.</p>}
      </ol>
      <Legenda />
      <div className="rc-dialogo__acoes">
        <small className="rx-espaco">Mostrando {lista.length} de 100 estudantes avaliados · role para ver mais</small>
        <button className="rx-btn is-contorno" onClick={onFechar}>
          Fechar
        </button>
      </div>
    </Dialogo>
  )
}
