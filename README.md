# Jornada: Flashcards (GenieX · Estudante)

Protótipo navegável da funcionalidade de **Flashcards** da plataforma GenieX, para estudantes do Ensino Médio revisarem conteúdos com cards de pergunta e resposta, parte do Roadmap 2027 da Jovens Gênios. Esta branch trata só desta jornada; a visão geral da plataforma e das demais jornadas está no README da branch `main`.

- **Link público:** https://jornadas-roadmap-jg-27.vercel.app/#/p/flashcards
- **Na plataforma:** https://jornadas-roadmap-jg-27.vercel.app/#/jornada/flashcards
- **Código:** `src/prototypes/flashcards/`
- **Telas de referência:** `public/flashcards/` · **Artes usadas:** `public/flash/`
- **Áudio:** não usa (sem narração nem ElevenLabs).

## O que dá para fazer

- **Entrada:** Página inicial (Para você, Perfil, Continue aprendendo, Cronograma) → item **Flashcards** no menu (selo “Novo”) → apresentação da funcionalidade e “Meus acessos”.
- **Criar flashcards:** escolher até **5 disciplinas** (busca, filtro por área do conhecimento) → escolher os **tópicos** de cada uma, com passos por disciplina e aviso para ir à próxima → **gerando** com progresso animado → os grupos novos aparecem no topo de “Meus grupos”.
- **Estudar:** toque no card para **virar em 3D** e ver a resposta; **Não sei / Revisar depois / Eu sei** em destaque; lista “Cards do grupo” com filtro e status; favoritar card e grupo; abas Resumo e Desempenho. Atalhos: espaço, ← →, 1, 2, 3.
- **Sessão concluída:** anel de progresso, acertos, revisar e erros, desempenho por tópico e lista “Revisar depois”.
- **Favoritos e Histórico:** filtros, busca, ordenação, card que vira para mostrar a resposta; histórico de sessões com taxa de acertos.

## Atalhos de fluxo

Use `#/p/flashcards?screen=<fluxo>` para abrir direto numa tela:

| Fluxo | Tela |
| --- | --- |
| `inicio` | Página inicial (padrão) |
| `landing` | Entrada Flashcards |
| `disciplinas` | Escolher disciplinas |
| `topicos` | Escolher tópicos |
| `gerando` | Gerando flashcards |
| `grupos` | Meus grupos |
| `estudo` | Estudar grupo |
| `resposta` | Resposta revelada |
| `concluida` | Sessão concluída |
| `favoritos` | Favoritos |
| `historico` | Histórico |

Os atalhos a partir de “Meus grupos” abrem com o cenário das referências (Literatura 8/24, História, Matemática e 12 favoritos).

## Estrutura

```
src/prototypes/flashcards/
  index.tsx        # shell GenieX (menu lateral, topo, transições)
  store.tsx        # estado (grupos, progresso, favoritos, seleção, histórico)
  data.tsx         # banco de conteúdo: 12 disciplinas, 6 tópicos cada, perguntas e respostas
  components/      # ui, cards de grupo e favoritos, resultado (anel, legenda, desempenho)
  screens/         # Inicial, Landing, Disciplinas, Topicos, Gerando, Home, Estudo, Concluida
  flash.css
```

O estado fica em memória: recarregar a página reinicia o protótipo.

## Rodando

```bash
npm install
npm run dev      # http://localhost:5173 → abra #/p/flashcards
npm run build    # gera dist/
```
