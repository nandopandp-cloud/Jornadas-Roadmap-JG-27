/* =====================================================================
   Motor de pontuação e de recomendação (METODOLOGIA.md §7 a §9)
   Funções puras e determinísticas: as mesmas respostas, na mesma versão,
   produzem sempre o mesmo resultado. Nada aqui depende da interface.
   ===================================================================== */
import { CARREIRAS, perfilDe, type Carreira } from './carreiras'
import { DIM, DIMS, HABILIDADES, ITEM, ITENS, VERSAO_INSTRUMENTO, VERSAO_REGRAS, itensDo, obrigatorio, respondido, type Dim, type Item, type Respostas } from './instrumento'

/* ---------------- perfil RIASEC ---------------- */
export type Perfil = {
  /** soma dos 5 itens da dimensão (5 a 25) */
  soma: Record<Dim, number>
  /** ((soma − 5) / 20) × 100 — posição na escala de respostas, não percentual de aptidão */
  norm: Record<Dim, number>
  /** dimensões da maior para a menor (empates mantêm a ordem R I A S E C) */
  ordem: Dim[]
  /** até três pistas prioritárias de exploração */
  destaques: Dim[]
  /** dimensões empatadas com a 3ª pista (preservadas, não descartadas em silêncio) */
  empatadas: Dim[]
  /** pontuações próximas entre si: não forçar uma dimensão dominante */
  distribuido: boolean
  /** praticamente sem diferença entre dimensões: não há base para recomendar */
  inconclusivo: boolean
  /** itens respondidos com 4 ou 5 em cada dimensão (o que contribuiu) */
  contribuiram: Record<Dim, string[]>
}

export function faltando(r: Respostas): Item[] {
  return ITENS.filter((i) => obrigatorio(i) && !respondido(r, i.id))
}

export function calcularPerfil(r: Respostas): Perfil | null {
  const riasec = itensDo('A')
  if (riasec.some((i) => typeof r[i.id] !== 'number')) return null // exige os 30 itens; nunca preenche ausentes com valor padrão
  const soma = {} as Record<Dim, number>
  const norm = {} as Record<Dim, number>
  const contribuiram = {} as Record<Dim, string[]>
  for (const d of DIMS) {
    const itens = riasec.filter((i) => i.bloco === 'A' && i.dim === d)
    soma[d] = itens.reduce((s, i) => s + (r[i.id] as number), 0)
    norm[d] = Math.round(((soma[d] - 5) / 20) * 100)
    contribuiram[d] = itens.filter((i) => (r[i.id] as number) >= 4).sort((a, b) => (r[b.id] as number) - (r[a.id] as number)).map((i) => i.id)
  }
  const ordem = [...DIMS].sort((a, b) => soma[b] - soma[a])
  const corte = soma[ordem[2]]
  const destaques = ordem.slice(0, 3).filter((d) => soma[d] >= 13 || d === ordem[0]) // abaixo de “talvez” em média não vira pista
  const empatadas = ordem.slice(3).filter((d) => soma[d] === corte && destaques.length === 3)
  const amplitude = norm[ordem[0]] - norm[ordem[5]]
  return { soma, norm, ordem, destaques, empatadas, distribuido: amplitude < 25, inconclusivo: amplitude < 10, contribuiram }
}

export const nivel = (n: number) => (n >= 70 ? 'Interesse alto' : n >= 40 ? 'Interesse moderado' : 'Interesse menor')

/* ---------------- valores, preferências e habilidades ---------------- */
export function valoresDestacados(r: Respostas) {
  const vs = itensDo('B').map((i) => ({ id: i.id, nome: (i as { curto: string }).curto, v: (r[i.id] as number) ?? 0 }))
  const max = Math.max(...vs.map((v) => v.v))
  return vs.filter((v) => v.v >= 4 && v.v >= max - 1).sort((a, b) => b.v - a.v)
}

export function preferencias(r: Respostas) {
  return itensDo('C').flatMap((i) => {
    if (i.tipo !== 'par' || (r[i.id] !== 'a' && r[i.id] !== 'b')) return []
    const lado = r[i.id] as 'a' | 'b'
    return [{ id: i.id, lado, texto: lado === 'a' ? i.a : i.b, rotulo: i.rotulos[lado === 'a' ? 0 : 1], outro: lado === 'a' ? i.b : i.a }]
  })
}

