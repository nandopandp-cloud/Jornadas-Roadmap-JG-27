/* Conteúdo do protótipo de Alfabetização (1º e 2º ano). */

export type PickOption = { id: string; img?: string; letter?: string; label: string; ok?: boolean }

export type Level = {
  id: string
  node: { img?: string; letter?: string }
  title: string
  intro: { img?: string; letter?: string; word: string; syllables: string[]; say: string; gallery?: { img: string; label: string }[] }
  challenge:
    | { type: 'pick'; say: string; prompt: string; options: PickOption[]; hint: string }
    | { type: 'letter'; say: string; prompt: string; word: string; options: PickOption[]; hint: string }
    | { type: 'build'; say: string; prompt: string; word: string; img: string; hint: string }
    | { type: 'word'; say: string; prompt: string; img: string; options: PickOption[]; hint: string }
  achievement?: string
}

/* ---------------- Trilha ABC ---------------- */
const ABC: Level[] = [
  {
    id: 'a',
    node: { letter: 'A' },
    title: 'Letra A',
    intro: { letter: 'A', word: 'A', syllables: ['A'], say: 'Esta é a letra A! A de abelha, A de avião! Toque no botão para jogar.' },
    challenge: {
      type: 'pick',
      say: 'Onde está a letra A? Toque nela!',
      prompt: 'Onde está a letra A?',
      hint: 'A letra A parece um telhadinho com um tracinho no meio!',
      options: [
        { id: 'E', letter: 'E', label: 'E' },
        { id: 'A', letter: 'A', label: 'A', ok: true },
        { id: 'O', letter: 'O', label: 'O' },
      ],
    },
    achievement: 'mestre-letras',
  },
  {
    id: 'maca',
    node: { img: 'obj-apple' },
    title: 'Maçã',
    intro: { img: 'obj-apple', word: 'MAÇÃ', syllables: ['MA', 'ÇÃ'], say: 'Esta é a maçã! Ma, çã. Maçã! Toque no botão para jogar.' },
    challenge: {
      type: 'pick',
      say: 'Qual destas é a maçã? Toque nela!',
      prompt: 'Qual é a maçã?',
      hint: 'A maçã é vermelhinha e tem uma folha verde!',
      options: [
        { id: 'apple', img: 'obj-apple', label: 'Maçã', ok: true },
        { id: 'dog', img: 'obj-dog', label: 'Cachorro' },
        { id: 'ball', img: 'obj-ball', label: 'Bola' },
      ],
    },
  },
  {
    id: 'abelha',
    node: { img: 'obj-bee' },
    title: 'Abelha',
    intro: { img: 'obj-bee', word: 'ABELHA', syllables: ['A', 'BE', 'LHA'], say: 'A abelha faz bzzz! A, be, lha. Abelha!' },
    challenge: {
      type: 'letter',
      say: 'Qual letra está faltando no começo de abelha?',
      prompt: 'Complete a palavra',
      word: '_BELHA',
      hint: 'Abelha começa igualzinho a avião!',
      options: [
        { id: 'E', letter: 'E', label: 'E' },
        { id: 'A', letter: 'A', label: 'A', ok: true },
        { id: 'O', letter: 'O', label: 'O' },
      ],
    },
  },
  {
    id: 'casa',
    node: { img: 'obj-house' },
    title: 'Casa',
    intro: { img: 'obj-house', word: 'CASA', syllables: ['CA', 'SA'], say: 'Esta é a casa! Ca, sa. Casa!' },
    challenge: {
      type: 'build',
      say: 'Arraste as letras e forme a palavra casa.',
      prompt: 'Forme a palavra CASA',
      word: 'CASA',
      img: 'obj-house',
      hint: 'Casa começa com C, de cachorro!',
    },
    achievement: 'explorador',
  },
]

