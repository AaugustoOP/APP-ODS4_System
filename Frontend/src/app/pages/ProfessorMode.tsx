import { useStudy } from '../context/StudyContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  Download,
  Printer,
  Share2,
  BarChart3,
  Trophy,
  Calendar,
  Clock,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

export function ProfessorMode() {
  const { stats, getWeeklyMinutes, getSubjectDistribution } = useStudy();

  const weeklyData = getWeeklyMinutes().map((minutes, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return {
      day: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
      minutes,
    };
  });

  const subjectData = getSubjectDistribution();
  const totalMinutes = stats.totalMinutes;
  const totalHours = (totalMinutes / 60).toFixed(1);
  const averageDaily = weeklyData.reduce((sum, d) => sum + d.minutes, 0) / 7;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Meu Relatório de Estudos - EduFocus',
        text: `Confira meu progresso: ${stats.totalSessions} sessões, ${totalHours}h de estudo!`,
      });
    }
  };

  const performanceLevel =
    stats.totalSessions === 0
      ? 'Iniciante'
      : stats.totalSessions < 20
      ? 'Em Desenvolvimento'
      : stats.totalSessions < 50
      ? 'Satisfatório'
      : stats.totalSessions < 100
      ? 'Bom'
      : 'Excelente';

  const performanceColor =
    performanceLevel === 'Excelente'
      ? 'text-green-400'
      : performanceLevel === 'Bom'
      ? 'text-blue-400'
      : performanceLevel === 'Satisfatório'
      ? 'text-yellow-400'
      : 'text-orange-400';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Modo Professor</h1>
          <p className="text-blue-300">Relatório de desempenho acadêmico institucional</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handlePrint}
            variant="outline"
            className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
          >
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </Button>
          <Button
            onClick={handleShare}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Compartilhar
          </Button>
        </div>
      </div>

      {/* Report Header - Print Version */}
      <Card className="p-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-blue-500/20 print:shadow-none">
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-200 dark:border-blue-500/20">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Relatório de Desempenho Acadêmico
            </h2>
            <p className="text-slate-600 dark:text-blue-300">
              Plataforma EduFocus - Educação de Qualidade (ODS 4)
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-600 dark:text-blue-400">Data de Emissão</p>
            <p className="font-bold text-slate-900 dark:text-white">
              {new Date().toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Student Info Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Informações do Estudante
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-blue-500/10">
                <span className="text-slate-600 dark:text-blue-300">Nível Atual:</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  Nível {stats.level}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-blue-500/10">
                <span className="text-slate-600 dark:text-blue-300">XP Total:</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {stats.xp} pontos
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-blue-500/10">
                <span className="text-slate-600 dark:text-blue-300">Sequência Atual:</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {stats.streak} dias
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Métricas de Desempenho
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-blue-500/10">
                <span className="text-slate-600 dark:text-blue-300">Total de Sessões:</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {stats.totalSessions}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-blue-500/10">
                <span className="text-slate-600 dark:text-blue-300">Horas Estudadas:</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {totalHours}h
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-blue-500/10">
                <span className="text-slate-600 dark:text-blue-300">Média Diária:</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {averageDaily.toFixed(0)} min
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Assessment */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Avaliação de Desempenho
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white dark:bg-slate-900/50 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-blue-400 mb-2">
                Nível de Desempenho
              </p>
              <p className={`text-2xl font-bold ${performanceColor}`}>{performanceLevel}</p>
            </div>
            <div className="text-center p-4 bg-white dark:bg-slate-900/50 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-blue-400 mb-2">
                Consistência
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.streak > 7 ? 'Alta' : stats.streak > 3 ? 'Média' : 'Inicial'}
              </p>
            </div>
            <div className="text-center p-4 bg-white dark:bg-slate-900/50 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-blue-400 mb-2">Conquistas</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.achievements.length}/{ACHIEVEMENTS_TOTAL}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-blue-500/20">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Distribuição Semanal
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="minutes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-blue-500/20">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Distribuição por Matérias
          </h3>
          {subjectData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={subjectData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ subject }) => subject}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="minutes"
                >
                  {subjectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-slate-500">
              Sem dados de matérias
            </div>
          )}
        </Card>
      </div>

      {/* Observations Section */}
      <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-blue-500/20">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Observações e Recomendações
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div className="bg-blue-500 rounded-full p-1 mt-0.5">
              <TrendingUp className="w-3 h-3 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-900 dark:text-white mb-1">Progresso Geral</p>
              <p className="text-slate-600 dark:text-blue-300">
                {stats.totalSessions === 0
                  ? 'O estudante está iniciando sua jornada de aprendizado.'
                  : stats.totalSessions < 20
                  ? 'O estudante demonstra interesse em desenvolver hábitos de estudo.'
                  : stats.totalSessions < 50
                  ? 'Bom comprometimento com os estudos. Recomenda-se manter a regularidade.'
                  : 'Excelente desempenho e dedicação aos estudos. Estudante exemplar.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div className="bg-purple-500 rounded-full p-1 mt-0.5">
              <Trophy className="w-3 h-3 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-900 dark:text-white mb-1">Consistência</p>
              <p className="text-slate-600 dark:text-blue-300">
                {stats.streak === 0
                  ? 'Recomenda-se estabelecer uma rotina regular de estudos.'
                  : stats.streak < 7
                  ? 'O estudante está desenvolvendo consistência. Encorajar continuidade.'
                  : 'Demonstra excelente disciplina e constância nos estudos.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div className="bg-green-500 rounded-full p-1 mt-0.5">
              <BarChart3 className="w-3 h-3 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-900 dark:text-white mb-1">
                Recomendações Futuras
              </p>
              <p className="text-slate-600 dark:text-blue-300">
                {averageDaily < 30
                  ? 'Sugerimos aumentar gradualmente o tempo diário de estudos.'
                  : averageDaily < 60
                  ? 'Manter o ritmo atual e buscar diversificar as matérias de estudo.'
                  : 'Continuar com a excelente rotina estabelecida.'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Footer */}
      <Card className="p-6 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-blue-500/20 text-center">
        <p className="text-sm text-slate-600 dark:text-blue-400 mb-2">
          Este relatório foi gerado automaticamente pela plataforma EduFocus
        </p>
        <p className="text-xs text-slate-500 dark:text-blue-500">
          Alinhado com a ODS 4 - Educação de Qualidade • Organização das Nações Unidas
        </p>
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-blue-500/20">
          <p className="text-xs text-slate-400 dark:text-blue-600">
            EduFocus © 2026 - Promovendo educação de qualidade através da tecnologia
          </p>
        </div>
      </Card>
    </div>
  );
}

const ACHIEVEMENTS_TOTAL = 5;
