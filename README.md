# Jornadas-Roadmap-JG-27
Principais Jornadas do Roadmap 2027 — protótipos navegáveis da Jovens Gênios.

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
| `#/p/<slug>?screen=mural` | Link público começando direto num fluxo (`abertura`, `home`, `trail`, `tasks`, `mural`, `new-production`, `achievements`). Sem `screen`, começa pela abertura. |

O roteamento é por hash, então o `dist/` funciona em qualquer hospedagem estática (Vercel, Netlify, GitHub Pages) sem configurar rewrites. O link público só funciona para outras pessoas depois que o site estiver publicado.

## Voz do Luno (ElevenLabs)

A voz oficial do Luno vem da ElevenLabs. A chave **nunca vai para o navegador**: o protótipo chama `POST /api/tts` e o servidor fala com a ElevenLabs.

- **Local:** coloque `ELEVENLABS_API_KEY` e `ELEVENLABS_VOICE_ID` em `.env.local` (ou `env.local`) e rode `npm run dev`. Opcional: `ELEVENLABS_MODEL_ID` (padrão `eleven_multilingual_v2`).
- **Publicado (Vercel):** a função `api/tts.ts` já está pronta. Cadastre as mesmas variáveis em *Project Settings → Environment Variables*.
- **Fallback:** se a ElevenLabs falhar (sem créditos, chave inválida, plano sem acesso à voz, demora acima de 6s ou hospedagem sem servidor, como GitHub Pages), a narração usa automaticamente a voz pt-BR do sistema.
- **Economia de créditos:** cada frase é gerada uma vez e fica guardada no cache do navegador. O endpoint recusa textos com mais de 280 caracteres e chamadas vindas de outros sites.

## Adicionando uma nova jornada

1. Crie `src/prototypes/<slug>/index.tsx` exportando um componente `default` (recebe `startScreen` e `embedded`).
2. Registre em `src/platform/journeys.ts`.

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

Ícones 3D: [Microsoft Fluent Emoji](https://github.com/microsoft/fluentui-emoji) (licença MIT), em `public/3d/`.
