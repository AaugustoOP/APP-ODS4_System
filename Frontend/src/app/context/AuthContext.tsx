import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('edufocus-user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('edufocus-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('edufocus-user');
    }
  }, [user]);

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Verificar se já existe um usuário com este email
      const users = JSON.parse(localStorage.getItem('edufocus-users') || '[]');
      const existingUser = users.find((u: any) => u.email === email);

      if (existingUser) {
        return false; // Email já cadastrado
      }

      // Criar novo usuário
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        createdAt: new Date().toISOString(),
      };

      // Salvar senha separadamente (em produção real, seria hash no backend)
      const userWithPassword = {
        ...newUser,
        password, // Em produção, isso seria um hash
      };

      users.push(userWithPassword);
      localStorage.setItem('edufocus-users', JSON.stringify(users));

      // Fazer login automaticamente
      setUser(newUser);
      return true;
    } catch (error) {
      console.error('Erro ao registrar:', error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('edufocus-users') || '[]');
      const foundUser = users.find(
        (u: any) => u.email === email && u.password === password
      );

      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