/* ---------------- Trilha de Leitura: ler a palavra da figura ---------------- */
const wordLevel = (id: string, img: string, title: string, word: string, syllables: string[], wrong: [string, string], hint: string): Level => ({
  id,
  node: { img },
  title,
  intro: { img, word, syllables, say: `${syllables.map((s) => s.toLowerCase()).join(', ')}. ${title}! Agora vamos ler essa palavra.` },
  challenge: {
    type: 'word',
    say: `Qual destas palavras é ${title.toLowerCase()}? Toque nela!`,
    prompt: 'Qual palavra é esta?',
    img,
    hint,
    options: [
      { id: wrong[0], letter: wrong[0], label: wrong[0] },
      { id: word, letter: word, label: word, ok: true },
      { id: wrong[1], letter: wrong[1], label: wrong[1] },
    ],
  },
})

const LEITURA: Level[] = [
  wordLevel('bola', 'obj-ball', 'Bola', 'BOLA', ['BO', 'LA'], ['BALA', 'BOCA'], 'Bola começa com BO e termina com LA!'),
  wordLevel('maca2', 'obj-apple', 'Maçã', 'MAÇÃ', ['MA', 'ÇÃ'], ['MALA', 'MAPA'], 'Procure a palavra com Ç, a letra com rabinho!'),
  wordLevel('cachorro', 'obj-dog', 'Cachorro', 'CACHORRO', ['CA', 'CHOR', 'RO'], ['CAVALO', 'CADERNO'], 'Cachorro termina com RO!'),
  wordLevel('casa2', 'obj-house', 'Casa', 'CASA', ['CA', 'SA'], ['CAMA', 'CAPA'], 'Casa tem a letra S no meio!'),
]

/* ---------------- Trilha de Escrita: montar a palavra ---------------- */
const buildLevel = (id: string, img: string, title: string, word: string, syllables: string[], hint: string): Level => ({
  id,
  node: { img },
  title,
  intro: { img, word, syllables, say: `${syllables.map((s) => s.toLowerCase()).join(', ')}. ${title}! Vamos escrever essa palavra.` },
  challenge: { type: 'build', say: `Arraste as letras e escreva ${title.toLowerCase()}.`, prompt: `Escreva ${word}`, word, img, hint },
})

const ESCRITA: Level[] = [
  buildLevel('e-bola', 'obj-ball', 'Bola', 'BOLA', ['BO', 'LA'], 'Bola começa com B!'),
  buildLevel('e-cao', 'obj-dog', 'Cão', 'CÃO', ['CÃO'], 'Cão começa com C e tem o til no A!'),
  buildLevel('e-maca', 'obj-apple', 'Maçã', 'MAÇÃ', ['MA', 'ÇÃ'], 'Maçã começa com M, de mamãe!'),
  buildLevel('e-abelha', 'obj-bee', 'Mel', 'MEL', ['MEL'], 'A abelha faz mel! Mel começa com M.'),
]

/* ---------------- Trilhas (ilhas da Home) ---------------- */
export type Trail = {
  id: 'abc' | 'leitura' | 'escrita'
  name: string
  /** nome falado/curto, ex.: “Leitura” */
  short: string
  levels: Level[]
  /** frase da mascote ao abrir a trilha */
  welcome: string
}

export const TRAILS: Trail[] = [
  { id: 'abc', name: 'Trilha ABC', short: 'A B C', levels: ABC, welcome: 'Vamos aprender as letras! Toque no botão amarelo.' },
  { id: 'leitura', name: 'Trilha de Leitura', short: 'Leitura', levels: LEITURA, welcome: 'Bem-vindo à trilha de Leitura! Vamos ler palavras.' },
  { id: 'escrita', name: 'Trilha de Escrita', short: 'Escrita', levels: ESCRITA, welcome: 'Bem-vindo à trilha de Escrita! Vamos escrever palavras.' },
]
export const findTrail = (id?: string) => TRAILS.find((t) => t.id === id) ?? TRAILS[0]
/** mantém compatibilidade: fases da trilha ABC */
export const LEVELS = ABC

/* ---------------- Tarefas do professor ---------------- */

