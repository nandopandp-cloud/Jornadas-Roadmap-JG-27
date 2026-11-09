/* Dados fictícios da Gamificação GenieX (iguais aos das telas do Figma e às regras do PRD v2.0) */

export type EloId = 'bronze' | 'prata' | 'ouro' | 'diamante' | 'cosmico'
export type Elo = {
  id: EloId
  nome: string
  min: number
  max: number | null
  faixa: string
  frase: string
  escuro: string
  medio: string
  claro: string
  tint: string
  borda: string
  circ: string
}

export const ELOS: Elo[] = [
  { id: 'bronze', nome: 'Bronze', min: 0, max: 9999, faixa: '0 a 9.999 XP válidos', frase: 'O início da sua jornada. Dê os primeiros passos e construa sua evolução.', escuro: '#3a1a10', medio: '#843f24', claro: '#f2a66b', tint: '#fff7f2', borda: '#f5e0d2', circ: '#fbe6d8' },
  { id: 'prata', nome: 'Prata', min: 10000, max: 29999, faixa: '10.000 a 29.999 XP válidos', frase: 'Continue evoluindo e mostre sua constância nos estudos.', escuro: '#2b3038', medio: '#656e7d', claro: '#c9cfd8', tint: '#f7f8fa', borda: '#e3e6eb', circ: '#eceef2' },
  { id: 'ouro', nome: 'Ouro', min: 30000, max: 59999, faixa: '30.000 a 59.999 XP válidos', frase: 'Seu esforço já faz a diferença. Mantenha o foco e alcance novos horizontes.', escuro: '#4a2a08', medio: '#bb7121', claro: '#f7c64a', tint: '#fff9ec', borda: '#f6e3b8', circ: '#fcebc4' },
  { id: 'diamante', nome: 'Diamante', min: 60000, max: 99999, faixa: '60.000 a 99.999 XP válidos', frase: 'Você está entre os que mais evoluem. Continue brilhando!', escuro: '#0a1c42', medio: '#1a4a91', claro: '#6fa8f5', tint: '#f1f6ff', borda: '#d6e4fb', circ: '#dce8fd' },
  { id: 'cosmico', nome: 'Cósmico', min: 100000, max: null, faixa: '100.000 XP válidos ou mais', frase: 'O nível máximo da GenieX. Para quem não tem limites e vai além.', escuro: '#1c1250', medio: '#442da6', claro: '#a78bfa', tint: '#f5f2ff', borda: '#e2dafe', circ: '#e8e0ff' },
]

export type IconeBadge = 'zap' | 'trend' | 'target' | 'check' | 'award' | 'calendar' | 'flag' | 'bulb' | 'rocket' | 'shield' | 'sun' | 'cap' | 'trophy' | 'gem' | 'star'
export type Badge = { id: number; elo: EloId; nome: string; xp: number; icone: IconeBadge }

export const BADGES: Badge[] = [
  { id: 1, elo: 'bronze', nome: 'Dei o Play', xp: 2000, icone: 'zap' },
  { id: 2, elo: 'bronze', nome: 'Pegando o Ritmo', xp: 4000, icone: 'trend' },
  { id: 3, elo: 'bronze', nome: 'Modo Foco', xp: 6000, icone: 'target' },
  { id: 4, elo: 'bronze', nome: 'Mandando Bem', xp: 8000, icone: 'check' },
  { id: 5, elo: 'bronze', nome: 'Bronze com Orgulho', xp: 9000, icone: 'award' },
  { id: 6, elo: 'prata', nome: 'Rotina em Dia', xp: 14000, icone: 'calendar' },
  { id: 7, elo: 'prata', nome: 'Constância é Tudo', xp: 18000, icone: 'flag' },
  { id: 8, elo: 'prata', nome: 'Mente Afiada', xp: 22000, icone: 'bulb' },
  { id: 9, elo: 'prata', nome: 'Sem Pausa', xp: 26000, icone: 'rocket' },
  { id: 10, elo: 'prata', nome: 'Prata da Casa', xp: 29000, icone: 'shield' },
  { id: 11, elo: 'ouro', nome: 'Brilho Próprio', xp: 36000, icone: 'sun' },
  { id: 12, elo: 'ouro', nome: 'Fera do Estudo', xp: 42000, icone: 'cap' },
  { id: 13, elo: 'ouro', nome: 'Alto Nível', xp: 48000, icone: 'trend' },
  { id: 14, elo: 'ouro', nome: 'Imparável', xp: 54000, icone: 'zap' },
  { id: 15, elo: 'ouro', nome: 'Ouro Puro', xp: 59000, icone: 'trophy' },
  { id: 16, elo: 'diamante', nome: 'Lapidado', xp: 68000, icone: 'gem' },
  { id: 17, elo: 'diamante', nome: 'Visão de Jogo', xp: 76000, icone: 'target' },
  { id: 18, elo: 'diamante', nome: 'Determinação Total', xp: 84000, icone: 'flag' },
  { id: 19, elo: 'diamante', nome: 'Inspiração', xp: 92000, icone: 'bulb' },
  { id: 20, elo: 'diamante', nome: 'Excelência', xp: 99000, icone: 'award' },
  { id: 21, elo: 'cosmico', nome: 'Fora da Curva', xp: 140000, icone: 'rocket' },
  { id: 22, elo: 'cosmico', nome: 'Sem Limites', xp: 180000, icone: 'trend' },
  { id: 23, elo: 'cosmico', nome: 'Inabalável', xp: 220000, icone: 'shield' },
  { id: 24, elo: 'cosmico', nome: 'Lendário', xp: 260000, icone: 'star' },
  { id: 25, elo: 'cosmico', nome: 'Para a História', xp: 300000, icone: 'trophy' },
]

