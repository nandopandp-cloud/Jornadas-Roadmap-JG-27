// Relatórios do Modo Lição · dados de exemplo (os mesmos do piloto no Figma mgBtd3mytxRLqNA1qBBmNK).
// Lição "Conhecendo as pirâmides" · 44 estudantes · Matemática + História.

export type Situacao = 'Finalizado' | 'Em progresso' | 'Não iniciado'
export type Prof = 'Avançado' | 'Proficiente' | 'Básico' | 'Insuficiente' | 'Não avaliado'
export type Quadrante = 'Alto desempenho / Alto engajamento' | 'Alto desempenho / Baixo engajamento' | 'Baixo desempenho / Alto engajamento' | 'Baixo desempenho / Baixo engajamento' | 'Não avaliado'
export type Disciplina = 'Matemática' | 'História'
export type Formato = 'Quiz' | 'Resumo' | 'Vídeo' | 'Áudio'

export type Aluno = { id: string; nome: string; turma: string; sit: Situacao; comp: number; inter: number; des: number | null; tempo: number; prof: Prof; quad: Quadrante }

export const LICAO = {
  nome: 'Conhecendo as pirâmides',
  status: 'Finalizada',
  criada: '16/11/2026 às 10:42',
  inicio: '23/11/2026 às 07:30',
  fim: '30/11/2026 às 23:59',
  periodoCurto: '23/11/2026 a 30/11/2026',
  escola: 'EE Jardim das Árvores',
  turmas: '6º ano A e 6º ano B',
  rodapePdf: 'EE JARDIM DAS ÁRVORES - 6º ANO',
  geradoEm: '01/12/2026 às 09:15',
  disciplinas: ['Matemática', 'História'] as Disciplina[],
}

export const META = { finalizaram: 80, ativos: 65, interacoes: 10, acuracia: 70, adequado: 65, desempenho: 65 }

export const prof = (d: number | null): Prof => (d == null ? 'Não avaliado' : d >= 75 ? 'Avançado' : d >= 60 ? 'Proficiente' : d >= 45 ? 'Básico' : 'Insuficiente')

const SIT: Record<string, Situacao> = { C: 'Finalizado', R: 'Em progresso', N: 'Não iniciado' }
const RAW: [string, string, number, number, number | null, number][] = [["Kauã Moura","N",0,0,null,0],["Pedro Henrique Cunha","N",0,0,null,0],["Gustavo Pinto","N",0,0,null,0],["Heitor Nascimento","N",0,0,null,0],["Enzo Batista","C",100,16,96,942],["Cecília Prado","C",100,19,92,1092],["Felipe Araújo","C",100,12,90,758],["Helena Vieira","R",86,10,88,860],["Lucas Ferreira","C",100,17,86,1333],["Benjamin Rocha","C",100,11,85,736],["Valentina Dias","C",100,20,83,1243],["Yasmin Correia","C",100,20,82,1295],["Mateus Carvalho","C",100,11,80,836],["Eduarda Santos","R",57,11,79,731],["Ana Beatriz Souza","C",100,14,77,836],["Diego Sales","C",100,17,76,1047],["João Pedro Alves","C",100,16,74,977],["Fernanda Castro","C",100,17,72,1221],["Thiago Moreira","R",29,9,71,617],["Larissa Costa","C",100,16,70,1260],["Miguel Duarte","C",100,18,68,1563],["Sofia Cardoso","C",100,14,67,1240],["Isabela Freitas","R",57,11,66,911],["Arthur Monteiro","C",100,14,65,803],["Nicole Barbosa","C",100,19,63,1280],["Igor Machado","C",100,18,62,1705],["Natália Rezende","R",71,8,60,669],["Davi Ramos","C",100,19,58,1308],["Vinícius Pereira","C",100,18,56,1110],["Otávio Gomes","C",100,14,55,1046],["Rafael Teixeira","C",100,18,53,1083],["Carla Mendes","R",43,10,52,706],["Beatriz Lopes","C",100,20,50,1497],["Gabriela Rocha","C",100,19,49,1350],["Pietra Martins","C",100,16,48,1445],["Alice Moraes","R",71,8,47,666],["Lívia Azevedo","C",100,16,46,1316],["Daniel Oliveira","C",100,17,44,1037],["Rebeca Farias","R",43,6,41,385],["Caio Fernandes","C",100,15,38,832],["Bruno Henrique Lima","C",100,20,35,1571],["Manuela Ribeiro","R",57,8,33,441],["Elisa Nunes","C",100,17,30,1298],["Júlia Campos","R",86,9,25,838]]

