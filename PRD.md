# PRD · Relatórios unificados na plataforma Educadores

26/11/2026 · Fernando · Documento vivo: https://claude.ai/artifact/YK2QFjJVHLy9BaXHc3o7oE (esta cópia é a versão de 26/11/2026; o documento é a fonte)

## Resumo executivo

A Jovens Gênios vai trazer para dentro da plataforma Educadores tudo o que hoje vive nos BIs externos por cliente, com uma fonte única de dados, as mesmas regras de cálculo e o mesmo permissionamento para todos os clientes e perfis.

A experiência funciona como um lego: cada pessoa recebe **3 visões prontas** para o seu perfil e pode montar o **próprio painel**, escolhendo blocos de indicadores, do macro (rede) ao muito detalhado (estudante e questão).

Resultado esperado: nenhum cliente precisa sair da Educadores para ver dados, e o mesmo número é igual em qualquer tela, relatório, exportação ou perfil.

## Contexto e problema

Hoje a Jovens Gênios tem **duas fontes da verdade** para os mesmos dados: os relatórios dentro da plataforma Educadores e os BIs externos (bi.jovensgenios.com), criados sob medida para cada cliente.

| Problema | Como aparece hoje | Efeito |
| --- | --- | --- |
| Dados divergentes | Educadores e BI calculam o mesmo indicador com premissas diferentes (ex.: quem conta como ativo, o que é aprendizado adequado, faixas de proficiência) | O cliente vê dois números para a mesma pergunta e perde a confiança nos dois |
| Relatório fora da plataforma | Cada BI é um link externo por cliente, acessado por token | O usuário sai da Educadores para consultar dados; links são enviados à mão e ficam espalhados |
| Permissionamento desigual | Professores veem só os relatórios da Educadores; coordenadores e gestores veem os dois | O mesmo perfil tem acesso diferente conforme o cliente, e a regra de acesso do BI vive no token, não no cadastro |
| Personalização por cliente | Cada rede tem dores específicas e ganhou um BI próprio | Cada novo pedido vira um relatório novo, com custo de manutenção crescente |

O maior problema é o primeiro: enquanto houver duas regras para o mesmo indicador, qualquer melhoria visual mantém o conflito.

## Diagnóstico atual

Hoje existem 22 links de BI para 11 clientes, além dos relatórios da Educadores. Os dois lados calculam os mesmos indicadores com regras diferentes, e a própria Educadores usa mais de uma régua para a mesma coisa.

### Relatórios na Educadores

| Entidade | Relatório | Abas | Quem vê hoje |
| --- | --- | --- | --- |
| Institucionais | Rede | Visão Geral, Engajamento, Aprendizagem, Glossário | Gestor de rede |
| Institucionais | Escola e Professores | idem | Gestor de rede e gestor de escola |
| Institucionais | Turmas e Estudantes | idem; turma inclui histórico de atividades por mês | Gestores e professores (das próprias turmas) |
| Institucionais | Alfabetização | Visão Geral, Aprendizagem, Engajamento | Por flag; regra própria por perfil |
| Atividades | Tarefa, Campeonato, Desafio Adaptativo, Prova Genial, Raio-X, Projetos | Visão Geral, Engajamento, Aprendizagem, Glossário | Criador da atividade e gestores |
| Eventos | Liga das Estrelas, Olimpíadas | Visão Geral, Engajamento; Olimpíadas por Nações, Escolas, Turma e Ano | Gestores e professores |

### BIs externos por cliente

| Tipo de BI | Links | Clientes |
| --- | --- | --- |
| Avaliações | 6 | Arraial do Cabo, Escolas Criativas (Caruaru), Ipiranga do Piauí, Karteira, Motriz Alagoas, Simulados Edebê |
| Institucional | 6 | Edebê (geral e 2 inspetorias), Educaliza, São Paulo (geral e Matemática) |
| Unificado (Institucional + Tarefas + Avaliações) | 4 | Arraial do Cabo, São José dos Campos, São Paulo (Matemática e EJA) |
| Olimpíadas | 2 | Arlequim Osasco, São José dos Campos |
| Redações | 1 | Arraial do Cabo |
| Tarefas | 1 | São Paulo |
| Competições (Liga Genial Prepara SP 2026) | 1 | São Paulo |
| Produto GenieX | 1 | Uso interno da Jovens Gênios |

O BI já entrega o que a Educadores não tem:

- recorte por unidade regional (ex.: diretorias regionais da SEDUC-SP);
- escala de proficiência por TRI;
- índice socioeconômico próprio (NSE) com desempenho de referência;
- prioridades pedagógicas por habilidade e descritor;
- relatório de redações;
- comparativo por entidade e mapa ativação × desempenho;
- um assistente (GenieBot) que responde sobre o relatório aberto.

### Onde os números divergem

