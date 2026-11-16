// As 4 abas do relatório da lição: Visão Geral, Engajamento, Aprendizagem e Glossário.
import { ArrowUpDown, BookOpen, CircleCheck, CircleX, Clock, ExternalLink, FileText, Headphones, Info, ListChecks, Maximize2, MonitorPlay, Sparkles, TriangleAlert, Upload } from 'lucide-react'
const ICONE_F = { Quiz: ListChecks, Resumo: FileText, Vídeo: MonitorPlay, Áudio: Headphones }
import { useMemo, useState } from 'react'
import {
  ACURACIA,
  ADEQUADO,
  ALUNOS,
  ATIVOS,
  AVALIADOS,
  DISC_COR,
  DISCIPLINAS_AGG,
  FCOR,
  FORMATOS,
  GLOSSARIO,
  MEDIA_INTER,
  META,
  N,
  NAO_AVALIADOS,
  PROF_COR,
  PROF_TXT,
  PROFS,
  PROFS_ORD,
  QCOR,
  QUADRANTES,
  QUADS,
  QUESTOES,
  SIT_COR,
  SITS,
  TOPICOS,
  TOTAL_INTER,
  acertoQ,
  fmtT,
  pct,
  plural,
  topicoPorId,
  totalTopico,
  type Aluno,
  type Disciplina,
  type Quadrante,
  type Questao,
  type Situacao,
} from './data'
import { Aviso, Badge, Busca, Cartao, Modal, Paginacao, Ponto, ProfPill, Select, Tabela, useOrdem, usePagina, type Coluna } from './pecas'

type Toast = (t: { titulo: string; texto?: string }) => void
const norm = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

