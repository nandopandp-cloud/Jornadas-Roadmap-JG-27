import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Brain,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsUpDown,
  CircleHelp,
  Coins,
  Download,
  Ellipsis,
  FileText,
  FlaskConical,
  GraduationCap,
  Heart,
  Home,
  Hourglass,
  Info,
  Layers,
  Lightbulb,
  Menu,
  MessageCircle,
  Palette,
  RefreshCw,
  Rocket,
  School,
  Search,
  Shield,
  SlidersHorizontal,
  Sparkles,
  Star,
  Target,
  Trophy,
  UserRound,
  Users,
  Wrench,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useMemo, useState, type MouseEvent, type ReactNode } from 'react'
import type { PrototypeProps } from '../../platform/journeys'
import { CARREIRA, FONTES, REVISAO, type Carreira } from '../teste-vocacional/carreiras'
import { ESCALA, HABILIDADES, itensDo, N_ITENS, type Dim } from '../teste-vocacional/instrumento'
import { CATEGORIA, habilidades as habDe, nivel, preferencias as prefDe, type Recomendacao } from '../teste-vocacional/motor'
import { ESCOLAS, ESTUDANTES, SEM_DEV, STATUS, daEscola, doTurma, estudantePorId, totais, turmaPorId, turmasDa, type Estudante, type Status } from './dados'
import './rtv.css'

/* ---------------- dimensões na linguagem do relatório (Metodologia §1 e PRD §6.2) ---------------- */
const DIM_E: Record<Dim, { nome: string; desc: string; exemplos: string; curto: string; icone: LucideIcon; cor: string; claro: string }> = {
  R: { nome: 'Realista', desc: 'Interesse por atividades práticas, técnicas e com resultados concretos.', exemplos: 'montar, construir, operar e cuidar de equipamentos.', curto: 'atividades práticas e técnicas', icone: Wrench, cor: '#c0391b', claro: '#fde7e2' },
  I: { nome: 'Investigativo', desc: 'Interesse por pesquisa, análise, investigação e resolução de problemas.', exemplos: 'investigar dados, realizar experimentos, buscar explicações.', curto: 'investigação e análise', icone: FlaskConical, cor: '#d4325d', claro: '#fde4ec' },
  A: { nome: 'Artístico', desc: 'Interesse por criação, expressão, estética e comunicação de ideias.', exemplos: 'criar projetos, produzir conteúdos, explorar linguagens artísticas.', curto: 'criação e expressão', icone: Palette, cor: '#1d6fd6', claro: '#e1edfd' },
  S: { nome: 'Social', desc: 'Interesse por colaborar, ensinar, orientar e contribuir com o desenvolvimento de pessoas.', exemplos: 'trabalhar com pessoas, compartilhar conhecimentos, ajudar.', curto: 'colaboração e apoio a pessoas', icone: Users, cor: '#6b35c9', claro: '#eee5fd' },
  E: { nome: 'Empreendedor', desc: 'Interesse por liderar, tomar iniciativas, negociar e desenvolver projetos.', exemplos: 'propor ideias, liderar equipes, planejar projetos e soluções.', curto: 'liderança e iniciativa', icone: Rocket, cor: '#c2366f', claro: '#fde3ef' },
  C: { nome: 'Convencional', desc: 'Interesse por organização, planejamento, rotinas e trabalho com informações.', exemplos: 'organizar dados, seguir processos, manter registros.', curto: 'organização e planejamento', icone: FileText, cor: '#3f51c4', claro: '#e6e9fb' },
}
const VAL_ICONE: Record<string, LucideIcon> = { V01: Shield, V02: Coins, V03: Rocket, V04: Users, V05: Lightbulb, V06: GraduationCap, V07: Star, V08: CalendarDays }
const VAL_NOME: Record<string, string> = { V01: 'Estabilidade e previsibilidade', V02: 'Remuneração', V03: 'Autonomia', V04: 'Impacto social', V05: 'Criatividade', V06: 'Aprendizado contínuo', V07: 'Reconhecimento', V08: 'Flexibilidade' }
const HAB_ICONE: Record<string, LucideIcon> = { H01: Brain, H02: Lightbulb, H03: MessageCircle, H04: Layers, H05: Users, H06: Search, H07: Zap, H08: Wrench }
/** opção escolhida em linguagem corrida, para a síntese */
const PREF_FRASE: Record<string, [string, string]> = {
  P01: ['interagir com outras pessoas', 'períodos de concentração individual'],
  P02: ['rotinas e processos definidos', 'atividades que mudam com frequência'],
  P03: ['resultados práticos e concretos', 'ideias, conceitos e análises'],
  P04: ['executar objetivos já definidos', 'ajudar a definir objetivos e construir soluções'],
  P05: ['aprofundar-se em um tema', 'alternar entre temas e atividades'],
  P06: ['atuar presencialmente ou em campo', 'atuar em ambiente digital ou remoto'],
}
const PREF: Record<string, { tema: string; pergunta: string; icone: LucideIcon; arte: [string, string] }> = {
  P01: { tema: 'Interação com pessoas', pergunta: 'Como prefere se relacionar no trabalho.', icone: Users, arte: ['./voc/handshake.webp', './voc/brain.webp'] },
  P02: { tema: 'Rotina e organização', pergunta: 'Como prefere a dinâmica das atividades.', icone: Layers, arte: ['./voc/spiral-notepad.webp', './voc/high-voltage.webp'] },
  P03: { tema: 'Tipo de atividade', pergunta: 'Que tipo de resultado desperta mais interesse.', icone: BarChart3, arte: ['./voc/hammer-and-wrench.webp', './voc/bar-chart.webp'] },
  P04: { tema: 'Forma de atuação', pergunta: 'Como prefere participar das tarefas.', icone: Target, arte: ['./voc/check-mark-button.webp', './voc/puzzle-piece.webp'] },
  P05: { tema: 'Foco e profundidade', pergunta: 'Como prefere lidar com os temas de trabalho.', icone: Brain, arte: ['./3d/books.png', './voc/world-map.webp'] },
  P06: { tema: 'Ambiente de trabalho', pergunta: 'Em qual formato prefere atuar.', icone: Home, arte: ['./voc/building-construction.webp', './voc/laptop.webp'] },
}

