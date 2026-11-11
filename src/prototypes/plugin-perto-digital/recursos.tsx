// Recursos do plugin de acessibilidade: máscara e guia de leitura, leitor de texto, atalhos flutuantes, painel e avisos.
import { AnimatePresence, motion } from 'framer-motion'
import {
  AArrowDown,
  AArrowUp,
  BookOpenText,
  Check,
  CircleCheck,
  Contrast,
  Eye,
  Focus,
  Info,
  Keyboard,
  Link2,
  MousePointer2,
  Pause,
  RotateCcw,
  ScanFace,
  SlidersHorizontal,
  Space,
  Type,
  Volume2,
  Rows3,
  Palette,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { IconeAcess } from './icones'
import { ESCALAS, perfilAtivo, ponteiro, useA11y, type Ajustes, type PerfilId } from './a11y'

/* ---------------- ponteiro: mouse e toque alimentam a máscara/guia ---------------- */
export function RastreioPonteiro() {
  useEffect(() => {
    const on = (e: PointerEvent) => ponteiro.set({ x: e.clientX, y: e.clientY })
    window.addEventListener('pointermove', on, { passive: true })
    window.addEventListener('pointerdown', on, { passive: true })
    return () => {
      window.removeEventListener('pointermove', on)
      window.removeEventListener('pointerdown', on)
    }
  }, [])
  return null
}

/* ---------------- máscara de leitura ---------------- */
export function Mascara() {
  const topo = useRef<HTMLDivElement>(null)
  const base = useRef<HTMLDivElement>(null)
  const faixa = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let raf = 0
    const pinta = (p: { y: number }) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const h = parseFloat(getComputedStyle(document.documentElement).fontSize) * 4.25
        const y0 = Math.max(0, p.y - h / 2)
        if (topo.current) topo.current.style.height = `${y0}px`
        if (base.current) base.current.style.top = `${y0 + h}px`
        if (faixa.current) {
          faixa.current.style.top = `${y0}px`
          faixa.current.style.height = `${h}px`
        }
      })
    }
    pinta(ponteiro.get())
    const off = ponteiro.ouvir(pinta)
    return () => {
      off()
      cancelAnimationFrame(raf)
    }
  }, [])
  return (
    <motion.div className="pd-mascara" aria-hidden initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
      <div ref={topo} className="pd-mascara__sombra pd-mascara__sombra--topo" />
      <div ref={faixa} className="pd-mascara__faixa" />
      <div ref={base} className="pd-mascara__sombra pd-mascara__sombra--base" />
    </motion.div>
  )
}

/* ---------------- guia (régua) de leitura ---------------- */
export function Guia({ comMascara }: { comMascara: boolean }) {
  const el = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let raf = 0
    const pinta = (p: { x: number; y: number }) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const g = el.current
        if (!g) return
        const w = g.offsetWidth
        const x = Math.min(Math.max(8, p.x - w * 0.12), window.innerWidth - w - 8)
        const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
        g.style.transform = `translate(${x}px, ${p.y + (comMascara ? 0.15 : 0.85) * rem}px)`
      })
    }
    pinta(ponteiro.get())
    const off = ponteiro.ouvir(pinta)
    return () => {
      off()
      cancelAnimationFrame(raf)
    }
  }, [comMascara])
  return (
    <motion.div className="pd-guia" aria-hidden initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div ref={el} className="pd-guia__linha" />
    </motion.div>
  )
}

