function ctx() {
  return new (window.AudioContext || window.webkitAudioContext)()
}

function tone(freq, type = 'sine', duration = 0.15, volume = 0.25, delay = 0) {
  const ac = ctx()
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = type
  osc.frequency.value = freq
  osc.connect(gain)
  gain.connect(ac.destination)
  gain.gain.setValueAtTime(volume, ac.currentTime + delay)
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + delay + duration)
  osc.start(ac.currentTime + delay)
  osc.stop(ac.currentTime + delay + duration)
}

export function playCorrect() {
  try {
    tone(523, 'sine', 0.12, 0.2, 0)
    tone(784, 'sine', 0.15, 0.2, 0.1)
  } catch {}
}

export function playWrong() {
  try {
    tone(200, 'sawtooth', 0.2, 0.15, 0)
    tone(150, 'sawtooth', 0.2, 0.1, 0.1)
  } catch {}
}

export function playXP() {
  try {
    [523, 659, 784, 1047].forEach((freq, i) => tone(freq, 'sine', 0.15, 0.2, i * 0.1))
  } catch {}
}
