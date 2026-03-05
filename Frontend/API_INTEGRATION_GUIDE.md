# 📡 Guia de Integração com API - EduFocus

## 🚀 Configuração Inicial

### 1. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o `.env` e configure a URL da sua API local:

```env
VITE_API_URL=http://localhost:3000/api
```

### 2. Estrutura de arquivos criada

```
src/services/api/
├── config.ts              # Configuração do axios e interceptors
├── types.ts               # Tipos TypeScript
├── authService.ts         # Serviço de autenticação
├── userService.ts         # Serviço de usuários
├── taskService.ts         # Serviço de tarefas
├── studySessionService.ts # Serviço de sessões de estudo
├── statsService.ts        # Serviço de estatísticas
├── settingsService.ts     # Serviço de configurações
├── intentionService.ts    # Serviço de intenções diárias
├── reportService.ts       # Serviço de relatórios
└── index.ts              # Exportações centralizadas
```

## 📚 Como Usar os Serviços

### Importar serviços

```typescript
import { authService, taskService, statsService } from '@/services/api';
```

### Exemplos de uso

#### Autenticação

```typescript
// Registrar novo usuário
try {
  const { user, token } = await authService.register({
    name: 'João Silva',
    email: 'joao@example.com',
    password: 'senha123'
  });
  console.log('Usuário registrado:', user);
} catch (error) {
  console.error('Erro ao registrar:', error);
}

// Fazer login
try {
  const { user, token } = await authService.login({
    email: 'joao@example.com',
    password: 'senha123'
  });
  console.log('Login bem-sucedido:', user);
} catch (error) {
  console.error('Erro ao fazer login:', error);
}

// Fazer logout
await authService.logout();
```

#### Usuário

```typescript
// Obter dados do usuário autenticado
const user = await userService.getMe();

// Atualizar perfil
const updatedUser = await userService.updateProfile({
  name: 'João Silva Junior'
});

// Atualizar senha
await userService.updatePassword('senhaAtual', 'novaSenha123');
```

#### Tarefas

```typescript
// Listar tarefas
const { data: tasks, pagination } = await taskService.getTasks({
  page: 1,
  limit: 10,
  completed: false
});

// Criar tarefa
const newTask = await taskService.createTask({
  title: 'Estudar React',
  subject: 'Programação',
  estimatedPomodoros: 4,
  priority: 'high',
  dueDate: '2026-03-10'
});

// Atualizar tarefa
const updatedTask = await taskService.updateTask('task-id', {
  completed: true
});

// Incrementar pomodoro
await taskService.incrementPomodoro('task-id');

// Deletar tarefa
await taskService.deleteTask('task-id');
```

#### Sessões de Estudo

```typescript
// Criar sessão de estudo
const session = await studySessionService.createSession({
  taskId: 'task-id',
  subject: 'Matemática',
  duration: 25,
  type: 'focus',
  date: '2026-03-05',
  startTime: '14:00:00',
  endTime: '14:25:00'
});

// Obter sessões de hoje
const todaySessions = await studySessionService.getTodaySessions();

// Obter sessões da semana
const weekSessions = await studySessionService.getWeekSessions();
```

#### Estatísticas

```typescript
// Obter estatísticas gerais
const stats = await statsService.getStats();

// Obter estatísticas mensais
const monthlyStats = await statsService.getMonthlyStats(3, 2026);

// Obter distribuição por matéria
const distribution = await statsService.getSubjectDistribution({
  startDate: '2026-03-01',
  endDate: '2026-03-31'
});

// Adicionar XP
const updatedStats = await statsService.addXP(50);
```

#### Configurações

```typescript
// Obter configurações
const settings = await settingsService.getSettings();

// Atualizar configurações
const updated = await settingsService.updateSettings({
  dailyGoal: 180,
  focusDuration: 30,
  shortBreakDuration: 5,
  longBreakDuration: 15
});

// Atualizar tema
await settingsService.updateTheme('dark');
```

#### Intenções Diárias

```typescript
// Obter intenção de hoje
const intention = await intentionService.getTodayIntention();

// Criar/atualizar intenção
const newIntention = await intentionService.createIntention({
  intention: 'Focar em matemática hoje',
  date: '2026-03-05'
});

// Histórico de intenções
const history = await intentionService.getIntentionHistory({
  limit: 30
});
```

#### Relatórios

```typescript
// Obter relatório mensal
const report = await reportService.getMonthlyReport(3, 2026);

// Obter conquistas
const achievements = await reportService.getAchievements();

// Score de produtividade
const { score, breakdown } = await reportService.getProductivityScore({
  startDate: '2026-03-01',
  endDate: '2026-03-31'
});

// Exportar relatório
const blob = await reportService.exportReport({
  format: 'pdf',
  startDate: '2026-03-01',
  endDate: '2026-03-31'
});
// Fazer download do arquivo
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'relatorio.pdf';
a.click();
```

## 🔐 Autenticação e Tokens

O sistema usa **JWT (JSON Web Tokens)** para autenticação:

1. Ao fazer login/registro, o token é salvo automaticamente no `localStorage`
2. O token é enviado automaticamente em todas as requisições via header `Authorization: Bearer {token}`
3. Se o token expirar (erro 401), o usuário é redirecionado para a página de login
4. Ao fazer logout, o token é removido

### Verificar se está autenticado

```typescript
import { isAuthenticated } from '@/services/api';

if (isAuthenticated()) {
  console.log('Usuário autenticado');
} else {
  console.log('Usuário não autenticado');
}
```

## 🔄 Integrando com React Context

### Exemplo: Atualizar AuthContext para usar a API

