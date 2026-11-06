import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Building2, CalendarDays, ChevronDown, GraduationCap, Info, LayoutList, Layers, Sparkles, UserRound, Users } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Etapas4, PlanoCab } from '../components/plano'
import { Btn, Checkbox, Modal } from '../components/ui'
import { ANOS_ESCOPO, REDE, TURMAS_REDE, nomeRede, turmasDoEscopo, type Escopo as EscopoT } from '../plano'
import { useCron } from '../store'

/** Etapa 1 — Definir escopo */
export default function Escopo() {
  const { s, setPlano, ir, toast } = useCron()
  const e = s.plano!.escopo
  const [verTurmas, setVerTurmas] = useState(false)
  const [tentou, setTentou] = useState(false)
  const turmas = turmasDoEscopo(e)
  const set = (p: Partial<EscopoT>) => setPlano((pl) => {
    const escopo = { ...pl.escopo, ...p }
    // programações acompanham o escopo (remove escolas/anos que saíram)
    const progs = pl.progs.map((g) => ({ ...g, escolas: g.escolas.filter((x) => escopo.escolas.includes(x)), anos: g.anos.filter((x) => escopo.anos.includes(x)) }))
    return { ...pl, escopo, progs }
  })
  const toggle = (l: string[], v: string) => (l.includes(v) ? l.filter((x) => x !== v) : [...l, v])
  const todas = e.escolas.length === REDE.length
  const erro = !e.escolas.length ? 'Escolha pelo menos uma escola.' : !e.anos.length ? 'Escolha pelo menos um ano escolar.' : !turmas.length ? 'Nenhuma turma encontrada para essa combinação.' : null

  return (
    <div className="pl">
      <PlanoCab titulo="Criar cronograma" subtitulo="Escolha como deseja montar o planejamento da sua rede." img="cab-calendario-foguete" />
      <Etapas4 atual={1} />

      <header className="pl-titulo">
        <h2>Defina o escopo do planejamento</h2>
        <p>Selecione onde o cronograma será aplicado. Usaremos os dados da sua rede para sugerir as turmas, educadores e componentes.</p>
      </header>

      <div className="pl-escopo">
        <Cartao icone={<Building2 size={26} strokeWidth={1.7} />} titulo="Escolas" texto="Escolha as escolas que farão parte do cronograma." acao={<Multi rotulo={`${e.escolas.length} selecionada${e.escolas.length === 1 ? '' : 's'}`} itens={REDE.map((x) => ({ id: x.id, nome: x.nome }))} sel={e.escolas} onToggle={(id) => set({ escolas: toggle(e.escolas, id) })} />} i={0}>
          <label className="pl-linha">
            <Checkbox checked={todas} indeterminado={!todas && e.escolas.length > 0} onChange={(v) => set({ escolas: v ? REDE.map((x) => x.id) : [] })} rotulo="Selecionar todas as escolas da rede" />
            <span>
              <strong>Selecionar todas as escolas da rede</strong>
              <small>
                <motion.b key={e.escolas.length} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {e.escolas.length}
                </motion.b>{' '}
                {e.escolas.length === 1 ? `escola selecionada (${nomeRede(e.escolas[0])})` : 'escolas selecionadas.'}
              </small>
            </span>
          </label>
        </Cartao>

        <Cartao icone={<GraduationCap size={26} strokeWidth={1.7} />} titulo="Anos escolares" texto="Defina os anos que serão contemplados." acao={<Multi rotulo={`${e.anos.length} selecionado${e.anos.length === 1 ? '' : 's'}`} itens={ANOS_ESCOPO.map((a) => ({ id: a, nome: a }))} sel={e.anos} onToggle={(id) => set({ anos: toggle(e.anos, id) })} />} i={1}>
          <div className="pl-anos">
            {ANOS_ESCOPO.map((a) => (
              <label key={a} className="pl-ano">
                <Checkbox checked={e.anos.includes(a)} onChange={() => set({ anos: toggle(e.anos, a) })} rotulo={a} />
                {a}
              </label>
            ))}
          </div>
        </Cartao>

        <Cartao
          icone={<Users size={26} strokeWidth={1.7} />}
          titulo="Turmas"
          texto="As turmas são carregadas automaticamente conforme as escolas e os anos selecionados."
          acao={
            <button className="pl-drop" onClick={() => setVerTurmas(true)}>
              {turmas.length} turmas <ChevronDown size={16} />
            </button>
          }
          i={2}
        >
          <div className="pl-info">
            <Info size={22} />
            <span>
              <strong>
                <motion.span key={turmas.length} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'inline-block' }}>
                  {turmas.length}
                </motion.span>{' '}
                turmas encontradas
              </strong>
              <small>
                {e.turmasExcluidas.length ? `${e.turmasExcluidas.length} turma(s) removida(s) da seleção.` : 'As turmas já estão pré-selecionadas. Você pode ajustar a seleção, se necessário.'}
              </small>
            </span>
            <button className="cr-link pl-info__link" onClick={() => setVerTurmas(true)}>
              Ver turmas
            </button>
          </div>
        </Cartao>

        <Cartao icone={<UserRound size={26} strokeWidth={1.7} />} titulo="Educadores" texto="Vincule os educadores às turmas e componentes." i={3}>
          <label className="pl-linha pl-linha--switch">
            <button
              type="button"
              role="switch"
              aria-checked={e.autoVinculo}
              className={`pl-switch ${e.autoVinculo ? 'is-on' : ''}`}
              onClick={() => {
                set({ autoVinculo: !e.autoVinculo })
                if (e.autoVinculo) toast('Sem o vínculo automático, você vinculará os educadores na revisão.', 'info')
              }}
            >
              <motion.i layout transition={{ type: 'spring', stiffness: 600, damping: 32 }} />
            </button>
            <span>
              <strong>
                Vincular educadores automaticamente <Info size={17} className="pl-dica" />
              </strong>
              <small>Usaremos os vínculos existentes na sua rede (turma, componente e carga horária).</small>
            </span>
          </label>
        </Cartao>
      </div>

      <motion.section className="pl-depois" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <h3>
          <Sparkles size={26} /> O que acontece depois?
        </h3>
        {[
          { I: CalendarDays, t: 'Você definirá as programações (atividades, avaliações, conteúdos e datas).' },
          { I: Layers, t: 'Poderá aplicar em massa para todas as turmas selecionadas.' },
          { I: LayoutList, t: 'Depois, revisará as informações em uma tabela, com a opção de ajustes e personalizações.' },
        ].map(({ I, t }) => (
          <div key={t} className="pl-depois__item">
            <I size={28} strokeWidth={1.6} />
            <span>{t}</span>
          </div>
        ))}
      </motion.section>

      <AnimatePresence>{tentou && erro && <motion.p className="pl-erro" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{erro}</motion.p>}</AnimatePresence>

      <footer className="pl-rodape">
        <button className="cr-link pl-rodape__cancelar" onClick={() => ir({ id: 'escolha' }, -1)}>
          Cancelar
        </button>
        <Btn
          iconeDir={<ArrowRight size={20} />}
          onClick={() => {
            setTentou(true)
            if (erro) return toast(erro, 'erro')
            ir({ id: 'configurar' })
          }}
        >
          Continuar
        </Btn>
      </footer>

      <Modal aberto={verTurmas} onFechar={() => setVerTurmas(false)} titulo={`Turmas do escopo (${turmas.length})`} largura={640} rodape={<Btn onClick={() => setVerTurmas(false)}>Pronto</Btn>}>
        <p className="cr-texto cr-texto--suave">Desmarque as turmas que não devem receber o cronograma.</p>
        <div className="pl-turmas">
          {ANOS_ESCOPO.filter((a) => e.anos.includes(a)).map((a) => {
            const ts = TURMAS_REDE.filter((t) => t.ano === a && e.escolas.includes(t.escola))
            if (!ts.length) return null
            return (
              <section key={a}>
                <h4>
                  {a} <span>{ts.filter((t) => !e.turmasExcluidas.includes(t.id)).length} de {ts.length}</span>
                </h4>
                <div className="pl-turmas__grade">
                  {ts.map((t) => {
                    const on = !e.turmasExcluidas.includes(t.id)
                    return (
                      <label key={t.id} className={`pl-turma ${on ? 'is-on' : ''}`}>
                        <Checkbox checked={on} onChange={() => set({ turmasExcluidas: toggle(e.turmasExcluidas, t.id) })} rotulo={`Turma ${t.nome}`} />
                        <span>
                          <strong>{t.nome}</strong>
                          <small>{nomeRede(t.escola)}</small>
                        </span>
                      </label>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      </Modal>
    </div>
  )
}

function Cartao({ icone, titulo, texto, acao, children, i }: { icone: ReactNode; titulo: string; texto: string; acao?: ReactNode; children: ReactNode; i: number }) {
  return (
    <motion.section className="cr-cartao pl-cartao" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 24, delay: 0.08 + i * 0.06 }}>
      <header>
        <span className="pl-cartao__ic">{icone}</span>
        <div>
          <h3>{titulo}</h3>
          <p>{texto}</p>
        </div>
        {acao}
      </header>
      <div className="pl-cartao__corpo">{children}</div>
    </motion.section>
  )
}

/** botão “N selecionadas ▾” com lista de seleção */
function Multi({ rotulo, itens, sel, onToggle }: { rotulo: string; itens: { id: string; nome: string }[]; sel: string[]; onToggle: (id: string) => void }) {
  const [aberto, setAberto] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!aberto) return
    const fora = (ev: MouseEvent) => !ref.current?.contains(ev.target as Node) && setAberto(false)
    document.addEventListener('mousedown', fora)
    return () => document.removeEventListener('mousedown', fora)
  }, [aberto])
  return (
    <div className="pl-multi" ref={ref}>
      <button className="pl-drop" onClick={() => setAberto((a) => !a)} aria-expanded={aberto}>
        {rotulo}
        <motion.span animate={{ rotate: aberto ? 180 : 0 }} style={{ display: 'inline-flex' }}>
          <ChevronDown size={16} />
        </motion.span>
      </button>
      <AnimatePresence>
        {aberto && (
          <motion.ul className="cr-select__lista pl-multi__lista" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.14 }}>
            {itens.map((it) => (
              <li key={it.id}>
                <label className="pl-multi__item">
                  <Checkbox checked={sel.includes(it.id)} onChange={() => onToggle(it.id)} rotulo={it.nome} />
                  {it.nome}
                </label>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
