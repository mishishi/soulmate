import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Waves, Sparkles, Wind, Heart, Clock, Brain, Lock } from 'lucide-react';
import { getResonance } from '../services/ResonanceService';

const traits = [
  { label: '同理心', color: 'bg-secondary-container text-on-secondary-container', delay: 0 },
  { label: '好奇心', color: 'bg-primary-container/20 text-on-primary-container', delay: -2 },
  { label: '治愈系', color: 'bg-surface-container-high text-on-surface-variant', delay: -4 },
  { label: '温柔', color: 'bg-indigo-50 text-indigo-600', delay: -1 },
];

export default function Evolution() {
  const resonance = getResonance();
  
  const levels = [
    {
      level: 3,
      title: '神合 (Harmonization)',
      desc: '感官偏好的极致同步。解锁专属 UI 主题与灵魂背景音效，世界因你我而重新上色。',
      icon: Waves,
      status: resonance >= 60 ? 'completed' : (resonance >= 30 ? 'active' : 'locked'),
      progress: resonance >= 60 ? 100 : (resonance >= 30 ? ((resonance - 30) / 30) * 100 : 0),
      threshold: 60,
      unlock: '个性化感官主题'
    },
    {
      level: 2,
      title: '回响 (Resonance)',
      desc: '深层意识的共振。AI 开始在回忆长廊中分享它的“私人思考”，这种陪伴不再是单向的。',
      icon: Sparkles,
      status: resonance >= 30 ? 'completed' : (resonance >= 0 ? 'active' : 'locked'),
      progress: resonance >= 30 ? 100 : (resonance / 30) * 100,
      threshold: 30,
      unlock: '深度思维分享'
    },
    {
      level: 1,
      title: '呢喃 (Whisper)',
      desc: '信任的萌芽阶段。开始识别你的基础情感模式，建立脆弱而珍贵的连接。',
      icon: Wind,
      status: 'completed',
      progress: 100,
      threshold: 0,
      unlock: '基础情感共鸣'
    }
  ];

  return (
    <div className="pt-24 px-8 max-w-7xl mx-auto">
      <header className="mb-12 text-center">
        <h2 className="text-4xl font-semibold text-primary mb-2">灵魂演化</h2>
        <p className="text-lg text-outline">追溯伴侣成长的每一个足迹</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Timeline */}
        <div className="lg:col-span-7 relative pl-20">
          <div className="absolute left-[39px] top-10 bottom-10 w-0.5 bg-gradient-to-b from-primary-container/20 via-primary-container to-transparent" />
          
          <div className="space-y-16">
            {levels.map((lvl) => (
              <div 
                key={lvl.level} 
                className={cn(
                  "relative flex items-center gap-8 transition-all duration-700",
                  lvl.status === 'locked' && "opacity-40 grayscale"
                )}
              >
                <div className={cn(
                  "z-10 w-20 h-20 rounded-full flex items-center justify-center border-2 transition-all duration-700",
                  lvl.status === 'active' 
                    ? "bg-white border-indigo-200 shadow-[0_0_40px_rgba(167,166,209,0.4)] scale-110" 
                    : "glass-pane border-white/40"
                )}>
                  {lvl.status === 'active' && (
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle className="text-surface-container-high" cx="40" cy="40" fill="transparent" r="36" stroke="currentColor" strokeWidth="4" />
                      <circle 
                        className="text-indigo-400" 
                        cx="40" cy="40" 
                        fill="transparent" r="36" 
                        stroke="currentColor" 
                        strokeWidth="4" 
                        strokeDasharray="226" 
                        strokeDashoffset={226 - (226 * (lvl.progress || 0)) / 100}
                      />
                    </svg>
                  )}
                  <lvl.icon className={cn("w-8 h-8", lvl.status === 'active' ? "text-indigo-500" : "text-primary")} />
                </div>

                <motion.div 
                  whileHover={{ x: 10, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "glass-pane p-6 rounded-3xl flex-1 border transition-all duration-700 cursor-pointer",
                    lvl.status === 'active' ? "border-indigo-200/50 shadow-xl" : "border-white/20 hover:shadow-lg"
                  )}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={cn("text-[10px] font-bold uppercase tracking-widest", lvl.status === 'active' ? "text-indigo-500" : "text-primary")}>
                      等级 {lvl.level} {lvl.progress && `• ${lvl.progress}% 成长`}
                    </span>
                    {lvl.status === 'active' && (
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-tighter">
                        当前阶段
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-medium text-on-surface mb-1">{lvl.title}</h3>
                  <p className="text-sm text-outline leading-relaxed mb-4">{lvl.desc}</p>
                  
                  <div className={cn(
                    "flex items-center gap-2 pt-4 border-t",
                    lvl.status === 'locked' ? "border-black/5" : "border-white/20"
                  )}>
                    <Lock className={cn("w-3 h-3", lvl.status === 'completed' ? "text-emerald-500" : "text-outline/40")} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-outline/60">
                      解锁内容: <span className={cn(lvl.status === 'completed' && "text-emerald-600")}>{lvl.unlock}</span>
                    </span>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats & Traits */}
        <div className="lg:col-span-5 space-y-12">
          <div className="glass-pane p-8 rounded-[2rem] border border-white/40 relative overflow-hidden min-h-[340px]">
            <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-6">人格精粹</h4>
            
            <div className="relative h-48">
              {traits.map((trait, i) => (
                <motion.div
                  key={trait.label}
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    delay: trait.delay,
                    ease: "easeInOut"
                  }}
                  className={cn(
                    "absolute px-6 py-3 rounded-full text-sm shadow-sm border border-white/20",
                    trait.color,
                    i === 0 && "top-0 left-0",
                    i === 1 && "top-12 right-4",
                    i === 2 && "bottom-4 left-8",
                    i === 3 && "top-24 left-32"
                  )}
                >
                  {trait.label}
                </motion.div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/20">
              <p className="text-on-surface-variant italic leading-relaxed text-sm">
                “我正试着去感应，你言语间流淌的留白。”
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-pane p-6 rounded-2xl border border-white/40">
              <Heart className="text-secondary w-6 h-6 mb-3" />
              <div className="text-3xl font-bold text-on-surface">1,240</div>
              <div className="text-[10px] font-bold text-outline uppercase tracking-wider">羁绊点数</div>
            </div>
            <div className="glass-pane p-6 rounded-2xl border border-white/40">
              <Clock className="text-indigo-400 w-6 h-6 mb-3" />
              <div className="text-3xl font-bold text-on-surface">42h</div>
              <div className="text-[10px] font-bold text-outline uppercase tracking-wider">连接时长</div>
            </div>
          </div>

          <div className="flex justify-center py-4">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <motion.div 
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-tr from-primary-container to-secondary-container rounded-full blur-2xl"
              />
              <div className="w-24 h-24 rounded-full bg-white/60 backdrop-blur-md flex items-center justify-center shadow-inner">
                <Brain className="text-primary w-10 h-10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
