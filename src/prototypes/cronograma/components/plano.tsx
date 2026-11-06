import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, BookOpen, CalendarDays, Check, CheckCircle2, ChevronDown, Copy, Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { COMPONENTES, TIPOS, TIPO_LISTA, type TipoId } from '../data'
import {
  ANOS_ESCOPO,
  CURRICULO,
  HABILIDADES,
  MESES_PLANO,
  PERIODO_FIM,
  PERIODO_INICIO,
  REDE,
  curta,
  intervaloMes,
  nomeMesPlano,
  nomeRede,
  textoAplicacao,
  turmasCandidatas,
  turmasDaProg,
  turmasDoEscopo,
  type Escopo,
  type Prog,
} from '../plano'
import { Select, TIPO_ICONE } from './ui'

/* ---------------- cabeçalho com ilustração ---------------- */
export function PlanoCab({ titulo, subtitulo, img }: { titulo: string; subtitulo: string; img: string }) {
  return (
    <header className="pl-cab">
      <div>
        <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          {titulo}
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          {subtitulo}
        </motion.p>
      </div>
      <motion.img
        className="pl-cab__img"
        src={`./cron/${img}.webp`}
        alt=""
        initial={{ opacity: 0, x: 24, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1, y: [0, -4, 0] }}
        transition={{ opacity: { duration: 0.4 }, x: { type: 'spring', stiffness: 160, damping: 18 }, y: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }}
      />
      <Brilho className="pl-cab__b1" />
      <Brilho className="pl-cab__b2" d={0.8} />
    </header>
  )
}
function Brilho({ className, d = 0 }: { className: string; d?: number }) {
  return (
    <motion.span className={`pl-brilho ${className}`} animate={{ scale: [0.5, 1, 0.5], opacity: [0.4, 1, 0.4], rotate: [0, 45, 0] }} transition={{ duration: 2.6, repeat: Infinity, delay: d }}>
      ✦
    </motion.span>
  )
}

/* ---------------- etapas (4 passos) ---------------- */
const PASSOS = ['Definir escopo', 'Configurar programação', 'Revisar e ajustar', 'Finalizar e publicar']
export function Etapas4({ atual }: { atual: 1 | 2 | 3 | 4 }) {
  return (
    <div className="pl-etapas">
      <ol>
        {PASSOS.map((p, i) => {
          const n = i + 1
          const feito = n < atual
          return (
            <li key={p} className={`${feito ? 'is-feito' : ''} ${n === atual ? 'is-atual' : ''}`}>
              {i > 0 && <span className={`pl-etapas__linha ${n <= atual ? 'is-on' : ''}`} />}
              <motion.span className="pl-etapas__num" key={`${feito}-${n === atual}`} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 16 }}>
                {feito ? <Check size={18} strokeWidth={3} /> : n}
              </motion.span>
              <span className="pl-etapas__nome">{p}</span>
            </li>
          )
        })}
      </ol>
      <div className="pl-etapas__trilho">
        <motion.span initial={false} animate={{ width: `${(atual - 0.55) * 25}%` }} transition={{ type: 'spring', stiffness: 70, damping: 18 }} />
      </div>
    </div>
  )
}

/* ---------------- selo de tipo (como na referência) ---------------- */
export function TipoPill({ tipo }: { tipo: TipoId }) {
  const t = TIPOS[tipo]
  const I = TIPO_ICONE[tipo]
  return (
    <span className="pl-tipo" style={{ background: t.fundo, color: t.cor }}>
      {tipo === 'prova' || tipo === 'tarefa' ? <i className={`pl-tipo__pt ${tipo === 'prova' ? 'is-anel' : ''}`} style={{ ['--c' as string]: t.cor }} /> : <I size={15} fill="currentColor" fillOpacity={0.25} />}
      <span>{t.nome}</span>
    </span>
  )
}

