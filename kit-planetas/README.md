# Kit de planetas 3D · Exploradores

Planetas de massinha em 3D, girando no eixo vertical, prontos para a plataforma da Jovens Gênios (Next.js). **Para usar, copie duas pastas e instale o `three`.**

Veja funcionando:

- na vitrine: https://jornadas-roadmap-jg-27.vercel.app/#/p/planetas
- localmente: `npm install && npm run dev` nesta pasta.

Guia em PDF: [GUIA-ENGENHARIA.pdf](GUIA-ENGENHARIA.pdf).

## Copiar e colar

```bash
# 1. dependência
npm i three
npm i -D @types/three

# 2. copie as duas pastas para o projeto
cp -R kit-planetas/components/planetas  <projeto>/components/planetas
cp -R kit-planetas/public/planetas      <projeto>/public/planetas
```

```tsx
// 3. use onde o planeta aparece (funciona em Server Components)
import { Planeta } from '@/components/planetas'

<Planeta id="planeta-01" tamanho={240} alt="Planeta da trilha" />
```

Se o alias `@/` do projeto apontar para `src/`, copie para `src/components/planetas`.

## O que tem aqui

| Caminho | O que é |
| --- | --- |
| `components/planetas/PlanetaGirando.tsx` | O componente (`'use client'`, three.js) |
| `components/planetas/planeta-girando.module.css` | Camadas: flutuação, halo, sombra, foco, cursor |
| `components/planetas/planetas.ts` | **Catálogo:** uma linha por planeta |
| `components/planetas/Planeta.tsx` | Atalho `<Planeta id="…" />` |
| `components/planetas/index.ts` | Exportações |
| `public/planetas/<id>/` | `planeta.glb` (~2,4 MB) e `poster.webp` (~60 KB) de cada planeta |
| `app/` | Página de demonstração com todos os planetas |
| `ferramentas/otimizar_glb.py` | Prepara um planeta novo (Blender) |

## Props

| Prop | Padrão | O que faz |
| --- | --- | --- |
| `id` | — | Planeta do catálogo (`planeta-01`, …) |
| `tamanho` | `240` | Largura e altura (px ou medida CSS) |
| `alt` | `''` | Texto alternativo. Vazio deixa o planeta decorativo |
| `sentido` | `'direita'` | Para onde a superfície da frente corre (`'direita'` ou `'esquerda'`) |
| `pausado` | `false` | Para o giro automático (girar com a mão continua funcionando) |
| `arrastavel` | `true` | Girar com a mão e com as setas |
| `inicio` | `0` | Graus somados ao ângulo inicial |
| `luz` · `flutuar` · `sombra` | `true` | Liga e desliga cada camada |
| `halo` | `'92, 196, 255'` | Cor do brilho atrás (r, g, b) ou `false` |
| `base` | `'/'` | Prefixo dos arquivos em `public/` (ex.: `basePath` do Next) |
| `onSentidoChange` | — | Avisa quando a pessoa joga o planeta para o outro lado (exige componente cliente) |

## Comportamento

- **Giro:** uma volta a cada 40 s, sem outras velocidades.
- **Arrastar** (mouse ou dedo): gira; ao soltar, o planeta segue com embalo e volta ao giro normal no sentido em que foi jogado.
- **Teclado:** setas ← e → com o planeta em foco.
- **Celular:** deslizar na vertical continua rolando a página.
- **"Reduzir movimento"** ligado no sistema: o planeta não gira sozinho, mas a mão continua funcionando.
- **Carregamento:** o pôster aparece na hora; o modelo (2,4 MB) só é baixado quando o planeta está na página e troca de forma suave.
- **Sem WebGL:** fica o pôster.
- **Desempenho:**
  - para de desenhar fora da tela;
  - baixa a resolução sozinho em aparelho lento;
  - a velocidade não depende da taxa de quadros.

## Planeta novo

1. **Design** gera o planeta 3D no Tripo e exporta em `.glb`.
2. **Otimizar** (Blender 5.3):

   ```bash
   blender -b --factory-startup -P ferramentas/otimizar_glb.py -- \
     --entrada "planeta-02.glb" --saida public/planetas/planeta-02 \
     --id planeta-02 --nome "Planeta 02" --inicio 305
   ```

   O script centraliza a esfera, reduz para 160 mil triângulos, converte as texturas para 2K WebP e comprime a malha com meshopt. Ele também gera o `poster.webp` e **imprime a linha do catálogo**.
3. **Catálogo:** cole a linha em `components/planetas/planetas.ts`.
4. **Engenharia:** copia `public/planetas/planeta-02/` e o `planetas.ts` atualizado. Nada mais muda.

`--inicio` é o ângulo em que o planeta aparece primeiro, o mesmo do pôster.

## Testado

- Next.js 15.5 (App Router), React 19.1 e three 0.170.
- `next build` sem erros.
- No navegador, a velocidade medida foi de 0,14 rad/s (esperado 0,157), o arrastar funcionou e o console ficou sem erros.
- Na vitrine, 18 verificações automáticas: giro, mão, embalo, setas, pausa, "reduzir movimento", sem WebGL e toque no celular.
