/* Fluxo “Criar na plataforma”: escopo da rede, turmas, currículo e programações. */
import { ESCOLAS, MESES, MESES_CURTOS, TIPOS, capital, isoData, parseData, type Atividade, type TipoId } from './data'

/* ---------------- escolas da rede (12) ---------------- */
export type EscolaRede = { id: string; nome: string }
export const REDE: EscolaRede[] = [
  ...ESCOLAS.map((e) => ({ id: e.id, nome: e.nome })),
  { id: 'k', nome: 'EMEF Monteiro Lobato' },
  { id: 'l', nome: 'EMEF Cecília Meireles' },
]
export const nomeRede = (id: string) => REDE.find((e) => e.id === id)?.nome ?? id

/* ---------------- anos e turmas ---------------- */
/** anos do Ensino Fundamental, em ordem */
export const ANOS_ESCOPO = ['1º ano', '2º ano', '3º ano', '4º ano', '5º ano', '6º ano', '7º ano', '8º ano', '9º ano']
const INICIAIS = ['c', 'h', 'i', 'j', 'k', 'l'] // escolas com 1º a 5º ano
const FINAIS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'k'] // escolas com 6º a 8º ano
const NONO = ['a', 'b', 'c', 'k']
const OFERTA: Record<string, string[]> = {
  '1º ano': INICIAIS,
  '2º ano': INICIAIS,
  '3º ano': INICIAIS,
  '4º ano': INICIAIS,
  '5º ano': INICIAIS,
  '6º ano': FINAIS,
  '7º ano': FINAIS,
  '8º ano': FINAIS,
  '9º ano': NONO,
}

export type Turma = { id: string; ano: string; nome: string; escola: string }
/**
 * Quantas turmas cada escola tem por ano (redes reais variam muito).
 * A EMEF Monteiro Lobato é a escola “grande” do exemplo: 6 turmas por ano = 54 turmas.
 */
const TURMAS_POR_ANO: Record<string, number> = { a: 3, b: 2, c: 4, d: 2, e: 3, f: 2, g: 1, h: 2, i: 2, j: 1, k: 6, l: 3 }
const LETRAS = 'ABCDEFGH'
export const TURMAS_REDE: Turma[] = ANOS_ESCOPO.flatMap((ano) => {
  const n = parseInt(ano)
  return OFERTA[ano].flatMap((escola) =>
    Array.from({ length: TURMAS_POR_ANO[escola] ?? 1 }, (_, j) => ({ id: `${ano}-${escola}-${j}`, ano, escola, nome: `${n * 100 + j + 1} - Turma ${LETRAS[j]}` })), // ex.: 801 - Turma A
  )
})

/* ---------------- currículo ---------------- */
export const CURRICULO: Record<string, Record<string, string[]>> = {
  Ciências: {
    'Matéria e energia': ['Água', 'Misturas e separação', 'Transformações químicas'],
    'Vida e evolução': ['Células', 'Impacto da alimentação na saúde'],
    'Terra e Universo': ['Sistema Solar', 'Fases da Lua'],
  },
  Português: {
    'Leitura e produção de textos': ['Estratégias de leitura', 'Produção de texto narrativo'],
    'Análise linguística': ['Classes de palavras', 'Pontuação'],
    Oralidade: ['Debate regrado', 'Apresentação oral'],
  },
  Matemática: {
    'Números e operações': ['Operações com frações', 'Resolução de problemas'],
    Álgebra: ['Equações do 1º grau', 'Expressões numéricas'],
    Geometria: ['Ângulos', 'Área e perímetro'],
  },
  História: {
    'Brasil Colônia': ['Processo de colonização', 'Economia açucareira'],
    Antiguidade: ['Egito Antigo', 'Grécia Antiga'],
  },
  Geografia: {
    'Espaço e território': ['Cartografia', 'Urbanização'],
    'Natureza e paisagens': ['Biomas brasileiros', 'Clima e vegetação'],
  },
}
export const HABILIDADES: Record<string, string[]> = {
  Ciências: ['EF06CI01 — Classificar materiais homogêneos e heterogêneos', 'EF06CI02 — Identificar evidências de transformações químicas', 'EF07CI08 — Avaliar como os impactos afetam a biodiversidade'],
  Português: ['EF67LP03 — Comparar informações sobre um mesmo fato', 'EF69LP44 — Inferir a presença de valores sociais em textos', 'EF67LP28 — Ler, de forma autônoma, textos de diferentes gêneros'],
  Matemática: ['EF06MA07 — Compreender, comparar e ordenar frações', 'EF07MA18 — Resolver problemas com equações do 1º grau', 'EF08MA06 — Resolver problemas com expressões algébricas'],
  História: ['EF07HI09 — Analisar os diferentes impactos da conquista europeia', 'EF06HI07 — Identificar aspectos dos processos de formação das sociedades'],
  Geografia: ['EF06GE08 — Medir distâncias na superfície pelas escalas gráficas', 'EF07GE11 — Caracterizar dinâmicas dos componentes físico-naturais'],
}

