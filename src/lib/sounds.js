let _ac = null

function getCtx() {
  if (!_ac) _ac = new (window.AudioContext || window.webkitAudioContext)()
  if (_ac.state === 'suspended') _ac.resume()
  return _ac
}

function tone(freq, type, duration, volume, delay) {
  const ac = getCtx()
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = type
  osc.frequency.value = freq
  osc.connect(gain)
  gain.connect(ac.destination)
  gain.gain.setValueAtTime(volume, ac.currentTime + delay)
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + delay + duration)
  osc.start(ac.currentTime + delay)
  osc.stop(ac.currentTime + delay + duration + 0.01)
}

export function playCorrect() {
  try { tone(523, 'sine', 0.12, 0.25, 0); tone(784, 'sine', 0.15, 0.25, 0.12) } catch {}
}

export function playWrong() {
  try { tone(220, 'sawtooth', 0.15, 0.15, 0); tone(165, 'sawtooth', 0.2, 0.12, 0.15) } catch {}
}

export function playXP() {
  try { [523, 659, 784, 1047].forEach((f, i) => tone(f, 'sine', 0.15, 0.22, i * 0.12)) } catch {}
}
