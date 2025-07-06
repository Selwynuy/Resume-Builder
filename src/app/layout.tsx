import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { getServerSession } from 'next-auth/next'

import Header from '@/components/layout/Header'
import Providers from '@/components/providers/SessionProvider'
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
        <Providers session={session}>
          <Header />
          <main>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
} 