export const TOTAL_INTER = RAW.reduce((a, r) => a + r[3], 0) // 588
export const MEDIA_INTER = TOTAL_INTER / RAW.length // 13,4

const quad = (des: number | null, inter: number): Quadrante =>
  des == null ? 'Não avaliado' : (`${des >= META.desempenho ? 'Alto' : 'Baixo'} desempenho / ${inter >= MEDIA_INTER ? 'Alto' : 'Baixo'} engajamento` as Quadrante)

export const ALUNOS: Aluno[] = RAW.map(([nome, s, comp, inter, des, tempo], i) => ({ id: `a${i + 1}`, nome, turma: i % 4 === 3 ? '6º ano B' : '6º ano A', sit: SIT[s], comp, inter, des, tempo, prof: prof(des), quad: quad(des, inter) }))
export const AVALIADOS = ALUNOS.filter((a) => a.des != null).sort((a, b) => (b.des ?? 0) - (a.des ?? 0) || a.nome.localeCompare(b.nome))
export const NAO_AVALIADOS = ALUNOS.filter((a) => a.des == null).sort((a, b) => a.nome.localeCompare(b.nome))

export const contar = <T extends string>(lista: Aluno[], f: (a: Aluno) => T) => lista.reduce((o, a) => ((o[f(a)] = (o[f(a)] ?? 0) + 1), o), {} as Record<T, number>)
export const N = ALUNOS.length
export const SITS = contar(ALUNOS, (a) => a.sit)
export const PROFS = contar(ALUNOS, (a) => a.prof)
export const QUADS = contar(ALUNOS, (a) => a.quad)
export const pct = (n: number, d: number) => (d ? Math.round((n * 100) / d) : 0)

export const QUADRANTES: Quadrante[] = ['Alto desempenho / Alto engajamento', 'Alto desempenho / Baixo engajamento', 'Baixo desempenho / Alto engajamento', 'Baixo desempenho / Baixo engajamento']
export const QCOR: Record<Quadrante, [string, string]> = {
  'Alto desempenho / Alto engajamento': ['#16A34A', '#DCFCE7'],
  'Alto desempenho / Baixo engajamento': ['#7E22CE', '#F3E8FF'],
  'Baixo desempenho / Alto engajamento': ['#C27C00', '#FEF3C7'],
  'Baixo desempenho / Baixo engajamento': ['#DC2626', '#FDE2E2'],
  'Não avaliado': ['#737373', '#F5F5F5'],
}
export const PROF_COR: Record<Prof, string> = { Avançado: '#7E22CE', Proficiente: '#16A34A', Básico: '#EAB308', Insuficiente: '#DC2626', 'Não avaliado': '#A3A3A3' }
export const PROF_TXT: Record<Prof, string> = { Avançado: '#7E22CE', Proficiente: '#15803D', Básico: '#A16207', Insuficiente: '#DC2626', 'Não avaliado': '#737373' }
export const PROFS_ORD: Prof[] = ['Avançado', 'Proficiente', 'Básico', 'Insuficiente', 'Não avaliado']
export const SIT_COR: Record<Situacao, string> = { Finalizado: '#16A34A', 'Em progresso': '#F59E0B', 'Não iniciado': '#A3A3A3' }
export const DISC_COR: Record<Disciplina, [string, string]> = { Matemática: ['#DC2626', '#FDE8E8'], História: ['#B7791F', '#FDF3DC'] }

/* ---------------------------------------------------------------- engajamento */
export const FORMATOS: { f: Formato; plural: string; cor: string; fundo: string; inter: number; naLicao: string; alcance: number }[] = [
  { f: 'Quiz', plural: 'Quizzes', cor: '#B45309', fundo: '#FEF3C7', inter: 465, naLicao: '3 quizzes na lição', alcance: 40 },
  { f: 'Resumo', plural: 'Resumos', cor: '#7C3AED', fundo: '#F1E9FE', inter: 68, naLicao: '2 resumos na lição', alcance: 34 },
  { f: 'Vídeo', plural: 'Vídeos', cor: '#DC2626', fundo: '#FDE8E8', inter: 33, naLicao: '1 vídeo na lição', alcance: 31 },
  { f: 'Áudio', plural: 'Áudios', cor: '#0E7490', fundo: '#E0F4F8', inter: 22, naLicao: '1 áudio na lição', alcance: 19 },
]
export const FCOR: Record<Formato, string> = { Quiz: '#B45309', Resumo: '#7C3AED', Vídeo: '#DC2626', Áudio: '#0E7490' }
export const ATIVOS = N - (SITS['Não iniciado'] ?? 0)

