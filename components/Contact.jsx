import Reveal from './Reveal';
import styles from './Contact.module.css';

export default function Contact({ settings }) {
  const { email, linkedinUrl, cvUrl, contactSubtitle } = settings;

  return (
    <section id="contact" className={`section ${styles.contact}`}>
      <div className="container">
        <Reveal as="div">
          <div className="section-label" style={{ justifyContent: 'center' }}>
            Contact
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className={styles.title}>{"Let's connect"}</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className={styles.sub}>{contactSubtitle}</p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className={styles.actions}>
            <a href={`mailto:${email}`} className="btn btn-primary">
              Send an Email
            </a>
            <a href={linkedinUrl} target="_blank" rel="noreferrer" className="btn btn-ghost">
              LinkedIn
            </a>
            <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              View Resume
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
