import { useStudy } from '../context/StudyContext';
import { Card } from '../components/ui/card';
import { Trophy, Flame, Zap, Award, Star, Target, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { Progress } from '../components/ui/progress';

const ACHIEVEMENTS = [
  {
    id: 'streak_7',
    name: 'Estudante Dedicado',
    description: 'Mantenha uma sequência de 7 dias',
    icon: '🔥',
    requirement: 7,
  },
  {
    id: 'streak_14',
    name: 'Guerreiro dos Estudos',
    description: 'Mantenha uma sequência de 14 dias',
    icon: '⚡',
    requirement: 14,
  },
  {
    id: 'streak_30',
    name: 'Mestre da Consistência',
    description: 'Mantenha uma sequência de 30 dias',
    icon: '👑',
    requirement: 30,
  },
  {
    id: 'sessions_50',
    name: 'Maratonista Mental',
    description: 'Complete 50 sessões de estudo',
    icon: '🏃',
    requirement: 50,
  },
  {
    id: 'level_10',
    name: 'Nível Avançado',
    description: 'Alcance o nível 10',
    icon: '🎯',
    requirement: 10,
  },
];

export function Gamification() {
  const { stats } = useStudy();

  const xpToNextLevel = 100 - (stats.xp % 100);
  const levelProgress = (stats.xp % 100);

  const getStreakMessage = () => {
    if (stats.streak === 0) return 'Comece sua jornada hoje!';
    if (stats.streak === 1) return 'Primeiro dia completo! Continue assim!';
    if (stats.streak < 7) return `${stats.streak} dias seguidos! Você está indo bem!`;
    if (stats.streak < 30)
      return `${stats.streak} dias de consistência! Você é disciplinado!`;
    return `${stats.streak} dias! Você é um exemplo de dedicação!`;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Sistema de Gamificação</h1>
        <p className="text-blue-300">
          Acompanhe seu progresso, conquiste medalhas e suba de nível!
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Level Card */}
        <Card className="p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-purple-300 text-sm">Nível Atual</p>
              <p className="text-4xl font-bold text-white">{stats.level}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-purple-300">XP</span>
              <span className="text-white font-medium">
                {stats.xp % 100}/100
              </span>
            </div>
            <Progress value={levelProgress} className="h-3 bg-slate-800" />
            <p className="text-xs text-purple-300 text-right">
              {xpToNextLevel} XP para o próximo nível
            </p>
          </div>
        </Card>

        {/* Streak Card */}
        <Card className="p-6 bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-4">
              <Flame className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-orange-300 text-sm">Sequência</p>
              <p className="text-4xl font-bold text-white">{stats.streak}</p>
            </div>
          </div>
          <p className="text-orange-200 font-medium">{getStreakMessage()}</p>
        </Card>

        {/* Total XP Card */}
        <Card className="p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-4">
              <Star className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-blue-300 text-sm">XP Total</p>
              <p className="text-4xl font-bold text-white">{stats.xp}</p>
            </div>
          </div>
          <p className="text-blue-200">
            Você já ganhou <strong>{stats.xp} pontos</strong> de experiência!
          </p>
        </Card>
      </div>

      {/* Achievements */}
      <Card className="p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/40 border-blue-500/20">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h2 className="text-2xl font-bold text-white">Conquistas</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {ACHIEVEMENTS.map((achievement, index) => {
            const isUnlocked = stats.achievements.includes(achievement.id);
            const progress = getAchievementProgress(achievement, stats);

            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/40'
                      : 'bg-slate-800/50 border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`text-4xl ${isUnlocked ? 'grayscale-0' : 'grayscale opacity-50'}`}
                    >
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3
                          className={`font-bold ${isUnlocked ? 'text-yellow-400' : 'text-gray-400'}`}
                        >
                          {achievement.name}
                        </h3>
                        {isUnlocked && (
                          <Award className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                      <p
                        className={`text-sm mb-2 ${isUnlocked ? 'text-yellow-200' : 'text-gray-500'}`}
                      >
                        {achievement.description}
                      </p>
                      {!isUnlocked && (
                        <>
                          <Progress value={progress} className="h-2 bg-slate-700 mb-1" />
                          <p className="text-xs text-gray-500">
                            Progresso: {Math.min(progress, 100).toFixed(0)}%
                          </p>
                        </>
                      )}
                      {isUnlocked && (
                        <p className="text-xs text-yellow-400 font-medium">✓ Desbloqueada!</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Progress Summary */}
      <Card className="p-6 bg-gradient-to-br from-slate-900/90 to-green-900/40 border-green-500/20">
        <h3 className="text-xl font-bold text-white mb-4">Resumo de Progresso</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-slate-800/50 rounded-xl">
            <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{stats.totalSessions}</p>
            <p className="text-sm text-blue-300">Sessões Totais</p>
          </div>
          <div className="text-center p-4 bg-slate-800/50 rounded-xl">
            <Clock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{stats.totalMinutes}</p>
            <p className="text-sm text-purple-300">Minutos Estudados</p>
          </div>
          <div className="text-center p-4 bg-slate-800/50 rounded-xl">
            <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{stats.achievements.length}</p>
            <p className="text-sm text-yellow-300">Conquistas</p>
          </div>
          <div className="text-center p-4 bg-slate-800/50 rounded-xl">
            <Flame className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{stats.streak}</p>
            <p className="text-sm text-orange-300">Dias de Sequência</p>
          </div>
        </div>
      </Card>

      {/* Motivational Message */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white text-center"
      >
        <Trophy className="w-12 h-12 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">
          {stats.level < 5
            ? 'Você está apenas começando! 🚀'
            : stats.level < 10
            ? 'Progresso incrível! Continue assim! 💪'
            : 'Você é um verdadeiro mestre dos estudos! 👑'}
        </h3>
        <p className="text-blue-100">
          {stats.achievements.length === 0
            ? 'Complete sua primeira sessão de estudos para começar a desbloquear conquistas!'
            : stats.achievements.length < 3
            ? 'Você já desbloqueou algumas conquistas! Continue estudando para desbloquear mais.'
            : 'Parabéns por todo o seu esforço e dedicação aos estudos!'}
        </p>
      </motion.div>
    </div>
  );
}

function getAchievementProgress(achievement: any, stats: any): number {
  switch (achievement.id) {
    case 'streak_7':
    case 'streak_14':
    case 'streak_30':
      return (stats.streak / achievement.requirement) * 100;
    case 'sessions_50':
      return (stats.totalSessions / achievement.requirement) * 100;
    case 'level_10':
      return (stats.level / achievement.requirement) * 100;
    default:
      return 0;
  }
}