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
import { ClientLogin } from './portal/auth/ClientLogin'
import { PortalLayout } from './portal/layout/PortalLayout'
import { ClientDashboard } from './portal/dashboard/ClientDashboard'
import { ClientDocumentVault } from './portal/documents/ClientDocumentVault'
import { ClientAITaxInsights } from './portal/ai/ClientAITaxInsights'
import { ClientPayments } from './portal/payments/ClientPayments'
import { ClientNotifications } from './portal/notifications/ClientNotifications'
import { ClientProfile } from './portal/profile/ClientProfile'

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
