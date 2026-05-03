import { Search } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function TopNav() {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 h-16 bg-white/40 backdrop-blur-xl border-b border-white/20 shadow-[0_8px_32px_0_rgba(167,166,209,0.1)]">
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-3 cursor-pointer"
      >
        <div className="text-indigo-300">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><circle cx="12" cy="12" r="4"></circle></svg>
        </div>
        <h1 className="text-xl font-semibold text-indigo-400 tracking-widest">灵魂伴侣</h1>
      </motion.div>
      
      <div className="flex items-center gap-4">
        <motion.button 
          whileHover={{ scale: 1.2, rotate: 15 }}
          whileTap={{ scale: 0.8 }}
          id="search-btn" 
          onClick={() => {
            const event = new CustomEvent('soul-search-open', { bubbles: true, cancelable: true });
            window.dispatchEvent(event);
          }}
          className="p-2 text-slate-400 hover:text-indigo-400 transition-colors"
        >
          <Search className="w-5 h-5" />
        </motion.button>
        <motion.div 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/settings')}
          id="user-profile" 
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/50 cursor-pointer transition-all"
        >
          <img 
            alt="用户个人资料" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB67GeIWNvgF80_xU4ZAh2KqjqJvDBxYK2jQAwyfcbpfDXKL09Da-W7Qxao07kMCi4QUXPJ0kWjMzs4lAoPArlAW8_iZmXc53tfGALVLj-Bj1oYYz5_YvCo-5K5jOqMF6gcsrgDF09npcYisZWSd4bDcaU4ovUae8Fd6EPitIhEqrihZau4TtO_qzr4r2UB1U8P4VXCk18G20LEuQgp0JCroQmwJOi5eQjxwZwKwDnkWTP-Oz3czZ8G64LHQ81ONM9b3djIedpw9MY" 
          />
        </motion.div>
      </div>
    </header>
  );
}
