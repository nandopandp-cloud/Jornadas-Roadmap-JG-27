import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { Check, ChevronDown, ChevronLeft, ChevronRight, Circle, CircleAlert, Crown, Gem, Info, Search, Star, X } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { PLAT, RARIDADES, STATUS_RESGATE, iniciais, type Item, type PlataformaId, type Raridade, type StatusResgate } from '../data'
import { useAdm } from '../store'

const raiz = () => document.querySelector('.ga') ?? document.body

/* ---------------- botão ---------------- */
type BtnProps = {
  children?: ReactNode
  variante?: 'primario' | 'contorno' | 'fantasma' | 'perigo'
  icone?: ReactNode
  iconeDir?: ReactNode
  pequeno?: boolean
  className?: string
  disabled?: boolean
  title?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}
export function Btn({ children, variante = 'primario', icone, iconeDir, pequeno, className = '', ...p }: BtnProps) {
  return (
    <motion.button whileTap={p.disabled ? undefined : { scale: 0.97 }} className={`ga-btn ga-btn--${variante} ${pequeno ? 'ga-btn--p' : ''} ${className}`} {...p}>
      {icone}
      {children && <span>{children}</span>}
      {iconeDir}
    </motion.button>
  )
}

/* ---------------- ícone de plataforma ---------------- */
export function IconePlataforma({ p, tam = 26 }: { p: PlataformaId; tam?: number }) {
  const pl = PLAT[p]
  if (!pl.icone)
    return (
      <span className="ga-plat-g" style={{ width: tam, height: tam, fontSize: tam * 0.56 }}>
        G
      </span>
    )
  return <img src={pl.icone} alt="" style={{ width: tam, height: tam, objectFit: 'contain' }} />
}

/* ---------------- miniatura do item ---------------- */
export function Thumb({ item, tam = 44 }: { item: Pick<Item, 'img' | 'foto' | 'filtro'>; tam?: number }) {
  return (
    <span className={`ga-thumb ${item.foto ? 'is-foto' : ''}`} style={{ width: tam, height: tam }}>
      <img src={item.img} alt="" style={item.filtro ? { filter: item.filtro } : undefined} />
    </span>
  )
}
export function Avatar({ nome, tam = 34 }: { nome: string; tam?: number }) {
  return (
    <span className="ga-avatar" style={{ width: tam, height: tam, fontSize: tam * 0.4 }}>
      {iniciais(nome)}
    </span>
  )
}

/* ---------------- chips ---------------- */
export function ChipRaridade({ r }: { r: Raridade }) {
  const I = { comum: Circle, raro: Star, epico: Gem, lendario: Crown }[r]
  return (
    <span className={`ga-rar ga-rar--${r}`}>
      <I size={13} strokeWidth={2.4} fill={r === 'comum' ? 'none' : 'currentColor'} />
      {RARIDADES[r]}
    </span>
  )
}
export function ChipStatus({ st, rotulo }: { st: StatusResgate | 'ativo' | 'inativo' | 'ativa' | 'inativa' | 'rascunho'; rotulo?: string }) {
  const t = rotulo ?? (st === 'ativo' ? 'Ativo' : st === 'inativo' ? 'Inativo' : st === 'ativa' ? 'Ativa' : st === 'inativa' ? 'Inativa' : st === 'rascunho' ? 'Rascunho' : STATUS_RESGATE[st as StatusResgate])
  return (
    <span className={`ga-st ga-st--${st}`}>
      <i />
      {t}
    </span>
  )
}

