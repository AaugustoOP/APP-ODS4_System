import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Configuração base da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Criar instância do axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisições
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('edufocus-token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Tratar erros de autenticação (401)
    if (error.response?.status === 401) {
      // Remover token inválido
      localStorage.removeItem('edufocus-token');
      localStorage.removeItem('edufocus-user');
      
      // Redirecionar para login (apenas se não estiver já na página de login)
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // Tratar erros de servidor (500+)
    if (error.response?.status && error.response.status >= 500) {
      console.error('Erro no servidor:', error.response.data);
    }

    // Tratar erros de rede
    if (!error.response) {
      console.error('Erro de rede:', error.message);
    }

    return Promise.reject(error);
  }
);

export { apiClient, API_BASE_URL };

// Helper para extrair mensagem de erro
export const getErrorMessage = (error: any): string => {
  if (error.response?.data?.error?.message) {
    return error.response.data.error.message;
  }
  
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'Ocorreu um erro inesperado';
};

// Helper para salvar token
export const setAuthToken = (token: string): void => {
  localStorage.setItem('edufocus-token', token);
};

// Helper para remover token
export const removeAuthToken = (): void => {
  localStorage.removeItem('edufocus-token');
  localStorage.removeItem('edufocus-user');
};

// Helper para verificar se está autenticado
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('edufocus-token');
};
