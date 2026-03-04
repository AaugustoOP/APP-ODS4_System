import { useState, useEffect, useRef } from 'react';
import { useStudy } from '../context/StudyContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Play, Pause, RotateCcw, Target, Clock, Zap, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from 'recharts';

type TimerMode = 'focus' | 'shortBreak';

export function Dashboard() {
  const { addSession, getTodayMinutes, getWeeklyMinutes, stats, dailyGoal } = useStudy();

  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutos
  const [isRunning, setIsRunning] = useState(false);
  const [currentSubject, setCurrentSubject] = useState('Geral');
  const intervalRef = useRef<number | null>(null);

  const DURATIONS = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleComplete = () => {
    setIsRunning(false);

    if (mode === 'focus') {
      const today = new Date().toISOString().split('T')[0];
      addSession({
        date: today,
        duration: 25,
        subject: currentSubject,
        type: 'focus',
      });
      setMode('shortBreak');
      setTimeLeft(DURATIONS.shortBreak);
    } else {
      setMode('focus');
      setTimeLeft(DURATIONS.focus);
    }

    // Notificação
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('EduFocus', {
        body: mode === 'focus' ? 'Pausa! Relaxe por 5 minutos.' : 'Hora de focar novamente!',
      });
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(DURATIONS[mode]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const todayMinutes = getTodayMinutes();
  const weeklyData = getWeeklyMinutes();
  const progressPercent = (todayMinutes / dailyGoal) * 100;

  const chartData = weeklyData.map((minutes, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return {
      day: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
      minutes,
    };
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Target className="w-5 h-5" />}
          label="Meta Diária"
          value={`${todayMinutes}/${dailyGoal}`}
          unit="min"
          gradient="from-blue-500 to-cyan-500"
        />
        <StatCard
          icon={<Zap className="w-5 h-5" />}
          label="Nível"
          value={stats.level.toString()}
          unit={`${stats.xp % 100}/100 XP`}
          gradient="from-purple-500 to-pink-500"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Sequência"
          value={stats.streak.toString()}
          unit="dias"
          gradient="from-orange-500 to-red-500"
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          label="Total"
          value={stats.totalSessions.toString()}
          unit="sessões"
          gradient="from-green-500 to-emerald-500"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pomodoro Timer */}
        <Card className="lg:col-span-2 p-8 bg-gradient-to-br from-slate-900/90 to-blue-900/40 border-blue-500/20 backdrop-blur-xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Temporizador Pomodoro</h2>
              <div className="flex gap-2">
                <Button
                  variant={mode === 'focus' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setMode('focus');
                    setTimeLeft(DURATIONS.focus);
                    setIsRunning(false);
                  }}
                  className={
                    mode === 'focus'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                      : 'border-blue-500/30 text-blue-300'
                  }
                >
                  Foco (25min)
                </Button>
                <Button
                  variant={mode === 'shortBreak' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setMode('shortBreak');
                    setTimeLeft(DURATIONS.shortBreak);
                    setIsRunning(false);
                  }}
                  className={
                    mode === 'shortBreak'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                      : 'border-green-500/30 text-green-300'
                  }
                >
                  Pausa (5min)
                </Button>
              </div>
            </div>

            <motion.div
              className={`relative rounded-3xl p-12 text-center ${
                mode === 'focus'
                  ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30'
                  : 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30'
              }`}
              animate={
                isRunning
                  ? {
                      scale: [1, 1.02, 1],
                      transition: { duration: 2, repeat: Infinity },
                    }
                  : {}
              }
            >
              <p className="text-xl mb-4 text-blue-300">
                {mode === 'focus' ? '🎯 Sessão de Foco' : '☕ Momento de Pausa'}
              </p>
              <p className="text-8xl font-bold text-white mb-6 tracking-tight">
                {formatTime(timeLeft)}
              </p>

              <div className="flex gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={toggleTimer}
                  className="w-40 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-5 h-5 mr-2" />
                      Pausar
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Iniciar
                    </>
                  )}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={resetTimer}
                  className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
                >
                  <RotateCcw className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>

            {mode === 'focus' && (
              <div className="space-y-2">
                <label className="text-sm text-blue-300">Matéria atual:</label>
                <select
                  value={currentSubject}
                  onChange={(e) => setCurrentSubject(e.target.value)}
                  className="w-full bg-slate-800/50 border border-blue-500/30 rounded-lg px-4 py-2 text-white"
                  disabled={isRunning}
                >
                  <option>Geral</option>
                  <option>Matemática</option>
                  <option>Português</option>
                  <option>História</option>
                  <option>Geografia</option>
                  <option>Ciências</option>
                  <option>Inglês</option>
                  <option>Física</option>
                  <option>Química</option>
                  <option>Biologia</option>
                </select>
              </div>
            )}
          </div>
        </Card>

        {/* Daily Progress */}
        <Card className="p-6 bg-gradient-to-br from-slate-900/90 to-purple-900/40 border-purple-500/20 backdrop-blur-xl">
          <h3 className="text-xl font-bold text-white mb-6">Progresso Diário</h3>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-blue-300">Meta de Hoje</span>
                <span className="text-2xl font-bold text-white">
                  {todayMinutes}
                  <span className="text-sm text-blue-400">/{dailyGoal} min</span>
                </span>
              </div>
              <Progress
                value={Math.min(progressPercent, 100)}
                className="h-3 bg-slate-800"
              />
              <p className="text-xs text-blue-400 mt-2 text-right">
                {progressPercent >= 100
                  ? '🎉 Meta alcançada!'
                  : `${Math.max(0, dailyGoal - todayMinutes)} minutos restantes`}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <span className="text-blue-300">Sessões Hoje</span>
                <span className="text-xl font-bold text-white">
                  {Math.floor(todayMinutes / 25)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <span className="text-purple-300">XP de Hoje</span>
                <span className="text-xl font-bold text-white">
                  +{Math.floor(todayMinutes / 25) * 10}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <span className="text-green-300">Eficiência</span>
                <span className="text-xl font-bold text-white">
                  {progressPercent >= 100 ? '100%' : `${Math.round(progressPercent)}%`}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Weekly Summary */}
      <Card className="p-6 bg-gradient-to-br from-slate-900/90 to-indigo-900/40 border-indigo-500/20 backdrop-blur-xl">
        <h3 className="text-xl font-bold text-white mb-6">Resumo Semanal</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" opacity={0.2} />
            <XAxis dataKey="day" stroke="#60a5fa" />
            <YAxis stroke="#60a5fa" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                border: '1px solid #3b82f6',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#60a5fa' }}
            />
            <Bar
              dataKey="minutes"
              fill="url(#colorGradient)"
              radius={[8, 8, 0, 0]}
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.3} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Motivational Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white text-center"
      >
        <h3 className="text-2xl font-bold mb-2">Continue assim! 🚀</h3>
        <p className="text-blue-100">
          {stats.streak === 0
            ? 'Comece sua jornada de estudos hoje!'
            : stats.streak < 7
            ? `Você está em uma sequência de ${stats.streak} ${
                stats.streak === 1 ? 'dia' : 'dias'
              }! Continue mantendo o foco.`
            : stats.streak < 30
            ? `Incrível! ${stats.streak} dias consecutivos. Você é dedicado e disciplinado!`
            : `🏆 Extraordinário! ${stats.streak} dias de consistência. Você é um exemplo!`}
        </p>
      </motion.div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  unit,
  gradient,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  gradient: string;
}) {
  return (
    <Card className="p-4 bg-gradient-to-br from-slate-900/90 to-slate-800/40 border-blue-500/20 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className={`bg-gradient-to-br ${gradient} rounded-xl p-3 text-white`}>{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-blue-300 truncate">{label}</p>
          <p className="text-2xl font-bold text-white truncate">
            {value}
          </p>
          <p className="text-xs text-blue-400">{unit}</p>
        </div>
      </div>
    </Card>
  );
}
