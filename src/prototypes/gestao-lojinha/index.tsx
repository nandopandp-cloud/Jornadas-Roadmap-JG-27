import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  BarChart3,
  Box,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Coins,
  Ellipsis,
  House,
  Image as ImageIcon,
  Landmark,
  Layers,
  Menu as MenuIc,
  Settings,
  ShoppingBag,
  Star,
  Store,
  Tag,
  Trophy,
  UserRound,
  UsersRound,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import type { PrototypeProps } from '../../platform/journeys'
import { PERIODOS, PLATAFORMAS, PLAT } from './data'
import { AdmProvider, abaDe, useAdm, type Aba, type Inicio, type View } from './store'
import { IconePlataforma, Select, Toasts } from './components/ui'
import VisaoGeral from './screens/VisaoGeral'
import Itens from './screens/Itens'
import ItemForm from './screens/ItemForm'
import Categorias from './screens/Categorias'
import Resgates from './screens/Resgates'
import ResgateDetalhe from './screens/ResgateDetalhe'
import Extrato from './screens/Extrato'
import Estudantes from './screens/Estudantes'
import EstudantePerfil from './screens/EstudantePerfil'
import Configuracoes from './screens/Configuracoes'
import './admin.css'

const ATALHOS: Inicio[] = ['visao', 'itens', 'cadastrar', 'categorias', 'resgates', 'resgate', 'extrato', 'estudantes', 'estudante', 'config']

export default function GestaoLojinha({ startScreen }: PrototypeProps) {
  const start = (ATALHOS.includes(startScreen as Inicio) ? startScreen : 'visao') as Inicio
  return (
    <AdmProvider start={start}>
      <Shell />
    </AdmProvider>
  )
}

const chave = (v: View) => (v.id === 'resgate' ? `resgate-${v.codigo}` : v.id === 'estudante' ? `pessoa-${v.pessoa}` : v.id === 'item-form' ? `form-${v.item ?? 'novo'}` : v.id)

