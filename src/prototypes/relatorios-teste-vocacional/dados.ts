/* =====================================================================
   Dados fictícios do protótipo · Relatórios do Teste Vocacional (Educadores)
   Cada estudante concluído tem respostas completas no instrumento TV-GX 1.0;
   perfil, código e recomendações são calculados pelo mesmo motor do teste
   (../teste-vocacional/motor.ts). Nada é inventado para respostas ausentes.
   ===================================================================== */
import { DIMS, HABILIDADES, itensDo, N_ITENS, type Dim, type Respostas } from '../teste-vocacional/instrumento'
import { gerarResultado, type Resultado } from '../teste-vocacional/motor'

export type Status = 'concluido' | 'andamento' | 'nao-iniciado'
export const STATUS: Record<Status, { nome: string; plural: string; tom: string }> = {
  concluido: { nome: 'Concluído', plural: 'Concluídos', tom: 'verde' },
  andamento: { nome: 'Em andamento', plural: 'Em andamento', tom: 'roxo' },
  'nao-iniciado': { nome: 'Não iniciado', plural: 'Não iniciados', tom: 'amarelo' },
}

export type Escola = { id: string; nome: string; municipio: string }
export const ESCOLAS: Escola[] = [
  { id: 'e1', nome: 'E.E. Professora Maria José de Andrade', municipio: 'Campinas' },
  { id: 'e2', nome: 'E.E. Dom Pedro II', municipio: 'Campinas' },
  { id: 'e3', nome: 'E.E. Anísio Teixeira', municipio: 'Sumaré' },
  { id: 'e4', nome: 'E.E. Cecília Meireles', municipio: 'Hortolândia' },
  { id: 'e5', nome: 'Colégio Estadual Paulo Freire', municipio: 'Valinhos' },
  { id: 'e6', nome: 'E.E. Darcy Ribeiro', municipio: 'Paulínia' },
]

export type Turma = { id: string; escola: string; nome: string; ano: string }
/** turmas do Ensino Médio de cada escola (a e1 reproduz as telas de referência) */
export const TURMAS: Turma[] = [
  { id: '3a', escola: 'e1', nome: 'EMMAT3A', ano: '3ª série do EM' },
  { id: '3b', escola: 'e1', nome: 'EMMAT3B', ano: '3ª série do EM' },
  { id: '2a', escola: 'e1', nome: 'EMMAT2A', ano: '2ª série do EM' },
  { id: 'e2-3a', escola: 'e2', nome: 'EMDP3A', ano: '3ª série do EM' },
  { id: 'e2-2a', escola: 'e2', nome: 'EMDP2A', ano: '2ª série do EM' },
  { id: 'e3-3a', escola: 'e3', nome: 'EMAT3A', ano: '3ª série do EM' },
  { id: 'e3-3b', escola: 'e3', nome: 'EMAT3B', ano: '3ª série do EM' },
  { id: 'e4-3a', escola: 'e4', nome: 'EMCM3A', ano: '3ª série do EM' },
  { id: 'e4-2a', escola: 'e4', nome: 'EMCM2A', ano: '2ª série do EM' },
  { id: 'e4-1a', escola: 'e4', nome: 'EMCM1A', ano: '1ª série do EM' },
  { id: 'e5-3a', escola: 'e5', nome: 'EMPF3A', ano: '3ª série do EM' },
  { id: 'e6-3a', escola: 'e6', nome: 'EMDR3A', ano: '3ª série do EM' },
  { id: 'e6-2a', escola: 'e6', nome: 'EMDR2A', ano: '2ª série do EM' },
]
export const turmasDa = (escola: string) => TURMAS.filter((t) => t.escola === escola)
export const turmaPorId = (id: string) => TURMAS.find((t) => t.id === id)!

export type Estudante = {
  id: string
  nome: string
  turma: string
  foto?: string
  status: Status
  /** respostas registradas (vazio para não iniciado) */
  respostas: Respostas
  /** itens respondidos (de 52) */
  respondidos: number
  /** última atualização ou conclusão */
  atualizado?: number
  resultado: Resultado | null
}

/* ---------------- gerador determinístico ---------------- */
function rng(seed: number) {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}
const limitar = (v: number) => Math.max(1, Math.min(5, Math.round(v)))

