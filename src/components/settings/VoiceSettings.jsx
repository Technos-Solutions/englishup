import { useState, useEffect } from 'react'
import { buildAvailableCharacters, getSelectedCharacterId } from '../../data/characters.js'
import { setCharacterVoice } from '../../lib/speech.js'
import { speak } from '../../lib/speech.js'

export default function VoiceSettings({ onClose }) {
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(getSelectedCharacterId())

  useEffect(() => {
    let cancelled = false
    function load() {
      if (cancelled) return
      const chars = buildAvailableCharacters()
      if (chars.length) { setCharacters(chars); setLoading(false) }
    }
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    const t1 = setTimeout(load, 500)
    const t2 = setTimeout(() => { if (!cancelled) setLoading(false) }, 2000)
    return () => {
      cancelled = true
      window.speechSynthesis.removeEventListener('voiceschanged', load)
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  function handleSelect(char) {
    localStorage.setItem('eu_character', char.id)
    setCharacterVoice(char.voice)
    setSelected(char.id)
  }

  function handlePreview(char, e) {
    e.stopPropagation()
    const utt = new SpeechSynthesisUtterance('Hello! My name is ' + char.name + '.')
    utt.voice = char.voice
    utt.lang = char.voice.lang
    utt.rate = 0.9
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utt)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">⚙️ Personalització</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        <p className="text-sm font-semibold text-gray-500 mb-3">Veu del professor</p>

        {characters.length === 0 && loading ? (
          <p className="text-sm text-gray-400 text-center py-4">Carregant veus disponibles…</p>
        ) : characters.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No s'han trobat veus en anglès al dispositiu.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {characters.map(char => (
              <button
                key={char.id}
                onClick={() => handleSelect(char)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all text-center ${
                  selected === char.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                }`}
              >
                <span className="text-3xl">{char.emoji}</span>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{char.name}</p>
                  <p className="text-xs text-gray-400">{char.flag} {char.accent}</p>
                </div>
                <button
                  onClick={(e) => handlePreview(char, e)}
                  className="text-xs text-indigo-500 hover:text-indigo-700 flex items-center gap-1"
                >
                  🔊 Preview
                </button>
                {selected === char.id && (
                  <span className="text-xs font-semibold text-indigo-600">✓ Actiu</span>
                )}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-5 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-colors"
        >
          Guardar
        </button>
      </div>
    </div>
  )
}
