import { PlanetaGirando, type PlanetaGirandoProps } from './PlanetaGirando'
import { PLANETAS, type IdPlaneta } from './planetas'

/**
 * Atalho: o planeta pelo id do catálogo.
 *   <Planeta id="planeta-03" tamanho={240} alt="Planeta Emoções" />
 * Aceita todas as props do PlanetaGirando (menos `planeta`). Pode ser usado em Server Components;
 * só `onSentidoChange` (função) exige um componente cliente em volta.
 */
export function Planeta({ id, ...props }: { id: IdPlaneta } & Omit<PlanetaGirandoProps, 'planeta'>) {
  return <PlanetaGirando planeta={PLANETAS[id]} {...props} />
}

export default Planeta
