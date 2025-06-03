import { Link, useLocation } from 'react-router-dom';
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
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { useDarkMode } from '@/hooks/useDarkMode';

const navigation = [
  { name: 'Leads', href: '/leads', icon: FileText },
  { name: 'Comissões', href: '/commissions', icon: DollarSign },
  { name: 'Contratos', href: '/contracts', icon: FileSignature },
  { name: 'Contatos', href: '/contacts', icon: Contact },
  { name: 'Clientes', href: '/clients', icon: Users },
  { name: 'Configurações', href: '/settings', icon: Settings },
];

// AI Chat Options - Conversar com IA
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

// WhatsApp Assistants Options - Nova seção
const whatsappAssistantsOptions = [
  { 
    name: 'Agentes IA', 
    href: '/agents-whatsapp', 
    icon: Bot,
    description: 'Gerencie agentes IA vendedores com Evolution API'
  },
  { 
    name: 'Conversas', 
    href: '/whatsapp-assistants/conversations', 
    icon: MessageCircle,
    description: 'Controle todas as conversas dos agentes IA'
  },
  { 
    name: 'Monitoramento', 
    href: '/whatsapp-assistants/monitoring', 
    icon: Activity,
    description: 'Acompanhe performance e métricas'
  },
];

// Prospecting Options
const prospectingOptions = [
  { 
    name: 'Ura Reversa', 
    href: '/prospecting/ura-reversa', 
    icon: Phone,
    description: 'Sistema de discagem automática'
  },
  { 
    name: 'SMS', 
    href: '/prospecting/sms', 
    icon: MessageSquare,
    description: 'Campanhas de SMS marketing'
  },
  { 
    name: 'WhatsApp', 
    href: '/prospecting/whatsapp', 
    icon: MessageCircle,
    description: 'Marketing via WhatsApp Business'
  },
];

