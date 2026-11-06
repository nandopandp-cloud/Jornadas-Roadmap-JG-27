import type { Task } from '../data'
import { Art, Img3D } from './ui'

/** Blocos de ícone das tarefas: os três da referência são recortes; os demais seguem o mesmo bloco. */
export default function TaskIcon({ icon, big }: { icon: Task['icon']; big?: boolean }) {
  if (icon === 'abc') return <Art name={big ? 'task-abc-big' : 'task-abc'} className="ticon ticon--art" />
  if (icon === 'math') return <Art name="task-math" className="ticon ticon--art" />
  if (icon === 'plant') return <Art name="task-plant" className="ticon ticon--art" />
  const map: Record<string, { img?: string; txt?: string; tone: string }> = {
    vowel: { txt: 'AEI', tone: 'lav' },
    name: { txt: 'Aa', tone: 'lav' },
    syllable: { txt: 'BA', tone: 'peach' },
    shape: { img: 'gem', tone: 'blue' },
    animal: { img: 'cat', tone: 'green' },
    color: { img: 'palette', tone: 'pink' },
  }
  const m = map[icon]
  return (
    <span className={`ticon ticon--${m.tone}`}>
      {m.img ? <Img3D name={m.img} /> : <b className={`ticon__txt ticon__txt--${icon}`}>{m.txt}</b>}
    </span>
  )
}
