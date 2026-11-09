import { motion } from 'framer-motion'
import { BookOpenCheck, Briefcase, CalendarCheck, Check, Columns3, ExternalLink, GraduationCap, ListPlus, Lightbulb, MapPin, Mountain, Puzzle, Route, Sparkles, Star, ThumbsDown, TriangleAlert, Wallet, Wrench } from 'lucide-react'
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { AREA, CARREIRA, FONTE_REMUNERACAO, FONTES, REVISAO, perfilDe } from '../carreiras'
import { Radar } from '../components/perfil'
import { Btn, Modal, Rico, Voltar } from '../components/ui'
import { DIM, type Dim } from '../instrumento'
import { CATEGORIA, acoesSugeridas, explicar, nivel } from '../motor'
import { useTv, type View } from '../store'

const VOLTAR: Record<string, { texto: string; v: View }> = {
  relatorio: { texto: 'Meu perfil', v: { id: 'relatorio', secao: 'possibilidades' } },
  explorar: { texto: 'Explorar carreiras', v: { id: 'explorar' } },
  minhas: { texto: 'Minhas carreiras', v: { id: 'minhas' } },
  comparar: { texto: 'Comparar', v: { id: 'comparar' } },
  plano: { texto: 'Meu plano', v: { id: 'plano' } },
}

