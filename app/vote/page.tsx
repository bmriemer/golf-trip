'use client'

import { useState, useEffect } from 'react'
import { DEFAULT_POLLS, PLAYERS, Poll, PollOption } from '@/lib/data'

const PLAYER_NAMES = PLAYERS.map((p) => p.name)
const VOTES_KEY = 'wheelbarrow_votes'
const ADMIN_PASSWORD = 'Olemisstarheels54!'

function loadPoll(): Poll {
  if (typeof window === 'undefined') return DEFAULT_POLLS[0]
  try {
    const saved = localStorage.getItem(VOTES_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      const found = Array.isArray(parsed)
        ? parsed.find((p: Poll) => p.id === DEFAULT_POLLS[0].id)
        : null
      if (found) return found
    }
  } catch {}
  return { ...DEFAULT_POLLS[0], options: DEFAULT_POLLS[0].options.map((o) => ({ ...o })) }
}

function savePoll(poll: Poll) {
  try {
    const saved = localStorage.getItem(VOTES_KEY)
    const all: Poll[] = saved ? JSON.parse(saved) : []
    const rest = Array.isArray(all) ? all.filter((p) => p.id !== poll.id) : []
    localStorage.setItem(VOTES_KEY, JSON.stringify([poll, ...rest]))
  } catch {}
}

