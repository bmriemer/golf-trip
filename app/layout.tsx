import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import AuthGate from '@/components/AuthGate'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'Wheelbarrow Invitational',
  description: 'The greatest golf trip in recorded history.',
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: 'Wheelbarrow Invitational',
    description: 'The greatest golf trip in recorded history.',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a1628',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AuthGate>
            <Navbar />
            <main className="min-h-screen pb-20">
              {children}
            </main>
          </AuthGate>
        </AuthProvider>
      </body>
    </html>
  )
}
