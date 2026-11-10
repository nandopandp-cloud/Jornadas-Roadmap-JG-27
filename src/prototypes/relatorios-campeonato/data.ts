// Dados dos Relatórios do Campeonato GenieX (Educadores).
// São os mesmos números das telas do Figma (2dCJihe9CXk3jC1NClnvaZ) e da jornada do estudante:
// 128 elegíveis, 100 participaram, 320 batalhas, 66% de acurácia, 25 s de tempo médio.

export type Tom = 'inf' | 'roxo' | 'suc' | 'at' | 'cr' | 'neutro'
export type Disc = { nome: string; tom: Tom }
export type Rubrica = 'Avançado' | 'Proficiente' | 'Básico' | 'Insuficiente' | 'Não avaliado'
export type Quad = 'AA' | 'AB' | 'BA' | 'BB'
export type StatusCamp = 'Em andamento' | 'Não iniciado' | 'Encerrado'

export type Campeonato = {
  id: string
  nome: string
  sub: string
  ano: string
  disc: Disc[]
  periodo: string
  /** ano civil de início, para o filtro de período */
  mes: string
  elegiveis: number
  status: StatusCamp
  trofeu: string
  /** tem relatório navegável neste protótipo */
  relatorio?: 'completo' | 'sem-dados'
}

const d = (nome: string, tom: Tom): Disc => ({ nome, tom })
export const CAMPEONATOS: Campeonato[] = [
  { id: 'copa', nome: 'Copa GenieX · 1º ano', sub: 'Mostre o que você sabe e dispute o topo do ranking!', ano: '1º ano', disc: [d('Matemática', 'inf'), d('Física', 'roxo'), d('Química', 'suc')], periodo: '01/11/2026 – 30/11/2026', mes: 'nov', elegiveis: 128, status: 'Em andamento', trofeu: '#C59319', relatorio: 'completo' },
  { id: 'interturmas', nome: 'Desafio Interturmas · 2º ano', sub: 'Juntos pelo conhecimento', ano: '2º ano', disc: [d('Matemática', 'inf'), d('Biologia', 'suc')], periodo: '03/11/2026 – 28/11/2026', mes: 'nov', elegiveis: 96, status: 'Em andamento', trofeu: '#6B7280' },
  { id: 'humanas', nome: 'Campeonato de Humanas · 3º ano', sub: 'Ideias que transformam', ano: '3º ano', disc: [d('História', 'at'), d('Geografia', 'inf'), d('Sociologia', 'roxo')], periodo: '01/12/2026 – 15/12/2026', mes: 'dez', elegiveis: 112, status: 'Não iniciado', trofeu: '#C59319', relatorio: 'sem-dados' },
  { id: 'maratona', nome: 'Maratona GenieX · 1º ano', sub: 'Pequenas batalhas, grandes conquistas', ano: '1º ano', disc: [d('Matemática', 'inf'), d('Química', 'suc')], periodo: '01/10/2026 – 31/10/2026', mes: 'out', elegiveis: 120, status: 'Encerrado', trofeu: '#B4531A' },
  { id: 'ciencias', nome: 'Desafio de Ciências · 1º ano', sub: 'Explorar. Competir. Aprender.', ano: '1º ano', disc: [d('Física', 'roxo'), d('Química', 'suc')], periodo: '01/09/2026 – 30/09/2026', mes: 'set', elegiveis: 118, status: 'Encerrado', trofeu: '#6B7280' },
  { id: 'enem', nome: 'GenieX no ENEM · 3º ano', sub: 'Estratégia e conhecimento em jogo', ano: '3º ano', disc: [d('Matemática', 'inf'), d('Linguagens', 'cr'), d('Ciências da Natureza', 'suc')], periodo: '10/07/2026 – 31/07/2026', mes: 'jul', elegiveis: 145, status: 'Encerrado', trofeu: '#C59319' },
]
export const campPorId = (id: string) => CAMPEONATOS.find((c) => c.id === id) ?? CAMPEONATOS[0]

