/**
 * Síntese de voz do Luno via ElevenLabs — roda SOMENTE no servidor.
 * A chave nunca vai para o navegador: o protótipo chama /api/tts e este módulo
 * fala com a ElevenLabs usando as variáveis de ambiente.
 *
 *   ELEVENLABS_API_KEY   chave da conta (obrigatória)
 *   ELEVENLABS_VOICE_ID  voz oficial do Luno (obrigatória)
 *   ELEVENLABS_MODEL_ID  opcional (padrão: eleven_multilingual_v2)
 */
export type TtsEnv = {
  ELEVENLABS_API_KEY?: string
  ELEVENLABS_VOICE_ID?: string
  ELEVENLABS_MODEL_ID?: string
}

export type TtsResult = { status: number; body: ArrayBuffer | string; contentType: string }

/** palavra falada e quando ela começa/termina (segundos) — usado para sincronizar animações com a voz */
export type SpokenWord = { t: string; s: number; e: number }
/** resposta de /api/tts: áudio MP3 em base64 + tempo de cada palavra */
export type TtsPayload = { audio: string; duration: number; words: SpokenWord[] }

type Alignment = { characters: string[]; character_start_times_seconds: number[]; character_end_times_seconds: number[] }

function toWords(a: Alignment | undefined): SpokenWord[] {
  if (!a) return []
  const out: SpokenWord[] = []
  let cur: SpokenWord | null = null
  a.characters.forEach((c, i) => {
    if (/\s/.test(c)) {
      if (cur) out.push(cur)
      cur = null
      return
    }
    if (!cur) cur = { t: '', s: a.character_start_times_seconds[i], e: 0 }
    cur.t += c
    cur.e = a.character_end_times_seconds[i]
  })
  if (cur) out.push(cur)
  return out
}

/** limite por fala: evita que o endpoint público seja usado para gastar créditos com textos longos */
export const MAX_CHARS = 280

export async function synthesize(rawText: unknown, env: TtsEnv): Promise<TtsResult> {
  const json = (status: number, data: object): TtsResult => ({ status, body: JSON.stringify(data), contentType: 'application/json' })
  const key = env.ELEVENLABS_API_KEY?.trim()
  const voice = env.ELEVENLABS_VOICE_ID?.trim()
  if (!key || !voice) return json(503, { erro: 'voz-nao-configurada' })

  const text = typeof rawText === 'string' ? rawText.trim() : ''
  if (!text) return json(400, { erro: 'texto-vazio' })
  if (text.length > MAX_CHARS) return json(413, { erro: 'texto-longo-demais' })

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voice)}/with-timestamps?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      model_id: env.ELEVENLABS_MODEL_ID?.trim() || 'eleven_multilingual_v2',
      voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.3, use_speaker_boost: true },
    }),
  })

  if (!res.ok) {
    // repassa o status (401/402 = sem créditos ou chave inválida; 429 = limite) sem expor detalhes da conta
    let motivo = 'falha'
    try {
      const data = (await res.json()) as { detail?: { status?: string } }
      motivo = data?.detail?.status || motivo
    } catch {
      /* corpo não-JSON */
    }
    return json(res.status, { erro: motivo })
  }
  const data = (await res.json()) as { audio_base64: string; alignment?: Alignment; normalized_alignment?: Alignment }
  const words = toWords(data.alignment ?? data.normalized_alignment)
  const payload: TtsPayload = { audio: data.audio_base64, duration: words.at(-1)?.e ?? 0, words }
  return { status: 200, body: JSON.stringify(payload), contentType: 'application/json; charset=utf-8' }
}

/** recusa chamadas vindas de outros sites (o navegador manda Origin em POSTs cross-site) */
export function sameOrigin(origin: string | null | undefined, host: string | null | undefined) {
  if (!origin || !host) return true
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}
