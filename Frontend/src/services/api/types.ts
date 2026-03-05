// ==================== TYPES & INTERFACES ====================

// Auth Types
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  avatar?: string;
}

// Task Types
export interface Task {
  id: string;
  userId: string;
  title: string;
  subject: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  subject: string;
  estimatedPomodoros: number;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  subject?: string;
  estimatedPomodoros?: number;
  completedPomodoros?: number;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

// Study Session Types
export interface StudySession {
  id: string;
  userId: string;
  taskId?: string;
  subject: string;
  duration: number; // em minutos
  type: 'focus' | 'break';
  date: string;
  startTime: string;
  endTime: string;
  createdAt: string;
}

export interface CreateSessionRequest {
  taskId?: string;
  subject: string;
  duration: number;
  type: 'focus' | 'break';
  date: string;
  startTime: string;
  endTime: string;
}

// Statistics Types
export interface UserStats {
  userId: string;
  level: number;
  xp: number;
  streak: number;
  lastStudyDate: string;
  totalMinutes: number;
  totalSessions: number;
  achievements: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DailyStats {
  date: string;
  totalMinutes: number;
  sessions: number;
  subjects: { subject: string; minutes: number }[];
}

export interface WeeklyStats {
  weekStart: string;
  weekEnd: string;
  dailyData: {
    date: string;
    minutes: number;
  }[];
  totalMinutes: number;
  totalSessions: number;
  topSubjects: { subject: string; minutes: number }[];
}

export interface MonthlyStats {
  month: string;
  year: number;
  totalMinutes: number;
  totalSessions: number;
  averageDaily: number;
  studyDays: number;
  weeklyData: number[];
  subjectDistribution: { subject: string; minutes: number; percentage: number }[];
}

// Settings Types
export interface UserSettings {
  userId: string;
  focusDuration: number; // minutos padrão para foco
  shortBreakDuration: number;
  longBreakDuration: number;
  pomodorosUntilLongBreak: number;
  dailyGoal: number; // minutos
  notifications: {
    email: boolean;
    push: boolean;
    sessionReminders: boolean;
    achievementAlerts: boolean;
  };
  theme: 'light' | 'dark' | 'auto';
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSettingsRequest {
  focusDuration?: number;
  shortBreakDuration?: number;
  longBreakDuration?: number;
  pomodorosUntilLongBreak?: number;
  dailyGoal?: number;
  notifications?: {
    email?: boolean;
    push?: boolean;
    sessionReminders?: boolean;
    achievementAlerts?: boolean;
  };
  theme?: 'light' | 'dark' | 'auto';
}

// Daily Intention Types
export interface DailyIntention {
  id: string;
  userId: string;
  date: string;
  intention: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIntentionRequest {
  intention: string;
  date: string;
}

// Report Types
export interface MonthlyReport {
  userId: string;
  month: string;
  year: number;
  totalMinutes: number;
  totalSessions: number;
  averageDaily: number;
  studyDays: number;
  currentStreak: number;
  longestStreak: number;
  topSubjects: { subject: string; minutes: number; percentage: number }[];
  weeklyBreakdown: {
    week: number;
    minutes: number;
    sessions: number;
  }[];
  achievements: {
    id: string;
    name: string;
    description: string;
    earnedAt: string;
  }[];
  productivityScore: number; // 0-100
  createdAt: string;
}

export interface AchievementProgress {
  achievementId: string;
  name: string;
  description: string;
  category: string;
  progress: number; // 0-100
  target: number;
  current: number;
  unlocked: boolean;
  unlockedAt?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  error: {
    message: string;
    code: string;
    details?: any;
  };
}
