'use client'

import { useState, useEffect, useCallback } from 'react'
import { PLAYERS } from '@/lib/data'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'

type Tab = 'roster' | 'teams'

export default function PlayersPage() {
  const [tab, setTab] = useState<Tab>('roster')
  const [confirmed, setConfirmed] = useState<Set<string>>(new Set())
  const [mounted, setMounted] = useState(false)
  const { isAdmin } = useAuth()

  const fetchConfirmed = useCallback(async () => {
    if (!supabase) return
    const { data } = await supabase.from('confirmed_players').select('player_id')
    if (data) setConfirmed(new Set(data.map((r: { player_id: string }) => r.player_id)))
  }, [])

  useEffect(() => {
    fetchConfirmed().then(() => setMounted(true))

    if (!supabase) {
      setMounted(true)
      return
    }

    const channel = supabase
      .channel('confirmed-players-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'confirmed_players' }, () => {
        fetchConfirmed()
      })
      .subscribe()

    return () => { supabase!.removeChannel(channel) }
  }, [fetchConfirmed])

  async function toggleConfirmed(playerId: string) {
    if (!supabase) return
    if (confirmed.has(playerId)) {
      await supabase.from('confirmed_players').delete().eq('player_id', playerId)
    } else {
      await supabase.from('confirmed_players').insert({ player_id: playerId })
    }
    fetchConfirmed()
  }

  const confirmedPlayers = PLAYERS.filter((p) => confirmed.has(p.id))
  const pendingPlayers = PLAYERS.filter((p) => !confirmed.has(p.id))

  const tabs = [
    { id: 'roster' as Tab, label: 'Roster', icon: '👤' },
    { id: 'teams' as Tab, label: 'Teams', icon: '🤝' },
  ]

  if (!mounted) return null

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-10 animate-fade-in">
      <h1 className="section-title mb-1">The Field</h1>
      <p className="text-slate-400 text-sm mb-6">
        {PLAYERS.length} players · World Golf Village, St. Augustine, FL · October 2026
      </p>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`tab-btn flex items-center gap-1.5 ${
              tab === t.id ? 'tab-btn-active' : 'tab-btn-inactive'
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── Roster ─────────────────────────────────────────────────────────── */}
      {tab === 'roster' && (
        <div className="space-y-8 animate-slide-up">
          {/* Confirmed */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest">
                Confirmed
              </h2>
              <span className="text-xs text-gold-400 bg-gold-400/10 border border-gold-400/30 px-2 py-0.5 rounded-full font-semibold">
                {confirmedPlayers.length}
              </span>
            </div>
            {confirmedPlayers.length === 0 ? (
              <p className="text-slate-600 text-sm italic">No players confirmed yet.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {confirmedPlayers.map((player) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    index={PLAYERS.indexOf(player)}
                    isConfirmed={true}
                    isAdmin={isAdmin}
                    onToggle={() => toggleConfirmed(player.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Not Yet Confirmed */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest">
                Not Yet Confirmed
              </h2>
              <span className="text-xs text-slate-500 bg-navy-800 border border-navy-700 px-2 py-0.5 rounded-full font-semibold">
                {pendingPlayers.length}
              </span>
            </div>
            {pendingPlayers.length === 0 ? (
              <p className="text-slate-600 text-sm italic">Everyone is confirmed!</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {pendingPlayers.map((player) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    index={PLAYERS.indexOf(player)}
                    isConfirmed={false}
                    isAdmin={isAdmin}
                    onToggle={() => toggleConfirmed(player.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Teams ──────────────────────────────────────────────────────────── */}
      {tab === 'teams' && (
        <div className="grid sm:grid-cols-2 gap-6 animate-slide-up">
          {['Team 1', 'Team 2'].map((team) => (
            <div key={team} className="card">
              <h2 className="font-serif font-bold text-slate-100 text-lg mb-1">{team}</h2>
              <p className="text-slate-500 text-xs mb-4 uppercase tracking-widest font-semibold">
                TBD
              </p>
              <p className="text-slate-600 text-sm italic">
                Teams coming soon — check back once the format is finalized.
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function PlayerCard({
  player,
  index,
  isConfirmed,
  isAdmin,
  onToggle,
}: {
  player: { id: string; name: string; initials: string }
  index: number
  isConfirmed: boolean
  isAdmin: boolean
  onToggle: () => void
}) {
  return (
    <div
      className={`card text-center group p-4 transition-colors ${
        isConfirmed
          ? 'border-gold-400/30 hover:border-gold-400/60'
          : 'hover:border-navy-600'
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 border-2 transition-colors ${
          isConfirmed
            ? 'bg-navy-800 border-gold-400/60 group-hover:border-gold-400'
            : 'bg-navy-800 border-navy-600 group-hover:border-navy-500'
        }`}
      >
        <span
          className={`font-serif font-bold text-base tracking-wide ${
            isConfirmed ? 'text-gold-400' : 'text-slate-500'
          }`}
        >
          {player.initials}
        </span>
      </div>

      {/* Number */}
      <div className="text-[10px] text-slate-600 font-semibold mb-1 uppercase tracking-widest">
        No. {index + 1}
      </div>

      {/* Name */}
      <div
        className={`font-serif font-semibold text-sm leading-snug mb-2 ${
          isConfirmed ? 'text-slate-100' : 'text-slate-400'
        }`}
      >
        {player.name}
      </div>

      {/* Status */}
      {isAdmin ? (
        <button
          onClick={onToggle}
          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-colors ${
            isConfirmed
              ? 'bg-gold-400/10 border-gold-400/40 text-gold-400 hover:bg-red-500/10 hover:border-red-500/40 hover:text-red-400'
              : 'bg-navy-800 border-navy-600 text-slate-500 hover:bg-gold-400/10 hover:border-gold-400/40 hover:text-gold-400'
          }`}
        >
          {isConfirmed ? '✓ Confirmed' : 'Mark Confirmed'}
        </button>
      ) : (
        <span
          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
            isConfirmed
              ? 'bg-gold-400/10 border-gold-400/40 text-gold-400'
              : 'bg-navy-800 border-navy-600 text-slate-600'
          }`}
        >
          {isConfirmed ? '✓ Confirmed' : 'TBD'}
        </span>
      )}
    </div>
  )
}
