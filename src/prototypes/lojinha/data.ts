/* =====================================================================
   Conteúdo do protótipo Lojinha (plataforma dos Exploradores)
   ===================================================================== */

export type Raridade = 'comum' | 'raro' | 'epico' | 'lendario'
export const RARIDADES: Record<Raridade, { nome: string; ordem: number }> = {
  comum: { nome: 'Comum', ordem: 0 },
  raro: { nome: 'Raro', ordem: 1 },
  epico: { nome: 'Épico', ordem: 2 },
  lendario: { nome: 'Lendário', ordem: 3 },
}

export type CategoriaId = 'avatares' | 'backgrounds' | 'pets' | 'cards' | 'personalizacao' | 'recompensas'
export type Categoria = { id: CategoriaId; nome: string; singular: string; img: string; titulo: string; texto: string; ondeAparece: string }
export const CATEGORIAS: Categoria[] = [
  { id: 'avatares', nome: 'Avatares', singular: 'Avatar', img: './loja/c-avatares.webp', titulo: 'Avatares', texto: 'Escolha um novo visual para o seu explorador e deixe sua jornada ainda mais única!', ondeAparece: 'O traje será liberado na área de personalização do seu perfil, em Avatares.' },
  { id: 'backgrounds', nome: 'Backgrounds', singular: 'Background', img: './loja/c-backgrounds.webp', titulo: 'Backgrounds', texto: 'Cenários incríveis para o fundo do seu perfil de explorador.', ondeAparece: 'O cenário será liberado na área de personalização do seu perfil, em Backgrounds.' },
  { id: 'pets', nome: 'Pets', singular: 'Pet', img: './loja/c-pets.webp', titulo: 'Pets', texto: 'Companheiros fiéis para acompanhar você em todas as missões.', ondeAparece: 'O pet aparecerá ao lado do seu avatar no perfil e nas Batalhas.' },
  { id: 'cards', nome: 'Cards', singular: 'Cards', img: './loja/c-cards.webp', titulo: 'Cards', texto: 'Pacotes de cards colecionáveis do Clube Jovens Gênios.', ondeAparece: 'Os pacotes físicos são entregues na sua escola pela equipe do Clube Jovens Gênios.' },
  { id: 'personalizacao', nome: 'Personalização', singular: 'Personalização', img: './loja/c-personalizacao.webp', titulo: 'Personalização', texto: 'Acessórios e detalhes para deixar o seu explorador com a sua cara.', ondeAparece: 'O acessório será liberado na área de personalização do seu perfil.' },
  { id: 'recompensas', nome: 'Recompensas exclusivas', singular: 'Recompensa exclusiva', img: './loja/c-recompensas.webp', titulo: 'Recompensas exclusivas', texto: 'Prêmios físicos e experiências especiais do Clube Jovens Gênios.', ondeAparece: 'A recompensa é entregue na sua escola em até 15 dias úteis após a aprovação.' },
]
export const CAT = Object.fromEntries(CATEGORIAS.map((c) => [c.id, c])) as Record<CategoriaId, Categoria>

export type Item = {
  id: string
  nome: string
  cat: CategoriaId
  raridade: Raridade
  pontos: number
  /** imagem recortada (fundo transparente) ou foto (cenários e miniaturas) */
  img: string
  foto?: boolean
  /** variações de cor geradas a partir da mesma arte */
  filtro?: string
  /** cor de fundo do card */
  fundo: string
  tipo: 'digital' | 'fisico'
  descricao: string
  /** galeria própria (só o Traje Explorador tem fotos da referência) */
  galeria?: string[]
  destaque?: boolean
  /** ordem de chegada (maior = mais recente) */
  novo: number
}

const LILAS = '#f1e8fd'
const PESSEGO = '#fef2e2'
const AZUL = '#e6f2fd'
const VERDE = '#dbf5f3'
const ROSA = '#fde8f1'

