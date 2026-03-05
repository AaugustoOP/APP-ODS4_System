import { apiClient } from './config';
import type { UserSettings, UpdateSettingsRequest, ApiResponse } from './types';

/**
 * Serviço de Configurações
 * Endpoints: /api/settings/*
 */
const settingsService = {
  /**
   * GET /api/settings
   * Retorna configurações do usuário
   */
  getSettings: async (): Promise<UserSettings> => {
    const response = await apiClient.get<ApiResponse<UserSettings>>('/settings');
    return response.data.data;
  },

  /**
   * PUT /api/settings
   * Atualiza configurações do usuário
   */
  updateSettings: async (data: UpdateSettingsRequest): Promise<UserSettings> => {
    const response = await apiClient.put<ApiResponse<UserSettings>>(
      '/settings',
      data
    );
    return response.data.data;
  },

  /**
   * POST /api/settings/reset
   * Restaura configurações padrão
   */
  resetSettings: async (): Promise<UserSettings> => {
    const response = await apiClient.post<ApiResponse<UserSettings>>(
      '/settings/reset'
    );
    return response.data.data;
  },

  /**
   * PUT /api/settings/notifications
   * Atualiza preferências de notificações
   */
  updateNotifications: async (notifications: {
    email?: boolean;
    push?: boolean;
    sessionReminders?: boolean;
    achievementAlerts?: boolean;
  }): Promise<UserSettings> => {
    const response = await apiClient.put<ApiResponse<UserSettings>>(
      '/settings/notifications',
      { notifications }
    );
    return response.data.data;
  },

  /**
   * PUT /api/settings/theme
   * Atualiza tema da aplicação
   */
  updateTheme: async (theme: 'light' | 'dark' | 'auto'): Promise<UserSettings> => {
    const response = await apiClient.put<ApiResponse<UserSettings>>(
      '/settings/theme',
      { theme }
    );
    return response.data.data;
  },
};

export default settingsService;
