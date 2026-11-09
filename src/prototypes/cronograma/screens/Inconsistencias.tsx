import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronLeft, ChevronRight, PartyPopper, RotateCcw } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Btn, Checkbox, Etapas, GravidadeIcone, Modal, Select, TipoBadge } from '../components/ui'
import { INCONSISTENCIAS, TIPOS, TIPO_LISTA, br, type Gravidade, type Inconsistencia, type TipoId } from '../data'
import { TOTAL_OCORRENCIAS, nomeEscola, ocorrenciasResolvidas, useCron, type Modo, type Resolucao } from '../store'

type Filtro = 'todas' | Gravidade

const RESUMO: { g: Gravidade; titulo: (n: number) => string; desc: string }[] = [
  { g: 'sugestao', titulo: (n) => `${n} Sugestões de correção`, desc: 'Ajustes de escrita, nomenclatura ou formatação' },
  { g: 'validar', titulo: (n) => `${n} Para validar`, desc: 'Mais de uma correspondência encontrada' },
  { g: 'obrigatoria', titulo: (n) => `${n} Obrigatórias`, desc: 'Informações que precisam ser corrigidas' },
]

const contar = (g: Gravidade) => INCONSISTENCIAS.filter((i) => i.gravidade === g).reduce((n, i) => n + i.ocorrencias.length, 0)

