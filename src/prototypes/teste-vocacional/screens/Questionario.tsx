import { AnimatePresence, motion } from 'framer-motion'
import { Annoyed, ArrowLeft, ArrowRight, Check, CircleCheck, Frown, Laugh, Lightbulb, LoaderCircle, LogOut, Meh, Smile, Zap, type LucideIcon } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { respostasPersona } from '../dados'
import { Anel, Barra, Btn, Etiqueta } from '../components/ui'
import { BLOCOS, ESCALA, HABILIDADES, ITENS, N_ITENS, contar, itensDo, respondido, type Bloco, type Item, type Resposta } from '../instrumento'
import { faltando } from '../motor'
import { useTv } from '../store'

/** textos de cada etapa, como nos Frames 2, 1, 4 e 5 */
const ETAPA: Record<Bloco, { nome: string; chip: string; titulo: string; sub: string; ajudaT: string; ajuda: string[]; progresso: string; arte?: string }> = {
  A: {
    nome: 'Seus interesses',
    chip: 'Seus interesses profissionais (RIASEC)',
    titulo: 'Quanto você gostaria de realizar esta atividade?',
    sub: 'Responda pensando no seu dia a dia profissional, mesmo que você ainda não tenha experiência com essa atividade.',
    ajudaT: 'Não existe resposta certa ou errada',
    ajuda: ['Este teste avalia o que você tem interesse de fazer, não a sua capacidade ou conhecimento atual.', 'Responda com sinceridade, pensando no que você gostaria de realizar no seu futuro profissional.'],
    progresso: 'Neste bloco, vamos entender quais tipos de atividades despertam mais seu interesse.',
    arte: './voc/ref/q-interesses.webp',
  },
  B: {
    nome: 'Seus valores',
    chip: 'Seus valores profissionais',
    titulo: 'Qual a importância dessa característica para você em uma futura carreira?',
    sub: 'Agora vamos entender o que você valoriza em um trabalho. Não existem respostas certas ou erradas.',
    ajudaT: 'O que são valores profissionais?',
    ajuda: ['Valores são características que você considera importantes em uma carreira, como estabilidade, autonomia, impacto social e aprendizado.', 'Eles ajudam a identificar o tipo de experiência profissional que faz sentido para você, complementando seus interesses.'],
    progresso: 'Seus valores profissionais',
    arte: './voc/ref/q-valores.webp',
  },
  C: {
    nome: 'Preferências',
    chip: 'Suas preferências de trabalho',
    titulo: 'Qual destas situações combina mais com você?',
    sub: 'Escolha a opção que mais se parece com o que você prefere no seu dia a dia. Não existe resposta certa ou errada.',
    ajudaT: 'O que são preferências de trabalho?',
    ajuda: ['Esta etapa identifica como você gosta de organizar e realizar suas atividades profissionais.', 'Suas respostas ajudam a entender quais ambientes e formas de trabalho fazem mais sentido para você, complementando seus interesses e valores.', 'Não existe resposta certa ou errada.'],
    progresso: 'Preferências de trabalho',
  },
  D: {
    nome: 'Suas habilidades',
    chip: 'Suas habilidades',
    titulo: 'Como você avalia sua facilidade nesta atividade?',
    sub: 'Pense na sua experiência atual, considerando atividades que você já realiza na escola, em casa ou em outros contextos.',
    ajudaT: 'O que são habilidades percebidas?',
    ajuda: ['Aqui queremos entender como você avalia suas habilidades atuais em diferentes competências.', 'Não existem respostas certas ou erradas. Esta é apenas a sua percepção no momento e pode mudar ao longo do tempo.'],
    progresso: 'Suas habilidades',
    arte: './voc/ref/q-habilidades.webp',
  },
}

const ROSTOS: { I: LucideIcon; cor: string }[] = [
  { I: Frown, cor: '#ef4b5f' },
  { I: Annoyed, cor: '#f7881f' },
  { I: Meh, cor: '#8a90a6' },
  { I: Smile, cor: '#2f8af5' },
  { I: Laugh, cor: '#504cf2' },
]

