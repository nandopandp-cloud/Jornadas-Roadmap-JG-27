// Novos Relatórios · Plataforma Educadores
// Dados de exemplo IDÊNTICOS aos da página 05 · Desktop do Figma (A5hHDrpWbICZ1JfKpUiS2k).
// Portados dos módulos do kit 'nrel' (dados, v3, v4, v5a–v5f): mesma estrutura de blocos e tabelas.
/* eslint-disable @typescript-eslint/no-explicit-any */

export type Tom = 'suc' | 'at' | 'cr' | 'av' | 'inf' | 'neutro' | 'p1' | 'g1' | 'g2' | 'g4' | 'muted' | 'n300' | 'n400' | 'linha'
export type Cel = string | number | { [k: string]: any }
export type Col = { t: string; w?: number; al?: 'CENTER'; sort?: boolean }
export type Tabela = { titulo: string; busca?: string; desc?: string; pag?: [string, number]; leg?: [Tom, string][]; cols: Col[]; rows: Cel[][] }
export type Bloco = { t: string; w?: number; titulo?: string; desc?: string; [k: string]: any }
export type Kpi = [string, string, string | null, number | null, string[]]
export type Item =
  | ['kpis', Kpi[]]
  | ['sec', [string, string?]]
  | ['row', Bloco[]]
  | ['tab', Tabela]
  | ['seg', [string[], string, string[]?]]
  | ['podio', [number, string, string, string, number][]]
  | ['avisoRanking', null]
export type Sel = [string, string, string, number?, boolean?, boolean?] // rótulo, valor, ícone, largura, placeholder, travado
export type Rel = {
  id: string
  grupo: 'inst' | 'ativ'
  tipo: string
  perfil: Perfil
  mig: string[]
  cab: { titulo: string; acesso?: string; sel: Sel[] }
  ent: [string, string, string, string, [string, Tom][]?]
  abas?: string[]
  T: Record<string, Item[]>
}
export type Perfil = 'gestora' | 'coord' | 'prof'

/* ------------------------------------------------------------------ pessoas e regras */
export const PERFIS: Record<Perfil, { nome: string; ini: string; papel: string; papelLongo: string; email: string; acesso?: string; onde: [string, string] }> = {
  gestora: { nome: 'Mariana Lopes', ini: 'ML', papel: 'Gestora de rede', papelLongo: 'Gestora de rede', email: 'mariana.lopes@novaesperanca.edu.br', onde: ['Rede inteira', 'Rede Municipal de Nova Esperança'] },
  coord: { nome: 'Carla Nogueira', ini: 'CN', papel: 'Coordenadora', papelLongo: 'Coordenadora pedagógica', email: 'carla.nogueira@novaesperanca.edu.br', acesso: 'Seu acesso: EM Jardim das Flores', onde: ['Escola', 'EM Jardim das Flores'] },
  prof: { nome: 'Rafael Souza', ini: 'RS', papel: 'Professor', papelLongo: 'Professor de Matemática', email: 'rafael.souza@novaesperanca.edu.br', acesso: 'Seu acesso: suas turmas', onde: ['Turmas', 'Minhas turmas (701, 702 e 801)'] },
}
export const PERIODO = '01/02/2026 – 26/11/2026'
export const MESES = ['Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov']
export const SEM = ['06/10', '13/10', '20/10', '27/10', '03/11', '10/11', '17/11', '24/11']
export const META_PONTOS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
export const fmt = (n: number | string) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
/** Rubricas da Educadores: Insuficiente < 30% ≤ Básico < 60% ≤ Proficiente < 85% ≤ Avançado. */
export const faixa = (d: number) => (d >= 85 ? 'Avançado' : d >= 60 ? 'Proficiente' : d >= 30 ? 'Básico' : 'Insuficiente')
export const TOM_RUB: Record<string, Tom> = { Avançado: 'av', Proficiente: 'suc', Básico: 'at', Insuficiente: 'cr', 'Não avaliado': 'n400' }
export const RUB5: [Tom, string][] = [['av', 'Avançado'], ['suc', 'Proficiente'], ['at', 'Básico'], ['cr', 'Insuficiente'], ['n400', 'Não avaliado']]
export const QB: [Tom, string, string, string][] = [
  ['suc', 'Referência Positiva', 'Alta ativação + alto desempenho', 'Manter, reconhecer e replicar boas práticas.'],
  ['at', 'Necessita Apoio Pedagógico', 'Alta ativação + baixo desempenho', 'Fazer intervenção pedagógica por habilidade ou tema.'],
  ['av', 'Potencial a Ativar', 'Baixa ativação + alto desempenho', 'Aumentar adesão e remover barreiras de acesso.'],
  ['cr', 'Prioridade de Intervenção', 'Baixa ativação + baixo desempenho', 'Plano de ação prioritário: ativação e reforço pedagógico.'],
]
const META = (v: number) => MESES.map(() => v)
const RUBD = (d: number[]): [string, number, number][] => [['Avançado', d[0], d[1]], ['Proficiente', d[2], d[3]], ['Básico', d[4], d[5]], ['Insuficiente', d[6], d[7]], ['Não avaliado', d[8], d[9]]]
const R4 = (d: number[]): [string, number, number][] => [['Avançado', d[0], d[1]], ['Proficiente', d[2], d[3]], ['Básico', d[4], d[5]], ['Insuficiente', d[6], d[7]]]
const pilhas = (titulo: string, linhas: [string, number[]][], desc?: string): Bloco => ({ t: 'pilhas', titulo, desc, linhas })
const listaQuad = (cont: string[]): Bloco => ({ t: 'lista', w: 400, titulo: 'Como ler os quadrantes', itens: QB.map(([tom, t, d, a], i) => [t, d + ' · ' + a, { b: cont[i], t: tom }]) })
const quadB = (titulo: string, pts: { x: number; y: number; nome: string }[], mx: number, my: number, rotX: string, rot: string[], cont: string[]): Item => ['row', [{ t: 'quad', titulo, pts, mx, my, rotX, rot }, listaQuad(cont)]]
const topicos = (titulo: string, rows: [string, string, string, number, number][], pag?: [string, number]): Item => [
  'tab',
  {
    titulo,
    busca: 'Pesquisar tópico...',
    pag,
    leg: RUB5,
    cols: [{ t: 'Tópico', sort: true }, { t: 'Disciplina', w: 170 }, { t: 'Tempo de estudo', w: 140, al: 'CENTER' }, { t: 'Nº de respostas', w: 140, al: 'CENTER', sort: true }, { t: 'Nº de acertos', w: 128, al: 'CENTER' }, { t: 'Desempenho', w: 120, al: 'CENTER', sort: true }, { t: 'Proficiência', w: 150 }],
    rows: rows.map(([t, d, tm, r, a]) => {
      const p = Math.round((a * 100) / r)
      return [t, d, tm, fmt(r), fmt(a), { F: p }, { p: faixa(p) }]
    }),
  },
]
const evol = (serie: number[]): Bloco => ({ t: 'L', w: 400, titulo: 'Evolução da aprendizagem', max: 11, leg: [['p1', 'Acumulada'], ['muted', 'Meta acumulada', true]], series: [['Acumulada', serie, 'p1'], ['Meta', META_PONTOS, 'muted', true]] })
const desTempo = (serie: number[]): Bloco => ({ t: 'L', titulo: 'Desempenho médio ao longo do tempo', max: 100, pct: true, leg: [['p1', 'Desempenho médio (%)'], ['muted', 'Proficiente (60%)', true]], series: [['Desempenho', serie, 'p1'], ['Meta', META(60), 'muted', true]] })
const ativTempo = (titulo: string, leg: any[], series: any[]): Bloco => ({ t: 'L', titulo, max: 100, pct: true, leg: leg.concat([['muted', 'Meta de 50%', true]]), series: series.concat([['Meta', META(50), 'muted', true]]) })
const progresso = (f: number, e: number, n: number, tot: number, rotE = 'Em progresso', sub = 'Número de estudantes em cada etapa.'): Bloco => ({
  t: 'status',
  titulo: 'Progresso na atividade',
  sub,
  partes: [['suc', 'Finalizaram', Math.round((f * 100) / tot), f], ['at', rotE, Math.round((e * 100) / tot), e], ['n300', 'Não iniciaram', Math.round((n * 100) / tot), n]],
})
const PER: Sel = ['Período', PERIODO, 'calendar', 260]
const instCab = (sel: Sel[], acesso?: string) => ({ titulo: 'Relatórios institucionais', acesso, sel: sel.concat([PER]) })
const ativCab = (tipo: string, ic: string, ativ: string, ondeRot: string, onde: string, acesso?: string) => ({ titulo: 'Relatórios de atividades', acesso, sel: [['Tipo de atividade', tipo, ic, 220], ['Atividade', ativ, ic, 300], [ondeRot, onde, 'map-pin', 280]] as Sel[] })
const stTom = (s: string): Tom => (/Finaliz|Avaliado|Enviad|Corrigid/.test(s) && !/Não avaliado/.test(s) ? 'suc' : /progresso|Não avaliado|correção/.test(s) ? 'inf' : 'neutro')

/* ------------------------------------------------------------------ escolas da rede */
// nome, unidade (não exibida), estudantes, % ativos, interações por ativo, % adequado, professores ativos
export const ESC: [string, string, number, number, number, number, string][] = [
  ['EM Ana Néri', 'Norte', 210, 66, 51, 60, '11 de 14'],
  ['EM Anita Garibaldi', 'Leste', 230, 68, 52, 59, '12 de 15'],
  ['EM Carlos Drummond', 'Centro', 200, 55, 44, 52, '8 de 12'],
  ['EM Castro Alves', 'Leste', 250, 78, 62, 63, '14 de 16'],
  ['EM Cecília Meireles', 'Leste', 240, 67, 50, 56, '11 de 13'],
  ['EM Dom Pedro II', 'Centro', 220, 61, 47, 54, '9 de 12'],
  ['EM Jardim das Flores', 'Sul', 230, 41, 31, 39, '9 de 14'],
  ['EM Machado de Assis', 'Leste', 220, 62, 48, 57, '10 de 13'],
  ['EM Monteiro Lobato', 'Norte', 230, 74, 59, 61, '13 de 15'],
  ['EM Paulo Freire', 'Leste', 210, 52, 40, 49, '8 de 12'],
]
export const ESCOLAS_TODAS = ESC.map((e) => e[0]).concat(['EM Tiradentes', 'EM Rui Barbosa', 'EM Vila Nova', 'EM São Pedro', 'EM Recanto Verde', 'EM Rio Branco', 'EM Santos Dumont', 'EM Vinícius de Moraes'])
const OUT: [string, number, number][] = [['EM Tiradentes', 70, 63], ['EM Rui Barbosa', 72, 61], ['EM Vila Nova', 58, 55], ['EM São Pedro', 63, 57], ['EM Recanto Verde', 59, 53], ['EM Rio Branco', 64, 60], ['EM Santos Dumont', 48, 52], ['EM Vinícius de Moraes', 57, 59]]
export const TURMAS_ESCOLA = ['501', '502', '601', '701', '702', '801', '802', '901', '902']
export const PROFESSORES = ['Rafael Souza', 'Fernanda Lima', 'Otávio Mendes', 'Renato Alves', 'Bianca Torres', 'Paula Andrade']

/* ------------------------------------------------------------------ 2 · Rede (gestora) */
const desc10 = (a: any[], i: number) => a.slice().sort((x, y) => y[i] - x[i])
const rede: Rel = {
  id: 'rede',
  grupo: 'inst',
  tipo: 'Rede',
  perfil: 'gestora',
  mig: ['Início', 'Relatórios', 'Institucionais', 'Rede', 'Nova Esperança'],
  cab: instCab([['Tipo de relatório', 'Rede', 'house', 220], ['Rede', 'Rede Municipal de Nova Esperança', 'house', 320]]),
  ent: ['Rede Municipal de Nova Esperança', 'Rede', 'house', '18 escolas · 142 turmas · 3.860 estudantes · 214 professores'],
  T: {
    'Visão geral': [
      ['kpis', [['Estudantes ativos', '62%', '50%', 124, ['2.393 de 3.860 estudantes']], ['Professores ativos', '71%', '50%', 142, ['152 de 214 professores']], ['Desempenho médio', '57%', null, null, ['Ponderado pelas interações de aprendizagem']], ['Interações de estudantes', '118.400', null, null, ['10.100 interações de professores']]]],
      ['sec', ['Desempenho × engajamento', 'Cada ponto é uma escola. Mostra onde agir primeiro: ativação, reforço pedagógico ou os dois.']],
      quadB('Mapa de ativação × desempenho', ESC.map(([n, , , a, , ad]) => ({ x: a, y: ad + 5, nome: n })).concat(OUT.map(([n, x, y]) => ({ x, y, nome: n }))), 62, 60, 'Engajamento (% de estudantes ativos)', ['EM Castro Alves', 'EM Jardim das Flores'], ['5 escolas', '4 escolas', '1 escola', '8 escolas']),
      ['sec', ['Informações gerais']],
      ['seg', [['Engajamento', 'Tópicos'], 'Engajamento']],
      [
        'tab',
        {
          titulo: 'Informações gerais por escola',
          busca: 'Pesquisar escola...',
          pag: ['Mostrando 10 de 18 escolas', 2],
          cols: [{ t: 'Escola', sort: true }, { t: 'Estudantes', w: 96, al: 'CENTER' }, { t: '% ativos', w: 96, al: 'CENTER', sort: true }, { t: 'Interações de aprendizado', w: 176, al: 'CENTER' }, { t: 'Tempo de estudo', w: 124, al: 'CENTER' }, { t: 'Interações com Edu', w: 144, al: 'CENTER' }, { t: 'Atividades criadas', w: 136, al: 'CENTER' }, { t: '% prof. ativos', w: 112, al: 'CENTER' }],
          rows: ESC.map(([n, , e, a, i, , pf]) => {
            const [x, y] = pf.split(' de ').map(Number)
            const at = Math.round((e * a) / 100)
            return [n, e, { M: a }, fmt(at * i), Math.round((at * i) / 24) + 'h', Math.round(at * 0.4), Math.round(y * 12.1), { M: Math.round((x * 100) / y) }]
          }),
        },
      ],
    ],
    Engajamento: [
      ['kpis', [['Média de interações realizadas', '48', '40', 120, ['por estudante ativo']], ['Estudantes ativos', '62%', '50%', 124, ['2.393 de 3.860 estudantes']], ['Média de atividades criadas', '12,1', '10', 121, ['por professor · 2.580 no período']], ['Professores ativos', '71%', '50%', 142, ['152 de 214 · 66 interações por professor ativo']]]],
      ['row', [ativTempo('Ativação ao longo do tempo', [['p1', 'Estudantes ativos (%)']], [['Ativos', [38, 47, 53, 58, 60, 44, 61, 64, 66, 62], 'p1']]), { t: 'L', titulo: 'Volume de uso ao longo do tempo', max: 16000, mil: true, leg: [['p1', 'Interações de estudantes'], ['g2', 'Interações de professores']], series: [['Estudantes', [6200, 9800, 11600, 12800, 13300, 7200, 13600, 14400, 14900, 14600], 'p1'], ['Professores', [620, 890, 1010, 1080, 1120, 560, 1150, 1210, 1240, 1220], 'g2']] }]],
      ['row', [{ t: 'H', titulo: 'Atividades criadas na rede por tipo', max: 1400, wRot: 170, itens: [['Tarefa', 1284], ['Desafio', 612], ['Prova Genial', 386], ['Sala de Aula Invertida', 158], ['Diagnóstico', 80], ['Projeto', 42], ['Campeonato', 18]] }, { t: 'V', titulo: 'Total de atividades criadas × meta', max: 360, meta: 214, leg: [['p1', 'Atividades criadas no mês'], ['muted', 'Meta: 214 (1 por professor)', true]], itens: MESES.map((m, i) => [m, [140, 250, 290, 300, 290, 120, 310, 320, 300, 260][i]]) }]],
      ['row', [{ t: 'V', titulo: 'Distribuição de interações dos estudantes', max: 1600, itens: [['Nenhuma', 1467], ['1 a 10', 380], ['11 a 40', 760], ['41 a 100', 980], ['Mais de 100', 273]] }, { t: 'H', titulo: 'Ranking de engajamento por escola', desc: '% de estudantes ativos · 6 primeiras de 18 escolas.', max: 100, pct: true, wRot: 170, itens: desc10(ESC, 3).slice(0, 6).map((r) => [r[0], r[3]]) }]],
      [
        'tab',
        {
          titulo: 'Engajamento por escola',
          busca: 'Pesquisar escola...',
          pag: ['Mostrando 10 de 18 escolas', 2],
          cols: [{ t: 'Posição', w: 88 }, { t: 'Escola', sort: true }, { t: '% de estudantes ativos', w: 220 }, { t: 'Interações por estudante ativo', w: 210, al: 'CENTER' }, { t: '% prof. ativos', w: 120, al: 'CENTER' }],
          rows: desc10(ESC, 3).map(([n, , , a, i, , pf], k) => {
            const [x, y] = pf.split(' de ').map(Number)
            return [k + 1 + 'º', n, { tr: a, tx: a + '% · meta 50%', meta: 50 }, i, { M: Math.round((x * 100) / y) }]
          }),
        },
      ],
      [
        'tab',
        {
          titulo: 'Comparativo de adoção por escola',
          busca: 'Pesquisar escola...',
          pag: ['Mostrando 10 de 18 escolas', 2],
          cols: [{ t: 'Escola', sort: true }, { t: 'Estudantes totais', w: 150, al: 'CENTER' }, { t: 'Interações de estudantes', w: 190, al: 'CENTER' }, { t: 'Professores totais', w: 150, al: 'CENTER' }, { t: 'Interações de professores', w: 190, al: 'CENTER' }, { t: 'Interações por professor ativo', w: 200, al: 'CENTER' }],
          rows: ESC.map(([n, , e, a, i, , pf]) => {
            const [x, y] = pf.split(' de ').map(Number)
            const at = Math.round((e * a) / 100)
            const ipa = Math.round(55 + (a - 50) * 0.6)
            return [n, e, fmt(at * i), y, fmt(x * ipa), ipa]
          }),
        },
      ],
    ],
    Aprendizagem: [
      ['kpis', [['Pontos de aprendizado por estudante ativo', '7,4', '10', 74, ['1 ponto por tópico dominado']], ['Estudantes com aprendizado adequado', '54%', '60%', 90, ['dos 3.412 estudantes avaliados']], ['Desempenho médio', '57%', null, null, ['Ponderado pelas interações de aprendizagem']], ['Tópicos dominados', '17.700', null, null, ['Somando todos os estudantes ativos']]]],
      ['row', [{ t: 'prof', titulo: 'Rubricas de proficiência', dist: RUBD([12, 478, 35, 1365, 27, 1058, 13, 511, 13, 448]), rodape: 'Aprendizado adequado = Proficiente + Avançado (meta 60% dos avaliados). Não avaliado: estudantes sem respostas suficientes.' }, evol([0.4, 1.1, 1.9, 2.8, 3.6, 4.0, 4.9, 5.8, 6.7, 7.4])]],
      ['row', [pilhas('Distribuição de rubricas por escola', [['Castro Alves', [15, 42, 23, 10, 10]], ['Monteiro Lobato', [14, 41, 24, 11, 10]], ['Ana Néri', [13, 41, 25, 11, 10]], ['Cecília Meireles', [12, 38, 27, 12, 11]], ['Paulo Freire', [9, 34, 31, 14, 12]], ['Jardim das Flores', [7, 32, 30, 20, 11]]], '6 de 18 escolas.'), { t: 'H', w: 400, titulo: 'Ranking de aprendizagem', desc: '% de estudantes com aprendizado adequado.', max: 100, pct: true, wRot: 150, itens: [['EM Castro Alves', 63], ['EM Monteiro Lobato', 61], ['EM Ana Néri', 60], ['EM Anita Garibaldi', 59], ['EM Machado de Assis', 57], ['EM Cecília Meireles', 56], ['EM Jardim das Flores', 39]] }]],
      ['row', [desTempo([58, 60, 61, 63, 62, 59, 64, 65, 66, 64]), { t: 'H', titulo: 'Desempenho por área de conhecimento', max: 100, pct: true, wRot: 170, itens: [['Linguagens', 60], ['Ciências da Natureza', 59], ['Ciências Humanas', 58], ['Matemática', 54]] }]],
      ['row', [pilhas('Rubricas por ano escolar', [['4º ano', [13, 37, 26, 12, 12]], ['5º ano', [11, 34, 28, 14, 13]], ['6º ano', [12, 35, 27, 13, 13]], ['7º ano', [12, 36, 27, 12, 13]], ['8º ano', [12, 35, 27, 13, 13]], ['9º ano', [11, 35, 28, 13, 13]]]), { t: 'hab', titulo: 'Ranking de habilidades', link: 'Ver todas as habilidades', itens: [['EF05MA03', 'Frações equivalentes', 38, '5º ano'], ['EF09MA05', 'Porcentagem e juros', 44, '9º ano'], ['EF05LP04', 'Pontuação em diálogos', 47, '5º ano'], ['EF07MA05', 'Operações com frações', 49, '7º ano']] }]],
      topicos('Ranking de tópicos', [['Frações equivalentes', 'Matemática', '412h', 18400, 6990], ['Porcentagem e juros', 'Matemática', '286h', 12100, 5320], ['Pontuação em diálogos', 'Língua Portuguesa', '240h', 9800, 4610], ['Números decimais', 'Matemática', '355h', 15600, 10140], ['Interpretação de crônicas', 'Língua Portuguesa', '301h', 11900, 7970], ['Ciclo da água', 'Ciências', '188h', 7400, 5030]], ['Mostrando 6 de 212 tópicos', 36]),
    ],
  },
}

