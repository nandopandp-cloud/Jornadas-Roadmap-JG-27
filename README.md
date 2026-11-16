# Modo Lição · Educadores

Fluxo de **criação de lições** na plataforma Educadores (Criar › Lição). O professor monta uma jornada de aprendizagem em 4 etapas:

1. **Configurações iniciais:** nome da lição, para quem ela vai (escola, ano, turmas e estudantes) e período de realização.
2. **Disciplinas e tópicos:** até 5 disciplinas, com tópicos organizados por unidade temática da BNCC.
3. **Conteúdos dos tópicos:** resumo, vídeo, áudio e o quiz obrigatório de cada tópico.
4. **Mensagem e revisão:** mensagem para os estudantes (editor rico), revisão e publicação.

O estudante faz a lição no Exploradores.

**Protótipo navegável:** https://modo-licao-educadores.vercel.app

> Esta iniciativa **não entra na plataforma de jornadas**. O navegável tem link e projeto Vercel próprios (`modo-licao-educadores`). Nesta branch, o `src/main.tsx` abre direto o protótipo. A plataforma completa está documentada no README da `main`.

## Referências

| O quê | Onde |
| --- | --- |
| PRD | PRD do Modo Lição · Educadores, Etapa 1: fluxo de criação de lições |
| Figma (mapeamento e piloto desktop) | https://www.figma.com/design/ieTkRqY6aFSFcg6llmmxNH. Páginas **00 · Mapeamento** (prints do Exploradores, fluxo, PRD → telas) e **01 · Piloto** (P1–P8) |
| Bibliotecas | Redação - Educadores (Botão, Aba, Campo de busca, Toast), Cronograma de Uso (Campo, Select, Indicador de etapas), Relatórios de Trilhas (Sidebar e tokens), Lucide |
| Código do navegável | `src/prototypes/modo-licao-educadores` (data, index, modais, pecas, lic.css) + casca do kit Educadores (`rgx.css`) |
| Artes | `public/lic`: imagem das pirâmides e capa do vídeo, recortadas dos prints do Exploradores |

## Decisões

- **Etapa 1 enxuta:**
  - só nome (obrigatório, até 255 caracteres), público e período;
  - a **mensagem do educador fica sempre nas últimas etapas** e é opcional;
  - **não existe imagem de capa:** a mensagem é um editor rico, como o componente Tiny usado hoje na plataforma. Nele o educador estiliza o texto (título, negrito, cores, listas, link) e, se quiser, coloca imagens, tudo dentro do próprio campo.
- **Público:**
  - segue a lógica de Tarefas: etapa → anos → escolas → turmas;
  - marcar a turma = todos os estudantes;
  - “Escolher estudantes” abre um drawer para escolher alguns estudantes, ou um só.
- **Período:**
  - data e horário de início e de término;
  - o término precisa ser depois do início e o início não pode ser no passado;
  - com início futuro, a lição fica **agendada**.
- **Disciplinas:**
  - até 5;
  - funcionam como abas e mantêm o que foi escolhido;
  - ao remover uma disciplina e adicionar de novo, os tópicos voltam.
- **Tópicos:**
  - sem limite por disciplina;
  - busca por nome, código BNCC ou descrição;
  - “Ver exemplos de questões” é só consulta. Dali também dá para incluir o tópico na lição.
- **Quiz obrigatório:**
  - entra sozinho em todo tópico selecionado;
  - fica fixo no fim da sequência;
  - não pode ser removido nem mudar de ordem;
  - é 1 por tópico, então não dá para adicionar outro;
  - as questões são sorteadas por estudante a partir do tópico;
  - quando o banco tem menos de 10 questões, aparece o aviso “Poucas questões”, que não bloqueia a publicação.
- **Conteúdos opcionais:**
  - resumo, vídeo e áudio entram antes do quiz e podem ser reordenados arrastando;
  - **Resumo:** da plataforma (com prévia) ou criado pelo professor num editor simples, que aceita colar textos e imagens;
  - **Vídeo:** link do YouTube validado;
  - **Áudio:** link do YouTube ou arquivo MP3/MPEG.
- **Revisão:** cada bloco tem um “Editar” que leva à etapa, e ao lado aparece uma prévia ao vivo de como o estudante vê a lição no Exploradores.

## Atalhos do navegável

`#/?screen=` + `configuracoes` (padrão) · `estudantes` · `topicos` · `exemplos` · `conteudos` · `resumo` · `resumo-autoral` · `video` · `audio` · `revisao` · `publicada` · `zero` (lição em branco).

O botão tracejado **Protótipo**, no canto, alterna entre a lição de exemplo e “Começar do zero”.

## Dados de exemplo

São os mesmos dos prints do Exploradores e do Figma:
- **Lição:** “Conhecendo as pirâmides”, com Matemática (Pirâmides: geometria espacial e suas aplicações; Planificação de prismas e pirâmides, com poucas questões) e História (As pirâmides do Egito), no 6º ano.
- **Público:** EE Jardim das Árvores, com o 6º ano A inteiro (32) e 12 de 30 estudantes do 6º ano B, total de 44 estudantes.
- **Período:** de 23/11/2026, 07:30, a 30/11/2026, 23:59.
- **“Hoje” no protótipo:** 16/11/2026.

## Deploy

```bash
npm run build
cp -R dist/index.html dist/assets dist/lic <pasta-de-deploy>/   # pasta já ligada ao projeto Vercel modo-licao-educadores
vercel deploy --prod --yes
```
