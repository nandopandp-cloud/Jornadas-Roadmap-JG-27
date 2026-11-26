# Jornada: Novos Relatórios (Educadores)

Protótipo da **Plataforma Educadores** que junta os relatórios da Educadores e os BIs externos por cliente numa experiência só, parte do Roadmap 2027 da Jovens Gênios. Esta branch trata só desta jornada; a visão geral da plataforma e das demais jornadas está no README da branch `main`.

> **Em construção.** Etapa atual: mapeamento das bibliotecas no Figma. Este README é atualizado a cada etapa.

- **Na plataforma:** https://jornadas-roadmap-jg-27.vercel.app/#/jornada/novos-relatorios
- **Figma:** https://www.figma.com/design/A5hHDrpWbICZ1JfKpUiS2k/Novos-Relat%C3%B3rios
- **PRD:** [PRD.md](PRD.md) (cópia de 26/11/2026) · documento vivo em https://claude.ai/artifact/YK2QFjJVHLy9BaXHc3o7oE
- **Código (quando houver navegável):** `src/prototypes/novos-relatorios/`

## A ideia em uma frase

Fonte única de dados, as mesmas regras de cálculo e o mesmo permissionamento para todos: cada pessoa tem **3 visões prontas** (Resumo, Acompanhamento, Detalhada) em qualquer recorte e monta **os próprios painéis** com blocos de um catálogo único, como um lego.

## Escopo deste protótipo

Decidido em 26/11/2026:

- **PRD inteiro:** visões prontas, Meus painéis, painéis-modelo, glossário único, recortes institucionais (rede → unidade regional → escola → turma → estudante, e professores), atividades (Tarefa, Prova Genial, Desafio Adaptativo, Aula Invertida, Projetos, Raio-X, Campeonato), eventos (Olimpíadas, Liga das Estrelas), blocos que hoje só existem no BI (comparativo, mapa ativação × desempenho, prioridades pedagógicas, TRI, NSE, redações) e o painel interno de migração.
- **Pessoa logada:** gestora de rede, com troca para coordenador e professor pelo menu do usuário, para mostrar o permissionamento.
- **3 visões:** níveis de detalhe iguais para todos os perfis; o recorte e o escopo mudam os dados.

## Etapas

1. Mapeamento das bibliotecas · **em andamento**
2. Tela piloto para validação
3. Telas nas 3 larguras e sobrepostos
4. Componentes da jornada
5. Protótipo e handoff
6. Navegável
