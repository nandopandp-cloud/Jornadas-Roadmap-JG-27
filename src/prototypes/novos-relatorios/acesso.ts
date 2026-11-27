// Novos Relatórios · quem abre o quê, qual relatório abre por padrão e o catálogo de Meus painéis.
import { N_A, RELS, TIPOS_A, type Bloco, type Kpi, type Perfil, type Rel, type Tabela } from './data'

/** Visões "todos" que só fazem sentido para alguns perfis (o resto segue a regra do grupo). */
const SO: Record<string, Perfil[]> = {
  'escola-todas': ['gestora'],
  'turma-todas-rede': ['gestora'],
  'prof-todos-rede': ['gestora'],
  'est-todos-rede': ['gestora'],
  'turma-todas': ['gestora', 'coord'],
  'prof-todos': ['gestora', 'coord'],
  'est-todos-escola': ['gestora', 'coord'],
  'turma-minhas': ['prof'],
  'est-todos-minhas': ['prof'],
  'est-todos': ['gestora', 'coord', 'prof'],
}

/** O que cada perfil pode abrir (institucionais por perfil; atividades para todos). */
export const podeAbrir = (pf: Perfil, rel: string) => {
  const r = RELS[rel]
  if (!r) return false
  if (SO[rel]) return SO[rel].includes(pf)
  if (r.grupo === 'ativ') {
    const i = TIPOS_A.findIndex((t) => t[2] === rel)
    return i < 0 || N_A[pf][i] !== null
  }
  if (pf === 'gestora') return true
  if (pf === 'coord') return rel !== 'rede' && rel !== 'alf'
  return rel === 'turma' || rel === 'est'
}

/**
 * Regra do usuário (27/11): ao escolher o tipo, o relatório abre com TODOS do acesso
 * (todas as escolas, turmas, professores ou estudantes). O individual vem do filtro.
 */
const PADRAO: Record<string, Partial<Record<Perfil, string>>> = {
  Rede: { gestora: 'rede' },
  Escola: { gestora: 'escola-todas', coord: 'escola' },
  Turma: { gestora: 'turma-todas-rede', coord: 'turma-todas', prof: 'turma-minhas' },
  Professores: { gestora: 'prof-todos-rede', coord: 'prof-todos' },
  Estudante: { gestora: 'est-todos-rede', coord: 'est-todos-escola', prof: 'est-todos-minhas' },
  Alfabetização: { gestora: 'alf', coord: 'alf' },
}
export const relPadrao = (tipo: string, pf: Perfil) => PADRAO[tipo]?.[pf] ?? PADRAO[tipo]?.gestora ?? ''

/** Escopo de uma visão: 'rede' (todas as escolas), 'escola' (uma escola) ou 'minhas' (turmas do professor). */
const ESCOPO: Record<string, 'rede' | 'escola' | 'minhas' | '701'> = {
  'escola-todas': 'rede', 'turma-todas-rede': 'rede', 'prof-todos-rede': 'rede', 'est-todos-rede': 'rede', rede: 'rede',
  'turma-minhas': 'minhas', 'est-todos-minhas': 'minhas',
  'est-todos': '701', est: '701', turma: '701',
}
export const escopoDe = (id: string) => ESCOPO[id] ?? 'escola'
/** Para onde vai cada tipo quando a pessoa troca a escola ou a turma no filtro. */
export const relDoEscopo = (tipo: string, esc: 'rede' | 'escola' | 'minhas' | '701', pf: Perfil): string | undefined => {
  const m: Record<string, Record<string, string>> = {
    Escola: { rede: 'escola-todas', escola: 'escola' },
    Turma: { rede: 'turma-todas-rede', escola: 'turma-todas', minhas: 'turma-minhas', '701': 'turma' },
    Professores: { rede: 'prof-todos-rede', escola: 'prof-todos' },
    Estudante: { rede: 'est-todos-rede', escola: pf === 'prof' ? 'est-todos-minhas' : 'est-todos-escola', minhas: 'est-todos-minhas', '701': 'est-todos' },
  }
  return m[tipo]?.[esc]
}

