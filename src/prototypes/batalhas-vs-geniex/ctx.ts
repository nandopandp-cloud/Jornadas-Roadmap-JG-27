import type { DiscId, Questao, Selecao } from './data'
import type { BatalhaSolo, BatalhaVS } from './logica'

export type Tela = 'inicio' | 'solo-intro' | 'solo-topicos' | 'solo-quiz' | 'solo-resultado' | 'solo-gabarito' | 'vs-intro' | 'vs-oponente' | 'vs-topicos' | 'vs-confirmar' | 'vs-quiz' | 'vs-resultado' | 'vs-lista'
export type Toast = { tipo: 'ok' | 'alerta' | 'info'; titulo: string; texto: string }

export type Ctx = {
  ir: (t: Tela) => void
  avisar: (t: Toast) => void
  modalAberto: boolean
  celular: boolean
  quizKey: number
  // Solo
  historico: BatalhaSolo[]
  soloSel: Selecao[]
  soloQs: Questao[]
  soloAtual?: BatalhaSolo
  iniciarSolo: (sel: Selecao[]) => void
  fimSolo: (rs: (number | null)[]) => void
  abrirSolo: (id: string, t: 'solo-resultado' | 'solo-gabarito') => void
  pedirSair: (modo: 'solo' | 'vs') => void
  // VS
  vs: BatalhaVS[]
  vsAtual?: BatalhaVS
  vsOp: string | null
  vsSel: Selecao[]
  vsFoco: DiscId | null
  escolherOponente: (id: string) => void
  continuarTopicos: (sel: Selecao[]) => void
  editarTopicos: (foco?: DiscId) => void
  enviarDesafio: () => void
  jogarRodada: () => void
  fimVS: (rs: (number | null)[]) => void
  abrirVS: (id: string) => void
  revanche: () => void
  novaVS: () => void
  abrirReportar: () => void
}
