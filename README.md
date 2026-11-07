# Jornadas-Roadmap-JG-27
Principais Jornadas do Roadmap 2027 — protótipos navegáveis da Jovens Gênios.

## Sobre o projeto

Plataforma simples para apresentar e compartilhar os protótipos das iniciativas do Roadmap 2027. À esquerda fica a lista de jornadas; ao escolher uma, o protótipo abre numa prévia em Desktop, Tablet ou Celular, com atalhos para cada fluxo. Cada jornada também tem um **link público** que abre só o protótipo, em tela cheia, para enviar a quem precisar testar.

Os protótipos são 100% navegáveis, independentes entre si e construídos fielmente a partir das telas de referência do time (guardadas em `public/<iniciativa>/`). Funcionam no desktop e no celular, com micro-animações. Os dados são fictícios e ficam em memória: recarregar a página reinicia o protótipo.

**Publicado em:** https://jornadas-roadmap-jg-27.vercel.app

### Jornadas

| Jornada | Plataforma | Público | Link público |
| --- | --- | --- | --- |
| Alfabetização | App do Estudante | 1º e 2º ano (EF) | `#/p/alfabetizacao` |
| Cronograma de Uso | Plataforma Educadores | Gestores e professores | `#/p/cronograma` |
| Flashcards | GenieX · Estudante | Ensino Médio | `#/p/flashcards` |
| Lojinha | Exploradores · Estudante | Clube Jovens Gênios | `#/p/lojinha` |

Só a Alfabetização tem áudio (voz do Luno via ElevenLabs); as demais iniciativas não usam som.

### Tecnologia

- **Vite + React 19 + TypeScript**, animações com **Framer Motion**, ícones **lucide-react**, QR Codes com **qrcode**.
- Roteamento por hash, site estático e uma função serverless (`api/tts.ts`) para a voz.
- Hospedagem na **Vercel** (`vercel deploy --prod`).

### Estrutura

```
src/
  platform/        # plataforma: Hub (sidebar + prévia), link público, compartilhar (QR/WhatsApp), registro das jornadas
  prototypes/
    alfabetizacao/ # cada protótipo: index.tsx, store, dados, components/ e screens/
    cronograma/
    flashcards/
    lojinha/
  shared/          # som e voz (Alfabetização)
server/, api/      # proxy da ElevenLabs (local e Vercel)
public/
  alfa/ cron/ flash/ loja/   # artes usadas pelos protótipos (.webp)
  3d/                        # ícones 3D (Fluent Emoji)
  <iniciativa>/              # telas de referência (não vão para o site publicado)
```

### Artes

As ilustrações são recortadas das próprias telas de referência: remoção de fundo com **rembg (BiRefNet)**, remoção de textos e selos com **LaMa** (inpainting) e, quando necessário, aumento de nitidez com **Real-ESRGAN**. Os textos dos banners e cartões são refeitos em HTML para ficarem nítidos e animados. No build, as imagens de referência são descartadas e só as pastas de arte entram no `dist/` (lista `ARTE_DO_APP` em `vite.config.ts`).

## Rodando

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/ (site estático)
```

## Como funciona

| Link | O que abre |
| --- | --- |
| `#/` ou `#/jornada/<slug>` | Plataforma: sidebar com as jornadas + preview em Desktop/Tablet/Celular |
| `#/p/<slug>` | **Link público**: só o protótipo, em tela cheia, sem a plataforma |
| `#/p/<slug>?screen=<fluxo>` | Link público começando direto num fluxo (os mesmos atalhos da plataforma, ex.: `#/p/lojinha?screen=resgates`). Sem `screen`, começa pela tela inicial. |

O roteamento é por hash, então o `dist/` funciona em qualquer hospedagem estática (Vercel, Netlify, GitHub Pages) sem configurar rewrites. O link público só funciona para outras pessoas depois que o site estiver publicado.

## Voz do Luno (ElevenLabs)

A voz oficial do Luno vem da ElevenLabs. A chave **nunca vai para o navegador**: o protótipo chama `POST /api/tts` e o servidor fala com a ElevenLabs.

- **Local:** coloque `ELEVENLABS_API_KEY` e `ELEVENLABS_VOICE_ID` em `.env.local` (ou `env.local`) e rode `npm run dev`. Opcional: `ELEVENLABS_MODEL_ID` (padrão `eleven_multilingual_v2`).
- **Publicado (Vercel):** a função `api/tts.ts` já está pronta. Cadastre as mesmas variáveis em *Project Settings → Environment Variables*.
- **Fallback:** se a ElevenLabs falhar (sem créditos, chave inválida, plano sem acesso à voz, demora acima de 6s ou hospedagem sem servidor, como GitHub Pages), a narração usa automaticamente a voz pt-BR do sistema.
- **Economia de créditos:** cada frase é gerada uma vez e fica guardada no cache do navegador. O endpoint recusa textos com mais de 280 caracteres e chamadas vindas de outros sites.

## Adicionando uma nova jornada

1. Crie `src/prototypes/<slug>/index.tsx` exportando um componente `default` (recebe `startScreen` e `embedded`).
2. Registre em `src/platform/journeys.ts` (nome, plataforma, público, dispositivo da prévia e atalhos de fluxo).
3. Se tiver uma pasta de arte nova em `public/`, inclua-a em `ARTE_DO_APP` no `vite.config.ts`.

## Protótipo: Alfabetização (1º e 2º ano)

