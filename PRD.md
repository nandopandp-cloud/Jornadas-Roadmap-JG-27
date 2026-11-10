# PRD — Relatórios do Teste Vocacional | Geniex

## 1. Contexto

O Teste Vocacional da Geniex tem como objetivo ajudar estudantes do Ensino Médio a reconhecer seus interesses profissionais, valores, preferências de trabalho e habilidades percebidas, ampliando seu repertório sobre possibilidades de carreira.

Para permitir que a escola acompanhe essa iniciativa, será disponibilizada na plataforma Educadores uma área de relatórios do Teste Vocacional.

Essa área permitirá que professores consultem os resultados individuais dos estudantes, compreendam seus principais interesses e tenham informações para apoiar conversas e atividades de orientação profissional.

Diferentemente dos relatórios tradicionais de avaliações, essa funcionalidade não tem como objetivo analisar desempenho acadêmico, aprendizagem ou engajamento. Seu foco é apresentar informações sobre o perfil vocacional de cada estudante de maneira clara, visual e contextualizada.

## 2. Objetivo do produto

Disponibilizar aos professores uma experiência de consulta aos resultados do Teste Vocacional, permitindo:

- Identificar rapidamente o perfil vocacional de cada estudante.
- Compreender suas principais áreas de interesse profissional.
- Visualizar os valores e as preferências de trabalho declarados.
- Conhecer as habilidades que o estudante reconhece em si e aquelas que deseja desenvolver.
- Consultar as profissões recomendadas pelo instrumento.
- Utilizar os resultados como apoio em conversas de orientação profissional.

**Objetivo principal:** transformar os resultados do Teste Vocacional em informações acessíveis para que o professor consiga compreender melhor os interesses e as possibilidades profissionais de cada estudante.

## 3. Premissas e diretrizes

- O relatório será disponibilizado na plataforma Educadores.
- A consulta será realizada por turma e por estudante.
- Cada estudante terá seu próprio relatório individual.
- Os dados apresentados deverão corresponder às respostas efetivamente registradas no Teste Vocacional.
- O relatório deverá respeitar a metodologia RIASEC e os demais blocos do instrumento.
- Os resultados representam interesses e percepções declaradas pelo estudante, não aptidões comprovadas.
- As profissões recomendadas são possibilidades de exploração, não indicações definitivas.
- Não haverá comparação ou ranking de estudantes por perfil vocacional.
- O relatório não deverá utilizar os resultados para classificar estudantes ou restringir suas possibilidades profissionais.

## 4. Estrutura da experiência

A experiência será dividida em duas telas principais:

1. **Listagem de estudantes:** consulta dos resultados disponíveis por turma.
2. **Relatório individual:** apresentação detalhada do perfil vocacional do estudante selecionado.

---

## 5. Tela 1 — Listagem de estudantes

### Objetivo

Permitir que o professor visualize os estudantes de uma turma e identifique rapidamente quais já realizaram o Teste Vocacional e quais possuem resultados disponíveis.

### 5.1. Cabeçalho

Apresentar:

- Título: Relatórios do Teste Vocacional.
- Descrição: Consulte os resultados e conheça melhor os interesses profissionais dos seus estudantes.
- Seletor de turma.
- Campo de busca por nome do estudante.

### 5.2. Indicadores de acompanhamento

Apresentar indicadores gerais da turma:

**Estudantes da turma:** quantidade total de estudantes vinculados à turma.

**Testes concluídos:** quantidade de estudantes que finalizaram o questionário.

**Testes em andamento:** quantidade de estudantes que iniciaram, mas ainda não finalizaram.

**Não iniciados:** quantidade de estudantes que ainda não começaram o teste.

Esses indicadores possuem finalidade operacional, permitindo acompanhar a realização da atividade. Não representam indicadores de desempenho vocacional.

### 5.3. Listagem de estudantes

Apresentar uma tabela com as seguintes informações:

| Campo | Descrição |
|---|---|
| Estudante | Nome e identificação visual do estudante. |
| Status | Não iniciado, Em andamento ou Concluído. |
| Código RIASEC | Três dimensões com maiores pontuações, quando houver resultado completo. |
| Principal área de interesse | Dimensão com maior pontuação no perfil RIASEC. |
| Última atualização | Data da última atualização ou conclusão do teste. |
| Ação | Botão para visualizar o relatório individual. |

