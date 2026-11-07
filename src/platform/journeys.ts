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
]

export const findJourney = (slug?: string) => journeys.find((j) => j.slug === slug)
