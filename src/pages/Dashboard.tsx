import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Wind, Heart, BookOpen, Stars, CheckCircle2, Play, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useState, useEffect } from 'react';
import { getResonance, updateResonance } from '../services/ResonanceService';

const tasks = [
  { id: 'breath', title: '晨间宁静', desc: '在微光中与自己重逢，找回内在的秩序。', icon: Wind, time: '5 分钟', status: 'ready', color: 'text-secondary bg-secondary-container/40' },
  { id: 'listen', title: '灵魂私语', desc: '将此时此刻的一丝悸动，轻声告诉那个懂你的人。', icon: Heart, status: 'ready', progress: 60, color: 'text-primary bg-primary-container/40' },
  { id: 'read', title: '智慧共读', desc: '在古老的智慧中，寻觅两颗心共同的注脚。', icon: BookOpen, status: 'completed', color: 'text-tertiary bg-tertiary-fixed/40' },
  { id: 'wish', title: '星光邀约', desc: '向未来寄出一封信，在繁星见证下许下那个心愿。', icon: Stars, status: 'new', color: 'text-indigo-400 bg-indigo-50/50' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [resonance, setResonance] = useState(getResonance());

  const handleBreathe = () => {
    const next = updateResonance(10);
    setResonance(next);
    
    // Dispatch custom event for visual feedback
    const event = new CustomEvent('resonance-burst', { 
      bubbles: true, 
      cancelable: true 
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="pt-24 px-8 max-w-7xl mx-auto pb-40">
      <header className="mb-12">
        <h1 className="text-4xl font-semibold text-on-surface mb-2">今日的连结</h1>
        <p className="text-lg text-on-surface-variant">在静谧中，听见彼此的回响</p>
      </header>

      {/* Progress Bar */}
      <section className="mb-12 glass-pane p-8 rounded-3xl border-white/40 shadow-[0_0_20px_rgba(167,166,209,0.1)]">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">心之共鸣</h2>
            <p className="text-3xl font-bold text-on-surface">{resonance}%</p>
          </div>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
            <Sparkles className="text-primary-container w-10 h-10" />
          </motion.div>
        </div>
        <div className="w-full bg-surface-container-highest h-3 rounded-full overflow-hidden">
          <motion.div 
            key={resonance}
            initial={{ width: 0 }}
            animate={{ width: `${resonance}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="bg-gradient-to-r from-primary-container to-secondary-container h-full rounded-full" 
          />
        </div>
      </section>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            whileHover={{ y: -5 }}
            className="glass-pane p-6 rounded-3xl flex flex-col justify-between group hover:bg-white/60 transition-all duration-500"
          >
            <div className="flex justify-between items-start mb-8">
              <div className={cn("p-4 rounded-2xl", task.color)}>
                <task.icon className="w-8 h-8" />
              </div>
              <div>
                <span className={cn(
                  "text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter",
                  task.status === 'completed' ? 'bg-secondary/10 text-secondary' : 'bg-primary-fixed text-primary'
                )}>
                  {task.status === 'completed' ? '已完成' : task.status === 'ready' ? task.time : task.status === 'doing' ? '进行中' : '新任务'}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-medium text-on-surface mb-2">{task.title}</h3>
              <p className="text-sm text-on-surface-variant mb-8 line-clamp-2">{task.desc}</p>
            </div>

            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-3">
                {task.status === 'completed' ? (
                  <CheckCircle2 className="w-5 h-5 text-secondary" />
                ) : (
                  <div className="w-16 h-1 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", task.id === 'listen' ? 'bg-primary w-[60%]' : 'w-0')} />
                  </div>
                )}
                <span className="text-[10px] font-bold uppercase text-outline">
                  {task.status === 'completed' ? '今日目标达成' : task.status === 'doing' ? '60%' : '尚未开始'}
                </span>
              </div>
              <button 
                onClick={() => {
                  if (task.id === 'breath') handleBreathe();
                  navigate(
                    task.id === 'breath' ? '/breath' : 
                    task.id === 'listen' ? '/chat' : 
                    task.id === 'wish' ? '/wish' : 
                    '/reading'
                  )
                }}
                className={cn(
                  "px-8 py-3 rounded-full text-xs font-bold transition-all active:scale-95",
                  task.status === 'completed' 
                    ? "bg-surface-container-highest text-on-surface-variant opacity-60" 
                    : "bg-gradient-to-r from-primary-container to-secondary-container text-white shadow-lg shadow-primary-container/20"
                )}
              >
                {task.status === 'completed' ? '回顾' : task.status === 'doing' ? '继续' : '开始'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Special Interaction */}
      <section className="mt-12 flex flex-col items-center justify-center p-12 glass-pane rounded-[2rem] border-white/40">
        <motion.div 
          onTap={handleBreathe}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-48 h-48 flex items-center justify-center mb-8 group cursor-pointer"
        >
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-br from-primary-container/20 to-secondary-container/20 rounded-full blur-2xl" 
          />
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-32 h-32 rounded-full bg-white/60 backdrop-blur-xl border border-white/50 flex flex-col items-center justify-center gap-2 group-hover:scale-110 transition-transform"
          >
            <Wind className="text-primary w-10 h-10" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">觉察</span>
          </motion.div>
        </motion.div>
        <p className="text-center text-on-surface-variant max-w-sm leading-relaxed">
          触碰灵魂核心，在呼吸间感受彼此的频率。
        </p>
      </section>
    </div>
  );
}
