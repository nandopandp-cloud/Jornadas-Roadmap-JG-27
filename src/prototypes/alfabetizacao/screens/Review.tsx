import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { sfx, speak } from '../../../shared/sound'
import ProductionArt from '../components/ProductionArt'
import Stepper from '../components/Stepper'
import { Btn, Icon, TopBar } from '../components/ui'
import { box } from '../assets'
import { useAlfa } from '../store'
import { ProdTitle } from './Create'

export default function Review() {
  const { state, back, replace, setDraft, publish, confetti } = useAlfa()
  const d = state.draft ?? { kind: 'desenho' as const, title: '', desc: '', share: true }
  const [editing, setEditing] = useState<'title' | 'desc' | null>(null)

  useEffect(() => {
    const t = window.setTimeout(() => speak('Confira tudo antes de publicar no Mural!'), 500)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <div className="scr review">
      <TopBar onBack={back} title={<ProdTitle />} />
      <Stepper step={2} />
      <motion.section className="at glass review__panel" style={box(32, 215, 1608, 686, [8, 150, 374, 686])} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 24 }}>
        <div className="review__left">
          <motion.div className="review__art" initial={{ rotate: -4, scale: 0.9 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.15 }}>
            <ProductionArt p={{ id: 'draft', kind: d.kind, image: d.image, text: d.text, title: d.title }} large />
          </motion.div>
          <Btn variant="ghost" icon={<Icon.back />} onClick={back} className="review__backbtn">
            Voltar e editar
          </Btn>
        </div>
        <div className="review__right">
          <h1>Revise sua produção</h1>
          <p className="review__sub">Confira as informações antes de publicar no Mural.</p>

          <Row icon={<Icon.pencil />} label="Título" editing={editing === 'title'} onEdit={() => setEditing(editing === 'title' ? null : 'title')}>
            {editing === 'title' ? (
              <input autoFocus className="input input--inline" value={d.title} maxLength={40} onChange={(e) => setDraft({ title: e.target.value })} onBlur={() => setEditing(null)} onKeyDown={(e) => e.key === 'Enter' && setEditing(null)} />
            ) : (
              <span className="row__value">{d.title || 'Sem título'}</span>
            )}
          </Row>
          <Row icon={<Icon.list />} label="Descrição" editing={editing === 'desc'} onEdit={() => setEditing(editing === 'desc' ? null : 'desc')}>
            {editing === 'desc' ? (
              <input autoFocus className="input input--inline" value={d.desc} maxLength={150} onChange={(e) => setDraft({ desc: e.target.value })} onBlur={() => setEditing(null)} onKeyDown={(e) => e.key === 'Enter' && setEditing(null)} />
            ) : (
              <span className="row__value">{d.desc || <em>Sem descrição</em>}</span>
            )}
          </Row>
          <button
            className="row row--toggle"
            onClick={() => {
              sfx.toggle()
              setDraft({ share: !d.share })
              speak(d.share ? 'Só você vai ver.' : 'Todos da sua turma poderão ver!')
            }}
            aria-pressed={d.share}
          >
            <span className="row__icon row__icon--users">
              <Icon.users />
            </span>
            <span className="row__text">
              <strong>Compartilhar no Mural da Turma</strong>
              <small>{d.share ? 'Todos da sua turma poderão ver.' : 'Só você vai ver, em Meus trabalhinhos.'}</small>
            </span>
            <span className={`switch ${d.share ? 'is-on' : ''}`}>
              <motion.i layout transition={{ type: 'spring', stiffness: 600, damping: 30 }} />
            </span>
          </button>

          <div className="review__actions">
            <Btn
              icon={<Icon.play />}
              glow
              className="review__publish"
              onClick={() => {
                publish()
                confetti(0.5, 0.4, true)
                replace({ id: 'published' })
              }}
            >
              {d.share ? 'Publicar no Mural' : 'Salvar produção'}
            </Btn>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

function Row({ icon, label, children, onEdit, editing }: { icon: React.ReactNode; label: string; children: React.ReactNode; onEdit: () => void; editing: boolean }) {
  return (
    <motion.div className={`row ${editing ? 'is-editing' : ''}`} layout>
      <span className="row__icon">{icon}</span>
      <span className="row__label">{label}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={String(editing)} className="row__body" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
          {children}
        </motion.span>
      </AnimatePresence>
      <button
        className="row__edit"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          sfx.tap()
          onEdit()
        }}
      >
        {editing ? <Icon.check /> : <Icon.pencil />}
        <span>{editing ? 'Pronto' : 'Editar'}</span>
      </button>
    </motion.div>
  )
}