| Indicador | Educadores | BI | Evidência no monorepo |
| --- | --- | --- | --- |
| Estudante ativo | Mais de 1 interação no período, em tabela própria do app | Pelo menos 1 interação, nos modelos do dbt que unem GenieX e Estudantes | `class-metrics-repository.ts` (`> 1`) × `bi-reports` (`totalInteractions > 0`) |
| Faixas de proficiência | Três réguas: 30/60/85 (constantes), 50/70/90 (visão geral de rede, escola, turma, estudante e exportação) e 70 como corte de proficiente nos rankings; alfabetização usa 65/85 | Uma régua: Insuficiente < 30, Básico 30–60, Proficiente 60–85, Avançado ≥ 85 | `proficiency-calculator.ts`, `constants.ts`, `*-learning-ranking-paginated-repository.ts` × `institutional-report.md` |
| Aprendizado adequado | Proficiente + Avançado, logo herda a régua usada na tela (60 ou 70) | Desempenho consolidado do estudante ≥ 60%, ponderado pelo número de interações | idem |
| Tópico dominado e ponto de aprendizado | Glossário: aprendizado adequado no tópico vale 1 ponto | Pelo menos 10 interações no período e desempenho ≥ 60% | Glossário da Educadores × `institutional-report.md` |
| Metas | Fixas no código e diferentes por relatório: institucional 50% de ativos e 60% de adequado; Tarefa 65% de ativos e 65% de adequado; Projeto 90% de ativos | Sem regra de meta documentada | `INSTITUTIONAL_REPORT_TARGET`, `ACTIVITIES_REPORT_TARGET` |
| Fonte dos dados | Mistura tabelas do app no ClickHouse, Neon (Postgres) e dbt (só alfabetização) | Somente os modelos do dbt (`jg-dbt-data`) | `src/server/repositories/report` × `packages/bi-reports` |
| Acesso | Sessão da Educadores + perfil + feature flags | Token na URL que identifica um usuário-alvo; o escopo é dele, não de quem abre o link | `use-institutional.ts` × `access-token.md` |

A consequência prática: na mesma turma e no mesmo período, o percentual de ativos e o de aprendizado adequado podem sair diferentes na Educadores e no BI, e até entre duas telas da própria Educadores.

## Objetivos e métricas de sucesso

O sucesso é medido em três frentes: o mesmo número em todo lugar, nenhum BI fora da plataforma e cada perfil achando o que precisa sem ajuda.

| Objetivo | Métrica | Meta | Linha de base |
| --- | --- | --- | --- |
| Uma regra por indicador | Indicadores publicados com definição única no dicionário | 100% | A levantar (hoje há 3 réguas de proficiência só na Educadores) |
| Uma regra por indicador | Diferença entre o valor do bloco, a exportação e a API para o mesmo recorte | 0 (teste automático de paridade a cada publicação) | Inexistente |
| Fim dos BIs externos | Links de BI ativos para clientes | 0 ao fim da migração | 22 links, 11 clientes |
| Fim dos BIs externos | Clientes com todos os relatórios dentro da Educadores | 100% | 0% |
| Acesso justo | Perfis com regra de acesso definida só pelo cadastro (sem token) | 100% | 0% nos BIs |
| Uso | Gestores e coordenadores que abrem relatórios pelo menos 1 vez por semana | Hipótese: +30% sobre a linha de base | A levantar no analytics da Educadores |
| Uso | Gestores com pelo menos 1 painel personalizado salvo em 60 dias | Hipótese: 40% | Inexistente |
| Confiança | Chamados de suporte sobre divergência de dados | Hipótese: −80% em 6 meses | A levantar com o CS |

As metas marcadas como hipótese precisam de linha de base antes do lançamento (ver Perguntas em aberto).

## Públicos e perfis

Os perfis vêm dos papéis que já existem no cadastro. Muda a pergunta que cada um quer responder e o nível de detalhe que tolera, não a regra de cálculo.

| Perfil | Papel no sistema | Escopo de dados | Pergunta principal | Detalhe preferido |
| --- | --- | --- | --- | --- |
| Gestor de rede (secretaria, mantenedora) | INSTITUTION_MANAGER | Rede inteira, unidades regionais, escolas, turmas | A rede está usando e aprendendo? Onde intervir primeiro? | Macro, com comparativos entre unidades e escolas |
| Técnico de unidade regional (ex.: diretoria regional) | Sem papel próprio hoje | Escolas da sua unidade | Quais escolas da minha região estão abaixo? | Macro e comparativo |
| Gestor de escola (diretor) | MANAGER | Escolas em que tem vínculo | Quais turmas e professores precisam de apoio? | Intermediário |
| Coordenador pedagógico | MANAGER | Escolas em que tem vínculo | Quais habilidades e estudantes estão abaixo da meta? | Detalhado, até habilidade e questão |
| Professor | PROFESSOR | Suas turmas e as atividades que criou | Quem não fez, quem errou o quê, o que retomar? | Muito detalhado, por estudante e questão |
| Equipe Jovens Gênios (CS, implantação) | ADMIN | Todos os clientes | O cliente está saudável? O que mostrar na reunião? | Todos; monta painéis-modelo para clientes |

