// Dados do Campeonato GenieX (os mesmos das telas do Figma) e gerador de questões do Ensino Médio.
export type DiscId = 'matematica' | 'fisica' | 'quimica'
export type Selecao = { disciplina: DiscId; topico: string }
export type Questao = { id: string; disciplina: DiscId; topico: string; enunciado: string; opcoes: string[]; correta: number; explicacao: string }
export type Aluno = { id: string; nome: string; turma: string; vitorias: number; acertos: number; tempo: number }

export const DISC: Record<DiscId, { nome: string; cor: string; bg: string }> = {
  matematica: { nome: 'Matemática', cor: '#3A3FD9', bg: '#E7EAFE' },
  fisica: { nome: 'Física', cor: '#1D6FD1', bg: '#E5F1FD' },
  quimica: { nome: 'Química', cor: '#4D7A0C', bg: '#EEF7DF' },
}
export const TOPICOS: Record<DiscId, string[]> = {
  matematica: ['Funções do 1º grau', 'Funções do 2º grau', 'Progressões', 'Estatística básica'],
  fisica: ['Cinemática', 'Leis de Newton', 'Energia e trabalho', 'Ondulatória'],
  quimica: ['Modelos atômicos', 'Tabela periódica', 'Ligações químicas', 'Estequiometria'],
}
/** Tópico que aparece na lista, mas falha na validação de conteúdo ao iniciar (sobreposto O5 do Figma). */
export const SEM_CONTEUDO = 'Ondulatória'

export const COPA = {
  nome: 'Copa GenieX · 1º ano',
  sub: 'Mostre o que você sabe e dispute o topo do ranking!',
  periodo: '01 nov. 2026 — 30 nov. 2026',
  participantes: 128,
  ano: '1º ano',
  escola: 'Escola GenieX',
  disc: ['matematica', 'fisica', 'quimica'] as DiscId[],
}
export const EU = 'mariana'
/** Estudantes do 1º ano da Escola GenieX (ranking da Copa). As vitórias, acertos e tempo da Mariana vêm das batalhas dela. */
export const ALUNOS: Aluno[] = [
  { id: 'ana', nome: 'Ana Beatriz', turma: '1º ano A', vitorias: 14, acertos: 118, tempo: 21 },
  { id: 'bruno', nome: 'Bruno Lima', turma: '1º ano B', vitorias: 12, acertos: 104, tempo: 24 },
  { id: 'carla', nome: 'Carla Mendes', turma: '1º ano A', vitorias: 12, acertos: 98, tempo: 22 },
  { id: 'lucas', nome: 'Lucas Rocha', turma: '1º ano B', vitorias: 10, acertos: 92, tempo: 26 },
  { id: 'mariana', nome: 'Mariana Alves', turma: '1º ano A', vitorias: 9, acertos: 81, tempo: 23 },
  { id: 'joao', nome: 'João Pedro', turma: '1º ano C', vitorias: 9, acertos: 81, tempo: 27 },
  { id: 'rafaela', nome: 'Rafaela Costa', turma: '1º ano C', vitorias: 8, acertos: 76, tempo: 25 },
  { id: 'gabriel', nome: 'Gabriel Souza', turma: '1º ano A', vitorias: 7, acertos: 70, tempo: 24 },
  { id: 'isabela', nome: 'Isabela Nunes', turma: '1º ano B', vitorias: 7, acertos: 66, tempo: 29 },
  { id: 'daniel', nome: 'Daniel Rocha', turma: '1º ano C', vitorias: 6, acertos: 61, tempo: 26 },
  { id: 'juliana', nome: 'Juliana Costa', turma: '1º ano C', vitorias: 5, acertos: 58, tempo: 23 },
  { id: 'pedro', nome: 'Pedro Henrique', turma: '1º ano B', vitorias: 5, acertos: 54, tempo: 31 },
  { id: 'beatriz', nome: 'Beatriz Lopes', turma: '1º ano C', vitorias: 4, acertos: 49, tempo: 28 },
  { id: 'felipe', nome: 'Felipe Araújo', turma: '1º ano A', vitorias: 3, acertos: 41, tempo: 30 },
]
export const aluno = (id: string) => ALUNOS.find((a) => a.id === id) as Aluno
export const primeiro = (id: string) => aluno(id).nome.split(' ')[0]

