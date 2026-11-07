/* =====================================================================
   Gestão da Lojinha (Admin Jovens Gênios) — dados do protótipo
   Tudo é gerado de forma determinística por plataforma, para que as
   tabelas tenham volume real (milhares de linhas) e os números batam.
   ===================================================================== */

export type PlataformaId = 'exploradores' | 'educadores' | 'geniex'
export type Raridade = 'comum' | 'raro' | 'epico' | 'lendario'
export type StatusItem = 'ativo' | 'inativo' | 'rascunho'
export type StatusResgate = 'solicitado' | 'aprovado' | 'processamento' | 'enviado' | 'concluido' | 'cancelado'

export const RARIDADES: Record<Raridade, string> = { comum: 'Comum', raro: 'Raro', epico: 'Épico', lendario: 'Lendário' }
export const STATUS_RESGATE: Record<StatusResgate, string> = {
  solicitado: 'Solicitado',
  aprovado: 'Aprovado',
  processamento: 'Em processamento',
  enviado: 'Enviado',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
}

export type Plataforma = {
  id: PlataformaId
  nome: string
  icone: string | null
  /** quem usa a Lojinha nessa plataforma */
  publico: 'Estudantes' | 'Educadores'
  singular: 'Estudante' | 'Educador'
  prefixoId: string
  totalPessoas: number
  ativos: number
  resgataram: number
  pontosCirculacao: number
  resgates30d: number
}
export const PLATAFORMAS: Plataforma[] = [
  { id: 'exploradores', nome: 'Exploradores', icone: './admin/traje.webp', publico: 'Estudantes', singular: 'Estudante', prefixoId: 'EST', totalPessoas: 168283, ativos: 32342, resgataram: 8764, pontosCirculacao: 12450000, resgates30d: 2846 },
  { id: 'educadores', nome: 'Educadores', icone: './loja/m-capelo.webp', publico: 'Educadores', singular: 'Educador', prefixoId: 'EDU', totalPessoas: 12940, ativos: 4218, resgataram: 1093, pontosCirculacao: 3870000, resgates30d: 412 },
  { id: 'geniex', nome: 'Geniex', icone: null, publico: 'Estudantes', singular: 'Estudante', prefixoId: 'GNX', totalPessoas: 54210, ativos: 11874, resgataram: 2961, pontosCirculacao: 6120000, resgates30d: 1190 },
]
export const PLAT = Object.fromEntries(PLATAFORMAS.map((p) => [p.id, p])) as Record<PlataformaId, Plataforma>

/* ---------------- aleatório determinístico ---------------- */
export function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const semente = (s: string) => [...s].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) | 0, 7)
const pega = <T,>(r: () => number, xs: readonly T[]) => xs[Math.floor(r() * xs.length)]

