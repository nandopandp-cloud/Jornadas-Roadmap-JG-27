# Jornada: Teste Vocacional · GenieX

Parte da iniciativa **Orientação Vocacional e Exploração de Carreiras** do Roadmap 2027 da Jovens Gênios. Esta branch trata só da jornada do **estudante do Ensino Médio na GenieX**: do ponto de entrada ao relatório, à exploração de profissões e ao plano de próximos passos. A visão geral da plataforma e das demais jornadas está no README da branch `main`.

- **PRD da iniciativa:** [`PRD.md`](PRD.md)
- **Metodologia do teste:** [`METODOLOGIA.md`](METODOLOGIA.md)
- **Figma · jornada navegável de referência:** https://www.figma.com/design/CFgSTHDpGqyNluCYfHxj7U/CAMPEONATO---GENIEX--CONCEITO-?node-id=24-70 (página “Teste Vocacional - Geniex”)
- **Figma · telas em alta fidelidade (com as bibliotecas da GenieX):** https://www.figma.com/design/Hz67j5SdcyZzMLW3wfb9wd/Teste-Vocacional
- **Jornada dos Educadores (relatórios):** branch [`teste-vocacional-educadores`](https://github.com/nandopandp-cloud/Jornadas-Roadmap-JG-27/tree/teste-vocacional-educadores)
- **Status:** construção das telas no Figma. O núcleo do teste (instrumento, catálogo e motor de recomendação) já está no código; o protótipo navegável vem depois das telas.

## A jornada

| Etapa | O que acontece | PRD |
| --- | --- | --- |
| Entrada | Ponto de acesso na GenieX com finalidade, duração, “sem resposta certa ou errada” e limites do teste. Retoma um teste interrompido. | §5.2 |
| Clareza inicial | “Quanto você sente que sabe quais caminhos profissionais gostaria de explorar?” (1 a 5, opcional). | §5.3 |
| Como funciona | As 4 etapas, como as respostas são usadas e o que o teste não faz. | §5.1 |
| Questionário | 52 perguntas em 4 etapas (interesses, valores, preferências, habilidades), uma por vez, com progresso, voltar, salvamento e retomada. | §5.4 |
| Revisão | Mostra respostas faltantes e permite editar qualquer uma antes de concluir. | §5.4, §6.2 |
| Processamento | Cálculo determinístico e versionado. | §5.5 |
| Meu perfil | Visão geral, mapa de interesses, características, possibilidades com justificativa e orientações de exploração. | §5.6, §5.7 |
| Conheça a profissão | Conteúdo mínimo de 13 itens, com fontes e data de revisão. | §5.8 |
| Comparar, Minhas carreiras, Meu plano | Comparação lado a lado, favoritos organizados e plano de ações. | §5.9 a §5.11 |
| Como você se sente agora? | Mesma pergunta de clareza, sem bloquear o relatório. | §5.12 |
| Minha jornada | Histórico de tentativas, com a versão do instrumento de cada uma. | §5.13 |

## Núcleo do teste (já no código)

Separado da interface, como pede o PRD (§5.5 e §10.5), em `src/prototypes/teste-vocacional/`:

- **`instrumento.ts`:** as 52 perguntas da metodologia, escalas, etapas e versão (`TV-GX 1.0 · piloto`). O Bloco A é exibido intercalando as dimensões, para o estudante não responder cinco itens seguidos da mesma área.
- **`carreiras.ts`:** catálogo inicial com 30 profissões de 8 áreas (graduações, cursos técnicos e tecnólogos, incluindo profissões pouco conhecidas), perfil de referência RIASEC, contexto de trabalho, valores, formações, ingresso obrigatório × desejável, desafios, relacionadas, fontes e data de revisão. Conteúdo ilustrativo, pendente de revisão especializada.
- **`motor.ts`:** soma por dimensão (5 a 25), normalização 0 a 100, até três pistas com empates preservados, perfil distribuído e inconclusivo; recomendação por distância ponderada (wₖ = 1 + Sₖ/100) com diversidade (no máximo 2 por dimensão principal e por área, ao menos uma pouco conhecida), categorias “Vale a pena explorar” e “Possibilidade complementar” e justificativas ligadas às respostas registradas. Sem percentual de compatibilidade.
- **`dados.ts`:** respostas fictícias da persona do protótipo.

Ícones 3D das profissões e das dimensões: [Microsoft Fluent Emoji](https://github.com/microsoft/fluentui-emoji) (licença MIT), em `public/voc/`.
