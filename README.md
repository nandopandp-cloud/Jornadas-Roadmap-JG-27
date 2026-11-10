# Relatórios do Campeonato · GenieX (Educadores)

Relatórios do **Campeonato GenieX** na plataforma Educadores. O educador acompanha a participação, o engajamento, o desempenho e a aprendizagem dos estudantes em um campeonato de até 3 disciplinas. O relatório traz também o novo indicador de **tempo médio de resposta correta**.

> Esta branch guarda os relatórios do campeonato. A experiência do estudante fica na branch `campeonato-geniex`, e a plataforma completa, no README da `main`. O PRD está em [PRD.md](PRD.md).

## Referências

| O quê | Onde |
| --- | --- |
| Telas de conceito (5 frames) | `public/relatorios-campeonato/` (fora do Git) e página “Campeonato” do arquivo de conceito |
| Figma de destino (telas) | https://www.figma.com/design/2dCJihe9CXk3jC1NClnvaZ |
| PRD | [PRD.md](PRD.md) |
| Jornada do estudante (mesmos dados) | branch `campeonato-geniex` |

## Decisões

- **Lugar no menu:** Relatórios › Atividades › Campeonatos, ao lado de Tarefas, Simulados, Redações e Teste Vocacional, no mesmo padrão do Relatório do Teste Vocacional.
- **Dados coerentes com a jornada do estudante:**
  - a Copa GenieX · 1º ano tem Matemática, Física e Química, de 01 a 30 nov. 2026;
  - são 128 estudantes elegíveis, e 100 participaram;
  - vitórias, acertos e tempo médio são os mesmos do ranking da Copa.
- **Novo indicador:** o tempo médio de resposta correta aparece na Visão geral e na Aprendizagem, com recorte por disciplina e por tópico, e estado “sem dados” quando não há respostas corretas.
- **Colunas a mais:** a tabela de desempenho ganhou Turma (a Copa junta turmas diferentes) e Empates (para as batalhas fecharem a conta).
- **Ações do cabeçalho:** ficam Compartilhar e Exportar relatório. Editar, duplicar e excluir saíram, porque a configuração do campeonato está fora do escopo.

## Processo

1. ✅ **Mapeamento** e ✅ **tela piloto** validada. As duas páginas de trabalho (00 e 01) foram excluídas do Figma ao final.
2. ✅ **Todas as telas** (páginas **05 Desktop**, **06 Tablet**, **07 Celular**): 6 seções em cada largura.
   - lista de campeonatos e estado vazio;
   - Visão geral, com e sem dados;
   - Engajamento;
   - Aprendizagem › Estudantes;
   - Aprendizagem › Questões e conteúdos;
   - Glossário.
3. ✅ **Sobrepostos** (página **08**), sempre com véu (24% em menu e toast, 40% em modal e sheet):
   - Exportar: menu no desktop, sheet no celular, toast “Gerando o PDF…”;
   - Compartilhar: modal e toast “Link copiado”;
   - Ranking completo: modal no desktop, sheet no celular.
4. ✅ **Componentes** (página **04**): Indicador do relatório, Opção de exportação, Linha do ranking de aprendizagem, Indicador do glossário e Toast do relatório.
5. ✅ **Protótipo** (página **09**, 38 interações) e **handoff** (página **10**), com as regras do PRD.
6. ✅ **Navegável** em `src/prototypes/relatorios-campeonato`, registrado na plataforma com 12 atalhos: https://jornadas-roadmap-jg-27.vercel.app/#/jornada/relatorios-campeonato

## Navegável

| Arquivo | Papel |
| --- | --- |
| `data.ts` | Dados da Copa, iguais aos do Figma e da jornada do estudante (estudantes, tópicos, questões, rubricas) |
| `index.tsx` | Casca do Educadores, lista, relatório com 4 abas e sobrepostos |
| `rcp.css` | Peças do relatório; casca e tokens reaproveitados do `rgx.css` (Gamificação · Educadores) |

O que funciona de verdade: filtros e busca da lista, busca e paginação das tabelas, filtro por quadrante no gráfico, filtro por turma, recorte por disciplina na Aprendizagem, filtros e ordenação das questões, exportar, compartilhar e ranking completo.