const menuItems = [
  { name: 'Dashboard', path: '/', icon: Home },
  { name: 'Leads', path: '/leads', icon: Target },
  { name: 'Clientes', path: '/clients', icon: Users },
  { name: 'Contratos', path: '/contracts', icon: FileText },
  { name: 'Contatos', path: '/contacts', icon: Phone },
  { 
    name: 'Agentes IA', 
    icon: Bot,
    submenu: [
      { name: 'Criar Agente', path: '/agents-whatsapp', icon: Bot }
    ]
  },
];

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAiChatExpanded, setIsAiChatExpanded] = useState(false); // Inicia fechada
  const [isWhatsappAssistantsExpanded, setIsWhatsappAssistantsExpanded] = useState(false); // Nova seção
  const [isProspectingExpanded, setIsProspectingExpanded] = useState(false); // Inicia fechada
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useDarkMode();
  const location = useLocation();

  const isAiChatActive = location.pathname.startsWith('/ai-chat');
  const isWhatsappAssistantsActive = location.pathname.startsWith('/whatsapp-assistants'); // Nova verificação
  const isProspectingActive = location.pathname.startsWith('/prospecting');

  // Fechar automaticamente as seções quando navegar para outras páginas
  useEffect(() => {
    // Lógica mais simples e robusta
    setIsAiChatExpanded(isAiChatActive);
    setIsWhatsappAssistantsExpanded(isWhatsappAssistantsActive);
    setIsProspectingExpanded(isProspectingActive);
  }, [location.pathname]); // Mudança: usar location.pathname como dependência

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-background border shadow-md"
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside 
        className={`flex flex-col bg-background border-r transition-all duration-300 ease-in-out h-screen relative z-40 ${
          isCollapsed ? 'w-[4.5rem]' : 'w-52'
        } ${isMobileOpen ? 'fixed left-0 top-0' : 'hidden'} md:block`}
      >
        <div className="flex h-16 items-center justify-center border-b gap-3 bg-gradient-to-r from-background to-muted/20">
          <div className="flex items-center gap-2 group">
            <svg 
              width="32" 
              height="32" 
              viewBox="0 0 100 100" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="group-hover:scale-110 transition-transform duration-200"
            >
              {/* Fundo arredondado */}
              <rect x="10" y="10" width="80" height="80" rx="20" ry="20" fill="#22C55E" stroke="#22C55E" strokeWidth="2"/>
              
              {/* Check mark / seta */}
              <path 
                d="M30 50 L42 62 L70 34" 
                stroke="white" 
                strokeWidth="6" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                fill="none"
              />
            </svg>
            {!isCollapsed && (
              <span className="font-bold text-2xl text-foreground">
                AutoCred
              </span>
            )}
          </div>
        </div>
        
        <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
          {/* 1. Dashboard primeiro */}
          <Link
            to="/dashboard"
            onClick={() => setIsMobileOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
              location.pathname === '/dashboard'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-white hover:bg-blue-600'
            } ${isCollapsed ? 'justify-center' : 'justify-start'}`}
          >
            <LayoutDashboard className="h-5 w-5 flex-shrink-0" />
            <span className={`transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
              Dashboard
            </span>
          </Link>

          {/* 2. SEÇÃO CONVERSAR COM IA */}
          <div className="pt-1">
            <div 
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                isAiChatActive
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600'
              } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
              onClick={() => {
                if (!isCollapsed && !isAiChatActive) {
                  setIsAiChatExpanded(!isAiChatExpanded);
                }
              }}
            >
              <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                <Bot className="h-5 w-5 flex-shrink-0" />
                <span className={`transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                  Chat IA
                </span>
              </div>
              {!isCollapsed && (
                <div className="transition-transform duration-200">
                  {isAiChatExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              )}
            </div>

            {/* Sub-abas do AI Chat */}
            {!isCollapsed && isAiChatExpanded && (
              <div className="ml-4 mt-1 space-y-1 border-l-2 border-purple-200 dark:border-purple-800 pl-2">
                {aiChatOptions.map((option) => {
                  const Icon = option.icon;
                  const isActive = location.pathname === option.href;
                  
                  return (
                    <Link
                      key={option.name}
                      to={option.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors duration-200 group ${
                        isActive
                          ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 shadow-sm'
                          : 'text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/50'
                      }`}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="font-medium truncate">{option.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. NOVA SEÇÃO ASSISTENTES WHATSAPP */}
          <div className="pt-1">
            <div 
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                isWhatsappAssistantsActive
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-white hover:bg-gradient-to-r hover:from-green-600 hover:to-emerald-600'
              } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
              onClick={() => {
                if (!isCollapsed && !isWhatsappAssistantsActive) {
                  setIsWhatsappAssistantsExpanded(!isWhatsappAssistantsExpanded);
                }
              }}
            >
              <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                <Headphones className="h-5 w-5 flex-shrink-0" />
                <span className={`transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                  Atendentes
                </span>
              </div>
              {!isCollapsed && (
                <div className="transition-transform duration-200">
                  {isWhatsappAssistantsExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              )}
            </div>

            {/* Sub-abas dos Assistentes WhatsApp */}
            {!isCollapsed && isWhatsappAssistantsExpanded && (
              <div className="ml-4 mt-1 space-y-1 border-l-2 border-green-200 dark:border-green-800 pl-2">
                {whatsappAssistantsOptions.map((option) => {
                  const Icon = option.icon;
                  const isActive = location.pathname === option.href;
                  
                  return (
                    <Link
                      key={option.name}
                      to={option.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors duration-200 group ${
                        isActive
                          ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 shadow-sm'
                          : 'text-muted-foreground hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/50'
                      }`}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="font-medium truncate">{option.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* 4. SEÇÃO PROSPECÇÃO */}
          <div className="pt-1">
            <div 
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                isProspectingActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-white hover:bg-blue-600'
              } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
              onClick={() => {
                if (!isCollapsed && !isProspectingActive) {
                  setIsProspectingExpanded(!isProspectingExpanded);
                }
              }}
            >
              <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                <Target className="h-5 w-5 flex-shrink-0" />
                <span className={`transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                  Prospecção
                </span>
              </div>
              {!isCollapsed && (
                <div className="transition-transform duration-200">
                  {isProspectingExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              )}
            </div>

            {/* Sub-abas da Prospecção */}
            {!isCollapsed && isProspectingExpanded && (
              <div className="ml-4 mt-1 space-y-1 border-l-2 border-blue-200 dark:border-blue-800 pl-2">
                {prospectingOptions.map((option) => {
                  const Icon = option.icon;
                  const isActive = location.pathname === option.href;
                  
                  return (
                    <Link
                      key={option.name}
                      to={option.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors duration-200 group ${
                        isActive
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shadow-sm'
                          : 'text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50'
                      }`}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="font-medium truncate">{option.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* 5. Resto da navegação */}
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-white hover:bg-blue-600'
                } ${isCollapsed ? 'justify-center' : 'justify-start'}`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className={`transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User Actions Section */}
        <div className={`flex flex-col gap-2 p-4 border-t ${isCollapsed ? 'items-center' : ''}`}>
          {/* Theme Toggle and Notifications */}
          <div className={`flex gap-2 ${isCollapsed ? 'flex-col items-center' : 'justify-between'}`}>
            <Button
              variant="ghost" 
              size="icon"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-white hover:bg-blue-600 transition-colors"
              title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-white hover:bg-blue-600 transition-colors"
              title="Notificações"
            >
              <Bell className="h-5 w-5" />
            </Button>
          </div>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className={`relative rounded-lg p-2 hover:bg-blue-600 hover:text-white transition-colors ${isCollapsed ? 'h-8 w-8' : 'w-full justify-start'}`}
              >
                <div className={`flex items-center gap-2 ${isCollapsed ? '' : 'w-full'}`}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">{user?.name || 'Usuário'}</span>
                      <span className="text-xs text-muted-foreground">{user?.email}</span>
                    </div>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align={isCollapsed ? 'center' : 'end'} forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || 'Usuário'}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border bg-background shadow-md hover:bg-blue-600 hover:text-white transition-all duration-300 hover:scale-110 hidden md:flex"
          title={isCollapsed ? "Expandir menu" : "Recolher menu"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </aside>
    </>
  );
}