/* ------------------------------------------------------------------ catálogo de Meus painéis */
// Pedido do usuário (27/11): o catálogo considera TODOS os indicadores dos relatórios (institucionais e de
// atividades), sem inventar nada: cada item é um indicador, gráfico ou tabela que existe em algum relatório.
export type Formato = 'Indicador' | 'Gráfico' | 'Tabela'
export type ItemCat = { nome: string; formato: Formato; tema: string; grupo: 'Institucionais' | 'Atividades'; ic: string; em: string[]; rels: string[]; amostra: { k: 'kpi'; v: Kpi } | { k: 'bloco'; v: Bloco } | { k: 'tab'; v: Tabela } }
const NOME_CAT: Record<string, string> = {
  'Tópicos da estudante': 'Tópicos do estudante',
  'Onde apoiar a estudante': 'Onde apoiar o estudante',
  'Atividades criadas na rede por tipo': 'Atividades criadas por tipo',
  'Distribuição por rubrica · turma': 'Distribuição de rubricas por turma',
  'Estudante com aprendizado adequado': 'Estudantes com aprendizado adequado',
}
const FORA = new Set(['Como ler os quadrantes', 'Resumo da prova', 'Detalhes do projeto'])
const IC_BLOCO: Record<string, string> = { L: 'trending-up', V: 'chart-column', H: 'chart-column', quad: 'sparkles', prof: 'chart-column', pilhas: 'chart-column', status: 'chart-column', lista: 'list-checks', hab: 'list-checks' }
const TEMA: Record<string, string> = { 'Visão geral': 'Panorama', Engajamento: 'Engajamento', Aprendizagem: 'Aprendizagem', 'Projetos enviados': 'Panorama' }
const NOME_TIPO: Record<string, string> = { Professores: 'Professores' }

export const CATALOGO_TODOS: ItemCat[] = (() => {
  const mapa = new Map<string, ItemCat>()
  const add = (nome0: string, formato: Formato, r: Rel, aba: string, ic: string, amostra: ItemCat['amostra']) => {
    if (FORA.has(nome0)) return
    const nome = NOME_CAT[nome0] ?? nome0
    const k = nome + '|' + formato
    const tipo = NOME_TIPO[r.tipo] ?? r.tipo
    const it = mapa.get(k)
    if (it) {
      if (!it.em.includes(tipo)) it.em.push(tipo)
      if (!it.rels.includes(r.id)) it.rels.push(r.id)
      if (r.grupo === 'inst' && it.grupo === 'Atividades') it.grupo = 'Institucionais'
      return
    }
    mapa.set(k, { nome, formato, tema: TEMA[aba] ?? aba, grupo: r.grupo === 'inst' ? 'Institucionais' : 'Atividades', ic, em: [tipo], rels: [r.id], amostra })
  }
  for (const r of Object.values(RELS))
    for (const [aba, its] of Object.entries(r.T))
      for (const it of its) {
        if (it[0] === 'kpis') it[1].forEach((v) => add(v[0], 'Indicador', r, aba, 'target', { k: 'kpi', v }))
        if (it[0] === 'row') it[1].forEach((b) => b.titulo && add(b.titulo, 'Gráfico', r, aba, IC_BLOCO[b.t] ?? 'chart-column', { k: 'bloco', v: { ...b, w: undefined } }))
        if (it[0] === 'tab') add(it[1].titulo, 'Tabela', r, aba, 'list-checks', { k: 'tab', v: it[1] })
      }
  return [...mapa.values()]
})()
/** Itens que o perfil pode usar: existem em pelo menos um relatório que ele abre. */
export const catalogoDe = (pf: Perfil) => CATALOGO_TODOS.filter((i) => i.rels.some((r) => podeAbrir(pf, r)))
export const itemCat = (nome: string) => CATALOGO_TODOS.find((i) => i.nome === nome)

/** Blocos compostos que só existem nos painéis (montados a partir dos indicadores acima). */
export const EXTRAS_PAINEL: ItemCat[] = [
  { nome: 'Prioridades pedagógicas', formato: 'Gráfico', tema: 'Aprendizagem', grupo: 'Institucionais', ic: 'flag', em: ['Rede', 'Escola', 'Turma'], rels: ['escola', 'turma'], amostra: { k: 'bloco', v: { t: 'hab' } } },
  { nome: 'Estudantes ativos por mês', formato: 'Gráfico', tema: 'Engajamento', grupo: 'Institucionais', ic: 'chart-column', em: ['Rede', 'Escola', 'Turma'], rels: ['escola', 'turma'], amostra: { k: 'bloco', v: { t: 'V' } } },
]
export const catalogoPainel = (pf: Perfil) => EXTRAS_PAINEL.filter((i) => i.rels.some((r) => podeAbrir(pf, r))).concat(catalogoDe(pf))
