# Plugin Perto Digital · Acessibilidade no Prepara SP

Protótipo navegável do plugin de acessibilidade na plataforma **Prepara SP**. A iniciativa **não** aparece na plataforma de jornadas: esta branch gera um link próprio.

**Acesse:** https://plugin-perto-digital-jg.vercel.app

## A jornada

1. **Login.** O estudante entra no Prepara SP com e-mail e senha. O botão de acessibilidade já fica disponível nesta tela.
2. **Modal "Uma experiência mais personalizada para você!"** A plataforma identifica que alguns recursos podem ajudar o estudante e apresenta três benefícios: *Mais foco*, *Mais conforto na leitura* e *Uma navegação no seu ritmo*.
3. **Ativar recursos agora.** Cada benefício recebe o seu check e o modal fecha.
4. **Página inicial já acessível.** A máscara e o guia de leitura entram ligados. Os atalhos **Acessibilidade**, **Libras** e **Navegação por face** aparecem à direita, e uma dica explica o que mudou.

Se o estudante escolher **Agora não**, a página inicial abre normalmente, só com o botão de acessibilidade.

## Recursos que funcionam de verdade

| Recurso | O que faz |
| --- | --- |
| Máscara de leitura | Escurece a tela e deixa em destaque só a faixa em que o estudante está lendo. A faixa acompanha o mouse, o toque ou o rosto. |
| Guia de leitura | Uma régua amarela que acompanha o cursor. |
| Libras | Abre o **VLibras**, o widget oficial do Governo Federal. Ao clicar em um texto, o intérprete traduz. |
| Navegação por face | Usa a câmera e o MediaPipe Face Landmarker. A cabeça move o cursor. Para clicar, basta parar sobre um botão por 1,2 s ou abrir a boca. Levar o cursor à borda rola a página. A imagem é processada só no navegador. |
| Leitor de texto | Ao clicar em um texto, ele é lido em voz alta (voz pt-BR do navegador). |
| Tamanho do texto | De 100% a 150%, escalando toda a interface. |
| Fonte legível, espaçamento, alto contraste, escala de cinza, destaque de links, cursor ampliado e pausar animações | Ajustes aplicados na hora em toda a plataforma. |
| Perfis rápidos | Ligam um conjunto de recursos de uma vez: *Mais foco*, *Mais conforto na leitura* e *Uma navegação no seu ritmo*, os mesmos benefícios do modal. |
| Atalhos de teclado | <kbd>Alt</kbd> + <kbd>A</kbd> abre o painel, <kbd>Alt</kbd> + <kbd>M</kbd> liga e desliga a máscara e <kbd>Esc</kbd> fecha. |

## Atalhos de tela

Para apresentar um ponto específico da jornada sem refazer o caminho todo:

| Link | Abre em |
| --- | --- |
| `#/` | Login |
| `#/?screen=modal` | Página inicial com o modal |
| `#/?screen=home-acessivel` | Página inicial com os recursos já ativados |
| `#/?screen=home` | Página inicial sem os recursos (o estudante clicou em "Agora não") |
| `#/?screen=painel` | Painel de acessibilidade aberto |
| `#/?screen=navegacao-face` | Apresentação da navegação por face |

## Detalhes

- **Código:** `src/prototypes/plugin-perto-digital`.
  - `index.tsx`: a jornada;
  - `login.tsx`;
  - `home.tsx`: página inicial e modal;
  - `a11y.tsx`: estado dos recursos;
  - `recursos.tsx`: máscara, guia, leitor, atalhos e painel;
  - `libras.ts`: VLibras;
  - `face.tsx`: navegação por face;
  - `pd.css`.
- **Artes:** em `public/ppsp`, recortadas das telas de referência. O escurecimento da captura foi removido para recuperar as cores originais.
- **Responsivo:** desktop, tablet e celular. No celular, o menu vira gaveta, o painel vira folha inferior e os atalhos ficam no canto de baixo.
- **Dados fictícios:** recarregar a página reinicia o protótipo. Qualquer e-mail válido e qualquer senha entram.
- **Publicação:** esta branch abre direto o protótipo (`src/main.tsx`) e é publicada num projeto separado da Vercel (`plugin-perto-digital-jg`), fora da plataforma de jornadas.
- **Navegação por face:** precisa de um navegador com câmera e WebGL. Na primeira vez, o navegador pede permissão para usar a câmera.
