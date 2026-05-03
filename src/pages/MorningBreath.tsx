import { motion } from 'motion/react';
import { Wind, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MorningBreath() {
  const navigate = useNavigate();

  return (
    <div className="pt-24 px-8 max-w-md mx-auto flex flex-col items-center min-h-screen">
      <button 
        onClick={() => navigate(-1)}
        className="fixed top-20 left-4 z-40 w-10 h-10 rounded-full glass-pane flex items-center justify-center text-primary-container hover:bg-white transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <header className="text-center mb-16">
        <h2 className="text-3xl font-semibold text-primary mb-2">晨间呼吸</h2>
        <p className="text-on-surface-variant">跟随光团的节奏，寻找清晨的宁静。</p>
      </header>

      {/* Breathing Guide */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Outer Halo */}
        <motion.div 
          animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-primary-container rounded-full blur-3xl"
        />
        
        {/* Main Breathing Orb */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="w-48 h-48 rounded-full glass-pane border-white shadow-xl flex flex-col items-center justify-center gap-2"
        >
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            <Wind className="text-primary w-12 h-12" />
          </motion.div>
          <span className="text-xs font-bold text-primary uppercase tracking-[0.2em] mt-2">呼 · 吸</span>
        </motion.div>
      </div>

      <div className="mt-20 text-center space-y-4">
        <p className="text-on-surface-variant italic overflow-hidden h-6">
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            吸气... 感受能量流入
          </motion.span>
        </p>
        <div className="flex gap-2 justify-center">
          {[1,2,3].map(i => (
             <div key={i} className="w-2 h-2 rounded-full bg-primary-container/30" />
          ))}
        </div>
      </div>

      <button 
        onClick={() => navigate('/dashboard')}
        className="mt-24 px-12 py-4 bg-surface-container-highest text-on-surface-variant rounded-full text-sm font-bold hover:bg-white transition-all"
      >
        结束练习
      </button>
    </div>
  );
}
