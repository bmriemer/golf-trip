'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

const NAV_LINKS = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/itinerary', label: 'Itinerary', icon: '📅' },
  { href: '/courses', label: 'Courses', icon: '⛳' },
  { href: '/scores', label: 'Scores', icon: '🏆' },
  { href: '/vote', label: 'Vote', icon: '🗳️' },
  { href: '/players', label: 'Players', icon: '👤' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const { isAdmin, logout } = useAuth()

  return (
    <>
      <nav className="sticky top-0 z-50 bg-forest-900/95 backdrop-blur-md border-b border-forest-700">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 text-gold-400 font-serif font-bold text-lg hover:text-gold-300 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <span>⛳</span>
              <span className="hidden sm:block">Wheelbarrow</span>
              <span className="sm:hidden">WBI</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname === link.href
                      ? 'bg-gold-500 text-forest-950'
                      : 'text-green-300 hover:text-gold-400 hover:bg-forest-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {isAdmin && (
                <span className="hidden sm:flex items-center gap-1 text-xs text-gold-400 bg-gold-500/10 border border-gold-500/30 px-2 py-1 rounded-full">
                  <span>🔑</span> Admin
                </span>
              )}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 text-green-300 hover:text-gold-400 rounded-lg"
                aria-label="Toggle menu"
              >
                {menuOpen ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0 bg-forest-950/80" />
          <div
            className="absolute top-14 left-0 right-0 bg-forest-900 border-b border-forest-700 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    pathname === link.href
                      ? 'bg-gold-500 text-forest-950'
                      : 'text-green-200 hover:bg-forest-800 hover:text-gold-400'
                  }`}
                >
                  <span>{link.icon}</span>
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <div className="pt-2 border-t border-forest-700 mt-2">
                  <button
                    onClick={() => { logout(); setMenuOpen(false) }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-forest-800"
                  >
                    <span>🚪</span> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom mobile nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-forest-900/95 backdrop-blur-md border-t border-forest-700">
        <div className="flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors ${
                pathname === link.href
                  ? 'text-gold-400'
                  : 'text-green-500 hover:text-green-300'
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              <span className="text-[10px]">{link.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  )
}
