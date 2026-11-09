import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  Bookmark,
  BriefcaseBusiness,
  CalendarCheck2,
  CircleCheck,
  ClipboardList,
  Clock,
  Coins,
  Compass,
  Download,
  Gauge,
  GraduationCap,
  Heart,
  History,
  Info,
  Lightbulb,
  ListChecks,
  MapPinned,
  MessageCircleQuestion,
  Puzzle,
  Rocket,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Target,
  TriangleAlert,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { CARREIRA, type Carreira } from '../carreiras'
import { ClarezaFinal } from '../components/clareza'
import { CardProf, DimBola, FotoProf, Radar, SeloCategoria } from '../components/perfil'
import { Barra, Btn, Coracao, Etiqueta, Modal, Rico, Select } from '../components/ui'
import { CLAREZA, DIM, DIMS, ESCALA, HABILIDADES, ITEM, itensDo, type Dim, type Respostas } from '../instrumento'
import { acoesSugeridas, habilidades, nivel, perguntasReflexao, preferencias, valoresDestacados, type Perfil, type Recomendacao } from '../motor'
import { dataLonga, useTv, type AbaRel, type View } from '../store'

const ABAS: { id: AbaRel; nome: string; I: LucideIcon; titulo: ReactNode; sub: string; banner: string }[] = [
  { id: 'visao', nome: 'Visão geral', I: Gauge, titulo: <>Aqui está o seu<br />perfil profissional!</>, sub: 'Com base nas suas respostas, identificamos suas principais áreas de interesse e reunimos profissões que combinam com o seu perfil.', banner: './voc/ref/banner-visao.webp' },
  { id: 'areas', nome: 'Áreas de interesse', I: Target, titulo: 'Suas áreas de interesse', sub: 'Entenda melhor cada dimensão do seu perfil e veja como elas se conectam com o seu futuro.', banner: './voc/ref/banner-areas.webp' },
  { id: 'profissoes', nome: 'Profissões recomendadas', I: BriefcaseBusiness, titulo: 'Profissões recomendadas para você', sub: 'Com base no seu perfil, selecionamos profissões que combinam com seus interesses, e explicamos o porquê de cada uma.', banner: './voc/ref/banner-areas.webp' },
  { id: 'valores', nome: 'Valores', I: Heart, titulo: 'Seus valores profissionais', sub: 'Confira quais valores são mais importantes para você e entenda como eles se relacionam com as profissões recomendadas.', banner: './voc/ref/banner-valores.webp' },
  { id: 'preferencias', nome: 'Preferências', I: Puzzle, titulo: 'Suas preferências de trabalho', sub: 'Veja como você prefere trabalhar e em quais ambientes se sente mais confortável. Essas preferências ajudam a imaginar o seu dia a dia.', banner: './voc/ref/banner-preferencias.webp' },
  { id: 'habilidades', nome: 'Habilidades', I: SlidersHorizontal, titulo: 'Suas habilidades', sub: 'Veja como você avaliou suas habilidades e como elas aparecem nas profissões recomendadas: pontos fortes e oportunidades de desenvolvimento.', banner: './voc/ref/banner-habilidades.webp' },
  { id: 'passos', nome: 'Próximos passos', I: CalendarCheck2, titulo: 'Próximos passos', sub: 'Com base nos seus resultados, veja sugestões de ações para continuar explorando suas possibilidades e se preparar para o seu futuro profissional.', banner: './voc/ref/banner-passos.webp' },
]