/* ------------------------------------------------------------------ gerador de questões */
const R = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1))
const pick = <T,>(xs: T[]) => xs[R(0, xs.length - 1)]
export function embaralhar<T>(xs: T[]): T[] {
  const t = [...xs]
  for (let i = t.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[t[i], t[j]] = [t[j], t[i]]
  }
  return t
}
const num = (n: number) => (Number.isInteger(n) ? String(n) : n.toLocaleString('pt-BR', { maximumFractionDigits: 2 }))
const neg = (n: number) => (n < 0 ? '−' + num(-n) : num(n))
/** a·x² + b·x + c com sinais tipográficos. */
function poli(cs: [number, string][]) {
  let s = ''
  for (const [c, v] of cs) {
    if (c === 0) continue
    const abs = Math.abs(c)
    const corpo = (abs === 1 && v ? '' : num(abs)) + v
    s += s ? (c < 0 ? ' − ' : ' + ') + corpo : (c < 0 ? '−' : '') + corpo
  }
  return s || '0'
}
type Gerada = { enunciado: string; certa: string; erradas: string[]; explicacao: string }
/** Completa com valores numéricos próximos até ter 4 erradas distintas. */
function numericas(c: number, cand: number[], un = '') {
  const fmt = (v: number) => neg(v) + un
  const vistos = new Set([fmt(c)])
  const out: string[] = []
  for (const v of [...cand, c + 1, c - 1, c + 2, c - 2, c + 3, c * 2, c + 5, c - 5, c + 10]) {
    const f = fmt(Math.round(v * 100) / 100)
    if (!vistos.has(f) && out.length < 4) {
      vistos.add(f)
      out.push(f)
    }
  }
  return { certa: fmt(c), erradas: out }
}
const EL: [string, string, number, number][] = [
  ['Sódio', 'Na', 11, 23], ['Magnésio', 'Mg', 12, 24], ['Alumínio', 'Al', 13, 27], ['Cloro', 'Cl', 17, 35], ['Potássio', 'K', 19, 39],
  ['Cálcio', 'Ca', 20, 40], ['Ferro', 'Fe', 26, 56], ['Oxigênio', 'O', 8, 16], ['Carbono', 'C', 6, 12], ['Nitrogênio', 'N', 7, 14], ['Enxofre', 'S', 16, 32], ['Flúor', 'F', 9, 19],
]
const FAM: [string, string][] = [['Lítio (Li)', 'Metais alcalinos'], ['Sódio (Na)', 'Metais alcalinos'], ['Potássio (K)', 'Metais alcalinos'], ['Magnésio (Mg)', 'Metais alcalinoterrosos'], ['Cálcio (Ca)', 'Metais alcalinoterrosos'], ['Flúor (F)', 'Halogênios'], ['Cloro (Cl)', 'Halogênios'], ['Neônio (Ne)', 'Gases nobres'], ['Argônio (Ar)', 'Gases nobres'], ['Oxigênio (O)', 'Calcogênios'], ['Enxofre (S)', 'Calcogênios']]
const FAMILIAS = ['Metais alcalinos', 'Metais alcalinoterrosos', 'Halogênios', 'Gases nobres', 'Calcogênios', 'Família do carbono']
const LIG: [string, string][] = [['NaCl (cloreto de sódio)', 'Iônica'], ['KBr (brometo de potássio)', 'Iônica'], ['MgO (óxido de magnésio)', 'Iônica'], ['H₂O (água)', 'Covalente'], ['CO₂ (gás carbônico)', 'Covalente'], ['CH₄ (metano)', 'Covalente'], ['NH₃ (amônia)', 'Covalente'], ['Fe (ferro)', 'Metálica'], ['Cu (cobre)', 'Metálica'], ['Al (alumínio)', 'Metálica']]
const MOL: [string, number, string][] = [['H₂O', 18, '2·1 + 16'], ['CO₂', 44, '12 + 2·16'], ['CH₄', 16, '12 + 4·1'], ['NH₃', 17, '14 + 3·1'], ['O₂', 32, '2·16'], ['CaCO₃', 100, '40 + 12 + 3·16'], ['H₂SO₄', 98, '2·1 + 32 + 4·16'], ['C₆H₁₂O₆', 180, '6·12 + 12·1 + 6·16']]

