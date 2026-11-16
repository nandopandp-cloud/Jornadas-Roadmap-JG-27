// Sobrepostos do Modo Lição: estudantes da turma, exemplos de questões, resumo, vídeo, áudio e prévia de conteúdo.
import {
  Bold,
  Check,
  CircleCheck,
  ExternalLink,
  Eye,
  Heading2,
  ImageIcon,
  Info,
  Italic,
  Library,
  Link2,
  List,
  ListChecks,
  ListOrdered,
  Palette,
  PenLine,
  Play,
  Search,
  Shuffle,
  Sparkles,
  Trash2,
  Underline,
  Upload,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type ClipboardEvent, type DragEvent } from 'react'
import { AUDIO_EXEMPLO, RESUMOS, VIDEO_EXEMPLO, exemplos, novoId, resumosDe, topicoPorId, turmaPorId, ytId, type Conteudo, type SelTurma } from './data'
import { Aviso, Badge, Caixa, Drawer, Erro, Modal, Radio, Tile, TileObj } from './pecas'

/* =============================================================== estudantes da turma */
export function DrawerEstudantes({ turmaId, atual, onFechar, onAplicar }: { turmaId: string | null; atual?: SelTurma; onFechar: () => void; onAplicar: (s: SelTurma) => void }) {
  const ref = turmaId ? turmaPorId(turmaId) : null
  const [modo, setModo] = useState<SelTurma['modo']>('todos')
  const [ids, setIds] = useState<string[]>([])
  const [busca, setBusca] = useState('')
  useEffect(() => {
    if (!turmaId) return
    setModo(atual?.modo ?? 'alguns')
    setIds(atual?.modo === 'alguns' ? atual.ids : [])
    setBusca('')
  }, [turmaId]) // eslint-disable-line react-hooks/exhaustive-deps
  const todos = ref?.turma.estudantes ?? []
  const vis = todos.filter((s) => s.nome.toLowerCase().includes(busca.trim().toLowerCase()))
  const marcados = modo === 'todos' ? todos.length : ids.length
  const visMarc = vis.filter((s) => ids.includes(s.id)).length
  const alterna = (id: string) => setIds((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]))
  const todosVis = () => setIds((l) => (visMarc === vis.length ? l.filter((x) => !vis.some((s) => s.id === x)) : [...new Set([...l, ...vis.map((s) => s.id)])]))
  const podeAplicar = modo === 'todos' || ids.length > 0
  return (
    <Drawer
      aberto={!!ref}
      onFechar={onFechar}
      titulo={ref ? `Estudantes do ${ref.turma.nome}` : ''}
      sub={ref ? `${ref.escola.nome} · ${todos.length} estudantes` : ''}
      rodape={
        <>
          <button className="rx-btn is-contorno" onClick={onFechar}>
            Cancelar
          </button>
          <span className="rx-espaco" />
          <button className="rx-btn is-primario" disabled={!podeAplicar} onClick={() => onAplicar({ modo, ids: modo === 'todos' ? [] : ids })}>
            <Check size={16} /> Aplicar seleção ({marcados})
          </button>
        </>
      }
    >
      <div className="lc-opcoes" role="radiogroup" aria-label="Quem recebe a lição">
        {(
          [
            ['todos', 'Todos os estudantes da turma', 'Quem entrar na turma depois também recebe a lição.'],
            ['alguns', 'Escolher estudantes', 'Só os estudantes marcados recebem a lição.'],
          ] as const
        ).map(([m, t, d]) => (
          <button key={m} role="radio" aria-checked={modo === m} className={`lc-opcao ${modo === m ? 'is-on' : ''}`} onClick={() => setModo(m)}>
            <Radio on={modo === m} />
            <span>
              <b>{t}</b>
              <small>{d}</small>
            </span>
          </button>
        ))}
      </div>
      <label className="rx-busca lc-busca">
        <Search size={16} />
        <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar estudante pelo nome" disabled={modo === 'todos'} />
      </label>
      <div className={`lc-lista ${modo === 'todos' ? 'is-desab' : ''}`}>
        <div className="lc-lista__cab">
          <Caixa on={modo === 'todos' || (vis.length > 0 && visMarc === vis.length)} parcial={modo === 'alguns' && visMarc > 0 && visMarc < vis.length} onClick={todosVis} rotulo="Selecionar todos" desab={modo === 'todos'} />
          <b>Selecionar todos</b>
          <span className="rx-espaco" />
          <Badge tom="roxo">
            {marcados} de {todos.length} selecionados
          </Badge>
        </div>
        {vis.map((s) => {
          const on = modo === 'todos' || ids.includes(s.id)
          return (
            <label key={s.id} className={`lc-lista__item ${on ? '' : 'is-off'}`}>
              <Caixa on={on} onClick={() => alterna(s.id)} rotulo={s.nome} desab={modo === 'todos'} />
              <span className="lc-ini">{s.nome.split(' ').map((p) => p[0]).slice(0, 2).join('')}</span>
              <span>{s.nome}</span>
            </label>
          )
        })}
        {vis.length === 0 && <p className="lc-vazio-p">Nenhum estudante encontrado para “{busca}”.</p>}
      </div>
      {!podeAplicar && <Erro>Escolha pelo menos 1 estudante ou use “Todos os estudantes da turma”.</Erro>}
    </Drawer>
  )
}

