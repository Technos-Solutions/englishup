import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { getLevelFromXP } from '../../lib/xp'

export default function Navbar() {
  const { profile } = useAuth()
  const location = useLocation()
  const level = profile ? getLevelFromXP(profile.xp) : null

  const links = [
    { to: '/dashboard',   label: 'Home',     icon: '🏠' },
    { to: '/games',       label: 'Games',    icon: '🎮' },
    { to: '/conversation',label: 'Talk',     icon: '🎙️' },
    { to: '/grammar',     label: 'Grammar',  icon: '📚' },
    { to: '/ranking',     label: 'Ranking',  icon: '🏆' },
    { to: '/trophies',    label: 'Trophies', icon: '🥇' },
  ]

  return (
    <nav className="bg-slate-950/70 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-xl bg-gradient-to-r from-violet-300 to-blue-300 bg-clip-text text-transparent">
          🎓 <span>EnjoyTalk</span>
        </Link>

        <div className="hidden sm:flex items-center gap-1">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
                location.pathname.startsWith(l.to)
                  ? 'bg-white/10 text-violet-200'
                  : 'text-indigo-200/70 hover:bg-white/5'
              }`}
            >
              {l.icon} {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {profile && (
            <div className="flex items-center gap-2 text-sm">
              <span className="font-bold text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-full">⭐ {profile.xp} XP</span>
              {level && <span className="text-xl" title={`${level.code} — ${level.name}`}>{level.icon}</span>}
              {profile.streak > 0 && (
                <span className="text-orange-300 font-bold bg-orange-400/10 border border-orange-400/20 px-2.5 py-1 rounded-full">🔥 {profile.streak}</span>
              )}
            </div>
          )}
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-indigo-300/60 hover:text-red-400 text-sm font-semibold transition-colors"
          >
            Exit
          </button>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-md border-t border-white/10 flex justify-around py-2 z-50">
        {links.map(l => (
          <Link
            key={l.to}
            to={l.to}
            className={`flex flex-col items-center text-xs gap-0.5 px-2 py-1 rounded-xl font-bold ${
              location.pathname.startsWith(l.to) ? 'text-violet-200 bg-white/10' : 'text-indigo-200/60'
            }`}
          >
            <span className="text-xl">{l.icon}</span>
            <span>{l.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
