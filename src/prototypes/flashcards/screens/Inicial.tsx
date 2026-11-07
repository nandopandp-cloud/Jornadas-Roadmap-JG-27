import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Barra, Btn } from '../components/ui'
import { useFx } from '../store'

const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
/** atividades do cronograma do estudante (por dia do mês de outubro/novembro) */
const ATIVIDADES: { dia: string; disc: string; nome: string; cor: string }[] = [
  { dia: '2026-10-30', disc: 'Artes', nome: 'Arte, Cultura e Sociedade', cor: '#4b55ec' },
  { dia: '2026-10-30', disc: 'Literatura', nome: 'Revisão: Romantismo no Brasil', cor: '#6d5df5' },
  { dia: '2026-10-30', disc: 'Matemática', nome: 'Lista de exercícios: Funções', cor: '#f08a24' },
  { dia: '2026-10-29', disc: 'História', nome: 'República Velha', cor: '#3a8be6' },
  { dia: '2026-10-28', disc: 'Biologia', nome: 'Metabolismo energético', cor: '#22a45d' },
  { dia: '2026-10-27', disc: 'Química', nome: 'Ligações químicas', cor: '#8b7cf6' },
  { dia: '2026-10-26', disc: 'Geografia', nome: 'Biomas brasileiros', cor: '#3a8be6' },
  { dia: '2026-10-31', disc: 'Física', nome: 'Leis de Newton', cor: '#7c58fa' },
]
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export default function Inicial() {
  const { toast } = useFx()
  const [inicioSemana, setInicioSemana] = useState(new Date(2026, 9, 25))
  const [dia, setDia] = useState('2026-10-30')
  const dias = Array.from({ length: 7 }, (_, i) => new Date(inicioSemana.getFullYear(), inicioSemana.getMonth(), inicioSemana.getDate() + i))
  const meio = dias[3]
  const doDia = ATIVIDADES.filter((a) => a.dia === dia)
  const mover = (n: number) => setInicioSemana((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7 * n))

  return (
    <div className="fx-ini">
      <section className="fx-ini__para">
        <h2 className="fx-h2g">Para você</h2>
        <motion.div className="fx-banner" whileHover={{ scale: 1.006 }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <img src="./flash/banner.webp" alt="GenieX — Aprenda. Jogue. Evolua sempre." />
        </motion.div>
      </section>

      <section className="fx-ini__perfil">
        <h2 className="fx-h2g">Perfil</h2>
        <motion.div className="fx-cartao fx-perfil" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <div className="fx-perfil__txt">
            <span className="fx-perfil__tag">Perfil campeão</span>
            <strong>Complete seu perfil</strong>
            <p>Adicione informações para receber recomendações ainda mais alinhadas.</p>
            <Btn onClick={() => toast('Edição de perfil fora do escopo deste protótipo.', 'info')}>Completar perfil</Btn>
          </div>
          <img src="./flash/perfil.webp" alt="" />
        </motion.div>
      </section>

      <section className="fx-ini__curso">
        <h2 className="fx-h2g">Continue aprendendo</h2>
        <motion.div className="fx-cartao fx-curso" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="fx-curso__img">
            <img src="./flash/livro-curso.webp" alt="" />
          </div>
          <div className="fx-curso__txt">
            <span className="fx-curso__tag">Curso</span>
            <strong>Literatura - Ensino Médio</strong>
            <p>Amplie a leitura e a interpretação de textos literários, compreendendo diferentes estilos, linguagens e contextos históricos.</p>
            <div className="fx-curso__prog">
              <Barra valor={7} />
              <span>7%</span>
            </div>
            <Btn bloco grande onClick={() => toast('O curso completo não faz parte deste protótipo.', 'info')}>
              Ir para o curso
            </Btn>
          </div>
        </motion.div>
      </section>

      <section className="fx-ini__cron">
        <h2 className="fx-h2g">Cronograma</h2>
        <motion.div className="fx-cartao fx-cron" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="fx-cron__cab">
            <button className="fx-cron__seta" onClick={() => mover(-1)} aria-label="Semana anterior">
              <ChevronLeft size={18} />
            </button>
            <strong>
              {MESES[meio.getMonth()]} de {meio.getFullYear()}
            </strong>
            <button className="fx-cron__seta" onClick={() => mover(1)} aria-label="Próxima semana">
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="fx-cron__semana">
            {dias.map((d) => {
              const k = iso(d)
              const tem = ATIVIDADES.some((a) => a.dia === k)
              return (
                <button key={k} className={`fx-cron__dia ${k === dia ? 'is-on' : ''}`} onClick={() => setDia(k)}>
                  <small>{DIAS[d.getDay()]}</small>
                  <span>
                    {k === dia && <motion.i layoutId="fx-cron-dia" className="fx-cron__bola" transition={{ type: 'spring', stiffness: 500, damping: 36 }} />}
                    <b>{d.getDate()}</b>
                  </span>
                  {tem && k !== dia && <em className="fx-cron__ponto" />}
                </button>
              )
            })}
          </div>
          <div className="fx-cron__ativ">
            <p>Suas atividades ({ATIVIDADES.length})</p>
            {doDia.length ? (
              doDia.map((a) => (
                <motion.button key={a.nome} className="fx-cron__item" style={{ '--c': a.cor } as React.CSSProperties} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} onClick={() => toast('Atividades do cronograma fora do escopo deste protótipo.', 'info')}>
                  <small>{a.disc}</small>
                  <span>{a.nome}</span>
                </motion.button>
              ))
            ) : (
              <span className="fx-cron__vazio">Nenhuma atividade neste dia.</span>
            )}
          </div>
        </motion.div>
      </section>
    </div>
  )
}