/** respostas completas com um código de interesse alvo (as três primeiras dimensões) */
function respostasCom(alvo: string, seed: number): Respostas {
  const r = rng(seed)
  const base: Record<Dim, number> = { R: 2.6, I: 2.6, A: 2.6, S: 2.6, E: 2.6, C: 2.6 }
  ;[4.6, 4.15, 3.75].forEach((v, i) => (base[alvo[i] as Dim] = v))
  for (const d of DIMS) if (!alvo.includes(d)) base[d] = 2.2 + r() * 1.1
  const res: Respostas = {}
  for (const i of itensDo('A')) if (i.bloco === 'A') res[i.id] = limitar(base[i.dim] + (r() - 0.5) * 1.3)
  for (const i of itensDo('B')) res[i.id] = limitar(2.5 + r() * 2.8)
  for (const i of itensDo('C')) res[i.id] = r() < 0.5 ? 'a' : 'b'
  for (const h of HABILIDADES) res[h.id] = limitar(2.4 + r() * 2.8)
  const dev = [...HABILIDADES].sort(() => r() - 0.5).slice(0, 1 + Math.floor(r() * 3)).map((h) => h.id)
  res['H-DEV'] = dev
  return res
}

/** respostas parciais: o estudante parou no meio (ordem de exibição do instrumento) */
function parciais(n: number, seed: number): Respostas {
  const completas = respostasCom('IAS', seed)
  const ordem = [...itensDo('A'), ...itensDo('B'), ...itensDo('C'), ...itensDo('D')].map((i) => i.id).filter((id) => id !== 'H-DEV')
  return Object.fromEntries(ordem.slice(0, n).map((id) => [id, completas[id]]))
}

/* ---------------- Ana Beatriz Souza: perfil das telas de referência (I · S · A) ---------------- */
const ANA_A: Record<Dim, number[]> = {
  R: [3, 3, 4, 3, 4],
  I: [5, 5, 5, 4, 4],
  A: [4, 4, 5, 4, 4],
  S: [5, 4, 5, 4, 4],
  E: [3, 3, 4, 3, 3],
  C: [3, 4, 3, 3, 4],
}
function respostasAna(): Respostas {
  const r: Respostas = {}
  for (const i of itensDo('A')) if (i.bloco === 'A') r[i.id] = ANA_A[i.dim][Number(i.id.slice(1)) - 1]
  Object.assign(r, { V01: 2, V02: 3, V03: 5, V04: 4, V05: 4, V06: 5, V07: 3, V08: 4 })
  Object.assign(r, { P01: 'a', P02: 'b', P03: 'a', P04: 'b', P05: 'a', P06: 'b' })
  Object.assign(r, { H01: 5, H02: 4, H03: 4, H04: 4, H05: 5, H06: 4, H07: 3, H08: 4, 'H-DEV': ['H07', 'H01', 'H04'] })
  return r
}

/* ---------------- turmas e estudantes ---------------- */
const d = (dia: number, mes: number, h: number, m: number) => new Date(2026, mes - 1, dia, h, m).getTime()

const NOMES_3A = [
  'Ana Beatriz Souza', 'Bruno Carvalho', 'Camila Rodrigues', 'Daniel Martins', 'Gabriel Almeida', 'Isabela Ferreira', 'João Pedro Lima', 'Larissa Gomes',
  'Lucas Oliveira', 'Mariana Costa', 'Matheus Ribeiro', 'Nicole Araújo', 'Pedro Henrique Santos', 'Rafaela Barbosa', 'Thiago Mendes', 'Vitória Cardoso',
  'Arthur Nogueira', 'Beatriz Teixeira', 'Caio Moreira', 'Clara Pires', 'Davi Correia', 'Eduarda Rocha', 'Enzo Freitas', 'Fernanda Dias',
  'Felipe Castro', 'Giovanna Lopes', 'Guilherme Batista', 'Helena Duarte', 'Igor Monteiro', 'Júlia Fernandes', 'Kauã Vieira', 'Laura Moraes',
  'Leonardo Pinto', 'Lívia Machado', 'Miguel Azevedo', 'Manuela Cunha', 'Nathan Rezende', 'Olívia Campos', 'Rafael Cavalcanti', 'Sofia Andrade',
  'Samuel Brito', 'Valentina Farias', 'Vinícius Prado', 'Yasmin Siqueira', 'Heitor Bezerra', 'Lorena Matos', 'Otávio Peixoto', 'Rebeca Tavares',
]
const NOMES_3B = [
  'Alice Moura', 'Bernardo Lacerda', 'Cecília Brandão', 'Diego Fonseca', 'Elisa Queiroz', 'Francisco Sales', 'Gabriela Leite', 'Henrique Aguiar',
  'Ingrid Rangel', 'Joaquim Paiva', 'Kamila Torres', 'Lorenzo Medeiros', 'Melissa Sampaio', 'Nicolas Vasconcelos', 'Paula Coelho', 'Ricardo Assis',
  'Sara Guimarães', 'Theo Carneiro', 'Vanessa Lins', 'Wesley Diniz', 'Ágatha Bastos', 'Benjamin Macedo', 'Carolina Pacheco', 'Danilo Xavier',
  'Emanuelly Viana', 'Fábio Antunes', 'Giulia Barros', 'Hugo Esteves', 'Isis Marinho', 'Juliano Prates', 'Letícia Arruda', 'Murilo Godoy',
]
const NOMES_2A = [
  'Amanda Rios', 'Breno Tavares', 'Catarina Mello', 'Douglas Amaral', 'Estela Borges', 'Fernando Quintela', 'Gustavo Valente', 'Heloísa Pimentel',
  'Iago Siqueira', 'Jade Corrêa', 'Kevin Albuquerque', 'Luna Figueiredo', 'Marcelo Bittencourt', 'Natália Rangel', 'Otto Furtado', 'Pietra Saraiva',
  'Renan Calixto', 'Sabrina Dantas', 'Tales Moura', 'Vitor Hugo Lemos',
]

