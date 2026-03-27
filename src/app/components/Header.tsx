import { GraduationCap, Target, Brain } from 'lucide-react';
import { motion } from 'motion/react';

export function Header() {
  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo e Título */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4"
          >
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6B7C5C] to-[#8B9A7A] flex items-center justify-center shadow-lg">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#6B7C5C] rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">4</span>
              </div>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-light text-neutral-900 dark:text-neutral-50 tracking-tight">
                Pomodoro <span className="text-[#6B7C5C]">Focus</span>
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-0.5">
                Educação de Qualidade através do Foco
              </p>
            </div>
          </motion.div>

          {/* ODS Info Cards */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex gap-3"
          >
            <a
              href="https://brasil.un.org/pt-br/sdgs/4"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-[#6B7C5C]" />
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">ODS 4</span>
            </a>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#6B7C5C]/10 dark:bg-[#6B7C5C]/20 border border-[#6B7C5C]/20">
              <Target className="w-4 h-4 text-[#6B7C5C]" />
              <span className="text-sm font-medium text-[#6B7C5C]">Educação</span>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
}