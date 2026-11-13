// Branch termino-gamificacao-educadores: este deploy abre direto o protótipo do término da Gamificação dos Educadores 2026
// (a iniciativa não aparece na plataforma de jornadas). Atalhos: #/?screen=modal | fora | podio | sem | modal-podio | modal-sem
import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { useRoute } from './router'

const TerminoGamificacao = lazy(() => import('./prototypes/termino-gamificacao-educadores'))

function App() {
  const route = useRoute()
  const params = route.name === 'prototype' ? route.params : new URLSearchParams(window.location.hash.split('?')[1] ?? '')
  const screen = params.get('screen')
  return <TerminoGamificacao key={screen ?? 'modal'} startScreen={screen} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={null}>
      <App />
    </Suspense>
  </StrictMode>,
)
