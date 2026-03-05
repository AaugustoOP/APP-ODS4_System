/**
 * EXEMPLOS DE USO DOS SERVIÇOS DA API
 * 
 * Este arquivo contém exemplos práticos de como usar os serviços
 * da API em componentes React.
 */

import { useState } from 'react';
import {
  authService,
  taskService,
  studySessionService,
  statsService,
  getErrorMessage,
} from './src/services/api';
import { toast } from 'sonner';

// ==================== EXEMPLO 1: LOGIN ====================
function LoginExample() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { user, token } = await authService.login({ email, password });
      toast.success(`Bem-vindo, ${user.name}!`);
      // Redirecionar para dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha"
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
}

// ==================== EXEMPLO 2: CRIAR TAREFA ====================
function CreateTaskExample() {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateTask = async () => {
    if (!title || !subject) {
      toast.error('Preencha todos os campos');
      return;
    }

    setLoading(true);

    try {
      const newTask = await taskService.createTask({
        title,
        subject,
        estimatedPomodoros: 4,
        priority: 'medium',
      });

      toast.success('Tarefa criada com sucesso!');
      setTitle('');
      setSubject('');
      
      // Atualizar lista de tarefas aqui
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título da tarefa"
      />
      <input
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Matéria"
      />
      <button onClick={handleCreateTask} disabled={loading}>
        {loading ? 'Criando...' : 'Criar Tarefa'}
      </button>
    </div>
  );
}

// ==================== EXEMPLO 3: LISTAR TAREFAS ====================
function TaskListExample() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const loadTasks = async () => {
    setLoading(true);

    try {
      const response = await taskService.getTasks({
        page,
        limit: 10,
        completed: false,
      });

      setTasks(response.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await taskService.completeTask(taskId);
      toast.success('Tarefa concluída!');
      loadTasks(); // Recarregar lista
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      toast.success('Tarefa deletada!');
      loadTasks(); // Recarregar lista
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div>
      <button onClick={loadTasks}>Carregar Tarefas</button>
      
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <ul>
          {tasks.map((task: any) => (
            <li key={task.id}>
              {task.title} - {task.subject}
              <button onClick={() => handleCompleteTask(task.id)}>
                Concluir
              </button>
              <button onClick={() => handleDeleteTask(task.id)}>
                Deletar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ==================== EXEMPLO 4: SESSÃO DE ESTUDO ====================
function StudySessionExample() {
  const [subject, setSubject] = useState('Matemática');
  const [duration, setDuration] = useState(25);
  const [loading, setLoading] = useState(false);

  const startStudySession = async () => {
    setLoading(true);

    const now = new Date();
    const startTime = now.toTimeString().split(' ')[0];
    const endDate = new Date(now.getTime() + duration * 60000);
    const endTime = endDate.toTimeString().split(' ')[0];

    try {
      const session = await studySessionService.createSession({
        subject,
        duration,
        type: 'focus',
        date: now.toISOString().split('T')[0],
        startTime,
        endTime,
      });

      toast.success('Sessão de estudo registrada!');
      
      // Aqui você pode atualizar o XP do usuário
      await statsService.addXP(10);
      
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <select value={subject} onChange={(e) => setSubject(e.target.value)}>
        <option>Matemática</option>
        <option>Português</option>
        <option>História</option>
      </select>
      
      <input
        type="number"
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value))}
      />
      
      <button onClick={startStudySession} disabled={loading}>
        {loading ? 'Salvando...' : 'Finalizar Sessão'}
      </button>
    </div>
  );
}

// ==================== EXEMPLO 5: ESTATÍSTICAS ====================
function StatsExample() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadStats = async () => {
    setLoading(true);

    try {
      const [userStats, weeklyStats, distribution] = await Promise.all([
        statsService.getStats(),
        statsService.getWeeklyStats(),
        statsService.getSubjectDistribution(),
      ]);

      setStats({
        user: userStats,
        weekly: weeklyStats,
        subjects: distribution,
      });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={loadStats}>Carregar Estatísticas</button>
      
      {loading ? (
        <p>Carregando...</p>
      ) : stats ? (
        <div>
          <h3>Nível: {stats.user.level}</h3>
          <h3>XP: {stats.user.xp}</h3>
          <h3>Sequência: {stats.user.streak} dias</h3>
          <h3>Total de minutos: {stats.user.totalMinutes}</h3>
          
          <h4>Matérias mais estudadas:</h4>
          <ul>
            {stats.subjects.map((item: any) => (
              <li key={item.subject}>
                {item.subject}: {item.minutes} minutos ({item.percentage}%)
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

// ==================== EXEMPLO 6: HOOK CUSTOMIZADO ====================
// Criar um hook customizado para facilitar o uso
import { useEffect } from 'react';

function useStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await statsService.getStats();
        setStats(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return { stats, loading, error };
}

// Usar o hook
function StatsWithHookExample() {
  const { stats, loading, error } = useStats();

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;
  if (!stats) return null;

  return (
    <div>
      <h2>Nível {stats.level}</h2>
      <p>{stats.xp} XP</p>
      <p>Sequência: {stats.streak} dias</p>
    </div>
  );
}

// ==================== EXEMPLO 7: RELATÓRIOS ====================
import { reportService } from './src/services/api';

function MonthlyReportExample() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadReport = async () => {
    setLoading(true);

    try {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      const data = await reportService.getMonthlyReport(
        currentMonth,
        currentYear
      );

      setReport(data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = async () => {
    try {
      const blob = await reportService.exportReport({
        format: 'pdf',
        startDate: '2026-03-01',
        endDate: '2026-03-31',
      });

      // Download do arquivo
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-${new Date().toISOString()}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success('Relatório exportado com sucesso!');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div>
      <button onClick={loadReport}>Carregar Relatório</button>
      <button onClick={exportPDF}>Exportar PDF</button>
      
      {loading ? (
        <p>Carregando...</p>
      ) : report ? (
        <div>
          <h2>Relatório de {report.month}/{report.year}</h2>
          <p>Total de minutos: {report.totalMinutes}</p>
          <p>Total de sessões: {report.totalSessions}</p>
          <p>Média diária: {report.averageDaily} min</p>
          <p>Dias estudados: {report.studyDays}</p>
          <p>Score de produtividade: {report.productivityScore}</p>
        </div>
      ) : null}
    </div>
  );
}

export {
  LoginExample,
  CreateTaskExample,
  TaskListExample,
  StudySessionExample,
  StatsExample,
  StatsWithHookExample,
  MonthlyReportExample,
};
