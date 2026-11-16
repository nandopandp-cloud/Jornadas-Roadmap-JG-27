// Branch licao-relatorios-educadores: este deploy abre direto o protótipo dos Relatórios do Modo Lição (plataforma Educadores).
// A iniciativa não aparece na plataforma de jornadas. Atalhos: #/?screen=visao | engajamento | aprendizagem | glossario | compartilhar | pdf | questao | estudantes
import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { useRoute } from './router'

const LicaoRelatorios = lazy(() => import('./prototypes/licao-relatorios-educadores'))

function App() {
  const route = useRoute()
  const params = route.name === 'prototype' ? route.params : new URLSearchParams(window.location.hash.split('?')[1] ?? '')
  const screen = params.get('screen')
  return <LicaoRelatorios key={screen ?? 'visao'} startScreen={screen} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={null}>
      <App />
    </Suspense>
  </StrictMode>,
)