Hoje o professor não vê os BIs e coordenadores e gestores veem os dois lados. Com a unificação, todos usam o mesmo catálogo de blocos, limitado pelo escopo do seu perfil.

## Princípios e premissas

Todo número exibido nasce de uma única definição, calculada num único lugar e servida igual para qualquer tela, perfil, exportação ou assistente.

1. **Uma fonte:** os modelos analíticos do dbt (`jg-dbt-data`), lidos pelo pacote compartilhado `@jovens-genios/bi-reports`. A Educadores deixa de calcular indicadores nas tabelas próprias do app.
2. **Um dicionário:** cada indicador tem nome, definição, fórmula, unidade, granularidade, fonte e meta, versionados. Tela, glossário, tooltip e exportação leem o mesmo texto.
3. **Uma régua de proficiência:** Insuficiente < 30%, Básico 30–60%, Proficiente 60–85%, Avançado ≥ 85%, aplicada ao desempenho consolidado e ponderado pelo número de interações. É a régua que o BI já usa e que confirmamos nos Relatórios do Modo Lição.
4. **Um bloco, uma consulta:** um bloco mostra a mesma coisa em qualquer visão ou painel; só mudam o recorte (rede, escola, turma, estudante, atividade) e o período.
5. **Acesso pelo cadastro:** o que cada pessoa vê vem do seu perfil e dos seus vínculos na plataforma, nunca de um link ou token compartilhado.
6. **Metas explícitas:** toda meta tem dono e origem (padrão Jovens Gênios ou definida pela rede) e aparece junto do indicador.
7. **Sem número sem explicação:** todo indicador tem ⓘ com a definição do dicionário, a data da última atualização e o recorte aplicado.
8. **Personalização sem regra nova:** o cliente escolhe blocos, ordem, filtros e metas da rede; não cria fórmulas. Pedido de indicador novo entra no dicionário e vale para todos.

## Solução proposta

Relatórios viram composições de **blocos** de um catálogo único. A Jovens Gênios entrega 3 visões prontas; cada pessoa pode montar os próprios painéis com os mesmos blocos.

### As 3 visões prontas

As visões são as mesmas para todos os perfis. O que muda é o recorte (rede, unidade regional, escola, turma, estudante ou atividade), que define quais dados entram em cada bloco.

| Visão | Para quê | Blocos típicos | Tempo de leitura |
| --- | --- | --- | --- |
| Resumo | Saber em 1 minuto se está tudo bem | Indicadores-chave com meta e variação, comparativo das entidades logo abaixo (ex.: escolas da rede), alertas | 1 minuto |
| Acompanhamento | Entender a evolução e onde agir | Séries de engajamento e aprendizagem, rúbricas de proficiência, quadrante desempenho × engajamento, rankings, prioridades pedagógicas | 5 a 10 minutos |
| Detalhada | Investigar e exportar | Tabelas nominais, habilidades e descritores, questões, atividades por mês, exportação completa | Sob demanda |

O glossário deixa de ser uma aba por relatório e vira um painel lateral único, aberto pelo ⓘ de qualquer bloco.

### Painéis personalizados ("Meus painéis")

- **Criar:** do zero ou duplicando uma das 3 visões.
- **Montar:** adicionar blocos pelo catálogo (busca e categorias), arrastar e redimensionar numa grade.
- **Filtrar:** filtros globais do painel (recorte, período, ano escolar, componente curricular) e, quando fizer sentido, filtro próprio do bloco.
- **Organizar:** renomear, duplicar, excluir e definir um painel como página inicial de relatórios.
- **Compartilhar:** com pessoas da mesma rede. Cada uma vê o painel com os dados do próprio escopo, nunca com o escopo de quem compartilhou.
- **Painéis-modelo:** a Jovens Gênios (e, depois, a rede) publica modelos prontos, ex.: "Diretoria regional", "Reunião de coordenação", "Avaliações externas". É assim que os BIs sob medida de hoje viram configuração, não código.
- **Exportar:** PDF do painel e CSV de cada bloco.

### Atividades e eventos

Tarefa, Prova Genial, Desafio Adaptativo, Aula Invertida, Projetos, Campeonato, Raio-X, Olimpíadas e Liga das Estrelas passam a ser **recortes** dentro do mesmo modelo: abrir uma atividade mostra as 3 visões com os blocos comuns e os blocos próprios do tipo (ex.: histograma de notas na Prova Genial, batalhas no Campeonato, pódio de nações nas Olimpíadas).

## Arquitetura da informação

A divisão Institucionais × Atividades continua, mas deixa de ser um menu de relatórios diferentes e vira o **recorte** que a pessoa escolhe no topo da página. As 3 visões e os painéis funcionam igual em qualquer recorte.

