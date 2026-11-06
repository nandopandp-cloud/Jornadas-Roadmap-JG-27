/**
 * Motor de som dos protótipos.
 * - Efeitos sonoros sintetizados com Web Audio (sem arquivos externos).
 * - Narração com a voz oficial do Luno (ElevenLabs, via /api/tts); a voz pt-BR do sistema
 *   (speechSynthesis) assume se a ElevenLabs falhar ou os créditos acabarem.
 * Navegadores só liberam áudio após um gesto do usuário: chame `unlockAudio()` num clique.
 */
import { useSyncExternalStore } from 'react'

let ctx: AudioContext | null = null
let master: GainNode | null = null
let muted = false
let speaking = false
const subs = new Set<() => void>()
const emit = () => subs.forEach((fn) => fn())
const subscribe = (fn: () => void) => {
  subs.add(fn)
  return () => subs.delete(fn)
}


function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 0.55
    master.connect(ctx.destination)
    ctx.onstatechange = emit
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

/** cria/retoma o áudio. Passe `false` quando não vier de um toque do usuário. */
export function unlockAudio(gesture: unknown = true) {
  if (gesture !== false && !audioReady()) gestureAt = Date.now()
  audio()
  loadVoices()
  emit()
}

/** true quando o navegador já liberou o som (após um toque do usuário) */
export const audioReady = () => !!ctx && ctx.state === 'running'
export const useAudioReady = () => useSyncExternalStore(subscribe, audioReady)

type ToneOpts = {
  freq: number
  to?: number
  dur?: number
  type?: OscillatorType
  vol?: number
  delay?: number
  attack?: number
}

/** só toca se o áudio já foi liberado (ou acabou de ser, no mesmo toque) */
let gestureAt = 0
const canPlay = (c: AudioContext) => c.state === 'running' || Date.now() - gestureAt < 600

function tone({ freq, to, dur = 0.12, type = 'sine', vol = 0.3, delay = 0, attack = 0.008 }: ToneOpts) {
  const c = audio()
  if (!c || !master || muted || !canPlay(c)) return
  const t = c.currentTime + delay
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t + dur)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(vol, t + attack)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.connect(g).connect(master)
  osc.start(t)
  osc.stop(t + dur + 0.05)
}

