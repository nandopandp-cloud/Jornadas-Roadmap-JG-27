import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Building2, CalendarDays, CheckCircle2, Copy, Layers, Plus, Save, Users } from 'lucide-react'
import { useRef, useState } from 'react'
import { AplicarPara, CamposProg, Etapas4, MesesProg, Num, PlanoCab, useDestaque, validarProg, type ErrosProg } from '../components/plano'
import { Btn, Modal, Select } from '../components/ui'
import { MESES_PLANO, curta, formInicial, nomeMesPlano, novoIdProg, somarMeses, textoAplicacao, turmasDaProg, type Prog } from '../plano'
import { TIPOS } from '../data'
import { useCron } from '../store'

/** Etapa 2 — Configurar programação */
export default function Configurar() {
  const { s, setPlano, ir, toast } = useCron()
  const pl = s.plano!
  const e = pl.escopo
  const vazio = (): Prog => ({ id: '', tipo: 'tarefa', componente: 'Português', unidade: 'Leitura e produção de textos', objeto: 'Produção de texto narrativo', inicio: '', fim: '', anos: [], escolas: e.escolas })
  // primeira visita: formulário já preenchido com a Prova Genial da referência
  const [f, setF] = useState<Prog>(() => (pl.progs.some((p) => p.tipo === 'prova' && p.objeto === 'Água') ? vazio() : formInicial(e.escolas)))
  const [editando, setEditando] = useState<string | null>(null)
  const [tentou, setTentou] = useState(false)
  const [destaque, piscar] = useDestaque()
  const [dupModal, setDupModal] = useState(false)
  const [dupId, setDupId] = useState('')
  const [dupMes, setDupMes] = useState(MESES_PLANO[1])
  const formRef = useRef<HTMLDivElement>(null)
  const listaRef = useRef<HTMLElement>(null)

  const erros: ErrosProg = tentou ? validarProg(f) : {}
  const set = (p: Partial<Prog>) => setF((x) => ({ ...x, ...p }))
  const turmas = turmasDaProg(f, e)
  const nEscolas = new Set(turmas.map((t) => t.escola)).size

  const salvar = () => {
    setTentou(true)
    const errs = validarProg(f)
    if (Object.keys(errs).length) {
      toast('Preencha os campos obrigatórios da programação.', 'erro')
      return
    }
    if (!turmas.length) return toast('Essa combinação não tem turmas no escopo.', 'erro')
    const id = editando ?? novoIdProg()
    setPlano((p) => ({ ...p, progs: editando ? p.progs.map((x) => (x.id === id ? { ...f, id } : x)) : [...p.progs, { ...f, id }] }))
    toast(editando ? 'Programação atualizada.' : `${TIPOS[f.tipo].nome} adicionada para ${turmas.length} turmas.`)
    piscar(id)
    setEditando(null)
    setTentou(false)
    setF(vazio())
    window.setTimeout(() => listaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120)
  }

  const editar = (p: Prog) => {
    setF({ ...p })
    setEditando(p.id)
    setTentou(false)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const duplicar = (p: Prog, mesesDepois = 1) => {
    const ini = somarMeses(p.inicio, mesesDepois)
    const fim = somarMeses(p.fim, mesesDepois)
    const cabe = fim <= '2027-05-31'
    const id = novoIdProg()
    const nova = cabe ? { ...p, id, inicio: ini, fim } : { ...p, id }
    setPlano((pl2) => ({ ...pl2, progs: [...pl2.progs, nova] }))
    piscar(id)
    toast(cabe ? `Duplicada para ${curta(ini)} a ${curta(fim)}.` : 'Programação duplicada no mesmo período.')
  }
  const excluir = (p: Prog) => {
    setPlano((pl2) => ({ ...pl2, progs: pl2.progs.filter((x) => x.id !== p.id) }))
    if (editando === p.id) {
      setEditando(null)
      setF(vazio())
    }
    toast('Programação removida.', 'info', { rotulo: 'Desfazer', fn: () => setPlano((pl2) => ({ ...pl2, progs: [...pl2.progs, p] })) })
  }

  return (
    <div className="pl">
      <PlanoCab titulo="Criar cronograma" subtitulo="Configure as programações de atividades e avaliações e aplique em massa para as turmas selecionadas." img="cab-calendario-foguete" />
      <Etapas4 atual={2} />

      <div className="pl-config" ref={formRef}>
        <motion.section className={`cr-cartao pl-form ${editando ? 'is-editando' : ''}`} layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <header className="pl-secao">
            <CalendarDays size={26} strokeWidth={1.8} />
            <h3>{editando ? 'Editar programação' : 'Nova programação'}</h3>
            {editando && <span className="pl-editando">Editando</span>}
          </header>
          <CamposProg f={f} set={set} erros={erros} />
        </motion.section>

        <motion.section className="cr-cartao pl-alvo" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
          <div className="pl-alvo__esq">
            <header className="pl-secao pl-secao--sub">
              <Users size={26} strokeWidth={1.8} />
              <div>
                <h3>Aplicar para</h3>
                <p>Defina onde essa programação será aplicada.</p>
              </div>
            </header>
            <AplicarPara f={f} set={set} escopo={e} erros={erros} />
          </div>
          <div className="pl-massa">
            <div className="pl-massa__cab">
              <Layers size={26} strokeWidth={1.8} />
              <div>
                <strong>Aplicação em massa</strong>
                <span>Esta programação será criada para</span>
              </div>
            </div>
            <p className="pl-massa__n">
              <Num v={turmas.length} /> turmas
            </p>
            <ul>
              <li>
                <Building2 size={18} /> <Num v={nEscolas} /> escolas
              </li>
              <li>
                <Users size={18} /> <Num v={turmas.length} /> educadores {e.autoVinculo ? '(vinculados)' : '(a vincular)'}
              </li>
              <li>
                <CalendarDays size={18} /> {f.inicio && f.fim ? `${curta(f.inicio)} a ${f.fim.split('-').reverse().join('/')}` : 'Defina as datas'}
              </li>
            </ul>
            <div className={`pl-massa__ok ${e.autoVinculo ? '' : 'is-aviso'}`}>
              <CheckCircle2 size={20} />
              {e.autoVinculo ? 'Os educadores serão vinculados automaticamente conforme a disciplina das turmas.' : 'Vínculo automático desligado: você vinculará os educadores na revisão.'}
            </div>
          </div>
        </motion.section>
      </div>

      <div className="pl-acoes">
        <Btn
          variante="contorno"
          onClick={() => {
            setF(vazio())
            setEditando(null)
            setTentou(false)
          }}
        >
          {editando ? 'Cancelar edição' : 'Cancelar'}
        </Btn>
        <span />
        <Btn icone={editando ? <Save size={20} /> : <Plus size={22} />} className="pl-adicionar" onClick={salvar}>
          {editando ? 'Salvar alterações' : 'Adicionar ao cronograma'}
        </Btn>
      </div>

      <section className="cr-cartao pl-construcao" ref={listaRef}>
        <header>
          <CalendarDays size={24} strokeWidth={1.8} />
          <h3>
            Cronograma em construção <span>({pl.progs.length} {pl.progs.length === 1 ? 'programação' : 'programações'})</span>
          </h3>
          <div className="pl-construcao__btns">
            <Btn
              variante="contorno"
              pequeno
              icone={<Copy size={16} />}
              disabled={!pl.progs.length}
              onClick={() => {
                setDupId(pl.progs[0]?.id ?? '')
                setDupModal(true)
              }}
            >
              Duplicar programação
            </Btn>
          </div>
        </header>
        {pl.progs.length === 0 ? (
          <motion.div className="pl-vazio" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <CalendarDays size={34} strokeWidth={1.5} />
            <strong>Seu cronograma ainda está vazio</strong>
            <span>Preencha a programação acima e clique em “Adicionar ao cronograma”. As atividades aparecem aqui, organizadas por mês.</span>
          </motion.div>
        ) : (
        <MesesProg
          progs={pl.progs}
          escopo={e}
          destaque={destaque}
          acoes={{ editar, duplicar: (p) => duplicar(p), excluir }}
          vazio={<span>Nenhuma programação neste mês.</span>}
        />
        )}
      </section>

      <footer className="pl-rodape pl-rodape--linha">
        <Btn variante="contorno" icone={<ArrowLeft size={20} />} onClick={() => ir({ id: 'escopo' }, -1)}>
          Voltar
        </Btn>
        <Btn
          iconeDir={<ArrowRight size={20} />}
          onClick={() => {
            if (!pl.progs.length) return toast('Adicione pelo menos uma programação ao cronograma.', 'erro')
            ir({ id: 'ajustar' })
          }}
        >
          Revisar e ajustar
        </Btn>
      </footer>


      <Modal
        aberto={dupModal}
        onFechar={() => setDupModal(false)}
        titulo="Duplicar programação"
        largura={540}
        rodape={
          <>
            <Btn variante="contorno" onClick={() => setDupModal(false)}>
              Cancelar
            </Btn>
            <Btn
              icone={<Copy size={18} />}
              onClick={() => {
                const p = pl.progs.find((x) => x.id === dupId)
                if (p) duplicar(p, MESES_PLANO.indexOf(dupMes) - MESES_PLANO.indexOf(p.inicio.slice(0, 7)))
                setDupModal(false)
              }}
            >
              Duplicar
            </Btn>
          </>
        }
      >
        <div className="cr-campo">
          <span>Programação</span>
          <Select className="cr-select--bloco" valor={dupId} onChange={setDupId} opcoes={pl.progs.map((p) => ({ valor: p.id, texto: `${TIPOS[p.tipo].nome} · ${p.objeto} · ${textoAplicacao(p, e)}` }))} />
        </div>
        <div className="cr-campo">
          <span>Copiar para o mês</span>
          <Select className="cr-select--bloco" valor={dupMes} onChange={setDupMes} opcoes={MESES_PLANO.map((m) => ({ valor: m, texto: nomeMesPlano(m) }))} />
        </div>
        <p className="cr-texto cr-texto--suave">As datas são mantidas no mesmo dia do mês escolhido.</p>
      </Modal>
    </div>
  )
}
