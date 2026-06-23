import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AGENDAMENTO - capelamilagres',
  description: 'Reserve seu espaço na Capela dos Milagres',
  icons: { icon: '/favicon.png' },
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
