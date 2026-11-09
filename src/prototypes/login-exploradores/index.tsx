import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  Camera,
  CameraOff,
  ChevronRight,
  CircleAlert,
  CircleHelp,
  Clock,
  Delete,
  Eye,
  EyeOff,
  Grid2x2,
  House,
  IdCard,
  KeyRound,
  Lock,
  Mail,
  QrCode,
  RotateCcw,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import type { PrototypeProps } from '../../platform/journeys'
import { Carteirinha } from '../login-comum/Carteirinha'
import './login.css'

/* =====================================================================
   Login simplificado · Exploradores (estudante)
   Telas E1–E15 do Figma (Yunara · tema Seafoam)
   ===================================================================== */

const L = './login/'
const ICONES = [
  ['foguete', 'Foguete'], ['planeta', 'Planeta'], ['estrela', 'Estrela'], ['lua', 'Lua'], ['alienigena', 'Alienígena'], ['satelite', 'Satélite'],
  ['astronauta', 'Astronauta'], ['sol', 'Sol'], ['asteroide', 'Asteroide'], ['cometa', 'Cometa'], ['galaxia', 'Galáxia'], ['disco', 'Disco voador'],
] as const
type Icone = (typeof ICONES)[number][0]
const NOME: Record<string, string> = Object.fromEntries(ICONES)
/** sequência impressa na carteirinha de exemplo da Ana Clara */
const CODIGO: Icone[] = ['foguete', 'planeta', 'estrela', 'cometa', 'lua', 'disco']
const ERRADA: Icone[] = ['foguete', 'planeta', 'estrela', 'lua', 'cometa', 'disco']
const TAM = 6
const TENTATIVAS = 5
const PAUSA_MS = 5 * 60 * 1000

type Tela = 'inicio' | 'camera' | 'lendo' | 'semcamera' | 'qrinvalido' | 'icones' | 'pausa' | 'email' | 'validando' | 'ola' | 'pausado'
const ATALHOS = ['inicio', 'camera', 'lendo', 'semcamera', 'qrinvalido', 'icones', 'icones-andamento', 'icones-completo', 'icones-erro', 'pausa', 'email', 'email-erro', 'validando', 'ola', 'pausado']

type Estado = {
  tela: Tela
  seq: Icone[]
  erro: boolean
  restantes: number
  pausaAte: number
  emailErro: boolean
  destino: 'ola' | 'pausado'
  dir: 1 | -1
}

function inicial(start?: string | null): Estado {
  const s = ATALHOS.includes(start ?? '') ? (start as string) : 'inicio'
  const base: Estado = { tela: 'inicio', seq: [], erro: false, restantes: TENTATIVAS, pausaAte: 0, emailErro: false, destino: 'ola', dir: 1 }
  if (s.startsWith('icones')) {
    const seq = s === 'icones-andamento' ? CODIGO.slice(0, 3) : s === 'icones-completo' ? [...CODIGO] : s === 'icones-erro' ? [...ERRADA] : []
    return { ...base, tela: 'icones', seq, erro: s === 'icones-erro', restantes: s === 'icones-erro' ? TENTATIVAS - 1 : TENTATIVAS }
  }
  if (s === 'email-erro') return { ...base, tela: 'email', emailErro: true }
  if (s === 'pausa') return { ...base, tela: 'pausa', pausaAte: Date.now() + PAUSA_MS, restantes: 0 }
  if (s === 'pausado') return { ...base, tela: 'pausado', destino: 'pausado' }
  return { ...base, tela: s as Tela }
}

