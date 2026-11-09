import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, CalendarDays, CalendarPlus, ChevronLeft, ChevronRight, FileText, Filter, Plus, School, Table2, Users, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import AtividadeModal from '../components/AtividadeModal'
import { Btn, Modal, Select, TIPO_ICONE, TipoIcone } from '../components/ui'
import { ANOS, COMPONENTES, DIAS_SEMANA, HOJE, MESES, SUGESTOES, TIPOS, TIPO_LISTA, TURMAS, br, capital, isoData, parseData, type Atividade, type TipoId } from '../data'
import { useCron } from '../store'

type Evento = Atividade & { sugerida?: boolean }

export default function Calendario({ escola: escolaInicial, dia }: { escola?: string; dia?: string }) {
  const { s, ir, continuar, salvarAtividade, toast } = useCron()
  const gestor = s.perfil === 'gestor'
  const [escola, setEscola] = useState(escolaInicial ?? 'f')
  const [mes, setMes] = useState(() => (dia ?? HOJE).slice(0, 7))
  const [diaSel, setDiaSel] = useState<string | null>(dia ?? HOJE)
  const [ano, setAno] = useState('todos')
  const [turma, setTurma] = useState('todas')
  const [comp, setComp] = useState('todos')
  const [tipo, setTipo] = useState<'todos' | TipoId>('todos')
  const [tabela, setTabela] = useState(false)
  const [detalhe, setDetalhe] = useState<Evento | null>(null)
  const [novo, setNovo] = useState<string | null>(null)
  const [aceitas, setAceitas] = useState<string[]>([])
  const [dir, setDir] = useState(1)

  const info = s.escolas.find((e) => e.id === escola)!
  const publicadas = s.publicados[escola]
  const eventos: Evento[] = useMemo(() => {
    if (!publicadas) return []
    const sug = SUGESTOES.filter((x) => !aceitas.includes(x.id))
    return [...publicadas, ...sug].filter(
      (e) =>
        (ano === 'todos' || e.ano === ano) &&
        (turma === 'todas' || e.turmas.includes(turma)) &&
        (comp === 'todos' || e.componente === comp) &&
        (tipo === 'todos' || e.tipo === tipo),
    )
  }, [publicadas, aceitas, ano, turma, comp, tipo])

  const porDia = useMemo(() => {
    const m = new Map<string, Evento[]>()
    for (const e of eventos) m.set(e.inicio, [...(m.get(e.inicio) ?? []), e])
    return m
  }, [eventos])

  const primeiro = parseData(`${mes}-01`)
  const inicioGrade = new Date(primeiro)
  inicioGrade.setDate(1 - primeiro.getDay())
  const dias = Array.from({ length: 42 }).map((_, i) => {
    const d = new Date(inicioGrade)
    d.setDate(inicioGrade.getDate() + i)
    return d
  })
  const semanas = dias[35].getMonth() !== primeiro.getMonth() && dias[35] > primeiro ? 5 : 6
  const titulo = `${capital(MESES[primeiro.getMonth()])} de ${primeiro.getFullYear()}`
  const doDia = diaSel ? porDia.get(diaSel) ?? [] : []
  const filtrando = ano !== 'todos' || turma !== 'todas' || comp !== 'todos' || tipo !== 'todos'

  const mudarMes = (delta: number) => {
    const d = new Date(primeiro)
    d.setMonth(d.getMonth() + delta)
    setDir(delta)
    setMes(isoData(d).slice(0, 7))
  }

  const diaTexto = (iso: string) => {
    const d = parseData(iso)
    return `${capital(DIAS_SEMANA[d.getDay()])}, ${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`
  }

  const aceitarSugestao = (e: Evento) => {
    setAceitas((x) => [...x, e.id])
    salvarAtividade({ ...e, id: `${e.id}-ok`, sugerida: undefined } as Atividade, escola)
    setDetalhe(null)
    toast(`${TIPOS[e.tipo!].nome} adicionada ao cronograma da ${info.nome}.`)
  }

  return (
    <div className="cr-cal">
      <header className="cr-cal__cab">
        <span className="cr-cal__ic">
          <CalendarDays size={26} />
        </span>
        <div className="cr-cal__titulo">
          <h1>Calendário Escolar</h1>
          <p>Visualize as atividades e avaliações do cronograma da {info.nome}.</p>
        </div>
        <Select
          className="cr-cal__escola"
          valor={escola}
          onChange={(v) => {
            setEscola(v)
            setDiaSel(HOJE)
            setMes(HOJE.slice(0, 7))
          }}
          opcoes={s.escolas.map((e) => ({ valor: e.id, texto: e.nome, icone: <School size={18} /> }))}
        />
        <Btn variante="contorno" icone={tabela ? <CalendarDays size={18} /> : <Table2 size={18} />} onClick={() => setTabela((t) => !t)} disabled={!publicadas}>
          {tabela ? 'Ver em calendário' : 'Ver em tabela'}
        </Btn>
      </header>

      {!publicadas ? (
        <motion.div className="cr-cartao cr-cal__vazio" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <span className="cr-cal__vazioic">
            <CalendarPlus size={40} strokeWidth={1.6} />
          </span>
          <h2>A {info.nome} ainda não tem cronograma publicado</h2>
          <p>{info.status === 'rascunho' ? 'Existe um rascunho em andamento. Finalize e publique para ver as atividades aqui.' : 'Importe a planilha do cronograma para preencher o calendário automaticamente.'}</p>
          {gestor && (
            <Btn icone={<Plus size={18} />} onClick={() => (info.status === 'rascunho' ? continuar(escola) : ir({ id: 'escolha', escola }))}>
              {info.status === 'rascunho' ? 'Continuar rascunho' : 'Criar cronograma'}
            </Btn>
          )}
        </motion.div>
      ) : (
        <>
          <div className="cr-cal__filtros">
            <Select rotulo="Ano escolar:" valor={ano} onChange={(v) => (setAno(v), setTurma('todas'))} opcoes={[{ valor: 'todos', texto: 'Todos' }, ...ANOS.map((a) => ({ valor: a, texto: a }))]} />
            <Select
              rotulo="Turma:"
              valor={turma}
              onChange={setTurma}
              opcoes={[{ valor: 'todas', texto: 'Todas' }, ...(ano === 'todos' ? Object.values(TURMAS).flat() : TURMAS[ano]).map((t) => ({ valor: t, texto: t }))]}
            />
            <Select rotulo="Componente:" valor={comp} onChange={setComp} opcoes={[{ valor: 'todos', texto: 'Todos' }, ...COMPONENTES.map((c) => ({ valor: c, texto: c }))]} />
            <Select
              rotulo="Tipo de atividade:"
              valor={tipo}
              onChange={setTipo}
              opcoes={[{ valor: 'todos' as const, texto: 'Todos' }, ...TIPO_LISTA.map((t) => ({ valor: t, texto: TIPOS[t].nome }))]}
            />
            <button
              className={`cr-link cr-cal__limpar ${filtrando ? '' : 'is-inativo'}`}
              onClick={() => {
                setAno('todos')
                setTurma('todas')
                setComp('todos')
                setTipo('todos')
              }}
            >
              <Filter size={18} /> Limpar filtros
            </button>
          </div>

          <div className={`cr-cal__grade ${diaSel && !tabela ? 'com-painel' : ''}`}>
            <section className="cr-cal__mes">
              <div className="cr-cal__nav">
                <Btn
                  variante="contorno"
                  pequeno
                  onClick={() => {
                    setDir(HOJE.slice(0, 7) > mes ? 1 : -1)
                    setMes(HOJE.slice(0, 7))
                    setDiaSel(HOJE)
                  }}
                >
                  Hoje
                </Btn>
                <button className="cr-redondo" onClick={() => mudarMes(-1)} aria-label="Mês anterior">
                  <ChevronLeft size={20} />
                </button>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.h2 key={mes} initial={{ opacity: 0, y: 6 * dir }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 * dir }} transition={{ duration: 0.15 }}>
                    {titulo}
                  </motion.h2>
                </AnimatePresence>
                <button className="cr-redondo" onClick={() => mudarMes(1)} aria-label="Próximo mês">
                  <ChevronRight size={20} />
                </button>
              </div>

              {tabela ? (
                <TabelaMes eventos={eventos.filter((e) => e.inicio.startsWith(mes))} onAbrir={setDetalhe} titulo={titulo} />
              ) : (
                <>
                  <div className="cr-cal__semana">
                    {DIAS_SEMANA.map((d) => (
                      <span key={d}>{d.toUpperCase()}</span>
                    ))}
                  </div>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={mes}
                      className="cr-cal__dias"
                      style={{ gridTemplateRows: `repeat(${semanas}, minmax(0, 1fr))` }}
                      initial={{ opacity: 0, x: 30 * dir }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 * dir }}
                      transition={{ duration: 0.22 }}
                    >
                      {dias.slice(0, semanas * 7).map((d) => {
                        const iso = isoData(d)
                        const fora = d.getMonth() !== primeiro.getMonth()
                        const evs = porDia.get(iso) ?? []
                        return (
                          <button
                            key={iso}
                            className={`cr-dia ${fora ? 'is-fora' : ''} ${iso === diaSel ? 'is-sel' : ''} ${iso === HOJE ? 'is-hoje' : ''}`}
                            onClick={() => setDiaSel(iso)}
                          >
                            <span className="cr-dia__num">{d.getDate()}</span>
                            <span className="cr-dia__evs">
                              {evs.slice(0, 2).map((e) => (
                                <Chip key={e.id} e={e} />
                              ))}
                              {evs.length > 2 && <span className="cr-dia__mais">+{evs.length - 2}</span>}
                            </span>
                          </button>
                        )
                      })}
                    </motion.div>
                  </AnimatePresence>
                </>
              )}

              <ul className="cr-legenda">
                <li>
                  <i className="cr-pt" style={{ background: TIPOS.tarefa.cor }} /> Atividade Agendada
                </li>
                <li>
                  <b style={{ color: TIPOS.tarefa.cor }}>+</b> Atividade Sugerida
                </li>
                <li>
                  <i className="cr-pt cr-pt--anel" style={{ borderColor: TIPOS.prova.cor }} /> Avaliação Agendada
                </li>
                <li>
                  <b style={{ color: TIPOS.prova.cor }}>+</b> Avaliação Sugerida
                </li>
                <li>
                  <Ic t="campeonato" /> Campeonato
                </li>
                <li>
                  <Ic t="aula" /> Aula Invertida
                </li>
                <li>
                  <Ic t="desafio" /> Desafio Adaptativo
                </li>
              </ul>
            </section>

            <AnimatePresence>
              {diaSel && !tabela && (
                <motion.aside
                  className="cr-cartao cr-cal__painel"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 24 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <header>
                    <div>
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.h3 key={diaSel} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                          {diaTexto(diaSel)}
                        </motion.h3>
                      </AnimatePresence>
                      <p>{doDia.length ? `${doDia.length} ${doDia.length > 1 ? 'eventos' : 'evento'} no dia` : 'Nenhum evento no dia'}</p>
                    </div>
                    <button className="cr-iconbtn" onClick={() => setDiaSel(null)} aria-label="Fechar painel">
                      <X size={20} />
                    </button>
                  </header>
                  <div className="cr-cal__lista">
                    <AnimatePresence mode="popLayout" initial={false}>
                      {doDia.map((e, i) => (
                        <motion.button
                          key={e.id}
                          layout
                          className="cr-evento"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.96 }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => setDetalhe(e)}
                        >
                          <EventoCard e={e} />
                        </motion.button>
                      ))}
                    </AnimatePresence>
                    {!doDia.length && (
                      <div className="cr-cal__semeventos">
                        <CalendarDays size={28} />
                        <p>Que tal planejar algo para este dia?</p>
                      </div>
                    )}
                  </div>
                  {gestor && (
                    <Btn className="cr-cal__novo" icone={<Plus size={20} />} onClick={() => setNovo(diaSel)}>
                      Nova atividade no dia
                    </Btn>
                  )}
                </motion.aside>
              )}
            </AnimatePresence>
          </div>
        </>
      )}

      <Modal
        aberto={!!detalhe}
        onFechar={() => setDetalhe(null)}
        titulo={detalhe?.tipo ? TIPOS[detalhe.tipo].nome : 'Atividade'}
        largura={520}
        rodape={
          detalhe?.sugerida && gestor ? (
            <>
              <Btn variante="contorno" onClick={() => setDetalhe(null)}>
                Agora não
              </Btn>
              <Btn icone={<Plus size={18} />} onClick={() => aceitarSugestao(detalhe)}>
                Adicionar ao cronograma
              </Btn>
            </>
          ) : (
            <Btn variante="contorno" onClick={() => setDetalhe(null)}>
              Fechar
            </Btn>
          )
        }
      >
        {detalhe && (
          <div className="cr-detevento">
            <EventoCard e={detalhe} grande />
            <dl>
              <dt>Educador(a)</dt>
              <dd>{detalhe.educador}</dd>
              <dt>Natureza</dt>
              <dd>{detalhe.tipo ? TIPOS[detalhe.tipo].natureza : '—'}</dd>
            </dl>
            {detalhe.sugerida && <p className="cr-texto cr-texto--suave">Sugestão gerada pela plataforma a partir do ritmo das turmas e do cronograma da escola.</p>}
          </div>
        )}
      </Modal>

      <AtividadeModal
        aberto={!!novo}
        padrao={novo ? { inicio: novo, fim: novo } : undefined}
        onFechar={() => setNovo(null)}
        onSalvar={(a) => {
          salvarAtividade(a, escola)
          setNovo(null)
          setDiaSel(a.inicio)
          setMes(a.inicio.slice(0, 7))
          toast(`Atividade adicionada em ${br(a.inicio)}.`)
        }}
      />
    </div>
  )
}

