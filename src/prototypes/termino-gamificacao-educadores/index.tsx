// Término da Gamificação dos Educadores 2026 · plataforma Educadores (Gamificação › Ranking).
// Navegável construído a partir das telas do Figma (jJugywGtJ9ZberC6jC6ZC6): casca e estilos do kit Educadores (rgx.css) + peças desta tela (tge.css).
// Atalhos: #/?screen=modal | fora | podio | sem | modal-podio | modal-sem
import { AnimatePresence, motion } from 'framer-motion'
import {
  BarChart3,
  BookText,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleHelp,
  Crown,
  ExternalLink,
  Flag,
  Gift,
  GraduationCap,
  Home,
  Info,
  Medal,
  Menu,
  PartyPopper,
  Plus,
  Settings2,
  Sparkles,
  Star,
  Target,
  Trophy,
  UserRound,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { PrototypeProps } from '../../platform/journeys'
import '../gamificacao-geniex-educadores/rgx.css'
import { ESTADOS, MEDALHA, MEDALHA_FUNDO, dados, faltouPodio, fmt, vantagem, type Dados, type Educador, type Estado } from './data'
import './tge.css'

type Toast = { titulo: string; texto: string; icone: LucideIcon }

function useMedia(q: string) {
  const [ok, setOk] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches)
  useEffect(() => {
    const m = window.matchMedia(q)
    const on = () => setOk(m.matches)
    on()
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [q])
  return ok
}

function inicio(screen?: string | null): { estado: Estado; modal: boolean } {
  switch (screen) {
    case 'fora':
    case 'podio':
    case 'sem':
      return { estado: screen, modal: false }
    case 'modal-podio':
      return { estado: 'podio', modal: true }
    case 'modal-sem':
      return { estado: 'sem', modal: true }
    default:
      return { estado: 'fora', modal: true }
  }
}

export default function TerminoGamificacaoEducadores({ startScreen }: PrototypeProps) {
  const ini = inicio(startScreen)
  const [estado, setEstado] = useState<Estado>(ini.estado)
  const [modal, setModal] = useState(ini.modal)
  const [gaveta, setGaveta] = useState(false)
  const [recolhida, setRecolhida] = useState(false)
  const [cenarios, setCenarios] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)
  const celular = useMedia('(max-width: 640px)')
  const semLateral = useMedia('(max-width: 899px)')
  const d = dados(estado)

  useEffect(() => {
    document.title = 'Ranking · Gamificação dos Educadores 2026 · Protótipo Jovens Gênios'
  }, [])
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3800)
    return () => clearTimeout(t)
  }, [toast])
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setModal(false)
      setCenarios(false)
      setGaveta(false)
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [])

  const fora = (n: string) => {
    setGaveta(false)
    setToast({ icone: Info, titulo: `“${n}” não faz parte deste protótipo`, texto: 'Aqui você navega pelo Ranking com a Gamificação 2026 encerrada.' })
  }
  const clube = () => setToast({ icone: ExternalLink, titulo: 'O Clube JG abriria em uma nova aba', texto: `Lá o educador troca seus ${fmt(d.eu.saldo)} pontos por benefícios exclusivos da JG.` })
  const trocarCenario = (e: Estado, comModal: boolean) => {
    setEstado(e)
    setModal(comModal)
    setCenarios(false)
    document.querySelector('.rx-rolagem')?.scrollTo({ top: 0 })
  }

  return (
    <div className={`rx tg ${recolhida ? 'is-recolhida' : ''}`}>
      <AnimatePresence>{gaveta && <motion.div className="rx-veu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setGaveta(false)} />}</AnimatePresence>
      <Sidebar aberta={gaveta} recolhida={recolhida && !semLateral} eu={d.eu} onFora={fora} onRanking={() => setGaveta(false)} onRecolher={() => (semLateral ? setGaveta(false) : setRecolhida((r) => !r))} />
      <div className="rx-principal">
        <header className="rx-topo">
          <button className="rx-icone-btn rx-topo__menu" onClick={() => setGaveta(true)} aria-label="Abrir menu">
            <Menu size={22} />
          </button>
          <nav className="rx-migalhas" aria-label="Você está em">
            <span>Jornada dos professores</span>
            <span className="is-atual">
              <i>/</i>Ranking
            </span>
          </nav>
        </header>
        <main className="rx-rolagem">
          <motion.div key={estado} className="rx-conteudo tg-conteudo" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <Cabecalho d={d} />
            <div className="tg-linha">
              <CardPodio d={d} celular={celular} />
              <div className="tg-coluna">
                <CardClube onClube={clube} />
                <CardPontos d={d} onClube={clube} />
                <CardResultados onClick={() => fora('Resultados')} />
              </div>
            </div>
            <CardMeu d={d} />
          </motion.div>
        </main>
      </div>

      <AnimatePresence>{modal && <ModalFim key={`m-${estado}`} d={d} celular={celular} onFechar={() => setModal(false)} />}</AnimatePresence>

      <Cenarios aberto={cenarios} estado={estado} onAbrir={() => setCenarios((c) => !c)} onEscolher={trocarCenario} />

      <AnimatePresence>
        {toast && (
          <motion.div key="toast" className="tg-toast" role="status" initial={{ opacity: 0, y: 12, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 12, x: '-50%' }}>
            <span className="tg-toast__ic">
              <toast.icone size={18} />
            </span>
            <span>
              <b>{toast.titulo}</b>
              <small>{toast.texto}</small>
            </span>
            <button className="rx-icone-btn" onClick={() => setToast(null)} aria-label="Fechar aviso">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ------------------------------------------------------------------ casca */
function Sidebar({ aberta, recolhida, eu, onFora, onRanking, onRecolher }: { aberta: boolean; recolhida: boolean; eu: Dados['eu']; onFora: (n: string) => void; onRanking: () => void; onRecolher: () => void }) {
  const item = (Ic: LucideIcon, n: string) => (
    <button className="rx-side__item" onClick={() => onFora(n)} title={n}>
      <Ic size={18} /> <span>{n}</span> <ChevronRight size={16} className="rx-side__seta" />
    </button>
  )
  return (
    <aside className={`rx-side ${aberta ? 'is-aberta' : ''}`}>
      <div className="rx-side__marca">
        <img src="./tge/logo.webp" alt="Jovens Gênios" />
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
        {item(Plus, 'Criar')}
        <div className="rx-side__item is-grupo" title="Relatórios">
          <BarChart3 size={18} /> <span>Relatórios</span> <ChevronDown size={16} className="rx-side__seta" />
        </div>
        <div className="rx-side__sub">
          {['Institucionais', 'Atividades', 'Eventos'].map((n) => (
            <button key={n} className="rx-side__subitem" onClick={() => onFora(`Relatórios › ${n}`)}>
              {n} <ChevronRight size={14} />
            </button>
          ))}
        </div>
        {item(Sparkles, 'Assistente')}
        <div className="rx-side__item is-grupo" title="Gamificação">
          <Star size={18} /> <span>Gamificação</span> <ChevronDown size={16} className="rx-side__seta" />
        </div>
        <div className="rx-side__sub">
          <button className="rx-side__subitem tg-on" onClick={onRanking} aria-current="page">
            Ranking
          </button>
        </div>
        {item(GraduationCap, 'Formação')}
        {item(BookText, 'Biblioteca')}
        {item(CircleHelp, 'Central de ajuda')}
      </nav>
      <div className="rx-side__usuario">
        <span className="rx-avatar tg-avatar-eu">{eu.ini}</span>
        <span className="rx-side__txt">
          <b>{eu.nome}</b>
          <small>{eu.email}</small>
        </span>
      </div>
    </aside>
  )
}

/* ------------------------------------------------------------------ peças */
function Badge({ icone: Ic, children, tom = 'neutro' }: { icone?: LucideIcon; children: ReactNode; tom?: 'neutro' | 'roxo' }) {
  return (
    <span className={`tg-badge is-${tom}`}>
      {Ic && <Ic size={13} />}
      {children}
    </span>
  )
}

function Avatar({ ini, pos, tam }: { ini: string; pos?: 1 | 2 | 3; tam: number }) {
  return (
    <span className="tg-av" style={{ width: tam, height: tam, fontSize: tam >= 64 ? 20 : tam >= 40 ? 14 : 12, borderColor: pos ? MEDALHA[pos] : 'transparent', background: pos ? MEDALHA_FUNDO[pos] : 'var(--rx-lilas)', borderWidth: pos ? Math.max(2, Math.round(tam / 18)) : 0 }}>
      {ini}
    </span>
  )
}

function Cabecalho({ d }: { d: Dados }) {
  return (
    <div className="tg-cab">
      <div>
        <div className="tg-cab__titulo">
          <h1 className="rx-h1">{d.edicao}</h1>
          <Badge icone={Flag}>Encerrada</Badge>
        </div>
        <p>
          Período: {d.periodo} · {fmt(d.participantes)} educadores participantes
        </p>
      </div>
      <small>Resultado final publicado em {d.publicado}</small>
    </div>
  )
}

function CardPodio({ d, celular }: { d: Dados; celular: boolean }) {
  const voce = d.estado === 'podio'
  return (
    <section className="rx-cartao tg-podio" aria-labelledby="tg-podio-t">
      <div className="tg-podio__topo">
        <div>
          <Badge tom="roxo" icone={voce ? PartyPopper : Trophy}>
            {voce ? 'Você no pódio' : 'Vencedores'}
          </Badge>
          <h2 id="tg-podio-t">{voce ? `Parabéns, ${d.eu.primeiro}! Você conquistou o 1º lugar!` : 'A Gamificação 2026 chegou ao fim!'}</h2>
          <p>{voce ? `Você foi o educador com a maior pontuação entre ${fmt(d.participantes)} participantes. Obrigado por inspirar seus estudantes!` : `Confira os 3 educadores com a maior pontuação entre ${fmt(d.participantes)} participantes. Obrigado por fazer parte desta edição!`}</p>
        </div>
        <img className="tg-podio__arte" src="./tge/podio-medalha.png" alt="" />
      </div>
      <div className="tg-podio__palco" role="list" aria-label="Pódio da Gamificação 2026">
        {[d.podio[1], d.podio[0], d.podio[2]].map((p, i) => (
          <Coluna key={p.pos} p={p} celular={celular} ordem={i} />
        ))}
      </div>
    </section>
  )
}

function Coluna({ p, celular, ordem }: { p: Educador; celular: boolean; ordem: number }) {
  const um = p.pos === 1
  const alt = celular ? { 1: 96, 2: 72, 3: 56 }[p.pos] : { 1: 156, 2: 124, 3: 100 }[p.pos]
  const atraso = [0.15, 0.35, 0.05][ordem] ?? 0
  return (
    <div className={`tg-col is-${p.pos}`} role="listitem" aria-label={`${p.pos}º lugar: ${p.nome}, ${fmt(p.pontos)} pontos`}>
      <motion.div className="tg-col__info" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: atraso + 0.35, duration: 0.35 }}>
        {um && (
          <motion.span className="tg-col__coroa" initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.75, type: 'spring', stiffness: 260, damping: 12 }}>
            <Crown size={celular ? 22 : 28} />
          </motion.span>
        )}
        <Avatar ini={p.ini} pos={p.pos} tam={um ? (celular ? 64 : 88) : celular ? 52 : 72} />
        <span className="tg-col__nome">
          <b>{p.nome}</b>
          {p.voce && <Badge tom="roxo">Você</Badge>}
        </span>
        <small>{p.escola}</small>
        <strong>{fmt(p.pontos)} pontos</strong>
        {!celular && (
          <small>
            {p.atv} atividades · {p.eng}% de engajamento
          </small>
        )}
      </motion.div>
      <motion.div className="tg-col__degrau" style={{ height: alt }} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: atraso, duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}>
        <b>{p.pos}º</b>
        {!celular && <small>lugar</small>}
      </motion.div>
    </div>
  )
}

