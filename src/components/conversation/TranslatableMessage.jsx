import { useState, useRef } from 'react'
import { translateWord } from '../../lib/groq'

function WordTooltip({ word, sentence }) {
  const [tooltip, setTooltip] = useState(null)
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [above, setAbove] = useState(true)
  const timerRef = useRef(null)
  const spanRef = useRef(null)

  const clean = word.replace(/[^a-zA-Z]/g, '')
  if (!clean || clean.length < 2) return <span>{word}</span>

  async function handleEnter() {
    if (spanRef.current) {
      const rect = spanRef.current.getBoundingClientRect()
      setAbove(rect.top > 60)
    }
    setVisible(true)
    if (tooltip) return
    timerRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const t = await translateWord(clean, sentence)
        setTooltip(t)
      } catch {}
      setLoading(false)
    }, 350)
  }

  function handleLeave() {
    clearTimeout(timerRef.current)
    setVisible(false)
  }

  return (
    <span className="relative inline-block">
      <span
        ref={spanRef}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onTouchStart={handleEnter}
        onTouchEnd={handleLeave}
        className="cursor-help hover:bg-white/30 rounded px-0.5 transition-colors"
      >
        {word}
      </span>
      {visible && (loading || tooltip) && (
        <span className={`absolute left-1/2 -translate-x-1/2 px-2.5 py-1 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-20 shadow-lg pointer-events-none ${
          above ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
        }`}>
          {loading ? '…' : tooltip}
          <span className={`absolute left-1/2 -translate-x-1/2 border-4 border-transparent ${
            above ? 'top-full border-t-gray-900' : 'bottom-full border-b-gray-900'
          }`} />
        </span>
      )}
    </span>
  )
}

export default function TranslatableMessage({ text }) {
  const tokens = text.match(/\S+|\s+/g) || []

  return (
    <>
      {tokens.map((token, i) =>
        /\s/.test(token)
          ? <span key={i}>{token}</span>
          : <WordTooltip key={i} word={token} sentence={text} />
      )}
    </>
  )
}
