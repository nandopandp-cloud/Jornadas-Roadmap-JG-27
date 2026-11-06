import { AnimatePresence, motion } from 'framer-motion'
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleHelp,
  GraduationCap,
  Home,
  Menu,
  Plus,
  Sparkles,
  Star,
  Wand2,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import type { PrototypeProps } from '../../platform/journeys'
import { CronProvider, nomeEscola, useCron, type Inicio, type View } from './store'
import { Btn, Modal, Toasts } from './components/ui'
import Lista from './screens/Lista'
import Importar from './screens/Importar'
import Analise from './screens/Analise'
import Inconsistencias from './screens/Inconsistencias'
import Revisar from './screens/Revisar'
import Publicar from './screens/Publicar'
import Calendario from './screens/Calendario'
import InicioProfessor from './screens/InicioProfessor'
import InicioGestor from './screens/InicioGestor'
import './cron.css'

const ATALHOS: Inicio[] = ['lista', 'importar', 'inconsistencias', 'revisar', 'publicar', 'calendario', 'professor', 'inicio']

export default function Cronograma({ startScreen }: PrototypeProps) {
  const start = (ATALHOS.includes(startScreen as Inicio) ? startScreen : 'lista') as Inicio
  return (
    <CronProvider start={start}>
      <Shell />
    </CronProvider>
  )
}

const WIZARD = ['importar', 'analise', 'inconsistencias', 'revisar', 'publicar']