/* ---------------------------------------------------------------- tópicos */
export type Topico = {
  id: string
  nome: string
  disc: Disciplina
  bncc: string
  interacoes: Partial<Record<Formato, number>>
  questoes: number
  respostas: number
  acerto: number
  dist: [number, number, number, number, number] // A, P, B, I, NA
  adequado: [number, number]
}
export const TOPICOS: Topico[] = [
  { id: 't1', nome: 'Pirâmides: geometria espacial e suas aplicações', disc: 'Matemática', bncc: 'EF06MA17', interacoes: { Resumo: 38, Vídeo: 33, Quiz: 203 }, questoes: 18, respostas: 203, acerto: 70, dist: [13, 10, 9, 6, 6], adequado: [23, 38] },
  { id: 't2', nome: 'Planificação de prismas e pirâmides', disc: 'Matemática', bncc: 'EF06MA17', interacoes: { Quiz: 92 }, questoes: 6, respostas: 92, acerto: 46, dist: [3, 6, 10, 12, 13], adequado: [9, 31] },
  { id: 't3', nome: 'As pirâmides do Egito', disc: 'História', bncc: 'EF06HI07', interacoes: { Resumo: 30, Áudio: 22, Quiz: 170 }, questoes: 15, respostas: 170, acerto: 74, dist: [15, 11, 6, 3, 9], adequado: [26, 35] },
]
export const totalTopico = (t: Topico) => Object.values(t.interacoes).reduce((a, b) => a + (b ?? 0), 0)
export const DISCIPLINAS_AGG: { disc: Disciplina; questoes: number; respostas: number; acerto: number; dist: [number, number, number, number, number]; adequado: [number, number] }[] = [
  { disc: 'Matemática', questoes: 24, respostas: 295, acerto: 63, dist: [9, 10, 11, 8, 6], adequado: [19, 38] },
  { disc: 'História', questoes: 15, respostas: 170, acerto: 74, dist: [15, 11, 6, 3, 9], adequado: [26, 35] },
]
export const ACURACIA = 67 // 310 acertos em 465 respostas
export const ADEQUADO = [(PROFS['Avançado'] ?? 0) + (PROFS['Proficiente'] ?? 0), AVALIADOS.length] as const // 23 de 40

/* ---------------------------------------------------------------- questões (as 39 que os estudantes receberam) */
export type Questao = { id: string; topico: string; enun: string; alts: string[]; certa: number; recebeu: number; resp: number; contagem: number[]; tempo: number }

const POLI: [string, number][] = [['triangular', 3], ['quadrada', 4], ['pentagonal', 5], ['hexagonal', 6], ['octogonal', 8], ['heptagonal', 7]]
const opcoes = (certo: number, desl: number[]): { alts: string[]; certa: number } => {
  const vals = [certo, ...desl.map((d) => certo + d)].filter((v, i, l) => v > 0 && l.indexOf(v) === i).slice(0, 4)
  while (vals.length < 4) vals.push(certo + vals.length + 3)
  const ord = [...vals].sort((a, b) => a - b)
  return { alts: ord.map(String), certa: ord.indexOf(certo) }
}

