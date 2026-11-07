# Jornadas · Roadmap 2027 · Jovens Gênios

Plataforma de **protótipos navegáveis** das principais jornadas do Roadmap 2027 da Jovens Gênios.

**Acesse:** https://jornadas-roadmap-jg-27.vercel.app

## O que é a plataforma

Antes de uma iniciativa virar produto, o time precisa mostrar como ela vai funcionar de verdade: o caminho que cada pessoa percorre, as telas, os estados e as animações. A plataforma reúne esses protótipos num só lugar para que produto, design, pedagógico, comercial e escolas possam **ver, testar e opinar** sem instalar nada.

- **Um lugar para todas as jornadas:** à esquerda fica a lista de iniciativas; ao escolher uma, o protótipo abre ao lado.
- **Prévia em qualquer tela:** cada jornada pode ser vista em Desktop, Tablet ou Celular, numa moldura que imita o produto real (navegador com o endereço da plataforma ou aparelho).
- **Atalhos de fluxo:** botões que levam direto a cada etapa da jornada, para apresentar um ponto específico sem refazer o caminho todo.
- **Link público para compartilhar:** cada jornada tem um link que abre só o protótipo, em tela cheia, e pode ser enviado por QR Code ou WhatsApp a quem vai testar.
- **Fiel às referências:** os protótipos seguem as telas desenhadas pelo time, com as artes recortadas das próprias referências.
- **100% navegável:** os botões funcionam, os dados reagem às ações e há micro-animações. Os dados são fictícios e ficam só no navegador; recarregar a página reinicia o protótipo.
- **Independentes entre si:** cada jornada tem seu próprio visual, dados e regras, e pode evoluir sem afetar as demais.

## Como usar

| Link | O que abre |
| --- | --- |
| `#/` | Plataforma com todas as jornadas |
| `#/jornada/<slug>` | Plataforma já com uma jornada selecionada |
| `#/p/<slug>` | **Link público:** só o protótipo, em tela cheia |
| `#/p/<slug>?screen=<fluxo>` | Link público começando direto numa etapa (os mesmos atalhos da plataforma) |

## Jornadas

<!-- jornadas:inicio (gerado automaticamente a partir de src/platform/journeys.ts — não edite à mão) -->

A plataforma tem hoje **5 jornadas**. Cada uma vive na sua própria branch, com um README dedicado.

### Alfabetização

**App do Estudante** · 1º e 2º ano · Ensino Fundamental

Trilha de letras com narração, desafios de toque e arrastar, conquistas, mural da turma com produção criativa e tarefas enviadas pelo professor.

