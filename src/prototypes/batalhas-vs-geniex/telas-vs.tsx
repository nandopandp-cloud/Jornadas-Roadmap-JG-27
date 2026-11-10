// Batalha VS (seções 7 a 13 do Figma).
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Award, Check, CheckCircle2, ChevronDown, ChevronRight, Clock, Equal, FileQuestion, Flag, GraduationCap, Hourglass, House, Info, Landmark, Lightbulb, List, Pencil, Plus, RefreshCw, Rocket, Search, Send, Star, Swords, Trophy, UserPlus, Users, X, XCircle, Zap } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Ctx } from './ctx'
import { ALUNOS, VS_DISC, type DiscId, type Questao, type Selecao } from './data'
import { MAX_DISC, MINHA_TURMA, TEMPO_VS, aluno, dataLonga, desfechoVS, nomeDisc, placarVS, prazoFinal, primeiroNome, relogio, situacao, type BatalhaVS } from './logica'
import { Alternativa, Avatar, Barra, Btn, Caminho, Duas, Etiqueta, IconeDisc, Marcador, Selo } from './pecas'

const LETRAS = ['A', 'B', 'C', 'D']
const nomeVS = (id: DiscId) => nomeDisc(id, true)

const HeroVS = ({ arte, bg, children, cls = '' }: { arte: string; bg: string; children: ReactNode; cls?: string }) => (
  <section className={`bt-hero is-vs ${cls}`} style={{ background: bg }}>
    <div className="bt-hero__txt">{children}</div>
    <img className="bt-hero__arte is-vs" src={`./bat/${arte}.webp`} alt="" />
  </section>
)
const ETAPAS = ['Escolher oponente', 'Selecionar tópicos', 'Confirmar desafio', 'Iniciar batalha']
function Etapas({ atual }: { atual: number }) {
  return (
    <>
      <p className="bt-etapa-cel">
        Etapa {atual + 1} de 4 · {ETAPAS[atual]}
      </p>
      <ol className="bt-etapas" aria-label="Etapas da Batalha VS">
        {ETAPAS.map((t, i) => (
          <li key={t} className={i < atual ? 'is-feita' : i === atual ? 'is-atual' : ''} aria-current={i === atual ? 'step' : undefined}>
            <span className="bt-etapas__n">{i < atual ? <Check size={14} strokeWidth={3} /> : i + 1}</span>
            <span className="bt-etapas__t">{t}</span>
            {i < 3 && <i />}
          </li>
        ))}
      </ol>
    </>
  )
}

/* =============================================================== Placar */
export function Placar({ eu, op, unidade, oponente, centro }: { eu: number | string; op: number | string; unidade: string; oponente: string; centro?: ReactNode }) {
  const a = aluno(oponente)
  return (
    <div className="bt-placar">
      <img className="bt-placar__fundo" src="./bat/banner.webp" alt="" />
      <span className="bt-placar__anel is-eu">
        <img src="./bat/av-voce.webp" alt="Você" />
      </span>
      <span className="bt-placar__nome is-eu">Você</span>
      <motion.span key={String(eu)} className="bt-placar__pts is-eu" initial={{ scale: 0.85 }} animate={{ scale: 1 }}>
        <b>{eu}</b>
        <small>{unidade}</small>
      </motion.span>
      <span className="bt-placar__pts is-op">
        <b>{op}</b>
        <small>{unidade}</small>
      </span>
      <span className="bt-placar__anel is-op">
        <img src={`./bat/av-${oponente}.webp`} alt={a.nome} />
      </span>
      <span className="bt-placar__nome is-op">{a.nome}</span>
      {centro && <div className="bt-placar__centro">{centro}</div>}
    </div>
  )
}

/* =============================================================== 7 · Introdução */
export function VsIntro({ c }: { c: Ctx }) {
  return (
    <div className="bt-pagina">
      <Caminho itens={[['Batalhas', () => c.ir('inicio')], ['Batalha VS', null], ['Introdução', null]]} />
      <HeroVS arte="hero-intro" bg="#f1f3fe" cls="is-alto">
        <Selo vs />
        <h1 className="bt-h1">
          <Duas a="Desafie um colega" b="e mostre o que você sabe!" quebra />
        </h1>
        <p className="bt-sub is-17">Escolha seus tópicos, responda 10 questões e compare seu desempenho com outro estudante da sua sala ou escola.</p>
        <ul className="bt-brancos">
          <li>
            <Users size={22} /> Desafie estudantes da sua sala ou escola
          </li>
          <li>
            <FileQuestion size={22} /> Mesmo formato da Batalha Solo · 10 questões
          </li>
          <li>
            <Clock size={22} /> Até 10 minutos para responder a sua rodada
          </li>
        </ul>
      </HeroVS>
      <section className="bt-card">
        <h2 className="bt-h3">Como funciona?</h2>
        <ol className="bt-passos">
          {[
            [UserPlus, '1. Escolha o oponente', 'Desafie um colega da sua sala ou escola.'],
            [List, '2. Selecione os tópicos', 'Escolha até 3 disciplinas e um tópico para cada uma.'],
            [Clock, '3. Responda 10 questões', 'Você terá até 10 minutos para concluir sua rodada.'],
            [Trophy, '4. Compare os resultados', 'Após os dois finalizarem, veja quem venceu!'],
          ].map(([I, t, s]) => {
            const Ic = I as typeof Clock
            return (
              <li key={t as string}>
                <Ic size={26} className="bt-roxo" />
                <span>
                  <b>{t as string}</b>
                  <small>{s as string}</small>
                </span>
              </li>
            )
          })}
        </ol>
      </section>
      <section className="bt-card">
        <h2 className="bt-h3">Quem posso desafiar?</h2>
        <p className="bt-sub is-14">Você verá apenas estudantes da sua sala ou escola e do mesmo ano escolar.</p>
        <div className="bt-regra-todos">
          <Users size={36} className="bt-roxo" />
          <span>
            <b>A mesma regra para todos</b>
            <small>Você e seu oponente responderão questões sobre as mesmas disciplinas e tópicos, mas com perguntas diferentes e equivalentes.</small>
          </span>
          <Btn v="link" onClick={() => c.ir('vs-lista')}>
            Ver minhas batalhas
          </Btn>
        </div>
      </section>
      <div className="bt-acoes is-meio">
        <Btn v="outline" onClick={() => c.ir('inicio')}>
          <ArrowLeft size={18} /> Voltar para Batalhas
        </Btn>
        <Btn onClick={() => c.ir('vs-oponente')}>
          Escolher oponente <ArrowRight size={18} />
        </Btn>
      </div>
    </div>
  )
}