const DESC_TRAJE = (estilo: string) => `Um traje especial para quem vive grandes aventuras pelo conhecimento. ${estilo}`
const t = (id: string, nome: string, raridade: Raridade, pontos: number, base: string, fundo: string, novo: number, estilo: string, filtro?: string, extra: Partial<Item> = {}): Item => ({
  id,
  nome,
  cat: 'avatares',
  raridade,
  pontos,
  img: `./loja/traje-${base}.webp`,
  filtro,
  fundo,
  tipo: 'digital',
  descricao: DESC_TRAJE(estilo),
  novo,
  ...extra,
})

export const ITENS: Item[] = [
  /* ---------------- Avatares (24) ---------------- */
  t('traje-explorador', 'Traje Explorador Épico', 'lendario', 120000, 'explorador', VERDE, 100, 'Destaque-se na galáxia dos Exploradores com este visual exclusivo!', undefined, {
    galeria: ['./loja/traje-epico-1.webp', './loja/traje-epico-2.webp', './loja/traje-epico-3.webp', './loja/traje-epico-4.webp'],
    destaque: true,
  }),
  t('traje-galactico', 'Traje Galáctico', 'epico', 95000, 'galactico', LILAS, 99, 'Branco como uma nave estelar, com detalhes em azul que brilham no escuro.'),
  t('traje-minerador', 'Traje Minerador Espacial', 'raro', 60000, 'minerador', PESSEGO, 98, 'Pronto para escavar asteroides atrás de cristais raros.'),
  t('traje-cosmico', 'Traje Cósmico', 'raro', 60000, 'cosmico', AZUL, 97, 'Feito de energia azul das estrelas mais distantes.'),
  t('traje-nebulosa', 'Traje Nebulosa', 'epico', 95000, 'nebulosa', LILAS, 96, 'Com as cores das nebulosas onde nascem novas estrelas.'),
  t('traje-solar', 'Traje Solar', 'raro', 60000, 'solar', PESSEGO, 95, 'Quente como o Sol e cheio de energia para os desafios.'),
  t('traje-tech', 'Traje Tech', 'comum', 25000, 'tech', AZUL, 94, 'Equipado com fones e sensores para as missões de tecnologia.'),
  t('traje-floresta', 'Traje Floresta Estelar', 'epico', 95000, 'floresta', LILAS, 93, 'Folhas de um planeta-floresta protegem o explorador.'),
  t('traje-eclipse', 'Traje Eclipse', 'lendario', 120000, 'eclipse', LILAS, 92, 'Misterioso como um eclipse, com fios dourados de luz.'),
  t('traje-imperial', 'Traje Imperial', 'lendario', 120000, 'imperial', LILAS, 91, 'Com coroa e manto de quem lidera a galáxia.'),
  t('traje-dragao', 'Traje Dragão Estelar', 'lendario', 120000, 'eclipse', VERDE, 90, 'Escamas verdes que refletem a luz das constelações.', 'hue-rotate(110deg) saturate(1.1)'),
  t('traje-supernova', 'Traje Supernova', 'epico', 95000, 'nebulosa', ROSA, 89, 'Explosão de cores de uma supernova.', 'hue-rotate(60deg) saturate(1.2)'),
  t('traje-cristal', 'Traje Cristal', 'epico', 90000, 'galactico', AZUL, 88, 'Brilha como cristais de gelo de Europa.', 'hue-rotate(-30deg) saturate(1.4)'),
  t('traje-vulcao', 'Traje Vulcão', 'raro', 60000, 'solar', ROSA, 87, 'Forjado no calor de um vulcão marciano.', 'hue-rotate(-20deg) saturate(1.2)'),
  t('traje-coral', 'Traje Coral', 'raro', 55000, 'minerador', ROSA, 86, 'Para explorar oceanos de outros planetas.', 'hue-rotate(-45deg)'),
  t('traje-gelo', 'Traje Gelo', 'raro', 60000, 'cosmico', VERDE, 85, 'Resistente às tempestades geladas.', 'hue-rotate(-40deg) saturate(.9)'),
  t('traje-esmeralda', 'Traje Esmeralda', 'raro', 50000, 'nebulosa', VERDE, 84, 'Verde como as auroras do polo.', 'hue-rotate(150deg)'),
  t('traje-recruta', 'Traje Recruta', 'comum', 15000, 'tech', VERDE, 83, 'O primeiro traje de todo explorador.', 'hue-rotate(140deg) saturate(.8)'),
  t('traje-aprendiz', 'Traje Aprendiz', 'comum', 20000, 'cosmico', LILAS, 82, 'Leve e confortável para começar a jornada.', 'hue-rotate(50deg) saturate(.7)'),
  t('traje-aurora', 'Traje Aurora', 'comum', 25000, 'tech', ROSA, 81, 'Com tons do amanhecer.', 'hue-rotate(110deg)'),
  t('traje-cadete', 'Traje Cadete', 'comum', 20000, 'minerador', AZUL, 80, 'Uniforme oficial da academia de exploradores.', 'hue-rotate(180deg) saturate(.7)'),
  t('traje-neve', 'Traje Neve', 'comum', 15000, 'galactico', AZUL, 79, 'Branco como a neve de Plutão.', 'grayscale(.6)'),
  t('traje-oceano', 'Traje Oceano', 'comum', 25000, 'cosmico', AZUL, 78, 'Azul profundo como o mar.', 'hue-rotate(-15deg) saturate(.8)'),
  t('traje-pixel', 'Traje Pixel', 'comum', 20000, 'solar', VERDE, 77, 'Inspirado nos jogos clássicos.', 'hue-rotate(90deg) saturate(.7)'),

  /* ---------------- Backgrounds ---------------- */
  ...(
    [
      ['bg-base-nacao', 'Base da Nação', 'raro', 60000, undefined, 'A base secreta dos Exploradores, escondida numa floresta tropical sob um planeta gigante.', true],
      ['bg-floresta-lunar', 'Floresta Lunar', 'raro', 55000, 'hue-rotate(60deg) brightness(.9)', 'Uma floresta iluminada pela luz da lua.', false],
      ['bg-deserto-solar', 'Deserto Solar', 'comum', 30000, 'hue-rotate(-70deg) saturate(1.2)', 'Dunas douradas sob dois sóis.', false],
      ['bg-vale-neon', 'Vale Neon', 'epico', 85000, 'hue-rotate(150deg) saturate(1.5)', 'Um vale que brilha em cores neon.', false],
      ['bg-oceano', 'Oceano Profundo', 'comum', 30000, 'hue-rotate(40deg) saturate(.8) brightness(.95)', 'Paisagem submarina cheia de vida.', false],
      ['bg-aurora', 'Aurora Boreal', 'lendario', 110000, 'hue-rotate(200deg) saturate(1.3)', 'O céu dança com as luzes da aurora.', false],
    ] as const
  ).map(([id, nome, raridade, pontos, filtro, descricao, destaque], i): Item => ({ id, nome, cat: 'backgrounds', raridade, pontos, img: './loja/bg-base-nacao.webp', foto: true, filtro, fundo: AZUL, tipo: 'digital', descricao, destaque, novo: 70 - i })),

  /* ---------------- Pets ---------------- */
  { id: 'pet-passaro', nome: 'Pássaro Aravé', cat: 'pets', raridade: 'lendario', pontos: 95000, img: './loja/d-passaro.webp', fundo: LILAS, tipo: 'digital', descricao: 'Um pássaro raro das florestas brasileiras que guia os exploradores pelos caminhos certos.', destaque: true, novo: 60 },
  { id: 'pet-raposa', nome: 'Raposa Sivaru', cat: 'pets', raridade: 'epico', pontos: 95000, img: './loja/c-pets.webp', fundo: PESSEGO, tipo: 'digital', descricao: 'Raposa de pelagem flamejante, curiosa e muito leal ao seu explorador.', novo: 59 },
  { id: 'pet-raposa-glacial', nome: 'Raposa Glacial', cat: 'pets', raridade: 'raro', pontos: 60000, img: './loja/c-pets.webp', filtro: 'hue-rotate(180deg) saturate(.8)', fundo: AZUL, tipo: 'digital', descricao: 'Prima da Sivaru, vive nas montanhas geladas.', novo: 58 },
  { id: 'pet-passaro-solar', nome: 'Pássaro Solar', cat: 'pets', raridade: 'raro', pontos: 55000, img: './loja/d-passaro.webp', filtro: 'hue-rotate(-70deg) saturate(1.2)', fundo: PESSEGO, tipo: 'digital', descricao: 'Suas penas brilham como o pôr do sol.', novo: 57 },
  { id: 'pet-raposa-lunar', nome: 'Raposa Lunar', cat: 'pets', raridade: 'comum', pontos: 30000, img: './loja/c-pets.webp', filtro: 'hue-rotate(240deg) saturate(.7)', fundo: LILAS, tipo: 'digital', descricao: 'Aparece nas noites de lua cheia.', novo: 56 },

  /* ---------------- Cards (físicos) ---------------- */
  { id: 'cards-estelar', nome: 'Pacote de Cards Estelar', cat: 'cards', raridade: 'comum', pontos: 25000, img: './loja/d-cartas.webp', fundo: LILAS, tipo: 'fisico', descricao: 'Pacote com 8 cards colecionáveis dos Exploradores, incluindo 1 card brilhante.', destaque: true, novo: 50 },
  { id: 'cards-galactico', nome: 'Pacote de Cards Galáctico', cat: 'cards', raridade: 'raro', pontos: 45000, img: './loja/d-cartas.webp', filtro: 'hue-rotate(-60deg)', fundo: AZUL, tipo: 'fisico', descricao: 'Pacote com 10 cards e 2 cards holográficos da coleção Galáxia.', novo: 49 },
  { id: 'cards-lendario', nome: 'Pacote de Cards Lendário', cat: 'cards', raridade: 'lendario', pontos: 100000, img: './loja/d-cartas.webp', filtro: 'hue-rotate(160deg) saturate(1.3)', fundo: PESSEGO, tipo: 'fisico', descricao: 'Edição limitada com cards lendários numerados.', novo: 48 },

  /* ---------------- Personalização ---------------- */
  { id: 'p-oculos', nome: 'Óculos de Explorador', cat: 'personalizacao', raridade: 'raro', pontos: 40000, img: './loja/c-personalizacao.webp', fundo: AZUL, tipo: 'digital', descricao: 'Óculos de aviador para enxergar novos horizontes.', novo: 45 },
  { id: 'p-oculos-neon', nome: 'Óculos Neon', cat: 'personalizacao', raridade: 'epico', pontos: 70000, img: './loja/c-personalizacao.webp', filtro: 'hue-rotate(120deg) saturate(1.4)', fundo: LILAS, tipo: 'digital', descricao: 'Lentes que brilham durante as Batalhas.', novo: 44 },
  { id: 'p-medalha', nome: 'Moldura Medalha de Ouro', cat: 'personalizacao', raridade: 'lendario', pontos: 90000, img: './loja/r-medalha.webp', fundo: PESSEGO, tipo: 'digital', descricao: 'Moldura dourada para a foto do seu perfil.', novo: 43 },
  { id: 'p-estrela', nome: 'Emblema Estrela', cat: 'personalizacao', raridade: 'comum', pontos: 15000, img: './loja/r-estrela.webp', fundo: PESSEGO, tipo: 'digital', descricao: 'Emblema para exibir ao lado do seu nome.', novo: 42 },

  /* ---------------- Recompensas exclusivas (físicas) ---------------- */
  { id: 'r-caixa', nome: 'Caixa Surpresa Explorador', cat: 'recompensas', raridade: 'epico', pontos: 150000, img: './loja/c-recompensas.webp', fundo: ROSA, tipo: 'fisico', descricao: 'Caixa com itens surpresa do Clube Jovens Gênios: adesivos, chaveiro e muito mais.', novo: 40 },
  { id: 'r-trofeu', nome: 'Troféu Explorador do Ano', cat: 'recompensas', raridade: 'lendario', pontos: 300000, img: './loja/r-trofeu.webp', fundo: PESSEGO, tipo: 'fisico', descricao: 'Troféu físico personalizado com o seu nome.', novo: 39 },
  { id: 'r-caixa-azul', nome: 'Kit Material Escolar', cat: 'recompensas', raridade: 'raro', pontos: 80000, img: './loja/c-recompensas.webp', filtro: 'hue-rotate(200deg)', fundo: AZUL, tipo: 'fisico', descricao: 'Kit com caderno, estojo e canetas dos Exploradores.', novo: 38 },
]
export const ITEM = Object.fromEntries(ITENS.map((i) => [i.id, i])) as Record<string, Item>
export const DESTAQUES = ['traje-explorador', 'bg-base-nacao', 'pet-passaro', 'cards-estelar']

