'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import {
  ChevronDown,
  Menu,
  X,
} from "lucide-react"

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    dropdown: [
      { name: "My Resumes", href: "/dashboard/resumes" },
      { name: "Analytics", href: "/dashboard/analytics" },
      { name: "Settings", href: "/dashboard/settings" },
    ],
  },
  {
    name: "Templates",
    href: "/templates",
    dropdown: [
      { name: "Professional", href: "/templates/professional" },
      { name: "Creative", href: "/templates/creative" },
      { name: "Modern", href: "/templates/modern" },
      { name: "Executive", href: "/templates/executive" },
    ],
  },
  {
    name: "Create Resume",
    href: "/create",
    dropdown: [
      { name: "From Scratch", href: "/create/new" },
      { name: "Import LinkedIn", href: "/create/linkedin" },
      { name: "Upload Resume", href: "/create/upload" },
    ],
  },
  {
    name: "Resources",
    href: "/resources",
    dropdown: [
      { name: "Resume Tips", href: "/resources/tips" },
      { name: "Cover Letters", href: "/resources/cover-letters" },
      { name: "Interview Prep", href: "/resources/interviews" },
      { name: "Career Advice", href: "/resources/career" },
    ],
  },
]

export default function Header() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200/50 fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <img src="/logo.svg" alt="Logo" className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            ResumeAI
          </span>
        </Link>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <div
              key={item.name}
              className="relative"
              onMouseEnter={() => setActiveDropdown(item.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center space-x-1 text-slate-700 hover:text-blue-600 transition-colors duration-200">
                <span>{item.name}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {activeDropdown === item.name && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 animate-in fade-in-0 zoom-in-95 duration-200">
                  {item.dropdown.map((dropdownItem) => (
                    <Link
                      key={dropdownItem.name}
                      href={dropdownItem.href}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                    >
                      {dropdownItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        {/* Account Button */}
        <div className="hidden md:flex items-center space-x-4">
          {session ? (
            <Link href="/dashboard" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium">
              My Account
            </Link>
          ) : (
            <Link href="/login" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium">
              Sign In
            </Link>
          )}
          {/* Mobile menu button */}
          <button className="md:hidden ml-2 p-2 rounded hover:bg-gray-200" onClick={() => setMobileMenuOpen(v => !v)}>
            {mobileMenuOpen ? <X className="h-7 w-7 text-gray-700" /> : <Menu className="h-7 w-7 text-gray-700" />}
          </button>
        </div>
      </div>
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4">
          {navItems.map((item) => (
            <div key={item.name} className="mb-4">
              <Link href={item.href} className="block text-slate-700 hover:text-blue-600 font-medium">
                {item.name}
              </Link>
              <div className="ml-4 mt-2 space-y-2">
                {item.dropdown.map((dropdownItem) => (
                  <Link
                    key={dropdownItem.name}
                    href={dropdownItem.href}
                    className="block text-sm text-slate-600 hover:text-blue-600"
                  >
                    {dropdownItem.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <hr className="border-slate-200" />
          {session ? (
            <Link href="/dashboard" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium block text-center mt-4">
              My Account
            </Link>
          ) : (
            <Link href="/login" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium block text-center mt-4">
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  )
} 