/* ---------------- tabela por mês ---------------- */
export function MesesProg({
  progs,
  escopo,
  colunas = { periodo: true, habilidade: true },
  status,
  acoes,
  vazio,
  destaque,
  abertosPadrao = ['2027-03'],
}: {
  progs: Prog[]
  escopo: Escopo
  colunas?: { periodo?: boolean; habilidade?: boolean }
  status?: (p: Prog) => 'valida' | 'pendencia'
  acoes?: { editar: (p: Prog) => void; duplicar: (p: Prog) => void; excluir: (p: Prog) => void }
  vazio?: ReactNode
  destaque?: string | null
  abertosPadrao?: string[]
}) {
  const [abertos, setAbertos] = useState<Record<string, boolean>>({})
  const grupos = MESES_PLANO.map((k) => ({ k, l: progs.filter((p) => p.inicio.startsWith(k)).sort((a, b) => a.inicio.localeCompare(b.inicio)) }))
  // ao chegar programação nova num mês fechado, abre o mês
  useEffect(() => {
    if (!destaque) return
    const p = progs.find((x) => x.id === destaque)
    if (p) setAbertos((a) => ({ ...a, [p.inicio.slice(0, 7)]: true }))
  }, [destaque, progs])

  return (
    <div className="pl-meses">
      {grupos.map(({ k, l }) => {
        const aberto = abertos[k] ?? (abertosPadrao.includes(k) && l.length > 0)
        return (
          <section key={k} className={`pl-mes ${aberto ? 'is-aberto' : ''}`}>
            <button className="pl-mes__cab" onClick={() => setAbertos((a) => ({ ...a, [k]: !aberto }))} aria-expanded={aberto}>
              <motion.span animate={{ rotate: aberto ? 0 : -90 }} className="pl-mes__seta">
                <ChevronDown size={22} />
              </motion.span>
              <strong>{nomeMesPlano(k)}</strong>
              <motion.span key={l.length} className="pl-mes__qtd" initial={{ scale: 1.25 }} animate={{ scale: 1 }}>
                {l.length} {l.length === 1 ? 'programação' : 'programações'}
              </motion.span>
              <span className="pl-mes__per">{intervaloMes(k)}</span>
            </button>
            <AnimatePresence initial={false}>
              {aberto && (
                <motion.div className="pl-mes__corpo" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}>
                  {l.length ? (
                    <table className="pl-tabela">
                      <thead>
                        <tr>
                          <th>Atividade</th>
                          <th>Componente curricular</th>
                          <th>Unidade temática</th>
                          <th>Objeto de conhecimento</th>
                          {colunas.habilidade && <th>Habilidade</th>}
                          {colunas.periodo && <th>Período</th>}
                          <th>Aplicação</th>
                          {status && <th>Status</th>}
                          {acoes && <th aria-label="Ações" />}
                        </tr>
                      </thead>
                      <tbody>
                        <AnimatePresence initial={false}>
                          {l.map((p) => {
                            const st = status?.(p)
                            return (
                              <motion.tr
                                key={p.id}
                                layout="position"
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: 30 }}
                                className={destaque === p.id ? 'is-destaque' : ''}
                              >
                                <td>
                                  <TipoPill tipo={p.tipo} />
                                </td>
                                <td>{p.componente}</td>
                                <td className="pl-tabela__quebra">{p.unidade || '—'}</td>
                                <td className="pl-tabela__quebra">{p.objeto || '—'}</td>
                                {colunas.habilidade && (
                                  <td>
                                    {p.habilidade ? (
                                      <span className="pl-hab" title={p.habilidade}>
                                        {p.habilidade.split(' — ')[0]}
                                      </span>
                                    ) : (
                                      <span className="pl-tabela__nada">—</span>
                                    )}
                                  </td>
                                )}
                                {colunas.periodo && (
                                  <td>
                                    <span className="pl-periodo">
                                      <CalendarDays size={18} /> {curta(p.inicio)} a {curta(p.fim)}
                                    </span>
                                  </td>
                                )}
                                <td>
                                  <Aplicacao p={p} escopo={escopo} />
                                </td>
                                {st && (
                                  <td>
                                    <motion.span key={st} className={`pl-status pl-status--${st}`} initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                                      {st === 'valida' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                                      {st === 'valida' ? 'Válida' : 'Pendência'}
                                    </motion.span>
                                  </td>
                                )}
                                {acoes && (
                                  <td className="pl-tabela__acoes">
                                    <button className="cr-iconbtn" onClick={() => acoes.editar(p)} aria-label="Editar programação" title="Editar">
                                      <Pencil size={19} />
                                    </button>
                                    <button className="cr-iconbtn" onClick={() => acoes.duplicar(p)} aria-label="Duplicar programação" title="Duplicar">
                                      <Copy size={19} />
                                    </button>
                                    <button className="cr-iconbtn cr-iconbtn--perigo" onClick={() => acoes.excluir(p)} aria-label="Excluir programação" title="Excluir">
                                      <Trash2 size={19} />
                                    </button>
                                  </td>
                                )}
                              </motion.tr>
                            )
                          })}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  ) : (
                    <div className="pl-mes__vazio">{vazio ?? 'Nenhuma programação neste mês.'}</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        )
      })}
    </div>
  )
}

/* ---------------- campo de busca com lista (habilidade) ---------------- */
function BuscaLista({ valor, opcoes, onChange, placeholder }: { valor?: string; opcoes: string[]; onChange: (v?: string) => void; placeholder: string }) {
  const [aberto, setAberto] = useState(false)
  const [q, setQ] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!aberto) return
    const fora = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setAberto(false)
    document.addEventListener('mousedown', fora)
    return () => document.removeEventListener('mousedown', fora)
  }, [aberto])
  const lista = opcoes.filter((o) => o.toLowerCase().includes(q.toLowerCase()))
  return (
    <div className={`cr-select ${aberto ? 'is-aberto' : ''}`} ref={ref}>
      <label className="cr-select__btn pl-busca">
        <Search size={18} />
        <input
          value={aberto ? q : valor ?? ''}
          placeholder={placeholder}
          onFocus={() => {
            setAberto(true)
            setQ('')
          }}
          onChange={(e) => setQ(e.target.value)}
        />
        <ChevronDown size={18} className="cr-select__seta" onClick={() => setAberto((a) => !a)} />
      </label>
      <AnimatePresence>
        {aberto && (
          <motion.ul className="cr-select__lista" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.14 }}>
            {valor && (
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onChange(undefined)
                    setAberto(false)
                  }}
                >
                  <span className="pl-limpar">Sem habilidade</span>
                </button>
              </li>
            )}
            {lista.map((o) => (
              <li key={o}>
                <button
                  type="button"
                  className={o === valor ? 'is-on' : ''}
                  onClick={() => {
                    onChange(o)
                    setAberto(false)
                  }}
                >
                  <span>{o}</span>
                </button>
              </li>
            ))}
            {!lista.length && <li className="pl-semres">Nenhuma habilidade encontrada.</li>}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ---------------- formulário “Nova programação” ---------------- */