/** Conheça a profissão (PRD §5.8) */
export default function CarreiraTela({ v }: { v: Extract<View, { id: 'carreira' }> }) {
  const { s, ir, ultima, favoritar, toggleComparar, toast, descartar, track } = useTv()
  const c = CARREIRA[v.carreira]
  const [plano, setPlano] = useState(false)
  const volta = VOLTAR[v.de ?? 'explorar']
  const salvo = s.favoritos.some((f) => f.id === c.id)
  const comparando = s.comparar.includes(c.id)
  const res = ultima?.resultado
  const rec = res?.recomendacoes.find((x) => x.id === c.id)
  const exp = res && !res.perfil.inconclusivo ? explicar(res.perfil, ultima!.respostas, c) : null
  const descartada = s.descartadas.includes(c.id)

  useEffect(() => {
    if (v.de !== 'relatorio') track('career_recommendation_opened', { profissao: c.id, posicao: 'fora da lista' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [c.id])

  const salvar = () => {
    const on = favoritar(c.id)
    toast(on ? `${c.nome} salva em Minhas carreiras.` : `${c.nome} removida de Minhas carreiras.`, on ? 'ok' : 'info', on ? { rotulo: 'Ver lista', fn: () => ir({ id: 'minhas' }) } : undefined)
  }

  return (
    <div className="tv-prof">
      <Voltar texto={volta.texto} onClick={() => ir(volta.v, -1)} />

      <header className="tv-prof__cab">
        <motion.span className="tv-prof__ic" style={{ '--c': AREA[c.area].cor } as CSSProperties} initial={{ scale: 0.6, rotate: -12 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 240, damping: 14 }}>
          <img src={c.icone} alt="" />
        </motion.span>
        <div className="tv-prof__tit">
          <div className="tv-prof__tags">
            <span className="tv-tag tv-tag--area" style={{ '--c': AREA[c.area].cor } as CSSProperties}>
              {AREA[c.area].nome}
            </span>
            {rec && <span className={`tv-tag tv-tag--${rec.categoria}`}>{CATEGORIA[rec.categoria]}</span>}
            {c.poucoConhecida && <span className="tv-tag tv-tag--nova">Pouco conhecida</span>}
          </div>
          <h1 className="tv-h1">{c.nome}</h1>
          <p>{c.descricao}</p>
        </div>
        <div className="tv-prof__acoes">
          <button className={`tv-salvar ${salvo ? 'is-on' : ''}`} onClick={salvar} aria-pressed={salvo}>
            <motion.span key={String(salvo)} initial={salvo ? { scale: 0.3, rotate: -40 } : false} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 14 }} className="tv-salvar__ic">
              <Star size={18} strokeWidth={salvo ? 0 : 1.8} fill={salvo ? 'currentColor' : 'none'} />
            </motion.span>
            {salvo ? 'Salva' : 'Salvar'}
          </button>
          <Btn
            variante={comparando ? 'suave' : 'contorno'}
            icone={<Columns3 size={16} />}
            aria-pressed={comparando}
            onClick={() => {
              const r = toggleComparar(c.id)
              if (r === 'cheio') toast('Você pode comparar até 3 profissões. Remova uma para adicionar outra.', 'info')
            }}
          >
            {comparando ? 'Na comparação' : 'Comparar'}
          </Btn>
          <Btn icone={<ListPlus size={16} />} onClick={() => setPlano(true)}>
            Adicionar ao plano
          </Btn>
        </div>
      </header>

      <div className="tv-prof__grade">
        <div className="tv-prof__col">
          <Bloco icone={<Sparkles size={18} />} titulo="Como é o dia a dia">
            <ul className="tv-lista-check">
              {c.atividades.map((a) => (
                <li key={a}>
                  <Check size={14} strokeWidth={3} /> {a}
                </li>
              ))}
            </ul>
          </Bloco>
          <Bloco icone={<Puzzle size={18} />} titulo="Problemas que costuma resolver">
            <ul className="tv-lista-ponto">
              {c.problemas.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </Bloco>
          <div className="tv-prof__duo">
            <Bloco icone={<Wrench size={18} />} titulo="Competências frequentes">
              <div className="tv-chips">
                {c.competencias.map((a) => (
                  <span key={a} className="tv-chip tv-chip--g">
                    {a}
                  </span>
                ))}
              </div>
              <p className="tv-bloco__nota">Usadas com frequência, não são requisitos universais.</p>
            </Bloco>
            <Bloco icone={<MapPin size={18} />} titulo="Onde trabalha">
              <div className="tv-chips">
                {c.ambientes.map((a) => (
                  <span key={a} className="tv-chip tv-chip--g">
                    {a}
                  </span>
                ))}
              </div>
            </Bloco>
          </div>
          <Bloco icone={<GraduationCap size={18} />} titulo="Cursos e formações possíveis">
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
          </Bloco>
          <Bloco icone={<Route size={18} />} titulo="Caminhos de ingresso e qualificação">
            <div className="tv-ingresso">
              <div>
                <span className="tv-ingresso__rot tv-ingresso__rot--obr">Obrigatório</span>
                <ul className="tv-lista-ponto">
                  {c.ingresso.obrigatorio.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="tv-ingresso__rot">Desejável</span>
                <ul className="tv-lista-ponto">
                  {c.ingresso.desejavel.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Bloco>
          <div className="tv-prof__duo">
            <Bloco icone={<Lightbulb size={18} />} titulo="Possibilidades de especialização">
              <div className="tv-chips">
                {c.especializacoes.map((a) => (
                  <span key={a} className="tv-chip tv-chip--roxo">
                    {a}
                  </span>
                ))}
              </div>
            </Bloco>
            <Bloco icone={<Mountain size={18} />} titulo="Aspectos desafiadores" tom="alerta">
              <ul className="tv-lista-ponto">
                {c.desafios.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </Bloco>
          </div>
        </div>

        <aside className="tv-prof__lado">
          <RelacaoInteresses c={c} />
          {exp && (
            <div className="tv-cartao tv-porque">
              <h3>{rec ? 'Por que apareceu para você' : 'Como se relaciona com suas respostas'}</h3>
              <ul>
                {exp.motivos.map((m) => (
                  <li key={m}>
                    <Rico texto={m} />
                  </li>
                ))}
              </ul>
              {exp.atencao && (
                <p className="tv-porque__atencao">
                  <TriangleAlert size={15} /> {exp.atencao}
                </p>
              )}
              {!rec && <p className="tv-porque__livre">Esta profissão não está entre as suas sugestões, e tudo bem: você pode explorar qualquer carreira.</p>}
              {rec && !descartada && (
                <button
                  className="tv-porque__nao"
                  onClick={() => {
                    descartar(c.id)
                    toast('Obrigado por contar. Isso não muda seu resultado, mas ajuda a melhorar as sugestões.', 'info', { rotulo: 'Explorar outras', fn: () => ir({ id: 'explorar' }) })
                  }}
                >
                  <ThumbsDown size={14} /> Não me identifiquei com esta sugestão
                </button>
              )}
              {descartada && <p className="tv-porque__livre">Você indicou que esta sugestão não combina com você. Ela continua aqui caso mude de ideia.</p>}
            </div>
          )}
          <div className="tv-cartao tv-mais">
            <h3>
              <Wallet size={17} /> Mais informações
            </h3>
            <dl>
              <dt>Faixa de remuneração</dt>
              {c.remuneracao ? (
                <dd>
                  <strong>{c.remuneracao.faixa}</strong>
                  <small>
                    {c.remuneracao.recorte}. {FONTE_REMUNERACAO}
                  </small>
                </dd>
              ) : (
                <dd className="is-indisponivel">Dado indisponível no catálogo. Preferimos não estimar.</dd>
              )}
              <dt>
                <Briefcase size={14} /> Trabalho autônomo
              </dt>
              <dd>{c.autonomo}</dd>
            </dl>
            <p className="tv-mais__aviso">Valores de mercado mudam e não são garantia de renda, emprego ou sucesso.</p>
          </div>
          <div className="tv-cartao tv-relac">
            <h3>Profissões relacionadas</h3>
            {c.relacionadas.map((id) => (
              <button key={id} onClick={() => ir({ id: 'carreira', carreira: id, de: v.de })}>
                <img src={CARREIRA[id].icone} alt="" />
                <span>{CARREIRA[id].nome}</span>
              </button>
            ))}
          </div>
          <div className="tv-fontes">
            <h3>
              <BookOpenCheck size={15} /> Fontes e referências
            </h3>
            <ul>
              {FONTES.map((f) => (
                <li key={f}>
                  <ExternalLink size={12} /> {f}
                </li>
              ))}
            </ul>
            <small>Última revisão: {REVISAO}. Conteúdo ilustrativo do protótipo, pendente de revisão especializada.</small>
          </div>
        </aside>
      </div>

      <PlanoModal aberto={plano} onFechar={() => setPlano(false)} carreira={c.id} />
    </div>
  )
}

function Bloco({ icone, titulo, children, tom }: { icone: ReactNode; titulo: string; children: ReactNode; tom?: 'alerta' }) {
  return (
    <motion.section className={`tv-cartao tv-bloco ${tom ? `tv-bloco--${tom}` : ''}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h2>
        {icone} {titulo}
      </h2>
      {children}
    </motion.section>
  )
}

/** relação entre o perfil do estudante e o perfil de referência da ocupação */
function RelacaoInteresses({ c }: { c: (typeof CARREIRA)[string] }) {
  const { ultima, ir } = useTv()
  const p = ultima?.resultado?.perfil
  const letras = [...c.codigo] as Dim[]
  if (!p) {
    return (
      <div className="tv-cartao tv-relacao tv-relacao--sem">
        <h3>Relação com seus interesses</h3>
        <div className="tv-relacao__dims">
          {letras.map((d) => (
            <span key={d} className="tv-mini" style={{ '--c': DIM[d].cor, '--cc': DIM[d].claro } as CSSProperties}>
              <img src={DIM[d].icone} alt="" /> {DIM[d].curto}
            </span>
          ))}
        </div>
        <p>Faça o Teste Vocacional para ver como esta profissão se relaciona com os seus interesses.</p>
        <Btn bloco variante="suave" onClick={() => ir({ id: 'entrada' })}>
          Conhecer o teste
        </Btn>
      </div>
    )
  }
  return (
    <div className="tv-cartao tv-relacao">
      <h3>Relação com seus interesses</h3>
      <div className="tv-relacao__radar">
        <Radar norm={p.norm} referencia={perfilDe(c.codigo)} tam={260} destaques={letras} />
      </div>
      <div className="tv-relacao__leg">
        <span>
          <i className="is-voce" /> Suas respostas
        </span>
        <span>
          <i className="is-ref" /> Perfil de referência da profissão
        </span>
      </div>
      <ul className="tv-relacao__lista">
        {letras.map((d) => (
          <li key={d}>
            <img src={DIM[d].icone} alt="" />
            <span>{DIM[d].nome}</span>
            <small className={p.norm[d] >= 70 ? 'is-alto' : ''}>{nivel(p.norm[d])}</small>
          </li>
        ))}
      </ul>
    </div>
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
      titulo={`Investigar ${c.nome}`}
      largura={540}
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
              toast(`${sel.length === 1 ? '1 ação adicionada' : `${sel.length} ações adicionadas`} ao seu plano.`, 'ok', { rotulo: 'Ver plano', fn: () => ir({ id: 'plano' }) })
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
