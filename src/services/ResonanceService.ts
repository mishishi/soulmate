
export const RESONANCE_KEY = 'soul_resonance';

export const getResonance = (): number => {
  const saved = localStorage.getItem(RESONANCE_KEY);
  return saved ? parseInt(saved) : 15; // Start with 15
};

export const updateResonance = (increment: number): number => {
  const current = getResonance();
  const next = Math.min(100, current + increment);
  localStorage.setItem(RESONANCE_KEY, next.toString());
  return next;
};

export const hasUnlockedLevel = (level: number): boolean => {
  return getResonance() >= level;
};
