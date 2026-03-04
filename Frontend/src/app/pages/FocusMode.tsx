import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useStudy } from '../context/StudyContext';
import { X, Play, Pause } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export function FocusMode() {
  const navigate = useNavigate();
  const { addSession, intention, setIntention } = useStudy();

  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [showIntention, setShowIntention] = useState(!intention);
  const [currentIntention, setCurrentIntention] = useState(intention);
  const [currentSubject, setCurrentSubject] = useState('Geral');
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
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
    const today = new Date().toISOString().split('T')[0];
    addSession({
      date: today,
      duration: 25,
      subject: currentSubject,
      type: 'focus',
    });

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('EduFocus - Sessão Completa! 🎉', {
        body: 'Parabéns! Você completou 25 minutos de foco profundo.',
      });
    }

    setTimeLeft(25 * 60);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const startWithIntention = () => {
    if (currentIntention.trim()) {
      setIntention(currentIntention);
      setShowIntention(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-950 overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Exit Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/')}
        className="absolute top-4 right-4 z-50 text-white/60 hover:text-white hover:bg-white/10"
      >
        <X className="w-6 h-6" />
      </Button>

      {/* Intention Dialog */}
      {showIntention && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 flex items-center justify-center z-40 bg-black/50 backdrop-blur-sm p-4"
        >
          <div className="bg-slate-900/90 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-8 max-w-md w-full">
            <h2 className="text-3xl font-bold text-white mb-4">
              Qual é seu objetivo nesta sessão?
            </h2>
            <p className="text-blue-300 mb-6">
              Defina sua intenção para manter o foco e clareza durante os estudos.
            </p>
            <Input
              placeholder="Ex: Terminar o capítulo 3 de Matemática"
              value={currentIntention}
              onChange={(e) => setCurrentIntention(e.target.value)}
              className="mb-4 bg-slate-800/50 border-blue-500/30 text-white text-lg py-6"
              autoFocus
              onKeyPress={(e) => e.key === 'Enter' && startWithIntention()}
            />
            <select
              value={currentSubject}
              onChange={(e) => setCurrentSubject(e.target.value)}
              className="w-full mb-6 bg-slate-800/50 border border-blue-500/30 rounded-lg px-4 py-3 text-white"
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
            <Button
              onClick={startWithIntention}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 py-6 text-lg"
              disabled={!currentIntention.trim()}
            >
              Iniciar Sessão de Foco
            </Button>
            <button
              onClick={() => setShowIntention(false)}
              className="w-full mt-3 text-blue-400 hover:text-blue-300 text-sm"
            >
              Pular por enquanto
            </button>
          </div>
        </motion.div>
      )}

      {/* Main Focus Screen */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-4">
        {/* Breathing Animation Circle */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full border-2 border-blue-400/30"
          animate={{
            scale: isRunning ? [1, 1.1, 1] : 1,
            opacity: isRunning ? [0.3, 0.6, 0.3] : 0.3,
          }}
          transition={{
            duration: 4,
            repeat: isRunning ? Infinity : 0,
            ease: 'easeInOut',
          }}
        />

        {/* Timer Display */}
        <motion.div
          className="text-center space-y-8 relative z-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <motion.p
              className="text-blue-300 text-xl mb-4"
              animate={isRunning ? { opacity: [0.5, 1, 0.5] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {isRunning ? '🎯 Foco Profundo Ativo' : '⏸️ Pausado'}
            </motion.p>

            <motion.div
              className="text-[140px] md:text-[180px] font-bold text-white leading-none tracking-tighter"
              animate={
                isRunning
                  ? {
                      scale: [1, 1.02, 1],
                      transition: { duration: 1, repeat: Infinity },
                    }
                  : {}
              }
            >
              {formatTime(timeLeft)}
            </motion.div>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md mx-auto">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                style={{ width: `${progress}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Current Intention */}
          {currentIntention && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 max-w-md"
            >
              <p className="text-blue-300 text-sm mb-2">Seu objetivo:</p>
              <p className="text-white text-lg font-medium">{currentIntention}</p>
              <p className="text-purple-300 text-sm mt-2">Matéria: {currentSubject}</p>
            </motion.div>
          )}

          {/* Control Button */}
          <Button
            size="lg"
            onClick={toggleTimer}
            className="w-48 h-16 text-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-2xl shadow-blue-500/50"
          >
            {isRunning ? (
              <>
                <Pause className="w-6 h-6 mr-2" />
                Pausar
              </>
            ) : (
              <>
                <Play className="w-6 h-6 mr-2" />
                Iniciar
              </>
            )}
          </Button>

          {/* Motivational Quote */}
          {!isRunning && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-blue-300/80 max-w-md mx-auto italic"
            >
              "O sucesso é a soma de pequenos esforços repetidos dia após dia."
            </motion.p>
          )}
        </motion.div>

        {/* Bottom Tips */}
        {isRunning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 text-center"
          >
            <p className="text-blue-300/60 text-sm">
              💡 Dica: Elimine distrações e mantenha o foco total nos próximos{' '}
              {Math.ceil(timeLeft / 60)} minutos
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
