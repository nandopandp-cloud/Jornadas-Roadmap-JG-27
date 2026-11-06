import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, BookOpen, CalendarDays, Check, ChevronLeft, ChevronRight, EyeOff, MoreVertical, Users, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Btn, TipoIcone } from '../components/ui'
import { HOJE, MESES, TIPOS, brCurta, capital, isoData, parseData, type Atividade } from '../data'
import { useCron } from '../store'

type Aba = 'pendente' | 'criada' | 'todas'

export default function InicioProfessor() {
  const { s, setProfessor, ir, toast } = useCron()
  const [aba, setAba] = useState<Aba>('pendente')
  const [criando, setCriando] = useState<string | null>(null)
  const [diaFiltro, setDiaFiltro] = useState<string | null>(null)
  const publicado = s.publicados.f
  const recs = useMemo(
    () => (publicado ?? []).filter((a) => a.professor && s.professor[a.id] !== 'dispensada').sort((a, b) => a.inicio.localeCompare(b.inicio)),
    [publicado, s.professor],
  )
  const estado = (a: Atividade) => s.professor[a.id] ?? 'pendente'
  const pend = recs.filter((a) => estado(a) === 'pendente')
  const criadas = recs.filter((a) => estado(a) === 'criada')
  const lista = aba === 'pendente' ? pend : aba === 'criada' ? criadas : recs

  const criar = (a: Atividade) => {
    setCriando(a.id)
    window.setTimeout(() => {
      setProfessor(a.id, 'criada')
      setCriando(null)
      const t = TIPOS[a.tipo!]
      toast(`${t.natureza === 'Avaliação' ? 'Avaliação criada' : 'Atividade criada'} e enviada para ${a.turmas.length > 1 ? 'as turmas' : 'a turma'} ${a.turmas.join(', ')}.`, 'ok', {
        rotulo: 'Desfazer',
        fn: () => setProfessor(a.id, 'pendente'),
      })
    }, 1100)
  }

  const proximos = (diaFiltro ? recs.filter((a) => a.inicio === diaFiltro) : pend).slice(0, 3)

  return (
    <div className="cr-prof">
      <div className="cr-prof__principal">
        <header className="cr-prof__ola">
          <h1>
            Olá, <em>Professor!</em>
          </h1>
          <p>Confira suas recomendações, acompanhe o cronograma e crie suas atividades.</p>
        </header>

        <motion.section className="cr-banner" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 22 }}>
          <div className="cr-banner__txt">
            <span className="cr-banner__tag">Cronograma de Uso</span>
            <h2>
              Suas próximas atividades
              <br />
              já estão planejadas!
            </h2>
            <p>Acompanhe as recomendações do cronograma da sua escola e crie as atividades com mais agilidade.</p>
          </div>
          <motion.img
            className="cr-banner__img"
            src="./cron/banner-foguete.webp"
            alt=""
            initial={{ opacity: 0, x: 30, rotate: -4 }}
            animate={{ opacity: 1, x: 0, rotate: 0, y: [0, -6, 0] }}
            transition={{ opacity: { delay: 0.15 }, x: { delay: 0.15, type: 'spring' }, y: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }}
          />
          {[
            [70, 18, 0],
            [93, 62, 0.6],
            [57, 22, 1.2],
          ].map(([x, y, d], i) => (
            <motion.span key={i} className="cr-banner__brilho" style={{ left: `${x}%`, top: `${y}%` }} animate={{ scale: [0.4, 1, 0.4], opacity: [0.4, 1, 0.4] }} transition={{ duration: 2.4, repeat: Infinity, delay: d }}>
              ✦
            </motion.span>
          ))}
        </motion.section>

        <section className="cr-recs">
          <header className="cr-recs__cab">
            <span className="cr-cab__icone cr-cab__icone--sm">
              <CalendarDays size={22} strokeWidth={1.8} />
            </span>
            <div>
              <h2>Recomendações do cronograma</h2>
              <p>Atividades e avaliações planejadas pela sua escola para as próximas semanas.</p>
            </div>
            <button className="cr-link cr-link--forte" onClick={() => ir({ id: 'calendario', escola: 'f', dia: HOJE })}>
              Ver cronograma completo <ArrowRight size={18} />
            </button>
          </header>

          {!publicado ? (
            <div className="cr-cartao cr-vazio cr-vazio--grande">
              <CalendarDays size={32} />
              <p>
                <strong>Ainda não há recomendações.</strong> O cronograma da sua escola ainda não foi publicado pela gestão.
              </p>
            </div>
          ) : (
            <>
              <div className="cr-seg" role="tablist">
                {(
                  [
                    ['pendente', `Pendentes (${pend.length})`],
                    ['criada', `Criadas (${criadas.length})`],
                    ['todas', `Todas (${recs.length})`],
                  ] as const
                ).map(([id, txt]) => (
                  <button key={id} role="tab" aria-selected={aba === id} className={aba === id ? 'is-on' : ''} onClick={() => setAba(id)}>
                    {aba === id && <motion.span layoutId="cr-seg" className="cr-seg__pill" transition={{ type: 'spring', stiffness: 500, damping: 36 }} />}
                    <span>{txt}</span>
                  </button>
                ))}
              </div>

              <ul className="cr-recs__lista">
                <AnimatePresence mode="popLayout" initial={false}>
                  {lista.map((a, i) => (
                    <Rec key={a.id} a={a} i={i} estado={estado(a)} criando={criando === a.id} onCriar={() => criar(a)} onDispensar={() => (setProfessor(a.id, 'dispensada'), toast('Recomendação dispensada.', 'info', { rotulo: 'Desfazer', fn: () => setProfessor(a.id, 'pendente') }))} onCalendario={() => ir({ id: 'calendario', escola: 'f', dia: a.inicio })} />
                  ))}
                </AnimatePresence>
                {!lista.length && (
                  <motion.li className="cr-vazio" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Check size={28} />
                    <p>{aba === 'pendente' ? 'Tudo em dia! Você criou todas as atividades recomendadas.' : 'Nada por aqui ainda.'}</p>
                  </motion.li>
                )}
              </ul>
            </>
          )}
        </section>
      </div>

      <aside className="cr-prof__lateral">
        <MiniCalendario recs={recs} dia={diaFiltro} onDia={(d) => setDiaFiltro((x) => (x === d ? null : d))} />
        <section className="cr-cartao cr-proximos">
          <header>
            <h2>{diaFiltro ? `Eventos de ${brCurta(diaFiltro)}` : 'Próximos eventos'}</h2>
            {diaFiltro ? (
              <button className="cr-link" onClick={() => setDiaFiltro(null)}>
                <X size={16} /> Limpar
              </button>
            ) : (
              <button className="cr-link" onClick={() => ir({ id: 'calendario', escola: 'f', dia: HOJE })}>
                Ver todos
              </button>
            )}
          </header>
          <ul>
            <AnimatePresence mode="popLayout" initial={false}>
              {proximos.map((a) => {
                const t = TIPOS[a.tipo!]
                return (
                  <motion.li key={a.id} layout initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} onClick={() => ir({ id: 'calendario', escola: 'f', dia: a.inicio })}>
                    <TipoIcone tipo={a.tipo!} tamanho={44} />
                    <span>
                      <strong>
                        {t.nome} — {a.titulo ?? a.objeto}
                      </strong>
                      <small>
                        {brCurta(a.inicio)} a {brCurta(a.fim)} • {a.ano}
                      </small>
                    </span>
                    <em style={{ color: t.cor, background: t.fundo }}>{a.tipo === 'campeonato' ? 'Campeonato' : t.natureza}</em>
                  </motion.li>
                )
              })}
            </AnimatePresence>
            {!proximos.length && <li className="cr-proximos__vazio">Nenhum evento {diaFiltro ? 'neste dia' : 'pendente'}.</li>}
          </ul>
        </section>
      </aside>
    </div>
  )
}

