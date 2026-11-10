# Campeonato · GenieX

Jornada do **Campeonato** na plataforma do estudante GenieX. Os educadores criam o campeonato. O estudante do Ensino Médio desafia colegas do mesmo ano e da mesma escola (inclusive de outras turmas) em Batalhas VS, acompanha as batalhas pendentes e sobe no ranking por vitórias.

> Esta branch guarda a iniciativa do Campeonato. A plataforma completa e a lista de todas as jornadas ficam no README da `main`. O PRD completo está em [PRD.md](PRD.md).

## Referências

| O quê | Onde |
| --- | --- |
| Telas de conceito (14 frames, 3 fluxos de protótipo) | https://www.figma.com/design/CFgSTHDpGqyNluCYfHxj7U (página “Campeonato”) |
| Figma de destino (telas) | https://www.figma.com/design/rXH2XCv3MCabtDHDawkJad |
| PRD | [PRD.md](PRD.md) (v1.0) |
| Batalhas VS (regras que o campeonato reaproveita) | branch `batalhas-vs-geniex` |

## Escopo desta branch

- **Só o estudante (GenieX).**
- Os relatórios dos Educadores (lista de campeonatos, Visão geral, Engajamento, Aprendizagem e Glossário) ficam para uma **branch separada**, depois que a parte do estudante estiver pronta.
- A criação do campeonato pelo educador (Feature 01 do PRD) também fica fora desta branch.

## Decisões (09/11/2026)

| Tema | Conceito | Decisão |
| --- | --- | --- |
| Conteúdo da batalha | Disciplinas e tópicos definidos pelo educador | **O estudante escolhe** de 1 a 3 disciplinas do campeonato e 1 tópico de cada (PRD, Feature 05). A nova batalha ganha a etapa “Disciplinas e tópicos”. |
| Pontos e XP | +12 pontos e +50 XP por batalha; ranking por pontos | **Sem pontos e sem XP.** O ranking é por vitórias, com desempate por acertos acumulados, menor tempo médio nas corretas e ordem alfabética (PRD, Feature 10). As batalhas não geram XP (decisão de 09/11). |
| Tempo | “Até 1 minuto por questão” ou “sem tempo fixo” | **10 minutos** para as 10 questões, por participante (PRD, RN07). |
| Desafio recebido | Botões “Aceitar” | **Sem etapa de aceite** (PRD, Feature 06). O botão vira “Responder”. |
| Avatares | Ilustrações do conceito | **Biblioteca de avatares** (Open Peeps, componente Busto), como nas Batalhas. |

## Bibliotecas

| Biblioteca | Uso |
| --- | --- |
| 🎨 Style Guide - GenieX | Sidebar, Top Bar v2, Tabs Trigger, Button, Badge, Stepper, Input e tokens da coleção “3. Modes” (Light); texto em Geist |
| 🧩 Objetos de Aprendizagem | Alternativas e Componente de Quiz (questão da batalha) |
| Untitled UI Icons v7 | Ícones de linha, o padrão da GenieX |
| Lucide | Espadas do item e da aba Batalhas |
| Open Peeps (Busto) | Todos os avatares de estudantes |

Componentes locais (página **04**): **Logo GenieX (oficial)** e **Shell · Sidebar Campeonato** (Expandida e Recolhida), com os itens Campeonatos e Batalhas depois de Simulados.

## Dados de exemplo

A estudante logada é a **Mariana Alves** (1º ano A, Escola GenieX), em **5º lugar** na Copa GenieX · 1º ano (01 a 30 nov. 2026, 128 participantes, Matemática, Física e Química). Ela tem 9 vitórias, 81 acertos e 23 s de tempo médio. O João Pedro tem as mesmas vitórias e acertos; ela fica à frente pelo tempo médio, o que mostra o desempate do PRD.

## Processo

1. ✅ **Mapeamento** (página **00**): telas de conceito, PRD e bibliotecas. As artes foram recortadas do conceito e ampliadas 4× (Real-ESRGAN x4plus). Nas peças soltas, o fundo foi removido (página **02 · Assets**).
2. ✅ **Tela piloto** (página **01**): Visão geral da Copa. Aprovada em 10/11/2026.
3. ✅ **Todas as telas** em Desktop 1440 (**05**), Tablet 768 (**06**) e Celular 375 (**07**): 21 telas por largura.
4. ✅ **Sobrepostos** (página **08**), sempre com véu (40% nos modais, 24% nos avisos): 7 por largura.
5. ✅ **Componentes** (página **04**): 11 sets da jornada, usados como instâncias em todas as telas.
6. ✅ **Protótipo** (página **09**, 4 fluxos em Desktop e Celular, 44 ligações) e **handoff** (página **10**, 11 seções com 38 notas no padrão do time).
7. ⏳ **Navegável** e registro como navegável na plataforma.

## Telas no Figma

| Seção | Telas |
| --- | --- |
| 1 · Campeonatos | 1.1 lista (em andamento e encerrados) · 1.2 vazio |
| 2 · Visão geral | 2.1 em andamento · 2.2 encerrado |
| 3 · Batalhas | 3.1 aba Batalhas (desafios recebidos, oponentes, minhas batalhas) · 3.2 Minhas batalhas (histórico) |
| 4 · Ranking | 4.1 classificação com pódio e destaque “Você” |
| 5 · Regras | 5.1 como funciona, regras, ranking e dúvidas |
| 6 · Nova batalha · Oponente | 6.1 escolher oponente |
| 7 · Nova batalha · Disciplinas e tópicos | 7.1 válido · 7.2 falta escolher tópico |
| 8 · Nova batalha · Resumo | 8.1 resumo da batalha |
| 9 · Batalha | 9.1 questão em andamento (10 min) |
| 10 · Resultado | 10.1 aguardando · 10.2 vitória · 10.3 empate · 10.4 derrota · 10.5 W.O. · 10.6 sem vencedor |
| 11 · Revisão | 11.1 revisão das questões |
| Sobrepostos (08) | O1 Sair da batalha · O2 Tempo esgotado · O3 Desafio enviado · O4 Limite de disciplinas · O5 Conteúdo indisponível · O6 Copa encerrada · O7 Oponente indisponível |

## Componentes da jornada (página 04)

- Status
- Selo de posição
- Disciplina · Ícone
- Disciplina · Chip
- Abas do campeonato
- Etapas da nova batalha
- Número
- Marcador de questão
- Quadrado de progresso
- Card de oponente
- Linha de batalha

Também na página 04: **Shell · Sidebar Campeonato** e **Logo GenieX (oficial)**.

## Protótipo (página 09)

1. **Nova batalha completa:** lista → visão geral → oponente → disciplinas → resumo → questão → aguardando → revisão.
2. **Abas do campeonato.**
3. **Desafio recebido:** responder → vitória → ranking.
4. **Copa encerrada.**

## Pontos em aberto (handoff)

- Validação técnica do PRD §10: fórmula do tempo médio, disponibilidade de questões, mudança de matrícula, rotina de encerramento e ordenação determinística.
- Definir se os acertos de uma batalha encerrada sem vencedor entram nos acertos acumulados.
