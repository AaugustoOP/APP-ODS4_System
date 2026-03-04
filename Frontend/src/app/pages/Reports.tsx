import { useStudy } from '../context/StudyContext';
import { Card } from '../components/ui/card';
import { BarChart3, Calendar, TrendingUp, PieChart } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

export function Reports() {
  const { sessions, stats, getWeeklyMinutes, getSubjectDistribution } = useStudy();

  const weeklyData = getWeeklyMinutes().map((minutes, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return {
      day: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
      fullDate: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      minutes,
      hours: (minutes / 60).toFixed(1),
    };
  });

  const subjectData = getSubjectDistribution();
  const totalMinutes = subjectData.reduce((sum, item) => sum + item.minutes, 0);
  const subjectPercentages = subjectData.map((item) => ({
    ...item,
    percentage: ((item.minutes / totalMinutes) * 100).toFixed(1),
    hours: (item.minutes / 60).toFixed(1),
  }));

  const bestDay =
    weeklyData.length > 0
      ? weeklyData.reduce((max, day) => (day.minutes > max.minutes ? day : max))
      : null;

  const averageDaily =
    weeklyData.length > 0
      ? weeklyData.reduce((sum, day) => sum + day.minutes, 0) / weeklyData.length
      : 0;

  // Dados mensais (últimos 30 dias)
  const monthlyData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const dateStr = date.toISOString().split('T')[0];
    const daySessions = sessions.filter((s) => s.date === dateStr && s.type === 'focus');
    const minutes = daySessions.reduce((sum, s) => sum + s.duration, 0);
    return {
      date: date.getDate(),
      minutes,
    };
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Relatório Mensal de Desempenho</h1>
        <p className="text-blue-300">
          Análise completa do seu progresso nos estudos
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <p className="text-blue-300 text-sm">Total de Horas</p>
          </div>
          <p className="text-3xl font-bold text-white">
            {(stats.totalMinutes / 60).toFixed(1)}h
          </p>
          <p className="text-xs text-blue-400 mt-1">
            {stats.totalMinutes} minutos estudados
          </p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-green-400" />
            <p className="text-green-300 text-sm">Melhor Dia</p>
          </div>
          <p className="text-3xl font-bold text-white">
            {bestDay ? bestDay.day : '--'}
          </p>
          <p className="text-xs text-green-400 mt-1">
            {bestDay ? `${bestDay.minutes} minutos` : 'Sem dados'}
          </p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <p className="text-purple-300 text-sm">Média Diária</p>
          </div>
          <p className="text-3xl font-bold text-white">
            {averageDaily.toFixed(0)}min
          </p>
          <p className="text-xs text-purple-400 mt-1">
            {(averageDaily / 60).toFixed(1)}h por dia
          </p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30">
          <div className="flex items-center gap-3 mb-2">
            <PieChart className="w-5 h-5 text-orange-400" />
            <p className="text-orange-300 text-sm">Matérias</p>
          </div>
          <p className="text-3xl font-bold text-white">
            {subjectData.length}
          </p>
          <p className="text-xs text-orange-400 mt-1">
            Áreas de estudo
          </p>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Chart */}
        <Card className="p-6 bg-gradient-to-br from-slate-900/90 to-blue-900/40 border-blue-500/20">
          <h3 className="text-xl font-bold text-white mb-6">Desempenho Semanal</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
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
                fill="url(#blueGradient)"
                radius={[8, 8, 0, 0]}
              />
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.3} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Subject Distribution */}
        <Card className="p-6 bg-gradient-to-br from-slate-900/90 to-purple-900/40 border-purple-500/20">
          <h3 className="text-xl font-bold text-white mb-6">Distribuição por Matérias</h3>
          {subjectData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <RePieChart>
                <Pie
                  data={subjectData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ subject, percentage }) => `${subject}: ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="minutes"
                >
                  {subjectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #8b5cf6',
                    borderRadius: '8px',
                  }}
                />
              </RePieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              <p>Sem dados de matérias ainda</p>
            </div>
          )}
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card className="p-6 bg-gradient-to-br from-slate-900/90 to-indigo-900/40 border-indigo-500/20">
        <h3 className="text-xl font-bold text-white mb-6">Tendência Mensal (Últimos 30 Dias)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" opacity={0.2} />
            <XAxis dataKey="date" stroke="#60a5fa" />
            <YAxis stroke="#60a5fa" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                border: '1px solid #6366f1',
                borderRadius: '8px',
              }}
            />
            <Line
              type="monotone"
              dataKey="minutes"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ fill: '#6366f1', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Subject Details Table */}
      {subjectPercentages.length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/40 border-blue-500/20">
          <h3 className="text-xl font-bold text-white mb-6">Detalhamento por Matéria</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-blue-500/20">
                  <th className="text-left py-3 px-4 text-blue-300">Matéria</th>
                  <th className="text-right py-3 px-4 text-blue-300">Minutos</th>
                  <th className="text-right py-3 px-4 text-blue-300">Horas</th>
                  <th className="text-right py-3 px-4 text-blue-300">Porcentagem</th>
                </tr>
              </thead>
              <tbody>
                {subjectPercentages
                  .sort((a, b) => b.minutes - a.minutes)
                  .map((item, index) => (
                    <tr
                      key={item.subject}
                      className="border-b border-blue-500/10 hover:bg-blue-500/5"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="text-white font-medium">{item.subject}</span>
                        </div>
                      </td>
                      <td className="text-right py-3 px-4 text-blue-200">
                        {item.minutes} min
                      </td>
                      <td className="text-right py-3 px-4 text-blue-200">
                        {item.hours}h
                      </td>
                      <td className="text-right py-3 px-4">
                        <span className="text-white font-bold">{item.percentage}%</span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Insights */}
      <Card className="p-6 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 border-blue-500/30">
        <h3 className="text-xl font-bold text-white mb-4">💡 Insights e Recomendações</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-blue-300 font-medium mb-2">Progresso Geral</p>
            <p className="text-white text-sm">
              {stats.totalSessions === 0
                ? 'Comece sua jornada de estudos hoje!'
                : stats.totalSessions < 10
                ? 'Você está começando bem! Continue assim para criar um hábito forte.'
                : stats.totalSessions < 50
                ? 'Ótimo progresso! Você está desenvolvendo disciplina e consistência.'
                : 'Excelente! Você já é um estudante experiente e dedicado.'}
            </p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-purple-300 font-medium mb-2">Consistência</p>
            <p className="text-white text-sm">
              {stats.streak === 0
                ? 'Comece hoje e crie uma sequência de estudos!'
                : stats.streak < 7
                ? 'Você está criando um hábito. Tente manter a sequência por 7 dias!'
                : stats.streak < 30
                ? 'Incrível! Você já tem um hábito consolidado. Continue assim!'
                : 'Você é um mestre da consistência! Seu compromisso é inspirador.'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
