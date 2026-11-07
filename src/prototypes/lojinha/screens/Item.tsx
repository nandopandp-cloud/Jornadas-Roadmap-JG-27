import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ChevronLeft, ChevronRight, Clock, Gem, Gift, Heart, Info, Lock, Package, Shirt, Sparkles, Star, UserRound } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Btn, Confete, Contador, Estrelas, Modal, Pontos, Selo } from '../components/ui'
import { CAT, ITEM, RARIDADES, caracteristicas, fmt, type Item } from '../data'
import { useLoja } from '../store'

/** Detalhe de um item da Lojinha */
export default function ItemDetalhe({ id, de }: { id: string; de?: string }) {
  const { s, ir, favoritar, toast, possui, equipar, resgatar } = useLoja()
  const it = ITEM[id]
  const [etapa, setEtapa] = useState<null | 'confirmar' | 'processando' | 'sucesso'>(null)
  const [voo, setVoo] = useState(0)
  const btnRef = useRef<HTMLButtonElement>(null)
  const meu = possui(id)
  const fav = s.favoritos.includes(id)
  const falta = Math.max(0, it.pontos - s.pontos)
  const c = CAT[it.cat]

  // vindo do botão “Resgatar” dos destaques: abre a confirmação
  useEffect(() => {
    if (s.view.id === 'item' && s.view.resgatar && !meu && !falta) {
      const t = window.setTimeout(() => setEtapa('confirmar'), 450)
      return () => window.clearTimeout(t)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const voltar = () => (de && de !== it.cat && de !== 'todos' ? ir({ id: 'loja' }, -1) : ir(de === 'todos' ? { id: 'categoria', cat: 'todos' } : { id: 'categoria', cat: it.cat }, -1))

  const confirmar = () => {
    setEtapa('processando')
    window.setTimeout(() => {
      setVoo((v) => v + 1)
      resgatar(id)
      setEtapa('sucesso')
    }, 1300)
  }

  return (
    <div className="lj-item-pag">
      <button className="lj-voltar" onClick={voltar}>
        <ArrowLeft size={17} /> {de === 'avatares' || de === it.cat ? `Voltar para ${c.nome}` : 'Voltar à loja'}
      </button>

      <motion.section className="lj-item" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
        <Galeria it={it} />

        <div className="lj-item__info">
          <div className="lj-item__cab">
            <div>
              <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                {it.nome}
              </motion.h2>
              <span className="lj-item__cat">{c.singular}</span>
            </div>
            <motion.button
              className={`lj-coracao ${fav ? 'is-on' : ''}`}
              whileTap={{ scale: 0.85 }}
              aria-pressed={fav}
              aria-label={fav ? 'Remover dos favoritos' : 'Favoritar'}
              onClick={() => {
                const on = favoritar(id)
                toast(on ? 'Item salvo na sua lista de desejos.' : 'Item removido da lista de desejos.', on ? 'ok' : 'info')
              }}
            >
              <motion.span key={String(fav)} initial={fav ? { scale: 0.3 } : false} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 12 }} style={{ display: 'grid' }}>
                <Heart size={22} fill={fav ? 'currentColor' : 'none'} strokeWidth={fav ? 0 : 1.9} />
              </motion.span>
            </motion.button>
          </div>
          <p className="lj-item__desc">{it.descricao}</p>

          <div className="lj-item__caixas">
            <div className="lj-caixa lj-caixa--pts">
              <Pontos v={it.pontos} tam="g" />
            </div>
            <div className="lj-caixa lj-caixa--rar">
              <Gem size={34} strokeWidth={1.8} className={`lj-ic-rar lj-ic-rar--${it.raridade}`} />
              <span>
                <small>Raridade</small>
                <strong className={`lj-txt-rar--${it.raridade}`}>{RARIDADES[it.raridade].nome}</strong>
              </span>
            </div>
          </div>

          <h3 className="lj-item__sub">Características</h3>
          <div className="lj-carac">
            {caracteristicas(it).map(([t, d], i) => {
              const I = [it.tipo === 'fisico' ? Package : Shirt, Star, it.tipo === 'fisico' ? Clock : Sparkles][i]
              return (
                <motion.div key={t} className="lj-carac__c" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.06 }}>
                  <I size={27} strokeWidth={1.6} className={`lj-carac__ic lj-carac__ic--${i}`} />
                  <span>
                    <strong>{t}</strong>
                    <small>{d}</small>
                  </span>
                </motion.div>
              )
            })}
          </div>

          <div className="lj-onde">
            <Info size={26} strokeWidth={1.8} />
            <span>
              <strong>Onde aparece?</strong>
              {c.ondeAparece}
            </span>
          </div>

          <div className="lj-item__rod">
            <div className="lj-saldo-mini">
              <small>Seu saldo atual</small>
              <Pontos v={s.pontos} tam="m" />
            </div>
            {meu ? (
              meu.status === 'processamento' ? (
                <Btn tam="g" variante="contorno" className="lj-item__cta" icone={<Clock size={20} />} onClick={() => ir({ id: 'resgates', abrir: meu.id })}>
                  Em processamento · ver resgate
                </Btn>
              ) : it.cat === 'avatares' ? (
                <Btn
                  tam="g"
                  className="lj-item__cta"
                  icone={<UserRound size={20} />}
                  disabled={s.avatar === id}
                  onClick={() => {
                    equipar(id)
                    toast(`${it.nome} agora é o seu avatar!`)
                  }}
                >
                  {s.avatar === id ? 'Você está usando este traje' : 'Usar como avatar'}
                </Btn>
              ) : (
                <Btn tam="g" variante="contorno" className="lj-item__cta" icone={<Gift size={20} />} onClick={() => ir({ id: 'resgates', abrir: meu.id })}>
                  Resgatado · ver detalhes
                </Btn>
              )
            ) : falta ? (
              <div className="lj-falta">
                <Btn tam="g" className="lj-item__cta" icone={<Lock size={19} />} disabled>
                  Faltam {fmt(falta)} pts
                </Btn>
                <span className="lj-falta__barra">
                  <motion.i initial={{ width: 0 }} animate={{ width: `${(s.pontos / it.pontos) * 100}%` }} transition={{ duration: 1, ease: 'easeOut' }} />
                </span>
              </div>
            ) : (
              <motion.span className="lj-item__cta-wrap" whileHover={{ scale: 1.015 }}>
                <Btn tam="g" className="lj-item__cta lj-item__cta--brilho" icone={<Gift size={22} />} onClick={() => setEtapa('confirmar')}>
                  <span ref={btnRef as never}>Resgatar agora</span>
                </Btn>
              </motion.span>
            )}
          </div>
        </div>
      </motion.section>

      <ResgateModal it={it} etapa={etapa} onFechar={() => setEtapa(null)} onConfirmar={confirmar} />
      {voo > 0 && <VooGemas key={voo} de={btnRef.current} />}
    </div>
  )
}

