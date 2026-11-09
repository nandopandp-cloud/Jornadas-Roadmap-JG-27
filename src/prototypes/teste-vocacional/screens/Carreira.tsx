import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  Briefcase,
  CalendarCheck,
  Check,
  CircleDollarSign,
  ClipboardList,
  Columns3,
  Compass,
  ExternalLink,
  FileVideo,
  GraduationCap,
  Landmark,
  Lightbulb,
  ListPlus,
  MapPinned,
  Mountain,
  Play,
  Puzzle,
  Route,
  Signpost,
  SlidersHorizontal,
  Target,
  ThumbsDown,
  TriangleAlert,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { AREA, CARREIRA, FONTE_REMUNERACAO, FONTES, REVISAO, perfilDe } from '../carreiras'
import { DimBola, FotoProf, Radar, SeloCategoria } from '../components/perfil'
import { Btn, Coracao, Modal, Rico } from '../components/ui'
import { DIM, type Dim } from '../instrumento'
import { acoesSugeridas, explicar, nivel } from '../motor'
import { useTv, type AbaProf, type View } from '../store'

const VOLTAR: Record<string, { texto: string; v: View }> = {
  relatorio: { texto: 'Voltar para as profissões recomendadas', v: { id: 'relatorio', aba: 'profissoes' } },
  explorar: { texto: 'Voltar para Explorar Profissões', v: { id: 'explorar' } },
  minhas: { texto: 'Voltar para Favoritos', v: { id: 'minhas' } },
  comparar: { texto: 'Voltar para a comparação', v: { id: 'comparar' } },
  plano: { texto: 'Voltar para o Meu Plano', v: { id: 'plano' } },
}
const ABAS: { id: AbaProf; nome: string; I: LucideIcon }[] = [
  { id: 'visao', nome: 'Visão geral', I: Compass },
  { id: 'dia', nome: 'Como é o dia a dia', I: CalendarCheck },
  { id: 'onde', nome: 'Onde atua', I: Landmark },
  { id: 'formacao', nome: 'Formação', I: GraduationCap },
  { id: 'habilidades', nome: 'Habilidades', I: SlidersHorizontal },
  { id: 'mercado', nome: 'Salário e mercado', I: CircleDollarSign },
  { id: 'conteudos', nome: 'Conteúdos relacionados', I: FileVideo },
]
const TAG_COR = ['#504cf2', '#2f7cf6', '#7c4ddb', '#f7881f']
const ATIV_IC: LucideIcon[] = [BarChart3, ClipboardList, Lightbulb, Users, Target, Puzzle]

