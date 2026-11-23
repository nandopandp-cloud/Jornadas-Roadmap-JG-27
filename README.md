# Planetas · Exploradores

Iniciativa **Planetas** na plataforma do estudante Exploradores (Fundamental I). Os planetas de massinha da plataforma em Next.js ganham um **giro 360° em 3D**: o planeta inteiro (esfera e elementos) gira como um objeto só, no eixo vertical, montado a partir de **4 artes**. O estudante também pode girar com a mão.

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
| 23/11/2026 | Duas abordagens foram descartadas: elementos girando como recortes soltos (voavam e mudavam de proporção) e elementos parados com a esfera girando por baixo (incoerente). O planeta inteiro gira junto. |
| 23/11/2026 | Cada planeta é feito a partir de **4 vistas**: frente (0°), lateral direita (90°), costas (180°) e lateral esquerda (270°). Com só frente e costas, as laterais ficavam borradas. |

---

## Metodologia: como criar um planeta novo

São cinco etapas. As etapas 1 e 2 são do time de arte, e as etapas 3 a 5 levam alguns minutos no código.

```
1. Gerar as 4 vistas  →  2. Recortar  →  3. Configurar  →  4. Medir e gerar  →  5. Conferir
   (arte)                 (fundo)         (1 bloco)          (script)             (vitrine)
```

### 1. Gerar as 4 vistas

O mesmo planeta, girando **no próprio eixo vertical**, visto de 4 lados:

| Vista | Ângulo | O que aparece de frente (no Planeta 01) |
| --- | --- | --- |
| Frente | 0° | Rosto principal (barco, pterossauros, rio) |
| Lateral direita | 90° | O lado que estava à **esquerda** na frente (casa, floresta, cachoeira) |
| Costas | 180° | O lado oposto à frente |
| Lateral esquerda | 270° | O lado que estava à **direita** na frente (polvo, ilha) |

O nome segue o giro, e não a posição na frente: a lateral direita (90°) mostra o lado que, na frente, aparece à esquerda.

**Regras para as artes, pela ordem de importância:**

1. **Câmera na altura do equador e de frente para o planeta**, sem inclinar para cima ou para baixo. O polo de cima fica sempre no topo.
2. **Mesmo planeta, mesmos elementos e mesmas posições.** Cada elemento tem que estar no mesmo lugar do planeta em todas as vistas. Por exemplo, o barco que está um pouco à direita do centro na frente tem que estar perto da borda esquerda na lateral esquerda (270°).
3. **Giro de 90° de verdade.** Na lateral, o que estava no centro da frente fica exatamente na borda. Este é o ponto em que as artes geradas por IA mais erram (ver o Planeta 01 abaixo).
4. **Esfera inteira no quadro**, centralizada, com margem para os elementos que saem dela.
5. **Mesma luz em todas:** de cima, à esquerda da câmera, igual à da frente.
6. **Fundo transparente** (o ideal) ou **liso e escuro**, sem sombra no chão.
7. **Resolução de pelo menos 1024 px.** A frente do Planeta 01 tem só 320 px e é a vista menos nítida.

### 2. Recortar

As vistas com fundo transparente entram como estão. Para fundo liso (como o preto das laterais do Planeta 01), o recorte separa o fundo, que é a área escura ligada às bordas da imagem. Depois tira 1 px de franja e suaviza a borda. As imagens ficam em `public/planetas/<id>-<vista>.png`.

### 3. Configurar

Um bloco em `PLANETAS`, no início de [`scripts/planetas/preparar-planeta.py`](scripts/planetas/preparar-planeta.py):

```python
'planeta-02': {
    'vistas': [
        ('frente',   'public/planetas/planeta-02.png',          0,   None),
        ('direita',  'public/planetas/planeta-02-direita.png',  90,  None),
        ('costas',   'public/planetas/planeta-02-costas.png',   180, None),
        ('esquerda', 'public/planetas/planeta-02-esquerda.png', 270, None),
    ],
    'tamanho_max': 1024,
},
```

O último campo de cada vista é a esfera (centro e raio, em px). Com `None`, o script mede sozinho.

### 4. Medir e gerar

