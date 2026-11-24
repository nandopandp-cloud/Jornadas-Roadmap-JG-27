# Kit de planetas 3D · Exploradores

Os planetas de massinha giram em 3D no eixo vertical. O kit está pronto para os projetos Next.js da Jovens Gênios: **instale uma vez e use os planetas pelo id.** Os modelos e os pôsteres ficam publicados na web, e o componente busca tudo sozinho.

| | |
| --- | --- |
| **Baixar o kit (.zip)** | https://github.com/nandopandp-cloud/Jornadas-Roadmap-JG-27/releases/download/kit-planetas/kit-planetas.zip |
| **Guia em PDF** | https://github.com/nandopandp-cloud/Jornadas-Roadmap-JG-27/releases/download/kit-planetas/GUIA-ENGENHARIA.pdf |
| **Catálogo ao vivo** | https://jornadas-roadmap-jg-27.vercel.app/planetas/catalogo.json |
| **Ver funcionando** | https://jornadas-roadmap-jg-27.vercel.app/#/p/planetas |

## Instalar (uma vez só)

```bash
# 1. baixe e descompacte na raiz do projeto: cria components/planetas/
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

<Planeta id="planeta-emocoes" tamanho={240} alt="Planeta Emoções" />
```

Se o projeto usa `src/`, mova a pasta para `src/components/planetas`.

## Planetas

| id | Nome |
| --- | --- |
| `planeta-mitologia` | Mitologia |
| `planeta-empreendedorismo` | Empreendedorismo |
| `planeta-emocoes` | Emoções |
| `planeta-artes` | Artes |
| `planeta-computacao` | Computação |
| `planeta-fantasia` | Fantasia |
| `planeta-musica` | Música |
| `planeta-terra` | Terra |
| `planeta-alfabetizacao` | Alfabetização |
| `planeta-transito` | Trânsito |

A lista sempre atualizada está no [catálogo ao vivo](https://jornadas-roadmap-jg-27.vercel.app/planetas/catalogo.json). No código, `await carregarPlanetas()` devolve todos os planetas (`id`, `nome`, …), no navegador ou em Server Components.

## Planeta novo

Quando o Design publica um planeta, **basta usar o id novo**, sempre no formato `planeta-<nome>`, sem acentos (ex.: `<Planeta id="planeta-alfabetizacao" />`). Não é preciso baixar nada nem mudar o kit.

Se o id não existir, o console avisa e lista os ids publicados.

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
| `base` | endereço dos planetas | De onde os arquivos são lidos (padrão: `ENDERECO_PLANETAS`, em `planetas.ts`) |
| `onSentidoChange` | — | Avisa quando a pessoa joga o planeta para o outro lado (exige componente cliente) |

## Comportamento

- **Giro:** uma volta a cada 40 s, sem outras velocidades.
- **Arrastar** (mouse ou dedo): gira; ao soltar, o planeta segue com embalo e volta ao giro normal.
- **Teclado:** setas ← e → com o planeta em foco.
- **Celular:** deslizar na vertical continua rolando a página.
- **"Reduzir movimento"** ligado no sistema: o planeta não gira sozinho, mas a mão continua funcionando.
- **Carregamento:** o pôster aparece na hora, já no HTML do servidor. O modelo (~2,5 MB) só é baixado quando o planeta está na página.
- **Sem WebGL ou sem rede:** fica o pôster.
- **Desempenho:** para de desenhar fora da tela e baixa a resolução sozinho em aparelho lento.

## Hospedagem

Os arquivos são servidos de `jornadas-roadmap-jg-27.vercel.app/planetas/`, com CORS liberado. Para servir de outro endereço (uma CDN da Jovens Gênios, por exemplo), copie a pasta `planetas/` desse site para lá e troque `ENDERECO_PLANETAS` em `components/planetas/planetas.ts`.

Com CSP, libere esse endereço em `img-src` e `connect-src`, e inclua `'wasm-unsafe-eval'` em `script-src` (a descompressão da malha usa WebAssembly).

## Esta pasta

É uma página de demonstração com todos os planetas publicados: `npm install && npm run dev`. Para usar no produto, baixe o .zip; não é preciso copiar esta pasta.

Testado com Next.js 15.5 (App Router), React 19.1 e three 0.170, num projeto limpo só com o componente: `next build` sem erros, planeta lido da web, pôster no HTML do servidor e id inexistente avisado no console.
