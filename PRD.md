# PRD — Campeonato | Geniex

**Produto:** Geniex
**Funcionalidade:** Campeonato
**Plataforma de configuração:** Educadores
**Plataforma de participação:** Geniex
**Público-alvo:** Estudantes do Ensino Médio
**Status:** Especificação funcional para refinamento técnico
**Versão:** 1.0

---

# 1. Propósito, objetivos e estratégia

## 1.1. Contexto

O Campeonato é uma funcionalidade gamificada da Jovens Gênios que promove a aprendizagem por meio de competições entre estudantes.

Diferentemente de uma batalha individual, na qual dois estudantes disputam uma única rodada de perguntas, o Campeonato organiza diversas batalhas ao longo de um período determinado. Os participantes acumulam vitórias, acompanham seus resultados e competem por posições em um ranking geral.

Na Geniex, a funcionalidade será direcionada aos estudantes do Ensino Médio e permitirá que eles disputem batalhas com outros estudantes da mesma escola e do mesmo ano escolar, independentemente de pertencerem à mesma turma.

Por exemplo, um estudante do 1º ano do Ensino Médio poderá desafiar outro estudante do 1º ano da mesma escola, mesmo que estejam matriculados em turmas diferentes. Entretanto, não poderá disputar contra estudantes do 2º ou do 3º ano, nem contra estudantes de outra escola.

Os Campeonatos serão criados e configurados pelos educadores na plataforma Educadores. Após a configuração, os estudantes elegíveis poderão acessar a competição pela Geniex, iniciar batalhas, acompanhar disputas em andamento, consultar resultados e visualizar o ranking atualizado.

A dinâmica das disputas seguirá as regras já estabelecidas para as Batalhas VS da Geniex, preservando a consistência entre as funcionalidades.

## 1.2. Objetivo

Desenvolver uma experiência de Campeonato que permita aos educadores organizar competições de conhecimento e aos estudantes disputar batalhas com colegas da mesma escola e do mesmo ano escolar.

A funcionalidade deverá:
- Permitir a criação e a configuração de Campeonatos pela plataforma Educadores.
- Disponibilizar a competição aos estudantes elegíveis na Geniex.
- Permitir batalhas entre estudantes da mesma escola e do mesmo ano escolar, inclusive de turmas diferentes.
- Utilizar as regras existentes das Batalhas VS para seleção de conteúdos, execução e apuração dos resultados.
- Estabelecer critérios transparentes para contabilização de vitórias e classificação.
- Aplicar corretamente o prazo de 24 horas para participação do oponente e as exceções relacionadas ao encerramento do Campeonato.
- Disponibilizar um ranking atualizado durante a competição.
- Estimular a participação, a revisão dos conteúdos e a aprendizagem por meio de disputas saudáveis.

## 1.3. Estratégia

A estratégia da funcionalidade está fundamentada em cinco pilares.

**1. Competição saudável**

Incentivar os estudantes a desenvolverem seus conhecimentos por meio de disputas com colegas, sem transformar a experiência em uma competição baseada exclusivamente na velocidade.

**2. Aprendizagem contínua**

Utilizar as batalhas como oportunidades de praticar conteúdos, identificar erros e aprimorar o desempenho acadêmico.

**3. Engajamento**

Oferecer uma experiência competitiva com desafios recorrentes, acompanhamento dos resultados e evolução no ranking.

**4. Transparência**

Garantir que os estudantes compreendam as regras de participação, os critérios de vitória, os prazos e os critérios de desempate.

**5. Gestão simplificada**

Permitir que os educadores organizem Campeonatos de maneira estruturada, definindo período de realização, conteúdos e participantes elegíveis.

## 1.4. Público-alvo

### Estudantes

Responsáveis por participar das batalhas, acompanhar seus resultados, consultar o ranking e buscar melhores posições durante a vigência do Campeonato.

### Educadores

Responsáveis por criar e configurar os Campeonatos na plataforma Educadores, definindo suas informações, o período de realização, os conteúdos e os participantes.

### Instituição de ensino

Beneficiária indireta da funcionalidade, que poderá utilizar os Campeonatos como estratégia complementar para incentivar a participação e o engajamento acadêmico.

## 1.5. Mudança de comportamento esperada

Espera-se que os estudantes:

- Participem de mais batalhas ao longo do período de competição.
- Revisem os conteúdos trabalhados nas disputas.
- Acompanhem seus resultados e sua posição no ranking.
- Desenvolvam maior interesse pela prática recorrente de questões.
- Percebam a competição como uma oportunidade de aprendizagem.

Para os educadores, espera-se uma maior facilidade para organizar atividades competitivas entre estudantes de diferentes turmas do mesmo ano escolar.

## 1.6. KPIs impactados e impacto esperado

Os indicadores deverão ser acompanhados após o lançamento, considerando a linha de base existente na Geniex.

### Indicadores principais

| Indicador | Definição |
|---|---|
| Taxa de adoção | Percentual de estudantes elegíveis que participam de pelo menos um Campeonato. |
| Campeonatos criados | Quantidade de Campeonatos configurados pelos educadores. |
| Taxa de participação | Percentual de estudantes elegíveis que iniciam ao menos uma batalha em um Campeonato. |
| Batalhas por Campeonato | Quantidade média de batalhas iniciadas em cada competição. |
| Taxa de conclusão | Percentual de participações em batalhas concluídas em relação às iniciadas. |
| Taxa de W.O. | Percentual de batalhas encerradas por ausência de participação no prazo aplicável. |
| Frequência de participação | Quantidade média de batalhas iniciadas por estudante durante a competição. |
| Consulta ao ranking | Frequência com que os estudantes acessam a classificação do Campeonato. |
| Retenção de participantes | Percentual de estudantes que voltam a participar de batalhas após a primeira disputa. |

As metas quantitativas deverão ser definidas após a análise da linha de base e a validação da instrumentação dos eventos.

---

# 2. Discovery — Critérios e restrições

## 2.1. Problema identificado

A experiência de Campeonato precisa ser estruturada para atender às particularidades da Geniex e do Ensino Médio.

A competição não deve ficar restrita aos estudantes de uma única turma. É necessário permitir disputas entre estudantes de diferentes turmas da mesma escola, desde que pertençam ao mesmo ano escolar.

Além disso, a experiência precisa distinguir claramente o resultado de uma batalha da classificação geral do Campeonato.

Uma vitória em uma batalha representa um resultado individual. A classificação do Campeonato, por sua vez, considera o desempenho acumulado do estudante durante toda a competição.

Também é necessário tratar corretamente as batalhas que permanecem sem resposta quando o Campeonato está próximo do encerramento, evitando a concessão indevida de vitórias por W.O.

## 2.2. Direcionadores da solução

A solução deverá seguir os seguintes direcionadores:

- O Campeonato será criado pelo educador na plataforma Educadores.
- O Campeonato será disponibilizado na Geniex aos estudantes elegíveis.
- As batalhas ocorrerão exclusivamente entre estudantes inscritos ou elegíveis para aquele Campeonato.
- Os dois participantes deverão pertencer à mesma escola.
- Os dois participantes deverão estar matriculados no mesmo ano escolar.
- Os estudantes poderão pertencer a turmas diferentes.
- O estudante não poderá desafiar a si próprio.
- As batalhas seguirão as regras vigentes da Batalha VS.
- A configuração de conteúdos deverá permitir de uma a três disciplinas, com um tópico por disciplina selecionada.
- Cada batalha terá dez questões e limite de dez minutos por participante.
- A classificação priorizará a quantidade de vitórias.
- O sistema deverá controlar os prazos de participação e as exceções de W.O.
- O ranking deverá refletir os resultados válidos registrados no Campeonato.

