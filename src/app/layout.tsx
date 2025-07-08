import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import type { Session } from 'next-auth'
import { getServerSession } from 'next-auth/next'

import Header from '@/components/layout/Header'
import Providers from '@/components/providers/SessionProvider'
import { LoadingProvider } from '@/components/providers/LoadingProvider'
import { GlobalLoading } from '@/components/ui/GlobalLoading'
import { ToastProvider } from '@/components/providers/ToastProvider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Resume Builder - AI-Powered Professional Resumes',
  description: 'Create stunning, professional resumes with our AI-powered builder and modern templates',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers session={session as Session | null | undefined}>
          <ToastProvider>
            <LoadingProvider>
              <a href="#main-content" className="skip-link">
                Skip to main content
              </a>
              <Header />
              <main id="main-content">
                {children}
              </main>
              <GlobalLoading />
            </LoadingProvider>
          </ToastProvider>
        </Providers>
      </body>
    </html>
  )
} 