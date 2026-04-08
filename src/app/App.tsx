import { useState } from 'react';
import { PomodoroTimer } from './components/PomodoroTimer';
import { Stats } from './components/Stats';
import { ThemeProvider } from './components/ThemeProvider';
import { ThemeToggle } from './components/ThemeToggle';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

export default function App() {
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [totalStudyTime, setTotalStudyTime] = useState(0);

  const handlePomodoroComplete = () => {
    setCompletedPomodoros(prev => prev + 1);
    setTotalStudyTime(prev => prev + 25);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(107,124,92,0.14),_transparent_32%),linear-gradient(180deg,_#f8faf7_0%,_#ffffff_45%,_#f4f7f2_100%)] dark:bg-[radial-gradient(circle_at_top,_rgba(107,124,92,0.12),_transparent_30%),linear-gradient(180deg,_#171717_0%,_#0a0a0a_100%)] transition-colors duration-300 flex flex-col">
        <Header />
        <ThemeToggle />
        
        <main className="flex-1">
          <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
            {/* <section className="mb-8 md:mb-10">
              <div>
                <p className="inline-flex items-center rounded-full border border-[#6B7C5C]/20 bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#6B7C5C] shadow-sm backdrop-blur dark:border-[#8B9A7A]/20 dark:bg-white/5 dark:text-[#A8BD95]">
                  Rotina de foco
                </p>
                <h2 className="mt-4 max-w-6xl text-3xl font-semibold tracking-tight text-neutral-950 dark:text-white md:text-5xl">
                  Organize seus ciclos de estudo com uma interface clara e objetiva.
                </h2>
                <p className="mt-4 max-w-4xl text-base leading-7 text-neutral-600 dark:text-neutral-300 md:text-lg">
                  Use sessoes de foco, pausas curtas e pausas longas para manter constancia, acompanhar progresso diario e sustentar uma rotina de aprendizagem mais saudavel.
                </p>
              </div>
            </section> */}
            <PomodoroTimer onPomodoroComplete={handlePomodoroComplete} />
            <Stats completedPomodoros={completedPomodoros} totalStudyTime={totalStudyTime} />
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}
