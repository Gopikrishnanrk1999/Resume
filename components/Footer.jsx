export default function Footer({ name }) {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '28px 0' }}>
      <div
        className="container"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 13,
          color: 'var(--text-faint)',
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        <span>
          © {new Date().getFullYear()} {name}
        </span>
        <span>Built with Next.js &amp; Contentful</span>
      </div>
    </footer>
  );
}
