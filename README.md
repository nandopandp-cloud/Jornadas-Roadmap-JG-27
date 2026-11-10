# Campeonato · GenieX

Jornada do **Campeonato** na plataforma do estudante GenieX. Os educadores criam o campeonato. O estudante do Ensino Médio desafia colegas do mesmo ano e da mesma escola (inclusive de outras turmas) em Batalhas VS, acompanha as batalhas pendentes e sobe no ranking por vitórias.

> Esta branch guarda a iniciativa do Campeonato. A plataforma completa e a lista de todas as jornadas ficam no README da `main`. O PRD completo está em [PRD.md](PRD.md).

## Referências

| O quê | Onde |
| --- | --- |
| Telas de conceito (14 frames, 3 fluxos de protótipo) | https://www.figma.com/design/CFgSTHDpGqyNluCYfHxj7U (página “Campeonato”) |
| Figma de destino (telas) | https://www.figma.com/design/rXH2XCv3MCabtDHDawkJad |
| PRD | [PRD.md](PRD.md) (v1.0) |
| Batalhas VS (regras que o campeonato reaproveita) | branch `batalhas-vs-geniex` |

## Escopo desta branch

- **Só o estudante (GenieX).**
- Os relatórios dos Educadores (lista de campeonatos, Visão geral, Engajamento, Aprendizagem e Glossário) ficam para uma **branch separada**, depois que a parte do estudante estiver pronta.
- A criação do campeonato pelo educador (Feature 01 do PRD) também fica fora desta branch.

## Decisões (09/11/2026)

| Tema | Conceito | Decisão |
| --- | --- | --- |
| Conteúdo da batalha | Disciplinas e tópicos definidos pelo educador | **O estudante escolhe** de 1 a 3 disciplinas do campeonato e 1 tópico de cada (PRD, Feature 05). A nova batalha ganha a etapa “Disciplinas e tópicos”. |
| Pontos e XP | +12 pontos e +50 XP por batalha; ranking por pontos | **Sem pontos e sem XP.** O ranking é por vitórias, com desempate por acertos acumulados, menor tempo médio nas corretas e ordem alfabética (PRD, Feature 10). As batalhas não geram XP (decisão de 09/11). |
| Tempo | “Até 1 minuto por questão” ou “sem tempo fixo” | **10 minutos** para as 10 questões, por participante (PRD, RN07). |
| Desafio recebido | Botões “Aceitar” | **Sem etapa de aceite** (PRD, Feature 06). O botão vira “Responder”. |
| Avatares | Ilustrações do conceito | **Biblioteca de avatares** (Open Peeps, componente Busto), como nas Batalhas. |

## Processo

1. ⏳ **Mapeamento** das telas de conceito, do PRD e das bibliotecas.
2. ⬜ **Tela piloto** para validação.
3. ⬜ **Todas as telas** em Desktop 1440, Tablet 768 e Celular 375.
4. ⬜ **Sobrepostos**, sempre com véu.
5. ⬜ **Componentes** da jornada.
6. ⬜ **Protótipo e handoff.**
7. ⬜ **Navegável** e registro como navegável na plataforma.
