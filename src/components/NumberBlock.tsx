
import React from 'react';
import { motion } from 'framer-motion';

interface NumberBlockProps {
  value: string | number;
  highlighted?: boolean;
  color?: string;
  className?: string;
  draggable?: boolean;
  onDragStart?: () => void;
  onClick?: () => void;
}

const NumberBlock: React.FC<NumberBlockProps> = ({
  value,
  highlighted = false,
  color = 'bg-white',
  className = '',
  draggable = false,
  onDragStart,
  onClick,
}) => {
  return (
    <motion.div
      className={`number-block ${color} ${highlighted ? 'number-block-highlight' : ''} ${
        draggable ? 'draggable' : ''
      } ${className}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={onClick}
    >
      {value}
    </motion.div>
  );
};

export default NumberBlock;
