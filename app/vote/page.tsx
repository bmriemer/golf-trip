'use client'

import { useState, useEffect, useCallback } from 'react'
import { PLAYERS } from '@/lib/data'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

const PLAYER_NAMES = PLAYERS.map((p) => p.name)

const POLL_ID = 'poll_dates_2026'

const POLL_SEED = {
  id: POLL_ID,
  question: 'When should we play the 2026 Wheelbarrow Invitational?',
  type: 'dates',
  is_open: true,
}

const OPTIONS_SEED = [
  { id: 'opt_oct8',  poll_id: POLL_ID, text: 'Oct 8–11' },
  { id: 'opt_oct15', poll_id: POLL_ID, text: 'Oct 15–18' },
  { id: 'opt_nov5',  poll_id: POLL_ID, text: 'Nov 5–8' },
  { id: 'opt_nov12', poll_id: POLL_ID, text: 'Nov 12–15' },
]

interface Option {
  id: string
  text: string
}

interface Vote {
  option_id: string
  voter_name: string
}

interface PollMeta {
  question: string
  is_open: boolean
}

// ─── Bar chart (public — counts only) ─────────────────────────────────────────

function BarChart({ options, votes }: { options: Option[]; votes: Vote[] }) {
  const total = votes.length
  const max = Math.max(...options.map((o) => votes.filter((v) => v.option_id === o.id).length), 1)

  return (
    <div className="space-y-4 mt-6">
      {options.map((opt) => {
        const count = votes.filter((v) => v.option_id === opt.id).length
        const pct = total > 0 ? Math.round((count / total) * 100) : 0
        const barPct = (count / max) * 100
        return (
          <div key={opt.id}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-slate-200">{opt.text}</span>
              <span className="text-xs text-slate-500 tabular-nums ml-4">
                {count} vote{count !== 1 ? 's' : ''} · {pct}%
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

// ─── Admin panel ───────────────────────────────────────────────────────────────

function AdminPanel({
  poll,
  options,
  votes,
  onToggle,
}: {
  poll: PollMeta
  options: Option[]
  votes: Vote[]
  onToggle: () => void
}) {
  const total = votes.length

  return (
    <div className="mt-8 border border-gold-400/30 rounded-2xl p-5 bg-gold-400/5">
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">
          Admin View
        </span>
        <button
          onClick={onToggle}
          className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
            poll.is_open
              ? 'border-red-500/50 text-red-400 hover:bg-red-500/10'
              : 'border-carolina-500/50 text-carolina-400 hover:bg-carolina-500/10'
          }`}
        >
          {poll.is_open ? 'Close Poll' : 'Reopen Poll'}
        </button>
      </div>

      <div className="space-y-4">
        {options.map((opt) => {
          const optVotes = votes.filter((v) => v.option_id === opt.id)
          return (
            <div key={opt.id} className="bg-navy-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-100">{opt.text}</span>
                <span className="text-xs text-gold-400 font-bold tabular-nums">
                  {optVotes.length} / {total}
                </span>
              </div>
              {optVotes.length === 0 ? (
                <p className="text-xs text-slate-600 italic">No votes yet</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {optVotes.map((v) => (
                    <span
                      key={v.voter_name}
                      className="text-xs bg-navy-700 border border-navy-600 text-slate-300 px-2.5 py-1 rounded-full"
                    >
                      {v.voter_name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {total === 0 && (
        <p className="text-xs text-slate-600 text-center mt-4">No votes cast yet.</p>
      )}
    </div>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function VotePage() {
  const [poll, setPoll] = useState<PollMeta | null>(null)
  const [options, setOptions] = useState<Option[]>([])
  const [votes, setVotes] = useState<Vote[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVoter, setSelectedVoter] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const [voting, setVoting] = useState(false)
  const { isAdmin } = useAuth()

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const fetchVotes = useCallback(async () => {
    if (!supabase) return
    const { data } = await supabase
      .from('votes')
      .select('option_id, voter_name')
      .eq('poll_id', POLL_ID)
    if (data) setVotes(data)
  }, [])

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    async function init() {
      if (!supabase) return

      // Seed poll + options if they don't exist
      await supabase.from('polls').upsert(POLL_SEED, { onConflict: 'id', ignoreDuplicates: true })
      await supabase.from('poll_options').upsert(OPTIONS_SEED, { onConflict: 'id', ignoreDuplicates: true })

      // Fetch poll meta
      const { data: pollData } = await supabase
        .from('polls')
        .select('question, is_open')
        .eq('id', POLL_ID)
        .single()
      if (pollData) setPoll(pollData)

      // Fetch options
      const { data: optData } = await supabase
        .from('poll_options')
        .select('id, text')
        .eq('poll_id', POLL_ID)
        .order('created_at')
      if (optData) setOptions(optData)

      // Fetch votes
      await fetchVotes()

      setLoading(false)
    }

    init()

    // Real-time subscription on votes
    const channel = supabase
      .channel('votes-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'votes', filter: `poll_id=eq.${POLL_ID}` },
        () => { fetchVotes() }
      )
      .subscribe()

    return () => { supabase!.removeChannel(channel) }
  }, [fetchVotes])

  async function castVote(optionId: string) {
    if (!supabase || !poll) return
    if (!poll.is_open) { showToast('This poll is closed'); return }
    if (!selectedVoter) { showToast('Select your name first'); return }
    if (voting) return

    setVoting(true)
    // Delete any existing vote for this person, then insert new one
    await supabase
      .from('votes')
      .delete()
      .eq('poll_id', POLL_ID)
      .eq('voter_name', selectedVoter)

    const { error } = await supabase.from('votes').insert({
      poll_id: POLL_ID,
      option_id: optionId,
      voter_name: selectedVoter,
    })

    if (error) {
      showToast('Error saving vote — try again')
    } else {
      showToast('Vote recorded!')
      await fetchVotes()
    }
    setVoting(false)
  }

  async function togglePoll() {
    if (!supabase || !poll) return
    const newOpen = !poll.is_open
    await supabase.from('polls').update({ is_open: newOpen }).eq('id', POLL_ID)
    setPoll({ ...poll, is_open: newOpen })
  }

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-6 md:py-12 text-center">
        <p className="text-slate-500 text-sm mt-20">Loading poll…</p>
      </div>
    )
  }

  if (!supabase || !poll) {
    return (
      <div className="max-w-xl mx-auto px-4 py-6 md:py-12 text-center">
        <p className="text-slate-500 text-sm mt-20">Voting unavailable — database not configured.</p>
      </div>
    )
  }

  const total = votes.length
  const myVoteOptionId = votes.find((v) => v.voter_name === selectedVoter)?.option_id ?? null

  return (
    <div className="max-w-xl mx-auto px-4 py-6 md:py-12 animate-fade-in">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-navy-800 border border-gold-400/50 text-gold-300 px-4 py-2 rounded-xl text-sm shadow-xl animate-slide-up">
          {toast}
        </div>
      )}

      <h1 className="section-title mb-1">Vote</h1>
      <p className="text-slate-500 text-sm mb-8">{total} vote{total !== 1 ? 's' : ''} cast</p>

      <div className="card">
        {!poll.is_open && (
          <div className="mb-4 text-xs text-center text-red-400 border border-red-500/30 bg-red-500/10 rounded-lg py-1.5">
            This poll is closed
          </div>
        )}

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
          {options.map((opt) => {
            const isMyPick = myVoteOptionId === opt.id
            return (
              <button
                key={opt.id}
                onClick={() => castVote(opt.id)}
                disabled={!selectedVoter || !poll.is_open || voting}
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

        {/* Bar chart (counts only — no names) */}
        <BarChart options={options} votes={votes} />

        {total > 0 && poll.is_open && (
          <p className="text-xs text-slate-600 mt-5 text-center">
            You can change your vote at any time.
          </p>
        )}
      </div>

      {/* Admin panel */}
      {isAdmin && (
        <AdminPanel poll={poll} options={options} votes={votes} onToggle={togglePoll} />
      )}
    </div>
  )
}