export default function LoginExploradores({ startScreen }: PrototypeProps) {
  const [e, setE] = useState<Estado>(() => inicial(startScreen))
  const [cartao, setCartao] = useState(false)
  const [aviso, setAviso] = useState<string | null>(null)
  const [fim, setFim] = useState(false)
  useEffect(() => {
    document.title = 'Login simplificado · Exploradores · Protótipo Jovens Gênios'
  }, [])
  useEffect(() => {
    if (!aviso) return
    const t = setTimeout(() => setAviso(null), 3200)
    return () => clearTimeout(t)
  }, [aviso])

  const ir = (tela: Tela, extra: Partial<Estado> = {}, dir: 1 | -1 = 1) => setE((s) => ({ ...s, ...extra, tela, dir }))
  const voltar = () => ir('inicio', { seq: [], erro: false, emailErro: false }, -1)
  const validar = (destino: 'ola' | 'pausado' = e.destino === 'pausado' ? 'pausado' : 'ola') => ir('validando', { destino })
  const recomecar = () => {
    setFim(false)
    setE(inicial('inicio'))
  }

  const voltarVisivel = !['inicio', 'validando', 'ola'].includes(e.tela)

  return (
    <div className="lg">
      <aside className="lg-arte">
        <img src={`${L}arte-nacoes.webp`} alt="" draggable={false} />
        {voltarVisivel && (
          <Btn tipo="sec" tam="m" icon={ArrowLeft} className="lg-voltar" onClick={voltar}>
            Voltar
          </Btn>
        )}
      </aside>
      <main className="lg-lado">
        <AnimatePresence mode="wait" initial={false} custom={e.dir}>
          <motion.section
            key={e.tela + (e.tela === 'email' ? String(e.emailErro) : '')}
            className="lg-cartao"
            initial={{ opacity: 0, x: 24 * e.dir }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 * e.dir, transition: { duration: 0.14 } }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          >
            <img className="lg-logo" src={`${L}logo.webp`} alt="Jovens Gênios" />
            {e.tela === 'inicio' && <Inicio ir={ir} ajuda={() => setAviso('Chame seu professor: ele pode te ajudar a entrar.')} verCartao={() => setCartao(true)} />}
            {e.tela === 'camera' && <LigarCamera ir={ir} />}
            {e.tela === 'lendo' && <Lendo ir={ir} validar={() => validar()} />}
            {e.tela === 'semcamera' && <SemCamera ir={ir} />}
            {e.tela === 'qrinvalido' && <QrInvalido ir={ir} />}
            {e.tela === 'icones' && <Icones e={e} setE={setE} ir={ir} validar={() => validar()} verCartao={() => setCartao(true)} />}
            {e.tela === 'pausa' && <Pausa ate={e.pausaAte} ir={ir} ajuda={() => setAviso('Chame seu professor: ele pode te ajudar a entrar.')} />}
            {e.tela === 'email' && <Email erro={e.emailErro} ir={ir} entrar={(ok) => (ok ? validar() : ir('email', { emailErro: true }))} />}
            {e.tela === 'validando' && <Validando concluir={() => ir(e.destino)} />}
            {e.tela === 'ola' && <Ola entrar={() => setFim(true)} trocar={() => recomecar()} />}
            {e.tela === 'pausado' && <Pausado voltar={recomecar} />}
          </motion.section>
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {aviso && (
          <motion.div className="lg-toast is-info" role="status" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}>
            <CircleHelp size={22} />
            <span>{aviso}</span>
          </motion.div>
        )}
        {cartao && <ModalCartao fechar={() => setCartao(false)} />}
        {fim && (
          <motion.div className="lg-veu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="lg-modal lg-fim" initial={{ scale: 0.9, y: 16 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
              <img src={`${L}avatar.webp`} alt="" className="lg-fim-avatar" />
              <h2>Ana Clara entrou no Exploradores!</h2>
              <p>Aqui o estudante segue para a sua área, com o histórico e as atividades de sempre. Fim do protótipo de entrada.</p>
              <Btn tipo="pri" tam="g" icon={RotateCcw} full onClick={recomecar}>
                Recomeçar o protótipo
              </Btn>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ----------------------------------------------------------------- telas */
type Ir = (tela: Tela, extra?: Partial<Estado>, dir?: 1 | -1) => void

function Titulo({ t, s }: { t: string; s?: string }) {
  return (
    <header className="lg-titulo">
      <h1>{t}</h1>
      {s && <p>{s}</p>}
    </header>
  )
}

function Inicio({ ir, ajuda, verCartao }: { ir: Ir; ajuda: () => void; verCartao: () => void }) {
  return (
    <>
      <Titulo t="Que bom te ver por aqui!" s="Escolha como você quer entrar." />
      <div className="lg-pilha">
        <Opcao destaque titulo="Ler meu QR Code" sub="Mostre sua carteirinha para a câmera." onClick={() => ir('camera')}>
          <img src="./3d/camera.png" alt="" className="lg-opcao-img1" />
        </Opcao>
        <Opcao destaque titulo="Usar meu código de ícones" sub="Toque nos ícones da sua carteirinha." onClick={() => ir('icones', { seq: [], erro: false })}>
          <img src={`${L}icones/foguete.webp`} alt="" className="lg-opcao-a" />
          <img src={`${L}icones/planeta.webp`} alt="" className="lg-opcao-b" />
        </Opcao>
      </div>
      <Ou />
      <Btn tipo="sec" tam="m" icon={Mail} full onClick={() => ir('email', { emailErro: false })}>
        Entrar com e-mail e senha
      </Btn>
      <Btn tipo="ghost" tam="p" icon={CircleHelp} onClick={ajuda}>
        Precisa de ajuda? Chame seu professor
      </Btn>
      <button className="lg-dica" onClick={verCartao}>
        <IdCard size={15} /> Protótipo: ver a carteirinha de exemplo
      </button>
    </>
  )
}

function LigarCamera({ ir }: { ir: Ir }) {
  return (
    <>
      <Titulo t="Vamos usar a câmera" s="Ela vai ler o QR Code da sua carteirinha. Quando aparecer o aviso, toque em Permitir." />
      <div className="lg-ilus">
        <motion.div className="lg-ilus-cart" initial={{ rotate: 0, y: 8 }} animate={{ rotate: 6, y: 0 }} transition={{ type: 'spring', stiffness: 120, damping: 12 }}>
          <Carteirinha mini />
        </motion.div>
        <img src="./3d/camera.png" alt="" className="lg-ilus-cam" />
      </div>
      <Btn tipo="pri" tam="g" icon={Camera} full onClick={() => ir('lendo')}>
        Ligar a câmera
      </Btn>
      <Btn tipo="ghost" tam="p" icon={ArrowLeftRight} onClick={() => ir('inicio', {}, -1)}>
        Entrar de outro jeito
      </Btn>
    </>
  )
}

function Lendo({ ir, validar }: { ir: Ir; validar: () => void }) {
  const [achou, setAchou] = useState(false)
  const cb = useRef(validar)
  cb.current = validar
  useEffect(() => {
    const a = setTimeout(() => setAchou(true), 2200)
    const b = setTimeout(() => cb.current(), 2900)
    return () => {
      clearTimeout(a)
      clearTimeout(b)
    }
  }, [])
  return (
    <>
      <Titulo t="Mostre sua carteirinha" s="Deixe o QR Code dentro do quadrado." />
      <div className="lg-camera">
        <motion.div className="lg-camera-cart" initial={{ x: 140, y: 60, rotate: 14, opacity: 0 }} animate={{ x: 0, y: 0, rotate: -5, opacity: 1 }} transition={{ duration: 1.4, ease: [0.2, 0.8, 0.2, 1] }}>
          <Carteirinha />
        </motion.div>
        <div className={`lg-moldura ${achou ? 'is-ok' : ''}`}>
          <i />
          <i />
          <i />
          <i />
          {!achou && <span className="lg-linha" />}
        </div>
        <span className={`lg-camera-status ${achou ? 'is-ok' : ''}`}>
          <QrCode size={16} /> {achou ? 'Carteirinha encontrada!' : 'Procurando o QR Code…'}
        </span>
      </div>
      <div className="lg-par">
        <Btn tipo="sec" tam="m" icon={CameraOff} full onClick={() => ir('semcamera')}>
          Não consigo usar a câmera
        </Btn>
        <Btn tipo="sec" tam="m" icon={Grid2x2} full onClick={() => ir('icones', { seq: [], erro: false })}>
          Usar código de ícones
        </Btn>
      </div>
    </>
  )
}

function SemCamera({ ir }: { ir: Ir }) {
  return (
    <>
      <Ilus img="./3d/camera.png" selo={CameraOff} cor="vermelho" />
      <Titulo t="A câmera não ligou" s="Tudo bem! Você pode entrar de outro jeito ou pedir ajuda ao seu professor." />
      <div className="lg-pilha">
        <Opcao destaque titulo="Usar meu código de ícones" sub="Toque nos ícones da sua carteirinha." onClick={() => ir('icones', { seq: [], erro: false })}>
          <img src={`${L}icones/foguete.webp`} alt="" className="lg-opcao-a" />
          <img src={`${L}icones/planeta.webp`} alt="" className="lg-opcao-b" />
        </Opcao>
        <Opcao titulo="Entrar com e-mail e senha" sub="Se você já usa e-mail e senha." onClick={() => ir('email', { emailErro: false })}>
          <Mail size={28} />
        </Opcao>
      </div>
      <Btn tipo="ghost" tam="p" icon={RotateCcw} onClick={() => ir('lendo')}>
        Tentar a câmera de novo
      </Btn>
    </>
  )
}

function QrInvalido({ ir }: { ir: Ir }) {
  return (
    <>
      <div className="lg-ilus is-baixa">
        <img src={`${L}edubot.webp`} alt="" className="lg-ilus-bot" />
      </div>
      <Titulo t="Esse QR Code não funcionou" s="Talvez essa carteirinha não valha mais. Peça uma nova ao seu professor ou entre de outro jeito." />
      <Btn tipo="pri" tam="g" icon={RotateCcw} full onClick={() => ir('lendo')}>
        Tentar de novo
      </Btn>
      <div className="lg-par">
        <Btn tipo="sec" tam="m" icon={Grid2x2} full onClick={() => ir('icones', { seq: [], erro: false })}>
          Usar código de ícones
        </Btn>
        <Btn tipo="sec" tam="m" icon={Mail} full onClick={() => ir('email', { emailErro: false })}>
          E-mail e senha
        </Btn>
      </div>
    </>
  )
}

function Icones({ e, setE, ir, validar, verCartao }: { e: Estado; setE: (fn: (s: Estado) => Estado) => void; ir: Ir; validar: () => void; verCartao: () => void }) {
  const cheio = e.seq.length === TAM
  const toca = (id: Icone) => {
    if (e.erro || cheio) return
    setE((s) => ({ ...s, seq: [...s.seq, id] }))
  }
  const apagar = () => setE((s) => ({ ...s, seq: s.seq.slice(0, -1) }))
  const limpar = () => setE((s) => ({ ...s, seq: [], erro: false }))
  const entrar = () => {
    if (e.seq.join() === CODIGO.join()) return validar()
    const r = e.restantes - 1
    if (r <= 0) return ir('pausa', { pausaAte: Date.now() + PAUSA_MS, restantes: 0, seq: [], erro: false })
    setE((s) => ({ ...s, erro: true, restantes: r }))
  }
  return (
    <>
      <Titulo t="Digite seu código de ícones" s="Toque nos ícones na mesma ordem da sua carteirinha." />
      <div className={`lg-conf ${e.erro ? 'is-erro' : ''}`}>
        <div className="lg-conf-topo">
          <span>Sua sequência</span>
          <Selo cor={e.erro ? 'vermelho' : 'teal'}>{e.erro ? 'Tente de novo' : `${e.seq.length} de ${TAM}`}</Selo>
        </div>
        <ol className="lg-pos">
          {Array.from({ length: TAM }, (_, i) => {
            const id = e.seq[i]
            const st = e.erro ? 'errada' : id ? 'cheia' : i === e.seq.length ? 'atual' : 'vazia'
            const ultimo = !e.erro && id && i === e.seq.length - 1
            return (
              <li key={i} className={`lg-casa is-${st}`} aria-label={`Posição ${i + 1}${id ? ': ' + NOME[id] : ''}`}>
                <b>{i + 1}</b>
                <AnimatePresence>
                  {id && <motion.img key={id + i} src={`${L}icones/${id}.webp`} alt="" initial={{ scale: 0.3, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }} transition={{ type: 'spring', stiffness: 420, damping: 20 }} />}
                </AnimatePresence>
                {ultimo && (
                  <button className="lg-casa-x" onClick={apagar} aria-label="Remover ícone">
                    <X size={12} strokeWidth={3} />
                  </button>
                )}
              </li>
            )
          })}
        </ol>
      </div>
      <AnimatePresence>
        {e.erro && (
          <motion.div className="lg-aviso" role="alert" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <div>
              <CircleAlert size={22} />
              <span>
                <b>Ops! Essa não é a sequência certa.</b>
                Confira a ordem na sua carteirinha e tente de novo.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="lg-grade" role="group" aria-label="Ícones">
        {ICONES.map(([id, nome]) => (
          <motion.button key={id} className="lg-icone" whileTap={{ scale: 0.88 }} onClick={() => toca(id)} aria-label={nome} title={nome} disabled={e.erro || cheio}>
            <img src={`${L}icones/${id}.webp`} alt="" draggable={false} />
          </motion.button>
        ))}
      </div>
      {!e.erro && (
        <div className="lg-par">
          <Btn tipo="sec" tam="m" icon={Delete} full disabled={!e.seq.length} onClick={apagar}>
            Apagar último
          </Btn>
          <Btn tipo="sec" tam="m" icon={RotateCcw} full disabled={!e.seq.length} onClick={limpar}>
            Começar de novo
          </Btn>
        </div>
      )}
      <div className="lg-cta">
        {e.erro ? (
          <Btn tipo="pri" tam="g" icon={RotateCcw} full onClick={limpar}>
            Tentar de novo
          </Btn>
        ) : (
          <Btn tipo="pri" tam="g" iconR={ArrowRight} full disabled={!cheio} onClick={entrar}>
            Entrar
          </Btn>
        )}
        <small>{e.erro ? `Você ainda tem ${e.restantes} ${e.restantes === 1 ? 'tentativa' : 'tentativas'}.` : cheio ? 'Tudo pronto! Confira e toque em Entrar.' : `Complete os ${TAM} ícones para entrar.`}</small>
      </div>
      <Btn tipo="ghost" tam="p" icon={ArrowLeftRight} onClick={() => ir('inicio', { seq: [], erro: false }, -1)}>
        Entrar de outro jeito
      </Btn>
      <button className="lg-dica" onClick={verCartao}>
        <IdCard size={15} /> Protótipo: ver a carteirinha de exemplo
      </button>
    </>
  )
}

function Pausa({ ate, ir, ajuda }: { ate: number; ir: Ir; ajuda: () => void }) {
  const [agora, setAgora] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setAgora(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  const resta = Math.max(0, ate - agora)
  const mm = String(Math.floor(resta / 60000)).padStart(2, '0')
  const ss = String(Math.floor((resta % 60000) / 1000)).padStart(2, '0')
  return (
    <>
      <Ilus img="./3d/locked.png" selo={Clock} cor="amarelo" />
      <Titulo t="Vamos fazer uma pausa" s="Você tentou muitas vezes. Espere um pouquinho ou peça ajuda ao seu professor." />
      {resta > 0 ? (
        <Selo cor="amarelo" grande>
          <Clock size={18} /> Tente de novo em {mm}:{ss}
        </Selo>
      ) : (
        <Btn tipo="pri" tam="g" icon={Grid2x2} full onClick={() => ir('icones', { seq: [], erro: false, restantes: TENTATIVAS })}>
          Tentar o código de novo
        </Btn>
      )}
      <Btn tipo="sec" tam="m" icon={ArrowLeftRight} full onClick={() => ir('inicio', { seq: [], erro: false }, -1)}>
        Entrar de outro jeito
      </Btn>
      <Btn tipo="ghost" tam="p" icon={CircleHelp} onClick={ajuda}>
        Precisa de ajuda? Chame seu professor
      </Btn>
    </>
  )
}

function Email({ erro, ir, entrar }: { erro: boolean; ir: Ir; entrar: (ok: boolean) => void }) {
  const [email, setEmail] = useState(erro ? 'ana.silva@jovensgenios.com' : '')
  const [senha, setSenha] = useState(erro ? '12345678' : '')
  const [ver, setVer] = useState(false)
  const ok = /\S+@\S+\.\S+/.test(email) && senha.length >= 4
  return (
    <>
      <Titulo t="Entrar com e-mail e senha" s="Use o e-mail e a senha que você já tem." />
      {erro && (
        <div className="lg-aviso" role="alert">
          <div>
            <CircleAlert size={22} />
            <span>
              <b>E-mail ou senha incorretos</b>
              Confira o que você digitou e tente de novo.
            </span>
          </div>
        </div>
      )}
      <form
        className="lg-form"
        onSubmit={(ev) => {
          ev.preventDefault()
          entrar(ok && !(erro && senha === '12345678'))
        }}
      >
        <label className={`lg-campo ${erro ? 'is-erro' : ''}`}>
          <span>E-mail</span>
          <div>
            <Mail size={18} />
            <input type="email" placeholder="Digite seu e-mail" value={email} onChange={(v) => setEmail(v.target.value)} autoComplete="username" />
          </div>
        </label>
        <label className={`lg-campo ${erro ? 'is-erro' : ''}`}>
          <span>Senha</span>
          <div>
            <Lock size={18} />
            <input type={ver ? 'text' : 'password'} placeholder="Digite sua senha" value={senha} onChange={(v) => setSenha(v.target.value)} autoComplete="current-password" />
            <button type="button" onClick={() => setVer(!ver)} aria-label={ver ? 'Esconder senha' : 'Mostrar senha'}>
              {ver ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>
        <div className="lg-direita">
          <Btn tipo="ghost" tam="p" icon={KeyRound} type="button">
            Esqueci minha senha
          </Btn>
        </div>
        <Btn tipo="pri" tam="g" iconR={ArrowRight} full type="submit" disabled={!ok}>
          Entrar
        </Btn>
      </form>
      <Ou />
      <Btn tipo="sec" tam="m" icon={QrCode} full onClick={() => ir('inicio', {}, -1)}>
        Usar QR Code ou código de ícones
      </Btn>
    </>
  )
}

function Validando({ concluir }: { concluir: () => void }) {
  const cb = useRef(concluir)
  cb.current = concluir
  useEffect(() => {
    const t = setTimeout(() => cb.current(), 1900)
    return () => clearTimeout(t)
  }, [])
  return (
    <>
      <div className="lg-ilus is-orbita">
        <motion.span className="lg-orbita" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3.2, ease: 'linear' }}>
          <img src={`${L}icones/foguete.webp`} alt="" />
        </motion.span>
        <img src={`${L}pontos.webp`} alt="" className="lg-ilus-planeta" />
      </div>
      <Titulo t="Entrando na plataforma…" s="Estamos conferindo sua carteirinha. Só um instante!" />
      <div className="lg-progresso">
        <motion.span initial={{ width: '6%' }} animate={{ width: '100%' }} transition={{ duration: 1.8, ease: 'easeInOut' }} />
      </div>
    </>
  )
}

function Ola({ entrar, trocar }: { entrar: () => void; trocar: () => void }) {
  const [n, setN] = useState(3)
  const cb = useRef(entrar)
  cb.current = entrar
  useEffect(() => {
    if (n <= 0) {
      cb.current()
      return
    }
    const t = setTimeout(() => setN(n - 1), 1000)
    return () => clearTimeout(t)
  }, [n])
  return (
    <>
      <div className="lg-ilus is-avatar">
        <motion.img src="./3d/party.png" alt="" className="lg-ilus-confete" initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 12 }} transition={{ type: 'spring', delay: 0.15 }} />
        <motion.img src={`${L}avatar.webp`} alt="Avatar da Ana Clara" className="lg-ilus-avatar" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 16 }} />
        <motion.img src="./3d/sparkles.png" alt="" className="lg-ilus-brilho" initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} transition={{ delay: 0.3 }} />
      </div>
      <Titulo t="Oi, Ana Clara!" s="Que bom te ver de novo. Vamos explorar?" />
      <Btn tipo="pri" tam="g" iconR={ArrowRight} full onClick={entrar}>
        Começar
      </Btn>
      <small className="lg-nota">Você vai entrar em {Math.max(n, 0)} {n === 1 ? 'segundo' : 'segundos'}…</small>
      <Btn tipo="ghost" tam="p" icon={Users} onClick={trocar}>
        Não é você? Trocar de estudante
      </Btn>
    </>
  )
}

