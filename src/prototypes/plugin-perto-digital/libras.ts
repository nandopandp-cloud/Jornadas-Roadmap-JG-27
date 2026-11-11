// Libras com o VLibras (widget oficial do Governo Federal, vlibras.gov.br).
// O botão próprio do VLibras fica escondido: quem abre e fecha o intérprete é o atalho "Libras" do plugin.
import { useCallback, useEffect, useRef } from 'react'
import { useA11y } from './a11y'

const RAIZ = 'https://vlibras.gov.br/app'

declare global {
  interface Window {
    VLibras?: { Widget: new (path: string) => unknown }
    VLibrasWidget?: { open?: () => void; path?: string; position?: string }
  }
}

let carregando: Promise<void> | null = null
function carregar(): Promise<void> {
  if (window.VLibrasWidget?.open) return Promise.resolve()
  if (carregando) return carregando
  carregando = new Promise<void>((ok, erro) => {
    // janela do intérprete à esquerda: à direita ficam os atalhos do plugin
    window.VLibrasWidget = { ...window.VLibrasWidget, position: 'L' }
    const s = document.createElement('script')
    s.src = `${RAIZ}/vlibras-plugin.js`
    s.async = true
    s.onload = () => {
      try {
        new (window.VLibras!.Widget as unknown as new (o: object) => unknown)({ rootPath: RAIZ, position: 'L' })
      } catch {
        /* o plugin já se inicializa sozinho */
      }
      // o plugin monta o botão ~50 ms depois
      const t0 = Date.now()
      const espera = () => (window.VLibrasWidget?.open ? ok() : Date.now() - t0 > 6000 ? erro(new Error('vlibras')) : setTimeout(espera, 80))
      espera()
    }
    s.onerror = () => {
      carregando = null
      erro(new Error('vlibras'))
    }
    document.body.appendChild(s)
  })
  return carregando
}

const raizApp = () => document.getElementById('vlibras-app-root')

export function useLibras() {
  const { a, set, avisar } = useA11y()
  const ligado = useRef(a.libras)
  ligado.current = a.libras

  // se a pessoa fechar pelo próprio VLibras, o atalho do plugin acompanha
  useEffect(() => {
    if (!a.libras) return
    let obs: MutationObserver | null = null
    const t = window.setInterval(() => {
      const r = raizApp()
      if (!r || obs) return
      obs = new MutationObserver(() => {
        if (r.dataset.active === 'false' && ligado.current) set({ libras: false })
      })
      obs.observe(r, { attributes: true, attributeFilter: ['data-active'] })
    }, 300)
    return () => {
      window.clearInterval(t)
      obs?.disconnect()
    }
  }, [a.libras, set])

  return useCallback(async () => {
    if (ligado.current) {
      const r = raizApp()
      if (r) r.dataset.active = 'false'
      set({ libras: false })
      avisar('Libras desativado', 'info')
      return
    }
    set({ libras: true })
    avisar('Abrindo o intérprete de Libras…', 'info')
    try {
      await carregar()
      window.VLibrasWidget?.open?.()
      avisar('Libras ativado: clique em um texto para ver a tradução', 'ok')
    } catch {
      set({ libras: false })
      avisar('Não foi possível carregar o VLibras agora. Verifique a conexão.', 'erro')
    }
  }, [set, avisar])
}
