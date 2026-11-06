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
export const ANOS_ESCOPO = ['6º ano', '7º ano', '8º ano', '9º ano', '1º ano', '2º ano', '3º ano']
const FUND = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'k'] // escolas com 6º a 8º ano
const NONO = ['a', 'b', 'c', 'k']
const MEDIO = ['h', 'i', 'j', 'l']
const OFERTA: Record<string, string[]> = {
  '6º ano': FUND,
  '7º ano': FUND,
  '8º ano': FUND,
  '9º ano': NONO,
  '1º ano': MEDIO,
  '2º ano': MEDIO,
  '3º ano': MEDIO,
}

export type Turma = { id: string; ano: string; nome: string; escola: string }
export const TURMAS_REDE: Turma[] = ANOS_ESCOPO.flatMap((ano) => {
  const n = parseInt(ano)
  const serie = ANOS_ESCOPO.indexOf(ano) >= 4 ? n * 1000 : n * 100 // ensino médio: 1001, 2001…
  return OFERTA[ano].map((escola, i) => ({ id: `${ano}-${escola}`, ano, escola, nome: String(serie + i + 1) }))
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
export const PERIODO_INICIO = '2027-03-01'
export const PERIODO_FIM = '2027-05-31'
export const MESES_PLANO = ['2027-03', '2027-04', '2027-05']
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
}
export type Escopo = { escolas: string[]; anos: string[]; turmasExcluidas: string[]; autoVinculo: boolean }

export const turmasDoEscopo = (e: Escopo) => TURMAS_REDE.filter((t) => e.escolas.includes(t.escola) && e.anos.includes(t.ano) && !e.turmasExcluidas.includes(t.id))
export const turmasDaProg = (p: Pick<Prog, 'anos' | 'escolas'>, e: Escopo) => turmasDoEscopo(e).filter((t) => p.anos.includes(t.ano) && p.escolas.includes(t.escola))

/** “8 turmas (6º ano)”, “16 turmas (6º e 7º anos)” */
export function textoAplicacao(p: Pick<Prog, 'anos' | 'escolas'>, e: Escopo) {
  const n = turmasDaProg(p, e).length
  const anos = ANOS_ESCOPO.filter((a) => p.anos.includes(a)).map((a) => a.replace(' ano', ''))
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
