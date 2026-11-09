import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message || error.msg || JSON.stringify(error))
    else navigate('/dashboard')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-3xl shadow-[0_0_24px_rgba(139,92,246,0.5)]">🎓</div>
          <h1 className="text-3xl text-white">Welcome back!</h1>
          <p className="text-indigo-200 mt-1 font-semibold">Continue your English journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-indigo-200 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3 font-semibold text-white placeholder:text-indigo-300/50 focus:outline-none focus:ring-4 focus:ring-violet-500/30 focus:border-violet-400 transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-indigo-200 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3 font-semibold text-white placeholder:text-indigo-300/50 focus:outline-none focus:ring-4 focus:ring-violet-500/30 focus:border-violet-400 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-300 text-sm font-semibold bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-indigo-200 mt-6 text-sm font-semibold">
          No account yet?{' '}
          <Link to="/register" className="text-violet-300 font-bold hover:underline">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  )
}