## 2.3. Regras gerais do Campeonato

### RN01 — Criação

O Campeonato deverá ser criado e configurado pelo educador na plataforma Educadores.

### RN02 — Disponibilização

O Campeonato deverá ficar disponível na Geniex para os estudantes elegíveis, respeitando sua configuração e seu período de vigência.

### RN03 — Elegibilidade dos participantes

Uma batalha somente poderá ocorrer entre estudantes que atendam simultaneamente aos seguintes requisitos:

- Pertencerem à mesma escola.
- Estarem matriculados no mesmo ano escolar.
- Estarem elegíveis para participar do Campeonato.
- Não representarem a mesma pessoa na disputa.

### RN04 — Turmas diferentes

Os estudantes poderão pertencer a turmas diferentes, desde que atendam aos critérios de escola e ano escolar.

### RN05 — Conteúdos

A seleção de conteúdos deverá respeitar as regras já estabelecidas nas Batalhas VS da Geniex.

### RN06 — Quantidade de questões

Cada batalha será composta por dez questões, independentemente da quantidade de disciplinas selecionadas.

### RN07 — Tempo de resposta

Cada participante terá até dez minutos para responder às dez questões da batalha.

### RN08 — Classificação

O Campeonato será vencido pelo estudante com a maior quantidade de vitórias válidas durante a competição, respeitando os critérios de desempate definidos neste documento.
### RN09 — W.O.

O sistema deverá aplicar o prazo de 24 horas para a participação do oponente, exceto quando a batalha for iniciada a menos de 24 horas do encerramento do Campeonato. Nessa situação, a ausência de resposta não concederá vitória por W.O.

### RN10 — Encerramento

O Campeonato deverá respeitar a data e o horário de término configurados pelo educador.

O encerramento da competição não deverá gerar vitórias artificiais nem alterar resultados válidos de batalhas já concluídas.

## 2.4. Restrições

- Não permitir batalhas entre estudantes de escolas diferentes.
- Não permitir batalhas entre estudantes de anos escolares diferentes.
- Não permitir que um estudante dispute contra si próprio.
- Não permitir que estudantes não elegíveis participem do Campeonato.
- Não permitir a criação de batalhas sem conteúdo disponível.
- Não permitir a seleção de mais de três disciplinas por batalha.
- Não permitir a seleção de mais de um tópico por disciplina na mesma batalha.
- Não permitir a criação de batalhas com quantidade diferente de dez questões.
- Não permitir a execução de uma batalha por mais de dez minutos por participante.
- Não utilizar o tempo de resposta para determinar o vencedor de uma batalha quando a quantidade de acertos for diferente.
- Não utilizar a pontuação acumulada como critério principal de classificação.
- Não conceder W.O. quando não houver tempo hábil para completar as 24 horas antes do encerramento do Campeonato.
- Não contabilizar uma vitória mais de uma vez.
- Não permitir que batalhas pendentes alterem indevidamente o ranking após o encerramento do Campeonato.

---

# 3. Funcionalidades

## Feature 01 — Configuração do Campeonato na plataforma Educadores

### Descrição

Permitir que o educador crie e configure um Campeonato para os estudantes elegíveis da instituição.

A configuração deverá contemplar as informações essenciais da competição, seu período de vigência, os conteúdos utilizados nas batalhas e os participantes.

### Problema do usuário

Eu, como educador, gostaria de configurar um Campeonato com os conteúdos e o período desejados, para que os estudantes da minha instituição possam participar de uma competição de conhecimento organizada.

**Prioridade:** Alta.

### Regras de negócio

- O Campeonato deverá possuir um nome.
- O Campeonato deverá possuir uma data e um horário de início.
- O Campeonato deverá possuir uma data e um horário de término.
- O término deverá ser posterior ao início.
- A configuração deverá permitir definir os conteúdos elegíveis para as batalhas.
- A configuração deverá respeitar as regras de seleção de disciplinas e tópicos das Batalhas VS.
- O educador deverá conseguir definir os estudantes participantes ou o público elegível, conforme o modelo de configuração adotado na plataforma Educadores.
- A elegibilidade deverá respeitar a escola e o ano escolar.
- O Campeonato deverá estar associado à instituição responsável por sua criação.

### Critérios de aceite

- A plataforma Educadores deverá permitir criar um novo Campeonato.
- A plataforma deverá permitir informar o nome da competição.
- A plataforma deverá permitir configurar a data e o horário de início.
- A plataforma deverá permitir configurar a data e o horário de término.
- O sistema deverá impedir o salvamento quando o término for anterior ou igual ao início.
- A plataforma deverá permitir configurar os conteúdos utilizados na competição.
- A plataforma deverá validar a existência de conteúdo disponível para as batalhas.
- A plataforma deverá permitir configurar os participantes ou o público elegível.
- O sistema deverá impedir a inclusão de participantes que não atendam às regras de elegibilidade.
- O sistema deverá validar os campos obrigatórios antes de salvar o Campeonato.
- O Campeonato deverá ficar associado à instituição responsável por sua criação.
- Após a criação bem-sucedida, o Campeonato deverá estar disponível para os estudantes elegíveis conforme seu período de vigência.

---

## Feature 02 — Disponibilização e visualização do Campeonato na Geniex

### Descrição

Apresentar os Campeonatos disponíveis para o estudante na Geniex, permitindo consultar as informações principais da competição e acessar suas funcionalidades.

### Problema do usuário

Eu, como estudante, gostaria de visualizar os Campeonatos dos quais posso participar, para que eu possa conhecer as regras, iniciar batalhas e acompanhar minha classificação.

**Prioridade:** Alta.

### Regras de negócio

- O estudante deverá visualizar apenas os Campeonatos para os quais seja elegível.
- O sistema deverá respeitar a instituição e o ano escolar do estudante.
- A visualização deverá apresentar o nome do Campeonato.
- A plataforma deverá apresentar o período de vigência.
- A plataforma deverá disponibilizar acesso às batalhas, ao ranking e ao histórico, conforme os estados da competição.
- A plataforma deverá diferenciar Campeonatos em andamento de Campeonatos encerrados, quando houver histórico disponível.

### Critérios de aceite

- A Geniex deverá apresentar os Campeonatos disponíveis para o estudante.
- A plataforma deverá apresentar o nome do Campeonato em destaque.
- A plataforma deverá apresentar as datas de início e término.
- A plataforma deverá apresentar o estado atual do Campeonato.
- A plataforma deverá disponibilizar o acesso aos detalhes da competição.
- A plataforma deverá disponibilizar o acesso ao ranking.
- A plataforma deverá disponibilizar o acesso às batalhas em andamento.
- A plataforma deverá apresentar um estado vazio quando não houver Campeonatos disponíveis.
- A plataforma não deverá apresentar como disponível um Campeonato para o qual o estudante não seja elegível.
- A plataforma deverá impedir o início de novas batalhas quando o Campeonato estiver encerrado.

---

## Feature 03 — Detalhamento do Campeonato

### Descrição

Apresentar uma visão detalhada da competição, incluindo as informações gerais, as batalhas em andamento, o ranking e o histórico.

### Problema do usuário

Eu, como estudante, gostaria de consultar os detalhes do Campeonato, para que eu possa entender seu funcionamento e acompanhar minha participação.

**Prioridade:** Alta.

### Critérios de aceite

