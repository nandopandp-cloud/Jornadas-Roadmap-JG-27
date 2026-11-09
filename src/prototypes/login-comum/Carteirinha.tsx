import { Ban, EyeOff } from 'lucide-react'
import QRCode from 'qrcode'
import { useEffect, useState } from 'react'
import './carteirinha.css'

/** Componente “Carteirinha de acesso” do Figma (variantes Dados visíveis / ocultos). */
const NOMES: Record<string, string> = { foguete: 'Foguete', planeta: 'Planeta', estrela: 'Estrela', cometa: 'Cometa', lua: 'Lua', disco: 'Disco voador' }
export const CODIGO_EXEMPLO = ['foguete', 'planeta', 'estrela', 'cometa', 'lua', 'disco']

type Props = {
  nome?: string
  turma?: string
  idt?: string
  versao?: number
  /** esconde QR Code e sequência (prévia do Admins) */
  oculta?: boolean
  mini?: boolean
  seq?: string[]
  token?: string
  /** quando informado, o quadro do QR vira o botão Exibir / Ocultar */
  onAlternar?: () => void
  /** partes da credencial que não valem mais */
  revogado?: { qr?: boolean; icones?: boolean }
}

export function Carteirinha({ nome = 'Ana Clara da Silva', turma = '1º ano A · Escola Exemplo', idt = 'ID 004812', versao = 2, oculta, mini, seq = CODIGO_EXEMPLO, token = '7F3K9Q2XW8LM4T', onAlternar, revogado }: Props) {
  const [qr, setQr] = useState('')
  useEffect(() => {
    if (oculta) return
    QRCode.toDataURL(`https://acesso.jovensgenios.com/c/${token}`, { margin: 0, width: 220, color: { dark: '#1f1f1f', light: '#ffffff' } }).then(setQr)
  }, [oculta, token])
  const qrRev = !!revogado?.qr
  const icRev = !!revogado?.icones
  const conteudoQr = qrRev ? (
    <span className="lg-cart-oculto is-revogado">
      <Ban size={22} />
      Revogado
    </span>
  ) : oculta ? (
    <span className="lg-cart-oculto">
      <EyeOff size={22} />
      {onAlternar ? 'Exibir' : 'Oculto'}
    </span>
  ) : (
    qr && <img src={qr} alt="QR Code de acesso" />
  )
  return (
    <div className={`lg-cart ${mini ? 'is-mini' : ''} ${oculta ? 'is-oculta' : ''}`}>
      <div className="lg-cart-faixa">
        <span className="lg-cart-logo">
          <img src="./login/logo.webp" alt="Jovens Gênios" />
        </span>
        <b>Carteirinha de acesso</b>
      </div>
      <div className="lg-cart-corpo">
        {onAlternar && !qrRev ? (
          <button type="button" className={`lg-cart-qr is-botao ${qrRev ? 'is-rev' : ''}`} onClick={onAlternar} aria-pressed={!oculta} title={oculta ? 'Exibir QR Code e ícones' : 'Ocultar QR Code e ícones'}>
            {conteudoQr}
            {!oculta && (
              <span className="lg-cart-ocultar">
                <EyeOff size={12} /> Ocultar
              </span>
            )}
          </button>
        ) : (
          <span className={`lg-cart-qr ${qrRev ? 'is-rev' : ''}`}>{conteudoQr}</span>
        )}
        <span className="lg-cart-dados">
          <b>{nome}</b>
          <small>{turma}</small>
          <small className="is-id">{idt}</small>
          <em>MEU CÓDIGO{icRev ? ' · REVOGADO' : ''}</em>
          <span className={`lg-cart-seq ${icRev ? 'is-rev' : ''}`}>
            {seq.map((id, i) => (
              <i key={i}>{oculta && !icRev ? <span className="lg-cart-ponto" /> : <img src={`./login/icones/${id}.webp`} alt={NOMES[id] ?? id} />}</i>
            ))}
          </span>
        </span>
      </div>
      <div className="lg-cart-rodape">
        <span>Mostre o QR Code para a câmera ou toque nos ícones nessa ordem.</span>
        <span>v{versao}</span>
      </div>
    </div>
  )
}


