// Campeonato GenieX: navegável construído a partir das telas do Figma (rXH2XCv3MCabtDHDawkJad) e do PRD v1.0.
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, BookOpen, Bot, Building2, Calendar, CheckCircle2, CircleHelp, Clock, FileCheck2, Flag, Flame, GraduationCap, House, Info, LogOut, Menu, MessageSquare, PanelLeft, PenLine, Route, Search, Swords, TriangleAlert, Trophy, UserX, X, type LucideIcon } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { PrototypeProps } from '../../platform/journeys'
import '../batalhas-vs-geniex/bat.css'
import './cp.css'
import type { Ctx, Modal, Tela, Toast } from './ctx'
import { SEM_CONTEUDO, aluno, primeiro, type Selecao } from './data'
import { batalhaSemVencedor, batalhasIniciais, meusNumeros, ranking, sortear, type Batalha } from './logica'
import { Btn } from './pecas'
import { Disciplinas, Oponente, Quiz, Resultado, Resumo, Revisao } from './telas-batalha'
import { Batalhas, Historico, Lista, Ranking, Regras, Visao } from './telas-copa'

type Inicial = { tela: Tela; vazia?: boolean; encerrada?: boolean; atual?: string; op?: string; sel?: Selecao[]; novaQuiz?: boolean; modal?: Modal }
const SEL: Selecao[] = [{ disciplina: 'matematica', topico: 'Funções do 2º grau' }, { disciplina: 'fisica', topico: 'Leis de Newton' }]
const ATALHOS: Record<string, Inicial> = {
  lista: { tela: 'lista' },
  'lista-vazia': { tela: 'lista', vazia: true },
  visao: { tela: 'visao' },
  encerrada: { tela: 'visao', encerrada: true },
  batalhas: { tela: 'batalhas' },
  historico: { tela: 'historico' },
  ranking: { tela: 'ranking' },
  regras: { tela: 'regras' },
  oponente: { tela: 'oponente', op: 'bruno' },
  disciplinas: { tela: 'disciplinas', op: 'bruno', sel: SEL },
  resumo: { tela: 'resumo', op: 'bruno', sel: SEL },
  quiz: { tela: 'quiz', op: 'bruno', sel: SEL, novaQuiz: true },
  aguardando: { tela: 'resultado', atual: 'b-carla' },
  vitoria: { tela: 'resultado', atual: 'b-gabriel' },
  empate: { tela: 'resultado', atual: 'b-rafaela' },
  derrota: { tela: 'resultado', atual: 'b-ana' },
  wo: { tela: 'resultado', atual: 'b-daniel' },
  'sem-vencedor': { tela: 'resultado', atual: 'b-pedro-fim', encerrada: true },
  revisao: { tela: 'revisao', atual: 'b-gabriel' },
  sair: { tela: 'quiz', op: 'bruno', sel: SEL, novaQuiz: true, modal: 'sair' },
  'tempo-esgotado': { tela: 'resultado', atual: 'b-carla', modal: 'tempo' },
  'conteudo-indisponivel': { tela: 'resumo', op: 'bruno', sel: [SEL[0], { disciplina: 'fisica', topico: SEM_CONTEUDO }], modal: 'conteudo' },
  'copa-encerrada': { tela: 'resumo', op: 'bruno', sel: SEL, modal: 'encerrada' },
  'oponente-indisponivel': { tela: 'resumo', op: 'bruno', sel: SEL, modal: 'oponente' },
}
const nova = (op: string, sel: Selecao[]): Batalha => ({ id: 'b-' + Date.now(), oponente: op, origem: 'enviada', criadaEm: Date.now(), selecoes: sel, questoes: sortear(sel), minhas: null, tempos: [], placarOp: null })

