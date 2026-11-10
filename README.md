# Jornada: Teste Vocacional · GenieX

Parte da iniciativa **Orientação Vocacional e Exploração de Carreiras** do Roadmap 2027 da Jovens Gênios. Esta branch trata só da jornada do **estudante do Ensino Médio na GenieX**: do ponto de entrada ao relatório, à exploração de profissões e ao plano de próximos passos. A visão geral da plataforma e das demais jornadas está no README da branch `main`.

- **PRD da iniciativa:** [`PRD.md`](PRD.md)
- **Metodologia do teste:** [`METODOLOGIA.md`](METODOLOGIA.md)
- **Figma · jornada navegável de referência:** https://www.figma.com/design/CFgSTHDpGqyNluCYfHxj7U/CAMPEONATO---GENIEX--CONCEITO-?node-id=24-70 (página “Teste Vocacional - Geniex”)
- **Figma · jornada em alta fidelidade:** https://www.figma.com/design/Hz67j5SdcyZzMLW3wfb9wd/Teste-Vocacional
- **Jornada dos Educadores (relatórios):** branch [`relatorios-teste-vocacional`](https://github.com/nandopandp-cloud/Jornadas-Roadmap-JG-27/tree/relatorios-teste-vocacional)
- **Protótipo navegável:** `#/p/teste-vocacional` · na plataforma: `#/jornada/teste-vocacional`
- **Status:** jornada aprovada e construída no Figma (capa, assets, compostos, Desktop, Tablet, Celular, sobrepostos, fluxos e handoff).

## No Figma

| Página | O que tem |
| --- | --- |
| 02 · Assets | Galeria das artes usadas nas telas (ampliadas com Real-ESRGAN), com o caminho em `public/` |
| 04 · Compostos | Seção “Compostos da jornada”: Sidebar · GenieX (Teste Vocacional ativo, expandida e recolhida), Letra RIASEC, Selo de afinidade, Nota da área, Posição no perfil, Posição no ranking, Etapa do questionário, Número da escala, Passo do plano, Atalho de próximos passos e Seta do cartão de profissão |
| 05 · Desktop (1440) · 06 · Tablet (768) · 07 · Celular (375) | 21 telas em cada largura, em seções 1 Entrada e questionário, 2 Conclusão e resultado e 3 Explorar profissões |
| 08 · Sobrepostos | O1 Clareza final, O2 Obrigado, O3 Como chegamos a este resultado, O4 Detalhe da dimensão, O5 Sair do teste, O6 Recomeçar do zero, O7 Fazer o teste de novo, O8 Menu em gaveta (celular), O9 Bandeja de comparação |
| 09 · Fluxos | 8 fluxos navegáveis, Desktop e Celular: Começar o teste · Responder o questionário · Sair e retomar · Entender o resultado · Explorar o perfil e clareza final · Conhecer e comparar profissões · Explorar outras profissões · Histórico e novo teste |
| 10 · Handoff | Infos, Design System, pontos em aberto e 12 seções com marcações numeradas (telas, sobrepostos, responsivo e componentes) |

Códigos das telas: **V1** Abertura (V1.1 retomar) · **V2** Clareza inicial · **V3** Questionário (V3.1 valores, V3.2 preferências, V3.3 habilidades) · **V4** Revisão · **V5** Você concluiu o teste · **V6** Resultado (V6.1 a V6.6: áreas, profissões, valores, preferências, habilidades e próximos passos) · **V7** Conheça a profissão · **V8** Explorar profissões · **V9** Comparar · **V10** Histórico · **V11** Página Inicial.

Pontos em aberto registrados no handoff: revisão especializada do catálogo e das justificativas antes do piloto, fonte de dados de conteúdos e eventos, e Universidades, Meu Plano e Favoritos fora desta etapa.

## A jornada

O visual reproduz as 14 telas de referência do Figma (página “Teste Vocacional - Geniex”), exportadas em `public/teste-vocacional/` (fora do build). As artes foram recortadas dessas telas e ficam em `public/voc/ref/`.

| Etapa | Referência | O que acontece | PRD |
| --- | --- | --- | --- |
| Abertura | Frame 3 | Finalidade, benefícios, duração, “Começar teste agora” e aviso de confidencialidade. Retoma um teste interrompido. | §5.2 |
| Clareza inicial | (padrão dos Frames 2 e 1) | Tela “Antes de começar” com a pergunta de clareza (1 a 5), no mesmo layout das perguntas. Opcional. | §5.3 |
| Questionário | Frames 2, 1, 4 e 5 | 52 perguntas em 4 etapas, uma por vez: etapas de 1 a 5, barra “X de 52”, ilustração, carinhas na escala, pares com ilustração, painel “O que são…” e anel de progresso do bloco. Salva e retoma. | §5.4 |
| Revisão | — | Só aparece se faltar resposta obrigatória: mostra o que falta e permite editar. | §5.4, §6.2 |
| Você concluiu o teste! | Frame 6 | Processamento com estado compreensível e “Enquanto isso…”. | §5.5 |
| Resultado · Visão geral | Frame 7 | Radar RIASEC, principais interesses, resumo do perfil e profissões recomendadas. | §5.6 |
| Áreas de interesse | Frame 8 | Perfil RIASEC, código de 3 letras e as 6 dimensões com personagens e detalhes. | §5.6 |
| Profissões recomendadas | Frame 9 | 6 profissões com fotos e painel lateral (o que faz, por que combina, atividades). | §5.7 |
| Conheça a profissão | Frame 10 | Foto, 7 abas, dimensões RIASEC, vídeo, mercado, próximos passos e relacionadas. | §5.8 |
| Valores · Preferências · Habilidades | Frames 11, 12 e 13 | Ranking dos valores, estilo de trabalho e ambientes, habilidades percebidas e como aparecem nas profissões. | §5.6 |
| Próximos passos | Frame 14 | Plano de desenvolvimento, “Seu futuro é uma jornada”, conteúdos e eventos, e a clareza final. | §5.11, §5.12 |
| Explorar profissões, Comparar, Histórico | — | No mesmo padrão visual, a partir do resultado e da página da profissão. | §5.9, §5.13 |

### Onde o protótipo difere das referências (de propósito)

- **Sem ranking nem “afinidade”:** as profissões não são numeradas e os selos “Alta/Média afinidade” viram “Vale a pena explorar” e “Possibilidade complementar” (PRD §5.7 e metodologia §8). Os rótulos ficam em `CATEGORIA`, no `motor.ts`.
- **Sem percentual:** “Alinhamento de valores 85%” (Frame 11) virou “X de 3” valores em comum.
- **Preferências:** o instrumento usa escolhas entre dois lados (metodologia §5), então o “estilo de trabalho” mostra para que lado cada par pendeu, em vez de níveis de 1 a 5.
- **Textos do instrumento:** perguntas e escalas seguem a `METODOLOGIA.md`, não os textos de exemplo dos frames.
- **Clareza antes e depois:** não aparece nos frames; entrou porque o PRD a exige (§5.3 e §5.12). A inicial é uma tela no mesmo padrão das perguntas; a final, uma janela com a mesma escala.
- **Fora desta etapa:** Universidades, Meu Plano e Favoritos não entram na jornada agora (decisão de produto). Saíram as telas, os corações de favorito, “Adicionar ao plano”, “Salvar no Meu Plano” e o bloco “Universidades em destaque” do Frame 14.
- **Menu lateral:** segue a GenieX em produção (Página Inicial; Aprenda: Estudar, Biblioteca, Cronograma, Instituição, Genie Bot; Funcionalidades: Simulados, Redação) com o item novo **Teste Vocacional**. O menu dos frames (Explorar Profissões, Universidades, Conteúdos, Meu Plano, Favoritos) não foi usado. Logo oficial: `geniex-light.svg`.

## Atalhos de fluxo

Cada atalho abre o protótipo direto numa etapa, com os dados prontos para demonstrar (`#/p/teste-vocacional?screen=<atalho>`):

| Atalho | O que mostra |
| --- | --- |
| `entrada` | Abertura do teste (Frame 3) |
| `clareza` | Tela “Antes de começar” com a pergunta de clareza |
| `questionario`, `q-valores`, `q-preferencias`, `q-habilidades` | Primeira pergunta de cada etapa (Frames 2, 1, 4 e 5) |
| `retomar` | Abertura com um teste interrompido em 23 de 52 |
| `revisao` | Revisão com 2 respostas obrigatórias faltando |
| `processando` | “Você concluiu o teste!” (Frame 6) |
| `relatorio`, `areas`, `recomendacoes`, `res-valores`, `res-preferencias`, `res-habilidades`, `passos` | Cada aba do resultado (Frames 7, 8, 9, 11, 12, 13 e 14) |
| `clareza-pos` | “Como você se sente agora?”, com a resposta inicial marcada |
| `carreira` | Conheça a profissão: Cientista de Dados (Frame 10) |
| `explorar`, `comparar`, `historico`, `inicio` | Explorar profissões, Comparar, Histórico de testes e Página Inicial |

## Para apresentar

- **Atalho do protótipo no questionário:** “Preencher etapa (atalho do protótipo)” responde a etapa atual com as respostas da persona (João Silva, perfil I · A · E como nos frames).
- **Teclado:** teclas 1 a 5 nas escalas, 1 e 2 nos pares, ← → para navegar.
- **Menu lateral:** o botão ao lado da busca recolhe e expande o menu (só ícones). Ele abre expandido a partir de 1200 px, recolhido no tablet (768 a 1199 px) e vira gaveta abaixo de 768 px, como na Gamificação GenieX.
- **Sair e retomar:** “Sair do teste” guarda as respostas; a abertura mostra “Continue de onde parou”.
- **Transparência:** “Entenda o modelo” e “Como chegamos a este resultado” explicam soma, código, comparação e diversidade.
- **Eventos de produto:** o botão “Eventos” lista em tempo real os eventos do PRD (§9.3), sem dados pessoais.
- **Sem conexão:** desligar a rede do navegador mostra o aviso de que as respostas ficam guardadas no dispositivo.

## Núcleo do teste

Separado da interface, como pede o PRD (§5.5 e §10.5), em `src/prototypes/teste-vocacional/`:

- **`instrumento.ts`:** as 52 perguntas da metodologia, escalas, etapas e versão (`TV-GX 1.0 · piloto`). O Bloco A é exibido intercalando as dimensões, para o estudante não responder cinco itens seguidos da mesma área.
- **`carreiras.ts`:** catálogo inicial com 32 profissões de 8 áreas (graduações, cursos técnicos e tecnólogos, incluindo profissões pouco conhecidas), perfil de referência RIASEC, contexto de trabalho, valores, formações, ingresso obrigatório × desejável, desafios, relacionadas, fontes e data de revisão. Conteúdo ilustrativo, pendente de revisão especializada.
- **`motor.ts`:** soma por dimensão (5 a 25), normalização 0 a 100, até três pistas com empates preservados, perfil distribuído e inconclusivo; recomendação por distância ponderada (wₖ = 1 + Sₖ/100) com diversidade (no máximo 2 por dimensão principal e por área, ao menos uma pouco conhecida), categorias “Vale a pena explorar” e “Possibilidade complementar” e justificativas ligadas às respostas registradas. Sem percentual de compatibilidade.
- **`dados.ts`:** respostas fictícias da persona do protótipo.

## Estrutura

```
src/prototypes/teste-vocacional/
  instrumento.ts, carreiras.ts, motor.ts, dados.ts   # núcleo, sem interface
  store.tsx       # estado (tentativas, comparação, eventos)
  index.tsx       # shell da GenieX (menu, busca, perfil), bandeja de comparação, painel de eventos
  components/     # ui (botões, modal, avisos, anel), perfil (radar, card de profissão), clareza
  screens/        # Inicial, Entrada, Clareza, Questionario, Revisao, Processando, Relatorio (7 abas),
                  # Carreira, Explorar, Comparar, Historico
  voc.css         # estilos (prefixo tv-) reproduzidos das telas de referência
```

Artes recortadas das telas de referência em `public/voc/ref/` (nos banners do resultado, a sobra de texto da referência foi limpa e a borda curva original preservada). Ícones 3D extras: [Microsoft Fluent Emoji](https://github.com/microsoft/fluentui-emoji) (licença MIT), em `public/voc/`.
