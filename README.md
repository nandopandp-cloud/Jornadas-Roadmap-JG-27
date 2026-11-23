# Planetas · Exploradores

Iniciativa **Planetas** na plataforma do estudante Exploradores (Fundamental I). Os planetas de massinha da plataforma em Next.js viram **modelos 3D de verdade**. O planeta gira no eixo vertical, com volume real de todos os lados, e o estudante também pode girar com a mão.

> Esta branch guarda a iniciativa Planetas e a **metodologia para novos planetas**. A plataforma completa e a lista de todas as jornadas ficam no README da `main`.

## Para a engenharia: kit pronto

**[kit-planetas/](kit-planetas/)** é o pacote para a plataforma Jovens Gênios. Basta copiar duas pastas e instalar o `three`.

- O guia em PDF está em [kit-planetas/GUIA-ENGENHARIA.pdf](kit-planetas/GUIA-ENGENHARIA.pdf).
- Para baixar só o kit: `npx degit nandopandp-cloud/Jornadas-Roadmap-JG-27/kit-planetas#exploradores-planetas-360 kit-planetas`.
- O kit já é um mini-projeto Next.js que mostra todos os planetas (`npm install && npm run dev`).
- Planeta novo: a pasta em `kit-planetas/public/planetas/<id>/` e uma linha em `kit-planetas/components/planetas/planetas.ts`. O `otimizar_glb.py` imprime essa linha.

## Links

| O quê | Onde |
| --- | --- |
| Vitrine (link público) | https://jornadas-roadmap-jg-27.vercel.app/#/p/planetas |
| Página da iniciativa na plataforma | https://jornadas-roadmap-jg-27.vercel.app/#/jornada/planetas |
| Handoff para o Next.js | https://jornadas-roadmap-jg-27.vercel.app/#/p/planetas?screen=nextjs |

## Decisões

| Data | Decisão |
| --- | --- |
| 23/11/2026 | O giro é 3D, **no eixo vertical**, como um globo. |
| 23/11/2026 | **Uma velocidade só:** uma volta a cada 40 s. |
| 23/11/2026 | O estudante pode **girar com a mão** (arrastar com embalo e setas). |
| 23/11/2026 | **Os elementos nunca mudam de forma durante o giro**: só giram, aparecem e somem. |
| 23/11/2026 | **O planeta é um modelo 3D (.glb)** gerado no Tripo a partir das artes. As abordagens a partir de imagens (vistas, storyboard, kit de peças, modelagem procedural no Blender) foram descartadas por não serem fiéis o bastante. Elas ficam no histórico da branch. |

---

## Metodologia: como criar um planeta novo

```
1. Modelo 3D (Tripo)  →  2. Otimizar (Blender)  →  3. Registrar  →  4. Conferir
   .glb, ~60 MB            .glb ~2,4 MB + pôster      1 linha         vitrine
```

### 1. Modelo 3D

Gere o planeta no **Tripo** (ou outro gerador de imagem para 3D) a partir da arte de frente e exporte em **.glb**, com texturas PBR (cor, normal e rugosidade/metal).

O que pedir ao gerador:

- uma esfera com elementos em cima;
- polo para cima;
- a arte de frente como referência principal.

O modelo bruto do Planeta 01 tem 1,96 milhão de triângulos e texturas 4K (64 MB). Ele fica em `~/Downloads/PLANETAS 3D/NOVOS-PLANETAS/` e não entra no repositório.

### 2. Otimizar

[`scripts/planetas/otimizar_glb.py`](scripts/planetas/otimizar_glb.py) roda no Blender 5.3, em modo sem janela:

```bash
blender -b --factory-startup -P scripts/planetas/otimizar_glb.py -- \
  --entrada "planeta-02.glb" --saida public/planetas/planeta-02 --tris 160000 --inicio 305
```

| Etapa | O que faz |
| --- | --- |
| Centro da esfera | Ajuste robusto de esfera (mínimos quadrados, descartando os vértices dos elementos que saem dela). O centro da esfera vai para a origem, com raio 1. **Sem isso o planeta bambolearia:** no Planeta 01, o centro real estava a 6 cm do centro da caixa. |
| Triângulos | Decimate (colapso de arestas, preserva UV) até `--tris` (160 mil). |
| Texturas | 4K → 2K, em WebP (qualidade 86). |
| Compressão | Malha comprimida com **meshopt**; o decodificador já vem no three.js, sem arquivos extras. |
| Pôster | Render Cycles no mesmo enquadramento e no mesmo ângulo inicial do site. É a imagem de reserva e o primeiro quadro, para a troca para o 3D não dar salto. |

Resultado no Planeta 01: **64 MB → 2,4 MB**, com 160 mil triângulos, e um pôster de 62 KB. O script também grava `info.json` (centro e raio medidos, triângulos, tamanhos).

**Ângulo inicial (`--inicio`):** escolha o lado que melhor apresenta o planeta. No Planeta 01, 305° mostra a floresta à esquerda, os pterossauros no meio e o barco, o polvo e a praia à direita, como na arte original.

### 3. Registrar

Crie o JSON do planeta (`src/prototypes/planetas/planeta-02.json`) com os valores do `info.json`:

```json
{ "id": "planeta-02", "pasta": "planetas/planeta-02", "modelo": "planeta.glb", "poster": "poster.webp",
  "raioQuadro": 1.347, "inicio": 305, "elevacao": 12, "fov": 30 }
```

### 4. Conferir

Gire na vitrine e confira:

