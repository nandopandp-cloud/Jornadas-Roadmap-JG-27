// Peças pequenas e compartilhadas do Modo Lição (checkbox, rádio, badges, campos, modal, drawer).
import { AnimatePresence, motion } from 'framer-motion'
import { CircleAlert, FileText, Headphones, ListChecks, MonitorPlay, X, type LucideIcon } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
import { DISC, OBJ, type Disciplina, type Tipo } from './data'

export const ICONE_OBJ: Record<Tipo, LucideIcon> = { Resumo: FileText, Vídeo: MonitorPlay, Áudio: Headphones, Quiz: ListChecks }

export function Caixa({ on, parcial, onClick, rotulo, desab }: { on: boolean; parcial?: boolean; onClick?: () => void; rotulo: string; desab?: boolean }) {
  return (
    <button type="button" role="checkbox" aria-checked={parcial ? 'mixed' : on} aria-label={rotulo} disabled={desab} className={`lc-caixa ${on || parcial ? 'is-on' : ''}`} onClick={onClick}>
      {parcial ? <i /> : on ? <svg viewBox="0 0 12 12" width="11" height="11"><path d="M2.5 6.2 5 8.6l4.6-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg> : null}
    </button>
  )
}

export function Radio({ on }: { on: boolean }) {
  return <span className={`lc-radio ${on ? 'is-on' : ''}`} aria-hidden />
}

export function Badge({ children, tom = 'neutro', icone: Ic }: { children: ReactNode; tom?: 'neutro' | 'roxo' | 'verde' | 'amarelo' | 'red'; icone?: LucideIcon }) {
  return (
    <span className={`lc-badge is-${tom}`}>
      {Ic && <Ic size={13} />}
      {children}
    </span>
  )
}

export function Ponto({ d, tam = 10 }: { d: Disciplina; tam?: number }) {
  return <span className="lc-ponto" style={{ width: tam, height: tam, background: DISC[d].cor }} aria-hidden />
}

export function TileObj({ tipo, tam = 40 }: { tipo: Tipo; tam?: number }) {
  const Ic = ICONE_OBJ[tipo]
  return (
    <span className="lc-tile" style={{ width: tam, height: tam, background: OBJ[tipo].fundo, color: OBJ[tipo].cor }}>
      <Ic size={Math.round(tam * 0.45)} />
    </span>
  )
}

export function Tile({ icone: Ic, tam = 36 }: { icone: LucideIcon; tam?: number }) {
  return (
    <span className="lc-tile is-roxo" style={{ width: tam, height: tam }}>
      <Ic size={Math.round(tam * 0.47)} />
    </span>
  )
}

export function Erro({ children }: { children: ReactNode }) {
  return (
    <small className="lc-erro" role="alert">
      <CircleAlert size={13} /> {children}
    </small>
  )
}

export function Aviso({ children, tom = 'roxo', icone: Ic }: { children: ReactNode; tom?: 'roxo' | 'amarelo' | 'red' | 'verde'; icone: LucideIcon }) {
  return (
    <div className={`lc-aviso is-${tom}`}>
      <Ic size={16} />
      <div>{children}</div>
    </div>
  )
}

export function SecTit({ icone, titulo, desc, children }: { icone: LucideIcon; titulo: string; desc?: ReactNode; children?: ReactNode }) {
  return (
    <div className="lc-sectit">
      <Tile icone={icone} />
      <div className="lc-sectit__txt">
        <h2>{titulo}</h2>
        {desc && <p>{desc}</p>}
      </div>
      {children}
    </div>
  )
}

/** Modal centralizado no desktop, folha de baixo no celular */
export function Modal({ aberto, onFechar, titulo, sub, topo, largura = 640, rodape, children, rotulo }: { aberto: boolean; onFechar: () => void; titulo: string; sub?: string; topo?: ReactNode; largura?: number; rodape?: ReactNode; children: ReactNode; rotulo?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (aberto) setTimeout(() => ref.current?.focus(), 30)
  }, [aberto])
  return (
    <AnimatePresence>
      {aberto && (
        <motion.div className="lc-camada" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && onFechar()}>
          <motion.div
            ref={ref}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={rotulo ?? titulo}
            className="lc-modal"
            style={{ maxWidth: largura }}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <header className="lc-modal__cab">
              {topo}
              <div className="lc-modal__tit">
                <h2>{titulo}</h2>
                {sub && <p>{sub}</p>}
              </div>
              <button className="rx-icone-btn" onClick={onFechar} aria-label="Fechar">
                <X size={18} />
              </button>
            </header>
            <div className="lc-modal__corpo">{children}</div>
            {rodape && <footer className="lc-modal__rod">{rodape}</footer>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Drawer({ aberto, onFechar, titulo, sub, rodape, children, largura = 520 }: { aberto: boolean; onFechar: () => void; titulo: string; sub?: string; rodape?: ReactNode; children: ReactNode; largura?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (aberto) setTimeout(() => ref.current?.focus(), 30)
  }, [aberto])
  return (
    <AnimatePresence>
      {aberto && (
        <motion.div className="lc-camada is-drawer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && onFechar()}>
          <motion.aside ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={titulo} className="lc-drawer" style={{ width: `min(${largura}px, 100vw)` }} initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.24 }}>
            <header className="lc-drawer__cab">
              <div>
                <h2>{titulo}</h2>
                {sub && <p>{sub}</p>}
              </div>
              <button className="rx-icone-btn" onClick={onFechar} aria-label="Fechar">
                <X size={18} />
              </button>
            </header>
            <div className="lc-drawer__corpo">{children}</div>
            {rodape && <footer className="lc-drawer__rod">{rodape}</footer>}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Contador({ n, max }: { n: number; max: number }) {
  return (
    <small className={n > max ? 'is-red' : ''}>
      {n.toLocaleString('pt-BR')} de {max.toLocaleString('pt-BR')} caracteres
    </small>
  )
}
