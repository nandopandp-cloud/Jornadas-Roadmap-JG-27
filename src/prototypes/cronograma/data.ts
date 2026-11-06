/* Dados do protótipo “Cronograma de Uso” (visão do gestor e do professor). */

/** data “de hoje” do protótipo — a mesma das telas de referência */
export const HOJE = '2025-11-06'

/* ---------------- tipos de atividade ---------------- */
export type TipoId = 'prova' | 'tarefa' | 'campeonato' | 'aula' | 'desafio'
export type Tipo = { id: TipoId; nome: string; plural: string; natureza: 'Avaliação' | 'Atividade'; cor: string; fundo: string; borda: string }

export const TIPOS: Record<TipoId, Tipo> = {
  prova: { id: 'prova', nome: 'Prova Genial', plural: 'Prova Genial', natureza: 'Avaliação', cor: '#1d6fe0', fundo: '#e3eeff', borda: '#bcd5fb' },
  tarefa: { id: 'tarefa', nome: 'Tarefa', plural: 'Tarefas', natureza: 'Atividade', cor: '#f07a12', fundo: '#ffefdc', borda: '#fbd3a6' },
  campeonato: { id: 'campeonato', nome: 'Campeonato', plural: 'Campeonatos', natureza: 'Atividade', cor: '#6d28d9', fundo: '#efe8fd', borda: '#d8c8fa' },
  aula: { id: 'aula', nome: 'Aula Invertida', plural: 'Aulas Invertidas', natureza: 'Atividade', cor: '#15803d', fundo: '#e0f5e6', borda: '#b4e3c1' },
  desafio: { id: 'desafio', nome: 'Desafio Adaptativo', plural: 'Desafios Adaptativos', natureza: 'Atividade', cor: '#ea7a0c', fundo: '#fff1d6', borda: '#fbd9a0' },
}
export const TIPO_LISTA: TipoId[] = ['prova', 'tarefa', 'campeonato', 'aula', 'desafio']

/* ---------------- atividades do cronograma ---------------- */
export type Atividade = {
  id: string
  inicio: string // AAAA-MM-DD
  fim: string
  ano: string // "6º ano"
  turmas: string[]
  educador: string
  componente: string
  unidade: string // unidade temática
  objeto: string // objeto de conhecimento
  tipo: TipoId | null
  /** título exibido nas recomendações do professor */
  titulo?: string
  /** situação no painel do professor (só as da turma do Professor 01) */
  professor?: 'pendente' | 'criada'
}

export const EDUCADORES = ['Álvaro Dumbledore', 'Julia Verus', 'Lucius Seneca', 'Claudia Octavia', 'Glaucio Santos']
export const COMPONENTES = ['Ciências', 'Português', 'Matemática', 'História', 'Geografia']
export const ANOS = ['6º ano', '7º ano', '8º ano']
export const TURMAS: Record<string, string[]> = { '6º ano': ['601', '602', '603'], '7º ano': ['701', '702'], '8º ano': ['801', '802'] }

const a = (
  id: number,
  inicio: string,
  fim: string,
  ano: string,
  turmas: string[],
  educador: string,
  componente: string,
  unidade: string,
  objeto: string,
  tipo: TipoId,
  extra: Partial<Atividade> = {},
): Atividade => ({ id: `a${id}`, inicio, fim, ano, turmas, educador, componente, unidade, objeto, tipo, ...extra })

const AD = 'Álvaro Dumbledore'
const JV = 'Julia Verus'
const LS = 'Lucius Seneca'
const CO = 'Claudia Octavia'
const GS = 'Glaucio Santos'