const PRIMEIROS = ['Adriana', 'Alexandre', 'Aline', 'André', 'Bianca', 'Bruna', 'Carlos', 'Cauã', 'Daniela', 'Eduardo', 'Elaine', 'Emanuel', 'Fabiana', 'Gael', 'Gisele', 'Hugo', 'Iara', 'Ícaro', 'Jéssica', 'Juan', 'Kelly', 'Luan', 'Luiza', 'Maitê', 'Mateus', 'Noah', 'Paola', 'Raquel', 'Rodrigo', 'Sophia', 'Tainá', 'Thalita', 'Ulisses', 'Vicente', 'Yago', 'Zoe', 'Bárbara', 'Cristian', 'Débora', 'Erick']
const SOBRENOMES = ['Alves', 'Barros', 'Cabral', 'Damasceno', 'Esteves', 'Falcão', 'Gouveia', 'Holanda', 'Inácio', 'Jardim', 'Lacerda', 'Magalhães', 'Neves', 'Ornelas', 'Pacheco', 'Quaresma', 'Ramos', 'Serrano', 'Tenório', 'Uchôa', 'Valadares', 'Werneck', 'Ximenes', 'Zanetti', 'Amorim', 'Bezerra', 'Couto', 'Dornelles', 'Feitosa', 'Guedes']
/** nomes fictícios para as turmas das demais escolas (sem repetir dentro da turma) */
function nomesGerados(n: number, seed: number) {
  const r = rng(seed)
  const nomes = new Set<string>()
  while (nomes.size < n) nomes.add(`${PRIMEIROS[Math.floor(r() * PRIMEIROS.length)]} ${SOBRENOMES[Math.floor(r() * SOBRENOMES.length)]}`)
  return [...nomes].sort((a, b) => a.localeCompare(b))
}

/** códigos variados (sem concentrar a turma num único perfil) */
const CODIGOS = ['RES', 'AEC', 'IEC', 'SAE', 'ECS', 'CRI', 'IRC', 'ASI', 'SEC', 'RIC', 'EAS', 'CIE', 'IAS', 'SIA', 'AIR', 'REI', 'ESA', 'CSE', 'IRA', 'ASE', 'SCE', 'ERC', 'RCI']

type Molde = Pick<Estudante, 'status' | 'respostas' | 'respondidos' | 'atualizado'>
function montar(turma: string, nomes: string[], plano: Status[], seed0: number, especiais: Record<number, Molde> = {}): Estudante[] {
  return nomes.map((nome, i) => {
    const seed = seed0 + i * 97
    const r = rng(seed)
    const dia = 27 + Math.floor(r() * 12) // 27 out. a 7 nov.
    const quando = dia > 31 ? d(dia - 31, 11, 8 + Math.floor(r() * 9), Math.floor(r() * 60)) : d(dia, 10, 8 + Math.floor(r() * 9), Math.floor(r() * 60))
    let molde: Molde
    if (especiais[i]) molde = especiais[i]
    else if (plano[i] === 'concluido') {
      const respostas = respostasCom(CODIGOS[(i + seed0) % CODIGOS.length], seed)
      molde = { status: 'concluido', respostas, respondidos: N_ITENS, atualizado: quando }
    } else if (plano[i] === 'andamento') {
      const n = 6 + Math.floor(r() * 40)
      molde = { status: 'andamento', respostas: parciais(n, seed), respondidos: n, atualizado: quando }
    } else molde = { status: 'nao-iniciado', respostas: {}, respondidos: 0 }
    return {
      id: `${turma}-${i}`,
      nome,
      turma,
      ...molde,
      resultado: molde.status === 'concluido' ? gerarResultado(molde.respostas, molde.atualizado ?? 0) : null,
    }
  })
}

