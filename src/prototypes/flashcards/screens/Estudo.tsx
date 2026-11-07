import { AnimatePresence, motion } from 'framer-motion'
import {
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleX,
  ChartColumn,
  EllipsisVertical,
  Eye,
  Pointer,
  Flag,
  Flag as FlagIc,
  Layers,
  Lightbulb,
  ListChecks,
  CirclePlay,
  RefreshCw,
  RotateCcw,
  Star,
  Trophy,
  X,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Anel, Legenda, PorTopico } from '../components/resultado'
import { Barra, Brilhos, Btn, Estrela, IconeFlashcards, Menu, Migalhas, Quadrado, Rico, Select } from '../components/ui'
import { CARD, DISC, TOPICO } from '../data'
import { contagem, nomeGrupo, pct, respondidos, useFx, type AbaGrupo, type Grupo, type Status, type View } from '../store'

type Saida = Status | 'nav-esq' | 'nav-dir'
const FEEDBACK: Record<Status, { t: string; c: string }> = {
  sei: { t: 'Boa! Mais um acerto.', c: 'sei' },
  nao: { t: 'Tudo bem! Ela volta na revisão.', c: 'nao' },
  revisar: { t: 'Marcado para revisar depois.', c: 'revisar' },
}

/** Estudo de um grupo de flashcards */
export default function Estudo({ v }: { v: Extract<View, { id: 'grupo' }> }) {
  const { s, ir, setGrupo, favoritar, concluirSessao, reiniciar, toast } = useFx()
  const g = s.grupos.find((x) => x.id === v.grupo)
  if (!g) return <GrupoInexistente />
  return <EstudoGrupo key={g.id} g={g} v={v} api={{ ir, setGrupo, favoritar, concluirSessao, reiniciar, toast }} favs={s.favoritos} />
}

function GrupoInexistente() {
  const { ir } = useFx()
  return (
    <div className="fx-cartao fx-vazio fx-vazio--grande">
      <Layers size={29} />
      <strong>Este grupo não existe mais</strong>
      <Btn onClick={() => ir({ id: 'home', aba: 'grupos' }, -1)}>Voltar para meus grupos</Btn>
    </div>
  )
}

type Api = Pick<ReturnType<typeof useFx>, 'ir' | 'setGrupo' | 'favoritar' | 'concluirSessao' | 'reiniciar' | 'toast'>

