import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Bell, CalendarDays, Check, FileText, GraduationCap, List, Save, School, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Btn, Etapas, IlustraCalendarioOk, TipoIcone } from '../components/ui'
import { TIPOS, TIPO_LISTA } from '../data'
import { nomeEscola, nomesEscolas, periodoDe, useCron } from '../store'

export default function Publicar() {
  const { s, ir, publicar, setPerfil, toast } = useCron()
  const w = s.wizard!
  const escola = nomeEscola(s.escolas, w.escola)
  // a planilha pode trazer várias escolas
  const varias = w.escolas.length > 1
  const nomes = varias ? nomesEscolas(s.escolas, w.escolas) : escola
  const [publicando, setPublicando] = useState(false)
  const [feito, setFeito] = useState(false)
  const porTipo = useMemo(() => TIPO_LISTA.map((t) => ({ t, n: w.atividades.filter((a) => a.tipo === t).length })), [w.atividades])
  const semTipo = w.atividades.filter((a) => !a.tipo).length
  const pronto = semTipo === 0

  const publicarAgora = () => {
    setPublicando(true)
    window.setTimeout(() => {
      publicar(false)
      setPublicando(false)
      setFeito(true)
    }, 1300)
  }

  return (
    <div className="cr-wizard">
      <Etapas atual={3} progresso={feito ? 1 : 0.5} />
      <header className="cr-titulo">
        <h1>Finalize e publique o cronograma</h1>
        <p>
          Confira o resumo do planejamento {varias ? `das ${w.escolas.length} escolas da planilha` : `da ${escola}`}. Ao publicar, os eventos serão disponibilizados no calendário e as recomendações de atividades serão enviadas aos professores.
        </p>
      </header>

      <div className="cr-publicar">
        <section className="cr-cartao cr-resumo-final">
          <header className="cr-resumo-final__escola">
            <span className="cr-resumo-final__ic">
              <School size={30} strokeWidth={1.6} />
            </span>
            <div>
              <h2>{varias ? `${w.escolas.length} escolas` : escola}</h2>
              <p>{varias ? nomes : 'Rede Municipal de Ensino'}</p>
            </div>
            <span className="cr-tag">{varias ? 'Novos cronogramas' : 'Novo cronograma'}</span>
          </header>
          <div className="cr-resumo-final__dados">
            <div>
              <span className="cr-circulo">
                <CalendarDays size={24} strokeWidth={1.8} />
              </span>
              <span>
                <small>Período do planejamento</small>
                <strong>{periodoDe(w.atividades) ?? '—'}</strong>
              </span>
            </div>
            <div>
              <span className="cr-circulo">
                <FileText size={24} strokeWidth={1.8} />
              </span>
              <span>
                <small>Total de atividades</small>
                <strong>{w.atividades.length} registros</strong>
              </span>
            </div>
          </div>
          <h3>Atividades por tipo</h3>
          <div className="cr-portipo">
            {porTipo.map(({ t, n }, i) => (
              <motion.div key={t} className="cr-portipo__card" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }} whileHover={{ y: -3 }}>
                <TipoIcone tipo={t} tamanho={40} quadrado />
                <motion.strong key={n} initial={{ scale: 1.4 }} animate={{ scale: 1 }}>
                  {n}
                </motion.strong>
                <span>{TIPOS[t].plural}</span>
              </motion.div>
            ))}
          </div>
          <div className={`cr-aviso ${pronto ? 'cr-aviso--ok' : 'cr-aviso--erro'}`}>
            <span className="cr-aviso__ic">
              <Check size={20} strokeWidth={3} />
            </span>
            <span>
              <strong>{pronto ? 'Tudo pronto para publicar!' : 'Ainda há atividades sem tipo'}</strong>
              <small>{pronto ? 'Todos os dados foram validados e as inconsistências foram corrigidas.' : `${semTipo} atividade(s) sem “Atividade na plataforma”. Volte para a revisão e ajuste.`}</small>
            </span>
          </div>
        </section>

        <aside className="cr-oque">
          <motion.div className="cr-oque__ilustra" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <IlustraCalendarioOk />
          </motion.div>
          <h2>Ao publicar, o que acontece?</h2>
          <ul>
            {[
              { I: CalendarDays, t: 'O cronograma ficará disponível na tabela e no calendário escolar.' },
              { I: Users, t: 'Os professores vinculados receberão recomendações de atividades e avaliações.' },
              { I: Bell, t: 'Você poderá editar o cronograma sempre que precisar, mantendo o histórico de versões.' },
            ].map(({ I, t }, i) => (
              <motion.li key={t} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.08 }}>
                <span className="cr-circulo cr-circulo--sm">
                  <I size={20} strokeWidth={1.8} />
                </span>
                {t}
              </motion.li>
            ))}
          </ul>
        </aside>
      </div>

      <footer className="cr-rodape">
        <button className="cr-link cr-link--forte" onClick={() => ir({ id: 'revisar', escola: w.escola }, -1)}>
          <ArrowLeft size={20} /> Voltar para revisão
        </button>
        <div className="cr-rodape__btns">
          <Btn
            variante="contorno"
            icone={<Save size={18} />}
            onClick={() => {
              publicar(true)
              toast(varias ? `Rascunho salvo para ${nomes}.` : `Rascunho da ${escola} salvo.`)
              ir({ id: 'lista' }, -1)
            }}
          >
            Salvar como rascunho
          </Btn>
          <Btn icone={publicando ? <span className="cr-spinner cr-spinner--branco" /> : <Check size={20} />} disabled={!pronto || publicando} onClick={publicarAgora}>
            {publicando ? 'Publicando…' : 'Publicar cronograma'}
          </Btn>
        </div>
      </footer>

      <AnimatePresence>
        {feito && (
          <motion.div className="cr-modal cr-sucesso" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Confete />
            <motion.div className="cr-modal__caixa cr-sucesso__caixa" initial={{ scale: 0.8, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
              <motion.span className="cr-sucesso__check" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 12 }}>
                <svg viewBox="0 0 52 52">
                  <motion.path d="M14 27l8 8 16-18" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4, duration: 0.4 }} />
                </svg>
              </motion.span>
              <h2>{varias ? 'Cronogramas publicados!' : 'Cronograma publicado!'}</h2>
              <p>
                {varias ? 'Os cronogramas de ' : 'O cronograma da '}
                <strong>{nomes}</strong> {varias ? 'já estão' : 'já está'} no calendário escolar e os professores receberam {w.atividades.length * Math.max(1, w.escolas.length)} recomendações de atividades e
                avaliações.
              </p>
              <div className="cr-sucesso__btns">
                <Btn icone={<CalendarDays size={18} />} onClick={() => ir({ id: 'calendario', escola: w.escola, dia: '2025-11-06' })}>
                  Ver no calendário escolar
                </Btn>
                <Btn variante="contorno" icone={<GraduationCap size={18} />} onClick={() => setPerfil('professor')}>
                  Ver como o professor recebe
                </Btn>
                <Btn variante="fantasma" icone={<List size={18} />} onClick={() => ir({ id: 'lista' }, -1)}>
                  Voltar para cronogramas
                </Btn>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/** confete leve de comemoração */
function Confete() {
  const cores = ['#6d28d9', '#a78bfa', '#22a447', '#f59e0b', '#1d6fe0', '#f472b6']
  const pecas = useMemo(
    () =>
      Array.from({ length: 70 }).map((_, i) => ({
        i,
        x: Math.random() * 100,
        d: Math.random() * 0.6,
        r: Math.random() * 540 - 270,
        c: cores[i % cores.length],
        w: 6 + Math.random() * 7,
        dur: 1.8 + Math.random() * 1.4,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  return (
    <div className="cr-confete" aria-hidden>
      {pecas.map((p) => (
        <motion.i
          key={p.i}
          style={{ left: `${p.x}%`, background: p.c, width: p.w, height: p.w * 0.45 }}
          initial={{ y: -40, rotate: 0, opacity: 1 }}
          animate={{ y: '105vh', rotate: p.r, opacity: [1, 1, 0] }}
          transition={{ duration: p.dur, delay: p.d, ease: 'easeIn' }}
        />
      ))}
    </div>
  )
}
