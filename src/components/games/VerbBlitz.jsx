import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { speak, startListening, isSpeechSupported } from '../../lib/speech'
import { awardXP, XP_REWARDS } from '../../lib/xp'
import { IRREGULAR_VERBS } from '../../data/verbs'
import { playCorrect, playWrong, playXP } from '../../lib/sounds'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function getOptions(correct, pool) {
  const wrong = shuffle(pool.filter(v => v.past !== correct)).slice(0, 3).map(v => v.past)
  return shuffle([correct, ...wrong])
}

export default function VerbBlitz() {
  const { profile, refreshProfile } = useAuth()
  const eligibleVerbs = IRREGULAR_VERBS

  const [mode, setMode] = useState(null) // 'mc' | 'oral'
  const [queue, setQueue] = useState([])
  const [current, setCurrent] = useState(null)
  const [options, setOptions] = useState([])
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState({ correct: 0, wrong: 0 })
  const [listening, setListening] = useState(false)
  const [heard, setHeard] = useState('')
  const [finished, setFinished] = useState(false)
  const [xpEarned, setXpEarned] = useState(0)
  const roundsTotal = 10

  function startGame(selectedMode) {
    const q = shuffle(eligibleVerbs).slice(0, roundsTotal)
    setMode(selectedMode)
    setQueue(q)
    setCurrent(q[0])
    setOptions(getOptions(q[0].past, eligibleVerbs))
  }

  function playVerb() { if (current) speak(current.base) }

  function handleMCSelect(opt) {
    if (selected) return
    setSelected(opt)
    setRevealed(true)
    if (opt === current.past) playCorrect(); else playWrong()
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

  function next(correct) {
    setScore(s => ({ correct: s.correct + (correct ? 1 : 0), wrong: s.wrong + (correct ? 0 : 1) }))
    const [, ...rest] = queue
    if (rest.length === 0) return endGame(correct)
    setQueue(rest)
    setCurrent(rest[0])
    setOptions(getOptions(rest[0].past, eligibleVerbs))
    setSelected(null)
    setRevealed(false)
    setHeard('')
  }

  async function endGame(lastCorrect) {
    setFinished(true)
    playXP()
    const total = score.correct + score.wrong + 1
    const correct = score.correct + (lastCorrect ? 1 : 0)
    const xp = Math.max(3, Math.round(XP_REWARDS.verb_blitz * (correct / total)))
    await awardXP(profile.id, xp, 'verb_blitz')
    await refreshProfile()
    setXpEarned(xp)
  }

  // Mode selection
  if (!mode) {
    return (
      <div className="max-w-md mx-auto text-center space-y-6 py-8">
        <div className="text-5xl">⚡</div>
        <h1 className="text-2xl font-bold text-gray-900">Verb Blitz</h1>
        <p className="text-gray-500">Irregular verbs — choose your mode</p>
        <div className="grid grid-cols-1 gap-3">
          <button onClick={() => startGame('mc')}
            className="border-2 border-indigo-200 hover:border-indigo-400 bg-indigo-50 hover:bg-indigo-100 rounded-xl p-5 text-left transition-all">
            <div className="font-bold text-indigo-800 text-lg">📋 Multiple Choice</div>
            <div className="text-sm text-indigo-600 mt-1">Tria la forma correcta entre 4 opcions. Ideal per aprendre.</div>
          </button>
          <button onClick={() => startGame('oral')}
            className="border-2 border-emerald-200 hover:border-emerald-400 bg-emerald-50 hover:bg-emerald-100 rounded-xl p-5 text-left transition-all">
            <div className="font-bold text-emerald-800 text-lg">🎙️ Oral</div>
            <div className="text-sm text-emerald-600 mt-1">Di la resposta en veu alta. Més difícil i més efectiu.</div>
          </button>
        </div>
      </div>
    )
  }

  if (finished) {
    return (
      <div className="text-center space-y-4 py-12 max-w-md mx-auto">
        <div className="text-6xl">⚡</div>
        <h2 className="text-2xl font-bold text-gray-900">Verb Blitz done!</h2>
        <p className="text-gray-500">{score.correct} correct out of {roundsTotal}</p>
        <p className="text-amber-500 font-bold text-xl">+{xpEarned} XP ⭐</p>
        <button onClick={() => { setMode(null); setFinished(false); setScore({ correct: 0, wrong: 0 }) }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-xl">
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

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center space-y-4">
        <p className="text-sm text-gray-400">Past tense of…</p>

        <button onClick={playVerb} className="group">
          <div className="text-5xl font-bold text-indigo-700 group-hover:text-indigo-900 transition-colors">
            {current.base}
          </div>
          <div className="text-base font-medium text-indigo-400 mt-1">({current.translation})</div>
          <p className="text-xs text-gray-300 group-hover:text-gray-400 mt-1">🔊 tap to hear</p>
        </button>

        {/* Multiple choice */}
        {mode === 'mc' && (
          <div className="grid grid-cols-2 gap-3 pt-2">
            {options.map(opt => {
              const isCorrect = opt === current.past
              const isSelected = opt === selected
              let cls = 'border-2 rounded-xl py-3 font-semibold text-sm transition-all '
              if (!selected) {
                cls += 'border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 text-gray-700'
              } else if (isCorrect) {
                cls += 'border-emerald-500 bg-emerald-50 text-emerald-700'
              } else if (isSelected) {
                cls += 'border-red-400 bg-red-50 text-red-600'
              } else {
                cls += 'border-gray-100 bg-gray-50 text-gray-400'
              }
              return (
                <button key={opt} onClick={() => handleMCSelect(opt)} className={cls}>
                  {opt}
                  {selected && isCorrect && ' ✓'}
                  {selected && isSelected && !isCorrect && ' ✗'}
                </button>
              )
            })}
          </div>
        )}

        {/* Oral mode */}
        {mode === 'oral' && !revealed && (
          <div className="space-y-3 pt-2">
            <button onClick={tryListen} disabled={listening}
              className={`w-full py-3 rounded-xl font-semibold transition-colors ${listening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
              {listening ? '🎙️ Listening…' : '🎙️ Say the answer'}
            </button>
            <button onClick={() => setRevealed(true)} className="text-sm text-gray-400 hover:text-gray-600">
              Show answer
            </button>
          </div>
        )}

        {/* Result */}
        {revealed && (
          <div className="space-y-4 pt-2">
            <div className="bg-emerald-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Past simple</p>
              <p className="text-2xl font-bold text-emerald-700">{current.past}</p>
              <p className="text-xs text-gray-400 mt-2">Past participle: <span className="font-semibold">{current.participle}</span></p>
            </div>
            {heard && <p className="text-sm text-gray-500">You said: <span className="font-semibold italic">"{heard}"</span></p>}

            {mode === 'mc' ? (
              <button onClick={() => next(selected === current.past)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors">
                Next →
              </button>
            ) : (
              <div className="flex gap-3">
                <button onClick={() => { playWrong(); next(false) }} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-3 rounded-xl">✗ Wrong</button>
                <button onClick={() => { playCorrect(); next(true) }} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl">✓ Right</button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="w-full bg-gray-100 rounded-full h-2">
        <div className="bg-amber-400 h-2 rounded-full transition-all" style={{ width: `${((roundNum - 1) / roundsTotal) * 100}%` }} />
      </div>
    </div>
  )
}