function noise({ dur = 0.25, vol = 0.12, from = 400, to = 3000, delay = 0 }) {
  const c = audio()
  if (!c || !master || muted || !canPlay(c)) return
  const t = c.currentTime + delay
  const len = Math.floor(c.sampleRate * dur)
  const buf = c.createBuffer(1, len, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
  const src = c.createBufferSource()
  src.buffer = buf
  const f = c.createBiquadFilter()
  f.type = 'bandpass'
  f.Q.value = 1.4
  f.frequency.setValueAtTime(from, t)
  f.frequency.exponentialRampToValueAtTime(to, t + dur)
  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(vol, t + dur * 0.3)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  src.connect(f).connect(g).connect(master)
  src.start(t)
}

const NOTE = (n: number) => 440 * Math.pow(2, (n - 69) / 12)

export const sfx = {
  /** toque leve em botões */
  tap: () => tone({ freq: 620, to: 880, dur: 0.07, type: 'triangle', vol: 0.18 }),
  /** "plop" bolha — seleção de cards */
  pop: () => {
    tone({ freq: 380, to: 920, dur: 0.1, type: 'sine', vol: 0.32 })
    tone({ freq: 1200, dur: 0.05, type: 'sine', vol: 0.06, delay: 0.05 })
  },
  /** encaixe de letra/peça */
  snap: () => {
    tone({ freq: 1400, to: 700, dur: 0.05, type: 'square', vol: 0.06 })
    tone({ freq: 520, to: 780, dur: 0.09, type: 'triangle', vol: 0.2, delay: 0.02 })
  },
  /** transição de tela */
  whoosh: () => noise({ dur: 0.28, vol: 0.07, from: 300, to: 2600 }),
  /** acerto */
  success: () => {
    ;[72, 76, 79, 84].forEach((n, i) => tone({ freq: NOTE(n), dur: 0.22, type: 'triangle', vol: 0.22, delay: i * 0.08 }))
    tone({ freq: NOTE(96), dur: 0.3, type: 'sine', vol: 0.05, delay: 0.32 })
  },
  /** erro gentil (sem punir) */
  error: () => {
    tone({ freq: 330, to: 250, dur: 0.16, type: 'triangle', vol: 0.2 })
    tone({ freq: 262, to: 190, dur: 0.22, type: 'triangle', vol: 0.18, delay: 0.14 })
  },
  /** item bloqueado */
  locked: () => {
    tone({ freq: 160, to: 110, dur: 0.12, type: 'square', vol: 0.06 })
    tone({ freq: 900, dur: 0.03, type: 'square', vol: 0.05, delay: 0.1 })
    tone({ freq: 700, dur: 0.03, type: 'square', vol: 0.05, delay: 0.16 })
  },
  /** estrela / ponto ganho */
  star: (i = 0) => {
    tone({ freq: NOTE(84 + i * 4), dur: 0.18, type: 'sine', vol: 0.22 })
    tone({ freq: NOTE(91 + i * 4), dur: 0.25, type: 'sine', vol: 0.08, delay: 0.05 })
  },
  /** curtida */
  like: () => {
    tone({ freq: 500, to: 1100, dur: 0.12, type: 'sine', vol: 0.25 })
    tone({ freq: NOTE(88), dur: 0.15, type: 'sine', vol: 0.08, delay: 0.08 })
  },
  /** liga/desliga */
  toggle: () => tone({ freq: 700, to: 1000, dur: 0.06, type: 'triangle', vol: 0.15 }),
  /** brilho mágico */
  sparkle: () => {
    for (let i = 0; i < 6; i++) tone({ freq: NOTE(88 + ((i * 5) % 12)), dur: 0.12, type: 'sine', vol: 0.07, delay: i * 0.05 })
  },
  /** fanfarra de conquista */
  fanfare: () => {
    const seq: [number, number, number][] = [
      [67, 0, 0.14],
      [72, 0.12, 0.14],
      [76, 0.24, 0.14],
      [79, 0.36, 0.3],
      [76, 0.62, 0.12],
      [79, 0.74, 0.5],
    ]
    seq.forEach(([n, d, len]) => {
      tone({ freq: NOTE(n), dur: len + 0.1, type: 'triangle', vol: 0.22, delay: d })
      tone({ freq: NOTE(n - 12), dur: len + 0.1, type: 'sine', vol: 0.12, delay: d })
    })
    noise({ dur: 0.6, vol: 0.04, from: 4000, to: 9000, delay: 0.7 })
    for (let i = 0; i < 8; i++) tone({ freq: NOTE(96 + (i % 4) * 3), dur: 0.1, type: 'sine', vol: 0.05, delay: 0.8 + i * 0.06 })
  },
  /** desbloqueio de fase */
  unlock: () => {
    tone({ freq: 900, dur: 0.04, type: 'square', vol: 0.06 })
    ;[79, 83, 86, 91].forEach((n, i) => tone({ freq: NOTE(n), dur: 0.2, type: 'sine', vol: 0.16, delay: 0.08 + i * 0.07 }))
  },
  /** traço de lápis (bem curtinho) */
  scribble: () => noise({ dur: 0.06, vol: 0.025, from: 2000, to: 3500 }),
  /** carimbo */
  stamp: () => {
    tone({ freq: 200, to: 90, dur: 0.12, type: 'sine', vol: 0.35 })
    tone({ freq: NOTE(84), dur: 0.12, type: 'triangle', vol: 0.08, delay: 0.06 })
  },
}

/* ---------------- narração ---------------- */

let voice: SpeechSynthesisVoice | null = null
function loadVoices() {
  if (typeof speechSynthesis === 'undefined') return
  const pick = () => {
    const all = speechSynthesis.getVoices()
    const pt = all.filter((v) => v.lang?.toLowerCase().replace('_', '-').startsWith('pt-br'))
    const pref = ['francisca', 'thalita', 'luciana', 'google português', 'maria', 'vitoria', 'vitória', 'felipe']
    voice =
      pref.map((p) => pt.find((v) => v.name.toLowerCase().includes(p))).find(Boolean) ||
      pt[0] ||
      all.find((v) => v.lang?.toLowerCase().startsWith('pt')) ||
      null
  }
  pick()
  speechSynthesis.onvoiceschanged = pick
}
loadVoices()

/* ---------- voz oficial do Luno (ElevenLabs, via /api/tts) ---------- */

/** palavra falada: texto e quando começa/termina (segundos desde o início da fala) */
export type SpokenWord = { t: string; s: number; e: number }
/** informação entregue no instante em que o áudio começa de verdade */
export type SpeechInfo = { duration: number; words: SpokenWord[]; voice: 'luno' | 'sistema' }

type Voice = { buffer: AudioBuffer; words: SpokenWord[] }

/** a voz do sistema assume quando a ElevenLabs falha; 401/402/403/404/503 desligam a ElevenLabs na sessão */
let lunoVoiceOff = false
let failures = 0
const TIMEOUT_MS = 6000
const CACHE = 'luno-voz-v2'
const voices = new Map<string, Promise<Voice | null>>()

const norm = (t: string) => t.replace(/\s+/g, ' ').trim()

function b64ToBuffer(b64: string): ArrayBuffer {
  const bin = atob(b64)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out.buffer
}

type Payload = { audio: string; duration: number; words: SpokenWord[] }

async function fetchVoice(text: string): Promise<Payload | null> {
  const key = `/__luno-voz/${encodeURIComponent(text)}`
  // 1) cache do navegador (não gasta crédito de novo)
  try {
    const hit = await caches.open(CACHE).then((c) => c.match(key))
    if (hit) return (await hit.json()) as Payload
  } catch {
    /* Cache API indisponível */
  }
  if (lunoVoiceOff) return null
  // 2) servidor
  const ctrl = new AbortController()
  const timer = window.setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const res = await fetch('./api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      signal: ctrl.signal,
    })
    const isJson = res.headers.get('content-type')?.includes('json')
    if (!res.ok || !isJson) {
      // sem créditos, chave inválida, voz não configurada ou sem servidor (hospedagem estática)
      if ([401, 402, 403, 404, 405, 503].includes(res.status) || !isJson) lunoVoiceOff = true
      else if (++failures >= 3) lunoVoiceOff = true
      return null
    }
    const data = (await res.json()) as Payload
    if (!data?.audio) return null
    failures = 0
    try {
      await caches.open(CACHE).then((c) => c.put(key, new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })))
    } catch {
      /* sem cache persistente */
    }
    return data
  } catch {
    if (++failures >= 3) lunoVoiceOff = true
    return null
  } finally {
    window.clearTimeout(timer)
  }
}

