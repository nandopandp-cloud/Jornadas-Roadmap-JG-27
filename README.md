# Jornada: Login simplificado · Admins

Gestão das credenciais simplificadas dos estudantes no Admins, parte da iniciativa **Login simplificado** do Roadmap 2027 da Jovens Gênios. Esta branch trata só da jornada do **Admins**. A entrada do estudante no Exploradores fica na branch `login-simplificado`. A visão geral da plataforma e das demais jornadas está no README da branch `main`.

- **PRD completo (Exploradores + Admins):** [`PRD.md`](PRD.md) · trechos desta jornada: §4.3–4.5, §6.1, §8, §9, §10, §11, §13
- **Figma:** https://www.figma.com/design/bYkRkW17RbzT4OLxAnwxfn/Login-Simplificado. Telas A1–A8 nas páginas 05 (Desktop 1440), 06 (Tablet 1024) e 07 (Celular 390), diálogos e avisos (O1–O8, T1–T5) na página 08, protótipo nos fluxos 7–12 da página 09 e handoff nas seções 6–11 da página 10.
- **Design System:** Global Design System (tema Admins), com a Sidebar - Admins real e ícones Lucide.
- **Link público:** https://jornadas-roadmap-jg-27.vercel.app/#/p/login-admin
- **Na plataforma:** https://jornadas-roadmap-jg-27.vercel.app/#/jornada/login-admin
- **Código:** `src/prototypes/login-admin/` (+ carteirinha compartilhada em `src/prototypes/login-comum/`)
- **Status:** Figma concluído (telas, componentes, protótipo, handoff e auditoria) e protótipo navegável publicado.

## A jornada

A gestão fica dentro do cadastro existente do estudante, sem criar conta ou cadastro paralelo.

| Tela | O que mostra |
| --- | --- |
| **A1 · Lista de estudantes** | Colunas novas de credencial (Ativa, Não emitida, Revogada), permissão (Permitida, Bloqueada), métodos habilitados e último acesso, com filtros por credencial, permissão, escola e turma. |
| **A2 · Seleção em lote** | Barra para imprimir carteirinhas e emitir credenciais de vários estudantes (se o lote entrar no MVP). |
| **A3 · Credencial ativa** | Aba “Credencial de acesso”: status independentes, carteirinha sem QR Code nem sequência (só aparecem na impressão), datas de emissão e reemissão, métodos habilitados, ações e histórico. |
| **A4 · Sem credencial** | Estado vazio com “Emitir credencial”. |
| **A5 · Credencial revogada** | QR Code e ícones param; e-mail e senha continuam. |
| **A6 · Acesso bloqueado** | Nenhum método entra; alerta com responsável, data e motivo. |
| **A7 · Perfil Leitor** | Consulta sem poder emitir, reemitir, revogar, bloquear ou imprimir. |
| **A8 · Histórico de tentativas** | Data, evento, método, dispositivo e resultado, sem expor sequência, QR Code ou senha. |

Diálogos (página 08): emitir, reemitir com motivo, revogar e bloquear com o quadro do que muda, permitir de novo, imprimir carteirinha, emissão em lote (confirmação e resultado com pendência) e avisos de confirmação e erro.

## Atalhos de fluxo

Use `#/p/login-admin?screen=<fluxo>` para abrir direto numa tela:

| Fluxo | Tela |
| --- | --- |
| `lista` · `lote` | Lista de estudantes (padrão) · seleção em lote |
| `ativa` · `sem` | Credencial ativa (Ana Clara) · sem credencial (Laura) |
| `emitir` · `reemitir` · `imprimir` | Diálogos de emitir, reemitir com motivo e imprimir |
| `revogada` · `bloqueado` | Credencial revogada (Mariana) · acesso bloqueado (Théo) |
| `leitor` | Mesma tela vista por um perfil Leitor |
| `historico` | Histórico de tentativas de acesso |

Tudo é navegável: as ações mudam o status na lista e no detalhe, entram no histórico e mostram avisos de confirmação. Na emissão em lote, a Sofia fica pendente na primeira tentativa para mostrar a falha parcial (RN17). O menu do usuário na sidebar alterna entre Gestor e Leitor. O estado fica em memória: recarregar reinicia o protótipo.

## Fluxos do protótipo (Figma, página 09)

7. Emitir credencial · 8. Reemitir e imprimir carteirinha · 9. Revogar credencial · 10. Bloquear e permitir acesso · 11. Emitir credenciais em lote · 12. Histórico e perfil Leitor

## Componentes da jornada

Carteirinha de acesso, Cabeçalho do estudante, Bloco de status, Método de acesso, Ação da credencial, Evento do histórico, Linha e Cartão de estudante, Linha e Item de tentativa, Barra de ações em lote, Barra superior (celular), Cabeçalho do diálogo, Nota informativa, Linha de impacto, Item de checagem, Estudante do lote, Aviso informativo e Estado vazio da credencial (página 04 do Figma).

## Pontos em aberto

- O texto do PRD veio sem as colunas propostas da lista (§8.2) e sem a matriz de permissões Administrador / Editor / Leitor (§13). As telas usam uma proposta.
- Emissão automática ou manual para novos cadastros, emissão em lote no MVP e habilitação dos estudantes já cadastrados (§20.1, §20.2 e §20.7).
- Comportamento das sessões abertas após bloqueio e formato da carteirinha impressa (§20.5 e §20.9).
