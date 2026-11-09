import { AnimatePresence, motion } from 'framer-motion'
import { Activity, CalendarDays, CircleHelp, Columns3, Ellipsis, GraduationCap, House, Layers, Menu as MenuIc, MessageSquareMore, PanelLeft, Trophy, WifiOff, X, type LucideIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { PrototypeProps } from '../../platform/journeys'
import { CARREIRA } from './carreiras'
import { N_ITENS, contar } from './instrumento'
import { TvProvider, useTv, type Inicio, type View } from './store'
import { IconeBussola, Modal, Btn, Toasts } from './components/ui'
import Inicial from './screens/Inicial'
import Entrada from './screens/Entrada'
import Clareza from './screens/Clareza'
import Intro from './screens/Intro'
import Questionario from './screens/Questionario'
import Revisao from './screens/Revisao'
import Processando from './screens/Processando'
import Relatorio from './screens/Relatorio'
import CarreiraTela from './screens/Carreira'
import Explorar from './screens/Explorar'
import Comparar from './screens/Comparar'
import Minhas from './screens/Minhas'
import Plano from './screens/Plano'
import ClarezaPos from './screens/ClarezaPos'
import Historico from './screens/Historico'
import './voc.css'

const ATALHOS: Inicio[] = ['inicio', 'entrada', 'clareza', 'intro', 'questionario', 'pares', 'retomar', 'revisao', 'processando', 'relatorio', 'recomendacoes', 'carreira', 'explorar', 'comparar', 'minhas', 'plano', 'clareza-pos', 'historico']

export default function TesteVocacional({ startScreen }: PrototypeProps) {
  const start = (ATALHOS.includes(startScreen as Inicio) ? startScreen : 'inicio') as Inicio
  return (
    <TvProvider start={start}>
      <Shell />
    </TvProvider>
  )
}

/** telas em que o estudante está “dentro” do teste: sem abas, foco total */
const FOCO = ['clareza', 'intro', 'questionario', 'revisao', 'processando']
const chave = (v: View) => (v.id === 'carreira' ? `carreira-${v.carreira}` : v.id === 'relatorio' ? `relatorio-${v.tentativa ?? ''}` : v.id === 'questionario' ? 'questionario' : v.id)

function Shell() {
  const { s, ir, toggleSidebar, toast, atual } = useTv()
  const [gaveta, setGaveta] = useState(false)
  const [sair, setSair] = useState<View | null>(null)
  const [offline, setOffline] = useState(typeof navigator !== 'undefined' && !navigator.onLine)
  const v = s.view

  useEffect(() => {
    document.title = 'Teste Vocacional · GenieX · Protótipo Jovens Gênios'
    const on = () => setOffline(false)
    const off = () => setOffline(true)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])

  const navegar = (destino: View) => {
    setGaveta(false)
    if (v.id === 'processando') return
    if (v.id === 'questionario' && atual && destino.id !== 'questionario') return setSair(destino)
    ir(destino, -1)
  }

  return (
    <div className={`tv ${s.sidebarFechada ? 'is-recolhida' : ''}`}>
      <AnimatePresence>{gaveta && <motion.div className="tv-veu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setGaveta(false)} />}</AnimatePresence>
      <Sidebar aberta={gaveta} onNavegar={navegar} foraDoEscopo={(n) => toast(`“${n}” não faz parte deste protótipo.`, 'info')} />

      <div className="tv-corpo">
        <header className="tv-topo">
          <button className="tv-iconbtn tv-topo__painel" onClick={toggleSidebar} aria-label={s.sidebarFechada ? 'Expandir menu' : 'Recolher menu'}>
            <PanelLeft size={20} strokeWidth={1.8} />
          </button>
          <button className="tv-iconbtn tv-topo__menu" onClick={() => setGaveta(true)} aria-label="Abrir menu">
            <MenuIc size={20} />
          </button>
          <img className="tv-topo__logo" src="./flash/logo.webp" alt="GenieX" />
          <div className="tv-topo__dir">
            <button className="tv-ofensiva" onClick={() => toast('Você estudou 3 dias seguidos. Continue assim!', 'info')} title="Dias seguidos de estudo">
              <motion.img src="./flash/chama.webp" alt="" animate={{ scale: [1, 1.08, 1], rotate: [0, -3, 0] }} transition={{ duration: 2.4, repeat: Infinity }} />
              <strong>3</strong>
            </button>
            <i className="tv-topo__div" />
            <button className="tv-chat" onClick={() => toast('O Genie Bot não faz parte deste protótipo.', 'info')} aria-label="Genie Bot">
              <svg viewBox="0 0 32 30" width="27" height="25" aria-hidden>
                <path d="M7 1h18a6 6 0 0 1 6 6v11a6 6 0 0 1-6 6H13l-6.2 4.7c-.7.5-1.8 0-1.8-.9V24a5 5 0 0 1-4-5V7a6 6 0 0 1 6-6z" fill="#4b55ec" />
                <circle cx="11" cy="12.5" r="2" fill="#fff" />
                <circle cx="16.5" cy="12.5" r="2" fill="#fff" />
                <circle cx="22" cy="12.5" r="2" fill="#fff" />
              </svg>
            </button>
            <i className="tv-topo__div" />
            <button className="tv-iconbtn tv-ajuda" onClick={() => toast('Central de ajuda fora do escopo deste protótipo.', 'info')} aria-label="Ajuda">
              <CircleHelp size={22} strokeWidth={1.6} />
            </button>
          </div>
        </header>

        <AnimatePresence>
          {offline && (
            <motion.div className="tv-offline" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} role="status">
              <WifiOff size={16} /> Você está sem conexão. Suas respostas ficam guardadas neste dispositivo e são enviadas assim que a conexão voltar.
            </motion.div>
          )}
        </AnimatePresence>

        <main className="tv-main">
          {v.id !== 'inicio' && !FOCO.includes(v.id) && <Abas onNavegar={navegar} />}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={chave(v)}
              className={`tv-pagina tv-pagina--${v.id}`}
              initial={{ opacity: 0, x: 22 * s.dir }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -14 * s.dir, transition: { duration: 0.13 } }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            >
              {v.id === 'inicio' && <Inicial />}
              {v.id === 'entrada' && <Entrada />}
              {v.id === 'clareza' && <Clareza />}
              {v.id === 'intro' && <Intro />}
              {v.id === 'questionario' && <Questionario capa={v.capa} onSair={() => setSair({ id: 'entrada' })} />}
              {v.id === 'revisao' && <Revisao />}
              {v.id === 'processando' && <Processando />}
              {v.id === 'relatorio' && <Relatorio tentativaId={v.tentativa} secao={v.secao} />}
              {v.id === 'carreira' && <CarreiraTela v={v} />}
              {v.id === 'explorar' && <Explorar dimInicial={v.dim} />}
              {v.id === 'comparar' && <Comparar />}
              {v.id === 'minhas' && <Minhas />}
              {v.id === 'plano' && <Plano />}
              {v.id === 'clareza-pos' && <ClarezaPos />}
              {v.id === 'historico' && <Historico />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <BandejaComparar />
      <PainelEventos />

      <Modal
        aberto={!!sair}
        onFechar={() => setSair(null)}
        titulo="Pausar o teste?"
        rodape={
          <>
            <Btn variante="contorno" onClick={() => setSair(null)}>
              Continuar respondendo
            </Btn>
            <Btn
              onClick={() => {
                const d = sair!
                setSair(null)
                ir(d, -1)
                toast('Respostas salvas. Você pode continuar de onde parou quando quiser.', 'ok')
              }}
            >
              Sair e continuar depois
            </Btn>
          </>
        }
      >
        <p className="tv-texto">
          Suas respostas já estão salvas: {atual ? contar(atual.respostas) : 0} de {N_ITENS}. Quando voltar, você continua exatamente de onde parou.
        </p>
      </Modal>
      <Toasts />
    </div>
  )
}

/* ---------------- abas da funcionalidade ---------------- */
function Abas({ onNavegar }: { onNavegar: (v: View) => void }) {
  const { s, ultima } = useTv()
  const v = s.view
  const ativa =
    v.id === 'entrada' || v.id === 'relatorio' || v.id === 'clareza-pos' ? 'perfil'
    : v.id === 'carreira' ? (v.de === 'minhas' ? 'minhas' : v.de === 'plano' ? 'plano' : v.de === 'relatorio' ? 'perfil' : 'explorar')
    : v.id === 'comparar' ? 'explorar'
    : v.id
  const abas: { id: string; nome: string; destino: View; n?: number }[] = [
    { id: 'perfil', nome: ultima ? 'Meu perfil' : 'Teste Vocacional', destino: ultima ? { id: 'relatorio' } : { id: 'entrada' } },
    { id: 'explorar', nome: 'Explorar carreiras', destino: { id: 'explorar' } },
    { id: 'minhas', nome: 'Minhas carreiras', destino: { id: 'minhas' }, n: s.favoritos.length },
    { id: 'plano', nome: 'Meu plano', destino: { id: 'plano' }, n: s.acoes.filter((a) => !a.feita).length },
    { id: 'historico', nome: 'Minha jornada', destino: { id: 'historico' } },
  ]
  return (
    <nav className="tv-abas" aria-label="Teste Vocacional">
      <div className="tv-abas__trilho">
        {abas.map((a) => (
          <button key={a.id} className={`tv-aba ${ativa === a.id ? 'is-on' : ''}`} onClick={() => onNavegar(a.destino)} aria-current={ativa === a.id ? 'page' : undefined}>
            {a.nome}
            {!!a.n && <em>{a.n}</em>}
            {ativa === a.id && <motion.i layoutId="tv-aba-linha" className="tv-aba__linha" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
          </button>
        ))}
      </div>
    </nav>
  )
}

/* ---------------- bandeja de comparação ---------------- */
function BandejaComparar() {
  const { s, ir, setComparar } = useTv()
  const ids = s.comparar
  const visivel = ids.length > 0 && !['comparar', 'questionario', 'processando', 'clareza', 'intro', 'revisao', 'inicio'].includes(s.view.id)
  return (
    <AnimatePresence initial={false}>
      {visivel && (
        <motion.div className="tv-bandeja" initial={{ y: 90, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 90, opacity: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 32 }}>
          <Columns3 size={18} className="tv-bandeja__ic" />
          <div className="tv-bandeja__itens">
            {ids.map((id) => (
              <motion.span key={id} layout className="tv-bandeja__item" initial={{ scale: 0.6 }} animate={{ scale: 1 }}>
                <img src={CARREIRA[id].icone} alt="" />
                <span>{CARREIRA[id].nome}</span>
              </motion.span>
            ))}
            {ids.length < 3 && <span className="tv-bandeja__vaga">{ids.length === 1 ? 'Escolha mais 1 ou 2' : '+ 1 vaga'}</span>}
          </div>
          <Btn pequeno disabled={ids.length < 2} onClick={() => ir({ id: 'comparar' })}>
            Comparar ({ids.length})
          </Btn>
          <button className="tv-iconbtn tv-bandeja__x" onClick={() => setComparar([])} aria-label="Limpar comparação">
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ---------------- painel de eventos (instrumentação do PRD §9.3) ---------------- */
function PainelEventos() {
  const { s } = useTv()
  const [aberto, setAberto] = useState(false)
  return (
    <div className="tv-eventos">
      <AnimatePresence>
        {aberto && (
          <motion.div className="tv-eventos__painel" initial={{ opacity: 0, y: 10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10 }}>
            <header>
              <strong>Eventos de produto</strong>
              <small>Instrumentação prevista no PRD (§9.3). Sem nomes, e-mails ou textos livres.</small>
            </header>
            {s.eventos.length ? (
              <ol>
                <AnimatePresence initial={false}>
                  {s.eventos.map((e) => (
                    <motion.li key={e.id} layout initial={{ opacity: 0, x: -8, backgroundColor: '#eef0fe' }} animate={{ opacity: 1, x: 0, backgroundColor: '#ffffff' }} transition={{ backgroundColor: { duration: 1.2 } }}>
                      <code>{e.nome}</code>
                      <span>{Object.entries(e.props).map(([k, v]) => `${k}: ${v}`).join(' · ') || '—'}</span>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ol>
            ) : (
              <p className="tv-eventos__vazio">Navegue pela jornada para ver os eventos registrados.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <button className={`tv-eventos__btn ${aberto ? 'is-on' : ''}`} onClick={() => setAberto((a) => !a)} aria-expanded={aberto} title="Eventos de produto registrados neste protótipo">
        <Activity size={15} />
        <span>Eventos</span>
        <motion.em key={s.eventos.length} initial={{ scale: 1.5 }} animate={{ scale: 1 }}>
          {s.eventos.length}
        </motion.em>
      </button>
    </div>
  )
}

/* ---------------- menu lateral ---------------- */
type Item = { id: string; nome: string; icone: LucideIcon | typeof IconeBussola; destino?: View; novo?: boolean }
const TOPO: Item[] = [
  { id: 'inicio', nome: 'Página Inicial', icone: House, destino: { id: 'inicio' } },
  { id: 'ranking', nome: 'Ranking', icone: Trophy },
]
const APRENDA: Item[] = [
  { id: 'estudar', nome: 'Estudar', icone: GraduationCap },
  { id: 'cronograma', nome: 'Cronograma', icone: CalendarDays },
  { id: 'flashcards', nome: 'Flashcards', icone: Layers },
  { id: 'bot', nome: 'Genie Bot', icone: MessageSquareMore },
]
const FUTURO: Item[] = [{ id: 'vocacional', nome: 'Teste Vocacional', icone: IconeBussola, destino: { id: 'entrada' }, novo: true }]

function Sidebar({ aberta, onNavegar, foraDoEscopo }: { aberta: boolean; onNavegar: (v: View) => void; foraDoEscopo: (nome: string) => void }) {
  const { s, ultima } = useTv()
  const ativo = s.view.id === 'inicio' ? 'inicio' : 'vocacional'
  const visitou = s.view.id !== 'inicio' || s.tentativas.length > 0

  const item = (i: Item) => (
    <button
      key={i.id}
      className={`tv-side__item ${ativo === i.id ? 'is-on' : ''} ${i.novo && !visitou ? 'is-destaque' : ''}`}
      onClick={() => (i.destino ? onNavegar(i.id === 'vocacional' && ultima ? { id: 'relatorio' } : i.destino) : foraDoEscopo(i.nome))}
      title={i.nome}
    >
      {ativo === i.id && <motion.span layoutId="tv-side-pill" className="tv-side__pill" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
      <i.icone size={20} strokeWidth={1.8} className="tv-side__ic" />
      <span className="tv-side__nome">{i.nome}</span>
      {i.novo && !visitou && (
        <motion.span className="tv-side__novo" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6, type: 'spring' }}>
          Novo
        </motion.span>
      )}
    </button>
  )

  return (
    <aside className={`tv-side ${aberta ? 'is-aberta' : ''}`}>
      <button className="tv-side__marca" onClick={() => onNavegar({ id: 'inicio' })} aria-label="GenieX — Página Inicial">
        <img src="./flash/logo.webp" alt="" />
        <span>GenieX</span>
      </button>
      <nav className="tv-side__nav">
        {TOPO.map(item)}
        <p className="tv-side__sec">Aprenda</p>
        {APRENDA.map(item)}
        <p className="tv-side__sec">Seu futuro</p>
        {FUTURO.map(item)}
      </nav>
      <div className="tv-side__usuario">
        <img src="./flash/avatar.webp" alt="" />
        <span className="tv-side__quem">
          <strong>Aluno Geniex</strong>
          <small>3º ano · Ensino Médio</small>
        </span>
        <button className="tv-iconbtn" onClick={() => foraDoEscopo('Perfil')} aria-label="Opções da conta">
          <Ellipsis size={17} />
        </button>
      </div>
    </aside>
  )
}