```bash
python scripts/planetas/preparar-planeta.py planeta-02 --medir-angulos   # confere os ângulos
python scripts/planetas/preparar-planeta.py planeta-02                   # gera tudo
```

**`--medir-angulos`** projeta cada lateral sobre a esfera em vários ângulos e mostra onde ela coincide melhor com a frente e com as costas. Se der perto de 90° e 270°, as artes estão boas. Se der bem menos (no Planeta 01 deu 25° e −75°), a lateral foi gerada "pouco girada", e vale pedir a arte de novo. Se não for possível, mantenha 90° e 270°: nos testes, isso deixa a volta mais nítida do que usar o ângulo medido.

**O que o script faz, nesta ordem:**

1. **Mede a esfera** de cada vista: o círculo que melhor encosta na parte lisa da silhueta. Os elementos que saem dela são ignorados.
2. **Separa a luz pintada.** Usa o oceano (a mesma massinha em toda parte) para medir como a luz varia na imagem. Tira dela só a parte horizontal, que mudaria de lugar ao girar. A parte vertical fica, porque no giro vertical cada ponto continua sempre na mesma altura.
3. **Equilibra o brilho** do oceano de cada vista com o da frente. Ajusta só o brilho, sem mexer no tom de cor.
4. **Mede o relevo:** a silhueta de cada vista diz o quanto os elementos saem da esfera em cada direção. Ela vira um "relevo inflado" no plano perpendicular àquela vista, com espessura arredondada.
5. **Grava** as vistas em WebP, o `perfil.png` (uma linha de relevo por vista) e o JSON do planeta.

### 5. Conferir

Inclua o planeta em `PLANETAS` (`src/prototypes/planetas/index.tsx`) e gire na vitrine, com atenção a três pontos:

- **0°, 90°, 180° e 270°** têm que ser exatamente as 4 artes;
- **os ângulos intermediários** (45°, 135°…) são onde uma vista dá lugar à outra; elementos que "pulam" de lugar indicam vistas desalinhadas (regra 2 ou 3 acima);
- **cores e brilho** têm que ser parecidos nas 4 artes.

---

## Como o componente desenha o planeta

O planeta é um objeto 3D único, desenhado em WebGL2.

1. **Geometria:** uma esfera, mais o relevo inflado de cada vista.
   - Para cada pixel, o shader procura onde o raio da câmera encosta nesse objeto (*ray marching*, 72 passos e refinamento).
2. **Cor:** cada ponto pega a cor das **duas vistas vizinhas** do ângulo atual, só as que enxergam aquele ponto.
   - No ângulo de cada vista, o planeta é exatamente aquela arte. A 0°, a diferença média para a arte da frente é de 4,9 em 255, só nas bordas.
   - A troca de uma vista para a outra é rápida, no meio do caminho (24% do intervalo).
   - Nos elementos, a troca usa a união das formas, sem fantasma semitransparente.
3. **Luz:** a parte horizontal da luz volta, parada na tela, para a superfície passar por baixo de uma luz fixa.
4. **Onde a arte viu de raspão** (perto da borda dela), o shader usa uma versão mais suave da textura, em vez de listras.
5. **Desempenho:**
   - resolução até 1,75×;
   - o giro para fora da tela;
   - se os quadros passarem de 30 ms, a resolução cai sozinha até 0,6×;
   - a velocidade não depende da taxa de quadros.

### Girar com a mão

- **Arrastar** (mouse ou dedo) na horizontal gira o planeta: a superfície acompanha o dedo.
- **Ao soltar**, o planeta segue com o embalo e volta ao giro normal **no sentido em que foi jogado**. Soltar parado não dá embalo.
- **Teclado:** Tab até o planeta e setas ← →. O planeta tem rótulo de acessibilidade com a instrução.
- **Celular:** deslizar na vertical continua rolando a página.
- **Pausado:** o giro automático para, mas a mão continua funcionando.

### Acessibilidade e fallback

- Com **“reduzir movimento”** ligado, o planeta não gira sozinho, mas gira com a mão.
- **Sem WebGL2**, aparece a arte da frente parada.
- A arte da frente também aparece enquanto as imagens carregam e troca sem salto pelo 3D.

## O Planeta 01

