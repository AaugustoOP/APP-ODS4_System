import { apiClient, setAuthToken, removeAuthToken } from './config';
import type {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  User,
  ApiResponse,
} from './types';

/**
 * Serviço de Autenticação
 * Endpoints: /api/auth/*
 */
const authService = {
  /**
   * POST /api/auth/register
   * Registra um novo usuário
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/register',
      data
    );
    
    // Salvar token e usuário no localStorage
    if (response.data.data.token) {
      setAuthToken(response.data.data.token);
      localStorage.setItem('edufocus-user', JSON.stringify(response.data.data.user));
    }
    
    return response.data.data;
  },

  /**
   * POST /api/auth/login
   * Faz login de um usuário existente
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      data
    );
    
    // Salvar token e usuário no localStorage
    if (response.data.data.token) {
      setAuthToken(response.data.data.token);
      localStorage.setItem('edufocus-user', JSON.stringify(response.data.data.user));
    }
    
    return response.data.data;
  },

  /**
   * POST /api/auth/logout
   * Faz logout do usuário atual
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      // Remover token e usuário do localStorage independente do resultado
      removeAuthToken();
    }
  },

  /**
   * POST /api/auth/refresh
   * Atualiza o token de autenticação
   */
  refreshToken: async (): Promise<{ token: string }> => {
    const response = await apiClient.post<ApiResponse<{ token: string }>>(
      '/auth/refresh'
    );
    
    if (response.data.data.token) {
      setAuthToken(response.data.data.token);
    }
    
    return response.data.data;
  },

  /**
   * POST /api/auth/forgot-password
   * Solicita redefinição de senha
   */
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      '/auth/forgot-password',
      { email }
    );
    
    return response.data.data;
  },

  /**
   * POST /api/auth/reset-password
   * Redefine a senha usando token
   */
  resetPassword: async (
    token: string,
    newPassword: string
  ): Promise<{ message: string }> => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      '/auth/reset-password',
      { token, newPassword }
    );
    
    return response.data.data;
  },

  /**
   * GET /api/auth/verify-email/:token
   * Verifica email do usuário
   */
  verifyEmail: async (token: string): Promise<{ message: string }> => {
    const response = await apiClient.get<ApiResponse<{ message: string }>>(
      `/auth/verify-email/${token}`
    );
    
    return response.data.data;
  },
};

export default authService;
