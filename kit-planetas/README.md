# Kit de planetas 3D · Exploradores

Os planetas de massinha giram em 3D no eixo vertical. O kit está pronto para os projetos Next.js da Jovens Gênios: **um download, uma dependência e um componente.**

| | |
| --- | --- |
| **Baixar o kit (.zip)** | https://github.com/nandopandp-cloud/Jornadas-Roadmap-JG-27/releases/download/kit-planetas/kit-planetas.zip |
| **Guia em PDF** | https://github.com/nandopandp-cloud/Jornadas-Roadmap-JG-27/releases/download/kit-planetas/GUIA-ENGENHARIA.pdf |
| **Ver funcionando** | https://jornadas-roadmap-jg-27.vercel.app/#/p/planetas |

Os dois links de download nunca mudam e sempre trazem a versão mais nova. Os arquivos originais (Tripo, Blender) ficam com o Design. A engenharia não precisa deles: cada planeta chega pronto.

## Instalar

```bash
# 1. baixe e descompacte na raiz do projeto (as pastas já vêm no lugar certo)
REPO=https://github.com/nandopandp-cloud/Jornadas-Roadmap-JG-27
curl -LO $REPO/releases/download/kit-planetas/kit-planetas.zip
unzip -o kit-planetas.zip -x LEIA-ME.txt && rm kit-planetas.zip

# 2. instale o three.js
npm i three
npm i -D @types/three
```

```tsx
// 3. use onde o planeta aparece (funciona em Server Components)
import { Planeta } from '@/components/planetas'

<Planeta id="planeta-03" tamanho={240} alt="Planeta Emoções" />
```

O .zip cria duas pastas: `components/planetas/` (componente e catálogo) e `public/planetas/` (modelo e pôster de cada planeta). Se o projeto usa `src/`, mova a primeira para `src/components/planetas`.

## Planetas

| id | Nome |
| --- | --- |
| `planeta-01` | Mitologia |
| `planeta-02` | Empreendedorismo |
| `planeta-03` | Emoções |
| `planeta-04` | Artes |
| `planeta-05` | Computação |
| `planeta-06` | Fantasia |
| `planeta-07` | Música |
| `planeta-08` | Terra |

O nome também vem no catálogo: `PLANETAS['planeta-03'].nome` devolve `'Emoções'`. `LISTA_PLANETAS` traz todos, em ordem.

## Planeta novo ou atualizado

O Design gera o planeta, prepara e publica no mesmo link. A engenharia **baixa o .zip de novo e substitui as duas pastas**. O componente não muda, e não precisa de Blender nem de script.

## Props

| Prop | Padrão | O que faz |
| --- | --- | --- |
| `id` | — | Planeta do catálogo (tabela acima) |
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
- **Arrastar** (mouse ou dedo): gira; ao soltar, o planeta segue com embalo e volta ao giro normal.
- **Teclado:** setas ← e → com o planeta em foco.
- **Celular:** deslizar na vertical continua rolando a página.
- **"Reduzir movimento"** ligado no sistema: o planeta não gira sozinho, mas a mão continua funcionando.
- **Carregamento:** o pôster aparece na hora. O modelo (~2,5 MB) só é baixado quando o planeta está na página.
- **Sem WebGL:** fica o pôster.
- **Desempenho:** para de desenhar fora da tela e baixa a resolução sozinho em aparelho lento.

## Esta pasta

É uma página de demonstração com todos os planetas: `npm install && npm run dev`. Para usar no produto, baixe o .zip; não é preciso copiar esta pasta.

Testado com Next.js 15.5 (App Router), React 19.1 e three 0.170: `next build` sem erros, e giro, arrastar, toque, teclado, "reduzir movimento" e falta de WebGL conferidos no navegador.
