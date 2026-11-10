# PRD — Relatórios de Campeonato | Geniex

# 1. Identificação do produto

**Produto:** Geniex
**Plataforma:** Educadores
**Funcionalidade:** Relatórios de Campeonato
**Público-alvo:** Educadores, coordenadores pedagógicos e gestores escolares.
**Status:** Em definição
**Prioridade:** Alta

---

# 2. Visão geral

## 2.1. Contexto

A Geniex possui uma funcionalidade de Campeonato que permite aos estudantes participarem de disputas de conhecimento com outros estudantes da mesma escola e do mesmo ano escolar.

Os campeonatos são criados e configurados pelos educadores na plataforma Educadores. Durante sua execução, os estudantes realizam batalhas entre si, respondendo a questões relacionadas às disciplinas e aos tópicos definidos para o campeonato.

Para acompanhar a participação dos estudantes, avaliar seus resultados e identificar oportunidades de intervenção pedagógica, será necessário disponibilizar relatórios gerenciais na plataforma Educadores.

A proposta é desenvolver uma experiência de relatórios baseada nas estruturas e nos indicadores já existentes nos relatórios de Campeonato do Ensino Fundamental, adaptando-os às características da Geniex.

A principal diferença funcional é que um campeonato da Geniex poderá contemplar **até três disciplinas diferentes**, enquanto a referência do Ensino Fundamental considera uma única disciplina.

Além disso, os relatórios da Geniex deverão apresentar o **tempo médio utilizado para responder às questões respondidas corretamente**, permitindo uma análise complementar do desempenho dos estudantes.

## 2.2. Objetivo

Disponibilizar aos educadores uma visão consolidada do engajamento, da participação, do desempenho e da aprendizagem dos estudantes durante os campeonatos realizados na Geniex.

A funcionalidade deverá permitir que os educadores:

- Acompanhem a participação dos estudantes.
- Identifiquem estudantes que realizaram ou não batalhas.
- Consultem a quantidade de batalhas realizadas, vitórias e derrotas.
- Analisem os resultados de aprendizagem.
- Acompanhem a taxa de acurácia e a distribuição dos estudantes por rubricas de proficiência.
- Identifiquem estudantes com melhor desempenho.
- Analisem a relação entre engajamento e desempenho.
- Consultem os resultados das questões que compõem o campeonato.
- Avaliem o tempo médio de resposta das questões respondidas corretamente.
- Exportem os dados para análises complementares.

## 2.3. Problema a ser resolvido

Sem relatórios estruturados, o educador possui limitações para compreender como os estudantes estão participando dos campeonatos e quais resultados estão alcançando.

A simples visualização do ranking não é suficiente para uma análise pedagógica completa. Embora a classificação permita identificar os estudantes que venceram mais batalhas, ela não demonstra, isoladamente, o nível de aprendizagem, a precisão das respostas ou o comportamento de participação de cada estudante.

O relatório deverá complementar a experiência do campeonato, transformando os dados das batalhas em informações úteis para o acompanhamento pedagógico.

---

# 3. Premissas do produto

**P01 — Criação do campeonato.** Os campeonatos são criados e configurados pelo educador na plataforma Educadores.

**P02 — Público participante.** As batalhas são realizadas entre estudantes da mesma escola e do mesmo ano escolar, podendo envolver estudantes de turmas diferentes.

**P03 — Disciplinas.** Um campeonato da Geniex poderá contemplar de uma a três disciplinas, conforme a configuração realizada pelo educador.

**P04 — Tópicos.** Cada disciplina selecionada para o campeonato deverá possuir um tópico associado, conforme as regras de configuração do campeonato.

**P05 — Consolidação dos resultados.** Os relatórios deverão apresentar uma visão consolidada dos resultados do campeonato, sem duplicar estudantes ou batalhas em razão da existência de múltiplas disciplinas.

**P06 — Indicadores de referência.** Os indicadores e as visualizações existentes nos relatórios de Campeonato do Ensino Fundamental deverão ser preservados sempre que aplicáveis à Geniex.

**P07 — Novo indicador.** A Geniex deverá apresentar o tempo médio de resposta das questões respondidas corretamente.

**P08 — Separação entre campeonato e aprendizagem.** A classificação competitiva do campeonato e os indicadores pedagógicos deverão ser apresentados de maneira complementar, sem confundir vitórias com aprendizagem.

---

# 4. Estrutura de navegação

O relatório deverá ser organizado em quatro abas principais:

1. **Visão Geral**
2. **Engajamento**
3. **Aprendizagem**
4. **Glossário**

A estrutura seguirá o padrão já utilizado na plataforma Educadores, preservando a familiaridade da interface para os usuários. Cada aba terá um objetivo específico, mas todas deverão utilizar os dados do mesmo campeonato.

