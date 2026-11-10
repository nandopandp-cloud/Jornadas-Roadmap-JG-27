// Batalhas VS GenieX: navegável construído a partir das telas do Figma (inspiração: navegável do Figma Make).
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, BookOpen, Bot, Building2, Calendar, CheckCircle2, CircleHelp, FileCheck2, Flame, GraduationCap, House, Info, LogOut, Menu, MessageSquare, PanelLeft, PenLine, Route, Search, Swords, TriangleAlert, Trophy, X, type LucideIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { PrototypeProps } from '../../platform/journeys'
import './bat.css'
import type { Ctx, Tela, Toast } from './ctx'
import type { DiscId, Questao, Selecao } from './data'
import { SEL_PADRAO, batalhasIniciais, novaVS, situacao, soloPronta, sortearSolo, type BatalhaSolo, type BatalhaVS } from './logica'
import { Btn } from './pecas'
import { Inicio, SoloGabarito, SoloIntro, SoloQuiz, SoloResultado, SoloTopicos } from './telas-solo'
import { VsConfirmar, VsIntro, VsLista, VsOponente, VsQuiz, VsResultado, VsTopicos } from './telas-vs'

type Modal = null | 'reportar' | 'sair-solo' | 'sair-vs'
type Inicial = { tela: Tela; historico?: boolean; soloAtual?: 'win' | 'tie' | 'loss'; vs?: 'novo' | 'topicos' | 'confirmar' | 'recebido' | 'quiz' | 'aguardando' | 'vitoria'; modal?: Modal }
const ATALHOS: Record<string, Inicial> = {
  inicio: { tela: 'inicio' },
  'inicio-historico': { tela: 'inicio', historico: true },
  'solo-intro': { tela: 'solo-intro' },
  'solo-topicos': { tela: 'solo-topicos' },
  'solo-quiz': { tela: 'solo-quiz' },
  'solo-resultado': { tela: 'solo-resultado', soloAtual: 'win' },
  'solo-empate': { tela: 'solo-resultado', soloAtual: 'tie' },
  'solo-derrota': { tela: 'solo-resultado', soloAtual: 'loss' },
  'solo-gabarito': { tela: 'solo-gabarito', soloAtual: 'win' },
  'vs-intro': { tela: 'vs-intro' },
  'vs-oponente': { tela: 'vs-oponente' },
  'vs-topicos': { tela: 'vs-topicos', vs: 'topicos' },
  'vs-confirmar': { tela: 'vs-confirmar', vs: 'confirmar' },
  'vs-recebido': { tela: 'vs-confirmar', vs: 'recebido' },
  'vs-quiz': { tela: 'vs-quiz', vs: 'quiz' },
  'vs-reportar': { tela: 'vs-quiz', vs: 'quiz', modal: 'reportar' },
  'vs-aguardando': { tela: 'vs-resultado', vs: 'aguardando' },
  'vs-resultado': { tela: 'vs-resultado', vs: 'vitoria' },
  'vs-lista': { tela: 'vs-lista' },
}
const SEL_VS: Selecao[] = [
  { disciplina: 'matematica', topico: 'Funções do 1º grau' },
  { disciplina: 'portugues', topico: 'Interpretação de texto' },
  { disciplina: 'historia', topico: 'Brasil Colônia' },
]
const H = 3600 * 1000
function historicoInicial(): BatalhaSolo[] {
  const agora = Date.now()
  return [
    soloPronta(SEL_PADRAO, 8, new Date(agora - 2 * H)),
    soloPronta([{ disciplina: 'biologia', topico: 'Genética' }, { disciplina: 'quimica', topico: 'Tabela periódica' }], 6, new Date(agora - 26 * H)),
    soloPronta([{ disciplina: 'portugues', topico: 'Interpretação de texto' }, { disciplina: 'geografia', topico: 'Cartografia' }, { disciplina: 'fisica', topico: 'Cinemática' }], 4, new Date(agora - 74 * H)),
    soloPronta([{ disciplina: 'matematica', topico: 'Porcentagem' }], 9, new Date(agora - 146 * H)),
  ]
}

