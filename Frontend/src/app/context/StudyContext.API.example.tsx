/**
 * EXEMPLO DE INTEGRAÇÃO DO StudyContext COM A API
 * 
 * Este arquivo mostra como modificar o StudyContext.tsx para usar a API real
 * ao invés do localStorage.
 * 
 * Para usar:
 * 1. Substitua o conteúdo de StudyContext.tsx por este arquivo
 * 2. Renomeie este arquivo ou delete após a migração
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  taskService,
  studySessionService,
  statsService,
  intentionService,
  settingsService,
  getErrorMessage,
  type Task,
  type StudySession,
  type UserStats,
  type CreateTaskRequest,
  type CreateSessionRequest,
} from '../../services/api';

interface StudyContextType {
  tasks: Task[];
  sessions: StudySession[];
  stats: UserStats | null;
  dailyGoal: number;
  intention: string;
  loading: boolean;
  addTask: (task: Omit<CreateTaskRequest, 'userId'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addSession: (session: Omit<CreateSessionRequest, 'userId'>) => Promise<void>;
  updateStats: (updates: Partial<UserStats>) => void;
  setDailyGoal: (goal: number) => Promise<void>;
  setIntention: (intention: string) => Promise<void>;
  getTodayMinutes: () => number;
  getWeeklyMinutes: () => number[];
  getSubjectDistribution: () => { subject: string; minutes: number }[];
  refreshData: () => Promise<void>;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export function StudyProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [dailyGoal, setDailyGoalState] = useState(120);
  const [intention, setIntentionState] = useState('');
  const [loading, setLoading] = useState(true);

  // Carregar dados iniciais
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      // Carregar dados em paralelo
      const [tasksData, sessionsData, statsData, settingsData, intentionData] =
        await Promise.all([
          taskService.getTasks({ limit: 100 }),
          studySessionService.getMonthSessions(),
          statsService.getStats(),
          settingsService.getSettings(),
          intentionService.getTodayIntention(),
        ]);

      setTasks(tasksData.data);
      setSessions(sessionsData);
      setStats(statsData);
      setDailyGoalState(settingsData.dailyGoal);
      setIntentionState(intentionData?.intention || '');
    } catch (error) {
      console.error('Erro ao carregar dados:', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await loadInitialData();
  };

  const addTask = async (taskData: Omit<CreateTaskRequest, 'userId'>) => {
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks([...tasks, newTask]);
    } catch (error) {
      console.error('Erro ao criar tarefa:', getErrorMessage(error));
      throw error;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const updatedTask = await taskService.updateTask(id, updates);
      setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', getErrorMessage(error));
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Erro ao deletar tarefa:', getErrorMessage(error));
      throw error;
    }
  };

  const addSession = async (
    sessionData: Omit<CreateSessionRequest, 'userId'>
  ) => {
    try {
      const newSession = await studySessionService.createSession(sessionData);
      setSessions([...sessions, newSession]);

      // Atualizar estatísticas após criar sessão
      if (sessionData.type === 'focus') {
        const updatedStats = await statsService.getStats();
        setStats(updatedStats);
      }
    } catch (error) {
      console.error('Erro ao criar sessão:', getErrorMessage(error));
      throw error;
    }
  };

  const updateStats = (updates: Partial<UserStats>) => {
    if (stats) {
      setStats({ ...stats, ...updates });
    }
  };

  const setDailyGoal = async (goal: number) => {
    try {
      await settingsService.updateSettings({ dailyGoal: goal });
      setDailyGoalState(goal);
    } catch (error) {
      console.error('Erro ao atualizar meta diária:', getErrorMessage(error));
      throw error;
    }
  };

  const setIntention = async (newIntention: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await intentionService.createIntention({
        intention: newIntention,
        date: today,
      });
      setIntentionState(newIntention);
    } catch (error) {
      console.error('Erro ao definir intenção:', getErrorMessage(error));
      throw error;
    }
  };

  const getTodayMinutes = () => {
    const today = new Date().toISOString().split('T')[0];
    return sessions
      .filter((s) => s.date === today && s.type === 'focus')
      .reduce((sum, s) => sum + s.duration, 0);
  };

  const getWeeklyMinutes = () => {
    const result: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const minutes = sessions
        .filter((s) => s.date === dateStr && s.type === 'focus')
        .reduce((sum, s) => sum + s.duration, 0);
      result.push(minutes);
    }
    return result;
  };

  const getSubjectDistribution = () => {
    const distribution: { [key: string]: number } = {};
    sessions
      .filter((s) => s.type === 'focus')
      .forEach((s) => {
        distribution[s.subject] = (distribution[s.subject] || 0) + s.duration;
      });

    return Object.entries(distribution).map(([subject, minutes]) => ({
      subject,
      minutes,
    }));
  };

  return (
    <StudyContext.Provider
      value={{
        tasks,
        sessions,
        stats,
        dailyGoal,
        intention,
        loading,
        addTask,
        updateTask,
        deleteTask,
        addSession,
        updateStats,
        setDailyGoal,
        setIntention,
        getTodayMinutes,
        getWeeklyMinutes,
        getSubjectDistribution,
        refreshData,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy must be used within StudyProvider');
  }
  return context;
}