[Protótipo navegável](https://jornadas-roadmap-jg-27.vercel.app/#/p/alfabetizacao) · [Ver na plataforma](https://jornadas-roadmap-jg-27.vercel.app/#/jornada/alfabetizacao) · [Branch `prototipo-alfabetizacao`](https://github.com/nandopandp-cloud/Jornadas-Roadmap-JG-27/tree/prototipo-alfabetizacao)

### Cronograma de Uso

**Plataforma Educadores** · Gestores e professores

Gestor importa o cronograma da escola em CSV, revisa as inconsistências sugeridas, ajusta as atividades e publica; o calendário escolar é preenchido e os professores recebem as recomendações.

[Protótipo navegável](https://jornadas-roadmap-jg-27.vercel.app/#/p/cronograma) · [Ver na plataforma](https://jornadas-roadmap-jg-27.vercel.app/#/jornada/cronograma) · [Branch `prototipo-cronograma`](https://github.com/nandopandp-cloud/Jornadas-Roadmap-JG-27/tree/prototipo-cronograma)

### Flashcards

**GenieX · Plataforma do Estudante** · Ensino Médio

Estudante escolhe até 5 disciplinas e seus tópicos, gera grupos de flashcards, estuda com “Não sei / Eu sei / Revisar depois”, favorita cards e acompanha o resultado de cada sessão.

[Protótipo navegável](https://jornadas-roadmap-jg-27.vercel.app/#/p/flashcards) · [Ver na plataforma](https://jornadas-roadmap-jg-27.vercel.app/#/jornada/flashcards) · [Branch `prototipo-flashcards`](https://github.com/nandopandp-cloud/Jornadas-Roadmap-JG-27/tree/prototipo-flashcards)

### Lojinha

**Exploradores · Plataforma do Estudante** · Estudantes · Clube Jovens Gênios

Estudante troca pontos por avatares, backgrounds, pets, cards e recompensas físicas; acompanha o cartão fidelidade com QR Code, o histórico de pontos, o status dos resgates e as regras.

[Protótipo navegável](https://jornadas-roadmap-jg-27.vercel.app/#/p/lojinha) · [Ver na plataforma](https://jornadas-roadmap-jg-27.vercel.app/#/jornada/lojinha) · [Branch `prototipo-lojinha`](https://github.com/nandopandp-cloud/Jornadas-Roadmap-JG-27/tree/prototipo-lojinha)

### Gestão das Lojinhas

**Admin Jovens Gênios** · Times internos · Exploradores, Educadores e GenieX

Times internos administram a Lojinha das três plataformas: catálogo de itens e categorias, resgates com andamento e estorno, extrato de pontos, estudantes e configurações.

[Protótipo navegável](https://jornadas-roadmap-jg-27.vercel.app/#/p/gestao-lojinha) · [Ver na plataforma](https://jornadas-roadmap-jg-27.vercel.app/#/jornada/gestao-lojinha) · [Branch `prototipo-gestao-lojinha`](https://github.com/nandopandp-cloud/Jornadas-Roadmap-JG-27/tree/prototipo-gestao-lojinha)

<!-- jornadas:fim -->

## Como o projeto é organizado

- **Branch `main`:** a plataforma completa, que é o que vai para o ar. Este README fala da plataforma como um todo.
- **Uma branch por jornada (`prototipo-<slug>`):** cada iniciativa tem sua branch, com um README que descreve só aquela jornada (funcionalidades, atalhos, estrutura e artes).
- **Telas de referência** ficam em `public/<iniciativa>/` e servem de base para o protótipo; elas não são publicadas no site.

### Adicionando uma nova jornada

1. Crie a branch `prototipo-<slug>` a partir da `main`, com um README dedicado à jornada.
2. Crie `src/prototypes/<slug>/index.tsx` exportando um componente `default` (recebe `startScreen` e `embedded`).
3. Registre a jornada em `src/platform/journeys.ts` (nome, plataforma, público, descrição, dispositivo da prévia e atalhos de fluxo).
4. Se houver uma pasta nova de artes em `public/`, inclua-a em `ARTE_DO_APP` no `vite.config.ts`.

A seção **Jornadas** deste README é atualizada sozinha: a cada commit na `main`, um gancho de git (`.githooks/pre-commit`) lê o registro de jornadas e reescreve a lista, com o resumo e os links para a branch e para o protótipo. Para atualizar à mão: `npm run readme`.

## Parte técnica

- **Vite + React 19 + TypeScript**, animações com **Framer Motion**, ícones **lucide-react** e QR Codes com **qrcode**.
- Roteamento por hash: o `dist/` funciona em qualquer hospedagem estática, sem configurar rewrites.
- Hospedagem na **Vercel**. A única parte de servidor é `api/tts.ts`, que fala com a ElevenLabs para a voz do mascote da Alfabetização (a chave nunca vai para o navegador; variáveis `ELEVENLABS_API_KEY` e `ELEVENLABS_VOICE_ID`).
- **Artes:** recortadas das referências com rembg (BiRefNet), textos e selos removidos com LaMa (inpainting) e nitidez melhorada com Real-ESRGAN quando necessário. Ícones 3D extras do [Microsoft Fluent Emoji](https://github.com/microsoft/fluentui-emoji) (licença MIT), em `public/3d/`.

```
src/
  platform/        # plataforma: lista de jornadas, prévia por dispositivo, link público, compartilhar
  prototypes/      # uma pasta por jornada (index, estado, dados, componentes e telas)
  shared/          # som e voz
server/, api/      # proxy da ElevenLabs (local e Vercel)
scripts/           # gerador da seção Jornadas deste README
public/            # artes de cada jornada (.webp), ícones 3D e telas de referência
```

### Rodando

```bash
npm install      # também ativa o gancho que atualiza este README
npm run dev      # http://localhost:5173
npm run build    # gera dist/ (site estático)
```
