import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { useState } from 'react'
import { Btn } from '../components/ui'
import { nomeEscola, useCron } from '../store'

type Opcao = 'plataforma' | 'csv'

const OPCOES: { id: Opcao; titulo: string; texto: string; img: string; itens: string[] }[] = [
  {
    id: 'plataforma',
    titulo: 'Criar na plataforma',
    texto: 'Monte o cronograma de forma guiada, com preenchimento passo a passo e aplicação em massa para escolas, anos e turmas.',
    img: 'op-plataforma',
    itens: ['Fluxo guiado e intuitivo', 'Aplicação em massa (todas as escolas, anos e turmas)', 'Validações automáticas'],
  },
  {
    id: 'csv',
    titulo: 'Usar planilha (CSV)',
    texto: 'Importe uma planilha com as programações da sua rede. A plataforma fará a leitura dos dados, validará as informações e permitirá ajustes.',
    img: 'op-planilha',
    itens: ['Importação rápida de múltiplas programações', 'Leitura e validação automática dos dados', 'Possibilidade de ajustes antes da publicação'],
  },
]

/** Primeira etapa: escolher como montar o cronograma */
export default function Escolha({ escola }: { escola?: string }) {
  const { s, ir, iniciar, iniciarPlano, verValidacao, toast } = useCron()
  const [op, setOp] = useState<Opcao>('plataforma')

  /** planilha não pede escola: um mesmo arquivo pode trazer as programações de várias escolas */
  const continuar = () => {
    if (op === 'plataforma') return iniciarPlano(escola)
    if (s.validacao?.estado === 'rodando') {
      toast('Já há uma planilha em validação. Acompanhe o andamento por aqui.', 'info')
      return verValidacao()
    }
    iniciar()
  }

  return (
    <div className="pl-escolha">
      <header className="pl-escolha__cab">
        <div>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            Criar cronograma de uso
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
            Escolha como deseja montar o seu cronograma{escola ? ` da ${nomeEscola(s.escolas, escola)}` : ''}. Você pode criar diretamente na plataforma ou importar uma planilha com as programações.
          </motion.p>
        </div>
        <motion.img
          src="./cron/cab-calendario-foguete.svg"
          alt=""
          className="pl-escolha__img"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0, y: [0, -6, 0] }}
          transition={{ x: { type: 'spring', stiffness: 140, damping: 18 }, y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' } }}
        />
      </header>

      <div className="pl-opcoes" role="radiogroup" aria-label="Como montar o cronograma">
        {OPCOES.map((o, i) => {
          const on = op === o.id
          return (
            <motion.button
              key={o.id}
              role="radio"
              aria-checked={on}
              className={`pl-opcao ${on ? 'is-on' : ''}`}
              onClick={() => setOp(o.id)}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 22, delay: 0.1 + i * 0.08 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.99 }}
            >
              <span className={`pl-opcao__radio ${on ? 'is-on' : ''}`}>
                <AnimatePresence>{on && <motion.i initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 600, damping: 20 }} />}</AnimatePresence>
              </span>
              <motion.img className="pl-opcao__img" src={`./cron/${o.img}.svg`} alt="" animate={on ? { y: [0, -6, 0], scale: 1.03 } : { y: 0, scale: 1 }} transition={on ? { y: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }, scale: { duration: 0.3 } } : { duration: 0.3 }} />
              <h2>{o.titulo}</h2>
              <p>{o.texto}</p>
              <ul>
                {o.itens.map((t, k) => (
                  <motion.li key={t} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.08 + k * 0.05 }}>
                    <Check size={20} strokeWidth={2.6} />
                    {t}
                  </motion.li>
                ))}
              </ul>
            </motion.button>
          )
        })}
      </div>

      <footer className="pl-rodape">
        <button className="cr-link pl-rodape__cancelar" onClick={() => ir({ id: 'lista' }, -1)}>
          Cancelar
        </button>
        <Btn iconeDir={<ArrowRight size={20} />} onClick={continuar}>
          Continuar
        </Btn>
      </footer>

    </div>
  )
}
