import { useState, useEffect, createContext, useContext } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on initial load
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('autocred-user');
      const storedToken = localStorage.getItem('autocred-token');
      
      if (storedUser && storedToken) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        } catch (error) {
          console.error('Erro ao carregar dados do usuário:', error);
          localStorage.removeItem('autocred-user');
          localStorage.removeItem('autocred-token');
        }
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  // Real API login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log('Tentando fazer login com:', email);
      
      // Usar FormData como esperado pelo OAuth2PasswordRequestForm
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);
      
      const response = await fetch('/api/token', {
        method: 'POST',
        body: formData,
      });

      console.log('Status da resposta:', response.status);

      if (!response.ok) {
        console.error('Erro na resposta:', response.statusText);
        setIsLoading(false);
        return false;
      }

      const data = await response.json();
      console.log('Dados recebidos:', data);

      if (data.access_token) {
        const userData: User = {
          id: '1',
          name: email.split('@')[0], // Usar parte do email como nome
          email: email,
          role: 'admin',
          avatar: "https://ui-avatars.com/api/?name=U&background=e5e7eb&color=6b7280&size=128&rounded=true&font-size=0.4"
        };

        setUser(userData);
        localStorage.setItem('autocred-user', JSON.stringify(userData));
        localStorage.setItem('autocred-token', data.access_token);
        
        console.log('Login bem-sucedido!', userData);
        setIsLoading(false);
        return true;
      } else {
        console.error('Dados de resposta inválidos:', data);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    console.log('Fazendo logout...');
    setUser(null);
    localStorage.removeItem('autocred-user');
    localStorage.removeItem('autocred-token');
    
    // Redirecionar para login após logout
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};