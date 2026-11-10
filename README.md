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

1. ✅ **Mapeamento** (página **00**).
2. ⏳ **Tela piloto** (página **01**): Relatório da Copa · Visão geral, em Desktop 1440, aguardando validação.
3. ⬜ **Todas as telas** em Desktop, Tablet e Celular.
4. ⬜ **Sobrepostos** (exportar e estados), sempre com véu.
5. ⬜ **Componentes.**
6. ⬜ **Protótipo e handoff.**
7. ⬜ **Navegável** e registro na plataforma.