function CardClube({ onClube }: { onClube: () => void }) {
  return (
    <section className="rx-cartao tg-clube">
      <div className="tg-clube__arte" role="img" aria-label="Educador apresentando o Programa de Recompensas" />
      <div className="tg-clube__corpo">
        <div>
          <h2>Programa de Recompensas</h2>
          <p>Crie atividades, engaje seus estudantes e acumule pontos para trocar por recompensas exclusivas. Pelo Programa de Recompensas, você acompanha seu saldo, resgata prêmios e descobre novas campanhas e benefícios.</p>
        </div>
        <button className="rx-btn tg-btn-clube" onClick={onClube}>
          Acessar Clube JG
        </button>
      </div>
    </section>
  )
}

function CardPontos({ d, onClube }: { d: Dados; onClube: () => void }) {
  return (
    <button className="rx-cartao is-p tg-mini" onClick={onClube}>
      <span className="tg-mini__topo">
        <span className="tg-tile">
          <Gift size={16} />
        </span>
        <b>Seus pontos no Clube JG</b>
        <ChevronRight size={16} />
      </span>
      <strong className="tg-saldo">{fmt(d.eu.saldo)} pontos</strong>
      <small>{d.eu.saldo ? 'disponíveis para trocar por benefícios exclusivos' : 'Crie atividades e engaje seus estudantes para acumular pontos.'}</small>
    </button>
  )
}

