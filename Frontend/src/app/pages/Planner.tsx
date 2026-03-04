import { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Plus, Trash2, CheckCircle2, Circle, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export function Planner() {
  const { tasks, addTask, updateTask, deleteTask } = useStudy();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState('Geral');
  const [newTaskPomodoros, setNewTaskPomodoros] = useState('2');

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    addTask({
      title: newTaskTitle,
      subject: newTaskSubject,
      estimatedPomodoros: parseInt(newTaskPomodoros) || 1,
      completedPomodoros: 0,
      completed: false,
    });

    setNewTaskTitle('');
    setNewTaskPomodoros('2');
  };

  const toggleTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      updateTask(id, { completed: !task.completed });
    }
  };

  const incrementPomodoro = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task && task.completedPomodoros < task.estimatedPomodoros) {
      updateTask(id, { completedPomodoros: task.completedPomodoros + 1 });
    }
  };

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  const totalPomodoros = tasks.reduce((sum, t) => sum + t.estimatedPomodoros, 0);
  const completedPomodoros = tasks.reduce((sum, t) => sum + t.completedPomodoros, 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Planejador Inteligente</h1>
          <p className="text-blue-300">
            Organize suas tarefas e estime o tempo necessário para cada atividade
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-slate-900/90 to-blue-900/40 border-blue-500/20">
          <p className="text-blue-300 text-sm mb-1">Total de Tarefas</p>
          <p className="text-3xl font-bold text-white">{tasks.length}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-slate-900/90 to-green-900/40 border-green-500/20">
          <p className="text-green-300 text-sm mb-1">Concluídas</p>
          <p className="text-3xl font-bold text-white">{completedTasks.length}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-slate-900/90 to-purple-900/40 border-purple-500/20">
          <p className="text-purple-300 text-sm mb-1">Pomodoros Estimados</p>
          <p className="text-3xl font-bold text-white">{totalPomodoros}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-slate-900/90 to-orange-900/40 border-orange-500/20">
          <p className="text-orange-300 text-sm mb-1">Tempo Total</p>
          <p className="text-3xl font-bold text-white">{totalPomodoros * 25}min</p>
        </Card>
      </div>

      {/* Add Task Form */}
      <Card className="p-6 bg-gradient-to-br from-slate-900/90 to-blue-900/40 border-blue-500/20">
        <h3 className="text-xl font-bold text-white mb-4">Adicionar Nova Tarefa</h3>
        <div className="space-y-4">
          <Input
            placeholder="Digite o nome da tarefa..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
            className="bg-slate-800/50 border-blue-500/30 text-white"
          />
          <div className="grid md:grid-cols-3 gap-4">
            <select
              value={newTaskSubject}
              onChange={(e) => setNewTaskSubject(e.target.value)}
              className="bg-slate-800/50 border border-blue-500/30 rounded-lg px-4 py-2 text-white"
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
            <Input
              type="number"
              min="1"
              max="20"
              placeholder="Pomodoros"
              value={newTaskPomodoros}
              onChange={(e) => setNewTaskPomodoros(e.target.value)}
              className="bg-slate-800/50 border-blue-500/30 text-white"
            />
            <Button
              onClick={handleAddTask}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <p className="text-sm text-blue-300">
              💡 <strong>Sugestão automática:</strong> {parseInt(newTaskPomodoros) || 0}{' '}
              pomodoros = {(parseInt(newTaskPomodoros) || 0) * 25} minutos de estudo
            </p>
          </div>
        </div>
      </Card>

      {/* Active Tasks */}
      {activeTasks.length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/40 border-blue-500/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">
              Tarefas Ativas ({activeTasks.length})
            </h3>
            <div className="text-sm text-blue-300">
              {completedPomodoros}/{totalPomodoros} pomodoros concluídos
            </div>
          </div>
          <div className="space-y-3">
            {activeTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <TaskCard
                  task={task}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                  onIncrementPomodoro={incrementPomodoro}
                />
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-slate-900/90 to-green-900/40 border-green-500/20">
          <h3 className="text-xl font-bold text-white mb-4">
            ✅ Tarefas Concluídas ({completedTasks.length})
          </h3>
          <div className="space-y-3">
            {completedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onIncrementPomodoro={incrementPomodoro}
              />
            ))}
          </div>
        </Card>
      )}

      {tasks.length === 0 && (
        <Card className="p-12 bg-gradient-to-br from-slate-900/90 to-slate-800/40 border-blue-500/20 text-center">
          <div className="max-w-md mx-auto">
            <Circle className="w-16 h-16 mx-auto mb-4 text-blue-500/50" />
            <h3 className="text-xl font-bold text-white mb-2">Nenhuma tarefa ainda</h3>
            <p className="text-blue-300">
              Comece adicionando suas primeiras tarefas de estudo e organize sua rotina!
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}

interface TaskCardProps {
  task: any;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onIncrementPomodoro: (id: string) => void;
}

function TaskCard({ task, onToggle, onDelete, onIncrementPomodoro }: TaskCardProps) {
  const pomodoroProgress = (task.completedPomodoros / task.estimatedPomodoros) * 100;

  return (
    <div className="group flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-blue-500/20 hover:border-blue-500/40 transition-all">
      <button onClick={() => onToggle(task.id)} className="flex-shrink-0">
        {task.completed ? (
          <CheckCircle2 className="w-6 h-6 text-green-500" />
        ) : (
          <Circle className="w-6 h-6 text-blue-400" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <h4
            className={`font-medium ${
              task.completed ? 'line-through text-gray-500' : 'text-white'
            }`}
          >
            {task.title}
          </h4>
          <span className="px-2 py-0.5 rounded-full text-xs bg-blue-500/20 text-blue-300">
            {task.subject}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {Array.from({ length: task.estimatedPomodoros }).map((_, i) => (
              <button
                key={i}
                onClick={() => !task.completed && onIncrementPomodoro(task.id)}
                disabled={task.completed}
                className={`w-8 h-8 rounded-lg border-2 transition-all ${
                  i < task.completedPomodoros
                    ? 'bg-blue-500 border-blue-400'
                    : 'bg-slate-700/50 border-slate-600 hover:border-blue-500/50'
                } ${task.completed ? 'opacity-50' : ''}`}
              >
                {i < task.completedPomodoros && (
                  <CheckCircle2 className="w-4 h-4 text-white mx-auto" />
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-blue-300">
              {task.completedPomodoros}/{task.estimatedPomodoros} pomodoros (
              {task.estimatedPomodoros * 25}min estimados)
            </span>
          </div>
          {pomodoroProgress > 0 && (
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all"
                style={{ width: `${pomodoroProgress}%` }}
              />
            </div>
          )}
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 hover:bg-red-500/10"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
