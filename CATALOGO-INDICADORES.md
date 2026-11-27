# Catálogo unificado de indicadores · Novos Relatórios

Junta, sem inventar nada, o que existe hoje em duas fontes:

- **E** · Relatórios da plataforma Educadores: inventário da planilha "Inventário de indicadores — Educadores" (26/11/2026, commit `c843ef9`), com 186 ocorrências institucionais, 240 de atividades e 30 implementadas mas ocultas.
- **B** · BI (`apps/bi-nextjs`, relatórios Institucional, Tarefas, Avaliações, Redações e Competições), lido no monorepo.

**E+B** = existe nos dois (nome unificado; o nome de cada fonte vai entre parênteses quando muda). Os nomes seguem a Educadores quando o indicador existe nas duas fontes; os nomes que só existem no BI ficam como estão.

## Regras comuns

| Regra | Valor | Fonte |
| --- | --- | --- |
| Meta de estudantes ativos | 50% | E (`ACTIVE_STUDENTS_TARGET_PERCENTAGE`) |
| Meta de interações por estudante ativo | 40 | E (`INTERACTIONS_PER_STUDENT_TARGET`) |
| Meta de aprendizado adequado (Proficiente + Avançado) | 60% | E (`ADEQUATE_LEARNING_STUDENT_TARGET_PERCENTAGE`) |
| Meta de pontos de aprendizado | 1 por estudante por mês (acumulada = mês × meta) | E |
| Meta de atividades criadas | 1 por professor | E |
| Meta de professores ativos | 50% | E |
| Alfabetização | Estudantes ativos 85% · tempo médio por sessão 20 min · participação semanal 4 | E |
| Rubricas | E: Avançado, Proficiente, Básico, Insuficiente, Não avaliado · B: Avançado, Adequado, Básico, Abaixo do Básico | **decidir** o nome e a régua única (proposta do PRD: nomes da Educadores e 30/60/85) |
| Quadrantes de desempenho × engajamento | B: Referência Positiva, Necessita Apoio Pedagógico, Potencial a Ativar, Prioridade de Intervenção, com leitura e ação · E: quadrante genérico | usar os nomes e as ações do B |
| Glossário | Interação de Aprendizado, Desempenho, Proficiência, Aprendizado Adequado, Tópico Dominado, Ponto de Aprendizado (+ fases da alfabetização) | E |
| Aviso de atualização | "Os dados podem levar até 2 horas" | E |

## Institucionais

Tipos de relatório e acesso:

| Tipo | Gestor | Coordenador | Professor | Fonte |
| --- | --- | --- | --- | --- |
| Rede | ✓ | — | — | E (network) + B |
| Unidade regional | ✓ | — | — | B (filtro e entidade "Unidade regional") |
| Escola | todas | a sua | — | E (institution) + B (Instituição) |
| Turma | todas | da escola | as suas | E (class) + B |
| Professores | todos | da escola | — | E (professor) + B (Pessoas › Professores) |
| Estudante | todos | da escola | das suas turmas | E (student) + B (Pessoas › Estudantes) |
| Alfabetização | ✓ | ✓ | as suas turmas | E (literacy) |

### Indicadores-chave (cards com meta e % de atingimento)
- Estudantes ativos (%) · E+B
- Média de interações realizadas (por estudante ativo) · E+B (B: Interações por Estudante Ativo)
- Estudantes com aprendizado adequado (%) · E+B (B: Aprendizado adequado)
- Pontos de aprendizado por estudante ativo · E
- Desempenho médio (média ponderada pelas interações de aprendizagem) · B
- Professores ativos (%) · E+B
- Média de atividades criadas (por professor) · E
- Interações por professor ativo · B

### Engajamento
- Ativação ao longo do tempo · B
- Volume de uso ao longo do tempo (interações de estudantes e de professores) · B
- Distribuição de interações dos estudantes e dos educadores · B
- Atividades criadas por tipo · E
- Total de atividades criadas × meta · E
- Ranking de engajamento (% de estudantes ativos por escola ou turma, com meta) · E+B (B: Comparativo de Adoção por Entidade)
- Ranking de engajamento de professores (posição, professor, disciplina, atividades criadas, % da meta) · E
- Ranking de engajamento de estudantes (interações, meta, % da meta) · E, só na turma

