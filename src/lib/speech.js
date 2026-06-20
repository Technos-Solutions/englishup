export function isSpeechSupported() {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
}

export function isTTSSupported() {
  return 'speechSynthesis' in window
}

export function speak(text, onEnd) {
  if (!isTTSSupported()) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-US'
  utterance.rate = 0.9
  utterance.pitch = 1
  const voices = window.speechSynthesis.getVoices()
  const english = voices.find(v => v.lang.startsWith('en') && v.name.includes('Female'))
    || voices.find(v => v.lang.startsWith('en'))
  if (english) utterance.voice = english
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
  recognition.lang = 'en-US'
  recognition.continuous = false
  recognition.interimResults = false
  recognition.maxAlternatives = 1

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript
    onResult(transcript)
  }
  recognition.onerror = (event) => {
    if (event.error !== 'no-speech') onError(event.error)
  }
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
