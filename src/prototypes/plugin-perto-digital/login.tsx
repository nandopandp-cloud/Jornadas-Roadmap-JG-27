// Tela de login do Prepara SP (referência: captura 1).
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, CircleAlert, Eye, EyeOff, LoaderCircle, Lock, Mail, MailCheck } from 'lucide-react'
import { useState, type FormEvent } from 'react'

const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function Login({ onEntrar }: { onEntrar: () => void }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [ver, setVer] = useState(false)
  const [erros, setErros] = useState<{ email?: string; senha?: string }>({})
  const [enviando, setEnviando] = useState(false)
  const [modo, setModo] = useState<'login' | 'recuperar' | 'enviado'>('login')

  const entrar = (e: FormEvent) => {
    e.preventDefault()
    const n: typeof erros = {}
    if (!email.trim()) n.email = 'Digite seu e-mail.'
    else if (!EMAIL_OK.test(email.trim())) n.email = 'Confira o e-mail: ele precisa ter o formato nome@dominio.com.'
    if (!senha) n.senha = 'Digite sua senha.'
    setErros(n)
    if (Object.keys(n).length) return
    setEnviando(true)
    window.setTimeout(onEntrar, 900)
  }

  const recuperar = (e: FormEvent) => {
    e.preventDefault()
    if (!EMAIL_OK.test(email.trim())) return setErros({ email: 'Digite um e-mail válido para receber o link.' })
    setErros({})
    setModo('enviado')
  }

  return (
    <div className="pd-login">
      <div className="pd-login__arte" style={{ backgroundImage: "url(./ppsp/login-painel.jpg)" }} role="img" aria-label="Sala de estudos com a marca Prepara SP na parede" />
      <main className="pd-login__lado">
        <div className="pd-login__caixa">
          <img className="pd-login__logo" src="./ppsp/logo.png" alt="Prepara SP" />
          <AnimatePresence mode="wait" initial={false}>
            {modo === 'login' && (
              <motion.form key="login" onSubmit={entrar} noValidate initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
                <h1>Acesse sua conta</h1>
                <p className="pd-login__sub">Faça login para acessar seus conteúdos e atividades.</p>

                <label className="pd-campo__rot" htmlFor="pd-email">
                  E-mail
                </label>
                <div className={`pd-campo ${erros.email ? 'is-erro' : ''}`}>
                  <Mail size={20} aria-hidden />
                  <input
                    id="pd-email"
                    type="email"
                    autoComplete="email"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={!!erros.email}
                    aria-describedby={erros.email ? 'pd-email-erro' : undefined}
                  />
                </div>
                {erros.email && (
                  <p className="pd-campo__erro" id="pd-email-erro">
                    <CircleAlert size={15} /> {erros.email}
                  </p>
                )}

                <label className="pd-campo__rot" htmlFor="pd-senha">
                  Senha
                </label>
                <div className={`pd-campo ${erros.senha ? 'is-erro' : ''}`}>
                  <Lock size={20} aria-hidden />
                  <input
                    id="pd-senha"
                    type={ver ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    aria-invalid={!!erros.senha}
                    aria-describedby={erros.senha ? 'pd-senha-erro' : undefined}
                  />
                  <button type="button" className="pd-campo__olho" onClick={() => setVer((v) => !v)} aria-label={ver ? 'Ocultar senha' : 'Mostrar senha'}>
                    {ver ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {erros.senha && (
                  <p className="pd-campo__erro" id="pd-senha-erro">
                    <CircleAlert size={15} /> {erros.senha}
                  </p>
                )}

                <button className="pd-btn pd-btn--primario pd-btn--grande pd-login__entrar" type="submit" disabled={enviando}>
                  {enviando ? (
                    <>
                      <LoaderCircle size={20} className="pd-gira" /> Entrando…
                    </>
                  ) : (
                    'Entrar'
                  )}
                </button>
                <p className="pd-login__esqueci">
                  Esqueceu sua senha?{' '}
                  <button type="button" className="pd-link" onClick={() => setModo('recuperar')}>
                    Clique aqui
                  </button>
                </p>
              </motion.form>
            )}

            {modo === 'recuperar' && (
              <motion.form key="rec" onSubmit={recuperar} noValidate initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}>
                <button type="button" className="pd-voltar" onClick={() => setModo('login')}>
                  <ArrowLeft size={18} /> Voltar para o login
                </button>
                <h1>Recuperar senha</h1>
                <p className="pd-login__sub">Informe o e-mail da sua conta. Vamos enviar um link para você criar uma nova senha.</p>
                <label className="pd-campo__rot" htmlFor="pd-email-rec">
                  E-mail
                </label>
                <div className={`pd-campo ${erros.email ? 'is-erro' : ''}`}>
                  <Mail size={20} aria-hidden />
                  <input id="pd-email-rec" type="email" placeholder="Digite seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!erros.email} />
                </div>
                {erros.email && (
                  <p className="pd-campo__erro">
                    <CircleAlert size={15} /> {erros.email}
                  </p>
                )}
                <button className="pd-btn pd-btn--primario pd-btn--grande pd-login__entrar" type="submit">
                  Enviar link
                </button>
              </motion.form>
            )}

            {modo === 'enviado' && (
              <motion.div key="ok" className="pd-login__enviado" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <span className="pd-login__enviado-ic">
                  <MailCheck size={30} />
                </span>
                <h1>Confira seu e-mail</h1>
                <p className="pd-login__sub">
                  Se houver uma conta com <strong>{email}</strong>, você vai receber o link em alguns minutos.
                </p>
                <button className="pd-btn pd-btn--primario pd-btn--grande pd-login__entrar" onClick={() => setModo('login')}>
                  Voltar para o login
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
