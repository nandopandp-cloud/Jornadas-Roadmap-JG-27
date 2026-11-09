# Jornada: Gamificação GenieX

Gamificação da GenieX, parte do Roadmap 2027 da Jovens Gênios. O estudante acompanha a própria evolução a partir do perfil: XP válido, elos (Bronze, Prata, Ouro, Diamante e Cósmico), progresso para o próximo elo e extrato de XP com a validade de cada lote. Esta branch trata só da **experiência do estudante na GenieX**. As telas de Educadores (relatórios com elo e XP) ficam para uma branch própria, `gamificacao-geniex-educadores`, em uma etapa posterior. A visão geral da plataforma e das demais jornadas está no README da branch `main`.

- **Figma da jornada:** https://www.figma.com/design/BuFp19bdYy4ycLOk9vXCLH/Gamifica%C3%A7%C3%A3o-Geniex
- **Referência (conceito):** página “Gamificação Geniex” do arquivo [Campeonato GenieX (conceito)](https://www.figma.com/design/CFgSTHDpGqyNluCYfHxj7U/CAMPEONATO---GENIEX--CONCEITO-?node-id=28-140). São imagens de conceito: servem de referência, nunca de tela.
- **Na plataforma:** https://jornadas-roadmap-jg-27.vercel.app/#/jornada/gamificacao-geniex (aparece como “Em construção” até o navegável ficar pronto)
- **PRD:** [`PRD.md`](PRD.md) (Sistema de Gamificação da GenieX v2.0: XP, elos e badges)
- **Status:** piloto aprovado e telas prontas em Desktop 1440, Tablet 768 e Celular 375 (páginas 05 a 08 do Figma). Próximas etapas: componentes, protótipo e handoff.

## Decisões (09/11/2026)

- **Marca:** Logo GenieX do Style Guide. No banner escuro ele usa o modo Dark da própria biblioteca, sem cópia nem cor manual.
- **Escopo:** só o estudante na GenieX. Educadores entra depois, na branch `gamificacao-geniex-educadores`.
- **Acesso:** “Minha evolução” não ganha item na sidebar. O estudante chega pelo menu do perfil, no rodapé da sidebar, onde o item já mostra o elo atual. A página mostra o caminho “Meu perfil › Minha evolução” e um botão de voltar.
- **Artes:** derivadas dos exemplos da referência. Cada medalha e cena foi recortada da imagem de conceito, ampliada 4× com Real-ESRGAN e teve o fundo removido com BiRefNet; nos banners, os textos foram removidos por inpainting. Resultado:
  - medalhas dos 5 elos, em cerca de 420×520 px com fundo transparente;
  - selo de XP;
  - cenas de cada elo;
  - banner “Sua jornada”.

  Todas ficam na página “02 · Assets” do Figma.

- **Nomes das badges (09/11):** o tom espacial do PRD não combina com o público do ensino médio. Os nomes passaram a usar uma linguagem jovem e respeitosa, sem comparar o estudante com outros, já que ranking está fora do escopo. Os ícones viraram símbolos de foco, ritmo, ideia, meta e troféu. Os avatares vêm da biblioteca Open Peeps: menu do perfil e estado vazio do extrato.
- **Dados de exemplo:** 6.420 XP válidos, elo Bronze, 3 de 25 badges, maior elo alcançado Bronze. Próxima badge “Mandando Bem” aos 8.000 XP e Prata aos 10.000. A regressão (G3.2 e O7) usa outro estudante: tinha Ouro e caiu para Prata com 28.000 XP.

## Telas (Figma)

| Código | Tela | O que mostra |
| --- | --- | --- |
| **G1** | Minha evolução | Banner com o elo, o XP válido, o maior elo e o progresso. Cartões de elo, XP e próximo elo. Bloco “Suas badges” com a próxima badge. Como evoluir: tarefas e provas não geram XP e vale 1 redação por dia. |
| **G2** | Os elos da GenieX | Os 5 elos com faixa e frase, a posição atual e como conquistar XP. |
| **G3** · G3.1 · G3.2 | Meu elo atual | Banner do elo, régua “Você está aqui”, próximo elo, histórico de elos com motivo e maior elo. G3.1 mostra o Cósmico, sem próximo elo e com a próxima badge. G3.2 mostra a regressão de Ouro para Prata, com alerta. |
| **G4** · G4.1 | Extrato de XP | Lotes com XP concedido, XP válido do lote, próxima expiração (valor e data) e status: válido, 50% expirado, expira em breve, expirado ou limite diário. Mostra também os lotes que expiram em breve, a regra de validade e como se ganha XP. G4.1 é o estado vazio. |
| **G5** | Minhas badges | As 25 badges por elo, conquistadas (com data) ou bloqueadas (com o requisito e quanto falta), mais o resumo. |
| **O1–O3** | Sobrepostos | Menu do perfil (acesso), lotes que vão expirar e detalhe do lote. |
| **O4–O7** | Sobrepostos | Detalhe da badge e as notificações do PRD 11.4: badge desbloqueada, novo elo e elo alterado por expiração. |

## Badges (nomes propostos para validação)

| Elo | 1 | 2 | 3 | 4 | 5 |
| --- | --- | --- | --- | --- | --- |
| Bronze | Dei o Play (2.000) | Pegando o Ritmo (4.000) | Modo Foco (6.000) | Mandando Bem (8.000) | Bronze com Orgulho (9.000) |
| Prata | Rotina em Dia (14.000) | Constância é Tudo (18.000) | Mente Afiada (22.000) | Sem Pausa (26.000) | Prata da Casa (29.000) |
| Ouro | Brilho Próprio (36.000) | Fera do Estudo (42.000) | Alto Nível (48.000) | Imparável (54.000) | Ouro Puro (59.000) |
| Diamante | Lapidado (68.000) | Visão de Jogo (76.000) | Determinação Total (84.000) | Inspiração (92.000) | Excelência (99.000) |
| Cósmico | Fora da Curva (140.000) | Sem Limites (180.000) | Inabalável (220.000) | Lendário (260.000) | Para a História (300.000) |

## A jornada (referência)

| Tela | Plataforma | O que mostra |
| --- | --- | --- |
| **Minha evolução** | GenieX · estudante | Banner da jornada com a medalha do elo, elo atual, XP válido e progresso para o próximo elo; cartões de elo atual, XP acumulado e próximo elo; “Como evoluir” (quizzes, simulados e redações). |
| **Os elos da GenieX** | GenieX · estudante | Os 5 elos com a faixa de XP e uma frase de cada um, posição atual e como conquistar XP. |
| **Meu elo atual** | GenieX · estudante | Banner do elo, faixa de XP do elo com “Você está aqui”, próximo elo, como ganhar XP e histórico de elos. |
| **Extrato de XP** | GenieX · estudante | XP válido, total conquistado, XP prestes a expirar e já expirado; tabela por atividade com validade e status; lotes prestes a expirar e regra de validade (0–3 meses: 100%; aos 3 meses expira 50%; aos 6 meses expira o resto). |

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


## Organização

- **Branch `main`:** plataforma completa (o que vai para o ar). Registro da jornada em `src/platform/journeys.ts`.
- **Esta branch (`gamificacao-geniex`):** a `main` + este README. O navegável vai ficar em `src/prototypes/gamificacao-geniex/`.
