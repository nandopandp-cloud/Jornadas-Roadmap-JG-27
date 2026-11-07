import { AnimatePresence, motion } from 'framer-motion'
import { ImagePlus, Plus, Save, Star, Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { Btn, ChipRaridade, Select, Toggle } from '../components/ui'
import { AGORA, RARIDADES, fmt, type Item, type Raridade, type StatusItem } from '../data'
import { useAdm } from '../store'

type Form = { nome: string; cat: string; raridade: Raridade | ''; desc: string; pontos: string; tipo: 'digital' | 'fisico'; estoqueOn: boolean; estoque: string; limiteOn: boolean; limite: string; status: StatusItem; img: string; foto: boolean; filtro?: string }

/** Cadastrar / editar item */
export default function ItemForm({ id }: { id?: string }) {
  const { d, upd, ir, toast } = useAdm()
  const orig = id ? d.itens.find((i) => i.id === id) : undefined
  const [f, setF] = useState<Form>(() =>
    orig
      ? { nome: orig.nome, cat: orig.cat, raridade: orig.raridade, desc: orig.desc, pontos: fmt(orig.pontos), tipo: orig.tipo, estoqueOn: orig.estoque != null, estoque: orig.estoque != null ? String(orig.estoque) : '', limiteOn: orig.limite != null, limite: orig.limite != null ? String(orig.limite) : '', status: orig.status, img: orig.img, foto: !!orig.foto, filtro: orig.filtro }
      : { nome: '', cat: '', raridade: '', desc: '', pontos: '', tipo: 'digital', estoqueOn: false, estoque: '', limiteOn: false, limite: '', status: 'ativo', img: '', foto: false },
  )
  const [tentou, setTentou] = useState(false)
  const [arrastando, setArrastando] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const set = (p: Partial<Form>) => setF((x) => ({ ...x, ...p }))
  const num = (t: string) => Number(t.replace(/\D/g, '')) || 0

  const erros = {
    nome: !f.nome.trim() && 'Informe o nome do item.',
    cat: !f.cat && 'Escolha uma categoria.',
    raridade: !f.raridade && 'Escolha a raridade.',
    desc: !f.desc.trim() && 'Escreva uma descrição.',
    pontos: !num(f.pontos) && 'Informe os pontos necessários.',
    img: !f.img && 'Envie uma imagem.',
    estoque: f.estoqueOn && !num(f.estoque) && 'Informe a quantidade.',
    limite: f.limiteOn && !num(f.limite) && 'Informe o limite.',
  }
  const temErro = Object.values(erros).some(Boolean)
  const e = (k: keyof typeof erros) => (tentou ? erros[k] : false)

  const carregar = (arq?: File) => {
    if (!arq) return
    if (!/image\/(png|jpe?g|webp)/.test(arq.type)) return toast('Envie uma imagem PNG, JPG ou WEBP.', 'erro')
    if (arq.size > 5 * 1024 * 1024) return toast('A imagem deve ter até 5 MB.', 'erro')
    set({ img: URL.createObjectURL(arq), foto: false, filtro: undefined })
  }

  const salvar = () => {
    setTentou(true)
    if (temErro) return toast('Preencha os campos obrigatórios.', 'erro')
    const item: Item = {
      id: orig?.id ?? `novo-${Date.now().toString(36)}`,
      nome: f.nome.trim(),
      sub: f.desc.trim().split('.')[0].slice(0, 60) + '.',
      desc: f.desc.trim(),
      cat: f.cat,
      raridade: f.raridade as Raridade,
      pontos: num(f.pontos),
      estoque: f.estoqueOn ? num(f.estoque) : null,
      limite: f.limiteOn ? num(f.limite) : null,
      tipo: f.tipo,
      resgates: orig?.resgates ?? 0,
      status: f.status,
      atualizado: AGORA + 60_000,
      img: f.img,
      foto: f.foto,
      filtro: f.filtro,
    }
    upd((x) => ({ ...x, itens: orig ? x.itens.map((i) => (i.id === item.id ? item : i)) : [item, ...x.itens], destaque: item.id }))
    toast(orig ? 'Alterações salvas.' : f.status === 'rascunho' ? 'Item salvo como rascunho.' : f.status === 'ativo' ? 'Item cadastrado e publicado na Lojinha!' : 'Item cadastrado (inativo).')
    ir({ id: 'itens' }, -1)
  }

  return (
    <div className="ga-form">
      <div className="ga-form__grade">
        <div className="ga-form__esq">
          <section className="ga-card ga-bloco">
            <h3>Informações gerais</h3>
            <div className="ga-campos ga-campos--3">
              <label className={`ga-campo ${e('nome') ? 'is-erro' : ''}`}>
                <span>
                  Nome do item <b>*</b>
                </span>
                <input value={f.nome} onChange={(ev) => set({ nome: ev.target.value })} placeholder="Ex.: Traje Explorador Épico" maxLength={60} />
                {e('nome') && <small>{e('nome')}</small>}
              </label>
              <div className={`ga-campo ${e('cat') ? 'is-erro' : ''}`}>
                <span>
                  Categoria <b>*</b>
                </span>
                <Select valor={f.cat} onChange={(v) => set({ cat: v })} opcoes={[...(f.cat ? [] : [{ valor: '', texto: 'Selecione uma categoria' }]), ...d.cats.map((c) => ({ valor: c.id, texto: c.nome }))]} />
                {e('cat') && <small>{e('cat')}</small>}
              </div>
              <div className={`ga-campo ${e('raridade') ? 'is-erro' : ''}`}>
                <span>
                  Raridade <b>*</b>
                </span>
                <Select valor={f.raridade} onChange={(v) => set({ raridade: v as Raridade })} opcoes={[...(f.raridade ? [] : [{ valor: '' as const, texto: 'Selecione a raridade' }]), ...(Object.keys(RARIDADES) as Raridade[]).map((r) => ({ valor: r, texto: RARIDADES[r] }))]} />
                {e('raridade') && <small>{e('raridade')}</small>}
              </div>
            </div>
            <label className={`ga-campo ${e('desc') ? 'is-erro' : ''}`}>
              <span>
                Descrição <b>*</b>
              </span>
              <textarea value={f.desc} onChange={(ev) => set({ desc: ev.target.value.slice(0, 250) })} placeholder="Descreva o item para os estudantes..." rows={3} />
              <span className="ga-contador">{f.desc.length}/250</span>
              {e('desc') && <small>{e('desc')}</small>}
            </label>
          </section>

          <section className="ga-card ga-bloco">
            <h3>Configurações do resgate</h3>
            <div className="ga-campos ga-campos--resgate">
              <label className={`ga-campo ${e('pontos') ? 'is-erro' : ''}`}>
                <span>
                  Pontos necessários <b>*</b>
                </span>
                <input inputMode="numeric" value={f.pontos} onChange={(ev) => set({ pontos: num(ev.target.value) ? fmt(num(ev.target.value)) : '' })} placeholder="Ex.: 25.000" />
                {e('pontos') && <small>{e('pontos')}</small>}
              </label>
              <div className="ga-campo">
                <span>
                  Tipo de recompensa <b>*</b>
                </span>
                <div className="ga-radios">
                  {(
                    [
                      ['digital', 'Digital', 'Disponibilização automática'],
                      ['fisico', 'Física', 'Envio ao estudante'],
                    ] as const
                  ).map(([v, t, sub]) => (
                    <Radio key={v} on={f.tipo === v} onClick={() => set({ tipo: v, ...(v === 'fisico' && !f.estoqueOn ? { estoqueOn: true } : {}) })} t={t} sub={sub} />
                  ))}
                </div>
              </div>
            </div>
            <div className="ga-limites">
              <div>
                <span className="ga-limites__t">Controle de estoque</span>
                <span className="ga-limites__l">
                  <Toggle on={f.estoqueOn} onChange={(v) => set({ estoqueOn: v })} rotulo="Controle de estoque" />
                  Definir quantidade disponível para resgate
                </span>
                <AnimatePresence>
                  {f.estoqueOn && (
                    <motion.label className={`ga-campo ga-campo--mini ${e('estoque') ? 'is-erro' : ''}`} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                      <input inputMode="numeric" value={f.estoque} onChange={(ev) => set({ estoque: ev.target.value.replace(/\D/g, '') })} placeholder="Quantidade (ex.: 200)" />
                      {e('estoque') && <small>{e('estoque')}</small>}
                    </motion.label>
                  )}
                </AnimatePresence>
              </div>
              <div>
                <span className="ga-limites__t">Limite por estudante</span>
                <span className="ga-limites__l">
                  <Toggle on={f.limiteOn} onChange={(v) => set({ limiteOn: v })} rotulo="Limite por estudante" />
                  Definir quantidade máxima de resgates
                </span>
                <AnimatePresence>
                  {f.limiteOn && (
                    <motion.label className={`ga-campo ga-campo--mini ${e('limite') ? 'is-erro' : ''}`} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                      <input inputMode="numeric" value={f.limite} onChange={(ev) => set({ limite: ev.target.value.replace(/\D/g, '') })} placeholder="Máximo por estudante (ex.: 1)" />
                      {e('limite') && <small>{e('limite')}</small>}
                    </motion.label>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </section>

          <section className="ga-card ga-bloco">
            <h3>Status de publicação</h3>
            <div className="ga-radios ga-radios--3">
              <Radio on={f.status === 'ativo'} onClick={() => set({ status: 'ativo' })} t="Publicar agora" sub="O item ficará disponível na Lojinha" />
              <Radio on={f.status === 'rascunho'} onClick={() => set({ status: 'rascunho' })} t="Salvar como rascunho" sub="Continuar depois" />
              <Radio on={f.status === 'inativo'} onClick={() => set({ status: 'inativo' })} t="Inativar" sub="O item não ficará visível na Lojinha" />
            </div>
          </section>
        </div>

        <aside className="ga-form__dir">
          <section className={`ga-card ga-bloco ${e('img') ? 'is-erro' : ''}`}>
            <h3>
              Imagem do item <b>*</b>
            </h3>
            <div
              className={`ga-upload ${arrastando ? 'is-arrastando' : ''} ${f.img ? 'tem-img' : ''}`}
              onDragOver={(ev) => {
                ev.preventDefault()
                setArrastando(true)
              }}
              onDragLeave={() => setArrastando(false)}
              onDrop={(ev) => {
                ev.preventDefault()
                setArrastando(false)
                carregar(ev.dataTransfer.files[0])
              }}
            >
              <input ref={input} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={(ev) => carregar(ev.target.files?.[0])} />
              <AnimatePresence mode="wait">
                {f.img ? (
                  <motion.div key="img" className="ga-upload__img" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                    <img src={f.img} alt="Imagem do item" className={f.foto ? 'is-foto' : ''} style={f.filtro ? { filter: f.filtro } : undefined} />
                    <span className="ga-upload__acoes">
                      <Btn pequeno variante="contorno" onClick={() => input.current?.click()}>
                        Trocar
                      </Btn>
                      <Btn pequeno variante="contorno" icone={<Trash2 size={15} />} onClick={() => set({ img: '' })}>
                        Remover
                      </Btn>
                    </span>
                  </motion.div>
                ) : (
                  <motion.div key="vazio" className="ga-upload__vazio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <ImagePlus size={40} strokeWidth={1.4} />
                    <p>Arraste e solte uma imagem aqui ou</p>
                    <Btn variante="contorno" onClick={() => input.current?.click()}>
                      Selecionar arquivo
                    </Btn>
                    <button type="button" className="ga-link ga-upload__exemplo" onClick={() => set({ img: './admin/traje.webp', foto: false })}>
                      ou usar uma imagem de exemplo
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <p className={`ga-upload__dica ${e('img') ? 'is-erro' : ''}`}>{e('img') || 'PNG, JPG ou WEBP • Até 5 MB • Recomendado: 512 × 512 px'}</p>
          </section>

          <section className="ga-card ga-bloco">
            <h3>Pré-visualização</h3>
            <div className="ga-previa">
              <div className={`ga-previa__img ${f.img ? '' : 'is-vazio'} ${f.foto ? 'is-foto' : ''}`}>
                <AnimatePresence mode="wait">
                  <motion.img key={f.img || 'vazio'} src={f.img || './loja/lojinha.webp'} alt="" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={f.filtro ? { filter: f.filtro } : undefined} />
                </AnimatePresence>
              </div>
              <div className="ga-previa__txt">
                {f.nome ? <strong>{f.nome}</strong> : <i className="ga-esq ga-esq--g" />}
                {f.desc ? <p>{f.desc}</p> : (
                  <>
                    <i className="ga-esq" />
                    <i className="ga-esq ga-esq--c" />
                  </>
                )}
                <span className="ga-previa__rod">
                  <span className="ga-previa__pts">
                    <Star size={16} fill="currentColor" strokeWidth={0} /> {f.pontos ? `${f.pontos} pts` : '— pts'}
                  </span>
                  {f.raridade && <ChipRaridade r={f.raridade} />}
                </span>
              </div>
            </div>
          </section>
        </aside>
      </div>

      <footer className="ga-form__rodape">
        <Btn variante="contorno" onClick={() => ir({ id: 'itens' }, -1)}>
          Cancelar
        </Btn>
        <Btn icone={orig ? <Save size={19} /> : <Plus size={20} />} onClick={salvar}>
          {orig ? 'Salvar alterações' : 'Cadastrar item'}
        </Btn>
      </footer>
    </div>
  )
}

function Radio({ on, onClick, t, sub }: { on: boolean; onClick: () => void; t: string; sub: string }) {
  return (
    <button type="button" role="radio" aria-checked={on} className={`ga-radio ${on ? 'is-on' : ''}`} onClick={onClick}>
      <span className="ga-radio__bola">{on && <motion.i layoutId={undefined} initial={{ scale: 0 }} animate={{ scale: 1 }} />}</span>
      <span>
        <strong>{t}</strong>
        <small>{sub}</small>
      </span>
    </button>
  )
}
