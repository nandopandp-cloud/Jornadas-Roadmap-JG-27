// Término da Gamificação dos Educadores 2026 · dados de exemplo (idênticos ao Figma jJugywGtJ9ZberC6jC6ZC6).
// Todos os nomes, escolas e pontos são fictícios.

export type Estado = 'fora' | 'podio' | 'sem'

export type Educador = {
  pos: 1 | 2 | 3
  nome: string
  ini: string
  escola: string
  pontos: number
  atv: number
  eng: number
  voce?: boolean
}

export type Eu = {
  nome: string
  primeiro: string
  ini: string
  email: string
  pos: number | null
  pontos: number
  atv: number
  eng: number
  /** saldo do Clube JG — é o mesmo saldo de pontos da Gamificação */
  saldo: number
}

export type Dados = {
  estado: Estado
  edicao: string
  periodo: string
  publicado: string
  participantes: number
  podio: [Educador, Educador, Educador]
  eu: Eu
}

const BASE: Omit<Dados, 'estado'> = {
  edicao: 'Gamificação dos Educadores 2026',
  periodo: '02/03 a 30/11/2026',
  publicado: '30 de novembro de 2026',
  participantes: 1248,
  podio: [
    { pos: 1, nome: 'Mariana Costa', ini: 'MC', escola: 'EE Prof. Antônio Alves · Campinas', pontos: 15240, atv: 600, eng: 99 },
    { pos: 2, nome: 'Carlos Eduardo Lima', ini: 'CL', escola: 'EE Jardim das Flores · São Paulo', pontos: 14310, atv: 600, eng: 98 },
    { pos: 3, nome: 'Juliana Ferreira', ini: 'JF', escola: 'EE Vila Nova · Sorocaba', pontos: 13075, atv: 588, eng: 97 },
  ],
  eu: { nome: 'Rodrigo Ribeiro', primeiro: 'Rodrigo', ini: 'RR', email: 'rodrigo.ribeiro@jovensgenios.com', pos: 5, pontos: 11820, atv: 600, eng: 96, saldo: 11820 },
}

export function dados(estado: Estado): Dados {
  const d: Dados = JSON.parse(JSON.stringify({ ...BASE, estado }))
  if (estado === 'podio') {
    Object.assign(d.podio[0], { nome: 'Rodrigo Ribeiro', ini: 'RR', voce: true })
    Object.assign(d.eu, { pos: 1, pontos: 15240, atv: 600, eng: 99, saldo: 15240 })
  }
  if (estado === 'sem') Object.assign(d.eu, { pos: null, pontos: 0, atv: 0, eng: 0, saldo: 0 })
  return d
}

export const fmt = (n: number) => n.toLocaleString('pt-BR')

/** pontos que faltaram para o pódio (3º colocado − meus pontos) */
export const faltouPodio = (d: Dados) => d.podio[2].pontos - d.eu.pontos
/** vantagem do 1º lugar sobre o 2º */
export const vantagem = (d: Dados) => d.eu.pontos - d.podio[1].pontos

export const MEDALHA = { 1: '#E8A800', 2: '#97A3B6', 3: '#C27A3E' } as const
export const MEDALHA_FUNDO = { 1: '#FFF4CC', 2: '#EEF1F5', 3: '#F8E9DC' } as const

/* ---------- Resultados das atividades (tela atual da plataforma, simulada só no navegável) ---------- */
export type Atividade = {
  id: number
  nome: string
  tipo: string
  turma: string
  inicio: string
  fim: string
  inicioISO: string
  fimISO: string
  eng: number
  pontos: number
  status: string
}

const TEMAS = ['Frações equivalentes', 'Equações do 1º grau', 'Leitura e interpretação', 'Ciclo da água', 'Revolução Industrial', 'Porcentagem no dia a dia', 'Ortografia', 'Sistema Solar', 'Geometria plana', 'Tempos verbais', 'Biomas brasileiros', 'Razão e proporção', 'Gêneros textuais', 'Cadeia alimentar', 'Brasil Colônia', 'Potenciação', 'Pontuação', 'Estados físicos da matéria', 'Cartografia', 'Ângulos']
const ESCOLA = 'EE JARDIM DAS ÁRVORES'

const dia = (base: Date, n: number) => new Date(base.getTime() + n * 86400000)
const br = (d: Date) => d.toLocaleDateString('pt-BR', { timeZone: 'UTC' })
const iso = (d: Date) => d.toISOString().slice(0, 10)

/** 600 atividades do educador logado; a soma dos pontos fecha com a pontuação da gamificação. */
export function atividades(d: Dados): Atividade[] {
  const n = d.eu.atv
  if (!n) return []
  const extra = (d.eu.pontos - 20 * n) / 10 // + → atividades com 30 pontos; − → atividades com 10 pontos
  const marcadas = Math.abs(extra)
  const ini = Date.UTC(2026, 2, 2)
  return Array.from({ length: n }, (_, i) => {
    const marca = Math.floor(((i + 1) * marcadas) / n) > Math.floor((i * marcadas) / n)
    const s = Math.floor(dia(new Date(ini), Math.floor((i * 271) / n)).getTime() / 86400000)
    const comeco = new Date(s * 86400000)
    const fim = dia(comeco, 1 + (i % 3))
    const ano = 6 + (i % 4)
    return {
      id: i + 1,
      nome: TEMAS[(i * 7) % TEMAS.length],
      tipo: i % 5 === 3 ? 'Tarefa' : 'Desafio',
      turma: `${ESCOLA} - ${ano}º ANO`,
      inicio: br(comeco),
      fim: br(fim),
      inicioISO: iso(comeco),
      fimISO: iso(fim),
      eng: [100, 96, 91, 100, 98, 90, 100, 94][(i * 3) % 8],
      pontos: marca ? (extra > 0 ? 30 : 10) : 20,
      status: 'Processado',
    }
  })
}

export const ESTADOS:{ id: Estado; rotulo: string; desc: string }[] = [
  { id: 'fora', rotulo: 'Fora do pódio', desc: 'Rodrigo terminou em 5º lugar' },
  { id: 'podio', rotulo: 'No pódio', desc: 'Rodrigo conquistou o 1º lugar' },
  { id: 'sem', rotulo: 'Não participou', desc: 'Sem inscrição nesta edição' },
]
