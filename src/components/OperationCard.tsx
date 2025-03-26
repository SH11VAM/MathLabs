
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface OperationCardProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  operation: string;
  delay: number;
}

const OperationCard: React.FC<OperationCardProps> = ({ 
  title, 
  icon, 
  color, 
  operation,
  delay 
}) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/operation/${operation}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className={`math-btn flex flex-col items-center justify-center gap-3 p-6 ${color} cursor-pointer`}
      onClick={handleClick}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="text-white text-4xl">{icon}</div>
      <h3 className="text-white font-bold text-xl font-display">{title}</h3>
    </motion.div>
  );
};

export default OperationCard;
