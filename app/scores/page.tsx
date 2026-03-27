'use client'

import { useState } from 'react'
import { PLAYERS } from '@/lib/data'
import { useAuth } from '@/context/AuthContext'
import AdminAuth from '@/components/AdminAuth'

type Tab = 'leaderboard' | 'scorecard' | 'stats'

export default function ScoresPage() {
  const [tab, setTab] = useState<Tab>('leaderboard')
  const { isAdmin } = useAuth()

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
    { id: 'scorecard', label: 'Scorecards', icon: '📋' },
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

      {/* ── Scorecards ────────────────────────────────────────────────────── */}
      {tab === 'scorecard' && (
        <div className="animate-slide-up">
          <div className="card text-center py-12">
            <p className="text-slate-400 text-sm">Scorecards coming soon.</p>
            <p className="text-slate-600 text-xs mt-1">Check back once rounds are confirmed.</p>
          </div>
        </div>
      )}

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      {tab === 'stats' && (
        <div className="animate-slide-up">
          <div className="card text-center py-12">
            <p className="text-slate-400 text-sm">Stats will appear once scores are entered.</p>
            <p className="text-slate-600 text-xs mt-1">Check back after Round 1.</p>
          </div>
        </div>
      )}
    </div>
  )
}
