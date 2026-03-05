import { apiClient } from './config';
import type { User, UpdateProfileRequest, ApiResponse } from './types';

/**
 * Serviço de Usuários
 * Endpoints: /api/users/*
 */
const userService = {
  /**
   * GET /api/users/me
   * Retorna dados do usuário autenticado
   */
  getMe: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/users/me');
    
    // Atualizar usuário no localStorage
    localStorage.setItem('edufocus-user', JSON.stringify(response.data.data));
    
    return response.data.data;
  },

  /**
   * PUT /api/users/me
   * Atualiza perfil do usuário autenticado
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>('/users/me', data);
    
    // Atualizar usuário no localStorage
    localStorage.setItem('edufocus-user', JSON.stringify(response.data.data));
    
    return response.data.data;
  },

  /**
   * DELETE /api/users/me
   * Deleta conta do usuário autenticado
   */
  deleteAccount: async (): Promise<{ message: string }> => {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(
      '/users/me'
    );
    
    // Limpar localStorage
    localStorage.removeItem('edufocus-token');
    localStorage.removeItem('edufocus-user');
    
    return response.data.data;
  },

  /**
   * PUT /api/users/me/password
   * Atualiza senha do usuário
   */
  updatePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> => {
    const response = await apiClient.put<ApiResponse<{ message: string }>>(
      '/users/me/password',
      { currentPassword, newPassword }
    );
    
    return response.data.data;
  },

  /**
   * POST /api/users/me/avatar
   * Faz upload de avatar do usuário
   */
  uploadAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiClient.post<ApiResponse<{ avatarUrl: string }>>(
      '/users/me/avatar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.data;
  },
};

export default userService;
