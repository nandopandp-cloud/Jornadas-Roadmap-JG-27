import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, AlertTriangle, ArrowLeft, ArrowRight, Building2, CalendarDays, CheckCircle2, Download, ExternalLink, Filter, Search, Users, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { AplicarPara, CamposProg, DuplicarModal, Etapas4, MesesProg, Num, PlanoCab, useDestaque, validarProg } from '../components/plano'
import { Btn, Modal, Select, TIPO_ICONE } from '../components/ui'
import { COMPONENTES, TIPOS, TIPO_LISTA, type TipoId } from '../data'
import { chaveVinculo, educadoresDaEscola, linhasExportacao, paraCSV, curta, nomeMesPlano, nomeRede, pendenciaDe, periodoProgs, textoAplicacao, turmasDaProg, type Escopo, type Pendencia, type Prog } from '../plano'
import { useCron } from '../store'

type Aba = 'todas' | 'pendencias' | 'ajustadas'

/** Etapa 3 — Revisar e ajustar */
export default function Ajustar() {
  const { s, setPlano, ir, toast } = useCron()
  const pl = s.plano!
  const e = pl.escopo
  const [aba, setAba] = useState<Aba>('todas')
  const [busca, setBusca] = useState('')
  const [filtros, setFiltros] = useState(false)
  const [fTipo, setFTipo] = useState<'todos' | TipoId>('todos')
  const [fComp, setFComp] = useState('todos')
  const [editar, setEditar] = useState<Prog | null>(null)
  const [vinc, setVinc] = useState<Pendencia | null>(null)
  const [alerta, setAlerta] = useState(0)
  const [destaque, piscar] = useDestaque()
  const filtrosRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!filtros) return
    const fora = (ev: MouseEvent) => !filtrosRef.current?.contains(ev.target as Node) && setFiltros(false)
    document.addEventListener('mousedown', fora)
    return () => document.removeEventListener('mousedown', fora)
  }, [filtros])

  const pend = useMemo(() => pl.progs.map((p) => pendenciaDe(p, e, pl.resolvidos)).filter(Boolean) as Pendencia[], [pl.progs, e, pl.resolvidos])
  const temPend = (p: Prog) => pend.some((x) => x.prog.id === p.id)
  const turmasTotal = new Set(pl.progs.flatMap((p) => turmasDaProg(p, e).map((t) => t.id))).size
  const escolasTotal = new Set(pl.progs.flatMap((p) => turmasDaProg(p, e).map((t) => t.escola))).size
  const per = periodoProgs(pl.progs)
  const q = busca.trim().toLowerCase()
  const lista = pl.progs.filter(
    (p) =>
      (aba === 'todas' || (aba === 'pendencias' ? temPend(p) : !temPend(p))) &&
      (fTipo === 'todos' || p.tipo === fTipo) &&
      (fComp === 'todos' || p.componente === fComp) &&
      (!q || [TIPOS[p.tipo].nome, p.componente, p.unidade, p.objeto, p.habilidade ?? ''].some((x) => x.toLowerCase().includes(q))),
  )
  const nFiltros = (fTipo !== 'todos' ? 1 : 0) + (fComp !== 'todos' ? 1 : 0)

  const [dup, setDup] = useState<string | null>(null)
  const duplicar = (nova: Prog, mesNovo: boolean) => {
    setPlano((x) => ({ ...x, progs: [...x.progs, nova] }))
    setDup(null)
    piscar(nova.id)
    const mes = nomeMesPlano(nova.inicio.slice(0, 7)).split(' (')[0]
    toast(mesNovo ? `${mes} criado com a programação duplicada.` : `Duplicada para ${curta(nova.inicio)} a ${curta(nova.fim)}.`)
  }
  const excluir = (p: Prog) => {
    setPlano((x) => ({ ...x, progs: x.progs.filter((y) => y.id !== p.id) }))
    toast('Programação removida.', 'info', { rotulo: 'Desfazer', fn: () => setPlano((x) => ({ ...x, progs: [...x.progs, p] })) })
  }

  /** exporta no formato da planilha modelo: uma linha por turma, com rede, escola, educador e currículo */
  const exportar = () => {
    const tabela = linhasExportacao(pl.progs, e, pl.resolvidos, (p) => (temPend(p) ? 'Pendência' : 'Válida'), pl.vinculos)
    const url = URL.createObjectURL(new Blob([paraCSV(tabela)], { type: 'text/csv;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'cronograma_de_uso_2027.csv'
    a.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    toast(`Planilha exportada: ${tabela.length - 1} linhas (uma por turma) em cronograma_de_uso_2027.csv`)
  }

  const avancar = () => {
    if (!pl.progs.length) return toast('O cronograma está vazio.', 'erro')
    if (pend.length) {
      setAlerta((a) => a + 1)
      setAba('todas')
      return toast(`Resolva ${pend.length === 1 ? 'a pendência' : `as ${pend.length} pendências`} antes de publicar.`, 'erro')
    }
    ir({ id: 'finalizar' })
  }

  const cards = [
    { I: CalendarDays, v: pl.progs.length, t: pl.progs.length === 1 ? 'programação' : 'programações', s: 'Criadas nesta versão' },
    { I: Building2, v: escolasTotal, t: escolasTotal === 1 ? 'escola' : 'escolas', s: 'Serão impactadas' },
    { I: Users, v: turmasTotal, t: 'turmas', s: 'Receberão as programações' },
    { I: CalendarDays, v: per ? `${curta(per.inicio)} a ${curta(per.fim)}` : '—', t: '', s: 'Período do cronograma' },
  ]

  return (
    <div className="pl">
      <PlanoCab titulo="Revisar e ajustar" subtitulo="Confira todas as programações criadas, identifique possíveis inconsistências e faça os ajustes necessários antes de publicar." img="cab-prancheta" />
      <Etapas4 atual={3} />

      <div className="pl-stats">
        {cards.map(({ I, v, t, s: sub }, i) => (
          <motion.div key={sub} className="cr-cartao pl-stat" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <span className="pl-stat__ic">
              <I size={28} strokeWidth={1.7} />
            </span>
            <span>
              <strong>
                <Num v={v} /> {t}
              </strong>
              <small>{sub}</small>
            </span>
          </motion.div>
        ))}
      </div>

      <div className="pl-barra">
        <div className="pl-abas" role="tablist">
          {(
            [
              ['todas', `Todas as programações (${pl.progs.length})`, null],
              ['pendencias', `Com pendências (${pend.length})`, <AlertTriangle key="a" size={20} color="#e08a12" />],
              ['ajustadas', `Ajustadas (${pl.progs.length - pend.length})`, <CheckCircle2 key="c" size={20} color="#1f8a44" />],
            ] as const
          ).map(([id, t, ic]) => (
            <button key={id} role="tab" aria-selected={aba === id} className={aba === id ? 'is-on' : ''} onClick={() => setAba(id)}>
              {ic}
              {t}
              {aba === id && <motion.span layoutId="pl-aba" className="pl-abas__linha" />}
            </button>
          ))}
        </div>
        <label className="cr-busca pl-busca-rev">
          <Search size={20} />
          <input value={busca} onChange={(ev) => setBusca(ev.target.value)} placeholder="Buscar por atividade, componente ou conteúdo" />
          {busca && (
            <button onClick={() => setBusca('')} aria-label="Limpar busca">
              <X size={16} />
            </button>
          )}
        </label>
        <div className="pl-filtros" ref={filtrosRef}>
          <button className={`pl-filtros__btn ${nFiltros ? 'is-on' : ''}`} onClick={() => setFiltros((f) => !f)}>
            <Filter size={20} /> Filtros {nFiltros > 0 && <em>{nFiltros}</em>}
          </button>
          <AnimatePresence>
            {filtros && (
              <motion.div className="pl-filtros__pop" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                <div className="cr-campo">
                  <span>Tipo de atividade</span>
                  <Select className="cr-select--bloco" valor={fTipo} onChange={setFTipo} opcoes={[{ valor: 'todos' as const, texto: 'Todos' }, ...TIPO_LISTA.map((t) => ({ valor: t, texto: TIPOS[t].nome }))]} />
                </div>
                <div className="cr-campo">
                  <span>Componente</span>
                  <Select className="cr-select--bloco" valor={fComp} onChange={setFComp} opcoes={[{ valor: 'todos', texto: 'Todos' }, ...COMPONENTES.map((c) => ({ valor: c, texto: c }))]} />
                </div>
                <button
                  className="cr-link"
                  onClick={() => {
                    setFTipo('todos')
                    setFComp('todos')
                  }}
                >
                  Limpar filtros
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <MesesProg
        progs={lista}
        escopo={e}
        destaque={destaque}
        status={(p) => (temPend(p) ? 'pendencia' : 'valida')}
        acoes={{ editar: (p) => setEditar({ ...p }), duplicar: (p) => setDup(p.id), excluir }}
        vazio={q || nFiltros || aba !== 'todas' ? 'Nenhuma programação com esses filtros neste mês.' : undefined}
      />

      <AnimatePresence mode="popLayout">
        {pend.length > 0 ? (
          <motion.section
            key={`pend-${alerta}`}
            className="pl-pend"
            initial={{ opacity: 0, y: 12 }}
            animate={alerta ? { opacity: 1, y: 0, x: [0, -8, 8, -5, 5, 0] } : { opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4 }}
          >
            <header>
              <span className="pl-pend__ic">
                <AlertCircle size={30} />
              </span>
              <div>
                <h3>Pendência{pend.length > 1 ? 's' : ''} encontrada{pend.length > 1 ? 's' : ''} ({pend.length})</h3>
                <p>Ajuste {pend.length > 1 ? 'os itens abaixo' : 'o item abaixo'} para garantir a publicação do cronograma.</p>
              </div>
            </header>
            {pend.map((pd) => {
              const I = TIPO_ICONE[pd.prog.tipo]
              const escolas = [...new Set(pd.turmas.map((t) => nomeRede(t.escola)))]
              return (
                <motion.div key={pd.prog.id} layout className="pl-pend__item">
                  <span className="pl-pend__tipo">
                    <span style={{ background: TIPOS[pd.prog.tipo].fundo, color: TIPOS[pd.prog.tipo].cor }}>
                      <I size={20} fill="currentColor" fillOpacity={0.25} />
                    </span>
                    {TIPOS[pd.prog.tipo].nome} – {pd.prog.componente}
                  </span>
                  <span className="pl-pend__motivo">
                    <AlertTriangle size={18} />
                    <span>
                      {pd.motivo}
                      <small>
                        {pd.turmas.length} {pd.turmas.length === 1 ? 'turma' : 'turmas'} ({escolas.length > 2 ? `${escolas.length} escolas` : escolas.join(', ')})
                      </small>
                    </span>
                  </span>
                  <Btn variante="contorno" pequeno icone={<ExternalLink size={16} />} onClick={() => setVinc(pd)}>
                    Revisar vinculação
                  </Btn>
                </motion.div>
              )
            })}
          </motion.section>
        ) : (
          pl.progs.length > 0 && (
            <motion.section key="ok" className="pl-pend pl-pend--ok" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
              <header>
                <span className="pl-pend__ic">
                  <CheckCircle2 size={30} />
                </span>
                <div>
                  <h3>Tudo certo!</h3>
                  <p>Todas as programações estão válidas e prontas para publicação.</p>
                </div>
              </header>
            </motion.section>
          )
        )}
      </AnimatePresence>

      <footer className="pl-rodape pl-rodape--linha">
        <Btn variante="contorno" icone={<ArrowLeft size={20} />} onClick={() => ir({ id: 'configurar' }, -1)}>
          Voltar
        </Btn>
        <div className="cr-rodape__btns">
          <Btn variante="contorno" icone={<Download size={20} />} onClick={exportar}>
            Exportar resumo (CSV)
          </Btn>
          <Btn icone={<ArrowRight size={20} />} className={pend.length ? '' : 'cr-btn--brilho'} onClick={avancar}>
            Avançar para publicação
          </Btn>
        </div>
      </footer>

      <DuplicarModal aberto={!!dup} inicial={dup} progs={pl.progs} escopo={e} onFechar={() => setDup(null)} onDuplicar={duplicar} />

      {/* editar programação */}
      <Modal
        aberto={!!editar}
        onFechar={() => setEditar(null)}
        titulo="Editar programação"
        largura={980}
        rodape={
          <>
            <Btn variante="contorno" onClick={() => setEditar(null)}>
              Cancelar
            </Btn>
            <Btn
              onClick={() => {
                if (!editar) return
                const errs = validarProg(editar)
                if (Object.keys(errs).length) return toast(Object.values(errs)[0]!, 'erro')
                setPlano((x) => ({ ...x, progs: x.progs.map((y) => (y.id === editar.id ? editar : y)) }))
                piscar(editar.id)
                setEditar(null)
                toast('Programação atualizada.')
              }}
            >
              Salvar alterações
            </Btn>
          </>
        }
      >
        {editar && (
          <div className="pl-editar">
            <CamposProg f={editar} set={(p) => setEditar((x) => (x ? { ...x, ...p } : x))} erros={validarProg(editar)} />
            <div>
              <h4 className="pl-editar__sub">Aplicar para</h4>
              <AplicarPara f={editar} set={(p) => setEditar((x) => (x ? { ...x, ...p } : x))} escopo={e} erros={validarProg(editar)} />
              <p className="pl-editar__res">
                <Users size={18} /> {textoAplicacao(editar, e)}
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* revisar vinculação de educador */}
      <VinculoModal
        pend={vinc}
        escopo={e}
        totalPend={pend.length}
        onFechar={() => setVinc(null)}
        onAuto={() => {
          if (!vinc) return
          const alvo = e.autoVinculo ? [vinc.prog.id] : pend.map((p) => p.prog.id)
          setPlano((x) => ({ ...x, resolvidos: [...new Set([...x.resolvidos, ...alvo])] }))
          piscar(vinc.prog.id)
          setVinc(null)
          toast(alvo.length > 1 ? `Educadores vinculados automaticamente em ${alvo.length} programações.` : 'Educadores vinculados automaticamente.')
        }}
        onManual={(escolhas) => {
          if (!vinc) return
          setPlano((x) => ({ ...x, vinculos: { ...(x.vinculos ?? {}), ...escolhas }, resolvidos: [...new Set([...x.resolvidos, vinc.prog.id])] }))
          piscar(vinc.prog.id)
          setVinc(null)
          toast(`Educadores definidos para ${vinc.turmas.length} ${vinc.turmas.length === 1 ? 'turma' : 'turmas'}.`)
        }}
      />
    </div>
  )
}

/** vincular educadores: automático (vínculos da rede) ou escolha manual por escola e ano */
function VinculoModal({
  pend,
  escopo,
  totalPend,
  onFechar,
  onAuto,
  onManual,
}: {
  pend: Pendencia | null
  escopo: Escopo
  totalPend: number
  onFechar: () => void
  onAuto: () => void
  onManual: (escolhas: Record<string, string>) => void
}) {
  const [modo, setModo] = useState<'auto' | 'manual'>('auto')
  const [escolhas, setEscolhas] = useState<Record<string, string>>({})
  // grupos escola × ano das turmas pendentes
  const grupos = useMemo(() => {
    if (!pend) return []
    const m = new Map<string, { escola: string; ano: string; turmas: string[] }>()
    for (const t of pend.turmas) {
      const k = chaveVinculo(pend.prog.id, t.escola, t.ano)
      const g = m.get(k) ?? { escola: t.escola, ano: t.ano, turmas: [] }
      g.turmas.push(t.nome)
      m.set(k, g)
    }
    return [...m.entries()].map(([k, g]) => ({ k, ...g, opcoes: educadoresDaEscola(g.escola, g.ano, pend.prog.componente) }))
  }, [pend])
  useEffect(() => {
    if (!pend) return
    setModo('auto')
    setEscolhas({})
  }, [pend])
  const faltam = grupos.filter((g) => !escolhas[g.k]).length

  return (
    <Modal
      aberto={!!pend}
      onFechar={onFechar}
      titulo="Revisar vinculação de educadores"
      largura={680}
      rodape={
        <>
          <Btn variante="contorno" onClick={onFechar}>
            Cancelar
          </Btn>
          {modo === 'auto' ? (
            <Btn icone={<CheckCircle2 size={18} />} onClick={onAuto}>
              {!escopo.autoVinculo && totalPend > 1 ? `Vincular automaticamente (${totalPend} programações)` : 'Vincular automaticamente'}
            </Btn>
          ) : (
            <Btn icone={<CheckCircle2 size={18} />} disabled={faltam > 0} onClick={() => onManual(escolhas)}>
              {faltam > 0 ? `Escolha ${faltam} educador${faltam > 1 ? 'es' : ''}` : 'Salvar vínculos'}
            </Btn>
          )}
        </>
      }
    >
      {pend && (
        <div className="pl-vinc">
          <p className="cr-texto">
            <strong>
              {TIPOS[pend.prog.tipo].nome} – {pend.prog.componente}
            </strong>{' '}
            · {pend.prog.objeto} · {curta(pend.prog.inicio)} a {curta(pend.prog.fim)} · {pend.turmas.length} {pend.turmas.length === 1 ? 'turma' : 'turmas'}
          </p>
          <div className="pl-vinc__modos" role="radiogroup">
            {(
              [
                ['auto', 'Vincular automaticamente', 'Usa os vínculos existentes na rede (turma, componente e carga horária).'],
                ['manual', 'Escolher educadores', 'Você seleciona o(a) educador(a) de cada escola e ano escolar.'],
              ] as const
            ).map(([id, t, d]) => (
              <label key={id} className={`pl-vinc__modo ${modo === id ? 'is-on' : ''}`}>
                <input type="radio" name="vinc-modo" checked={modo === id} onChange={() => setModo(id)} />
                <span className="pl-radio__bola">{modo === id && <i />}</span>
                <span>
                  <strong>{t}</strong>
                  <small>{d}</small>
                </span>
              </label>
            ))}
          </div>
          {modo === 'manual' && (
            <motion.div className="pl-vinc__grupos" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <div className="pl-vinc__cab">
                <span>Escola e ano escolar</span>
                <span>Educador(a) de {pend.prog.componente}</span>
              </div>
              {grupos.map((g) => (
                <div key={g.k} className={`pl-vinc__linha ${escolhas[g.k] ? 'is-ok' : ''}`}>
                  <span className="pl-vinc__onde">
                    <strong>{nomeRede(g.escola)}</strong>
                    <small>
                      {g.ano} · {g.turmas.length} {g.turmas.length === 1 ? 'turma' : 'turmas'} ({g.turmas.slice(0, 3).join(', ')}
                      {g.turmas.length > 3 ? ` +${g.turmas.length - 3}` : ''})
                    </small>
                  </span>
                  <Select
                    className="cr-select--bloco"
                    valor={escolhas[g.k] ?? ''}
                    placeholder="Selecione o(a) educador(a)"
                    onChange={(v) => setEscolhas((x) => ({ ...x, [g.k]: v }))}
                    opcoes={g.opcoes.map((n, i) => ({ valor: n, texto: i === 0 ? `${n} — sugerido` : n }))}
                  />
                </div>
              ))}
              {grupos.length > 1 && (
                <button
                  type="button"
                  className="cr-link"
                  onClick={() => setEscolhas(Object.fromEntries(grupos.map((g) => [g.k, escolhas[g.k] ?? g.opcoes[0]])))}
                >
                  Preencher as vazias com os sugeridos
                </button>
              )}
            </motion.div>
          )}
        </div>
      )}
    </Modal>
  )
}