/** histórico de mudanças de elo */
export type Mudanca = { elo: EloId; xp: number; quando: string; motivo: string; atual?: boolean }

export type Estudante = {
  id: 'padrao' | 'cosmico' | 'regressao'
  nome: string
  xp: number
  maior: EloId
  /** data de conquista por badge (id) */
  conquistas: Record<number, string>
  historico: Mudanca[]
  conquistado: number
  expirado: number
  aExpirar: number
}

const datas = (ids: number[], d: string[]) => Object.fromEntries(ids.map((id, i) => [id, d[i] ?? d[d.length - 1]]))

export const ESTUDANTES: Record<Estudante['id'], Estudante> = {
  padrao: {
    id: 'padrao', nome: 'Aluno GenieX', xp: 6420, maior: 'bronze', conquistado: 11870, expirado: 5450, aExpirar: 290,
    conquistas: { 1: '18 mai. 2026', 2: '03 ago. 2026', 3: '30 out. 2026' },
    historico: [{ elo: 'bronze', xp: 6420, quando: '12 mar. 2026', motivo: 'Elo inicial', atual: true }],
  },
  cosmico: {
    id: 'cosmico', nome: 'Aluno GenieX', xp: 104320, maior: 'cosmico', conquistado: 168400, expirado: 64080, aExpirar: 3200,
    conquistas: datas([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], ['20 mar. 2026', '28 mar. 2026', '02 abr. 2026', '09 abr. 2026', '15 abr. 2026', '30 abr. 2026', '12 mai. 2026', '20 mai. 2026', '28 mai. 2026', '03 jun. 2026', '30 jun. 2026', '08 jul. 2026', '16 jul. 2026', '22 jul. 2026', '29 jul. 2026', '12 ago. 2026', '25 ago. 2026', '06 set. 2026', '18 set. 2026', '30 set. 2026']),
    historico: [
      { elo: 'cosmico', xp: 104320, quando: '02 out. 2026', motivo: 'Progressão', atual: true },
      { elo: 'diamante', xp: 60000, quando: '14 jul. 2026', motivo: 'Progressão' },
      { elo: 'ouro', xp: 30000, quando: '20 mai. 2026', motivo: 'Progressão' },
      { elo: 'prata', xp: 10000, quando: '03 abr. 2026', motivo: 'Progressão' },
      { elo: 'bronze', xp: 0, quando: '12 mar. 2026', motivo: 'Início da jornada' },
    ],
  },
  regressao: {
    id: 'regressao', nome: 'Aluno GenieX', xp: 28000, maior: 'ouro', conquistado: 41200, expirado: 13200, aExpirar: 1100,
    conquistas: datas([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], ['20 mar. 2026', '30 mar. 2026', '08 abr. 2026', '18 abr. 2026', '25 abr. 2026', '10 jun. 2026', '02 jul. 2026', '20 jul. 2026', '04 ago. 2026', '10 ago. 2026']),
    historico: [
      { elo: 'prata', xp: 28000, quando: '30 out. 2026', motivo: 'Regressão: lotes expiraram e o saldo ficou abaixo de 30.000 XP', atual: true },
      { elo: 'ouro', xp: 30400, quando: '12 ago. 2026', motivo: 'Progressão' },
      { elo: 'prata', xp: 10050, quando: '03 jun. 2026', motivo: 'Progressão' },
      { elo: 'bronze', xp: 0, quando: '12 mar. 2026', motivo: 'Início da jornada' },
    ],
  },
}

export type Modalidade = 'quiz' | 'sim' | 'red'
export type StatusLote = 'valido' | 'parcial' | 'prestes' | 'expirado' | 'limite'
export type Lote = {
  id: string
  data: string
  hora: string
  atividade: string
  detalhe: string
  tipo: Modalidade
  concedido: number
  valido: number
  proxima: string
  quando: string
  status: StatusLote
  /** linha do tempo do lote: data, título, descrição, tom */
  ciclo: [string, string, string, 'ok' | 'aviso' | 'fim'][]
}

const ciclo = (d0: string, d3: string, d6: string, total: number): Lote['ciclo'] => {
  const metade = Math.floor(total / 2)
  const resto = total - metade
  return [
    [d0, 'Concedido', `${fmt(total)} XP válidos`, 'ok'],
    [d3, 'Ao completar 3 meses', `${fmt(metade)} XP expiram · ${fmt(resto)} continuam valendo`, 'aviso'],
    [d6, 'Ao completar 6 meses', `Os ${fmt(resto)} XP restantes expiram`, 'fim'],
  ]
}

