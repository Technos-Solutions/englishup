import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { getLevelFromXP } from '../../lib/xp'

const MEDALS = ['🥇', '🥈', '🥉']

export default function Ranking() {
  const { profile } = useAuth()
  const [tab, setTab] = useState('global') // 'global' | 'weekly'
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRanking()
  }, [tab])

  async function fetchRanking() {
    setLoading(true)
    let query = supabase.from('profiles').select('id, username, xp, level, streak').order('xp', { ascending: false }).limit(50)

    if (tab === 'weekly') {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      const { data: sessionData } = await supabase
        .from('sessions')
        .select('user_id, xp_earned')
        .gte('created_at', weekAgo.toISOString())

      if (sessionData) {
        const weeklyXP = {}
        sessionData.forEach(s => {
          weeklyXP[s.user_id] = (weeklyXP[s.user_id] || 0) + s.xp_earned
        })
        const sorted = Object.entries(weeklyXP)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 50)

        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, username, xp, level, streak')
          .in('id', sorted.map(([id]) => id))

        if (profiles) {
          const enriched = sorted.map(([id, weekXP]) => ({
            ...profiles.find(p => p.id === id),
            weeklyXP: weekXP,
          })).filter(Boolean)
          setUsers(enriched)
        }
      }
      setLoading(false)
      return
    }

    const { data } = await query
    setUsers(data || [])
    setLoading(false)
  }

  const myRank = users.findIndex(u => u.id === profile?.id) + 1

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">🏆 Ranking</h1>
        <p className="text-gray-500 mt-1">Who's learning the most?</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {['global', 'weekly'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl font-semibold text-sm transition-colors capitalize ${
              tab === t ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t === 'global' ? '🌍 Global' : '📅 This Week'}
          </button>
        ))}
      </div>

      {/* My rank */}
      {myRank > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl px-5 py-3 flex items-center justify-between">
          <p className="text-indigo-700 font-semibold">Your rank: #{myRank}</p>
          <p className="text-indigo-500 text-sm">⭐ {profile?.xp?.toLocaleString()} XP</p>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="text-center text-gray-400 py-12">Loading ranking…</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {users.map((u, i) => {
            const isMe = u.id === profile?.id
            const level = getLevelFromXP(u.xp)
            return (
              <div
                key={u.id}
                className={`flex items-center gap-4 px-5 py-4 border-b border-gray-50 last:border-0 ${isMe ? 'bg-indigo-50' : ''}`}
              >
                <span className="text-xl w-8 text-center font-bold text-gray-400">
                  {i < 3 ? MEDALS[i] : `#${i + 1}`}
                </span>
                <span className="text-xl">{level.icon}</span>
                <div className="flex-1">
                  <p className={`font-semibold ${isMe ? 'text-indigo-700' : 'text-gray-900'}`}>
                    {u.username} {isMe && '(you)'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {u.level} · {u.streak > 0 ? `🔥 ${u.streak} streak` : 'no streak'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-amber-500">
                    {tab === 'weekly' ? `+${u.weeklyXP?.toLocaleString()}` : u.xp?.toLocaleString()} XP
                  </p>
                </div>
              </div>
            )
          })}
          {users.length === 0 && (
            <div className="text-center text-gray-400 py-12">No data yet. Be the first! 🚀</div>
          )}
        </div>
      )}
    </div>
  )
}