O código RIASEC deverá ser exibido somente após a conclusão de todos os 30 itens obrigatórios do bloco de interesses.

### 5.4. Comportamentos

- Permitir buscar estudantes pelo nome.
- Permitir selecionar outra turma.
- Permitir ordenar a listagem por nome ou status.
- Permitir filtrar estudantes por status.
- Disponibilizar acesso ao relatório individual somente quando houver dados suficientes para apresentar o resultado.
- Estudantes com testes em andamento poderão ser identificados, mas não terão um relatório vocacional consolidado.

### 5.5. Status do teste

**Não iniciado:** estudante ainda não começou o questionário.

**Em andamento:** estudante iniciou o questionário, mas não respondeu a todos os itens obrigatórios.

**Concluído:** estudante respondeu a todos os itens obrigatórios e possui perfil RIASEC calculado.

---

## 6. Tela 2 — Relatório individual do estudante

### Objetivo

Apresentar de maneira organizada e visual os resultados do Teste Vocacional de um estudante, permitindo que o professor compreenda seu perfil sem precisar interpretar individualmente todas as respostas do questionário.

A tela deverá ser dividida em blocos independentes, com informações resumidas e detalhadas.

### 6.1. Identificação do estudante

Apresentar no cabeçalho:

- Nome do estudante.
- Turma.
- Ano escolar.
- Data de conclusão do teste.
- Status do relatório.
- Botão para retornar à listagem.

Título sugerido: **Perfil Vocacional de [Nome do estudante]**.

Descrição: Conheça os interesses, valores, preferências e habilidades percebidas pelo estudante.

### 6.2. Resumo do perfil vocacional

> **Objetivo:** permitir que o professor compreenda o resultado geral do estudante em poucos segundos.

Apresentar um card de destaque com:

- Código RIASEC do estudante.
- Três dimensões com maiores pontuações.
- Principal área de interesse.
- Descrição resumida do perfil.
- Gráfico radar com as seis dimensões.

As seis dimensões deverão ser apresentadas:

| Dimensão | Descrição |
|---|---|
| R — Realista | Interesse por atividades práticas, técnicas e concretas. |
| I — Investigativo | Interesse por pesquisa, análise e resolução de problemas. |
| A — Artístico | Interesse por criação, expressão e experimentação. |
| S — Social | Interesse por ensinar, orientar e colaborar com pessoas. |
| E — Empreendedor | Interesse por liderança, iniciativa, influência e negociação. |
| C — Convencional | Interesse por organização, planejamento, dados e processos. |

Cada dimensão deverá apresentar sua pontuação normalizada, de 0 a 100.

Importante: a pontuação representa a intensidade das respostas de interesse dentro do questionário. Não representa percentual de aptidão, inteligência ou capacidade profissional.

### 6.3. Áreas de interesse

Apresentar o detalhamento das seis dimensões RIASEC.

Para cada dimensão, exibir:

- Nome da dimensão.
- Pontuação.
- Descrição do interesse.
- Exemplos de atividades relacionadas.

Destacar visualmente as três dimensões com maiores pontuações, preservando a visualização das demais.

O professor deverá conseguir identificar rapidamente quais tipos de atividades despertam maior interesse no estudante.

### 6.4. Profissões recomendadas

Apresentar as profissões sugeridas pelo mecanismo de recomendação do Teste Vocacional.

Para cada profissão, exibir:

- Nome da profissão.
- Imagem ilustrativa.
- Descrição resumida.
- Dimensões RIASEC relacionadas.
- Justificativa da recomendação.

Organizar as profissões por categorias qualitativas de recomendação, quando essas categorias estiverem definidas e validadas.

Exemplo de apresentação:

- Vale a pena explorar.
- Outra possibilidade.
- Possibilidade complementar.

Não apresentar percentuais artificiais de compatibilidade ou afirmar que determinada profissão é a escolha ideal do estudante.

O professor poderá acessar os detalhes da profissão para conhecer melhor suas atividades e características.

### 6.5. Valores profissionais

Apresentar os valores que o estudante considera importantes em sua futura carreira.

