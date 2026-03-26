import Link from 'next/link'
import CountdownTimer from '@/components/CountdownTimer'
import { PLAYERS, COURSES, TRIP_START_DATE, HOTEL_LINK } from '@/lib/data'

const QUICK_LINKS = [
  { href: '/itinerary', icon: '📅', label: 'Itinerary', desc: 'Full schedule & tee times' },
  { href: '/courses', icon: '⛳', label: 'Courses', desc: 'Course info & booking links' },
  { href: '/scores', icon: '🏆', label: 'Leaderboard', desc: 'Scores & standings' },
  { href: '/vote', icon: '🗳️', label: 'Vote', desc: 'Active polls' },
  { href: '/players', icon: '👤', label: 'Players', desc: 'Roster & handicaps' },
  { href: HOTEL_LINK, icon: '🏨', label: 'Hotel', desc: 'The Carolina, Pinehurst', external: true },
]

export default function HomePage() {
  const tripDateStr = TRIP_START_DATE.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-10 animate-fade-in">
      {/* Hero */}
      <section className="text-center mb-10 md:mb-14">
        <div className="text-5xl md:text-7xl mb-4">⛳</div>
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-gold-400 text-shadow-gold mb-2">
          Wheelbarrow
          <br />
          <span className="text-3xl md:text-5xl">Invitational</span>
        </h1>
        <p className="text-green-400 text-base md:text-lg mt-3">
          Pinehurst, NC &nbsp;•&nbsp; {tripDateStr}
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-3 text-sm text-green-500">
          <span>📍 Pinehurst No. 2</span>
          <span>·</span>
          <span>Tobacco Road</span>
          <span>·</span>
          <span>Mid Pines</span>
        </div>
      </section>

      {/* Countdown */}
      <section className="card mb-8 md:mb-12">
        <h2 className="text-center text-gold-500 text-sm font-semibold uppercase tracking-widest mb-5">
          Countdown to Tee-Off
        </h2>
        <CountdownTimer />
        <p className="text-center text-green-600 text-xs mt-5">
          October 8–11, 2026 · The Carolina Hotel, Pinehurst
        </p>
      </section>

      {/* Quick Links */}
      <section className="mb-8 md:mb-12">
        <h2 className="section-title mb-4">Quick Links</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {QUICK_LINKS.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="card hover:border-gold-500/50 hover:bg-forest-800 transition-all duration-200 group"
              >
                <div className="text-2xl mb-2">{link.icon}</div>
                <div className="font-semibold text-green-100 group-hover:text-gold-400 transition-colors text-sm md:text-base">
                  {link.label}
                </div>
                <div className="text-green-600 text-xs mt-0.5">{link.desc}</div>
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="card hover:border-gold-500/50 hover:bg-forest-800 transition-all duration-200 group"
              >
                <div className="text-2xl mb-2">{link.icon}</div>
                <div className="font-semibold text-green-100 group-hover:text-gold-400 transition-colors text-sm md:text-base">
                  {link.label}
                </div>
                <div className="text-green-600 text-xs mt-0.5">{link.desc}</div>
              </Link>
            )
          )}
        </div>
      </section>

      {/* This Year's Courses */}
      <section className="mb-8 md:mb-12">
        <h2 className="section-title mb-4">This Year&apos;s Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {COURSES.map((course, i) => (
            <div key={course.id} className="card flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{course.emoji}</span>
                <div>
                  <div className="text-xs text-gold-500 font-semibold">Round {i + 1}</div>
                  <div className="font-semibold text-green-100 text-sm leading-tight">{course.name}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-green-500 mt-1">
                <span>Par {course.par}</span>
                <span>·</span>
                <span>{course.yards.toLocaleString()} yds</span>
                <span>·</span>
                <span>{course.location}</span>
              </div>
              <div className="flex gap-1 mt-1">
                {Array.from({ length: 10 }).map((_, j) => (
                  <div
                    key={j}
                    className={`h-1.5 flex-1 rounded-full ${
                      j < course.difficulty ? 'bg-gold-500' : 'bg-forest-700'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-green-600">
                Difficulty: {course.difficulty}/10
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Player Cards */}
      <section>
        <h2 className="section-title mb-4">The Field — {PLAYERS.length} Players</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PLAYERS.map((player) => (
            <div key={player.id} className="card text-center hover:border-gold-500/40 transition-colors">
              <div className="text-4xl mb-2">{player.emoji}</div>
              <div className="font-semibold text-green-100 text-sm leading-tight">{player.name}</div>
              <div className="text-gold-500 text-xs mt-0.5">&quot;{player.nickname}&quot;</div>
              <div className="text-green-500 text-xs mt-1">{player.hometown}</div>
              <div className="mt-2 bg-forest-800 rounded-lg py-1 px-2">
                <span className="text-xs text-green-400">HCP </span>
                <span className="text-sm font-bold text-gold-400">{player.handicap}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <Link href="/players" className="btn-outline inline-block">
            View Full Roster →
          </Link>
        </div>
      </section>
    </div>
  )
}
