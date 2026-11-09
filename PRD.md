# PRD — Sistema de Gamificação da GenieX
## XP, Elos e Badges

**Produto:** GenieX  
**Funcionalidade:** Sistema de Gamificação  
**Versão:** 2.0  
**Status:** Proposta consolidada para desenvolvimento e validação técnica  
**Público-alvo:** Estudantes da plataforma GenieX

---

# 1. Visão geral

## 1.1. Contexto

A GenieX ainda não possui um sistema integrado de gamificação que reconheça a evolução dos estudantes a partir de suas atividades educacionais.

A proposta é implementar um sistema estruturado de progressão que permita aos estudantes conquistar pontos de experiência (XP), evoluir entre elos e desbloquear badges conforme avançam na plataforma.

O sistema deverá incentivar o engajamento com as atividades educacionais, tornar a evolução do estudante mais tangível e reconhecer seu esforço de maneira consistente.

A gamificação será composta por três elementos principais:

- **XP:** pontos de experiência conquistados por meio de atividades educacionais elegíveis.
- **Elos:** níveis de progressão determinados pelo saldo de XP válido do estudante.
- **Badges:** conquistas permanentes desbloqueadas conforme o estudante alcança determinados marcos de XP válido.

O sistema também contará com uma regra de validade dos pontos. O XP perderá parte de seu valor após três meses e expirará completamente após seis meses, criando um modelo de progressão que considera tanto as conquistas passadas quanto a continuidade da participação do estudante.

As ofensivas já existentes na GenieX permanecerão independentes desta iniciativa.

## 1.2. Problema

Sem um sistema estruturado de progressão, o estudante possui menos recursos para visualizar sua evolução dentro da plataforma e reconhecer o impacto de sua participação nas atividades educacionais.

Além disso, a ausência de regras unificadas de pontuação dificulta a criação de uma experiência consistente entre diferentes modalidades, como quizzes, simulados e redações.

A funcionalidade deverá estabelecer regras claras de concessão, validade e utilização dos pontos, evitando duplicidades, acúmulo artificial de XP e progressão desproporcional.

## 1.3. Objetivo

Implementar um sistema de gamificação que permita aos estudantes:

- Conquistar XP por meio de atividades elegíveis.
- Acompanhar seu saldo de experiência válido.
- Evoluir entre cinco elos.
- Desbloquear badges conforme atingem marcos de XP.
- Consultar suas conquistas e seu histórico de progressão.
- Compreender como a expiração dos pontos afeta seu elo atual.

## 1.4. Hipótese de produto

Se os estudantes conseguirem visualizar sua evolução por meio de XP, elos e badges, então a percepção de progresso poderá aumentar e incentivar a continuidade da participação nas atividades educacionais da GenieX.

Essa hipótese deverá ser validada após o lançamento, por meio de métricas de engajamento, frequência de atividades e progressão dos estudantes.

---

# 2. Escopo

## 2.1. Incluído na primeira versão

1. Concessão de XP por modalidade elegível.
2. Cálculo de XP por desempenho.
3. Prevenção de concessões duplicadas.
4. Limite diário de XP por redação.
5. Registro individual dos lotes de XP.
6. Expiração parcial após três meses.
7. Expiração total após seis meses.
8. Cálculo automático do saldo válido.
9. Cinco elos de progressão.
10. Progressão e regressão automática de elo.
11. Sistema com 25 badges.
12. Desbloqueio automático de badges.
13. Permanência das badges conquistadas.
14. Histórico de XP, expirações e conquistas.
15. Exibição do elo, do saldo e do progresso para o próximo marco.
16. Notificações de progressão e desbloqueio de badges.

## 2.2. Fora do escopo inicial

- Concessão de XP por tarefas.
- Concessão de XP por Provas GenieX.
- Bônus por conclusão de atividades.
- Bônus por desempenho máximo.
- Multiplicadores de XP.
- Penalidades por respostas incorretas.
- Rankings competitivos.
- Recompensas materiais vinculadas aos elos.
- Benefícios exclusivos associados às badges.
- Criação de badges por ofensivas.
- Badges vinculadas a critérios diferentes do XP válido.

As ofensivas existentes continuarão funcionando de maneira independente.

Novas categorias de badges e outras mecânicas poderão ser avaliadas posteriormente, após a validação do sistema inicial.

---

# 3. Conceitos fundamentais

## 3.1. XP gerado

Representa a quantidade de pontos concedida ao estudante por uma atividade elegível.

Exemplo: um estudante conclui um quiz com dez questões e acerta oito. Cálculo: 8 respostas corretas × 10 XP = 80 XP.

## 3.2. Lote de XP

Cada concessão de XP deverá constituir um lote individual, associado à atividade que originou os pontos.

Cada lote possuirá:

