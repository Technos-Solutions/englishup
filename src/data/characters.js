const MALE_HINTS = ['male', 'david', 'george', 'fred', 'daniel', 'mark', 'oliver', 'rishi', 'aaron', 'albert', 'ralph', 'thomas', 'stefan']

function looksMALE(voice) {
  const n = voice.name.toLowerCase()
  return MALE_HINTS.some(h => n.includes(h))
}

export const CHARACTERS = [
  {
    id: 'sophie',
    name: 'Sophie',
    flag: '🇬🇧',
    accent: 'British',
    emoji: '👩‍🏫',
    match: v => v.lang === 'en-GB' && !looksMALE(v),
  },
  {
    id: 'james',
    name: 'James',
    flag: '🇬🇧',
    accent: 'British',
    emoji: '👨‍💼',
    match: v => v.lang === 'en-GB' && looksMALE(v),
  },
  {
    id: 'emma',
    name: 'Emma',
    flag: '🇺🇸',
    accent: 'American',
    emoji: '👩‍💻',
    match: v => v.lang === 'en-US' && !looksMALE(v),
  },
  {
    id: 'jake',
    name: 'Jake',
    flag: '🇺🇸',
    accent: 'American',
    emoji: '🧑‍🎓',
    match: v => v.lang === 'en-US' && looksMALE(v),
  },
  {
    id: 'zoe',
    name: 'Zoe',
    flag: '🇦🇺',
    accent: 'Australian',
    emoji: '👩‍🎨',
    match: v => v.lang.startsWith('en-AU') || v.lang.startsWith('en-au'),
  },
]

export function buildAvailableCharacters() {
  const voices = window.speechSynthesis.getVoices()
  const english = voices.filter(v => v.lang.startsWith('en'))
  if (!english.length) return []

  const strict = CHARACTERS.flatMap(char => {
    const voice = english.find(v => char.match(v))
    return voice ? [{ ...char, voice }] : []
  })
  if (strict.length) return strict

  // Fallback: if no accent match, assign available English voices to characters in order
  return english.slice(0, CHARACTERS.length).map((voice, i) => ({ ...CHARACTERS[i], voice }))
}

export function getSelectedCharacterId() {
  return localStorage.getItem('eu_character')
}
