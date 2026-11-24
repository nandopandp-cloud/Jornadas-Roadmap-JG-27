// HTML → PDF (A4) + um PNG por página, com o Chromium do Playwright instalado na skill planetas-3d.
import { createRequire } from 'node:module'
import { readdirSync } from 'node:fs'
import { join } from 'node:path'

const skill = join(process.env.HOME, '.claude/skills/planetas-3d/')
const { chromium } = createRequire(skill)('playwright')
const [html, pdf, png] = process.argv.slice(2)
const cache = join(process.env.HOME, 'Library/Caches/ms-playwright')
const shell = readdirSync(cache).filter((d) => d.startsWith('chromium_headless_shell-')).sort().pop()
const b = await chromium.launch({ executablePath: join(cache, shell, 'chrome-headless-shell-mac-arm64/chrome-headless-shell') })
const p = await b.newPage({ viewport: { width: 794, height: 1123 } })
await p.goto('file://' + html, { waitUntil: 'networkidle' })
await p.evaluate(() => document.fonts.ready)
await p.pdf({ path: pdf, format: 'A4', printBackground: true, preferCSSPageSize: true })
const paginas = await p.$$('.pagina')
for (let i = 0; i < paginas.length; i++) await paginas[i].screenshot({ path: `${png}-${i + 1}.png` })
await b.close()
