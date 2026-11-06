import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Etapas, IlustraAnalise } from '../components/ui'
import { MESES_CURTOS } from '../data'
import { nomeEscola, useCron } from '../store'
import { tamanhoTexto } from './Importar'

const PASSOS = [
  { titulo: 'Upload do arquivo', feito: 'Arquivo recebido com sucesso.', fazendo: 'Enviando arquivo...' },
  { titulo: 'Leitura e validação dos dados', feito: '24 registros lidos e validados.', fazendo: 'Identificando informações, conferindo padrões e procurando inconsistências...' },
  { titulo: 'Preparando sugestões de ajuste', feito: '12 pontos de atenção encontrados.', fazendo: 'Comparando com educadores, turmas e componentes da sua rede...' },
  { titulo: 'Organizando o cronograma', feito: 'Cronograma organizado por mês.', fazendo: 'Agrupando as atividades por mês e tipo...' },
]
/** duração de cada passo (ms) */
const TEMPOS = [600, 1900, 1500, 1100]

const dataEnvio = (d: Date) => `${String(d.getDate()).padStart(2, '0')} de ${MESES_CURTOS[d.getMonth()]} de ${d.getFullYear()} às ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`

export default function Analise() {
  const { s, concluirAnalise } = useCron()
  const w = s.wizard!
  const escola = nomeEscola(s.escolas, w.escola)
  const arq = w.arquivo!
  const [passo, setPasso] = useState(0) // passo em andamento (0–3); 4 = terminou
  const [pct, setPct] = useState(4)

  useEffect(() => {
    const ts: number[] = []
    let t = 0
    TEMPOS.forEach((d, i) => {
      t += d
      ts.push(window.setTimeout(() => setPasso(i + 1), t))
    })
    ts.push(window.setTimeout(concluirAnalise, t + 700))
    // barra de progresso contínua
    const total = t
    const t0 = performance.now()
    let raf = 0
    const loop = () => {
      const p = Math.min(1, (performance.now() - t0) / total)
      setPct(Math.round(4 + p * 96))
      if (p < 1) raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      ts.forEach(window.clearTimeout)
      cancelAnimationFrame(raf)
    }
  }, [concluirAnalise])

  return (
    <div className="cr-wizard">
      <Etapas atual={1} progresso={0.5 + pct / 200} />
      <header className="cr-titulo">
        <h1>{passo >= 4 ? 'Análise concluída!' : 'Analisando seu arquivo'}</h1>
        <p>
          Estamos lendo o arquivo {arq.nome} e verificando as informações. Em breve, mostraremos os pontos de atenção e sugestões de ajuste.
        </p>
      </header>

      <div className="cr-analise">
        <div className="cr-analise__arquivo">
          <motion.div className="cr-analise__ilustra" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 18 }}>
            <IlustraAnalise />
          </motion.div>
          <strong>{arq.nome}</strong>
          <span>
            {tamanhoTexto(arq.tamanho)} • Enviado em {dataEnvio(arq.enviadoEm)}
          </span>
        </div>

        <div className="cr-analise__passos">
          <ul>
            {PASSOS.map((p, i) => {
              const estado = i < passo ? 'feito' : i === passo ? 'fazendo' : 'espera'
              return (
                <motion.li key={p.titulo} className={`is-${estado}`} layout transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
                  {estado === 'fazendo' && <motion.span layoutId="cr-passo-fundo" className="cr-analise__fundo" />}
                  <span className="cr-analise__marca">
                    <AnimatePresence mode="wait" initial={false}>
                      {estado === 'feito' ? (
                        <motion.span key="ok" className="cr-analise__ok" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}>
                          <Check size={18} strokeWidth={3} />
                        </motion.span>
                      ) : estado === 'fazendo' ? (
                        <motion.span key="gira" className="cr-spinner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
                      ) : (
                        <span key="espera" className="cr-analise__espera" />
                      )}
                    </AnimatePresence>
                  </span>
                  <span className="cr-analise__txt">
                    <strong>{p.titulo}</strong>
                    {estado !== 'espera' && (
                      <motion.small key={estado} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
                        {estado === 'feito' ? p.feito : p.fazendo}
                      </motion.small>
                    )}
                  </span>
                </motion.li>
              )
            })}
          </ul>
          <div className="cr-progresso">
            <span className="cr-progresso__trilho">
              <span className="cr-progresso__barra" style={{ width: `${pct}%` }} />
            </span>
            <b>{pct}%</b>
          </div>
          <AnimatePresence>
            {passo >= 4 && (
              <motion.p className="cr-analise__fim" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                Tudo pronto! Abrindo a revisão da {escola}…
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
