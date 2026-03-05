import { apiClient } from './config';
import type { MonthlyReport, AchievementProgress, ApiResponse } from './types';

/**
 * Serviço de Relatórios
 * Endpoints: /api/reports/*
 */
const reportService = {
  /**
   * GET /api/reports/monthly
   * Retorna relatório mensal completo
   */
  getMonthlyReport: async (month?: number, year?: number): Promise<MonthlyReport> => {
    const params: any = {};
    if (month) params.month = month;
    if (year) params.year = year;

    const response = await apiClient.get<ApiResponse<MonthlyReport>>(
      '/reports/monthly',
      { params }
    );
    return response.data.data;
  },

  /**
   * GET /api/reports/achievements
   * Retorna progresso de todas as conquistas
   */
  getAchievements: async (): Promise<AchievementProgress[]> => {
    const response = await apiClient.get<ApiResponse<AchievementProgress[]>>(
      '/reports/achievements'
    );
    return response.data.data;
  },

  /**
   * GET /api/reports/productivity
   * Retorna score de produtividade
   */
  getProductivityScore: async (params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<{
    score: number;
    breakdown: {
      consistency: number;
      volume: number;
      efficiency: number;
      balance: number;
    };
  }> => {
    const response = await apiClient.get<
      ApiResponse<{
        score: number;
        breakdown: {
          consistency: number;
          volume: number;
          efficiency: number;
          balance: number;
        };
      }>
    >('/reports/productivity', { params });
    return response.data.data;
  },

  /**
   * GET /api/reports/export
   * Exporta relatório em formato específico (PDF, CSV, etc)
   */
  exportReport: async (params: {
    format: 'pdf' | 'csv' | 'json';
    startDate: string;
    endDate: string;
  }): Promise<Blob> => {
    const response = await apiClient.get('/reports/export', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * GET /api/reports/summary
   * Retorna resumo geral de estatísticas
   */
  getSummary: async (): Promise<{
    totalStudyTime: number;
    totalSessions: number;
    currentLevel: number;
    currentStreak: number;
    achievementsUnlocked: number;
    favoriteSubject: string;
    averageDailyMinutes: number;
  }> => {
    const response = await apiClient.get<
      ApiResponse<{
        totalStudyTime: number;
        totalSessions: number;
        currentLevel: number;
        currentStreak: number;
        achievementsUnlocked: number;
        favoriteSubject: string;
        averageDailyMinutes: number;
      }>
    >('/reports/summary');
    return response.data.data;
  },
};

export default reportService;
