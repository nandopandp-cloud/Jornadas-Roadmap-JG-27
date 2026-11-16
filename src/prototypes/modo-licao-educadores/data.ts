// Modo Lição · Educadores — dados de exemplo do navegável (os mesmos do piloto no Figma ieTkRqY6aFSFcg6llmmxNH).

export type Tipo = 'Resumo' | 'Vídeo' | 'Áudio' | 'Quiz'

export type Estudante = { id: string; nome: string }
export type Turma = { id: string; nome: string; estudantes: Estudante[] }
export type Escola = { id: string; nome: string; turmas: Turma[] }

export type Topico = { id: string; nome: string; bncc: string; desc: string; questoes: number }
export type Unidade = { nome: string; topicos: Topico[] }
export type Disciplina = 'Matemática' | 'História' | 'Português' | 'Ciências' | 'Geografia' | 'Inglês' | 'Arte'

export type Conteudo = {
  id: string
  tipo: Tipo
  titulo: string
  origem: string
  meta: string
  /** resumo autoral (HTML do editor) ou id do resumo da plataforma */
  html?: string
  plataforma?: string
  /** vídeo / áudio do YouTube */
  link?: string
  ytId?: string
  /** áudio enviado */
  arquivo?: { nome: string; tamanho: string; url?: string }
}

export type SelTurma = { modo: 'todos' | 'alguns'; ids: string[] }

export const AGORA = new Date(2026, 10, 16, 10, 0) // 16/11/2026 — "hoje" no protótipo

/* ---------------------------------------------------------------- cores e formatos */
export const DISC: Record<Disciplina, { cor: string; fundo: string }> = {
  Matemática: { cor: '#DC2626', fundo: '#FDE8E8' },
  História: { cor: '#B7791F', fundo: '#FDF3DC' },
  Português: { cor: '#2563EB', fundo: '#E6EEFD' },
  Ciências: { cor: '#15803D', fundo: '#E3F6EA' },
  Geografia: { cor: '#0E7490', fundo: '#E0F4F8' },
  Inglês: { cor: '#7C3AED', fundo: '#F1E9FE' },
  Arte: { cor: '#DB2777', fundo: '#FCE7F3' },
}
export const OBJ: Record<Tipo, { cor: string; fundo: string; dica: string }> = {
  Resumo: { cor: '#7C3AED', fundo: '#F1E9FE', dica: 'Da plataforma ou seu' },
  Vídeo: { cor: '#DC2626', fundo: '#FDE8E8', dica: 'Link do YouTube' },
  Áudio: { cor: '#0E7490', fundo: '#E0F4F8', dica: 'YouTube, MP3 ou MPEG' },
  Quiz: { cor: '#B45309', fundo: '#FEF3C7', dica: 'Obrigatório, já está no tópico' },
}
export const MAX_DISC = 5
export const MAX_NOME = 255
export const MAX_MSG = 1000
export const POUCAS = 10 // abaixo disso o tópico mostra "Poucas questões"

/* ---------------------------------------------------------------- escolas, turmas e estudantes */
const NOMES = [
  'Ana Beatriz Souza', 'Bruno Henrique Lima', 'Carla Mendes', 'Daniel Oliveira', 'Eduarda Santos', 'Felipe Araújo', 'Gabriela Rocha', 'Heitor Nascimento',
  'Isabela Freitas', 'João Pedro Alves', 'Larissa Costa', 'Lucas Ferreira', 'Manuela Ribeiro', 'Mateus Carvalho', 'Nicole Barbosa', 'Otávio Gomes',
  'Pietra Martins', 'Rafael Teixeira', 'Sofia Cardoso', 'Thiago Moreira', 'Valentina Dias', 'Vinícius Pereira', 'Yasmin Correia', 'Arthur Monteiro',
  'Beatriz Lopes', 'Caio Fernandes', 'Davi Ramos', 'Elisa Nunes', 'Enzo Batista', 'Fernanda Castro', 'Gustavo Pinto', 'Helena Vieira',
  'Igor Machado', 'Júlia Campos', 'Kauã Moura', 'Lívia Azevedo', 'Miguel Duarte', 'Natália Rezende', 'Pedro Henrique Cunha', 'Rebeca Farias',
]
const gera = (prefixo: string, n: number, desloc: number): Estudante[] =>
  Array.from({ length: n }, (_, i) => ({ id: `${prefixo}-${i + 1}`, nome: NOMES[(i + desloc) % NOMES.length] })).sort((a, b) => a.nome.localeCompare(b.nome))

