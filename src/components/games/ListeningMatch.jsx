import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { speak } from '../../lib/speech'
import { awardXP, XP_REWARDS } from '../../lib/xp'
import { LISTENING_WORDS } from '../../data/scenarios'

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function ListeningMatch() {
  const { profile, refreshProfile } = useAuth()
  const level = profile?.level || 'A1'
  const wordList = LISTENING_WORDS[level] || LISTENING_WORDS.A1

  const [queue, setQueue] = useState([])
  const [current, setCurrent] = useState(null)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [finished, setFinished] = useState(false)
  const [hasSpoken, setHasSpoken] = useState(false)
  const [xpEarned, setXpEarned] = useState(0)

  useEffect(() => {
    const shuffled = shuffle(wordList).slice(0, 8)
    setQueue(shuffled)
    loadNext(shuffled)
  }, [])

  function loadNext(q) {
    if (!q || q.length === 0) return finish()
    const [next, ...rest] = q
    setQueue(rest)
    setCurrent({ ...next, options: shuffle(next.options) })
    setSelected(null)
    setHasSpoken(false)
  }

  function handleSpeak() {
    if (!current) return
    speak(current.word)
    setHasSpoken(true)
  }

  function handleSelect(option) {
    if (selected || !hasSpoken) return
    setSelected(option)
    const correct = option === current.word
    setScore(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }))
    setTimeout(() => loadNext(queue), 1200)
  }

  async function finish() {
    setFinished(true)
    const xp = Math.round(XP_REWARDS.listening_match * (score.correct / Math.max(score.total, 1)))
    const earned = Math.max(5, xp)
    await awardXP(profile.id, earned, 'listening_match')
    await refreshProfile()
    setXpEarned(earned)
  }

  if (finished) {
    return (
      <div className="text-center space-y-4 py-12">
        <div className="text-6xl">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900">Well done!</h2>
        <p className="text-gray-500">{score.correct} / {score.total} correct</p>
        <p className="text-amber-500 font-bold text-xl">+{xpEarned} XP ⭐</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Play again
        </button>
      </div>
    )
  }

  if (!current) return <div className="text-center text-gray-400 py-12">Loading…</div>

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">👂 Listening Match</h2>
        <span className="text-sm text-gray-400">{score.total + 1} / {wordList.slice(0, 8).length}</span>
      </div>

      <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
        <p className="text-sm text-gray-400 mb-4">
          {hasSpoken ? 'Which word did you hear?' : 'Press play to hear the word'}
        </p>

        <button
          onClick={handleSpeak}
          className="w-24 h-24 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-4xl mx-auto flex items-center justify-center transition-colors shadow-lg hover:scale-105"
        >
          🔊
        </button>

        {!hasSpoken && (
          <p className="text-xs text-indigo-400 mt-3">👆 Listen first, then pick</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {current.options.map(opt => {
          let style = 'bg-white border-2 border-gray-200 text-gray-800 hover:border-indigo-300'
          if (selected) {
            if (opt === current.word) style = 'bg-emerald-500 border-emerald-500 text-white'
            else if (opt === selected) style = 'bg-red-100 border-red-400 text-red-700'
            else style = 'bg-gray-50 border-gray-200 text-gray-400'
          }
          return (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              disabled={!hasSpoken || !!selected}
              className={`${style} rounded-xl py-4 font-semibold text-lg transition-all disabled:cursor-not-allowed`}
            >
              {opt}
            </button>
          )
        })}
      </div>

      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className="bg-indigo-500 h-2 rounded-full transition-all"
          style={{ width: `${(score.total / 8) * 100}%` }}
        />
      </div>
    </div>
  )
}