function Exportar({ onToast, o }: { onToast: Toast; o: string }) {
  const [aberto, setAberto] = useState(false)
  return (
    <div className="rx-select-wrap">
      <button className="rx-btn is-primario" aria-expanded={aberto} onClick={() => setAberto((a) => !a)}>
        <Upload size={16} /> Exportar
      </button>
      {aberto && (
        <div className="rx-pop rl-pop is-dir" role="menu">
          {['CSV', 'PDF'].map((f) => (
            <button
              key={f}
              role="menuitem"
              onClick={() => {
                setAberto(false)
                onToast({ titulo: `${o} exportado em ${f}`, texto: 'O arquivo traz todos os registros, não só a página aberta.' })
              }}
            >
              Exportar {f}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const SitBadge = ({ s }: { s: Situacao }) => (
  <Badge tom={s === 'Finalizado' ? 'verde' : s === 'Em progresso' ? 'amarelo' : 'neutro'} icone={s === 'Finalizado' ? CircleCheck : s === 'Em progresso' ? Clock : CircleX}>
    {s}
  </Badge>
)

function Completude({ v }: { v: number }) {
  return (
    <span className="rl-comp">
      <span className="rl-comp__trilho">
        <i style={{ width: `${v}%`, background: v === 100 ? '#16A34A' : '#441F67' }} />
      </span>
      {v}%
    </span>
  )
}

/* ================================================================= Visão Geral */
export function VisaoGeral({ onToast }: { onToast: Toast }) {
  const [sit, setSit] = useState<'todas' | Situacao>('todas')
  const [busca, setBusca] = useState('')
  const lista = ALUNOS.filter((a) => (sit === 'todas' || a.sit === sit) && norm(a.nome).includes(norm(busca.trim())))
  const cols: Coluna<Aluno>[] = [
    { id: 'nome', t: 'Estudante', ord: (a) => a.nome, cel: (a) => <b className="rl-nome">{a.nome.toUpperCase()}</b> },
    { id: 'sit', t: 'Situação', w: '170px', ord: (a) => ['Finalizado', 'Em progresso', 'Não iniciado'].indexOf(a.sit), cel: (a) => <SitBadge s={a.sit} /> },
    { id: 'comp', t: 'Completude', w: '130px', ord: (a) => a.comp, cel: (a) => <Completude v={a.comp} /> },
    { id: 'inter', t: 'Interações', w: '100px', al: 'c', ord: (a) => a.inter, cel: (a) => a.inter },
    { id: 'des', t: 'Desempenho', w: '110px', al: 'c', ord: (a) => a.des ?? -1, cel: (a) => (a.des == null ? '—' : `${a.des}%`) },
    { id: 'prof', t: 'Proficiência', w: '140px', ord: (a) => PROFS_ORD.indexOf(a.prof), cel: (a) => <ProfPill p={a.prof} /> },
    { id: 'tempo', t: 'Tempo de estudo', w: '130px', al: 'c', ord: (a) => a.tempo, cel: (a) => fmtT(a.tempo) },
  ]
  const { ordenada, ord, alterna } = useOrdem(lista, cols, { id: 'nome', dir: 1 })
  const p = usePagina(ordenada, 10, [sit, busca, ord.id, ord.dir])
  return (
    <>
      <Cartao titulo="Acompanhamento dos estudantes" info="Situação, completude, interações e resultados de cada estudante que recebeu a lição." desc="Situação, completude, interações e resultados de cada estudante que recebeu a lição.">
        <div className="rl-filtros">
          <Select
            rotulo="Situação"
            valor={sit}
            onChange={setSit}
            largura={230}
            opcoes={[
              { v: 'todas', t: `Todas as situações (${N})` },
              { v: 'Finalizado', t: `Finalizado (${SITS['Finalizado']})` },
              { v: 'Em progresso', t: `Em progresso (${SITS['Em progresso']})` },
              { v: 'Não iniciado', t: `Não iniciado (${SITS['Não iniciado']})` },
            ]}
          />
          <span className="rx-espaco" />
          <Busca valor={busca} onChange={setBusca} ph="Pesquisar pelo nome..." />
          <Exportar onToast={onToast} o="Acompanhamento dos estudantes" />
        </div>
        <Tabela rotulo="Acompanhamento dos estudantes" cols={cols} linhas={p.itens} ord={ord} onOrdenar={alterna} chave={(a) => a.id} vazio={`Nenhum estudante encontrado${busca ? ` para “${busca}”` : ''}.`} />
        <Paginacao p={p} />
      </Cartao>
      <Dispersao onToast={onToast} />
    </>
  )
}

function Dispersao({ onToast }: { onToast: Toast }) {
  const [quad, setQuad] = useState<'todos' | Quadrante>('todos')
  const [busca, setBusca] = useState('')
  const [hover, setHover] = useState<Aluno | null>(null)
  const W = 1000, H = 420, L = 56, R = 16, T = 18, B = 48
  const X = (v: number) => L + ((W - L - R) * v) / 25
  const Y = (v: number) => T + (H - T - B) * (1 - v / 100)
  const vistos: Record<string, number> = {}
  const pontos = AVALIADOS.map((a) => {
    const k = `${a.inter}|${a.des}`
    const n = (vistos[k] = (vistos[k] ?? 0) + 1)
    return { a, x: X(a.inter) + (n - 1) * 7, y: Y(a.des!) }
  })
  const lista = ALUNOS.filter((a) => (quad === 'todos' || a.quad === quad) && norm(a.nome).includes(norm(busca.trim())))
  const cols: Coluna<Aluno>[] = [
    { id: 'nome', t: 'Estudante', ord: (a) => a.nome, cel: (a) => <b className="rl-nome">{a.nome.toUpperCase()}</b> },
    { id: 'des', t: 'Desempenho', w: '130px', al: 'c', ord: (a) => a.des ?? -1, cel: (a) => (a.des == null ? '—' : `${a.des}%`) },
    { id: 'inter', t: 'Interações realizadas', w: '180px', al: 'c', ord: (a) => a.inter, cel: (a) => a.inter },
    { id: 'quad', t: 'Quadrante', w: '320px', ord: (a) => a.quad, cel: (a) => <b style={{ color: QCOR[a.quad][0] }}>{a.quad}</b> },
  ]
  const { ordenada, ord, alterna } = useOrdem(lista, cols, { id: 'des', dir: -1 })
  const p = usePagina(ordenada, 8, [quad, busca, ord.id, ord.dir])
  return (
    <Cartao titulo="Desempenho vs. Engajamento" info="Eixo X: interações de aprendizagem. Eixo Y: desempenho nos quizzes." desc="Cruza o desempenho nos quizzes com as interações de aprendizagem (resumos, vídeos, áudios e quizzes) de cada estudante. Clique em um quadrante para filtrar.">
      <div className="rl-quads" role="group" aria-label="Filtrar por quadrante">
        {[...QUADRANTES, 'Não avaliado' as Quadrante].map((q) => (
          <button key={q} className={`rl-quad ${quad === q ? 'is-on' : ''} ${quad !== 'todos' && quad !== q ? 'is-apagado' : ''}`} style={{ background: QCOR[q][1], color: QCOR[q][0], borderColor: quad === q ? QCOR[q][0] : 'transparent' }} aria-pressed={quad === q} onClick={() => setQuad((x) => (x === q ? 'todos' : q))}>
            <span>
              <Ponto cor={QCOR[q][0]} tam={11} /> <b>{QUADS[q] ?? 0}</b>
            </span>
            <small>{q === 'Não avaliado' ? 'Não avaliados' : q}</small>
          </button>
        ))}
      </div>
      <div className="rl-grafico">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Gráfico de dispersão: desempenho nos quizzes por interações de aprendizagem">
          {[0, 20, 40, 60, 80, 100].map((v) => (
            <g key={v}>
              <line x1={L} x2={W - R} y1={Y(v)} y2={Y(v)} stroke="#EDEDED" />
              <text x={L - 10} y={Y(v) + 4} textAnchor="end" className="rl-eixo">
                {v}%
              </text>
            </g>
          ))}
          {[0, 5, 10, 15, 20, 25].map((v) => (
            <text key={v} x={X(v)} y={H - B + 20} textAnchor="middle" className="rl-eixo">
              {v}
            </text>
          ))}
          <line x1={L} x2={W - R} y1={Y(0)} y2={Y(0)} stroke="#C4C4C4" />
          <text x={(L + W - R) / 2} y={H - 6} textAnchor="middle" className="rl-eixo">
            Interações de aprendizagem realizadas
          </text>
          <text transform={`translate(14 ${(T + H - B) / 2}) rotate(-90)`} textAnchor="middle" className="rl-eixo">
            Desempenho nos quizzes
          </text>
          <line x1={L} x2={W - R} y1={Y(META.desempenho)} y2={Y(META.desempenho)} stroke="#441F67" strokeDasharray="6 5" />
          <line x1={X(MEDIA_INTER)} x2={X(MEDIA_INTER)} y1={T} y2={Y(0)} stroke="#441F67" strokeDasharray="6 5" />
          <g>
            <rect x={W - R - 172} y={Y(META.desempenho) - 26} width={172} height={20} rx={4} fill="#441F67" />
            <text x={W - R - 86} y={Y(META.desempenho) - 12} textAnchor="middle" className="rl-rotulo">
              Meta de desempenho: {META.desempenho}%
            </text>
            <rect x={X(MEDIA_INTER) + 6} y={Y(0) - 26} width={190} height={20} rx={4} fill="#441F67" />
            <text x={X(MEDIA_INTER) + 101} y={Y(0) - 12} textAnchor="middle" className="rl-rotulo">
              Média da turma: {Math.round(MEDIA_INTER)} interações
            </text>
          </g>
          {pontos.map(({ a, x, y }) => {
            const ativo = quad === 'todos' || a.quad === quad
            return (
              <circle
                key={a.id}
                cx={x}
                cy={y}
                r={hover?.id === a.id ? 9 : 7}
                fill={QCOR[a.quad][0]}
                stroke="#fff"
                strokeWidth={2}
                opacity={ativo ? 1 : 0.15}
                tabIndex={0}
                aria-label={`${a.nome}: ${a.des}% de desempenho, ${a.inter} interações`}
                onMouseEnter={() => setHover(a)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(a)}
                onBlur={() => setHover(null)}
                className="rl-pt"
              />
            )
          })}
        </svg>
        {hover && (
          <div className="rl-dica" style={{ left: `${(X(hover.inter) / W) * 100}%`, top: `${(Y(hover.des!) / H) * 100}%` }}>
            <b>{hover.nome}</b>
            <span>
              {hover.des}% de desempenho · {hover.inter} interações
            </span>
            <small style={{ color: QCOR[hover.quad][0] }}>{hover.quad}</small>
          </div>
        )}
      </div>
      <Aviso tom="neutro" icone={Info}>
        {NAO_AVALIADOS.length} estudantes não iniciaram a lição e ficam fora do gráfico como não avaliados, sem distorcer a distribuição: {NAO_AVALIADOS.map((a) => a.nome).join(', ').replace(/, ([^,]*)$/, ' e $1')}.
      </Aviso>
      <hr className="rl-hr" />
      <div className="rl-filtros">
        <Select rotulo="Quadrante" valor={quad} onChange={setQuad} largura={320} opcoes={[{ v: 'todos', t: 'Todos os quadrantes' }, ...[...QUADRANTES, 'Não avaliado' as Quadrante].map((q) => ({ v: q, t: q === 'Não avaliado' ? 'Não avaliados' : q }))]} />
        <span className="rx-espaco" />
        <Busca valor={busca} onChange={setBusca} ph="Pesquisar pelo nome..." />
        <Exportar onToast={onToast} o="Desempenho vs. Engajamento" />
      </div>
      <Tabela rotulo="Estudantes por quadrante" cols={cols} linhas={p.itens} ord={ord} onOrdenar={alterna} chave={(a) => a.id} destaque={(a) => a.id === hover?.id} />
      <Paginacao p={p} />
    </Cartao>
  )
}

/* ================================================================= Engajamento */
function Kpi({ titulo, valor, meta, pctMeta, sub, info }: { titulo: string; valor: string; meta: string; pctMeta: number; sub: string; info: string }) {
  const cor = pctMeta >= 100 ? '#16A34A' : pctMeta >= 80 ? '#D97706' : '#DC2626'
  return (
    <div className="rx-cartao rl-kpi">
      <h3>
        {titulo}
        <span className="rl-info" tabIndex={0} aria-label={info} data-dica={info}>
          <Info size={14} />
        </span>
      </h3>
      <p className="rl-kpi__valor">
        <strong>{valor}</strong> <span>/ {meta}</span>
      </p>
      <p className="rl-kpi__meta">
        <b style={{ color: cor }}>{pctMeta}%</b> da meta
      </p>
      <small>{sub}</small>
    </div>
  )
}

export function Engajamento({ onEstudantes, onToast }: { onEstudantes: (s: Situacao) => void; onToast: Toast }) {
  const [modo, setModo] = useState<'pct' | 'num'>('pct')
  const [disc, setDisc] = useState<'todas' | Disciplina>('todas')
  const [busca, setBusca] = useState('')
  const [desc, setDesc] = useState(true)
  const [completo, setCompleto] = useState(false)
  const fin = SITS['Finalizado'] ?? 0
  const top = TOPICOS.filter((t) => (disc === 'todas' || t.disc === disc) && norm(t.nome).includes(norm(busca.trim()))).sort((a, b) => (totalTopico(b) - totalTopico(a)) * (desc ? 1 : -1))
  const max = Math.max(...TOPICOS.map(totalTopico))
  return (
    <>
      <div className="rl-kpis">
        <Kpi titulo="Estudantes que finalizaram" valor={`${pct(fin, N)}%`} meta={`${META.finalizaram}%`} pctMeta={Math.round((pct(fin, N) / META.finalizaram) * 100)} sub={`${fin} de ${N} estudantes concluíram todos os quizzes da lição`} info="Estudantes que concluíram todos os conteúdos obrigatórios (os quizzes) em relação ao total de participantes." />
        <Kpi titulo="Estudantes ativos" valor={`${pct(ATIVOS, N)}%`} meta={`${META.ativos}%`} pctMeta={Math.round((pct(ATIVOS, N) / META.ativos) * 100)} sub={`${ATIVOS} de ${N} estudantes fizeram pelo menos uma interação`} info="Estudantes com pelo menos uma interação em qualquer objeto de aprendizagem da lição." />
        <Kpi titulo="Média de interações realizadas" valor={String(Math.round(MEDIA_INTER))} meta={String(META.interacoes)} pctMeta={Math.round((Math.round(MEDIA_INTER) / META.interacoes) * 100)} sub={`${TOTAL_INTER} interações no total, entre resumos, vídeos, áudios e quizzes`} info="Média de interações de aprendizagem por estudante participante." />
      </div>

      <Cartao titulo="Progresso da lição" info="Para finalizar, o estudante precisa concluir os conteúdos obrigatórios: o quiz de cada tópico." desc="Em que etapa cada estudante está. Para finalizar, o estudante precisa concluir os conteúdos obrigatórios: o quiz de cada tópico.">
        <div className="rl-prog">
          {(['Finalizado', 'Em progresso', 'Não iniciado'] as Situacao[]).map((s) => {
            const v = SITS[s] ?? 0
            return (
              <div key={s} className="rl-prog__linha">
                <span className="rl-prog__rot">{s}</span>
                <span className="rl-prog__trilho">
                  <i style={{ width: `${(v / N) * 100}%`, background: SIT_COR[s] }} />
                </span>
                <span className="rl-prog__num">
                  <b>{plural(v, 'estudante', 'estudantes')}</b> · {pct(v, N)}%
                </span>
                <button className="rx-link" onClick={() => onEstudantes(s)}>
                  Ver estudantes
                </button>
              </div>
            )
          })}
        </div>
      </Cartao>

      <Cartao
        titulo="Consumo dos objetos de aprendizagem"
        novo
        info="Cada questão respondida no quiz conta como 1 interação."
        desc={`Como as ${TOTAL_INTER} interações se distribuem entre os formatos da lição. Só aparecem os formatos que foram usados nela.`}
        acoes={
          <div className="rl-seg" role="radiogroup" aria-label="Mostrar valores em">
            <button role="radio" aria-checked={modo === 'pct'} className={modo === 'pct' ? 'is-on' : ''} onClick={() => setModo('pct')}>
              Percentual
            </button>
            <button role="radio" aria-checked={modo === 'num'} className={modo === 'num' ? 'is-on' : ''} onClick={() => setModo('num')}>
              Quantidade
            </button>
          </div>
        }
      >
        <div className="rl-100" role="img" aria-label="Distribuição das interações por formato">
          {FORMATOS.map((f) => (
            <span key={f.f} style={{ width: `${(f.inter / TOTAL_INTER) * 100}%`, background: f.cor }} title={`${f.plural}: ${f.inter} interações (${pct(f.inter, TOTAL_INTER)}%)`}>
              {f.inter / TOTAL_INTER > 0.1 && `${f.plural} · ${modo === 'pct' ? pct(f.inter, TOTAL_INTER) + '%' : f.inter}`}
            </span>
          ))}
        </div>
        <div className="rl-formatos">
          {FORMATOS.map((f) => (
            <div key={f.f} className="rl-formato">
              <div className="rl-formato__topo">
                <span className="rl-tile" style={{ background: f.fundo, color: f.cor }}>
                  {(() => {
                    const Ic = ICONE_F[f.f]
                    return <Ic size={18} />
                  })()}
                </span>
                <span>
                  <b>{f.plural}</b>
                  <small>{f.naLicao}</small>
                </span>
              </div>
              <p className="rl-formato__valor" style={{ color: f.cor }}>
                {modo === 'pct' ? `${String(Math.round((f.inter / TOTAL_INTER) * 1000) / 10).replace('.', ',')}%` : f.inter}
                <small>{modo === 'pct' ? 'das interações' : 'interações'}</small>
              </p>
              <b className="rl-formato__abs">{modo === 'pct' ? `${f.inter} interações` : `${String(Math.round((f.inter / TOTAL_INTER) * 1000) / 10).replace('.', ',')}% do total`}</b>
              <div className="rl-formato__alc">
                <span>
                  <small>Alcance</small>
                  <small>
                    <b>
                      {f.alcance} de {ATIVOS} ativos
                    </b>{' '}
                    · {pct(f.alcance, ATIVOS)}%
                  </small>
                </span>
                <span className="rl-comp__trilho is-cheio">
                  <i style={{ width: `${pct(f.alcance, ATIVOS)}%`, background: f.cor }} />
                </span>
              </div>
            </div>
          ))}
        </div>
        <Aviso icone={Sparkles}>Os quizzes concentram a maior parte das interações porque cada questão respondida conta como 1 interação. Entre os materiais de estudo, os resumos foram os mais consumidos, e o áudio teve o menor alcance (19 estudantes).</Aviso>
      </Cartao>

      <Cartao titulo="Ranking de tópicos" info="Tópicos ordenados pelo total de interações, com a divisão por formato." desc="Tópicos com mais e menos interações, com a divisão por formato de conteúdo.">
        <div className="rl-filtros">
          <Select rotulo="Disciplina" valor={disc} onChange={setDisc} largura={220} opcoes={[{ v: 'todas', t: 'Todas as disciplinas' }, { v: 'Matemática', t: 'Matemática' }, { v: 'História', t: 'História' }]} />
          <span className="rx-espaco" />
          <Busca valor={busca} onChange={setBusca} ph="Pesquisar tópico..." />
          <button className="rx-btn is-contorno" onClick={() => setDesc((d) => !d)}>
            <ArrowUpDown size={16} /> {desc ? 'Mais interações' : 'Menos interações'}
          </button>
          <button className="rx-btn is-contorno" onClick={() => setCompleto(true)}>
            <Maximize2 size={16} /> Ranking completo
          </button>
        </div>
        <ol className="rl-rank">
          {top.map((t) => {
            const tot = totalTopico(t)
            return (
              <li key={t.id}>
                <span className="rl-rank__pos">{TOPICOS.slice().sort((a, b) => totalTopico(b) - totalTopico(a)).indexOf(t) + 1}º</span>
                <div>
                  <div className="rl-rank__cab">
                    <b>{t.nome}</b>
                    <span className="rl-disc" style={{ background: DISC_COR[t.disc][1], color: DISC_COR[t.disc][0] }}>
                      <Ponto cor={DISC_COR[t.disc][0]} tam={8} /> {t.disc}
                    </span>
                    <span className="rx-espaco" />
                    <b>{tot} interações</b>
                  </div>
                  <div className="rl-rank__barra">
                    {Object.entries(t.interacoes).map(([f, v]) => (
                      <i key={f} style={{ width: `${((v ?? 0) / max) * 100}%`, background: FCOR[f as keyof typeof FCOR] }} title={`${f}: ${v}`} />
                    ))}
                  </div>
                  <div className="rl-rank__fmt">
                    {Object.entries(t.interacoes).map(([f, v]) => (
                      <small key={f}>
                        <Ponto cor={FCOR[f as keyof typeof FCOR]} tam={8} /> {f} {v}
                      </small>
                    ))}
                  </div>
                </div>
              </li>
            )
          })}
          {top.length === 0 && <p className="rl-vazio">Nenhum tópico encontrado para “{busca}”.</p>}
        </ol>
        <div className="rl-legenda">
          {Object.entries(FCOR).map(([f, c]) => (
            <small key={f}>
              <Ponto cor={c} tam={9} /> {f}
            </small>
          ))}
        </div>
        {completo && (
          <RankingCompleto
            onFechar={() => setCompleto(false)}
            onToast={onToast}
          />
        )}
      </Cartao>
    </>
  )
}

function RankingCompleto({ onFechar, onToast }: { onFechar: () => void; onToast: Toast }) {
  const lista = [...TOPICOS].sort((a, b) => totalTopico(b) - totalTopico(a))
  return (
    <Modal aberto onFechar={onFechar} titulo="Ranking completo de tópicos" sub="Interações por formato em cada tópico da lição" largura={980} rodape={<><span className="rx-espaco" /><Exportar onToast={onToast} o="Ranking de tópicos" /></>}>
      <Tabela
        rotulo="Ranking completo de tópicos"
        chave={(t) => t.id}
        linhas={lista}
        cols={[
          { id: 'pos', t: 'Posição', w: '80px', al: 'c', cel: (t) => `${lista.indexOf(t) + 1}º` },
          { id: 'nome', t: 'Tópico', cel: (t) => <b className="rl-nome is-normal">{t.nome}</b> },
          { id: 'disc', t: 'Disciplina', w: '140px', cel: (t) => <span className="rl-disc" style={{ background: DISC_COR[t.disc][1], color: DISC_COR[t.disc][0] }}>{t.disc}</span> },
          ...(['Resumo', 'Vídeo', 'Áudio', 'Quiz'] as const).map((f) => ({ id: f, t: f, w: '80px', al: 'c' as const, cel: (t: (typeof lista)[0]) => t.interacoes[f] ?? '—' })),
          { id: 'tot', t: 'Total', w: '90px', al: 'c', cel: (t) => <b>{totalTopico(t)}</b> },
        ]}
      />
    </Modal>
  )
}

/* ================================================================= Aprendizagem */
export function Aprendizagem({ onQuestao }: { onQuestao: (q: Questao, lista: Questao[]) => void }) {
  const [buscaR, setBuscaR] = useState('')
  const [maior, setMaior] = useState(true)
  const [todos, setTodos] = useState(false)
  const [abertas, setAbertas] = useState<Disciplina[]>(['Matemática'])
  const [dq, setDq] = useState<'todas' | Disciplina>('todas')
  const [tq, setTq] = useState<string>('todos')
  const [oq, setOq] = useState<'menor' | 'maior' | 'resp'>('menor')
  const [bq, setBq] = useState('')
  const rank = (maior ? AVALIADOS : [...AVALIADOS].reverse()).filter((a) => norm(a.nome).includes(norm(buscaR.trim())))
  const posicao = (a: Aluno) => AVALIADOS.indexOf(a) + 1
  const filtrandoR = !!buscaR.trim()
  const visiveis: (Aluno | 'sep')[] = todos || filtrandoR || rank.length <= 8 ? rank : [...rank.slice(0, 5), 'sep', ...rank.slice(-3)]
  const questoes = useMemo(() => {
    const l = QUESTOES.filter((q) => (dq === 'todas' || topicoPorId(q.topico).disc === dq) && (tq === 'todos' || q.topico === tq) && norm(q.enun).includes(norm(bq.trim())))
    return l.sort((a, b) => (oq === 'menor' ? acertoQ(a) - acertoQ(b) : oq === 'maior' ? acertoQ(b) - acertoQ(a) : b.resp - a.resp))
  }, [dq, tq, oq, bq])
  const pq = usePagina(questoes, 3, [dq, tq, oq, bq])
  const adq = ADEQUADO
  return (
    <>
      <Aviso icone={Info}>Desempenho, acurácia e proficiência são calculados só com as respostas dos quizzes. Resumos, vídeos e áudios contam para o engajamento, mas não valem como acerto ou erro.</Aviso>
      <div className="rl-apr-topo">
        <div className="rl-apr-kpis">
          <Kpi titulo="Taxa de acurácia" valor={`${ACURACIA}%`} meta={`${META.acuracia}%`} pctMeta={Math.round((ACURACIA / META.acuracia) * 100)} sub="310 acertos em 465 respostas nos quizzes" info="Respostas corretas em relação ao total de respostas válidas nos quizzes." />
          <Kpi titulo="Estudantes com aprendizado adequado" valor={`${pct(adq[0], adq[1])}%`} meta={`${META.adequado}%`} pctMeta={Math.round((pct(adq[0], adq[1]) / META.adequado) * 100)} sub={`${adq[0]} de ${adq[1]} estudantes avaliados estão em Proficiente ou Avançado`} info="Estudantes avaliados em Proficiente ou Avançado." />
        </div>
        <Cartao titulo="Rubricas de proficiência" info="≥75% Avançado · 60–74% Proficiente · 45–59% Básico · <45% Insuficiente · sem respostas = Não avaliado" className="rl-rubricas">
          <small className="rl-dir">Meta: proficiente + avançado ≥ {META.adequado}%</small>
          <div className="rl-rub-barra">
            {PROFS_ORD.map((p) => (
              <i key={p} style={{ width: `${((PROFS[p] ?? 0) / N) * 100}%`, background: PROF_COR[p] }} title={`${p}: ${PROFS[p] ?? 0}`} />
            ))}
            <em style={{ left: `${META.adequado}%` }} aria-hidden />
          </div>
          <table className="rl-tabela is-simples">
            <thead>
              <tr>
                <th>Rubrica</th>
                <th className="is-c">% por rubrica</th>
                <th className="is-r">Estudantes</th>
              </tr>
            </thead>
            <tbody>
              {PROFS_ORD.map((p) => (
                <tr key={p}>
                  <td>
                    <span className="rl-leg">
                      <i style={{ background: PROF_COR[p] }} /> {p}
                    </span>
                  </td>
                  <td className="is-c">{pct(PROFS[p] ?? 0, N)}%</td>
                  <td className="is-r">
                    <b style={{ color: PROF_TXT[p] }}>{PROFS[p] ?? 0}</b>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Cartao>
      </div>

      <Cartao titulo="Ranking de aprendizagem da turma" info="Desempenho de cada estudante avaliado, com a proficiência e a meta da lição." desc="Desempenho de cada estudante nos quizzes, com a proficiência e a meta da lição.">
        <div className="rl-filtros">
          <span className="rx-espaco" />
          <Busca valor={buscaR} onChange={setBuscaR} ph="Pesquisar estudante..." />
          <button className="rx-btn is-contorno" onClick={() => setTodos((t) => !t)}>
            <Maximize2 size={16} /> {todos ? 'Resumir ranking' : 'Ranking completo'}
          </button>
          <button className="rx-btn is-contorno" onClick={() => setMaior((m) => !m)}>
            <ArrowUpDown size={16} /> {maior ? 'Maior desempenho' : 'Menor desempenho'}
          </button>
        </div>
        <div className="rl-turma">
          <span className="rl-turma__meta" style={{ left: `calc(40px + (100% - 40px) * ${META.desempenho / 100})` }}>
            <em>Meta {META.desempenho}%</em>
          </span>
          {visiveis.map((a) =>
            a === 'sep' ? (
              <div key="sep" className="rl-turma__sep">
                <button className="rx-btn is-contorno" onClick={() => setTodos(true)}>
                  <Maximize2 size={16} /> Ver todos os {AVALIADOS.length} estudantes
                </button>
              </div>
            ) : (
              <div key={a.id} className="rl-turma__linha">
                <small>{posicao(a)}º</small>
                <div>
                  <span className="rl-turma__cab">
                    <b>{a.nome.toUpperCase()}</b>
                    <ProfPill p={a.prof} />
                    <span className="rx-espaco" />
                    <b style={{ color: PROF_TXT[a.prof] }}>{a.des}%</b>
                  </span>
                  <span className="rl-comp__trilho is-cheio is-g">
                    <i style={{ width: `${a.des}%`, background: PROF_COR[a.prof] }} />
                  </span>
                </div>
              </div>
            ),
          )}
          {rank.length === 0 && <p className="rl-vazio">Nenhum estudante encontrado para “{buscaR}”.</p>}
        </div>
        <Aviso tom="neutro" icone={Info}>
          {NAO_AVALIADOS.length} estudantes não avaliados (não iniciaram a lição) não entram no ranking.
        </Aviso>
        <div className="rl-legenda">
          {PROFS_ORD.slice(0, 4).map((p) => (
            <small key={p}>
              <Ponto cor={PROF_COR[p]} tam={9} /> {p}
            </small>
          ))}
          <small>
            <i className="rl-traco" /> Meta
          </small>
        </div>
      </Cartao>

      <Cartao titulo="Aprendizagem por disciplina e tópico" novo info="Resultados dos quizzes organizados em disciplina → tópico." desc="Resultados dos quizzes organizados em disciplina → tópico. Expanda uma disciplina para ver cada tópico.">
        <div className="rl-tabela-rola">
          <table className="rl-tabela rl-disc-tab" aria-label="Aprendizagem por disciplina e tópico">
            <thead>
              <tr>
                <th>Disciplina / tópico</th>
                <th className="is-c">Questões</th>
                <th className="is-c">Respostas</th>
                <th className="is-c">Taxa de acerto</th>
                <th>Distribuição de proficiência</th>
                <th>Aprendizado adequado</th>
              </tr>
            </thead>
            {DISCIPLINAS_AGG.map((d) => {
              const aberta = abertas.includes(d.disc)
              const tops = TOPICOS.filter((t) => t.disc === d.disc)
              return (
                <tbody key={d.disc}>
                  <tr className="is-disc">
                    <td>
                      <button className="rl-acc" aria-expanded={aberta} onClick={() => setAbertas((l) => (l.includes(d.disc) ? l.filter((x) => x !== d.disc) : [...l, d.disc]))}>
                        <span className={`rl-chev ${aberta ? 'is-on' : ''}`}>›</span>
                        <Ponto cor={DISC_COR[d.disc][0]} /> <b>{d.disc}</b> <small>{plural(tops.length, 'tópico', 'tópicos')}</small>
                      </button>
                    </td>
                    <td className="is-c">
                      <b>{d.questoes}</b>
                    </td>
                    <td className="is-c">
                      <b>{d.respostas}</b>
                    </td>
                    <td className="is-c">
                      <b>{d.acerto}%</b>
                    </td>
                    <td>
                      <Dist d={d.dist} />
                    </td>
                    <td>
                      <Adequado a={d.adequado} />
                    </td>
                  </tr>
                  {aberta &&
                    tops.map((t) => (
                      <tr key={t.id} className={t.acerto < 50 ? 'is-alerta' : ''}>
                        <td className="rl-recuo">
                          <span className="rl-top">
                            <span>{t.nome}</span>
                            <span>
                              <Badge>{t.bncc}</Badge>
                              {t.acerto < 50 && (
                                <Badge tom="red" icone={TriangleAlert}>
                                  Precisa de atenção
                                </Badge>
                              )}
                            </span>
                          </span>
                        </td>
                        <td className="is-c">{t.questoes}</td>
                        <td className="is-c">{t.respostas}</td>
                        <td className="is-c">{t.acerto}%</td>
                        <td>
                          <Dist d={t.dist} />
                        </td>
                        <td>
                          <Adequado a={t.adequado} />
                        </td>
                      </tr>
                    ))}
                </tbody>
              )
            })}
          </table>
        </div>
        <div className="rl-legenda">
          {PROFS_ORD.map((p) => (
            <small key={p}>
              <Ponto cor={PROF_COR[p]} tam={9} /> {p}
            </small>
          ))}
        </div>
        <Aviso tom="amarelo" icone={TriangleAlert}>
          Matemática tem bom resultado em Pirâmides (70% de acerto), mas Planificação de prismas e pirâmides ficou em 46%, com só 9 de 31 estudantes no aprendizado adequado. Vale retomar esse tópico.
        </Aviso>
      </Cartao>

      <Cartao titulo="Questões da atividade" info="Só as questões que os estudantes realmente receberam." desc={`Só as questões que os estudantes realmente receberam (${QUESTOES.length} no total). Os quizzes são sorteados por estudante a partir dos tópicos da lição.`}>
        <div className="rl-filtros">
          <Select rotulo="Disciplina" valor={dq} largura={200} onChange={(v) => { setDq(v); setTq('todos') }} opcoes={[{ v: 'todas', t: 'Todas as disciplinas' }, { v: 'Matemática', t: 'Matemática' }, { v: 'História', t: 'História' }]} />
          <Select rotulo="Tópico" valor={tq} largura={300} onChange={setTq} opcoes={[{ v: 'todos', t: 'Todos os tópicos' }, ...TOPICOS.filter((t) => dq === 'todas' || t.disc === dq).map((t) => ({ v: t.id, t: t.nome }))]} />
          <Select rotulo="Ordenação" valor={oq} largura={210} onChange={setOq} opcoes={[{ v: 'menor', t: 'Menor taxa de acerto' }, { v: 'maior', t: 'Maior taxa de acerto' }, { v: 'resp', t: 'Mais respostas' }]} />
          <span className="rx-espaco" />
          <Busca valor={bq} onChange={setBq} ph="Pesquisar no enunciado..." />
        </div>
        <div className="rl-questoes">
          {pq.itens.map((q) => (
            <CardQuestao key={q.id} q={q} onAbrir={() => onQuestao(q, questoes)} />
          ))}
          {questoes.length === 0 && <p className="rl-vazio">Nenhuma questão encontrada com esses filtros.</p>}
        </div>
        <Paginacao p={pq} rotulo="questões" />
      </Cartao>
    </>
  )
}

function Dist({ d }: { d: number[] }) {
  const tot = d.reduce((a, b) => a + b, 0)
  return (
    <span className="rl-dist" title={PROFS_ORD.map((p, i) => `${p}: ${d[i]}`).join(' · ')} aria-label={PROFS_ORD.map((p, i) => `${p}: ${d[i]}`).join(', ')}>
      {d.map((v, i) => (
        <i key={i} style={{ width: `${(v / tot) * 100}%`, background: PROF_COR[PROFS_ORD[i]] }} />
      ))}
    </span>
  )
}
function Adequado({ a }: { a: [number, number] }) {
  const p = pct(a[0], a[1])
  return (
    <span className="rl-adq">
      <b>
        {a[0]} de {a[1]}
      </b>
      <Badge tom={p >= 65 ? 'verde' : p >= 45 ? 'amarelo' : 'red'}>{p}%</Badge>
    </span>
  )
}

export function Alternativas({ q, grupos, abertas, onAlternar }: { q: Questao; grupos?: Aluno[][]; abertas?: number[]; onAlternar?: (i: number) => void }) {
  const erros = q.contagem.map((c, i) => (i === q.certa ? -1 : c))
  const distrator = erros.indexOf(Math.max(...erros))
  return (
    <ol className="rl-alts">
      {q.alts.map((t, i) => {
        const ok = i === q.certa
        const dis = i === distrator && q.contagem[i] > 0
        const p = pct(q.contagem[i], q.resp)
        const aberta = abertas?.includes(i)
        return (
          <li key={i} className={`${ok ? 'is-certa' : ''} ${dis ? 'is-distrator' : ''}`}>
            <div className="rl-alt">
              <span className="rl-alt__letra">{'ABCD'[i]}</span>
              <span className="rl-alt__txt">{t}</span>
              <span className="rl-alt__barra">
                <i style={{ width: `${p}%` }} />
              </span>
              <span className="rl-alt__num">
                <small>{plural(q.contagem[i], 'resposta', 'respostas')}</small> <b>{p}%</b>
              </span>
              <span className="rl-alt__tag">
                {ok ? (
                  <Badge tom="verde" icone={CircleCheck}>
                    Correta
                  </Badge>
                ) : dis ? (
                  <Badge tom="amarelo">Mais marcada entre os erros</Badge>
                ) : null}
              </span>
              {grupos && (
                <button className="rx-icone-btn" aria-expanded={aberta} aria-label={`${aberta ? 'Esconder' : 'Ver'} quem marcou ${'ABCD'[i]}`} onClick={() => onAlternar?.(i)} disabled={!q.contagem[i]}>
                  <span className={`rl-chev ${aberta ? 'is-on is-baixo' : 'is-baixo'}`}>›</span>
                </button>
              )}
            </div>
            {grupos && aberta && (
              <div className="rl-quem">
                {grupos[i].map((a) => (
                  <span key={a.id} className="rl-chip">
                    <i>
                      {a.nome
                        .split(' ')
                        .map((x) => x[0])
                        .slice(0, 2)
                        .join('')}
                    </i>
                    {a.nome}
                  </span>
                ))}
              </div>
            )}
          </li>
        )
      })}
    </ol>
  )
}

function CardQuestao({ q, onAbrir }: { q: Questao; onAbrir: () => void }) {
  const t = topicoPorId(q.topico)
  const ac = acertoQ(q)
  return (
    <article className="rl-questao">
      <header>
        <span>
          <small>Taxa de acerto</small>
          <b style={{ color: ac < 50 ? '#DC2626' : ac >= 75 ? '#16A34A' : undefined }}>{ac}%</b>
        </span>
        <span>
          <small>Respostas</small>
          <b>{q.resp}</b>
        </span>
        <span className="rx-espaco" />
        <span className="rl-disc" style={{ background: DISC_COR[t.disc][1], color: DISC_COR[t.disc][0] }}>
          <Ponto cor={DISC_COR[t.disc][0]} tam={8} /> {t.disc} · {t.nome}
        </span>
        <Badge>{t.bncc}</Badge>
        <Badge>ID {q.id}</Badge>
      </header>
      <small>Enunciado</small>
      <p>{q.enun}</p>
      <Alternativas q={q} />
      <button className="rx-link" onClick={onAbrir}>
        <ExternalLink size={14} /> Ver análise detalhada da questão
      </button>
    </article>
  )
}

/* ================================================================= Glossário */
export function Glossario() {
  return (
    <section className="rx-cartao rl-gloss">
      <header>
        <span className="rl-gloss__ico">
          <BookOpen size={24} />
        </span>
        <h2>Glossário</h2>
      </header>
      <hr className="rl-hr" />
      {GLOSSARIO.map(([t, d, novo]) => (
        <div key={t} className="rl-gloss__item">
          <h3>
            {t} {novo && <Badge tom="roxo">Novo no Modo Lição</Badge>}
          </h3>
          <p>{d}</p>
        </div>
      ))}
    </section>
  )
}

