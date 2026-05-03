import { Heart, Image as ImageIcon, TrendingUp, Settings, Orbit } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'motion/react';

const navItems = [
  { icon: Heart, label: '契合', path: '/dashboard', id: 'nav-bond' },
  { icon: ImageIcon, label: '画廊', path: '/gallery', id: 'nav-gallery' },
  { icon: TrendingUp, label: '进化', path: '/evolution', id: 'nav-evolution' },
  { icon: Settings, label: '设置', path: '/settings', id: 'nav-settings' },
];

const MotionLink = motion(Link);

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-10 pt-4 bg-white/40 backdrop-blur-2xl border-t border-white/30 shadow-[0_-10px_40px_rgba(167,166,209,0.15)] rounded-t-[32px]">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <MotionLink
            key={item.path}
            to={item.path}
            id={item.id}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            className={cn(
              "flex flex-col items-center justify-center px-6 py-2 transition-all duration-500 rounded-full",
              isActive ? "bg-indigo-50/50 text-indigo-600 scale-105 shadow-sm" : "text-slate-400"
            )}
          >
            <item.icon className={cn("w-6 h-6 mb-1", isActive && "fill-current")} />
            <span className="text-[10px] font-semibold uppercase tracking-tighter">{item.label}</span>
          </MotionLink>
        );
      })}
    </nav>
  );
}