- Quantidade originalmente concedida.
- Data e hora de concessão.
- Data prevista para expiração parcial.
- Data prevista para expiração total.
- Quantidade atualmente válida.
- Histórico de expirações e ajustes.

Cada lote terá seu próprio ciclo de validade, independentemente dos demais pontos do estudante.

## 3.3. XP válido

Representa a quantidade de XP que permanece válida e pode ser utilizada para determinar o elo atual e o desbloqueio de novas badges. O saldo válido será calculado a partir dos lotes de XP ainda vigentes. O XP histórico gerado não será necessariamente igual ao saldo válido atual.

## 3.4. Elo atual

Representa a classificação vigente do estudante, determinada exclusivamente pelo saldo de XP válido. O estudante poderá evoluir ou regredir de elo conforme seu saldo aumentar ou diminuir.

## 3.5. Badge

Representa uma conquista permanente desbloqueada quando o estudante alcança determinado marco de XP válido. As badges serão distribuídas entre os cinco elos, totalizando 25 conquistas. Diferentemente dos elos, que refletem a situação atual do estudante, as badges representarão conquistas históricas que não serão removidas após o desbloqueio.

---

# 4. Regras de concessão de XP

## 4.1. Tabela geral

| Modalidade | Regra de pontuação | XP |
|---|---|---:|
| Quiz | Por questão respondida corretamente | 10 XP |
| Simulado | Por questão respondida corretamente | 10 XP |
| Redação ENEM | Por ponto obtido na avaliação | 1 XP por ponto |
| Tarefa | Não elegível | 0 XP |
| Prova GenieX | Não elegível | 0 XP |

Essas regras serão aplicadas automaticamente pelo backend, conforme os resultados oficiais registrados pela plataforma.

## 4.2. Quiz

`XP do quiz = número de respostas corretas × 10`

| Questões | Acertos | XP |
|---:|---:|---:|
| 5 | 3 | 30 |
| 10 | 8 | 80 |
| 10 | 10 | 100 |
| 20 | 15 | 150 |
| 20 | 20 | 200 |

- Apenas respostas corretas geram XP.
- Respostas incorretas não geram pontos nem provocam perda de XP.
- Não existe bônus por acertar todas as questões nem por concluir o quiz.
- A quantidade de XP considera o resultado oficial da tentativa elegível.
- Uma mesma atividade não poderá gerar XP novamente após sua primeira concessão elegível.

## 4.3. Simulado

`XP do simulado = número de respostas corretas × 10`

| Questões | Acertos | XP |
|---:|---:|---:|
| 20 | 10 | 100 |
| 40 | 30 | 300 |
| 60 | 45 | 450 |
| 100 | 80 | 800 |
| 100 | 100 | 1.000 |

- Apenas respostas corretas geram XP.
- Sem bônus por conclusão ou por pontuação máxima.
- Respostas incorretas não geram penalidades.
- Uma mesma atividade não poderá conceder XP novamente após a primeira concessão elegível.

## 4.4. Redação ENEM

`XP da redação = pontuação final da redação` (escala de 0 a 1.000).

- Cada ponto obtido na redação equivale a 1 XP.
- A pontuação considerada será a nota final oficial.
- Redações sem nota final não geram XP.
- A mesma redação não poderá gerar XP mais de uma vez; reenvios e novas tentativas não geram segunda concessão.
- Correções oficiais posteriores deverão ajustar a concessão original, sem criar nova concessão independente.
- A pontuação máxima de uma redação será de 1.000 XP.

### Limite diário de redações

Cada estudante poderá receber XP por apenas uma redação elegível por dia. As demais redações realizadas no mesmo dia poderão ser concluídas normalmente, mas não concederão XP adicional.

| Redação | Nota | XP |
|---|---:|---:|
| Primeira redação elegível | 800 | 800 |
| Segunda redação | 700 | 0 |
| Terceira redação | 900 | 0 |

O limite deverá ser aplicado individualmente por estudante, utilizando o fuso horário oficial da plataforma.

**Regra operacional proposta:** considerar elegível a primeira redação cuja nota final seja validada no dia. Essa regra deverá ser confirmada com Engenharia antes da implementação.

## 4.5. Tarefas e 4.6. Prova GenieX

Tarefas e Provas GenieX não concederão XP na primeira versão, em qualquer situação (concluída, com desempenho máximo ou parcialmente).

## 4.7. Ausência de bônus e penalidades

Não haverá XP adicional por concluir uma atividade, acertar todas as questões, realizar várias atividades consecutivamente, acessar a plataforma, atingir um elo, desbloquear uma badge ou realizar atividades não elegíveis. Respostas incorretas não gerarão XP, mas também não reduzirão o saldo existente. A perda de XP ocorrerá exclusivamente pelas regras de expiração ou por ajustes necessários para corrigir concessões inválidas.

