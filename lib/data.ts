// ─── Types ────────────────────────────────────────────────────────────────────

export interface Player {
  id: string
  name: string
  nickname: string
  handicap: number
  hometown: string
  emoji: string
  wins: number
  trips: number
  bio: string
}

export interface Course {
  id: string
  name: string
  description: string
  location: string
  par: number
  difficulty: number // 1–10
  yards: number
  bookingLink: string
  emoji: string
  holePars: number[]
  courseRating: number
  slopeRating: number
}

export interface Round {
  id: string
  courseId: string
  roundNumber: number
  date: string
  teeTime: string
}

export interface Poll {
  id: string
  question: string
  options: PollOption[]
  isOpen: boolean
  createdAt: string
  type: 'dates' | 'courses' | 'general'
}

export interface PollOption {
  id: string
  text: string
  votes: string[]
}

export interface ItineraryEvent {
  time: string
  title: string
  description: string
  link?: string
  type: 'travel' | 'golf' | 'dinner' | 'hotel' | 'free' | 'party'
}

export interface ItineraryDay {
  date: string
  dayLabel: string
  dayOfWeek: string
  events: ItineraryEvent[]
}

// ─── Players ──────────────────────────────────────────────────────────────────

export const PLAYERS: Player[] = [
  {
    id: 'p1',
    name: 'Max Riemer',
    nickname: 'Riems',
    handicap: 14,
    hometown: 'Raleigh, NC',
    emoji: '🏌️',
    wins: 1,
    trips: 3,
    bio: 'Steady off the tee, chaos on the greens. Founder of the Wheelbarrow tradition.',
  },
  {
    id: 'p2',
    name: 'Jake Powell',
    nickname: 'JP',
    handicap: 8,
    hometown: 'Charlotte, NC',
    emoji: '🎯',
    wins: 2,
    trips: 3,
    bio: 'Surgically precise iron play. Has never once replaced a divot.',
  },
  {
    id: 'p3',
    name: 'Chris Davis',
    nickname: 'Shooter',
    handicap: 18,
    hometown: 'Nashville, TN',
    emoji: '🍺',
    wins: 0,
    trips: 2,
    bio: 'Better at the 19th hole than the other 18. Somehow always has a beer in hand.',
  },
  {
    id: 'p4',
    name: 'Mike Thompson',
    nickname: 'Big Stick',
    handicap: 22,
    hometown: 'Atlanta, GA',
    emoji: '💪',
    wins: 0,
    trips: 3,
    bio: '300-yard drives into the woods. Every. Single. Time. Heart of gold.',
  },
  {
    id: 'p5',
    name: 'Ryan Smith',
    nickname: 'Eagle Eye',
    handicap: 5,
    hometown: 'Durham, NC',
    emoji: '🦅',
    wins: 3,
    trips: 3,
    bio: 'Three-time champion. Annoyingly consistent. Brings his own yardage book.',
  },
  {
    id: 'p6',
    name: 'Tyler Brown',
    nickname: 'T-Bone',
    handicap: 12,
    hometown: 'Chapel Hill, NC',
    emoji: '🔥',
    wins: 1,
    trips: 2,
    bio: 'Goes hot or cold. When he\'s on, he\'s dangerous. When he\'s off... pray for him.',
  },
  {
    id: 'p7',
    name: 'Will Wilson',
    nickname: 'Bogey Man',
    handicap: 20,
    hometown: 'Richmond, VA',
    emoji: '👻',
    wins: 0,
    trips: 1,
    bio: 'Rookie of the group. Plays better than his handicap suggests. Has no idea what he\'s doing.',
  },
  {
    id: 'p8',
    name: 'Sam Anderson',
    nickname: 'The Beast',
    handicap: 3,
    hometown: 'Greensboro, NC',
    emoji: '🐉',
    wins: 2,
    trips: 3,
    bio: 'Scratch golfer energy on a 3 handicap. Sandbagging allegations remain unconfirmed.',
  },
]

// ─── Courses ──────────────────────────────────────────────────────────────────

