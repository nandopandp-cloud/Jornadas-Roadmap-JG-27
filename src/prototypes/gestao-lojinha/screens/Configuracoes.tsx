import { AnimatePresence, motion } from 'framer-motion'
import { BarChart3, Bell, CalendarDays, Check, Coins, FileText, Layers, Palette, Plus, Settings, ShieldCheck, Star, Store, Trash2, Trophy } from 'lucide-react'
import { useState } from 'react'
import { Btn, Select, Toggle } from '../components/ui'
import { PLAT, fmt, type Config } from '../data'
import { useAdm } from '../store'

const SECOES = [
  { id: 'gerais', t: 'Configurações gerais', I: Settings, sub: 'Defina as configurações principais de funcionamento da Lojinha.' },
  { id: 'pontuacao', t: 'Regras de pontuação', I: Layers, sub: 'Quantos pontos cada atividade da plataforma vale.' },
  { id: 'restricoes', t: 'Restrições e limites', I: ShieldCheck, sub: 'Limites de resgate e regras de segurança.' },
  { id: 'aparencia', t: 'Aparência da Lojinha', I: Palette, sub: 'Cor de destaque e vitrine da Lojinha.' },
  { id: 'notificacoes', t: 'Notificações', I: Bell, sub: 'Quem recebe avisos sobre resgates e estoque.' },
  { id: 'politicas', t: 'Políticas e termos', I: FileText, sub: 'Texto exibido para os estudantes na aba Regras da Lojinha.' },
] as const
type Secao = (typeof SECOES)[number]['id']
const CORES = ['#7c3aed', '#029e8f', '#2563eb', '#ea580c', '#db2777', '#16a34a']