---

# 5. Prevenção de duplicidade e integridade do XP

O sistema deverá impedir que a mesma atividade gere pontos repetidamente, com controle no backend (reabertura, repetição de tentativa, atualização da página, reenvio de requisições, reprocessamento de eventos, processamento duplicado). Cada concessão deverá possuir um identificador único e uma referência à atividade de origem. O processamento deverá ser idempotente.

**Correções de resultados:** caso o resultado oficial de uma atividade seja corrigido, o sistema deverá ajustar a concessão original, mantendo o histórico da alteração, sem gerar um novo lote independente.

---

# 6. Validade e expiração do XP

## 6.1. Regra de validade

| Período | Regra | Saldo do lote |
|---|---|---:|
| Antes de completar 3 meses | Pontos integralmente válidos | 100% |
| Ao completar 3 meses | Expiração de 50% do valor original | 50% |
| Ao completar 6 meses | Expiração do restante | 0% |

A expiração será individualizada por lote. O sistema não deverá aplicar uma única data de expiração sobre todo o saldo do estudante.

## 6.2. Exemplo

| Data | Evento | XP válido |
|---|---|---:|
| 30/10/2026 | Concessão | 600 |
| 30/01/2027 | Expiração de 50% | 300 |
| 30/04/2027 | Expiração do restante | 0 |

As datas consideram aniversários de três e seis meses. Quando o mês de vencimento não possuir o mesmo dia do mês original, deverá ser utilizado o último dia daquele mês.

## 6.3. Lotes independentes

Cada lote terá seu próprio cronograma; quando um lote atingir três meses, apenas ele sofrerá a expiração parcial.

## 6.4. Arredondamento

Para lotes ímpares, a soma das expirações deve ser exatamente igual ao valor original. Exemplo: 601 XP → após três meses expiram 300 XP (restam 301); após seis meses expiram os 301 restantes.

## 6.5. Atualização automática

O saldo deverá ser recalculado quando um novo lote for concedido, quando um lote atingir três ou seis meses, quando uma concessão for corrigida e quando uma rotina de reconciliação identificar divergências — mesmo que o estudante não acesse a plataforma.

---

# 7. Sistema de elos

| Nível | Elo | Faixa de XP válido |
|---:|---|---:|
| 1 | Bronze | 0 a 9.999 XP |
| 2 | Prata | 10.000 a 29.999 XP |
| 3 | Ouro | 30.000 a 59.999 XP |
| 4 | Diamante | 60.000 a 99.999 XP |
| 5 | Cósmico | 100.000 XP ou mais |

- Todo estudante começa no Bronze. Cósmico não tem limite máximo de XP acumulável.
- **Progressão (7.7):** ao atingir o mínimo de um elo superior, o elo é atualizado automaticamente (ex.: 29.800 + 600 = 30.400 → Prata para Ouro).
- **Regressão (7.8):** se o saldo válido ficar abaixo do mínimo da faixa atual, o estudante regride automaticamente (ex.: 30.200 → 29.700 após expiração → volta ao Prata).
- **Recuperação (7.9):** sem período de espera.
- **Histórico (7.10):** registrar elo atual, maior elo já alcançado, data de cada progressão e regressão e o motivo. O maior elo histórico é independente do elo atual; a regressão não apaga o histórico.

---

# 8. Sistema de badges

25 badges, cinco por elo, desbloqueadas exclusivamente pelo saldo de XP válido. Regras: desbloqueio automático; badges permanentes (expiração e regressão não removem); não podem ser desbloqueadas de novo; data de conquista registrada; o estudante consulta conquistadas e bloqueadas, com o requisito das bloqueadas.

| Elo | Badges (XP válido necessário) |
|---|---|
| Bronze | Primeiro Impulso (2.000) · Explorador Iniciante (4.000) · Viajante Lunar (6.000) · Caçador de Estrelas (8.000) · Bronze Supremo (9.000) |
| Prata | Desbravador Cósmico (14.000) · Navegador Estelar (18.000) · Explorador Galáctico (22.000) · Viajante Interplanetário (26.000) · Guardião Prateado (29.000) |
| Ouro | Nascido para Brilhar (36.000) · Estrela Dourada (42.000) · Mestre da Órbita (48.000) · Senhor dos Planetas (54.000) · Soberano Dourado (59.000) |
| Diamante | Diamante Estelar (68.000) · Conquistador de Galáxias (76.000) · Comandante Espacial (84.000) · Guardião do Universo (92.000) · Lenda Diamantina (99.000) |
| Cósmico | Além das Estrelas (140.000) · Arquiteto Galáctico (180.000) · Mestre do Cosmos (220.000) · Lenda Universal (260.000) · Entidade Cósmica (300.000) |

