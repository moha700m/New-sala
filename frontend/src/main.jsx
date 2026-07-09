import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import AgentSouq from './pages/agent-souq.jsx'
import AgentDetail from './pages/agent-detail.jsx'
import SubmitAgent from './pages/submit-agent.jsx'
import AuthPage from './pages/auth-page.jsx'
import OwnerDashboard from './pages/owner-dashboard.jsx'
import AboutPage from './pages/about-page.jsx'
import Checkout from './pages/checkout.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AgentSouq />} />
        <Route path="/agent/:id" element={<AgentDetail />} />
        <Route path="/submit" element={<SubmitAgent />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<OwnerDashboard />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
