/* Dados fictícios dos relatórios da Gamificação GenieX (Educadores).
   Elos, badges e regras vêm da experiência do estudante (mesmo PRD v2.0), para os números baterem entre as jornadas. */
import { BADGES, ELOS, eloDe, fmt, type Badge, type Elo, type EloId } from '../gamificacao-geniex/data'

export { BADGES, ELOS, eloDe, fmt }
export type { Badge, Elo, EloId }

export const ESCOLA = 'Escola Estadual Dr. José Tavares'
export const ORDEM: EloId[] = ['bronze', 'prata', 'ouro', 'diamante', 'cosmico']

export type Turma = {
  id: string
  nome: string
  ano: string
  estudantes: number
  /** % de estudantes com XP válido */
  comXp: number
  /** XP válido médio entre quem tem XP */
  xpMedio: number
  /** quantidade de estudantes por elo (Bronze → Cósmico) */
  dist: [number, number, number, number, number]
  /** visão geral (tela atual de Relatórios de Turmas) */
  ativos: string
  professores: string
  proficiencia: 'Não avaliado' | 'Básico' | 'Proficiente' | 'Avançado'
  regressoes: number
  badgesMedia: string
  badgesTotal: number
}

export const TURMAS: Turma[] = [
  { id: '1a', nome: '1ª SÉRIE A INTEGRAL 9H ANUAL', ano: '1º ano E.M.', estudantes: 44, comXp: 64, xpMedio: 15240, dist: [22, 13, 6, 3, 0], ativos: '2%', professores: '0%', proficiencia: 'Não avaliado', regressoes: 2, badgesMedia: '4,9', badgesTotal: 216 },
  { id: '1b', nome: '1ª SÉRIE B INTEGRAL 9H ANUAL', ano: '1º ano E.M.', estudantes: 42, comXp: 71, xpMedio: 17830, dist: [18, 14, 7, 3, 0], ativos: '38%', professores: '50%', proficiencia: 'Básico', regressoes: 1, badgesMedia: '5,6', badgesTotal: 235 },
  { id: '2a', nome: '2ª SÉRIE A INTEGRAL 9H ANUAL', ano: '2º ano E.M.', estudantes: 40, comXp: 78, xpMedio: 28920, dist: [12, 13, 9, 5, 1], ativos: '64%', professores: '75%', proficiencia: 'Proficiente', regressoes: 4, badgesMedia: '8,2', badgesTotal: 328 },
  { id: '3a', nome: '3ª SÉRIE A INTEGRAL 9H ANUAL', ano: '3º ano E.M.', estudantes: 38, comXp: 82, xpMedio: 36410, dist: [8, 11, 11, 6, 2], ativos: '71%', professores: '100%', proficiencia: 'Avançado', regressoes: 3, badgesMedia: '10,1', badgesTotal: 384 },
  { id: '8a', nome: 'EFAFMAT8A', ano: '8º ano', estudantes: 48, comXp: 85, xpMedio: 24180, dist: [19, 14, 9, 4, 2], ativos: '58%', professores: '100%', proficiencia: 'Proficiente', regressoes: 3, badgesMedia: '7,4', badgesTotal: 356 },
  { id: '8b', nome: 'EFAFMAT8B', ano: '8º ano', estudantes: 46, comXp: 76, xpMedio: 19650, dist: [21, 13, 8, 4, 0], ativos: '47%', professores: '50%', proficiencia: 'Básico', regressoes: 2, badgesMedia: '6,1', badgesTotal: 281 },
  { id: '9a', nome: 'EFAFMAT9A', ano: '9º ano', estudantes: 45, comXp: 80, xpMedio: 26340, dist: [16, 14, 10, 4, 1], ativos: '62%', professores: '100%', proficiencia: 'Proficiente', regressoes: 1, badgesMedia: '7,9', badgesTotal: 356 },
  { id: '9b', nome: 'EFAFMAT9B', ano: '9º ano', estudantes: 43, comXp: 58, xpMedio: 12870, dist: [25, 11, 5, 2, 0], ativos: '29%', professores: '50%', proficiencia: 'Não avaliado', regressoes: 0, badgesMedia: '3,8', badgesTotal: 163 },
]

