import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Capela dos Milagres — Agendamento',
  description: 'Reserve seu espaço na Capela dos Milagres',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
