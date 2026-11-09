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
  Eye,
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
import {
  agora,
  bloqueados,
  credencialDe,
  disponiveis,
  entraCom,
  ESTUDANTES,
  iniciais,
  listaMetodos,
  METODOS,
  MOTIVOS_BLOQUEIO,
  MOTIVOS_REEMISSAO,
  MOTIVOS_REVOGACAO,
  permissaoDe,
  TENTATIVAS,
  type EstadoMetodo,
  type Estudante,
  type Evento,
  type MetodoId,
} from './data'
import './admin-login.css'

/* =====================================================================
   Login simplificado · Admins
   Telas A1–A8, diálogos O1–O8 e avisos T1–T5 do Figma (Global DS · Admins)
   Cada método (QR Code, código de ícones, e-mail e senha) tem estado próprio:
   habilitado, bloqueado (temporário), revogado (precisa de nova credencial/senha) ou não emitido.
   ===================================================================== */

type View = { id: 'lista' } | { id: 'detalhe'; est: string } | { id: 'historico'; est: string }
type Dlg =
  | { tipo: 'emitir' | 'reemitir' | 'revogar' | 'bloquear' | 'permitir' | 'imprimir'; est: string }
  | { tipo: 'lote' }
  | { tipo: 'lote-resultado'; ok: string[]; pend: string[] }
type Toast = { id: number; tipo: 'ok' | 'neutro' | 'erro'; titulo: string; desc: string }

const ICON: Record<MetodoId, LucideIcon> = { qr: QrCode, icones: Shapes, email: Mail }
const ATALHOS: Record<string, { view: View; perfil?: 'Gestor' | 'Leitor'; sel?: string[]; dlg?: Dlg }> = {
  lista: { view: { id: 'lista' } },
  lote: { view: { id: 'lista' }, sel: ['laura', 'sofia'] },
  ativa: { view: { id: 'detalhe', est: 'ana' } },
  sem: { view: { id: 'detalhe', est: 'laura' } },
  emitir: { view: { id: 'detalhe', est: 'laura' }, dlg: { tipo: 'emitir', est: 'laura' } },
  reemitir: { view: { id: 'detalhe', est: 'ana' }, dlg: { tipo: 'reemitir', est: 'ana' } },
  imprimir: { view: { id: 'detalhe', est: 'ana' }, dlg: { tipo: 'imprimir', est: 'ana' } },
  revogar: { view: { id: 'detalhe', est: 'ana' }, dlg: { tipo: 'revogar', est: 'ana' } },
  bloquear: { view: { id: 'detalhe', est: 'ana' }, dlg: { tipo: 'bloquear', est: 'ana' } },
  revogada: { view: { id: 'detalhe', est: 'mariana' } },
  bloqueado: { view: { id: 'detalhe', est: 'theo' } },
  leitor: { view: { id: 'detalhe', est: 'ana' }, perfil: 'Leitor' },
  historico: { view: { id: 'historico', est: 'ana' } },
}