- **4.1. Visão Geral:** panorama consolidado da participação e dos resultados dos estudantes.
- **4.2. Engajamento:** participação, frequência de interação e realização das batalhas.
- **4.3. Aprendizagem:** desempenho nas questões, acurácia, proficiência e resultados por estudante e questão.
- **4.4. Glossário:** definições dos indicadores utilizados nos relatórios.

---

# 5. Funcionalidades

## 5.1. Visão Geral (prioridade alta)

Disponibilizar uma visão consolidada dos principais indicadores do campeonato, permitindo ao educador compreender rapidamente a participação e os resultados dos estudantes. A aba deverá preservar a estrutura de tabela e os recursos de análise existentes no relatório de referência.

### 5.1.1. Tabela de desempenho dos estudantes

| Campo | Descrição |
|---|---|
| Estudante | Nome do estudante. |
| Batalhas realizadas | Quantidade de batalhas efetivamente realizadas pelo estudante. |
| Vitórias | Quantidade de batalhas vencidas. |
| Derrotas | Quantidade de batalhas perdidas. |
| Interações de aprendizagem | Quantidade de interações de aprendizagem registradas, conforme a definição vigente do indicador na plataforma. |
| Tempo de estudo | Tempo de estudo registrado para o estudante, conforme a métrica disponível na Geniex. |

A tabela deverá permitir ordenação pelas colunas aplicáveis e manter os recursos de pesquisa por nome, paginação e exportação de dados presentes na interface de referência.

### 5.1.2. Desempenho versus engajamento

Gráfico de dispersão (eixo X: interações realizadas; eixo Y: desempenho percentual), com quatro quadrantes: Alto desempenho / Alto engajamento; Alto desempenho / Baixo engajamento; Baixo desempenho / Alto engajamento; Baixo desempenho / Baixo engajamento. Os limites dos quadrantes seguem os parâmetros existentes na plataforma. A visualização deverá ser acompanhada por uma tabela com os estudantes, seus indicadores de desempenho e engajamento e o quadrante correspondente.

### 5.1.3. Filtros e exportação

Pesquisa de estudantes pelo nome, ordenação, paginação e exportação dos dados disponíveis. A exportação deverá respeitar os filtros aplicados pelo usuário, quando essa for a regra já adotada pela plataforma.

### Regras de negócio

- **RN01.** Cada estudante deverá ser representado uma única vez na tabela consolidada do campeonato.
- **RN02.** Os indicadores deverão considerar os registros válidos do campeonato, respeitando os critérios de contabilização de batalhas da Geniex.
- **RN03.** A seleção de até três disciplinas não poderá provocar a duplicação de batalhas ou estudantes nos indicadores gerais.
- **RN04.** Os dados apresentados na tabela e no gráfico deverão utilizar a mesma base de resultados, respeitando as definições específicas de cada indicador.

## 5.2. Engajamento (prioridade alta)

Indicadores que permitam compreender o nível de participação dos estudantes no campeonato, seguindo a organização do relatório de referência do Ensino Fundamental.

- **5.2.1. Média de interações realizadas:** média, meta de referência e percentual de atingimento da meta. A definição de interação segue a regra vigente da plataforma.
- **5.2.2. Média de batalhas por estudante:** média, meta e percentual de atingimento. Estudantes sem batalhas deverão ser tratados de acordo com a definição do denominador, evitando que a média seja artificialmente elevada.
- **5.2.3. Estudantes ativos:** percentual, meta e percentual de atingimento, com a definição vigente de estudante ativo.
- **5.2.4. Progresso na atividade:** distribuição dos estudantes em Participou e Não participou, com a quantidade em cada categoria. Considera a participação efetiva, e não apenas um convite ou desafio recebido.
- **5.2.5. Ranking de engajamento:** Posição, Estudante, Vitórias, Derrotas e % de vitórias, com pesquisa, ordenação, paginação e exportação. O ranking não deverá introduzir um sistema de pontos que não exista no produto.

### Regras de negócio

- **RN05.** Os indicadores de engajamento deverão considerar os estudantes elegíveis ao campeonato conforme a definição de cada métrica.
- **RN06.** A ausência de participação não deverá ser confundida com uma derrota em batalha.
- **RN07.** Os indicadores de batalhas realizadas, vitórias e derrotas deverão utilizar os resultados consolidados das batalhas, independentemente de quantas disciplinas estejam configuradas no campeonato.
- **RN08.** As metas exibidas deverão seguir as configurações existentes no produto de referência.

## 5.3. Aprendizagem (prioridade alta)

Indicadores de desempenho acadêmico: precisão das respostas, distribuição por proficiência e resultados das questões, incorporando o novo indicador de tempo médio de resposta correta.

