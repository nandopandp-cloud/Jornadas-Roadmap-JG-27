import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Download, FileText, Info, Trash2, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { Btn, Etapas, IlustraCSV } from '../components/ui'
import { COLUNAS_CSV } from '../data'
import { nomeEscola, useCron } from '../store'

const MAX = 10 * 1024 * 1024
export const tamanhoTexto = (b: number) => (b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`)

/** gera o modelo oficial (.CSV) para download */
function baixarModelo() {
  const linhas = [
    COLUNAS_CSV.map(([c]) => c).join(';'),
    '06/01/2025;24/01/2025;6º ano;601, 602;Álvaro Dumbledore;Ciências;Matéria e energia;Água;Prova Genial',
    '06/01/2025;24/01/2025;7º ano;701;Julia Verus;Português;Leitura e produção de textos;Estratégias de leitura;Tarefa',
  ]
  const blob = new Blob(['﻿' + linhas.join('\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'modelo_cronograma_de_uso.csv'
  a.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export default function Importar() {
  const { s, setArquivo, ir, toast } = useCron()
  const w = s.wizard!
  const escola = nomeEscola(s.escolas, w.escola)
  const input = useRef<HTMLInputElement>(null)
  const [arrastando, setArrastando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [ajuda, setAjuda] = useState(false)
  const arq = w.arquivo

  const receber = (f: File | undefined) => {
    if (!f) return
    if (!/\.csv$/i.test(f.name)) {
      setErro('Formato não aceito. Envie um arquivo .CSV.')
      toast('Esse arquivo não é .CSV.', 'erro')
      return
    }
    if (f.size > MAX) {
      setErro('O arquivo passa de 10 MB.')
      return
    }
    setErro(null)
    setArquivo({ nome: f.name, tamanho: f.size, enviadoEm: (() => { const d = new Date(); return new Date(2025, 10, 6, d.getHours(), d.getMinutes()) })() })
  }

  return (
    <div className="cr-wizard">
      <Etapas atual={1} progresso={arq ? 1 : 0.5} />

      <header className="cr-titulo">
        <h1>Importe o cronograma de uso</h1>
        <p>
          Envie um arquivo .CSV para criar o cronograma da {escola}. O sistema irá ler o arquivo, identificar possíveis inconsistências e sugerir correções para você antes de
          continuar.
        </p>
      </header>

      <div className="cr-importar">
        <motion.div
          className={`cr-drop ${arrastando ? 'is-arrastando' : ''} ${arq ? 'is-cheio' : ''} ${erro ? 'is-erro' : ''}`}
          onDragOver={(e) => {
            e.preventDefault()
            setArrastando(true)
          }}
          onDragLeave={() => setArrastando(false)}
          onDrop={(e) => {
            e.preventDefault()
            setArrastando(false)
            receber(e.dataTransfer.files[0])
          }}
          animate={arrastando ? { scale: 1.01 } : { scale: 1 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {!arq ? (
              <motion.div key="vazio" className="cr-drop__vazio" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <motion.div className="cr-drop__ilustra" animate={arrastando ? { y: -8, rotate: -3 } : { y: [0, -5, 0] }} transition={arrastando ? { type: 'spring' } : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                  <IlustraCSV />
                </motion.div>
                <h3>{arrastando ? 'Solte o arquivo aqui' : 'Arraste e solte seu arquivo aqui'}</h3>
                <p className={erro ? 'is-erro' : ''}>{erro ?? 'Formato aceito: .CSV (até 10 MB)'}</p>
                <Btn icone={<Upload size={20} />} onClick={() => input.current?.click()}>
                  Selecionar arquivo
                </Btn>
                <button
                  className="cr-link cr-drop__exemplo"
                  onClick={() => setArquivo({ nome: `cronograma_${escola.toLowerCase().replace(' ', '_')}.csv`, tamanho: 34 * 1024, enviadoEm: new Date(2025, 10, 6, 10, 24), exemplo: true })}
                >
                  ou use o arquivo de exemplo
                </button>
              </motion.div>
            ) : (
              <motion.div key="cheio" className="cr-drop__arquivo" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <motion.span className="cr-drop__ok" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 14 }}>
                  <FileText size={30} />
                </motion.span>
                <div className="cr-drop__info">
                  <strong>{arq.nome}</strong>
                  <span>{tamanhoTexto(arq.tamanho)} • pronto para análise</span>
                  <span className="cr-drop__barra">
                    <motion.i initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 0.7, ease: 'easeOut' }} />
                  </span>
                </div>
                <button className="cr-iconbtn" onClick={() => setArquivo(null)} aria-label="Remover arquivo">
                  <Trash2 size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <input ref={input} type="file" accept=".csv,text/csv" hidden onChange={(e) => receber(e.target.files?.[0])} />
        </motion.div>

        <aside className="cr-lateral">
          <div className="cr-lateral__modelo">
            <span className="cr-lateral__ic">
              <FileText size={22} strokeWidth={1.8} />
            </span>
            <div>
              <h3>Use o modelo de planilha</h3>
              <p>Para garantir uma leitura mais precisa, baixe o modelo oficial e preencha todas as informações do cronograma.</p>
              <Btn
                variante="contorno"
                icone={<Download size={18} />}
                onClick={() => {
                  baixarModelo()
                  toast('Modelo baixado: modelo_cronograma_de_uso.csv')
                }}
              >
                Baixar modelo (.CSV)
              </Btn>
            </div>
          </div>
          <hr />
          <h3>O que acontece depois do envio?</h3>
          <ol className="cr-passos">
            {['Analisamos seu arquivo.', 'Identificamos possíveis inconsistências.', 'Sugerimos ajustes (se necessário).', 'Você revisa e confirma os dados.'].map((t, i) => (
              <motion.li key={t} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.07 }}>
                <span>{i + 1}</span>
                {t}
              </motion.li>
            ))}
          </ol>
        </aside>
      </div>

      <button className="cr-link cr-ajuda" onClick={() => setAjuda((a) => !a)} aria-expanded={ajuda}>
        <Info size={18} /> Quais informações devem constar no arquivo?
        <motion.span animate={{ rotate: ajuda ? 180 : 0 }}>
          <ChevronDown size={18} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {ajuda && (
          <motion.div className="cr-colunas" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            <ul>
              {COLUNAS_CSV.map(([c, d]) => (
                <li key={c}>
                  <code>{c}</code>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="cr-rodape">
        <span />
        <div className="cr-rodape__btns">
          <Btn variante="contorno" onClick={() => ir({ id: 'lista' }, -1)}>
            Cancelar
          </Btn>
          <Btn disabled={!arq} onClick={() => ir({ id: 'analise', escola: w.escola })}>
            Continuar
          </Btn>
        </div>
      </footer>
    </div>
  )
}
