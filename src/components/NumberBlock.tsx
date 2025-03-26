
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';

interface NumberBlockProps {
  value: string | number;
  highlighted?: boolean;
  color?: string;
  className?: string;
  draggable?: boolean;
  editable?: boolean;
  onChange?: (value: string) => void;
  onDragStart?: () => void;
  onClick?: () => void;
}

const NumberBlock: React.FC<NumberBlockProps> = ({
  value,
  highlighted = false,
  color = 'bg-white',
  className = '',
  draggable = false,
  editable = false,
  onChange,
  onDragStart,
  onClick,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const handleDoubleClick = () => {
    if (editable) {
      setIsEditing(true);
    }
  };
  
  const handleBlur = () => {
    setIsEditing(false);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
    }
  };
  
  return (
    <motion.div
      className={`number-block ${color} ${highlighted ? 'number-block-highlight' : ''} ${
        draggable ? 'draggable' : ''
      } ${className} ${editable ? 'cursor-text' : ''}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      whileHover={{ scale: editable ? 1 : 1.05 }}
      whileTap={{ scale: editable ? 1 : 0.95 }}
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={onClick}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <Input
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full h-full p-0 text-center border-none focus:ring-0"
          autoFocus
        />
      ) : (
        value
      )}
    </motion.div>
  );
};

export default NumberBlock;
