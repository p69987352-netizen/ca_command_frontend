import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout'
import { Dashboard } from './pages/Dashboard'
import { LandingPage } from './pages/LandingPage'
import { ClientRegistry } from './pages/ClientRegistry'
import { ClientDetails } from './pages/ClientDetails'
import { StaffManagement } from './pages/StaffManagement'
import { QCReview } from './pages/QCReview'
import { Communication } from './pages/Communication'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="clients" element={<ClientRegistry />} />
          <Route path="clients/:id" element={<ClientDetails />} />
          <Route path="staff" element={<StaffManagement />} />
          <Route path="qc" element={<QCReview />} />
          <Route path="messages" element={<Communication />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
