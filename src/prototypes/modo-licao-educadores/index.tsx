// Modo Lição · plataforma Educadores (Criar › Lição) — fluxo de criação de lições.
// Navegável construído a partir do piloto no Figma (ieTkRqY6aFSFcg6llmmxNH): casca e estilos do kit Educadores (rgx.css) + peças desta jornada (lic.css).
// Atalhos: #/?screen=configuracoes | estudantes | topicos | exemplos | conteudos | resumo | resumo-autoral | video | audio | revisao | publicada | zero
import { AnimatePresence, Reorder, motion, useDragControls } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  BookText,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleAlert,
  CircleCheck,
  CircleHelp,
  Clock,
  Eye,
  ExternalLink,
  FlaskConical,
  GraduationCap,
  GripVertical,
  Home,
  Info,
  Lock,
  Menu,
  MessageSquareText,
  Pencil,
  Plus,
  Rocket,
  School,
  Search,
  Shuffle,
  Sparkles,
  Trash2,
  TriangleAlert,
  UserRound,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { PrototypeProps } from '../../platform/journeys'
import '../gamificacao-geniex-educadores/rgx.css'
import {
  AGORA,
  CATALOGO,
  DISC,
  DISCIPLINAS,
  ESCOLAS,
  MAX_DISC,
  MAX_MSG,
  MAX_NOME,
  MENSAGEM_INICIAL,
  OBJ,
  POUCAS,
  SEL_INICIAL,
  T_EGITO,
  T_PIRAMIDES,
  T_PLANIF,
  conteudosIniciais,
  dataHora,
  fmtData,
  plural,
  quizDe,
  topicoPorId,
  turmaPorId,
  type Conteudo,
  type Disciplina,
  type SelTurma,
  type Tipo,
} from './data'
import './lic.css'
import { DrawerEstudantes, DrawerExemplos, EditorMensagem, ModalAudio, ModalPrevia, ModalResumo, ModalVideo, textoDoHtml } from './modais'
import { Aviso, Badge, Caixa, Contador, Erro, ICONE_OBJ, Modal, Ponto, SecTit, TileObj } from './pecas'

type Toast = { titulo: string; texto?: string; icone: LucideIcon }
type Sobre = { tipo: 'resumo' | 'video' | 'audio'; topico: string; editar?: Conteudo } | null

const ETAPAS = ['Configurações iniciais', 'Disciplinas e tópicos', 'Conteúdos dos tópicos', 'Mensagem e revisão']

type Estado = {
  etapa: number
  alcancada: number
  publicada: boolean
  nome: string
  sel: Record<string, SelTurma>
  ini: { d: string; h: string }
  fim: { d: string; h: string }
  discs: Disciplina[]
  ativa: Disciplina | null
  topicos: Record<string, string[]>
  conteudos: Record<string, Conteudo[]>
  topAtivo: string | null
  /** HTML do editor rico (texto, cores e imagens) */
  mensagem: string
}

function exemplo(): Estado {
  return {
    etapa: 0,
    alcancada: 3,
    publicada: false,
    nome: 'Conhecendo as pirâmides',
    sel: structuredClone(SEL_INICIAL),
    ini: { d: '2026-11-23', h: '07:30' },
    fim: { d: '2026-11-30', h: '23:59' },
    discs: ['Matemática', 'História'],
    ativa: 'Matemática',
    topicos: { Matemática: [T_PIRAMIDES, T_PLANIF], História: [T_EGITO] },
    conteudos: conteudosIniciais(),
    topAtivo: T_PIRAMIDES,
    mensagem: MENSAGEM_INICIAL,
  }
}
function zero(): Estado {
  return { etapa: 0, alcancada: 0, publicada: false, nome: '', sel: {}, ini: { d: '', h: '' }, fim: { d: '', h: '' }, discs: [], ativa: null, topicos: {}, conteudos: {}, topAtivo: null, mensagem: '' }
}

function inicio(screen?: string | null) {
  const e = screen === 'zero' ? zero() : exemplo()
  const o: { drawer?: string; exemplos?: string; sobre?: Sobre } = {}
  switch (screen) {
    case 'estudantes':
      o.drawer = '6b'
      break
    case 'topicos':
      e.etapa = 1
      break
    case 'exemplos':
      e.etapa = 1
      o.exemplos = T_PIRAMIDES
      break
    case 'conteudos':
      e.etapa = 2
      break
    case 'resumo':
    case 'resumo-autoral':
    case 'video':
      e.etapa = 2
      o.sobre = { tipo: screen === 'video' ? 'video' : 'resumo', topico: T_PIRAMIDES, editar: screen === 'resumo-autoral' ? e.conteudos[T_PIRAMIDES][0] : undefined }
      break
    case 'audio':
      e.etapa = 2
      e.topAtivo = T_EGITO
      o.sobre = { tipo: 'audio', topico: T_EGITO }
      break
    case 'revisao':
      e.etapa = 3
      break
    case 'publicada':
      e.etapa = 3
      e.publicada = true
      break
  }
  return { e, o }
}

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

/* ---------------------------------------------------------------- cálculos */
const qtdTurma = (id: string, s: SelTurma) => (s.modo === 'todos' ? (turmaPorId(id)?.turma.estudantes.length ?? 0) : s.ids.length)
const totalEstudantes = (sel: Record<string, SelTurma>) => Object.entries(sel).reduce((a, [id, s]) => a + qtdTurma(id, s), 0)
/** sequência que o estudante vê: conteúdos opcionais na ordem do professor + quiz obrigatório no fim */
const sequencia = (e: Estado, id: string): Conteudo[] => {
  const tp = topicoPorId(id)?.topico
  return [...(e.conteudos[id] ?? []), ...(tp ? [quizDe(tp)] : [])]
}
const topicosOrdenados = (e: Estado) => e.discs.flatMap((d) => CATALOGO[d].flatMap((u) => u.topicos.filter((t) => (e.topicos[d] ?? []).includes(t.id)).map((t) => ({ d, unidade: u.nome, t }))))

function errosEtapa(e: Estado, etapa: number): Record<string, string> {
  const er: Record<string, string> = {}
  if (etapa === 0) {
    if (!e.nome.trim()) er.nome = 'Dê um nome para a lição.'
    else if (e.nome.length > MAX_NOME) er.nome = `Use no máximo ${MAX_NOME} caracteres.`
    if (totalEstudantes(e.sel) === 0) er.publico = 'Escolha pelo menos uma turma para receber a lição.'
    const a = dataHora(e.ini.d, e.ini.h)
    const b = dataHora(e.fim.d, e.fim.h)
    if (!a) er.ini = 'Preencha a data e o horário de início.'
    else if (a < AGORA) er.ini = 'O início não pode ser no passado.'
    if (!b) er.fim = 'Preencha a data e o horário de término.'
    else if (a && b <= a) er.fim = 'O término precisa ser depois do início.'
  }
  if (etapa === 1) {
    if (e.discs.length === 0) er.discs = 'Escolha pelo menos uma disciplina.'
    const sem = e.discs.filter((d) => !(e.topicos[d] ?? []).length)
    if (sem.length) er.discs = `Escolha pelo menos 1 tópico em ${sem.join(' e ')} ou remova a disciplina.`
  }
  if (etapa === 3 && textoDoHtml(e.mensagem).length > MAX_MSG) er.mensagem = `Use no máximo ${MAX_MSG.toLocaleString('pt-BR')} caracteres.`
  return er
}

