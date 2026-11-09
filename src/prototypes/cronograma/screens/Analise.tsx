import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, Clock, LayoutList } from 'lucide-react'
import { useEffect } from 'react'
import { Btn, Etapas, IlustraAnalise } from '../components/ui'
import { MESES_CURTOS } from '../data'
import { ETAPAS_VALIDACAO, VALIDACAO_MIN, etapaValidacao, nomesEscolas, restanteTexto, useCron } from '../store'
import { tamanhoTexto } from './Importar'

const dataEnvio = (d: Date) => `${String(d.getDate()).padStart(2, '0')} de ${MESES_CURTOS[d.getMonth()]} de ${d.getFullYear()} às ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`

/** Validação da planilha. Roda em segundo plano: a pessoa pode sair daqui e acompanhar pela caixinha flutuante. */
export default function Analise() {
  const { s, ir, iniciarValidacao, concluirAnalise } = useCron()
  const w = s.wizard!
  const v = s.validacao
  const arq = w.arquivo!

  // entrou aqui sem validação em andamento (ex.: atalho): começa agora
  useEffect(() => {
    if (!v) iniciarValidacao()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const pct = v?.pct ?? 0
  const passo = etapaValidacao(pct)
  const fim = v?.estado === 'concluida'
  const escolasLidas = passo >= 2

  return (
    <div className="cr-wizard">
      <Etapas atual={1} progresso={0.5 + pct / 2} />
      <header className="cr-titulo">
        <h1>{fim ? 'Validação concluída!' : 'Validando sua planilha'}</h1>
        <p>
          Estamos lendo o arquivo {arq.nome}, identificando as escolas e verificando as informações. Em seguida, mostraremos os pontos de atenção e as sugestões de ajuste.
        </p>
      </header>

      <motion.div className={`cr-segundo-plano ${fim ? 'is-fim' : ''}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <span className="cr-segundo-plano__ic">{fim ? <Check size={20} strokeWidth={2.6} /> : <Clock size={20} />}</span>
        <div>
          <strong>{fim ? '12 pontos de atenção em 4 escolas' : `Isso pode levar até ${VALIDACAO_MIN} minutos`}</strong>
          <p>
            {fim
              ? 'Revise as sugestões de ajuste antes de publicar os cronogramas.'
              : 'A validação continua em segundo plano. Você pode usar a plataforma normalmente e acompanhar o progresso pela caixinha no canto da tela. Avisamos quando terminar.'}
          </p>
        </div>
        {fim ? (
          <Btn iconeDir={<ArrowRight size={18} />} onClick={concluirAnalise}>
            Revisar pontos de atenção
          </Btn>
        ) : (
          <Btn variante="contorno" icone={<LayoutList size={18} />} onClick={() => ir({ id: 'lista' }, -1)}>
            Continuar navegando
          </Btn>
        )}
      </motion.div>

      <div className="cr-analise">
        <div className="cr-analise__arquivo">
          <motion.div className="cr-analise__ilustra" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 18 }}>
            <IlustraAnalise />
          </motion.div>
          <strong>{arq.nome}</strong>
          <span>
            {tamanhoTexto(arq.tamanho)} • Enviado em {dataEnvio(arq.enviadoEm)}
          </span>
          <AnimatePresence>
            {escolasLidas && (
              <motion.span className="cr-analise__escolas" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                {w.escolas.length} escolas identificadas: {nomesEscolas(s.escolas, w.escolas)}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="cr-analise__passos">
          <ul>
            {ETAPAS_VALIDACAO.map((p, i) => {
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
              <span className="cr-progresso__barra" style={{ width: `${Math.round(pct * 100)}%` }} />
            </span>
            <b>{Math.round(pct * 100)}%</b>
          </div>
          <p className="cr-analise__resta">{fim ? 'Tudo pronto para a revisão.' : `Tempo estimado: ${restanteTexto(pct)}`}</p>
        </div>
      </div>
    </div>
  )
}