/* ---------------- tempo ---------------- */
/** “Agora” no protótipo: 03/11/2026, 11:00 */
export const AGORA = new Date(2026, 10, 3, 11, 0).getTime()
export const DIA = 86_400_000
const MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
export const dataHora = (t: number) => {
  const d = new Date(t)
  return `${String(d.getDate()).padStart(2, '0')} ${MES[d.getMonth()]} ${d.getFullYear()}, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
export const dataCurta = (t: number) => {
  const d = new Date(t)
  return `${String(d.getDate()).padStart(2, '0')} ${MES[d.getMonth()]}, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
export const dataLonga = (t: number) => {
  const d = new Date(t)
  return `${String(d.getDate()).padStart(2, '0')} ${MES[d.getMonth()]} ${d.getFullYear()}, às ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
const em = (dia: number, mes: number, h: number, m: number) => new Date(2026, mes - 1, dia, h, m).getTime()
export const fmt = (n: number) => n.toLocaleString('pt-BR')
export const pts = (n: number) => `${fmt(n)} pts`

export type Periodo = '7' | '30' | '90' | 'ano'
export const PERIODOS: { valor: Periodo; texto: string }[] = [
  { valor: '7', texto: 'Últimos 7 dias' },
  { valor: '30', texto: 'Últimos 30 dias' },
  { valor: '90', texto: 'Últimos 90 dias' },
  { valor: 'ano', texto: 'Ano letivo 2026' },
]
export const inicioPeriodo = (p: Periodo) => (p === 'ano' ? new Date(2026, 0, 1).getTime() : AGORA - Number(p) * DIA)

/* ---------------- categorias ---------------- */
export type IconeCat = 'avatar' | 'background' | 'pet' | 'cards' | 'personalizacao' | 'recompensa' | 'tema' | 'beneficio' | 'formacao' | 'material' | 'evento' | 'reconhecimento'
export type Categoria = { id: string; nome: string; desc: string; img: string; icone: IconeCat; status: 'ativa' | 'inativa'; atualizado: number }

const CATS: Record<PlataformaId, Categoria[]> = {
  exploradores: [
    { id: 'avatares', nome: 'Avatares', desc: 'Avatares para personalizar o perfil do estudante.', img: './admin/cat-avatares.webp', icone: 'avatar', status: 'ativa', atualizado: em(3, 11, 10, 24) },
    { id: 'backgrounds', nome: 'Backgrounds', desc: 'Planos de fundo para o perfil.', img: './admin/cat-oculos.webp', icone: 'background', status: 'ativa', atualizado: em(3, 11, 9, 41) },
    { id: 'pets', nome: 'Pets (Yunaras)', desc: 'Pets exclusivos da Jornada Explorador.', img: './admin/cat-pets.webp', icone: 'pet', status: 'ativa', atualizado: em(2, 11, 16, 20) },
    { id: 'cards', nome: 'Cards', desc: 'Cards colecionáveis com temáticas especiais.', img: './admin/cat-cards.webp', icone: 'cards', status: 'ativa', atualizado: em(2, 11, 14, 7) },
    { id: 'personalizacao', nome: 'Personalização', desc: 'Itens para personalizar a experiência do estudante.', img: './admin/cat-fone.webp', icone: 'personalizacao', status: 'ativa', atualizado: em(1, 11, 18, 32) },
    { id: 'recompensas', nome: 'Recompensas', desc: 'Benefícios e prêmios especiais do Clube Jovens Gênios.', img: './admin/cat-recompensas.webp', icone: 'recompensa', status: 'inativa', atualizado: em(31, 10, 11, 9) },
  ],
  geniex: [
    { id: 'temas', nome: 'Temas', desc: 'Temas visuais para a plataforma GenieX.', img: './3d/palette.png', icone: 'tema', status: 'ativa', atualizado: em(3, 11, 8, 12) },
    { id: 'molduras', nome: 'Molduras', desc: 'Molduras e emblemas para o perfil.', img: './3d/crown.png', icone: 'personalizacao', status: 'ativa', atualizado: em(2, 11, 15, 40) },
    { id: 'beneficios', nome: 'Benefícios', desc: 'Simulados extras, mentorias e aulões ao vivo.', img: './3d/bulb.png', icone: 'beneficio', status: 'ativa', atualizado: em(1, 11, 10, 5) },
    { id: 'cards', nome: 'Cards', desc: 'Pacotes de flashcards temáticos para o ENEM.', img: './admin/cat-cards.webp', icone: 'cards', status: 'ativa', atualizado: em(30, 10, 17, 22) },
    { id: 'recompensas', nome: 'Recompensas', desc: 'Prêmios físicos para os estudantes do Ensino Médio.', img: './admin/cat-recompensas.webp', icone: 'recompensa', status: 'ativa', atualizado: em(28, 10, 9, 0) },
  ],
  educadores: [
    { id: 'formacoes', nome: 'Formações', desc: 'Cursos e trilhas de formação continuada.', img: './3d/books.png', icone: 'formacao', status: 'ativa', atualizado: em(3, 11, 9, 2) },
    { id: 'materiais', nome: 'Materiais pedagógicos', desc: 'Planos de aula, sequências didáticas e jogos.', img: './3d/notes.png', icone: 'material', status: 'ativa', atualizado: em(2, 11, 11, 30) },
    { id: 'eventos', nome: 'Eventos', desc: 'Ingressos para encontros e congressos.', img: './3d/calendar.png', icone: 'evento', status: 'ativa', atualizado: em(31, 10, 14, 15) },
    { id: 'reconhecimentos', nome: 'Reconhecimentos', desc: 'Certificados e selos de destaque.', img: './3d/trophy.png', icone: 'reconhecimento', status: 'ativa', atualizado: em(29, 10, 16, 48) },
    { id: 'kits', nome: 'Kits físicos', desc: 'Kits de sala de aula entregues na escola.', img: './admin/cat-recompensas.webp', icone: 'recompensa', status: 'inativa', atualizado: em(20, 10, 10, 0) },
  ],
}
export const categoriasIniciais = (p: PlataformaId) => CATS[p].map((c) => ({ ...c }))

/* ---------------- itens ---------------- */
export type Item = {
  id: string
  nome: string
  sub: string
  desc: string
  cat: string
  raridade: Raridade
  pontos: number
  estoque: number | null
  limite: number | null
  tipo: 'digital' | 'fisico'
  resgates: number
  status: StatusItem
  atualizado: number
  img: string
  /** foto ocupando todo o quadrado (fundos) */
  foto?: boolean
  filtro?: string
}

/** itens fixos das referências (Exploradores) */
const REF_EXP: Item[] = [
  { id: 'traje-explorador-epico', nome: 'Traje Explorador Épico', sub: 'Traje completo do Explorador.', desc: 'Traje completo do Explorador com visuais exclusivos e animações especiais.', cat: 'avatares', raridade: 'lendario', pontos: 120000, estoque: null, limite: 1, tipo: 'digital', resgates: 521, status: 'ativo', atualizado: em(3, 11, 10, 24), img: './admin/traje.webp' },
  { id: 'fone-estelar', nome: 'Fone Estelar', sub: 'Fone especial do Explorador.', desc: 'Fone com brilho estelar para o avatar do Explorador.', cat: 'personalizacao', raridade: 'raro', pontos: 25000, estoque: null, limite: 1, tipo: 'digital', resgates: 438, status: 'ativo', atualizado: em(3, 11, 9, 41), img: './admin/fone.webp' },
  { id: 'oculos-explorador', nome: 'Óculos Explorador', sub: 'Óculos temáticos do Explorador.', desc: 'Óculos de aventura para enxergar novos horizontes.', cat: 'personalizacao', raridade: 'raro', pontos: 60000, estoque: null, limite: 1, tipo: 'digital', resgates: 419, status: 'ativo', atualizado: em(2, 11, 16, 20), img: './admin/oculos.webp' },
  { id: 'raposa-sivaru', nome: 'Raposa Sivaru', sub: 'Pet exclusivo do Explorador.', desc: 'Raposa de pelagem flamejante, curiosa e muito leal.', cat: 'pets', raridade: 'epico', pontos: 95000, estoque: 150, limite: 1, tipo: 'digital', resgates: 312, status: 'ativo', atualizado: em(2, 11, 14, 7), img: './admin/raposa.webp' },
  { id: 'fundo-galaxia', nome: 'Fundo Galáxia', sub: 'Background temático Galáxia.', desc: 'Plano de fundo com nebulosas e estrelas.', cat: 'backgrounds', raridade: 'comum', pontos: 15000, estoque: null, limite: 1, tipo: 'digital', resgates: 298, status: 'ativo', atualizado: em(1, 11, 18, 32), img: './admin/fundo-galaxia.webp', foto: true },
  { id: 'card-explorador', nome: 'Card Explorador', sub: 'Card colecionável do Explorador.', desc: 'Card físico colecionável entregue na escola.', cat: 'cards', raridade: 'raro', pontos: 10000, estoque: 500, limite: 3, tipo: 'fisico', resgates: 284, status: 'inativo', atualizado: em(1, 11, 15, 11), img: './admin/card.webp' },
  { id: 'traje-explorador', nome: 'Traje Explorador', sub: 'Versão clássica do traje.', desc: 'A versão clássica do traje dos Exploradores.', cat: 'avatares', raridade: 'comum', pontos: 80000, estoque: null, limite: 1, tipo: 'digital', resgates: 230, status: 'ativo', atualizado: em(31, 10, 11, 9), img: './admin/traje.webp', filtro: 'saturate(.75)' },
  { id: 'fundo-planeta-x', nome: 'Fundo Planeta X', sub: 'Background do Planeta X.', desc: 'Plano de fundo com o misterioso Planeta X.', cat: 'backgrounds', raridade: 'epico', pontos: 40000, estoque: 200, limite: 1, tipo: 'digital', resgates: 189, status: 'ativo', atualizado: em(31, 10, 10, 47), img: './admin/fundo-planeta.webp', foto: true },
]

type Molde = { cat: string; nomes: string[]; imgs: { img: string; foto?: boolean }[]; tipo: 'digital' | 'fisico'; faixa: [number, number]; sub: string }
const MOLDES: Record<PlataformaId, { total: Record<string, number>; moldes: Molde[] }> = {
  exploradores: {
    total: { avatares: 38, backgrounds: 16, pets: 11, cards: 24, personalizacao: 32, recompensas: 7 },
    moldes: [
      { cat: 'avatares', nomes: ['Traje Galáctico', 'Traje Minerador Espacial', 'Traje Cósmico', 'Traje Nebulosa', 'Traje Solar', 'Traje Tech', 'Traje Floresta Estelar', 'Traje Eclipse', 'Traje Imperial', 'Traje Dragão Estelar', 'Traje Supernova', 'Traje Cristal', 'Traje Vulcão', 'Traje Coral', 'Traje Gelo', 'Traje Esmeralda', 'Traje Recruta', 'Traje Aprendiz', 'Traje Aurora'], imgs: ['galactico', 'minerador', 'cosmico', 'nebulosa', 'solar', 'tech', 'floresta', 'eclipse', 'imperial'].map((n) => ({ img: `./loja/traje-${n}.webp` })), tipo: 'digital', faixa: [15, 120], sub: 'Traje para o avatar do Explorador.' },
      { cat: 'backgrounds', nomes: ['Fundo Nebulosa', 'Fundo Lua Cheia', 'Base da Nação', 'Floresta Lunar', 'Deserto Solar', 'Vale Neon', 'Oceano Profundo', 'Aurora Boreal'], imgs: [{ img: './admin/fundo-galaxia.webp', foto: true }, { img: './admin/fundo-planeta.webp', foto: true }, { img: './loja/bg-base-nacao.webp', foto: true }], tipo: 'digital', faixa: [15, 110], sub: 'Background para o perfil.' },
      { cat: 'pets', nomes: ['Pássaro Aravé', 'Raposa Glacial', 'Pássaro Solar', 'Raposa Lunar', 'Yunara Estelar', 'Yunara da Floresta'], imgs: [{ img: './loja/d-passaro.webp' }, { img: './admin/raposa.webp' }, { img: './loja/c-pets.webp' }], tipo: 'digital', faixa: [30, 95], sub: 'Pet do Explorador.' },
      { cat: 'cards', nomes: ['Pacote de Cards Estelar', 'Pacote de Cards Galáctico', 'Pacote de Cards Lendário', 'Card Holográfico', 'Card Planeta X'], imgs: [{ img: './admin/card.webp' }, { img: './loja/d-cartas.webp' }], tipo: 'fisico', faixa: [10, 100], sub: 'Cards colecionáveis.' },
      { cat: 'personalizacao', nomes: ['Óculos Neon', 'Fone Nebulosa', 'Moldura Medalha de Ouro', 'Emblema Estrela', 'Capacete Lunar', 'Mochila Foguete'], imgs: [{ img: './admin/fone.webp' }, { img: './admin/oculos.webp' }, { img: './loja/r-medalha.webp' }, { img: './loja/r-estrela.webp' }], tipo: 'digital', faixa: [10, 90], sub: 'Acessório para o avatar.' },
      { cat: 'recompensas', nomes: ['Caixa Surpresa Explorador', 'Troféu Explorador do Ano', 'Kit Material Escolar', 'Camiseta Exploradores', 'Garrafinha Galáctica'], imgs: [{ img: './admin/cat-recompensas.webp' }, { img: './loja/r-trofeu.webp' }, { img: './loja/c-recompensas.webp' }], tipo: 'fisico', faixa: [80, 300], sub: 'Prêmio físico entregue na escola.' },
    ],
  },
  geniex: {
    total: { temas: 14, molduras: 18, beneficios: 16, cards: 20, recompensas: 6 },
    moldes: [
      { cat: 'temas', nomes: ['Tema Noite Estrelada', 'Tema Aurora', 'Tema Oceano', 'Tema Floresta', 'Tema Neon', 'Tema Pôr do Sol', 'Tema Minimalista'], imgs: [{ img: './3d/palette.png' }, { img: './3d/planet.png' }, { img: './3d/sparkles.png' }], tipo: 'digital', faixa: [10, 60], sub: 'Tema visual da plataforma.' },
      { cat: 'molduras', nomes: ['Moldura Coroa', 'Moldura Medalha de Ouro', 'Emblema Estrela', 'Emblema Foguete', 'Selo Gênio do Mês', 'Moldura Diamante'], imgs: [{ img: './3d/crown.png' }, { img: './loja/r-medalha.webp' }, { img: './loja/r-estrela.webp' }, { img: './3d/gem.png' }], tipo: 'digital', faixa: [8, 80], sub: 'Moldura ou emblema do perfil.' },
      { cat: 'beneficios', nomes: ['Simulado ENEM Extra', 'Mentoria de Redação', 'Aulão de Matemática', 'Correção de Redação', 'Plano de Estudos Personalizado'], imgs: [{ img: './3d/bulb.png' }, { img: './3d/memo.png' }, { img: './3d/books.png' }], tipo: 'digital', faixa: [20, 150], sub: 'Benefício de estudo.' },
      { cat: 'cards', nomes: ['Flashcards de Literatura', 'Flashcards de Química', 'Flashcards de História', 'Flashcards de Biologia', 'Flashcards de Física'], imgs: [{ img: './loja/d-cartas.webp' }, { img: './admin/card.webp' }], tipo: 'digital', faixa: [10, 50], sub: 'Pacote de flashcards temáticos.' },
      { cat: 'recompensas', nomes: ['Fone Bluetooth', 'Mochila GenieX', 'Kit Vestibular', 'Garrafa Térmica'], imgs: [{ img: './admin/fone.webp' }, { img: './admin/cat-recompensas.webp' }], tipo: 'fisico', faixa: [150, 400], sub: 'Prêmio físico.' },
    ],
  },
  educadores: {
    total: { formacoes: 14, materiais: 16, eventos: 6, reconhecimentos: 6, kits: 4 },
    moldes: [
      { cat: 'formacoes', nomes: ['Curso Metodologias Ativas', 'Trilha BNCC na Prática', 'Curso Avaliação Formativa', 'Curso Alfabetização', 'Curso Tecnologia em Sala', 'Curso Educação Inclusiva'], imgs: [{ img: './3d/books.png' }, { img: './3d/bulb.png' }], tipo: 'digital', faixa: [40, 180], sub: 'Formação continuada.' },
      { cat: 'materiais', nomes: ['Plano de Aula Interativo', 'Sequência Didática', 'Jogo Pedagógico', 'Banco de Questões', 'Projeto Interdisciplinar'], imgs: [{ img: './3d/notes.png' }, { img: './3d/clipboard.png' }, { img: './3d/memo.png' }], tipo: 'digital', faixa: [10, 60], sub: 'Material pedagógico.' },
      { cat: 'eventos', nomes: ['Ingresso Congresso de Educação', 'Encontro de Educadores', 'Workshop Presencial'], imgs: [{ img: './3d/calendar.png' }], tipo: 'fisico', faixa: [150, 400], sub: 'Ingresso para evento.' },
      { cat: 'reconhecimentos', nomes: ['Certificado Educador Destaque', 'Selo Professor Inovador', 'Troféu Educador do Ano'], imgs: [{ img: './3d/trophy.png' }, { img: './loja/r-medalha.webp' }], tipo: 'digital', faixa: [50, 250], sub: 'Reconhecimento.' },
      { cat: 'kits', nomes: ['Kit Sala de Aula', 'Kit Ciências', 'Kit Leitura'], imgs: [{ img: './admin/cat-recompensas.webp' }], tipo: 'fisico', faixa: [200, 500], sub: 'Kit entregue na escola.' },
    ],
  },
}
const EDICOES = ['', 'Edição Inverno', 'Edição Verão', 'Edição Olimpíada', 'Edição Festa Junina', 'Edição Ciências', 'Edição Natal']
const FILTROS = [undefined, 'hue-rotate(40deg)', 'hue-rotate(-40deg)', 'hue-rotate(90deg) saturate(.9)', 'hue-rotate(180deg)', 'saturate(.6)', 'hue-rotate(-90deg)']

export function itensIniciais(p: PlataformaId): Item[] {
  const r = rng(semente(p + 'itens'))
  const { total, moldes } = MOLDES[p]
  const base = p === 'exploradores' ? REF_EXP.map((i) => ({ ...i })) : []
  const usados = new Set(base.map((i) => i.nome))
  const out = [...base]
  for (const m of moldes) {
    const ja = out.filter((i) => i.cat === m.cat).length
    for (let k = 0; ja + k < total[m.cat]; k++) {
      const nomeBase = m.nomes[k % m.nomes.length]
      const ed = EDICOES[Math.floor(k / m.nomes.length) % EDICOES.length]
      let nome = ed ? `${nomeBase} · ${ed}` : nomeBase
      if (usados.has(nome)) nome = `${nome} II`
      usados.add(nome)
      const ar = m.imgs[k % m.imgs.length]
      const rar: Raridade = pega(r, ['comum', 'comum', 'raro', 'raro', 'epico', 'lendario'] as const)
      const pontos = Math.round((m.faixa[0] + r() * (m.faixa[1] - m.faixa[0])) / 5) * 5 * 1000
      const fis = m.tipo === 'fisico'
      out.push({
        id: `${p}-${m.cat}-${k}`,
        nome,
        sub: m.sub,
        desc: `${m.sub} ${nome} para resgatar na Lojinha.`,
        cat: m.cat,
        raridade: rar,
        pontos,
        estoque: fis || r() < 0.2 ? Math.round(50 + r() * 450) : null,
        limite: fis ? 2 : 1,
        tipo: m.tipo,
        resgates: Math.round(5 + Math.pow(r(), 2.2) * 185),
        status: r() < 0.08 ? 'inativo' : r() < 0.05 ? 'rascunho' : 'ativo',
        atualizado: AGORA - Math.round((5 + r() * 120) * DIA + r() * 36_000_000),
        img: ar.img,
        foto: ar.foto,
        filtro: ed ? FILTROS[Math.floor(k / m.nomes.length) % FILTROS.length] : undefined,
      })
    }
  }
  // mais recentes primeiro (os itens das referências ficam no topo)
  return out.sort((a, b) => b.atualizado - a.atualizado)
}

/* ---------------- redes, escolas, pessoas ---------------- */
export const REDES: Record<string, string[]> = {
  'Rede Fortaleza': ['E.M. Monteiro Lobato', 'E.M. Clóvis Beviláqua', 'E.M. Dom Hélder Câmara', 'E.M. Patativa do Assaré'],
  'Rede Caucaia': ['E.E. José de Alencar', 'E.E. São Francisco', 'E.M. Iracema'],
  'Rede Maracanaú': ['E.M. Castro Alves', 'E.M. Paulo Freire', 'E.M. Cecília Meireles'],
  'Rede Sobral': ['E.E. Rui Barbosa', 'E.E. Rachel de Queiroz', 'E.M. Dom José'],
  'Rede Eusébio': ['E.E. Maria da Conceição', 'E.M. Gonçalves Dias'],
  'Rede Itaitinga': ['E.M. Padre Cícero', 'E.M. Monsenhor Tabosa'],
}
export const TURMAS = ['6º Ano A', '6º Ano B', '7º Ano A', '7º Ano B', '7º Ano C', '8º Ano A', '8º Ano B', '8º Ano C', '9º Ano A', '9º Ano B']
const TURMAS_EM = ['1ª Série A', '1ª Série B', '2ª Série A', '2ª Série B', '3ª Série A', '3ª Série B']
const FUNCOES = ['Professor(a) de Português', 'Professor(a) de Matemática', 'Professor(a) de Ciências', 'Coordenador(a) pedagógico(a)', 'Professor(a) de História', 'Professor(a) de Inglês']
const NOMES = ['Larissa', 'Miguel', 'Ana', 'Rafael', 'Juliana', 'Gabriel', 'Isabela', 'Vitor', 'Carla', 'Eduardo', 'Beatriz', 'Lucas', 'Mariana', 'Pedro', 'Sofia', 'João', 'Helena', 'Davi', 'Alice', 'Arthur', 'Laura', 'Heitor', 'Manuela', 'Bernardo', 'Valentina', 'Enzo', 'Lívia', 'Samuel', 'Clara', 'Thiago', 'Yasmin', 'Caio', 'Letícia', 'Matheus', 'Giovanna', 'Felipe']
const SOBRENOMES = ['Souza', 'Fernandes', 'Silva', 'Costa', 'Pereira', 'Batista', 'Santos', 'Mendes', 'Teixeira', 'Dias', 'Oliveira', 'Lima', 'Araújo', 'Barbosa', 'Rocha', 'Moura', 'Cavalcante', 'Nogueira', 'Freitas', 'Carvalho', 'Ribeiro', 'Alves', 'Monteiro', 'Pinheiro']

export type Pessoa = { id: string; nome: string; rede: string; escola: string; turma: string; saldo: number; resgates: number; ultimo: number; status: 'ativo' | 'inativo'; idx: number }
const REF_PESSOAS: Omit<Pessoa, 'idx'>[] = [
  { id: 'EST-784511', nome: 'Larissa Souza', rede: 'Rede Fortaleza', escola: 'E.M. Monteiro Lobato', turma: '9º Ano A', saldo: 125000, resgates: 5, ultimo: em(3, 11, 10, 24), status: 'ativo' },
  { id: 'EST-831902', nome: 'Miguel Fernandes', rede: 'Rede Caucaia', escola: 'E.E. José de Alencar', turma: '8º Ano B', saldo: 75000, resgates: 3, ultimo: em(2, 11, 16, 20), status: 'ativo' },
  { id: 'EST-772340', nome: 'Ana Silva', rede: 'Rede Maracanaú', escola: 'E.M. Castro Alves', turma: '7º Ano A', saldo: 195000, resgates: 7, ultimo: em(2, 11, 14, 7), status: 'ativo' },
  { id: 'EST-887211', nome: 'Rafael Costa', rede: 'Rede Sobral', escola: 'E.E. Rui Barbosa', turma: '8º Ano C', saldo: 145000, resgates: 4, ultimo: em(1, 11, 18, 32), status: 'ativo' },
  { id: 'EST-790104', nome: 'Juliana Pereira', rede: 'Rede Fortaleza', escola: 'E.M. Clóvis Beviláqua', turma: '9º Ano B', saldo: 165000, resgates: 6, ultimo: em(1, 11, 15, 11), status: 'ativo' },
  { id: 'EST-769885', nome: 'Gabriel Batista', rede: 'Rede Eusébio', escola: 'E.E. Maria da Conceição', turma: '8º Ano A', saldo: 90000, resgates: 2, ultimo: em(31, 10, 11, 9), status: 'ativo' },
  { id: 'EST-813667', nome: 'Isabela Santos', rede: 'Rede Itaitinga', escola: 'E.M. Padre Cícero', turma: '7º Ano B', saldo: 150000, resgates: 5, ultimo: em(31, 10, 10, 47), status: 'ativo' },
  { id: 'EST-888330', nome: 'Vitor Mendes', rede: 'Rede Caucaia', escola: 'E.E. São Francisco', turma: '9º Ano A', saldo: 110000, resgates: 3, ultimo: em(30, 10, 16, 25), status: 'ativo' },
  { id: 'EST-755901', nome: 'Carla Teixeira', rede: 'Rede Maracanaú', escola: 'E.M. Paulo Freire', turma: '8º Ano B', saldo: 80000, resgates: 3, ultimo: em(30, 10, 9, 18), status: 'inativo' },
  { id: 'EST-782344', nome: 'Eduardo Dias', rede: 'Rede Sobral', escola: 'E.E. Rachel de Queiroz', turma: '7º Ano C', saldo: 60000, resgates: 2, ultimo: em(29, 10, 14, 2), status: 'ativo' },
]
const REDE_NOMES = Object.keys(REDES)

/** pessoa de índice i (determinística) — milhares de registros sem guardar tudo em memória */
export function pessoaAt(p: PlataformaId, i: number): Pessoa {
  const pl = PLAT[p]
  if (i < REF_PESSOAS.length) {
    const b = REF_PESSOAS[i]
    if (p === 'exploradores') return { ...b, idx: i }
    const t = p === 'geniex' ? TURMAS_EM[i % TURMAS_EM.length] : FUNCOES[i % FUNCOES.length]
    return { ...b, id: `${pl.prefixoId}-${b.id.slice(4)}`, turma: t, saldo: Math.round(b.saldo * (p === 'geniex' ? 0.6 : 0.35)), idx: i }
  }
  const r = rng(semente(p) + i * 977)
  const rede = REDE_NOMES[Math.floor(r() * REDE_NOMES.length)]
  const turmas = p === 'educadores' ? FUNCOES : p === 'geniex' ? TURMAS_EM : TURMAS
  const resg = Math.floor(Math.pow(r(), 2) * 9)
  return {
    id: `${pl.prefixoId}-${String(700000 + Math.floor(r() * 299999))}`,
    nome: `${pega(r, NOMES)} ${pega(r, SOBRENOMES)}`,
    rede,
    escola: pega(r, REDES[rede]),
    turma: pega(r, turmas),
    saldo: Math.round(r() * 40) * 5000,
    resgates: resg,
    ultimo: AGORA - Math.round(r() * 120 * DIA),
    status: r() < 0.82 ? 'ativo' : 'inativo',
    idx: i,
  }
}
export const iniciais = (nome: string) =>
  nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((x) => x[0])
    .join('')
    .toUpperCase()

/* ---------------- resgates ---------------- */
export type Resgate = { codigo: string; data: number; pessoa: number; item: string; pontos: number; status: StatusResgate }
const REF_RESG: { pessoa: number; item: string; status: StatusResgate; data: number }[] = [
  { pessoa: 0, item: 'traje-explorador-epico', status: 'concluido', data: em(3, 11, 10, 24) },
  { pessoa: 1, item: 'oculos-explorador', status: 'enviado', data: em(3, 11, 9, 41) },
  { pessoa: 2, item: 'fone-estelar', status: 'aprovado', data: em(2, 11, 16, 20) },
  { pessoa: 3, item: 'raposa-sivaru', status: 'processamento', data: em(2, 11, 14, 7) },
  { pessoa: 4, item: 'traje-explorador', status: 'concluido', data: em(1, 11, 18, 32) },
  { pessoa: 5, item: 'oculos-explorador', status: 'enviado', data: em(1, 11, 15, 11) },
  { pessoa: 6, item: 'fone-estelar', status: 'concluido', data: em(31, 10, 11, 9) },
  { pessoa: 7, item: 'raposa-sivaru', status: 'concluido', data: em(31, 10, 10, 47) },
  { pessoa: 8, item: 'traje-explorador', status: 'aprovado', data: em(30, 10, 16, 25) },
  { pessoa: 9, item: 'oculos-explorador', status: 'processamento', data: em(30, 10, 9, 18) },
]

/** gera os resgates da plataforma: `resgates30d` nos últimos 30 dias e mais alguns milhares antes */
export function resgatesIniciais(p: PlataformaId, itens: Item[]): Resgate[] {
  const pl = PLAT[p]
  const r = rng(semente(p + 'resgates'))
  const pesos = itens.filter((i) => i.status !== 'rascunho').map((i) => ({ id: i.id, pontos: i.pontos, w: i.resgates }))
  const soma = pesos.reduce((a, x) => a + x.w, 0)
  const sorteia = () => {
    let x = r() * soma
    for (const q of pesos) if ((x -= q.w) <= 0) return q
    return pesos[0]
  }
  const total = Math.round(pl.resgates30d * 2.6)
  const out: Resgate[] = []
  const base = 14582
  const fixos = p === 'exploradores' ? REF_RESG : REF_RESG.map((x) => ({ ...x, item: '' }))
  fixos.forEach((f, k) => {
    const it = f.item ? itens.find((i) => i.id === f.item)! : sorteia()
    out.push({ codigo: `#RG-${String(base - k).padStart(6, '0')}`, data: f.data, pessoa: f.pessoa, item: it.id, pontos: it.pontos, status: f.status })
  })
  const fim30 = AGORA - 30 * DIA
  const ultimoFixo = fixos[fixos.length - 1].data
  for (let k = fixos.length; k < total; k++) {
    const it = sorteia()
    const dentro = k < pl.resgates30d
    const t = dentro ? ultimoFixo - ((k - fixos.length) / (pl.resgates30d - fixos.length)) * (ultimoFixo - fim30 - 3_600_000) : fim30 - ((k - pl.resgates30d) / (total - pl.resgates30d)) * 200 * DIA
    const idade = (AGORA - t) / DIA
    const st: StatusResgate = idade > 6 ? (r() < 0.04 ? 'cancelado' : 'concluido') : pega(r, ['concluido', 'concluido', 'enviado', 'aprovado', 'processamento', 'solicitado'] as const)
    out.push({ codigo: `#RG-${String(base - k).padStart(6, '0')}`, data: Math.round(t - r() * 1_800_000), pessoa: 10 + Math.floor(r() * (pl.totalPessoas - 10)), item: it.id, pontos: it.pontos, status: st })
  }
  return out
}