export default function CampeonatoGeniex({ startScreen }: PrototypeProps) {
  const ini = ATALHOS[startScreen ?? ''] ?? ATALHOS.lista
  const base = useMemo(() => {
    const bs = batalhasIniciais()
    if (ini.atual === 'b-pedro-fim') bs.unshift(batalhaSemVencedor())
    let atual = ini.atual ?? null
    if (ini.novaQuiz) {
      const b = nova(ini.op!, ini.sel!)
      bs.unshift(b)
      atual = b.id
    }
    return { bs, atual }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [tela, setTela] = useState<Tela>(ini.tela)
  const [hist, setHist] = useState<Tela[]>([])
  const [bs, setBs] = useState<Batalha[]>(base.bs)
  const [atualId, setAtualId] = useState<string | null>(base.atual)
  const [op, setOp] = useState<string | null>(ini.op ?? null)
  const [sel, setSel] = useState<Selecao[]>(ini.sel ?? [])
  const [modal, setModal] = useState<Modal>(ini.modal ?? null)
  const [toast, setToast] = useState<Toast | null>(null)
  const [quizKey, setQuizKey] = useState(0)
  const [gaveta, setGaveta] = useState(false)
  const larga = useMidia('(min-width: 1200px)')
  const celular = useMidia('(max-width: 767px)')
  const [recolherManual, setRecolherManual] = useState<boolean | null>(null)
  const recolhida = !celular && (recolherManual ?? !larga)
  const rascunho = useRef({ rs: [] as (number | null)[], tempos: [] as number[] })
  const encerrada = !!ini.encerrada

  useEffect(() => {
    document.title = 'Campeonato · GenieX · Protótipo Jovens Gênios'
  }, [])
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3600)
    return () => clearTimeout(t)
  }, [toast])
  useEffect(() => {
    if (!modal || modal === 'tempo') return
    const h = (e: KeyboardEvent) => e.key === 'Escape' && setModal(null)
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [modal])

  const ir = (t: Tela) => {
    setHist((h) => (t === tela ? h : [...h.slice(-20), tela]))
    setTela(t)
    setModal(null)
    setGaveta(false)
    document.querySelector('.bt-rolagem')?.scrollTo({ top: 0 })
  }
  const voltar = () => {
    const anterior = [...hist].reverse().find((t) => t !== 'quiz')
    if (!anterior) return ir(tela === 'lista' ? 'lista' : tela === 'visao' ? 'lista' : 'visao')
    setHist((h) => h.slice(0, h.lastIndexOf(anterior)))
    setTela(anterior)
    document.querySelector('.bt-rolagem')?.scrollTo({ top: 0 })
  }
  const fora = (n: string) => {
    setGaveta(false)
    setToast({ tipo: 'info', titulo: n, texto: `“${n}” não faz parte deste protótipo.` })
  }
  const atual = bs.find((b) => b.id === atualId)
  const atualiza = (id: string, f: (b: Batalha) => Batalha) => setBs((v) => v.map((b) => (b.id === id ? f(b) : b)))
  const numeros = useMemo(() => meusNumeros(bs), [bs])
  const rank = useMemo(() => ranking(bs), [bs])

  const fimQuiz = (rs: (number | null)[], tempos: number[], esgotou?: boolean) => {
    if (!atual) return
    const b = atual
    atualiza(b.id, (x) => ({ ...x, minhas: x.questoes.map((_, i) => rs[i] ?? null), tempos: x.questoes.map((_, i) => tempos[i] ?? 0) }))
    ir('resultado')
    if (esgotou) setModal('tempo')
    else if (b.origem === 'enviada') setToast({ tipo: 'ok', titulo: `Desafio enviado para ${primeiro(b.oponente)}!`, texto: `${primeiro(b.oponente)} tem até 24 h para responder. Avisaremos quando o resultado sair.` })
  }

  const c: Ctx = {
    ir,
    voltar,
    avisar: setToast,
    celular,
    modalAberto: !!modal,
    rascunho: rascunho.current,
    vazia: !!ini.vazia,
    encerrada,
    batalhas: bs,
    numeros,
    rank,
    atual,
    quizKey,
    op,
    sel,
    escolherOponente: setOp,
    definirSel: setSel,
    desafiar: (id) => {
      setOp(id)
      setSel([])
      ir('disciplinas')
    },
    novaBatalha: () => {
      if (encerrada) return setModal('encerrada')
      setOp(null)
      setSel([])
      ir('oponente')
    },
    iniciar: () => {
      if (encerrada) return setModal('encerrada')
      if (sel.some((s) => s.topico === SEM_CONTEUDO)) return setModal('conteudo')
      const b = nova(op!, sel)
      setBs((v) => [b, ...v])
      setAtualId(b.id)
      setQuizKey((k) => k + 1)
      ir('quiz')
    },
    responder: (id) => {
      setAtualId(id)
      setQuizKey((k) => k + 1)
      ir('quiz')
    },
    abrir: (id, t = 'resultado') => {
      setAtualId(id)
      ir(t)
    },
    fimQuiz,
    pedirSair: () => setModal('sair'),
    simular: (tipo) => {
      if (!atual) return
      if (tipo === 'prazo') atualiza(atual.id, (b) => ({ ...b, fim: 'wo' }))
      else atualiza(atual.id, (b) => ({ ...b, placarOp: 4 + Math.floor(Math.random() * 6) }))
      document.querySelector('.bt-rolagem')?.scrollTo({ top: 0, behavior: 'smooth' })
    },
  }

  const vistaOk = (tela !== 'quiz' && tela !== 'resultado' && tela !== 'revisao') || (atual && (tela === 'quiz' || atual.minhas))
  const MODAIS: Record<Exclude<Modal, null>, { icone: LucideIcon; cor: string; titulo: string; texto: string[]; acoes: [string, 'default' | 'outline' | 'destructive', () => void][]; fixo?: boolean }> = {
    sair: { icone: LogOut, cor: 'is-vermelho', titulo: 'Sair da batalha?', texto: [`Se você sair agora, sua participação será encerrada e as ${10 - rascunho.current.rs.filter((x) => x !== null).length} questões sem resposta vão contar como erradas.`, 'Não será possível voltar a esta batalha.'], acoes: [['Continuar respondendo', 'outline', () => setModal(null)], ['Sair e encerrar', 'destructive', () => fimQuiz(rascunho.current.rs, rascunho.current.tempos)]] },
    tempo: { icone: Clock, cor: 'is-ambar', fixo: true, titulo: 'O tempo acabou!', texto: ['Os 10 minutos terminaram e sua participação foi encerrada. As respostas que você marcou foram registradas.', 'As questões sem resposta contam como erradas.'], acoes: [['Ver meu resultado', 'default', () => setModal(null)]] },
    conteudo: { icone: TriangleAlert, cor: 'is-ambar', titulo: 'Não há questões suficientes', texto: [`Física · ${SEM_CONTEUDO} ainda não tem questões suficientes para montar a batalha (pelo menos 3 por tópico).`, 'Escolha outro tópico para continuar.'], acoes: [['Cancelar', 'outline', () => setModal(null)], ['Escolher outro tópico', 'default', () => ir('disciplinas')]] },
    encerrada: { icone: Flag, cor: 'is-cinza', titulo: 'A Copa terminou', texto: ['A Copa GenieX · 1º ano foi encerrada em 30 nov., às 23h59, e não é possível iniciar novas batalhas.', 'Seus resultados e a classificação final continuam disponíveis.'], acoes: [['Ver classificação final', 'default', () => ir('ranking')]] },
    oponente: { icone: UserX, cor: 'is-lav', titulo: `${aluno(op ?? 'bruno').nome.split(' ')[0]} não pode mais participar`, texto: ['O estudante deixou de ser elegível para esta Copa, então a batalha não foi criada.', 'Suas disciplinas e tópicos foram mantidos: é só escolher outro oponente.'], acoes: [['Voltar para a Copa', 'outline', () => ir('visao')], ['Escolher outro oponente', 'default', () => { setOp(null); ir('oponente') }]] },
  }
  const M = modal ? MODAIS[modal] : null

  return (
    <div className={`bt cp ${recolhida ? 'is-recolhida' : ''}`}>
      <Sidebar onFora={fora} onCopa={() => ir('lista')} gaveta={gaveta} onFechar={() => setGaveta(false)} />
      <div className="bt-principal">
        <TopBar onMenu={() => setGaveta(true)} onAlternar={() => setRecolherManual(!recolhida)} recolhida={recolhida} onFora={fora} />
        <main className="bt-rolagem">
          <AnimatePresence mode="wait">
            <motion.div key={tela + quizKey} className="bt-conteudo" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              {vistaOk && (
                <>
                  {tela === 'lista' && <Lista c={c} />}
                  {tela === 'visao' && <Visao c={c} />}
                  {tela === 'batalhas' && <Batalhas c={c} />}
                  {tela === 'historico' && <Historico c={c} />}
                  {tela === 'ranking' && <Ranking c={c} />}
                  {tela === 'regras' && <Regras c={c} />}
                  {tela === 'oponente' && <Oponente c={c} />}
                  {tela === 'disciplinas' && <Disciplinas c={c} />}
                  {tela === 'resumo' && <Resumo c={c} />}
                  {tela === 'quiz' && <Quiz c={c} />}
                  {tela === 'resultado' && <Resultado c={c} />}
                  {tela === 'revisao' && <Revisao c={c} />}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {M && (
          <motion.div key="veu" className="bt-veu is-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !M.fixo && setModal(null)}>
            <motion.div className="bt-modal cp-modal" role="dialog" aria-modal="true" aria-labelledby="cp-modal-t" initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8 }} onClick={(e) => e.stopPropagation()}>
              <div className="cp-modal__topo">
                <span className={`bt-tile ${M.cor}`}>
                  <M.icone size={24} />
                </span>
                {!M.fixo && (
                  <button className="bt-icone-btn is-sm" aria-label="Fechar" onClick={() => setModal(null)}>
                    <X size={20} />
                  </button>
                )}
              </div>
              <h2 id="cp-modal-t" className="bt-h3">
                {M.titulo}
              </h2>
              {M.texto.map((t) => (
                <p key={t}>{t}</p>
              ))}
              <div className={`bt-modal__acoes ${M.acoes.length > 1 ? 'is-sair' : ''}`}>
                {M.acoes.map(([t, v, fn]) => (
                  <Btn key={t} v={v} onClick={fn}>
                    {t === 'Sair e encerrar' && <LogOut size={18} />} {t}
                  </Btn>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {toast && (
          <>
            <motion.div key="veu-aviso" className="bt-veu is-aviso" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.div key="aviso" className={`bt-toast is-${toast.tipo}`} role="status" initial={{ opacity: 0, y: 16, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 16, x: '-50%' }}>
              {toast.tipo === 'ok' ? <CheckCircle2 size={22} /> : toast.tipo === 'alerta' ? <TriangleAlert size={22} /> : <Info size={22} />}
              <span>
                <b>{toast.titulo}</b>
                <small>{toast.texto}</small>
              </span>
              <button className="bt-icone-btn is-sm" aria-label="Fechar aviso" onClick={() => setToast(null)}>
                <X size={18} />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ---------------------------------------------------------------- shell (Style Guide GenieX) */
const NAV: [string, LucideIcon][][] = [
  [['Página Inicial', House], ['Ranking', Trophy]],
  [['Trilhas', Route], ['Cursos', GraduationCap], ['Biblioteca', BookOpen], ['Cronograma', Calendar], ['Instituição', Building2], ['Genie Bot', Bot]],
  [['Simulados', FileCheck2], ['Campeonatos', Trophy], ['Batalhas', Swords], ['Redação', PenLine]],
]
function useMidia(q: string) {
  const [ok, setOk] = useState(() => window.matchMedia(q).matches)
  useEffect(() => {
    const m = window.matchMedia(q)
    const on = () => setOk(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [q])
  return ok
}
function Sidebar({ onFora, onCopa, gaveta, onFechar }: { onFora: (n: string) => void; onCopa: () => void; gaveta: boolean; onFechar: () => void }) {
  return (
    <>
      <AnimatePresence>{gaveta && <motion.div className="bt-veu is-gaveta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onFechar} />}</AnimatePresence>
      <aside className={`bt-side ${gaveta ? 'is-aberta' : ''}`}>
        <div className="bt-logo">
          <img className="bt-logo__completo" src="./camp/logo-light.svg" alt="GenieX" />
          <img className="bt-logo__icone" src="./camp/logo-light.svg" alt="GenieX" />
          <button className="bt-side__fechar bt-icone-btn is-sm" onClick={onFechar} aria-label="Fechar menu">
            <X size={20} />
          </button>
        </div>
        <nav className="bt-nav">
          {NAV.map((g, i) => (
            <div key={i} className="bt-nav__grupo">
              {i === 1 && <p className="bt-nav__titulo">Aprenda</p>}
              {i === 2 && <p className="bt-nav__titulo">Funcionalidades</p>}
              {g.map(([n, I]) => (
                <button key={n} className={`bt-nav__item ${n === 'Campeonatos' ? 'is-ativo' : ''}`} aria-current={n === 'Campeonatos' ? 'page' : undefined} onClick={() => (n === 'Campeonatos' ? onCopa() : onFora(n))} title={n}>
                  <I size={20} strokeWidth={1.8} />
                  <span>{n}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>
        <button className="bt-perfil" onClick={() => onFora('Meu perfil')}>
          <img src="./camp/av-mariana.webp" alt="" />
          <span>
            <b>Mariana Alves</b>
            <small>1º ano A · Escola GenieX</small>
          </span>
          <span className="bt-perfil__mais">•••</span>
        </button>
      </aside>
    </>
  )
}
function TopBar({ onMenu, onAlternar, recolhida, onFora }: { onMenu: () => void; onAlternar: () => void; recolhida: boolean; onFora: (n: string) => void }) {
  const rotulo = recolhida ? 'Expandir menu' : 'Recolher menu'
  return (
    <header className="bt-top">
      <button className="bt-icone-btn bt-top__menu" onClick={onMenu} aria-label="Abrir menu">
        <Menu size={20} />
      </button>
      <button className={`bt-icone-btn bt-top__painel ${recolhida ? 'is-on' : ''}`} onClick={onAlternar} aria-label={rotulo} title={rotulo} aria-pressed={recolhida}>
        <PanelLeft size={20} />
      </button>
      <button className="bt-busca" onClick={() => onFora('Pesquisar')}>
        <Search size={18} />
        <span>Pesquisar</span>
        <kbd>⌘ + K</kbd>
      </button>
      <img className="bt-top__logo" src="./camp/logo-light.svg" alt="GenieX" />
      <div className="bt-top__acoes">
        <button className="bt-ofensiva" onClick={() => onFora('Ofensiva')}>
          <Flame size={18} /> 0
        </button>
        <span className="bt-sep" />
        <button className="bt-icone-btn is-azul" onClick={() => onFora('Genie Bot')} aria-label="Genie Bot">
          <MessageSquare size={20} />
        </button>
        <button className="bt-icone-btn" onClick={() => onFora('Notificações')} aria-label="Notificações">
          <Bell size={20} />
          <i className="bt-contador">2</i>
        </button>
        <button className="bt-icone-btn" onClick={() => onFora('Ajuda')} aria-label="Ajuda">
          <CircleHelp size={20} />
        </button>
      </div>
    </header>
  )
}