/** cronograma da Escola F depois de corrigido (24 registros) */
export const ATIVIDADES_ESCOLA_F: Atividade[] = [
  // janeiro
  a(1, '2025-01-06', '2025-01-24', '6º ano', ['601', '602', '603'], AD, 'Ciências', 'Matéria e energia', 'Água', 'prova'),
  a(2, '2025-01-06', '2025-01-24', '7º ano', ['701'], JV, 'Português', 'Leitura e produção de textos', 'Estratégias de leitura', 'tarefa'),
  a(3, '2025-01-06', '2025-01-24', '8º ano', ['801', '802'], LS, 'Matemática', 'Números e operações', 'Resolução de problemas', 'campeonato'),
  a(4, '2025-01-13', '2025-01-24', '6º ano', ['601'], CO, 'História', 'Brasil Colônia', 'Processo de colonização', 'desafio'),
  a(5, '2025-01-20', '2025-01-24', '7º ano', ['701', '702'], GS, 'Geografia', 'Espaço e território', 'Cartografia', 'aula'),
  // fevereiro
  a(6, '2025-02-03', '2025-02-14', '8º ano', ['801'], LS, 'Matemática', 'Álgebra', 'Equações do 1º grau', 'prova'),
  a(7, '2025-02-03', '2025-02-21', '7º ano', ['702'], JV, 'Português', 'Análise linguística', 'Classes de palavras', 'tarefa'),
  a(8, '2025-02-10', '2025-02-21', '6º ano', ['602'], AD, 'Ciências', 'Terra e Universo', 'Sistema Solar', 'desafio'),
  a(9, '2025-02-17', '2025-02-28', '7º ano', ['701', '702'], GS, 'Geografia', 'Natureza e paisagens', 'Biomas brasileiros', 'campeonato'),
  // março
  a(10, '2025-03-10', '2025-03-21', '6º ano', ['601', '602'], CO, 'História', 'Antiguidade', 'Egito Antigo', 'prova'),
  a(11, '2025-03-10', '2025-03-28', '8º ano', ['801', '802'], LS, 'Matemática', 'Geometria', 'Ângulos', 'desafio'),
  a(12, '2025-03-17', '2025-03-28', '6º ano', ['603'], AD, 'Ciências', 'Vida e evolução', 'Células', 'tarefa'),
  // novembro
  a(13, '2025-11-03', '2025-11-07', '8º ano', ['801'], LS, 'Matemática', 'Grandezas e medidas', 'Área e perímetro', 'prova'),
  a(14, '2025-11-03', '2025-11-10', '7º ano', ['701', '702'], GS, 'Geografia', 'Espaço e território', 'Cartografia', 'tarefa'),
  a(15, '2025-11-06', '2025-11-14', '6º ano', ['601', '602'], AD, 'Ciências', 'Matéria e energia', 'Água', 'prova', { titulo: 'Matéria e energia', professor: 'pendente' }),
  a(16, '2025-11-06', '2025-11-14', '6º ano', ['601', '602'], AD, 'Ciências', 'Vida e evolução', 'Impacto da alimentação na saúde', 'tarefa'),
  a(17, '2025-11-08', '2025-11-14', '7º ano', ['701'], JV, 'Português', 'Oralidade', 'Soletrando', 'campeonato'),
  a(18, '2025-11-10', '2025-11-21', '7º ano', ['701'], JV, 'Português', 'Leitura e produção de textos', 'Estratégias de leitura', 'tarefa', { titulo: 'Estratégias de leitura', professor: 'pendente' }),
  a(19, '2025-11-13', '2025-11-20', '8º ano', ['801', '802'], LS, 'Matemática', 'Números e operações', 'Operações com frações', 'campeonato', { titulo: 'Números e operações', professor: 'pendente' }),
  a(20, '2025-11-17', '2025-11-24', '6º ano', ['601'], CO, 'História', 'Brasil Colônia', 'Processo de colonização', 'aula', { titulo: 'Processo de colonização', professor: 'pendente' }),
  a(21, '2025-11-14', '2025-11-21', '6º ano', ['603'], AD, 'Ciências', 'Terra e Universo', 'Fases da Lua', 'tarefa', { titulo: 'Fases da Lua', professor: 'criada' }),
  a(22, '2025-11-19', '2025-11-28', '7º ano', ['702'], JV, 'Português', 'Oralidade', 'Debate regrado', 'prova', { titulo: 'Debate regrado', professor: 'criada' }),
  a(23, '2025-11-28', '2025-12-05', '8º ano', ['802'], LS, 'Matemática', 'Probabilidade e estatística', 'Leitura de gráficos', 'aula'),
  a(24, '2025-11-25', '2025-12-05', '6º ano', ['601', '602'], CO, 'História', 'Brasil Colônia', 'Economia açucareira', 'tarefa'),
]

/** sugestões automáticas do sistema (aparecem no calendário com “+”) */
export type Sugestao = Atividade & { sugerida: true }
export const SUGESTOES: Sugestao[] = [
  { ...a(901, '2025-11-11', '2025-11-18', '6º ano', ['603'], AD, 'Ciências', 'Matéria e energia', 'Misturas e separação', 'prova'), sugerida: true },
  { ...a(902, '2025-11-12', '2025-11-19', '8º ano', ['801'], LS, 'Matemática', 'Álgebra', 'Expressões numéricas', 'tarefa'), sugerida: true },
]

