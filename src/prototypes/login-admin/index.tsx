import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowUpDown,
  Ban,
  BookOpen,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Copy,
  Download,
  Ellipsis,
  EyeOff,
  Gamepad2,
  History,
  House,
  IdCard,
  Inbox,
  Info,
  ListFilter,
  Lock,
  LockOpen,
  Mail,
  Menu,
  Orbit,
  Pencil,
  Plus,
  Printer,
  QrCode,
  RefreshCw,
  Search,
  Shapes,
  ShieldCheck,
  Sparkles,
  Star,
  TriangleAlert,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useMemo, useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import type { PrototypeProps } from '../../platform/journeys'
import { Carteirinha } from '../login-comum/Carteirinha'
import { agora, ESTUDANTES, iniciais, MOTIVOS_BLOQUEIO, MOTIVOS_REEMISSAO, MOTIVOS_REVOGACAO, TENTATIVAS, type Estudante, type Evento } from './data'
import './admin-login.css'

/* =====================================================================
   Login simplificado · Admins
   Telas A1–A8, diálogos O1–O8 e avisos T1–T5 do Figma (Global DS · Admins)
   ===================================================================== */

type View = { id: 'lista' } | { id: 'detalhe'; est: string } | { id: 'historico'; est: string }
type Dlg =
  | { tipo: 'emitir' | 'reemitir' | 'revogar' | 'bloquear' | 'permitir' | 'imprimir'; est: string }
  | { tipo: 'lote' }
  | { tipo: 'lote-resultado'; ok: string[]; pend: string[] }
type Toast = { id: number; tipo: 'ok' | 'neutro' | 'erro'; titulo: string; desc: string }

const ATALHOS: Record<string, { view: View; perfil?: 'Gestor' | 'Leitor'; sel?: string[]; dlg?: Dlg }> = {
  lista: { view: { id: 'lista' } },
  lote: { view: { id: 'lista' }, sel: ['laura', 'sofia'] },
  ativa: { view: { id: 'detalhe', est: 'ana' } },
  sem: { view: { id: 'detalhe', est: 'laura' } },
  emitir: { view: { id: 'detalhe', est: 'laura' }, dlg: { tipo: 'emitir', est: 'laura' } },
  reemitir: { view: { id: 'detalhe', est: 'ana' }, dlg: { tipo: 'reemitir', est: 'ana' } },
  imprimir: { view: { id: 'detalhe', est: 'ana' }, dlg: { tipo: 'imprimir', est: 'ana' } },
  revogada: { view: { id: 'detalhe', est: 'mariana' } },
  bloqueado: { view: { id: 'detalhe', est: 'theo' } },
  leitor: { view: { id: 'detalhe', est: 'ana' }, perfil: 'Leitor' },
  historico: { view: { id: 'historico', est: 'ana' } },
}