export const ESCOLAS: Escola[] = [
  {
    id: 'jardim',
    nome: 'EE Jardim das Árvores',
    turmas: [
      { id: '6a', nome: '6º ano A', estudantes: gera('6a', 32, 0) },
      { id: '6b', nome: '6º ano B', estudantes: gera('6b', 30, 0) },
      { id: '6c', nome: '6º ano C', estudantes: gera('6c', 29, 11) },
    ],
  },
  {
    id: 'lobato',
    nome: 'EMEF Monteiro Lobato',
    turmas: [
      { id: 'ml-6a', nome: '6º ano A', estudantes: gera('ml6a', 28, 5) },
      { id: 'ml-6b', nome: '6º ano B', estudantes: gera('ml6b', 27, 17) },
    ],
  },
]
export const turmaPorId = (id: string) => {
  for (const e of ESCOLAS) for (const t of e.turmas) if (t.id === id) return { escola: e, turma: t }
  return null
}
/** 12 estudantes escolhidos no 6º ano B, como no Figma */
const B = ESCOLAS[0].turmas[1].estudantes
const ESCOLHIDOS_B = ['Ana Beatriz Souza', 'Bruno Henrique Lima', 'Daniel Oliveira', 'Eduarda Santos', 'Gabriela Rocha', 'Isabela Freitas', 'João Pedro Alves', 'Lucas Ferreira', 'Mateus Carvalho', 'Pietra Martins', 'Sofia Cardoso', 'Valentina Dias']
export const SEL_INICIAL: Record<string, SelTurma> = {
  '6a': { modo: 'todos', ids: [] },
  '6b': { modo: 'alguns', ids: B.filter((s) => ESCOLHIDOS_B.includes(s.nome)).map((s) => s.id) },
}

/* ---------------------------------------------------------------- base pedagógica (6º ano) */
let n = 0
const t = (nome: string, bncc: string, desc: string, questoes = 24 + ((n * 7) % 30)): Topico => ({ id: `t${++n}`, nome, bncc, desc, questoes })

