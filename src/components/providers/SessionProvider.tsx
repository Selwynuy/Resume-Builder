'use client'

import { SessionProvider } from 'next-auth/react'

interface SessionProviderProps {
  children: React.ReactNode
  session: unknown
}

export default function Providers({
  children,
  session
}: SessionProviderProps) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <SessionProvider session={session as any}>
      {children}
    </SessionProvider>
  )
} 