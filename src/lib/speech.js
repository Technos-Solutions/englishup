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
// only, always falls back to the browser's own voice on any failure, and
// runs entirely in a Web Worker so a slow device never freezes the UI
// while loading or generating — it only ever makes things slower, never
// unresponsive.

const PREMIUM_KEY = 'eu_premium_voice'
const PREMIUM_VOICE_ID_KEY = 'eu_premium_voice_id'

export const PREMIUM_VOICES = [
  { id: 'af_heart', name: 'Emma', flag: '🇺🇸', accent: 'American', emoji: '👩‍💻' },
  { id: 'am_michael', name: 'Jake', flag: '🇺🇸', accent: 'American', emoji: '🧑‍🎓' },
  { id: 'bf_emma', name: 'Sophie', flag: '🇬🇧', accent: 'British', emoji: '👩‍🏫' },
  { id: 'bm_fable', name: 'James', flag: '🇬🇧', accent: 'British', emoji: '👨‍💼' },
]

let premiumWorker = null
let premiumReady = false
let premiumAudioEl = null
let reqId = 0

function getPremiumWorker() {
  if (!premiumWorker) {
    premiumWorker = new Worker(new URL('../workers/kokoroWorker.js', import.meta.url), { type: 'module' })
  }
  return premiumWorker
}

function callPremiumWorker(type, payload, onProgress) {
  return new Promise((resolve, reject) => {
    const id = ++reqId
    const worker = getPremiumWorker()
    function handleMessage(e) {
      const msg = e.data
      if (msg.type === 'progress') { onProgress?.(msg.percent); return }
      if (msg.id !== id) return
      worker.removeEventListener('message', handleMessage)
      if (msg.type === 'error') reject(new Error(msg.message))
      else resolve(msg)
    }
    worker.addEventListener('message', handleMessage)
    worker.postMessage({ type, id, payload })
  })
}

export function isPremiumVoiceEnabled() {
  return typeof window !== 'undefined' && localStorage.getItem(PREMIUM_KEY) === 'on'
}

export function isPremiumVoiceReady() {
  return premiumReady
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
// Kokoro model, inside the worker. Call with onProgress(percent) to show a
// progress bar. Never auto-run this on app load — only in direct response
// to the user opting in — so a device that struggles with it is never
// stuck retrying on every visit.
export async function enablePremiumVoice(onProgress) {
  if (!premiumReady) {
    await withTimeout(callPremiumWorker('load', {}, onProgress), 120000, 'Timed out loading the premium voice')
    premiumReady = true
  }
  localStorage.setItem(PREMIUM_KEY, 'on')
}

export function disablePremiumVoice() {
  localStorage.setItem(PREMIUM_KEY, 'off')
}

async function playWav(wav, onEnd) {
  if (isTTSSupported()) window.speechSynthesis.cancel()
  if (premiumAudioEl) premiumAudioEl.pause()
  const url = URL.createObjectURL(new Blob([wav], { type: 'audio/wav' }))
  premiumAudioEl = new Audio(url)
  premiumAudioEl.onended = () => { URL.revokeObjectURL(url); onEnd?.() }
  await premiumAudioEl.play()
}

async function speakPremium(text, onEnd) {
  try {
    const { wav } = await withTimeout(
      callPremiumWorker('generate', { text, voice: getSelectedPremiumVoice() }),
      30000,
      'Timed out generating premium voice audio'
    )
    await playWav(wav, onEnd)
  } catch (err) {
    console.error('Premium voice failed, falling back to browser voice', err)
    speakBrowser(text, onEnd)
  }
}

export async function previewPremiumVoice(voiceId, name) {
  if (!premiumReady) return
  try {
    const { wav } = await withTimeout(
      callPremiumWorker('generate', { text: `Hello! My name is ${name}.`, voice: voiceId }),
      30000,
      'Timed out generating premium voice audio'
    )
    await playWav(wav)
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
