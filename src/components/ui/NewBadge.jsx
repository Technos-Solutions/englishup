import { useState, useEffect } from 'react'

export default function NewBadge({ featureKey, days = 14 }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const k = 'feat_' + featureKey
    const stored = localStorage.getItem(k)
    if (!stored) {
      localStorage.setItem(k, Date.now().toString())
      setShow(true)
    } else {
      setShow((Date.now() - Number(stored)) / 86400000 < days)
    }
  }, [featureKey, days])

  if (!show) return null
  return (
    <span className="inline-flex items-center px-1.5 py-px rounded text-[9px] font-bold tracking-wide bg-emerald-500 text-white leading-none">
      new
    </span>
  )
}
