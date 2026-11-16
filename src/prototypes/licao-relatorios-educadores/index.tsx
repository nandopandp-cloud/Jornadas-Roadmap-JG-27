// Relatórios do Modo Lição · plataforma Educadores (Relatórios › Atividades › Lição).
// Navegável construído a partir do piloto no Figma (mgBtd3mytxRLqNA1qBBmNK): casca do kit Educadores (rgx.css) + peças do relatório (rl.css).
// Atalhos: #/?screen=visao | engajamento | aprendizagem | glossario | compartilhar | pdf | questao | estudantes
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  BookText,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleCheck,
  CircleHelp,
  Copy,
  Download,
  FileDown,
  GraduationCap,
  Home,
  Info,
  Link2,
  Menu,
  Pencil,
  Plus,
  Share2,
  Sparkles,
  Trash2,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import type { PrototypeProps } from '../../platform/journeys'
import '../gamificacao-geniex-educadores/rgx.css'
import { Alternativas, Aprendizagem, Engajamento, Glossario, VisaoGeral } from './abas'
import { ALUNOS, DISC_COR, LICAO, N, QUESTOES, acertoQ, fmtT, plural, quemMarcou, topicoPorId, type Questao, type Situacao } from './data'
import { GRUPOS, TODAS, VisualizadorPdf, type Secao } from './pdf'
import { Aviso, Badge, Drawer, Modal, Ponto, ProfPill } from './pecas'
import './rl.css'

type Aba = 'Visão Geral' | 'Engajamento' | 'Aprendizagem' | 'Glossário'
const ABAS: Aba[] = ['Visão Geral', 'Engajamento', 'Aprendizagem', 'Glossário']
type Toast = { titulo: string; texto?: string; icone?: LucideIcon }