/** ilustrações dos pares (Frame 4): a primeira dupla tem as artes da referência */
const ARTE_PAR: Record<string, [string, string]> = { P01: ['./voc/ref/q-par-pessoas.webp', './voc/ref/q-par-sozinho.webp'] }

/** Questionário (Frames 2, 1, 4 e 5 · PRD §5.4) */
export { ROSTOS }

export default function Questionario({ onSair }: { onSair: () => void }) {
  const { s, atual, responder, setPos, ir, toast } = useTv()
  const [dir, setDir] = useState<1 | -1>(1)
  const avancando = useRef<number | undefined>(undefined)
  const pos = atual?.pos ?? 0
  const item = ITENS[pos]
  const r = atual?.respostas ?? {}
  const nResp = contar(r)
  const bloco = item.bloco
  const et = ETAPA[bloco]
  const doBloco = itensDo(bloco).filter((i) => i.id !== 'H-DEV')
  const feitasBloco = doBloco.filter((i) => respondido(r, i.id)).length

  const concluir = useCallback(() => ir({ id: faltando(r).length ? 'revisao' : 'processando' }), [ir, r])

  const proxima = useCallback(() => {
    window.clearTimeout(avancando.current)
    setDir(1)
    if (pos >= ITENS.length - 1) return concluir()
    const seg = ITENS[pos + 1]
    setPos(pos + 1)
    if (seg.bloco !== item.bloco) toast(`${ETAPA[item.bloco].nome}: etapa concluída! Agora, ${ETAPA[seg.bloco].nome.toLowerCase()}.`, 'ok')
  }, [pos, item, setPos, concluir, toast])

  const anterior = useCallback(() => {
    window.clearTimeout(avancando.current)
    setDir(-1)
    if (pos === 0) return ir({ id: 'clareza' }, -1)
    setPos(pos - 1)
  }, [pos, setPos, ir])

  const escolher = (v: Resposta, auto = true) => {
    responder(item.id, v)
    if (auto) {
      window.clearTimeout(avancando.current)
      avancando.current = window.setTimeout(proxima, 380)
    }
  }
  useEffect(() => () => window.clearTimeout(avancando.current), [])

  // teclado: 1–5 nas escalas, 1/2 nos pares, setas para navegar
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest?.('input, textarea') || document.querySelector('.tv-modal')) return
      if (e.key === 'ArrowRight' && respondido(r, item.id)) proxima()
      else if (e.key === 'ArrowLeft') anterior()
      else if (item.tipo === 'escala' && /^[1-5]$/.test(e.key)) escolher(Number(e.key))
      else if (item.tipo === 'par' && /^[12]$/.test(e.key)) escolher(e.key === '1' ? 'a' : 'b')
    }
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  })

  if (!atual) {
    return (
      <div className="tv-vazio tv-vazio--grande">
        <strong>Nenhum teste em andamento</strong>
        <Btn onClick={() => ir({ id: 'entrada' })}>Ir para o Teste Vocacional</Btn>
      </div>
    )
  }

  /** atalho do protótipo: responde a etapa atual com as respostas da persona */
  const preencherEtapa = () => {
    const persona = respostasPersona()
    const itens = itensDo(bloco)
    itens.forEach((i) => !respondido(r, i.id) && responder(i.id, persona[i.id]))
    const ultimo = ITENS.indexOf(itens[itens.length - 1])
    setDir(1)
    if (ultimo >= ITENS.length - 1) {
      setPos(ultimo)
      return ir({ id: 'processando' })
    }
    setPos(ultimo + 1)
    toast(`Etapa “${et.nome}” preenchida com respostas de exemplo.`, 'info')
  }

  const iBloco = BLOCOS.indexOf(bloco)
  const numero = item.id === 'H-DEV' ? null : ITENS.filter((i) => i.id !== 'H-DEV').indexOf(item) + 1

  return (
    <div className="tv-quest">
      <div className="tv-quest__topo">
        <button className="tv-voltar" onClick={anterior}>
          <ArrowLeft size={20} /> {pos === 0 ? 'Voltar' : 'Voltar ao teste'}
        </button>
        <button className="tv-voltar" onClick={onSair}>
          <LogOut size={19} /> Sair do teste
        </button>
      </div>

      <ol className="tv-etapas" aria-label="Etapas do teste">
        {[...BLOCOS.map((b, i) => ({ b, n: i + 1, nome: ETAPA[b].nome, sub: `${itensDo(b).filter((x) => x.id !== 'H-DEV').length} perguntas` })), { b: 'R' as const, n: 5, nome: 'Resultado', sub: 'Seu perfil' }].map((x, i) => {
          const feita = x.b !== 'R' && i < iBloco
          const on = i === iBloco
          return (
            <li key={x.n} className={`${feita ? 'is-feita' : ''} ${on ? 'is-on' : ''}`} aria-current={on ? 'step' : undefined}>
              <span className="tv-etapas__n">{feita ? <Check size={18} strokeWidth={3} /> : x.n}</span>
              <span className="tv-etapas__txt">
                <strong>{x.nome}</strong>
                <small>{x.sub}</small>
              </span>
            </li>
          )
        })}
      </ol>
      <div className="tv-quest__barra">
        <Barra valor={(nResp / N_ITENS) * 100} rotulo="Progresso do teste" />
        <span>
          {nResp} de {N_ITENS}
        </span>
      </div>

      <div className="tv-quest__grade">
        <div className="tv-quest__principal">
          <Etiqueta />
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={bloco} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h1 className="tv-h1 tv-h1--q">{et.titulo}</h1>
              <p className="tv-lead">{et.sub}</p>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait" initial={false} custom={dir}>
            <motion.section
              key={item.id}
              className={`tv-qcard ${item.tipo === 'par' ? 'tv-qcard--par' : ''} tv-qcard--${bloco}`}
              initial={{ opacity: 0, x: 36 * dir }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -26 * dir, transition: { duration: 0.12 } }}
              transition={{ type: 'spring', stiffness: 380, damping: 34 }}
            >
              <div className="tv-qcard__chips">
                <span className="tv-qcard__n">{numero ? `${numero}/${N_ITENS}` : 'Complementar'}</span>
                <span className="tv-qcard__bloco">{et.chip}</span>
              </div>
              <Corpo item={item} valor={r[item.id]} arte={et.arte} onEscolher={escolher} />
            </motion.section>
          </AnimatePresence>
        </div>

        <aside className="tv-quest__lado">
          <div className="tv-ajuda">
            <span className="tv-ajuda__ic">
              <Lightbulb size={26} strokeWidth={1.7} />
            </span>
            <div>
              <strong>{et.ajudaT}</strong>
              {et.ajuda.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          <div className="tv-progbloco">
            <strong>{bloco === 'A' ? 'Progresso do bloco' : bloco === 'B' ? 'Seu progresso' : 'Seu progresso neste bloco'}</strong>
            <div>
              <Anel valor={bloco === 'B' ? nResp : feitasBloco} total={bloco === 'B' ? N_ITENS : doBloco.length} tam={104} />
              <span>
                <b>{bloco === 'A' ? 'Seus interesses profissionais' : et.progresso}</b>
                <small>{bloco === 'A' ? et.progresso : `Você já respondeu ${feitasBloco} de ${doBloco.length} perguntas deste bloco.`}</small>
              </span>
            </div>
          </div>
        </aside>
      </div>

      <div className="tv-quest__rodape">
        <Btn grande variante="claro" icone={<ArrowLeft size={19} />} onClick={anterior}>
          Pergunta anterior
        </Btn>
        <button className="tv-demo" onClick={preencherEtapa} title="Atalho só do protótipo, para apresentações">
          <Zap size={13} /> Preencher etapa (atalho do protótipo)
        </button>
        <div className="tv-quest__prox">
          <Btn grande iconeDir={<ArrowRight size={19} />} disabled={!respondido(r, item.id) && item.tipo !== 'multipla'} onClick={proxima}>
            {pos >= ITENS.length - 1 ? 'Ver meu resultado' : item.tipo === 'multipla' && !respondido(r, item.id) ? 'Pular pergunta' : 'Próxima pergunta'}
          </Btn>
          <small className={s.salvando === 'salvando' ? 'is-salvando' : ''} role="status" aria-live="polite">
            {s.salvando === 'salvando' ? <LoaderCircle size={13} className="tv-gira" /> : <CircleCheck size={13} />} {s.salvando === 'salvando' ? 'Salvando…' : 'Suas respostas são salvas automaticamente'}
          </small>
        </div>
      </div>
    </div>
  )
}

