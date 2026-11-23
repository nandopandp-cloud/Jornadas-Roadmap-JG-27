import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = { title: 'Planetas · Exploradores', description: 'Kit dos planetas 3D girando' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