- A plataforma deverá apresentar o nome do Campeonato.
- A plataforma deverá apresentar as datas de início e término.
- A plataforma deverá apresentar as disciplinas e os tópicos associados à competição, conforme a configuração.
- A plataforma deverá disponibilizar o acesso às batalhas em andamento.
- A plataforma deverá disponibilizar o acesso ao ranking.
- A plataforma deverá disponibilizar o acesso ao histórico de batalhas.
- A plataforma deverá permitir iniciar uma nova batalha quando o estudante estiver elegível e a competição estiver em andamento.
- A plataforma deverá apresentar um estado vazio quando ainda não houver batalhas.
- A plataforma deverá apresentar uma indicação clara quando o Campeonato estiver encerrado.
- A plataforma deverá impedir a criação de novas disputas após o término da competição.

---

## Feature 04 — Seleção de oponente

### Descrição

Permitir que o estudante selecione outro participante elegível para disputar uma Batalha VS dentro do Campeonato.

### Problema do usuário

Eu, como estudante, gostaria de escolher um colega para disputar uma batalha, para que eu possa testar meus conhecimentos e conquistar vitórias no Campeonato.

**Prioridade:** Alta.

### Regras de negócio

- O estudante somente poderá selecionar oponentes elegíveis para o Campeonato.
- Os dois participantes deverão pertencer à mesma escola.
- Os dois participantes deverão estar matriculados no mesmo ano escolar.
- Os participantes poderão pertencer a turmas diferentes.
- O estudante não poderá selecionar a si próprio.
- A lista de oponentes deverá respeitar as regras de elegibilidade no momento da seleção e da criação da batalha.
- O início da batalha não dependerá de uma etapa de aceite do oponente.

### Critérios de aceite

- A plataforma deverá apresentar uma lista de estudantes elegíveis para a batalha.
- A plataforma deverá apresentar o nome e o avatar de cada estudante.
- A plataforma poderá apresentar outras informações de perfil já disponíveis na experiência de Batalhas VS.
- A plataforma deverá permitir pesquisar estudantes pelo nome, quando previsto na interface.
- O estudante autenticado não deverá aparecer como seu próprio oponente.
- A plataforma não deverá apresentar estudantes de outra escola como oponentes elegíveis.
- A plataforma não deverá apresentar estudantes de outro ano escolar como oponentes elegíveis.
- A plataforma deverá permitir selecionar um oponente válido.
- A plataforma deverá validar novamente a elegibilidade antes de criar a batalha.
- O sistema deverá impedir a criação de uma batalha quando o oponente deixar de ser elegível.
- Após a seleção, o estudante deverá conseguir avançar para a configuração dos conteúdos da batalha.

---

## Feature 05 — Seleção de disciplinas e tópicos

### Descrição

Permitir que o estudante selecione os conteúdos que deseja praticar na batalha, respeitando as regras vigentes da funcionalidade Batalhas VS.

### Problema do usuário

Eu, como estudante, gostaria de escolher as disciplinas e os tópicos que desejo praticar, para que eu possa disputar batalhas relacionadas aos conteúdos de meu interesse.

**Prioridade:** Alta.

### Regras de negócio

**RN01 — Quantidade de disciplinas**

O estudante deverá selecionar no mínimo uma e no máximo três disciplinas para cada batalha.

**RN02 — Seleção de tópico**

Para cada disciplina selecionada, o estudante deverá escolher obrigatoriamente um único tópico.

**RN03 — Limite de tópicos**

Não será permitido selecionar mais de um tópico para a mesma disciplina na mesma batalha.

**RN04 — Conteúdo disponível**

A plataforma deverá apresentar somente disciplinas e tópicos elegíveis para a competição e com conteúdo disponível para a geração das questões.

**RN05 — Quantidade de questões**

Independentemente de o estudante selecionar uma, duas ou três disciplinas, a batalha deverá conter exatamente dez questões.

**RN06 — Distribuição das questões**

Quando houver mais de uma disciplina selecionada, a ordem das questões e a quantidade de questões por tópico deverão ser definidas aleatoriamente, respeitando a regra de pelo menos três questões de cada tópico selecionado.

**RN07 — Compatibilidade entre participantes**

A configuração deverá garantir que a batalha respeite os conteúdos e as regras estabelecidas para a disputa, mantendo a comparabilidade dos resultados entre os participantes.

### Critérios de aceite

- A plataforma deverá permitir selecionar uma disciplina.
- A plataforma deverá permitir selecionar até três disciplinas.
- O sistema deverá impedir o avanço sem pelo menos uma disciplina selecionada.
- A plataforma deverá apresentar os tópicos disponíveis para cada disciplina selecionada.
- O sistema deverá exigir a seleção de exatamente um tópico por disciplina.
- O sistema deverá impedir a seleção de dois ou mais tópicos para uma mesma disciplina.
- A plataforma deverá permitir alterar a disciplina selecionada antes de iniciar a batalha.
- Ao alterar uma disciplina, a plataforma deverá permitir selecionar o tópico correspondente.
- O sistema deverá impedir o início da batalha enquanto houver disciplina sem tópico selecionado.
- O sistema deverá validar a disponibilidade de questões antes de iniciar a batalha.
- O sistema deverá gerar dez questões por batalha.
- Quando houver mais de um tópico selecionado, o sistema deverá distribuir as questões aleatoriamente, respeitando a quantidade mínima definida.
- O sistema deverá impedir a criação de uma batalha quando não houver questões suficientes para cumprir as regras de distribuição.
- A plataforma deverá apresentar uma mensagem explicativa quando não for possível iniciar a batalha por indisponibilidade de conteúdo.

---

## Feature 06 — Criação e início da batalha

### Descrição

Criar uma batalha a partir do oponente e dos conteúdos selecionados pelo estudante, encaminhando-o para a execução do quiz.

### Problema do usuário

Eu, como estudante, gostaria de iniciar uma batalha após escolher meu oponente e os conteúdos, para que eu possa responder às questões e disputar uma vitória no Campeonato.

**Prioridade:** Alta.

### Regras de negócio

- A batalha deverá ser vinculada ao Campeonato correspondente.
- A batalha deverá registrar os participantes.
- A batalha deverá registrar as disciplinas e os tópicos utilizados.
- A batalha deverá conter dez questões.
- A criação deverá validar a elegibilidade dos dois estudantes.
- A criação deverá validar a disponibilidade das questões.
- O estudante desafiante deverá iniciar sua participação após a criação da disputa.
- O oponente deverá receber o desafio e poderá realizar sua participação dentro do prazo de 24 horas, respeitadas as regras de encerramento do Campeonato.
- Não deverá existir uma etapa em que o oponente precise aceitar o desafio antes de participar.
- A batalha deverá registrar os horários necessários para controle do prazo de participação e do W.O.

### Critérios de aceite

- O sistema deverá criar a batalha após a validação dos dados.
- O sistema deverá associar a batalha ao Campeonato correto.
- O sistema deverá registrar os participantes.
- O sistema deverá registrar os conteúdos selecionados.
- O sistema deverá garantir a existência de dez questões.
- A plataforma deverá encaminhar o desafiante para a execução do quiz.
- O sistema deverá disponibilizar o desafio ao oponente.
- O sistema não deverá exigir aceite prévio do oponente.
- O sistema deverá registrar o horário de criação da batalha.
- O sistema deverá impedir a criação quando o Campeonato estiver encerrado.
- O sistema deverá impedir a criação quando um dos participantes não for elegível.
- O sistema não deverá criar disputas incompletas quando houver indisponibilidade de conteúdo.

---
## Feature 07 — Execução do quiz e controle de tempo

