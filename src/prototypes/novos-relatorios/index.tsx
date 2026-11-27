// Novos Relatórios · Plataforma Educadores.
// Navegável do Desktop do Figma (A5hHDrpWbICZ1JfKpUiS2k, página 05): casca Educadores (rgx) + peças dos relatórios (nrl.css).
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleHelp,
  Copy,
  Download,
  Eye,
  GripVertical,
  Home,
  Info,
  LayoutGrid,
  Library,
  Lock,
  Maximize2,
  Menu,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Users,
  WandSparkles,
  X,
  GraduationCap,
  FileSpreadsheet,
  type LucideIcon,
} from 'lucide-react'
import { Children, createContext, isValidElement, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { PrototypeProps } from '../../platform/journeys'
import '../gamificacao-geniex-educadores/rgx.css'
import {
  ATIVOS_5ANO,
  ATIVOS_PROF,
  CATALOGO,
  DICA_KPI,
  E701,
  ESCOLAS_TODAS,
  GLOSSARIO,
  HIST_A,
  LIB_I,
  MESES,
  MIGRACAO,
  MODELOS,
  N_A,
  ATIVIDADES_DO_TIPO,
  OLI_VISOES,
  PAINEIS,
  PERFIS,
  PERIODO,
  PRIORIDADES,
  PRIORIDADES_PROF,
  PROFESSORES,
  PTS_501,
  RECENTES_I,
  RELS,
  TIPOS_A,
  TIPOS_I,
  TURMAS_ESCOLA,
  TURMA_501,
  type Bloco,
  type Item,
  type Perfil,
  type Rel,
  type Tabela,
} from './data'
import { Badge, Bloco_, Cartao, Celula, Ic, Kpis, Linha, Segmento, Seletor, TabelaCard } from './pecas'
import './nrl.css'

/* ------------------------------------------------------------------ navegação */
type Tela =
  | { id: 'escolhaI' }
  | { id: 'escolhaA' }
  | { id: 'rel'; rel: string; aba: string; seg?: string }
  | { id: 'paineis' }
  | { id: 'painel' }
  | { id: 'edicao' }
  | { id: 'novo' }
  | { id: 'compartilhado' }
  | { id: 'migracao' }
  | { id: 'estrutura' }
type Modal =
  | null
  | { id: 'onde' | 'tipoAtiv' | 'periodo' | 'tipo' | 'glossario' | 'filtros' | 'compartilhar' | 'exportar' | 'salvar' | 'excluir' | 'perfil' }
  | { id: 'atividade'; tipo: string }
  | { id: 'menuBloco'; bloco: string }
  | { id: 'lista'; titulo: string; opcoes: [string, string?, string?][] }
type Toast = { tipo: 'ok' | 'info'; titulo: string; texto?: string }
type Inicial = { tela: Tela; perfil: Perfil; modal?: Modal; toast?: Toast }

const ABA_SLUG: Record<string, string> = { 'Visão geral': '', Engajamento: 'eng', Aprendizagem: 'apr', 'Projetos enviados': 'enviados' }
const abasDe = (r: Rel) => r.abas ?? ['Visão geral', 'Engajamento', 'Aprendizagem']
const ATALHOS: Record<string, Inicial> = {
  estrutura: { tela: { id: 'estrutura' }, perfil: 'gestora' },
  'inst-gestora': { tela: { id: 'escolhaI' }, perfil: 'gestora' },
  'inst-coord': { tela: { id: 'escolhaI' }, perfil: 'coord' },
  'inst-prof': { tela: { id: 'escolhaI' }, perfil: 'prof' },
  'ativ-gestora': { tela: { id: 'escolhaA' }, perfil: 'gestora' },
  'ativ-coord': { tela: { id: 'escolhaA' }, perfil: 'coord' },
  'ativ-prof': { tela: { id: 'escolhaA' }, perfil: 'prof' },
  'oli-escolas': { tela: { id: 'rel', rel: 'oli', aba: 'Visão geral', seg: 'Escolas' }, perfil: 'gestora' },
  paineis: { tela: { id: 'paineis' }, perfil: 'gestora' },
  painel: { tela: { id: 'painel' }, perfil: 'gestora' },
  'painel-edicao': { tela: { id: 'edicao' }, perfil: 'gestora' },
  'painel-novo': { tela: { id: 'novo' }, perfil: 'gestora' },
  'painel-compartilhado': { tela: { id: 'compartilhado' }, perfil: 'prof' },
  migracao: { tela: { id: 'migracao' }, perfil: 'gestora' },
}
for (const r of Object.values(RELS))
  for (const a of abasDe(r)) ATALHOS[r.id + (ABA_SLUG[a] ? '-' + ABA_SLUG[a] : '')] = { tela: { id: 'rel', rel: r.id, aba: a }, perfil: r.perfil }
const relRede = { tela: { id: 'rel', rel: 'rede', aba: 'Visão geral' } as Tela, perfil: 'gestora' as Perfil }
const SOBRE: Record<string, Modal> = {
  'o-onde': { id: 'onde' },
  'o-periodo': { id: 'periodo' },
  'o-glossario': { id: 'glossario' },
  'o-filtros': { id: 'filtros' },
  'o-compartilhar': { id: 'compartilhar' },
  'o-exportar': { id: 'exportar' },
  'o-salvar': { id: 'salvar' },
  'o-menu-bloco': { id: 'menuBloco', bloco: 'Distribuição de proficiência' },
  'o-perfil': { id: 'perfil' },
  'o-tipo': { id: 'tipo' },
}
for (const [k, m] of Object.entries(SOBRE)) ATALHOS[k] = { ...relRede, modal: m }
ATALHOS['o-excluir'] = { tela: { id: 'paineis' }, perfil: 'gestora', modal: { id: 'excluir' } }
ATALHOS['o-aviso'] = { tela: { id: 'painel' }, perfil: 'gestora', toast: { tipo: 'ok', titulo: 'Painel salvo em Meus painéis' } }
ATALHOS['o-atividade'] = { tela: { id: 'rel', rel: 'tarefa', aba: 'Visão geral' }, perfil: 'gestora', modal: { id: 'atividade', tipo: 'Tarefa' } }
ATALHOS['o-tipo-atividade'] = { tela: { id: 'escolhaA' }, perfil: 'gestora', modal: { id: 'tipoAtiv' } }

/** O que cada perfil pode abrir (institucionais por perfil; atividades para todos). */
const podeAbrir = (pf: Perfil, rel: string) => {
  const r = RELS[rel]
  if (!r) return false
  if (r.grupo === 'ativ') return true
  if (pf === 'gestora') return true
  if (pf === 'coord') return rel !== 'rede' && rel !== 'alf'
  return rel === 'turma' || rel === 'est'
}
/** Linhas de tabela que abrem outro relatório (só as que têm dados no protótipo). */
const LINK_LINHA: Record<string, string> = { 'EM Jardim das Flores': 'escola', 'Turma 701': 'turma', 'Alice Moreira': 'est', 'Rafael Souza': 'prof' }

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

/* ================================================================== app */
export default function NovosRelatorios({ startScreen }: PrototypeProps) {
  const ini = ATALHOS[startScreen ?? ''] ?? ATALHOS['inst-gestora']
  const [tela, setTela] = useState<Tela>(ini.tela)
  const [perfil, setPerfil] = useState<Perfil>(ini.perfil)
  const [modal, setModal] = useState<Modal>(ini.modal ?? null)
  const [toast, setToast] = useState<Toast | null>(ini.toast ?? null)
  const [ancora, setAncora] = useState<DOMRect | null>(null)
  const [gaveta, setGaveta] = useState(false)
  const [recolhida, setRecolhida] = useState(false)
  const [periodo, setPeriodo] = useState(PERIODO)
  const [nFiltros, setNFiltros] = useState(0)
  const [tipoAtiv, setTipoAtiv] = useState<string | null>(null)
  // barra de filtros recolhida: preferência do visitante, vale para todas as telas
  const [selRecolhida, setSelRecolhidaSt] = useState(() => {
    try {
      return localStorage.getItem('nr-filtros-recolhidos') === '1'
    } catch {
      return false
    }
  })
  const setSelRecolhida = (v: boolean) => {
    setSelRecolhidaSt(v)
    try {
      localStorage.setItem('nr-filtros-recolhidos', v ? '1' : '0')
    } catch {
      /* sem armazenamento: só nesta sessão */
    }
  }
  const [paineis, setPaineis] = useState(PAINEIS)
  const [blocosPainel, setBlocosPainel] = useState<string[]>(['Prioridades pedagógicas', 'Ranking de aprendizagem', 'Desempenho × engajamento', 'Estudantes ativos por mês'])
  const ultimoClique = useRef<DOMRect | null>(null)
  const celular = useMedia('(max-width: 899px)')

  useEffect(() => {
    document.title = 'Novos Relatórios · Educadores · Protótipo Jovens Gênios'
    const on = (e: MouseEvent) => {
      const b = (e.target as HTMLElement).closest('button')
      if (b) ultimoClique.current = b.getBoundingClientRect()
    }
    window.addEventListener('click', on, true)
    return () => window.removeEventListener('click', on, true)
  }, [])
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3800)
    return () => clearTimeout(t)
  }, [toast])
  useEffect(() => {
    if (!modal) return
    const on = (e: KeyboardEvent) => e.key === 'Escape' && setModal(null)
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [modal])
  useEffect(() => {
    // sobrepostos abertos por atalho: ancora no seletor correspondente
    if (!ini.modal) return
    const sel: Record<string, string> = { perfil: '.nr-side-usuario', periodo: '.nr-sel:last-child .nr-sel__btn', tipo: '.nr-sel:first-child .nr-sel__btn', tipoAtiv: '[data-rot="Tipo de atividade"] .nr-sel__btn', atividade: '[data-rot="Atividade"] .nr-sel__btn', onde: '.nr-sel:nth-child(2) .nr-sel__btn', menuBloco: '.nr-cartao__topo .nr-icone-btn' }
    const t = setTimeout(() => {
      const alvo = document.querySelector(sel[ini.modal!.id] ?? '__') as HTMLElement | null
      if (alvo) setAncora(alvo.getBoundingClientRect())
    }, 350)
    return () => clearTimeout(t)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const ir = (t: Tela) => {
    setTela(t)
    setModal(null)
    setGaveta(false)
    document.querySelector('.rx-rolagem')?.scrollTo({ top: 0 })
  }
  const abrir = (m: Modal) => {
    setAncora(ultimoClique.current)
    setModal(m)
  }
  // abre um sobreposto ancorado no seletor de rótulo `rot` (ex.: tipo escolhido → abre "Atividade")
  const abrirNoSel = (rot: string, m: Modal) => {
    const el = document.querySelector(`[data-rot="${rot}"] button`) as HTMLElement | null
    setAncora(el ? el.getBoundingClientRect() : ultimoClique.current)
    setModal(m)
  }
  const fora = (n: string, texto = 'Neste protótipo, use o menu Relatórios: Institucionais, Atividades ou Meus painéis.') => setToast({ tipo: 'info', titulo: `“${n}” não faz parte deste protótipo`, texto })
  const abrirRel = (id: string, aba = 'Visão geral') => {
    const r = RELS[id]
    if (!r) return
    if (!podeAbrir(perfil, id)) {
      setToast({ tipo: 'info', titulo: 'Fora do seu acesso', texto: `O seu perfil (${PERFIS[perfil].papelLongo}) não vê este relatório.` })
      return
    }
    ir({ id: 'rel', rel: id, aba })
  }
  const onIr = (alvo: string) => {
    if (alvo.startsWith('__fora__')) return setToast({ tipo: 'info', titulo: 'Fora da amostra do protótipo', texto: 'Os links com dados levam a Alice Moreira, Turma 701, Rafael Souza, EM Jardim das Flores e às atividades do histórico.' })
    abrirRel(alvo)
  }
  const trocarPerfil = (p: Perfil) => {
    setPerfil(p)
    setTipoAtiv(null)
    setModal(null)
    ir({ id: 'escolhaI' })
    setToast({ tipo: 'ok', titulo: `Vendo como ${PERFIS[p].nome}`, texto: PERFIS[p].papelLongo })
  }

  const rel = tela.id === 'rel' ? RELS[tela.rel] : null
  const menu: 'inst' | 'ativ' | 'paineis' = tela.id === 'escolhaA' || rel?.grupo === 'ativ' ? 'ativ' : ['paineis', 'painel', 'edicao', 'novo', 'compartilhado'].includes(tela.id) ? 'paineis' : 'inst'
  const migalhas =
    tela.id === 'rel' && rel
      ? rel.mig.concat([tela.aba])
      : tela.id === 'escolhaI'
        ? ['Início', 'Relatórios', 'Institucionais']
        : tela.id === 'escolhaA'
          ? ['Início', 'Relatórios', 'Atividades']
          : tela.id === 'paineis'
            ? ['Início', 'Relatórios', 'Meus painéis']
            : tela.id === 'novo'
              ? ['Início', 'Relatórios', 'Meus painéis', 'Novo painel']
              : tela.id === 'estrutura'
                ? ['Início', 'Relatórios', 'Estrutura e permissões']
                : ['Início', 'Relatórios', 'Meus painéis', 'Reunião de coordenação']
  const voltarMigalha = (i: number) => {
    const m = migalhas[i]
    if (m === 'Institucionais') ir({ id: 'escolhaI' })
    else if (m === 'Atividades') ir({ id: 'escolhaA' })
    else if (m === 'Meus painéis') ir({ id: 'paineis' })
    else if (m === 'Relatórios') ir({ id: menu === 'ativ' ? 'escolhaA' : menu === 'paineis' ? 'paineis' : 'escolhaI' })
    else if (m === 'Início') fora('Início')
    else if (rel && i === 3) ir({ id: rel.grupo === 'ativ' ? 'escolhaA' : 'escolhaI' })
  }

  if (tela.id === 'migracao')
    return (
      <div className="nr nr-interno">
        <Migracao onExportar={() => abrir({ id: 'exportar' })} onSair={() => ir({ id: 'escolhaI' })} />
        <Sobrepostos {...{ modal, setModal, ancora, celular, perfil, rel, tela, periodo, setPeriodo, nFiltros, setNFiltros, paineis, setPaineis, setToast, trocarPerfil, abrirRel, ir, tipoAtiv, setTipoAtiv, abrirNoSel }} />
        <ToastView toast={toast} onFechar={() => setToast(null)} />
      </div>
    )

  return (
    <SelRecolhida.Provider value={{ rec: selRecolhida, set: setSelRecolhida }}>
    <div className={`rx nr ${recolhida ? 'is-recolhida' : ''}`}>
      <AnimatePresence>{gaveta && <motion.div className="rx-veu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setGaveta(false)} />}</AnimatePresence>
      <Sidebar
        aberta={gaveta}
        recolhida={recolhida && !celular}
        perfil={perfil}
        menu={menu}
        onIr={(m) => ir({ id: m === 'inst' ? 'escolhaI' : m === 'ativ' ? 'escolhaA' : 'paineis' })}
        onFora={fora}
        onPerfil={() => abrir({ id: 'perfil' })}
        onRecolher={() => (celular ? setGaveta(false) : setRecolhida((r) => !r))}
      />
      <div className="rx-principal">
        <header className="rx-topo">
          <button className="rx-icone-btn rx-topo__menu" onClick={() => setGaveta(true)} aria-label="Abrir menu">
            <Menu size={22} />
          </button>
          <nav className="rx-migalhas" aria-label="Você está em">
            {migalhas.map((m, i) => (
              <span key={i} className={i === migalhas.length - 1 ? 'is-atual' : ''}>
                {i > 0 && <i>/</i>}
                {i < migalhas.length - 1 ? (
                  <button className="nr-migalha" onClick={() => voltarMigalha(i)}>
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
            <motion.div key={JSON.stringify(tela) + perfil} className="rx-conteudo nr-conteudo" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.1 } }} transition={{ duration: 0.22 }}>
              {tela.id === 'escolhaI' && <EscolhaInst perfil={perfil} periodo={periodo} onAbrir={abrirRel} onSel={abrir} nFiltros={nFiltros} />}
              {tela.id === 'escolhaA' && <EscolhaAtiv perfil={perfil} tipo={tipoAtiv} onAbrir={abrirRel} onSel={abrir} onIr={onIr} nFiltros={nFiltros} />}
              {tela.id === 'rel' && rel && (
                <Relatorio
                  key={rel.id}
                  rel={rel}
                  aba={tela.aba}
                  seg={tela.seg}
                  perfil={perfil}
                  periodo={periodo}
                  nFiltros={nFiltros}
                  onAba={(aba) => setTela({ ...tela, aba })}
                  onSeg={(seg) => setTela({ ...tela, seg })}
                  onModal={abrir}
                  onIr={onIr}
                  onListaSel={(rot) => abrir(listaPara(rot, rel, perfil))}
                />
              )}
              {tela.id === 'paineis' && (
                <PaineisLista
                  perfil={perfil}
                  paineis={paineis}
                  onAbrir={(p) => (p === 'Reunião de coordenação' ? ir({ id: perfil === 'prof' ? 'compartilhado' : 'painel' }) : fora(p, 'Neste protótipo, abra o painel “Reunião de coordenação”.'))}
                  onNovo={() => ir({ id: 'novo' })}
                  onExcluir={() => abrir({ id: 'excluir' })}
                  onModelo={(m) => fora('Modelo ' + m, 'Os modelos prontos entram numa próxima etapa. Abra “Reunião de coordenação” para ver um painel montado.')}
                />
              )}
              {tela.id === 'painel' && <PainelUso blocos={blocosPainel} onEditar={() => ir({ id: 'edicao' })} onCompartilhar={() => abrir({ id: 'compartilhar' })} onMenu={(b) => abrir({ id: 'menuBloco', bloco: b })} onPeriodo={() => abrir({ id: 'periodo' })} />}
              {tela.id === 'edicao' && (
                <PainelEdicao
                  blocos={blocosPainel}
                  onSalvar={(b) => {
                    setBlocosPainel(b)
                    ir({ id: 'painel' })
                    setToast({ tipo: 'ok', titulo: 'Painel salvo em Meus painéis' })
                  }}
                  onCancelar={() => ir({ id: 'painel' })}
                />
              )}
              {tela.id === 'novo' && (
                <PainelNovo
                  onSalvar={(nome, n) => {
                    setPaineis((ps) => [{ nome, sub: `Rede inteira · ${n} bloco${n === 1 ? '' : 's'} · editado agora`, comp: 'Só você' }, ...ps])
                    ir({ id: 'paineis' })
                    setToast({ tipo: 'ok', titulo: 'Painel salvo em Meus painéis' })
                  }}
                  onCancelar={() => ir({ id: 'paineis' })}
                  onModelo={() => fora('Modelos', 'Os modelos prontos entram numa próxima etapa.')}
                />
              )}
              {tela.id === 'compartilhado' && <PainelCompartilhado onDuplicar={() => setToast({ tipo: 'ok', titulo: 'Painel duplicado', texto: '“Cópia de Reunião de coordenação” está em Meus painéis, com as suas turmas.' })} />}
              {tela.id === 'estrutura' && <Estrutura />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <Sobrepostos {...{ modal, setModal, ancora, celular, perfil, rel, tela, periodo, setPeriodo, nFiltros, setNFiltros, paineis, setPaineis, setToast, trocarPerfil, abrirRel, ir, tipoAtiv, setTipoAtiv, abrirNoSel }} />
      <ToastView toast={toast} onFechar={() => setToast(null)} />
    </div>
    </SelRecolhida.Provider>
  )
}

/** Lista de opções dos seletores de recorte (Escola, Turma, Professor, Estudante). */
function listaPara(rot: string, rel: Rel, perfil: Perfil): Modal {
  if (rot === 'Escola') return { id: 'lista', titulo: 'Escola', opcoes: [['Todas as escolas', '18 escolas'] as [string, string]].concat(ESCOLAS_TODAS.slice().sort().map((e) => [e, e === 'EM Jardim das Flores' ? '9 turmas · 230 estudantes' : undefined] as any)).map(([t, s]) => [t, s, t === 'EM Jardim das Flores' ? 'escola' : undefined]) }
  if (rot === 'Turma') {
    const turmas = perfil === 'prof' ? ['701', '702', '801'] : TURMAS_ESCOLA
    return { id: 'lista', titulo: 'Turma', opcoes: [[perfil === 'prof' ? 'Minhas turmas' : 'Todas as turmas', `${turmas.length} turmas`, rel.id === 'prof' ? 'prof' : undefined] as [string, string?, string?]].concat(turmas.map((t) => ['Turma ' + t, t === '701' ? '26 estudantes · Matemática com Rafael Souza' : undefined, t === '701' ? (rel.id === 'est' ? 'est' : 'turma') : undefined])) }
  }
  if (rot === 'Professor') return { id: 'lista', titulo: 'Professor', opcoes: [['Todos os professores', '14 professores']].concat(PROFESSORES.map((p) => [p, p === 'Rafael Souza' ? 'Matemática · turmas 701, 702 e 801' : undefined] as any)).map(([t, s]) => [t, s, t === 'Rafael Souza' ? 'prof' : undefined]) }
  return { id: 'lista', titulo: 'Estudante', opcoes: [['Todos os estudantes da turma', '26 estudantes'] as [string, string?, string?]].concat(E701.map((e) => [e[0], e[0] === 'Alice Moreira' ? 'Turma 701 · Avançado' : 'Turma 701', e[0] === 'Alice Moreira' ? 'est' : undefined])) }
}

/* ================================================================== casca */
function Sidebar({ aberta, recolhida, perfil, menu, onIr, onFora, onPerfil, onRecolher }: { aberta: boolean; recolhida: boolean; perfil: Perfil; menu: 'inst' | 'ativ' | 'paineis'; onIr: (m: 'inst' | 'ativ' | 'paineis') => void; onFora: (n: string) => void; onPerfil: () => void; onRecolher: () => void }) {
  const P = PERFIS[perfil]
  const Item = ({ icon: I, t }: { icon: LucideIcon; t: string }) => (
    <button className="rx-side__item" onClick={() => onFora(t)} title={t}>
      <I size={18} /> <span>{t}</span> <ChevronRight size={16} className="rx-side__seta" />
    </button>
  )
  return (
    <aside className={`rx-side ${aberta ? 'is-aberta' : ''}`}>
      <div className="rx-side__marca">
        <img src="./cron/logo.webp" alt="Jovens Gênios" />
        <span className="rx-side__txt">
          <b>Educadores</b>
          <small>Jovens Gênios</small>
        </span>
        <button className="rx-icone-btn rx-side__recolher" onClick={onRecolher} aria-label={recolhida ? 'Expandir menu' : 'Recolher menu'}>
          {aberta ? <X size={18} /> : recolhida ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      <nav className="rx-side__nav">
        <button className="rx-side__item" onClick={() => onFora('Início')} title="Início">
          <Home size={18} /> <span>Início</span>
        </button>
        <p className="rx-side__sec">Funcionalidades</p>
        <Item icon={Plus} t="Criar" />
        <div className="rx-side__item is-grupo" title="Relatórios">
          <BarChart3 size={18} /> <span>Relatórios</span> <ChevronDown size={16} className="rx-side__seta" />
        </div>
        <div className="rx-side__sub nr-side-sub">
          {(
            [
              ['inst', 'Institucionais'],
              ['ativ', 'Atividades'],
              ['paineis', 'Meus painéis'],
            ] as const
          ).map(([k, t]) => (
            <button key={k} className={`rx-side__subitem ${menu === k ? 'is-on' : ''}`} onClick={() => onIr(k)} aria-current={menu === k ? 'page' : undefined}>
              {t}
            </button>
          ))}
        </div>
        <Item icon={WandSparkles} t="Assistente" />
        <Item icon={GraduationCap} t="Formação" />
        <Item icon={Library} t="Biblioteca" />
        <Item icon={CircleHelp} t="Central de ajuda" />
      </nav>
      <button className="rx-side__usuario nr-side-usuario" onClick={onPerfil} title="Trocar perfil (protótipo)">
        <span className="rx-avatar nr-avatar">{P.ini}</span>
        <span className="rx-side__txt">
          <b>{P.nome}</b>
          <small>{P.papel}</small>
        </span>
        <ChevronsUpDownMini />
      </button>
    </aside>
  )
}
const ChevronsUpDownMini = () => <ChevronDown size={14} className="nr-side-usuario__seta" />

function ToastView({ toast, onFechar }: { toast: Toast | null; onFechar: () => void }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div key={toast.titulo} className={`nr-toast is-${toast.tipo}`} role="status" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
          {toast.tipo === 'ok' ? <CheckCircle2 size={20} /> : <Info size={20} />}
          <span>
            <b>{toast.titulo}</b>
            {toast.texto && <small>{toast.texto}</small>}
          </span>
          <button className="nr-icone-btn" onClick={onFechar} aria-label="Fechar aviso">
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ================================================================== cabeçalho dos relatórios */
const Alerta = () => (
  <div className="nr-alerta">
    <Info size={15} /> Os dados deste relatório podem levar até 6 horas para serem atualizados.
  </div>
)
function CabRel({ titulo, acesso, sub, acoes, onModal, children }: { titulo: string; acesso?: string; sub?: string; acoes?: boolean; onModal: (m: Modal) => void; children: ReactNode }) {
  return (
    <>
      <div className="nr-cab">
        <div>
          <h1 className="rx-h1">
            {titulo} {acesso && <Badge t={acesso} tom="av" icon={Lock} />}
          </h1>
          {sub && <p>{sub}</p>}
        </div>
        {acoes && (
          <div className="nr-cab__acoes">
            <button className="nr-btn is-contorno" onClick={() => onModal({ id: 'compartilhar' })}>
              <Share2 size={16} /> Compartilhar
            </button>
            <button className="nr-btn is-contorno" onClick={() => onModal({ id: 'exportar' })}>
              <Download size={16} /> Exportar
            </button>
            <button className="nr-btn is-contorno" onClick={() => onModal({ id: 'salvar' })}>
              <LayoutGrid size={16} /> Salvar como painel
            </button>
          </div>
        )}
      </div>
      {children}
    </>
  )
}
const SelRecolhida = createContext<{ rec: boolean; set: (v: boolean) => void }>({ rec: false, set: () => {} })
type SelProps = { rot: string; valor: string; ic: string; placeholder?: boolean; travado?: boolean; onClick: () => void }
// Barra de seletores. Recolhida, vira uma linha com o resumo das escolhas; cada item ainda abre o seu seletor.
const BarraSel = ({ children, nFiltros, onFiltros }: { children: ReactNode; nFiltros: number; onFiltros: () => void }) => {
  const { rec, set } = useContext(SelRecolhida)
  const filtros = (
    <button className="nr-btn is-contorno nr-selbar__filtros" onClick={onFiltros}>
      <SlidersHorizontal size={16} /> Filtros{nFiltros > 0 && <Badge t={nFiltros} tom="p1" />}
    </button>
  )
  if (rec) {
    const sels = Children.toArray(children).filter(isValidElement).map((c) => c.props as SelProps)
    return (
      <div className="nr-selbar is-recolhida">
        <div className="nr-resumo">
          {sels.map((sp) => (
            <span key={sp.rot} data-rot={sp.rot} className="nr-resumo__item">
              <button className={`nr-resumo__chip ${sp.placeholder ? 'is-ph' : ''} ${sp.travado ? 'is-travado' : ''}`} onClick={sp.onClick} title={`${sp.rot}: ${sp.valor}`} aria-label={`${sp.rot}: ${sp.valor}`}>
                <Ic n={sp.ic} size={14} />
                <small>{sp.rot}</small>
                <span>{sp.valor}</span>
              </button>
            </span>
          ))}
        </div>
        {filtros}
        <button className="nr-icone-btn nr-selbar__alterna" onClick={() => set(false)} aria-label="Expandir filtros" title="Expandir filtros">
          <ChevronDown size={18} />
        </button>
      </div>
    )
  }
  return (
    <div className="nr-selbar">
      <div className="nr-selbar__sels">{children}</div>
      {filtros}
      <button className="nr-icone-btn nr-selbar__alterna" onClick={() => set(true)} aria-label="Recolher filtros" title="Recolher filtros">
        <ChevronUp size={18} />
      </button>
    </div>
  )
}

/* ================================================================== 1 · escolha institucional */
function EscolhaInst({ perfil, periodo, onAbrir, onSel, nFiltros }: { perfil: Perfil; periodo: string; onAbrir: (r: string) => void; onSel: (m: Modal) => void; nFiltros: number }) {
  const P = PERFIS[perfil]
  return (
    <>
      <CabRel titulo="Relatórios institucionais" acesso={P.acesso} sub="Escolha o tipo de relatório e o recorte. O relatório abre com as abas Visão geral, Engajamento e Aprendizagem." onModal={onSel}>
        <BarraSel nFiltros={nFiltros} onFiltros={() => onSel({ id: 'filtros' })}>
          <Seletor rot="Tipo de relatório" valor="Selecione o tipo" ic="list-checks" placeholder largura={240} onClick={() => onSel({ id: 'tipo' })} />
          <Seletor rot="Recorte" valor="Escolha o tipo primeiro" ic="map-pin" placeholder largura={300} onClick={() => onSel({ id: 'tipo' })} />
          <Seletor rot="Período" valor={periodo} ic="calendar" largura={260} onClick={() => onSel({ id: 'periodo' })} />
        </BarraSel>
      </CabRel>
      <div className="nr-secao">
        <h2>Qual relatório você quer ver?</h2>
        <p>{perfil === 'gestora' ? 'Você vê todos os tipos de relatório institucional.' : perfil === 'coord' ? 'Você vê os relatórios da sua escola; o relatório de rede fica com a gestão.' : 'Você vê os relatórios das turmas em que leciona e dos estudantes delas.'}</p>
      </div>
      <div className="nr-tipos">
        {LIB_I[perfil].map(([t, n, off]) => (
          <button key={t} className={`nr-tipo ${off ? 'is-off' : ''}`} disabled={off} onClick={() => onAbrir(TIPOS_I[t].rel)}>
            <span className="nr-tipo__cab">
              <span className="nr-tile">
                <Ic n={TIPOS_I[t].ic} size={20} />
              </span>
              <span>
                <b>{t}</b>
                <small>{n}</small>
              </span>
            </span>
            <span className="nr-tipo__d">{TIPOS_I[t].d}</span>
            {!off && (
              <span className="nr-link">
                Ver relatório <ArrowRight size={14} />
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="nr-linha">
        <Cartao titulo="Abertos recentemente">
          <div className="nr-lista">
            {RECENTES_I[perfil].map(([t, d, r]) => (
              <div key={t} className="nr-lista__item">
                <div>
                  <b>{t}</b>
                  <small>{d}</small>
                </div>
                <button className="nr-link" onClick={() => onAbrir(r)}>
                  Abrir <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </Cartao>
      </div>
    </>
  )
}

/* ================================================================== 8 · escolha da atividade */
function EscolhaAtiv({ perfil, tipo, onAbrir, onSel, onIr, nFiltros }: { perfil: Perfil; tipo: string | null; onAbrir: (r: string) => void; onSel: (m: Modal) => void; onIr: (r: string) => void; nFiltros: number }) {
  const P = PERFIS[perfil]
  const hist: Tabela = { titulo: 'Histórico de atividades', busca: 'Pesquisar atividade...', pag: ['Mostrando 6 atividades mais recentes', 5], cols: [{ t: 'Nome', sort: true }, { t: 'Tipo', w: 170 }, { t: 'Onde', w: 220 }, { t: 'Início', w: 96, al: 'CENTER', sort: true }, { t: 'Término', w: 96, al: 'CENTER' }, { t: 'Status', w: 136 }, { t: 'Relatório', w: 130 }], rows: HIST_A(perfil) }
  return (
    <>
      <CabRel titulo="Relatórios de atividades" acesso={P.acesso} sub="Escolha o tipo de atividade e, em seguida, a atividade. As telas são as mesmas para gestão, coordenação e professores; os números seguem o seu acesso." onModal={onSel}>
        <BarraSel nFiltros={nFiltros} onFiltros={() => onSel({ id: 'filtros' })}>
          <Seletor rot="Tipo de atividade" valor={tipo ?? 'Selecione o tipo'} ic={tipo ? (TIPOS_A.find((t) => t[0] === tipo)?.[1] ?? 'list-checks') : 'list-checks'} placeholder={!tipo} largura={240} onClick={() => onSel({ id: 'tipoAtiv' })} />
          <Seletor rot="Atividade" valor={tipo ? 'Selecione a atividade' : 'Escolha o tipo primeiro'} ic="file-text" placeholder travado={!tipo} largura={280} onClick={() => (tipo ? onSel({ id: 'atividade', tipo }) : undefined)} />
          <Seletor rot={P.onde[0]} valor={P.onde[1]} ic="map-pin" largura={300} onClick={() => onSel({ id: 'onde' })} />
        </BarraSel>
      </CabRel>
      <div className="nr-secao">
        <h2>Qual atividade você quer ver?</h2>
      </div>
      <div className="nr-tipos">
        {TIPOS_A.map(([t, ic, r, d], i) => {
          const n = N_A[perfil][i]
          return (
            <button key={t} className={`nr-tipo ${!n ? 'is-off' : ''}`} disabled={!n} onClick={() => onAbrir(r)}>
              <span className="nr-tipo__cab">
                <span className="nr-tile">
                  <Ic n={ic} size={20} />
                </span>
                <span>
                  <b>{t}</b>
                  <small>{n ?? 'Nenhuma nas suas turmas'}</small>
                </span>
              </span>
              <span className="nr-tipo__d">{d}</span>
              {n && (
                <span className="nr-link">
                  Ver relatório <ArrowRight size={14} />
                </span>
              )}
            </button>
          )
        })}
      </div>
      <TabelaCard t={hist} onExportar={() => onSel({ id: 'exportar' })} onFiltros={() => onSel({ id: 'filtros' })} onIr={onIr} />
    </>
  )
}

/* ================================================================== relatório (institucional ou atividade) */
function Relatorio(p: { rel: Rel; aba: string; seg?: string; perfil: Perfil; periodo: string; nFiltros: number; onAba: (a: string) => void; onSeg: (s: string) => void; onModal: (m: Modal) => void; onIr: (r: string) => void; onListaSel: (rot: string) => void }) {
  const { rel, aba, perfil } = p
  const P = PERFIS[perfil]
  const abas = abasDe(rel)
  const [ent, tipoEnt, icEnt, subEnt, badges] = rel.ent
  const clicaSel = (rot: string) => {
    if (rot === 'Tipo de relatório') return p.onModal({ id: 'tipo' })
    if (rot === 'Tipo de atividade') return p.onModal({ id: 'tipoAtiv' })
    if (rot === 'Atividade') return p.onModal({ id: 'atividade', tipo: rel.tipo })
    if (rot === 'Período') return p.onModal({ id: 'periodo' })
    if (['Escola', 'Turma', 'Professor', 'Estudante'].includes(rot)) return p.onListaSel(rot)
    return p.onModal({ id: 'onde' })
  }
  const linkLinha = (txt: string) => (LINK_LINHA[txt] && LINK_LINHA[txt] !== rel.id && podeAbrir(perfil, LINK_LINHA[txt]) ? LINK_LINHA[txt] : null)
  const itens = rel.T[aba] ?? []
  return (
    <>
      <CabRel titulo={rel.cab.titulo} acesso={P.acesso} acoes onModal={p.onModal}>
        <BarraSel nFiltros={p.nFiltros} onFiltros={() => p.onModal({ id: 'filtros' })}>
          {rel.cab.sel.map(([rot, val, ic, w, ph, trav]) => {
            const travado = trav && perfil !== 'gestora'
            return <Seletor key={rot} rot={rot} valor={rot === 'Período' ? p.periodo : val} ic={ic} placeholder={ph} travado={travado} largura={w} onClick={() => (travado ? undefined : clicaSel(rot))} />
          })}
        </BarraSel>
      </CabRel>
      <Alerta />
      <div className="nr-ent">
        <span className="nr-tile is-g">
          <Ic n={icEnt} size={24} />
        </span>
        <div>
          <h2>
            {ent} <Badge t={tipoEnt} tom="av" />
            {badges?.map(([t, tom]) => <Badge key={t} t={t} tom={tom} />)}
          </h2>
          <p>{subEnt}</p>
        </div>
      </div>
      <div className="nr-abas">
        <div className="rx-abas" role="tablist" aria-label="Abas do relatório">
          {abas.map((a) => (
            <button key={a} role="tab" aria-selected={aba === a} className={aba === a ? 'is-on' : ''} onClick={() => p.onAba(a)}>
              {a}
              {aba === a && <motion.span layoutId="aba-nr" className="rx-abas__linha" />}
            </button>
          ))}
        </div>
        <button className="nr-link" onClick={() => p.onModal({ id: 'glossario' })}>
          <BookOpen size={16} /> Glossário
        </button>
      </div>
      <Corpo itens={itens} rel={rel} seg={p.seg} onSeg={p.onSeg} onModal={p.onModal} onIr={p.onIr} linkLinha={linkLinha} />
    </>
  )
}

/** Primeira tabela de tópicos do relatório (para o "Ver por: Tópicos"). */
const tabelaTopicos = (rel: Rel): Tabela => {
  for (const its of Object.values(rel.T)) for (const it of its) if (it[0] === 'tab' && /[Tt]ópico/.test(it[1].titulo) && it[1].cols[0].t === 'Tópico') return it[1]
  return (RELS.escola.T.Aprendizagem.find((i) => i[0] === 'tab') as ['tab', Tabela])[1]
}

function Corpo({ itens, rel, seg, onSeg, onModal, onIr, linkLinha }: { itens: Item[]; rel: Rel; seg?: string; onSeg: (s: string) => void; onModal: (m: Modal) => void; onIr: (r: string) => void; linkLinha: (t: string) => string | null }) {
  const out: ReactNode[] = []
  let segAtual: string | null = null
  let segPrimeiro: string | null = null
  const menuBloco = (b: string) => onModal({ id: 'menuBloco', bloco: b })
  itens.forEach((it, i) => {
    const k = i
    if (it[0] === 'kpis') out.push(<Kpis key={k} itens={it[1]} dicas={DICA_KPI} />)
    else if (it[0] === 'sec')
      out.push(
        <div key={k} className="nr-secao">
          <h2>{it[1][0]}</h2>
          {it[1][1] && <p>{it[1][1]}</p>}
        </div>,
      )
    else if (it[0] === 'row') out.push(<Linha key={k} blocos={it[1]} onMenu={menuBloco} onIr={onIr} />)
    else if (it[0] === 'seg') {
      const [ops, def] = it[1]
      segPrimeiro = def
      segAtual = seg && ops.includes(seg) ? seg : def
      out.push(<Segmento key={k} opcoes={ops} valor={segAtual} onTroca={onSeg} extra={rel.id === 'oli' && segAtual === 'Escolas' ? <button className="nr-btn is-contorno" onClick={() => onModal({ id: 'onde' })}>Escola: EM Castro Alves <ChevronDown size={16} /></button> : undefined} />)
      if (rel.id === 'oli')
        OLI_VISOES[segAtual].forEach((v, j) => {
          if (v[0] === 'podio') out.push(<Podio key={'o' + j} itens={v[1]} />)
          if (v[0] === 'tab') out.push(<TabelaCard key={'o' + segAtual + j} t={v[1]} onExportar={() => onModal({ id: 'exportar' })} onFiltros={() => onModal({ id: 'filtros' })} onIr={onIr} />)
        })
    } else if (it[0] === 'tab') {
      const trocar = segAtual && segAtual !== segPrimeiro && segAtual === 'Tópicos'
      const t = trocar ? tabelaTopicos(rel) : it[1]
      if (trocar) segAtual = segPrimeiro // só a primeira tabela depois do "Ver por"
      out.push(<TabelaCard key={k + (trocar ? 't' : '')} t={t} onExportar={() => onModal({ id: 'exportar' })} onFiltros={() => onModal({ id: 'filtros' })} onIr={onIr} linkLinha={linkLinha} onMenu={menuBloco} />)
    } else if (it[0] === 'avisoRanking')
      out.push(
        <div key={k} className="nr-alerta is-inf">
          <Info size={15} /> Importante: as posições apresentadas neste ranking são atualizadas periodicamente e podem mudar até o encerramento.
          <button className="nr-btn is-contorno" onClick={() => onModal({ id: 'exportar' })}>
            <Download size={16} /> Exportar ranking
          </button>
        </div>,
      )
  })
  return <>{out}</>
}

function Podio({ itens }: { itens: [number, string, string, string, number][] }) {
  return (
    <div className="nr-podio">
      {itens.map(([pos, t, sub, pts, h]) => (
        <div key={pos} className={`nr-podio__lugar is-${pos}`} style={{ minHeight: h }}>
          <span className="nr-tile is-g">
            <Ic n="medal" size={24} />
          </span>
          <small>{pos}º lugar</small>
          <b>{t}</b>
          <span>{sub}</span>
          <strong>{pts}</strong>
        </div>
      ))}
    </div>
  )
}

/* ================================================================== 19 · Meus painéis */
function PaineisLista({ perfil, paineis, onAbrir, onNovo, onExcluir, onModelo }: { perfil: Perfil; paineis: typeof PAINEIS; onAbrir: (n: string) => void; onNovo: () => void; onExcluir: () => void; onModelo: (m: string) => void }) {
  const [ver, setVer] = useState(perfil === 'prof' ? 'Compartilhados comigo' : 'Meus painéis')
  const [q, setQ] = useState('')
  const [menuDe, setMenuDe] = useState<string | null>(null)
  const lista = ver === 'Meus painéis' ? (perfil === 'prof' ? [] : paineis) : ver === 'Compartilhados comigo' ? (perfil === 'prof' ? [{ nome: 'Reunião de coordenação', sub: 'EM Jardim das Flores › suas turmas · 6 blocos · compartilhado por Mariana Lopes', comp: 'Somente leitura', rel: true }] : []) : []
  const filtrada = lista.filter((p) => p.nome.toLowerCase().includes(q.toLowerCase()))
  return (
    <>
      <div className="nr-cab">
        <div>
          <h1 className="rx-h1">Meus painéis</h1>
          <p>Monte painéis com os blocos do catálogo e compartilhe com a sua equipe. Os números seguem o acesso de quem abre.</p>
        </div>
        <div className="nr-cab__acoes">
          <button className="nr-btn is-primario" onClick={onNovo}>
            <Plus size={16} /> Novo painel
          </button>
        </div>
      </div>
      <div className="nr-filtrosbar">
        <Segmento opcoes={['Meus painéis', 'Compartilhados comigo', 'Modelos']} valor={ver} onTroca={setVer} />
        {ver !== 'Modelos' && (
          <label className="nr-busca">
            <Search size={15} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar painel..." aria-label="Buscar painel" />
          </label>
        )}
      </div>
      {ver !== 'Modelos' && (
        <div className="nr-paineis">
          {filtrada.map((p) => (
            <div key={p.nome} className="nr-painel-card" role="button" tabIndex={0} onClick={() => onAbrir(p.nome)} onKeyDown={(e) => e.key === 'Enter' && onAbrir(p.nome)}>
              <span className="nr-tile">
                <LayoutGrid size={20} />
              </span>
              <div>
                <b>{p.nome}</b>
                <small>{p.sub}</small>
                <Badge t={p.comp} tom={p.comp === 'Só você' ? 'neutro' : 'av'} icon={p.comp === 'Só você' ? Lock : Users} />
              </div>
              {ver === 'Meus painéis' && (
                <span className="nr-painel-card__menu">
                  <button className="nr-icone-btn" onClick={(e) => (e.stopPropagation(), setMenuDe(menuDe === p.nome ? null : p.nome))} aria-label={`Ações de ${p.nome}`}>
                    <MoreHorizontal size={18} />
                  </button>
                  {menuDe === p.nome && (
                    <span className="nr-menu" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => (setMenuDe(null), onAbrir(p.nome))}>
                        <Eye size={15} /> Abrir
                      </button>
                      <button onClick={() => setMenuDe(null)}>
                        <Copy size={15} /> Duplicar
                      </button>
                      <button className="is-cr" onClick={() => (setMenuDe(null), onExcluir())}>
                        <Trash2 size={15} /> Excluir painel
                      </button>
                    </span>
                  )}
                </span>
              )}
            </div>
          ))}
          {filtrada.length === 0 && (
            <div className="nr-vazio-bloco">
              <LayoutGrid size={28} />
              <b>{q ? 'Nenhum painel encontrado' : ver === 'Meus painéis' ? 'Você ainda não tem painéis' : 'Nada compartilhado com você'}</b>
              <small>{ver === 'Meus painéis' ? 'Crie um painel do zero ou comece por um modelo.' : 'Quando alguém compartilhar um painel, ele aparece aqui.'}</small>
            </div>
          )}
        </div>
      )}
      <div className="nr-secao">
        <h2>Modelos da Jovens Gênios</h2>
        <p>Comece de um modelo pronto e ajuste os blocos ao seu recorte.</p>
      </div>
      <div className="nr-paineis">
        {MODELOS.map(([t, d]) => (
          <div key={t} className="nr-painel-card is-modelo">
            <span className="nr-tile">
              <Sparkles size={20} />
            </span>
            <div>
              <b>{t}</b>
              <small>{d}</small>
              <Badge t="Modelo" tom="inf" />
            </div>
            <button className="nr-btn is-contorno" onClick={() => onModelo(t)}>
              Usar modelo
            </button>
          </div>
        ))}
      </div>
    </>
  )
}

const RECORTE_PAINEL = ['Nova Esperança', 'EM Jardim das Flores', '5º ano']
function BarraPainel({ recorte, fixos, onPeriodo }: { recorte: string[]; fixos: string[]; onPeriodo?: () => void }) {
  return (
    <div className="nr-selbar">
      <div className="nr-selbar__sels is-painel">
        <button className="nr-recorte">
          <Ic n="map-pin" />
          {recorte.map((r, i) => (
            <span key={r} className={i === recorte.length - 1 ? 'is-atual' : ''}>
              {i > 0 && <ChevronRight size={14} />} {r}
            </span>
          ))}
          <ChevronDown size={16} />
        </button>
        <span className="nr-fixos">
          <small>Filtros fixos:</small>
          {fixos.length ? fixos.map((f) => <Badge key={f} t={f} tom="av" />) : <small>nenhum</small>}
        </span>
      </div>
      <button className="nr-btn is-contorno" onClick={onPeriodo}>
        <Ic n="calendar" /> Últimos 30 dias <ChevronDown size={16} />
      </button>
    </div>
  )
}
const KPIS_PAINEL: [string, string, string, number, string[]][] = [
  ['Aprendizado adequado', '37%', '60%', 62, ['5º ano · 53 estudantes']],
  ['Estudantes ativos', '37%', '50%', 74, ['5º ano · 53 estudantes']],
  ['Interações por estudante', '28', '40', 70, ['5º ano · 53 estudantes']],
]
/** Blocos do painel (mesmos do catálogo). */
function BlocoPainel({ nome, onMenu, prof }: { nome: string; onMenu?: (b: string) => void; prof?: boolean }) {
  if (nome === 'Prioridades pedagógicas')
    return (
      <Bloco_
        onMenu={onMenu}
        b={{ t: 'hab', titulo: 'Prioridades pedagógicas', itens: prof ? PRIORIDADES_PROF.map(([n, c, p]) => [c.split(' · ')[0], n, p, c.split(' · ')[1]]) : PRIORIDADES.map(([n, c, q, p]) => [c, n, p, `${q} estudantes abaixo de 60%`]) }}
      />
    )
  if (nome === 'Ranking de aprendizagem')
    return (
      <Cartao titulo="Ranking de aprendizagem · Turma 501" onMenu={onMenu}>
        <div className="nr-lista">
          {TURMA_501.map(([n, r, p], i) => (
            <div key={n} className="nr-lista__item">
              <div>
                <b>
                  {i + 1}º · {n}
                </b>
                <small>{r}</small>
              </div>
              <Celula c={{ F: p }} />
            </div>
          ))}
        </div>
        <button className="nr-link">
          <ArrowRight size={14} /> Ver os 26 estudantes
        </button>
      </Cartao>
    )
  if (nome === 'Desempenho × engajamento') return <Bloco_ onMenu={onMenu} b={{ t: 'quad', titulo: 'Desempenho × engajamento · Turma 501', pts: PTS_501.map(([x, y], i) => ({ x, y, nome: 'Estudante ' + (i + 1) })), mx: 50, my: 60, rotX: 'Engajamento (%)', rot: [] }} />
  if (nome === 'Estudantes ativos por mês') return <Bloco_ onMenu={onMenu} b={{ t: 'V', titulo: prof ? 'Estudantes ativos por mês · suas turmas' : 'Estudantes ativos por mês · 5º ano', max: 100, pct: true, meta: 50, leg: [['p1', 'Estudantes ativos (%)'], ['muted', 'Meta: 50%', true]], itens: MESES.map((m, i) => [m, (prof ? ATIVOS_PROF : ATIVOS_5ANO)[i]]) }} />
  if (nome === 'Distribuição de proficiência') return <Bloco_ onMenu={onMenu} b={(RELS.escola.T.Aprendizagem[1][1] as Bloco[])[0]} />
  if (nome === 'Evolução de aprendizagem') return <Bloco_ onMenu={onMenu} b={{ ...(RELS.escola.T.Aprendizagem[1][1] as Bloco[])[1], w: undefined }} />
  if (nome === 'Comparativo por entidade') return <Bloco_ onMenu={onMenu} b={(RELS.escola.T.Engajamento[3][1] as Bloco[])[0]} />
  return null
}
function PainelUso({ blocos, onEditar, onCompartilhar, onMenu, onPeriodo }: { blocos: string[]; onEditar: () => void; onCompartilhar: () => void; onMenu: (b: string) => void; onPeriodo: () => void }) {
  return (
    <>
      <div className="nr-cab">
        <div>
          <h1 className="rx-h1">
            Reunião de coordenação <Badge t="Compartilhado com 3" tom="av" icon={Users} />
          </h1>
          <p>Painel de Mariana Lopes · atualizado há 18 min</p>
        </div>
        <div className="nr-cab__acoes">
          <button className="nr-btn is-contorno" onClick={onCompartilhar}>
            <Share2 size={16} /> Compartilhar
          </button>
          <button className="nr-btn is-primario" onClick={onEditar}>
            <Pencil size={16} /> Editar painel
          </button>
        </div>
      </div>
      <BarraPainel recorte={RECORTE_PAINEL} fixos={['5º ano', 'Matemática']} onPeriodo={onPeriodo} />
      <Alerta />
      <Kpis itens={KPIS_PAINEL} dicas={DICA_KPI} />
      <div className="nr-grade-painel">
        {blocos.map((b) => (
          <BlocoPainel key={b} nome={b} onMenu={onMenu} />
        ))}
      </div>
    </>
  )
}

function Catalogo({ noPainel, onAdicionar }: { noPainel: string[]; onAdicionar: (b: string) => void }) {
  const [cat, setCat] = useState('Todos')
  const [q, setQ] = useState('')
  const itens = CATALOGO.filter(([n, d, c]) => (cat === 'Todos' || c === cat) && (n + d).toLowerCase().includes(q.toLowerCase()))
  return (
    <aside className="nr-catalogo">
      <div className="nr-catalogo__cab">
        <h3>
          Catálogo de blocos <Badge t="23 blocos" tom="neutro" />
        </h3>
        <small>Só indicadores do glossário. Aparecem os blocos que funcionam no recorte e no seu acesso.</small>
      </div>
      <label className="nr-busca">
        <Search size={15} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar bloco ou indicador..." aria-label="Buscar bloco" />
      </label>
      <div className="nr-chips">
        {['Todos', 'Engajamento', 'Aprendizagem', 'Atividades', 'Avaliações', 'Eventos'].map((c) => (
          <button key={c} className={c === cat ? 'is-on' : ''} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>
      <div className="nr-catalogo__lista">
        {itens.map(([n, d, , ic, rec, st]) => {
          const no = st === 'no' || noPainel.includes(n)
          const lock = st === 'lock'
          return (
            <div key={n} className={`nr-cat-item ${lock ? 'is-lock' : ''}`}>
              <GripVertical size={16} className="nr-mudo" />
              <span className="nr-tile is-p">
                <Ic n={ic} size={16} />
              </span>
              <div>
                <b>{n}</b>
                <small>{d}</small>
                <small className="nr-mudo">{rec}</small>
              </div>
              {lock ? (
                <span title="Fora do seu acesso ou do recorte">
                  <Lock size={16} className="nr-mudo" />
                </span>
              ) : no ? (
                <Badge t="No painel" tom="suc" icon={Check} />
              ) : (
                <button className="nr-btn is-contorno is-p" onClick={() => onAdicionar(n)}>
                  <Plus size={14} /> Adicionar
                </button>
              )}
            </div>
          )
        })}
        {itens.length === 0 && <p className="nr-vazio">Nenhum bloco para “{q}”.</p>}
      </div>
    </aside>
  )
}
function PainelEdicao({ blocos, onSalvar, onCancelar }: { blocos: string[]; onSalvar: (b: string[]) => void; onCancelar: () => void }) {
  const [lista, setLista] = useState(blocos)
  const mover = (i: number, d: number) =>
    setLista((l) => {
      const j = i + d
      if (j < 0 || j >= l.length) return l
      const c = l.slice()
      ;[c[i], c[j]] = [c[j], c[i]]
      return c
    })
  return (
    <>
      <div className="nr-cab">
        <div>
          <h1 className="rx-h1">
            Reunião de coordenação <Badge t="Editando" tom="at" icon={Pencil} />
          </h1>
          <p>Painel de Mariana Lopes · compartilhado com 3 pessoas · salvo automaticamente há 1 min</p>
        </div>
        <div className="nr-cab__acoes">
          <button className="nr-btn is-contorno" onClick={onCancelar}>
            Cancelar
          </button>
          <button className="nr-btn is-primario" onClick={() => onSalvar(lista)}>
            <Check size={16} /> Salvar painel
          </button>
        </div>
      </div>
      <BarraPainel recorte={RECORTE_PAINEL} fixos={['5º ano', 'Matemática']} />
      <div className="nr-alerta is-inf">
        <Info size={15} /> Use as setas para reordenar os blocos e o X para tirar um bloco. Os números seguem o recorte do painel e o acesso de quem abre.
      </div>
      <div className="nr-edicao">
        <div className="nr-edicao__area">
          <div className="nr-edita">
            <Kpis itens={KPIS_PAINEL} dicas={DICA_KPI} />
          </div>
          {lista.map((b, i) => (
            <div key={b} className="nr-edita">
              <div className="nr-edita__barra">
                <GripVertical size={16} />
                <b>{b}</b>
                <span>
                  <button className="nr-icone-btn" onClick={() => mover(i, -1)} disabled={i === 0} aria-label="Mover para cima">
                    <ChevronLeft size={16} style={{ transform: 'rotate(90deg)' }} />
                  </button>
                  <button className="nr-icone-btn" onClick={() => mover(i, 1)} disabled={i === lista.length - 1} aria-label="Mover para baixo">
                    <ChevronRight size={16} style={{ transform: 'rotate(90deg)' }} />
                  </button>
                  <button className="nr-icone-btn" onClick={() => setLista((l) => l.filter((x) => x !== b))} aria-label={`Tirar ${b} do painel`}>
                    <X size={16} />
                  </button>
                </span>
              </div>
              <BlocoPainel nome={b} />
            </div>
          ))}
          <div className="nr-solte">
            <Plus size={18} /> Solte o bloco aqui ou use “Adicionar” no catálogo
          </div>
        </div>
        <Catalogo noPainel={lista} onAdicionar={(b) => setLista((l) => l.concat([b]))} />
      </div>
    </>
  )
}
function PainelNovo({ onSalvar, onCancelar, onModelo }: { onSalvar: (nome: string, n: number) => void; onCancelar: () => void; onModelo: () => void }) {
  const [nome, setNome] = useState('Painel sem título')
  const [lista, setLista] = useState<string[]>([])
  return (
    <>
      <div className="nr-cab">
        <div>
          <h1 className="rx-h1">
            <input className="nr-titulo-input" value={nome} onChange={(e) => setNome(e.target.value)} aria-label="Nome do painel" /> <Badge t="Rascunho" tom="neutro" />
          </h1>
          <p>Dê um nome ao painel e adicione blocos do catálogo.</p>
        </div>
        <div className="nr-cab__acoes">
          <button className="nr-btn is-contorno" onClick={onCancelar}>
            Cancelar
          </button>
          <button className="nr-btn is-primario" disabled={!lista.length} onClick={() => onSalvar(nome.trim() || 'Painel sem título', lista.length)} title={lista.length ? undefined : 'Adicione pelo menos 1 bloco'}>
            <Check size={16} /> Salvar painel
          </button>
        </div>
      </div>
      <BarraPainel recorte={['Rede Municipal de Nova Esperança']} fixos={[]} />
      <div className="nr-edicao">
        <div className="nr-edicao__area">
          {lista.length === 0 ? (
            <div className="nr-vazio-bloco is-grande">
              <LayoutGrid size={32} />
              <b>Seu painel está vazio</b>
              <small>Arraste blocos do catálogo à direita ou comece por um modelo pronto. Cada bloco usa só indicadores do glossário.</small>
              <span>
                <button className="nr-btn is-contorno" onClick={onModelo}>
                  <Sparkles size={16} /> Usar um modelo
                </button>
                <button className="nr-btn is-primario" onClick={() => setLista(['Prioridades pedagógicas'])}>
                  <Plus size={16} /> Adicionar bloco
                </button>
              </span>
            </div>
          ) : (
            lista.map((b) => (
              <div key={b} className="nr-edita">
                <div className="nr-edita__barra">
                  <GripVertical size={16} />
                  <b>{b}</b>
                  <span>
                    <button className="nr-icone-btn" onClick={() => setLista((l) => l.filter((x) => x !== b))} aria-label={`Tirar ${b} do painel`}>
                      <X size={16} />
                    </button>
                  </span>
                </div>
                {b === 'Indicador com meta' ? <Kpis itens={KPIS_PAINEL} dicas={DICA_KPI} /> : <BlocoPainel nome={b} />}
              </div>
            ))
          )}
        </div>
        <Catalogo noPainel={lista.concat(['__'])} onAdicionar={(b) => setLista((l) => l.concat([b]))} />
      </div>
    </>
  )
}
function PainelCompartilhado({ onDuplicar }: { onDuplicar: () => void }) {
  const kpis: [string, string, string, number, string[]][] = [
    ['Aprendizado adequado', '41%', '60%', 68, ['Suas turmas']],
    ['Estudantes ativos', '45%', '50%', 90, ['Suas turmas']],
    ['Interações por estudante', '33', '40', 83, ['Suas turmas']],
  ]
  const Bloqueado = ({ t, d }: { t: string; d: string }) => (
    <Cartao titulo={t}>
      <div className="nr-bloqueado">
        <Lock size={22} />
        <b>Sem acesso a este recorte</b>
        <small>{d}</small>
      </div>
    </Cartao>
  )
  return (
    <>
      <div className="nr-cab">
        <div>
          <h1 className="rx-h1">
            Reunião de coordenação <Badge t="Compartilhado por Mariana Lopes" tom="av" icon={Users} /> <Badge t="Somente leitura" tom="neutro" icon={Eye} />
          </h1>
          <p>Você vê os números das suas turmas. Para mudar os blocos, duplique o painel.</p>
        </div>
        <div className="nr-cab__acoes">
          <button className="nr-btn is-primario" onClick={onDuplicar}>
            <Copy size={16} /> Duplicar painel
          </button>
        </div>
      </div>
      <BarraPainel recorte={['EM Jardim das Flores', 'Minhas turmas']} fixos={['Matemática']} />
      <div className="nr-alerta is-at">
        <Lock size={15} /> Dois blocos usam a turma 501, que está fora do seu acesso, e aparecem bloqueados. Os outros mostram só os dados das suas turmas.
      </div>
      <Kpis itens={kpis} dicas={DICA_KPI} />
      <div className="nr-grade-painel">
        <BlocoPainel nome="Prioridades pedagógicas" prof />
        <Bloqueado t="Ranking de aprendizagem · Turma 501" d="A turma 501 não está entre as suas turmas." />
        <Bloqueado t="Desempenho × engajamento · Turma 501" d="Peça acesso à coordenação ou duplique o painel com as suas turmas." />
        <BlocoPainel nome="Estudantes ativos por mês" prof />
      </div>
    </>
  )
}

/* ================================================================== 20 · Migração dos BIs */
function Migracao({ onExportar, onSair }: { onExportar: () => void; onSair: () => void }) {
  const t: Tabela = {
    titulo: 'Clientes',
    busca: 'Pesquisar cliente...',
    desc: 'Nomes de clientes fictícios neste protótipo.',
    pag: ['Mostrando 11 de 11 clientes', 1],
    cols: [{ t: 'Cliente', sort: true }, { t: 'BIs atuais', w: 100, al: 'CENTER', sort: true }, { t: 'Tipos', w: 260 }, { t: 'Divergências', w: 130 }, { t: 'Responsável', w: 150 }, { t: 'Situação', w: 140 }, { t: 'Desligar BI em', w: 140, al: 'CENTER' }],
    rows: MIGRACAO.map(([c, n, tp, dv, r, s, d]) => [c, n, tp, dv === 'Nenhuma' ? { m: dv } : { b: dv, t: 'at' }, r, { b: s, t: s === 'Migrado' ? 'suc' : s === 'Em validação' ? 'inf' : 'neutro' }, d]),
  }
  return (
    <div className="nr-interno__pagina">
      <header className="nr-interno__topo">
        <img src="./cron/logo.webp" alt="" />
        <b>Jovens Gênios · painel interno</b>
        <Badge t="Equipe Jovens Gênios" tom="av" />
        <Badge t="Acesso restrito" tom="neutro" icon={Lock} />
        <button className="nr-btn is-contorno nr-interno__sair" onClick={onSair}>
          <ChevronLeft size={16} /> Voltar para a Educadores
        </button>
      </header>
      <div className="rx-conteudo nr-conteudo">
        <div className="nr-cab">
          <div>
            <h1 className="rx-h1">Migração dos BIs para os Novos Relatórios</h1>
            <p>Acompanhamento da troca dos 22 BIs externos (11 clientes) pelos relatórios da plataforma Educadores. Um BI só é desligado depois que os números batem com os novos relatórios.</p>
          </div>
          <div className="nr-cab__acoes">
            <button className="nr-btn is-contorno" onClick={onExportar}>
              <FileSpreadsheet size={16} /> Exportar status
            </button>
          </div>
        </div>
        <Kpis
          itens={[
            ['BIs migrados', '9', '22', null, ['41% dos BIs externos']],
            ['Em validação', '6', null, null, ['Números conferidos com o cliente']],
            ['A migrar', '7', null, null, ['Previsão até 31/03/2027']],
            ['Divergências abertas', '4', null, null, ['Regra de estudante ativo em 3 clientes']],
          ]}
        />
        <TabelaCard t={t} onExportar={onExportar} onFiltros={() => undefined} onIr={() => undefined} />
      </div>
    </div>
  )
}

/* ================================================================== 0 · Estrutura e permissões */
function Estrutura() {
  const cel = (v: string | number) => (v === 1 ? <Check size={18} className="is-suc" /> : v === 0 ? <X size={18} className="is-cr" /> : <Badge t={v} tom="suc" />)
  const inst: [string, string | number, string | number, string | number][] = [['Rede', 1, 0, 0], ['Escola', 'Todas', 'Só a sua', 0], ['Turma', 'Todas', 'Da sua escola', 'Só as suas'], ['Professores', 'Todos', 'Da sua escola', 0], ['Estudante', 'Todos', 'Da sua escola', 'Das suas turmas'], ['Alfabetização', 'Toda a rede', 'Da sua escola', 'Suas turmas']]
  const ativ = [['Tarefa', 'Visão geral · Engajamento · Aprendizagem', 'Educadores + BI'], ['Prova Genial', 'Visão geral · Engajamento · Aprendizagem', 'Educadores + BI'], ['Desafio', 'Visão geral · Engajamento · Aprendizagem', 'Educadores'], ['Sala de Aula Invertida', 'Visão geral · Engajamento · Aprendizagem', 'Educadores'], ['Projeto', 'Visão geral · Projetos enviados · Engajamento · Aprendizagem', 'Educadores'], ['Raio-X (Diagnóstico)', 'Visão geral · Engajamento · Aprendizagem', 'Educadores'], ['Campeonato', 'Visão geral · Engajamento · Aprendizagem', 'Educadores'], ['Redação', 'Visão geral · Engajamento · Aprendizagem', 'BI'], ['Olimpíadas', 'Visão geral (rankings)', 'Educadores + BI'], ['Liga das Estrelas', 'Visão geral · Engajamento', 'Educadores + BI']]
  return (
    <>
      <div className="nr-cab">
        <div>
          <h1 className="rx-h1">Relatórios: estrutura e permissões</h1>
          <p>Menu Relatórios: Institucionais, Atividades e Meus painéis. Escolhe-se o tipo (e o recorte ou a atividade) e o relatório abre com as abas Visão geral, Engajamento e Aprendizagem, mais o Glossário. Indicadores reais da Educadores e do BI, unificados.</p>
        </div>
      </div>
      <Cartao titulo="Institucionais">
        <div className="nr-tabela-rola">
          <div className="nr-tabela" style={{ minWidth: 640 }}>
            <div className="nr-tr is-cab nr-t-perm">
              <span>Relatório</span>
              <span className="is-centro">Gestor</span>
              <span className="is-centro">Coordenador</span>
              <span className="is-centro">Professor</span>
            </div>
            {inst.map(([n, ...v]) => (
              <div key={n} className="nr-tr nr-t-perm">
                <span className="is-nome">{n}</span>
                {v.map((x, i) => (
                  <span key={i} className="is-centro">
                    {cel(x)}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Cartao>
      <Cartao titulo="Atividades (mesmas telas para os três perfis; o “Onde” segue o acesso)">
        <div className="nr-tabela-rola">
          <div className="nr-tabela" style={{ minWidth: 640 }}>
            <div className="nr-tr is-cab nr-t-ativ">
              <span>Atividade</span>
              <span>Abas</span>
              <span>Fonte</span>
            </div>
            {ativ.map(([n, a, f]) => (
              <div key={n} className="nr-tr nr-t-ativ">
                <span className="is-nome">{n}</span>
                <span>{a}</span>
                <span>
                  <Badge t={f} tom={f === 'BI' ? 'inf' : f === 'Educadores' ? 'av' : 'suc'} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </Cartao>
    </>
  )
}

/* ================================================================== sobrepostos (O1 a O14) */
function Pop({ ancora, celular, largura, onFechar, children, acima }: { ancora: DOMRect | null; celular: boolean; largura: number; onFechar: () => void; children: ReactNode; acima?: boolean }) {
  const estilo = useMemo(() => {
    if (celular || !ancora) return undefined
    const left = Math.max(16, Math.min(ancora.left, window.innerWidth - largura - 16))
    const abaixo = window.innerHeight - ancora.bottom - 24
    if (acima || (abaixo < 380 && ancora.top > abaixo)) return { left, bottom: window.innerHeight - ancora.top + 8, width: largura, maxHeight: ancora.top - 16 }
    return { left, top: ancora.bottom + 8, width: largura, maxHeight: abaixo }
  }, [ancora, celular, largura, acima])
  return (
    <>
      <motion.div className="nr-veu is-leve" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onFechar} />
      <motion.div className={`nr-pop ${celular || !ancora ? 'is-folha' : ''}`} style={estilo} initial={{ opacity: 0, y: celular ? 40 : -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: celular ? 40 : -6 }} role="dialog">
        {children}
      </motion.div>
    </>
  )
}
function Dialogo({ titulo, sub, onFechar, largura = 560, children, rodape, lado }: { titulo: string; sub?: string; onFechar: () => void; largura?: number; children: ReactNode; rodape?: ReactNode; lado?: boolean }) {
  return (
    <>
      <motion.div className="nr-veu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onFechar} />
      <motion.div
        className={`nr-dialogo ${lado ? 'is-lado' : ''}`}
        style={{ ['--larg' as string]: `${largura}px` }}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        initial={lado ? { x: 40, opacity: 0 } : { opacity: 0, scale: 0.97 }}
        animate={lado ? { x: 0, opacity: 1 } : { opacity: 1, scale: 1 }}
        exit={lado ? { x: 40, opacity: 0 } : { opacity: 0, scale: 0.97 }}
      >
        <div className="nr-dialogo__cab">
          <div>
            <h2>{titulo}</h2>
            {sub && <p>{sub}</p>}
          </div>
          <button className="nr-icone-btn" onClick={onFechar} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>
        <div className="nr-dialogo__corpo">{children}</div>
        {rodape && <div className="nr-dialogo__rodape">{rodape}</div>}
      </motion.div>
    </>
  )
}
const Rodape = ({ onCancelar, onOk, ok, perigo, desab }: { onCancelar: () => void; onOk: () => void; ok: string; perigo?: boolean; desab?: boolean }) => (
  <>
    <button className="nr-btn is-contorno" onClick={onCancelar}>
      Cancelar
    </button>
    <button className={`nr-btn ${perigo ? 'is-perigo' : 'is-primario'}`} onClick={onOk} disabled={desab}>
      {ok}
    </button>
  </>
)

function Sobrepostos(p: {
  modal: Modal
  setModal: (m: Modal) => void
  ancora: DOMRect | null
  celular: boolean
  perfil: Perfil
  rel: Rel | null
  tela: Tela
  periodo: string
  setPeriodo: (s: string) => void
  nFiltros: number
  setNFiltros: (n: number) => void
  paineis: typeof PAINEIS
  setPaineis: (f: (p: typeof PAINEIS) => typeof PAINEIS) => void
  setToast: (t: Toast) => void
  trocarPerfil: (p: Perfil) => void
  abrirRel: (r: string, aba?: string) => void
  ir: (t: Tela) => void
  tipoAtiv: string | null
  setTipoAtiv: (t: string) => void
  abrirNoSel: (rot: string, m: Modal) => void
}) {
  const { modal, setModal, ancora, celular, perfil, rel } = p
  const fechar = () => setModal(null)
  const aviso = (titulo: string, texto?: string, tipo: 'ok' | 'info' = 'ok') => {
    fechar()
    p.setToast({ tipo, titulo, texto })
  }
  return (
    <AnimatePresence>
      {modal?.id === 'tipo' && (
        <Pop key="tipo" ancora={ancora} celular={celular} largura={320} onFechar={fechar}>
          <p className="nr-pop__tit">Tipo de relatório</p>
          {Object.entries(TIPOS_I).map(([t, d]) => {
            const ok = podeAbrir(perfil, d.rel) && !LIB_I[perfil].find((x) => x[0] === t)?.[2]
            if (!LIB_I[perfil].some((x) => x[0] === t)) return null
            return (
              <button key={t} className={`nr-opcao ${rel?.id === d.rel ? 'is-on' : ''}`} disabled={!ok} onClick={() => p.abrirRel(d.rel)}>
                <Ic n={d.ic} />
                <span>
                  <b>{t}</b>
                  <small>{d.sub}</small>
                </span>
                {rel?.id === d.rel && <Check size={16} />}
              </button>
            )
          })}
          <small className="nr-pop__nota">Aparecem só os tipos que o seu perfil permite.</small>
        </Pop>
      )}
      {modal?.id === 'tipoAtiv' && (
        <PopTipoAtiv
          key="tipoAtiv"
          ancora={ancora}
          celular={celular}
          perfil={perfil}
          atual={p.tela.id === 'escolhaA' ? p.tipoAtiv : rel?.grupo === 'ativ' ? rel.tipo : null}
          onFechar={fechar}
          onEscolher={(t) => {
            if (p.tela.id === 'escolhaA') p.setTipoAtiv(t)
            p.abrirNoSel('Atividade', { id: 'atividade', tipo: t })
          }}
        />
      )}
      {modal?.id === 'atividade' && (
        <PopAtividade
          key={'ativ-' + modal.tipo}
          ancora={ancora}
          celular={celular}
          perfil={perfil}
          tipo={modal.tipo}
          atual={rel?.grupo === 'ativ' && rel.tipo === modal.tipo ? rel.ent[0] : null}
          onFechar={fechar}
          onTrocarTipo={() => p.abrirNoSel('Tipo de atividade', { id: 'tipoAtiv' })}
          onAbrir={(r) => (fechar(), p.abrirRel(r))}
          onFora={() => aviso('Fora da amostra do protótipo', 'Em cada tipo, a primeira atividade da lista é a que tem dados.', 'info')}
        />
      )}
      {modal?.id === 'onde' && <PopOnde key="onde" ancora={ancora} celular={celular} perfil={perfil} onFechar={fechar} onAplicar={(e) => (e === 'EM Jardim das Flores' && rel?.grupo === 'inst' && podeAbrir(perfil, 'escola') ? p.abrirRel('escola') : aviso('Recorte aplicado', 'Neste protótipo, os números ficam os da tela do Figma.', 'info'))} />}
      {modal?.id === 'lista' && (
        <Pop key="lista" ancora={ancora} celular={celular} largura={340} onFechar={fechar}>
          <p className="nr-pop__tit">{modal.titulo}</p>
          <div className="nr-pop__rola">
            {modal.opcoes.map(([t, s, alvo]) => (
              <button key={t} className="nr-opcao" onClick={() => (alvo ? (p.abrirRel(alvo), fechar()) : aviso('Fora da amostra do protótipo', `Os dados existem para ${modal.titulo === 'Escola' ? 'EM Jardim das Flores' : modal.titulo === 'Turma' ? 'a Turma 701' : modal.titulo === 'Professor' ? 'Rafael Souza' : 'Alice Moreira'}.`, 'info'))}>
                <span>
                  <b>{t}</b>
                  {s && <small>{s}</small>}
                </span>
                {alvo && <ChevronRight size={16} />}
              </button>
            ))}
          </div>
        </Pop>
      )}
      {modal?.id === 'periodo' && <PopPeriodo key="per" ancora={ancora} celular={celular} periodo={p.periodo} onFechar={fechar} onAplicar={(s) => (p.setPeriodo(s), aviso('Período aplicado', s))} />}
      {modal?.id === 'glossario' && (
        <Dialogo key="glos" titulo="Glossário" sub="As mesmas definições valem para todos os relatórios e painéis." onFechar={fechar} lado largura={480}>
          <Glossario />
        </Dialogo>
      )}
      {modal?.id === 'filtros' && <Filtros key="filt" onFechar={fechar} n={p.nFiltros} onAplicar={(n) => (p.setNFiltros(n), aviso(n ? `${n} filtro${n > 1 ? 's' : ''} aplicado${n > 1 ? 's' : ''}` : 'Filtros limpos', 'Valem para todos os blocos desta tela.'))} />}
      {modal?.id === 'compartilhar' && <Compartilhar key="comp" onFechar={fechar} onCopiar={() => aviso('Link copiado', 'Quem abrir vê só os dados do próprio acesso.')} onConcluir={fechar} />}
      {modal?.id === 'exportar' && <Exportar key="exp" rel={rel} aba={p.tela.id === 'rel' ? p.tela.aba : 'Visão geral'} periodo={p.periodo} onFechar={fechar} onExportar={(f) => aviso(`Exportando em ${f}`, 'O download começa sozinho em alguns segundos.', 'info')} />}
      {modal?.id === 'salvar' && (
        <SalvarPainel
          key="salvar"
          rel={rel}
          aba={p.tela.id === 'rel' ? p.tela.aba : 'Visão geral'}
          paineis={p.paineis}
          onFechar={fechar}
          onSalvar={(nome, n, novo) => {
            if (novo) p.setPaineis((ps) => [{ nome, sub: `${rel?.ent[0] ?? 'Rede inteira'} · ${n} blocos · editado agora`, comp: 'Só você' }, ...ps])
            aviso('Painel salvo em Meus painéis', novo ? `“${nome}” com ${n} blocos.` : `${n} blocos adicionados a “${nome}”.`)
          }}
        />
      )}
      {modal?.id === 'menuBloco' && (
        <Pop key="menu" ancora={ancora} celular={celular} largura={300} onFechar={fechar}>
          <MenuBloco bloco={modal.bloco} paineis={p.paineis.map((x) => x.nome)} onEscolher={(painel) => aviso(`Bloco adicionado a “${painel}”`, modal.bloco)} onAcao={(a) => (a === 'glossario' ? setModal({ id: 'glossario' }) : aviso(a === 'csv' ? 'Exportando em CSV' : 'Ampliar bloco', a === 'csv' ? modal.bloco : 'Neste protótipo, o bloco não abre em tela cheia.', 'info'))} />
        </Pop>
      )}
      {modal?.id === 'excluir' && (
        <Dialogo key="exc" titulo="Excluir o painel “Olimpíada 2026”?" onFechar={fechar} largura={440} rodape={<Rodape onCancelar={fechar} ok="Excluir painel" perigo onOk={() => (p.setPaineis((ps) => ps.filter((x) => x.nome !== 'Olimpíada 2026')), aviso('Painel excluído', '“Olimpíada 2026” saiu de Meus painéis.'))} />}>
          <p>O painel some para você e para as 6 pessoas com quem foi compartilhado. Os relatórios e os dados não são afetados.</p>
        </Dialogo>
      )}
      {modal?.id === 'perfil' && (
        <Pop key="perfil" ancora={ancora} celular={celular} largura={300} onFechar={fechar} acima>
          <div className="nr-perfil">
            <span className="rx-avatar nr-avatar">{PERFIS[perfil].ini}</span>
            <span>
              <b>{PERFIS[perfil].nome}</b>
              <small>{PERFIS[perfil].email}</small>
            </span>
          </div>
          <p className="nr-pop__tit">Ver como (protótipo)</p>
          {(Object.keys(PERFIS) as Perfil[]).map((k) => (
            <button key={k} className={`nr-opcao ${k === perfil ? 'is-on' : ''}`} onClick={() => p.trocarPerfil(k)}>
              <span className="rx-avatar nr-avatar is-p">{PERFIS[k].ini}</span>
              <span>
                <b>{PERFIS[k].nome}</b>
                <small>{PERFIS[k].papelLongo}</small>
              </span>
              {k === perfil && <Check size={16} />}
            </button>
          ))}
          <hr />
          <button className="nr-opcao" onClick={() => p.ir({ id: 'estrutura' })}>
            <Info size={16} /> <span>Estrutura e permissões</span>
          </button>
          <button className="nr-opcao" onClick={() => p.ir({ id: 'migracao' })}>
            <Lock size={16} /> <span>Painel interno · migração dos BIs</span>
          </button>
        </Pop>
      )}
    </AnimatePresence>
  )
}

function PopTipoAtiv({ ancora, celular, perfil, atual, onFechar, onEscolher }: { ancora: DOMRect | null; celular: boolean; perfil: Perfil; atual: string | null; onFechar: () => void; onEscolher: (t: string) => void }) {
  return (
    <Pop ancora={ancora} celular={celular} largura={340} onFechar={onFechar}>
      <p className="nr-pop__tit">Tipo de atividade</p>
      <div className="nr-pop__rola is-alta">
        {TIPOS_A.map(([t, ic], i) => {
          const n = N_A[perfil][i]
          return (
            <button key={t} className={`nr-opcao ${t === atual ? 'is-on' : ''}`} disabled={!n} onClick={() => onEscolher(t)}>
              <Ic n={ic} />
              <span>
                <b>{t}</b>
                <small>{n ?? 'Nenhuma nas suas turmas'}</small>
              </span>
              {t === atual ? <Check size={16} /> : <ChevronRight size={16} />}
            </button>
          )
        })}
      </div>
    </Pop>
  )
}

function PopAtividade({ ancora, celular, perfil, tipo, atual, onFechar, onTrocarTipo, onAbrir, onFora }: { ancora: DOMRect | null; celular: boolean; perfil: Perfil; tipo: string; atual: string | null; onFechar: () => void; onTrocarTipo: () => void; onAbrir: (r: string) => void; onFora: () => void }) {
  const [q, setQ] = useState('')
  const ic = TIPOS_A.find((t) => t[0] === tipo)?.[1] ?? 'list-checks'
  const todas = ATIVIDADES_DO_TIPO(perfil, tipo)
  const lista = todas.filter(([n]) => n.toLowerCase().includes(q.toLowerCase()))
  const marcada = (n: string, r: string | null) => !!atual && !!r && (atual === n || RELS[r]?.ent[0] === atual)
  return (
    <Pop ancora={ancora} celular={celular} largura={420} onFechar={onFechar}>
      <div className="nr-pop__tipo">
        <Ic n={ic} />
        <b>{tipo}</b>
        <button className="nr-link" onClick={onTrocarTipo}>
          Trocar tipo
        </button>
      </div>
      {todas.length > 4 && (
        <label className="nr-busca is-cheia">
          <Search size={15} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Buscar ${tipo === 'Redação' ? 'proposta' : 'atividade'}...`} aria-label="Buscar atividade" />
        </label>
      )}
      <p className="nr-pop__tit">Atividade</p>
      <div className="nr-pop__rola">
        {lista.map(([n, s, r]) => (
          <button key={n} className={`nr-opcao ${marcada(n, r) ? 'is-on' : ''}`} onClick={() => (r ? onAbrir(r) : onFora())}>
            <span>
              <b>{n}</b>
              {s && <small>{s}</small>}
            </span>
            {marcada(n, r) ? <Check size={16} /> : <ChevronRight size={16} />}
          </button>
        ))}
        {!lista.length && <small className="nr-pop__nota">Nenhuma atividade encontrada.</small>}
      </div>
    </Pop>
  )
}

function PopOnde({ ancora, celular, perfil, onFechar, onAplicar }: { ancora: DOMRect | null; celular: boolean; perfil: Perfil; onFechar: () => void; onAplicar: (e: string) => void }) {
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(perfil === 'gestora' ? 'Rede Municipal de Nova Esperança' : 'EM Jardim das Flores')
  const escolas: [string, string][] = perfil === 'gestora' ? [['EM Ana Néri', '8 turmas'], ['EM Castro Alves', '10 turmas'], ['EM Cecília Meireles', '9 turmas'], ['EM Jardim das Flores', '9 turmas'], ['EM Monteiro Lobato', '9 turmas'], ['EM Paulo Freire', '8 turmas']] : [['EM Jardim das Flores', perfil === 'prof' ? 'Turmas 701, 702 e 801' : '9 turmas']]
  const lista = escolas.filter(([e]) => e.toLowerCase().includes(q.toLowerCase()))
  return (
    <Pop ancora={ancora} celular={celular} largura={400} onFechar={onFechar}>
      <label className="nr-busca is-cheia">
        <Search size={15} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar escola, turma, professor ou estudante..." aria-label="Buscar recorte" />
      </label>
      <div className="nr-pop__rola">
        {perfil === 'gestora' && (
          <button className={`nr-opcao ${sel.startsWith('Rede') ? 'is-on' : ''}`} onClick={() => setSel('Rede Municipal de Nova Esperança')}>
            <Ic n="house" />
            <span>
              <b>Rede Municipal de Nova Esperança</b>
              <small>18 escolas</small>
            </span>
            {sel.startsWith('Rede') && <Check size={16} />}
          </button>
        )}
        {lista.map(([e, s]) => (
          <button key={e} className={`nr-opcao is-recuo ${sel === e ? 'is-on' : ''}`} onClick={() => setSel(e)}>
            <Ic n="school" />
            <span>
              <b>{e}</b>
              <small>{s}</small>
            </span>
            {sel === e && <Check size={16} />}
          </button>
        ))}
        {perfil === 'gestora' && !q && <button className="nr-link is-recuo">Ver as 18 escolas</button>}
      </div>
      <small className="nr-pop__nota">Para ver um estudante, abra a turma e escolha na lista. Você só vê o que o seu acesso permite.</small>
      <div className="nr-pop__rodape">
        <Rodape onCancelar={onFechar} ok="Aplicar" onOk={() => onAplicar(sel)} />
      </div>
    </Pop>
  )
}

const MES_INFO: [string, number, number][] = [
  ['Outubro de 2026', 31, 4],
  ['Novembro de 2026', 30, 0],
]
function PopPeriodo({ ancora, celular, periodo, onFechar, onAplicar }: { ancora: DOMRect | null; celular: boolean; periodo: string; onFechar: () => void; onAplicar: (s: string) => void }) {
  const [txt, setTxt] = useState(periodo)
  const [ini, setIni] = useState<[number, number] | null>(null)
  const [fim, setFim] = useState<[number, number] | null>(null)
  const pre: [string, string][] = [['Últimos 7 dias', '20/11/2026 – 26/11/2026'], ['Últimos 30 dias', '28/10/2026 – 26/11/2026'], ['Últimos 60 dias', '28/09/2026 – 26/11/2026'], ['Últimos 90 dias', '29/08/2026 – 26/11/2026'], ['Ano letivo 2026', '01/02/2026 – 26/11/2026']]
  const d2 = (n: number) => String(n).padStart(2, '0')
  const clicar = (m: number, d: number) => {
    if (!ini || fim) {
      setIni([m, d])
      setFim(null)
      setTxt(`${d2(d)}/${m === 0 ? '10' : '11'}/2026 – …`)
    } else {
      let a = ini
      let b: [number, number] = [m, d]
      if (b[0] * 40 + b[1] < a[0] * 40 + a[1]) [a, b] = [b, a]
      setIni(a)
      setFim(b)
      setTxt(`${d2(a[1])}/${a[0] === 0 ? '10' : '11'}/2026 – ${d2(b[1])}/${b[0] === 0 ? '10' : '11'}/2026`)
    }
  }
  const noIntervalo = (m: number, d: number) => {
    if (!ini) return false
    const v = m * 40 + d
    const a = ini[0] * 40 + ini[1]
    const b = fim ? fim[0] * 40 + fim[1] : a
    return v >= a && v <= b
  }
  return (
    <Pop ancora={ancora} celular={celular} largura={720} onFechar={onFechar}>
      <div className="nr-periodo">
        <div className="nr-periodo__pre">
          {pre.map(([t, v]) => (
            <button key={t} className={`nr-opcao ${txt === v ? 'is-on' : ''}`} onClick={() => (setTxt(v), setIni(null), setFim(null))}>
              <span>
                <b>{t}</b>
              </span>
            </button>
          ))}
          <button className={`nr-opcao ${ini ? 'is-on' : ''}`}>
            <span>
              <b>Personalizado</b>
            </span>
          </button>
        </div>
        <div className="nr-periodo__cal">
          {MES_INFO.map(([nome, dias, ini0], m) => (
            <div key={nome} className="nr-cal">
              <b>{nome}</b>
              <div className="nr-cal__grade">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                  <small key={i}>{d}</small>
                ))}
                {Array.from({ length: ini0 }, (_, i) => (
                  <span key={'v' + i} />
                ))}
                {Array.from({ length: dias }, (_, i) => (
                  <button key={i} className={noIntervalo(m, i + 1) ? 'is-on' : ''} onClick={() => clicar(m, i + 1)} disabled={m === 1 && i + 1 > 26}>
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="nr-pop__rodape">
        <b className="nr-periodo__txt">{txt}</b>
        <Rodape onCancelar={onFechar} ok="Aplicar" onOk={() => onAplicar(txt)} desab={txt.endsWith('…')} />
      </div>
    </Pop>
  )
}

function Glossario() {
  const [q, setQ] = useState('')
  const lista = GLOSSARIO.filter(([t, c, d]) => (t + c + d).toLowerCase().includes(q.toLowerCase()))
  return (
    <>
      <label className="nr-busca is-cheia">
        <Search size={15} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar indicador..." aria-label="Buscar indicador" />
      </label>
      <div className="nr-glossario">
        {lista.map(([t, c, d, calc, val]) => (
          <div key={t} className="nr-glos">
            <p>
              <b>{t}</b> <Badge t={c} tom={c === 'Engajamento' ? 'inf' : c === 'Aprendizagem' ? 'av' : c === 'Atividades' ? 'suc' : 'neutro'} /> {val && <Badge t="Em validação" tom="at" />}
            </p>
            <p>{d}</p>
            {calc && (
              <small>
                <b>Cálculo:</b> {calc}
              </small>
            )}
          </div>
        ))}
        {lista.length === 0 && <p className="nr-vazio">Nenhum indicador para “{q}”.</p>}
      </div>
    </>
  )
}

const GRUPOS_FILTRO: [string, string[], boolean?][] = [
  ['Componente curricular', ['Matemática', 'Língua Portuguesa', 'Ciências', 'História', 'Geografia']],
  ['Ano escolar', ['4º ano', '5º ano', '6º ano', '7º ano', '8º ano', '9º ano']],
  ['Situação do estudante', ['Todos', 'Só ativos', 'Só inativos'], true],
  ['Turno', ['Manhã', 'Tarde', 'Integral']],
]
function Filtros({ onFechar, onAplicar, n }: { onFechar: () => void; onAplicar: (n: number) => void; n: number }) {
  const [sel, setSel] = useState<Record<string, string[]>>(n ? { 'Componente curricular': ['Matemática'], 'Ano escolar': ['7º ano'] } : {})
  const [sit, setSit] = useState('Todos')
  const total = Object.values(sel).reduce((s, v) => s + v.length, 0) + (sit !== 'Todos' ? 1 : 0)
  const alterna = (g: string, v: string) => setSel((s) => ({ ...s, [g]: (s[g] ?? []).includes(v) ? s[g].filter((x) => x !== v) : (s[g] ?? []).concat([v]) }))
  return (
    <Dialogo
      titulo="Filtros"
      sub="Valem para todos os blocos desta tela."
      onFechar={onFechar}
      lado
      largura={420}
      rodape={
        <>
          <button className="nr-btn is-contorno" onClick={() => (setSel({}), setSit('Todos'))}>
            Limpar
          </button>
          <button className="nr-btn is-primario" onClick={() => onAplicar(total)}>
            Aplicar filtros{total ? ` (${total})` : ''}
          </button>
        </>
      }
    >
      {GRUPOS_FILTRO.map(([g, ops, radio]) => (
        <div key={g} className="nr-filtro">
          <b>{g}</b>
          <div className="nr-chips">
            {ops.map((o) => {
              const on = radio ? sit === o : (sel[g] ?? []).includes(o)
              return (
                <button key={o} className={on ? 'is-on' : ''} onClick={() => (radio ? setSit(o) : alterna(g, o))} aria-pressed={on}>
                  {on && <Check size={14} />} {o}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </Dialogo>
  )
}

function Compartilhar({ onFechar, onCopiar, onConcluir }: { onFechar: () => void; onCopiar: () => void; onConcluir: () => void }) {
  const [pessoas, setPessoas] = useState<[string, string, string][]>([
    ['CN', 'Carla Nogueira', 'Coordenadora · EM Jardim das Flores'],
    ['RS', 'Rafael Souza', 'Professor · EM Jardim das Flores'],
    ['SE', 'Equipe da Secretaria', '12 pessoas · gestores de rede'],
  ])
  const [q, setQ] = useState('')
  return (
    <Dialogo titulo="Compartilhar relatório" sub="Quem recebe vê só os dados do próprio acesso: um professor verá apenas as turmas dele." onFechar={onFechar} largura={520} rodape={<button className="nr-btn is-primario" onClick={onConcluir}>Concluir</button>}>
      <b className="nr-rot">Adicionar pessoas</b>
      <div className="nr-linha-form">
        <label className="nr-busca is-cheia">
          <Search size={15} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nome ou e-mail" aria-label="Nome ou e-mail" onKeyDown={(e) => e.key === 'Enter' && q.trim() && (setPessoas((p) => p.concat([[q.slice(0, 2).toUpperCase(), q, 'Convite enviado']])), setQ(''))} />
        </label>
        <button className="nr-btn is-contorno" disabled={!q.trim()} onClick={() => (setPessoas((p) => p.concat([[q.slice(0, 2).toUpperCase(), q, 'Convite enviado']])), setQ(''))}>
          Adicionar
        </button>
      </div>
      <div className="nr-pessoas">
        {pessoas.map(([i, n, s]) => (
          <div key={n} className="nr-pessoa">
            <span className="rx-avatar nr-avatar is-p">{i}</span>
            <span>
              <b>{n}</b>
              <small>{s}</small>
            </span>
            <Badge t="Pode ver" tom="neutro" />
          </div>
        ))}
      </div>
      <b className="nr-rot">Link do relatório</b>
      <div className="nr-linha-form">
        <code className="nr-link-box">educadores.jovensgenios.com/relatorios/rede/visao-geral</code>
        <button className="nr-btn is-contorno" onClick={onCopiar}>
          <Copy size={16} /> Copiar link
        </button>
      </div>
    </Dialogo>
  )
}

function Exportar({ rel, aba, periodo, onFechar, onExportar }: { rel: Rel | null; aba: string; periodo: string; onFechar: () => void; onExportar: (f: string) => void }) {
  const [fmt, setFmt] = useState('CSV')
  const [escopo, setEscopo] = useState('atual')
  const [nomes, setNomes] = useState(true)
  return (
    <Dialogo titulo="Exportar relatório" sub={`${rel?.ent[0] ?? 'Rede Municipal de Nova Esperança'} · ${periodo}`} onFechar={onFechar} largura={520} rodape={<Rodape onCancelar={onFechar} ok="Exportar" onOk={() => onExportar(fmt)} />}>
      <b className="nr-rot">Formato</b>
      <div className="nr-radios">
        {[
          ['CSV', 'Para planilhas; uma tabela por bloco'],
          ['XLSX', 'Uma aba por bloco'],
          ['PDF', 'Relatório com gráficos, pronto para imprimir'],
        ].map(([f, d]) => (
          <button key={f} className={`nr-radio ${fmt === f ? 'is-on' : ''}`} onClick={() => setFmt(f)} aria-pressed={fmt === f}>
            <i />
            <span>
              <b>{f}</b>
              <small>{d}</small>
            </span>
          </button>
        ))}
      </div>
      <b className="nr-rot">O que exportar</b>
      <div className="nr-radios is-linha">
        <button className={`nr-radio ${escopo === 'atual' ? 'is-on' : ''}`} onClick={() => setEscopo('atual')}>
          <i />
          <b>Aba atual ({aba})</b>
        </button>
        <button className={`nr-radio ${escopo === 'todas' ? 'is-on' : ''}`} onClick={() => setEscopo('todas')}>
          <i />
          <b>Todas as abas</b>
        </button>
      </div>
      <button className={`nr-check ${nomes ? 'is-on' : ''}`} onClick={() => setNomes(!nomes)} aria-pressed={nomes}>
        <i>{nomes && <Check size={13} />}</i> Incluir nomes de estudantes
      </button>
    </Dialogo>
  )
}

/** Blocos do relatório atual (os mesmos que viram blocos do painel). */
const blocosDe = (rel: Rel | null, aba: string): string[] => {
  if (!rel) return ['Indicadores-chave']
  const out: string[] = []
  for (const it of rel.T[aba] ?? []) {
    if (it[0] === 'kpis') out.push('Indicadores-chave')
    if (it[0] === 'row') for (const b of it[1]) if (b.titulo && b.titulo !== 'Como ler os quadrantes') out.push(b.titulo)
    if (it[0] === 'tab') out.push(it[1].titulo)
  }
  return out
}
function SalvarPainel({ rel, aba, paineis, onFechar, onSalvar }: { rel: Rel | null; aba: string; paineis: typeof PAINEIS; onFechar: () => void; onSalvar: (nome: string, n: number, novo: boolean) => void }) {
  const blocos = blocosDe(rel, aba)
  const [nome, setNome] = useState('Reunião da rede · dezembro')
  const [onde, setOnde] = useState<'novo' | 'existente'>('novo')
  const [existente, setExistente] = useState(paineis[1]?.nome ?? paineis[0]?.nome)
  const [marcados, setMarcados] = useState<string[]>(blocos)
  return (
    <Dialogo
      titulo="Salvar como painel"
      sub={`O painel guarda o recorte atual (${rel?.ent[0] ?? 'Rede Municipal de Nova Esperança'}) e o período.`}
      onFechar={onFechar}
      largura={540}
      rodape={<Rodape onCancelar={onFechar} ok="Salvar painel" desab={!marcados.length || (onde === 'novo' && !nome.trim())} onOk={() => onSalvar(onde === 'novo' ? nome.trim() : existente, marcados.length, onde === 'novo')} />}
    >
      <label className="nr-campo">
        <b className="nr-rot">Nome do painel</b>
        <input value={nome} onChange={(e) => setNome(e.target.value)} disabled={onde !== 'novo'} />
      </label>
      <b className="nr-rot">Onde salvar</b>
      <div className="nr-radios is-linha">
        <button className={`nr-radio ${onde === 'novo' ? 'is-on' : ''}`} onClick={() => setOnde('novo')}>
          <i />
          <b>Novo painel</b>
        </button>
        <button className={`nr-radio ${onde === 'existente' ? 'is-on' : ''}`} onClick={() => setOnde('existente')}>
          <i />
          <b>Painel existente</b>
        </button>
      </div>
      {onde === 'existente' && (
        <label className="nr-campo">
          <select value={existente} onChange={(e) => setExistente(e.target.value)}>
            {paineis.map((x) => (
              <option key={x.nome}>{x.nome}</option>
            ))}
          </select>
        </label>
      )}
      <b className="nr-rot">
        Blocos deste relatório ({marcados.length} de {blocos.length})
      </b>
      <div className="nr-checks">
        {blocos.map((b) => {
          const on = marcados.includes(b)
          return (
            <button key={b} className={`nr-check ${on ? 'is-on' : ''}`} onClick={() => setMarcados((m) => (on ? m.filter((x) => x !== b) : m.concat([b])))} aria-pressed={on}>
              <i>{on && <Check size={13} />}</i> {b}
            </button>
          )
        })}
      </div>
    </Dialogo>
  )
}

function MenuBloco({ bloco, paineis, onEscolher, onAcao }: { bloco: string; paineis: string[]; onEscolher: (p: string) => void; onAcao: (a: 'csv' | 'glossario' | 'ampliar') => void }) {
  const [sub, setSub] = useState(false)
  return !sub ? (
    <div className="nr-menu is-solto">
      <button onClick={() => setSub(true)}>
        <LayoutGrid size={15} /> Adicionar a um painel <ChevronRight size={15} className="nr-dir" />
      </button>
      <button onClick={() => onAcao('csv')}>
        <Download size={15} /> Exportar CSV
      </button>
      <button onClick={() => onAcao('glossario')}>
        <BookOpen size={15} /> Ver no glossário
      </button>
      <button onClick={() => onAcao('ampliar')}>
        <Maximize2 size={15} /> Ampliar
      </button>
    </div>
  ) : (
    <div className="nr-menu is-solto">
      <small className="nr-pop__nota">Adicionar “{bloco}” a</small>
      {paineis.map((p) => (
        <button key={p} onClick={() => onEscolher(p)}>
          <LayoutGrid size={15} /> {p}
        </button>
      ))}
      <button onClick={() => onEscolher('Novo painel')}>
        <Plus size={15} /> Novo painel
      </button>
    </div>
  )
}
