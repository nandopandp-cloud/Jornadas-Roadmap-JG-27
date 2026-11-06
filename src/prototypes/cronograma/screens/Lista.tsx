import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, ChevronLeft, ChevronRight, Download, Eye, MoreVertical, Plus, School, Search, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Btn, Modal, Select, StatusEscola } from '../components/ui'
import { useCron } from '../store'
import type { Escola } from '../data'

export default function Lista({ aba: abaInicial }: { aba?: 'rede' | 'meus' }) {
  const { s, iniciar, continuar, ir, toast } = useCron()
  const [aba, setAba] = useState<'rede' | 'meus'>(abaInicial ?? 'rede')
  const [busca, setBusca] = useState('')
  const [novo, setNovo] = useState(false)
  const [escolhida, setEscolhida] = useState('')

  const base = aba === 'rede' ? s.escolas : s.escolas.filter((e) => e.minha)
  const lista = base.filter((e) => e.nome.toLowerCase().includes(busca.trim().toLowerCase()))
  const semCronograma = s.escolas.filter((e) => e.status === 'nao-iniciado')

  const acao = (e: Escola) => {
    if (e.status === 'publicado') ir({ id: 'calendario', escola: e.id })
    else if (e.status === 'rascunho') continuar(e.id)
    else iniciar(e.id)
  }

  return (
    <div className="cr-lista">
      <header className="cr-cab">
        <span className="cr-cab__icone">
          <CalendarDays size={26} strokeWidth={1.8} />
        </span>
        <div className="cr-cab__txt">
          <h1>Cronograma de Uso</h1>
          <p>Planeje, acompanhe e gerencie o uso da plataforma na sua rede ou escola.</p>
        </div>
        <Btn
          icone={<Plus size={20} />}
          onClick={() => {
            setEscolhida(semCronograma[0]?.id ?? '')
            setNovo(true)
          }}
        >
          Criar novo cronograma
        </Btn>
      </header>

      <div className="cr-abas" role="tablist">
        {(
          [
            ['rede', 'Escolas da sua rede'],
            ['meus', 'Meus cronogramas'],
          ] as const
        ).map(([id, nome]) => (
          <button key={id} role="tab" aria-selected={aba === id} className={aba === id ? 'is-on' : ''} onClick={() => setAba(id)}>
            {nome}
            {aba === id && <motion.span layoutId="cr-aba" className="cr-abas__linha" />}
          </button>
        ))}
      </div>

      <section className="cr-cartao cr-tabela-escolas">
        <div className="cr-tabela-escolas__topo">
          <h2>
            {aba === 'rede' ? 'Escolas da sua rede' : 'Meus cronogramas'} <span>({lista.length})</span>
          </h2>
          <label className="cr-busca">
            <Search size={20} />
            <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Pesquisar por escola..." />
            {busca && (
              <button onClick={() => setBusca('')} aria-label="Limpar busca">
                <X size={16} />
              </button>
            )}
          </label>
        </div>

        <div className="cr-rolagem">
          <table className="cr-tabela">
            <thead>
              <tr>
                <th>Escola</th>
                <th>Período do cronograma</th>
                <th>Última atualização</th>
                <th>Status</th>
                <th aria-label="Ações" />
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {lista.map((e, i) => (
                  <motion.tr
                    key={e.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: Math.min(i, 10) * 0.025 }}
                    className={e.id === 'f' && e.status === 'publicado' ? 'is-novo' : ''}
                  >
                    <td>
                      <span className="cr-escola">
                        <span className="cr-escola__ic">
                          <School size={18} strokeWidth={1.8} />
                        </span>
                        <strong>{e.nome}</strong>
                      </span>
                    </td>
                    <td>{e.periodo ?? '–'}</td>
                    <td>{e.atualizado ?? '–'}</td>
                    <td>
                      <StatusEscola status={e.status} />
                    </td>
                    <td className="cr-tabela__acoes">
                      <Btn variante="contorno" pequeno className="cr-acao" onClick={() => acao(e)}>
                        {e.status === 'publicado' ? 'Abrir' : e.status === 'rascunho' ? 'Continuar' : 'Criar'}
                      </Btn>
                      <MenuEscola
                        escola={e}
                        onCalendario={() => ir({ id: 'calendario', escola: e.id })}
                        onBaixar={() => toast(`Exportando o cronograma da ${e.nome} em CSV…`, 'info')}
                      />
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {lista.length === 0 && (
            <div className="cr-vazio">
              <Search size={28} />
              <p>Nenhuma escola encontrada para “{busca}”.</p>
            </div>
          )}
        </div>

        <footer className="cr-paginacao">
          <span>
            {lista.length ? `1 – ${lista.length} de ${lista.length} itens` : '0 itens'}
          </span>
          <div>
            <button className="cr-pag" disabled aria-label="Página anterior">
              <ChevronLeft size={18} />
            </button>
            <button className="cr-pag is-on">1</button>
            <button className="cr-pag" disabled aria-label="Próxima página">
              <ChevronRight size={18} />
            </button>
          </div>
        </footer>
      </section>

      <Modal
        aberto={novo}
        onFechar={() => setNovo(false)}
        titulo="Criar novo cronograma"
        largura={500}
        rodape={
          <>
            <Btn variante="contorno" onClick={() => setNovo(false)}>
              Cancelar
            </Btn>
            <Btn
              disabled={!escolhida}
              onClick={() => {
                setNovo(false)
                iniciar(escolhida)
              }}
            >
              Continuar
            </Btn>
          </>
        }
      >
        <p className="cr-texto">Para qual escola você quer criar o cronograma de uso?</p>
        {semCronograma.length ? (
          <Select
            className="cr-select--bloco"
            valor={escolhida}
            onChange={setEscolhida}
            opcoes={semCronograma.map((e) => ({ valor: e.id, texto: e.nome, icone: <School size={16} /> }))}
          />
        ) : (
          <p className="cr-texto cr-texto--suave">Todas as escolas da rede já têm cronograma.</p>
        )}
      </Modal>
    </div>
  )
}

function MenuEscola({ escola, onCalendario, onBaixar }: { escola: Escola; onCalendario: () => void; onBaixar: () => void }) {
  const [aberto, setAberto] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!aberto) return
    const fora = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setAberto(false)
    document.addEventListener('mousedown', fora)
    return () => document.removeEventListener('mousedown', fora)
  }, [aberto])
  const tem = escola.status !== 'nao-iniciado'
  return (
    <div className="cr-menu" ref={ref}>
      <button className="cr-iconbtn" onClick={() => setAberto((a) => !a)} aria-label={`Mais ações para ${escola.nome}`}>
        <MoreVertical size={18} />
      </button>
      <AnimatePresence>
        {aberto && (
          <motion.div className="cr-menu__lista" initial={{ opacity: 0, scale: 0.95, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.12 }}>
            <button disabled={!tem} onClick={() => (setAberto(false), onCalendario())}>
              <CalendarDays size={16} /> Ver no calendário
            </button>
            <button disabled={!tem} onClick={() => (setAberto(false), onCalendario())}>
              <Eye size={16} /> Visualizar cronograma
            </button>
            <button disabled={!tem} onClick={() => (setAberto(false), onBaixar())}>
              <Download size={16} /> Exportar CSV
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
