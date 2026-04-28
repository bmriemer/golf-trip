'use client'

import { useState, useEffect, useCallback } from 'react'
import { PLAYERS } from '@/lib/data'
import { useAuth } from '@/context/AuthContext'
import AdminAuth from '@/components/AdminAuth'
import { supabase } from '@/lib/supabase'

const SCORES_KEY = 'wheelbarrow_scores'
const MANUAL_STATS_KEY = 'wheelbarrow_manual_stats'

// Round metadata (courses confirmed for R1/R2, R3 TBD)
const ROUNDS = [
  { label: 'R1', name: 'King & Bear', par: 72 },
  { label: 'R2', name: 'Slammer & Squire', par: 72 },
  { label: 'R3', name: 'Course TBD', par: null },
]

type Tab = 'leaderboard' | 'teams' | 'stats'

// scores[playerId][roundIndex] = total score or null
type ScoreMap = Record<string, (number | null)[]>

interface ManualStats {
  closestToPin: { winner: string; note: string }
  longestDrive: { winner: string; note: string }
}

const DEFAULT_MANUAL: ManualStats = {
  closestToPin: { winner: '', note: '' },
  longestDrive: { winner: '', note: '' },
}

function loadScores(): ScoreMap {
  if (typeof window === 'undefined') return {}
  try {
    const saved = localStorage.getItem(SCORES_KEY)
    return saved ? JSON.parse(saved) : {}
  } catch { return {} }
}

function saveScores(scores: ScoreMap) {
  try { localStorage.setItem(SCORES_KEY, JSON.stringify(scores)) } catch {}
}

function loadManualStats(): ManualStats {
  if (typeof window === 'undefined') return DEFAULT_MANUAL
  try {
    const saved = localStorage.getItem(MANUAL_STATS_KEY)
    return saved ? { ...DEFAULT_MANUAL, ...JSON.parse(saved) } : DEFAULT_MANUAL
  } catch { return DEFAULT_MANUAL }
}

function saveManualStats(stats: ManualStats) {
  try { localStorage.setItem(MANUAL_STATS_KEY, JSON.stringify(stats)) } catch {}
}

// ─── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, highlight = false }: {
  icon: string; label: string; value: string; sub?: string; highlight?: boolean
}) {
  return (
    <div className={`card flex flex-col gap-2 ${highlight ? 'border-gold-400/40' : ''}`}>
      <div className="text-2xl">{icon}</div>
      <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{label}</div>
      <div className={`font-serif font-bold text-lg leading-snug ${value === 'TBD' ? 'text-slate-600' : 'text-gold-400'}`}>
        {value}
      </div>
      {sub && <div className="text-xs text-slate-500">{sub}</div>}
    </div>
  )
}

