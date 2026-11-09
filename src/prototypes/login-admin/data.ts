/* Dados fictícios do Login simplificado · Admins (iguais aos das telas do Figma) */
export type MetodoId = 'qr' | 'icones' | 'email'
/** estado de cada método de acesso do estudante */
export type EstadoMetodo = 'habilitado' | 'bloqueado' | 'revogado' | 'nao'
export type Credencial = 'ativa' | 'nao' | 'revogada' | 'parcial'
export type Permissao = 'permitida' | 'bloqueada' | 'parcial'
export type Evento = { tipo: 'emitida' | 'reemitida' | 'revogada' | 'bloqueado' | 'permitido' | 'impressa' | 'visualizada'; titulo: string; quando: string; quem: string; extra?: string }
export type Estudante = {
  id: string
  nome: string
  email: string
  escola: string
  turma: string
  idNum: string
  matricula: string
  metodos: Record<MetodoId, EstadoMetodo>
  versao: number
  ultimo: string
  ultimoMetodo: string
  emitida?: string
  emitidaPor?: string
  reemitida?: string
  reemitidaPor?: string
  bloqueio?: string
  eventos: Evento[]
}

const BASE_ATIVA: Evento[] = [
  { tipo: 'reemitida', titulo: 'Credencial reemitida', quando: '10/03/2027, 09:30', quem: 'Maria Souza (Gestora escolar)', extra: 'Motivo: cartão danificado · versão 1 invalidada' },
  { tipo: 'permitido', titulo: 'Permissão de acesso alterada', quando: '05/03/2027, 14:22', quem: 'João Lima (Administrador)', extra: 'Bloqueado → Permitido' },
  { tipo: 'emitida', titulo: 'Credencial emitida', quando: '01/03/2027, 11:10', quem: 'Maria Souza (Gestora escolar)', extra: 'Versão 1 · cadastro existente, sem nova conta' },
]
const TODOS_HAB = { qr: 'habilitado', icones: 'habilitado', email: 'habilitado' } as const
const ativa = (o: Partial<Estudante> & Pick<Estudante, 'id' | 'nome' | 'email' | 'escola' | 'turma' | 'idNum' | 'matricula' | 'ultimo' | 'ultimoMetodo'>): Estudante => ({
  metodos: { ...TODOS_HAB }, versao: 2, emitida: '01/03/2027, 11:10', emitidaPor: 'Maria Souza (Gestora escolar)', reemitida: '10/03/2027, 09:30', reemitidaPor: 'Maria Souza · Motivo: cartão danificado', eventos: [...BASE_ATIVA], ...o,
})

export const ESTUDANTES: Estudante[] = [
  ativa({ id: 'ana', nome: 'Ana Clara da Silva', email: 'ana.silva@jovensgenios.com', escola: 'Escola Exemplo', turma: '1º ano A', idNum: '004812', matricula: '001', ultimo: '15/03/2027, 08:12', ultimoMetodo: 'QR Code · Tablet' }),
  ativa({ id: 'pedro', nome: 'Pedro Henrique Lima', email: 'pedro.lima@jovensgenios.com', escola: 'Colégio Galileu', turma: '2º ano B', idNum: '004820', matricula: '007', ultimo: '14/03/2027, 07:58', ultimoMetodo: 'Código de ícones · Tablet' }),
  { id: 'laura', nome: 'Laura Mendes Santos', email: 'laura.santos@jovensgenios.com', escola: 'Escola Exemplo', turma: '1º ano B', idNum: '004857', matricula: '014', metodos: { qr: 'nao', icones: 'nao', email: 'habilitado' }, versao: 0, ultimo: '12/03/2027, 10:03', ultimoMetodo: 'E-mail e senha · Computador', eventos: [] },
  ativa({ id: 'theo', nome: 'Théo Oliveira Costa', email: 'theo.costa@jovensgenios.com', escola: 'Instituto Auxiliadora', turma: '3º ano A', idNum: '004801', matricula: '009', metodos: { qr: 'bloqueado', icones: 'bloqueado', email: 'bloqueado' }, ultimo: '02/03/2027, 09:40', ultimoMetodo: 'Código de ícones · Tablet', bloqueio: 'Bloqueado em 02/03/2027 por João Lima (Administrador). Motivo: pedido da família.',
    eventos: [{ tipo: 'bloqueado', titulo: 'Acesso bloqueado', quando: '02/03/2027, 09:55', quem: 'João Lima (Administrador)', extra: 'Todos os métodos · Permitido → Bloqueado · sessões abertas encerradas' }, ...BASE_ATIVA] }),
  ativa({ id: 'mariana', nome: 'Mariana Costa Alves', email: 'mariana.alves@jovensgenios.com', escola: 'Colégio Galileu', turma: '2º ano B', idNum: '004833', matricula: '022', metodos: { qr: 'revogado', icones: 'revogado', email: 'habilitado' }, ultimo: '10/03/2027, 13:22', ultimoMetodo: 'E-mail e senha · Computador',
    eventos: [{ tipo: 'revogada', titulo: 'Credencial revogada', quando: '10/03/2027, 13:40', quem: 'João Lima (Administrador)', extra: 'QR Code e código de ícones · motivo: cartão perdido' }, ...BASE_ATIVA] }),
  ativa({ id: 'lucas', nome: 'Lucas Nogueira', email: 'lucas.nogueira@jovensgenios.com', escola: 'Escola Exemplo', turma: '1º ano A', idNum: '004815', matricula: '004', ultimo: 'Nunca acessou', ultimoMetodo: '—' }),
  { id: 'sofia', nome: 'Sofia Martins', email: 'sofia.martins@jovensgenios.com', escola: 'Colégio Galileu', turma: '4º ano B', idNum: '004866', matricula: '031', metodos: { qr: 'nao', icones: 'nao', email: 'habilitado' }, versao: 0, ultimo: '11/03/2027, 08:31', ultimoMetodo: 'E-mail e senha · Computador', eventos: [] },
  ativa({ id: 'gabriel', nome: 'Gabriel Almeida', email: 'gabriel.almeida@jovensgenios.com', escola: 'Instituto Auxiliadora', turma: '3º ano A', idNum: '004809', matricula: '012', ultimo: '09/03/2027, 07:45', ultimoMetodo: 'QR Code · Tablet' }),
]