### Descrição

Permitir que cada estudante responda às dez questões da batalha em até dez minutos, com registro dos acertos e erros.

### Problema do usuário

Eu, como estudante, gostaria de responder às questões dentro de um período definido, para que eu possa participar de uma disputa justa e acompanhar meu desempenho.

**Prioridade:** Alta.

### Regras de negócio

**RN01 — Quantidade de questões**

Cada participação deverá apresentar dez questões.

**RN02 — Limite de tempo**

Cada estudante terá no máximo dez minutos para responder às dez questões.

**RN03 — Encerramento automático**

Quando o tempo se esgotar, a participação deverá ser encerrada automaticamente.

**RN04 — Questões não respondidas**

Todas as questões não respondidas no momento do encerramento automático deverão ser classificadas como erradas.

**RN05 — Registro de desempenho**

O sistema deverá registrar as respostas fornecidas, a quantidade de acertos, a quantidade de erros e o tempo utilizado.

**RN06 — Independência entre participantes**

O tempo de execução de um participante não deverá ampliar o limite de dez minutos do outro.

**RN07 — Resultado da batalha**

A comparação dos resultados deverá ocorrer conforme as regras vigentes da Batalha VS, considerando a quantidade de respostas corretas.
### Critérios de aceite

- A plataforma deverá apresentar um contador regressivo durante a batalha.
- O contador deverá iniciar no começo da participação do estudante.
- O sistema deverá encerrar a participação após dez minutos.
- O sistema deverá registrar as respostas fornecidas até o momento do encerramento.
- O sistema deverá classificar como erradas as questões não respondidas.
- O sistema deverá impedir o envio de respostas após o encerramento da participação.
- O sistema deverá registrar a quantidade de acertos e erros.
- O sistema deverá registrar o tempo utilizado pelo participante.
- O sistema deverá preservar o resultado mesmo que o estudante saia da tela após o encerramento da participação.
- O encerramento automático não deverá gerar uma nova tentativa da mesma participação.
- O sistema deverá utilizar o resultado registrado para a apuração da batalha.

---

## Feature 08 — Resultado da batalha e contabilização das vitórias

### Descrição

Determinar o resultado da disputa a partir do desempenho dos participantes e registrar a vitória, o empate ou a derrota no Campeonato.

### Problema do usuário

Eu, como estudante, gostaria de consultar o resultado da batalha e compreender como ele contribui para minha classificação, para que eu possa acompanhar minha evolução na competição.

**Prioridade:** Alta.

### Regras de negócio

**RN01 — Critério de vitória**

Vence a batalha o participante com a maior quantidade de respostas corretas.

**RN02 — Empate**

Se os dois participantes tiverem a mesma quantidade de respostas corretas, a batalha será considerada empatada.

**RN03 — Tempo de resposta**

O tempo de resposta não será utilizado para desempatar o resultado da batalha.

**RN04 — Contabilização**

Somente uma vitória válida deverá acrescentar uma vitória ao estudante vencedor.

**RN05 — Empates e derrotas**

Empates e derrotas não acrescentarão vitórias aos participantes.

**RN06 — Resultado pendente**

Enquanto o oponente não concluir sua participação e ainda estiver dentro do prazo, a batalha deverá permanecer pendente de resultado definitivo.

**RN07 — Resultado por W.O.**

Quando aplicável, a vitória por W.O. deverá ser contabilizada conforme as regras de prazo descritas neste PRD.

### Critérios de aceite

- O sistema deverá registrar os acertos de cada participante.
- O sistema deverá declarar vencedor quem tiver mais acertos.
- O sistema deverá registrar empate quando houver igualdade de acertos.
- O tempo de resposta não deverá desempatar a batalha.
- O sistema deverá registrar o resultado final da disputa.
- Uma vitória deverá acrescentar exatamente uma vitória ao participante vencedor.
- Um empate não deverá acrescentar vitórias.
- Uma derrota não deverá acrescentar vitórias ao participante derrotado.
- O sistema deverá impedir a contabilização duplicada do mesmo resultado.
- A batalha deverá deixar de ser apresentada como pendente quando seu resultado for definitivo.
- A atualização do ranking deverá considerar o resultado válido da batalha.
- A plataforma deverá diferenciar batalhas finalizadas de batalhas que ainda aguardam a participação do oponente.

---

## Feature 09 — Controle de prazo e W.O.

### Descrição

Controlar o prazo para participação do oponente e determinar quando uma batalha poderá ser encerrada por W.O., respeitando o horário de término do Campeonato.

### Problema do usuário

Eu, como estudante, gostaria que as batalhas tivessem prazos claros para participação, para que eu possa acompanhar as disputas e compreender quando um resultado será definido.

**Prioridade:** Alta.

### Regras de negócio

**RN01 — Prazo padrão**

O oponente terá até 24 horas após a criação da batalha para realizar sua participação.

**RN02 — Verificação de W.O.**

O sistema deverá verificar se a batalha foi concluída após o prazo de 24 horas.

**RN03 — Batalha finalizada**

Se a batalha já estiver finalizada no momento da verificação, o sistema não deverá alterar seu resultado.

**RN04 — Batalha pendente com prazo hábil**

Se a batalha permanecer pendente após 24 horas e tiver sido iniciada com antecedência suficiente em relação ao término do Campeonato, o desafiante deverá vencer por W.O.

**RN05 — Proximidade do encerramento**

Se a batalha for iniciada a menos de 24 horas do término do Campeonato, a ausência de participação do oponente não deverá gerar vitória por W.O.

**RN06 — Ausência de vencedor**

Quando a batalha for iniciada a menos de 24 horas do encerramento do Campeonato e o oponente não responder dentro do período restante, a disputa deverá ser encerrada sem atribuição de vitória a qualquer participante.

**RN07 — Integridade do ranking**

Uma batalha encerrada sem vencedor não deverá acrescentar vitórias a nenhum estudante.

**RN08 — Idempotência**

O processamento dos prazos deverá impedir a geração de resultados ou contabilizações duplicadas.

### Critérios de aceite

- O sistema deverá registrar a data e o horário de criação da batalha.
- O sistema deverá registrar a data e o horário de término do Campeonato.
- O sistema deverá calcular o prazo de 24 horas para a participação do oponente.
- O sistema deverá verificar o estado da batalha ao processar o prazo.
- Se a batalha estiver finalizada, o sistema não deverá alterar o resultado.
- Se o prazo de 24 horas for cumprido e a batalha continuar pendente, deverá ser aplicada a regra de W.O., desde que exista tempo hábil antes do encerramento do Campeonato.
- Se a batalha tiver sido iniciada a menos de 24 horas do término do Campeonato, o sistema não deverá conceder W.O. por ausência de resposta.
- A batalha sem resposta e sem tempo hábil deverá ser encerrada sem vencedor.
- A batalha encerrada sem vencedor não deverá acrescentar vitórias a nenhum participante.
- A batalha encerrada por W.O. deverá deixar de ser apresentada como pendente.
- O sistema deverá registrar o motivo do encerramento da batalha.
- A execução repetida da rotina não deverá gerar resultados duplicados.
- O ranking deverá refletir os resultados válidos após o processamento.

---

## Feature 10 — Ranking do Campeonato

### Descrição

Apresentar a classificação geral dos participantes com base em seus resultados acumulados durante a competição.

### Problema do usuário

Eu, como estudante, gostaria de consultar o ranking do Campeonato, para que eu possa acompanhar minha posição e entender como meu desempenho se compara ao dos outros participantes.

**Prioridade:** Alta.

