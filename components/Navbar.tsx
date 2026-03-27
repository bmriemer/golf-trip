'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import WheelbarrowLogo from './WheelbarrowLogo'

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
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const pathname = usePathname()
  const { isAdmin, loginAdmin, logoutAdmin } = useAuth()

  function submitAdminPassword() {
    const ok = loginAdmin(passwordInput)
    if (ok) {
      setShowAdminModal(false)
      setPasswordInput('')
      setPasswordError(false)
    } else {
      setPasswordError(true)
      setPasswordInput('')
    }
  }

  return (
    <>
      {/* Admin password modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-950/80 backdrop-blur-sm px-4">
          <div className="bg-navy-900 border border-navy-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-serif font-bold text-slate-100 text-lg mb-1">Admin Access</h3>
            <p className="text-slate-500 text-sm mb-4">Enter the admin password to continue.</p>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false) }}
              onKeyDown={(e) => e.key === 'Enter' && submitAdminPassword()}
              placeholder="Password"
              autoFocus
              className={`input mb-1 ${passwordError ? 'border-red-500' : ''}`}
            />
            {passwordError && <p className="text-red-400 text-xs mb-3">Incorrect password.</p>}
            {!passwordError && <div className="mb-3" />}
            <div className="flex gap-2">
              <button
                onClick={() => { setShowAdminModal(false); setPasswordInput(''); setPasswordError(false) }}
                className="flex-1 px-4 py-2 rounded-xl border border-navy-600 text-slate-400 text-sm hover:bg-navy-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitAdminPassword}
                className="flex-1 px-4 py-2 rounded-xl bg-gold-400 text-navy-950 text-sm font-bold hover:bg-gold-300 transition-colors"
              >
                Enter
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="sticky top-0 z-50 bg-navy-900/95 backdrop-blur-md border-b border-navy-700">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 text-gold-400 font-serif font-bold text-lg hover:text-gold-300 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <WheelbarrowLogo className="w-7 h-8 text-gold-400" />
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
                      ? 'bg-gold-400 text-navy-950'
                      : 'text-slate-300 hover:text-gold-400 hover:bg-navy-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {isAdmin ? (
                <div className="hidden sm:flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs text-gold-400 bg-gold-400/10 border border-gold-400/30 px-2 py-1 rounded-full">
                    🔑 Admin
                  </span>
                  <button
                    onClick={logoutAdmin}
                    className="text-xs text-slate-600 hover:text-red-400 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAdminModal(true)}
                  className="hidden sm:block text-xs text-slate-700 hover:text-slate-500 transition-colors"
                >
                  Admin
                </button>
              )}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 text-slate-300 hover:text-gold-400 rounded-lg"
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
          <div className="absolute inset-0 bg-navy-950/80" />
          <div
            className="absolute top-14 left-0 right-0 bg-navy-900 border-b border-navy-700 shadow-xl"
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
                      ? 'bg-gold-400 text-navy-950'
                      : 'text-slate-200 hover:bg-navy-800 hover:text-gold-400'
                  }`}
                >
                  <span>{link.icon}</span>
                  {link.label}
                </Link>
              ))}

              <div className="pt-2 border-t border-navy-700 mt-2">
                {isAdmin ? (
                  <button
                    onClick={() => { logoutAdmin(); setMenuOpen(false) }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-navy-800"
                  >
                    <span>🚪</span> Admin Logout
                  </button>
                ) : (
                  <button
                    onClick={() => { setMenuOpen(false); setShowAdminModal(true) }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-600 hover:bg-navy-800 hover:text-slate-400"
                  >
                    <span>🔑</span> Admin Login
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom mobile nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-navy-900/95 backdrop-blur-md border-t border-navy-700">
        <div className="flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors ${
                pathname === link.href
                  ? 'text-gold-400'
                  : 'text-slate-500 hover:text-slate-300'
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
