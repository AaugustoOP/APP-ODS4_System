/**
 * API Services - EduFocus
 * 
 * Camada de serviços para comunicação com a API backend
 * Todos os serviços usam axios e retornam Promises tipadas
 * 
 * Uso:
 * import { authService, taskService } from '@/services/api';
 * 
 * const user = await authService.login({ email, password });
 * const tasks = await taskService.getTasks();
 */

// Exportar configuração
export { apiClient, API_BASE_URL, getErrorMessage, setAuthToken, removeAuthToken, isAuthenticated } from './config';

// Exportar todos os tipos
export * from './types';

// Exportar serviços
export { default as authService } from './authService';
export { default as userService } from './userService';
export { default as taskService } from './taskService';
export { default as studySessionService } from './studySessionService';
export { default as statsService } from './statsService';
export { default as settingsService } from './settingsService';
export { default as intentionService } from './intentionService';
export { default as reportService } from './reportService';

/**
 * Lista completa de endpoints disponíveis:
 * 
 * AUTENTICAÇÃO (/api/auth/*)
 * - POST   /api/auth/register          - Registrar novo usuário
 * - POST   /api/auth/login             - Fazer login
 * - POST   /api/auth/logout            - Fazer logout
 * - POST   /api/auth/refresh           - Atualizar token
 * - POST   /api/auth/forgot-password   - Solicitar redefinição de senha
 * - POST   /api/auth/reset-password    - Redefinir senha
 * - GET    /api/auth/verify-email/:token - Verificar email
 * 
 * USUÁRIOS (/api/users/*)
 * - GET    /api/users/me               - Obter dados do usuário
 * - PUT    /api/users/me               - Atualizar perfil
 * - DELETE /api/users/me               - Deletar conta
 * - PUT    /api/users/me/password      - Atualizar senha
 * - POST   /api/users/me/avatar        - Upload de avatar
 * 
 * TAREFAS (/api/tasks/*)
 * - GET    /api/tasks                  - Listar tarefas
 * - GET    /api/tasks/:id              - Obter tarefa
 * - POST   /api/tasks                  - Criar tarefa
 * - PUT    /api/tasks/:id              - Atualizar tarefa
 * - DELETE /api/tasks/:id              - Deletar tarefa
 * - PATCH  /api/tasks/:id/complete     - Completar tarefa
 * - PATCH  /api/tasks/:id/pomodoro     - Incrementar pomodoro
 * - GET    /api/tasks/active           - Tarefas ativas
 * - GET    /api/tasks/by-subject/:subject - Tarefas por matéria
 * 
 * SESSÕES DE ESTUDO (/api/sessions/*)
 * - GET    /api/sessions               - Listar sessões
 * - GET    /api/sessions/:id           - Obter sessão
 * - POST   /api/sessions               - Criar sessão
 * - DELETE /api/sessions/:id           - Deletar sessão
 * - GET    /api/sessions/today         - Sessões de hoje
 * - GET    /api/sessions/week          - Sessões da semana
 * - GET    /api/sessions/month         - Sessões do mês
 * - GET    /api/sessions/by-task/:taskId - Sessões por tarefa
 * 
 * ESTATÍSTICAS (/api/stats/*)
 * - GET    /api/stats                  - Estatísticas gerais
 * - GET    /api/stats/daily            - Estatísticas diárias
 * - GET    /api/stats/weekly           - Estatísticas semanais
 * - GET    /api/stats/monthly          - Estatísticas mensais
 * - GET    /api/stats/streak           - Informações de streak
 * - GET    /api/stats/subjects         - Distribuição por matéria
 * - PUT    /api/stats/xp               - Adicionar XP
 * - POST   /api/stats/achievement      - Desbloquear conquista
 * 
 * CONFIGURAÇÕES (/api/settings/*)
 * - GET    /api/settings               - Obter configurações
 * - PUT    /api/settings               - Atualizar configurações
 * - POST   /api/settings/reset         - Resetar configurações
 * - PUT    /api/settings/notifications - Atualizar notificações
 * - PUT    /api/settings/theme         - Atualizar tema
 * 
 * INTENÇÕES DIÁRIAS (/api/intentions/*)
 * - GET    /api/intentions/today       - Intenção de hoje
 * - POST   /api/intentions             - Criar intenção
 * - PUT    /api/intentions/today       - Atualizar intenção de hoje
 * - GET    /api/intentions/history     - Histórico de intenções
 * - GET    /api/intentions/:date       - Intenção por data
 * 
 * RELATÓRIOS (/api/reports/*)
 * - GET    /api/reports/monthly        - Relatório mensal
 * - GET    /api/reports/achievements   - Progresso de conquistas
 * - GET    /api/reports/productivity   - Score de produtividade
 * - GET    /api/reports/export         - Exportar relatório
 * - GET    /api/reports/summary        - Resumo geral
 */