/* ------------------------------------------------------------------ 3 · Escola (coordenadora) */
const TT: [string, number, number][] = [['701', 52, 58], ['501', 46, 54], ['801', 45, 56], ['601', 44, 53], ['901', 40, 52], ['902', 39, 51], ['702', 38, 48], ['802', 36, 50], ['502', 28, 45]]
const escola: Rel = {
  id: 'escola',
  grupo: 'inst',
  tipo: 'Escola',
  perfil: 'coord',
  mig: ['Início', 'Relatórios', 'Institucionais', 'Escola', 'EM Jardim das Flores'],
  cab: instCab([['Tipo de relatório', 'Escola', 'school', 220], ['Escola', 'EM Jardim das Flores', 'school', 280, false, true]], 'Seu acesso: EM Jardim das Flores'),
  ent: ['EM Jardim das Flores', 'Escola', 'school', 'Rede Municipal de Nova Esperança · 9 turmas do 5º ao 9º ano · 230 estudantes · 14 professores'],
  T: {
    'Visão geral': [
      ['kpis', [['Estudantes ativos', '41%', '50%', 82, ['95 de 230 estudantes']], ['Professores ativos', '64%', '50%', 128, ['9 de 14 professores']], ['Desempenho médio', '52%', null, null, ['Ponderado pelas interações de aprendizagem']], ['Interações de estudantes', '9.960', null, null, ['No período']]]],
      ['sec', ['Desempenho × engajamento', 'Cada ponto é uma turma. Mostra onde agir primeiro: ativação, reforço pedagógico ou os dois.']],
      quadB('Mapa de ativação × desempenho', TT.map(([n, x, y]) => ({ x, y, nome: 'Turma ' + n })), 40, 60, 'Engajamento (% de estudantes ativos)', ['Turma 701', 'Turma 502'], ['0 turmas', '5 turmas', '0 turmas', '4 turmas']),
      ['sec', ['Informações gerais']],
      ['seg', [['Engajamento', 'Tópicos'], 'Engajamento']],
      [
        'tab',
        {
          titulo: 'Informações gerais por turma',
          busca: 'Pesquisar turma...',
          pag: ['Mostrando 9 de 9 turmas', 1],
          cols: [{ t: 'Turma', sort: true }, { t: 'Estudantes', w: 96, al: 'CENTER' }, { t: '% ativos', w: 96, al: 'CENTER', sort: true }, { t: 'Interações de aprendizado', w: 180, al: 'CENTER' }, { t: 'Tempo de estudo', w: 124, al: 'CENTER' }, { t: 'Interações com Edu', w: 148, al: 'CENTER' }, { t: 'Tempo de uso', w: 112, al: 'CENTER' }, { t: 'Atividades criadas', w: 140, al: 'CENTER' }, { t: 'Desempenho', w: 112, al: 'CENTER' }],
          rows: ([['701', 26, 14, 52, 988, '41h', 64, '58h', 6, 58], ['501', 26, 12, 46, 910, '37h', 41, '52h', 5, 54], ['801', 26, 12, 45, 832, '35h', 58, '49h', 6, 56], ['601', 25, 11, 44, 825, '34h', 37, '47h', 5, 53], ['901', 26, 10, 40, 780, '31h', 52, '44h', 5, 52], ['902', 25, 10, 39, 775, '30h', 49, '43h', 5, 51], ['702', 25, 10, 38, 725, '29h', 44, '41h', 6, 48], ['802', 24, 9, 36, 648, '26h', 39, '37h', 5, 50], ['502', 27, 7, 28, 594, '22h', 18, '31h', 4, 45]] as any[]).map(([t, e, , p, i, te, ie, tu, at, d]) => ['Turma ' + t, e, { M: p }, fmt(i), te, ie, tu, at, { F: d }]),
        },
      ],
    ],
    Engajamento: [
      ['kpis', [['Média de interações realizadas', '31', '40', 78, ['por estudante ativo']], ['Estudantes ativos', '41%', '50%', 82, ['95 de 230 estudantes']], ['Média de atividades criadas', '3,4', '10', 34, ['por professor · 47 no período']], ['Professores ativos', '64%', '50%', 128, ['9 de 14 · 87 interações por professor ativo']]]],
      ['row', [ativTempo('Ativação ao longo do tempo', [['p1', 'Estudantes ativos (%)']], [['Ativos', [30, 36, 40, 44, 45, 33, 44, 46, 44, 41], 'p1']]), { t: 'L', titulo: 'Volume de uso ao longo do tempo', max: 1400, leg: [['p1', 'Interações de estudantes'], ['g2', 'Interações de professores']], series: [['Estudantes', [520, 880, 1010, 1150, 1190, 610, 1180, 1240, 1120, 1060], 'p1'], ['Professores', [60, 85, 96, 104, 98, 40, 102, 110, 92, 88], 'g2']] }]],
      ['row', [{ t: 'H', titulo: 'Atividades criadas por tipo', max: 30, wRot: 160, itens: [['Tarefa', 28], ['Prova Genial', 9], ['Desafio', 6], ['Diagnóstico', 2], ['Sala de Aula Invertida', 1], ['Projeto', 1]] }, { t: 'V', titulo: 'Total de atividades criadas × meta', max: 16, meta: 14, leg: [['p1', 'Atividades criadas no mês'], ['muted', 'Meta: 14 (1 por professor)', true]], itens: MESES.map((m, i) => [m, [3, 5, 6, 6, 5, 2, 6, 7, 4, 3][i]]) }]],
      ['row', [{ t: 'H', titulo: 'Ranking de engajamento por turma', max: 100, pct: true, wRot: 90, itens: TT.map(([n, x]) => ['Turma ' + n, x]) }, { t: 'V', titulo: 'Distribuição de interações dos estudantes', max: 150, itens: [['Nenhuma', 135], ['1 a 10', 22], ['11 a 40', 38], ['41 a 100', 27], ['Mais de 100', 8]] }]],
      [
        'tab',
        {
          titulo: 'Ranking de engajamento de professores',
          busca: 'Pesquisar professor...',
          pag: ['Mostrando 6 de 14 professores', 3],
          cols: [{ t: 'Posição', w: 88 }, { t: 'Professor', sort: true }, { t: 'Disciplina', w: 170 }, { t: 'Turmas', w: 170 }, { t: 'Atividades criadas', w: 150, al: 'CENTER', sort: true }, { t: 'Dias ativos', w: 110, al: 'CENTER' }, { t: '% da meta', w: 170 }],
          rows: ([[1, 'Rafael Souza', 'Matemática', '701, 702 e 801', 12, 38], [2, 'Fernanda Lima', 'Polivalente', '501 e 502', 10, 35], [3, 'Otávio Mendes', 'Matemática', '601, 802, 901, 902', 7, 24], [4, 'Renato Alves', 'Língua Portuguesa', '601 a 902', 6, 21], [5, 'Bianca Torres', 'Inglês', '601 a 902', 4, 15], [6, 'Paula Andrade', 'Ciências', '601 a 902', 3, 5]] as any[]).map(([p, n, d, t, a, da]) => [p + 'º', n, d, t, a, da, { tr: Math.min(100, a * 10), tx: a * 10 + '%', meta: 100 }]),
        },
      ],
      [
        'tab',
        {
          titulo: 'Engajamento dos estudantes',
          busca: 'Pesquisar estudante...',
          pag: ['Mostrando 8 de 230 estudantes', 29],
          cols: [{ t: 'Estudante', sort: true }, { t: 'Turma', w: 80 }, { t: 'Interações de aprendizado', w: 170, al: 'CENTER', sort: true }, { t: 'Dias ativos', w: 104, al: 'CENTER' }, { t: 'Interações por dia ativo', w: 170, al: 'CENTER' }, { t: 'Tempo de estudo', w: 130, al: 'CENTER' }, { t: 'Interações com Edu', w: 150, al: 'CENTER' }],
          rows: [['Alice Moreira', '701', 58, 41, '1,4', '14h', 6], ['Bruno Teixeira', '701', 51, 38, '1,3', '12h', 4], ['Pedro Lins', '801', 49, 36, '1,4', '11h', 9], ['Camila Rocha', '701', 44, 33, '1,3', '10h', 3], ['Olívia Santana', '702', 40, 30, '1,3', '9h', 5], ['Eduarda Lima', '701', 35, 24, '1,5', '7h', 2], ['Isabela Duarte', '702', 28, 19, '1,5', '6h', 8], ['Enzo Martins', '702', 6, 4, '1,5', '1h', 0]],
        },
      ],
    ],
    Aprendizagem: [
      ['kpis', [['Pontos de aprendizado por estudante ativo', '6,1', '10', 61, ['1 ponto por tópico dominado']], ['Estudantes com aprendizado adequado', '39%', '60%', 65, ['Proficiente + Avançado']], ['Desempenho médio', '52%', null, null, ['Ponderado pelas interações de aprendizagem']], ['Tópicos dominados', '1.403', null, null, ['Somando todos os estudantes ativos']]]],
      ['row', [{ t: 'prof', titulo: 'Rubricas de proficiência', dist: [['Avançado', 7, 16], ['Proficiente', 32, 74], ['Básico', 30, 70], ['Insuficiente', 20, 45], ['Não avaliado', 11, 25]], rodape: 'Aprendizado adequado = Proficiente + Avançado (meta 60%). Não avaliado: estudantes sem respostas suficientes.' }, evol([0.4, 0.9, 1.5, 2.2, 2.9, 3.3, 4.0, 4.8, 5.5, 6.1])]],
      ['row', [pilhas('Distribuição de rubricas por turma', [['Turma 701', [9, 35, 29, 16, 11]], ['Turma 801', [8, 34, 30, 18, 10]], ['Turma 501', [5, 36, 32, 17, 10]], ['Turma 601', [6, 34, 31, 19, 10]], ['Turma 702', [6, 30, 32, 21, 11]], ['Turma 502', [3, 30, 31, 25, 11]]], 'Percentual de estudantes por rubrica em cada turma.'), { t: 'H', w: 400, titulo: 'Ranking de aprendizagem', desc: '% de estudantes com aprendizado adequado.', max: 100, pct: true, wRot: 90, itens: [['Turma 701', 44], ['Turma 801', 42], ['Turma 501', 41], ['Turma 601', 40], ['Turma 902', 40], ['Turma 901', 38], ['Turma 802', 37], ['Turma 702', 36], ['Turma 502', 33]] }]],
      ['row', [desTempo([48, 49, 50, 51, 52, 49, 53, 54, 53, 52]), { t: 'H', titulo: 'Desempenho por área de conhecimento', max: 100, pct: true, wRot: 170, itens: [['Linguagens', 55], ['Ciências da Natureza', 54], ['Ciências Humanas', 53], ['Matemática', 49]] }]],
      topicos('Ranking de tópicos', [['Frações equivalentes', 'Matemática', '6h 40min', 1240, 446], ['Operações com frações', 'Matemática', '5h 10min', 980, 412], ['Porcentagem', 'Matemática', '4h 05min', 760, 357], ['Pontuação em diálogos', 'Língua Portuguesa', '3h 50min', 690, 331], ['Números decimais', 'Matemática', '5h 30min', 1120, 672], ['Revolução Industrial', 'História', '2h 10min', 410, 250], ['Interpretação de crônicas', 'Língua Portuguesa', '4h 20min', 840, 521], ['Ciclo da água', 'Ciências', '2h 45min', 520, 343]], ['Mostrando 8 de 64 tópicos', 8]),
      ['row', [{ t: 'hab', titulo: 'Ranking de habilidades', link: 'Ver as 38 habilidades', itens: [['EF05MA03', 'Frações equivalentes', 36, '5º ano'], ['EF07MA05', 'Operações com frações', 42, '7º ano'], ['EF07MA02', 'Porcentagem', 47, '7º ano'], ['EF05LP04', 'Pontuação em diálogos', 48, '5º ano']] }, pilhas('Rubricas por ano escolar', [['5º ano', [5, 27, 33, 24, 11]], ['6º ano', [6, 31, 31, 21, 11]], ['7º ano', [9, 33, 29, 18, 11]], ['8º ano', [8, 34, 30, 18, 10]], ['9º ano', [7, 33, 29, 20, 11]]])]],
    ],
  },
}

