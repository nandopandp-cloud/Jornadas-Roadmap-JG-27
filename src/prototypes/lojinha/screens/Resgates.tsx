import { AnimatePresence, motion } from 'framer-motion'
import { Box, Check, ChevronLeft, ChevronRight, CircleCheck, Clock, Gem, PackageCheck, Store, Truck, UserRound, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Btn, ItemArte, Pontos } from '../components/ui'
import { CAT, ITEM, dataCurta, fmt, type Resgate, type StatusResgate } from '../data'
import { useLoja } from '../store'
import { Banner } from './Historico'

const STATUS: Record<StatusResgate, { t: string; I: typeof Clock }> = {
  processamento: { t: 'Em processamento', I: Clock },
  concluido: { t: 'Concluído', I: CircleCheck },
  enviado: { t: 'Enviado', I: Truck },
  entregue: { t: 'Entregue', I: PackageCheck },
  cancelado: { t: 'Cancelado', I: X },
}

/** Meus Resgates */
export default function Resgates({ abrir }: { abrir?: string }) {
  const { s } = useLoja()
  const [aberto, setAberto] = useState<string | null>(abrir ?? null)
  const atual = s.resgates.find((r) => r.id === aberto)
  return (
    <div className="lj-resg">
      <Banner img="./loja/banner-resgates.webp" titulo="Meus Resgates" texto={['Acompanhe o status de todas as suas', 'recompensas aqui.']} textoEsq={288} />
      <section className="lj-tabela">
        <div className="lj-tabela__cab">
          <span>Item</span>
          <span>Tipo</span>
          <span>Pontos utilizados</span>
          <span>Data da solicitação</span>
          <span>Status</span>
          <span>Ações</span>
        </div>
        <div className="lj-tabela__corpo">
          <AnimatePresence initial={false}>
            {s.resgates.map((r, i) => (
              <Linha key={r.id} r={r} i={i} onAbrir={() => setAberto(r.id)} />
            ))}
          </AnimatePresence>
          {!s.resgates.length && <p className="lj-vazio">Você ainda não resgatou nenhum item.</p>}
        </div>
      </section>
      <nav className="lj-paginas" aria-label="Paginação">
        <button disabled aria-label="Anterior">
          <ChevronLeft size={18} />
        </button>
        <button className="is-on">1</button>
        <button disabled aria-label="Próxima">
          <ChevronRight size={18} />
        </button>
      </nav>
      <Detalhe r={atual} onFechar={() => setAberto(null)} />
    </div>
  )
}

function Miniatura({ r }: { r: Resgate }) {
  const it = ITEM[r.item]
  return <span className="lj-tabela__thumb">{r.img ? <img src={r.img} alt="" /> : <ItemArte item={it} />}</span>
}
export function ChipStatus({ st }: { st: StatusResgate }) {
  const { t, I } = STATUS[st]
  return (
    <motion.span key={st} className={`lj-status lj-status--${st}`} initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 18 }}>
      {st === 'concluido' ? (
        <span className="lj-status__ok">
          <Check size={13} strokeWidth={3.4} />
        </span>
      ) : (
        <I size={19} strokeWidth={2} />
      )}
      {t}
    </motion.span>
  )
}
function ChipTipo({ tipo }: { tipo: 'digital' | 'fisico' }) {
  return (
    <span className={`lj-tipo lj-tipo--${tipo}`}>
      {tipo === 'digital' ? <Gem size={16} /> : <Box size={16} />}
      {tipo === 'digital' ? 'Digital' : 'Físico'}
    </span>
  )
}

function Linha({ r, i, onAbrir }: { r: Resgate; i: number; onAbrir: () => void }) {
  const it = ITEM[r.item]
  return (
    <motion.div layout className="lj-tabela__linha" initial={{ opacity: 0, y: -10, backgroundColor: '#e3f7f4' }} animate={{ opacity: 1, y: 0, backgroundColor: 'rgba(255,255,255,0)' }} transition={{ delay: i * 0.05, backgroundColor: { duration: 1.6 } }}>
      <span className="lj-tabela__item">
        <Miniatura r={r} />
        <span>
          <strong>{it.nome}</strong>
          <small>{CAT[it.cat].singular}</small>
        </span>
      </span>
      <span>
        <ChipTipo tipo={it.tipo} />
      </span>
      <span>
        <Pontos v={r.pontos} className="lj-pts--sem" />
      </span>
      <span className="lj-tabela__data">{dataCurta(r.data)}</span>
      <span>
        <ChipStatus st={r.status} />
      </span>
      <span>
        <Btn variante="contorno" className="lj-vdet" iconeDir={<ChevronRight size={18} />} onClick={onAbrir}>
          Ver detalhes
        </Btn>
      </span>
    </motion.div>
  )
}