Exibir os oito valores avaliados:

- Estabilidade e previsibilidade.
- Remuneração.
- Autonomia.
- Impacto social.
- Criatividade.
- Aprendizado contínuo.
- Reconhecimento.
- Flexibilidade.

Para cada valor, apresentar:

- Nome.
- Nota atribuída pelo estudante, de 1 a 5.
- Indicador visual de importância.

Destacar os valores que receberam as maiores pontuações.

O professor deverá conseguir identificar o que o estudante valoriza em um futuro ambiente profissional.

### 6.6. Preferências de trabalho

Apresentar as preferências declaradas pelo estudante sobre diferentes contextos e formas de trabalhar.

Considerar as seis perguntas do instrumento:

- Interação frequente com pessoas ou concentração individual.
- Rotinas e processos definidos ou atividades dinâmicas.
- Resultados práticos ou atividades conceituais e analíticas.
- Execução de objetivos definidos ou participação na construção de soluções.
- Aprofundamento em um tema ou alternância entre diferentes assuntos.
- Trabalho presencial ou em campo ou atuação predominantemente digital/remota.

Para cada preferência, apresentar a alternativa escolhida pelo estudante.

O objetivo é ajudar o professor a compreender quais ambientes e dinâmicas de trabalho podem despertar maior interesse.

Essas informações não devem ser utilizadas para eliminar ou restringir possibilidades profissionais.

### 6.7. Habilidades percebidas

Apresentar as oito habilidades avaliadas no questionário:

- Raciocínio analítico.
- Criatividade.
- Comunicação.
- Organização.
- Colaboração.
- Investigação e pesquisa.
- Iniciativa.
- Aprendizado por meio da prática.

Para cada habilidade, exibir a nota atribuída pelo estudante, de 1 a 5.

Destacar também a resposta complementar em que o estudante selecionou até três habilidades que deseja desenvolver.

Separar visualmente:

**Habilidades percebidas:** como o estudante avalia suas habilidades atualmente.

**Habilidades que deseja desenvolver:** competências que o próprio estudante demonstrou interesse em fortalecer.

Importante: essas respostas são autopercepções e não representam avaliações objetivas de competência.

### 6.8. Síntese do perfil

Apresentar um bloco final com uma síntese textual do perfil vocacional.

A síntese deverá combinar:

- Principais interesses RIASEC.
- Valores profissionais mais importantes.
- Preferências de trabalho.
- Habilidades percebidas e interesses de desenvolvimento.
- Possibilidades profissionais relacionadas.

Exemplo ilustrativo:

"Este estudante demonstra maior interesse por investigação, análise e criação de soluções. Valoriza o aprendizado contínuo, a autonomia e a possibilidade de gerar impacto por meio do seu trabalho. Suas respostas indicam interesse por atividades que envolvam resolução de problemas, tecnologia e experimentação. Entre as possibilidades profissionais para explorar estão carreiras relacionadas à análise de dados, desenvolvimento de software e pesquisa científica."

A síntese deverá ser gerada exclusivamente a partir dos dados registrados e das regras metodológicas do instrumento.

Não deverá atribuir características pessoais que não tenham sido avaliadas pelo questionário.

---

## 7. Regras de negócio

**RN01 — Disponibilidade do relatório**

O relatório individual completo estará disponível somente após o estudante responder a todos os 30 itens obrigatórios do bloco RIASEC.

**RN02 — Dados complementares**

Os blocos de valores, preferências e habilidades deverão ser apresentados conforme as respostas registradas. Caso algum bloco não tenha sido concluído, informar sua indisponibilidade sem inventar ou completar respostas.

**RN03 — Cálculo RIASEC**

Cada dimensão será calculada a partir de cinco questões, utilizando a metodologia definida para o Teste Vocacional.

A pontuação normalizada deverá seguir a fórmula:

`((Soma das respostas - 5) / 20) × 100`

**RN04 — Código RIASEC**

O código será composto pelas três dimensões com maiores pontuações. Empates deverão ser tratados conforme uma regra consistente, sem criar uma dimensão dominante artificialmente.

**RN05 — Recomendações profissionais**

As profissões apresentadas deverão respeitar o mecanismo de recomendação e o catálogo de ocupações definido para o produto.

