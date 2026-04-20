'use client'

import { useState, useEffect } from 'react'
import { PLAYERS } from '@/lib/data'
import { useAuth } from '@/context/AuthContext'
import AdminAuth from '@/components/AdminAuth'

const MANUAL_STATS_KEY = 'wheelbarrow_manual_stats'

type Tab = 'leaderboard' | 'teams' | 'stats'

interface ManualStats {
  closestToPin: { winner: string; note: string }
  longestDrive: { winner: string; note: string }
}

const DEFAULT_MANUAL: ManualStats = {
  closestToPin: { winner: '', note: '' },
  longestDrive: { winner: '', note: '' },
}

function loadManualStats(): ManualStats {
  if (typeof window === 'undefined') return DEFAULT_MANUAL
  try {
    const saved = localStorage.getItem(MANUAL_STATS_KEY)
    return saved ? { ...DEFAULT_MANUAL, ...JSON.parse(saved) } : DEFAULT_MANUAL
  } catch {
    return DEFAULT_MANUAL
  }
}

function saveManualStats(stats: ManualStats) {
  try {
    localStorage.setItem(MANUAL_STATS_KEY, JSON.stringify(stats))
  } catch {}
}

// ─── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  sub,
  highlight = false,
}: {
  icon: string
  label: string
  value: string
  sub?: string
  highlight?: boolean
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

// ─── Manual stat card (admin-editable) ────────────────────────────────────────

function ManualStatCard({
  icon,
  label,
  winner,
  note,
  isAdmin,
  onSave,
}: {
  icon: string
  label: string
  winner: string
  note: string
  isAdmin: boolean
  onSave: (winner: string, note: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draftWinner, setDraftWinner] = useState(winner)
  const [draftNote, setDraftNote] = useState(note)

  const hasValue = winner.trim() !== ''

  function handleSave() {
    onSave(draftWinner, draftNote)
    setEditing(false)
  }

  return (
    <div className={`card flex flex-col gap-2 ${hasValue ? 'border-gold-400/40' : ''}`}>
      <div className="text-2xl">{icon}</div>
      <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{label}</div>

      {editing ? (
        <div className="space-y-2 mt-1">
          <input
            type="text"
            value={draftWinner}
            onChange={(e) => setDraftWinner(e.target.value)}
            placeholder="Player name"
            className="input text-sm py-1.5"
          />
          <input
            type="text"
            value={draftNote}
            onChange={(e) => setDraftNote(e.target.value)}
            placeholder="Note (e.g. Hole 7, 4 feet)"
            className="input text-sm py-1.5"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 px-3 py-1.5 rounded-lg bg-gold-400 text-navy-950 text-xs font-bold hover:bg-gold-300 transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => { setEditing(false); setDraftWinner(winner); setDraftNote(note) }}
              className="px-3 py-1.5 rounded-lg border border-navy-600 text-slate-400 text-xs hover:bg-navy-800 transition-colors"
            >
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
            <button
              onClick={() => setEditing(true)}
              className="mt-1 text-xs text-slate-600 hover:text-gold-400 transition-colors text-left"
            >
              {hasValue ? '✎ Edit' : '+ Enter winner'}
            </button>
          )}
        </>
      )}
    </div>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function ScoresPage() {
  const [tab, setTab] = useState<Tab>('leaderboard')
  const [manualStats, setManualStats] = useState<ManualStats>(DEFAULT_MANUAL)
  const [mounted, setMounted] = useState(false)
  const { isAdmin } = useAuth()

  useEffect(() => {
    setManualStats(loadManualStats())
    setMounted(true)
  }, [])

  function updateManualStat(
    key: keyof ManualStats,
    winner: string,
    note: string
  ) {
    const next = { ...manualStats, [key]: { winner, note } }
    setManualStats(next)
    saveManualStats(next)
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'leaderboard', label: 'Individual Leaderboard', icon: '🏆' },
    { id: 'teams', label: 'Team Leaderboard', icon: '🤝' },
    { id: 'stats', label: 'Stats', icon: '📊' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-10 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="section-title">Scores</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {PLAYERS.length} players · Rounds TBD
          </p>
        </div>
        <AdminAuth />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`tab-btn flex items-center gap-1.5 ${
              tab === t.id ? 'tab-btn-active' : 'tab-btn-inactive'
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── Leaderboard ──────────────────────────────────────────────────── */}
      {tab === 'leaderboard' && (
        <div className="space-y-4 animate-slide-up">
          <div className="card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] text-sm">
                <thead>
                  <tr className="bg-navy-800 border-b border-navy-700">
                    <th className="text-left px-4 py-3 text-slate-400 font-semibold w-8">#</th>
                    <th className="text-left px-4 py-3 text-slate-400 font-semibold">Player</th>
                    <th className="text-center px-2 py-3 text-slate-400 font-semibold text-xs">R1</th>
                    <th className="text-center px-2 py-3 text-slate-400 font-semibold text-xs">R2</th>
                    <th className="text-center px-2 py-3 text-slate-400 font-semibold text-xs">R3</th>
                    <th className="text-center px-3 py-3 text-slate-400 font-semibold">Total</th>
                    <th className="text-center px-3 py-3 text-slate-400 font-semibold">+/-</th>
                  </tr>
                </thead>
                <tbody>
                  {PLAYERS.map((player, rank) => (
                    <tr
                      key={player.id}
                      className="border-b border-navy-800 hover:bg-navy-800/50 transition-colors"
                    >
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
                      <td className="text-center px-2 py-3 text-slate-600">—</td>
                      <td className="text-center px-2 py-3 text-slate-600">—</td>
                      <td className="text-center px-2 py-3 text-slate-600">—</td>
                      <td className="text-center px-3 py-3 text-slate-600">—</td>
                      <td className="text-center px-3 py-3 text-slate-600">—</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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
      {tab === 'stats' && mounted && (
        <div className="animate-slide-up space-y-6">
          <p className="text-slate-500 text-xs">Stats update once scores are entered. Check back after Round 1.</p>

          {/* Scoring records */}
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

          {/* Performance */}
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Performance</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <StatCard icon="📈" label="Biggest Comeback" value="TBD" sub="Most strokes gained R1→R3" highlight />
              <StatCard icon="🌅" label="Best Front 9" value="TBD" sub="Player · Score" />
              <StatCard icon="🌇" label="Best Back 9" value="TBD" sub="Player · Score" />
              <StatCard icon="📐" label="Most Consistent Player" value="TBD" sub="Lowest variance across 3 rounds" highlight />
            </div>
          </div>

          {/* Moments — admin-editable */}
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Moments</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <ManualStatCard
                icon="📍"
                label="Closest to Pin"
                winner={manualStats.closestToPin.winner}
                note={manualStats.closestToPin.note}
                isAdmin={isAdmin}
                onSave={(w, n) => updateManualStat('closestToPin', w, n)}
              />
              <ManualStatCard
                icon="💨"
                label="Longest Drive"
                winner={manualStats.longestDrive.winner}
                note={manualStats.longestDrive.note}
                isAdmin={isAdmin}
                onSave={(w, n) => updateManualStat('longestDrive', w, n)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