function EstudoGrupo({ g, v, api, favs }: { g: Grupo; v: Extract<View, { id: 'grupo' }>; api: Api; favs: Record<string, number> }) {
  const { ir, setGrupo, favoritar, concluirSessao, reiniciar, toast } = api
  const d = DISC[g.disc]
  const total = g.cards.length
  const feitos = respondidos(g)
  const completo = feitos === total
  const [aba, setAba] = useState<AbaGrupo>(v.aba ?? 'estudar')
  const [filtro, setFiltro] = useState('todos')
  const [idx, setIdx] = useState(() => (v.card ? Math.max(0, g.cards.indexOf(v.card)) : g.atual))
  const [revelado, setRevelado] = useState(!!v.revelar)
  const [fim, setFim] = useState(completo && !v.card)
  const [saida, setSaida] = useState<Saida>('nav-dir')
  const [feedback, setFeedback] = useState<{ k: number; s: Status } | null>(null)
  const listaRef = useRef<HTMLDivElement>(null)

  const ordem = useMemo(() => (filtro === 'todos' ? g.cards : g.cards.filter((c) => CARD[c].topico === filtro)), [g.cards, filtro])
  const cardId = g.cards[idx]
  const card = CARD[cardId]
  const posFiltro = ordem.indexOf(cardId)
  const foco = aba === 'estudar' && revelado && !fim

  // mantém o item atual visível na lista lateral (sem rolar a página)
  useEffect(() => {
    const lista = listaRef.current
    const el = lista?.querySelector<HTMLElement>(`[data-card="${cardId}"]`)
    if (!lista || !el) return
    const alvo = el.offsetTop - lista.clientHeight / 2 + el.clientHeight / 2
    lista.scrollTo({ top: Math.max(0, alvo), behavior: 'smooth' })
  }, [cardId, filtro, foco])

  const irPara = useCallback(
    (novo: number, dir: 'nav-esq' | 'nav-dir') => {
      setSaida(dir)
      setRevelado(false)
      setFim(false)
      setIdx(novo)
      setGrupo(g.id, (x) => ({ ...x, atual: novo }))
    },
    [g.id, setGrupo],
  )
  const navegar = (passo: 1 | -1) => {
    if (fim) return
    const p = posFiltro < 0 ? 0 : posFiltro
    const alvo = ordem[(p + passo + ordem.length) % ordem.length]
    irPara(g.cards.indexOf(alvo), passo > 0 ? 'nav-dir' : 'nav-esq')
  }

  const responder = (st: Status) => {
    if (fim) return
    const novoStatus = { ...g.status, [cardId]: st }
    setFeedback({ k: Date.now(), s: st })
    setSaida(st)
    // próximo card sem resposta (no filtro atual, a partir do atual)
    const p = posFiltro < 0 ? 0 : posFiltro
    const giro = [...ordem.slice(p + 1), ...ordem.slice(0, p)]
    let prox = giro.find((c) => !novoStatus[c])
    let novoFiltro = filtro
    if (!prox && filtro !== 'todos') {
      prox = g.cards.find((c) => !novoStatus[c])
      if (prox) {
        novoFiltro = 'todos'
        toast(`Você concluiu o tópico ${TOPICO[filtro].nome}!`)
      }
    }
    const acabou = !g.cards.some((c) => !novoStatus[c])
    const novoIdx = prox ? g.cards.indexOf(prox) : idx
    setGrupo(g.id, (x) => ({ ...x, status: novoStatus, atual: novoIdx, estudadoEm: Date.now() }))
    if (acabou) {
      window.setTimeout(() => {
        concluirSessao(g.id)
        ir({ id: 'concluida', grupo: g.id })
      }, 450)
      return
    }
    // revisão de cards já respondidos: segue para o próximo da ordem
    const proxNav = prox ?? ordem[(p + 1) % ordem.length]
    setFiltro(novoFiltro)
    setRevelado(false)
    setIdx(g.cards.indexOf(proxNav))
  }

  // atalhos de teclado
  useEffect(() => {
    if (aba !== 'estudar') return
    const tecla = (e: KeyboardEvent) => {
      const alvo = e.target as HTMLElement
      if (alvo.closest('input, textarea, [role="listbox"], .fx-pop, .fx-modal')) return
      if (e.key === ' ' || e.key === 'Enter') {
        if (alvo.tagName === 'BUTTON') return
        e.preventDefault()
        if (!fim) setRevelado((r) => !r)
      } else if (e.key === 'ArrowRight') navegar(1)
      else if (e.key === 'ArrowLeft') navegar(-1)
      else if (e.key === '1') responder('nao')
      else if (e.key === '2') responder('sei')
      else if (e.key === '3') responder('revisar')
    }
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  })

  const migalhas = [{ texto: 'Flashcards', onClick: () => ir({ id: 'home', aba: 'grupos' }, -1) }, { texto: nomeGrupo(g), onClick: foco ? () => setRevelado(false) : undefined }, ...(foco ? [{ texto: TOPICO[card.topico].nome }] : [])]
  const statusAtual = g.status[cardId]
  const cabCard = (
    <div className="fx-flash__cab" onClick={(e) => e.stopPropagation()}>
      <span className="fx-flash__topico">
        <Layers size={14} strokeWidth={2.4} /> {TOPICO[card.topico].nome}
      </span>
      {statusAtual && <StatusPill s={statusAtual} />}
      <span className="fx-flash__acoes">
        <Estrela
          on={!!favs[cardId]}
          tam={22}
          onClick={() => {
            const on = favoritar(cardId)
            toast(on ? 'Card salvo nos favoritos.' : 'Card removido dos favoritos.', on ? 'ok' : 'info')
          }}
        />
        <Menu
          icone={<EllipsisVertical size={18} />}
          rotulo="Opções do card"
          itens={[
            { texto: 'Revisar depois', icone: <RefreshCw size={16} />, fn: () => responder('revisar') },
            { texto: 'Reportar um problema', icone: <FlagIc size={16} />, fn: () => toast('Obrigado! Nossa equipe vai revisar este card.', 'info') },
          ]}
        />
      </span>
    </div>
  )

  return (
    <div className={`fx-estudo ${foco ? 'is-foco' : ''}`}>
      <Migalhas itens={migalhas} onVoltar={() => ir({ id: 'home', aba: 'grupos' }, -1)} />

      <header className="fx-gcab">
        <motion.span layout className="fx-gcab__ic">
          <d.icone size={37} strokeWidth={1.7} />
        </motion.span>
        <motion.div layout className="fx-gcab__txt">
          <motion.h1 layout="position">{nomeGrupo(g)}</motion.h1>
          <AnimatePresence mode="wait" initial={false}>
            {foco ? (
              <motion.div key="foco" className="fx-gcab__foco" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4, transition: { duration: 0.1 } }}>
                <p>
                  {TOPICO[card.topico].nome} • {feitos} de {total}
                </p>
                <span className="fx-gcab__barra">
                  <Barra valor={pct(feitos, total)} />
                  <small>{pct(feitos, total)}%</small>
                </span>
              </motion.div>
            ) : (
              <motion.div key="normal" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4, transition: { duration: 0.1 } }}>
                <p>
                  {g.topicos.length} {g.topicos.length === 1 ? 'tópico' : 'tópicos'} • {total} flashcards
                </p>
                <div className="fx-chips fx-chips--g">
                  {g.topicos.map((t) => (
                    <button key={t} className={`fx-chip ${filtro === t ? 'is-on' : ''}`} onClick={() => trocarFiltro(filtro === t ? 'todos' : t)} title={`Estudar só ${TOPICO[t].nome}`}>
                      {TOPICO[t].nome}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <div className="fx-gcab__acoes">
          <Btn
            variante="contorno"
            className={`fx-favgrupo ${g.favorito ? 'is-on' : ''}`}
            icone={
              <motion.span key={String(g.favorito)} initial={g.favorito ? { scale: 0.3, rotate: -60 } : false} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 14 }} style={{ display: 'inline-flex' }}>
                <Star size={19} fill={g.favorito ? 'currentColor' : 'none'} strokeWidth={g.favorito ? 0 : 2} />
              </motion.span>
            }
            onClick={() => {
              setGrupo(g.id, (x) => ({ ...x, favorito: !x.favorito }))
              toast(g.favorito ? 'Grupo removido dos favoritos.' : 'Grupo adicionado aos favoritos!')
            }}
          >
            {g.favorito ? 'Grupo favorito' : 'Favoritar grupo'}
          </Btn>
          <Menu
            className="fx-iconbtn--caixa"
            icone={<EllipsisVertical size={19} />}
            itens={[
              ...(feitos ? [{ texto: 'Ver resultado da sessão', icone: <Trophy size={17} />, fn: () => (concluirSessao(g.id), ir({ id: 'concluida', grupo: g.id })) }] : []),
              { texto: 'Reiniciar progresso', icone: <RotateCcw size={17} />, fn: () => (reiniciar(g.id), setIdx(0), setFim(false), setRevelado(false), toast('Progresso do grupo reiniciado.', 'info')) },
            ]}
          />
        </div>
      </header>

      <div className="fx-estudo__grade">
        <div className="fx-estudo__esq">
          <AnimatePresence initial={false}>
            {!foco && (
              <motion.div className="fx-estudo__topo" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}>
                <div className="fx-abas fx-abas--grupo" role="tablist">
                  {(
                    [
                      ['estudar', 'Estudar', CirclePlay],
                      ['resumo', 'Resumo', BookOpen],
                      ['desempenho', 'Desempenho', ChartColumn],
                    ] as const
                  ).map(([id, nome, I]) => (
                    <button key={id} role="tab" aria-selected={aba === id} className={aba === id ? 'is-on' : ''} onClick={() => setAba(id)}>
                      <I size={19} strokeWidth={1.9} />
                      {nome}
                      {aba === id && <motion.span layoutId="fx-aba-grupo" className="fx-abas__linha" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
                    </button>
                  ))}
                </div>
                {aba === 'estudar' && (
                  <div className="fx-progcard">
                    <span>Progresso do grupo</span>
                    <span className="fx-progcard__n">
                      {feitos} de {total} cards
                    </span>
                    <Barra valor={pct(feitos, total)} />
                    <small>{pct(feitos, total)}%</small>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {aba === 'estudar' && (
            <>
              <div className="fx-palco">
                <button className="fx-palco__seta" onClick={() => navegar(-1)} aria-label="Card anterior" disabled={fim}>
                  <ChevronLeft size={22} />
                </button>
                <div className="fx-palco__meio">
                  <AnimatePresence mode="popLayout" initial={false} custom={saida}>
                    {fim ? (
                      <Fim key="fim" g={g} onResultado={() => (concluirSessao(g.id), ir({ id: 'concluida', grupo: g.id }))} onDeNovo={() => (reiniciar(g.id), setIdx(0), setFim(false))} onRevisar={(c) => irPara(g.cards.indexOf(c), 'nav-dir')} />
                    ) : (
                      <motion.article key={cardId} layout custom={saida} variants={VAR_CARD} initial="entra" animate="no" exit="sai" className={`fx-flip ${revelado ? 'is-virado' : ''}`}>
                        <motion.div
                          className="fx-flip__giro"
                          role="button"
                          tabIndex={0}
                          aria-pressed={revelado}
                          aria-label={revelado ? 'Virar para a pergunta' : 'Virar o card para ver a resposta'}
                          onClick={() => setRevelado((r) => !r)}
                          initial={false}
                          animate={{ rotateY: revelado ? 180 : 0 }}
                          transition={{ type: 'spring', stiffness: 150, damping: 20, mass: 0.9 }}
                        >
                          {/* frente: pergunta */}
                          <div className="fx-cartao fx-flash fx-flip__face" aria-hidden={revelado}>
                            {cabCard}
                            <div className="fx-flash__frente">
                              <span className="fx-rotulo fx-rotulo--pergunta">Pergunta</span>
                              <h2 className="fx-flash__perg">{card.pergunta}</h2>
                              <p className="fx-flash__dica">
                                <Lightbulb size={17} strokeWidth={1.8} /> Pense na resposta antes de virar o card
                              </p>
                              <motion.span className="fx-flash__virar" animate={{ y: [0, -3, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
                                <Pointer size={18} /> Toque para virar
                              </motion.span>
                            </div>
                          </div>
                          {/* verso: resposta */}
                          <div className="fx-cartao fx-flash fx-flip__face fx-flip__face--verso" aria-hidden={!revelado}>
                            {cabCard}
                            <div className="fx-flash__verso">
                              <div className="fx-flash__pergbloco">
                                <div>
                                  <span className="fx-rotulo fx-rotulo--pergunta">Pergunta</span>
                                  <h2 className="fx-flash__perg fx-flash__perg--g">{card.pergunta}</h2>
                                </div>
                                <span className="fx-flash__arte">
                                  <Brilhos n={4} />
                                  {revelado && <motion.img src="./flash/resposta-pena.webp" alt="" initial={{ scale: 0.6, rotate: -10, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 240, damping: 14, delay: 0.3 }} />}
                                </span>
                              </div>
                              <hr />
                              <span className="fx-rotulo fx-rotulo--resposta">Resposta</span>
                              <p className="fx-flash__resp">
                                <Rico texto={card.resposta} />
                              </p>
                              <span className="fx-flash__voltar">
                                <RotateCcw size={14} /> Toque para ver a pergunta
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      </motion.article>
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {feedback && (
                      <motion.span
                        key={feedback.k}
                        className={`fx-feedback is-${FEEDBACK[feedback.s].c}`}
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -16], scale: 1 }}
                        transition={{ duration: 1.5, times: [0, 0.15, 0.75, 1] }}
                        onAnimationComplete={() => setFeedback((f) => (f?.k === feedback.k ? null : f))}
                      >
                        {feedback.s === 'sei' ? <Check size={16} strokeWidth={3} /> : feedback.s === 'nao' ? <X size={16} strokeWidth={3} /> : <RefreshCw size={15} strokeWidth={2.6} />}
                        {FEEDBACK[feedback.s].t}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <button className="fx-palco__seta" onClick={() => navegar(1)} aria-label="Próximo card" disabled={fim}>
                  <ChevronRight size={22} />
                </button>
              </div>

              <footer className="fx-respostas">
                <span className="fx-estudo__pos">
                  <span className="fx-estudo__posic">
                    <IconeFlashcards size={18} />
                  </span>
                  {fim ? `${total} de ${total} cards` : `Card ${idx + 1} de ${total}`}
                </span>
                <div className="fx-respostas__btns">
                  <motion.button className="fx-resp fx-resp--nao" onClick={() => responder('nao')} disabled={fim} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }} title="Atalho: 1">
                    <span className="fx-resp__ic">
                      <X size={18} strokeWidth={3} />
                    </span>
                    Não sei
                    <kbd>1</kbd>
                  </motion.button>
                  <motion.button className="fx-resp fx-resp--revisar" onClick={() => responder('revisar')} disabled={fim} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }} title="Atalho: 3">
                    <span className="fx-resp__ic">
                      <RefreshCw size={16} strokeWidth={2.6} />
                    </span>
                    Revisar depois
                    <kbd>3</kbd>
                  </motion.button>
                  <motion.button
                    key={`sei-${revelado}`}
                    className="fx-resp fx-resp--sei"
                    onClick={() => responder('sei')}
                    disabled={fim}
                    initial={revelado ? { scale: 0.92 } : false}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 12 }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    title="Atalho: 2"
                  >
                    <span className="fx-resp__ic">
                      <Check size={18} strokeWidth={3.2} />
                    </span>
                    Eu sei
                    <kbd>2</kbd>
                  </motion.button>
                </div>
              </footer>
              <p className="fx-atalhos" aria-hidden>
                <kbd>espaço</kbd> virar card · <kbd>←</kbd> <kbd>→</kbd> navegar
              </p>
            </>
          )}

          {aba === 'resumo' && <Resumo g={g} onEstudar={(t) => (trocarFiltro(t), setAba('estudar'))} />}
          {aba === 'desempenho' && <Desempenho g={g} onCard={(c) => (irPara(g.cards.indexOf(c), 'nav-dir'), setAba('estudar'))} />}
        </div>

        <aside className="fx-cartao fx-lista">
          <div className="fx-lista__cab">
            <h3>Cards do grupo</h3>
            <Select rotulo="Filtrar por tópico" className="fx-select--p" valor={filtro} onChange={trocarFiltro} opcoes={[{ valor: 'todos', texto: 'Todos os tópicos' }, ...g.topicos.map((t) => ({ valor: t, texto: TOPICO[t].nome }))]} />
          </div>
          <div className="fx-lista__itens" ref={listaRef}>
            {ordem.map((c) => {
              const i = g.cards.indexOf(c)
              const atual = c === cardId && !fim
              const st = g.status[c]
              return (
                <button key={c} data-card={c} className={`fx-litem ${atual ? 'is-atual' : ''}`} onClick={() => (setAba('estudar'), irPara(i, i < idx ? 'nav-esq' : 'nav-dir'))}>
                  {atual && <motion.span layoutId="fx-litem-pill" className="fx-litem__pill" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
                  <span className="fx-litem__n">{i + 1}</span>
                  <span className="fx-litem__txt">{CARD[c].pergunta}</span>
                  <span className="fx-litem__st">
                    <IconeStatus atual={atual} fav={!!favs[c]} st={st} />
                  </span>
                </button>
              )
            })}
          </div>
        </aside>
      </div>
    </div>
  )

  function trocarFiltro(t: string) {
    setFiltro(t)
    if (t === 'todos') return
    const lista = g.cards.filter((c) => CARD[c].topico === t)
    if (lista.includes(cardId) && !fim) return
    const alvo = lista.find((c) => !g.status[c]) ?? lista[0]
    irPara(g.cards.indexOf(alvo), 'nav-dir')
  }
}

const VAR_CARD = {
  entra: (s: Saida) => ({ opacity: 0, x: s === 'nav-esq' ? -60 : 60, rotate: s === 'nav-esq' ? -2 : 2, scale: 0.97 }),
  no: { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 30 } },
  sai: (s: Saida) =>
    s === 'sei'
      ? { opacity: 0, x: -90, rotate: -5, scale: 0.94, transition: { duration: 0.22 } }
      : s === 'nao'
        ? { opacity: 0, x: -90, rotate: 4, scale: 0.94, transition: { duration: 0.22 } }
        : s === 'revisar'
          ? { opacity: 0, y: -40, scale: 0.92, transition: { duration: 0.22 } }
          : { opacity: 0, x: s === 'nav-esq' ? 60 : -60, transition: { duration: 0.16 } },
}

function StatusPill({ s }: { s: Status }) {
  const m = { sei: ['Você marcou: Eu sei', CircleCheck], nao: ['Você marcou: Não sei', CircleX], revisar: ['Para revisar depois', RefreshCw] } as const
  const [t, I] = m[s]
  return (
    <motion.span className={`fx-stpill is-${s}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
      <I size={14} strokeWidth={2.4} /> {t}
    </motion.span>
  )
}

function IconeStatus({ atual, fav, st }: { atual: boolean; fav: boolean; st?: Status }) {
  const k = atual ? 'atual' : fav ? 'fav' : st ?? 'vazio'
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span key={k} className={`fx-ist is-${k}`} initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.3, opacity: 0 }} transition={{ type: 'spring', stiffness: 600, damping: 26 }}>
        {k === 'atual' ? (
          <Eye size={19} strokeWidth={2} />
        ) : k === 'fav' ? (
          <Star size={19} fill="currentColor" strokeWidth={0} />
        ) : k === 'sei' ? (
          <CircleCheck size={19} strokeWidth={2} />
        ) : k === 'nao' ? (
          <CircleX size={19} strokeWidth={2} />
        ) : k === 'revisar' ? (
          <RefreshCw size={18} strokeWidth={2.2} />
        ) : (
          <i />
        )}
      </motion.span>
    </AnimatePresence>
  )
}

/* ---------------- grupo concluído (no palco) ---------------- */
function Fim({ g, onResultado, onDeNovo, onRevisar }: { g: Grupo; onResultado: () => void; onDeNovo: () => void; onRevisar: (c: string) => void }) {
  const marcados = g.cards.filter((c) => g.status[c] === 'revisar' || g.status[c] === 'nao')
  return (
    <motion.div key="fim" className="fx-cartao fx-flash fx-fim" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
      <img src="./flash/astronauta.webp" alt="" />
      <h2>Você concluiu este grupo!</h2>
      <p>
        {contagem(g).sei} de {g.cards.length} cards marcados como “Eu sei”.
        {marcados.length > 0 && ` ${marcados.length} ${marcados.length === 1 ? 'card ficou' : 'cards ficaram'} para revisar.`}
      </p>
      <div className="fx-fim__btns">
        {marcados.length > 0 && (
          <Btn icone={<ListChecks size={17} />} onClick={() => onRevisar(marcados[0])}>
            Revisar marcados ({marcados.length})
          </Btn>
        )}
        <Btn variante="contorno" icone={<Trophy size={17} />} onClick={onResultado}>
          Ver resultado
        </Btn>
        <Btn variante="fantasma" icone={<RotateCcw size={17} />} onClick={onDeNovo}>
          Estudar novamente
        </Btn>
      </div>
    </motion.div>
  )
}

/* ---------------- aba Resumo ---------------- */
function Resumo({ g, onEstudar }: { g: Grupo; onEstudar: (t: string) => void }) {
  const [aberto, setAberto] = useState<string | null>(g.topicos[0])
  return (
    <div className="fx-resumo">
      {g.topicos.map((t, i) => {
        const T = TOPICO[t]
        const cards = g.cards.filter((c) => CARD[c].topico === t)
        const feitos = cards.filter((c) => g.status[c]).length
        const ab = aberto === t
        return (
          <motion.section key={t} className={`fx-cartao fx-resumo__t ${ab ? 'is-aberto' : ''}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <button className="fx-resumo__cab" onClick={() => setAberto(ab ? null : t)} aria-expanded={ab}>
              <Quadrado icone={T.icone} tam="m" />
              <span>
                <strong>{T.nome}</strong>
                <small>
                  {T.desc} · {feitos}/{cards.length} estudados
                </small>
              </span>
              <motion.span animate={{ rotate: ab ? 90 : 0 }}>
                <ChevronRight size={19} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {ab && (
                <motion.div className="fx-resumo__corpo" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <h4>Pontos-chave</h4>
                  <ul>
                    {cards.slice(0, 5).map((c) => (
                      <li key={c}>
                        <strong>{CARD[c].pergunta}</strong>
                        <span>
                          <Rico texto={CARD[c].resposta} />
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Btn variante="contorno" icone={<CirclePlay size={17} />} onClick={() => onEstudar(t)}>
                    Estudar este tópico
                  </Btn>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        )
      })}
    </div>
  )
}

/* ---------------- aba Desempenho ---------------- */
function Desempenho({ g, onCard }: { g: Grupo; onCard: (c: string) => void }) {
  const feitos = respondidos(g)
  const marcados = g.cards.filter((c) => g.status[c] === 'revisar' || g.status[c] === 'nao')
  return (
    <div className="fx-desemp">
      <section className="fx-cartao fx-desemp__geral">
        <Anel valor={pct(feitos, g.cards.length)} rotulo="Estudado" tam={140} />
        <Legenda g={g} />
      </section>
      <section className="fx-cartao fx-desemp__topicos">
        <h3>Acertos por tópico</h3>
        <PorTopico g={g} respondidosApenas />
      </section>
      <section className="fx-cartao fx-desemp__marcados">
        <h3>
          <Flag size={17} /> Para revisar ({marcados.length})
        </h3>
        {marcados.length ? (
          marcados.map((c) => (
            <button key={c} className="fx-revitem" onClick={() => onCard(c)}>
              <span className={`fx-ist is-${g.status[c]}`}>{g.status[c] === 'nao' ? <CircleX size={17} /> : <RefreshCw size={17} />}</span>
              <span>{CARD[c].pergunta}</span>
              <ChevronRight size={17} />
            </button>
          ))
        ) : (
          <p className="fx-texto fx-texto--suave">Nenhum card marcado. Continue assim!</p>
        )}
      </section>
    </div>
  )
}
