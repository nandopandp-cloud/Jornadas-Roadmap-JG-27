// PDF do relatório da lição: mesmo visual do PDF de Tarefa (1920×1080, Inter, capa, sumário, divisórias teal).
// As páginas são montadas em HTML a partir das seções escolhidas no modal; "Salvar PDF" usa a impressão do navegador.
import { Download, X, ZoomIn, ZoomOut } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import {
  ACURACIA,
  ADEQUADO,
  ALUNOS,
  ATIVOS,
  AVALIADOS,
  DISC_COR,
  DISCIPLINAS_AGG,
  FORMATOS,
  GLOSSARIO,
  LICAO,
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
  topicoPorId,
  totalTopico,
  type Prof,
  type Situacao,
} from './data'

export type Secao = 'vg.acomp' | 'vg.disp' | 'eng.ind' | 'eng.prog' | 'eng.cons' | 'eng.rank' | 'apr.ind' | 'apr.rank' | 'apr.disc' | 'apr.quest' | 'glo.def'
export const GRUPOS: { id: string; t: string; itens: [Secao, string, boolean?][] }[] = [
  { id: 'vg', t: 'Visão Geral', itens: [['vg.acomp', 'Acompanhamento dos estudantes'], ['vg.disp', 'Desempenho x Engajamento e estudantes por quadrante']] },
  { id: 'eng', t: 'Engajamento', itens: [['eng.ind', 'Principais indicadores'], ['eng.prog', 'Progresso na lição'], ['eng.cons', 'Consumo dos objetos de aprendizagem', true], ['eng.rank', 'Ranking de tópicos']] },
  { id: 'apr', t: 'Aprendizagem', itens: [['apr.ind', 'Principais indicadores e rubricas de proficiência'], ['apr.rank', 'Ranking de estudantes'], ['apr.disc', 'Aprendizagem por disciplina e tópico', true], ['apr.quest', 'Questões da lição e respostas']] },
  { id: 'glo', t: 'Glossário', itens: [['glo.def', 'Definições dos indicadores']] },
]
export const TODAS: Secao[] = GRUPOS.flatMap((g) => g.itens.map((i) => i[0]))

const fatia = <T,>(l: T[], n: number) => Array.from({ length: Math.ceil(l.length / n) }, (_, i) => l.slice(i * n, i * n + n))