/* ------------------------------------------------------------------ 4 · Turma 701 (professor) */
// nome, interações, tempo de estudo, interações com Edu, tempo de uso, pontuação, treinos, batalha solo, batalha VS, engajamento relativo, desempenho
export const E701: [string, number, string, number, string, number, number, number, number, number, number][] = [
  ['Alice Moreira', 58, '14h', 6, '19h', 1240, 22, 18, 9, 90, 93],
  ['Bruno Teixeira', 51, '12h', 4, '16h', 1105, 19, 15, 8, 82, 86],
  ['Camila Rocha', 44, '10h', 3, '13h', 870, 15, 12, 6, 70, 71],
  ['Daniel Freitas', 39, '9h', 5, '12h', 760, 12, 10, 5, 62, 61],
  ['Eduarda Lima', 35, '7h', 2, '10h', 640, 10, 8, 4, 55, 52],
  ['Felipe Nunes', 31, '6h', 1, '8h', 410, 8, 6, 3, 48, 40],
  ['Giovana Pires', 12, '2h', 0, '3h', 150, 3, 2, 1, 20, 27],
  ['Manuela Castro', 9, '1h', 0, '2h', 90, 2, 1, 0, 15, 52],
]
const turma: Rel = {
  id: 'turma',
  grupo: 'inst',
  tipo: 'Turma',
  perfil: 'prof',
  mig: ['Início', 'Relatórios', 'Institucionais', 'Turma', 'Turma 701'],
  cab: instCab([['Tipo de relatório', 'Turma', 'users', 200], ['Escola', 'EM Jardim das Flores', 'school', 240, false, true], ['Turma', 'Turma 701', 'users', 200]], 'Seu acesso: suas turmas'),
  ent: ['Turma 701', 'Turma', 'users', 'EM Jardim das Flores · 7º ano · 26 estudantes · Matemática com Rafael Souza'],
  T: {
    'Visão geral': [
      ['kpis', [['Estudantes ativos', '52%', '50%', 104, ['Média do período']], ['Desempenho médio', '58%', null, null, ['Ponderado pelas interações de aprendizagem']], ['Interações de estudantes', '988', null, null, ['No período']], ['Atividades no período', '6', null, null, ['3 tarefas · 2 Provas Genial · 1 desafio']]]],
      ['sec', ['Desempenho × engajamento', 'Cada ponto é um estudante da turma.']],
      quadB('Desempenho × engajamento', E701.map((r) => ({ x: r[9], y: r[10], nome: r[0].split(' ')[0] })), 52, 60, 'Engajamento (relativo à turma, %)', ['Alice', 'Giovana'], ['4 estudantes', '0 estudantes', '0 estudantes', '4 estudantes']),
      ['sec', ['Informações gerais']],
      ['seg', [['Engajamento', 'Tópicos'], 'Engajamento']],
      ['tab', { titulo: 'Informações gerais por estudante', busca: 'Pesquisar estudante...', desc: 'Pontuação, treinos e batalhas aparecem para turmas até o 9º ano.', pag: ['Mostrando 8 de 26 estudantes', 4], cols: [{ t: 'Estudante', sort: true }, { t: 'Interações de aprendizado', w: 172, al: 'CENTER', sort: true }, { t: 'Tempo de estudo', w: 120, al: 'CENTER' }, { t: 'Interações com Edu', w: 140, al: 'CENTER' }, { t: 'Tempo de uso', w: 104, al: 'CENTER' }, { t: 'Pontuação', w: 96, al: 'CENTER' }, { t: 'Quant. treino', w: 104, al: 'CENTER' }, { t: 'Batalha solo', w: 96, al: 'CENTER' }, { t: 'Batalha VS', w: 88, al: 'CENTER' }], rows: E701.map((r) => [r[0], r[1], r[2], r[3], r[4], fmt(r[5]), r[6], r[7], r[8]]) }],
      ['sec', ['Histórico de atividades', 'Novembro: 3 atividades · outubro: 2 · setembro: 1.']],
      [
        'tab',
        {
          titulo: 'Histórico de atividades',
          busca: 'Pesquisar atividade...',
          cols: [{ t: 'Nome', sort: true }, { t: 'Tipo', w: 150 }, { t: 'Data de início', w: 130, al: 'CENTER' }, { t: 'Data de término', w: 130, al: 'CENTER' }, { t: 'Status', w: 136 }, { t: 'Criador', w: 140 }, { t: 'Relatório', w: 130 }],
          rows: [['Proporção direta', 'Tarefa', '24/11', '28/11', 'Em progresso'], ['Frações e decimais', 'Prova Genial', '18/11', '18/11', 'Finalizada'], ['Equações · lista 1', 'Tarefa', '11/11', '14/11', 'Finalizada'], ['Porcentagem', 'Desafio', '04/11', '04/11', 'Finalizada'], ['Expressões numéricas', 'Tarefa', '28/10', '31/10', 'Finalizada'], ['Frações e decimais I', 'Prova Genial', '14/10', '14/10', 'Finalizada']].map(([n, t, i, f, s]) => [n, t, i, f, { b: s, t: s === 'Finalizada' ? 'suc' : 'inf' }, 'Rafael Souza', { lk: 'Ver relatório', ir: n === 'Frações e decimais' ? 'prova' : t === 'Tarefa' ? 'tarefa' : t === 'Desafio' ? 'desafio' : 'prova' }]),
        },
      ],
    ],
    Engajamento: [
      ['kpis', [['Média de interações realizadas', '38', '40', 95, ['por estudante ativo']], ['Estudantes ativos', '52%', '50%', 104, ['Média do período']], ['Média de atividades criadas', '6', '10', 60, ['na turma · meta de 1 por mês']], ['Interações por dia ativo', '1,3', null, null, ['Média dos estudantes ativos']]]],
      ['row', [ativTempo('Ativação ao longo do tempo', [['p1', 'Estudantes ativos (%)']], [['Ativos', [40, 45, 48, 51, 53, 42, 52, 55, 57, 52], 'p1']]), { t: 'H', titulo: 'Atividades criadas na turma', max: 4, wRot: 110, itens: [['Tarefa', 3], ['Prova Genial', 2], ['Desafio', 1]] }]],
      ['tab', { titulo: 'Ranking de engajamento de estudantes', busca: 'Pesquisar estudante...', pag: ['Mostrando 8 de 26 estudantes', 4], cols: [{ t: 'Posição', w: 88 }, { t: 'Estudante', sort: true }, { t: 'Interações', w: 140, al: 'CENTER', sort: true }, { t: 'Meta', w: 104, al: 'CENTER' }, { t: '% da meta', w: 220 }], rows: E701.map((r, i) => [i + 1 + 'º', r[0], r[1], 40, { tr: Math.min(100, Math.round((r[1] * 100) / 40)), tx: Math.round((r[1] * 100) / 40) + '%', meta: 100 }]) }],
    ],
    Aprendizagem: [
      ['kpis', [['Pontos de aprendizado por estudante ativo', '6,8', '10', 68, ['1 ponto por tópico dominado']], ['Estudantes com aprendizado adequado', '44%', '60%', 73, ['Proficiente + Avançado']], ['Desempenho médio', '58%', null, null, ['Ponderado pelas interações de aprendizagem']], ['Tópicos dominados', '95', null, null, ['Somando os estudantes da turma']]]],
      ['row', [{ t: 'prof', titulo: 'Rubricas de proficiência', dist: RUBD([8, 2, 35, 9, 38, 10, 15, 4, 4, 1]), rodape: '26 estudantes. Meta: 60% em Proficiente + Avançado.' }, evol([0.5, 1.1, 1.8, 2.5, 3.2, 3.6, 4.4, 5.2, 6.0, 6.8])]],
      ['tab', { titulo: 'Ranking de aprendizagem da turma', busca: 'Pesquisar estudante...', pag: ['Mostrando 8 de 26 estudantes', 4], cols: [{ t: 'Posição', w: 88 }, { t: 'Estudante', sort: true }, { t: 'Desempenho', w: 160, al: 'CENTER', sort: true }, { t: 'Rubrica', w: 180 }, { t: 'Relatório', w: 150 }], rows: E701.slice().sort((a, b) => b[10] - a[10]).map((r, i) => [i + 1 + 'º', r[0], { F: r[10] }, { p: faixa(r[10]) }, { lk: 'Ver estudante', ir: 'est' }]) }],
      ['row', [{ t: 'hab', titulo: 'Ranking de tópicos', itens: [['EF07MA04', 'Números decimais', 74, '9 questões'], ['EF07MA13', 'Equações do 1º grau', 61, '10 questões'], ['EF07MA05', 'Operações com frações', 52, '12 questões'], ['EF07MA02', 'Porcentagem', 50, '7 questões']] }, { t: 'H', titulo: 'Desempenho por área de conhecimento', max: 100, pct: true, wRot: 170, itens: [['Matemática', 58], ['Linguagens', 62], ['Ciências da Natureza', 60]] }]],
    ],
  },
}

/* ------------------------------------------------------------------ 5 · Professores (coordenadora) */
const prof: Rel = {
  id: 'prof',
  grupo: 'inst',
  tipo: 'Professores',
  perfil: 'coord',
  mig: ['Início', 'Relatórios', 'Institucionais', 'Professores', 'Rafael Souza'],
  cab: instCab([['Tipo de relatório', 'Professores', 'award', 200], ['Escola', 'EM Jardim das Flores', 'school', 240, false, true], ['Turma', 'Todas as turmas', 'users', 200], ['Professor', 'Rafael Souza', 'users', 240]], 'Seu acesso: EM Jardim das Flores'),
  ent: ['Rafael Souza', 'Professor', 'award', 'Matemática · EM Jardim das Flores · turmas 701, 702 e 801 · 77 estudantes'],
  T: {
    'Visão geral': [
      ['kpis', [['Turmas atendidas', '3', null, null, ['701, 702 e 801']], ['Estudantes', '77', null, null, ['nas turmas do professor']], ['Estudantes ativos', '45%', '50%', 90, ['35 de 77 estudantes']], ['Desempenho médio', '54%', null, null, ['Ponderado pelas interações de aprendizagem']]]],
      ['sec', ['Desempenho × engajamento', 'Cada ponto é uma turma do professor.']],
      quadB('Desempenho × engajamento', [{ x: 52, y: 58, nome: 'Turma 701' }, { x: 45, y: 56, nome: 'Turma 801' }, { x: 38, y: 48, nome: 'Turma 702' }], 45, 60, 'Engajamento (% de estudantes ativos)', ['Turma 701', 'Turma 702'], ['0 turmas', '2 turmas', '0 turmas', '1 turma']),
      ['sec', ['Informações gerais']],
      ['seg', [['Engajamento', 'Tópicos'], 'Engajamento']],
      ['tab', { titulo: 'Informações gerais por turma', busca: 'Pesquisar turma...', cols: [{ t: 'Turma', sort: true }, { t: 'Estudantes', w: 110, al: 'CENTER' }, { t: 'Estudantes ativos', w: 150, al: 'CENTER' }, { t: '% ativos', w: 110, al: 'CENTER', sort: true }, { t: 'Interações de aprendizado', w: 190, al: 'CENTER' }, { t: 'Tempo de estudo', w: 140, al: 'CENTER' }, { t: 'Atividades criadas', w: 150, al: 'CENTER' }], rows: ([['Turma 701', 26, 14, 52, 988, '41h', 6], ['Turma 801', 26, 12, 45, 832, '35h', 3], ['Turma 702', 25, 10, 38, 725, '29h', 3]] as any[]).map(([t, e, a, p, i, te, at]) => [t, e, a, { M: p }, i, te, at]) }],
    ],
    Engajamento: [
      ['kpis', [['Média de interações realizadas', '33', '40', 83, ['por estudante ativo']], ['Estudantes ativos', '45%', '50%', 90, ['35 de 77 estudantes']], ['Atividades criadas', '12', '10', 120, ['meta: 1 por mês']], ['Dias ativos', '38', null, null, ['5,6 interações por dia ativo · 10 meses ativos']]]],
      ['row', [{ t: 'L', titulo: 'Volume de uso ao longo do tempo', max: 32, leg: [['p1', 'Interações do professor (total: 214)']], series: [['Interações', [14, 20, 24, 25, 23, 9, 26, 28, 24, 21], 'p1']] }, { t: 'H', titulo: 'Distribuição de ações pedagógicas', max: 100, pct: true, wRot: 170, itens: [['Criar atividade', 38], ['Ver relatório', 31], ['Acompanhar estudantes', 18], ['Compartilhar', 13]] }]],
      ['row', [{ t: 'H', titulo: 'Atividades criadas por tipo', max: 8, wRot: 120, itens: [['Tarefa', 6], ['Prova Genial', 4], ['Desafio', 2]] }, { t: 'H', titulo: 'Ranking de engajamento por turma', max: 100, pct: true, wRot: 100, itens: [['Turma 701', 52], ['Turma 801', 45], ['Turma 702', 38]] }]],
    ],
    Aprendizagem: [
      ['kpis', [['Pontos de aprendizado por estudante ativo', '6,5', '10', 65, ['1 ponto por tópico dominado']], ['Estudantes com aprendizado adequado', '41%', '60%', 68, ['Proficiente + Avançado']], ['Desempenho médio', '54%', null, null, ['Ponderado pelas interações de aprendizagem']], ['Tópicos dominados', '228', null, null, ['Somando os estudantes das turmas']]]],
      ['row', [{ t: 'prof', titulo: 'Distribuição de rubricas de proficiência', dist: RUBD([6, 5, 35, 27, 36, 28, 17, 13, 6, 4]), rodape: '77 estudantes das turmas do professor. Meta: 60% em Proficiente + Avançado.' }, { t: 'H', w: 400, titulo: 'Ranking de aprendizagem', desc: '% de estudantes com aprendizado adequado.', max: 100, pct: true, wRot: 90, itens: [['Turma 701', 44], ['Turma 801', 42], ['Turma 702', 36]] }]],
      ['tab', { titulo: 'Tópicos', busca: 'Pesquisar tópico...', leg: RUB5, cols: [{ t: 'Tópico', sort: true }, { t: 'Nº de respostas', w: 170, al: 'CENTER', sort: true }, { t: 'Nº de acertos', w: 170, al: 'CENTER' }, { t: 'Desempenho (%)', w: 170, al: 'CENTER', sort: true }], rows: ([['Números decimais', 420, 311], ['Equações do 1º grau', 380, 232], ['Razão e proporção', 260, 151], ['Operações com frações', 510, 265], ['Porcentagem', 390, 195]] as [string, number, number][]).map(([t, r, a]) => [t, r, a, { F: Math.round((a * 100) / r) }]) }],
    ],
  },
}

/* ------------------------------------------------------------------ 6 · Estudante Alice (professor) */
const est: Rel = {
  id: 'est',
  grupo: 'inst',
  tipo: 'Estudante',
  perfil: 'prof',
  mig: ['Início', 'Relatórios', 'Institucionais', 'Estudante', 'Alice Moreira'],
  cab: instCab([['Tipo de relatório', 'Estudante', 'graduation-cap', 200], ['Escola', 'EM Jardim das Flores', 'school', 240, false, true], ['Turma', 'Turma 701', 'users', 200], ['Estudante', 'Alice Moreira', 'graduation-cap', 240]], 'Seu acesso: suas turmas'),
  ent: ['Alice Moreira', 'Estudante', 'graduation-cap', 'Turma 701 · EM Jardim das Flores · 7º ano · Matemática com Rafael Souza'],
  T: {
    'Visão geral': [
      ['kpis', [['Interações totais', '64', null, null, ['58 de aprendizagem']], ['Dias ativos', '41', null, null, ['10 meses ativos']], ['Desempenho médio', '93%', null, null, ['Rubrica: Avançado']], ['Progresso nos tópicos', '18 de 20', null, null, ['tópicos dominados']]]],
      ['sec', ['Informações gerais']],
      ['seg', [['Tópicos'], 'Tópicos']],
      topicos('Tópicos da estudante', [['Números decimais', 'Matemática', '3h 10min', 96, 92], ['Operações com frações', 'Matemática', '2h 55min', 110, 101], ['Equações do 1º grau', 'Matemática', '2h 40min', 88, 83], ['Porcentagem', 'Matemática', '1h 50min', 64, 56], ['Interpretação de crônicas', 'Língua Portuguesa', '1h 30min', 40, 35], ['Ciclo da água', 'Ciências', '1h 05min', 30, 27]], ['Mostrando 6 de 20 tópicos', 4]),
    ],
    Engajamento: [
      ['kpis', [['Total de interações realizadas', '58', '40', 145, ['de aprendizagem no período']], ['Tempo de estudo', '14h', null, null, ['no período']], ['Interações por dia ativo', '1,4', null, null, ['41 dias ativos']], ['Interações por mês ativo', '5,8', null, null, ['10 meses ativos']]]],
      ['row', [{ t: 'L', titulo: 'Dias ativos ao longo do tempo', max: 6, leg: [['p1', 'Dias ativos no mês']], series: [['Dias', [3, 4, 4, 5, 5, 2, 5, 5, 4, 4], 'p1']] }, { t: 'V', titulo: 'Interações por área de conhecimento', max: 45, itens: [['Matemática', 38], ['Linguagens', 12], ['Ciências da Natureza', 8]] }]],
    ],
    Aprendizagem: [
      ['kpis', [['Pontos de aprendizado do estudante', '18', null, null, ['1 ponto por tópico dominado']], ['Proficiência geral do estudante', 'Avançado', null, null, ['Rubrica-alvo: Proficiente']], ['Desempenho médio', '93%', null, null, ['Ponderado pelas interações de aprendizagem']], ['Tópicos dominados', '18', '20', 90, ['Progresso nos tópicos']]]],
      ['row', [{ t: 'L', titulo: 'Evolução da aprendizagem', max: 20, leg: [['p1', 'Aprendizagem acumulada'], ['muted', 'Meta acumulada', true]], series: [['Acumulada', [1, 3, 5, 7, 9, 10, 12, 14, 16, 18], 'p1'], ['Meta', META_PONTOS, 'muted', true]] }, desTempo([84, 86, 88, 90, 91, 88, 92, 93, 94, 93])]],
      ['row', [{ t: 'H', titulo: 'Proficiência por área de conhecimento', max: 100, pct: true, wRot: 170, itens: [['Matemática', 94], ['Ciências da Natureza', 90], ['Linguagens', 88]] }, { t: 'lista', w: 400, titulo: 'Onde apoiar a estudante', itens: [['Porcentagem', 'Menor desempenho entre os tópicos', { F: 88 }], ['Interpretação de crônicas', 'Língua Portuguesa', { F: 88 }]] }]],
    ],
  },
}