/* ---------------- extrato de uma pessoa ---------------- */
export type TipoMov = 'credito' | 'resgate' | 'estorno' | 'ajuste'
export type Mov = { id: string; data: number; tipo: TipoMov; desc: string; item?: string; origem: string; pontos: number; saldoApos: number; resp: string }
const REF_MOVS: Omit<Mov, 'id' | 'saldoApos'>[] = [
  { data: em(3, 11, 10, 35), tipo: 'credito', desc: 'Bônus da Olimpíada de Matemática', origem: 'Olimpíadas', pontos: 50000, resp: 'Sistema' },
  { data: em(2, 11, 16, 20), tipo: 'resgate', desc: 'Traje Explorador Épico', item: 'traje-explorador-epico', origem: 'Lojinha', pontos: -120000, resp: '' },
  { data: em(1, 11, 14, 7), tipo: 'credito', desc: 'Conquista: 5 missões da jornada', origem: 'Jornada', pontos: 20000, resp: 'Sistema' },
  { data: em(30, 10, 9, 41), tipo: 'credito', desc: 'Participação na Liga das Estrelas', origem: 'Liga das Estrelas', pontos: 30000, resp: 'Sistema' },
  { data: em(28, 10, 18, 32), tipo: 'resgate', desc: 'Óculos Explorador', item: 'oculos-explorador', origem: 'Lojinha', pontos: -60000, resp: '' },
  { data: em(26, 10, 11, 9), tipo: 'credito', desc: 'Desafio semanal concluído', origem: 'Desafios', pontos: 15000, resp: 'Sistema' },
  { data: em(24, 10, 15, 27), tipo: 'credito', desc: 'Bônus de engajamento mensal', origem: 'Exploradores', pontos: 40000, resp: 'Sistema' },
  { data: em(22, 10, 10, 18), tipo: 'resgate', desc: 'Fundo Galáxia', item: 'fundo-galaxia', origem: 'Lojinha', pontos: -25000, resp: '' },
  { data: em(20, 10, 9, 55), tipo: 'credito', desc: 'Conquista: sequência de 7 dias', origem: 'Exploradores', pontos: 10000, resp: 'Sistema' },
  { data: em(18, 10, 14, 42), tipo: 'credito', desc: 'Participação em atividade da turma', origem: 'Turma', pontos: 15000, resp: 'Sistema' },
]
const CREDITOS = [
  ['Desafio semanal concluído', 'Desafios', 15000],
  ['Missão da trilha concluída', 'Jornada', 10000],
  ['Participação na Liga das Estrelas', 'Liga das Estrelas', 30000],
  ['Bônus de engajamento mensal', 'Exploradores', 40000],
  ['Prova Genial realizada', 'Avaliações', 20000],
  ['Batalha vencida', 'Batalhas', 5000],
  ['Conquista: sequência de 30 dias', 'Exploradores', 25000],
] as const
export const ORIGENS = ['Olimpíadas', 'Lojinha', 'Jornada', 'Liga das Estrelas', 'Desafios', 'Exploradores', 'Turma', 'Avaliações', 'Batalhas', 'Ajuste manual']

