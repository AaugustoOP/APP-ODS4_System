import { Heart, Github, Leaf } from 'lucide-react';
import { motion } from 'motion/react';

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 transition-colors mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left Side - Made with love */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400"
          >
            <span>Feito com</span>
            <Heart className="w-4 h-4 text-[#6B7C5C] fill-[#6B7C5C]" />
            <span>para Educação de Qualidade</span>
          </motion.div>

          {/* Center - ODS Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <a
              href="https://brasil.un.org/pt-br/sdgs/4"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#6B7C5C]/10 to-[#8B9A7A]/10 dark:from-[#6B7C5C]/20 dark:to-[#8B9A7A]/20 border border-[#6B7C5C]/30 hover:border-[#6B7C5C]/50 transition-colors cursor-pointer"
            >
              <Leaf className="w-4 h-4 text-[#6B7C5C]" />
              <span className="text-sm font-medium text-[#6B7C5C]">
                Contribuindo para os ODS da ONU
              </span>
            </a>
          </motion.div>

          {/* Right Side - Year */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm text-neutral-600 dark:text-neutral-400"
          >
            2026 © Pomodoro Focus
          </motion.div>
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800"
        >
          <p className="text-xs text-center text-neutral-500 dark:text-neutral-500">
            A técnica Pomodoro foi desenvolvida por Francesco Cirillo no final dos anos 1980. 
            Este projeto tem como objetivo promover a <span className="text-[#6B7C5C] font-medium">educação de qualidade e acessível</span> para todos.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}