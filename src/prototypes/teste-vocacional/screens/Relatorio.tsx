import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, ChevronDown, Columns3, Compass, History, Info, ListPlus, MessageCircleQuestion, RotateCcw, Search, Signpost, Sparkles, Table2, TriangleAlert } from 'lucide-react'
import { useEffect, useState, type CSSProperties } from 'react'
import { CARREIRA } from '../carreiras'
import { CardCarreira, Radar, Selo } from '../components/perfil'
import { Barra, Brilhos, Btn, Modal, Rico } from '../components/ui'
import { CLAREZA, DIM, DIMS, ESCALA, ITEM, type Dim, type Respostas } from '../instrumento'
import { acoesSugeridas, habilidades, nivel, perguntasReflexao, preferencias, valoresDestacados, type Perfil } from '../motor'
import { dataLonga, quando, useTv } from '../store'

const SECOES = [
  { id: 'visao', nome: 'Visão geral' },
  { id: 'mapa', nome: 'Mapa de interesses' },
  { id: 'caracteristicas', nome: 'Seu perfil' },
  { id: 'possibilidades', nome: 'Carreiras para explorar' },
  { id: 'passos', nome: 'Próximos passos' },
]

const nomes = (ds: Dim[]) => {
  const n = ds.map((d) => `**${DIM[d].nome.toLowerCase()}**`)
  return n.length <= 1 ? n.join('') : `${n.slice(0, -1).join(', ')} e ${n[n.length - 1]}`
}

