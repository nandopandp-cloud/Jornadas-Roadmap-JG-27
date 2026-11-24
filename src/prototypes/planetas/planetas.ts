import type { PlanetaDados } from './PlanetaGirando'

/* =====================================================================
   Catálogo da vitrine — UMA linha por planeta (mesmo formato do kit:
   kit-planetas/components/planetas/planetas.ts). Os arquivos de cada um
   ficam em public/planetas/<id>/. A linha é impressa pelo otimizar_glb.py.
   ===================================================================== */
export const PLANETAS = {
  'planeta-01': { id: 'planeta-01', nome: 'Planeta 01', pasta: 'planetas/planeta-01', modelo: 'planeta.glb', poster: 'poster.webp', raioQuadro: 1.347, inicio: 305, elevacao: 12, fov: 30 },
  'planeta-02': { id: 'planeta-02', nome: 'Planeta 02', pasta: 'planetas/planeta-02', modelo: 'planeta.glb', poster: 'poster.webp', raioQuadro: 1.446, inicio: 0, elevacao: 12, fov: 30 },
  'planeta-03': { id: 'planeta-03', nome: 'Planeta 03', pasta: 'planetas/planeta-03', modelo: 'planeta.glb', poster: 'poster.webp', raioQuadro: 1.397, inicio: 0, elevacao: 12, fov: 30 },
  'planeta-04': { id: 'planeta-04', nome: 'Planeta 04', pasta: 'planetas/planeta-04', modelo: 'planeta.glb', poster: 'poster.webp', raioQuadro: 1.463, inicio: 0, elevacao: 12, fov: 30 },
  'planeta-05': { id: 'planeta-05', nome: 'Planeta 05', pasta: 'planetas/planeta-05', modelo: 'planeta.glb', poster: 'poster.webp', raioQuadro: 1.322, inicio: 0, elevacao: 12, fov: 30 },
  'planeta-06': { id: 'planeta-06', nome: 'Planeta 06', pasta: 'planetas/planeta-06', modelo: 'planeta.glb', poster: 'poster.webp', raioQuadro: 1.612, inicio: 0, elevacao: 12, fov: 30 },
  'planeta-07': { id: 'planeta-07', nome: 'Planeta 07', pasta: 'planetas/planeta-07', modelo: 'planeta.glb', poster: 'poster.webp', raioQuadro: 1.067, inicio: 315, elevacao: 35, fov: 30 },
} satisfies Record<string, PlanetaDados & { nome: string }>

export type IdPlaneta = keyof typeof PLANETAS
export const LISTA_PLANETAS = (Object.keys(PLANETAS) as IdPlaneta[]).map((id) => ({ ...PLANETAS[id], id }))
