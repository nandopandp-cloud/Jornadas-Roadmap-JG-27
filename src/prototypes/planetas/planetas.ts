import type { PlanetaDados } from './PlanetaGirando'

/* =====================================================================
   Catálogo da vitrine — UMA linha por planeta (mesmo formato do kit:
   kit-planetas/components/planetas/planetas.ts). Os arquivos de cada um
   ficam em public/planetas/<id>/. A linha é impressa pelo otimizar_glb.py.
   ===================================================================== */
export const PLANETAS = {
  'planeta-01': { id: 'planeta-01', nome: 'Mitologia', pasta: 'planetas/planeta-01', modelo: 'planeta.glb', poster: 'poster.webp', raioQuadro: 1.347, inicio: 305, elevacao: 12, fov: 30 },
  'planeta-02': { id: 'planeta-02', nome: 'Empreendedorismo', pasta: 'planetas/planeta-02', modelo: 'planeta.glb', poster: 'poster.webp', raioQuadro: 1.446, inicio: 0, elevacao: 12, fov: 30 },
  'planeta-03': { id: 'planeta-03', nome: 'Emoções', pasta: 'planetas/planeta-03', modelo: 'planeta.glb', poster: 'poster.webp', raioQuadro: 1.397, inicio: 0, elevacao: 12, fov: 30 },
  'planeta-04': { id: 'planeta-04', nome: 'Artes', pasta: 'planetas/planeta-04', modelo: 'planeta.glb', poster: 'poster.webp', raioQuadro: 1.463, inicio: 0, elevacao: 12, fov: 30 },
  'planeta-05': { id: 'planeta-05', nome: 'Computação', pasta: 'planetas/planeta-05', modelo: 'planeta.glb', poster: 'poster.webp', raioQuadro: 1.322, inicio: 0, elevacao: 12, fov: 30 },
  'planeta-06': { id: 'planeta-06', nome: 'Fantasia', pasta: 'planetas/planeta-06', modelo: 'planeta.glb', poster: 'poster.webp', raioQuadro: 1.612, inicio: 0, elevacao: 12, fov: 30 },
  'planeta-07': { id: 'planeta-07', nome: 'Música', pasta: 'planetas/planeta-07', modelo: 'planeta.glb', poster: 'poster.webp', raioQuadro: 1.067, inicio: 315, elevacao: 35, fov: 30 },
  'planeta-08': { id: 'planeta-08', nome: 'Terra', pasta: 'planetas/planeta-08', modelo: 'planeta.glb', poster: 'poster.webp', raioQuadro: 1.574, inicio: 0, elevacao: 12, fov: 30 },
} satisfies Record<string, PlanetaDados & { nome: string }>

export type IdPlaneta = keyof typeof PLANETAS
export const LISTA_PLANETAS = (Object.keys(PLANETAS) as IdPlaneta[]).map((id) => ({ ...PLANETAS[id], id }))
