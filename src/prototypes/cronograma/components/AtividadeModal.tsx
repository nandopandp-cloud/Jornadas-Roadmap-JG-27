import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ANOS, COMPONENTES, EDUCADORES, TIPOS, TIPO_LISTA, TURMAS, type Atividade, type TipoId } from '../data'
import { Btn, Modal, Select, TipoIcone } from './ui'

let seq = 100

/** formulário de criar/editar atividade do cronograma */
export default function AtividadeModal({
  aberto,
  atividade,
  padrao,
  onFechar,
  onSalvar,
}: {
  aberto: boolean
  /** editar esta atividade (ou criar uma nova quando ausente) */
  atividade?: Atividade | null
  /** valores iniciais para uma nova atividade (ex.: data do dia clicado) */
  padrao?: Partial<Atividade>
  onFechar: () => void
  onSalvar: (a: Atividade) => void
}) {
  const vazio = (): Atividade => ({
    id: `n${++seq}`,
    inicio: padrao?.inicio ?? '2025-11-06',
    fim: padrao?.fim ?? padrao?.inicio ?? '2025-11-14',
    ano: '6º ano',
    turmas: ['601'],
    educador: EDUCADORES[0],
    componente: COMPONENTES[0],
    unidade: '',
    objeto: '',
    tipo: null,
    ...padrao,
  })
  const [f, setF] = useState<Atividade>(atividade ?? vazio())
  const [tentou, setTentou] = useState(false)

  useEffect(() => {
    if (aberto) {
      setF(atividade ? { ...atividade, turmas: [...atividade.turmas] } : vazio())
      setTentou(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aberto, atividade])

  const up = (p: Partial<Atividade>) => setF((x) => ({ ...x, ...p }))
  const erros = {
    datas: !f.inicio || !f.fim || f.fim < f.inicio,
    turmas: f.turmas.length === 0,
    unidade: !f.unidade.trim(),
    objeto: !f.objeto.trim(),
    tipo: !f.tipo,
  }
  const valido = !Object.values(erros).some(Boolean)

  return (
    <Modal
      aberto={aberto}
      onFechar={onFechar}
      titulo={atividade ? 'Editar atividade' : 'Nova atividade'}
      largura={720}
      rodape={
        <>
          <Btn variante="contorno" onClick={onFechar}>
            Cancelar
          </Btn>
          <Btn
            onClick={() => {
              setTentou(true)
              if (valido) onSalvar({ ...f, unidade: f.unidade.trim(), objeto: f.objeto.trim() })
            }}
          >
            {atividade ? 'Salvar alterações' : 'Adicionar atividade'}
          </Btn>
        </>
      }
    >
      <div className="cr-form">
        <label className="cr-campo">
          <span>Início</span>
          <input type="date" value={f.inicio} onChange={(e) => up({ inicio: e.target.value })} />
        </label>
        <label className="cr-campo">
          <span>Término</span>
          <input type="date" value={f.fim} className={tentou && erros.datas ? 'is-erro' : ''} onChange={(e) => up({ fim: e.target.value })} />
          {tentou && erros.datas && <small className="cr-erro">O término precisa ser depois do início.</small>}
        </label>

        <div className="cr-campo">
          <span>Ano escolar</span>
          <Select className="cr-select--bloco" valor={f.ano} onChange={(ano) => up({ ano, turmas: [TURMAS[ano][0]] })} opcoes={ANOS.map((a) => ({ valor: a, texto: a }))} />
        </div>
        <div className="cr-campo">
          <span>Turmas</span>
          <div className="cr-chips">
            {TURMAS[f.ano].map((t) => {
              const on = f.turmas.includes(t)
              return (
                <motion.button
                  key={t}
                  type="button"
                  whileTap={{ scale: 0.92 }}
                  className={`cr-chip ${on ? 'is-on' : ''}`}
                  onClick={() => up({ turmas: on ? f.turmas.filter((x) => x !== t) : [...f.turmas, t].sort() })}
                >
                  {t}
                </motion.button>
              )
            })}
          </div>
          {tentou && erros.turmas && <small className="cr-erro">Escolha pelo menos uma turma.</small>}
        </div>

        <div className="cr-campo">
          <span>Educador(a)</span>
          <Select className="cr-select--bloco" valor={f.educador} onChange={(educador) => up({ educador })} opcoes={EDUCADORES.map((e) => ({ valor: e, texto: e }))} />
        </div>
        <div className="cr-campo">
          <span>Componente</span>
          <Select className="cr-select--bloco" valor={f.componente} onChange={(componente) => up({ componente })} opcoes={COMPONENTES.map((c) => ({ valor: c, texto: c }))} />
        </div>

        <label className="cr-campo">
          <span>Unidade temática</span>
          <input value={f.unidade} placeholder="Ex.: Matéria e energia" className={tentou && erros.unidade ? 'is-erro' : ''} onChange={(e) => up({ unidade: e.target.value })} />
        </label>
        <label className="cr-campo">
          <span>Objeto de conhecimento</span>
          <input value={f.objeto} placeholder="Ex.: Água" className={tentou && erros.objeto ? 'is-erro' : ''} onChange={(e) => up({ objeto: e.target.value })} />
        </label>

        <div className="cr-campo cr-campo--largo">
          <span>Atividade na plataforma</span>
          <div className="cr-tipos">
            {TIPO_LISTA.map((t: TipoId) => (
              <motion.button
                key={t}
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                className={`cr-tipocard ${f.tipo === t ? 'is-on' : ''}`}
                style={f.tipo === t ? { borderColor: TIPOS[t].cor, background: TIPOS[t].fundo } : undefined}
                onClick={() => up({ tipo: t })}
              >
                <TipoIcone tipo={t} tamanho={36} />
                <span>{TIPOS[t].nome}</span>
              </motion.button>
            ))}
          </div>
          {tentou && erros.tipo && <small className="cr-erro">Escolha o tipo de atividade.</small>}
        </div>
      </div>
    </Modal>
  )
}
