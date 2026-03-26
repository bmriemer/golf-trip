import { PLAYERS, buildLeaderboard, buildStats } from '@/lib/data'

export default function PlayersPage() {
  const leaderboard = buildLeaderboard()
  const stats = buildStats()

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-10 animate-fade-in">
      <h1 className="section-title mb-1">The Players</h1>
      <p className="text-green-500 text-sm mb-8">
        {PLAYERS.length} competitors. One champion. Let&apos;s get it.
      </p>

      {/* Roster grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {PLAYERS.map((player) => {
          const entry = leaderboard.find((e) => e.player.id === player.id)
          const stat = stats.find((s) => s.player.id === player.id)
          const grossTotal = entry?.grossTotal ?? 0
          const rank = leaderboard.findIndex((e) => e.player.id === player.id) + 1

          return (
            <div key={player.id} className="card hover:border-gold-500/40 transition-colors group">
              <div className="flex gap-4">
                {/* Avatar */}
                <div className="shrink-0 w-16 h-16 rounded-2xl bg-forest-800 border border-forest-600 flex items-center justify-center text-4xl group-hover:border-gold-500/40 transition-colors">
                  {player.emoji}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="font-serif font-bold text-green-100 text-base leading-tight">
                        {player.name}
                      </h2>
                      <p className="text-gold-500 text-sm">&quot;{player.nickname}&quot;</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs text-green-600">Rank</div>
                      <div className="text-lg font-bold text-gold-400">
                        {rank === 1 ? '🏆' : `#${rank}`}
                      </div>
                    </div>
                  </div>
                  <p className="text-green-500 text-xs mt-1">📍 {player.hometown}</p>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-4 gap-2 mt-4">
                {[
                  { label: 'Handicap', value: player.handicap, highlight: true },
                  { label: 'Gross', value: grossTotal || '—' },
                  { label: 'Wins', value: player.wins },
                  { label: 'Trips', value: player.trips },
                ].map(({ label, value, highlight }) => (
                  <div key={label} className="bg-forest-800 rounded-xl p-2 text-center">
                    <div className="text-[10px] text-green-600 mb-0.5">{label}</div>
                    <div
                      className={`text-sm font-bold ${highlight ? 'text-gold-400' : 'text-green-200'}`}
                    >
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bio */}
              <p className="text-green-500 text-xs mt-3 leading-relaxed italic">
                &ldquo;{player.bio}&rdquo;
              </p>

              {/* Mini stat bar */}
              {stat && (
                <div className="mt-3 pt-3 border-t border-forest-700">
                  <div className="flex items-center justify-between text-xs text-green-600 mb-1.5">
                    <span>Scoring breakdown</span>
                    <span>{stat.birdies} 🐦 · {stat.pars} par · {stat.bogeys} bogey</span>
                  </div>
                  <div className="flex h-2 rounded-full overflow-hidden gap-px">
                    {(() => {
                      const total = stat.eagles + stat.birdies + stat.pars + stat.bogeys + stat.doublePlus
                      if (total === 0) return null
                      return [
                        { pct: stat.eagles / total, cls: 'bg-yellow-400' },
                        { pct: stat.birdies / total, cls: 'bg-red-400' },
                        { pct: stat.pars / total, cls: 'bg-green-500' },
                        { pct: stat.bogeys / total, cls: 'bg-blue-400' },
                        { pct: stat.doublePlus / total, cls: 'bg-blue-700' },
                      ]
                        .filter(({ pct }) => pct > 0)
                        .map(({ pct, cls }, i) => (
                          <div
                            key={i}
                            className={cls}
                            style={{ width: `${pct * 100}%` }}
                          />
                        ))
                    })()}
                  </div>
                  <div className="flex gap-2 mt-1 text-[10px] text-green-700">
                    <span className="text-yellow-500">■ Eagle</span>
                    <span className="text-red-500">■ Birdie</span>
                    <span className="text-green-500">■ Par</span>
                    <span className="text-blue-400">■ Bogey</span>
                    <span className="text-blue-700">■ D+</span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Fun group stats */}
      <div className="card">
        <h2 className="text-lg font-serif font-bold text-gold-400 mb-4">Group Stats</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              icon: '🏆',
              label: 'Championship Record',
              value: (() => {
                const champ = PLAYERS.reduce((best, p) =>
                  p.wins > best.wins ? p : best
                )
                return `${champ.emoji} ${champ.name.split(' ')[0]} (${champ.wins}W)`
              })(),
            },
            {
              icon: '📉',
              label: 'Avg Group Handicap',
              value: (() => {
                const avg = PLAYERS.reduce((sum, p) => sum + p.handicap, 0) / PLAYERS.length
                return avg.toFixed(1)
              })(),
            },
            {
              icon: '✈️',
              label: 'Most Trips',
              value: (() => {
                const vet = PLAYERS.reduce((best, p) => (p.trips > best.trips ? p : best))
                return `${vet.emoji} ${vet.name.split(' ')[0]} (${vet.trips})`
              })(),
            },
            {
              icon: '🎰',
              label: 'Widest Hcp Spread',
              value: (() => {
                const min = Math.min(...PLAYERS.map((p) => p.handicap))
                const max = Math.max(...PLAYERS.map((p) => p.handicap))
                return `${min} – ${max}`
              })(),
            },
          ].map(({ icon, label, value }) => (
            <div key={label} className="bg-forest-800 rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-xs text-green-500 mb-1">{label}</div>
              <div className="text-sm font-semibold text-green-100">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
