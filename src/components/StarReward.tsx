
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface StarRewardProps {
  show: boolean;
  count?: number;
}

const StarReward: React.FC<StarRewardProps> = ({ show, count = 3 }) => {
  const [stars, setStars] = useState<{ id: number; x: number; y: number; delay: number; size: number }[]>([]);
  
  useEffect(() => {
    if (show) {
      const newStars = Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100 - 50, // Random position within -50px to 50px from center
        y: Math.random() * -100, // Random position above
        delay: Math.random() * 0.3,
        size: Math.random() * 0.5 + 0.7, // Random size between 0.7 and 1.2
      }));
      setStars(newStars);
      
      // Play a success sound
      const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-bonus-earned-in-game-2058.mp3');
      audio.volume = 0.5;
      audio.play().catch(err => console.error('Audio play failed:', err));
    } else {
      setStars([]);
    }
  }, [show, count]);
  
  return (
    <div className="pointer-events-none fixed inset-0 flex items-center justify-center z-50">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute"
          initial={{ 
            x: 0, 
            y: 0, 
            scale: 0,
            rotate: 0
          }}
          animate={{ 
            x: star.x,
            y: star.y,
            scale: star.size,
            rotate: 360
          }}
          transition={{ 
            duration: 1.5, 
            delay: star.delay,
            type: 'spring',
            stiffness: 100
          }}
        >
          <Star className="h-12 w-12 text-mathYellow fill-mathYellow" strokeWidth={1} />
        </motion.div>
      ))}
    </div>
  );
};

export default StarReward;
