import { apiClient } from './config';
import type {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  ApiResponse,
  PaginatedResponse,
} from './types';

/**
 * Serviço de Tarefas
 * Endpoints: /api/tasks/*
 */
const taskService = {
  /**
   * GET /api/tasks
   * Lista todas as tarefas do usuário com paginação
   */
  getTasks: async (params?: {
    page?: number;
    limit?: number;
    completed?: boolean;
    subject?: string;
  }): Promise<PaginatedResponse<Task>> => {
    const response = await apiClient.get<PaginatedResponse<Task>>('/tasks', {
      params,
    });
    
    return response.data;
  },

  /**
   * GET /api/tasks/:id
   * Retorna uma tarefa específica
   */
  getTaskById: async (id: string): Promise<Task> => {
    const response = await apiClient.get<ApiResponse<Task>>(`/tasks/${id}`);
    return response.data.data;
  },

  /**
   * POST /api/tasks
   * Cria uma nova tarefa
   */
  createTask: async (data: CreateTaskRequest): Promise<Task> => {
    const response = await apiClient.post<ApiResponse<Task>>('/tasks', data);
    return response.data.data;
  },

  /**
   * PUT /api/tasks/:id
   * Atualiza uma tarefa existente
   */
  updateTask: async (id: string, data: UpdateTaskRequest): Promise<Task> => {
    const response = await apiClient.put<ApiResponse<Task>>(
      `/tasks/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * DELETE /api/tasks/:id
   * Deleta uma tarefa
   */
  deleteTask: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(
      `/tasks/${id}`
    );
    return response.data.data;
  },

  /**
   * PATCH /api/tasks/:id/complete
   * Marca uma tarefa como completa
   */
  completeTask: async (id: string): Promise<Task> => {
    const response = await apiClient.patch<ApiResponse<Task>>(
      `/tasks/${id}/complete`
    );
    return response.data.data;
  },

  /**
   * PATCH /api/tasks/:id/pomodoro
   * Incrementa o contador de pomodoros completados
   */
  incrementPomodoro: async (id: string): Promise<Task> => {
    const response = await apiClient.patch<ApiResponse<Task>>(
      `/tasks/${id}/pomodoro`
    );
    return response.data.data;
  },

  /**
   * GET /api/tasks/active
   * Retorna apenas tarefas ativas (não completadas)
   */
  getActiveTasks: async (): Promise<Task[]> => {
    const response = await apiClient.get<ApiResponse<Task[]>>('/tasks/active');
    return response.data.data;
  },

  /**
   * GET /api/tasks/by-subject/:subject
   * Retorna tarefas filtradas por matéria
   */
  getTasksBySubject: async (subject: string): Promise<Task[]> => {
    const response = await apiClient.get<ApiResponse<Task[]>>(
      `/tasks/by-subject/${encodeURIComponent(subject)}`
    );
    return response.data.data;
  },
};

export default taskService;