/** Estudantes da Copa (amostra): batalhas, vitórias, empates, derrotas, acertos, interações, minutos de estudo, tempo médio (s), acurácia (%), quadrante e % de vitórias. */
export type Estudante = { nome: string; turma: string; bat: number; vit: number; emp: number; der: number; ac: number; int: number; est: number; tm: number; acc: number; rub: Rubrica; quad: Quad; pv: number }
const e = (nome: string, turma: string, bat: number, vit: number, emp: number, der: number, ac: number, int: number, est: number, tm: number, acc: number, rub: Rubrica, quad: Quad, pv: number): Estudante => ({ nome, turma, bat, vit, emp, der, ac, int, est, tm, acc, rub, quad, pv })
/** Já na ordem da classificação da Copa (vitórias → acertos → tempo médio → nome). */
export const ESTUDANTES: Estudante[] = [
  e('Ana Beatriz', '1º ano A', 15, 14, 0, 1, 118, 46, 125, 21, 79, 'Avançado', 'AA', 93),
  e('Bruno Lima', '1º ano B', 14, 12, 1, 1, 104, 41, 112, 24, 74, 'Proficiente', 'AA', 86),
  e('Carla Mendes', '1º ano A', 14, 12, 1, 1, 98, 39, 108, 22, 70, 'Proficiente', 'AA', 86),
  e('Lucas Rocha', '1º ano B', 13, 10, 1, 2, 92, 35, 96, 26, 71, 'Proficiente', 'AA', 77),
  e('Mariana Alves', '1º ano A', 14, 9, 2, 3, 81, 34, 91, 23, 58, 'Básico', 'BA', 64),
  e('João Pedro', '1º ano C', 14, 9, 1, 4, 81, 33, 88, 27, 58, 'Básico', 'BA', 64),
  e('Rafaela Costa', '1º ano C', 12, 8, 2, 2, 76, 29, 75, 25, 63, 'Proficiente', 'AA', 67),
  e('Gabriel Souza', '1º ano A', 11, 7, 1, 3, 70, 27, 70, 24, 64, 'Proficiente', 'AA', 64),
  e('Isabela Nunes', '1º ano B', 12, 7, 0, 5, 66, 30, 72, 29, 55, 'Básico', 'BA', 58),
  e('Daniel Rocha', '1º ano C', 11, 6, 1, 4, 61, 22, 58, 26, 55, 'Básico', 'BB', 55),
  e('Juliana Costa', '1º ano C', 8, 5, 1, 2, 58, 14, 41, 23, 73, 'Proficiente', 'AB', 63),
  e('Pedro Henrique', '1º ano B', 12, 5, 1, 6, 54, 38, 80, 31, 45, 'Básico', 'BA', 42),
  e('Beatriz Lopes', '1º ano C', 9, 4, 0, 5, 49, 18, 47, 28, 54, 'Básico', 'BB', 44),
  e('Felipe Araújo', '1º ano A', 8, 3, 0, 5, 41, 16, 39, 30, 51, 'Básico', 'BB', 38),
]
export const TURMAS = ['1º ano A', '1º ano B', '1º ano C']
export const NAO_PARTICIPARAM: [string, string][] = [['Eduarda Alves', '1º ano B'], ['Marcos Vinícius', '1º ano C'], ['Sofia Ramos', '1º ano A'], ['Thiago Lima', '1º ano B'], ['Larissa Prado', '1º ano C']]

/** Ranking de aprendizagem: acurácia ↓, tempo médio ↑, nome A–Z. */
export const porAcuracia = (xs: Estudante[]) => [...xs].sort((a, b) => b.acc - a.acc || a.tm - b.tm || a.nome.localeCompare(b.nome, 'pt-BR'))