- **5.3.1. Taxa de acurácia:** taxa, meta e percentual de atingimento. Questões não respondidas ao término dos dez minutos são classificadas como erradas no resultado da batalha; o relatório usa o resultado final registrado, sem contabilizar novamente.
- **5.3.2. Estudantes com aprendizagem adequada:** percentual, meta e atingimento, com a definição vigente. Sem criar novo critério por causa das três disciplinas; se a definição depender da disciplina, usar regra de consolidação compatível e explícita.
- **5.3.3. Rubricas de proficiência:** Avançado, Proficiente, Básico, Insuficiente e Não avaliado, com proporção e quantidade e a meta de referência. Um estudante não pode ser contado múltiplas vezes; quando houver avaliações independentes por disciplina, preservar a disciplina de origem.
- **5.3.4. Ranking de aprendizagem da turma:** comparação dos resultados individuais em relação à meta, com pesquisa, ranking completo e ordenação. Independente da classificação competitiva oficial.
- **5.3.5. Ranking de aprendizagem em tabela:** Posição, Estudante, Vitórias, Derrotas e % de vitórias. Os campos de classificação competitiva permanecem identificados como indicadores de batalha.
- **5.3.6. Questões do campeonato:** identificação da questão, disciplina, tópico, respostas corretas, respostas incorretas e percentual de acerto. Questões não apresentadas não contam como incorretas; não respondidas por tempo seguem o resultado da batalha. Deve permitir identificar conteúdos com maior dificuldade.
- **5.3.7. Tempo médio de resposta correta (novo indicador):** tempo médio das respostas corretas, em segundos ou minutos e segundos, com análise por estudante, por disciplina e por tópico (quando houver dados).
  - **Fórmula:** soma dos tempos das respostas corretas válidas ÷ quantidade de respostas corretas válidas. Exemplo: 8, 12 e 10 s → 10 s.
  - Não entram respostas incorretas nem questões não respondidas.
  - **RN09.** Usa o tempo efetivamente registrado para cada resposta correta.
  - **RN10.** Média calculada a partir das respostas corretas válidas, e não pela média simples das médias individuais.
  - **RN11.** Sem respostas corretas no escopo: estado sem dados, nunca zero.
  - **RN12.** Respeita o contexto de análise (geral, por disciplina).
  - **RN13.** A consolidação de até três disciplinas não duplica os tempos.
  - **RN14.** Respeita o limite de dez minutos por batalha, sem assumir dez minutos por questão.
  - **Interpretação:** indicador complementar; tempo menor não significa automaticamente aprendizagem superior; analisar com a acurácia.

### Regras de negócio

- **RN15.** Os indicadores de aprendizagem deverão considerar as respostas efetivamente registradas nas batalhas.
- **RN16.** As respostas deverão manter a associação com a disciplina e o tópico correspondentes.
- **RN17.** As questões não respondidas ao término do tempo deverão ser tratadas conforme o resultado final da batalha.
- **RN18.** A existência de até três disciplinas deverá permitir a análise consolidada e, quando aplicável, a segmentação por disciplina.
- **RN19.** Os indicadores consolidados não deverão misturar estudantes, questões ou respostas de escopos diferentes sem uma regra explícita de agregação.
- **RN20.** O ranking competitivo e os indicadores pedagógicos deverão permanecer conceitualmente separados.

## 5.4. Glossário (prioridade média)

| Indicador | Definição |
|---|---|
| Batalhas realizadas | Quantidade de batalhas contabilizadas para o estudante conforme as regras da Geniex. |
| Vitórias | Quantidade de batalhas vencidas pelo estudante. |
| Derrotas | Quantidade de batalhas perdidas pelo estudante. |
| Percentual de vitórias | Proporção de vitórias em relação às batalhas consideradas válidas para o cálculo. |
| Interações de aprendizagem | Quantidade de interações registradas segundo a definição vigente da plataforma. |
| Tempo de estudo | Tempo registrado de estudo, conforme a métrica disponível no produto. |
| Média de interações realizadas | Média de interações realizadas pelos estudantes no escopo considerado. |
| Média de batalhas por estudante | Quantidade média de batalhas realizadas por estudante elegível ao indicador. |
| Estudantes ativos | Percentual de estudantes que atendem ao critério vigente de atividade. |
| Taxa de acurácia | Proporção de respostas corretas em relação ao total de respostas válidas consideradas no cálculo. |
| Aprendizagem adequada | Classificação de estudantes que atendem ao critério de aprendizagem definido pela plataforma. |
| Rubricas de proficiência | Categorias utilizadas para classificar o nível de proficiência dos estudantes. |
| Desempenho percentual | Resultado percentual utilizado nas visualizações de desempenho. |
| Tempo médio de resposta correta | Média do tempo utilizado nas respostas corretas válidas. |
| Participação no campeonato | Registro de participação efetiva do estudante em pelo menos uma atividade elegível do campeonato, conforme a regra do indicador. |

