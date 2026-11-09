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
    <nav className="bg-white border-b-2 border-gray-100 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 font-extrabold text-indigo-600 text-xl">
          🎓 <span>EnglishUp</span>
        </Link>

        <div className="hidden sm:flex items-center gap-1">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
                location.pathname.startsWith(l.to)
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {l.icon} {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {profile && (
            <div className="flex items-center gap-2 text-sm">
              <span className="font-extrabold text-amber-500 bg-amber-50 px-2.5 py-1 rounded-full">⭐ {profile.xp} XP</span>
              {level && <span className="text-xl" title={`${level.code} — ${level.name}`}>{level.icon}</span>}
              {profile.streak > 0 && (
                <span className="text-orange-500 font-extrabold bg-orange-50 px-2.5 py-1 rounded-full">🔥 {profile.streak}</span>
              )}
            </div>
          )}
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-gray-400 hover:text-red-500 text-sm font-semibold transition-colors"
          >
            Exit
          </button>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-100 flex justify-around py-2 z-50">
        {links.map(l => (
          <Link
            key={l.to}
            to={l.to}
            className={`flex flex-col items-center text-xs gap-0.5 px-2 py-1 rounded-xl font-bold ${
              location.pathname.startsWith(l.to) ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500'
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
