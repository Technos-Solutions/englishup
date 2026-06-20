import { LEVELS } from '../../data/levels'
import { getLevelFromXP, getProgressInLevel } from '../../lib/xp'

export default function XPBar({ xp }) {
  const level = getLevelFromXP(xp)
  const progress = getProgressInLevel(xp)
  const nextLevel = LEVELS[LEVELS.findIndex(l => l.code === level.code) + 1]

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{level.icon}</span>
          <div>
            <p className="font-bold text-gray-900">{level.code} — {level.name}</p>
            <p className="text-sm text-gray-500">⭐ {xp.toLocaleString()} XP total</p>
          </div>
        </div>
        {nextLevel && (
          <div className="text-right text-sm text-gray-400">
            <p>Next: {nextLevel.icon} {nextLevel.code}</p>
            <p>{(nextLevel.minXP - xp).toLocaleString()} XP to go</p>
          </div>
        )}
      </div>

      <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
        <div
          className="h-4 rounded-full transition-all duration-700"
          style={{ width: `${progress}%`, backgroundColor: level.color }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{level.minXP.toLocaleString()} XP</span>
        <span className="font-semibold text-gray-600">{progress}%</span>
        {nextLevel && <span>{nextLevel.minXP.toLocaleString()} XP</span>}
      </div>
    </div>
  )
}