export type Aluno = {
  id: string
  nome: string
  turma: string
  ano: string
  email: string
  /** XP válido hoje */
  xp: number
  /** maior saldo válido já alcançado (define as badges e o maior elo) */
  pico: number
  /** XP gerado desde o início (inclui o que já expirou) */
  conquistado: number
  ultima: string
  /** elo anterior quando houve regressão */
  era?: EloId
}

const a = (id: string, nome: string, turma: string, ano: string, xp: number, pico: number, ultima: string, era?: EloId): Aluno => ({
  id,
  nome,
  turma,
  ano,
  email: nome.split(' ')[0].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '') + '.' + id + '@jovensgenios.com',
  xp,
  pico,
  conquistado: Math.round(pico * 1.01 + (pico - xp) * 0.3),
  ultima,
  era,
})

export const ALUNOS: Aluno[] = [
  a('airton', 'Airton Gabriel Barbosa Leonel', 'EFAFMAT8A', '8º ano', 28450, 28450, '30 out. 2026'),
  { ...a('ana-caroline', 'Ana Caroline Pereira da Silva', 'EFAFMAT8A', '8º ano', 12300, 18400, '30 out. 2026'), conquistado: 18600, email: 'ana.silva1016@jovensgenios.com' },
  a('ana-luiza', 'Ana Luiza Rodrigues Serra Negra', 'EFAFMAT8A', '8º ano', 6820, 6820, '29 out. 2026'),
  a('ana-vitoria-a', 'Ana Vitória Alves Serra Negra', 'EFAFMAT8A', '8º ano', 31560, 31560, '29 out. 2026'),
  a('ana-vitoria-f', 'Ana Vitória Farias Silva', 'EFAFMAT8A', '8º ano', 5120, 11200, '12 set. 2026', 'prata'),
  a('anny', 'Anny Beatriz Alves dos Santos', 'EFAFMAT8A', '8º ano', 68200, 68200, '28 out. 2026'),
  a('anthonny', 'Anthonny Miguel Soares dos Santos', 'EFAFMAT8A', '8º ano', 102450, 104320, '30 out. 2026'),
  a('bruna', 'Bruna Carvalho Mendes', 'EFAFMAT8A', '8º ano', 0, 0, 'Sem atividade'),
  a('caio', 'Caio Henrique Moraes', 'EFAFMAT8A', '8º ano', 41200, 47800, '27 out. 2026'),
  a('debora', 'Débora Lima Cavalcanti', 'EFAFMAT8A', '8º ano', 15870, 15870, '26 out. 2026'),
  a('arthur', 'Arthur Henrique Lopes', 'EFAFMAT9A', '9º ano', 980, 980, '21 out. 2026'),
  a('beatriz', 'Beatriz Nogueira Prado', 'EFAFMAT9A', '9º ano', 9760, 9760, '30 out. 2026'),
  a('bruno', 'Bruno César Almeida', 'EFAFMAT9A', '9º ano', 46380, 46380, '29 out. 2026'),
]

export const alunoPorId = (id?: string) => ALUNOS.find((x) => x.id === id) ?? ALUNOS[1]

/** progresso (0–100) do XP dentro da faixa do elo atual */
export function progressoNoElo(xp: number) {
  const e = eloDe(xp)
  if (e.max === null) return 100
  return Math.max(0, Math.min(100, Math.round(((xp - e.min) / (e.max + 1 - e.min)) * 100)))
}
export function proximoTexto(xp: number) {
  if (xp <= 0) return 'Ainda sem XP válido'
  const e = eloDe(xp)
  const i = ELOS.indexOf(e)
  if (i === ELOS.length - 1) return 'Elo máximo alcançado'
  const prox = ELOS[i + 1]
  return `Faltam ${fmt(prox.min - xp)} para ${prox.nome}`
}
export const badgesDe = (al: Aluno) => BADGES.filter((b) => b.xp <= al.pico)

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out']
/** saldo válido ao fim de cada mês (Jan–Out 2026): sobe até o pico em agosto e cai com a expiração */
export function serie(al: Aluno) {
  if (al.id === 'ana-caroline') return [0, 2100, 4300, 6200, 8900, 11400, 14800, 18400, 13100, 12300].map((v, i) => ({ mes: MESES[i], v }))
  return MESES.map((mes, i) => {
    const v = i <= 7 ? Math.round(al.pico * Math.pow(i / 7, 1.15)) : Math.round(al.pico + ((al.xp - al.pico) * (i - 7)) / 2)
    return { mes, v }
  })
}
export function modalidades(al: Aluno) {
  const t = al.conquistado
  const red = Math.round(t * 0.44)
  const sim = Math.round(t * 0.34)
  return [
    { id: 'red', nome: 'Redações', v: red, cor: 'var(--rx-red)' },
    { id: 'sim', nome: 'Simulados', v: sim, cor: 'var(--rx-blue)' },
    { id: 'quiz', nome: 'Quizzes', v: t - red - sim, cor: 'var(--rx-roxo)' },
  ]
}

