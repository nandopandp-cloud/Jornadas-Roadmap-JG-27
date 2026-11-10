import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, ChevronDown, CircleAlert, PencilLine } from 'lucide-react'
import { useRef, useState } from 'react'
import { Btn, Etiqueta } from '../components/ui'
import { BLOCO, BLOCOS, ESCALA, HABILIDADES, ITENS, N_ITENS, contar, itensDo, respondido, type Bloco, type Item, type Resposta } from '../instrumento'
import { faltando } from '../motor'
import { useTv } from '../store'

/** Revisão antes de concluir (PRD §5.4): mostra o que falta e permite editar qualquer resposta */
export default function Revisao() {
  const { atual, ir, setPos } = useTv()
  const [abertos, setAbertos] = useState<Bloco[]>([])
  const [tentou, setTentou] = useState(false)
  const alerta = useRef<HTMLDivElement>(null)
  if (!atual) return null
  const r = atual.respostas
  const falta = faltando(r)

  const editar = (i: Item) => {
    setPos(ITENS.indexOf(i))
    ir({ id: 'questionario' }, -1)
  }
  const concluir = () => {
    if (falta.length) {
      setTentou(true)
      setAbertos((a) => [...new Set([...a, ...falta.map((f) => f.bloco)])])
      alerta.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    ir({ id: 'processando' })
  }

  return (
    <div className="tv-revisao">
      <div className="tv-quest__topo">
        <button className="tv-voltar" onClick={() => ir({ id: 'questionario' }, -1)}>
          <ArrowLeft size={20} /> Voltar ao teste
        </button>
      </div>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
        <Etiqueta>Quase lá</Etiqueta>
        <h1 className="tv-h1">Revise suas respostas</h1>
        <p className="tv-lead">
          Você respondeu {contar(r)} de {N_ITENS} perguntas. Pode mudar qualquer resposta antes de ver seu resultado.
        </p>
      </motion.div>

      <AnimatePresence initial={false}>
        {falta.length > 0 && (
          <motion.div ref={alerta} className={`tv-alerta ${tentou ? 'is-forte' : ''}`} role="alert" initial={{ opacity: 0, y: -6 }} animate={tentou ? { opacity: 1, y: 0, x: [0, -6, 6, -4, 4, 0] } : { opacity: 1, y: 0 }} exit={{ opacity: 0 }} key={String(tentou)}>
            <CircleAlert size={20} />
            <div>
              <strong>
                {falta.length === 1 ? 'Falta 1 resposta' : `Faltam ${falta.length} respostas`} para gerar seu perfil
              </strong>
              <span>Elas são necessárias para a interpretação. Não completamos nada por você.</span>
              <div className="tv-alerta__itens">
                {falta.map((f) => (
                  <button key={f.id} onClick={() => editar(f)}>
                    {BLOCO[f.bloco].nome}: {rotuloCurto(f)} <ArrowRight size={13} />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="tv-rev">
        {BLOCOS.map((b, bi) => {
          const its = itensDo(b)
          const ok = its.filter((i) => i.id !== 'H-DEV' && respondido(r, i.id)).length
          const total = its.filter((i) => i.id !== 'H-DEV').length
          const aberto = abertos.includes(b)
          return (
            <motion.section key={b} className="tv-cartao tv-rev__bloco" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * bi }}>
              <button className="tv-rev__cab" onClick={() => setAbertos((a) => (aberto ? a.filter((x) => x !== b) : [...a, b]))} aria-expanded={aberto}>
                <img src={BLOCO[b].icone} alt="" />
                <span className="tv-rev__nome">
                  <strong>
                    Etapa {bi + 1} · {BLOCO[b].nome}
                  </strong>
                  <small>{BLOCO[b].titulo}</small>
                </span>
                <span className={`tv-rev__status ${ok === total ? 'is-ok' : ''}`}>
                  {ok === total ? <Check size={14} strokeWidth={3} /> : <CircleAlert size={14} />}
                  {ok} de {total}
                </span>
                <ChevronDown size={18} className={`tv-rev__seta ${aberto ? 'is-on' : ''}`} />
              </button>
              <AnimatePresence initial={false}>
                {aberto && (
                  <motion.ul className="tv-rev__lista" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                    {its.map((i) => {
                      const tem = respondido(r, i.id)
                      return (
                        <li key={i.id} className={!tem && i.id !== 'H-DEV' ? 'is-falta' : ''}>
                          <span className="tv-rev__item">{rotuloCurto(i)}</span>
                          <span className="tv-rev__resp">{tem ? textoResposta(i, r[i.id]) : i.id === 'H-DEV' ? 'Nenhuma escolhida (opcional)' : 'Sem resposta'}</span>
                          <button className="tv-iconbtn" onClick={() => editar(i)} aria-label={`Editar: ${rotuloCurto(i)}`}>
                            <PencilLine size={15} />
                          </button>
                        </li>
                      )
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.section>
          )
        })}
      </div>

      <div className="tv-revisao__rodape">
        <p>Ao concluir, seu perfil é calculado com o instrumento {atual.versao}. Você poderá refazer o teste no futuro, sem perder este resultado.</p>
        <Btn grande iconeDir={<ArrowRight size={17} />} onClick={concluir}>
          {falta.length ? 'Concluir teste' : 'Concluir e ver meu perfil'}
        </Btn>
      </div>
    </div>
  )
}

export function rotuloCurto(i: Item) {
  if (i.tipo === 'par') return `${i.rotulos[0]} ou ${i.rotulos[1].toLowerCase()}`
  if (i.tipo === 'multipla') return 'Habilidades que quero desenvolver'
  return i.texto.replace(/\.$/, '')
}

export function textoResposta(i: Item, v: Resposta) {
  if (i.tipo === 'escala') return `${v} · ${ESCALA[i.escala][(v as number) - 1]}`
  if (i.tipo === 'par') return i.rotulos[v === 'a' ? 0 : 1]
  return HABILIDADES.filter((h) => (v as string[]).includes(h.id))
    .map((h) => h.nome)
    .join(', ')
}
