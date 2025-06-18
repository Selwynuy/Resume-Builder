'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

export default function Header() {
  const { data: session, status } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20 h-20">
      <nav className="container mx-auto px-6 py-4 h-full flex items-center">
        <div className="flex justify-between items-center w-full">
          <Link href="/" className="text-2xl font-bold gradient-text">
            Resume Builder
          </Link>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>

          {/* Desktop menu */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link href="/templates" className="text-slate-700 hover:text-primary-600 font-medium transition-colors">
              Templates
            </Link>
            {session ? (
              <>
                <Link href="/dashboard" className="text-slate-700 hover:text-primary-600 font-medium transition-colors">
                  Dashboard
                </Link>
                <Link href="/resume/new" className="text-slate-700 hover:text-primary-600 font-medium transition-colors">
                  Create Resume
                </Link>
                <span className="text-slate-600 text-sm">Hi, {session.user?.name}</span>
                <button
                  onClick={() => signOut()}
                  className="text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-slate-700 hover:text-primary-600 font-medium transition-colors">
                  Login
                </Link>
                <Link href="/signup" className="btn-gradient">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 py-4 border-t border-white/20">
            <div className="flex flex-col space-y-4">
              <Link href="/templates" className="text-slate-700 hover:text-primary-600 font-medium">
                Templates
              </Link>
              {session ? (
                <>
                  <Link href="/dashboard" className="text-slate-700 hover:text-primary-600 font-medium">
                    Dashboard
                  </Link>
                  <Link href="/resume/new" className="text-slate-700 hover:text-primary-600 font-medium">
                    Create Resume
                  </Link>
                  <span className="text-slate-600 text-sm">Hi, {session.user?.name}</span>
                  <button
                    onClick={() => signOut()}
                    className="text-red-600 hover:text-red-700 font-medium text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-slate-700 hover:text-primary-600 font-medium">
                    Login
                  </Link>
                  <Link href="/signup" className="btn-gradient text-center">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
} 