No Cósmico, marcos progressivos de 40.000 XP; o estudante continua evoluindo dentro do elo até desbloquear as cinco. Nomes e representações visuais são propostas iniciais e poderão ser refinados em Design.

**Desbloqueio (8.8):** ao mudar o saldo, verificar requisitos não conquistados, desbloquear, registrar e exibir notificação visual (ex.: 5.800 + 300 = 6.100 → Viajante Lunar).

**Permanência (8.9) e relação com elos (8.10):** distinguir elo atual, maior elo histórico, badges conquistadas e badges bloqueadas. Ex.: chegou a 36.000 (badge Ouro), caiu para 28.000 → elo atual Prata, badge Ouro continua conquistada, maior elo histórico Ouro.

---

# 9. Exemplo completo

Quizzes 1.000 + Simulados 1.000 + Redações 6.000 = 8.000 XP válidos → Bronze, com Primeiro Impulso, Explorador Iniciante, Viajante Lunar e Caçador de Estrelas. Aos 9.000 desbloqueia Bronze Supremo; aos 10.000 avança para Prata. Se o saldo cair por expiração, o elo pode regredir; as badges permanecem.

---

# 10. Requisitos funcionais

RF-01 Concessão automática de XP · RF-02/03 10 XP por resposta correta em quizzes e simulados · RF-04 1 XP por ponto de redação (máx. 1.000) · RF-05 uma redação com XP por dia · RF-06 tarefas e Provas GenieX sem XP · RF-07 sem duplicidade · RF-08 registro individual de lotes · RF-09 expiração de 50% aos 3 meses · RF-10 expiração do restante aos 6 meses · RF-11 cálculo do saldo válido · RF-12 atualização de elo · RF-13 regressão automática · RF-14 histórico de progressão e maior elo · RF-15 desbloqueio automático de badges · RF-16 permanência das badges · RF-17 consulta de badges conquistadas e bloqueadas com requisitos · RF-18 histórico de ganhos, expirações e saldo válido · RF-19 indicador de elo, saldo e progresso · RF-20 data de cada badge.

---

# 11. Requisitos de interface e experiência

**11.1 Resumo:** elo atual, saldo de XP válido, progresso e XP que falta para o próximo elo, maior elo histórico e quantidade de badges conquistadas.

**11.2 Progresso:** ex.: Elo Prata, 18.000 XP válidos, próximo elo Ouro, faltam 12.000 XP válidos. Calculado sobre o saldo válido, sem XP expirado.

**11.3 Área de badges:** as 25 conquistas organizadas por elo, cada uma com nome, representação visual, descrição, requisito, situação (conquistada ou bloqueada) e data de conquista quando aplicável. Bloqueadas explicam o que falta; conquistadas continuam identificáveis mesmo após regressão.

**11.4 Notificações:** ao avançar de elo, ao regredir de elo e ao desbloquear uma badge. Comunicação objetiva; na regressão, informar que a mudança ocorreu pela redução do saldo válido.

**11.5 Histórico de XP:** atividade de origem, modalidade, data da concessão, XP concedido, XP expirado, saldo válido do lote e data prevista da próxima expiração.

---

# 12. Requisitos não funcionais

RNF-01 consistência (saldo exibido = saldo do elo) · RNF-02 idempotência · RNF-03 rastreabilidade · RNF-04 processamento automático · RNF-05 integridade histórica · RNF-06 escalabilidade · RNF-07 integridade das badges · RNF-08 mesma fonte de verdade para elos e badges.

---

# 13. Métricas de sucesso

Percentual de estudantes que conquistaram XP · XP médio por estudante ativo · distribuição por elo · tempo médio para cada elo · percentual de XP por modalidade · badges por estudante · tempo médio para cada badge · percentual que regride de elo · percentual que recupera elo · lotes expirados corretamente · concessões duplicadas bloqueadas. Avaliar também o peso das redações (até 1.000 XP) frente a um quiz de dez questões (até 100 XP).

---

# 14. Critérios de aceite

Concessão (10/10/1 XP; tarefas e provas sem XP; sem bônus nem penalidade) · limites e duplicidade (sem XP duplicado; uma redação por dia no fuso oficial) · validade (ciclo por lote; 50% aos 3 meses; restante aos 6; histórico preservado) · elos (só saldo válido; cinco faixas; progressão, regressão e recuperação automáticas; histórico preservado) · badges (25, cinco por elo, requisito em XP válido, desbloqueio automático, permanentes, data registrada, interface diferencia conquistadas e bloqueadas) · interface (elo, saldo, progresso, badges, histórico de XP e notificações claras).

---

# 15–16. Resumo e considerações finais

**A regra central é: o elo representa a posição atual do estudante, enquanto as badges representam marcos que ele já conquistou.**