### Regras de negócio

A classificação deverá respeitar a seguinte ordem de critérios:

**1º critério — Número de vitórias**

O estudante com maior quantidade de vitórias ficará à frente.

**2º critério — Acertos acumulados**

Em caso de empate no número de vitórias, ficará à frente o estudante com maior quantidade acumulada de respostas corretas nas batalhas válidas do Campeonato.

**3º critério — Tempo médio de respostas corretas**

Persistindo o empate, ficará à frente o estudante com menor tempo médio de resposta nas questões acertadas.

**4º critério — Ordem alfabética**

Se o empate persistir após os três critérios anteriores, a classificação será definida pela ordem alfabética do nome do estudante.

### Regras complementares

- A quantidade de vitórias será sempre o critério principal.
- Os acertos deverão ser acumulados, e não calculados como média de desempenho.
- O tempo médio de respostas corretas será utilizado exclusivamente como critério de desempate do ranking.
- O tempo médio não deverá alterar o resultado de uma batalha individual.
- Os resultados deverão ser contabilizados uma única vez.
- Batalhas sem vencedor não deverão gerar vitórias.
- Resultados de batalhas não concluídas não deverão ser contabilizados como vitórias.
- A classificação deverá ser atualizada conforme os resultados válidos forem registrados.

### Critérios de aceite

- A plataforma deverá apresentar o nome do Campeonato associado ao ranking.
- A plataforma deverá destacar visualmente os três primeiros colocados.
- A plataforma deverá apresentar o nome e o avatar dos estudantes.
- A plataforma deverá apresentar a quantidade de vitórias.
- A plataforma deverá apresentar os acertos acumulados utilizados na classificação, quando previstos na interface.
- O sistema deverá ordenar primeiro pelo número de vitórias, em ordem decrescente.
- Em caso de empate em vitórias, o sistema deverá ordenar pela quantidade acumulada de acertos, em ordem decrescente.
- Persistindo o empate, o sistema deverá ordenar pelo menor tempo médio de resposta nas questões acertadas.
- Persistindo o empate, o sistema deverá ordenar alfabeticamente pelo nome do estudante.
- O sistema deverá aplicar os critérios de maneira consistente em todas as consultas ao ranking.
- A classificação não deverá ser determinada apenas pelos acertos acumulados.
- A plataforma deverá permitir consultar os demais participantes quando houver mais resultados do que os exibidos inicialmente.
- A plataforma deverá destacar o estudante autenticado na lista, quando aplicável.
- O ranking deverá refletir as vitórias válidas registradas no Campeonato.

---

## Feature 11 — Histórico de batalhas

### Descrição

Permitir que o estudante consulte as batalhas realizadas no contexto do Campeonato, acompanhando seus resultados e seu desempenho.

### Problema do usuário

Eu, como estudante, gostaria de consultar minhas batalhas anteriores, para que eu possa acompanhar minha evolução e revisar meu desempenho durante a competição.

**Prioridade:** Média.

### Regras de negócio

- O histórico deverá apresentar as batalhas relacionadas ao Campeonato.
- Cada registro deverá apresentar os participantes e o estado da disputa.
- Os resultados deverão ser diferenciados conforme a situação da batalha.
- Batalhas pendentes deverão ser identificadas como tal.
- Batalhas finalizadas deverão apresentar o resultado registrado.
- Batalhas encerradas sem vencedor deverão apresentar um estado compatível com essa situação.
- A consulta ao histórico não deverá alterar resultados ou contabilizar vitórias novamente.

### Critérios de aceite

- A plataforma deverá disponibilizar acesso ao histórico do Campeonato.
- A plataforma deverá apresentar as batalhas realizadas pelo estudante.
- Cada registro deverá apresentar o nome e o avatar do oponente.
- Cada registro deverá apresentar a data da batalha, quando disponível.
- A plataforma deverá apresentar o resultado da disputa quando definitivo.
- A plataforma deverá identificar batalhas aguardando a participação do oponente.
- A plataforma deverá identificar batalhas encerradas sem vencedor.
- A plataforma deverá permitir acessar os detalhes de uma batalha finalizada.
- A plataforma deverá apresentar um estado vazio quando não houver histórico.
- A consulta ao histórico não deverá modificar o ranking.

---

## Feature 12 — Revisão das questões e feedback de aprendizagem

### Descrição

Permitir que o estudante consulte o gabarito das questões após concluir sua participação em uma batalha, identificando seus acertos e erros.

### Problema do usuário

Eu, como estudante, gostaria de revisar as questões da batalha, para que eu possa compreender meus erros e reforçar meus conhecimentos.

**Prioridade:** Média.

### Regras de negócio

- O gabarito deverá seguir as regras vigentes das Batalhas VS.
- O estudante deverá conseguir identificar quais questões acertou ou errou após concluir sua participação.
- A revisão da própria participação não deverá depender de o oponente já ter concluído a dele.
- O resultado definitivo da disputa deverá ser diferenciado do resultado individual do estudante.
- A revisão não deverá alterar respostas ou resultados registrados.

### Critérios de aceite

- A plataforma deverá disponibilizar a ação de revisar questões após a conclusão da participação.
- A plataforma deverá apresentar as questões respondidas.
- A plataforma deverá identificar as alternativas corretas.
- A plataforma deverá indicar quais respostas foram acertadas ou erradas.
- A plataforma deverá apresentar as questões não respondidas como erradas, quando a participação for encerrada por tempo.
- A plataforma deverá permitir retornar ao Campeonato.
- A revisão não deverá permitir alterar respostas já registradas.
- A revisão não deverá modificar o resultado da batalha ou a classificação do Campeonato.

---

## Feature 13 — Encerramento do Campeonato

### Descrição

Encerrar a competição conforme a data e o horário configurados pelo educador, consolidando os resultados válidos e a classificação final.

### Problema do usuário

Eu, como estudante, gostaria de consultar a classificação final do Campeonato, para que eu possa conhecer o resultado da competição e minha posição definitiva.

**Prioridade:** Alta.

### Regras de negócio

- O Campeonato deverá respeitar a data e o horário de término configurados.
- Após o encerramento, não deverão ser iniciadas novas batalhas.
- As batalhas finalizadas deverão preservar seus resultados.
- As batalhas que não tiverem tempo hábil para a conclusão do prazo de 24 horas não deverão gerar vitórias por W.O.
- As batalhas sem resposta e sem tempo hábil deverão ser encerradas sem vencedor.
- O ranking final deverá considerar os resultados válidos.
- A classificação final deverá respeitar os quatro critérios de ordenação definidos neste PRD.

### Critérios de aceite

- O sistema deverá encerrar o Campeonato no horário configurado.
- A plataforma deverá impedir a criação de novas batalhas após o encerramento.
- A plataforma deverá manter disponíveis os resultados das batalhas já concluídas.
- O sistema deverá tratar as batalhas pendentes conforme as regras de prazo e encerramento.
- O sistema não deverá conceder W.O. em situações sem tempo hábil.
- O ranking final deverá considerar as vitórias válidas.
- A classificação final deverá respeitar todos os critérios de desempate.
- A plataforma deverá indicar que o Campeonato está encerrado.
- O histórico deverá continuar disponível após o encerramento, conforme as permissões e regras de retenção da plataforma.

---

# 4. User Flow

## 4.1. Configuração do Campeonato