| Vista | Arquivo de origem | Tamanho | Ângulo usado | Ângulo medido |
| --- | --- | --- | --- | --- |
| Frente | `Planeta=Mitologia.png` | 320 px | 0° | — |
| Lateral direita | `Planeta Mágico em Perfil.png` | 1254 px (fundo preto, recortado) | 90° | ≈ 25° |
| Costas | `Planeta de Argila com Floresta e Oceano.png` | 1254 px | 180° | — |
| Lateral esquerda | `Planeta Miniatura Fantástico em Estilo Clay.png` | 1254 px (fundo preto, recortado) | 270° | ≈ −75° |

**Limites que vêm das artes:**

- As laterais estão menos giradas do que deveriam. Na lateral esquerda há árvores do lado direito que as costas não mostram.
- Por isso, nas trocas entre vistas (perto de 45°, 135°, 225° e 315°) alguns elementos mudam um pouco de forma ou de lugar.
- Laterais refeitas com as regras 2 e 3 deixam essas trocas quase imperceptíveis.
- A frente em 1024 px deixa o 0° tão nítido quanto as outras vistas.

**A pasta “🪐 Planetas”** (os elementos isolados) não foi usada. Ela é uma versão "kit" do mesmo planeta: as posições mudam em relação às 4 vistas e não há a luz da esfera.

Ela abriria outra metodologia: **montar o planeta** com uma bola lisa e os elementos posicionados nela, como adesivos com relevo. As vantagens seriam um giro sempre coerente e nítido em todos os ângulos, sem depender de 4 artes alinhadas. A desvantagem: os elementos que saem da esfera (casa, polvo) ficariam mais "achatados" de perfil. Vale testar se a geração de vistas alinhadas for difícil.

## Vitrine

| Aba | Atalho (`?screen=`) | O que mostra |
| --- | --- | --- |
| Giro | `giro` / `claro` | Planeta no palco espacial ou em fundo claro, com instrução de giro com a mão, sentido do giro, luz fixa, flutuar, halo e sombra, e pausa. |
| Tamanhos | `tamanhos` | O mesmo planeta em 96, 160 e 260 px, começando a 270°, 90° e 0° (três das artes). |
| Next.js | `nextjs` | Passo a passo, código para copiar e tabela de props. |

## Como levar para o Next.js

1. Copie para `components/planetas/`:
   - [`PlanetaGirando.tsx`](src/prototypes/planetas/PlanetaGirando.tsx), que já começa com `'use client'` e não tem dependências;
   - [`planeta-girando.module.css`](src/prototypes/planetas/planeta-girando.module.css);
   - [`planeta-01.json`](src/prototypes/planetas/planeta-01.json).
2. Copie para `public/planetas/`:
   - `planeta-01.png` (arte da frente, de reserva);
   - `planeta-01/`, com `frente.webp`, `direita.webp`, `costas.webp`, `esquerda.webp` e `perfil.png` (cerca de 300 KB no total).
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
| `inicio` | `0` | Ângulo inicial (graus): 0, 90, 180 e 270 são as 4 artes |
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
| `public/planetas/planeta-01*.png` | As 4 artes de origem (frente, direita, costas, esquerda) |
| `public/planetas/planeta-01/` | Vistas preparadas e perfil do relevo (gerados) |
| `scripts/planetas/preparar-planeta.py` | Gerador: mede esfera e ângulos, prepara vistas, relevo e JSON |

## Verificação

Teste automatizado em Chromium (WebGL2 por SwiftShader), com 18 verificações, todas OK em três rodadas seguidas.

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

**Comparação a 0°:** o 3D foi comparado pixel a pixel com a arte da frente (diferença de 4,9 em 255). Também foram conferidos 12 ângulos, de 30° em 30°, comparando três posições para as laterais (35°/−80°, 60°/−85° e 90°/270°).

**Desempenho:** a velocidade continua exata mesmo com quadros lentos (testado com o renderizador sem GPU, a 83 ms por quadro).

## Próximos passos

- **Refazer as laterais** com as regras 2 e 3 e conferir com `--medir-angulos` (≈ 90° e 270°).
- **Frente em 1024 px.**
- **Demais planetas**, seguindo a metodologia.