/* ------------------------------------------------------------------ 7 · Alfabetização (gestora) */
const ALF = (p: number) => (p >= 85 ? { b: 'Acima da expectativa', t: 'av' } : p >= 65 ? { b: 'Atendem expectativas', t: 'suc' } : p >= 30 ? { b: 'Em desenvolvimento', t: 'at' } : { b: 'Precisam de apoio', t: 'cr' })
const alf: Rel = {
  id: 'alf',
  grupo: 'inst',
  tipo: 'Alfabetização',
  perfil: 'gestora',
  mig: ['Início', 'Relatórios', 'Institucionais', 'Alfabetização', 'Rede'],
  cab: instCab([['Tipo de relatório', 'Alfabetização', 'book-open', 220], ['Recorte', 'Rede · 1º ao 3º ano', 'house', 300]]),
  ent: ['Alfabetização · Rede Municipal de Nova Esperança', 'Alfabetização', 'book-open', '1º ao 3º ano · 18 escolas · 1.140 estudantes'],
  T: {
    'Visão geral': [
      ['row', [{ t: 'V', titulo: 'Distribuição por fase', max: 500, itens: [['Não iniciado', 96], ['Silábica para Alfabética', 318], ['Alfabética para Ortográfica', 452], ['Ortográfica para Letrada', 274]] }, { t: 'status', w: 420, titulo: 'Níveis de proficiência', sub: 'Não avaliados: menos de 10 respostas.', partes: [['av', 'Acima da expectativa (85 a 100%)', 14, 160], ['suc', 'Atendem expectativas (65 a 85%)', 31, 353], ['at', 'Em desenvolvimento (30 a 65%)', 30, 342], ['cr', 'Precisam de apoio (0 a 30%)', 15, 171], ['n300', 'Não avaliados', 10, 114]] }]],
      ['tab', { titulo: 'Distribuição por fase por escola', busca: 'Pesquisar escola...', pag: ['Mostrando 6 de 18 escolas', 3], cols: [{ t: 'Escola', sort: true }, { t: 'Estudantes', w: 110, al: 'CENTER' }, { t: 'Não iniciado', w: 120, al: 'CENTER' }, { t: 'Silábica para Alfabética', w: 180, al: 'CENTER' }, { t: 'Alfabética para Ortográfica', w: 196, al: 'CENTER' }, { t: 'Ortográfica para Letrada', w: 184, al: 'CENTER' }], rows: [['EM Ana Néri', 72, 5, 18, 29, 20], ['EM Castro Alves', 80, 3, 16, 33, 28], ['EM Recanto Verde', 66, 7, 21, 25, 13], ['EM São Pedro', 64, 6, 19, 26, 13], ['EM Tiradentes', 70, 4, 17, 30, 19], ['EM Vila Nova', 68, 8, 22, 24, 14]] }],
    ],
    Engajamento: [
      ['kpis', [['Tempo médio por sessão', '17 min', '20 min', 85, ['tempo total ÷ estudantes ativos']], ['Estudantes ativos', '78%', '85%', 92, ['889 de 1.140 estudantes']], ['Média de participação semanal', '3,4', '4', 85, ['respostas por estudante ativo por semana']]]],
      ['row', [{ t: 'V', titulo: 'Estudantes por dia da semana', max: 700, itens: [['Dom', 40], ['Seg', 610], ['Ter', 640], ['Qua', 655], ['Qui', 630], ['Sex', 520], ['Sáb', 55]] }, { t: 'status', w: 420, titulo: 'Distribuição do tempo de sessão', sub: 'Percentual do tempo total em cada faixa de duração de sessão.', partes: [['p1', '0 a 10 min', 22, '96h'], ['g2', '10 a 20 min', 41, '179h'], ['g4', '20 a 30 min', 26, '113h'], ['g1', '30 min ou mais', 11, '48h']] }]],
      ['row', [{ t: 'L', titulo: 'Tendência de engajamento', rotX: SEM, max: 100, pct: true, leg: [['p1', 'Engajamento por semana (%)']], series: [['Engajamento', [72, 75, 74, 78, 77, 80, 79, 78], 'p1']] }, { t: 'lista', w: 420, titulo: 'Engajamento por fase de alfabetização', itens: [['Silábica para Alfabética', '318 estudantes', '21 min'], ['Alfabética para Ortográfica', '452 estudantes', '18 min'], ['Ortográfica para Letrada', '274 estudantes', '14 min'], ['Não avaliado', '114 estudantes', '—']] }]],
      ['tab', { titulo: 'Tempo de estudo por fase', busca: 'Pesquisar estudante...', pag: ['Mostrando 6 de 1.140 estudantes', 190], cols: [{ t: 'Estudante', sort: true }, { t: 'Silábica para Alfabética', w: 200, al: 'CENTER' }, { t: 'Alfabética para Ortográfica', w: 210, al: 'CENTER' }, { t: 'Ortográfica para Letrada', w: 200, al: 'CENTER' }, { t: 'Tempo total', w: 140, al: 'CENTER', sort: true }], rows: [['Lara Siqueira', '2h 10min', '4h 40min', '1h 20min', '8h 10min'], ['Davi Ramos', '3h 05min', '3h 50min', '—', '6h 55min'], ['Sophia Leal', '1h 40min', '3h 15min', '2h 05min', '7h'], ['Bento Araújo', '4h 20min', '1h 10min', '—', '5h 30min'], ['Maria Clara Vaz', '1h 15min', '2h 50min', '2h 40min', '6h 45min'], ['Théo Moura', '5h', '—', '—', '5h']] }],
    ],
    Aprendizagem: [
      ['tab', { titulo: 'Proficiência dos estudantes', busca: 'Pesquisar estudante...', pag: ['Mostrando 8 de 1.140 estudantes', 143], cols: [{ t: 'Estudante', sort: true }, { t: 'Respostas', w: 130, al: 'CENTER' }, { t: 'Acertos', w: 130, al: 'CENTER' }, { t: 'Proficiência', w: 140, al: 'CENTER', sort: true }, { t: 'Rubrica', w: 220 }], rows: ([['Lara Siqueira', 240, 214], ['Sophia Leal', 205, 172], ['Maria Clara Vaz', 198, 158], ['Davi Ramos', 176, 118], ['Bento Araújo', 150, 84], ['Théo Moura', 132, 46], ['Heitor Campos', 96, 24], ['Lívia Fontes', 8, 5]] as [string, number, number][]).map(([n, r, a]) => { const p = Math.round((a * 100) / r); return [n, r, a, p + '%', r < 10 ? { b: 'Não avaliado', t: 'neutro' } : ALF(p)] }) }],
      ['tab', { titulo: 'Proficiência por habilidade', busca: 'Pesquisar habilidade...', cols: [{ t: 'Habilidade', sort: true }, { t: 'Respostas', w: 130, al: 'CENTER' }, { t: 'Acertos', w: 130, al: 'CENTER' }, { t: 'Proficiência', w: 140, al: 'CENTER', sort: true }, { t: 'Rubrica', w: 220 }], rows: ([['EF01LP06 · Segmentação de palavras em sílabas', 18400, 14900], ['EF01LP07 · Identificação de fonemas e letras', 16200, 12300], ['EF01LP08 · Relação entre letras e sons', 15800, 10900], ['EF01LP02 · Escrita espontânea de palavras', 14100, 8600], ['EF02LP02 · Leitura de sílabas complexas', 12700, 6900], ['EF12LP01 · Leitura de textos curtos', 11300, 5200]] as [string, number, number][]).map(([h, r, a]) => { const p = Math.round((a * 100) / r); return [h, fmt(r), fmt(a), p + '%', ALF(p)] }) }],
    ],
  },
}

/* ------------------------------------------------------------------ 9 · Tarefa (gestora, todas) */
const TAR: [string, string, string, string, string, number, number, number, number | null, string][] = [
  ['Frações equivalentes · lista 3', 'EM Jardim das Flores · Turma 501', 'Fernanda Lima', 'Matemática', '24/11', 18, 26, 15, 52, 'Encerrada'],
  ['Leitura: contos de assombração', 'EM Vila Nova · 4º ano B', 'Juliana Prado', 'Língua Portuguesa', '28/11', 21, 30, 21, null, 'Em andamento'],
  ['Decimais no dia a dia', 'EM São Pedro · 5º ano C', 'Marcos Teixeira', 'Matemática', '21/11', 27, 29, 25, 71, 'Encerrada'],
  ['Ciclo da água', 'EM Recanto Verde · 3º ano A', 'Beatriz Nunes', 'Ciências', '19/11', 19, 25, 16, 68, 'Encerrada'],
  ['Pontuação em diálogos', 'EM Jardim das Flores · Turma 502', 'Fernanda Lima', 'Língua Portuguesa', '30/11', 9, 27, 9, null, 'Em andamento'],
  ['Equações do 1º grau · lista 2', 'EM Jardim das Flores · Turma 702', 'Rafael Souza', 'Matemática', '21/11', 17, 25, 14, 54, 'Encerrada'],
  ['Leitura de mapas', 'EM Castro Alves · Turma 601', 'Roberto Lins', 'Geografia', '20/11', 23, 27, 21, 66, 'Encerrada'],
  ['Revolução Industrial', 'EM Monteiro Lobato · Turma 801', 'Tatiane Reis', 'História', '25/11', 22, 28, 20, 61, 'Encerrada'],
]
const tarefa: Rel = {
  id: 'tarefa',
  grupo: 'ativ',
  tipo: 'Tarefa',
  perfil: 'gestora',
  mig: ['Início', 'Relatórios', 'Atividades', 'Tarefa', 'Todas as tarefas'],
  cab: ativCab('Tarefa', 'list-checks', 'Todas as tarefas', 'Onde', 'Rede Municipal de Nova Esperança'),
  ent: ['Todas as tarefas', 'Tarefa', 'list-checks', 'Rede Municipal de Nova Esperança · 1.284 tarefas criadas por 146 professores · 01/02 a 26/11/2026'],
  T: {
    'Visão geral': [
      ['kpis', [['Tarefas iniciadas', '29.585', null, null, ['Relações tarefa-estudante com ao menos uma resposta']], ['Tarefas concluídas', '25.065', null, null, ['85% das tarefas iniciadas']], ['Desempenho médio', '61%', null, null, ['Ponderado pelo número de tarefas iniciadas']], ['Estudantes com aprendizado adequado', '53%', '60%', 88, ['Proficiente + Avançado']]]],
      ['sec', ['Desempenho × engajamento', 'Cada ponto é uma escola: desempenho nas tarefas × interações realizadas.']],
      quadB('Desempenho × engajamento', ESC.map(([n, , , a, , ad]) => ({ x: a, y: ad + 6, nome: n })), 62, 60, 'Interações realizadas (relativo à rede, %)', ['EM Castro Alves', 'EM Jardim das Flores'], ['3 escolas', '3 escolas', '0 escolas', '4 escolas']),
      ['tab', { titulo: 'Ranking de tarefas', busca: 'Pesquisar tarefa...', pag: ['Mostrando 8 de 1.284 tarefas', 161], cols: [{ t: 'Tarefa', sort: true }, { t: 'Data', w: 96, al: 'CENTER', sort: true }, { t: 'Professor', w: 150 }, { t: 'Total', w: 96, al: 'CENTER' }, { t: 'Concluídas %', w: 180 }, { t: 'Desempenho', w: 128, al: 'CENTER', sort: true }, { t: 'Relatório', w: 130 }], rows: TAR.map(([n, onde, pr, , prazo, e, tot, , des]) => [{ d: [n, onde] }, prazo, pr, tot, { tr: Math.round((e * 100) / tot), tx: Math.round((e * 100) / tot) + '%', meta: 70 }, des === null ? { m: 'Parcial' } : { F: des }, { lk: 'Ver tarefa' }]) }],
    ],
    Engajamento: [
      ['kpis', [['Estudantes ativos', '81%', null, null, ['3.120 de 3.860 fizeram ao menos uma tarefa']], ['Estudantes que finalizaram', '2.640', null, null, ['concluíram todas as tarefas recebidas']], ['Média de interações realizadas', '21', '40', 53, ['por estudante ativo nas tarefas']], ['Tarefas criadas', '1.284', null, null, ['por 146 professores']]]],
      ['row', [progresso(25065, 2958, 1562, 29585), { t: 'V', titulo: 'Tarefas criadas por mês', max: 180, itens: MESES.map((m, i) => [m, [92, 118, 131, 140, 136, 74, 142, 151, 160, 140][i]]) }]],
      ['row', [{ t: 'hab', titulo: 'Ranking de tópicos', itens: [['EF06MA07', 'Frações equivalentes', 46, '4.820 respostas'], ['EF09MA05', 'Porcentagem e juros', 51, '3.940 respostas'], ['EF05LP04', 'Pontuação em diálogos', 55, '3.310 respostas'], ['EF07MA04', 'Números decimais', 66, '5.120 respostas']] }]],
    ],
    Aprendizagem: [
      ['kpis', [['Estudantes com aprendizado adequado', '53%', '60%', 88, ['Proficiente + Avançado']], ['Taxa de acurácia', '61%', null, null, ['Acertos ÷ respostas']], ['Desempenho médio', '61%', null, null, ['Ponderado pelas tarefas iniciadas']], ['Taxa média de acerto das questões', '58%', null, null, ['Questões das tarefas no recorte']]]],
      ['row', [{ t: 'prof', titulo: 'Rubricas de proficiência', dist: R4([12, 374, 41, 1279, 32, 998, 15, 469]), rodape: '3.120 estudantes com pelo menos 1 tarefa entregue. Meta: 60% em Proficiente + Avançado.' }, desTempo([57, 58, 60, 61, 60, 58, 62, 63, 63, 61])]],
      ['row', [{ t: 'H', titulo: 'Desempenho por área de conhecimento', max: 100, pct: true, wRot: 170, itens: [['Ciências da Natureza', 66], ['Linguagens', 62], ['Ciências Humanas', 61], ['Matemática', 57]] }, pilhas('Rubricas por ano escolar', [['5º ano', [11, 39, 33, 17, 0]], ['6º ano', [12, 41, 32, 15, 0]], ['7º ano', [13, 42, 31, 14, 0]], ['8º ano', [12, 41, 32, 15, 0]], ['9º ano', [11, 40, 33, 16, 0]]])]],
      ['tab', { titulo: 'Questões das tarefas', busca: 'Pesquisar questão...', pag: ['Mostrando 6 de 9.840 questões', 1640], cols: [{ t: 'Tarefa / Questão', sort: true }, { t: 'Tentativas', w: 110, al: 'CENTER' }, { t: 'Taxa de acerto', w: 130, al: 'CENTER', sort: true }, { t: 'Dificuldade', w: 120, al: 'CENTER' }, { t: 'Tempo médio por tentativa', w: 200, al: 'CENTER' }, { t: 'Sinais', w: 160 }], rows: ([['Frações equivalentes · lista 3', 'Q4 · Simplifique 18/24', 26, 31, 'Alta', '2 min 50 s', 'Em branco'], ['Revolução Industrial', 'Q2 · Causas da Revolução Industrial', 28, 39, 'Média', '1 min 40 s', 'Sem sinais'], ['Decimais no dia a dia', 'Q6 · Troco em reais', 29, 45, 'Média', '2 min 10 s', 'Sem sinais'], ['Leitura de mapas', 'Q3 · Escala do mapa', 27, 48, 'Média', '1 min 55 s', 'Suspeita'], ['Equações do 1º grau · lista 2', 'Q5 · Resolva 3x + 5 = 20', 25, 52, 'Média', '2 min 20 s', 'Sem sinais'], ['Sistema solar', 'Q1 · Ordem dos planetas', 26, 81, 'Baixa', '1 min 05 s', 'Sem sinais']] as any[]).map(([t, q, n, a, d, tm, s]) => [{ d: [t, q] }, n, { F: a }, d, tm, { b: s, t: s === 'Sem sinais' ? 'neutro' : 'at' }]) }],
    ],
  },
}

