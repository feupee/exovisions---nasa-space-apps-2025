"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface AnimatedFlipCardProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
}

const AnimatedFlipCard: React.FC<AnimatedFlipCardProps> = ({
  frontContent,
  backContent,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="w-80 h-96 cursor-pointer" 
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        className="w-full h-full relative"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden">
          {frontContent}
        </div>
        
        {/* Back */}
        <div className="absolute inset-0 backface-hidden" style={{ transform: "rotateY(180deg)" }}>
          {backContent}
        </div>
      </motion.div>
    </div>
  );
};

export default AnimatedFlipCard;