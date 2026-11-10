# Jornada: Gamificação GenieX · Relatórios dos Educadores

Relatórios da gamificação da GenieX na **Plataforma Educadores**, parte do Roadmap 2027 da Jovens Gênios. Professores e gestores acompanham, por turma e por estudante, o XP válido, os elos (Bronze, Prata, Ouro, Diamante e Cósmico), as badges conquistadas e o histórico de XP. A experiência do estudante na GenieX fica na branch `gamificacao-geniex`. A visão geral da plataforma e das demais jornadas está no README da branch `main`.

- **Figma da jornada:** https://www.figma.com/design/qGV0c41SU0rexfMdxZ0Qid/Relat%C3%B3rios---Gamifica%C3%A7%C3%A3o-Geniex
- **Referências:**
  - Padrão de relatório Educadores (Teste Vocacional): relatório por turma com métricas, filtros por status e tabela; perfil do estudante com abas. As imagens estão na pasta local `public/relatorios-gamificacao-geniex/` (fora do Git).
  - Conceito da gamificação para Educadores: página “Gamificação Geniex” do arquivo [Campeonato GenieX (conceito)](https://www.figma.com/design/CFgSTHDpGqyNluCYfHxj7U/CAMPEONATO---GENIEX--CONCEITO-?node-id=28-140) (Relatórios de Estudantes com XP válido e elo; aba Gamificação do estudante).
- **PRD dos relatórios:** [PRD-relatorios.md](PRD-relatorios.md) (Relatórios de Gamificação da GenieX): XP válido, elo atual e histórico de evolução; requisitos RF01 a RF05, critérios de aceite e regras de dados.
- **PRD da Gamificação:** Sistema de Gamificação da GenieX v2.0 (copiado em `PRD.md` na branch `gamificacao-geniex`). Dele vêm as regras de XP, elos, badges e expiração e as métricas da turma (§13).
- **Protótipo navegável:** https://jornadas-roadmap-jg-27.vercel.app/#/p/gamificacao-geniex-educadores
- **Na plataforma:** https://jornadas-roadmap-jg-27.vercel.app/#/jornada/gamificacao-geniex-educadores

## Processo

1. Mapeamento das bibliotecas do arquivo ✅
2. Tela piloto para validação ✅ (aprovada em 09/11/2026)
3. Telas nas 3 larguras ✅ (Desktop 1440, Tablet 1024, Celular 390) + sobrepostos com véu
4. Componentes da jornada ✅ (Sidebar Relatórios, Medalha de elo, Emblema de badge, Exportar)
5. Protótipo (3 fluxos × Desktop/Celular) e handoff ✅
6. Navegável e entrada na plataforma ✅

## Navegável

Código em `src/prototypes/gamificacao-geniex-educadores/` (`index.tsx`, `data.ts`, `rgx.css`). Elos, badges e medalhas vêm da experiência do estudante (`src/prototypes/gamificacao-geniex/data.ts`).

| Atalho (`?screen=`) | Tela |
| --- | --- |
| `turmas` | Relatórios de Turmas: turmas com XP válido médio e elo médio, seleção para exportar (sem abas) |
| `turma` | Relatório da turma EFAFMAT8A |
| `estudantes` | Relatórios de Estudantes · aba Gamificação |
| `estudantes-elo` | Relatórios de Estudantes filtrados pelo elo Ouro, ordenados por XP válido |
| `resumo` · `elos` · `badges` · `extrato` | Relatório de gamificação da Ana Caroline |
| `exportar-turma` · `exportar-estudante` | Menu Exportar aberto, com véu |

- **Funciona de verdade:** seleção de turmas para exportar, troca de turma, busca, filtros de ano escolar e elo em Relatórios de Estudantes (com estado vazio e Limpar filtros), ordenação por XP válido e elo no cabeçalho, abas por elo (e cliques na legenda), linhas clicáveis, sub-navegação do estudante, filtro de modalidade no extrato, exportar (menu/folha com véu, Esc e clique fora fecham), sidebar recolhível e em gaveta no celular.
- **Fora do escopo:** os demais itens do menu e as outras abas do perfil mostram um aviso.

## Bibliotecas do arquivo

| Biblioteca | Uso nesta jornada |
| --- | --- |
| Cronograma de Uso - 2027 | Shell (sidebar shadcn), Barra superior, Cabeçalho da página, Cartão de métrica, Select, Campo, Aviso, Paginação, Barra de progresso |
| Relatórios de Trilhas de Aprendizagem | Alerta de delay de dados, tabela, Status Badge |
| Redação - Educadores | Botão, Avatar, Badge e text styles (Geist) |
| Lucide Icons | Ícones |

## Telas previstas

| # | Tela | Base |
| --- | --- | --- |
| T1 | Relatórios de Turmas · aba Gamificação (todas as turmas) | Tela atual de Relatórios de Turmas + indicadores da gamificação |
| T2 | Gamificação · Relatório da turma (piloto aprovado) | Teste Vocacional (turma) + métricas do PRD |
| T3 | Relatórios de Estudantes · aba Gamificação | Conceito (lista com XP válido e elo) |
| T4.1 | Estudante · Gamificação · Resumo | Conceito: elo, progresso, XP, evolução, modalidades, últimas atividades, badges |
| T4.2 | Estudante · Gamificação · Elos | Os 5 elos, histórico e regressão |
| T4.3 | Estudante · Gamificação · Badges | 25 badges por elo (PRD §11.3) |
| T4.4 | Estudante · Gamificação · Extrato de XP | Lotes com validade (PRD §11.5) |

## Requisitos do PRD nas telas

| Requisito | Onde está |
| --- | --- |
| RF01 · XP válido | T1 (média da turma), T2 (XP válido e próximo elo), T3 (coluna XP válido), T4.1 (cartão) |
| RF02 · Elo atual | T1 (elo médio), T2 (coluna e distribuição por elo), T3 (coluna), T4.1 (cartão com maior elo) |
| RF03 · Histórico de evolução | T4.1 (Evolução do XP válido), T4.2 (histórico de elos com regressões), T4.4 (extrato de lotes) |
| RF04 · Filtros e ordenação | T2: abas por elo e ordenação por XP válido. T3: select “Elo” (Todos, Bronze a Cósmico, Sem XP válido) e ordenação por XP válido e elo; estado filtrado na T3b |
| RF05 · Detalhamento individual | Ver relatório (T2) e linha da tabela (T3) abrem a T4 |

O handoff no Figma (página 10) abre com a seção **0 · PRD**, que reúne:

- o problema, a solução, o escopo e as métricas;
- os requisitos ligados às telas;
- os critérios de aceite com o que testar;
- as regras de dados: fonte única GenieX, atualização de até 2 horas e estudante sem XP;
- os eventos sugeridos para medir as métricas de sucesso.

Cada seção ganhou uma nota com os requisitos que aquela tela atende.

## Decisões

- XP por modalidade só no relatório do estudante.
- Exportar: CSV e PDF da turma com as mesmas colunas.
- Sem filtro de período.
- O Relatório de Turmas (todas as turmas) vem antes do relatório da turma.
