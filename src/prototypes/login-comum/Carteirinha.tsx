import { EyeOff } from 'lucide-react'
import QRCode from 'qrcode'
import { useEffect, useState } from 'react'
import './carteirinha.css'

/** Componente “Carteirinha de acesso” do Figma (variantes Dados visíveis / ocultos). */
const NOMES: Record<string, string> = { foguete: 'Foguete', planeta: 'Planeta', estrela: 'Estrela', cometa: 'Cometa', lua: 'Lua', disco: 'Disco voador' }
export const CODIGO_EXEMPLO = ['foguete', 'planeta', 'estrela', 'cometa', 'lua', 'disco']

export function Carteirinha({ nome = 'Ana Clara da Silva', turma = '1º ano A · Escola Exemplo', idt = 'ID 004812', versao = 2, oculta, mini, seq = CODIGO_EXEMPLO, token = '7F3K9Q2XW8LM4T' }: { nome?: string; turma?: string; idt?: string; versao?: number; oculta?: boolean; mini?: boolean; seq?: string[]; token?: string }) {
  const [qr, setQr] = useState('')
  useEffect(() => {
    if (oculta) return
    QRCode.toDataURL(`https://acesso.jovensgenios.com/c/${token}`, { margin: 0, width: 220, color: { dark: '#1f1f1f', light: '#ffffff' } }).then(setQr)
  }, [oculta, token])
  return (
    <div className={`lg-cart ${mini ? 'is-mini' : ''} ${oculta ? 'is-oculta' : ''}`}>
      <div className="lg-cart-faixa">
        <span className="lg-cart-logo">
          <img src="./login/logo.webp" alt="Jovens Gênios" />
        </span>
        <b>Carteirinha de acesso</b>
      </div>
      <div className="lg-cart-corpo">
        <span className="lg-cart-qr">
          {oculta ? (
            <span className="lg-cart-oculto">
              <EyeOff size={22} />
              Oculto
            </span>
          ) : (
            qr && <img src={qr} alt="QR Code de acesso" />
          )}
        </span>
        <span className="lg-cart-dados">
          <b>{nome}</b>
          <small>{turma}</small>
          <small className="is-id">{idt}</small>
          <em>MEU CÓDIGO</em>
          <span className="lg-cart-seq">
            {seq.map((id, i) => (
              <i key={i}>{oculta ? <span className="lg-cart-ponto" /> : <img src={`./login/icones/${id}.webp`} alt={NOMES[id] ?? id} />}</i>
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