export function habilidades(r: Respostas) {
  const dev = (r['H-DEV'] as string[] | undefined) ?? []
  return {
    facilidade: HABILIDADES.filter((h) => ((r[h.id] as number) ?? 0) >= 4).map((h) => h.nome),
    desenvolver: HABILIDADES.filter((h) => dev.includes(h.id)).map((h) => h.nome),
  }
}

/* ---------------- recomendação ---------------- */
export type Categoria = 'explorar' | 'complementar'
export const CATEGORIA: Record<Categoria, string> = { explorar: 'Vale a pena explorar', complementar: 'Possibilidade complementar' }

export type Recomendacao = {
  id: string
  categoria: Categoria
  /** distância ponderada (0 = perfis iguais); usada só para ordenar, nunca exibida como compatibilidade */
  distancia: number
  /** dimensões da ocupação que aparecem entre as pistas do estudante */
  combina: Dim[]
  motivos: string[]
  atencao?: string
}

/**
 * Dⱼ = √[Σₖ wₖ(Sₖ − Pⱼₖ)² / Σₖ wₖ], com wₖ = 1 + Sₖ/100:
 * dimensões em que o estudante demonstrou mais interesse pesam mais na comparação.
 */
export function distancia(p: Perfil, c: Carreira) {
  const ref = perfilDe(c.codigo)
  let num = 0
  let den = 0
  for (const d of DIMS) {
    const w = 1 + p.norm[d] / 100
    num += w * (p.norm[d] - ref[d]) ** 2
    den += w
  }
  return Math.sqrt(num / den)
}