/** Conheça a profissão (Frame 10 · PRD §5.8) */
export default function CarreiraTela({ v }: { v: Extract<View, { id: 'carreira' }> }) {
  const { s, ir, ultima, favoritar, toggleComparar, toast, descartar, track } = useTv()
  const c = CARREIRA[v.carreira]
  const [aba, setAba] = useState<AbaProf>(v.aba ?? 'visao')
  const [plano, setPlano] = useState(false)
  const volta = VOLTAR[v.de ?? 'explorar']
  const salvo = s.favoritos.some((f) => f.id === c.id)
  const comparando = s.comparar.includes(c.id)
  const res = ultima?.resultado
  const rec = res?.recomendacoes.find((x) => x.id === c.id)
  const exp = res && !res.perfil.inconclusivo ? explicar(res.perfil, ultima!.respostas, c) : null
  const descartada = s.descartadas.includes(c.id)
  const letras = [...c.codigo] as Dim[]

  useEffect(() => {
    if (aba === 'formacao') track('career_formation_viewed', { profissao: c.id })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aba])

  const salvar = () => {
    const on = favoritar(c.id)
    toast(on ? `${c.nome} adicionado(a) aos favoritos.` : `${c.nome} removido(a) dos favoritos.`, on ? 'ok' : 'info', on ? { rotulo: 'Ver favoritos', fn: () => ir({ id: 'minhas' }) } : undefined)
  }
  const trocar = (a: AbaProf) => {
    setAba(a)
    document.querySelector('.tv-prof__abas')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const fora = (n: string) => toast(`${n} fora do escopo deste protótipo.`, 'info')

  return (
    <div className="tv-prof">
      <div className="tv-prof__topo">
        <button className="tv-voltar" onClick={() => ir(volta.v, -1)}>
          <ArrowLeft size={20} /> {volta.texto}
        </button>
        <Coracao on={salvo} comTexto onClick={salvar} tam={22} />
      </div>

      <header className="tv-prof__hero">
        <div className="tv-prof__herotxt">
          <div className="tv-prof__tags">
            {rec ? <SeloCategoria rec={rec} /> : <span className="tv-afin tv-afin--area" style={{ '--c': AREA[c.area].cor } as CSSProperties}>{AREA[c.area].nome}</span>}
            {c.poucoConhecida && <span className="tv-afin tv-afin--nova">Pouco conhecida</span>}
          </div>
          <h1 className="tv-h1">{c.nome}</h1>
          <p>{c.descricao}</p>
          <div className="tv-chips">
            {c.especializacoes.slice(0, 4).map((t, i) => (
              <span key={t} className="tv-chip tv-chip--cor" style={{ '--c': TAG_COR[i] } as CSSProperties}>
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="tv-prof__heroarte">{c.id === 'ciencia-dados' ? <img src="./voc/ref/hero-ciencia-dados.webp" alt="" /> : <FotoProf c={c} className="tv-prof__herofoto" />}</div>
      </header>

      <nav className="tv-rabas tv-prof__abas" role="tablist" aria-label="Seções da profissão">
        {ABAS.map((x) => (
          <button key={x.id} role="tab" aria-selected={aba === x.id} className={aba === x.id ? 'is-on' : ''} onClick={() => trocar(x.id)}>
            <x.I size={18} strokeWidth={1.8} /> {x.nome}
            {aba === x.id && <motion.i layoutId="tv-prof-linha" className="tv-rabas__linha" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
          </button>
        ))}
      </nav>

      <div className="tv-prof__grade">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={aba} className="tv-prof__conteudo" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.1 } }}>
            {aba === 'visao' && (
              <div className="tv-prof__duas">
                <div className="tv-pilha">
                  <Caixa I={Compass} titulo="O que faz?">
                    <p>{c.descricao}</p>
                  </Caixa>
                  <Caixa I={Signpost} titulo="Exemplos de atividades">
                    <ul className="tv-ativs">
                      {c.atividades.map((a, i) => {
                        const I = ATIV_IC[i % ATIV_IC.length]
                        return (
                          <li key={a}>
                            <I size={20} />
                            {a}
                          </li>
                        )
                      })}
                    </ul>
                  </Caixa>
                </div>
                <div className="tv-pilha">
                  <Caixa I={Lightbulb} tom="amarelo" titulo={rec ? 'Por que pode combinar com você?' : 'Como se relaciona com você?'}>
                    {exp ? (
                      <>
                        <ul className="tv-pontos">
                          {exp.motivos.map((m) => (
                            <li key={m}>
                              <Rico texto={m} />
                            </li>
                          ))}
                        </ul>
                        {exp.atencao && (
                          <p className="tv-prof__atencao">
                            <TriangleAlert size={15} /> {exp.atencao}
                          </p>
                        )}
                        {!rec && <p className="tv-texto tv-texto--suave">Esta profissão não está entre as suas sugestões, e tudo bem: você pode explorar qualquer carreira.</p>}
                        {rec && !descartada && (
                          <button
                            className="tv-prof__nao"
                            onClick={() => {
                              descartar(c.id)
                              toast('Obrigado por contar. Isso não muda seu resultado, mas ajuda a melhorar as sugestões.', 'info', { rotulo: 'Explorar outras', fn: () => ir({ id: 'explorar' }) })
                            }}
                          >
                            <ThumbsDown size={14} /> Não me identifiquei com esta sugestão
                          </button>
                        )}
                        {descartada && <p className="tv-texto tv-texto--suave">Você indicou que esta sugestão não combina com você. Ela continua aqui caso mude de ideia.</p>}
                      </>
                    ) : (
                      <p>
                        Faça o Teste Vocacional para ver como esta profissão se relaciona com os seus interesses.{' '}
                        <button className="tv-link" onClick={() => ir({ id: 'entrada' })}>
                          Conhecer o teste
                        </button>
                      </p>
                    )}
                  </Caixa>
                  <Caixa I={Landmark} titulo="Áreas de atuação">
                    <div className="tv-chips">
                      {c.ambientes.map((a, i) => (
                        <span key={a} className="tv-chip tv-chip--cor" style={{ '--c': TAG_COR[i % 4] } as CSSProperties}>
                          {a}
                        </span>
                      ))}
                    </div>
                  </Caixa>
                  <Caixa I={Target} titulo="Dimensões RIASEC relacionadas">
                    <div className="tv-prof__dims">
                      {letras.map((d) => (
                        <div key={d}>
                          <DimBola d={d} tam={52} />
                          <strong>{DIM[d].tecnico}</strong>
                          <small>{res ? `Você: ${res.perfil.norm[d]} · ${nivel(res.perfil.norm[d]).replace('Interesse ', '')}` : DIM[d].nome}</small>
                        </div>
                      ))}
                    </div>
                  </Caixa>
                </div>
                <section className="tv-card tv-relacionadas">
                  <h2>
                    <Target size={20} /> Outras profissões que também podem interessar
                  </h2>
                  <div>
                    {c.relacionadas.map((id) => (
                      <button key={id} onClick={() => ir({ id: 'carreira', carreira: id, de: v.de })}>
                        <FotoProf c={CARREIRA[id]} className="tv-relacionadas__foto" />
                        <span>{CARREIRA[id].nome}</span>
                        <ArrowRight size={16} />
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {aba === 'dia' && (
              <div className="tv-prof__duas">
                <Caixa I={CalendarCheck} titulo="Como é o dia a dia">
                  <ul className="tv-ativs">
                    {c.atividades.map((a, i) => {
                      const I = ATIV_IC[i % ATIV_IC.length]
                      return (
                        <li key={a}>
                          <I size={20} />
                          {a}
                        </li>
                      )
                    })}
                  </ul>
                </Caixa>
                <div className="tv-pilha">
                  <Caixa I={Puzzle} titulo="Problemas que costuma resolver">
                    <ul className="tv-pontos">
                      {c.problemas.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                  </Caixa>
                  <Caixa I={Mountain} tom="laranja" titulo="Aspectos desafiadores">
                    <ul className="tv-pontos tv-pontos--laranja">
                      {c.desafios.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                  </Caixa>
                </div>
              </div>
            )}

            {aba === 'onde' && (
              <div className="tv-prof__duas">
                <Caixa I={Landmark} titulo="Ambientes e setores de atuação">
                  <div className="tv-chips">
                    {c.ambientes.map((a, i) => (
                      <span key={a} className="tv-chip tv-chip--cor" style={{ '--c': TAG_COR[i % 4] } as CSSProperties}>
                        {a}
                      </span>
                    ))}
                  </div>
                </Caixa>
                <Caixa I={Briefcase} titulo="Trabalho autônomo">
                  <p>{c.autonomo}</p>
                </Caixa>
                <Caixa I={MapPinned} titulo="Contexto de trabalho mais comum">
                  <ul className="tv-pontos">
                    {Object.entries(c.contexto).map(([k, val]) => (
                      <li key={k}>{CONTEXTO[k][val === 'a' ? 0 : val === 'b' ? 1 : 2]}</li>
                    ))}
                  </ul>
                  <p className="tv-texto tv-texto--suave">A mesma profissão pode existir em contextos bem diferentes.</p>
                </Caixa>
              </div>
            )}

            {aba === 'formacao' && (
              <div className="tv-prof__duas">
                <Caixa I={GraduationCap} titulo="Cursos e formações possíveis">
                  <div className="tv-formacoes">
                    {c.formacoes.map((f) => (
                      <div key={f.nome} className="tv-formacao">
                        <span className="tv-formacao__tipo">{f.tipo}</span>
                        <strong>{f.nome}</strong>
                        <small>
                          <CalendarCheck size={13} /> {f.duracao}
                        </small>
                      </div>
                    ))}
                  </div>
                </Caixa>
                <Caixa I={Route} titulo="Caminhos de ingresso e qualificação">
                  <div className="tv-ingresso">
                    <div>
                      <span className="tv-ingresso__rot tv-ingresso__rot--obr">Obrigatório</span>
                      <ul className="tv-pontos">
                        {c.ingresso.obrigatorio.map((a) => (
                          <li key={a}>{a}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="tv-ingresso__rot">Desejável</span>
                      <ul className="tv-pontos">
                        {c.ingresso.desejavel.map((a) => (
                          <li key={a}>{a}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Caixa>
                <Caixa I={Lightbulb} titulo="Possibilidades de especialização">
                  <div className="tv-chips">
                    {c.especializacoes.map((a) => (
                      <span key={a} className="tv-chip tv-chip--roxo">
                        {a}
                      </span>
                    ))}
                  </div>
                </Caixa>
              </div>
            )}

            {aba === 'habilidades' && (
              <div className="tv-prof__duas">
                <Caixa I={SlidersHorizontal} titulo="Competências frequentemente utilizadas">
                  <div className="tv-chips">
                    {c.competencias.map((a, i) => (
                      <span key={a} className="tv-chip tv-chip--cor" style={{ '--c': TAG_COR[i % 4] } as CSSProperties}>
                        {a}
                      </span>
                    ))}
                  </div>
                  <p className="tv-texto tv-texto--suave">Usadas com frequência, não são requisitos universais. Toda habilidade pode ser desenvolvida.</p>
                </Caixa>
                {res && (
                  <Caixa I={Target} titulo="Seu perfil × perfil de referência da profissão">
                    <Radar norm={res.perfil.norm} referencia={perfilDe(c.codigo)} largura={380} notas={false} />
                    <div className="tv-legenda">
                      <span>
                        <i className="is-voce" /> Suas respostas
                      </span>
                      <span>
                        <i className="is-ref" /> Perfil de referência da profissão
                      </span>
                    </div>
                  </Caixa>
                )}
              </div>
            )}

            {aba === 'mercado' && (
              <div className="tv-prof__duas">
                <Caixa I={CircleDollarSign} titulo="Faixa de remuneração">
                  {c.remuneracao ? (
                    <>
                      <p className="tv-prof__faixa">{c.remuneracao.faixa}</p>
                      <p className="tv-texto tv-texto--suave">
                        {c.remuneracao.recorte}. {FONTE_REMUNERACAO}
                      </p>
                    </>
                  ) : (
                    <p className="is-indisponivel">Dado indisponível no catálogo. Preferimos não estimar.</p>
                  )}
                  <p className="tv-texto tv-texto--suave">Valores de mercado mudam e não são garantia de renda, emprego ou sucesso.</p>
                </Caixa>
                <Caixa I={Briefcase} titulo="Formas de trabalho">
                  <p>{c.autonomo}</p>
                </Caixa>
                <Caixa I={BookOpenCheck} titulo="Fontes e referências">
                  <ul className="tv-fontes">
                    {FONTES.map((f) => (
                      <li key={f}>
                        <ExternalLink size={13} /> {f}
                      </li>
                    ))}
                  </ul>
                  <small className="tv-versao">Última revisão: {REVISAO}. Conteúdo ilustrativo do protótipo, pendente de revisão especializada.</small>
                </Caixa>
              </div>
            )}

            {aba === 'conteudos' && (
              <div className="tv-conteudos">
                {[
                  ['./voc/ref/pp-c1.webp', `O dia a dia de quem trabalha como ${c.nome}`],
                  ['./voc/ref/pp-c2.webp', 'Como escolher um curso na área'],
                  ['./voc/ref/pp-c3.webp', 'Tendências e novas possibilidades'],
                  ['./voc/ref/pp-e1.webp', 'Bate-papo com profissionais'],
                ].map(([img, t]) => (
                  <button key={t} onClick={() => fora('Conteúdos')}>
                    <img src={img} alt="" />
                    <span>{t}</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <aside className="tv-prof__lado">
          {c.video ? (
            <button className="tv-video" onClick={() => fora('Vídeos')}>
              <img src={c.video.capa} alt="" />
              <strong>{c.video.titulo}</strong>
              <small>Conheça a rotina, os desafios e as possibilidades dessa carreira.</small>
            </button>
          ) : (
            <section className="tv-card tv-lado-c">
              <span className="tv-dica__ic tv-dica__ic--roxo">
                <Play size={20} />
              </span>
              <div>
                <strong>Converse com quem atua</strong>
                <p>Uma conversa com alguém da área ajuda a enxergar o dia a dia real da profissão.</p>
              </div>
            </section>
          )}
          <section className="tv-card tv-lado-c">
            <span className="tv-dica__ic tv-dica__ic--roxo">
              <BarChart3 size={20} />
            </span>
            <div>
              <strong>Mercado de trabalho {c.remuneracao && <em>Faixa ilustrativa</em>}</strong>
              <p>{c.remuneracao ? `${c.remuneracao.faixa} (${c.remuneracao.recorte}).` : 'Dados de mercado indisponíveis para esta profissão no catálogo.'}</p>
              <button className="tv-link tv-link--seta" onClick={() => trocar('mercado')}>
                Ver dados do mercado <ArrowRight size={14} />
              </button>
            </div>
          </section>
          <section className="tv-card tv-lado-c">
            <span className="tv-dica__ic tv-dica__ic--roxo">
              <Signpost size={20} />
            </span>
            <div>
              <strong>Próximos passos</strong>
              <p>Explore formações, compare com outras profissões e monte seu plano para conhecer melhor essa carreira.</p>
              <Btn bloco iconeDir={<ArrowRight size={17} />} onClick={() => trocar('formacao')}>
                Ver caminhos de formação
              </Btn>
              <div className="tv-lado-c__acoes">
                <Btn
                  pequeno
                  variante={comparando ? 'suave' : 'claro'}
                  icone={<Columns3 size={15} />}
                  onClick={() => {
                    const r = toggleComparar(c.id)
                    if (r === 'cheio') toast('Você pode comparar até 3 profissões. Remova uma para adicionar outra.', 'info')
                  }}
                >
                  {comparando ? 'Na comparação' : 'Comparar'}
                </Btn>
                <Btn pequeno variante="claro" icone={<ListPlus size={15} />} onClick={() => setPlano(true)}>
                  Adicionar ao plano
                </Btn>
              </div>
            </div>
          </section>
          <p className="tv-prof__fonte">
            <BookOpenCheck size={14} /> Fontes: CBO, O*NET e MEC · revisão {REVISAO}
          </p>
        </aside>
      </div>

      <PlanoModal aberto={plano} onFechar={() => setPlano(false)} carreira={c.id} />
    </div>
  )
}

const CONTEXTO: Record<string, [string, string, string]> = {
  P01: ['Interage com pessoas com frequência', 'Longos períodos de concentração individual', 'Mistura de trabalho em grupo e individual'],
  P02: ['Rotinas e processos bem definidos', 'Atividades que mudam com frequência', 'Rotina e variedade em equilíbrio'],
  P03: ['Resultados práticos e concretos', 'Ideias, conceitos e análises', 'Prática e análise em equilíbrio'],
  P04: ['Executa procedimentos definidos', 'Ajuda a definir objetivos e soluções', 'Executa e define soluções'],
  P05: ['Aprofunda-se em um tema', 'Alterna entre temas e atividades', 'Aprofunda e alterna temas'],
  P06: ['Atuação presencial ou em campo', 'Atuação digital ou remota', 'Presencial e remoto'],
}

function Caixa({ I, titulo, children, tom = 'roxo' }: { I: LucideIcon; titulo: string; children: ReactNode; tom?: 'roxo' | 'amarelo' | 'laranja' }) {
  return (
    <motion.section className="tv-card tv-caixa-p" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <header>
        <span className={`tv-bloquinho__ic tv-bloquinho__ic--${tom}`}>
          <I size={22} strokeWidth={1.8} />
        </span>
        <h2>{titulo}</h2>
      </header>
      <div className="tv-caixa-p__corpo">{children}</div>
    </motion.section>
  )
}

/** adicionar ações de exploração ligadas à profissão */
export function PlanoModal({ aberto, onFechar, carreira }: { aberto: boolean; onFechar: () => void; carreira: string }) {
  const { s, addAcao, toast, ir } = useTv()
  const c = CARREIRA[carreira]
  const sug = acoesSugeridas(c)
  const [sel, setSel] = useState<string[]>([])
  useEffect(() => setSel([]), [aberto])
  const jaTem = (t: string) => s.acoes.some((a) => a.texto === t)
  return (
    <Modal
      aberto={aberto}
      onFechar={onFechar}
      titulo={`Investigar: ${c.nome}`}
      largura={560}
      rodape={
        <>
          <Btn variante="contorno" onClick={onFechar}>
            Cancelar
          </Btn>
          <Btn
            disabled={!sel.length}
            onClick={() => {
              sug.filter((a) => sel.includes(a.texto)).forEach((a) => addAcao({ texto: a.texto, tipo: a.tipo, carreira }))
              onFechar()
              toast(`${sel.length === 1 ? '1 ação adicionada' : `${sel.length} ações adicionadas`} ao Meu Plano.`, 'ok', { rotulo: 'Ver plano', fn: () => ir({ id: 'plano' }) })
            }}
          >
            Adicionar {sel.length > 0 ? `(${sel.length})` : ''}
          </Btn>
        </>
      }
    >
      <p className="tv-texto tv-texto--suave">Escolha ações para o seu plano de exploração. Você pode editar ou remover depois.</p>
      <ul className="tv-escolha">
        {sug.map((a) => {
          const tem = jaTem(a.texto)
          const on = sel.includes(a.texto)
          return (
            <li key={a.texto}>
              <button disabled={tem} className={on || tem ? 'is-on' : ''} onClick={() => setSel((x) => (on ? x.filter((y) => y !== a.texto) : [...x, a.texto]))} aria-pressed={on}>
                <span className="tv-caixa">{(on || tem) && <Check size={13} strokeWidth={3} />}</span>
                <span>{a.texto}</span>
                {tem && <em>Já no plano</em>}
              </button>
            </li>
          )
        })}
      </ul>
    </Modal>
  )
}
