# Planetas · Exploradores

Iniciativa **Planetas** na plataforma do estudante Exploradores (Fundamental I). Os planetas de massinha da plataforma em Next.js ganham um **giro 360° em 3D**: o planeta inteiro (esfera e elementos) é um objeto só, que gira no eixo vertical sem nunca mudar de forma. Ele é **montado com as peças do kit**: a bola e cada elemento em PNG. O estudante também pode girar com a mão.

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
| 23/11/2026 | O planeta é um **modelo único** (textura 360° e relevo 360°). Primeiro ele foi montado a partir de um storyboard gerado por IA; os quadros se contradiziam (elementos duplicados e menos nítidos). |
| 23/11/2026 | **Metodologia atual: montar o planeta com as peças do kit** (a bola e cada elemento isolado em PNG). Cada peça aparece uma vez, nítida, no lugar que escolhemos. Peças em 3D de verdade ficam para depois. |

---

## Metodologia: como criar um planeta novo

```
1. Kit de peças  →  2. Onde fica cada peça  →  3. Gerar  →  4. Conferir
   (arte, PNG)      (1 lista no script)         (script)     (vitrine)
```

### 1. Kit de peças

Uma pasta em `arte/planetas/<id>/pecas/` com:

- **a bola:** o planeta liso, sem nada em cima (no Planeta 01, `01-base-azul.png`). Dela saem a cor e o granulado do oceano e a luz do planeta;
- **cada elemento em um PNG:** casa, vulcão, polvo, barco, ilha, floresta, rio, cachoeira, aves. Fundo transparente, todos na **mesma escala** da bola (como camadas de um mesmo arquivo) e com a mesma luz (de cima, à esquerda).

Cada elemento deve estar desenhado **de frente**: é assim que ele vai aparecer quando passar de frente para a câmera. Peças longas e finas (como a floresta do Planeta 01) podem ser usadas várias vezes, giradas e espelhadas.

### 2. Onde fica cada peça

Um bloco em `PLANETAS`, no início de [`scripts/planetas/preparar-planeta.py`](scripts/planetas/preparar-planeta.py):

```python
'planeta-02': {
    'pecas_dir': 'arte/planetas/planeta-02/pecas',
    'base': '01-base.png',
    'pecas': [
        {'arq': '04-casa.png', 'lon': -84, 'lat': 34, 'giro': 16, 'escala': 1.0, 'altura': 0.2},
        ...
    ],
},
```

| Campo | O que é |
| --- | --- |
| `lon`, `lat` | Centro da peça no globo, em graus. lon 0 = frente; −90 = lado que aparece quando o planeta gira para a direita; 180 = costas. Fique entre −60° e 60° de latitude: perto dos polos a peça some. |
| `giro` | Gira a peça no próprio plano (graus, anti-horário), por exemplo para deixar de pé uma peça desenhada inclinada |
| `escala` | Tamanho em relação ao kit (0,5 = metade) |
| `altura` | Quanto ela sai da esfera, em raios: casa e vulcão ≈ 0,2; polvo e ilha ≈ 0,1; rio e floresta ≈ 0,03–0,06 |
| `espelhar` | Vira a peça na horizontal |

A ordem da lista é a ordem das camadas: as primeiras ficam embaixo.

**Dicas de composição:**

- distribua os elementos pelos 4 lados (frente, os dois lados e as costas), para sempre haver algo aparecendo;
- deixe espaço entre as peças, para nenhuma encostar na outra;
- peças a mais de 76° do próprio centro somem suavemente; por isso peças grandes devem ser divididas em cópias menores.

### 3. Gerar

```bash
python scripts/planetas/preparar-planeta.py planeta-02
```

Leva cerca de 2 segundos. O script:

1. **mede a bola** (centro e raio) e a **luz** dela (o oceano é a bola inteira);
2. faz o **oceano 360°**: a cor da bola sem a luz, mais o granulado da massinha repetido sem emenda;
3. **cola cada peça** no globo. O mapeamento usa a altura na tela, porque a câmera fica sempre no equador: assim a peça aparece exatamente como desenhada quando está de frente. Ela vale numa calota em volta do centro, medida pela superfície da esfera, sem cortes retos;
4. faz o **relevo**: o contorno de cada peça vira uma cúpula arredondada com a altura pedida;
5. grava `textura.webp`, `relevo.png` e `frente.webp` (o planeta visto de frente, como reserva) em `public/planetas/<id>/`, e o JSON em `src/prototypes/planetas/<id>.json`.

### 4. Conferir

Inclua o planeta em `PLANETAS` (`src/prototypes/planetas/index.tsx`) e gire na vitrine, com atenção a três pontos:

- nenhuma peça encostando em outra;
- todos os lados com algo interessante;
- peças de pé quando passam de frente.

Para ajustar, mude `lon`, `lat`, `giro` ou `escala` e gere de novo.

> A metodologia anterior (storyboard do giro) continua no script, como `planeta-01-storyboard`, para comparação. Ela só dá bom resultado com quadros coerentes, renderizados de um modelo 3D.

---

## Como o componente desenha o planeta

1. **Modelo fixo:** uma textura 360° e um relevo 360°. O planeta é sempre o mesmo objeto, só que girado.
2. **Desenho:** para cada pixel, o shader (WebGL2) procura onde o raio da câmera encosta na esfera com relevo (*ray marching*, 56 passos e refinamento) e pega a cor da textura naquele ponto.
3. **Volume:** o relevo recebe sombra da luz fixa, e a luz da bola é aplicada parada na tela (o planeta é redondo e iluminado do alto à esquerda o tempo todo).
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

- **Kit:** a pasta "🪐 Planetas" (10 PNGs de 640 px), copiada para `arte/planetas/planeta-01/pecas/`.
- **Composição:**
  - frente: barco, pterossauros e rio;
  - lado da casa (−90°): cinturão de floresta (a peça usada 4 vezes), casa e cachoeira;
  - topo: vulcão com as pedras;
  - lado do polvo (+90°): polvo e ilha;
  - costas: oceano e um segundo rio.
- **Resultado:** 13 peças coladas. Cada elemento aparece uma vez, nítido, e só gira.
- **Abordagens anteriores** (4 vistas, troca de quadros, storyboard) ficam no histórico da branch, e o storyboard está em `arte/planetas/planeta-01/storyboard.png`.

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
   - `planeta-01/`, com `textura.webp`, `relevo.png` e `frente.webp` (cerca de 290 KB no total).
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
| `arte/planetas/planeta-01/pecas/` | Kit de peças (a bola e cada elemento em PNG) |
| `arte/planetas/planeta-01/storyboard.png` | Storyboard da abordagem anterior |
| `public/planetas/planeta-01/` | Textura 360°, relevo 360° e vista de frente (gerados) |
| `scripts/planetas/preparar-planeta.py` | Gerador: monta o planeta com as peças (ou a partir de um storyboard) |

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

**Giro completo:** conferido em 12 ângulos, de 30° em 30°.

## Próximos passos

- **Demais planetas**, seguindo a metodologia (kit de peças).
- **Peças em 3D de verdade** (nível 2): cada PNG do kit vira um modelo 3D, e o planeta passa a ter volume completo de qualquer ângulo.