### Aprendizagem
- Rubricas de proficiência (quantidade e % por rubrica, meta Proficiente + Avançado) · E+B
- Evolução da aprendizagem (mensal e acumulada × metas) · E
- Desempenho médio ao longo do tempo · B
- Desempenho por área de conhecimento e por ano escolar, com rubricas em cada área e ano · B
- Ranking de aprendizagem (% de aprendizado adequado por escola ou turma) · E
- Ranking de aprendizagem da turma (estudante, desempenho, rubrica) · E
- Tópicos (tópico, disciplina, tempo de estudo, nº de respostas, nº de acertos, desempenho, proficiência) · E+B (B: Ranking de Tópicos)
- Ranking de habilidades · B (na E existe, mas está oculto)

### Desempenho × engajamento
- Mapa por entidade: desempenho (%), engajamento (%), estudantes ativos, quadrante, mediana de engajamento e meta de desempenho · E+B (B: Mapa de Ativação × Desempenho, com mês de referência, base de estudantes, ativação e ação)

### Informações gerais (tabela por entidade)
- Estudantes, estudantes ativos, % de estudantes ativos, interações de aprendizado, tempo de estudo, interações com Edu, tempo de uso, atividades criadas, professores ativos, % de professores ativos · E
- Professores totais, interações de estudantes, interações de professores, desempenho médio · B

### Pessoas
- **Estudantes:** turma, ano escolar, interações, dias ativos, interações por dia ativo, % desempenho, rubrica, progresso nos tópicos · B
- **Professores:** instituição, turmas, interações, dias ativos, ação principal · B
- **Leitura individual do estudante:** interações totais e de aprendizagem, dias e meses ativos, interações por dia e por mês ativo, desempenho médio ao longo do tempo, dias ativos ao longo do tempo, desempenho por área · B
- **Leitura individual do professor:** interações registradas, dias ativos, interações por dia ativo, meses ativos, turmas atendidas, distribuição de ações pedagógicas, volume de uso ao longo do tempo · B

### Próprios da turma (E)
- **Por estudante:** interações de aprendizado, tempo de estudo, interações com Edu, tempo de uso. Até o 9º ano também: pontuação, quantidade de treinos, batalhas solo e batalhas VS
- **Histórico de atividades:** nome, tipo, início, término, status, criador, quantidade por mês, com o link para o relatório da atividade

### Próprios do estudante (E)
- Total de interações realizadas
- Tempo de estudo
- Pontos de aprendizado
- Proficiência geral (rubrica × rubrica-alvo)
- Interações por área de conhecimento
- Proficiência por área de conhecimento
- Tópicos

### Alfabetização (E)
- **Distribuição por fase:** não iniciado, silábica para alfabética, alfabética para ortográfica, ortográfica para letrada
- **Níveis:**
  - não avaliados (menos de 10 respostas);
  - precisam de apoio (0 a 30%);
  - em desenvolvimento (30 a 65%);
  - atendem expectativas (65 a 85%);
  - acima da expectativa (85 a 100%).
- Tempo médio por sessão, estudantes ativos e média de participação semanal
- Estudantes por dia da semana
- Distribuição do tempo de sessão (0 a 10, 10 a 20, 20 a 30 e mais de 30 min)
- Tendência de engajamento
- Engajamento por fase
- Tempo de estudo por fase
- Proficiência dos estudantes
- Proficiência por habilidade

## Atividades

Códigos: ASSIGNMENT = Tarefa · SUMMATIVE = Prova Genial · CHALLENGE = Desafio Adaptativo · CHAMPIONSHIP = Campeonato · PROJECT = Projeto · DIAGNOSTIC = Raio-X.

| Tipo | Fonte | Observação |
| --- | --- | --- |
| Tarefa | E + B (Relatório de tarefas) | |
| Prova Genial | E + B (Relatório de avaliações) | escala SAEB, TRI e NSE vêm do B |
| Desafio Adaptativo | E | |
| Campeonato | E | ranking por batalhas, vitórias e derrotas |
| Projeto | E | a análise detalhada de questão não funciona em projeto |
| Raio-X | E | |
| Redação | B | |
| Competições (Olimpíadas, Liga das Estrelas) | B (Ranking de Competições) | a E não tem indicadores de Olimpíadas |
| Aula Invertida | — | **sem indicadores hoje**: não entra até existir |