/** características exibidas no detalhe do item */
export function caracteristicas(i: Item) {
  const visual = i.cat === 'avatares' ? ['Visual exclusivo', 'Personalize seu explorador com um traje único.'] : i.tipo === 'fisico' ? ['Item físico', 'Entregue na sua escola pela equipe do Clube.'] : ['Visual exclusivo', `Deixe seu perfil com a sua cara.`]
  const rar = { comum: ['Raridade comum', 'Ótimo para começar a sua coleção.'], raro: ['Raridade rara', 'Item procurado pelos exploradores.'], epico: ['Raridade épica', 'Item especial e limitado da Lojinha.'], lendario: ['Raridade lendária', 'Um dos itens mais raros da Lojinha.'] }[i.raridade]
  const uso = i.tipo === 'fisico' ? ['Entrega na escola', 'Em até 15 dias úteis após a aprovação.'] : ['Uso imediato', 'Disponível no seu perfil após o resgate.']
  return [visual, rar, uso] as [string, string][]
}

/* ---------------- tempo ---------------- */
/** “Hoje” no protótipo: 05/11/2026, 10:30 */
export const HOJE = new Date(2026, 10, 5, 10, 30).getTime()
const MES = ['jan.', 'fev.', 'mar.', 'abr.', 'mai.', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.']
export const dataCurta = (t: number) => {
  const d = new Date(t)
  const h = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  const hoje = new Date(HOJE)
  const dias = Math.round((new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()).getTime() - new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()) / 86_400_000)
  if (dias <= 0) return `Hoje, ${h}`
  if (dias === 1) return `Ontem, ${h}`
  return `${String(d.getDate()).padStart(2, '0')} de ${MES[d.getMonth()]}, ${h}`
}
export const em = (dia: number, mes: number, h: number, m: number) => new Date(2026, mes - 1, dia, h, m).getTime()
export const fmt = (n: number) => n.toLocaleString('pt-BR')

