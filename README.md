# Jornada: Login simplificado (Exploradores + Admins)

Iniciativa transversal do Roadmap 2027 da Jovens Gênios para que estudantes do Ensino Fundamental I, especialmente os que ainda estão se alfabetizando, entrem no Exploradores sem depender de e-mail e senha. Esta branch trata só desta jornada; a visão geral da plataforma e das demais jornadas está no README da branch `main`.

- **PRD completo:** [`PRD.md`](PRD.md)
- **Figma (em construção):** https://www.figma.com/design/bYkRkW17RbzT4OLxAnwxfn/Login-Simplificado
- **Navegável de referência (baixa fidelidade):** [aluno](https://pseudo-false-45369828.figma.site/#aluno) · [admin](https://pseudo-false-45369828.figma.site/#admin)
- **Status:** discovery e desenho das telas no Figma; protótipo navegável nesta plataforma ainda não iniciado.

## A jornada em duas pontas

### Exploradores: entrada do estudante

A tela de acesso oferece três caminhos, com destaque para os dois primeiros:

| Método | Como funciona |
| --- | --- |
| **Ler meu QR Code** | O estudante mostra a carteirinha para a câmera; a leitura é validada no servidor. Se a câmera falhar, dá para trocar de método. |
| **Usar meu código de ícones** | O estudante toca, na ordem da carteirinha, numa sequência de ícones espaciais (foguete, planeta, estrela, lua…). Pode conferir, apagar e limpar antes de entrar. |
| **E-mail e senha** | O login de sempre continua disponível, sem exigir carteirinha. |

Depois da validação, uma confirmação curta leva o estudante à sua área. Erros orientam a próxima ação sem detalhes técnicos.

### Admins: gestão da credencial

A gestão fica dentro do cadastro existente do estudante, sem criar outra conta:

- **Lista de alunos:** colunas de status da credencial e de permissão de acesso, independentes entre si, mais filtros.
- **Detalhe do aluno → aba “Credencial de acesso”:** carteirinha (QR Code + sequência de ícones), datas de emissão e último acesso, métodos habilitados e histórico.
- **Ações separadas:** emitir, reemitir (invalida a anterior e pede motivo), revogar (só QR Code e ícones) e permitir/bloquear acesso (todos os métodos, inclusive e-mail e senha).
- **Impressão:** carteirinha individual e, se aprovado, em lote por turma.

## Pontos em aberto do PRD

O texto recebido não trouxe três tabelas: colunas propostas da lista (§8.2), matriz de permissões (§13) e eventos sugeridos (§15.3). As decisões pendentes estão na §20 do PRD.
