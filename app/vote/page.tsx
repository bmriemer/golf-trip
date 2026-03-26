'use client'

import { useState, useEffect } from 'react'
import { DEFAULT_POLLS, PLAYERS, Poll, PollOption } from '@/lib/data'
import { useAuth } from '@/context/AuthContext'
import AdminAuth from '@/components/AdminAuth'

const PLAYER_NAMES = PLAYERS.map((p) => p.name)
const VOTES_KEY = 'wheelbarrow_votes'

function loadPolls(): Poll[] {
  if (typeof window === 'undefined') return DEFAULT_POLLS
  try {
    const saved = localStorage.getItem(VOTES_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return DEFAULT_POLLS.map((p) => ({ ...p, options: p.options.map((o) => ({ ...o })) }))
}

function savePolls(polls: Poll[]) {
  localStorage.setItem(VOTES_KEY, JSON.stringify(polls))
}

function BarChart({ options, total }: { options: PollOption[]; total: number }) {
  return (
    <div className="space-y-3 mt-4">
      {options.map((opt) => {
        const pct = total > 0 ? Math.round((opt.votes.length / total) * 100) : 0
        return (
          <div key={opt.id}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-green-200">{opt.text}</span>
              <span className="text-xs text-green-500 ml-2 whitespace-nowrap">
                {opt.votes.length} vote{opt.votes.length !== 1 ? 's' : ''} · {pct}%
              </span>
            </div>
            <div className="bg-forest-800 rounded-full h-6 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full transition-all duration-700 flex items-center px-2"
                style={{ width: `${Math.max(pct, pct > 0 ? 4 : 0)}%` }}
              >
                {pct > 15 && (
                  <span className="text-forest-950 text-xs font-bold">{pct}%</span>
                )}
              </div>
            </div>
            {opt.votes.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {opt.votes.map((voter) => (
                  <span
                    key={voter}
                    className="text-[10px] bg-forest-800 text-green-500 px-1.5 py-0.5 rounded-full"
                  >
                    {voter.split(' ')[0]}
                  </span>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function VotePage() {
  const { isAdmin } = useAuth()
  const [polls, setPolls] = useState<Poll[]>(DEFAULT_POLLS)
  const [mounted, setMounted] = useState(false)
  const [selectedVoters, setSelectedVoters] = useState<Record<string, string>>({})
  const [voted, setVoted] = useState<Record<string, string>>({}) // pollId -> optionId
  const [toast, setToast] = useState<string | null>(null)

  // Admin: add poll form
  const [showAddPoll, setShowAddPoll] = useState(false)
  const [newQuestion, setNewQuestion] = useState('')
  const [newOptions, setNewOptions] = useState(['', ''])
  const [newType, setNewType] = useState<Poll['type']>('general')

  useEffect(() => {
    const loaded = loadPolls()
    setPolls(loaded)
    setMounted(true)
  }, [])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  function castVote(pollId: string, optionId: string) {
    const voterName = selectedVoters[pollId]
    if (!voterName) {
      showToast('Please select your name first')
      return
    }

    const updated = polls.map((poll) => {
      if (poll.id !== pollId) return poll
      if (!poll.isOpen) return poll
      // Remove any existing vote from this voter
      const options = poll.options.map((opt) => ({
        ...opt,
        votes: opt.votes.filter((v) => v !== voterName),
      }))
      // Add new vote
      return {
        ...poll,
        options: options.map((opt) =>
          opt.id === optionId ? { ...opt, votes: [...opt.votes, voterName] } : opt
        ),
      }
    })

    setPolls(updated)
    savePolls(updated)
    setVoted((prev) => ({ ...prev, [pollId]: optionId }))
    showToast('Vote recorded! ✅')
  }

  function togglePoll(pollId: string, isOpen: boolean) {
    const updated = polls.map((p) => (p.id === pollId ? { ...p, isOpen } : p))
    setPolls(updated)
    savePolls(updated)
  }

  function deletePoll(pollId: string) {
    const updated = polls.filter((p) => p.id !== pollId)
    setPolls(updated)
    savePolls(updated)
  }

  function addPoll() {
    const validOptions = newOptions.filter((o) => o.trim())
    if (!newQuestion.trim() || validOptions.length < 2) {
      showToast('Add a question and at least 2 options')
      return
    }
    const poll: Poll = {
      id: `poll_${Date.now()}`,
      question: newQuestion.trim(),
      type: newType,
      isOpen: true,
      createdAt: new Date().toISOString().split('T')[0],
      options: validOptions.map((text, i) => ({
        id: `opt_${Date.now()}_${i}`,
        text: text.trim(),
        votes: [],
      })),
    }
    const updated = [poll, ...polls]
    setPolls(updated)
    savePolls(updated)
    setNewQuestion('')
    setNewOptions(['', ''])
    setShowAddPoll(false)
    showToast('Poll added! 🗳️')
  }

  if (!mounted) return null

  const activePolls = polls.filter((p) => p.isOpen)
  const closedPolls = polls.filter((p) => !p.isOpen)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 md:py-10 animate-fade-in">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-forest-800 border border-gold-500/50 text-gold-300 px-4 py-2 rounded-xl text-sm shadow-xl animate-slide-up">
          {toast}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="section-title">Vote</h1>
          <p className="text-green-500 text-sm mt-0.5">{activePolls.length} active polls</p>
        </div>
        <AdminAuth />
      </div>

      {/* How to vote note */}
      <div className="bg-gold-500/10 border border-gold-500/30 rounded-xl p-3 mb-6 text-sm text-gold-300">
        <span className="font-semibold">How to vote:</span> Select your name, then click your choice.
        One vote per person per poll. You can change your vote any time.
      </div>

      {/* Active polls */}
      {activePolls.length > 0 && (
        <div className="space-y-6 mb-8">
          <h2 className="text-lg font-semibold text-green-200">🗳️ Active Polls</h2>
          {activePolls.map((poll) => {
            const total = poll.options.reduce((sum, o) => sum + o.votes.length, 0)
            const myVote = (() => {
              const voter = selectedVoters[poll.id]
              if (!voter) return null
              return poll.options.find((o) => o.votes.includes(voter))?.id ?? null
            })()

            return (
              <div key={poll.id} className="card">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="text-xs text-gold-500 font-semibold uppercase tracking-wide mb-1">
                      {poll.type} poll
                    </div>
                    <h3 className="font-serif font-bold text-green-100 text-base leading-snug">
                      {poll.question}
                    </h3>
                    <div className="text-xs text-green-600 mt-0.5">
                      {total} vote{total !== 1 ? 's' : ''} · Open
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => togglePoll(poll.id, false)}
                        className="text-xs text-orange-400 hover:text-orange-300 underline"
                      >
                        Close
                      </button>
                      <button
                        onClick={() => deletePoll(poll.id)}
                        className="text-xs text-red-400 hover:text-red-300 underline"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {/* Name selector */}
                <select
                  value={selectedVoters[poll.id] || ''}
                  onChange={(e) =>
                    setSelectedVoters((prev) => ({ ...prev, [poll.id]: e.target.value }))
                  }
                  className="input mb-4 text-sm"
                >
                  <option value="">Select your name to vote...</option>
                  {PLAYER_NAMES.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>

                {/* Vote options */}
                <div className="space-y-2 mb-4">
                  {poll.options.map((opt) => {
                    const isMyPick = myVote === opt.id
                    return (
                      <button
                        key={opt.id}
                        onClick={() => castVote(poll.id, opt.id)}
                        disabled={!selectedVoters[poll.id]}
                        className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                          isMyPick
                            ? 'bg-gold-500/20 border-gold-500 text-gold-300'
                            : 'bg-forest-800 border-forest-600 text-green-200 hover:border-gold-500/50 hover:bg-forest-700 disabled:opacity-50 disabled:cursor-not-allowed'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {isMyPick && <span className="text-gold-400">✓</span>}
                          {opt.text}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {/* Bar chart */}
                <BarChart options={poll.options} total={total} />
              </div>
            )
          })}
        </div>
      )}

      {/* Closed polls */}
      {closedPolls.length > 0 && (
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-semibold text-green-400">✅ Closed Polls</h2>
          {closedPolls.map((poll) => {
            const total = poll.options.reduce((sum, o) => sum + o.votes.length, 0)
            const winner = poll.options.reduce(
              (best, opt) => (opt.votes.length > best.votes.length ? opt : best),
              poll.options[0]
            )
            return (
              <div key={poll.id} className="card opacity-80">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="text-xs text-green-600 font-semibold uppercase tracking-wide mb-1">
                      closed · {poll.type}
                    </div>
                    <h3 className="font-serif font-bold text-green-300 text-base leading-snug">
                      {poll.question}
                    </h3>
                    <div className="text-xs text-green-600 mt-0.5">
                      Winner: <span className="text-gold-400 font-semibold">{winner?.text}</span> · {total} votes
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => togglePoll(poll.id, true)}
                        className="text-xs text-green-400 hover:text-green-300 underline"
                      >
                        Reopen
                      </button>
                      <button
                        onClick={() => deletePoll(poll.id)}
                        className="text-xs text-red-400 hover:text-red-300 underline"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                <BarChart options={poll.options} total={total} />
              </div>
            )
          })}
        </div>
      )}

      {/* Admin: Add poll */}
      {isAdmin && (
        <div className="card border-gold-500/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gold-400">🔑 Add New Poll</h3>
            <button
              onClick={() => setShowAddPoll(!showAddPoll)}
              className="btn-outline text-sm py-1.5 px-3"
            >
              {showAddPoll ? 'Cancel' : '+ New Poll'}
            </button>
          </div>

          {showAddPoll && (
            <div className="space-y-4 animate-slide-up">
              <div>
                <label className="text-xs text-green-500 mb-1 block">Question</label>
                <input
                  type="text"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="What's the question?"
                  className="input"
                />
              </div>
              <div>
                <label className="text-xs text-green-500 mb-1 block">Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as Poll['type'])}
                  className="input"
                >
                  <option value="general">General</option>
                  <option value="dates">Dates</option>
                  <option value="courses">Courses</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-green-500 mb-2 block">Options (min 2)</label>
                <div className="space-y-2">
                  {newOptions.map((opt, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const updated = [...newOptions]
                          updated[i] = e.target.value
                          setNewOptions(updated)
                        }}
                        placeholder={`Option ${i + 1}`}
                        className="input flex-1"
                      />
                      {newOptions.length > 2 && (
                        <button
                          onClick={() =>
                            setNewOptions(newOptions.filter((_, j) => j !== i))
                          }
                          className="text-red-400 hover:text-red-300 px-2"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {newOptions.length < 6 && (
                  <button
                    onClick={() => setNewOptions([...newOptions, ''])}
                    className="text-xs text-green-500 hover:text-green-300 mt-2 underline"
                  >
                    + Add option
                  </button>
                )}
              </div>
              <button onClick={addPoll} className="btn-gold w-full py-2.5">
                Create Poll
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