/* ---------------- galeria ---------------- */
type Quadro = { src: string; foto: boolean; estilo?: React.CSSProperties; fundo?: string }
function quadros(it: Item): Quadro[] {
  if (it.galeria) return it.galeria.map((src) => ({ src, foto: true }))
  if (it.foto)
    return [
      { src: it.img, foto: true, estilo: { filter: it.filtro } },
      { src: it.img, foto: true, estilo: { filter: it.filtro, transform: 'scale(1.6)', transformOrigin: '30% 60%' } },
      { src: it.img, foto: true, estilo: { filter: `${it.filtro ?? ''} brightness(.7) saturate(1.3)` } },
      { src: it.img, foto: true, estilo: { filter: it.filtro, transform: 'scale(1.5)', transformOrigin: '75% 30%' } },
    ]
  return [
    { src: it.img, foto: false, estilo: { filter: it.filtro } },
    { src: it.img, foto: false, estilo: { filter: it.filtro, transform: 'scaleX(-1)' }, fundo: 'claro' },
    { src: it.img, foto: false, estilo: { filter: it.filtro, transform: 'scale(1.7) translateY(14%)' } },
    { src: it.img, foto: false, estilo: { filter: it.filtro, transform: 'rotate(-8deg) scale(.9)' }, fundo: 'claro' },
  ]
}
function Galeria({ it }: { it: Item }) {
  const qs = quadros(it)
  const [[i, dir], setI] = useState<[number, number]>([0, 1])
  const ir = (n: number) => setI(([a]) => [(a + n + qs.length) % qs.length, n])
  const q = qs[i]
  return (
    <div className="lj-galeria">
      <div className={`lj-galeria__palco ${q.foto ? 'is-foto' : ''} ${q.fundo === 'claro' ? 'is-claro' : ''}`} style={{ '--fundo': it.fundo } as React.CSSProperties}>
        {!q.foto && <Estrelas n={6} className="lj-estrelas--ouro" />}
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={i}
            className="lj-galeria__quadro"
            custom={dir}
            initial={{ opacity: 0, x: dir * 80, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: dir * -80, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={(_, info) => (info.offset.x < -60 ? ir(1) : info.offset.x > 60 ? ir(-1) : null)}
          >
            {q.foto ? (
              <img src={q.src} alt={it.nome} draggable={false} style={q.estilo} />
            ) : (
              <motion.img src={q.src} alt={it.nome} draggable={false} className="lj-galeria__obj" style={q.estilo} animate={{ y: [0, -8, 0] }} transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }} />
            )}
          </motion.div>
        </AnimatePresence>
        <span className="lj-galeria__selo">
          <Selo r={it.raridade} tam="m" />
        </span>
        <button className="lj-galeria__seta lj-galeria__seta--esq" onClick={() => ir(-1)} aria-label="Imagem anterior">
          <ChevronLeft size={19} />
        </button>
        <button className="lj-galeria__seta lj-galeria__seta--dir" onClick={() => ir(1)} aria-label="Próxima imagem">
          <ChevronRight size={19} />
        </button>
      </div>
      <div className="lj-galeria__miniaturas">
        {qs.map((m, k) => (
          <button key={k} className={`lj-mini ${k === i ? 'is-on' : ''} ${m.foto ? 'is-foto' : ''}`} onClick={() => setI([k, k > i ? 1 : -1])} style={{ '--fundo': it.fundo } as React.CSSProperties} aria-label={`Imagem ${k + 1}`}>
            <img src={m.src} alt="" style={m.estilo} />
          </button>
        ))}
      </div>
    </div>
  )
}