1. O educador acessa a plataforma Educadores.
2. Acessa a funcionalidade de Campeonato.
3. Seleciona a opção para criar uma nova competição.
4. Informa o nome do Campeonato.
5. Define a data e o horário de início.
6. Define a data e o horário de término.
7. Configura os conteúdos que poderão ser utilizados nas batalhas.
8. Define os participantes ou o público elegível.
9. O sistema valida as informações obrigatórias.
10. O sistema valida a disponibilidade de conteúdo.
11. O sistema salva o Campeonato.
12. A competição fica disponível aos estudantes elegíveis conforme o período configurado.

## 4.2. Acesso do estudante ao Campeonato

1. O estudante acessa a Geniex.
2. Acessa a área de Campeonatos.
3. Visualiza os Campeonatos disponíveis.
4. Seleciona um Campeonato.
5. Consulta as informações gerais da competição.
6. Visualiza as batalhas em andamento.
7. Consulta o ranking ou o histórico.
8. Seleciona a opção para iniciar uma nova batalha, caso esteja elegível.

## 4.3. Criação de uma batalha

1. O estudante seleciona a opção de iniciar uma batalha.
2. A plataforma apresenta os oponentes elegíveis.
3. O estudante seleciona um oponente.
4. O sistema valida se ambos pertencem à mesma escola e ao mesmo ano escolar.
5. O sistema valida se ambos estão elegíveis para o Campeonato.
6. O estudante seleciona de uma a três disciplinas.
7. Para cada disciplina, seleciona exatamente um tópico.
8. O sistema valida a configuração dos conteúdos.
9. O sistema valida a disponibilidade de dez questões.
10. O sistema cria a batalha.
11. O sistema registra os participantes e os conteúdos.
12. O sistema registra os horários necessários para o controle do prazo.
13. O desafiante é encaminhado para a execução do quiz.
14. O oponente recebe o desafio e poderá realizar sua participação no prazo aplicável.

## 4.4. Execução da batalha

1. O estudante inicia a participação.
2. O sistema apresenta dez questões.
3. O contador regressivo de dez minutos é iniciado.
4. O estudante responde às questões.
5. O sistema registra as respostas.
6. Caso o estudante conclua antes do limite, sua participação é finalizada.
7. Caso o tempo se esgote, o sistema encerra a participação automaticamente.
8. As questões não respondidas são classificadas como erradas.
9. O sistema registra os acertos, os erros e o tempo utilizado.
10. O estudante pode consultar o gabarito de sua participação.
11. A batalha permanece aguardando o oponente, caso ele ainda não tenha concluído sua participação.

## 4.5. Apuração do resultado

1. O sistema verifica se os dois participantes concluíram suas participações ou se houve encerramento válido por W.O.
2. Quando ambos concluírem, o sistema compara a quantidade de respostas corretas.
3. Se um participante tiver mais acertos, ele vence.
4. Se ambos tiverem a mesma quantidade de acertos, a batalha termina empatada.
5. O sistema registra o resultado.
6. O sistema atualiza a quantidade de vitórias do participante vencedor, quando aplicável.
7. O ranking é atualizado com os resultados válidos.
8. O estudante pode consultar o resultado e revisar as questões.

## 4.6. Verificação de W.O.
1. O sistema registra o horário de criação da batalha.
2. O sistema considera o prazo de 24 horas para a participação do oponente.
3. Antes de conceder W.O., verifica o estado da batalha e o horário de término do Campeonato.
4. Se a batalha já estiver finalizada, o sistema preserva o resultado.
5. Se a batalha estiver pendente e houver tempo hábil para o prazo de 24 horas, o sistema poderá conceder W.O. ao desafiante.
6. Se a batalha tiver sido iniciada a menos de 24 horas do término do Campeonato, a ausência de resposta não gera W.O.
7. Nesse último caso, a batalha é encerrada sem vencedor quando o Campeonato termina.
8. O sistema atualiza os estados da batalha e o ranking conforme as regras válidas.

## 4.7. Consulta ao ranking

1. O estudante acessa o ranking do Campeonato.
2. O sistema consulta as vitórias e os acertos acumulados dos participantes.
3. O sistema calcula o tempo médio de resposta das questões acertadas para fins de desempate.
4. O sistema ordena os estudantes pelos quatro critérios definidos.
5. A plataforma apresenta a classificação.
6. Os três primeiros colocados recebem destaque visual.
7. O estudante pode consultar sua posição e retornar ao Campeonato.

## 4.8. Encerramento

1. O horário de término do Campeonato é atingido.
2. O sistema impede novas batalhas.
3. As batalhas já concluídas preservam seus resultados.
4. As batalhas pendentes são tratadas conforme as regras de prazo.
5. As batalhas sem tempo hábil para W.O. não geram vencedores.
6. O sistema consolida os resultados válidos.
7. O ranking final é disponibilizado.

---

# 5. Delivery — Critérios e restrições

## 5.1. Critérios de implementação

### Backend

- Implementar a entidade de Campeonato e sua associação com a instituição.
- Registrar o período de vigência da competição.
- Registrar os participantes elegíveis.
- Validar escola e ano escolar antes da criação da batalha.
- Integrar a criação da batalha às regras existentes da Batalha VS.
- Validar a seleção de uma a três disciplinas e um tópico por disciplina.
- Garantir dez questões por batalha.
- Garantir o limite de dez minutos por participante.
- Registrar as respostas e o desempenho de cada estudante.
- Implementar a contabilização de vitórias.
- Implementar a rotina de verificação de W.O.
- Considerar o horário de término do Campeonato no processamento de W.O.
- Implementar a classificação do ranking com os quatro critérios definidos.
- Garantir idempotência na contabilização dos resultados.
- Preservar o histórico e os resultados após o encerramento.

### Frontend — Geniex

- Disponibilizar a área de Campeonatos.
- Implementar a visualização e o detalhamento da competição.
- Implementar a seleção de oponente.
- Implementar a seleção de disciplinas e tópicos.
- Implementar a execução do quiz com contador regressivo.
- Implementar os estados de batalha pendente, concluída e encerrada sem vencedor.
- Implementar a apresentação dos resultados.
- Disponibilizar a revisão das questões.
- Implementar o ranking.
- Implementar o histórico de batalhas.
- Implementar os estados de Campeonato encerrado.

### Frontend — Educadores

- Disponibilizar a criação de Campeonatos.
- Implementar a configuração do período de vigência.
- Implementar a configuração dos conteúdos.
- Implementar a configuração dos participantes ou do público elegível.
- Implementar validações para os campos obrigatórios.
- Implementar mensagens de erro e confirmação.

### Dados e monitoramento

- Instrumentar a criação de Campeonatos.
- Instrumentar o início e a conclusão das batalhas.
- Registrar os resultados das disputas.
- Registrar as ocorrências de W.O.
- Monitorar a taxa de participação.
- Monitorar a taxa de conclusão.
- Monitorar o acesso ao ranking.
- Acompanhar a incidência de batalhas encerradas sem vencedor.

## 5.2. Dependências

- Plataforma Educadores.
- Plataforma Geniex.
- Serviço de autenticação e identificação dos estudantes.
- Cadastro de escolas, turmas e anos escolares.
- Serviço de conteúdo e questões.
- Funcionalidade Batalhas VS.
- Serviço de registro de respostas e resultados.
- Serviço de ranking.
- Serviço de agendamento e processamento de W.O.

## 5.3. Restrições de implementação

