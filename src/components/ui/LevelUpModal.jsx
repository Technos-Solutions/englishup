export default function LevelUpModal({ level, onClose }) {
  if (!level) return null

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
      <div className="card p-8 w-full max-w-sm text-center space-y-4">
        <div className="text-7xl animate-bounce">{level.icon}</div>
        <div>
          <p className="text-sm font-extrabold text-indigo-500 uppercase tracking-wider">Level Up!</p>
          <h2 className="text-3xl text-gray-900 mt-1">{level.code} — {level.name}</h2>
        </div>
        <p className="text-gray-500 font-semibold">Has pujat de nivell! Segueix així 🎉</p>
        <button onClick={onClose} className="btn-primary w-full">
          Genial! →
        </button>
      </div>
    </div>
  )
}