Diagrama (no documento): 1 · O que a pessoa abre (Resumo, Acompanhamento, Detalhada, Meus painéis) → 2 · Recorte escolhido no topo da página (Institucional: Rede → Unidade regional → Escola → Turma → Estudante; Atividades: Tarefa, Prova Genial, Desafio Adaptativo, Aula Invertida, Projetos, Raio-X, Campeonato; Eventos: Olimpíadas, Liga das Estrelas) → 3 · Mesma regra para tudo (Catálogo de blocos, Dicionário de indicadores, Acesso pelo cadastro) → Fonte única: modelos do dbt lidos pelo pacote @jovens-genios/bi-reports.

O menu Relatórios passa a ter só duas entradas, Visões e Meus painéis; o recorte é navegado pelo seletor e pelo clique nas linhas (ex.: escola → turma → estudante).

**Filtros globais**, sempre no mesmo lugar e com as mesmas opções: recorte, período (7, 30, 60, 90 dias ou datas), ano escolar, componente curricular, tipo de atividade e "somente criadas por mim". O filtro escolhido acompanha a pessoa ao trocar de visão, de painel ou de recorte.

**Professores** são um recorte de pessoas dentro da escola (engajamento e atividades criadas), como já é na aba Pessoas do BI.

## Dicionário de indicadores

A proposta adota as regras do BI como canônicas, porque já estão documentadas, testadas e unem GenieX e Estudantes. Cada linha abaixo vira uma entrada versionada do dicionário; as marcadas com "Sim" mudam o número que a Educadores mostra hoje.

### Engajamento

| Indicador | Definição única proposta | Unidade | Meta padrão | Muda hoje? |
| --- | --- | --- | --- | --- |
| Estudantes ativos | Estudantes com pelo menos 1 interação no período ÷ estudantes vinculados ao recorte | % | 50% | Sim: Educadores usa "mais de 1" |
| Interações por estudante | Interações de engajamento no período ÷ estudantes ativos | número | 40 | A confirmar o denominador usado hoje |
| Tempo de estudo | Tempo em conteúdo no período, por estudante | horas e minutos | 1 h | — |
| Professores ativos | Professores com pelo menos 1 dia de atividade na Educadores ÷ professores vinculados | % | 50% | — |
| Atividades criadas por professor | Atividades criadas no período ÷ professores vinculados | número | 1 | — |
| Interações por área de conhecimento | Interações de aprendizagem agrupadas pela área do tópico, só tópicos do catálogo da escola | número | — | — |

### Aprendizagem

| Indicador | Definição única proposta | Unidade | Meta padrão | Muda hoje? |
| --- | --- | --- | --- | --- |
| Desempenho | Acertos ÷ respostas, com média ponderada pelo número de interações em qualquer agregação | % | — | A conferir nas telas da Educadores |
| Proficiência | Régua única sobre o desempenho consolidado: Insuficiente < 30, Básico 30–60, Proficiente 60–85, Avançado ≥ 85; sem interação = Não avaliado | rúbrica | — | Sim: Educadores usa também 50/70/90 e 70 |
| Aprendizado adequado | Estudantes com desempenho consolidado ≥ 60% ÷ estudantes com pelo menos 1 interação de aprendizagem | % | 60% | Sim: depende da régua usada na tela |
| Tópico dominado | Tópico com pelo menos 10 interações no período e desempenho ≥ 60% | sim ou não | — | Sim: glossário atual não exige mínimo de interações |
| Ponto de aprendizado | 1 ponto por tópico dominado | número | 1 por mês por estudante (acumulado no ano) | Segue o tópico dominado |
| Progresso nos tópicos | Tópicos concluídos ÷ tópicos disponíveis no currículo do estudante | % | — | Novo na Educadores |

### Atividades, avaliações e eventos

| Indicador | Definição única proposta | Unidade | Meta padrão | Muda hoje? |
| --- | --- | --- | --- | --- |
| Finalização | Estudantes que finalizaram ÷ estudantes que receberam a atividade | % | Por tipo de atividade | Metas hoje variam de 60% a 100% conforme o tipo |
| Situação do estudante na atividade | Finalizado, Em progresso, Não iniciado (e, em provas, Tempo expirado e Bloqueado por cola) | estado | — | Unificar nomes entre os tipos |
| Participação em avaliações | Previsto (tem avaliação), iniciou (respondeu 1 questão), concluiu (respondeu todas), contando cada pessoa uma vez | estudantes | — | Novo na Educadores |
| Nota | Pontos obtidos na avaliação; média simples entre estudantes que finalizaram | pontos | — | — |
| Taxa de acerto da questão | Respostas corretas ÷ respostas à questão | % | — | — |
| Tempo médio de resolução | Média do tempo entre início e envio, só de quem finalizou | min e s | — | — |
| Proficiência TRI e nível socioeconômico (NSE) | Como no BI de Avaliações, só quando a rede tiver TRI e questionário ativados | escala e nível | — | Novo na Educadores |
| Pontos, estrelas e missões de eventos | Lidos só pelo pacote de ranking, que é a pontuação oficial | número | — | — |

