import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Task {
  id: string;
  title: string;
  subject: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  completed: boolean;
  createdAt: string;
}

export interface StudySession {
  id: string;
  date: string;
  duration: number; // em minutos
  subject: string;
  type: 'focus' | 'break';
}

export interface UserStats {
  level: number;
  xp: number;
  streak: number;
  lastStudyDate: string;
  totalMinutes: number;
  totalSessions: number;
  achievements: string[];
}

interface StudyContextType {
  tasks: Task[];
  sessions: StudySession[];
  stats: UserStats;
  dailyGoal: number;
  intention: string;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addSession: (session: Omit<StudySession, 'id'>) => void;
  updateStats: (updates: Partial<UserStats>) => void;
  setDailyGoal: (goal: number) => void;
  setIntention: (intention: string) => void;
  getTodayMinutes: () => number;
  getWeeklyMinutes: () => number[];
  getSubjectDistribution: () => { subject: string; minutes: number }[];
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export function StudyProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('edufocus-v2-tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [sessions, setSessions] = useState<StudySession[]>(() => {
    const saved = localStorage.getItem('edufocus-v2-sessions');
    return saved ? JSON.parse(saved) : [];
  });

  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('edufocus-v2-stats');
    return saved
      ? JSON.parse(saved)
      : {
          level: 1,
          xp: 0,
          streak: 0,
          lastStudyDate: '',
          totalMinutes: 0,
          totalSessions: 0,
          achievements: [],
        };
  });

  const [dailyGoal, setDailyGoalState] = useState(() => {
    const saved = localStorage.getItem('edufocus-v2-daily-goal');
    return saved ? parseInt(saved) : 120; // 2 horas padrão
  });

  const [intention, setIntentionState] = useState(() => {
    const saved = localStorage.getItem('edufocus-v2-intention');
    const data = saved ? JSON.parse(saved) : { text: '', date: '' };
    const today = new Date().toISOString().split('T')[0];
    return data.date === today ? data.text : '';
  });

  useEffect(() => {
    localStorage.setItem('edufocus-v2-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('edufocus-v2-sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('edufocus-v2-stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('edufocus-v2-daily-goal', dailyGoal.toString());
  }, [dailyGoal]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, ...updates } : task)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const addSession = (session: Omit<StudySession, 'id'>) => {
    const newSession: StudySession = {
      ...session,
      id: Date.now().toString(),
    };
    setSessions([...sessions, newSession]);

    // Atualizar estatísticas
    if (session.type === 'focus') {
      const today = new Date().toISOString().split('T')[0];
      const newTotalMinutes = stats.totalMinutes + session.duration;
      const newTotalSessions = stats.totalSessions + 1;
      const xpGained = 10; // 10 XP por sessão
      const newXP = stats.xp + xpGained;
      const newLevel = Math.floor(newXP / 100) + 1;

      // Calcular streak
      let newStreak = stats.streak;
      if (stats.lastStudyDate) {
        const lastDate = new Date(stats.lastStudyDate);
        const currentDate = new Date(today);
        const diffDays = Math.floor(
          (currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      // Verificar conquistas
      const newAchievements = [...stats.achievements];
      if (newStreak >= 7 && !newAchievements.includes('streak_7')) {
        newAchievements.push('streak_7');
      }
      if (newStreak >= 14 && !newAchievements.includes('streak_14')) {
        newAchievements.push('streak_14');
      }
      if (newStreak >= 30 && !newAchievements.includes('streak_30')) {
        newAchievements.push('streak_30');
      }
      if (newTotalSessions >= 50 && !newAchievements.includes('sessions_50')) {
        newAchievements.push('sessions_50');
      }
      if (newLevel >= 10 && !newAchievements.includes('level_10')) {
        newAchievements.push('level_10');
      }

      setStats({
        ...stats,
        totalMinutes: newTotalMinutes,
        totalSessions: newTotalSessions,
        xp: newXP,
        level: newLevel,
        streak: newStreak,
        lastStudyDate: today,
        achievements: newAchievements,
      });
    }
  };

  const updateStats = (updates: Partial<UserStats>) => {
    setStats({ ...stats, ...updates });
  };

  const setDailyGoal = (goal: number) => {
    setDailyGoalState(goal);
  };

  const setIntention = (newIntention: string) => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(
      'edufocus-v2-intention',
      JSON.stringify({ text: newIntention, date: today })
    );
    setIntentionState(newIntention);
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