/* ---------------- período do cronograma (Março a Maio de 2027) ---------------- */
/** o cronograma cobre sempre os 12 meses do ano (janeiro a dezembro de 2027) */
export const PERIODO_INICIO = '2027-01-01'
export const PERIODO_FIM = '2027-12-31'
export const ANO_LETIVO = Array.from({ length: 12 }, (_, i) => `2027-${String(i + 1).padStart(2, '0')}`)
/** meses que já têm programações lançadas (em ordem) */
export const mesesDe = (progs: { inicio: string }[]) => [...new Set(progs.map((p) => p.inicio.slice(0, 7)))].sort()
export const nomeMesPlano = (k: string) => {
  const d = parseData(`${k}-01`)
  return `${capital(MESES[d.getMonth()])} (Mês ${d.getMonth() + 1})`
}
export const intervaloMes = (k: string) => {
  const d = parseData(`${k}-01`)
  const fim = new Date(d.getFullYear(), d.getMonth() + 1, 0)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `01/${mm} a ${fim.getDate()}/${mm}/${d.getFullYear()}`
}

/* ---------------- programações ---------------- */
export type Prog = {
  id: string
  tipo: TipoId
  componente: string
  unidade: string
  objeto: string
  habilidade?: string
  inicio: string
  fim: string
  anos: string[]
  /** escolas onde a programação vale (subconjunto do escopo) */
  escolas: string[]
  /** turmas desmarcadas manualmente nesta programação */
  turmasExcluidas?: string[]
}
export type Escopo = { escolas: string[]; anos: string[]; turmasExcluidas: string[]; autoVinculo: boolean }

export const turmasDoEscopo = (e: Escopo) => TURMAS_REDE.filter((t) => e.escolas.includes(t.escola) && e.anos.includes(t.ano) && !e.turmasExcluidas.includes(t.id))
/** turmas possíveis para os anos/escolas da programação (sem considerar as desmarcadas) */
export const turmasCandidatas = (p: Pick<Prog, 'anos' | 'escolas'>, e: Escopo) => turmasDoEscopo(e).filter((t) => p.anos.includes(t.ano) && p.escolas.includes(t.escola))
/** turmas que de fato recebem a programação */
export const turmasDaProg = (p: Pick<Prog, 'anos' | 'escolas' | 'turmasExcluidas'>, e: Escopo) => turmasCandidatas(p, e).filter((t) => !p.turmasExcluidas?.includes(t.id))

/** “8 turmas (6º ano)”, “16 turmas (6º e 7º anos)” */
export function textoAplicacao(p: Pick<Prog, 'anos' | 'escolas' | 'turmasExcluidas'>, e: Escopo) {
  const ts = turmasDaProg(p, e)
  const n = ts.length
  const anos = ANOS_ESCOPO.filter((a) => ts.some((t) => t.ano === a)).map((a) => a.replace(' ano', ''))
  const lista = anos.length > 1 ? `${anos.slice(0, -1).join(', ')} e ${anos.at(-1)} anos` : `${anos[0] ?? '—'} ano`
  return `${n} ${n === 1 ? 'turma' : 'turmas'} (${lista})`
}

export const curta = (iso: string) => {
  const [, m, d] = iso.split('-')
  return `${d}/${m}`
}
export const brPlano = (iso: string) => iso.split('-').reverse().join('/')

/* ---------------- pendências ---------------- */
export const ESCOLA_SEM_EDUCADOR = 'k'
export type Pendencia = { prog: Prog; motivo: string; turmas: Turma[] }

