import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { journeys, findJourney, type Journey } from './journeys'
import { absoluteUrl, navigate } from '../router'
import ShareModal from './ShareModal'

type Device = 'desktop' | 'tablet' | 'mobile'
const DEVICES: Record<Device, { w: number; h: number; label: string }> = {
  desktop: { w: 1440, h: 900, label: 'Desktop' },
  tablet: { w: 1180, h: 820, label: 'Tablet' },
  mobile: { w: 390, h: 844, label: 'Celular' },
}

export default function Hub({ slug }: { slug?: string }) {
  const journey = findJourney(slug) ?? journeys[0]
  const [device, setDevice] = useState<Device>(journey.dispositivo ?? 'tablet')
  const [flow, setFlow] = useState<string | null>(null)
  const [nonce, setNonce] = useState(0)
  const [shareOpen, setShareOpen] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const isNarrow = useMedia('(max-width: 860px)')

  useEffect(() => {
    document.title = `${journey.name} · Jornadas Jovens Gênios`
    setDevice(journey.dispositivo ?? 'tablet')
  }, [journey])

  const select = (j: Journey) => {
    setFlow(null)
    setNonce((n) => n + 1)
    setDrawer(false)
    navigate(`#/jornada/${j.slug}`)
  }

  const openFlow = (id: string) => {
    setFlow(id)
    setNonce((n) => n + 1)
  }

  const src = absoluteUrl(`#/p/${journey.slug}?embed=1${flow ? `&screen=${flow}` : ''}`)
  const effectiveDevice: Device = isNarrow ? 'mobile' : device
  const navegavel = journey.status === 'navegavel'

  return (
    <div className="pf">
      {/* ------- sidebar ------- */}
      <AnimatePresence>
        {isNarrow && drawer && (
          <motion.div
            className="pf-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawer(false)}
          />
        )}
      </AnimatePresence>
      <aside className={`pf-side ${drawer ? 'is-open' : ''}`}>
        <div className="pf-brand">
          <BrandMark />
          <div>
            <strong>Jornadas</strong>
            <span>Roadmap 2027 · Jovens Gênios</span>
          </div>
        </div>

        <p className="pf-side__label">Protótipos navegáveis</p>
        <nav className="pf-list">
          {journeys.map((j) => (
            <button
              key={j.slug}
              className={`pf-item ${j.slug === journey.slug ? 'is-active' : ''} ${j.status !== 'navegavel' ? 'is-building' : ''}`}
              onClick={() => select(j)}
            >
              <span className="pf-item__icon">
                <img src={j.icon} alt="" />
              </span>
              <span className="pf-item__text">
                <strong>{j.name}</strong>
                {j.status !== 'navegavel' && <em className="pf-tag">Em construção</em>}
                <small>{j.audience}</small>
              </span>
              {j.slug === journey.slug && <motion.span layoutId="pf-active" className="pf-item__bar" />}
            </button>
          ))}
          <div className="pf-item pf-item--soon">
            <span className="pf-item__icon pf-item__icon--dashed">+</span>
            <span className="pf-item__text">
              <strong>Próxima jornada</strong>
              <small>Em breve</small>
            </span>
          </div>
        </nav>

        <div className="pf-side__foot">
          <p>
            Cada jornada tem um <b>link público</b>: quem recebe navega só naquele protótipo, sem acessar a plataforma.
          </p>
        </div>
      </aside>

      {/* ------- conteúdo ------- */}
      <main className="pf-main">
        <header className="pf-head">
          {isNarrow && (
            <button className="pf-icon-btn" aria-label="Abrir menu" onClick={() => setDrawer(true)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          )}
          <div className="pf-head__title">
            <span className={`pf-chip ${navegavel ? '' : 'pf-chip--building'}`}>
              <i /> {navegavel ? 'Navegável' : 'Em construção'}
            </span>
            <h1>{journey.name}</h1>
            <p>
              {journey.product} · {journey.audience}
            </p>
          </div>
          {navegavel && (
          <div className="pf-head__actions">
            {!isNarrow && (
              <div className="pf-seg" role="tablist" aria-label="Dispositivo">
                {(Object.keys(DEVICES) as Device[]).map((d) => (
                  <button key={d} className={device === d ? 'is-on' : ''} onClick={() => setDevice(d)} role="tab" aria-selected={device === d}>
                    {device === d && <motion.span layoutId="pf-seg" className="pf-seg__pill" />}
                    <DeviceIcon d={d} />
                    <span>{DEVICES[d].label}</span>
                  </button>
                ))}
              </div>
            )}
            <button className="pf-btn" onClick={() => setNonce((n) => n + 1)} title="Reiniciar protótipo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              {!isNarrow && 'Reiniciar'}
            </button>
            <a className="pf-btn" href={absoluteUrl(`#/p/${journey.slug}`)} target="_blank" rel="noreferrer" title="Abrir em tela cheia">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 4h6v6M10 14 20 4M20 14v6H4V4h6" />
              </svg>
              {!isNarrow && 'Tela cheia'}
            </a>
            <button className="pf-btn pf-btn--primary" onClick={() => setShareOpen(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
              </svg>
              {!isNarrow && 'Compartilhar'}
            </button>
          </div>
          )}
        </header>

        {!navegavel && <Construcao journey={journey} />}

        {navegavel && journey.flows && (
          <div className="pf-flows">
            <span className="pf-flows__label">Ir direto para</span>
            <div className="pf-flows__list">
              {journey.flows.map((f) => (
                <button key={f.id} className={`pf-flow ${flow === f.id ? 'is-on' : ''}`} onClick={() => openFlow(f.id)}>
                  <img src={f.icon} alt="" />
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {navegavel && <Preview key={`${journey.slug}-${effectiveDevice}`} device={effectiveDevice} src={src} nonce={nonce} bare={isNarrow} dominio={journey.dominio} />}
        {!isNarrow && navegavel && <p className="pf-hint">{journey.description}</p>}
      </main>

      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} journey={journey} />
    </div>
  )
}

/* ---------- jornada em construção: etapa atual e links de trabalho ---------- */
function Construcao({ journey }: { journey: Journey }) {
  const etapas = journey.etapas ?? []
  const atual = etapas.find((e) => e.estado === 'atual')
  return (
    <section className="pf-build">
      <motion.div className="pf-build__card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <img className="pf-build__icon" src={journey.icon} alt="" />
        <div className="pf-build__body">
          <span className="pf-build__eyebrow">Navegável em construção</span>
          <h2>{atual ? `Agora: ${atual.nome.toLowerCase()}` : 'Em breve por aqui'}</h2>
          <p>{journey.description}</p>
          {etapas.length > 0 && (
            <ol className="pf-steps">
              {etapas.map((e, i) => (
                <li key={e.nome} className={`is-${e.estado}`}>
                  <span className="pf-steps__dot">{e.estado === 'feito' ? '✓' : i + 1}</span>
                  <span>
                    <b>{e.nome}</b>
                    <small>{e.estado === 'feito' ? 'Concluído' : e.estado === 'atual' ? 'Em andamento' : 'Próximo'}</small>
                  </span>
                </li>
              ))}
            </ol>
          )}
          {journey.links && journey.links.length > 0 && (
            <div className="pf-build__links">
              {journey.links.map((l) => (
                <a key={l.url} className="pf-btn" href={l.url} target="_blank" rel="noreferrer">
                  {l.label}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 4h6v6M10 14 20 4M20 14v6H4V4h6" />
                  </svg>
                </a>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </section>
  )
}

/* ---------- moldura de dispositivo com escala automática ---------- */
function Preview({ device, src, nonce, bare, dominio = 'alunos.jovensgenios.com' }: { device: Device; src: string; nonce: number; bare: boolean; dominio?: string }) {
  const wrap = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const { w, h } = DEVICES[device]
  const pad = device === 'mobile' ? 28 : device === 'tablet' ? 36 : 0
  const chrome = device === 'desktop' ? 40 : 0
  const fw = w + pad
  const fh = h + pad + chrome

  useLayoutEffect(() => {
    if (bare || !wrap.current) return
    const el = wrap.current
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect()
      setScale(Math.min(r.width / fw, r.height / fh, 1))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [fw, fh, bare])

  if (bare) {
    return (
      <div className="pf-preview pf-preview--bare">
        <iframe key={nonce} src={src} title="Protótipo" allow="autoplay; microphone; camera; clipboard-write" />
      </div>
    )
  }

  return (
    <div className="pf-preview" ref={wrap}>
      <motion.div
        className={`pf-device pf-device--${device}`}
        style={{ width: fw, height: fh, scale }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 26 }}
      >
        {device === 'desktop' && (
          <div className="pf-device__bar">
            <i />
            <i />
            <i />
            <span>{dominio}</span>
          </div>
        )}
        {device === 'mobile' && <div className="pf-device__notch" />}
        <div className="pf-device__screen" style={{ width: w, height: h }}>
          <iframe key={nonce} src={src} title="Protótipo" allow="autoplay; microphone; camera; clipboard-write" />
        </div>
      </motion.div>
    </div>
  )
}

function DeviceIcon({ d }: { d: Device }) {
  const p = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  if (d === 'desktop')
    return (
      <svg {...p}>
        <rect x="2" y="4" width="20" height="13" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    )
  if (d === 'tablet')
    return (
      <svg {...p}>
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="M11 16h2" />
      </svg>
    )
  return (
    <svg {...p}>
      <rect x="7" y="2" width="10" height="20" rx="2.5" />
      <path d="M11 18h2" />
    </svg>
  )
}

export function BrandMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <defs>
        <linearGradient id="bm" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#5b21b6" />
        </linearGradient>
      </defs>
      <path d="M24 3 42 13.5v21L24 45 6 34.5v-21Z" fill="url(#bm)" />
      <path
        d="M18 15a4 4 0 0 1 7 2.4h4.2a2 2 0 0 1 2 2v4a4 4 0 1 1 0 6.4v3a2 2 0 0 1-2 2H17a2 2 0 0 1-2-2v-4a4 4 0 1 0 0-6.4v-5.2a2 2 0 0 1 2-2h1.2"
        fill="#fff"
      />
    </svg>
  )
}

function useMedia(q: string) {
  const [m, setM] = useState(() => window.matchMedia(q).matches)
  useEffect(() => {
    const mq = window.matchMedia(q)
    const on = () => setM(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [q])
  return m
}