export type TaskStatus = 'pendente' | 'andamento' | 'concluida'
export type Task = {
  id: string
  title: string
  subject: string
  icon: 'abc' | 'math' | 'plant' | 'vowel' | 'name' | 'shape' | 'animal' | 'color' | 'syllable'
  status: TaskStatus
  due?: string
  progress?: number
  doneAt?: string
  stars?: number
  playable?: boolean
  achievement?: string
}

export const TASKS: Task[] = [
  { id: 'formar', title: 'Vamos formar palavras?', subject: 'Língua Portuguesa', icon: 'abc', status: 'pendente', due: 'Até 12 de nov.', playable: true },
  { id: 'contando', title: 'Contando e somando', subject: 'Matemática', icon: 'math', status: 'pendente', due: 'Até 14 de nov.', playable: true, achievement: 'contador' },
  { id: 'ciclo', title: 'O ciclo das plantas', subject: 'Ciências', icon: 'plant', status: 'pendente', due: 'Até 17 de nov.', playable: true, achievement: 'jardineiro' },
  { id: 'vogais', title: 'Caça às vogais', subject: 'Língua Portuguesa', icon: 'vowel', status: 'andamento', progress: 50, playable: true, achievement: 'vogais' },
  { id: 'nome', title: 'As letras do meu nome', subject: 'Língua Portuguesa', icon: 'name', status: 'concluida', doneAt: '3 de nov.', stars: 3 },
  { id: 'formas', title: 'Formas ao meu redor', subject: 'Matemática', icon: 'shape', status: 'concluida', doneAt: '31 de out.', stars: 3 },
  { id: 'animais', title: 'Onde vivem os animais?', subject: 'Ciências', icon: 'animal', status: 'concluida', doneAt: '29 de out.', stars: 2 },
  { id: 'cores', title: 'Cores do arco-íris', subject: 'Arte', icon: 'color', status: 'concluida', doneAt: '27 de out.', stars: 3 },
  { id: 'silabas', title: 'Sílabas mágicas', subject: 'Língua Portuguesa', icon: 'syllable', status: 'concluida', doneAt: '24 de out.', stars: 3 },
]

/* ---------------- Conquistas ---------------- */

/**
 * badge: imagem da medalha extraída das referências (pasta public/alfa).
 * icon: para medalhas sem arte própria, ícone 3D sobre uma medalha "vazia" (blank).
 */
export type Achievement = { id: string; title: string; desc: string; how: string; badge: string; locked?: string; icon?: string; hue?: number }

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'mestre-letras', title: 'Mestre das Letras', desc: 'Você explorou as primeiras letras do alfabeto!', how: 'Complete a fase da letra A na Trilha ABC.', badge: 'badge-star' },
  { id: 'leitor', title: 'Leitor Curioso', desc: 'Você ouviu sua primeira história!', how: 'Ouça uma história com a professora.', badge: 'badge-book' },
  { id: 'decolagem', title: 'Primeira Decolagem', desc: 'Você entrou na sua jornada de gênio!', how: 'Entre na plataforma pela primeira vez.', badge: 'badge-rocket' },
  { id: 'explorador', title: 'Explorador de Palavras', desc: 'Você completou toda a Trilha ABC!', how: 'Complete todas as fases da Trilha ABC.', badge: 'badge-crown', locked: 'badge-locked-crown' },
  { id: 'jardineiro', title: 'Jardineiro do Saber', desc: 'Você entendeu o ciclo das plantas!', how: 'Conclua a tarefa “O ciclo das plantas”.', badge: 'badge-plant', locked: 'badge-locked-plant' },
  { id: 'na-mosca', title: 'Na Mosca!', desc: 'Três acertos seguidos de primeira!', how: 'Acerte 3 desafios seguidos na primeira tentativa.', badge: 'badge-target', locked: 'badge-locked-target' },
  { id: 'artista', title: 'Artista da Turma', desc: 'Você publicou sua primeira produção no Mural!', how: 'Publique uma produção no Mural da turma.', badge: 'badge-blank-gold', icon: 'palette' },
  { id: 'vogais', title: 'Caçador de Vogais', desc: 'Você encontrou todas as vogais!', how: 'Conclua a tarefa “Caça às vogais”.', badge: 'badge-blank-blue', icon: 'gem' },
  { id: 'contador', title: 'Contador Esperto', desc: 'Você somou como um gênio!', how: 'Conclua a tarefa “Contando e somando”.', badge: 'badge-blank-purple', icon: 'abacus' },
  { id: 'amigo', title: 'Amigo da Turma', desc: 'Você curtiu as produções dos colegas!', how: 'Curta 3 produções no Mural.', badge: 'badge-blank-gold', icon: 'heart', hue: -40 },
  { id: 'ouvido', title: 'Ouvido Atento', desc: 'Você ouviu com muita atenção!', how: 'Toque no balão de áudio 5 vezes.', badge: 'badge-blank-blue', icon: 'notes', hue: 60 },
  { id: 'super', title: 'Super Gênio', desc: 'Todas as tarefas concluídas. Uau!', how: 'Conclua todas as tarefas pendentes.', badge: 'badge-blank-purple', icon: 'trophy', hue: -60 },
]
export const findAchievement = (id: string) => ACHIEVEMENTS.find((a) => a.id === id)!

