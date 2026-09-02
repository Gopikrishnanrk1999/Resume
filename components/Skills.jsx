'use client';

import { motion } from 'framer-motion';
import styles from './Skills.module.css';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 16, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export default function Skills({ skills }) {
  return (
    <section id="skills" className="section">
      <div className="container">
        <div className="section-label">Skills</div>
        <h2 className="section-title">Tools I reach for.</h2>

        <motion.div
          className={styles.list}
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          {skills.map((skill) => (
            <motion.span key={skill} className="pill" variants={item}>
              {skill}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