export const CATALOGO: Record<Disciplina, Unidade[]> = {
  Matemática: [
    {
      nome: 'Geometria',
      topicos: [
        { ...t('Pirâmides: geometria espacial e suas aplicações', 'EF06MA17', 'Quantificar e estabelecer relações entre o número de vértices, faces e arestas de prismas e pirâmides.'), questoes: 48 },
        { ...t('Planificação de prismas e pirâmides', 'EF06MA17', 'Reconhecer planificações de prismas e pirâmides e relacioná-las aos sólidos.'), questoes: 6 },
        t('Polígonos: classificação e propriedades', 'EF06MA18', 'Reconhecer, nomear e comparar polígonos, considerando lados, vértices e ângulos.'),
        t('Ângulos: medidas e construção', 'EF06MA25', 'Reconhecer a abertura do ângulo como grandeza associada às figuras geométricas.'),
        t('Plano cartesiano', 'EF06MA16', 'Associar pares ordenados de números a pontos do plano cartesiano do 1º quadrante.'),
        t('Retas paralelas e perpendiculares', 'EF06MA22', 'Utilizar instrumentos para construir retas paralelas e perpendiculares.'),
      ],
    },
    {
      nome: 'Números',
      topicos: [
        t('Sistema de numeração decimal', 'EF06MA02', 'Reconhecer o sistema de numeração decimal e suas características.'),
        t('Frações: equivalência e comparação', 'EF06MA07', 'Compreender, comparar e ordenar frações associadas às ideias de partes de inteiros.'),
        t('Números decimais e operações', 'EF06MA11', 'Resolver problemas com números racionais na forma decimal.'),
        t('Múltiplos e divisores', 'EF06MA05', 'Classificar números naturais em primos e compostos e estabelecer relações entre eles.'),
        t('Porcentagem', 'EF06MA13', 'Resolver problemas que envolvam porcentagens, com base na ideia de proporcionalidade.'),
      ],
    },
    {
      nome: 'Álgebra',
      topicos: [
        t('Propriedades da igualdade', 'EF06MA14', 'Reconhecer que a relação de igualdade se mantém ao operar os dois membros.'),
        t('Partilha em partes desiguais', 'EF06MA15', 'Resolver problemas de partilha de uma quantidade em duas partes desiguais.'),
      ],
    },
    {
      nome: 'Grandezas e medidas',
      topicos: [
        t('Perímetro e área de figuras planas', 'EF06MA29', 'Analisar e descrever mudanças no perímetro e na área de um quadrado ao alterar seus lados.'),
        t('Volume de blocos retangulares', 'EF06MA24', 'Resolver problemas com grandezas como comprimento, massa, tempo, temperatura, área e volume.'),
      ],
    },
    {
      nome: 'Probabilidade e estatística',
      topicos: [
        t('Leitura de tabelas e gráficos', 'EF06MA31', 'Identificar as variáveis e suas frequências e os elementos de gráficos.'),
        t('Probabilidade de eventos', 'EF06MA30', 'Calcular a probabilidade de um evento aleatório, expressando-a por número racional.'),
      ],
    },
  ],
  História: [
    {
      nome: 'A invenção do mundo clássico e outras sociedades',
      topicos: [
        { ...t('As pirâmides do Egito', 'EF06HI07', 'Identificar aspectos e formas de registro das sociedades antigas na África, no Oriente Médio e nas Américas.'), questoes: 36 },
        t('A Mesopotâmia e a escrita cuneiforme', 'EF06HI07', 'Identificar formas de registro das sociedades antigas do Oriente Médio.'),
        t('Grécia antiga: a pólis e a democracia', 'EF06HI10', 'Explicar a formação da Grécia Antiga, com ênfase na formação da pólis.'),
        t('Roma: da República ao Império', 'EF06HI11', 'Caracterizar o processo de formação da Roma Antiga e suas configurações sociais.'),
      ],
    },
    {
      nome: 'História: tempo, espaço e formas de registros',
      topicos: [
        t('Fontes históricas', 'EF06HI02', 'Identificar a gênese da produção do saber histórico e analisar o significado das fontes.'),
        t('Linha do tempo e calendários', 'EF06HI01', 'Identificar diferentes formas de compreensão da noção de tempo e de periodização.'),
      ],
    },
  ],
  Português: [
    {
      nome: 'Leitura',
      topicos: [
        t('Gêneros jornalísticos: a notícia', 'EF67LP03', 'Comparar informações sobre um mesmo fato divulgadas em diferentes veículos e mídias.'),
        t('Efeitos de sentido', 'EF67LP07', 'Identificar o uso de recursos persuasivos em textos argumentativos.'),
      ],
    },
    {
      nome: 'Análise linguística/semiótica',
      topicos: [
        t('Substantivos e adjetivos', 'EF06LP04', 'Analisar a função e as flexões de substantivos e adjetivos.'),
        t('Pontuação e sentido', 'EF67LP33', 'Pontuar textos adequadamente.'),
      ],
    },
  ],
  Ciências: [
    {
      nome: 'Terra e Universo',
      topicos: [
        t('Camadas da Terra', 'EF06CI11', 'Identificar as diferentes camadas que estruturam o planeta Terra.'),
        t('Rochas e fósseis', 'EF06CI12', 'Identificar diferentes tipos de rocha e relacionar a formação de fósseis a rochas sedimentares.'),
      ],
    },
    {
      nome: 'Matéria e energia',
      topicos: [t('Misturas homogêneas e heterogêneas', 'EF06CI01', 'Classificar como homogênea ou heterogênea a mistura de dois ou mais materiais.')],
    },
  ],
  Geografia: [
    {
      nome: 'O sujeito e seu lugar no mundo',
      topicos: [t('Paisagens e transformações', 'EF06GE01', 'Comparar modificações das paisagens nos lugares de vivência.')],
    },
    {
      nome: 'Formas de representação e pensamento espacial',
      topicos: [t('Escala e mapas', 'EF06GE08', 'Medir distâncias na superfície pelas escalas gráficas e numéricas dos mapas.')],
    },
  ],
  Inglês: [
    {
      nome: 'Oralidade',
      topicos: [t('Greetings and introductions', 'EF06LI01', 'Interagir em situações de intercâmbio oral, demonstrando iniciativa.')],
    },
  ],
  Arte: [
    {
      nome: 'Artes visuais',
      topicos: [t('Arte egípcia e representação', 'EF69AR01', 'Pesquisar, apreciar e analisar formas distintas das artes visuais em diferentes épocas.')],
    },
  ],
}
export const DISCIPLINAS = Object.keys(CATALOGO) as Disciplina[]
export const topicoPorId = (id: string): { disc: Disciplina; unidade: string; topico: Topico } | null => {
  for (const d of DISCIPLINAS) for (const u of CATALOGO[d]) for (const tp of u.topicos) if (tp.id === id) return { disc: d, unidade: u.nome, topico: tp }
  return null
}
const idPorNome = (nome: string) => DISCIPLINAS.flatMap((d) => CATALOGO[d].flatMap((u) => u.topicos)).find((x) => x.nome === nome)!.id
export const T_PIRAMIDES = idPorNome('Pirâmides: geometria espacial e suas aplicações')
export const T_PLANIF = idPorNome('Planificação de prismas e pirâmides')
export const T_EGITO = idPorNome('As pirâmides do Egito')