/* ---------------- Mural ---------------- */

export type Production = {
  id: string
  author: string
  avatar: string
  title: string
  desc?: string
  likes: number
  liked?: boolean
  mine?: boolean
  shared?: boolean
  kind: 'desenho' | 'texto' | 'audio' | 'foto'
  art?: 'art-rocket' | 'art-tree' | 'art-dino' | 'art-house'
  image?: string
  text?: string
  audio?: string
  createdAt?: number
}

export const CLASS_PRODUCTIONS: Production[] = [
  { id: 'p1', author: 'Ana Clara', avatar: 'av-ana', title: 'Meu foguete', desc: 'Desenhei um foguete viajando pelo espaço.', likes: 12, kind: 'desenho', art: 'art-rocket' },
  { id: 'p2', author: 'Miguel', avatar: 'av-miguel', title: 'A natureza', desc: 'Uma árvore bem grande com flores.', likes: 9, kind: 'desenho', art: 'art-tree' },
  { id: 'p3', author: 'Sofia', avatar: 'av-sofia', title: 'Meu dinossauro', desc: 'Ele se chama Roxinho.', likes: 15, kind: 'desenho', art: 'art-dino' },
  { id: 'p4', author: 'Davi', avatar: 'av-davi', title: 'Minha casa', desc: 'Essa é a casa da minha vó.', likes: 8, kind: 'desenho', art: 'art-house' },
]

export const STUDENT = { name: 'Lucas', className: '1º ano B', school: 'Escola Jovens Gênios' }

/* ---------------- Avatares (bichinhos) ---------------- */
export type Avatar = { id: string; name: string; art: string; /** cor de fundo do círculo */ bg: string; say: string }
export const AVATARS: Avatar[] = [
  { id: 'raposa', name: 'Raposa', art: 'av-raposa', bg: '#ffe2c7', say: 'A raposa! Esperta e curiosa!' },
  { id: 'urso', name: 'Urso', art: 'av-urso', bg: '#f1dcc8', say: 'O urso! Forte e carinhoso!' },
  { id: 'pinguim', name: 'Pinguim', art: 'av-pinguim', bg: '#dbe6ff', say: 'O pinguim! Divertido e corajoso!' },
  { id: 'gato', name: 'Gato', art: 'av-gato', bg: '#e9e6f2', say: 'O gatinho! Atento a tudo!' },
  { id: 'tartaruga', name: 'Tartaruga', art: 'av-tartaruga', bg: '#dff3d2', say: 'A tartaruga! Calma e sabida!' },
  { id: 'coelho', name: 'Coelho', art: 'av-coelho', bg: '#ffe3ee', say: 'O coelho! Rápido e alegre!' },
]
export const findAvatar = (id?: string) => AVATARS.find((a) => a.id === id) ?? AVATARS[0]
export const avatarByArt = (art?: string) => AVATARS.find((a) => a.art === art)