export type ErrosProg = Partial<Record<'tipo' | 'componente' | 'inicio' | 'fim' | 'anos' | 'escolas', string>>

export function validarProg(p: Prog): ErrosProg {
  const e: ErrosProg = {}
  if (!p.tipo) e.tipo = 'Escolha o tipo.'
  if (!p.componente) e.componente = 'Escolha o componente.'
  if (!p.inicio) e.inicio = 'Informe o início.'
  else if (p.inicio < PERIODO_INICIO || p.inicio > PERIODO_FIM) e.inicio = 'Fora do período (mar–mai/2027).'
  if (!p.fim) e.fim = 'Informe o término.'
  else if (p.fim < p.inicio) e.fim = 'Termina antes de começar.'
  else if (p.fim > PERIODO_FIM) e.fim = 'Fora do período (mar–mai/2027).'
  if (!p.anos.length) e.anos = 'Escolha pelo menos um ano.'
  if (!p.escolas.length) e.escolas = 'Escolha pelo menos uma escola.'
  return e
}

export function CamposProg({ f, set, erros }: { f: Prog; set: (p: Partial<Prog>) => void; erros: ErrosProg }) {
  const unidades = Object.keys(CURRICULO[f.componente] ?? {})
  const objetos = CURRICULO[f.componente]?.[f.unidade] ?? []
  return (
    <div className="pl-campos">
      <div className="pl-campo">
        <span>
          Tipo de atividade <b>*</b>
        </span>
        <Select
          className="cr-select--bloco"
          valor={f.tipo}
          onChange={(tipo) => set({ tipo })}
          opcoes={TIPO_LISTA.map((t) => {
            const I = TIPO_ICONE[t]
            return { valor: t, texto: TIPOS[t].nome, icone: <I size={18} color={TIPOS[t].cor} /> }
          })}
        />
      </div>
      <div className="pl-campo">
        <span>
          Componente curricular <b>*</b>
        </span>
        <Select
          className="cr-select--bloco"
          valor={f.componente}
          onChange={(componente) => {
            const u = Object.keys(CURRICULO[componente])[0]
            set({ componente, unidade: u, objeto: CURRICULO[componente][u][0], habilidade: undefined })
          }}
          opcoes={COMPONENTES.map((c) => ({ valor: c, texto: c, icone: <BookOpen size={18} color="#15803d" /> }))}
        />
      </div>
      <div className="pl-campo">
        <span>Unidade temática</span>
        <Select className="cr-select--bloco" valor={f.unidade} onChange={(unidade) => set({ unidade, objeto: CURRICULO[f.componente][unidade][0] })} opcoes={unidades.map((u) => ({ valor: u, texto: u }))} />
      </div>
      <div className="pl-campo">
        <span>Objeto de conhecimento</span>
        <Select className="cr-select--bloco" valor={f.objeto} onChange={(objeto) => set({ objeto })} opcoes={objetos.map((o) => ({ valor: o, texto: o }))} />
      </div>
      <div className="pl-campo pl-campo--largo">
        <span>Habilidade (opcional)</span>
        <BuscaLista valor={f.habilidade} opcoes={HABILIDADES[f.componente] ?? []} onChange={(habilidade) => set({ habilidade })} placeholder="Buscar habilidade.." />
      </div>
      <label className="pl-campo">
        <span>
          Data de início <b>*</b>
        </span>
        <span className={`pl-data ${erros.inicio ? 'is-erro' : ''}`}>
          <CalendarDays size={18} />
          <input type="date" min={PERIODO_INICIO} max={PERIODO_FIM} value={f.inicio} onChange={(e) => set({ inicio: e.target.value })} />
        </span>
        {erros.inicio && <small className="cr-erro">{erros.inicio}</small>}
      </label>
      <label className="pl-campo">
        <span>
          Data de término <b>*</b>
        </span>
        <span className={`pl-data ${erros.fim ? 'is-erro' : ''}`}>
          <CalendarDays size={18} />
          <input type="date" min={f.inicio || PERIODO_INICIO} max={PERIODO_FIM} value={f.fim} onChange={(e) => set({ fim: e.target.value })} />
        </span>
        {erros.fim && <small className="cr-erro">{erros.fim}</small>}
      </label>
    </div>
  )
}

