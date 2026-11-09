/* =====================================================================
   Instrumento do Teste Vocacional (METODOLOGIA.md §2 a §6)
   Repositório do instrumento: perguntas, opções, dimensões e versões.
   Fica separado da interface para a metodologia evoluir sem refazer as telas.
   ===================================================================== */

export const VERSAO_INSTRUMENTO = 'TV-GX 1.0 · piloto'
export const VERSAO_REGRAS = 'REC 1.0'

export type Dim = 'R' | 'I' | 'A' | 'S' | 'E' | 'C'
export const DIMS: Dim[] = ['R', 'I', 'A', 'S', 'E', 'C']

/** nomes em linguagem simples (a sigla RIASEC aparece só como apoio) */
export const DIM: Record<Dim, { nome: string; tecnico: string; curto: string; cor: string; claro: string; icone: string; descricao: string; atividades: string }> = {
  R: {
    nome: 'Fazer e construir',
    tecnico: 'Realista',
    curto: 'construir',
    cor: '#e8701a',
    claro: '#fff1e5',
    icone: './voc/hammer-and-wrench.webp',
    descricao: 'Interesse por atividades práticas, técnicas e concretas, com ferramentas, equipamentos ou materiais.',
    atividades: 'montar, ajustar, operar e ver o resultado do seu trabalho na prática',
  },
  I: {
    nome: 'Investigar e analisar',
    tecnico: 'Investigativo',
    curto: 'investigar',
    cor: '#2f7de1',
    claro: '#e7f1fd',
    icone: './voc/microscope.webp',
    descricao: 'Interesse por pesquisa, análise, evidências e resolução de problemas complexos.',
    atividades: 'entender por que as coisas acontecem, analisar dados e testar hipóteses',
  },
  A: {
    nome: 'Criar e expressar',
    tecnico: 'Artístico',
    curto: 'criar',
    cor: '#c0359e',
    claro: '#fbe9f6',
    icone: './voc/fountain-pen.webp',
    descricao: 'Interesse por criação, expressão, experimentação, imaginação e soluções originais.',
    atividades: 'criar, experimentar linguagens e comunicar ideias de um jeito próprio',
  },
  S: {
    nome: 'Ajudar e ensinar',
    tecnico: 'Social',
    curto: 'ajudar',
    cor: '#17985a',
    claro: '#e3f6ec',
    icone: './voc/handshake.webp',
    descricao: 'Interesse por ensinar, orientar, colaborar e apoiar o desenvolvimento de pessoas.',
    atividades: 'explicar, orientar, cuidar e trabalhar junto com outras pessoas',
  },
  E: {
    nome: 'Liderar e empreender',
    tecnico: 'Empreendedor',
    curto: 'liderar',
    cor: '#e0364f',
    claro: '#fdeaed',
    icone: './voc/megaphone.webp',
    descricao: 'Interesse por iniciativa, liderança, influência, negociação e mobilização de pessoas ou recursos.',
    atividades: 'tomar a iniciativa, convencer, negociar e colocar ideias em prática',
  },
  C: {
    nome: 'Organizar e planejar',
    tecnico: 'Convencional',
    curto: 'organizar',
    cor: '#7a5af5',
    claro: '#efeafe',
    icone: './voc/card-index-dividers.webp',
    descricao: 'Interesse por organização, dados, registros, processos, planejamento e execução estruturada.',
    atividades: 'organizar informações, estruturar processos e acompanhar resultados',
  },
}

