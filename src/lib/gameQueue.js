function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function pickItems(storageKey, pool, count) {
  let remaining = []
  try { remaining = JSON.parse(localStorage.getItem(storageKey) || '[]') } catch {}

  remaining = remaining.filter(i => Number.isInteger(i) && i < pool.length)

  if (remaining.length < count) {
    const fresh = shuffle([...Array(pool.length).keys()])
    const remainingSet = new Set(remaining)
    const extra = fresh.filter(i => !remainingSet.has(i))
    remaining = [...remaining, ...extra]
  }

  const selected = remaining.slice(0, count).map(i => pool[i])
  localStorage.setItem(storageKey, JSON.stringify(remaining.slice(count)))
  return selected
}
