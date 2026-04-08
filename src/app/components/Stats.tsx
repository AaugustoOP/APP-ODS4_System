import { TrendingUp, Clock, Award } from 'lucide-react';
import { motion } from 'motion/react';

interface StatsProps {
  completedPomodoros: number;
  totalStudyTime: number;
}

export function Stats({ completedPomodoros, totalStudyTime }: StatsProps) {
  const hours = Math.floor(totalStudyTime / 60);
  const minutes = totalStudyTime % 60;

  const stats = [
    {
      icon: Award,
      label: 'Pomodoros',
      value: completedPomodoros.toString(),
    },
    {
      icon: Clock,
      label: 'Tempo total',
      value: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`,
    },
    {
      icon: TrendingUp,
      label: 'Meta diaria',
      value: `${Math.min(completedPomodoros, 8)}/8`,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3"
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
            className="rounded-2xl border border-neutral-200/80 bg-white/85 p-6 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.45)] backdrop-blur transition-colors dark:border-neutral-800 dark:bg-neutral-900/90"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-gradient-to-br from-[#6B7C5C] to-[#8B9A7A] p-2.5">
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="mb-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                  {stat.label}
                </div>
                <div className="text-2xl font-light text-neutral-900 dark:text-neutral-50">
                  {stat.value}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
