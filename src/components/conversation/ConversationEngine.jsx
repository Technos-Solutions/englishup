import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { chatWithAI, analyzeConversation, buildConversationSystem, quickCorrection } from '../../lib/groq'
import { speak, stopSpeaking } from '../../lib/speech'
import { awardXP, calculateConversationXP } from '../../lib/xp'
import { SCENARIOS } from '../../data/scenarios'
import { getRecentVocabulary, saveVocabulary } from '../../lib/vocabulary'
import SpeechInput from './SpeechInput'
import CorrectionPanel from './CorrectionPanel'
import TranslatableMessage from './TranslatableMessage'

export default function ConversationEngine() {
  const { profile, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [scenario, setScenario] = useState(null)
  const [tab, setTab] = useState('general')
  const [realtimeMode, setRealtimeMode] = useState(false)
  const [pendingMode, setPendingMode] = useState(false)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [ended, setEnded] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [xpEarned, setXpEarned] = useState(0)
  const [analyzing, setAnalyzing] = useState(false)
  const bottomRef = useRef(null)

  const order = ['A1','A2','B1','B2','C1','C2']
  const userIdx = order.indexOf(profile?.level || 'A1')

  const availableScenarios = SCENARIOS.filter(s => {
    if (s.category === 'office-client' || s.category === 'office-provider' || s.category === 'travel') return true
    const scenarioIdx = order.indexOf(s.level)
    return scenarioIdx <= userIdx + 1
  })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function startScenario(s) {
    setPendingMode(s)
  }

  function confirmStart(s, withRealtime) {
    setRealtimeMode(withRealtime)
    setPendingMode(false)
    setScenario(s)
    const aiMessage = { role: 'assistant', content: s.starter }
    setMessages([aiMessage])
    speak(s.starter)
  }

  async function handleUserMessage(text, inputMode) {
    if (loading || ended) return
    stopSpeaking()

    const userMsg = { role: 'user', content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setLoading(true)

    const systemPrompt = buildConversationSystem(profile?.level || 'A1', scenario, getRecentVocabulary())
    const groqMessages = [
      { role: 'system', content: systemPrompt },
      ...newMessages.map(({ role, content }) => ({ role, content })),
    ]

    try {
      const [reply, correction] = await Promise.all([
        chatWithAI(groqMessages),
        realtimeMode ? quickCorrection(text, profile?.level || 'A1') : Promise.resolve(null),
      ])
      if (correction?.has_error) {
        setMessages(prev => prev.map((m, i) =>
          i === prev.length - 1 ? { ...m, correction } : m
        ))
      }
      const aiMsg = { role: 'assistant', content: reply }
      setMessages(prev => [...prev, aiMsg])
      if (inputMode === 'voice') speak(reply)
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: '(Connection error — please try again)' }])
    }
    setLoading(false)
  }

  async function endConversation() {
    stopSpeaking()
    setEnded(true)
    setAnalyzing(true)

    const studentMessages = messages
      .filter(m => m.role === 'user')
      .map(m => m.content)

    if (studentMessages.length === 0) {
      setAnalyzing(false)
      navigate('/dashboard')
      return
    }

    try {
      const result = await analyzeConversation(studentMessages, profile?.level || 'A1')
      const xp = calculateConversationXP(result.fluency_score || 70)
      await awardXP(profile.id, xp, 'conversation', {
        fluency_score: result.fluency_score,
        corrections: result,
      })
      await refreshProfile()
      setXpEarned(xp)
      setAnalysis(result)
      if (result.new_words?.length) saveVocabulary(result.new_words)
    } catch {
      navigate('/dashboard')
    }
    setAnalyzing(false)
  }

  if (pendingMode) {
    const s = pendingMode
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center space-y-6">
          <div className="text-5xl">{s.icon}</div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{s.title}</h2>
            <p className="text-gray-500 text-sm mt-1">{s.description}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-4">Correction mode:</p>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => confirmStart(s, false)}
                className="border-2 border-gray-200 hover:border-indigo-400 rounded-xl p-4 text-left transition-all hover:bg-indigo-50"
              >
                <div className="font-bold text-gray-800">📊 Summary at the end</div>
                <div className="text-sm text-gray-500 mt-0.5">Full correction report after the conversation (recommended)</div>
              </button>
              <button
                onClick={() => confirmStart(s, true)}
                className="border-2 border-gray-200 hover:border-amber-400 rounded-xl p-4 text-left transition-all hover:bg-amber-50"
              >
                <div className="font-bold text-gray-800">⚡ Real-time hints</div>
                <div className="text-sm text-gray-500 mt-0.5">See corrections instantly after each message + summary at the end</div>
              </button>
            </div>
          </div>
          <button onClick={() => setPendingMode(false)} className="text-sm text-gray-400 hover:text-gray-600">
            ← Back
          </button>
        </div>
      </div>
    )
  }

  if (!scenario) {
    const general = availableScenarios.filter(s => !s.category)
    const asClient = availableScenarios.filter(s => s.category === 'office-client')
    const asProvider = availableScenarios.filter(s => s.category === 'office-provider')

    const ScenarioCard = (s) => (
      <button
        key={s.id}
        onClick={() => startScenario(s)}
        className="bg-white hover:bg-indigo-50 border-2 border-gray-100 hover:border-indigo-200 rounded-2xl p-5 text-left transition-all group"
      >
        <div className="text-3xl mb-2">{s.icon}</div>
        <h3 className="font-bold text-gray-900 group-hover:text-indigo-700">{s.title}</h3>
        <p className="text-sm text-gray-500 mt-0.5">{s.description}</p>
        <span className="inline-block mt-2 text-xs font-semibold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
          Level {s.level}
        </span>
      </button>
    )

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🎙️ Choose a Scenario</h1>
          <p className="text-gray-500">Pick a situation to practice. The AI will play the other role.</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'general', label: '🌍 General' },
            { key: 'empresa', label: '🏢 Empresa' },
            { key: 'travel',  label: '✈️ Travel' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-5 py-2 rounded-xl font-semibold text-sm transition-colors ${
                tab === t.key ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'general' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{general.map(ScenarioCard)}</div>
        )}

        {tab === 'travel' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {availableScenarios.filter(s => s.category === 'travel').map(ScenarioCard)}
          </div>
        )}

        {tab === 'empresa' && (
          <div className="space-y-6">
            {asClient.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-blue-500 uppercase tracking-wider mb-3">🧑‍💼 As Client</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{asClient.map(ScenarioCard)}</div>
              </div>
            )}
            {asProvider.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-3">🏭 As Provider</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{asProvider.map(ScenarioCard)}</div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{scenario.icon}</span>
          <div>
            <h2 className="font-bold text-gray-900">{scenario.title}</h2>
            <p className="text-xs text-gray-400">Level {scenario.level}</p>
          </div>
        </div>
        {!ended && (
          <button
            onClick={endConversation}
            className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
          >
            End & Analyse
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-xs sm:max-w-md rounded-2xl px-4 py-3 text-sm ${
              m.role === 'user'
                ? 'bg-indigo-600 text-white rounded-br-sm'
                : 'bg-white text-gray-900 border border-gray-100 rounded-bl-sm shadow-sm'
            }`}>
              {m.role === 'assistant'
                ? <TranslatableMessage text={m.content} />
                : m.content}
            </div>
            {m.correction?.has_error && (
              <div className="mt-1 max-w-xs sm:max-w-md bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs text-amber-800 space-y-0.5">
                <div><span className="line-through text-red-400">{m.correction.original}</span> → <span className="font-semibold text-green-700">{m.correction.correction}</span></div>
                <div className="text-amber-600">{m.correction.tip}</div>
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 text-gray-400 text-sm shadow-sm">
              typing…
            </div>
          </div>
        )}
        {analyzing && (
          <div className="text-center py-8">
            <div className="text-4xl animate-bounce mb-2">📊</div>
            <p className="text-gray-500">Analysing your conversation…</p>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {!ended && (
        <SpeechInput onSubmit={handleUserMessage} disabled={loading} />
      )}

      {/* Correction panel */}
      {analysis && (
        <CorrectionPanel
          analysis={analysis}
          xpEarned={xpEarned}
          onClose={() => navigate('/dashboard')}
        />
      )}
    </div>
  )
}
