// Peças do Campeonato (equivalentes aos componentes da página 04 do Figma).
import { ArrowLeft, ArrowRight, Atom, Calculator, Calendar, Check, ChevronRight, FlaskConical, GraduationCap, Home, BarChart3, FileText, Swords, Users, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Btn, Caminho } from '../batalhas-vs-geniex/pecas'
import { COPA, DISC, aluno, type DiscId } from './data'
import { duracao, restante, situacao, acertos, type Batalha } from './logica'
import type { Ctx, Tela } from './ctx'

export { Btn }
export const ICO: Record<DiscId, LucideIcon> = { matematica: Calculator, fisica: Atom, quimica: FlaskConical }

export const Av = ({ id, size = 48, className = '' }: { id: string; size?: number; className?: string }) => <img className={`cp-av ${className}`} src={`./camp/av-${id}.webp`} alt="" style={{ width: size, height: size }} />
export function DiscIco({ d, size = 32 }: { d: DiscId; size?: number }) {
  const I = ICO[d]
  return (
    <span className="cp-disc" style={{ width: size, height: size, background: DISC[d].bg, color: DISC[d].cor }} title={DISC[d].nome}>
      <I size={Math.round(size * 0.55)} strokeWidth={1.8} />
    </span>
  )
}
export const DiscChip = ({ d }: { d: DiscId }) => (
  <span className="cp-chip">
    <DiscIco d={d} size={28} />
    {DISC[d].nome}
  </span>
)
export type TipoStatus = 'ok' | 'alerta' | 'info' | 'neutro' | 'erro'
export const Status = ({ t, tipo }: { t: string; tipo: TipoStatus }) => (
  <span className={`cp-status is-${tipo}`}>
    <i />
    {t}
  </span>
)
export const Selo = ({ pos }: { pos: number }) => <span className={`cp-selo is-${pos <= 3 ? pos : 'n'}`}>{pos}º</span>
export const Aviso = ({ tipo = 'info', icone: I, children }: { tipo?: 'info' | 'alerta' | 'neutro' | 'erro'; icone: LucideIcon; children: ReactNode }) => (
  <p className={`cp-aviso is-${tipo}`}>
    <I size={18} />
    <span>{children}</span>
  </p>
)
export const Numero = ({ icone: I, cor, bg, valor, rotulo }: { icone: LucideIcon; cor: string; bg: string; valor: ReactNode; rotulo: string }) => (
  <div className="cp-num" style={{ background: bg }}>
    <I size={24} style={{ color: cor }} />
    <span>
      <b>{valor}</b>
      <small>{rotulo}</small>
    </span>
  </div>
)
export const TitCard = ({ icone: I, cor = 'var(--primaria)', children, extra }: { icone: LucideIcon; cor?: string; children: ReactNode; extra?: ReactNode }) => (
  <div className="cp-titcard">
    <I size={22} style={{ color: cor }} />
    <h2>{children}</h2>
    {extra}
  </div>
)

/** Cabeçalho com voltar + caminho (e título opcional). */
export function Cab({ c, caminho, titulo, sub, semVoltar }: { c: Ctx; caminho: [string, Tela | null][]; titulo?: string; sub?: string; semVoltar?: boolean }) {
  return (
    <header className="cp-cab">
      <div className="cp-cab__linha">
        {!semVoltar && (
          <button className="bt-icone-btn" aria-label="Voltar" onClick={c.voltar}>
            <ArrowLeft size={20} />
          </button>
        )}
        <Caminho itens={caminho.map(([t, d]) => [t, d ? () => c.ir(d) : null])} />
      </div>
      {titulo && <h1 className="bt-h1">{titulo}</h1>}
      {sub && <p className="bt-sub">{sub}</p>}
    </header>
  )
}

/** Banner da Copa (claro ou escuro, com a arte à direita no desktop e no topo no celular). */
export function Hero({ c, arte, escuro, sub }: { c: Ctx; arte: string; escuro?: boolean; sub?: string }) {
  return (
    <section className={`cp-hero ${escuro ? 'is-escuro' : ''}`}>
      <img className="cp-hero__arte" src={`./camp/${arte}.webp`} alt="" />
      <div className="cp-hero__txt">
        {c.encerrada ? <Status t="Encerrado" tipo="neutro" /> : <Status t="Em andamento" tipo="ok" />}
        <h1>{COPA.nome}</h1>
        <p className="cp-hero__sub">{sub ?? (c.encerrada ? 'A Copa terminou. Confira a classificação final!' : COPA.sub)}</p>
        <ul className="cp-meta">
          <li>
            <Calendar size={18} /> {COPA.periodo}
          </li>
          <li>
            <Users size={18} /> {COPA.participantes} participantes
          </li>
          <li>
            <GraduationCap size={18} /> {COPA.ano} · {COPA.escola}
          </li>
        </ul>
        <div className="cp-chips">
          {COPA.disc.map((d) => (
            <DiscChip key={d} d={d} />
          ))}
        </div>
      </div>
    </section>
  )
}