function CardResultados({ onClick }: { onClick: () => void }) {
  return (
    <button className="rx-cartao is-p tg-mini" onClick={onClick}>
      <span className="tg-mini__topo">
        <b>
          Resultados <Info size={14} />
        </b>
        <ChevronRight size={16} />
      </span>
      <small>Visualize os resultados das suas atividades!</small>
    </button>
  )
}

function CardMeu({ d }: { d: Dados }) {
  const voce = d.estado === 'podio'
  return (
    <section className="rx-cartao tg-meu">
      <div className="tg-meu__topo">
        <h2>
          Meu resultado <Info size={16} />
        </h2>
        <Badge icone={CircleCheck}>Resultado final</Badge>
      </div>
      {d.estado === 'sem' ? (
        <div className="tg-vazio">
          <span className="tg-vazio__ic">
            <UserRound size={20} />
          </span>
          <b>Você não participou desta edição</b>
          <p>Sua inscrição não foi registrada na Gamificação 2026. Quando uma nova edição começar, avisaremos você por aqui.</p>
        </div>
      ) : (
        <>
          <div className="tg-metricas">
            <div>
              <small>Colocação final</small>
              <strong>
                {d.eu.pos && d.eu.pos <= 3 && <Medal size={24} color={MEDALHA[d.eu.pos as 1 | 2 | 3]} />}
                {d.eu.pos}º
              </strong>
            </div>
            <div>
              <small>Pontuação</small>
              <strong>{fmt(d.eu.pontos)}</strong>
            </div>
            <div>
              <small>Atividades criadas</small>
              <strong>{d.eu.atv}</strong>
            </div>
            <div>
              <small>
                Engajamento <Info size={12} />
              </small>
              <strong>{d.eu.eng}%</strong>
            </div>
          </div>
          <p className="tg-destaque">
            {voce ? <PartyPopper size={18} /> : <Target size={18} />}
            {voce ? `Você terminou ${fmt(vantagem(d))} pontos à frente do 2º lugar. Parabéns pela conquista!` : `Você terminou a ${fmt(faltouPodio(d))} pontos do pódio. Parabéns pela dedicação nesta edição!`}
          </p>
        </>
      )}
    </section>
  )
}