function ManualStatCard({ icon, label, winner, note, isAdmin, onSave }: {
  icon: string; label: string; winner: string; note: string
  isAdmin: boolean; onSave: (winner: string, note: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draftWinner, setDraftWinner] = useState(winner)
  const [draftNote, setDraftNote] = useState(note)
  const hasValue = winner.trim() !== ''

  return (
    <div className={`card flex flex-col gap-2 ${hasValue ? 'border-gold-400/40' : ''}`}>
      <div className="text-2xl">{icon}</div>
      <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{label}</div>
      {editing ? (
        <div className="space-y-2 mt-1">
          <input type="text" value={draftWinner} onChange={(e) => setDraftWinner(e.target.value)}
            placeholder="Player name" className="input text-sm py-1.5" />
          <input type="text" value={draftNote} onChange={(e) => setDraftNote(e.target.value)}
            placeholder="Note (e.g. Hole 7, 4 feet)" className="input text-sm py-1.5" />
          <div className="flex gap-2">
            <button onClick={() => { onSave(draftWinner, draftNote); setEditing(false) }}
              className="flex-1 px-3 py-1.5 rounded-lg bg-gold-400 text-navy-950 text-xs font-bold hover:bg-gold-300 transition-colors">
              Save
            </button>
            <button onClick={() => { setEditing(false); setDraftWinner(winner); setDraftNote(note) }}
              className="px-3 py-1.5 rounded-lg border border-navy-600 text-slate-400 text-xs hover:bg-navy-800 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className={`font-serif font-bold text-lg leading-snug ${hasValue ? 'text-gold-400' : 'text-slate-600'}`}>
            {hasValue ? winner : 'TBD'}
          </div>
          {hasValue && note && <div className="text-xs text-slate-500">{note}</div>}
          {isAdmin && (
            <button onClick={() => setEditing(true)}
              className="mt-1 text-xs text-slate-600 hover:text-gold-400 transition-colors text-left">
              {hasValue ? '✎ Edit' : '+ Enter winner'}
            </button>
          )}
        </>
      )}
    </div>
  )
}

// ─── Inline score cell (admin-editable) ───────────────────────────────────────

function ScoreCell({ value, isAdmin, onSave }: {
  value: number | null; isAdmin: boolean; onSave: (score: number | null) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')

  function commit() {
    const n = parseInt(draft)
    onSave(isNaN(n) || draft.trim() === '' ? null : n)
    setEditing(false)
    setDraft('')
  }

  if (editing) {
    return (
      <td className="text-center px-1 py-1">
        <input
          type="number"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setEditing(false); setDraft('') } }}
          className="w-14 text-center bg-navy-700 border border-gold-400/50 rounded-lg text-gold-300 text-sm py-1 px-1 outline-none focus:border-gold-400"
          autoFocus
          placeholder="—"
        />
      </td>
    )
  }

  return (
    <td className="text-center px-2 py-3">
      {isAdmin ? (
        <button
          onClick={() => { setDraft(value?.toString() ?? ''); setEditing(true) }}
          className={`w-10 h-8 rounded-lg text-sm font-medium transition-colors ${
            value !== null
              ? 'text-slate-100 bg-navy-800 hover:bg-navy-700 hover:text-gold-400'
              : 'text-slate-700 hover:text-slate-400 hover:bg-navy-800'
          }`}
        >
          {value ?? '—'}
        </button>
      ) : (
        <span className={value !== null ? 'text-slate-200 text-sm' : 'text-slate-600'}>
          {value ?? '—'}
        </span>
      )}
    </td>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function ScoresPage() {
  const [tab, setTab] = useState<Tab>('leaderboard')
  const [scores, setScores] = useState<ScoreMap>({})
  const [manualStats, setManualStats] = useState<ManualStats>(DEFAULT_MANUAL)
  const [confirmed, setConfirmed] = useState<Set<string>>(new Set())
  const [mounted, setMounted] = useState(false)
  const { isAdmin } = useAuth()

  const fetchConfirmed = useCallback(async () => {
    if (!supabase) return
    const { data } = await supabase.from('confirmed_players').select('player_id')
    if (data) setConfirmed(new Set(data.map((r: { player_id: string }) => r.player_id)))
  }, [])

  useEffect(() => {
    setScores(loadScores())
    setManualStats(loadManualStats())
    fetchConfirmed().then(() => setMounted(true))
    if (!supabase) { setMounted(true); return }
  }, [fetchConfirmed])

  function setScore(playerId: string, roundIndex: number, score: number | null) {
    const playerScores = scores[playerId] ?? [null, null, null]
    const updated = [...playerScores] as (number | null)[]
    updated[roundIndex] = score
    const next = { ...scores, [playerId]: updated }
    setScores(next)
    saveScores(next)
  }

  function updateManualStat(key: keyof ManualStats, winner: string, note: string) {
    const next = { ...manualStats, [key]: { winner, note } }
    setManualStats(next)
    saveManualStats(next)
  }

  // Build leaderboard rows — only confirmed players
  const leaderboard = PLAYERS.filter((p) => confirmed.has(p.id)).map((player) => {
    const playerScores = scores[player.id] ?? [null, null, null]
    const played = playerScores.filter((s): s is number => s !== null)
    const total = played.length > 0 ? played.reduce((a, b) => a + b, 0) : null
    const parTotal = ROUNDS.reduce((acc, r, i) => {
      return playerScores[i] !== null && r.par ? acc + r.par : acc
    }, 0)
    const toPar = total !== null && parTotal > 0 ? total - parTotal : null
    return { player, playerScores, total, toPar }
  }).sort((a, b) => {
    if (a.total === null && b.total === null) return 0
    if (a.total === null) return 1
    if (b.total === null) return -1
    return a.total - b.total
  })

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'leaderboard', label: 'Individual Leaderboard', icon: '🏆' },
    { id: 'teams', label: 'Team Leaderboard', icon: '🤝' },
    { id: 'stats', label: 'Stats', icon: '📊' },
  ]

  if (!mounted) return null

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-10 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="section-title">Scores</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {confirmed.size} confirmed · 3 rounds
          </p>
        </div>
        <AdminAuth />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`tab-btn flex items-center gap-1.5 ${tab === t.id ? 'tab-btn-active' : 'tab-btn-inactive'}`}>
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── Leaderboard ──────────────────────────────────────────────────── */}
      {tab === 'leaderboard' && (
        <div className="space-y-4 animate-slide-up">
          {isAdmin && (
            <p className="text-xs text-gold-400/70 italic">Click any score cell to edit.</p>
          )}
          {leaderboard.length === 0 && (
            <div className="card text-center py-12">
              <p className="text-slate-400 text-sm">No confirmed players yet.</p>
              <p className="text-slate-600 text-xs mt-1">Confirm players on the Players page to populate the leaderboard.</p>
            </div>
          )}
          {leaderboard.length > 0 && <div className="card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] text-sm">
                <thead>
                  <tr className="bg-navy-800 border-b border-navy-700">
                    <th className="text-left px-4 py-3 text-slate-400 font-semibold w-8">#</th>
                    <th className="text-left px-4 py-3 text-slate-400 font-semibold">Player</th>
                    {ROUNDS.map((r) => (
                      <th key={r.label} className="text-center px-2 py-3 text-slate-400 font-semibold text-xs">
                        {r.label}
                      </th>
                    ))}
                    <th className="text-center px-3 py-3 text-slate-400 font-semibold">Total</th>
                    <th className="text-center px-3 py-3 text-slate-400 font-semibold">+/-</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map(({ player, playerScores, total, toPar }, rank) => (
                    <tr key={player.id} className="border-b border-navy-800 hover:bg-navy-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-slate-500 text-sm">{rank + 1}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-navy-800 border border-gold-400/30 flex items-center justify-center shrink-0">
                            <span className="text-gold-400 font-serif font-bold text-[10px]">{player.initials}</span>
                          </div>
                          <span className="font-semibold text-slate-100 text-sm">{player.name}</span>
                        </div>
                      </td>
                      {ROUNDS.map((_, i) => (
                        <ScoreCell
                          key={i}
                          value={playerScores[i] ?? null}
                          isAdmin={isAdmin}
                          onSave={(score) => setScore(player.id, i, score)}
                        />
                      ))}
                      <td className="text-center px-3 py-3 font-bold">
                        {total !== null ? <span className="text-gold-400">{total}</span> : <span className="text-slate-600">—</span>}
                      </td>
                      <td className="text-center px-3 py-3">
                        {toPar !== null ? (
                          <span className={`text-sm font-semibold ${toPar < 0 ? 'text-red-400' : toPar === 0 ? 'text-green-400' : 'text-carolina-400'}`}>
                            {toPar > 0 ? `+${toPar}` : toPar}
                          </span>
                        ) : <span className="text-slate-600">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>}
        </div>
      )}

      {/* ── Team Leaderboard ─────────────────────────────────────────────── */}
      {tab === 'teams' && (
        <div className="animate-slide-up">
          <div className="card text-center py-12">
            <p className="text-slate-400 text-sm">Teams and scoring format coming soon.</p>
            <p className="text-slate-600 text-xs mt-1">Check back once details are finalized.</p>
          </div>
        </div>
      )}

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      {tab === 'stats' && (
        <div className="animate-slide-up space-y-6">
          <p className="text-slate-500 text-xs">Stats update once scores are entered. Check back after Round 1.</p>

          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Scoring Records</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <StatCard icon="🔥" label="Lowest Round" value="TBD" sub="Player · Score" highlight />
              <StatCard icon="💀" label="Highest Round" value="TBD" sub="The one to avoid" />
              <StatCard icon="🏌️" label="Most Birdies — Trip" value="TBD" sub="Player · Total" highlight />
              <StatCard icon="⚡" label="Most Birdies — Single Round" value="TBD" sub="Player · Count · Round" />
              <StatCard icon="🦅" label="Most Eagles — Trip" value="TBD" sub="Player · Total" highlight />
              <StatCard icon="🎯" label="Most Pars in a Row" value="TBD" sub="Player · Count" />
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Performance</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <StatCard icon="📈" label="Biggest Comeback" value="TBD" sub="Most strokes gained R1→R3" highlight />
              <StatCard icon="🌅" label="Best Front 9" value="TBD" sub="Player · Score" />
              <StatCard icon="🌇" label="Best Back 9" value="TBD" sub="Player · Score" />
              <StatCard icon="📐" label="Most Consistent Player" value="TBD" sub="Lowest variance across 3 rounds" highlight />
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Moments</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <ManualStatCard icon="📍" label="Closest to Pin"
                winner={manualStats.closestToPin.winner} note={manualStats.closestToPin.note}
                isAdmin={isAdmin} onSave={(w, n) => updateManualStat('closestToPin', w, n)} />
              <ManualStatCard icon="💨" label="Longest Drive"
                winner={manualStats.longestDrive.winner} note={manualStats.longestDrive.note}
                isAdmin={isAdmin} onSave={(w, n) => updateManualStat('longestDrive', w, n)} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
