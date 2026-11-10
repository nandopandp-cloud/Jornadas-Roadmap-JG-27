import type { Selecao } from './data'
import type { Batalha, Linha, meusNumeros } from './logica'

export type Tela = 'lista' | 'visao' | 'batalhas' | 'historico' | 'ranking' | 'regras' | 'oponente' | 'disciplinas' | 'resumo' | 'quiz' | 'resultado' | 'revisao'
export type Toast = { tipo: 'ok' | 'alerta' | 'info'; titulo: string; texto: string }
export type Modal = null | 'sair' | 'tempo' | 'conteudo' | 'encerrada' | 'oponente'

export type Ctx = {
  ir: (t: Tela) => void
  voltar: () => void
  avisar: (t: Toast) => void
  celular: boolean
  modalAberto: boolean
  /** respostas em andamento (para registrar ao sair da batalha) */
  rascunho: { rs: (number | null)[]; tempos: number[] }
  vazia: boolean
  encerrada: boolean
  batalhas: Batalha[]
  numeros: ReturnType<typeof meusNumeros>
  rank: Linha[]
  atual?: Batalha
  quizKey: number
  // nova batalha
  op: string | null
  sel: Selecao[]
  escolherOponente: (id: string | null) => void
  definirSel: (s: Selecao[]) => void
  desafiar: (id: string) => void
  novaBatalha: () => void
  iniciar: () => void
  // batalhas existentes
  responder: (id: string) => void
  abrir: (id: string, t?: 'resultado' | 'revisao') => void
  fimQuiz: (rs: (number | null)[], tempos: number[], esgotou?: boolean) => void
  pedirSair: () => void
  simular: (tipo: 'resposta' | 'prazo') => void
}
