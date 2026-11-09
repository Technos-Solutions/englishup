import { useState, useEffect } from 'react'
import { speak } from '../../lib/speech'

export default function VocabWarmup({ scenario, words, loading, onDone }) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    if (!loading && words.length === 0) onDone()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, words])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="text-5xl animate-bounce">📚</div>
          <p className="text-gray-500 font-semibold">Preparant vocabulari clau…</p>
        </div>
      </div>
    )
  }

  if (!words.length) return null

  const word = words[index]
  const isLast = index === words.length - 1

  function next() {
    if (isLast) { onDone(); return }
    setIndex(i => i + 1)
    setFlipped(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <p className="text-sm font-extrabold text-indigo-500 uppercase tracking-wider">Escalfament · {scenario.title}</p>
          <h1 className="text-2xl text-gray-900 mt-1">Paraules clau abans de començar</h1>
          <p className="text-gray-500 text-sm mt-1 font-semibold">{index + 1} / {words.length}</p>
        </div>

        <button
          onClick={() => setFlipped(f => !f)}
          className="card w-full p-8 text-center space-y-3 min-h-[220px] flex flex-col items-center justify-center"
        >
          {!flipped ? (
            <>
              <p className="text-3xl text-gray-900">{word.word}</p>
              <p className="text-sm text-gray-400 font-semibold">Toca per veure la traducció</p>
            </>
          ) : (
            <>
              <p className="text-2xl text-indigo-600 font-extrabold">{word.translation_ca}</p>
              {word.example && <p className="text-sm text-gray-500 italic mt-2">"{word.example}"</p>}
            </>
          )}
        </button>

        <div className="flex gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); speak(word.word) }}
            className="btn-secondary px-5"
            aria-label="Escoltar"
          >
            🔊
          </button>
          <button onClick={next} className="btn-primary flex-1">
            {isLast ? 'Comença la conversa →' : 'Següent →'}
          </button>
        </div>

        <button onClick={onDone} className="block mx-auto text-sm text-gray-400 hover:text-gray-600 font-semibold">
          Saltar escalfament
        </button>
      </div>
    </div>
  )
}
