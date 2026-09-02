import Reveal from './Reveal';
import styles from './About.module.css';

const EXPERIENCE_START = new Date('2022-07-01');

function getYearsExperience() {
  const now = new Date();
  let years = now.getFullYear() - EXPERIENCE_START.getFullYear();
  const beforeAnniversary =
    now.getMonth() < EXPERIENCE_START.getMonth() ||
    (now.getMonth() === EXPERIENCE_START.getMonth() && now.getDate() < EXPERIENCE_START.getDate());
  if (beforeAnniversary) years -= 1;
  return years;
}

export default function About({ summaryText }) {
  const yearsExperience = getYearsExperience();

  return (
    <section id="about" className="section">
      <div className="container">
        <Reveal as="div">
          <div className="section-label">About</div>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="section-title">A little about my work.</h2>
        </Reveal>

        <div className={styles.about}>
          <Reveal delay={0.1}>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statNum}>{yearsExperience}+</span>
                <span className={styles.statLabel}>Years experience</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>6+</span>
                <span className={styles.statLabel}>Shipped projects</span>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <p className={styles.text}>{summaryText}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
