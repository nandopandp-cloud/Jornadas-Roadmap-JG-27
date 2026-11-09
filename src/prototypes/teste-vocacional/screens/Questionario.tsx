import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, CircleCheck, ListChecks, LoaderCircle, LogOut, Zap } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { respostasPersona } from '../dados'
import { Barra, Btn } from '../components/ui'
import { BLOCO, BLOCOS, ESCALA, HABILIDADES, ITENS, N_ITENS, contar, itensDo, respondido, type Bloco, type Item, type Resposta } from '../instrumento'
import { useTv } from '../store'

/** Questionário estruturado (PRD §5.4): blocos temáticos, progresso, voltar, salvar e retomar */
export default function Questionario({ capa: capaInicial, onSair }: { capa?: Bloco; onSair: () => void }) {
  const { s, atual, responder, setPos, ir, toast } = useTv()
  const [capa, setCapa] = useState<Bloco | undefined>(capaInicial)
  const [dir, setDir] = useState<1 | -1>(1)
  const avancando = useRef<number | undefined>(undefined)
  const pos = atual?.pos ?? 0
  const item = ITENS[pos]
  const r = atual?.respostas ?? {}
  const bloco = capa ?? item.bloco
  const nResp = contar(r)

  const proxima = useCallback(() => {
    window.clearTimeout(avancando.current)
    setDir(1)
    if (pos >= ITENS.length - 1) return ir({ id: 'revisao' })
    const seg = ITENS[pos + 1]
    setPos(pos + 1)
    if (seg.bloco !== item.bloco) setCapa(seg.bloco)
  }, [pos, item, setPos, ir])

  const anterior = useCallback(() => {
    window.clearTimeout(avancando.current)
    setDir(-1)
    if (capa) {
      setCapa(undefined)
      if (pos > 0 && ITENS[pos - 1].bloco !== capa) setPos(pos - 1)
      else if (pos === 0) ir({ id: 'intro' }, -1)
      return
    }
    if (pos === 0) return setCapa('A')
    setPos(pos - 1)
  }, [capa, pos, setPos, ir])

  const escolher = (v: Resposta, auto = true) => {
    responder(item.id, v)
    if (auto) {
      window.clearTimeout(avancando.current)
      avancando.current = window.setTimeout(proxima, 340)
    }
  }

  useEffect(() => () => window.clearTimeout(avancando.current), [])

  // teclado: 1–5 nas escalas, 1/2 (ou A/B) nos pares, setas para navegar
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest?.('input, textarea') || document.querySelector('.tv-modal')) return
      if (capa) {
        if (e.key === 'Enter' || e.key === 'ArrowRight') setCapa(undefined)
        return
      }
      if (e.key === 'ArrowRight' && respondido(r, item.id)) proxima()
      else if (e.key === 'ArrowLeft') anterior()
      else if (item.tipo === 'escala' && /^[1-5]$/.test(e.key)) escolher(Number(e.key))
      else if (item.tipo === 'par' && /^[12ab]$/i.test(e.key)) escolher(/^[1a]$/i.test(e.key) ? 'a' : 'b')
    }
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  })

  if (!atual) {
    return (
      <div className="tv-foco tv-vazio tv-vazio--grande">
        <strong>Nenhum teste em andamento</strong>
        <Btn onClick={() => ir({ id: 'entrada' })}>Ir para o Teste Vocacional</Btn>
      </div>
    )
  }

  /** atalho do protótipo: preenche a etapa atual com respostas da persona */
  const preencherEtapa = () => {
    const persona = respostasPersona()
    const itens = itensDo(bloco)
    itens.forEach((i) => !respondido(r, i.id) && responder(i.id, persona[i.id]))
    const ultimo = ITENS.indexOf(itens[itens.length - 1])
    setDir(1)
    if (ultimo >= ITENS.length - 1) {
      setPos(ultimo)
      return ir({ id: 'revisao' })
    }
    setPos(ultimo + 1)
    setCapa(ITENS[ultimo + 1].bloco)
    toast(`Etapa ${BLOCO[bloco].nome} preenchida com respostas de exemplo.`, 'info')
  }

  const iBloco = BLOCOS.indexOf(bloco)
  const doBloco = itensDo(bloco)
  const noBloco = doBloco.indexOf(item) + 1

  return (
    <div className="tv-quest">
      <div className="tv-quest__barra">
        <button className="tv-quest__sair" onClick={onSair}>
          <LogOut size={16} /> Sair e continuar depois
        </button>
        <span className={`tv-salvo ${s.salvando === 'salvando' ? 'is-salvando' : ''}`} role="status" aria-live="polite">
          {s.salvando === 'salvando' ? <LoaderCircle size={15} className="tv-gira" /> : <CircleCheck size={15} />}
          {s.salvando === 'salvando' ? 'Salvando…' : 'Respostas salvas'}
        </span>
      </div>

      <div className="tv-quest__etapas" aria-label="Etapas do teste">
        {BLOCOS.map((b, i) => {
          const its = itensDo(b)
          const feitas = its.filter((x) => x.id !== 'H-DEV' && respondido(r, x.id)).length
          const total = its.filter((x) => x.id !== 'H-DEV').length
          return (
            <div key={b} className={`tv-qetapa ${b === bloco ? 'is-on' : ''} ${feitas === total ? 'is-feita' : ''}`}>
              <span className="tv-qetapa__nome">
                {feitas === total ? <Check size={13} strokeWidth={3} /> : <b>{i + 1}</b>}
                {BLOCO[b].nome}
              </span>
              <Barra valor={(feitas / total) * 100} rotulo={`Etapa ${BLOCO[b].nome}: ${feitas} de ${total}`} />
            </div>
          )
        })}
      </div>

      <AnimatePresence mode="wait" initial={false} custom={dir}>
        {capa ? (
          <Capa key={`capa-${capa}`} bloco={capa} indice={iBloco} anteriorFeita={iBloco > 0} onComecar={() => setCapa(undefined)} />
        ) : (
          <motion.section
            key={item.id}
            className="tv-cartao tv-pergunta"
            initial={{ opacity: 0, x: 40 * dir }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 * dir, transition: { duration: 0.12 } }}
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
          >
            <header className="tv-pergunta__cab">
              <span className="tv-pergunta__etapa">
                Etapa {iBloco + 1} · {BLOCO[bloco].nome}
              </span>
              <span className="tv-pergunta__n">
                {item.id === 'H-DEV' ? 'Pergunta complementar' : `${noBloco} de ${doBloco.filter((x) => x.id !== 'H-DEV').length}`}
              </span>
            </header>
            <p className="tv-pergunta__instr">{item.bloco === 'A' ? 'Quanto você gostaria de…' : item.bloco === 'B' ? 'Ao escolher uma profissão, quão importante seria…' : item.bloco === 'D' && item.tipo === 'escala' ? 'Como você avalia hoje esta habilidade? É a sua percepção, não uma prova.' : BLOCO[item.bloco].instrucao}</p>
            <h2 className="tv-pergunta__txt">{item.tipo === 'par' ? item.texto : item.bloco === 'A' ? primeiraMinuscula(item.texto) : item.texto}</h2>
            <Resposta item={item} valor={r[item.id]} onEscolher={escolher} />
          </motion.section>
        )}
      </AnimatePresence>

      {!capa && (
        <div className="tv-quest__rodape">
          <Btn variante="contorno" icone={<ArrowLeft size={16} />} onClick={anterior}>
            Anterior
          </Btn>
          <div className="tv-quest__meio">
            <span className="tv-quest__geral">
              {nResp} de {N_ITENS} respondidas
            </span>
            <button className="tv-link" onClick={() => ir({ id: 'revisao' })}>
              <ListChecks size={14} /> Revisar respostas
            </button>
          </div>
          <Btn iconeDir={<ArrowRight size={16} />} disabled={!respondido(r, item.id) && item.tipo !== 'multipla'} onClick={proxima}>
            {pos >= ITENS.length - 1 ? 'Revisar e concluir' : item.tipo === 'multipla' && !respondido(r, item.id) ? 'Pular' : 'Próxima'}
          </Btn>
        </div>
      )}
      <div className="tv-quest__dicas">
        <span>{!capa && item.tipo === 'escala' ? 'Dica: use as teclas 1 a 5 para responder e ← → para navegar.' : !capa && item.tipo === 'par' ? 'Dica: use as teclas 1 e 2 para escolher.' : ''}</span>
        <button className="tv-demo" onClick={preencherEtapa} title="Atalho só do protótipo, para apresentações">
          <Zap size={13} /> Preencher etapa (atalho do protótipo)
        </button>
      </div>
    </div>
  )
}

