# Término da Gamificação dos Educadores 2026

Experiência de **encerramento da Gamificação dos Educadores 2026** na plataforma Educadores (Gamificação › Ranking). A tela mostra, de forma simples, que a edição terminou e quem ficou nos **3 primeiros lugares**. Ela mantém o **gatilho atual do Clube Jovens Gênios**, onde o educador troca seus pontos por benefícios exclusivos da JG.

> Esta iniciativa **não entra na plataforma de jornadas**: o protótipo navegável terá um link próprio. A plataforma completa está documentada no README da `main`.

## Referências

| O quê | Onde |
| --- | --- |
| Tela atual (ranking em andamento) | print de 13/11/2026, na página **00 · Mapeamento** do Figma |
| Figma de destino (telas) | https://www.figma.com/design/jJugywGtJ9ZberC6jC6ZC6 |
| Bibliotecas | Relatórios de Trilhas de Aprendizagem (Sidebar - Educadores, tokens “Educadores — Cor”), Redação - Educadores (Botão), Lucide |

## Decisões até aqui

- **Mesma rota e mesmo shell de hoje:**
  - sidebar com Gamificação › Ranking ativo, criada a partir da “Sidebar - Educadores” da lib;
  - breadcrumb Jornada dos professores / Ranking.
- **Pódio no lugar do suspense:**
  - o card “Continue se Esforçando!” e a tabela borrada viram um único card com os vencedores, na ordem 2º · 1º · 3º;
  - o 1º lugar tem coroa, e cada colocação tem o anel da sua medalha (ouro, prata e bronze).
- **Meu resultado final:**
  - a colocação é revelada e ganha o badge “Resultado final”;
  - aparece quantos pontos faltaram para o pódio.
- **Clube JG:**
  - o card “Programa de Recompensas” com “Acessar Clube JG” continua igual;
  - entram o card “Seus pontos no Clube JG” e o botão “Trocar meus pontos no Clube JG” no rodapé do pódio;
  - o card “Crie novas atividades” sai, porque a edição acabou.
- **Estados:**
  - educador fora do pódio (5º);
  - educador no pódio (1º);
  - educador que não participou;
  - modal de encerramento no primeiro acesso.

## Processo

1. ✅ **Mapeamento** (página 00), com o print da tela atual, o fluxo e as telas previstas.
2. 🔄 **Tela piloto** (página 01): P1 · Ranking encerrado com o educador fora do pódio, no Desktop 1440. Aguarda validação.
3. ⏳ Todas as telas nas 3 larguras, sobrepostos, componentes, protótipo e handoff.
4. ⏳ Protótipo navegável em React, com link próprio fora da plataforma de jornadas.

## Dados de exemplo

São todos fictícios.

- **Edição:** Gamificação dos Educadores 2026, de 02/03 a 30/11/2026, com 1.248 educadores participantes.
- **Pódio:**
  - 1º Mariana Costa, com 15.240 pontos;
  - 2º Carlos Eduardo Lima, com 14.310 pontos;
  - 3º Juliana Ferreira, com 13.075 pontos.
- **Educador logado:** Rodrigo Ribeiro, em 5º lugar, com 11.820 pontos, 600 atividades e 96% de engajamento.
