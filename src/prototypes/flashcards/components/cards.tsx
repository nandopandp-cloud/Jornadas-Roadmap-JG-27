import { motion } from 'framer-motion'
import { ArrowRight, CircleCheck, Clock, EllipsisVertical, FileText, Layers, RotateCcw, Star, StarOff, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { CARD, DISC, TOPICO } from '../data'
import { contagem, nomeGrupo, pct, quando, respondidos, useFx, type Grupo } from '../store'
import { ArteGrupo, Barra, ChipDisc, Estrela, Menu, Rico } from './ui'

/* ---------------- card de grupo (Meus grupos) ---------------- */
export function GrupoCard({ g, i = 0 }: { g: Grupo; i?: number }) {
  const { ir, up, setGrupo, reiniciar, toast } = useFx()
  const d = DISC[g.disc]
  const feitos = respondidos(g)
  const total = g.cards.length
  const completo = feitos === total
  const acao = completo ? 'Estudar novamente' : feitos ? 'Continuar estudando' : 'Começar a estudar'

  const abrir = () => {
    if (completo) reiniciar(g.id)
    ir({ id: 'grupo', grupo: g.id })
  }
  const excluir = () => {
    let removido: { g: Grupo; idx: number } | null = null
    up((s) => {
      const idx = s.grupos.findIndex((x) => x.id === g.id)
      removido = { g: s.grupos[idx], idx }
      return { ...s, grupos: s.grupos.filter((x) => x.id !== g.id) }
    })
    toast(`Grupo “${nomeGrupo(g)}” excluído.`, 'info', {
      rotulo: 'Desfazer',
      fn: () =>
        up((s) => {
          if (!removido) return s
          const gs = [...s.grupos]
          gs.splice(removido.idx, 0, removido.g)
          return { ...s, grupos: gs }
        }),
    })
  }

  const resumo = g.topicos.map((t) => TOPICO[t].nome)
  const descricao = resumo.length > 1 ? `${resumo.slice(0, -1).join(', ')} e ${resumo.at(-1)}` : resumo[0]
  const p = pct(feitos, total)

  return (
    <motion.article
      layout
      role="button"
      tabIndex={0}
      aria-label={`${acao}: ${nomeGrupo(g)}`}
      className={`fx-cartao fx-grupo ${g.novo ? 'is-novo' : ''}`}
      onClick={abrir}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget && (e.preventDefault(), abrir())}
      initial={{ opacity: 0, y: 18, scale: g.novo ? 0.94 : 1 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ delay: i * 0.07, type: 'spring', stiffness: 260, damping: 26 }}
      whileHover={{ y: -4 }}
    >
      <ArteGrupo disc={g.disc}>
        {g.novo ? (
          <motion.span className="fx-grupo__novo" initial={{ scale: 0, rotate: -12 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 400, damping: 14 }}>
            Novo
          </motion.span>
        ) : (
          g.favorito && (
            <span className="fx-grupo__fav" title="Grupo favorito">
              <Star size={14} fill="currentColor" strokeWidth={0} />
            </span>
          )
        )}
        <span className="fx-grupo__relogio" title={g.estudadoEm ? `Último estudo: ${quando(g.estudadoEm)}` : 'Ainda não estudado'}>
          {completo ? <CircleCheck size={18} /> : <Clock size={18} />}
        </span>
        <span className="fx-grupo__linha" style={{ width: `${p}%` }} />
        <span className="fx-grupo__acao">
          {completo && <RotateCcw size={15} />}
          {acao} <ArrowRight size={15} />
        </span>
      </ArteGrupo>
      <div className="fx-grupo__corpo">
        <div className="fx-grupo__meta">
          <small>{d.nome}</small>
          <span className="fx-grupo__qtd">
            <Layers size={13} strokeWidth={2.4} /> {total} cards
          </span>
          <Menu
            icone={<EllipsisVertical size={17} />}
            rotulo={`Opções do grupo ${nomeGrupo(g)}`}
            className="fx-grupo__menu"
            itens={[
              {
                texto: g.favorito ? 'Remover dos favoritos' : 'Favoritar grupo',
                icone: g.favorito ? <StarOff size={16} /> : <Star size={16} />,
                fn: () => {
                  setGrupo(g.id, (x) => ({ ...x, favorito: !x.favorito }))
                  toast(g.favorito ? 'Grupo removido dos favoritos.' : 'Grupo adicionado aos favoritos.')
                },
              },
              ...(feitos ? [{ texto: 'Reiniciar progresso', icone: <RotateCcw size={16} />, fn: () => (reiniciar(g.id), toast('Progresso do grupo reiniciado.', 'info')) }] : []),
              { texto: 'Excluir grupo', icone: <Trash2 size={16} />, perigo: true, fn: excluir },
            ]}
          />
        </div>
        <strong className="fx-grupo__nome">{nomeGrupo(g)}</strong>
        <p className="fx-grupo__desc" title={descricao}>
          {descricao}
        </p>
        <div className="fx-grupo__prog">
          <Barra valor={p} fina />
          <span>{p}%</span>
        </div>
      </div>
    </motion.article>
  )
}