/* =============================================================== exemplos de questões */
export function DrawerExemplos({ topicoId, selecionado, onFechar, onIncluir }: { topicoId: string | null; selecionado: boolean; onFechar: () => void; onIncluir: () => void }) {
  const [rodada, setRodada] = useState(0)
  useEffect(() => setRodada(0), [topicoId])
  const ref = topicoId ? topicoPorId(topicoId) : null
  const qs = topicoId ? exemplos(topicoId, rodada) : []
  return (
    <Drawer
      aberto={!!ref}
      onFechar={onFechar}
      largura={560}
      titulo="Exemplos de questões"
      sub={ref ? `${ref.topico.nome} · ${ref.topico.bncc}` : ''}
      rodape={
        <>
          <button className="rx-btn is-contorno" onClick={() => setRodada((r) => r + 1)}>
            <Shuffle size={16} /> Ver outros exemplos
          </button>
          <span className="rx-espaco" />
          {selecionado ? (
            <button className="rx-btn is-primario" onClick={onFechar}>
              Fechar
            </button>
          ) : (
            <button className="rx-btn is-primario" onClick={onIncluir}>
              <Check size={16} /> Incluir tópico na lição
            </button>
          )}
        </>
      }
    >
      <Aviso icone={Shuffle}>Estes são só exemplos para você conhecer o tópico. No quiz, o sistema sorteia as questões automaticamente para cada estudante.</Aviso>
      <div className="lc-linha">
        <Badge icone={ListChecks}>{ref?.topico.questoes} questões no banco</Badge>
        <span className="rx-espaco" />
        <small>Mostrando {qs.length} exemplos</small>
      </div>
      {qs.map((q, i) => (
        <article key={`${rodada}-${i}`} className="lc-questao">
          <small>Exemplo {i + 1}</small>
          <b>{q.enunciado}</b>
          <ol>
            {q.alternativas.map((a, k) => (
              <li key={k} className={k === q.certa ? 'is-certa' : ''}>
                <span>{'ABCD'[k]}</span>
                <p>{a}</p>
                {k === q.certa && (
                  <em>
                    Resposta correta <CircleCheck size={15} />
                  </em>
                )}
              </li>
            ))}
          </ol>
        </article>
      ))}
    </Drawer>
  )
}

/* =============================================================== resumo */
const contaResumo = (html: string) => {
  const d = document.createElement('div')
  d.innerHTML = html
  const imgs = d.querySelectorAll('img').length
  const palavras = (d.textContent ?? '').trim().split(/\s+/).filter(Boolean).length
  const min = Math.max(1, Math.round(palavras / 120))
  return { imgs, palavras, meta: `${imgs ? `Texto com ${imgs} ${imgs === 1 ? 'imagem' : 'imagens'}` : 'Texto'} · cerca de ${min} min de leitura` }
}

