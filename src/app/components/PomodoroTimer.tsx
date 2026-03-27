import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

interface PomodoroTimerProps {
  onPomodoroComplete: () => void;
}

const TIMER_CONFIGS = {
  focus: { duration: 25 * 60, label: 'Foco' },
  shortBreak: { duration: 5 * 60, label: 'Pausa Curta' },
  longBreak: { duration: 15 * 60, label: 'Pausa Longa' },
};

export function PomodoroTimer({ onPomodoroComplete }: PomodoroTimerProps) {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(TIMER_CONFIGS.focus.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [completedCycles, setCompletedCycles] = useState(0);

  useEffect(() => {
    setTimeLeft(TIMER_CONFIGS[mode].duration);
    setIsRunning(false);
  }, [mode]);

  useEffect(() => {
    let interval: number | undefined;

    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    playNotificationSound();
    
    if (mode === 'focus') {
      onPomodoroComplete();
      const newCycles = completedCycles + 1;
      setCompletedCycles(newCycles);
      
      if (newCycles % 4 === 0) {
        setMode('longBreak');
      } else {
        setMode('shortBreak');
      }
    } else {
      setMode('focus');
    }
  };

  const playNotificationSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(TIMER_CONFIGS[mode].duration);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((TIMER_CONFIGS[mode].duration - timeLeft) / TIMER_CONFIGS[mode].duration) * 100;

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="bg-neutral-50 dark:bg-neutral-900 rounded-3xl p-8 md:p-12 border border-neutral-200 dark:border-neutral-800 transition-colors"
    >
      {/* Mode Selector */}
      <div className="flex gap-3 mb-12 justify-center">
        {(Object.keys(TIMER_CONFIGS) as TimerMode[]).map((m) => {
          const config = TIMER_CONFIGS[m];
          return (
            <button
              key={m}
              onClick={() => !isRunning && setMode(m)}
              disabled={isRunning}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                mode === m
                  ? 'bg-[#6B7C5C] text-white shadow-lg shadow-[#6B7C5C]/20'
                  : 'bg-transparent text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-900'
              } ${isRunning ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}`}
            >
              {config.label}
            </button>
          );
        })}
      </div>

      {/* Timer Display */}
      <div className="relative mb-12">
        <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
          {/* Progress Circle Background */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              stroke="currentColor"
              className="text-neutral-200 dark:text-neutral-800"
              strokeWidth="2"
              fill="none"
            />
            <motion.circle
              cx="50%"
              cy="50%"
              r="45%"
              stroke="currentColor"
              className="text-neutral-900 dark:text-neutral-50"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDasharray: `0 1000` }}
              animate={{ 
                strokeDasharray: `${progress * 10} 1000` 
              }}
              transition={{ duration: 0.5 }}
            />
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              key={mode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="text-6xl md:text-7xl font-light text-neutral-900 dark:text-neutral-50 tabular-nums mb-2">
                {formatTime(timeLeft)}
              </div>
              <div className="text-neutral-500 dark:text-neutral-500 text-sm">
                {TIMER_CONFIGS[mode].label}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 justify-center mb-8">
        <button
          onClick={toggleTimer}
          className="flex items-center gap-2 px-8 py-3 bg-[#6B7C5C] hover:bg-[#5a6b4d] text-white rounded-full font-medium transition-colors shadow-lg shadow-[#6B7C5C]/20"
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4" />
              <span>Pausar</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Iniciar</span>
            </>
          )}
        </button>

        <button
          onClick={resetTimer}
          className="flex items-center gap-2 px-6 py-3 bg-transparent text-neutral-600 dark:text-neutral-400 rounded-full font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors border border-neutral-200 dark:border-neutral-800"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Resetar</span>
        </button>
      </div>

      {/* Cycle Counter */}
      <div className="text-center">
        <div className="inline-flex gap-2 mb-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i < completedCycles % 4 
                  ? 'bg-[#6B7C5C]' 
                  : 'bg-neutral-300 dark:bg-neutral-700'
              }`}
            />
          ))}
        </div>
        <p className="text-neutral-500 dark:text-neutral-500 text-xs">
          {completedCycles % 4}/4 até pausa longa
        </p>
      </div>
    </motion.div>
  );
}