/* ---------------- movimentações e resgates iniciais ---------------- */
export type TipoMov = 'ganho' | 'bonus' | 'resgate' | 'estorno'
export type Mov = { id: string; tipo: TipoMov; titulo: string; desc: string; valor: number; data: number }
export const MOVS_BASE: Mov[] = [
  { id: 'm1', tipo: 'ganho', titulo: 'Pontos conquistados', desc: 'Concluiu uma missão na Trilha de Ciências', valor: 1000, data: em(5, 11, 10, 24) },
  { id: 'm3', tipo: 'ganho', titulo: 'Pontos conquistados', desc: 'Finalizou uma Batalha Solo', valor: 2500, data: em(3, 11, 14, 20) },
  { id: 'm4', tipo: 'resgate', titulo: 'Resgate de recompensa', desc: 'Base da Nação', valor: -60000, data: em(1, 11, 9, 17) },
  { id: 'm5', tipo: 'bonus', titulo: 'Pontos de bônus', desc: 'Participação na Olimpíada Genial', valor: 5000, data: em(1, 11, 9, 10) },
  { id: 'm6', tipo: 'resgate', titulo: 'Resgate de recompensa', desc: 'Pacote de Cards Estelar', valor: -25000, data: em(28, 10, 16, 47) },
  { id: 'm7', tipo: 'resgate', titulo: 'Resgate de recompensa', desc: 'Raposa Sivaru', valor: -95000, data: em(27, 10, 15, 26) },
  { id: 'm8', tipo: 'ganho', titulo: 'Pontos conquistados', desc: 'Concluiu a Trilha de Matemática', valor: 15000, data: em(25, 10, 11, 2) },
  { id: 'm9', tipo: 'estorno', titulo: 'Estorno de resgate', desc: 'Garrafinha Galáctica (fora de estoque)', valor: 40000, data: em(20, 10, 8, 40) },
  { id: 'm10', tipo: 'bonus', titulo: 'Pontos de bônus', desc: 'Sequência de 365 dias de estudo', valor: 36500, data: em(14, 10, 7, 0) },
  { id: 'm11', tipo: 'ganho', titulo: 'Pontos conquistados', desc: 'Realizou a Prova Genial de Ciências', valor: 8000, data: em(9, 10, 15, 30) },
  { id: 'm12', tipo: 'ganho', titulo: 'Pontos conquistados', desc: 'Venceu 5 Batalhas em dupla', valor: 12000, data: em(28, 9, 18, 12) },
  { id: 'm13', tipo: 'bonus', titulo: 'Pontos de bônus', desc: 'Evento especial Semana da Ciência', valor: 20000, data: em(15, 9, 10, 0) },
]
export const MOV_TRAJE: Mov = { id: 'm2', tipo: 'resgate', titulo: 'Resgate de recompensa', desc: 'Traje Explorador Épico', valor: -120000, data: em(3, 11, 14, 22) }

