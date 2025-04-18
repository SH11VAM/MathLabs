
import React from 'react';
import { cn } from '@/lib/utils';

export type ShapeType = 'circle' | 'square' | 'triangle' | 'diamond';
export type ShapeColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange';
export type ShapeSize = 'sm' | 'md' | 'lg' | 'xl';

interface ShapeProps {
  type: ShapeType;
  color: ShapeColor;
  size?: ShapeSize;
  animate?: boolean;
  className?: string;
  onClick?: () => void;
}

const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-20 h-20'
};

const Shape: React.FC<ShapeProps> = ({ 
  type, 
  color, 
  size = 'md',
  animate = false,
  className,
  onClick
}) => {
  return (
    <div 
      className={cn(
        'shape',
        `shape-${type}`,
        `shape-${color}`,
        sizeMap[size],
        animate && 'animate-bounce-light',
        className
      )}
      onClick={onClick}
    />
  );
};

export default Shape;
