import type { Production } from '../data'
import { Art, Icon } from './ui'

/** Renderiza a "capa" de uma produção, qualquer que seja o tipo. */
export default function ProductionArt({ p, large }: { p: Pick<Production, 'id' | 'kind' | 'art' | 'image' | 'text' | 'title'>; large?: boolean }) {
  if (p.art) return <Art name={large && p.art === 'art-rocket' ? 'art-rocket-big' : p.art} className="prod-img" />
  if (p.image) return <img className="prod-img" src={p.image} alt={p.title} draggable={false} />
  if (p.kind === 'texto')
    return (
      <div className={`prod-text ${large ? 'prod-text--lg' : ''}`}>
        <p>{p.text || p.title}</p>
      </div>
    )
  if (p.kind === 'audio')
    return (
      <div className="prod-audio">
        <span className="prod-audio__mic">
          <Icon.mic />
        </span>
        <span className="prod-audio__wave">
          {[0.4, 0.8, 0.55, 1, 0.65, 0.9, 0.5, 0.75, 0.35, 0.6, 0.85, 0.45].map((h, i) => (
            <i key={i} style={{ height: `${h * 100}%` }} />
          ))}
        </span>
      </div>
    )
  return <div className="prod-empty" />
}
