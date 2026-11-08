import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Building2, CalendarDays, Check, GraduationCap, Info, Layers, List, Megaphone, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Etapas4, MesesProg, PlanoCab } from '../components/plano'
import { Btn } from '../components/ui'
import { MESES } from '../data'
import { PERIODO_FIM, brPlano, mesesDe, turmasDaProg } from '../plano'
import { useCron } from '../store'

/** Etapa 4 — Finalizar e publicar */
export default function Finalizar() {
  const { s, setPlano, publicarPlano, ir, setPerfil } = useCron()
  const pl = s.plano!
  const e = pl.escopo
  const pub = pl.publicacao
  const [enviando, setEnviando] = useState(false)
  const [feito, setFeito] = useState<null | 'publicado' | 'agendado'>(null)
  const turmas = useMemo(() => new Set(pl.progs.flatMap((p) => turmasDaProg(p, e).map((t) => t.id))).size, [pl.progs, e])
  const escolas = useMemo(() => new Set(pl.progs.flatMap((p) => turmasDaProg(p, e).map((t) => t.escola))).size, [pl.progs, e])
  const meses = mesesDe(pl.progs).map((m) => Number(m.slice(5, 7)) - 1)
  const faixa = meses.length ? `${cap(MESES[meses[0]])} a ${cap(MESES[meses.at(-1)!])}` : '—'
  const setPub = (p: Partial<typeof pub>) => setPlano((x) => ({ ...x, publicacao: { ...x.publicacao, ...p } }))
  const dataInvalida = !pub.data || pub.data > PERIODO_FIM

  const publicar = () => {
    if (dataInvalida) return
    setEnviando(true)
    window.setTimeout(() => {
      publicarPlano('publicado')
      setEnviando(false)
      setFeito('publicado')
    }, 1300)
  }

  return (
    <div className="pl">
      <PlanoCab titulo="Finalizar e publicar" subtitulo="Confirme as informações do cronograma e defina quando ele ficará disponível para os educadores." img="cab-calendario-ok" />
      <Etapas4 atual={4} />

      <div className="pl-final">
        <motion.section className="cr-cartao pl-final__resumo" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <header className="pl-secao pl-secao--sub">
            <CalendarDays size={30} strokeWidth={1.7} />
            <div>
              <h3>Resumo do cronograma</h3>
              <p>Confira o resumo da sua programação antes de publicar.</p>
            </div>
          </header>
          <div className="pl-final__nums">
            {[
              { I: Building2, v: `${escolas} ${escolas === 1 ? 'escola' : 'escolas'}`, t: 'da rede' },
              { I: Users, v: `${turmas} turmas`, t: 'impactadas' },
              { I: Layers, v: `${meses.length} ${meses.length === 1 ? 'mês' : 'meses'}`, t: 'de programação', tag: faixa },
            ].map(({ I, v, t, tag }, i) => (
              <motion.div key={t} className="pl-final__num" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}>
                <I size={30} strokeWidth={1.6} />
                <span>
                  <strong>{v}</strong>
                  <small>{t}</small>
                  {tag && <em>{tag}</em>}
                </span>
              </motion.div>
            ))}
          </div>
          <MesesProg progs={pl.progs} escopo={e} colunas={{ periodo: false, habilidade: false }} />
        </motion.section>

        <motion.section className="cr-cartao pl-final__pub" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
          <header className="pl-secao pl-secao--sub">
            <Megaphone size={30} strokeWidth={1.7} />
            <div>
              <h3>Publicação do cronograma</h3>
              <p>Defina quando o cronograma será disponibilizado.</p>
            </div>
          </header>

          <div className="pl-bloco">
            <div className="pl-bloco__tit">
              <CalendarDays size={22} />
              <span>
                <strong>
                  Data de publicação <b>*</b>
                </strong>
                <small>A partir desta data, o cronograma ficará visível para os educadores.</small>
              </span>
            </div>
            <span className={`pl-data pl-data--grande ${dataInvalida ? 'is-erro' : ''}`}>
              <CalendarDays size={20} />
              <input type="date" value={pub.data} max={PERIODO_FIM} onChange={(ev) => setPub({ data: ev.target.value })} />
            </span>
            {dataInvalida && <small className="cr-erro">Escolha uma data até o fim do período (31/05/2027).</small>}
          </div>

          <div className="pl-oque">
            <h4>
              <Info size={22} /> O que acontece ao publicar?
            </h4>
            <ul>
              {['O cronograma será disponibilizado para os educadores vinculados.', 'As atividades e avaliações ficarão visíveis nas turmas aplicadas.', 'Você poderá editar e republicar, se necessário.'].map((t, i) => (
                <motion.li key={t} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.07 }}>
                  <Check size={20} strokeWidth={2.6} /> {t}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.section>
      </div>

      <footer className="pl-rodape pl-rodape--linha">
        <Btn variante="contorno" icone={<ArrowLeft size={20} />} onClick={() => ir({ id: 'ajustar' }, -1)}>
          Voltar
        </Btn>
        <Btn icone={enviando ? <span className="cr-spinner cr-spinner--branco" /> : <Check size={20} />} disabled={enviando || dataInvalida} onClick={publicar}>
          {enviando ? 'Publicando…' : 'Publicar cronograma'}
        </Btn>
      </footer>

      <AnimatePresence>
        {feito && (
          <motion.div className="cr-modal cr-sucesso" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Confete />
            <motion.div className="cr-modal__caixa cr-sucesso__caixa" initial={{ scale: 0.8, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
              <motion.img src="./cron/calendario-selo.svg" alt="" className="pl-sucesso__img" initial={{ scale: 0.6, rotate: -6 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 12, delay: 0.1 }} />
              <h2>{feito === 'publicado' ? 'Cronograma publicado!' : 'Publicação agendada!'}</h2>
              <p>
                {feito === 'publicado' ? (
                  <>
                    As <strong>{pl.progs.length} programações</strong> ficam visíveis para os educadores de <strong>{escolas} escolas</strong> e {turmas} turmas a partir de <strong>{brPlano(pub.data)}</strong>.
                  </>
                ) : (
                  <>
                    O cronograma ficará visível para os educadores em <strong>{brPlano(pub.data)}</strong> às <strong>{pub.hora}</strong>.
                  </>
                )}
              </p>
              <div className="cr-sucesso__btns">
                <Btn icone={<CalendarDays size={18} />} onClick={() => ir({ id: 'calendario', escola: e.escolas.find((x) => s.escolas.some((y) => y.id === x)) ?? 'a', dia: pl.progs.map((p) => p.inicio).sort()[0] })}>
                  Ver no calendário escolar
                </Btn>
                {feito === 'publicado' && (
                  <Btn variante="contorno" icone={<GraduationCap size={18} />} onClick={() => setPerfil('professor')}>
                    Ver como o professor recebe
                  </Btn>
                )}
                <Btn variante="fantasma" icone={<List size={18} />} onClick={() => ir({ id: 'lista', aba: 'meus' }, -1)}>
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

const cap = (x: string) => x.charAt(0).toUpperCase() + x.slice(1)

function Confete() {
  const cores = ['#6d28d9', '#a78bfa', '#22a447', '#f59e0b', '#1d6fe0', '#f472b6']
  const pecas = useMemo(
    () => Array.from({ length: 70 }).map((_, i) => ({ i, x: Math.random() * 100, d: Math.random() * 0.6, r: Math.random() * 540 - 270, c: cores[i % cores.length], w: 6 + Math.random() * 7, dur: 1.8 + Math.random() * 1.4 })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  return (
    <div className="cr-confete" aria-hidden>
      {pecas.map((p) => (
        <motion.i key={p.i} style={{ left: `${p.x}%`, background: p.c, width: p.w, height: p.w * 0.45 }} initial={{ y: -40, rotate: 0, opacity: 1 }} animate={{ y: '105vh', rotate: p.r, opacity: [1, 1, 0] }} transition={{ duration: p.dur, delay: p.d, ease: 'easeIn' }} />
      ))}
    </div>
  )
}
