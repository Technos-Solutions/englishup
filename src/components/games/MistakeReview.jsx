import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { speak, startListening, scorePhonetic, isSpeechSupported } from '../../lib/speech'
import { awardXP, XP_REWARDS } from '../../lib/xp'
import LevelUpModal from '../ui/LevelUpModal'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const STATES = { IDLE: 'idle', SPEAKING: 'speaking', LISTENING: 'listening', RESULT: 'result', DONE: 'done' }

export default function MistakeReview() {
  const { profile, refreshProfile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [queue, setQueue] = useState([])
  const [current, setCurrent] = useState(null)
  const [state, setState] = useState(STATES.IDLE)
  const [lastScore, setLastScore] = useState(null)
  const [scores, setScores] = useState([])
  const [xpEarned, setXpEarned] = useState(0)
  const [levelUp, setLevelUp] = useState(null)
  const roundsTotal = queue.length

  useEffect(() => {
    if (!profile) return
    supabase
      .from('sessions')
      .select('corrections')
      .eq('user_id', profile.id)
      .eq('game_type', 'conversation')
      .not('corrections', 'is', null)
      .order('created_at', { ascending: false })
      .limit(30)
      .then(({ data }) => {
        const all = (data || []).flatMap(s => s.corrections?.errors || [])
        const valid = all.filter(e => e?.original && e?.correction)
        const seen = new Set()
        const deduped = valid.filter(e => {
          const key = e.correction.toLowerCase().trim()
          if (seen.has(key)) return false
          seen.add(key)
          return true
        })
        const picked = shuffle(deduped).slice(0, 8)
        setQueue(picked)
        setCurrent(picked[0] || null)
        setLoading(false)
      })
  }, [profile?.id])

  function playCorrect() {
    setState(STATES.SPEAKING)
    speak(current.correction, () => setState(STATES.IDLE))
  }

  function startRepeat() {
    if (!isSpeechSupported()) {
      alert('Speech recognition requires Chrome or Edge.')
      return
    }
    setState(STATES.LISTENING)
    startListening(
      (transcript) => {
        const sc = scorePhonetic(current.correction, transcript)
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
    const xp = Math.round(XP_REWARDS.mistake_review * (avg / 100))
    const earned = Math.max(5, xp)
    const result = await awardXP(profile.id, earned, 'mistake_review')
    await refreshProfile()
    setXpEarned(earned)
    if (result?.leveledUp) setLevelUp(result.newLevel)
  }

  if (loading) return <div className="text-center text-indigo-200 py-12">Loading…</div>

  if (!current) {
    return (
      <div className="text-center space-y-4 py-12 max-w-md mx-auto">
        <div className="text-6xl">🎯</div>
        <h2 className="text-2xl font-bold text-white">Cap error per repassar!</h2>
        <p className="text-indigo-200">Encara no tens prou dades d'errors a converses — parla una mica més amb la IA i torna aquí.</p>
        <Link to="/conversation" className="btn-primary inline-block">
          Anar a Talk →
        </Link>
      </div>
    )
  }

  const roundNum = roundsTotal - queue.length + (state === STATES.RESULT || state === STATES.IDLE ? 1 : 0)

  if (state === STATES.DONE) {
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
    return (
      <div className="text-center space-y-4 py-12 max-w-md mx-auto">
        <div className="text-6xl">🎉</div>
        <h2 className="text-2xl font-bold text-white">Repàs complet!</h2>
        <p className="text-indigo-200">Precisió mitjana: <span className="font-bold text-violet-300">{avg}%</span></p>
        <p className="text-amber-500 font-bold text-xl">+{xpEarned} XP ⭐</p>
        <button onClick={() => window.location.reload()} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors">
          Repassar-ne més
        </button>
        {levelUp && <LevelUpModal level={levelUp} onClose={() => setLevelUp(null)} />}
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">🎯 Repàs d'errors</h2>
        <span className="text-sm text-indigo-300">{Math.min(roundNum, roundsTotal)} / {roundsTotal}</span>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Vas dir</p>
          <p className="text-sm text-red-500 line-through italic">"{current.original}"</p>
        </div>

        <p className="text-sm text-gray-400 text-center">Escolta la versió correcta i repeteix-la</p>

        <div className={`text-center text-lg font-medium text-gray-800 bg-gray-50 rounded-xl p-4 transition-all ${state === STATES.IDLE ? 'blur-sm select-none' : ''}`}>
          "{current.correction}"
        </div>

        {state === STATES.RESULT && lastScore !== null && (
          <div className={`text-center rounded-xl p-3 ${lastScore >= 70 ? 'bg-emerald-50 text-emerald-700' : lastScore >= 50 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-600'}`}>
            <p className="font-bold text-2xl">{lastScore}%</p>
            <p className="text-sm">{lastScore >= 70 ? 'Great job! 🔥' : lastScore >= 50 ? 'Not bad! Keep going 💪' : 'Keep practising! 🎯'}</p>
            {current.explanation && <p className="text-xs mt-2 opacity-80">{current.explanation}</p>}
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={playCorrect}
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