- Não duplicar desnecessariamente a lógica já existente nas Batalhas VS.
- Não permitir a criação de batalhas fora do período permitido.
- Não permitir batalhas entre estudantes inelegíveis.
- Não permitir resultados duplicados.
- Não conceder W.O. sem observar as regras de prazo.
- Não utilizar o tempo médio como critério de desempate da batalha individual.
- Não utilizar a pontuação acumulada como critério principal do ranking.
- Não permitir que batalhas sem vencedor gerem vitórias.
- Não alterar resultados válidos de batalhas concluídas.
- Não permitir que a execução repetida de uma rotina altere indevidamente o ranking.

---

# 6. Roadmap de implementação

O planejamento deverá ser validado após o refinamento técnico e a análise das dependências existentes.

### Etapa 1 — Regras e arquitetura

- Validar o modelo de dados do Campeonato.
- Definir a associação com escolas, anos escolares e participantes.
- Validar a integração com as Batalhas VS.
- Definir as regras de contabilização e ranking.
- Especificar o processamento de W.O. e encerramento.

### Etapa 2 — Configuração em Educadores

- Implementar a criação do Campeonato.
- Implementar o período de vigência.
- Implementar a configuração dos conteúdos.
- Implementar a configuração dos participantes ou do público elegível.
- Implementar as validações de cadastro.

### Etapa 3 — Experiência do estudante

- Implementar a listagem de Campeonatos.
- Implementar o detalhamento da competição.
- Implementar a seleção de oponente.
- Implementar a seleção de disciplinas e tópicos.
- Integrar a criação da batalha ao fluxo existente.

### Etapa 4 — Execução e apuração

- Implementar ou integrar o controle de dez minutos.
- Garantir o registro das respostas.
- Implementar a apuração do resultado.
- Implementar o controle de W.O.
- Implementar as regras de encerramento.

### Etapa 5 — Ranking e histórico

- Implementar a ordenação pelos quatro critérios.
- Implementar a visualização do ranking.
- Implementar o histórico.
- Garantir a consistência dos resultados.

### Etapa 6 — Homologação e lançamento

- Validar os fluxos principais.
- Testar os cenários de exceção.
- Validar os critérios de elegibilidade.
- Testar os limites de tempo.
- Validar o processamento de W.O.
- Testar o ranking.
- Monitorar os indicadores após o lançamento.

---

# 7. Go to Market e gestão de riscos

## 7.1. Go to Market

O lançamento deverá apresentar o Campeonato como uma experiência de aprendizagem competitiva, na qual os estudantes disputam batalhas de conhecimento e acumulam vitórias durante um período definido.

A comunicação deverá destacar:

- A possibilidade de disputar com estudantes da mesma escola e do mesmo ano escolar.
- A participação de estudantes de diferentes turmas.
- A dinâmica das Batalhas VS.
- O limite de dez questões e dez minutos por participação.
- O ranking baseado prioritariamente em vitórias.
- A possibilidade de acompanhar resultados e revisar questões.

Os educadores deverão receber orientações sobre a configuração dos Campeonatos e sobre as regras de participação e encerramento.

## 7.2. Gestão de riscos

### Risco 1 — Elegibilidade incorreta

**Descrição:** estudantes de escolas ou anos escolares diferentes podem aparecer como oponentes.

**Mitigação:** validar a elegibilidade no backend durante a listagem, a seleção e a criação da batalha.

### Risco 2 — Conteúdo insuficiente

**Descrição:** a combinação de disciplinas e tópicos pode não possuir questões suficientes para montar uma batalha válida.

**Mitigação:** validar a disponibilidade de questões antes de iniciar a disputa e apresentar uma mensagem explicativa quando não for possível continuar.

### Risco 3 — Divergência de resultados

**Descrição:** inconsistências no registro das respostas podem gerar resultados incorretos.

**Mitigação:** garantir a persistência das respostas e a idempotência do processamento de resultados.

### Risco 4 — W.O. indevido

**Descrição:** o sistema pode conceder uma vitória por W.O. quando não houver tempo hábil para o oponente participar.

**Mitigação:** validar o prazo de 24 horas considerando o horário de encerramento do Campeonato.

### Risco 5 — Ranking incorreto

**Descrição:** divergências na aplicação dos critérios podem produzir classificações inconsistentes.

**Mitigação:** centralizar a regra de ordenação e garantir sua aplicação uniforme em todas as consultas.

### Risco 6 — Baixa participação

**Descrição:** os estudantes podem não compreender a dinâmica ou não encontrar incentivos para continuar participando.
**Mitigação:** acompanhar as métricas de participação, conclusão e consulta ao ranking, utilizando os resultados para orientar melhorias.

### Risco 7 — Batalhas pendentes no encerramento

**Descrição:** batalhas em andamento podem gerar dúvidas sobre a validade de seus resultados.

**Mitigação:** definir e implementar os estados de encerramento, respeitando os resultados já concluídos e as regras de W.O.

---

# 8. Futuro

Após o lançamento e a análise dos indicadores, poderão ser avaliadas evoluções como:

- Relatórios gerenciais para educadores.
- Análise de participação por turma.
- Acompanhamento de desempenho por disciplina.
- Histórico consolidado de Campeonatos.
- Melhorias na comunicação de prazos e desafios pendentes.
- Indicadores de evolução acadêmica dos participantes.
- Novas formas de reconhecimento de desempenho.

Essas evoluções não fazem parte do escopo obrigatório desta versão.

---

# 9. Q&A — Perguntas e respostas

## 9.1. Configuração do Campeonato

**Q1. Quem pode criar um Campeonato?**

O educador, por meio da plataforma Educadores.

**Q2. Onde o estudante participa do Campeonato?**

Na plataforma Geniex.

**Q3. O Campeonato pode envolver estudantes de diferentes turmas?**

Sim. Os estudantes podem pertencer a turmas diferentes, desde que sejam da mesma escola e do mesmo ano escolar.

**Q4. Um estudante pode batalhar com alguém de outra escola?** Não. As batalhas são restritas a estudantes da mesma escola.

**Q5. Um estudante do 1º ano pode batalhar com alguém do 2º ano?**

Não. Os dois participantes devem estar matriculados no mesmo ano escolar.

**Q6. O Campeonato precisa ter um período definido?**

Sim. O educador deverá informar data e horário de início e término.

**Q7. O término pode ser anterior ao início?**

Não. O sistema deverá impedir essa configuração.

**Q8. O que acontece quando o Campeonato termina?**

Novas batalhas não poderão ser iniciadas. Os resultados válidos deverão ser preservados e a classificação final deverá ser consolidada.

## 9.2. Participação e criação de batalhas

**Q9. Quem pode ser escolhido como oponente?**

Um estudante elegível da mesma escola e do mesmo ano escolar, respeitando as regras de participação do Campeonato.

**Q10. O estudante pode batalhar com alguém de outra turma?**

Sim, desde que ambos pertençam à mesma escola e ao mesmo ano escolar.

**Q11. O estudante pode desafiar a si próprio?**

Não. O sistema deverá impedir essa situação.

**Q12. O oponente precisa aceitar o desafio antes de a batalha começar?**

Não. O desafiante inicia sua participação, e o oponente recebe o desafio para realizar a própria batalha.

**Q13. Quantas disciplinas podem ser selecionadas por batalha?**

No mínimo uma e no máximo três.

**Q14. Quantos tópicos podem ser selecionados por disciplina?**

Exatamente um tópico por disciplina selecionada.

**Q15. O que acontece se o estudante selecionar duas disciplinas, mas escolher apenas um tópico?**

O sistema deverá impedir o início da batalha até que exista um tópico selecionado para cada disciplina.

**Q16. Quantas questões compõem uma batalha?**

Dez questões, independentemente de o estudante selecionar uma, duas ou três disciplinas.