/* =============================================================== 8 · Oponente */
export function VsOponente({ c }: { c: Ctx }) {
  const [q, setQ] = useState('')
  const [onde, setOnde] = useState<'sala' | 'escola'>('sala')
  const lista = useMemo(() => {
    const t = q.trim().toLocaleLowerCase('pt-BR')
    return ALUNOS.filter((a) => (onde === 'escola' || a.turma === MINHA_TURMA) && (!t || a.nome.toLocaleLowerCase('pt-BR').includes(t)))
  }, [q, onde])
  return (
    <div className="bt-pagina">
      <Caminho itens={[['Batalhas', () => c.ir('inicio')], ['Batalha VS', () => c.ir('vs-intro')], ['Escolher oponente', null]]} />
      <Etapas atual={0} />
      <HeroVS arte="hero-opponent" bg="#f0f3fd">
        <Selo vs />
        <h1 className="bt-h1">
          <Duas a="Escolha seu " b="oponente" />
        </h1>
        <p className="bt-sub is-17">Desafie um colega da sua sala ou escola e mostre o que você sabe!</p>
      </HeroVS>
      <div className="bt-filtros">
        <label className="bt-campo is-busca">
          <Search size={18} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nome" />
        </label>
        <label className="bt-select is-grande">
          <Users size={18} />
          <select value={onde} onChange={(e) => setOnde(e.target.value as 'sala' | 'escola')} aria-label="Turma">
            <option value="sala">Minha sala ({MINHA_TURMA})</option>
            <option value="escola">Minha escola (8º ano)</option>
          </select>
          <ChevronDown size={16} />
        </label>
        <label className="bt-select is-grande">
          <GraduationCap size={18} />
          <select defaultValue="8" aria-label="Ano escolar">
            <option value="8">8º ano</option>
          </select>
          <ChevronDown size={16} />
        </label>
      </div>
      <div>
        <h2 className="bt-h3">Estudantes disponíveis ({lista.length})</h2>
        <p className="bt-sub is-14">Você pode desafiar estudantes da sua sala ou escola e do mesmo ano escolar.</p>
      </div>
      {lista.length === 0 ? (
        <p className="bt-vazio">Nenhum estudante encontrado para “{q}”.</p>
      ) : (
        <ul className="bt-alunos">
          {lista.map((a) => (
            <li key={a.id} className={`bt-card bt-aluno ${c.vsOp === a.id ? 'is-on' : ''}`}>
              <span className="bt-aluno__foto">
                <Avatar id={a.id} size={88} cinza={!a.disponivel} />
                <i className={a.disponivel ? 'is-on' : ''} aria-label={a.disponivel ? 'Online' : 'Indisponível'} />
              </span>
              <b>{a.nome}</b>
              <small>{a.turma}</small>
              <Btn sm full disabled={!a.disponivel} v={a.disponivel ? 'default' : 'secondary'} onClick={() => c.escolherOponente(a.id)}>
                {a.disponivel ? (
                  <>
                    <Swords size={15} /> Desafiar
                  </>
                ) : (
                  <>
                    <Clock size={15} /> Indisponível
                  </>
                )}
              </Btn>
            </li>
          ))}
        </ul>
      )}
      <div className="bt-info">
        <Info size={30} />
        <span>
          <b>Não encontrou o colega que você quer desafiar?</b>
          <small>
            Apenas estudantes da sua sala ou escola e do mesmo ano escolar são exibidos aqui.{' '}
            {onde === 'sala' && (
              <button className="bt-link" onClick={() => setOnde('escola')}>
                Ver toda a escola
              </button>
            )}
          </small>
        </span>
      </div>
    </div>
  )
}

