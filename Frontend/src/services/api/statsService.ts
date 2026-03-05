import { apiClient } from './config';
import type {
  UserStats,
  DailyStats,
  WeeklyStats,
  MonthlyStats,
  ApiResponse,
} from './types';

/**
 * Serviço de Estatísticas
 * Endpoints: /api/stats/*
 */
const statsService = {
  /**
   * GET /api/stats
   * Retorna estatísticas gerais do usuário
   */
  getStats: async (): Promise<UserStats> => {
    const response = await apiClient.get<ApiResponse<UserStats>>('/stats');
    return response.data.data;
  },

  /**
   * GET /api/stats/daily
   * Retorna estatísticas diárias
   */
  getDailyStats: async (date?: string): Promise<DailyStats> => {
    const params = date ? { date } : {};
    const response = await apiClient.get<ApiResponse<DailyStats>>(
      '/stats/daily',
      { params }
    );
    return response.data.data;
  },

  /**
   * GET /api/stats/weekly
   * Retorna estatísticas da semana
   */
  getWeeklyStats: async (weekStart?: string): Promise<WeeklyStats> => {
    const params = weekStart ? { weekStart } : {};
    const response = await apiClient.get<ApiResponse<WeeklyStats>>(
      '/stats/weekly',
      { params }
    );
    return response.data.data;
  },

  /**
   * GET /api/stats/monthly
   * Retorna estatísticas do mês
   */
  getMonthlyStats: async (month?: number, year?: number): Promise<MonthlyStats> => {
    const params: any = {};
    if (month) params.month = month;
    if (year) params.year = year;
    
    const response = await apiClient.get<ApiResponse<MonthlyStats>>(
      '/stats/monthly',
      { params }
    );
    return response.data.data;
  },

  /**
   * GET /api/stats/streak
   * Retorna informações sobre a sequência de estudos
   */
  getStreak: async (): Promise<{
    current: number;
    longest: number;
    lastStudyDate: string;
  }> => {
    const response = await apiClient.get<
      ApiResponse<{
        current: number;
        longest: number;
        lastStudyDate: string;
      }>
    >('/stats/streak');
    return response.data.data;
  },

  /**
   * GET /api/stats/subjects
   * Retorna distribuição de tempo por matéria
   */
  getSubjectDistribution: async (params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<{ subject: string; minutes: number; percentage: number }[]> => {
    const response = await apiClient.get<
      ApiResponse<{ subject: string; minutes: number; percentage: number }[]>
    >('/stats/subjects', { params });
    return response.data.data;
  },

  /**
   * PUT /api/stats/xp
   * Adiciona XP ao usuário
   */
  addXP: async (amount: number): Promise<UserStats> => {
    const response = await apiClient.put<ApiResponse<UserStats>>('/stats/xp', {
      amount,
    });
    return response.data.data;
  },

  /**
   * POST /api/stats/achievement
   * Desbloqueia uma conquista
   */
  unlockAchievement: async (achievementId: string): Promise<UserStats> => {
    const response = await apiClient.post<ApiResponse<UserStats>>(
      '/stats/achievement',
      { achievementId }
    );
    return response.data.data;
  },
};

export default statsService;
