import {
  Atom,
  BookOpen,
  Brain,
  Building2,
  Calculator,
  ChartColumn,
  Cloud,
  Compass,
  Crown,
  Dice5,
  Dna,
  Drama,
  Droplets,
  Factory,
  Feather,
  FileText,
  FlaskConical,
  Gavel,
  Globe,
  HeartHandshake,
  Hourglass,
  Landmark,
  Languages,
  Leaf,
  Lightbulb,
  Magnet,
  Map,
  Megaphone,
  Microscope,
  Mountain,
  Palette,
  PenLine,
  Quote,
  Scale,
  Scroll,
  Shapes,
  Sigma,
  Sun,
  Swords,
  Thermometer,
  TrendingUp,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import type { ComponentType } from 'react'

/* =====================================================================
   Conteúdo do protótipo Flashcards (GenieX · plataforma do estudante)
   Banco de disciplinas → tópicos → cards (pergunta + resposta).
   Nas respostas, **trecho** vira destaque em negrito.
   ===================================================================== */

export type Icone = LucideIcon | ComponentType<{ size?: number | string; strokeWidth?: number | string; className?: string }>

export type AreaId = 'natureza' | 'humanas' | 'linguagens' | 'matematica'
export const AREAS: { id: AreaId | 'todas'; nome: string }[] = [
  { id: 'todas', nome: 'Todas' },
  { id: 'natureza', nome: 'Ciências da Natureza' },
  { id: 'humanas', nome: 'Ciências Humanas' },
  { id: 'linguagens', nome: 'Linguagens e Códigos' },
  { id: 'matematica', nome: 'Matemática e suas tecnologias' },
]

export type Card = { id: string; disc: string; topico: string; pergunta: string; resposta: string }
export type Topico = { id: string; nome: string; desc: string; icone: Icone; cards: Card[] }
export type Disciplina = {
  id: string
  nome: string
  /** nome do curso exibido nos grupos */
  curso: string
  area: AreaId
  icone: Icone
  /** cor de destaque (chips de favoritos e ilustração dos grupos) */
  cor: string
  /** ilustração do card do grupo: arte 3D da referência ou composição com emojis 3D */
  arte: { img: string } | { emojis: string[] }
  topicos: Topico[]
}

/** “A” dentro de um quadrado (ícone de Português da referência) */
export function IconeLetraA({ size = 24, strokeWidth = 2, className }: { size?: number | string; strokeWidth?: number | string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
      <path d="m8.5 16.5 3.5-9 3.5 9M9.8 13.4h4.4" />
    </svg>
  )
}

/** linhas “Pergunta || Resposta” → cards */
const cards = (disc: string, topico: string, bloco: string): Card[] =>
  bloco
    .trim()
    .split('\n')
    .map((l, i) => {
      const [pergunta, resposta] = l.split('||').map((x) => x.trim())
      return { id: `${topico}-${i + 1}`, disc, topico, pergunta, resposta }
    })

type TopicoBruto = [id: string, nome: string, desc: string, icone: Icone, bloco: string]
const disc = (d: Omit<Disciplina, 'topicos'>, ts: TopicoBruto[]): Disciplina => ({
  ...d,
  topicos: ts.map(([id, nome, desc, icone, bloco]) => ({ id, nome, desc, icone, cards: cards(d.id, id, bloco) })),
})

export const DISCIPLINAS: Disciplina[] = [
  disc({ id: 'portugues', nome: 'Português', curso: 'Português - Ensino Médio', area: 'linguagens', icone: IconeLetraA, cor: '#4b55ec', arte: { emojis: ['memo', 'pencil', 'books'] } }, [
    ['classes', 'Classes gramaticais', 'Substantivo, adjetivo, verbo, advérbio e outras classes.', FileText, `
Quantas são as classes gramaticais da língua portuguesa? || São **dez**: substantivo, artigo, adjetivo, numeral, pronome, verbo, advérbio, preposição, conjunção e interjeição.
Qual a diferença entre adjetivo e advérbio? || O **adjetivo** caracteriza o substantivo; o **advérbio** modifica o verbo, o adjetivo ou outro advérbio, indicando circunstâncias como tempo, modo e lugar.
O que é uma conjunção? || É a palavra que **liga orações** ou termos de mesma função, como “e”, “mas”, “porque” e “embora”.`],
    ['concordancia', 'Concordância verbal e nominal', 'Regras de concordância e casos especiais.', PenLine, `
O que é concordância verbal? || É a adequação do **verbo** ao seu sujeito em **número e pessoa**: “Os alunos estudaram”.
Como fica o verbo “haver” no sentido de existir? || Fica **impessoal**, sempre no singular: “Havia muitos alunos na sala”.
O que é concordância nominal? || É a concordância de artigos, adjetivos, pronomes e numerais com o **substantivo** a que se referem, em gênero e número.`],
    ['interpretacao', 'Interpretação de texto', 'Leitura, inferência e identificação da ideia central.', BookOpen, `
Qual a diferença entre compreender e interpretar um texto? || **Compreender** é entender o que está explícito; **interpretar** é tirar conclusões a partir do texto, fazendo inferências.
O que é uma inferência? || É uma informação **implícita** que o leitor deduz a partir de pistas do texto.
Como identificar a ideia central de um texto? || Procure a **tese** ou o assunto que se repete e organiza os demais parágrafos, geralmente na introdução.`],
    ['figuras', 'Figuras de linguagem', 'Metáfora, metonímia, ironia, hipérbole e outras.', Quote, `
O que é uma metáfora? || É uma comparação **implícita**, sem conectivo: “Seus olhos são duas estrelas”.
Qual a diferença entre metáfora e comparação? || A **comparação** usa conectivo (como, tal qual); a **metáfora** transfere o sentido diretamente.
O que é uma hipérbole? || É o **exagero intencional** para dar ênfase: “Já te disse isso um milhão de vezes”.`],
    ['pontuacao', 'Pontuação', 'Uso da vírgula, ponto e vírgula e dois-pontos.', PenLine, `
Quando não se deve usar vírgula? || Entre o **sujeito e o verbo** e entre o verbo e seus complementos, na ordem direta.
Para que serve o ponto e vírgula? || Para separar orações ou itens de uma enumeração com **pausa maior** que a da vírgula.
Quando usamos dois-pontos? || Antes de **citações, enumerações** e explicações.`],
    ['coesao', 'Coesão e coerência', 'Conectivos, retomadas e progressão do texto.', Quote, `
Qual a diferença entre coesão e coerência? || **Coesão** é a ligação gramatical entre as partes do texto; **coerência** é a lógica e o sentido do todo.
O que são elementos coesivos? || Palavras que **conectam e retomam** ideias, como pronomes, sinônimos e conjunções.
Dê um exemplo de conectivo de oposição. || “**Mas**”, “porém”, “contudo”, “entretanto” e “no entanto”.`],
  ]),

  disc({ id: 'literatura', nome: 'Literatura', curso: 'Literatura - Ensino Médio', area: 'linguagens', icone: BookOpen, cor: '#6d5df5', arte: { img: './flash/p-literatura.webp' } }, [
    ['romantismo', 'Romantismo no Brasil', 'Contexto histórico, características, principais autores e obras.', FileText, `
Quais são as principais características do Romantismo no Brasil? || O Romantismo no **Brasil** apresenta como principais características: o nacionalismo, o indianismo, a idealização do amor, o sentimentalismo, a valorização da natureza e a fuga da realidade.
Quem foram os principais autores do Romantismo no Brasil? || Destacam-se **José de Alencar**, Gonçalves Dias, Álvares de Azevedo, Castro Alves e Joaquim Manuel de Macedo.
Como a natureza é representada nas obras românticas brasileiras? || Como símbolo da **identidade nacional**: exuberante, grandiosa e idealizada, muitas vezes refletindo os sentimentos dos personagens.
Qual é o contexto histórico do Romantismo no Brasil? || Surge após a **Independência (1822)**, quando o país buscava construir uma identidade nacional própria, distante de Portugal.
Quais são as fases do Romantismo brasileiro? || Na poesia: **1ª geração** (nacionalista e indianista), **2ª geração** (ultrarromântica, “mal do século”) e **3ª geração** (condoreira, social).
Qual a importância de José de Alencar para o Romantismo? || Ele consolidou o **romance brasileiro**, com obras indianistas (Iracema, O Guarani), urbanas (Senhora) e regionalistas (O Sertanejo).
Como o nacionalismo se manifesta na literatura romântica? || Pela exaltação da **natureza**, do **indígena** como herói nacional e da língua falada no Brasil.
Quais são as diferenças entre o Romantismo e o Realismo? || O Romantismo **idealiza** o amor, os heróis e a realidade; o Realismo faz uma **análise crítica e objetiva** da sociedade e dos comportamentos.
O que foi o Romantismo no Brasil? || Movimento literário do século XIX (1836–1881) marcado pela **subjetividade**, pelo sentimentalismo e pela busca de uma identidade nacional.
Qual obra marca o início do Romantismo no Brasil? || **Suspiros Poéticos e Saudades** (1836), de Gonçalves de Magalhães.`],
    ['realismo', 'Realismo', 'Características, principais autores e obras.', Drama, `
Quais são as características do Realismo? || **Objetividade**, crítica social, análise psicológica dos personagens e retrato da burguesia.
Qual obra inaugura o Realismo no Brasil? || **Memórias Póstumas de Brás Cubas** (1881), de Machado de Assis.
Qual a diferença entre Realismo e Naturalismo? || O Naturalismo radicaliza o Realismo, explicando o comportamento pelo **meio, raça e momento histórico** (determinismo).`],
    ['modernismo', 'Modernismo', 'Fases, características, autores e principais obras.', Feather, `
Quais são as características do Modernismo? || **Liberdade formal**, verso livre, linguagem coloquial, humor, valorização do cotidiano e da cultura brasileira.
O que foi a Semana de Arte Moderna de 1922? || Evento em **São Paulo** que marcou o início do Modernismo, propondo romper com os padrões acadêmicos.
Quais são as fases do Modernismo brasileiro? || **1ª fase** (heroica, 1922–1930), **2ª fase** (romance de 30 e poesia madura) e **3ª fase** (Geração de 45).
Quem foram os principais autores da 1ª fase modernista? || **Mário de Andrade**, Oswald de Andrade e Manuel Bandeira.
O que propunha o Manifesto Antropófago? || “Devorar” as influências estrangeiras e **transformá-las** em uma cultura genuinamente brasileira.
O que caracteriza o romance de 30? || Prosa **regionalista** e de denúncia social, com autores como Graciliano Ramos, Rachel de Queiroz e Jorge Amado.
Qual a importância de Carlos Drummond de Andrade? || É um dos maiores poetas da 2ª fase, com poesia que une **reflexão existencial**, ironia e questões sociais.
Quem é Clarice Lispector no Modernismo? || Autora da 3ª fase conhecida pela **prosa introspectiva** e pelo fluxo de consciência, como em “A hora da estrela”.`],
    ['contemporanea', 'Literatura Contemporânea', 'Principais características e autores da literatura brasileira contemporânea.', BookOpen, `
O que caracteriza a literatura contemporânea brasileira? || **Pluralidade** de estilos, fragmentação, temas urbanos e mistura de gêneros.
Cite autores contemporâneos importantes. || **Conceição Evaristo**, Milton Hatoum, Chico Buarque e Itamar Vieira Junior.
O que é a “escrevivência” de Conceição Evaristo? || Escrita que parte da **vivência** de mulheres negras, unindo memória individual e coletiva.`],
    ['generos', 'Gêneros Textuais', 'Tipos de gêneros, características e exemplos na literatura.', FileText, `
O que são gêneros textuais? || São formas de texto com **função social** definida, como notícia, crônica, carta e conto.
Qual a diferença entre gênero e tipo textual? || **Tipo** é a estrutura (narração, descrição, dissertação); **gênero** é o texto concreto do dia a dia.
Quais são as características da crônica? || Texto curto, **linguagem leve**, ligado ao cotidiano e publicado originalmente em jornais.
O que é um conto? || Narrativa **curta**, com poucos personagens e um único conflito.
Quais são os gêneros literários clássicos? || **Lírico**, épico (narrativo) e dramático.
O que caracteriza o gênero dramático? || Texto feito para ser **encenado**, construído por diálogos e rubricas.`],
    ['movimentos', 'Principais Movimentos Literários', 'Panorama geral dos movimentos literários brasileiros.', Users, `
Qual a ordem dos movimentos literários no Brasil? || **Quinhentismo**, Barroco, Arcadismo, Romantismo, Realismo, Parnasianismo, Simbolismo, Pré-Modernismo e Modernismo.
O que foi o Barroco? || Movimento do século XVII marcado pelo **conflito** entre fé e razão, com antíteses e paradoxos. Destaque: Gregório de Matos.
O que caracteriza o Arcadismo? || Busca da **simplicidade**, vida no campo (bucolismo) e equilíbrio clássico.`],
  ]),

  disc({ id: 'ingles', nome: 'Inglês', curso: 'Inglês - Ensino Médio', area: 'linguagens', icone: Languages, cor: '#2f7de1', arte: { emojis: ['airplane', 'notes', 'microphone'] } }, [
    ['present', 'Simple Present', 'Uso, estrutura e verbos auxiliares.', FileText, `
Quando usamos o Simple Present? || Para **hábitos, rotinas** e verdades universais: “She studies every day”.
O que muda na 3ª pessoa do singular? || O verbo recebe **-s/-es**: “He works”, “She watches”.
Qual auxiliar é usado em negativas e perguntas? || **Do/does**: “Do you like music?”, “He doesn't play”.`],
    ['past', 'Simple Past', 'Verbos regulares e irregulares.', Hourglass, `
Como se forma o Simple Past dos verbos regulares? || Acrescentando **-ed**: play → played, study → studied.
Qual o passado de “go”, “have” e “see”? || **Went**, had e saw.
Qual auxiliar é usado no Simple Past? || **Did**: “Did you travel?”, “I didn't know”.`],
    ['perfect', 'Present Perfect', 'Ações que conectam passado e presente.', Hourglass, `
Como se forma o Present Perfect? || **Have/has + particípio**: “I have finished”.
Quando usamos o Present Perfect? || Para ações passadas **sem tempo definido** ou que continuam no presente.
Qual a diferença entre “for” e “since”? || **For** indica duração (for two years); **since** indica o ponto de início (since 2020).`],
    ['reading', 'Reading strategies', 'Skimming, scanning e cognatos.', BookOpen, `
O que é skimming? || Leitura rápida para captar a **ideia geral** do texto.
O que é scanning? || Busca de uma **informação específica**, como datas e nomes.
O que são cognatos? || Palavras **parecidas** com o português e com o mesmo sentido: “important”, “university”.`],
    ['modais', 'Modal verbs', 'Can, could, should, must e may.', Languages, `
O que expressa o verbo “can”? || **Habilidade** ou permissão: “I can swim”.
Qual a diferença entre “must” e “should”? || **Must** indica obrigação forte; **should** indica conselho.
O que expressa “may”? || **Possibilidade** ou pedido formal de permissão.`],
    ['falsos', 'False cognates', 'Falsos amigos mais comuns.', Quote, `
O que significa “pretend”? || **Fingir** (e não “pretender”, que é “intend”).
O que significa “actually”? || **Na verdade** (e não “atualmente”, que é “currently”).
O que significa “push”? || **Empurrar** (e não “puxar”, que é “pull”).`],
  ]),

  disc({ id: 'artes', nome: 'Artes', curso: 'Artes - Ensino Médio', area: 'linguagens', icone: Palette, cor: '#e0559b', arte: { img: './flash/p-artes.webp' } }, [
    ['rupestre', 'Arte rupestre e antiga', 'Primeiras manifestações artísticas da humanidade.', Mountain, `
O que é arte rupestre? || Pinturas e gravuras feitas em **paredes de cavernas** e rochas na Pré-História.
Onde há arte rupestre importante no Brasil? || No **Parque Nacional da Serra da Capivara**, no Piauí.
Qual era a função da arte no Egito Antigo? || Tinha função **religiosa e funerária**, ligada à vida após a morte.`],
    ['renascimento', 'Renascimento', 'Perspectiva, humanismo e grandes mestres.', Crown, `
O que foi o Renascimento? || Movimento dos séculos XIV a XVI que retomou valores **greco-romanos** e o humanismo.
Qual técnica marcou a pintura renascentista? || A **perspectiva**, que cria ilusão de profundidade.
Cite três artistas do Renascimento. || **Leonardo da Vinci**, Michelangelo e Rafael.`],
    ['semana22', 'Semana de Arte Moderna', 'O marco do modernismo nas artes brasileiras.', Palette, `
Quando aconteceu a Semana de Arte Moderna? || Em **fevereiro de 1922**, no Theatro Municipal de São Paulo.
Quem foram artistas plásticos da Semana? || **Anita Malfatti** e Di Cavalcanti, entre outros.
Qual obra de Tarsila do Amaral inspirou a Antropofagia? || **Abaporu** (1928).`],
    ['contemporanea-arte', 'Arte contemporânea', 'Instalações, performances e arte conceitual.', Shapes, `
O que caracteriza a arte contemporânea? || A valorização da **ideia** e do conceito, com novos suportes e participação do público.
O que é uma instalação? || Obra que ocupa e **transforma um espaço**, criando uma experiência para o público.
O que é performance? || Ação artística realizada **ao vivo** pelo artista, usando o corpo como linguagem.`],
    ['linguagens-arte', 'Linguagens artísticas', 'Artes visuais, música, dança e teatro.', Drama, `
Quais são as quatro linguagens artísticas da BNCC? || **Artes visuais**, dança, música e teatro.
O que são elementos visuais? || **Ponto, linha**, forma, cor, textura e volume.
O que é ritmo na música? || A **organização dos sons** e silêncios no tempo.`],
    ['popular', 'Cultura popular brasileira', 'Festas, danças e manifestações tradicionais.', Users, `
O que é o frevo? || Dança e música de **Pernambuco**, ligada ao Carnaval e Patrimônio Imaterial da Humanidade.
O que é o bumba meu boi? || Festa popular que **dramatiza** a morte e ressurreição de um boi, forte no Maranhão.
O que é cultura popular? || Manifestações criadas e transmitidas **pelo povo**, de geração em geração.`],
  ]),

  disc({ id: 'matematica', nome: 'Matemática', curso: 'Matemática - Ensino Médio', area: 'matematica', icone: Calculator, cor: '#f08a24', arte: { img: './flash/p-matematica.webp' } }, [
    ['funcoes', 'Funções', 'Função afim, quadrática, gráficos e aplicações.', TrendingUp, `
Qual é a fórmula da função quadrática? || É dada por **f(x) = ax² + bx + c**, com a ≠ 0. Seu gráfico é uma parábola.
O que é uma função afim? || Função do tipo **f(x) = ax + b**, cujo gráfico é uma reta.
O que indica o coeficiente “a” na função afim? || A **inclinação** da reta: se a > 0, a função é crescente; se a < 0, decrescente.
Como calcular o vértice da parábola? || **xv = −b/2a** e yv = −Δ/4a.
O que indica o sinal de “a” na função quadrática? || Se a > 0, a parábola tem **concavidade para cima**; se a < 0, para baixo.
O que é o discriminante Δ? || **Δ = b² − 4ac**; indica quantas raízes reais a equação do 2º grau possui.
O que é o domínio de uma função? || É o conjunto de **valores de entrada** (x) para os quais a função está definida.
O que é uma função injetora? || Aquela em que **elementos diferentes** do domínio têm imagens diferentes.`],
    ['geometria', 'Geometria Plana', 'Áreas, perímetros, triângulos e círculos.', Shapes, `
Qual é a área do triângulo? || **A = (b × h) / 2**, base vezes altura dividido por dois.
Qual é a área do círculo? || **A = πr²**.
Qual é o comprimento da circunferência? || **C = 2πr**.
O que diz o Teorema de Pitágoras? || Em um triângulo retângulo, **a² = b² + c²** (hipotenusa ao quadrado é igual à soma dos quadrados dos catetos).
Quanto mede a soma dos ângulos internos de um triângulo? || **180°**.
Qual é a área do trapézio? || **A = [(B + b) × h] / 2**.
O que são ângulos complementares? || Dois ângulos cuja soma é **90°**.
Como calcular a soma dos ângulos internos de um polígono? || **S = (n − 2) × 180°**, em que n é o número de lados.`],
    ['equacoes', 'Equações do 1º grau', 'Resolução de equações e problemas.', Sigma, `
O que é uma equação do 1º grau? || Uma igualdade do tipo **ax + b = 0**, com a ≠ 0.
Como resolver 2x + 6 = 14? || 2x = 14 − 6 → 2x = 8 → **x = 4**.
O que significa “isolar a incógnita”? || Deixar o **x sozinho** em um dos lados da igualdade usando operações inversas.
O que é a raiz de uma equação? || O valor que torna a igualdade **verdadeira**.
Como resolver 3(x − 2) = 9? || 3x − 6 = 9 → 3x = 15 → **x = 5**.
O que é um sistema de equações do 1º grau? || Um conjunto de equações com **duas ou mais incógnitas** resolvidas simultaneamente.
Quais métodos resolvem sistemas lineares 2×2? || **Substituição**, adição e comparação.`],
    ['estatistica', 'Estatística', 'Média, moda, mediana e gráficos.', ChartColumn, `
O que é a média aritmética? || A **soma dos valores** dividida pela quantidade de valores.
O que é a moda? || O valor que **mais se repete** em um conjunto de dados.
O que é a mediana? || O **valor central** de um conjunto de dados ordenados.
Qual é a mediana de 3, 7, 9, 12, 15? || **9**, o valor central.
Qual gráfico é ideal para mostrar partes de um todo? || O gráfico de **setores** (pizza).
O que é amplitude? || A diferença entre o **maior e o menor** valor do conjunto.
O que é desvio padrão? || Medida de **dispersão** que indica o quanto os dados se afastam da média.`],
    ['probabilidade', 'Probabilidade', 'Eventos, espaço amostral e cálculos.', Dice5, `
Como calcular a probabilidade de um evento? || **P = casos favoráveis / casos possíveis**.
Qual a probabilidade de sair 6 em um dado? || **1/6**, cerca de 16,7%.
O que é espaço amostral? || O conjunto de **todos os resultados possíveis** de um experimento.`],
    ['progressoes', 'Progressões', 'PA e PG: termos gerais e somas.', TrendingUp, `
O que é uma progressão aritmética (PA)? || Sequência em que cada termo é o anterior **somado a uma razão** constante.
Qual é o termo geral da PA? || **an = a1 + (n − 1) · r**.
O que é uma progressão geométrica (PG)? || Sequência em que cada termo é o anterior **multiplicado por uma razão** constante.`],
  ]),

  disc({ id: 'fisica', nome: 'Física', curso: 'Física - Ensino Médio', area: 'natureza', icone: FlaskConical, cor: '#7c58fa', arte: { emojis: ['rocket', 'planet', 'bulb'] } }, [
    ['cinematica', 'Cinemática', 'Velocidade, aceleração e movimentos.', TrendingUp, `
Como calcular a velocidade média? || **Vm = Δs / Δt**, variação do espaço dividida pela variação do tempo.
O que é o movimento uniforme? || Movimento com **velocidade constante** e aceleração nula.
O que é aceleração? || A **variação da velocidade** em um intervalo de tempo.`],
    ['newton', 'Leis de Newton', 'Inércia, princípio fundamental e ação e reação.', Scale, `
O que diz a 1ª Lei de Newton? || **Inércia**: um corpo tende a manter seu estado de repouso ou movimento retilíneo uniforme.
O que diz a 2ª Lei de Newton? || **F = m · a**: a força resultante é igual à massa vezes a aceleração.
O que diz a 3ª Lei de Newton? || **Ação e reação**: toda ação gera uma reação de mesma intensidade e sentido oposto.`],
    ['energia', 'Energia e trabalho', 'Energia cinética, potencial e conservação.', Zap, `
Qual é a fórmula da energia cinética? || **Ec = m · v² / 2**.
O que é energia potencial gravitacional? || Energia associada à **altura**: Ep = m · g · h.
O que diz o princípio da conservação da energia? || A energia **não se cria nem se perde**, apenas se transforma.`],
    ['termologia', 'Termologia', 'Temperatura, calor e escalas termométricas.', Thermometer, `
Qual a diferença entre calor e temperatura? || **Temperatura** mede a agitação das partículas; **calor** é energia térmica em trânsito.
Como converter Celsius para Fahrenheit? || **F = 1,8 · C + 32**.
Quais são as formas de propagação do calor? || **Condução**, convecção e irradiação.`],
    ['optica', 'Óptica', 'Reflexão, refração e espelhos.', Sun, `
O que é reflexão da luz? || O **retorno da luz** ao meio de origem ao atingir uma superfície.
O que é refração? || A **mudança de velocidade** (e direção) da luz ao passar de um meio para outro.
Por que vemos o arco-íris? || Pela **dispersão** da luz branca nas gotas de água.`],
    ['eletricidade', 'Eletricidade', 'Corrente, tensão, resistência e Lei de Ohm.', Magnet, `
O que diz a Lei de Ohm? || **U = R · i**: a tensão é igual à resistência vezes a corrente.
O que é corrente elétrica? || O **fluxo ordenado** de cargas elétricas em um condutor.
Qual a unidade de resistência elétrica? || O **ohm (Ω)**.`],
  ]),

  disc({ id: 'quimica', nome: 'Química', curso: 'Química - Ensino Médio', area: 'natureza', icone: FlaskConical, cor: '#8b7cf6', arte: { emojis: ['gem', 'bulb', 'sparkles'] } }, [
    ['ligacoes', 'Ligações químicas', 'Ligações iônicas, covalentes e metálicas.', Atom, `
O que são ligações químicas e quais são os principais tipos? || São as uniões entre átomos para formar substâncias. Os principais tipos são **iônica**, **covalente** e **metálica**.
O que é uma ligação iônica? || Ligação por **transferência de elétrons** entre um metal e um ametal, formando íons.
O que é uma ligação covalente? || Ligação por **compartilhamento de elétrons** entre ametais.`],
    ['tabela', 'Tabela periódica', 'Organização, famílias e propriedades.', Shapes, `
Como a tabela periódica é organizada? || Em ordem crescente de **número atômico**, em períodos (linhas) e famílias (colunas).
O que são os gases nobres? || Elementos da **família 18**, muito estáveis e pouco reativos.
O que é eletronegatividade? || A tendência de um átomo **atrair elétrons** em uma ligação.`],
    ['inorganicas', 'Funções inorgânicas', 'Ácidos, bases, sais e óxidos.', FlaskConical, `
O que é um ácido segundo Arrhenius? || Substância que, em água, libera **íons H⁺**.
O que é uma base segundo Arrhenius? || Substância que, em água, libera **íons OH⁻**.
O que forma uma reação de neutralização? || **Sal e água**.`],
    ['estequiometria', 'Estequiometria', 'Mol, massa molar e proporções.', Scale, `
O que é um mol? || Quantidade de matéria que contém **6,02 × 10²³** entidades.
O que é massa molar? || A massa, em gramas, de **1 mol** de uma substância.
O que diz a Lei de Lavoisier? || Em uma reação em sistema fechado, a **massa se conserva**.`],
    ['organica', 'Química orgânica', 'Cadeias carbônicas e funções orgânicas.', Atom, `
O que estuda a química orgânica? || Os compostos do **carbono**.
O que são hidrocarbonetos? || Compostos formados apenas por **carbono e hidrogênio**.
Qual é o grupo funcional dos álcoois? || A **hidroxila (−OH)** ligada a carbono saturado.`],
    ['solucoes', 'Soluções', 'Concentração, soluto e solvente.', Droplets, `
O que é uma solução? || Mistura **homogênea** de soluto e solvente.
Como calcular a concentração comum? || **C = massa do soluto / volume da solução**.
O que é uma solução saturada? || Aquela que contém a **quantidade máxima** de soluto dissolvido.`],
  ]),

  disc({ id: 'biologia', nome: 'Biologia', curso: 'Biologia - Ensino Médio', area: 'natureza', icone: Microscope, cor: '#22a45d', arte: { emojis: ['seedling', 'plant', 'butterfly'] } }, [
    ['citologia', 'Citologia', 'Célula, organelas e membrana plasmática.', Microscope, `
Qual a diferença entre células procariontes e eucariontes? || **Procariontes** não têm núcleo definido; **eucariontes** têm núcleo delimitado por membrana.
Qual a função das mitocôndrias? || Realizar a **respiração celular**, produzindo energia (ATP).
O que é a membrana plasmática? || Envoltório que **controla a entrada e saída** de substâncias da célula.`],
    ['metabolismo', 'Metabolismo energético', 'Respiração celular, fermentação e fotossíntese.', Leaf, `
Qual é a função da respiração celular? || Produzir **energia (ATP)** a partir da quebra da glicose, na presença de oxigênio.
O que é a fotossíntese? || Processo em que plantas usam **luz, água e CO₂** para produzir glicose e liberar oxigênio.
O que é fermentação? || Obtenção de energia **sem oxigênio**, com menor rendimento.`],
    ['genetica', 'Genética', 'Leis de Mendel, DNA e hereditariedade.', Dna, `
O que diz a 1ª Lei de Mendel? || Cada característica é determinada por **dois fatores** que se separam na formação dos gametas.
O que é um gene? || Trecho do **DNA** que contém a informação para uma característica.
Qual a diferença entre genótipo e fenótipo? || **Genótipo** é a constituição genética; **fenótipo** é a característica observável.`],
    ['ecologia', 'Ecologia', 'Cadeias alimentares, relações e ciclos.', Leaf, `
O que é uma cadeia alimentar? || Sequência de seres vivos em que um **serve de alimento** para o outro.
O que são produtores? || Seres que **produzem o próprio alimento**, como as plantas.
O que é mutualismo? || Relação em que **as duas espécies** se beneficiam.`],
    ['evolucao', 'Evolução', 'Darwin, seleção natural e adaptações.', TrendingUp, `
O que é seleção natural? || Os indivíduos **mais adaptados** ao ambiente sobrevivem e se reproduzem mais.
Qual a diferença entre Lamarck e Darwin? || **Lamarck** propôs o uso e desuso; **Darwin** propôs a seleção natural.
O que são órgãos homólogos? || Órgãos com a **mesma origem** embrionária, mas funções diferentes.`],
    ['fisiologia', 'Fisiologia humana', 'Sistemas do corpo humano.', HeartHandshake, `
Qual a função do sistema circulatório? || **Transportar** oxigênio, nutrientes e resíduos pelo corpo.
Onde ocorrem as trocas gasosas? || Nos **alvéolos pulmonares**.
Qual a função dos rins? || **Filtrar o sangue** e produzir a urina.`],
  ]),

  disc({ id: 'historia', nome: 'História', curso: 'História - Ensino Médio', area: 'humanas', icone: Landmark, cor: '#4b55ec', arte: { img: './flash/p-historia.webp' } }, [
    ['republica', 'República no Brasil', 'Proclamação, República Velha e política do café com leite.', Landmark, `
Quais foram as principais causas da Proclamação da República? || A **crise do Império**, a Questão Militar, a Questão Religiosa, a abolição da escravidão e o fortalecimento do movimento republicano.
Quando foi proclamada a República no Brasil? || Em **15 de novembro de 1889**, pelo Marechal Deodoro da Fonseca.
O que foi a política do café com leite? || Alternância no poder entre as oligarquias de **São Paulo** (café) e **Minas Gerais** (leite).
O que foi o coronelismo? || Sistema em que grandes fazendeiros, os **coronéis**, controlavam votos e a política local.
O que era o voto de cabresto? || Prática em que o eleitor era **obrigado a votar** no candidato indicado pelo coronel.
O que foi a Revolta da Vacina (1904)? || Revolta popular no Rio de Janeiro contra a **vacinação obrigatória** contra a varíola.
O que foi a Guerra de Canudos? || Conflito (1896–1897) no sertão da Bahia entre o Exército e a comunidade liderada por **Antônio Conselheiro**.
O que foi o tenentismo? || Movimento de **jovens oficiais** do Exército que contestava as oligarquias nos anos 1920.
O que foi a Política dos Governadores? || Acordo em que o presidente apoiava as oligarquias estaduais em troca de **apoio no Congresso**.
O que pôs fim à República Velha? || A **Revolução de 1930**, que levou Getúlio Vargas ao poder.`],
    ['vargas', 'Era Vargas', 'Governo provisório, Estado Novo e trabalhismo.', Users, `
O que foi a Era Vargas? || Período de **1930 a 1945** em que Getúlio Vargas governou o Brasil.
O que foi o Estado Novo? || Fase **ditatorial** do governo Vargas (1937–1945), com censura e centralização do poder.
O que foi a CLT? || A **Consolidação das Leis do Trabalho** (1943), que reuniu direitos trabalhistas.
O que foi a Revolução Constitucionalista de 1932? || Levante de **São Paulo** exigindo uma nova Constituição.
Qual a importância da CSN na Era Vargas? || A Companhia Siderúrgica Nacional simbolizou a **industrialização** do país.
O que foi o DIP? || O Departamento de Imprensa e Propaganda, responsável pela **censura e propaganda** do governo.
Qual foi a posição do Brasil na Segunda Guerra? || Entrou ao lado dos **Aliados** em 1942 e enviou a FEB à Itália.
Como terminou a Era Vargas? || Com a **deposição de Vargas** pelos militares em 1945.`],
    ['colonia', 'Brasil Colônia', 'Ciclos econômicos e sociedade colonial.', Map, `
Qual foi o primeiro produto explorado no Brasil Colônia? || O **pau-brasil**.
O que foram as capitanias hereditárias? || Divisão do território em faixas entregues a **donatários** para colonização.
Qual foi a base econômica do Nordeste colonial? || A produção de **açúcar** com mão de obra escravizada.`],
    ['industrial', 'Revolução Industrial', 'Máquinas, fábricas e transformações sociais.', Factory, `
Onde começou a Revolução Industrial? || Na **Inglaterra**, no século XVIII.
Qual invenção marcou a 1ª Revolução Industrial? || A **máquina a vapor**.
O que foi o ludismo? || Movimento de trabalhadores que **destruíam máquinas** em protesto.`],
    ['guerras', 'Guerras Mundiais', 'Causas, alianças e consequências.', Swords, `
Qual foi o estopim da Primeira Guerra Mundial? || O assassinato do arquiduque **Francisco Ferdinando**, em 1914.
O que foi a Tríplice Entente? || Aliança entre **França, Reino Unido e Rússia**.
Quando terminou a Segunda Guerra Mundial? || Em **1945**.`],
    ['ditadura', 'Ditadura Militar', 'Golpe de 1964, AI-5 e redemocratização.', Gavel, `
Quando ocorreu o golpe militar no Brasil? || Em **1964**.
O que foi o AI-5? || Ato Institucional de 1968 que **endureceu a repressão** e suspendeu direitos.
O que foi o movimento Diretas Já? || Campanha de 1984 por **eleições diretas** para presidente.`],
  ]),

  disc({ id: 'geografia', nome: 'Geografia', curso: 'Geografia - Ensino Médio', area: 'humanas', icone: Globe, cor: '#3a8be6', arte: { emojis: ['planet', 'airplane', 'herb'] } }, [
    ['biomas', 'Biomas brasileiros', 'Amazônia, Cerrado, Caatinga e outros.', Leaf, `
Quais são os principais biomas do Brasil? || **Amazônia**, Cerrado, Caatinga, Mata Atlântica, Pantanal e Pampa.
Qual é o maior bioma brasileiro? || A **Amazônia**.
Qual bioma é exclusivamente brasileiro? || A **Caatinga**.`],
    ['clima', 'Clima', 'Tipos climáticos e fatores do clima.', Cloud, `
Qual a diferença entre tempo e clima? || **Tempo** é o estado momentâneo da atmosfera; **clima** é o padrão ao longo de anos.
Quais fatores influenciam o clima? || **Latitude**, altitude, massas de ar, maritimidade e continentalidade.
Qual clima predomina no Sertão nordestino? || O **semiárido**.`],
    ['urbanizacao', 'Urbanização', 'Crescimento das cidades e problemas urbanos.', Building2, `
O que é urbanização? || Aumento da **população urbana** em relação à rural.
O que é conurbação? || Quando cidades vizinhas **crescem e se unem**.
O que é êxodo rural? || A **migração do campo** para a cidade.`],
    ['globalizacao', 'Globalização', 'Integração econômica e cultural.', Globe, `
O que é globalização? || Processo de **integração** econômica, cultural e tecnológica entre países.
O que são blocos econômicos? || Acordos entre países para **facilitar o comércio**, como o Mercosul.
O que são empresas transnacionais? || Empresas que atuam em **vários países**.`],
    ['cartografia', 'Cartografia', 'Escalas, projeções e coordenadas.', Compass, `
O que é escala cartográfica? || A relação entre a **medida no mapa** e a medida real.
O que são latitude e longitude? || **Coordenadas** que localizam qualquer ponto da Terra.
O que é a Linha do Equador? || Paralelo que divide a Terra em hemisférios **Norte e Sul**.`],
    ['hidricos', 'Recursos hídricos', 'Bacias hidrográficas e uso da água.', Droplets, `
Qual é a maior bacia hidrográfica do Brasil? || A **Bacia Amazônica**.
O que é um aquífero? || Reservatório de **água subterrânea**.
Qual é o principal aquífero do Brasil? || O **Aquífero Guarani** (e o Alter do Chão, na Amazônia).`],
  ]),

  disc({ id: 'filosofia', nome: 'Filosofia', curso: 'Filosofia - Ensino Médio', area: 'humanas', icone: Brain, cor: '#9b5de5', arte: { emojis: ['bulb', 'books', 'sparkles'] } }, [
    ['antiga', 'Filosofia antiga', 'Pré-socráticos, Sócrates, Platão e Aristóteles.', Landmark, `
O que buscavam os filósofos pré-socráticos? || O **princípio (arché)** que explicaria a origem de todas as coisas.
Qual era o método de Sócrates? || A **maiêutica**: chegar à verdade por meio de perguntas.
O que é o Mito da Caverna? || Alegoria de **Platão** sobre a passagem da ignorância ao conhecimento.`],
    ['etica', 'Ética', 'Moral, valores e teorias éticas.', Scale, `
Qual a diferença entre ética e moral? || **Moral** são as regras de conduta de um grupo; **ética** é a reflexão sobre essas regras.
O que é o imperativo categórico de Kant? || Agir de modo que sua ação **possa ser uma lei universal**.
O que defende o utilitarismo? || A ação correta é a que gera a **maior felicidade** para o maior número.`],
    ['iluminismo', 'Iluminismo', 'Razão, liberdade e crítica ao absolutismo.', Lightbulb, `
O que foi o Iluminismo? || Movimento do século XVIII que defendia a **razão** como guia da sociedade.
Quem defendeu a separação dos três poderes? || **Montesquieu**.
O que é o contrato social para Rousseau? || Acordo em que o povo cria uma sociedade guiada pela **vontade geral**.`],
    ['existencialismo', 'Existencialismo', 'Liberdade, escolha e responsabilidade.', Brain, `
O que afirma o existencialismo? || Que a **existência precede a essência**: o ser humano se define por suas escolhas.
Quem é o principal nome do existencialismo? || **Jean-Paul Sartre**.
O que é “má-fé” para Sartre? || Fugir da própria **liberdade e responsabilidade**.`],
    ['conhecimento', 'Teoria do conhecimento', 'Racionalismo, empirismo e criticismo.', Lightbulb, `
O que defende o racionalismo? || Que o conhecimento vem principalmente da **razão**. Ex.: Descartes.
O que defende o empirismo? || Que o conhecimento vem da **experiência** sensível. Ex.: Locke e Hume.
O que significa “Penso, logo existo”? || A certeza de Descartes de que o **pensamento** prova a própria existência.`],
    ['politica', 'Filosofia política', 'Estado, poder e cidadania.', Gavel, `
Para Hobbes, como seria o estado de natureza? || Uma “**guerra de todos contra todos**”.
O que defendia Maquiavel em “O Príncipe”? || Que o governante deve agir para **manter o poder** e a estabilidade do Estado.
O que é democracia para Aristóteles? || O governo **de muitos**, que pode buscar o bem comum.`],
  ]),

  disc({ id: 'sociologia', nome: 'Sociologia', curso: 'Sociologia - Ensino Médio', area: 'humanas', icone: Users, cor: '#e8743b', arte: { emojis: ['heart', 'house', 'party'] } }, [
    ['classicos', 'Clássicos da Sociologia', 'Durkheim, Weber e Marx.', Users, `
O que é fato social para Durkheim? || Formas de agir e pensar **exteriores e coercitivas** ao indivíduo.
O que é ação social para Weber? || Ação orientada pelo **comportamento dos outros**, com sentido para quem age.
O que é luta de classes para Marx? || O conflito entre **burguesia e proletariado** como motor da história.`],
    ['cultura', 'Cultura e identidade', 'Etnocentrismo, relativismo e diversidade.', Palette, `
O que é etnocentrismo? || Julgar outras culturas a partir da **própria cultura**, considerada superior.
O que é relativismo cultural? || Compreender cada cultura a partir de **seus próprios valores**.
O que é identidade cultural? || O sentimento de **pertencimento** a um grupo e suas tradições.`],
    ['desigualdade', 'Desigualdade social', 'Estratificação e mobilidade social.', Scale, `
O que é estratificação social? || A divisão da sociedade em **camadas** hierarquizadas.
O que é mobilidade social? || A **mudança de posição** de indivíduos ou grupos na estrutura social.
O que mede o índice de Gini? || A **concentração de renda** de um país.`],
    ['trabalho', 'Trabalho', 'Fordismo, toyotismo e novas relações de trabalho.', Factory, `
O que foi o fordismo? || Modelo de **produção em massa** com linha de montagem.
O que é o toyotismo? || Modelo de **produção flexível**, sob demanda (just in time).
O que é uberização do trabalho? || Trabalho por **plataformas digitais**, sem vínculo empregatício.`],
    ['movimentos-sociais', 'Movimentos sociais', 'Organização coletiva e conquistas de direitos.', Megaphone, `
O que são movimentos sociais? || Ações **coletivas organizadas** em defesa de direitos e mudanças sociais.
Cite um movimento social brasileiro. || O **movimento negro**, o feminista e o MST, entre outros.
Qual a importância dos movimentos sociais? || Ampliam a **participação** e conquistam direitos.`],
    ['cidadania', 'Cidadania e direitos', 'Direitos civis, políticos e sociais.', Scroll, `
O que é cidadania? || O exercício de **direitos e deveres** civis, políticos e sociais.
Quais são os direitos civis? || Direitos ligados à **liberdade individual**, como ir e vir e expressão.
Qual Constituição está em vigor no Brasil? || A **Constituição de 1988**, chamada de “Constituição Cidadã”.`],
  ]),
]

/* ---------------- índices ---------------- */
export const DISC: Record<string, Disciplina> = Object.fromEntries(DISCIPLINAS.map((d) => [d.id, d]))
export const TOPICO: Record<string, Topico & { disc: string }> = Object.fromEntries(DISCIPLINAS.flatMap((d) => d.topicos.map((t) => [t.id, { ...t, disc: d.id }])))
export const CARD: Record<string, Card> = Object.fromEntries(DISCIPLINAS.flatMap((d) => d.topicos.flatMap((t) => t.cards.map((c) => [c.id, c]))))

export const MAX_DISCIPLINAS = 5

/** “Hoje” no protótipo: sexta, 30 de outubro de 2026 (igual ao cronograma da referência) */
export const HOJE = new Date(2026, 9, 30, 15, 40).getTime()
export const DIA = 86_400_000

export const DICAS = [
  'Estamos selecionando os conteúdos mais relevantes dos seus cursos e criando perguntas e respostas para ajudar no seu estudo.',
  'Estudar em sessões curtas e frequentes ajuda a memorizar por mais tempo.',
  'Tente responder em voz alta antes de ver a resposta: isso fortalece a memória.',
  'Marque “Revisar depois” nos cards difíceis para voltar a eles no fim do estudo.',
]
