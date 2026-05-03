/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopNav from './components/layout/TopNav';
import BottomNav from './components/layout/BottomNav';
import { motion, AnimatePresence } from 'motion/react';

// Lazy load pages for better performance
import Bond from './pages/Bond';
import Gallery from './pages/Gallery';
import Evolution from './pages/Evolution';
import Settings from './pages/Settings';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import StarryWish from './pages/StarryWish';
import SharedReading from './pages/SharedReading';
import MorningBreath from './pages/MorningBreath';
import WishGallery from './pages/WishGallery';
import BackgroundAmbience from './components/BackgroundAmbience';
import SearchOverlay from './components/SearchOverlay';
import DynamicBackground from './components/DynamicBackground';
import ParticleBurst from './components/ParticleBurst';

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1.02 }}
    transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
    className="min-h-screen"
  >
    {children}
  </motion.div>
);

export default function App() {
  React.useEffect(() => {
    // Apply sensory theme on mount
    const applyTheme = () => {
      const savedSensory = localStorage.getItem('sensory_mode') || 'minimal';
      const root = document.documentElement;
      
      // Remove all theme classes first
      root.classList.remove('theme-minimal', 'theme-colorful', 'theme-balanced', 'theme-deepsea');
      
      // Add the current theme class
      root.classList.add(`theme-${savedSensory}`);
    };

    applyTheme();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'sensory_mode') applyTheme();
    };

    // Listen for theme changes from other tabs
    window.addEventListener('storage', handleStorage);

    // Custom event listener for immediate feedback from Settings page
    window.addEventListener('sensory-theme-changed', applyTheme);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('sensory-theme-changed', applyTheme);
    };
  }, []);

  return (
    <Router>
      <div className="relative min-h-screen transition-colors duration-700">
        <Routes>
          <Route path="/" element={<PageWrapper><Onboarding /></PageWrapper>} />
          <Route 
            path="/*" 
            element={
              <div className="relative min-h-screen">
                <TopNav />
                <main className="pb-32">
                  <AnimatePresence mode="wait">
                    <Routes>
                      <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
                      <Route path="/chat" element={<PageWrapper><Bond /></PageWrapper>} />
                      <Route path="/gallery" element={<PageWrapper><Gallery /></PageWrapper>} />
                      <Route path="/evolution" element={<PageWrapper><Evolution /></PageWrapper>} />
                      <Route path="/settings" element={<PageWrapper><Settings /></PageWrapper>} />
                      <Route path="/wish" element={<PageWrapper><StarryWish /></PageWrapper>} />
                      <Route path="/reading" element={<PageWrapper><SharedReading /></PageWrapper>} />
                      <Route path="/breath" element={<PageWrapper><MorningBreath /></PageWrapper>} />
                      <Route path="/wish-gallery" element={<PageWrapper><WishGallery /></PageWrapper>} />
                    </Routes>
                  </AnimatePresence>
                </main>
                <BackgroundAmbience />
                <BottomNav />
                <SearchOverlay />
                <DynamicBackground />
                <ParticleBurst />
              </div>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}
