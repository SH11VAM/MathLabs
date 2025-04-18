
import React from 'react';
import Shape, { ShapeType, ShapeColor, ShapeSize } from '@/components/pattern/shapes/Shape';
import { cn } from '@/lib/utils';

export interface PatternItem {
  type: ShapeType;
  color: ShapeColor;
}

interface PatternProps {
  pattern: PatternItem[];
  size?: ShapeSize;
  showPlaceholder?: boolean;
  className?: string;
  onPlaceholderClick?: () => void;
  highlightIndex?: number;
}

const Pattern: React.FC<PatternProps> = ({
  pattern,
  size = 'md',
  showPlaceholder = false,
  className,
  onPlaceholderClick,
  highlightIndex
}) => {
  return (
    <div className={cn('flex items-center justify-center gap-4', className)}>
      {pattern.map((item, index) => (
        <Shape
          key={index}
          type={item.type}
          color={item.color}
          size={size}
          animate={highlightIndex === index}
          className={highlightIndex === index ? 'ring-4 ring-primary ring-offset-2' : ''}
        />
      ))}
      
      {showPlaceholder && (
        <div 
          className={cn(
            'border-4 border-dashed border-gray-300 rounded-full flex items-center justify-center cursor-pointer transition-all hover:border-primary',
            size === 'sm' ? 'w-8 h-8' : '',
            size === 'md' ? 'w-12 h-12' : '',
            size === 'lg' ? 'w-16 h-16' : '',
            size === 'xl' ? 'w-20 h-20' : '',
          )}
          onClick={onPlaceholderClick}
        >
          <span className="text-2xl text-gray-300">?</span>
        </div>
      )}
    </div>
  );
};

export default Pattern;