function Shell() {
  const { s, ir, toggleSidebar, publicar, toast } = useCron()
  const [gaveta, setGaveta] = useState(false)
  const [saida, setSaida] = useState<View | null>(null)
  const v = s.view
  const naWizard = WIZARD.includes(v.id)

  useEffect(() => {
    document.title = 'Cronograma de Uso · Protótipo Jovens Gênios'
  }, [])

  /** navegar; dentro do assistente (depois do upload) pergunta antes de sair */
  const navegar = (destino: View) => {
    setGaveta(false)
    if (naWizard && v.id !== 'importar' && v.id !== 'analise' && destino.id !== v.id) {
      setSaida(destino)
      return
    }
    ir(destino, -1)
  }

  const escola = 'escola' in v ? nomeEscola(s.escolas, v.escola) : ''
  const migalhas: { texto: string; ir?: View }[] =
    v.id === 'inicio'
      ? [{ texto: 'Início' }]
      : v.id === 'lista'
        ? [{ texto: 'Cronograma' }]
        : v.id === 'calendario'
          ? [{ texto: 'Cronograma', ir: s.perfil === 'gestor' ? { id: 'lista' } : undefined }, { texto: 'Calendário Escolar' }]
          : [{ texto: 'Cronograma', ir: { id: 'lista' } }, { texto: `Criar cronograma — ${escola}` }]

  return (
    <div className={`cr ${s.sidebarFechada ? 'is-recolhida' : ''}`}>
      <AnimatePresence>{gaveta && <motion.div className="cr-veu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setGaveta(false)} />}</AnimatePresence>
      <Sidebar aberta={gaveta} onNavegar={navegar} onRecolher={toggleSidebar} />

      <div className="cr-corpo">
        <header className="cr-topo">
          <button className="cr-iconbtn cr-topo__menu" onClick={() => setGaveta(true)} aria-label="Abrir menu">
            <Menu size={22} />
          </button>
          <nav className="cr-migalhas" aria-label="Você está em">
            {migalhas.map((m, i) => (
              <span key={i} className="cr-migalhas__item">
                {i > 0 && <ChevronRight size={16} className="cr-migalhas__sep" />}
                {m.ir ? (
                  <button onClick={() => navegar(m.ir!)}>{m.texto}</button>
                ) : (
                  <span className={i === migalhas.length - 1 && migalhas.length > 1 ? 'is-atual' : ''}>{m.texto}</span>
                )}
              </span>
            ))}
          </nav>
        </header>

        <main className="cr-main">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${v.id}-${'escola' in v ? v.escola : ''}-${s.perfil}`}
              className="cr-pagina"
              initial={{ opacity: 0, x: 24 * s.dir }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 * s.dir, transition: { duration: 0.14 } }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            >
              {v.id === 'lista' && <Lista aba={v.aba} />}
              {v.id === 'importar' && <Importar />}
              {v.id === 'analise' && <Analise />}
              {v.id === 'inconsistencias' && <Inconsistencias />}
              {v.id === 'revisar' && <Revisar />}
              {v.id === 'publicar' && <Publicar />}
              {v.id === 'calendario' && <Calendario escola={v.escola} dia={v.dia} />}
              {v.id === 'inicio' && (s.perfil === 'professor' ? <InicioProfessor /> : <InicioGestor />)}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <Modal
        aberto={!!saida}
        onFechar={() => setSaida(null)}
        titulo="Sair da criação do cronograma?"
        largura={480}
        rodape={
          <>
            <Btn variante="contorno" onClick={() => setSaida(null)}>
              Continuar editando
            </Btn>
            <Btn
              onClick={() => {
                publicar(true)
                toast(`Rascunho da ${escola} salvo. Você pode continuar depois.`)
                const d = saida!
                setSaida(null)
                ir(d, -1)
              }}
            >
              Salvar rascunho e sair
            </Btn>
          </>
        }
      >
        <p className="cr-texto">Suas correções e ajustes ficam guardados como rascunho. Você pode retomar quando quiser pela lista de escolas.</p>
      </Modal>

      <Toasts />
    </div>
  )
}

/* ---------------- menu lateral ---------------- */
type Item = { id: string; nome: string; icone: LucideIcon; seta?: 'dir' | 'baixo' }
const ITENS: Item[] = [
  { id: 'criar', nome: 'Criar', icone: Plus, seta: 'dir' },
  { id: 'relatorios', nome: 'Relatórios', icone: BarChart3, seta: 'baixo' },
  { id: 'atividades', nome: 'Atividades', icone: Sparkles, seta: 'dir' },
]
const ITENS2: Item[] = [
  { id: 'eventos', nome: 'Eventos', icone: CalendarDays, seta: 'dir' },
  { id: 'assistente', nome: 'Assistente', icone: Wand2, seta: 'dir' },
  { id: 'gamificacao', nome: 'Gamificação', icone: Star, seta: 'dir' },
  { id: 'formacao', nome: 'Formação', icone: GraduationCap, seta: 'dir' },
  { id: 'biblioteca', nome: 'Biblioteca', icone: BookOpen, seta: 'dir' },
  { id: 'ajuda', nome: 'Central de ajuda', icone: CircleHelp, seta: 'dir' },
]

function Sidebar({ aberta, onNavegar, onRecolher }: { aberta: boolean; onNavegar: (v: View) => void; onRecolher: () => void }) {
  const { s, toast, setPerfil } = useCron()
  const v = s.view
  const naCronograma = v.id !== 'inicio'
  const [cronAberto, setCronAberto] = useState(s.perfil === 'gestor')
  const [perfilMenu, setPerfilMenu] = useState(false)
  const gestor = s.perfil === 'gestor'

  useEffect(() => setCronAberto(s.perfil === 'gestor' || naCronograma), [s.perfil, naCronograma])

  const foraDoEscopo = (nome: string) => toast(`“${nome}” não faz parte deste protótipo.`, 'info')
  const subAtivo = v.id === 'calendario' ? 'calendario' : naCronograma ? 'uso' : null

  return (
    <aside className={`cr-side ${aberta ? 'is-aberta' : ''}`}>
      <div className="cr-side__marca">
        <img src="./cron/logo.webp" alt="Jovens Gênios" />
        <div className="cr-side__marcatxt">
          <strong>Educadores</strong>
          <span>Educadores</span>
        </div>
        <button className="cr-iconbtn cr-side__recolher" onClick={onRecolher} aria-label="Recolher menu">
          <ChevronLeft size={20} />
        </button>
      </div>

      <nav className="cr-side__nav">
        <SideBtn icone={Home} nome="Início" ativo={v.id === 'inicio'} onClick={() => onNavegar({ id: 'inicio' })} />
        <p className="cr-side__sec">Funcionalidades</p>
        {ITENS.map((i) => (
          <SideBtn key={i.id} icone={i.icone} nome={i.nome} seta={i.seta} onClick={() => foraDoEscopo(i.nome)} />
        ))}
        <SideBtn
          icone={CalendarDays}
          nome="Cronograma"
          ativo={naCronograma && !cronAberto}
          destaque={naCronograma}
          seta={cronAberto ? 'cima' : 'dir'}
          onClick={() => setCronAberto((a) => !a)}
        />
        <AnimatePresence initial={false}>
          {cronAberto && (
            <motion.div className="cr-side__sub" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
              {gestor && (
                <button className={`cr-side__subitem ${subAtivo === 'uso' ? 'is-on' : ''}`} onClick={() => onNavegar({ id: 'lista' })}>
                  {subAtivo === 'uso' && <motion.span layoutId="cr-sub" className="cr-side__subpill" />}
                  <span>Cronograma de Uso</span>
                </button>
              )}
              <button className={`cr-side__subitem ${subAtivo === 'calendario' ? 'is-on' : ''}`} onClick={() => onNavegar({ id: 'calendario', escola: 'f' })}>
                {subAtivo === 'calendario' && <motion.span layoutId="cr-sub" className="cr-side__subpill" />}
                <span>Calendário Escolar</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        {ITENS2.map((i) => (
          <SideBtn key={i.id} icone={i.icone} nome={i.nome} seta={i.seta} onClick={() => foraDoEscopo(i.nome)} />
        ))}
      </nav>

      <div className="cr-side__usuario">
        <button className="cr-side__perfil" onClick={() => setPerfilMenu((m) => !m)} aria-expanded={perfilMenu}>
          <span className="cr-side__foto" aria-hidden>
            <svg viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="20" fill="#9a98a3" />
              <circle cx="20" cy="16" r="7" fill="#d9d8de" />
              <path d="M7 34a13 13 0 0 1 26 0" fill="#d9d8de" />
            </svg>
          </span>
          <span className="cr-side__quem">
            <strong>{gestor ? 'Gestor 01 - Demonstração' : 'Professor 01 - Demonstração'}</strong>
            <small>{gestor ? 'gestor.squad@jovensgenios.com' : 'professor@jovensgenios.com'}</small>
          </span>
        </button>
        <AnimatePresence>
          {perfilMenu && (
            <motion.div className="cr-perfilmenu" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
              <p>Ver protótipo como</p>
              {(['gestor', 'professor'] as const).map((p) => (
                <button
                  key={p}
                  className={s.perfil === p ? 'is-on' : ''}
                  onClick={() => {
                    setPerfilMenu(false)
                    if (s.perfil !== p) {
                      setPerfil(p)
                      toast(p === 'gestor' ? 'Agora você está vendo como Gestor.' : 'Agora você está vendo como Professor.', 'info')
                    }
                  }}
                >
                  <strong>{p === 'gestor' ? 'Gestor(a) da rede' : 'Professor(a)'}</strong>
                  <small>{p === 'gestor' ? 'Cria e publica cronogramas' : 'Recebe as recomendações'}</small>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  )
}

function SideBtn({
  icone: I,
  nome,
  ativo,
  destaque,
  seta,
  onClick,
}: {
  icone: LucideIcon
  nome: string
  ativo?: boolean
  destaque?: boolean
  seta?: 'dir' | 'baixo' | 'cima'
  onClick: () => void
}) {
  return (
    <button className={`cr-side__item ${ativo || destaque ? 'is-on' : ''}`} onClick={onClick} title={nome}>
      {(ativo || destaque) && <motion.span layoutId="cr-side-pill" className="cr-side__pill" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
      <I size={20} strokeWidth={2} className="cr-side__ic" />
      <span className="cr-side__nome">{nome}</span>
      {seta && <span className="cr-side__seta">{seta === 'dir' ? <ChevronRight size={18} /> : seta === 'baixo' ? <ChevronDown size={18} /> : <ChevronUp size={18} />}</span>}
    </button>
  )
}
