import { useState, useEffect, useRef } from 'react';
import { PomodoroTimer } from './components/PomodoroTimer';
import { Stats } from './components/Stats';
import { ThemeProvider } from './components/ThemeProvider';
import { ThemeToggle } from './components/ThemeToggle';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { motion } from 'motion/react';

export default function App() {
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [totalStudyTime, setTotalStudyTime] = useState(0);

  const handlePomodoroComplete = () => {
    setCompletedPomodoros(prev => prev + 1);
    setTotalStudyTime(prev => prev + 25);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300 flex flex-col">
        <Header />
        <ThemeToggle />
        
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
            <PomodoroTimer onPomodoroComplete={handlePomodoroComplete} />
            <Stats completedPomodoros={completedPomodoros} totalStudyTime={totalStudyTime} />
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}