export type Bloco = 'A' | 'B' | 'C' | 'D'
export const BLOCO: Record<Bloco, { nome: string; titulo: string; instrucao: string; icone: string; resumo: string }> = {
  A: {
    nome: 'Interesses',
    titulo: 'O que você gostaria de fazer',
    instrucao: 'Leia cada atividade e indique quanto você gostaria de realizá-la. Pense no seu interesse, não em quanto você acha que já sabe fazer.',
    icone: './voc/light-bulb.webp',
    resumo: '30 atividades do dia a dia de diferentes profissões',
  },
  B: {
    nome: 'Valores',
    titulo: 'O que é importante para você',
    instrucao: 'O quanto cada aspecto seria importante para você ao escolher uma profissão ou ambiente de trabalho?',
    icone: './voc/compass.webp',
    resumo: '8 aspectos da vida profissional',
  },
  C: {
    nome: 'Preferências',
    titulo: 'Como você imagina seu trabalho',
    instrucao: 'Em cada par, escolha a opção que combina mais com o que você imagina preferir hoje. Não existe resposta certa ou errada.',
    icone: './voc/world-map.webp',
    resumo: '6 escolhas entre dois contextos de trabalho',
  },
  D: {
    nome: 'Habilidades',
    titulo: 'Como você se vê hoje',
    instrucao: 'Como você avalia atualmente cada uma destas habilidades? É a sua percepção, não uma prova.',
    icone: './voc/puzzle-piece.webp',
    resumo: '8 habilidades e até 3 que você quer desenvolver',
  },
}

export const ESCALA: Record<'interesse' | 'importancia' | 'habilidade', string[]> = {
  interesse: ['Não gostaria nada', 'Gostaria pouco', 'Talvez / indiferente', 'Gostaria bastante', 'Gostaria muito'],
  importancia: ['Nada importante', 'Pouco importante', 'Moderadamente importante', 'Muito importante', 'Extremamente importante'],
  habilidade: ['Ainda tenho muita dificuldade', 'Tenho alguma dificuldade', 'Estou desenvolvendo', 'Tenho facilidade', 'Tenho muita facilidade'],
}

export type Item =
  | { id: string; bloco: 'A'; dim: Dim; texto: string; tipo: 'escala'; escala: 'interesse' }
  | { id: string; bloco: 'B'; texto: string; curto: string; tipo: 'escala'; escala: 'importancia' }
  | { id: string; bloco: 'C'; texto: string; tipo: 'par'; a: string; b: string; rotulos: [string, string] }
  | { id: string; bloco: 'D'; texto: string; tipo: 'escala'; escala: 'habilidade' }
  | { id: 'H-DEV'; bloco: 'D'; texto: string; tipo: 'multipla'; max: number }

const A = (id: string, dim: Dim, texto: string): Item => ({ id, bloco: 'A', dim, texto, tipo: 'escala', escala: 'interesse' })

