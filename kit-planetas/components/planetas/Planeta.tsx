'use client'

import { useEffect, useState } from 'react'
import { PlanetaGirando, type PlanetaDados, type PlanetaGirandoProps } from './PlanetaGirando'
import { ENDERECO_PLANETAS, carregarPlanetas } from './planetas'

/**
 * O planeta pelo id:
 *   <Planeta id="planeta-emocoes" tamanho={240} alt="Planeta Emoções" />
 *
 * Os arquivos vêm de ENDERECO_PLANETAS (planetas.ts). Planeta novo publicado pelo Design
 * já funciona: basta usar o id novo. O pôster aparece na hora (inclusive no HTML do servidor);
 * o 3D entra quando o catálogo e o modelo chegam.
 * Aceita todas as props do PlanetaGirando (menos `planeta`). Pode ser usado em Server Components;
 * só `onSentidoChange` (função) exige um componente cliente em volta.
 */
export function Planeta({ id, base = ENDERECO_PLANETAS, ...props }: { id: string } & Omit<PlanetaGirandoProps, 'planeta'>) {
  const [dados, setDados] = useState<PlanetaDados | null>(null)

  useEffect(() => {
    let vivo = true
    setDados(null)
    carregarPlanetas(base)
      .then((lista) => {
        const p = lista.find((x) => x.id === id)
        if (!p) console.warn(`[Planeta] "${id}" não está no catálogo. Ids publicados: ${lista.map((x) => x.id).join(', ')}`)
        else if (vivo) setDados(p)
      })
      .catch((e) => console.warn('[Planeta] sem catálogo, fica o pôster:', e))
    return () => {
      vivo = false
    }
  }, [id, base])

  // até o catálogo chegar: só o pôster, pelo caminho padrão (mesmo enquadramento do 3D)
  const planeta = dados ?? { ...PROVISORIO, id, pasta: `planetas/${id}` }
  return <PlanetaGirando planeta={planeta} base={base} carregar3d={!!dados} {...props} />
}

const PROVISORIO: PlanetaDados = { id: '', pasta: '', modelo: 'planeta.glb', poster: 'poster.webp', raioQuadro: 1.4, inicio: 0, elevacao: 12, fov: 30 }

export default Planeta
