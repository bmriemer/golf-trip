'use client'

import { useState, useEffect } from 'react'
import { TRIP_START_DATE } from '@/lib/data'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
}

function getTimeLeft(): TimeLeft {
  const diff = TRIP_START_DATE.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 }
  return {
    total: diff,
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)

  useEffect(() => {
    setTimeLeft(getTimeLeft())
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!timeLeft) {
    return (
      <div className="flex gap-3 md:gap-6 justify-center">
        {['Days', 'Hrs', 'Min', 'Sec'].map((unit) => (
          <div key={unit} className="flex flex-col items-center">
            <div className="bg-forest-800 border border-forest-600 rounded-xl w-16 md:w-20 h-16 md:h-20 flex items-center justify-center">
              <span className="text-2xl md:text-3xl font-bold text-gold-400 font-mono">--</span>
            </div>
            <span className="text-green-500 text-xs mt-1">{unit}</span>
          </div>
        ))}
      </div>
    )
  }

  if (timeLeft.total <= 0) {
    return (
      <div className="text-center">
        <p className="text-2xl font-serif text-gold-400 font-bold">🎉 It&apos;s Go Time!</p>
        <p className="text-green-400 text-sm mt-1">The Wheelbarrow Invitational is happening right now.</p>
      </div>
    )
  }

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hrs', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.minutes },
    { label: 'Sec', value: timeLeft.seconds },
  ]

  return (
    <div className="flex gap-3 md:gap-5 justify-center">
      {units.map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center">
          <div className="bg-forest-800 border border-gold-500/30 rounded-xl w-16 md:w-20 h-16 md:h-20 flex items-center justify-center glow-gold">
            <span className="text-2xl md:text-3xl font-bold text-gold-400 font-mono tabular-nums">
              {String(value).padStart(2, '0')}
            </span>
          </div>
          <span className="text-green-500 text-xs mt-1.5 font-medium">{label}</span>
        </div>
      ))}
    </div>
  )
}
