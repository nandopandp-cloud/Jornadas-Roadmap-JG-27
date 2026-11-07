# Jornada: Alfabetização (1º e 2º ano)

Protótipo navegável do **App do Estudante** para a alfabetização de crianças do 1º e 2º ano do Ensino Fundamental, parte do Roadmap 2027 da Jovens Gênios. Esta branch trata só desta jornada; a visão geral da plataforma e das demais jornadas está no README da branch `main`.

- **Link público:** https://jornadas-roadmap-jg-27.vercel.app/#/p/alfabetizacao
- **Na plataforma:** https://jornadas-roadmap-jg-27.vercel.app/#/jornada/alfabetizacao
- **Código:** `src/prototypes/alfabetizacao/`
- **Telas de referência:** `public/alfabetização/` · **Artes usadas:** `public/alfa/`

## O que dá para fazer

- **Abertura animada** seguindo o storyboard: o planeta aparece, o Luno chega acenando, as letras A, B e C ganham vida e o Luno faz o convite. A fala do Luno é sincronizada palavra a palavra com as animações. Tem botão “Pular”, e o primeiro toque libera o som (os navegadores bloqueiam áudio antes disso).
- **Escolha do avatar** entre 6 bichinhos antes de entrar na Home.
- **3 trilhas em sequência (ABC → Leitura → Escrita):** dentro de cada trilha a próxima fase desbloqueia ao concluir a anterior. Ao terminar a última fase, a criança volta para a Home, que anima o desbloqueio da próxima ilha (✓ na ilha concluída, caminho dourado, marcador “Você” pulando para a nova ilha, holofote e cadeado voando).
- **Tarefas:** pendentes, em andamento e concluídas, com 4 atividades jogáveis.
- **Mural:** “Meus trabalhinhos” e “Trabalhinhos da turma”, mais **Nova Produção** (desenho, texto, áudio e foto → revisar → publicar).
- **Conquistas:** 12 medalhas desbloqueadas pelo que a criança faz no protótipo.
- Efeitos sonoros, micro-animações (Framer Motion) e layout para celular, tablet e desktop.

## Atalhos de fluxo

Use `#/p/alfabetizacao?screen=<fluxo>` para abrir direto numa tela:

| Fluxo | Tela |
| --- | --- |
| `abertura` | Abertura animada (padrão) |
| `avatar` | Escolha do avatar |
| `home` | Início |
| `trail` | Trilha ABC |
| `tasks` | Tarefas |
| `mural` | Mural |
| `new-production` | Nova Produção |
| `achievements` | Conquistas |

O estado fica em memória: recarregar a página reinicia o protótipo.

## Voz do Luno (ElevenLabs)

A voz oficial do Luno vem da ElevenLabs. A chave **nunca vai para o navegador**: o protótipo chama `POST /api/tts` e o servidor fala com a ElevenLabs, devolvendo o áudio com o tempo de cada palavra (usado para sincronizar a abertura).

- **Local:** coloque `ELEVENLABS_API_KEY` e `ELEVENLABS_VOICE_ID` em `.env.local` (ou `env.local`) e rode `npm run dev`. Opcional: `ELEVENLABS_MODEL_ID` (padrão `eleven_multilingual_v2`).
- **Publicado (Vercel):** a função `api/tts.ts` já está pronta. Cadastre as mesmas variáveis em *Project Settings → Environment Variables*.
- **Fallback:** se a ElevenLabs falhar (sem créditos, chave inválida, plano sem acesso à voz, demora acima de 6s ou hospedagem sem servidor), a narração usa automaticamente a voz pt-BR do sistema.
- **Economia de créditos:** cada frase é gerada uma vez e fica guardada no cache do navegador. O endpoint recusa textos com mais de 280 caracteres e chamadas vindas de outros sites.

Arquivos: `server/elevenlabs.ts`, `api/tts.ts` e `src/shared/sound.ts`.

## Estrutura

```
src/prototypes/alfabetizacao/
  index.tsx        # entrada do protótipo e navegação entre telas
  store.tsx        # estado (progresso das trilhas, tarefas, mural, conquistas)
  data.ts          # trilhas, atividades, tarefas e conquistas
  assets.ts        # caminhos das artes
  alfa.css         # estilos
  components/      # Luno (mascote), balão de fala, atividades, canvas de desenho, modal de conquista…
  screens/         # Intro, AvatarSelect, Home, Trail, Lesson, Tasks, TaskPlay, Mural, NewProduction, Create, Review, Published, Achievements
```

## Artes

As ilustrações (Luno, ilhas, bichinhos, medalhas e cenários) foram recortadas das telas de referência com **rembg (BiRefNet)**, e partes escondidas foram completadas com **LaMa** (inpainting). Os ícones 3D extras vêm do [Microsoft Fluent Emoji](https://github.com/microsoft/fluentui-emoji) (licença MIT), em `public/3d/`.

## Rodando

```bash
npm install
npm run dev      # http://localhost:5173 → abra #/p/alfabetizacao
npm run build    # gera dist/
```