const GERA: Record<string, (() => Gerada)[]> = {
  'Funções do 1º grau': [
    () => { const a = R(2, 7), b = pick([-9, -7, -5, -3, 2, 4, 6, 8]), k = R(-3, 6), c = a * k + b; return { enunciado: `Qual é o valor de f(${neg(k)}) na função f(x) = ${poli([[a, 'x'], [b, '']])}?`, ...numericas(c, [a * k - b, a + k + b, a * (k + 1) + b]), explicacao: `Substitua x por ${neg(k)}: f(${neg(k)}) = ${a}·(${neg(k)}) ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${neg(c)}.` } },
    () => { const r = pick([-6, -4, -3, -2, 2, 3, 4, 5, 6]), a = R(2, 5), b = -a * r; return { enunciado: `Qual é a raiz (zero) da função f(x) = ${poli([[a, 'x'], [b, '']])}?`, ...numericas(r, [-r, b, a]), explicacao: `A raiz é o valor de x que zera a função: ${a}x ${b < 0 ? '−' : '+'} ${Math.abs(b)} = 0 ⇒ x = ${neg(r)}.` } },
    () => { const a = R(2, 6), b = R(1, 9), x1 = R(0, 3), x2 = x1 + R(2, 5); return { enunciado: `Em f(x) = ${poli([[a, 'x'], [b, '']])}, quanto f(x) aumenta quando x passa de ${x1} para ${x2}?`, ...numericas(a * (x2 - x1), [a, x2 - x1, a * x2 + b]), explicacao: `Na função do 1º grau, a variação é a·Δx = ${a}·${x2 - x1} = ${a * (x2 - x1)}.` } },
  ],
  'Funções do 2º grau': [
    () => { const a = R(1, 3), b = R(-6, 6), c0 = R(-5, 5), k = R(-3, 4), v = a * k * k + b * k + c0; return { enunciado: `Qual é o valor de f(${neg(k)}) na função f(x) = ${poli([[a, 'x²'], [b, 'x'], [c0, '']])}?`, ...numericas(v, [a * k + b * k + c0, a * k * k - b * k + c0, v + a]), explicacao: `f(${neg(k)}) = ${a}·${k * k} ${b * k < 0 ? '−' : '+'} ${Math.abs(b * k)} ${c0 < 0 ? '−' : '+'} ${Math.abs(c0)} = ${neg(v)}.` } },
    () => { const xv = pick([-4, -3, -2, -1, 1, 2, 3, 4]), a = R(1, 3), b = -2 * a * xv, c0 = R(-6, 6); return { enunciado: `Qual é o x do vértice da parábola f(x) = ${poli([[a, 'x²'], [b, 'x'], [c0, '']])}?`, ...numericas(xv, [-xv, b, xv * 2]), explicacao: `x do vértice = −b/2a = ${neg(-b)}/${2 * a} = ${neg(xv)}.` } },
    () => { const r1 = R(-5, 5), r2 = R(-5, 5), s = r1 + r2, p = r1 * r2; return { enunciado: `Qual é a soma das raízes de f(x) = ${poli([[1, 'x²'], [-s, 'x'], [p, '']])}?`, ...numericas(s, [-s, p, -p]), explicacao: `Pela relação de soma, x₁ + x₂ = −b/a = ${neg(s)} (raízes ${neg(r1)} e ${neg(r2)}).` } },
  ],
  Progressões: [
    () => { const a1 = R(1, 10), r = R(2, 7), n = R(5, 12), an = a1 + (n - 1) * r; return { enunciado: `Em uma PA com a₁ = ${a1} e razão ${r}, qual é o ${n}º termo?`, ...numericas(an, [a1 + n * r, an - r, a1 * n]), explicacao: `aₙ = a₁ + (n − 1)·r = ${a1} + ${n - 1}·${r} = ${an}.` } },
    () => { const a1 = R(1, 4), q = pick([2, 3]), n = R(4, 6), an = a1 * q ** (n - 1); return { enunciado: `Em uma PG com a₁ = ${a1} e razão ${q}, qual é o ${n}º termo?`, ...numericas(an, [a1 * q ** n, a1 * q * (n - 1), an / q]), explicacao: `aₙ = a₁·qⁿ⁻¹ = ${a1}·${q}^${n - 1} = ${an}.` } },
    () => { const a1 = R(1, 6), r = R(1, 4), n = pick([5, 6, 8, 10]), an = a1 + (n - 1) * r, s = (n * (a1 + an)) / 2; return { enunciado: `Qual é a soma dos ${n} primeiros termos da PA (${a1}, ${a1 + r}, ${a1 + 2 * r}, …)?`, ...numericas(s, [an, n * an, s - an]), explicacao: `Sₙ = n·(a₁ + aₙ)/2 = ${n}·(${a1} + ${an})/2 = ${num(s)}.` } },
  ],
  'Estatística básica': [
    () => { const xs = [R(2, 10), R(2, 10), R(2, 10), R(2, 10)]; const m = R(5, 9); xs.push(m * 5 - xs.reduce((a, b) => a + b, 0)); if (xs[4] < 0) xs[4] = m; const mm = xs.reduce((a, b) => a + b, 0) / 5; return { enunciado: `Qual é a média aritmética das notas ${xs.join(', ')}?`, ...numericas(mm, [Math.max(...xs), Math.min(...xs), mm + 0.5]), explicacao: `Some tudo (${xs.reduce((a, b) => a + b, 0)}) e divida por 5: ${num(mm)}.` } },
    () => { const xs = [R(1, 20), R(1, 20), R(1, 20), R(1, 20), R(1, 20)]; const o = [...xs].sort((a, b) => a - b); return { enunciado: `Qual é a mediana do conjunto {${xs.join(', ')}}?`, ...numericas(o[2], [o[1], o[3], xs[2]]), explicacao: `Em ordem: ${o.join(', ')}. O termo do meio é ${o[2]}.` } },
    () => { const m = R(2, 9); const xs = embaralhar([m, m, m, R(10, 15), R(16, 20), R(21, 25)]); return { enunciado: `Qual é a moda do conjunto {${xs.join(', ')}}?`, ...numericas(m, xs.filter((x) => x !== m)), explicacao: `A moda é o valor que mais se repete: ${m} aparece 3 vezes.` } },
  ],
  Cinemática: [
    () => { const v = R(2, 30), t = R(2, 12), d = v * t; return { enunciado: `Um ciclista percorre ${d} m em ${t} s com velocidade constante. Qual é a velocidade dele?`, ...numericas(v, [d - t, d, v + t], ' m/s'), explicacao: `v = Δs/Δt = ${d}/${t} = ${v} m/s.` } },
    () => { const v0 = R(0, 10), a = R(1, 5), t = R(2, 8), v = v0 + a * t; return { enunciado: `Um carro parte com ${v0} m/s e acelera ${a} m/s² por ${t} s. Qual é a velocidade final?`, ...numericas(v, [a * t, v0 * t, v0 + a], ' m/s'), explicacao: `v = v₀ + a·t = ${v0} + ${a}·${t} = ${v} m/s.` } },
    () => { const ms = pick([5, 10, 15, 20, 25, 30]), kmh = ms * 3.6; return { enunciado: `Quanto vale ${num(kmh)} km/h em m/s?`, ...numericas(ms, [kmh * 3.6, ms * 2, kmh / 2], ' m/s'), explicacao: `Para passar de km/h para m/s, divida por 3,6: ${num(kmh)}/3,6 = ${ms} m/s.` } },
  ],
  'Leis de Newton': [
    () => { const m = R(2, 20), a = R(1, 6), f = m * a; return { enunciado: `Um corpo de ${m} kg tem aceleração de ${a} m/s². Qual é a força resultante sobre ele?`, ...numericas(f, [m + a, f / 2, m * 10], ' N'), explicacao: `2ª lei de Newton: F = m·a = ${m}·${a} = ${f} N.` } },
    () => { const m = pick([2, 4, 5, 8, 10]), a = R(2, 6), f = m * a; return { enunciado: `Uma força resultante de ${f} N age sobre um corpo de ${m} kg. Qual é a aceleração?`, ...numericas(a, [f * m, f - m, a * 2], ' m/s²'), explicacao: `a = F/m = ${f}/${m} = ${a} m/s².` } },
    () => { const m = R(2, 90), p = m * 10; return { enunciado: `Qual é o peso de um corpo de ${m} kg (use g = 10 m/s²)?`, ...numericas(p, [m, p / 2, p + 10], ' N'), explicacao: `P = m·g = ${m}·10 = ${p} N.` } },
  ],
  'Energia e trabalho': [
    () => { const m = pick([2, 4, 6, 8, 10]), v = R(2, 10), e = (m * v * v) / 2; return { enunciado: `Qual é a energia cinética de um corpo de ${m} kg a ${v} m/s?`, ...numericas(e, [m * v, m * v * v, e / 2], ' J'), explicacao: `Ec = m·v²/2 = ${m}·${v * v}/2 = ${e} J.` } },
    () => { const m = R(1, 10), h = R(2, 15), e = m * 10 * h; return { enunciado: `Qual é a energia potencial gravitacional de ${m} kg a ${h} m de altura (g = 10 m/s²)?`, ...numericas(e, [m * h, e / 2, e + 10], ' J'), explicacao: `Ep = m·g·h = ${m}·10·${h} = ${e} J.` } },
    () => { const f = R(5, 50), d = R(2, 12), w = f * d; return { enunciado: `Uma força de ${f} N desloca um objeto por ${d} m na mesma direção. Qual é o trabalho realizado?`, ...numericas(w, [f + d, w / 2, f * (d + 1)], ' J'), explicacao: `τ = F·d = ${f}·${d} = ${w} J.` } },
  ],
  Ondulatória: [
    () => { const l = R(1, 10), f = R(2, 50), v = l * f; return { enunciado: `Uma onda tem comprimento de ${l} m e frequência de ${f} Hz. Qual é a velocidade dela?`, ...numericas(v, [l + f, f / l, v / 2], ' m/s'), explicacao: `v = λ·f = ${l}·${f} = ${v} m/s.` } },
    () => { const f = pick([2, 4, 5, 10, 20, 25, 50]), t = 1 / f; return { enunciado: `Qual é o período de uma onda de ${f} Hz?`, ...numericas(t, [f, t * 2, t / 2], ' s'), explicacao: `T = 1/f = 1/${f} = ${num(t)} s.` } },
  ],
  'Modelos atômicos': [
    () => { const [n, s, z, a] = pick(EL); return { enunciado: `Quantos nêutrons tem o átomo de ${n.toLowerCase()} (${s}, Z = ${z}, A = ${a})?`, ...numericas(a - z, [z, a, a + z]), explicacao: `Nêutrons = A − Z = ${a} − ${z} = ${a - z}.` } },
    () => { const [n, s, z, a] = pick(EL); return { enunciado: `Quantos elétrons tem um átomo neutro de ${n.toLowerCase()} (${s}, Z = ${z}, A = ${a})?`, ...numericas(z, [a, a - z, z + 2]), explicacao: `No átomo neutro, elétrons = prótons = Z = ${z}.` } },
    () => { const [txt, certa] = pick([['esfera maciça e indivisível', 'Dalton'], ['“pudim de passas”, com elétrons espalhados numa massa positiva', 'Thomson'], ['núcleo pequeno e denso, cercado por uma eletrosfera', 'Rutherford'], ['elétrons em níveis de energia definidos (camadas)', 'Bohr']] as [string, string][]); return { enunciado: `Qual cientista propôs o modelo atômico do ${txt}?`, certa, erradas: ['Dalton', 'Thomson', 'Rutherford', 'Bohr', 'Schrödinger'].filter((x) => x !== certa).slice(0, 4), explicacao: `Esse é o modelo de ${certa}.` } },
  ],
  'Tabela periódica': [
    () => { const [el, fam] = pick(FAM); return { enunciado: `A qual família da tabela periódica pertence o ${el}?`, certa: fam, erradas: embaralhar(FAMILIAS.filter((f) => f !== fam)).slice(0, 4), explicacao: `${el.split(' ')[0]} está no grupo dos ${fam.toLowerCase()}.` } },
    () => { const [z, nome, per] = pick([[11, 'sódio', 3], [17, 'cloro', 3], [19, 'potássio', 4], [8, 'oxigênio', 2], [20, 'cálcio', 4], [6, 'carbono', 2], [26, 'ferro', 4], [12, 'magnésio', 3]] as [number, string, number][]); return { enunciado: `Em qual período da tabela periódica está o ${nome} (Z = ${z})?`, certa: per + 'º período', erradas: [1, 2, 3, 4, 5, 6].filter((p) => p !== per).slice(0, 4).map((p) => p + 'º período'), explicacao: `O ${nome} tem elétrons distribuídos em ${per} camadas, por isso fica no ${per}º período.` } },
  ],
  'Ligações químicas': [
    () => { const [sub, tipo] = pick(LIG); return { enunciado: `Que tipo de ligação química predomina em ${sub}?`, certa: tipo, erradas: ['Iônica', 'Covalente', 'Metálica', 'Ponte de hidrogênio', 'Dipolo induzido'].filter((x) => x !== tipo).slice(0, 4), explicacao: tipo === 'Iônica' ? 'Metal + ametal: há transferência de elétrons, formando íons (ligação iônica).' : tipo === 'Covalente' ? 'Ametais compartilham pares de elétrons: ligação covalente.' : 'Átomos de metal compartilham um “mar de elétrons”: ligação metálica.' } },
    () => { const [el, n] = pick([['hidrogênio', 1], ['oxigênio', 2], ['nitrogênio', 3], ['carbono', 4]] as [string, number][]); return { enunciado: `Quantas ligações covalentes um átomo de ${el} costuma fazer para ficar estável?`, ...numericas(n, [1, 2, 3, 4, 5, 6].filter((x) => x !== n)), explicacao: `O ${el} completa o octeto (ou dueto) fazendo ${n} ligação${n > 1 ? 'ões' : ''} covalente${n > 1 ? 's' : ''}.` } },
  ],
  Estequiometria: [
    () => { const [f, m, conta] = pick(MOL); return { enunciado: `Qual é a massa molar de ${f}? (H = 1, C = 12, N = 14, O = 16, S = 32, Ca = 40)`, ...numericas(m, [m - 2, m + 2, m / 2], ' g/mol'), explicacao: `${f}: ${conta} = ${m} g/mol.` } },
    () => { const [f, m] = pick(MOL.slice(0, 6)); const n = R(2, 6); return { enunciado: `Quantos mols há em ${n * m} g de ${f}? (massa molar = ${m} g/mol)`, ...numericas(n, [n * m, m / n, n + 2], ' mol'), explicacao: `n = m/M = ${n * m}/${m} = ${n} mol.` } },
    () => { const n = R(2, 6); return { enunciado: `Na reação 2 H₂ + O₂ → 2 H₂O, quantos mols de água se formam com ${n} mols de O₂?`, ...numericas(2 * n, [n, n / 2, 3 * n], ' mol'), explicacao: `A proporção O₂ : H₂O é 1 : 2, então ${n} mol de O₂ formam ${2 * n} mol de água.` } },
  ],
}

let seq = 0
export function gerarQuestao(disciplina: DiscId, topico: string): Questao {
  const g = pick(GERA[topico])()
  const opcoes = embaralhar([g.certa, ...g.erradas.slice(0, 4)])
  return { id: 'q' + ++seq, disciplina, topico, enunciado: g.enunciado, opcoes, correta: opcoes.indexOf(g.certa), explicacao: g.explicacao }
}
/** n questões distintas de um tópico. */
export function questoesDoTopico(s: Selecao, n: number): Questao[] {
  const out: Questao[] = []
  const vistos = new Set<string>()
  for (let i = 0; out.length < n && i < n * 30; i++) {
    const q = gerarQuestao(s.disciplina, s.topico)
    if (!vistos.has(q.enunciado)) {
      vistos.add(q.enunciado)
      out.push(q)
    }
  }
  return out
}