/* ------------------------------------------------------------------ 10 · Prova Genial 701 (professor) */
const EST_PG: [string, string, string, number | null, string, string][] = [
  ['Alice Moreira', 'Finalizada', '10,0', 10, '29 min', 'Sem tópicos críticos'],
  ['Bruno Teixeira', 'Finalizada', '9,0', 9, '31 min', 'Porcentagem'],
  ['Camila Rocha', 'Finalizada', '7,0', 7, '36 min', 'Operações com frações'],
  ['Daniel Freitas', 'Finalizada', '6,0', 6, '40 min', 'Porcentagem'],
  ['Eduarda Lima', 'Finalizada', '5,0', 5, '38 min', 'Operações com frações'],
  ['Felipe Nunes', 'Finalizada', '3,0', 3, '22 min', 'Números decimais'],
  ['Giovana Pires', 'Finalizada', '2,0', 2, '18 min', 'Frações equivalentes'],
  ['Manuela Castro', 'Não iniciada', '—', null, '—', 'Não fez a prova'],
]
const QPG: [number, string, string, number, number, string, string, number[]][] = [
  [8, 'EF07MA05 · D21', 'Quanto é 3/4 dividido por 1/2?', 42, 262, '2 min 40 s', 'C', [38, 12, 42, 8]],
  [9, 'EF07MA02 · D28', 'Um produto de R$ 80 teve 25% de desconto. Qual é o novo preço?', 38, 255, '3 min 10 s', 'B', [33, 38, 21, 8]],
  [10, 'EF07MA02 · D28', 'Que porcentagem 18 representa de 60?', 41, 251, '2 min 55 s', 'A', [41, 25, 21, 13]],
  [7, 'EF07MA05 · D21', 'Quanto é 3/5 de 45?', 46, 243, '2 min 30 s', 'D', [25, 17, 12, 46]],
  [6, 'EF07MA04 · D26', 'Qual é o maior: 0,5; 0,45 ou 0,405?', 54, 232, '1 min 50 s', 'A', [54, 29, 9, 8]],
]
const prova: Rel = {
  id: 'prova',
  grupo: 'ativ',
  tipo: 'Prova Genial',
  perfil: 'prof',
  mig: ['Início', 'Relatórios', 'Atividades', 'Prova Genial', 'Frações e decimais'],
  cab: ativCab('Prova Genial', 'file-text', 'Frações e decimais · 18/11', 'Turmas', 'Turma 701', 'Seu acesso: suas turmas'),
  ent: ['Frações e decimais', 'Prova Genial', 'file-text', 'Turma 701 · EM Jardim das Flores · Matemática · 18/11/2026, das 08:00 às 09:00 · 10 questões · criada por Rafael Souza', [['Finalizada', 'suc']]],
  T: {
    'Visão geral': [
      ['kpis', [['Estudantes previstos', '26', null, null, ['Com a prova atribuída']], ['Estudantes que iniciaram', '24', '26', 92, ['Responderam ao menos uma questão']], ['Estudantes que concluíram', '24', '26', 92, ['Enviaram a prova']], ['Questões respondidas', '236', null, null, ['de 240 possíveis · 4 em branco']]]],
      ['row', [{ t: 'V', titulo: 'Histograma de notas', max: 9, leg: [['p1', 'Estudantes por faixa de nota (0 a 10)']], itens: [['0 a 2', 1], ['2 a 4', 5], ['4 a 6', 6], ['6 a 8', 7], ['8 a 10', 5]] }, { t: 'lista', w: 400, titulo: 'Resumo da prova', itens: [['Média de notas', 'Escala de 0 a 10', '5,8'], ['Desempenho médio', 'Em branco conta como erro', '58%'], ['Tempo médio de resolução', 'Duração da prova: 60 min', '34 min'], ['Habilidade TRI média', 'Escala SAEB · nível 4', '228']] }]],
      ['sec', ['Informações gerais']],
      ['seg', [['Engajamento', 'Tópicos'], 'Engajamento']],
      ['tab', { titulo: 'Tabela de engajamento', busca: 'Pesquisar estudante...', pag: ['Mostrando 8 de 26 estudantes', 4], cols: [{ t: 'Estudante', sort: true }, { t: 'Status', w: 140 }, { t: 'Nota', w: 96, al: 'CENTER', sort: true }, { t: 'Questões corretas', w: 150, al: 'CENTER' }, { t: 'Tempo de resolução', w: 160, al: 'CENTER' }, { t: 'Relatório', w: 150 }], rows: EST_PG.map(([n, s, nt, q, t]) => [n, { b: s, t: s === 'Finalizada' ? 'suc' : 'neutro' }, nt, q === null ? '—' : q + ' de 10', t, q === null ? '—' : { lk: 'Ver estudante', ir: 'est' }]) }],
      ['sec', ['Socioeconômico', 'Indicador de Nível Socioeconômico (Inse) do Saeb, calculado pelo Inep.']],
      ['row', [{ t: 'H', titulo: 'Estudantes por nível de NSE', max: 10, wRot: 80, itens: [['Nível II', 3], ['Nível III', 9], ['Nível IV', 8], ['Nível V', 4]] }, { t: 'V', titulo: 'Desempenho médio por nível de NSE', max: 100, pct: true, itens: [['Nível II', 49], ['Nível III', 55], ['Nível IV', 61], ['Nível V', 66]] }, { t: 'lista', w: 320, titulo: 'Perfil dos estudantes', itens: [['Gênero', '13 meninas · 11 meninos'], ['Raça/cor', '54% pardos · 29% brancos · 13% pretos · 4% não declarado'], ['Idade', '12 a 13 anos'], ['Deficiência', '1 estudante com deficiência declarada']] }]],
    ],
    Engajamento: [
      ['kpis', [['Estudantes ativos', '24', '26', 92, ['Fizeram a prova']], ['Tempo médio de resolução', '34 min', null, null, ['Duração da prova: 60 min']], ['Estudantes bloqueados', '0', null, null, ['Nenhum bloqueio nesta prova']], ['Tempo médio por questão', '3 min 24 s', null, null, ['Entre as questões respondidas']]]],
      ['row', [{ t: 'status', titulo: 'Progresso na atividade', sub: 'Número de estudantes em cada etapa da prova.', partes: [['suc', 'Finalizaram', 92, 24], ['at', 'Em andamento', 0, 0], ['n300', 'Não iniciaram', 8, 2]] }, { t: 'V', titulo: 'Tempo de resolução', max: 14, itens: [['Até 19 min', 2], ['20 a 29 min', 5], ['30 a 39 min', 11], ['40 a 60 min', 6]] }]],
    ],
    Aprendizagem: [
      ['kpis', [['Média de notas', '5,8', null, null, ['Escala de 0 a 10']], ['Estudantes com aprendizado adequado', '50%', '60%', 83, ['12 de 24 estudantes']], ['Desempenho médio', '58%', null, null, ['Em branco conta como erro']], ['Habilidade TRI média', '228', null, null, ['Escala SAEB · nível 4']]]],
      ['row', [{ t: 'prof', titulo: 'Rubricas de proficiência', dist: [['Avançado', 13, 3], ['Proficiente', 37, 9], ['Básico', 33, 8], ['Insuficiente', 17, 4]], rodape: '24 estudantes que fizeram a prova. Meta: 60% em Proficiente + Avançado.' }, { t: 'H', w: 400, titulo: 'Escala de proficiência (SAEB)', max: 10, wRot: 70, itens: [['Nível 2', 2], ['Nível 3', 5], ['Nível 4', 8], ['Nível 5', 6], ['Nível 6', 3]], link: 'O que cada nível significa' }]],
      ['tab', { titulo: 'Ranking de estudantes', busca: 'Pesquisar estudante...', pag: ['Mostrando 8 de 26 estudantes', 4], cols: [{ t: 'Posição', w: 88 }, { t: 'Estudante', sort: true }, { t: 'Nota', w: 88, al: 'CENTER', sort: true }, { t: 'Proficiência', w: 160 }, { t: 'Onde apoiar', w: 240 }], rows: EST_PG.map(([n, , nt, q, , o], i) => [q === null ? '—' : i + 1 + 'º', n, nt, { p: q === null ? 'Não avaliado' : faixa(q * 10) }, o]) }],
      ['row', [{ t: 'hab', titulo: 'Ranking de tópicos', itens: [['Tópico', 'Números decimais', 74, '72 respostas'], ['Tópico', 'Frações equivalentes', 58, '24 respostas'], ['Tópico', 'Operações com frações', 52, '96 respostas'], ['Tópico', 'Porcentagem', 50, '72 respostas']] }, { t: 'hab', titulo: 'Descritores prioritários (SAEB)', link: 'Sugestões de retomada no Assistente', linkIc: 'sparkles', itens: [['D28', 'Problemas com porcentagem', 50, '3 questões'], ['D21', 'Representações de um racional', 55, '4 questões'], ['D26', 'Problemas com decimais', 74, '3 questões']] }]],
      ['tab', { titulo: 'Questões mais erradas', busca: 'Pesquisar questão...', desc: 'Clique numa questão para ver a análise detalhada: distribuição das respostas, gabarito e a resposta de cada estudante.', pag: ['Mostrando 5 de 10 questões', 2], leg: [['suc', 'Alternativa correta'], ['linha', 'Outras alternativas']], cols: [{ t: 'Questão', w: 80 }, { t: 'Habilidade · descritor', w: 150 }, { t: 'Enunciado' }, { t: 'Taxa de acerto', w: 120, al: 'CENTER', sort: true }, { t: 'Dificuldade (SAEB)', w: 140, al: 'CENTER' }, { t: 'Tempo médio', w: 112, al: 'CENTER' }, { t: 'Respostas (A · B · C · D)', w: 210 }], rows: QPG.map(([q, h, e, a, d, t, g, alt]) => ['Q' + q, h, { wrap: e }, { F: a }, String(d), t, { alt, gab: g }]) }],
    ],
  },
}

/* ------------------------------------------------------------------ 11 · Desafio 801 (coordenadora) */
const E801: [string, string, number, number, string, number, number][] = [['Pedro Lins', 'Nível 5', 412, 31, '42 min', 88, 86], ['Nicolas Prado', 'Nível 4', 380, 28, '39 min', 80, 78], ['Ana Júlia Rocha', 'Nível 4', 352, 27, '37 min', 76, 72], ['Mateus Pinto', 'Nível 3', 298, 24, '33 min', 64, 63], ['Sara Lopes', 'Nível 3', 276, 22, '30 min', 58, 61], ['Lucas Ferreira', 'Nível 3', 240, 19, '25 min', 50, 45], ['Vitor Hugo Dias', 'Nível 2', 188, 15, '21 min', 40, 38], ['Lorena Cruz', 'Nível 1', 92, 8, '12 min', 22, 24]]
const TOP_DES: any[] = [['Tópico', 'Porcentagem em descontos', 51, '120 respostas'], ['Tópico', 'Porcentagem de um valor', 63, '160 respostas'], ['Tópico', 'Aumentos sucessivos', 72, '80 respostas']]
const desafio: Rel = {
  id: 'desafio',
  grupo: 'ativ',
  tipo: 'Desafio',
  perfil: 'coord',
  mig: ['Início', 'Relatórios', 'Atividades', 'Desafio', 'Porcentagem no cotidiano'],
  cab: ativCab('Desafio', 'zap', 'Porcentagem no cotidiano · 24/11', 'Onde', 'Turma 801', 'Seu acesso: EM Jardim das Flores'),
  ent: ['Porcentagem no cotidiano', 'Desafio', 'zap', 'Turma 801 · EM Jardim das Flores · Matemática · 24/11/2026 · criado por Rafael Souza', [['Finalizada', 'suc']]],
  T: {
    'Visão geral': [
      ['sec', ['Desempenho × engajamento', 'Cada ponto é um estudante: desempenho no desafio × interações realizadas.']],
      quadB('Desempenho × engajamento', E801.map((r) => ({ x: r[5], y: r[6], nome: r[0].split(' ')[0] })), 54, 60, 'Interações realizadas (relativo à turma, %)', ['Pedro', 'Lorena'], ['4 estudantes', '1 estudante', '0 estudantes', '3 estudantes']),
      ['tab', { titulo: 'Tabela de engajamento', busca: 'Pesquisar estudante...', pag: ['Mostrando 8 de 26 estudantes', 4], cols: [{ t: 'Estudante', sort: true }, { t: 'Nível alcançado', w: 150 }, { t: 'Pontos', w: 110, al: 'CENTER', sort: true }, { t: 'Interações de aprendizado', w: 190, al: 'CENTER' }, { t: 'Tempo de estudo', w: 150, al: 'CENTER' }, { t: 'Relatório', w: 140 }], rows: E801.map(([n, nv, p, i, t]) => [n, { b: nv, t: /5/.test(nv) ? 'av' : /4/.test(nv) ? 'suc' : /3/.test(nv) ? 'at' : 'cr' }, p, i, t, { lk: 'Ver estudante' }]) }],
    ],
    Engajamento: [
      ['kpis', [['Estudantes ativos', '20', '26', 77, ['fizeram o desafio']], ['Média de interações realizadas', '24', '40', 60, ['por estudante ativo']]]],
      ['row', [progresso(20, 0, 6, 26), { t: 'hab', titulo: 'Ranking de tópicos', itens: TOP_DES }]],
      ['tab', { titulo: 'Ranking de estudantes', busca: 'Pesquisar estudante...', pag: ['Mostrando 8 de 20 estudantes', 3], cols: [{ t: 'Posição', w: 96 }, { t: 'Estudante', sort: true }, { t: 'Pontos obtidos', w: 170, al: 'CENTER', sort: true }, { t: 'Proficiência', w: 180 }], rows: E801.map((r, i) => [i + 1 + 'º', r[0], r[2], { p: faixa(r[6]) }]) }],
    ],
    Aprendizagem: [
      ['kpis', [['Estudante com aprendizado adequado', '55%', '60%', 92, ['11 de 20 estudantes']], ['Taxa de acurácia', '63%', null, null, ['Acertos ÷ respostas']]]],
      ['row', [{ t: 'prof', titulo: 'Rubricas de proficiência', dist: R4([15, 3, 40, 8, 30, 6, 15, 3]), rodape: '20 estudantes que fizeram o desafio. Meta: 60% em Proficiente + Avançado.' }, { t: 'hab', w: 400, titulo: 'Ranking de tópicos', itens: TOP_DES }]],
      ['tab', { titulo: 'Ranking de estudantes', busca: 'Pesquisar estudante...', pag: ['Mostrando 8 de 20 estudantes', 3], cols: [{ t: 'Posição', w: 96 }, { t: 'Estudante', sort: true }, { t: 'Nível alcançado', w: 160 }, { t: 'Desempenho', w: 140, al: 'CENTER', sort: true }, { t: 'Proficiência', w: 180 }], rows: E801.map((r, i) => [i + 1 + 'º', r[0], r[1], { F: r[6] }, { p: faixa(r[6]) }]) }],
    ],
  },
}

/* ------------------------------------------------------------------ 12 · Sala de Aula Invertida 702 (professor) */
const E702: [string, string, number, string, number, number | null][] = [['Olívia Santana', 'Finalizada', 18, '1h 05min', 80, 74], ['Gabriel Rocha', 'Finalizada', 16, '58 min', 72, 68], ['Kauã Ferreira', 'Finalizada', 15, '55 min', 68, 66], ['Renata Viana', 'Finalizada', 14, '50 min', 62, 55], ['Heloísa Prado', 'Finalizada', 12, '44 min', 55, 52], ['Isabela Duarte', 'Em progresso', 8, '31 min', 38, 30], ['Lara Monteiro', 'Em progresso', 5, '20 min', 25, 34], ['Enzo Martins', 'Não iniciada', 0, '—', 0, null]]
const sala: Rel = {
  id: 'sala',
  grupo: 'ativ',
  tipo: 'Sala de Aula Invertida',
  perfil: 'prof',
  mig: ['Início', 'Relatórios', 'Atividades', 'Sala de Aula Invertida', 'Proporção'],
  cab: ativCab('Sala de Aula Invertida', 'book-open', 'Proporção · 19/11', 'Turmas', 'Turma 702', 'Seu acesso: suas turmas'),
  ent: ['Proporção', 'Sala de Aula Invertida', 'book-open', 'Turma 702 · EM Jardim das Flores · Matemática · 19/11/2026 · criada por Rafael Souza', [['Finalizada', 'suc']]],
  T: {
    'Visão geral': [
      ['sec', ['Desempenho × engajamento', 'Cada ponto é um estudante.']],
      quadB('Desempenho × engajamento', E702.filter((r) => r[5] !== null).map((r) => ({ x: r[4], y: r[5] as number, nome: r[0].split(' ')[0] })), 55, 60, 'Interações realizadas (relativo à turma, %)', ['Olívia', 'Isabela'], ['3 estudantes', '2 estudantes', '0 estudantes', '2 estudantes']),
      ['sec', ['Informações gerais']],
      ['seg', [['Engajamento', 'Tópicos'], 'Engajamento']],
      ['tab', { titulo: 'Tabela de engajamento', busca: 'Pesquisar estudante...', pag: ['Mostrando 8 de 25 estudantes', 4], cols: [{ t: 'Estudante', sort: true }, { t: 'Status', w: 150 }, { t: 'Interações de aprendizado', w: 200, al: 'CENTER', sort: true }, { t: 'Tempo de estudo', w: 160, al: 'CENTER' }, { t: 'Relatório', w: 140 }], rows: E702.map(([n, s, i, t]) => [n, { b: s, t: s === 'Finalizada' ? 'suc' : s === 'Em progresso' ? 'inf' : 'neutro' }, i, t, s === 'Não iniciada' ? '—' : { lk: 'Ver estudante' }]) }],
    ],
    Engajamento: [
      ['kpis', [['Estudantes ativos', '17', '25', 68, ['iniciaram a aula invertida']], ['Média de interações realizadas', '12', null, null, ['por estudante ativo']]]],
      ['row', [progresso(14, 3, 8, 25)]],
    ],
    Aprendizagem: [
      ['kpis', [['Estudantes com aprendizado adequado', '41%', '60%', 68, ['7 de 17 estudantes']], ['Desempenho médio', '54%', null, null, ['Acertos nas questões da aula']]]],
      ['row', [{ t: 'prof', titulo: 'Rubricas de proficiência', dist: R4([6, 1, 35, 6, 41, 7, 18, 3]), rodape: '17 estudantes que fizeram a atividade. Meta: 60% em Proficiente + Avançado.' }, { t: 'hab', w: 400, titulo: 'Ranking de tópicos', itens: [['Tópico', 'Grandezas diretamente proporcionais', 61, '68 respostas'], ['Tópico', 'Regra de três simples', 55, '85 respostas'], ['Tópico', 'Grandezas inversamente proporcionais', 44, '51 respostas']] }]],
      ['tab', { titulo: 'Ranking de estudantes', busca: 'Pesquisar estudante...', pag: ['Mostrando 7 de 17 estudantes', 3], cols: [{ t: 'Posição', w: 96 }, { t: 'Estudante', sort: true }, { t: 'Desempenho', w: 160, al: 'CENTER', sort: true }, { t: 'Proficiência', w: 180 }], rows: E702.filter((r) => r[5] !== null).sort((a, b) => (b[5] as number) - (a[5] as number)).map((r, i) => [i + 1 + 'º', r[0], { F: r[5] }, { p: faixa(r[5] as number) }]) }],
    ],
  },
}