Desempenho consolidado do estudante, usado na proficiência e no aprendizado adequado:

```latex
\text{desempenho} = \frac{\sum_{t} \text{desempenho}_t \times \text{interações}_t}{\sum_{t} \text{interações}_t}
```

onde t percorre os tópicos com interação no período.

## Catálogo de blocos

O catálogo inicial tem 23 blocos: 17 já existem como seções dos relatórios da Educadores e 6 vêm do BI. Cada bloco declara os recortes em que funciona; fora deles, não aparece no catálogo.

| Bloco | Visual | Recortes | Hoje está em |
| --- | --- | --- | --- |
| Indicador com meta | Cartão com valor, meta e % da meta | Todos | Educadores |
| Distribuição de proficiência | Barra empilhada + tabela por rúbrica | Rede a turma, atividade | Educadores |
| Evolução de aprendizagem | Pontos mensais e acumulados × meta | Rede a estudante | Educadores |
| Ranking de aprendizagem | Barra por estudante com linha de meta | Turma, atividade | Educadores |
| Ranking de engajamento | Tabela com posição, interações, meta e % da meta | Rede a turma | Educadores |
| Desempenho × engajamento | Dispersão em 4 quadrantes + tabela | Turma, atividade | Educadores |
| Atividades criadas por tipo | Barras | Rede a turma, professor | Educadores |
| Interações por área de conhecimento | Barras | Rede a estudante | Educadores |
| Proficiência por disciplina | Barras coloridas por rúbrica × meta | Estudante, turma | Educadores |
| Tabela de informações gerais | Tabela com colunas escolhíveis, busca e exportação | Todos | Educadores |
| Histórico de atividades por mês | Lista por mês com tipo, datas e situação | Turma, professor | Educadores |
| Progresso na atividade | Barras por situação do estudante | Atividade | Educadores |
| Histograma de notas | Barras por faixa de pontos | Avaliação (Prova Genial) | Educadores |
| Questões da atividade | Lista com taxa de acerto, enunciado e análise | Atividade | Educadores |
| Ranking de tópicos | Barras por tópico com meta | Atividade | Educadores |
| Engajamento ao longo do tempo | Linha semanal × meta | Todos, eventos | Educadores |
| Pódio e ranking do evento | Pódio de 3 + tabela | Eventos | Educadores |
| Comparativo por entidade | Tabela das entidades logo abaixo do recorte, com indicadores lado a lado | Rede, unidade regional, escola | BI |
| Mapa ativação × desempenho | Dispersão de escolas ou turmas | Rede, unidade regional, escola | BI |
| Prioridades pedagógicas | Até 5 habilidades e 5 descritores com estudantes abaixo de 50% | Rede a turma, avaliação | BI |
| Escala de proficiência (TRI) | Níveis com descritores e estudantes por nível | Avaliação | BI |
| Desempenho por nível socioeconômico | Desempenho observado × referência do mesmo NSE | Rede a escola, avaliação | BI |
| Redações | Volume, correção, notas por competência e temas | Rede a estudante | BI |

Regras de todo bloco: usa só indicadores do dicionário, mostra ⓘ com a definição e a data de atualização, tem estado de carregando, vazio e erro, e exporta CSV com os mesmos números da tela.

## Permissionamento

O acesso passa a ter uma única regra, a mesma em telas, painéis, exportações e assistente: o escopo vem do perfil e dos vínculos da pessoa no cadastro. O resolvedor de escopo que o BI já usa (`access.resolveByUserId` do `bi-reports`) passa a ser o único, e os links com token deixam de existir para clientes.

| Perfil | Recortes que vê | Dados nominais | Painéis | Exportação |
| --- | --- | --- | --- | --- |
| Gestor de rede | Rede, unidades regionais, escolas, turmas, professores e estudantes da rede | Sim | Cria, compartilha e publica modelos para a rede | Completa |
| Técnico de unidade regional | Unidade regional e o que está abaixo dela | Sim | Cria e compartilha | Completa |
| Gestor de escola e coordenador | Escolas em que tem vínculo, suas turmas, professores e estudantes | Sim | Cria e compartilha | Completa |
| Professor | Suas turmas e estudantes; atividades das suas turmas, com o filtro "somente criadas por mim" | Sim, só das suas turmas | Cria e compartilha | Das suas turmas |
| Equipe Jovens Gênios | Todos os clientes | Sim | Publica painéis-modelo para qualquer rede | Completa |

Regras:

1. **Interseção sempre:** o que a pessoa filtra é cruzado com o escopo dela. Se nada do que pediu está no escopo, o resultado é vazio, nunca mais amplo (regra que o BI já aplica).
2. **Painel compartilhado não empresta escopo:** quem abre vê os blocos com os próprios dados; um bloco fora do escopo dessa pessoa aparece com o aviso "Sem acesso a este recorte".
3. **Totais sem dupla contagem:** uma pessoa em mais de uma escola ou unidade entra em cada uma, mas uma vez só no total da rede.
4. **Dados sensíveis:** o NSE aparece só agregado; nunca por estudante.
5. **Blocos contratados:** TRI, NSE e Redações aparecem só para redes que têm o recurso ativo.
6. **Mudança de vínculo vale na hora:** se a pessoa perde o vínculo com uma escola, os painéis dela deixam de mostrar a escola no próximo acesso.

## Requisitos funcionais

| ID | Requisito | Critério de aceite |
| --- | --- | --- |
| RF01 | Exibir as 3 visões prontas (Resumo, Acompanhamento, Detalhada) para qualquer recorte | Trocar de visão mantém recorte e filtros |
| RF02 | Seletor de recorte no topo, com navegação rede → unidade regional → escola → turma → estudante e por atividade ou evento | Clicar numa linha de tabela ou ponto de gráfico abre o recorte da entidade |
| RF03 | Filtros globais: período (7, 30, 60, 90 dias ou datas), ano escolar, componente curricular, tipo de atividade, "somente criadas por mim" | Os mesmos filtros e opções em todas as visões e painéis |
| RF04 | Criar painel do zero ou duplicando uma visão | Painel salvo aparece em Meus painéis |
| RF05 | Adicionar blocos pelo catálogo, com busca, categorias e prévia | Só aparecem blocos válidos para o recorte e o perfil |
| RF06 | Arrastar, redimensionar e remover blocos numa grade | A disposição fica salva por painel |
| RF07 | Renomear, duplicar, excluir e definir painel inicial | Excluir pede confirmação |
| RF08 | Compartilhar painel com pessoas da mesma rede | Quem recebe vê com o próprio escopo (Permissionamento, regra 2) |
| RF09 | Publicar painéis-modelo (Jovens Gênios para qualquer rede; gestor de rede para a sua rede) | Modelos aparecem ao criar painel, com nome e descrição |
| RF10 | ⓘ em todo bloco com definição, fórmula resumida, meta e data da última atualização | O texto vem do dicionário, igual em todas as telas |
| RF11 | Glossário único em painel lateral, com busca | Substitui as abas Glossário de cada relatório |
| RF12 | Metas exibidas junto do indicador, com origem (padrão Jovens Gênios ou da rede) | Gestor de rede pode ajustar a meta da rede; a mudança fica registrada |
| RF13 | Exportar PDF do painel e CSV de cada bloco | Valores do CSV iguais aos da tela no mesmo recorte |
| RF14 | Compartilhar link interno de uma visão ou painel com recorte e filtros | O link exige login e aplica o escopo de quem abre |
| RF15 | Assistente (GenieBot) responde sobre o que está na tela, citando indicador, recorte e período | Nunca responde fora do escopo da pessoa |
| RF16 | Blocos próprios de atividades e eventos (histograma de notas, batalhas, pódio) dentro do mesmo modelo | Abrir uma atividade mostra as 3 visões com esses blocos |
| RF17 | Aviso de atualização dos dados ("atualizado há X min") em todas as visões | Mesma informação em todos os blocos da página |
| RF18 | Painel interno para a equipe Jovens Gênios acompanhar a migração de cada cliente (BIs desligados, painéis-modelo publicados) | Lista os 22 links atuais e a situação de cada um |

## Requisitos não funcionais

| ID | Tema | Requisito |
| --- | --- | --- |
| RNF01 | Paridade | Teste automático compara, para recortes de referência, o valor de cada bloco com a exportação e com a consulta do dicionário; publicação com diferença é bloqueada |
| RNF02 | Atualização | Uma janela única de atualização para todos os blocos, informada na tela (hoje a Educadores avisa "até 2 horas" e as Olimpíadas, 30 minutos) |
| RNF03 | Desempenho | Visão Resumo carrega em até 3 s no percentil 95 para uma rede do tamanho da SEDUC-SP; cada bloco carrega de forma independente |
| RNF04 | Escala | Painéis com até 20 blocos sem degradar o tempo de carga da página |
| RNF05 | Segurança | Escopo aplicado no servidor, antes da consulta; a interface nunca recebe dados fora do escopo |
| RNF06 | Auditoria | Registro de quem abriu, exportou, compartilhou ou alterou metas e painéis-modelo |
| RNF07 | Versionamento | Toda mudança no dicionário gera nova versão, com data e motivo, visível no glossário |
| RNF08 | Acessibilidade | WCAG 2.1 AA: navegação por teclado no catálogo e na grade, alternativa textual para gráficos, cor nunca como única informação nas rúbricas |
| RNF09 | Responsivo | Visões legíveis em 1440, 1024 e 390 px; montagem de painel só a partir de 1024 px |
| RNF10 | LGPD | Dados nominais só dentro do escopo; NSE apenas agregado; exportações registradas |
| RNF11 | Histórico | Indicadores históricos usam o vínculo vigente na data do fato (regra do BI para unidades regionais), sem reclassificar o passado |