**RN06 — Histórico**

O relatório deverá preservar a versão do questionário e das regras de cálculo utilizadas na geração do resultado.

**RN07 — Atualização**

Caso o estudante realize novamente o teste, o relatório deverá refletir a versão mais recente concluída, preservando o histórico conforme a política definida pelo produto.

**RN08 — Privacidade**

Os resultados deverão estar disponíveis somente para usuários autorizados, respeitando as regras de acesso e proteção dos dados dos estudantes.

**RN09 — Não classificação**

Não será permitido utilizar os resultados para gerar rankings, comparações ou classificações entre estudantes.

**RN10 — Interpretação**

Nenhuma informação poderá afirmar que o estudante possui aptidão comprovada, que deve seguir determinada profissão ou que não possui capacidade para uma área profissional.

---

## 8. Critérios de aceite

### Listagem

- [ ] O professor consegue selecionar uma turma.
- [ ] O sistema apresenta a quantidade de estudantes da turma.
- [ ] O sistema apresenta os quantitativos de testes não iniciados, em andamento e concluídos.
- [ ] A listagem apresenta nome e status de cada estudante.
- [ ] O código RIASEC é exibido para estudantes com resultado completo.
- [ ] O professor consegue buscar estudantes pelo nome.
- [ ] O professor consegue filtrar a listagem por status.
- [ ] O professor consegue acessar o relatório individual de um estudante com resultado disponível.

### Relatório individual

- [ ] O sistema apresenta a identificação do estudante e sua turma.
- [ ] O sistema apresenta o resumo do perfil vocacional.
- [ ] O gráfico radar apresenta corretamente as seis dimensões RIASEC.
- [ ] O sistema apresenta as pontuações e descrições de cada dimensão.
- [ ] O sistema apresenta as profissões recomendadas e suas justificativas.
- [ ] O sistema apresenta os valores profissionais e suas respectivas pontuações.
- [ ] O sistema apresenta as preferências de trabalho registradas.
- [ ] O sistema apresenta as habilidades percebidas pelo estudante.
- [ ] O sistema destaca as habilidades que o estudante deseja desenvolver.
- [ ] O sistema apresenta a síntese textual do perfil.
- [ ] O sistema não apresenta dados fictícios ou pontuações para respostas ausentes.
- [ ] O professor consegue retornar à listagem de estudantes.

---

## 9. Métricas de sucesso

Acompanhar a utilização e a efetividade da funcionalidade por meio de:

- **Taxa de acesso aos relatórios:** percentual de professores que acessaram pelo menos um relatório individual.
- **Relatórios visualizados:** quantidade de relatórios individuais consultados.
- **Estudantes com resultados consultados:** percentual de estudantes com relatório concluído que tiveram seus resultados visualizados por um professor.
- **Tempo médio de consulta:** tempo médio de permanência na tela do relatório individual.
- **Acessos por seção:** frequência de visualização dos blocos RIASEC, profissões, valores, preferências e habilidades.

Essas métricas deverão medir a utilização da funcionalidade, não o desempenho ou a qualidade do perfil vocacional do estudante.

---

## 10. Fora do escopo inicial

Para a primeira versão, não fazem parte desta iniciativa:

- Comparação de perfis vocacionais entre estudantes.
- Ranking de profissões ou estudantes dentro da turma.
- Avaliação objetiva de aptidões ou competências.
- Diagnósticos psicológicos ou comportamentais.
- Recomendações automáticas de carreira feitas pelo professor.
- Edição manual das pontuações pelo professor.
- Alteração das respostas do estudante dentro do relatório.
- Geração de planos de carreira pelo professor.
- Análise de desempenho acadêmico associada ao perfil vocacional.

## 11. Considerações finais

O relatório do Teste Vocacional deve funcionar como uma ferramenta de apoio à orientação profissional dentro do ambiente escolar.

A experiência precisa permitir que o professor compreenda rapidamente quem é o estudante em relação aos seus interesses profissionais, o que valoriza, como prefere trabalhar e quais possibilidades de carreira podem despertar sua curiosidade.

Mais do que apresentar números, o relatório deve transformar as respostas do questionário em informações úteis para apoiar o diálogo entre professor e estudante sobre seu futuro profissional.
