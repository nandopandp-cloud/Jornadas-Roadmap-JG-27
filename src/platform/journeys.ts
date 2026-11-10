import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

/**
 * Registro de jornadas da plataforma.
 * Para adicionar um novo protótipo: crie a pasta em src/prototypes/<slug> e registre aqui.
 */
export type PrototypeProps = {
  /** tela inicial opcional (atalho de fluxo) */
  startScreen?: string | null
  /** true quando renderizado dentro da plataforma (iframe) */
  embedded?: boolean
}

export type Journey = {
  slug: string
  name: string
  product: string
  audience: string
  description: string
  icon: string
  accent: string
  status: 'navegavel' | 'em-breve'
  /** branch da jornada no GitHub (padrão: prototipo-<slug>) */
  branch?: string
  /** dispositivo inicial da prévia na plataforma */
  dispositivo?: 'desktop' | 'tablet' | 'mobile'
  /** endereço exibido na moldura do navegador (prévia desktop) */
  dominio?: string
  /** jornada em construção: etapas do playbook (Figma → navegável) */
  etapas?: { nome: string; estado: 'feito' | 'atual' | 'proximo' }[]
  /** links de trabalho (Figma, referências) mostrados enquanto a jornada está em construção */
  links?: { label: string; url: string }[]
  /** atalhos de fluxo: abrem o protótipo direto numa tela */
  flows?: { id: string; label: string; icon: string }[]
  component?: LazyExoticComponent<ComponentType<PrototypeProps>>
}

