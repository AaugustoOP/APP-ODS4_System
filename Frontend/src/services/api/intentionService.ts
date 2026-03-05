import { apiClient } from './config';
import type { DailyIntention, CreateIntentionRequest, ApiResponse } from './types';

/**
 * Serviço de Intenções Diárias
 * Endpoints: /api/intentions/*
 */
const intentionService = {
  /**
   * GET /api/intentions/today
   * Retorna a intenção do dia atual
   */
  getTodayIntention: async (): Promise<DailyIntention | null> => {
    try {
      const response = await apiClient.get<ApiResponse<DailyIntention>>(
        '/intentions/today'
      );
      return response.data.data;
    } catch (error: any) {
      // Se não houver intenção para hoje, retornar null
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * POST /api/intentions
   * Cria uma nova intenção diária
   */
  createIntention: async (
    data: CreateIntentionRequest
  ): Promise<DailyIntention> => {
    const response = await apiClient.post<ApiResponse<DailyIntention>>(
      '/intentions',
      data
    );
    return response.data.data;
  },

  /**
   * PUT /api/intentions/today
   * Atualiza a intenção do dia atual
   */
  updateTodayIntention: async (intention: string): Promise<DailyIntention> => {
    const response = await apiClient.put<ApiResponse<DailyIntention>>(
      '/intentions/today',
      { intention }
    );
    return response.data.data;
  },

  /**
   * GET /api/intentions/history
   * Retorna histórico de intenções
   */
  getIntentionHistory: async (params?: {
    startDate?: string;
    endDate?: string;
    limit?: number;
  }): Promise<DailyIntention[]> => {
    const response = await apiClient.get<ApiResponse<DailyIntention[]>>(
      '/intentions/history',
      { params }
    );
    return response.data.data;
  },

  /**
   * GET /api/intentions/:date
   * Retorna intenção de uma data específica
   */
  getIntentionByDate: async (date: string): Promise<DailyIntention | null> => {
    try {
      const response = await apiClient.get<ApiResponse<DailyIntention>>(
        `/intentions/${date}`
      );
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },
};

export default intentionService;
