import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Check, Copy, CreditCard, Info, RotateCcw } from 'lucide-react'
import QRCode from 'qrcode'
import { useEffect, useState } from 'react'
import { Contador } from '../components/ui'
import { useLoja } from '../store'

const ID = '719-583-056-383'

/** Meu Cartão — cartão fidelidade dos Exploradores */
export default function Cartao() {
  const { s, ir, toast } = useLoja()
  const [qr, setQr] = useState('')
  const [virado, setVirado] = useState(false)
  const [copiado, setCopiado] = useState(false)

  useEffect(() => {
    QRCode.toDataURL(`https://clube.jovensgenios.com/cartao/${ID.replace(/-/g, '')}`, { margin: 0, width: 360, color: { dark: '#0f1020', light: '#ffffff' } }).then(setQr)
  }, [])

  // inclinação 3D acompanhando o mouse
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rx = useSpring(useTransform(my, [0, 1], [9, -9]), { stiffness: 180, damping: 18 })
  const ry = useSpring(useTransform(mx, [0, 1], [-12, 12]), { stiffness: 180, damping: 18 })
  const brilhoX = useTransform(mx, [0, 1], ['0%', '100%'])
  const brilhoY = useTransform(my, [0, 1], ['0%', '100%'])

  return (
    <div className="lj-cartao-pag">
      <div className="lj-cartao-grade">
        <div className="lj-cartao-wrap">
          <motion.div
            className="lj-cartao-cena"
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect()
              mx.set((e.clientX - r.left) / r.width)
              my.set((e.clientY - r.top) / r.height)
            }}
            onMouseLeave={() => {
              mx.set(0.5)
              my.set(0.5)
            }}
            style={{ rotateX: rx, rotateY: ry }}
            initial={{ opacity: 0, y: 30, rotateZ: -4 }}
            animate={{ opacity: 1, y: 0, rotateZ: 0 }}
            transition={{ type: 'spring', stiffness: 160, damping: 16 }}
          >
            <motion.div className="lj-cartao-giro" animate={{ rotateY: virado ? 180 : 0 }} transition={{ type: 'spring', stiffness: 140, damping: 18 }} onClick={() => setVirado((v) => !v)} role="button" tabIndex={0} aria-label={virado ? 'Ver frente do cartão' : 'Ver verso do cartão'} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setVirado((v) => !v))}>
              {/* frente */}
              <div className="lj-cartao lj-cartao--frente" aria-hidden={virado}>
                <img src="./loja/cartao.webp" alt="" draggable={false} />
                <motion.span className="lj-cartao__brilho" style={{ '--bx': brilhoX, '--by': brilhoY } as never} />
                <div className="lj-cartao__titulo">
                  <strong>Cartão Fidelidade</strong>
                  <em>Exploradores</em>
                </div>
                <div className="lj-cartao__rod">
                  <strong className="lj-cartao__nome">Franciscleudo da Silva</strong>
                  <div className="lj-cartao__dados">
                    <span>
                      <small>ID do cartão</small>
                      <b>{ID}</b>
                    </span>
                    <span className="is-dir">
                      <small>Válido até</small>
                      <b>30 de jun. de 2030</b>
                    </span>
                  </div>
                </div>
              </div>
              {/* verso */}
              <div className="lj-cartao lj-cartao--verso" aria-hidden={!virado}>
                <span className="lj-cartao__tarja" />
                <div className="lj-cartao__verso-corpo">
                  <div className="lj-cartao__qr">{qr && <img src={qr} alt="QR Code do cartão" />}</div>
                  <div>
                    <strong>Apresente este cartão</strong>
                    <p>Use o QR Code no Clube Jovens Gênios da sua escola para retirar prêmios e usar seus benefícios.</p>
                    <span className="lj-cartao__assin">Franciscleudo da Silva</span>
                  </div>
                </div>
                <small className="lj-cartao__legal">Cartão pessoal e intransferível · ID {ID}</small>
              </div>
            </motion.div>
          </motion.div>
          <button className="lj-cartao-dica" onClick={() => setVirado((v) => !v)}>
            <RotateCcw size={15} /> {virado ? 'Toque para ver a frente' : 'Toque no cartão para ver o verso'}
          </button>
        </div>

        <motion.section className="lj-saldo-card" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3>Seu saldo de pontos</h3>
          <button className="lj-saldo-card__caixa" onClick={() => ir({ id: 'historico' })} title="Ver histórico">
            <img className="lj-saldo-card__gema" src="./loja/gema.webp" alt="" />
            <strong>
              <Contador v={s.pontos} /> <small>pts</small>
            </strong>
            <motion.img className="lj-saldo-card__moedas" src="./loja/moedas.webp" alt="" animate={{ y: [0, -6, 0], rotate: [0, 3, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />
          </button>
          <p>Use seus pontos para resgatar itens incríveis, personalizar seu avatar e aproveitar recompensas exclusivas!</p>
        </motion.section>

        <motion.section className="lj-qr-card" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
          <div className="lj-qr-card__qr">
            {qr && <img src={qr} alt="QR Code do cartão" />}
            <motion.span className="lj-qr-card__scan" animate={{ top: ['6%', '90%', '6%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />
            <i className="c1" />
            <i className="c2" />
            <i className="c3" />
            <i className="c4" />
          </div>
          <div>
            <h3>Seu QR Code</h3>
            <p>Apresente este código no Clube Jovens Gênios para identificar seu cartão e utilizar seus benefícios.</p>
            <button
              className="lj-copiar"
              onClick={() => {
                navigator.clipboard?.writeText(ID).catch(() => {})
                setCopiado(true)
                toast('ID do cartão copiado!')
                window.setTimeout(() => setCopiado(false), 2000)
              }}
            >
              {copiado ? <Check size={16} /> : <Copy size={16} />} {copiado ? 'Copiado!' : `Copiar ID ${ID}`}
            </button>
          </div>
        </motion.section>

        <motion.section className="lj-importante" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
          <h3>
            <Info size={24} strokeWidth={1.9} /> Importante!
          </h3>
          <p>
            Este é o seu cartão fidelidade dos Exploradores.
            <br />
            Ele é pessoal e intransferível.
          </p>
          <CreditCard className="lj-importante__ic" size={82} strokeWidth={1.2} />
        </motion.section>
      </div>
    </div>
  )
}