/* ---------------- escolas da rede ---------------- */
export type StatusEscola = 'publicado' | 'agendado' | 'rascunho' | 'nao-iniciado'
export type Escola = { id: string; nome: string; periodo: string | null; atualizado: string | null; status: StatusEscola; minha?: boolean }

export const ESCOLAS: Escola[] = [
  { id: 'a', nome: 'Escola A', periodo: 'Jan/2025 – Dez/2025', atualizado: '03 de fev de 2025 às 14:32', status: 'publicado' },
  { id: 'b', nome: 'Escola B', periodo: 'Fev/2025 – Dez/2025', atualizado: '28 de jan de 2025 às 10:47', status: 'publicado' },
  { id: 'c', nome: 'Escola C', periodo: null, atualizado: null, status: 'nao-iniciado' },
  { id: 'd', nome: 'Escola D', periodo: 'Mar/2025 – Dez/2025', atualizado: '27 de jan de 2025 às 16:20', status: 'rascunho', minha: true },
  { id: 'e', nome: 'Escola E', periodo: 'Jan/2025 – Dez/2025', atualizado: '20 de jan de 2025 às 11:03', status: 'publicado' },
  { id: 'f', nome: 'Escola F', periodo: null, atualizado: null, status: 'nao-iniciado' },
  { id: 'g', nome: 'Escola G', periodo: null, atualizado: null, status: 'nao-iniciado' },
  { id: 'h', nome: 'Escola H', periodo: 'Fev/2025 – Dez/2025', atualizado: '18 de jan de 2025 às 09:15', status: 'publicado' },
  { id: 'i', nome: 'Escola I', periodo: null, atualizado: null, status: 'nao-iniciado' },
  { id: 'j', nome: 'Escola J', periodo: 'Mar/2025 – Dez/2025', atualizado: '17 de jan de 2025 às 14:10', status: 'rascunho', minha: true },
]

/* ---------------- inconsistências da importação ---------------- */
export type Gravidade = 'sugestao' | 'validar' | 'obrigatoria'
export type Ocorrencia = {
  linha: string // id da atividade
  campo: keyof Atividade | 'periodo'
  original: string
  sugerido: string
  /** outras correspondências possíveis */
  alternativas?: string[]
}
export type Inconsistencia = {
  id: string
  gravidade: Gravidade
  titulo: string
  exemplo: string
  detalhe: string
  rotuloSugestao: string
  descricaoSugestao: string
  ocorrencias: Ocorrencia[]
}

