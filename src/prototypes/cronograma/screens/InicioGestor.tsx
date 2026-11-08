import { motion } from 'framer-motion'
import { ArrowRight, CalendarDays, CheckCircle2, Clock, Pencil } from 'lucide-react'
import { Btn } from '../components/ui'
import { useCron } from '../store'

/** Início do gestor: visão rápida dos cronogramas da rede */
export default function InicioGestor() {
  const { s, ir } = useCron()
  const n = (st: string) => s.escolas.filter((e) => e.status === st).length
  const cards = [
    { I: CheckCircle2, cor: '#15803d', fundo: '#e0f5e6', v: n('publicado'), t: 'Escolas com cronograma publicado' },
    { I: Pencil, cor: '#b7791f', fundo: '#fff4d6', v: n('rascunho'), t: 'Cronogramas em rascunho' },
    { I: Clock, cor: '#6b6485', fundo: '#efedf5', v: n('nao-iniciado'), t: 'Escolas sem cronograma' },
  ]
  return (
    <div className="cr-gestor">
      <header className="cr-prof__ola">
        <h1>
          Olá, <em>Gestor!</em>
        </h1>
        <p>Acompanhe o planejamento de uso da plataforma nas escolas da sua rede.</p>
      </header>
      <div className="cr-gestor__cards">
        {cards.map(({ I, cor, fundo, v, t }, i) => (
          <motion.div key={t} className="cr-cartao cr-gestor__card" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <span className="cr-circulo" style={{ color: cor, background: fundo }}>
              <I size={24} />
            </span>
            <strong>{v}</strong>
            <span>{t}</span>
          </motion.div>
        ))}
      </div>
      <motion.section className="cr-banner cr-banner--gestor" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="cr-banner__txt">
          <span className="cr-banner__tag">Cronograma de Uso</span>
          <h2>Planeje o ano letivo de cada escola em minutos</h2>
          <p>Importe a planilha, deixe a plataforma corrigir as inconsistências e publique para os professores.</p>
          <div className="cr-banner__btns">
            <Btn className="cr-btn--claro" iconeDir={<ArrowRight size={18} />} onClick={() => ir({ id: 'lista' })}>
              Ver cronogramas
            </Btn>
            <Btn variante="fantasma" className="cr-btn--claro2" icone={<CalendarDays size={18} />} onClick={() => ir({ id: 'calendario', escola: 'f' })}>
              Calendário escolar
            </Btn>
          </div>
        </div>
        <img className="cr-banner__img" src="./cron/banner-foguete.svg" alt="" />
      </motion.section>
    </div>
  )
}
