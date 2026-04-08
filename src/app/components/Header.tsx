import { GraduationCap, Target, Brain } from 'lucide-react';
import { motion } from 'motion/react';

export function Header() {
  return (
    <header className="border-b border-neutral-200/80 bg-white/80 backdrop-blur transition-colors dark:border-neutral-800/80 dark:bg-neutral-950/80">
      <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4"
          >
            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6B7C5C] to-[#8B9A7A] shadow-lg">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#6B7C5C]">
                <span className="text-xs font-bold text-white">4</span>
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-light tracking-tight text-neutral-900 dark:text-neutral-50 md:text-4xl">
                Pomodoro <span className="text-[#6B7C5C]">Focus</span>
              </h1>
              <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                Educacao de qualidade atraves do foco
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3"
          >
            <a
              href="https://brasil.un.org/pt-br/sdgs/4"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white/90 px-4 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              <GraduationCap className="h-4 w-4 text-[#6B7C5C]" />
              <span>ODS 4</span>
            </a>
            <div className="flex items-center gap-2 rounded-full border border-[#6B7C5C]/20 bg-[#6B7C5C]/10 px-4 py-2.5">
              <Target className="h-4 w-4 text-[#6B7C5C]" />
              <span className="text-sm font-medium text-[#6B7C5C]">Educacao</span>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
