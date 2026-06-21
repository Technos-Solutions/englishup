import { useNavigate } from 'react-router-dom'
import { TAG_TO_TOPIC } from '../../data/grammar'

function detectGrammarTopics(errors) {
  if (!errors?.length) return []
  const found = new Set()
  for (const e of errors) {
    const text = `${e.original} ${e.correction} ${e.explanation}`.toLowerCase()
    if (text.includes(' am ') || text.includes(' is ') || text.includes(' are ') ||
        text.includes(' was ') || text.includes(' were ') || text.includes("'m ") ||
        text.includes("to be")) found.add('to-be')
    if (text.includes(' have ') || text.includes(' has ') || text.includes(' had ') ||
        text.includes("to have")) found.add('to-have')
    if (text.includes('present perfect') || text.includes("'ve ") || text.includes("'s ") ||
        text.includes(' haven') || text.includes(' hasn')) found.add('present-perfect')
    if (text.includes('past simple') || text.includes('past tense') ||
        text.includes("didn't") || text.includes('did not')) found.add('past-simple')
    if (text.includes('present simple') || text.includes("don't") || text.includes("doesn't")) found.add('present-simple')
    if (text.includes('pronoun') || text.includes(' him ') || text.includes(' her ') ||
        text.includes(' their ') || text.includes(' his ')) found.add('pronouns')
    if (text.includes('modal') || text.includes(' can ') || text.includes(' should ') ||
        text.includes(' must ') || text.includes(' would ') || text.includes(' might ')) found.add('modal-verbs')
  }
  return [...found].filter(tag => TAG_TO_TOPIC[tag])
}

export default function CorrectionPanel({ analysis, xpEarned, onClose }) {
  const navigate = useNavigate()
  if (!analysis) return null

  const scoreColor =
    analysis.fluency_score >= 80 ? 'text-emerald-600' :
    analysis.fluency_score >= 60 ? 'text-amber-600' : 'text-red-500'

  const grammarSuggestions = detectGrammarTopics(analysis.errors)

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <h2 className="text-xl font-bold text-gray-900">Conversation Analysis</h2>
          </div>

          {/* Fluency score */}
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">Fluency Score</p>
            <p className={`text-5xl font-bold ${scoreColor}`}>{analysis.fluency_score}</p>
            <p className="text-sm text-gray-400 mt-1">out of 100</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div className="h-2 rounded-full transition-all duration-1000"
                style={{ width: `${analysis.fluency_score}%`,
                  backgroundColor: analysis.fluency_score >= 80 ? '#10B981' : analysis.fluency_score >= 60 ? '#F59E0B' : '#EF4444' }} />
            </div>
          </div>

          {/* XP earned */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
            <p className="text-amber-700 font-bold text-lg">+{xpEarned} XP earned! ⭐</p>
          </div>

          {/* Overall feedback */}
          {analysis.overall_feedback && (
            <div className="bg-indigo-50 rounded-xl p-4">
              <p className="text-sm font-semibold text-indigo-700 mb-1">Overall Feedback</p>
              <p className="text-sm text-indigo-900">{analysis.overall_feedback}</p>
            </div>
          )}

          {/* Grammar errors */}
          {analysis.errors?.length > 0 && (
            <div>
              <p className="font-semibold text-gray-700 mb-2">Grammar Corrections</p>
              <div className="space-y-2">
                {analysis.errors.map((e, i) => (
                  <div key={i} className="bg-red-50 border border-red-100 rounded-xl p-3">
                    <p className="text-sm">
                      <span className="text-red-500 line-through mr-2">"{e.original}"</span>
                      <span className="text-emerald-600 font-semibold">→ "{e.correction}"</span>
                    </p>
                    {e.explanation && <p className="text-xs text-gray-500 mt-1">{e.explanation}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grammar Focus suggestion — optional */}
          {grammarSuggestions.length > 0 && (
            <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 space-y-2">
              <p className="text-sm font-semibold text-violet-700">🎯 Reforça la gramàtica</p>
              <p className="text-xs text-violet-600">Has tingut errors en aquests punts. Vols practicar-los?</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {grammarSuggestions.map(tag => {
                  const topic = TAG_TO_TOPIC[tag]
                  return (
                    <button key={tag}
                      onClick={() => { onClose(); navigate(`/grammar?topic=${tag}`) }}
                      className="bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors">
                      {topic.icon} {topic.title}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Vocabulary suggestions */}
          {analysis.vocabulary_suggestions?.length > 0 && (
            <div>
              <p className="font-semibold text-gray-700 mb-2">Better Vocabulary</p>
              <div className="space-y-2">
                {analysis.vocabulary_suggestions.map((v, i) => (
                  <div key={i} className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                    <p className="text-sm">
                      <span className="text-gray-500 mr-2">"{v.used}"</span>
                      <span className="text-blue-600 font-semibold">→ "{v.better}"</span>
                    </p>
                    {v.note && <p className="text-xs text-gray-500 mt-1">{v.note}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Model sentence */}
          {analysis.model_sentence && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
              <p className="text-sm font-semibold text-emerald-700 mb-1">Model sentence</p>
              <p className="text-sm text-emerald-900 italic">"{analysis.model_sentence}"</p>
            </div>
          )}

          <button onClick={onClose}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors">
            Continue learning 🚀
          </button>
        </div>
      </div>
    </div>
  )
}
