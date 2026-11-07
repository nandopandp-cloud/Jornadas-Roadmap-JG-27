import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, CircleHelp, Ellipsis, GraduationCap, House, Menu as MenuIc, MessageSquareMore, PanelLeft, Trophy, type LucideIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { PrototypeProps } from '../../platform/journeys'
import { FxProvider, useFx, type Inicio, type View } from './store'
import { IconeFlashcards, Modal, Btn, Toasts } from './components/ui'
import Inicial from './screens/Inicial'
import Landing from './screens/Landing'
import Disciplinas from './screens/Disciplinas'
import Topicos from './screens/Topicos'
import Gerando from './screens/Gerando'
import Home from './screens/Home'
import Estudo from './screens/Estudo'
import Concluida from './screens/Concluida'
import './flash.css'

const ATALHOS: Inicio[] = ['inicio', 'landing', 'disciplinas', 'topicos', 'gerando', 'grupos', 'estudo', 'resposta', 'concluida', 'favoritos', 'historico']

export default function Flashcards({ startScreen }: PrototypeProps) {
  const start = (ATALHOS.includes(startScreen as Inicio) ? startScreen : 'inicio') as Inicio
  return (
    <FxProvider start={start}>
      <Shell />
    </FxProvider>
  )
}

/** chave da página para as transições (troca de aba dentro da mesma tela não remonta) */
const chave = (v: View) => (v.id === 'grupo' ? `grupo-${v.grupo}` : v.id === 'topicos' ? 'topicos' : v.id === 'home' ? 'home' : v.id === 'concluida' ? `concluida-${v.grupo}` : v.id)

