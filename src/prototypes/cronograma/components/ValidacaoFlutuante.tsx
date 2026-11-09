import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, ChevronDown, ChevronUp, FileSpreadsheet, X } from 'lucide-react'
import { Btn } from './ui'
import { ETAPAS_VALIDACAO, etapaValidacao, restanteTexto, useCron } from '../store'

/**
 * Caixinha de progresso da validação da planilha.
 * Fica no canto da tela em qualquer página enquanto a validação roda em segundo plano (até ~15 min),
 * para a pessoa seguir usando a plataforma. Ao terminar, leva direto para a revisão.
 */
export default function ValidacaoFlutuante() {
  const { s, verValidacao, concluirAnalise, minimizarValidacao, dispensarValidacao } = useCron()
  const v = s.validacao
  const w = s.wizard
  const visivel = !!v && !!w && s.perfil === 'gestor' && s.view.id !== 'analise'
  const pct = v ? Math.round(v.pct * 100) : 0
  const fim = v?.estado === 'concluida'
  const passo = v ? etapaValidacao(v.pct) : 0
  const etapa = ETAPAS_VALIDACAO[Math.min(passo, ETAPAS_VALIDACAO.length - 1)]

  return (
    <AnimatePresence>
      {visivel && (
        <motion.section
          className={`cr-validacao ${v!.minimizada ? 'is-min' : ''} ${fim ? 'is-fim' : ''}`}
          role="status"
          aria-live="polite"
          aria-label="Validação da planilha"
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          layout
        >
          <header className="cr-validacao__cab">
            <span className="cr-validacao__estado">
              {fim ? (
                <motion.span className="cr-validacao__ok" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 16 }}>
                  <Check size={16} strokeWidth={3} />
                </motion.span>
              ) : (
                <span className="cr-spinner cr-validacao__spinner" />
              )}
            </span>
            <span className="cr-validacao__titulo">
              <strong>{fim ? 'Validação concluída' : 'Validando planilha'}</strong>
              {v!.minimizada && !fim && <small>{pct}% · {restanteTexto(v!.pct)}</small>}
            </span>
            <button className="cr-iconbtn" onClick={() => minimizarValidacao(!v!.minimizada)} aria-label={v!.minimizada ? 'Expandir progresso' : 'Minimizar progresso'}>
              {v!.minimizada ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {fim && (
              <button className="cr-iconbtn" onClick={dispensarValidacao} aria-label="Fechar">
                <X size={18} />
              </button>
            )}
          </header>

          <AnimatePresence initial={false}>
            {!v!.minimizada && (
              <motion.div className="cr-validacao__corpo" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                <div className="cr-validacao__arquivo">
                  <FileSpreadsheet size={18} strokeWidth={1.8} />
                  <span>{w!.arquivo?.nome}</span>
                  {passo >= 2 && <em>{w!.escolas.length} escolas</em>}
                </div>
                {fim ? (
                  <p className="cr-validacao__msg">
                    <b>12 pontos de atenção</b> encontrados nas {w!.escolas.length} escolas. Revise as sugestões antes de publicar.
                  </p>
                ) : (
                  <>
                    <div className="cr-validacao__barra">
                      <span>
                        <i style={{ width: `${pct}%` }} />
                      </span>
                      <b>{pct}%</b>
                    </div>
                    <p className="cr-validacao__msg">
                      <b>{etapa.titulo}</b> · {restanteTexto(v!.pct)}
                    </p>
                    <p className="cr-validacao__dica">Pode continuar usando a plataforma. Avisamos aqui quando terminar.</p>
                  </>
                )}
                <footer className="cr-validacao__acoes">
                  <button className="cr-link" onClick={verValidacao}>
                    Ver detalhes
                  </button>
                  {fim && (
                    <Btn pequeno iconeDir={<ArrowRight size={16} />} onClick={concluirAnalise}>
                      Revisar agora
                    </Btn>
                  )}
                </footer>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      )}
    </AnimatePresence>
  )
}
