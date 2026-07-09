import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout'
import { Dashboard } from './pages/Dashboard'
import { LandingPage } from './pages/LandingPage'
import { ClientRegistry } from './pages/ClientRegistry'
import { ClientDetails } from './pages/ClientDetails'
import { StaffManagement } from './pages/StaffManagement'
import { StaffDetails } from './pages/StaffDetails'
import { QCReview } from './pages/QCReview'
import { Communication } from './pages/Communication'
import { Attendance } from './pages/Attendance'

// Client Portal Pages
import { ClientLogin } from './pages/portal/ClientLogin'
import { PortalLayout } from './pages/portal/PortalLayout'
import { ClientDashboard } from './pages/portal/ClientDashboard'
import { ClientDocumentVault } from './pages/portal/ClientDocumentVault'
import { ClientAITaxInsights } from './pages/portal/ClientAITaxInsights'
import { ClientPayments } from './pages/portal/ClientPayments'
import { ClientNotifications } from './pages/portal/ClientNotifications'
import { ClientProfile } from './pages/portal/ClientProfile'

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
          <Route path="staff/:id" element={<StaffDetails />} />
          <Route path="qc" element={<QCReview />} />
          <Route path="messages" element={<Communication />} />
          <Route path="attendance" element={<Attendance />} />
        </Route>
        
        {/* Client Portal Routes */}
        <Route path="/portal/login" element={<ClientLogin />} />
        <Route path="/portal" element={<PortalLayout />}>
          <Route index element={<ClientDashboard />} />
          <Route path="documents" element={<ClientDocumentVault />} />
          <Route path="ai" element={<ClientAITaxInsights />} />
          <Route path="payments" element={<ClientPayments />} />
          <Route path="notifications" element={<ClientNotifications />} />
          <Route path="profile" element={<ClientProfile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