export function ModalResumo({ aberto, topicoId, editar, onFechar, onSalvar }: { aberto: boolean; topicoId: string; editar?: Conteudo; onFechar: () => void; onSalvar: (c: Conteudo) => void }) {
  const ref = topicoPorId(topicoId)
  const lista = useMemo(() => resumosDe(topicoId), [topicoId])
  const [aba, setAba] = useState<'plataforma' | 'autoral'>('plataforma')
  const [escolhido, setEscolhido] = useState<string>('')
  const [titulo, setTitulo] = useState('')
  const [vazio, setVazio] = useState(true)
  const [tentou, setTentou] = useState(false)
  const ed = useRef<HTMLDivElement>(null)
  const arq = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (!aberto) return
    setTentou(false)
    if (editar?.html !== undefined) {
      setAba('autoral')
      setTitulo(editar.titulo)
    } else {
      setAba(editar?.plataforma || !editar ? 'plataforma' : 'autoral')
      setTitulo('')
    }
    setEscolhido(editar?.plataforma ?? lista[0]?.id ?? '')
  }, [aberto]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (aberto && aba === 'autoral' && ed.current) {
      ed.current.innerHTML = editar?.html ?? ''
      setVazio(!ed.current.textContent?.trim() && !ed.current.querySelector('img'))
    }
  }, [aberto, aba]) // eslint-disable-line react-hooks/exhaustive-deps
  const cmd = (c: string, v?: string) => {
    ed.current?.focus()
    document.execCommand(c, false, v)
    sync()
  }
  const sync = () => setVazio(!ed.current?.textContent?.trim() && !ed.current?.querySelector('img'))
  const insereImg = (f: File) => {
    const r = new FileReader()
    r.onload = () => {
      ed.current?.focus()
      document.execCommand('insertImage', false, String(r.result))
      sync()
    }
    r.readAsDataURL(f)
  }
  const colar = (e: ClipboardEvent<HTMLDivElement>) => {
    const img = [...e.clipboardData.files].find((f) => f.type.startsWith('image/'))
    if (img) {
      e.preventDefault()
      insereImg(img)
    } else setTimeout(sync, 0)
  }
  const sel = lista.find((r) => r.id === escolhido)
  const salvar = () => {
    if (aba === 'plataforma') {
      if (!sel) return
      onSalvar({ id: editar?.id ?? novoId(), tipo: 'Resumo', titulo: sel.titulo, origem: 'da plataforma', meta: sel.meta, plataforma: sel.id })
      return
    }
    setTentou(true)
    if (!titulo.trim() || vazio) return
    const html = ed.current?.innerHTML ?? ''
    onSalvar({ id: editar?.id ?? novoId(), tipo: 'Resumo', titulo: titulo.trim(), origem: 'criado por você', meta: contaResumo(html).meta, html })
  }
  return (
    <Modal
      aberto={aberto}
      onFechar={onFechar}
      largura={900}
      titulo={editar ? 'Editar resumo' : 'Adicionar resumo'}
      sub={ref ? `${ref.topico.nome} · ${ref.disc}` : ''}
      topo={<TileObj tipo="Resumo" />}
      rodape={
        <>
          <button className="rx-btn is-contorno" onClick={onFechar}>
            Cancelar
          </button>
          <span className="rx-espaco" />
          <button className="rx-btn is-primario" onClick={salvar}>
            <Check size={16} /> {editar ? 'Salvar resumo' : 'Adicionar resumo'}
          </button>
        </>
      }
    >
      <div className="lc-origens" role="radiogroup" aria-label="Origem do resumo">
        <button role="radio" aria-checked={aba === 'plataforma'} className={`lc-opcao ${aba === 'plataforma' ? 'is-on' : ''}`} onClick={() => setAba('plataforma')}>
          <Radio on={aba === 'plataforma'} />
          <Tile icone={Library} />
          <span>
            <b>Usar um resumo da plataforma</b>
            <small>
              {lista.length} {lista.length === 1 ? 'resumo pronto' : 'resumos prontos'} para este tópico
            </small>
          </span>
        </button>
        <button role="radio" aria-checked={aba === 'autoral'} className={`lc-opcao ${aba === 'autoral' ? 'is-on' : ''}`} onClick={() => setAba('autoral')}>
          <Radio on={aba === 'autoral'} />
          <Tile icone={PenLine} />
          <span>
            <b>Criar meu resumo</b>
            <small>Escreva ou cole textos e imagens de outros documentos</small>
          </span>
        </button>
      </div>
      {aba === 'plataforma' ? (
        <>
          <div className="lc-resumos">
            <div className="lc-resumos__lista" role="radiogroup" aria-label="Resumos do tópico">
              {lista.map((r) => (
                <button key={r.id} role="radio" aria-checked={escolhido === r.id} className={`lc-opcao is-alto ${escolhido === r.id ? 'is-on' : ''}`} onClick={() => setEscolhido(r.id)}>
                  <Radio on={escolhido === r.id} />
                  <span>
                    <b>{r.titulo}</b>
                    <span className="lc-linha">
                      <Badge tom="roxo" icone={Sparkles}>
                        Jovens Gênios
                      </Badge>
                      <small>{r.meta}</small>
                    </span>
                  </span>
                </button>
              ))}
            </div>
            {sel && (
              <div className="lc-previa">
                <small className="lc-linha">
                  <Eye size={14} /> Prévia
                </small>
                <b>{sel.titulo}</b>
                {sel.img && <img src="./lic/piramide.jpg" alt="" />}
                <p>{sel.trecho}</p>
              </div>
            )}
          </div>
          <small className="lc-linha lc-ajuda">
            <Info size={14} /> Aparecem só os resumos ligados a este tópico na base pedagógica.
          </small>
        </>
      ) : (
        <>
          <label className="lc-campo">
            <span className="lc-rot">Título do resumo *</span>
            <input className={`lc-input ${tentou && !titulo.trim() ? 'is-erro' : ''}`} value={titulo} maxLength={120} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex.: Pirâmides: faces, arestas e vértices" />
            {tentou && !titulo.trim() && <Erro>Dê um título para o resumo.</Erro>}
          </label>
          <div className={`lc-editor ${tentou && vazio ? 'is-erro' : ''}`}>
            <div className="lc-editor__barra" role="toolbar" aria-label="Formatação">
              {(
                [
                  [Heading2, 'Título', () => cmd('formatBlock', 'h3')],
                  [Bold, 'Negrito', () => cmd('bold')],
                  [Italic, 'Itálico', () => cmd('italic')],
                  [Underline, 'Sublinhado', () => cmd('underline')],
                  null,
                  [List, 'Lista', () => cmd('insertUnorderedList')],
                  [ListOrdered, 'Lista numerada', () => cmd('insertOrderedList')],
                  null,
                  [Link2, 'Link', () => { const u = window.prompt('Cole o endereço do link'); if (u) cmd('createLink', u) }],
                  [ImageIcon, 'Imagem', () => arq.current?.click()],
                ] as const
              ).map((b, i) =>
                b ? (
                  <button key={i} type="button" className="rx-icone-btn" title={b[1]} aria-label={b[1]} onMouseDown={(e) => e.preventDefault()} onClick={b[2]}>
                    {(() => {
                      const Ic = b[0]
                      return <Ic size={16} />
                    })()}
                  </button>
                ) : (
                  <i key={i} />
                ),
              )}
              <span className="rx-espaco" />
              <small>Cole textos e imagens com Ctrl + V</small>
              <input ref={arq} type="file" accept="image/png,image/jpeg,image/gif,image/webp" hidden onChange={(e) => e.target.files?.[0] && insereImg(e.target.files[0])} />
            </div>
            <div ref={ed} className="lc-editor__area" contentEditable suppressContentEditableWarning role="textbox" aria-multiline="true" aria-label="Texto do resumo" data-vazio={vazio ? 'Escreva o resumo ou cole textos e imagens de outros documentos…' : undefined} onInput={sync} onPaste={colar} />
          </div>
          {tentou && vazio && <Erro>Escreva o resumo ou cole um conteúdo.</Erro>}
          <small className="lc-linha lc-ajuda">
            <Info size={14} /> O resumo fica ligado só a este tópico e aparece para o estudante na ordem da sequência.
          </small>
        </>
      )}
    </Modal>
  )
}