/* ---------------------------------------------------------------- exemplos de questões */
export type Questao = { enunciado: string; alternativas: string[]; certa: number }
const EXEMPLOS: Record<string, Questao[]> = {
  [T_PIRAMIDES]: [
    { enunciado: 'Uma pirâmide de base quadrada tem quantas faces ao todo?', alternativas: ['4 faces', '5 faces', '6 faces', '8 faces'], certa: 1 },
    { enunciado: 'Quantas arestas tem uma pirâmide de base triangular?', alternativas: ['4 arestas', '5 arestas', '6 arestas', '9 arestas'], certa: 2 },
    { enunciado: 'As pirâmides de Gizé têm base quadrada. Quantos vértices tem cada uma delas?', alternativas: ['4 vértices', '5 vértices', '6 vértices', '8 vértices'], certa: 1 },
    { enunciado: 'Uma pirâmide tem base hexagonal. Quantas faces laterais ela tem?', alternativas: ['5', '6', '7', '12'], certa: 1 },
    { enunciado: 'Qual relação vale para qualquer pirâmide? (V = vértices, F = faces, A = arestas)', alternativas: ['V + F = A + 2', 'V + A = F + 2', 'F + A = V + 2', 'V = F + A'], certa: 0 },
  ],
  [T_PLANIF]: [
    { enunciado: 'A planificação de uma pirâmide de base quadrada é formada por:', alternativas: ['1 quadrado e 4 triângulos', '2 quadrados e 4 retângulos', '4 quadrados', '1 triângulo e 4 quadrados'], certa: 0 },
    { enunciado: 'Quantos retângulos tem a planificação de um prisma de base triangular?', alternativas: ['2', '3', '4', '6'], certa: 1 },
  ],
  [T_EGITO]: [
    { enunciado: 'As pirâmides de Gizé foram construídas principalmente para:', alternativas: ['Servir de túmulo para os faraós', 'Armazenar grãos', 'Abrigar o exército', 'Observar as estrelas'], certa: 0 },
    { enunciado: 'Qual rio foi essencial para a civilização egípcia antiga?', alternativas: ['Tigre', 'Eufrates', 'Nilo', 'Jordão'], certa: 2 },
    { enunciado: 'A escrita usada nos templos e túmulos do Egito antigo é chamada de:', alternativas: ['Cuneiforme', 'Hieroglífica', 'Alfabética grega', 'Rúnica'], certa: 1 },
  ],
}
export function exemplos(topicoId: string, rodada: number): Questao[] {
  const tp = topicoPorId(topicoId)
  const lista = EXEMPLOS[topicoId] ?? [
    { enunciado: `Sobre “${tp?.topico.nome}”, qual das afirmações abaixo está correta?`, alternativas: ['Afirmação A', 'Afirmação B', 'Afirmação C', 'Afirmação D'], certa: 2 },
    { enunciado: `Leia a situação-problema e responda: qual alternativa aplica corretamente o conteúdo de “${tp?.topico.nome}”?`, alternativas: ['Alternativa A', 'Alternativa B', 'Alternativa C', 'Alternativa D'], certa: 0 },
  ]
  if (lista.length <= 3) return lista
  const ini = (rodada * 3) % lista.length
  return [0, 1, 2].map((k) => lista[(ini + k) % lista.length])
}

