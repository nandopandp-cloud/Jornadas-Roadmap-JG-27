# Relatórios do Modo Lição · Educadores

Relatório da lição na plataforma Educadores (Relatórios › Atividades › Lição). Ele mostra ao educador engajamento, completude e aprendizagem dos estudantes em 4 abas:

1. **Visão Geral:** acompanhamento dos estudantes e Desempenho vs. Engajamento.
2. **Engajamento:** indicadores, progresso da lição, consumo dos objetos de aprendizagem e ranking de tópicos.
3. **Aprendizagem:** acurácia, proficiência, ranking da turma, aprendizagem por disciplina → tópico e questões.
4. **Glossário.**

Também tem a exportação completa em PDF.

> Continuação de [`licao-criacao-educadores`](../../tree/licao-criacao-educadores), o fluxo de criação de lições. Esta iniciativa **não entra na plataforma de jornadas**. Quando o Figma for validado, o navegável fica nesta branch, com projeto Vercel próprio.

## Status

| Etapa | Situação |
| --- | --- |
| Mapeamento (PRD + prints dos relatórios de Tarefa) | ✅ página **00 · Mapeamento** |
| Piloto desktop: R1 Visão Geral, R2 Engajamento, R3 Aprendizagem, R4 Glossário, R5 Exportar PDF, R6 Análise da questão | ✅ página **01 · Piloto**, aguardando validação |
| Layout do PDF exportado (33 páginas, no padrão do PDF de Tarefa) | 🔧 página **03 · PDF do relatório** |
| Navegável | ⏳ depois da validação |

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
- **Avaliação:** desempenho, acurácia e proficiência vêm só dos quizzes. Resumo, vídeo e áudio contam para o engajamento.
- **Não avaliados:** quem não iniciou fica fora do gráfico de dispersão e do ranking, mas continua nos indicadores de participação.
- **Novidades em relação a Tarefa:**
  - consumo dos objetos de aprendizagem (% de interações, número absoluto e alcance);
  - ranking de tópicos por formato e disciplina;
  - aprendizagem por disciplina → tópico;
  - análise de quem marcou cada alternativa.
