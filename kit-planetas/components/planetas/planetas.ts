import type { PlanetaDados } from './PlanetaGirando'

/* =====================================================================
   Onde os planetas estão publicados.
   O catálogo (<endereço>planetas/catalogo.json) e os arquivos de cada planeta
   (<endereço>planetas/<id>/planeta.glb e poster.webp) são lidos daqui.
   Planeta novo publicado pelo Design já funciona pelo id, sem mudar nada no projeto.
   ===================================================================== */
export const ENDERECO_PLANETAS = 'https://jornadas-roadmap-jg-27.vercel.app/'

export type InfoPlaneta = PlanetaDados & { nome: string }

const juntar = (base: string, caminho: string) => (base.endsWith('/') ? base : base + '/') + caminho
const pedidos = new Map<string, Promise<InfoPlaneta[]>>()

/**
 * Lista de planetas publicados, na ordem do catálogo. Busca uma vez por página (os outros
 * pedidos reaproveitam a resposta). Funciona no navegador e em Server Components
 * (no servidor, a resposta é renovada a cada 5 min).
 *   const planetas = await carregarPlanetas()   // [{ id: 'planeta-mitologia', nome: 'Mitologia', … }, …]
 */
export function carregarPlanetas(base: string = ENDERECO_PLANETAS): Promise<InfoPlaneta[]> {
  let pedido = pedidos.get(base)
  if (!pedido) {
    pedido = fetch(juntar(base, 'planetas/catalogo.json'), { next: { revalidate: 300 } } as RequestInit)
      .then((r) => {
        if (!r.ok) throw new Error(`catálogo de planetas: HTTP ${r.status}`)
        return r.json() as Promise<{ planetas: InfoPlaneta[] }>
      })
      .then((j) => j.planetas)
    pedido.catch(() => pedidos.delete(base)) // falhou: tenta de novo no próximo pedido
    pedidos.set(base, pedido)
  }
  return pedido
}
