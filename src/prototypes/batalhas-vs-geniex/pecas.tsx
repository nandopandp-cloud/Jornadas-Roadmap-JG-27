// Peças reutilizáveis (equivalentes aos componentes da página 04 do Figma).
import {
  Activity,
  Atom,
  BookOpen,
  Calculator,
  Check,
  CheckCircle2,
  ChevronRight,
  Dna,
  Equal,
  FlaskConical,
  Globe2,
  Landmark,
  Languages,
  Lightbulb,
  Palette,
  Users,
  XCircle,
  type LucideIcon,
} from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'
import { DISC, type DiscId } from './data'
import { nomeDisc } from './logica'

export const ICONE: Record<DiscId, LucideIcon> = { artes: Palette, biologia: Dna, fisica: Atom, geografia: Globe2, historia: Landmark, portugues: BookOpen, ingles: Languages, matematica: Calculator, quimica: FlaskConical, sociologia: Users, filosofia: Lightbulb, ciencias: FlaskConical, edfisica: Activity }

/** Quadrado colorido com o ícone da disciplina. */
export function IconeDisc({ id, size = 40, apagado }: { id: DiscId; size?: number; apagado?: boolean }) {
  const I = ICONE[id]
  const d = DISC[id]
  return (
    <span className="bt-disc" style={{ width: size, height: size, background: apagado ? '#F1F2F6' : d.bg, color: apagado ? '#A3A7B8' : d.cor, borderRadius: size >= 44 ? 12 : 10 }}>
      <I size={Math.round(size * 0.52)} strokeWidth={1.8} />
    </span>
  )
}
/** Etiqueta de disciplina (Caixa Alta na questão, Normal no gabarito). */
export const Etiqueta = ({ id, normal }: { id: DiscId; normal?: boolean }) => (
  <span className="bt-etiqueta" style={{ background: DISC[id].bg, color: DISC[id].cor, textTransform: normal ? 'none' : 'uppercase' }}>
    {nomeDisc(id)}
  </span>
)
export const Selo = ({ vs }: { vs?: boolean }) => <span className="bt-selo">{vs ? 'BATALHA VS' : 'BATALHA SOLO'}</span>
export const Avatar = ({ id, size = 48, cinza }: { id: string; size?: number; cinza?: boolean }) => <img className="bt-avatar" src={`./bat/av-${id}.webp`} alt="" style={{ width: size, height: size, opacity: cinza ? 0.7 : 1 }} />
export const Duas = ({ a, b, quebra }: { a: string; b: string; quebra?: boolean }) => (
  <>
    {a}
    {quebra && <br />}
    <span className="bt-roxo">{b}</span>
  </>
)
export const Caminho = ({ itens }: { itens: [string, (() => void) | null][] }) => (
  <nav className="bt-caminho" aria-label="Caminho">
    {itens.map(([t, fn], i) => (
      <span key={t}>
        {i > 0 && <ChevronRight size={14} />}
        {fn ? <button onClick={fn}>{t}</button> : <b>{t}</b>}
      </span>
    ))}
  </nav>
)
export const Barra = ({ pct, cor = 'var(--primaria)', altura = 8, trilho = '#e9eaf0' }: { pct: number; cor?: string; altura?: number; trilho?: string }) => (
  <span className="bt-barra" style={{ height: altura, background: trilho }}>
    <i style={{ width: `${Math.max(0, Math.min(100, pct))}%`, background: cor }} />
  </span>
)

type Var = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'
export function Btn({ v = 'default', sm, children, onClick, disabled, full, className = '', style, title }: { v?: Var; sm?: boolean; children: ReactNode; onClick?: () => void; disabled?: boolean; full?: boolean; className?: string; style?: CSSProperties; title?: string }) {
  return (
    <button type="button" className={`bt-btn is-${v} ${sm ? 'is-sm' : ''} ${full ? 'is-full' : ''} ${className}`} onClick={onClick} disabled={disabled} style={style} title={title}>
      {children}
    </button>
  )
}

export type EstadoAlt = 'padrao' | 'selecionada' | 'correta' | 'errada' | 'apagada'
/** Alternativa (componente “Alternativas” da biblioteca Objetos de Aprendizagem). */
export function Alternativa({ letra, texto, estado, atalho, onClick, disabled, rotulo }: { letra: string; texto: string; estado: EstadoAlt; atalho?: number; onClick?: () => void; disabled?: boolean; rotulo?: string }) {
  return (
    <button type="button" role="radio" aria-checked={estado === 'selecionada'} className={`bt-alt is-${estado}`} onClick={onClick} disabled={disabled}>
      <span className="bt-alt__letra">{letra}</span>
      <span className="bt-alt__txt">{texto}</span>
      {rotulo && <span className="bt-alt__rotulo">{rotulo}</span>}
      {estado === 'correta' && !rotulo && <CheckCircle2 size={22} className="bt-verde" />}
      {estado === 'errada' && !rotulo && <XCircle size={22} className="bt-vermelho" />}
      {atalho !== undefined && <kbd className="bt-alt__atalho">{atalho}</kbd>}
    </button>
  )
}

/** Quadrado de cada questão em “Seu progresso”. */
export const Quadrado = ({ n, estado }: { n: number; estado: 'correta' | 'incorreta' | 'atual' | 'proxima' | 'pendente' }) => <li className={`bt-quadrado is-${estado}`}>{n}</li>

export const Balao = ({ children, className = '' }: { children: ReactNode; className?: string }) => <div className={`bt-balao ${className}`}>{children}</div>

export const IconeResultado = ({ r, size = 18 }: { r: 'win' | 'tie' | 'loss'; size?: number }) => (r === 'win' ? <CheckCircle2 size={size} /> : r === 'tie' ? <Equal size={size} /> : <XCircle size={size} />)
export const Marcador = ({ on }: { on: boolean }) => <span className={`bt-marca ${on ? 'is-on' : ''}`}>{on && <Check size={12} strokeWidth={3} />}</span>