/* ================================================================= componente */
export default function ModoLicaoEducadores({ startScreen }: PrototypeProps) {
  const ini = useMemo(() => inicio(startScreen), [startScreen])
  const [e, setE] = useState<Estado>(ini.e)
  const [tentou, setTentou] = useState<Record<number, boolean>>({})
  const [drawer, setDrawer] = useState<string | null>(ini.o.drawer ?? null)
  const [exem, setExem] = useState<string | null>(ini.o.exemplos ?? null)
  const [sobre, setSobre] = useState<Sobre>(ini.o.sobre ?? null)
  const [previa, setPrevia] = useState<Conteudo | null>(null)
  const [confirmar, setConfirmar] = useState(false)
  const [proto, setProto] = useState(false)
  const [gaveta, setGaveta] = useState(false)
  const [recolhida, setRecolhida] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)
  const semLateral = useMedia('(max-width: 899px)')
  const set = (p: Partial<Estado> | ((s: Estado) => Partial<Estado>)) => setE((s) => ({ ...s, ...(typeof p === 'function' ? p(s) : p) }))

  useEffect(() => {
    document.title = 'Nova lição · Educadores · Protótipo Jovens Gênios'
  }, [])
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3800)
    return () => clearTimeout(t)
  }, [toast])
  useEffect(() => {
    const on = (ev: KeyboardEvent) => {
      if (ev.key !== 'Escape') return
      setDrawer(null)
      setExem(null)
      setSobre(null)
      setPrevia(null)
      setConfirmar(false)
      setProto(false)
      setGaveta(false)
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [])

  const rolarTopo = () => document.querySelector('.rx-rolagem')?.scrollTo({ top: 0, behavior: 'smooth' })
  const fora = (n: string) => {
    setGaveta(false)
    setToast({ icone: Info, titulo: `“${n}” não faz parte deste protótipo`, texto: 'Aqui você navega pela criação de uma lição.' })
  }
  const irEtapa = (n: number) => {
    set((s) => ({ etapa: n, alcancada: Math.max(s.alcancada, n), topAtivo: n === 2 && (!s.topAtivo || !topicosOrdenados(s).some(({ t }) => t.id === s.topAtivo)) ? (topicosOrdenados(s)[0]?.t.id ?? null) : s.topAtivo }))
    rolarTopo()
  }
  const avancar = () => {
    const er = errosEtapa(e, e.etapa)
    if (Object.keys(er).length) {
      setTentou((t) => ({ ...t, [e.etapa]: true }))
      setToast({ icone: CircleAlert, titulo: 'Falta pouco para continuar', texto: Object.values(er)[0] })
      return
    }
    irEtapa(e.etapa + 1)
  }
  const reiniciar = (nova: Estado) => {
    setE(nova)
    setTentou({})
    setProto(false)
    rolarTopo()
  }

  const er = tentou[e.etapa] ? errosEtapa(e, e.etapa) : {}
  const total = totalEstudantes(e.sel)

  return (
    <div className={`rx lc ${recolhida ? 'is-recolhida' : ''}`}>
      <AnimatePresence>{gaveta && <motion.div className="rx-veu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setGaveta(false)} />}</AnimatePresence>
      <Sidebar aberta={gaveta} recolhida={recolhida && !semLateral} onFora={fora} onLicao={() => setGaveta(false)} onRecolher={() => (semLateral ? setGaveta(false) : setRecolhida((r) => !r))} />
      <div className="rx-principal">
        <header className="rx-topo">
          <button className="rx-icone-btn rx-topo__menu" onClick={() => setGaveta(true)} aria-label="Abrir menu">
            <Menu size={22} />
          </button>
          <nav className="rx-migalhas" aria-label="Você está em">
            <span>
              Criar <i>/</i>
            </span>
            <span className="is-atual">Nova lição</span>
          </nav>
        </header>
        <main className="rx-rolagem">
          <div className="rx-conteudo lc-conteudo">
            {e.publicada ? (
              <Publicada e={e} total={total} onNova={() => reiniciar(zero())} onFora={fora} />
            ) : (
              <>
                <div className="lc-cab">
                  <div>
                    <h1 className="rx-h1">Nova lição</h1>
                    <p>{e.etapa === 3 ? 'Escreva a mensagem para os estudantes e confira tudo antes de publicar.' : 'Monte uma jornada de aprendizagem com resumos, vídeos, áudios e quizzes para seus estudantes.'}</p>
                  </div>
                  <Badge icone={CircleCheck}>Rascunho salvo automaticamente</Badge>
                </div>
                <Stepper etapa={e.etapa} alcancada={e.alcancada} onIr={irEtapa} />
                {e.etapa === 0 && <Etapa1 e={e} set={set} er={er} total={total} onEstudantes={setDrawer} />}
                {e.etapa === 1 && <Etapa2 e={e} set={set} er={er} onExemplos={setExem} onToast={setToast} />}
                {e.etapa === 2 && <Etapa3 e={e} set={set} onSobre={setSobre} onPrevia={(c) => (c.tipo === 'Quiz' ? setExem(e.topAtivo) : setPrevia(c))} onExemplos={setExem} onToast={setToast} />}
                {e.etapa === 3 && <Etapa4 e={e} set={set} er={er} total={total} onIr={irEtapa} />}
                <Rodape
                  etapa={e.etapa}
                  erro={Object.values(er)[0]}
                  onVoltar={() => irEtapa(e.etapa - 1)}
                  onAvancar={avancar}
                  onCancelar={() => setToast({ icone: Info, titulo: 'O rascunho fica salvo', texto: 'Você pode continuar a lição depois. (A lista de lições não faz parte deste protótipo.)' })}
                  onSalvarSair={() => setToast({ icone: CircleCheck, titulo: 'Rascunho salvo', texto: 'A lição continua como rascunho até você publicar.' })}
                  onPublicar={() => {
                    const x = errosEtapa(e, 3)
                    if (Object.keys(x).length) {
                      setTentou((t) => ({ ...t, 3: true }))
                      return
                    }
                    setConfirmar(true)
                  }}
                />
              </>
            )}
          </div>
        </main>
      </div>

      <DrawerEstudantes
        turmaId={drawer}
        atual={drawer ? e.sel[drawer] : undefined}
        onFechar={() => setDrawer(null)}
        onAplicar={(s) => {
          set((st) => ({ sel: { ...st.sel, [drawer!]: s } }))
          setDrawer(null)
          setToast({ icone: Users, titulo: 'Seleção aplicada', texto: `${turmaPorId(drawer!)?.turma.nome}: ${s.modo === 'todos' ? 'todos os estudantes' : plural(s.ids.length, 'estudante', 'estudantes')}.` })
        }}
      />
      <DrawerExemplos
        topicoId={exem}
        selecionado={!!exem && Object.values(e.topicos).some((l) => l.includes(exem))}
        onFechar={() => setExem(null)}
        onIncluir={() => {
          const r = topicoPorId(exem!)
          if (r) set((s) => ({ discs: s.discs.includes(r.disc) ? s.discs : [...s.discs, r.disc], topicos: { ...s.topicos, [r.disc]: [...(s.topicos[r.disc] ?? []), r.topico.id] } }))
          setExem(null)
          setToast({ icone: Check, titulo: 'Tópico incluído na lição', texto: r?.topico.nome })
        }}
      />
      {(['resumo', 'video', 'audio'] as const).map((tp) => {
        const M = tp === 'resumo' ? ModalResumo : tp === 'video' ? ModalVideo : ModalAudio
        return (
          <M
            key={tp}
            aberto={sobre?.tipo === tp}
            topicoId={sobre?.topico ?? T_PIRAMIDES}
            editar={sobre?.tipo === tp ? sobre.editar : undefined}
            onFechar={() => setSobre(null)}
            onSalvar={(c) => {
              const top = sobre!.topico
              set((s) => {
                const l = s.conteudos[top] ?? []
                const existe = l.some((x) => x.id === c.id)
                const nova = existe ? l.map((x) => (x.id === c.id ? c : x)) : [...l, c]
                return { conteudos: { ...s.conteudos, [top]: nova } }
              })
              setSobre(null)
              setToast({ icone: CircleCheck, titulo: sobre?.editar ? `${c.tipo} atualizado` : `${c.tipo} adicionado ao tópico`, texto: c.titulo })
            }}
          />
        )
      })}
      <ModalPrevia c={previa} onFechar={() => setPrevia(null)} />
      <ModalPublicar
        aberto={confirmar}
        e={e}
        total={total}
        onFechar={() => setConfirmar(false)}
        onPublicar={() => {
          setConfirmar(false)
          set({ publicada: true })
          rolarTopo()
        }}
      />

      <div className="lc-proto">
        <AnimatePresence>
          {proto && (
            <motion.div className="lc-proto__menu" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
              <small>Protótipo · como começar</small>
              <button onClick={() => reiniciar(exemplo())}>
                <BookOpen size={16} /> Lição de exemplo (como no Figma)
              </button>
              <button onClick={() => reiniciar(zero())}>
                <Plus size={16} /> Começar do zero
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <button className="lc-proto__btn" onClick={() => setProto((p) => !p)} aria-expanded={proto}>
          <FlaskConical size={16} /> Protótipo
        </button>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div className="lc-toast" role="status" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}>
            <toast.icone size={18} />
            <span>
              <b>{toast.titulo}</b>
              {toast.texto && <small>{toast.texto}</small>}
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

/* ================================================================= casca */
function Sidebar({ aberta, recolhida, onFora, onLicao, onRecolher }: { aberta: boolean; recolhida: boolean; onFora: (n: string) => void; onLicao: () => void; onRecolher: () => void }) {
  const item = (Ic: LucideIcon, n: string) => (
    <button className="rx-side__item" onClick={() => onFora(n)} title={n}>
      <Ic size={18} /> <span>{n}</span> <ChevronRight size={16} className="rx-side__seta" />
    </button>
  )
  return (
    <aside className={`rx-side ${aberta ? 'is-aberta' : ''}`}>
      <div className="rx-side__marca">
        <img src="./lic/logo.webp" alt="Jovens Gênios" />
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
        <div className="rx-side__item is-grupo" title="Criar">
          <Plus size={18} /> <span>Criar</span> <ChevronDown size={16} className="rx-side__seta" />
        </div>
        <div className="rx-side__sub">
          {['Tarefa', 'Lição', 'Campeonato', 'Prova Genial', 'Projetos'].map((n) => (
            <button key={n} className={`rx-side__subitem ${n === 'Lição' ? 'lc-on' : ''}`} aria-current={n === 'Lição' ? 'page' : undefined} onClick={() => (n === 'Lição' ? onLicao() : onFora(`Criar › ${n}`))}>
              {n}
            </button>
          ))}
        </div>
        {item(BarChart3, 'Relatórios')}
        {item(Sparkles, 'Assistente')}
        {item(GraduationCap, 'Formação')}
        {item(BookText, 'Biblioteca')}
        {item(CircleHelp, 'Central de ajuda')}
      </nav>
      <div className="rx-side__usuario">
        <span className="rx-avatar lc-avatar-eu">RR</span>
        <span className="rx-side__txt">
          <b>Rodrigo Ribeiro</b>
          <small>rodrigo.ribeiro@jovensgenios.com</small>
        </span>
      </div>
    </aside>
  )
}

function Stepper({ etapa, alcancada, onIr }: { etapa: number; alcancada: number; onIr: (n: number) => void }) {
  return (
    <>
      <ol className="lc-stepper" aria-label="Etapas da criação">
        {ETAPAS.map((n, i) => {
          const est = i < etapa ? 'feita' : i === etapa ? 'atual' : 'pendente'
          const pode = i !== etapa && i <= alcancada
          return (
            <li key={n} className={`is-${est}`}>
              <button disabled={!pode} onClick={() => onIr(i)} aria-current={i === etapa ? 'step' : undefined}>
                <span className="lc-stepper__n">{i < etapa ? <Check size={13} strokeWidth={3} /> : i + 1}</span>
                <span className="lc-stepper__t">{n}</span>
              </button>
              {i < ETAPAS.length - 1 && <i />}
            </li>
          )
        })}
      </ol>
      <div className="lc-stepper-cel" aria-hidden>
        <b>
          Etapa {etapa + 1} de {ETAPAS.length}
        </b>
        <span>{ETAPAS[etapa]}</span>
        <span className="lc-prog">
          <i style={{ width: `${((etapa + 1) / ETAPAS.length) * 100}%` }} />
        </span>
      </div>
    </>
  )
}

function Rodape({ etapa, erro, onVoltar, onAvancar, onCancelar, onSalvarSair, onPublicar }: { etapa: number; erro?: string; onVoltar: () => void; onAvancar: () => void; onCancelar: () => void; onSalvarSair: () => void; onPublicar: () => void }) {
  return (
    <div className="lc-rodape">
      {erro && (
        <Aviso tom="red" icone={CircleAlert}>
          {erro}
        </Aviso>
      )}
      <div className="lc-rodape__acoes">
        {etapa === 0 ? (
          <button className="rx-btn is-contorno" onClick={onCancelar}>
            Cancelar
          </button>
        ) : (
          <button className="rx-btn is-contorno" onClick={onVoltar}>
            <ArrowLeft size={16} /> Voltar
          </button>
        )}
        <span className="rx-espaco" />
        {etapa === 3 ? (
          <>
            <button className="rx-btn is-contorno" onClick={onSalvarSair}>
              Salvar e sair
            </button>
            <button className="rx-btn is-primario" onClick={onPublicar}>
              <Rocket size={16} /> Publicar lição
            </button>
          </>
        ) : (
          <button className="rx-btn is-primario" onClick={onAvancar}>
            Próximo: {ETAPAS[etapa + 1].toLowerCase()} <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  )
}

type SetE = (p: Partial<Estado> | ((s: Estado) => Partial<Estado>)) => void

/* ================================================================= etapa 1 */
function Etapa1({ e, set, er, total, onEstudantes }: { e: Estado; set: SetE; er: Record<string, string>; total: number; onEstudantes: (id: string) => void }) {
  const [busca, setBusca] = useState('')
  const [abertas, setAbertas] = useState<string[]>(['jardim'])
  const [ano, setAno] = useState('6º ano')
  const q = busca.trim().toLowerCase()
  const escolas = ESCOLAS.map((s) => ({ ...s, turmas: s.turmas.filter((t) => !q || s.nome.toLowerCase().includes(q) || t.nome.toLowerCase().includes(q)) })).filter((s) => s.turmas.length)
  const alternaTurma = (id: string) => set((s) => {
    const sel = { ...s.sel }
    if (sel[id]) delete sel[id]
    else sel[id] = { modo: 'todos', ids: [] }
    return { sel }
  })
  const alternaEscola = (id: string) => set((s) => {
    const esc = ESCOLAS.find((x) => x.id === id)!
    const todas = esc.turmas.every((t) => s.sel[t.id])
    const sel = { ...s.sel }
    for (const t of esc.turmas) {
      if (todas) delete sel[t.id]
      else if (!sel[t.id]) sel[t.id] = { modo: 'todos', ids: [] }
    }
    return { sel }
  })
  const a = dataHora(e.ini.d, e.ini.h)
  const b = dataHora(e.fim.d, e.fim.h)
  // duração em dias de calendário (23/11 → 30/11 = 7 dias), como no Figma
  const dias = a && b && b > a ? Math.max(1, Math.round((new Date(`${e.fim.d}T00:00`).getTime() - new Date(`${e.ini.d}T00:00`).getTime()) / 86400000)) : null
  const resumoTurmas = Object.entries(e.sel).map(([id, s]) => `${qtdTurma(id, s)} do ${turmaPorId(id)?.turma.nome}${ESCOLAS.length > 1 ? '' : ''}`)
  const escolasSel = [...new Set(Object.keys(e.sel).map((id) => turmaPorId(id)?.escola.nome))]
  return (
    <>
      <section className="rx-cartao">
        <SecTit icone={BookOpen} titulo="Informações da lição" desc="O nome identifica a lição aqui e no Exploradores. A mensagem para os estudantes fica para o final da criação." />
        <label className="lc-campo">
          <span className="lc-rot">Nome da lição *</span>
          <input className={`lc-input ${er.nome ? 'is-erro' : ''}`} value={e.nome} maxLength={MAX_NOME} onChange={(ev) => set({ nome: ev.target.value })} placeholder="Ex.: Conhecendo as pirâmides" />
          {er.nome ? <Erro>{er.nome}</Erro> : <Contador n={e.nome.length} max={MAX_NOME} />}
        </label>
      </section>

      <section className="rx-cartao">
        <SecTit icone={Users} titulo="Para quem é a lição" desc="Escolha os anos, as turmas e os estudantes que vão receber a lição." />
        <div className="lc-filtros">
          <label className="lc-campo">
            <span className="lc-rot">Etapa de ensino</span>
            <span className="lc-select">
              <select defaultValue="Ensino Fundamental II">
                <option>Ensino Fundamental II</option>
              </select>
              <ChevronDown size={16} />
            </span>
          </label>
          <label className="lc-campo">
            <span className="lc-rot">Anos escolares</span>
            <span className="lc-select">
              <select value={ano} onChange={(ev) => setAno(ev.target.value)}>
                {['6º ano', '7º ano', '8º ano', '9º ano'].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
              <ChevronDown size={16} />
            </span>
          </label>
          <label className="rx-busca lc-busca">
            <Search size={16} />
            <input value={busca} onChange={(ev) => setBusca(ev.target.value)} placeholder="Buscar escola ou turma" />
          </label>
        </div>
        {ano !== '6º ano' ? (
          <div className="lc-vazio">
            <School size={28} />
            <b>Neste protótipo, só o 6º ano tem turmas</b>
            <small>Volte para o 6º ano para escolher as turmas da EE Jardim das Árvores e da EMEF Monteiro Lobato.</small>
          </div>
        ) : (
          <div className={`lc-escolas ${er.publico ? 'is-erro' : ''}`}>
            {escolas.map((esc) => {
              const orig = ESCOLAS.find((x) => x.id === esc.id)!
              const nSel = orig.turmas.filter((t) => e.sel[t.id]).length
              const aberta = abertas.includes(esc.id) || !!q
              return (
                <div key={esc.id} className="lc-escola">
                  <div className="lc-escola__cab">
                    <Caixa on={nSel === orig.turmas.length} parcial={nSel > 0 && nSel < orig.turmas.length} onClick={() => alternaEscola(esc.id)} rotulo={`Todas as turmas da ${esc.nome}`} />
                    <button className="lc-escola__nome" onClick={() => setAbertas((l) => (l.includes(esc.id) ? l.filter((x) => x !== esc.id) : [...l, esc.id]))} aria-expanded={aberta}>
                      <School size={16} />
                      <b>{esc.nome}</b>
                      <small>
                        {nSel} de {orig.turmas.length} turmas
                      </small>
                      <span className="rx-espaco" />
                      {aberta ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                  {aberta && (
                    <div className="lc-turmas">
                      <div className="lc-turma is-cab" aria-hidden>
                        <span />
                        <small>Turma</small>
                        <small>Estudantes na turma</small>
                        <small>Quem vai receber</small>
                        <span />
                      </div>
                      {esc.turmas.map((t) => {
                        const s = e.sel[t.id]
                        return (
                          <div key={t.id} className={`lc-turma ${s ? 'is-on' : ''}`}>
                            <Caixa on={!!s} onClick={() => alternaTurma(t.id)} rotulo={t.nome} />
                            <b>{t.nome}</b>
                            <span className="lc-mudo">{t.estudantes.length} estudantes</span>
                            <span>
                              {s ? (
                                s.modo === 'todos' ? (
                                  <Badge tom="verde" icone={Users}>
                                    Todos os estudantes
                                  </Badge>
                                ) : (
                                  <Badge tom="roxo" icone={UserRound}>
                                    {s.ids.length} de {t.estudantes.length} estudantes
                                  </Badge>
                                )
                              ) : (
                                <span className="lc-mudo">—</span>
                              )}
                            </span>
                            <button className="rx-link lc-turma__acao" onClick={() => onEstudantes(t.id)}>
                              {s?.modo === 'alguns' ? <Pencil size={14} /> : <UserRound size={14} />} {s?.modo === 'alguns' ? 'Editar seleção' : 'Escolher estudantes'}
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
            {escolas.length === 0 && <p className="lc-vazio-p">Nenhuma escola ou turma encontrada para “{busca}”.</p>}
          </div>
        )}
        {er.publico ? (
          <Erro>{er.publico}</Erro>
        ) : total > 0 ? (
          <Aviso icone={Users}>
            <b>{plural(total, 'estudante vai', 'estudantes vão')} receber esta lição</b>: {resumoTurmas.join(' e ')}, {escolasSel.length > 1 ? `de ${escolasSel.length} escolas` : `da ${escolasSel[0]}`}.
          </Aviso>
        ) : (
          <small className="lc-mudo">Nenhuma turma selecionada ainda.</small>
        )}
      </section>

      <section className="rx-cartao">
        <SecTit icone={CalendarDays} titulo="Período de realização" desc="Os estudantes acessam a lição a partir do início e podem fazê-la até o término." />
        <div className="lc-periodo">
          {(
            [
              ['ini', 'Início'],
              ['fim', 'Término'],
            ] as const
          ).map(([k, n], i) => (
            <div key={k} className="lc-periodo__grupo">
              {i === 1 && <ArrowRight size={20} className="lc-periodo__seta" />}
              <fieldset>
                <legend>{n}</legend>
                <label className="lc-campo">
                  <span className="lc-rot is-leve">Data</span>
                  <span className={`lc-input is-icone ${er[k] ? 'is-erro' : ''}`}>
                    <CalendarDays size={16} />
                    <input type="date" value={e[k].d} min="2026-11-16" onChange={(ev) => set((s) => ({ [k]: { ...s[k], d: ev.target.value } }))} aria-label={`Data de ${n.toLowerCase()}`} />
                  </span>
                </label>
                <label className="lc-campo">
                  <span className="lc-rot is-leve">Horário</span>
                  <span className={`lc-input is-icone ${er[k] ? 'is-erro' : ''}`}>
                    <Clock size={16} />
                    <input type="time" value={e[k].h} onChange={(ev) => set((s) => ({ [k]: { ...s[k], h: ev.target.value } }))} aria-label={`Horário de ${n.toLowerCase()}`} />
                  </span>
                </label>
                {er[k] && <Erro>{er[k]}</Erro>}
              </fieldset>
            </div>
          ))}
        </div>
        <div className="lc-linha is-quebra">
          {dias !== null ? (
            <Badge tom="roxo" icone={Clock}>
              Duração: {plural(dias, 'dia', 'dias')}
            </Badge>
          ) : a && b ? (
            <Badge tom="red" icone={TriangleAlert}>
              Período inválido
            </Badge>
          ) : null}
          <small className="lc-mudo">A lição fica visível para os estudantes só a partir do início.</small>
        </div>
      </section>
    </>
  )
}

/* ================================================================= etapa 2 */
function Etapa2({ e, set, er, onExemplos, onToast }: { e: Estado; set: SetE; er: Record<string, string>; onExemplos: (id: string) => void; onToast: (t: Toast) => void }) {
  const [pop, setPop] = useState(false)
  const [busca, setBusca] = useState('')
  const [abertas, setAbertas] = useState<string[]>(['Matemática|Geometria', 'História|A invenção do mundo clássico e outras sociedades'])
  const popRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!pop) return
    const on = (ev: MouseEvent) => !popRef.current?.contains(ev.target as Node) && setPop(false)
    document.addEventListener('mousedown', on)
    return () => document.removeEventListener('mousedown', on)
  }, [pop])
  const ativa = e.ativa && e.discs.includes(e.ativa) ? e.ativa : e.discs[0]
  const limite = e.discs.length >= MAX_DISC
  const addDisc = (d: Disciplina) => {
    set((s) => ({ discs: [...s.discs, d], ativa: d, topicos: { ...s.topicos, [d]: s.topicos[d] ?? [] } }))
    setPop(false)
    setAbertas((l) => [...l, `${d}|${CATALOGO[d][0].nome}`])
  }
  const remDisc = (d: Disciplina) => {
    set((s) => ({ discs: s.discs.filter((x) => x !== d), ativa: s.ativa === d ? (s.discs.find((x) => x !== d) ?? null) : s.ativa }))
    onToast({ icone: Info, titulo: `${d} saiu da lição`, texto: 'Se você adicionar de novo, os tópicos e conteúdos escolhidos voltam.' })
  }
  const alterna = (d: Disciplina, id: string) => set((s) => {
    const l = s.topicos[d] ?? []
    return { topicos: { ...s.topicos, [d]: l.includes(id) ? l.filter((x) => x !== id) : [...l, id] } }
  })
  const q = busca.trim().toLowerCase()
  const unidades = ativa ? CATALOGO[ativa].map((u) => ({ ...u, topicos: u.topicos.filter((t) => !q || `${t.nome} ${t.bncc} ${t.desc}`.toLowerCase().includes(q)) })).filter((u) => u.topicos.length) : []
  const sels = topicosOrdenados(e)
  return (
    <>
      <section className="rx-cartao">
        <SecTit icone={GraduationCap} titulo="Disciplinas da lição" desc="Escolha até 5 disciplinas. Cada uma tem os próprios tópicos e conteúdos, e você pode alternar entre elas sem perder nada.">
          <Badge tom="roxo">
            {e.discs.length} de {MAX_DISC} disciplinas
          </Badge>
        </SecTit>
        <div className="lc-discs" role="tablist" aria-label="Disciplinas da lição">
          {e.discs.map((d) => {
            const n = (e.topicos[d] ?? []).length
            return (
              <span key={d} className={`lc-disc ${d === ativa ? 'is-on' : ''}`}>
                <button role="tab" aria-selected={d === ativa} onClick={() => set({ ativa: d })}>
                  <Ponto d={d} /> {d}
                  <Badge tom={!n ? (er.discs ? 'red' : 'amarelo') : d === ativa ? 'roxo' : 'neutro'}>{n ? plural(n, 'tópico', 'tópicos') : 'sem tópicos'}</Badge>
                </button>
                <button className="lc-disc__x" aria-label={`Remover ${d}`} onClick={() => remDisc(d)}>
                  <X size={14} />
                </button>
              </span>
            )
          })}
          <div className="lc-pop-wrap" ref={popRef}>
            <button className="rx-btn lc-fantasma" disabled={limite} title={limite ? 'Limite de 5 disciplinas' : undefined} onClick={() => setPop((p) => !p)} aria-expanded={pop}>
              <Plus size={16} /> Adicionar disciplina
            </button>
            {pop && (
              <div className="rx-pop lc-pop" role="menu">
                <small>Disciplinas do 6º ano</small>
                {DISCIPLINAS.filter((d) => !e.discs.includes(d)).map((d) => (
                  <button key={d} role="menuitem" onClick={() => addDisc(d)}>
                    <Ponto d={d} /> {d}
                  </button>
                ))}
              </div>
            )}
          </div>
          {limite && <small className="lc-mudo">Você chegou ao limite de 5 disciplinas.</small>}
        </div>
      </section>

      {ativa ? (
        <div className="lc-colunas">
          <section className="rx-cartao">
            <div className="lc-sectit">
              <Ponto d={ativa} tam={12} />
              <div className="lc-sectit__txt">
                <h2>Tópicos de {ativa}</h2>
                <p>6º ano · organizados por unidade temática da BNCC</p>
              </div>
            </div>
            <label className="rx-busca lc-busca is-cheia">
              <Search size={16} />
              <input value={busca} onChange={(ev) => setBusca(ev.target.value)} placeholder="Buscar por tópico ou habilidade da BNCC (ex.: EF06MA17)" />
              {busca && (
                <button className="rx-icone-btn" aria-label="Limpar busca" onClick={() => setBusca('')}>
                  <X size={14} />
                </button>
              )}
            </label>
            <div className="lc-unidades">
              {unidades.map((u) => {
                const k = `${ativa}|${u.nome}`
                const aberta = abertas.includes(k) || !!q
                const nSel = u.topicos.filter((t) => (e.topicos[ativa] ?? []).includes(t.id)).length
                return (
                  <div key={k} className="lc-unidade">
                    <button className={`lc-unidade__cab ${aberta ? 'is-aberta' : ''}`} onClick={() => setAbertas((l) => (l.includes(k) ? l.filter((x) => x !== k) : [...l, k]))} aria-expanded={aberta}>
                      {aberta ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      <b>{u.nome}</b>
                      <small>{plural(u.topicos.length, 'tópico', 'tópicos')}</small>
                      <span className="rx-espaco" />
                      {nSel > 0 && (
                        <Badge tom="roxo" icone={Check}>
                          {plural(nSel, 'selecionado', 'selecionados')}
                        </Badge>
                      )}
                    </button>
                    {aberta &&
                      u.topicos.map((t) => {
                        const on = (e.topicos[ativa] ?? []).includes(t.id)
                        return (
                          <div key={t.id} className={`lc-topico ${on ? 'is-on' : ''}`}>
                            <Caixa on={on} onClick={() => alterna(ativa, t.id)} rotulo={t.nome} />
                            <button className="lc-topico__txt" onClick={() => alterna(ativa, t.id)}>
                              <span className="lc-linha is-quebra">
                                <b>{t.nome}</b>
                                <Badge>{t.bncc}</Badge>
                                {t.questoes < POUCAS && (
                                  <Badge tom="amarelo" icone={TriangleAlert}>
                                    Poucas questões
                                  </Badge>
                                )}
                              </span>
                              <small>{t.desc}</small>
                            </button>
                            <button className="rx-link lc-topico__acao" onClick={() => onExemplos(t.id)}>
                              <Eye size={14} /> Ver exemplos de questões
                            </button>
                          </div>
                        )
                      })}
                  </div>
                )
              })}
              {unidades.length === 0 && (
                <div className="lc-vazio">
                  <Search size={26} />
                  <b>Nenhum tópico encontrado para “{busca}”</b>
                  <small>Tente o nome do tópico, o código da habilidade (ex.: EF06MA17) ou uma palavra da descrição.</small>
                </div>
              )}
            </div>
          </section>
          <aside className="rx-cartao lc-lateral">
            <div>
              <h2 className="lc-h2">Tópicos selecionados</h2>
              <p className="lc-mudo">
                {plural(sels.length, 'tópico', 'tópicos')} em {plural(e.discs.length, 'disciplina', 'disciplinas')}
              </p>
            </div>
            {e.discs.map((d) => {
              const l = sels.filter((x) => x.d === d)
              return (
                <div key={d} className="lc-grupo">
                  <div className="lc-linha">
                    <Ponto d={d} /> <b>{d}</b>
                    <span className="rx-espaco" />
                    <small>{plural(l.length, 'tópico', 'tópicos')}</small>
                  </div>
                  {l.length === 0 && <small className="lc-mudo">Nenhum tópico ainda.</small>}
                  {[...new Set(l.map((x) => x.unidade))].map((un) => (
                    <div key={un} className="lc-grupo__un">
                      <small>{un}</small>
                      {l
                        .filter((x) => x.unidade === un)
                        .map(({ t }) => (
                          <span key={t.id} className="lc-chip">
                            <span>{t.nome}</span>
                            <button className="rx-icone-btn" aria-label={`Remover ${t.nome}`} onClick={() => alterna(d, t.id)}>
                              <X size={14} />
                            </button>
                          </span>
                        ))}
                    </div>
                  ))}
                </div>
              )
            })}
            <Aviso icone={Sparkles}>Cada tópico já vem com o quiz, que é obrigatório. No próximo passo, você pode adicionar resumos, vídeos e áudios antes dele.</Aviso>
          </aside>
        </div>
      ) : (
        <section className="rx-cartao">
          <div className="lc-vazio">
            <GraduationCap size={28} />
            <b>Comece escolhendo uma disciplina</b>
            <small>Use “Adicionar disciplina” para ver as unidades temáticas e os tópicos da BNCC.</small>
          </div>
        </section>
      )}
    </>
  )
}

/* ================================================================= etapa 3 */
function ItemConteudo({ c, n, onPrevia, onEditar, onRemover }: { c: Conteudo; n: number; onPrevia: () => void; onEditar: () => void; onRemover: () => void }) {
  const ctrl = useDragControls()
  return (
    <Reorder.Item value={c} dragListener={false} dragControls={ctrl} className="lc-obj" whileDrag={{ scale: 1.01, boxShadow: '0 12px 28px rgba(0,0,0,.14)' }}>
      <button className="lc-obj__grip" aria-label={`Arrastar para mudar a ordem de ${c.titulo}`} onPointerDown={(ev) => ctrl.start(ev)}>
        <GripVertical size={16} />
      </button>
      <span className="lc-obj__n">{n}</span>
      {c.tipo === 'Vídeo' ? (
        <span className="lc-obj__thumb">
          <img src={c.ytId === 'Fq4Zk3pBh2E' ? './lic/video-thumb.jpg' : `https://img.youtube.com/vi/${c.ytId}/mqdefault.jpg`} alt="" />
        </span>
      ) : (
        <TileObj tipo={c.tipo} tam={44} />
      )}
      <span className="lc-obj__txt">
        <span className="lc-linha">
          <b className="lc-obj__tipo" style={{ color: OBJ[c.tipo].cor }}>
            {c.tipo.toUpperCase()}
          </b>
          <small>· {c.origem}</small>
        </span>
        <b>{c.titulo}</b>
        <small>{c.meta}</small>
      </span>
      <span className="lc-obj__acoes">
        <button className="rx-icone-btn" title="Ver" aria-label={`Ver ${c.titulo}`} onClick={onPrevia}>
          <Eye size={16} />
        </button>
        <button className="rx-icone-btn" title="Editar" aria-label={`Editar ${c.titulo}`} onClick={onEditar}>
          <Pencil size={16} />
        </button>
        <button className="rx-icone-btn is-red" title="Remover" aria-label={`Remover ${c.titulo}`} onClick={onRemover}>
          <Trash2 size={16} />
        </button>
      </span>
    </Reorder.Item>
  )
}

/** quiz obrigatório: fixo no fim da sequência, sem arrastar e sem remover */
function ItemQuiz({ c, n, onExemplos }: { c: Conteudo; n: number; onExemplos: () => void }) {
  return (
    <div className="lc-obj is-fixo">
      <span className="lc-obj__grip is-trava" title="O quiz fica sempre no fim do tópico" aria-label="Posição fixa">
        <Lock size={15} />
      </span>
      <span className="lc-obj__n">{n}</span>
      <TileObj tipo="Quiz" tam={44} />
      <span className="lc-obj__txt">
        <span className="lc-linha is-quebra">
          <b className="lc-obj__tipo" style={{ color: OBJ.Quiz.cor }}>
            QUIZ
          </b>
          <small>· automático</small>
          <Badge tom="amarelo" icone={Lock}>
            Obrigatório
          </Badge>
        </span>
        <b>{c.titulo}</b>
        <small>{c.meta}</small>
      </span>
      <span className="lc-obj__acoes">
        <button className="rx-btn lc-fantasma" onClick={onExemplos}>
          <Eye size={16} /> Ver exemplos
        </button>
      </span>
    </div>
  )
}

function Etapa3({ e, set, onSobre, onPrevia, onExemplos, onToast }: { e: Estado; set: SetE; onSobre: (s: Sobre) => void; onPrevia: (c: Conteudo) => void; onExemplos: (id: string) => void; onToast: (t: Toast) => void }) {
  const lista = topicosOrdenados(e)
  const atual = lista.find((x) => x.t.id === e.topAtivo) ?? lista[0]
  if (!atual) return null
  const cs = e.conteudos[atual.t.id] ?? []
  const quiz = quizDe(atual.t)
  const setCs = (l: Conteudo[]) => set((s) => ({ conteudos: { ...s.conteudos, [atual.t.id]: l } }))
  const remover = (c: Conteudo) => {
    setCs(cs.filter((x) => x.id !== c.id))
    onToast({ icone: Trash2, titulo: `${c.tipo} removido`, texto: c.titulo })
  }
  return (
    <div className="lc-colunas is-esq">
      <aside className="rx-cartao lc-lateral">
        <div>
          <h2 className="lc-h2">Tópicos da lição</h2>
          <p className="lc-mudo">Escolha um tópico para montar a sequência de conteúdos.</p>
        </div>
        {e.discs.map((d) => (
          <div key={d} className="lc-grupo">
            <div className="lc-linha">
              <Ponto d={d} /> <b>{d}</b>
            </div>
            {lista
              .filter((x) => x.d === d)
              .map(({ t }) => {
                const l = sequencia(e, t.id)
                return (
                  <button key={t.id} className={`lc-navtop ${t.id === atual.t.id ? 'is-on' : ''}`} onClick={() => set({ topAtivo: t.id })} aria-current={t.id === atual.t.id ? 'true' : undefined}>
                    <b>{t.nome}</b>
                    <span className="lc-linha is-quebra">
                      {l.map((c) => {
                        const Ic = ICONE_OBJ[c.tipo]
                        return <Ic key={c.id} size={14} color={OBJ[c.tipo].cor} />
                      })}
                      <small>{plural(l.length, 'conteúdo', 'conteúdos')}</small>
                      {t.questoes < POUCAS && (
                        <Badge tom="amarelo" icone={TriangleAlert}>
                          Poucas questões
                        </Badge>
                      )}
                    </span>
                  </button>
                )
              })}
          </div>
        ))}
      </aside>
      <section className="rx-cartao">
        <div className="lc-topo-top">
          <span className="lc-linha is-quebra">
            <Ponto d={atual.d} />
            <small>
              {atual.d} · {atual.unidade}
            </small>
            <Badge>{atual.t.bncc}</Badge>
          </span>
          <h2 className="lc-h2 is-g">{atual.t.nome}</h2>
          <p className="lc-mudo">Monte a sequência que o estudante vai seguir neste tópico. Arraste os conteúdos para mudar a ordem. O quiz é obrigatório e fica sempre no fim.</p>
        </div>
        <div className="lc-objs">
          {cs.length > 0 ? (
            <Reorder.Group axis="y" values={cs} onReorder={setCs} className="lc-objs">
              {cs.map((c, i) => (
                <ItemConteudo key={c.id} c={c} n={i + 1} onPrevia={() => onPrevia(c)} onEditar={() => onSobre({ tipo: c.tipo === 'Resumo' ? 'resumo' : c.tipo === 'Vídeo' ? 'video' : 'audio', topico: atual.t.id, editar: c })} onRemover={() => remover(c)} />
              ))}
            </Reorder.Group>
          ) : (
            <div className="lc-vazio is-p">
              <small>Por enquanto, este tópico tem só o quiz. Se quiser, adicione um resumo, um vídeo ou um áudio para o estudante estudar antes.</small>
            </div>
          )}
          <ItemQuiz c={quiz} n={cs.length + 1} onExemplos={() => onExemplos(atual.t.id)} />
        </div>
        {atual.t.questoes < POUCAS && (
          <Aviso tom="amarelo" icone={TriangleAlert}>
            <b>Poucas questões neste tópico.</b> O banco tem só {atual.t.questoes} questões. Alguns estudantes podem receber questões iguais.
          </Aviso>
        )}
        <div className="lc-add">
          <div>
            <b>Adicionar antes do quiz</b>
            <small>Combine os formatos que fizerem sentido. Nenhum é obrigatório.</small>
          </div>
          <div className="lc-add__opcoes">
            {(['Resumo', 'Vídeo', 'Áudio'] as Tipo[]).map((t) => {
              const Ic = ICONE_OBJ[t]
              return (
                <button key={t} className="lc-add__btn" onClick={() => onSobre({ tipo: t === 'Resumo' ? 'resumo' : t === 'Vídeo' ? 'video' : 'audio', topico: atual.t.id })}>
                  <Plus size={16} />
                  <span>
                    <b>
                      <Ic size={14} /> {t}
                    </b>
                    <small>{OBJ[t].dica}</small>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

/* ================================================================= etapa 4 */
function Etapa4({ e, set, er, total, onIr }: { e: Estado; set: SetE; er: Record<string, string>; total: number; onIr: (n: number) => void }) {
  const sels = topicosOrdenados(e)
  const todos = sels.flatMap(({ t }) => sequencia(e, t.id))
  const cont = (tp: Tipo) => todos.filter((c) => c.tipo === tp).length
  const editar = (n: number) => (
    <button className="rx-link" onClick={() => onIr(n)}>
      <Pencil size={14} /> Editar
    </button>
  )
  const linha = (rot: string, val: ReactNode) => (
    <div className="lc-rev">
      <span>{rot}</span>
      <div>{val}</div>
    </div>
  )
  const turmas = Object.entries(e.sel)
  const resumoCont = [
    [cont('Resumo'), 'resumo', 'resumos'],
    [cont('Vídeo'), 'vídeo', 'vídeos'],
    [cont('Áudio'), 'áudio', 'áudios'],
    [cont('Quiz'), 'quiz', 'quizzes'],
  ]
    .filter(([n]) => n)
    .map(([n, s, p]) => plural(n as number, s as string, p as string))
  return (
    <div className="lc-colunas">
      <div className="lc-pilha">
        <section className="rx-cartao">
          <SecTit icone={MessageSquareText} titulo="Mensagem para os estudantes" desc="Aparece na abertura da lição no Exploradores, junto com o seu nome. Você pode formatar o texto, mudar cores e colocar imagens. É opcional." />
          <div className="lc-campo">
            <span className="lc-rot">
              Mensagem <i>(opcional)</i>
            </span>
            <EditorMensagem html={e.mensagem} onChange={(h) => set({ mensagem: h })} erro={!!er.mensagem} />
            {er.mensagem ? <Erro>{er.mensagem}</Erro> : <Contador n={textoDoHtml(e.mensagem).length} max={MAX_MSG} />}
          </div>
        </section>

        <section className="rx-cartao">
          <SecTit icone={BookOpen} titulo="Informações">
            {editar(0)}
          </SecTit>
          {linha('Nome', <b>{e.nome}</b>)}
        </section>

        <section className="rx-cartao">
          <SecTit icone={Users} titulo="Público e período">
            {editar(0)}
          </SecTit>
          {linha('Escolas', [...new Set(turmas.map(([id]) => turmaPorId(id)?.escola.nome))].join(', '))}
          {linha(
            'Turmas',
            <span className="lc-linha is-quebra">
              {turmas.map(([id, s]) => (
                <Badge key={id}>
                  {turmaPorId(id)?.turma.nome} · {s.modo === 'todos' ? `todos (${qtdTurma(id, s)})` : `${s.ids.length} de ${turmaPorId(id)?.turma.estudantes.length}`}
                </Badge>
              ))}
            </span>,
          )}
          {linha('Estudantes', <b>{plural(total, 'estudante vai', 'estudantes vão')} receber a lição</b>)}
          {linha(
            'Período',
            <span className="lc-linha is-quebra">
              <b>
                {fmtData(e.ini.d)}, {e.ini.h}
              </b>
              <ArrowRight size={14} />
              <b>
                {fmtData(e.fim.d)}, {e.fim.h}
              </b>
            </span>,
          )}
        </section>

        <section className="rx-cartao">
          <SecTit icone={GraduationCap} titulo="Disciplinas, tópicos e conteúdos" desc={`${plural(sels.length, 'tópico', 'tópicos')} · ${plural(todos.length, 'conteúdo', 'conteúdos')}: ${resumoCont.join(', ').replace(/, ([^,]*)$/, ' e $1')}`}>
            {editar(1)}
          </SecTit>
          <div className="lc-tabrev">
            {e.discs.map((d) => (
              <div key={d}>
                <div className="lc-tabrev__disc">
                  <Ponto d={d} /> <b>{d}</b> <small>{plural(sels.filter((x) => x.d === d).length, 'tópico', 'tópicos')}</small>
                </div>
                {sels
                  .filter((x) => x.d === d)
                  .map(({ t }) => {
                    const l = sequencia(e, t.id)
                    return (
                      <div key={t.id} className="lc-tabrev__top">
                        <div className="lc-tabrev__linha">
                          <button className="lc-tabrev__nome" onClick={() => onIr(2)}>
                            {t.nome}
                          </button>
                          <span className="lc-linha is-quebra">
                            {l.map((c) => {
                              const Ic = ICONE_OBJ[c.tipo]
                              return (
                                <span key={c.id} className="lc-pilula" style={{ background: OBJ[c.tipo].fundo, color: OBJ[c.tipo].cor }}>
                                  <Ic size={12} /> {c.tipo}
                                </span>
                              )
                            })}
                          </span>
                        </div>
                        {t.questoes < POUCAS && (
                          <Aviso tom="amarelo" icone={TriangleAlert}>
                            Este tópico tem só {t.questoes} questões no banco. Alguns estudantes podem receber questões iguais.
                          </Aviso>
                        )}
                      </div>
                    )
                  })}
              </div>
            ))}
          </div>
        </section>
        <Aviso icone={Shuffle}>As questões dos quizzes são sorteadas automaticamente para cada estudante, só a partir dos tópicos escolhidos.</Aviso>
      </div>

      <aside className="rx-cartao lc-lateral lc-explo-card">
        <small className="lc-linha">
          <Eye size={14} /> Como o estudante vai ver
        </small>
        <PreviaExploradores e={e} />
      </aside>
    </div>
  )
}

function PreviaExploradores({ e }: { e: Estado }) {
  const sels = topicosOrdenados(e)
  return (
    <div className="lc-explo">
      <span className="lc-explo__ico">
        <BookOpen size={20} />
      </span>
      <small className="lc-explo__tag">LIÇÃO</small>
      <b className="lc-explo__tit">{e.nome || 'Nome da lição'}</b>
      {textoDoHtml(e.mensagem) || e.mensagem.includes('<img') ? (
        <div className="lc-explo__msg">
          <span className="lc-linha">
            <span className="lc-explo__av">RR</span>
            <b>Professor(a) Rodrigo Ribeiro</b>
          </span>
          <div className="lc-explo__msgcorpo">
            <div className="lc-explo__html" dangerouslySetInnerHTML={{ __html: e.mensagem }} />
          </div>
        </div>
      ) : null}
      <b className="lc-explo__sel">Selecione o tópico que deseja estudar</b>
      {sels.map(({ d, t }) => (
        <div key={t.id} className="lc-explo__top">
          <span style={{ background: DISC[d].fundo }}>
            <Ponto d={d} tam={12} />
          </span>
          <span>
            <small style={{ color: DISC[d].cor }}>{d.toUpperCase()}</small>
            <b>{t.nome}</b>
          </span>
        </div>
      ))}
    </div>
  )
}

/* ================================================================= publicação */
function ModalPublicar({ aberto, e, total, onFechar, onPublicar }: { aberto: boolean; e: Estado; total: number; onFechar: () => void; onPublicar: () => void }) {
  const a = dataHora(e.ini.d, e.ini.h)
  const futura = !!a && a > AGORA
  const sels = topicosOrdenados(e)
  return (
    <Modal
      aberto={aberto}
      onFechar={onFechar}
      largura={520}
      titulo="Publicar a lição?"
      sub={e.nome}
      rodape={
        <>
          <button className="rx-btn is-contorno" onClick={onFechar}>
            Revisar mais
          </button>
          <span className="rx-espaco" />
          <button className="rx-btn is-primario" onClick={onPublicar}>
            <Rocket size={16} /> Publicar
          </button>
        </>
      }
    >
      <ul className="lc-checklist">
        <li>
          <Users size={16} /> {plural(total, 'estudante recebe', 'estudantes recebem')} a lição
        </li>
        <li>
          <GraduationCap size={16} /> {plural(e.discs.length, 'disciplina', 'disciplinas')} e {plural(sels.length, 'tópico', 'tópicos')}
        </li>
        <li>
          <CalendarDays size={16} /> De {fmtData(e.ini.d)}, {e.ini.h} até {fmtData(e.fim.d)}, {e.fim.h}
        </li>
      </ul>
      {futura && (
        <Aviso icone={Clock}>
          A lição fica <b>agendada</b> e só aparece para os estudantes em {fmtData(e.ini.d)}, às {e.ini.h}.
        </Aviso>
      )}
    </Modal>
  )
}

function Publicada({ e, total, onNova, onFora }: { e: Estado; total: number; onNova: () => void; onFora: (n: string) => void }) {
  const a = dataHora(e.ini.d, e.ini.h)
  const futura = !!a && a > AGORA
  return (
    <motion.section className="rx-cartao lc-fim" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <span className="lc-fim__ico">
        <Rocket size={34} />
      </span>
      <h1 className="rx-h1">{futura ? 'Lição agendada!' : 'Lição publicada!'}</h1>
      <p>
        <b>{e.nome}</b> {futura ? `aparece para ${plural(total, 'estudante', 'estudantes')} em ${fmtData(e.ini.d)}, às ${e.ini.h}` : `já está disponível para ${plural(total, 'estudante', 'estudantes')}`}, e fica aberta até {fmtData(e.fim.d)}, às {e.fim.h}.
      </p>
      <div className="lc-linha is-quebra is-centro">
        <Badge tom="roxo" icone={Users}>
          {plural(total, 'estudante', 'estudantes')}
        </Badge>
        <Badge tom="roxo" icone={GraduationCap}>
          {e.discs.join(' + ')}
        </Badge>
        <Badge tom={futura ? 'amarelo' : 'verde'} icone={futura ? Clock : CircleCheck}>
          {futura ? 'Agendada' : 'Em andamento'}
        </Badge>
      </div>
      <div className="lc-fim__acoes">
        <button className="rx-btn is-contorno" onClick={() => onFora('Relatórios da lição')}>
          <BarChart3 size={16} /> Acompanhar resultados
        </button>
        <button className="rx-btn is-contorno" onClick={() => onFora('Lição no Exploradores')}>
          <ExternalLink size={16} /> Ver como estudante
        </button>
        <button className="rx-btn is-primario" onClick={onNova}>
          <Plus size={16} /> Criar outra lição
        </button>
      </div>
    </motion.section>
  )
}