function Pausado({ voltar }: { voltar: () => void }) {
  return (
    <>
      <div className="lg-ilus is-baixa">
        <img src="./3d/locked.png" alt="" className="lg-ilus-cadeado" />
      </div>
      <Titulo t="Seu acesso está pausado" s="Por enquanto você não consegue entrar. Fale com seu professor para saber o que fazer." />
      <Btn tipo="sec" tam="m" icon={House} full onClick={voltar}>
        Voltar ao início
      </Btn>
    </>
  )
}

/* ----------------------------------------------------------- componentes */
function Btn({ tipo, tam, icon: I, iconR: R, full, className, children, ...p }: { tipo: 'pri' | 'sec' | 'ghost'; tam: 'p' | 'm' | 'g'; icon?: LucideIcon; iconR?: LucideIcon; full?: boolean } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" {...p} className={`lg-btn is-${tipo} is-${tam} ${full ? 'is-full' : ''} ${className ?? ''}`}>
      {I && <I size={tam === 'p' ? 16 : 20} strokeWidth={2.4} />}
      <span>{children}</span>
      {R && <R size={tam === 'p' ? 16 : 20} strokeWidth={2.4} />}
    </button>
  )
}

function Opcao({ titulo, sub, destaque, onClick, children }: { titulo: string; sub: string; destaque?: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <motion.button className={`lg-opcao ${destaque ? 'is-destaque' : ''}`} onClick={onClick} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
      <span className="lg-opcao-ic">{children}</span>
      <span className="lg-opcao-tx">
        <b>{titulo}</b>
        <small>{sub}</small>
      </span>
      <ChevronRight size={24} className="lg-opcao-seta" />
    </motion.button>
  )
}

