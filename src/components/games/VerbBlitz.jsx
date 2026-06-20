import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { speak, startListening, isSpeechSupported } from '../../lib/speech'
import { awardXP, XP_REWARDS } from '../../lib/xp'
import { IRREGULAR_VERBS } from '../../data/verbs'
import { LEVELS } from '../../data/levels'

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

export default function VerbBlitz() {
  const { profile, refreshProfile } = useAuth()
  const userLevelIdx = LEVELS.findIndex(l => l.code === (profile?.level || 'A1'))

  const eligibleVerbs = IRREGULAR_VERBS.filter(v => {
    const vIdx = LEVELS.findIndex(l => l.code === v.level)
    return vIdx <= userLevelIdx
  })

  const [queue, setQueue] = useState([])
  const [current, setCurrent] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState({ correct: 0, wrong: 0 })
  const [listening, setListening] = useState(false)
  const [heard, setHeard] = useState('')
  const [finished, setFinished] = useState(false)
  const [xpEarned, setXpEarned] = useState(0)
  const roundsTotal = 10

  useEffect(() => {
    const q = shuffle(eligibleVerbs).slice(0, roundsTotal)
    setQueue(q)
    setCurrent(q[0])
  }, [])

  function playVerb() {
    if (current) speak(current.base)
  }

  function tryListen() {
    if (!isSpeechSupported()) { setRevealed(true); return }
    setListening(true)
    startListening(
      (transcript) => {
        setHeard(transcript.toLowerCase().trim())
        setListening(false)
        setRevealed(true)
      },
      () => { setListening(false); setRevealed(true) }
    )
  }

  function markResult(correct) {
    setScore(s => ({ correct: s.correct + (correct ? 1 : 0), wrong: s.wrong + (correct ? 0 : 1) }))
    const [, ...rest] = queue
    if (rest.length === 0) return endGame()
    setQueue(rest)
    setCurrent(rest[0])
    setRevealed(false)
    setHeard('')
  }

  async function endGame() {
    setFinished(true)
    const total = score.correct + score.wrong + 1
    const xp = Math.round(XP_REWARDS.verb_blitz * (score.correct / total))
    const earned = Math.max(3, xp)
    await awardXP(profile.id, earned, 'verb_blitz')
    await refreshProfile()
    setXpEarned(earned)
  }

  if (finished) {
    return (
      <div className="text-center space-y-4 py-12 max-w-md mx-auto">
        <div className="text-6xl">⚡</div>
        <h2 className="text-2xl font-bold text-gray-900">Verb Blitz done!</h2>
        <p className="text-gray-500">{score.correct} correct out of {roundsTotal}</p>
        <p className="text-amber-500 font-bold text-xl">+{xpEarned} XP ⭐</p>
        <button onClick={() => window.location.reload()} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-xl">
          Try again
        </button>
      </div>
    )
  }

  if (!current) return <div className="text-center text-gray-400 py-12">Loading…</div>

  const roundNum = roundsTotal - queue.length + 1

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">⚡ Verb Blitz</h2>
        <div className="flex gap-3 text-sm">
          <span className="text-emerald-600 font-bold">✓ {score.correct}</span>
          <span className="text-red-500 font-bold">✗ {score.wrong}</span>
          <span className="text-gray-400">{roundNum}/{roundsTotal}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center space-y-5">
        <p className="text-sm text-gray-400">What is the past tense of…</p>

        <button onClick={playVerb} className="group">
          <div className="text-5xl font-bold text-indigo-700 mb-1 group-hover:text-indigo-900 transition-colors">
            {current.base}
          </div>
          <p className="text-xs text-gray-300 group-hover:text-gray-400">🔊 tap to hear</p>
        </button>

        {!revealed ? (
          <div className="space-y-3">
            <button
              onClick={tryListen}
              disabled={listening}
              className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                listening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {listening ? '🎙️ Listening…' : '🎙️ Say the answer'}
            </button>
            <button onClick={() => setRevealed(true)} className="text-sm text-gray-400 hover:text-gray-600">
              Show answer
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-emerald-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Past simple</p>
              <p className="text-2xl font-bold text-emerald-700">{current.past}</p>
              <p className="text-xs text-gray-400 mt-2">Past participle: <span className="font-semibold">{current.participle}</span></p>
            </div>
            {heard && (
              <p className="text-sm text-gray-500">You said: <span className="font-semibold italic">"{heard}"</span></p>
            )}
            <div className="flex gap-3">
              <button onClick={() => markResult(false)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-3 rounded-xl transition-colors">
                ✗ Got it wrong
              </button>
              <button onClick={() => markResult(true)} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-colors">
                ✓ Got it right
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="w-full bg-gray-100 rounded-full h-2">
        <div className="bg-amber-400 h-2 rounded-full transition-all" style={{ width: `${((roundNum - 1) / roundsTotal) * 100}%` }} />
      </div>
    </div>
  )
}