export const INCONSISTENCIAS: Inconsistencia[] = [
  {
    id: 'educador',
    gravidade: 'sugestao',
    titulo: 'Nome de educador com possível divergência',
    exemplo: 'Ex.: Álvaro Dumbidore → Álvaro Dumbledore',
    detalhe: 'Encontramos 3 ocorrências com nomes semelhantes aos cadastrados na sua rede.',
    rotuloSugestao: 'Correspondência encontrada na rede',
    descricaoSugestao: 'Educador cadastrado na Escola F e vinculado às turmas informadas.',
    ocorrencias: [
      { linha: 'a1', campo: 'educador', original: 'Álvaro Dumbidore', sugerido: AD, alternativas: ['Álvaro Duarte', 'Alvaro Dumont'] },
      { linha: 'a15', campo: 'educador', original: 'Álvaro Dumbidore', sugerido: AD, alternativas: ['Álvaro Duarte', 'Alvaro Dumont'] },
      { linha: 'a16', campo: 'educador', original: 'Alvaro Dumbledor', sugerido: AD, alternativas: ['Álvaro Duarte', 'Alvaro Dumont'] },
    ],
  },
  {
    id: 'componente',
    gravidade: 'sugestao',
    titulo: 'Componente curricular com variação de escrita',
    exemplo: 'Ex.: Matematica → Matemática',
    detalhe: 'Encontramos 4 componentes escritos de forma diferente do padrão da BNCC.',
    rotuloSugestao: 'Componente padronizado',
    descricaoSugestao: 'Nome oficial do componente curricular na sua rede.',
    ocorrencias: [
      { linha: 'a3', campo: 'componente', original: 'Matematica', sugerido: 'Matemática', alternativas: ['Matemática Financeira'] },
      { linha: 'a6', campo: 'componente', original: 'Matematica', sugerido: 'Matemática', alternativas: ['Matemática Financeira'] },
      { linha: 'a11', campo: 'componente', original: 'matemática', sugerido: 'Matemática', alternativas: ['Matemática Financeira'] },
      { linha: 'a7', campo: 'componente', original: 'Portugues', sugerido: 'Português', alternativas: ['Língua Portuguesa'] },
    ],
  },
  {
    id: 'turma',
    gravidade: 'validar',
    titulo: 'Turma com mais de uma correspondência',
    exemplo: 'Ex.: 601 pode estar vinculada ao 6º ano A ou 6º ano B',
    detalhe: 'A mesma turma aparece em mais de um ano/turno cadastrado. Confirme qual é a correta.',
    rotuloSugestao: 'Correspondência mais provável',
    descricaoSugestao: 'Turma do turno da manhã, onde o educador informado leciona.',
    ocorrencias: [
      { linha: 'a4', campo: 'turmas', original: '601', sugerido: '601 — 6º ano A (manhã)', alternativas: ['601 — 6º ano B (tarde)'] },
      { linha: 'a20', campo: 'turmas', original: '601', sugerido: '601 — 6º ano A (manhã)', alternativas: ['601 — 6º ano B (tarde)'] },
    ],
  },
  {
    id: 'acento',
    gravidade: 'sugestao',
    titulo: 'Acentuação e formatação',
    exemplo: 'Ex.: Historia → História',
    detalhe: 'Encontramos 1 palavra sem acentuação.',
    rotuloSugestao: 'Escrita corrigida',
    descricaoSugestao: 'Ajuste de acentuação, sem mudar o conteúdo.',
    ocorrencias: [{ linha: 'a10', campo: 'componente', original: 'Historia', sugerido: 'História' }],
  },
  {
    id: 'obrigatorio',
    gravidade: 'obrigatoria',
    titulo: 'Campo obrigatório sem preenchimento',
    exemplo: 'Atividade na plataforma',
    detalhe: 'A linha de “Biomas brasileiros” (7º ano) está sem o tipo de atividade na plataforma.',
    rotuloSugestao: 'Sugestão do sistema',
    descricaoSugestao: 'Tipo mais usado para este componente e unidade temática.',
    ocorrencias: [{ linha: 'a9', campo: 'tipo', original: '', sugerido: 'campeonato', alternativas: ['prova', 'tarefa', 'aula', 'desafio'] }],
  },
  {
    id: 'data',
    gravidade: 'obrigatoria',
    titulo: 'Data de término anterior à data de início',
    exemplo: 'Período informado: 24/01/2025 a 06/01/2025',
    detalhe: 'O período de “Estratégias de leitura” (7º ano) termina antes de começar.',
    rotuloSugestao: 'Sugestão do sistema',
    descricaoSugestao: 'Inverter as datas: 06/01/2025 a 24/01/2025.',
    ocorrencias: [{ linha: 'a2', campo: 'periodo', original: '24/01/2025 a 06/01/2025', sugerido: '06/01/2025 a 24/01/2025' }],
  },
]
export const TOTAL_OCORRENCIAS = INCONSISTENCIAS.reduce((n, i) => n + i.ocorrencias.length, 0)

/* ---------------- colunas do modelo CSV ---------------- */
export const COLUNAS_CSV = [
  ['inicio', 'Data de início (DD/MM/AAAA)'],
  ['termino', 'Data de término (DD/MM/AAAA)'],
  ['ano_turma', 'Ano escolar (ex.: 6º ano)'],
  ['turmas', 'Turmas separadas por vírgula (ex.: 601, 602)'],
  ['educador', 'Nome do educador como cadastrado na rede'],
  ['componente', 'Componente curricular (ex.: Matemática)'],
  ['unidade_tematica', 'Unidade temática da BNCC'],
  ['objeto_conhecimento', 'Objeto de conhecimento'],
  ['atividade_plataforma', 'Prova Genial, Tarefa, Campeonato, Aula Invertida ou Desafio Adaptativo'],
] as const

/* ---------------- utilitários de data ---------------- */
export const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
export const MESES_CURTOS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
export const DIAS_SEMANA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']

export const parseData = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}
export const isoData = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
export const br = (iso: string) => {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}
export const brCurta = (iso: string) => {
  const [, m, d] = iso.split('-')
  return `${d}/${m}`
}
export const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
export const mesAno = (iso: string) => {
  const d = parseData(iso)
  return `${capital(MESES[d.getMonth()])} de ${d.getFullYear()}`
}
