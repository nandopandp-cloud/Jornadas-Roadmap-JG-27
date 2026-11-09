# Jornada: Gamificação GenieX

Gamificação da GenieX, parte do Roadmap 2027 da Jovens Gênios. O estudante acompanha a própria evolução: XP válido, elos (Bronze, Prata, Ouro, Diamante e Cósmico), progresso para o próximo elo e extrato de XP com a validade de cada lote. Os educadores veem o elo e o XP dos estudantes nos relatórios. Esta branch trata só desta jornada. A visão geral da plataforma e das demais jornadas está no README da branch `main`.

- **Figma da jornada:** https://www.figma.com/design/BuFp19bdYy4ycLOk9vXCLH/Gamifica%C3%A7%C3%A3o-Geniex
- **Referência (conceito):** página “Gamificação Geniex” do arquivo [Campeonato GenieX (conceito)](https://www.figma.com/design/CFgSTHDpGqyNluCYfHxj7U/CAMPEONATO---GENIEX--CONCEITO-?node-id=28-140). São imagens de conceito: servem de referência, nunca de tela.
- **Na plataforma:** https://jornadas-roadmap-jg-27.vercel.app/#/jornada/gamificacao-geniex (aparece como “Em construção” até o navegável ficar pronto)
- **Status:** mapeamento das bibliotecas concluído. Próxima etapa: tela piloto para validação.

## A jornada (referência)

| Tela | Plataforma | O que mostra |
| --- | --- | --- |
| **Minha evolução** | GenieX · estudante | Banner da jornada com a medalha do elo, elo atual, XP válido e progresso para o próximo elo; cartões de elo atual, XP acumulado e próximo elo; “Como evoluir” (quizzes, simulados e redações). |
| **Os elos da GenieX** | GenieX · estudante | Os 5 elos com a faixa de XP e uma frase de cada um, posição atual e como conquistar XP. |
| **Meu elo atual** | GenieX · estudante | Banner do elo, faixa de XP do elo com “Você está aqui”, próximo elo, como ganhar XP e histórico de elos. |
| **Extrato de XP** | GenieX · estudante | XP válido, total conquistado, XP prestes a expirar e já expirado; tabela por atividade com validade e status; lotes prestes a expirar e regra de validade (0–3 meses: 100%; aos 3 meses expira 50%; aos 6 meses expira o resto). |
| **Relatórios de Estudantes** | Educadores | Lista com XP válido (barra) e elo atual de cada estudante, filtros por turma, escola e ano escolar. |
| **Gamificação do estudante** | Educadores | Aba “Gamificação” no relatório do estudante: elo, progresso, XP válido, conquistado e expirado, evolução do XP no tempo, distribuição por modalidade e últimas atividades com XP. |

Regras que aparecem na referência: quizzes e simulados dão 10 XP por questão correta; redações dão 1 XP por ponto da nota (0 a 1.000). Faixas dos elos: Bronze 0–9.999, Prata 10.000–29.999, Ouro 30.000–59.999, Diamante 60.000–99.999 e Cósmico a partir de 100.000 XP válidos.

## Mapeamento das bibliotecas (arquivo da jornada)

Bibliotecas plugadas no Figma da jornada: **🎨 Style Guide - GenieX**, **🎓 Cursos**, **Lucide Icons** e **Untitled UI Icons v7**.

**Style Guide - GenieX**
- **Variáveis:** coleções `1. Properties` (espaçamentos, raios, larguras e alturas no padrão Tailwind), `2. Themes` (paletas light, dark e navy) e `3. Modes` (cores semânticas com os modos **Light, Dark e Navy**), além de `4. WL Customize` (white label).
- **Cores (modo Light):**
  - primary #5258E4 (índigo), com foreground branco;
  - secondary #D3D5FF, com foreground #4046CA;
  - texto #0D0D0D, muted #6D6D6D;
  - borda e input #E6E6E6, muted #F8F8F8, card branco;
  - sucesso #007A4D, aviso #C59319, destrutivo #D31510;
  - gráficos: #5258E4, #007772, #00719F, #F68511 e #C82269.
- **Tipografia:** Geist (o logo usa Orbitron). Text styles no padrão Tailwind: `text small (14)`, `base (16)`, `large (18)`, `2x large (24)`, `3x large (30)` e `5x large (48)`, cada um com os pesos medium, bold e black.
- **Componentes que a jornada usa:**
  - estrutura: Sidebar (Desktop/Tablet/Mobile, recolhida ou não), Sidebar Items (o item “Ligas” já aparece como Ranking), Sidebar Profile, Top Bar (versão 2, com Button Streak e Counter), Logo GenieX, Container Grid;
  - controles: Button (Default, Secondary, Destructive, Outline, Ghost, Link × sm/md/lg/icon), Badge, Tabs e Tabs Trigger, Progress Bars (0–100), Input / Basic, Tooltip, Avatar, Status, Sheet, Drawer, Calendar.
- **Ícones dos componentes:** Untitled UI, estilo linha, 20 px (home-smile, trophy-01, calendar, genie-bot-02, file-check-02, edit-04…). As telas novas seguem o mesmo padrão, com Lucide quando o Untitled não tiver o ícone.

**🎓 Cursos:** Card de Cursos (Default, In Progress e Completed), Sobre o curso, Título e Lições da Unidade, Filtros (Badges), Tooltip Animation. Servem de apoio para cartões e filtros.

**O que não existe nas bibliotecas** e vira componente da jornada:
- medalhas dos 5 elos e arte dos banners (espaço/planeta por elo);
- selo de XP;
- cartões de elo e de métrica de XP;
- régua da faixa de XP com “Você está aqui”;
- linha do extrato com validade e status;
- linha do tempo de elos;
- cartões de “Como ganhar XP”;
- gráficos de evolução e distribuição do XP;
- tabela e paginação: o Style Guide GenieX não tem tabela.

**Para decidir antes da tela piloto:**
- **Marca:** a referência usa o white label “Prepara SP”. O piloto pode sair com o Logo GenieX ou com um white label.
- **Telas de Educadores:** seguem outro produto, com sidebar e paleta próprias. A biblioteca do Educadores ainda não está plugada no arquivo da jornada.
- **Item “Minha evolução” da sidebar:** não existe nos Sidebar Items. Dá para usar o item “Página Inicial” trocando o texto e o ícone.

## Organização

- **Branch `main`:** plataforma completa (o que vai para o ar). Registro da jornada em `src/platform/journeys.ts`.
- **Esta branch (`gamificacao-geniex`):** a `main` + este README. O navegável vai ficar em `src/prototypes/gamificacao-geniex/`.
