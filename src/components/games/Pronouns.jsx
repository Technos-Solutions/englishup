import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { speak, startListening, isSpeechSupported } from '../../lib/speech'
import { awardXP } from '../../lib/xp'
import { PRONOUNS, PRONOUN_CATEGORIES } from '../../data/pronouns'
import { LEVELS } from '../../data/levels'
import { playCorrect, playWrong, playXP } from '../../lib/sounds'

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

function getOptions(correct, pool) {
  const wrong = shuffle(pool.filter(p => p.en !== correct)).slice(0, 3).map(p => p.en)
  return shuffle([correct, ...wrong])
}

export default function Pronouns() {
  const { profile, refreshProfile } = useAuth()
  const userLevelIdx = LEVELS.findIndex(l => l.code === (profile?.level || 'A1'))

  const eligible = PRONOUNS.filter(p => {
    const pIdx = LEVELS.findIndex(l => l.code === p.level)
    return pIdx <= userLevelIdx
  })

  const [mode, setMode] = useState(null)
  const [category, setCategory] = useState('all')
  const [queue, setQueue] = useState([])
  const [current, setCurrent] = useState(null)
  const [options, setOptions] = useState([])
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [listening, setListening] = useState(false)
  const [heard, setHeard] = useState('')
  const [score, setScore] = useState({ correct: 0, wrong: 0 })
  const [finished, setFinished] = useState(false)
  const [xpEarned, setXpEarned] = useState(0)

  const availableCategories = [...new Set(eligible.map(p => p.type))]
  const roundsTotal = 10

  function startGame(selectedMode) {
    const pool = category === 'all' ? eligible : eligible.filter(p => p.type === category)
    const q = shuffle(pool).slice(0, Math.min(roundsTotal, pool.length))
    setMode(selectedMode)
    setQueue(q)
    setCurrent(q[0])
    setOptions(getOptions(q[0].en, pool.length >= 4 ? pool : eligible))
  }

  function handleSelect(opt) {
    if (selected) return
    setSelected(opt)
    setRevealed(true)
    if (opt === current.en) { playCorrect(); speak(opt) } else playWrong()
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
    const pool = category === 'all' ? eligible : eligible.filter(p => p.type === category)
    setQueue(rest)
    setCurrent(rest[0])
    setOptions(getOptions(rest[0].en, pool.length >= 4 ? pool : eligible))
    setSelected(null)
    setRevealed(false)
    setHeard('')
  }

  async function endGame(lastCorrect) {
    setFinished(true)
    playXP()
    const total = score.correct + score.wrong + 1
    const correct = score.correct + (lastCorrect ? 1 : 0)
    const xp = Math.max(3, Math.round(20 * (correct / total)))
    await awardXP(profile.id, xp, 'pronouns')
    await refreshProfile()
    setXpEarned(xp)
  }

  // Mode selection
  if (!mode) {
    return (
      <div className="max-w-md mx-auto space-y-6 py-4">
        <div className="text-center">
          <div className="text-5xl mb-2">👤</div>
          <h1 className="text-2xl font-bold text-gray-900">Pronouns</h1>
          <p className="text-gray-500 mt-1">Català → English</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-600 mb-2">Category:</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setCategory('all')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${category === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              All
            </button>
            {availableCategories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${category === cat ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {PRONOUN_CATEGORIES[cat]?.icon} {PRONOUN_CATEGORIES[cat]?.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <button onClick={() => startGame('mc')}
            className="border-2 border-indigo-200 hover:border-indigo-400 bg-indigo-50 hover:bg-indigo-100 rounded-xl p-5 text-left transition-all">
            <div className="font-bold text-indigo-800 text-lg">📋 Multiple Choice</div>
            <div className="text-sm text-indigo-600 mt-1">Veu el pronom en català i tries la traducció anglesa.</div>
          </button>
          <button onClick={() => startGame('oral')}
            className="border-2 border-emerald-200 hover:border-emerald-400 bg-emerald-50 hover:bg-emerald-100 rounded-xl p-5 text-left transition-all">
            <div className="font-bold text-emerald-800 text-lg">🎙️ Oral</div>
            <div className="text-sm text-emerald-600 mt-1">Di el pronom en anglès en veu alta.</div>
          </button>
        </div>
      </div>
    )
  }

  if (finished) {
    return (
      <div className="text-center space-y-4 py-12 max-w-md mx-auto">
        <div className="text-6xl">👤</div>
        <h2 className="text-2xl font-bold text-gray-900">Pronouns done!</h2>
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
  const catInfo = PRONOUN_CATEGORIES[current.type]
  const isCorrect = selected === current.en || heard === current.en

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">👤 Pronouns</h2>
        <div className="flex gap-3 text-sm">
          <span className="text-emerald-600 font-bold">✓ {score.correct}</span>
          <span className="text-red-500 font-bold">✗ {score.wrong}</span>
          <span className="text-gray-400">{roundNum}/{roundsTotal}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center space-y-4">
        <span className="inline-block text-xs font-semibold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
          {catInfo?.icon} {catInfo?.label}
        </span>

        <div>
          <p className="text-sm text-gray-400 mb-1">How do you say in English…</p>
          <p className="text-4xl font-bold text-indigo-700">{current.cat}</p>
          <p className="text-xs text-gray-300 mt-2 italic">{catInfo?.desc}</p>
        </div>

        {/* MC Options */}
        {mode === 'mc' && (
          <div className="grid grid-cols-2 gap-3 pt-2">
            {options.map(opt => {
              const isAns = opt === current.en
              const isSel = opt === selected
              let cls = 'border-2 rounded-xl py-3 font-semibold text-sm transition-all '
              if (!selected) {
                cls += 'border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 text-gray-700'
              } else if (isAns) {
                cls += 'border-emerald-500 bg-emerald-50 text-emerald-700'
              } else if (isSel) {
                cls += 'border-red-400 bg-red-50 text-red-600'
              } else {
                cls += 'border-gray-100 bg-gray-50 text-gray-400'
              }
              return (
                <button key={opt} onClick={() => handleSelect(opt)} className={cls}>
                  {opt}
                  {selected && isAns && ' ✓'}
                  {selected && isSel && !isAns && ' ✗'}
                </button>
              )
            })}
          </div>
        )}

        {/* Oral */}
        {mode === 'oral' && !revealed && (
          <div className="space-y-3 pt-2">
            <button onClick={tryListen} disabled={listening}
              className={`w-full py-3 rounded-xl font-semibold transition-colors ${listening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
              {listening ? '🎙️ Listening…' : '🎙️ Say in English'}
            </button>
            <button onClick={() => setRevealed(true)} className="text-sm text-gray-400 hover:text-gray-600 w-full text-center">
              Show answer
            </button>
          </div>
        )}

        {/* Result */}
        {revealed && (
          <div className="space-y-3 pt-2">
            <div className={`rounded-xl p-3 ${isCorrect ? 'bg-emerald-50' : 'bg-amber-50'}`}>
              <p className={`text-2xl font-bold ${isCorrect ? 'text-emerald-700' : 'text-amber-700'}`}>{current.en}</p>
              {!isCorrect && <p className="text-xs text-amber-600 mt-1">You said: "{heard || selected}"</p>}
            </div>

            {mode === 'mc' ? (
              <button onClick={() => next(selected === current.en)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl">
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
