// Telas da batalha: nova batalha (oponente, disciplinas e tópicos, resumo), questão, resultado e revisão.
import { ArrowLeft, ArrowRight, Award, BarChart3, BookOpen, Building2, Check, CheckCircle2, ChevronDown, ChevronUp, Clock, Equal, FileCheck2, Flag, GraduationCap, Hourglass, Info, Lightbulb, LogOut, Search, Send, Swords, Target, Timer, TrendingUp, Trophy, TriangleAlert, Users, X, XCircle, Zap, Calendar, ArrowUpDown } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Alternativa } from '../batalhas-vs-geniex/pecas'
import type { Ctx } from './ctx'
import { COPA, DISC, EU, TOPICOS, aluno, primeiro, type DiscId, type Selecao } from './data'
import { TEMPO, acertos, duracao, minSeg, ranking, relogio, restante, situacao, tempoMedioAcertos } from './logica'
import { Aviso, Av, BarraAcoes, Btn, Cab, DiscIco, Etapas, Numero, Selo, TitCard } from './pecas'
import { CardOponente } from './telas-copa'

const LETRAS = ['A', 'B', 'C', 'D', 'E']
const caminhoNova: [string, 'lista' | 'visao' | null][] = [['Campeonatos', 'lista'], [COPA.nome, 'visao'], ['Nova batalha', null]]

