import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import SelectMunicipality from './pages/SelectMunicipality'
import CreateProposal from './pages/CreateProposal'
import ProposalEditor from './pages/ProposalEditor'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'))
  const [selectedMunicipality, setSelectedMunicipality] = useState(null)

  const handleLogin = (token) => {
    localStorage.setItem('token', token)
    setIsAuthenticated(true)
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
              <Navigate to="/dashboard" /> : 
              <Login onLogin={handleLogin} />
          } 
        />
        
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
              <Layout selectedMunicipality={selectedMunicipality} /> : 
              <Navigate to="/login" />
          }
        >
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route 
            path="select-municipality" 
            element={
              <SelectMunicipality 
                onSelect={setSelectedMunicipality} 
                current={selectedMunicipality} 
              />
            } 
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
