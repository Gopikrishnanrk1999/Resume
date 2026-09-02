import Image from 'next/image';
import Reveal from './Reveal';
import styles from './Projects.module.css';

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7 17L17 7M17 7H8M17 7V16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Projects({ projects }) {
  return (
    <section id="work" className="section">
      <div className="container">
        <div className="section-label">Work</div>
        <h2 className="section-title">Selected projects.</h2>

        <div className={styles.grid}>
          {projects.map((project, i) => {
            const CardTag = project.url ? 'a' : 'div';
            const cardProps = project.url
              ? { href: project.url, target: '_blank', rel: 'noreferrer' }
              : {};

            return (
              <Reveal key={project.title} delay={(i % 2) * 0.08} y={32}>
                <CardTag className={styles.card} {...cardProps}>
                  <div className={styles.imageWrap}>
                    {project.imageUrl ? (
                      <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        sizes="(max-width: 760px) 100vw, 50vw"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : null}
                  </div>
                  <div className={styles.body}>
                    <div className={styles.titleRow}>
                      <h3 className={styles.title}>{project.title}</h3>
                      {project.url ? (
                        <span className={styles.linkIcon}>
                          <ArrowIcon />
                        </span>
                      ) : null}
                    </div>
                    <p className={styles.desc}>{project.description}</p>
                    <div className={styles.tags}>
                      {project.technologies.map((tech) => (
                        <span key={tech} className={styles.tag}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardTag>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
