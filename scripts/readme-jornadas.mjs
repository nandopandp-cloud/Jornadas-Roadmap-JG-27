// Gera a seção “Jornadas” do README da main a partir de src/platform/journeys.ts.
// Rodado automaticamente no pre-commit (.githooks) — também dá para rodar com: npm run readme
import { readFileSync, writeFileSync } from 'node:fs'

const REPO = 'https://github.com/nandopandp-cloud/Jornadas-Roadmap-JG-27'
const SITE = 'https://jornadas-roadmap-jg-27.vercel.app'
const INICIO = '<!-- jornadas:inicio (gerado automaticamente a partir de src/platform/journeys.ts — não edite à mão) -->'
const FIM = '<!-- jornadas:fim -->'

const fonte = readFileSync('src/platform/journeys.ts', 'utf8')
const lista = fonte.slice(fonte.indexOf('export const journeys'))
const campo = (bloco, nome) => {
  const m = bloco.match(new RegExp(`\\b${nome}:\\s*(['"\`])([\\s\\S]*?)\\1`))
  return m ? m[2].replace(/\s+/g, ' ').trim() : ''
}
const jornadas = lista
  .split(/\n  \{\n/)
  .slice(1)
  .map((b) => ({ slug: campo(b, 'slug'), nome: campo(b, 'name'), produto: campo(b, 'product'), publico: campo(b, 'audience'), descricao: campo(b, 'description'), status: campo(b, 'status') }))
  .filter((j) => j.slug)

const secao = [
  INICIO,
  '',
  `A plataforma tem hoje **${jornadas.length} ${jornadas.length === 1 ? 'jornada' : 'jornadas'}**. Cada uma vive na sua própria branch, com um README dedicado.`,
  '',
  ...jornadas.flatMap((j) => [
    `### ${j.nome}`,
    '',
    `**${j.produto}** · ${j.publico}${j.status === 'em-breve' ? ' · _em breve_' : ''}`,
    '',
    j.descricao,
    '',
    `[Protótipo navegável](${SITE}/#/p/${j.slug}) · [Ver na plataforma](${SITE}/#/jornada/${j.slug}) · [Branch \`prototipo-${j.slug}\`](${REPO}/tree/prototipo-${j.slug})`,
    '',
  ]),
  FIM,
].join('\n')

const readme = readFileSync('README.md', 'utf8')
const a = readme.indexOf('<!-- jornadas:inicio')
const b = readme.indexOf(FIM)
if (a < 0 || b < 0) throw new Error('README.md sem os marcadores <!-- jornadas:inicio --> e <!-- jornadas:fim -->')
const novo = readme.slice(0, a) + secao + readme.slice(b + FIM.length)
if (novo !== readme) {
  writeFileSync('README.md', novo)
  console.log(`README: seção de jornadas atualizada (${jornadas.length}).`)
}
