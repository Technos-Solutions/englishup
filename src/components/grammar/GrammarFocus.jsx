import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { speak } from '../../lib/speech'
import { GRAMMAR_TOPICS } from '../../data/grammar'
import { LEVELS } from '../../data/levels'
import { useAuth } from '../../context/AuthContext'

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

function QuizSection({ quiz }) {
  const [questions] = useState(() => quiz.map(q => ({ ...q, options: shuffle(q.options) })))
  const [answers, setAnswers] = useState({})
  const [done, setDone] = useState(false)

  function select(idx, opt) {
    if (answers[idx] !== undefined) return
    setAnswers(prev => ({ ...prev, [idx]: opt }))
  }

  const correct = Object.entries(answers).filter(([i, a]) => a === questions[i].answer).length

  return (
    <div className="space-y-4">
      {questions.map((q, i) => (
        <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="font-medium text-gray-800 mb-3">{q.q}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {q.options.map(opt => {
              const selected = answers[i] === opt
              const isCorrect = opt === q.answer
              let cls = 'text-left px-3 py-2 rounded-lg text-sm border-2 transition-all '
              if (answers[i] === undefined) {
                cls += 'border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 text-gray-700'
              } else if (isCorrect) {
                cls += 'border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold'
              } else if (selected) {
                cls += 'border-red-400 bg-red-50 text-red-600'
              } else {
                cls += 'border-gray-100 bg-gray-50 text-gray-400'
              }
              return (
                <button key={opt} onClick={() => select(i, opt)} className={cls}>
                  {opt}
                  {answers[i] !== undefined && isCorrect && ' ✓'}
                  {selected && !isCorrect && ' ✗'}
                </button>
              )
            })}
          </div>
        </div>
      ))}
      {Object.keys(answers).length === questions.length && (
        <div className={`rounded-xl p-4 text-center font-bold text-lg ${correct === questions.length ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
          {correct}/{questions.length} correct {correct === questions.length ? '🎉' : '— keep practising!'}
        </div>
      )}
    </div>
  )
}

function TopicDetail({ topic }) {
  const [activeForm, setActiveForm] = useState(topic.table[0].form)
  const [tab, setTab] = useState('table')
  const rows = topic.table.find(t => t.form === activeForm)?.rows || []

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-4xl">{topic.icon}</span>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{topic.title}</h2>
          <p className="text-gray-500 text-sm">{topic.summary}</p>
        </div>
        <span className="ml-auto text-xs font-semibold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full">{topic.level}+</span>
      </div>

      {/* Tab: Table / Quiz */}
      <div className="flex gap-2 border-b border-gray-100 pb-1">
        <button onClick={() => setTab('table')}
          className={`px-4 py-2 rounded-t-lg font-semibold text-sm transition-colors ${tab === 'table' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}>
          📋 Table
        </button>
        <button onClick={() => setTab('quiz')}
          className={`px-4 py-2 rounded-t-lg font-semibold text-sm transition-colors ${tab === 'quiz' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}>
          🎯 Practice
        </button>
      </div>

      {tab === 'table' && (
        <div className="space-y-4">
          {/* Form selector */}
          <div className="flex flex-wrap gap-2">
            {topic.table.map(t => (
              <button key={t.form} onClick={() => setActiveForm(t.form)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${activeForm === t.form ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {t.form}
              </button>
            ))}
          </div>

          {/* Rows */}
          <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-3">Català</th>
                  <th className="text-left px-4 py-3">English</th>
                  <th className="text-left px-4 py-3 hidden sm:table-cell">Example</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map((row, i) => (
                  <tr key={i} className="hover:bg-indigo-50 transition-colors">
                    <td className="px-4 py-3 text-gray-500 italic">{row.cat}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => speak(row.en)}
                        className="font-bold text-indigo-700 hover:text-indigo-900 text-left">
                        {row.en} 🔊
                      </button>
                    </td>
                    <td className="px-4 py-3 text-gray-400 hidden sm:table-cell italic">
                      <button onClick={() => speak(row.example)} className="hover:text-gray-600 text-left">
                        {row.example}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile examples */}
          <div className="sm:hidden space-y-2">
            {rows.map((row, i) => (
              <div key={i} className="bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-500 italic">
                <button onClick={() => speak(row.example)}>{row.example} 🔊</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'quiz' && <QuizSection quiz={topic.quiz} />}
    </div>
  )
}

export default function GrammarFocus() {
  const { profile } = useAuth()
  const [searchParams] = useSearchParams()
  const initialTag = searchParams.get('topic')
  const initialTopic = GRAMMAR_TOPICS.find(t => t.tag === initialTag) || null
  const [selected, setSelected] = useState(initialTopic)

  const userLevelIdx = LEVELS.findIndex(l => l.code === (profile?.level || 'A1'))
  const available = GRAMMAR_TOPICS.filter(t => {
    const tIdx = LEVELS.findIndex(l => l.code === t.level)
    return tIdx <= userLevelIdx + 1
  })

  if (selected) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <button onClick={() => setSelected(null)} className="text-sm text-indigo-500 hover:text-indigo-700 flex items-center gap-1">
          ← All topics
        </button>
        <TopicDetail topic={selected} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">📚 Grammar Focus</h1>
        <p className="text-gray-500 mt-1">Selecciona un tema per veure la taula completa, exemples i practicar.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {available.map(t => (
          <button key={t.id} onClick={() => setSelected(t)}
            className="bg-white hover:bg-indigo-50 border-2 border-gray-100 hover:border-indigo-200 rounded-2xl p-5 text-left transition-all group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{t.icon}</span>
              <div>
                <h3 className="font-bold text-gray-900 group-hover:text-indigo-700">{t.title}</h3>
                <span className="text-xs font-semibold text-indigo-400">{t.level}+</span>
              </div>
            </div>
            <p className="text-sm text-gray-500">{t.summary}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