/** ícones dos valores profissionais (Frame 11) */
const VALOR_IC: Record<string, { I: LucideIcon; cor: string }> = {
  V04: { I: Users, cor: '#ef3f74' },
  V03: { I: Settings, cor: '#504cf2' },
  V06: { I: BookOpen, cor: '#2f7cf6' },
  V01: { I: ShieldCheck, cor: '#16b277' },
  V02: { I: Coins, cor: '#f5a524' },
  V05: { I: Lightbulb, cor: '#f7881f' },
  V07: { I: Star, cor: '#f5a524' },
  V08: { I: Clock, cor: '#14a8c4' },
}
/** ícones das preferências (Frame 12) */
const PREF_IC: Record<string, { I: LucideIcon; cor: string }> = {
  P01: { I: Users, cor: '#ef3f74' },
  P02: { I: Clock, cor: '#14a8c4' },
  P03: { I: Lightbulb, cor: '#f5a524' },
  P04: { I: Settings, cor: '#2f7cf6' },
  P05: { I: Target, cor: '#7c4ddb' },
  P06: { I: MapPinned, cor: '#16b277' },
}
const HAB_COR = ['#ef4b5f', '#f7881f', '#f5a524', '#2f7cf6', '#504cf2']
const NOME_VALOR: Record<string, string> = Object.fromEntries(itensDo('B').map((i) => [i.id, (i as { curto: string }).curto]))
const lista = (xs: string[]) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} e ${xs[xs.length - 1]}`)
const ATIVIDADE: Record<Dim, string> = { R: 'construção prática', I: 'investigação', A: 'criação', S: 'apoio a pessoas', E: 'iniciativa', C: 'organização' }

/** Resultado do teste (Frames 7, 8, 9, 11, 12, 13, 14 · PRD §5.6 e §5.7) */
export default function Relatorio({ v }: { v: Extract<View, { id: 'relatorio' }> }) {
  const { s, ir, track, ultima, toast } = useTv()
  const t = (v.tentativa && s.tentativas.find((x) => x.id === v.tentativa)) || ultima
  const [aba, setAba] = useState<AbaRel>(v.aba ?? 'visao')
  const [clarPos, setClarPos] = useState(!!v.clarezaPos)
  const [como, setComo] = useState(false)
  const ehAtual = t?.id === ultima?.id

  useEffect(() => {
    if (t?.resultado) track('career_report_viewed', { aba, versao: t.resultado.versao })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aba])

  if (!t?.resultado) {
    return (
      <div className="tv-vazio tv-vazio--grande">
        <img src="./voc/ref/concluiu-planeta.webp" alt="" width={120} />
        <strong>Você ainda não tem um resultado</strong>
        <span>Faça o Teste Vocacional para descobrir seus interesses e profissões para explorar.</span>
        <Btn onClick={() => ir({ id: 'entrada' })}>Conhecer o teste</Btn>
      </div>
    )
  }
  const res = t.resultado
  const p = res.perfil
  const r = t.respostas
  const A = ABAS.find((x) => x.id === aba)!
  const trocar = (id: AbaRel) => {
    setAba(id)
    document.querySelector('.tv-main')?.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const abrir = (id: string, i?: number) => {
    track('career_recommendation_opened', { profissao: id, posicao: i !== undefined && i >= 0 ? i + 1 : 'fora da lista' })
    ir({ id: 'carreira', carreira: id, de: 'relatorio' })
  }
  const ctx: Ctx = { p, r, recs: res.recomendacoes, trocar, abrir }

  return (
    <div className="tv-rel">
      {!ehAtual && (
        <div className="tv-aviso">
          <History size={17} />
          <span>
            Você está vendo um resultado anterior, de {dataLonga(t.fim!)}, feito com o instrumento <b>{res.versao}</b>. Ele fica guardado como era, mesmo que a metodologia mude.
          </span>
          <button className="tv-link" onClick={() => ir({ id: 'relatorio' })}>
            Ver o mais recente
          </button>
        </div>
      )}

      <header className={`tv-hero tv-hero--${aba}`}>
        <div className="tv-hero__txt">
          <Etiqueta />
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={aba} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h1 className="tv-h1">{A.titulo}</h1>
              <p className="tv-lead">{A.sub}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={A.banner} className="tv-hero__arte" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 24 }}>
            <img src={A.banner} alt="Astronauta da Geniex" />
            {aba === 'areas' && (
              <button className="tv-hero__baixar" onClick={() => toast('Relatório em PDF fora do escopo deste protótipo.', 'info')}>
                <Download size={18} /> Baixar meu relatório
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      </header>

      <nav className="tv-rabas" role="tablist" aria-label="Seções do resultado">
        {ABAS.map((x) => (
          <button key={x.id} role="tab" aria-selected={aba === x.id} className={aba === x.id ? 'is-on' : ''} onClick={() => trocar(x.id)}>
            <x.I size={19} strokeWidth={1.8} /> {x.nome}
            {aba === x.id && <motion.i layoutId="tv-rabas-linha" className="tv-rabas__linha" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
          </button>
        ))}
      </nav>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={aba} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.1 } }} transition={{ type: 'spring', stiffness: 300, damping: 32 }}>
          {aba === 'visao' && <Visao c={ctx} onComo={() => setComo(true)} />}
          {aba === 'areas' && <Areas c={ctx} />}
          {aba === 'profissoes' && <Profissoes c={ctx} selInicial={v.sel} />}
          {aba === 'valores' && <Valores c={ctx} />}
          {aba === 'preferencias' && <Preferencias c={ctx} />}
          {aba === 'habilidades' && <Habilidades c={ctx} />}
          {aba === 'passos' && <Passos c={ctx} ehAtual={ehAtual} onClareza={() => setClarPos(true)} />}
        </motion.div>
      </AnimatePresence>

      <footer className="tv-limites">
        <Info size={18} />
        <p>
          <strong>Sobre este resultado.</strong> Ele é um retrato atual das suas preferências, baseado só nas suas respostas, e serve como ponto de partida para explorar, não como uma decisão. Interesses mudam com o tempo. O teste não mede aptidão nem inteligência e não substitui conversas com orientadores e pessoas de confiança. Instrumento {res.versao} · regras {res.regras}.{' '}
          <button className="tv-link" onClick={() => setComo(true)}>
            Como chegamos a este resultado
          </button>{' '}
          ·{' '}
          <button className="tv-link" onClick={() => ir({ id: 'historico' })}>
            Histórico de testes
          </button>
        </p>
      </footer>

      <ComoChegamos aberto={como} onFechar={() => setComo(false)} p={p} versao={res.versao} regras={res.regras} />
      <ClarezaFinal aberto={clarPos} onFechar={() => setClarPos(false)} />
    </div>
  )
}

type Ctx = { p: Perfil; r: Respostas; recs: Recomendacao[]; trocar: (a: AbaRel) => void; abrir: (id: string, i?: number) => void }

/* ---------------- peças comuns ---------------- */
function Cartao({ titulo, info, sub, acao, children, className = '' }: { titulo?: string; info?: boolean; sub?: string; acao?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`tv-card ${className}`}>
      {(titulo || acao) && (
        <header className="tv-card__cab">
          <div>
            {titulo && (
              <h2>
                {titulo} {info && <Info size={17} className="tv-card__info" aria-hidden />}
              </h2>
            )}
            {sub && <p>{sub}</p>}
          </div>
          {acao}
        </header>
      )}
      {children}
    </section>
  )
}

function Aviso({ I = Lightbulb, tom = 'amarelo', titulo, children }: { I?: LucideIcon; tom?: 'amarelo' | 'roxo' | 'verde' | 'lilas'; titulo?: string; children: ReactNode }) {
  return (
    <div className={`tv-dica tv-dica--${tom}`}>
      <span className="tv-dica__ic">
        <I size={22} strokeWidth={1.8} />
      </span>
      <div>
        {titulo && <strong>{titulo}</strong>}
        <div className="tv-dica__txt">{children}</div>
      </div>
    </div>
  )
}

/** cards de três profissões com fotos (base das seções “como aparecem nas profissões”) */
function TresProfissoes({ c, render }: { c: Ctx; render: (car: Carreira) => ReactNode }) {
  const comFoto = c.recs
    .map((x) => CARREIRA[x.id])
    .sort((a, b) => Number(!!b.foto) - Number(!!a.foto))
    .slice(0, 3)
  return (
    <div className="tv-tres">
      {comFoto.map((car) => (
        <article key={car.id} className="tv-tres__c">
          <FotoProf c={car} className="tv-tres__foto" />
          <div className="tv-tres__corpo">
            <strong>{car.nome}</strong>
            {render(car)}
            <button className="tv-tres__ver" onClick={() => c.abrir(car.id, c.recs.findIndex((x) => x.id === car.id))}>
              Ver detalhes <ArrowRight size={15} />
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}

/* ---------------- Visão geral (Frame 7) ---------------- */
function Visao({ c, onComo }: { c: Ctx; onComo: () => void }) {
  const { p, r, recs } = c
  const vals = valoresDestacados(r)
  const prefs = preferencias(r)
  const hab = habilidades(r)
  const top = p.ordem.slice(0, 3)
  return (
    <div className="tv-grade tv-grade--visao">
      <Cartao
        titulo="Seu perfil de interesses (RIASEC)"
        info
        acao={
          <button className="tv-link" onClick={onComo}>
            Entenda o modelo
          </button>
        }
        className="tv-card--perfil"
      >
        <div className="tv-perfil">
          <Radar norm={p.norm} />
          <div className="tv-perfil__top">
            <strong>Seus principais interesses</strong>
            <ol>
              {top.map((d, i) => (
                <li key={d}>
                  <span className="tv-perfil__n" style={{ background: DIM[d].cor }}>
                    {i + 1}
                  </span>
                  <span>{DIM[d].tecnico}</span>
                  <b style={{ color: DIM[d].cor }}>{p.norm[d]}</b>
                </li>
              ))}
            </ol>
            <p>
              {p.inconclusivo
                ? 'Suas respostas ficaram muito parecidas em todas as áreas. Preferimos não apontar pistas: explore o catálogo livremente ou refaça o teste com calma.'
                : `Você demonstra forte interesse por atividades de ${lista(top.map((d) => ATIVIDADE[d]))}. Isso indica afinidade com carreiras que envolvem ${DIM[top[0]].atividades}.`}
            </p>
          </div>
        </div>
      </Cartao>

      <Cartao titulo="Resumo do seu perfil" className="tv-card--resumo">
        <ul className="tv-resumo">
          <li>
            <span className="tv-resumo__ic tv-resumo__ic--roxo">
              <BarChart3 size={24} />
            </span>
            <span>
              <strong>Interesses profissionais</strong>
              <small>Você se identifica com atividades de {lista(p.destaques.map((d) => ATIVIDADE[d]))}.</small>
            </span>
          </li>
          <li>
            <span className="tv-resumo__ic tv-resumo__ic--amarelo">
              <Lightbulb size={24} />
            </span>
            <span>
              <strong>Valores profissionais</strong>
              <small>Você valoriza {lista(vals.slice(0, 3).map((x) => x.nome.toLowerCase()))}.</small>
            </span>
          </li>
          <li>
            <span className="tv-resumo__ic tv-resumo__ic--roxo">
              <MapPinned size={24} />
            </span>
            <span>
              <strong>Preferências de trabalho</strong>
              <small>Prefere {lista(prefs.slice(0, 3).map((x) => x.rotulo.toLowerCase()))}.</small>
            </span>
          </li>
          <li>
            <span className="tv-resumo__ic tv-resumo__ic--amarelo">
              <Star size={24} />
            </span>
            <span>
              <strong>Habilidades percebidas</strong>
              <small>
                Você se sente confiante em {lista(hab.facilidade.slice(0, 3).map((x) => x.toLowerCase())) || 'algumas habilidades'}
                {hab.desenvolver.length ? ` e deseja desenvolver ${lista(hab.desenvolver.map((x) => x.toLowerCase()))}` : ''}.
              </small>
            </span>
          </li>
        </ul>
      </Cartao>

      <Cartao
        titulo="Profissões recomendadas para você"
        info
        acao={
          <button className="tv-link tv-link--seta" onClick={() => c.trocar('profissoes')}>
            Ver todas as profissões <ArrowRight size={15} />
          </button>
        }
        className="tv-card--span2"
      >
        {recs.length ? (
          <div className="tv-faixa">
            {recs.map((rec, i) => (
              <CardProf key={rec.id} c={CARREIRA[rec.id]} rec={rec} indice={i} compacto onAbrir={() => c.abrir(rec.id, i)} />
            ))}
          </div>
        ) : (
          <SemSugestoes />
        )}
      </Cartao>
    </div>
  )
}

function SemSugestoes() {
  const { ir } = useTv()
  return (
    <div className="tv-vazio">
      <TriangleAlert size={26} />
      <strong>Sem sugestões fundamentadas desta vez</strong>
      <span>Como suas respostas ficaram parecidas em todas as áreas, preferimos não indicar profissões. Explore o catálogo livremente.</span>
      <Btn onClick={() => ir({ id: 'explorar' })}>Explorar profissões</Btn>
    </div>
  )
}

/* ---------------- Áreas de interesse (Frame 8) ---------------- */
function Areas({ c }: { c: Ctx }) {
  const { p, r } = c
  const [det, setDet] = useState<Dim | null>(null)
  const { ir } = useTv()
  return (
    <div className="tv-grade tv-grade--areas">
      <Cartao titulo="Seu perfil RIASEC" info className="tv-card--riasec">
        <div className="tv-riasec">
          <Radar norm={p.norm} largura={400} />
          <div className="tv-riasec__info">
            <Aviso I={Compass} tom="lilas" titulo="O que é o modelo RIASEC?">
              O modelo RIASEC organiza seus interesses profissionais em seis dimensões. Ele mostra quais tipos de atividades mais despertam sua curiosidade e motivação.
              <button className="tv-link tv-link--seta" onClick={() => document.getElementById('tv-dims')?.scrollIntoView({ behavior: 'smooth' })}>
                Entenda cada dimensão <ArrowRight size={14} />
              </button>
            </Aviso>
            <Aviso>Você pode ter interesse em mais de uma dimensão e explorar diferentes áreas. Isso é totalmente normal!</Aviso>
          </div>
        </div>
      </Cartao>
      <Cartao titulo="Seu código RIASEC" info className="tv-card--codigo">
        <div className="tv-codigo">
          <div className="tv-codigo__bolas">
            {p.destaques.map((d, i) => (
              <motion.span key={d} initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15 + i * 0.1, type: 'spring' }}>
                <DimBola d={d} tam={76} />
              </motion.span>
            ))}
          </div>
          <p className="tv-codigo__nomes">{p.destaques.map((d) => DIM[d].tecnico).join(' • ')}</p>
          <p>Seu código representa as três dimensões com pontuações mais altas, indicando as áreas que mais combinam com você.</p>
          <p>Esse código não define uma profissão, mas ajuda a identificar caminhos e possibilidades para você explorar.</p>
          {p.empatadas.length > 0 && (
            <p className="tv-codigo__empate">
              {p.empatadas.map((d) => DIM[d].tecnico).join(' e ')} empatou com {DIM[p.destaques[2]].tecnico}: consideramos as duas.
            </p>
          )}
        </div>
      </Cartao>

      <section className="tv-dims" id="tv-dims">
        <h2 className="tv-h2">Conheça cada dimensão do seu perfil</h2>
        <div className="tv-dims__grade">
          {DIMS.map((d, i) => (
            <motion.article key={d} className="tv-dimc" style={{ '--c': DIM[d].cor, '--cc': DIM[d].claro } as CSSProperties} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="tv-dimc__topo">
                <span className="tv-dimc__nome">{DIM[d].tecnico}</span>
                <span className="tv-dimc__nota">{p.norm[d]}</span>
                <img src={DIM[d].personagem} alt="" />
              </div>
              <p>{DIM[d].resumo}</p>
              <button className="tv-dimc__ver" onClick={() => setDet(d)}>
                Ver detalhes <ArrowRight size={15} />
              </button>
            </motion.article>
          ))}
        </div>
      </section>

      <Modal aberto={!!det} onFechar={() => setDet(null)} titulo={det ? `${DIM[det].tecnico} · ${p.norm[det]}` : ''} largura={560}>
        {det && (
          <div className="tv-dimdet">
            <div className="tv-dimdet__cab" style={{ background: DIM[det].claro }}>
              <img src={DIM[det].personagem} alt="" />
              <div>
                <strong>{nivel(p.norm[det])}</strong>
                <p>{DIM[det].descricao}</p>
              </div>
            </div>
            <h4>O que contribuiu (respostas 4 e 5)</h4>
            {p.contribuiram[det].length ? (
              <ul>
                {p.contribuiram[det].map((id) => (
                  <li key={id}>
                    “{ITEM[id].texto.replace(/\.$/, '')}” · <b>{ESCALA.interesse[(r[id] as number) - 1]}</b>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="tv-texto tv-texto--suave">Nenhuma atividade desta área foi marcada com 4 ou 5. Interesse menor não significa incapacidade, e interesses mudam.</p>
            )}
            <p className="tv-texto tv-texto--suave">A nota vai de 0 a 100 e mostra a posição das suas respostas no questionário. Não é percentual de aptidão nem chance de sucesso.</p>
            <Btn
              variante="claro"
              iconeDir={<ArrowRight size={16} />}
              onClick={() => {
                const d = det
                setDet(null)
                ir({ id: 'explorar', dim: d })
              }}
            >
              Ver profissões com esta dimensão
            </Btn>
          </div>
        )}
      </Modal>
    </div>
  )
}

/* ---------------- Profissões recomendadas (Frame 9) ---------------- */
type MiniAba = 'visao' | 'dia' | 'onde' | 'formacao'
function Profissoes({ c, selInicial }: { c: Ctx; selInicial?: string }) {
  const { s, favoritar, toast, ir } = useTv()
  const [ordem, setOrdem] = useState<'teste' | 'az'>('teste')
  const [sel, setSel] = useState(selInicial ?? c.recs[0]?.id)
  const [mini, setMini] = useState<MiniAba>('visao')
  if (!c.recs.length) return <SemSugestoes />
  const ordenadas = ordem === 'az' ? [...c.recs].sort((a, b) => CARREIRA[a.id].nome.localeCompare(CARREIRA[b.id].nome)) : c.recs
  const rec = c.recs.find((x) => x.id === sel) ?? c.recs[0]
  const car = CARREIRA[rec.id]
  const salvo = s.favoritos.some((f) => f.id === car.id)
  return (
    <div className="tv-profs">
      <div className="tv-profs__lista">
        <div className="tv-card__cab">
          <div>
            <h2>Suas principais recomendações</h2>
            <p>Profissões que compartilham características com o seu perfil. Não é um ranking: compare e explore.</p>
          </div>
          <Select
            valor={ordem}
            rotulo="Ordenar"
            className="tv-select--p"
            onChange={setOrdem}
            opcoes={[
              { valor: 'teste', texto: 'Ordenar por relação com o perfil' },
              { valor: 'az', texto: 'Ordenar por nome (A–Z)' },
            ]}
          />
        </div>
        <div className="tv-profs__grade">
          {ordenadas.map((x, i) => (
            <CardProf
              key={x.id}
              c={CARREIRA[x.id]}
              rec={x}
              indice={i}
              selecionado={x.id === rec.id}
              onAbrir={() => {
                setSel(x.id)
                setMini('visao')
                if (window.innerWidth < 1100) document.getElementById('tv-profs-det')?.scrollIntoView({ behavior: 'smooth' })
              }}
            />
          ))}
        </div>
        <p className="tv-profs__outras">
          Não se identificou com alguma? Tudo bem.{' '}
          <button className="tv-link tv-link--seta" onClick={() => ir({ id: 'explorar' })}>
            Explore outras profissões <ArrowRight size={14} />
          </button>
        </p>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.aside key={car.id} id="tv-profs-det" className="tv-profs__det" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, transition: { duration: 0.1 } }}>
          <div className="tv-profs__dettopo">
            <button className="tv-link" onClick={() => document.querySelector('.tv-profs__lista')?.scrollIntoView({ behavior: 'smooth' })}>
              <ArrowLeft size={16} /> Voltar para a lista
            </button>
            <Coracao
              on={salvo}
              onClick={() => {
                const on = favoritar(car.id)
                toast(on ? `${car.nome} adicionado(a) aos favoritos.` : `${car.nome} removido(a) dos favoritos.`, on ? 'ok' : 'info')
              }}
            />
          </div>
          <div className="tv-profs__foto">
            <FotoProf c={car} />
            <SeloCategoria rec={rec} />
          </div>
          <h3>{car.nome}</h3>
          <p className="tv-profs__desc">{car.descricao}</p>
          <div className="tv-mini-abas" role="tablist">
            {(
              [
                ['visao', 'Visão geral'],
                ['dia', 'Como é o dia a dia'],
                ['onde', 'Onde atua'],
                ['formacao', 'Formação'],
              ] as [MiniAba, string][]
            ).map(([id, n]) => (
              <button key={id} role="tab" aria-selected={mini === id} className={mini === id ? 'is-on' : ''} onClick={() => setMini(id)}>
                {n}
              </button>
            ))}
          </div>
          <div className="tv-blocos">
            {mini === 'visao' && (
              <>
                <Bloquinho I={Compass} titulo="O que faz?">
                  {car.descricao.split(/\.\s/)[0].replace(/\.$/, '')}.
                </Bloquinho>
                <Bloquinho I={Lightbulb} tom="amarelo" titulo="Por que combina com você?">
                  <Rico texto={rec.motivos.join(' ')} />
                </Bloquinho>
                {rec.atencao && (
                  <Bloquinho I={TriangleAlert} tom="laranja" titulo="Vale investigar">
                    {rec.atencao}
                  </Bloquinho>
                )}
                <Bloquinho I={ListChecks} titulo="Exemplos de atividades">
                  <ul>
                    {car.atividades.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </Bloquinho>
              </>
            )}
            {mini === 'dia' && (
              <>
                <Bloquinho I={ClipboardList} titulo="No dia a dia">
                  <ul>
                    {car.atividades.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </Bloquinho>
                <Bloquinho I={Puzzle} titulo="Problemas que resolve">
                  <ul>
                    {car.problemas.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </Bloquinho>
              </>
            )}
            {mini === 'onde' && (
              <Bloquinho I={MapPinned} titulo="Ambientes e setores">
                <div className="tv-chips">
                  {car.ambientes.map((a) => (
                    <span key={a} className="tv-chip">
                      {a}
                    </span>
                  ))}
                </div>
              </Bloquinho>
            )}
            {mini === 'formacao' && (
              <Bloquinho I={GraduationCap} titulo="Cursos e formações">
                <ul>
                  {car.formacoes.map((f) => (
                    <li key={f.nome}>
                      <b>{f.tipo}:</b> {f.nome} · {f.duracao}
                    </li>
                  ))}
                </ul>
              </Bloquinho>
            )}
          </div>
          <Btn grande bloco iconeDir={<ArrowRight size={18} />} onClick={() => c.abrir(car.id, c.recs.indexOf(rec))}>
            Quero saber mais sobre essa profissão
          </Btn>
        </motion.aside>
      </AnimatePresence>
    </div>
  )
}

function Bloquinho({ I, titulo, children, tom = 'roxo' }: { I: LucideIcon; titulo: string; children: ReactNode; tom?: 'roxo' | 'amarelo' | 'laranja' }) {
  return (
    <div className="tv-bloquinho">
      <span className={`tv-bloquinho__ic tv-bloquinho__ic--${tom}`}>
        <I size={22} strokeWidth={1.8} />
      </span>
      <div>
        <strong>{titulo}</strong>
        <div className="tv-bloquinho__txt">{children}</div>
      </div>
    </div>
  )
}

/* ---------------- Valores (Frame 11) ---------------- */
function Valores({ c }: { c: Ctx }) {
  const todos = itensDo('B')
    .map((i) => ({ id: i.id, nome: NOME_VALOR[i.id], v: (c.r[i.id] as number) ?? 0 }))
    .sort((a, b) => b.v - a.v)
  const top3 = todos.slice(0, 3).map((x) => x.id)
  return (
    <div className="tv-grade tv-grade--duas">
      <Cartao titulo="Seus principais valores" info sub="Estes são os valores que você considera mais importantes no seu futuro profissional.">
        <ol className="tv-ranking">
          {todos.slice(0, 6).map((x, i) => {
            const { I, cor } = VALOR_IC[x.id]
            return (
              <motion.li key={x.id} style={{ '--c': cor } as CSSProperties} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <span className="tv-ranking__n">{i + 1}</span>
                <span className="tv-ranking__ic">
                  <I size={18} strokeWidth={2.2} />
                </span>
                <span className="tv-ranking__nome">{x.nome}</span>
                <Barra valor={(x.v / 5) * 100} cor={cor} rotulo={`${x.nome}: ${x.v} de 5`} />
                <b>{x.v}</b>
              </motion.li>
            )
          })}
        </ol>
      </Cartao>
      <div className="tv-pilha">
        <Aviso titulo="O que são valores profissionais?">Valores profissionais são aquilo que você considera importante em um trabalho. Eles influenciam sua satisfação, motivação e bem-estar ao longo da carreira.</Aviso>
        <Aviso I={ClipboardList} tom="lilas" titulo="Não existe valor certo ou errado!">
          Cada pessoa tem seus próprios valores, e eles podem mudar ao longo da vida.
        </Aviso>
        <Aviso I={Target} tom="verde" titulo="Como seus valores são utilizados?">
          Seus valores ajudam a explicar por que uma profissão pode combinar com você, mas não são usados para excluir opções da sua lista.
        </Aviso>
      </div>

      <Cartao titulo="Como seus valores se conectam com as profissões recomendadas" info sub="Veja quais dos seus principais valores costumam estar presentes nas profissões que mais combinam com você." className="tv-card--largo">
        <TresProfissoes
          c={c}
          render={(car) => {
            const comuns = top3.filter((v) => car.valores.includes(v))
            return (
              <>
                <small className="tv-tres__rot">Valores mais presentes:</small>
                <div className="tv-chips">
                  {car.valores.slice(0, 3).map((v) => (
                    <span key={v} className="tv-chip tv-chip--cor" style={{ '--c': VALOR_IC[v].cor } as CSSProperties}>
                      {NOME_VALOR[v]}
                    </span>
                  ))}
                </div>
                <small className="tv-tres__rot">Em comum com seus 3 principais valores</small>
                <div className="tv-tres__alinha">
                  <Barra valor={(comuns.length / 3) * 100} />
                  <b>{comuns.length} de 3</b>
                </div>
              </>
            )
          }}
        />
      </Cartao>
      <Cartao titulo="Todas as suas respostas" sub="Veja a importância que você atribuiu a cada valor.">
        <ul className="tv-lista-ic">
          {todos.map((x) => {
            const { I, cor } = VALOR_IC[x.id]
            return (
              <li key={x.id}>
                <I size={18} style={{ color: cor }} />
                <span>{x.nome}</span>
                <b>{x.v}</b>
              </li>
            )
          })}
        </ul>
      </Cartao>
    </div>
  )
}

/* ---------------- Preferências (Frame 12) ---------------- */
const AMBIENTES = [
  { id: 'escritorio', nome: 'Escritório', sub: 'presencial', img: './voc/ref/amb-escritorio.webp', lado: 'a' as const },
  { id: 'hibrido', nome: 'Híbrido', sub: '(remoto e presencial)', img: './voc/ref/amb-hibrido.webp', lado: 'b' as const },
  { id: 'arlivre', nome: 'Ao ar livre', sub: 'trabalho de campo', img: './voc/ref/amb-arlivre.webp', lado: 'a' as const },
]
function Preferencias({ c }: { c: Ctx }) {
  const prefs = preferencias(c.r)
  const p06 = prefs.find((x) => x.id === 'P06')?.lado
  return (
    <div className="tv-grade tv-grade--pref">
      <Cartao titulo="Seu estilo de trabalho" info sub="Em cada par, o marcador mostra o lado que combinou mais com você hoje.">
        <ul className="tv-estilo">
          {itensDo('C').map((it, i) => {
            if (it.tipo !== 'par') return null
            const lado = c.r[it.id] as 'a' | 'b' | undefined
            const { I, cor } = PREF_IC[it.id]
            return (
              <motion.li key={it.id} style={{ '--c': cor } as CSSProperties} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <span className="tv-ranking__ic">
                  <I size={18} strokeWidth={2.2} />
                </span>
                <span className={`tv-estilo__polo ${lado === 'a' ? 'is-on' : ''}`}>{it.rotulos[0]}</span>
                <span className="tv-estilo__trilho" role="img" aria-label={`Você prefere: ${lado ? it.rotulos[lado === 'a' ? 0 : 1] : 'sem resposta'}`}>
                  <motion.i initial={{ left: '50%' }} animate={{ left: lado === 'a' ? '12%' : lado === 'b' ? '88%' : '50%' }} transition={{ type: 'spring', stiffness: 120, damping: 16, delay: 0.1 + i * 0.05 }} />
                </span>
                <span className={`tv-estilo__polo tv-estilo__polo--dir ${lado === 'b' ? 'is-on' : ''}`}>{it.rotulos[1]}</span>
              </motion.li>
            )
          })}
        </ul>
      </Cartao>
      <Cartao titulo="Ambientes de trabalho" info sub="Tipos de ambiente e como se relacionam com a sua escolha de hoje.">
        <div className="tv-amb">
          {AMBIENTES.map((a) => {
            const combina = !!p06 && a.lado === p06
            return (
              <article key={a.id} className={`tv-amb__c ${combina ? 'is-on' : ''}`}>
                <img src={a.img} alt="" />
                <strong>{a.nome}</strong>
                <small>{a.sub}</small>
                <span className="tv-amb__nivel">{combina ? 'Combina com sua escolha' : 'Também possível'}</span>
                <Barra valor={combina ? 85 : 45} cor={combina ? '#504cf2' : '#9aa6ff'} />
              </article>
            )
          })}
        </div>
        <Aviso tom="lilas" titulo="O que são preferências de trabalho?">
          São características sobre como você gosta de trabalhar: o ambiente, o tipo de atividade e o nível de interação com outras pessoas. Elas ajudam a imaginar ambientes, mas nunca eliminam profissões: a mesma carreira pode existir em contextos bem diferentes.
        </Aviso>
      </Cartao>

      <Cartao titulo="Como suas preferências aparecem nas profissões recomendadas" info sub="Veja quais das suas preferências costumam fazer parte do dia a dia destas profissões." className="tv-card--largo">
        <TresProfissoes
          c={c}
          render={(car) => (
            <div className="tv-chips">
              {prefs
                .filter((x) => {
                  const tipico = car.contexto[x.id as keyof Carreira['contexto']]
                  return tipico === 'ambos' || tipico === x.lado
                })
                .slice(0, 4)
                .map((x) => (
                  <span key={x.id} className="tv-chip tv-chip--cor" style={{ '--c': PREF_IC[x.id].cor } as CSSProperties}>
                    {x.rotulo}
                  </span>
                ))}
            </div>
          )}
        />
      </Cartao>
      <Cartao titulo="Resumo das suas preferências" sub="O que você escolheu em cada par.">
        <ul className="tv-lista-ic">
          {prefs.map((x) => {
            const { I, cor } = PREF_IC[x.id]
            return (
              <li key={x.id}>
                <I size={18} style={{ color: cor }} />
                <span>{x.rotulo}</span>
              </li>
            )
          })}
        </ul>
      </Cartao>
    </div>
  )
}

/* ---------------- Habilidades (Frame 13) ---------------- */
const HAB_IC: Record<string, LucideIcon> = { H01: BarChart3, H02: Lightbulb, H03: Users, H04: ClipboardList, H05: Heart, H06: Compass, H07: Rocket, H08: Settings }
function Habilidades({ c }: { c: Ctx }) {
  const { ir } = useTv()
  const [ordem, setOrdem] = useState<'maior' | 'menor'>('maior')
  const hs = HABILIDADES.map((h) => ({ ...h, v: (c.r[h.id] as number) ?? 0 })).sort((a, b) => (ordem === 'maior' ? b.v - a.v : a.v - b.v))
  const hab = habilidades(c.r)
  return (
    <div className="tv-grade tv-grade--duas">
      <Cartao
        titulo="Suas principais habilidades"
        info
        sub="Estas são as habilidades que você avaliou no teste, com base na sua percepção."
        acao={
          <Select
            valor={ordem}
            rotulo="Ordenar"
            className="tv-select--p"
            onChange={setOrdem}
            opcoes={[
              { valor: 'maior', texto: 'Ordenar por: Maior facilidade' },
              { valor: 'menor', texto: 'Ordenar por: Menor facilidade' },
            ]}
          />
        }
      >
        <ol className="tv-ranking tv-ranking--hab">
          {hs.map((h, i) => {
            const I = HAB_IC[h.id]
            const cor = HAB_COR[Math.max(0, h.v - 1)]
            return (
              <motion.li key={h.id} layout style={{ '--c': cor } as CSSProperties} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                <span className="tv-ranking__ic tv-ranking__ic--solto">
                  <I size={22} strokeWidth={2} />
                </span>
                <span className="tv-ranking__nome">
                  {h.nome}
                  {hab.desenvolver.includes(h.nome) && <em>quer desenvolver</em>}
                </span>
                <Barra valor={(h.v / 5) * 100} cor={cor} rotulo={`${h.nome}: ${ESCALA.habilidade[h.v - 1] ?? 'sem resposta'}`} />
                <b>{h.v}</b>
              </motion.li>
            )
          })}
        </ol>
      </Cartao>
      <div className="tv-pilha">
        <Aviso titulo="O que são habilidades?">São capacidades que você utiliza para realizar tarefas, resolver problemas e aprender coisas novas. No teste, você avaliou como se percebe em cada habilidade.</Aviso>
        <Aviso I={Star} tom="lilas" titulo="Lembre-se">
          Essas habilidades são baseadas na sua percepção, não são uma prova de aptidão, e podem ser desenvolvidas ao longo do tempo.
        </Aviso>
        <div className="tv-card tv-oport">
          <span className="tv-dica__ic tv-dica__ic--roxo">
            <Target size={22} />
          </span>
          <div>
            <strong>Suas oportunidades de desenvolvimento</strong>
            <p>{hab.desenvolver.length ? 'Você escolheu desenvolver:' : 'Toda habilidade pode ser desenvolvida!'}</p>
            {hab.desenvolver.length > 0 && (
              <div className="tv-chips">
                {hab.desenvolver.map((h) => (
                  <span key={h} className="tv-chip tv-chip--roxo">
                    {h}
                  </span>
                ))}
              </div>
            )}
            <button className="tv-oport__btn" onClick={() => ir({ id: 'plano' })}>
              Ver sugestões de desenvolvimento <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
      <Cartao titulo="Como suas habilidades aparecem nas profissões recomendadas" info sub="Veja as competências mais usadas em algumas das profissões que combinam com você." className="tv-card--span2">
        <TresProfissoes
          c={c}
          render={(car) => (
            <>
              <small className="tv-tres__rot">Habilidades mais utilizadas:</small>
              <div className="tv-chips">
                {car.competencias.slice(0, 3).map((x, i) => (
                  <span key={x} className="tv-chip tv-chip--cor" style={{ '--c': ['#504cf2', '#2f7cf6', '#16b277'][i] } as CSSProperties}>
                    {x}
                  </span>
                ))}
              </div>
            </>
          )}
        />
      </Cartao>
    </div>
  )
}

/* ---------------- Próximos passos (Frame 14) ---------------- */
function Passos({ c, ehAtual, onClareza }: { c: Ctx; ehAtual: boolean; onClareza: () => void }) {
  const { s, ir, addAcao, toast, ultima } = useTv()
  const primeira = c.recs[0]?.id
  const sugestoes = primeira ? acoesSugeridas(CARREIRA[primeira]).slice(0, 3) : []
  const salvar = () => {
    const novas = sugestoes.filter((a) => !s.acoes.some((x) => x.texto === a.texto))
    novas.forEach((a) => addAcao({ texto: a.texto, tipo: a.tipo, carreira: primeira }))
    toast(novas.length ? `${novas.length} ações salvas no Meu Plano.` : 'Essas ações já estão no seu plano.', novas.length ? 'ok' : 'info', { rotulo: 'Ver plano', fn: () => ir({ id: 'plano' }) })
  }
  const checklist = [
    { t: 'Conhecer as profissões recomendadas', ok: s.eventos.some((e) => e.nome === 'career_recommendation_opened') },
    { t: 'Explorar opções de formação', ok: s.eventos.some((e) => e.nome === 'career_formation_viewed') },
    { t: 'Consumir conteúdos da área', ok: false },
    { t: 'Participar de eventos e conversas', ok: s.acoes.some((a) => a.feita && a.tipo === 'conversa') },
    { t: 'Adicionar ao Meu Plano', ok: s.acoes.length > 0 },
    { t: 'Revisar seus resultados no futuro', ok: s.tentativas.filter((x) => x.status === 'concluida').length > 1 },
  ]
  const fora = (n: string) => toast(`${n} fora do escopo deste protótipo.`, 'info')
  const passos = [
    { I: Compass, cor: 'roxo', t: 'Explore mais sobre as profissões recomendadas', d: 'Conheça os detalhes das carreiras que mais combinam com o seu perfil e adicione as que mais gostar aos seus favoritos.', btn: 'Ver profissões', fn: () => c.trocar('profissoes') },
    { I: GraduationCap, cor: 'azul', t: 'Pesquise cursos e formações', d: 'Veja as opções de formação, compare caminhos e entenda qual faz mais sentido para você.', btn: 'Explorar formações', fn: () => primeira && ir({ id: 'carreira', carreira: primeira, de: 'relatorio', aba: 'formacao' }) },
    { I: BookOpen, cor: 'verde', t: 'Aprofunde seus conhecimentos', d: 'Assista a vídeos, leia conteúdos e faça atividades sobre as áreas que mais despertam seu interesse.', btn: 'Ver conteúdos', fn: () => fora('Conteúdos') },
    { I: Users, cor: 'laranja', t: 'Converse com pessoas da área', d: 'Participe de eventos, lives e bate-papos com profissionais para conhecer diferentes experiências e tirar suas dúvidas.', btn: 'Ver eventos', fn: () => fora('Eventos') },
  ]
  const blocos = [
    { cor: 'verde', img: './voc/ref/pp-conteudos.webp', t: 'Conteúdos recomendados', d: 'Vídeos, artigos e materiais para você aprender mais sobre as áreas que mais combinam com você.', itens: [['./voc/ref/pp-c1.webp', 'O dia a dia de um Cientista de Dados'], ['./voc/ref/pp-c2.webp', 'Como é a carreira de Designer de Produto'], ['./voc/ref/pp-c3.webp', 'Tendências da Inteligência Artificial']], btn: 'Ver todos os conteúdos', fora: 'Conteúdos' },
    { cor: 'azul', img: './voc/ref/pp-univ.webp', t: 'Universidades em destaque', d: 'Conheça instituições que oferecem cursos nas áreas que mais se alinham ao seu perfil.', itens: [['./voc/ref/pp-u1.webp', 'USP · São Paulo - SP'], ['./voc/ref/pp-u2.webp', 'UFRJ · Rio de Janeiro - RJ'], ['./voc/ref/pp-u3.webp', 'PUC-Rio · Rio de Janeiro - RJ']], btn: 'Explorar mais universidades', fora: 'Universidades' },
    { cor: 'laranja', img: './voc/ref/pp-eventos.webp', t: 'Eventos e comunidades', d: 'Participe de eventos, lives e comunidades para trocar experiências e se conectar com profissionais da área.', itens: [['./voc/ref/pp-e1.webp', 'Bate-papo com Cientistas de Dados'], ['./voc/ref/pp-e2.webp', 'Carreiras em Tecnologia'], ['./voc/ref/pp-e3.webp', 'Design e Inovação na Prática']], btn: 'Ver todos os eventos', fora: 'Eventos' },
  ]
  return (
    <div className="tv-grade tv-grade--duas">
      <Cartao
        titulo="Seu plano de desenvolvimento"
        info
        sub="Aqui estão algumas sugestões personalizadas para você continuar explorando suas possibilidades."
        acao={
          <Btn variante="claro" pequeno icone={<Bookmark size={16} />} onClick={salvar}>
            Salvar no Meu Plano
          </Btn>
        }
      >
        <ol className="tv-plano4">
          {passos.map(({ I, cor, t, d, btn, fn }, i) => (
            <li key={t} className={`tv-plano4__i tv-plano4__i--${cor}`}>
              <span className="tv-plano4__n">{i + 1}</span>
              <span className={`tv-benef__ic tv-benef__ic--${cor}`}>
                <I size={26} strokeWidth={1.8} />
              </span>
              <span className="tv-plano4__txt">
                <strong>{t}</strong>
                <small>{d}</small>
              </span>
              <button className={`tv-pilula tv-pilula--${cor}`} onClick={fn}>
                {btn} <ArrowRight size={15} />
              </button>
            </li>
          ))}
        </ol>
      </Cartao>
      <div className="tv-pilha">
        <section className="tv-card tv-jornada">
          <div className="tv-jornada__cab">
            <span className="tv-dica__ic tv-dica__ic--roxo">
              <Rocket size={22} />
            </span>
            <div>
              <strong>Seu futuro é uma jornada</strong>
              <p>Não existe um caminho único. Use seus resultados como um guia para explorar, aprender e construir a sua própria trajetória.</p>
            </div>
          </div>
          <ul>
            {checklist.map((x) => (
              <li key={x.t} className={x.ok ? 'is-ok' : ''}>
                <CircleCheck size={19} /> {x.t}
              </li>
            ))}
          </ul>
        </section>
        {ehAtual && (
          <section className="tv-card tv-clarcard">
            {ultima?.clarezaPos ? (
              <div>
                <strong>Sua clareza sobre o futuro</strong>
                <div className="tv-clarcard__evol">
                  {ultima.clarezaPre ? (
                    <>
                      <span>
                        <small>Antes</small>
                        {ultima.clarezaPre}
                      </span>
                      <ArrowRight size={18} />
                    </>
                  ) : null}
                  <span className="is-on">
                    <small>Agora</small>
                    {ultima.clarezaPos.valor}
                  </span>
                </div>
                <p>{CLAREZA[ultima.clarezaPos.valor - 1].texto}.</p>
                <button className="tv-link" onClick={onClareza}>
                  Responder de novo
                </button>
              </div>
            ) : (
              <>
                <img src="./voc/thinking-face.webp" alt="" />
                <div>
                  <strong>Como você se sente agora?</strong>
                  <p>A mesma pergunta do início, para entender se a experiência ajudou. Leva 30 segundos e é opcional.</p>
                  <Btn pequeno onClick={onClareza} icone={<MessageCircleQuestion size={15} />}>
                    Responder
                  </Btn>
                </div>
              </>
            )}
          </section>
        )}
      </div>

      <div className="tv-tresblocos">
        {blocos.map((b) => (
          <section key={b.t} className={`tv-bloco3 tv-bloco3--${b.cor}`}>
            <div className="tv-bloco3__cab">
              <img src={b.img} alt="" />
              <div>
                <strong>{b.t}</strong>
                <p>{b.d}</p>
              </div>
            </div>
            <div className="tv-bloco3__itens">
              {b.itens.map(([img, t]) => (
                <button key={t} onClick={() => fora(b.fora)}>
                  <img src={img} alt="" />
                  <span>{t}</span>
                </button>
              ))}
            </div>
            <button className="tv-bloco3__btn" onClick={() => fora(b.fora)}>
              {b.btn} <ArrowRight size={16} />
            </button>
          </section>
        ))}
      </div>

      <section className="tv-card tv-card--span2 tv-reflexao">
        <h2>
          <img src="./voc/thinking-face.webp" alt="" /> Perguntas para refletir
        </h2>
        <ol>
          {perguntasReflexao(c.p.destaques.length ? c.p : { ...c.p, destaques: c.p.ordem.slice(0, 2) }).map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ol>
      </section>
    </div>
  )
}

/* ---------------- transparência: como chegamos (Princípio 7) ---------------- */
function ComoChegamos({ aberto, onFechar, p, versao, regras }: { aberto: boolean; onFechar: () => void; p: Perfil; versao: string; regras: string }) {
  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo="Como chegamos a este resultado" largura={620}>
      <div className="tv-como">
        <ol>
          <li>
            <strong>Somamos suas respostas em cada dimensão.</strong> Cada uma das seis dimensões do modelo RIASEC tem 5 atividades, com respostas de 1 a 5. A soma vai de 5 a 25 e vira uma nota de 0 a 100.
            <div className="tv-como__somas">
              {p.ordem.map((d) => (
                <span key={d}>
                  <DimBola d={d} tam={22} />
                  {DIM[d].tecnico}
                  <b>{p.soma[d]}/25</b>
                  <Barra valor={p.norm[d]} cor={DIM[d].cor} />
                </span>
              ))}
            </div>
          </li>
          <li>
            <strong>Destacamos até três dimensões (seu código).</strong> Se houver empate, as duas ficam; se tudo estiver muito parecido, dizemos isso em vez de forçar um resultado.
          </li>
          <li>
            <strong>Comparamos com as profissões do catálogo.</strong> Cada profissão tem um perfil de referência nas mesmas seis dimensões (fontes: CBO e O*NET). Calculamos a distância entre o seu perfil e o de cada profissão; as dimensões em que você demonstrou mais interesse pesam mais.
          </li>
          <li>
            <strong>Escolhemos seis possibilidades diversas.</strong> No máximo duas por dimensão principal e por área de atuação, com ao menos uma profissão pouco conhecida, para ampliar seu repertório.
          </li>
          <li>
            <strong>Valores, preferências e habilidades explicam, não eliminam.</strong> Eles aparecem nas justificativas e nos alertas de “vale investigar”, mas nunca tiram uma profissão da lista.
          </li>
        </ol>
        <p className="tv-como__nao">
          <TriangleAlert size={15} /> Não usamos gênero, escola, notas ou sua resposta de clareza para recomendar. Mesmas respostas, mesma versão, mesmo resultado. As notas não são percentual de aptidão nem chance de sucesso.
        </p>
        <small className="tv-versao">
          Instrumento {versao} · Regras de recomendação {regras}
        </small>
      </div>
    </Modal>
  )
}
