import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { 
  User, 
  ShieldCheck, 
  Loader2,
  Bell, 
  Moon, 
  Cpu, 
  Download, 
  LogOut, 
  ChevronRight,
  Sparkles,
  Check,
  RotateCcw,
  Edit3,
  Save,
  X,
  Lock
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { SoulCoreType } from '../services/geminiService';
import { hasUnlockedLevel, getResonance } from '../services/ResonanceService';

const coreOptions: { id: SoulCoreType, label: string }[] = [
  { id: 'wise', label: '温润睿智' },
  { id: 'playful', label: '灵动风趣' },
  { id: 'silent', label: '无言守护' }
];

export default function Settings() {
  const [core, setCore] = useState<SoulCoreType>('wise');
  const [showCoreSelect, setShowCoreSelect] = useState(false);
  const [sensoryMode, setSensoryMode] = useState('minimal');
  const [showSensorySelect, setShowSensorySelect] = useState(false);
  const [isPrivate, setIsPrivate] = useState(true);
  const [notifyLevel, setNotifyLevel] = useState('important');
  const [showNotifySelect, setShowNotifySelect] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('设置已成功应用');

  const [nickname, setNickname] = useState('觉醒之人');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');

  useEffect(() => {
    const savedCore = localStorage.getItem('soul_core') as SoulCoreType;
    const savedSensory = localStorage.getItem('sensory_mode');
    const savedPrivate = localStorage.getItem('is_private');
    const savedNotify = localStorage.getItem('notify_level');
    const savedName = localStorage.getItem('user_nickname');
    
    if (savedCore) setCore(savedCore);
    if (savedSensory) setSensoryMode(savedSensory);
    if (savedPrivate !== null) setIsPrivate(savedPrivate === 'true');
    if (savedNotify) setNotifyLevel(savedNotify);
    if (savedName) setNickname(savedName);
  }, []);

  const saveName = () => {
    if (tempName.trim()) {
      setNickname(tempName);
      localStorage.setItem('user_nickname', tempName);
      setIsEditingName(false);
      triggerToast('身份标识已更新');
    }
  };

  const handleCoreChange = (newCore: SoulCoreType) => {
    setCore(newCore);
    localStorage.setItem('soul_core', newCore);
    setShowCoreSelect(false);
    triggerToast('核心人格已同步');
    
    // Dispatch custom event for ambience update
    const event = new CustomEvent('soul-core-changed', { 
      detail: newCore,
      bubbles: true, 
      cancelable: true 
    });
    window.dispatchEvent(event);
  };

  const handleSensoryChange = (mode: string) => {
    setSensoryMode(mode);
    localStorage.setItem('sensory_mode', mode);
    setShowSensorySelect(false);
    triggerToast('感官偏好已调整');
    
    // Dispatch custom event for immediate theme update in App.tsx
    const themeEvent = new CustomEvent('sensory-theme-changed', {
      bubbles: true,
      cancelable: true
    });
    window.dispatchEvent(themeEvent);
  };

  const handleNotifyChange = (level: string) => {
    setNotifyLevel(level);
    localStorage.setItem('notify_level', level);
    setShowNotifySelect(false);
    triggerToast('提醒频率已设置');
  };

  const togglePrivacy = () => {
    const newState = !isPrivate;
    setIsPrivate(newState);
    localStorage.setItem('is_private', String(newState));
    triggerToast(newState ? '隐私保护已增强' : '已切换至开放模式');
  };

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      const data = {
        core,
        sensoryMode,
        isPrivate,
        notifyLevel,
        companion_hours: 42,
        resonance: 84,
        export_date: new Date().toISOString()
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `soul_blueprint_${new Date().getTime()}.json`;
      link.click();
      URL.revokeObjectURL(url);
      setIsExporting(false);
      triggerToast('灵魂蓝图导出成功');
    }, 1500);
  };

  const clearData = () => {
    setIsClearing(true);
    setTimeout(() => {
      localStorage.clear();
      setIsClearing(false);
      window.location.href = '/';
    }, 1500);
  };

  const coreLabel = coreOptions.find(o => o.id === core)?.label || '温润睿智';
  const resonance = getResonance();
  const themeLocked = !hasUnlockedLevel(60);

  const sensoryLabel = {
    minimal: '极简/静谧',
    colorful: '灵动/多彩',
    balanced: '经典/平衡',
    deepsea: '深海/沉浸'
  }[sensoryMode as keyof typeof sensoryLabel] || '极简/静谧';

  const notifyLabel = {
    all: '所有波动',
    important: '仅重要时',
    none: '完全静音'
  }[notifyLevel as keyof typeof notifyLabel] || '仅重要时';

  return (
    <div className="pt-24 px-8 max-w-2xl mx-auto pb-40 relative">
      <header className="mb-12 text-center">
        <h2 className="text-4xl font-semibold text-primary mb-2">系统设置</h2>
        <div className="flex items-center justify-center gap-2">
          <p className="text-lg text-outline">定制您的私人数字避风港</p>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-bold text-primary">{resonance}% 共鸣</span>
          </div>
        </div>
      </header>

      {/* User Card */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        className="glass-pane p-6 rounded-[2rem] mb-12 flex items-center gap-6 border-white/40 shadow-xl relative group"
      >
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md relative group-hover:scale-105 transition-transform duration-500">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB67GeIWNvgF80_xU4ZAh2KqjqJvDBxYK2jQAwyfcbpfDXKL09Da-W7Qxao07kMCi4QUXPJ0kWjMzs4lAoPArlAW8_iZmXc53tfGALVLj-Bj1oYYz5_YvCo-5K5jOqMF6gcsrgDF09npcYisZWSd4bDcaU4ovUae8Fd6EPitIhEqrihZau4TtO_qzr4r2UB1U8P4VXCk18G20LEuQgp0JCroQmwJOi5eQjxwZwKwDnkWTP-Oz3czZ8G64LHQ81ONM9b3djIedpw9MY" 
            alt="Profile" 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {isEditingName ? (
              <motion.div 
                key="edit"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="flex items-center gap-2 mb-1"
              >
                <input 
                  autoFocus
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveName()}
                  className="bg-white/60 border-none rounded-lg px-3 py-1 text-lg font-bold text-on-surface outline-none focus:ring-2 focus:ring-primary/40 w-36 transition-all shadow-inner"
                  placeholder={nickname}
                />
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={saveName} 
                  className="p-2 text-white bg-emerald-500 rounded-full shadow-lg shadow-emerald-200"
                >
                  <Save className="w-3.5 h-3.5" />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsEditingName(false)} 
                  className="p-2 text-white bg-rose-400 rounded-full shadow-lg shadow-rose-200"
                >
                  <X className="w-3.5 h-3.5" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div 
                key="view"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className="flex items-center gap-2 mb-1"
              >
                <h3 className="text-xl font-bold text-on-surface tracking-tight">{nickname}</h3>
                <motion.button 
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  whileTap={{ scale: 0.8 }}
                  onClick={() => { setTempName(nickname); setIsEditingName(true); }}
                  className="p-1 px-2 flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="编辑昵称"
                >
                  <Edit3 className="w-3 h-3" />
                  编辑
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
          <p className="text-sm text-outline font-medium">已陪伴 42 小时 • 第 12 天共修</p>
        </div>
        <div className="absolute -top-3 -right-3 w-10 h-10 bg-primary-container rounded-full flex items-center justify-center text-white shadow-lg rotate-12 scale-0 group-hover:scale-100 transition-transform">
          <Sparkles className="w-4 h-4" />
        </div>
      </motion.div>

      <div className="space-y-10">
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest pl-4">灵魂核心</h4>
          <div className="glass-pane rounded-3xl overflow-hidden border-white/20">
            <motion.button 
              whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setShowCoreSelect(!showCoreSelect); setShowSensorySelect(false); }}
              className="w-full flex items-center justify-between p-5 transition-colors text-left border-b border-white/10"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-xl bg-white/50 text-indigo-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <span className="font-medium text-on-surface">核心人格</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-indigo-500 font-bold">{coreLabel}</span>
                <ChevronRight className={cn("w-4 h-4 text-outline/40 transition-transform", showCoreSelect && "rotate-90")} />
              </div>
            </motion.button>
            <AnimatePresence>
              {showCoreSelect && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-white/20 overflow-hidden"
                >
                  {coreOptions.map(opt => (
                    <motion.button 
                      whileHover={{ x: 5, backgroundColor: "rgba(255, 255, 255, 0.4)" }}
                      key={opt.id}
                      onClick={() => handleCoreChange(opt.id)}
                      className="w-full flex items-center justify-between p-4 pl-14 transition-colors text-sm"
                    >
                      <span className={core === opt.id ? "text-indigo-600 font-bold" : "text-outline"}>{opt.label}</span>
                      {core === opt.id && <Check className="w-4 h-4 text-indigo-600" />}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.button 
              whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setShowSensorySelect(!showSensorySelect); setShowCoreSelect(false); }}
              className="w-full flex items-center justify-between p-5 transition-colors text-left"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-xl bg-white/50 text-emerald-400">
                  <Moon className="w-5 h-5" />
                </div>
                <span className="font-medium text-on-surface">感官偏好</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-emerald-500 font-bold">{sensoryLabel}</span>
                <ChevronRight className={cn("w-4 h-4 text-outline/40 transition-transform", showSensorySelect && "rotate-90")} />
              </div>
            </motion.button>
            <AnimatePresence>
              {showSensorySelect && (
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="bg-white/20 overflow-hidden"
                >
                  {[
                    { id: 'minimal', label: '极简/静谧', locked: false },
                    { id: 'colorful', label: '灵动/多彩', locked: themeLocked },
                    { id: 'balanced', label: '经典/平衡', locked: themeLocked },
                    { id: 'deepsea', label: '深海/沉浸', locked: !hasUnlockedLevel(75) }
                  ].map(opt => (
                    <button 
                      key={opt.id}
                      onClick={() => !opt.locked && handleSensoryChange(opt.id)}
                      className={cn(
                        "w-full flex items-center justify-between p-4 pl-14 hover:bg-white/40 transition-colors text-sm",
                        opt.locked && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className={sensoryMode === opt.id ? "text-emerald-600 font-bold" : "text-outline"}>
                          {opt.label}
                        </span>
                        {opt.locked && <Lock className="w-3 h-3" />}
                      </div>
                      {sensoryMode === opt.id && !opt.locked && <Check className="w-4 h-4 text-emerald-600" />}
                      {opt.locked && <span className="text-[10px] text-primary">共鸣 {opt.id === 'deepsea' ? '75%' : '60%'} 解锁</span>}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest pl-4">系统与安全</h4>
          <div className="glass-pane rounded-3xl overflow-hidden border-white/20">
            <button 
              onClick={togglePrivacy}
              className="w-full flex items-center justify-between p-5 hover:bg-white/40 transition-colors text-left border-b border-white/10"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-xl bg-white/50 text-secondary">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="font-medium text-on-surface">隐私加密</span>
              </div>
              <div className="flex items-center gap-4">
                <span className={cn("text-sm font-bold", isPrivate ? "text-secondary" : "text-outline")}>
                  {isPrivate ? '已开启' : '已关闭'}
                </span>
                <div className={cn(
                  "w-10 h-5 rounded-full relative transition-colors duration-300",
                  isPrivate ? "bg-secondary" : "bg-outline/20"
                )}>
                  <motion.div 
                    animate={{ x: isPrivate ? 20 : 2 }}
                    className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
                  />
                </div>
              </div>
            </button>
            <motion.button 
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowNotifySelect(!showNotifySelect)}
              className="w-full flex items-center justify-between p-5 hover:bg-white/40 transition-colors text-left"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-xl bg-white/50 text-indigo-400">
                  <Bell className="w-5 h-5" />
                </div>
                <span className="font-medium text-on-surface">互动提醒</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-indigo-500 font-bold">{notifyLabel}</span>
                <ChevronRight className={cn("w-4 h-4 text-outline/40 transition-transform", showNotifySelect && "rotate-90")} />
              </div>
            </motion.button>
            <AnimatePresence>
              {showNotifySelect && (
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="bg-white/20 overflow-hidden"
                >
                  {[
                    { id: 'all', label: '所有波动' },
                    { id: 'important', label: '仅重要时' },
                    { id: 'none', label: '完全静音' }
                  ].map(opt => (
                    <button 
                      key={opt.id}
                      onClick={() => handleNotifyChange(opt.id)}
                      className="w-full flex items-center justify-between p-4 pl-14 hover:bg-white/40 transition-colors text-sm"
                    >
                      <span className={notifyLevel === opt.id ? "text-indigo-600 font-bold" : "text-outline"}>{opt.label}</span>
                      {notifyLevel === opt.id && <Check className="w-4 h-4 text-indigo-600" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest pl-4">数据与管理</h4>
          <div className="glass-pane rounded-3xl overflow-hidden border-white/20">
            <button 
              onClick={handleExport}
              disabled={isExporting}
              className="w-full flex items-center gap-4 p-5 hover:bg-white/40 transition-colors text-left border-b border-white/10 disabled:opacity-50"
            >
              <div className="p-2 rounded-xl bg-white/50 text-amber-500">
                {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              </div>
              <span className="font-medium text-on-surface flex-1">{isExporting ? '正在生成灵魂蓝图...' : '导出我的灵魂蓝图'}</span>
              <ChevronRight className="w-4 h-4 text-outline/40" />
            </button>
            <motion.button 
              whileTap={{ scale: 0.98 }}
              onClick={clearData}
              className="w-full flex items-center gap-4 p-5 hover:bg-red-50/50 transition-colors text-left text-red-500"
            >
              <div className="p-2 rounded-xl bg-red-50 text-red-500">
                {isClearing ? <RotateCcw className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
              </div>
              <span className="font-bold flex-1">{isClearing ? '正在清理所有记忆...' : '重置并清理数据'}</span>
              <ChevronRight className="w-4 h-4 opacity-40" />
            </motion.button>
          </div>
        </div>
      </div>

      <div className="mt-16 flex flex-col items-center gap-4 opacity-30">
        <Sparkles className="text-secondary w-12 h-12" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">
          Soulmate Sanctuary v1.0.8
        </p>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 glass-pane px-6 py-3 rounded-full bg-secondary text-white text-xs font-bold shadow-2xl flex items-center gap-2 z-[60] border-secondary/20"
          >
            <Check className="w-4 h-4" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