function Ou() {
  return (
    <div className="lg-ou">
      <i />
      <span>ou</span>
      <i />
    </div>
  )
}

function Selo({ cor, grande, children }: { cor: 'teal' | 'vermelho' | 'amarelo'; grande?: boolean; children: ReactNode }) {
  return <span className={`lg-selo is-${cor} ${grande ? 'is-grande' : ''}`}>{children}</span>
}

function Ilus({ img, selo: S, cor }: { img: string; selo: LucideIcon; cor: 'vermelho' | 'amarelo' }) {
  return (
    <div className="lg-ilus is-baixa">
      <span className="lg-ilus-com-selo">
        <img src={img} alt="" />
        <motion.i className={`lg-ilus-selo is-${cor}`} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}>
          <S size={22} />
        </motion.i>
      </span>
    </div>
  )
}

function ModalCartao({ fechar }: { fechar: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const k = (ev: KeyboardEvent) => ev.key === 'Escape' && fechar()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [fechar])
  return (
    <motion.div className="lg-veu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={(ev) => ev.target === ev.currentTarget && fechar()}>
      <motion.div ref={ref} className="lg-modal" role="dialog" aria-label="Carteirinha de exemplo" initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}>
        <button className="lg-modal-x" onClick={fechar} aria-label="Fechar">
          <X size={20} />
        </button>
        <h2>Carteirinha da Ana Clara</h2>
        <p>Use o QR Code na leitura pela câmera ou toque nos ícones nessa ordem na tela do código.</p>
        <Carteirinha />
        <Btn tipo="pri" tam="m" full onClick={fechar}>
          Entendi
        </Btn>
      </motion.div>
    </motion.div>
  )
}
