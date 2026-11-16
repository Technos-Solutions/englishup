import { useState, useEffect } from 'react'
import { buildAvailableCharacters, getSelectedCharacterId } from '../../data/characters.js'
import {
  setCharacterVoice,
  PREMIUM_VOICES, isPremiumVoiceEnabled, isPremiumVoiceReady,
  enablePremiumVoice, disablePremiumVoice, previewPremiumVoice,
  getSelectedPremiumVoice, setSelectedPremiumVoice,
} from '../../lib/speech.js'

export default function VoiceSettings({ onClose }) {
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(getSelectedCharacterId())
  const [premiumOn, setPremiumOn] = useState(isPremiumVoiceEnabled() && isPremiumVoiceReady())
  const [premiumLoading, setPremiumLoading] = useState(false)
  const [premiumProgress, setPremiumProgress] = useState(0)
  const [premiumError, setPremiumError] = useState('')
  const [selectedPremium, setSelectedPremium] = useState(getSelectedPremiumVoice())

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

  async function handleEnablePremium() {
    setPremiumError('')
    setPremiumLoading(true)
    setPremiumProgress(0)
    try {
      await enablePremiumVoice(setPremiumProgress)
      setPremiumOn(true)
    } catch (err) {
      console.error('Failed to enable premium voice', err)
      setPremiumError("No s'ha pogut activar la veu Premium en aquest dispositiu.")
    }
    setPremiumLoading(false)
  }

  function handleDisablePremium() {
    disablePremiumVoice()
    setPremiumOn(false)
  }

  function handleSelectPremium(voice) {
    setSelectedPremiumVoice(voice.id)
    setSelectedPremium(voice.id)
  }

  function handlePreviewPremium(voice, e) {
    e.stopPropagation()
    previewPremiumVoice(voice.id, voice.name)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 shadow-xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">⚙️ Personalització</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        {/* Premium voice (Kokoro, local, free) */}
        <div className="mb-6 pb-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-500">🚀 Veu Premium</p>
            {premiumOn && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">✓ Activa</span>}
          </div>

          {!premiumOn && !premiumLoading && (
            <>
              <p className="text-xs text-gray-400 mb-3">
                Veu molt més natural, 100% gratuïta i que s'executa al teu dispositiu (no s'envia res a cap servidor). La primera vegada cal descarregar un paquet d'uns 80MB — només una vegada.
              </p>
              <button
                onClick={handleEnablePremium}
                className="w-full bg-violet-50 hover:bg-violet-100 text-violet-700 font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                Activa la veu Premium
              </button>
              {premiumError && <p className="text-xs text-red-500 mt-2">{premiumError}</p>}
            </>
          )}

          {premiumLoading && (
            <div className="space-y-2">
              <p className="text-xs text-gray-400">Descarregant veu… {premiumProgress}%</p>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div className="bg-violet-500 h-2 rounded-full transition-all" style={{ width: `${premiumProgress}%` }} />
              </div>
            </div>
          )}

          {premiumOn && (
            <>
              <div className="grid grid-cols-2 gap-3 mb-3">
                {PREMIUM_VOICES.map(voice => (
                  <button
                    key={voice.id}
                    onClick={() => handleSelectPremium(voice)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all text-center ${
                      selectedPremium === voice.id
                        ? 'border-violet-500 bg-violet-50'
                        : 'border-gray-200 hover:border-violet-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-3xl">{voice.emoji}</span>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{voice.name}</p>
                      <p className="text-xs text-gray-400">{voice.flag} {voice.accent}</p>
                    </div>
                    <button
                      onClick={(e) => handlePreviewPremium(voice, e)}
                      className="text-xs text-violet-500 hover:text-violet-700 flex items-center gap-1"
                    >
                      🔊 Preview
                    </button>
                    {selectedPremium === voice.id && (
                      <span className="text-xs font-semibold text-violet-600">✓ Actiu</span>
                    )}
                  </button>
                ))}
              </div>
              <button onClick={handleDisablePremium} className="text-xs text-gray-400 hover:text-gray-600">
                Desactiva la veu Premium i torna a la del navegador
              </button>
            </>
          )}
        </div>

        <p className="text-sm font-semibold text-gray-500 mb-3">Veu del navegador</p>

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
