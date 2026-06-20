import { useState, useRef } from 'react'
import { startListening, isSpeechSupported } from '../../lib/speech'

export default function SpeechInput({ onSubmit, disabled }) {
  const [mode, setMode] = useState('voice') // 'voice' | 'text'
  const [text, setText] = useState('')
  const [listening, setListening] = useState(false)
  const [error, setError] = useState('')
  const recognitionRef = useRef(null)

  function handleVoice() {
    if (listening) {
      recognitionRef.current?.stop()
      setListening(false)
      return
    }
    setError('')
    setListening(true)
    recognitionRef.current = startListening(
      (transcript) => {
        setListening(false)
        onSubmit(transcript, 'voice')
      },
      (err) => {
        setListening(false)
        setError(err)
      }
    )
  }

  function handleTextSubmit(e) {
    e.preventDefault()
    if (!text.trim()) return
    onSubmit(text.trim(), 'text')
    setText('')
  }

  if (!isSpeechSupported() && mode === 'voice') {
    setMode('text')
  }

  return (
    <div className="space-y-3">
      {/* Mode toggle */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => setMode('voice')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${mode === 'voice' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          🎙️ Voice
        </button>
        <button
          onClick={() => setMode('text')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${mode === 'text' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          ⌨️ Type
        </button>
      </div>

      {mode === 'voice' ? (
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={handleVoice}
            disabled={disabled}
            className={`w-20 h-20 rounded-full text-3xl font-bold transition-all shadow-lg ${
              listening
                ? 'bg-red-500 text-white scale-110 animate-pulse'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105'
            } disabled:opacity-40`}
          >
            {listening ? '⏹' : '🎙️'}
          </button>
          <p className="text-sm text-gray-500">
            {listening ? 'Listening… click to stop' : 'Tap to speak'}
          </p>
          {error && <p className="text-red-500 text-sm">{error}. Try typing instead.</p>}
        </div>
      ) : (
        <form onSubmit={handleTextSubmit} className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            disabled={disabled}
            placeholder="Type your message in English…"
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-40"
          />
          <button
            type="submit"
            disabled={disabled || !text.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white px-4 py-3 rounded-xl transition-colors"
          >
            Send
          </button>
        </form>
      )}
    </div>
  )
}