export type Mod = 'Redação' | 'Simulado' | 'Quiz'
export type StatusLote = 'Válido' | 'Expira em breve' | '50% expirado' | 'Expirado' | 'Limite diário'
export type Lote = { data: string; atividade: string; detalhe: string; mod: Mod; concedido: number; valido: number; status: StatusLote; prox: string; quando: string }

export const LOTES: Lote[] = [
  { data: '30 out. 2026', atividade: 'Redação ENEM', detalhe: 'Tema: Desafios da educação · nota 820', mod: 'Redação', concedido: 820, valido: 820, status: 'Válido', prox: '−410 XP', quando: '30 jan. 2027' },
  { data: '30 out. 2026', atividade: 'Redação ENEM', detalhe: 'Cidadania digital · nota 700 · 2ª do dia', mod: 'Redação', concedido: 0, valido: 0, status: 'Limite diário', prox: 'Sem XP', quando: '1 redação com XP por dia' },
  { data: '28 out. 2026', atividade: 'Simulado ENEM', detalhe: 'Ciências da Natureza · 45 acertos', mod: 'Simulado', concedido: 450, valido: 450, status: 'Válido', prox: '−225 XP', quando: '28 jan. 2027' },
  { data: '25 out. 2026', atividade: 'Quiz de Literatura', detalhe: 'Modernismo no Brasil · 7 acertos', mod: 'Quiz', concedido: 70, valido: 70, status: 'Válido', prox: '−35 XP', quando: '25 jan. 2027' },
  { data: '20 out. 2026', atividade: 'Quiz de Matemática', detalhe: 'Funções do 1º grau · 9 acertos', mod: 'Quiz', concedido: 90, valido: 90, status: 'Válido', prox: '−45 XP', quando: '20 jan. 2027' },
  { data: '15 ago. 2026', atividade: 'Simulado ENEM', detalhe: 'Linguagens e Humanas · 52 acertos', mod: 'Simulado', concedido: 520, valido: 520, status: 'Expira em breve', prox: '−260 XP', quando: '15 nov. 2026' },
  { data: '10 ago. 2026', atividade: 'Quiz de Geografia', detalhe: 'Regionalização do Brasil · 4 acertos', mod: 'Quiz', concedido: 40, valido: 40, status: 'Expira em breve', prox: '−20 XP', quando: '10 nov. 2026' },
  { data: '22 jul. 2026', atividade: 'Redação ENEM', detalhe: 'Mobilidade urbana · nota 880', mod: 'Redação', concedido: 880, valido: 440, status: '50% expirado', prox: '−440 XP', quando: '22 jan. 2027' },
  { data: '12 abr. 2026', atividade: 'Simulado ENEM', detalhe: 'Matemática · 70 acertos', mod: 'Simulado', concedido: 700, valido: 0, status: 'Expirado', prox: 'Expirou', quando: '12 out. 2026' },
]

/** datas de conquista das badges (fictícias, em ordem) */
const DATAS = ['18 mar. 2026', '9 abr. 2026', '30 abr. 2026', '21 mai. 2026', '2 jun. 2026', '14 jul. 2026', '22 ago. 2026', '5 set. 2026', '19 set. 2026', '2 out. 2026', '9 out. 2026', '14 out. 2026', '18 out. 2026', '21 out. 2026', '23 out. 2026', '24 out. 2026', '25 out. 2026', '26 out. 2026', '27 out. 2026', '28 out. 2026']
export const dataBadge = (i: number) => DATAS[Math.min(i, DATAS.length - 1)]
