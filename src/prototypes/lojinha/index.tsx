import { AnimatePresence, motion } from 'framer-motion'
import { Bell, ChevronDown, CircleHelp, Clock, Copy, CreditCard, FileText, LogOut, Menu, Store, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { PrototypeProps } from '../../platform/journeys'
import { HOJE, ITEM, dataCurta, fmt } from './data'
import { LojaProvider, abaDe, useLoja, type Aba, type Inicio, type View } from './store'
import { Contador, Pop, Toasts } from './components/ui'
import Loja from './screens/Loja'
import Categoria from './screens/Categoria'
import ItemDetalhe from './screens/Item'
import Cartao from './screens/Cartao'
import Historico from './screens/Historico'
import Resgates from './screens/Resgates'
import Regras from './screens/Regras'
import './loja.css'

const ATALHOS: Inicio[] = ['loja', 'avatares', 'item', 'cartao', 'historico', 'resgates', 'regras']

export default function Lojinha({ startScreen }: PrototypeProps) {
  const start = (ATALHOS.includes(startScreen as Inicio) ? startScreen : 'loja') as Inicio
  return (
    <LojaProvider start={start}>
      <Shell />
    </LojaProvider>
  )
}

const chave = (v: View) => (v.id === 'categoria' ? `cat-${v.cat}` : v.id === 'item' ? `item-${v.item}` : v.id)

function Shell() {
  const { s, toast } = useLoja()
  const [gaveta, setGaveta] = useState(false)
  const v = s.view

  useEffect(() => {
    document.title = 'Lojinha · Exploradores · Protótipo Jovens Gênios'
  }, [])

  return (
    <div className="lj">
      <AnimatePresence>{gaveta && <motion.div className="lj-veu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setGaveta(false)} />}</AnimatePresence>
      <Lateral aberta={gaveta} onAlternar={() => setGaveta((g) => !g)} onFechar={() => setGaveta(false)} foraDoEscopo={(n) => toast(`“${n}” não faz parte deste protótipo.`, 'info')} />
      <main className="lj-main">
        <Topo onMenu={() => setGaveta(true)} />
        <div className="lj-conteudo">
          <header className="lj-titulo">
            <motion.img src="./loja/lojinha.webp" alt="" initial={{ scale: 0.6, rotate: -10, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 14 }} whileHover={{ rotate: [0, -8, 8, 0], transition: { duration: 0.5 } }} />
            <div>
              <h1>Lojinha</h1>
              <p>Troque seus pontos por itens exclusivos, personalize seu avatar e conquiste recompensas incríveis do Clube Jovens Gênios!</p>
            </div>
          </header>
          <Abas atual={abaDe(v)} />
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={chave(v)}
              className="lj-pagina"
              initial={{ opacity: 0, y: 14 * s.dir }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 * s.dir, transition: { duration: 0.13 } }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            >
              {v.id === 'loja' && <Loja />}
              {v.id === 'categoria' && <Categoria cat={v.cat} />}
              {v.id === 'item' && <ItemDetalhe id={v.item} de={v.de} />}
              {v.id === 'cartao' && <Cartao />}
              {v.id === 'historico' && <Historico />}
              {v.id === 'resgates' && <Resgates abrir={v.abrir} />}
              {v.id === 'regras' && <Regras topico={v.topico} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <Toasts />
    </div>
  )
}

/* ---------------- abas ---------------- */
const ABAS: { id: Aba; nome: string; I: typeof Store; v: View }[] = [
  { id: 'loja', nome: 'Loja', I: Store, v: { id: 'loja' } },
  { id: 'cartao', nome: 'Meu Cartão', I: CreditCard, v: { id: 'cartao' } },
  { id: 'historico', nome: 'Histórico', I: Clock, v: { id: 'historico' } },
  { id: 'resgates', nome: 'Meus Resgates', I: Copy, v: { id: 'resgates' } },
  { id: 'regras', nome: 'Regras', I: FileText, v: { id: 'regras' } },
]
function Abas({ atual }: { atual: Aba }) {
  const { ir } = useLoja()
  const idx = ABAS.findIndex((a) => a.id === atual)
  return (
    <nav className="lj-abas" role="tablist">
      {ABAS.map((a, i) => (
        <button key={a.id} role="tab" aria-selected={a.id === atual} className={`lj-aba ${a.id === atual ? 'is-on' : ''}`} onClick={() => ir(a.v, i >= idx ? 1 : -1)}>
          {a.id === atual && <motion.span layoutId="lj-aba-pill" className="lj-aba__pill" transition={{ type: 'spring', stiffness: 480, damping: 38 }} />}
          <a.I size={17} strokeWidth={1.9} />
          <span>{a.nome}</span>
        </button>
      ))}
    </nav>
  )
}

/* ---------------- topo ---------------- */
function Topo({ onMenu }: { onMenu: () => void }) {
  const { s, ir, toast, lerNotificacoes, equipar } = useLoja()
  const [sino, setSino] = useState(false)
  const [perfil, setPerfil] = useState(false)
  const sinoRef = useRef<HTMLButtonElement>(null)
  const perfilRef = useRef<HTMLButtonElement>(null)
  const naoLidas = s.notificacoes.filter((n) => !n.lida).length
  const ultimo = s.movs[0]
  // mostra o “+/− pontos” só para movimentações novas (não para as que já existiam)
  const inicialRef = useRef(ultimo?.id)
  const [delta, setDelta] = useState<{ k: string; v: number } | null>(null)
  useEffect(() => {
    if (ultimo && ultimo.id !== inicialRef.current) setDelta({ k: ultimo.id, v: ultimo.valor })
  }, [ultimo?.id]) // eslint-disable-line react-hooks/exhaustive-deps
  const avatares = s.resgates.filter((r) => ITEM[r.item]?.cat === 'avatares' && r.status === 'concluido').map((r) => r.item)
  const meus = [...new Set(['traje-explorador', ...avatares])]

  return (
    <header className="lj-topo">
      <button className="lj-iconbtn lj-topo__menu" onClick={onMenu} aria-label="Abrir menu">
        <Menu size={19} />
      </button>
      <span className="lj-topo__esp" />
      <button className="lj-pilula lj-pilula--pts" onClick={() => ir({ id: 'historico' })} title="Ver histórico de pontos" data-alvo-pontos>
        <motion.img key={ultimo?.id} src="./loja/gema.webp" alt="" initial={ultimo?.id !== inicialRef.current ? { rotate: -30, scale: 1.4 } : false} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 10 }} />
        <strong>
          <Contador v={s.pontos} />
        </strong>
        <small>pts</small>
        <AnimatePresence>
          {delta && (
            <motion.em key={delta.k} className={delta.v < 0 ? 'is-neg' : ''} initial={{ opacity: 0, y: 0 }} animate={{ opacity: [0, 1, 1, 0], y: [0, 22, 30, 40] }} transition={{ duration: 2.2, times: [0, 0.1, 0.75, 1] }} onAnimationComplete={() => setDelta(null)}>
              {delta.v > 0 ? '+' : '−'}
              {fmt(Math.abs(delta.v))}
            </motion.em>
          )}
        </AnimatePresence>
      </button>
      <button className="lj-pilula lj-pilula--chama" onClick={() => toast('Incrível! 365 dias seguidos de estudo.', 'info')} title="Dias seguidos de estudo">
        <motion.img src="./loja/chama.webp" alt="" animate={{ scale: [1, 1.1, 1], rotate: [0, -4, 0] }} transition={{ duration: 2.2, repeat: Infinity }} />
        <strong>365</strong>
      </button>
      <i className="lj-topo__div" />
      <button className="lj-quadrado" onClick={() => toast('O assistente não faz parte deste protótipo.', 'info')} aria-label="Assistente">
        <img src="./loja/robo.webp" alt="" />
      </button>
      <button
        ref={sinoRef}
        className={`lj-quadrado ${sino ? 'is-on' : ''}`}
        onClick={() => {
          setSino((a) => !a)
          if (!sino) window.setTimeout(lerNotificacoes, 1500)
        }}
        aria-label={`Notificações${naoLidas ? ` (${naoLidas} novas)` : ''}`}
      >
        <motion.span animate={naoLidas ? { rotate: [0, -16, 14, -8, 0] } : {}} transition={{ duration: 0.8, repeat: naoLidas ? Infinity : 0, repeatDelay: 3 }} style={{ display: 'grid' }}>
          <Bell size={18} strokeWidth={1.9} />
        </motion.span>
        {naoLidas > 0 && <b className="lj-badge">{naoLidas}</b>}
      </button>
      <Pop aberto={sino} ancora={sinoRef} alinhar="dir" onFechar={() => setSino(false)} className="lj-pop--notif">
        <h4>Notificações</h4>
        {s.notificacoes.map((n) => (
          <button
            key={n.id}
            className={n.lida ? '' : 'is-nova'}
            onClick={() => {
              setSino(false)
              if (n.ir) ir(n.ir)
            }}
          >
            <i />
            <span>
              {n.texto}
              <small>{dataCurta(n.data > HOJE ? HOJE : n.data)}</small>
            </span>
          </button>
        ))}
      </Pop>
      <button ref={perfilRef} className="lj-usuario" onClick={() => setPerfil((a) => !a)} aria-expanded={perfil}>
        <span>Franciscleudo</span>
        <AnimatePresence mode="wait">
          <motion.span key={s.avatar} className="lj-usuario__foto" initial={{ scale: 0.5, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
            {s.avatar === 'traje-explorador' ? <img src="./loja/avatar-usuario.webp" alt="" /> : <img src={ITEM[s.avatar].img} alt="" style={{ filter: ITEM[s.avatar].filtro, background: ITEM[s.avatar].fundo }} className="is-traje" />}
          </motion.span>
        </AnimatePresence>
        <ChevronDown size={18} className={perfil ? 'is-virado' : ''} />
      </button>
      <Pop aberto={perfil} ancora={perfilRef} alinhar="dir" onFechar={() => setPerfil(false)} className="lj-pop--perfil">
        <h4>Seu avatar</h4>
        <div className="lj-pop__avatares">
          {meus.map((id) => (
            <button
              key={id}
              className={s.avatar === id ? 'is-on' : ''}
              title={ITEM[id].nome}
              onClick={() => {
                equipar(id)
                toast(`Avatar alterado para ${ITEM[id].nome}.`)
              }}
            >
              <img src={ITEM[id].img} alt={ITEM[id].nome} style={{ filter: ITEM[id].filtro, background: ITEM[id].fundo }} />
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            setPerfil(false)
            ir({ id: 'cartao' })
          }}
        >
          <CreditCard size={17} /> Meu cartão fidelidade
        </button>
        <button onClick={() => (setPerfil(false), toast('Sair não faz parte deste protótipo.', 'info'))}>
          <LogOut size={17} /> Sair
        </button>
      </Pop>
    </header>
  )
}

/* ---------------- menu lateral ---------------- */
const ITENS: ({ id: string; nome: string; img: string } | 'sep')[] = [
  { id: 'inicio', nome: 'Início', img: './loja/m-casa.webp' },
  'sep',
  { id: 'estudar', nome: 'Estudar', img: './loja/m-capelo.webp' },
  { id: 'trilhas', nome: 'Trilhas', img: './loja/m-livros.webp' },
  { id: 'conquistas', nome: 'Conquistas', img: './loja/m-trofeu.webp' },
  'sep',
  { id: 'missoes', nome: 'Missões', img: './loja/m-foguete.webp' },
  { id: 'batalhas', nome: 'Batalhas', img: './loja/m-espadas.webp' },
  { id: 'lojinha', nome: 'Lojinha', img: './loja/m-livro.webp' },
  { id: 'explorar', nome: 'Explorar', img: './loja/m-planeta.webp' },
]
function Lateral({ aberta, onAlternar, onFechar, foraDoEscopo }: { aberta: boolean; onAlternar: () => void; onFechar: () => void; foraDoEscopo: (n: string) => void }) {
  const { ir } = useLoja()
  return (
    <aside className={`lj-lateral ${aberta ? 'is-aberta' : ''}`}>
      <button className="lj-lateral__menu" onClick={onAlternar} aria-label={aberta ? 'Fechar menu' : 'Abrir menu'}>
        {aberta ? <X size={19} /> : <Menu size={19} />}
      </button>
      <nav className="lj-lateral__nav">
        {ITENS.map((i, k) =>
          i === 'sep' ? (
            <hr key={k} />
          ) : (
            <motion.button
              key={i.id}
              className={`lj-lateral__item ${i.id === 'lojinha' ? 'is-on' : ''}`}
              data-nome={i.nome}
              onClick={() => {
                onFechar()
                if (i.id === 'lojinha') ir({ id: 'loja' }, -1)
                else foraDoEscopo(i.nome)
              }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
            >
              <img src={i.img} alt="" />
              <span>{i.nome}</span>
            </motion.button>
          ),
        )}
      </nav>
      <div className="lj-lateral__rodape">
        <button className="lj-lateral__q" data-nome="Ajuda" onClick={() => (onFechar(), ir({ id: 'regras' }))} aria-label="Ajuda">
          <CircleHelp size={18} />
          <span>Ajuda</span>
        </button>
        <button className="lj-lateral__q" data-nome="Sair" onClick={() => foraDoEscopo('Sair')} aria-label="Sair">
          <LogOut size={17} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  )
}
