const TBD_COURSES = [
  { label: 'Course 1', round: 1 },
  { label: 'Course 2', round: 2 },
  { label: 'Course 3', round: 3 },
]

export default function CoursesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-10 animate-fade-in">
      <h1 className="section-title mb-1">The Courses</h1>
      <p className="text-slate-400 text-sm mb-8">
        Three legendary tracks. One winner. Good luck.
      </p>

      <div className="space-y-6">
        {TBD_COURSES.map(({ label, round }) => (
          <div key={round} className="card">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-5">
              <div className="text-6xl sm:text-7xl">⛳</div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-gold-400 bg-gold-400/10 border border-gold-400/30 px-2 py-0.5 rounded-full">
                    Round {round}
                  </span>
                  <span className="text-xs text-slate-500">Date TBD</span>
                </div>
                <h2 className="text-xl md:text-2xl font-serif font-bold text-slate-100">
                  {label}
                </h2>
                <p className="text-slate-500 text-sm">Location TBD</p>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {['Par', 'Yards', 'Rating', 'Slope'].map((label) => (
                <div key={label} className="bg-navy-800 rounded-xl p-3 text-center">
                  <div className="text-xs text-slate-500 mb-0.5">{label}</div>
                  <div className="text-lg font-bold text-slate-500">TBD</div>
                </div>
              ))}
            </div>

            {/* Difficulty bar */}
            <div className="mb-5">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                <span>Difficulty</span>
                <span className="font-semibold text-slate-500">TBD</span>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 10 }).map((_, j) => (
                  <div key={j} className="h-2 flex-1 rounded-full bg-navy-700" />
                ))}
              </div>
            </div>

            {/* Note */}
            <p className="text-slate-500 text-sm leading-relaxed italic">
              Course details coming soon. Check back once the lineup is confirmed.
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
