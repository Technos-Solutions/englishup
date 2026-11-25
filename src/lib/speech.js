import { buildAvailableCharacters } from '../data/characters.js'
import { getLanguageInfo } from '../data/languages'

export function isSpeechSupported() {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
}

export function isTTSSupported() {
  return 'speechSynthesis' in window
}

function currentTargetLang() {
  return localStorage.getItem('eu_target_lang') || 'en'
}

let _englishVoice = null
let _voiceForLang = null

function pickEnglishVoice() {
  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return

  const lang = currentTargetLang()

  // Character voices (Hugo, etc.) are English-only — only use them when
  // the target language is English.
  if (lang === 'en') {
    const charId = localStorage.getItem('eu_character')
    if (charId) {
      const chars = buildAvailableCharacters()
      const found = chars.find(c => c.id === charId)
      if (found) { _englishVoice = found.voice; _voiceForLang = lang; return }
    }
  }

  const { speechLang } = getLanguageInfo(lang)
  const base = speechLang.split('-')[0]

  _englishVoice =
    voices.find(v => v.lang === speechLang && v.name.toLowerCase().includes('google')) ||
    voices.find(v => v.lang === speechLang) ||
    voices.find(v => v.lang.startsWith(base)) ||
    (lang === 'en' ? voices.find(v => v.lang.startsWith('en')) : null)
  _voiceForLang = lang
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.addEventListener('voiceschanged', pickEnglishVoice)
  pickEnglishVoice()
  // Some browsers (notably Safari/iOS) never fire 'voiceschanged' and only
  // populate getVoices() a little after load — retry a few times so we
  // don't get stuck on the device's default (often non-English) voice.
  let retries = 0
  const retryTimer = setInterval(() => {
    retries++
    if (_englishVoice || retries > 10) { clearInterval(retryTimer); return }
    pickEnglishVoice()
  }, 300)
}

export function setCharacterVoice(voice) {
  _englishVoice = voice
  _voiceForLang = currentTargetLang()
}

export function speak(text, onEnd) {
  if (!isTTSSupported()) return
  // The target language may have changed (language switcher) since the
  // voice was last picked — re-pick if so.
  if (_voiceForLang !== currentTargetLang()) pickEnglishVoice()
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = _englishVoice?.lang || getLanguageInfo(currentTargetLang()).speechLang
  utterance.rate = 0.9
  utterance.pitch = 1
  if (_englishVoice) utterance.voice = _englishVoice
  if (onEnd) utterance.onend = onEnd
  window.speechSynthesis.speak(utterance)
}

export function stopSpeaking() {
  if (isTTSSupported()) window.speechSynthesis.cancel()
}

export function startListening(onResult, onError) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) {
    onError('Speech recognition not supported. Please use Chrome or Edge.')
    return null
  }
  const recognition = new SpeechRecognition()
  recognition.lang = getLanguageInfo(currentTargetLang()).recognitionLang
  recognition.continuous = false
  recognition.interimResults = false
  recognition.maxAlternatives = 1

  // Whatever happens — a result, an error, or the browser just giving up
  // without either (e.g. 'no-speech') — settle exactly once, so the UI
  // never gets stuck on "Listening…" forever.
  let settled = false

  recognition.onresult = (event) => {
    settled = true
    onResult(event.results[0][0].transcript)
  }
  recognition.onerror = (event) => {
    settled = true
    onError(event.error === 'no-speech' ? "Didn't catch that" : event.error)
  }
  recognition.onend = () => {
    if (!settled) {
      settled = true
      onError("Didn't catch that")
    }
  }

  const stop = recognition.stop.bind(recognition)
  recognition.stop = () => { settled = true; stop() }

  recognition.start()
  return recognition
}

export function scorePhonetic(original, spoken) {
  const normalize = (s) => s.toLowerCase().replace(/[^a-zÀ-ÿ\s]/g, '').trim()
  const a = normalize(original).split(' ')
  const b = normalize(spoken).split(' ')
  let matches = 0
  a.forEach(word => { if (b.includes(word)) matches++ })
  return Math.round((matches / a.length) * 100)
}
