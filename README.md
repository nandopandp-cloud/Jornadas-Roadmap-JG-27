# Jornada: Relatórios do Teste Vocacional · Educadores

Parte da iniciativa **Orientação Vocacional e Exploração de Carreiras** do Roadmap 2027 da Jovens Gênios. Esta branch trata dos **relatórios do Teste Vocacional na plataforma Educadores**, em **Relatórios › Atividades › Teste Vocacional**: o educador escolhe a escola, acompanha por turma quem concluiu o teste e consulta o perfil vocacional de cada estudante. A jornada do estudante, que responde ao teste na GenieX, está na branch [`teste-vocacional-geniex`](https://github.com/nandopandp-cloud/Jornadas-Roadmap-JG-27/tree/teste-vocacional-geniex). A visão geral da plataforma e das demais jornadas está no README da branch `main`.

- **PRD da iniciativa:** [`PRD.md`](PRD.md)
- **Metodologia do teste:** [`METODOLOGIA.md`](METODOLOGIA.md)
- **Figma · referência:** página “Teste Vocacional - Educadores” do arquivo [Campeonato GenieX (conceito)](https://www.figma.com/design/CFgSTHDpGqyNluCYfHxj7U/CAMPEONATO---GENIEX--CONCEITO-?node-id=99-2). São imagens de conceito: servem de referência, nunca de tela. Cópias em `public/relatorios-teste-vocacional/` (fora do build).
- **Figma · jornada (com as bibliotecas):** https://www.figma.com/design/7zr3xsn26enztIgzasLSkd/Relat%C3%B3rios---Teste-Vocacional
- **Protótipo navegável:** https://jornadas-roadmap-jg-27.vercel.app/#/p/relatorios-teste-vocacional
- **Na plataforma:** https://jornadas-roadmap-jg-27.vercel.app/#/jornada/relatorios-teste-vocacional
- **Status:** navegável pronto para validação. Se aprovado, as telas serão construídas no Figma da jornada, no mesmo processo das outras jornadas (capa, compostos, Desktop, Tablet, Celular, sobrepostos, fluxos e handoff).

## A jornada

| Tela | Referência | O que mostra | PRD |
| --- | --- | --- | --- |
| **Escolas** | — (padrão dos demais relatórios do Educadores) | Entrada do relatório: indicadores da rede (estudantes do EM, concluídos, em andamento, não iniciados), busca e exportação, e a tabela de escolas com turmas, estudantes, testes concluídos (número, % e barra), em andamento, não iniciados, última atualização e “Ver turmas”. | ajuste da validação |
| **Listagem de estudantes** | Frame 15 | Seletor de turma, busca por nome, 4 indicadores operacionais (estudantes, concluídos, em andamento, não iniciados), filtro por status, tabela com status, código RIASEC, principal área de interesse, última atualização e acesso ao relatório. Ordena por nome, status ou data; seleção para exportar; paginação. | §5 |
| **Visão geral** | Frame 16 | Resumo do perfil (código RIASEC e principal área), radar e pontuação das 6 áreas (0 a 100), principais destaques (interesses, valores, preferências e habilidades) e profissões em destaque. | §6.1, §6.2 |
| **Áreas de interesse (RIASEC)** | Frame 17 | As 6 áreas com pontuação, descrição e exemplos de atividades; as 3 maiores ficam destacadas, sem esconder as demais. | §6.3 |
| **Profissões recomendadas** | Frame 18 | “Vale a pena explorar” e “Possibilidade complementar”, com foto ou ícone, letras RIASEC, descrição e por que aparece. Cada profissão abre um painel com a justificativa, o dia a dia, as competências e as formações. | §6.4 |
| **Valores** | Frame 19 | Os 8 valores com nota de 1 a 5 e barra; os 3 com maiores notas em destaque (empates são avisados). | §6.5 |
| **Preferências** | Frame 20 | As 6 escolhas entre dois contextos, com a opção escolhida e a que ficou de fora, e uma leitura par a par. | §6.6 |
| **Habilidades** | Frame 21 | Autoavaliação das 8 habilidades (1 a 5), as que o estudante quer desenvolver e os principais destaques. | §6.7 |
| **Síntese do perfil** | Frame 22 | Perfil em destaque, principais resultados, síntese interpretativa gerada só das respostas e “Como o professor pode apoiar”. | §6.8 |

Estudantes em andamento ou não iniciados aparecem na listagem, mas sem relatório (RN01): a ação fica desabilitada e o status em andamento mostra quantas respostas já foram dadas.

## Atalhos de fluxo

Cada atalho abre o protótipo direto numa tela (`#/p/relatorios-teste-vocacional?screen=<atalho>`):

| Atalho | O que mostra |
| --- | --- |
| `escolas` | Escolas da rede (tela inicial da jornada) |
| `lista` · `concluidos` · `andamento` · `nao-iniciados` | Listagem da turma EMMAT3A (E.E. Professora Maria José de Andrade), com e sem filtro de status |
| `busca` · `outra-turma` | Busca por nome · listagem da EMMAT3B |
| `visao` · `areas` · `profissoes` · `valores` · `preferencias` · `habilidades` · `sintese` | Cada aba do relatório da Ana Beatriz Souza |
| `profissao` | Painel de detalhe da primeira profissão recomendada |
| `exportar` | Menu “Exportar relatório” aberto |
| `sem-dado` | Estudante que concluiu sem responder à pergunta opcional de habilidades a desenvolver (RN02) |

## Como os dados são gerados

O navegável usa o mesmo núcleo do teste do estudante (`src/prototypes/teste-vocacional/`): as 52 perguntas do instrumento TV-GX 1.0, o cálculo RIASEC e o motor de recomendação REC 1.0 com o catálogo de profissões. Cada estudante fictício concluído tem respostas completas; perfil, código, profissões e síntese são calculados a partir delas. Assim, o relatório mostra exatamente o que o estudante veria e nada aparece sem resposta registrada (critério de aceite §8).

- **Escolas:** 6 escolas e 13 turmas do Ensino Médio, 450 estudantes, com níveis de realização bem diferentes (de 0% a 86% de concluídos).
- **Turmas da escola de referência:** EMMAT3A (48 estudantes: 25 concluídos, 14 em andamento, 9 não iniciados, como na referência), EMMAT3B (32) e EMMAT2A (20).
- **Ana Beatriz Souza:** respostas montadas para o perfil da referência (I · S · A), com os valores, as preferências e as habilidades das telas.

## Onde o protótipo difere das referências (de propósito)

- **Pontuações múltiplas de 5:** pela fórmula da metodologia, ((soma − 5) / 20) × 100, cada área só pode valer 0, 5, 10… 100. As notas 92 e 88 da referência não são possíveis; a Ana fica com Investigativo 90, Social 85 e Artístico 80.
- **Profissões do motor, não da imagem:** a referência mostra Cientista de Dados e Desenvolvedor(a) de Software. O PRD exige seguir o mecanismo de recomendação e o catálogo (RN05); para o perfil I · S · A da Ana, o motor sugere Psicólogo(a), Médico(a), Pesquisador(a) Científico(a) e Professor(a) da Educação Básica para explorar, e Arquiteto(a) e Designer de Produto como complementares.
- **Categorias:** “Vale a pena explorar” e “Possibilidade complementar”, as duas definidas na metodologia e no motor. “Outra possibilidade” fica de fora até ser validada.
- **Sem traços de personalidade:** o bloco “Principais características” da referência (“Colaborativa”, “Dinâmica”) virou “O que as escolhas indicam”, uma leitura par a par das preferências, sem adjetivos que o instrumento não mede (RN10 e metodologia §9).
- **Sem pronomes de gênero:** os textos gerados usam o nome do estudante ou frases sem pronome.
- **Ensino Médio:** a referência usa uma turma de 8º ano; o teste é para o Ensino Médio, então as turmas são da 2ª e da 3ª série.
- **Título da listagem:** segue o PRD (“Relatórios do Teste Vocacional”), não o da imagem.
- **Lugar no menu e tela de escolas (validação de 09/11):** o relatório fica em Relatórios › Atividades › Teste Vocacional, e não em Institucionais › Turmas como na referência. Antes da listagem de estudantes há a tela de escolas, como nos demais relatórios; o caminho de navegação é Início / Relatórios / Atividades / Teste Vocacional / escola / estudante.
- **Versão registrada:** o cabeçalho do relatório mostra a versão do instrumento e das regras (RN06).
- **Exportar e ⋮:** a listagem exporta a planilha da turma ou os relatórios em PDF (todos ou os selecionados); o relatório exporta o PDF completo ou a síntese de uma página. O menu ⋮ de cada linha abre ou exporta o relatório.

## Estrutura

```
src/prototypes/relatorios-teste-vocacional/
  dados.ts    # turmas, estudantes e respostas fictícias (resultados calculados pelo motor do teste)
  index.tsx   # casca Educadores, listagem, relatório em 7 abas, painel da profissão, exportação
  rtv.css     # estilos (prefixo rv-), com a casca da Gamificação Educadores como base
public/rtv/                         # foto da Ana Beatriz (recortada da referência e ampliada com Real-ESRGAN)
public/relatorios-teste-vocacional/ # frames de referência (fora do build)
```

Os ícones 3D vêm de `public/voc/` e `public/3d/` (Microsoft Fluent Emoji, licença MIT).
