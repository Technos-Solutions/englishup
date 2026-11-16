import { buildAvailableCharacters } from '../data/characters.js'

export function isSpeechSupported() {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
}

export function isTTSSupported() {
  return 'speechSynthesis' in window
}

let _englishVoice = null

function pickEnglishVoice() {
  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return

  const charId = localStorage.getItem('eu_character')
  if (charId) {
    const chars = buildAvailableCharacters()
    const found = chars.find(c => c.id === charId)
    if (found) { _englishVoice = found.voice; return }
  }

  _englishVoice =
    voices.find(v => v.lang === 'en-GB' && v.name.toLowerCase().includes('google')) ||
    voices.find(v => v.lang === 'en-US' && v.name.toLowerCase().includes('google')) ||
    voices.find(v => v.lang === 'en-GB') ||
    voices.find(v => v.lang === 'en-US') ||
    voices.find(v => v.lang.startsWith('en'))
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
}

function speakBrowser(text, onEnd) {
  if (!isTTSSupported()) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = _englishVoice?.lang || 'en-GB'
  utterance.rate = 0.9
  utterance.pitch = 1
  if (_englishVoice) utterance.voice = _englishVoice
  if (onEnd) utterance.onend = onEnd
  window.speechSynthesis.speak(utterance)
}

// --- Premium voice (Kokoro, 100% local in the browser via WASM) ---
// Free, offline, no account — but a ~80MB model to download once. Opt-in
// only, and always falls back to the browser's own voice if it's not
// enabled, not loaded yet, or fails for any reason.

const PREMIUM_KEY = 'eu_premium_voice'
const PREMIUM_VOICE_ID_KEY = 'eu_premium_voice_id'
const KOKORO_MODEL_ID = 'onnx-community/Kokoro-82M-v1.0-ONNX'

export const PREMIUM_VOICES = [
  { id: 'af_heart', name: 'Emma', flag: '🇺🇸', accent: 'American', emoji: '👩‍💻' },
  { id: 'am_michael', name: 'Jake', flag: '🇺🇸', accent: 'American', emoji: '🧑‍🎓' },
  { id: 'bf_emma', name: 'Sophie', flag: '🇬🇧', accent: 'British', emoji: '👩‍🏫' },
  { id: 'bm_fable', name: 'James', flag: '🇬🇧', accent: 'British', emoji: '👨‍💼' },
]

let premiumTTS = null
let premiumLoadPromise = null
let premiumAudioEl = null

export function isPremiumVoiceEnabled() {
  return typeof window !== 'undefined' && localStorage.getItem(PREMIUM_KEY) === 'on'
}

export function isPremiumVoiceReady() {
  return premiumTTS !== null
}

export function getSelectedPremiumVoice() {
  return localStorage.getItem(PREMIUM_VOICE_ID_KEY) || PREMIUM_VOICES[0].id
}

export function setSelectedPremiumVoice(id) {
  localStorage.setItem(PREMIUM_VOICE_ID_KEY, id)
}

function withTimeout(promise, ms, message) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms)),
  ])
}

// Downloads (first time only — cached by the browser after) and loads the
// Kokoro model. Call with onProgress(percent) to show a progress bar.
// Never auto-run this on app load — only in direct response to the user
// opting in — so a device that struggles with it is never stuck retrying
// on every visit.
export async function enablePremiumVoice(onProgress) {
  if (!premiumTTS) {
    if (!premiumLoadPromise) {
      premiumLoadPromise = (async () => {
        const [{ KokoroTTS }, { env }] = await Promise.all([
          import('kokoro-js'),
          import('@huggingface/transformers'),
        ])
        // Multi-threaded WASM needs cross-origin isolation (COOP/COEP
        // headers) to use SharedArrayBuffer. We don't set those, and on
        // some mobile browsers trying anyway can hang instead of falling
        // back cleanly — force single-threaded to avoid that entirely.
        env.backends.onnx.wasm.numThreads = 1
        return KokoroTTS.from_pretrained(KOKORO_MODEL_ID, {
          dtype: 'q8',
          device: 'wasm',
          progress_callback: (data) => {
            if (onProgress && data.status === 'progress' && data.total) {
              onProgress(Math.round((data.loaded / data.total) * 100))
            }
          },
        })
      })()
    }
    try {
      premiumTTS = await withTimeout(premiumLoadPromise, 90000, 'Timed out loading the premium voice')
    } catch (err) {
      premiumLoadPromise = null
      throw err
    }
  }
  localStorage.setItem(PREMIUM_KEY, 'on')
}

export function disablePremiumVoice() {
  localStorage.setItem(PREMIUM_KEY, 'off')
}

async function speakPremium(text, onEnd) {
  try {
    if (isTTSSupported()) window.speechSynthesis.cancel()
    if (premiumAudioEl) premiumAudioEl.pause()
    const audio = await premiumTTS.generate(text, { voice: getSelectedPremiumVoice() })
    const url = URL.createObjectURL(audio.toBlob())
    premiumAudioEl = new Audio(url)
    premiumAudioEl.onended = () => { URL.revokeObjectURL(url); if (onEnd) onEnd() }
    await premiumAudioEl.play()
  } catch (err) {
    console.error('Premium voice failed, falling back to browser voice', err)
    speakBrowser(text, onEnd)
  }
}

export async function previewPremiumVoice(voiceId, name) {
  if (!premiumTTS) return
  try {
    if (isTTSSupported()) window.speechSynthesis.cancel()
    if (premiumAudioEl) premiumAudioEl.pause()
    const audio = await premiumTTS.generate(`Hello! My name is ${name}.`, { voice: voiceId })
    const url = URL.createObjectURL(audio.toBlob())
    premiumAudioEl = new Audio(url)
    premiumAudioEl.onended = () => URL.revokeObjectURL(url)
    await premiumAudioEl.play()
  } catch (err) {
    console.error('previewPremiumVoice failed', err)
  }
}

export function speak(text, onEnd) {
  if (isPremiumVoiceEnabled() && isPremiumVoiceReady()) {
    speakPremium(text, onEnd)
    return
  }
  speakBrowser(text, onEnd)
}

export function stopSpeaking() {
  if (isTTSSupported()) window.speechSynthesis.cancel()
  if (premiumAudioEl) { premiumAudioEl.pause(); premiumAudioEl = null }
}

export function startListening(onResult, onError) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) {
    onError('Speech recognition not supported. Please use Chrome or Edge.')
    return null
  }
  const recognition = new SpeechRecognition()
  recognition.lang = 'en-US'
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
  const normalize = (s) => s.toLowerCase().replace(/[^a-z\s]/g, '').trim()
  const a = normalize(original).split(' ')
  const b = normalize(spoken).split(' ')
  let matches = 0
  a.forEach(word => { if (b.includes(word)) matches++ })
  return Math.round((matches / a.length) * 100)
}