function Rec({
  a,
  i,
  estado,
  criando,
  onCriar,
  onDispensar,
  onCalendario,
}: {
  a: Atividade
  i: number
  estado: 'pendente' | 'criada' | 'dispensada'
  criando: boolean
  onCriar: () => void
  onDispensar: () => void
  onCalendario: () => void
}) {
  const t = TIPOS[a.tipo!]
  const [menu, setMenu] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!menu) return
    const fora = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setMenu(false)
    document.addEventListener('mousedown', fora)
    return () => document.removeEventListener('mousedown', fora)
  }, [menu])
  return (
    <motion.li
      layout
      className="cr-rec"
      style={{ ['--cor' as string]: t.cor }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 60, transition: { duration: 0.25 } }}
      transition={{ type: 'spring', stiffness: 320, damping: 30, delay: i * 0.04 }}
    >
      <TipoIcone tipo={a.tipo!} tamanho={56} />
      <div className="cr-rec__txt">
        <small>
          {t.natureza} · <span style={a.tipo === 'aula' ? { color: t.cor } : undefined}>{t.nome}</span>
        </small>
        <strong>{a.titulo ?? a.objeto}</strong>
        <span>
          <BookOpen size={16} /> {a.componente}
          <Users size={16} /> {a.ano} · {a.turmas.length > 1 ? 'Turmas' : 'Turma'}: {a.turmas.join(', ')}
        </span>
      </div>
      <span className="cr-rec__data">
        <CalendarDays size={18} /> {brCurta(a.inicio)} a {brCurta(a.fim)}
      </span>
      {estado === 'criada' ? (
        <motion.span className="cr-rec__criada" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
          <Check size={18} strokeWidth={3} /> {t.natureza === 'Avaliação' ? 'Avaliação criada' : 'Atividade criada'}
        </motion.span>
      ) : (
        <Btn className="cr-rec__btn" disabled={criando} icone={criando ? <span className="cr-spinner cr-spinner--branco" /> : undefined} onClick={onCriar}>
          {criando ? 'Criando…' : t.natureza === 'Avaliação' ? 'Criar avaliação' : 'Criar atividade'}
        </Btn>
      )}
      <div className="cr-menu" ref={ref}>
        <button className="cr-iconbtn" onClick={() => setMenu((m) => !m)} aria-label="Mais opções">
          <MoreVertical size={20} />
        </button>
        <AnimatePresence>
          {menu && (
            <motion.div className="cr-menu__lista" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <button onClick={() => (setMenu(false), onCalendario())}>
                <CalendarDays size={16} /> Ver no calendário
              </button>
              {estado === 'pendente' && (
                <button onClick={() => (setMenu(false), onDispensar())}>
                  <EyeOff size={16} /> Dispensar recomendação
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.li>
  )
}

/** calendário pequeno (semana começando na segunda, como na referência) */
function MiniCalendario({ recs, dia, onDia }: { recs: Atividade[]; dia: string | null; onDia: (d: string) => void }) {
  const [mes, setMes] = useState(HOJE.slice(0, 7))
  const primeiro = parseData(`${mes}-01`)
  const offset = (primeiro.getDay() + 6) % 7
  const inicio = new Date(primeiro)
  inicio.setDate(1 - offset)
  const dias = Array.from({ length: 35 }).map((_, i) => {
    const d = new Date(inicio)
    d.setDate(inicio.getDate() + i)
    return d
  })
  const pontos = new Map<string, string>()
  for (const a of recs) if (!pontos.has(a.inicio)) pontos.set(a.inicio, TIPOS[a.tipo!].cor)
  const mudar = (n: number) => {
    const d = new Date(primeiro)
    d.setMonth(d.getMonth() + n)
    setMes(isoData(d).slice(0, 7))
  }
  return (
    <section className="cr-cartao cr-mini-cal">
      <header>
        <h2>
          {capital(MESES[primeiro.getMonth()])} de {primeiro.getFullYear()}
        </h2>
        <div>
          <button className="cr-iconbtn" onClick={() => mudar(-1)} aria-label="Mês anterior">
            <ChevronLeft size={20} />
          </button>
          <button className="cr-iconbtn" onClick={() => mudar(1)} aria-label="Próximo mês">
            <ChevronRight size={20} />
          </button>
        </div>
      </header>
      <div className="cr-mini-cal__grade">
        {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((d) => (
          <span key={d} className="cr-mini-cal__sem">
            {d}
          </span>
        ))}
        {dias.map((d) => {
          const iso = isoData(d)
          const fora = d.getMonth() !== primeiro.getMonth()
          const cor = pontos.get(iso)
          return (
            <motion.button
              key={iso}
              whileTap={{ scale: 0.9 }}
              className={`cr-mini-cal__dia ${fora ? 'is-fora' : ''} ${iso === HOJE ? 'is-hoje' : ''} ${iso === dia ? 'is-sel' : ''}`}
              onClick={() => onDia(iso)}
            >
              {d.getDate()}
              {cor && <i style={{ background: iso === HOJE ? '#ffb020' : cor }} />}
            </motion.button>
          )
        })}
      </div>
    </section>
  )
}