## Fluxos principais

**1. Gestor de rede encontra onde agir**

1. Abre Relatórios e cai no Resumo da rede (ou no painel que definiu como inicial).
2. Vê o indicador abaixo da meta (ex.: aprendizado adequado) e o comparativo por unidade regional.
3. Clica na unidade com pior resultado; o recorte muda e as mesmas visões mostram as escolas dela.
4. Abre a escola, passa para Acompanhamento e encontra as turmas no quadrante baixo desempenho × baixo engajamento.
5. Exporta o comparativo em CSV para a reunião com os diretores.

**2. Coordenador monta o painel da reunião de coordenação**

1. Em Meus painéis, cria um painel a partir do modelo "Reunião de coordenação".
2. Remove o bloco de redações, adiciona Prioridades pedagógicas e Ranking de aprendizagem.
3. Fixa o filtro do 5º ano e de Matemática e salva.
4. Compartilha com a diretora, que vê o mesmo painel com o escopo dela.

**3. Professor acompanha uma atividade**

1. Abre a Tarefa pelo histórico de atividades da turma.
2. No Resumo, vê a finalização e o aprendizado adequado com a meta.
3. Em Detalhada, abre as questões com menor taxa de acerto e a lista de quem não iniciou.
4. Pergunta ao assistente quais estudantes retomar; a resposta cita o recorte e o período.

**4. Equipe Jovens Gênios migra um cliente do BI**

1. Confere no painel de migração quais BIs o cliente usa (ex.: Arraial do Cabo: Avaliações, Redações e Unificado).
2. Publica para a rede os painéis-modelo equivalentes e valida os números com o cliente (ver Migração).
3. Avisa a rede, mantém o BI em paralelo pelo período combinado e depois desliga o link.

## Migração e plano de rollout

A entrega começa pela paridade dos números, sem tela nova: enquanto a Educadores e o BI calcularem diferente, nenhuma visão nova resolve o problema principal. Cada fase só começa quando o portão da anterior é atingido.

| Fase | O que entra | Portão para a próxima |
| --- | --- | --- |
| 0 · Fundação | Dicionário v1 com as decisões das réguas; a Educadores passa a ler o bi-reports sem mudar a tela; teste automático de paridade entre tela, exportação e dicionário | Paridade de 100% nos recortes de referência |
| 1 · Visões prontas | Resumo, Acompanhamento e Detalhada para rede, unidade regional, escola, turma e estudante; glossário único e acesso pelo cadastro | Piloto com 2 redes valida os números |
| 2 · Atividades, eventos e blocos do BI | Atividades e eventos como recortes; comparativo, mapa, prioridades, TRI, NSE e redações | Todo tipo de BI tem equivalente aprovado |
| 3 · Meus painéis e migração | Painéis personalizados e painéis-modelo; migração cliente a cliente com o BI em paralelo; desligamento dos links depois do aceite de cada rede | Nenhum link de BI ativo para clientes |
| 4 · Evolução | Metas definidas pela rede, envio agendado de painéis por e-mail e novos blocos a pedido, sempre entrando pelo dicionário | — |

Como cada BI de hoje vira configuração dentro da Educadores:

| BI atual | Equivalente na Educadores | Fase |
| --- | --- | --- |
| Institucional | Visões prontas no recorte da rede ou da unidade regional | 1 |
| Tarefas | Recorte de atividade do tipo Tarefa + painel-modelo "Tarefas da rede" | 2 |
| Avaliações | Recorte de avaliação com TRI, NSE e prioridades + painel-modelo "Avaliações externas" | 2 |
| Redações | Bloco Redações + painel-modelo "Redações" | 2 |
| Olimpíadas e Competições | Recorte de evento com pódio e rankings | 2 |
| Unificado | Painel-modelo que junta Institucional, Tarefas e Avaliações | 3 |
| Produto GenieX (interno) | Fica fora: é análise de produto da Jovens Gênios, não relatório de cliente | — |

Comunicação com cada rede: aviso antes da mudança de régua (os números de ativos e de proficiência vão mudar), sessão de apresentação com o CS, período de BI em paralelo e data de desligamento combinada.

## Instrumentação e eventos

Todo evento leva perfil, rede, recorte (tipo e id), período e origem (visão ou painel), para medir as metas de uso e a adoção por perfil.