---

# 6. Requisitos transversais

- **6.1. Consolidação multidisciplinar:** compatível com 1, 2 ou 3 disciplinas; estudante contado uma vez; batalha contada uma vez; cada resposta mantém questão, disciplina e tópico; análises por disciplina ou tópico consideram só os dados vinculados.
- **6.2. Consistência dos dados:** batalhas, vitórias e derrotas compatíveis com os resultados registrados; respostas corretas e incorretas compatíveis com os resultados finais; tempo médio só com as respostas corretas.
- **6.3. Pesquisa, ordenação e paginação:** preservar os recursos do padrão atual da plataforma Educadores.
- **6.4. Exportação:** manter a exportação nas visualizações que já a oferecem; considerar incluir o tempo médio de resposta correta.
- **6.5. Estados sem dados:** campeonato sem batalhas concluídas, estudantes que não participaram, ausência de respostas corretas, questões não utilizadas e falta de dados para proficiência.

---

# 7. Fluxo de utilização

1. O educador acessa a plataforma Educadores.
2. Acessa a área de relatórios.
3. Seleciona o campeonato da Geniex que deseja analisar.
4. O sistema apresenta a aba Visão Geral.
5. O educador consulta os indicadores consolidados e a tabela de desempenho dos estudantes.
6. Acessa a aba Engajamento para analisar a participação.
7. Acessa a aba Aprendizagem para consultar acurácia, proficiência, desempenho por questão e tempo médio de resposta correta.
8. Consulta o Glossário, se necessário.
9. Usa pesquisa, ordenação e exportação para aprofundar as análises.

---

# 8. Critérios de aceite

- **CA01 — Disponibilização:** o relatório apresenta as abas Visão Geral, Engajamento, Aprendizagem e Glossário.
- **CA02 — Visão Geral:** tabela consolidada de desempenho e gráfico de desempenho versus engajamento.
- **CA03 — Consolidação de disciplinas:** 1, 2 ou 3 disciplinas sem duplicar estudantes, batalhas ou respostas.
- **CA04 — Engajamento:** média de interações, média de batalhas por estudante, estudantes ativos e progresso na atividade.
- **CA05 — Participação:** estudantes sem batalhas não são classificados como derrotados.
- **CA06 — Taxa de acurácia** conforme a regra vigente.
- **CA07 — Rubricas de proficiência**, incluindo Não avaliado quando aplicável.
- **CA08 — Questões do campeonato** com associação a disciplina e tópico.
- **CA09 — Tempo médio de resposta correta** apenas com respostas corretas válidas.
- **CA10 — Ausência de respostas corretas:** estado sem dados, nunca zero.
- **CA11 — Análise por disciplina:** só respostas e resultados da disciplina analisada.
- **CA12 — Exportação** respeitando filtros e escopo.
- **CA13 — Glossário** com todos os indicadores, incluindo o tempo médio de resposta correta.
- **CA14 — Separação** clara entre classificação competitiva, engajamento e aprendizagem.

---

# 9. Requisitos não funcionais

- **Usabilidade:** consistência visual e comportamental com os relatórios da plataforma Educadores.
- **Desempenho:** consultas em tempo adequado, sem consultas redundantes.
- **Integridade:** sem duplicidades decorrentes de múltiplas disciplinas, questões ou tentativas.
- **Rastreabilidade:** origem identificável no campeonato, batalha, questão, disciplina e tópico.

---

# 10. Fora do escopo

Criação e configuração de campeonatos; alteração das regras de disputa; alteração dos critérios de classificação oficial; sistema de pontos; alterações na duração das batalhas; alteração da quantidade de disciplinas; novos mecanismos de avaliação de proficiência; novas metas pedagógicas.

---

# 11. Dependências e pontos de validação

- **11.1.** Fórmulas, denominadores e metas de: média de interações, média de batalhas, estudantes ativos, acurácia, aprendizagem adequada, desempenho percentual, interações de aprendizagem e tempo de estudo.
- **11.2.** Fonte e critérios das rubricas de proficiência no contexto do campeonato.
- **11.3.** Disponibilidade e armazenamento da duração de cada resposta.
- **11.4.** Quais indicadores podem ser segmentados por disciplina e tópico sem alterar as regras.
- **11.5.** Adaptação dos rankings sem confundir ranking de aprendizagem com a classificação oficial.

---

# 12. Resultado esperado

O educador analisa um campeonato da Geniex de forma consolidada e aprofundada, numa estrutura familiar da plataforma Educadores, combinando participação, engajamento, desempenho e aprendizagem, compatível com até três disciplinas, e com o tempo médio de resposta correta como visão complementar à acurácia.