const BLOCO_A: Item[] = [
  A('R01', 'R', 'Montar, ajustar ou consertar equipamentos e objetos.'),
  A('R02', 'R', 'Desenvolver projetos que envolvam ferramentas, materiais ou componentes físicos.'),
  A('R03', 'R', 'Realizar atividades práticas em laboratórios, oficinas ou ambientes técnicos.'),
  A('R04', 'R', 'Trabalhar com máquinas, equipamentos ou tecnologias aplicadas.'),
  A('R05', 'R', 'Desenvolver projetos que resultem em algo concreto e observável.'),
  A('I01', 'I', 'Investigar por que um problema acontece antes de tentar resolvê-lo.'),
  A('I02', 'I', 'Analisar informações ou dados para identificar padrões.'),
  A('I03', 'I', 'Formular hipóteses e buscar evidências para verificá-las.'),
  A('I04', 'I', 'Estudar fenômenos científicos, sociais ou tecnológicos para compreendê-los.'),
  A('I05', 'I', 'Resolver problemas complexos que exigem pesquisa e raciocínio lógico.'),
  A('A01', 'A', 'Criar peças visuais, ilustrações ou composições gráficas.'),
  A('A02', 'A', 'Desenvolver histórias, textos, roteiros ou outras formas de expressão.'),
  A('A03', 'A', 'Criar soluções originais para problemas que não têm uma única resposta.'),
  A('A04', 'A', 'Experimentar linguagens, materiais ou formatos para comunicar uma ideia.'),
  A('A05', 'A', 'Desenvolver projetos que envolvam imaginação, estética ou expressão criativa.'),
  A('S01', 'S', 'Ajudar alguém a compreender um assunto difícil.'),
  A('S02', 'S', 'Orientar pessoas que estão aprendendo uma nova habilidade.'),
  A('S03', 'S', 'Participar de projetos que melhorem a vida de outras pessoas.'),
  A('S04', 'S', 'Facilitar conversas ou atividades para promover a colaboração de um grupo.'),
  A('S05', 'S', 'Apoiar o desenvolvimento de alguém e ajudá-lo a superar dificuldades.'),
  A('E01', 'E', 'Liderar um projeto e organizar pessoas para alcançar um objetivo.'),
  A('E02', 'E', 'Apresentar uma ideia e convencer outras pessoas de seu valor.'),
  A('E03', 'E', 'Negociar alternativas entre pessoas com interesses diferentes.'),
  A('E04', 'E', 'Identificar uma oportunidade e propor uma iniciativa.'),
  A('E05', 'E', 'Tomar a iniciativa de organizar recursos e pessoas para colocar uma ideia em prática.'),
  A('C01', 'C', 'Organizar informações para que sejam fáceis de localizar e utilizar.'),
  A('C02', 'C', 'Conferir dados ou documentos para identificar inconsistências e erros.'),
  A('C03', 'C', 'Estruturar processos, procedimentos ou etapas de trabalho.'),
  A('C04', 'C', 'Trabalhar com planilhas, registros ou sistemas de informação para acompanhar resultados.'),
  A('C05', 'C', 'Planejar etapas e monitorar tarefas para garantir sua execução correta.'),
]

/**
 * Ordem de exibição do Bloco A: intercalada entre as dimensões (R I A S E C, R I A S E C…),
 * para o estudante não responder cinco itens seguidos da mesma área.
 */
const ORDEM_A = [0, 1, 2, 3, 4].flatMap((n) => [0, 1, 2, 3, 4, 5].map((d) => BLOCO_A[d * 5 + n]))

const V = (id: string, texto: string, curto: string): Item => ({ id, bloco: 'B', texto, curto, tipo: 'escala', escala: 'importancia' })
const BLOCO_B: Item[] = [
  V('V01', 'Ter estabilidade e previsibilidade no trabalho.', 'Estabilidade'),
  V('V02', 'Ter potencial de remuneração compatível com meus objetivos.', 'Remuneração'),
  V('V03', 'Ter autonomia para tomar decisões e escolher como realizar tarefas.', 'Autonomia'),
  V('V04', 'Contribuir para a sociedade ou para a vida de outras pessoas.', 'Impacto social'),
  V('V05', 'Ter espaço para criatividade e novas ideias.', 'Criatividade'),
  V('V06', 'Aprender continuamente e desenvolver novos conhecimentos.', 'Aprendizado contínuo'),
  V('V07', 'Ter reconhecimento pelas minhas contribuições.', 'Reconhecimento'),
  V('V08', 'Ter flexibilidade de horários ou de local de trabalho.', 'Flexibilidade'),
]

const P = (id: string, a: string, b: string, rotulos: [string, string]): Item => ({ id, bloco: 'C', texto: 'O que combina mais com você hoje?', tipo: 'par', a, b, rotulos })
const BLOCO_C: Item[] = [
  P('P01', 'Interagir frequentemente com outras pessoas', 'Ter períodos mais longos de concentração individual', ['Com pessoas', 'Concentração individual']),
  P('P02', 'Trabalhar com rotinas e processos definidos', 'Trabalhar com atividades que mudam com frequência', ['Rotina definida', 'Atividades variadas']),
  P('P03', 'Obter resultados práticos e concretos', 'Trabalhar com ideias, conceitos e análises', ['Resultados práticos', 'Ideias e análises']),
  P('P04', 'Executar objetivos e procedimentos já definidos', 'Ajudar a definir objetivos e construir soluções', ['Executar o definido', 'Definir e construir']),
  P('P05', 'Aprofundar-se em um tema específico', 'Alternar entre diferentes temas e atividades', ['Aprofundar um tema', 'Alternar temas']),
  P('P06', 'Atuar presencialmente ou em campo', 'Atuar predominantemente em ambiente digital ou remoto', ['Presencial ou campo', 'Digital ou remoto']),
]

