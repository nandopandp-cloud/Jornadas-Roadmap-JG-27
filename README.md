# Relatórios do Modo Lição · Educadores

Relatório da lição na plataforma Educadores (Relatórios › Atividades › Lição). Ele mostra ao educador engajamento, completude e aprendizagem dos estudantes em 4 abas:

1. **Visão Geral:** acompanhamento dos estudantes e Desempenho vs. Engajamento.
2. **Engajamento:** indicadores, progresso da lição, consumo dos objetos de aprendizagem e ranking de tópicos.
3. **Aprendizagem:** acurácia, proficiência, ranking da turma, aprendizagem por disciplina → tópico e questões.
4. **Glossário.**

Também tem a exportação completa em PDF.

**Protótipo navegável:** https://licao-relatorios-educadores.vercel.app

> Continuação de [`licao-criacao-educadores`](../../tree/licao-criacao-educadores), o fluxo de criação de lições. Esta iniciativa **não entra na plataforma de jornadas**. O navegável tem link e projeto Vercel próprios (`licao-relatorios-educadores`). Nesta branch, o `src/main.tsx` abre direto o protótipo.

## Status

| Etapa | Situação |
| --- | --- |
| Mapeamento (PRD + prints dos relatórios de Tarefa) | ✅ página **00 · Mapeamento** |
| Piloto desktop: R1 Visão Geral, R2 Engajamento, R3 Aprendizagem, R4 Glossário, R5 Exportar PDF, R6 Análise da questão | ✅ página **01 · Piloto**, aguardando validação |
| Layout do PDF exportado (33 páginas, no padrão do PDF de Tarefa) | ✅ página **03 · PDF do relatório**, aguardando validação |
| Navegável | ✅ https://licao-relatorios-educadores.vercel.app |

## Referências

| O quê | Onde |
| --- | --- |
| Figma | https://www.figma.com/design/mgBtd3mytxRLqNA1qBBmNK |
| Bibliotecas | Relatórios de Trilhas (Sidebar e tokens), Redação - Educadores (Botão, Aba, Busca), Cronograma de Uso (Select, Campo), Lucide |
| Template do PDF | relatório de Tarefa “contagem” (1920×1080, Inter, capa, sumário, divisórias teal) |

## Decisões até aqui

- **Situação do estudante:**
  - **Finalizado:** concluiu os conteúdos obrigatórios, ou seja, o quiz de cada tópico;
  - **Em progresso:** começou, mas ainda tem quizzes pendentes;
  - **Não iniciado:** sem nenhuma interação.
- **PDF:**
  - mesmo visual do PDF de Tarefa (1920×1080, Inter, capa, sumário, divisórias teal, tabelas de cabeçalho teal, cards de indicador e rodapé com escola e página);
  - tabelas completas, paginadas no PDF;
  - capa com a data e hora de geração.
- **Avaliação:** desempenho, acurácia e proficiência vêm só dos quizzes. Resumo, vídeo e áudio contam para o engajamento.
- **Não avaliados:** quem não iniciou fica fora do gráfico de dispersão e do ranking, mas continua nos indicadores de participação.
- **Novidades em relação a Tarefa:**
  - consumo dos objetos de aprendizagem (% de interações, número absoluto e alcance);
  - ranking de tópicos por formato e disciplina;
  - aprendizagem por disciplina → tópico;
  - análise de quem marcou cada alternativa.

## Navegável

- **Visão Geral:**
  - acompanhamento dos 44 estudantes, com ordenação, filtro por situação, busca, paginação e exportar;
  - dispersão com tooltip, filtro por quadrante (nos cards e no select) e a tabela complementar.
- **Engajamento:**
  - KPIs com meta;
  - progresso com "Ver estudantes" em cada situação;
  - consumo dos objetos em % ou em quantidade;
  - ranking de tópicos com filtro por disciplina, busca, ordenação e "Ranking completo".
- **Aprendizagem:**
  - KPIs e rubricas;
  - ranking da turma (resumido e completo, com busca e ordenação);
  - acordeão de disciplina → tópico;
  - as 39 questões com filtros e paginação, e a **análise detalhada** (quem marcou cada alternativa e navegação entre questões).
- **Glossário.**
- **Compartilhar:**
  - seleção das seções por aba;
  - **Baixar PDF** abre a prévia do documento (33 páginas, no visual do PDF de Tarefa), e **Salvar PDF** usa a impressão do navegador em 1920×1080;
  - o PDF muda de acordo com as seções escolhidas, e o sumário acompanha.

**Atalhos:** `#/?screen=` + `visao` (padrão) · `engajamento` · `aprendizagem` · `glossario` · `compartilhar` · `pdf` · `questao` · `estudantes`.

## Deploy

```bash
npm run build
cp -R dist/index.html dist/assets dist/rl <pasta-de-deploy>/   # pasta ligada ao projeto Vercel licao-relatorios-educadores
vercel deploy --prod --yes
```