export const LOTES: Lote[] = [
  { id: 'l1', data: '30 out. 2026', hora: '14:32', atividade: 'Redação ENEM', detalhe: 'Tema: Desafios da educação · nota 820', tipo: 'red', concedido: 820, valido: 820, proxima: '−410 XP', quando: '30 jan. 2027', status: 'valido', ciclo: ciclo('30 out. 2026', '30 jan. 2027', '30 abr. 2027', 820) },
  { id: 'l2', data: '30 out. 2026', hora: '16:05', atividade: 'Redação ENEM', detalhe: 'Tema: Cidadania digital · nota 700 · 2ª do dia', tipo: 'red', concedido: 0, valido: 0, proxima: 'Sem XP', quando: '1 redação por dia', status: 'limite', ciclo: [['30 out. 2026', 'Redação concluída sem XP', 'Só a primeira redação com nota validada no dia gera XP (PRD 4.4).', 'fim']] },
  { id: 'l3', data: '28 out. 2026', hora: '10:15', atividade: 'Simulado ENEM', detalhe: 'Ciências da Natureza · 45 acertos', tipo: 'sim', concedido: 450, valido: 450, proxima: '−225 XP', quando: '28 jan. 2027', status: 'valido', ciclo: ciclo('28 out. 2026', '28 jan. 2027', '28 abr. 2027', 450) },
  { id: 'l4', data: '25 out. 2026', hora: '16:20', atividade: 'Quiz de Literatura', detalhe: 'Modernismo no Brasil · 8 acertos', tipo: 'quiz', concedido: 80, valido: 80, proxima: '−40 XP', quando: '25 jan. 2027', status: 'valido', ciclo: ciclo('25 out. 2026', '25 jan. 2027', '25 abr. 2027', 80) },
  { id: 'l5', data: '15 ago. 2026', hora: '09:40', atividade: 'Simulado ENEM', detalhe: 'Linguagens e Humanas · 52 acertos', tipo: 'sim', concedido: 520, valido: 520, proxima: '−260 XP', quando: '15 nov. 2026', status: 'prestes', ciclo: ciclo('15 ago. 2026', '15 nov. 2026', '15 fev. 2027', 520) },
  { id: 'l6', data: '10 ago. 2026', hora: '14:12', atividade: 'Quiz de Geografia', detalhe: 'Regionalização do Brasil · 6 acertos', tipo: 'quiz', concedido: 60, valido: 60, proxima: '−30 XP', quando: '10 nov. 2026', status: 'prestes', ciclo: ciclo('10 ago. 2026', '10 nov. 2026', '10 fev. 2027', 60) },
  { id: 'l7', data: '22 jul. 2026', hora: '11:30', atividade: 'Redação ENEM', detalhe: 'Tema: Mobilidade urbana · nota 880', tipo: 'red', concedido: 880, valido: 440, proxima: '−440 XP', quando: '22 jan. 2027', status: 'parcial', ciclo: ciclo('22 jul. 2026', '22 out. 2026', '22 jan. 2027', 880) },
  { id: 'l8', data: '12 abr. 2026', hora: '16:30', atividade: 'Simulado ENEM', detalhe: 'Matemática e suas tecnologias · 70 acertos', tipo: 'sim', concedido: 700, valido: 0, proxima: 'Expirou', quando: '12 out. 2026', status: 'expirado', ciclo: ciclo('12 abr. 2026', '12 jul. 2026', '12 out. 2026', 700) },
]

export const MODALIDADE: Record<Modalidade, { nome: string; filtro: string; bg: string; cor: string }> = {
  quiz: { nome: 'Quiz', filtro: 'Quizzes', bg: '#eeefff', cor: '#5258e4' },
  sim: { nome: 'Simulado', filtro: 'Simulados', bg: '#e8f1ff', cor: '#2d7ff9' },
  red: { nome: 'Redação', filtro: 'Redações', bg: '#fdecef', cor: '#d9324f' },
}

export const STATUS: Record<StatusLote, { nome: string; cor: string }> = {
  valido: { nome: 'Válido', cor: '#007a4d' },
  parcial: { nome: '50% expirado', cor: '#a07400' },
  prestes: { nome: 'Expira em breve', cor: '#e07b00' },
  expirado: { nome: 'Expirado', cor: '#d31510' },
  limite: { nome: 'Limite diário', cor: '#6d6d6d' },
}

export function fmt(n: number) {
  const s = String(Math.abs(n))
  let o = ''
  for (let i = 0; i < s.length; i++) {
    if (i && (s.length - i) % 3 === 0) o += '.'
    o += s[i]
  }
  return (n < 0 ? '−' : '') + o
}

export const eloDe = (xp: number) => [...ELOS].reverse().find((e) => xp >= e.min)!
export const eloPorId = (id: EloId) => ELOS.find((e) => e.id === id)!
export const proximoElo = (e: Elo) => ELOS[ELOS.indexOf(e) + 1]
export const conquistada = (est: Estudante, b: Badge) => !!est.conquistas[b.id]
export const proximaBadge = (est: Estudante) => BADGES.find((b) => !conquistada(est, b))
