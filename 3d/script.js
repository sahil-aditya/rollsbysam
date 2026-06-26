import React, { useState } from "https://esm.sh/react@19"
import { createRoot } from "https://esm.sh/react-dom@19/client"
import { motion, AnimatePresence } from "https://esm.sh/motion/react"
import { ChevronLeft, ChevronRight } from "https://esm.sh/lucide-react"

const ASSETS = [
  {
    src: 'https://images.unsplash.com/photo-1769921546096-7a648d953a3e?q=80&w=1200&auto=format&fit=crop',
    title: 'urban exploration',
  },
  {
    src: 'https://images.unsplash.com/photo-1777726515600-65be20641e1b?q=80&w=1200&auto=format&fit=crop',
    title: 'night scene',
  },
  {
    src: 'https://images.unsplash.com/photo-1776582929657-9710d9cfa46a?q=80&w=1200&auto=format&fit=crop',
    title: 'yellow wildflowers',
  },
  {
    src: 'https://images.unsplash.com/photo-1776582929656-78ad8b515d75?q=80&w=1200&auto=format&fit=crop',
    title: 'street with mount fuji',
  },
  {
    src: 'https://images.unsplash.com/photo-1775990630948-3c1f696f4ab1?q=80&w=1200&auto=format&fit=crop',
    title: 'bridgestone bicycle shop',
  },
  {
    src: 'https://images.unsplash.com/photo-1775380744191-8fbff371c40b?q=80&w=1200&auto=format&fit=crop',
    title: 'train window view',
  },
  {
    src: 'https://images.unsplash.com/photo-1774775479879-082fd47d41e1?q=80&w=1200&auto=format&fit=crop',
    title: 'train tracks',
  },
  {
    src: 'https://images.unsplash.com/photo-1773544517453-95c148cb42b7?q=80&w=1200&auto=format&fit=crop',
    title: 'lawson convenience store',
  }
];

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ASSETS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? ASSETS.length - 1 : prev - 1));
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      
      {/* Navigation Buttons */}
      <button onClick={handlePrev} className="nav-btn nav-btn-left">
        <ChevronLeft size={28} color="#1a1a1a" />
      </button>

      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={ASSETS[currentIndex].src}
          alt={ASSETS[currentIndex].title}
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{ 
            maxWidth: '85vw', 
            maxHeight: '85vh', 
            objectFit: 'contain', 
            boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
            borderRadius: '4px'
          }}
        />
      </AnimatePresence>

      <button onClick={handleNext} className="nav-btn nav-btn-right">
        <ChevronRight size={28} color="#1a1a1a" />
      </button>

      {/* Image Title */}
      <div style={{ 
        position: 'absolute', 
        bottom: '30px', 
        color: '#1a1a1a', 
        textTransform: 'uppercase', 
        letterSpacing: '2px',
        fontWeight: '500',
        fontSize: '14px'
      }}>
        {ASSETS[currentIndex].title}
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("app"));
root.render(<App />);
                