export function extratoDe(p: PlataformaId, pessoa: Pessoa, itens: Item[]): Mov[] {
  const r = rng(semente(p + pessoa.id))
  const base = pessoa.idx === 0 && p === 'exploradores' ? REF_MOVS.map((m) => ({ ...m, resp: m.resp || pessoa.nome })) : []
  const ativos = itens.filter((i) => i.status === 'ativo')
  const n = pessoa.idx === 0 ? 42 : 12 + Math.floor(r() * 26)
  let t = base.length ? base[base.length - 1].data : pessoa.ultimo + 6 * 3_600_000
  const lista: Omit<Mov, 'id' | 'saldoApos'>[] = [...base]
  while (lista.length < n) {
    t -= (0.6 + r() * 3.2) * DIA
    if (r() < 0.22) {
      const it = pega(r, ativos)
      lista.push({ data: t, tipo: 'resgate', desc: it.nome, item: it.id, origem: 'Lojinha', pontos: -it.pontos, resp: pessoa.nome })
    } else if (r() < 0.04) {
      lista.push({ data: t, tipo: 'estorno', desc: 'Estorno de resgate cancelado', origem: 'Lojinha', pontos: 25000, resp: 'Equipe Jovens Gênios' })
    } else {
      const [d, o, v] = pega(r, CREDITOS)
      lista.push({ data: t, tipo: 'credito', desc: d, origem: o, pontos: v, resp: 'Sistema' })
    }
  }
  let saldo = pessoa.saldo
  return lista.map((m, k) => {
    const mov = { ...m, id: `MOV-${pessoa.id.slice(-6)}-${k}`, saldoApos: saldo }
    saldo -= m.pontos
    return mov
  })
}