/** Configurações da Lojinha */
export default function Configuracoes({ secao: inicial }: { secao?: string }) {
  const { s, d, upd, toast } = useAdm()
  const [secao, setSecao] = useState<Secao>((SECOES.find((x) => x.id === inicial)?.id ?? 'gerais') as Secao)
  const [c, setC] = useState<Config>(d.config)
  const sujo = JSON.stringify(c) !== JSON.stringify(d.config)
  const set = (p: Partial<Config>) => setC((x) => ({ ...x, ...p }))
  const sec = SECOES.find((x) => x.id === secao)!
  return (
    <div className="ga-config">
      <nav className="ga-card ga-config__nav" aria-label="Seções">
        {SECOES.map((x) => (
          <button key={x.id} className={secao === x.id ? 'is-on' : ''} onClick={() => setSecao(x.id)}>
            {secao === x.id && <motion.span layoutId="ga-config-pill" className="ga-config__pill" transition={{ type: 'spring', stiffness: 480, damping: 38 }} />}
            <x.I size={22} strokeWidth={1.7} />
            <span>{x.t}</span>
          </button>
        ))}
      </nav>
      <section className="ga-card ga-config__corpo">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={secao} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6, transition: { duration: 0.1 } }}>
            <header className="ga-config__cab">
              <h2>{sec.t}</h2>
              <p>{sec.sub}</p>
            </header>
            {secao === 'gerais' && (
              <>
                <div className="ga-config__status">
                  <span className="ga-config__ic">
                    <Store size={24} strokeWidth={1.7} />
                  </span>
                  <span>
                    <strong>Status da Lojinha</strong>
                    <small>Ative ou desative a disponibilidade da Lojinha na plataforma.</small>
                  </span>
                  <Toggle on={c.ativa} onChange={(v) => set({ ativa: v })} rotulo="Lojinha ativa" />
                  <b className={c.ativa ? '' : 'is-off'}>{c.ativa ? 'Ativa' : 'Inativa'}</b>
                </div>
                <div className="ga-campos ga-campos--2">
                  <label className="ga-campo">
                    <span>Nome da Lojinha</span>
                    <input value={c.nome} onChange={(e) => set({ nome: e.target.value })} />
                  </label>
                  <label className="ga-campo">
                    <span>
                      Descrição <i>(opcional)</i>
                    </span>
                    <textarea rows={2} value={c.descricao} onChange={(e) => set({ descricao: e.target.value.slice(0, 120) })} />
                    <span className="ga-contador">{c.descricao.length}/120</span>
                  </label>
                </div>
                <div className="ga-campos ga-campos--2 ga-config__duas">
                  <div className="ga-config__item">
                    <span className="ga-config__ic">
                      <Coins size={22} strokeWidth={1.7} />
                    </span>
                    <div>
                      <strong>Moeda de pontuação</strong>
                      <small>Nome como os pontos serão exibidos na Lojinha.</small>
                      <input className="ga-input" value={c.moeda} onChange={(e) => set({ moeda: e.target.value })} />
                    </div>
                  </div>
                  <div className="ga-config__item">
                    <span className="ga-config__ic">
                      <CalendarDays size={22} strokeWidth={1.7} />
                    </span>
                    <div>
                      <strong>
                        Validade dos pontos <i>(opcional)</i>
                      </strong>
                      <small>Defina um prazo de expiração para os pontos.</small>
                      <Select
                        valor={c.validade}
                        onChange={(v) => set({ validade: v })}
                        opcoes={[
                          { valor: 'nunca', texto: 'Não expiram' },
                          { valor: '6m', texto: '6 meses' },
                          { valor: '12m', texto: '12 meses' },
                          { valor: '24m', texto: '24 meses' },
                        ]}
                      />
                    </div>
                  </div>
                </div>
                <h3 className="ga-config__sub">Exibição de informações</h3>
                <div className="ga-config__cards">
                  {(
                    [
                      ['exibirSaldo', Trophy, 'Exibir saldo de pontos', 'Mostra o saldo do estudante na Lojinha.'],
                      ['exibirDestaques', Star, 'Exibir itens em destaque', 'Mostra uma vitrine com itens selecionados.'],
                      ['exibirContador', BarChart3, 'Exibir contador de resgates', 'Mostra quantas vezes o item já foi resgatado.'],
                    ] as const
                  ).map(([k, I, t, sub]) => (
                    <div key={k} className="ga-config__card">
                      <I size={26} strokeWidth={1.6} />
                      <span>
                        <strong>{t}</strong>
                        <small>{sub}</small>
                      </span>
                      <Toggle on={c[k]} onChange={(v) => set({ [k]: v } as Partial<Config>)} rotulo={t} />
                    </div>
                  ))}
                </div>
              </>
            )}

            {secao === 'pontuacao' && (
              <div className="ga-regras">
                {c.regras.map((r, i) => (
                  <motion.div key={i} className={`ga-regra ${r.ativa ? '' : 'is-off'}`} layout>
                    <Toggle on={r.ativa} onChange={(v) => set({ regras: c.regras.map((x, k) => (k === i ? { ...x, ativa: v } : x)) })} rotulo={`Ativar ${r.atividade}`} />
                    <input className="ga-input ga-regra__nome" value={r.atividade} onChange={(e) => set({ regras: c.regras.map((x, k) => (k === i ? { ...x, atividade: e.target.value } : x)) })} />
                    <span className="ga-regra__pts">
                      <input className="ga-input" inputMode="numeric" value={fmt(r.pontos)} onChange={(e) => set({ regras: c.regras.map((x, k) => (k === i ? { ...x, pontos: Number(e.target.value.replace(/\D/g, '')) || 0 } : x)) })} />
                      pts
                    </span>
                    <button className="ga-acao" onClick={() => set({ regras: c.regras.filter((_, k) => k !== i) })} aria-label="Remover regra">
                      <Trash2 size={17} />
                    </button>
                  </motion.div>
                ))}
                <Btn variante="contorno" icone={<Plus size={18} />} onClick={() => set({ regras: [...c.regras, { atividade: 'Nova atividade', pontos: 5000, ativa: true }] })}>
                  Adicionar regra
                </Btn>
              </div>
            )}

            {secao === 'restricoes' && (
              <div className="ga-config__lista">
                <label className="ga-config__linha">
                  <span>
                    <strong>Resgates por mês</strong>
                    <small>Máximo de resgates de cada estudante por mês.</small>
                  </span>
                  <input className="ga-input ga-input--n" inputMode="numeric" value={c.limiteMensal} onChange={(e) => set({ limiteMensal: Number(e.target.value.replace(/\D/g, '')) || 0 })} />
                </label>
                <label className="ga-config__linha">
                  <span>
                    <strong>Resgates por dia</strong>
                    <small>Evita resgates em sequência por engano.</small>
                  </span>
                  <input className="ga-input ga-input--n" inputMode="numeric" value={c.limiteDiario} onChange={(e) => set({ limiteDiario: Number(e.target.value.replace(/\D/g, '')) || 0 })} />
                </label>
                <div className="ga-config__linha">
                  <span>
                    <strong>Aprovação manual de itens físicos</strong>
                    <small>Resgates de itens físicos aguardam aprovação da equipe.</small>
                  </span>
                  <Toggle on={c.aprovacaoFisicos} onChange={(v) => set({ aprovacaoFisicos: v })} rotulo="Aprovação manual" />
                </div>
                <div className="ga-config__linha">
                  <span>
                    <strong>Bloquear contas inativas</strong>
                    <small>Estudantes inativos não conseguem resgatar.</small>
                  </span>
                  <Toggle on={c.bloquearInativos} onChange={(v) => set({ bloquearInativos: v })} rotulo="Bloquear inativos" />
                </div>
              </div>
            )}

            {secao === 'aparencia' && (
              <div className="ga-aparencia">
                <div>
                  <h3 className="ga-config__sub">Cor de destaque</h3>
                  <div className="ga-cores">
                    {CORES.map((cor) => (
                      <button key={cor} style={{ background: cor }} className={c.cor === cor ? 'is-on' : ''} onClick={() => set({ cor })} aria-label={`Cor ${cor}`}>
                        {c.cor === cor && <Check size={18} strokeWidth={3} />}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="ga-aparencia__previa" style={{ '--cor': c.cor } as React.CSSProperties}>
                  <span className="ga-aparencia__banner">
                    <strong>{c.nome}</strong>
                    <small>{c.descricao}</small>
                  </span>
                  <span className="ga-aparencia__cards">
                    {d.itens.slice(0, 3).map((i) => (
                      <span key={i.id}>
                        <img src={i.img} alt="" />
                        <b>{fmt(i.pontos)} {c.moeda}</b>
                        <em>Resgatar</em>
                      </span>
                    ))}
                  </span>
                </div>
              </div>
            )}

            {secao === 'notificacoes' && (
              <div className="ga-config__lista">
                {(
                  [
                    ['notifResgate', 'Novo resgate', 'Avisar a equipe a cada resgate de item físico.'],
                    ['notifEnvio', 'Item enviado', 'Avisar o estudante quando o item sair para a escola.'],
                    ['notifEstoque', 'Estoque baixo', 'Avisar quando um item tiver menos de 10 unidades.'],
                  ] as const
                ).map(([k, t, sub]) => (
                  <div key={k} className="ga-config__linha">
                    <span>
                      <strong>{t}</strong>
                      <small>{sub}</small>
                    </span>
                    <Toggle on={c[k]} onChange={(v) => set({ [k]: v } as Partial<Config>)} rotulo={t} />
                  </div>
                ))}
                <label className="ga-campo">
                  <span>E-mail da equipe responsável</span>
                  <input value={c.notifEmail} onChange={(e) => set({ notifEmail: e.target.value })} />
                </label>
              </div>
            )}

            {secao === 'politicas' && (
              <label className="ga-campo">
                <span>Termos da Lojinha</span>
                <textarea rows={8} value={c.termos} onChange={(e) => set({ termos: e.target.value })} />
              </label>
            )}
          </motion.div>
        </AnimatePresence>

        <footer className="ga-config__rodape">
          <AnimatePresence>
            {sujo && (
              <motion.span className="ga-config__aviso" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                Alterações não salvas
              </motion.span>
            )}
          </AnimatePresence>
          <span className="ga-esp" />
          <Btn variante="contorno" disabled={!sujo} onClick={() => setC(d.config)}>
            Cancelar
          </Btn>
          <Btn
            icone={<Check size={19} />}
            disabled={!sujo}
            onClick={() => {
              upd((x) => ({ ...x, config: c }))
              toast(`Configurações da Lojinha de ${PLAT[s.plataforma].nome} salvas.`)
            }}
          >
            Salvar configurações
          </Btn>
        </footer>
      </section>
    </div>
  )
}
