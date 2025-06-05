import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  DollarSign,
  FileSignature,
  Contact,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  User,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Bot,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  TrendingUp,
  Cog,
  Target,
  Phone,
  MessageSquare,
  Headphones,
  Activity,
  Home,
} from 'lucide-react';
import { useState } from 'react';

// Pages
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import LeadsComplete from './pages/LeadsComplete';
import Clients from './pages/Clients';
import ClientsComplete from './pages/ClientsComplete';
import Contracts from './pages/Contracts';
import ContractsComplete from './pages/ContractsComplete';
import Contacts from './pages/Contacts';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Leads', href: '/leads', icon: FileText },
  { name: 'Contratos', href: '/contracts', icon: FileSignature },
  { name: 'Contratos Completo', href: '/contracts-complete', icon: FileSignature },
  { name: 'Contatos', href: '/contacts', icon: Contact },
  { name: 'Clientes', href: '/clients', icon: Users },
  { name: 'Configurações', href: '/settings', icon: Settings },
];

// AI Chat Options
const aiChatOptions = [
  { 
    name: 'Emilia - (Vendas e financeiro)', 
    href: '/ai-chat/emilia', 
    icon: TrendingUp,
    description: 'Especialista em vendas e questões financeiras'
  },
  { 
    name: 'Elias - (Operacional e gestão)', 
    href: '/ai-chat/elias', 
    icon: Cog,
    description: 'Especialista em operações e gestão'
  },
];

// WhatsApp Assistant Options
const whatsappOptions = [
  { 
    name: 'Assistente WhatsApp - Vendas', 
    href: '/whatsapp/sales', 
    icon: MessageSquare,
    description: 'Automação para vendas via WhatsApp'
  },
  { 
    name: 'Assistente WhatsApp - Suporte', 
    href: '/whatsapp/support', 
    icon: Phone,
    description: 'Automação para suporte via WhatsApp'
  },
  { 
    name: 'WhatsApp Connection', 
    href: '/whatsapp/connection', 
    icon: Phone,
    description: 'Conectar WhatsApp Business'
  },
];

// Prospecting Options
const prospectingOptions = [
  { 
    name: 'Prospecção Ativa', 
    href: '/prospecting/active', 
    icon: Target,
    description: 'Ferramenta de prospecção ativa'
  },
  { 
    name: 'Análise de Mercado', 
    href: '/prospecting/analysis', 
    icon: Activity,
    description: 'Análise e insights de mercado'
  },
];

function Sidebar({ isOpen }: { isOpen: boolean }) {
  const location = useLocation();
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const [prospectingOpen, setProspectingOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const isParentActive = (paths: string[]) => paths.some(path => location.pathname.startsWith(path));

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
      isOpen ? 'w-64' : 'w-16'
    } flex flex-col h-full shadow-sm`}>
      {/* Logo/Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {isOpen && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AutoCred
            </span>
          </div>
        )}
        {!isOpen && (
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto">
            <Home className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {/* Main Navigation */}
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-100'
              } ${!isOpen && 'justify-center'}`}
              title={!isOpen ? item.name : undefined}
            >
              <Icon className="w-5 h-5" />
              {isOpen && <span className="ml-3">{item.name}</span>}
            </Link>
          );
        })}

        {/* AI Chat Section */}
        <div className="mt-6">
          <button
            onClick={() => setAiChatOpen(!aiChatOpen)}
            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              isParentActive(['/ai-chat'])
                ? 'bg-purple-100 text-purple-700 border border-purple-200'
                : 'text-gray-700 hover:bg-gray-100'
            } ${!isOpen && 'justify-center'}`}
          >
            <Bot className="w-5 h-5" />
            {isOpen && (
              <>
                <span className="ml-3 flex-1 text-left">Conversar com IA</span>
                {aiChatOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </>
            )}
          </button>
          {isOpen && aiChatOpen && (
            <div className="ml-6 mt-2 space-y-1">
              {aiChatOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Link
                    key={option.name}
                    to={option.href}
                    className={`flex items-center px-3 py-2 text-xs rounded-md transition-colors ${
                      isActive(option.href)
                        ? 'bg-purple-50 text-purple-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="ml-2">{option.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Prospecting Section */}
        <div className="mt-4">
          <button
            onClick={() => setProspectingOpen(!prospectingOpen)}
            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              isParentActive(['/prospecting'])
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'text-gray-700 hover:bg-gray-100'
            } ${!isOpen && 'justify-center'}`}
          >
            <Target className="w-5 h-5" />
            {isOpen && (
              <>
                <span className="ml-3 flex-1 text-left">Prospecção</span>
                {prospectingOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </>
            )}
          </button>
          {isOpen && prospectingOpen && (
            <div className="ml-6 mt-2 space-y-1">
              {prospectingOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Link
                    key={option.name}
                    to={option.href}
                    className={`flex items-center px-3 py-2 text-xs rounded-md transition-colors ${
                      isActive(option.href)
                        ? 'bg-green-50 text-green-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="ml-2">{option.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* WhatsApp Assistants Section */}
        <div className="mt-4">
          <button
            onClick={() => setWhatsappOpen(!whatsappOpen)}
            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              isParentActive(['/whatsapp'])
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'text-gray-700 hover:bg-gray-100'
            } ${!isOpen && 'justify-center'}`}
          >
            <MessageSquare className="w-5 h-5" />
            {isOpen && (
              <>
                <span className="ml-3 flex-1 text-left">WhatsApp Assistants</span>
                {whatsappOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </>
            )}
          </button>
          {isOpen && whatsappOpen && (
            <div className="ml-6 mt-2 space-y-1">
              {whatsappOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Link
                    key={option.name}
                    to={option.href}
                    className={`flex items-center px-3 py-2 text-xs rounded-md transition-colors ${
                      isActive(option.href)
                        ? 'bg-green-50 text-green-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="ml-2">{option.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {isOpen ? (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">Sistema Online</p>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto">
            <User className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
    </div>
  );
}

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            >
              {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600 bg-green-100 px-3 py-1 rounded-full border border-green-200">
                🚀 Sistema Funcionando!
              </div>
              <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="container mx-auto p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/leads-complete" element={<LeadsComplete />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/clients-complete" element={<ClientsComplete />} />
              <Route path="/contracts" element={<Contracts />} />
              <Route path="/contracts-complete" element={<ContractsComplete />} />
              <Route path="/contacts" element={<Contacts />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
} 