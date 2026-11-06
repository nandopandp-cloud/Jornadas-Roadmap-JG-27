import { useEffect, useState } from 'react'

/**
 * Roteador por hash (#/...) — funciona em qualquer hospedagem estática sem regras de rewrite.
 *  #/                         → plataforma (primeira jornada)
 *  #/jornada/:slug            → plataforma com a jornada selecionada
 *  #/p/:slug?screen=mural     → link público: só o protótipo, em tela cheia
 */
export type Route =
  | { name: 'hub'; slug?: string }
  | { name: 'prototype'; slug: string; params: URLSearchParams }

export function parseHash(hash: string): Route {
  const raw = hash.replace(/^#/, '') || '/'
  const [path, query = ''] = raw.split('?')
  const parts = path.split('/').filter(Boolean)
  if (parts[0] === 'p' && parts[1]) return { name: 'prototype', slug: parts[1], params: new URLSearchParams(query) }
  if (parts[0] === 'jornada' && parts[1]) return { name: 'hub', slug: parts[1] }
  return { name: 'hub' }
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parseHash(window.location.hash))
  useEffect(() => {
    const on = () => setRoute(parseHash(window.location.hash))
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return route
}

export const navigate = (hash: string) => {
  window.location.hash = hash
}

/** URL absoluta (para compartilhar / iframes) */
export function absoluteUrl(hash: string) {
  const { origin, pathname } = window.location
  return `${origin}${pathname}${hash}`
}
