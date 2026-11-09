import { AnimatePresence, motion } from 'framer-motion'
import { Activity, Bell, Book, Building2, CalendarDays, ChevronDown, Columns3, Ellipsis, FileCheck2, GraduationCap, Menu as MenuIc, MessageSquareMore, PenLine, Search, WifiOff, X, type LucideIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { PrototypeProps } from '../../platform/journeys'
import { CARREIRA } from './carreiras'
import { N_ITENS, contar } from './instrumento'
import { TvProvider, useTv, type Inicio, type View } from './store'
import { Modal, Btn, Toasts } from './components/ui'
import Inicial from './screens/Inicial'
import Entrada from './screens/Entrada'
import Clareza from './screens/Clareza'
import Questionario from './screens/Questionario'
import Revisao from './screens/Revisao'
import Processando from './screens/Processando'
import Relatorio from './screens/Relatorio'
import CarreiraTela from './screens/Carreira'
import Explorar from './screens/Explorar'
import Comparar from './screens/Comparar'
import Historico from './screens/Historico'
import './voc.css'

const ATALHOS: Inicio[] = ['inicio', 'entrada', 'clareza', 'questionario', 'q-valores', 'q-preferencias', 'q-habilidades', 'retomar', 'revisao', 'processando', 'relatorio', 'areas', 'recomendacoes', 'res-valores', 'res-preferencias', 'res-habilidades', 'passos', 'clareza-pos', 'carreira', 'explorar', 'comparar', 'historico']

export default function TesteVocacional({ startScreen }: PrototypeProps) {
  const start = (ATALHOS.includes(startScreen as Inicio) ? startScreen : 'entrada') as Inicio
  return (
    <TvProvider start={start}>
      <Shell />
    </TvProvider>
  )
}

const chave = (v: View) => (v.id === 'carreira' ? `carreira-${v.carreira}` : v.id === 'relatorio' ? `relatorio-${v.tentativa ?? ''}` : v.id)

function Shell() {
  const { s, ir, toast, atual } = useTv()
  const [gaveta, setGaveta] = useState(false)
  const [sair, setSair] = useState<View | null>(null)
  const [busca, setBusca] = useState('')
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
  const buscar = () => {
    navegar({ id: 'explorar', q: busca.trim() })
    setBusca('')
  }

  return (
    <div className="tv">
      <AnimatePresence>{gaveta && <motion.div className="tv-veu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setGaveta(false)} />}</AnimatePresence>
      <Sidebar aberta={gaveta} onNavegar={navegar} foraDoEscopo={(n) => toast(`“${n}” não faz parte deste protótipo.`, 'info')} />

      <div className="tv-corpo">
        <header className="tv-topo">
          <button className="tv-iconbtn tv-topo__menu" onClick={() => setGaveta(true)} aria-label="Abrir menu">
            <MenuIc size={22} />
          </button>
          <label className="tv-topo__busca">
            <Search size={19} />
            <input value={busca} onChange={(e) => setBusca(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && buscar()} placeholder="Buscar por profissões, universidades, conteúdos..." aria-label="Buscar" />
          </label>
          <div className="tv-topo__dir">
            <button className="tv-iconbtn tv-sino" onClick={() => toast('Você não tem novas notificações.', 'info')} aria-label="Notificações">
              <Bell size={23} strokeWidth={1.7} />
            </button>
            <button className="tv-usuario" onClick={() => toast('Perfil do estudante fora do escopo deste protótipo.', 'info')}>
              <img src="./voc/ref/avatar.webp" alt="" />
              <span>
                <strong>João Silva</strong>
                <small>3º ano do EM</small>
              </span>
              <ChevronDown size={18} />
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
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={chave(v)}
              className={`tv-painel tv-painel--${v.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6, transition: { duration: 0.12 } }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            >
              {v.id === 'inicio' && <Inicial />}
              {v.id === 'entrada' && <Entrada />}
              {v.id === 'clareza' && <Clareza onSair={() => ir({ id: 'entrada' }, -1)} />}
              {v.id === 'questionario' && <Questionario onSair={() => setSair({ id: 'entrada' })} />}
              {v.id === 'revisao' && <Revisao />}
              {v.id === 'processando' && <Processando />}
              {v.id === 'relatorio' && <Relatorio v={v} />}
              {v.id === 'carreira' && <CarreiraTela v={v} />}
              {v.id === 'explorar' && <Explorar dimInicial={v.dim} qInicial={v.q} />}
              {v.id === 'comparar' && <Comparar />}
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
        titulo="Sair do teste?"
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

/* ---------------- bandeja de comparação ---------------- */
function BandejaComparar() {
  const { s, ir, setComparar } = useTv()
  const ids = s.comparar
  const visivel = ids.length > 0 && !['comparar', 'questionario', 'processando', 'revisao', 'entrada'].includes(s.view.id)
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
                    <motion.li key={e.id} layout initial={{ opacity: 0, x: -8, backgroundColor: '#eeedfd' }} animate={{ opacity: 1, x: 0, backgroundColor: '#ffffff' }} transition={{ backgroundColor: { duration: 1.2 } }}>
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

/* ---------------- menu lateral (igual à GenieX em produção + Teste Vocacional) ---------------- */
export function IconeAlvo({ size = 24, strokeWidth = 2, className }: { size?: number; strokeWidth?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M20.6 9.4A9 9 0 1 1 14.6 3.4" />
      <path d="M16.6 10.7a5 5 0 1 1-3.3-3.3" />
      <path d="m12 12 7.5-7.5M17 4.5V2.2M19.5 7h2.3" />
    </svg>
  )
}
/** casinha com sorriso, como na Página Inicial da GenieX */
function IconeInicio({ size = 24, className }: { size?: number; strokeWidth?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M10.6 2.6a2.2 2.2 0 0 1 2.8 0l7 5.7c.5.4.8 1 .8 1.7V19a3 3 0 0 1-3 3H5.8a3 3 0 0 1-3-3v-9c0-.7.3-1.3.8-1.7z" fill="currentColor" />
      <path d="M8.8 14.2a4.2 4.2 0 0 0 6.4 0" fill="none" stroke="var(--side-sorriso, #fff)" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  )
}

type Item = { id: string; nome: string; icone: LucideIcon | typeof IconeAlvo | typeof IconeInicio; destino?: View; novo?: boolean }

function Sidebar({ aberta, onNavegar, foraDoEscopo }: { aberta: boolean; onNavegar: (v: View) => void; foraDoEscopo: (nome: string) => void }) {
  const { s, ultima, atual } = useTv()
  const ativo = s.view.id === 'inicio' ? 'inicio' : 'vocacional'
  const aprenda: Item[] = [
    { id: 'estudar', nome: 'Estudar', icone: GraduationCap },
    { id: 'biblioteca', nome: 'Biblioteca', icone: Book },
    { id: 'cronograma', nome: 'Cronograma', icone: CalendarDays },
    { id: 'instituicao', nome: 'Instituição', icone: Building2 },
    { id: 'bot', nome: 'Genie Bot', icone: MessageSquareMore },
  ]
  const funcionalidades: Item[] = [
    { id: 'simulados', nome: 'Simulados', icone: FileCheck2 },
    { id: 'redacao', nome: 'Redação', icone: PenLine },
    { id: 'vocacional', nome: 'Teste Vocacional', icone: IconeAlvo, destino: ultima && !atual ? { id: 'relatorio' } : { id: 'entrada' }, novo: true },
  ]
  const item = (i: Item) => (
    <button key={i.id} className={`tv-side__item ${ativo === i.id ? 'is-on' : ''}`} onClick={() => (i.destino ? onNavegar(i.destino) : foraDoEscopo(i.nome))} aria-current={ativo === i.id ? 'page' : undefined} title={i.nome}>
      {ativo === i.id && <motion.span layoutId="tv-side-pill" className="tv-side__pill" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
      <i.icone size={22} strokeWidth={1.7} className="tv-side__ic" />
      <span className="tv-side__nome">{i.nome}</span>
      {i.novo && ativo !== i.id && <em className="tv-side__novo">Novo</em>}
    </button>
  )
  return (
    <aside className={`tv-side ${aberta ? 'is-aberta' : ''}`}>
      <button className="tv-side__marca" onClick={() => onNavegar({ id: 'inicio' })} aria-label="GenieX — Página Inicial">
        <img src="./voc/ref/geniex-light.svg" alt="GenieX" />
      </button>
      <nav className="tv-side__nav">
        {item({ id: 'inicio', nome: 'Página Inicial', icone: IconeInicio, destino: { id: 'inicio' } })}
        <p className="tv-side__sec">Aprenda</p>
        {aprenda.map(item)}
        <p className="tv-side__sec">Funcionalidades</p>
        {funcionalidades.map(item)}
      </nav>
      <div className="tv-side__usuario">
        <img src="./voc/ref/avatar.webp" alt="" />
        <span className="tv-side__quem">
          <strong>João Silva</strong>
          <small>@jovensgenios.com</small>
        </span>
        <button className="tv-iconbtn" onClick={() => foraDoEscopo('Perfil')} aria-label="Opções da conta">
          <Ellipsis size={18} />
        </button>
      </div>
    </aside>
  )
}
