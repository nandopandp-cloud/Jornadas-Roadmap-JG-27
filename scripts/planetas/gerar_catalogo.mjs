// Gera public/planetas/catalogo.json a partir do catálogo da vitrine (src/prototypes/planetas/planetas.ts,
// a fonte única). É esse JSON publicado no site que o kit da engenharia lê: planeta novo publicado
// aparece nas plataformas só pelo id, sem baixar nada. Rodar depois de mexer no planetas.ts:
//   node scripts/planetas/gerar_catalogo.mjs
import { writeFileSync } from 'node:fs'
import { LISTA_PLANETAS } from '../../src/prototypes/planetas/planetas.ts'

const destino = new URL('../../public/planetas/catalogo.json', import.meta.url)
const planetas = LISTA_PLANETAS.map(({ id, nome, pasta, modelo, poster, raioQuadro, inicio, elevacao, fov }) => ({ id, nome, pasta, modelo, poster, raioQuadro, inicio, elevacao, fov }))
writeFileSync(destino, JSON.stringify({ versao: 1, planetas }, null, 2) + '\n')
console.log(`catalogo.json: ${planetas.length} planetas (${planetas.map((p) => p.id).join(', ')})`)
