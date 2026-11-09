# Jornada: Login simplificado · Exploradores

Entrada do estudante no Exploradores sem depender de e-mail e senha, parte da iniciativa **Login simplificado** do Roadmap 2027 da Jovens Gênios. Esta branch trata só da jornada do **estudante (Exploradores)**. A gestão das credenciais pelo Admins fica na branch `login-simplificado-admin`. A visão geral da plataforma e das demais jornadas está no README da branch `main`.

- **PRD completo (Exploradores + Admins):** [`PRD.md`](PRD.md) · trechos desta jornada: §4.1–4.2, §6.3, §7, §12.1–12.3, §14, §15
- **Figma:** https://www.figma.com/design/bYkRkW17RbzT4OLxAnwxfn/Login-Simplificado. Telas E1–E15 nas páginas 05 (Desktop 1440), 06 (Tablet 1024) e 07 (Celular 390), protótipo nos fluxos 1–6 da página 09 e handoff nas seções 1–5 e 11 da página 10.
- **Design System:** Yunara (tema Seafoam · Padrão JG), ícones Untitled UI, arte dos exploradores das nações e ícones 3D.
- **Link público:** https://jornadas-roadmap-jg-27.vercel.app/#/p/login-exploradores
- **Na plataforma:** https://jornadas-roadmap-jg-27.vercel.app/#/jornada/login-exploradores
- **Código:** `src/prototypes/login-exploradores/` (+ carteirinha compartilhada em `src/prototypes/login-comum/`) · **Artes:** `public/login/`
- **Status:** Figma concluído (telas, componentes, protótipo, handoff e auditoria) e protótipo navegável publicado.

## A jornada

O estudante escolhe como entrar. Os dois métodos simplificados aparecem em destaque, e e-mail e senha continuam visíveis.

| Método | Como funciona | Telas |
| --- | --- | --- |
| **Ler meu QR Code** | Mostra a carteirinha para a câmera. A leitura só identifica a credencial; a validação acontece no servidor. Se a câmera falhar, dá para trocar de método. | E2–E5 |
| **Usar meu código de ícones** | Toca, na ordem da carteirinha, numa sequência de 6 ícones espaciais (grade de 12). Pode apagar o último ou recomeçar; “Entrar” só habilita com a sequência completa. Após várias tentativas erradas, a entrada pausa. | E6–E10 |
| **E-mail e senha** | O login de sempre, sem exigir carteirinha. | E11–E12 |

Depois da validação (E13), o estudante vê uma confirmação breve com o avatar e entra (E14). “Não é você? Trocar de estudante” evita herdar a sessão em tablets compartilhados. Se a conta estiver bloqueada no Admins, aparece “Seu acesso está pausado” (E15).

## Atalhos de fluxo

Use `#/p/login-exploradores?screen=<fluxo>` para abrir direto numa tela:

| Fluxo | Tela |
| --- | --- |
| `inicio` | Escolha do método (padrão) |
| `camera` · `lendo` | QR Code: ligar a câmera · lendo a carteirinha |
| `semcamera` · `qrinvalido` | Câmera indisponível · QR Code recusado |
| `icones` · `icones-andamento` · `icones-completo` · `icones-erro` | Código de ícones vazio, em andamento, completo e com erro |
| `pausa` | Pausa por tentativas (contagem regressiva) |
| `email` · `email-erro` | E-mail e senha · dados incorretos |
| `validando` · `ola` · `pausado` | Validação · “Oi, Ana Clara!” · acesso pausado |

No protótipo, a carteirinha de exemplo (“Protótipo: ver a carteirinha de exemplo”) mostra a sequência certa: foguete, planeta, estrela, cometa, lua e disco voador. Uma sequência errada desconta tentativas; com 5 erros a entrada pausa. Qualquer e-mail válido com senha de 4 caracteres ou mais entra. O estado fica em memória: recarregar reinicia o protótipo.

## Fluxos do protótipo (Figma, página 09)

1. Entrar com QR Code · 2. QR Code com problema · 3. Entrar com código de ícones · 4. Código de ícones: erro e pausa · 5. Entrar com e-mail e senha · 6. Conta com acesso pausado

## Componentes da jornada

Carteirinha de acesso, Marca Jovens Gênios, Divisor ou, Selo de ilustração, Opção de método, Posição da sequência, Ícone da grade, Grade de ícones, Conferência da sequência e Leitor de QR Code (página 04 do Figma).

## Pontos em aberto

- Tamanho da sequência e conjunto definitivo de ícones, a validar com crianças (PRD §20.3). As telas usam 6 de 12.
- Limite de tentativas e tempo de pausa do código de ícones. As telas usam 5 tentativas e 5 minutos como exemplo.
- Validade do QR Code e política de troca de estudante em dispositivos compartilhados (§20.4 e §20.8).
- Eventos de instrumentação: a tabela §15.3 não veio no texto do PRD. O handoff traz uma proposta.