/** célula “Aplicação”: resumo + quais turmas recebem */
function Aplicacao({ p, escopo }: { p: Prog; escopo: Escopo }) {
  const ts = turmasDaProg(p, escopo)
  const nomes = ts.map((t) => t.nome)
  const ver = nomes.slice(0, 4).join(', ')
  return (
    <span className="pl-apl" title={ts.map((t) => `${t.nome} · ${nomeRede(t.escola)}`).join('\n')}>
      <strong>{textoAplicacao(p, escopo)}</strong>
      <small>
        Turmas {ver}
        {nomes.length > 4 ? ` +${nomes.length - 4}` : ''}
      </small>
    </span>
  )
}

/**
 * “Aplicar para” em três passos visíveis: anos → escolas → turmas que vão receber.
 * Cada turma aparece como chip e pode ser desmarcada individualmente.
 */
export function AplicarPara({ f, set, escopo, erros }: { f: Prog; set: (p: Partial<Prog>) => void; escopo: Escopo; erros: ErrosProg }) {
  const doEscopo = turmasDoEscopo(escopo)
  const anos = ANOS_ESCOPO.filter((a) => escopo.anos.includes(a) && doEscopo.some((t) => t.ano === a))
  const escolasComTurma = REDE.filter((e) => escopo.escolas.includes(e.id) && doEscopo.some((t) => t.escola === e.id && f.anos.includes(t.ano)))
  const candidatas = turmasCandidatas(f, escopo)
  const excl = f.turmasExcluidas ?? []
  const recebem = candidatas.filter((t) => !excl.includes(t.id))
  const toggle = (lista: string[], v: string) => (lista.includes(v) ? lista.filter((x) => x !== v) : [...lista, v])
  const contaAno = (a: string) => doEscopo.filter((t) => t.ano === a && f.escolas.includes(t.escola)).length
  const todasEsc = escolasComTurma.length > 0 && escolasComTurma.every((e) => f.escolas.includes(e.id))
  return (
    <div className="pl-ap">
      <div className="pl-ap__bloco">
        <span className="pl-ap__rotulo">
          <b>1</b> Anos escolares
        </span>
        <div className="pl-ap__chips">
          {anos.map((a) => {
            const on = f.anos.includes(a)
            return (
              <motion.button key={a} type="button" whileTap={{ scale: 0.94 }} className={`pl-chip ${on ? 'is-on' : ''}`} onClick={() => set({ anos: toggle(f.anos, a) })} aria-pressed={on}>
                {on && <Check size={15} strokeWidth={3} />}
                {a}
                <em>{contaAno(a)}</em>
              </motion.button>
            )
          })}
        </div>
      </div>

      <div className="pl-ap__bloco">
        <span className="pl-ap__rotulo">
          <b>2</b> Escolas
          <small>
            {escolasComTurma.filter((e) => f.escolas.includes(e.id)).length} de {escolasComTurma.length}
          </small>
          {escolasComTurma.length > 1 && (
            <button type="button" className="cr-link pl-ap__todas" onClick={() => set({ escolas: todasEsc ? [] : [...new Set([...f.escolas, ...escolasComTurma.map((e) => e.id)])] })}>
              {todasEsc ? 'Limpar' : 'Selecionar todas'}
            </button>
          )}
        </span>
        <div className="pl-ap__chips pl-ap__chips--rolar">
          {escolasComTurma.length ? (
            escolasComTurma.map((e) => {
              const on = f.escolas.includes(e.id)
              return (
                <motion.button key={e.id} type="button" whileTap={{ scale: 0.94 }} className={`pl-chip pl-chip--escola ${on ? 'is-on' : ''}`} onClick={() => set({ escolas: toggle(f.escolas, e.id) })} aria-pressed={on}>
                  {on && <Check size={15} strokeWidth={3} />}
                  {e.nome}
                </motion.button>
              )
            })
          ) : (
            <span className="pl-ap__vazio">Escolha um ano escolar.</span>
          )}
        </div>
      </div>

      <div className="pl-ap__bloco">
        <span className="pl-ap__rotulo">
          <b>3</b> Turmas que vão receber
          <motion.em key={recebem.length} initial={{ scale: 1.4 }} animate={{ scale: 1 }} className="pl-ap__qtd">
            {recebem.length}
          </motion.em>
          {excl.length > 0 && (
            <button type="button" className="cr-link pl-ap__todas" onClick={() => set({ turmasExcluidas: [] })}>
              Incluir todas
            </button>
          )}
        </span>
        <div className="pl-ap__turmas">
          {candidatas.length ? (
            candidatas.map((t) => {
              const on = !excl.includes(t.id)
              return (
                <button
                  key={t.id}
                  type="button"
                  className={`pl-turmachip ${on ? 'is-on' : ''}`}
                  onClick={() => set({ turmasExcluidas: toggle(excl, t.id) })}
                  title={on ? 'Clique para não enviar a esta turma' : 'Clique para incluir esta turma'}
                >
                  <strong>{t.nome}</strong>
                  <small>{nomeRede(t.escola)}</small>
                  {on ? <X size={14} className="pl-turmachip__x" /> : <Plus size={14} className="pl-turmachip__x" />}
                </button>
              )
            })
          ) : (
            <span className="pl-ap__vazio">As turmas aparecem aqui conforme os anos e as escolas escolhidos.</span>
          )}
        </div>
      </div>
      {(erros.anos || erros.escolas) && <small className="cr-erro">{erros.anos ?? erros.escolas}</small>}
    </div>
  )
}

/** número que “rola” quando muda */
export function Num({ v }: { v: number | string }) {
  return (
    <motion.span key={v} className="pl-num" initial={{ y: '-40%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 26 }}>
      {v}
    </motion.span>
  )
}

export const useDestaque = () => {
  const [d, setD] = useState<string | null>(null)
  const piscar = (id: string) => {
    setD(id)
    window.setTimeout(() => setD(null), 1700)
  }
  return [d, piscar] as const
}