/* ---------------------------------------------------------------- resumos da plataforma */
export type ResumoPlataforma = { id: string; titulo: string; meta: string; trecho: string; img?: boolean }
export const RESUMOS: Record<string, ResumoPlataforma[]> = {
  [T_PIRAMIDES]: [
    { id: 'r1', titulo: 'Pirâmides e prismas: elementos e classificação', meta: '5 min de leitura · 3 imagens', trecho: 'Prismas e pirâmides são poliedros: sólidos formados só por faces planas. O prisma tem duas bases iguais e paralelas; a pirâmide tem uma base e um vértice no topo, onde todas as faces laterais se encontram.', img: true },
    { id: 'r2', titulo: 'Sólidos geométricos no dia a dia', meta: '4 min de leitura · 2 imagens', trecho: 'Caixas, dados, telhados e até barracas de acampamento: os sólidos geométricos estão por toda parte. Reconhecer suas faces, arestas e vértices ajuda a entender como eles são construídos.' },
    { id: 'r3', titulo: 'Contando faces, arestas e vértices', meta: '3 min de leitura · 1 imagem', trecho: 'Para contar os elementos de uma pirâmide, comece pela base: uma base com n lados gera n faces laterais, 2n arestas e n + 1 vértices.' },
  ],
  [T_EGITO]: [
    { id: 'r4', titulo: 'As pirâmides do Egito', meta: '6 min de leitura · 4 imagens', trecho: 'As pirâmides de Gizé foram construídas há mais de 4.500 anos como túmulos dos faraós Quéops, Quéfren e Miquerinos. Elas mostram o conhecimento dos egípcios em matemática, astronomia e engenharia.', img: true },
    { id: 'r5', titulo: 'O Egito antigo e o rio Nilo', meta: '4 min de leitura · 2 imagens', trecho: 'As cheias do Nilo fertilizavam as margens do rio e permitiram o desenvolvimento da agricultura, base da sociedade egípcia.' },
  ],
}
export const resumosDe = (topicoId: string): ResumoPlataforma[] => {
  const tp = topicoPorId(topicoId)
  return RESUMOS[topicoId] ?? (tp ? [{ id: `rp-${topicoId}`, titulo: tp.topico.nome, meta: '4 min de leitura', trecho: tp.topico.desc }] : [])
}