/* ---------------- leitor de texto: clique em um texto para ouvir ---------------- */
const LEGIVEL = 'h1,h2,h3,h4,p,li,label,button,a,[data-ler],span,small,strong,em'
export function Leitor() {
  const { falar } = useA11y()
  const [lendo, setLendo] = useState<string | null>(null)
  useEffect(() => {
    let marcado: Element | null = null
    let t = 0
    const on = (e: MouseEvent) => {
      const alvo = e.target as HTMLElement | null
      if (!alvo || alvo.closest('.pd-sistema')) return
      if (alvo instanceof HTMLInputElement) {
        const rot = alvo.labels?.[0]?.textContent || alvo.getAttribute('aria-label') || alvo.placeholder
        if (rot) {
          falar(`Campo ${rot}`)
          setLendo(`Campo ${rot}`)
        }
        return
      }
      const el = alvo.closest(LEGIVEL) as HTMLElement | null
      const bloco = el?.closest('[data-ler]') as HTMLElement | null
      const fonte = bloco ?? el
      const texto = (fonte?.getAttribute('aria-label') || fonte?.innerText || '').replace(/\s+/g, ' ').trim()
      if (!fonte || !texto) return
      marcado?.classList.remove('pd-lendo')
      marcado = fonte
      fonte.classList.add('pd-lendo')
      window.clearTimeout(t)
      t = window.setTimeout(() => fonte.classList.remove('pd-lendo'), 2600)
      falar(texto)
      setLendo(texto)
    }
    document.addEventListener('click', on, true)
    return () => {
      document.removeEventListener('click', on, true)
      marcado?.classList.remove('pd-lendo')
      window.clearTimeout(t)
    }
  }, [falar])
  return (
    <motion.div className="pd-leitor pd-sistema" role="status" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>
      <span className="pd-leitor__ic">
        <Volume2 size={18} />
      </span>
      <span className="pd-leitor__txt">{lendo ? <>Lendo: “{lendo.length > 70 ? `${lendo.slice(0, 70)}…` : lendo}”</> : 'Leitor ativo: clique em qualquer texto para ouvir'}</span>
      {lendo && (
        <button
          className="pd-leitor__parar"
          onClick={() => {
            window.speechSynthesis?.cancel()
            setLendo(null)
          }}
        >
          Parar
        </button>
      )}
    </motion.div>
  )
}

/* ---------------- atalhos flutuantes (Acessibilidade · Libras · Navegação por face) ---------------- */
export function Dock({ onLibras, onFace }: { onLibras: () => void; onFace: () => void }) {
  const { a, ativados, abrirPainel, painel } = useA11y()
  const [rotulos, setRotulos] = useState(false)
  // logo depois de ativar, os rótulos ficam abertos (como na referência) e recolhem depois de alguns segundos
  useEffect(() => {
    if (!ativados) return
    setRotulos(true)
    const t = window.setTimeout(() => setRotulos(false), 9000)
    return () => window.clearTimeout(t)
  }, [ativados])

  const itens: { id: string; rotulo: string; icone: ReactNode; ativo?: boolean; acao: () => void }[] = [
    { id: 'acess', rotulo: 'Acessibilidade', icone: <IconeAcess size={30} />, ativo: painel, acao: () => abrirPainel(!painel) },
    ...(ativados
      ? [
          { id: 'libras', rotulo: 'Libras', icone: <img src="./ppsp/libras.png" alt="" />, ativo: a.libras, acao: onLibras },
          { id: 'face', rotulo: 'Navegação por face', icone: <ScanFace size={28} strokeWidth={2} />, ativo: a.face, acao: onFace },
        ]
      : []),
  ]
  return (
    <nav className={`pd-dock pd-sistema ${rotulos ? 'pd-dock--rotulos' : ''}`} aria-label="Recursos de acessibilidade">
      {itens.map((it, i) => (
        <motion.button
          key={it.id}
          className={`pd-dock__item ${it.ativo ? 'is-ativo' : ''}`}
          onClick={it.acao}
          aria-pressed={it.id === 'acess' ? undefined : !!it.ativo}
          aria-expanded={it.id === 'acess' ? painel : undefined}
          aria-label={it.rotulo}
          initial={i ? { opacity: 0, x: 40 } : false}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.12, type: 'spring', stiffness: 380, damping: 28 }}
        >
          <span className="pd-dock__rotulo">{it.rotulo}</span>
          <span className="pd-dock__circ">
            {it.icone}
            {it.ativo && it.id !== 'acess' && (
              <span className="pd-dock__on">
                <Check size={11} strokeWidth={4} />
              </span>
            )}
          </span>
        </motion.button>
      ))}
    </nav>
  )
}