function Ic({ t }: { t: TipoId }) {
  const I = TIPO_ICONE[t]
  return <I size={15} color={TIPOS[t].cor} fill={TIPOS[t].cor} fillOpacity={0.25} />
}

/** chip do evento dentro do dia */
function Chip({ e }: { e: Evento }) {
  const t = TIPOS[e.tipo!]
  const avaliacao = t.natureza === 'Avaliação'
  const comIcone = e.tipo === 'campeonato' || e.tipo === 'aula' || e.tipo === 'desafio'
  return (
    <span className={`cr-chipev ${e.sugerida ? 'is-sugerida' : ''}`} style={{ color: avaliacao ? '#14438f' : '#3b2a14', background: e.sugerida ? '#fff' : t.fundo, borderColor: e.sugerida ? t.borda : 'transparent' }}>
      {e.sugerida ? <b style={{ color: t.cor }}>+</b> : comIcone ? <Ic t={e.tipo!} /> : <i className={`cr-pt ${avaliacao ? 'cr-pt--anel' : ''}`} style={avaliacao ? { borderColor: t.cor } : { background: t.cor }} />}
      <span>{t.nome}</span>
    </span>
  )
}

function EventoCard({ e, grande }: { e: Evento; grande?: boolean }) {
  const t = TIPOS[e.tipo!]
  return (
    <span className={`cr-evento__card ${grande ? 'is-grande' : ''}`}>
      <span className="cr-evento__topo">
        <TipoIcone tipo={e.tipo!} tamanho={grande ? 44 : 36} />
        <strong>{t.nome}</strong>
        <em className={e.sugerida ? 'is-sugerida' : ''} style={e.sugerida ? undefined : { color: t.cor, background: t.fundo }}>
          {e.sugerida ? 'Sugerida' : 'Agendada'}
        </em>
      </span>
      <span className="cr-evento__linha">
        <CalendarDays size={16} /> {br(e.inicio)} a {br(e.fim)}
      </span>
      <span className="cr-evento__linha">
        <Users size={16} /> {e.ano} • {e.turmas.length > 1 ? 'Turmas' : 'Turma'}: {e.turmas.join(', ')}
      </span>
      <span className="cr-evento__linha">
        <BookOpen size={16} /> {e.componente}
      </span>
      <span className="cr-evento__linha">
        <FileText size={16} /> {e.unidade} • {e.objeto}
      </span>
      {!grande && <ChevronRight size={20} className="cr-evento__seta" />}
    </span>
  )
}