type Base = { topico: string; enun: string; alts: string[]; certa: number; acerto: number }
const BASES: Base[] = []
// Pirâmides (18)
let k = 0
for (const [nome, n] of POLI) {
  for (const [el, val, sufixo] of [['faces', n + 1, 'faces'], ['arestas', 2 * n, 'arestas'], ['vértices', n + 1, 'vértices']] as [string, number, string][]) {
    if (BASES.filter((b) => b.topico === 't1').length >= 17) break
    const o = opcoes(val, [-1, 1, n])
    BASES.push({ topico: 't1', enun: `Uma pirâmide de base ${nome} tem quantas ${el}${el === 'faces' ? ' ao todo' : ''}?`, alts: o.alts.map((a) => `${a} ${sufixo}`), certa: o.certa, acerto: [81, 64, 72, 77, 58, 69, 74, 62, 70, 79, 55, 66, 71, 60, 73, 68, 76][k++ % 17] })
  }
}
BASES.splice(1, 0) // mantém a ordem
BASES.push({ topico: 't1', enun: 'Qual relação vale para qualquer pirâmide? (V = vértices, F = faces, A = arestas)', alts: ['V + F = A + 2', 'V + A = F + 2', 'F + A = V + 2', 'V = F + A'], certa: 0, acerto: 52 })
// a questão de faces da base quadrada é a 48107 do Figma
// Planificação (6)
BASES.push(
  { topico: 't2', enun: 'A planificação de uma pirâmide de base quadrada é formada por:', alts: ['1 quadrado e 4 triângulos', '2 quadrados e 4 retângulos', '4 quadrados', '1 triângulo e 4 quadrados'], certa: 0, acerto: 38 },
  { topico: 't2', enun: 'Quantos retângulos tem a planificação de um prisma de base triangular?', alts: ['2', '3', '4', '6'], certa: 1, acerto: 42 },
  { topico: 't2', enun: 'Qual sólido tem a planificação formada por 2 hexágonos e 6 retângulos?', alts: ['Pirâmide hexagonal', 'Prisma hexagonal', 'Cubo', 'Pirâmide pentagonal'], certa: 1, acerto: 51 },
  { topico: 't2', enun: 'Na planificação de uma pirâmide triangular, quantos triângulos aparecem?', alts: ['3', '4', '5', '6'], certa: 1, acerto: 47 },
  { topico: 't2', enun: 'Uma caixa de sapatos aberta e planificada mostra quantos retângulos?', alts: ['4', '5', '6', '8'], certa: 2, acerto: 55 },
  { topico: 't2', enun: 'A planificação de um cubo é formada por quantos quadrados iguais?', alts: ['4', '5', '6', '8'], certa: 2, acerto: 44 },
)
// Egito (15)
const EG: [string, string[], number, number][] = [
  ['As pirâmides de Gizé foram construídas principalmente para:', ['Servir de túmulo para os faraós', 'Armazenar grãos', 'Abrigar o exército', 'Observar as estrelas'], 0, 89],
  ['Qual rio foi essencial para a civilização egípcia antiga?', ['Tigre', 'Eufrates', 'Nilo', 'Jordão'], 2, 86],
  ['A escrita usada nos templos e túmulos do Egito antigo é chamada de:', ['Cuneiforme', 'Hieroglífica', 'Alfabética grega', 'Rúnica'], 1, 70],
  ['Quem era o governante máximo do Egito antigo?', ['O cônsul', 'O faraó', 'O imperador romano', 'O sumo sacerdote'], 1, 84],
  ['A maior das pirâmides de Gizé é a de:', ['Miquerinos', 'Quéfren', 'Quéops', 'Tutancâmon'], 2, 61],
  ['O processo de conservação dos corpos no Egito antigo era a:', ['Fossilização', 'Mumificação', 'Cremação', 'Petrificação'], 1, 82],
  ['As cheias do Nilo eram importantes porque:', ['Afastavam os inimigos', 'Fertilizavam as margens para a agricultura', 'Secavam os pântanos', 'Traziam ouro das montanhas'], 1, 77],
  ['Os escribas eram responsáveis por:', ['Construir as pirâmides', 'Registrar informações por escrito', 'Comandar o exército', 'Cultivar as terras do faraó'], 1, 68],
  ['A Esfinge de Gizé tem corpo de:', ['Cavalo', 'Leão', 'Touro', 'Águia'], 1, 74],
  ['A Pedra de Roseta ajudou a decifrar:', ['A escrita cuneiforme', 'Os hieróglifos', 'O latim antigo', 'O alfabeto fenício'], 1, 63],
  ['Em que continente fica o Egito?', ['Ásia', 'Europa', 'África', 'Oceania'], 2, 91],
  ['Os egípcios acreditavam na vida após a morte. Por isso:', ['Enterravam objetos junto aos mortos', 'Não faziam túmulos', 'Jogavam os corpos no rio', 'Não tinham religião'], 0, 72],
  ['O material mais usado para escrever no Egito antigo era o:', ['Papel de árvore', 'Papiro', 'Pergaminho de couro', 'Tábua de cera'], 1, 66],
  ['A sociedade egípcia era organizada de forma:', ['Igualitária', 'Hierárquica', 'Democrática', 'Sem governo'], 1, 58],
  ['Os blocos das pirâmides eram feitos principalmente de:', ['Madeira', 'Calcário e granito', 'Ferro', 'Vidro'], 1, 64],
]
for (const [e, a, c, ac] of EG) BASES.push({ topico: 't3', enun: e, alts: a, certa: c, acerto: ac })