| Evento | Quando | Propriedades extras |
| --- | --- | --- |
| `relatorio_visao_aberta` | Abrir Resumo, Acompanhamento ou Detalhada | visão |
| `relatorio_recorte_alterado` | Trocar o recorte pelo seletor ou por clique | recorte anterior, origem do clique |
| `relatorio_filtro_aplicado` | Mudar um filtro global | filtro, valor |
| `painel_criado` | Salvar um painel novo | do zero, de visão ou de modelo |
| `painel_bloco_adicionado` / `painel_bloco_removido` | Montar o painel | bloco |
| `painel_compartilhado` | Compartilhar um painel | quantidade de pessoas |
| `painel_modelo_publicado` | Publicar um modelo | quem publicou (Jovens Gênios ou rede) |
| `relatorio_exportado` | Exportar PDF ou CSV | formato, bloco |
| `glossario_aberto` | Abrir o ⓘ ou o glossário | indicador |
| `meta_rede_alterada` | Gestor de rede muda uma meta | indicador, valor anterior e novo |
| `assistente_pergunta_relatorio` | Pergunta ao assistente na tela de relatório | visão ou painel |

## Riscos e mitigação

| Risco | Efeito | Mitigação |
| --- | --- | --- |
| Os números mudam ao adotar a régua única | Redes estranham queda ou alta de ativos e de proficiência | Comunicar antes, mostrar "antes × depois" no piloto e registrar a versão do dicionário |
| Clientes acostumados ao BI sob medida | Rejeição da migração | Painéis-modelo que reproduzem cada BI, BI em paralelo até o aceite |
| Liberdade demais no painel | Painéis confusos e pedidos de fórmulas próprias | Blocos fechados, sem fórmula do usuário; 3 visões como ponto de partida |
| Desempenho com redes grandes | Painéis lentos na SEDUC-SP | Carga por bloco, cache por recorte e período, limite de 20 blocos |
| Unidade regional sem papel de acesso | Técnicos de diretoria continuam fora ou com acesso amplo demais | Definir o papel antes da Fase 1 (Perguntas em aberto) |
| Duas bases de consulta durante a transição | Volta a divergência | Fase 0 troca a fonte da Educadores antes de qualquer tela nova; teste de paridade bloqueia publicação |
| Dados sensíveis em painéis compartilhados | Exposição indevida | Escopo de quem abre, NSE só agregado, auditoria de compartilhamento |

## Fora do escopo

- Fórmulas e indicadores criados pelo usuário; indicador novo entra pelo dicionário e vale para todos.
- Relatório de produto GenieX, que é análise interna da Jovens Gênios.
- Relatórios para estudantes e famílias.
- Mudanças nos modelos do dbt além do necessário para os indicadores do dicionário.
- Envio agendado por e-mail e metas por rede além do ajuste simples (ficam para a Fase 4).
- Acesso de pessoas externas sem login na Educadores.

## Perguntas em aberto e decisões pendentes

- [ ] **Estudante ativo:** adotar "pelo menos 1 interação" (BI) ou "mais de 1" (Educadores)?
- [ ] **Régua de proficiência:** confirmar 30/60/85 para todos os relatórios, inclusive Alfabetização (hoje 65/85) e as visões gerais que usam 50/70/90.
- [ ] **Interações por estudante:** o denominador é estudante ativo ou estudante vinculado?
- [ ] **Metas:** uma meta padrão por indicador ou metas diferentes por tipo de atividade, como hoje (60% a 100%)? A rede pode alterar?
- [ ] **Unidade regional:** criar um papel de acesso para técnicos de diretoria regional ou usar vínculo com a unidade?
- [ ] **Professor:** pode ver o Resumo da própria escola, sem dados nominais de outras turmas?
- [ ] **Coordenador:** é sempre o papel MANAGER ou precisa de papel próprio?
- [ ] **Janela de atualização:** qual a frequência real de atualização dos modelos do dbt?
- [ ] **Linhas de base:** levantar acessos semanais aos relatórios por perfil e chamados de divergência de dados com o CS.
- [ ] **Piloto:** quais 2 redes validam a Fase 1?
- [ ] **BI em paralelo:** por quanto tempo cada cliente mantém o link antigo depois da migração?

Decidido em 26/11/2026: as 3 visões são níveis de detalhe iguais para todos os perfis (Resumo, Acompanhamento, Detalhada).

## Fontes

- Planilha de BIs por cliente (22 links, 11 clientes), lida em 26/11/2026; os links com token não foram copiados para este documento.
- Prints dos relatórios da Educadores enviados por Fernando (Turmas, Estudantes, Tarefa, Prova Genial, Liga das Estrelas, Olimpíadas).
- Monorepo da Jovens Gênios (commit 7d333aff, 27/10/2026): `apps/bi-nextjs/docs`, `packages/bi-reports`, `apps/educadores-nextjs/src/lib/constants.ts`, `src/server/utils/proficiency-calculator.ts` e `src/server/repositories/report`.