export default function Inconsistencias() {
  const { s, resolver, resolverPendentes, ir, toast } = useCron()
  const w = s.wizard!
  const [filtro, setFiltro] = useState<Filtro>('todas')
  const [sel, setSel] = useState(INCONSISTENCIAS[0].id)
  const [pendModal, setPendModal] = useState(false)
  const [alerta, setAlerta] = useState(0)
  const resolvidas = ocorrenciasResolvidas(w)
  const tudo = resolvidas === TOTAL_OCORRENCIAS
  const lista = INCONSISTENCIAS.filter((i) => filtro === 'todas' || i.gravidade === filtro)
  const atual = INCONSISTENCIAS.find((i) => i.id === sel)!

  const proxima = (depoisDe: string) => {
    const idx = INCONSISTENCIAS.findIndex((i) => i.id === depoisDe)
    const ordem = [...INCONSISTENCIAS.slice(idx + 1), ...INCONSISTENCIAS.slice(0, idx)]
    const n = ordem.find((i) => !w.resolucoes[i.id] && i.id !== depoisDe)
    if (n) window.setTimeout(() => setSel(n.id), 420)
  }

  const aplicar = (inc: Inconsistencia, r: Resolucao) => {
    resolver(inc.id, r)
    const n = inc.ocorrencias.length
    toast(r.modo === 'manter' ? `Valor da planilha mantido (${n} ${n > 1 ? 'ocorrências' : 'ocorrência'}).` : `Ajuste aplicado em ${n} ${n > 1 ? 'ocorrências' : 'ocorrência'}.`)
    proxima(inc.id)
  }

  const continuar = () => {
    const obrig = INCONSISTENCIAS.filter((i) => i.gravidade === 'obrigatoria' && !w.resolucoes[i.id])
    if (obrig.length) {
      setSel(obrig[0].id)
      setFiltro('todas')
      setAlerta((a) => a + 1)
      toast(`Corrija ${obrig.length > 1 ? `as ${obrig.length} inconsistências obrigatórias` : 'a inconsistência obrigatória'} para continuar.`, 'erro')
      return
    }
    if (!tudo) {
      setPendModal(true)
      return
    }
    ir({ id: 'revisar', escola: w.escola })
  }

  return (
    <div className="cr-wizard cr-wizard--largo">
      <Etapas atual={2} progresso={0.15 + (resolvidas / TOTAL_OCORRENCIAS) * 0.35} />

      <header className="cr-titulo">
        <h1>Revise as informações identificadas</h1>
        <p>
          Encontramos {TOTAL_OCORRENCIAS} inconsistências no arquivo. Analise as sugestões, aplique os ajustes e, quando estiver tudo certo, avance para revisar o cronograma.
        </p>
      </header>

      <div className="cr-resumo">
        {RESUMO.map((r, i) => {
          const total = contar(r.g)
          const feitas = INCONSISTENCIAS.filter((x) => x.gravidade === r.g && w.resolucoes[x.id]).reduce((n, x) => n + x.ocorrencias.length, 0)
          return (
            <motion.button
              key={r.g}
              className={`cr-resumo__card cr-resumo__card--${r.g} ${filtro === r.g ? 'is-on' : ''}`}
              onClick={() => setFiltro((f) => (f === r.g ? 'todas' : r.g))}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -2 }}
            >
              <GravidadeIcone g={r.g} tamanho={48} />
              <span>
                <strong>{r.titulo(total)}</strong>
                <small>{r.desc}</small>
              </span>
              {feitas > 0 && (
                <motion.em key={feitas} initial={{ scale: 0.6 }} animate={{ scale: 1 }} className={feitas === total ? 'is-ok' : ''}>
                  {feitas === total ? <Check size={14} strokeWidth={3} /> : `${feitas}/${total}`}
                </motion.em>
              )}
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence>
        {tudo && (
          <motion.div className="cr-aviso cr-aviso--ok" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <PartyPopper size={22} />
            <span>
              <strong>Tudo certo!</strong> As {TOTAL_OCORRENCIAS} inconsistências foram resolvidas. Agora é só revisar o cronograma.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="cr-incons">
        <section className="cr-cartao cr-incons__lista">
          <header>
            <h2>Inconsistências encontradas ({lista.reduce((n, i) => n + i.ocorrencias.length, 0)})</h2>
            <Select
              rotulo="Filtrar por:"
              valor={filtro}
              onChange={setFiltro}
              opcoes={[
                { valor: 'todas', texto: 'Todas' },
                { valor: 'sugestao', texto: 'Sugestões' },
                { valor: 'validar', texto: 'Para validar' },
                { valor: 'obrigatoria', texto: 'Obrigatórias' },
              ]}
            />
          </header>
          <ul>
            <AnimatePresence initial={false}>
              {lista.map((inc) => {
                const feito = !!w.resolucoes[inc.id]
                const n = inc.ocorrencias.length
                return (
                  <motion.li
                    key={inc.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`${sel === inc.id ? 'is-sel' : ''} ${feito ? 'is-feito' : ''}`}
                    onClick={() => setSel(inc.id)}
                  >
                    <Checkbox
                      checked={feito}
                      rotulo={feito ? 'Desfazer ajuste' : 'Aceitar sugestão recomendada'}
                      onChange={(v) => (v ? aplicar(inc, { modo: 'aceitar', valores: [] }) : resolver(inc.id, null))}
                    />
                    <GravidadeIcone g={feito ? 'sugestao' : inc.gravidade} tamanho={40} />
                    <span className="cr-incons__txt">
                      <strong>{inc.titulo}</strong>
                      <small>{inc.exemplo}</small>
                    </span>
                    {feito ? (
                      <motion.span className="cr-pilula cr-pilula--ok" initial={{ scale: 0.7 }} animate={{ scale: 1 }}>
                        <Check size={14} strokeWidth={3} /> Resolvido
                      </motion.span>
                    ) : (
                      <span className="cr-pilula">
                        {n} {n > 1 ? 'ocorrências' : 'ocorrência'}
                      </span>
                    )}
                    <ChevronRight size={20} className="cr-incons__seta" />
                  </motion.li>
                )
              })}
            </AnimatePresence>
          </ul>
        </section>

        <AnimatePresence mode="wait">
          <motion.section
            key={atual.id + alerta}
            className={`cr-cartao cr-detalhe ${alerta && atual.gravidade === 'obrigatoria' && !w.resolucoes[atual.id] ? 'is-alerta' : ''}`}
            initial={{ opacity: 0, x: 20 }}
            animate={alerta && atual.gravidade === 'obrigatoria' && !w.resolucoes[atual.id] ? { opacity: 1, x: [0, -8, 8, -5, 5, 0] } : { opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
          >
            <Detalhe inc={atual} resolucao={w.resolucoes[atual.id]} onAplicar={(r) => aplicar(atual, r)} onDesfazer={() => resolver(atual.id, null)} />
          </motion.section>
        </AnimatePresence>
      </div>

      <footer className="cr-rodape">
        <span className="cr-rodape__status">
          <span className="cr-mini">
            <motion.i animate={{ width: `${(resolvidas / TOTAL_OCORRENCIAS) * 100}%` }} />
          </span>
          <motion.b key={resolvidas} initial={{ scale: 1.3 }} animate={{ scale: 1 }}>
            {resolvidas}
          </motion.b>
          &nbsp;de {TOTAL_OCORRENCIAS} inconsistências resolvidas
        </span>
        <div className="cr-rodape__btns">
          <Btn variante="contorno" onClick={() => ir({ id: 'importar', escola: w.escola }, -1)}>
            Voltar
          </Btn>
          <Btn className={tudo ? 'cr-btn--brilho' : ''} iconeDir={<ChevronRight size={20} />} onClick={continuar}>
            Continuar para revisar o cronograma
          </Btn>
        </div>
      </footer>

      <Modal
        aberto={pendModal}
        onFechar={() => setPendModal(false)}
        titulo="Ainda há sugestões sem ajuste"
        largura={520}
        rodape={
          <>
            <Btn variante="contorno" onClick={() => setPendModal(false)}>
              Revisar agora
            </Btn>
            <Btn
              onClick={() => {
                resolverPendentes()
                setPendModal(false)
                toast('Sugestões recomendadas aplicadas.')
                ir({ id: 'revisar', escola: w.escola })
              }}
            >
              Aplicar recomendadas e continuar
            </Btn>
          </>
        }
      >
        <p className="cr-texto">
          Faltam {TOTAL_OCORRENCIAS - resolvidas} ocorrências. Podemos aplicar automaticamente as correções recomendadas para {w.escolas.length > 1 ? `as ${w.escolas.length} escolas da planilha` : `a ${nomeEscola(s.escolas, w.escola)}`} — você ainda poderá editar tudo
          na próxima tela.
        </p>
      </Modal>
    </div>
  )
}

/* ---------------- painel de detalhe ---------------- */
function Detalhe({ inc, resolucao, onAplicar, onDesfazer }: { inc: Inconsistencia; resolucao?: Resolucao; onAplicar: (r: Resolucao) => void; onDesfazer: () => void }) {
  const n = inc.ocorrencias.length
  const [idx, setIdx] = useState(0)
  const [modo, setModo] = useState<Modo>(resolucao?.modo ?? 'aceitar')
  const [valores, setValores] = useState<string[]>(resolucao?.valores ?? [])
  const [ini, setIni] = useState('2025-01-06')
  const [fim, setFim] = useState('2025-01-24')
  const oc = inc.ocorrencias[idx]
  const ehTipo = inc.id === 'obrigatorio'
  const ehData = inc.id === 'data'
  const podeManter = inc.gravidade !== 'obrigatoria'

  useEffect(() => {
    setIdx(0)
    setModo(resolucao?.modo ?? 'aceitar')
    setValores(resolucao?.valores ?? [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inc.id])

  const nomeValor = (v: string) => (ehTipo ? TIPOS[v as TipoId]?.nome ?? v : v)
  const opcoesOutra = useMemo(() => (ehTipo ? TIPO_LISTA.map((t) => ({ valor: t as string, texto: TIPOS[t].nome })) : (oc.alternativas ?? []).map((a) => ({ valor: a, texto: a }))), [ehTipo, oc])
  const valorOutra = valores[idx] ?? (ehTipo ? oc.sugerido : oc.alternativas?.[0] ?? '')
  const dataInvalida = ehData && modo === 'outra' && (!ini || !fim || fim < ini)

  const rotulos: Record<Modo, string> = ehTipo
    ? { aceitar: `Usar a sugestão: ${TIPOS[oc.sugerido as TipoId].nome}`, outra: 'Escolher outro tipo de atividade', manter: '' }
    : ehData
      ? { aceitar: `Inverter as datas (${oc.sugerido})`, outra: 'Informar outro período', manter: '' }
      : { aceitar: n > 1 ? `Aceitar ajuste e aplicar em todas as ocorrências (${n})` : 'Aceitar ajuste', outra: 'Selecionar outra correspondência', manter: 'Manter o valor da planilha' }

  const aplicar = () => {
    if (ehData && modo === 'outra') {
      onAplicar({ modo: 'outra', valores: [`${br(ini)} a ${br(fim)}`] })
      return
    }
    const v = [...valores]
    if (modo === 'outra') inc.ocorrencias.forEach((o, i) => (v[i] = v[i] ?? (ehTipo ? o.sugerido : o.alternativas?.[0] ?? o.sugerido)))
    onAplicar({ modo, valores: v })
  }

  return (
    <>
      <header className="cr-detalhe__topo">
        <GravidadeIcone g={inc.gravidade} tamanho={48} />
        <div>
          <h3>{inc.titulo}</h3>
          <p>{inc.detalhe}</p>
        </div>
        {n > 1 && (
          <div className="cr-pager">
            <button className="cr-iconbtn" disabled={idx === 0} onClick={() => setIdx((i) => i - 1)} aria-label="Ocorrência anterior">
              <ChevronLeft size={18} />
            </button>
            <span>
              {idx + 1} de {n}
            </span>
            <button className="cr-iconbtn" disabled={idx === n - 1} onClick={() => setIdx((i) => i + 1)} aria-label="Próxima ocorrência">
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </header>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={idx} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.18 }}>
          <label className="cr-campo">
            <span>Informação na planilha</span>
            <input readOnly value={oc.original || '(vazio)'} className={!oc.original ? 'is-vazio' : ''} />
          </label>
          <span className="cr-campo__rotulo">{inc.rotuloSugestao}</span>
          <div className={`cr-sugestao ${modo === 'aceitar' ? 'is-on' : ''}`}>
            <span className="cr-sugestao__ok">
              <Check size={18} strokeWidth={3} />
            </span>
            <div>
              <strong>
                {ehTipo ? <TipoBadge tipo={oc.sugerido as TipoId} /> : nomeValor(oc.sugerido)}
                <em>Recomendado</em>
              </strong>
              <small>{inc.descricaoSugestao}</small>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="cr-radios" role="radiogroup">
        {(['aceitar', 'outra', 'manter'] as Modo[])
          .filter((m) => m !== 'manter' || podeManter)
          .map((m) => (
            <label key={m} className={`cr-radio ${modo === m ? 'is-on' : ''}`}>
              <input type="radio" name={`modo-${inc.id}`} checked={modo === m} onChange={() => setModo(m)} />
              <span className="cr-radio__bola" />
              {rotulos[m]}
            </label>
          ))}
      </div>

      <AnimatePresence initial={false}>
        {modo === 'outra' && (
          <motion.div className="cr-outra" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            {ehData ? (
              <div className="cr-datas">
                <label className="cr-campo">
                  <span>Início</span>
                  <input type="date" value={ini} onChange={(e) => setIni(e.target.value)} />
                </label>
                <label className="cr-campo">
                  <span>Término</span>
                  <input type="date" value={fim} onChange={(e) => setFim(e.target.value)} className={dataInvalida ? 'is-erro' : ''} />
                </label>
                {dataInvalida && <p className="cr-erro">O término precisa ser depois do início.</p>}
              </div>
            ) : (
              <Select
                className="cr-select--bloco"
                valor={valorOutra}
                onChange={(v) => setValores((vs) => Object.assign([...vs], { [idx]: v }))}
                opcoes={opcoesOutra}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="cr-detalhe__btns">
        {resolucao ? (
          <>
            <span className="cr-detalhe__feito">
              <Check size={16} strokeWidth={3} /> Ajuste aplicado
            </span>
            <Btn variante="contorno" icone={<RotateCcw size={16} />} onClick={onDesfazer}>
              Desfazer
            </Btn>
            <Btn disabled={dataInvalida} onClick={aplicar}>
              Atualizar ajuste
            </Btn>
          </>
        ) : (
          <>
            <Btn
              variante="contorno"
              onClick={() => {
                setModo('aceitar')
                setValores([])
              }}
            >
              Cancelar
            </Btn>
            <Btn disabled={dataInvalida} onClick={aplicar}>
              Aplicar ajuste
            </Btn>
          </>
        )}
      </footer>
    </>
  )
}
