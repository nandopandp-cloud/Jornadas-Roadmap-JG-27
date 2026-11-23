# Planetas · Exploradores

Iniciativa **Planetas** na plataforma do estudante Exploradores (Fundamental I). Os planetas de massinha da plataforma em Next.js ganham um **giro 360° em 3D**: o planeta inteiro (esfera e elementos) é um objeto só, que gira no eixo vertical sem nunca mudar de forma. Ele é montado a partir de um **storyboard do giro**. O estudante também pode girar com a mão.

> Esta branch guarda a iniciativa Planetas e a **metodologia para criar novos planetas**. A plataforma completa e a lista de todas as jornadas ficam no README da `main`.

## Links

| O quê | Onde |
| --- | --- |
| Vitrine (link público) | https://jornadas-roadmap-jg-27.vercel.app/#/p/planetas |
| Página da iniciativa na plataforma | https://jornadas-roadmap-jg-27.vercel.app/#/jornada/planetas |
| Handoff para o Next.js | https://jornadas-roadmap-jg-27.vercel.app/#/p/planetas?screen=nextjs |

## Decisões

| Data | Decisão |
| --- | --- |
| 23/11/2026 | O giro é 3D, **no eixo vertical**, como um globo. Rotação no plano (como uma roda) foi descartada. |
| 23/11/2026 | **Uma velocidade só:** uma volta a cada 40 s. Não há opção de acelerar. |
| 23/11/2026 | O estudante pode **girar com a mão**. |
| 23/11/2026 | Recortes soltos (voavam) e elementos parados com a esfera girando (incoerente) foram descartados. O planeta inteiro gira junto. |
| 23/11/2026 | **Os elementos nunca mudam de tamanho, forma ou proporção durante o giro.** Eles só giram, aparecem e somem. Trocar de imagem a cada ângulo (4 vistas ou quadros do storyboard) foi descartado, porque cada imagem gerada desenha os elementos um pouco diferente e o planeta parecia "vivo". |
| 23/11/2026 | O planeta é um **modelo único** (textura 360° e relevo 360°), montado uma vez a partir de um **storyboard do giro**. |

---

## Metodologia: como criar um planeta novo

```
1. Storyboard do giro  →  2. Ordem  →  3. Gerar o modelo  →  4. Conferir
   (arte)                   (1 lista)    (script)             (vitrine)
```

### 1. Storyboard do giro

Uma imagem com o planeta girando no próprio eixo vertical, de 15° em 15° (24 quadros), com **fundo transparente**, quadros lado a lado e etiquetas embaixo (o script ignora as etiquetas). Vale o mesmo cuidado das regras abaixo.

**O ponto mais importante: os quadros têm que ser coerentes entre si.** Cada elemento precisa ter o mesmo tamanho, a mesma forma e o mesmo lugar no planeta em todos os quadros. Imagens geradas por IA quase nunca garantem isso.

O jeito de ter coerência total é **fazer o planeta em 3D uma vez**, com um gerador de imagem para 3D (Meshy, Tripo, Rodin, Hunyuan3D) ou no Blender, a partir da arte de frente, e **renderizar o giro** (turntable) dele. Com um storyboard assim, o modelo sai perfeito e nítido em todos os ângulos. Com quadros gerados por IA, o modelo sai coerente, mas cada elemento fica com a "média" das versões, um pouco menos nítido.

Regras para os quadros:

1. Câmera na altura do equador, sem inclinar; o polo de cima sempre no topo.
2. Giro constante entre os quadros, sempre no mesmo sentido.
3. Esfera inteira no quadro, centralizada, do mesmo tamanho em todos.
4. Mesma luz em todos (de cima, à esquerda da câmera).
5. O maior tamanho possível: os quadros do Planeta 01 têm só ~170 px e precisaram de ampliação por IA.

### 2. Ordem

```bash
python scripts/planetas/preparar-planeta.py planeta-02 --quadros
```

Esse comando separa os quadros e grava uma folha numerada em `scripts/planetas/.quadros-planeta-02.png`. Confira se a ordem segue o giro. No Planeta 01, os quadros 7 a 14 vieram fora de ordem: 9 a 14 invertidos e 7–8 antes da hora. Escreva a ordem certa no bloco do planeta:

```python
'planeta-02': {
    'storyboard': 'public/planetas/planeta-02-storyboard.png',
    'ordem': [0, 1, 2, ...],
    'chave': [...],        # quadros-chave da cor (ver abaixo)
    'relevo': 0.8,
},
```

### 3. Gerar o modelo

