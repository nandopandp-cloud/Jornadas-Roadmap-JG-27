// Branch modo-licao-educadores: este deploy abre direto o protótipo do Modo Lição (criação de lições na plataforma Educadores).
// A iniciativa não aparece na plataforma de jornadas. Atalhos: #/?screen=configuracoes | estudantes | topicos | exemplos | conteudos | resumo | resumo-autoral | video | audio | revisao | publicada | zero
import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { useRoute } from './router'

const ModoLicao = lazy(() => import('./prototypes/modo-licao-educadores'))

function App() {
  const route = useRoute()
  const params = route.name === 'prototype' ? route.params : new URLSearchParams(window.location.hash.split('?')[1] ?? '')
  const screen = params.get('screen')
  return <ModoLicao key={screen ?? 'configuracoes'} startScreen={screen} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={null}>
      <App />
    </Suspense>
  </StrictMode>,
)
