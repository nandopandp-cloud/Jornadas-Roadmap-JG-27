// Branch plugin-perto-digital-jg: este deploy abre direto o protótipo do plugin de acessibilidade no Prepara SP
// (a iniciativa não aparece na plataforma de jornadas). Atalhos: #/?screen=modal | home-acessivel | home | painel | navegacao-face
import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { useRoute } from './router'

const PluginPertoDigital = lazy(() => import('./prototypes/plugin-perto-digital'))

function App() {
  const route = useRoute()
  const params = route.name === 'prototype' ? route.params : new URLSearchParams(window.location.hash.split('?')[1] ?? '')
  const screen = params.get('screen')
  return <PluginPertoDigital key={screen ?? 'login'} startScreen={screen} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={null}>
      <App />
    </Suspense>
  </StrictMode>,
)
