// Início e Batalha Solo (seções 1 a 6 do Figma).
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, BookOpen, Calendar, ChevronDown, ChevronRight, Clock, FileQuestion, Filter, Lightbulb, List, Rocket, Swords, Trash2, Trophy, Users, XCircle, Zap, CheckCircle2, Equal } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Ctx } from './ctx'
import type { DiscId, Selecao } from './data'
import { MAX_DISC, TEMPO_SOLO, TOTAL, acertos, dataCurta, desfechoSolo, hora, nomeDisc, porTopico, relogio, topicosSolo } from './logica'
import { SOLO_DISC } from './data'
import { Alternativa, Balao, Barra, Btn, Caminho, Duas, Etiqueta, IconeDisc, IconeResultado, Marcador, Quadrado, Selo, type EstadoAlt } from './pecas'

const LETRAS = ['A', 'B', 'C', 'D']
const RES = { win: ['Vitória', 'is-verde'], tie: ['Empate', 'is-cinza'], loss: ['Derrota', 'is-vermelho'] } as const

/* =============================================================== 1 · Início */
export function Inicio({ c }: { c: Ctx }) {
  const tem = c.historico.length > 0
  const histRef = useRef<HTMLElement>(null)
  const modosRef = useRef<HTMLElement>(null)
  const [filtro, setFiltro] = useState('todas')
  const verHistorico = () => {
    if (histRef.current) histRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    else {
      modosRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      c.avisar({ tipo: 'info', titulo: 'Nenhuma batalha ainda', texto: 'Você ainda não tem batalhas. Que tal começar uma Batalha Solo?' })
    }
  }
  return (
    <div className="bt-pagina">
      <header className="bt-cab-inicio">
        <div>
          <h1 className="bt-h1">Batalhas</h1>
          <p className="bt-sub">Desafie seus conhecimentos, pratique conteúdos e evolua enquanto se diverte!</p>
        </div>
        <button className="bt-atalho-hist" onClick={verHistorico}>
          <span className="bt-tile is-lav">
            <Trophy size={22} />
          </span>
          <span>
            <b>Ver meu histórico</b>
            <small>Acompanhe suas batalhas</small>
          </span>
          <ChevronRight size={18} />
        </button>
      </header>

      <section className="bt-hero is-lav">
        <div className="bt-hero__txt">
          <h2 className="bt-h1">
            <Duas a="Conhecimento" b="também é uma disputa!" quebra />
          </h2>
          <p className="bt-sub">Responda a questões, desafie personagens ou outros estudantes, confira seu desempenho e aprenda com seus erros a cada rodada.</p>
          <ul className="bt-destaques">
            {[
              [FileQuestion, '10 questões', 'em cada batalha'],
              [Zap, 'Resultados na hora', 'ou quando o oponente responder'],
              [BookOpen, 'Confira o gabarito', 'e aprenda com seus erros'],
            ].map(([I, a, b]) => {
              const Ic = I as typeof Zap
              return (
                <li key={a as string}>
                  <Ic size={24} />
                  <span>
                    <b>{a as string}</b>
                    <small>{b as string}</small>
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
        <img className="bt-hero__arte" src="./bat/hero-banner.webp" alt="Dois estudantes disputando um troféu em seus notebooks" />
      </section>

      <section ref={modosRef} className="bt-ancora">
        <h2 className="bt-h2">Escolha seu modo de batalha</h2>
        <p className="bt-sub is-15">São duas formas de desafiar seus conhecimentos. Qual você prefere?</p>
        <div className={`bt-modos ${tem ? 'is-compacto' : ''}`}>
          <article className="bt-card bt-modo">
            <div className="bt-modo__arte is-creme">
              <img src="./bat/card-solo.webp" alt="Nexo desafiando: Bora ver se você consegue me vencer?" />
            </div>
            <span className="bt-badge is-ouro">SOLO</span>
            <h3>Batalha Solo</h3>
            <p>Enfrente o Nexo, o personagem oficial da GenieX, em uma sequência de 10 questões. Mostre o que você sabe e tente alcançar a vitória!</p>
            {!tem && (
              <ul className="bt-regras">
                <li>
                  <CheckCircle2 className="bt-verde" size={20} /> Vença com 7 ou mais acertos
                </li>
                <li>
                  <Equal className="bt-roxo" size={20} /> Empate com 5 ou 6 acertos
                </li>
                <li>
                  <XCircle className="bt-vermelho" size={20} /> Derrota com 4 ou menos acertos
                </li>
              </ul>
            )}
            <div className="bt-modo__acoes">
              <Btn full onClick={() => c.ir('solo-intro')}>
                Iniciar batalha solo <ArrowRight size={18} />
              </Btn>
            </div>
          </article>
          <article className="bt-card bt-modo">
            <div className="bt-modo__arte is-lav">
              <img src="./bat/card-vs.webp" alt="Dois estudantes batendo os punhos antes de uma batalha" />
            </div>
            <span className="bt-badge is-sec">VERSUS</span>
            <h3>Batalha VS</h3>
            <p>Desafie outro estudante da sua sala ou escola e compare seus conhecimentos em uma sequência de 10 questões.</p>
            {!tem && (
              <ul className="bt-regras">
                <li>
                  <Users className="bt-roxo" size={20} /> Escolha um oponente da mesma série
                </li>
                <li>
                  <Clock className="bt-roxo" size={20} /> Seu oponente tem até 24 horas para responder
                </li>
                <li>
                  <Zap className="bt-roxo" size={20} /> Vence quem tiver o melhor desempenho
                </li>
              </ul>
            )}
            <div className="bt-modo__acoes">
              <Btn full onClick={() => c.ir('vs-intro')}>
                Encontrar oponente <ArrowRight size={18} />
              </Btn>
              <Btn v="ghost" full className="bt-roxo" onClick={() => c.ir('vs-lista')}>
                Ver minhas batalhas VS
              </Btn>
            </div>
          </article>
        </div>
      </section>

      {tem && (
        <section ref={histRef} className="bt-card bt-historico bt-ancora">
          <div className="bt-historico__topo">
            <div>
              <h2 className="bt-h3">Histórico de batalhas</h2>
              <p className="bt-sub is-14">Veja suas últimas batalhas e acompanhe seu desempenho.</p>
            </div>
            <label className="bt-select">
              <Filter size={16} />
              <select value={filtro} onChange={(e) => setFiltro(e.target.value)} aria-label="Filtrar por modalidade">
                <option value="todas">Todas as modalidades</option>
                <option value="solo">Batalha Solo</option>
                <option value="vs">Batalha VS</option>
              </select>
              <ChevronDown size={16} />
            </label>
          </div>
          <ul className="bt-historico__lista">
            {filtro === 'vs' ? (
              <li className="bt-vazio">
                <Swords size={24} />
                Suas Batalhas VS ficam em um lugar só.{' '}
                <button className="bt-link" onClick={() => c.ir('vs-lista')}>
                  Ver minhas batalhas VS
                </button>
              </li>
            ) : (
              c.historico.map((b) => {
                const n = acertos(b.questoes, b.respostas)
                const r = desfechoSolo(n)
                return (
                  <li key={b.id} className="bt-hist">
                    <span className="bt-tile is-creme">
                      <Swords size={22} />
                    </span>
                    <span className="bt-hist__txt">
                      <b>Batalha Solo</b>
                      <small>{b.selecoes.map((s) => nomeDisc(s.disciplina)).join(' • ')}</small>
                      <small className="bt-so-cel">
                        {n}/10 · {RES[r][0]}
                      </small>
                    </span>
                    <span className="bt-hist__data">
                      <small>
                        <Calendar size={14} /> {dataCurta(b.data)}
                      </small>
                      <small>
                        <Clock size={14} /> {hora(b.data)}
                      </small>
                    </span>
                    <span className="bt-hist__nota">
                      <b>{n}/10</b>
                      <small>{n * 10}% de aproveitamento</small>
                    </span>
                    <span className={`bt-res ${RES[r][1]}`}>
                      <IconeResultado r={r} size={16} /> {RES[r][0]}
                    </span>
                    <Btn v="outline" sm onClick={() => c.abrirSolo(b.id, 'solo-gabarito')}>
                      Ver gabarito
                    </Btn>
                    <button className="bt-icone-btn bt-hist__seta" aria-label="Ver resultado da batalha" onClick={() => c.abrirSolo(b.id, 'solo-resultado')}>
                      <ChevronRight size={18} />
                    </button>
                  </li>
                )
              })
            )}
          </ul>
        </section>
      )}
    </div>
  )
}

/* =============================================================== 2 · Introdução */
export function SoloIntro({ c }: { c: Ctx }) {
  return (
    <div className="bt-pagina">
      <Caminho itens={[['Batalhas', () => c.ir('inicio')], ['Batalha Solo', null]]} />
      <div className="bt-intro">
        <div className="bt-intro__txt">
          <Selo />
          <h1 className="bt-h1">
            <Duas a="Enfrente o " b="Nexo!" />
          </h1>
          <p className="bt-sub is-17">O Nexo é o personagem oficial da GenieX e está pronto para testar os seus conhecimentos em uma sequência de 10 questões. Será que você consegue vencer?</p>
          <ul className="bt-lista-caixa">
            {[
              [FileQuestion, 'São 10 questões', 'de múltipla escolha, com conteúdos da sua série.'],
              [Zap, 'Resultado imediato', 'Descubra se você venceu, empatou ou perdeu assim que terminar.'],
              [BookOpen, 'Veja o gabarito', 'Ao final da batalha, confira todas as questões, suas respostas e os acertos.'],
            ].map(([I, t, s]) => {
              const Ic = I as typeof Zap
              return (
                <li key={t as string}>
                  <Ic size={28} className="bt-roxo" />
                  <span>
                    <b>{t as string}</b>
                    <small>{s as string}</small>
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
        <img className="bt-intro__nexo" src="./bat/nexo-intro.webp" alt="Nexo apontando para você: Bora ver se você consegue me vencer?" />
      </div>
      <section className="bt-como">
        <img className="bt-como__arte" src="./bat/nexo-thinking.webp" alt="Nexo pensativo: Você consegue 7 ou mais acertos?" />
        <div className="bt-como__txt">
          <h2 className="bt-h3">Como funciona o resultado?</h2>
          <ul>
            <li>
              <CheckCircle2 size={26} className="bt-verde" />
              <span>
                <b>Vença com 7 ou mais acertos</b>
                <small>Você mostra que está no nível do Nexo e conquista a vitória!</small>
              </span>
            </li>
            <li>
              <Equal size={26} className="bt-roxo" />
              <span>
                <b>Empate com 5 ou 6 acertos</b>
                <small>Foi por pouco! O Nexo reconhece o seu esforço.</small>
              </span>
            </li>
            <li>
              <XCircle size={26} className="bt-vermelho" />
              <span>
                <b>Derrota com 4 ou menos acertos</b>
                <small>O Nexo leva essa, mas não desanima! Use o gabarito para aprender e tente novamente.</small>
              </span>
            </li>
          </ul>
        </div>
      </section>
      <p className="bt-dica">
        <Lightbulb size={30} className="bt-roxo" />
        Os temas das questões são baseados nos conteúdos da sua série, incluindo as disciplinas que você já estudou na plataforma.
      </p>
      <div className="bt-acoes is-dir">
        <Btn v="outline" onClick={() => c.ir('inicio')}>
          Voltar
        </Btn>
        <Btn onClick={() => c.ir('solo-topicos')} style={{ minWidth: 240 }}>
          Iniciar batalha <ArrowRight size={18} />
        </Btn>
      </div>
    </div>
  )
}

/* =============================================================== 3 · Seleção de tópicos */
export function SoloTopicos({ c }: { c: Ctx }) {
  const [sel, setSel] = useState<Selecao[]>(c.soloSel)
  const [treme, setTreme] = useState<DiscId | null>(null)
  const alternar = (id: DiscId) => {
    if (sel.some((s) => s.disciplina === id)) return setSel(sel.filter((s) => s.disciplina !== id))
    if (sel.length >= MAX_DISC) {
      setTreme(id)
      setTimeout(() => setTreme(null), 500)
      c.avisar({ tipo: 'alerta', titulo: 'Limite de disciplinas', texto: 'Você pode escolher até 3 disciplinas. Remova uma para trocar.' })
      return
    }
    setSel([...sel, { disciplina: id, topico: '' }])
  }
  const ordenadas = SOLO_DISC.filter((d) => sel.some((s) => s.disciplina === d.id)).map((d) => sel.find((s) => s.disciplina === d.id)!)
  const pronto = sel.length > 0 && sel.every((s) => s.topico)
  return (
    <div className="bt-pagina">
      <Caminho itens={[['Batalhas', () => c.ir('inicio')], ['Batalha Solo', () => c.ir('solo-intro')], ['Seleção de tópicos', null]]} />
      <div className="bt-topo-linha">
        <div className="bt-topo-linha__txt">
          <Selo />
          <h1 className="bt-h1">
            <Duas a="Escolha " b="seus tópicos" />
          </h1>
          <p className="bt-sub is-17">Selecione até 3 disciplinas e um tópico de cada uma para iniciar sua batalha contra o Nexo.</p>
          <ul className="bt-chips">
            <li>
              <BookOpen size={22} />
              <span>
                Você pode escolher <b>até 3 disciplinas</b>
              </span>
            </li>
            <li>
              <List size={22} />
              <span>
                <b>1 tópico</b> por <b>disciplina</b>
              </span>
            </li>
            <li>
              <FileQuestion size={22} />
              <span>
                Serão <b>10 questões</b> no total
              </span>
            </li>
          </ul>
        </div>
        <img className="bt-topo-linha__arte" src="./bat/nexo-topics.webp" alt="Nexo: Escolha bem seus tópicos! Vou preparar um desafio especial pra você!" />
      </div>
      <section>
        <h2 className="bt-h3">1. Selecione até 3 disciplinas</h2>
        <p className="bt-sub is-15">Escolha as áreas do conhecimento que você quer desafiar.</p>
        <div className="bt-grade-disc is-solo">
          {SOLO_DISC.map((d) => {
            const on = sel.some((s) => s.disciplina === d.id)
            return (
              <button key={d.id} className={`bt-disc-card ${on ? 'is-on' : ''} ${treme === d.id ? 'is-treme' : ''}`} aria-pressed={on} onClick={() => alternar(d.id)}>
                <Marcador on={on} />
                <IconeDisc id={d.id} size={44} />
                {nomeDisc(d.id)}
              </button>
            )
          })}
        </div>
      </section>
      <section>
        <h2 className="bt-h3">2. Escolha um tópico para cada disciplina</h2>
        <p className="bt-sub is-15">Selecione um tema específico para cada área que você escolheu.</p>
        <ul className="bt-topicos">
          {ordenadas.length === 0 && <li className="bt-vazio">Selecione ao menos uma disciplina acima para escolher os tópicos.</li>}
          <AnimatePresence initial={false}>
            {ordenadas.map((s) => (
              <motion.li key={s.disciplina} className="bt-topico" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="bt-topico__caixa">
                  <span className="bt-topico__nome">
                    <IconeDisc id={s.disciplina} size={36} />
                    <b>{nomeDisc(s.disciplina)}</b>
                  </span>
                  <label className="bt-select is-grande">
                    <select value={s.topico} onChange={(e) => setSel(sel.map((x) => (x.disciplina === s.disciplina ? { ...x, topico: e.target.value } : x)))} className={s.topico ? '' : 'is-vazio'} aria-label={`Tópico de ${nomeDisc(s.disciplina)}`}>
                      <option value="" disabled>
                        Selecione um tópico
                      </option>
                      {topicosSolo(s.disciplina).map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} />
                  </label>
                </div>
                <button className="bt-remover" aria-label={`Remover ${nomeDisc(s.disciplina)}`} onClick={() => alternar(s.disciplina)}>
                  <Trash2 size={20} />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        {ordenadas.length === 1 && <p className="bt-sub is-13 bt-mt">Com apenas 1 disciplina, completamos a batalha com questões de outras áreas da sua série.</p>}
      </section>
      <div className="bt-acoes is-meio">
        <Btn v="outline" onClick={() => c.ir('solo-intro')}>
          Voltar
        </Btn>
        <Btn disabled={!pronto} onClick={() => c.iniciarSolo(ordenadas)}>
          Iniciar batalha <ArrowRight size={18} />
        </Btn>
      </div>
    </div>
  )
}

/* =============================================================== 4 · Questão */
export function SoloQuiz({ c }: { c: Ctx }) {
  const qs = c.soloQs
  const [i, setI] = useState(0)
  const [resp, setResp] = useState<(number | null)[]>([])
  const [escolha, setEscolha] = useState<number | null>(null)
  const [fim, setFim] = useState(false)
  const [tempo, setTempo] = useState(TEMPO_SOLO)
  const topo = useRef<HTMLDivElement>(null)
  const q = qs[i]
  const ultima = i === qs.length - 1
  const marcada = fim ? resp[i] : undefined
  const certa = fim && marcada === q.correta
  const esgotou = fim && marcada === null

  const confirmar = useCallback(
    (v: number | null) => {
      setResp((r) => {
        const n = [...r]
        n[i] = v
        return n
      })
      setFim(true)
    },
    [i],
  )
  const avancar = useCallback(() => {
    if (ultima) return c.fimSolo(resp)
    setI((x) => x + 1)
    setEscolha(null)
    setFim(false)
    setTempo(TEMPO_SOLO)
    topo.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [ultima, resp, c])
  // cronômetro de 45 s por questão
  useEffect(() => {
    if (fim || c.modalAberto) return
    if (tempo <= 0) return confirmar(escolha)
    const t = setTimeout(() => setTempo((x) => x - 1), 1000)
    return () => clearTimeout(t)
  }, [tempo, fim, escolha, confirmar, c.modalAberto])
  const principal = useCallback(() => (fim ? avancar() : escolha !== null && confirmar(escolha)), [fim, avancar, escolha, confirmar])
  // atalhos: 1–4 ou A–D escolhem, Enter confirma
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (c.modalAberto) return
      const k = e.key.toLowerCase()
      const n = ['1', '2', '3', '4'].indexOf(k)
      const l = ['a', 'b', 'c', 'd'].indexOf(k)
      if (!fim && (n >= 0 || l >= 0)) setEscolha(n >= 0 ? n : l)
      if (k === 'enter' && !(e.target instanceof HTMLButtonElement)) principal()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [fim, principal, c.modalAberto])

  const feitas = resp.filter((_, k) => k < i + (fim ? 1 : 0))
  const certas = feitas.filter((r, k) => r === qs[k].correta).length
  const status = !fim ? ['trophy', 'Vença com 7 ou mais acertos!'] : certa ? ['trophy', certas >= feitas.length / 2 ? 'Você está indo muito bem!' : 'Boa! Continue assim!'] : ['rocket', feitas.length - certas > 3 ? 'Ainda dá pra aprender muito!' : 'Não desanime, ainda dá tempo!']
  const critico = !fim && tempo <= 10
  const estadoAlt = (k: number): EstadoAlt => (!fim ? (escolha === k ? 'selecionada' : 'padrao') : k === q.correta ? 'correta' : k === marcada ? 'errada' : 'apagada')

  return (
    <div className="bt-pagina">
      <Caminho itens={[['Batalhas', () => c.pedirSair('solo')], ['Batalha Solo', null]]} />
      <div className="bt-quiz" ref={topo}>
        <div className="bt-card bt-questao">
          <div className="bt-questao__topo">
            <b>
              Questão {i + 1} de {qs.length}
            </b>
            <Barra pct={((i + (fim ? 1 : 0.5)) / qs.length) * 100} />
            <span className={`bt-tempo ${critico || esgotou ? 'is-critico' : ''}`} aria-live="polite">
              <Clock size={22} /> {relogio(tempo)}
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={q.id} className="bt-questao__corpo" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Etiqueta id={q.disciplina} />
              <h1 className="bt-h-questao">{q.titulo}</h1>
              <p className="bt-contexto">{q.contexto}</p>
              <p className="bt-pergunta">{q.pergunta}</p>
              <p className="bt-sub is-15">{q.instrucao}</p>
              <div className="bt-alts" role="radiogroup" aria-label="Alternativas">
                {q.opcoes.map((o, k) => (
                  <Alternativa key={k} letra={LETRAS[k]} texto={o} estado={estadoAlt(k)} atalho={fim ? undefined : k + 1} disabled={fim} onClick={() => setEscolha(k)} />
                ))}
              </div>
              {fim && (
                <motion.div className={`bt-feedback ${certa ? 'is-ok' : 'is-erro'}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} role="status">
                  {certa ? <CheckCircle2 size={28} /> : <XCircle size={28} />}
                  <div>
                    <b>{certa ? 'Resposta correta!' : esgotou ? 'Tempo esgotado!' : 'Resposta incorreta'}</b>
                    <p>
                      {!certa && (
                        <>
                          A alternativa correta é a <strong>{LETRAS[q.correta]}</strong>.{' '}
                        </>
                      )}
                      {q.explicacao}
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
          <div className={`bt-acoes ${fim ? 'is-dir' : 'is-entre'}`}>
            {!fim && (
              <Btn v="outline" disabled={escolha === null} onClick={() => setEscolha(null)}>
                Limpar resposta
              </Btn>
            )}
            <Btn disabled={!fim && escolha === null} onClick={principal} style={{ minWidth: 230 }}>
              {fim && ultima ? 'Ver resultado' : 'Próxima questão'} <ArrowRight size={18} />
            </Btn>
          </div>
        </div>
        <aside className="bt-adversario">
          <div className={`bt-nexo ${fim && !certa ? 'is-lav' : ''}`}>
            <Selo />
            <div className="bt-nexo__arte">
              <AnimatePresence mode="wait">
                {!fim && <motion.img key="quiz" src="./bat/nexo-quiz.webp" alt="Nexo: Bora ver se você consegue me vencer?" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} />}
                {certa && <motion.img key="ok" src="./bat/nexo-correct.webp" alt="Nexo: Boa! Você mandou bem!" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} />}
                {fim && !certa && (
                  <motion.div key="erro" className="bt-nexo__erro" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <img src="./bat/nexo-thinking-solo.webp" alt="Nexo pensativo" />
                    <Balao>{esgotou ? 'Ih! O tempo acabou...' : 'Quase! Na próxima você acerta!'}</Balao>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="bt-nexo__info">
              <b>Nexo</b>
              <small>Seu adversário nesta batalha</small>
              <p>
                {status[0] === 'trophy' ? <Trophy size={20} className="bt-ouro-txt" /> : <Rocket size={20} className="bt-roxo" />} {status[1]}
              </p>
            </div>
          </div>
          <div className="bt-progresso">
            <b>Seu progresso</b>
            <ol>
              {qs.map((x, k) => {
                const feita = k < i || (k === i && fim)
                const e = k === i && !fim ? 'atual' : feita ? (resp[k] === x.correta ? 'correta' : 'incorreta') : k === i + 1 && fim ? 'proxima' : 'pendente'
                return <Quadrado key={x.id} n={k + 1} estado={e} />
              })}
            </ol>
          </div>
        </aside>
      </div>
    </div>
  )
}

/* =============================================================== 5 · Resultado */
const TXT_RES = {
  win: { a: 'Você ', b: 'venceu!', sub: 'Mandou muito bem e superou o Nexo nessa batalha de conhecimento!', cls: 'is-verde', titulo: 'Você atingiu o objetivo!' },
  tie: { a: 'Deu ', b: 'empate!', sub: 'Foi por pouco! O Nexo reconhece o seu esforço nessa batalha.', cls: 'is-lav', titulo: 'Faltou pouco para a vitória!' },
  loss: { a: 'Não foi ', b: 'dessa vez!', sub: 'O Nexo levou essa, mas cada erro é uma chance de aprender!', cls: 'is-vermelho', titulo: 'Objetivo não alcançado' },
}
export function SoloResultado({ c }: { c: Ctx }) {
  const b = c.soloAtual!
  const n = acertos(b.questoes, b.respostas)
  const r = desfechoSolo(n)
  const T = TXT_RES[r]
  const falta = 7 - n
  const texto = r === 'win' ? `Parabéns! Você venceu o Nexo com ${n} acertos. Continue nesse ritmo para se tornar um verdadeiro gênio do conhecimento!` : r === 'tie' ? `Você fez ${n} acertos. Com mais ${falta} ${falta === 1 ? 'acerto' : 'acertos'} você teria vencido o Nexo. Bora tentar de novo?` : `Você fez ${n} ${n === 1 ? 'acerto' : 'acertos'}. Confira o gabarito para revisar os conteúdos e tente novamente!`
  return (
    <div className="bt-pagina">
      <Caminho itens={[['Batalhas', () => c.ir('inicio')], ['Batalha Solo', () => c.ir('solo-intro')], ['Resultado', null]]} />
      <section className="bt-hero is-grad">
        <div className="bt-hero__txt">
          <Selo />
          <h1 className="bt-h-res">
            <Duas a={T.a} b={T.b} />
          </h1>
          <p className="bt-sub is-18">{T.sub}</p>
          <ul className="bt-numeros">
            <li>
              <CheckCircle2 size={32} className="bt-verde" />
              <span>
                <b>{n}</b>
                <small>acertos</small>
              </span>
            </li>
            <li>
              <XCircle size={32} className="bt-vermelho" />
              <span>
                <b>{TOTAL - n}</b>
                <small>erros</small>
              </span>
            </li>
            <li>
              <Zap size={32} className="bt-roxo" />
              <span>
                <b>{n * 10}%</b>
                <small>de aproveitamento</small>
              </span>
            </li>
          </ul>
          <div className={`bt-objetivo ${T.cls}`}>
            {r === 'win' ? <Trophy size={30} className="bt-ouro-txt" /> : <IconeResultado r={r} size={30} />}
            <div>
              <b>{T.titulo}</b>
              <p>{texto}</p>
            </div>
          </div>
        </div>
        <img className={`bt-hero__arte ${r === 'win' ? 'is-win' : 'is-nexo'}`} src={r === 'win' ? './bat/result-win.webp' : './bat/nexo-thinking.webp'} alt={r === 'win' ? 'Você comemorando a vitória enquanto o Nexo diz: Ainda não foi dessa vez...' : 'Nexo pensativo'} />
      </section>
      <div className="bt-dupla">
        <section className="bt-card">
          <h2 className="bt-h3">Tópicos desta batalha</h2>
          <p className="bt-sub is-15">
            Você escolheu {b.selecoes.length} {b.selecoes.length === 1 ? 'disciplina' : 'disciplinas'} e 1 tópico para cada uma.
          </p>
          <ul className="bt-lista-topicos">
            {b.selecoes.map((s) => (
              <li key={s.disciplina}>
                <IconeDisc id={s.disciplina} size={44} />
                <span>
                  <b>{nomeDisc(s.disciplina)}</b>
                  <small>{s.topico}</small>
                </span>
              </li>
            ))}
          </ul>
        </section>
        <section className="bt-card">
          <h2 className="bt-h3">Desempenho por tópico</h2>
          <p className="bt-sub is-15">Veja como você se saiu em cada tópico desta batalha.</p>
          <ul className="bt-desempenho">
            {porTopico(b).map((t) => {
              const p = Math.round((t.certas / t.total) * 100)
              return (
                <li key={t.disciplina}>
                  <IconeDisc id={t.disciplina} size={40} />
                  <b className="bt-so-largo">{nomeDisc(t.disciplina)}</b>
                  <span className="bt-desempenho__barra">
                    <span>
                      <small>
                        <span className="bt-so-cel">{nomeDisc(t.disciplina, true)} · </span>
                        {t.certas} de {t.total} acertos
                      </small>
                      <b>{p}%</b>
                    </span>
                    <Barra pct={Math.max(p, 2)} cor={p >= 70 ? 'var(--verde)' : p >= 50 ? '#f5b819' : 'var(--vermelho)'} trilho="#eef0f4" />
                  </span>
                </li>
              )
            })}
          </ul>
        </section>
      </div>
      <div className="bt-acoes is-tres">
        <Btn v="outline" onClick={() => c.ir('inicio')}>
          <ArrowLeft size={18} /> Voltar para Batalhas
        </Btn>
        <Btn v="secondary" onClick={() => c.ir('solo-gabarito')}>
          <BookOpen size={18} /> Ver gabarito completo
        </Btn>
        <Btn onClick={() => c.ir('solo-topicos')}>
          <Zap size={18} /> Iniciar nova batalha
        </Btn>
      </div>
    </div>
  )
}

/* =============================================================== 6 · Gabarito */
export function SoloGabarito({ c }: { c: Ctx }) {
  const b = c.soloAtual!
  const n = acertos(b.questoes, b.respostas)
  const r = desfechoSolo(n)
  const [aberta, setAberta] = useState<number | null>(null)
  return (
    <div className="bt-pagina">
      <Caminho itens={[['Batalhas', () => c.ir('inicio')], ['Batalha Solo', () => c.ir('solo-resultado')], ['Gabarito', null]]} />
      <section className="bt-hero is-grad is-baixo">
        <div className="bt-hero__txt">
          <Selo />
          <h1 className="bt-h1">Gabarito da batalha</h1>
          <p className="bt-sub is-17">Confira todas as questões, suas respostas e os conteúdos de cada uma.</p>
        </div>
        <img className="bt-hero__arte is-gab" src={r === 'win' ? './bat/gabarito-banner.webp' : './bat/nexo-thinking.webp'} alt="" />
      </section>
      <div className="bt-gab-topo">
        <section>
          <h2 className="bt-h4">Tópicos desta batalha</h2>
          <ul className="bt-gab-topicos">
            {b.selecoes.map((s) => (
              <li key={s.disciplina}>
                <IconeDisc id={s.disciplina} size={40} />
                <span>
                  <b>{nomeDisc(s.disciplina)}</b>
                  <small>{s.topico}</small>
                </span>
              </li>
            ))}
          </ul>
        </section>
        <section className={`bt-seu-res is-${r}`}>
          <b>Seu resultado</b>
          <div>
            {r === 'win' ? <Trophy size={36} className="bt-ouro-txt" /> : <IconeResultado r={r} size={34} />}
            <span>
              <strong>
                {n} de {TOTAL} acertos
              </strong>
              <small>{n * 10}% de aproveitamento</small>
            </span>
          </div>
        </section>
      </div>
      <section className="bt-card">
        <h2 className="bt-h4">{b.questoes.length} questões</h2>
        <ul className="bt-acordeao">
          {b.questoes.map((q, k) => {
            const meu = b.respostas[k]
            const ok = meu === q.correta
            const on = aberta === k
            return (
              <li key={q.id} className={on ? 'is-aberta' : ''}>
                <button className="bt-acordeao__cab" aria-expanded={on} onClick={() => setAberta(on ? null : k)}>
                  <span className="bt-num">{k + 1}</span>
                  <span className="bt-so-largo">
                    <Etiqueta id={q.disciplina} normal />
                  </span>
                  <span className="bt-acordeao__titulo">{q.titulo}</span>
                  <span className={`bt-res is-${ok ? 'verde' : 'vermelho'} is-gab`}>
                    {ok ? <CheckCircle2 size={18} /> : <XCircle size={18} />} <span className="bt-so-largo">{ok ? 'Correta' : 'Incorreta'}</span>
                  </span>
                  <ChevronDown size={16} className={`bt-gira ${on ? 'is-on' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div className="bt-acordeao__corpo" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                      <div>
                        <p className="bt-contexto is-14">{q.contexto}</p>
                        <p className="bt-pergunta is-15">{q.pergunta}</p>
                        <div className="bt-alts">
                          {q.opcoes.map((o, j) => (
                            <Alternativa key={j} letra={LETRAS[j]} texto={o} estado={j === q.correta ? 'correta' : j === meu ? 'errada' : 'apagada'} rotulo={j === meu ? 'Sua resposta' : j === q.correta ? 'Resposta correta' : undefined} disabled />
                          ))}
                        </div>
                        {meu === null && <p className="bt-vermelho is-13 bt-mt">Tempo esgotado — questão sem resposta.</p>}
                        <p className="bt-explicacao">
                          <b>Explicação: </b>
                          {q.explicacao}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            )
          })}
        </ul>
      </section>
      <div className="bt-acoes is-meio">
        <Btn v="outline" onClick={() => c.ir('inicio')}>
          <ArrowLeft size={18} /> Voltar para Batalhas
        </Btn>
        <Btn onClick={() => c.ir('solo-topicos')}>
          <Zap size={18} /> Iniciar nova batalha <ArrowRight size={18} />
        </Btn>
      </div>
    </div>
  )
}