/* ------------------------------------------------------------------ 13 · Projeto (coordenadora) */
const EP: [string, string, string, string, string, number, string, number | null][] = [['Ana Clara Ribeiro', '501', 'Finalizada', '20/11', '18/11', 44, '9h', 88], ['Lucas Andrade', '502', 'Finalizada', '21/11', '19/11', 38, '8h', 76], ['Beatriz Nunes', '501', 'Finalizada', '21/11', '20/11', 35, '7h', 70], ['João Pedro Silva', '501', 'Finalizada', '22/11', '20/11', 31, '6h', 64], ['Maria Eduarda Costa', '502', 'Finalizada', '24/11', '22/11', 27, '5h', 58], ['Gabriel Lima', '502', 'Finalizada', '24/11', '23/11', 22, '4h', 46], ['Sofia Martins', '501', 'Em progresso', '—', '21/11', 14, '3h', 40], ['Heitor Souza', '502', 'Não iniciada', '—', '—', 0, '—', null]]
const projeto: Rel = {
  id: 'projeto',
  grupo: 'ativ',
  tipo: 'Projeto',
  perfil: 'coord',
  mig: ['Início', 'Relatórios', 'Atividades', 'Projeto', 'Horta escolar'],
  abas: ['Visão geral', 'Projetos enviados', 'Engajamento', 'Aprendizagem'],
  cab: ativCab('Projeto', 'flag', 'Horta escolar', 'Onde', 'Turmas 501 e 502', 'Seu acesso: EM Jardim das Flores'),
  ent: ['Horta escolar', 'Projeto', 'flag', 'Turmas 501 e 502 · EM Jardim das Flores · Ciências · 01/09 a 30/11/2026 · criado por Fernanda Lima', [['Em progresso', 'inf']]],
  T: {
    'Visão geral': [
      ['sec', ['Desempenho × engajamento', 'Cada ponto é um estudante.']],
      quadB('Desempenho × engajamento', EP.filter((r) => r[7] !== null).map((r) => ({ x: Math.round(r[5] * 2), y: r[7] as number, nome: r[0].split(' ')[0] })), 62, 60, 'Interações realizadas (relativo às turmas, %)', ['Ana', 'Sofia'], ['3 estudantes', '0 estudantes', '0 estudantes', '4 estudantes']),
      ['sec', ['Informações gerais']],
      ['seg', [['Engajamento', 'Tópicos'], 'Engajamento']],
      ['tab', { titulo: 'Tabela de engajamento', busca: 'Pesquisar estudante...', pag: ['Mostrando 8 de 53 estudantes', 7], cols: [{ t: 'Estudante', sort: true }, { t: 'Turma', w: 80 }, { t: 'Status', w: 140 }, { t: 'Data de envio', w: 120, al: 'CENTER' }, { t: 'Conclusão dos quizzes', w: 170, al: 'CENTER' }, { t: 'Interações de aprendizado', w: 180, al: 'CENTER' }, { t: 'Tempo de estudo', w: 130, al: 'CENTER' }], rows: EP.map(([n, t, s, e, q, i, tm]) => [n, t, { b: s, t: stTom(s) }, e, q, i, tm]) }],
    ],
    'Projetos enviados': [
      ['kpis', [['Projetos enviados', '40', '53', 75, ['dos estudantes das turmas']], ['Avaliados', '31', null, null, ['78% dos enviados']], ['Não avaliados', '9', null, null, ['aguardando a professora']], ['Arquivos enviados', '126', null, null, ['fotos, relatórios e vídeos']]]],
      ['row', [{ t: 'lista', titulo: 'Detalhes do projeto', itens: [['Nome', 'Horta escolar'], ['Tipo de projeto', 'Investigação em grupo'], ['Enunciado', 'Planejem, cultivem e registrem uma horta na escola: escolham as espécies, acompanhem o crescimento e apresentem o que aprenderam sobre ciclos de vida.']] }, { t: 'lista', w: 420, titulo: 'Perguntas feitas ao aluno', itens: [['O que você aprendeu sobre o ciclo de vida das plantas?', 'Resposta aberta'], ['Qual foi a maior dificuldade do grupo?', 'Resposta aberta'], ['Como você avalia a sua participação?', 'Autoavaliação de 1 a 5']] }]],
      ['tab', { titulo: 'Projetos enviados', busca: 'Pesquisar estudante...', pag: ['Mostrando 6 de 40 projetos', 7], cols: [{ t: 'Estudante', sort: true }, { t: 'Turma', w: 80 }, { t: 'Enviado em', w: 110, al: 'CENTER' }, { t: 'Arquivos enviados', w: 150, al: 'CENTER' }, { t: 'Autoavaliação', w: 130, al: 'CENTER' }, { t: 'Nível de proficiência', w: 170 }, { t: 'Status', w: 140 }, { t: 'Projeto', w: 120 }], rows: ([['Ana Clara Ribeiro', '501', '20/11', 4, '5 de 5', 'Avançado', 'Avaliado'], ['Lucas Andrade', '502', '21/11', 3, '4 de 5', 'Proficiente', 'Avaliado'], ['Beatriz Nunes', '501', '21/11', 3, '4 de 5', 'Proficiente', 'Avaliado'], ['João Pedro Silva', '501', '22/11', 2, '4 de 5', 'Proficiente', 'Avaliado'], ['Maria Eduarda Costa', '502', '24/11', 3, '3 de 5', null, 'Não avaliado'], ['Gabriel Lima', '502', '24/11', 2, '3 de 5', null, 'Não avaliado']] as any[]).map(([n, t, e, a, au, p, s]) => [n, t, e, a, au, p ? { p } : { m: 'Aguardando' }, { b: s, t: stTom(s) }, { lk: 'Ver projeto' }]) }],
    ],
    Engajamento: [
      ['kpis', [['Estudantes ativos', '46', '53', 87, ['iniciaram o projeto']], ['Estudantes que finalizaram', '40', '53', 75, ['enviaram o projeto']], ['Média de interações realizadas', '26', '40', 65, ['por estudante ativo']]]],
      ['row', [progresso(40, 6, 7, 53), { t: 'hab', titulo: 'Ranking de tópicos', itens: [['Tópico', 'Ciclo de vida das plantas', 71, '212 respostas'], ['Tópico', 'Solo e nutrientes', 63, '180 respostas'], ['Tópico', 'Água e irrigação', 55, '150 respostas']] }]],
    ],
    Aprendizagem: [
      ['kpis', [['Estudante com aprendizado adequado', '58%', '60%', 97, ['23 de 40 estudantes']], ['Taxa de acurácia', '64%', null, null, ['Acertos nos quizzes ÷ respostas']]]],
      ['row', [{ t: 'prof', titulo: 'Rubricas de proficiência', dist: R4([15, 6, 43, 17, 30, 12, 12, 5]), rodape: '40 estudantes que enviaram o projeto. Meta: 60% em Proficiente + Avançado.' }, { t: 'lista', w: 420, titulo: 'Questões mais erradas', itens: [['Qual nutriente as folhas amareladas indicam que falta?', 'Solo e nutrientes · 52 respostas', { F: 38 }], ['Quantas vezes por semana regar a alface?', 'Água e irrigação · 50 respostas', { F: 46 }], ['O que é germinação?', 'Ciclo de vida das plantas · 53 respostas', { F: 58 }]] }]],
      ['tab', { titulo: 'Ranking de estudantes', busca: 'Pesquisar estudante...', pag: ['Mostrando 7 de 40 estudantes', 6], cols: [{ t: 'Posição', w: 96 }, { t: 'Estudante', sort: true }, { t: 'Turma', w: 96 }, { t: 'Desempenho', w: 150, al: 'CENTER', sort: true }, { t: 'Proficiência', w: 180 }], rows: EP.filter((r) => r[7] !== null).map((r, i) => [i + 1 + 'º', r[0], r[1], { F: r[7] }, { p: faixa(r[7] as number) }]) }],
    ],
  },
}

/* ------------------------------------------------------------------ 14 · Raio-X (gestora) */
const ER: [string, string, string, string, number | null][] = [['Beatriz Almeida', 'EM Castro Alves', 'Finalizada', '38 min', 19], ['Larissa Campos', 'EM Cecília Meireles', 'Finalizada', '41 min', 18], ['Alice Moreira', 'EM Jardim das Flores', 'Finalizada', '35 min', 18], ['Pietro Lacerda', 'EM Machado de Assis', 'Finalizada', '44 min', 16], ['Camila Rocha', 'EM Jardim das Flores', 'Finalizada', '46 min', 13], ['Kevin Matos', 'EM Paulo Freire', 'Finalizada', '39 min', 9], ['Giovana Pires', 'EM Jardim das Flores', 'Finalizada', '28 min', 5], ['Manuela Castro', 'EM Jardim das Flores', 'Não iniciada', '—', null]]
const raiox: Rel = {
  id: 'raiox',
  grupo: 'ativ',
  tipo: 'Raio-X',
  perfil: 'gestora',
  mig: ['Início', 'Relatórios', 'Atividades', 'Raio-X', 'Matemática · 7º ano'],
  cab: ativCab('Raio-X', 'target', 'Matemática · 7º ano · 2ª aplicação', 'Onde', 'Rede Municipal de Nova Esperança'),
  ent: ['Raio-X de Matemática · 7º ano', 'Raio-X', 'target', 'Rede Municipal de Nova Esperança · 2ª aplicação · 06 a 10/10/2026 · 18 escolas · 612 estudantes · 20 questões', [['Finalizada', 'suc']]],
  T: {
    'Visão geral': [
      ['row', [{ t: 'V', titulo: 'Histograma de acertos', max: 220, leg: [['p1', 'Estudantes por faixa de acertos (de 20 questões)']], itens: [['0 a 4', 38], ['5 a 8', 96], ['9 a 12', 188], ['13 a 16', 201], ['17 a 20', 89]] }]],
      ['sec', ['Informações gerais']],
      ['seg', [['Engajamento', 'Tópicos'], 'Engajamento']],
      ['tab', { titulo: 'Tabela de engajamento', busca: 'Pesquisar estudante...', pag: ['Mostrando 8 de 612 estudantes', 77], cols: [{ t: 'Estudante', sort: true }, { t: 'Escola', w: 220 }, { t: 'Status', w: 140 }, { t: 'Tempo de resolução', w: 170, al: 'CENTER' }, { t: 'Acertos', w: 130, al: 'CENTER', sort: true }], rows: ER.map(([n, e, s, t, a]) => [n, e, { b: s, t: stTom(s) }, t, a === null ? '—' : a + ' de 20']) }],
      topicos('Tabela de aprendizagem (tópicos)', [['Operações com frações', 'Matemática', '96h', 2448, 1028], ['Porcentagem', 'Matemática', '81h', 1836, 864], ['Números decimais', 'Matemática', '88h', 2448, 1640], ['Equações do 1º grau', 'Matemática', '74h', 1836, 1065], ['Ângulos', 'Matemática', '52h', 1224, 808]], ['Mostrando 5 de 8 tópicos', 2]),
    ],
    Engajamento: [
      ['kpis', [['Raio-X finalizados', '574', '612', 94, ['aplicados no 7º ano da rede']], ['Estudantes que finalizaram', '94%', null, null, ['574 de 612 estudantes']]]],
      ['row', [progresso(574, 12, 26, 612)]],
    ],
    Aprendizagem: [
      ['kpis', [['Média de acertos', '11,8', '20', 59, ['questões certas por estudante']], ['Estudante com aprendizado adequado', '52%', '60%', 87, ['298 de 574 estudantes']]]],
      ['row', [{ t: 'prof', titulo: 'Rubricas de proficiência', dist: R4([11, 63, 41, 235, 33, 189, 15, 87]), rodape: '574 estudantes que finalizaram. Meta: 60% em Proficiente + Avançado.' }, { t: 'hab', w: 420, titulo: 'Ranking de tópicos', itens: [['Tópico', 'Operações com frações', 42, '2.448 respostas'], ['Tópico', 'Porcentagem', 47, '1.836 respostas'], ['Tópico', 'Equações do 1º grau', 58, '1.836 respostas'], ['Tópico', 'Números decimais', 67, '2.448 respostas']] }]],
      ['tab', { titulo: 'Ranking de estudantes', busca: 'Pesquisar estudante...', pag: ['Mostrando 7 de 574 estudantes', 82], cols: [{ t: 'Posição', w: 96 }, { t: 'Estudante', sort: true }, { t: 'Escola', w: 240 }, { t: 'Acertos', w: 130, al: 'CENTER', sort: true }, { t: 'Proficiência', w: 180 }], rows: ER.filter((r) => r[4] !== null).map((r, i) => [i + 1 + 'º', r[0], r[1], r[4] + ' de 20', { p: faixa((r[4] as number) * 5) }]) }],
    ],
  },
}

/* ------------------------------------------------------------------ 15 · Campeonato (coordenadora) */
const EC: [string, string, number, number, number, number, string, number, number][] = [['Alice Moreira', '701', 41, 33, 8, 58, '14h', 82, 96], ['Pedro Lins', '801', 52, 39, 13, 49, '11h', 90, 94], ['Nicolas Prado', '801', 36, 26, 10, 47, '11h', 70, 91], ['Bruno Teixeira', '701', 33, 23, 10, 51, '12h', 66, 89], ['Thales Moura', '901', 38, 24, 14, 44, '10h', 72, 88], ['Olívia Santana', '702', 29, 17, 12, 40, '9h', 60, 84], ['Kauã Ferreira', '702', 27, 14, 13, 36, '8h', 56, 81], ['Enzo Martins', '702', 3, 0, 3, 6, '1h', 8, 34]]
const camp: Rel = {
  id: 'camp',
  grupo: 'ativ',
  tipo: 'Campeonato',
  perfil: 'coord',
  mig: ['Início', 'Relatórios', 'Atividades', 'Campeonato', 'Campeonato de Matemática'],
  cab: ativCab('Campeonato', 'trophy', 'Campeonato de Matemática · 2º semestre', 'Onde', 'EM Jardim das Flores', 'Seu acesso: EM Jardim das Flores'),
  ent: ['Campeonato de Matemática', 'Campeonato', 'trophy', 'EM Jardim das Flores · 2º semestre de 2026 · 01/09 a 05/12 · batalhas entre estudantes', [['Em progresso', 'inf']]],
  T: {
    'Visão geral': [
      ['sec', ['Desempenho × engajamento', 'Cada ponto é um estudante: acerto nas batalhas × interações realizadas.']],
      quadB('Desempenho × engajamento', EC.map((r) => ({ x: r[7], y: r[8], nome: r[0].split(' ')[0] })), 66, 60, 'Interações realizadas (relativo à escola, %)', ['Pedro', 'Enzo'], ['4 estudantes', '0 estudantes', '3 estudantes', '1 estudante']),
      ['sec', ['Informações gerais']],
      ['seg', [['Engajamento', 'Tópicos'], 'Engajamento']],
      ['tab', { titulo: 'Tabela de engajamento', busca: 'Pesquisar estudante...', pag: ['Mostrando 8 de 170 estudantes', 22], cols: [{ t: 'Estudante', sort: true }, { t: 'Turma', w: 80 }, { t: 'Batalhas realizadas', w: 160, al: 'CENTER', sort: true }, { t: 'Vitórias', w: 104, al: 'CENTER' }, { t: 'Derrotas', w: 104, al: 'CENTER' }, { t: 'Interações de aprendizado', w: 180, al: 'CENTER' }, { t: 'Tempo de estudo', w: 130, al: 'CENTER' }], rows: EC.map((r) => r.slice(0, 7) as Cel[]) }],
    ],
    Engajamento: [
      ['kpis', [['Estudantes ativos', '170', '230', 74, ['jogaram ao menos uma batalha']], ['Média de batalhas por estudante', '28', null, null, ['4.812 batalhas no período']], ['Média de interações realizadas', '35', '40', 88, ['por estudante ativo']]]],
      ['row', [progresso(152, 18, 60, 230), { t: 'H', titulo: 'Ranking de batalhas (tópicos)', max: 1200, wRot: 170, itens: [['Números decimais', 1104], ['Porcentagem', 930], ['Frações equivalentes', 844], ['Equações', 712], ['Potências', 611]] }]],
      ['tab', { titulo: 'Ranking de batalhas (estudantes)', busca: 'Pesquisar estudante...', pag: ['Mostrando 8 de 170 estudantes', 22], cols: [{ t: 'Posição', w: 96 }, { t: 'Estudante', sort: true }, { t: 'Turma', w: 96 }, { t: 'Vitórias', w: 120, al: 'CENTER', sort: true }, { t: 'Derrotas', w: 120, al: 'CENTER' }, { t: '% de vitórias', w: 200 }], rows: EC.map((r, i) => [i + 1 + 'º', r[0], r[1], r[3], r[4], { tr: Math.round((r[3] * 100) / r[2]), tx: Math.round((r[3] * 100) / r[2]) + '%', meta: 60 }]) }],
    ],
    Aprendizagem: [
      ['kpis', [['Estudante com aprendizado adequado', '61%', '60%', 102, ['104 de 170 estudantes']], ['Taxa de acurácia', '63%', null, null, ['Acertos nas batalhas ÷ respostas']]]],
      ['row', [{ t: 'prof', titulo: 'Rubricas de proficiência', dist: R4([16, 27, 45, 77, 27, 46, 12, 20]), rodape: '170 estudantes que jogaram. Meta: 60% em Proficiente + Avançado.' }]],
      ['tab', { titulo: 'Ranking de estudantes', busca: 'Pesquisar estudante...', pag: ['Mostrando 8 de 170 estudantes', 22], cols: [{ t: 'Posição', w: 96 }, { t: 'Estudante', sort: true }, { t: 'Vitórias', w: 120, al: 'CENTER', sort: true }, { t: 'Derrotas', w: 120, al: 'CENTER' }, { t: '% de vitórias', w: 140, al: 'CENTER' }, { t: 'Proficiência', w: 180 }], rows: EC.map((r, i) => [i + 1 + 'º', r[0], r[3], r[4], Math.round((r[3] * 100) / r[2]) + '%', { p: faixa(r[8]) }]) }],
    ],
  },
}