function TabelaMes({ eventos, onAbrir, titulo }: { eventos: Evento[]; onAbrir: (e: Evento) => void; titulo: string }) {
  const lista = [...eventos].sort((a, b) => a.inicio.localeCompare(b.inicio))
  return (
    <div className="cr-rolagem cr-cal__tabela">
      {lista.length ? (
        <table className="cr-tabela">
          <thead>
            <tr>
              <th>Período</th>
              <th>Atividade</th>
              <th>Ano / turmas</th>
              <th>Componente</th>
              <th>Conteúdo</th>
              <th>Situação</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((e, i) => (
              <motion.tr key={e.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }} onClick={() => onAbrir(e)} className="cr-clicavel">
                <td>
                  {br(e.inicio)} a {br(e.fim)}
                </td>
                <td>
                  <span className="cr-tabela__tipo">
                    <TipoIcone tipo={e.tipo!} tamanho={28} /> {TIPOS[e.tipo!].nome}
                  </span>
                </td>
                <td>
                  {e.ano} • {e.turmas.join(', ')}
                </td>
                <td>{e.componente}</td>
                <td>
                  {e.unidade} • {e.objeto}
                </td>
                <td>
                  <span className={`cr-situacao ${e.sugerida ? 'is-sugerida' : ''}`}>{e.sugerida ? 'Sugerida' : 'Agendada'}</span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="cr-vazio">
          <CalendarDays size={28} />
          <p>Nenhum evento em {titulo.toLowerCase()} com esses filtros.</p>
        </div>
      )}
    </div>
  )
}