/* ---------------------------------------------------------------- YouTube */
export const ytId = (url: string): string | null => {
  const m = url.trim().match(/^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})(?:[?&#].*)?$/)
  return m ? m[1] : null
}
export const VIDEO_EXEMPLO = { link: 'https://www.youtube.com/watch?v=Fq4Zk3pBh2E', id: 'Fq4Zk3pBh2E', titulo: 'Como as pirâmides foram construídas?', canal: 'Canal História em Foco', duracao: '12:48' }
export const AUDIO_EXEMPLO = { link: 'https://youtu.be/Qm8r2VtYk1A', id: 'Qm8r2VtYk1A', titulo: 'Pirâmides do Egito: os segredos de uma civilização milenar', canal: 'Podcast Histórias do Mundo', duracao: '4:12' }

/* ---------------------------------------------------------------- lição inicial (igual ao Figma) */
export const RESUMO_AUTORAL_HTML =
  '<h3>O que é uma pirâmide?</h3><p>A pirâmide é um sólido geométrico formado por uma base, que é um polígono, e por faces laterais triangulares que se encontram em um mesmo ponto: o vértice da pirâmide.</p><p><img src="./lic/piramide.jpg" alt="Pirâmides de Gizé"></p><ul><li>Faces: a base + as faces laterais (numa pirâmide de base quadrada, 5 faces).</li><li>Arestas: os segmentos onde as faces se encontram (8 arestas).</li><li>Vértices: os “cantos” da pirâmide (5 vértices).</li></ul><p>Dica: conte as faces, as arestas e os vértices de uma caixa de sapatos e compare com a pirâmide.</p>'

export const MENSAGEM_INICIAL =
  'Olá, turminha!\n\nNesta lição, vocês vão aprender mais sobre as pirâmides e descobrir a relação entre História e Matemática. Leiam os conteúdos com atenção, respondam com calma e aproveitem esse momento de aprendizagem.\n\nBoa atividade!'

let seq = 100
export const novoId = () => `c${++seq}`

/** quiz obrigatório do tópico: entra sozinho, fica no fim, não sai e não muda de ordem */
export const quizDe = (tp: Topico): Conteudo => ({
  id: `quiz-${tp.id}`,
  tipo: 'Quiz',
  titulo: 'Questões sorteadas para cada estudante',
  origem: 'obrigatório · automático',
  meta: tp.questoes < POUCAS ? `O banco tem só ${tp.questoes} questões deste tópico. Alguns estudantes podem receber questões iguais.` : `O banco tem ${tp.questoes} questões deste tópico. Cada estudante recebe uma combinação diferente.`,
})

/** só os conteúdos opcionais (resumo, vídeo, áudio). O quiz é obrigatório e fixo: vem do tópico (quizDe). */
export function conteudosIniciais(): Record<string, Conteudo[]> {
  return {
    [T_PIRAMIDES]: [
      { id: novoId(), tipo: 'Resumo', titulo: 'Pirâmides: faces, arestas e vértices', origem: 'criado por você', meta: 'Texto com 1 imagem · cerca de 2 min de leitura', html: RESUMO_AUTORAL_HTML },
      { id: novoId(), tipo: 'Vídeo', titulo: VIDEO_EXEMPLO.titulo, origem: 'YouTube', meta: `youtube.com/watch?v=${VIDEO_EXEMPLO.id} · ${VIDEO_EXEMPLO.duracao}`, link: VIDEO_EXEMPLO.link, ytId: VIDEO_EXEMPLO.id },
    ],
    [T_PLANIF]: [],
    [T_EGITO]: [
      { id: novoId(), tipo: 'Resumo', titulo: 'As pirâmides do Egito', origem: 'da plataforma', meta: '6 min de leitura · 4 imagens', plataforma: 'r4' },
      { id: novoId(), tipo: 'Áudio', titulo: AUDIO_EXEMPLO.titulo, origem: 'arquivo enviado', meta: 'MP3 · 4,2 MB · 4:12', arquivo: { nome: 'piramides-do-egito.mp3', tamanho: '4,2 MB' } },
    ],
  }
}

export const fmtData = (iso: string) => {
  if (!iso) return '—'
  const [a, m, d] = iso.split('-')
  return `${d}/${m}/${a}`
}
export const dataHora = (d: string, h: string) => (d && h ? new Date(`${d}T${h}:00`) : null)
export const plural = (n: number, s: string, p: string) => `${n} ${n === 1 ? s : p}`
