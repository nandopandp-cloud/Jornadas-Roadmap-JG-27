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
]

export const findJourney = (slug?: string) => journeys.find((j) => j.slug === slug)
