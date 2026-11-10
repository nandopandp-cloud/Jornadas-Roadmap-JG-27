# Batalhas VS · GenieX

Jornada das **Batalhas** na plataforma do estudante GenieX: o estudante testa o que sabe em rodadas de 10 questões, contra o Nexo (**Batalha Solo**) ou contra um colega da mesma série (**Batalha VS**), vê o resultado e aprende com o gabarito.

> Esta branch guarda a iniciativa de Batalhas. A plataforma completa e a lista de todas as jornadas ficam no README da `main`.

## Referências

| O quê | Onde |
| --- | --- |
| Navegável de referência (Figma Make) | https://side-suds-09039219.figma.site/ |
| Arquivo do Make | https://www.figma.com/make/djkjFpjlbied3gu2zkMGWi/Batalhas |
| Figma de destino (telas) | https://www.figma.com/design/LmPvMwKodQmfkIjFFGfYem |

## Processo

1. ✅ **Mapeamento:** o navegável foi lido tela a tela. As 33 artes do Make (Nexo, cenas, banners e avatares) foram convertidas para PNG e estão na página **02 · Assets**. O de-para Make → bibliotecas está na página **00 · Mapeamento de bibliotecas**.
2. 🟡 **Piloto:** a tela Início (primeiro acesso), em Desktop 1440, está na página **01 · Piloto · Validação** e aguarda validação.
3. ⏳ **Todas as telas** em Desktop 1440, Tablet 768 e Celular 375.
4. ⏳ **Sobrepostos:** modal Reportar questão, confirmação de saída e toasts, sempre com véu.
5. ⏳ **Componentes, protótipo e handoff.**
6. ⏳ **Navegável e registro na plataforma** (quando estiver tudo pronto).

## Bibliotecas

| Biblioteca | Uso |
| --- | --- |
| 🎨 Style Guide - GenieX | Sidebar, Top Bar v2, Button, Badge, Tabs Trigger, Input, Radio, Checkbox, Toast, Progress Bars, Stepper e Avatar; tokens da coleção “3. Modes” (Light) e text styles Geist |
| 🧩 Objetos de Aprendizagem | Alternativas (Default, Selected, Sucess, Destructive, Disabled), Componente de Quiz, Opções de Reportar |
| Untitled UI Icons v7 | Ícones no estilo linha (20 px, uma cor), o padrão da GenieX |
| Lucide | Só o ícone de espadas do item **Batalhas** na sidebar |

A Sidebar da biblioteca não tem o item Batalhas. O componente local **Shell · Sidebar Batalhas** (Expandida e Recolhida) separa só a camada externa; os itens continuam instâncias da biblioteca, e o novo item fica entre Simulados e Redação.

## Telas

### Início
- **Primeiro acesso:** cabeçalho com “Ver meu histórico”, banner “Conhecimento também é uma disputa!” e os dois modos com as regras.
- **Com histórico:** cartões dos modos compactos e lista **Histórico de batalhas**.

### Batalha Solo (contra o Nexo)
- **Introdução:** “Enfrente o Nexo!” e como funciona o resultado.
- **Seleção de tópicos:** até 3 disciplinas, 1 tópico de cada; com uma disciplina só, a batalha completa com outras áreas da série.
- **Questão:** 45 segundos por questão, correção na hora, Nexo reage ao acerto e ao erro, progresso de 1 a 10.
- **Resultado:**

  | Acertos | Resultado |
  | --- | --- |
  | 7 ou mais | Vitória |
  | 5 ou 6 | Empate |
  | 4 ou menos | Derrota |

  A tela mostra também o desempenho por tópico.
- **Gabarito:** as 10 questões em acordeão, com a resposta do estudante, a correta e a explicação.

### Batalha VS (contra um colega)
- **Introdução:** como funciona e quem posso desafiar (mesma sala ou escola, mesmo ano).
- **Escolher oponente:** busca, filtros de sala ou escola e de ano, estudantes disponíveis ou indisponíveis.
- **Selecionar tópicos:** etapas 1 a 4, até 3 disciplinas e um tópico para cada; pelo menos 3 questões por tópico.
- **Confirmar desafio:**
  - novo desafio: “Enviar desafio”;
  - desafio recebido: “Aceitar e começar”;
  - rodada não concluída: “Iniciar batalha”.
- **Batalha em andamento:** placar Você × oponente, 10 minutos para a rodada, Reportar questão.
- **Resultado:**
  - aguardando o oponente, que tem até 24 horas;
  - vitória, derrota ou empate;
  - vitória por W.O. se o oponente não responder;
  - revanche.
- **Minhas batalhas:** abas Todas, Em andamento, Aguardando oponente e Finalizadas.