function inicio(s?: string | null) {
  const o: { aba: Aba; compartilhar?: boolean; pdf?: boolean; questao?: boolean; estudantes?: Situacao } = { aba: 'Visão Geral' }
  if (s === 'engajamento') o.aba = 'Engajamento'
  if (s === 'aprendizagem') o.aba = 'Aprendizagem'
  if (s === 'glossario') o.aba = 'Glossário'
  if (s === 'compartilhar') o.compartilhar = true
  if (s === 'pdf') o.pdf = true
  if (s === 'questao') {
    o.aba = 'Aprendizagem'
    o.questao = true
  }
  if (s === 'estudantes') {
    o.aba = 'Engajamento'
    o.estudantes = 'Em progresso'
  }
  return o
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

export default function LicaoRelatoriosEducadores({ startScreen }: PrototypeProps) {
  const ini = inicio(startScreen)
  const ordQ = [...QUESTOES].sort((a, b) => acertoQ(a) - acertoQ(b))
  const [aba, setAba] = useState<Aba>(ini.aba)
  const [compartilhar, setCompartilhar] = useState(!!ini.compartilhar)
  const [sel, setSel] = useState<Secao[]>(TODAS)
  const [pdf, setPdf] = useState(!!ini.pdf)
  const [questao, setQuestao] = useState<{ q: Questao; lista: Questao[] } | null>(ini.questao ? { q: ordQ[0], lista: ordQ } : null)
  const [estudantes, setEstudantes] = useState<Situacao | null>(ini.estudantes ?? null)
  const [gaveta, setGaveta] = useState(false)
  const [recolhida, setRecolhida] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)
  const semLateral = useMedia('(max-width: 899px)')

  useEffect(() => {
    document.title = `${aba} · Relatório da lição · Protótipo Jovens Gênios`
  }, [aba])
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3800)
    return () => clearTimeout(t)
  }, [toast])
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || pdf) return
      setCompartilhar(false)
      setQuestao(null)
      setEstudantes(null)
      setGaveta(false)
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [pdf])

  const fora = (n: string) => {
    setGaveta(false)
    setToast({ icone: Info, titulo: `“${n}” não faz parte deste protótipo`, texto: 'Aqui você navega pelo relatório da lição “Conhecendo as pirâmides”.' })
  }
  const irAba = (a: Aba) => {
    setAba(a)
    document.querySelector('.rx-rolagem')?.scrollTo({ top: 0 })
  }

  return (
    <div className={`rx rl ${recolhida ? 'is-recolhida' : ''}`}>
      <AnimatePresence>{gaveta && <motion.div className="rx-veu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setGaveta(false)} />}</AnimatePresence>
      <Sidebar aberta={gaveta} recolhida={recolhida && !semLateral} onFora={fora} onLicao={() => setGaveta(false)} onRecolher={() => (semLateral ? setGaveta(false) : setRecolhida((r) => !r))} />
      <div className="rx-principal">
        <header className="rx-topo">
          <button className="rx-icone-btn rx-topo__menu" onClick={() => setGaveta(true)} aria-label="Abrir menu">
            <Menu size={22} />
          </button>
          <nav className="rx-migalhas" aria-label="Você está em">
            <span>
              <button className="rl-mig" onClick={() => fora('Início')}>
                Início
              </button>{' '}
              <i>/</i>
            </span>
            <span>
              <button className="rl-mig" onClick={() => fora('Relatórios de atividades')}>
                Relatórios de atividades
              </button>{' '}
              <i>/</i>
            </span>
            <span>
              Lição <i>/</i>
            </span>
            <span className="rl-mig-licao">
              {LICAO.nome} <i>/</i>
            </span>
            <span className="is-atual">{aba}</span>
          </nav>
        </header>
        <main className="rx-rolagem">
          <div className="rx-conteudo rl-conteudo">
            <Cabecalho onCompartilhar={() => setCompartilhar(true)} onFora={fora} />
            <div className="rx-abas rl-abas" role="tablist" aria-label="Abas do relatório">
              {ABAS.map((a) => (
                <button key={a} role="tab" aria-selected={aba === a} className={aba === a ? 'is-on' : ''} onClick={() => irAba(a)}>
                  {a}
                  {aba === a && <motion.span layoutId="rl-aba" className="rx-abas__linha" />}
                </button>
              ))}
            </div>
            {aba === 'Visão Geral' && <VisaoGeral onToast={setToast} />}
            {aba === 'Engajamento' && <Engajamento onEstudantes={setEstudantes} onToast={setToast} />}
            {aba === 'Aprendizagem' && <Aprendizagem onQuestao={(q, lista) => setQuestao({ q, lista })} />}
            {aba === 'Glossário' && <Glossario />}
          </div>
        </main>
      </div>

      <ModalCompartilhar
        aberto={compartilhar}
        sel={sel}
        setSel={setSel}
        onFechar={() => setCompartilhar(false)}
        onBaixar={() => {
          setCompartilhar(false)
          setPdf(true)
        }}
        onLink={() => {
          navigator.clipboard?.writeText(`${location.origin}${location.pathname}#/?screen=pdf`).catch(() => {})
          setCompartilhar(false)
          setToast({ icone: Link2, titulo: 'Link do PDF copiado', texto: 'Quem receber o link vê o mesmo relatório, com os dados de hoje.' })
        }}
      />
      {pdf && <VisualizadorPdf sel={sel} onFechar={() => setPdf(false)} />}
      <DrawerQuestao estado={questao} onTrocar={(q) => setQuestao((s) => (s ? { ...s, q } : s))} onFechar={() => setQuestao(null)} />
      <DrawerEstudantes sit={estudantes} onFechar={() => setEstudantes(null)} />

      <AnimatePresence>
        {toast && (
          <motion.div className="rl-toast" role="status" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}>
            {(() => {
              const Ic = toast.icone ?? CircleCheck
              return <Ic size={18} />
            })()}
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
        <img src="./rl/logo.webp" alt="Jovens Gênios" />
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
          <button className="rx-side__subitem" onClick={() => onFora('Relatórios › Institucionais')}>
            Institucionais <ChevronRight size={14} />
          </button>
          <p>
            Atividades <ChevronDown size={14} />
          </p>
          <div className="rx-side__nivel">
            {['Tarefa', 'Lição', 'Campeonato', 'Desafio Adaptativo', 'Prova Genial', 'Raio-X', 'Projetos', 'Trilhas'].map((n) => (
              <button key={n} className={n === 'Lição' ? 'is-on' : ''} aria-current={n === 'Lição' ? 'page' : undefined} onClick={() => (n === 'Lição' ? onLicao() : onFora(`Relatórios › ${n}`))}>
                {n}
              </button>
            ))}
          </div>
          <button className="rx-side__subitem" onClick={() => onFora('Relatórios › Eventos')}>
            Eventos <ChevronRight size={14} />
          </button>
        </div>
        {item(Sparkles, 'Assistente')}
        {item(GraduationCap, 'Formação')}
        {item(BookText, 'Biblioteca')}
        {item(CircleHelp, 'Central de ajuda')}
      </nav>
      <div className="rx-side__usuario">
        <span className="rx-avatar rl-avatar-eu">RR</span>
        <span className="rx-side__txt">
          <b>Rodrigo Ribeiro</b>
          <small>rodrigo.ribeiro@jovensgenios.com</small>
        </span>
      </div>
    </aside>
  )
}

function Cabecalho({ onCompartilhar, onFora }: { onCompartilhar: () => void; onFora: (n: string) => void }) {
  return (
    <div className="rl-cab">
      <div className="rl-cab__id">
        <div className="rl-cab__tit">
          <h1 className="rx-h1">{LICAO.nome}</h1>
          <Badge tom="roxo" icone={BookOpen}>
            Lição
          </Badge>
        </div>
        <Badge tom="verde" icone={CircleCheck}>
          Finalizada
        </Badge>
        <small>Criada em {LICAO.criada}</small>
        <div className="rl-cab__meta">
          <small>
            <CalendarDays size={14} /> {LICAO.inicio} – {LICAO.fim}
          </small>
          <small>
            <Users size={14} /> {N} estudantes participantes · {LICAO.turmas}
          </small>
          <small>
            {LICAO.disciplinas.map((d) => (
              <span key={d} className="rl-cab__disc">
                <Ponto cor={DISC_COR[d][0]} tam={8} /> {d}
              </span>
            ))}
          </small>
        </div>
      </div>
      <div className="rl-cab__acoes">
        <button className="rl-acao" disabled title="Lições finalizadas não podem ser editadas" aria-label="Editar (indisponível em lição finalizada)">
          <Pencil size={16} />
        </button>
        <button className="rl-acao" title="Duplicar lição" aria-label="Duplicar lição" onClick={() => onFora('Duplicar lição')}>
          <Copy size={16} />
        </button>
        <button className="rl-acao" title="Excluir lição" aria-label="Excluir lição" onClick={() => onFora('Excluir lição')}>
          <Trash2 size={16} />
        </button>
        <button className="rx-btn is-contorno" onClick={onCompartilhar}>
          <Share2 size={16} /> Compartilhar
        </button>
      </div>
    </div>
  )
}

/* ================================================================= compartilhar (PDF) */
function ModalCompartilhar({ aberto, sel, setSel, onFechar, onBaixar, onLink }: { aberto: boolean; sel: Secao[]; setSel: (s: Secao[]) => void; onFechar: () => void; onBaixar: () => void; onLink: () => void }) {
  const [fechados, setFechados] = useState<string[]>([])
  const alterna = (s: Secao) => setSel(sel.includes(s) ? sel.filter((x) => x !== s) : [...sel, s])
  const grupo = (ids: Secao[]) => {
    const todos = ids.every((s) => sel.includes(s))
    setSel(todos ? sel.filter((s) => !ids.includes(s)) : [...new Set([...sel, ...ids])])
  }
  const nada = sel.length === 0
  return (
    <Modal
      aberto={aberto}
      onFechar={onFechar}
      largura={980}
      titulo="Compartilhar relatório da lição"
      sub={`${LICAO.nome} · gera um PDF completo, com as abas que você escolher.`}
      rodape={
        <div className="rl-comp-rod">
          <button className="rx-btn is-primario" disabled={nada} onClick={onBaixar}>
            <Download size={16} /> Baixar PDF
          </button>
          <button className="rx-btn is-contorno" disabled={nada} onClick={onLink}>
            <Share2 size={16} /> Compartilhar link do PDF
          </button>
        </div>
      }
    >
      <div className="rl-compart">
        <div className="rl-comp__opcoes">
          <div className="rl-comp__fmt">
            <b>O que deseja exportar?</b>
            <span className="rx-select is-fixo">
              PDF <ChevronDown size={16} />
            </span>
          </div>
          {GRUPOS.map((g) => {
            const ids = g.itens.map((i) => i[0])
            const n = ids.filter((s) => sel.includes(s)).length
            const aberto2 = !fechados.includes(g.id)
            return (
              <div key={g.id} className="rl-comp__grupo">
                <div className="rl-comp__g">
                  <Caixa on={n === ids.length} parcial={n > 0 && n < ids.length} onClick={() => grupo(ids)} rotulo={g.t} />
                  <b>{g.t}</b>
                  <span className="rx-espaco" />
                  <button className="rx-icone-btn" aria-label={aberto2 ? `Recolher ${g.t}` : `Expandir ${g.t}`} onClick={() => setFechados((f) => (f.includes(g.id) ? f.filter((x) => x !== g.id) : [...f, g.id]))}>
                    {aberto2 ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
                {aberto2 &&
                  g.itens.map(([s, t, novo]) => (
                    <label key={s} className="rl-comp__item">
                      <Caixa on={sel.includes(s)} onClick={() => alterna(s)} rotulo={t} />
                      <span>{t}</span>
                      {novo && <Badge tom="roxo">Novo</Badge>}
                    </label>
                  ))}
              </div>
            )
          })}
          {nada ? (
            <Aviso tom="amarelo" icone={Info}>
              Escolha pelo menos uma seção para gerar o PDF.
            </Aviso>
          ) : (
            <Aviso icone={FileDown}>O PDF traz todos os registros (os {N} estudantes e as {QUESTOES.length} questões), não só a página aberta na tela. Gráficos saem com título, legenda e escala.</Aviso>
          )}
        </div>
        <div className="rl-comp__prev">
          <small>Prévia · capa</small>
          <div className="rl-capa">
            <img src="./rl/logo-jg.png" alt="" />
            <span className="rl-capa__dir">
              {LICAO.periodoCurto}
              <br />
              <em>Gerado em {LICAO.geradoEm}</em>
            </span>
            <span className="rl-capa__tit">
              <b>Relatório da Lição</b>
              {LICAO.nome}
            </span>
            <b className="rl-capa__esc">{LICAO.rodapePdf}</b>
          </div>
          <small>Mesmo visual do PDF de Tarefa: capa, sumário, divisória por aba e tabelas completas.</small>
        </div>
      </div>
    </Modal>
  )
}

function Caixa({ on, parcial, onClick, rotulo }: { on: boolean; parcial?: boolean; onClick: () => void; rotulo: string }) {
  return (
    <button type="button" role="checkbox" aria-checked={parcial ? 'mixed' : on} aria-label={rotulo} className={`rl-caixa ${on || parcial ? 'is-on' : ''}`} onClick={onClick}>
      {parcial ? <i /> : on ? <svg viewBox="0 0 12 12" width="11" height="11"><path d="M2.5 6.2 5 8.6l4.6-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg> : null}
    </button>
  )
}

/* ================================================================= análise da questão */
function DrawerQuestao({ estado, onTrocar, onFechar }: { estado: { q: Questao; lista: Questao[] } | null; onTrocar: (q: Questao) => void; onFechar: () => void }) {
  const [abertas, setAbertas] = useState<number[]>([])
  const q = estado?.q
  useEffect(() => {
    if (!q) return
    const erros = q.contagem.map((c, i) => (i === q.certa ? -1 : c))
    setAbertas([erros.indexOf(Math.max(...erros))])
  }, [q])
  if (!estado || !q)
    return <Drawer aberto={false} onFechar={onFechar} titulo="">{null}</Drawer>
  const t = topicoPorId(q.topico)
  const i = estado.lista.indexOf(q)
  const grupos = quemMarcou(q)
  const ac = acertoQ(q)
  const erros = q.contagem.map((c, k) => (k === q.certa ? -1 : c))
  const dis = erros.indexOf(Math.max(...erros))
  return (
    <Drawer
      aberto
      onFechar={onFechar}
      titulo="Análise detalhada da questão"
      sub={`${t.disc} · ${t.nome} · ${t.bncc} · ID ${q.id}`}
      rodape={
        <>
          <button className="rx-btn is-contorno" disabled={i <= 0} onClick={() => onTrocar(estado.lista[i - 1])}>
            <ArrowLeft size={16} /> Questão anterior
          </button>
          <button className="rx-btn is-contorno" disabled={i >= estado.lista.length - 1} onClick={() => onTrocar(estado.lista[i + 1])}>
            Próxima questão <ArrowRight size={16} />
          </button>
          <span className="rx-espaco" />
          <button className="rx-btn is-primario" onClick={onFechar}>
            Fechar
          </button>
        </>
      }
    >
      <small className="rl-mudo">
        Questão {i + 1} de {estado.lista.length}
      </small>
      <div className="rl-metricas">
        {[
          ['Taxa de acerto', `${ac}%`, ac < 50 ? '#DC2626' : ac >= 75 ? '#16A34A' : undefined],
          ['Respostas', String(q.resp)],
          ['Receberam a questão', plural(q.recebeu, 'estudante', 'estudantes')],
          ['Tempo médio', fmtT(q.tempo + 30)],
        ].map(([r, v, c]) => (
          <div key={r}>
            <small>{r}</small>
            <b style={{ color: c }}>{v}</b>
          </div>
        ))}
      </div>
      <small className="rl-mudo">Enunciado</small>
      <p className="rl-enun">{q.enun}</p>
      <b>Respostas por alternativa</b>
      <Alternativas q={q} grupos={grupos} abertas={abertas} onAlternar={(k) => setAbertas((l) => (l.includes(k) ? l.filter((x) => x !== k) : [...l, k]))} />
      {q.recebeu > q.resp && (
        <Aviso tom="neutro" icone={Info}>
          {plural(q.recebeu - q.resp, 'estudante que recebeu a questão não respondeu', 'estudantes que receberam a questão não responderam')}. Eles não entram na taxa de acerto, mas continuam no total de quem recebeu.
        </Aviso>
      )}
      {q.contagem[dis] > 0 && (
        <Aviso tom="amarelo" icone={Sparkles}>
          A alternativa {'ABCD'[dis]} foi a mais marcada entre os erros ({plural(q.contagem[dis], 'estudante', 'estudantes')}). Vale retomar o conteúdo com quem a marcou.
        </Aviso>
      )}
    </Drawer>
  )
}

/* ================================================================= estudantes por situação */
function DrawerEstudantes({ sit, onFechar }: { sit: Situacao | null; onFechar: () => void }) {
  const lista = ALUNOS.filter((a) => a.sit === sit).sort((a, b) => a.nome.localeCompare(b.nome))
  return (
    <Drawer aberto={!!sit} onFechar={onFechar} titulo={`Estudantes · ${sit ?? ''}`} sub={sit ? `${plural(lista.length, 'estudante', 'estudantes')} de ${N}` : ''} largura={520} rodape={<><span className="rx-espaco" /><button className="rx-btn is-primario" onClick={onFechar}>Fechar</button></>}>
      <ul className="rl-lista">
        {lista.map((a) => (
          <li key={a.id}>
            <span className="rl-ini">
              {a.nome
                .split(' ')
                .map((x) => x[0])
                .slice(0, 2)
                .join('')}
            </span>
            <span>
              <b>{a.nome}</b>
              <small>
                {a.turma} · completude {a.comp}% · {plural(a.inter, 'interação', 'interações')}
              </small>
            </span>
            <ProfPill p={a.prof} />
          </li>
        ))}
      </ul>
    </Drawer>
  )
}
