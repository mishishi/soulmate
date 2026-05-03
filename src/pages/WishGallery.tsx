import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Heart, Sun, Search, Filter, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { SHARED_WISHES } from '../constants/data';

const allWishes = SHARED_WISHES;

export default function WishGallery() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'hope' | 'bless'>('all');

  const filteredWishes = useMemo(() => {
    return allWishes.filter(wish => {
      const matchesSearch = wish.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          wish.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = activeFilter === 'all' || wish.type === activeFilter;
      return matchesSearch && matchesType;
    });
  }, [searchQuery, activeFilter]);

  return (
    <div className="pt-24 px-8 max-w-4xl mx-auto pb-40 min-h-screen">
      <header className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            id="back-btn"
            className="w-12 h-12 rounded-full glass-pane flex items-center justify-center text-primary-container hover:bg-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
          <div>
            <h2 className="text-3xl font-semibold text-primary">祈愿画廊</h2>
            <p className="text-on-surface-variant text-sm">珍藏每一颗闪耀的种子</p>
          </div>
        </div>
        <div className="flex gap-2">
          {['all', 'hope', 'bless'].map((f) => (
            <motion.button
              key={f}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(f as any)}
              id={`filter-${f}`}
              className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                activeFilter === f ? 'bg-primary text-white shadow-lg' : 'glass-pane text-outline hover:bg-white/60'
              }`}
            >
              {f === 'all' ? '全部' : f === 'hope' ? '希冀' : '祝福'}
            </motion.button>
          ))}
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            id="search-btn"
            onClick={() => document.getElementById('search-input')?.focus()}
            className="w-10 h-10 rounded-full glass-pane flex items-center justify-center text-primary hover:bg-white transition-colors"
          >
            <Search className="w-4 h-4" />
          </motion.button>
        </div>
      </header>

      {/* Filter & Search */}
      <section className="flex gap-4 mb-10">
        <div className="flex-1 relative">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${searchQuery ? 'text-primary' : 'text-outline'}`} />
          <input 
            type="text" 
            id="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜寻记忆或标签..."
            className="w-full bg-surface-container-low border-none rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
          />
          {searchQuery && (
            <motion.button 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-primary bg-white/40 px-2 py-1 rounded-lg backdrop-blur-md"
            >
              清除
            </motion.button>
          )}
        </div>
      </section>

      {/* Wish List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredWishes.length > 0 ? (
            filteredWishes.map((wish, idx) => (
              <motion.div 
                layout
                key={wish.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 20px rgba(167, 166, 209, 0.2)"
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="glass-pane p-6 rounded-[2rem] flex flex-col justify-between transition-all group border border-white/20 hover:border-primary/30"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    {wish.type === 'hope' ? (
                      <div className="p-2 rounded-xl bg-orange-50 text-orange-400">
                        <Heart className="w-4 h-4 fill-current" />
                      </div>
                    ) : (
                      <div className="p-2 rounded-xl bg-primary-container/20 text-primary">
                        <Sun className="w-4 h-4 fill-current" />
                      </div>
                    )}
                    <span className="text-[10px] font-bold text-outline uppercase tracking-wider">{wish.date}</span>
                  </div>
                  <div className="flex gap-1">
                    {wish.tags?.map(tag => (
                       <span key={tag} className="text-[8px] font-bold bg-surface-container-highest px-2 py-0.5 rounded-full text-outline">{tag}</span>
                    ))}
                  </div>
                </div>

                <p className="text-on-surface leading-relaxed mb-6 font-medium">
                  {wish.text}
                </p>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-bold text-outline uppercase tracking-widest px-1">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-primary/60" />
                      绽放进度
                    </span>
                    <span className="text-primary">{wish.progress}%</span>
                  </div>
                  <div className="relative h-2.5 w-full bg-white/30 rounded-full border border-white/20 p-[2px] shadow-inner overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${wish.progress}%` }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 + idx * 0.1 }}
                      className="relative h-full rounded-full bg-gradient-to-r from-primary via-indigo-400 to-secondary overflow-hidden"
                    >
                      {/* Animated inner pattern */}
                      <motion.div 
                        animate={{ x: [0, 100], opacity: [0, 0.5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-20"
                      />
                    </motion.div>
                    
                    {/* Glowing tip indicator */}
                    <motion.div 
                      initial={{ left: 0 }}
                      animate={{ left: `${wish.progress}%` }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 + idx * 0.1 }}
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
                    >
                      <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,1),0_0_4px_rgba(167,166,209,0.8)] border border-primary/20 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-20 flex flex-col items-center text-outline opacity-40"
            >
              <Sparkles className="w-12 h-12 mb-4" />
              <p className="text-sm font-medium">没能在星尘中找到相关足迹</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