export const QUAD: Record<Quad, { nome: string; cor: string; tom: Tom }> = {
  AA: { nome: 'Alto desempenho / Alto engajamento', cor: '#16A34A', tom: 'suc' },
  AB: { nome: 'Alto desempenho / Baixo engajamento', cor: '#7C3AED', tom: 'roxo' },
  BA: { nome: 'Baixo desempenho / Alto engajamento', cor: '#F59E0B', tom: 'at' },
  BB: { nome: 'Baixo desempenho / Baixo engajamento', cor: '#E11D48', tom: 'cr' },
}
/** Outros estudantes da Copa no gráfico (interações, desempenho %). */
export const PONTOS: [number, number][] = [[8, 30], [11, 44], [14, 37], [17, 52], [19, 28], [21, 47], [6, 58], [12, 71], [16, 82], [20, 66], [23, 63], [27, 54], [31, 48], [36, 57], [40, 52], [44, 39], [29, 77], [33, 84], [38, 69], [42, 88], [47, 74], [26, 41], [9, 21], [48, 61]]
export const quadDe = (int: number, des: number): Quad => (des >= 60 ? (int >= 25 ? 'AA' : 'AB') : int >= 25 ? 'BA' : 'BB')

export const RUBRICAS: { nome: Rubrica; cor: string; n: number; faixa: string }[] = [
  { nome: 'Avançado', cor: '#7C3AED', n: 22, faixa: '75% ou mais de acurácia' },
  { nome: 'Proficiente', cor: '#16A34A', n: 34, faixa: 'De 60% a 74%' },
  { nome: 'Básico', cor: '#EAB308', n: 30, faixa: 'De 45% a 59%' },
  { nome: 'Insuficiente', cor: '#DC2626', n: 14, faixa: 'Abaixo de 45%' },
  { nome: 'Não avaliado', cor: '#9CA3AF', n: 28, faixa: 'Sem batalhas concluídas na Copa' },
]
export const corRubrica = (r: Rubrica) => RUBRICAS.find((x) => x.nome === r)!.cor

/** Consolidado e por disciplina (respostas válidas de cada disciplina). */
export type Recorte = 'todas' | 'Matemática' | 'Física' | 'Química'
export const AGG = { participaram: 100, elegiveis: 128, batalhas: 320, interacoes: [32, 50], mediaBatalhas: [5, 10], ativos: [78, 90], acuracia: [66, 70], adequada: [56, 60], tempo: 25, tempoAnterior: 29 }
export const POR_DISC: Record<Exclude<Recorte, 'todas'>, { acc: number; tm: number; adequada: number; questoes: number; respostas: number; delta: number }> = {
  Matemática: { acc: 68, tm: 27, adequada: 58, questoes: 67, respostas: 2540, delta: 2 },
  Física: { acc: 67, tm: 24, adequada: 57, questoes: 50, respostas: 1870, delta: 1 },
  Química: { acc: 63, tm: 23, adequada: 52, questoes: 56, respostas: 1990, delta: -3 },
}
export const DISC_COPA: Disc[] = CAMPEONATOS[0].disc

