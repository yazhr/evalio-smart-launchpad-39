
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const Hero: React.FC = () => {
  // Ref for animated text
  const textRef = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    const words = ["faster", "smarter", "better", "deeper", "easier"];
    let currentIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const textElement = textRef.current;
    
    if (!textElement) return;

    const typeEffect = () => {
      const currentWord = words[currentIndex];
      
      if (isDeleting) {
        // Deleting text
        textElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        
        if (charIndex === 0) {
          isDeleting = false;
          currentIndex = (currentIndex + 1) % words.length;
          // Pause before typing next word
          setTimeout(typeEffect, 500);
          return;
        }
      } else {
        // Typing text
        textElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        
        if (charIndex === currentWord.length) {
          isDeleting = true;
          // Pause before deleting
          setTimeout(typeEffect, 1500);
          return;
        }
      }
      
      // Speed: faster when deleting
      const speed = isDeleting ? 80 : 150;
      setTimeout(typeEffect, speed);
    };
    
    setTimeout(typeEffect, 1000);
    
    return () => {
      // Clean up any timers if needed
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-center max-w-3xl mx-auto mb-8 relative z-10"
    >
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-glow">
        Study <span ref={textRef} className="text-gradient"></span>
      </h2>
      <p className="text-xl md:text-2xl text-foreground/80 mb-8 leading-relaxed">
        Advanced AI-powered learning platform designed to maximize your study efficiency and comprehension
      </p>
      <div className="flex flex-wrap gap-3 justify-center mb-2">
        <div className="flex items-center gap-2 bg-white/5 rounded-full py-1 px-3">
          <span className="w-2 h-2 rounded-full bg-evalio-blue-bright"></span>
          <span className="text-sm text-foreground/70">Personalized Learning</span>
        </div>
        <div className="flex items-center gap-2 bg-white/5 rounded-full py-1 px-3">
          <span className="w-2 h-2 rounded-full bg-evalio-purple-vivid"></span>
          <span className="text-sm text-foreground/70">Real-time Feedback</span>
        </div>
        <div className="flex items-center gap-2 bg-white/5 rounded-full py-1 px-3">
          <span className="w-2 h-2 rounded-full bg-evalio-purple"></span>
          <span className="text-sm text-foreground/70">AI-Powered Insights</span>
        </div>
      </div>
    </motion.div>
  );
};

export default Hero;
