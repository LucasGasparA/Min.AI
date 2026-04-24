import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import SelectMunicipality from './pages/SelectMunicipality'
import CreateProposal from './pages/CreateProposal'
import ProposalEditor from './pages/ProposalEditor'
import { api } from './utils/api.js'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedMunicipality, setSelectedMunicipality] = useState(null)

  useEffect(() => {
    api.get('/auth/me')
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setLoading(false))
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = async () => {
    try { await api.post('/auth/logout', {}) } catch { /* ignora */ }
    setIsAuthenticated(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-50">
        <div className="text-primary-600 text-lg">Carregando...</div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />}
        />

        <Route
          path="/"
          element={
            isAuthenticated
              ? <Layout selectedMunicipality={selectedMunicipality} onLogout={handleLogout} />
              : <Navigate to="/login" />
          }
        >
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route
            path="select-municipality"
            element={<SelectMunicipality onSelect={setSelectedMunicipality} current={selectedMunicipality} />}
          />
          <Route path="create-proposal" element={<CreateProposal />} />
          <Route path="proposal/:id/edit" element={<ProposalEditor />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App
