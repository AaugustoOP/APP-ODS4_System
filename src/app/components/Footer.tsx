import { Heart, Leaf } from 'lucide-react';
import { motion } from 'motion/react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-neutral-200/80 bg-white/80 backdrop-blur transition-colors dark:border-neutral-800/80 dark:bg-neutral-950/80">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400"
          >
            <span>Feito com</span>
            <Heart className="h-4 w-4 fill-[#6B7C5C] text-[#6B7C5C]" />
            <span>para educacao de qualidade</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <a
              href="https://brasil.un.org/pt-br/sdgs/4"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-[#6B7C5C]/30 bg-gradient-to-r from-[#6B7C5C]/10 to-[#8B9A7A]/10 px-4 py-2 text-sm font-medium text-[#6B7C5C] transition-colors hover:border-[#6B7C5C]/50 dark:from-[#6B7C5C]/20 dark:to-[#8B9A7A]/20"
            >
              <Leaf className="h-4 w-4 text-[#6B7C5C]" />
              <span>Contribuindo para os ODS da ONU</span>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm text-neutral-600 dark:text-neutral-400"
          >
            2026 | Pomodoro Focus
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 border-t border-neutral-200 pt-6 dark:border-neutral-800"
        >
          <p className="text-center text-xs text-neutral-500 dark:text-neutral-500">
            A tecnica Pomodoro foi desenvolvida por Francesco Cirillo no final dos anos 1980.
            {' '}Este projeto busca promover uma <span className="font-medium text-[#6B7C5C]">educacao de qualidade e acessivel</span> para todos.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
