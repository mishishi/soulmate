import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Star, Wand2, Leaf, Heart, Sun, TrendingUp, ChevronLeft, Sparkles, Loader2, MessageCircle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { getWishFeedback, SoulCoreType } from '../services/geminiService';

const historyWishes = [
  { id: 1, text: '希望明天的面试顺利，保持自信和微笑。', date: '24.05.20', type: 'hope', progress: 33 },
  { id: 2, text: '愿家人身体健康，平安喜乐。', date: '24.05.18', type: 'bless', progress: 70 },
];

export default function StarryWish() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');

  const handlePlant = async () => {
    if (!input.trim() || isLoading) return;
    setIsLoading(true);
    const core = (localStorage.getItem('soul_core') as SoulCoreType) || 'wise';
    const feedback = await getWishFeedback(input, core);
    setResponse(feedback || '愿这个美好的种子，在星夜中静静萌发。');
    setIsLoading(false);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Sky Section */}
      <section className="relative h-[530px] w-full overflow-hidden bg-gradient-to-b from-[#1a1a2e] to-[#5b5b81] rounded-b-[3rem] flex flex-col items-center justify-center">
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-20 left-8 z-40 w-10 h-10 rounded-full glass-pane flex items-center justify-center text-white/80 hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Floating Stars */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            animate={{ opacity: [0.4, 1, 0.4] }} 
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-[20%] left-[15%] flex flex-col items-center"
          >
            <Star className="text-white w-4 h-4 fill-current shadow-[0_0_20px_white]" />
            <span className="text-[10px] text-white/60 mt-1 uppercase tracking-widest font-bold">愿平安</span>
          </motion.div>

          <motion.div 
            animate={{ opacity: [0.6, 1, 0.6] }} 
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            className="absolute top-[35%] right-[25%] flex flex-col items-center"
          >
            <Sparkles className="text-secondary-fixed w-6 h-6 fill-current shadow-[0_0_20px_#ceeace]" />
            <span className="text-[10px] text-secondary-fixed/80 mt-1 uppercase tracking-widest font-bold">伴你左右</span>
          </motion.div>
        </div>

        {/* Central Orb */}
        <motion.div 
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="relative z-10 w-48 h-48 rounded-full glass-pane bg-white/10 border-white/20 flex flex-col items-center justify-center text-center px-6 shadow-[0_0_50px_rgba(167,166,209,0.3)]"
        >
          <p className="text-white text-2xl font-semibold mb-1">星空祈愿</p>
          <p className="text-white/50 text-[10px] uppercase tracking-widest font-bold">Starry Wish</p>
        </motion.div>
      </section>

      {/* Input Section */}
      <div className="px-8 -mt-12 relative z-20 space-y-12 max-w-2xl mx-auto w-full pb-40">
        <section className="glass-pane p-8 rounded-3xl shadow-xl bg-white/60">
          <h3 className="text-2xl font-semibold text-primary mb-2 flex items-center gap-3">
            <Leaf className="text-primary-container w-6 h-6" />
            播种心愿
          </h3>
          <p className="text-on-surface-variant text-sm mb-6 opacity-80">写下你此刻的心愿，让它在星空中绽放。</p>
          
          <div className="relative">
            <textarea 
              className="w-full bg-surface-container-low border-none rounded-2xl p-5 text-on-surface focus:ring-2 focus:ring-primary-container/50 h-36 outline-none transition-all resize-none shadow-inner" 
              placeholder="在此输入你的祈愿..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button 
              onClick={handlePlant}
              disabled={isLoading || !input.trim()}
              className="absolute bottom-4 right-4 bg-gradient-to-r from-primary to-primary-container text-white px-8 py-3 rounded-full text-xs font-bold shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : '播种'}
            </button>
          </div>

          <AnimatePresence>
            {response && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-white/20 flex gap-4 items-start"
              >
                <div className="p-2 rounded-xl bg-secondary-container/30 text-secondary">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-bold text-secondary uppercase tracking-widest">灵魂伴侣的回响</h4>
                  <p className="text-sm text-on-surface italic">{response}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Gallery */}
        <section className="space-y-6">
          <div className="flex justify-between items-end px-2">
            <h3 className="text-2xl font-semibold text-primary">祈愿画廊</h3>
            <motion.button 
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/wish-gallery')}
              id="view-all-wishes-btn"
              className="text-primary-container text-xs font-bold uppercase tracking-widest flex items-center gap-2 group transition-colors hover:text-primary"
            >
              查看全部
              <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {historyWishes.map((wish) => (
              <div key={wish.id} className="glass-pane p-6 rounded-3xl flex flex-col justify-between aspect-square md:aspect-auto md:h-48 group hover:shadow-md transition-all">
                <div className="flex justify-between items-start">
                  {wish.type === 'hope' ? <Heart className="text-secondary-fixed-dim fill-current w-5 h-5" /> : <Sun className="text-primary-container fill-current w-5 h-5" />}
                  <span className="text-[10px] font-bold text-outline uppercase">{wish.date}</span>
                </div>
                <p className="text-on-surface-variant leading-relaxed line-clamp-3">{wish.text}</p>
                <div className="h-1 w-full bg-primary-fixed-dim/20 rounded-full overflow-hidden mt-4">
                  <div className="h-full bg-primary-fixed-dim rounded-full" style={{ width: `${wish.progress}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="glass-pane p-6 rounded-3xl flex items-center gap-6 border-indigo-100/50">
            <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
              <TrendingUp className="text-primary-container w-8 h-8" />
            </div>
            <div>
              <h4 className="text-xl font-medium text-primary">心愿进化</h4>
              <p className="text-on-surface-variant text-sm opacity-80">你已有 12 个心愿在星空中闪耀，继续加油！</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