/** Desempenho por disciplina e tópico: questões usadas, respostas, % de acerto e tempo médio das corretas. */
export type Topico = { disc: string; tom: Tom; topico: string; q: number; r: number; ac: number | null; tm: number | null }
const t = (disc: string, tom: Tom, topico: string, q: number, r: number, ac: number | null, tm: number | null): Topico => ({ disc, tom, topico, q, r, ac, tm })
export const TOPICOS: Topico[] = [
  t('Matemática', 'inf', 'Funções do 1º grau', 18, 610, 74, 22),
  t('Matemática', 'inf', 'Funções do 2º grau', 22, 820, 61, 31),
  t('Matemática', 'inf', 'Progressões', 15, 540, 68, 27),
  t('Matemática', 'inf', 'Estatística básica', 12, 570, 72, 24),
  t('Física', 'roxo', 'Cinemática', 16, 590, 70, 23),
  t('Física', 'roxo', 'Leis de Newton', 20, 760, 66, 25),
  t('Física', 'roxo', 'Energia e trabalho', 14, 520, 63, 26),
  t('Física', 'roxo', 'Ondulatória', 0, 0, null, null),
  t('Química', 'suc', 'Modelos atômicos', 13, 460, 77, 19),
  t('Química', 'suc', 'Tabela periódica', 15, 530, 71, 21),
  t('Química', 'suc', 'Ligações químicas', 12, 420, 62, 24),
  t('Química', 'suc', 'Estequiometria', 16, 580, 48, 29),
]
/** Abaixo desse % de acerto o tópico (ou a questão) recebe o selo “Maior dificuldade”. */
export const LIMITE_DIFICULDADE = 55

export type Questao = { id: string; enunciado: string; disc: string; tom: Tom; topico: string; c: number; i: number; tm: number }
const q = (id: string, enunciado: string, disc: string, tom: Tom, topico: string, c: number, i: number, tm: number): Questao => ({ id, enunciado, disc, tom, topico, c, i, tm })
export const QUESTOES: Questao[] = [
  q('Q-128', 'Quantos mols há em 168 g de NH₃? (massa molar = 17 g/mol)', 'Química', 'suc', 'Estequiometria', 14, 38, 33),
  q('Q-131', 'Na reação 2 H₂ + O₂ → 2 H₂O, quantos mols de água se formam com 5 mols de O₂?', 'Química', 'suc', 'Estequiometria', 19, 31, 36),
  q('Q-047', 'Qual é o x do vértice da parábola f(x) = 3x² − 12x − 1?', 'Matemática', 'inf', 'Funções do 2º grau', 21, 30, 38),
  q('Q-089', 'Qual é a energia cinética de um corpo de 6 kg a 8 m/s?', 'Física', 'roxo', 'Energia e trabalho', 23, 27, 30),
  q('Q-052', 'Qual é a soma dos 8 primeiros termos da PA (3, 7, 11, …)?', 'Matemática', 'inf', 'Progressões', 25, 24, 34),
  q('Q-110', 'Que tipo de ligação química predomina em MgO (óxido de magnésio)?', 'Química', 'suc', 'Ligações químicas', 28, 22, 18),
  q('Q-076', 'Uma força resultante de 40 N age sobre um corpo de 8 kg. Qual é a aceleração?', 'Física', 'roxo', 'Leis de Newton', 31, 21, 22),
  q('Q-033', 'Qual é a mediana do conjunto {12, 3, 18, 7, 9}?', 'Matemática', 'inf', 'Estatística básica', 34, 16, 20),
  q('Q-015', 'Qual é o zero da função f(x) = 4x − 20?', 'Matemática', 'inf', 'Funções do 1º grau', 39, 12, 17),
  q('Q-064', 'Um carro vai de 0 a 20 m/s em 5 s. Qual é a aceleração média?', 'Física', 'roxo', 'Cinemática', 36, 14, 21),
  q('Q-102', 'Quantos prótons tem um átomo de número atômico 11?', 'Química', 'suc', 'Modelos atômicos', 41, 9, 15),
  q('Q-118', 'Em que família da tabela periódica está o cloro (Cl)?', 'Química', 'suc', 'Tabela periódica', 37, 13, 19),
]
export const pctQ = (x: Questao) => Math.round((x.c / (x.c + x.i)) * 100)

export const LINK = 'geniex.app/educadores/relatorios/campeonatos/copa-geniex-1-ano'

/* ------------------------------------------------------------- formatos */
export const fmt = (n: number) => n.toLocaleString('pt-BR')
export const horas = (min: number) => (min < 60 ? `${min}min` : `${Math.floor(min / 60)}h ${String(min % 60).padStart(2, '0')}min`)
