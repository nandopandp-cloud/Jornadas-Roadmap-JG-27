// Plugin de acessibilidade (Perto Digital) no Prepara SP.
// Jornada: login → modal "Uma experiência mais personalizada para você!" → ativar recursos → página inicial já acessível
// (máscara e guia de leitura ligadas + atalhos Acessibilidade, Libras e Navegação por face).
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { LoaderCircle, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import type { PrototypeProps } from '../../platform/journeys'
import { A11yProvider, classesDe, useA11y, type Ajustes } from './a11y'
import { IconeAcess } from './icones'
import { FaceIntro, FaceNav } from './face'
import { Home, ModalAcessibilidade } from './home'
import { useLibras } from './libras'
import { Login } from './login'
import { Avisos, Dock, Guia, Leitor, Mascara, Painel, RastreioPonteiro, Teclado } from './recursos'
import './pd.css'

type Tela = 'login' | 'entrando' | 'home'
const ATIVACAO: Partial<Ajustes> = { mascara: true, guia: true }

type Inicio = { tela: Tela; modal: boolean; ativados: boolean; ajustes?: Partial<Ajustes>; painel?: boolean; face?: boolean }
function inicio(screen?: string | null): Inicio {
  switch (screen) {
    case 'modal':
      return { tela: 'home', modal: true, ativados: false }
    case 'home-acessivel':
      return { tela: 'home', modal: false, ativados: true, ajustes: ATIVACAO }
    case 'home':
      return { tela: 'home', modal: false, ativados: false }
    case 'painel':
      return { tela: 'home', modal: false, ativados: true, ajustes: ATIVACAO, painel: true }
    case 'navegacao-face':
      return { tela: 'home', modal: false, ativados: true, ajustes: ATIVACAO, face: true }
    default:
      return { tela: 'login', modal: false, ativados: false }
  }
}

export default function PluginPertoDigital({ startScreen }: PrototypeProps) {
  const [ini] = useState(() => inicio(startScreen))
  return (
    <A11yProvider inicial={ini.ajustes} ativadosInicial={ini.ativados}>
      <Jornada ini={ini} />
    </A11yProvider>
  )
}

function Jornada({ ini }: { ini: Inicio }) {
  const ctx = useA11y()
  const { a, set, setAtivados, ativados, abrirPainel, avisar } = ctx
  const [tela, setTela] = useState<Tela>(ini.tela)
  const [modal, setModal] = useState(ini.modal)
  const [dica, setDica] = useState(false)
  const [faceIntro, setFaceIntro] = useState(!!ini.face)
  const libras = useLibras()

  useEffect(() => {
    document.title = 'Prepara SP · Acessibilidade'
    if (ini.painel) abrirPainel(true)
  }, [ini.painel, abrirPainel])

  const entrar = useCallback(() => {
    setTela('entrando')
    window.setTimeout(() => {
      setTela('home')
      window.setTimeout(() => setModal(true), 700)
    }, 1100)
  }, [])

  const ativar = useCallback(() => {
    setModal(false)
    set(ATIVACAO)
    setAtivados(true)
    window.setTimeout(() => setDica(true), 900)
  }, [set, setAtivados])

  const sair = useCallback(() => {
    set({ libras: false, face: false })
    setAtivados(false)
    setDica(false)
    abrirPainel(false)
    setTela('login')
  }, [set, setAtivados, abrirPainel])

  const alternarFace = useCallback(() => {
    if (a.face) {
      set({ face: false })
      avisar('Navegação por face desativada', 'info')
    } else setFaceIntro(true)
  }, [a.face, set, avisar])

  return (
    <MotionConfig reducedMotion={a.pausar ? 'always' : 'user'}>
      <div className={`pd ${classesDe(a)}`}>
        <div className="pd-app">
          <AnimatePresence mode="wait">
            {tela === 'login' && (
              <motion.div key="login" className="pd-tela" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Login onEntrar={entrar} />
              </motion.div>
            )}
            {tela === 'entrando' && (
              <motion.div key="entrando" className="pd-tela pd-entrando" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="status">
                <motion.img src="./ppsp/logo.png" alt="Prepara SP" initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.6 }} />
                <span>
                  <LoaderCircle size={22} className="pd-gira" /> Preparando seus conteúdos…
                </span>
              </motion.div>
            )}
            {tela === 'home' && (
              <motion.div key="home" className="pd-tela" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Home onSair={sair} />
              </motion.div>
            )}
          </AnimatePresence>
          <ModalAcessibilidade aberto={modal} onFechar={() => setModal(false)} onAtivar={ativar} />
        </div>

        <RastreioPonteiro />
        <Teclado />
        <AnimatePresence>{a.mascara && <Mascara key="m" />}</AnimatePresence>
        <AnimatePresence>{a.guia && <Guia key="g" comMascara={a.mascara} />}</AnimatePresence>
        <AnimatePresence>{a.leitor && <Leitor key="l" />}</AnimatePresence>

        {tela !== 'entrando' && !modal && <Dock onLibras={libras} onFace={alternarFace} />}

        <AnimatePresence>
          {dica && ativados && (
            <motion.div
              className="pd-dica pd-sistema"
              role="dialog"
              aria-labelledby="pd-dica-t"
              initial={{ opacity: 0, x: 24, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            >
              <button className="pd-icone-btn pd-dica__x" onClick={() => setDica(false)} aria-label="Fechar dica">
                <X size={18} />
              </button>
              <span className="pd-dica__ic">
                <IconeAcess size={20} />
              </span>
              <strong id="pd-dica-t">Recursos ativados!</strong>
              <p>
                A <b>máscara de leitura</b> já está ligada: mova o mouse e só a linha que você está lendo fica em destaque.
              </p>
              <p>
                Use os botões ao lado para abrir o intérprete de <b>Libras</b>, navegar <b>com o rosto</b> ou ajustar tudo em <b>Acessibilidade</b>.
              </p>
              <div className="pd-dica__acoes">
                <button
                  className="pd-btn pd-btn--mini pd-btn--linha"
                  onClick={() => {
                    setDica(false)
                    abrirPainel(true)
                  }}
                >
                  Ver todos os recursos
                </button>
                <button className="pd-btn pd-btn--mini pd-btn--primario" onClick={() => setDica(false)}>
                  Entendi
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Painel onLibras={libras} onFace={alternarFace} />

        <FaceIntro
          aberto={faceIntro}
          onCancelar={() => setFaceIntro(false)}
          onAtivar={() => {
            setFaceIntro(false)
            abrirPainel(false)
            set({ face: true })
          }}
        />
        {a.face && <FaceNav onDesligar={() => set({ face: false })} />}

        <Avisos />
      </div>
    </MotionConfig>
  )
}