/** busca (e decodifica) a fala uma única vez; chamadas repetidas reaproveitam a mesma promessa */
function lunoVoice(text: string): Promise<Voice | null> {
  const t = norm(text)
  let p = voices.get(t)
  if (!p) {
    p = fetchVoice(t).then(async (data) => {
      const c = audio()
      if (!data || !c) return null
      try {
        return { buffer: await c.decodeAudioData(b64ToBuffer(data.audio)), words: data.words ?? [] }
      } catch {
        return null
      }
    })
    p.then((v) => !v && voices.delete(t))
    voices.set(t, p)
  }
  return p
}

/** pré-carrega falas que vão tocar em breve (ex.: o convite da abertura) */
export function preloadVoice(...texts: string[]) {
  if (lunoVoiceOff || typeof window === 'undefined') return
  texts.filter(Boolean).forEach((t) => void lunoVoice(t))
}

/** estimativa de tempo das palavras para a voz do sistema (que não informa o tempo) */
function estimateWords(text: string, rate: number): SpokenWord[] {
  const parts = text.split(/\s+/).filter(Boolean)
  const perChar = 0.068 / rate
  let t = 0
  return parts.map((w) => {
    const pause = /[.!?]$/.test(w) ? 0.32 : /[,;:]$/.test(w) ? 0.16 : 0.05
    const word = { t: w, s: t, e: t + w.length * perChar }
    t = word.e + pause
    return word
  })
}

