'use client'

import { useState } from 'react'
import { buildLeaderboard, buildStats, SCORECARDS, PLAYERS, COURSES, ROUNDS } from '@/lib/data'
import { useAuth } from '@/context/AuthContext'
import AdminAuth from '@/components/AdminAuth'

type Tab = 'leaderboard' | 'scorecard' | 'stats'

function ScoreCell({ score, par }: { score: number; par: number }) {
  const diff = score - par
  let cls = 'text-slate-200'
  let ring = ''
  if (diff <= -2) { cls = 'text-yellow-300 font-bold'; ring = 'ring-2 ring-yellow-400 bg-yellow-400/20' }
  else if (diff === -1) { cls = 'text-red-400 font-bold'; ring = 'ring-1 ring-red-400 bg-red-400/15' }
  else if (diff === 0) { cls = 'text-green-400' }
  else if (diff === 1) { cls = 'text-carolina-400' }
  else { cls = 'text-carolina-300/70' }
  return (
    <td className="text-center py-1.5 px-1">
      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs ${cls} ${ring}`}>
        {score}
      </span>
    </td>
  )
}

export default function ScoresPage() {
  const [tab, setTab] = useState<Tab>('leaderboard')
  const [scoreView, setScoreView] = useState<'gross' | 'net'>('gross')
  const [selectedRound, setSelectedRound] = useState(0)
  const { isAdmin } = useAuth()

  const leaderboard = buildLeaderboard()
  const stats = buildStats()
  const round = ROUNDS[selectedRound]
  const course = COURSES.find((c) => c.id === round?.courseId)

  const roundScorecards = SCORECARDS.filter((s) => s.roundId === round?.id)

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
            {ROUNDS.length} rounds · {PLAYERS.length} players
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
          {/* Gross / Net toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setScoreView('gross')}
              className={`tab-btn text-sm ${scoreView === 'gross' ? 'tab-btn-active' : 'tab-btn-inactive'}`}
            >
              Gross
            </button>
            <button
              onClick={() => setScoreView('net')}
              className={`tab-btn text-sm ${scoreView === 'net' ? 'tab-btn-active' : 'tab-btn-inactive'}`}
            >
              Net (full hcp)
            </button>
          </div>

          {/* Desktop table */}
          <div className="card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] text-sm">
                <thead>
                  <tr className="bg-navy-800 border-b border-navy-700">
                    <th className="text-left px-4 py-3 text-slate-400 font-semibold w-8">#</th>
                    <th className="text-left px-4 py-3 text-slate-400 font-semibold">Player</th>
                    {ROUNDS.map((r, i) => (
                      <th key={r.id} className="text-center px-2 py-3 text-slate-400 font-semibold text-xs">
                        R{i + 1}
                      </th>
                    ))}
                    <th className="text-center px-3 py-3 text-slate-400 font-semibold">Total</th>
                    <th className="text-center px-3 py-3 text-slate-400 font-semibold">+/-</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard
                    .slice()
                    .sort((a, b) =>
                      scoreView === 'gross'
                        ? a.grossTotal - b.grossTotal
                        : a.netTotal - b.netTotal
                    )
                    .map((entry, rank) => {
                      const hasPlayed = entry.rounds.some((r) => r !== null)
                      const displayTotal =
                        scoreView === 'gross' ? entry.grossTotal : entry.netTotal
                      const parTotal = ROUNDS.reduce((acc, r) => {
                        const c = COURSES.find((c) => c.id === r.courseId)!
                        return acc + c.par
                      }, 0)
                      const displayToPar =
                        scoreView === 'gross'
                          ? entry.grossTotal - parTotal
                          : entry.netTotal - (parTotal - entry.player.handicap * ROUNDS.length)

                      return (
                        <tr
                          key={entry.player.id}
                          className="border-b border-navy-800 hover:bg-navy-800/50 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <span className="text-slate-500 text-sm">{rank + 1}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-navy-800 border border-gold-400/30 flex items-center justify-center shrink-0">
                                <span className="text-gold-400 font-serif font-bold text-[10px]">{entry.player.initials}</span>
                              </div>
                              <div className="font-semibold text-slate-100 text-sm">
                                {entry.player.name}
                              </div>
                            </div>
                          </td>
                          {entry.rounds.map((score, i) => (
                            <td key={i} className="text-center px-2 py-3 text-sm">
                              {score !== null ? (
                                <span className="text-slate-200">{score}</span>
                              ) : (
                                <span className="text-slate-600">—</span>
                              )}
                            </td>
                          ))}
                          <td className="text-center px-3 py-3 font-bold text-slate-600">
                            {hasPlayed ? <span className="text-gold-400">{displayTotal}</span> : '—'}
                          </td>
                          <td className="text-center px-3 py-3">
                            {hasPlayed ? (
                              <span
                                className={`text-sm font-semibold ${
                                  displayToPar < 0
                                    ? 'text-red-400'
                                    : displayToPar === 0
                                    ? 'text-green-400'
                                    : 'text-carolina-400'
                                }`}
                              >
                                {displayToPar > 0 ? `+${displayToPar}` : displayToPar}
                              </span>
                            ) : (
                              <span className="text-slate-600">—</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-yellow-400/20 ring-2 ring-yellow-400 inline-block" />
              Eagle or better
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-red-400/15 ring-1 ring-red-400 inline-block" />
              Birdie
            </span>
            <span className="text-carolina-400">Blue = over par</span>
          </div>

          {isAdmin && (
            <div className="card border-gold-400/30">
              <h3 className="font-semibold text-gold-400 mb-3 text-sm">🔑 Admin: Enter Scores</h3>
              <p className="text-slate-500 text-xs">
                Score entry is available in the Scorecards tab. Select a round and click a cell to edit.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Scorecard ────────────────────────────────────────────────────── */}
      {tab === 'scorecard' && (
        <div className="animate-slide-up space-y-4">
          {/* Round selector */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {ROUNDS.map((r, i) => {
              const c = COURSES.find((co) => co.id === r.courseId)!
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedRound(i)}
                  className={`tab-btn flex-shrink-0 text-sm ${
                    selectedRound === i ? 'tab-btn-active' : 'tab-btn-inactive'
                  }`}
                >
                  <span>{c.emoji}</span> Round {i + 1}
                </button>
              )
            })}
          </div>

          {course && (
            <>
              <div className="card py-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-3xl">{course.emoji}</span>
                  <div>
                    <div className="font-serif font-bold text-slate-100">{course.name}</div>
                    <div className="text-xs text-slate-500">
                      {round.date} · {round.teeTime} · Par {course.par}
                    </div>
                  </div>
                </div>
              </div>

              {/* Front 9 / Back 9 */}
              {['Front 9 (Holes 1–9)', 'Back 9 (Holes 10–18)'].map((label, nineIdx) => {
                const startHole = nineIdx * 9
                const holes = course.holePars.slice(startHole, startHole + 9)
                const holeNums = holes.map((_, i) => startHole + i + 1)

                return (
                  <div key={nineIdx} className="card p-0 overflow-hidden">
                    <div className="bg-navy-800 px-4 py-2 text-xs text-slate-400 font-semibold">
                      {label}
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[560px] text-xs">
                        <thead>
                          <tr className="border-b border-navy-700">
                            <th className="text-left px-3 py-2 text-slate-500 font-semibold w-28">
                              Player
                            </th>
                            {holeNums.map((h) => (
                              <th key={h} className="text-center px-1 py-2 text-slate-500 w-9">
                                {h}
                              </th>
                            ))}
                            <th className="text-center px-2 py-2 text-slate-400 font-bold">
                              {nineIdx === 0 ? 'Out' : 'In'}
                            </th>
                          </tr>
                          <tr className="border-b border-navy-700 bg-navy-800/50">
                            <td className="px-3 py-1.5 text-slate-400 font-semibold text-xs">
                              Par
                            </td>
                            {holes.map((par, h) => (
                              <td key={h} className="text-center px-1 py-1.5">
                                <span
                                  className={`text-xs font-bold ${
                                    par === 3
                                      ? 'text-carolina-400'
                                      : par === 5
                                      ? 'text-red-400'
                                      : 'text-green-400'
                                  }`}
                                >
                                  {par}
                                </span>
                              </td>
                            ))}
                            <td className="text-center px-2 py-1.5 font-bold text-slate-300 text-xs">
                              {holes.reduce((a, b) => a + b, 0)}
                            </td>
                          </tr>
                        </thead>
                        <tbody>
                          {PLAYERS.map((player) => {
                            const card = roundScorecards.find(
                              (s) => s.playerId === player.id
                            )
                            const holeScores = card?.scores.slice(startHole, startHole + 9)
                            const nineTotal = holeScores?.reduce((a, b) => a + b, 0)

                            return (
                              <tr
                                key={player.id}
                                className="border-b border-navy-800 hover:bg-navy-800/30"
                              >
                                <td className="px-3 py-1.5">
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-5 h-5 rounded-full bg-navy-800 border border-gold-400/30 flex items-center justify-center shrink-0">
                                      <span className="text-gold-400 font-serif font-bold text-[8px]">{player.initials}</span>
                                    </div>
                                    <span className="text-slate-200 font-medium leading-tight">
                                      {player.name.split(' ')[0]}
                                    </span>
                                  </div>
                                </td>
                                {holes.map((par, h) => {
                                  const score = holeScores?.[h]
                                  return score !== undefined ? (
                                    <ScoreCell key={h} score={score} par={par} />
                                  ) : (
                                    <td key={h} className="text-center py-1.5 px-1">
                                      <span className="text-slate-600 text-xs">—</span>
                                    </td>
                                  )
                                })}
                                <td className="text-center px-2 py-1.5 font-bold text-gold-400">
                                  {nineTotal ?? '—'}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              })}

              {/* Totals row */}
              <div className="card p-0 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[400px] text-sm">
                    <thead>
                      <tr className="bg-navy-800 border-b border-navy-700">
                        <th className="text-left px-4 py-2 text-slate-400 font-semibold">Player</th>
                        <th className="text-center px-3 py-2 text-slate-400 font-semibold">Out</th>
                        <th className="text-center px-3 py-2 text-slate-400 font-semibold">In</th>
                        <th className="text-center px-3 py-2 text-slate-400 font-semibold">Total</th>
                        <th className="text-center px-3 py-2 text-slate-400 font-semibold">+/-</th>
                        <th className="text-center px-3 py-2 text-slate-400 font-semibold">Net</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PLAYERS.map((player) => {
                        const card = roundScorecards.find((s) => s.playerId === player.id)
                        if (!card) return null
                        const outTotal = card.scores.slice(0, 9).reduce((a, b) => a + b, 0)
                        const inTotal = card.scores.slice(9).reduce((a, b) => a + b, 0)
                        const net = card.total - Math.round(player.handicap * 0.8)
                        const toPar = card.total - course.par

                        return (
                          <tr
                            key={player.id}
                            className="border-b border-navy-800 hover:bg-navy-800/40"
                          >
                            <td className="px-4 py-2">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-navy-800 border border-gold-400/30 flex items-center justify-center shrink-0">
                                  <span className="text-gold-400 font-serif font-bold text-[9px]">{player.initials}</span>
                                </div>
                                <span className="text-slate-100 text-sm">{player.name}</span>
                              </div>
                            </td>
                            <td className="text-center px-3 py-2 text-slate-300">{outTotal}</td>
                            <td className="text-center px-3 py-2 text-slate-300">{inTotal}</td>
                            <td className="text-center px-3 py-2 font-bold text-gold-400">
                              {card.total}
                            </td>
                            <td className="text-center px-3 py-2">
                              <span
                                className={`text-sm font-semibold ${
                                  toPar < 0
                                    ? 'text-red-400'
                                    : toPar === 0
                                    ? 'text-green-400'
                                    : 'text-carolina-400'
                                }`}
                              >
                                {toPar > 0 ? `+${toPar}` : toPar}
                              </span>
                            </td>
                            <td className="text-center px-3 py-2 text-slate-400 text-sm">{net}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="w-4 h-4 rounded-full bg-yellow-400/20 ring-2 ring-yellow-400 inline-flex items-center justify-center text-yellow-300 font-bold">3</span>
                  Eagle
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-4 h-4 rounded-full bg-red-400/15 ring-1 ring-red-400 inline-flex items-center justify-center text-red-400 font-bold">3</span>
                  Birdie
                </span>
                <span className="text-green-400">Green = par</span>
                <span className="text-carolina-400">Blue = bogey+</span>
              </div>
            </>
          )}
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