/** distribui status: concluídos, em andamento e não iniciados, em posições espalhadas pela lista */
function plano(n: number, conc: number, and: number, seed: number): Status[] {
  const r = rng(seed)
  const s: Status[] = [...Array(conc).fill('concluido'), ...Array(and).fill('andamento'), ...Array(n - conc - and).fill('nao-iniciado')]
  for (let i = s.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    ;[s[i], s[j]] = [s[j], s[i]]
  }
  return s
}

// 3A reproduz as telas de referência: 48 estudantes · 25 concluídos · 14 em andamento · 9 não iniciados
const plano3A = plano(48, 25, 14, 7)
const fixo3A: Status[] = ['concluido', 'concluido', 'andamento', 'concluido', 'concluido']
// os cinco primeiros nomes seguem a referência; o restante do plano é ajustado para manter os totais
for (let i = 0; i < 5; i++) {
  if (plano3A[i] === fixo3A[i]) continue
  const j = plano3A.findIndex((s, k) => k >= 5 && s === fixo3A[i])
  ;[plano3A[i], plano3A[j]] = [plano3A[j], plano3A[i]]
}
const conclusaoParcial = (seed: number): Molde => {
  // concluiu os itens obrigatórios, mas não respondeu à pergunta opcional de habilidades a desenvolver (RN02)
  const respostas = respostasCom('SEA', seed)
  delete respostas['H-DEV']
  return { status: 'concluido', respostas, respondidos: N_ITENS, atualizado: d(4, 11, 15, 12) }
}

export const ESTUDANTES: Estudante[] = [
  ...montar('3a', NOMES_3A, plano3A, 11, {
    0: { status: 'concluido', respostas: respostasAna(), respondidos: N_ITENS, atualizado: d(30, 10, 14, 32) },
    1: { status: 'concluido', respostas: respostasCom('RES', 501), respondidos: N_ITENS, atualizado: d(30, 10, 11, 20) },
    2: { status: 'andamento', respostas: parciais(23, 502), respondidos: 23, atualizado: d(30, 10, 10, 15) },
    3: { status: 'concluido', respostas: respostasCom('AEC', 503), respondidos: N_ITENS, atualizado: d(29, 10, 16, 48) },
    4: { status: 'concluido', respostas: respostasCom('IEC', 504), respondidos: N_ITENS, atualizado: d(29, 10, 15, 10) },
  }),
  ...montar('3b', NOMES_3B, plano(32, 21, 6, 23), 41),
  ...montar('2a', NOMES_2A, plano(20, 8, 7, 31), 71),
  // demais escolas: [turma, estudantes, concluídos, em andamento]
  ...(
    [
      ['e2-3a', 36, 24, 7],
      ['e2-2a', 34, 15, 10],
      ['e3-3a', 40, 31, 5],
      ['e3-3b', 38, 26, 8],
      ['e4-3a', 30, 12, 9],
      ['e4-2a', 32, 9, 11],
      ['e4-1a', 28, 4, 8],
      ['e5-3a', 44, 38, 4],
      ['e6-3a', 35, 3, 6],
      ['e6-2a', 33, 0, 4],
    ] as [string, number, number, number][]
  ).flatMap(([t, n, c, a], k) => montar(t, nomesGerados(n, 300 + k * 53), plano(n, c, a, 500 + k), 1000 + k * 211)),
].map((e) => (e.id === '3a-0' ? { ...e, foto: './rtv/ana-beatriz.webp' } : e))

// um estudante da 3A concluiu sem escolher habilidades a desenvolver (pergunta opcional): RN02
{
  const i = ESTUDANTES.findIndex((e) => e.turma === '3a' && e.status === 'concluido' && Number(e.id.split('-')[1]) > 5)
  const molde = conclusaoParcial(901)
  ESTUDANTES[i] = { ...ESTUDANTES[i], ...molde, resultado: gerarResultado(molde.respostas, molde.atualizado ?? 0) }
}

export const estudantePorId = (id: string) => ESTUDANTES.find((e) => e.id === id)!
export const doTurma = (t: string) => ESTUDANTES.filter((e) => e.turma === t)
export const daEscola = (escola: string) => ESTUDANTES.filter((e) => turmaPorId(e.turma).escola === escola)
/** totais operacionais de uma lista de estudantes (não são indicadores de perfil) */
export function totais(lista: Estudante[]) {
  const n = (s: Status) => lista.filter((e) => e.status === s).length
  const ultima = Math.max(0, ...lista.map((e) => e.atualizado ?? 0))
  return { total: lista.length, concluido: n('concluido'), andamento: n('andamento'), naoIniciado: n('nao-iniciado'), ultima: ultima || undefined }
}
/** estudante da 3A sem a pergunta opcional de habilidades (atalho do protótipo) */
export const SEM_DEV = ESTUDANTES.find((e) => e.turma === '3a' && e.status === 'concluido' && !e.respostas['H-DEV'])!.id