export default function BatalhasVS({ startScreen }: PrototypeProps) {
  const ini = ATALHOS[startScreen ?? ''] ?? ATALHOS.inicio
  // estado inicial montado de acordo com o atalho escolhido na plataforma
  const base = useMemo(() => {
    const vs = batalhasIniciais()
    const historico = ini.historico || ini.soloAtual ? historicoInicial() : []
    let soloAtual: string | undefined
    if (ini.soloAtual) {
      const n = { win: 8, tie: 6, loss: 3 }[ini.soloAtual]
      const b = soloPronta(SEL_PADRAO, n, new Date())
      historico.unshift(b)
      soloAtual = b.id
    }
    let vsAtual: string | null = null
    let vsOp: string | null = null
    let vsSel: Selecao[] = []
    if (ini.vs === 'topicos') {
      vsOp = 'felipe'
      vsSel = [SEL_VS[0], SEL_VS[1], { disciplina: 'historia', topico: '' }]
    }
    if (ini.vs === 'confirmar') {
      vsOp = 'felipe'
      vsSel = SEL_VS
    }
    if (ini.vs === 'recebido') vsAtual = 'seed-daniel'
    if (ini.vs === 'vitoria') vsAtual = 'seed-ana'
    if (ini.vs === 'quiz' || ini.vs === 'aguardando') {
      const b = novaVS('felipe', SEL_VS)
      if (ini.vs === 'aguardando') {
        b.respostas = b.questoes.map((q, i) => (i < 7 ? q.correta : (q.correta + 1) % 4))
        b.finalizadaEm = new Date().toISOString()
      }
      vs.unshift(b)
      vsAtual = b.id
    }
    return { vs, historico, soloAtual, vsAtual, vsOp, vsSel }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [tela, setTela] = useState<Tela>(ini.tela)
  const [historico, setHistorico] = useState<BatalhaSolo[]>(base.historico)
  const [soloSel, setSoloSel] = useState<Selecao[]>(SEL_PADRAO)
  const [soloQs, setSoloQs] = useState<Questao[]>(() => sortearSolo(SEL_PADRAO))
  const [soloAtualId, setSoloAtualId] = useState<string | undefined>(base.soloAtual)
  const [vs, setVs] = useState<BatalhaVS[]>(base.vs)
  const [vsAtualId, setVsAtualId] = useState<string | null>(base.vsAtual)
  const [vsOp, setVsOp] = useState<string | null>(base.vsOp)
  const [vsSel, setVsSel] = useState<Selecao[]>(base.vsSel)
  const [vsFoco, setVsFoco] = useState<DiscId | null>(null)
  const [quizKey, setQuizKey] = useState(0)
  const [modal, setModal] = useState<Modal>(ini.modal ?? null)
  const [motivo, setMotivo] = useState<string | null>(null)
  const [toast, setToast] = useState<Toast | null>(null)
  const [gaveta, setGaveta] = useState(false)
  const larga = useMidia('(min-width: 1200px)')
  const celular = useMidia('(max-width: 767px)')
  const [recolherManual, setRecolherManual] = useState<boolean | null>(null)
  const recolhida = !celular && (recolherManual ?? !larga)

  useEffect(() => {
    document.title = 'Batalhas · GenieX · Protótipo Jovens Gênios'
  }, [])
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(t)
  }, [toast])
  useEffect(() => {
    if (!modal) return
    const h = (e: KeyboardEvent) => e.key === 'Escape' && setModal(null)
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [modal])

  const ir = (t: Tela) => {
    setTela(t)
    setModal(null)
    setGaveta(false)
    document.querySelector('.bt-rolagem')?.scrollTo({ top: 0 })
  }
  const fora = (n: string) => {
    setGaveta(false)
    setToast({ tipo: 'info', titulo: n, texto: `“${n}” não faz parte deste protótipo.` })
  }
  const vsAtual = vs.find((b) => b.id === vsAtualId) ?? undefined

  const c: Ctx = {
    ir,
    avisar: setToast,
    modalAberto: !!modal,
    celular,
    quizKey,
    historico,
    soloSel,
    soloQs,
    soloAtual: historico.find((b) => b.id === soloAtualId),
    iniciarSolo: (sel) => {
      setSoloSel(sel)
      setSoloQs(sortearSolo(sel))
      setQuizKey((k) => k + 1)
      ir('solo-quiz')
    },
    fimSolo: (rs) => {
      const b: BatalhaSolo = { id: 'solo-' + Date.now(), data: new Date().toISOString(), selecoes: soloSel, questoes: soloQs, respostas: soloQs.map((_, i) => rs[i] ?? null) }
      setHistorico((h) => [b, ...h])
      setSoloAtualId(b.id)
      ir('solo-resultado')
    },
    abrirSolo: (id, t) => {
      setSoloAtualId(id)
      ir(t)
    },
    pedirSair: (m) => setModal(m === 'solo' ? 'sair-solo' : 'sair-vs'),
    vs,
    vsAtual,
    vsOp,
    vsSel,
    vsFoco,
    escolherOponente: (id) => {
      setVsOp(id)
      setVsSel([])
      setVsFoco(null)
      setVsAtualId(null)
      ir('vs-topicos')
    },
    continuarTopicos: (sel) => {
      setVsSel(sel)
      setVsAtualId(null)
      ir('vs-confirmar')
    },
    editarTopicos: (foco) => {
      setVsFoco(foco ?? null)
      setVsAtualId(null)
      ir('vs-topicos')
    },
    enviarDesafio: () => {
      if (!vsOp) return
      const b = novaVS(vsOp, vsSel)
      setVs((v) => [b, ...v])
      setVsAtualId(b.id)
      setQuizKey((k) => k + 1)
      setToast({ tipo: 'ok', titulo: 'Desafio enviado!', texto: `Desafio enviado para ${nomeCurto(vsOp)}! Agora é a sua vez.` })
      ir('vs-quiz')
    },
    jogarRodada: () => {
      setQuizKey((k) => k + 1)
      ir('vs-quiz')
    },
    fimVS: (rs) => {
      const agora = new Date().toISOString()
      setVs((v) => v.map((b) => (b.id === vsAtualId ? { ...b, respostas: b.questoes.map((_, i) => rs[i] ?? null), finalizadaEm: agora } : b)))
      ir('vs-resultado')
    },
    abrirVS: (id) => {
      const b = vs.find((x) => x.id === id)
      if (!b) return
      setVsAtualId(id)
      ir(situacao(b) === 'andamento' ? 'vs-confirmar' : 'vs-resultado')
    },
    revanche: () => {
      if (!vsAtual) return
      setVsOp(vsAtual.oponente)
      setVsSel(vsAtual.selecoes)
      setVsFoco(null)
      setVsAtualId(null)
      ir('vs-topicos')
    },
    novaVS: () => {
      setVsAtualId(null)
      ir('vs-oponente')
    },
    abrirReportar: () => {
      setMotivo(null)
      setModal('reportar')
    },
  }

  return (
    <div className={`bt ${recolhida ? 'is-recolhida' : ''}`}>
      <Sidebar onFora={fora} onBatalhas={() => ir('inicio')} gaveta={gaveta} onFechar={() => setGaveta(false)} />
      <div className="bt-principal">
        <TopBar onMenu={() => setGaveta(true)} onAlternar={() => setRecolherManual(!recolhida)} recolhida={recolhida} onFora={fora} />
        <main className="bt-rolagem">
          <AnimatePresence mode="wait">
            <motion.div key={tela + quizKey} className="bt-conteudo" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              {tela === 'inicio' && <Inicio c={c} />}
              {tela === 'solo-intro' && <SoloIntro c={c} />}
              {tela === 'solo-topicos' && <SoloTopicos c={c} />}
              {tela === 'solo-quiz' && <SoloQuiz c={c} />}
              {tela === 'solo-resultado' && c.soloAtual && <SoloResultado c={c} />}
              {tela === 'solo-gabarito' && c.soloAtual && <SoloGabarito c={c} />}
              {tela === 'vs-intro' && <VsIntro c={c} />}
              {tela === 'vs-oponente' && <VsOponente c={c} />}
              {tela === 'vs-topicos' && <VsTopicos c={c} />}
              {tela === 'vs-confirmar' && (vsAtual || vsOp) && <VsConfirmar c={c} />}
              {tela === 'vs-quiz' && vsAtual && <VsQuiz c={c} />}
              {tela === 'vs-resultado' && vsAtual?.respostas && <VsResultado c={c} />}
              {tela === 'vs-lista' && <VsLista c={c} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div key="veu" className="bt-veu is-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModal(null)}>
            <motion.div className="bt-modal" role="dialog" aria-modal="true" aria-labelledby="bt-modal-t" initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8 }} onClick={(e) => e.stopPropagation()}>
              {modal === 'reportar' ? (
                <>
                  <div className="bt-modal__cab">
                    <h2 id="bt-modal-t">Reportar questão</h2>
                    <button className="bt-icone-btn is-sm" aria-label="Fechar" onClick={() => setModal(null)}>
                      <X size={20} />
                    </button>
                  </div>
                  <p>O que há de errado com esta questão? O cronômetro continua correndo.</p>
                  <div className="bt-motivos" role="radiogroup">
                    {['Enunciado confuso', 'Alternativas com erro', 'Mais de uma resposta correta', 'Conteúdo fora do tópico'].map((m) => (
                      <button key={m} role="radio" aria-checked={motivo === m} className={`bt-radio is-simples ${motivo === m ? 'is-on' : ''}`} onClick={() => setMotivo(m)}>
                        <i />
                        <span>
                          <b>{m}</b>
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="bt-modal__acoes">
                    <Btn v="outline" onClick={() => setModal(null)}>
                      Cancelar
                    </Btn>
                    <Btn
                      disabled={!motivo}
                      onClick={() => {
                        setModal(null)
                        setToast({ tipo: 'info', titulo: 'Questão reportada', texto: 'Obrigado! Nossa equipe vai revisar esta questão.' })
                      }}
                    >
                      Enviar
                    </Btn>
                  </div>
                </>
              ) : (
                <>
                  <span className="bt-tile is-vermelho">
                    <LogOut size={24} />
                  </span>
                  <div className="bt-modal__cab">
                    <h2 id="bt-modal-t">Sair da batalha?</h2>
                    <button className="bt-icone-btn is-sm" aria-label="Fechar" onClick={() => setModal(null)}>
                      <X size={20} />
                    </button>
                  </div>
                  <p>{modal === 'sair-vs' ? 'Você poderá recomeçar sua rodada depois em “Minhas batalhas”. Ao voltar, o cronômetro de 10 minutos recomeça.' : 'Seu progresso nesta batalha será perdido e as questões respondidas não contam para o resultado.'}</p>
                  <div className="bt-modal__acoes is-sair">
                    <Btn v="outline" onClick={() => setModal(null)}>
                      Continuar batalha
                    </Btn>
                    <Btn v="destructive" onClick={() => ir(modal === 'sair-vs' ? 'vs-lista' : 'inicio')}>
                      <LogOut size={18} /> Sair da batalha
                    </Btn>
                  </div>
                </>
              )}
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

const nomeCurto = (id: string) => ({ ana: 'Ana', bruno: 'Bruno', carla: 'Carla', daniel: 'Daniel', eduarda: 'Eduarda', felipe: 'Felipe', gabriel: 'Gabriel', giovana: 'Giovana', joao: 'João', laura: 'Laura', lucasm: 'Lucas', mariana: 'Mariana', lucasa: 'Lucas', marina: 'Marina', beatriz: 'Beatriz' })[id] ?? id

/* ---------------------------------------------------------------- shell (Style Guide GenieX) */
const NAV: [string, LucideIcon][][] = [
  [['Página Inicial', House], ['Ranking', Trophy]],
  [['Trilhas', Route], ['Cursos', GraduationCap], ['Biblioteca', BookOpen], ['Cronograma', Calendar], ['Instituição', Building2], ['Genie Bot', Bot]],
  [['Simulados', FileCheck2], ['Batalhas', Swords], ['Redação', PenLine]],
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
function Sidebar({ onFora, onBatalhas, gaveta, onFechar }: { onFora: (n: string) => void; onBatalhas: () => void; gaveta: boolean; onFechar: () => void }) {
  return (
    <>
      <AnimatePresence>{gaveta && <motion.div className="bt-veu is-gaveta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onFechar} />}</AnimatePresence>
      <aside className={`bt-side ${gaveta ? 'is-aberta' : ''}`}>
        <div className="bt-logo">
          <img className="bt-logo__completo" src="./bat/logo-light.svg" alt="GenieX" />
          <img className="bt-logo__icone" src="./bat/logo-light.svg" alt="GenieX" />
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
                <button key={n} className={`bt-nav__item ${n === 'Batalhas' ? 'is-ativo' : ''}`} aria-current={n === 'Batalhas' ? 'page' : undefined} onClick={() => (n === 'Batalhas' ? onBatalhas() : onFora(n))} title={n}>
                  <I size={20} strokeWidth={1.8} />
                  <span>{n}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>
        <button className="bt-perfil" onClick={() => onFora('Meu perfil')}>
          <img src="./bat/av-voce.webp" alt="" />
          <span>
            <b>Aluno GenieX</b>
            <small>aluno@jovensgenios.com</small>
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
      <img className="bt-top__logo" src="./bat/logo-light.svg" alt="GenieX" />
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