export const TENTATIVAS = [
  ['15/03/2027, 08:12', 'Entrada no Exploradores', 'QR Code', 'Tablet · Escola Exemplo', 'ok'],
  ['14/03/2027, 10:46', 'Entrada no Exploradores', 'Código de ícones', 'Tablet · Escola Exemplo', 'ok'],
  ['14/03/2027, 10:45', 'Sequência incorreta', 'Código de ícones', 'Tablet · Escola Exemplo', 'erro'],
  ['14/03/2027, 10:44', 'Sequência incorreta', 'Código de ícones', 'Tablet · Escola Exemplo', 'erro'],
  ['11/03/2027, 07:58', 'Carteirinha de versão antiga', 'QR Code', 'Computador · Escola', 'erro'],
  ['09/03/2027, 09:10', 'Entrada no Exploradores', 'E-mail e senha', 'Computador · Casa', 'ok'],
  ['05/03/2027, 08:03', 'Conta bloqueada no momento', 'QR Code', 'Tablet · Escola Exemplo', 'erro'],
] as const

export const MOTIVOS_REEMISSAO = ['Cartão perdido', 'Cartão danificado', 'Esqueceu a sequência', 'Credencial comprometida', 'Outro']
export const MOTIVOS_REVOGACAO = ['Cartão perdido', 'Credencial comprometida', 'Saída da escola', 'Outro']
export const MOTIVOS_BLOQUEIO = ['Pedido da família', 'Pedido da escola', 'Uso indevido', 'Outro']

export const iniciais = (n: string) => n.split(' ').map((x) => x[0]).slice(0, 2).join('')
export const agora = () => {
  const d = new Date()
  return `16/03/2027, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export const METODOS: { id: MetodoId; nome: string; longo: string; desc: string }[] = [
  { id: 'qr', nome: 'QR Code', longo: 'QR Code da carteirinha', desc: 'Lido pela câmera do tablet ou computador.' },
  { id: 'icones', nome: 'Código de ícones', longo: 'Código de ícones', desc: 'Sequência de 6 ícones espaciais impressa na carteirinha.' },
  { id: 'email', nome: 'E-mail e senha', longo: 'E-mail e senha', desc: '' },
]
export const NOME_METODO: Record<MetodoId, string> = { qr: 'QR Code', icones: 'código de ícones', email: 'e-mail e senha' }
/** "QR Code, código de ícones e e-mail e senha" */
export const listaMetodos = (ids: MetodoId[]) => {
  const n = ids.map((i) => NOME_METODO[i])
  const t = n.length <= 1 ? n.join('') : n.slice(0, -1).join(', ') + ' e ' + n[n.length - 1]
  return t.charAt(0).toUpperCase() + t.slice(1)
}
const emitido = (s: EstadoMetodo) => s === 'habilitado' || s === 'bloqueado'
export const credencialDe = (e: Estudante): Credencial => {
  const { qr, icones } = e.metodos
  if (qr === 'nao' && icones === 'nao') return 'nao'
  if (qr === 'revogado' && icones === 'revogado') return 'revogada'
  if (qr === 'revogado' || icones === 'revogado') return 'parcial'
  return emitido(qr) || emitido(icones) ? 'ativa' : 'nao'
}
/** métodos que hoje existem para a conta (não emitidos e revogados ficam de fora) */
export const disponiveis = (e: Estudante) => (Object.keys(e.metodos) as MetodoId[]).filter((m) => emitido(e.metodos[m]))
export const bloqueados = (e: Estudante) => (Object.keys(e.metodos) as MetodoId[]).filter((m) => e.metodos[m] === 'bloqueado')
export const entraCom = (e: Estudante) => (Object.keys(e.metodos) as MetodoId[]).filter((m) => e.metodos[m] === 'habilitado')
export const permissaoDe = (e: Estudante): Permissao => {
  const b = bloqueados(e).length
  return b === 0 ? 'permitida' : b === disponiveis(e).length ? 'bloqueada' : 'parcial'
}
