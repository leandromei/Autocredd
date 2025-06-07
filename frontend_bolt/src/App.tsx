import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/layout/Layout';

// Pages
import Dashboard from './pages/dashboard/Dashboard';
import Leads from './pages/leads/Leads';
import Contracts from './pages/contracts/Contracts';
import Contacts from './pages/contacts/Contacts';
import Clients from './pages/clients/Clients';
import Settings from './pages/settings/Settings';

// AI Chat Pages
import Emilia from './pages/ai-chat/Emilia';
import Elias from './pages/ai-chat/Elias';

// WhatsApp Assistant Pages
import AgentsWhatsApp from './pages/agents/AgentsWhatsApp';
import WhatsAppConversations from './pages/whatsapp-assistants/Conversations';
import WhatsAppMonitoring from './pages/whatsapp-assistants/Monitoring';

// Prospecting Pages
import UraReversa from './pages/prospecting/UraReversa';
import SMS from './pages/prospecting/SMS';
import WhatsAppProspecting from './pages/prospecting/WhatsApp';

// WhatsApp Connection
import WhatsAppConnection from './pages/WhatsAppConnection';
import WhatsApp from './pages/whatsapp/WhatsApp';

// Auth Pages
import Login from './pages/auth/Login';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (changed from cacheTime)
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Layout>
                <Routes>
                  {/* Auth Routes */}
                  <Route path="/login" element={<Login />} />
                  
                  {/* Main Dashboard */}
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  
                  {/* Core Business Pages */}
                  <Route path="/leads" element={<Leads />} />
                  <Route path="/contracts" element={<Contracts />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/settings" element={<Settings />} />
                  
                  {/* AI Chat Routes */}
                  <Route path="/ai-chat/emilia" element={<Emilia />} />
                  <Route path="/ai-chat/elias" element={<Elias />} />
                  
                  {/* WhatsApp Assistant Routes */}
                  <Route path="/agents-whatsapp" element={<AgentsWhatsApp />} />
                  <Route path="/whatsapp-assistants/conversations" element={<WhatsAppConversations />} />
                  <Route path="/whatsapp-assistants/monitoring" element={<WhatsAppMonitoring />} />
                  
                  {/* Prospecting Routes */}
                  <Route path="/prospecting/ura-reversa" element={<UraReversa />} />
                  <Route path="/prospecting/sms" element={<SMS />} />
                  <Route path="/prospecting/whatsapp" element={<WhatsAppProspecting />} />
                  
                  {/* WhatsApp Connection */}
                  <Route path="/whatsapp/connection" element={<WhatsAppConnection />} />
                  <Route path="/whatsapp" element={<WhatsApp />} />
                </Routes>
              </Layout>
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;