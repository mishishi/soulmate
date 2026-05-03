import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { chatWithSoulmate, SoulCoreType } from '../services/geminiService';
import { getResonance, updateResonance } from '../services/ResonanceService';

const suggestOptions = ['感到平静', '有些疲惫', '正在沉思'];

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function Bond() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [core, setCore] = useState<SoulCoreType>('wise');
  const [resonance, setResonance] = useState(getResonance());
  const [gainVisible, setGainVisible] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedCore = localStorage.getItem('soul_core') as SoulCoreType;
    if (savedCore) setCore(savedCore);

    // Initial greeting based on persona
    const greetings: Record<SoulCoreType, string> = {
      wise: '此时此刻，你的世界里流淌着怎样的旋律？我在这里等候你的回响。',
      playful: '嘿！捕捉到一个正在思考的你。今天有什么新鲜的小事想跟我分享吗？',
      silent: '我在这里。陪你。'
    };
    setMessages([{ role: 'model', text: greetings[savedCore || 'wise'] }]);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', text: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setGainVisible(true);
    setTimeout(() => setGainVisible(false), 2000);

    // Dynamic resonance increase
    const newResonance = updateResonance(1);
    setResonance(newResonance);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await chatWithSoulmate(messageText, core, history);
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  return (
    <div className="pt-24 px-8 max-w-4xl mx-auto flex flex-col items-center min-h-[calc(100vh-80px)]">
      {/* Emotional Resonance Bar */}
      <div className="w-full max-w-[600px] mb-8">
        <div className="flex justify-between items-end mb-2 px-2">
          <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">情感共鸣</span>
          <span className="text-[10px] font-bold text-secondary">{resonance}%</span>
        </div>
        <div className="h-2 w-full bg-surface-container-low rounded-full overflow-hidden border border-white/40 shadow-inner">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${resonance}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-secondary-fixed-dim/60 to-secondary-container relative"
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </motion.div>
        </div>
      </div>

      {/* AI Visual Avatar Centerpiece */}
      <div className="w-full max-w-[700px] mb-12 flex flex-col items-center">
        <div className="relative w-40 h-40 flex items-center justify-center">
          {/* Outer glow rings */}
          <motion.div 
            animate={{ 
              scale: isLoading ? [1, 1.3, 1] : [1, 1.1, 1],
              opacity: isLoading ? [0.2, 0.6, 0.2] : [0.1, 0.3, 0.1]
            }}
            transition={{ duration: isLoading ? 2 : 5, repeat: Infinity }}
            className="absolute inset-0 bg-primary-container rounded-full blur-3xl"
          />
          
          <motion.div 
            animate={{ 
              rotate: 360,
              scale: isLoading ? 1.1 : 1
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="relative w-24 h-24 glass-pane rounded-full border-white/60 shadow-[0_0_50px_rgba(167,166,209,0.3)] flex items-center justify-center z-10"
          >
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-primary-container/20 via-white/40 to-secondary-container/20 overflow-hidden flex items-center justify-center">
                <Sparkles className={cn(
                  "w-10 h-10 transition-colors duration-1000",
                  isLoading ? "text-primary animate-pulse" : "text-indigo-300"
                )} />
            </div>
          </motion.div>

          {/* Orbital path */}
          <div className={cn(
            "absolute inset-[-10px] border border-white/10 rounded-full",
            isLoading ? "animate-[spin_4s_linear_infinite]" : "animate-[spin_12s_linear_infinite]"
          )} />
        </div>
      </div>

      {/* Chat Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 w-full max-w-[700px] overflow-y-auto space-y-6 mb-8 scroll-smooth pr-2 custom-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div 
              key={idx}
              initial={{ x: msg.role === 'user' ? 20 : -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}
            >
              <div className={cn(
                "glass-pane p-5 rounded-3xl max-w-[85%] shadow-sm text-on-surface leading-relaxed",
                msg.role === 'user' 
                  ? "bg-white/60 rounded-tr-none border-primary-container/20 text-on-surface-variant" 
                  : "bg-surface-container-low/40 rounded-tl-none border-white/50"
              )}>
                {msg.text}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="glass-pane p-4 rounded-3xl rounded-tl-none bg-surface-container-low/40 border-white/50 flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                <span className="text-xs text-outline font-medium">正在感应...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-[700px] mb-12"
      >
        <div className="flex items-center justify-between mb-4 px-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">共鸣频率同步中...</span>
          </div>
          <div className="text-[10px] font-bold text-outline uppercase tracking-widest relative">
            Level 2 <span className="opacity-40 mx-1">/</span> {resonance}%
            <AnimatePresence>
              {gainVisible && (
                <motion.span 
                  initial={{ y: 0, opacity: 0 }}
                  animate={{ y: -20, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute right-0 top-0 text-emerald-500 font-bold whitespace-nowrap"
                >
                  +1.2% Resonance
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="relative flex items-center mb-4 group">
          <input 
            className="w-full h-16 pl-8 pr-16 rounded-full bg-surface-container-low border-none focus:ring-2 focus:ring-secondary-fixed-dim/50 text-on-surface placeholder:text-outline shadow-[inset_0_2px_8px_rgba(0,0,0,0.03)] focus:shadow-xl transition-all outline-none" 
            placeholder="分享你的想法..." 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend('')}
          />
          <motion.button 
            whileHover={{ scale: 1.15, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSend('')}
            disabled={isLoading}
            className="absolute right-3 w-10 h-10 rounded-full bg-gradient-to-tr from-secondary to-primary-container text-white flex items-center justify-center shadow-lg disabled:opacity-50 transition-all"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3">
          {suggestOptions.map(opt => (
            <motion.button 
              whileHover={{ y: -2, backgroundColor: "rgba(255, 255, 255, 0.6)" }}
              whileTap={{ scale: 0.95 }}
              key={opt}
              disabled={isLoading}
              onClick={() => handleSend(opt)}
              className="px-5 py-2 glass-pane rounded-full text-xs font-bold text-secondary border-white/40 transition-all disabled:opacity-50 shadow-sm hover:shadow-md"
            >
              {opt}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
