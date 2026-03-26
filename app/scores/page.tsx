'use client'

import { useState } from 'react'
import { buildLeaderboard, buildStats, SCORECARDS, PLAYERS, COURSES, ROUNDS } from '@/lib/data'
import { useAuth } from '@/context/AuthContext'
import AdminAuth from '@/components/AdminAuth'

type Tab = 'leaderboard' | 'scorecard' | 'stats'

function ScoreCell({ score, par }: { score: number; par: number }) {
  const diff = score - par
  let cls = 'text-green-200'
  let ring = ''
  if (diff <= -2) { cls = 'text-yellow-300 font-bold'; ring = 'ring-2 ring-yellow-400 bg-yellow-400/20' }
  else if (diff === -1) { cls = 'text-red-400 font-bold'; ring = 'ring-1 ring-red-400 bg-red-400/15' }
  else if (diff === 0) { cls = 'text-green-300' }
  else if (diff === 1) { cls = 'text-blue-400' }
  else { cls = 'text-blue-300/70' }
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
          <p className="text-green-500 text-sm mt-0.5">
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
                  <tr className="bg-forest-800 border-b border-forest-700">
                    <th className="text-left px-4 py-3 text-green-500 font-semibold w-8">#</th>
                    <th className="text-left px-4 py-3 text-green-500 font-semibold">Player</th>
                    {ROUNDS.map((r, i) => (
                      <th key={r.id} className="text-center px-2 py-3 text-green-500 font-semibold text-xs">
                        R{i + 1}
                      </th>
                    ))}
                    <th className="text-center px-3 py-3 text-green-500 font-semibold">Total</th>
                    <th className="text-center px-3 py-3 text-green-500 font-semibold">+/-</th>
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
                      const parTotal = ROUNDS.reduce((acc, r) => {
                        const c = COURSES.find((c) => c.id === r.courseId)!
                        return acc + c.par
                      }, 0)
                      const displayTotal =
                        scoreView === 'gross' ? entry.grossTotal : entry.netTotal
                      const displayToPar =
                        scoreView === 'gross'
                          ? entry.grossTotal - parTotal
                          : entry.netTotal - (parTotal - entry.player.handicap * ROUNDS.length)

                      return (
                        <tr
                          key={entry.player.id}
                          className={`border-b border-forest-800 hover:bg-forest-800/50 transition-colors ${
                            rank === 0 ? 'bg-gold-500/5' : ''
                          }`}
                        >
                          <td className="px-4 py-3">
                            {rank === 0 ? (
                              <span className="text-gold-400 text-base">🏆</span>
                            ) : rank === 1 ? (
                              <span className="text-green-300 text-sm font-bold">2</span>
                            ) : rank === 2 ? (
                              <span className="text-gold-700 text-sm font-bold">3</span>
                            ) : (
                              <span className="text-green-600 text-sm">{rank + 1}</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{entry.player.emoji}</span>
                              <div>
                                <div className="font-semibold text-green-100 text-sm">
                                  {entry.player.name}
                                </div>
                                <div className="text-xs text-green-600">
                                  HCP {entry.player.handicap}
                                </div>
                              </div>
                            </div>
                          </td>
                          {entry.rounds.map((score, i) => (
                            <td key={i} className="text-center px-2 py-3 text-sm">
                              {score !== null ? (
                                <span className="text-green-200">{score}</span>
                              ) : (
                                <span className="text-green-700">—</span>
                              )}
                            </td>
                          ))}
                          <td className="text-center px-3 py-3 font-bold text-gold-400">
                            {displayTotal}
                          </td>
                          <td className="text-center px-3 py-3">
                            <span
                              className={`text-sm font-semibold ${
                                displayToPar < 0
                                  ? 'text-red-400'
                                  : displayToPar === 0
                                  ? 'text-green-400'
                                  : 'text-blue-400'
                              }`}
                            >
                              {displayToPar > 0 ? `+${displayToPar}` : displayToPar}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-green-600">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-yellow-400/20 ring-2 ring-yellow-400 inline-block" />
              Eagle or better
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-red-400/15 ring-1 ring-red-400 inline-block" />
              Birdie
            </span>
            <span className="text-blue-400">Blue = over par</span>
          </div>

          {isAdmin && (
            <div className="card border-gold-500/30">
              <h3 className="font-semibold text-gold-400 mb-3 text-sm">🔑 Admin: Enter Scores</h3>
              <p className="text-green-500 text-xs">
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
                    <div className="font-serif font-bold text-green-100">{course.name}</div>
                    <div className="text-xs text-green-500">
                      {round.date} · {round.teeTime} · Par {course.par}
                    </div>
                  </div>
                </div>
              </div>

              {/* Front 9 */}
              {['Front 9 (Holes 1–9)', 'Back 9 (Holes 10–18)'].map((label, nineIdx) => {
                const startHole = nineIdx * 9
                const holes = course.holePars.slice(startHole, startHole + 9)
                const holeNums = holes.map((_, i) => startHole + i + 1)

                return (
                  <div key={nineIdx} className="card p-0 overflow-hidden">
                    <div className="bg-forest-800 px-4 py-2 text-xs text-green-500 font-semibold">
                      {label}
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[560px] text-xs">
                        <thead>
                          <tr className="border-b border-forest-700">
                            <th className="text-left px-3 py-2 text-green-600 font-semibold w-28">
                              Player
                            </th>
                            {holeNums.map((h) => (
                              <th key={h} className="text-center px-1 py-2 text-green-600 w-9">
                                {h}
                              </th>
                            ))}
                            <th className="text-center px-2 py-2 text-green-500 font-bold">
                              {nineIdx === 0 ? 'Out' : 'In'}
                            </th>
                          </tr>
                          <tr className="border-b border-forest-700 bg-forest-800/50">
                            <td className="px-3 py-1.5 text-green-500 font-semibold text-xs">
                              Par
                            </td>
                            {holes.map((par, h) => (
                              <td key={h} className="text-center px-1 py-1.5">
                                <span
                                  className={`text-xs font-bold ${
                                    par === 3
                                      ? 'text-blue-400'
                                      : par === 5
                                      ? 'text-red-400'
                                      : 'text-green-400'
                                  }`}
                                >
                                  {par}
                                </span>
                              </td>
                            ))}
                            <td className="text-center px-2 py-1.5 font-bold text-green-300 text-xs">
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
                                className="border-b border-forest-800 hover:bg-forest-800/30"
                              >
                                <td className="px-3 py-1.5">
                                  <div className="flex items-center gap-1.5">
                                    <span>{player.emoji}</span>
                                    <span className="text-green-200 font-medium leading-tight">
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
                                      <span className="text-green-700 text-xs">—</span>
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
                      <tr className="bg-forest-800 border-b border-forest-700">
                        <th className="text-left px-4 py-2 text-green-500 font-semibold">Player</th>
                        <th className="text-center px-3 py-2 text-green-500 font-semibold">Out</th>
                        <th className="text-center px-3 py-2 text-green-500 font-semibold">In</th>
                        <th className="text-center px-3 py-2 text-green-500 font-semibold">Total</th>
                        <th className="text-center px-3 py-2 text-green-500 font-semibold">+/-</th>
                        <th className="text-center px-3 py-2 text-green-500 font-semibold">Net</th>
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
                            className="border-b border-forest-800 hover:bg-forest-800/40"
                          >
                            <td className="px-4 py-2">
                              <div className="flex items-center gap-2">
                                <span>{player.emoji}</span>
                                <span className="text-green-100 text-sm">{player.name}</span>
                              </div>
                            </td>
                            <td className="text-center px-3 py-2 text-green-300">{outTotal}</td>
                            <td className="text-center px-3 py-2 text-green-300">{inTotal}</td>
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
                                    : 'text-blue-400'
                                }`}
                              >
                                {toPar > 0 ? `+${toPar}` : toPar}
                              </span>
                            </td>
                            <td className="text-center px-3 py-2 text-green-400 text-sm">{net}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 text-xs text-green-600">
                <span className="flex items-center gap-1">
                  <span className="w-4 h-4 rounded-full bg-yellow-400/20 ring-2 ring-yellow-400 inline-flex items-center justify-center text-yellow-300 font-bold">3</span>
                  Eagle
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-4 h-4 rounded-full bg-red-400/15 ring-1 ring-red-400 inline-flex items-center justify-center text-red-400 font-bold">3</span>
                  Birdie
                </span>
                <span className="text-green-400">Green = par</span>
                <span className="text-blue-400">Blue = bogey+</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      {tab === 'stats' && (
        <div className="animate-slide-up space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: 'Most Birdies',
                value: (() => {
                  const top = stats.sort((a, b) => b.birdies - a.birdies)[0]
                  return `${top.player.emoji} ${top.player.name.split(' ')[0]} (${top.birdies})`
                })(),
                icon: '🐦',
              },
              {
                label: 'Best Round',
                value: (() => {
                  const top = stats.sort((a, b) => a.bestRound - b.bestRound)[0]
                  return `${top.player.emoji} ${top.player.name.split(' ')[0]} (${top.bestRound})`
                })(),
                icon: '⭐',
              },
              {
                label: 'Most Eagles',
                value: (() => {
                  const top = stats.sort((a, b) => b.eagles - a.eagles)[0]
                  return top.eagles > 0
                    ? `${top.player.emoji} ${top.player.name.split(' ')[0]} (${top.eagles})`
                    : 'None yet'
                })(),
                icon: '🦅',
              },
              {
                label: 'Steadiest',
                value: (() => {
                  const top = stats.sort((a, b) => b.pars - a.pars)[0]
                  return `${top.player.emoji} ${top.player.name.split(' ')[0]} (${top.pars} pars)`
                })(),
                icon: '🎯',
              },
            ].map(({ label, value, icon }) => (
              <div key={label} className="card text-center">
                <div className="text-2xl mb-1">{icon}</div>
                <div className="text-xs text-green-500 mb-1">{label}</div>
                <div className="text-xs font-semibold text-green-100">{value}</div>
              </div>
            ))}
          </div>

          {/* Per-player stats table */}
          <div className="card p-0 overflow-hidden">
            <div className="bg-forest-800 px-4 py-2 text-xs text-green-500 font-semibold">
              Player Stats (All Rounds)
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] text-sm">
                <thead>
                  <tr className="border-b border-forest-700">
                    <th className="text-left px-4 py-2 text-green-500 font-semibold">Player</th>
                    <th className="text-center px-2 py-2 text-yellow-400 font-semibold text-xs">🦅 Eagle</th>
                    <th className="text-center px-2 py-2 text-red-400 font-semibold text-xs">🐦 Birdie</th>
                    <th className="text-center px-2 py-2 text-green-400 font-semibold text-xs">Par</th>
                    <th className="text-center px-2 py-2 text-blue-400 font-semibold text-xs">Bogey</th>
                    <th className="text-center px-2 py-2 text-blue-300/70 font-semibold text-xs">D+</th>
                    <th className="text-center px-3 py-2 text-green-500 font-semibold text-xs">Best</th>
                    <th className="text-center px-3 py-2 text-green-500 font-semibold text-xs">Avg</th>
                  </tr>
                </thead>
                <tbody>
                  {stats
                    .slice()
                    .sort((a, b) => b.birdies - a.birdies)
                    .map((s) => (
                      <tr
                        key={s.player.id}
                        className="border-b border-forest-800 hover:bg-forest-800/40"
                      >
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            <span>{s.player.emoji}</span>
                            <span className="text-green-100">{s.player.name}</span>
                          </div>
                        </td>
                        <td className="text-center px-2 py-2 text-yellow-300 font-bold">
                          {s.eagles || '—'}
                        </td>
                        <td className="text-center px-2 py-2 text-red-400 font-bold">
                          {s.birdies}
                        </td>
                        <td className="text-center px-2 py-2 text-green-400">{s.pars}</td>
                        <td className="text-center px-2 py-2 text-blue-400">{s.bogeys}</td>
                        <td className="text-center px-2 py-2 text-blue-300/70">{s.doublePlus}</td>
                        <td className="text-center px-3 py-2 text-gold-400 font-semibold">
                          {s.bestRound}
                        </td>
                        <td className="text-center px-3 py-2 text-green-300">{s.avgScore}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Birdie chart */}
          <div className="card">
            <h3 className="text-sm font-semibold text-green-300 mb-4">🐦 Birdie Leaders</h3>
            <div className="space-y-3">
              {stats
                .slice()
                .sort((a, b) => b.birdies - a.birdies)
                .map((s) => {
                  const maxBirdies = Math.max(...stats.map((x) => x.birdies))
                  const pct = maxBirdies > 0 ? (s.birdies / maxBirdies) * 100 : 0
                  return (
                    <div key={s.player.id} className="flex items-center gap-3">
                      <div className="w-28 text-xs text-green-200 truncate flex items-center gap-1.5">
                        <span>{s.player.emoji}</span>
                        <span>{s.player.name.split(' ')[0]}</span>
                      </div>
                      <div className="flex-1 bg-forest-800 rounded-full h-4 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="w-6 text-xs text-red-400 font-bold text-right">
                        {s.birdies}
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
