import { motion } from 'framer-motion'
import { ArrowLeft, Building2, Check, ChevronDown, Copy, Coins, FileText, Landmark, MessageSquarePlus, RefreshCw, Tag, UsersRound, Wallet, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { usePessoa } from '../components/dados'
import { Avatar, Btn, ChipRaridade, ChipStatus, Modal, Pop } from '../components/ui'
import { AGORA, PLAT, STATUS_RESGATE, dataCurta, dataHora, dataLonga, pts, type StatusResgate } from '../data'
import { ROTULO_EVENTO, useAdm, type Evento } from '../store'

const ETAPAS: StatusResgate[] = ['solicitado', 'aprovado', 'enviado', 'concluido']
const ORDEM: Record<StatusResgate, number> = { solicitado: 0, processamento: 0.5, aprovado: 1, enviado: 2, concluido: 3, cancelado: -1 }
/** quando cada etapa aconteceu (histórico padrão gerado a partir da data do pedido) */
const DESLOC: Record<string, number> = { solicitado: 0, processamento: 5, aprovado: 11, enviado: 236, concluido: 1366 }

/** Detalhes de um resgate */
export default function ResgateDetalhe({ codigo }: { codigo: string }) {
  const { s, d, ir, upd, mudarStatus, toast } = useAdm()
  const r = d.resgates.find((x) => x.codigo === codigo)
  const [menu, setMenu] = useState(false)
  const [cancelar, setCancelar] = useState(false)
  const [nota, setNota] = useState<string | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const p = usePessoa(r?.pessoa ?? 0)
  if (!r)
    return (
      <div className="ga-card ga-vazio">
        Resgate não encontrado nesta plataforma. <Btn onClick={() => ir({ id: 'resgates' }, -1)}>Voltar para a lista</Btn>
      </div>
    )
  const it = d.itens.find((i) => i.id === r.item)!
  const pl = PLAT[s.plataforma]
  const nivel = ORDEM[r.status]
  const cancelado = r.status === 'cancelado'

  // histórico: etapas padrão até o status atual + ações feitas no admin
  const padrao: Evento[] = (['solicitado', 'aprovado', 'enviado', 'concluido'] as StatusResgate[])
    .filter((e) => (cancelado ? e === 'solicitado' : ORDEM[e] <= nivel))
    .map((e) => ({ acao: ROTULO_EVENTO[e], data: r.data + DESLOC[e] * 60_000, autor: e === 'solicitado' ? p.nome : 'Sistema' }))
  const extras = d.eventos[codigo] ?? []
  const historico = [...extras, ...[...padrao].reverse()].filter((e, i, xs) => xs.findIndex((y) => y.acao === e.acao) === i)
  const quando = (e: StatusResgate) => historico.find((h) => h.acao === ROTULO_EVENTO[e])?.data
  const notas = d.notas[codigo] ?? []
  const antes = p.saldo + r.pontos

  const aplicarStatus = (st: StatusResgate) => {
    mudarStatus(codigo, st)
    toast(st === 'cancelado' ? `Resgate cancelado. ${pts(r.pontos)} estornados para ${p.nome}.` : `Status alterado para “${STATUS_RESGATE[st]}”.`, st === 'cancelado' ? 'info' : 'ok')
  }

  return (
    <div className="ga-det">
      <section className="ga-card ga-det__cab">
        <div>
          <h2>
            Resgate {codigo}
            <button
              className="ga-acao ga-acao--leve"
              onClick={() => {
                navigator.clipboard?.writeText(codigo).catch(() => {})
                toast('Código copiado.')
              }}
              aria-label="Copiar código"
              title="Copiar código"
            >
              <Copy size={18} />
            </button>
          </h2>
          <p>Solicitado em {dataLonga(r.data)}</p>
        </div>
        <motion.span key={r.status} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 16 }}>
          <ChipStatus st={r.status} />
        </motion.span>
      </section>

      <div className="ga-det__grade">
        <div className="ga-det__esq">
          <section className="ga-card ga-bloco">
            <h3>Item resgatado</h3>
            <div className="ga-det__item">
              <div className={`ga-det__img ${it.foto ? 'is-foto' : ''}`}>
                <img src={it.id === 'traje-explorador-epico' ? './admin/traje-detalhe.webp' : it.img} alt="" className={it.id === 'traje-explorador-epico' ? 'is-cheia' : ''} style={it.filtro ? { filter: it.filtro } : undefined} />
              </div>
              <div className="ga-det__itemtxt">
                <strong>{it.nome}</strong>
                <ChipRaridade r={it.raridade} />
                <p>{it.desc}</p>
              </div>
              <span className="ga-det__pts">
                <Coins size={24} /> {pts(r.pontos)}
              </span>
            </div>
          </section>

          <section className="ga-card ga-bloco">
            <h3>Dados do {pl.singular.toLowerCase()}</h3>
            <button className="ga-det__pessoa" onClick={() => ir({ id: 'estudante', pessoa: r.pessoa })} title="Abrir perfil">
              <Avatar nome={p.nome} tam={58} />
              <span className="ga-det__nome">
                <strong>{p.nome}</strong>
                <small>ID: {p.id}</small>
              </span>
              <i className="ga-det__div" />
              <Info I={Landmark} t="Rede" v={p.rede} />
              <Info I={Building2} t="Escola" v={p.escola} />
              <Info I={UsersRound} t={s.plataforma === 'educadores' ? 'Função' : 'Turma'} v={p.turma} />
            </button>
          </section>

          <section className="ga-card ga-bloco">
            <h3>Andamento do resgate</h3>
            <ol className={`ga-passos ${cancelado ? 'is-cancelado' : ''}`}>
              {ETAPAS.map((e, k) => {
                const feito = !cancelado ? ORDEM[e] <= nivel : e === 'solicitado'
                const t = quando(e)
                return (
                  <li key={e} className={feito ? 'is-feito' : ''}>
                    {k > 0 && (
                      <span className="ga-passos__linha">
                        <motion.i initial={false} animate={{ scaleX: feito ? 1 : 0 }} transition={{ duration: 0.4, delay: 0.1 }} />
                      </span>
                    )}
                    <motion.span className="ga-passos__bola" initial={false} animate={{ scale: feito ? [1, 1.25, 1] : 1 }} transition={{ duration: 0.35 }}>
                      {feito ? <Check size={17} strokeWidth={3.4} /> : cancelado && k === 1 ? <X size={16} strokeWidth={3} /> : null}
                    </motion.span>
                    <strong>{cancelado && k === 1 ? 'Cancelado' : STATUS_RESGATE[e]}</strong>
                    <small>{t && feito ? dataCurta(t) : cancelado && k === 1 ? dataCurta(historico[0].data) : '—'}</small>
                  </li>
                )
              })}
            </ol>
          </section>
        </div>

        <div className="ga-det__dir">
          <section className="ga-card ga-bloco">
            <h3>Informações do resgate</h3>
            <dl className="ga-infos">
              <Linha I={Coins} t="Pontos utilizados" v={pts(r.pontos)} />
              <Linha I={Wallet} t="Saldo antes do resgate" v={pts(antes)} />
              <Linha I={Wallet} t="Saldo após o resgate" v={pts(cancelado ? antes : p.saldo)} />
              <Linha I={Tag} t="Tipo de recompensa" v={it.tipo === 'digital' ? 'Digital' : 'Física'} />
            </dl>
          </section>
          <section className="ga-card ga-bloco">
            <h3>Observações</h3>
            <div className="ga-obs">
              <FileText size={22} strokeWidth={1.6} />
              <p>{it.tipo === 'digital' ? `Item disponibilizado automaticamente na conta do ${pl.singular.toLowerCase()}.` : 'Item físico: entrega na escola em até 15 dias úteis.'}</p>
            </div>
            {notas.map((n, i) => (
              <motion.div key={i} className="ga-obs ga-obs--nota" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
                <MessageSquarePlus size={20} strokeWidth={1.6} />
                <p>
                  {n.texto}
                  <small>
                    {n.autor} · {dataHora(n.data)}
                  </small>
                </p>
              </motion.div>
            ))}
          </section>
          <section className="ga-card ga-bloco">
            <h3>Histórico de ações</h3>
            <ol className="ga-hist">
              {historico.map((h, i) => (
                <motion.li key={h.acao + h.data} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className={h.acao.includes('cancelado') ? 'is-cancel' : ''}>
                  <i />
                  <strong>{h.acao}</strong>
                  <small>{dataLonga(h.data)}</small>
                </motion.li>
              ))}
            </ol>
          </section>
        </div>
      </div>

      <footer className="ga-det__rodape">
        <Btn variante="contorno" icone={<ArrowLeft size={19} />} onClick={() => ir({ id: 'resgates' }, -1)}>
          Voltar para a lista
        </Btn>
        <span className="ga-esp" />
        <Btn variante="contorno" icone={<MessageSquarePlus size={19} />} onClick={() => setNota('')}>
          Adicionar observação
        </Btn>
        <span ref={btnRef as never} className="ga-inline">
          <Btn icone={<RefreshCw size={19} />} iconeDir={<ChevronDown size={18} />} onClick={() => setMenu((m) => !m)} disabled={cancelado}>
            Alterar status
          </Btn>
        </span>
        <Pop aberto={menu} ancora={btnRef} alinhar="dir" onFechar={() => setMenu(false)} className="ga-pop--menu">
          {(['solicitado', 'processamento', 'aprovado', 'enviado', 'concluido'] as StatusResgate[]).map((st) => (
            <button
              key={st}
              className={r.status === st ? 'is-atual' : ''}
              disabled={r.status === st}
              onClick={() => {
                setMenu(false)
                aplicarStatus(st)
              }}
            >
              <ChipStatus st={st} />
              {r.status === st && <small>atual</small>}
            </button>
          ))}
          <hr />
          <button
            className="is-perigo"
            onClick={() => {
              setMenu(false)
              setCancelar(true)
            }}
          >
            <X size={16} /> Cancelar e estornar pontos
          </button>
        </Pop>
      </footer>

      <Modal
        aberto={cancelar}
        onFechar={() => setCancelar(false)}
        titulo="Cancelar este resgate?"
        sub={`Os ${pts(r.pontos)} voltam para o saldo de ${p.nome} e o item é retirado da conta.`}
        rodape={
          <>
            <Btn variante="contorno" onClick={() => setCancelar(false)}>
              Manter resgate
            </Btn>
            <Btn
              variante="perigo"
              onClick={() => {
                setCancelar(false)
                aplicarStatus('cancelado')
                upd((x) => ({ ...x, ajustes: { ...x.ajustes, [r.pessoa]: [...(x.ajustes[r.pessoa] ?? []), { id: `EST-${Date.now()}`, data: AGORA + 120_000, tipo: 'estorno', desc: `Estorno do resgate ${codigo}`, origem: 'Lojinha', pontos: r.pontos, saldoApos: 0, resp: 'FernanDesigner' }] } }))
              }}
            >
              Cancelar e estornar
            </Btn>
          </>
        }
      >
        <p className="ga-texto">O {pl.singular.toLowerCase()} é avisado por notificação na plataforma.</p>
      </Modal>

      <Modal
        aberto={nota !== null}
        onFechar={() => setNota(null)}
        titulo="Adicionar observação"
        sub="A observação fica registrada no histórico do resgate (visível só para a equipe)."
        rodape={
          <>
            <Btn variante="contorno" onClick={() => setNota(null)}>
              Cancelar
            </Btn>
            <Btn
              disabled={!nota?.trim()}
              onClick={() => {
                const texto = nota!.trim()
                upd((x) => ({
                  ...x,
                  notas: { ...x.notas, [codigo]: [...(x.notas[codigo] ?? []), { texto, data: AGORA + 60_000, autor: 'FernanDesigner' }] },
                  eventos: { ...x.eventos, [codigo]: [{ acao: 'Observação adicionada', data: AGORA + 60_000 + (x.eventos[codigo]?.length ?? 0) * 1000, autor: 'FernanDesigner' }, ...(x.eventos[codigo] ?? [])] },
                }))
                setNota(null)
                toast('Observação adicionada.')
              }}
            >
              Salvar observação
            </Btn>
          </>
        }
      >
        <label className="ga-campo">
          <span>Observação</span>
          <textarea rows={4} value={nota ?? ''} onChange={(e) => setNota(e.target.value)} placeholder="Ex.: Estudante pediu para retirar na secretaria." autoFocus />
        </label>
      </Modal>
    </div>
  )
}

function Info({ I, t, v }: { I: typeof Landmark; t: string; v: string }) {
  return (
    <span className="ga-det__info">
      <small>
        <I size={17} strokeWidth={1.7} /> {t}
      </small>
      <strong>{v}</strong>
    </span>
  )
}
function Linha({ I, t, v }: { I: typeof Coins; t: string; v: string }) {
  return (
    <div>
      <dt>
        <I size={19} strokeWidth={1.7} /> {t}
      </dt>
      <dd>{v}</dd>
    </div>
  )
}
