'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import WheelbarrowLogo from './WheelbarrowLogo'

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, login } = useAuth()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [shaking, setShaking] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const ok = login(password)
    if (!ok) {
      setError(true)
      setShaking(true)
      setPassword('')
      setTimeout(() => setShaking(false), 500)
    }
  }

  if (isAuthenticated) return <>{children}</>

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-navy-950">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-carolina-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <WheelbarrowLogo className="w-16 h-[74px] text-gold-400 mx-auto mb-4" />
          <h1 className="text-3xl font-serif text-gold-400 font-bold text-shadow-gold">
            Wheelbarrow Invitational
          </h1>
          <p className="text-slate-400 mt-2 text-sm">Members only. You know the drill.</p>
        </div>

        {/* Card */}
        <div
          className={`card glow-gold ${shaking ? 'animate-[wiggle_0.5s_ease-in-out]' : ''}`}
          style={
            shaking
              ? { animation: 'wiggle 0.5s ease-in-out', transform: 'translateX(0)' }
              : {}
          }
        >
          <h2 className="text-lg font-semibold text-slate-100 mb-4 text-center">
            Enter the password
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError(false)
              }}
              placeholder="Password..."
              className={`input text-center tracking-widest text-lg ${
                error ? 'border-red-500 focus:border-red-500' : ''
              }`}
              autoFocus
              autoComplete="current-password"
            />
            {error && (
              <p className="text-red-400 text-sm text-center">
                Wrong password. Try again.
              </p>
            )}
            <button type="submit" className="btn-gold w-full py-3 text-base">
              Enter the Clubhouse →
            </button>
          </form>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          World Golf Village, St. Augustine, FL • October 2026
        </p>
      </div>

      <style jsx>{`
        @keyframes wiggle {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  )
}