/* ---------------- utilidades ---------------- */
const MESES = ['jan.', 'fev.', 'mar.', 'abr.', 'maio', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.']
const dataCurta = (t?: number) => {
  if (!t) return '—'
  const d = new Date(t)
  return `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}, ${String(d.getHours()).padStart(2, '0')}h${String(d.getMinutes()).padStart(2, '0')}`
}
const dataLonga = (t?: number) => {
  if (!t) return '—'
  const d = new Date(t)
  return `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}, às ${String(d.getHours()).padStart(2, '0')}h${String(d.getMinutes()).padStart(2, '0')}`
}
const lista = (xs: string[]) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} e ${xs[xs.length - 1]}`)
const primeiroNome = (n: string) => n.split(' ')[0]
/** justificativas do motor estão escritas para o estudante; aqui, em terceira pessoa para o professor */
const paraProfessor = (t: string) =>
  t
    .replace('Suas respostas indicam', 'As respostas indicam')
    .replace('Você respondeu', 'Respondeu')
    .replace('Amplia seu repertório', 'Amplia o repertório')
    .replace('nas suas respostas', 'nas respostas')
    .replace('que você marcou como importante', 'entre os valores marcados como importantes')
    .replace('e você indicou preferir', 'e a preferência indicada foi')
/** **negrito** do texto do motor */
const Rico = ({ t }: { t: string }) => (
  <>
    {t.split(/\*\*(.+?)\*\*/g).map((p, i) => (i % 2 ? <b key={i}>{p}</b> : <span key={i}>{p}</span>))}
  </>
)

function useMedia(q: string) {
  const [ok, setOk] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches)
  useEffect(() => {
    const m = window.matchMedia(q)
    const f = () => setOk(m.matches)
    f()
    m.addEventListener('change', f)
    return () => m.removeEventListener('change', f)
  }, [q])
  return ok
}

/* ---------------- telas e atalhos de fluxo ---------------- */
type Aba = 'visao' | 'areas' | 'profissoes' | 'valores' | 'preferencias' | 'habilidades' | 'sintese'
type Filtro = 'todos' | Status
type Tela = { id: 'escolas' } | { id: 'lista'; turma: string; filtro: Filtro } | { id: 'rel'; aluno: string; aba: Aba }
const ANA = '3a-0'
const INICIO: Record<string, { tela: Tela; exportar?: boolean; profissao?: string; busca?: string }> = {
  escolas: { tela: { id: 'escolas' } },
  lista: { tela: { id: 'lista', turma: '3a', filtro: 'todos' } },
  concluidos: { tela: { id: 'lista', turma: '3a', filtro: 'concluido' } },
  andamento: { tela: { id: 'lista', turma: '3a', filtro: 'andamento' } },
  'nao-iniciados': { tela: { id: 'lista', turma: '3a', filtro: 'nao-iniciado' } },
  busca: { tela: { id: 'lista', turma: '3a', filtro: 'todos' }, busca: 'ana' },
  'outra-turma': { tela: { id: 'lista', turma: '3b', filtro: 'todos' } },
  visao: { tela: { id: 'rel', aluno: ANA, aba: 'visao' } },
  areas: { tela: { id: 'rel', aluno: ANA, aba: 'areas' } },
  profissoes: { tela: { id: 'rel', aluno: ANA, aba: 'profissoes' } },
  profissao: { tela: { id: 'rel', aluno: ANA, aba: 'profissoes' }, profissao: 'primeira' },
  valores: { tela: { id: 'rel', aluno: ANA, aba: 'valores' } },
  preferencias: { tela: { id: 'rel', aluno: ANA, aba: 'preferencias' } },
  habilidades: { tela: { id: 'rel', aluno: ANA, aba: 'habilidades' } },
  sintese: { tela: { id: 'rel', aluno: ANA, aba: 'sintese' } },
  exportar: { tela: { id: 'rel', aluno: ANA, aba: 'visao' }, exportar: true },
  'sem-dado': { tela: { id: 'rel', aluno: SEM_DEV, aba: 'habilidades' } },
}
const ABAS: [Aba, string, LucideIcon][] = [
  ['visao', 'Visão geral', Home],
  ['areas', 'Áreas de interesse (RIASEC)', Target],
  ['profissoes', 'Profissões recomendadas', BriefcaseBusiness],
  ['valores', 'Valores', Heart],
  ['preferencias', 'Preferências', SlidersHorizontal],
  ['habilidades', 'Habilidades', Star],
  ['sintese', 'Síntese do perfil', FileText],
]

export default function RelatoriosTesteVocacional({ startScreen }: PrototypeProps) {
  const ini = INICIO[startScreen ?? ''] ?? INICIO.escolas
  const [tela, setTela] = useState<Tela>(ini.tela)
  const [exportar, setExportar] = useState<null | 'escolas' | 'lista' | 'rel'>(ini.exportar ? 'rel' : null)
  const [ancora, setAncora] = useState<{ top: number; right: number } | null>(null)
  const [profissao, setProfissao] = useState<string | null>(() => {
    if (ini.profissao !== 'primeira') return null
    return estudantePorId(ANA).resultado!.recomendacoes[0].id
  })
  const [gaveta, setGaveta] = useState(false)
  const [recolhida, setRecolhida] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const celular = useMedia('(max-width: 899px)')

  useEffect(() => {
    document.title = 'Relatórios do Teste Vocacional · Educadores · Protótipo Jovens Gênios'
  }, [])
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3400)
    return () => clearTimeout(t)
  }, [toast])

  const ir = (t: Tela) => {
    setTela(t)
    setExportar(null)
    setProfissao(null)
    setGaveta(false)
    document.querySelector('.rv-rolagem')?.scrollTo({ top: 0 })
  }
  const abrirExportar = (c: 'escolas' | 'lista' | 'rel') => (ev?: MouseEvent) => {
    if (ev) {
      const r = (ev.currentTarget as HTMLElement).getBoundingClientRect()
      setAncora({ top: r.bottom + 6, right: Math.max(16, window.innerWidth - r.right) })
    } else setAncora(null)
    setExportar(c)
  }
  const fora = (n: string) => setToast(`“${n}” não faz parte deste protótipo`)
  const baixar = (f: string) => {
    setExportar(null)
    setToast(`Gerando ${f}… o download começa em instantes.`)
  }

  const aluno = tela.id === 'rel' ? estudantePorId(tela.aluno) : null
  const turmaAtual = tela.id === 'lista' ? turmaPorId(tela.turma) : aluno ? turmaPorId(aluno.turma) : null
  const escola = turmaAtual ? ESCOLAS.find((e) => e.id === turmaAtual.escola)! : null
  // caminho: Início / Relatórios / Atividades / Teste Vocacional / escola / estudante
  const migalhas: [string, (() => void) | null][] = [
    ['Início', null],
    ['Relatórios', null],
    ['Atividades', null],
    ['Teste Vocacional', tela.id === 'escolas' ? null : () => ir({ id: 'escolas' })],
    ...(escola ? [[escola.nome, aluno ? () => ir({ id: 'lista', turma: aluno.turma, filtro: 'todos' }) : null] as [string, (() => void) | null]] : []),
    ...(aluno ? [[aluno.nome, null] as [string, null]] : []),
  ]

  return (
    <div className={`rv ${recolhida ? 'is-recolhida' : ''}`}>
      <AnimatePresence>{gaveta && <motion.div className="rv-veu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setGaveta(false)} />}</AnimatePresence>
      <Sidebar aberta={gaveta} recolhida={recolhida && !celular} onTeste={() => ir({ id: 'escolas' })} onFora={fora} onRecolher={() => (celular ? setGaveta(false) : setRecolhida((r) => !r))} />
      <div className="rv-principal">
        <header className="rv-topo">
          <button className="rv-icone-btn rv-topo__menu" onClick={() => setGaveta(true)} aria-label="Abrir menu">
            <Menu size={22} />
          </button>
          <nav className="rv-migalhas" aria-label="Você está em">
            {migalhas.map(([m, acao], i) => (
              <span key={i} className={i === migalhas.length - 1 ? 'is-atual' : ''}>
                {i > 0 && <i>/</i>}
                {acao ? (
                  <button className="rv-migalhas__link" onClick={acao}>
                    {m}
                  </button>
                ) : (
                  m
                )}
              </span>
            ))}
          </nav>
        </header>
        <main className="rv-rolagem">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={tela.id === 'escolas' ? 'escolas' : tela.id === 'lista' ? `lista-${tela.turma}` : `rel-${tela.aluno}`} className="rv-conteudo" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.1 } }} transition={{ duration: 0.22 }}>
              {tela.id === 'escolas' && <Escolas celular={celular} onEscola={(id) => ir({ id: 'lista', turma: turmasDa(id)[0].id, filtro: 'todos' })} onExportar={abrirExportar('escolas')} exportando={exportar === 'escolas'} />}
              {tela.id === 'lista' && (
                <Lista
                  onEscolas={() => ir({ id: 'escolas' })}
                  turma={tela.turma}
                  filtro={tela.filtro}
                  buscaInicial={ini.busca}
                  celular={celular}
                  onFiltro={(filtro) => setTela({ ...tela, filtro })}
                  onTurma={(turma) => ir({ id: 'lista', turma, filtro: 'todos' })}
                  onAluno={(id) => ir({ id: 'rel', aluno: id, aba: 'visao' })}
                  onExportar={abrirExportar('lista')}
                  exportando={exportar === 'lista'}
                  onToast={setToast}
                />
              )}
              {tela.id === 'rel' && aluno && (
                <Relatorio
                  al={aluno}
                  aba={tela.aba}
                  celular={celular}
                  onAba={(aba) => {
                    setTela({ ...tela, aba })
                    document.querySelector('.rv-rolagem')?.scrollTo({ top: 0 })
                  }}
                  onVoltar={() => ir({ id: 'lista', turma: aluno.turma, filtro: 'todos' })}
                  onProfissao={setProfissao}
                  onExportar={abrirExportar('rel')}
                  exportando={exportar === 'rel'}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>{profissao && aluno && <PainelProfissao key={profissao} c={CARREIRA[profissao]} rec={aluno.resultado!.recomendacoes.find((r) => r.id === profissao)} nome={primeiroNome(aluno.nome)} celular={celular} onFechar={() => setProfissao(null)} />}</AnimatePresence>
      <AnimatePresence>{exportar && <MenuExportar key="exp" contexto={exportar} celular={celular} ancora={ancora} onFechar={() => setExportar(null)} onEscolher={baixar} />}</AnimatePresence>
      <AnimatePresence>
        {toast && (
          <motion.div className="rv-toast" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} role="status">
            <Info size={18} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* =====================================================================
   Casca da plataforma Educadores
   ===================================================================== */
function Sidebar({ aberta, recolhida, onTeste, onFora, onRecolher }: { aberta: boolean; recolhida: boolean; onTeste: () => void; onFora: (n: string) => void; onRecolher: () => void }) {
  return (
    <aside className={`rv-side ${aberta ? 'is-aberta' : ''}`}>
      <div className="rv-side__marca">
        <img src="./cron/logo.webp" alt="Jovens Gênios" />
        <span className="rv-side__txt">
          <b>Educadores</b>
          <small>Educadores</small>
        </span>
        <button className="rv-icone-btn rv-side__recolher" onClick={onRecolher} aria-label={recolhida ? 'Expandir menu' : 'Recolher menu'} title={recolhida ? 'Expandir menu' : 'Recolher menu'}>
          {aberta ? <X size={18} /> : recolhida ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      <nav className="rv-side__nav">
        <button className="rv-side__item" onClick={() => onFora('Início')} title="Início">
          <Home size={18} /> <span>Início</span>
        </button>
        <p className="rv-side__sec">Funcionalidades</p>
        <div className="rv-side__item is-grupo" title="Relatórios">
          <BarChart3 size={18} /> <span>Relatórios</span> <ChevronDown size={16} className="rv-side__seta" />
        </div>
        <div className="rv-side__sub">
          <button className="rv-side__subitem" onClick={() => onFora('Relatórios institucionais')}>
            Institucionais <ChevronRight size={14} />
          </button>
          <p>
            Atividades <ChevronDown size={14} />
          </p>
          <div className="rv-side__nivel">
            <button onClick={() => onFora('Relatório de Tarefas')}>Tarefas</button>
            <button onClick={() => onFora('Relatório de Simulados')}>Simulados</button>
            <button onClick={() => onFora('Relatório de Redações')}>Redações</button>
            <button className="is-on" onClick={onTeste}>
              Teste Vocacional
            </button>
          </div>
        </div>
        <button className="rv-side__item" onClick={() => onFora('Gamificação')} title="Gamificação">
          <Star size={18} /> <span>Gamificação</span> <ChevronRight size={16} className="rv-side__seta" />
        </button>
        <button className="rv-side__item" onClick={() => onFora('Central de ajuda')} title="Central de ajuda">
          <CircleHelp size={18} /> <span>Central de ajuda</span> <ChevronRight size={16} className="rv-side__seta" />
        </button>
      </nav>
      <div className="rv-side__usuario">
        <span className="rv-avatar">
          <UserRound size={18} />
        </span>
        <span className="rv-side__txt">
          <b>Professor 01 - EMMAT3A</b>
          <small>prof01.emmat3a@escolaestadual.com</small>
        </span>
      </div>
    </aside>
  )
}

const Tile = ({ icon: I, tom = 'roxo', size = 48 }: { icon: LucideIcon; tom?: string; size?: number }) => (
  <span className={`rv-tile is-${tom}`} style={{ width: size, height: size }}>
    <I size={Math.round(size * 0.46)} />
  </span>
)
const Barra = ({ pct, cor }: { pct: number; cor?: string }) => (
  <span className="rv-barra">
    <motion.i initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, ease: 'easeOut' }} style={cor ? { background: cor } : undefined} />
  </span>
)
const Letra = ({ d, g }: { d: Dim; g?: boolean }) => (
  <span className={`rv-letra ${g ? 'is-g' : ''}`} style={{ background: DIM_E[d].claro, color: DIM_E[d].cor }} title={DIM_E[d].nome}>
    {d}
  </span>
)
const Codigo = ({ ds, g }: { ds: string[]; g?: boolean }) => (
  <span className={`rv-codigo ${g ? 'is-g' : ''}`} aria-label={`Código ${ds.join('')}`}>
    {ds.map((d) => (
      <Letra key={d} d={d as Dim} g={g} />
    ))}
  </span>
)
const Avatar = ({ al, size = 36 }: { al: Estudante; size?: number }) =>
  al.foto ? (
    <img className="rv-foto" src={al.foto} alt="" style={{ width: size, height: size }} />
  ) : (
    <span className="rv-avatar is-cinza" style={{ width: size, height: size }} aria-hidden>
      <UserRound size={Math.round(size * 0.5)} />
    </span>
  )
const StatusSelo = ({ s, resp }: { s: Status; resp?: number }) => {
  const I = s === 'concluido' ? CheckCircle2 : s === 'andamento' ? RefreshCw : Hourglass
  return (
    <span className="rv-st-wrap">
      <span className={`rv-st is-${STATUS[s].tom}`}>
        <I size={15} /> {STATUS[s].nome}
      </span>
      {s === 'andamento' && resp !== undefined && <small>{resp} de {N_ITENS} respostas</small>}
    </span>
  )
}
const Alerta = () => (
  <div className="rv-alerta">
    <Info size={16} /> Os dados deste relatório podem levar até 2 horas para serem atualizados.
  </div>
)
function Abas<T extends string>({ itens, ativa, onTroca, nome }: { itens: [T, string, LucideIcon?][]; ativa: T; onTroca: (t: T) => void; nome: string }) {
  return (
    <div className="rv-abas" role="tablist" aria-label={nome}>
      {itens.map(([id, rot, I]) => (
        <button key={id} role="tab" aria-selected={ativa === id} className={ativa === id ? 'is-on' : ''} onClick={() => onTroca(id)}>
          {I && <I size={18} />} {rot}
          {ativa === id && <motion.span layoutId={'aba-' + nome} className="rv-abas__linha" />}
        </button>
      ))}
    </div>
  )
}
function Caixa({ marcada, parcial, onClick, rotulo }: { marcada: boolean; parcial?: boolean; onClick: (e: MouseEvent) => void; rotulo: string }) {
  return (
    <button className={`rv-caixa ${marcada || parcial ? 'is-on' : ''}`} role="checkbox" aria-checked={parcial ? 'mixed' : marcada} aria-label={rotulo} onClick={onClick}>
      {parcial ? <i /> : marcada ? <Check size={12} strokeWidth={3} /> : null}
    </button>
  )
}

/* =====================================================================
   Tela 0 · Escolas (entrada do relatório, como nos demais relatórios do Educadores)
   ===================================================================== */
type OrdemEsc = { campo: 'nome' | 'estudantes' | 'concluido'; dir: 1 | -1 }
function Escolas({ celular, onEscola, onExportar, exportando }: { celular: boolean; onEscola: (id: string) => void; onExportar: (ev?: MouseEvent) => void; exportando: boolean }) {
  const [q, setQ] = useState('')
  const [ordem, setOrdem] = useState<OrdemEsc>({ campo: 'nome', dir: 1 })
  const rede = totais(ESTUDANTES)
  const pct = (n: number, d: number) => (d ? Math.round((n / d) * 100) : 0)
  const linhas = useMemo(() => {
    const termo = q.trim().toLowerCase()
    return ESCOLAS.map((e) => ({ e, turmas: turmasDa(e.id).length, ...totais(daEscola(e.id)) }))
      .filter((x) => `${x.e.nome} ${x.e.municipio}`.toLowerCase().includes(termo))
      .sort((a, b) => {
        const v = ordem.campo === 'nome' ? a.e.nome.localeCompare(b.e.nome) : ordem.campo === 'estudantes' ? a.total - b.total : pct(a.concluido, a.total) - pct(b.concluido, b.total)
        return v * ordem.dir
      })
  }, [q, ordem])
  const ordenar = (campo: OrdemEsc['campo']) => setOrdem((o) => (o.campo === campo ? { campo, dir: (o.dir * -1) as 1 | -1 } : { campo, dir: campo === 'nome' ? 1 : -1 }))
  const Th = ({ campo, children }: { campo: OrdemEsc['campo']; children: ReactNode }) => (
    <button className="rv-th is-ord" onClick={() => ordenar(campo)} aria-label={`Ordenar por ${String(children)}`}>
      {children} {ordem.campo === campo ? ordem.dir === 1 ? <ChevronUp size={15} /> : <ChevronDown size={15} /> : <ChevronsUpDown size={14} />}
    </button>
  )
  return (
    <>
      <header className="rv-cab">
        <Tile icon={BriefcaseBusiness} size={64} />
        <div>
          <h1 className="rv-h1">Relatórios do Teste Vocacional</h1>
          <p>Escolha uma escola para acompanhar a realização do teste nas turmas e consultar os resultados dos estudantes.</p>
        </div>
      </header>
      <Alerta />
      <section className="rv-cartao rv-lista-cartao">
        <div className="rv-filtros">
          <h2 className="rv-h2">
            Escolas <span className="rv-mudo">({linhas.length})</span>
          </h2>
          <span className="rv-espaco" />
          <label className="rv-busca">
            <Search size={16} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pesquisar escola por nome..." aria-label="Pesquisar escola por nome" />
          </label>
          <button className={`rv-btn is-contorno-roxo ${exportando ? 'is-ativo' : ''}`} onClick={onExportar}>
            <Download size={16} /> Exportar <ChevronDown size={16} />
          </button>
        </div>
        <div className="rv-metricas">
          <Metrica icon={Users} tom="roxo" num={rede.total} rot="Estudantes do Ensino Médio" extra={`${ESCOLAS.length} escolas · ${ESCOLAS.reduce((s, e) => s + turmasDa(e.id).length, 0)} turmas`} />
          <Metrica icon={CheckCircle2} tom="verde" num={rede.concluido} rot="Testes concluídos" extra={`${pct(rede.concluido, rede.total)}% da rede`} barra={pct(rede.concluido, rede.total)} />
          <Metrica icon={RefreshCw} tom="roxo" num={rede.andamento} rot="Em andamento" extra={`${pct(rede.andamento, rede.total)}% da rede`} barra={pct(rede.andamento, rede.total)} />
          <Metrica icon={Hourglass} tom="amarelo" num={rede.naoIniciado} rot="Não iniciados" extra={`${pct(rede.naoIniciado, rede.total)}% da rede`} barra={pct(rede.naoIniciado, rede.total)} />
        </div>
        {celular ? (
          <div className="rv-cards">
            {linhas.map((x) => (
              <article key={x.e.id} className="rv-card is-clicavel" onClick={() => onEscola(x.e.id)}>
                <span className="rv-escola">
                  <span className="rv-escola__ic">
                    <School size={18} />
                  </span>
                  <span>
                    <b>{x.e.nome}</b>
                    <small>
                      {x.e.municipio} · {x.turmas} {x.turmas === 1 ? 'turma' : 'turmas'} · {x.total} estudantes
                    </small>
                  </span>
                </span>
                <span className="rv-cel-conc">
                  <b>{x.concluido} concluídos</b> <small>{pct(x.concluido, x.total)}%</small>
                  <Barra pct={pct(x.concluido, x.total)} cor="var(--rv-verde)" />
                </span>
                <small>
                  {x.andamento} em andamento · {x.naoIniciado} não iniciados · atualizado em {dataCurta(x.ultima)}
                </small>
              </article>
            ))}
          </div>
        ) : (
          <div className="rv-tabela-rola">
            <div className="rv-tabela rv-t-escolas" role="table" aria-label="Escolas">
              <div className="rv-tr is-cab" role="row">
                <Th campo="nome">Escola</Th>
                <span className="rv-th">Turmas</span>
                <Th campo="estudantes">Estudantes</Th>
                <Th campo="concluido">Testes concluídos</Th>
                <span className="rv-th">Em andamento</span>
                <span className="rv-th">Não iniciados</span>
                <span className="rv-th">Última atualização</span>
              </div>
              {linhas.map((x) => (
                <div key={x.e.id} role="row" className="rv-tr is-clicavel" onClick={() => onEscola(x.e.id)} title={`Abrir as turmas da ${x.e.nome}`}>
                  <span className="rv-escola">
                    <span className="rv-escola__ic">
                      <School size={18} />
                    </span>
                    <span>
                      <b>{x.e.nome}</b>
                      <small>{x.e.municipio}</small>
                    </span>
                  </span>
                  <span>{x.turmas}</span>
                  <span>{x.total}</span>
                  <span className="rv-cel-conc">
                    <span>
                      <b>{x.concluido}</b> <small>· {pct(x.concluido, x.total)}%</small>
                    </span>
                    <Barra pct={pct(x.concluido, x.total)} cor="var(--rv-verde)" />
                  </span>
                  <span>{x.andamento}</span>
                  <span>{x.naoIniciado}</span>
                  <span className="rv-mudo">{dataCurta(x.ultima)}</span>
                </div>
              ))}
              {!linhas.length && <p className="rv-vazio">Nenhuma escola encontrada para “{q}”.</p>}
            </div>
          </div>
        )}
        <div className="rv-paginacao">
          <small>
            Mostrando {linhas.length} de {ESCOLAS.length} escolas. Os números são de acompanhamento da atividade, não de desempenho.
          </small>
        </div>
      </section>
    </>
  )
}

/* =====================================================================
   Tela 1 · Listagem de estudantes (PRD §5)
   ===================================================================== */
type Ordem = { campo: 'nome' | 'status' | 'data'; dir: 1 | -1 }
const ORDEM_STATUS: Record<Status, number> = { concluido: 0, andamento: 1, 'nao-iniciado': 2 }
const POR_PAGINA = 10

function Lista({ onEscolas, turma, filtro, buscaInicial, celular, onFiltro, onTurma, onAluno, onExportar, exportando, onToast }: { onEscolas: () => void; turma: string; filtro: Filtro; buscaInicial?: string; celular: boolean; onFiltro: (f: Filtro) => void; onTurma: (t: string) => void; onAluno: (id: string) => void; onExportar: (ev?: MouseEvent) => void; exportando: boolean; onToast: (t: string) => void }) {
  const [q, setQ] = useState(buscaInicial ?? '')
  const [ordem, setOrdem] = useState<Ordem>({ campo: 'nome', dir: 1 })
  const [pagina, setPagina] = useState(0)
  const [abreTurma, setAbreTurma] = useState(false)
  const [marcados, setMarcados] = useState<string[]>([])
  const [menu, setMenu] = useState<{ id: string; top: number; right: number } | null>(null)
  const t = turmaPorId(turma)
  const esc = ESCOLAS.find((e) => e.id === t.escola)!
  const todos = doTurma(turma)
  const conta = (s: Status) => todos.filter((e) => e.status === s).length
  const pct = (n: number) => Math.round((n / todos.length) * 100)

  const filtrados = useMemo(() => {
    const termo = q.trim().toLowerCase()
    return todos
      .filter((e) => (filtro === 'todos' || e.status === filtro) && e.nome.toLowerCase().includes(termo))
      .sort((a, b) => {
        const v = ordem.campo === 'nome' ? a.nome.localeCompare(b.nome) : ordem.campo === 'status' ? ORDEM_STATUS[a.status] - ORDEM_STATUS[b.status] || a.nome.localeCompare(b.nome) : (b.atualizado ?? 0) - (a.atualizado ?? 0)
        return v * ordem.dir
      })
  }, [todos, filtro, q, ordem])
  useEffect(() => setPagina(0), [filtro, q, ordem, turma])
  const paginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA))
  const visiveis = filtrados.slice(pagina * POR_PAGINA, pagina * POR_PAGINA + POR_PAGINA)
  const ordenar = (campo: Ordem['campo']) => setOrdem((o) => (o.campo === campo ? { campo, dir: (o.dir * -1) as 1 | -1 } : { campo, dir: 1 }))
  const Th = ({ campo, children }: { campo?: Ordem['campo']; children: ReactNode }) =>
    campo ? (
      <button className="rv-th is-ord" onClick={() => ordenar(campo)} aria-label={`Ordenar por ${String(children)}`}>
        {children} {ordem.campo === campo ? ordem.dir === 1 ? <ChevronUp size={15} /> : <ChevronDown size={15} /> : <ChevronsUpDown size={14} />}
      </button>
    ) : (
      <span className="rv-th">{children}</span>
    )
  const todosMarcados = visiveis.length > 0 && visiveis.every((e) => marcados.includes(e.id))
  const algumMarcado = visiveis.some((e) => marcados.includes(e.id))
  const alternar = (id: string) => setMarcados((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]))

  return (
    <>
      <button className="rv-voltar" onClick={onEscolas}>
        <ArrowLeft size={16} /> Voltar para as escolas
      </button>
      <header className="rv-cab">
        <Tile icon={BriefcaseBusiness} size={64} />
        <div>
          <span className="rv-sobre">
            <School size={15} /> {esc.nome} · {esc.municipio}
          </span>
          <h1 className="rv-h1">Relatórios do Teste Vocacional</h1>
          <p>Consulte os resultados e conheça melhor os interesses profissionais dos seus estudantes.</p>
        </div>
      </header>
      <Alerta />
      <section className="rv-cartao rv-lista-cartao">
        <div className="rv-filtros">
          <label className="rv-rot">Turma</label>
          <div className="rv-select-wrap">
            <button className="rv-select" onClick={() => setAbreTurma((a) => !a)} aria-expanded={abreTurma}>
              {t.nome} – {t.ano} <ChevronDown size={16} />
            </button>
            <AnimatePresence>
              {abreTurma && (
                <motion.div className="rv-pop" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  {turmasDa(t.escola).map((x) => (
                    <button
                      key={x.id}
                      className={x.id === turma ? 'is-on' : ''}
                      onClick={() => {
                        setAbreTurma(false)
                        setMarcados([])
                        onTurma(x.id)
                      }}
                    >
                      {x.nome} – {x.ano}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <span className="rv-espaco" />
          <label className="rv-busca">
            <Search size={16} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pesquisar estudante por nome..." aria-label="Pesquisar estudante por nome" />
          </label>
          <button className={`rv-btn is-contorno-roxo ${exportando ? 'is-ativo' : ''}`} onClick={onExportar}>
            <Download size={16} /> {marcados.length ? `Exportar (${marcados.length})` : 'Exportar'} <ChevronDown size={16} />
          </button>
        </div>

        <div className="rv-metricas">
          <Metrica icon={Users} tom="roxo" num={todos.length} rot="Estudantes na turma" />
          <Metrica icon={CheckCircle2} tom="verde" num={conta('concluido')} rot="Testes concluídos" extra={`${pct(conta('concluido'))}% da turma`} barra={pct(conta('concluido'))} />
          <Metrica icon={RefreshCw} tom="roxo" num={conta('andamento')} rot="Em andamento" extra={`${pct(conta('andamento'))}% da turma`} barra={pct(conta('andamento'))} />
          <Metrica icon={Hourglass} tom="amarelo" num={conta('nao-iniciado')} rot="Não iniciados" extra={`${pct(conta('nao-iniciado'))}% da turma`} barra={pct(conta('nao-iniciado'))} />
        </div>

        <div className="rv-pilulas-filtro" role="tablist" aria-label="Filtrar por status">
          {(
            [
              ['todos', `Todos (${todos.length})`],
              ['concluido', `Concluídos (${conta('concluido')})`],
              ['andamento', `Em andamento (${conta('andamento')})`],
              ['nao-iniciado', `Não iniciados (${conta('nao-iniciado')})`],
            ] as [Filtro, string][]
          ).map(([id, rot]) => (
            <button key={id} role="tab" aria-selected={filtro === id} className={filtro === id ? 'is-on' : ''} onClick={() => onFiltro(id)}>
              {rot}
              {filtro === id && <motion.span layoutId="filtro-status" className="rv-pilulas-filtro__linha" />}
            </button>
          ))}
        </div>

        {celular ? (
          <div className="rv-cards">
            {visiveis.map((e) => (
              <article key={e.id} className={`rv-card ${e.resultado ? 'is-clicavel' : ''}`} onClick={() => e.resultado && onAluno(e.id)}>
                <span className="rv-card__linha">
                  <span className="rv-cel-aluno">
                    <Avatar al={e} />
                    <b>{e.nome}</b>
                  </span>
                  <StatusSelo s={e.status} resp={e.respondidos} />
                </span>
                {e.resultado ? (
                  <span className="rv-card__linha">
                    <Codigo ds={e.resultado.perfil.destaques} />
                    <span className="rv-area-cel">
                      <AreaIcone d={e.resultado.perfil.ordem[0]} /> {DIM_E[e.resultado.perfil.ordem[0]].nome}
                    </span>
                  </span>
                ) : null}
                <small>Última atualização: {dataCurta(e.atualizado)}</small>
                {e.resultado && (
                  <span className="rv-acao">
                    Ver relatório <ArrowRight size={16} />
                  </span>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="rv-tabela-rola">
            <div className="rv-tabela rv-t-tv" role="table" aria-label="Estudantes da turma">
              <div className="rv-tr is-cab" role="row">
                <Caixa marcada={todosMarcados} parcial={!todosMarcados && algumMarcado} rotulo="Selecionar todos desta página" onClick={() => setMarcados((m) => (todosMarcados ? m.filter((id) => !visiveis.some((e) => e.id === id)) : [...new Set([...m, ...visiveis.map((e) => e.id)])]))} />
                <Th campo="nome">Estudante</Th>
                <Th campo="status">Status</Th>
                <span className="rv-th" title="Três dimensões com maiores pontuações, exibidas depois dos 30 itens de interesse">
                  Código RIASEC <Info size={15} />
                </span>
                <span className="rv-th">Principal área de interesse</span>
                <Th campo="data">Última atualização</Th>
                <span className="rv-th is-centro">Ação</span>
                <span />
              </div>
              {visiveis.map((e) => {
                const p = e.resultado?.perfil
                return (
                  <div key={e.id} role="row" className={`rv-tr ${p ? 'is-clicavel' : ''} ${marcados.includes(e.id) ? 'is-marcada' : ''}`} onClick={() => p && onAluno(e.id)}>
                    <Caixa
                      marcada={marcados.includes(e.id)}
                      rotulo={`Selecionar ${e.nome}`}
                      onClick={(ev) => {
                        ev.stopPropagation()
                        alternar(e.id)
                      }}
                    />
                    <span className="rv-cel-aluno">
                      <Avatar al={e} />
                      <b>{e.nome}</b>
                    </span>
                    <StatusSelo s={e.status} resp={e.respondidos} />
                    <span>{p ? <Codigo ds={p.destaques} /> : <span className="rv-traco">—</span>}</span>
                    <span className="rv-area-cel">
                      {p ? (
                        <>
                          <AreaIcone d={p.ordem[0]} /> {DIM_E[p.ordem[0]].nome}
                        </>
                      ) : (
                        <span className="rv-traco">—</span>
                      )}
                    </span>
                    <span className="rv-mudo">{dataCurta(e.atualizado)}</span>
                    <span className="is-centro">
                      {p ? (
                        <button
                          className="rv-acao"
                          onClick={(ev) => {
                            ev.stopPropagation()
                            onAluno(e.id)
                          }}
                        >
                          Ver relatório <ArrowRight size={16} />
                        </button>
                      ) : (
                        <span className="rv-acao is-off" title={e.status === 'andamento' ? 'O relatório fica disponível quando o estudante concluir o teste' : 'O estudante ainda não começou o teste'}>
                          {STATUS[e.status].nome}
                        </span>
                      )}
                    </span>
                    <button
                      className="rv-icone-btn"
                      aria-label={`Mais opções para ${e.nome}`}
                      onClick={(ev) => {
                        ev.stopPropagation()
                        const r = (ev.currentTarget as HTMLElement).getBoundingClientRect()
                        setMenu(menu?.id === e.id ? null : { id: e.id, top: r.bottom + 4, right: window.innerWidth - r.right })
                      }}
                    >
                      <Ellipsis size={18} style={{ transform: 'rotate(90deg)' }} />
                    </button>
                  </div>
                )
              })}
              {!visiveis.length && <p className="rv-vazio">Nenhum estudante encontrado com esses filtros.</p>}
            </div>
          </div>
        )}
        <div className="rv-paginacao">
          <small>
            {filtrados.length ? `Mostrando ${pagina * POR_PAGINA + 1}–${Math.min(filtrados.length, (pagina + 1) * POR_PAGINA)} de ${filtrados.length} estudantes` : 'Nenhum estudante'}
            {marcados.length ? ` · ${marcados.length} selecionado${marcados.length > 1 ? 's' : ''}` : ''}
          </small>
          <span>
            <button className="rv-icone-btn" disabled={pagina === 0} onClick={() => setPagina((p) => p - 1)} aria-label="Página anterior">
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: paginas }, (_, i) => (
              <button key={i} className={`rv-pag ${i === pagina ? 'is-on' : ''}`} onClick={() => setPagina(i)} aria-label={`Página ${i + 1}`} aria-current={i === pagina ? 'page' : undefined}>
                {i + 1}
              </button>
            ))}
            <button className="rv-icone-btn" disabled={pagina >= paginas - 1} onClick={() => setPagina((p) => p + 1)} aria-label="Próxima página">
              <ChevronRight size={18} />
            </button>
          </span>
        </div>
      </section>

      <AnimatePresence>
        {menu && (
          <>
            <motion.div className="rv-veu is-exportar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenu(null)} />
            <motion.div className="rv-menu is-compacto" style={{ top: menu.top, right: menu.right }} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {(() => {
                const e = estudantePorId(menu.id)
                const ok = !!e.resultado
                return (
                  <>
                    <button disabled={!ok} onClick={() => { setMenu(null); onAluno(e.id) }}>
                      <ArrowRight size={16} /> <span><b>Ver relatório</b>{!ok && <small>Disponível depois da conclusão do teste</small>}</span>
                    </button>
                    <button disabled={!ok} onClick={() => { setMenu(null); onToast(`Gerando o relatório de ${e.nome} (.PDF)… o download começa em instantes.`) }}>
                      <Download size={16} /> <span><b>Exportar relatório (.PDF)</b></span>
                    </button>
                  </>
                )
              })()}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
function Metrica({ icon, tom, num, rot, extra, barra }: { icon: LucideIcon; tom: string; num: number; rot: string; extra?: string; barra?: number }) {
  return (
    <div className="rv-metrica">
      <Tile icon={icon} tom={tom} size={56} />
      <span>
        <strong>{num}</strong>
        <small>{rot}</small>
        {extra && <em className={`is-${tom}`}>{extra}</em>}
        {barra !== undefined && <Barra pct={barra} cor={tom === 'verde' ? 'var(--rv-verde)' : tom === 'amarelo' ? '#f5a524' : 'var(--rv-violeta)'} />}
      </span>
    </div>
  )
}
const AreaIcone = ({ d }: { d: Dim }) => {
  const I = DIM_E[d].icone
  return (
    <span className="rv-area-ic" style={{ background: DIM_E[d].claro, color: DIM_E[d].cor }}>
      <I size={16} />
    </span>
  )
}

/* =====================================================================
   Tela 2 · Relatório individual (PRD §6)
   ===================================================================== */
function Relatorio({ al, aba, celular, onAba, onVoltar, onProfissao, onExportar, exportando }: { al: Estudante; aba: Aba; celular: boolean; onAba: (a: Aba) => void; onVoltar: () => void; onProfissao: (id: string) => void; onExportar: (ev?: MouseEvent) => void; exportando: boolean }) {
  const t = turmaPorId(al.turma)
  const esc = ESCOLAS.find((e) => e.id === t.escola)!
  const res = al.resultado!
  return (
    <>
      <button className="rv-voltar" onClick={onVoltar}>
        <ArrowLeft size={16} /> Voltar para a turma
      </button>
      <header className="rv-perfil-cab">
        <Avatar al={al} size={celular ? 64 : 96} />
        <div>
          <h1 className="rv-h1">Perfil Vocacional de {al.nome}</h1>
          <p className="rv-perfil-cab__meta">
            <span>{esc.nome}</span>
            <i>•</i>
            <span>Turma: {t.nome}</span>
            <i>•</i>
            <span>{t.ano}</span>
            <i>•</i>
            <span>Teste concluído em {dataLonga(al.atualizado)}</span>
          </p>
          <p className="rv-perfil-cab__sub">
            <span className="rv-st is-verde is-p">
              <CheckCircle2 size={14} /> Relatório disponível
            </span>
            Conheça os interesses, valores, preferências e habilidades percebidas pelo estudante. Instrumento {res.versao} · regras {res.regras}.
          </p>
        </div>
        <button className={`rv-btn is-contorno-roxo is-g ${exportando ? 'is-ativo' : ''}`} onClick={onExportar}>
          <Download size={18} /> Exportar relatório
        </button>
      </header>
      <Abas nome="relatorio" itens={ABAS} ativa={aba} onTroca={onAba} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={aba} className="rv-aba" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.08 } }} transition={{ duration: 0.2 }}>
          {aba === 'visao' && <Visao al={al} onAba={onAba} onProfissao={onProfissao} />}
          {aba === 'areas' && <Areas al={al} />}
          {aba === 'profissoes' && <Profissoes al={al} onProfissao={onProfissao} />}
          {aba === 'valores' && <Valores al={al} />}
          {aba === 'preferencias' && <Preferencias al={al} />}
          {aba === 'habilidades' && <Habilidades al={al} />}
          {aba === 'sintese' && <Sintese al={al} />}
        </motion.div>
      </AnimatePresence>
      <p className="rv-nota">
        <Info size={15} /> Os resultados mostram interesses e percepções declarados pelo estudante, não aptidões. As profissões são possibilidades para explorar, não indicações definitivas. Não compare estudantes nem use este relatório para restringir caminhos.
      </p>
    </>
  )
}

/* ---------- regras de leitura compartilhadas pelas abas ---------- */
function leitura(al: Estudante) {
  const r = al.respostas
  const p = al.resultado!.perfil
  const recs = al.resultado!.recomendacoes
  const valores = itensDo('B')
    .map((i) => ({ id: i.id, nome: VAL_NOME[i.id], texto: i.texto, v: r[i.id] as number | undefined }))
    .filter((v) => typeof v.v === 'number') as { id: string; nome: string; texto: string; v: number }[]
  const valoresOrd = [...valores].sort((a, b) => b.v - a.v)
  const topValores = valoresOrd.slice(0, 3)
  const empateValor = valoresOrd.slice(3).filter((v) => v.v === topValores[2]?.v)
  const prefs = prefDe(r)
  const habs = HABILIDADES.map((h) => ({ ...h, v: r[h.id] as number | undefined }))
  const maxHab = Math.max(...habs.map((h) => h.v ?? 0))
  const fortes = habs.filter((h) => h.v !== undefined && h.v === maxHab && h.v >= 4)
  const dev = r['H-DEV'] === undefined ? null : habDe(r).desenvolver
  const explorar = recs.filter((x) => x.categoria === 'explorar')
  return { r, p, recs, valores, valoresOrd, topValores, empateValor, prefs, habs, fortes, dev, explorar }
}
const resumoPerfil = (al: Estudante) => {
  const p = al.resultado!.perfil
  if (p.inconclusivo) return 'As pontuações ficaram muito próximas entre as seis áreas: não há uma área de interesse que se destaque, e o resultado não traz recomendações.'
  const [a, ...resto] = p.destaques
  const base = `Demonstra maior interesse por atividades de ${DIM_E[a].curto}.${resto.length ? ` ${lista(resto.map((d) => DIM_E[d].nome))} também ${resto.length > 1 ? 'aparecem' : 'aparece'} entre os interesses principais.` : ''}`
  return p.distribuido ? `${base} As pontuações ficaram próximas entre si: os interesses estão distribuídos, sem uma área dominante.` : base
}

/* ---------- Visão geral ---------- */
function Visao({ al, onAba, onProfissao }: { al: Estudante; onAba: (a: Aba) => void; onProfissao: (id: string) => void }) {
  const L = leitura(al)
  const top = L.p.ordem[0]
  const I = DIM_E[top].icone
  return (
    <div className="rv-grade-visao">
      <section className="rv-bloco is-lilas rv-resumo">
        <h2 className="rv-h2">Resumo do perfil</h2>
        <div className="rv-resumo__corpo">
          <div className="rv-resumo__codigo">
            <Codigo ds={L.p.destaques} g />
            <b>Código RIASEC</b>
            {L.p.empatadas.length > 0 && <small>Empate com {lista(L.p.empatadas.map((d) => DIM_E[d].nome))} na 3ª posição</small>}
          </div>
          <div className="rv-resumo__area">
            <I size={34} strokeWidth={1.6} style={{ color: DIM_E[top].cor }} />
            <span>
              <small>Principal área de interesse</small>
              <strong>{DIM_E[top].nome}</strong>
            </span>
            <p>{resumoPerfil(al)}</p>
          </div>
        </div>
      </section>
      <section className="rv-bloco rv-pontuacao">
        <h2 className="rv-h2">Pontuação por área (RIASEC)</h2>
        <div className="rv-pontuacao__corpo">
          <Radar norm={L.p.norm} />
          <ul className="rv-barras">
            {L.p.ordem.map((d) => (
              <li key={d} className={L.p.destaques.includes(d) ? 'is-dest' : ''}>
                <Letra d={d} />
                <span>{DIM_E[d].nome}</span>
                <Barra pct={L.p.norm[d]} cor="var(--rv-violeta-2)" />
                <b>{L.p.norm[d]}</b>
              </li>
            ))}
          </ul>
        </div>
        <small className="rv-escala-nota">Escala de 0 a 100: intensidade das respostas de interesse no questionário. Não é percentual de aptidão nem de capacidade.</small>
      </section>
      <section className="rv-bloco rv-destaques">
        <div className="rv-destaques__tit">
          <Sparkles size={26} />
          <h2 className="rv-h2">Principais destaques do perfil</h2>
        </div>
        <Destaque icon={Target} titulo="Interesses" texto={`${lista(L.p.destaques.map((d) => DIM_E[d].nome))}: ${DIM_E[L.p.ordem[0]].exemplos}`} onClick={() => onAba('areas')} />
        <Destaque icon={Heart} titulo="Valores" texto={`${lista(L.topValores.map((v) => v.nome.toLowerCase()))}.`} onClick={() => onAba('valores')} />
        <Destaque icon={SlidersHorizontal} titulo="Preferências" texto={`${lista(L.prefs.filter((x) => ['P01', 'P02', 'P06'].includes(x.id)).map((x) => x.rotulo.toLowerCase()))}.`} onClick={() => onAba('preferencias')} />
        <Destaque icon={Star} titulo="Habilidades" texto={`Mais facilidade em ${lista(L.fortes.map((h) => h.nome.toLowerCase()))}${L.dev?.length ? `; quer desenvolver ${lista(L.dev.map((h) => h.toLowerCase()))}` : ''}.`} onClick={() => onAba('habilidades')} />
      </section>
      <section className="rv-bloco rv-prof-destaque">
        <div className="rv-bloco__cab">
          <BriefcaseBusiness size={22} />
          <span>
            <h2 className="rv-h2">Profissões em destaque</h2>
            <p>{CATEGORIA.explorar}: carreiras que mais se aproximam do perfil de interesses do estudante.</p>
          </span>
        </div>
        <div className="rv-prof-destaque__lista">
          {(L.explorar.length ? L.explorar : L.recs).slice(0, 3).map((x) => (
            <CartaoProfissao key={x.id} rec={x} compacto onAbrir={() => onProfissao(x.id)} />
          ))}
          <button className="rv-ver-todas" onClick={() => onAba('profissoes')}>
            <Layers size={26} />
            <span>
              Ver todas as profissões recomendadas <ArrowRight size={18} />
            </span>
          </button>
        </div>
      </section>
    </div>
  )
}
const Destaque = ({ icon: I, titulo, texto, onClick }: { icon: LucideIcon; titulo: string; texto: string; onClick: () => void }) => (
  <button className="rv-destaque" onClick={onClick}>
    <I size={24} />
    <span>
      <b>{titulo}</b>
      <small>{texto.charAt(0).toUpperCase() + texto.slice(1)}</small>
    </span>
  </button>
)

/** radar das seis dimensões, na disposição da referência: R no topo, I e A à direita, S embaixo, E e C à esquerda */
function Radar({ norm }: { norm: Record<Dim, number> }) {
  const ordem: Dim[] = ['R', 'I', 'A', 'S', 'E', 'C']
  const c = 150
  const raio = 92
  const ponto = (i: number, v: number) => {
    const ang = -Math.PI / 2 + (i * Math.PI) / 3
    return [c + Math.cos(ang) * raio * (v / 100), c + Math.sin(ang) * raio * (v / 100)]
  }
  const anel = (f: number) => ordem.map((_, i) => ponto(i, f * 100).join(',')).join(' ')
  const pts = ordem.map((d, i) => ponto(i, Math.max(4, norm[d])))
  return (
    <svg className="rv-radar" viewBox="0 0 300 300" role="img" aria-label={`Radar: ${ordem.map((d) => `${DIM_E[d].nome} ${norm[d]}`).join(', ')}`}>
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon key={f} points={anel(f)} fill="none" stroke="#e7e2f3" strokeWidth={1} />
      ))}
      {ordem.map((_, i) => {
        const [x, y] = ponto(i, 100)
        return <line key={i} x1={c} y1={c} x2={x} y2={y} stroke="#e7e2f3" />
      })}
      <motion.polygon points={pts.map((p) => p.join(',')).join(' ')} fill="rgba(124, 77, 255, 0.22)" stroke="#7c4dff" strokeWidth={2.5} strokeLinejoin="round" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} style={{ transformOrigin: '150px 150px' }} />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={4.5} fill="#7c4dff" stroke="#fff" strokeWidth={1.5} />
      ))}
      {ordem.map((d, i) => {
        const ang = -Math.PI / 2 + (i * Math.PI) / 3
        const x = c + Math.cos(ang) * 128
        const y = c + Math.sin(ang) * 122
        const anchor = Math.abs(Math.cos(ang)) < 0.2 ? 'middle' : Math.cos(ang) > 0 ? 'start' : 'end'
        const dx = anchor === 'start' ? -14 : anchor === 'end' ? 14 : 0
        return (
          <g key={d} transform={`translate(${x + dx}, ${y - 12})`}>
            <rect x={anchor === 'end' ? -18 : anchor === 'start' ? 0 : -9} y={-14} width={18} height={18} rx={5} fill={DIM_E[d].claro} />
            <text x={anchor === 'end' ? -9 : anchor === 'start' ? 9 : 0} y={0} textAnchor="middle" fontSize={11} fontWeight={700} fill={DIM_E[d].cor}>
              {d}
            </text>
            <text y={18} textAnchor={anchor} fontSize={11} fontWeight={600} fill="#262626">
              {DIM_E[d].nome}
            </text>
            <text y={33} textAnchor={anchor} fontSize={12} fontWeight={700} fill="#0a0a0a">
              {norm[d]}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/* ---------- Áreas de interesse ---------- */
function Areas({ al }: { al: Estudante }) {
  const L = leitura(al)
  return (
    <div className="rv-grade-areas">
      <div className="rv-coluna">
        <section className="rv-bloco is-lilas">
          <h2 className="rv-h2">Código RIASEC</h2>
          <Codigo ds={L.p.destaques} g />
          <p className="rv-texto">{resumoPerfil(al)}</p>
          {L.p.empatadas.length > 0 && <p className="rv-texto is-suave">Empate na 3ª posição com {lista(L.p.empatadas.map((d) => DIM_E[d].nome))}: as duas áreas aparecem entre os interesses principais.</p>}
        </section>
        <section className="rv-bloco is-lilas-2">
          <h3 className="rv-h3 is-roxo">
            <Info size={20} /> Sobre as áreas de interesse
          </h3>
          <p className="rv-texto">O modelo RIASEC organiza os interesses profissionais em seis grandes áreas. Ele ajuda a entender que tipos de atividades mais despertam o interesse do estudante. Cada área soma 5 respostas de 1 a 5 e é convertida para 0 a 100.</p>
        </section>
      </div>
      <section className="rv-bloco">
        <h2 className="rv-h2">Áreas de interesse (RIASEC)</h2>
        <p className="rv-sub">Resultado em cada uma das seis áreas, com a pontuação, a descrição e exemplos de atividades.</p>
        <ul className="rv-areas">
          {L.p.ordem.map((d, i) => {
            const I = DIM_E[d].icone
            const dest = L.p.destaques.includes(d) || L.p.empatadas.includes(d)
            return (
              <li key={d} className={dest ? 'is-dest' : ''}>
                <Letra d={d} g />
                <span className="rv-areas__nome">
                  <b>{DIM_E[d].nome}</b>
                  {i === 0 ? (
                    <em className="rv-chip">
                      <Trophy size={13} /> Maior interesse
                    </em>
                  ) : dest ? (
                    <em className="rv-chip">
                      <Star size={13} /> Entre os 3 maiores
                    </em>
                  ) : (
                    <small>{nivel(L.p.norm[d])}</small>
                  )}
                </span>
                <span className="rv-areas__nota">
                  <b>{L.p.norm[d]}</b>
                  <Barra pct={L.p.norm[d]} cor={dest ? 'var(--rv-violeta-2)' : '#b9a6f2'} />
                </span>
                <p>{DIM_E[d].desc}</p>
                <span className="rv-areas__ex">
                  <I size={22} />
                  <span>
                    <b>Exemplos:</b> {DIM_E[d].exemplos}
                  </span>
                </span>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}

/* ---------- Profissões recomendadas ---------- */
function CartaoProfissao({ rec, compacto, onAbrir }: { rec: Recomendacao; compacto?: boolean; onAbrir: () => void }) {
  const c = CARREIRA[rec.id]
  return (
    <button className={`rv-prof-card ${c.foto ? 'is-foto' : ''} ${compacto ? 'is-compacto' : ''}`} onClick={onAbrir}>
      {c.foto ? (
        <img className="rv-prof-card__foto" src={c.foto} alt="" />
      ) : (
        <span className="rv-prof-card__ic">
          <img src={c.icone} alt="" />
        </span>
      )}
      <span className="rv-prof-card__txt">
        <b>{c.nome}</b>
        <Codigo ds={[...c.codigo]} />
        {!compacto && <small className="rv-prof-card__desc">{c.descricao}</small>}
        {!compacto && rec.combina.length > 0 && (
          <small className="rv-prof-card__por">
            Por que aparece: interesse nas áreas {lista(rec.combina.map((d) => DIM_E[d].nome))}.
          </small>
        )}
      </span>
      <span className="rv-seta">
        <ArrowRight size={18} />
      </span>
    </button>
  )
}
function Profissoes({ al, onProfissao }: { al: Estudante; onProfissao: (id: string) => void }) {
  const L = leitura(al)
  const grupos = (['explorar', 'complementar'] as const).map((cat) => [cat, L.recs.filter((x) => x.categoria === cat)] as const).filter(([, xs]) => xs.length)
  return (
    <div className="rv-pilha">
      <Faixa icon={BriefcaseBusiness} titulo="Profissões recomendadas" texto="Carreiras que se conectam com o perfil de interesses do estudante, com base no resultado do teste e no catálogo de ocupações." notaTit="Importante" nota="São sugestões de exploração, e não uma indicação definitiva de escolha profissional. Não há percentual de compatibilidade." />
      {!L.recs.length && <p className="rv-vazio is-bloco">As pontuações ficaram muito próximas entre as áreas, e o instrumento não gera recomendações nesse caso.</p>}
      {grupos.map(([cat, xs]) => (
        <section key={cat} className="rv-bloco">
          <h2 className="rv-h2">{CATEGORIA[cat]}</h2>
          <p className="rv-sub">
            {cat === 'explorar'
              ? `Carreiras em que as áreas de maior interesse (${L.p.destaques.join('')}) são centrais.`
              : 'Carreiras que também se relacionam com os interesses e ampliam o repertório.'}
          </p>
          <div className={`rv-prof-grade ${cat === 'complementar' ? 'is-comp' : ''}`}>
            {xs.map((x) => (
              <CartaoProfissao key={x.id} rec={x} onAbrir={() => onProfissao(x.id)} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
const Faixa = ({ icon: I, titulo, texto, notaTit, nota, arte }: { icon: LucideIcon; titulo: string; texto: string; notaTit: string; nota: string; arte?: string }) => (
  <section className="rv-faixa">
    <span className="rv-faixa__a">
      <I size={34} strokeWidth={1.6} />
      <span>
        <h2>{titulo}</h2>
        <p>{texto}</p>
      </span>
      {arte && <img src={arte} alt="" className="rv-faixa__arte" />}
    </span>
    <span className="rv-faixa__b">
      <Info size={22} />
      <span>
        <b>{notaTit}</b>
        <p>{nota}</p>
      </span>
    </span>
  </section>
)

/* ---------- Valores ---------- */
const VAL_DESC: Record<string, string> = {
  V01: 'Dá importância à segurança e à previsibilidade no trabalho.',
  V02: 'Considera a remuneração compatível com seus objetivos.',
  V03: 'Prefere ter liberdade para tomar decisões e organizar suas atividades.',
  V04: 'Dá importância a trabalhos que gerem benefícios para outras pessoas e para a sociedade.',
  V05: 'Valoriza espaço para criatividade e novas ideias.',
  V06: 'Valoriza oportunidades de se desenvolver e adquirir novos conhecimentos.',
  V07: 'Dá importância ao reconhecimento pelas suas contribuições.',
  V08: 'Valoriza flexibilidade de horários ou de local de trabalho.',
}
function Valores({ al }: { al: Estudante }) {
  const L = leitura(al)
  if (L.valores.length < 8) return <Indisponivel bloco="Valores profissionais" />
  return (
    <div className="rv-pilha">
      <div className="rv-faixa-dupla">
        <section className="rv-faixa__a is-solo">
          <Heart size={34} strokeWidth={1.6} />
          <span>
            <h2>Valores profissionais</h2>
            <p>O que o estudante considera mais importante em sua futura carreira.</p>
          </span>
          <img src="./3d/bullseye.png" alt="" className="rv-faixa__arte" />
        </section>
        <section className="rv-faixa__b is-solo">
          <Info size={22} />
          <span>
            <b>Como interpretar</b>
            <p>Os valores mostram o que o estudante mais valoriza em um ambiente de trabalho. Não existe combinação certa: cada valor é apresentado individualmente, sem nota única.</p>
          </span>
        </section>
      </div>
      <div className="rv-grade-2">
        <section className="rv-bloco">
          <h2 className="rv-h2">Importância de cada valor</h2>
          <p className="rv-sub">Nota de 1 (nada importante) a 5 (extremamente importante).</p>
          <ul className="rv-notas">
            {L.valoresOrd.map((v) => {
              const I = VAL_ICONE[v.id]
              return (
                <li key={v.id} title={ESCALA.importancia[v.v - 1]}>
                  <span className="rv-notas__ic">
                    <I size={20} />
                  </span>
                  <b>{v.nome}</b>
                  <Barra pct={v.v * 20} cor={v.v >= 4 ? 'var(--rv-violeta-2)' : '#a98bf5'} />
                  <strong>{v.v} / 5</strong>
                </li>
              )
            })}
          </ul>
        </section>
        <section className="rv-bloco">
          <h2 className="rv-h2">Principais valores</h2>
          <p className="rv-sub">Os 3 valores com as maiores notas.{L.empateValor.length ? ` ${lista(L.empateValor.map((v) => v.nome))} ${L.empateValor.length > 1 ? 'tiveram' : 'teve'} a mesma nota do 3º.` : ''}</p>
          <ul className="rv-top">
            {L.topValores.map((v) => {
              const I = VAL_ICONE[v.id]
              return (
                <li key={v.id}>
                  <I size={30} strokeWidth={1.6} />
                  <span>
                    <b>{v.nome}</b>
                    <small>{VAL_DESC[v.id]}</small>
                  </span>
                  <em>{v.v} / 5</em>
                </li>
              )
            })}
          </ul>
        </section>
      </div>
    </div>
  )
}

/* ---------- Preferências ---------- */
function Preferencias({ al }: { al: Estudante }) {
  const L = leitura(al)
  if (L.prefs.length < 6) return <Indisponivel bloco="Preferências de trabalho" />
  const por = Object.fromEntries(L.prefs.map((x) => [x.id, x]))
  const pares: [string, string, LucideIcon][] = [
    ['P01', 'P04', Users],
    ['P02', 'P03', Zap],
    ['P05', 'P06', Target],
  ]
  return (
    <div className="rv-pilha">
      <Faixa icon={SlidersHorizontal} titulo="Preferências de trabalho" texto="Como o estudante prefere atuar, se organizar e se relacionar no ambiente profissional." notaTit="Como interpretar" nota="As preferências indicam contextos e estilos de trabalho que tendem a ser mais confortáveis. Elas não eliminam profissões: a mesma carreira pode existir em contextos bem diferentes." />
      <div className="rv-grade-2 is-pref">
        <section className="rv-bloco">
          <h2 className="rv-h2">Respostas do estudante</h2>
          <p className="rv-sub">Em cada par, a opção escolhida (e a que ficou de fora).</p>
          <ul className="rv-prefs">
            {itensDo('C').map((i) => {
              const m = PREF[i.id]
              const x = por[i.id]
              return (
                <li key={i.id}>
                  <span className="rv-notas__ic">
                    <m.icone size={20} />
                  </span>
                  <span className="rv-prefs__tema">
                    <b>{m.tema}</b>
                    <small>{m.pergunta}</small>
                  </span>
                  <span className="rv-prefs__esc">
                    <img src={m.arte[x.lado === 'a' ? 0 : 1]} alt="" />
                    <span>
                      <b>{x.texto}</b>
                      <small>em vez de: {x.outro.charAt(0).toLowerCase() + x.outro.slice(1)}</small>
                    </span>
                    <CheckCircle2 size={22} />
                  </span>
                </li>
              )
            })}
          </ul>
        </section>
        <section className="rv-bloco">
          <h2 className="rv-h2">O que as escolhas indicam</h2>
          <p className="rv-sub">Leitura das respostas, par a par. Não descreve personalidade.</p>
          <ul className="rv-top is-pref">
            {pares.map(([a, b, I]) => (
              <li key={a}>
                <I size={30} strokeWidth={1.6} />
                <span>
                  <b>
                    {por[a].rotulo} · {por[b].rotulo}
                  </b>
                  <small>
                    Escolheu {por[a].texto.charAt(0).toLowerCase() + por[a].texto.slice(1)} e {por[b].texto.charAt(0).toLowerCase() + por[b].texto.slice(1)}.
                  </small>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

/* ---------- Habilidades ---------- */
function Habilidades({ al }: { al: Estudante }) {
  const L = leitura(al)
  if (L.habs.some((h) => h.v === undefined)) return <Indisponivel bloco="Habilidades percebidas" />
  const quatro = L.habs.filter((h) => h.v === 4)
  return (
    <div className="rv-pilha">
      <Faixa icon={Star} titulo="Habilidades percebidas" texto="Como o estudante avalia suas habilidades atualmente e quais deseja desenvolver." notaTit="Importante" nota="São autopercepções, com base nas experiências e interesses do estudante. Não são uma avaliação objetiva de competência." />
      <div className="rv-grade-2">
        <section className="rv-bloco">
          <h2 className="rv-h2">Autoavaliação das habilidades</h2>
          <p className="rv-sub">Nota de 1 (ainda tenho muita dificuldade) a 5 (tenho muita facilidade).</p>
          <ul className="rv-notas">
            {L.habs.map((h) => {
              const I = HAB_ICONE[h.id]
              return (
                <li key={h.id} title={ESCALA.habilidade[(h.v as number) - 1]}>
                  <span className="rv-notas__ic">
                    <I size={20} />
                  </span>
                  <b>{h.nome}</b>
                  <Barra pct={(h.v as number) * 20} cor={(h.v as number) >= 4 ? 'var(--rv-violeta-2)' : '#a98bf5'} />
                  <strong>{h.v} / 5</strong>
                </li>
              )
            })}
          </ul>
        </section>
        <div className="rv-coluna">
          <section className="rv-bloco">
            <h2 className="rv-h2">Habilidades que deseja desenvolver</h2>
            {L.dev === null ? (
              <p className="rv-indisp">
                <Info size={18} /> Pergunta opcional não respondida: o estudante não escolheu habilidades para desenvolver. Nada foi preenchido no lugar.
              </p>
            ) : L.dev.length ? (
              <>
                <p className="rv-sub">Até 3 habilidades escolhidas pelo próprio estudante.</p>
                <div className="rv-dev">
                  {HABILIDADES.filter((h) => L.dev!.includes(h.nome)).map((h) => {
                    const I = HAB_ICONE[h.id]
                    return (
                      <span key={h.id}>
                        <I size={22} /> {h.nome}
                      </span>
                    )
                  })}
                </div>
              </>
            ) : (
              <p className="rv-indisp">
                <Info size={18} /> O estudante respondeu à pergunta, mas não selecionou nenhuma habilidade.
              </p>
            )}
          </section>
          <section className="rv-bloco">
            <h2 className="rv-h2">Principais destaques</h2>
            <p className="rv-sub">Habilidades com maior percepção e as que o estudante quer fortalecer.</p>
            <dl className="rv-dl">
              <div>
                <dt>
                  <Trophy size={24} /> Pontos fortes percebidos
                </dt>
                <dd>
                  {L.fortes.length
                    ? `Avalia com mais facilidade ${lista(L.fortes.map((h) => `${h.nome.toLowerCase()} (${h.v}/5)`))}${quatro.length && L.fortes[0]?.v === 5 ? `, além de boa avaliação em ${lista(quatro.map((h) => h.nome.toLowerCase()))} (4/5)` : ''}.`
                    : 'Nenhuma habilidade foi avaliada com 4 ou 5.'}
                </dd>
              </div>
              <div>
                <dt>
                  <Target size={24} /> Em desenvolvimento
                </dt>
                <dd>{L.dev === null ? 'Sem resposta na pergunta opcional.' : L.dev.length ? `Quer fortalecer ${lista(L.dev.map((h) => h.toLowerCase()))}.` : 'Nenhuma habilidade selecionada.'}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  )
}

/* ---------- Síntese do perfil ---------- */
function Sintese({ al }: { al: Estudante }) {
  const L = leitura(al)
  const nome = primeiroNome(al.nome)
  const profs = L.explorar.length ? L.explorar : L.recs
  const texto = [
    `${nome} demonstra maior interesse por atividades de ${DIM_E[L.p.destaques[0]].curto}${L.p.destaques.length > 1 ? `, com ${lista(L.p.destaques.slice(1).map((d) => DIM_E[d].nome))} também entre os interesses principais` : ''}.`,
    L.topValores.length ? `Entre os valores profissionais, deu mais importância a ${lista(L.topValores.map((v) => v.nome.toLowerCase()))}.` : '',
    L.prefs.length ? `Nas preferências de trabalho, indicou ${L.prefs.map((x) => PREF_FRASE[x.id][x.lado === 'a' ? 0 : 1]).join('; ')}.` : '',
    L.fortes.length ? `Avalia ter mais facilidade em ${lista(L.fortes.map((h) => h.nome.toLowerCase()))}${L.dev?.length ? ` e quer desenvolver ${lista(L.dev.map((h) => h.toLowerCase()))}` : ''}.` : '',
    profs.length ? `Entre as possibilidades para explorar estão ${lista(profs.slice(0, 3).map((x) => CARREIRA[x.id].nome))}.` : '',
  ].filter(Boolean)
  return (
    <div className="rv-pilha">
      <Faixa icon={FileText} titulo="Síntese do perfil vocacional" texto="Um resumo integrado dos principais resultados do teste, para apoiar conversas e orientações sobre o futuro profissional." notaTit="Importante" nota="O resultado apresenta interesses, preferências e percepções do estudante. Não é um diagnóstico nem uma indicação definitiva de carreira." />
      <div className="rv-grade-sintese">
        <section className="rv-bloco is-lilas">
          <h2 className="rv-h2 is-ic">
            <Target size={26} /> Perfil em destaque
          </h2>
          <Codigo ds={L.p.destaques} g />
          <b className="rv-centro">Código RIASEC: {L.p.destaques.join('')}</b>
          <p className="rv-texto">{resumoPerfil(al)}</p>
        </section>
        <section className="rv-bloco">
          <h2 className="rv-h2 is-ic">
            <BarChart3 size={24} /> Principais resultados
          </h2>
          <div className="rv-resultados">
            <Res icon={Target} t="Áreas de interesse" v={lista(L.p.destaques.map((d) => `${DIM_E[d].nome} (${L.p.norm[d]})`))} />
            <Res icon={BriefcaseBusiness} t="Profissões sugeridas" v={lista(profs.slice(0, 3).map((x) => CARREIRA[x.id].nome))} />
            <Res icon={Heart} t="Valores principais" v={lista(L.topValores.map((v) => v.nome))} />
            <Res icon={SlidersHorizontal} t="Preferências de trabalho" v={L.prefs.map((x) => PREF_FRASE[x.id][x.lado === 'a' ? 0 : 1]).join('; ').replace(/^./, (c) => c.toUpperCase()) + '.'} />
            <Res icon={Star} t="Habilidades em destaque" v={lista(L.fortes.map((h) => `${h.nome} (${h.v}/5)`))} />
            <Res icon={Zap} t="Habilidades a desenvolver" v={L.dev === null ? 'Pergunta opcional sem resposta.' : L.dev.length ? lista(L.dev) : 'Nenhuma selecionada.'} />
          </div>
        </section>
      </div>
      <section className="rv-bloco rv-sintese">
        <div>
          <h2 className="rv-h2 is-ic">
            <Sparkles size={24} /> Síntese interpretativa
          </h2>
          <p className="rv-texto is-g">{texto.join(' ')}</p>
          <small className="rv-mudo">
            Texto gerado só a partir das respostas registradas e das regras do instrumento ({al.resultado!.versao} · {al.resultado!.regras}). Não atribui características que o questionário não avalia.
          </small>
        </div>
        <div className="rv-apoio">
          <h3 className="rv-h3">
            <GraduationCap size={24} /> Como o professor pode apoiar
          </h3>
          <ul>
            <li>
              <Check size={18} /> Conversar sobre as áreas de {lista(L.p.destaques.slice(0, 2).map((d) => DIM_E[d].curto))} e as profissões em destaque.
            </li>
            <li>
              <Check size={18} /> Sugerir atividades, projetos e conteúdos relacionados a {DIM_E[L.p.ordem[0]].exemplos.replace(/\.$/, '')}.
            </li>
            {L.dev && L.dev.length > 0 && (
              <li>
                <Check size={18} /> Estimular o desenvolvimento das habilidades escolhidas: {lista(L.dev.map((h) => h.toLowerCase()))}.
              </li>
            )}
            <li>
              <Check size={18} /> Lembrar que interesses mudam: o estudante pode refazer o teste e explorar outras áreas.
            </li>
          </ul>
        </div>
      </section>
    </div>
  )
}
const Res = ({ icon: I, t, v }: { icon: LucideIcon; t: string; v: string }) => (
  <div className="rv-res">
    <I size={28} strokeWidth={1.6} />
    <span>
      <b>{t}</b>
      <small>{v}</small>
    </span>
  </div>
)
const Indisponivel = ({ bloco }: { bloco: string }) => (
  <p className="rv-vazio is-bloco">
    <Info size={18} /> {bloco}: bloco não concluído pelo estudante. O relatório não completa respostas ausentes (RN02).
  </p>
)

/* ---------- Detalhe da profissão (painel lateral) ---------- */
function PainelProfissao({ c, rec, nome, celular, onFechar }: { c: Carreira; rec?: Recomendacao; nome: string; celular: boolean; onFechar: () => void }) {
  useEffect(() => {
    const on = (e: KeyboardEvent) => e.key === 'Escape' && onFechar()
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [onFechar])
  return (
    <>
      <motion.div className="rv-veu is-painel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onFechar} />
      <motion.aside className="rv-painel" role="dialog" aria-label={c.nome} initial={celular ? { y: '100%' } : { x: '100%' }} animate={celular ? { y: 0 } : { x: 0 }} exit={celular ? { y: '100%' } : { x: '100%' }} transition={{ type: 'spring', stiffness: 380, damping: 38 }}>
        <header className="rv-painel__cab">
          <button className="rv-icone-btn" onClick={onFechar} aria-label="Fechar">
            <X size={20} />
          </button>
        </header>
        <div className="rv-painel__corpo">
          {c.foto ? <img className="rv-painel__foto" src={c.foto} alt="" /> : <img className="rv-painel__ic" src={c.icone} alt="" />}
          {rec && <em className={`rv-cat is-${rec.categoria}`}>{CATEGORIA[rec.categoria]}</em>}
          <h2>{c.nome}</h2>
          <Codigo ds={[...c.codigo]} />
          <p className="rv-texto">{c.descricao}</p>
          {rec && (
            <section>
              <h3>Por que aparece para {nome}</h3>
              <ul className="rv-motivos">
                {rec.motivos.map((m) => (
                  <li key={m}>
                    <Rico t={paraProfessor(m)} />
                  </li>
                ))}
              </ul>
              {rec.atencao && <p className="rv-atencao">{paraProfessor(rec.atencao)}</p>}
            </section>
          )}
          <section>
            <h3>O que faz no dia a dia</h3>
            <ul className="rv-pontos">
              {c.atividades.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </section>
          <section>
            <h3>Competências frequentes</h3>
            <div className="rv-chips">
              {c.competencias.map((a) => (
                <span key={a}>{a}</span>
              ))}
            </div>
          </section>
          <section>
            <h3>Formações</h3>
            <ul className="rv-pontos">
              {c.formacoes.map((f) => (
                <li key={f.nome}>
                  <b>{f.tipo}</b> {f.nome} <small>· {f.duracao}</small>
                </li>
              ))}
            </ul>
          </section>
          <small className="rv-mudo">
            Fontes: {FONTES.map((f) => f.split(' · ')[0]).join(', ')} · revisão {REVISAO}. Conteúdo ilustrativo do catálogo do protótipo.
          </small>
        </div>
      </motion.aside>
    </>
  )
}

/* ---------- Exportar ---------- */
function MenuExportar({ contexto, celular, ancora, onFechar, onEscolher }: { contexto: 'escolas' | 'lista' | 'rel'; celular: boolean; ancora: { top: number; right: number } | null; onFechar: () => void; onEscolher: (f: string) => void }) {
  useEffect(() => {
    const on = (e: KeyboardEvent) => e.key === 'Escape' && onFechar()
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [onFechar])
  const itens: [LucideIcon, string, string, string][] =
    contexto === 'escolas'
      ? [
          [FileText, 'Planilha das escolas (.CSV)', 'Uma linha por escola: turmas, estudantes do EM, testes concluídos, em andamento e não iniciados.', 'a planilha CSV das escolas'],
          [FileText, 'Planilha das turmas (.CSV)', 'Uma linha por turma de cada escola, com os mesmos indicadores.', 'a planilha CSV das turmas'],
        ]
      : contexto === 'rel'
      ? [
          [Download, 'Relatório completo (.PDF)', 'Resumo, áreas de interesse, profissões, valores, preferências, habilidades e síntese.', 'o relatório completo em PDF'],
          [FileText, 'Síntese para conversa (.PDF)', 'Uma página com o perfil em destaque e as sugestões de apoio.', 'a síntese em PDF'],
        ]
      : [
          [FileText, 'Planilha (.CSV)', 'Uma linha por estudante: status, código RIASEC, principal área e última atualização.', 'a planilha CSV da turma'],
          [Download, 'Relatórios individuais (.PDF)', 'Um PDF por estudante com resultado concluído (ou só os selecionados).', 'os relatórios em PDF'],
        ]
  return (
    <>
      <motion.div className="rv-veu is-exportar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onFechar} />
      <motion.div
        className={celular ? 'rv-folha' : 'rv-menu'}
        style={!celular && ancora ? { top: ancora.top, right: ancora.right } : !celular ? { top: 190, right: 40 } : undefined}
        role="dialog"
        aria-label="Exportar como"
        initial={celular ? { y: '100%' } : { opacity: 0, y: -6, scale: 0.98 }}
        animate={celular ? { y: 0 } : { opacity: 1, y: 0, scale: 1 }}
        exit={celular ? { y: '100%' } : { opacity: 0, y: -6 }}
        transition={{ type: 'spring', stiffness: 420, damping: 36 }}
      >
        {celular && <i className="rv-folha__alca" />}
        <p className="rv-menu__rot">Exportar como</p>
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
          <button className="rv-btn is-contorno is-cheio" onClick={onFechar}>
            Cancelar
          </button>
        )}
      </motion.div>
    </>
  )
}

