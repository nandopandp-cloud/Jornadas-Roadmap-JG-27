# Término da Gamificação dos Educadores 2026

Experiência de **encerramento da Gamificação dos Educadores 2026** na plataforma Educadores (Gamificação › Ranking). A tela mostra, de forma simples, que a edição terminou e quem ficou nos **3 primeiros lugares**. Ela mantém o **gatilho atual do Clube Jovens Gênios**, onde o educador troca seus pontos por benefícios exclusivos da JG.

**Protótipo navegável:** https://termino-gamificacao-educadores.vercel.app

> Esta iniciativa **não entra na plataforma de jornadas**. O navegável tem link e projeto Vercel próprios (`termino-gamificacao-educadores`). Nesta branch, o `src/main.tsx` abre direto o protótipo. A plataforma completa está documentada no README da `main`.

## Referências

| O quê | Onde |
| --- | --- |
| Tela atual (ranking em andamento) | print de 13/11/2026, na página **00 · Mapeamento** do Figma |
| Figma (telas, protótipo e handoff) | https://www.figma.com/design/jJugywGtJ9ZberC6jC6ZC6 |
| Bibliotecas | Relatórios de Trilhas de Aprendizagem (Sidebar - Educadores, tokens “Educadores — Cor”), Redação - Educadores (Botão), Lucide |
| Código do navegável | `src/prototypes/termino-gamificacao-educadores` (data, index, tge.css) + casca do kit Educadores (`rgx.css`) |
| Artes | `public/tge`, recortadas do print da tela atual |

## Decisões

- **Só o top 3:** a classificação completa não é exibida.
- **Só a pontuação da gamificação:** hoje não dá para consultar o extrato de pontos do Clube JG, então a tela não mostra saldo do Clube.
- **Premiação:** existe, mas não é comunicada nesta tela.
- **Saem da tela:**
  - “Visualizar minha inscrição”;
  - “Crie novas atividades”, porque a edição acabou;
  - qualquer card de saldo e o botão extra “Trocar meus pontos no Clube JG”.
- **Gatilho do Clube JG:** só o card “Programa de Recompensas” com “Acessar Clube JG”, igual à tela atual.
- **Resultados:** o card leva para a tela atual “Resultados das atividades”. Essa tela só existe no navegável, como referência.
- **Pódio:**
  - ordem 2º · 1º · 3º;
  - o 1º tem coroa e degrau mais alto;
  - cada colocação tem o anel da sua medalha (ouro, prata e bronze);
  - quando o professor tiver foto cadastrada na plataforma, ela aparece na elipse do avatar (pódio, modal e educador logado). As iniciais ficam só para quem não tem foto.
- **Meu resultado final:**
  - a colocação é revelada;
  - fora do pódio, mostra quantos pontos faltaram;
  - no pódio, mostra a vantagem sobre o 2º colocado.
- **Modal de encerramento:**
  - abre no primeiro acesso depois do fim, com os 3 vencedores e a colocação do educador;
  - no celular, vira bottom sheet;
  - o véu é de 40%.

## Processo

1. ✅ **Mapeamento** (página 00) e ✅ **piloto**, validado em 13/11/2026. A página 01 · Piloto foi excluída ao final.
2. ✅ **Telas** nas páginas **05 Desktop**, **06 Tablet** e **07 Celular**. São 3 estados em cada largura:
   - 1.1 fora do pódio;
   - 1.2 no pódio (1º lugar);
   - 1.3 não participou.
3. ✅ **Sobrepostos** (página **08**): O1.1–O1.3, o modal de encerramento nos 3 estados × 3 larguras.
4. ✅ **Componentes** (página **04**):
   - Shell · Sidebar Gamificação;
   - Pódio · Coluna;
   - Card · Programa de Recompensas;
   - Card · Resultados;
   - Modal · Linha do vencedor.
5. ✅ **Protótipo** (página **09**): 3 fluxos × Desktop e Celular, do modal à tela.
6. ✅ **Handoff** (página **10**):
   - visão geral e decisões;
   - Ranking encerrado;
   - Modal de encerramento;
   - Engenharia.
7. ✅ **Navegável** em React, publicado no link acima e testado nas 3 larguras.

## Atalhos do navegável

| Atalho | Tela |
| --- | --- |
| `#/?screen=modal` (padrão) | Modal de encerramento + educador fora do pódio |
| `#/?screen=fora` | Ranking encerrado · fora do pódio (5º) |
| `#/?screen=podio` | Ranking encerrado · no pódio (1º) |
| `#/?screen=sem` | Ranking encerrado · não participou |
| `#/?screen=modal-podio` | Modal de encerramento · no pódio |
| `#/?screen=modal-sem` | Modal de encerramento · não participou |
| `#/?screen=resultados` | Resultados das atividades (tela atual, aberta pelo card Resultados) |

O botão tracejado **“Cenário”**, no canto inferior direito, existe só no protótipo. Ele alterna os 3 estados e reabre o modal.

“Acessar Clube JG” mostra um aviso de que o Clube JG abriria em nova aba, porque a URL ainda está pendente.

**Resultados das atividades:**
- é uma réplica da tela atual da plataforma, com 600 atividades em 60 páginas, ordenação por coluna e paginação;
- a soma dos pontos fecha com a pontuação do cenário: 11.820 fora do pódio e 15.240 no pódio;
- sem participação, a tela mostra o estado vazio.

## Dados de exemplo

São todos fictícios.

- **Edição:** Gamificação dos Educadores 2026, de 02/03 a 30/11/2026, com 1.248 educadores participantes.
- **Pódio:**
  - 1º Mariana Costa, com 15.240 pontos;
  - 2º Carlos Eduardo Lima, com 14.310 pontos;
  - 3º Juliana Ferreira, com 13.075 pontos.
- **Educador logado:** Rodrigo Ribeiro, em 5º lugar, com 11.820 pontos, 600 atividades e 96% de engajamento.
  - No cenário do pódio, ele é o 1º, com 15.240 pontos.
  - No cenário sem participação, ele não tem pontuação nem atividades.

## Deploy

1. Rode `npm run build`.
2. Copie `dist/index.html`, `dist/assets` e `dist/tge` para uma pasta vinculada ao projeto Vercel `termino-gamificacao-educadores`.
3. Rode `vercel deploy --prod --yes --scope fernando-rodrigues-projects-b0dfe047`.

Não use o deploy da `main`.
