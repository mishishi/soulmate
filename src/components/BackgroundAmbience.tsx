
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { hasUnlockedLevel } from '../services/ResonanceService';

const AMBIENCE_URLS = {
  zen: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Placeholder, in real app would use meditation tracks
  nature: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
};

export default function BackgroundAmbience() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setIsUnlocked(hasUnlockedLevel(60));
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) {
      audioRef.current = document.createElement('audio');
      audioRef.current.src = AMBIENCE_URLS.zen;
      audioRef.current.loop = true;
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  if (!isUnlocked) return null;

  return (
    <div className="fixed bottom-32 right-8 z-40">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={togglePlay}
        className="w-12 h-12 glass-pane rounded-full flex items-center justify-center text-primary shadow-lg border-primary/20"
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="playing"
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 45 }}
            >
              <Volume2 className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="paused"
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 45 }}
            >
              <VolumeX className="w-5 h-5 opacity-40" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {isPlaying && (
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-primary/20 rounded-full"
          />
        )}
      </motion.button>
    </div>
  );
}