/* ---------------------------------------------------------------- peças das páginas */
function Logo({ h }: { h: number }) {
  return <img className="pdf-logo" src="./rl/logo-jg.png" alt="Jovens Gênios" style={{ height: h }} />
}
function Rodape({ n, branco }: { n: number; branco?: boolean }) {
  return (
    <footer className={`pdf-rod ${branco ? 'is-branco' : ''}`}>
      <b>{LICAO.rodapePdf}</b>
      <span>{String(n).padStart(2, '0')}</span>
    </footer>
  )
}
function Pagina({ n, secao, titulo, children }: { n: number; secao: string; titulo?: string; children: ReactNode }) {
  return (
    <section className="pdf-pag">
      <header className="pdf-cab">
        <Logo h={78} />
        <b>{secao}</b>
      </header>
      {titulo && <h2 className="pdf-tit">{titulo}</h2>}
      <div className="pdf-corpo">{children}</div>
      <Rodape n={n} />
    </section>
  )
}
function Divisoria({ n, titulo }: { n: number; titulo: string }) {
  return (
    <section className="pdf-pag is-div">
      <i className="pdf-deco a" />
      <i className="pdf-deco b" />
      <i className="pdf-deco c" />
      <i className="pdf-deco v" />
      <span className="pdf-div__logo">
        <Logo h={112} />
      </span>
      <h2>{titulo}</h2>
      <Rodape n={n} branco />
    </section>
  )
}
function Tab({ cols, linhas, compacto }: { cols: { t: string; w?: number; al?: 'c' }[]; linhas: ReactNode[][]; compacto?: boolean }) {
  return (
    <table className={`pdf-tab ${compacto ? 'is-compacto' : ''}`}>
      <thead>
        <tr>
          {cols.map((c) => (
            <th key={c.t} style={{ width: c.w }} className={c.al ? 'is-c' : ''}>
              {c.t}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {linhas.map((l, i) => (
          <tr key={i}>
            {l.map((v, j) => (
              <td key={j} className={cols[j].al ? 'is-c' : ''}>
                {v}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
const Pill = ({ p }: { p: Prof }) => (
  <span className="pdf-pill" style={{ color: PROF_TXT[p], borderColor: PROF_COR[p], background: PROF_COR[p] + '29' }}>
    <i style={{ background: PROF_COR[p] }} />
    {p}
  </span>
)
function Indicadores({ n, secao, cards }: { n: number; secao: string; cards: [string, string, string][] }) {
  return (
    <Pagina n={n} secao={secao}>
      <div className="pdf-ind">
        <div>
          <h3>Principais Indicadores</h3>
          <p>Resumo</p>
        </div>
        <div className="pdf-ind__grade">
          {cards.map(([a, b, c], i) => (
            <div key={i} className="pdf-card">
              {c === '' ? (
                <>
                  <b>{a}</b>
                  <strong>{b}</strong>
                </>
              ) : (
                <>
                  <strong>{a}</strong>
                  <b>{b}</b>
                  <small>{c}</small>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </Pagina>
  )
}

/* ---------------------------------------------------------------- montagem */
export function montarPaginas(sel: Secao[]): { id: string; el: (n: number) => ReactNode; sum?: [string, string] }[] {
  const tem = (s: Secao) => sel.includes(s)
  const P: { id: string; el: (n: number) => ReactNode; sum?: [string, string] }[] = []
  const add = (id: string, el: (n: number) => ReactNode, sum?: [string, string]) => P.push({ id, el, sum })
  const fin = SITS['Finalizado'] ?? 0
  // Visão Geral
  if (tem('vg.acomp') || tem('vg.disp')) {
    add('div-vg', (n) => <Divisoria n={n} titulo="Visão Geral" />)
    if (tem('vg.acomp')) {
      const ord = [...ALUNOS].sort((a, b) => a.nome.localeCompare(b.nome))
      const pags = fatia(ord, 10)
      pags.forEach((l, i) =>
        add(`acomp-${i}`, (n) => (
          <Pagina n={n} secao="Visão Geral" titulo={`Acompanhamento dos Estudantes (${i + 1} de ${pags.length})`}>
            <Tab cols={[{ t: 'Estudante' }, { t: 'Situação', w: 240 }, { t: 'Completude', w: 190, al: 'c' }, { t: 'Interações', w: 160, al: 'c' }, { t: 'Desempenho', w: 180, al: 'c' }, { t: 'Proficiência', w: 230 }, { t: 'Tempo', w: 160, al: 'c' }]} linhas={l.map((a) => [a.nome.toUpperCase(), a.sit, a.comp + '%', a.inter, a.des == null ? '—' : a.des + '%', a.des == null ? 'Não avaliado' : <Pill p={a.prof} />, fmtT(a.tempo)])} />
          </Pagina>
        ), i === 0 ? ['Visão Geral', 'Acompanhamento dos Estudantes'] : undefined),
      )
    }
    if (tem('vg.disp')) {
      add('disp', (n) => (
        <Pagina n={n} secao="Visão Geral">
          <DispersaoPdf />
        </Pagina>
      ), ['Visão Geral', 'Desempenho x Engajamento'])
      add('quads', (n) => (
        <Pagina n={n} secao="Visão Geral" titulo="Estudantes por Quadrante">
          <div className="pdf-quads">
            {QUADRANTES.map((q) => (
              <div key={q} className="pdf-quad">
                <header style={{ background: QCOR[q][1], color: QCOR[q][0] }}>
                  <strong>{QUADS[q] ?? 0}</strong>
                  <b>{q}</b>
                </header>
                <ul>
                  {ALUNOS.filter((a) => a.quad === q)
                    .sort((a, b) => (b.des ?? 0) - (a.des ?? 0))
                    .map((a) => (
                      <li key={a.id}>
                        <span>{a.nome.toUpperCase()}</span>
                        <small>
                          {a.des}% · {a.inter} int.
                        </small>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="pdf-nota">
            Não avaliados ({NAO_AVALIADOS.length}): {NAO_AVALIADOS.map((a) => a.nome.toUpperCase()).join(', ')}. Eles não iniciaram a lição.
          </p>
        </Pagina>
      ), ['Visão Geral', 'Estudantes por Quadrante'])
    }
  }
  // Engajamento
  if (['eng.ind', 'eng.prog', 'eng.cons', 'eng.rank'].some((s) => tem(s as Secao))) {
    add('div-eng', (n) => <Divisoria n={n} titulo="Engajamento" />)
    if (tem('eng.ind'))
      add('eng-ind', (n) => (
        <Indicadores n={n} secao="Engajamento" cards={[[`${pct(fin, N)}%`, 'Estudantes finalizaram', `Meta: ${META.finalizaram}%`], ['Meta de finalização atingida', `${Math.round((pct(fin, N) / META.finalizaram) * 100)}%`, ''], [`${pct(ATIVOS, N)}%`, 'Estudantes ativos', `Meta: ${META.ativos}%`], [String(Math.round(MEDIA_INTER)), 'Interações médias', `Meta: ${META.interacoes}`]]} />
      ), ['Engajamento', 'Principais Indicadores'])
    if (tem('eng.prog'))
      add('eng-prog', (n) => (
        <Pagina n={n} secao="Engajamento">
          <div className="pdf-quadro">
            <h3>Progresso na Lição</h3>
            <div className="pdf-barras">
              {(['Não iniciado', 'Em progresso', 'Finalizado'] as Situacao[]).map((s) => (
                <div key={s}>
                  <span>{s}</span>
                  <span className="pdf-barras__trilho">
                    <i style={{ width: `${((SITS[s] ?? 0) / 35) * 100}%`, background: SIT_COR[s] === '#16A34A' ? '#00AE34' : SIT_COR[s] }} />
                    <b>
                      {SITS[s] ?? 0} estudantes ({pct(SITS[s] ?? 0, N)}%)
                    </b>
                  </span>
                </div>
              ))}
              <div className="pdf-barras__eixo">
                <span />
                <span>
                  {[0, 5, 10, 15, 20, 25, 30, 35].map((v) => (
                    <small key={v} style={{ left: `${(v / 35) * 100}%` }}>
                      {v}
                    </small>
                  ))}
                </span>
              </div>
            </div>
            <p className="pdf-eixo">Número de estudantes</p>
          </div>
        </Pagina>
      ), ['Engajamento', 'Progresso na Lição'])
    if (tem('eng.cons'))
      add('eng-cons', (n) => (
        <Pagina n={n} secao="Engajamento">
          <div className="pdf-quadro">
            <h3>Consumo dos Objetos de Aprendizagem</h3>
            <p className="pdf-sub">{TOTAL_INTER} interações no total, distribuídas entre os formatos da lição</p>
            <div className="pdf-100">
              {FORMATOS.map((f) => (
                <i key={f.f} style={{ width: `${(f.inter / TOTAL_INTER) * 100}%`, background: f.cor }}>
                  {f.inter / TOTAL_INTER > 0.1 && `${f.plural} · ${pct(f.inter, TOTAL_INTER)}%`}
                </i>
              ))}
            </div>
            <div className="pdf-fmts">
              {FORMATOS.map((f) => (
                <div key={f.f} style={{ background: f.fundo, borderColor: f.cor }}>
                  <b style={{ color: f.cor }}>{f.plural}</b>
                  <small>{f.naLicao.replace(/^\d+ \S+ /, (m) => m.split(' ')[0] + ' ')}</small>
                  <strong style={{ color: f.cor }}>{String(Math.round((f.inter / TOTAL_INTER) * 1000) / 10).replace('.', ',')}%</strong>
                  <em>{f.inter} interações</em>
                  <small>
                    Alcance: {f.alcance} de {ATIVOS} ativos ({pct(f.alcance, ATIVOS)}%)
                  </small>
                </div>
              ))}
            </div>
            <p className="pdf-nota is-c">Cada questão respondida no quiz conta como 1 interação. Entre os materiais de estudo, os resumos foram os mais consumidos.</p>
          </div>
        </Pagina>
      ), ['Engajamento', 'Consumo dos Objetos de Aprendizagem'])
    if (tem('eng.rank')) {
      const l = [...TOPICOS].sort((a, b) => totalTopico(b) - totalTopico(a))
      add('eng-rank', (n) => (
        <Pagina n={n} secao="Engajamento" titulo="Ranking de Tópicos">
          <Tab cols={[{ t: 'Posição', w: 110, al: 'c' }, { t: 'Tópico' }, { t: 'Disciplina', w: 220 }, { t: 'Resumo', w: 120, al: 'c' }, { t: 'Vídeo', w: 110, al: 'c' }, { t: 'Áudio', w: 110, al: 'c' }, { t: 'Quiz', w: 110, al: 'c' }, { t: 'Total de interações', w: 240, al: 'c' }]} linhas={l.map((t, i) => [i + 1, t.nome, <span className="pdf-disc"><i style={{ background: DISC_COR[t.disc][0] }} />{t.disc}</span>, t.interacoes.Resumo ?? '—', t.interacoes.Vídeo ?? '—', t.interacoes.Áudio ?? '—', t.interacoes.Quiz ?? '—', <b>{totalTopico(t)}</b>])} />
          <p className="pdf-nota">“—” = formato não usado no tópico. O quiz é obrigatório em todos os tópicos.</p>
        </Pagina>
      ), ['Engajamento', 'Ranking de Tópicos'])
    }
  }
  // Aprendizagem
  if (['apr.ind', 'apr.rank', 'apr.disc', 'apr.quest'].some((s) => tem(s as Secao))) {
    add('div-apr', (n) => <Divisoria n={n} titulo="Aprendizagem" />)
    if (tem('apr.ind')) {
      const adq = pct(ADEQUADO[0], ADEQUADO[1])
      add('apr-ind', (n) => <Indicadores n={n} secao="Aprendizagem" cards={[[`${ACURACIA}%`, 'Taxa de acerto', `Meta: ${META.acuracia}%`], ['Meta de acerto atingida', `${Math.round((ACURACIA / META.acuracia) * 100)}%`, ''], [`${adq}%`, 'Aprendizado adequado', `Meta: ${META.adequado}%`], ['Meta de proficiência atingida', `${Math.round((adq / META.adequado) * 100)}%`, '']]} />, ['Aprendizagem', 'Principais Indicadores'])
      add('apr-rub', (n) => (
        <Pagina n={n} secao="Aprendizagem">
          <div className="pdf-quadro">
            <h3>Rubricas de Proficiência</h3>
            <p className="pdf-sub">Meta: proficiente + avançado = {META.adequado}%</p>
            <div className="pdf-rub">
              {PROFS_ORD.map((p) => (
                <i key={p} style={{ width: `${((PROFS[p] ?? 0) / N) * 100}%`, background: PROF_COR[p] }} />
              ))}
              <em style={{ left: `${META.adequado}%` }} />
            </div>
            <div className="pdf-escala">
              {Array.from({ length: 11 }, (_, i) => (
                <small key={i} style={{ left: `${i * 10}%` }}>
                  {i * 10}
                </small>
              ))}
            </div>
            <div className="pdf-rub-tab">
              <Tab cols={[{ t: 'Rubrica' }, { t: '% por rubrica', w: 220, al: 'c' }, { t: 'Estudantes', w: 200, al: 'c' }]} linhas={PROFS_ORD.map((p) => [<span className="pdf-disc"><i style={{ background: PROF_COR[p], borderRadius: 3 }} /><b>{p}</b></span>, pct(PROFS[p] ?? 0, N) + '%', PROFS[p] ?? 0])} />
            </div>
          </div>
        </Pagina>
      ), ['Aprendizagem', 'Rubricas de Proficiência'])
    }
    if (tem('apr.rank')) {
      const l = [...AVALIADOS, ...NAO_AVALIADOS]
      const pags = fatia(l, 10)
      pags.forEach((g, i) =>
        add(`rank-${i}`, (n) => (
          <Pagina n={n} secao="Aprendizagem" titulo={`Ranking de Estudantes (${i + 1} de ${pags.length})`}>
            <Tab cols={[{ t: 'Posição', w: 160, al: 'c' }, { t: 'Nome' }, { t: 'Desempenho', w: 260, al: 'c' }, { t: 'Proficiência', w: 300 }]} linhas={g.map((a) => [a.des == null ? '—' : AVALIADOS.indexOf(a) + 1, a.nome.toUpperCase(), a.des == null ? '—' : a.des + '%', <Pill p={a.prof} />])} />
          </Pagina>
        ), i === 0 ? ['Aprendizagem', 'Ranking de Estudantes'] : undefined),
      )
    }
    if (tem('apr.disc'))
      add('apr-disc', (n) => (
        <Pagina n={n} secao="Aprendizagem" titulo="Aprendizagem por Disciplina e Tópico">
          <Tab
            compacto
            cols={[{ t: 'Disciplina / Tópico' }, { t: 'Questões', w: 120, al: 'c' }, { t: 'Respostas', w: 130, al: 'c' }, { t: 'Acerto', w: 110, al: 'c' }, { t: 'Avanç.', w: 90, al: 'c' }, { t: 'Profic.', w: 90, al: 'c' }, { t: 'Básico', w: 90, al: 'c' }, { t: 'Insuf.', w: 90, al: 'c' }, { t: 'N. aval.', w: 100, al: 'c' }, { t: 'Aprend. adequado', w: 220, al: 'c' }]}
            linhas={DISCIPLINAS_AGG.flatMap((d) => [
              [<span className="pdf-disc"><i style={{ background: DISC_COR[d.disc][0] }} /><b>{d.disc.toUpperCase()}</b></span>, d.questoes, d.respostas, d.acerto + '%', ...d.dist, `${d.adequado[0]} de ${d.adequado[1]} (${pct(d.adequado[0], d.adequado[1])}%)`],
              ...TOPICOS.filter((t) => t.disc === d.disc).map((t) => [<span className="pdf-recuo">{t.nome}{t.acerto < 50 && <b className="pdf-alerta"> !</b>}</span>, t.questoes, t.respostas, t.acerto + '%', ...t.dist, `${t.adequado[0]} de ${t.adequado[1]} (${pct(t.adequado[0], t.adequado[1])}%)`]),
            ])}
          />
          <p className="pdf-nota">Distribuição de proficiência = número de estudantes em cada nível no tópico. ! = precisa de atenção (acerto abaixo de 50%).</p>
        </Pagina>
      ), ['Aprendizagem', 'Aprendizagem por Disciplina e Tópico'])
    if (tem('apr.quest')) {
      const pags = fatia(QUESTOES, 6)
      pags.forEach((g, i) =>
        add(`quest-${i}`, (n) => (
          <Pagina n={n} secao="Aprendizagem" titulo={`Questões da Lição (${i + 1} de ${pags.length})`}>
            <Tab
              cols={[{ t: 'Nº', w: 60, al: 'c' }, { t: 'Enunciado' }, { t: 'Tópico', w: 330 }, { t: 'Respostas', w: 130, al: 'c' }, { t: 'Acerto', w: 110, al: 'c' }, { t: 'A', w: 100, al: 'c' }, { t: 'B', w: 100, al: 'c' }, { t: 'C', w: 90, al: 'c' }, { t: 'D', w: 90, al: 'c' }]}
              compacto
              linhas={g.map((q, k) => [i * 6 + k + 1, q.enun, topicoPorId(q.topico).nome, q.resp, acertoQ(q) + '%', ...q.contagem.map((c, j) => (j === q.certa ? <b className="pdf-certa">✓ {pct(c, q.resp)}%</b> : pct(c, q.resp) + '%'))])}
            />
            <p className="pdf-nota">Só as questões que os estudantes receberam (sorteio por estudante). A–D = % de respostas em cada alternativa; ✓ = alternativa correta.</p>
          </Pagina>
        ), i === 0 ? ['Aprendizagem', 'Questões da Lição'] : undefined),
      )
    }
  }
  if (tem('glo.def')) {
    add('div-glo', (n) => <Divisoria n={n} titulo="Glossário" />)
    add('glo', (n) => (
      <Pagina n={n} secao="Glossário" titulo="Glossário">
        <div className="pdf-gloss">
          {GLOSSARIO.map(([t, d]) => (
            <div key={t}>
              <b>{t}</b>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </Pagina>
    ), ['Glossário', 'Definições dos Indicadores'])
  }
  // capa e sumário no começo
  const sumario = P.filter((p) => p.sum).map((p) => p.sum!)
  const grupos = [...new Set(sumario.map((s) => s[0]))]
  P.unshift({
    id: 'sum',
    el: () => (
      <section className="pdf-pag is-sum">
        <h1>Sumário</h1>
        <div className="pdf-sum">
          {grupos.map((g) => (
            <div key={g}>
              <b>{g}</b>
              {sumario
                .filter((s) => s[0] === g)
                .map((s) => (
                  <span key={s[1]}>{s[1]}</span>
                ))}
            </div>
          ))}
        </div>
      </section>
    ),
  })
  P.unshift({
    id: 'capa',
    el: () => (
      <section className="pdf-pag is-capa">
        <Logo h={120} />
        <div className="pdf-capa__dir">
          <span>{LICAO.periodoCurto}</span>
          <small>Gerado em {LICAO.geradoEm}</small>
        </div>
        <div className="pdf-capa__tit">
          <h1>Relatório da Lição</h1>
          <p>{LICAO.nome}</p>
          <small>
            {LICAO.disciplinas.join(' · ')} &nbsp;|&nbsp; {N} estudantes &nbsp;|&nbsp; {LICAO.status}
          </small>
        </div>
        <b className="pdf-capa__esc">{LICAO.rodapePdf}</b>
      </section>
    ),
  })
  return P
}

function DispersaoPdf() {
  const W = 1720, H = 600, L = 300, R = 1560, T = 110, B = 490
  const X = (v: number) => L + ((R - L) * v) / 25
  const Y = (v: number) => B - ((B - T) * v) / 100
  const vistos: Record<string, number> = {}
  return (
    <div className="pdf-quadro is-livre">
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
        <text x={W / 2} y={70} textAnchor="middle" className="pdf-svg-tit">
          Desempenho x Engajamento
        </text>
        {[0, 20, 40, 60, 80, 100].map((v) => (
          <g key={v}>
            <line x1={L} x2={R} y1={Y(v)} y2={Y(v)} stroke="#F0F0F0" strokeWidth={1.5} />
            <text x={L - 20} y={Y(v) + 8} textAnchor="end" className="pdf-svg-eixo">
              {v}%
            </text>
          </g>
        ))}
        {[0, 5, 10, 15, 20, 25].map((v) => (
          <text key={v} x={X(v)} y={B + 36} textAnchor="middle" className="pdf-svg-eixo">
            {v}
          </text>
        ))}
        <line x1={L} x2={L} y1={T - 10} y2={B} stroke="#9A9A9A" strokeWidth={1.5} />
        <line x1={L} x2={R} y1={B} y2={B} stroke="#9A9A9A" strokeWidth={1.5} />
        <text x={(L + R) / 2} y={B + 76} textAnchor="middle" className="pdf-svg-txt">
          Interações de aprendizagem realizadas
        </text>
        <text transform={`translate(170 ${(T + B) / 2}) rotate(-90)`} textAnchor="middle" className="pdf-svg-txt">
          Desempenho nos quizzes (%)
        </text>
        <line x1={L} x2={R} y1={Y(META.desempenho)} y2={Y(META.desempenho)} stroke="#3BBFBD" strokeWidth={2} strokeDasharray="8 6" />
        <line x1={X(MEDIA_INTER)} x2={X(MEDIA_INTER)} y1={T - 10} y2={B} stroke="#3BBFBD" strokeWidth={2} strokeDasharray="8 6" />
        <text x={R + 10} y={Y(META.desempenho) + 7} className="pdf-svg-teal">
          Meta: {META.desempenho}%
        </text>
        <text x={X(MEDIA_INTER) + 10} y={T - 2} className="pdf-svg-teal">
          Média: {Math.round(MEDIA_INTER)} interações
        </text>
        {AVALIADOS.map((a) => {
          const k = `${a.inter}|${a.des}`
          const n = (vistos[k] = (vistos[k] ?? 0) + 1)
          return <circle key={a.id} cx={X(a.inter) + (n - 1) * 9} cy={Y(a.des!)} r={10} fill={QCOR[a.quad][0]} stroke="#fff" strokeWidth={2} />
        })}
      </svg>
      <div className="pdf-leg">
        {['Baixo desempenho / Baixo engajamento', 'Alto desempenho / Baixo engajamento', 'Baixo desempenho / Alto engajamento', 'Alto desempenho / Alto engajamento'].map((q) => (
          <span key={q}>
            <i style={{ background: QCOR[q as keyof typeof QCOR][0] }} />
            {q} ({QUADS[q as keyof typeof QUADS] ?? 0})
          </span>
        ))}
      </div>
      <p className="pdf-nota is-c">{NAO_AVALIADOS.length} estudantes não avaliados (não iniciaram a lição) ficam fora do gráfico.</p>
    </div>
  )
}

/* ---------------------------------------------------------------- visualizador */
export function VisualizadorPdf({ sel, onFechar }: { sel: Secao[]; onFechar: () => void }) {
  const paginas = montarPaginas(sel)
  const [zoom, setZoom] = useState(1)
  const area = useRef<HTMLDivElement>(null)
  const [base, setBase] = useState(0.5)
  useLayoutEffect(() => {
    const on = () => setBase(Math.min(1, ((area.current?.clientWidth ?? 1000) - 48) / 1920))
    on()
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  useEffect(() => {
    const on = (e: KeyboardEvent) => e.key === 'Escape' && onFechar()
    window.addEventListener('keydown', on)
    document.body.classList.add('rl-imprimindo')
    return () => {
      window.removeEventListener('keydown', on)
      document.body.classList.remove('rl-imprimindo')
    }
  }, [onFechar])
  const s = base * zoom
  return (
    <div className="pdf-viewer" role="dialog" aria-modal="true" aria-label="Prévia do PDF">
      <header className="pdf-viewer__barra">
        <div>
          <b>relatorio-licao-conhecendo-as-piramides.pdf</b>
          <small>
            {paginas.length} páginas · gerado em {LICAO.geradoEm}
          </small>
        </div>
        <span className="pdf-viewer__zoom">
          <button aria-label="Diminuir zoom" onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}>
            <ZoomOut size={18} />
          </button>
          <small>{Math.round(s * 100)}%</small>
          <button aria-label="Aumentar zoom" onClick={() => setZoom((z) => Math.min(2.5, z + 0.25))}>
            <ZoomIn size={18} />
          </button>
        </span>
        <button className="rx-btn is-primario" onClick={() => window.print()}>
          <Download size={16} /> Salvar PDF
        </button>
        <button className="pdf-viewer__x" onClick={onFechar} aria-label="Fechar prévia">
          <X size={20} />
        </button>
      </header>
      <div className="pdf-viewer__area" ref={area}>
        <div className="pdf-paginas" style={{ ['--s' as string]: s }}>
          {paginas.map((p, i) => (
            <div key={p.id} className="pdf-moldura" style={{ width: 1920 * s, height: 1080 * s }} data-pagina={i + 1}>
              <div className="pdf-escalar">{p.el(i + 1)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
