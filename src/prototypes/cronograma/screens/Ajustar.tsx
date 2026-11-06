import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, AlertTriangle, ArrowLeft, ArrowRight, Building2, CalendarDays, CheckCircle2, Download, ExternalLink, Filter, Search, Users, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { AplicarPara, CamposProg, Etapas4, MesesProg, Num, PlanoCab, useDestaque, validarProg } from '../components/plano'
import { Btn, Modal, Select, TIPO_ICONE } from '../components/ui'
import { COMPONENTES, TIPOS, TIPO_LISTA, type TipoId } from '../data'
import { EDUCADORES_SUGERIDOS, brPlano, curta, nomeRede, novoIdProg, pendenciaDe, periodoProgs, somarMeses, textoAplicacao, turmasDaProg, type Pendencia, type Prog } from '../plano'
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
  const [educador, setEducador] = useState(EDUCADORES_SUGERIDOS[0])
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

  const duplicar = (p: Prog) => {
    const id = novoIdProg()
    const ini = somarMeses(p.inicio, 1)
    const fim = somarMeses(p.fim, 1)
    const cabe = fim <= '2027-05-31'
    setPlano((x) => ({ ...x, progs: [...x.progs, cabe ? { ...p, id, inicio: ini, fim } : { ...p, id }] }))
    piscar(id)
    toast(cabe ? `Duplicada para ${curta(ini)} a ${curta(fim)}.` : 'Programação duplicada.')
  }
  const excluir = (p: Prog) => {
    setPlano((x) => ({ ...x, progs: x.progs.filter((y) => y.id !== p.id) }))
    toast('Programação removida.', 'info', { rotulo: 'Desfazer', fn: () => setPlano((x) => ({ ...x, progs: [...x.progs, p] })) })
  }

  const exportar = () => {
    const linhas = [
      ['Mês', 'Atividade', 'Componente', 'Unidade temática', 'Conteúdo', 'Habilidade', 'Início', 'Término', 'Aplicação', 'Status'].join(';'),
      ...[...pl.progs]
        .sort((a, b) => a.inicio.localeCompare(b.inicio))
        .map((p) => [p.inicio.slice(5, 7), TIPOS[p.tipo].nome, p.componente, p.unidade, p.objeto, p.habilidade ?? '', brPlano(p.inicio), brPlano(p.fim), textoAplicacao(p, e), temPend(p) ? 'Pendência' : 'Válida'].join(';')),
    ]
    const url = URL.createObjectURL(new Blob(['﻿' + linhas.join('\n')], { type: 'text/csv;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'resumo_cronograma_2027.csv'
    a.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    toast('Resumo exportado: resumo_cronograma_2027.csv')
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
        acoes={{ editar: (p) => setEditar({ ...p }), duplicar, excluir }}
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
      <Modal
        aberto={!!vinc}
        onFechar={() => setVinc(null)}
        titulo="Revisar vinculação de educadores"
        largura={600}
        rodape={
          <>
            <Btn variante="contorno" onClick={() => setVinc(null)}>
              Cancelar
            </Btn>
            <Btn
              icone={<CheckCircle2 size={18} />}
              onClick={() => {
                if (!vinc) return
                const alvo = e.autoVinculo ? [vinc.prog.id] : pend.map((p) => p.prog.id)
                setPlano((x) => ({ ...x, resolvidos: [...new Set([...x.resolvidos, ...alvo])] }))
                piscar(vinc.prog.id)
                setVinc(null)
                toast(e.autoVinculo ? `${educador} vinculado(a) a ${vinc.turmas.length} ${vinc.turmas.length === 1 ? 'turma' : 'turmas'}.` : 'Educadores vinculados a todas as programações.')
              }}
            >
              {e.autoVinculo ? 'Vincular educador' : 'Vincular todos automaticamente'}
            </Btn>
          </>
        }
      >
        {vinc && (
          <div className="pl-vinc">
            <p className="cr-texto">
              <strong>
                {TIPOS[vinc.prog.tipo].nome} – {vinc.prog.componente}
              </strong>{' '}
              · {vinc.prog.objeto} · {curta(vinc.prog.inicio)} a {curta(vinc.prog.fim)}
            </p>
            <div className="pl-vinc__turmas">
              {vinc.turmas.slice(0, 12).map((t) => (
                <span key={t.id} className="cr-turma">
                  {t.nome} · {nomeRede(t.escola)}
                </span>
              ))}
              {vinc.turmas.length > 12 && <span className="cr-turma cr-turma--mais">+{vinc.turmas.length - 12}</span>}
            </div>
            {e.autoVinculo ? (
              <div className="cr-campo">
                <span>Educador(a) de {vinc.prog.componente}</span>
                <Select className="cr-select--bloco" valor={educador} onChange={setEducador} opcoes={EDUCADORES_SUGERIDOS.map((x, i) => ({ valor: x, texto: i === 0 ? `${x} — sugerido (leciona ${vinc.prog.componente} na rede)` : x }))} />
              </div>
            ) : (
              <p className="cr-texto cr-texto--suave">Usaremos os vínculos existentes na rede (turma, componente e carga horária) para todas as programações.</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