const ABAS: [string, Tela, LucideIcon][] = [['Visão geral', 'visao', Home], ['Batalhas', 'batalhas', Swords], ['Ranking', 'ranking', BarChart3], ['Regras', 'regras', FileText]]
export const Abas = ({ c, ativa }: { c: Ctx; ativa: Tela }) => (
  <nav className="cp-abas" aria-label="Seções do campeonato">
    {ABAS.map(([t, d, I]) => (
      <button key={d} className={ativa === d ? 'is-ativa' : ''} aria-current={ativa === d ? 'page' : undefined} onClick={() => c.ir(d)}>
        <I size={18} /> {t}
      </button>
    ))}
  </nav>
)

/** Linha de batalha (pendentes, desafios recebidos e histórico). */
export function LinhaBatalha({ c, b, detalhe }: { c: Ctx; b: Batalha; detalhe?: string }) {
  const a = aluno(b.oponente)
  const st = situacao(b)
  const eu = acertos(b)
  const sua = st === 'sua-vez'
  const STATUS: Record<string, [string, TipoStatus]> = { 'sua-vez': ['Sua vez', 'info'], aguardando: ['Aguardando oponente', 'alerta'], vitoria: ['Você venceu', 'ok'], empate: ['Empate', 'neutro'], derrota: ['Você perdeu', 'erro'], wo: ['Vitória por W.O.', 'ok'], 'sem-vencedor': ['Sem vencedor', 'neutro'] }
  const sub = detalhe ?? (sua ? `${a.turma} · desafiou você há ${Math.max(1, Math.round((Date.now() - b.criadaEm) / 3600000))} h` : st === 'aguardando' ? `${a.turma} · você acertou ${eu} de 10` : a.turma)
  const prazo: [string, string] = sua ? ['Responda em até', duracao(restante(b))] : st === 'aguardando' ? ['Prazo de ' + a.nome.split(' ')[0], duracao(restante(b))] : st === 'sem-vencedor' ? ['Você acertou', `${eu} de 10`] : ['Placar', `${eu} × ${b.placarOp ?? '–'}`]
  const abrir = () => (sua ? c.responder(b.id) : c.abrir(b.id))
  return (
    <article className={`cp-linha ${sua ? 'is-sua' : ''}`}>
      <button className="cp-linha__quem" onClick={abrir}>
        <Av id={b.oponente} size={48} />
        <span>
          <b>{a.nome}</b>
          <small>{sub}</small>
        </span>
      </button>
      <div className="cp-linha__sit">
        <Status t={STATUS[st][0]} tipo={STATUS[st][1]} />
        <span className="cp-linha__disc">
          {b.selecoes.map((s) => (
            <DiscIco key={s.disciplina} d={s.disciplina} size={28} />
          ))}
        </span>
      </div>
      <div className="cp-linha__fim">
        <span className="cp-linha__prazo">
          <small>{prazo[0]}</small>
          <b>{prazo[1]}</b>
        </span>
        {sua ? (
          <Btn sm onClick={abrir}>
            Responder <ArrowRight size={16} />
          </Btn>
        ) : (
          <button className="bt-icone-btn" aria-label={`Abrir batalha com ${a.nome}`} onClick={abrir}>
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </article>
  )
}

export function Etapas({ atual, celular }: { atual: number; celular: boolean }) {
  const nomes = ['Oponente', 'Disciplinas e tópicos', 'Resumo']
  if (celular)
    return (
      <div className="cp-etapas-cel">
        <b>
          Etapa {atual} de 3 · {nomes[atual - 1]}
        </b>
        <span>
          {[1, 2, 3].map((i) => (
            <i key={i} className={i <= atual ? 'is-on' : ''} />
          ))}
        </span>
      </div>
    )
  return (
    <ol className="cp-etapas">
      {nomes.map((n, i) => (
        <li key={n} className={i + 1 < atual ? 'is-feita' : i + 1 === atual ? 'is-atual' : ''}>
          <span>{i + 1 < atual ? <Check size={18} strokeWidth={3} /> : i + 1}</span>
          <b>{n}</b>
        </li>
      ))}
    </ol>
  )
}
export const BarraAcoes = ({ children, acoes }: { children: ReactNode; acoes: ReactNode }) => (
  <div className="cp-barra">
    <div className="cp-barra__resumo">{children}</div>
    <div className="cp-barra__acoes">{acoes}</div>
  </div>
)