/** Matemática do 8º ano da EMEF Monteiro Lobato está sem educador cadastrado (dado de exemplo da rede) */
export function pendenciaDe(p: Prog, e: Escopo, resolvidos: string[]): Pendencia | null {
  if (resolvidos.includes(p.id)) return null
  const turmas = turmasDaProg(p, e)
  if (!e.autoVinculo) return turmas.length ? { prog: p, motivo: 'O vínculo automático de educadores está desligado.', turmas } : null
  const sem = turmas.filter((t) => t.escola === ESCOLA_SEM_EDUCADOR && t.ano === '8º ano' && p.componente === 'Matemática')
  return sem.length ? { prog: p, motivo: 'Há turmas sem educador vinculado ao componente curricular.', turmas: sem } : null
}

export const EDUCADORES_SUGERIDOS = ['Lucius Seneca', 'Marcos Aurélio', 'Helena Prado']

/* ---------------- modelos ---------------- */
export type Modelo = { id: string; nome: string; prog: Omit<Prog, 'id' | 'inicio' | 'fim' | 'escolas'> }
export const MODELOS_PADRAO: Modelo[] = [
  { id: 'm1', nome: 'Avaliação bimestral de Ciências', prog: { tipo: 'prova', componente: 'Ciências', unidade: 'Vida e evolução', objeto: 'Células', anos: ['6º ano'] } },
  { id: 'm2', nome: 'Desafio de frações', prog: { tipo: 'desafio', componente: 'Matemática', unidade: 'Números e operações', objeto: 'Operações com frações', anos: ['7º ano', '8º ano'] } },
  { id: 'm3', nome: 'Aula invertida de História', prog: { tipo: 'aula', componente: 'História', unidade: 'Brasil Colônia', objeto: 'Economia açucareira', anos: ['7º ano'] } },
]

/* ---------------- estado inicial ---------------- */
let seq = 10
export const novoIdProg = () => `p${++seq}`

export const escopoInicial = (escola?: string): Escopo => ({
  escolas: escola ? [escola] : REDE.map((e) => e.id),
  anos: ['6º ano', '7º ano', '8º ano', '9º ano'],
  turmasExcluidas: [],
  autoVinculo: true,
})

/** programações de exemplo já no cronograma em construção (como na referência) */
export const progsIniciais = (escolas: string[]): Prog[] => [
  { id: 'p2', tipo: 'tarefa', componente: 'Português', unidade: 'Leitura e produção de textos', objeto: 'Estratégias de leitura', inicio: '2027-03-10', fim: '2027-03-24', anos: ['6º ano', '7º ano'], escolas },
  { id: 'p3', tipo: 'campeonato', componente: 'Matemática', unidade: 'Números e operações', objeto: 'Operações com frações', inicio: '2027-03-13', fim: '2027-03-27', anos: ['8º ano'], escolas },
]
/** formulário já preenchido com a Prova Genial da referência */
export const formInicial = (escolas: string[]): Prog => ({
  id: '',
  tipo: 'prova',
  componente: 'Ciências',
  unidade: 'Matéria e energia',
  objeto: 'Água',
  inicio: '2027-03-06',
  fim: '2027-03-20',
  anos: ['6º ano'],
  escolas,
})

/* ---------------- publicação: programações → atividades do calendário ---------------- */
export function progsParaAtividades(progs: Prog[], e: Escopo, escola: string): Atividade[] {
  return progs.flatMap((p) => {
    const ts = turmasDaProg(p, e).filter((t) => t.escola === escola)
    if (!ts.length) return []
    const porAno = new Map<string, string[]>()
    ts.forEach((t) => porAno.set(t.ano, [...(porAno.get(t.ano) ?? []), t.nome]))
    return [...porAno.entries()].map(([ano, turmas], i) => ({
      id: `${p.id}-${escola}-${i}`,
      inicio: p.inicio,
      fim: p.fim,
      ano,
      turmas,
      educador: 'Educador(a) vinculado(a)',
      componente: p.componente,
      unidade: p.unidade,
      objeto: p.objeto,
      tipo: p.tipo,
    }))
  })
}

export const periodoProgs = (progs: Prog[]) => {
  if (!progs.length) return null
  const i = progs.map((p) => p.inicio).sort()[0]
  const f = progs.map((p) => p.fim).sort().at(-1)!
  return { inicio: i, fim: f }
}
export const periodoListaPlano = () => `${capital(MESES_CURTOS[2])}/2027 – ${capital(MESES_CURTOS[4])}/2027`

