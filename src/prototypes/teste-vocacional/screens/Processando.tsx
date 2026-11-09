import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, BarChart3, BriefcaseBusiness, Check, Compass, FileText, Lightbulb, LoaderCircle, LogOut, Signpost, Target } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Barra, Btn, Etiqueta } from '../components/ui'
import { N_ITENS } from '../instrumento'
import { useTv } from '../store'

const ETAPAS = [
  { nome: 'Seus interesses', sub: '30 perguntas' },
  { nome: 'Seus valores', sub: '8 perguntas' },
  { nome: 'Preferências', sub: '6 perguntas' },
  { nome: 'Suas habilidades', sub: '8 perguntas' },
]

/** Você concluiu o teste! (Frame 6 · PRD §5.5): processamento com estado compreensível */
export default function Processando() {
  const { concluir, ir, toast } = useTv()
  const [passo, setPasso] = useState(0)
  const [pronto, setPronto] = useState(false)
  const feito = useRef(false)
  const passos = [
    { I: BarChart3, cor: 'roxo', t: 'Vamos analisar seus interesses', d: 'Identificando as áreas que mais combinam com você.' },
    { I: Lightbulb, cor: 'amarelo', t: 'Selecionar profissões compatíveis', d: 'Com base no seu perfil e nas suas preferências.' },
    { I: Compass, cor: 'roxo', t: 'Montar seu relatório personalizado', d: 'Com recomendações e próximos passos.' },
  ]

  useEffect(() => {
    const ts = passos.map((_, i) => window.setTimeout(() => setPasso(i + 1), 1100 * (i + 1)))
    const fim = window.setTimeout(() => {
      if (feito.current) return
      feito.current = true
      const res = concluir()
      if (!res) {
        toast('Ainda faltam respostas para gerar seu perfil.', 'erro')
        return ir({ id: 'revisao' }, -1)
      }
      setPronto(true)
    }, 1100 * passos.length + 300)
    return () => [...ts, fim].forEach((t) => window.clearTimeout(t))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="tv-concl">
      <div className="tv-quest__topo">
        <button className="tv-voltar" onClick={() => !pronto && ir({ id: 'revisao' }, -1)} disabled={pronto}>
          <ArrowLeft size={20} /> Voltar ao teste
        </button>
        <button className="tv-voltar" onClick={() => pronto && ir({ id: 'relatorio' })} disabled={!pronto}>
          <LogOut size={19} /> Sair do teste
        </button>
      </div>
      <ol className="tv-etapas" aria-label="Etapas do teste">
        {ETAPAS.map((x, i) => (
          <li key={x.nome} className="is-feita">
            <span className="tv-etapas__n">
              <Check size={18} strokeWidth={3} />
            </span>
            <span className="tv-etapas__txt">
              <strong>{x.nome}</strong>
              <small>{x.sub}</small>
            </span>
            {i < 3 && null}
          </li>
        ))}
        <li className={pronto ? 'is-feita' : 'is-on'} aria-current="step">
          <span className="tv-etapas__n">{pronto ? <Check size={18} strokeWidth={3} /> : 5}</span>
          <span className="tv-etapas__txt">
            <strong>Resultado</strong>
            <small>Seu perfil</small>
          </span>
        </li>
      </ol>
      <div className="tv-quest__barra">
        <Barra valor={100} rotulo="Progresso do teste" />
        <span>
          {N_ITENS} de {N_ITENS}
        </span>
      </div>

      <div className="tv-concl__grade">
        <motion.img className="tv-concl__astro" src="./voc/ref/concluiu-astro.webp" alt="Astronauta da Geniex comemorando" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ type: 'spring', stiffness: 120, damping: 16 }} />
        <div className="tv-concl__meio">
          <Etiqueta />
          <motion.h1 className="tv-h1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            Você concluiu o teste!
          </motion.h1>
          <p className="tv-lead">Muito bem! Agora vamos analisar suas respostas para gerar o seu perfil profissional personalizado.</p>
          <ul className="tv-concl__passos" aria-live="polite">
            {passos.map(({ I, cor, t, d }, i) => (
              <motion.li key={t} className={i < passo ? 'is-feito' : i === passo ? 'is-on' : ''} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.1 }}>
                <span className={`tv-benef__ic tv-benef__ic--${cor}`}>{i < passo ? <Check size={22} strokeWidth={2.6} /> : <I size={22} strokeWidth={1.9} />}</span>
                <span>
                  <strong>{t}</strong>
                  <small>{d}</small>
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
        <div className="tv-concl__proc">
          <motion.img src="./voc/ref/concluiu-planeta.webp" alt="" animate={{ y: [0, -8, 0], rotate: [0, 3, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />
          <strong>{pronto ? 'Seu perfil está pronto!' : 'Processando suas respostas'}</strong>
          <p>{pronto ? 'Reunimos suas principais áreas de interesse e profissões que combinam com você.' : 'Estamos cruzando suas respostas com nossa base de profissões para criar um resultado completo e personalizado.'}</p>
          <Barra valor={pronto ? 100 : 12 + passo * 27} rotulo="Processamento" />
          {pronto ? (
            <Btn grande bloco iconeDir={<ArrowRight size={18} />} onClick={() => ir({ id: 'relatorio' })}>
              Ver meu resultado
            </Btn>
          ) : (
            <small>
              <LoaderCircle size={14} className="tv-gira" /> Isso pode levar alguns segundos...
            </small>
          )}
        </div>
      </div>

      <div className="tv-concl__enquanto">
        <img src="./voc/ref/foguete.webp" alt="" />
        <span className="tv-concl__enq-tit">
          <strong>Enquanto isso...</strong>
          <small>Seu resultado vai mostrar:</small>
        </span>
        <ul>
          {[
            { I: Target, t: 'Suas principais áreas de interesse' },
            { I: BriefcaseBusiness, t: 'Profissões recomendadas' },
            { I: FileText, t: 'Informações sobre cada carreira' },
            { I: Signpost, t: 'Próximos passos para explorar seu futuro' },
          ].map(({ I, t }) => (
            <li key={t}>
              <I size={26} strokeWidth={1.6} />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
