/**
 * EXEMPLO DE INTEGRAÇÃO DO AuthContext COM A API
 * 
 * Este arquivo mostra como modificar o AuthContext.tsx para usar a API real
 * ao invés do localStorage.
 * 
 * Para usar:
 * 1. Substitua o conteúdo de AuthContext.tsx por este arquivo
 * 2. Renomeie este arquivo ou delete após a migração
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  authService,
  userService,
  getErrorMessage,
  isAuthenticated as checkAuth,
  type User,
} from '../../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar usuário ao iniciar a aplicação
  useEffect(() => {
    const loadUser = async () => {
      // Se não houver token, não precisa carregar
      if (!checkAuth()) {
        setLoading(false);
        return;
      }

      try {
        const userData = await userService.getMe();
        setUser(userData);
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        // Se falhar ao carregar, limpar token inválido
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { user: newUser } = await authService.register({
        name,
        email,
        password,
      });

      setUser(newUser);
      return true;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      console.error('Erro ao registrar:', message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { user: loggedUser } = await authService.login({
        email,
        password,
      });

      setUser(loggedUser);
      return true;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      console.error('Erro ao fazer login:', message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);

    try {
      await authService.logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        loading,
        error,
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
