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

A plataforma tem hoje **13 jornadas**. Cada uma vive na sua própria branch, com um README dedicado.

### Alfabetização

**App do Estudante** · 1º e 2º ano · Ensino Fundamental

Trilha de letras com narração, desafios de toque e arrastar, conquistas, mural da turma com produção criativa e tarefas enviadas pelo professor.

[Protótipo navegável](https://jornadas-roadmap-jg-27.vercel.app/#/p/alfabetizacao) · [Ver na plataforma](https://jornadas-roadmap-jg-27.vercel.app/#/jornada/alfabetizacao) · [Branch `prototipo-alfabetizacao`](https://github.com/nandopandp-cloud/Jornadas-Roadmap-JG-27/tree/prototipo-alfabetizacao)

### Cronograma de Uso

**Plataforma Educadores** · Gestores e professores

Gestor cria o cronograma na plataforma ou importa uma planilha CSV com várias escolas; a validação roda em segundo plano enquanto ele navega, depois revisa as inconsistências sugeridas, ajusta as atividades e publica; o calendário escolar é preenchido e os professores recebem as recomendações.

[Protótipo navegável](https://jornadas-roadmap-jg-27.vercel.app/#/p/cronograma) · [Ver na plataforma](https://jornadas-roadmap-jg-27.vercel.app/#/jornada/cronograma) · [Branch `prototipo-cronograma`](https://github.com/nandopandp-cloud/Jornadas-Roadmap-JG-27/tree/prototipo-cronograma)

### Flashcards

**GenieX · Plataforma do Estudante** · Ensino Médio

Estudante escolhe até 5 disciplinas e seus tópicos, gera grupos de flashcards, estuda com “Não sei / Eu sei / Revisar depois”, favorita cards e acompanha o resultado de cada sessão.

[Protótipo navegável](https://jornadas-roadmap-jg-27.vercel.app/#/p/flashcards) · [Ver na plataforma](https://jornadas-roadmap-jg-27.vercel.app/#/jornada/flashcards) · [Branch `prototipo-flashcards`](https://github.com/nandopandp-cloud/Jornadas-Roadmap-JG-27/tree/prototipo-flashcards)

### Lojinha

**Exploradores · Plataforma do Estudante** · Estudantes · Clube Jovens Gênios

Estudante troca pontos por avatares, backgrounds, pets, cards e recompensas físicas; acompanha o cartão fidelidade com QR Code, o histórico de pontos, o status dos resgates e as regras.

[Protótipo navegável](https://jornadas-roadmap-jg-27.vercel.app/#/p/lojinha) · [Ver na plataforma](https://jornadas-roadmap-jg-27.vercel.app/#/jornada/lojinha) · [Branch `prototipo-lojinha`](https://github.com/nandopandp-cloud/Jornadas-Roadmap-JG-27/tree/prototipo-lojinha)

### Gestão da Lojinha

**Admin Jovens Gênios** · Times internos · Exploradores, Educadores e GenieX

Times internos administram a Lojinha das três plataformas: catálogo de itens e categorias, resgates com andamento e estorno, extrato de pontos, estudantes e configurações.

[Protótipo navegável](https://jornadas-roadmap-jg-27.vercel.app/#/p/gestao-lojinha) · [Ver na plataforma](https://jornadas-roadmap-jg-27.vercel.app/#/jornada/gestao-lojinha) · [Branch `prototipo-gestao-lojinha`](https://github.com/nandopandp-cloud/Jornadas-Roadmap-JG-27/tree/prototipo-gestao-lojinha)

### Login simplificado · Exploradores

**Exploradores · Plataforma do Estudante** · Estudantes do Fundamental I · em fase de alfabetização

Estudante entra sem digitar e-mail e senha: lê o QR Code da carteirinha pela câmera ou toca, na ordem, nos ícones espaciais do seu código. E-mail e senha continuam disponíveis; erros e pausa por tentativas orientam o próximo passo.

[Protótipo navegável](https://jornadas-roadmap-jg-27.vercel.app/#/p/login-exploradores) · [Ver na plataforma](https://jornadas-roadmap-jg-27.vercel.app/#/jornada/login-exploradores) · [Branch `login-simplificado`](https://github.com/nandopandp-cloud/Jornadas-Roadmap-JG-27/tree/login-simplificado)

### Login simplificado · Admins

**Admins Jovens Gênios** · Gestores, administradores e secretarias escolares

Gestão da credencial simplificada no cadastro do estudante: lista com status de credencial e permissão, emissão (individual e em lote), reemissão com motivo, revogação, bloqueio de acesso, impressão da carteirinha e histórico de tentativas.

[Protótipo navegável](https://jornadas-roadmap-jg-27.vercel.app/#/p/login-admin) · [Ver na plataforma](https://jornadas-roadmap-jg-27.vercel.app/#/jornada/login-admin) · [Branch `login-simplificado-admin`](https://github.com/nandopandp-cloud/Jornadas-Roadmap-JG-27/tree/login-simplificado-admin)

### Gamificação GenieX

**GenieX · Plataforma do Estudante** · Estudantes do Fundamental II e do Ensino Médio

Estudante acompanha a própria evolução na GenieX, a partir do perfil: XP válido, elos (Bronze a Cósmico) com progressão e regressão, 25 badges permanentes, extrato de XP com a validade de cada lote e avisos de novo elo, elo alterado e badge desbloqueada.

[Protótipo navegável](https://jornadas-roadmap-jg-27.vercel.app/#/p/gamificacao-geniex) · [Ver na plataforma](https://jornadas-roadmap-jg-27.vercel.app/#/jornada/gamificacao-geniex) · [Branch `gamificacao-geniex`](https://github.com/nandopandp-cloud/Jornadas-Roadmap-JG-27/tree/gamificacao-geniex)

### Gamificação GenieX · Educadores

**Plataforma Educadores** · Professores e gestores

Relatórios da gamificação da GenieX para professores e gestores: turmas com XP válido, elo médio e distribuição por elo; relatório da turma com regressões e badges; e o relatório de cada estudante com elos, 25 badges, evolução do XP, modalidades e extrato de lotes, com exportação em CSV e PDF.

[Protótipo navegável](https://jornadas-roadmap-jg-27.vercel.app/#/p/gamificacao-geniex-educadores) · [Ver na plataforma](https://jornadas-roadmap-jg-27.vercel.app/#/jornada/gamificacao-geniex-educadores) · [Branch `gamificacao-geniex-educadores`](https://github.com/nandopandp-cloud/Jornadas-Roadmap-JG-27/tree/gamificacao-geniex-educadores)

### Teste Vocacional GenieX

**GenieX · Plataforma do Estudante** · Ensino Médio

Estudante responde 52 perguntas sobre interesses, valores, preferências e habilidades, recebe um perfil RIASEC com profissões explicadas, explora e compara carreiras e segue próximos passos para investigar o futuro.

[Protótipo navegável](https://jornadas-roadmap-jg-27.vercel.app/#/p/teste-vocacional) · [Ver na plataforma](https://jornadas-roadmap-jg-27.vercel.app/#/jornada/teste-vocacional) · [Branch `teste-vocacional-geniex`](https://github.com/nandopandp-cloud/Jornadas-Roadmap-JG-27/tree/teste-vocacional-geniex)

### Relatórios do Teste Vocacional

**Educadores · Relatórios institucionais** · Professores do Ensino Médio

Em Relatórios › Atividades, o educador escolhe a escola, acompanha por turma quem concluiu, está fazendo ou não começou o Teste Vocacional e abre o relatório individual de cada estudante: código RIASEC, radar das seis áreas, profissões para explorar, valores, preferências, habilidades percebidas e uma síntese para apoiar conversas de orientação.

[Protótipo navegável](https://jornadas-roadmap-jg-27.vercel.app/#/p/relatorios-teste-vocacional) · [Ver na plataforma](https://jornadas-roadmap-jg-27.vercel.app/#/jornada/relatorios-teste-vocacional) · [Branch `relatorios-teste-vocacional`](https://github.com/nandopandp-cloud/Jornadas-Roadmap-JG-27/tree/relatorios-teste-vocacional)

### Batalhas VS GenieX

**GenieX · Plataforma do Estudante** · Estudantes do Fundamental II e do Ensino Médio

Estudante enfrenta o Nexo na Batalha Solo (10 questões, até 3 disciplinas, 45 s por questão, vitória com 7 acertos) ou desafia um colega da mesma série na Batalha VS (mesmos tópicos, 10 minutos por rodada, 24 h para o oponente, W.O.), com placar, resultado, gabarito e histórico em Minhas batalhas.

[Protótipo navegável](https://jornadas-roadmap-jg-27.vercel.app/#/p/batalhas-vs-geniex) · [Ver na plataforma](https://jornadas-roadmap-jg-27.vercel.app/#/jornada/batalhas-vs-geniex) · [Branch `batalhas-vs-geniex`](https://github.com/nandopandp-cloud/Jornadas-Roadmap-JG-27/tree/batalhas-vs-geniex)

### Campeonato GenieX

**GenieX · Plataforma do Estudante** · Estudantes do Ensino Médio

Estudante participa de campeonatos criados pelos educadores: desafia colegas do mesmo ano e da mesma escola (inclusive de outras turmas) em Batalhas VS de 10 questões e 10 minutos, acompanha as batalhas pendentes, sobe no ranking por vitórias (com desempate por acertos, tempo médio e ordem alfabética) e revisa as questões.

[Protótipo navegável](https://jornadas-roadmap-jg-27.vercel.app/#/p/campeonato-geniex) · [Ver na plataforma](https://jornadas-roadmap-jg-27.vercel.app/#/jornada/campeonato-geniex) · [Branch `campeonato-geniex`](https://github.com/nandopandp-cloud/Jornadas-Roadmap-JG-27/tree/campeonato-geniex)

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
