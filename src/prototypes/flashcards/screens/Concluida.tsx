import { motion } from 'framer-motion'
import { BookOpenText, ChevronLeft, ChevronRight, FileText, RefreshCw, Star } from 'lucide-react'
import { useMemo } from 'react'
import { Anel, Legenda, PorTopico } from '../components/resultado'
import { Brilhos, Btn, Migalhas, Num } from '../components/ui'
import { CARD, DISC, TOPICO } from '../data'
import { nomeGrupo, pct, respondidos, useFx } from '../store'

/** Sessão concluída — resultado do estudo do grupo */
export default function Concluida({ grupo }: { grupo: string }) {
  const { s, ir, reiniciar } = useFx()
  const g = s.grupos.find((x) => x.id === grupo)
  if (!g) return null
  const d = DISC[g.disc]
  const favs = g.cards.filter((c) => s.favoritos[c]).length
  const revisar = g.cards.filter((c) => g.status[c] === 'revisar')
  const nomesTopicos = g.topicos.map((t) => TOPICO[t].nome)
  const deQue = nomesTopicos.length === 1 ? nomesTopicos[0] : nomeGrupo(g)
  const voltar = () => ir({ id: 'grupo', grupo: g.id }, -1)

  return (
    <div className="fx-concl">
      <Confete />
      <Migalhas itens={[{ texto: 'Flashcards', onClick: () => ir({ id: 'home', aba: 'grupos' }, -1) }, { texto: nomeGrupo(g), onClick: voltar }, { texto: 'Sessão concluída' }]} onVoltar={voltar} />

      <div className="fx-concl__grade">
        <section className="fx-concl__hero">
          <div className="fx-concl__astro">
            <Brilhos n={8} estrelas escala={1.5} />
            <motion.img
              src="./flash/astronauta.webp"
              alt=""
              initial={{ y: 40, scale: 0.7, opacity: 0 }}
              animate={{ y: [40, -8, 0], scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
            <h1 className="fx-h1 fx-h1--m">Boa! Você concluiu o estudo deste grupo de flashcards!</h1>
            <p>
              Você revisou todas as questões de {deQue}.
              <br />
              Continue assim para evoluir cada vez mais!
            </p>
          </motion.div>
        </section>

        <motion.aside className="fx-cartao fx-concl__grupo" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <span className="fx-gcab__ic">
            <d.icone size={37} strokeWidth={1.7} />
          </span>
          <div>
            <strong>{nomeGrupo(g)}</strong>
            <span>{g.topicos.length === 1 ? nomesTopicos[0] : `${g.topicos.length} tópicos`}</span>
            <small>{g.cards.length} flashcards</small>
          </div>
          <div className="fx-chips">
            {g.topicos.map((t) => (
              <span key={t} className="fx-chip">
                {TOPICO[t].nome}
              </span>
            ))}
          </div>
        </motion.aside>

        <div className="fx-concl__col">
        <div className="fx-concl__res">
          <motion.section className="fx-cartao fx-concl__anel" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Anel valor={pct(respondidos(g), g.cards.length)} festa />
            <Legenda g={g} />
          </motion.section>
          <motion.section className="fx-cartao fx-concl__favs" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}>
            <span className="fx-recurso__ic fx-recurso__ic--amarelo">
              <Star size={26} fill="currentColor" strokeWidth={0} />
            </span>
            <strong>
              <Num v={favs} />
            </strong>
            <span className="fx-concl__favs-t">{favs === 1 ? 'card favoritado' : 'cards favoritados'}</span>
            <small>{favs ? 'Você salvou estes cards para revisar depois.' : 'Toque na estrela dos cards para salvá-los.'}</small>
            {favs > 0 && (
              <button className="fx-link fx-link--seta" onClick={() => ir({ id: 'home', aba: 'favoritos' })}>
                Ver favoritos <ChevronRight size={16} />
              </button>
            )}
          </motion.section>
        </div>

        <motion.section className="fx-cartao fx-concl__topicos" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }}>
          <h3>Desempenho por tópico</h3>
          <PorTopico g={g} />
        </motion.section>
        <footer className="fx-concl__rodape">
          <Btn variante="contorno" grande icone={<ChevronLeft size={17} />} onClick={voltar}>
            Voltar para o grupo
          </Btn>
          <Btn
            grande
            icone={<RefreshCw size={19} />}
            className="fx-concl__denovo"
            onClick={() => {
              reiniciar(g.id)
              ir({ id: 'grupo', grupo: g.id })
            }}
          >
            Estudar novamente
          </Btn>
        </footer>
        </div>

        <div className="fx-concl__col">
        <motion.section className="fx-cartao fx-concl__continuar" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h3>Continuar estudando</h3>
          <p>Que tal praticar com outro grupo?</p>
          <Btn grande bloco icone={<BookOpenText size={19} />} onClick={() => ir({ id: 'home', aba: 'grupos' })}>
            Escolher outro grupo
          </Btn>
        </motion.section>

        <motion.section className="fx-cartao fx-concl__revisar" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}>
          <h3>Revisar depois ({revisar.length})</h3>
          <p>{revisar.length ? 'Você marcou estes cards para revisar novamente.' : 'Nenhum card marcado para revisar. Mandou bem!'}</p>
          <div className="fx-concl__revlista">
            {revisar.map((c, i) => (
              <motion.button key={c} className="fx-revitem" onClick={() => ir({ id: 'grupo', grupo: g.id, card: c })} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 + i * 0.06 }}>
                <span className="fx-quad fx-quad--m">
                  <FileText size={19} />
                </span>
                <span>{CARD[c].pergunta}</span>
                <ChevronRight size={17} />
              </motion.button>
            ))}
          </div>
        </motion.section>

        </div>
      </div>
    </div>
  )
}

function Confete() {
  const cores = ['#4b55ec', '#8b6cff', '#22b45a', '#fdc317', '#fd4153', '#38bdf8']
  const pecas = useMemo(
    () => Array.from({ length: 70 }).map((_, i) => ({ i, x: Math.random() * 100, d: Math.random() * 0.5, r: Math.random() * 540 - 270, c: cores[i % cores.length], w: 6 + Math.random() * 7, dur: 1.8 + Math.random() * 1.4 })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  return (
    <div className="fx-confete" aria-hidden>
      {pecas.map((p) => (
        <motion.i key={p.i} style={{ left: `${p.x}%`, background: p.c, width: p.w, height: p.w * 0.45 }} initial={{ y: -40, rotate: 0, opacity: 1 }} animate={{ y: '105vh', rotate: p.r, opacity: [1, 1, 0] }} transition={{ duration: p.dur, delay: p.d, ease: 'easeIn' }} />
      ))}
    </div>
  )
}
