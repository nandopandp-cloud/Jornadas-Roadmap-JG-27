// Peças compartilhadas do relatório da lição: badges, tabela ordenável, paginação, select, modal e drawer.
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsUpDown, ChevronUp, Info, Search, X, type LucideIcon } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { PROF_COR, PROF_TXT, type Prof } from './data'

export function Badge({ children, tom = 'neutro', icone: Ic }: { children: ReactNode; tom?: 'neutro' | 'roxo' | 'verde' | 'amarelo' | 'red'; icone?: LucideIcon }) {
  return (
    <span className={`rl-badge is-${tom}`}>
      {Ic && <Ic size={13} />}
      {children}
    </span>
  )
}

export function ProfPill({ p }: { p: Prof }) {
  return (
    <span className="rl-prof" style={{ color: PROF_TXT[p], borderColor: PROF_COR[p] }}>
      <i style={{ background: PROF_COR[p] }} />
      {p}
    </span>
  )
}

export function Ponto({ cor, tam = 10 }: { cor: string; tam?: number }) {
  return <span className="rl-ponto" style={{ background: cor, width: tam, height: tam }} aria-hidden />
}

export function Cartao({ titulo, desc, info, acoes, children, className = '', novo }: { titulo: string; desc?: ReactNode; info?: string; acoes?: ReactNode; children: ReactNode; className?: string; novo?: boolean }) {
  return (
    <section className={`rx-cartao rl-cartao ${className}`}>
      <header className="rl-cartao__cab">
        <div>
          <h2>
            {titulo}
            {info && (
              <span className="rl-info" tabIndex={0} aria-label={info} data-dica={info}>
                <Info size={15} />
              </span>
            )}
            {novo && <Badge tom="roxo">Novo no Modo Lição</Badge>}
          </h2>
          {desc && <p>{desc}</p>}
        </div>
        {acoes}
      </header>
      {children}
    </section>
  )
}

export function Aviso({ children, tom = 'roxo', icone: Ic }: { children: ReactNode; tom?: 'roxo' | 'amarelo' | 'neutro'; icone: LucideIcon }) {
  return (
    <div className={`rl-aviso is-${tom}`}>
      <Ic size={16} />
      <div>{children}</div>
    </div>
  )
}

export function Busca({ valor, onChange, ph }: { valor: string; onChange: (s: string) => void; ph: string }) {
  return (
    <label className="rx-busca rl-busca">
      <Search size={16} />
      <input value={valor} onChange={(e) => onChange(e.target.value)} placeholder={ph} aria-label={ph} />
      {valor && (
        <button className="rx-icone-btn" aria-label="Limpar busca" onClick={() => onChange('')}>
          <X size={14} />
        </button>
      )}
    </label>
  )
}