export type StatusResgate = 'processamento' | 'concluido' | 'enviado' | 'entregue' | 'cancelado'
export type Resgate = { id: string; item: string; pontos: number; data: number; status: StatusResgate; img?: string }
export const RESGATES_BASE: Resgate[] = [
  { id: 'r2', item: 'bg-base-nacao', pontos: 60000, data: em(1, 11, 9, 17), status: 'concluido', img: './loja/t-base-nacao.webp' },
  { id: 'r3', item: 'cards-estelar', pontos: 25000, data: em(28, 10, 11, 3), status: 'enviado', img: './loja/t-pacote.webp' },
  { id: 'r4', item: 'pet-raposa', pontos: 95000, data: em(27, 10, 15, 26), status: 'concluido', img: './loja/t-raposa.webp' },
]
export const RESGATE_TRAJE: Resgate = { id: 'r1', item: 'traje-explorador', pontos: 120000, data: em(3, 11, 14, 22), status: 'processamento', img: './loja/t-resgate-traje.webp' }

/* ---------------- regras ---------------- */
export type Topico = { id: string; nome: string; titulo: string; sub: string; img: string; blocos: { t: string; itens?: [string, string][]; texto?: string[] }[]; importante?: string }
export const TOPICOS: Topico[] = [
  {
    id: 'conquistar',
    nome: 'Como conquistar pontos',
    titulo: 'Como conquistar pontos',
    sub: 'Acumule pontos participando das atividades da plataforma e avançando na sua jornada de aprendizagem.',
    img: './loja/r-trofeu.webp',
    blocos: [{ t: 'Principais formas de ganhar pontos:' }],
    importante: 'A quantidade de pontos pode variar de acordo com a atividade. Fique de olho nas novidades e eventos especiais da plataforma!',
  },
  {
    id: 'usar',
    nome: 'Como usar seus pontos',
    titulo: 'Como usar seus pontos',
    sub: 'Troque seus pontos por itens da Lojinha sempre que quiser.',
    img: './loja/gema.webp',
    blocos: [
      {
        t: 'Passo a passo',
        itens: [
          ['1. Escolha um item', 'Navegue pelas categorias da Lojinha e abra os detalhes do item.'],
          ['2. Confira o saldo', 'O valor do item é descontado do seu saldo na hora do resgate.'],
          ['3. Resgate', 'Toque em “Resgatar agora” e confirme. Pronto!'],
          ['4. Aproveite', 'Itens digitais ficam disponíveis no seu perfil. Itens físicos são entregues na escola.'],
        ],
      },
    ],
    importante: 'Os pontos são pessoais e não podem ser transferidos para outros exploradores.',
  },
  {
    id: 'resgates',
    nome: 'Resgates',
    titulo: 'Resgates',
    sub: 'Acompanhe cada resgate na aba “Meus Resgates”.',
    img: './loja/c-recompensas.webp',
    blocos: [
      {
        t: 'Status de um resgate',
        itens: [
          ['Em processamento', 'Recebemos seu pedido e estamos liberando o item.'],
          ['Concluído', 'O item digital já está disponível no seu perfil.'],
          ['Enviado', 'O item físico saiu para entrega na sua escola.'],
          ['Entregue', 'O item físico foi entregue a você na escola.'],
        ],
      },
    ],
  },
  {
    id: 'validade',
    nome: 'Validade dos pontos',
    titulo: 'Validade dos pontos',
    sub: 'Seus pontos valem até o fim do ano letivo seguinte ao que foram conquistados.',
    img: './loja/r-prancheta.webp',
    blocos: [{ t: 'Como funciona', texto: ['Pontos conquistados em 2026 podem ser usados até 31 de dezembro de 2027.', 'Você recebe um aviso 30 dias antes de qualquer ponto expirar.', 'Os pontos mais antigos são usados primeiro nos resgates.'] }],
  },
  {
    id: 'cancelamentos',
    nome: 'Cancelamentos e estornos',
    titulo: 'Cancelamentos e estornos',
    sub: 'Em alguns casos, os pontos de um resgate voltam para você.',
    img: './loja/r-alvo.webp',
    blocos: [{ t: 'Quando acontece o estorno', texto: ['Item físico fora de estoque.', 'Resgate feito por engano, cancelado em até 24 horas.', 'Problemas técnicos na liberação de um item digital.'] }],
    importante: 'Os pontos estornados aparecem no seu Histórico como “Estorno de resgate”.',
  },
  {
    id: 'fisicos',
    nome: 'Produtos físicos',
    titulo: 'Produtos físicos',
    sub: 'Cards, kits e prêmios especiais são entregues na sua escola.',
    img: './loja/c-cards.webp',
    blocos: [{ t: 'Entrega', texto: ['A entrega é feita na escola em até 15 dias úteis.', 'A equipe da escola avisa quando o seu prêmio chegar.', 'Apresente o seu Cartão Fidelidade (QR Code) para retirar.'] }],
  },
  {
    id: 'regulamento',
    nome: 'Regulamento',
    titulo: 'Regulamento',
    sub: 'Regras gerais do programa de pontos do Clube Jovens Gênios.',
    img: './loja/r-estrela.webp',
    blocos: [
      {
        t: 'Resumo do regulamento',
        texto: [
          'O programa é gratuito e exclusivo para estudantes da plataforma dos Exploradores.',
          'Os itens da Lojinha podem mudar a qualquer momento e alguns têm quantidade limitada.',
          'Tentativas de obter pontos de forma indevida podem levar ao bloqueio do cartão.',
          'Dúvidas? Fale com a equipe pela Central de Ajuda.',
        ],
      },
    ],
  },
]
export const FORMAS_PONTOS = [
  { img: './loja/r-alvo.webp', t: 'Concluir trilhas e atividades' },
  { img: './loja/r-medalha.webp', t: 'Participar de olimpíadas' },
  { img: './loja/r-espadas.webp', t: 'Jogar Batalhas' },
  { img: './loja/r-prancheta.webp', t: 'Realizar provas e desafios' },
  { img: './loja/r-estrela.webp', t: 'Participar de ações especiais' },
]
