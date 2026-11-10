import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync, readdirSync, readFileSync, rmSync, statSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { sameOrigin, synthesize, type TtsEnv } from './server/elevenlabs'

/** lê as variáveis da ElevenLabs de .env.local (padrão) ou de env.local (sem o ponto) */
function ttsEnv(mode: string): TtsEnv {
  const env: Record<string, string> = { ...loadEnv(mode, process.cwd(), 'ELEVENLABS_') }
  if (existsSync('env.local')) {
    for (const line of readFileSync('env.local', 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*(ELEVENLABS_[A-Z_]+)\s*=\s*(.*?)\s*$/)
      if (m && !env[m[1]]) env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  }
  return { ...env, ...pick(process.env) }
}
const pick = (e: NodeJS.ProcessEnv): TtsEnv => Object.fromEntries(Object.entries(e).filter(([k, v]) => k.startsWith('ELEVENLABS_') && v)) as TtsEnv

/** /api/tts no servidor local (dev e preview) — a chave fica só no Node, nunca no bundle */
function ttsProxy(mode: string): Plugin {
  const handler = async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    if (req.url?.split('?')[0] !== '/api/tts') return next()
    if (req.method !== 'POST') return void ((res.statusCode = 405), res.end())
    if (!sameOrigin(req.headers.origin, req.headers.host)) return void ((res.statusCode = 403), res.end())
    const chunks: Buffer[] = []
    for await (const c of req) chunks.push(c as Buffer)
    let text: unknown
    try {
      text = JSON.parse(Buffer.concat(chunks).toString('utf8')).text
    } catch {
      return void ((res.statusCode = 400), res.end())
    }
    try {
      const r = await synthesize(text, ttsEnv(mode))
      res.statusCode = r.status
      res.setHeader('Content-Type', r.contentType)
      res.end(typeof r.body === 'string' ? r.body : Buffer.from(r.body))
    } catch {
      res.statusCode = 502
      res.end('{"erro":"indisponivel"}')
    }
  }
  return {
    name: 'luno-tts',
    configureServer: (s) => void s.middlewares.use(handler),
    configurePreviewServer: (s) => void s.middlewares.use(handler),
  }
}

/**
 * As telas de referência ficam em public/ (soltas ou em subpastas, como “public/cronograma de uso”) para consulta
 * do time, mas não precisam ir para o site. Depois do build, apaga do dist todo .png que não seja arte usada
 * pelo app (public/alfa, public/cron e public/3d) e as pastas que ficarem vazias.
 */
const ARTE_DO_APP = ['alfa', 'cron', 'flash', 'loja', 'admin', 'login', 'geniex', 'voc', 'rtv', 'bat', '3d', 'assets']
function semReferencias(): Plugin {
  const limpar = (dir: string, raiz: boolean): boolean => {
    let vazio = true
    for (const f of readdirSync(dir)) {
      const full = join(dir, f)
      if (statSync(full).isDirectory()) {
        if (raiz && ARTE_DO_APP.includes(f)) {
          vazio = false
          continue
        }
        if (limpar(full, false)) rmSync(full, { recursive: true })
        else vazio = false
      } else if (f.toLowerCase().endsWith('.png') || f === '.DS_Store') unlinkSync(full)
      else vazio = false
    }
    return vazio
  }
  return { name: 'sem-referencias', apply: 'build', closeBundle: () => void limpar('dist', true) }
}

// base relativo: funciona em qualquer host estático (Vercel, Netlify, GitHub Pages em subpasta).
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [react(), ttsProxy(mode), semReferencias()],
  server: { host: true },
}))
