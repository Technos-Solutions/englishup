const KEY = 'englishup_vocab'
const MAX_WORDS = 60
const DAYS_TO_KEEP = 14

export function getRecentVocabulary() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) || '[]')
    const cutoff = Date.now() - DAYS_TO_KEEP * 86400000
    return data.filter(v => v.ts > cutoff).map(v => v.word)
  } catch { return [] }
}

export function saveVocabulary(words) {
  if (!words?.length) return
  try {
    const existing = JSON.parse(localStorage.getItem(KEY) || '[]')
    const cutoff = Date.now() - DAYS_TO_KEEP * 86400000
    const recent = existing.filter(v => v.ts > cutoff)
    const merged = [...recent]
    for (const word of words) {
      if (!merged.find(v => v.word.toLowerCase() === word.toLowerCase())) {
        merged.push({ word: word.toLowerCase(), ts: Date.now() })
      }
    }
    localStorage.setItem(KEY, JSON.stringify(merged.slice(-MAX_WORDS)))
  } catch {}
}
