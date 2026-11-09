# Jornada: Gamificação GenieX · Relatórios dos Educadores

Relatórios da gamificação da GenieX na **Plataforma Educadores**, parte do Roadmap 2027 da Jovens Gênios. Professores e gestores acompanham, por turma e por estudante, o XP válido, os elos (Bronze, Prata, Ouro, Diamante e Cósmico), as badges conquistadas e o histórico de XP. A experiência do estudante na GenieX fica na branch `gamificacao-geniex`. A visão geral da plataforma e das demais jornadas está no README da branch `main`.

- **Figma da jornada:** https://www.figma.com/design/qGV0c41SU0rexfMdxZ0Qid/Relat%C3%B3rios---Gamifica%C3%A7%C3%A3o-Geniex
- **Referências:**
  - Padrão de relatório Educadores (Teste Vocacional): relatório por turma com métricas, filtros por status e tabela; perfil do estudante com abas. As imagens estão na pasta local `public/relatorios-gamificacao-geniex/` (fora do Git).
  - Conceito da gamificação para Educadores: página “Gamificação Geniex” do arquivo [Campeonato GenieX (conceito)](https://www.figma.com/design/CFgSTHDpGqyNluCYfHxj7U/CAMPEONATO---GENIEX--CONCEITO-?node-id=28-140) (Relatórios de Estudantes com XP válido e elo; aba Gamificação do estudante).
- **PRD:** Sistema de Gamificação da GenieX v2.0 (copiado em `PRD.md` na branch `gamificacao-geniex`). Para os relatórios valem as métricas de sucesso (§13): distribuição por elo, XP médio por estudante ativo, percentual de estudantes com XP, XP por modalidade, badges por estudante e regressões de elo.
- **Na plataforma:** a jornada entra em https://jornadas-roadmap-jg-27.vercel.app quando o navegável estiver pronto.

## Processo

1. Mapeamento das bibliotecas do arquivo ✅
2. Tela piloto para validação ⏳ (aguardando OK)
3. Telas nas 3 larguras
4. Componentes da jornada
5. Protótipo e handoff
6. Navegável e entrada na plataforma

## Bibliotecas do arquivo

| Biblioteca | Uso nesta jornada |
| --- | --- |
| Cronograma de Uso - 2027 | Shell (sidebar shadcn), Barra superior, Cabeçalho da página, Cartão de métrica, Select, Campo, Aviso, Paginação, Barra de progresso |
| Relatórios de Trilhas de Aprendizagem | Alerta de delay de dados, tabela, Status Badge |
| Redação - Educadores | Botão, Avatar, Badge e text styles (Geist) |
| Lucide Icons | Ícones |

## Telas previstas

| # | Tela | Base |
| --- | --- | --- |
| P1 | Gamificação · Relatório por turma | Teste Vocacional (turma) + métricas do PRD |
| G2 | Relatórios de Estudantes · aba Gamificação | Conceito (lista com XP válido e elo) |
| G3 | Estudante · Gamificação (visão geral, XP, elos, badges, extrato) | Conceito + Teste Vocacional (perfil com abas) |