/* ------------------------------------------------------------------ O1 · modal de encerramento */
function ModalFim({ d, celular, onFechar }: { d: Dados; celular: boolean; onFechar: () => void }) {
  const voce = d.estado === 'podio'
  const caixa = useRef<HTMLDivElement>(null)
  useEffect(() => caixa.current?.focus(), [])
  const anim = celular ? { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } } : { initial: { opacity: 0, scale: 0.96, x: '-50%', y: '-48%' }, animate: { opacity: 1, scale: 1, x: '-50%', y: '-50%' }, exit: { opacity: 0, scale: 0.96, x: '-50%', y: '-48%' } }
  return (
    <>
      <motion.div className="rx-veu tg-veu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onFechar} />
      <motion.div className={celular ? 'tg-modal is-sheet' : 'tg-modal'} ref={caixa} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="tg-modal-t" {...anim} transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}>
        {celular && <span className="rx-folha__alca" />}
        <button className="rx-icone-btn tg-modal__x" onClick={onFechar} aria-label="Fechar">
          <X size={20} />
        </button>
        {voce && <Confete />}
        <motion.img className="tg-modal__arte" src="./tge/podio-medalha.png" alt="" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.12, type: 'spring', stiffness: 200, damping: 14 }} />
        <Badge icone={Flag}>Edição encerrada</Badge>
        <h2 id="tg-modal-t">{voce ? `Parabéns, ${d.eu.primeiro}! Você é o 1º lugar!` : 'A Gamificação 2026 chegou ao fim!'}</h2>
        <p>Confira quem conquistou o pódio entre {fmt(d.participantes)} educadores participantes.</p>
        <ol className="tg-lista">
          {d.podio.map((p, i) => (
            <motion.li key={p.pos} style={{ background: MEDALHA_FUNDO[p.pos] }} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.08 }}>
              <span className="tg-lista__pos" style={{ background: MEDALHA[p.pos] }}>
                {p.pos}º
              </span>
              <Avatar ini={p.ini} pos={p.pos} tam={36} />
              <span className="tg-lista__nome">
                <b>
                  {p.nome} {p.voce && <Badge tom="roxo">Você</Badge>}
                </b>
                <small>{celular ? `${fmt(p.pontos)} pontos` : p.escola}</small>
              </span>
              {!celular && <strong>{fmt(p.pontos)} pontos</strong>}
            </motion.li>
          ))}
        </ol>
        <p className={`tg-destaque ${d.estado === 'sem' ? 'is-neutro' : ''}`}>
          {d.estado === 'sem' ? <Info size={18} /> : voce ? <PartyPopper size={18} /> : <Target size={18} />}
          {d.estado === 'sem' ? 'Você não participou desta edição. Fique de olho nas próximas!' : voce ? `Seus ${fmt(d.eu.saldo)} pontos já estão disponíveis no Clube JG.` : `Você terminou em ${d.eu.pos}º lugar, com ${fmt(d.eu.pontos)} pontos.`}
        </p>
        <button className="rx-btn is-primario tg-modal__ok" onClick={onFechar}>
          Ver resultado final
        </button>
      </motion.div>
    </>
  )
}

