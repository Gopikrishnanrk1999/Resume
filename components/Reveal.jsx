'use client';

import { motion } from 'framer-motion';

// Shared scroll-reveal wrapper: fade + rise into view, once, with an
// optional stagger delay for lists. Keeps motion subtle and consistent
// across the whole site instead of every section rolling its own.
export default function Reveal({
  children,
  delay = 0,
  y = 24,
  duration = 0.6,
  className,
  as: Tag = motion.div,
}) {
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}
