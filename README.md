# Jornada: Novos Relatórios (Educadores)

Protótipo da **Plataforma Educadores** que junta os relatórios da Educadores e os BIs externos por cliente numa experiência só. Faz parte do Roadmap 2027 da Jovens Gênios. Esta branch trata só desta jornada; a visão geral da plataforma e das demais jornadas está no README da branch `main`.

> **Em construção.** Etapa atual: todas as telas em Desktop e o protótipo navegável no Figma, para validação. Tablet e Celular vêm depois do OK.

- **Na plataforma:** https://jornadas-roadmap-jg-27.vercel.app/#/jornada/novos-relatorios
- **Figma:** https://www.figma.com/design/A5hHDrpWbICZ1JfKpUiS2k/Novos-Relat%C3%B3rios
- **PRD:** [PRD.md](PRD.md) (cópia de 26/11/2026) · documento vivo em https://claude.ai/artifact/YK2QFjJVHLy9BaXHc3o7oE
- **Código (quando houver navegável):** `src/prototypes/novos-relatorios/`

## A ideia em uma frase

Uma fonte única de dados, as mesmas regras de cálculo e o mesmo acesso para todos. O menu Relatórios tem **Institucionais**, **Atividades** e **Meus painéis**. Todo relatório tem 3 abas (**Resumo**, **Acompanhamento** e **Detalhada**), e cada pessoa monta **os próprios painéis** com blocos de um catálogo único, como um lego.

## Decisões (26/11/2026)

- **Escopo:** o PRD inteiro no protótipo.
- **Pessoas fictícias:**
  - Mariana Lopes, gestora de rede;
  - Carla Nogueira, coordenadora pedagógica da EM Jardim das Flores;
  - Rafael Souza, professor de Matemática das turmas 701, 702 e 801.
  - A troca de perfil fica no menu do usuário (rodapé da sidebar).
- **Menu Relatórios:** Institucionais, Atividades e Meus painéis. Substitui a ideia inicial de "Visões" com Institucional × Atividades como recorte.
- **Institucionais** (rede, unidade regional, escola, turma, professores, estudante):
  - **Gestora:** vê todos os relatórios.
  - **Coordenadora:** vê tudo da escola dela, com nomes, menos o relatório de rede.
  - **Professor:** vê só as turmas em que leciona e os estudantes delas.
  - Coordenadora e professor não veem dados nem médias da rede ou de outras escolas. As comparações deles são internas: meta, mês anterior, turmas entre si e prova anterior.
- **Atividades** (Tarefa, Prova Genial, Desafio Adaptativo, Aula Invertida, Projetos, Raio-X, Redação, Campeonato, Olimpíadas, Liga das Estrelas):
  - as mesmas telas para os 3 perfis;
  - o seletor "Onde" segue o acesso: rede inteira, a escola ou as turmas do professor;
  - no topo vem primeiro o seletor da atividade (tipo e, quando houver, a atividade específica) e depois o "Onde".
- **3 abas = níveis de detalhe:**
  - **Resumo:** indicadores e destaques;
  - **Acompanhamento:** evolução mês a mês e mapas de calor semanais;
  - **Detalhada:** "Ver por" mais uma tabela completa, com busca, filtro, colunas e exportar.
- **Régua única de proficiência:**
  - Insuficiente: abaixo de 30%;
  - Básico: de 30 a 59%;
  - Proficiente: de 60 a 84%;
  - Avançado: a partir de 85%.
- **Estudante ativo:** pelo menos 1 interação no período. É proposta do PRD e ainda está em validação.
- **Professor:** não reabre prova para quem não fez.
- **Identidade visual:**
  - tokens e componentes da biblioteca **Relatórios de Trilhas de Aprendizagem**: coleções Educadores — Cor, Espaço e Raio, e estilos de texto;
  - Sidebar - Educadores oficial;
  - tabela, gráficos e alerta de delay no padrão de produção.

## Figma

| Página | O que tem |
| --- | --- |
| 00 · Cover | Capa da jornada. Para virar miniatura do arquivo: botão direito no frame → "Set as thumbnail" |
| 02 · Assets | Referências da biblioteca e o componente local "Ícone · busca" |
| 04 · Compostos | Shell · Sidebar Novos Relatórios: 9 variantes (Institucionais, Atividades ou Meus painéis × Gestora, Coordenadora ou Professor) |
| 05 · Desktop | 61 telas em 20 seções e 13 sobrepostos, com o protótipo ligado |

### Seções do Desktop