- **Abertura animada (~7s)** seguindo o storyboard: o planeta aparece → Luno chega acenando → letras A, B, C ganham vida → convite com balão de fala → transição para a Home. Tem botão “Pular”, e o primeiro toque libera o som (os navegadores bloqueiam áudio antes disso).
- **3 trilhas em sequência (ABC → Leitura → Escrita)**: dentro de cada trilha, a próxima fase desbloqueia ao concluir a anterior. Ao terminar a última fase, a criança volta para a Home, que anima o desbloqueio da próxima ilha (✓ na ilha concluída, caminho dourado, marcador “Você” pulando para a nova ilha, holofote e cadeado voando).
- **Tarefas**: pendentes, em andamento e concluídas, com 4 atividades jogáveis.
- **Mural** (“Meus trabalhinhos” e “Trabalhinhos da turma”) + **Nova Produção**: desenho, texto, áudio e foto → revisar → publicar.
- **Conquistas**: 12 medalhas desbloqueadas pelo que a criança faz no protótipo.
- Narração em pt-BR (voz do sistema), efeitos sonoros sintetizados e micro-animações (Framer Motion).
- Arte recortada das telas de referência, em `public/alfa/`.

## Protótipo: Cronograma de Uso (Educadores)

Independente da Alfabetização e **sem áudio** (não usa ElevenLabs nem narração).

- **Como criar:** ao criar um cronograma, o gestor escolhe entre **Criar na plataforma** (fluxo guiado em 4 etapas: definir escopo → configurar programações com aplicação em massa → revisar e ajustar pendências → finalizar e publicar/agendar) ou **Usar planilha (CSV)**, descrito abaixo.
- **Gestor (planilha):** lista de escolas da rede (busca, status, Abrir/Criar/Continuar) → importar CSV (arrastar e soltar, modelo oficial para baixar, arquivo de exemplo) → análise animada → revisão das 12 inconsistências (aceitar, escolher outra correspondência ou manter; obrigatórias bloqueiam o avanço) → revisão do cronograma por mês (filtros, busca, ordenação, editar, excluir com desfazer, nova atividade) → resumo e publicação.
- **Calendário escolar:** grade mensal com atividades agendadas e sugeridas, painel do dia, filtros, visão em tabela e nova atividade no dia.
- **Professor:** troque o perfil clicando no usuário (rodapé do menu). Início com banner, recomendações (Pendentes, Criadas, Todas), criar atividade/avaliação, minicalendário e próximos eventos.

O estado fica em memória: recarregar a página reinicia o protótipo.

## Protótipo: Flashcards (GenieX · Estudante)

Independente das demais jornadas e **sem áudio**. Plataforma GenieX do estudante do Ensino Médio.

- **Entrada:** Página inicial (Para você, Perfil, Continue aprendendo, Cronograma) → item **Flashcards** no menu (com selo “Novo”) → apresentação da funcionalidade e “Meus acessos”.
- **Criar flashcards:** escolher até **5 disciplinas** (busca, filtro por área do conhecimento, painel “Seleções atuais”) → escolher os **tópicos** de cada disciplina (acordeão “Suas seleções”, validação de disciplina sem tópico) → **gerando** com progresso animado por seleção → os grupos novos aparecem no topo de “Meus grupos” com destaque.
- **Estudar:** card com “Ver resposta” (virada 3D e modo foco com o cabeçalho compacto), **Não sei / Eu sei / Revisar depois**, setas, lista “Cards do grupo” com filtro por tópico e status, favoritar card/grupo, abas Resumo e Desempenho. Atalhos: espaço, ← →, 1, 2, 3.
- **Sessão concluída:** anel de progresso, acertos/revisar/erros, cards favoritados, desempenho por tópico, lista “Revisar depois” e estudar novamente.
- **Favoritos e Histórico:** filtros por curso e tópico, busca, ordenação, card que vira para mostrar a resposta, remover com desfazer; histórico de sessões com taxa de acertos.

Atalhos de fluxo na plataforma abrem com o cenário das referências (Literatura 8/24, História, Matemática e 12 favoritos). Banco de conteúdo em `src/prototypes/flashcards/data.tsx` (12 disciplinas, 6 tópicos cada).

## Protótipo: Lojinha (Exploradores)

Independente das demais jornadas e **sem áudio**. Plataforma dos Exploradores, com saldo de pontos do Clube Jovens Gênios.

- **Loja:** banner de boas-vindas, 6 categorias (Avatares, Backgrounds, Pets, Cards, Personalização, Recompensas exclusivas) e destaques.
- **Categoria:** filtros por raridade com contagem (Comum, Raro, Épico, Lendário), ordenação e grade animada; 24 trajes de avatar.
- **Detalhe e resgate:** galeria com setas, miniaturas e arrastar; favoritar; confirmação com a conta do saldo; presente abrindo com confete; gemas voando até o saldo no topo; item digital liberado em alguns segundos (com notificação) e “Usar como avatar”; aviso de pontos insuficientes.
- **Meu Cartão:** cartão fidelidade com inclinação 3D e verso com QR Code; saldo, QR Code e copiar ID.
- **Histórico:** filtros por tipo e período, entradas e saídas. **Meus Resgates:** tabela com status e painel com linha do tempo. **Regras:** 7 tópicos.

O atalho “Loja” começa antes do resgate do Traje Explorador (saldo 245.800); os atalhos Meu Cartão, Histórico e Meus Resgates já mostram o traje resgatado, como nas referências.

Ícones 3D: [Microsoft Fluent Emoji](https://github.com/microsoft/fluentui-emoji) (licença MIT), em `public/3d/`.