/* =============================================================== vídeo e áudio (YouTube) */
function CampoYoutube({ link, setLink, exemplo, tentou }: { link: string; setLink: (s: string) => void; exemplo: typeof VIDEO_EXEMPLO; tentou: boolean }) {
  const id = ytId(link)
  const conhecido = id === exemplo.id
  const invalido = link.trim() !== '' && !id
  return (
    <>
      <label className="lc-campo">
        <span className="lc-rot">Link do YouTube *</span>
        <span className={`lc-input is-icone ${invalido || (tentou && !id) ? 'is-erro' : id ? 'is-ok' : ''}`}>
          <Link2 size={16} />
          <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://www.youtube.com/watch?v=…" inputMode="url" />
        </span>
        {invalido ? (
          <Erro>Use um link do YouTube (youtube.com ou youtu.be).</Erro>
        ) : tentou && !id ? (
          <Erro>Cole o link do YouTube.</Erro>
        ) : id ? (
          <small className="lc-ok">
            <CircleCheck size={13} /> Vídeo encontrado. Ele pode ser exibido na lição.
          </small>
        ) : (
          <button type="button" className="rx-link lc-mini" onClick={() => setLink(exemplo.link)}>
            Usar um link de exemplo
          </button>
        )}
      </label>
      {id && (
        <div className="lc-yt">
          <span className="lc-yt__thumb">
            <img src={conhecido ? './lic/video-thumb.jpg' : `https://img.youtube.com/vi/${id}/hqdefault.jpg`} alt="" />
            <Play size={20} />
            {conhecido && <em>{exemplo.duracao}</em>}
          </span>
          <span className="lc-yt__txt">
            <b>{conhecido ? exemplo.titulo : 'Vídeo do YouTube'}</b>
            <small>{conhecido ? `${exemplo.canal} · ${exemplo.duracao}` : `youtube.com/watch?v=${id}`}</small>
            <Badge tom="red" icone={Play}>
              YouTube
            </Badge>
          </span>
        </div>
      )}
    </>
  )
}