- o planeta gira em volta do próprio centro, sem bambolear;
- o pôster e o primeiro quadro do 3D coincidem;
- o tamanho fica bom no ícone, no card e no destaque.

---

## Como o componente funciona

`PlanetaGirando.tsx` usa o three.js (0.170):

- **Cena:** câmera em perspectiva (30°) levemente acima do equador (12°), enquadrada pelo `raioQuadro` (a casa e a montanha saem da esfera).
- **Luz:** luz de estúdio (principal no alto à esquerda e preenchimento à direita), ambiente de estúdio (`RoomEnvironment`) para os reflexos PBR, e tom AgX, como no Blender.
- **Giro:** o modelo gira em volta do eixo Y, com uma volta a cada 40 s. Trocar sentido, pausar ou soltar depois de arrastar acelera e freia suave.
- **Mão:** arrastar (mouse ou dedo) gira, com a superfície acompanhando o dedo. Ao soltar, o planeta segue com embalo e volta ao giro normal no sentido em que foi jogado. Também gira pelas setas do teclado, e deslizar na vertical continua rolando a página no celular.
- **Carregamento:** o pôster aparece na hora; quando o modelo chega, há uma troca suave para o 3D.
- **Acessibilidade e fallback:**
  - **“reduzir movimento”:** não gira sozinho, mas a mão continua funcionando;
  - **sem WebGL:** fica o pôster.
- **Desempenho:**
  - uma malha e um desenho por quadro;
  - para de desenhar fora da tela;
  - a resolução cai sozinha em aparelho lento;
  - a velocidade não depende da taxa de quadros.

## Como levar para o Next.js

1. `npm i three` (testado com a 0.170).
2. Copie para `components/planetas/`: `PlanetaGirando.tsx`, `planeta-girando.module.css` e `planeta-01.json`.
3. Copie para `public/planetas/planeta-01/`: `planeta.glb` e `poster.webp`.
4. Use:

```tsx
import { PlanetaGirando } from '@/components/planetas/PlanetaGirando'
import planeta01 from '@/components/planetas/planeta-01.json'

<PlanetaGirando planeta={planeta01} tamanho={240} alt="Planeta da trilha" />
```

| Prop | Padrão | O que faz |
| --- | --- | --- |
| `planeta` | — | Dados do planeta (JSON: modelo, pôster, enquadramento, ângulo inicial) |
| `base` | `'/'` | Prefixo dos arquivos em `public/` |
| `alt` | `''` | Texto alternativo; com ele, o rótulo inclui “Arraste ou use as setas para girar” |
| `tamanho` | `240` | Largura e altura (px ou medida CSS) |
| `sentido` | `'direita'` | Para onde a superfície da frente corre |
| `onSentidoChange` | — | Avisa quando a pessoa joga o planeta para o outro lado |
| `pausado` | `false` | Para o giro automático (a mão continua) |
| `arrastavel` | `true` | Girar com a mão e com as setas |
| `inicio` | `0` | Graus somados ao ângulo inicial do modelo (0 = igual ao pôster) |
| `luz` · `flutuar` · `sombra` | `true` | Liga e desliga cada camada |
| `halo` | `'92, 196, 255'` | Cor do brilho atrás (r, g, b) ou `false` |

O componente começa com `'use client'`. Ele tem cerca de 157 KB comprimido com o three.js, e o modelo, 2,4 MB, só é baixado quando o planeta aparece.

## Arquivos

| Arquivo | O que é |
| --- | --- |
| `src/prototypes/planetas/PlanetaGirando.tsx` | Componente (vai para o Next.js) |
| `src/prototypes/planetas/planeta-girando.module.css` | Camadas (flutuação, halo, sombra, foco, cursor) |
| `src/prototypes/planetas/planeta-01.json` | Dados do Planeta 01 |
| `src/prototypes/planetas/index.tsx` · `vitrine.css` | Vitrine na plataforma |
| `public/planetas/planeta-01/` | `planeta.glb` (2,4 MB) e `poster.webp` (62 KB) |
| `scripts/planetas/otimizar_glb.py` | Otimização do modelo para a web (Blender) |
| `scripts/planetas/preparar-planeta.py` · `arte/planetas/` | Abordagens anteriores (kit de peças e storyboard), só como histórico |

## Verificação

Teste automatizado em Chromium (WebGL por SwiftShader), com 18 verificações, todas OK em duas rodadas.

- **Giro:**
  - uma volta a cada 40 s;
  - não há opções de velocidade;
  - o mouse em cima não acelera;
  - o planeta 3D substitui o pôster.
- **Mão:**
  - arrastar acompanha o mouse;
  - soltar parado não dá embalo;
  - pausado, a mão continua funcionando;
  - um arremesso inverte o sentido e segue no giro normal.
- **Teclado:** as setas giram.
- **Vitrine:** os 3 tamanhos, o código sem corte e nenhum erro no console.
- **Acessibilidade e fallback:** “reduzir movimento” e o navegador sem WebGL (fica o pôster).

**Toque (celular):** a horizontal gira, a vertical rola a página e não há rolagem lateral.

**Também conferidos:**

- 8 ângulos, de 45° em 45°;
- o pôster comparado com o primeiro quadro do 3D;
- desktop e celular.

## Próximos passos

- **Demais planetas**, seguindo a metodologia (Tripo → otimizar → registrar).
- **Versão leve para listas** com muitos planetas na mesma tela, se for o caso: menos triângulos (`--tris 60000`) e texturas de 1K.
