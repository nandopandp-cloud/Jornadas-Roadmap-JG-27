# Planetas · Exploradores

Iniciativa **Planetas** na plataforma do estudante Exploradores (Fundamental I). Os novos planetas de massinha que entraram na plataforma em Next.js ganham um **giro 360° em 3D**: giram como um globo, no eixo vertical, sem alterar a arte.

> Esta branch guarda a iniciativa Planetas. A plataforma completa e a lista de todas as jornadas ficam no README da `main`.

## Links

| O quê | Onde |
| --- | --- |
| Vitrine (link público) | https://jornadas-roadmap-jg-27.vercel.app/#/p/planetas |
| Página da iniciativa na plataforma | https://jornadas-roadmap-jg-27.vercel.app/#/jornada/planetas |
| Handoff para o Next.js | https://jornadas-roadmap-jg-27.vercel.app/#/p/planetas?screen=nextjs |

## Como o giro funciona

A superfície corre na horizontal. O que está na frente vai para trás e volta pelo outro lado.

1. **Esfera em WebGL2.** A arte de frente vira uma textura 360° (mapa equiretangular). Um shader projeta essa textura numa esfera que gira no eixo vertical e calcula a luz por pixel: a luz fica parada (no alto, à esquerda) enquanto a superfície passa por baixo.
2. **Peças que saem da silhueta.** A casa, a caverna com a lava, o polvo e a ilha com os livros foram recortados da arte. Cada peça fica presa a um ponto da superfície e, a cada quadro:
   - acompanha esse ponto;
   - gira junto com a normal da esfera;
   - encurta quando fica de frente para a câmera;
   - escurece do lado da sombra;
   - passa para trás da esfera.
3. **Flutuação, halo e sombra de contato** completam o efeito, como antes.
4. **Fallback.** Com “reduzir movimento” ligado ou sem WebGL2, aparece a arte original parada. A arte original também aparece enquanto a textura carrega e depois troca suavemente pelo 3D.

### O lado de trás

A arte recebida mostra só a frente do planeta. O lado de trás é o **espelho da frente**, o que deixa a emenda invisível. Para nada parecer repetido de forma óbvia:

- as 4 peças aparecem uma vez só;
- o barco foi tirado da metade espelhada.

Árvores, rio e pterossauros se repetem espelhados, o que fica natural na massinha.

Se o time de arte tiver uma **vista de trás** do planeta, o script já aceita (`costas`) e o lado de trás passa a ser único.

## Vitrine

| Aba | Atalho (`?screen=`) | O que mostra |
| --- | --- | --- |
| Giro | `giro` / `claro` | Planeta no palco espacial ou em fundo claro. Controles de velocidade (40, 24 e 12 s por volta), sentido (superfície para a direita ou para a esquerda), luz fixa, flutuar, halo e sombra, e pausa. Passar o mouse acelera o giro. |
| Tamanhos | `tamanhos` | O mesmo planeta em 96, 160 e 260 px, cada um começando num ângulo diferente. |
| Next.js | `nextjs` | Passo a passo, código para copiar e tabela de props. |

Velocidade, sentido e pausa mudam sempre com transição: o planeta freia, acelera e inverte sem pular.

## Como levar para o Next.js

1. Copie para `components/planetas/`:
   - [`PlanetaGirando.tsx`](src/prototypes/planetas/PlanetaGirando.tsx), que já começa com `'use client'` e não tem dependências;
   - [`planeta-girando.module.css`](src/prototypes/planetas/planeta-girando.module.css);
   - [`planeta-01.json`](src/prototypes/planetas/planeta-01.json).
2. Copie a arte e a pasta gerada para `public/planetas/`:
   - `planeta-01.png`;
   - `planeta-01/`, com `textura.jpg`, `casa.png`, `caverna.png`, `polvo.png` e `ilha.png`.
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
| `alt` | `''` | Texto alternativo; vazio deixa o planeta decorativo (`aria-hidden`) |
| `tamanho` | `240` | Largura e altura (px ou medida CSS) |
| `duracao` | `24` | Segundos por volta |
| `sentido` | `'direita'` | Para onde a superfície da frente corre (`'direita'` ou `'esquerda'`) |
| `ritmo` | `1` | Multiplica a velocidade; `0` pausa. A mudança é sempre suave |
| `inicio` | `0` | Ângulo inicial (graus), para vários planetas na mesma tela |
| `luz` · `flutuar` · `sombra` | `true` | Liga e desliga cada camada |
| `halo` | `'92, 196, 255'` | Cor do brilho atrás (r, g, b) ou `false` |

**Desempenho:**

- 1 desenho de WebGL por quadro, mais 4 imagens com `transform`;
- o giro para sozinho quando o planeta sai da tela;
- a textura tem 100 KB e as peças, 8 a 25 KB cada.

## Planeta novo

[`scripts/planetas/preparar-planeta.py`](scripts/planetas/preparar-planeta.py) gera tudo a partir da arte de frente. Ele precisa de `opencv-python-headless` e `numpy`.

```bash
python scripts/planetas/preparar-planeta.py planeta-01
```

No bloco do planeta, informe:

| Campo | O que é |
| --- | --- |
| `centro` e `raio` | Centro e raio da esfera, em px da arte. O centro da esfera não é o centro do PNG, por causa das peças que saem da silhueta. No Planeta 01: centro (155, 167) e raio 128,5 numa arte de 320 px. |
| `pecas` | Caixa e ponto de apoio de cada elemento que sai da esfera |
| `so_na_frente` | Objetos que não devem se repetir no espelho de trás (opcional) |
| `costas` | Vista de trás do planeta (opcional) |

O script gera:

- a textura 360°, com o lugar das peças preenchido por difusão da cor em volta;
- os recortes das peças;
- o JSON que o componente lê.

## Arquivos

| Arquivo | O que é |
| --- | --- |
| `src/prototypes/planetas/PlanetaGirando.tsx` | Componente (vai para o Next.js) |
| `src/prototypes/planetas/planeta-girando.module.css` | Camadas do componente (flutuação, halo, sombra) |
| `src/prototypes/planetas/planeta-01.json` | Dados do Planeta 01 (gerado) |
| `src/prototypes/planetas/index.tsx` | Vitrine na plataforma (abas, controles, handoff) |
| `src/prototypes/planetas/vitrine.css` | Visual da vitrine (Yunara · tema Seafoam) |
| `public/planetas/planeta-01.png` | Arte original (320 × 320, fundo transparente) |
| `public/planetas/planeta-01/` | Textura 360° e peças (gerados) |
| `scripts/planetas/preparar-planeta.py` | Gerador da textura, das peças e do JSON |

## Verificação

Teste automatizado em Chromium (WebGL2 por SwiftShader) com 12 verificações, todas OK em duas rodadas:

- esfera visível;
- giro para a direita e para a esquerda, com troca suave;
- velocidade rápida cerca de 2× a padrão;
- pausa freando até parar;
- aceleração ao passar o mouse;
- 3 esferas animadas na aba Tamanhos;
- código sem corte;
- nenhum erro no console;
- “reduzir movimento” mostrando a arte original;
- navegador sem WebGL2 mostrando a arte original.

Também foram conferidas as capturas do giro em 8 ângulos, desktop (1440) e celular (390, sem rolagem horizontal).

## Próximos passos

- **Arte em 2× e vista de trás:** a arte recebida tem 320 × 320. Uma versão de 640 px ou mais deixa a textura mais nítida em telas retina. Uma vista de trás deixa o lado oculto único.
- **Demais planetas:** rodar o script para cada arte nova e incluir em `PLANETAS` (`index.tsx`).