/* ---------------- painel de acessibilidade ---------------- */
type Tile = { k: keyof Ajustes; rotulo: string; desc: string; icone: LucideIcon }
const LEITURA: Tile[] = [
  { k: 'mascara', rotulo: 'Máscara de leitura', desc: 'Escurece a tela e destaca só a linha em que você está', icone: Rows3 },
  { k: 'guia', rotulo: 'Guia de leitura', desc: 'Uma régua que acompanha o cursor', icone: Focus },
  { k: 'leitor', rotulo: 'Leitor de texto', desc: 'Clique em um texto para ouvir', icone: Volume2 },
  { k: 'legivel', rotulo: 'Fonte legível', desc: 'Letras mais fáceis de diferenciar', icone: Type },
  { k: 'espacamento', rotulo: 'Espaçamento', desc: 'Mais espaço entre letras e linhas', icone: Space },
]
const VISUAL: Tile[] = [
  { k: 'contraste', rotulo: 'Alto contraste', desc: 'Fundo escuro e textos bem marcados', icone: Contrast },
  { k: 'cinza', rotulo: 'Escala de cinza', desc: 'Remove as cores da tela', icone: Palette },
  { k: 'destacar', rotulo: 'Destacar links', desc: 'Contorna links e botões', icone: Link2 },
  { k: 'cursor', rotulo: 'Cursor ampliado', desc: 'Ponteiro maior e mais visível', icone: MousePointer2 },
]
const PERFIS_UI: { id: PerfilId; rotulo: string; icone: LucideIcon; desc: string }[] = [
  { id: 'foco', rotulo: 'Mais foco', icone: Zap, desc: 'Máscara e guia de leitura' },
  { id: 'leitura', rotulo: 'Mais conforto na leitura', icone: Eye, desc: 'Texto maior, fonte legível e espaçamento' },
  { id: 'ritmo', rotulo: 'Uma navegação no seu ritmo', icone: SlidersHorizontal, desc: 'Sem animações, links destacados e cursor maior' },
]