/* ------------------------------------------------------------------ 16 · Redação (coordenadora · BI) */
const redacao: Rel = {
  id: 'redacao',
  grupo: 'ativ',
  tipo: 'Redação',
  perfil: 'coord',
  mig: ['Início', 'Relatórios', 'Atividades', 'Redação', 'Todas as propostas'],
  cab: ativCab('Redação', 'pencil', 'Todas as propostas', 'Onde', 'EM Jardim das Flores', 'Seu acesso: EM Jardim das Flores'),
  ent: ['Redações · todas as propostas', 'Redação', 'pencil', 'EM Jardim das Flores · 6º ao 9º ano · 8 propostas · correção por 5 critérios (0 a 200 cada)'],
  T: {
    'Visão geral': [
      ['kpis', [['Redações iniciadas', '341', null, null, ['no recorte selecionado']], ['Redações enviadas', '312', null, null, ['enviadas ou corrigidas']], ['Taxa de envio', '91%', null, null, ['enviadas ÷ iniciadas']], ['Nota média', '612', '1.000', 61, ['das redações enviadas']]]],
      ['row', [{ t: 'V', titulo: 'Distribuição de notas', max: 150, itens: [['Até 399', 41], ['400 a 599', 109], ['600 a 799', 134], ['800 a 1.000', 28]] }, { t: 'status', w: 420, titulo: 'Distribuição de proficiência', sub: '312 redações enviadas.', partes: [['av', 'Avançado', 9, 28], ['suc', 'Proficiente', 43, 134], ['at', 'Básico', 35, 109], ['cr', 'Insuficiente', 13, 41]] }]],
      ['tab', { titulo: 'Ranking de temas', busca: 'Pesquisar tema...', desc: 'Clique num tema para abrir o enunciado e os textos motivadores.', pag: ['Mostrando 5 de 8 temas', 2], cols: [{ t: 'Tema', sort: true }, { t: 'Tipo', w: 150 }, { t: 'Data', w: 96, al: 'CENTER' }, { t: 'Iniciadas', w: 110, al: 'CENTER' }, { t: 'Enviadas', w: 110, al: 'CENTER' }, { t: 'Nota média', w: 130, al: 'CENTER', sort: true }], rows: ([['Carta ao prefeito', 'Carta argumentativa', '10/10', 56, 52, 642], ['O papel da escola na comunidade', 'Dissertativa', '07/11', 46, 43, 634], ['Resenha de filme', 'Resenha', '12/09', 38, 35, 618], ['Fake news nas redes sociais', 'Dissertativa', '24/10', 42, 39, 601], ['Desafios da mobilidade urbana', 'Dissertativa', '21/11', 49, 42, 588]] as any[]).map(([t, ti, d, i, e, n]) => [t, ti, d, i, e, { M: Math.round(n / 10), s: String(n), meta: 60 }]) }],
    ],
    Engajamento: [
      ['kpis', [['Estudantes que iniciaram', '132', '177', 75, ['6º ao 9º ano']], ['Redações totais', '341', null, null, ['iniciadas no período']], ['Redações enviadas', '312', null, null, ['finalizadas e enviadas']], ['Taxa de envio', '91%', null, null, ['enviadas ÷ iniciadas']]]],
      ['row', [{ t: 'L', titulo: 'Engajamento diário', rotX: SEM, max: 60, leg: [['p1', 'Redações iniciadas por semana']], series: [['Iniciadas', [12, 18, 41, 22, 15, 38, 46, 27], 'p1']] }, { t: 'H', titulo: 'Redações enviadas por ano escolar', max: 120, wRot: 80, itens: [['6º ano', 52], ['7º ano', 61], ['8º ano', 93], ['9º ano', 106]] }]],
      ['tab', { titulo: 'Ranking de estudantes em redação', busca: 'Pesquisar estudante...', pag: ['Mostrando 6 de 132 estudantes', 22], cols: [{ t: 'Estudante', sort: true }, { t: 'Turma', w: 96 }, { t: 'Iniciadas', w: 120, al: 'CENTER' }, { t: 'Enviadas', w: 120, al: 'CENTER', sort: true }, { t: 'Nota média', w: 140, al: 'CENTER', sort: true }], rows: ([['Bianca Rezende', '901', 4, 4, 820], ['Thales Moura', '901', 4, 4, 760], ['Sabrina Lopes', '901', 3, 3, 690], ['Lucas Mendes', '902', 4, 3, 650], ['Júlia Castro', '902', 3, 3, 600], ['Laís Fontes', '901', 3, 2, 380]] as any[]).map(([n, t, i, e, nt]) => [n, t, i, e, { M: Math.round(nt / 10), s: String(nt), meta: 60 }]) }],
    ],
    Aprendizagem: [
      ['kpis', [['Nota média geral', '612', '1.000', 61, ['escala de 0 a 1.000']], ['Melhor critério', 'C1 · 64%', null, null, ['Norma culta']], ['Critério mais frágil', 'C3 · 58%', null, null, ['Seleção e organização de argumentos']]]],
      ['row', [{ t: 'V', titulo: 'Desempenho por critério de avaliação', max: 100, pct: true, leg: [['p1', 'Aproveitamento do critério (%)']], itens: [['C1', 64], ['C2', 61], ['C3', 58], ['C4', 62], ['C5', 62]] }, pilhas('Distribuição por rubrica · ano escolar', [['6º ano', [6, 40, 38, 16, 0]], ['7º ano', [7, 41, 37, 15, 0]], ['8º ano', [12, 46, 31, 11, 0]], ['9º ano', [10, 44, 34, 12, 0]]])]],
      ['tab', { titulo: 'Ranking de critérios', busca: 'Pesquisar critério...', cols: [{ t: 'Critério', sort: true }, { t: 'Média (0 a 200)', w: 160, al: 'CENTER' }, { t: 'Aproveitamento', w: 220 }], rows: ([['C1 · Domínio da norma culta', 128, 64], ['C4 · Coesão textual', 124, 62], ['C5 · Proposta de intervenção', 123, 62], ['C2 · Compreensão da proposta', 121, 61], ['C3 · Seleção e organização de argumentos', 116, 58]] as any[]).map(([c, m, p]) => [c, m, { tr: p, tx: p + '%', meta: 60 }]) }],
    ],
  },
}

/* ------------------------------------------------------------------ 17 · Olimpíadas (gestora) */
const KPI_OLI: Kpi[] = [['Participantes', '1.920', null, null, ['Estudantes com pontos válidos']], ['Pontuação do líder', '1.240', null, null, ['pontos · Beatriz Almeida (Astra)']], ['Pontos distribuídos', '612.000', null, null, ['Volume total da olimpíada']], ['Média de pontos', '319', null, null, ['por participante']]]
export const OLI_SEG = ['Ranking das Nações', 'Escolas', 'Turma', 'Ano escolar']
export const OLI_VISOES: Record<string, Item[]> = {
  'Ranking das Nações': [
    ['podio', [[2, 'Natuur', '640 participantes', '205.900 pontos', 200], [1, 'Astra', '650 participantes', '214.300 pontos', 230], [3, 'Yugen', '630 participantes', '191.800 pontos', 180]]],
    ['tab', { titulo: 'Ranking das Nações', busca: 'Pesquisar', pag: ['Mostrando 3 de 3 nações', 1], cols: [{ t: 'Posição', w: 120 }, { t: 'Nação' }, { t: 'Participantes', w: 200, al: 'CENTER' }, { t: 'Pontos', w: 200, al: 'CENTER', sort: true }], rows: [['1º', 'Astra', '650', '214.300'], ['2º', 'Natuur', '640', '205.900'], ['3º', 'Yugen', '630', '191.800']] }],
  ],
  Escolas: [
    ['podio', [[2, 'Caio Medeiros', 'Natuur · Turma 801', '1.180 pontos', 200], [1, 'Beatriz Almeida', 'Astra · Turma 901', '1.240 pontos', 230], [3, 'Rafael Antunes', 'Yugen · Turma 902', '1.150 pontos', 180]]],
    ['tab', { titulo: 'Ranking da escola · EM Castro Alves', busca: 'Pesquisar pelo estudante', pag: ['Mostrando 8 de 142 estudantes', 18], cols: [{ t: 'Posição', w: 120 }, { t: 'Estudante', sort: true }, { t: 'Nação', w: 200 }, { t: 'Pontos', w: 200, al: 'CENTER', sort: true }], rows: [['1º', 'Beatriz Almeida', 'Astra', '1.240'], ['2º', 'Caio Medeiros', 'Natuur', '1.180'], ['3º', 'Rafael Antunes', 'Yugen', '1.150'], ['4º', 'Lívia Prates', 'Astra', '1.120'], ['5º', 'Henrique Sales', 'Natuur', '1.095'], ['6º', 'Marina Couto', 'Yugen', '1.060'], ['7º', 'Otávio Lemos', 'Astra', '1.040'], ['8º', 'Clara Bastos', 'Natuur', '1.015']] }],
  ],
  // Turma e Ano escolar: não há tela no Figma; dados coerentes com as outras visões (mesmos estudantes e pontos).
  Turma: [
    ['podio', [[2, 'Thiago Barros', 'Natuur · EM Monteiro Lobato', '1.205 pontos', 200], [1, 'Beatriz Almeida', 'Astra · EM Castro Alves', '1.240 pontos', 230], [3, 'Sofia Ramalho', 'Yugen · EM Monteiro Lobato', '1.170 pontos', 180]]],
    ['tab', { titulo: 'Ranking da turma · 9º ano (todas as escolas)', busca: 'Pesquisar pelo estudante', pag: ['Mostrando 6 de 312 estudantes', 52], cols: [{ t: 'Posição', w: 120 }, { t: 'Estudante', sort: true }, { t: 'Escola', w: 240 }, { t: 'Nação', w: 160 }, { t: 'Pontos', w: 160, al: 'CENTER', sort: true }], rows: [['1º', 'Beatriz Almeida', 'EM Castro Alves', 'Astra', '1.240'], ['2º', 'Thiago Barros', 'EM Monteiro Lobato', 'Natuur', '1.205'], ['3º', 'Sofia Ramalho', 'EM Monteiro Lobato', 'Yugen', '1.170'], ['4º', 'Rafael Antunes', 'EM Castro Alves', 'Yugen', '1.150'], ['5º', 'Bianca Rezende', 'EM Jardim das Flores', 'Astra', '1.090'], ['6º', 'Thales Moura', 'EM Jardim das Flores', 'Natuur', '1.020']] }],
  ],
  'Ano escolar': [
    ['podio', [[2, '8º ano', '402 participantes', '131.200 pontos', 200], [1, '9º ano', '418 participantes', '139.900 pontos', 230], [3, '7º ano', '396 participantes', '124.600 pontos', 180]]],
    ['tab', { titulo: 'Ranking por ano escolar', busca: 'Pesquisar', pag: ['Mostrando 6 de 6 anos escolares', 1], cols: [{ t: 'Posição', w: 120 }, { t: 'Ano escolar' }, { t: 'Participantes', w: 200, al: 'CENTER' }, { t: 'Pontos', w: 200, al: 'CENTER', sort: true }], rows: [['1º', '9º ano', '418', '139.900'], ['2º', '8º ano', '402', '131.200'], ['3º', '7º ano', '396', '124.600'], ['4º', '6º ano', '360', '96.400'], ['5º', '5º ano', '204', '71.500'], ['6º', '4º ano', '140', '48.400']] }],
  ],
}
const oli: Rel = {
  id: 'oli',
  grupo: 'ativ',
  tipo: 'Olimpíadas',
  perfil: 'gestora',
  mig: ['Início', 'Relatórios', 'Atividades', 'Olimpíadas', 'Olimpíada de Matemática 2026'],
  abas: ['Visão geral'],
  cab: ativCab('Olimpíadas', 'medal', 'Olimpíada de Matemática 2026', 'Onde', 'Rede Municipal de Nova Esperança'),
  ent: ['Olimpíada de Matemática 2026', 'Olimpíadas', 'medal', 'Rede Municipal de Nova Esperança · 18 escolas · 1.920 participantes nas nações Astra, Natuur e Yugen', [['Finalizado', 'suc']]],
  T: { 'Visão geral': [['kpis', KPI_OLI], ['avisoRanking', null], ['seg', [OLI_SEG, 'Ranking das Nações']]] },
}

/* ------------------------------------------------------------------ 18 · Liga das Estrelas (gestora) */
const liga: Rel = {
  id: 'liga',
  grupo: 'ativ',
  tipo: 'Liga das Estrelas',
  perfil: 'gestora',
  mig: ['Início', 'Relatórios', 'Atividades', 'Liga das Estrelas', 'Temporada 2026'],
  abas: ['Visão geral', 'Engajamento'],
  cab: ativCab('Liga das Estrelas', 'star', 'Temporada 2026', 'Onde', 'Rede Municipal de Nova Esperança'),
  ent: ['Liga das Estrelas 2026', 'Liga das Estrelas', 'star', 'Rede Municipal de Nova Esperança · 18 escolas · missões semanais · semana 38 de 44', [['Em progresso', 'inf']]],
  T: {
    'Visão geral': [
      ['kpis', [['Estudantes ativos', '60%', '50%', 120, ['2.310 de 3.860 estudantes']], ['Média de missões realizadas por estudante', '23', null, null, ['Missões semanais concluídas']], ['Pontuação do líder', '412', null, null, ['estrelas · Larissa Campos']], ['Estrelas distribuídas', '184.800', null, null, ['Média de 80 por participante']]]],
      ['tab', { titulo: 'Ranking dos estudantes', busca: 'Pesquisar pelo nome...', pag: ['Mostrando 10 de 2.310 estudantes', 231], cols: [{ t: 'Posição', w: 88 }, { t: 'Estudante', sort: true }, { t: 'Turma', w: 80 }, { t: 'Escola', w: 200 }, { t: 'Ano escolar', w: 112, al: 'CENTER' }, { t: 'Estrelas', w: 104, al: 'CENTER', sort: true }, { t: 'Última pontuação', w: 144, al: 'CENTER' }], rows: ([[1, 'Larissa Campos', '701', 'EM Cecília Meireles', '7º', 412, '25/11'], [2, 'Gustavo Henrique Reis', '801', 'EM Monteiro Lobato', '8º', 405, '25/11'], [3, 'Beatriz Almeida', '901', 'EM Castro Alves', '9º', 398, '24/11'], [4, 'Yasmin Correia', '501', 'EM Tiradentes', '5º', 391, '25/11'], [5, 'Matheus Oliveira', '601', 'EM São Pedro', '6º', 377, '23/11'], [6, 'Rafaela Nogueira', '801', 'EM Dom Pedro II', '8º', 372, '22/11'], [7, 'Pietro Lacerda', '701', 'EM Machado de Assis', '7º', 366, '25/11'], [8, 'Thiago Barros', '901', 'EM Monteiro Lobato', '9º', 359, '24/11'], [9, 'Sofia Ramalho', '901', 'EM Monteiro Lobato', '9º', 351, '25/11'], [10, 'Alice Moreira', '701', 'EM Jardim das Flores', '7º', 344, '22/11']] as any[]).map(([p, n, t, e, a, s, d]) => [p + 'º', n, t, e, a, String(s), d]) }],
    ],
    Engajamento: [
      ['row', [{ t: 'L', titulo: 'Estudantes ativos ao longo do tempo', max: 100, pct: true, h: 260, leg: [['p1', 'Estudantes ativos (%)'], ['muted', 'Meta de estudantes ativos (50%)', true]], series: [['Ativos', [28, 41, 47, 52, 55, 46, 58, 61, 62, 60], 'p1'], ['Meta', META(50), 'muted', true]] }]],
      ['tab', { titulo: 'Ranking de engajamento', busca: 'Pesquisar pelo nome...', desc: 'Missões semanais realizadas e taxa de adesão (semanas com missão concluída sobre as semanas da temporada até agora).', pag: ['Mostrando 8 de 2.310 estudantes', 289], cols: [{ t: 'Posição', w: 96 }, { t: 'Estudante', sort: true }, { t: 'Escola', w: 240 }, { t: 'Missões realizadas', w: 170, al: 'CENTER', sort: true }, { t: 'Taxa de adesão', w: 220 }], rows: ([[1, 'Larissa Campos', 'EM Cecília Meireles', 114, 100], [2, 'Alice Moreira', 'EM Jardim das Flores', 112, 100], [3, 'Gustavo Henrique Reis', 'EM Monteiro Lobato', 110, 97], [4, 'Beatriz Almeida', 'EM Castro Alves', 108, 97], [5, 'Pedro Lins', 'EM Jardim das Flores', 104, 95], [6, 'Yasmin Correia', 'EM Tiradentes', 101, 92], [7, 'Thiago Barros', 'EM Monteiro Lobato', 98, 89], [8, 'Matheus Oliveira', 'EM São Pedro', 95, 87]] as any[]).map(([p, n, e, m, t]) => [p + 'º', n, e, m, { tr: t, tx: Math.round((t * 38) / 100) + ' de 38 · ' + t + '%', meta: 80 }]) }],
    ],
  },
}