### Comum a todos os tipos (E)
- Cabeçalho: nome, status e datas
- Glossário
- Informações gerais por estudante e por tópico
- Rubricas de proficiência (% por rubrica e meta Proficiente + Avançado)
- Progresso dos estudantes
- Ranking de aprendizagem da turma
- Desempenho × engajamento (desempenho, interações realizadas, quadrante, mediana e meta)
- Questões mais erradas (número de respostas, taxa de acerto, enunciado)
- Questões respondidas pelo estudante (tópico, enunciado, alternativas e habilidade da questão)

### Por tipo
- **Tarefa:**
  - E: estudantes ativos, estudantes que finalizaram, média de interações realizadas, estudantes com aprendizado adequado, taxa de acurácia, progresso, pontos e ranking de tópicos.
  - B: tarefas iniciadas, tarefas concluídas, desempenho médio, desempenho médio ao longo do tempo, desempenho por área e por ano escolar, questões (taxa de acerto, tentativas, dificuldade, sinais, questões com sinal, tempo médio por tentativa) e ranking de tarefas (total, concluídas %).
  - B, estudante: questões vistas, interações, tempo total, posição, percentil, média da tarefa, delta para a média, tópicos e habilidades com mais dificuldade e dominados.
- **Prova Genial:**
  - E: estudantes ativos, tempo médio de resolução, estudantes bloqueados, média de notas, estudantes com aprendizado adequado, histograma de notas, ranking de estudantes (nota, proficiência), análise detalhada da questão (distribuição de respostas, alternativas e gabarito, respostas dos estudantes).
  - B: participação (estudantes previstos, que iniciaram e que concluíram), desempenho médio, desempenho por área e por ano escolar, questões respondidas, escala de proficiência por nível com descritores, habilidade TRI média, questões (respostas, dificuldade na escala SAEB, taxa de acerto, tempo médio por questão, habilidades e descritores), ranking de descritores e de habilidades, habilidades e descritores prioritários.
  - B, socioeconômico: NSE (Inse do Saeb), gênero, raça/cor, idade, deficiência e respostas ao questionário.
  - B, estudante: questões corretas, tempo total, onde apoiar (tópicos com mais dificuldade e com melhor desempenho).
- **Desafio Adaptativo:**
  - Estudantes ativos, média de interações realizadas, estudantes com aprendizado adequado e taxa de acurácia.
  - Nível alcançado, pontos e pontos obtidos.
  - Posição e classificação no ranking.
  - Ranking de tópicos.
- **Campeonato:**
  - Estudantes ativos e média de batalhas por estudante.
  - Batalhas realizadas, vitórias, derrotas e % de vitórias.
  - Ranking de estudantes e de tópicos por batalhas.
  - Percentual de acertos no campeonato e classificação do aluno.
- **Projeto:**
  - Estudantes ativos e estudantes que finalizaram.
  - Data de envio e data de conclusão dos quizzes.
  - Conclusão e percentual de acertos no projeto.
  - Projetos enviados: nível de proficiência, autoavaliação, perguntas feitas ao aluno, arquivos, avaliados e não avaliados.
- **Raio-X:**
  - Raio-X finalizados e estudantes que finalizaram.
  - Média de acertos e histograma de acertos.
  - Ranking de estudantes por acertos.
  - Por estudante: quantidade de acertos, média de acerto da turma, tempo médio de resposta e comparativo de conclusão.
- **Redação (B):**
  - Redações iniciadas, redações enviadas, taxa de envio, nota média (0 a 1.000) e estudantes que iniciaram.
  - Distribuição de proficiência e de notas.
  - Engajamento diário.
  - Desempenho por ano escolar e rubricas por ano.
  - Ranking de temas (com enunciado e textos motivadores) e de critérios (desempenho por critério).
  - Ranking de estudantes e redações do estudante (enviada ou rascunho).
- **Competições (B):**
  - Participantes, pontuação do líder, pontos distribuídos e média de pontos.
  - Ranking atual: posição, estudante, turma, instituição, unidade regional, ano escolar, pontos e última pontuação.

## Filtros e saídas
- **Período:** E+B.
- **Unidade regional, instituição, turma e ano escolar:** B (filtros avançados).
- **Componente / área de conhecimento:** E+B.
- **Por tipo de atividade:** busca, ordenação, paginação e quadrante (E); tipo e tema (Redação, B).
- **Exportar:** PDF institucional e CSV/Excel das tabelas (E e B).
- **Compartilhar:** compartilhar (E).