function Confete() {
  const cores = ['#E8A800', '#441f67', '#b98bf0', '#C27A3E', '#97A3B6']
  return (
    <div className="tg-confete" aria-hidden>
      {Array.from({ length: 26 }, (_, i) => (
        <motion.i
          key={i}
          style={{ left: `${(i * 37) % 100}%`, background: cores[i % cores.length], borderRadius: i % 3 ? 2 : '50%' }}
          initial={{ y: -20, opacity: 0, rotate: 0 }}
          animate={{ y: 150 + ((i * 53) % 60), opacity: [0, 1, 1, 0], rotate: (i % 2 ? 1 : -1) * 360 }}
          transition={{ duration: 1.8 + (i % 5) * 0.2, delay: 0.1 + (i % 7) * 0.06, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ só do protótipo: troca de cenário */
function Cenarios({ aberto, estado, onAbrir, onEscolher }: { aberto: boolean; estado: Estado; onAbrir: () => void; onEscolher: (e: Estado, modal: boolean) => void }) {
  return (
    <div className="tg-cen">
      <AnimatePresence>
        {aberto && (
          <motion.div className="tg-cen__menu" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
            <p>Cenário do protótipo</p>
            {ESTADOS.map((e) => (
              <button key={e.id} className={estado === e.id ? 'is-on' : ''} onClick={() => onEscolher(e.id, false)}>
                <b>{e.rotulo}</b>
                <small>{e.desc}</small>
              </button>
            ))}
            <button className="tg-cen__modal" onClick={() => onEscolher(estado, true)}>
              <b>Rever o modal de encerramento</b>
              <small>Como aparece no 1º acesso depois do fim</small>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <button className="tg-cen__btn" onClick={onAbrir} aria-expanded={aberto}>
        <Settings2 size={16} /> Cenário: {ESTADOS.find((e) => e.id === estado)?.rotulo}
      </button>
    </div>
  )
}
