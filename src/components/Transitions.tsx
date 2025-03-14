
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type FadeProps = {
  children: React.ReactNode;
  key?: string | number;
  duration?: number;
  delay?: number;
  className?: string;
};

export const FadeIn: React.FC<FadeProps> = ({
  children,
  key,
  duration = 0.3,
  delay = 0,
  className = '',
}) => {
  return (
    <motion.div
      key={key}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration, delay, ease: 'easeInOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const SlideUp: React.FC<FadeProps> = ({
  children,
  key,
  duration = 0.3,
  delay = 0,
  className = '',
}) => {
  return (
    <motion.div
      key={key}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const SlideIn: React.FC<FadeProps & { direction?: 'left' | 'right' }> = ({
  children,
  key,
  duration = 0.3,
  delay = 0,
  direction = 'right',
  className = '',
}) => {
  return (
    <motion.div
      key={key}
      initial={{ opacity: 0, x: direction === 'right' ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: direction === 'right' ? 20 : -20 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

type StaggerContainerProps = {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
};

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  staggerDelay = 0.05,
  className = '',
}) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { ease: 'easeOut' } },
      }}
    >
      {children}
    </motion.div>
  );
};

export const PageTransition: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <AnimatePresence mode="wait">
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  </AnimatePresence>
);
