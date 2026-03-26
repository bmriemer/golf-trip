import { ITINERARY, HOTEL_LINK, COURSES, ROUNDS } from '@/lib/data'

const EVENT_COLORS = {
  travel: 'bg-blue-500/20 border-blue-500/40 text-blue-300',
  golf: 'bg-gold-500/20 border-gold-500/40 text-gold-300',
  dinner: 'bg-orange-500/20 border-orange-500/40 text-orange-300',
  hotel: 'bg-purple-500/20 border-purple-500/40 text-purple-300',
  free: 'bg-green-500/20 border-green-600/40 text-green-300',
  party: 'bg-pink-500/20 border-pink-500/40 text-pink-300',
}

const EVENT_DOT = {
  travel: 'bg-blue-400',
  golf: 'bg-gold-400',
  dinner: 'bg-orange-400',
  hotel: 'bg-purple-400',
  free: 'bg-green-400',
  party: 'bg-pink-400',
}

export default function ItineraryPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-10 animate-fade-in">
      <h1 className="section-title mb-1">Trip Itinerary</h1>
      <p className="text-green-500 text-sm mb-6">October 8–11, 2026 · Pinehurst, NC</p>

      {/* Key info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        <a
          href={HOTEL_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="card flex items-center gap-3 hover:border-gold-500/50 hover:bg-forest-800 transition-all group"
        >
          <span className="text-2xl">🏨</span>
          <div>
            <div className="text-xs text-green-500">Hotel</div>
            <div className="font-semibold text-green-100 text-sm group-hover:text-gold-400 transition-colors">
              The Carolina Hotel
            </div>
            <div className="text-xs text-green-600">Pinehurst Resort ↗</div>
          </div>
        </a>
        {ROUNDS.map((round, i) => {
          const course = COURSES.find((c) => c.id === round.courseId)!
          return (
            <a
              key={round.id}
              href={course.bookingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="card flex items-center gap-3 hover:border-gold-500/50 hover:bg-forest-800 transition-all group"
            >
              <span className="text-2xl">{course.emoji}</span>
              <div>
                <div className="text-xs text-gold-500">Round {i + 1} · {round.teeTime}</div>
                <div className="font-semibold text-green-100 text-sm leading-tight group-hover:text-gold-400 transition-colors">
                  {course.name}
                </div>
                <div className="text-xs text-green-600">{round.date} ↗</div>
              </div>
            </a>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-6 text-xs">
        {(Object.keys(EVENT_COLORS) as Array<keyof typeof EVENT_COLORS>).map((type) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${EVENT_DOT[type]}`} />
            <span className="text-green-500 capitalize">{type}</span>
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="space-y-8">
        {ITINERARY.map((day) => (
          <div key={day.date}>
            {/* Day header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gold-500 text-forest-950 rounded-xl px-3 py-1 text-sm font-bold">
                {day.dayOfWeek}
              </div>
              <div>
                <div className="font-serif font-bold text-green-100">{day.dayLabel}</div>
                <div className="text-green-600 text-xs">{day.date}</div>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative pl-6">
              {/* Vertical line */}
              <div className="absolute left-[7px] top-0 bottom-0 w-0.5 bg-forest-700" />

              <div className="space-y-3">
                {day.events.map((event, i) => (
                  <div key={i} className="relative">
                    {/* Dot */}
                    <div
                      className={`absolute -left-6 mt-4 w-3 h-3 rounded-full border-2 border-forest-900 ${EVENT_DOT[event.type]}`}
                    />
                    {/* Card */}
                    <div
                      className={`border rounded-xl px-4 py-3 ${EVENT_COLORS[event.type]}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-xs opacity-70 mb-0.5">{event.time}</div>
                          <div className="font-semibold text-sm leading-snug">{event.title}</div>
                          <div className="text-xs opacity-75 mt-1 leading-relaxed">
                            {event.description}
                          </div>
                        </div>
                        {event.link && (
                          <a
                            href={event.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 text-xs opacity-60 hover:opacity-100 underline mt-1"
                          >
                            Link ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="mt-10 card text-center">
        <p className="text-green-400 text-sm">
          📍 All courses are within 30 minutes of The Carolina Hotel.
        </p>
        <p className="text-green-600 text-xs mt-1">
          Schedule subject to change. Last updated March 2026.
        </p>
      </div>
    </div>
  )
}
