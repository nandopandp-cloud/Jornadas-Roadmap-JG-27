import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { useRoute } from './router'
import Hub from './platform/Hub'
import Standalone from './platform/Standalone'
import './platform/platform.css'

function App() {
  const route = useRoute()
  if (route.name === 'prototype') return <Standalone key={`${route.slug}?${route.params}`} slug={route.slug} params={route.params} />
  return <Hub slug={route.slug} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={null}>
      <App />
    </Suspense>
  </StrictMode>,
)
