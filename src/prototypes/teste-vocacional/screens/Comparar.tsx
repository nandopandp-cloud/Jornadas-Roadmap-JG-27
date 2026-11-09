import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, Columns3, Plus, X } from 'lucide-react'
import { Fragment, useEffect, type CSSProperties, type ReactNode } from 'react'
import { AREA, CARREIRA, CARREIRAS, type Carreira } from '../carreiras'
import { Btn, Etiqueta, Select } from '../components/ui'
import { FotoProf } from '../components/perfil'
import { DIM, ITEM, type Dim } from '../instrumento'
import { nivel, preferencias, valoresDestacados } from '../motor'
import { useTv } from '../store'

const CTX: Record<string, [string, string]> = {
  P01: ['Muita interação com pessoas', 'Concentração individual'],
  P02: ['Rotina definida', 'Atividades variadas'],
  P03: ['Resultados práticos', 'Ideias e análises'],
  P04: ['Executar o definido', 'Definir e construir'],
  P05: ['Aprofundar um tema', 'Alternar temas'],
  P06: ['Presencial ou campo', 'Digital ou remoto'],
}
const NOME_VALOR = Object.fromEntries(['V01', 'V02', 'V03', 'V04', 'V05', 'V06', 'V07', 'V08'].map((v) => [v, (ITEM[v] as { curto: string }).curto]))

