import { apiClient } from './config';
import type {
  StudySession,
  CreateSessionRequest,
  ApiResponse,
  PaginatedResponse,
} from './types';

/**
 * Serviço de Sessões de Estudo
 * Endpoints: /api/sessions/*
 */
const studySessionService = {
  /**
   * GET /api/sessions
   * Lista todas as sessões do usuário com paginação
   */
  getSessions: async (params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    subject?: string;
    type?: 'focus' | 'break';
  }): Promise<PaginatedResponse<StudySession>> => {
    const response = await apiClient.get<PaginatedResponse<StudySession>>(
      '/sessions',
      { params }
    );
    
    return response.data;
  },

  /**
   * GET /api/sessions/:id
   * Retorna uma sessão específica
   */
  getSessionById: async (id: string): Promise<StudySession> => {
    const response = await apiClient.get<ApiResponse<StudySession>>(
      `/sessions/${id}`
    );
    return response.data.data;
  },

  /**
   * POST /api/sessions
   * Cria uma nova sessão de estudo
   */
  createSession: async (data: CreateSessionRequest): Promise<StudySession> => {
    const response = await apiClient.post<ApiResponse<StudySession>>(
      '/sessions',
      data
    );
    return response.data.data;
  },

  /**
   * DELETE /api/sessions/:id
   * Deleta uma sessão
   */
  deleteSession: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(
      `/sessions/${id}`
    );
    return response.data.data;
  },

  /**
   * GET /api/sessions/today
   * Retorna sessões do dia atual
   */
  getTodaySessions: async (): Promise<StudySession[]> => {
    const response = await apiClient.get<ApiResponse<StudySession[]>>(
      '/sessions/today'
    );
    return response.data.data;
  },

  /**
   * GET /api/sessions/week
   * Retorna sessões da semana atual
   */
  getWeekSessions: async (): Promise<StudySession[]> => {
    const response = await apiClient.get<ApiResponse<StudySession[]>>(
      '/sessions/week'
    );
    return response.data.data;
  },

  /**
   * GET /api/sessions/month
   * Retorna sessões do mês atual
   */
  getMonthSessions: async (): Promise<StudySession[]> => {
    const response = await apiClient.get<ApiResponse<StudySession[]>>(
      '/sessions/month'
    );
    return response.data.data;
  },

  /**
   * GET /api/sessions/by-task/:taskId
   * Retorna sessões associadas a uma tarefa específica
   */
  getSessionsByTask: async (taskId: string): Promise<StudySession[]> => {
    const response = await apiClient.get<ApiResponse<StudySession[]>>(
      `/sessions/by-task/${taskId}`
    );
    return response.data.data;
  },
};

export default studySessionService;