export default function LoginAdmin({ startScreen }: PrototypeProps) {
  const ini = ATALHOS[startScreen ?? ''] ?? ATALHOS.lista
  const [view, setView] = useState<View>(ini.view)
  const [lista, setLista] = useState<Estudante[]>(() => ESTUDANTES.map((e) => ({ ...e, metodos: { ...e.metodos }, eventos: [...e.eventos] })))
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
  const comMetodos = (e: Estudante, ids: MetodoId[], novo: EstadoMetodo) => ({ ...e.metodos, ...Object.fromEntries(ids.map((m) => [m, novo])) }) as Estudante['metodos']
  const primeiro = (id: string) => est(id).nome.split(' ')[0]
  const depois = (e: Estudante) => {
    const ok = entraCom(e)
    return ok.length ? `${primeiro(e.id)} ainda entra com ${listaMetodos(ok).toLowerCase().replace('qr code', 'QR Code')}.` : `${primeiro(e.id)} não entra por nenhum método.`
  }
  /** carteirinha nova: QR e ícones voltam (o que estava bloqueado continua bloqueado) */
  const novaCarteirinha = (e: Estudante): Estudante['metodos'] => ({ ...e.metodos, qr: e.metodos.qr === 'bloqueado' ? 'bloqueado' : 'habilitado', icones: e.metodos.icones === 'bloqueado' ? 'bloqueado' : 'habilitado' })

  const acoes = {
    emitir: (id: string) => {
      muda(id, (e) => ({ ...e, metodos: novaCarteirinha(e), versao: e.versao + 1, emitida: agora(), emitidaPor: 'Bruno Tamburro (Gestor)', reemitida: undefined, reemitidaPor: undefined, eventos: evento(e, { tipo: 'emitida', titulo: 'Credencial emitida', extra: `Versão ${e.versao + 1} · QR Code e código de ícones habilitados · sem nova conta` }) }))
      avisar('ok', 'Credencial emitida', `QR Code e código de ícones de ${primeiro(id)} estão habilitados. A carteirinha está pronta para imprimir.`)
    },
    reemitir: (id: string, motivo: string) => {
      const v = est(id).versao + 1
      muda(id, (e) => ({ ...e, metodos: novaCarteirinha(e), versao: v, reemitida: agora(), reemitidaPor: `Bruno Tamburro · Motivo: ${motivo.toLowerCase()}`, eventos: evento(e, { tipo: 'reemitida', titulo: 'Credencial reemitida', extra: `Motivo: ${motivo.toLowerCase()} · versão ${v - 1} invalidada` }) }))
      avisar('ok', `Credencial reemitida · versão ${v}`, 'A carteirinha anterior já não funciona.')
    },
    revogar: (id: string, ids: MetodoId[], motivo: string) => {
      const novo = { ...est(id), metodos: comMetodos(est(id), ids, 'revogado') }
      muda(id, (e) => ({ ...e, metodos: comMetodos(e, ids, 'revogado'), eventos: evento(e, { tipo: 'revogada', titulo: ids.length === 3 ? 'Todos os acessos revogados' : 'Acesso revogado', extra: `${listaMetodos(ids)} · motivo: ${motivo.toLowerCase()}` }) }))
      avisar('neutro', `${listaMetodos(ids)}: revogado`, depois(novo))
    },
    bloquear: (id: string, ids: MetodoId[], motivo: string) => {
      const novo = { ...est(id), metodos: comMetodos(est(id), ids, 'bloqueado') }
      const total = !entraCom(novo).length
      muda(id, (e) => ({ ...e, metodos: comMetodos(e, ids, 'bloqueado'), bloqueio: `Bloqueado em ${agora().split(',')[0]} por Bruno Tamburro (Gestor). Motivo: ${motivo.toLowerCase()}.`, eventos: evento(e, { tipo: 'bloqueado', titulo: total ? 'Acesso bloqueado' : 'Acesso bloqueado em parte', extra: `${listaMetodos(ids)} · Permitido → Bloqueado · sessões abertas encerradas` }) }))
      avisar('neutro', total ? 'Acesso bloqueado' : `${listaMetodos(ids)}: bloqueado`, depois(novo))
    },
    permitir: (id: string, ids: MetodoId[]) => {
      const novo = { ...est(id), metodos: comMetodos(est(id), ids, 'habilitado') }
      muda(id, (e) => ({ ...e, metodos: comMetodos(e, ids, 'habilitado'), bloqueio: bloqueados(novo).length ? e.bloqueio : undefined, eventos: evento(e, { tipo: 'permitido', titulo: 'Permissão de acesso alterada', extra: `${listaMetodos(ids)} · Bloqueado → Permitido` }) }))
      avisar('ok', `${listaMetodos(ids)}: permitido`, depois(novo))
    },
    imprimir: (id: string) => {
      muda(id, (e) => ({ ...e, eventos: evento(e, { tipo: 'impressa', titulo: 'Carteirinha impressa', extra: `Versão ${e.versao}` }) }))
      avisar('ok', 'Carteirinha enviada para impressão', 'Entregue só para o próprio estudante.')
    },
    exibir: (id: string) => muda(id, (e) => ({ ...e, eventos: evento(e, { tipo: 'visualizada', titulo: 'Dados de acesso exibidos', extra: 'QR Code e sequência de ícones mostrados na tela do Admins' }) })),
  }

  const emitirLote = (ids: string[]) => {
    const pend = !loteFalhou && ids.includes('sofia') && ids.length > 1 ? ['sofia'] : []
    const ok = ids.filter((i) => !pend.includes(i))
    ok.forEach((i) => muda(i, (e) => ({ ...e, metodos: novaCarteirinha(e), versao: e.versao + 1, emitida: agora(), emitidaPor: 'Bruno Tamburro (Gestor)', eventos: evento(e, { tipo: 'emitida', titulo: 'Credencial emitida', extra: `Versão ${e.versao + 1} · emissão em lote` }) })))
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
      <Sidebar
        aberta={gaveta}
        perfil={perfil}
        trocarPerfil={() => {
          setPerfil(leitor ? 'Gestor' : 'Leitor')
          avisar('neutro', `Agora você vê como ${leitor ? 'Gestor' : 'Leitor'}`, leitor ? 'Pode emitir, reemitir, revogar, bloquear e imprimir.' : 'Pode consultar, mas não alterar credenciais.')
        }}
        fora={fora}
        fechar={() => setGaveta(false)}
      />
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
            {view.id === 'lista' && (
              <Lista
                lista={lista}
                sel={sel}
                setSel={setSel}
                abrir={(id) => abrir({ id: 'detalhe', est: id })}
                lote={() => setDlg({ tipo: 'lote' })}
                imprimir={() => {
                  const alvo = sel.find((i) => credencialDe(est(i)) !== 'nao' && credencialDe(est(i)) !== 'revogada')
                  if (alvo) setDlg({ tipo: 'imprimir', est: alvo })
                  else avisar('neutro', 'Nenhuma carteirinha para imprimir', 'Emita as credenciais dos selecionados antes de imprimir.')
                }}
                fora={fora}
                leitor={leitor}
              />
            )}
            {view.id !== 'lista' && (
              <>
                <Migalhas itens={['Início', 'Instituições', 'Estudantes', est(view.est).nome, ...(view.id === 'historico' ? ['Histórico da credencial'] : [])]} ir={(i) => (i === 2 ? abrir({ id: 'lista' }) : i === 3 ? abrir({ id: 'detalhe', est: view.est }) : fora(['Início', 'Instituições'][i] ?? ''))} />
                <Cabecalho e={est(view.est)} fora={fora} />
                {view.id === 'detalhe' ? <Detalhe e={est(view.est)} leitor={leitor} abrir={(t) => setDlg({ tipo: t, est: view.est })} historico={() => abrir({ id: 'historico', est: view.est })} exibir={() => acoes.exibir(view.est)} /> : <Historico e={est(view.est)} voltar={() => abrir({ id: 'detalhe', est: view.est })} />}
              </>
            )}
          </motion.main>
        </AnimatePresence>
      </div>

      <AnimatePresence>{dlg && <Dialogo key={dlg.tipo} dlg={dlg} est={est} fechar={() => setDlg(null)} acoes={acoes} lote={emitirLote} sel={sel} imprimirLote={(ids) => setDlg({ tipo: 'imprimir', est: ids[0] })} />}</AnimatePresence>
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
const BCRED = { ativa: ['sucesso', 'Ativa'], nao: ['outline', 'Não emitida'], revogada: ['alerta', 'Revogada'], parcial: ['alerta', 'Revogada em parte'] } as const
const BPERM = { permitida: ['sucesso', 'Permitida'], bloqueada: ['destrutivo', 'Bloqueada'], parcial: ['destrutivo', 'Bloqueio parcial'] } as const
const BMET: Record<EstadoMetodo, ['sucesso' | 'destrutivo' | 'alerta' | 'outline', string]> = { habilitado: ['sucesso', 'Habilitado'], bloqueado: ['destrutivo', 'Bloqueado'], revogado: ['alerta', 'Revogado'], nao: ['outline', 'Não emitido'] }

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

function Chk({ on, onClick, disabled }: { on: boolean; onClick: () => void; disabled?: boolean }) {
  return (
    <button className={`la-chk ${on ? 'is-on' : ''}`} role="checkbox" aria-checked={on} onClick={onClick} disabled={disabled}>
      {on && <Check size={12} strokeWidth={3} />}
    </button>
  )
}

/** ícones da coluna Métodos, com o estado real de cada um */
function IconesMetodos({ e }: { e: Estudante }) {
  return (
    <>
      {METODOS.map(({ id, nome }) => {
        const I = ICON[id]
        const st = e.metodos[id]
        return (
          <span key={id} className={`la-met is-${st}`} title={`${nome}: ${BMET[st][1].toLowerCase()}`}>
            <I size={18} />
            {(st === 'bloqueado' || st === 'revogado') && <i />}
          </span>
        )
      })}
    </>
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
          (fCred === 'Todas' || BCRED[credencialDe(e)][1] === fCred) &&
          (fPerm === 'Todas' || BPERM[permissaoDe(e)][1] === fPerm) &&
          (fEsc === escolas[0] || e.escola === fEsc) &&
          (fTur === turmas[0] || e.turma === fTur),
      ),
    [lista, busca, fCred, fPerm, fEsc, fTur],
  )
  const semCred = sel.filter((i) => credencialDe(lista.find((e) => e.id === i)!) === 'nao').length
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
        <Select rotulo="Credencial de acesso" valor={fCred} opcoes={['Todas', 'Ativa', 'Não emitida', 'Revogada', 'Revogada em parte']} onChange={setFCred} />
        <Select rotulo="Permissão de acesso" valor={fPerm} opcoes={['Todas', 'Permitida', 'Bloqueada', 'Bloqueio parcial']} onChange={setFPerm} />
        <Select rotulo="Escola" valor={fEsc} opcoes={escolas} onChange={setFEsc} />
        <Select rotulo="Turma" valor={fTur} opcoes={turmas} onChange={setFTur} />
        <Botao
          v="ghost"
          disabled={!filtrando}
          onClick={() => {
            setFCred('Todas')
            setFPerm('Todas')
            setFEsc(escolas[0])
            setFTur(turmas[0])
          }}
        >
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
        {vis.map((e) => {
          const c = credencialDe(e)
          const p = permissaoDe(e)
          return (
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
                <Badge v={BCRED[c][0]}>{BCRED[c][1]}</Badge>
              </span>
              <span className="la-c-perm">
                <Badge v={BPERM[p][0]}>{BPERM[p][1]}</Badge>
              </span>
              <span className="la-c-met">
                <IconesMetodos e={e} />
              </span>
              <span className="la-c-ult">{e.ultimo.split(',')[0]}</span>
              <span className="la-c-mais">
                <Ellipsis size={18} />
              </span>
            </div>
          )
        })}
        {!vis.length && <p className="la-vazio-lista">Nenhum estudante com esses filtros.</p>}
        <footer className="la-tabela-pe">
          <span>Mostrando {vis.length} de 312 estudantes</span>
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

const descMetodo = (e: Estudante, id: MetodoId) => {
  const st = e.metodos[id]
  if (id === 'email') return st === 'revogado' ? `${e.email} · senha atual invalidada; defina uma nova senha no cadastro.` : st === 'bloqueado' ? `${e.email} · bloqueado por um administrador.` : `${e.email} · continua valendo sem a carteirinha.`
  const base = METODOS.find((m) => m.id === id)!.desc
  return st === 'revogado' ? `A carteirinha v${e.versao} não vale mais. Emita uma nova credencial para voltar a usar.` : st === 'bloqueado' ? `${base} Bloqueado por um administrador.` : st === 'nao' ? 'Ainda não há carteirinha emitida para este estudante.' : base
}

function Detalhe({ e, leitor, abrir, historico, exibir }: { e: Estudante; leitor: boolean; abrir: (t: 'emitir' | 'reemitir' | 'revogar' | 'bloquear' | 'permitir' | 'imprimir') => void; historico: () => void; exibir: () => void }) {
  const [ver, setVer] = useState(false)
  const cred = credencialDe(e)
  const perm = permissaoDe(e)
  const bloq = bloqueados(e)
  const nome = e.nome.split(' ')[0]
  const temCarteirinha = cred === 'ativa' || cred === 'parcial'
  const podeRevogar = disponiveis(e).length > 0
  const podeBloquear = entraCom(e).length > 0
  const alternar = () => {
    if (!ver) exibir()
    setVer(!ver)
  }
  return (
    <>
      {bloq.length > 0 && (
        <div className="la-alert" role="alert">
          <TriangleAlert size={18} />
          <span>
            <b>{perm === 'bloqueada' ? 'Acesso bloqueado' : 'Acesso bloqueado em parte'}</b>
            {perm === 'bloqueada' ? `${nome} não consegue entrar por nenhum método. ` : `Bloqueado: ${listaMetodos(bloq).toLowerCase().replace('qr code', 'QR Code')}. ${nome} ainda entra com ${listaMetodos(entraCom(e)).toLowerCase().replace('qr code', 'QR Code')}. `}
            {e.bloqueio}
          </span>
        </div>
      )}
      <div className="la-colunas">
        <div className="la-col">
          <Cartao titulo="Credencial de acesso" desc="QR Code e código de ícones que o estudante usa para entrar no Exploradores.">
            <div className="la-status">
              <div>
                <small>Status da credencial</small>
                <Badge v={BCRED[cred][0]}>{BCRED[cred][1]}</Badge>
                <small>
                  {cred === 'nao'
                    ? 'Nenhuma carteirinha gerada'
                    : cred === 'revogada'
                      ? `Versão ${e.versao} · QR Code e ícones revogados`
                      : cred === 'parcial'
                        ? `Versão ${e.versao} · ${e.metodos.qr === 'revogado' ? 'QR Code' : 'código de ícones'} revogado`
                        : `Versão ${e.versao} · desde ${(e.reemitida ?? e.emitida ?? '').split(',')[0]}`}
                </small>
              </div>
              <div>
                <small>Permissão de acesso</small>
                <Badge v={BPERM[perm][0]}>{BPERM[perm][1]}</Badge>
                <small>{perm === 'permitida' ? 'Nenhum método bloqueado' : perm === 'bloqueada' ? 'Todos os métodos bloqueados' : `Bloqueado: ${listaMetodos(bloq).toLowerCase().replace('qr code', 'QR Code')}`}</small>
              </div>
              <div>
                <small>Último acesso bem-sucedido</small>
                <b>{e.ultimo}</b>
                <small>{e.ultimoMetodo}</small>
              </div>
            </div>
            <hr />
            {cred === 'nao' ? (
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
                  <div className={cred === 'revogada' ? 'is-esmaecida' : ''}>
                    <Carteirinha
                      oculta={!ver}
                      nome={e.nome}
                      turma={`${e.turma} · ${e.escola}`}
                      idt={`ID ${e.idNum}`}
                      versao={e.versao}
                      token={`${e.idNum}V${e.versao}X9Q2`}
                      revogado={{ qr: e.metodos.qr === 'revogado', icones: e.metodos.icones === 'revogado' }}
                      onAlternar={leitor || cred === 'revogada' ? undefined : alternar}
                    />
                  </div>
                  {cred === 'revogada' ? (
                    <small>Esta carteirinha não funciona mais. Recolha a versão impressa.</small>
                  ) : leitor ? (
                    <small>Perfil Leitor: os dados de acesso ficam ocultos.</small>
                  ) : (
                    <Botao v="ghost" sm icon={ver ? EyeOff : Eye} className="la-ver" onClick={alternar}>
                      {ver ? 'Ocultar QR Code e ícones' : 'Exibir QR Code e ícones'}
                    </Botao>
                  )}
                  {ver && !leitor && <small className="la-aviso-ver">Visível só para você. A exibição fica registrada no histórico.</small>}
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
                  {temCarteirinha && cred === 'ativa' ? (
                    <>
                      <Botao icon={Printer} disabled={leitor} onClick={() => abrir('imprimir')}>
                        Imprimir carteirinha
                      </Botao>
                      <Botao v="outline" icon={Download} disabled={leitor} onClick={() => abrir('imprimir')}>
                        Baixar PDF
                      </Botao>
                    </>
                  ) : (
                    <Botao icon={IdCard} disabled={leitor} onClick={() => abrir(cred === 'parcial' ? 'reemitir' : 'emitir')}>
                      {cred === 'parcial' ? 'Reemitir credencial completa' : 'Emitir nova credencial'}
                    </Botao>
                  )}
                  <p className="la-nota">
                    <Info size={15} /> A carteirinha dá acesso à conta. Entregue só ao próprio estudante e descarte as versões antigas.
                  </p>
                </div>
              </div>
            )}
          </Cartao>
          <Cartao titulo="Métodos de acesso habilitados" desc="Estado atual de cada forma de entrar. Não mostra qual foi usada em cada acesso.">
            <ul className="la-metodos">
              {METODOS.map(({ id, longo }) => {
                const I = ICON[id]
                const st = e.metodos[id]
                return (
                  <li key={id} className={`is-${st}`}>
                    <span className="la-ic-caixa">
                      <I size={18} />
                    </span>
                    <span>
                      <b>{longo}</b>
                      <small>{descMetodo(e, id)}</small>
                    </span>
                    <Badge v={BMET[st][0]}>{BMET[st][1]}</Badge>
                  </li>
                )
              })}
            </ul>
            <p className="la-resumo-entrada">
              {entraCom(e).length ? (
                <>
                  <CircleCheck size={15} /> Hoje {nome} entra com: <b>{listaMetodos(entraCom(e)).replace('qr code', 'QR Code')}</b>.
                </>
              ) : (
                <>
                  <Lock size={15} /> Hoje {nome} não entra por nenhum método.
                </>
              )}
            </p>
            <p className="la-rodape-seg">
              <ShieldCheck size={15} /> A senha nunca aparece no Admins. QR Code e sequência de ícones só aparecem quando você toca em Exibir.
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
            <div className={`la-acao ${!temCarteirinha || leitor ? 'is-off' : ''}`}>
              <RefreshCw size={18} />
              <span>
                <b>Reemitir credencial</b>
                <small>Gera um novo QR Code e uma nova sequência de ícones. A carteirinha atual deixa de funcionar na hora. Pede o motivo.</small>
                <Botao v="outline" sm icon={RefreshCw} disabled={!temCarteirinha || leitor} onClick={() => abrir('reemitir')}>
                  Reemitir
                </Botao>
              </span>
            </div>
            <div className={`la-acao ${!podeRevogar || leitor ? 'is-off' : ''}`}>
              <Ban size={18} className="is-vermelho" />
              <span>
                <b>Revogar acessos</b>
                <small>Invalida de vez os métodos que você escolher: QR Code e ícones só voltam com nova carteirinha; e-mail e senha, com nova senha.</small>
                <Botao v="destrutivo" sm disabled={!podeRevogar || leitor} onClick={() => abrir('revogar')}>
                  Escolher o que revogar
                </Botao>
              </span>
            </div>
            <div className={`la-acao ${bloq.length ? 'is-alerta' : ''} ${leitor ? 'is-off' : ''}`}>
              {bloq.length ? <Lock size={18} className="is-vermelho" /> : <LockOpen size={18} className="is-verde" />}
              <span>
                <b>Permitir ou bloquear acesso</b>
                <small>Pausa a entrada pelos métodos que você escolher, sem apagar nada. Dá para permitir de novo quando quiser.</small>
                <button className={`la-switch ${perm === 'permitida' ? 'is-on' : perm === 'parcial' ? 'is-parcial' : ''}`} disabled={leitor || (!bloq.length && !podeBloquear)} role="switch" aria-checked={perm === 'permitida'} onClick={() => abrir(bloq.length ? 'permitir' : 'bloquear')}>
                  <i />
                  {perm === 'permitida' ? 'Acesso permitido em todos os métodos' : perm === 'bloqueada' ? 'Acesso bloqueado em todos os métodos' : `Bloqueado: ${listaMetodos(bloq).toLowerCase().replace('qr code', 'QR Code')}`}
                </button>
                {perm === 'parcial' && !leitor && (
                  <Botao v="link" onClick={() => abrir('bloquear')}>
                    Bloquear outros métodos
                  </Botao>
                )}
              </span>
            </div>
            {cred === 'nao' && <small className="la-suave">Reemitir fica disponível depois da emissão.</small>}
          </Cartao>
          <HistoricoCurto e={e} verTudo={historico} />
        </div>
      </div>
    </>
  )
}

const IEV: Record<Evento['tipo'], [LucideIcon, string]> = { emitida: [QrCode, 'azul'], reemitida: [RefreshCw, 'azul'], revogada: [Ban, 'vermelho'], bloqueado: [Lock, 'vermelho'], permitido: [ShieldCheck, 'verde'], impressa: [Printer, 'azul'], visualizada: [Eye, 'azul'] }
function ListaEventos({ eventos, max }: { eventos: Evento[]; max?: number }) {
  return (
    <ul className="la-eventos">
      {eventos.slice(0, max ?? eventos.length).map((ev, i) => {
        const [I, cor] = IEV[ev.tipo]
        return (
          <motion.li key={ev.quando + ev.titulo + i} initial={i === 0 ? { opacity: 0, x: -8 } : false} animate={{ opacity: 1, x: 0 }}>
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
  )
}
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
          <ListaEventos eventos={e.eventos} max={4} />
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
        <ListaEventos eventos={e.eventos} />
      )}
      <p className="la-rodape-seg">
        <ShieldCheck size={15} /> Os registros não guardam a sequência digitada, o conteúdo do QR Code nem senhas.
      </p>
    </Cartao>
  )
}

/* ----------------------------------------------------------- diálogos */
type Modo = 'revogar' | 'bloquear' | 'permitir'
/** quais métodos cada ação pode atingir */
const podeEm = (modo: Modo, st: EstadoMetodo) => (modo === 'revogar' ? st === 'habilitado' || st === 'bloqueado' : modo === 'bloquear' ? st === 'habilitado' : st === 'bloqueado')
const motivoIndisponivel = (modo: Modo, st: EstadoMetodo) =>
  st === 'nao' ? 'Não emitido' : st === 'revogado' ? 'Já revogado' : modo === 'bloquear' && st === 'bloqueado' ? 'Já bloqueado' : modo === 'permitir' ? 'Não está bloqueado' : ''

function EscolhaMetodos({ e, modo, sel, setSel }: { e: Estudante; modo: Modo; sel: MetodoId[]; setSel: (s: MetodoId[]) => void }) {
  const aptos = METODOS.filter((m) => podeEm(modo, e.metodos[m.id])).map((m) => m.id)
  const todos = aptos.length > 0 && aptos.every((m) => sel.includes(m))
  const verbo = { revogar: 'Será revogado', bloquear: 'Será bloqueado', permitir: 'Será liberado' }[modo]
  const resultado: Estudante = { ...e, metodos: { ...e.metodos, ...Object.fromEntries(sel.map((m) => [m, modo === 'revogar' ? 'revogado' : modo === 'bloquear' ? 'bloqueado' : 'habilitado'])) } }
  const entra = entraCom(resultado)
  const nome = e.nome.split(' ')[0]
  return (
    <div className="la-escolha">
      <div className="la-escolha-topo">
        <b>{modo === 'permitir' ? 'Quais acessos liberar?' : modo === 'revogar' ? 'Quais acessos revogar?' : 'Quais acessos bloquear?'}</b>
        <label>
          <Chk on={todos} disabled={!aptos.length} onClick={() => setSel(todos ? [] : aptos)} />
          {modo === 'permitir' ? 'Todos os bloqueados' : 'Todos os métodos'}
        </label>
      </div>
      <ul>
        {METODOS.map(({ id, nome: n }) => {
          const I = ICON[id]
          const st = e.metodos[id]
          const apto = aptos.includes(id)
          const on = sel.includes(id)
          return (
            <li key={id} className={`${apto ? '' : 'is-off'} ${on ? 'is-on' : ''}`} onClick={() => apto && setSel(on ? sel.filter((x) => x !== id) : [...sel, id])}>
              <Chk on={on} disabled={!apto} onClick={() => {}} />
              <I size={16} />
              <span>
                <b>{n}</b>
                <small>Hoje: {BMET[st][1].toLowerCase()}</small>
              </span>
              {on ? (
                <Badge v={modo === 'permitir' ? 'sucesso' : 'destrutivo'}>{verbo}</Badge>
              ) : apto ? (
                <Badge v={st === 'habilitado' ? 'sucesso' : 'destrutivo'}>{st === 'habilitado' ? 'Continua funcionando' : 'Continua bloqueado'}</Badge>
              ) : (
                <Badge v="outline">{motivoIndisponivel(modo, st)}</Badge>
              )}
            </li>
          )
        })}
      </ul>
      <p className={`la-escolha-resumo ${entra.length ? '' : 'is-nada'}`}>
        {entra.length ? <CircleCheck size={16} /> : <Lock size={16} />}
        {sel.length === 0 ? 'Escolha pelo menos um método.' : entra.length ? `Depois disso, ${nome} entra só com ${listaMetodos(entra).toLowerCase().replace('qr code', 'QR Code')}.` : `Depois disso, ${nome} não entra por nenhum método.`}
      </p>
    </div>
  )
}

type Acoes = {
  emitir: (id: string) => void
  reemitir: (id: string, m: string) => void
  revogar: (id: string, ids: MetodoId[], m: string) => void
  bloquear: (id: string, ids: MetodoId[], m: string) => void
  permitir: (id: string, ids: MetodoId[]) => void
  imprimir: (id: string) => void
}
function Dialogo({ dlg, est, fechar, acoes, lote, sel, imprimirLote }: { dlg: Dlg; est: (id: string) => Estudante; fechar: () => void; acoes: Acoes; lote: (ids: string[]) => void; sel: string[]; imprimirLote: (ids: string[]) => void }) {
  const e = 'est' in dlg ? est(dlg.est) : null
  const inicialSel = (): MetodoId[] => {
    if (!e) return []
    const aptos = METODOS.filter((m) => podeEm(dlg.tipo as Modo, e.metodos[m.id])).map((m) => m.id)
    return dlg.tipo === 'revogar' ? aptos.filter((m) => m !== 'email') : aptos
  }
  const [motivo, setMotivo] = useState('')
  const [obs, setObs] = useState('')
  const [metodos, setMetodos] = useState<MetodoId[]>(inicialSel)
  useEffect(() => {
    const k = (ev: KeyboardEvent) => ev.key === 'Escape' && fechar()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [fechar])
  const nome = e?.nome.split(' ').slice(0, 2).join(' ') ?? ''
  const conf = (fn: () => void) => () => {
    fn()
    if (dlg.tipo !== 'lote') fechar()
  }
  const qtd = (n: number, total: number) => (n === total && total > 1 ? 'todos os acessos' : n === 1 ? '1 acesso' : `${n} acessos`)
  let cor: 'azul' | 'vermelho' | 'verde' | 'amarelo' = 'azul'
  let I: LucideIcon = IdCard
  let titulo = ''
  let desc = ''
  let corpo: ReactNode = null
  let botoes: ReactNode = null
  if (dlg.tipo === 'emitir' && e) {
    titulo = `Emitir credencial para ${e.nome.split(' ')[0]}?`
    desc = 'O sistema gera um QR Code e uma sequência de 6 ícones. Nenhuma conta nova é criada.'
    corpo = (
      <ul className="la-checks">
        {['QR Code e código de ícones passam a ser habilitados.', 'Cadastro, turma e histórico continuam iguais.', `E-mail e senha continuam ${e.metodos.email === 'habilitado' ? 'funcionando' : 'como estão'}.`].map((t) => (
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
    desc = `A carteirinha atual (versão ${e.versao}) para de funcionar assim que você confirmar. A nova será a versão ${e.versao + 1}, com QR Code e ícones novos.`
    corpo = (
      <>
        <Select rotulo="Motivo" valor={motivo || 'Selecione o motivo'} opcoes={['Selecione o motivo', ...MOTIVOS_REEMISSAO]} onChange={(v) => setMotivo(v === 'Selecione o motivo' ? '' : v)} />
        <label className="la-textarea">
          <span>Observação (opcional)</span>
          <textarea placeholder="Ex.: cartão esquecido no ônibus escolar" value={obs} onChange={(v) => setObs(v.target.value)} />
        </label>
        <p className="la-nota">Recolha a carteirinha antiga, se ela aparecer, e entregue a nova só para {e.nome.split(' ')[0]}. Métodos bloqueados continuam bloqueados.</p>
      </>
    )
    botoes = (
      <Botao icon={RefreshCw} disabled={!motivo} onClick={conf(() => acoes.reemitir(e.id, motivo))}>
        Reemitir credencial
      </Botao>
    )
  }
  if ((dlg.tipo === 'revogar' || dlg.tipo === 'bloquear' || dlg.tipo === 'permitir') && e) {
    const modo = dlg.tipo
    const total = METODOS.filter((m) => podeEm(modo, e.metodos[m.id])).length
    if (modo === 'revogar') {
      I = Ban
      cor = 'vermelho'
      titulo = `Revogar acessos de ${nome}?`
      desc = 'Revogar invalida de vez o método. QR Code e ícones só voltam com uma nova carteirinha; e-mail e senha, com uma nova senha.'
    } else if (modo === 'bloquear') {
      I = Lock
      cor = 'vermelho'
      titulo = `Bloquear acessos de ${nome}?`
      desc = 'Bloquear pausa a entrada pelos métodos escolhidos, sem apagar nada. As sessões abertas por eles são encerradas na hora.'
    } else {
      I = LockOpen
      cor = 'verde'
      titulo = `Permitir o acesso de ${nome} de novo?`
      desc = 'Escolha quais métodos bloqueados voltam a funcionar.'
    }
    corpo = (
      <>
        <EscolhaMetodos e={e} modo={modo} sel={metodos} setSel={setMetodos} />
        {modo !== 'permitir' && (
          <Select rotulo="Motivo" valor={motivo || 'Selecione o motivo'} opcoes={['Selecione o motivo', ...(modo === 'revogar' ? MOTIVOS_REVOGACAO : MOTIVOS_BLOQUEIO)]} onChange={(v) => setMotivo(v === 'Selecione o motivo' ? '' : v)} />
        )}
        {modo === 'bloquear' && (
          <label className="la-textarea">
            <span>Observação (opcional)</span>
            <textarea placeholder="Fica registrada no histórico" value={obs} onChange={(v) => setObs(v.target.value)} />
          </label>
        )}
        <p className="la-nota">
          {modo === 'revogar'
            ? 'Quer só pausar por um tempo? Use “Permitir ou bloquear acesso”: o bloqueio pode ser desfeito sem nova carteirinha.'
            : modo === 'bloquear'
              ? 'Cadastro, credencial e histórico continuam guardados. Você pode permitir o acesso de novo quando quiser.'
              : 'A mudança fica registrada no histórico com seu nome, a data e o estado anterior (Bloqueado → Permitido).'}
        </p>
      </>
    )
    const n = metodos.length
    botoes =
      modo === 'permitir' ? (
        <Botao icon={LockOpen} disabled={!n} onClick={conf(() => acoes.permitir(e.id, metodos))}>
          Permitir {qtd(n, total)}
        </Botao>
      ) : (
        <Botao v="destrutivo" icon={modo === 'bloquear' ? Lock : Ban} disabled={!n || !motivo} onClick={conf(() => (modo === 'revogar' ? acoes.revogar(e.id, metodos, motivo) : acoes.bloquear(e.id, metodos, motivo)))}>
          {modo === 'revogar' ? 'Revogar' : 'Bloquear'} {qtd(n, total)}
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
    const alvos = sel.filter((i) => credencialDe(est(i)) === 'nao')
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
        <p className="la-nota">Quem já tem credencial fica de fora. Para trocar uma credencial, use “Reemitir” no cadastro do estudante.</p>
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