/** Comparador de carreiras (PRD §5.9): informações padronizadas, sem eleger uma “melhor” */
export default function Comparar() {
  const { s, ir, setComparar, toggleComparar, ultima, track } = useTv()
  const ids = s.comparar
  const cs = ids.map((id) => CARREIRA[id])
  const p = ultima?.resultado?.perfil
  const r = ultima?.respostas
  const prefs = r ? preferencias(r) : []
  const meusValores = r ? valoresDestacados(r).map((v) => v.id) : []
  const recsIds = ultima?.resultado?.recomendacoes.map((x) => x.id) ?? []

  useEffect(() => {
    if (ids.length >= 2) track('career_comparison_started', { quantidade: ids.length })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.length])

  const opcoes = (atual?: string) =>
    [...CARREIRAS]
      .sort((a, b) => a.area.localeCompare(b.area) || a.nome.localeCompare(b.nome))
      .filter((c) => c.id === atual || !ids.includes(c.id))
      .map((c) => ({ valor: c.id, texto: c.nome, grupo: AREA[c.area].nome }))
  const trocar = (i: number, novo: string) => setComparar(ids.map((x, j) => (j === i ? novo : x)))

  const linhas: { rot: string; ajuda?: string; cel: (c: Carreira) => ReactNode }[] = [
    {
      rot: 'Relação com seus interesses',
      cel: (c) => (
        <div className="tv-cmp__dims">
          {([...c.codigo] as Dim[]).map((d) => (
            <span key={d} className={`tv-mini ${p?.destaques.includes(d) ? 'is-on' : ''}`} style={{ '--c': DIM[d].cor, '--cc': DIM[d].claro } as CSSProperties}>
              <img src={DIM[d].icone} alt="" />
              {DIM[d].curto}
              {p && <small>{nivel(p.norm[d]).replace('Interesse ', '')}</small>}
            </span>
          ))}
        </div>
      ),
    },
    { rot: 'O que faz', cel: (c) => <p>{c.descricao}</p> },
    { rot: 'Dia a dia', cel: (c) => <ul>{c.atividades.map((a) => <li key={a}>{a}</li>)}</ul> },
    { rot: 'Competências frequentes', cel: (c) => <div className="tv-chips">{c.competencias.map((a) => <span key={a} className="tv-chip">{a}</span>)}</div> },
    {
      rot: 'Formações',
      cel: (c) => (
        <ul className="tv-cmp__form">
          {c.formacoes.map((f) => (
            <li key={f.nome}>
              <b>{f.tipo}</b> {f.nome} <small>{f.duracao}</small>
            </li>
          ))}
        </ul>
      ),
    },
    { rot: 'Requisitos de ingresso', ajuda: 'Obrigatórios', cel: (c) => <ul>{c.ingresso.obrigatorio.map((a) => <li key={a}>{a}</li>)}</ul> },
    {
      rot: 'Contexto de trabalho',
      ajuda: prefs.length ? '✓ combina com o que você prefere hoje' : undefined,
      cel: (c) => (
        <ul className="tv-cmp__ctx">
          {(Object.keys(CTX) as (keyof Carreira['contexto'])[]).map((k) => {
            const v = c.contexto[k]
            const minha = prefs.find((x) => x.id === k)?.lado
            const combina = minha && (v === 'ambos' || v === minha)
            return (
              <li key={k} className={combina ? 'is-ok' : ''}>
                {combina ? <Check size={12} strokeWidth={3} /> : <i />}
                {v === 'ambos' ? `${CTX[k][0]} ou ${CTX[k][1].toLowerCase()}` : CTX[k][v === 'a' ? 0 : 1]}
              </li>
            )
          })}
        </ul>
      ),
    },
    {
      rot: 'Pontos positivos',
      ajuda: 'Valores que costuma oferecer',
      cel: (c) => (
        <div className="tv-chips">
          {c.valores.map((v) => (
            <span key={v} className={`tv-chip ${meusValores.includes(v) ? 'tv-chip--verde' : ''}`}>
              {NOME_VALOR[v]}
            </span>
          ))}
        </div>
      ),
    },
    { rot: 'Desafios', cel: (c) => <ul className="tv-cmp__desafios">{c.desafios.map((a) => <li key={a}>{a}</li>)}</ul> },
    {
      rot: 'Remuneração',
      ajuda: 'Faixa ilustrativa',
      cel: (c) => (c.remuneracao ? <p><b>{c.remuneracao.faixa}</b> <small>{c.remuneracao.recorte}</small></p> : <p className="is-indisponivel">Dado indisponível</p>),
    },
    { rot: 'Trabalho autônomo', cel: (c) => <p>{c.autonomo}</p> },
  ]

  return (
    <div className="tv-comparar">
      <header className="tv-pagcab">
        <div>
          <Etiqueta>Explorar profissões</Etiqueta>
          <h1 className="tv-h1">Compare suas possibilidades</h1>
          <p className="tv-lead">Veja lado a lado semelhanças, diferenças e trade-offs. Nenhuma profissão é melhor que outra: o que importa é o que faz sentido para você.</p>
        </div>
        <img src="./voc/ref/banner-preferencias.webp" alt="" className="tv-pagcab__arte" />
      </header>

      {cs.length < 2 && (
        <div className="tv-cartao tv-cmp__vazio">
          <Columns3 size={28} />
          <div>
            <strong>{cs.length ? 'Escolha mais uma profissão para comparar' : 'Escolha de 2 a 3 profissões'}</strong>
            <span>Escolha aqui ou use “Comparar” na página de cada profissão. {recsIds.length > 0 && 'Atalho: suas profissões recomendadas.'}</span>
            {recsIds.length > 0 && (
              <div className="tv-chips">
                {recsIds
                  .filter((id) => !ids.includes(id))
                  .map((id) => (
                    <button key={id} className="tv-chip tv-chip--roxo" onClick={() => toggleComparar(id)}>
                      <Plus size={13} /> {CARREIRA[id].nome}
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="tv-cmp" style={{ '--n': Math.max(cs.length + (cs.length < 3 ? 1 : 0), 2) } as CSSProperties}>
        <div className="tv-cmp__grade">
          <div className="tv-cmp__canto" />
          <AnimatePresence initial={false}>
            {cs.map((c, i) => (
              <motion.div key={c.id} layout className="tv-cmp__col-cab" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
                <FotoProf c={c} className="tv-cmp__foto" />
                <div className="tv-cmp__topo">
                  <button className="tv-iconbtn" onClick={() => toggleComparar(c.id)} aria-label={`Tirar ${c.nome} da comparação`}>
                    <X size={16} />
                  </button>
                </div>
                <small>{AREA[c.area].nome}</small>
                <Select valor={c.id} rotulo="Trocar profissão" className="tv-cmp__troca" opcoes={opcoes(c.id)} onChange={(v) => trocar(i, v)} />
                <button className="tv-link tv-link--seta" onClick={() => ir({ id: 'carreira', carreira: c.id, de: 'comparar' })}>
                  Conhecer a profissão <ArrowRight size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {cs.length < 3 && (
            <div className="tv-cmp__col-cab tv-cmp__add">
              <span className="tv-cmp__mais">
                <Plus size={20} />
              </span>
              <small>Adicionar profissão</small>
              <Select valor="" placeholder="Escolher…" rotulo="Adicionar profissão" className="tv-cmp__troca" opcoes={opcoes()} onChange={(v) => setComparar([...ids, v])} />
            </div>
          )}

          {cs.length > 0 &&
            linhas.map((l) => (
              <Fragment key={l.rot}>
                <div className="tv-cmp__rot">
                  <strong>{l.rot}</strong>
                  {l.ajuda && <small>{l.ajuda}</small>}
                </div>
                {cs.map((c) => (
                  <motion.div key={c.id + l.rot} layout className="tv-cmp__cel" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {l.cel(c)}
                  </motion.div>
                ))}
                {cs.length < 3 && <div className="tv-cmp__cel tv-cmp__cel--vazia" />}
              </Fragment>
            ))}
        </div>
      </div>

      {cs.length >= 2 && (
        <div className="tv-cmp__rodape">
          <p>Ficou com dúvidas? Leve estas perguntas para uma conversa com alguém da área ou com a orientação da escola.</p>
          <Btn variante="contorno" onClick={() => ir({ id: 'relatorio', aba: 'passos' })}>
            Ver próximos passos
          </Btn>
        </div>
      )}
    </div>
  )
}
