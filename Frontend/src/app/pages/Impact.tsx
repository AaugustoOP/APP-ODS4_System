import { useStudy } from '../context/StudyContext';
import { Card } from '../components/ui/card';
import { Globe, BookOpen, Users, TrendingUp, Heart, Lightbulb } from 'lucide-react';
import { motion } from 'motion/react';
import { Progress } from '../components/ui/progress';

export function Impact() {
  const { stats } = useStudy();

  const studyHours = (stats.totalMinutes / 60).toFixed(1);
  const carbonSaved = (parseFloat(studyHours) * 0.5).toFixed(1); // Estimativa simbólica
  const impactScore = Math.min(100, (stats.totalSessions / 100) * 100);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="inline-block bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full p-6 mb-4"
        >
          <Globe className="w-16 h-16 text-white" />
        </motion.div>
        <h1 className="text-4xl font-bold text-white mb-3">
          ODS 4 - Educação de Qualidade
        </h1>
        <p className="text-xl text-blue-300 max-w-3xl mx-auto">
          Seu compromisso com os estudos contribui para um mundo melhor através da educação
        </p>
      </div>

      {/* ODS 4 Info Card */}
      <Card className="p-8 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">O que é a ODS 4?</h2>
            <p className="text-blue-100 mb-4">
              O <strong>Objetivo de Desenvolvimento Sustentável 4</strong> da ONU tem como meta
              "assegurar a educação inclusiva, equitativa e de qualidade, e promover
              oportunidades de aprendizagem ao longo da vida para todos".
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-blue-500 rounded-full p-1 mt-1">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Educação de Qualidade</p>
                  <p className="text-blue-200 text-sm">
                    Garantir acesso igualitário à educação para todos
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-cyan-500 rounded-full p-1 mt-1">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Inclusão e Equidade</p>
                  <p className="text-blue-200 text-sm">
                    Eliminar disparidades e promover igualdade de oportunidades
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-400 rounded-full p-1 mt-1">
                  <Lightbulb className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Aprendizagem Contínua</p>
                  <p className="text-blue-200 text-sm">
                    Promover o aprendizado ao longo de toda a vida
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-2xl"
              />
              <div className="relative bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full p-12">
                <img
                  src="https://images.unsplash.com/photo-1594027554094-99c00129af63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwdW5pdmVyc2l0eXxlbnwxfHx8fDE3NzIxMDE3ODN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Educação"
                  className="w-48 h-48 rounded-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Personal Impact */}
      <Card className="p-6 bg-gradient-to-br from-slate-900/90 to-purple-900/40 border-purple-500/20">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Heart className="w-6 h-6 text-pink-500" />
          Seu Impacto Pessoal
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="text-center p-6 bg-slate-800/50 rounded-xl">
            <div className="text-5xl font-bold text-white mb-2">{studyHours}</div>
            <p className="text-blue-300">Horas investidas em educação</p>
          </div>
          <div className="text-center p-6 bg-slate-800/50 rounded-xl">
            <div className="text-5xl font-bold text-white mb-2">{stats.totalSessions}</div>
            <p className="text-purple-300">Sessões de aprendizado</p>
          </div>
          <div className="text-center p-6 bg-slate-800/50 rounded-xl">
            <div className="text-5xl font-bold text-white mb-2">{stats.streak}</div>
            <p className="text-green-300">Dias de consistência</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-blue-300">Nível de Impacto</span>
              <span className="text-white font-bold">{impactScore.toFixed(0)}%</span>
            </div>
            <Progress value={impactScore} className="h-3 bg-slate-800" />
            <p className="text-xs text-blue-400 mt-2">
              {impactScore < 25
                ? 'Você está começando sua jornada de impacto!'
                : impactScore < 50
                ? 'Seu compromisso com a educação está crescendo!'
                : impactScore < 75
                ? 'Você já é um agente de transformação!'
                : 'Seu impacto é extraordinário! Continue inspirando!'}
            </p>
          </div>
        </div>
      </Card>

      {/* Global Statistics */}
      <Card className="p-6 bg-gradient-to-br from-slate-900/90 to-blue-900/40 border-blue-500/20">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Globe className="w-6 h-6 text-blue-500" />
          Estatísticas Globais de Educação
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-500 rounded-full p-3">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">258M</p>
                <p className="text-blue-300 text-sm">
                  Crianças e jovens fora da escola globalmente
                </p>
              </div>
            </div>
            <p className="text-blue-200 text-sm">
              A ODS 4 busca garantir que todas as crianças tenham acesso à educação de qualidade.
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-purple-500 rounded-full p-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">617M</p>
                <p className="text-purple-300 text-sm">
                  Jovens sem competências básicas de leitura e matemática
                </p>
              </div>
            </div>
            <p className="text-purple-200 text-sm">
              A educação de qualidade é fundamental para o desenvolvimento sustentável.
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-500 rounded-full p-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">+53%</p>
                <p className="text-green-300 text-sm">
                  Aumento na taxa de alfabetização global desde 2000
                </p>
              </div>
            </div>
            <p className="text-green-200 text-sm">
              Progressos significativos estão sendo feitos, mas ainda há muito a fazer.
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-orange-500 rounded-full p-3">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">2030</p>
                <p className="text-orange-300 text-sm">Meta da ONU para educação universal</p>
              </div>
            </div>
            <p className="text-orange-200 text-sm">
              Trabalhando juntos para garantir educação de qualidade para todos até 2030.
            </p>
          </div>
        </div>
      </Card>

      {/* Inspirational Quotes */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30">
          <p className="text-white text-lg italic mb-4">
            "A educação é a arma mais poderosa que você pode usar para mudar o mundo."
          </p>
          <p className="text-blue-300 font-medium">— Nelson Mandela</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
          <p className="text-white text-lg italic mb-4">
            "Educação não transforma o mundo. Educação muda as pessoas. Pessoas transformam o
            mundo."
          </p>
          <p className="text-purple-300 font-medium">— Paulo Freire</p>
        </Card>
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white text-center"
      >
        <h3 className="text-3xl font-bold mb-4">
          Você é Parte da Solução! 🌟
        </h3>
        <p className="text-blue-100 text-lg max-w-3xl mx-auto mb-6">
          Cada hora que você dedica aos estudos não é apenas um investimento em seu futuro, mas
          também uma contribuição para um mundo com educação de qualidade para todos. Continue
          estudando, continue aprendendo, continue transformando!
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
            <p className="text-sm text-blue-200">Suas {studyHours}h de estudo</p>
            <p className="text-2xl font-bold">= Inspiração para outros</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
            <p className="text-sm text-purple-200">
              {stats.totalSessions} sessões completas
            </p>
            <p className="text-2xl font-bold">= Impacto mensurável</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}