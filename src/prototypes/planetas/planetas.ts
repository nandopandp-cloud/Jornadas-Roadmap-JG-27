import type { PlanetaDados } from './PlanetaGirando'

/* =====================================================================
   Catálogo da vitrine — UMA linha por planeta (mesmo formato do kit:
   kit-planetas/components/planetas/planetas.ts). Os arquivos de cada um
   ficam em public/planetas/<id>/. A linha é impressa pelo otimizar_glb.py.
   ===================================================================== */
export const PLANETAS = {
  'planeta-mitologia': { id: 'planeta-mitologia', nome: 'Mitologia', pasta: 'planetas/planeta-mitologia', modelo: 'planeta.glb', poster: 'poster.webp', raioQuadro: 1.347, inicio: 305, elevacao: 12, fov: 30 },
  'planeta-empreendedorismo': { id: 'planeta-empreendedorismo', nome: 'Empreendedorismo', pasta: 'planetas/planeta-empreendedorismo', modelo: 'planeta.glb', poster: 'poster.webp', raioQuadro: 1.446, inicio: 0, elevacao: 12, fov: 30 },
  'planeta-emocoes': { id: 'planeta-emocoes', nome: 'Emoções', pasta: 'planetas/planeta-emocoes', modelo: 'planeta.glb', poster: 'poster.webp', raioQuadro: 1.397, inicio: 0, elevacao: 12, fov: 30 },
  'planeta-artes': { id: 'planeta-artes', nome: 'Artes', pasta: 'planetas/planeta-artes', modelo: 'planeta.glb', poster: 'poster.webp', raioQuadro: 1.463, inicio: 0, elevacao: 12, fov: 30 },
  'planeta-computacao': { id: 'planeta-computacao', nome: 'Computação', pasta: 'planetas/planeta-computacao', modelo: 'planeta.glb', poster: 'poster.webp', raioQuadro: 1.385, inicio: 0, elevacao: 12, fov: 30 },
  'planeta-fantasia': { id: 'planeta-fantasia', nome: 'Fantasia', pasta: 'planetas/planeta-fantasia', modelo: 'planeta.glb', poster: 'poster.webp', raioQuadro: 1.612, inicio: 0, elevacao: 12, fov: 30 },
  'planeta-musica': { id: 'planeta-musica', nome: 'Música', pasta: 'planetas/planeta-musica', modelo: 'planeta.glb', poster: 'poster.webp', raioQuadro: 1.067, inicio: 315, elevacao: 35, fov: 30 },
  'planeta-terra': { id: 'planeta-terra', nome: 'Terra', pasta: 'planetas/planeta-terra', modelo: 'planeta.glb', poster: 'poster.webp', raioQuadro: 1.574, inicio: 0, elevacao: 12, fov: 30 },
  'planeta-alfabetizacao': { id: 'planeta-alfabetizacao', nome: 'Alfabetização', pasta: 'planetas/planeta-alfabetizacao', modelo: 'planeta.glb', poster: 'poster.webp', raioQuadro: 1.629, inicio: 0, elevacao: 12, fov: 30 },
  'planeta-transito': { id: 'planeta-transito', nome: 'Trânsito', pasta: 'planetas/planeta-transito', modelo: 'planeta.glb', poster: 'poster.webp', raioQuadro: 1.259, inicio: 0, elevacao: 40, fov: 30 },
  'planeta-esportes': { id: 'planeta-esportes', nome: 'Esportes', pasta: 'planetas/planeta-esportes', modelo: 'planeta.glb', poster: 'poster.webp', raioQuadro: 1.368, inicio: 0, elevacao: 12, fov: 30 },
  'planeta-profissoes': { id: 'planeta-profissoes', nome: 'Profissões', pasta: 'planetas/planeta-profissoes', modelo: 'planeta.glb', poster: 'poster.webp', raioQuadro: 1.242, inicio: 0, elevacao: 12, fov: 30 },
  'planeta-robotica': { id: 'planeta-robotica', nome: 'Robótica', pasta: 'planetas/planeta-robotica', modelo: 'planeta.glb', poster: 'poster.webp', raioQuadro: 1.787, inicio: 0, elevacao: 12, fov: 30 },
} satisfies Record<string, PlanetaDados & { nome: string }>

export type IdPlaneta = keyof typeof PLANETAS
export const LISTA_PLANETAS = (Object.keys(PLANETAS) as IdPlaneta[]).map((id) => ({ ...PLANETAS[id], id }))