export function Painel({ onLibras, onFace }: { onLibras: () => void; onFace: () => void }) {
  const { a, set, alternar, perfil, restaurar, painel, abrirPainel } = useA11y()
  const ref = useRef<HTMLDivElement>(null)
  const voltar = useRef<Element | null>(null)
  useEffect(() => {
    if (!painel) return
    voltar.current = document.activeElement
    const t = window.setTimeout(() => ref.current?.querySelector<HTMLElement>('button')?.focus(), 60)
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && abrirPainel(false)
    window.addEventListener('keydown', esc)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('keydown', esc)
      ;(voltar.current as HTMLElement | null)?.focus?.()
    }
  }, [painel, abrirPainel])

  const tile = (t: Tile) => {
    const on = !!a[t.k]
    const Ic = t.icone
    return (
      <button key={t.k} className={`pd-tile ${on ? 'is-on' : ''}`} aria-pressed={on} onClick={() => alternar(t.k)}>
        <span className="pd-tile__ic">
          <Ic size={20} />
        </span>
        <span className="pd-tile__txt">
          <strong>{t.rotulo}</strong>
          <small>{t.desc}</small>
        </span>
        <span className="pd-switch" aria-hidden>
          <span />
        </span>
      </button>
    )
  }

  return (
    <AnimatePresence>
      {painel && (
        <>
          <motion.div className="pd-painel-fundo pd-sistema" onClick={() => abrirPainel(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.aside
            ref={ref}
            className="pd-painel pd-sistema"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pd-painel-titulo"
            initial={{ x: '104%' }}
            animate={{ x: 0 }}
            exit={{ x: '104%' }}
            transition={{ type: 'spring', stiffness: 360, damping: 36 }}
          >
            <header className="pd-painel__topo">
              <span className="pd-painel__selo">
                <IconeAcess size={22} />
              </span>
              <div>
                <h2 id="pd-painel-titulo">Acessibilidade</h2>
                <p>Ajuste o Prepara SP do seu jeito. Suas escolhas ficam salvas na sua conta.</p>
              </div>
              <button className="pd-icone-btn" onClick={() => abrirPainel(false)} aria-label="Fechar painel de acessibilidade">
                <X size={20} />
              </button>
            </header>

            <div className="pd-painel__corpo">
              <section>
                <h3>Perfis rápidos</h3>
                <div className="pd-perfis">
                  {PERFIS_UI.map((p) => {
                    const on = perfilAtivo(a, p.id)
                    const Ic = p.icone
                    return (
                      <button key={p.id} className={`pd-perfil ${on ? 'is-on' : ''}`} aria-pressed={on} onClick={() => perfil(p.id)}>
                        <Ic size={22} />
                        <strong>{p.rotulo}</strong>
                        <small>{p.desc}</small>
                        {on && (
                          <span className="pd-perfil__ok">
                            <Check size={12} strokeWidth={3.5} />
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </section>

              <section>
                <h3>Leitura</h3>
                <div className="pd-fonte">
                  <span className="pd-tile__ic">
                    <BookOpenText size={20} />
                  </span>
                  <span className="pd-tile__txt">
                    <strong>Tamanho do texto</strong>
                    <small>{Math.round(ESCALAS[a.fonte] * 100)}%</small>
                  </span>
                  <div className="pd-fonte__ctrl" role="group" aria-label="Tamanho do texto">
                    <button onClick={() => set({ fonte: Math.max(0, a.fonte - 1) })} disabled={a.fonte === 0} aria-label="Diminuir texto">
                      <AArrowDown size={20} />
                    </button>
                    <div className="pd-fonte__barra" aria-hidden>
                      {ESCALAS.map((_, i) => (
                        <span key={i} className={i <= a.fonte ? 'is-on' : ''} />
                      ))}
                    </div>
                    <button onClick={() => set({ fonte: Math.min(ESCALAS.length - 1, a.fonte + 1) })} disabled={a.fonte === ESCALAS.length - 1} aria-label="Aumentar texto">
                      <AArrowUp size={20} />
                    </button>
                  </div>
                </div>
                <div className="pd-tiles">{LEITURA.map(tile)}</div>
              </section>

              <section>
                <h3>Visual</h3>
                <div className="pd-tiles">{VISUAL.map(tile)}</div>
              </section>

              <section>
                <h3>Navegação</h3>
                <div className="pd-tiles">
                  <button className={`pd-tile ${a.libras ? 'is-on' : ''}`} aria-pressed={a.libras} onClick={onLibras}>
                    <span className="pd-tile__ic pd-tile__ic--img">
                      <img src="./ppsp/libras.png" alt="" />
                    </span>
                    <span className="pd-tile__txt">
                      <strong>Libras</strong>
                      <small>Intérprete virtual VLibras</small>
                    </span>
                    <span className="pd-switch" aria-hidden>
                      <span />
                    </span>
                  </button>
                  <button className={`pd-tile ${a.face ? 'is-on' : ''}`} aria-pressed={a.face} onClick={onFace}>
                    <span className="pd-tile__ic">
                      <ScanFace size={20} />
                    </span>
                    <span className="pd-tile__txt">
                      <strong>Navegação por face</strong>
                      <small>Mova o cursor com a cabeça</small>
                    </span>
                    <span className="pd-switch" aria-hidden>
                      <span />
                    </span>
                  </button>
                  {tile({ k: 'pausar', rotulo: 'Pausar animações', desc: 'Interface sem movimento', icone: Pause })}
                </div>
              </section>

              <div className="pd-atalhos">
                <Keyboard size={18} />
                <span>
                  <kbd>Alt</kbd> + <kbd>A</kbd> abre este painel · <kbd>Alt</kbd> + <kbd>M</kbd> liga a máscara · <kbd>Esc</kbd> fecha
                </span>
              </div>
            </div>

            <footer className="pd-painel__rodape">
              <button className="pd-btn pd-btn--linha" onClick={restaurar}>
                <RotateCcw size={18} /> Restaurar padrão
              </button>
              <button className="pd-btn pd-btn--primario" onClick={() => abrirPainel(false)}>
                <CircleCheck size={18} /> Pronto
              </button>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

/* ---------------- avisos ---------------- */
export function Avisos() {
  const { avisos } = useA11y()
  return (
    <div className="pd-avisos pd-sistema" aria-live="polite">
      <AnimatePresence>
        {avisos.map((x) => (
          <motion.div key={x.id} className={`pd-aviso pd-aviso--${x.tom}`} layout initial={{ opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8 }}>
            {x.tom === 'erro' ? <Info size={18} /> : x.tom === 'info' ? <Info size={18} /> : <CircleCheck size={18} />}
            {x.texto}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

/* ---------------- atalhos de teclado ---------------- */
export function Teclado() {
  const { abrirPainel, painel, alternar } = useA11y()
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (!e.altKey) return
      if (e.code === 'KeyA') {
        e.preventDefault()
        abrirPainel(!painel)
      } else if (e.code === 'KeyM') {
        e.preventDefault()
        alternar('mascara')
      }
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [abrirPainel, painel, alternar])
  return null
}
