// Ícone universal de acessibilidade (pessoa de braços abertos), como no plugin da referência.
export function IconeAcess({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="4.1" r="2.1" fill="currentColor" stroke="none" />
      <path d="M5.2 8.4c2.2.8 4.5 1.2 6.8 1.2s4.6-.4 6.8-1.2" />
      <path d="M12 9.6v4.6" />
      <path d="M12 14.2l-3.2 6.6M12 14.2l3.2 6.6" />
    </svg>
  )
}