export function ModalVideo({ aberto, topicoId, editar, onFechar, onSalvar }: { aberto: boolean; topicoId: string; editar?: Conteudo; onFechar: () => void; onSalvar: (c: Conteudo) => void }) {
  const ref = topicoPorId(topicoId)
  const [link, setLink] = useState('')
  const [titulo, setTitulo] = useState('')
  const [auto, setAuto] = useState(true)
  const [tentou, setTentou] = useState(false)
  useEffect(() => {
    if (!aberto) return
    setLink(editar?.link ?? '')
    setTitulo(editar?.titulo ?? '')
    setAuto(!editar)
    setTentou(false)
  }, [aberto]) // eslint-disable-line react-hooks/exhaustive-deps
  const id = ytId(link)
  const mudaLink = (s: string) => {
    setLink(s)
    const i = ytId(s)
    if (auto) setTitulo(i ? (i === VIDEO_EXEMPLO.id ? VIDEO_EXEMPLO.titulo : '') : '')
  }
  const salvar = () => {
    setTentou(true)
    if (!id || !titulo.trim()) return
    const conhecido = id === VIDEO_EXEMPLO.id
    onSalvar({ id: editar?.id ?? novoId(), tipo: 'Vídeo', titulo: titulo.trim(), origem: 'YouTube', meta: `youtube.com/watch?v=${id}${conhecido ? ` · ${VIDEO_EXEMPLO.duracao}` : ''}`, link, ytId: id })
  }
  return (
    <Modal
      aberto={aberto}
      onFechar={onFechar}
      titulo={editar ? 'Editar vídeo' : 'Adicionar vídeo'}
      sub={ref ? `${ref.topico.nome} · ${ref.disc}` : ''}
      topo={<TileObj tipo="Vídeo" />}
      rodape={
        <>
          <button className="rx-btn is-contorno" onClick={onFechar}>
            Cancelar
          </button>
          <span className="rx-espaco" />
          <button className="rx-btn is-primario" onClick={salvar}>
            <Check size={16} /> {editar ? 'Salvar vídeo' : 'Adicionar vídeo'}
          </button>
        </>
      }
    >
      <CampoYoutube link={link} setLink={mudaLink} exemplo={VIDEO_EXEMPLO} tentou={tentou} />
      <label className="lc-campo">
        <span className="lc-rot">Título para os estudantes *</span>
        <input
          className={`lc-input ${tentou && !titulo.trim() ? 'is-erro' : ''}`}
          value={titulo}
          onChange={(e) => {
            setTitulo(e.target.value)
            setAuto(false)
          }}
          placeholder="Como o vídeo aparece na lista de conteúdos"
        />
        {tentou && !titulo.trim() ? <Erro>Dê um título para o vídeo.</Erro> : <small>{id === VIDEO_EXEMPLO.id && auto ? 'Usamos o título do YouTube. Você pode editar.' : 'É o nome que o estudante vê na lista de conteúdos.'}</small>}
      </label>
    </Modal>
  )
}

