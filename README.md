# Planetas · Exploradores

Iniciativa **Planetas** na plataforma do estudante Exploradores (Fundamental I). Os novos planetas de massinha que entraram na plataforma em Next.js ganham um **giro 360° em 3D**: giram como um globo, no eixo vertical, sem alterar a arte. O estudante também pode girar o planeta com a mão.

> Esta branch guarda a iniciativa Planetas. A plataforma completa e a lista de todas as jornadas ficam no README da `main`.

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
| 23/11/2026 | Os elementos que saem da esfera (casa, caverna, polvo, ilha) ficam **parados**, com as proporções da arte. Só a esfera gira. Com uma arte só de frente, fazer esses elementos darem a volta distorce as proporções. |
| 23/11/2026 | **Uma velocidade só:** uma volta a cada 40 s. Não há opção de acelerar. |
| 23/11/2026 | O estudante pode **girar com a mão** para qualquer lado. |

## Como o giro funciona

1. **Esfera em WebGL2.** A arte de frente vira uma textura 360° (mapa equiretangular). Um shader projeta essa textura numa esfera que gira no eixo vertical.
   - No ângulo 0 o planeta fica **igual à arte**: a faixa central (±45°) é a arte exata, e só perto da borda o mapeamento aperta.
2. **A luz da arte fica no lugar.** A foto já vem iluminada: alto à esquerda claro, borda direita escura.
   - O script mede essa luz no oceano, que é da mesma massinha em toda parte, e tira da textura a parte que mudaria de lugar com o giro.
   - O shader devolve essa luz parada na tela. Girando, a superfície passa por baixo de uma luz fixa, como num globo de verdade, sem faixas escuras rodando junto.
3. **Elementos parados.** Casa, caverna, polvo e ilha ficam numa camada por cima (`elementos.png`), recortada da arte na posição original, com borda macia.
4. **Lugar dos elementos na esfera.** O lugar que eles ocupavam na esfera foi preenchido para passar despercebido quando gira:
   - na água, com o azul em volta;
   - embaixo da casa, com relevo de árvores clonado do mato vizinho, com emenda Poisson.
5. **Flutuação, halo e sombra de contato**, como antes.

### Girar com a mão

- **Arrastar** (mouse ou dedo) na horizontal gira o planeta: a superfície acompanha o dedo.
- **Ao soltar**, o planeta segue com o embalo, desacelera como um globo e volta ao giro normal **no sentido em que foi jogado**. Soltar parado não dá embalo.
- **Teclado:** Tab até o planeta e setas ← →. O planeta tem rótulo de acessibilidade com a instrução.
- **Celular:** deslizar na vertical continua rolando a página, mesmo começando em cima do planeta (`touch-action: pan-y`).
- **Pausado:** o giro automático para, mas a mão continua funcionando.

### Acessibilidade e fallback

- Com **“reduzir movimento”** ligado, o planeta não gira sozinho, mas dá para girar com a mão, porque é um movimento iniciado pela pessoa.
- **Sem WebGL2**, aparece a arte original parada.
- A arte original também aparece enquanto a textura carrega e troca sem salto pelo 3D, que começa idêntico a ela.

### O lado de trás

A arte recebida mostra só a frente. O lado de trás é o **espelho da frente**, o que deixa a emenda invisível. O barco foi tirado da metade espelhada, para não aparecerem dois barcos frente a frente. A água do lado de trás teve as manchas de claro e escuro uniformizadas, mantendo o granulado da massinha.

Se o time de arte tiver uma **vista de trás**, o script já aceita (`costas`) e o lado de trás passa a ser único.

## Vitrine

| Aba | Atalho (`?screen=`) | O que mostra |
| --- | --- | --- |
| Giro | `giro` / `claro` | Planeta no palco espacial ou em fundo claro. Instrução de giro com a mão, sentido (superfície para a direita ou para a esquerda, que se atualiza quando o planeta é jogado para o outro lado), luz fixa, flutuar, halo e sombra, e pausa. |
| Tamanhos | `tamanhos` | O mesmo planeta em 96, 160 e 260 px, cada um começando num ângulo diferente. Todos giram com a mão. |
| Next.js | `nextjs` | Passo a passo, código para copiar e tabela de props. |

## Como levar para o Next.js

1. Copie para `components/planetas/`:
   - [`PlanetaGirando.tsx`](src/prototypes/planetas/PlanetaGirando.tsx), que já começa com `'use client'` e não tem dependências;
   - [`planeta-girando.module.css`](src/prototypes/planetas/planeta-girando.module.css);
   - [`planeta-01.json`](src/prototypes/planetas/planeta-01.json).