export const RELS: Record<string, Rel> = { rede, escola, turma, prof, est, alf, tarefa, prova, desafio, sala, projeto, raiox, camp, redacao, oli, liga }

/* ------------------------------------------------------------------ 1 e 8 · escolhas */
export const TIPOS_I: Record<string, { ic: string; d: string; rel: string; sub: string }> = {
  Rede: { ic: 'house', rel: 'rede', sub: 'Todas as escolas da rede', d: 'O nível mais macro: todas as escolas da rede com os seus indicadores de engajamento e aprendizagem.' },
  Escola: { ic: 'school', rel: 'escola', sub: 'Uma ou todas as escolas', d: 'Uma escola ou todas as escolas da rede: escolha a escola e veja os indicadores dela.' },
  Turma: { ic: 'users', rel: 'turma', sub: 'Uma ou todas as turmas', d: 'Uma turma ou todas as turmas de uma escola: escolha a turma e veja os indicadores dela.' },
  Professores: { ic: 'award', rel: 'prof', sub: 'Um ou todos os professores', d: 'Um professor ou todos da escola: turmas atendidas, atividades criadas × meta e ações pedagógicas.' },
  Estudante: { ic: 'graduation-cap', rel: 'est', sub: 'Um ou todos os estudantes', d: 'Um estudante ou todos da turma: interações, tempo de estudo, pontos de aprendizado e proficiência.' },
  Alfabetização: { ic: 'book-open', rel: 'alf', sub: '1º ao 3º ano', d: 'Fases da alfabetização, níveis de proficiência, tempo por sessão e engajamento por fase.' },
}
export const LIB_I: Record<Perfil, [string, string, boolean?][]> = {
  gestora: [['Rede', 'Rede Municipal de Nova Esperança'], ['Escola', '18 escolas'], ['Turma', '142 turmas'], ['Professores', '214 professores'], ['Estudante', '3.860 estudantes'], ['Alfabetização', '1º ao 3º ano · 1.140 estudantes']],
  coord: [['Escola', 'EM Jardim das Flores'], ['Turma', '9 turmas'], ['Professores', '14 professores'], ['Estudante', '230 estudantes'], ['Alfabetização', 'Sem turmas do 1º ao 3º ano', true]],
  prof: [['Turma', '3 turmas'], ['Estudante', '77 estudantes'], ['Alfabetização', 'Sem turmas do 1º ao 3º ano', true]],
}
export const RECENTES_I: Record<Perfil, [string, string, string][]> = {
  gestora: [['Rede · Rede Municipal de Nova Esperança', 'Ontem às 17:42', 'rede'], ['Escola · EM Castro Alves', '24/11 às 09:15', 'escola'], ['Alfabetização · Rede', '21/11 às 14:03', 'alf']],
  coord: [['Escola · EM Jardim das Flores', 'Hoje às 08:10', 'escola'], ['Professores · Rafael Souza', 'Ontem às 16:30', 'prof'], ['Turma · Turma 502', '24/11 às 10:05', 'turma']],
  prof: [['Turma · Turma 701', 'Hoje às 07:40', 'turma'], ['Estudante · Alice Moreira', 'Ontem às 19:02', 'est'], ['Turma · Turma 702', '23/11 às 11:20', 'turma']],
}
export const TIPOS_A: [string, string, string, string][] = [
  ['Tarefa', 'list-checks', 'tarefa', 'Progresso, estudantes que finalizaram, taxa de acurácia, questões, tópicos e habilidades.'],
  ['Prova Genial', 'file-text', 'prova', 'Histograma de notas, rubricas, escala SAEB e TRI, questões, descritores e socioeconômico.'],
  ['Desafio', 'zap', 'desafio', 'Nível alcançado, pontos, rankings de estudantes e de tópicos e taxa de acurácia.'],
  ['Sala de Aula Invertida', 'book-open', 'sala', 'Desempenho × engajamento, progresso, rubricas e rankings de estudantes, tópicos e habilidades.'],
  ['Projeto', 'flag', 'projeto', 'Estudantes que finalizaram, projetos enviados e avaliados, autoavaliação e arquivos.'],
  ['Raio-X', 'target', 'raiox', 'Raio-X finalizados, média de acertos, histograma de acertos e comparativo de conclusão.'],
  ['Campeonato', 'trophy', 'camp', 'Batalhas, vitórias, derrotas, % de vitórias e rankings de batalhas.'],
  ['Redação', 'pencil', 'redacao', 'Redações iniciadas e enviadas, nota média (0 a 1.000), critérios e temas.'],
  ['Olimpíadas', 'medal', 'oli', 'Rankings das nações, escolas, turmas e anos escolares, com pódio e pontos.'],
  ['Liga das Estrelas', 'star', 'liga', 'Estudantes ativos, missões realizadas, taxa de adesão e ranking por estrelas.'],
]
export const N_A: Record<Perfil, (string | null)[]> = {
  gestora: ['1.284 na rede', '386 na rede', '612 na rede', '158 na rede', '42 na rede', '80 na rede', '18 na rede', '96 propostas', 'Olimpíada de Matemática 2026', 'Temporada 2026 · semana 38'],
  coord: ['28 na escola', '9 na escola', '6 na escola', '1 na escola', '1 em andamento', '2 aplicações', '1 em andamento', '8 propostas', 'Olimpíada de Matemática 2026', 'Temporada 2026 · semana 38'],
  prof: ['6 nas suas turmas', '4 nas suas turmas', '2 nas suas turmas', '1 nas suas turmas', '1 concluído', '1 aplicação', '1 em andamento', null, 'Olimpíada de Matemática 2026', 'Temporada 2026 · semana 38'],
}
export const N_TIPO_A: Record<string, string> = { Tarefa: '1.284', 'Prova Genial': '386', Desafio: '612', 'Sala de Aula Invertida': '158', Projeto: '42', 'Raio-X': '80', Redação: '96', Campeonato: '18', Olimpíadas: '1', 'Liga das Estrelas': '1' }
export const HIST_A = (pf: Perfil): Cel[][] =>
  ([['Razão e proporção', 'Tarefa', 'Turma 801', '25/11', '28/11', 'Em progresso', 'tarefa'], ['Porcentagem no cotidiano', 'Desafio', 'Turma 801', '24/11', '24/11', 'Finalizada', 'desafio'], ['Proporção', 'Sala de Aula Invertida', 'Turma 702', '19/11', '19/11', 'Finalizada', 'sala'], ['Frações e decimais', 'Prova Genial', 'Turma 701', '18/11', '18/11', 'Finalizada', 'prova'], ['Campeonato de Matemática', 'Campeonato', pf === 'prof' ? 'Turmas 701 a 801' : 'EM Jardim das Flores', '01/09', '05/12', 'Em progresso', 'camp'], ['Liga das Estrelas 2026', 'Liga das Estrelas', 'Rede inteira', '02/03', '18/12', 'Em progresso', 'liga']] as string[][]).map(([n, t, o, i, f, s, r]) => [n, t, o, i, f, { b: s, t: s === 'Finalizada' ? 'suc' : 'inf' }, { lk: 'Ver relatório', ir: r }])

/* ------------------------------------------------------------------ 19 · Meus painéis */
export const PAINEIS: { nome: string; sub: string; comp: string; rel?: boolean }[] = [
  { nome: 'Reunião de coordenação', sub: 'EM Jardim das Flores › 5º ano · 6 blocos · editado há 1 min', comp: 'Compartilhado com 3', rel: true },
  { nome: 'Acompanhamento semanal da rede', sub: 'Rede inteira · 8 blocos · editado ontem', comp: 'Só você' },
  { nome: 'Olimpíada 2026', sub: 'Rede inteira · 4 blocos · editado há 3 dias', comp: 'Compartilhado com a equipe da rede' },
  { nome: 'Prioridades do 2º semestre', sub: 'Rede inteira · 6 blocos · editado em 12/11', comp: 'Compartilhado com 18 diretores' },
]
export const MODELOS: [string, string][] = [
  ['Visão do secretário', 'Indicadores da rede, comparativo por escola e pontos de atenção · 7 blocos'],
  ['Reunião pedagógica', 'Prioridades, ranking e desempenho × engajamento · 6 blocos'],
  ['Acompanhamento de turma', 'Estudantes, habilidades e atividades da turma · 5 blocos'],
]
// nome, descrição, categoria, ícone, recortes, estado (no = no painel, add, drag, lock)
export const CATALOGO: [string, string, string, string, string, string][] = [
  ['Indicador com meta', 'Valor, meta e % da meta', 'Engajamento', 'target', 'Todos os recortes', 'no'],
  ['Distribuição de proficiência', 'Estudantes por rubrica', 'Aprendizagem', 'chart-column', 'Rede a turma, atividade', 'add'],
  ['Desempenho × engajamento', 'Quadrantes por estudante', 'Aprendizagem', 'sparkles', 'Turma, atividade', 'add'],
  ['Prioridades pedagógicas', 'Habilidades com mais estudantes abaixo de 60%', 'Avaliações', 'flag', 'Rede a turma, avaliação', 'no'],
  ['Ranking de aprendizagem', 'Estudantes por desempenho, com meta', 'Aprendizagem', 'list-checks', 'Turma, atividade', 'no'],
  ['Evolução de aprendizagem', 'Pontos mensais e acumulados', 'Aprendizagem', 'trending-up', 'Rede a estudante', 'add'],
  ['Comparativo por entidade', 'Escolas ou turmas lado a lado', 'Engajamento', 'school', 'Rede, escola', 'add'],
  ['Redações', 'Notas por competência e temas', 'Avaliações', 'file-text', 'Rede a estudante', 'lock'],
]
export const TURMA_501: [string, string, number][] = [['Ana Clara Ribeiro', 'Avançado', 92], ['Pedro Henrique Alves', 'Avançado', 88], ['Lívia Martins', 'Proficiente', 81], ['João Victor Lima', 'Proficiente', 74], ['Sofia Carvalho', 'Proficiente', 66]]
// Dispersão do bloco "Desempenho × engajamento · Turma 501" (engajamento, desempenho)
export const PTS_501: [number, number][] = [[12, 20], [18, 32], [21, 28], [22, 44], [28, 52], [33, 61], [36, 74], [37, 38], [41, 48], [47, 56], [52, 66], [59, 87], [65, 91], [71, 81]]
export const ATIVOS_5ANO = [28, 32, 35, 38, 39, 29, 38, 40, 39, 37]
export const ATIVOS_PROF = [38, 42, 44, 47, 48, 36, 47, 50, 49, 45]
export const PRIORIDADES: [string, string, number, number][] = [['Frações equivalentes', 'EF05MA03', 14, 38], ['Multiplicação de números decimais', 'EF05MA08', 11, 44], ['Pontuação em diálogos', 'EF05LP04', 9, 47]]
export const PRIORIDADES_PROF: [string, string, number][] = [['Operações com frações', 'EF07MA05 · Turmas 701 e 702', 52], ['Porcentagem', 'EF07MA02 · Turma 701', 50], ['Problemas com porcentagem', 'EF08MA04 · Turma 801', 58]]

/* ------------------------------------------------------------------ 20 · Migração dos BIs (clientes fictícios) */
export const MIGRACAO: [string, number, string, string, string, string, string][] = [
  ['Rede Municipal de Nova Esperança', 3, 'Institucionais e atividades', 'Nenhuma', 'Camila Duarte', 'Migrado', '15/12/2026'],
  ['Rede Municipal de Vale Azul', 2, 'Institucionais', 'Nenhuma', 'Camila Duarte', 'Migrado', '15/12/2026'],
  ['Rede Municipal de Pedra Branca', 2, 'Institucionais e atividades', '1 aberta', 'Diego Faria', 'Em validação', '—'],
  ['Rede Estadual de Serra Alta', 4, 'Institucionais, atividades e eventos', '2 abertas', 'Diego Faria', 'Em validação', '—'],
  ['Rede Municipal de Lagoa Clara', 1, 'Atividades', 'Nenhuma', 'Camila Duarte', 'Migrado', '15/12/2026'],
  ['Rede Municipal de Porto Sereno', 2, 'Institucionais', '1 aberta', 'Paulo Lemos', 'Em validação', '—'],
  ['Rede Municipal de Campo Verde', 2, 'Institucionais e atividades', 'Nenhuma', 'Paulo Lemos', 'A migrar', '—'],
  ['Rede Municipal de Rio Claro do Sul', 2, 'Institucionais', 'Nenhuma', 'Paulo Lemos', 'A migrar', '—'],
  ['Colégio Horizonte', 1, 'Atividades', 'Nenhuma', 'Diego Faria', 'Migrado', '15/12/2026'],
  ['Rede Municipal de Monte Alegre', 2, 'Institucionais e eventos', 'Nenhuma', 'Camila Duarte', 'A migrar', '—'],
  ['Instituto Saber Mais', 1, 'Atividades', 'Nenhuma', 'Diego Faria', 'A migrar', '—'],
]

/* ------------------------------------------------------------------ O4 · Glossário */
export const GLOSSARIO: [string, string, string, string?, boolean?][] = [
  ['Estudante ativo', 'Engajamento', 'Estudante com pelo menos 1 interação de aprendizagem no período.', 'Estudantes com interação ÷ estudantes vinculados', true],
  ['Interações por estudante', 'Engajamento', 'Total de interações de aprendizagem no período dividido pelos estudantes ativos.', 'Interações ÷ estudantes ativos'],
  ['Aprendizado adequado', 'Aprendizagem', 'Percentual de estudantes em Proficiente ou Avançado pelas rubricas da Educadores.', '(Proficiente + Avançado) ÷ estudantes avaliados'],
  ['Rubricas de proficiência', 'Aprendizagem', 'Insuficiente abaixo de 30%, Básico de 30 a 59%, Proficiente de 60 a 84% e Avançado a partir de 85% de desempenho. Não avaliado: sem respostas suficientes.'],
  ['Pontos de aprendizado', 'Aprendizagem', '1 ponto por tópico dominado. Meta: 1 ponto por mês, acumulado no ano letivo.'],
  ['Professor ativo', 'Engajamento', 'Professor que aplicou pelo menos 1 atividade no período. Meta: 50% dos professores.'],
  ['Atividades criadas', 'Atividades', 'Atividades aplicadas pelos professores. Meta: 1 atividade por professor por mês.'],
  ['Taxa de entrega', 'Atividades', 'Entregas feitas sobre as esperadas nas tarefas com prazo no período.', 'Entregas ÷ entregas esperadas'],
  ['Taxa de acurácia', 'Atividades', 'Respostas corretas sobre as respostas dadas. Em branco conta como erro.', 'Acertos ÷ respostas'],
  ['Proficiência TRI', 'Avaliações', 'Escala da Teoria de Resposta ao Item (escala SAEB) usada na Prova Genial e no Raio-X; permite comparar aplicações diferentes.'],
  ['NSE', 'Avaliações', 'Indicador de Nível Socioeconômico (Inse) do Saeb, calculado pelo Inep.'],
]
export const DICA_KPI: Record<string, string> = {
  'Estudantes ativos': 'Estudante ativo: pelo menos 1 interação de aprendizagem no período.',
  'Professores ativos': 'Professor ativo: aplicou pelo menos 1 atividade no período. Meta: 50%.',
  'Desempenho médio': 'Acertos ÷ respostas, ponderado pelas interações de aprendizagem.',
  'Média de interações realizadas': 'Interações de aprendizagem ÷ estudantes ativos. Meta: 40 por estudante ativo.',
  'Estudantes com aprendizado adequado': 'Proficiente + Avançado ÷ estudantes avaliados. Meta: 60%.',
  'Pontos de aprendizado por estudante ativo': '1 ponto por tópico dominado. Meta: 1 ponto por mês (10 até novembro).',
  'Média de atividades criadas': 'Atividades aplicadas ÷ professores. Meta: 1 por professor por mês.',
}