/* ---------------- card favorito (vira para mostrar a resposta) ---------------- */
export function FavCard({ cardId, i = 0, compacto }: { cardId: string; i?: number; compacto?: boolean }) {
  const { s, favoritar, ir, toast } = useFx()
  const [virado, setVirado] = useState(false)
  const c = CARD[cardId]
  const grupo = s.grupos.find((g) => g.cards.includes(cardId))

  const remover = () => {
    favoritar(cardId)
    toast('Card removido dos favoritos.', 'info', { rotulo: 'Desfazer', fn: () => favoritar(cardId) })
  }
  const menu = (
    <Menu
      icone={<EllipsisVertical size={17} />}
      rotulo="Opções do card"
      itens={[
        ...(grupo ? [{ texto: 'Estudar no grupo', icone: <Layers size={17} />, fn: () => ir({ id: 'grupo', grupo: grupo.id, card: cardId }) }] : []),
        { texto: 'Remover dos favoritos', icone: <StarOff size={17} />, fn: remover },
      ]}
    />
  )

  return (
    <motion.article
      layout
      className={`fx-fav ${compacto ? 'fx-fav--compacto' : ''} ${virado ? 'is-virado' : ''}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.18 } }}
      transition={{ delay: Math.min(i, 10) * 0.045, type: 'spring', stiffness: 300, damping: 28 }}
    >
      <motion.div className="fx-fav__giro" animate={{ rotateY: virado ? 180 : 0 }} transition={{ type: 'spring', stiffness: 220, damping: 24 }}>
        <div className="fx-cartao fx-fav__face">
          <div className="fx-fav__cab">
            {compacto ? <small className="fx-fav__disc">{DISC[c.disc].nome}</small> : <ChipDisc disc={c.disc} />}
            <Estrela on tam={22} onClick={remover} />
          </div>
          <p className="fx-fav__perg">{c.pergunta}</p>
          <div className="fx-fav__rod">
            <button className="fx-fav__ver" onClick={() => setVirado(true)}>
              <FileText size={17} /> Ver resposta
            </button>
            {menu}
          </div>
        </div>
        <div className="fx-cartao fx-fav__face fx-fav__face--verso" aria-hidden={!virado}>
          <div className="fx-fav__cab">
            <span className="fx-rotulo fx-rotulo--resposta">Resposta</span>
            <small className="fx-fav__disc">{TOPICO[c.topico].nome}</small>
          </div>
          <p className="fx-fav__resp">
            <Rico texto={c.resposta} />
          </p>
          <div className="fx-fav__rod">
            <button className="fx-fav__ver" onClick={() => setVirado(false)} tabIndex={virado ? 0 : -1}>
              <RotateCcw size={16} /> Ver pergunta
            </button>
          </div>
        </div>
      </motion.div>
    </motion.article>
  )
}

/** mini barra empilhada (acertos / revisar / erros) */
export function Empilhada({ g }: { g: Pick<ReturnType<typeof contagem>, 'sei' | 'nao' | 'revisar'> }) {
  const t = g.sei + g.nao + g.revisar || 1
  return (
    <span className="fx-empilhada" aria-hidden>
      <i className="is-sei" style={{ width: `${(g.sei / t) * 100}%` }} />
      <i className="is-revisar" style={{ width: `${(g.revisar / t) * 100}%` }} />
      <i className="is-nao" style={{ width: `${(g.nao / t) * 100}%` }} />
    </span>
  )
}