const ACEITOS = /\.(mp3|mpeg|mpga)$/i
export function ModalAudio({ aberto, topicoId, editar, onFechar, onSalvar }: { aberto: boolean; topicoId: string; editar?: Conteudo; onFechar: () => void; onSalvar: (c: Conteudo) => void }) {
  const ref = topicoPorId(topicoId)
  const [aba, setAba] = useState<'youtube' | 'arquivo'>('arquivo')
  const [link, setLink] = useState('')
  const [titulo, setTitulo] = useState('')
  const [arquivo, setArquivo] = useState<Conteudo['arquivo'] | null>(null)
  const [prog, setProg] = useState(100)
  const [erroArq, setErroArq] = useState('')
  const [arrastando, setArrastando] = useState(false)
  const [tentou, setTentou] = useState(false)
  const inp = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (!aberto) return
    setAba(editar?.link ? 'youtube' : 'arquivo')
    setLink(editar?.link ?? '')
    setTitulo(editar?.titulo ?? '')
    setArquivo(editar?.arquivo ?? null)
    setProg(100)
    setErroArq('')
    setTentou(false)
  }, [aberto]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (prog >= 100) return
    const t = setTimeout(() => setProg((p) => Math.min(100, p + 9)), 70)
    return () => clearTimeout(t)
  }, [prog])
  const recebe = (f?: File) => {
    if (!f) return
    if (!ACEITOS.test(f.name) && f.type !== 'audio/mpeg') {
      setErroArq(`“${f.name}” não é aceito. Envie um arquivo MP3 ou MPEG.`)
      return
    }
    setErroArq('')
    const mb = (f.size / 1048576).toLocaleString('pt-BR', { maximumFractionDigits: 1 })
    setArquivo({ nome: f.name, tamanho: `${mb} MB`, url: URL.createObjectURL(f) })
    setProg(0)
    if (!titulo.trim()) setTitulo(f.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '))
  }
  const solta = (e: DragEvent) => {
    e.preventDefault()
    setArrastando(false)
    recebe(e.dataTransfer.files[0])
  }
  const id = ytId(link)
  const mudaLink = (s: string) => {
    setLink(s)
    const i = ytId(s)
    if (i === AUDIO_EXEMPLO.id && !titulo.trim()) setTitulo(AUDIO_EXEMPLO.titulo)
  }
  const pronto = aba === 'youtube' ? !!id : !!arquivo && prog >= 100
  const salvar = () => {
    setTentou(true)
    if (!pronto || !titulo.trim()) return
    if (aba === 'youtube') onSalvar({ id: editar?.id ?? novoId(), tipo: 'Áudio', titulo: titulo.trim(), origem: 'YouTube', meta: `youtube.com/watch?v=${id}`, link, ytId: id! })
    else onSalvar({ id: editar?.id ?? novoId(), tipo: 'Áudio', titulo: titulo.trim(), origem: 'arquivo enviado', meta: `${arquivo!.nome.split('.').pop()!.toUpperCase()} · ${arquivo!.tamanho}`, arquivo: arquivo! })
  }
  return (
    <Modal
      aberto={aberto}
      onFechar={onFechar}
      titulo={editar ? 'Editar áudio' : 'Adicionar áudio'}
      sub={ref ? `${ref.topico.nome} · ${ref.disc}` : ''}
      topo={<TileObj tipo="Áudio" />}
      rodape={
        <>
          <button className="rx-btn is-contorno" onClick={onFechar}>
            Cancelar
          </button>
          <span className="rx-espaco" />
          <button className="rx-btn is-primario" onClick={salvar}>
            <Check size={16} /> {editar ? 'Salvar áudio' : 'Adicionar áudio'}
          </button>
        </>
      }
    >
      <div className="rx-abas" role="tablist">
        {(
          [
            ['youtube', 'Link do YouTube'],
            ['arquivo', 'Enviar arquivo'],
          ] as const
        ).map(([a, n]) => (
          <button key={a} role="tab" aria-selected={aba === a} className={aba === a ? 'is-on' : ''} onClick={() => setAba(a)}>
            {n}
            {aba === a && <span className="rx-abas__linha" />}
          </button>
        ))}
      </div>
      {aba === 'youtube' ? (
        <CampoYoutube link={link} setLink={mudaLink} exemplo={AUDIO_EXEMPLO} tentou={tentou} />
      ) : (
        <>
          <div
            className={`lc-envio ${arrastando ? 'is-arrastando' : ''} ${erroArq || (tentou && !arquivo) ? 'is-erro' : ''}`}
            onDragOver={(e) => {
              e.preventDefault()
              setArrastando(true)
            }}
            onDragLeave={() => setArrastando(false)}
            onDrop={solta}
          >
            <Tile icone={Upload} />
            <span>Arraste e solte o arquivo de áudio aqui</span>
            <button type="button" className="rx-link" onClick={() => inp.current?.click()}>
              Escolher arquivo
            </button>
            <small>Formatos aceitos: MP3 e MPEG</small>
            <input ref={inp} type="file" accept=".mp3,.mpeg,.mpga,audio/mpeg" hidden onChange={(e) => recebe(e.target.files?.[0])} />
          </div>
          {erroArq && <Erro>{erroArq}</Erro>}
          {tentou && !arquivo && !erroArq && <Erro>Envie um arquivo de áudio.</Erro>}
          {!arquivo && (
            <button
              type="button"
              className="rx-link lc-mini"
              onClick={() => {
                setArquivo({ nome: 'piramides-do-egito.mp3', tamanho: '4,2 MB' })
                setProg(0)
                if (!titulo.trim()) setTitulo(AUDIO_EXEMPLO.titulo)
              }}
            >
              Usar um arquivo de exemplo
            </button>
          )}
          {arquivo && (
            <div className="lc-arquivo">
              <TileObj tipo="Áudio" />
              <span className="lc-arquivo__txt">
                <span className="lc-linha">
                  <b>{arquivo.nome}</b>
                  <span className="rx-espaco" />
                  {prog >= 100 ? (
                    <Badge tom="verde" icone={CircleCheck}>
                      Enviado
                    </Badge>
                  ) : (
                    <small>Enviando… {prog}%</small>
                  )}
                </span>
                <span className="lc-prog">
                  <i style={{ width: `${prog}%` }} />
                </span>
                <small>
                  {arquivo.nome.split('.').pop()!.toUpperCase()} · {arquivo.tamanho}
                </small>
              </span>
              <button className="rx-icone-btn is-red" aria-label="Remover arquivo" onClick={() => setArquivo(null)}>
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </>
      )}
      <label className="lc-campo">
        <span className="lc-rot">Título do áudio *</span>
        <input className={`lc-input ${tentou && !titulo.trim() ? 'is-erro' : ''}`} value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Como o áudio aparece na lista de conteúdos" />
        {tentou && !titulo.trim() && <Erro>Dê um título para o áudio.</Erro>}
      </label>
    </Modal>
  )
}

/* =============================================================== prévia de um conteúdo */
export function ModalPrevia({ c, onFechar }: { c: Conteudo | null; onFechar: () => void }) {
  const plat = c?.plataforma ? findResumo(c.plataforma) : null
  return (
    <Modal aberto={!!c} onFechar={onFechar} largura={720} titulo={c?.titulo ?? ''} sub={c ? `${c.tipo} · ${c.origem}` : ''} topo={c && <TileObj tipo={c.tipo} />} rotulo="Prévia do conteúdo" rodape={<><span className="rx-espaco" /><button className="rx-btn is-primario" onClick={onFechar}>Fechar</button></>}>
      {c?.tipo === 'Resumo' && (c.html ? <div className="lc-editor__area is-leitura" dangerouslySetInnerHTML={{ __html: c.html }} /> : plat && <div className="lc-previa is-solta">{plat.img && <img src="./lic/piramide.jpg" alt="" />}<p>{plat.trecho}</p><small>Resumo da plataforma · {plat.meta}</small></div>)}
      {c && (c.tipo === 'Vídeo' || (c.tipo === 'Áudio' && c.ytId)) && (
        <div className="lc-yt is-grande">
          <span className="lc-yt__thumb">
            <img src={c.ytId === VIDEO_EXEMPLO.id ? './lic/video-thumb.jpg' : `https://img.youtube.com/vi/${c.ytId}/hqdefault.jpg`} alt="" />
            <Play size={28} />
          </span>
          <a className="rx-link" href={c.link} target="_blank" rel="noreferrer">
            Abrir no YouTube <ExternalLink size={14} />
          </a>
        </div>
      )}
      {c?.tipo === 'Áudio' && c.arquivo && (
        <div className="lc-player">
          {c.arquivo.url ? (
            <audio controls src={c.arquivo.url} />
          ) : (
            <>
              <button className="lc-player__play" aria-label="Tocar">
                <Play size={18} />
              </button>
              <span className="lc-prog">
                <i style={{ width: '32%' }} />
              </span>
              <small>1:21 / 4:12</small>
            </>
          )}
          <small>{c.arquivo.nome}</small>
        </div>
      )}
    </Modal>
  )
}
const findResumo = (id: string) => Object.values(RESUMOS).flat().find((r) => r.id === id) ?? (id.startsWith('rp-') ? resumosDe(id.slice(3))[0] : null)

/* =============================================================== mensagem para os estudantes (editor rico, como o Tiny da plataforma) */
const CORES = ['#262626', '#441F67', '#7C3AED', '#2563EB', '#15803D', '#C27C00', '#DC2626']
export const textoDoHtml = (html: string) => {
  const d = document.createElement('div')
  d.innerHTML = html
  return (d.textContent ?? '').replace(/\s+/g, ' ').trim()
}
export function EditorMensagem({ html, onChange, erro }: { html: string; onChange: (h: string) => void; erro?: boolean }) {
  const ed = useRef<HTMLDivElement>(null)
  const arq = useRef<HTMLInputElement>(null)
  const [cores, setCores] = useState(false)
  const [vazio, setVazio] = useState(!html)
  useEffect(() => {
    if (ed.current) ed.current.innerHTML = html
    setVazio(!textoDoHtml(html) && !html.includes('<img'))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const sync = () => {
    const h = ed.current?.innerHTML ?? ''
    setVazio(!ed.current?.textContent?.trim() && !ed.current?.querySelector('img'))
    onChange(h)
  }
  const cmd = (c: string, v?: string) => {
    ed.current?.focus()
    document.execCommand(c, false, v)
    sync()
  }
  const insereImg = (f: File) => {
    const r = new FileReader()
    r.onload = () => cmd('insertImage', String(r.result))
    r.readAsDataURL(f)
  }
  const colar = (e: ClipboardEvent<HTMLDivElement>) => {
    const img = [...e.clipboardData.files].find((f) => f.type.startsWith('image/'))
    if (img) {
      e.preventDefault()
      insereImg(img)
    } else setTimeout(sync, 0)
  }
  return (
    <div className={`lc-editor lc-editor-msg ${erro ? 'is-erro' : ''}`}>
      <div className="lc-editor__barra" role="toolbar" aria-label="Formatação da mensagem">
        {(
          [
            [Heading2, 'Título', () => cmd('formatBlock', 'h3')],
            [Bold, 'Negrito', () => cmd('bold')],
            [Italic, 'Itálico', () => cmd('italic')],
            [Underline, 'Sublinhado', () => cmd('underline')],
          ] as const
        ).map(([Ic, n, f]) => (
          <button key={n} type="button" className="rx-icone-btn" title={n} aria-label={n} onMouseDown={(e) => e.preventDefault()} onClick={f}>
            <Ic size={16} />
          </button>
        ))}
        <span className="lc-cores">
          <button type="button" className="rx-icone-btn" title="Cor do texto" aria-label="Cor do texto" aria-expanded={cores} onMouseDown={(e) => e.preventDefault()} onClick={() => setCores((c) => !c)}>
            <Palette size={16} />
          </button>
          {cores && (
            <span className="lc-cores__pop" role="menu">
              {CORES.map((c) => (
                <button
                  key={c}
                  type="button"
                  role="menuitem"
                  aria-label={`Cor ${c}`}
                  style={{ background: c }}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    cmd('foreColor', c)
                    setCores(false)
                  }}
                />
              ))}
            </span>
          )}
        </span>
        <i />
        {(
          [
            [List, 'Lista', () => cmd('insertUnorderedList')],
            [ListOrdered, 'Lista numerada', () => cmd('insertOrderedList')],
            [Link2, 'Link', () => { const u = window.prompt('Cole o endereço do link'); if (u) cmd('createLink', u) }],
            [ImageIcon, 'Imagem', () => arq.current?.click()],
          ] as const
        ).map(([Ic, n, f]) => (
          <button key={n} type="button" className="rx-icone-btn" title={n} aria-label={n} onMouseDown={(e) => e.preventDefault()} onClick={f}>
            <Ic size={16} />
          </button>
        ))}
        <span className="rx-espaco" />
        <small>Cole textos e imagens com Ctrl + V</small>
        <input ref={arq} type="file" accept="image/png,image/jpeg,image/gif,image/webp" hidden onChange={(e) => e.target.files?.[0] && insereImg(e.target.files[0])} />
      </div>
      <div ref={ed} className="lc-editor__area" contentEditable suppressContentEditableWarning role="textbox" aria-multiline="true" aria-label="Mensagem para os estudantes" data-vazio={vazio ? 'Ex.: Olá, turma! Nesta lição, vocês vão… Você pode formatar o texto, mudar cores e colocar imagens.' : undefined} onInput={sync} onPaste={colar} onBlur={sync} />
    </div>
  )
}
