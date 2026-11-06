import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import QRCode from 'qrcode'
import type { Journey } from './journeys'
import { absoluteUrl } from '../router'

export default function ShareModal({ open, onClose, journey }: { open: boolean; onClose: () => void; journey: Journey }) {
  const [start, setStart] = useState('')
  const [copied, setCopied] = useState(false)
  const [qr, setQr] = useState('')

  const url = useMemo(() => absoluteUrl(`#/p/${journey.slug}${start ? `?screen=${start}` : ''}`), [journey.slug, start])
  const isLocal = /localhost|127\.0\.0\.1|0\.0\.0\.0/.test(window.location.hostname)

  useEffect(() => {
    if (!open) return
    QRCode.toDataURL(url, { margin: 1, width: 360, color: { dark: '#2e1065', light: '#ffffff' } })
      .then(setQr)
      .catch(() => setQr(''))
  }, [url, open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const t = document.createElement('textarea')
      t.value = url
      document.body.appendChild(t)
      t.select()
      document.execCommand('copy')
      t.remove()
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  const nativeShare = async () => {
    try {
      await navigator.share({ title: `Protótipo · ${journey.name}`, text: `Navegue pelo protótipo de ${journey.name} da Jovens Gênios`, url })
    } catch {
      /* cancelado */
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="pf-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            className="pf-modal__card"
            role="dialog"
            aria-modal
            aria-label="Compartilhar protótipo"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="pf-modal__close" onClick={onClose} aria-label="Fechar">
              ×
            </button>
            <div className="pf-modal__head">
              <img src={journey.icon} alt="" />
              <div>
                <h2>Compartilhar protótipo</h2>
                <p>
                  Quem abrir este link navega <b>apenas em {journey.name}</b>, em tela cheia, sem acesso à plataforma.
                </p>
              </div>
            </div>

            <label className="pf-field">
              <span>Começar em</span>
              <select value={start} onChange={(e) => setStart(e.target.value)}>
                <option value="">Tela de abertura (recomendado)</option>
                {journey.flows?.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="pf-link">
              <input readOnly value={url} onFocus={(e) => e.currentTarget.select()} aria-label="Link público" />
              <button className={`pf-btn pf-btn--primary ${copied ? 'is-done' : ''}`} onClick={copy}>
                {copied ? '✓ Copiado' : 'Copiar link'}
              </button>
            </div>

            <div className="pf-share-grid">
              {qr && (
                <div className="pf-qr">
                  <img src={qr} alt="QR code do link" />
                  <span>Aponte a câmera do celular ou tablet</span>
                </div>
              )}
              <div className="pf-share-actions">
                {'share' in navigator && (
                  <button className="pf-btn" onClick={nativeShare}>
                    Enviar por…
                  </button>
                )}
                <a className="pf-btn" href={url} target="_blank" rel="noreferrer">
                  Abrir link em nova aba
                </a>
                <a
                  className="pf-btn"
                  href={`https://wa.me/?text=${encodeURIComponent(`Protótipo ${journey.name} · Jovens Gênios: ${url}`)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>
              </div>
            </div>

            {isLocal && (
              <p className="pf-warn">
                Você está em um endereço local. Para outras pessoas abrirem, publique o site (ex.: Vercel ou GitHub Pages) e
                compartilhe a partir do endereço publicado.
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
