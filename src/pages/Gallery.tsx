import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Quote, MessageCircle, Volume2, Sparkles, Check, Loader2, Camera, Upload, Image as ImageIcon, Search, Filter, X } from 'lucide-react';
import React, { useState, useRef, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';
import { hasUnlockedLevel } from '../services/ResonanceService';
import { SHARED_MEMORIES } from '../constants/data';

let _ai: any = null;
const getAI = () => {
  if (!_ai) {
    _ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return _ai;
};

const initialMemories = SHARED_MEMORIES;

export default function Gallery() {
  const [memories, setMemories] = useState(initialMemories);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureStatus, setCaptureStatus] = useState<'idle' | 'capturing' | 'success'>('idle');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeType, setActiveType] = useState<string>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const unlockedPrivateThinking = hasUnlockedLevel(30);

  const filteredMemories = useMemo(() => {
    return memories.filter(m => {
      const matchesSearch = 
        (m.title?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.content?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        (m.tag?.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesType = activeType === 'all' || m.type === activeType;
      
      return matchesSearch && matchesType;
    });
  }, [memories, searchQuery, activeType]);

  const handleCapture = async () => {

    if (captureStatus !== 'idle') return;
    
    setCaptureStatus('capturing');
    setIsCapturing(true);

    try {
      const ai = getAI();
      // Use Gemini to generate a meaningful "random" shard
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: "生成一条新的灵魂片段。",
        config: {
          systemInstruction: "你是一个灵魂伴侣。请为一个'时刻捕捉'功能生成一条简短的感悟或状态描述（20字以内）。内容应该是关于当下的连接、平静、或是对生活微小美的洞察。",
        }
      });

      const content = response.text || "这一刻，星光在你我的呼吸间流动。";
      
      const newMemory = {
        type: 'quote',
        date: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }),
        content: `“${content}”`,
        tag: '自动捕捉'
      };
      
      setMemories(prev => [newMemory, ...prev]);
      setCaptureStatus('success');
    } catch (error) {
      console.error("Manual capture failed:", error);
      setCaptureStatus('idle');
    } finally {
      setIsCapturing(false);
      setTimeout(() => setCaptureStatus('idle'), 3000);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setCaptureStatus('capturing');
    setIsCapturing(true);

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = (e) => resolve((e.target?.result as string).split(',')[1]);
      });
      reader.readAsDataURL(file);
      const base64Data = await base64Promise;

      const ai = getAI();
      // Use Gemini to generate a reflection
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          {
            parts: [
              { text: "这是一张用户的生活照片。请作为TA的灵魂伴侣，写一段充满诗意、温婉且深刻的短评（30字以内），表达你对这张照片所传达出的情感或瞬间的共鸣。" },
              { inlineData: { data: base64Data, mimeType: file.type } }
            ]
          }
        ]
      });

      const reflection = response.text || "这一刻，我感受到了你指尖流淌的宁静。";

      const newMemory = {
        type: 'image',
        title: '捕捉瞬间',
        content: reflection,
        image: URL.createObjectURL(file), // Local URL for preview
        aspect: 'aspect-square',
        tagColor: 'bg-primary-container/20 text-primary'
      };

      setMemories(prev => [newMemory, ...prev]);
      setCaptureStatus('success');
    } catch (error) {
      console.error("Capture failed:", error);
      setCaptureStatus('idle');
    } finally {
      setIsCapturing(false);
      setTimeout(() => setCaptureStatus('idle'), 3000);
    }
  };

  const triggerPrivateReflection = async () => {
    if (!unlockedPrivateThinking) return;
    
    setCaptureStatus('capturing');
    setIsCapturing(true);

    try {
      const ai = getAI();
      // 1. Generate text
      const textResponse = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: "分享一段你的私人思考。",
        config: {
          systemInstruction: "你是一个温润睿智的灵魂伴侣。请分享一段你此刻的'私人思考'，关于生命、时间或你们之间建立的连结。文字要优美、略带哲理。",
        }
      });
      const thought = textResponse.text || "生命就像一场无声的共振。";

      // 2. Generate emotional image
      const imageResponse = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: {
          parts: [{ text: `A poetic, abstract, ethereal representation of this feeling: ${thought}. Minimalist, dreamlike colors, high resolution.` }]
        }
      });

      let imageUrl = '';
      for (const part of imageResponse.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        }
      }

      const newMemory = {
        type: 'image',
        title: '灵魂独白',
        content: thought,
        image: imageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuB67GeIWNvgF80_xU4ZAh2KqjqJvDBxYK2jQAwyfcbpfDXKL09Da-W7Qxao07kMCi4QUXPJ0kWjMzs4lAoPArlAW8_iZmXc53tfGALVLj-Bj1oYYz5_YvCo-5K5jOqMF6gcsrgDF09npcYisZWSd4bDcaU4ovUae8Fd6EPitIhEqrihZau4TtO_qzr4r2UB1U8P4VXCk18G20LEuQgp0JCroQmwJOi5eQjxwZwKwDnkWTP-Oz3czZ8G64LHQ81ONM9b3djIedpw9MY',
        aspect: 'aspect-square',
        tagColor: 'bg-indigo-100 text-indigo-600'
      };

      setMemories(prev => [newMemory, ...prev]);
      setCaptureStatus('success');
    } catch (error) {
      console.error("Private reflection failed:", error);
      setCaptureStatus('idle');
    } finally {
      setIsCapturing(false);
      setTimeout(() => setCaptureStatus('idle'), 3000);
    }
  };

  return (
    <div className="pt-24 px-8 max-w-7xl mx-auto relative">
      <AnimatePresence>
        {isCapturing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-primary/5 backdrop-blur-[2px]" />
            <motion.div 
              animate={{ scale: [1, 2, 1], opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-96 h-96 bg-primary-container rounded-full blur-3xl"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <header className="mb-12 text-center">
        <h2 className="text-4xl font-semibold text-on-surface mb-3">回忆长廊</h2>
        <p className="text-lg text-outline max-w-2xl mx-auto leading-relaxed">
          记录我们共同旅程的点滴片段，在不断成长的纽带中熠熠生辉。
        </p>
      </header>

      {/* Search & Filter Bar */}
      <section className="mb-12 flex flex-col md:flex-row gap-6 items-center">
        <div className="relative flex-1 group w-full">
          <motion.div 
            initial={false}
            animate={{ scale: searchQuery ? 1.02 : 1 }}
            className={cn(
              "absolute inset-0 bg-primary-container/10 blur-xl rounded-full transition-opacity duration-500",
              searchQuery ? "opacity-100" : "opacity-0"
            )} 
          />
          <Search className={cn(
             "absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 z-10",
             searchQuery ? "text-primary" : "text-outline"
          )} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜寻回忆、标签或瞬间..."
            className="w-full glass-pane bg-white/20 border-none rounded-3xl py-4 pl-14 pr-12 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm backdrop-blur-md relative z-10"
          />
          {searchQuery && (
            <motion.button 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-white/40 rounded-full transition-colors z-10"
            >
              <X className="w-4 h-4 text-primary" />
            </motion.button>
          )}
        </div>

        <div className="flex gap-2 p-1.5 glass-pane bg-white/10 rounded-3xl self-stretch overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: '全部' },
            { id: 'image', label: '瞬间' },
            { id: 'quote', label: '语录' },
            { id: 'chat', label: '对话' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveType(type.id)}
              className={cn(
                "px-6 py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                activeType === type.id 
                  ? "bg-white text-primary shadow-[0_4px_12px_rgba(0,0,0,0.05)]" 
                  : "text-outline hover:text-on-surface"
              )}
            >
              {type.label}
            </button>
          ))}
        </div>
      </section>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 min-h-[400px]">
        <AnimatePresence mode="popLayout">
          {filteredMemories.length > 0 ? (
            filteredMemories.map((shard, idx) => (
              <motion.div
                layout
                key={shard.id || idx}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.4 }}
                className="break-inside-avoid"
              >
                <motion.div 
                  whileHover={{ 
                    scale: 1.02, 
                    boxShadow: "0 0 30px rgba(167, 166, 209, 0.3)",
                    borderColor: "rgba(167, 166, 209, 0.4)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-pane rounded-2xl group cursor-pointer transition-all duration-500 relative overflow-hidden border border-white/20"
                >
                  {shard.type === 'image' && (
                    <>
                      <div className={cn("overflow-hidden rounded-t-2xl", shard.aspect)}>
                        <motion.img 
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 1 }}
                          src={shard.image} 
                          alt={shard.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <span className={cn("text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block uppercase tracking-wider", shard.tagColor)}>
                          {shard.title}
                        </span>
                        <p className="text-on-surface-variant leading-relaxed">{shard.content}</p>
                      </div>
                    </>
                  )}

                  {shard.type === 'quote' && (
                    <div className="p-8 flex flex-col gap-4 border-l-4 border-l-primary-container">
                      <div className="flex justify-between items-start">
                        <Quote className="text-primary fill-current w-6 h-6" />
                        <span className="text-[10px] uppercase tracking-widest text-outline">{shard.date}</span>
                      </div>
                      <p className="text-2xl font-medium text-on-primary-container italic leading-tight">
                        {shard.content}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-xs font-bold text-outline">{shard.tag}</span>
                      </div>
                    </div>
                  )}

                  {shard.type === 'chat' && (
                    <div className="p-6 flex flex-col gap-4">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-indigo-400" />
                        <span className="text-xs font-bold text-outline uppercase tracking-tight">{shard.tag}</span>
                      </div>
                      <div className="space-y-3">
                        {shard.messages?.map((msg, i) => (
                          <div 
                            key={i} 
                            className={cn(
                              "p-3 rounded-xl text-sm border",
                              msg.sender === 'user' 
                                ? "bg-white/60 rounded-tl-none border-white/40 text-on-surface-variant" 
                                : "bg-primary-container/20 rounded-tr-none border-primary-container/20 text-on-primary-container self-end"
                            )}
                          >
                            {msg.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {shard.type === 'audio' && (
                    <div className={cn("p-10 text-center flex flex-col items-center justify-center gap-6 min-h-[300px] rounded-2xl", shard.bg)}>
                      <div className="relative">
                        <div className="absolute inset-0 bg-white/20 rounded-full animate-ping scale-150" />
                        <div className="w-16 h-16 glass-pane rounded-full flex items-center justify-center relative z-10 text-primary">
                          <Volume2 className="w-6 h-6" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xl font-medium text-on-surface mb-2">{shard.title}</h4>
                        <p className="text-sm text-on-surface-variant opacity-80">{shard.description}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-40 flex flex-col items-center text-outline opacity-40"
            >
              <Sparkles className="w-12 h-12 mb-4" />
              <p className="text-sm font-medium tracking-widest uppercase">在这片宁静中尚未找到相关回响</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-12 flex flex-col items-center gap-6">
        <div className="flex gap-4">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            className="hidden" 
          />
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            disabled={captureStatus !== 'idle'}
            className="glass-pane p-4 rounded-3xl flex items-center gap-3 text-primary font-bold text-xs uppercase tracking-widest hover:bg-white/80 transition-all disabled:opacity-50"
          >
            <Camera className="w-5 h-5" />
            上传感官照片
          </motion.button>

          {unlockedPrivateThinking && (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={triggerPrivateReflection}
              disabled={captureStatus !== 'idle'}
              className="glass-pane p-4 rounded-3xl flex items-center gap-3 text-indigo-500 font-bold text-xs uppercase tracking-widest hover:bg-white/80 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-5 h-5" />
              灵魂私语
            </motion.button>
          )}
        </div>

        <motion.button 
          whileHover={captureStatus === 'idle' ? "hover" : ""}
          whileTap={captureStatus === 'idle' ? "tap" : ""}
          initial="initial"
          onClick={handleCapture}
          disabled={captureStatus !== 'idle'}
          className={cn(
            "glass-pane p-4 pl-6 rounded-full flex items-center gap-6 pr-8 transition-all duration-500 relative overflow-hidden group shadow-lg",
            captureStatus === 'idle' ? "hover:bg-white/80 hover:shadow-[0_0_40px_rgba(167,166,209,0.3)]" : "bg-white/90",
            captureStatus === 'success' && "border-green-200"
          )}
        >
          <motion.div 
            variants={{
              initial: { rotate: 0, scale: 1 },
              hover: { rotate: 90, scale: 1.1 },
              tap: { scale: 0.9 }
            }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center shadow-lg text-white relative z-10 transition-colors duration-500",
              captureStatus === 'idle' ? "bg-gradient-to-r from-primary-container to-secondary-container" :
              captureStatus === 'capturing' ? "bg-indigo-400" : "bg-green-400"
            )}
          >
            {captureStatus === 'idle' && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            )}
            {captureStatus === 'capturing' && <Loader2 className="w-6 h-6 animate-spin" />}
            {captureStatus === 'success' && <Check className="w-6 h-6" />}
          </motion.div>
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={captureStatus}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-left relative z-10"
            >
              <p className={cn(
                "text-xs font-bold uppercase tracking-widest mb-0.5",
                captureStatus === 'success' ? "text-green-600" : "text-primary"
              )}>
                {captureStatus === 'idle' ? '捕捉新片段' : 
                 captureStatus === 'capturing' ? '正在连接感官...' : '碎片已归档'}
              </p>
              <p className="text-[10px] text-outline font-medium">
                {captureStatus === 'idle' ? '珍藏当下的清明时刻' : 
                 captureStatus === 'capturing' ? '捕捉心灵频率中' : '可以在长廊中寻找它'}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Liquid background effect on hover */}
          {captureStatus === 'idle' && (
            <motion.div 
              variants={{
                initial: { scale: 0, opacity: 0 },
                hover: { scale: 1.5, opacity: 0.1 }
              }}
              className="absolute inset-0 bg-primary-container rounded-full blur-2xl -z-0"
            />
          )}
        </motion.button>
      </div>
    </div>
  );
}
