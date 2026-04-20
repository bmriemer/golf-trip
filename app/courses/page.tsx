interface Course {
  name: string
  round: number
  date: string
  location: string
  description: string | null
  par: number | null
  yards: number | null
  rating: number | null
  slope: number | null
  difficulty: number | null
  bookingLink: string | null
  emoji: string
}

const COURSES: Course[] = [
  {
    name: 'King & Bear',
    round: 1,
    date: 'Thursday, Oct 8',
    location: 'World Golf Village, St. Augustine, FL',
    description:
      'One of the only courses in the world co-designed by both Arnold Palmer and Jack Nicklaus. Dramatic elevation changes, water hazards, and pristine fairways make this a bucket-list round. When two legends collaborate, the result is unforgettable.',
    par: 72,
    yards: 7279,
    rating: 75.2,
    slope: 141,
    difficulty: 9,
    bookingLink: null,
    emoji: '🐻',
  },
  {
    name: 'Slammer & Squire',
    round: 2,
    date: 'Friday, Oct 9',
    location: 'World Golf Village, St. Augustine, FL',
    description:
      'Named after Sam Snead (The Slammer) and Gene Sarazen (The Squire), this classic Florida layout plays against the backdrop of the World Golf Hall of Fame. Water features, challenging greens, and a healthy dose of history await.',
    par: 72,
    yards: 6940,
    rating: 73.8,
    slope: 135,
    difficulty: 8,
    bookingLink: null,
    emoji: '🎩',
  },
  {
    name: 'Course 3',
    round: 3,
    date: 'Saturday, Oct 10',
    location: 'TBD',
    description: null,
    par: null,
    yards: null,
    rating: null,
    slope: null,
    difficulty: null,
    bookingLink: null,
    emoji: '⛳',
  },
]

export default function CoursesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-10 animate-fade-in">
      <h1 className="section-title mb-1">The Courses</h1>
      <p className="text-slate-400 text-sm mb-8">
        Three legendary tracks. One winner. Good luck.
      </p>

      <div className="space-y-6">
        {COURSES.map((course) => (
          <div key={course.round} className="card">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-5">
              <div className="text-6xl sm:text-7xl">{course.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-gold-400 bg-gold-400/10 border border-gold-400/30 px-2 py-0.5 rounded-full">
                    Round {course.round}
                  </span>
                  <span className="text-xs text-slate-500">{course.date}</span>
                </div>
                <h2 className="text-xl md:text-2xl font-serif font-bold text-slate-100">
                  {course.name}
                </h2>
                <p className="text-slate-500 text-sm">{course.location}</p>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {[
                { label: 'Par', value: course.par },
                { label: 'Yards', value: course.yards?.toLocaleString() },
                { label: 'Rating', value: course.rating },
                { label: 'Slope', value: course.slope },
              ].map(({ label, value }) => (
                <div key={label} className="bg-navy-800 rounded-xl p-3 text-center">
                  <div className="text-xs text-slate-500 mb-0.5">{label}</div>
                  <div className={`text-lg font-bold ${value != null ? 'text-gold-400' : 'text-slate-500'}`}>
                    {value ?? 'TBD'}
                  </div>
                </div>
              ))}
            </div>

            {/* Difficulty bar */}
            <div className="mb-5">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                <span>Difficulty</span>
                <span className={`font-semibold ${course.difficulty != null ? 'text-gold-400' : 'text-slate-500'}`}>
                  {course.difficulty != null ? `${course.difficulty}/10` : 'TBD'}
                </span>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 10 }).map((_, j) => (
                  <div
                    key={j}
                    className={`h-2 flex-1 rounded-full ${
                      course.difficulty != null && j < course.difficulty
                        ? j < 4 ? 'bg-carolina-500' : j < 7 ? 'bg-gold-400' : 'bg-red-500'
                        : 'bg-navy-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Description */}
            {course.description ? (
              <p className="text-slate-300 text-sm leading-relaxed mb-5">{course.description}</p>
            ) : (
              <p className="text-slate-500 text-sm leading-relaxed italic mb-5">
                Course details coming soon. Check back once the lineup is confirmed.
              </p>
            )}

            {/* Booking link */}
            {course.bookingLink && (
              <a
                href={course.bookingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold inline-flex items-center gap-2"
              >
                <span>Book a Tee Time</span>
                <span>↗</span>
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