/* ------------------------------------------------------------------ 6 · oponente */
export function Oponente({ c }: { c: Ctx }) {
  const [busca, setBusca] = useState('')
  const [turma, setTurma] = useState('todas')
  const [ordem, setOrdem] = useState<'pos' | 'nome'>('pos')
  const lista = c.rank.filter((l) => l.id !== EU && (turma === 'todas' || l.turma === turma) && l.nome.toLowerCase().includes(busca.toLowerCase())).sort((a, b) => (ordem === 'pos' ? a.pos - b.pos : a.nome.localeCompare(b.nome, 'pt-BR')))
  const op = c.op ? aluno(c.op) : null
  return (
    <div className="bt-pagina">
      <Cab c={c} caminho={caminhoNova} titulo="Nova batalha" sub="Escolha um colega da sua escola para disputar esta batalha." />
      <Etapas atual={1} celular={c.celular} />
      <section className="cp-banner">
        <div>
          <small>QUEM VAI SER SEU DESAFIO?</small>
          <h2>Escolha seu oponente</h2>
          <p className="bt-sub is-15">Você pode desafiar qualquer estudante do 1º ano da sua escola que participe da Copa.</p>
        </div>
        <img src="./camp/banner-oponente.webp" alt="" />
      </section>
      <div className="cp-duas is-lado-300">
        <div className="cp-coluna">
          <div className="cp-filtros is-3">
            <label className="bt-campo">
              <Search size={18} />
              <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por nome" aria-label="Buscar por nome" />
            </label>
            <label className="bt-select is-grande">
              <select value={turma} onChange={(e) => setTurma(e.target.value)} aria-label="Turma">
                <option value="todas">Todas as turmas</option>
                {['1º ano A', '1º ano B', '1º ano C'].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              <ChevronDown size={16} />
            </label>
            <label className="bt-select is-grande">
              <ArrowUpDown size={16} />
              <select value={ordem} onChange={(e) => setOrdem(e.target.value as 'pos' | 'nome')} aria-label="Ordenar por">
                <option value="pos">Posição no ranking</option>
                <option value="nome">Nome (A–Z)</option>
              </select>
              <ChevronDown size={16} />
            </label>
          </div>
          <div className="cp-grade is-3">
            {lista.map((l) => (
              <CardOponente key={l.id} id={l.id} pos={l.pos} sel={c.op === l.id} onClick={() => c.escolherOponente(c.op === l.id ? null : l.id)} />
            ))}
            {!lista.length && <p className="bt-sub is-14">Nenhum colega encontrado com esse filtro.</p>}
          </div>
        </div>
        <section className="bt-card cp-stack cp-lilas">
          <TitCard icone={Users}>Quem você pode desafiar</TitCard>
          {(
            [
              [Building2, 'Mesma escola', 'Só estudantes da Escola GenieX.'],
              [GraduationCap, 'Mesmo ano escolar', 'As batalhas são entre estudantes do 1º ano.'],
              [Users, 'Qualquer turma', 'Colegas da sua turma ou de outras turmas.'],
              [XCircle, 'Você não aparece na lista', 'Não é possível desafiar a si mesmo.'],
            ] as const
          ).map(([I, t, d]) => (
            <p key={t} className="cp-regrinha">
              <I size={20} />
              <span>
                <b>{t}</b>
                <small>{d}</small>
              </span>
            </p>
          ))}
        </section>
      </div>
      <BarraAcoes
        acoes={
          <>
            <Btn v="outline" onClick={() => c.ir('visao')}>
              Cancelar
            </Btn>
            <Btn disabled={!op} onClick={() => c.ir('disciplinas')}>
              Continuar <ArrowRight size={18} />
            </Btn>
          </>
        }
      >
        {op ? (
          <>
            <Av id={op.id} size={44} />
            <span>
              <small>Oponente escolhido</small>
              <b>
                {op.nome} · {op.turma}
              </b>
            </span>
          </>
        ) : (
          <b className="cp-suave">Escolha um oponente para continuar</b>
        )}
      </BarraAcoes>
    </div>
  )
}

/* ------------------------------------------------------------------ 7 · disciplinas e tópicos */
export function Disciplinas({ c }: { c: Ctx }) {
  const [marcadas, setMarcadas] = useState<Partial<Record<DiscId, string>>>(() => Object.fromEntries(c.sel.map((s) => [s.disciplina, s.topico])))
  const ds = COPA.disc.filter((d) => d in marcadas)
  const faltam = ds.filter((d) => !marcadas[d])
  const ok = ds.length > 0 && faltam.length === 0
  const [tentou, setTentou] = useState(false)
  const op = aluno(c.op ?? 'bruno')
  const alternar = (d: DiscId) => setMarcadas((m) => { const n = { ...m }; if (d in n) delete n[d]; else n[d] = ''; return n })
  const continuar = () => {
    if (!ok) return setTentou(true)
    c.definirSel(ds.map((d) => ({ disciplina: d, topico: marcadas[d]! })))
    c.ir('resumo')
  }
  return (
    <div className="bt-pagina">
      <Cab c={c} caminho={caminhoNova} titulo="Nova batalha" sub="Escolha de 1 a 3 disciplinas da Copa e 1 tópico de cada." />
      <Etapas atual={2} celular={c.celular} />
      <div className="cp-duas is-lado-340">
        <section className="bt-card cp-stack">
          <TitCard icone={BookOpen} extra={<span className="cp-contagem">{ds.length} de 3</span>}>
            Disciplinas e tópicos
          </TitCard>
          <p className="bt-sub is-14">Você pode escolher até 3 disciplinas. Para cada uma, escolha 1 tópico.</p>
          {COPA.disc.map((d) => {
            const on = d in marcadas
            const erro = on && !marcadas[d] && tentou
            return (
              <div key={d} className={`cp-disc-card ${on ? 'is-on' : ''}`}>
                <button className="cp-disc-card__cab" role="checkbox" aria-checked={on} onClick={() => alternar(d)}>
                  <i className="cp-check">{on && <Check size={14} strokeWidth={3} />}</i>
                  <DiscIco d={d} size={40} />
                  <span>
                    <b>{DISC[d].nome}</b>
                    <small>{TOPICOS[d].length} tópicos disponíveis</small>
                  </span>
                </button>
                {on && (
                  <label className="cp-topico">
                    <b>Tópico de {DISC[d].nome}</b>
                    <span className={`bt-select is-grande ${erro ? 'is-erro' : ''}`}>
                      <select className={marcadas[d] ? '' : 'is-vazio'} value={marcadas[d]} onChange={(e) => setMarcadas((m) => ({ ...m, [d]: e.target.value }))} aria-label={`Tópico de ${DISC[d].nome}`}>
                        <option value="" disabled>
                          Escolha um tópico
                        </option>
                        {TOPICOS[d].map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} />
                    </span>
                    {erro && <small className="cp-erro">Escolha 1 tópico para {DISC[d].nome}.</small>}
                  </label>
                )}
              </div>
            )
          })}
          <Aviso icone={Info}>A batalha tem 10 questões, com pelo menos 3 de cada tópico escolhido, em ordem aleatória.</Aviso>
        </section>
        <section className="bt-card cp-stack">
          <TitCard icone={Swords}>Sua batalha</TitCard>
          <div className="cp-escolhido">
            <Av id={op.id} size={44} />
            <span>
              <small>Oponente</small>
              <b>
                {op.nome} · {op.turma}
              </b>
            </span>
          </div>
          <hr className="cp-hr" />
          <small className="cp-mini-t">Conteúdos</small>
          {ds.length ? (
            ds.map((d) => (
              <div key={d} className="cp-conteudo">
                <DiscIco d={d} size={32} />
                <span>
                  <b>{DISC[d].nome}</b>
                  <small className={marcadas[d] ? '' : 'cp-alerta-txt'}>{marcadas[d] || 'Falta escolher o tópico'}</small>
                </span>
                {marcadas[d] ? <CheckCircle2 size={18} color="#007A4D" /> : <TriangleAlert size={18} color="#B45309" />}
              </div>
            ))
          ) : (
            <p className="bt-sub is-13">Nenhuma disciplina escolhida.</p>
          )}
          <hr className="cp-hr" />
          <p className="cp-regrinha">
            <FileCheck2 size={20} /> <span>10 questões</span>
          </p>
          <p className="cp-regrinha">
            <Clock size={20} /> <span>10 minutos para responder</span>
          </p>
          <p className="cp-regrinha">
            <Hourglass size={20} /> <span>{primeiro(op.id)} terá 24 h para responder</span>
          </p>
        </section>
      </div>
      <BarraAcoes
        acoes={
          <>
            <Btn v="outline" onClick={() => c.ir('oponente')}>
              <ArrowLeft size={18} /> Voltar
            </Btn>
            <Btn disabled={!ok} onClick={continuar}>
              Continuar <ArrowRight size={18} />
            </Btn>
          </>
        }
      >
        <b className={ok ? '' : 'cp-alerta-txt'}>{!ds.length ? 'Escolha pelo menos 1 disciplina' : faltam.length ? `Falta escolher ${faltam.length} tópico${faltam.length > 1 ? 's' : ''}` : `${ds.length} disciplina${ds.length > 1 ? 's' : ''} · ${ds.length} tópico${ds.length > 1 ? 's' : ''}`}</b>
      </BarraAcoes>
    </div>
  )
}

/* ------------------------------------------------------------------ 8 · resumo */
function Jogador({ id, rot, pos }: { id: string; rot: string; pos: number }) {
  const a = aluno(id)
  return (
    <div className={`cp-jogador ${id === EU ? 'is-eu' : ''}`}>
      <small>{rot}</small>
      <Av id={id} size={88} />
      <Selo pos={pos} />
      <b>{a.nome}</b>
      <small>{a.turma}</small>
      <p className="cp-op__nums">
        <span>
          <Trophy size={17} color="#C59319" /> {a.id === EU ? '' : a.vitorias}
        </span>
        <span>
          <Target size={17} color="#5258E4" /> {a.id === EU ? '' : a.acertos}
        </span>
        <span>
          <Zap size={17} color="#7C3AED" /> {a.id === EU ? '' : a.tempo + 's'}
        </span>
      </p>
    </div>
  )
}
export function Resumo({ c }: { c: Ctx }) {
  const op = aluno(c.op ?? 'bruno')
  const posDe = (id: string) => c.rank.find((l) => l.id === id)!.pos
  const eu = c.rank.find((l) => l.id === EU)!
  return (
    <div className="bt-pagina">
      <Cab c={c} caminho={caminhoNova} titulo="Nova batalha" sub="Confira os detalhes da sua disputa antes de começar." />
      <Etapas atual={3} celular={c.celular} />
      <div className="cp-duas is-lado-340">
        <div className="cp-coluna">
          <section className="bt-card cp-stack">
            <TitCard icone={Swords}>Resumo da batalha</TitCard>
            <div className="cp-confronto">
              <div className="cp-jogador is-eu">
                <small>VOCÊ</small>
                <Av id={EU} size={88} />
                <Selo pos={eu.pos} />
                <b>{eu.nome}</b>
                <small>{eu.turma}</small>
                <p className="cp-op__nums">
                  <span>
                    <Trophy size={17} color="#C59319" /> {eu.vitorias}
                  </span>
                  <span>
                    <Target size={17} color="#5258E4" /> {eu.acertos}
                  </span>
                  <span>
                    <Zap size={17} color="#7C3AED" /> {eu.tempo}s
                  </span>
                </p>
              </div>
              <img className="cp-confronto__vs" src="./camp/vs-faiscas.webp" alt="contra" />
              <Jogador id={op.id} rot="OPONENTE" pos={posDe(op.id)} />
            </div>
          </section>
          <section className="bt-card cp-stack">
            <TitCard icone={FileCheck2}>Configuração da batalha</TitCard>
            <div className="cp-tres">
              <Numero icone={FileCheck2} cor="var(--primaria)" bg="#EEF0FF" valor="10 questões" rotulo="pelo menos 3 por tópico" />
              <Numero icone={Clock} cor="#15803D" bg="#E8F7EE" valor="10 minutos" rotulo="para as 10 questões" />
              <Numero icone={Hourglass} cor="#C2410C" bg="#FFF1E6" valor="24 horas" rotulo={`para ${primeiro(op.id)} responder`} />
            </div>
            <small className="cp-mini-t">Disciplinas e tópicos</small>
            {c.sel.map((s) => (
              <div key={s.disciplina} className="cp-disc-linha" style={{ background: DISC[s.disciplina].bg + 'a0' }}>
                <DiscIco d={s.disciplina} size={36} />
                <b>{DISC[s.disciplina].nome}</b>
                <small>{s.topico}</small>
              </div>
            ))}
          </section>
        </div>
        <div className="cp-coluna">
          <section className="bt-card cp-stack">
            <div className="cp-titcard">
              <Trophy size={22} color="#C59319" />
              <h2>{COPA.nome}</h2>
            </div>
            <span className="cp-status is-ok">
              <i />
              Em andamento
            </span>
            <p className="cp-regrinha">
              <Calendar size={20} /> <span>{COPA.periodo}</span>
            </p>
            <p className="cp-regrinha">
              <Users size={20} /> <span>{COPA.participantes} participantes</span>
            </p>
            <p className="cp-regrinha">
              <GraduationCap size={20} />{' '}
              <span>
                {COPA.ano} · {COPA.escola}
              </span>
            </p>
          </section>
          <section className="bt-card cp-stack cp-lilas">
            <TitCard icone={Info}>Regras desta batalha</TitCard>
            {(
              [
                [Target, 'Vence quem acertar mais questões'],
                [Equal, 'Mesmo número de acertos: empate, sem vitória para ninguém'],
                [Clock, 'Quando o tempo acaba, as questões sem resposta contam como erradas'],
                [LogOut, 'Se sair da batalha, sua participação é encerrada'],
                [Send, `${primeiro(op.id)} recebe o desafio na hora, sem precisar aceitar`],
              ] as const
            ).map(([I, t]) => (
              <p key={t} className="cp-regrinha">
                <I size={20} /> <span>{t}</span>
              </p>
            ))}
          </section>
        </div>
      </div>
      <BarraAcoes
        acoes={
          <>
            <Btn v="outline" onClick={() => c.ir('disciplinas')}>
              <ArrowLeft size={18} /> Voltar
            </Btn>
            <Btn onClick={c.iniciar}>
              <Zap size={18} /> Iniciar batalha <ArrowRight size={18} />
            </Btn>
          </>
        }
      >
        <Timer size={22} color="var(--primaria)" />
        <span className="cp-suave">O cronômetro de 10 minutos começa assim que você iniciar.</span>
      </BarraAcoes>
    </div>
  )
}

/* ------------------------------------------------------------------ 9 · questão */
export function Quiz({ c }: { c: Ctx }) {
  const b = c.atual!
  const qs = b.questoes
  const op = aluno(b.oponente)
  const [i, setI] = useState(0)
  const [rs, setRs] = useState<(number | null)[]>(() => qs.map(() => null))
  const [tempos, setTempos] = useState<number[]>(() => qs.map(() => 0))
  const [falta, setFalta] = useState(TEMPO)
  const fim = useRef(false)
  const estado = useRef({ rs, tempos })
  estado.current = { rs, tempos }
  c.rascunho.rs = rs
  c.rascunho.tempos = tempos
  useEffect(() => {
    const t = setInterval(() => {
      if (c.modalAberto) return
      setFalta((f) => f - 1)
      setTempos((ts) => ts.map((x, k) => (k === i ? x + 1 : x)))
    }, 1000)
    return () => clearInterval(t)
  }, [i, c.modalAberto])
  useEffect(() => {
    if (falta <= 0 && !fim.current) {
      fim.current = true
      c.fimQuiz(estado.current.rs, estado.current.tempos, true)
    }
  }, [falta]) // eslint-disable-line react-hooks/exhaustive-deps
  const marcar = (k: number) => setRs((r) => r.map((x, j) => (j === i ? k : x)))
  const ultima = i === qs.length - 1
  const avancar = () => {
    if (ultima) {
      fim.current = true
      c.fimQuiz(estado.current.rs, estado.current.tempos)
    } else setI(i + 1)
  }
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (c.modalAberto) return
      const k = e.key.toUpperCase()
      const n = '12345'.indexOf(k) >= 0 ? '12345'.indexOf(k) : LETRAS.indexOf(k)
      if (n >= 0) marcar(n)
      if (e.key === 'Enter' && rs[i] !== null) avancar()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  })
  const q = qs[i]
  const resp = rs.filter((x) => x !== null).length
  return (
    <div className="bt-pagina">
      <header className="cp-quiz-cab">
        <div>
          <Cab c={c} caminho={[['Campeonatos', 'lista'], [COPA.nome, 'visao'], ['Batalha', null]]} semVoltar />
          <h1 className="bt-h2">Batalha contra {op.nome}</h1>
          <p className="bt-sub is-14">{b.selecoes.map((s) => `${DISC[s.disciplina].nome} · ${s.topico}`).join('  ·  ')}</p>
        </div>
        <Btn v="outline" onClick={c.pedirSair}>
          <LogOut size={18} /> Sair da batalha
        </Btn>
      </header>
      <div className="cp-faixa">
        <span className="cp-faixa__lado">
          <Av id={EU} size={c.celular ? 40 : 56} />
          <span>
            <small>Você</small>
            <b>{c.celular ? 'Mariana' : 'Mariana Alves'}</b>
          </span>
        </span>
        <img src="./camp/vs-raio.webp" alt="contra" />
        <span className="cp-faixa__lado is-dir">
          <span>
            <small>Oponente</small>
            <b>{c.celular ? primeiro(op.id) : op.nome}</b>
          </span>
          <Av id={op.id} size={c.celular ? 40 : 56} />
        </span>
      </div>
      <div className="cp-duas is-lado-300">
        <section className="bt-card cp-questao">
          <div className="cp-questao__topo">
            <div>
              <b className="bt-h4">
                Questão {i + 1} de {qs.length}
              </b>
              <span className="cp-pontos">
                {qs.map((_, k) => (
                  <i key={k} className={k === i ? 'is-atual' : rs[k] !== null ? 'is-feita' : ''} />
                ))}
              </span>
            </div>
            <div className={`cp-relogio ${falta <= 60 ? 'is-fim' : ''}`} role="timer" aria-label={`Tempo restante ${relogio(falta)}`}>
              <Timer size={24} />
              <span>
                <small>Tempo restante</small>
                <b>{relogio(falta)}</b>
              </span>
              <i style={{ width: `${(falta / TEMPO) * 100}%` }} />
            </div>
          </div>
          <p className="cp-q-disc" style={{ color: DISC[q.disciplina].cor }}>
            <DiscIco d={q.disciplina} size={28} /> {DISC[q.disciplina].nome} · {q.topico}
          </p>
          <p className="cp-enunciado">{q.enunciado}</p>
          <div className="bt-alts" role="radiogroup" aria-label="Alternativas">
            {q.opcoes.map((o, k) => (
              <Alternativa key={k} letra={LETRAS[k]} texto={o} estado={rs[i] === k ? 'selecionada' : 'padrao'} atalho={c.celular ? undefined : k + 1} onClick={() => marcar(k)} />
            ))}
          </div>
          <div className="cp-nav">
            <Btn v="outline" disabled={i === 0} onClick={() => setI(i - 1)}>
              <ArrowLeft size={18} /> {c.celular ? 'Anterior' : 'Questão anterior'}
            </Btn>
            <Btn onClick={avancar}>
              {ultima ? 'Finalizar batalha' : c.celular ? 'Próxima' : 'Próxima questão'} <ArrowRight size={18} />
            </Btn>
          </div>
        </section>
        <div className="cp-coluna">
          <section className="bt-card cp-stack">
            <TitCard icone={Target}>Seu progresso</TitCard>
            <p className="cp-progresso-n">
              <b>{resp}</b> de 10 respondidas
            </p>
            <span className="cp-barrinha">
              <i style={{ width: resp * 10 + '%' }} />
            </span>
            <div className="cp-quadrados">
              {qs.map((_, k) => (
                <button key={k} className={k === i ? 'is-atual' : rs[k] !== null ? 'is-feita' : ''} onClick={() => setI(k)} aria-label={`Ir para a questão ${k + 1}`}>
                  {k + 1}
                </button>
              ))}
            </div>
            <p className="cp-legenda">
              <span>
                <i className="is-feita" /> Respondida
              </span>
              <span>
                <i className="is-atual" /> Atual
              </span>
              <span>
                <i /> Sem resposta
              </span>
            </p>
          </section>
          <section className="bt-card cp-lembre">
            <Hourglass size={24} />
            <span>
              <b>Lembre-se</b>
              <small>Você tem 10 minutos para as 10 questões. Quando o tempo acabar, as que estiverem sem resposta contam como erradas.</small>
            </span>
          </section>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ 10 · resultado */
export function Resultado({ c }: { c: Ctx }) {
  const b = c.atual!
  const st = situacao(b)
  const op = aluno(b.oponente)
  const eu = acertos(b)
  const nome = primeiro(op.id)
  const antes = useMemo(() => ranking(c.batalhas.filter((x) => x.id !== b.id)).find((l) => l.id === EU)!, [c.batalhas, b.id])
  const depois = c.rank.find((l) => l.id === EU)!
  const ganhou = st === 'vitoria' || st === 'wo'
  const TXT: Record<string, { tit: string; sub: string; aviso: [typeof Info, string, 'info' | 'alerta' | 'neutro'] }> = {
    aguardando: { tit: 'Sua parte está feita!', sub: `Você terminou a batalha. Falta ${nome} responder.`, aviso: [Hourglass, `${nome} tem até ${duracao(restante(b))} para responder. Enquanto isso, você já pode revisar suas questões.`, 'alerta'] },
    vitoria: { tit: 'Você venceu!', sub: `Você acertou mais questões que ${nome}.`, aviso: [TrendingUp, depois.pos < antes.pos ? `+1 vitória na Copa. Você subiu para o ${depois.pos}º lugar!` : `+1 vitória na Copa. Agora são ${depois.vitorias} vitórias.`, 'info'] },
    empate: { tit: 'Empate!', sub: 'Vocês acertaram o mesmo número de questões.', aviso: [Equal, `Empate não soma vitória para ninguém. O tempo não desempata a batalha, mas seus ${eu} acertos entram nos acertos acumulados.`, 'alerta'] },
    derrota: { tit: 'Não foi dessa vez', sub: `${op.nome} acertou mais questões.`, aviso: [Info, `Derrota não tira vitórias. Seus ${eu} acertos entram nos acertos acumulados, o 1º critério de desempate.`, 'neutro'] },
    wo: { tit: 'Vitória por W.O.', sub: `${nome} não respondeu dentro de 24 horas.`, aviso: [Trophy, 'A vitória por W.O. soma 1 vitória na Copa, como qualquer outra vitória.', 'info'] },
    'sem-vencedor': { tit: 'Encerrada sem vencedor', sub: 'A batalha começou a menos de 24 h do fim da Copa.', aviso: [Flag, `${nome} não respondeu antes do encerramento da Copa. Como não havia 24 h disponíveis, não há W.O.: a batalha não soma vitórias para ninguém.`, 'neutro'] },
  }
  const T = TXT[st]
  const tempoUsado = b.tempos.reduce((a, x) => a + x, 0)
  const porDisc = b.selecoes.map((s) => { const idx = b.questoes.map((q, k) => (q.disciplina === s.disciplina ? k : -1)).filter((k) => k >= 0); return { s, total: idx.length, certas: idx.filter((k) => b.minhas![k] === b.questoes[k].correta).length } })
  const placarOp = b.placarOp
  const final = st !== 'aguardando'
  const nexo: Record<string, [string, string]> = { aguardando: ['Mandou bem!', `Revise suas questões enquanto ${nome} não responde.`], vitoria: ['Você está voando!', 'Continue praticando para subir ainda mais no ranking.'], empate: ['Por pouco!', 'Revise as questões que você errou e volte mais forte.'], derrota: ['Faz parte!', 'Cada erro mostra o que revisar. Bora treinar?'], wo: ['Vitória garantida!', 'Que tal mais uma batalha para seguir subindo?'], 'sem-vencedor': ['A Copa acabou!', 'Confira a classificação final e o que você aprendeu.'] }
  return (
    <div className="bt-pagina">
      <Cab c={c} caminho={[['Campeonatos', 'lista'], [COPA.nome, 'visao'], ['Batalha', null], ['Resultado', null]]} titulo="Resultado da batalha" sub={T.sub} />
      <section className={`cp-placar is-${st}`}>
        {ganhou && !c.celular && <img className="cp-placar__medalha" src="./camp/medalha-resultado.webp" alt="" />}
        <span className="cp-placar__tit">{T.tit}</span>
        <div className="cp-placar__linha">
          <div className="cp-placar__jog">
            <Av id={EU} size={c.celular ? 60 : 88} className={eu > (placarOp ?? 99) || st === 'wo' ? 'is-vencedor' : ''} />
            <b>{c.celular ? 'Mariana' : 'Mariana Alves'}</b>
            <small>Você · 1º ano A</small>
          </div>
          <b className="cp-placar__n">{eu}</b>
          <img src="./camp/vs-raio.webp" alt="contra" />
          <b className={`cp-placar__n ${placarOp === null || st === 'wo' ? 'is-vazio' : ''}`}>{st === 'aguardando' ? '?' : placarOp === null || st === 'wo' || st === 'sem-vencedor' ? '–' : placarOp}</b>
          <div className="cp-placar__jog">
            <Av id={op.id} size={c.celular ? 60 : 88} className={placarOp !== null && placarOp > eu && st === 'derrota' ? 'is-vencedor' : ''} />
            <b>{c.celular ? nome : op.nome}</b>
            <small>{op.turma}</small>
          </div>
        </div>
      </section>
      <Aviso tipo={T.aviso[2]} icone={T.aviso[0]}>
        {T.aviso[1]}
      </Aviso>
      {st === 'aguardando' && (
        <div className="cp-simula">
          <small>Simulação do protótipo</small>
          <Btn v="outline" sm onClick={() => c.simular('resposta')}>
            <Send size={16} /> {nome} respondeu
          </Btn>
          <Btn v="outline" sm onClick={() => c.simular('prazo')}>
            <Hourglass size={16} /> Passaram 24 h sem resposta
          </Btn>
        </div>
      )}
      <div className="cp-duas is-lado-340">
        <section className="bt-card cp-stack">
          <TitCard icone={Target}>Seu desempenho</TitCard>
          <div className="cp-tres">
            <Numero icone={CheckCircle2} cor="#007A4D" bg="#E8F7EE" valor={`${eu} de 10`} rotulo="Acertos" />
            <Numero icone={Clock} cor="var(--primaria)" bg="#EEF0FF" valor={minSeg(tempoUsado)} rotulo="Tempo usado" />
            <Numero icone={Zap} cor="#7C3AED" bg="#F3EEFF" valor={Math.round(tempoMedioAcertos(b)) + 's'} rotulo="Tempo médio nas corretas" />
          </div>
          <small className="cp-mini-t">Análise por questão</small>
          <div className="cp-marcas">
            {b.questoes.map((q, k) => {
              const ok = b.minhas![k] === q.correta
              return (
                <button key={q.id} onClick={() => c.abrir(b.id, 'revisao')} aria-label={`Questão ${k + 1}: ${ok ? 'acertou' : 'errou'}`}>
                  <i className={ok ? 'is-ok' : 'is-erro'}>{ok ? <Check size={16} strokeWidth={3} /> : <X size={16} strokeWidth={3} />}</i>
                  <small>{k + 1}</small>
                </button>
              )
            })}
          </div>
          <small className="cp-mini-t">Por disciplina</small>
          {porDisc.map(({ s, total, certas }) => (
            <div key={s.disciplina} className="cp-por-disc">
              <DiscIco d={s.disciplina} size={32} />
              <span>
                <span>
                  {DISC[s.disciplina].nome} · {s.topico}
                  <b>
                    {certas} de {total}
                  </b>
                </span>
                <span className="cp-barrinha">
                  <i style={{ width: (total ? (certas / total) * 100 : 0) + '%', background: DISC[s.disciplina].cor }} />
                </span>
              </span>
            </div>
          ))}
          <Btn v="outline" full onClick={() => c.abrir(b.id, 'revisao')}>
            <FileCheck2 size={18} /> Revisar questões
          </Btn>
        </section>
        <div className="cp-coluna">
          <section className="bt-card cp-stack">
            <TitCard icone={Trophy} cor="#C59319">
              Na Copa
            </TitCard>
            {!final ? (
              <p className="bt-sub is-14">O resultado entra no ranking quando {nome} responder ou quando o prazo de 24 h acabar.</p>
            ) : (
              (
                [
                  [Award, '#C59319', 'Posição', antes.pos + 'º', depois.pos + 'º'],
                  [Trophy, '#007A4D', 'Vitórias', String(antes.vitorias), String(depois.vitorias)],
                  [Target, '#5258E4', 'Acertos acumulados', String(antes.acertos), String(depois.acertos)],
                ] as const
              ).map(([I, cor, r, a, d]) => (
                <p key={r} className="cp-contador-linha">
                  <I size={20} color={cor} /> <span>{r}</span> <b className={a !== d ? 'cp-sobe' : ''}>{a !== d ? `${a}  →  ${d}` : d}</b>
                </p>
              ))
            )}
            <Btn full disabled={c.encerrada} onClick={c.novaBatalha}>
              <Zap size={18} /> Nova batalha
            </Btn>
            <Btn v="outline" full onClick={() => c.ir('ranking')}>
              <BarChart3 size={18} /> Ver ranking
            </Btn>
            <Btn v="ghost" full onClick={() => c.ir('visao')}>
              <ArrowLeft size={18} /> Voltar para a Copa
            </Btn>
          </section>
          <section className="cp-nexo">
            <span>
              <b>{nexo[st][0]}</b>
              <small>{nexo[st][1]}</small>
            </span>
            <img src="./camp/nexo.webp" alt="Nexo" />
          </section>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ 11 · revisão */
export function Revisao({ c }: { c: Ctx }) {
  const b = c.atual!
  const [f, setF] = useState<'todas' | 'acertos' | 'erros'>('todas')
  const primeiraErrada = b.questoes.findIndex((q, k) => b.minhas![k] !== q.correta)
  const [aberta, setAberta] = useState(primeiraErrada)
  const eu = acertos(b)
  const lista = b.questoes.map((q, k) => ({ q, k, ok: b.minhas![k] === q.correta })).filter((x) => f === 'todas' || (f === 'acertos' ? x.ok : !x.ok))
  return (
    <div className="bt-pagina">
      <Cab c={c} caminho={[['Campeonatos', 'lista'], [COPA.nome, 'visao'], ['Batalha', 'resultado'], ['Revisão', null]]} titulo="Revisão das questões" sub={`Batalha contra ${aluno(b.oponente).nome} · você acertou ${eu} de 10.`} />
      <Aviso icone={Info}>Você pode revisar sua participação mesmo antes do oponente responder. A revisão não muda respostas nem o resultado.</Aviso>
      <div className="cp-filtro-abas" role="tablist">
        {(
          [
            ['todas', `Todas (10)`],
            ['acertos', `Acertos (${eu})`],
            ['erros', `Erros (${10 - eu})`],
          ] as const
        ).map(([k, t]) => (
          <button key={k} role="tab" aria-selected={f === k} className={f === k ? 'is-ativa' : ''} onClick={() => setF(k)}>
            {t}
          </button>
        ))}
      </div>
      <div className="cp-coluna">
        {lista.map(({ q, k, ok }) => {
          const ab = aberta === k
          const minha = b.minhas![k]
          return (
            <article key={q.id} className={`bt-card cp-rev ${ab ? 'is-aberta' : ''}`}>
              <button className="cp-rev__cab" aria-expanded={ab} onClick={() => setAberta(ab ? -1 : k)}>
                <i className={ok ? 'is-ok' : 'is-erro'}>{k + 1}</i>
                <span>
                  <small style={{ color: DISC[q.disciplina].cor }}>{DISC[q.disciplina].nome.toUpperCase()}</small>
                  <b>{q.enunciado}</b>
                </span>
                <span className={`cp-status ${ok ? 'is-ok' : 'is-erro'} cp-so-largo`}>
                  <i />
                  {ok ? 'Correta' : minha === null ? 'Sem resposta' : 'Incorreta'}
                </span>
                {ab ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {ab && (
                <div className="cp-rev__corpo">
                  <div className="bt-alts">
                    {q.opcoes.map((o, j) => (
                      <Alternativa key={j} letra={LETRAS[j]} texto={o} estado={j === q.correta ? 'correta' : j === minha ? 'errada' : 'apagada'} rotulo={j === q.correta ? (j === minha ? 'Sua resposta · correta' : 'Resposta correta') : j === minha ? 'Sua resposta' : undefined} disabled />
                    ))}
                  </div>
                  {minha === null && <Aviso tipo="alerta" icone={Clock}>Sem resposta: o tempo acabou antes desta questão e ela contou como errada.</Aviso>}
                  <p className="cp-explicacao">
                    <Lightbulb size={20} />
                    <span>
                      <b>Explicação:</b> {q.explicacao}
                    </span>
                  </p>
                </div>
              )}
            </article>
          )
        })}
      </div>
      <div className="cp-nav is-fim">
        <Btn v="outline" onClick={() => c.ir('resultado')}>
          <ArrowLeft size={18} /> Voltar ao resultado
        </Btn>
        <Btn onClick={() => c.ir('visao')}>Voltar para a Copa</Btn>
      </div>
    </div>
  )
}
export type { Selecao }
