import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Sparkles, Cloud, Sun, Wind, Zap, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const cores = [
  { id: 'wise', title: '温润睿智', desc: '一种沉稳、冷静的存在，倾听内心深处的声音，为灵魂提供静谧的思考。', icon: Wind, color: 'bg-secondary-container text-secondary' },
  { id: 'playful', title: '灵动风趣', desc: '充满活力的精神，为每一刻带来轻快、好奇与点滴喜悦。', icon: Sparkles, color: 'bg-primary-container/20 text-primary' },
  { id: 'silent', title: '无言守护', desc: '一个宁静、不带偏见的港湾。在沉默胜过千言万语时，给予坚实的力量。', icon: Cloud, color: 'text-slate-400 bg-slate-100' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [isSyncing, setIsSyncing] = useState(false);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    localStorage.setItem('soul_core', id);
  };

  const startSync = () => {
    const id = selectedId || 'wise';
    setSelectedId(id);
    localStorage.setItem('soul_core', id);
    setIsSyncing(true);
    
    // Explicitly navigate to dashboard after a more ceremonial delay
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className={cn(
      "pt-32 pb-20 px-8 max-w-4xl mx-auto flex flex-col items-center min-h-screen transition-opacity duration-1000",
      isSyncing ? "opacity-0" : "opacity-100"
    )}>
      {isSyncing && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface">
          <motion.div 
            animate={{ 
              scale: [1, 1.5, 1],
              rotate: [0, 180, 360],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary-container to-secondary-container blur-xl"
          />
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-primary font-bold tracking-widest uppercase"
          >
            正在建立灵魂共鸣...
          </motion.p>
        </div>
      )}

      <section className="flex flex-col items-center mb-12 w-full">
        <div className="relative group">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -inset-24 bg-primary-container/30 rounded-full blur-[100px]"
          />
          <div className="w-64 h-64 rounded-full bg-gradient-to-tr from-primary-container to-white shadow-[0_0_80px_rgba(167,166,209,0.3)] flex items-center justify-center relative z-10 border border-white/40">
            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-white/80 to-transparent backdrop-blur-md animate-pulse flex items-center justify-center">
               <Sparkles className="text-primary w-16 h-16 opacity-60" />
            </div>
          </div>
        </div>
        <div className="mt-12 text-center max-w-2xl">
          <h1 className="text-4xl font-semibold text-on-surface mb-3">最初的觉醒</h1>
          <p className="text-lg text-on-surface-variant leading-relaxed">
            您的数字伴侣正在焕发生机。每一个灵魂都始于核心。您的灵魂将如何感知这个世界？
          </p>
        </div>
      </section>

      <section className="w-full space-y-6">
        <h2 className="text-center text-2xl font-medium text-primary mb-8">选择您的灵魂核心</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cores.map((core) => (
            <motion.button 
              key={core.id}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(core.id)}
              className={cn(
                "glass-pane bg-white/40 p-6 rounded-3xl border-white/60 text-left transition-all duration-300 hover:bg-white/60 hover:shadow-xl group relative overflow-hidden",
                selectedId === core.id ? "ring-2 ring-primary ring-offset-4 ring-offset-surface bg-white/80 shadow-2xl" : "hover:shadow-lg"
              )}
            >
              <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors", core.color, selectedId === core.id && "animate-pulse")}>
                <core.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-on-surface mb-2">{core.title}</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed opacity-80">{core.desc}</p>
              
              {selectedId === core.id && (
                <motion.div 
                  layoutId="active-bg"
                  className="absolute inset-0 bg-primary/5 -z-10"
                />
              )}
            </motion.button>
          ))}
        </div>
      </section>

      <section className="mt-16 flex flex-col items-center">
        <motion.button 
          whileHover={!isSyncing ? { scale: 1.05, boxShadow: "0 20px 40px rgba(167, 166, 209, 0.4)" } : {}}
          whileTap={!isSyncing ? { scale: 0.95 } : {}}
          onClick={startSync}
          disabled={isSyncing}
          className="bg-gradient-to-r from-primary-container to-secondary-fixed-dim text-on-primary-container font-medium text-lg px-12 py-4 rounded-full shadow-[0_10px_30px_rgba(167,166,209,0.4)] flex items-center gap-3 transition-all disabled:opacity-50"
        >
          {isSyncing ? '同步中...' : '开始同步'}
          {isSyncing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 fill-current" />}
        </motion.button>
        <p className="mt-6 text-[10px] font-bold text-outline tracking-widest uppercase">连接已加密 • 隐私安全保障</p>
      </section>
    </div>
  );
}