const primeiraMinuscula = (t: string) => t.charAt(0).toLowerCase() + t.slice(1).replace(/\.$/, '?')

/* ---------------- capa de cada etapa ---------------- */
function Capa({ bloco, indice, anteriorFeita, onComecar }: { bloco: Bloco; indice: number; anteriorFeita: boolean; onComecar: () => void }) {
  const b = BLOCO[bloco]
  const escala = bloco === 'A' ? ESCALA.interesse : bloco === 'B' ? ESCALA.importancia : bloco === 'D' ? ESCALA.habilidade : null
  return (
    <motion.section className="tv-cartao tv-capa" initial={{ opacity: 0, scale: 0.97, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.12 } }}>
      {anteriorFeita && (
        <motion.p className="tv-capa__feita" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <img src="./voc/party-popper.webp" alt="" /> Etapa {BLOCO[BLOCOS[indice - 1]].nome} concluída!
        </motion.p>
      )}
      <motion.img className="tv-capa__ic" src={b.icone} alt="" initial={{ scale: 0.4, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 14 }} />
      <span className="tv-sobre">
        Etapa {indice + 1} de 4 · {b.nome}
      </span>
      <h2 className="tv-h1 tv-h1--m">{b.titulo}</h2>
      <p className="tv-capa__instr">{b.instrucao}</p>
      {escala ? (
        <ol className="tv-capa__escala" aria-label="Escala de resposta">
          {escala.map((e, i) => (
            <li key={e}>
              <b>{i + 1}</b> {e}
            </li>
          ))}
        </ol>
      ) : (
        <p className="tv-capa__par">
          <span>Opção 1</span> ou <span>Opção 2</span>: escolha a que combina mais com você hoje. Isso ajuda a descrever ambientes de trabalho e nunca elimina profissões.
        </p>
      )}
      <Btn grande iconeDir={<ArrowRight size={17} />} onClick={onComecar}>
        {indice === 0 ? 'Começar' : 'Continuar'}
      </Btn>
    </motion.section>
  )
}

