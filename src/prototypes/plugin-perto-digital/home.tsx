// Página inicial do Prepara SP (referência: captura 3) e modal de recursos de acessibilidade (captura 2).
import { AnimatePresence, motion } from 'framer-motion'
import {
  BookOpen,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Droplet,
  Ellipsis,
  Eye,
  FileText,
  GraduationCap,
  House,
  LayoutList,
  LoaderCircle,
  LogOut,
  Menu,
  MessageSquareMore,
  PanelLeft,
  PenLine,
  SlidersHorizontal,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useA11y } from './a11y'
import { DIAS, ESTUDANTE, HOJE, MESES, atividadesDoDia } from './dados'

const MENU: { grupo?: string; itens: { id: string; rotulo: string; icone: LucideIcon }[] }[] = [
  { itens: [{ id: 'inicio', rotulo: 'Página Inicial', icone: House }] },
  {
    grupo: 'Aprenda',
    itens: [
      { id: 'trilhas', rotulo: 'Trilhas', icone: LayoutList },
      { id: 'estudar', rotulo: 'Estudar', icone: GraduationCap },
      { id: 'biblioteca', rotulo: 'Biblioteca', icone: BookOpen },
      { id: 'cronograma', rotulo: 'Cronograma', icone: CalendarDays },
      { id: 'genie', rotulo: 'Genie Bot', icone: MessageSquareMore },
    ],
  },
  {
    grupo: 'Funcionalidades',
    itens: [
      { id: 'simulados', rotulo: 'Simulados', icone: FileText },
      { id: 'redacao', rotulo: 'Redação', icone: PenLine },
    ],
  },
]