2. Copie a arte e a pasta gerada para `public/planetas/`:
   - `planeta-01.png`;
   - `planeta-01/`, com `textura.jpg` e `elementos.png`.
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
| `inicio` | `0` | Ângulo inicial (graus); 0 é igual à arte |
| `luz` · `flutuar` · `sombra` | `true` | Liga e desliga cada camada |
| `halo` | `'92, 196, 255'` | Cor do brilho atrás (r, g, b) ou `false` |

A velocidade é fixa: uma volta a cada 40 s (`SEGUNDOS_POR_VOLTA`, exportada pelo componente).

**Desempenho:**

- 1 desenho de WebGL por quadro;
- os elementos são uma imagem parada;
- o giro para sozinho quando o planeta sai da tela;
- a textura tem cerca de 80 KB e a camada de elementos, cerca de 135 KB.

## Planeta novo

[`scripts/planetas/preparar-planeta.py`](scripts/planetas/preparar-planeta.py) gera tudo a partir da arte de frente. Ele precisa de `opencv-python-headless` e `numpy`.

```bash
python scripts/planetas/preparar-planeta.py planeta-01
```

No bloco do planeta, informe:

| Campo | O que é |
| --- | --- |
| `centro` e `raio` | Centro e raio da esfera, em px da arte. O centro da esfera não é o centro do PNG, por causa dos elementos que saem da silhueta. No Planeta 01: centro (155, 167) e raio 128,5 numa arte de 320 px. |
| `elementos` | Caixa de cada elemento que sai da esfera, tipo de recorte e como preencher o lugar dele (`'agua'` ou `('clonar', dx, dy)`) |
| `so_na_frente` | Elipses de objetos que não devem se repetir no espelho de trás (opcional) |
| `costas` | Vista de trás do planeta (opcional) |

O script gera:

- a textura 360°;
- a camada de elementos;
- o JSON com a luz medida na arte.

## Arquivos

| Arquivo | O que é |
| --- | --- |
| `src/prototypes/planetas/PlanetaGirando.tsx` | Componente (vai para o Next.js) |
| `src/prototypes/planetas/planeta-girando.module.css` | Camadas do componente (flutuação, halo, sombra, foco, cursor) |
| `src/prototypes/planetas/planeta-01.json` | Dados do Planeta 01 (gerado) |
| `src/prototypes/planetas/index.tsx` | Vitrine na plataforma (abas, controles, handoff) |
| `src/prototypes/planetas/vitrine.css` | Visual da vitrine (Yunara · tema Seafoam) |
| `public/planetas/planeta-01.png` | Arte original (320 × 320, fundo transparente) |
| `public/planetas/planeta-01/` | Textura 360° e camada de elementos (gerados) |
| `scripts/planetas/preparar-planeta.py` | Gerador da textura, da camada de elementos e do JSON |

## Verificação

Teste automatizado em Chromium (WebGL2 por SwiftShader), com 18 verificações, todas OK em duas rodadas.

- **Giro:**
  - gira sozinho para a direita, a uma volta a cada 40 s;
  - não há opções de velocidade;
  - o mouse em cima não acelera;
  - os elementos ficam parados.
- **Mão:**
  - arrastar acompanha o mouse (dx ÷ raio);
  - soltar parado não dá embalo;
  - pausado, a mão continua funcionando;
  - um arremesso para a esquerda inverte o sentido (o controle da vitrine acompanha), desacelera e segue no giro normal.
- **Teclado:** as setas giram, e o rótulo do planeta tem a instrução.
- **Vitrine:** os 3 tamanhos, o código sem corte e nenhum erro no console.
- **Acessibilidade e fallback:** com “reduzir movimento”, o planeta não gira sozinho, mas gira com a mão; sem WebGL2, aparece a arte original.

**Toque (celular, 390 px):**

- deslizar na horizontal gira;
- deslizar na vertical rola a página, também a partir do planeta;
- não há rolagem horizontal.

Também foram conferidas as capturas do giro em 8 ângulos (de 45° em 45°, arrastando).

## Próximos passos

- **Arte em 2× e vista de trás:** a arte recebida tem 320 × 320. Uma versão de 640 px ou mais deixa a textura mais nítida em telas retina. Uma vista de trás deixa o lado oculto único.
- **Demais planetas:** rodar o script para cada arte nova e incluir em `PLANETAS` (`index.tsx`).
