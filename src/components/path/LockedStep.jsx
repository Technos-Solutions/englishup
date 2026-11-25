import { useNavigate } from 'react-router-dom'

export default function LockedStep() {
  const navigate = useNavigate()
  return (
    <div className="max-w-md mx-auto text-center py-16 space-y-4">
      <div className="text-5xl">🔒</div>
      <h1 className="text-xl font-bold text-white">Encara no has desbloquejat això</h1>
      <p className="text-indigo-200 text-sm">
        Segueix el camí d'aprenentatge en ordre per arribar-hi.
      </p>
      <button
        onClick={() => navigate('/path')}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
      >
        🗺️ Anar al Camí d'Aprenentatge
      </button>
    </div>
  )
}
