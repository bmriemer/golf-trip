import { COURSES, ROUNDS } from '@/lib/data'

export default function CoursesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-10 animate-fade-in">
      <h1 className="section-title mb-1">The Courses</h1>
      <p className="text-green-500 text-sm mb-8">
        Three legendary tracks. One winner. Good luck.
      </p>

      <div className="space-y-6">
        {COURSES.map((course, i) => {
          const round = ROUNDS[i]
          return (
            <div key={course.id} className="card">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-5">
                <div className="text-6xl sm:text-7xl">{course.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-gold-500 bg-gold-500/10 border border-gold-500/30 px-2 py-0.5 rounded-full">
                      Round {i + 1}
                    </span>
                    <span className="text-xs text-green-600">{round?.date}</span>
                    {round && (
                      <span className="text-xs text-green-600">· Tee: {round.teeTime}</span>
                    )}
                  </div>
                  <h2 className="text-xl md:text-2xl font-serif font-bold text-green-100">
                    {course.name}
                  </h2>
                  <p className="text-green-500 text-sm">{course.location}</p>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {[
                  { label: 'Par', value: course.par },
                  { label: 'Yards', value: course.yards.toLocaleString() },
                  { label: 'Rating', value: course.courseRating.toFixed(1) },
                  { label: 'Slope', value: course.slopeRating },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-forest-800 rounded-xl p-3 text-center">
                    <div className="text-xs text-green-500 mb-0.5">{label}</div>
                    <div className="text-lg font-bold text-gold-400">{value}</div>
                  </div>
                ))}
              </div>

              {/* Difficulty bar */}
              <div className="mb-5">
                <div className="flex items-center justify-between text-xs text-green-500 mb-1.5">
                  <span>Difficulty</span>
                  <span className="font-semibold text-gold-400">{course.difficulty}/10</span>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 10 }).map((_, j) => (
                    <div
                      key={j}
                      className={`h-2 flex-1 rounded-full transition-all ${
                        j < course.difficulty
                          ? j < 4
                            ? 'bg-green-500'
                            : j < 7
                            ? 'bg-gold-500'
                            : 'bg-red-500'
                          : 'bg-forest-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Description */}
              <p className="text-green-300 text-sm leading-relaxed mb-5">{course.description}</p>

              {/* Hole par grid */}
              <div className="mb-5">
                <div className="text-xs text-green-600 font-semibold mb-2">Hole Pars</div>
                <div className="overflow-x-auto -mx-1 px-1">
                  <div className="min-w-[480px]">
                    {/* Front 9 */}
                    <div className="flex gap-1 mb-1">
                      <div className="w-12 text-xs text-green-600 flex items-center">Out</div>
                      {course.holePars.slice(0, 9).map((par, h) => (
                        <div
                          key={h}
                          className="flex-1 text-center bg-forest-800 rounded py-1"
                        >
                          <div className="text-[10px] text-green-600">{h + 1}</div>
                          <div
                            className={`text-xs font-bold ${
                              par === 3 ? 'text-blue-400' : par === 5 ? 'text-red-400' : 'text-green-300'
                            }`}
                          >
                            {par}
                          </div>
                        </div>
                      ))}
                      <div className="w-8 text-center bg-forest-700 rounded py-1">
                        <div className="text-[10px] text-green-600">Tot</div>
                        <div className="text-xs font-bold text-gold-400">
                          {course.holePars.slice(0, 9).reduce((a, b) => a + b, 0)}
                        </div>
                      </div>
                    </div>
                    {/* Back 9 */}
                    <div className="flex gap-1">
                      <div className="w-12 text-xs text-green-600 flex items-center">In</div>
                      {course.holePars.slice(9).map((par, h) => (
                        <div
                          key={h}
                          className="flex-1 text-center bg-forest-800 rounded py-1"
                        >
                          <div className="text-[10px] text-green-600">{h + 10}</div>
                          <div
                            className={`text-xs font-bold ${
                              par === 3 ? 'text-blue-400' : par === 5 ? 'text-red-400' : 'text-green-300'
                            }`}
                          >
                            {par}
                          </div>
                        </div>
                      ))}
                      <div className="w-8 text-center bg-forest-700 rounded py-1">
                        <div className="text-[10px] text-green-600">Tot</div>
                        <div className="text-xs font-bold text-gold-400">
                          {course.holePars.slice(9).reduce((a, b) => a + b, 0)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-1 text-right text-xs text-green-600">
                  <span className="text-blue-400">■</span> Par 3 &nbsp;
                  <span className="text-green-300">■</span> Par 4 &nbsp;
                  <span className="text-red-400">■</span> Par 5
                </div>
              </div>

              {/* Booking link */}
              <a
                href={course.bookingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold inline-flex items-center gap-2"
              >
                <span>Book a Tee Time</span>
                <span>↗</span>
              </a>
            </div>
          )
        })}
      </div>
    </div>
  )
}