let current: AudioBufferSourceNode | null = null
function stopCurrent() {
  try {
    current?.stop()
  } catch {
    /* já parou */
  }
  current = null
  if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel()
}

type SpeakOpts = {
  rate?: number
  pitch?: number
  /** no instante em que o som começa (com duração e tempo de cada palavra) */
  onStart?: (info: SpeechInfo) => void
  onEnd?: () => void
}

/** true do pedido de fala até ela terminar (inclui o tempo de carregar a voz) */
let busy = false
let speakToken = 0
export function speak(text: string, opts: SpeakOpts = {}) {
  stopCurrent()
  speaking = false
  if (muted) {
    busy = false
    emit()
    opts.onEnd?.()
    return
  }
  const token = ++speakToken
  busy = true
  const done = () => {
    if (token !== speakToken) return
    busy = false
    speaking = false
    emit()
    opts.onEnd?.()
  }
  const started = (info: SpeechInfo) => {
    if (token !== speakToken) return
    speaking = true
    emit()
    opts.onStart?.(info)
  }
  emit()

  if (lunoVoiceOff) return systemSpeak(text, opts, token, started, done)
  void lunoVoice(text).then((v) => {
    if (token !== speakToken) return // outra fala começou enquanto esta carregava
    const c = audio()
    if (!v || !c || !master || c.state !== 'running' || muted) return systemSpeak(text, opts, token, started, done)
    const src = c.createBufferSource()
    src.buffer = v.buffer
    src.connect(master)
    src.onended = () => {
      if (current === src) current = null
      done()
    }
    current = src
    src.start()
    started({ duration: v.buffer.duration, words: v.words, voice: 'luno' })
  })
}

/** voz do sistema (fallback) */
function systemSpeak(text: string, opts: SpeakOpts, token: number, started: (i: SpeechInfo) => void, done: () => void) {
  if (typeof speechSynthesis === 'undefined') return done()
  const rate = opts.rate ?? 0.95
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'pt-BR'
  if (voice) u.voice = voice
  u.rate = rate
  u.pitch = opts.pitch ?? 1.15
  const words = estimateWords(text, rate)
  const duration = words.at(-1)?.e ?? 1
  let began = false
  const begin = () => {
    if (began) return
    began = true
    started({ duration, words, voice: 'sistema' })
  }
  u.onstart = begin
  u.onend = done
  u.onerror = done
  speechSynthesis.speak(u)
  // alguns navegadores não disparam onstart/onend
  window.setTimeout(begin, 400)
  window.setTimeout(() => token === speakToken && busy && done(), 1500 + duration * 1300)
}

/** fala quando a narração atual terminar (espera no máximo ~8s) */
export function speakWhenFree(text: string, delay = 0) {
  const start = Date.now()
  const tick = () => {
    if (busy && Date.now() - start < 8000) return void window.setTimeout(tick, 250)
    speak(text)
  }
  window.setTimeout(tick, delay)
}

export function stopSpeaking() {
  speakToken++
  stopCurrent()
  busy = false
  speaking = false
  emit()
}

/* ---------------- estado (mudo / falando) ---------------- */

export function setMuted(v: boolean) {
  muted = v
  if (v) stopSpeaking()
  emit()
}
export const isMuted = () => muted

export const useMuted = () => useSyncExternalStore(subscribe, () => muted)
export const useSpeaking = () => useSyncExternalStore(subscribe, () => speaking)

/** vibração curtinha em celulares (feedback tátil) */
export function haptic(ms = 12) {
  try {
    navigator.vibrate?.(ms)
  } catch {
    /* sem suporte */
  }
}
