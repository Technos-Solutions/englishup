import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { speak, startListening, scorePhonetic, isSpeechSupported } from '../../lib/speech'
import { awardXP, XP_REWARDS } from '../../lib/xp'
import { SHADOWING_SENTENCES } from '../../data/scenarios'

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

const STATES = { IDLE: 'idle', SPEAKING: 'speaking', LISTENING: 'listening', RESULT: 'result', DONE: 'done' }

export default function ShadowingBlitz() {
  const { profile, refreshProfile } = useAuth()
  const level = profile?.level || 'A1'
  const sentences = SHADOWING_SENTENCES[level] || SHADOWING_SENTENCES.A1

  const [queue, setQueue] = useState([])
  const [current, setCurrent] = useState('')
  const [state, setState] = useState(STATES.IDLE)
  const [lastScore, setLastScore] = useState(null)
  const [scores, setScores] = useState([])
  const [xpEarned, setXpEarned] = useState(0)
  const roundsTotal = Math.min(6, sentences.length)

  useEffect(() => {
    const q = shuffle(sentences).slice(0, roundsTotal)
    setQueue(q)
    setCurrent(q[0])
  }, [])

  function playSentence() {
    setState(STATES.SPEAKING)
    speak(current, () => setState(STATES.IDLE))
  }

  function startRepeat() {
    if (!isSpeechSupported()) {
      alert('Speech recognition requires Chrome or Edge.')
      return
    }
    setState(STATES.LISTENING)
    startListening(
      (transcript) => {
        const sc = scorePhonetic(current, transcript)
        setLastScore(sc)
        setScores(prev => [...prev, sc])
        setState(STATES.RESULT)
      },
      () => setState(STATES.IDLE)
    )
  }

  function nextRound() {
    const [, ...rest] = queue
    if (rest.length === 0) return endGame()
    setQueue(rest)
    setCurrent(rest[0])
    setLastScore(null)
    setState(STATES.IDLE)
  }

  async function endGame() {
    setState(STATES.DONE)
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
    const xp = Math.round(XP_REWARDS.shadowing * (avg / 100))
    const earned = Math.max(5, xp)
    await awardXP(profile.id, earned, 'shadowing')
    await refreshProfile()
    setXpEarned(earned)
  }

  const roundNum = roundsTotal - queue.length + (state === STATES.RESULT || state === STATES.IDLE ? 1 : 0)

  if (state === STATES.DONE) {
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
    return (
      <div className="text-center space-y-4 py-12 max-w-md mx-auto">
        <div className="text-6xl">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900">Shadowing complete!</h2>
        <p className="text-gray-500">Average accuracy: <span className="font-bold text-indigo-600">{avg}%</span></p>
        <p className="text-amber-500 font-bold text-xl">+{xpEarned} XP ⭐</p>
        <button onClick={() => window.location.reload()} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors">
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">🔁 Shadowing Blitz</h2>
        <span className="text-sm text-gray-400">{Math.min(roundNum, roundsTotal)} / {roundsTotal}</span>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <p className="text-sm text-gray-400 text-center">Listen to the sentence, then repeat it</p>

        {/* Sentence (hidden until played) */}
        <div className={`text-center text-lg font-medium text-gray-800 bg-gray-50 rounded-xl p-4 transition-all ${state === STATES.IDLE ? 'blur-sm select-none' : ''}`}>
          "{current}"
        </div>

        {state === STATES.RESULT && lastScore !== null && (
          <div className={`text-center rounded-xl p-3 ${lastScore >= 70 ? 'bg-emerald-50 text-emerald-700' : lastScore >= 50 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-600'}`}>
            <p className="font-bold text-2xl">{lastScore}%</p>
            <p className="text-sm">{lastScore >= 70 ? 'Great job! 🔥' : lastScore >= 50 ? 'Not bad! Keep going 💪' : 'Keep practising! 🎯'}</p>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={playSentence}
            disabled={state === STATES.SPEAKING || state === STATES.LISTENING}
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-5 py-3 rounded-xl transition-colors disabled:opacity-40"
          >
            🔊 Play
          </button>
          {state !== STATES.RESULT && (
            <button
              onClick={startRepeat}
              disabled={state === STATES.SPEAKING || state === STATES.LISTENING}
              className={`font-semibold px-5 py-3 rounded-xl transition-colors disabled:opacity-40 ${
                state === STATES.LISTENING
                  ? 'bg-red-100 text-red-600 animate-pulse'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {state === STATES.LISTENING ? '⏹ Stop' : '🎙️ Repeat'}
            </button>
          )}
          {state === STATES.RESULT && (
            <button
              onClick={nextRound}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-3 rounded-xl transition-colors"
            >
              Next →
            </button>
          )}
        </div>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className="bg-indigo-500 h-2 rounded-full transition-all"
          style={{ width: `${((roundsTotal - queue.length) / roundsTotal) * 100}%` }}
        />
      </div>
    </div>
  )
}
