import { PLAYERS } from '@/lib/data'

export default function PlayersPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-10 animate-fade-in">
      <h1 className="section-title mb-1">The Field</h1>
      <p className="text-slate-400 text-sm mb-8">
        {PLAYERS.length} competitors · Pinehurst, NC · October 2026
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {PLAYERS.map((player, index) => (
          <div
            key={player.id}
            className="card text-center hover:border-gold-400/40 transition-colors group p-4"
          >
            {/* Initials avatar */}
            <div className="w-14 h-14 rounded-full bg-navy-800 border-2 border-gold-400/50 flex items-center justify-center mx-auto mb-3 group-hover:border-gold-400 transition-colors">
              <span className="text-gold-400 font-serif font-bold text-base tracking-wide">
                {player.initials}
              </span>
            </div>

            {/* Number badge */}
            <div className="text-[10px] text-slate-600 font-semibold mb-1 uppercase tracking-widest">
              No. {index + 1}
            </div>

            {/* Name */}
            <div className="font-serif font-semibold text-slate-100 text-sm leading-snug">
              {player.name}
            </div>

            {/* Handicap */}
            <div className="text-xs text-slate-500 mt-1.5">
              HCP: <span className="text-gold-400 font-semibold">TBD</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