/* =============================================================== 9 · Tópicos */
export function VsTopicos({ c }: { c: Ctx }) {
  const [sel, setSel] = useState<Selecao[]>(c.vsSel)
  const [foco, setFoco] = useState<DiscId | null>(c.vsFoco ?? c.vsSel.find((s) => !s.topico)?.disciplina ?? c.vsSel[0]?.disciplina ?? null)
  const [treme, setTreme] = useState<DiscId | null>(null)
  const tem = (id: DiscId) => sel.some((s) => s.disciplina === id)
  const tocar = (id: DiscId) => {
    if (tem(id)) return setFoco(id)
    if (sel.length >= MAX_DISC) {
      setTreme(id)
      setTimeout(() => setTreme(null), 500)
      c.avisar({ tipo: 'alerta', titulo: 'Limite de disciplinas', texto: 'Você pode escolher até 3 disciplinas. Remova uma para trocar.' })
      return
    }
    setSel([...sel, { disciplina: id, topico: '' }])
    setFoco(id)
  }
  const remover = (id: DiscId) => {
    const n = sel.filter((s) => s.disciplina !== id)
    setSel(n)
    if (foco === id) setFoco(n[n.length - 1]?.disciplina ?? null)
  }
  const escolher = (t: string) => {
    const n = sel.map((s) => (s.disciplina === foco ? { ...s, topico: t } : s))
    setSel(n)
    const prox = n.find((s) => !s.topico)
    if (prox) setTimeout(() => setFoco(prox.disciplina), 250)
  }
  const pronto = sel.length > 0 && sel.every((s) => s.topico)
  const atual = sel.find((s) => s.disciplina === foco)?.topico
  const d = VS_DISC.find((x) => x.id === foco)
  return (
    <div className="bt-pagina">
      <Caminho itens={[['Batalhas', () => c.ir('inicio')], ['Batalha VS', () => c.ir('vs-intro')], ['Selecionar tópicos', null]]} />
      <Etapas atual={1} />
      <HeroVS arte="hero-topics" bg="#f8f9fe">
        <Selo vs />
        <h1 className="bt-h1">
          <Duas a="Escolha as disciplinas" b="e os tópicos" quebra />
        </h1>
        <p className="bt-sub is-17">Selecione de 1 a 3 disciplinas e um tópico para cada uma.</p>
        <p className="bt-sub is-14">Serão 10 questões no total, com pelo menos 3 questões de cada tópico.</p>
      </HeroVS>
      <div className="bt-vs-sel">
        <div className="bt-vs-sel__main">
          <section className="bt-card">
            <div className="bt-linha-entre">
              <h2 className="bt-h4">1. Selecione até 3 disciplinas</h2>
              <small aria-live="polite">{sel.length} de 3 selecionadas</small>
            </div>
            <div className="bt-grade-disc is-vs">
              {VS_DISC.map((x) => (
                <button key={x.id} className={`bt-disc-card is-baixo ${foco === x.id ? 'is-foco' : tem(x.id) ? 'is-on' : ''} ${treme === x.id ? 'is-treme' : ''}`} aria-pressed={tem(x.id)} onClick={() => tocar(x.id)}>
                  <Marcador on={tem(x.id)} />
                  <IconeDisc id={x.id} size={40} />
                  {nomeVS(x.id)}
                </button>
              ))}
            </div>
          </section>
          <section className="bt-card">
            {d ? (
              <>
                <div className="bt-linha-entre">
                  <h2 className="bt-h4">2. Escolha um tópico para {nomeVS(d.id)}</h2>
                  <Btn v="link" sm onClick={() => remover(d.id)}>
                    <RefreshCw size={15} /> Trocar disciplina
                  </Btn>
                </div>
                <div className="bt-radios" role="radiogroup" aria-label={`Tópicos de ${nomeVS(d.id)}`}>
                  {d.topicos.map((t) => (
                    <button key={t.nome} role="radio" aria-checked={atual === t.nome} className={`bt-radio ${atual === t.nome ? 'is-on' : ''}`} onClick={() => escolher(t.nome)}>
                      <i />
                      <span>
                        <b>{t.nome}</b>
                        <small>{t.desc}</small>
                      </span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h2 className="bt-h4">2. Escolha os tópicos</h2>
                <p className="bt-vazio">Selecione ao menos uma disciplina acima para escolher o tópico.</p>
              </>
            )}
          </section>
        </div>
        <aside className="bt-card bt-vs-sel__lado">
          <div className="bt-linha-entre">
            <h2 className="bt-h4">Sua seleção atual</h2>
            <small>{sel.length} de 3 disciplinas</small>
          </div>
          <ol className="bt-selecao">
            {[0, 1, 2].map((k) => {
              const s = sel[k]
              return (
                <li key={k}>
                  <span className="bt-selecao__n">{k + 1}</span>
                  {s ? (
                    <div className={`bt-selecao__item ${foco === s.disciplina ? 'is-foco' : ''}`}>
                      <button onClick={() => setFoco(s.disciplina)}>
                        <IconeDisc id={s.disciplina} size={40} />
                        <span>
                          <b>{nomeVS(s.disciplina)}</b>
                          <small className={s.topico ? '' : 'is-falta'}>{s.topico || 'Escolha um tópico'}</small>
                        </span>
                      </button>
                      <button className="bt-icone-btn is-sm" aria-label={`Remover ${nomeVS(s.disciplina)}`} onClick={() => remover(s.disciplina)}>
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="bt-selecao__vazio">
                      <span className="bt-tile is-cinza">
                        <Plus size={20} />
                      </span>
                      <span>
                        <b>Adicionar disciplina</b>
                        <small>Selecione uma disciplina e um tópico.</small>
                      </span>
                    </div>
                  )}
                </li>
              )
            })}
          </ol>
          <div className="bt-caixa-info">
            <b>Serão 10 questões no total</b>
            <ul>
              {['Pelo menos 3 questões de cada tópico', 'Ordem e quantidade de questões aleatórias', 'Você terá até 10 minutos para responder'].map((t) => (
                <li key={t}>
                  <CheckCircle2 size={15} /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="bt-caixa-info is-linha">
            <Lightbulb size={26} className="bt-roxo" />
            <span>
              <b>Lembre-se</b>
              <small>Você pode selecionar até 3 disciplinas, mas a batalha sempre terá 10 questões.</small>
            </span>
          </div>
          <Btn full disabled={!pronto} onClick={() => c.continuarTopicos(sel)}>
            Continuar <ArrowRight size={18} />
          </Btn>
          <Btn v="ghost" full onClick={() => c.ir('vs-oponente')}>
            Trocar oponente
          </Btn>
        </aside>
      </div>
    </div>
  )
}

/* =============================================================== 10 · Confirmar */
export function VsConfirmar({ c }: { c: Ctx }) {
  const b = c.vsAtual
  const modo: 'novo' | 'recebido' | 'retomar' = !b ? 'novo' : b.origem === 'recebido' ? 'recebido' : 'retomar'
  const op = aluno(b ? b.oponente : c.vsOp!)
  const sel = b ? b.selecoes : c.vsSel
  const pn = primeiroNome(op)
  const regras: [typeof Clock, string, string][] = [
    [FileQuestion, '10 questões', 'Em uma única rodada.'],
    [Clock, 'Até 10 minutos', 'Para responder todas as questões.'],
    [RefreshCw, 'Mesmas disciplinas e tópicos', 'Você e seu oponente jogarão com os mesmos conteúdos, mas com questões diferentes e equivalentes.'],
    [Users, 'Resultado por comparação de notas', 'Vence quem acertar mais questões. Em caso de empate, o resultado será empate.'],
    [Hourglass, modo === 'recebido' ? 'Prazo de 24 horas' : 'Prazo de 24 horas para o oponente', modo === 'recebido' ? `${pn} já jogou. Responda para descobrir quem venceu!` : 'Após o envio, seu colega terá até 24 horas para responder o desafio.'],
  ]
  return (
    <div className="bt-pagina">
      <Caminho itens={[['Batalhas', () => c.ir('inicio')], ['Batalha VS', () => c.ir('vs-intro')], [modo === 'novo' ? 'Confirmar desafio' : 'Iniciar batalha', null]]} />
      <Etapas atual={modo === 'novo' ? 2 : 3} />
      <HeroVS arte="hero-confirm" bg="#f4f7fe">
        <Selo vs />
        <h1 className="bt-h1">{modo === 'recebido' ? <Duas a={`${pn} te desafiou!`} b="Topa o desafio?" quebra /> : <Duas a="Tudo certo" b="para o desafio?" quebra />}</h1>
        <p className="bt-sub is-17">{modo === 'recebido' ? 'Confira os tópicos escolhidos pelo seu colega e comece a sua rodada quando estiver pronto.' : modo === 'retomar' ? 'Você ainda não concluiu sua rodada. Ao iniciar, o cronômetro de 10 minutos recomeça.' : 'Confira abaixo as informações da sua batalha antes de enviar o desafio para o seu colega.'}</p>
      </HeroVS>
      <div className="bt-tres">
        <section className="bt-card">
          <h2 className="bt-h4">Seu oponente</h2>
          <div className="bt-perfil-op">
            <Avatar id={op.id} size={140} />
            <b>{op.nome}</b>
            <small>{op.turma}</small>
            <ul>
              <li>
                <GraduationCap size={15} /> 8º ano
              </li>
              <li>
                <Users size={15} /> {op.turma === MINHA_TURMA ? 'Mesma sala' : 'Mesma escola'}
              </li>
              <li>
                <Landmark size={15} /> Escola GenieX
              </li>
            </ul>
            <p>“{op.bio}”</p>
          </div>
        </section>
        <section className="bt-card">
          <h2 className="bt-h4">Disciplinas e tópicos selecionados</h2>
          <ul className="bt-lista-sel">
            {sel.map((s) => {
              const corpo = (
                <>
                  <IconeDisc id={s.disciplina} size={48} />
                  <span>
                    <b>{nomeVS(s.disciplina)}</b>
                    <small>{s.topico}</small>
                  </span>
                  {modo === 'novo' && <ChevronRight size={16} />}
                </>
              )
              return <li key={s.disciplina}>{modo === 'novo' ? <button onClick={() => c.editarTopicos(s.disciplina)}>{corpo}</button> : <div>{corpo}</div>}</li>
            })}
          </ul>
          <div className="bt-caixa-info is-linha">
            <FileQuestion size={28} className="bt-roxo" />
            <span>
              <b>Serão 10 questões no total</b>
              <small>Com pelo menos 3 questões de cada tópico selecionado, em ordem e quantidade aleatória.</small>
            </span>
          </div>
        </section>
        <section className="bt-card">
          <div className="bt-linha-entre">
            <h2 className="bt-h4">Regras da batalha</h2>
            {modo === 'novo' && (
              <Btn v="link" sm onClick={() => c.editarTopicos()}>
                <Pencil size={15} /> Editar seleção
              </Btn>
            )}
          </div>
          <ul className="bt-regras-vs">
            {regras.map(([I, t, s]) => (
              <li key={t}>
                <I size={22} className="bt-roxo" />
                <span>
                  <b>{t}</b>
                  <small>{s}</small>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <div className="bt-acoes is-meio">
        <Btn v="outline" onClick={() => (modo === 'novo' ? c.editarTopicos() : c.ir('vs-lista'))}>
          <ArrowLeft size={18} /> {modo === 'novo' ? 'Voltar e editar seleção' : 'Voltar para minhas batalhas'}
        </Btn>
        <Btn onClick={() => (modo === 'novo' ? c.enviarDesafio() : c.jogarRodada())}>
          {modo === 'novo' ? <Send size={18} /> : <Zap size={18} />} {modo === 'novo' ? 'Enviar desafio' : modo === 'recebido' ? 'Aceitar e começar' : 'Iniciar batalha'} <ArrowRight size={18} />
        </Btn>
      </div>
    </div>
  )
}

/* =============================================================== 11 · Batalha em andamento */
function Grafico({ a, b }: { a: number; b: number }) {
  const X = (v: number) => 24 + ((v + 3) / 9) * 312
  const Y = (v: number) => 276 - ((v + 2) / 10) * 252
  return (
    <svg viewBox="0 0 360 300" className="bt-grafico" role="img" aria-label={`Gráfico da reta y = ${a}x + ${b}`}>
      {Array.from({ length: 10 }, (_, i) => i - 3).map((v) => (
        <line key={'x' + v} x1={X(v)} x2={X(v)} y1={Y(-2)} y2={Y(8)} stroke="#eceef5" />
      ))}
      {Array.from({ length: 11 }, (_, i) => i - 2).map((v) => (
        <line key={'y' + v} y1={Y(v)} y2={Y(v)} x1={X(-3)} x2={X(6)} stroke="#eceef5" />
      ))}
      <line x1={X(-3)} x2={X(6)} y1={Y(0)} y2={Y(0)} stroke="#0d0d0d" strokeWidth="1.6" />
      <line y1={Y(-2)} y2={Y(8)} x1={X(0)} x2={X(0)} stroke="#0d0d0d" strokeWidth="1.6" />
      <text x={X(6) - 4} y={Y(0) + 20} fontSize="15" fontWeight="600">
        x
      </text>
      <text x={X(0) - 18} y={Y(8) + 4} fontSize="15" fontWeight="600">
        y
      </text>
      <clipPath id="bt-plot">
        <rect x={X(-3)} y={Y(8)} width={X(6) - X(-3)} height={Y(-2) - Y(8)} />
      </clipPath>
      <g clipPath="url(#bt-plot)">
        <line x1={X(-3)} y1={Y(a * -3 + b)} x2={X(6)} y2={Y(a * 6 + b)} stroke="#5258e4" strokeWidth="2.6" />
      </g>
      <circle cx={X(0)} cy={Y(b)} r="4.5" fill="#5258e4" />
    </svg>
  )
}

export function VsQuiz({ c }: { c: Ctx }) {
  const b = c.vsAtual!
  const qs = b.questoes
  const [i, setI] = useState(0)
  const [resp, setResp] = useState<(number | null)[]>(() => qs.map(() => null))
  const [escolha, setEscolha] = useState<number | null>(null)
  const [tempo, setTempo] = useState(TEMPO_VS)
  const q: Questao = qs[i]
  const ultima = i === qs.length - 1
  const pontos = resp.filter((r, k) => k < i && r === qs[k].correta).length
  const responder = useCallback(() => {
    if (escolha === null) return
    const n = [...resp]
    n[i] = escolha
    setResp(n)
    if (ultima) return c.fimVS(n)
    setI(i + 1)
    setEscolha(null)
    document.querySelector('.bt-rolagem')?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [escolha, resp, i, ultima, c])
  // 10 minutos para a rodada inteira (continua correndo com o modal de reporte aberto)
  useEffect(() => {
    if (tempo <= 0) {
      const n = [...resp]
      n[i] = escolha
      c.avisar({ tipo: 'alerta', titulo: 'O tempo acabou!', texto: 'Suas respostas foram enviadas. Agora é só aguardar o seu oponente.' })
      c.fimVS(n)
      return
    }
    const t = setTimeout(() => setTempo((x) => x - 1), 1000)
    return () => clearTimeout(t)
  }, [tempo]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (c.modalAberto) return
      const k = e.key.toLowerCase()
      const n = ['1', '2', '3', '4'].indexOf(k)
      const l = ['a', 'b', 'c', 'd'].indexOf(k)
      if (n >= 0 || l >= 0) setEscolha(n >= 0 ? n : l)
      if (k === 'enter' && !(e.target instanceof HTMLButtonElement)) responder()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [responder, c.modalAberto])
  const critico = tempo <= 60
  const relogioCard = (
    <div className={`bt-relogio ${critico ? 'is-critico' : ''}`}>
      <Clock size={30} />
      <span>Tempo restante</span>
      <b>{relogio(tempo)}</b>
      <Barra pct={(tempo / TEMPO_VS) * 100} altura={10} trilho="#d6d9e8" cor={critico ? 'var(--vermelho)' : 'linear-gradient(90deg,#5258e4,#8c90f5)'} />
    </div>
  )
  return (
    <div className="bt-pagina">
      <Caminho itens={[['Batalhas', () => c.pedirSair('vs')], ['Batalha VS', () => c.pedirSair('vs')], ['Batalha em andamento', null]]} />
      <Placar eu={pontos} op={0} unidade="pontos" oponente={b.oponente} centro={relogioCard} />
      <div className={`bt-tempo-cel ${critico ? 'is-critico' : ''}`}>
        <Clock size={20} /> <b>{relogio(tempo)}</b>
        <Barra pct={(tempo / TEMPO_VS) * 100} cor={critico ? 'var(--vermelho)' : 'var(--primaria)'} />
      </div>
      <div className="bt-vs-prog">
        <div>
          <b>
            Questão {i + 1} de {qs.length}
          </b>
          <Barra pct={((i + 1) / qs.length) * 100} altura={10} trilho="#e3e5ee" />
        </div>
        <ul>
          {b.selecoes.map((s) => {
            const at = s.disciplina === q.disciplina
            return (
              <li key={s.disciplina} className={at ? 'is-atual' : ''}>
                <IconeDisc id={s.disciplina} size={36} apagado={!at} />
                <span>
                  <b>{nomeVS(s.disciplina)}</b>
                  <small>{s.topico}</small>
                </span>
              </li>
            )
          })}
        </ul>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={q.id} className="bt-vs-questao" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          <div>
            <Etiqueta id={q.disciplina} />
            <p className={`bt-contexto is-forte ${q.grafico ? 'is-semi' : ''}`}>{q.contexto}</p>
            {q.grafico && <Grafico a={q.grafico.a} b={q.grafico.b} />}
          </div>
          <div>
            <p className="bt-pergunta is-titulo">{q.pergunta}</p>
            <div className="bt-alts" role="radiogroup" aria-label="Alternativas">
              {q.opcoes.map((o, k) => (
                <Alternativa key={k} letra={LETRAS[k]} texto={o} estado={escolha === k ? 'selecionada' : 'padrao'} atalho={k + 1} onClick={() => setEscolha(k)} />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="bt-acoes is-entre is-vs">
        <Btn v="outline" className="bt-roxo" onClick={c.abrirReportar}>
          <Flag size={18} /> Reportar questão
        </Btn>
        <Btn disabled={escolha === null} onClick={responder} style={{ minWidth: 300 }}>
          {ultima ? 'Responder e finalizar' : 'Responder e continuar'} <ArrowRight size={18} />
        </Btn>
      </div>
    </div>
  )
}

/* =============================================================== 12 · Resultado */
const VSR = {
  win: ['Você venceu!', 'is-verde', (n: string) => `Parabéns! Você acertou mais questões que ${n}.`],
  tie: ['Empate!', 'is-branco', (n: string) => `Você e ${n} acertaram a mesma quantidade de questões.`],
  loss: ['Não foi dessa vez', 'is-rosa', (n: string) => `${n} acertou mais questões. Revise o gabarito e peça revanche!`],
  wo: ['Vitória por W.O.', 'is-ouro', (n: string) => `${n} não respondeu no prazo de 24 horas.`],
} as const
export function VsResultado({ c }: { c: Ctx }) {
  const b = c.vsAtual!
  const op = aluno(b.oponente)
  const pn = primeiroNome(op)
  const sit = situacao(b)
  const r = desfechoVS(b)
  const ag = sit === 'aguardando'
  const eu = placarVS(b)
  const tot = b.questoes.length
  const pct = Math.round((eu / tot) * 100)
  const [filtro, setFiltro] = useState<DiscId | 'todas'>('todas')
  const [aberta, setAberta] = useState<number | null>(null)
  const resp = b.respostas ?? []
  const cor = pct >= 60 ? ['#1fa457', '#e6f8ee', '#17924a'] : pct >= 40 ? ['#e08a0b', '#fff3e0', '#b45309'] : ['#e5484d', '#fdeced', '#c81e24']
  const frase = pct >= 80 ? 'Muito bem!' : pct >= 60 ? 'Bom trabalho!' : pct >= 40 ? 'Continue praticando!' : 'Bora revisar!'
  const centro = ag ? (
    <>
      <img className="bt-ampulheta" src="./bat/hourglass.webp" alt="" />
      <span className="bt-placar-selo is-ouro">Aguardando o oponente</span>
      <p>
        Você já finalizou o quiz!
        <br />
        Agora é só aguardar {pn} responder
        <br />
        (ou até 24 horas).
      </p>
    </>
  ) : r ? (
    <>
      {r === 'loss' ? <Award size={64} className="bt-medalha-off" /> : <Trophy size={64} className="bt-trofeu" />}
      <span className={`bt-placar-selo ${VSR[r][1]}`}>{VSR[r][0]}</span>
      <p>{VSR[r][2](pn)}</p>
    </>
  ) : null
  const porDisc = b.selecoes.map((s) => {
    const idx = b.questoes.map((q, k) => (q.disciplina === s.disciplina ? k : -1)).filter((k) => k >= 0)
    return { ...s, total: idx.length, certas: idx.filter((k) => resp[k] === b.questoes[k].correta).length }
  })
  const C = 2 * Math.PI * 66
  return (
    <div className="bt-pagina">
      <Caminho itens={[['Batalhas', () => c.ir('inicio')], ['Batalha VS', () => c.ir('vs-intro')], [ag ? 'Quiz finalizado' : 'Resultado', null]]} />
      <Placar eu={eu} op={sit === 'finalizada' ? b.placarOponente! : sit === 'expirada' ? 0 : '?'} unidade="acertos" oponente={b.oponente} centro={centro} />
      <div className="bt-situacao-cel">{centro}</div>
      <div className="bt-vs-res">
        <section className="bt-card">
          <h1 className="bt-h3">Suas respostas</h1>
          <p className="bt-sub is-14">Veja o resultado de cada questão e o gabarito.</p>
          <div className="bt-filtro-disc" role="tablist" aria-label="Filtrar por disciplina">
            <button role="tab" aria-selected={filtro === 'todas'} className={filtro === 'todas' ? 'is-on' : ''} onClick={() => setFiltro('todas')}>
              <b>Todas</b>
              <small>
                {eu}/{tot}
              </small>
            </button>
            {porDisc.map((d) => (
              <button key={d.disciplina} role="tab" aria-selected={filtro === d.disciplina} className={filtro === d.disciplina ? 'is-on' : ''} onClick={() => setFiltro(filtro === d.disciplina ? 'todas' : d.disciplina)}>
                <IconeDisc id={d.disciplina} size={32} apagado={filtro !== 'todas' && filtro !== d.disciplina} />
                <span>
                  <b>{nomeVS(d.disciplina)}</b>
                  <small>
                    {d.certas}/{d.total} acertos
                  </small>
                </span>
              </button>
            ))}
          </div>
          <ol className="bt-respostas">
            {b.questoes.map((q, k) => {
              if (filtro !== 'todas' && q.disciplina !== filtro) return null
              const ok = resp[k] === q.correta
              const on = aberta === k
              return (
                <li key={q.id} className={on ? 'is-aberta' : ''}>
                  <div className="bt-respostas__cab">
                    <span className="bt-num is-redondo">{k + 1}</span>
                    {ok ? <CheckCircle2 size={26} className="bt-verde" aria-label="Correta" /> : <XCircle size={26} className="bt-vermelho" aria-label="Incorreta" />}
                    <span className="bt-respostas__p">{q.pergunta}</span>
                    <Btn v="secondary" sm onClick={() => setAberta(on ? null : k)}>
                      {on ? 'Ocultar' : 'Ver resposta'} {on ? <ChevronDown size={14} style={{ transform: 'rotate(180deg)' }} /> : <ChevronRight size={14} />}
                    </Btn>
                  </div>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div className="bt-acordeao__corpo" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                        <div>
                          <Etiqueta id={q.disciplina} normal />
                          <p className="bt-contexto is-14">{q.contexto}</p>
                          {q.grafico && <Grafico a={q.grafico.a} b={q.grafico.b} />}
                          <p className="bt-pergunta is-15">{q.pergunta}</p>
                          <div className="bt-alts">
                            {q.opcoes.map((o, j) => (
                              <Alternativa key={j} letra={LETRAS[j]} texto={o} estado={j === q.correta ? 'correta' : j === resp[k] ? 'errada' : 'apagada'} rotulo={j === resp[k] ? 'Sua resposta' : j === q.correta ? 'Resposta correta' : undefined} disabled />
                            ))}
                          </div>
                          {resp[k] === null && <p className="bt-vermelho is-13 bt-mt">Tempo esgotado: questão sem resposta.</p>}
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
          </ol>
        </section>
        <aside className="bt-card bt-desempenho-vs">
          <h2 className="bt-h3">Seu desempenho</h2>
          <div className="bt-anel-linha">
            <div className="bt-anel">
              <svg viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="66" fill="none" stroke="#eef0f5" strokeWidth="14" />
                <motion.circle cx="80" cy="80" r="66" fill="none" stroke={cor[0]} strokeWidth="14" strokeLinecap="round" strokeDasharray={C} initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C * (1 - eu / tot) }} transition={{ duration: 1 }} transform="rotate(-90 80 80)" />
              </svg>
              <span>
                <b>{eu}</b>
                <small>de {tot}</small>
                <small>acertos</small>
              </span>
            </div>
            <div>
              <b className="bt-pct" style={{ color: cor[0] }}>
                {pct}%
              </b>
              <small>de aproveitamento</small>
              <span className="bt-frase" style={{ background: cor[1], color: cor[2] }}>
                <Star size={16} /> {frase}
              </span>
            </div>
          </div>
          {ag ? (
            <>
              <div className="bt-caixa-info is-linha">
                <Hourglass size={26} className="bt-ouro-txt" />
                <span>
                  <b>Aguardando o resultado final</b>
                  <small>{pn} também está fazendo o desafio. Assim que terminar (ou em até 24 horas), você verá quem venceu.</small>
                </span>
              </div>
              <div className="bt-caixa-info is-linha">
                <Clock size={26} className="bt-roxo" />
                <span>
                  <b>Prazo da batalha</b>
                  <small>O resultado será definido até {dataLonga(prazoFinal(b))}. Se o seu oponente não finalizar, você vence por W.O.</small>
                </span>
              </div>
            </>
          ) : (
            <div className="bt-comparacao">
              <div>
                <small>Você</small>
                <b className="bt-roxo">{eu}</b>
                <small>acertos</small>
              </div>
              <div>
                <small>{op.nome}</small>
                <b style={{ color: '#7917fa' }}>{sit === 'expirada' ? 0 : b.placarOponente}</b>
                <small>{sit === 'expirada' ? 'não respondeu' : 'acertos'}</small>
              </div>
            </div>
          )}
          {!ag && (
            <Btn full onClick={c.revanche}>
              <RefreshCw size={18} /> {r === 'loss' ? 'Pedir revanche' : `Desafiar ${pn} de novo`}
            </Btn>
          )}
          <Btn full v={ag ? 'default' : 'outline'} onClick={() => c.ir('vs-lista')}>
            <Users size={18} /> Ver minhas batalhas <ArrowRight size={18} />
          </Btn>
          <Btn full v="outline" onClick={() => c.ir('inicio')}>
            <House size={18} /> Voltar para a página inicial
          </Btn>
        </aside>
      </div>
    </div>
  )
}

/* =============================================================== 13 · Minhas batalhas */
const ABAS = [
  ['todas', 'Todas', () => true],
  ['andamento', 'Em andamento', (s: string) => s === 'andamento'],
  ['aguardando', 'Aguardando oponente', (s: string) => s === 'aguardando'],
  ['finalizadas', 'Finalizadas', (s: string) => s === 'finalizada' || s === 'expirada'],
] as const
function Status({ b }: { b: BatalhaVS }) {
  const s = situacao(b)
  const r = desfechoVS(b)
  const pn = primeiroNome(aluno(b.oponente))
  let p: [string, string, ReactNode]
  let quando: string
  let obs: string | null = null
  if (s === 'andamento') {
    p = [b.origem === 'recebido' ? 'Sua vez de jogar' : 'Rodada não concluída', 'is-lav', <Rocket size={16} key="i" />]
    quando = `${b.origem === 'recebido' ? 'Desafio recebido' : 'Desafio criado'} em ${dataLonga(b.criadaEm)}`
    obs = b.origem === 'recebido' ? `${pn} já jogou. Responda para ver o resultado!` : 'Termine sua rodada para enviar o desafio.'
  } else if (s === 'aguardando') {
    p = ['Aguardando oponente', 'is-laranja', <Clock size={16} key="i" />]
    quando = `Desafio enviado em ${dataLonga(b.finalizadaEm!)}`
    obs = `Aguardando ${pn} responder.`
  } else if (s === 'expirada') {
    p = ['Expirada (W.O.)', 'is-cinza', <Hourglass size={16} key="i" />]
    quando = `Expirou em ${dataLonga(prazoFinal(b))}`
    obs = 'O oponente não respondeu no prazo.'
  } else {
    p = r === 'win' ? ['Finalizada (Você venceu)', 'is-verde', <CheckCircle2 size={16} key="i" />] : r === 'loss' ? ['Finalizada (Você perdeu)', 'is-vermelho', <XCircle size={16} key="i" />] : ['Finalizada (Empate)', 'is-cinza', <Equal size={16} key="i" />]
    quando = `Concluída em ${dataLonga(b.finalizadaEm!)}`
  }
  return (
    <div className="bt-status">
      <span className={`bt-status__pil ${p[1]}`}>
        {p[2]} {p[0]}
      </span>
      <small>{quando}</small>
      {obs && <small>{obs}</small>}
    </div>
  )
}
export function VsLista({ c }: { c: Ctx }) {
  const [aba, setAba] = useState<string>('todas')
  const ordem = [...c.vs].sort((a, b) => (b.finalizadaEm ?? b.criadaEm).localeCompare(a.finalizadaEm ?? a.criadaEm))
  const sit = new Map(ordem.map((b) => [b.id, situacao(b)]))
  const lista = ordem.filter((b) => ABAS.find((x) => x[0] === aba)![2](sit.get(b.id)!))
  return (
    <div className="bt-pagina">
      <Caminho itens={[['Batalhas', () => c.ir('inicio')], ['Minhas batalhas', null]]} />
      <HeroVS arte="hero-list" bg="#f4f6fd" cls="is-lista">
        <h1 className="bt-h-res is-46">
          <Duas a="Minhas " b="batalhas" />
        </h1>
        <p className="bt-sub is-17">Veja todas as suas batalhas, acompanhe os resultados e desafie novos colegas!</p>
      </HeroVS>
      <div className="bt-lista-barra">
        <div className="bt-abas" role="tablist" aria-label="Filtrar batalhas">
          {ABAS.map(([id, nome, fn]) => (
            <button key={id} role="tab" aria-selected={aba === id} className={aba === id ? 'is-on' : ''} onClick={() => setAba(id)}>
              {nome} <i>{ordem.filter((b) => fn(sit.get(b.id)!)).length}</i>
            </button>
          ))}
        </div>
        <Btn onClick={c.novaVS}>
          <Plus size={18} /> Nova batalha
        </Btn>
      </div>
      <ul className="bt-batalhas">
        {lista.length === 0 && (
          <li className="bt-vazio">
            Nenhuma batalha por aqui.{' '}
            <button className="bt-link" onClick={c.novaVS}>
              Desafie um colega
            </button>
          </li>
        )}
        {lista.map((b) => {
          const a = aluno(b.oponente)
          const s = sit.get(b.id)!
          const r = desfechoVS(b)
          const eu = s !== 'andamento' ? placarVS(b) : null
          const op = s === 'finalizada' ? b.placarOponente : s === 'expirada' ? 0 : null
          return (
            <li key={b.id}>
              <button className="bt-card bt-batalha" onClick={() => c.abrirVS(b.id)} aria-label={`Abrir batalha contra ${a.nome}`}>
                <Avatar id={a.id} size={64} />
                <span className="bt-batalha__nome">
                  <b>{a.nome}</b>
                  <small>{a.turma}</small>
                  <small>Escola GenieX</small>
                </span>
                <span className="bt-batalha__topicos">
                  {b.selecoes.map((t) => (
                    <span key={t.disciplina}>
                      <IconeDisc id={t.disciplina} size={26} />
                      <span>
                        <b>{nomeVS(t.disciplina)}</b>
                        <small>{t.topico}</small>
                      </span>
                    </span>
                  ))}
                </span>
                <Status b={b} />
                <span className="bt-batalha__placar">
                  <span>
                    <small>Você</small>
                    <b className={eu === null ? 'is-apagado' : 'bt-roxo'}>{eu ?? '–'}</b>
                    <small>acertos</small>
                  </span>
                  <span>
                    <small>Oponente</small>
                    <b className={op === null ? 'is-apagado' : r === 'loss' ? 'bt-vermelho' : 'is-op'}>{op ?? '?'}</b>
                    <small>acertos</small>
                  </span>
                </span>
                <ChevronRight size={22} className="bt-roxo bt-batalha__seta" />
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
