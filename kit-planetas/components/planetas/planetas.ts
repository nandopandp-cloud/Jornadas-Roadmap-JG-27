import type { PlanetaDados } from './PlanetaGirando'

/* =====================================================================
   Catálogo de planetas — UMA linha por planeta.
   Os arquivos de cada um ficam em public/planetas/<id>/ (planeta.glb e poster.webp).
   Planeta novo: o script ferramentas/otimizar_glb.py imprime a linha pronta para colar aqui.
   ===================================================================== */
export const PLANETAS = {
  'planeta-01': { id: 'planeta-01', nome: 'Planeta 01', pasta: 'planetas/planeta-01', modelo: 'planeta.glb', poster: 'poster.webp', raioQuadro: 1.347, inicio: 305, elevacao: 12, fov: 30 },
  'planeta-02': { id: 'planeta-02', nome: 'Planeta 02', pasta: 'planetas/planeta-02', modelo: 'planeta.glb', poster: 'poster.webp', raioQuadro: 1.446, inicio: 0, elevacao: 12, fov: 30 },
} satisfies Record<string, PlanetaDados & { nome: string }>

export type IdPlaneta = keyof typeof PLANETAS
export const LISTA_PLANETAS = (Object.keys(PLANETAS) as IdPlaneta[]).map((id) => ({ ...PLANETAS[id], id }))
