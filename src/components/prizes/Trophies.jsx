import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { ACHIEVEMENTS } from '../../data/achievements'

export default function Trophies() {
  const { profile } = useAuth()
  const [earned, setEarned] = useState(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    supabase
      .from('achievements')
      .select('achievement_type')
      .eq('user_id', profile.id)
      .then(({ data }) => {
        setEarned(new Set((data || []).map(a => a.achievement_type)))
        setLoading(false)
      })
  }, [profile?.id])

  const earnedCount = ACHIEVEMENTS.filter(a => earned.has(a.id)).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">🏆 Trophies</h1>
        <p className="text-gray-500 mt-1">{earnedCount} / {ACHIEVEMENTS.length} unlocked</p>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div
            className="bg-amber-400 h-3 rounded-full transition-all duration-700"
            style={{ width: `${(earnedCount / ACHIEVEMENTS.length) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-400 mt-2 text-center">{earnedCount} of {ACHIEVEMENTS.length} trophies</p>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-12">Loading…</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {ACHIEVEMENTS.map(a => {
            const isEarned = earned.has(a.id)
            return (
              <div
                key={a.id}
                className={`rounded-2xl p-4 text-center border-2 transition-all ${
                  isEarned
                    ? 'bg-amber-50 border-amber-200 shadow-sm'
                    : 'bg-gray-50 border-gray-100 opacity-50 grayscale'
                }`}
              >
                <div className="text-4xl mb-2">{a.icon}</div>
                <p className={`font-bold text-sm ${isEarned ? 'text-gray-900' : 'text-gray-500'}`}>
                  {a.name}
                </p>
                <p className="text-xs text-gray-400 mt-1">{a.description}</p>
                {isEarned && <div className="mt-2 text-xs font-semibold text-amber-500">✓ Earned</div>}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
