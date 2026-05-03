
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

const CORE_THEMES = {
  wise: {
    primary: 'bg-indigo-400/30',
    secondary: 'bg-blue-300/25',
    accent: 'bg-primary-container/20'
  },
  playful: {
    primary: 'bg-rose-400/30',
    secondary: 'bg-amber-300/25',
    accent: 'bg-orange-200/20'
  },
  silent: {
    primary: 'bg-slate-500/30',
    secondary: 'bg-indigo-900/20',
    accent: 'bg-blue-800/15'
  }
};

export default function DynamicBackground() {
  const [core, setCore] = useState('wise');
  const [sensoryMode, setSensoryMode] = useState('minimal');

  useEffect(() => {
    const savedCore = localStorage.getItem('soul_core') || 'wise';
    const savedSensory = localStorage.getItem('sensory_mode') || 'minimal';
    setCore(savedCore);
    setSensoryMode(savedSensory);

    const handleCoreChange = (e: any) => {
      setCore(e.detail);
    };

    const handleSensoryChange = () => {
      const mode = localStorage.getItem('sensory_mode') || 'minimal';
      setSensoryMode(mode);
    };

    window.addEventListener('soul-core-changed', handleCoreChange);
    window.addEventListener('sensory-theme-changed', handleSensoryChange);
    
    return () => {
      window.removeEventListener('soul-core-changed', handleCoreChange);
      window.removeEventListener('sensory-theme-changed', handleSensoryChange);
    };
  }, []);

  const theme = CORE_THEMES[core as keyof typeof CORE_THEMES] || CORE_THEMES.wise;
  const isDeepSea = sensoryMode === 'deepsea';
  const animDuration = isDeepSea ? 8 : 3;
  const animDelayFactor = isDeepSea ? 2 : 1;

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
      <AnimatePresence>
        <motion.div 
          key={`${core}-1-${sensoryMode}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: animDuration }}
          className={`absolute top-[-10%] left-[-10%] w-[60%] h-[60%] ${theme.primary} rounded-full blur-[140px] ${isDeepSea ? 'animate-none' : 'animate-pulse'}`}
          style={isDeepSea ? { opacity: 0.15 } : {}}
        />
      </AnimatePresence>
      
      <AnimatePresence>
        <motion.div 
          key={`${core}-2-${sensoryMode}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: animDuration, delay: 0.2 * animDelayFactor }}
          className={`absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] ${theme.secondary} rounded-full blur-[140px]`}
          style={isDeepSea ? { opacity: 0.1 } : {}}
        />
      </AnimatePresence>

      <AnimatePresence>
        <motion.div 
          key={`${core}-3-${sensoryMode}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: animDuration + 1, delay: 0.5 * animDelayFactor }}
          className={`absolute top-[20%] right-[10%] w-[30%] h-[30%] ${theme.accent} rounded-full blur-[100px]`}
          style={isDeepSea ? { opacity: 0.05 } : {}}
        />
      </AnimatePresence>

      <div className={cn(
        "absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay",
        isDeepSea ? "opacity-[0.01]" : "opacity-[0.03]"
      )} />
    </div>
  );
}