/* ---------------- configurações ---------------- */
export type Config = {
  ativa: boolean
  nome: string
  descricao: string
  moeda: string
  validade: 'nunca' | '6m' | '12m' | '24m'
  exibirSaldo: boolean
  exibirDestaques: boolean
  exibirContador: boolean
  regras: { atividade: string; pontos: number; ativa: boolean }[]
  limiteMensal: number
  limiteDiario: number
  aprovacaoFisicos: boolean
  bloquearInativos: boolean
  cor: string
  notifResgate: boolean
  notifEnvio: boolean
  notifEstoque: boolean
  notifEmail: string
  termos: string
}
export const configInicial = (p: PlataformaId): Config => ({
  ativa: true,
  nome: `Lojinha ${PLAT[p].nome === 'Geniex' ? 'GenieX' : PLAT[p].nome}`,
  descricao: 'Troque seus pontos por itens, avatares e recompensas especiais!',
  moeda: 'pontos',
  validade: 'nunca',
  exibirSaldo: true,
  exibirDestaques: true,
  exibirContador: false,
  regras: [
    { atividade: 'Concluir uma missão da trilha', pontos: 10000, ativa: true },
    { atividade: 'Desafio semanal concluído', pontos: 15000, ativa: true },
    { atividade: 'Participar da Liga das Estrelas', pontos: 30000, ativa: true },
    { atividade: 'Bônus de olimpíada', pontos: 50000, ativa: true },
    { atividade: 'Sequência de 7 dias de estudo', pontos: 10000, ativa: true },
    { atividade: 'Vencer uma batalha', pontos: 5000, ativa: false },
  ],
  limiteMensal: 5,
  limiteDiario: 2,
  aprovacaoFisicos: true,
  bloquearInativos: true,
  cor: '#7c3aed',
  notifResgate: true,
  notifEnvio: true,
  notifEstoque: true,
  notifEmail: 'lojinha@jovensgenios.com',
  termos:
    'Os pontos são pessoais e intransferíveis. Itens digitais são liberados automaticamente após a aprovação. Itens físicos são entregues na escola em até 15 dias úteis. Resgates cancelados têm os pontos estornados ao saldo do estudante.',
})
