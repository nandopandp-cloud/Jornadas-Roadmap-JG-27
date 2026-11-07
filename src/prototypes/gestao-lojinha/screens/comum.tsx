import { Award, BookOpen, CalendarDays, Gift, Image as ImageIcon, Lightbulb, NotebookPen, Palette, PawPrint, SquareStack, UserRound, Wand2, type LucideIcon } from 'lucide-react'
import type { Categoria, IconeCat } from '../data'

/** ícone de linha usado na coluna “Categoria” das tabelas */
export const ICONE_CAT: Record<IconeCat, LucideIcon> = {
  avatar: UserRound,
  background: ImageIcon,
  pet: PawPrint,
  cards: SquareStack,
  personalizacao: Wand2,
  recompensa: Gift,
  tema: Palette,
  beneficio: Lightbulb,
  formacao: BookOpen,
  material: NotebookPen,
  evento: CalendarDays,
  reconhecimento: Award,
}
/** nome curto da categoria no singular, como na coluna da referência */
const SINGULAR: Record<string, string> = { avatares: 'Avatar', backgrounds: 'Background', pets: 'Pet (Yunara)', recompensas: 'Recompensa', temas: 'Tema', molduras: 'Moldura', beneficios: 'Benefício', formacoes: 'Formação', materiais: 'Material', eventos: 'Evento', reconhecimentos: 'Reconhecimento', kits: 'Kit físico' }
export const CATEGORIAS_NOME = (cats: Categoria[], id: string) => SINGULAR[id] ?? cats.find((c) => c.id === id)?.nome ?? id
export function CatCelula({ cats, id }: { cats: Categoria[]; id: string }) {
  const c = cats.find((x) => x.id === id)
  const I = c ? ICONE_CAT[c.icone] : SquareStack
  return (
    <span className="ga-catcel">
      <I size={19} strokeWidth={1.7} />
      {CATEGORIAS_NOME(cats, id)}
    </span>
  )
}
export const norm = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
