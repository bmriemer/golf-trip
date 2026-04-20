import Link from 'next/link'
import WheelbarrowLogo from '@/components/WheelbarrowLogo'
import CountdownTimer from '@/components/CountdownTimer'

const QUICK_LINKS = [
  { href: '/itinerary', icon: '📅', label: 'Itinerary', desc: 'Full schedule & tee times' },
  { href: '/courses', icon: '⛳', label: 'Courses', desc: 'Course info & booking links' },
  { href: '/scores', icon: '🏆', label: 'Leaderboard', desc: 'Scores & standings' },
  { href: '/vote', icon: '🗳️', label: 'Vote', desc: 'Active polls' },
  { href: '/players', icon: '👤', label: 'Players', desc: 'Roster & handicaps' },
  { href: 'https://www.marriott.com/en-us/hotels/jaxbr-world-golf-village-renaissance-st-augustine-resort/overview/', icon: '🏨', label: 'Official Hotel', desc: 'Renaissance St. Augustine', external: true },
]

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-10 animate-fade-in">
      {/* Hero */}
      <section className="text-center mb-10 md:mb-14">
        <WheelbarrowLogo className="w-20 h-[92px] md:w-28 md:h-32 text-gold-400 mx-auto mb-5" />
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-gold-400 text-shadow-gold mb-2">
          Wheelbarrow
          <br />
          <span className="text-3xl md:text-5xl">Invitational</span>
        </h1>
        <p className="text-carolina-400 text-base md:text-lg mt-3">
          October 8–11, 2026 · World Golf Village, St. Augustine, FL
        </p>
      </section>

      {/* Countdown */}
      <section className="card mb-8 md:mb-12">
        <h2 className="text-center text-gold-400 text-sm font-semibold uppercase tracking-widest mb-5">
          Countdown to Tee-Off
        </h2>
        <CountdownTimer />
        <p className="text-center text-slate-600 text-xs mt-5">
          October 8–11, 2026 · World Golf Village, St. Augustine, FL
        </p>
      </section>

      {/* Quick Links */}
      <section className="mb-8 md:mb-12">
        <h2 className="section-title mb-4">Quick Links</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {QUICK_LINKS.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href!}
                target="_blank"
                rel="noopener noreferrer"
                className="card hover:border-gold-400/50 hover:bg-navy-800 transition-all duration-200 group"
              >
                <div className="text-2xl mb-2">{link.icon}</div>
                <div className="font-semibold text-slate-100 group-hover:text-gold-400 transition-colors text-sm md:text-base">
                  {link.label}
                </div>
                <div className="text-slate-500 text-xs mt-0.5">{link.desc}</div>
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href!}
                className="card hover:border-gold-400/50 hover:bg-navy-800 transition-all duration-200 group"
              >
                <div className="text-2xl mb-2">{link.icon}</div>
                <div className="font-semibold text-slate-100 group-hover:text-gold-400 transition-colors text-sm md:text-base">
                  {link.label}
                </div>
                <div className="text-slate-500 text-xs mt-0.5">{link.desc}</div>
              </Link>
            )
          )}
        </div>
      </section>

    </div>
  )
}
