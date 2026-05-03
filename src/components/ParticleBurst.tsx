
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  velocity: { x: number; y: number };
}

export default function ParticleBurst() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const triggerBurst = () => {
      const newParticles: Particle[] = [];
      const colors = ['#5b5b81', '#ec4899', '#8b5cf6', '#a7a6d1', '#fbcfe8'];
      
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: Date.now() + i,
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
          size: Math.random() * 6 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          velocity: {
            x: (Math.random() - 0.5) * 20,
            y: (Math.random() - 0.5) * 20
          }
        });
      }
      
      setParticles(prev => [...prev, ...newParticles]);
      
      // Cleanup particles after animation
      setTimeout(() => {
        setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
      }, 1500);
    };

    window.addEventListener('resonance-burst', triggerBurst);
    return () => window.removeEventListener('resonance-burst', triggerBurst);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: p.x, y: p.y, opacity: 1, scale: 1 }}
            animate={{ 
              x: p.x + p.velocity.x * 20, 
              y: p.y + p.velocity.y * 20, 
              opacity: 0,
              scale: 0.2
            }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{
              position: 'absolute',
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              backgroundColor: p.color,
              boxShadow: `0 0 10px ${p.color}`
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
