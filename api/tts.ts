/**
 * Função serverless (Vercel) — POST /api/tts  { "text": "..." }  →  áudio MP3 com a voz do Luno.
 * Configure ELEVENLABS_API_KEY e ELEVENLABS_VOICE_ID em Project Settings → Environment Variables.
 */
import { sameOrigin, synthesize } from '../server/elevenlabs'

export async function POST(request: Request): Promise<Response> {
  if (!sameOrigin(request.headers.get('origin'), request.headers.get('host'))) return new Response('{"erro":"origem"}', { status: 403 })
  let text: unknown
  try {
    text = ((await request.json()) as { text?: unknown }).text
  } catch {
    return new Response('{"erro":"json"}', { status: 400 })
  }
  try {
    const r = await synthesize(text, process.env)
    return new Response(r.body, {
      status: r.status,
      headers: { 'Content-Type': r.contentType, 'Cache-Control': r.status === 200 ? 'public, max-age=31536000, immutable' : 'no-store' },
    })
  } catch {
    return new Response('{"erro":"indisponivel"}', { status: 502 })
  }
}
