import { useState, useRef } from 'react'
import { translateWord } from '../../lib/groq'

function WordTooltip({ word, sentence }) {
  const [tooltip, setTooltip] = useState(null)
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0, above: true })
  const timerRef = useRef(null)
  const spanRef = useRef(null)

  const clean = word.replace(/[^a-zA-Z]/g, '')
  if (!clean || clean.length < 2) return <span>{word}</span>

  async function handleEnter() {
    if (spanRef.current) {
      const r = spanRef.current.getBoundingClientRect()
      const above = r.top > 120
      setPos({ x: r.left + r.width / 2, y: above ? r.top - 6 : r.bottom + 6, above })
    }
    setVisible(true)
    if (tooltip) return
    timerRef.current = setTimeout(async () => {
      setLoading(true)
      try { setTooltip(await translateWord(clean, sentence)) } catch {}
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
        <span
          style={{
            position: 'fixed',
            left: `${pos.x}px`,
            top: pos.above ? undefined : `${pos.y}px`,
            bottom: pos.above ? `${window.innerHeight - pos.y}px` : undefined,
            transform: 'translateX(-50%)',
            zIndex: 9999,
          }}
          className="px-2.5 py-1 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap shadow-lg pointer-events-none"
        >
          {loading ? '…' : tooltip}
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
