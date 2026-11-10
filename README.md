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

1. ✅ **Mapeamento:** o navegável foi lido tela a tela. As 33 artes do Make (Nexo, cenas, banners e avatares) foram refeitas em alta resolução com Real-ESRGAN x4plus (4×) e estão na página **02 · Assets**. O de-para Make → bibliotecas está na página **00 · Mapeamento de bibliotecas**.
2. ✅ **Piloto:** a tela Início (primeiro acesso), na página **01 · Piloto · Validação**, foi aprovada em 09/11/2026.
3. ✅ **Todas as telas** em Desktop 1440 (**05**), Tablet 768 (**06**) e Celular 375 (**07**): 26 telas por largura.
4. ✅ **Sobrepostos** (página **08**), sempre com véu: Reportar questão, Sair da batalha (Solo e VS) e 4 avisos.
5. ✅ **Componentes** (página **04**):
   - Shell · Sidebar Batalhas, Logo GenieX (oficial), Selo de batalha, Etiqueta de disciplina (13 × Caixa);
   - Status da batalha VS, Resultado da batalha Solo, Progresso da batalha · questão e Balão do Nexo.

   As telas usam instâncias desses componentes.
6. ✅ **Protótipo** (página **09**): 3 fluxos em Desktop e Celular (Batalha Solo completa, Desafiar um colega e Desafio recebido), com 66 ligações.
7. ✅ **Handoff** (página **10**): 8 seções e 43 notas (regras, interações, dados, responsivo e engenharia).
8. ⏳ **Navegável e registro na plataforma.**

**Avatares:** os rostos dos estudantes vêm da biblioteca Open Peeps (componente Busto), com camiseta Tee GenieX e fundo pastel. O “Você” do placar também.

**Logo:** sempre a logo oficial da GenieX (geniex-light.svg, e a dark em fundo escuro). Ela fica no componente local **Logo GenieX (oficial)**, que tem versão Completa e versão Ícone.

## Telas no Figma

| Seção | Telas |
| --- | --- |
| 1 · Início | 1.1 primeiro acesso · 1.2 com histórico |
| 2 · Batalha Solo · Introdução | 2.1 Enfrente o Nexo! |
| 3 · Batalha Solo · Seleção de tópicos | 3.1 tópicos escolhidos |
| 4 · Batalha Solo · Questão | 4.1 escolhendo · 4.2 correta · 4.3 incorreta · 4.4 tempo esgotado |
| 5 · Batalha Solo · Resultado | 5.1 vitória · 5.2 empate · 5.3 derrota |
| 6 · Batalha Solo · Gabarito | 6.1 com questão aberta |
| 7 · Batalha VS · Introdução | 7.1 Desafie um colega |
| 8 · Batalha VS · Escolher oponente | 8.1 estudantes da sala |
| 9 · Batalha VS · Selecionar tópicos | 9.1 falta escolher 1 tópico |
| 10 · Batalha VS · Confirmar desafio | 10.1 novo · 10.2 recebido · 10.3 retomar |
| 11 · Batalha VS · Batalha em andamento | 11.1 questão 4 de 10 |
| 12 · Batalha VS · Resultado | 12.1 aguardando · 12.2 vitória · 12.3 derrota · 12.4 empate · 12.5 W.O. |
| 13 · Batalha VS · Minhas batalhas | 13.1 todas as batalhas |
| O1–O4 (página 08) | Reportar questão · Sair da batalha (Solo) · Sair da batalha (VS) · avisos de limite de disciplinas, desafio enviado, questão reportada e tempo esgotado |

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