/* ---------------- pop-up com posição fixa ---------------- */
export function Pop({ aberto, ancora, alinhar = 'esq', onFechar, children, className = '' }: { aberto: boolean; ancora: React.RefObject<HTMLElement | null>; alinhar?: 'esq' | 'dir'; onFechar: () => void; children: ReactNode; className?: string }) {
  const [pos, setPos] = useState<{ top?: number; bottom?: number; left?: number; right?: number; minWidth: number } | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    if (!aberto) return
    const r = ancora.current?.getBoundingClientRect()
    if (r) {
      const acima = r.bottom + 320 > window.innerHeight && r.top > 340
      setPos({ ...(acima ? { bottom: window.innerHeight - r.top + 6 } : { top: r.bottom + 6 }), ...(alinhar === 'dir' ? { right: Math.max(8, window.innerWidth - r.right) } : { left: Math.min(r.left, window.innerWidth - 270) }), minWidth: r.width })
    }
    const fechar = (e: Event) => !(e.target as HTMLElement)?.closest?.('.ga-pop') && onFechar()
    window.addEventListener('scroll', fechar, true)
    window.addEventListener('resize', onFechar)
    return () => {
      window.removeEventListener('scroll', fechar, true)
      window.removeEventListener('resize', onFechar)
    }
  }, [aberto, ancora, alinhar, onFechar])
  useEffect(() => {
    if (!aberto) return
    const fora = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && !ancora.current?.contains(e.target as Node) && onFechar()
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onFechar()
    document.addEventListener('mousedown', fora)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', fora)
      document.removeEventListener('keydown', esc)
    }
  }, [aberto, ancora, onFechar])
  return createPortal(
    <AnimatePresence>
      {aberto && pos && (
        <motion.div ref={ref} className={`ga-pop ${className}`} style={pos} initial={{ opacity: 0, y: -4, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, transition: { duration: 0.1 } }} transition={{ duration: 0.14 }}>
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    raiz(),
  )
}

export type Opcao<T extends string> = { valor: T; texto: string; icone?: ReactNode }
export function Select<T extends string>({ valor, opcoes, onChange, icone, className = '', rotulo, alinhar }: { valor: T; opcoes: Opcao<T>[]; onChange: (v: T) => void; icone?: ReactNode; className?: string; rotulo?: string; alinhar?: 'esq' | 'dir' }) {
  const [aberto, setAberto] = useState(false)
  const ref = useRef<HTMLButtonElement>(null)
  const atual = opcoes.find((o) => o.valor === valor)
  return (
    <>
      <button ref={ref} type="button" className={`ga-select ${aberto ? 'is-aberto' : ''} ${className}`} onClick={() => setAberto((a) => !a)} aria-haspopup="listbox" aria-expanded={aberto} aria-label={rotulo}>
        {icone ?? atual?.icone}
        <span className="ga-select__txt">{atual?.texto ?? 'Selecione'}</span>
        <ChevronDown size={18} className="ga-select__seta" />
      </button>
      <Pop aberto={aberto} ancora={ref} alinhar={alinhar} onFechar={() => setAberto(false)} className="ga-pop--lista">
        {opcoes.map((o) => (
          <button
            key={o.valor}
            role="option"
            aria-selected={o.valor === valor}
            className={o.valor === valor ? 'is-on' : ''}
            onClick={() => {
              onChange(o.valor)
              setAberto(false)
            }}
          >
            {o.icone}
            <span>{o.texto}</span>
            {o.valor === valor && <Check size={17} />}
          </button>
        ))}
      </Pop>
    </>
  )
}

export type ItemMenu = { texto: string; icone?: ReactNode; fn: () => void; perigo?: boolean; disabled?: boolean } | 'sep'
export function Menu({ itens, rotulo = 'Mais ações', icone, className = '' }: { itens: ItemMenu[]; rotulo?: string; icone: ReactNode; className?: string }) {
  const [aberto, setAberto] = useState(false)
  const ref = useRef<HTMLButtonElement>(null)
  return (
    <>
      <button
        ref={ref}
        type="button"
        className={`ga-acao ${aberto ? 'is-on' : ''} ${className}`}
        onClick={(e) => {
          e.stopPropagation()
          setAberto((a) => !a)
        }}
        aria-label={rotulo}
        title={rotulo}
      >
        {icone}
      </button>
      <Pop aberto={aberto} ancora={ref} alinhar="dir" onFechar={() => setAberto(false)} className="ga-pop--menu">
        {itens.map((i, k) =>
          i === 'sep' ? (
            <hr key={k} />
          ) : (
            <button
              key={i.texto}
              disabled={i.disabled}
              className={i.perigo ? 'is-perigo' : ''}
              onClick={(e) => {
                e.stopPropagation()
                setAberto(false)
                i.fn()
              }}
            >
              {i.icone}
              <span>{i.texto}</span>
            </button>
          ),
        )}
      </Pop>
    </>
  )
}

/* ---------------- campos ---------------- */
export function Busca({ valor, onChange, placeholder, className = '' }: { valor: string; onChange: (v: string) => void; placeholder: string; className?: string }) {
  return (
    <label className={`ga-busca ${className}`}>
      <Search size={19} />
      <input value={valor} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      {valor && (
        <button type="button" onClick={() => onChange('')} aria-label="Limpar busca">
          <X size={15} />
        </button>
      )}
    </label>
  )
}
export function Filtro({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <div className="ga-filtro">
      <span>{rotulo}</span>
      {children}
    </div>
  )
}
export function Toggle({ on, onChange, rotulo }: { on: boolean; onChange: (v: boolean) => void; rotulo?: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={rotulo} className={`ga-toggle ${on ? 'is-on' : ''}`} onClick={() => onChange(!on)}>
      <motion.i layout transition={{ type: 'spring', stiffness: 600, damping: 32 }} />
    </button>
  )
}
export function Caixa({ on, parcial, onChange, rotulo }: { on: boolean; parcial?: boolean; onChange: () => void; rotulo?: string }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={parcial ? 'mixed' : on}
      aria-label={rotulo}
      className={`ga-caixa ${on || parcial ? 'is-on' : ''}`}
      onClick={(e) => {
        e.stopPropagation()
        onChange()
      }}
    >
      {on ? <Check size={14} strokeWidth={3.4} /> : parcial ? <i /> : null}
    </button>
  )
}