export default function LoginAdmin({ startScreen }: PrototypeProps) {
  const ini = ATALHOS[startScreen ?? ''] ?? ATALHOS.lista
  const [view, setView] = useState<View>(ini.view)
  const [lista, setLista] = useState<Estudante[]>(() => ESTUDANTES.map((e) => ({ ...e, eventos: [...e.eventos] })))
  const [sel, setSel] = useState<string[]>(ini.sel ?? [])
  const [perfil, setPerfil] = useState<'Gestor' | 'Leitor'>(ini.perfil ?? 'Gestor')
  const [dlg, setDlg] = useState<Dlg | null>(ini.dlg ?? null)
  const [toast, setToast] = useState<Toast | null>(null)
  const [gaveta, setGaveta] = useState(false)
  const [loteFalhou, setLoteFalhou] = useState(false)

  useEffect(() => {
    document.title = 'Login simplificado · Admins · Protótipo Jovens Gênios'
  }, [])
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), toast.tipo === 'erro' ? 6000 : 4000)
    return () => clearTimeout(t)
  }, [toast])

  const avisar = (tipo: Toast['tipo'], titulo: string, desc: string) => setToast({ id: Date.now(), tipo, titulo, desc })
  const fora = (n: string) => avisar('neutro', `“${n}” não faz parte deste protótipo`, 'Aqui você navega só pela credencial de acesso dos estudantes.')
  const est = (id: string) => lista.find((e) => e.id === id)!
  const muda = (id: string, fn: (e: Estudante) => Estudante) => setLista((l) => l.map((e) => (e.id === id ? fn(e) : e)))
  const evento = (e: Estudante, ev: Omit<Evento, 'quando' | 'quem'>): Evento[] => [{ ...ev, quando: agora(), quem: 'Bruno Tamburro (Gestor)' }, ...e.eventos]

  const acoes = {
    emitir: (id: string) => {
      muda(id, (e) => ({ ...e, credencial: 'ativa', versao: e.versao + 1, emitida: agora(), emitidaPor: 'Bruno Tamburro (Gestor)', reemitida: undefined, reemitidaPor: undefined, eventos: evento(e, { tipo: 'emitida', titulo: 'Credencial emitida', extra: `Versão ${e.versao + 1} · cadastro existente, sem nova conta` }) }))
      avisar('ok', 'Credencial emitida', `A carteirinha de ${est(id).nome.split(' ')[0]} está pronta para imprimir.`)
    },
    reemitir: (id: string, motivo: string) => {
      const v = est(id).versao + 1
      muda(id, (e) => ({ ...e, credencial: 'ativa', versao: v, reemitida: agora(), reemitidaPor: `Bruno Tamburro · Motivo: ${motivo.toLowerCase()}`, eventos: evento(e, { tipo: 'reemitida', titulo: 'Credencial reemitida', extra: `Motivo: ${motivo.toLowerCase()} · versão ${v - 1} invalidada` }) }))
      avisar('ok', `Credencial reemitida · versão ${v}`, 'A carteirinha anterior já não funciona.')
    },
    revogar: (id: string, motivo: string) => {
      muda(id, (e) => ({ ...e, credencial: 'revogada', eventos: evento(e, { tipo: 'revogada', titulo: 'Credencial revogada', extra: `Motivo: ${motivo.toLowerCase()} · QR Code e ícones invalidados` }) }))
      avisar('neutro', 'Credencial revogada', `QR Code e ícones de ${est(id).nome.split(' ')[0]} não funcionam mais. E-mail e senha continuam.`)
    },
    bloquear: (id: string, motivo: string) => {
      muda(id, (e) => ({ ...e, permissao: 'bloqueada', bloqueio: `Bloqueado em ${agora().split(',')[0]} por Bruno Tamburro (Gestor). Motivo: ${motivo.toLowerCase()}.`, eventos: evento(e, { tipo: 'bloqueado', titulo: 'Acesso bloqueado', extra: 'Permitido → Bloqueado · sessões abertas encerradas' }) }))
      avisar('neutro', 'Acesso bloqueado', `${est(id).nome.split(' ')[0]} não entra por nenhum método. Sessões abertas foram encerradas.`)
    },
    permitir: (id: string) => {
      muda(id, (e) => ({ ...e, permissao: 'permitida', bloqueio: undefined, eventos: evento(e, { tipo: 'permitido', titulo: 'Permissão de acesso alterada', extra: 'Bloqueado → Permitido' }) }))
      avisar('ok', 'Acesso permitido', `${est(id).nome.split(' ')[0]} pode entrar de novo pelos métodos habilitados.`)
    },
    imprimir: (id: string) => {
      muda(id, (e) => ({ ...e, eventos: evento(e, { tipo: 'impressa', titulo: 'Carteirinha impressa', extra: `Versão ${e.versao}` }) }))
      avisar('ok', 'Carteirinha enviada para impressão', 'Entregue só para o próprio estudante.')
    },
  }

  const emitirLote = (ids: string[]) => {
    const pend = !loteFalhou && ids.includes('sofia') && ids.length > 1 ? ['sofia'] : []
    const ok = ids.filter((i) => !pend.includes(i))
    ok.forEach((i) => muda(i, (e) => ({ ...e, credencial: 'ativa', versao: e.versao + 1, emitida: agora(), emitidaPor: 'Bruno Tamburro (Gestor)', eventos: evento(e, { tipo: 'emitida', titulo: 'Credencial emitida', extra: `Versão ${e.versao + 1} · emissão em lote` }) })))
    if (pend.length) setLoteFalhou(true)
    setSel([])
    setDlg({ tipo: 'lote-resultado', ok, pend })
  }

  const leitor = perfil === 'Leitor'
  const abrir = (v: View) => {
    setView(v)
    setGaveta(false)
  }

  return (
    <div className="la">
      <AnimatePresence>{gaveta && <motion.div className="la-veu-gaveta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setGaveta(false)} />}</AnimatePresence>
      <Sidebar aberta={gaveta} perfil={perfil} trocarPerfil={() => { setPerfil(leitor ? 'Gestor' : 'Leitor'); avisar('neutro', `Agora você vê como ${leitor ? 'Gestor' : 'Leitor'}`, leitor ? 'Pode emitir, reemitir, revogar, bloquear e imprimir.' : 'Pode consultar, mas não alterar credenciais.') }} fora={fora} fechar={() => setGaveta(false)} />
      <div className="la-main">
        <header className="la-topo">
          <button onClick={() => setGaveta(true)} aria-label="Abrir menu">
            <Menu size={22} />
          </button>
          <img src="./admin/logo.webp" alt="" />
          <span>
            <b>Jovens Gênios</b>
            <small>Admins</small>
          </span>
          <button className="la-topo-busca" onClick={() => fora('Pesquisar')} aria-label="Pesquisar">
            <Search size={20} />
          </button>
        </header>
        <AnimatePresence mode="wait" initial={false}>
          <motion.main key={view.id + ('est' in view ? view.est : '')} className="la-conteudo" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.1 } }} transition={{ type: 'spring', stiffness: 340, damping: 32 }}>
            {view.id === 'lista' && <Lista lista={lista} sel={sel} setSel={setSel} abrir={(id) => abrir({ id: 'detalhe', est: id })} lote={() => setDlg({ tipo: 'lote' })} imprimir={() => (sel.some((i) => est(i).credencial === 'ativa') ? setDlg({ tipo: 'imprimir', est: sel.find((i) => est(i).credencial === 'ativa')! }) : avisar('neutro', 'Nenhuma carteirinha para imprimir', 'Emita as credenciais dos selecionados antes de imprimir.'))} fora={fora} leitor={leitor} />}
            {view.id !== 'lista' && (
              <>
                <Migalhas itens={['Início', 'Instituições', 'Estudantes', est(view.est).nome, ...(view.id === 'historico' ? ['Histórico da credencial'] : [])]} ir={(i) => (i === 2 ? abrir({ id: 'lista' }) : i === 3 ? abrir({ id: 'detalhe', est: view.est }) : fora(['Início', 'Instituições'][i] ?? ''))} />
                <Cabecalho e={est(view.est)} fora={fora} />
                {view.id === 'detalhe' ? <Detalhe e={est(view.est)} leitor={leitor} abrir={(t) => setDlg({ tipo: t, est: view.est })} historico={() => abrir({ id: 'historico', est: view.est })} /> : <Historico e={est(view.est)} voltar={() => abrir({ id: 'detalhe', est: view.est })} />}
              </>
            )}
          </motion.main>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {dlg && <Dialogo key={dlg.tipo} dlg={dlg} est={est} fechar={() => setDlg(null)} acoes={acoes} lote={emitirLote} sel={sel} imprimirLote={(ids) => setDlg({ tipo: 'imprimir', est: ids[0] })} />}
      </AnimatePresence>
      <AnimatePresence>
        {toast && (
          <>
            <motion.div key="veu" className="la-veu-toast" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.div key={toast.id} className={`la-toast is-${toast.tipo}`} role="status" initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }}>
              <span>
                <b>{toast.titulo}</b>
                {toast.desc}
              </span>
              <button onClick={() => setToast(null)} aria-label="Fechar aviso">
                <X size={16} />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ------------------------------------------------------------ sidebar */