**Q17. Como as questões são distribuídas quando há mais de uma disciplina?**

A ordem e a quantidade de questões por tópico são definidas aleatoriamente, respeitando a regra de pelo menos três questões de cada tópico selecionado.

**Q18. O que acontece se não houver questões suficientes?**

A batalha não deverá ser iniciada. O estudante deverá receber uma mensagem explicando a indisponibilidade do conteúdo.

## 9.3. Execução e resultado das batalhas

**Q19. Quanto tempo cada estudante tem para responder às questões?**

Até dez minutos para responder às dez questões.

**Q20. O que acontece se o tempo acabar antes de o estudante responder a todas as questões?**

A participação é encerrada automaticamente. As questões não respondidas são classificadas como erradas.

**Q21. Como o vencedor de uma batalha é definido?**

Vence quem tiver a maior quantidade de respostas corretas.

**Q22. O que acontece quando os dois estudantes acertam a mesma quantidade de questões?**

A batalha termina empatada.

**Q23. O tempo de resposta pode desempatar uma batalha individual?**

Não. O resultado da batalha é determinado pela quantidade de acertos.

**Q24. O estudante pode revisar as questões depois de responder?**

Sim. A plataforma deverá permitir a consulta ao gabarito da própria participação.
**Q25. O estudante precisa esperar o oponente terminar para revisar suas questões?**

Não. A revisão da própria participação pode ocorrer após sua conclusão, mesmo que o resultado definitivo da disputa ainda esteja pendente.

## 9.4. Prazos e W.O.

**Q26. Qual é o prazo para o oponente realizar sua participação?**

Até 24 horas após a criação da batalha.

**Q27. O que acontece se o oponente não participar dentro do prazo de 24 horas?**

Se houver tempo hábil antes do encerramento do Campeonato e a batalha continuar pendente, o sistema deverá conceder a vitória por W.O. ao desafiante.

**Q28. O que acontece quando a batalha é iniciada a menos de 24 horas do término do Campeonato?**

Se o oponente não responder dentro do período restante, não haverá vencedor por W.O., pois não existiu tempo hábil para cumprir o prazo de 24 horas.

**Q29. Uma batalha encerrada sem vencedor acrescenta vitórias ao ranking?**

Não. Nenhum dos participantes recebe uma vitória por essa batalha.

**Q30. O sistema pode alterar uma batalha que já foi finalizada?**

Não. A verificação de W.O. não deverá alterar um resultado já finalizado.

**Q31. O W.O. conta como vitória no ranking?**

Sim, quando concedido de acordo com as regras de negócio.

**Q32. Uma batalha pode continuar pendente depois do encerramento do Campeonato?**

Não deverá permanecer como disputa ativa. As pendências deverão ser encerradas conforme as regras de término e de W.O.

## 9.5. Ranking e classificação

**Q33. Qual é o principal critério para vencer o Campeonato?**

A maior quantidade de vitórias válidas acumuladas durante a competição.

**Q34. Como funciona o primeiro critério de desempate do ranking?**

Em caso de empate no número de vitórias, fica à frente quem tiver mais respostas corretas acumuladas nas batalhas válidas.

**Q35. Como funciona o segundo critério de desempate?**

Persistindo o empate, fica à frente quem tiver o menor tempo médio de resposta nas questões acertadas.

**Q36. Qual é o último critério de desempate?**

A ordem alfabética do nome do estudante.

**Q37. O tempo médio de resposta altera o resultado de uma batalha individual?**

Não. Esse indicador é utilizado exclusivamente para desempatar a classificação geral do Campeonato.

**Q38. Os acertos acumulados podem colocar um estudante com menos vitórias à frente de outro com mais vitórias?**

Não. O número de vitórias sempre prevalece sobre os critérios secundários.

**Q39. Empates e derrotas acrescentam vitórias ao ranking?**

Não. Apenas vitórias válidas são contabilizadas como vitórias.

**Q40. Como o ranking é atualizado?**

O ranking deverá refletir os resultados válidos registrados, respeitando a regra de contabilização única e os critérios de classificação.

**Q41. O que acontece quando dois estudantes têm o mesmo número de vitórias e acertos acumulados, além do mesmo tempo médio de resposta?**

A ordem alfabética do nome do estudante determinará a classificação relativa.

**Q42. O ranking continua disponível depois do encerramento?**

Sim. A classificação final deverá permanecer disponível conforme as regras de acesso e retenção da plataforma.

## 9.6. Histórico e experiência geral

**Q43. O estudante pode consultar suas batalhas anteriores?**

Sim. O histórico deverá apresentar as batalhas relacionadas ao Campeonato e seus resultados disponíveis.

**Q44. O histórico pode alterar o resultado de uma batalha?**

Não. A consulta é apenas informativa e não deverá modificar resultados ou contabilizações.

**Q45. O que acontece quando o estudante ainda não participou de nenhuma batalha?**

A plataforma deverá apresentar um estado vazio contextualizado, orientando o estudante sobre a possibilidade de iniciar uma disputa, quando elegível.

**Q46. O que acontece quando uma batalha está aguardando o oponente?**

A plataforma deverá identificar claramente esse estado e apresentar as informações disponíveis sobre o prazo de participação.

**Q47. Qual é a principal diferença entre o resultado de uma batalha e o ranking do Campeonato?**

O resultado da batalha é determinado pela quantidade de acertos naquela disputa. O ranking do Campeonato considera as vitórias acumuladas e, em caso de empate, os acertos acumulados, o tempo médio de resposta das questões acertadas e a ordem alfabética.

**Q48. Quais indicadores serão utilizados para avaliar o sucesso da funcionalidade?**

Entre os principais indicadores estão a adoção do Campeonato, a taxa de participação, a quantidade de batalhas por competição, a taxa de conclusão, a incidência de W.O., a frequência de participação e a consulta ao ranking.

---

# 10. Pontos para validação técnica antes do desenvolvimento

Os requisitos funcionais e as regras de negócio estão definidos nesta versão. Os pontos abaixo precisam ser detalhados no refinamento técnico para garantir que o comportamento seja consistente.

### 10.1. Tempo médio de resposta

É necessário definir a unidade de medida e a fórmula de cálculo do tempo médio de resposta das questões acertadas, garantindo que o indicador seja comparável entre os participantes.

Recomenda-se considerar o tempo decorrido entre a apresentação da questão e o registro da resposta correta, utilizando apenas questões efetivamente respondidas corretamente.

### 10.2. Disponibilidade de questões

É necessário validar como o banco de questões garante a disponibilidade de dez questões por batalha, respeitando a quantidade mínima de três questões por tópico quando houver múltiplos tópicos selecionados.

### 10.3. Elegibilidade e participantes

É necessário definir como a configuração do Campeonato em Educadores identificará os estudantes elegíveis, considerando a escola, o ano escolar e as possíveis mudanças de matrícula durante a vigência da competição.

### 10.4. Encerramento de batalhas pendentes

É necessário detalhar tecnicamente como o sistema encerrará as batalhas que permanecerem pendentes quando o Campeonato terminar, garantindo que não sejam concedidas vitórias por W.O. quando não houver tempo hábil.

### 10.5. Cálculo da classificação final

É necessário validar como o ranking tratará participantes sem respostas corretas, empates em todos os critérios e batalhas encerradas sem vencedor, garantindo uma ordenação determinística e consistente.

---

**Resultado esperado:** uma experiência de Campeonato integrada entre Educadores e Geniex, com regras claras de participação, batalhas consistentes com a funcionalidade VS, classificação transparente e tratamento correto dos prazos e resultados.