export const COURSES: Course[] = [
  {
    id: 'c1',
    name: 'Pinehurst No. 2',
    description:
      'The crown jewel of American golf. Donald Ross\'s 1907 masterpiece has hosted nine US Opens and remains the most celebrated course in the country. The famous crowned greens repel anything less than a perfectly struck shot—bring your patience and your short game.',
    location: 'Pinehurst, NC',
    par: 70,
    difficulty: 10,
    yards: 7588,
    bookingLink: 'https://www.pinehurst.com/golf/courses/no-2/',
    emoji: '👑',
    courseRating: 76.7,
    slopeRating: 145,
    holePars: [4, 4, 4, 3, 4, 5, 4, 3, 4, 4, 4, 3, 4, 4, 4, 5, 3, 4],
  },
  {
    id: 'c2',
    name: 'Tobacco Road Golf Club',
    description:
      'Mike Strantz\'s wild, unconventional creation is unlike anything you\'ve ever played. Dramatic elevation changes, blind shots, and massive waste areas carved through the North Carolina sandhills. Controversial, brilliant, and unforgettable—you\'ll either love it or lose your mind.',
    location: 'Sanford, NC',
    par: 71,
    difficulty: 8,
    yards: 6554,
    bookingLink: 'https://www.tobaccoroadgolf.com',
    emoji: '🌿',
    courseRating: 73.4,
    slopeRating: 138,
    holePars: [4, 3, 5, 4, 4, 3, 4, 5, 4, 4, 3, 4, 4, 5, 4, 3, 4, 4],
  },
  {
    id: 'c3',
    name: 'Mid Pines Inn & Golf Club',
    description:
      'A Donald Ross classic from 1921, Mid Pines offers the perfect balance of challenge and playability. Impeccably conditioned fairways, classic bunkering, and old-school resort charm make this the fan favorite of every trip. The lunch at the inn is mandatory.',
    location: 'Southern Pines, NC',
    par: 72,
    difficulty: 7,
    yards: 6515,
    bookingLink: 'https://www.midpines.com/golf',
    emoji: '🌲',
    courseRating: 72.1,
    slopeRating: 131,
    holePars: [4, 3, 5, 4, 4, 4, 3, 5, 4, 4, 4, 3, 5, 4, 4, 3, 4, 5],
  },
]

// ─── Rounds ───────────────────────────────────────────────────────────────────

export const ROUNDS: Round[] = [
  {
    id: 'r1',
    courseId: 'c1',
    roundNumber: 1,
    date: 'Friday, Oct 9',
    teeTime: '8:00 AM',
  },
  {
    id: 'r2',
    courseId: 'c2',
    roundNumber: 2,
    date: 'Saturday, Oct 10',
    teeTime: '8:30 AM',
  },
  {
    id: 'r3',
    courseId: 'c3',
    roundNumber: 3,
    date: 'Sunday, Oct 11',
    teeTime: '9:00 AM',
  },
]

// ─── Score Generation ─────────────────────────────────────────────────────────

