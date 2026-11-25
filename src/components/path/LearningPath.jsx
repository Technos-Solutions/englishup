import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { getPathForLang, getCompletedStepIds, getCurrentStepIndex, stepHref } from '../../lib/path'

const TYPE_LABEL = { grammar: 'Gramàtica', scenario: 'Conversa', game: 'Joc' }

export default function LearningPath() {
  const { profile } = useAuth()
  const { lang, info } = useLanguage()
  const navigate = useNavigate()
  const [completed, setCompleted] = useState(null)

  const path = getPathForLang(lang)

  useEffect(() => {
    if (!profile) return
    getCompletedStepIds(profile.id, lang).then(setCompleted)
  }, [profile?.id, lang])

  if (!path.length) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-3">
        <div className="text-5xl">🚧</div>
        <h1 className="text-xl font-bold text-white">Encara no hi ha un camí guiat per a {info.nativeName}</h1>
        <p className="text-indigo-200 text-sm">De moment només existeix per a l'irlandès (Gaeilge).</p>
      </div>
    )
  }

  if (completed === null) {
    return <div className="text-center text-indigo-200 py-12">Carregant el teu progrés…</div>
  }

  const currentIdx = getCurrentStepIndex(path, completed)

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">🗺️ Camí d'Aprenentatge — {info.nativeName}</h1>
        <p className="text-indigo-200 mt-1">
          {completed.size}/{path.length} passos completats. Fes-los en ordre per desbloquejar el següent.
        </p>
      </div>

      <div className="relative pl-8">
        <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-white/10" />
        <div className="space-y-3">
          {path.map((step, i) => {
            const isDone = completed.has(step.id)
            const isCurrent = i === currentIdx
            const isLocked = i > currentIdx

            return (
              <div key={step.id} className="relative">
                <div
                  className={`absolute -left-8 top-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                    isDone ? 'bg-emerald-500 border-emerald-400 text-white'
                    : isCurrent ? 'bg-indigo-600 border-indigo-400 text-white animate-pulse'
                    : 'bg-slate-800 border-white/10 text-indigo-300/40'
                  }`}
                >
                  {isDone ? '✓' : isLocked ? '🔒' : i + 1}
                </div>

                <button
                  disabled={isLocked}
                  onClick={() => navigate(stepHref(step))}
                  className={`w-full text-left rounded-2xl p-4 border-2 transition-all flex items-center gap-3 ${
                    isLocked
                      ? 'bg-white/5 border-white/5 opacity-50 cursor-not-allowed'
                      : isDone
                      ? 'bg-white hover:bg-emerald-50 border-emerald-200'
                      : 'bg-white hover:bg-indigo-50 border-indigo-300 shadow-lg'
                  }`}
                >
                  <span className="text-2xl">{step.icon}</span>
                  <div className="flex-1">
                    <p className={`font-bold ${isLocked ? 'text-indigo-200' : 'text-gray-900'}`}>{step.title}</p>
                    <p className={`text-xs font-semibold ${isLocked ? 'text-indigo-300/60' : 'text-gray-400'}`}>
                      {TYPE_LABEL[step.type]} · {step.level}
                    </p>
                  </div>
                  {isCurrent && (
                    <span className="text-xs font-bold bg-indigo-600 text-white px-3 py-1.5 rounded-full">
                      Comença →
                    </span>
                  )}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {currentIdx >= path.length && (
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 text-center">
          <div className="text-4xl mb-2">🎉</div>
          <p className="font-bold text-emerald-700">Has completat tot el camí guiat d'irlandès!</p>
          <p className="text-sm text-emerald-600 mt-1">Pots seguir practicant lliurement des de Games, Grammar i Talk.</p>
        </div>
      )}
    </div>
  )
}