/* ---------------- paginação ---------------- */
export function Paginacao({ total, pagina, porPagina, onPagina, onPorPagina, rotulo, opcoes = [5, 10, 20, 50] }: { total: number; pagina: number; porPagina: number; onPagina: (p: number) => void; onPorPagina: (n: number) => void; rotulo: string; opcoes?: number[] }) {
  const paginas = Math.max(1, Math.ceil(total / porPagina))
  const ini = total ? (pagina - 1) * porPagina + 1 : 0
  const fim = Math.min(total, pagina * porPagina)
  const nums: (number | '…')[] = paginas <= 6 ? Array.from({ length: paginas }, (_, i) => i + 1) : pagina <= 3 ? [1, 2, 3, '…', paginas] : pagina >= paginas - 2 ? [1, '…', paginas - 2, paginas - 1, paginas] : [1, '…', pagina, '…', paginas]
  return (
    <footer className="ga-pag">
      <span>
        Exibindo {ini.toLocaleString('pt-BR')}–{fim.toLocaleString('pt-BR')} de {total.toLocaleString('pt-BR')} {rotulo}
      </span>
      <span className="ga-pag__esp" />
      <span className="ga-pag__por">
        Itens por página:
        <Select
          className="ga-select--p"
          valor={String(porPagina)}
          onChange={(v) => {
            onPorPagina(Number(v))
            onPagina(1)
          }}
          opcoes={opcoes.map((n) => ({ valor: String(n), texto: String(n) }))}
        />
      </span>
      <nav className="ga-pag__nums" aria-label="Paginação">
        <button disabled={pagina === 1} onClick={() => onPagina(pagina - 1)} aria-label="Página anterior">
          <ChevronLeft size={18} />
        </button>
        {nums.map((n, k) =>
          n === '…' ? (
            <span key={k} className="ga-pag__ret">
              …
            </span>
          ) : (
            <button key={k} className={n === pagina ? 'is-on' : ''} onClick={() => onPagina(n)}>
              {n.toLocaleString('pt-BR')}
            </button>
          ),
        )}
        <button disabled={pagina === paginas} onClick={() => onPagina(pagina + 1)} aria-label="Próxima página">
          <ChevronRight size={18} />
        </button>
      </nav>
    </footer>
  )
}

/* ---------------- modal ---------------- */
export function Modal({ aberto, onFechar, titulo, sub, children, rodape, largura = 520 }: { aberto: boolean; onFechar: () => void; titulo: string; sub?: string; children: ReactNode; rodape?: ReactNode; largura?: number }) {
  useEffect(() => {
    if (!aberto) return
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onFechar()
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [aberto, onFechar])
  return createPortal(
    <AnimatePresence>
      {aberto && (
        <motion.div className="ga-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && onFechar()}>
          <motion.div className="ga-modal__caixa" style={{ maxWidth: largura }} role="dialog" aria-modal aria-label={titulo} initial={{ y: 20, scale: 0.97, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 10, opacity: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 32 }}>
            <header>
              <div>
                <h3>{titulo}</h3>
                {sub && <p>{sub}</p>}
              </div>
              <button className="ga-iconbtn" onClick={onFechar} aria-label="Fechar">
                <X size={20} />
              </button>
            </header>
            <div className="ga-modal__corpo">{children}</div>
            {rodape && <footer>{rodape}</footer>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    raiz(),
  )
}

/* ---------------- toasts ---------------- */
export function Toasts() {
  const { toasts, fecharToast } = useAdm()
  return (
    <div className="ga-toasts" aria-live="polite">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div key={t.id} layout className={`ga-toast ga-toast--${t.tipo}`} initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: 30, transition: { duration: 0.16 } }}>
            <span className="ga-toast__ic">{t.tipo === 'erro' ? <CircleAlert size={17} /> : t.tipo === 'info' ? <Info size={17} /> : <Check size={17} strokeWidth={3} />}</span>
            <span className="ga-toast__txt">{t.texto}</span>
            {t.acao && (
              <button
                className="ga-toast__acao"
                onClick={() => {
                  t.acao!.fn()
                  fecharToast(t.id)
                }}
              >
                {t.acao.rotulo}
              </button>
            )}
            <button className="ga-toast__x" onClick={() => fecharToast(t.id)} aria-label="Fechar aviso">
              <X size={15} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

/** baixa um CSV gerado no navegador */
export function baixarCSV(nome: string, linhas: (string | number)[][]) {
  const csv = '﻿' + linhas.map((l) => l.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';')).join('\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  a.download = nome
  a.click()
  window.setTimeout(() => URL.revokeObjectURL(a.href), 2000)
}

/** número que anima até o valor */
export function Contador({ v }: { v: number }) {
  const mv = useMotionValue(v)
  const txt = useTransform(mv, (x) => Math.round(x).toLocaleString('pt-BR'))
  useEffect(() => {
    const c = animate(mv, v, { duration: 0.9, ease: [0.2, 0.8, 0.2, 1] })
    return () => c.stop()
  }, [v, mv])
  return <motion.span>{txt}</motion.span>
}
