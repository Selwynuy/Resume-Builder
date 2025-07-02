'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

export default function Header() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="w-full bg-[#f7f9fb] border-b border-gray-100 fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
          <span className="text-2xl font-bold text-gray-800">Resume Builder</span>
        </Link>
        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-1 justify-center">
          <ul className="flex gap-8 text-lg font-medium text-gray-700">
            {session && (
              <li><Link href="/dashboard" className="hover:text-blue-700">Dashboard</Link></li>
            )}
            <li><Link href="/templates" className="hover:text-blue-700">Templates</Link></li>
            <li><Link href="/resume/new" className="hover:text-blue-700">Create Resume</Link></li>
          </ul>
        </nav>
        {/* Account Button */}
        <div className="flex items-center gap-2">
          {session ? (
            <Link href="/dashboard" className="bg-blue-900 text-white font-bold rounded-full px-8 py-3 text-lg shadow hover:bg-blue-800 transition">
              My Account
            </Link>
          ) : (
            <Link href="/login" className="bg-blue-900 text-white font-bold rounded-full px-8 py-3 text-lg shadow hover:bg-blue-800 transition">
              Sign In
          </Link>
          )}
          {/* Mobile menu button */}
          <button className="md:hidden ml-2 p-2 rounded hover:bg-gray-200" onClick={() => setMobileMenuOpen(v => !v)}>
            <svg className="h-7 w-7 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
                </button>
                  </div>
                </div>
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#f7f9fb] border-t border-gray-100 px-6 py-4">
          <ul className="flex flex-col gap-4 text-lg font-medium text-gray-700">
            {session && (
              <li><Link href="/dashboard" className="hover:text-blue-700">Dashboard</Link></li>
            )}
            <li><Link href="/templates" className="hover:text-blue-700">Templates</Link></li>
            <li><Link href="/resume/new" className="hover:text-blue-700">Create Resume</Link></li>
            <li>
              {session ? (
                <Link href="/dashboard" className="mt-2 w-full bg-blue-900 text-white font-bold rounded-full px-8 py-3 text-lg shadow hover:bg-blue-800 transition block text-center">
                  My Account
                  </Link>
              ) : (
                <Link href="/login" className="mt-2 w-full bg-blue-900 text-white font-bold rounded-full px-8 py-3 text-lg shadow hover:bg-blue-800 transition block text-center">
                  Sign In
                  </Link>
              )}
            </li>
          </ul>
          </div>
        )}
    </header>
  )
} 