function Sidebar({ recolhida, aberta, onFechar, onSair }: { recolhida: boolean; aberta: boolean; onFechar: () => void; onSair: () => void }) {
  const { avisar } = useA11y()
  const [menuUsuario, setMenuUsuario] = useState(false)
  return (
    <>
      <div className={`pd-sb-fundo ${aberta ? 'is-aberta' : ''}`} onClick={onFechar} aria-hidden />
      <aside className={`pd-sb ${recolhida ? 'is-recolhida' : ''} ${aberta ? 'is-aberta' : ''}`} aria-label="Menu principal">
        <div className="pd-sb__topo">
          <img className="pd-sb__logo" src="./ppsp/logo.png" alt="Prepara SP" />
          <button className="pd-icone-btn pd-sb__x" onClick={onFechar} aria-label="Fechar menu">
            <X size={22} />
          </button>
        </div>
        <nav className="pd-sb__nav">
          {MENU.map((g, i) => (
            <div key={i} className="pd-sb__grupo">
              {g.grupo && <span className="pd-sb__titulo">{g.grupo}</span>}
              {g.itens.map((it) => {
                const Ic = it.icone
                const ativo = it.id === 'inicio'
                return (
                  <button
                    key={it.id}
                    className={`pd-sb__item ${ativo ? 'is-ativo' : ''}`}
                    aria-current={ativo ? 'page' : undefined}
                    title={recolhida ? it.rotulo : undefined}
                    onClick={() => (ativo ? onFechar() : avisar(`${it.rotulo} não faz parte deste protótipo`, 'info'))}
                  >
                    <Ic size={22} strokeWidth={1.8} />
                    <span>{it.rotulo}</span>
                  </button>
                )
              })}
            </div>
          ))}
        </nav>
        <div className="pd-sb__usuario">
          <img src={ESTUDANTE.avatar} alt="" />
          <div className="pd-sb__nome">
            <strong>{ESTUDANTE.nome}</strong>
            <span>{ESTUDANTE.usuario}</span>
          </div>
          <button className="pd-icone-btn" aria-label="Opções da conta" aria-expanded={menuUsuario} onClick={() => setMenuUsuario((v) => !v)}>
            <Ellipsis size={20} />
          </button>
          <AnimatePresence>
            {menuUsuario && (
              <motion.div className="pd-sb__menu" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
                <button onClick={onSair}>
                  <LogOut size={18} /> Sair da conta
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>
    </>
  )
}

function Cronograma() {
  const [semana, setSemana] = useState(0)
  const [dia, setDia] = useState(HOJE.getDate())
  const dias = useMemo(() => {
    const ini = new Date(HOJE)
    ini.setDate(HOJE.getDate() - HOJE.getDay() + semana * 7)
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(ini)
      d.setDate(ini.getDate() + i)
      return d
    })
  }, [semana])
  const mes = dias[3]
  const sel = dias.find((d) => d.getDate() === dia && d.getMonth() === 10) ?? null
  const lista = sel ? atividadesDoDia(sel.getDate()) : []
  return (
    <section className="pd-crono" aria-labelledby="pd-crono-t">
      <h2 id="pd-crono-t" className="pd-h2">
        Cronograma
      </h2>
      <div className="pd-crono__card">
        <div className="pd-crono__cal">
          <div className="pd-crono__mes">
            <button className="pd-crono__seta" onClick={() => setSemana((s) => s - 1)} aria-label="Semana anterior">
              <ChevronLeft size={18} />
            </button>
            <strong aria-live="polite">
              {MESES[mes.getMonth()]} de {mes.getFullYear()}
            </strong>
            <button className="pd-crono__seta" onClick={() => setSemana((s) => s + 1)} aria-label="Próxima semana">
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="pd-crono__dias" role="grid">
            {dias.map((d, i) => {
              const hoje = d.toDateString() === HOJE.toDateString()
              const ativo = sel?.toDateString() === d.toDateString()
              return (
                <button
                  key={i}
                  className={`pd-crono__dia ${ativo ? 'is-sel' : ''} ${hoje ? 'is-hoje' : ''}`}
                  onClick={() => setDia(d.getDate())}
                  aria-pressed={ativo}
                  aria-label={`${DIAS[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}${hoje ? ', hoje' : ''}`}
                  disabled={d.getMonth() !== 10}
                >
                  <small>{DIAS[d.getDay()]}</small>
                  <span>{d.getDate()}</span>
                </button>
              )
            })}
          </div>
        </div>
        <div className="pd-crono__lista">
          <h3>Suas atividades ({lista.length})</h3>
          {lista.length === 0 ? (
            <p className="pd-crono__vazio">Nenhuma atividade para este dia. Aproveite para revisar o que já estudou!</p>
          ) : (
            <ul>
              {lista.map((a, i) => (
                <motion.li key={`${dia}-${i}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <button className={`pd-ativ pd-ativ--${a.cor}`} data-ler>
                    <small>{a.tipo}</small>
                    <span>{a.titulo}</span>
                  </button>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}

export function Home({ onSair }: { onSair: () => void }) {
  const { avisar } = useA11y()
  const [recolhida, setRecolhida] = useState(false)
  const [aberta, setAberta] = useState(false)
  return (
    <div className={`pd-home ${recolhida ? 'is-recolhida' : ''}`}>
      <Sidebar recolhida={recolhida} aberta={aberta} onFechar={() => setAberta(false)} onSair={onSair} />
      <div className="pd-home__main">
        <header className="pd-topo">
          <button className="pd-icone-btn pd-topo__menu" onClick={() => setAberta(true)} aria-label="Abrir menu">
            <Menu size={22} />
          </button>
          <button className="pd-icone-btn pd-topo__painel" onClick={() => setRecolhida((v) => !v)} aria-label={recolhida ? 'Expandir menu lateral' : 'Recolher menu lateral'}>
            <PanelLeft size={22} />
          </button>
          <img className="pd-topo__logo" src="./ppsp/logo.png" alt="Prepara SP" />
          <div className="pd-topo__dir">
            <span className="pd-topo__gemas" aria-label="0 gotas de conhecimento">
              <Droplet size={22} fill="currentColor" /> 0
            </span>
            <span className="pd-topo__sep" />
            <button className="pd-icone-btn pd-topo__bot" aria-label="Genie Bot" onClick={() => avisar('Genie Bot não faz parte deste protótipo', 'info')}>
              <MessageSquareMore size={22} fill="currentColor" stroke="#fff" />
            </button>
            <span className="pd-topo__sep" />
            <button className="pd-icone-btn" aria-label="Ajuda" onClick={() => avisar('Central de ajuda não faz parte deste protótipo', 'info')}>
              <CircleHelp size={22} />
            </button>
          </div>
        </header>

        <main className="pd-conteudo" id="pd-conteudo">
          <div className="pd-conteudo__esq">
            <section aria-labelledby="pd-pv">
              <h2 id="pd-pv" className="pd-h2">
                Para você
              </h2>
              <button className="pd-banner" onClick={() => avisar('Trilha do Provão Paulista não faz parte deste protótipo', 'info')}>
                <img
                  src="./ppsp/banner-provao.png"
                  alt="Novo! Trilha de Aperfeiçoamento do Provão Paulista. As atividades do Tarefa SP agora fazem parte do seu plano de estudo no Prepara SP. Resolva as atividades da semana e fortaleça as habilidades mais importantes de Língua Portuguesa e Matemática. A plataforma identifica suas dificuldades e apresenta uma trilha personalizada para você evoluir ao longo do ano."
                />
              </button>
            </section>

            <section aria-labelledby="pd-ca">
              <h2 id="pd-ca" className="pd-h2">
                Continue aprendendo
              </h2>
              <article className="pd-curso">
                <img src="./ppsp/curso-artes.png" alt="" />
                <div className="pd-curso__info">
                  <small>Curso</small>
                  <h3>Artes - Ensino Médio</h3>
                  <p>Desenvolva repertório cultural e senso crítico por meio da análise de obras, movimentos artísticos e contextos históricos. O curso…</p>
                  <div className="pd-curso__prog">
                    <div className="pd-curso__barra" role="progressbar" aria-valuenow={2} aria-valuemin={0} aria-valuemax={100} aria-label="Progresso do curso">
                      <span style={{ width: '2%' }} />
                    </div>
                    <span>2%</span>
                  </div>
                  <button className="pd-btn pd-btn--primario pd-btn--grande" onClick={() => avisar('O curso de Artes não faz parte deste protótipo', 'info')}>
                    Ir para o curso
                  </button>
                </div>
              </article>
            </section>
          </div>
          <Cronograma />
        </main>
      </div>
    </div>
  )
}

/* ---------------- modal: experiência personalizada ---------------- */
const CHIPS: { icone: LucideIcon; rotulo: string; detalhe: string }[] = [
  { icone: Zap, rotulo: 'Mais foco', detalhe: 'Máscara e guia de leitura' },
  { icone: Eye, rotulo: 'Mais conforto na leitura', detalhe: 'Ajustes de texto e leitor de voz' },
  { icone: SlidersHorizontal, rotulo: 'Uma navegação no seu ritmo', detalhe: 'Libras e navegação por face' },
]

export function ModalAcessibilidade({ aberto, onFechar, onAtivar, ativandoInicial }: { aberto: boolean; onFechar: () => void; onAtivar: () => void; ativandoInicial?: boolean }) {
  const [passo, setPasso] = useState(ativandoInicial ? 0 : -1)
  const ref = useRef<HTMLDivElement>(null)
  const ativando = passo >= 0

  useEffect(() => {
    if (!aberto) return
    const t = window.setTimeout(() => ref.current?.querySelector<HTMLElement>('.pd-modal__ativar')?.focus(), 350)
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && !ativando && onFechar()
    window.addEventListener('keydown', esc)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('keydown', esc)
    }
  }, [aberto, ativando, onFechar])

  // ativação: cada benefício recebe o seu “check” e o modal fecha
  useEffect(() => {
    if (passo < 0) return
    const t = window.setTimeout(() => (passo < CHIPS.length ? setPasso(passo + 1) : onAtivar()), passo === 0 ? 350 : passo < CHIPS.length ? 420 : 650)
    return () => window.clearTimeout(t)
  }, [passo, onAtivar])

  return (
    <AnimatePresence>
      {aberto && (
        <motion.div className="pd-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { delay: 0.1 } }}>
          <motion.div
            ref={ref}
            className="pd-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pd-modal-titulo"
            aria-describedby="pd-modal-desc"
            initial={{ y: 40, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 20, scale: 0.97, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            <button className="pd-icone-btn pd-modal__x" onClick={onFechar} aria-label="Fechar" disabled={ativando}>
              <X size={26} />
            </button>
            <div className="pd-modal__arte">
              <motion.img src="./ppsp/modal-estudante.png" alt="" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} />
            </div>
            <div className="pd-modal__corpo">
              <h2 id="pd-modal-titulo">Uma experiência mais personalizada para você!</h2>
              <motion.span className="pd-modal__traco" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.35, duration: 0.45 }} aria-hidden />
              <p id="pd-modal-desc">
                Identificamos que existem recursos de acessibilidade que podem tornar sua navegação <strong>mais confortável e alinhada às suas necessidades.</strong>
              </p>
              <ul className="pd-modal__chips">
                {CHIPS.map((c, i) => {
                  const Ic = c.icone
                  const ok = passo > i
                  return (
                    <motion.li key={c.rotulo} className={`pd-chip ${ok ? 'is-ok' : ''}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.08 }} title={c.detalhe}>
                      <AnimatePresence>
                        {ok && (
                          <motion.span className="pd-chip__ok" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }}>
                            <Check size={13} strokeWidth={4} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                      <Ic size={26} strokeWidth={2.2} fill={i === 0 ? 'currentColor' : 'none'} />
                      <span>{c.rotulo}</span>
                    </motion.li>
                  )
                })}
              </ul>
              <div className="pd-modal__acoes">
                <button className="pd-btn pd-btn--linha pd-btn--grande" onClick={onFechar} disabled={ativando}>
                  Agora não
                </button>
                <button className="pd-btn pd-btn--primario pd-btn--grande pd-modal__ativar" onClick={() => setPasso(0)} disabled={ativando} aria-live="polite">
                  {ativando ? (
                    passo >= CHIPS.length ? (
                      <>
                        <Check size={20} strokeWidth={3} /> Tudo pronto!
                      </>
                    ) : (
                      <>
                        <LoaderCircle size={20} className="pd-gira" /> Ativando recursos…
                      </>
                    )
                  ) : (
                    'Ativar recursos agora'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
