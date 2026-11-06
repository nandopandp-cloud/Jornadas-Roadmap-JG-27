import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDownUp, ArrowRight, CalendarDays, CheckCircle2, ChevronDown, ChevronRight, MoreVertical, Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import AtividadeModal from '../components/AtividadeModal'
import { Btn, Checkbox, Etapas, Select, TipoBadge } from '../components/ui'
import { ANOS, COMPONENTES, MESES, TIPOS, TIPO_LISTA, TURMAS, brCurta, capital, parseData, type Atividade, type TipoId } from '../data'
import { TOTAL_OCORRENCIAS, ocorrenciasResolvidas, useCron } from '../store'

type Coluna = 'turmas' | 'educador' | 'componente' | 'unidade' | 'objeto' | 'tipo'
const br = (iso: string) => iso.split('-').reverse().join('/')

export default function Revisar() {
  const { s, ir, salvarAtividade, removerAtividades, toast } = useCron()
  const w = s.wizard!
  const [busca, setBusca] = useState('')
  const [ano, setAno] = useState('todos')
  const [comp, setComp] = useState('todos')
  const [tipo, setTipo] = useState<'todos' | TipoId>('todos')
  const [ordem, setOrdem] = useState<{ col: Coluna; dir: 1 | -1 } | null>(null)
  const [abertos, setAbertos] = useState<Record<string, boolean>>({})
  const [sel, setSel] = useState<string[]>([])
  const [modal, setModal] = useState<{ atividade?: Atividade | null; padrao?: Partial<Atividade> } | null>(null)
  const [destaque, setDestaque] = useState<string | null>(null)
  const corrigidas = ocorrenciasResolvidas(w)

  const filtradas = useMemo(() => {
    const q = busca.trim().toLowerCase()
    return w.atividades.filter(
      (a) =>
        (ano === 'todos' || a.ano === ano) &&
        (comp === 'todos' || a.componente === comp) &&
        (tipo === 'todos' || a.tipo === tipo) &&
        (!q || [a.educador, a.componente, a.unidade, a.objeto, a.tipo ? TIPOS[a.tipo].nome : '', a.turmas.join(' ')].some((t) => t.toLowerCase().includes(q))),
    )
  }, [w.atividades, busca, ano, comp, tipo])

  const grupos = useMemo(() => {
    const m = new Map<string, Atividade[]>()
    const ord = [...filtradas].sort((a, b) => a.inicio.localeCompare(b.inicio) || a.id.localeCompare(b.id, undefined, { numeric: true }))
    for (const a of ord) {
      const k = a.inicio.slice(0, 7)
      m.set(k, [...(m.get(k) ?? []), a])
    }
    const val = (a: Atividade, c: Coluna) => (c === 'turmas' ? a.turmas.join(',') : c === 'tipo' ? (a.tipo ? TIPOS[a.tipo].nome : '') : a[c])
    return [...m.entries()].map(([k, l]) => ({ k, l: ordem ? [...l].sort((x, y) => val(x, ordem.col).localeCompare(val(y, ordem.col)) * ordem.dir) : l }))
  }, [filtradas, ordem])

  // primeiro mês aberto por padrão; com busca/filtros, abre todos
  const filtrando = !!busca || ano !== 'todos' || comp !== 'todos' || tipo !== 'todos'
  const aberto = (k: string, i: number) => abertos[k] ?? (filtrando || i === 0)
  useEffect(() => setSel([]), [busca, ano, comp, tipo])

  const piscar = (id: string) => {
    setDestaque(id)
    window.setTimeout(() => setDestaque(null), 1600)
  }

  const excluir = (ids: string[]) => {
    const desfazer = removerAtividades(ids)
    setSel((x) => x.filter((i) => !ids.includes(i)))
    toast(ids.length > 1 ? `${ids.length} atividades removidas.` : 'Atividade removida.', 'info', { rotulo: 'Desfazer', fn: desfazer })
  }

  const ordenar = (col: Coluna) => setOrdem((o) => (o?.col === col ? (o.dir === 1 ? { col, dir: -1 } : null) : { col, dir: 1 }))
  const Th = ({ col, children }: { col: Coluna; children: React.ReactNode }) => (
    <th>
      <button className={`cr-th ${ordem?.col === col ? 'is-on' : ''}`} onClick={() => ordenar(col)}>
        {children}
        <ArrowDownUp size={13} style={ordem?.col === col && ordem.dir === -1 ? { transform: 'scaleY(-1)' } : undefined} />
      </button>
    </th>
  )

  return (
    <div className="cr-wizard cr-wizard--largo">
      <Etapas atual={2} progresso={0.75} />

      <header className="cr-titulo cr-titulo--linha">
        <div>
          <h1>Revise o cronograma importado</h1>
          <p>Confira os registros do cronograma, faça ajustes se necessário e adicione novas atividades antes de publicar.</p>
        </div>
        <motion.span className="cr-selo-ok" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
          <CheckCircle2 size={20} /> {corrigidas || TOTAL_OCORRENCIAS} inconsistências corrigidas
        </motion.span>
      </header>

      <div className="cr-filtros">
        <label className="cr-busca cr-busca--filtro">
          <Search size={20} />
          <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por conteúdo, atividade, educador..." />
          {busca && (
            <button onClick={() => setBusca('')} aria-label="Limpar busca">
              <X size={16} />
            </button>
          )}
        </label>
        <Select rotulo="Ano escolar:" valor={ano} onChange={setAno} opcoes={[{ valor: 'todos', texto: 'Todos' }, ...ANOS.map((a) => ({ valor: a, texto: a }))]} />
        <Select rotulo="Componente:" valor={comp} onChange={setComp} opcoes={[{ valor: 'todos', texto: 'Todos' }, ...COMPONENTES.map((c) => ({ valor: c, texto: c }))]} />
        <Select
          rotulo="Tipo de atividade:"
          valor={tipo}
          onChange={setTipo}
          opcoes={[{ valor: 'todos' as const, texto: 'Todos' }, ...TIPO_LISTA.map((t) => ({ valor: t, texto: TIPOS[t].nome }))]}
        />
        <Btn variante="contorno" icone={<Plus size={20} />} onClick={() => setModal({ atividade: null })}>
          Nova atividade
        </Btn>
      </div>

      <AnimatePresence>
        {sel.length > 0 && (
          <motion.div className="cr-massa" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <strong>{sel.length}</strong> {sel.length > 1 ? 'atividades selecionadas' : 'atividade selecionada'}
            <Btn variante="perigo" pequeno icone={<Trash2 size={16} />} onClick={() => excluir(sel)}>
              Excluir
            </Btn>
            <Btn variante="fantasma" pequeno onClick={() => setSel([])}>
              Limpar seleção
            </Btn>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="cr-rolagem cr-revisao">
        <table className="cr-tabela cr-tabela--cron">
          <thead>
            <tr>
              <th className="cr-col-check">
                <Checkbox
                  checked={sel.length > 0 && sel.length === filtradas.length}
                  indeterminado={sel.length > 0 && sel.length < filtradas.length}
                  rotulo="Selecionar todas"
                  onChange={(v) => setSel(v ? filtradas.map((a) => a.id) : [])}
                />
              </th>
              <th>Início</th>
              <th>Término</th>
              <th>Ano da turma</th>
              <Th col="turmas">Turma</Th>
              <Th col="educador">Educador(a)</Th>
              <Th col="componente">Componente</Th>
              <Th col="unidade">Unidade temática</Th>
              <Th col="objeto">Objeto de conhecimento</Th>
              <Th col="tipo">Atividade na plataforma</Th>
              <th aria-label="Ações" />
            </tr>
          </thead>
          {grupos.map(({ k, l }, i) => {
            const d = parseData(`${k}-01`)
            const nomeMes = `${capital(MESES[d.getMonth()])} de ${d.getFullYear()}`
            const open = aberto(k, i)
            return (
              <tbody key={k} className="cr-mes">
                <tr className="cr-mes__cab" onClick={() => setAbertos((x) => ({ ...x, [k]: !open }))}>
                  <td colSpan={11}>
                    <div className="cr-mes__linha">
                      <motion.span animate={{ rotate: open ? 90 : 0 }} className="cr-mes__seta">
                        <ChevronRight size={20} />
                      </motion.span>
                      <CalendarDays size={20} className="cr-mes__ic" />
                      <strong>{nomeMes}</strong>
                      <span>({l.length} {l.length > 1 ? 'atividades' : 'atividade'})</span>
                      <MenuMes
                        onAdicionar={() => setModal({ padrao: { inicio: `${k}-06`, fim: `${k}-20` } })}
                        onSelecionar={() => setSel((x) => [...new Set([...x, ...l.map((a) => a.id)])])}
                      />
                    </div>
                  </td>
                </tr>
                {open &&
                  l.map((a) => (
                    <Linha
                      key={a.id}
                      a={a}
                      sel={sel.includes(a.id)}
                      destaque={destaque === a.id}
                      onSel={(v) => setSel((x) => (v ? [...x, a.id] : x.filter((i) => i !== a.id)))}
                      onEditar={() => setModal({ atividade: a })}
                      onExcluir={() => excluir([a.id])}
                      onAno={(novo) => {
                        salvarAtividade({ ...a, ano: novo, turmas: [TURMAS[novo][0]] }, 'wizard')
                        piscar(a.id)
                        toast(`Ano alterado para ${novo}. Confira as turmas.`, 'info')
                      }}
                    />
                  ))}
                {open && (
                  <tr className="cr-mes__add">
                    <td colSpan={11}>
                      <button className="cr-link" onClick={() => setModal({ padrao: { inicio: `${k}-06`, fim: `${k}-20` } })}>
                        <Plus size={18} /> Adicionar atividade em {MESES[d.getMonth()]}
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            )
          })}
        </table>
        {grupos.length === 0 && (
          <div className="cr-vazio">
            <Search size={28} />
            <p>Nenhuma atividade encontrada com esses filtros.</p>
            <Btn
              variante="contorno"
              pequeno
              onClick={() => {
                setBusca('')
                setAno('todos')
                setComp('todos')
                setTipo('todos')
              }}
            >
              Limpar filtros
            </Btn>
          </div>
        )}
      </div>

      <footer className="cr-rodape">
        <span className="cr-rodape__status">
          <motion.b key={w.atividades.length} initial={{ scale: 1.3 }} animate={{ scale: 1 }}>
            {w.atividades.length}
          </motion.b>
          &nbsp;atividades no cronograma
        </span>
        <div className="cr-rodape__btns">
          <Btn variante="contorno" onClick={() => ir({ id: 'inconsistencias', escola: w.escola }, -1)}>
            Voltar
          </Btn>
          <Btn iconeDir={<ArrowRight size={20} />} disabled={!w.atividades.length} onClick={() => ir({ id: 'publicar', escola: w.escola })}>
            Finalizar e publicar
          </Btn>
        </div>
      </footer>

      <AtividadeModal
        aberto={!!modal}
        atividade={modal?.atividade}
        padrao={modal?.padrao}
        onFechar={() => setModal(null)}
        onSalvar={(a) => {
          const nova = !modal?.atividade
          salvarAtividade(a, 'wizard')
          setModal(null)
          const k = a.inicio.slice(0, 7)
          setAbertos((x) => ({ ...x, [k]: true }))
          piscar(a.id)
          toast(nova ? `Atividade adicionada em ${brCurta(a.inicio)}.` : 'Alterações salvas.')
        }}
      />
    </div>
  )
}

function Linha({
  a,
  sel,
  destaque,
  onSel,
  onEditar,
  onExcluir,
  onAno,
}: {
  a: Atividade
  sel: boolean
  destaque: boolean
  onSel: (v: boolean) => void
  onEditar: () => void
  onExcluir: () => void
  onAno: (ano: string) => void
}) {
  const extra = a.turmas.length - 2
  return (
    <motion.tr
      layout="position"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className={`cr-linha ${sel ? 'is-sel' : ''} ${destaque ? 'is-destaque' : ''}`}
    >
      <td className="cr-col-check">
        <Checkbox checked={sel} onChange={onSel} rotulo="Selecionar atividade" />
      </td>
      <td>{br(a.inicio)}</td>
      <td>{br(a.fim)}</td>
      <td>
        <AnoChip ano={a.ano} onChange={onAno} />
      </td>
      <td>
        <span className="cr-turmas" title={a.turmas.join(', ')}>
          <span className="cr-turma">{a.turmas.slice(0, 2).join(', ')}</span>
          {extra > 0 && <span className="cr-turma cr-turma--mais">+{extra}</span>}
        </span>
      </td>
      <td>{a.educador}</td>
      <td>{a.componente}</td>
      <td>{a.unidade}</td>
      <td>{a.objeto}</td>
      <td>
        <TipoBadge tipo={a.tipo} />
      </td>
      <td className="cr-tabela__acoes">
        <button className="cr-iconbtn" onClick={onEditar} aria-label="Editar atividade">
          <Pencil size={18} />
        </button>
        <button className="cr-iconbtn cr-iconbtn--perigo" onClick={onExcluir} aria-label="Excluir atividade">
          <Trash2 size={18} />
        </button>
      </td>
    </motion.tr>
  )
}

function AnoChip({ ano, onChange }: { ano: string; onChange: (a: string) => void }) {
  const [aberto, setAberto] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!aberto) return
    const fora = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setAberto(false)
    document.addEventListener('mousedown', fora)
    return () => document.removeEventListener('mousedown', fora)
  }, [aberto])
  return (
    <span className="cr-anochip" ref={ref}>
      <button className="cr-ano" onClick={() => setAberto((x) => !x)}>
        {ano}
      </button>
      <button className="cr-anochip__seta" onClick={() => setAberto((x) => !x)} aria-label="Trocar ano">
        <ChevronDown size={16} />
      </button>
      <AnimatePresence>
        {aberto && (
          <motion.div className="cr-menu__lista cr-menu__lista--esq" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {ANOS.map((x) => (
              <button
                key={x}
                className={x === ano ? 'is-on' : ''}
                onClick={() => {
                  setAberto(false)
                  if (x !== ano) onChange(x)
                }}
              >
                {x}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  )
}

function MenuMes({ onAdicionar, onSelecionar }: { onAdicionar: () => void; onSelecionar: () => void }) {
  const [aberto, setAberto] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!aberto) return
    const fora = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setAberto(false)
    document.addEventListener('mousedown', fora)
    return () => document.removeEventListener('mousedown', fora)
  }, [aberto])
  return (
    <div className="cr-menu cr-mes__menu" ref={ref} onClick={(e) => e.stopPropagation()}>
      <button className="cr-iconbtn" onClick={() => setAberto((x) => !x)} aria-label="Mais ações do mês">
        <MoreVertical size={18} />
      </button>
      <AnimatePresence>
        {aberto && (
          <motion.div className="cr-menu__lista" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <button onClick={() => (setAberto(false), onAdicionar())}>
              <Plus size={16} /> Adicionar atividade
            </button>
            <button onClick={() => (setAberto(false), onSelecionar())}>
              <CheckCircle2 size={16} /> Selecionar todas do mês
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