/* ---------------- componentes de resposta ---------------- */
function Resposta({ item, valor, onEscolher }: { item: Item; valor?: Resposta; onEscolher: (v: Resposta, auto?: boolean) => void }) {
  if (item.tipo === 'escala') {
    const rot = ESCALA[item.escala]
    return (
      <div className={`tv-escala tv-escala--${item.escala}`} role="radiogroup" aria-label={item.texto}>
        {rot.map((t, i) => {
          const on = valor === i + 1
          return (
            <motion.button key={t} role="radio" aria-checked={on} className={`tv-escala__op ${on ? 'is-on' : ''}`} onClick={() => onEscolher(i + 1)} whileTap={{ scale: 0.95 }} whileHover={{ y: -2 }}>
              <span className="tv-escala__bola">
                {on ? (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 600, damping: 18 }}>
                    <Check size={17} strokeWidth={3} />
                  </motion.span>
                ) : (
                  i + 1
                )}
              </span>
              <span className="tv-escala__txt">{t}</span>
            </motion.button>
          )
        })}
      </div>
    )
  }
  if (item.tipo === 'par') {
    return (
      <div className="tv-par" role="radiogroup" aria-label={item.texto}>
        {(['a', 'b'] as const).map((lado, i) => {
          const on = valor === lado
          return (
            <div key={lado} className="tv-par__lado">
              {i === 1 && <span className="tv-par__ou">ou</span>}
              <motion.button role="radio" aria-checked={on} className={`tv-par__op ${on ? 'is-on' : ''}`} onClick={() => onEscolher(lado)} whileTap={{ scale: 0.97 }} whileHover={{ y: -3 }}>
                <span className="tv-par__n">{on ? <Check size={15} strokeWidth={3} /> : i + 1}</span>
                <strong>{item.rotulos[i]}</strong>
                <span>{lado === 'a' ? item.a : item.b}</span>
              </motion.button>
            </div>
          )
        })}
      </div>
    )
  }
  // múltipla: até 3 habilidades para desenvolver
  const sel = (valor as string[] | undefined) ?? []
  return (
    <div className="tv-multi">
      <p className="tv-multi__cont">
        <b>{sel.length}</b> de 3 escolhidas · opcional
      </p>
      <div className="tv-multi__grade">
        {HABILIDADES.map((h) => {
          const on = sel.includes(h.id)
          const cheio = !on && sel.length >= 3
          return (
            <motion.button
              key={h.id}
              aria-pressed={on}
              disabled={cheio}
              className={`tv-multi__op ${on ? 'is-on' : ''}`}
              onClick={() => onEscolher(on ? sel.filter((x) => x !== h.id) : [...sel, h.id], false)}
              whileTap={{ scale: 0.96 }}
            >
              <span className="tv-caixa">{on && <Check size={13} strokeWidth={3} />}</span>
              {h.nome}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