/* ---------------- modal de resgate ---------------- */
function ResgateModal({ it, etapa, onFechar, onConfirmar }: { it: Item; etapa: null | 'confirmar' | 'processando' | 'sucesso'; onFechar: () => void; onConfirmar: () => void }) {
  const { s, ir, equipar, toast } = useLoja()
  const antes = etapa === 'sucesso' ? s.pontos + it.pontos : s.pontos
  return (
    <Modal aberto={!!etapa} onFechar={onFechar} largura={500} className="lj-resgate" semFechar={etapa === 'processando'}>
      <AnimatePresence mode="wait" initial={false}>
        {etapa === 'confirmar' && (
          <motion.div key="c" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="lj-resgate__arte" style={{ '--fundo': it.fundo } as React.CSSProperties}>
              <Estrelas n={5} className="lj-estrelas--ouro" />
              <motion.img src={it.galeria?.[0] ?? it.img} alt="" className={it.galeria || it.foto ? 'is-foto' : ''} style={{ filter: it.filtro }} initial={{ scale: 0.7 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 14 }} />
            </div>
            <h3>Confirmar resgate?</h3>
            <p className="lj-resgate__nome">
              {it.nome} · <Selo r={it.raridade} />
            </p>
            <dl className="lj-resgate__conta">
              <div>
                <dt>Seu saldo atual</dt>
                <dd>{fmt(s.pontos)} pts</dd>
              </div>
              <div className="is-menos">
                <dt>Valor do item</dt>
                <dd>− {fmt(it.pontos)} pts</dd>
              </div>
              <div className="is-total">
                <dt>Saldo após o resgate</dt>
                <dd>
                  <img src="./loja/gema.webp" alt="" /> {fmt(s.pontos - it.pontos)} pts
                </dd>
              </div>
            </dl>
            {it.tipo === 'fisico' && (
              <p className="lj-resgate__aviso">
                <Package size={18} /> Item físico: a entrega é feita na sua escola em até 15 dias úteis.
              </p>
            )}
            <div className="lj-resgate__btns">
              <Btn variante="contorno" onClick={onFechar}>
                Cancelar
              </Btn>
              <Btn icone={<Gift size={17} />} onClick={onConfirmar}>
                Confirmar resgate
              </Btn>
            </div>
          </motion.div>
        )}
        {etapa === 'processando' && (
          <motion.div key="p" className="lj-resgate__proc" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}>
            <motion.img src="./loja/c-recompensas.webp" alt="" animate={{ rotate: [0, -10, 10, -12, 12, -6, 6, 0], scale: [1, 1.05, 1, 1.08, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
            <h3>Preparando seu resgate...</h3>
            <p>Estamos separando o seu item com todo cuidado.</p>
            <span className="lj-resgate__barra">
              <motion.i initial={{ width: '5%' }} animate={{ width: '100%' }} transition={{ duration: 1.25, ease: 'easeInOut' }} />
            </span>
          </motion.div>
        )}
        {etapa === 'sucesso' && (
          <motion.div key="s" className="lj-resgate__ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Confete />
            <div className="lj-resgate__palco" style={{ '--fundo': it.fundo } as React.CSSProperties}>
              <motion.span className="lj-raios" animate={{ rotate: 360 }} transition={{ duration: 14, repeat: Infinity, ease: 'linear' }} />
              <motion.img
                src={it.galeria?.[0] ?? it.img}
                alt=""
                className={it.galeria || it.foto ? 'is-foto' : ''}
                style={{ filter: it.filtro }}
                initial={{ y: 80, scale: 0.2, opacity: 0, rotate: -20 }}
                animate={{ y: 0, scale: 1, opacity: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 220, damping: 12, delay: 0.15 }}
              />
            </div>
            <motion.h3 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              Resgate realizado!
            </motion.h3>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
              {it.tipo === 'fisico' ? (
                <>
                  <strong>{it.nome}</strong> será entregue na sua escola. Acompanhe o envio em Meus Resgates.
                </>
              ) : (
                <>
                  <strong>{it.nome}</strong> está sendo liberado no seu perfil. Isso leva só alguns instantes!
                </>
              )}
            </motion.p>
            <p className="lj-resgate__saldo">
              Novo saldo: <img src="./loja/gema.webp" alt="" />
              <strong>
                <Contador v={s.pontos} />
              </strong>{' '}
              pts <small>(antes {fmt(antes)})</small>
            </p>
            <div className="lj-resgate__btns">
              <Btn
                variante="contorno"
                onClick={() => {
                  onFechar()
                  ir({ id: 'resgates' })
                }}
              >
                Ver meus resgates
              </Btn>
              {it.cat === 'avatares' ? (
                <Btn
                  icone={<UserRound size={19} />}
                  onClick={() => {
                    equipar(it.id)
                    onFechar()
                    toast(`${it.nome} agora é o seu avatar!`)
                  }}
                >
                  Usar como avatar
                </Btn>
              ) : (
                <Btn
                  onClick={() => {
                    onFechar()
                    ir({ id: 'loja' }, -1)
                  }}
                >
                  Continuar explorando
                </Btn>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  )
}

/* ---------------- gemas voando do botão até o saldo no topo ---------------- */
function VooGemas({ de }: { de: HTMLElement | null }) {
  const [rotas, setRotas] = useState<{ x0: number; y0: number; x1: number; y1: number } | null>(null)
  useEffect(() => {
    const alvo = document.querySelector('[data-alvo-pontos]')?.getBoundingClientRect()
    const orig = (de?.closest('button') ?? de)?.getBoundingClientRect() ?? { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 }
    if (alvo) setRotas({ x0: orig.left + orig.width / 2, y0: orig.top + orig.height / 2, x1: alvo.left + 28, y1: alvo.top + alvo.height / 2 })
  }, [de])
  if (!rotas) return null
  return createPortal(
    <div className="lj-voo" aria-hidden>
      {Array.from({ length: 9 }).map((_, k) => {
        const dx = (Math.random() - 0.5) * 160
        const dy = -60 - Math.random() * 120
        return (
          <motion.img
            key={k}
            src="./loja/gema.webp"
            alt=""
            initial={{ x: rotas.x0 - 14, y: rotas.y0 - 14, scale: 0.4, opacity: 0 }}
            animate={{ x: [rotas.x0 - 14, rotas.x0 - 14 + dx, rotas.x1 - 14], y: [rotas.y0 - 14, rotas.y0 - 14 + dy, rotas.y1 - 14], scale: [0.4, 1.1, 0.5], opacity: [0, 1, 0.9, 0] }}
            transition={{ duration: 1.1, delay: k * 0.06, ease: [0.4, 0, 0.2, 1], times: [0, 0.35, 1] }}
          />
        )
      })}
    </div>,
    document.body,
  )
}
