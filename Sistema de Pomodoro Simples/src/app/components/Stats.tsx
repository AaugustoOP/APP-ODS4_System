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
      label: 'Tempo Total',
      value: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`,
    },
    {
      icon: TrendingUp,
      label: 'Meta Diária',
      value: `${Math.min(completedPomodoros, 8)}/8`,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
            className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#6B7C5C] to-[#8B9A7A]">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-neutral-500 dark:text-neutral-500 text-sm mb-0.5">
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