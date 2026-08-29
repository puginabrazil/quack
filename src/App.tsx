/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cog } from 'lucide-react';
import { playRandomQuackBurst } from './utils/audio';

interface FloatingQuack {
  id: number;
  x: number;
  y: number;
  text: string;
}

export default function App() {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [quackBob, setQuackBob] = useState(false);
  const [floatingQuacks, setFloatingQuacks] = useState<FloatingQuack[]>([]);
  const nextId = useRef(0);

  const triggerQuackAnimation = useCallback((x?: number, y?: number) => {
    setQuackBob(true);
    setTimeout(() => setQuackBob(false), 300);

    if (x !== undefined && y !== undefined) {
      const texts = ['Quack!', 'Quack! 🦆', 'Quaaack!', 'Quack quack!'];
      const text = texts[Math.floor(Math.random() * texts.length)];
      const id = ++nextId.current;
      setFloatingQuacks((prev) => [...prev.slice(-8), { id, x, y, text }]);
      setTimeout(() => {
        setFloatingQuacks((prev) => prev.filter((item) => item.id !== id));
      }, 1200);
    }
  }, []);

  const triggerSoundAndVisual = useCallback((x?: number, y?: number) => {
    playRandomQuackBurst();
    triggerQuackAnimation(x, y);
  }, [triggerQuackAnimation]);

  // Handle mouse movements
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (!cursorVisible) setCursorVisible(true);
    };

    const handleMouseLeave = () => {
      setCursorVisible(false);
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      triggerSoundAndVisual(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cursorVisible, triggerSoundAndVisual]);

  // Random quacks in unpredictable intervals while the site is open
  useEffect(() => {
    let timeoutId: number;

    const scheduleNextQuack = () => {
      const delay = Math.floor(4000 + Math.random() * 8000);
      timeoutId = window.setTimeout(() => {
        playRandomQuackBurst();
        triggerQuackAnimation(
          window.innerWidth * (0.3 + Math.random() * 0.4),
          window.innerHeight * (0.35 + Math.random() * 0.3)
        );
        scheduleNextQuack();
      }, delay);
    };

    scheduleNextQuack();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [triggerQuackAnimation]);

  return (
    <div
      id="maintenance-container"
      className="min-h-screen w-full bg-[#070c12] text-[#E2E8F0] flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden selection:bg-teal-400 selection:text-slate-950 font-sans cursor-none"
      style={{
        background: 'radial-gradient(circle at 50% 45%, #12212b 0%, #0a141b 45%, #050a0e 100%)',
      }}
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-teal-500/10 blur-[140px] rounded-full" />

      {/* Main Center Content */}
      <motion.main
        id="maintenance-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center justify-center text-center z-10 w-full max-w-4xl px-2 select-none"
      >
        {/* Circular Glowing Icon Box with Spinning Gear */}
        <div
          id="maintenance-icon-wrapper"
          className="mb-8 sm:mb-12 relative flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-teal-400/20 blur-2xl rounded-full" />
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border border-teal-500/30 flex items-center justify-center bg-[#0d1c24]/90 backdrop-blur-md relative shadow-[0_0_35px_rgba(20,184,166,0.3)]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
              className="flex items-center justify-center"
            >
              <Cog
                className="w-12 h-12 sm:w-16 sm:h-16 text-[#2dd4bf] stroke-[2] drop-shadow-[0_0_12px_rgba(45,212,191,0.7)]"
                aria-hidden="true"
              />
            </motion.div>
          </div>
        </div>

        {/* AI Studio / Gemini style animated RGB border frame around "Manutenção" */}
        <div className="relative group flex items-center justify-center">
          {/* Animated blurred RGB glow aura */}
          <div
            className="absolute -inset-1 sm:-inset-1.5 rounded-3xl sm:rounded-full animate-rgb-glow blur-xl opacity-60 group-hover:opacity-85 transition-opacity duration-500"
            aria-hidden="true"
          />

          {/* Animated sharp RGB border wrapper */}
          <div className="relative p-[2.5px] rounded-3xl sm:rounded-full animate-rgb-glow shadow-[0_0_30px_rgba(59,130,246,0.25)]">
            {/* Inner dark container */}
            <div className="bg-[#091219]/90 backdrop-blur-xl rounded-[22px] sm:rounded-full px-8 py-3 sm:px-14 sm:py-5 flex items-center justify-center border border-white/10">
              <h1
                id="maintenance-heading"
                className="text-4xl sm:text-7xl md:text-8xl font-black tracking-tight leading-normal py-1 px-2 bg-clip-text text-transparent bg-gradient-to-b from-white via-[#E2E8F0] to-[#8fa0b5] drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] select-none whitespace-nowrap"
              >
                Manutenção
              </h1>
            </div>
          </div>
        </div>
      </motion.main>

      {/* Floating Quack Badges on screen */}
      <AnimatePresence>
        {floatingQuacks.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 0, scale: 0.6 }}
            animate={{ opacity: 1, y: -36, scale: 1 }}
            exit={{ opacity: 0, y: -60, scale: 0.8 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            style={{ left: item.x + 12, top: item.y - 12 }}
            className="pointer-events-none fixed z-50 px-2.5 py-1 rounded-full bg-amber-400/90 text-slate-950 font-bold text-xs shadow-lg backdrop-blur-xs border border-amber-300 flex items-center gap-1 font-mono select-none"
          >
            {item.text}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Custom Duck Cursor */}
      {cursorVisible && (
        <motion.div
          id="custom-duck-cursor"
          className="pointer-events-none fixed z-50 top-0 left-0"
          style={{
            transform: `translate3d(${mousePos.x - 24}px, ${mousePos.y - 18}px, 0)`,
          }}
        >
          <motion.div
            animate={{
              scale: isClicking ? 0.85 : quackBob ? 1.18 : 1,
              rotate: isClicking ? -12 : quackBob ? 8 : 0,
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className="w-14 h-14 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
          >
            <img
              src="/duck.svg"
              alt="Duck Cursor"
              className="w-full h-full object-contain"
              draggable={false}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