export const HABILIDADES: { id: string; nome: string }[] = [
  { id: 'H01', nome: 'Raciocínio analítico' },
  { id: 'H02', nome: 'Criatividade' },
  { id: 'H03', nome: 'Comunicação' },
  { id: 'H04', nome: 'Organização' },
  { id: 'H05', nome: 'Colaboração' },
  { id: 'H06', nome: 'Investigação e pesquisa' },
  { id: 'H07', nome: 'Iniciativa' },
  { id: 'H08', nome: 'Aprender por meio da prática' },
]
const BLOCO_D: Item[] = [
  ...HABILIDADES.map((h): Item => ({ id: h.id, bloco: 'D', texto: h.nome, tipo: 'escala', escala: 'habilidade' })),
  { id: 'H-DEV', bloco: 'D', texto: 'Quais até três habilidades você mais gostaria de desenvolver?', tipo: 'multipla', max: 3 },
]

/** sequência de exibição (52 itens + a pergunta complementar de habilidades) */
export const ITENS: Item[] = [...ORDEM_A, ...BLOCO_B, ...BLOCO_C, ...BLOCO_D]
export const ITEM: Record<string, Item> = Object.fromEntries(ITENS.map((i) => [i.id, i]))
export const BLOCOS: Bloco[] = ['A', 'B', 'C', 'D']
export const itensDo = (b: Bloco) => ITENS.filter((i) => i.bloco === b)
/** os 30 itens RIASEC e os 8 valores são obrigatórios para o perfil; o resto contextualiza */
export const obrigatorio = (i: Item) => i.bloco === 'A' || i.bloco === 'B' || (i.bloco === 'D' && i.tipo === 'escala') || i.bloco === 'C'
export const TOTAL = ITENS.length

/** respostas: 1–5 nas escalas, 'a' | 'b' nos pares, lista de ids na múltipla */
export type Resposta = number | 'a' | 'b' | string[]
export type Respostas = Record<string, Resposta>

export const respondido = (r: Respostas, id: string) => {
  const v = r[id]
  if (Array.isArray(v)) return v.length > 0
  return v !== undefined
}

/** os 52 itens do instrumento (a escolha de habilidades a desenvolver é complementar) */
export const N_ITENS = ITENS.filter((i) => i.id !== 'H-DEV').length
export const contar = (r: Respostas) => ITENS.filter((i) => i.id !== 'H-DEV' && respondido(r, i.id)).length

/* ---------------- clareza (PRD §3.4) ---------------- */
export const CLAREZA_PERGUNTA = 'Quanto você sente que sabe quais caminhos profissionais gostaria de explorar?'
export const CLAREZA: { v: number; texto: string; emoji: string }[] = [
  { v: 1, texto: 'Ainda não tenho nenhuma clareza', emoji: './voc/crystal-ball.webp' },
  { v: 2, texto: 'Tenho poucas ideias', emoji: './voc/thinking-face.webp' },
  { v: 3, texto: 'Tenho algumas possibilidades em mente', emoji: './voc/light-bulb.webp' },
  { v: 4, texto: 'Tenho boas possibilidades para explorar', emoji: './voc/world-map.webp' },
  { v: 5, texto: 'Tenho bastante clareza sobre meus próximos passos', emoji: './voc/rocket.webp' },
]
