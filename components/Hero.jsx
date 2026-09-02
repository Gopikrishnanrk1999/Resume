'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './Hero.module.css';

export default function Hero({ settings }) {
  const { name, role, summaryText, profileImageUrl, cvUrl, email, availabilityStatus, availabilityText } = settings;

  return (
    <section id="top" className={styles.hero}>
      <div className={styles.glow} />
      <div className={styles.glow2} />
      <div className="container">
        <div className={styles.grid}>
          <div>
            <motion.div
              className={styles.eyebrow}
              data-status={availabilityStatus}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <span className={styles.dot} />
              {availabilityText}
            </motion.div>

            <motion.h1
              className={styles.name}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
            >
              {name}
            </motion.h1>

            <motion.p
              className={styles.role}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
            >
              {role}
            </motion.p>

            <motion.p
              className={styles.summary}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.26 }}
            >
              {summaryText}
            </motion.p>

            <motion.div
              className={styles.actions}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.34 }}
            >
              <a href="#work" className="btn btn-primary">
                View Work
              </a>
              <a href={`mailto:${email}`} className="btn btn-ghost">
                Get in Touch
              </a>
            </motion.div>
          </div>

          <motion.div
            className={styles.portrait}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            <div className={styles.ring}>
              <div className={styles.ringInner}>
                {profileImageUrl ? (
                  <Image
                    src={profileImageUrl}
                    alt={name}
                    width={320}
                    height={320}
                    priority
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : null}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className={styles.scrollHint}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span>Scroll</span>
        <span className={styles.scrollLine} />
      </motion.div>
    </section>
  );
}
