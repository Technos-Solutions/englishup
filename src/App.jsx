import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/layout/Layout'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Dashboard from './components/dashboard/Dashboard'
import ConversationEngine from './components/conversation/ConversationEngine'
import GamesHub from './components/games/GamesHub'
import ListeningMatch from './components/games/ListeningMatch'
import ShadowingBlitz from './components/games/ShadowingBlitz'
import VerbBlitz from './components/games/VerbBlitz'
import Ranking from './components/ranking/Ranking'
import Trophies from './components/prizes/Trophies'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-4xl animate-bounce">🎓</div>
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  return <Layout>{children}</Layout>
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          <Route path="/dashboard"          element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/conversation"       element={<ProtectedRoute><ConversationEngine /></ProtectedRoute>} />
          <Route path="/games"              element={<ProtectedRoute><GamesHub /></ProtectedRoute>} />
          <Route path="/games/listening"    element={<ProtectedRoute><ListeningMatch /></ProtectedRoute>} />
          <Route path="/games/shadowing"    element={<ProtectedRoute><ShadowingBlitz /></ProtectedRoute>} />
          <Route path="/games/verbs"        element={<ProtectedRoute><VerbBlitz /></ProtectedRoute>} />
          <Route path="/ranking"            element={<ProtectedRoute><Ranking /></ProtectedRoute>} />
          <Route path="/trophies"           element={<ProtectedRoute><Trophies /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