function BarChart({ options, total }: { options: PollOption[]; total: number }) {
  const max = Math.max(...options.map((o) => o.votes.length), 1)
  return (
    <div className="space-y-4 mt-6">
      {options.map((opt) => {
        const pct = total > 0 ? Math.round((opt.votes.length / total) * 100) : 0
        const barPct = (opt.votes.length / max) * 100
        return (
          <div key={opt.id}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-slate-200">{opt.text}</span>
              <span className="text-xs text-slate-500 tabular-nums ml-4">
                {opt.votes.length} vote{opt.votes.length !== 1 ? 's' : ''} · {pct}%
              </span>
            </div>
            <div className="bg-navy-800 rounded-full h-6 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full transition-all duration-700 flex items-center px-2.5"
                style={{ width: `${Math.max(barPct, barPct > 0 ? 3 : 0)}%` }}
              >
                {pct > 12 && (
                  <span className="text-navy-950 text-xs font-bold">{pct}%</span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function AdminPanel({ poll, onUpdate }: { poll: Poll; onUpdate: (p: Poll) => void }) {
  function togglePoll() {
    const updated = { ...poll, isOpen: !poll.isOpen }
    onUpdate(updated)
    savePoll(updated)
  }

  const total = poll.options.reduce((sum, o) => sum + o.votes.length, 0)

  return (
    <div className="mt-8 border border-gold-400/30 rounded-2xl p-5 bg-gold-400/5">
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">
          Admin View
        </span>
        <button
          onClick={togglePoll}
          className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
            poll.isOpen
              ? 'border-red-500/50 text-red-400 hover:bg-red-500/10'
              : 'border-carolina-500/50 text-carolina-400 hover:bg-carolina-500/10'
          }`}
        >
          {poll.isOpen ? 'Close Poll' : 'Reopen Poll'}
        </button>
      </div>

      <div className="space-y-4">
        {poll.options.map((opt) => (
          <div key={opt.id} className="bg-navy-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-100">{opt.text}</span>
              <span className="text-xs text-gold-400 font-bold tabular-nums">
                {opt.votes.length} / {total}
              </span>
            </div>
            {opt.votes.length === 0 ? (
              <p className="text-xs text-slate-600 italic">No votes yet</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {opt.votes.map((voter) => (
                  <span
                    key={voter}
                    className="text-xs bg-navy-700 border border-navy-600 text-slate-300 px-2.5 py-1 rounded-full"
                  >
                    {voter}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {total === 0 && (
        <p className="text-xs text-slate-600 text-center mt-4">No votes cast yet.</p>
      )}
    </div>
  )
}

export default function VotePage() {
  const [poll, setPoll] = useState<Poll>(DEFAULT_POLLS[0])
  const [mounted, setMounted] = useState(false)
  const [selectedVoter, setSelectedVoter] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [passwordError, setPasswordError] = useState(false)

  useEffect(() => {
    setPoll(loadPoll())
    setMounted(true)
  }, [])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  function castVote(optionId: string) {
    if (!poll.isOpen) {
      showToast('This poll is closed')
      return
    }
    if (!selectedVoter) {
      showToast('Select your name first')
      return
    }
    const updated: Poll = {
      ...poll,
      options: poll.options
        .map((opt) => ({ ...opt, votes: opt.votes.filter((v) => v !== selectedVoter) }))
        .map((opt) =>
          opt.id === optionId ? { ...opt, votes: [...opt.votes, selectedVoter] } : opt
        ),
    }
    setPoll(updated)
    savePoll(updated)
    showToast('Vote recorded!')
  }

  function submitPassword() {
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAdmin(true)
      setShowPasswordPrompt(false)
      setPasswordInput('')
      setPasswordError(false)
    } else {
      setPasswordError(true)
      setPasswordInput('')
    }
  }

  if (!mounted) return null

  const total = poll.options.reduce((sum, o) => sum + o.votes.length, 0)
  const myVote = poll.options.find((o) => o.votes.includes(selectedVoter))?.id ?? null

  return (
    <div className="max-w-xl mx-auto px-4 py-6 md:py-12 animate-fade-in">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-navy-800 border border-gold-400/50 text-gold-300 px-4 py-2 rounded-xl text-sm shadow-xl animate-slide-up">
          {toast}
        </div>
      )}

      {/* Password prompt modal */}
      {showPasswordPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 backdrop-blur-sm px-4">
          <div className="bg-navy-900 border border-navy-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-serif font-bold text-slate-100 text-lg mb-1">Admin Access</h3>
            <p className="text-slate-500 text-sm mb-4">Enter the admin password to continue.</p>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false) }}
              onKeyDown={(e) => e.key === 'Enter' && submitPassword()}
              placeholder="Password"
              autoFocus
              className={`input mb-1 ${passwordError ? 'border-red-500' : ''}`}
            />
            {passwordError && (
              <p className="text-red-400 text-xs mb-3">Incorrect password.</p>
            )}
            {!passwordError && <div className="mb-3" />}
            <div className="flex gap-2">
              <button
                onClick={() => { setShowPasswordPrompt(false); setPasswordInput(''); setPasswordError(false) }}
                className="flex-1 px-4 py-2 rounded-xl border border-navy-600 text-slate-400 text-sm hover:bg-navy-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitPassword}
                className="flex-1 px-4 py-2 rounded-xl bg-gold-400 text-navy-950 text-sm font-bold hover:bg-gold-300 transition-colors"
              >
                Enter
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-1">
        <h1 className="section-title">Vote</h1>
        {isAdmin ? (
          <button
            onClick={() => setIsAdmin(false)}
            className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
          >
            Exit Admin
          </button>
        ) : (
          <button
            onClick={() => setShowPasswordPrompt(true)}
            className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
          >
            Admin
          </button>
        )}
      </div>
      <p className="text-slate-500 text-sm mb-8">{total} vote{total !== 1 ? 's' : ''} cast</p>

      <div className="card">
        {/* Poll status badge */}
        {!poll.isOpen && (
          <div className="mb-4 text-xs text-center text-red-400 border border-red-500/30 bg-red-500/10 rounded-lg py-1.5">
            This poll is closed
          </div>
        )}

        {/* Question */}
        <h2 className="font-serif font-bold text-slate-100 text-lg leading-snug mb-6">
          {poll.question}
        </h2>

        {/* Name selector */}
        <div className="mb-5">
          <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2 block">
            Your name
          </label>
          <select
            value={selectedVoter}
            onChange={(e) => setSelectedVoter(e.target.value)}
            className="input"
          >
            <option value="">Select your name...</option>
            {PLAYER_NAMES.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>

        {/* Vote options */}
        <div className="space-y-2">
          {poll.options.map((opt) => {
            const isMyPick = myVote === opt.id
            return (
              <button
                key={opt.id}
                onClick={() => castVote(opt.id)}
                disabled={!selectedVoter || !poll.isOpen}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                  isMyPick
                    ? 'bg-gold-400/20 border-gold-400 text-gold-300'
                    : 'bg-navy-800 border-navy-600 text-slate-200 hover:border-gold-400/50 hover:bg-navy-700 disabled:opacity-40 disabled:cursor-not-allowed'
                }`}
              >
                <span className="flex items-center gap-2">
                  {isMyPick && <span className="text-gold-400 font-bold">✓</span>}
                  {opt.text}
                </span>
              </button>
            )
          })}
        </div>

        {/* Results */}
        <BarChart options={poll.options} total={total} />

        {total > 0 && poll.isOpen && (
          <p className="text-xs text-slate-600 mt-5 text-center">
            You can change your vote at any time.
          </p>
        )}
      </div>

      {/* Admin panel */}
      {isAdmin && (
        <AdminPanel poll={poll} onUpdate={setPoll} />
      )}
    </div>
  )
}