export const journeys: Journey[] = [
  {
    slug: 'alfabetizacao',
    name: 'Alfabetização',
    product: 'App do Estudante',
    audience: '1º e 2º ano · Ensino Fundamental',
    description:
      'Trilha de letras com narração, desafios de toque e arrastar, conquistas, mural da turma com produção criativa e tarefas enviadas pelo professor.',
    icon: './3d/books.png',
    accent: '#7c3aed',
    status: 'navegavel',
    flows: [
      { id: 'abertura', label: 'Abertura', icon: './3d/sparkles.png' },
      { id: 'avatar', label: 'Avatar', icon: './3d/cat.png' },
      { id: 'home', label: 'Início', icon: './3d/house.png' },
      { id: 'trail', label: 'Trilha ABC', icon: './3d/glowing-star.png' },
      { id: 'tasks', label: 'Tarefas', icon: './3d/clipboard.png' },
      { id: 'mural', label: 'Mural', icon: './3d/picture.png' },
      { id: 'new-production', label: 'Nova Produção', icon: './3d/palette.png' },
      { id: 'achievements', label: 'Conquistas', icon: './3d/trophy.png' },
    ],
    component: lazy(() => import('../prototypes/alfabetizacao')),
  },
  {
    slug: 'cronograma',
    name: 'Cronograma de Uso',
    product: 'Plataforma Educadores',
    audience: 'Gestores e professores',
    description:
      'Gestor cria o cronograma na plataforma ou importa uma planilha CSV com várias escolas; a validação roda em segundo plano enquanto ele navega, depois revisa as inconsistências sugeridas, ajusta as atividades e publica; o calendário escolar é preenchido e os professores recebem as recomendações.',
    icon: './3d/calendar.png',
    accent: '#4c1d95',
    status: 'navegavel',
    dispositivo: 'desktop',
    dominio: 'educadores.jovensgenios.com',
    flows: [
      { id: 'lista', label: 'Escolas da rede', icon: './3d/books.png' },
      { id: 'escolha', label: 'Como criar', icon: './3d/sparkles.png' },
      { id: 'escopo', label: 'Plataforma: escopo', icon: './3d/bullseye.png' },
      { id: 'configurar', label: 'Plataforma: programação', icon: './3d/palette.png' },
      { id: 'ajustar', label: 'Plataforma: revisar', icon: './3d/bulb.png' },
      { id: 'finalizar', label: 'Plataforma: publicar', icon: './3d/rocket.png' },
      { id: 'importar', label: 'Planilha: importar CSV', icon: './3d/clipboard.png' },
      { id: 'analise', label: 'Planilha: validação', icon: './3d/glowing-star.png' },
      { id: 'validando', label: 'Validação em segundo plano', icon: './3d/seedling.png' },
      { id: 'validada', label: 'Validação concluída', icon: './3d/party.png' },
      { id: 'inconsistencias', label: 'Inconsistências', icon: './3d/bulb.png' },
      { id: 'revisar', label: 'Revisar cronograma', icon: './3d/memo.png' },
      { id: 'publicar', label: 'Publicar', icon: './3d/rocket.png' },
      { id: 'calendario', label: 'Calendário escolar', icon: './3d/calendar.png' },
      { id: 'professor', label: 'Visão do professor', icon: './3d/pencil.png' },
    ],
    component: lazy(() => import('../prototypes/cronograma')),
  },
  {
    slug: 'flashcards',
    name: 'Flashcards',
    product: 'GenieX · Plataforma do Estudante',
    audience: 'Ensino Médio',
    description:
      'Estudante escolhe até 5 disciplinas e seus tópicos, gera grupos de flashcards, estuda com “Não sei / Eu sei / Revisar depois”, favorita cards e acompanha o resultado de cada sessão.',
    icon: './3d/bulb.png',
    accent: '#4b55ec',
    status: 'navegavel',
    dispositivo: 'desktop',
    dominio: 'geniex.jovensgenios.com',
    flows: [
      { id: 'inicio', label: 'Página inicial', icon: './3d/house.png' },
      { id: 'landing', label: 'Entrada Flashcards', icon: './3d/sparkles.png' },
      { id: 'disciplinas', label: 'Escolher disciplinas', icon: './3d/books.png' },
      { id: 'topicos', label: 'Escolher tópicos', icon: './3d/memo.png' },
      { id: 'gerando', label: 'Gerando flashcards', icon: './3d/rocket.png' },
      { id: 'grupos', label: 'Meus grupos', icon: './3d/notes.png' },
      { id: 'estudo', label: 'Estudar grupo', icon: './3d/bulb.png' },
      { id: 'resposta', label: 'Resposta revelada', icon: './3d/glowing-star.png' },
      { id: 'concluida', label: 'Sessão concluída', icon: './3d/trophy.png' },
      { id: 'favoritos', label: 'Favoritos', icon: './3d/star.png' },
      { id: 'historico', label: 'Histórico', icon: './3d/calendar.png' },
    ],
    component: lazy(() => import('../prototypes/flashcards')),
  },
  {
    slug: 'lojinha',
    name: 'Lojinha',
    product: 'Exploradores · Plataforma do Estudante',
    audience: 'Estudantes · Clube Jovens Gênios',
    description:
      'Estudante troca pontos por avatares, backgrounds, pets, cards e recompensas físicas; acompanha o cartão fidelidade com QR Code, o histórico de pontos, o status dos resgates e as regras.',
    icon: './3d/gem.png',
    accent: '#029e8f',
    status: 'navegavel',
    dispositivo: 'desktop',
    dominio: 'exploradores.jovensgenios.com',
    flows: [
      { id: 'loja', label: 'Loja', icon: './3d/gem.png' },
      { id: 'avatares', label: 'Avatares', icon: './3d/boy-2.png' },
      { id: 'item', label: 'Detalhe e resgate', icon: './3d/party.png' },
      { id: 'cartao', label: 'Meu Cartão', icon: './3d/crown.png' },
      { id: 'historico', label: 'Histórico', icon: './3d/calendar.png' },
      { id: 'resgates', label: 'Meus Resgates', icon: './3d/clipboard.png' },
      { id: 'regras', label: 'Regras', icon: './3d/memo.png' },
    ],
    component: lazy(() => import('../prototypes/lojinha')),
  },
  {
    slug: 'gestao-lojinha',
    name: 'Gestão da Lojinha',
    product: 'Admin Jovens Gênios',
    audience: 'Times internos · Exploradores, Educadores e GenieX',
    description:
      'Times internos administram a Lojinha das três plataformas: catálogo de itens e categorias, resgates com andamento e estorno, extrato de pontos, estudantes e configurações.',
    icon: './3d/clipboard.png',
    accent: '#1d63ed',
    status: 'navegavel',
    dispositivo: 'desktop',
    dominio: 'admin.jovensgenios.com',
    flows: [
      { id: 'visao', label: 'Visão geral', icon: './3d/bullseye.png' },
      { id: 'itens', label: 'Catálogo de itens', icon: './3d/gem.png' },
      { id: 'cadastrar', label: 'Cadastrar item', icon: './3d/sparkles.png' },
      { id: 'categorias', label: 'Categorias', icon: './3d/books.png' },
      { id: 'resgates', label: 'Resgates', icon: './3d/party.png' },
      { id: 'resgate', label: 'Detalhes do resgate', icon: './3d/memo.png' },
      { id: 'extrato', label: 'Pontos e extrato', icon: './3d/notes.png' },
      { id: 'estudantes', label: 'Estudantes', icon: './3d/girl-2.png' },
      { id: 'estudante', label: 'Perfil do estudante', icon: './3d/boy-2.png' },
      { id: 'config', label: 'Configurações', icon: './3d/crown.png' },
    ],
    component: lazy(() => import('../prototypes/gestao-lojinha')),
  },
  {
    slug: 'login-exploradores',
    branch: 'login-simplificado',
    name: 'Login simplificado · Exploradores',
    product: 'Exploradores · Plataforma do Estudante',
    audience: 'Estudantes do Fundamental I · em fase de alfabetização',
    description:
      'Estudante entra sem digitar e-mail e senha: lê o QR Code da carteirinha pela câmera ou toca, na ordem, nos ícones espaciais do seu código. E-mail e senha continuam disponíveis; erros e pausa por tentativas orientam o próximo passo.',
    icon: './login/icones/foguete.webp',
    accent: '#00a19a',
    status: 'navegavel',
    dispositivo: 'tablet',
    dominio: 'exploradores.jovensgenios.com',
    flows: [
      { id: 'inicio', label: 'Escolha do método', icon: './3d/sparkles.png' },
      { id: 'camera', label: 'QR Code: ligar a câmera', icon: './3d/camera.png' },
      { id: 'lendo', label: 'QR Code: lendo a carteirinha', icon: './login/icones/satelite.webp' },
      { id: 'semcamera', label: 'Câmera indisponível', icon: './3d/locked.png' },
      { id: 'qrinvalido', label: 'QR Code recusado', icon: './3d/bulb.png' },
      { id: 'icones', label: 'Código de ícones', icon: './login/icones/planeta.webp' },
      { id: 'icones-andamento', label: 'Código em andamento', icon: './login/icones/estrela.webp' },
      { id: 'icones-erro', label: 'Sequência errada', icon: './login/icones/cometa.webp' },
      { id: 'pausa', label: 'Pausa por tentativas', icon: './3d/locked.png' },
      { id: 'email', label: 'E-mail e senha', icon: './3d/memo.png' },
      { id: 'validando', label: 'Validação', icon: './login/icones/foguete.webp' },
      { id: 'ola', label: 'Que bom te ver', icon: './3d/party.png' },
      { id: 'pausado', label: 'Acesso pausado', icon: './3d/locked.png' },
    ],
    component: lazy(() => import('../prototypes/login-exploradores')),
  },
  {
    slug: 'login-admin',
    branch: 'login-simplificado-admin',
    name: 'Login simplificado · Admins',
    product: 'Admins Jovens Gênios',
    audience: 'Gestores, administradores e secretarias escolares',
    description:
      'Gestão da credencial simplificada no cadastro do estudante: lista com status de credencial e permissão, emissão (individual e em lote), reemissão com motivo, revogação, bloqueio de acesso, impressão da carteirinha e histórico de tentativas.',
    icon: './3d/clipboard.png',
    accent: '#0265dc',
    status: 'navegavel',
    dispositivo: 'desktop',
    dominio: 'admins.jovensgenios.com',
    flows: [
      { id: 'lista', label: 'Lista de estudantes', icon: './3d/books.png' },
      { id: 'lote', label: 'Seleção em lote', icon: './3d/clipboard.png' },
      { id: 'ativa', label: 'Credencial ativa', icon: './3d/glowing-star.png' },
      { id: 'sem', label: 'Sem credencial', icon: './3d/memo.png' },
      { id: 'emitir', label: 'Emitir credencial', icon: './3d/sparkles.png' },
      { id: 'reemitir', label: 'Reemitir', icon: './3d/bulb.png' },
      { id: 'imprimir', label: 'Imprimir carteirinha', icon: './3d/notes.png' },
      { id: 'revogar', label: 'Revogar: escolher acessos', icon: './3d/pencil.png' },
      { id: 'bloquear', label: 'Bloquear: escolher acessos', icon: './3d/locked.png' },
      { id: 'revogada', label: 'Credencial revogada', icon: './3d/pencil.png' },
      { id: 'bloqueado', label: 'Acesso bloqueado', icon: './3d/locked.png' },
      { id: 'leitor', label: 'Perfil Leitor', icon: './3d/girl-2.png' },
      { id: 'historico', label: 'Histórico de tentativas', icon: './3d/calendar.png' },
    ],
    component: lazy(() => import('../prototypes/login-admin')),
  },
  {
    slug: 'gamificacao-geniex',
    branch: 'gamificacao-geniex',
    name: 'Gamificação GenieX',
    product: 'GenieX · Plataforma do Estudante',
    audience: 'Estudantes do Fundamental II e do Ensino Médio',
    description:
      'Estudante acompanha a própria evolução na GenieX, a partir do perfil: XP válido, elos (Bronze a Cósmico) com progressão e regressão, 25 badges permanentes, extrato de XP com a validade de cada lote e avisos de novo elo, elo alterado e badge desbloqueada.',
    icon: './3d/trophy.png',
    accent: '#5258e4',
    status: 'navegavel',
    dispositivo: 'desktop',
    dominio: 'geniex.jovensgenios.com',
    etapas: [
      { nome: 'Mapeamento das bibliotecas', estado: 'feito' },
      { nome: 'Tela piloto para validação', estado: 'feito' },
      { nome: 'Telas nas 3 larguras', estado: 'feito' },
      { nome: 'Componentes da jornada', estado: 'feito' },
      { nome: 'Protótipo e handoff', estado: 'feito' },
      { nome: 'Navegável', estado: 'feito' },
    ],
    links: [
      { label: 'Figma da jornada', url: 'https://www.figma.com/design/BuFp19bdYy4ycLOk9vXCLH/Gamifica%C3%A7%C3%A3o-Geniex' },
      { label: 'Referência (Campeonato GenieX)', url: 'https://www.figma.com/design/CFgSTHDpGqyNluCYfHxj7U/CAMPEONATO---GENIEX--CONCEITO-?node-id=28-140' },
    ],
    flows: [
      { id: 'inicio', label: 'Minha evolução', icon: './3d/glowing-star.png' },
      { id: 'menu', label: 'Menu do perfil', icon: './3d/boy-2.png' },
      { id: 'elos', label: 'Os elos', icon: './3d/crown.png' },
      { id: 'elo', label: 'Meu elo atual', icon: './3d/trophy.png' },
      { id: 'elo-regressao', label: 'Após regressão', icon: './3d/bullseye.png' },
      { id: 'badges', label: 'Minhas badges', icon: './3d/gem.png' },
      { id: 'extrato', label: 'Extrato de XP', icon: './3d/notes.png' },
      { id: 'lotes', label: 'XP a expirar', icon: './3d/calendar.png' },
      { id: 'aviso-badge', label: 'Badge desbloqueada', icon: './3d/party.png' },
      { id: 'aviso-elo', label: 'Novo elo', icon: './3d/rocket.png' },
    ],
    component: lazy(() => import('../prototypes/gamificacao-geniex')),
  },
  {
    slug: 'gamificacao-geniex-educadores',
    branch: 'gamificacao-geniex-educadores',
    name: 'Gamificação GenieX · Educadores',
    product: 'Plataforma Educadores',
    audience: 'Professores e gestores',
    description:
      'Relatórios da gamificação da GenieX para professores e gestores: turmas com XP válido, elo médio e distribuição por elo; relatório da turma com regressões e badges; e o relatório de cada estudante com elos, 25 badges, evolução do XP, modalidades e extrato de lotes, com exportação em CSV e PDF.',
    icon: './3d/clipboard.png',
    accent: '#441f67',
    status: 'navegavel',
    dispositivo: 'desktop',
    dominio: 'educadores.jovensgenios.com',
    flows: [
      { id: 'turmas', label: 'Relatórios de Turmas', icon: './3d/books.png' },
      { id: 'turma', label: 'Relatório da turma', icon: './3d/trophy.png' },
      { id: 'estudantes', label: 'Relatórios de Estudantes', icon: './3d/boy-1.png' },
      { id: 'resumo', label: 'Estudante: resumo', icon: './3d/glowing-star.png' },
      { id: 'elos', label: 'Estudante: elos', icon: './3d/crown.png' },
      { id: 'badges', label: 'Estudante: badges', icon: './3d/gem.png' },
      { id: 'extrato', label: 'Estudante: extrato de XP', icon: './3d/notes.png' },
      { id: 'exportar-turma', label: 'Exportar turma', icon: './3d/clipboard.png' },
    ],
    component: lazy(() => import('../prototypes/gamificacao-geniex-educadores')),
  },
  {
    slug: 'teste-vocacional',
    branch: 'teste-vocacional-geniex',
    name: 'Teste Vocacional GenieX',
    product: 'GenieX · Plataforma do Estudante',
    audience: 'Ensino Médio',
    description:
      'Estudante responde 52 perguntas sobre interesses, valores, preferências e habilidades, recebe um perfil RIASEC com profissões explicadas, explora e compara carreiras e segue próximos passos para investigar o futuro.',
    icon: './voc/compass.webp',
    accent: '#504cf2',
    status: 'navegavel',
    dispositivo: 'desktop',
    dominio: 'geniex.jovensgenios.com',
    etapas: [
      { nome: 'Navegável da jornada', estado: 'feito' },
      { nome: 'Telas nas 3 larguras e sobrepostos', estado: 'feito' },
      { nome: 'Componentes da jornada', estado: 'atual' },
      { nome: 'Protótipo e handoff', estado: 'proximo' },
    ],
    links: [
      { label: 'Figma da jornada', url: 'https://www.figma.com/design/Hz67j5SdcyZzMLW3wfb9wd/Teste-Vocacional' },
      { label: 'Referência (Teste Vocacional - Geniex)', url: 'https://www.figma.com/design/CFgSTHDpGqyNluCYfHxj7U/CAMPEONATO---GENIEX--CONCEITO-?node-id=24-70' },
    ],
    flows: [
      { id: 'entrada', label: 'Abertura do teste', icon: './voc/compass.webp' },
      { id: 'clareza', label: 'Clareza inicial', icon: './voc/thinking-face.webp' },
      { id: 'questionario', label: 'Seus interesses', icon: './voc/light-bulb.webp' },
      { id: 'q-valores', label: 'Seus valores', icon: './3d/heart.png' },
      { id: 'q-preferencias', label: 'Preferências', icon: './voc/world-map.webp' },
      { id: 'q-habilidades', label: 'Suas habilidades', icon: './voc/puzzle-piece.webp' },
      { id: 'retomar', label: 'Retomar teste', icon: './voc/hourglass-not-done.webp' },
      { id: 'revisao', label: 'Revisão (faltando)', icon: './3d/clipboard.png' },
      { id: 'processando', label: 'Você concluiu o teste', icon: './3d/rocket.png' },
      { id: 'relatorio', label: 'Resultado: visão geral', icon: './3d/glowing-star.png' },
      { id: 'areas', label: 'Áreas de interesse', icon: './voc/bar-chart.webp' },
      { id: 'recomendacoes', label: 'Profissões recomendadas', icon: './voc/briefcase.webp' },
      { id: 'res-valores', label: 'Valores', icon: './3d/heart.png' },
      { id: 'res-preferencias', label: 'Preferências de trabalho', icon: './voc/world-map.webp' },
      { id: 'res-habilidades', label: 'Habilidades', icon: './voc/puzzle-piece.webp' },
      { id: 'passos', label: 'Próximos passos', icon: './voc/rocket.webp' },
      { id: 'clareza-pos', label: 'Clareza final', icon: './voc/thinking-face.webp' },
      { id: 'carreira', label: 'Conheça a profissão', icon: './voc/bar-chart.webp' },
      { id: 'explorar', label: 'Explorar profissões', icon: './voc/globe-showing-americas.webp' },
      { id: 'comparar', label: 'Comparar', icon: './voc/balance-scale.webp' },
      { id: 'historico', label: 'Histórico de testes', icon: './3d/calendar.png' },
      { id: 'inicio', label: 'Início', icon: './3d/house.png' },
    ],
    component: lazy(() => import('../prototypes/teste-vocacional')),
  },
  {
    slug: 'relatorios-teste-vocacional',
    branch: 'relatorios-teste-vocacional',
    name: 'Relatórios do Teste Vocacional',
    product: 'Educadores · Relatórios institucionais',
    audience: 'Professores do Ensino Médio',
    description:
      'Professor acompanha por turma quem concluiu, está fazendo ou não começou o Teste Vocacional e abre o relatório individual de cada estudante: código RIASEC, radar das seis áreas, profissões para explorar, valores, preferências, habilidades percebidas e uma síntese para apoiar conversas de orientação.',
    icon: './voc/bar-chart.webp',
    accent: '#6a3df0',
    status: 'navegavel',
    dispositivo: 'desktop',
    dominio: 'educadores.jovensgenios.com',
    etapas: [
      { nome: 'Navegável da jornada', estado: 'feito' },
      { nome: 'Telas no Figma (após aprovação)', estado: 'proximo' },
    ],
    links: [
      { label: 'Figma da jornada', url: 'https://www.figma.com/design/7zr3xsn26enztIgzasLSkd/Relat%C3%B3rios---Teste-Vocacional' },
      { label: 'Referência (Teste Vocacional - Educadores)', url: 'https://www.figma.com/design/CFgSTHDpGqyNluCYfHxj7U/CAMPEONATO---GENIEX--CONCEITO-?node-id=99-2' },
    ],
    flows: [
      { id: 'lista', label: 'Estudantes da turma', icon: './3d/clipboard.png' },
      { id: 'concluidos', label: 'Filtro: concluídos', icon: './voc/check-mark-button.webp' },
      { id: 'andamento', label: 'Filtro: em andamento', icon: './voc/hourglass-not-done.webp' },
      { id: 'busca', label: 'Busca por nome', icon: './voc/magnifying-glass-tilted-left.webp' },
      { id: 'outra-turma', label: 'Outra turma', icon: './voc/graduation-cap.webp' },
      { id: 'visao', label: 'Relatório: visão geral', icon: './3d/glowing-star.png' },
      { id: 'areas', label: 'Áreas de interesse', icon: './voc/bar-chart.webp' },
      { id: 'profissoes', label: 'Profissões recomendadas', icon: './voc/briefcase.webp' },
      { id: 'profissao', label: 'Detalhe da profissão', icon: './voc/microscope.webp' },
      { id: 'valores', label: 'Valores', icon: './3d/heart.png' },
      { id: 'preferencias', label: 'Preferências', icon: './voc/world-map.webp' },
      { id: 'habilidades', label: 'Habilidades', icon: './voc/puzzle-piece.webp' },
      { id: 'sintese', label: 'Síntese do perfil', icon: './voc/memo.webp' },
      { id: 'exportar', label: 'Exportar relatório', icon: './3d/rocket.png' },
      { id: 'sem-dado', label: 'Dado opcional ausente', icon: './voc/thinking-face.webp' },
    ],
    component: lazy(() => import('../prototypes/relatorios-teste-vocacional')),
  },
]

export const findJourney = (slug?: string) => journeys.find((j) => j.slug === slug)
