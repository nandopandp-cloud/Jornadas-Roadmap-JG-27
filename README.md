# Jornada: Lojinha (Exploradores)

Protótipo navegável da **Lojinha** da plataforma dos Exploradores, onde o estudante troca os pontos do Clube Jovens Gênios por itens digitais e recompensas físicas, parte do Roadmap 2027 da Jovens Gênios. Esta branch trata só desta jornada; a visão geral da plataforma e das demais jornadas está no README da branch `main`.

- **Link público:** https://jornadas-roadmap-jg-27.vercel.app/#/p/lojinha
- **Na plataforma:** https://jornadas-roadmap-jg-27.vercel.app/#/jornada/lojinha
- **Código:** `src/prototypes/lojinha/`
- **Telas de referência:** `public/lojinha/` · **Artes usadas:** `public/loja/`
- **Áudio:** não usa (sem narração nem ElevenLabs).

## O que dá para fazer

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
npm run dev      # http://localhost:5173 → abra #/p/lojinha
npm run build    # gera dist/
```