/* ---------------- corpo de cada tipo de pergunta ---------------- */
function Corpo({ item, valor, arte, onEscolher }: { item: Item; valor?: Resposta; arte?: string; onEscolher: (v: Resposta, auto?: boolean) => void }) {
  if (item.tipo === 'par') {
    const artes = ARTE_PAR[item.id]
    return (
      <div className="tv-par" role="radiogroup" aria-label="Escolha a opção que combina mais com você">
        {(['a', 'b'] as const).map((lado, i) => {
          const on = valor === lado
          const txt = lado === 'a' ? item.a : item.b
          return (
            <motion.button key={lado} role="radio" aria-checked={on} className={`tv-par__op ${on ? 'is-on' : ''}`} onClick={() => onEscolher(lado)} whileTap={{ scale: 0.98 }} whileHover={{ y: -3 }}>
              {artes ? <img src={artes[i]} alt="" className="tv-par__arte" /> : <span className={`tv-par__rotulo tv-par__rotulo--${lado}`}>{item.rotulos[i]}</span>}
              <span className="tv-par__txt">Prefiro {txt.charAt(0).toLowerCase() + txt.slice(1)}.</span>
              <span className={`tv-radio ${on ? 'is-on' : ''}`} aria-hidden />
            </motion.button>
          )
        })}
      </div>
    )
  }
  if (item.tipo === 'multipla') {
    const sel = (valor as string[] | undefined) ?? []
    return (
      <>
        <h2 className="tv-qcard__txt">{item.texto}</h2>
        <p className="tv-qcard__dica">
          <b>{sel.length}</b> de 3 escolhidas · opcional
        </p>
        <div className="tv-multi">
          {HABILIDADES.map((h) => {
            const on = sel.includes(h.id)
            return (
              <motion.button key={h.id} aria-pressed={on} disabled={!on && sel.length >= 3} className={`tv-multi__op ${on ? 'is-on' : ''}`} onClick={() => onEscolher(on ? sel.filter((x) => x !== h.id) : [...sel, h.id], false)} whileTap={{ scale: 0.96 }}>
                <span className="tv-caixa">{on && <Check size={13} strokeWidth={3} />}</span>
                {h.nome}
              </motion.button>
            )
          })}
        </div>
      </>
    )
  }
  const rot = ESCALA[item.escala]
  return (
    <>
      <div className={`tv-qcard__meio ${item.bloco === 'D' ? 'is-lado' : ''}`}>
        <h2 className="tv-qcard__txt">{item.texto}</h2>
        {arte && <img src={arte} alt="" className="tv-qcard__arte" />}
      </div>
      <div className="tv-escala" role="radiogroup" aria-label={item.texto}>
        {rot.map((t, i) => {
          const on = valor === i + 1
          const { I, cor } = ROSTOS[i]
          return (
            <motion.button key={t} role="radio" aria-checked={on} className={`tv-escala__op ${on ? 'is-on' : ''}`} style={{ '--c': cor } as React.CSSProperties} onClick={() => onEscolher(i + 1)} whileTap={{ scale: 0.95 }} whileHover={{ y: -2 }}>
              {item.escala === 'importancia' ? <span className="tv-escala__circ" /> : <I size={34} strokeWidth={1.6} className="tv-escala__rosto" />}
              <span className="tv-escala__txt">{t}</span>
              <span className="tv-escala__n">{on ? <Check size={11} strokeWidth={3.5} /> : i + 1}</span>
            </motion.button>
          )
        })}
      </div>
    </>
  )
}