const recebem = (i: number) => 31 + ((i * 7) % 8) // 31 a 38 estudantes recebem cada questão
export const QUESTOES: Questao[] = BASES.map((b, i) => {
  let recebeu = recebem(i)
  let resp = recebeu - ((i * 3) % 3)
  let contagem: number[]
  let acerto = b.acerto
  if (b.enun.startsWith('A planificação de uma pirâmide de base quadrada')) {
    recebeu = 31; resp = 29; contagem = [11, 9, 6, 3]
  } else if (b.enun === 'Uma pirâmide de base quadrada tem quantas faces ao todo?') {
    recebeu = 38; resp = 37; contagem = [5, 30, 2, 0]
  } else {
    const certos = Math.round((resp * acerto) / 100)
    const resto = resp - certos
    const pesos = [0.55, 0.3, 0.15]
    const erradas = pesos.map((p) => Math.floor(resto * p))
    erradas[0] += resto - erradas.reduce((x, y) => x + y, 0)
    contagem = []
    let w = 0
    for (let j = 0; j < 4; j++) contagem.push(j === b.certa ? certos : erradas[w++])
  }
  acerto = Math.round((contagem[b.certa] / resp) * 100)
  return { id: String(48100 + i * 7 + (b.topico === 't2' ? 3 : b.topico === 't3' ? 5 : 0)), topico: b.topico, enun: b.enun, alts: b.alts, certa: b.certa, recebeu, resp, contagem, tempo: 40 + ((i * 13) % 50) }
})
// IDs do Figma
QUESTOES.find((q) => q.enun.startsWith('A planificação de uma pirâmide de base quadrada'))!.id = '48213'
QUESTOES.find((q) => q.enun === 'Uma pirâmide de base quadrada tem quantas faces ao todo?')!.id = '48107'
export const acertoQ = (q: Questao) => Math.round((q.contagem[q.certa] / q.resp) * 100)
export const topicoPorId = (id: string) => TOPICOS.find((t) => t.id === id)!

/** quem marcou cada alternativa: os melhores desempenhos tendem a acertar */
export function quemMarcou(q: Questao): Aluno[][] {
  const idx = QUESTOES.indexOf(q)
  const pool = [...AVALIADOS]
  const rot = (idx * 5) % pool.length
  const escolhidos = [...pool.slice(rot), ...pool.slice(0, rot)].slice(0, q.resp).sort((a, b) => (b.des ?? 0) - (a.des ?? 0))
  const grupos: Aluno[][] = q.alts.map(() => [])
  let p = 0
  grupos[q.certa] = escolhidos.slice(0, q.contagem[q.certa]).sort((a, b) => a.nome.localeCompare(b.nome))
  p = q.contagem[q.certa]
  q.alts.forEach((_, j) => {
    if (j === q.certa) return
    grupos[j] = escolhidos.slice(p, p + q.contagem[j]).sort((a, b) => a.nome.localeCompare(b.nome))
    p += q.contagem[j]
  })
  return grupos
}

export const fmtT = (s: number) => (s ? `${Math.floor(s / 60)}min ${String(s % 60).padStart(2, '0')}s` : '—')
export const plural = (n: number, s: string, p: string) => `${n} ${n === 1 ? s : p}`

export const GLOSSARIO: [string, string, boolean?][] = [
  ['Interação de Aprendizagem', 'É toda interação do estudante com os objetos de aprendizagem da lição: resumos, vídeos, áudios e quizzes. Cada questão respondida conta como uma interação. Reabrir o mesmo material sem uma nova ação não conta de novo.'],
  ['Desempenho', 'É a taxa de acertos e erros nas questões que o estudante respondeu nos quizzes. Por exemplo, quem respondeu 10 questões e acertou 8 tem desempenho de 80%.'],
  ['Proficiência', 'Representa o nível de aprendizagem do estudante: Insuficiente, Básico, Proficiente, Avançado ou Não avaliado. Ela é definida pelo desempenho nos quizzes, seguindo as regras da plataforma.'],
  ['Aprendizado Adequado', 'Acontece quando o estudante chega à proficiência Proficiente ou Avançado.'],
  ['Tópico Dominado', 'Quando o estudante tem aprendizado adequado em um tópico, esse conteúdo é considerado dominado.'],
  ['Ponto de Aprendizado', 'Mede a evolução da aprendizagem ao longo do tempo. A cada tópico dominado, o estudante ganha 1 ponto de aprendizado, seguindo as regras de classificação da plataforma.'],
  ['Completude', 'É o percentual de conteúdos obrigatórios que o estudante concluiu em relação ao total da lição. Na lição, os obrigatórios são os quizzes de cada tópico.', true],
  ['Consumo de Objetos de Aprendizagem', 'Mostra como as interações dos estudantes se distribuem entre os formatos da lição (resumos, vídeos, áudios e quizzes). Junto vem o alcance de cada formato, ou seja, quantos estudantes o consumiram.', true],
]