function seededRng(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

function generateHoleScores(
  playerId: string,
  roundNum: number,
  holePars: number[],
  handicap: number
): number[] {
  const seed =
    playerId.charCodeAt(1) * 997 + roundNum * 137 + handicap * 31
  const rng = seededRng(seed)

  return holePars.map((par) => {
    const r = rng()
    let score: number
    if (handicap <= 5) {
      score =
        r < 0.08 ? par - 1 : r < 0.50 ? par : r < 0.82 ? par + 1 : par + 2
    } else if (handicap <= 12) {
      score =
        r < 0.04 ? par - 1 : r < 0.32 ? par : r < 0.68 ? par + 1 : r < 0.90 ? par + 2 : par + 3
    } else if (handicap <= 18) {
      score =
        r < 0.02 ? par - 1 : r < 0.20 ? par : r < 0.52 ? par + 1 : r < 0.80 ? par + 2 : par + 3
    } else {
      score =
        r < 0.15 ? par : r < 0.42 ? par + 1 : r < 0.70 ? par + 2 : r < 0.90 ? par + 3 : par + 4
    }
    return score
  })
}

export interface Scorecard {
  playerId: string
  roundId: string
  scores: number[]
  total: number
  toPar: number
}

function buildScorecards(): Scorecard[] {
  const cards: Scorecard[] = []
  for (const round of ROUNDS) {
    const course = COURSES.find((c) => c.id === round.courseId)!
    for (const player of PLAYERS) {
      const scores = generateHoleScores(
        player.id,
        round.roundNumber,
        course.holePars,
        player.handicap
      )
      const total = scores.reduce((a, b) => a + b, 0)
      const toPar = total - course.par
      cards.push({ playerId: player.id, roundId: round.id, scores, total, toPar })
    }
  }
  return cards
}

export const SCORECARDS: Scorecard[] = buildScorecards()

// ─── Leaderboard ──────────────────────────────────────────────────────────────

export interface LeaderboardEntry {
  player: Player
  rounds: (number | null)[]  // gross score per round
  grossTotal: number
  netTotal: number
  toPar: number
}

export function buildLeaderboard(): LeaderboardEntry[] {
  return PLAYERS.map((player) => {
    const rounds = ROUNDS.map((round) => {
      const card = SCORECARDS.find(
        (s) => s.playerId === player.id && s.roundId === round.id
      )
      return card ? card.total : null
    })

    const played = rounds.filter((r): r is number => r !== null)
    const grossTotal = played.reduce((a, b) => a + b, 0)
    const parTotal = ROUNDS.reduce((acc, r) => {
      const course = COURSES.find((c) => c.id === r.courseId)!
      return acc + course.par
    }, 0)
    const toPar = grossTotal - parTotal
    const netTotal = grossTotal - player.handicap * ROUNDS.length

    return { player, rounds, grossTotal, netTotal, toPar }
  }).sort((a, b) => a.grossTotal - b.grossTotal)
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export interface PlayerStats {
  player: Player
  eagles: number
  birdies: number
  pars: number
  bogeys: number
  doublePlus: number
  bestRound: number
  avgScore: number
}

export function buildStats(): PlayerStats[] {
  return PLAYERS.map((player) => {
    const allScorecards = SCORECARDS.filter((s) => s.playerId === player.id)

    let eagles = 0, birdies = 0, pars = 0, bogeys = 0, doublePlus = 0
    for (const card of allScorecards) {
      const round = ROUNDS.find((r) => r.id === card.roundId)!
      const course = COURSES.find((c) => c.id === round.courseId)!
      card.scores.forEach((score, i) => {
        const diff = score - course.holePars[i]
        if (diff <= -2) eagles++
        else if (diff === -1) birdies++
        else if (diff === 0) pars++
        else if (diff === 1) bogeys++
        else doublePlus++
      })
    }

    const totals = allScorecards.map((c) => c.total)
    const bestRound = totals.length ? Math.min(...totals) : 0
    const avgScore = totals.length
      ? Math.round((totals.reduce((a, b) => a + b, 0) / totals.length) * 10) / 10
      : 0

    return { player, eagles, birdies, pars, bogeys, doublePlus, bestRound, avgScore }
  })
}

// ─── Itinerary ────────────────────────────────────────────────────────────────

export const ITINERARY: ItineraryDay[] = [
  {
    date: 'Oct 8, 2026',
    dayLabel: 'Arrival Day',
    dayOfWeek: 'Thursday',
    events: [
      {
        time: 'All Day',
        title: 'Travel to Pinehurst',
        description: 'Make your way to The Carolina Hotel. Check-in begins at 4 PM.',
        type: 'travel',
      },
      {
        time: '4:00 PM',
        title: 'Hotel Check-In',
        description: 'The Carolina Hotel, Pinehurst Resort — 80 Carolina Vista Dr, Pinehurst, NC 28374',
        link: 'https://www.pinehurst.com/lodging/carolina-hotel/',
        type: 'hotel',
      },
      {
        time: '6:30 PM',
        title: 'Welcome Drinks at The Ryder Cup Bar',
        description: 'Meet in the lobby bar. First round is on the trip fund.',
        type: 'party',
      },
      {
        time: '7:30 PM',
        title: 'Group Dinner — The Tavern at Pinehurst',
        description: 'Casual dinner together. Good food, cold beer, trash talk begins here.',
        type: 'dinner',
      },
    ],
  },
  {
    date: 'Oct 9, 2026',
    dayLabel: 'Round 1 — Pinehurst No. 2',
    dayOfWeek: 'Friday',
    events: [
      {
        time: '7:00 AM',
        title: 'Breakfast at The Manor',
        description: 'Fuel up. No one plays well hungry.',
        type: 'free',
      },
      {
        time: '8:00 AM',
        title: '⛳ Tee Time — Pinehurst No. 2',
        description: 'The Big One. Dress code enforced. Soft spikes required. Bring your A-game.',
        link: 'https://www.pinehurst.com/golf/courses/no-2/',
        type: 'golf',
      },
      {
        time: '1:00 PM',
        title: 'Lunch & Score Tallying',
        description: 'Post-round lunch at the club. Leaderboard updates. Trash talk intensifies.',
        type: 'free',
      },
      {
        time: '4:00 PM',
        title: 'Free Afternoon',
        description: 'Practice range, pool, or nap. Your call.',
        type: 'free',
      },
      {
        time: '7:00 PM',
        title: 'Dinner — Dugan\'s Pub',
        description: 'Pinehurst\'s best burgers. Casual and delicious.',
        type: 'dinner',
      },
    ],
  },
  {
    date: 'Oct 10, 2026',
    dayLabel: 'Round 2 — Tobacco Road',
    dayOfWeek: 'Saturday',
    events: [
      {
        time: '7:00 AM',
        title: 'Breakfast',
        description: 'Get it together. Today is Tobacco Road.',
        type: 'free',
      },
      {
        time: '8:30 AM',
        title: '⛳ Tee Time — Tobacco Road Golf Club',
        description: 'Blind shots, massive waste areas, and an identity crisis. Welcome to Tobacco Road.',
        link: 'https://www.tobaccoroadgolf.com',
        type: 'golf',
      },
      {
        time: '1:30 PM',
        title: 'Lunch at Tobacco Road',
        description: 'They have a great grill. Reflect on what just happened to you out there.',
        type: 'free',
      },
      {
        time: '3:00 PM',
        title: 'Free Time',
        description: 'Return to hotel. Optional putting contest on the practice green.',
        type: 'free',
      },
      {
        time: '7:30 PM',
        title: 'Group Dinner & Awards Night',
        description: 'Saturday night dinner at Pinehurst Brewing Co. Mid-trip awards ceremony. Categories TBD.',
        type: 'party',
      },
    ],
  },
  {
    date: 'Oct 11, 2026',
    dayLabel: 'Round 3 — Mid Pines',
    dayOfWeek: 'Sunday',
    events: [
      {
        time: '7:30 AM',
        title: 'Breakfast at Mid Pines Inn',
        description: 'Arrive early and enjoy the inn\'s classic Southern breakfast.',
        type: 'free',
      },
      {
        time: '9:00 AM',
        title: '⛳ Tee Time — Mid Pines Inn & Golf Club',
        description: 'Final round. Championship on the line. Make it count.',
        link: 'https://www.midpines.com/golf',
        type: 'golf',
      },
      {
        time: '1:00 PM',
        title: '🏆 Final Leaderboard & Champion Crowned',
        description: 'Wheelbarrow Invitational champion announced. Trophy photo. Eternal glory.',
        type: 'party',
      },
      {
        time: '2:00 PM',
        title: 'Check-Out & Safe Travels',
        description: 'Hotel check-out by 11 AM. Goodbyes, see you next year.',
        type: 'travel',
      },
    ],
  },
]

// ─── Polls (default placeholder) ─────────────────────────────────────────────

export const DEFAULT_POLLS: Poll[] = [
  {
    id: 'poll1',
    question: 'Which weekend works best for next year\'s trip?',
    type: 'dates',
    isOpen: true,
    createdAt: '2026-03-01',
    options: [
      { id: 'o1', text: 'October 8–11, 2026', votes: ['Max Riemer', 'Jake Powell', 'Ryan Smith', 'Sam Anderson'] },
      { id: 'o2', text: 'October 15–18, 2026', votes: ['Chris Davis', 'Mike Thompson'] },
      { id: 'o3', text: 'November 5–8, 2026', votes: ['Tyler Brown', 'Will Wilson'] },
    ],
  },
  {
    id: 'poll2',
    question: 'Which 4th course should we add as an alternate?',
    type: 'courses',
    isOpen: true,
    createdAt: '2026-03-05',
    options: [
      { id: 'o4', text: 'Pinehurst No. 4', votes: ['Sam Anderson', 'Ryan Smith', 'Jake Powell'] },
      { id: 'o5', text: 'Dormie Club', votes: ['Max Riemer', 'Tyler Brown'] },
      { id: 'o6', text: 'Pine Needles', votes: ['Chris Davis', 'Will Wilson', 'Mike Thompson'] },
    ],
  },
  {
    id: 'poll3',
    question: 'What format should we use for scoring?',
    type: 'general',
    isOpen: false,
    createdAt: '2026-02-20',
    options: [
      { id: 'o7', text: 'Stroke play (individual)', votes: ['Sam Anderson', 'Ryan Smith', 'Jake Powell', 'Max Riemer', 'Tyler Brown'] },
      { id: 'o8', text: 'Stableford points', votes: ['Chris Davis', 'Will Wilson'] },
      { id: 'o9', text: 'Match play (partners)', votes: ['Mike Thompson'] },
    ],
  },
]

export const TRIP_START_DATE = new Date('2026-10-08T12:00:00')
export const HOTEL_LINK = 'https://www.pinehurst.com/lodging/carolina-hotel/'
