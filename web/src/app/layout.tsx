import type { Metadata } from 'next'
import '@/styles/globals.scss'
import Providers from '@/components/organisms/Providers'

export const metadata: Metadata = {
  title: 'Banco Amigo — Crédito de libre destino',
  description: 'Solicita tu crédito 100% digital, rápido, seguro y sin salir de casa.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