/** desloca uma data em N meses (mesmo dia, limitado ao fim do mês) */
export function somarMeses(iso: string, n: number) {
  const d = parseData(iso)
  const alvo = new Date(d.getFullYear(), d.getMonth() + n, 1)
  const ult = new Date(alvo.getFullYear(), alvo.getMonth() + 1, 0).getDate()
  alvo.setDate(Math.min(d.getDate(), ult))
  return isoData(alvo)
}

export const nomeTipo = (t: TipoId) => TIPOS[t].nome

/* ---------------- educadores e exportação no formato da planilha modelo ---------------- */
export const REDE_NOME = 'Rede Municipal de Ensino'

const PROFESSORES: Record<string, string[]> = {
  Ciências: ['Álvaro Dumbledore', 'Marina Costa', 'Rafael Nunes', 'Beatriz Lima'],
  Português: ['Julia Verus', 'Rosana Alves', 'Carla Mendes', 'Paulo Freitas'],
  Matemática: ['Lucius Seneca', 'Helena Prado', 'Diego Ramos', 'Sônia Matos'],
  História: ['Claudia Octavia', 'Renato Silva', 'Lúcia Barros'],
  Geografia: ['Glaucio Santos', 'Fernanda Rocha', 'Igor Pacheco'],
}
const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)

/** educador(a) vinculado à turma no componente (dados de exemplo, sempre o mesmo para a mesma turma) */
export function educadorDe(t: Turma, p: Prog, e: Escopo, resolvidos: string[]) {
  if (!e.autoVinculo && !resolvidos.includes(p.id)) return 'A vincular'
  const semVinculo = t.escola === ESCOLA_SEM_EDUCADOR && t.ano === '8º ano' && p.componente === 'Matemática'
  if (semVinculo) return resolvidos.includes(p.id) ? EDUCADORES_SUGERIDOS[0] : 'Sem educador vinculado'
  // anos iniciais: professor(a) polivalente da turma
  const lista = parseInt(t.ano) <= 5 ? ['Ana Paula Reis', 'Márcia Teixeira', 'Joana Duarte', 'Cristina Melo', 'Patrícia Souza'] : PROFESSORES[p.componente] ?? ['Educador(a) da turma']
  return lista[hash(`${t.escola}-${t.ano}-${p.componente}`) % lista.length]
}

/** colunas e linhas do resumo exportado — uma linha por turma, como a planilha modelo */
export function linhasExportacao(progs: Prog[], e: Escopo, resolvidos: string[], status: (p: Prog) => string) {
  const cab = [
    'Rede',
    'Escola',
    'Mês',
    'Início',
    'Término',
    'Ano Escolar',
    'Turma',
    'Educador(a)',
    'Ano Escolar (conteúdo)',
    'Componente Curricular',
    'Unidade temática',
    'Objeto de Conhecimento',
    'Habilidades',
    'Atividade na Plataforma',
    'Status',
  ]
  const linhas = [...progs]
    .sort((a, b) => a.inicio.localeCompare(b.inicio))
    .flatMap((p) =>
      turmasDaProg(p, e)
        .sort((a, b) => nomeRede(a.escola).localeCompare(nomeRede(b.escola)) || ANOS_ESCOPO.indexOf(a.ano) - ANOS_ESCOPO.indexOf(b.ano) || a.nome.localeCompare(b.nome))
        .map((t) => [
          REDE_NOME,
          nomeRede(t.escola),
          capital(MESES[parseData(p.inicio).getMonth()]),
          brPlano(p.inicio),
          brPlano(p.fim),
          t.ano,
          t.nome,
          educadorDe(t, p, e, resolvidos),
          t.ano,
          p.componente,
          p.unidade,
          p.objeto,
          p.habilidade ?? '',
          TIPOS[p.tipo].nome,
          status(p),
        ]),
    )
  return [cab, ...linhas]
}

/** monta o CSV (separado por ponto e vírgula, com BOM para o Excel abrir com acentos) */
export function paraCSV(tabela: string[][]) {
  const cel = (v: string) => (/[;"\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)
  return '﻿' + tabela.map((l) => l.map(cel).join(';')).join('\r\n')
}
