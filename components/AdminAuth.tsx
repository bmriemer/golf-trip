'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'

export default function AdminAuth() {
  const { isAdmin, loginAdmin, logoutAdmin } = useAuth()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [open, setOpen] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const ok = loginAdmin(password)
    if (ok) {
      setOpen(false)
      setPassword('')
    } else {
      setError(true)
      setPassword('')
    }
  }

  if (isAdmin) {
    return (
      <div className="flex items-center gap-3 p-3 bg-gold-500/10 border border-gold-500/30 rounded-xl">
        <span className="text-gold-400 text-sm font-semibold">🔑 Admin Mode Active</span>
        <button
          onClick={logoutAdmin}
          className="ml-auto text-xs text-red-400 hover:text-red-300 underline"
        >
          Exit Admin
        </button>
      </div>
    )
  }

  return (
    <div>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="text-xs text-green-600 hover:text-green-400 underline"
        >
          Admin login
        </button>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 p-3 bg-forest-800 border border-forest-600 rounded-xl"
        >
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false) }}
            placeholder="Admin password..."
            className={`input flex-1 text-sm py-1.5 ${error ? 'border-red-500' : ''}`}
            autoFocus
          />
          <button type="submit" className="btn-gold py-1.5 px-3 text-sm">
            Enter
          </button>
          <button
            type="button"
            onClick={() => { setOpen(false); setError(false); setPassword('') }}
            className="text-green-500 hover:text-green-300 text-sm px-1"
          >
            ✕
          </button>
          {error && <p className="text-red-400 text-xs">Wrong password</p>}
        </form>
      )}
    </div>
  )
}