function Shell() {
  const { s, toast } = useAdm()
  const [gaveta, setGaveta] = useState(false)
  useEffect(() => {
    document.title = 'Gestão da Lojinha · Admin · Protótipo Jovens Gênios'
  }, [])
  return (
    <div className={`ga ${s.lateralFechada ? 'is-recolhida' : ''}`}>
      <AnimatePresence>{gaveta && <motion.div className="ga-veu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setGaveta(false)} />}</AnimatePresence>
      <Lateral aberta={gaveta} onFechar={() => setGaveta(false)} foraDoEscopo={(n) => toast(`“${n}” não faz parte deste protótipo.`, 'info')} />
      <main className="ga-main">
        <Topo onMenu={() => setGaveta(true)} />
        <div className="ga-conteudo">
          <Cabecalho />
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${s.plataforma}-${chave(s.view)}`}
              className="ga-pagina"
              initial={{ opacity: 0, y: 10 * s.dir }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 * s.dir, transition: { duration: 0.12 } }}
              transition={{ type: 'spring', stiffness: 340, damping: 32 }}
            >
              <Tela />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <Toasts />
    </div>
  )
}

function Tela() {
  const { s } = useAdm()
  const v = s.view
  switch (v.id) {
    case 'visao':
      return <VisaoGeral />
    case 'itens':
      return <Itens key={`${v.cat ?? ''}-${v.ordem ?? ''}`} cat={v.cat} ordem={v.ordem} />
    case 'item-form':
      return <ItemForm id={v.item} />
    case 'categorias':
      return <Categorias />
    case 'resgates':
      return <Resgates status={v.status} />
    case 'resgate':
      return <ResgateDetalhe codigo={v.codigo} />
    case 'extrato':
      return <Extrato pessoa={v.pessoa ?? 0} />
    case 'estudantes':
      return <Estudantes />
    case 'estudante':
      return <EstudantePerfil pessoa={v.pessoa} aba={v.aba} />
    case 'config':
      return <Configuracoes secao={v.secao} />
  }
}

/* ---------------- abas da Lojinha ---------------- */
export const ABAS: { id: Aba; nome: string; I: LucideIcon; v: View }[] = [
  { id: 'visao', nome: 'Visão geral', I: BarChart3, v: { id: 'visao' } },
  { id: 'itens', nome: 'Itens', I: Box, v: { id: 'itens' } },
  { id: 'categorias', nome: 'Categorias', I: Tag, v: { id: 'categorias' } },
  { id: 'resgates', nome: 'Resgates', I: ShoppingBag, v: { id: 'resgates' } },
  { id: 'extrato', nome: 'Pontos e extrato', I: Coins, v: { id: 'extrato' } },
  { id: 'estudantes', nome: 'Estudantes', I: UsersRound, v: { id: 'estudantes' } },
  { id: 'config', nome: 'Configurações', I: Settings, v: { id: 'config' } },
]
const nomeAba = (id: Aba, publico: string) => (id === 'estudantes' ? publico : ABAS.find((a) => a.id === id)!.nome)

/* ---------------- cabeçalho da página ---------------- */
function Cabecalho() {
  const { s, ir, setPlataforma, setPeriodo, toast } = useAdm()
  const v = s.view
  const pl = PLAT[s.plataforma]
  const detalhe =
    v.id === 'item-form'
      ? { t: v.item ? 'Editar item' : 'Cadastrar item', sub: v.item ? 'Atualize as informações do item na Lojinha da plataforma selecionada.' : 'Crie um novo item para a Lojinha da plataforma selecionada.', volta: { id: 'itens' } as View }
      : v.id === 'resgate'
        ? { t: 'Detalhes do resgate', sub: 'Acompanhe as informações do resgate e gerencie o andamento da solicitação.', volta: { id: 'resgates' } as View }
        : v.id === 'estudante'
          ? { t: `Perfil do ${pl.singular.toLowerCase()}`, sub: 'Acompanhe o saldo, os resgates e o histórico de movimentações.', volta: { id: 'estudantes' } as View }
          : v.id === 'config'
            ? { t: 'Configurações da Lojinha', sub: 'Gerencie as regras, aparências e configurações gerais da Lojinha.', volta: { id: 'visao' } as View }
            : null
  const atual = abaDe(v)
  const idx = ABAS.findIndex((a) => a.id === atual)
  return (
    <>
      <header className={`ga-cab ${detalhe ? 'is-detalhe' : ''}`}>
        {detalhe ? (
          <button className="ga-voltar" onClick={() => ir(detalhe.volta, -1)} aria-label="Voltar">
            <ArrowLeft size={22} />
          </button>
        ) : (
          <motion.img className="ga-cab__ic" src="./loja/lojinha.webp" alt="" initial={{ scale: 0.7, rotate: -8 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 14 }} />
        )}
        <div className="ga-cab__txt">
          <h1>{detalhe ? detalhe.t : 'Lojinha'}</h1>
          <p>{detalhe ? detalhe.sub : 'Gestão de itens, resgates, pontos e recompensas das plataformas.'}</p>
        </div>
        <div className="ga-cab__filtros">
          <span className="ga-cab__rot">Plataforma</span>
          <Select
            className="ga-select--plat"
            rotulo="Plataforma"
            alinhar="esq"
            valor={s.plataforma}
            onChange={(p) => {
              if (p === s.plataforma) return
              setPlataforma(p)
              toast(`Exibindo a Lojinha de ${PLAT[p].nome}.`, 'info')
            }}
            opcoes={PLATAFORMAS.map((p) => ({ valor: p.id, texto: p.nome, icone: <IconePlataforma p={p.id} tam={24} /> }))}
          />
          <i className="ga-cab__div" />
          <Select className="ga-select--periodo" rotulo="Período" icone={<CalendarDays size={20} />} valor={s.periodo} onChange={setPeriodo} opcoes={PERIODOS} alinhar="dir" />
        </div>
      </header>
      {!detalhe && (
        <nav className="ga-abas" role="tablist">
          {ABAS.map((a, i) => (
            <button key={a.id} role="tab" aria-selected={a.id === atual} className={`ga-aba ${a.id === atual ? 'is-on' : ''}`} onClick={() => ir(a.v, i >= idx ? 1 : -1)}>
              {a.id === atual && <motion.span layoutId="ga-aba-pill" className="ga-aba__pill" transition={{ type: 'spring', stiffness: 480, damping: 38 }} />}
              <a.I size={21} strokeWidth={1.8} />
              <span>{nomeAba(a.id, pl.publico)}</span>
            </button>
          ))}
        </nav>
      )}
    </>
  )
}

/* ---------------- topo com migalhas ---------------- */
function Topo({ onMenu }: { onMenu: () => void }) {
  const { s, ir, toggleLateral } = useAdm()
  const v = s.view
  const pl = PLAT[s.plataforma]
  const atual = abaDe(v)
  const migalhas: { t: string; v?: View }[] = [{ t: 'Início' }, { t: 'Lojinha', v: { id: 'visao' } }]
  if (v.id === 'item-form') migalhas.push({ t: 'Itens', v: { id: 'itens' } }, { t: v.item ? 'Editar item' : 'Cadastrar item' })
  else if (v.id === 'resgate') migalhas.push({ t: 'Resgates', v: { id: 'resgates' } }, { t: 'Detalhes do resgate' })
  else if (v.id === 'estudante') migalhas.push({ t: pl.publico, v: { id: 'estudantes' } }, { t: `Perfil do ${pl.singular.toLowerCase()}` })
  else migalhas.push({ t: nomeAba(atual, pl.publico) })
  return (
    <div className="ga-topo">
      <button className="ga-topo__rec" onClick={toggleLateral} aria-label={s.lateralFechada ? 'Expandir menu' : 'Recolher menu'}>
        {s.lateralFechada ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
      </button>
      <button className="ga-topo__menu" onClick={onMenu} aria-label="Abrir menu">
        <MenuIc size={22} />
      </button>
      <nav className="ga-migalhas" aria-label="Você está em">
        {migalhas.map((m, i) => (
          <span key={i}>
            {i > 0 && <ChevronRight size={15} className="ga-migalhas__sep" />}
            {m.v && i < migalhas.length - 1 ? <button onClick={() => ir(m.v!, -1)}>{m.t}</button> : <span className={i === migalhas.length - 1 ? 'is-atual' : ''}>{m.t}</span>}
          </span>
        ))}
      </nav>
    </div>
  )
}

/* ---------------- menu lateral ---------------- */
function Lateral({ aberta, onFechar, foraDoEscopo }: { aberta: boolean; onFechar: () => void; foraDoEscopo: (n: string) => void }) {
  const { s, ir } = useAdm()
  const [lojaAberta, setLojaAberta] = useState(true)
  const atual = abaDe(s.view)
  const pl = PLAT[s.plataforma]
  const subs: { id: Aba; nome: string; I: LucideIcon }[] = [
    { id: 'visao', nome: 'Visão geral', I: BarChart3 },
    { id: 'itens', nome: 'Itens', I: Layers },
    { id: 'categorias', nome: 'Categorias', I: Tag },
    { id: 'resgates', nome: 'Resgates', I: ShoppingBag },
    { id: 'extrato', nome: 'Pontos e extrato', I: Coins },
    { id: 'estudantes', nome: pl.publico, I: UserRound },
    { id: 'config', nome: 'Configurações', I: Settings },
  ]
  const vai = (v: View) => {
    onFechar()
    ir(v)
  }
  const grupo = (nome: string, I: LucideIcon) => (
    <button className="ga-lat__item" onClick={() => foraDoEscopo(nome)} title={nome}>
      <I size={21} strokeWidth={1.8} />
      <span>{nome}</span>
      <ChevronDown size={18} className="ga-lat__seta" />
    </button>
  )
  return (
    <aside className={`ga-lat ${aberta ? 'is-aberta' : ''}`}>
      <div className="ga-lat__marca">
        <img src="./admin/logo.webp" alt="" />
        <strong>Jovens Gênios</strong>
      </div>
      <nav className="ga-lat__nav">
        <button className="ga-lat__item ga-lat__item--inicio" onClick={() => foraDoEscopo('Início')} title="Início">
          <House size={21} strokeWidth={1.8} />
          <span>Início</span>
        </button>
        <p className="ga-lat__sec">Funcionalidades</p>
        {grupo('Instituições', Landmark)}
        {grupo('Liga das Estrelas', Star)}
        {grupo('Olimpíadas', Trophy)}
        <div className={`ga-lat__grupo ${lojaAberta ? 'is-aberto' : ''}`}>
          <button className="ga-lat__item is-on" onClick={() => setLojaAberta((a) => !a)} aria-expanded={lojaAberta} title="Lojinha">
            <Store size={21} strokeWidth={1.8} />
            <span>Lojinha</span>
            <motion.span className="ga-lat__seta" animate={{ rotate: lojaAberta ? 180 : 0 }}>
              <ChevronDown size={18} />
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {lojaAberta && (
              <motion.div className="ga-lat__subs" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}>
                {subs.map((x) => (
                  <button key={x.id} className={`ga-lat__sub ${atual === x.id ? 'is-on' : ''}`} onClick={() => vai(ABAS.find((a) => a.id === x.id)!.v)} title={x.nome}>
                    {atual === x.id && <motion.span layoutId="ga-lat-pill" className="ga-lat__pill" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
                    <x.I size={18} strokeWidth={1.8} />
                    <span>{x.nome}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button className="ga-lat__item" onClick={() => foraDoEscopo('Itens')} title="Itens">
          <Layers size={21} strokeWidth={1.8} />
          <span>Itens</span>
        </button>
        <button className="ga-lat__item" onClick={() => foraDoEscopo('Banners')} title="Banners">
          <ImageIcon size={21} strokeWidth={1.8} />
          <span>Banners</span>
        </button>
        <button className="ga-lat__item" onClick={() => foraDoEscopo('Usuários')} title="Usuários">
          <UserRound size={21} strokeWidth={1.8} />
          <span>Usuários</span>
        </button>
      </nav>
      <div className="ga-lat__usuario">
        <span className="ga-lat__foto">F</span>
        <span className="ga-lat__quem">
          <strong>FernanDesigner</strong>
          <small>Usuário</small>
        </span>
        <button onClick={() => foraDoEscopo('Conta')} aria-label="Opções da conta">
          <Ellipsis size={20} />
        </button>
      </div>
    </aside>
  )
}
