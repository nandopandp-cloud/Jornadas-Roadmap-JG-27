// Telas da Copa: lista, visão geral, batalhas, histórico, ranking e regras.
import { ArrowRight, Award, BarChart3, BookOpen, CheckCircle2, ChevronDown, ChevronUp, Clock, Equal, FileCheck2, Flag, HelpCircle, Hourglass, Info, Lightbulb, Search, Swords, Target, Trophy, Users, XCircle, Zap, Activity, Calendar } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { Ctx } from './ctx'
import { COPA, DISC, EU, TOPICOS, aluno, primeiro } from './data'
import { acertos, quando, situacao, type Batalha } from './logica'
import { Abas, Av, Aviso, Btn, Cab, DiscChip, DiscIco, Hero, LinhaBatalha, Numero, Selo, Status, TitCard } from './pecas'

const pendentes = (bs: Batalha[]) => bs.filter((b) => ['sua-vez', 'aguardando'].includes(situacao(b))).sort((a, b) => (situacao(a) === 'sua-vez' ? 0 : 1) - (situacao(b) === 'sua-vez' ? 0 : 1) || b.criadaEm - a.criadaEm)

/* ------------------------------------------------------------------ 1 · lista */
export function Lista({ c }: { c: Ctx }) {
  const suaVez = c.batalhas.filter((b) => situacao(b) === 'sua-vez').length
  const eu = c.rank.find((l) => l.id === EU)!
  return (
    <div className="bt-pagina">
      <header>
        <h1 className="bt-h1">Campeonatos</h1>
        <p className="bt-sub">Dispute batalhas de conhecimento com colegas do seu ano e suba no ranking.</p>
      </header>
      {c.vazia ? (
        <section className="bt-card cp-vazio">
          <img src="./camp/passo-vitoria.webp" alt="" />
          <h2 className="bt-h3">Nenhum campeonato por enquanto</h2>
          <p className="bt-sub is-15">Quando seus educadores criarem um campeonato para o 1º ano, ele aparece aqui. Enquanto isso, que tal treinar numa batalha?</p>
          <Btn v="outline" onClick={() => c.avisar({ tipo: 'info', titulo: 'Batalhas', texto: 'As Batalhas têm uma jornada própria na plataforma.' })}>
            <Swords size={18} /> Ir para Batalhas
          </Btn>
        </section>
      ) : (
        <>
          <h2 className="bt-h4">Em andamento</h2>
          <article className="bt-card cp-copa">
            <img className="cp-copa__arte" src="./camp/hero-trofeu.webp" alt="" />
            <div className="cp-copa__txt">
              <Status t="Em andamento" tipo="ok" />
              <h3 className="bt-h2">{COPA.nome}</h3>
              <p className="bt-sub is-15">{COPA.sub}</p>
              <ul className="cp-meta">
                <li>
                  <Calendar size={18} /> {COPA.periodo}
                </li>
                <li>
                  <Users size={18} /> {COPA.participantes} participantes
                </li>
                <li>
                  <Clock size={18} /> Termina em 20 dias
                </li>
              </ul>
              <div className="cp-chips">
                {COPA.disc.map((d) => (
                  <DiscChip key={d} d={d} />
                ))}
              </div>
              <div className="cp-copa__pe">
                <span className="cp-copa__eu">
                  <span>
                    <Award size={18} color="#C59319" /> <b>{eu.pos}º lugar</b>
                  </span>
                  <span>
                    <Trophy size={18} color="#007A4D" /> <b>{eu.vitorias} vitórias</b>
                  </span>
                  {suaVez > 0 && <Status t={`${suaVez} ${suaVez > 1 ? 'desafios esperando' : 'desafio esperando'} você`} tipo="info" />}
                </span>
                <Btn onClick={() => c.ir('visao')}>
                  Entrar no campeonato <ArrowRight size={18} />
                </Btn>
              </div>
            </div>
          </article>
          <h2 className="bt-h4">Encerrados</h2>
          <div className="cp-grade is-2">
            {[
              ['Maratona GenieX · 1º ano', 'Encerrado em 31 out. 2026 · 120 participantes', 3, ['matematica', 'quimica']],
              ['Desafio de Ciências · 1º ano', 'Encerrado em 30 set. 2026 · 118 participantes', 12, ['fisica', 'quimica']],
            ].map(([n, d, p, ds]) => (
              <article key={n as string} className="bt-card cp-encerrado">
                <div className="cp-encerrado__topo">
                  <img src={(p as number) <= 3 ? './camp/medalha.webp' : './camp/passo-vitoria.webp'} alt="" />
                  <span>
                    <b>{n as string}</b>
                    <small>{d as string}</small>
                  </span>
                </div>
                <p className="cp-encerrado__res">
                  <Status t="Encerrado" tipo="neutro" /> <b>Classificação final: {p as number}º lugar</b>
                </p>
                <div className="cp-encerrado__pe">
                  <span className="cp-linha__disc">
                    {(ds as ('matematica' | 'fisica' | 'quimica')[]).map((x) => (
                      <DiscIco key={x} d={x} size={28} />
                    ))}
                  </span>
                  <Btn v="outline" sm onClick={() => c.avisar({ tipo: 'info', titulo: n as string, texto: 'Os campeonatos encerrados de exemplo não fazem parte deste protótipo.' })}>
                    Ver resultados
                  </Btn>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ 2 · visão geral */
export function SuaPosicao({ c, compacto }: { c: Ctx; compacto?: boolean }) {
  const eu = c.rank.find((l) => l.id === EU)!
  const vizinho = c.rank.find((l) => l.id !== EU && l.vitorias === eu.vitorias && l.acertos === eu.acertos)
  return (
    <section className="bt-card cp-posicao">
      <div className="cp-posicao__topo">
        <img src="./camp/medalha.webp" alt="" />
        <span>
          <small>{c.encerrada ? 'Sua classificação final' : 'Sua posição'}</small>
          <b>{eu.pos}º lugar</b>
          <small>de {COPA.participantes} participantes</small>
        </span>
      </div>
      {compacto ? (
        <div className="cp-tres">
          <Numero icone={Trophy} cor="#007A4D" bg="#E8F7EE" valor={eu.vitorias} rotulo="Vitórias" />
          <Numero icone={Target} cor="var(--primaria)" bg="#EEF0FF" valor={eu.acertos} rotulo="Acertos" />
          <Numero icone={Zap} cor="#7C3AED" bg="#F3EEFF" valor={eu.tempo + 's'} rotulo="Tempo médio" />
        </div>
      ) : (
        <ul className="cp-criterios-mini">
          <li>
            <Trophy size={20} color="#C59319" /> <b>{eu.vitorias} vitórias</b> <small>1º critério</small>
          </li>
          <li>
            <Target size={20} color="#5258E4" /> <b>{eu.acertos} acertos</b> <small>2º critério</small>
          </li>
          <li>
            <Zap size={20} color="#7C3AED" /> <b>{eu.tempo}s</b> <small>tempo médio · 3º critério</small>
          </li>
        </ul>
      )}
      {vizinho && (
        <Aviso icone={Info}>
          Você e {vizinho.nome} têm {eu.vitorias} vitórias e {eu.acertos} acertos. {vizinho.pos > eu.pos ? 'Você fica à frente' : `${primeiro(vizinho.id)} fica à frente`} pelo menor tempo médio ({eu.tempo} s contra {vizinho.tempo} s).
        </Aviso>
      )}
      {!compacto && (
        <Btn v="outline" full onClick={() => c.ir('ranking')}>
          Ver ranking completo
        </Btn>
      )}
    </section>
  )
}
export function Visao({ c }: { c: Ctx }) {
  if (c.encerrada) return <Encerrada c={c} />
  const n = c.numeros
  const pend = pendentes(c.batalhas).slice(0, 3)
  const ultimas = c.batalhas.filter((b) => ['vitoria', 'empate', 'derrota', 'wo'].includes(situacao(b))).sort((a, b) => b.criadaEm - a.criadaEm).slice(0, 6)
  return (
    <div className="bt-pagina">
      <Cab c={c} caminho={[['Campeonatos', 'lista'], [COPA.nome, null]]} />
      <Hero c={c} arte="hero-trofeu" />
      <Abas c={c} ativa="visao" />
      <div className="cp-duas is-lado-340">
        <section className="bt-card cp-nova">
          <div className="cp-nova__arte">
            <img src="./camp/criancas-recorte.webp" alt="" />
          </div>
          <div className="cp-nova__txt">
            <h2 className="bt-h2">Inicie uma nova batalha</h2>
            <p className="bt-sub is-15">Desafie um colega do 1º ano da sua escola, de qualquer turma. Escolha até 3 disciplinas da Copa e mostre o que você sabe!</p>
            <ul className="cp-meta">
              <li>
                <FileCheck2 size={18} /> 10 questões
              </li>
              <li>
                <Clock size={18} /> 10 minutos
              </li>
            </ul>
            <Btn onClick={c.novaBatalha} className="is-lg">
              <Zap size={18} /> Iniciar batalha <ArrowRight size={18} />
            </Btn>
          </div>
        </section>
        <SuaPosicao c={c} />
      </div>
      <div className="cp-duas is-meio">
        <section className="bt-card cp-stack">
          <TitCard icone={BarChart3}>Seus números na Copa</TitCard>
          <div className="cp-quatro">
            <Numero icone={Swords} cor="var(--primaria)" bg="#EEF0FF" valor={n.batalhas} rotulo="Batalhas" />
            <Numero icone={Trophy} cor="#007A4D" bg="#E8F7EE" valor={n.vit} rotulo="Vitórias" />
            <Numero icone={Equal} cor="#9A6700" bg="#FEF3DC" valor={n.emp} rotulo="Empates" />
            <Numero icone={XCircle} cor="#D31510" bg="#FDEDEE" valor={n.der} rotulo="Derrotas" />
          </div>
          <p className="bt-sub is-13">Empates e derrotas não somam vitórias. Batalhas que ainda aguardam o oponente entram na conta quando tiverem resultado.</p>
          <h3 className="cp-mini-t">Suas últimas batalhas</h3>
          <div className="cp-chips">
            {ultimas.map((b) => {
              const st = situacao(b)
              const [t, cls] = st === 'empate' ? ['Empatou', 'is-alerta'] : st === 'derrota' ? ['Perdeu', 'is-erro'] : ['Venceu', 'is-ok']
              return (
                <button key={b.id} className={`cp-res ${cls}`} onClick={() => c.abrir(b.id)}>
                  {st === 'empate' ? <Equal size={15} /> : st === 'derrota' ? <XCircle size={15} /> : <CheckCircle2 size={15} />} {t} · {primeiro(b.oponente)}
                </button>
              )
            })}
          </div>
        </section>
        <section className="bt-card cp-stack">
          <TitCard icone={BookOpen}>Disciplinas da Copa</TitCard>
          <p className="bt-sub is-14">Em cada batalha, você escolhe de 1 a 3 delas e 1 tópico de cada.</p>
          {COPA.disc.map((d) => (
            <div key={d} className="cp-disc-linha" style={{ background: DISC[d].bg + 'a0' }}>
              <DiscIco d={d} size={36} />
              <b>{DISC[d].nome}</b>
              <small>{TOPICOS[d].length} tópicos</small>
            </div>
          ))}
        </section>
      </div>
      <section className="bt-card cp-stack">
        <TitCard
          icone={Hourglass}
          extra={
            <button className="bt-link" onClick={() => c.ir('historico')}>
              Ver todas
            </button>
          }
        >
          Batalhas pendentes
        </TitCard>
        {pend.length ? pend.map((b) => <LinhaBatalha key={b.id} c={c} b={b} />) : <p className="bt-sub is-14">Nenhuma batalha pendente. Que tal desafiar alguém?</p>}
        <Aviso tipo="neutro" icone={Info}>
          Se o oponente não responder em 24 h, a vitória é sua por W.O. Batalhas iniciadas nas últimas 24 h da Copa não geram W.O.: sem resposta, terminam sem vencedor.
        </Aviso>
      </section>
    </div>
  )
}
function Encerrada({ c }: { c: Ctx }) {
  const n = c.numeros
  const fim = c.batalhas.filter((b) => ['sem-vencedor'].includes(situacao(b)))
  return (
    <div className="bt-pagina">
      <Cab c={c} caminho={[['Campeonatos', 'lista'], [COPA.nome, null]]} />
      <Hero c={c} arte="hero-trofeu" />
      <Abas c={c} ativa="visao" />
      <Aviso icone={Info}>A Copa terminou em 30 nov. às 23h59. Não é possível iniciar novas batalhas, mas os resultados e o seu histórico continuam disponíveis.</Aviso>
      <div className="cp-duas is-lado-360">
        <SuaPosicao c={c} compacto />
        <section className="bt-card cp-stack">
          <TitCard icone={Award} cor="#C59319">
            Pódio final
          </TitCard>
          {c.rank.slice(0, 3).map((l) => (
            <div key={l.id} className="cp-podio-linha">
              <Selo pos={l.pos} />
              <Av id={l.id} size={40} />
              <span>
                <b>{l.nome}</b>
                <small>{l.turma}</small>
              </span>
              <b>{l.vitorias} vitórias</b>
            </div>
          ))}
          <Btn v="outline" full onClick={() => c.ir('ranking')}>
            Ver classificação final
          </Btn>
        </section>
      </div>
      <section className="bt-card cp-stack">
        <TitCard icone={Flag}>Como ficaram suas últimas batalhas</TitCard>
        {fim.map((b) => (
          <LinhaBatalha key={b.id} c={c} b={b} detalhe={`${aluno(b.oponente).turma} · iniciada a 6 h do fim · não houve resposta`} />
        ))}
        <p className="bt-sub is-14">
          {n.vit} vitórias, {n.emp} empates e {n.der} derrotas na Copa.
        </p>
        <Aviso tipo="neutro" icone={Info}>
          Batalhas iniciadas nas últimas 24 h da Copa que ficaram sem resposta terminam sem vencedor e não somam vitórias para ninguém.
        </Aviso>
      </section>
    </div>
  )
}

/* ------------------------------------------------------------------ 3 · aba batalhas */
export function Batalhas({ c }: { c: Ctx }) {
  const [busca, setBusca] = useState('')
  const [turma, setTurma] = useState('todas')
  const [todos, setTodos] = useState(false)
  const recebidas = c.batalhas.filter((b) => situacao(b) === 'sua-vez')
  const ops = c.rank.filter((l) => l.id !== EU && (turma === 'todas' || l.turma === turma) && l.nome.toLowerCase().includes(busca.toLowerCase()))
  const cont = (f: (s: string) => boolean) => c.batalhas.filter((b) => f(situacao(b))).length
  const atividade = [...c.batalhas].sort((a, b) => b.criadaEm - a.criadaEm).slice(0, 5)
  return (
    <div className="bt-pagina">
      <Cab c={c} caminho={[['Campeonatos', 'lista'], [COPA.nome, 'visao'], ['Batalhas', null]]} />
      <Hero c={c} arte="hero-batalhas" escuro sub="Escolha um oponente e desafie para uma batalha!" />
      <Abas c={c} ativa="batalhas" />
      <div className="cp-duas is-lado-340">
        <div className="cp-coluna">
          <section className="bt-card cp-stack">
            <TitCard icone={Hourglass} extra={<span className="cp-contagem">{recebidas.length}</span>}>
              Desafios recebidos
            </TitCard>
            <p className="bt-sub is-14">Não precisa aceitar: é só responder dentro do prazo de 24 h.</p>
            {recebidas.length ? recebidas.map((b) => <LinhaBatalha key={b.id} c={c} b={b} />) : <p className="bt-sub is-14">Nenhum desafio esperando você.</p>}
          </section>
          <section className="cp-stack">
            <div>
              <h2 className="bt-h3">Encontrar oponentes</h2>
              <p className="bt-sub is-14">Colegas do 1º ano da sua escola, de qualquer turma.</p>
            </div>
            <div className="cp-filtros">
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
            </div>
            <div className="cp-grade is-3">
              {(todos ? ops : ops.slice(0, 6)).map((l) => (
                <CardOponente key={l.id} id={l.id} pos={l.pos} onClick={() => c.desafiar(l.id)} />
              ))}
              {!ops.length && <p className="bt-sub is-14">Nenhum colega encontrado com esse filtro.</p>}
            </div>
            {ops.length > 6 && (
              <Btn v="outline" full onClick={() => setTodos(!todos)}>
                {todos ? 'Mostrar menos' : 'Ver todos os colegas'} {todos ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </Btn>
            )}
          </section>
        </div>
        <div className="cp-coluna">
          <section className="bt-card cp-stack">
            <TitCard icone={Swords}>Minhas batalhas</TitCard>
            {(
              [
                [Hourglass, 'var(--primaria)', 'Sua vez', cont((s) => s === 'sua-vez')],
                [Clock, '#C59319', 'Aguardando oponente', cont((s) => s === 'aguardando')],
                [CheckCircle2, '#007A4D', 'Finalizadas', cont((s) => ['vitoria', 'empate', 'derrota', 'wo'].includes(s))],
                [Flag, '#6D6D6D', 'Sem vencedor', cont((s) => s === 'sem-vencedor')],
              ] as const
            ).map(([I, cor, t, n]) => (
              <p key={t} className="cp-contador-linha">
                <I size={20} color={cor} /> <span>{t}</span> <b>{n}</b>
              </p>
            ))}
            <Btn v="outline" full onClick={() => c.ir('historico')}>
              Ver histórico
            </Btn>
          </section>
          <section className="bt-card cp-stack">
            <TitCard icone={Activity}>Atividade recente</TitCard>
            {atividade.map((b) => {
              const st = situacao(b)
              const nome = aluno(b.oponente).nome
              const [I, cor, t] =
                st === 'sua-vez'
                  ? [Hourglass, 'var(--primaria)', `${nome} desafiou você`]
                  : st === 'aguardando'
                    ? [Clock, '#C59319', `Você desafiou ${nome}`]
                    : st === 'derrota'
                      ? [XCircle, '#D31510', `Você perdeu para ${nome} · ${acertos(b)} × ${b.placarOp}`]
                      : st === 'empate'
                        ? [Equal, '#9A6700', `Empate com ${nome} · ${acertos(b)} × ${b.placarOp}`]
                        : st === 'wo'
                          ? [Trophy, '#C59319', `Vitória por W.O. contra ${nome}`]
                          : [CheckCircle2, '#007A4D', `Você venceu ${nome} · ${acertos(b)} × ${b.placarOp ?? '–'}`]
              return (
                <button key={b.id} className="cp-atividade" onClick={() => (st === 'sua-vez' ? c.responder(b.id) : c.abrir(b.id))}>
                  <I size={20} color={cor} />
                  <span>
                    <b>{t}</b>
                    <small>{quando(b.criadaEm)}</small>
                  </span>
                </button>
              )
            })}
          </section>
        </div>
      </div>
    </div>
  )
}
export function CardOponente({ id, pos, sel, onClick }: { id: string; pos: number; sel?: boolean; onClick: () => void }) {
  const a = aluno(id)
  const l = { v: a.vitorias, ac: a.acertos, t: a.tempo }
  return (
    <article className={`bt-card cp-op ${sel ? 'is-sel' : ''}`}>
      <button className="cp-op__quem" onClick={onClick} aria-pressed={sel}>
        <Av id={id} size={56} />
        <span>
          <Selo pos={pos} />
          <b>{a.nome}</b>
          <small>{a.turma}</small>
        </span>
        {sel && (
          <i className="cp-op__check">
            <CheckCircle2 size={22} />
          </i>
        )}
      </button>
      <p className="cp-op__nums">
        <span>
          <Trophy size={17} color="#C59319" /> {l.v}
        </span>
        <span>
          <Target size={17} color="#5258E4" /> {l.ac}
        </span>
        <span>
          <Zap size={17} color="#7C3AED" /> {l.t}s
        </span>
      </p>
      <Btn v={sel ? 'default' : 'secondary'} sm full onClick={onClick}>
        {sel ? <CheckCircle2 size={16} /> : <Swords size={16} />} {sel ? 'Selecionado' : 'Desafiar'}
      </Btn>
    </article>
  )
}

/* ------------------------------------------------------------------ 3.2 · minhas batalhas */
export function Historico({ c }: { c: Ctx }) {
  const [f, setF] = useState<'todas' | 'sua' | 'aguardando' | 'finalizadas'>('todas')
  const [n, setN] = useState(8)
  const lista = useMemo(() => {
    const ord = [...c.batalhas].sort((a, b) => (situacao(a) === 'sua-vez' ? -1 : 0) - (situacao(b) === 'sua-vez' ? -1 : 0) || b.criadaEm - a.criadaEm)
    return ord.filter((b) => {
      const st = situacao(b)
      return f === 'todas' || (f === 'sua' && st === 'sua-vez') || (f === 'aguardando' && st === 'aguardando') || (f === 'finalizadas' && !['sua-vez', 'aguardando'].includes(st))
    })
  }, [c.batalhas, f])
  const cont = (k: typeof f) => c.batalhas.filter((b) => { const st = situacao(b); return k === 'todas' || (k === 'sua' && st === 'sua-vez') || (k === 'aguardando' && st === 'aguardando') || (k === 'finalizadas' && !['sua-vez', 'aguardando'].includes(st)) }).length
  return (
    <div className="bt-pagina">
      <Cab c={c} caminho={[['Campeonatos', 'lista'], [COPA.nome, 'visao'], ['Minhas batalhas', null]]} titulo="Minhas batalhas" sub={`Todas as suas batalhas na ${COPA.nome}.`} />
      <div className="cp-filtro-abas" role="tablist">
        {(
          [
            ['todas', 'Todas'],
            ['sua', 'Sua vez'],
            ['aguardando', 'Aguardando'],
            ['finalizadas', 'Finalizadas'],
          ] as const
        ).map(([k, t]) => (
          <button key={k} role="tab" aria-selected={f === k} className={f === k ? 'is-ativa' : ''} onClick={() => { setF(k); setN(8) }}>
            {t} ({cont(k)})
          </button>
        ))}
      </div>
      <section className="bt-card cp-stack">
        {lista.slice(0, n).map((b) => (
          <LinhaBatalha key={b.id} c={c} b={b} detalhe={situacao(b) === 'sua-vez' || situacao(b) === 'aguardando' ? undefined : `${aluno(b.oponente).turma} · ${quando(b.criadaEm)}`} />
        ))}
        {!lista.length && <p className="bt-sub is-14">Nenhuma batalha nesta situação.</p>}
        <div className="cp-rodape">
          <small>
            Mostrando {Math.min(n, lista.length)} de {lista.length} batalhas
          </small>
          {n < lista.length && (
            <Btn v="outline" sm onClick={() => setN(n + 8)}>
              Carregar mais <ChevronDown size={16} />
            </Btn>
          )}
        </div>
      </section>
    </div>
  )
}

/* ------------------------------------------------------------------ 4 · ranking */
export function Criterios() {
  return (
    <ol className="cp-criterios">
      {['Mais vitórias', 'Mais acertos acumulados nas batalhas', 'Menor tempo médio nas respostas corretas', 'Ordem alfabética do nome'].map((t, i) => (
        <li key={t}>
          <i>{i + 1}</i> {t}
        </li>
      ))}
    </ol>
  )
}
export function Ranking({ c }: { c: Ctx }) {
  const [busca, setBusca] = useState('')
  const [todos, setTodos] = useState(false)
  const filtrado = c.rank.filter((l) => l.nome.toLowerCase().includes(busca.toLowerCase()))
  const linhas = busca || todos ? filtrado : filtrado.slice(0, 10)
  const top = c.rank.slice(0, 3)
  return (
    <div className="bt-pagina">
      <Cab c={c} caminho={[['Campeonatos', 'lista'], [COPA.nome, 'visao'], ['Ranking', null]]} />
      <Hero c={c} arte="hero-ranking" sub="Veja quem está no topo e acompanhe a sua posição." />
      <Abas c={c} ativa="ranking" />
      <div className="cp-duas is-lado-340 is-lado-primeiro">
        <section className="bt-card cp-stack">
          <div className="cp-ranking-cab">
            <span>
              <h2 className="bt-h3">{c.encerrada ? 'Classificação final' : 'Classificação geral'}</h2>
              <small>{COPA.participantes} participantes{c.encerrada ? ' · encerrada em 30 nov.' : ' · atualizado há 2 min'}</small>
            </span>
            <label className="bt-campo">
              <Search size={18} />
              <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar participante" aria-label="Buscar participante" />
            </label>
          </div>
          <div className="cp-podio">
            {[top[1], top[0], top[2]].map((l) => (
              <div key={l.id} className={`cp-podio__col is-${l.pos}`}>
                <Av id={l.id} size={l.pos === 1 ? 84 : 68} />
                <Selo pos={l.pos} />
                <b>{l.nome}</b>
                <small>{l.turma}</small>
                <span className="cp-podio__vit">
                  <Trophy size={16} color="#C59319" /> {l.vitorias} vitórias
                </span>
                <i className="cp-podio__degrau" />
              </div>
            ))}
          </div>
          <div className="cp-tabela" role="table" aria-label="Classificação">
            <div className="cp-tabela__cab" role="row">
              <span>#</span>
              <span>Participante</span>
              <span className="cp-so-largo">Turma</span>
              <span>Vitórias</span>
              <span className="cp-so-largo">Acertos</span>
              <span className="cp-so-largo">Tempo médio</span>
            </div>
            {linhas.map((l) => (
              <div key={l.id} role="row" className={`cp-tabela__linha ${l.id === EU ? 'is-eu' : ''}`}>
                <span>{l.pos <= 3 ? <Selo pos={l.pos} /> : <b>{l.pos}º</b>}</span>
                <span className="cp-tabela__nome">
                  <Av id={l.id} size={32} />
                  <span>
                    <b>
                      {l.nome} {l.id === EU && <i className="cp-voce">Você</i>}
                    </b>
                    <small className="cp-so-cel">
                      {l.turma} · {l.acertos} acertos · {l.tempo}s
                    </small>
                  </span>
                </span>
                <span className="cp-so-largo">{l.turma}</span>
                <b>{l.vitorias}</b>
                <span className="cp-so-largo">{l.acertos}</span>
                <span className="cp-so-largo">{l.tempo}s</span>
              </div>
            ))}
          </div>
          <div className="cp-rodape">
            <small>
              Mostrando {linhas.length} de {busca ? filtrado.length : COPA.participantes} participantes
            </small>
            {!busca && (
              <Btn v="outline" sm onClick={() => setTodos(!todos)}>
                {todos ? 'Mostrar menos' : 'Ver mais participantes'} {todos ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </Btn>
            )}
          </div>
        </section>
        <div className="cp-coluna">
          <SuaPosicao c={c} compacto />
          <section className="bt-card cp-stack">
            <TitCard icone={Trophy} cor="#C59319">
              Como o ranking é calculado
            </TitCard>
            <p className="bt-sub is-14">Vale o número de vitórias. Em caso de empate, decidem nesta ordem:</p>
            <Criterios />
            <p className="bt-sub is-13">Empates, derrotas e batalhas sem vencedor não somam vitórias.</p>
          </section>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ 5 · regras */
const FAQ: [string, string][] = [
  ['Meu oponente precisa aceitar o desafio?', 'Não. Assim que você termina, o desafio chega para ele, que tem 24 h para responder.'],
  ['Posso desafiar alguém de outra turma?', 'Sim, desde que seja da sua escola e do 1º ano. Você só não pode desafiar a si mesmo.'],
  ['O que acontece se o tempo acabar?', 'Sua participação é encerrada e as questões sem resposta contam como erradas.'],
  ['Posso revisar as questões antes do oponente responder?', 'Pode. A revisão da sua participação fica disponível assim que você termina.'],
  ['O tempo de resposta desempata uma batalha?', 'Não. A batalha é decidida só pelos acertos. O tempo médio só desempata o ranking da Copa.'],
]
export function Regras({ c }: { c: Ctx }) {
  const [aberta, setAberta] = useState(0)
  return (
    <div className="bt-pagina">
      <Cab c={c} caminho={[['Campeonatos', 'lista'], [COPA.nome, 'visao'], ['Regras', null]]} />
      <Hero c={c} arte="hero-regras" escuro sub="Entenda como funciona, quais são as regras e como subir no ranking." />
      <Abas c={c} ativa="regras" />
      <header>
        <h2 className="bt-h2">Como funciona a Copa GenieX?</h2>
        <p className="bt-sub is-15">Um campeonato de conhecimento entre estudantes do 1º ano da sua escola, com Batalhas VS nas disciplinas da Copa.</p>
      </header>
      <div className="cp-grade is-4">
        {[
          ['passo-desafie', 'Desafie um colega', 'Escolha um colega do 1º ano da sua escola, de qualquer turma. Depois, escolha de 1 a 3 disciplinas da Copa e 1 tópico de cada.'],
          ['passo-responda', 'Responda 10 questões', 'Você tem até 10 minutos para as 10 questões. Quando o tempo acaba, as questões sem resposta contam como erradas.'],
          ['passo-oponente', 'Seu oponente responde', 'O desafio chega na hora, sem etapa de aceite. Seu oponente tem até 24 horas para responder nas mesmas condições.'],
          ['passo-vitoria', 'Quem acertar mais vence', 'A vitória soma 1 no ranking. Com o mesmo número de acertos, a batalha termina empatada. O tempo não desempata a batalha.'],
        ].map(([a, t, d], i) => (
          <article key={a} className="bt-card cp-passo">
            <i>{i + 1}</i>
            <img src={`./camp/${a}.webp`} alt="" />
            <b>{t}</b>
            <p>{d}</p>
          </article>
        ))}
      </div>
      <div className="cp-duas is-lado-340">
        <section className="cp-stack">
          <h2 className="bt-h2">Regras da disputa</h2>
          <div className="cp-grade is-2">
            {(
              [
                [FileCheck2, '#7C3AED', '#F3EEFF', 'Formato da batalha', ['10 questões de múltipla escolha', 'De 1 a 3 disciplinas da Copa, com 1 tópico de cada', 'Pelo menos 3 questões de cada tópico, em ordem aleatória', 'Até 10 minutos para você e 10 minutos para o oponente']],
                [Clock, '#C2410C', '#FFF1E6', 'Prazo e W.O.', ['O oponente tem 24 h para responder', 'Sem resposta em 24 h, a vitória é sua por W.O.', 'Batalhas iniciadas nas últimas 24 h da Copa não geram W.O.: sem resposta, terminam sem vencedor']],
                [Users, '#15803D', '#E8F7EE', 'Quem pode desafiar', ['Estudantes da sua escola e do seu ano escolar', 'De qualquer turma do 1º ano', 'Você não pode desafiar a si mesmo', 'Pode ter várias batalhas ao mesmo tempo']],
                [Flag, '#B91C1C', '#FDEDEE', 'Fim da Copa', ['A Copa termina em 30 nov., às 23h59', 'Depois disso, não dá para iniciar batalhas', 'Resultados já definidos não mudam', 'A classificação final fica disponível']],
              ] as const
            ).map(([I, cor, bg, t, itens]) => (
              <article key={t} className="bt-card cp-regra">
                <span className="cp-regra__ico" style={{ background: bg, color: cor }}>
                  <I size={22} />
                </span>
                <div>
                  <b>{t}</b>
                  <ul>
                    {itens.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>
        <div className="cp-coluna">
          <section className="bt-card cp-stack cp-ouro">
            <TitCard icone={Trophy} cor="#C59319">
              Como funciona o ranking
            </TitCard>
            <p className="bt-sub is-14">Vale o número de vitórias. Em caso de empate, estes critérios decidem, nesta ordem:</p>
            <Criterios />
            <Aviso icone={Lightbulb}>Não existem pontos: sua posição depende das vitórias. Acertos e tempo só servem para desempatar.</Aviso>
          </section>
          <section className="bt-card cp-stack">
            <TitCard icone={HelpCircle}>Dúvidas frequentes</TitCard>
            <div className="cp-faq">
              {FAQ.map(([q, a], i) => (
                <div key={q} className={aberta === i ? 'is-aberta' : ''}>
                  <button aria-expanded={aberta === i} onClick={() => setAberta(aberta === i ? -1 : i)}>
                    {q} {aberta === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {aberta === i && <p>{a}</p>}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
