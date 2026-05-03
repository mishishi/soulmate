import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Quote, Sparkles, Brain, ChevronLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getWisdomReflection, SoulCoreType } from '../services/geminiService';

const dailyQuote = {
  text: "万物皆有裂痕，那是光照进来的地方。",
  author: "莱昂纳德·科恩"
};

export default function SharedReading() {
  const navigate = useNavigate();
  const [reflection, setReflection] = useState('这段文字中有光，我能感受到它照亮了我们的连接。');
  const [isLoading, setIsLoading] = useState(false);

  const fetchReflection = async () => {
    setIsLoading(true);
    const core = (localStorage.getItem('soul_core') as SoulCoreType) || 'wise';
    const response = await getWisdomReflection(dailyQuote.text, core);
    if (response) setReflection(response);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchReflection();
  }, []);

  return (
    <div className="pt-24 px-8 max-w-md mx-auto flex flex-col gap-12 pb-40">
      <button 
        onClick={() => navigate(-1)}
        className="fixed top-20 left-4 z-40 w-10 h-10 rounded-full glass-pane flex items-center justify-center text-primary-container hover:bg-white transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Progress */}
      <section className="flex flex-col gap-3 items-center">
        <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '65%' }}
            className="bg-primary h-full rounded-full shadow-[0_0_12px_rgba(91,91,129,0.3)]" 
          />
        </div>
        <div className="flex justify-between w-full px-1 text-[10px] font-bold text-outline uppercase tracking-wider">
          <span>今日进度 65%</span>
          <span>共读第 12 天</span>
        </div>
      </section>

      {/* Wisdom Card */}
      <motion.article 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-pane p-12 rounded-[2rem] flex flex-col gap-8 relative overflow-hidden text-center"
      >
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/5 blur-3xl rounded-full" />
        <Quote className="text-primary/20 w-12 h-12 mx-auto" />
        
        <div className="space-y-8">
          <h2 className="text-2xl font-medium text-on-surface-variant italic">共读时光</h2>
          <div className="space-y-4">
            <p className="text-xl text-on-surface leading-loose">
              “{dailyQuote.text}”
            </p>
            <p className="text-[10px] font-bold text-outline uppercase tracking-[0.3em]">— {dailyQuote.author}</p>
          </div>
        </div>

        <div className="pt-8 border-t border-white/20">
          <p className="text-on-surface-variant/80 italic leading-relaxed text-sm">
            不完美并非遗憾，而是我们与世界建立联系的开始。
          </p>
        </div>
      </motion.article>

      {/* Interaction Orb */}
      <section className="flex flex-col items-center gap-6">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-tr from-primary-container to-secondary-container rounded-full blur-2xl" 
          />
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchReflection}
            className="relative w-32 h-32 rounded-full bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl flex flex-col items-center justify-center gap-2 group transition-all"
          >
            {isLoading ? <Loader2 className="animate-spin text-primary w-8 h-8" /> : <Sparkles className="text-primary w-8 h-8 group-hover:scale-110 transition-transform" />}
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{isLoading ? '感悟中' : '感悟'}</span>
          </motion.button>
        </div>
        <p className="text-[10px] font-bold text-outline uppercase text-center px-8 tracking-widest">
          {isLoading ? '正在深层感应文字的回响...' : '点击上方光团，听听我的想法'}
        </p>
      </section>

      {/* Reflection Card */}
      <AnimatePresence mode="wait">
        <motion.section 
          key={reflection}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass-pane p-8 rounded-3xl border-l-4 border-secondary/30 flex gap-6"
        >
          <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
            <Brain className="text-secondary w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold text-secondary uppercase tracking-widest">灵魂伴侣的私语</h4>
            <p className="text-on-surface-variant leading-relaxed text-sm">
              {reflection}
            </p>
          </div>
        </motion.section>
      </AnimatePresence>
    </div>
  );
}