const MENU: [LucideIcon, string, string[]?][] = [
  [Orbit, 'Redes', ['Criar Planeta', 'Gerenciar Planetas']],
  [BookOpen, 'Narrativas', ['Criar Narrativa', 'Gerenciar Narrativas']],
  [Star, 'Liga das Estrelas'],
  [Gamepad2, 'Atividades Interativas', ['Gênioverso', 'Diário Cósmico']],
  [Shapes, 'Biblioteca', ['Cursos', 'Tópicos', 'Habilidades']],
  [Sparkles, 'IA Generativa', ['Assistentes IA', 'Gerar Habilidades', 'Gerar Micro-habilidades', 'Gerar Tópicos']],
]
function Sidebar({ aberta, perfil, trocarPerfil, fora, fechar }: { aberta: boolean; perfil: string; trocarPerfil: () => void; fora: (n: string) => void; fechar: () => void }) {
  const [abertos, setAbertos] = useState<string[]>(['Redes', 'Narrativas', 'Atividades Interativas', 'Biblioteca', 'IA Generativa'])
  const [menu, setMenu] = useState(false)
  return (
    <aside className={`la-side ${aberta ? 'is-aberta' : ''}`}>
      <div className="la-side-marca">
        <img src="./admin/logo.webp" alt="" />
        <span>
          <b>Jovens Gênios</b>
          <small>Admins</small>
        </span>
        <button className="la-side-x" onClick={fechar} aria-label="Fechar menu">
          <X size={18} />
        </button>
      </div>
      <nav className="la-side-nav">
        {([[House, 'Início'], [Inbox, 'Caixa de Entrada'], [Search, 'Pesquisar']] as [LucideIcon, string][]).map(([I, n]) => (
          <button key={n} className="la-side-item" onClick={() => fora(n)} title={n}>
            <I size={18} />
            <span>{n}</span>
            {n === 'Caixa de Entrada' && <em>23</em>}
          </button>
        ))}
        <small className="la-side-grupo">Funcionalidades</small>
        {MENU.map(([I, n, sub]) => (
          <div key={n}>
            <button className="la-side-item" title={n} onClick={() => (sub ? setAbertos((a) => (a.includes(n) ? a.filter((x) => x !== n) : [...a, n])) : fora(n))}>
              <I size={18} />
              <span>{n}</span>
              {sub && <ChevronDown size={16} className={`la-side-seta ${abertos.includes(n) ? 'is-aberto' : ''}`} />}
            </button>
            {sub && abertos.includes(n) && (
              <div className="la-side-sub">
                {sub.map((s) => (
                  <button key={s} onClick={() => fora(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      <div className="la-side-pe">
        <button className="la-side-usuario" onClick={() => setMenu(!menu)}>
          <span className="la-avatar is-claro">BT</span>
          <span>
            <b>Bruno Tamburro</b>
            <small>{perfil}</small>
          </span>
          <Ellipsis size={18} />
        </button>
        <AnimatePresence>
          {menu && (
            <motion.div className="la-side-menu" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <small>Protótipo</small>
              <button
                onClick={() => {
                  trocarPerfil()
                  setMenu(false)
                }}
              >
                <ShieldCheck size={16} /> Ver como {perfil === 'Gestor' ? 'Leitor' : 'Gestor'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  )
}

/* ------------------------------------------------------------- comuns */
function Migalhas({ itens, ir }: { itens: string[]; ir: (i: number) => void }) {
  return (
    <nav className="la-migalhas" aria-label="Você está em">
      {itens.map((t, i) => (
        <span key={i}>
          {i === itens.length - 1 ? <b>{t}</b> : <button onClick={() => ir(i)}>{t}</button>}
          {i < itens.length - 1 && <em>/</em>}
        </span>
      ))}
    </nav>
  )
}

function Botao({ v = 'default', icon: I, children, sm, ...p }: { v?: 'default' | 'outline' | 'ghost' | 'destrutivo' | 'link'; icon?: LucideIcon; sm?: boolean } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" {...p} className={`la-btn is-${v} ${sm ? 'is-sm' : ''} ${p.className ?? ''}`}>
      {I && <I size={16} />}
      {children}
    </button>
  )
}

function Badge({ v, children }: { v: 'sucesso' | 'destrutivo' | 'alerta' | 'outline'; children: ReactNode }) {
  return <span className={`la-badge is-${v}`}>{children}</span>
}
const BCRED = { ativa: ['sucesso', 'Ativa'], nao: ['outline', 'Não emitida'], revogada: ['alerta', 'Revogada'] } as const
const BPERM = { permitida: ['sucesso', 'Permitida'], bloqueada: ['destrutivo', 'Bloqueada'] } as const

function Cartao({ titulo, desc, acao, children, className }: { titulo?: string; desc?: string; acao?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`la-card ${className ?? ''}`}>
      {(titulo || acao) && (
        <header className="la-card-topo">
          <span>
            {titulo && <h2>{titulo}</h2>}
            {desc && <p>{desc}</p>}
          </span>
          {acao}
        </header>
      )}
      {children}
    </section>
  )
}

function Select({ rotulo, valor, opcoes, onChange }: { rotulo?: string; valor: string; opcoes: string[]; onChange: (v: string) => void }) {
  return (
    <label className="la-select">
      {rotulo && <span>{rotulo}</span>}
      <div>
        <select value={valor} onChange={(e) => onChange(e.target.value)}>
          {opcoes.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <ChevronDown size={16} />
      </div>
    </label>
  )
}

/* -------------------------------------------------------------- lista */
function Lista({ lista, sel, setSel, abrir, lote, imprimir, fora, leitor }: { lista: Estudante[]; sel: string[]; setSel: (s: string[]) => void; abrir: (id: string) => void; lote: () => void; imprimir: () => void; fora: (n: string) => void; leitor: boolean }) {
  const [busca, setBusca] = useState('')
  const [fCred, setFCred] = useState('Todas')
  const [fPerm, setFPerm] = useState('Todas')
  const [fEsc, setFEsc] = useState('Todas as escolas')
  const [fTur, setFTur] = useState('Todas as turmas')
  const escolas = ['Todas as escolas', ...new Set(lista.map((e) => e.escola))]
  const turmas = ['Todas as turmas', ...[...new Set(lista.map((e) => e.turma))].sort()]
  const vis = useMemo(
    () =>
      lista.filter(
        (e) =>
          (!busca || e.nome.toLowerCase().includes(busca.toLowerCase())) &&
          (fCred === 'Todas' || BCRED[e.credencial][1] === fCred) &&
          (fPerm === 'Todas' || BPERM[e.permissao][1] === fPerm) &&
          (fEsc === escolas[0] || e.escola === fEsc) &&
          (fTur === turmas[0] || e.turma === fTur),
      ),
    [lista, busca, fCred, fPerm, fEsc, fTur],
  )
  const semCred = sel.filter((i) => lista.find((e) => e.id === i)?.credencial !== 'ativa').length
  const marca = (id: string) => setSel(sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id])
  const todos = vis.length > 0 && vis.every((e) => sel.includes(e.id))
  const filtrando = fCred !== 'Todas' || fPerm !== 'Todas' || fEsc !== escolas[0] || fTur !== turmas[0]
  return (
    <>
      <Migalhas itens={['Início', 'Instituições', 'Estudantes']} ir={(i) => fora(['Início', 'Instituições'][i])} />
      <div className="la-lista-topo">
        <h1>Estudantes</h1>
        <div className="la-lista-acoes">
          <label className="la-busca">
            <Search size={16} />
            <input placeholder="Pesquisar estudantes" value={busca} onChange={(e) => setBusca(e.target.value)} />
          </label>
          <Botao v="outline" icon={ArrowUpDown} className="is-icone" aria-label="Ordenar" onClick={() => fora('Ordenar')} />
          <Botao v="outline" icon={ListFilter} onClick={() => fora('Filtros avançados')}>
            Filtrar
          </Botao>
          <Botao v="outline" icon={Copy} onClick={() => fora('Cadastros')}>
            Cadastros <ChevronDown size={16} />
          </Botao>
          <Botao icon={Plus} onClick={() => fora('Criar estudante')}>
            Criar estudante
          </Botao>
        </div>
      </div>
      <div className="la-filtros">
        <Select rotulo="Credencial de acesso" valor={fCred} opcoes={['Todas', 'Ativa', 'Não emitida', 'Revogada']} onChange={setFCred} />
        <Select rotulo="Permissão de acesso" valor={fPerm} opcoes={['Todas', 'Permitida', 'Bloqueada']} onChange={setFPerm} />
        <Select rotulo="Escola" valor={fEsc} opcoes={escolas} onChange={setFEsc} />
        <Select rotulo="Turma" valor={fTur} opcoes={turmas} onChange={setFTur} />
        <Botao v="ghost" disabled={!filtrando} onClick={() => { setFCred('Todas'); setFPerm('Todas'); setFEsc(escolas[0]); setFTur(turmas[0]) }}>
          Limpar filtros
        </Botao>
      </div>
      <AnimatePresence>
        {sel.length > 0 && (
          <motion.div className="la-lote" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <div>
              <CircleCheck size={18} />
              <b>
                {sel.length} {sel.length === 1 ? 'estudante selecionado' : 'estudantes selecionados'}
                {semCred ? ` · ${semCred} sem credencial` : ''}
              </b>
              <Botao v="ghost" onClick={() => setSel([])}>
                Limpar seleção
              </Botao>
              <Botao v="outline" icon={Printer} onClick={imprimir} disabled={leitor}>
                Imprimir carteirinhas
              </Botao>
              <Botao icon={IdCard} onClick={lote} disabled={!semCred || leitor}>
                Emitir credenciais
              </Botao>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="la-tabela">
        <div className="la-tr is-cab">
          <span className="la-c-chk">
            <Chk on={todos} onClick={() => setSel(todos ? [] : vis.map((e) => e.id))} />
          </span>
          <span className="la-c-est">Estudante</span>
          <span className="la-c-esc">Escola e turma</span>
          <span className="la-c-cred">Credencial</span>
          <span className="la-c-perm">Permissão</span>
          <span className="la-c-met">Métodos</span>
          <span className="la-c-ult">Último acesso</span>
          <span className="la-c-mais" />
        </div>
        {vis.map((e) => (
          <div key={e.id} className={`la-tr ${sel.includes(e.id) ? 'is-sel' : ''}`} onClick={() => abrir(e.id)} role="button" tabIndex={0} onKeyDown={(k) => k.key === 'Enter' && abrir(e.id)}>
            <span className="la-c-chk" onClick={(ev) => ev.stopPropagation()}>
              <Chk on={sel.includes(e.id)} onClick={() => marca(e.id)} />
            </span>
            <span className="la-c-est">
              <span className="la-avatar">{iniciais(e.nome)}</span>
              <span>
                <b>{e.nome}</b>
                <small>{e.email}</small>
              </span>
            </span>
            <span className="la-c-esc">
              {e.escola} · {e.turma}
            </span>
            <span className="la-c-cred">
              <Badge v={BCRED[e.credencial][0]}>{BCRED[e.credencial][1]}</Badge>
            </span>
            <span className="la-c-perm">
              <Badge v={BPERM[e.permissao][0]}>{BPERM[e.permissao][1]}</Badge>
            </span>
            <span className="la-c-met">
              <QrCode size={18} className={e.credencial === 'ativa' ? '' : 'is-off'} />
              <Shapes size={18} className={e.credencial === 'ativa' ? '' : 'is-off'} />
              <Mail size={18} />
            </span>
            <span className="la-c-ult">{e.ultimo.split(',')[0]}</span>
            <span className="la-c-mais">
              <Ellipsis size={18} />
            </span>
          </div>
        ))}
        {!vis.length && <p className="la-vazio-lista">Nenhum estudante com esses filtros.</p>}
        <footer className="la-tabela-pe">
          <span>
            Mostrando {vis.length} de 312 estudantes
          </span>
          <nav className="la-pag">
            <button disabled>
              <ChevronLeft size={16} /> Anterior
            </button>
            <button className="is-atual">1</button>
            <button onClick={() => fora('Página 2')}>2</button>
            <button onClick={() => fora('Página 3')}>3</button>
            <span>…</span>
            <button onClick={() => fora('Próxima página')}>
              Próximo <ChevronRight size={16} />
            </button>
          </nav>
          <Botao v="outline" className="la-mais-btn" onClick={() => fora('Carregar mais')}>
            Carregar mais
          </Botao>
        </footer>
      </div>
    </>
  )
}

function Chk({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button className={`la-chk ${on ? 'is-on' : ''}`} role="checkbox" aria-checked={on} onClick={onClick}>
      {on && <Check size={12} strokeWidth={3} />}
    </button>
  )
}

/* ------------------------------------------------------------ detalhe */
function Cabecalho({ e, fora }: { e: Estudante; fora: (n: string) => void }) {
  return (
    <section className="la-card la-cab">
      <div className="la-cab-id">
        <span className="la-avatar is-g">{iniciais(e.nome)}</span>
        <span className="la-cab-tx">
          <span className="la-cab-nome">
            <h1>{e.nome}</h1>
            <Badge v="sucesso">Cadastro ativo</Badge>
          </span>
          <small>
            ID {e.idNum} · Matrícula {e.matricula} · {e.escola} · {e.turma} · Rede Jovens Gênios
          </small>
        </span>
        <Botao v="outline" icon={Pencil} onClick={() => fora('Editar estudante')}>
          Editar estudante
        </Botao>
      </div>
      <nav className="la-abas">
        {['Dados', 'Turmas', 'Credencial de acesso', 'Atividades', 'Desempenho', 'Responsáveis'].map((a) => (
          <button key={a} className={a === 'Credencial de acesso' ? 'is-ativa' : ''} onClick={() => a !== 'Credencial de acesso' && fora(a)}>
            {a}
          </button>
        ))}
      </nav>
    </section>
  )
}

function Detalhe({ e, leitor, abrir, historico }: { e: Estudante; leitor: boolean; abrir: (t: 'emitir' | 'reemitir' | 'revogar' | 'bloquear' | 'permitir' | 'imprimir') => void; historico: () => void }) {
  const ativa = e.credencial === 'ativa'
  const bloq = e.permissao === 'bloqueada'
  const nome = e.nome.split(' ')[0]
  return (
    <>
      {bloq && (
        <div className="la-alert" role="alert">
          <TriangleAlert size={18} />
          <span>
            <b>Acesso bloqueado</b>
            {nome} não consegue entrar por nenhum método, nem com e-mail e senha. {e.bloqueio}
          </span>
        </div>
      )}
      <div className="la-colunas">
        <div className="la-col">
          <Cartao titulo="Credencial de acesso" desc="QR Code e código de ícones que o estudante usa para entrar no Exploradores.">
            <div className="la-status">
              <div>
                <small>Status da credencial</small>
                <Badge v={BCRED[e.credencial][0]}>{BCRED[e.credencial][1]}</Badge>
                <small>{ativa ? `Versão ${e.versao} · desde ${(e.reemitida ?? e.emitida ?? '').split(',')[0]}` : e.credencial === 'revogada' ? `Versão ${e.versao} · revogada` : 'Nenhuma carteirinha gerada'}</small>
              </div>
              <div>
                <small>Permissão de acesso</small>
                <Badge v={BPERM[e.permissao][0]}>{BPERM[e.permissao][1]}</Badge>
                <small>{bloq ? 'Inclusive e-mail e senha' : 'Vale para todos os métodos'}</small>
              </div>
              <div>
                <small>Último acesso bem-sucedido</small>
                <b>{e.ultimo}</b>
                <small>{e.ultimoMetodo}</small>
              </div>
            </div>
            <hr />
            {e.credencial === 'nao' ? (
              <div className="la-vazio">
                <span className="la-vazio-ic">
                  <IdCard size={26} />
                </span>
                <b>{nome} ainda não tem credencial simplificada</b>
                <p>Ao emitir, o sistema gera um QR Code e uma sequência de ícones para a carteirinha. O cadastro, a turma e o e-mail continuam iguais.</p>
                <Botao icon={IdCard} disabled={leitor} onClick={() => abrir('emitir')}>
                  Emitir credencial
                </Botao>
              </div>
            ) : (
              <div className="la-emissao">
                <div className="la-previa">
                  <div className={e.credencial === 'revogada' ? 'is-esmaecida' : ''}>
                    <Carteirinha oculta nome={e.nome} turma={`${e.turma} · ${e.escola}`} idt={`ID ${e.idNum}`} versao={e.versao} />
                  </div>
                  <small>{e.credencial === 'revogada' ? 'Esta carteirinha não funciona mais. Recolha a versão impressa.' : 'Prévia sem QR Code e sem ícones. Eles só aparecem na impressão.'}</small>
                </div>
                <div className="la-emissao-info">
                  <dl>
                    <dt>Emitida em</dt>
                    <dd>{e.emitida}</dd>
                    <dd className="is-suave">por {e.emitidaPor}</dd>
                  </dl>
                  {e.reemitida && (
                    <dl>
                      <dt>Última reemissão</dt>
                      <dd>{e.reemitida}</dd>
                      <dd className="is-suave">por {e.reemitidaPor}</dd>
                    </dl>
                  )}
                  {ativa ? (
                    <>
                      <Botao icon={Printer} disabled={leitor} onClick={() => abrir('imprimir')}>
                        Imprimir carteirinha
                      </Botao>
                      <Botao v="outline" icon={Download} disabled={leitor} onClick={() => abrir('imprimir')}>
                        Baixar PDF
                      </Botao>
                    </>
                  ) : (
                    <Botao icon={IdCard} disabled={leitor} onClick={() => abrir('emitir')}>
                      Emitir nova credencial
                    </Botao>
                  )}
                  <p className="la-nota">
                    <Info size={15} /> A carteirinha dá acesso à conta. Entregue só ao próprio estudante e descarte as versões antigas.
                  </p>
                </div>
              </div>
            )}
          </Cartao>
          <Cartao titulo="Métodos de acesso habilitados" desc="Formas que o estudante pode usar para entrar. Não mostra qual foi usado em cada acesso.">
            <ul className="la-metodos">
              {(
                [
                  [QrCode, 'QR Code da carteirinha', 'Lido pela câmera do tablet ou computador.', e.credencial],
                  [Shapes, 'Código de ícones', 'Sequência de 6 ícones espaciais impressa na carteirinha.', e.credencial],
                  [Mail, 'E-mail e senha', `${e.email} · ${bloq ? 'bloqueado junto com os outros métodos.' : 'continua valendo sem a carteirinha.'}`, 'ativa'],
                ] as [LucideIcon, string, string, string][]
              ).map(([I, t, d, c]) => (
                <li key={t}>
                  <span className="la-ic-caixa">
                    <I size={18} />
                  </span>
                  <span>
                    <b>{t}</b>
                    <small>{d}</small>
                  </span>
                  <Badge v={c === 'ativa' ? 'sucesso' : c === 'revogada' ? 'alerta' : 'outline'}>{c === 'ativa' ? 'Habilitado' : c === 'revogada' ? 'Revogado' : 'Não habilitado'}</Badge>
                </li>
              ))}
            </ul>
            <p className="la-rodape-seg">
              <ShieldCheck size={15} /> Senha, segredo do QR Code e sequência de ícones nunca aparecem no Admins.
            </p>
          </Cartao>
        </div>
        <div className="la-col is-lateral">
          <Cartao titulo="Ações da credencial">
            {leitor && (
              <p className="la-nota">
                <Lock size={15} /> Seu perfil é Leitor: você pode consultar, mas não emitir, reemitir, revogar ou bloquear. Fale com um Administrador ou Editor da escola.
              </p>
            )}
            <div className={`la-acao ${!ativa || leitor ? 'is-off' : ''}`}>
              <RefreshCw size={18} />
              <span>
                <b>Reemitir credencial</b>
                <small>Gera um novo QR Code e uma nova sequência de ícones. A carteirinha atual deixa de funcionar na hora. Pede o motivo.</small>
                <Botao v="outline" sm icon={RefreshCw} disabled={!ativa || leitor} onClick={() => abrir('reemitir')}>
                  Reemitir
                </Botao>
              </span>
            </div>
            <div className={`la-acao ${!ativa || leitor ? 'is-off' : ''}`}>
              <Ban size={18} className="is-vermelho" />
              <span>
                <b>Revogar credencial</b>
                <small>Invalida só o QR Code e o código de ícones. O estudante ainda entra com e-mail e senha.</small>
                <Botao v="destrutivo" sm disabled={!ativa || leitor} onClick={() => abrir('revogar')}>
                  Revogar credencial
                </Botao>
              </span>
            </div>
            <div className={`la-acao ${bloq ? 'is-alerta' : ''} ${leitor ? 'is-off' : ''}`}>
              {bloq ? <Lock size={18} className="is-vermelho" /> : <LockOpen size={18} className="is-verde" />}
              <span>
                <b>Permitir ou bloquear acesso</b>
                <small>Bloquear impede a entrada por todos os métodos, inclusive e-mail e senha. Cadastro e histórico continuam iguais.</small>
                <button className={`la-switch ${bloq ? '' : 'is-on'}`} disabled={leitor} role="switch" aria-checked={!bloq} onClick={() => abrir(bloq ? 'permitir' : 'bloquear')}>
                  <i />
                  {bloq ? 'Acesso bloqueado' : 'Acesso permitido'}
                </button>
              </span>
            </div>
            {e.credencial === 'nao' && <small className="la-suave">Reemitir e revogar ficam disponíveis depois da emissão.</small>}
          </Cartao>
          <HistoricoCurto e={e} verTudo={historico} />
        </div>
      </div>
    </>
  )
}

const IEV: Record<Evento['tipo'], [LucideIcon, string]> = { emitida: [QrCode, 'azul'], reemitida: [RefreshCw, 'azul'], revogada: [Ban, 'vermelho'], bloqueado: [Lock, 'vermelho'], permitido: [ShieldCheck, 'verde'], impressa: [Printer, 'azul'] }
function HistoricoCurto({ e, verTudo }: { e: Estudante; verTudo: () => void }) {
  const [aba, setAba] = useState<'adm' | 'tent'>('adm')
  return (
    <Cartao
      titulo="Histórico da credencial"
      acao={
        <Botao v="link" onClick={verTudo}>
          Ver tudo
        </Botao>
      }
    >
      <div className="la-tabs">
        <button className={aba === 'adm' ? 'is-ativa' : ''} onClick={() => setAba('adm')}>
          Ações administrativas
        </button>
        <button className={aba === 'tent' ? 'is-ativa' : ''} onClick={() => setAba('tent')}>
          Tentativas de acesso
        </button>
      </div>
      {aba === 'adm' ? (
        e.eventos.length ? (
          <ul className="la-eventos">
            {e.eventos.slice(0, 4).map((ev, i) => {
              const [I, cor] = IEV[ev.tipo]
              return (
                <motion.li key={ev.quando + ev.titulo} initial={i === 0 ? { opacity: 0, x: -8 } : false} animate={{ opacity: 1, x: 0 }}>
                  <span className={`la-marcador is-${cor}`}>
                    <I size={15} />
                  </span>
                  <span>
                    <b>{ev.titulo}</b>
                    <small>
                      {ev.quando} · {ev.quem}
                    </small>
                    {ev.extra && <em>{ev.extra}</em>}
                  </span>
                </motion.li>
              )
            })}
          </ul>
        ) : (
          <div className="la-sem-eventos">
            <History size={22} />
            <b>Nenhum evento de credencial ainda</b>
            <small>Emissões, reemissões e bloqueios aparecem aqui.</small>
          </div>
        )
      ) : (
        <ul className="la-eventos">
          {TENTATIVAS.slice(0, 4).map(([q, ev, met, , r]) => (
            <li key={q}>
              <span className={`la-marcador is-${r === 'ok' ? 'verde' : 'vermelho'}`}>{r === 'ok' ? <Check size={15} /> : <X size={15} />}</span>
              <span>
                <b>{ev}</b>
                <small>
                  {q} · {met}
                </small>
              </span>
            </li>
          ))}
        </ul>
      )}
    </Cartao>
  )
}

/* ---------------------------------------------------------- histórico */
function Historico({ e, voltar }: { e: Estudante; voltar: () => void }) {
  const [aba, setAba] = useState<'adm' | 'tent'>('tent')
  const [res, setRes] = useState('Todos os resultados')
  const [met, setMet] = useState('Todos os métodos')
  const linhas = TENTATIVAS.filter(([, , m, , r]) => (res === 'Todos os resultados' || (res === 'Sucesso') === (r === 'ok')) && (met === 'Todos os métodos' || m === met))
  return (
    <Cartao
      titulo="Histórico da credencial"
      desc="Somente leitura. Mostra quem fez cada ação e cada tentativa de entrada no Exploradores."
      acao={
        <Botao v="outline" icon={ChevronLeft} onClick={voltar}>
          Voltar para a credencial
        </Botao>
      }
      className="la-hist"
    >
      <div className="la-hist-filtros">
        <div className="la-tabs">
          <button className={aba === 'adm' ? 'is-ativa' : ''} onClick={() => setAba('adm')}>
            Ações administrativas
          </button>
          <button className={aba === 'tent' ? 'is-ativa' : ''} onClick={() => setAba('tent')}>
            Tentativas de acesso
          </button>
        </div>
        {aba === 'tent' && (
          <>
            <Select valor="Últimos 30 dias" opcoes={['Últimos 30 dias', 'Últimos 7 dias', 'Este ano']} onChange={() => {}} />
            <Select valor={res} opcoes={['Todos os resultados', 'Sucesso', 'Recusado']} onChange={setRes} />
            <Select valor={met} opcoes={['Todos os métodos', 'QR Code', 'Código de ícones', 'E-mail e senha']} onChange={setMet} />
          </>
        )}
      </div>
      {aba === 'tent' ? (
        <div className="la-tabela is-hist">
          <div className="la-tr is-cab">
            <span>Data e hora</span>
            <span>Evento</span>
            <span>Método</span>
            <span className="la-c-disp">Dispositivo</span>
            <span>Resultado</span>
          </div>
          {linhas.map(([q, ev, m, d, r]) => (
            <div key={q} className="la-tr is-estatica">
              <span>{q}</span>
              <span>
                <b>{ev}</b>
              </span>
              <span>{m}</span>
              <span className="la-c-disp">{d}</span>
              <span>
                <Badge v={r === 'ok' ? 'sucesso' : 'destrutivo'}>{r === 'ok' ? 'Sucesso' : 'Recusado'}</Badge>
              </span>
            </div>
          ))}
          {!linhas.length && <p className="la-vazio-lista">Nenhuma tentativa com esses filtros.</p>}
        </div>
      ) : (
        <ul className="la-eventos">
          {e.eventos.map((ev) => {
            const [I, cor] = IEV[ev.tipo]
            return (
              <li key={ev.quando + ev.titulo}>
                <span className={`la-marcador is-${cor}`}>
                  <I size={15} />
                </span>
                <span>
                  <b>{ev.titulo}</b>
                  <small>
                    {ev.quando} · {ev.quem}
                  </small>
                  {ev.extra && <em>{ev.extra}</em>}
                </span>
              </li>
            )
          })}
        </ul>
      )}
      <p className="la-rodape-seg">
        <ShieldCheck size={15} /> Os registros não guardam a sequência digitada, o conteúdo do QR Code nem senhas.
      </p>
    </Cartao>
  )
}

/* ----------------------------------------------------------- diálogos */
type Acoes = { emitir: (id: string) => void; reemitir: (id: string, m: string) => void; revogar: (id: string, m: string) => void; bloquear: (id: string, m: string) => void; permitir: (id: string) => void; imprimir: (id: string) => void }
function Dialogo({ dlg, est, fechar, acoes, lote, sel, imprimirLote }: { dlg: Dlg; est: (id: string) => Estudante; fechar: () => void; acoes: Acoes; lote: (ids: string[]) => void; sel: string[]; imprimirLote: (ids: string[]) => void }) {
  const [motivo, setMotivo] = useState('')
  const [obs, setObs] = useState('')
  useEffect(() => {
    const k = (ev: KeyboardEvent) => ev.key === 'Escape' && fechar()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [fechar])
  const e = 'est' in dlg ? est(dlg.est) : null
  const nome = e?.nome.split(' ').slice(0, 2).join(' ') ?? ''
  const conf = (fn: () => void) => () => {
    fn()
    if (dlg.tipo !== 'lote') fechar()
  }
  let cor: 'azul' | 'vermelho' | 'verde' | 'amarelo' = 'azul'
  let I: LucideIcon = IdCard
  let titulo = ''
  let desc = ''
  let corpo: ReactNode = null
  let botoes: ReactNode = null
  const impacto = (linhas: [LucideIcon, string, string, 'destrutivo' | 'sucesso'][]) => (
    <ul className="la-impacto">
      {linhas.map(([Ic, n, t, v]) => (
        <li key={n}>
          <Ic size={16} />
          <b>{n}</b>
          <Badge v={v}>{t}</Badge>
        </li>
      ))}
    </ul>
  )
  if (dlg.tipo === 'emitir' && e) {
    titulo = `Emitir credencial para ${e.nome.split(' ')[0]}?`
    desc = 'O sistema gera um QR Code e uma sequência de 6 ícones só dele(a). Nenhuma conta nova é criada.'
    corpo = (
      <ul className="la-checks">
        {['Cadastro, turma e histórico continuam iguais.', 'E-mail e senha continuam funcionando.', 'A carteirinha fica pronta para imprimir logo depois.'].map((t) => (
          <li key={t}>
            <Check size={16} /> {t}
          </li>
        ))}
      </ul>
    )
    botoes = (
      <Botao icon={IdCard} onClick={conf(() => acoes.emitir(e.id))}>
        Emitir credencial
      </Botao>
    )
  }
  if (dlg.tipo === 'reemitir' && e) {
    I = RefreshCw
    titulo = `Reemitir a credencial de ${nome}?`
    desc = `A carteirinha atual (versão ${e.versao}) para de funcionar assim que você confirmar. A nova será a versão ${e.versao + 1}.`
    corpo = (
      <>
        <Select rotulo="Motivo" valor={motivo || 'Selecione o motivo'} opcoes={['Selecione o motivo', ...MOTIVOS_REEMISSAO]} onChange={(v) => setMotivo(v === 'Selecione o motivo' ? '' : v)} />
        <label className="la-textarea">
          <span>Observação (opcional)</span>
          <textarea placeholder="Ex.: cartão esquecido no ônibus escolar" value={obs} onChange={(v) => setObs(v.target.value)} />
        </label>
        <p className="la-nota">Recolha a carteirinha antiga, se ela aparecer, e entregue a nova só para {e.nome.split(' ')[0]}.</p>
      </>
    )
    botoes = (
      <Botao icon={RefreshCw} disabled={!motivo} onClick={conf(() => acoes.reemitir(e.id, motivo))}>
        Reemitir credencial
      </Botao>
    )
  }
  if (dlg.tipo === 'revogar' && e) {
    I = Ban
    cor = 'vermelho'
    titulo = `Revogar a credencial de ${nome}?`
    desc = 'QR Code e código de ícones param de funcionar. O estudante continua entrando com e-mail e senha.'
    corpo = (
      <>
        {impacto([
          [QrCode, 'QR Code', 'Para de funcionar', 'destrutivo'],
          [Shapes, 'Código de ícones', 'Para de funcionar', 'destrutivo'],
          [Mail, 'E-mail e senha', 'Continua', 'sucesso'],
        ])}
        <Select rotulo="Motivo" valor={motivo || 'Selecione o motivo'} opcoes={['Selecione o motivo', ...MOTIVOS_REVOGACAO]} onChange={(v) => setMotivo(v === 'Selecione o motivo' ? '' : v)} />
        <p className="la-nota">Para impedir qualquer entrada, inclusive por e-mail e senha, use “Bloquear acesso”.</p>
      </>
    )
    botoes = (
      <Botao v="destrutivo" disabled={!motivo} onClick={conf(() => acoes.revogar(e.id, motivo))}>
        Revogar credencial
      </Botao>
    )
  }
  if (dlg.tipo === 'bloquear' && e) {
    I = Lock
    cor = 'vermelho'
    titulo = `Bloquear o acesso de ${nome}?`
    desc = 'O estudante não vai conseguir entrar por nenhum método. As sessões abertas são encerradas na hora.'
    corpo = (
      <>
        {impacto([
          [QrCode, 'QR Code', 'Bloqueado', 'destrutivo'],
          [Shapes, 'Código de ícones', 'Bloqueado', 'destrutivo'],
          [Mail, 'E-mail e senha', 'Bloqueado', 'destrutivo'],
        ])}
        <Select rotulo="Motivo" valor={motivo || 'Selecione o motivo'} opcoes={['Selecione o motivo', ...MOTIVOS_BLOQUEIO]} onChange={(v) => setMotivo(v === 'Selecione o motivo' ? '' : v)} />
        <label className="la-textarea">
          <span>Observação (opcional)</span>
          <textarea placeholder="Fica registrada no histórico" value={obs} onChange={(v) => setObs(v.target.value)} />
        </label>
        <p className="la-nota">Cadastro, credencial e histórico continuam guardados. Você pode permitir o acesso de novo quando quiser.</p>
      </>
    )
    botoes = (
      <Botao v="destrutivo" icon={Lock} disabled={!motivo} onClick={conf(() => acoes.bloquear(e.id, motivo))}>
        Bloquear acesso
      </Botao>
    )
  }
  if (dlg.tipo === 'permitir' && e) {
    I = LockOpen
    cor = 'verde'
    titulo = `Permitir o acesso de ${nome} de novo?`
    desc = 'O estudante volta a entrar pelos métodos habilitados: QR Code, código de ícones e e-mail e senha.'
    corpo = <p className="la-nota">A mudança fica registrada no histórico com seu nome, a data e o estado anterior (Bloqueado → Permitido).</p>
    botoes = (
      <Botao icon={LockOpen} onClick={conf(() => acoes.permitir(e.id))}>
        Permitir acesso
      </Botao>
    )
  }
  if (dlg.tipo === 'imprimir' && e) {
    I = Printer
    titulo = 'Imprimir carteirinha'
    desc = `Confira os dados antes de imprimir. Este material dá acesso à conta de ${e.nome.split(' ')[0]}.`
    corpo = (
      <>
        <div className="la-impressao">
          <div>
            <Carteirinha nome={e.nome} turma={`${e.turma} · ${e.escola}`} idt={`ID ${e.idNum}`} versao={e.versao} token={`${e.idNum}V${e.versao}X9Q2`} />
          </div>
        </div>
        <Select rotulo="Formato" valor="Cartão individual · 85 × 54 mm" opcoes={['Cartão individual · 85 × 54 mm', 'Folha A4 · 8 carteirinhas']} onChange={() => {}} />
        <div className="la-alerta-neutro">
          <EyeOff size={16} />
          <span>
            <b>Material sensível</b>
            Entregue só para {e.nome.split(' ')[0]}, não envie o arquivo por e-mail ou WhatsApp e descarte versões antigas.
          </span>
        </div>
      </>
    )
    botoes = (
      <>
        <Botao v="outline" icon={Download} onClick={conf(() => acoes.imprimir(e.id))}>
          Baixar PDF
        </Botao>
        <Botao icon={Printer} onClick={conf(() => acoes.imprimir(e.id))}>
          Imprimir
        </Botao>
      </>
    )
  }
  if (dlg.tipo === 'lote') {
    const alvos = sel.filter((i) => est(i).credencial !== 'ativa')
    titulo = `Emitir credenciais para ${alvos.length} ${alvos.length === 1 ? 'estudante' : 'estudantes'}?`
    desc = 'Cada um recebe um QR Code e uma sequência de ícones próprios. Nenhuma conta nova é criada.'
    corpo = (
      <>
        <ul className="la-pessoas">
          {alvos.map((i) => (
            <li key={i}>
              <span className="la-avatar">{iniciais(est(i).nome)}</span>
              <span>
                <b>{est(i).nome}</b>
                <small>
                  {est(i).escola} · {est(i).turma}
                </small>
              </span>
              <Badge v="outline">Será emitida</Badge>
            </li>
          ))}
        </ul>
        <p className="la-nota">Quem já tem credencial ativa fica de fora. Para trocar uma credencial, use “Reemitir” no cadastro do estudante.</p>
      </>
    )
    botoes = (
      <Botao icon={IdCard} onClick={() => lote(alvos)}>
        Emitir {alvos.length} {alvos.length === 1 ? 'credencial' : 'credenciais'}
      </Botao>
    )
  }
  if (dlg.tipo === 'lote-resultado') {
    const pend = dlg.pend.length
    I = pend ? TriangleAlert : CircleCheck
    cor = pend ? 'amarelo' : 'verde'
    titulo = pend ? `Emissão concluída com ${pend} pendência` : 'Credenciais emitidas'
    desc = pend ? `${dlg.ok.length} ${dlg.ok.length === 1 ? 'credencial emitida' : 'credenciais emitidas'} e ${pend} não concluída. Nada foi duplicado: você pode tentar de novo com segurança.` : 'Todas as carteirinhas estão prontas para imprimir.'
    corpo = (
      <ul className="la-pessoas">
        {[...dlg.ok.map((i) => [i, true] as const), ...dlg.pend.map((i) => [i, false] as const)].map(([i, ok]) => (
          <li key={i}>
            <span className="la-avatar">{iniciais(est(i).nome)}</span>
            <span>
              <b>{est(i).nome}</b>
              <small>{ok ? `Credencial versão ${est(i).versao} · pronta para imprimir` : 'Não foi possível concluir agora'}</small>
            </span>
            <Badge v={ok ? 'sucesso' : 'destrutivo'}>{ok ? 'Emitida' : 'Não emitida'}</Badge>
          </li>
        ))}
      </ul>
    )
    botoes = (
      <>
        {pend > 0 && (
          <Botao v="outline" icon={RefreshCw} onClick={() => lote(dlg.pend)}>
            Tentar de novo a pendente
          </Botao>
        )}
        {dlg.ok.length > 0 && (
          <Botao icon={Printer} onClick={() => imprimirLote(dlg.ok)}>
            Imprimir {dlg.ok.length} {dlg.ok.length === 1 ? 'carteirinha' : 'carteirinhas'}
          </Botao>
        )}
      </>
    )
  }
  return (
    <motion.div className="la-veu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(ev) => ev.target === ev.currentTarget && fechar()}>
      <motion.div className={`la-dialog ${dlg.tipo === 'imprimir' ? 'is-largo' : ''}`} role="dialog" aria-modal="true" aria-label={titulo} initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ type: 'spring', stiffness: 380, damping: 30 }}>
        <header>
          <span className={`la-dialog-ic is-${cor}`}>
            <I size={20} />
          </span>
          <span>
            <h2>{titulo}</h2>
            <p>{desc}</p>
          </span>
          <button onClick={fechar} aria-label="Fechar">
            <X size={16} />
          </button>
        </header>
        <div className="la-dialog-corpo">{corpo}</div>
        <footer>
          {dlg.tipo !== 'lote-resultado' && (
            <Botao v="outline" onClick={fechar}>
              {dlg.tipo === 'imprimir' ? 'Fechar' : 'Cancelar'}
            </Botao>
          )}
          {botoes}
        </footer>
      </motion.div>
    </motion.div>
  )
}
