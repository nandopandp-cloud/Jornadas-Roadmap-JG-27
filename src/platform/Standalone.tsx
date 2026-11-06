import { Suspense, useEffect } from 'react'
import { findJourney } from './journeys'

/** Link público: renderiza somente o protótipo, sem a plataforma em volta. */
export default function Standalone({ slug, params }: { slug: string; params: URLSearchParams }) {
  const journey = findJourney(slug)
  const embedded = params.get('embed') === '1'

  useEffect(() => {
    if (journey) document.title = `${journey.name} · Protótipo Jovens Gênios`
    document.documentElement.classList.add('is-prototype')
    return () => document.documentElement.classList.remove('is-prototype')
  }, [journey])

  if (!journey || !journey.component) {
    return (
      <div className="pf-notfound">
        <img src="./3d/locked.png" alt="" width={96} height={96} />
        <h1>Protótipo não encontrado</h1>
        <p>Confira se o link está completo ou peça um novo link para quem compartilhou.</p>
        {!embedded && (
          <a className="pf-btn pf-btn--primary" href="#/">
            Ver todas as jornadas
          </a>
        )}
      </div>
    )
  }

  const Comp = journey.component
  return (
    <Suspense fallback={<div className="pf-loading"><span /></div>}>
      <Comp startScreen={params.get('screen')} embedded={embedded} />
    </Suspense>
  )
}