/** Relatório personalizado (PRD §5.6) + recomendações (PRD §5.7) */
export default function Relatorio({ tentativaId, secao }: { tentativaId?: string; secao?: string }) {
  const { s, ir, track, ultima, iniciar } = useTv()
  const t = (tentativaId && s.tentativas.find((x) => x.id === tentativaId)) || ultima
  const [comoModal, setComoModal] = useState(false)
  const [refazer, setRefazer] = useState(false)
  const [ativa, setAtiva] = useState('visao')
  const ehAtual = t?.id === ultima?.id

  useEffect(() => {
    if (t?.resultado) track('career_report_viewed', { tentativa: s.tentativas.filter((x) => x.status === 'concluida').length - s.tentativas.filter((x) => x.status === 'concluida').indexOf(t), versao: t.resultado.versao })
    if (secao) window.setTimeout(() => document.getElementById(`sec-${secao}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 350)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // seção ativa no índice conforme a rolagem
  useEffect(() => {
    const main = document.querySelector('.tv-main')
    if (!main) return
    const on = () => {
      const topo = main.getBoundingClientRect().top + 140
      let atual = 'visao'
      for (const x of SECOES) {
        const el = document.getElementById(`sec-${x.id}`)
        if (el && el.getBoundingClientRect().top <= topo) atual = x.id
      }
      setAtiva(atual)
    }
    main.addEventListener('scroll', on, { passive: true })
    return () => main.removeEventListener('scroll', on)
  }, [])

  if (!t?.resultado) {
    return (
      <div className="tv-vazio tv-vazio--grande">
        <img src="./voc/compass.webp" alt="" width={72} />
        <strong>Você ainda não tem um perfil</strong>
        <span>Faça o Teste Vocacional para descobrir seus interesses e profissões para explorar.</span>
        <Btn onClick={() => ir({ id: 'entrada' })}>Conhecer o teste</Btn>
      </div>
    )
  }

  const res = t.resultado
  const p = res.perfil
  const r = t.respostas
  const recs = res.recomendacoes
  const vals = valoresDestacados(r)
  const prefs = preferencias(r)
  const hab = habilidades(r)
  const gostos = DIMS.flatMap((d) => p.contribuiram[d]).filter((id) => r[id] === 5).slice(0, 5)
  const abrir = (id: string, i: number) => {
    track('career_recommendation_opened', { profissao: id, posicao: i + 1 })
    ir({ id: 'carreira', carreira: id, de: 'relatorio', posicao: i + 1 })
  }
  const ir2 = (id: string) => document.getElementById(`sec-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div className="tv-rel">
      {!ehAtual && (
        <div className="tv-aviso">
          <History size={17} />
          <span>
            Você está vendo um resultado anterior, de {dataLonga(t.fim!)}, feito com o instrumento <b>{res.versao}</b>. Ele fica guardado como era, mesmo que a metodologia mude.
          </span>
          <button className="tv-link" onClick={() => ir({ id: 'relatorio' })}>
            Ver o mais recente
          </button>
        </div>
      )}

      <header className="tv-rel__cab">
        <div>
          <span className="tv-sobre">Meu perfil profissional</span>
          <h1 className="tv-h1">Seus caminhos para explorar</h1>
          <p className="tv-rel__meta">
            Teste concluído {quando(t.fim!).toLowerCase()} · Instrumento {res.versao} · Regras {res.regras}
          </p>
        </div>
        <div className="tv-rel__acoes">
          <Btn variante="contorno" icone={<MessageCircleQuestion size={16} />} onClick={() => setComoModal(true)}>
            Como chegamos a este resultado
          </Btn>
          {ehAtual && (
            <Btn variante="fantasma" icone={<RotateCcw size={15} />} onClick={() => setRefazer(true)}>
              Refazer o teste
            </Btn>
          )}
        </div>
      </header>

      <nav className="tv-indice" aria-label="Seções do relatório">
        {SECOES.map((x) => (
          <button key={x.id} className={ativa === x.id ? 'is-on' : ''} onClick={() => ir2(x.id)}>
            {x.nome}
          </button>
        ))}
      </nav>

      {/* A — visão geral */}
      <section id="sec-visao" className="tv-rel__visao">
        <motion.div className="tv-heroi" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <Brilhos n={5} />
          <span className="tv-heroi__sobre">
            <Sparkles size={15} /> Visão geral
          </span>
          {p.inconclusivo ? (
            <>
              <h2>Suas respostas ficaram muito parecidas em todas as áreas</h2>
              <p>Com elas, não conseguimos apontar pistas com segurança, e preferimos não inventar um resultado. Isso não é um problema: você pode explorar livremente o catálogo ou refazer o teste com calma em outro momento.</p>
            </>
          ) : (
            <>
              <h2>
                <Rico texto={`Suas respostas indicam interesse por ${nomes(p.destaques)}.`} />
              </h2>
              <div className="tv-heroi__selos">
                {p.destaques.map((d, i) => (
                  <motion.span key={d} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 + i * 0.1, type: 'spring' }}>
                    <Selo d={d} tam="g" />
                  </motion.span>
                ))}
              </div>
              <p>
                {p.distribuido
                  ? 'Seus interesses aparecem bem distribuídos entre as áreas. Isso é comum e abre muitas possibilidades: as pistas abaixo são só um começo.'
                  : `Pessoas que gostam de ${DIM[p.destaques[0]].atividades} costumam se encontrar em profissões muito diferentes entre si. Combinar isso com ${p.destaques[1] ? `o interesse por ${DIM[p.destaques[1]].nome.toLowerCase()}` : 'outros interesses'} ajuda a encontrar caminhos com a sua cara.`}
              </p>
              {p.empatadas.length > 0 && (
                <p className="tv-heroi__empate">
                  <Info size={14} /> {p.empatadas.map((d) => DIM[d].nome).join(' e ')} ficou empatado com {DIM[p.destaques[2]].nome.toLowerCase()}. Consideramos as duas pistas.
                </p>
              )}
            </>
          )}
          <p className="tv-heroi__nota">Use este resultado como ponto de partida para investigar seu futuro, não como uma decisão.</p>
        </motion.div>
        {ehAtual && <CartaoClareza />}
      </section>

      {/* B — mapa de interesses */}
      <section id="sec-mapa" className="tv-rel__sec">
        <h2 className="tv-h2g">Mapa de interesses</h2>
        <MapaInteresses p={p} r={r} />
      </section>

      {/* C — características do perfil */}
      <section id="sec-caracteristicas" className="tv-rel__sec">
        <h2 className="tv-h2g">Seu perfil em detalhes</h2>
        <p className="tv-rel__lead">Interesses, valores e habilidades são coisas diferentes, por isso aparecem separados.</p>
        <div className="tv-carac">
          <motion.div className="tv-cartao tv-carac__c" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <h3>
              <img src="./voc/light-bulb.webp" alt="" /> Atividades que parecem despertar seu interesse
            </h3>
            <ul className="tv-carac__lista">
              {(gostos.length ? gostos : DIMS.flatMap((d) => p.contribuiram[d]).slice(0, 5)).map((id) => (
                <li key={id}>
                  <Check size={14} strokeWidth={3} /> {ITEM[id].texto.replace(/\.$/, '')}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div className="tv-cartao tv-carac__c" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <h3>
              <img src="./voc/world-map.webp" alt="" /> Contextos de trabalho que merecem exploração
            </h3>
            <div className="tv-chips">
              {prefs.map((x) => (
                <span key={x.id} className="tv-chip tv-chip--g" title={x.texto}>
                  {x.rotulo}
                </span>
              ))}
            </div>
            <p className="tv-carac__nota">Preferências de hoje: ajudam a imaginar ambientes, mas não eliminam profissões. A mesma carreira pode existir em contextos bem diferentes.</p>
          </motion.div>
          <motion.div className="tv-cartao tv-carac__c" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h3>
              <img src="./voc/compass.webp" alt="" /> Valores que você destacou
            </h3>
            <ul className="tv-valores">
              {vals.map((v) => (
                <li key={v.id}>
                  <strong>{v.nome}</strong>
                  <span>{ESCALA.importancia[v.v - 1]}</span>
                </li>
              ))}
            </ul>
            <p className="tv-carac__nota">Não existe combinação certa de valores. Eles mostram o que você quer na sua vida profissional, não o que você gosta de fazer.</p>
          </motion.div>
          <motion.div className="tv-cartao tv-carac__c" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <h3>
              <img src="./voc/puzzle-piece.webp" alt="" /> Habilidades
            </h3>
            {hab.facilidade.length > 0 && (
              <>
                <small className="tv-carac__sub">Você sente facilidade em</small>
                <div className="tv-chips">
                  {hab.facilidade.map((h) => (
                    <span key={h} className="tv-chip tv-chip--verde">
                      {h}
                    </span>
                  ))}
                </div>
              </>
            )}
            {hab.desenvolver.length > 0 && (
              <>
                <small className="tv-carac__sub">Quer desenvolver</small>
                <div className="tv-chips">
                  {hab.desenvolver.map((h) => (
                    <span key={h} className="tv-chip tv-chip--roxo">
                      {h}
                    </span>
                  ))}
                </div>
              </>
            )}
            <p className="tv-carac__nota">É a sua percepção, não uma avaliação de aptidão. Serve para sugerir o que praticar, nunca para excluir caminhos.</p>
          </motion.div>
        </div>
      </section>

      {/* D — possibilidades */}
      <section id="sec-possibilidades" className="tv-rel__sec">
        <div className="tv-rel__sechead">
          <div>
            <h2 className="tv-h2g">Carreiras que você pode explorar</h2>
            <p className="tv-rel__lead">Não é um ranking nem uma garantia de sucesso: são profissões que compartilham características com as suas respostas, com o porquê de cada uma.</p>
          </div>
          <Btn variante="contorno" icone={<Search size={15} />} onClick={() => ir({ id: 'explorar' })}>
            Explorar todas
          </Btn>
        </div>
        {recs.length ? (
          <div className="tv-grade-carreiras">
            {recs.map((rec, i) => (
              <CardCarreira key={rec.id} c={CARREIRA[rec.id]} rec={rec} indice={i} onAbrir={() => abrir(rec.id, i)} />
            ))}
          </div>
        ) : (
          <div className="tv-cartao tv-vazio">
            <TriangleAlert size={26} />
            <strong>Sem sugestões fundamentadas desta vez</strong>
            <span>Como suas respostas ficaram parecidas em todas as áreas, preferimos não indicar profissões. Explore o catálogo livremente.</span>
            <Btn onClick={() => ir({ id: 'explorar' })}>Explorar profissões</Btn>
          </div>
        )}
        {recs.length > 0 && p.destaques.length >= 2 && (
          <div className="tv-combos">
            <span>Quer ver mais combinações?</span>
            {[
              [p.destaques[0], p.destaques[1]],
              [p.destaques[0], p.destaques[2]],
              [p.destaques[1], p.destaques[2]],
            ]
              .filter(([a, b]) => a && b)
              .map(([a, b]) => (
                <button key={a + b} className="tv-combo" onClick={() => ir({ id: 'explorar', dim: `${a}${b}` })}>
                  <img src={DIM[a].icone} alt="" />
                  {DIM[a].curto} + {DIM[b].curto}
                  <img src={DIM[b].icone} alt="" />
                </button>
              ))}
          </div>
        )}
      </section>

      {/* E — orientações de exploração */}
      <section id="sec-passos" className="tv-rel__sec">
        <h2 className="tv-h2g">Próximos passos</h2>
        <ProximosPassos p={p} primeira={recs[0]?.id} />
      </section>

      <footer className="tv-limites">
        <Info size={18} />
        <p>
          <strong>Sobre este resultado.</strong> Ele representa um retrato atual das suas preferências, baseado só nas suas respostas. Interesses mudam com o tempo, e tudo bem. O teste não é um instrumento psicológico, não mede aptidão nem inteligência e não substitui conversas com orientadores e pessoas de confiança. Instrumento {res.versao}, regras {res.regras}; em validação com especialistas.
        </p>
      </footer>

      <ComoChegamos aberto={comoModal} onFechar={() => setComoModal(false)} p={p} versao={res.versao} regras={res.regras} />
      <Modal
        aberto={refazer}
        onFechar={() => setRefazer(false)}
        titulo="Fazer o teste de novo?"
        rodape={
          <>
            <Btn variante="contorno" onClick={() => setRefazer(false)}>
              Cancelar
            </Btn>
            <Btn
              onClick={() => {
                setRefazer(false)
                iniciar()
                ir({ id: 'clareza' })
              }}
            >
              Começar nova tentativa
            </Btn>
          </>
        }
      >
        <p className="tv-texto">Uma nova tentativa é registrada separadamente. Este resultado continua guardado em Minha jornada, junto com suas carreiras salvas e seu plano.</p>
      </Modal>
    </div>
  )
}

/* ---------------- “Como você se sente agora?” (PRD §5.12), sem bloquear o relatório ---------------- */
function CartaoClareza() {
  const { ultima, ir } = useTv()
  const [fechado, setFechado] = useState(false)
  if (!ultima) return null
  const pos = ultima.clarezaPos
  const pre = ultima.clarezaPre
  if (pos) {
    const dif = pre ? pos.valor - pre : 0
    return (
      <motion.div className="tv-cartao tv-clarcard tv-clarcard--feito" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <span className="tv-clarcard__sobre">Sua clareza</span>
        <div className="tv-clarcard__evol">
          {pre ? (
            <>
              <span className="tv-clarcard__n">
                <small>Antes</small>
                {pre}
              </span>
              <ArrowRight size={18} />
            </>
          ) : null}
          <span className="tv-clarcard__n is-on">
            <small>Agora</small>
            {pos.valor}
          </span>
        </div>
        <p>{CLAREZA[pos.valor - 1].texto}.</p>
        <small>{dif > 0 ? 'Você está com mais clareza do que no início.' : dif < 0 ? 'Conhecer mais possibilidades às vezes traz novas dúvidas. Isso faz parte.' : 'Explorar as profissões pode ajudar a dar o próximo passo.'}</small>
      </motion.div>
    )
  }
  if (fechado) return null
  return (
    <>
      {(
        <motion.div className="tv-cartao tv-clarcard" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <img src="./voc/thinking-face.webp" alt="" className="tv-clarcard__img" />
          <span className="tv-clarcard__sobre">30 segundos</span>
          <strong>Como você se sente agora?</strong>
          <p>A mesma pergunta do início, para entender se a experiência ajudou. É opcional.</p>
          <Btn bloco onClick={() => ir({ id: 'clareza-pos' })}>
            Responder
          </Btn>
          <button className="tv-link" onClick={() => setFechado(true)}>
            Agora não
          </button>
        </motion.div>
      )}
    </>
  )
}

/* ---------------- mapa de interesses ---------------- */
function MapaInteresses({ p, r }: { p: Perfil; r: Respostas }) {
  const [aberta, setAberta] = useState<Dim | null>(null)
  const [tabela, setTabela] = useState(false)
  return (
    <div className="tv-cartao tv-mapa">
      <div className="tv-mapa__radar">
        <Radar norm={p.norm} destaques={p.destaques} />
        <p className="tv-mapa__legenda">Quanto mais longe do centro, mais você disse que gostaria de realizar atividades daquela área.</p>
      </div>
      <div className="tv-mapa__lista">
        <div className="tv-mapa__topo">
          <strong>Suas seis áreas de interesse</strong>
          <button className="tv-link" onClick={() => setTabela((x) => !x)} aria-pressed={tabela}>
            <Table2 size={14} /> {tabela ? 'Ver em barras' : 'Ver em tabela'}
          </button>
        </div>
        {tabela ? (
          <table className="tv-tabela">
            <caption>Soma das 5 respostas de cada área (de 5 a 25)</caption>
            <thead>
              <tr>
                <th>Área</th>
                <th>Soma</th>
                <th>Leitura</th>
              </tr>
            </thead>
            <tbody>
              {p.ordem.map((d) => (
                <tr key={d}>
                  <td>
                    {DIM[d].nome} ({d})
                  </td>
                  <td>{p.soma[d]} de 25</td>
                  <td>{nivel(p.norm[d])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <ul>
            {p.ordem.map((d, i) => {
              const on = aberta === d
              return (
                <li key={d} className={`tv-dimlinha ${p.destaques.includes(d) ? 'is-destaque' : ''}`} style={{ '--c': DIM[d].cor, '--cc': DIM[d].claro } as CSSProperties}>
                  <button className="tv-dimlinha__cab" onClick={() => setAberta(on ? null : d)} aria-expanded={on}>
                    <img src={DIM[d].icone} alt="" />
                    <span className="tv-dimlinha__nome">
                      <strong>{DIM[d].nome}</strong>
                      <small>
                        {nivel(p.norm[d])} · {DIM[d].tecnico}
                      </small>
                    </span>
                    <span className="tv-dimlinha__barra">
                      <motion.span initial={{ width: 0 }} animate={{ width: `${Math.max(4, p.norm[d])}%` }} transition={{ delay: 0.1 + i * 0.07, type: 'spring', stiffness: 90, damping: 18 }} />
                    </span>
                    <ChevronDown size={16} className={`tv-dimlinha__seta ${on ? 'is-on' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div className="tv-dimlinha__det" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                        <p>{DIM[d].descricao}</p>
                        {p.contribuiram[d].length ? (
                          <>
                            <small>O que contribuiu (respostas 4 e 5):</small>
                            <ul>
                              {p.contribuiram[d].map((id) => (
                                <li key={id}>
                                  “{ITEM[id].texto.replace(/\.$/, '')}” · <b>{ESCALA.interesse[(r[id] as number) - 1]}</b>
                                </li>
                              ))}
                            </ul>
                          </>
                        ) : (
                          <small>Nenhuma atividade desta área foi marcada com 4 ou 5. Interesse menor não significa incapacidade, e interesses mudam.</small>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              )
            })}
          </ul>
        )}
        <p className="tv-mapa__nota">
          <Info size={13} /> A escala mostra a posição das suas respostas no questionário. Não é percentual de aptidão nem chance de sucesso.
        </p>
      </div>
    </div>
  )
}

/* ---------------- próximos passos ---------------- */
function ProximosPassos({ p, primeira }: { p: Perfil; primeira?: string }) {
  const { s, addAcao, ir, toast } = useTv()
  const sugeridas = primeira ? acoesSugeridas(CARREIRA[primeira]).slice(0, 3) : []
  const jaTem = (texto: string) => s.acoes.some((a) => a.texto === texto)
  return (
    <div className="tv-passos2">
      <div className="tv-cartao tv-reflexao">
        <h3>
          <img src="./voc/thinking-face.webp" alt="" /> Perguntas para refletir
        </h3>
        <ol>
          {(p.destaques.length ? perguntasReflexao(p) : perguntasReflexao({ ...p, destaques: p.ordem.slice(0, 2) })).map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ol>
      </div>
      {primeira && (
        <div className="tv-cartao tv-sugestoes">
          <h3>
            <img src="./voc/memo.webp" alt="" /> Comece por aqui: {CARREIRA[primeira].nome}
          </h3>
          <ul>
            {sugeridas.map((a) => {
              const tem = jaTem(a.texto)
              return (
                <li key={a.texto}>
                  <span>{a.texto}</span>
                  <Btn
                    pequeno
                    variante={tem ? 'suave' : 'contorno'}
                    disabled={tem}
                    icone={tem ? <Check size={14} /> : <ListPlus size={14} />}
                    onClick={() => {
                      addAcao({ texto: a.texto, tipo: a.tipo, carreira: primeira })
                      toast('Ação adicionada ao seu plano.', 'ok', { rotulo: 'Ver plano', fn: () => ir({ id: 'plano' }) })
                    }}
                  >
                    {tem ? 'No plano' : 'Adicionar'}
                  </Btn>
                </li>
              )
            })}
          </ul>
        </div>
      )}
      <div className="tv-atalhos">
        {[
          { I: Compass, t: 'Explore outras áreas', d: 'Todas as profissões do catálogo, mesmo as que não apareceram aqui.', fn: () => ir({ id: 'explorar' }) },
          { I: Columns3, t: 'Compare possibilidades', d: 'Veja lado a lado o dia a dia, a formação e os desafios.', fn: () => ir({ id: 'comparar' }) },
          { I: Signpost, t: 'Monte seu plano', d: 'Transforme interesse em ações concretas para investigar.', fn: () => ir({ id: 'plano' }) },
        ].map(({ I, t, d, fn }) => (
          <motion.button key={t} className="tv-cartao tv-atalho" onClick={fn} whileHover={{ y: -3 }}>
            <span className="tv-atalho__ic">
              <I size={20} />
            </span>
            <strong>{t}</strong>
            <span>{d}</span>
            <ArrowRight size={16} className="tv-atalho__seta" />
          </motion.button>
        ))}
      </div>
    </div>
  )
}

/* ---------------- transparência: como chegamos (Princípio 7) ---------------- */
function ComoChegamos({ aberto, onFechar, p, versao, regras }: { aberto: boolean; onFechar: () => void; p: Perfil; versao: string; regras: string }) {
  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo="Como chegamos a este resultado" largura={600}>
      <div className="tv-como">
        <ol>
          <li>
            <strong>Somamos suas respostas em cada área.</strong> Cada uma das seis áreas tem 5 atividades, com respostas de 1 a 5. A soma vai de 5 a 25.
            <div className="tv-como__somas">
              {p.ordem.map((d) => (
                <span key={d} style={{ '--c': DIM[d].cor } as CSSProperties}>
                  <img src={DIM[d].icone} alt="" />
                  {DIM[d].nome}
                  <b>{p.soma[d]}</b>
                  <Barra valor={((p.soma[d] - 5) / 20) * 100} cor={DIM[d].cor} />
                </span>
              ))}
            </div>
          </li>
          <li>
            <strong>Destacamos até três pistas.</strong> As áreas com maior soma viram pistas de exploração. Se houver empate, as duas ficam; se tudo estiver muito parecido, dizemos isso em vez de forçar um resultado.
          </li>
          <li>
            <strong>Comparamos com profissões do catálogo.</strong> Cada profissão tem um perfil de referência nas mesmas seis áreas, baseado em fontes como a CBO e o O*NET. Calculamos a distância entre o seu perfil e o de cada profissão; as áreas em que você demonstrou mais interesse pesam mais.
          </li>
          <li>
            <strong>Escolhemos seis possibilidades diversas.</strong> No máximo duas por área principal e por campo de atuação, com ao menos uma profissão pouco conhecida, para ampliar seu repertório.
          </li>
          <li>
            <strong>Valores, preferências e habilidades explicam, não eliminam.</strong> Eles aparecem nas justificativas e nos alertas de “vale investigar”, mas nunca tiram uma profissão da lista.
          </li>
        </ol>
        <p className="tv-como__nao">
          <TriangleAlert size={15} /> Não usamos gênero, escola, notas ou sua resposta de clareza para recomendar. Mesmas respostas, mesma versão, mesmo resultado.
        </p>
        <small className="tv-versao">
          Instrumento {versao} · Regras de recomendação {regras}
        </small>
      </div>
    </Modal>
  )
}
