# Jornada: Cronograma de Uso (Educadores)

Protótipo navegável da **Plataforma Educadores** para gestores de rede e escola planejarem o uso da plataforma e para professores receberem as recomendações, parte do Roadmap 2027 da Jovens Gênios. Esta branch trata só desta jornada; a visão geral da plataforma e das demais jornadas está no README da branch `main`.

- **Link público:** https://jornadas-roadmap-jg-27.vercel.app/#/p/cronograma
- **Na plataforma:** https://jornadas-roadmap-jg-27.vercel.app/#/jornada/cronograma
- **Código:** `src/prototypes/cronograma/`
- **Telas de referência:** `public/cronograma de uso/` · **Artes usadas:** `public/cron/`
# Jornada: Lojinha (Exploradores)

Protótipo navegável da **Lojinha** da plataforma dos Exploradores, onde o estudante troca os pontos do Clube Jovens Gênios por itens digitais e recompensas físicas, parte do Roadmap 2027 da Jovens Gênios. Esta branch trata só desta jornada; a visão geral da plataforma e das demais jornadas está no README da branch `main`.

- **Link público:** https://jornadas-roadmap-jg-27.vercel.app/#/p/lojinha
- **Na plataforma:** https://jornadas-roadmap-jg-27.vercel.app/#/jornada/lojinha
- **Código:** `src/prototypes/lojinha/`
- **Telas de referência:** `public/lojinha/` · **Artes usadas:** `public/loja/`
- **Áudio:** não usa (sem narração nem ElevenLabs).

## O que dá para fazer

- **Como criar:** o gestor escolhe entre **Criar na plataforma** ou **Usar planilha (CSV)**.
- **Criar na plataforma (4 etapas):** definir o escopo (anos de 1º ao 9º, escolas e turmas, vínculo automático de educadores) → configurar programações com aplicação em massa (componente, unidade temática, objeto de conhecimento, habilidade, período, turmas) → revisar e ajustar pendências, inclusive **escolher manualmente os educadores** por escola e ano → finalizar e publicar ou agendar.
- **Volume alto:** busca e seleção em massa de escolas e turmas (turmas no formato “801 - Turma A”), cronograma sempre com os 12 meses do ano letivo, mostrando só os meses com atividades, e duplicar programação para outro mês.
- **Usar planilha (CSV):** lista de escolas da rede → importar CSV (arrastar e soltar, modelo oficial, arquivo de exemplo) → análise animada → revisão das inconsistências (aceitar, escolher outra correspondência ou manter) → revisão por mês (filtros, busca, editar, excluir com desfazer, nova atividade) → resumo e publicação.
- **Exportar:** planilha no formato do modelo, uma linha por turma (rede, escola, ano, turma, educador e currículo).
- **Calendário escolar:** grade mensal com atividades agendadas e sugeridas, painel do dia, filtros e visão em tabela.
- **Professor:** troque o perfil clicando no usuário (rodapé do menu): início com recomendações, criar atividade/avaliação, minicalendário e próximos eventos.

## Atalhos de fluxo

Use `#/p/cronograma?screen=<fluxo>` para abrir direto numa tela:

| Fluxo | Tela |
| --- | --- |
| `lista` | Escolas da rede (padrão) |
| `escolha` | Como criar |
| `escopo` | Plataforma: escopo |
| `configurar` | Plataforma: programação |
| `ajustar` | Plataforma: revisar |
| `finalizar` | Plataforma: publicar |
| `importar` | Planilha: importar CSV |
| `inconsistencias` | Inconsistências |
| `revisar` | Revisar cronograma |
| `publicar` | Publicar |
| `calendario` | Calendário escolar |
| `professor` | Visão do professor |
- **Loja:** banner de boas-vindas, 6 categorias (Avatares, Backgrounds, Pets, Cards, Personalização, Recompensas exclusivas) e destaques.
- **Categoria:** filtros por raridade com contagem (Comum, Raro, Épico, Lendário), ordenação e grade animada; 24 trajes de avatar.
- **Detalhe e resgate:** galeria com setas, miniaturas e arrastar; favoritar; confirmação com a conta do saldo; presente abrindo com confete; gemas voando até o saldo no topo; item digital liberado em alguns segundos (com notificação) e “Usar como avatar”; aviso de pontos insuficientes; itens físicos com entrega na escola.
- **Meu Cartão:** cartão fidelidade com inclinação 3D e verso com QR Code; saldo, QR Code e copiar ID.
- **Histórico:** filtros por tipo e período, entradas e saídas. **Meus Resgates:** tabela com status e painel com linha do tempo. **Regras:** 7 tópicos.
- **Topo:** saldo animado, notificações e troca de avatar.

## Atalhos de fluxo

Use `#/p/lojinha?screen=<fluxo>` para abrir direto numa tela:

| Fluxo | Tela |
| --- | --- |
| `loja` | Loja (padrão) |
| `avatares` | Avatares |
| `item` | Detalhe e resgate |
| `cartao` | Meu Cartão |
| `historico` | Histórico |
| `resgates` | Meus Resgates |
| `regras` | Regras |

O atalho “Loja” começa antes do resgate do Traje Explorador (saldo 245.800); Meu Cartão, Histórico e Meus Resgates já mostram o traje resgatado, como nas referências.

## Estrutura

```
src/prototypes/cronograma/
  index.tsx        # shell (menu lateral, migalhas, transições)
  store.tsx        # estado (escolas, plano em construção, vínculos, publicação)
  data.ts          # escolas, educadores, tipos de atividade, CSV de exemplo
  plano.ts         # regras do “Criar na plataforma” (turmas, meses, pendências, exportação)
  components/      # ui, plano (etapas, meses, aplicar para, duplicar), modal de atividade
  screens/         # Lista, Escolha, Escopo, Configurar, Ajustar, Finalizar, Importar, Analise, Inconsistencias, Revisar, Publicar, Calendario, InicioProfessor, InicioGestor
  cron.css
```

src/prototypes/lojinha/
  index.tsx        # shell dos Exploradores (menu lateral 3D, topo, abas)
  store.tsx        # estado (saldo, resgates, histórico, avatar, notificações)
  data.ts          # categorias, itens, regras, movimentações e resgates iniciais
  components/      # ui (selos, pontos, listas, modal, confete), cards de item
  screens/         # Loja, Categoria, Item (galeria e resgate), Cartao, Historico, Resgates, Regras
  loja.css
```

## Artes

Recortadas das telas de referência com **rembg (BiRefNet)**; textos e selos removidos com **LaMa** para serem refeitos em HTML; artes da página de resgate com super-resolução **Real-ESRGAN**.

O estado fica em memória: recarregar a página reinicia o protótipo.

## Rodando

```bash
npm install
npm run dev      # http://localhost:5173 → abra #/p/cronograma
npm run dev      # http://localhost:5173 → abra #/p/lojinha
npm run build    # gera dist/
```
