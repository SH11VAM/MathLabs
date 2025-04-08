
import React, { useEffect, useState } from 'react';

interface FireworkProps {
  show: boolean;
}

const FireworkAnimation: React.FC<FireworkProps> = ({ show }) => {
  const [fireworks, setFireworks] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  
  useEffect(() => {
    if (!show) {
      setFireworks([]);
      return;
    }
    
    // Create initial fireworks
    createFireworks(5);
    
    // Continue creating fireworks for 5 seconds
    const interval = setInterval(() => {
      createFireworks(2);
    }, 700);
    
    // Stop after 5 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 5000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [show]);
  
  const createFireworks = (count: number) => {
    const newFireworks = [...fireworks];
    
    for (let i = 0; i < count; i++) {
      const x = Math.random() * 90 + 5; // 5-95% of container width
      const y = Math.random() * 60 + 5; // 5-65% of container height
      const colors = ['#FF5252', '#FFD740', '#64FFDA', '#448AFF', '#E040FB', '#FF6E40'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      newFireworks.push({
        id: Date.now() + i,
        x,
        y,
        color
      });
    }
    
    setFireworks(newFireworks);
    
    // Remove fireworks after animation
    setTimeout(() => {
      setFireworks(currentFireworks => 
        currentFireworks.filter(fw => !newFireworks.find(nfw => nfw.id === fw.id))
      );
    }, 1000);
  };
  
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {fireworks.map(firework => (
        <div 
          key={firework.id}
          className="absolute animate-scale-up"
          style={{
            left: `${firework.x}%`,
            top: `${firework.y}%`,
            transition: 'all 0.5s ease-out'
          }}
        >
          <div className="relative">
            {/* Firework burst */}
            {[...Array(8)].map((_, i) => (
              <div 
                key={i}
                className="absolute h-1 w-12 opacity-0 animate-fade-in"
                style={{
                  background: firework.color,
                  transformOrigin: 'left center',
                  transform: `rotate(${i * 45}deg)`,
                  animation: 'fade-in 0.2s ease-out forwards, scale-out 0.8s ease-out forwards',
                  animationDelay: '0s, 0.2s'
                }}
              />
            ))}
            
            {/* Center glow */}
            <div 
              className="absolute h-3 w-3 rounded-full animate-fade-out"
              style={{
                background: 'white',
                boxShadow: `0 0 10px 5px ${firework.color}`,
                left: '-4px',
                top: '-4px'
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FireworkAnimation;