```bash
python scripts/planetas/preparar-planeta.py planeta-02
```

O script faz, nesta ordem:

1. **Amplia** os quadros pequenos 4× com Real-ESRGAN (`pip install realesrgan-ncnn-py`; sem ele, usa bicúbico). Amplia também o contorno, para a borda sair nítida.
2. **Normaliza:** mede a esfera em cada quadro e põe todos com o mesmo centro e raio.
3. **Mede o giro real** entre cada quadro e o seguinte, comparando as projeções na esfera, e fecha a volta em 360°. A soma perto de 360° confirma a ordem. Ele também descarta quadros repetidos (menos de 4° do anterior) e avisa onde dois vizinhos diferem muito.
4. **Separa a luz pintada:** mede a luz no oceano de todos os quadros, tira a parte horizontal (que mudaria de lugar ao girar) e equilibra o brilho entre os quadros.
5. **Monta o relevo:** a silhueta de cada quadro dá a altura dos elementos em dois meridianos (as duas bordas). Com 19 quadros são 38 meridianos, e entre eles a altura é interpolada.
6. **Monta a textura 360°:** cada região do planeta vem **inteira de um único quadro-chave**, o que a vê mais de frente, sem misturar quadros. Misturar borra, porque cada quadro desenha o elemento de um jeito. Os quadros-chave (`chave`) são escolhidos para que cada elemento fique no centro de um deles; no Planeta 01, a casa vem do q03, o barco do q18, a ilha e o polvo do q16 e a floresta do q06.
7. **Grava** `textura.webp`, `relevo.png` e `frente.webp` (o primeiro quadro, como reserva) em `public/planetas/<id>/`, e o JSON em `src/prototypes/planetas/<id>.json`.

### 4. Conferir

Inclua o planeta em `PLANETAS` (`src/prototypes/planetas/index.tsx`) e gire na vitrine. Os elementos têm que só girar, sem mudar. Se algum aparecer em dobro, é porque os quadros o desenham em lugares diferentes do planeta (no Planeta 01, a cachoeira aparece em −60° nos quadros da frente e em −140° nos de trás). A solução é corrigir o storyboard ou ajustar os quadros-chave.

---

## Como o componente desenha o planeta

1. **Modelo fixo:** uma textura 360° e um relevo 360°. O planeta é sempre o mesmo objeto, só que girado.
2. **Desenho:** para cada pixel, o shader (WebGL2) procura onde o raio da câmera encosta na esfera com relevo (*ray marching*, 56 passos e refinamento) e pega a cor da textura naquele ponto.
3. **Volume:** o relevo recebe sombra da luz fixa, e a parte horizontal da luz pintada volta parada na tela.
4. **Desempenho:** um desenho por quadro, com duas imagens (cerca de 250 KB no total).
   - No renderizador sem placa de vídeo do teste, cada quadro leva 17 ms.
   - Se o aparelho ficar lento, a resolução cai sozinha.
   - A velocidade não depende da taxa de quadros.

### Girar com a mão

- **Arrastar** (mouse ou dedo) na horizontal gira o planeta. Ao soltar, ele segue com o embalo e volta ao giro normal no sentido em que foi jogado. Soltar parado não dá embalo.
- **Teclado:** Tab até o planeta e setas ← →.
- **Celular:** deslizar na vertical continua rolando a página.
- **Pausado:** a mão continua funcionando.
- **“Reduzir movimento”:** o planeta não gira sozinho, mas gira com a mão.
- **Sem WebGL2:** aparece o primeiro quadro parado.

## O Planeta 01

- **Fonte:** `Storyboard de Rotação de Mini-Mundo Colorido.png`, 22 quadros de ~170 px, ampliados 4×.
- **Ordem corrigida:** 0–6, 14, 13, 12, 11, 10, 9, 8, 7, 15–21. A soma dos giros medidos dá 358°.
- **Repetidos descartados:** q10, q15 e q21. Ficaram **19 quadros**.
- **Quadros-chave da cor:** q00, q03, q06, q13, q11, q08, q16 e q18.
- **Limites que vêm do storyboard:** a cachoeira está em dois lugares; o lado do polvo tem floresta que as costas não mostram; e os elementos são um pouco menos nítidos que nos quadros, porque o modelo junta várias versões deles. Um storyboard renderizado de um modelo 3D resolve os três.
- **Abordagens anteriores** (as 4 vistas, a troca de quadros) ficam no histórico da branch.

## Vitrine

