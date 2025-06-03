import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Pages
import Login from '@/pages/auth/Login';
import Dashboard from '@/pages/dashboard/Dashboard';
import Users from '@/pages/users/Users';
import Leads from '@/pages/leads/Leads';
import Plans from '@/pages/plans/Plans';
import Commissions from '@/pages/commissions/Commissions';
import Contracts from '@/pages/contracts/Contracts';
import Contacts from '@/pages/contacts/Contacts';
import Clients from '@/pages/clients/Clients';
import Settings from '@/pages/settings/Settings';

// AI Chat Pages
import Emilia from '@/pages/ai-chat/Emilia';
import Elias from '@/pages/ai-chat/Elias';

// Agents IA
import CustomAgents from '@/pages/agents/CustomAgents';

// WhatsApp Assistants Pages
import ConversationManager from '@/pages/whatsapp-assistants/ConversationManager';
import CreateAgent from '@/pages/whatsapp-assistants/CreateAgent';
import Monitoring from '@/pages/whatsapp-assistants/Monitoring';

// Prospecting Pages
import UraReversa from '@/pages/prospecting/UraReversa';
import SMS from '@/pages/prospecting/SMS';
import WhatsApp from '@/pages/prospecting/WhatsApp';

// Component to handle root redirect
const RootRedirect = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }
  
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
};

// Not Found component
const NotFound = () => (
  <ProtectedRoute>
    <Layout>
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">404 - Página não encontrada</h2>
          <p className="text-muted-foreground mb-4">A página que você está procurando não existe.</p>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
          >
            Ir para Dashboard
          </button>
        </div>
      </div>
    </Layout>
  </ProtectedRoute>
);

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Root redirect */}
            <Route path="/" element={<RootRedirect />} />
            
            {/* Protected routes - wrapped with ProtectedRoute and Layout */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Layout><Dashboard /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/users" 
              element={
                <ProtectedRoute>
                  <Layout><Users /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/leads" 
              element={
                <ProtectedRoute>
                  <Layout><Leads /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/plans" 
              element={
                <ProtectedRoute>
                  <Layout><Plans /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/commissions" 
              element={
                <ProtectedRoute>
                  <Layout><Commissions /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/contracts" 
              element={
                <ProtectedRoute>
                  <Layout><Contracts /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/contacts" 
              element={
                <ProtectedRoute>
                  <Layout><Contacts /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/clients" 
              element={
                <ProtectedRoute>
                  <Layout><Clients /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Layout><Settings /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ai-chat/emilia" 
              element={
                <ProtectedRoute>
                  <Layout><Emilia /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ai-chat/elias" 
              element={
                <ProtectedRoute>
                  <Layout><Elias /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agents-whatsapp" 
              element={
                <ProtectedRoute>
                  <Layout><CustomAgents /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/whatsapp-assistants/conversations" 
              element={
                <ProtectedRoute>
                  <Layout><ConversationManager /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/whatsapp-assistants/create" 
              element={
                <ProtectedRoute>
                  <Layout><CreateAgent /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/whatsapp-assistants/monitoring" 
              element={
                <ProtectedRoute>
                  <Layout><Monitoring /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/prospecting/ura-reversa" 
              element={
                <ProtectedRoute>
                  <Layout><UraReversa /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/prospecting/sms" 
              element={
                <ProtectedRoute>
                  <Layout><SMS /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/prospecting/whatsapp" 
              element={
                <ProtectedRoute>
                  <Layout><WhatsApp /></Layout>
                </ProtectedRoute>
              } 
            />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;