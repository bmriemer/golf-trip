const EVENT_COLORS = {
  travel: 'bg-blue-500/20 border-blue-500/40 text-blue-300',
  golf: 'bg-gold-400/20 border-gold-400/40 text-gold-300',
  dinner: 'bg-orange-500/20 border-orange-500/40 text-orange-300',
  free: 'bg-carolina-500/20 border-carolina-500/40 text-carolina-300',
  party: 'bg-pink-500/20 border-pink-500/40 text-pink-300',
}

const EVENT_DOT = {
  travel: 'bg-blue-400',
  golf: 'bg-gold-400',
  dinner: 'bg-orange-400',
  free: 'bg-carolina-400',
  party: 'bg-pink-400',
}

const DAYS = [
  {
    dayOfWeek: 'Wednesday',
    date: 'October 7',
    dayLabel: 'Travel Day',
    events: [
      {
        time: 'All Day',
        title: 'Travel Day',
        description: 'Make your way to World Golf Village, St. Augustine, FL. Details TBD — check back once logistics are confirmed.',
        type: 'travel' as const,
      },
    ],
  },
  {
    dayOfWeek: 'Thursday',
    date: 'October 8',
    dayLabel: 'Round 1',
    events: [
      {
        time: 'TBD',
        title: '⛳ Round 1',
        description: 'Course TBD · Tee time TBD',
        type: 'golf' as const,
      },
    ],
  },
  {
    dayOfWeek: 'Friday',
    date: 'October 9',
    dayLabel: 'Round 2',
    events: [
      {
        time: 'TBD',
        title: '⛳ Round 2',
        description: 'Course TBD · Tee time TBD',
        type: 'golf' as const,
      },
    ],
  },
  {
    dayOfWeek: 'Saturday',
    date: 'October 10',
    dayLabel: 'Round 3',
    events: [
      {
        time: 'TBD',
        title: '⛳ Round 3',
        description: 'Course TBD · Tee time TBD',
        type: 'golf' as const,
      },
    ],
  },
]

export default function ItineraryPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-10 animate-fade-in">
      <h1 className="section-title mb-1">Trip Itinerary</h1>
      <p className="text-slate-400 text-sm mb-8">
        October 7–10, 2026 · World Golf Village, St. Augustine, FL
      </p>

      {/* Days */}
      <div className="space-y-8">
        {DAYS.map((day) => (
          <div key={day.dayOfWeek}>
            {/* Day header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gold-400 text-navy-950 rounded-xl px-3 py-1 text-sm font-bold">
                {day.dayOfWeek}
              </div>
              <div>
                <div className="font-serif font-bold text-slate-100">{day.dayLabel}</div>
                <div className="text-xs text-slate-500">{day.date}, 2026</div>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative pl-6">
              <div className="absolute left-[7px] top-0 bottom-0 w-0.5 bg-navy-700" />
              <div className="space-y-3">
                {day.events.map((event, i) => (
                  <div key={i} className="relative">
                    <div
                      className={`absolute -left-6 mt-4 w-3 h-3 rounded-full border-2 border-navy-950 ${EVENT_DOT[event.type]}`}
                    />
                    <div className={`border rounded-xl px-4 py-3 ${EVENT_COLORS[event.type]}`}>
                      <div className="text-xs opacity-70 mb-0.5">{event.time}</div>
                      <div className="font-semibold text-sm leading-snug">{event.title}</div>
                      <div className="text-xs opacity-75 mt-1 leading-relaxed">{event.description}</div>
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
        <p className="text-slate-400 text-sm">
          Courses and tee times coming soon. Check back once the lineup is confirmed.
        </p>
      </div>
    </div>
  )
}