| Aba | Atalho (`?screen=`) | O que mostra |
| --- | --- | --- |
| Giro | `giro` / `claro` | Planeta no palco espacial ou em fundo claro, com instrução de giro com a mão, sentido do giro, luz fixa, flutuar, halo e sombra, e pausa. |
| Tamanhos | `tamanhos` | O mesmo planeta em 96, 160 e 260 px, começando de lados diferentes (polvo, casa e frente). |
| Next.js | `nextjs` | Passo a passo, código para copiar e tabela de props. |

## Como levar para o Next.js

1. Copie para `components/planetas/`:
   - [`PlanetaGirando.tsx`](src/prototypes/planetas/PlanetaGirando.tsx), que já começa com `'use client'` e não tem dependências;
   - [`planeta-girando.module.css`](src/prototypes/planetas/planeta-girando.module.css);
   - [`planeta-01.json`](src/prototypes/planetas/planeta-01.json).
2. Copie para `public/planetas/`:
   - `planeta-01/`, com `textura.webp`, `relevo.png` e `frente.webp` (cerca de 300 KB no total).
3. Use:

```tsx
import { PlanetaGirando } from '@/components/planetas/PlanetaGirando'
import planeta01 from '@/components/planetas/planeta-01.json'

<PlanetaGirando planeta={planeta01} tamanho={240} alt="Planeta da trilha" />
```

| Prop | Padrão | O que faz |
| --- | --- | --- |
| `planeta` | — | Dados do planeta (JSON gerado pelo script) |
| `base` | `'/'` | Prefixo dos arquivos em `public/` |
| `alt` | `''` | Texto alternativo; com ele, o rótulo inclui “Arraste ou use as setas para girar” |
| `tamanho` | `240` | Largura e altura (px ou medida CSS) |
| `sentido` | `'direita'` | Para onde a superfície da frente corre (`'direita'` ou `'esquerda'`) |
| `onSentidoChange` | — | Avisa quando a pessoa joga o planeta para o outro lado |
| `pausado` | `false` | Para o giro automático, freando suave (a mão continua) |
| `arrastavel` | `true` | Girar com a mão e com as setas |
| `inicio` | `0` | Ângulo inicial (graus); 0 = a frente |
| `luz` · `flutuar` · `sombra` | `true` | Liga e desliga cada camada |
| `halo` | `'92, 196, 255'` | Cor do brilho atrás (r, g, b) ou `false` |

A velocidade é fixa: uma volta a cada 40 s (`SEGUNDOS_POR_VOLTA`, exportada pelo componente).

## Arquivos

| Arquivo | O que é |
| --- | --- |
| `src/prototypes/planetas/PlanetaGirando.tsx` | Componente (vai para o Next.js) |
| `src/prototypes/planetas/planeta-girando.module.css` | Camadas do componente (flutuação, halo, sombra, foco, cursor) |
| `src/prototypes/planetas/planeta-01.json` | Dados do Planeta 01 (gerado) |
| `src/prototypes/planetas/index.tsx` | Vitrine na plataforma (abas, controles, handoff) |
| `src/prototypes/planetas/vitrine.css` | Visual da vitrine (Yunara · tema Seafoam) |
| `public/planetas/planeta-01-storyboard.png` | Storyboard de origem |
| `public/planetas/planeta-01/` | Textura 360°, relevo 360° e primeiro quadro (gerados) |
| `scripts/planetas/preparar-planeta.py` | Gerador: separa, ordena, amplia e mede os quadros e monta o modelo |

## Verificação

Teste automatizado em Chromium (WebGL2 por SwiftShader), com 18 verificações, todas OK.

- **Giro:**
  - uma volta a cada 40 s;
  - não há opções de velocidade;
  - o mouse em cima não acelera;
  - o planeta inteiro fica no 3D.
- **Mão:**
  - arrastar acompanha o mouse;
  - soltar parado não dá embalo;
  - pausado, a mão continua funcionando;
  - um arremesso inverte o sentido e segue no giro normal.
- **Teclado:** as setas giram.
- **Vitrine:** os 3 tamanhos, o código sem corte e nenhum erro no console.
- **Acessibilidade e fallback:** “reduzir movimento” e o navegador sem WebGL2.

**Toque (celular):** a horizontal gira, a vertical rola a página e não há rolagem lateral.

**Giro completo:** conferido em 24 ângulos, de 15° em 15°.

## Próximos passos

- **Storyboard renderizado de um modelo 3D** (ver a metodologia, etapa 1) para o Planeta 01 ficar 10/10.
- **Demais planetas**, seguindo a metodologia.
