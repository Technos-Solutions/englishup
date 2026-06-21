import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LEVELS } from '../../data/levels'

const GAMES = [
  {
    to: '/games/listening',
    icon: '👂',
    title: 'Listening Match',
    description: 'Hear a word, pick the right one. Audio first — always.',
    minLevel: 'A1',
    color: 'bg-blue-50 border-blue-200',
    badge: 'bg-blue-100 text-blue-700',
  },
  {
    to: '/games/shadowing',
    icon: '🔁',
    title: 'Shadowing Blitz',
    description: 'Listen to a sentence and repeat it. Scored on accuracy.',
    minLevel: 'A1',
    color: 'bg-emerald-50 border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  {
    to: '/games/verbs',
    icon: '⚡',
    title: 'Verb Blitz',
    description: 'Verb irregular + traducció → tria o di el passat. MC o oral.',
    minLevel: 'A2',
    color: 'bg-amber-50 border-amber-200',
    badge: 'bg-amber-100 text-amber-700',
  },
  {
    to: '/games/modals',
    icon: '🔧',
    title: 'Modal Verbs',
    description: 'Completa frases amb can, should, must, would, might... MC o oral.',
    minLevel: 'A1',
    color: 'bg-rose-50 border-rose-200',
    badge: 'bg-rose-100 text-rose-700',
  },
  {
    to: '/games/pronouns',
    icon: '👤',
    title: 'Pronouns',
    description: 'Català → Anglès: subjecte, objecte, possessiu, reflexiu. MC o oral.',
    minLevel: 'A1',
    color: 'bg-teal-50 border-teal-200',
    badge: 'bg-teal-100 text-teal-700',
  },
  {
    to: '/conversation',
    icon: '🎭',
    title: 'Roleplay',
    description: 'Full conversation with AI in a real scenario. Correction at the end.',
    minLevel: 'A1',
    color: 'bg-purple-50 border-purple-200',
    badge: 'bg-purple-100 text-purple-700',
  },
]

export default function GamesHub() {
  const { profile } = useAuth()
  const userLevelIdx = LEVELS.findIndex(l => l.code === (profile?.level || 'A1'))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">🎮 Games</h1>
        <p className="text-gray-500 mt-1">Oral first, always. Earn XP with every session.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {GAMES.map(g => {
          const minIdx = LEVELS.findIndex(l => l.code === g.minLevel)
          const locked = userLevelIdx < minIdx

          return (
            <div key={g.to} className={`border-2 ${g.color} rounded-2xl p-5 ${locked ? 'opacity-50' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{g.icon}</span>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${g.badge}`}>
                  {g.minLevel}+
                </span>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{g.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{g.description}</p>
              {locked ? (
                <div className="text-sm text-gray-400">🔒 Reach {g.minLevel} to unlock</div>
              ) : (
                <Link
                  to={g.to}
                  className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-colors"
                >
                  Play now →
                </Link>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