/* ---------------- painel lateral de detalhes ---------------- */
function Detalhe({ r, onFechar }: { r?: Resgate; onFechar: () => void }) {
  const { s, ir, equipar, toast } = useLoja()
  useEffect(() => {
    if (!r) return
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onFechar()
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [r, onFechar])
  const it = r ? ITEM[r.item] : null
  const passos =
    it?.tipo === 'fisico'
      ? [
          ['Resgate solicitado', 'Seus pontos foram reservados.'],
          ['Em separação', 'A equipe está preparando o seu item.'],
          ['Enviado para a escola', 'Seu item está a caminho da escola.'],
          ['Entregue', 'Retire na escola apresentando o seu cartão.'],
        ]
      : [
          ['Resgate solicitado', 'Seus pontos foram descontados.'],
          ['Em processamento', 'Estamos liberando o item no seu perfil.'],
          ['Concluído', 'O item já está disponível no seu perfil.'],
        ]
  const feito = !r ? 0 : it?.tipo === 'fisico' ? { processamento: 1, enviado: 2, entregue: 3, concluido: 3, cancelado: 0 }[r.status] : { processamento: 1, concluido: 2, enviado: 2, entregue: 2, cancelado: 0 }[r.status]

  return createPortal(
    <AnimatePresence>
      {r && it && (
        <motion.div className="lj-gaveta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && onFechar()}>
          <motion.aside className="lj-gaveta__painel" role="dialog" aria-label={`Resgate de ${it.nome}`} initial={{ x: 480 }} animate={{ x: 0 }} exit={{ x: 480 }} transition={{ type: 'spring', stiffness: 320, damping: 34 }}>
            <header>
              <h3>Detalhes do resgate</h3>
              <button className="lj-iconbtn" onClick={onFechar} aria-label="Fechar">
                <X size={17} />
              </button>
            </header>
            <div className="lj-gaveta__item">
              <ItemArte item={it} estrelas />
              <div>
                <strong>{it.nome}</strong>
                <small>
                  {CAT[it.cat].singular} · <ChipTipo tipo={it.tipo} />
                </small>
                <ChipStatus st={r.status} />
              </div>
            </div>
            <dl className="lj-gaveta__dados">
              <div>
                <dt>Pontos utilizados</dt>
                <dd>{fmt(r.pontos)} pts</dd>
              </div>
              <div>
                <dt>Solicitado em</dt>
                <dd>{dataCurta(r.data)}</dd>
              </div>
              <div>
                <dt>Código do resgate</dt>
                <dd>#{r.id.replace(/\D/g, '').slice(-6).padStart(6, '4')}</dd>
              </div>
            </dl>
            <h4>Acompanhamento</h4>
            <ol className="lj-linha-tempo">
              {passos.map(([t, d], k) => (
                <motion.li key={t} className={k <= feito ? 'is-feito' : ''} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + k * 0.08 }}>
                  <span className="lj-linha-tempo__bola">{k <= feito ? <Check size={14} strokeWidth={3.4} /> : k + 1}</span>
                  <span>
                    <strong>{t}</strong>
                    <small>{d}</small>
                  </span>
                </motion.li>
              ))}
            </ol>
            <footer>
              {it.cat === 'avatares' && r.status === 'concluido' && (
                <Btn
                  bloco
                  icone={<UserRound size={19} />}
                  disabled={s.avatar === it.id}
                  onClick={() => {
                    equipar(it.id)
                    toast(`${it.nome} agora é o seu avatar!`)
                  }}
                >
                  {s.avatar === it.id ? 'Você está usando este avatar' : 'Usar como avatar'}
                </Btn>
              )}
              <Btn
                bloco
                variante="contorno"
                icone={<Store size={19} />}
                onClick={() => {
                  onFechar()
                  ir({ id: 'item', item: it.id, de: it.cat })
                }}
              >
                Ver item na loja
              </Btn>
            </footer>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>,
    document.querySelector('.lj') ?? document.body,
  )
}
