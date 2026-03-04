import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { GraduationCap, Target, Trophy, BarChart3, Globe, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export function Landing() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-blue-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-2">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  EduFocus
                </h1>
                <p className="text-xs text-blue-300">Educação de Qualidade</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link to="/login">
                <Button
                  variant="outline"
                  className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
                >
                  Entrar
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                  Cadastrar-se
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="inline-block bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-full px-6 py-2 mb-6"
            >
              <p className="text-blue-300 text-sm font-medium">
                🌍 Alinhado com a ODS 4 da ONU
              </p>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Transforme seus
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Estudos com Foco
              </span>
            </h1>

            <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
              Plataforma educacional moderna que usa gamificação e técnica Pomodoro para
              maximizar sua produtividade acadêmica.
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-lg px-8 py-6">
                  Começar Gratuitamente
                  <Zap className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10 text-lg px-8 py-6"
                >
                  Já tenho conta
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid md:grid-cols-3 gap-6 mb-20"
          >
            <FeatureCard
              icon={<Target className="w-8 h-8" />}
              title="Técnica Pomodoro"
              description="Sessões de 25 minutos de foco profundo com pausas programadas para máxima eficiência"
              gradient="from-blue-500 to-cyan-500"
            />
            <FeatureCard
              icon={<Trophy className="w-8 h-8" />}
              title="Gamificação"
              description="Sistema de XP, níveis, conquistas e streaks para manter você motivado"
              gradient="from-purple-500 to-pink-500"
            />
            <FeatureCard
              icon={<BarChart3 className="w-8 h-8" />}
              title="Relatórios Detalhados"
              description="Análises completas do seu progresso com gráficos e insights inteligentes"
              gradient="from-orange-500 to-red-500"
            />
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Por que escolher o EduFocus?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <BenefitItem
              icon={<CheckCircle2 className="w-6 h-6 text-green-400" />}
              text="Sistema anti-procrastinação com definição de intenções"
            />
            <BenefitItem
              icon={<CheckCircle2 className="w-6 h-6 text-green-400" />}
              text="Modo foco profundo com interface imersiva"
            />
            <BenefitItem
              icon={<CheckCircle2 className="w-6 h-6 text-green-400" />}
              text="Planejador inteligente com estimativa automática de tempo"
            />
            <BenefitItem
              icon={<CheckCircle2 className="w-6 h-6 text-green-400" />}
              text="Relatórios compartilháveis no modo professor"
            />
            <BenefitItem
              icon={<CheckCircle2 className="w-6 h-6 text-green-400" />}
              text="100% gratuito e sem anúncios"
            />
            <BenefitItem
              icon={<CheckCircle2 className="w-6 h-6 text-green-400" />}
              text="Contribuição para educação de qualidade (ODS 4)"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/30 text-center">
            <Globe className="w-16 h-16 mx-auto mb-6 text-blue-400" />
            <h2 className="text-4xl font-bold text-white mb-4">
              Pronto para transformar seus estudos?
            </h2>
            <p className="text-xl text-blue-200 mb-8">
              Junte-se a milhares de estudantes que já melhoraram seu desempenho acadêmico
            </p>
            <Link to="/register">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-lg px-12 py-6">
                Criar Conta Gratuita
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-500/20 py-8 px-4 bg-slate-900/50">
        <div className="container mx-auto text-center">
          <p className="text-blue-300 mb-2">
            <strong>EduFocus</strong> - Promovendo educação de qualidade através da tecnologia
          </p>
          <p className="text-xs text-blue-500">
            Alinhado com a ODS 4 (Objetivo de Desenvolvimento Sustentável) da ONU 🌍
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <Card className="p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/40 border-blue-500/20 hover:border-blue-500/40 transition-all">
      <div className={`bg-gradient-to-br ${gradient} rounded-xl p-3 w-fit mb-4 text-white`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-blue-300">{description}</p>
    </Card>
  );
}

function BenefitItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg border border-blue-500/20">
      {icon}
      <p className="text-white">{text}</p>
    </div>
  );
}