function Shell() {
  const { s, ir, toggleSidebar, toast } = useFx()
  const [gaveta, setGaveta] = useState(false)
  const [sairGerando, setSairGerando] = useState<View | null>(null)
  const v = s.view

  useEffect(() => {
    document.title = 'Flashcards · GenieX · Protótipo Jovens Gênios'
  }, [])

  const navegar = (destino: View) => {
    setGaveta(false)
    if (v.id === 'gerando' && destino.id !== 'gerando') return setSairGerando(destino)
    ir(destino, -1)
  }

  return (
    <div className={`fx ${s.sidebarFechada ? 'is-recolhida' : ''}`}>
      <AnimatePresence>{gaveta && <motion.div className="fx-veu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setGaveta(false)} />}</AnimatePresence>
      <Sidebar aberta={gaveta} onNavegar={navegar} foraDoEscopo={(n) => toast(`“${n}” não faz parte deste protótipo.`, 'info')} />

      <div className="fx-corpo">
        <header className="fx-topo">
          <button className="fx-iconbtn fx-topo__painel" onClick={toggleSidebar} aria-label={s.sidebarFechada ? 'Expandir menu' : 'Recolher menu'}>
            <PanelLeft size={20} strokeWidth={1.8} />
          </button>
          <button className="fx-iconbtn fx-topo__menu" onClick={() => setGaveta(true)} aria-label="Abrir menu">
            <MenuIc size={20} />
          </button>
          <img className="fx-topo__logo" src="./flash/logo.webp" alt="GenieX" />
          <div className="fx-topo__dir">
            <button className="fx-ofensiva" onClick={() => toast('Você estudou 3 dias seguidos. Continue assim!', 'info')} title="Dias seguidos de estudo">
              <motion.img src="./flash/chama.webp" alt="" animate={{ scale: [1, 1.08, 1], rotate: [0, -3, 0] }} transition={{ duration: 2.4, repeat: Infinity }} />
              <strong>3</strong>
            </button>
            <i className="fx-topo__div" />
            <button className="fx-chat" onClick={() => toast('O Genie Bot não faz parte deste protótipo.', 'info')} aria-label="Genie Bot">
              <svg viewBox="0 0 32 30" width="27" height="25" aria-hidden>
                <path d="M7 1h18a6 6 0 0 1 6 6v11a6 6 0 0 1-6 6H13l-6.2 4.7c-.7.5-1.8 0-1.8-.9V24a5 5 0 0 1-4-5V7a6 6 0 0 1 6-6z" fill="#4b55ec" />
                <circle cx="11" cy="12.5" r="2" fill="#fff" />
                <circle cx="16.5" cy="12.5" r="2" fill="#fff" />
                <circle cx="22" cy="12.5" r="2" fill="#fff" />
              </svg>
            </button>
            <i className="fx-topo__div" />
            <button className="fx-iconbtn fx-ajuda" onClick={() => toast('Central de ajuda fora do escopo deste protótipo.', 'info')} aria-label="Ajuda">
              <CircleHelp size={22} strokeWidth={1.6} />
            </button>
          </div>
        </header>

        <main className="fx-main">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={chave(v)}
              className="fx-pagina"
              initial={{ opacity: 0, x: 22 * s.dir }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -14 * s.dir, transition: { duration: 0.13 } }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            >
              {v.id === 'inicio' && <Inicial />}
              {v.id === 'landing' && <Landing />}
              {v.id === 'disciplinas' && <Disciplinas />}
              {v.id === 'topicos' && <Topicos disc={v.disc} />}
              {v.id === 'gerando' && <Gerando onCancelar={() => setSairGerando({ id: 'topicos' })} />}
              {v.id === 'home' && <Home aba={v.aba} />}
              {v.id === 'grupo' && <Estudo key={v.grupo} v={v} />}
              {v.id === 'concluida' && <Concluida grupo={v.grupo} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <Modal
        aberto={!!sairGerando}
        onFechar={() => setSairGerando(null)}
        titulo="Interromper a geração?"
        rodape={
          <>
            <Btn variante="contorno" onClick={() => setSairGerando(null)}>
              Continuar gerando
            </Btn>
            <Btn
              onClick={() => {
                const d = sairGerando!
                setSairGerando(null)
                ir(d, -1)
              }}
            >
              Interromper
            </Btn>
          </>
        }
      >
        <p className="fx-texto">Seus flashcards ainda estão sendo preparados. Se sair agora, as seleções continuam salvas e você pode gerar de novo quando quiser.</p>
      </Modal>
      <Toasts />
    </div>
  )
}

/* ---------------- menu lateral ---------------- */
type Item = { id: string; nome: string; icone: LucideIcon | typeof IconeFlashcards; destino?: View; novo?: boolean }
const TOPO: Item[] = [
  { id: 'inicio', nome: 'Página Inicial', icone: House, destino: { id: 'inicio' } },
  { id: 'ranking', nome: 'Ranking', icone: Trophy },
]
const APRENDA: Item[] = [
  { id: 'estudar', nome: 'Estudar', icone: GraduationCap },
  { id: 'cronograma', nome: 'Cronograma', icone: CalendarDays },
  { id: 'flashcards', nome: 'Flashcards', icone: IconeFlashcards, destino: { id: 'landing' }, novo: true },
  { id: 'bot', nome: 'Genie Bot', icone: MessageSquareMore },
]

function Sidebar({ aberta, onNavegar, foraDoEscopo }: { aberta: boolean; onNavegar: (v: View) => void; foraDoEscopo: (nome: string) => void }) {
  const { s } = useFx()
  const ativo = s.view.id === 'inicio' ? 'inicio' : 'flashcards'
  const visitouFlash = s.view.id !== 'inicio' || s.grupos.some((g) => g.novo)

  const item = (i: Item) => (
    <button key={i.id} className={`fx-side__item ${ativo === i.id ? 'is-on' : ''} ${i.novo && !visitouFlash ? 'is-destaque' : ''}`} onClick={() => (i.destino ? onNavegar(i.destino) : foraDoEscopo(i.nome))} title={i.nome}>
      {ativo === i.id && <motion.span layoutId="fx-side-pill" className="fx-side__pill" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
      <i.icone size={20} strokeWidth={1.8} className="fx-side__ic" />
      <span className="fx-side__nome">{i.nome}</span>
      {i.novo && !visitouFlash && (
        <motion.span className="fx-side__novo" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6, type: 'spring' }}>
          Novo
        </motion.span>
      )}
    </button>
  )

  return (
    <aside className={`fx-side ${aberta ? 'is-aberta' : ''}`}>
      <button className="fx-side__marca" onClick={() => onNavegar({ id: 'inicio' })} aria-label="GenieX — Página Inicial">
        <img src="./flash/logo.webp" alt="" />
        <span>GenieX</span>
      </button>
      <nav className="fx-side__nav">
        {TOPO.map(item)}
        <p className="fx-side__sec">Aprenda</p>
        {APRENDA.map(item)}
      </nav>
      <div className="fx-side__usuario">
        <img src="./flash/avatar.webp" alt="" />
        <span className="fx-side__quem">
          <strong>Aluno Geniex</strong>
          <small>@jovensgenios.com</small>
        </span>
        <button className="fx-iconbtn" onClick={() => foraDoEscopo('Perfil')} aria-label="Opções da conta">
          <Ellipsis size={17} />
        </button>
      </div>
    </aside>
  )
}