```typescript
// src/app/context/AuthContext.tsx
import { authService, userService, getErrorMessage } from '@/services/api';

const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const { user } = await authService.login({ email, password });
    setUser(user);
    return true;
  } catch (error) {
    console.error('Erro ao fazer login:', getErrorMessage(error));
    return false;
  }
};

const register = async (name: string, email: string, password: string): Promise<boolean> => {
  try {
    const { user } = await authService.register({ name, email, password });
    setUser(user);
    return true;
  } catch (error) {
    console.error('Erro ao registrar:', getErrorMessage(error));
    return false;
  }
};

const logout = async () => {
  try {
    await authService.logout();
  } finally {
    setUser(null);
  }
};

// Carregar usuário ao iniciar
useEffect(() => {
  const loadUser = async () => {
    try {
      const userData = await userService.getMe();
      setUser(userData);
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    }
  };

  if (isAuthenticated()) {
    loadUser();
  }
}, []);
```

### Exemplo: Atualizar StudyContext para usar a API

```typescript
// src/app/context/StudyContext.tsx
import { taskService, studySessionService, statsService } from '@/services/api';

const addTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
  try {
    const newTask = await taskService.createTask(taskData);
    setTasks([...tasks, newTask]);
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
  }
};

const addSession = async (sessionData: Omit<StudySession, 'id'>) => {
  try {
    const newSession = await studySessionService.createSession(sessionData);
    setSessions([...sessions, newSession]);
    
    // Atualizar estatísticas
    const updatedStats = await statsService.getStats();
    setStats(updatedStats);
  } catch (error) {
    console.error('Erro ao criar sessão:', error);
  }
};
```

## 🛠️ Tratamento de Erros

Use o helper `getErrorMessage` para obter mensagens amigáveis:

```typescript
import { taskService, getErrorMessage } from '@/services/api';

try {
  await taskService.createTask(data);
} catch (error) {
  const message = getErrorMessage(error);
  toast.error(message); // Usando sonner toast
}
```

## 📋 Lista Completa de Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/forgot-password` - Recuperar senha
- `POST /api/auth/reset-password` - Resetar senha
- `GET /api/auth/verify-email/:token` - Verificar email

### Usuários
- `GET /api/users/me` - Dados do usuário
- `PUT /api/users/me` - Atualizar perfil
- `DELETE /api/users/me` - Deletar conta
- `PUT /api/users/me/password` - Atualizar senha
- `POST /api/users/me/avatar` - Upload avatar

### Tarefas
- `GET /api/tasks` - Listar tarefas
- `GET /api/tasks/:id` - Obter tarefa
- `POST /api/tasks` - Criar tarefa
- `PUT /api/tasks/:id` - Atualizar tarefa
- `DELETE /api/tasks/:id` - Deletar tarefa
- `PATCH /api/tasks/:id/complete` - Completar tarefa
- `PATCH /api/tasks/:id/pomodoro` - Incrementar pomodoro
- `GET /api/tasks/active` - Tarefas ativas
- `GET /api/tasks/by-subject/:subject` - Por matéria

### Sessões de Estudo
- `GET /api/sessions` - Listar sessões
- `GET /api/sessions/:id` - Obter sessão
- `POST /api/sessions` - Criar sessão
- `DELETE /api/sessions/:id` - Deletar sessão
- `GET /api/sessions/today` - Sessões de hoje
- `GET /api/sessions/week` - Sessões da semana
- `GET /api/sessions/month` - Sessões do mês
- `GET /api/sessions/by-task/:taskId` - Por tarefa

### Estatísticas
- `GET /api/stats` - Estatísticas gerais
- `GET /api/stats/daily` - Diárias
- `GET /api/stats/weekly` - Semanais
- `GET /api/stats/monthly` - Mensais
- `GET /api/stats/streak` - Streak
- `GET /api/stats/subjects` - Por matéria
- `PUT /api/stats/xp` - Adicionar XP
- `POST /api/stats/achievement` - Desbloquear conquista

### Configurações
- `GET /api/settings` - Obter configurações
- `PUT /api/settings` - Atualizar configurações
- `POST /api/settings/reset` - Resetar
- `PUT /api/settings/notifications` - Notificações
- `PUT /api/settings/theme` - Tema

### Intenções Diárias
- `GET /api/intentions/today` - Intenção de hoje
- `POST /api/intentions` - Criar intenção
- `PUT /api/intentions/today` - Atualizar hoje
- `GET /api/intentions/history` - Histórico
- `GET /api/intentions/:date` - Por data

### Relatórios
- `GET /api/reports/monthly` - Relatório mensal
- `GET /api/reports/achievements` - Conquistas
- `GET /api/reports/productivity` - Produtividade
- `GET /api/reports/export` - Exportar
- `GET /api/reports/summary` - Resumo

## 🎯 Próximos Passos

1. **Configure seu backend** com os endpoints acima
2. **Crie o arquivo `.env`** com a URL da sua API
3. **Teste os endpoints** um por um
4. **Integre com os Contexts** substituindo localStorage por API calls
5. **Adicione loading states** e tratamento de erros nas páginas
6. **Implemente toast notifications** para feedback ao usuário

## 💡 Dicas

- Use `async/await` com try/catch para melhor controle de erros
- Implemente loading states enquanto aguarda as respostas da API
- Use o componente `Sonner` do shadcn/ui para notificações
- Mantenha os tipos TypeScript atualizados em `types.ts`
- Teste com dados mock primeiro antes de conectar ao backend real

---

**Desenvolvido para EduFocus - Plataforma EdTech alinhada à ODS 4 da ONU** 🎓
