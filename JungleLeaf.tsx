import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { PortfolioPage } from './pages/PortfolioPage';
import { LoginPage } from './pages/LoginPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { ClientPortalPage } from './pages/ClientPortalPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { BookAppointmentPage } from './pages/BookAppointmentPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { PaymentPage } from './pages/PaymentPage';

function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to={requireAdmin ? '/admin-login' : '/login'} />;
  }
  
  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/" />;
  }
  
  if (!requireAdmin && user?.role === 'admin') {
    return <Navigate to="/admin" />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="admin-login" element={<AdminLoginPage />} />
          <Route 
            path="portal" 
            element={
              <ProtectedRoute>
                <ClientPortalPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="book" 
            element={
              <ProtectedRoute>
                <BookAppointmentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="project/:id" 
            element={
              <ProtectedRoute>
                <ProjectDetailPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="payment/:id" 
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            } 
          />
        </Route>
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboardPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
