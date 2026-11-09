import { motion } from 'framer-motion'
import { ArrowRight, GitCompareArrows, Hourglass, Info, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { CARREIRA } from '../carreiras'
import { Selo } from '../components/perfil'
import { Barra, Btn, Modal } from '../components/ui'
import { N_ITENS, contar } from '../instrumento'
import { dataLonga, quando, useTv } from '../store'

/** Minha jornada profissional (PRD §5.13): tentativas, versões e evolução */
export default function Historico() {
  const { s, ir, iniciar, atual } = useTv()
  const [novo, setNovo] = useState(false)
  const feitas = s.tentativas.filter((t) => t.status === 'concluida').sort((a, b) => b.fim! - a.fim!)

  return (
    <div className="tv-hist">
      <header className="tv-pagcab">
        <div>
          <h1 className="tv-h1">Minha jornada</h1>
          <p>Todos os seus testes ficam guardados como eram. Interesses mudam com o tempo, e resultados diferentes não significam erro.</p>
        </div>
        {!atual && (
          <Btn icone={<RotateCcw size={16} />} onClick={() => setNovo(true)}>
            Fazer novo teste
          </Btn>
        )}
      </header>

      {atual && (
        <motion.div className="tv-cartao tv-retomar" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <span className="tv-retomar__ic">
            <Hourglass size={24} />
          </span>
          <div className="tv-retomar__txt">
            <strong>Teste em andamento</strong>
            <span>
              {contar(atual.respostas)} de {N_ITENS} respondidas · começou {quando(atual.inicio).toLowerCase()}
            </span>
            <Barra valor={(contar(atual.respostas) / N_ITENS) * 100} rotulo="Progresso" />
          </div>
          <Btn iconeDir={<ArrowRight size={16} />} onClick={() => ir(atual.clarezaPre === undefined ? { id: 'clareza' } : { id: 'questionario' })}>
            Continuar
          </Btn>
        </motion.div>
      )}

      {feitas.length === 0 ? (
        <div className="tv-cartao tv-vazio tv-vazio--grande">
          <img src="./voc/hourglass-not-done.webp" alt="" width={64} />
          <strong>Seu histórico ainda está vazio</strong>
          <span>Quando você concluir o Teste Vocacional, o resultado aparece aqui, com a data e a versão usada.</span>
          <Btn onClick={() => ir({ id: 'entrada' })}>Conhecer o teste</Btn>
        </div>
      ) : (
        <ol className="tv-linha">
          {feitas.map((t, i) => {
            const res = t.resultado!
            const anterior = feitas[i + 1]
            const mesmaVersao = anterior && anterior.resultado!.versao === res.versao
            return (
              <motion.li key={t.id} className="tv-linha__item" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                <span className={`tv-linha__ponto ${i === 0 ? 'is-on' : ''}`} />
                <div className="tv-cartao tv-tent">
                  <header>
                    <div>
                      <strong>{dataLonga(t.fim!)}</strong>
                      <small>
                        {i === 0 ? 'Resultado mais recente · ' : ''}Instrumento {res.versao}
                      </small>
                    </div>
                    <Btn variante={i === 0 ? 'primario' : 'contorno'} pequeno iconeDir={<ArrowRight size={14} />} onClick={() => ir({ id: 'relatorio', tentativa: i === 0 ? undefined : t.id })}>
                      Abrir relatório
                    </Btn>
                  </header>
                  <div className="tv-tent__corpo">
                    <div>
                      <small className="tv-tent__rot">Pistas de interesse</small>
                      <div className="tv-tent__selos">
                        {res.perfil.destaques.map((d) => (
                          <Selo key={d} d={d} tam="p" />
                        ))}
                      </div>
                    </div>
                    <div>
                      <small className="tv-tent__rot">Algumas sugestões</small>
                      <div className="tv-tent__profs">
                        {res.recomendacoes.slice(0, 4).map((r) => (
                          <span key={r.id} title={CARREIRA[r.id].nome}>
                            <img src={CARREIRA[r.id].icone} alt="" />
                            {CARREIRA[r.id].nome}
                          </span>
                        ))}
                      </div>
                    </div>
                    {(t.clarezaPre || t.clarezaPos) && (
                      <div>
                        <small className="tv-tent__rot">Clareza</small>
                        <span className="tv-tent__clar">
                          {t.clarezaPre ?? '–'} <ArrowRight size={13} /> {t.clarezaPos?.valor ?? '–'}
                        </span>
                      </div>
                    )}
                  </div>
                  {anterior && (
                    <p className={`tv-tent__nota ${mesmaVersao ? '' : 'is-aviso'}`}>
                      {mesmaVersao ? <GitCompareArrows size={14} /> : <Info size={14} />}
                      {mesmaVersao
                        ? 'Mesma versão do teste anterior: dá para comparar os dois resultados.'
                        : `Feito com uma versão diferente do instrumento (${anterior.resultado!.versao} → ${res.versao}). Por isso não comparamos os resultados diretamente.`}
                    </p>
                  )}
                </div>
              </motion.li>
            )
          })}
        </ol>
      )}

      <Modal
        aberto={novo}
        onFechar={() => setNovo(false)}
        titulo="Fazer o teste de novo?"
        rodape={
          <>
            <Btn variante="contorno" onClick={() => setNovo(false)}>
              Cancelar
            </Btn>
            <Btn
              onClick={() => {
                setNovo(false)
                iniciar()
                ir({ id: 'clareza' })
              }}
            >
              Começar nova tentativa
            </Btn>
          </>
        }
      >
        <p className="tv-texto">A nova tentativa é registrada separadamente. Seus resultados anteriores, carreiras salvas e plano continuam guardados.</p>
      </Modal>
    </div>
  )
}
