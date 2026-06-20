import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import XPBar from './XPBar'

const QUICK_ACTIONS = [
  { to: '/conversation', icon: '🎙️', label: 'Start Conversation', desc: 'Talk with AI · earn XP', color: 'bg-indigo-600 hover:bg-indigo-700', text: 'text-white' },
  { to: '/games/listening', icon: '👂', label: 'Listening Match', desc: 'Hear & identify words', color: 'bg-blue-50 hover:bg-blue-100', text: 'text-blue-700' },
  { to: '/games/shadowing', icon: '🔁', label: 'Shadowing Blitz', desc: 'Repeat after the AI', color: 'bg-emerald-50 hover:bg-emerald-100', text: 'text-emerald-700' },
  { to: '/games/verbs',    icon: '⚡', label: 'Verb Blitz',       desc: 'Say the past tense', color: 'bg-amber-50 hover:bg-amber-100', text: 'text-amber-700' },
]

export default function Dashboard() {
  const { profile, refreshProfile } = useAuth()
  const [recentSessions, setRecentSessions] = useState([])

  useEffect(() => {
    if (!profile) return
    refreshProfile()
    supabase
      .from('sessions')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data }) => setRecentSessions(data || []))
  }, [profile?.id])

  if (!profile) return <div className="flex items-center justify-center h-64 text-gray-400">Loading…</div>

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{greeting}, {profile.username}! 👋</h1>
          <p className="text-gray-500 mt-0.5">Ready to practice English today?</p>
        </div>
        {profile.streak > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-2 text-center">
            <div className="text-2xl">🔥</div>
            <div className="font-bold text-orange-600 text-lg leading-none">{profile.streak}</div>
            <div className="text-xs text-orange-400">day streak</div>
          </div>
        )}
      </div>

      {/* XP Bar */}
      <XPBar xp={profile.xp} />

      {/* Quick actions */}
      <div>
        <h2 className="font-semibold text-gray-700 mb-3">What do you want to practice?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {QUICK_ACTIONS.map(a => (
            <Link
              key={a.to}
              to={a.to}
              className={`${a.color} ${a.text} rounded-2xl p-4 flex items-center gap-4 transition-colors`}
            >
              <span className="text-3xl">{a.icon}</span>
              <div>
                <p className="font-bold">{a.label}</p>
                <p className="text-sm opacity-75">{a.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      {recentSessions.length > 0 && (
        <div>
          <h2 className="font-semibold text-gray-700 mb-3">Recent Activity</h2>
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
            {recentSessions.map(s => (
              <div key={s.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    {s.game_type === 'conversation' ? '🎙️' :
                     s.game_type === 'listening_match' ? '👂' :
                     s.game_type === 'shadowing' ? '🔁' :
                     s.game_type === 'verb_blitz' ? '⚡' : '🎮'}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-800 capitalize">{s.game_type.replace('_', ' ')}</p>
                    <p className="text-xs text-gray-400">{new Date(s.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-amber-500">+{s.xp_earned} XP</p>
                  {s.fluency_score != null && (
                    <p className="text-xs text-gray-400">Fluency: {s.fluency_score}/100</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {recentSessions.length === 0 && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 text-center">
          <p className="text-indigo-700 font-medium">No sessions yet — start your first conversation! 🚀</p>
          <Link to="/conversation" className="inline-block mt-3 bg-indigo-600 text-white font-semibold px-6 py-2 rounded-xl hover:bg-indigo-700 transition-colors">
            Start now
          </Link>
        </div>
      )}
    </div>
  )
}