export function Select<T extends string>({ valor, opcoes, onChange, rotulo, largura }: { valor: T; opcoes: { v: T; t: string }[]; onChange: (v: T) => void; rotulo: string; largura?: number }) {
  const [aberto, setAberto] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!aberto) return
    const on = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setAberto(false)
    document.addEventListener('mousedown', on)
    return () => document.removeEventListener('mousedown', on)
  }, [aberto])
  const atual = opcoes.find((o) => o.v === valor)
  return (
    <div className="rx-select-wrap rl-select" ref={ref} style={largura ? { width: largura } : undefined}>
      <button className="rx-select" aria-haspopup="listbox" aria-expanded={aberto} aria-label={rotulo} onClick={() => setAberto((a) => !a)}>
        <span>{atual?.t}</span>
        <ChevronDown size={16} />
      </button>
      {aberto && (
        <div className="rx-pop rl-pop" role="listbox" aria-label={rotulo}>
          {opcoes.map((o) => (
            <button
              key={o.v}
              role="option"
              aria-selected={o.v === valor}
              className={o.v === valor ? 'is-on' : ''}
              onClick={() => {
                onChange(o.v)
                setAberto(false)
              }}
            >
              {o.t}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- tabela ordenável */
export type Coluna<T> = { id: string; t: string; w?: string; al?: 'c' | 'r'; ord?: (x: T) => number | string; cel: (x: T) => ReactNode }

export function useOrdem<T>(lista: T[], cols: Coluna<T>[], inicial: { id: string; dir: 1 | -1 }) {
  const [ord, setOrd] = useState(inicial)
  const ordenada = useMemo(() => {
    const c = cols.find((x) => x.id === ord.id)
    if (!c?.ord) return lista
    return [...lista].sort((a, b) => {
      const va = c.ord!(a)
      const vb = c.ord!(b)
      const r = typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb))
      return r * ord.dir
    })
  }, [lista, cols, ord])
  const alterna = (id: string) => setOrd((o) => (o.id === id ? { id, dir: (o.dir * -1) as 1 | -1 } : { id, dir: id === 'nome' ? 1 : -1 }))
  return { ordenada, ord, alterna }
}

export function Tabela<T>({ cols, linhas, ord, onOrdenar, chave, vazio, destaque, onLinha, rotulo }: { cols: Coluna<T>[]; linhas: T[]; ord?: { id: string; dir: 1 | -1 }; onOrdenar?: (id: string) => void; chave: (x: T) => string; vazio?: ReactNode; destaque?: (x: T) => boolean; onLinha?: (x: T) => void; rotulo: string }) {
  return (
    <div className="rl-tabela-rola">
      <table className="rl-tabela" aria-label={rotulo}>
        <thead>
          <tr>
            {cols.map((c) => {
              const on = ord?.id === c.id
              return (
                <th key={c.id} style={{ width: c.w }} className={c.al ? `is-${c.al}` : ''} aria-sort={on ? (ord!.dir === 1 ? 'ascending' : 'descending') : c.ord ? 'none' : undefined}>
                  {c.ord && onOrdenar ? (
                    <button onClick={() => onOrdenar(c.id)}>
                      {c.t} {on ? ord!.dir === 1 ? <ChevronUp size={14} /> : <ChevronDown size={14} /> : <ChevronsUpDown size={14} />}
                    </button>
                  ) : (
                    c.t
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {linhas.map((l) => (
            <tr key={chave(l)} className={`${destaque?.(l) ? 'is-destaque' : ''} ${onLinha ? 'is-clicavel' : ''}`} onClick={onLinha ? () => onLinha(l) : undefined}>
              {cols.map((c) => (
                <td key={c.id} className={c.al ? `is-${c.al}` : ''}>
                  {c.cel(l)}
                </td>
              ))}
            </tr>
          ))}
          {linhas.length === 0 && (
            <tr>
              <td colSpan={cols.length} className="rl-tabela__vazio">
                {vazio ?? 'Nada encontrado.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export function usePagina<T>(lista: T[], por: number, dep: unknown[]) {
  const [pag, setPag] = useState(1)
  useEffect(() => setPag(1), dep) // eslint-disable-line react-hooks/exhaustive-deps
  const total = Math.max(1, Math.ceil(lista.length / por))
  const atual = Math.min(pag, total)
  return { itens: lista.slice((atual - 1) * por, atual * por), pag: atual, total, setPag, de: lista.length ? (atual - 1) * por + 1 : 0, ate: Math.min(atual * por, lista.length), n: lista.length }
}

export function Paginacao({ p, rotulo = 'itens' }: { p: ReturnType<typeof usePagina>; rotulo?: string }) {
  const nums: (number | '…')[] = []
  for (let i = 1; i <= p.total; i++) if (i === 1 || i === p.total || Math.abs(i - p.pag) <= 1) nums.push(i)
    else if (nums[nums.length - 1] !== '…') nums.push('…')
  return (
    <div className="rl-pag">
      <small>
        {p.de} - {p.ate} de {p.n} {rotulo}
      </small>
      <nav aria-label="Paginação">
        <button disabled={p.pag === 1} onClick={() => p.setPag(p.pag - 1)} aria-label="Página anterior">
          <ChevronLeft size={16} />
        </button>
        {nums.map((n, i) =>
          n === '…' ? (
            <span key={'r' + i}>…</span>
          ) : (
            <button key={n} className={n === p.pag ? 'is-on' : ''} aria-current={n === p.pag ? 'page' : undefined} onClick={() => p.setPag(n)}>
              {n}
            </button>
          ),
        )}
        <button disabled={p.pag === p.total} onClick={() => p.setPag(p.pag + 1)} aria-label="Próxima página">
          <ChevronRight size={16} />
        </button>
      </nav>
      <span />
    </div>
  )
}

/* ---------------------------------------------------------------- camadas */
export function Modal({ aberto, onFechar, titulo, sub, largura = 640, rodape, children }: { aberto: boolean; onFechar: () => void; titulo: string; sub?: string; largura?: number; rodape?: ReactNode; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (aberto) setTimeout(() => ref.current?.focus(), 30)
  }, [aberto])
  return (
    <AnimatePresence>
      {aberto && (
        <motion.div className="rl-camada" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && onFechar()}>
          <motion.div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={titulo} className="rl-modal" style={{ maxWidth: largura }} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} transition={{ duration: 0.2 }}>
            <header className="rl-modal__cab">
              <div>
                <h2>{titulo}</h2>
                {sub && <p>{sub}</p>}
              </div>
              <button className="rx-icone-btn" onClick={onFechar} aria-label="Fechar">
                <X size={18} />
              </button>
            </header>
            <div className="rl-modal__corpo">{children}</div>
            {rodape && <footer className="rl-modal__rod">{rodape}</footer>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Drawer({ aberto, onFechar, titulo, sub, rodape, children, largura = 640 }: { aberto: boolean; onFechar: () => void; titulo: string; sub?: string; rodape?: ReactNode; children: ReactNode; largura?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (aberto) setTimeout(() => ref.current?.focus(), 30)
  }, [aberto])
  return (
    <AnimatePresence>
      {aberto && (
        <motion.div className="rl-camada is-drawer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && onFechar()}>
          <motion.aside ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={titulo} className="rl-drawer" style={{ width: `min(${largura}px, 100vw)` }} initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.24 }}>
            <header className="rl-drawer__cab">
              <div>
                <h2>{titulo}</h2>
                {sub && <p>{sub}</p>}
              </div>
              <button className="rx-icone-btn" onClick={onFechar} aria-label="Fechar">
                <X size={18} />
              </button>
            </header>
            <div className="rl-drawer__corpo">{children}</div>
            {rodape && <footer className="rl-drawer__rod">{rodape}</footer>}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
