import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

/**
 * Registro de jornadas da plataforma.
 * Para adicionar um novo protótipo: crie a pasta em src/prototypes/<slug> e registre aqui.
 */
export type PrototypeProps = {
  /** tela inicial opcional (atalho de fluxo) */
  startScreen?: string | null
  /** true quando renderizado dentro da plataforma (iframe) */
  embedded?: boolean
}

export type Journey = {
  slug: string
  name: string
  product: string
  audience: string
  description: string
  icon: string
  accent: string
  status: 'navegavel' | 'em-breve'
  /** dispositivo inicial da prévia na plataforma */
  dispositivo?: 'desktop' | 'tablet' | 'mobile'
  /** endereço exibido na moldura do navegador (prévia desktop) */
  dominio?: string
  /** branch da jornada, quando não segue o padrão prototipo-<slug> */
  branch?: string
  /** atalhos de fluxo: abrem o protótipo direto numa tela */
  flows?: { id: string; label: string; icon: string }[]
  component?: LazyExoticComponent<ComponentType<PrototypeProps>>
}

export const journeys: Journey[] = [
  {
    slug: 'alfabetizacao',
    name: 'Alfabetização',
    product: 'App do Estudante',
    audience: '1º e 2º ano · Ensino Fundamental',
    description:
      'Trilha de letras com narração, desafios de toque e arrastar, conquistas, mural da turma com produção criativa e tarefas enviadas pelo professor.',
    icon: './3d/books.png',
    accent: '#7c3aed',
    status: 'navegavel',
    flows: [
      { id: 'abertura', label: 'Abertura', icon: './3d/sparkles.png' },
      { id: 'avatar', label: 'Avatar', icon: './3d/cat.png' },
      { id: 'home', label: 'Início', icon: './3d/house.png' },
      { id: 'trail', label: 'Trilha ABC', icon: './3d/glowing-star.png' },
      { id: 'tasks', label: 'Tarefas', icon: './3d/clipboard.png' },
      { id: 'mural', label: 'Mural', icon: './3d/picture.png' },
      { id: 'new-production', label: 'Nova Produção', icon: './3d/palette.png' },
      { id: 'achievements', label: 'Conquistas', icon: './3d/trophy.png' },
    ],
    component: lazy(() => import('../prototypes/alfabetizacao')),
  },
  {
    slug: 'cronograma',
    name: 'Cronograma de Uso',
    product: 'Plataforma Educadores',
    audience: 'Gestores e professores',
    description:
      'Gestor importa o cronograma da escola em CSV, revisa as inconsistências sugeridas, ajusta as atividades e publica; o calendário escolar é preenchido e os professores recebem as recomendações.',
    icon: './3d/calendar.png',
    accent: '#4c1d95',
    status: 'navegavel',
    dispositivo: 'desktop',
    dominio: 'educadores.jovensgenios.com',
    flows: [
      { id: 'lista', label: 'Escolas da rede', icon: './3d/books.png' },
      { id: 'escolha', label: 'Como criar', icon: './3d/sparkles.png' },
      { id: 'escopo', label: 'Plataforma: escopo', icon: './3d/bullseye.png' },
      { id: 'configurar', label: 'Plataforma: programação', icon: './3d/palette.png' },
      { id: 'ajustar', label: 'Plataforma: revisar', icon: './3d/bulb.png' },
      { id: 'finalizar', label: 'Plataforma: publicar', icon: './3d/rocket.png' },
      { id: 'importar', label: 'Planilha: importar CSV', icon: './3d/clipboard.png' },
      { id: 'inconsistencias', label: 'Inconsistências', icon: './3d/bulb.png' },
      { id: 'revisar', label: 'Revisar cronograma', icon: './3d/memo.png' },
      { id: 'publicar', label: 'Publicar', icon: './3d/rocket.png' },
      { id: 'calendario', label: 'Calendário escolar', icon: './3d/calendar.png' },
      { id: 'professor', label: 'Visão do professor', icon: './3d/pencil.png' },
    ],
    component: lazy(() => import('../prototypes/cronograma')),
  },
  {
    slug: 'flashcards',
    name: 'Flashcards',
    product: 'GenieX · Plataforma do Estudante',
    audience: 'Ensino Médio',
    description:
      'Estudante escolhe até 5 disciplinas e seus tópicos, gera grupos de flashcards, estuda com “Não sei / Eu sei / Revisar depois”, favorita cards e acompanha o resultado de cada sessão.',
    icon: './3d/bulb.png',
    accent: '#4b55ec',
    status: 'navegavel',
    dispositivo: 'desktop',
    dominio: 'geniex.jovensgenios.com',
    flows: [
      { id: 'inicio', label: 'Página inicial', icon: './3d/house.png' },
      { id: 'landing', label: 'Entrada Flashcards', icon: './3d/sparkles.png' },
      { id: 'disciplinas', label: 'Escolher disciplinas', icon: './3d/books.png' },
      { id: 'topicos', label: 'Escolher tópicos', icon: './3d/memo.png' },
      { id: 'gerando', label: 'Gerando flashcards', icon: './3d/rocket.png' },
      { id: 'grupos', label: 'Meus grupos', icon: './3d/notes.png' },
      { id: 'estudo', label: 'Estudar grupo', icon: './3d/bulb.png' },
      { id: 'resposta', label: 'Resposta revelada', icon: './3d/glowing-star.png' },
      { id: 'concluida', label: 'Sessão concluída', icon: './3d/trophy.png' },
      { id: 'favoritos', label: 'Favoritos', icon: './3d/star.png' },
      { id: 'historico', label: 'Histórico', icon: './3d/calendar.png' },
    ],
    component: lazy(() => import('../prototypes/flashcards')),
  },
  {
    slug: 'lojinha',
    name: 'Lojinha',
    product: 'Exploradores · Plataforma do Estudante',
    audience: 'Estudantes · Clube Jovens Gênios',
    description:
      'Estudante troca pontos por avatares, backgrounds, pets, cards e recompensas físicas; acompanha o cartão fidelidade com QR Code, o histórico de pontos, o status dos resgates e as regras.',
    icon: './3d/gem.png',
    accent: '#029e8f',
    status: 'navegavel',
    dispositivo: 'desktop',
    dominio: 'exploradores.jovensgenios.com',
    flows: [
      { id: 'loja', label: 'Loja', icon: './3d/gem.png' },
      { id: 'avatares', label: 'Avatares', icon: './3d/boy-2.png' },
      { id: 'item', label: 'Detalhe e resgate', icon: './3d/party.png' },
      { id: 'cartao', label: 'Meu Cartão', icon: './3d/crown.png' },
      { id: 'historico', label: 'Histórico', icon: './3d/calendar.png' },
      { id: 'resgates', label: 'Meus Resgates', icon: './3d/clipboard.png' },
      { id: 'regras', label: 'Regras', icon: './3d/memo.png' },
    ],
    component: lazy(() => import('../prototypes/lojinha')),
  },
  {
    slug: 'gestao-lojinha',
    name: 'Gestão da Lojinha',
    product: 'Admin Jovens Gênios',
    audience: 'Times internos · Exploradores, Educadores e GenieX',
    description:
      'Times internos administram a Lojinha das três plataformas: catálogo de itens e categorias, resgates com andamento e estorno, extrato de pontos, estudantes e configurações.',
    icon: './3d/clipboard.png',
    accent: '#1d63ed',
    status: 'navegavel',
    dispositivo: 'desktop',
    dominio: 'admin.jovensgenios.com',
    flows: [
      { id: 'visao', label: 'Visão geral', icon: './3d/bullseye.png' },
      { id: 'itens', label: 'Catálogo de itens', icon: './3d/gem.png' },
      { id: 'cadastrar', label: 'Cadastrar item', icon: './3d/sparkles.png' },
      { id: 'categorias', label: 'Categorias', icon: './3d/books.png' },
      { id: 'resgates', label: 'Resgates', icon: './3d/party.png' },
      { id: 'resgate', label: 'Detalhes do resgate', icon: './3d/memo.png' },
      { id: 'extrato', label: 'Pontos e extrato', icon: './3d/notes.png' },
      { id: 'estudantes', label: 'Estudantes', icon: './3d/girl-2.png' },
      { id: 'estudante', label: 'Perfil do estudante', icon: './3d/boy-2.png' },
      { id: 'config', label: 'Configurações', icon: './3d/crown.png' },
    ],
    component: lazy(() => import('../prototypes/gestao-lojinha')),
  },
  {
    slug: 'teste-vocacional',
    name: 'Teste Vocacional',
    product: 'GenieX · Plataforma do Estudante',
    audience: 'Ensino Médio',
    description:
      'Estudante responde 52 perguntas sobre interesses, valores, preferências e habilidades, recebe um perfil com profissões explicadas, explora e compara carreiras, salva favoritas e monta um plano de exploração.',
    icon: './voc/compass.webp',
    accent: '#4b55ec',
    status: 'navegavel',
    dispositivo: 'desktop',
    dominio: 'geniex.jovensgenios.com',
    branch: 'teste-vocacional-geniex',
    flows: [
      { id: 'inicio', label: 'Página inicial', icon: './3d/house.png' },
      { id: 'entrada', label: 'Entrada do teste', icon: './voc/compass.webp' },
      { id: 'clareza', label: 'Clareza inicial', icon: './voc/thinking-face.webp' },
      { id: 'intro', label: 'Como funciona', icon: './voc/light-bulb.webp' },
      { id: 'questionario', label: 'Questionário', icon: './3d/memo.png' },
      { id: 'pares', label: 'Etapa de preferências', icon: './voc/world-map.webp' },
      { id: 'retomar', label: 'Retomar teste', icon: './voc/hourglass-not-done.webp' },
      { id: 'revisao', label: 'Revisão (faltando)', icon: './3d/clipboard.png' },
      { id: 'processando', label: 'Processando', icon: './3d/rocket.png' },
      { id: 'relatorio', label: 'Meu perfil', icon: './3d/glowing-star.png' },
      { id: 'recomendacoes', label: 'Carreiras sugeridas', icon: './3d/sparkles.png' },
      { id: 'carreira', label: 'Conheça a profissão', icon: './voc/triangular-ruler.webp' },
      { id: 'explorar', label: 'Explorar carreiras', icon: './voc/globe-showing-americas.webp' },
      { id: 'comparar', label: 'Comparar', icon: './voc/balance-scale.webp' },
      { id: 'minhas', label: 'Minhas carreiras', icon: './3d/star.png' },
      { id: 'plano', label: 'Meu plano', icon: './voc/spiral-notepad.webp' },
      { id: 'clareza-pos', label: 'Clareza final', icon: './voc/rocket.webp' },
      { id: 'historico', label: 'Minha jornada', icon: './3d/calendar.png' },
    ],
    component: lazy(() => import('../prototypes/teste-vocacional')),
  },
]

export const findJourney = (slug?: string) => journeys.find((j) => j.slug === slug)