| Seção | Telas |
| --- | --- |
| 0 · Estrutura e permissões | Matriz de quem vê o quê |
| 1 · Institucionais · Rede (gestora) | Resumo, Acompanhamento, Detalhada |
| 2 · Institucionais · Unidade regional (gestora) | Unidade Sul · 3 abas |
| 3 · Institucionais · Escola (coordenadora) | EM Jardim das Flores · 3 abas |
| 4 · Institucionais · Turmas (professor) | Minhas turmas · 3 abas; Turma 701 · 3 abas |
| 5 · Institucionais · Professores (coordenadora) | 3 abas |
| 6 · Institucionais · Estudante (professor) | Alice Moreira · 3 abas (a Detalhada é a linha do tempo) |
| 7 · Atividades · Início | Uma versão por perfil |
| 8 a 17 · Atividades | Tarefa, Prova Genial (turma 701), Desafio Adaptativo, Aula Invertida, Projetos, Raio-X (com TRI, NSE e prioridades), Redação, Campeonato, Olimpíada e Liga das Estrelas · 3 abas cada |
| 18 · Meus painéis | Lista, painel em uso, painel em edição, painel novo vazio e painel compartilhado visto pelo professor (blocos sem acesso bloqueados) |
| 19 · Equipe Jovens Gênios | Migração dos BIs (painel interno; clientes fictícios) |
| 20 · Sobrepostos | O1 a O13: Onde, Atividade, Período, Glossário, Filtros, Compartilhar, Exportar, Salvar como painel, Menu do bloco, Excluir painel, Trocar perfil, aviso e tooltip |

### Protótipo (Desktop)

Ponto de partida por perfil: **1 · Gestora** (1.1), **2 · Coordenadora** (3.1), **3 · Professor** (4.1) e **4 · Meus painéis** (18.1).

O protótipo liga:
- **Sidebar:** os itens do menu de cada perfil.
- **Abas:** as 3 abas de cada relatório.
- **Cabeçalho:** os seletores, o período, o Glossário, os Filtros, Compartilhar, Salvar como painel, Exportar e o menu ⋯ dos blocos, que abrem sobrepostos.
- **Caminhos:**
  - Rede → Unidade Sul;
  - Escola → Professores;
  - Minhas turmas → Turma 701 → Alice Moreira → Prova Genial;
  - Atividades · Início → os relatórios de atividade de cada perfil;
  - painéis: lista → em uso → edição → salvar.
- **Troca de perfil:** pelo rodapé da sidebar.

### Kit no arquivo

Fica em `sharedPluginData('nrel', …)`:
- **Kit:** `kit` (tokens da biblioteca), `carregar`, `organizar` e `tokens`.
- **Mapas:** `sidebar` e `icLocal`.
- **Dados e módulos:**
  - `dados`, `visoes`, `paineis`, `atividades`, `perfis` e `abas`;
  - `gen`: modelos genéricos de Resumo, Acompanhamento e Detalhada montados a partir de dados;
  - `inst`, `inst2`, `ativ2`, `ativ3`, `entrada`, `paineis2` e `sob`.

## Mapeamento inicial (da página 00, removida após o piloto)

- **Produto:** Plataforma Educadores, fonte Geist, larguras Desktop 1440, Tablet 768 e Celular 390.
- **Bibliotecas:**
  - Relatórios de Trilhas de Aprendizagem: tokens e componentes de referência;
  - Redação - Educadores;
  - Global Design System: Header, Infos e Handoff box no handoff;
  - Lucide Icons.
- **Perguntas em aberto (vão para o handoff):**
  - Estudante ativo é "pelo menos 1 interação" (BI) ou "mais de 1" (Educadores)?
  - A régua 30/60/85 vale também para Alfabetização (hoje 65/85)?
  - Interações por estudante: dividir por ativos ou por vinculados?
  - Metas: uma por indicador ou por tipo de atividade? A rede pode mudar?
  - Unidade regional é um papel de acesso próprio ou um vínculo com a unidade?
  - O coordenador é sempre MANAGER?
  - Qual é a janela real de atualização do dbt?
  - Quais 2 redes fazem o piloto da Fase 1?
  - Taxa de entrega: só tarefas com prazo vencido?
  - A meta de proficiência TRI (220) é da rede ou da Jovens Gênios?
  - A Liga das Estrelas divide por rede ou por escola?

## Etapas

1. Mapeamento das bibliotecas · feito
2. Tela piloto para validação · feito (P1 a P7, com as 3 abas e as permissões)
3. Telas Desktop e protótipo no Figma · **em validação**
4. Telas Tablet e Celular
5. Componentes da jornada
6. Handoff
7. Navegável
