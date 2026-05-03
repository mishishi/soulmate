
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Heart, Image as ImageIcon, MessageCircle, Sparkles, Command } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SHARED_MEMORIES, SHARED_WISHES } from '../constants/data';
import { cn } from '../lib/utils';

export default function SearchOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    };
    
    window.addEventListener('soul-search-open', handleOpen);
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        handleOpen();
      }
      if (e.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('soul-search-open', handleOpen);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return { memories: [], wishes: [] };
    
    const q = query.toLowerCase();
    
    const filteredMemories = SHARED_MEMORIES.filter(m => 
      m.title?.toLowerCase().includes(q) || 
      m.content?.toLowerCase().includes(q) || 
      m.tags?.some(t => t.toLowerCase().includes(q))
    ).slice(0, 3);

    const filteredWishes = SHARED_WISHES.filter(w => 
      w.text.toLowerCase().includes(q) || 
      w.tags?.some(t => t.toLowerCase().includes(q))
    ).slice(0, 3);

    return { memories: filteredMemories, wishes: filteredWishes };
  }, [query]);

  const hasResults = results.memories.length > 0 || results.wishes.length > 0;

  const handleSelect = (path: string) => {
    setIsOpen(false);
    setQuery('');
    navigate(path);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] px-4"
        >
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="w-full max-w-2xl glass-pane bg-white/70 overflow-hidden rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] relative z-10 border border-white/40"
          >
            {/* Search Input Area */}
            <div className="p-6 border-b border-white/20 flex items-center gap-4">
              <Search className="w-6 h-6 text-primary" />
              <input 
                ref={inputRef}
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索契合瞬间、祈愿或足迹..."
                className="flex-1 bg-transparent border-none outline-none text-xl font-medium text-on-surface placeholder:text-outline/50"
              />
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded bg-slate-100 text-[10px] font-bold text-outline uppercase tracking-wider">
                  <Command className="w-3 h-3" /> K
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/50 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-outline" />
                </button>
              </div>
            </div>

            {/* Results Area */}
            <div className="max-h-[60vh] overflow-y-auto p-6 scrollbar-hide">
              {!query && (
                <div className="py-12 flex flex-col items-center justify-center text-center opacity-40">
                  <Sparkles className="w-12 h-12 mb-4 text-primary" />
                  <p className="text-sm font-medium tracking-widest uppercase">请输入关键词以寻找灵魂共鸣</p>
                </div>
              )}

              {query && !hasResults && (
                <div className="py-12 flex flex-col items-center justify-center text-center opacity-40">
                  <p className="text-sm font-medium tracking-widest uppercase">在未知的领域，尚未发现匹配的涟漪</p>
                </div>
              )}

              {hasResults && (
                <div className="space-y-8">
                  {results.memories.length > 0 && (
                    <section>
                      <h3 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-4 pl-2">契合瞬间</h3>
                      <div className="space-y-2">
                        {results.memories.map(m => (
                          <button 
                            key={m.id}
                            onClick={() => handleSelect('/gallery')}
                            className="w-full text-left p-4 rounded-3xl hover:bg-white/60 transition-all flex items-center gap-4 group"
                          >
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                              {m.type === 'image' && <ImageIcon className="w-5 h-5" />}
                              {m.type === 'quote' && <Sparkles className="w-5 h-5" />}
                              {m.type === 'chat' && <MessageCircle className="w-5 h-5" />}
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <h4 className="font-bold text-on-surface truncate">{m.title || m.tag}</h4>
                              <p className="text-sm text-outline truncate">{m.content}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </section>
                  )}

                  {results.wishes.length > 0 && (
                    <section>
                      <h3 className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-4 pl-2">祈愿画廊</h3>
                      <div className="space-y-2">
                        {results.wishes.map(w => (
                          <button 
                            key={w.id}
                            onClick={() => handleSelect('/wish-gallery')}
                            className="w-full text-left p-4 rounded-3xl hover:bg-white/60 transition-all flex items-center gap-4 group"
                          >
                            <div className={cn(
                              "w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform",
                              w.type === 'hope' ? "bg-orange-50 text-orange-400" : "bg-primary-container/20 text-primary"
                            )}>
                              <Heart className="w-5 h-5 fill-current" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <h4 className="font-bold text-on-surface truncate">{w.text}</h4>
                              <p className="text-sm text-outline truncate">{w.tags.join(' · ')} • {w.date}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )}
            </div>

            {/* Footer Tip */}
            <div className="p-4 bg-white/20 border-t border-white/20 text-center">
              <p className="text-[10px] font-medium text-outline/60 uppercase tracking-widest">
                按回车键跳转到完整页面 · 使用 Esc 退出
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