const lista = (xs: string[]) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} e ${xs[xs.length - 1]}`)
const ROTULO_ESCALA = ['', 'Não gostaria nada', 'Gostaria pouco', 'Talvez', 'Gostaria bastante', 'Gostaria muito']

/** frases de contexto (Bloco C) quando a ocupação costuma pedir o outro lado do par */
const CONTEXTO_TXT: Record<string, [string, string]> = {
  P01: ['interagir com outras pessoas com frequência', 'longos períodos de concentração individual'],
  P02: ['rotinas e processos bem definidos', 'atividades que mudam com frequência'],
  P03: ['atividades práticas e resultados concretos', 'trabalho com ideias, conceitos e análises'],
  P04: ['executar procedimentos já definidos', 'ajudar a definir objetivos e construir soluções'],
  P05: ['aprofundar-se em um tema específico', 'alternar entre temas e atividades'],
  P06: ['atuação presencial ou em campo', 'trabalho em ambiente digital ou remoto'],
}

/** explicação vinculada às respostas efetivamente registradas (nada de traços que o instrumento não mede) */
export function explicar(p: Perfil, r: Respostas, c: Carreira): Omit<Recomendacao, 'id' | 'categoria' | 'distancia'> {
  const letras = [...c.codigo] as Dim[]
  const combina = letras.filter((d) => p.destaques.includes(d) || p.empatadas.includes(d))
  const motivos: string[] = []
  if (combina.length) {
    motivos.push(`Suas respostas indicam interesse por ${lista(combina.map((d) => `**${DIM[d].nome.toLowerCase()}**`))}, ${combina.length > 1 ? 'atividades centrais' : 'uma atividade central'} nesta profissão.`)
    const evid = combina.flatMap((d) => p.contribuiram[d]).find((id) => r[id] === 5) ?? combina.flatMap((d) => p.contribuiram[d])[0]
    if (evid) motivos.push(`Você respondeu “${ROTULO_ESCALA[r[evid] as number]}” para “${ITEM[evid].texto.replace(/\.$/, '')}”.`)
  } else {
    const d = letras[0]
    motivos.push(`Amplia seu repertório: envolve **${DIM[d].nome.toLowerCase()}**, que apareceu com ${nivel(p.norm[d]).replace('Interesse ', 'intensidade ')} nas suas respostas.`)
  }
  const vals = valoresDestacados(r).filter((v) => c.valores.includes(v.id))
  if (vals.length) motivos.push(`Costuma oferecer ${lista(vals.slice(0, 2).map((v) => `**${v.nome.toLowerCase()}**`))}, que você marcou como importante.`)

  let atencao: string | undefined
  for (const pr of preferencias(r)) {
    const tipico = c.contexto[pr.id as keyof Carreira['contexto']]
    if (tipico !== 'ambos' && tipico !== pr.lado) {
      const [ta, tb] = CONTEXTO_TXT[pr.id]
      atencao = `No dia a dia costuma envolver ${tipico === 'a' ? ta : tb}, e você indicou preferir ${pr.lado === 'a' ? ta : tb}. Vale investigar como isso funciona na prática.`
      break
    }
  }
  return { combina, motivos, atencao }
}

export function recomendar(p: Perfil, r: Respostas, catalogo: Carreira[] = CARREIRAS) {
  const todas = catalogo
    .map((c) => ({ c, d: distancia(p, c) }))
    .sort((a, b) => a.d - b.d || a.c.nome.localeCompare(b.c.nome))
  if (p.inconclusivo) return { selecao: [] as Recomendacao[], todas: todas.map((x) => x.c.id) }

  // diversidade: no máximo 2 por dimensão principal e 2 por área; ao menos uma pouco conhecida
  const escolhidas: typeof todas = []
  for (const x of todas) {
    if (escolhidas.length === 6) break
    const mesmaDim = escolhidas.filter((y) => y.c.codigo[0] === x.c.codigo[0]).length
    const mesmaArea = escolhidas.filter((y) => y.c.area === x.c.area).length
    if (mesmaDim < 2 && mesmaArea < 2) escolhidas.push(x)
  }
  if (!escolhidas.some((x) => x.c.poucoConhecida)) {
    const extra = todas.find((x) => x.c.poucoConhecida && !escolhidas.includes(x))
    if (extra) escolhidas[escolhidas.length - 1] = extra
  }
  const top = p.destaques
  const selecao: Recomendacao[] = escolhidas.map(({ c, d }) => {
    const principal = c.codigo[0] as Dim
    const segunda = c.codigo[1] as Dim
    const categoria: Categoria = principal === p.ordem[0] || (top.includes(principal) && top.includes(segunda)) ? 'explorar' : 'complementar'
    return { id: c.id, categoria, distancia: Math.round(d * 10) / 10, ...explicar(p, r, c) }
  })
  selecao.sort((a, b) => (a.categoria === b.categoria ? a.distancia - b.distancia : a.categoria === 'explorar' ? -1 : 1))
  return { selecao, todas: todas.map((x) => x.c.id) }
}

/* ---------------- resultado completo (o que fica guardado na tentativa) ---------------- */
export type Resultado = {
  versao: string
  regras: string
  geradoEm: number
  perfil: Perfil
  recomendacoes: Recomendacao[]
}

export function gerarResultado(r: Respostas, agora: number): Resultado | null {
  const perfil = calcularPerfil(r)
  if (!perfil) return null
  return { versao: VERSAO_INSTRUMENTO, regras: VERSAO_REGRAS, geradoEm: agora, perfil, recomendacoes: recomendar(perfil, r).selecao }
}

/* ---------------- orientações de exploração ---------------- */
export function perguntasReflexao(p: Perfil): string[] {
  const [a, b] = p.destaques
  const q = [
    `Em que momentos, na escola ou fora dela, você sentiu vontade de ${DIM[a].atividades.split(',')[0]}?`,
    b ? `Que profissão você imagina que junta ${DIM[a].curto} e ${DIM[b].curto}? Ela está entre as sugestões?` : 'Que atividades você gostaria de experimentar antes de escolher uma área?',
    'Que aspecto do trabalho é inegociável para você: o que faz, com quem, onde ou como?',
    'Alguma profissão sugerida te surpreendeu? O que você precisaria saber para decidir se vale investigá-la?',
  ]
  return q
}

/** ações sugeridas para o plano de exploração, sempre ligadas a uma profissão concreta */
export function acoesSugeridas(c: Carreira): { texto: string; tipo: string }[] {
  const f = c.formacoes[0]
  const rel = c.relacionadas[0]
  const relNome = CARREIRAS.find((x) => x.id === rel)?.nome
  return [
    { tipo: 'curso', texto: `Pesquisar a grade curricular de ${f.tipo === 'Curso técnico' ? 'um curso técnico' : 'um curso'} de ${f.nome.split(' ou ')[0].split(' (')[0]}` },
    { tipo: 'conversa', texto: `Conversar com alguém que trabalha com ${c.nome}` },
    { tipo: 'conteudo', texto: `Assistir a uma entrevista ou palestra sobre o dia a dia de ${c.nome}` },
    { tipo: 'requisito', texto: `Investigar os requisitos de ingresso: ${c.ingresso.obrigatorio[0].toLowerCase()}` },
    ...(relNome ? [{ tipo: 'comparar', texto: `Comparar ${c.nome} com ${relNome}` }] : []),
    { tipo: 'reflexao', texto: `Listar quais atividades de ${c.nome} eu gostaria de experimentar` },
  ]
}
