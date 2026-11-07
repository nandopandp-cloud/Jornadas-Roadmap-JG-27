# Jornada: Gestão das Lojinhas (Admin)

Protótipo navegável da **gestão da Lojinha no Admin da Jovens Gênios**, usado pelos times internos para administrar tudo o que envolve a Lojinha das três plataformas: **Exploradores, Educadores e GenieX**. Parte do Roadmap 2027. Esta branch trata só desta jornada; a visão geral da plataforma e das demais jornadas está no README da branch `main`.

- **Link público:** https://jornadas-roadmap-jg-27.vercel.app/#/p/gestao-lojinha
- **Na plataforma:** https://jornadas-roadmap-jg-27.vercel.app/#/jornada/gestao-lojinha
- **Código:** `src/prototypes/gestao-lojinha/`
- **Telas de referência:** `public/gestao-lojinha-admins/` · **Artes usadas:** `public/admin/` (e algumas da Lojinha do estudante, em `public/loja/`)
- **Áudio:** não usa.

## O que dá para fazer

- **Seletor de plataforma e período:** no topo, troca entre Exploradores, Educadores e GenieX (cada uma com catálogo, categorias, resgates e público próprios; em Educadores o público são educadores) e filtra os dados por período (7, 30 ou 90 dias, ou ano letivo).
- **Visão geral:** últimos resgates e itens mais resgatados.
- **Itens:** catálogo com busca e filtros (categoria, raridade, status), seleção em massa (ativar, inativar, excluir), pré-visualização de como o item aparece para o estudante, duplicar, excluir com desfazer, exportar CSV e paginação.
- **Cadastrar e editar item:** nome, categoria, raridade, descrição, pontos, tipo (digital ou física), controle de estoque, limite por estudante, status de publicação, upload de imagem (arrastar e soltar) e pré-visualização ao vivo, com validação.
- **Categorias:** cadastrar e editar em modal, ver itens vinculados, ativar/inativar e excluir (só categorias vazias).
- **Resgates:** filtros por rede, escola, turma e status, busca, alteração de status pelo menu, cancelamento com estorno, registro manual de resgate (com checagem de saldo) e exportação.
- **Detalhes do resgate:** andamento (solicitado → aprovado → enviado → concluído), histórico de ações, observações internas, alterar status e copiar código.
- **Pontos e extrato:** saldo e movimentações de qualquer estudante (créditos, resgates, estornos e ajustes), com filtros, ordenação e exportação.
- **Estudantes:** indicadores, filtros e lista paginada com todos os registros; ativar/inativar e ajustar saldo.
- **Perfil do estudante:** indicadores do período, abas Movimentações, Resgates e Resumo (pontos por mês e por origem) e ajuste manual de saldo com motivo.
- **Configurações:** gerais (status, nome, moeda, validade dos pontos, exibição), regras de pontuação, restrições e limites, aparência (com prévia), notificações e políticas e termos, com aviso de alterações não salvas.

## Atalhos de fluxo

Use `#/p/gestao-lojinha?screen=<fluxo>` para abrir direto numa tela:

| Fluxo | Tela |
| --- | --- |
| `visao` | Visão geral (padrão) |
| `itens` | Catálogo de itens |
| `cadastrar` | Cadastrar item |
| `categorias` | Categorias |
| `resgates` | Resgates |
| `resgate` | Detalhes do resgate |
| `extrato` | Pontos e extrato |
| `estudantes` | Estudantes |
| `estudante` | Perfil do estudante |
| `config` | Configurações |

## Dados

Os dados são fictícios, gerados de forma determinística por plataforma (`data.ts`), para que as tabelas tenham volume real e os números batam com as referências: em Exploradores são 128 itens, 2.846 resgates nos últimos 30 dias e 168.283 estudantes. As primeiras linhas de cada tabela são as das telas de referência. As alterações feitas no protótipo ficam em memória: recarregar a página reinicia.

## Estrutura

```
src/prototypes/gestao-lojinha/
  index.tsx        # shell do Admin (menu lateral, migalhas, cabeçalho com plataforma e período, abas)
  store.tsx        # estado por plataforma (itens, categorias, resgates, ajustes, configurações)
  data.ts          # plataformas, categorias, itens, pessoas, resgates e extratos gerados
  components/      # ui (seletores, menus, modal, paginação, chips), movimentações, utilitários
  screens/         # VisaoGeral, Itens, ItemForm, Categorias, Resgates, ResgateDetalhe, Extrato, Estudantes, EstudantePerfil, Configuracoes
  admin.css
```

## Rodando

```bash
npm install
npm run dev      # http://localhost:5173 → abra #/p/gestao-lojinha
npm run build    # gera dist/
```
