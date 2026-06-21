import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { speak, startListening, isSpeechSupported } from '../../lib/speech'
import { awardXP } from '../../lib/xp'
import { MODAL_EXERCISES } from '../../data/modals'
import { LEVELS } from '../../data/levels'

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

export default function ModalVerbs() {
  const { profile, refreshProfile } = useAuth()
  const userLevelIdx = LEVELS.findIndex(l => l.code === (profile?.level || 'A1'))

  const eligible = MODAL_EXERCISES.filter(e => {
    const eIdx = LEVELS.findIndex(l => l.code === e.level)
    return eIdx <= userLevelIdx
  })

  const [mode, setMode] = useState(null)
  const [showCat, setShowCat] = useState(true)
  const [queue, setQueue] = useState([])
  const [current, setCurrent] = useState(null)
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [listening, setListening] = useState(false)
  const [heard, setHeard] = useState('')
  const [score, setScore] = useState({ correct: 0, wrong: 0 })
  const [finished, setFinished] = useState(false)
  const [xpEarned, setXpEarned] = useState(0)
  const roundsTotal = Math.min(10, eligible.length)

  function startGame(selectedMode) {
    const q = shuffle(eligible).slice(0, roundsTotal)
    setMode(selectedMode)
    setQueue(q)
    setCurrent(q[0])
  }

  function handleSelect(opt) {
    if (selected) return
    setSelected(opt)
    setRevealed(true)
    if (opt.toLowerCase() === current.answer.toLowerCase()) speak(opt)
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
    setSelected(null)
    setRevealed(false)
    setHeard('')
  }

  async function endGame(lastCorrect) {
    setFinished(true)
    const total = score.correct + score.wrong + 1
    const correct = score.correct + (lastCorrect ? 1 : 0)
    const xp = Math.max(3, Math.round(25 * (correct / total)))
    await awardXP(profile.id, xp, 'modal_verbs')
    await refreshProfile()
    setXpEarned(xp)
  }

  function renderSentence(sentence, answer, isRevealed) {
    return sentence.split('___').map((part, i, arr) => (
      <span key={i}>
        {part}
        {i < arr.length - 1 && (
          <span className={`font-bold underline underline-offset-4 ${isRevealed ? 'text-emerald-600' : 'text-indigo-400'}`}>
            {isRevealed ? answer : '___'}
          </span>
        )}
      </span>
    ))
  }

  if (!mode) {
    return (
      <div className="max-w-md mx-auto text-center space-y-6 py-8">
        <div className="text-5xl">🔧</div>
        <h1 className="text-2xl font-bold text-gray-900">Modal Verbs</h1>
        <p className="text-gray-500">can · should · must · would · might · could</p>
        <div className="grid grid-cols-1 gap-3">
          <button onClick={() => startGame('mc')}
            className="border-2 border-indigo-200 hover:border-indigo-400 bg-indigo-50 hover:bg-indigo-100 rounded-xl p-5 text-left transition-all">
            <div className="font-bold text-indigo-800 text-lg">📋 Multiple Choice</div>
            <div className="text-sm text-indigo-600 mt-1">Tria el modal correcte per completar la frase.</div>
          </button>
          <button onClick={() => startGame('oral')}
            className="border-2 border-emerald-200 hover:border-emerald-400 bg-emerald-50 hover:bg-emerald-100 rounded-xl p-5 text-left transition-all">
            <div className="font-bold text-emerald-800 text-lg">🎙️ Oral</div>
            <div className="text-sm text-emerald-600 mt-1">Di el modal en veu alta.</div>
          </button>
        </div>
      </div>
    )
  }

  if (finished) {
    return (
      <div className="text-center space-y-4 py-12 max-w-md mx-auto">
        <div className="text-6xl">🔧</div>
        <h2 className="text-2xl font-bold text-gray-900">Modal Verbs done!</h2>
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
  const isCorrect = selected?.toLowerCase() === current.answer.toLowerCase()

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">🔧 Modal Verbs</h2>
        <div className="flex gap-3 text-sm">
          <span className="text-emerald-600 font-bold">✓ {score.correct}</span>
          <span className="text-red-500 font-bold">✗ {score.wrong}</span>
          <span className="text-gray-400">{roundNum}/{roundsTotal}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <p className="text-sm text-gray-400 text-center">Complete the sentence:</p>

        <p className="text-lg font-medium text-gray-900 text-center leading-relaxed">
          {renderSentence(current.sentence, current.answer, revealed)}
        </p>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowCat(v => !v)}
            className="text-xs text-indigo-400 hover:text-indigo-600"
          >
            {showCat ? '🙈 Hide' : '🌍 Show'} translation
          </button>
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{current.level}</span>
        </div>

        {showCat && (
          <p className="text-sm text-gray-400 italic text-center bg-gray-50 rounded-lg px-3 py-2">
            {current.cat}
          </p>
        )}

        {/* MC Options */}
        {mode === 'mc' && !revealed && (
          <div className="grid grid-cols-2 gap-3 pt-2">
            {current.options.map(opt => (
              <button key={opt} onClick={() => handleSelect(opt)}
                className="border-2 border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 rounded-xl py-3 font-semibold text-sm text-gray-700 transition-all">
                {opt}
              </button>
            ))}
          </div>
        )}

        {mode === 'mc' && revealed && (
          <div className="grid grid-cols-2 gap-3 pt-2">
            {current.options.map(opt => {
              const isAns = opt.toLowerCase() === current.answer.toLowerCase()
              const isSel = opt === selected
              let cls = 'border-2 rounded-xl py-3 font-semibold text-sm transition-all '
              if (isAns) cls += 'border-emerald-500 bg-emerald-50 text-emerald-700'
              else if (isSel) cls += 'border-red-400 bg-red-50 text-red-600'
              else cls += 'border-gray-100 bg-gray-50 text-gray-400'
              return <div key={opt} className={cls}>{opt}{isAns ? ' ✓' : (isSel ? ' ✗' : '')}</div>
            })}
          </div>
        )}

        {/* Oral */}
        {mode === 'oral' && !revealed && (
          <div className="space-y-3 pt-2">
            <button onClick={tryListen} disabled={listening}
              className={`w-full py-3 rounded-xl font-semibold transition-colors ${listening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
              {listening ? '🎙️ Listening…' : '🎙️ Say the modal'}
            </button>
            <button onClick={() => setRevealed(true)} className="text-sm text-gray-400 hover:text-gray-600 w-full text-center">
              Show answer
            </button>
          </div>
        )}

        {/* Result */}
        {revealed && (
          <div className="space-y-3 pt-2">
            <div className={`rounded-xl p-3 text-sm ${isCorrect ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
              <p className="font-semibold">{isCorrect ? '✓ Correct!' : `✗ Answer: ${current.answer}`}</p>
              <p className="mt-1 text-xs">{current.tip}</p>
            </div>
            {heard && <p className="text-sm text-gray-500 text-center">You said: <span className="font-semibold italic">"{heard}"</span></p>}

            {mode === 'mc' ? (
              <button onClick={() => next(isCorrect)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl">
                Next →
              </button>
            ) : (
              <div className="flex gap-3">
                <button onClick={() => next(false)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-3 rounded-xl">✗ Wrong</button>
                <button onClick={() => next(true)} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl">✓ Right</button>
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
